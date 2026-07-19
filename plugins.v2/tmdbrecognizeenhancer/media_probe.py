"""整理前媒体流探测：使用 ffprobe 为命名上下文补充真实技术信息。"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import threading
from collections import OrderedDict
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple


class MediaFileProbe:
    """低开销、可缓存的 ffprobe 适配器。"""

    MP_FIELDS = {
        "videoFormat", "videoCodec", "videoBit", "audioCodec", "effect", "fps",
    }
    CONTEXT_FIELDS = (
        ("probe_video_codec", "扫描视频编码", "ffprobe 检测到的主视频流编码。"),
        ("probe_video_bit", "扫描视频位深", "ffprobe 检测到的主视频流位深，例如 10bit。"),
        ("probe_video_format", "扫描分辨率", "根据实际宽高归一化的分辨率，例如 1080P。"),
        ("probe_effect", "扫描画面特效", "从流色彩传递和侧数据识别的 DOVI、HDR10+、HDR10、HLG 或 SDR。"),
        ("probe_fps", "扫描帧率", "主视频流的实际帧率。"),
        ("probe_audio_codec", "扫描主音频编码", "默认音轨或首条音轨的编码。"),
        ("probe_audio_codecs", "全部音频编码", "容器内所有音轨编码，使用顿号连接并去重。"),
        ("probe_audio_languages", "音轨语言", "容器内音轨语言，使用顿号连接并去重。"),
        ("probe_subtitle_languages", "内封字幕语言", "从字幕流 language 与 title 标签推断的语言。"),
        ("probe_subtitle_profile", "内封字幕组合", "便于命名的组合，例如“简日内封”“简繁日内封”。"),
        ("probe_subtitle_count", "内封字幕数量", "容器中的字幕流数量。"),
        ("probe_video_width", "视频宽度", "主视频流像素宽度。"),
        ("probe_video_height", "视频高度", "主视频流像素高度。"),
        ("probe_duration", "媒体时长", "ffprobe 返回的秒数，保留三位小数。"),
    )

    _VIDEO_CODEC = {
        "h264": "H264", "avc": "H264",
        "hevc": "H265", "h265": "H265",
        "av1": "AV1", "vp9": "VP9", "vp8": "VP8",
        "mpeg2video": "MPEG2", "mpeg4": "MPEG4",
        "avs2": "AVS2", "avs3": "AVS3", "vc1": "VC1",
    }
    _AUDIO_CODEC = {
        "aac": "AAC", "ac3": "AC3", "eac3": "DDP",
        "truehd": "TrueHD", "dts": "DTS", "flac": "FLAC",
        "opus": "Opus", "vorbis": "Vorbis", "mp3": "MP3",
        "alac": "ALAC",
    }
    _LANGUAGE = {
        "chi": "中文", "zho": "中文", "zh": "中文", "cmn": "中文",
        "jpn": "日语", "ja": "日语",
        "eng": "英语", "en": "英语",
        "kor": "韩语", "ko": "韩语",
    }
    _LANGUAGE_ORDER = {"简体": 0, "繁体": 1, "中文": 2, "日语": 3, "英语": 4, "韩语": 5}
    _PROFILE_TOKEN = {"简体": "简", "繁体": "繁", "中文": "中", "日语": "日", "英语": "英", "韩语": "韩"}

    def __init__(self, cache_size: int = 128) -> None:
        self._lock = threading.RLock()
        self._cache: "OrderedDict[Tuple[str, int, int], Dict[str, Any]]" = OrderedDict()
        self._cache_size = max(8, int(cache_size))
        self._scans = 0
        self._cache_hits = 0
        self._errors = 0
        self._last_error = ""

    @staticmethod
    def _safe_int(value: Any) -> int:
        try:
            return int(value or 0)
        except (TypeError, ValueError):
            return 0

    @staticmethod
    def _safe_float(value: Any) -> float:
        try:
            return float(value or 0)
        except (TypeError, ValueError):
            return 0.0

    @classmethod
    def _codec(cls, value: Any, mapping: Dict[str, str]) -> str:
        raw = str(value or "").strip().lower()
        if not raw:
            return ""
        if raw.startswith("pcm_"):
            return "LPCM"
        return mapping.get(raw, raw.upper())

    @classmethod
    def _language(cls, stream: Dict[str, Any]) -> str:
        tags = stream.get("tags") or {}
        language = str(tags.get("language") or "").strip().lower()
        title = str(tags.get("title") or "").strip()
        source = f"{language} {title}".lower()
        if re.search(r"(?:简体|简中|简体中文|\bchs\b|zh[-_]?cn|simplified)", source, re.IGNORECASE):
            return "简体"
        if re.search(r"(?:繁体|繁中|繁體|正體|\bcht\b|zh[-_]?tw|traditional)", source, re.IGNORECASE):
            return "繁体"
        if re.search(r"(?:日语|日文|日本語|\bjpn\b|\bja\b)", source, re.IGNORECASE):
            return "日语"
        if re.search(r"(?:英语|英文|\beng\b|\ben\b)", source, re.IGNORECASE):
            return "英语"
        return cls._LANGUAGE.get(language, language.upper() if language and language != "und" else "")

    @classmethod
    def _unique(cls, values: Iterable[str], language: bool = False) -> List[str]:
        output = list(dict.fromkeys(value for value in values if value))
        if language:
            output.sort(key=lambda value: (cls._LANGUAGE_ORDER.get(value, 99), value))
        return output

    @staticmethod
    def _default_stream(streams: List[Dict[str, Any]]) -> Dict[str, Any]:
        return next(
            (stream for stream in streams if (stream.get("disposition") or {}).get("default") == 1),
            streams[0] if streams else {},
        )

    @staticmethod
    def _resolution(width: int, height: int) -> str:
        if width >= 7600 or height >= 4000:
            return "4320P"
        if width >= 3800 or height >= 2100:
            return "2160P"
        if width >= 2500 or height >= 1400:
            return "1440P"
        if width >= 1800 or height >= 1000:
            return "1080P"
        if width >= 1200 or height >= 700:
            return "720P"
        if height >= 560:
            return "576P"
        if height >= 450:
            return "480P"
        return f"{height}P" if height else ""

    @classmethod
    def _video_bit(cls, stream: Dict[str, Any]) -> str:
        bits = cls._safe_int(stream.get("bits_per_raw_sample") or stream.get("bits_per_sample"))
        if not bits:
            match = re.search(r"p(\d{2})(?:le|be)?$", str(stream.get("pix_fmt") or ""), re.IGNORECASE)
            bits = cls._safe_int(match.group(1)) if match else 0
        if not bits:
            match = re.search(r"(?:^|\D)(8|10|12)[- ]?bit", str(stream.get("profile") or ""), re.IGNORECASE)
            bits = cls._safe_int(match.group(1)) if match else 0
        return f"{bits}bit" if bits else ""

    @staticmethod
    def _effect(stream: Dict[str, Any]) -> str:
        side_data = " ".join(
            str(item.get("side_data_type") or "") + " " + json.dumps(item, ensure_ascii=False)
            for item in stream.get("side_data_list") or [] if isinstance(item, dict)
        ).lower()
        transfer = str(stream.get("color_transfer") or "").strip().lower()
        if "dovi" in side_data or "dolby vision" in side_data:
            return "DOVI"
        if "hdr10+" in side_data or "dynamic hdr10+" in side_data:
            return "HDR10+"
        if transfer == "arib-std-b67":
            return "HLG"
        if transfer in {"smpte2084", "smpte-st-2084"}:
            return "HDR10"
        if transfer in {"bt709", "bt470bg", "smpte170m", "gamma22", "gamma28"}:
            return "SDR"
        return ""

    @classmethod
    def _fps(cls, stream: Dict[str, Any]) -> Any:
        raw = str(stream.get("avg_frame_rate") or stream.get("r_frame_rate") or "")
        try:
            numerator, denominator = raw.split("/", 1)
            value = float(numerator) / float(denominator)
        except (ValueError, ZeroDivisionError):
            value = cls._safe_float(raw)
        if not value:
            return ""
        rounded = round(value, 3)
        return int(rounded) if float(rounded).is_integer() else rounded

    @classmethod
    def parse_payload(cls, payload: Any) -> Dict[str, Any]:
        """把 ffprobe JSON 转为 MP 字段和额外 Jinja2 上下文。"""
        if not isinstance(payload, dict):
            raise ValueError("ffprobe 返回内容不是 JSON 对象")
        streams = [stream for stream in payload.get("streams") or [] if isinstance(stream, dict)]
        videos = [stream for stream in streams if stream.get("codec_type") == "video"]
        audios = [stream for stream in streams if stream.get("codec_type") == "audio"]
        subtitles = [stream for stream in streams if stream.get("codec_type") == "subtitle"]
        video = cls._default_stream(videos)
        audio = cls._default_stream(audios)
        width = cls._safe_int(video.get("width"))
        height = cls._safe_int(video.get("height"))
        video_codec = cls._codec(video.get("codec_name"), cls._VIDEO_CODEC)
        video_bit = cls._video_bit(video)
        video_format = cls._resolution(width, height)
        effect = cls._effect(video)
        fps = cls._fps(video)
        audio_codec = cls._codec(audio.get("codec_name"), cls._AUDIO_CODEC)
        audio_codecs = cls._unique(cls._codec(item.get("codec_name"), cls._AUDIO_CODEC) for item in audios)
        audio_languages = cls._unique((cls._language(item) for item in audios), language=True)
        subtitle_languages = cls._unique((cls._language(item) for item in subtitles), language=True)
        subtitle_profile = "".join(cls._PROFILE_TOKEN.get(item, item) for item in subtitle_languages)
        if subtitle_profile:
            subtitle_profile += "内封"
        duration = round(cls._safe_float((payload.get("format") or {}).get("duration")), 3)
        fields = {
            "videoCodec": video_codec,
            "videoBit": video_bit,
            "videoFormat": video_format,
            # SDR 对诊断有价值，但 MP 的 effect 通常只用于 HDR/DOVI 等特殊效果；
            # 不把普通 SDR 主动写进用户命名模板。
            "effect": "" if effect == "SDR" else effect,
            "fps": fps,
            "audioCodec": audio_codec,
        }
        context = {
            "probe_video_codec": video_codec,
            "probe_video_bit": video_bit,
            "probe_video_format": video_format,
            "probe_effect": effect,
            "probe_fps": fps,
            "probe_audio_codec": audio_codec,
            "probe_audio_codecs": "、".join(audio_codecs),
            "probe_audio_languages": "、".join(audio_languages),
            "probe_subtitle_languages": "、".join(subtitle_languages),
            "probe_subtitle_profile": subtitle_profile,
            "probe_subtitle_count": len(subtitles),
            "probe_video_width": width,
            "probe_video_height": height,
            "probe_duration": duration or "",
        }
        return {
            "success": bool(streams),
            "fields": {key: value for key, value in fields.items() if value not in (None, "")},
            "context": context,
            "streams": {"video": len(videos), "audio": len(audios), "subtitle": len(subtitles)},
            "reason": "已读取媒体流" if streams else "文件没有可识别的媒体流",
        }

    def capability(self) -> Dict[str, Any]:
        executable = shutil.which("ffprobe")
        with self._lock:
            return {
                "available": bool(executable),
                "executable": executable or "",
                "message": "ffprobe 可用" if executable else "容器中未找到 ffprobe；安装 ffmpeg 后可用",
                "cache_entries": len(self._cache),
                "scans": self._scans,
                "cache_hits": self._cache_hits,
                "errors": self._errors,
                "last_error": self._last_error,
            }

    def probe(self, source_path: Any, timeout: int = 12) -> Dict[str, Any]:
        executable = shutil.which("ffprobe")
        if not executable:
            return {"success": False, "reason": "容器中未找到 ffprobe", "fields": {}, "context": {}}
        path = Path(str(source_path or ""))
        if not str(source_path or "").strip() or not path.is_file():
            return {"success": False, "reason": "源文件在 MoviePilot 容器内不可直接读取", "fields": {}, "context": {}}
        stat = path.stat()
        cache_key = (str(path), int(stat.st_size), int(stat.st_mtime_ns))
        with self._lock:
            cached = self._cache.get(cache_key)
            if cached is not None:
                self._cache.move_to_end(cache_key)
                self._cache_hits += 1
                return deepcopy({**cached, "cached": True})
        try:
            completed = subprocess.run(
                [
                    executable, "-v", "error", "-print_format", "json",
                    "-show_streams", "-show_format", str(path),
                ],
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=max(3, min(30, int(timeout))),
                check=False,
                shell=False,
            )
            if completed.returncode != 0:
                raise RuntimeError((completed.stderr or "ffprobe 执行失败").strip()[-500:])
            result = self.parse_payload(json.loads(completed.stdout or "{}"))
            result.update({"source_path": str(path), "cached": False})
            with self._lock:
                self._scans += 1
                self._last_error = ""
                self._cache[cache_key] = deepcopy(result)
                self._cache.move_to_end(cache_key)
                while len(self._cache) > self._cache_size:
                    self._cache.popitem(last=False)
            return result
        except subprocess.TimeoutExpired:
            reason = f"ffprobe 超过 {max(3, min(30, int(timeout)))} 秒未完成"
        except Exception as err:
            reason = str(err) or err.__class__.__name__
        with self._lock:
            self._errors += 1
            self._last_error = reason
        return {"success": False, "reason": reason, "fields": {}, "context": {}, "source_path": str(path)}

    @classmethod
    def apply_fields(
            cls,
            rename_dict: Dict[str, Any],
            result: Dict[str, Any],
            enabled_fields: Iterable[str],
            policy: str = "fill_empty",
    ) -> List[Dict[str, Any]]:
        """把扫描结果注入命名上下文，并按策略补齐 MP 标准字段。"""
        rename_dict.update(result.get("context") or {})
        selected = cls.MP_FIELDS.intersection(str(item) for item in enabled_fields or [])
        overwrite = str(policy or "fill_empty") == "overwrite"
        changes: List[Dict[str, Any]] = []
        for field in selected:
            value = (result.get("fields") or {}).get(field)
            before = rename_dict.get(field)
            if value in (None, "") or (not overwrite and before not in (None, "", 0)):
                continue
            if before == value:
                continue
            rename_dict[field] = value
            changes.append({"field": field, "before": before, "after": value, "source": "ffprobe"})
        if any(item["field"] in {"resourceType", "effect"} for item in changes):
            rename_dict["edition"] = " ".join(
                str(rename_dict.get(key) or "").strip() for key in ("resourceType", "effect")
                if str(rename_dict.get(key) or "").strip()
            )
        if any(item["field"] in {"resourceType", "effect", "videoFormat"} for item in changes):
            rename_dict["resource_term"] = " ".join(
                str(rename_dict.get(key) or "").strip() for key in ("resourceType", "effect", "videoFormat")
                if str(rename_dict.get(key) or "").strip()
            )
        return changes
