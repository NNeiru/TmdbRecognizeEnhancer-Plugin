"""把 ffprobe 原始输出转换为 Emby 的 MediaSourceInfo 结构。

用于「神医助手（StrmAssistant）Pro」的 POST /Items/SyncMediaInfo 接口：MoviePilot 在
本地整理时用 ffprobe 扫描真实媒体流，转换成 Emby 反序列化时接受的 MediaSourceInfo +
Chapters 结构后推送给神医，由其写入 Emby 数据库，免去 Emby 侧（尤其网盘/strm 场景）
重复探测。

结构与字段依据神医社区版源码 MediaInfoApi.MediaSourceWithChapters 以及 wiki 的持久化
JSON 样例。转换是纯函数，不触碰文件系统与网络，便于离线单测。

注意：DisplayTitle / DisplayLanguage 是 Emby 面向 UI 的展示字段，这里按中文语境尽量还原
神医样例的写法；真正影响直播/转码判定的是 Codec、Width、Height、BitRate、BitDepth、
VideoRange、Profile、Level、Channels、SampleRate 等事实字段，全部来自 ffprobe。
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

TICKS_PER_SECOND = 10_000_000

# ffprobe format_name（可能是逗号分隔的候选集合）到 Emby 容器名的归一
_CONTAINER_BY_FORMAT = {
    "matroska": "mkv", "webm": "webm",
    "mov": "mp4", "mp4": "mp4", "m4a": "m4a", "m4v": "mp4", "3gp": "3gp",
    "mpegts": "ts", "mpeg": "mpeg", "mpegvideo": "mpeg",
    "avi": "avi", "asf": "wmv", "flv": "flv", "ogg": "ogg", "wav": "wav",
    "flac": "flac", "mp3": "mp3",
}

# ISO 639-2/B / 639-1 到 Emby 展示语言名（面向中文 Emby 的常见集合）
_DISPLAY_LANGUAGE = {
    "chi": "Chinese", "zho": "Chinese", "zh": "Chinese", "cmn": "Chinese",
    "jpn": "Japanese", "ja": "Japanese",
    "eng": "English", "en": "English",
    "kor": "Korean", "ko": "Korean",
    "fra": "French", "fre": "French", "fr": "French",
    "deu": "German", "ger": "German", "de": "German",
    "spa": "Spanish", "es": "Spanish",
    "ita": "Italian", "it": "Italian",
    "rus": "Russian", "ru": "Russian",
    "por": "Portuguese", "pt": "Portuguese",
    "tha": "Thai", "th": "Thai",
    "vie": "Vietnamese", "vi": "Vietnamese",
    "ara": "Arabic", "ar": "Arabic",
}

_DEFAULT_MARKER = "默认"


def _safe_int(value: Any) -> Optional[int]:
    try:
        if value in (None, ""):
            return None
        return int(float(value))
    except (TypeError, ValueError):
        return None


def _fraction(value: Any) -> Optional[float]:
    """解析 ffprobe 的分数帧率（如 24000/1001），返回浮点值。"""
    text = str(value or "").strip()
    if not text or text in ("0/0", "0"):
        return None
    try:
        if "/" in text:
            num, den = text.split("/", 1)
            den_value = float(den)
            if den_value == 0:
                return None
            return round(float(num) / den_value, 6)
        return round(float(text), 6)
    except (TypeError, ValueError, ZeroDivisionError):
        return None


def _disposition_flag(stream: Dict[str, Any], key: str) -> bool:
    return (stream.get("disposition") or {}).get(key) == 1


def _display_language(language: str) -> str:
    code = str(language or "").strip().lower()
    return _DISPLAY_LANGUAGE.get(code, code.upper() if code and code != "und" else "")


def _bit_depth(stream: Dict[str, Any]) -> Optional[int]:
    depth = _safe_int(stream.get("bits_per_raw_sample")) or _safe_int(stream.get("bits_per_sample"))
    if depth:
        return depth
    pix = str(stream.get("pix_fmt") or "").lower()
    for candidate in ("12", "10"):
        if f"p{candidate}" in pix:
            return int(candidate)
    if pix:
        return 8
    return None


def _video_range(stream: Dict[str, Any]) -> str:
    """返回 (VideoRange, VideoRangeType)。"""
    side_data = " ".join(
        str(item.get("side_data_type") or "").lower()
        for item in stream.get("side_data_list") or [] if isinstance(item, dict)
    )
    transfer = str(stream.get("color_transfer") or "").strip().lower()
    if "dovi" in side_data or "dolby vision" in side_data:
        return "HDR", "DOVI"
    if "hdr" in side_data and "10+" in side_data or "hdr dynamic" in side_data:
        return "HDR", "HDR10+"
    if transfer == "arib-std-b67":
        return "HDR", "HLG"
    if transfer in ("smpte2084", "smpte-st-2084"):
        return "HDR", "HDR10"
    return "SDR", "SDR"


def _resolution_class(width: int, height: int) -> str:
    if width >= 7600 or height >= 4000:
        return "4320p"
    if width >= 3800 or height >= 2100:
        return "2160p"
    if width >= 2500 or height >= 1400:
        return "1440p"
    if width >= 1800 or height >= 1000:
        return "1080p"
    if width >= 1200 or height >= 700:
        return "720p"
    if height >= 560:
        return "576p"
    if height >= 450:
        return "480p"
    return f"{height}p" if height else ""


def _video_stream(stream: Dict[str, Any]) -> Dict[str, Any]:
    width = _safe_int(stream.get("width")) or 0
    height = _safe_int(stream.get("height")) or 0
    codec = str(stream.get("codec_name") or "").lower()
    is_default = _disposition_flag(stream, "default")
    avg = _fraction(stream.get("avg_frame_rate"))
    real = _fraction(stream.get("r_frame_rate"))
    video_range, video_range_type = _video_range(stream)
    field_order = str(stream.get("field_order") or "").lower()
    parts = [_resolution_class(width, height), codec.upper()]
    display_title = " ".join(part for part in parts if part)
    out: Dict[str, Any] = {
        "Codec": codec,
        "TimeBase": "1/1000",
        "VideoRange": video_range,
        "VideoRangeType": video_range_type,
        "DisplayTitle": display_title,
        "IsInterlaced": bool(field_order) and field_order != "progressive",
        "IsDefault": is_default,
        "IsForced": _disposition_flag(stream, "forced"),
        "Height": height,
        "Width": width,
        "Type": "Video",
        "Index": _safe_int(stream.get("index")) or 0,
        "IsExternal": False,
        "IsTextSubtitleStream": False,
        "SupportsExternalStream": False,
        "Protocol": "File",
    }
    bit_rate = _safe_int(stream.get("bit_rate"))
    if bit_rate:
        out["BitRate"] = bit_rate
    depth = _bit_depth(stream)
    if depth:
        out["BitDepth"] = depth
    if stream.get("profile"):
        out["Profile"] = str(stream.get("profile"))
    level = _safe_int(stream.get("level"))
    if level and level > 0:
        out["Level"] = level
    if stream.get("pix_fmt"):
        out["PixelFormat"] = str(stream.get("pix_fmt"))
    for key, src in (("ColorTransfer", "color_transfer"), ("ColorPrimaries", "color_primaries"), ("ColorSpace", "color_space")):
        if stream.get(src):
            out[key] = str(stream.get(src))
    if avg:
        out["AverageFrameRate"] = avg
    if real:
        out["RealFrameRate"] = real
    if stream.get("display_aspect_ratio"):
        out["AspectRatio"] = str(stream.get("display_aspect_ratio"))
    refs = _safe_int(stream.get("refs"))
    if refs:
        out["RefFrames"] = refs
    return out


def _audio_stream(stream: Dict[str, Any]) -> Dict[str, Any]:
    codec = str(stream.get("codec_name") or "").lower()
    language = str((stream.get("tags") or {}).get("language") or "").strip().lower()
    title = str((stream.get("tags") or {}).get("title") or "").strip()
    is_default = _disposition_flag(stream, "default")
    layout = str(stream.get("channel_layout") or "").strip()
    display_language = _display_language(language)
    pieces = [piece for piece in (display_language, codec.upper(), layout) if piece]
    display_title = " ".join(pieces)
    if title:
        display_title = title if not display_language else display_title
    if is_default and display_title:
        display_title = f"{display_title} ({_DEFAULT_MARKER})"
    out: Dict[str, Any] = {
        "Codec": codec,
        "TimeBase": "1/1000",
        "DisplayTitle": display_title,
        "IsInterlaced": False,
        "IsDefault": is_default,
        "IsForced": _disposition_flag(stream, "forced"),
        "IsHearingImpaired": _disposition_flag(stream, "hearing_impaired"),
        "Type": "Audio",
        "Index": _safe_int(stream.get("index")) or 0,
        "IsExternal": False,
        "IsTextSubtitleStream": False,
        "SupportsExternalStream": False,
        "Protocol": "File",
    }
    if language:
        out["Language"] = language
    if display_language:
        out["DisplayLanguage"] = display_language
    if title:
        out["Title"] = title
    if layout:
        out["ChannelLayout"] = layout
    channels = _safe_int(stream.get("channels"))
    if channels:
        out["Channels"] = channels
    sample_rate = _safe_int(stream.get("sample_rate"))
    if sample_rate:
        out["SampleRate"] = sample_rate
    bit_rate = _safe_int(stream.get("bit_rate"))
    if bit_rate:
        out["BitRate"] = bit_rate
    return out


# ffprobe 字幕 codec 到 Emby 展示名
_SUBTITLE_TEXT_CODECS = {"subrip", "srt", "ass", "ssa", "webvtt", "mov_text", "text"}


def _subtitle_stream(stream: Dict[str, Any]) -> Dict[str, Any]:
    codec = str(stream.get("codec_name") or "").lower()
    language = str((stream.get("tags") or {}).get("language") or "").strip().lower()
    title = str((stream.get("tags") or {}).get("title") or "").strip()
    is_default = _disposition_flag(stream, "default")
    is_text = codec in _SUBTITLE_TEXT_CODECS
    display_language = _display_language(language)
    codec_label = codec.upper()
    inner = f"{_DEFAULT_MARKER} {codec_label}" if is_default else codec_label
    base = title or display_language
    display_title = f"{base} ({inner})" if base else f"({inner})"
    out: Dict[str, Any] = {
        "Codec": codec,
        "TimeBase": "1/1000",
        "DisplayTitle": display_title,
        "IsInterlaced": False,
        "IsDefault": is_default,
        "IsForced": _disposition_flag(stream, "forced"),
        "IsHearingImpaired": _disposition_flag(stream, "hearing_impaired"),
        "Type": "Subtitle",
        "Index": _safe_int(stream.get("index")) or 0,
        "IsExternal": False,
        "IsTextSubtitleStream": is_text,
        "SupportsExternalStream": is_text,
        "Protocol": "File",
        "SubtitleLocationType": "InternalStream",
    }
    if language:
        out["Language"] = language
    if display_language:
        out["DisplayLanguage"] = display_language
    if title:
        out["Title"] = title
    return out


def _container(payload: Dict[str, Any], file_name: str) -> str:
    fmt = str((payload.get("format") or {}).get("format_name") or "").lower()
    for token in fmt.split(","):
        token = token.strip()
        if token in _CONTAINER_BY_FORMAT:
            return _CONTAINER_BY_FORMAT[token]
    ext = file_name.rsplit(".", 1)[-1].lower() if "." in file_name else ""
    return ext or (fmt.split(",")[0].strip() if fmt else "")


def _chapters(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    chapters: List[Dict[str, Any]] = []
    for index, item in enumerate(payload.get("chapters") or []):
        if not isinstance(item, dict):
            continue
        start = _fraction(item.get("start_time"))
        ticks = int(round(start * TICKS_PER_SECOND)) if start is not None else 0
        name = str((item.get("tags") or {}).get("title") or "").strip() or f"章节 {index + 1}"
        chapters.append({
            "StartPositionTicks": ticks,
            "Name": name,
            "MarkerType": "Chapter",
            "ChapterIndex": index,
        })
    return chapters


def build_media_source(
    payload: Any,
    *,
    size: Optional[int] = None,
    file_name: str = "",
    is_remote: bool = True,
) -> Dict[str, Any]:
    """把 ffprobe 原始 JSON 转成单个 MediaSourceWithChapters 字典。

    :param payload: ffprobe -show_streams -show_format -show_chapters 的 JSON 解析结果
    :param size: 文件字节数；缺省时用 format.size。神医要求必须有 Size 和 RunTimeTicks
    :param file_name: 目标文件名（用于 Name 与容器兜底判断）
    :param is_remote: 是否网盘/远程存储；strm/网盘场景为 True
    """
    if not isinstance(payload, dict):
        raise ValueError("ffprobe 返回内容不是 JSON 对象")
    fmt = payload.get("format") or {}
    streams = [s for s in payload.get("streams") or [] if isinstance(s, dict)]
    media_streams: List[Dict[str, Any]] = []
    for stream in streams:
        codec_type = stream.get("codec_type")
        if codec_type == "video":
            # 排除封面/缩略图这类附带图片流（attached_pic）
            if _disposition_flag(stream, "attached_pic"):
                continue
            media_streams.append(_video_stream(stream))
        elif codec_type == "audio":
            media_streams.append(_audio_stream(stream))
        elif codec_type == "subtitle":
            media_streams.append(_subtitle_stream(stream))

    duration = _fraction(fmt.get("duration"))
    run_time_ticks = int(round(duration * TICKS_PER_SECOND)) if duration else None
    resolved_size = size if size is not None else _safe_int(fmt.get("size"))
    bitrate = _safe_int(fmt.get("bit_rate"))
    name = file_name.rsplit(".", 1)[0] if "." in file_name else file_name

    media_source: Dict[str, Any] = {
        "Chapters": [],
        "Protocol": "File",
        "Type": "Default",
        "Container": _container(payload, file_name),
        "Name": name,
        "IsRemote": bool(is_remote),
        "HasMixedProtocols": False,
        "SupportsTranscoding": True,
        "SupportsDirectStream": True,
        "SupportsDirectPlay": True,
        "IsInfiniteStream": False,
        "RequiresOpening": False,
        "RequiresClosing": False,
        "RequiresLooping": False,
        "SupportsProbing": False,
        "MediaStreams": media_streams,
        "Formats": [],
        "RequiredHttpHeaders": {},
        "AddApiKeyToDirectStreamUrl": False,
        "ReadAtNativeFramerate": False,
    }
    if resolved_size is not None:
        media_source["Size"] = resolved_size
    if run_time_ticks is not None:
        media_source["RunTimeTicks"] = run_time_ticks
    if bitrate:
        media_source["Bitrate"] = bitrate

    return {
        "MediaSourceInfo": media_source,
        "Chapters": _chapters(payload),
        "ZeroFingerprintConfidence": False,
    }


def build_sync_payload(payload: Any, **kwargs: Any) -> List[Dict[str, Any]]:
    """神医 SyncMediaInfo 接口的请求体：List<MediaSourceWithChapters>。"""
    return [build_media_source(payload, **kwargs)]


def is_acceptable(media_source_with_chapters: Dict[str, Any]) -> bool:
    """神医接受的最低条件：有 RunTimeTicks 且有 Size（否则会被判为空并拒绝）。"""
    source = (media_source_with_chapters or {}).get("MediaSourceInfo") or {}
    return bool(source.get("RunTimeTicks")) and source.get("Size") not in (None, 0)
