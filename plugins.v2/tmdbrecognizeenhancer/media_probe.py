"""整理前媒体流探测：使用 ffprobe 为命名上下文补充真实技术信息。"""

from __future__ import annotations

import io
import json
import platform as _platform
import re
import shutil
import subprocess
import threading
import zipfile
from collections import OrderedDict
from copy import deepcopy
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, List, Optional, Tuple


class StaticFfprobeProvisioner:
    """从 StrmAssistant.Releases 自动下载支持蓝光 ISO 的静态 ffprobe。

    官方镜像自带的 ffprobe 通常没有 libbluray，无法读取 ISO 原盘的主播放列表；
    该静态构建（sjtuross/StrmAssistant.Releases 的 static-ffprobe 目录）专为
    此场景编译。下载安装到插件数据目录后仅用于 .iso 文件的探测。
    """

    VERSION = "8.1.2"
    _REPO_RAW = "https://raw.githubusercontent.com/sjtuross/StrmAssistant.Releases/main"
    _MAX_ARCHIVE_BYTES = 64 * 1024 * 1024

    def __init__(self, data_dir_getter: Callable[[], Optional[Path]],
                 downloader: Optional[Callable[[str], Optional[bytes]]] = None) -> None:
        self._data_dir_getter = data_dir_getter
        self._downloader = downloader
        self._lock = threading.Lock()
        self._installing = False
        self._last_error = ""

    @staticmethod
    def _platform_slug() -> str:
        system = _platform.system().lower()
        machine = _platform.machine().lower()
        arm = machine in {"aarch64", "arm64"}
        if system == "linux":
            return "linux_arm64" if arm else "linux_x64"
        if system == "darwin":
            return "osx_arm64" if arm else "osx_x64"
        if system == "windows":
            return "win_x64"
        return ""

    def _install_dir(self) -> Optional[Path]:
        base = self._data_dir_getter()
        if not base:
            return None
        return Path(base) / "static-ffprobe" / f"v{self.VERSION}"

    def _binary_path(self) -> Optional[Path]:
        folder = self._install_dir()
        if not folder:
            return None
        name = "ffprobe.exe" if _platform.system().lower() == "windows" else "ffprobe"
        return folder / name

    def installed_path(self) -> str:
        """已安装且可用时返回二进制路径，否则返回空串。"""
        path = self._binary_path()
        return str(path) if path and path.is_file() else ""

    def status(self) -> Dict[str, Any]:
        with self._lock:
            installing = self._installing
            last_error = self._last_error
        return {
            "version": self.VERSION,
            "platform": self._platform_slug() or "unsupported",
            "installed": bool(self.installed_path()),
            "path": self.installed_path(),
            "installing": installing,
            "last_error": last_error,
            "source": f"{self._REPO_RAW}/static-ffprobe",
        }

    def download_url(self) -> str:
        slug = self._platform_slug()
        if not slug:
            return ""
        return f"{self._REPO_RAW}/static-ffprobe/{slug}/ffprobe_{self.VERSION}.zip"

    def _fetch(self, url: str) -> Optional[bytes]:
        if self._downloader:
            return self._downloader(url)
        return None

    def ensure_installed(self, background: bool = True) -> Dict[str, Any]:
        """确保静态 ffprobe 就绪；未安装时触发下载（默认后台执行）。"""
        if self.installed_path():
            return self.status()
        with self._lock:
            if self._installing:
                return self.status()
            self._installing = True
        if background:
            threading.Thread(target=self._install, name="static-ffprobe-install", daemon=True).start()
        else:
            self._install()
        return self.status()

    def _install(self) -> None:
        error = ""
        try:
            url = self.download_url()
            folder = self._install_dir()
            binary = self._binary_path()
            if not url:
                error = f"当前平台不受支持：{_platform.system()} / {_platform.machine()}"
            elif not folder or not binary:
                error = "插件数据目录不可用，无法安装静态 ffprobe"
            else:
                payload = self._fetch(url)
                if not payload:
                    error = "下载失败：网络不可达或 GitHub 访问受限（可在 MP 设置中配置 GITHUB_PROXY）"
                elif len(payload) > self._MAX_ARCHIVE_BYTES:
                    error = "下载内容超出预期大小，已放弃安装"
                else:
                    folder.mkdir(parents=True, exist_ok=True)
                    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
                        member = next(
                            (item for item in archive.namelist()
                             if Path(item).name.lower() in {"ffprobe", "ffprobe.exe"}),
                            None,
                        )
                        if not member:
                            error = "压缩包中没有找到 ffprobe 可执行文件"
                        else:
                            temp_path = folder / (binary.name + ".part")
                            with archive.open(member) as source, open(temp_path, "wb") as target:
                                shutil.copyfileobj(source, target)
                            temp_path.replace(binary)
                            binary.chmod(0o755)
        except Exception as err:  # noqa: BLE001 - 后台线程必须吞掉异常转为状态
            error = str(err) or err.__class__.__name__
        with self._lock:
            self._installing = False
            self._last_error = error


class MediaFileProbe:
    """低开销、可缓存的 ffprobe 适配器。"""

    MP_FIELDS = {
        "videoFormat", "videoCodec", "videoBit", "audioCodec", "effect", "fps",
    }
    SCAN_TARGETS = MP_FIELDS | {"subtitle", "duration"}
    CONTEXT_BY_TARGET = {
        "videoFormat": {"probe_video_format", "probe_video_width", "probe_video_height"},
        "videoCodec": {"probe_video_codec"},
        "videoBit": {"probe_video_bit"},
        "effect": {"probe_effect"},
        "fps": {"probe_fps"},
        "audioCodec": {"probe_audio_codec", "probe_audio_codecs", "probe_audio_languages"},
        "subtitle": {
            "probe_subtitle_languages", "probe_subtitle_titles", "probe_subtitle_track_labels",
            "probe_subtitle_mapped", "probe_subtitle_count",
        },
        "duration": {"probe_duration"},
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
        ("probe_subtitle_languages", "内封字幕语言", "轨道 language 标签对应的语言；标题只用于细分简体/繁体，“简日双语”记为简体。"),
        ("probe_subtitle_titles", "内封字幕标题", "字幕轨原始 title 标签（轨道名），例如“简日双语、繁日雙語”，用于核对识别依据。"),
        ("probe_subtitle_track_labels", "处理后字幕标题", "每条字幕轨归一后的简写标签，例如“简日、繁日”，便于命名引用。"),
        ("probe_subtitle_mapped", "字幕自定义映射", "自定义组合规则命中时为规则结果；未命中时回退为自动语言组合（如“简繁日内封”），写入 customization。"),
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

    # 简繁判定需覆盖字幕组常见写法：简日双语/簡日雙語 这类标题里只出现单字“简/繁”；
    # 日/英/韩允许出现在语言组合词里（简日、日英、中英），但不单独出现时不猜测
    _SIMPLIFIED_HINT = r"(?:简|簡|\bchs\b|\bsc\b|\bgb(?:2312|18030|k)?\b|zh[-_]?(?:cn|sg|hans)|simplified)"
    _TRADITIONAL_HINT = r"(?:繁|正体|正體|\bcht\b|\btc\b|\bbig5\b|zh[-_]?(?:tw|hk|mo|hant)|traditional)"
    _JAPANESE_HINT = r"(?:日语|日文|日本語|\bjpn?\b|\bja\b|(?<=[简簡繁中英])日|日(?=[简簡繁中英双雙语語]))"
    _ENGLISH_HINT = r"(?:英语|英文|english|\beng\b|\ben\b|(?<=[简簡繁中日])英|英(?=[简簡繁中日双雙语語]))"
    _KOREAN_HINT = r"(?:韩语|韓語|korean|\bkor?\b|(?<=[简簡繁中日英])[韩韓]|[韩韓](?=[简簡繁中日英双雙语語]))"
    _GENERIC_CHINESE_HINT = r"(?:(?<=[日英韩韓])中|中(?=[日英韩韓]))"
    _TOKEN_TO_LANGUAGE = {"简": "简体", "繁": "繁体", "中": "中文", "日": "日语", "英": "英语", "韩": "韩语"}

    @classmethod
    def _chinese_variant(cls, source: str) -> str:
        simplified = re.search(cls._SIMPLIFIED_HINT, source, re.IGNORECASE)
        traditional = re.search(cls._TRADITIONAL_HINT, source, re.IGNORECASE)
        if simplified and traditional:
            return "中文"
        if simplified:
            return "简体"
        if traditional:
            return "繁体"
        return ""

    @classmethod
    def _language(cls, stream: Dict[str, Any]) -> str:
        """单条流的单一语言：以 language 标签为准，标题只用于细分简体/繁体。

        “简日双语”这类双语轨的 language 标签是 chi，因此语言记为“简体”，
        标题里的“日”不会进入语言字段（它体现在 track label 里）。
        """
        tags = stream.get("tags") or {}
        language = str(tags.get("language") or "").strip().lower()
        title = str(tags.get("title") or "").strip()
        source = f"{language} {title}".lower()
        base = cls._LANGUAGE.get(language, "")
        if base == "中文":
            return cls._chinese_variant(source) or "中文"
        if base:
            return base
        # language 标签缺失或未知时退回标题判断，仍只取单一语言（中文变体优先）
        variant = cls._chinese_variant(source)
        if variant:
            return variant
        if re.search(cls._JAPANESE_HINT, source, re.IGNORECASE):
            return "日语"
        if re.search(cls._ENGLISH_HINT, source, re.IGNORECASE):
            return "英语"
        if re.search(cls._KOREAN_HINT, source, re.IGNORECASE):
            return "韩语"
        return language.upper() if language and language != "und" else ""

    @classmethod
    def _track_label(cls, stream: Dict[str, Any]) -> str:
        """每条轨的“处理后标题”：综合 language/title 归一成简写标签；双语轨得到组合（如“简日”）。"""
        tags = stream.get("tags") or {}
        language = str(tags.get("language") or "").strip().lower()
        title = str(tags.get("title") or "").strip()
        source = f"{language} {title}".lower()
        atoms = []
        if re.search(cls._SIMPLIFIED_HINT, source, re.IGNORECASE):
            atoms.append("简体")
        if re.search(cls._TRADITIONAL_HINT, source, re.IGNORECASE):
            atoms.append("繁体")
        if not atoms and re.search(cls._GENERIC_CHINESE_HINT, source, re.IGNORECASE):
            atoms.append("中文")
        if re.search(cls._JAPANESE_HINT, source, re.IGNORECASE):
            atoms.append("日语")
        if re.search(cls._ENGLISH_HINT, source, re.IGNORECASE):
            atoms.append("英语")
        if re.search(cls._KOREAN_HINT, source, re.IGNORECASE):
            atoms.append("韩语")
        atoms.sort(key=lambda item: cls._LANGUAGE_ORDER.get(item, 99))
        if len(atoms) >= 2:
            return "".join(cls._PROFILE_TOKEN[item] for item in atoms)
        if atoms:
            return atoms[0]
        return cls._LANGUAGE.get(language, language.upper() if language and language != "und" else "")

    @classmethod
    def _auto_profile(cls, labels: Iterable[str]) -> str:
        """把轨道标签的原子语言并集压缩成命名组合；超过 3 种语言归为多国。"""
        atoms = sorted(
            set().union(*(cls._decompose_label(label) for label in labels)) if labels else set(),
            key=cls._label_sort_key,
        )
        if not atoms:
            return ""
        if len(atoms) > 3:
            return "多国内封"
        if len(atoms) == 1:
            # 单语言用全称更自然：简体内封、日语内封
            return atoms[0] + "内封"
        return "".join(cls._PROFILE_TOKEN.get(item, item) for item in atoms) + "内封"

    @classmethod
    def _decompose_label(cls, label: str) -> set:
        """把“简日”这类组合标签还原成原子语言集合；未知标签原样返回。"""
        if not label:
            return set()
        if label in cls._LANGUAGE_ORDER:
            return {label}
        parts = [cls._TOKEN_TO_LANGUAGE.get(char) for char in label]
        if len(label) >= 2 and all(parts):
            return set(parts)
        return {label}

    @classmethod
    def _label_sort_key(cls, label: str):
        orders = sorted(cls._LANGUAGE_ORDER.get(atom, 99) for atom in cls._decompose_label(label))
        return (orders, label)

    @classmethod
    def _unique(cls, values: Iterable[str], language: bool = False) -> List[str]:
        output = list(dict.fromkeys(value for value in values if value))
        if language:
            output.sort(key=cls._label_sort_key)
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
        subtitle_titles = cls._unique(
            str((item.get("tags") or {}).get("title") or "").strip() for item in subtitles
        )
        # 处理后标题保留每轨的组合信息（简日、繁日），供命名和映射规则使用
        subtitle_track_labels = cls._unique((cls._track_label(item) for item in subtitles), language=True)
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
            "probe_subtitle_titles": "、".join(subtitle_titles),
            "probe_subtitle_track_labels": "、".join(subtitle_track_labels),
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

    @staticmethod
    def _resolve_executable(configured_path: Any = "") -> str:
        configured = str(configured_path or "").strip()
        if configured:
            path = Path(configured)
            if path.is_file():
                return str(path)
            found = shutil.which(configured)
            if found:
                return found
        for candidate in ("ffprobe", "/usr/local/bin/ffprobe", "/usr/bin/ffprobe"):
            found = shutil.which(candidate)
            if found:
                return found
        return ""

    def capability(self, configured_path: Any = "") -> Dict[str, Any]:
        executable = self._resolve_executable(configured_path)
        with self._lock:
            return {
                "available": bool(executable),
                "executable": executable or "",
                "message": (
                    f"ffprobe 可用：{executable}" if executable else
                    "当前 MoviePilot 进程未找到 ffprobe；官方新版 Docker 镜像已内置"
                ),
                "cache_entries": len(self._cache),
                "scans": self._scans,
                "cache_hits": self._cache_hits,
                "errors": self._errors,
                "last_error": self._last_error,
            }

    def clear_cache(self) -> int:
        """清空扫描缓存并返回清除的条数；下次扫描会重新读取文件。"""
        with self._lock:
            cleared = len(self._cache)
            self._cache.clear()
            return cleared

    def cached_result(self, source_path: Any) -> Optional[Dict[str, Any]]:
        """按路径返回最近一次扫描结果，不要求文件仍然存在。

        TransferComplete 发生时移动整理的源文件可能已经消失；命名阶段已完成的预扫
        仍应可供神医联动复用，因此不能再次 stat 源文件才能命中缓存。
        """
        path = str(source_path or "").strip()
        if not path:
            return None
        with self._lock:
            key = next((item for item in reversed(self._cache) if item[0] == path), None)
            if key is None:
                return None
            self._cache.move_to_end(key)
            self._cache_hits += 1
            return deepcopy({**self._cache[key], "cached": True})

    def probe(self, source_path: Any, timeout: int = 12, executable_path: Any = "",
              force: bool = False, iso_executable_path: Any = "") -> Dict[str, Any]:
        path = Path(str(source_path or ""))
        if not str(source_path or "").strip() or not path.is_file():
            return {"success": False, "reason": "源文件在 MoviePilot 容器内不可直接读取", "fields": {}, "context": {}}
        is_iso = path.suffix.lower() == ".iso"
        if is_iso:
            # ISO 原盘只交给带 libbluray 的静态 ffprobe；普通 ffprobe 读不出播放列表
            executable = str(iso_executable_path or "").strip()
            if not executable or not Path(executable).is_file():
                return {
                    "success": False,
                    "reason": "ISO 探测需要带蓝光支持的静态 ffprobe（未安装或正在后台下载）",
                    "fields": {}, "context": {}, "source_path": str(path),
                }
            input_arg = f"bluray:{path}"
            # 原盘要解析播放列表，给静态 ffprobe 更宽的时限
            effective_timeout = max(10, min(120, int(timeout) * 4))
        else:
            executable = self._resolve_executable(executable_path)
            if not executable:
                return {"success": False, "reason": "容器中未找到 ffprobe", "fields": {}, "context": {}}
            input_arg = str(path)
            effective_timeout = max(3, min(30, int(timeout)))
        stat = path.stat()
        cache_key = (str(path), int(stat.st_size), int(stat.st_mtime_ns))
        with self._lock:
            cached = None if force else self._cache.get(cache_key)
            if cached is not None:
                self._cache.move_to_end(cache_key)
                self._cache_hits += 1
                return deepcopy({**cached, "cached": True})
        try:
            completed = subprocess.run(
                [
                    executable, "-v", "error", "-print_format", "json",
                    "-show_streams", "-show_format", "-show_chapters", input_arg,
                ],
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=effective_timeout,
                check=False,
                shell=False,
            )
            if completed.returncode != 0:
                raise RuntimeError((completed.stderr or "ffprobe 执行失败").strip()[-500:])
            raw_payload = json.loads(completed.stdout or "{}")
            result = self.parse_payload(raw_payload)
            # 保留原始 ffprobe 输出供神医联动等下游转换使用；文件大小供 Size 兜底
            result.update({
                "source_path": str(path), "cached": False, "iso": is_iso,
                "raw": raw_payload, "source_size": int(stat.st_size),
            })
            with self._lock:
                self._scans += 1
                self._last_error = ""
                self._cache[cache_key] = deepcopy(result)
                self._cache.move_to_end(cache_key)
                while len(self._cache) > self._cache_size:
                    self._cache.popitem(last=False)
            return result
        except subprocess.TimeoutExpired:
            reason = f"ffprobe 超过 {effective_timeout} 秒未完成"
        except Exception as err:
            reason = str(err) or err.__class__.__name__
        with self._lock:
            self._errors += 1
            self._last_error = reason
        return {"success": False, "reason": reason, "fields": {}, "context": {}, "source_path": str(path)}

    @staticmethod
    def parse_subtitle_rules(value: Any) -> List[Dict[str, Any]]:
        """解析字幕组合规则，按行序首条命中。

        - ``简体+繁体 => 简繁内封``：精确匹配语言集合；
        - ``包含:简体+日语 => 简日内封``（或 ``含:``）：检测集合包含左侧全部语言即命中；
        - ``>=4 => 多国字幕``：检测语言数量达到阈值即命中。
        """
        lines = value.splitlines() if isinstance(value, str) else value if isinstance(value, list) else []
        aliases = {
            "简": "简体", "简中": "简体", "简体中文": "简体", "chs": "简体",
            "繁": "繁体", "繁中": "繁体", "繁體": "繁体", "cht": "繁体",
            "日": "日语", "日文": "日语", "jpn": "日语",
            "英": "英语", "英文": "英语", "eng": "英语",
            "韩": "韩语", "韩文": "韩语", "kor": "韩语",
            "中": "中文",
            "簡日": "简日", "简日双语": "简日", "簡日雙語": "简日",
            "繁日双语": "繁日", "繁日雙語": "繁日",
            "簡繁": "简繁", "简繁双语": "简繁", "簡繁雙語": "简繁",
            "中日双语": "中日", "中日雙語": "中日",
            "簡英": "简英", "简英双语": "简英", "簡英雙語": "简英",
        }
        rules: List[Dict[str, Any]] = []
        for raw in lines:
            match_mode = "exact"
            min_count = 0
            if isinstance(raw, dict):
                languages = raw.get("languages") or []
                output = str(raw.get("value") or "").strip()
                match_mode = str(raw.get("match") or "exact")
                min_count = MediaFileProbe._safe_int(raw.get("min_count"))
            else:
                text = str(raw or "").strip()
                if not text or text.startswith("#") or "=>" not in text:
                    continue
                left, output = text.split("=>", 1)
                left = left.strip()
                output = output.strip()
                languages = []
                threshold = re.match(r"^(?:语言|任意)?\s*(?:>=|≥)\s*(\d+)$", left)
                if threshold:
                    match_mode = "min_count"
                    min_count = int(threshold.group(1))
                else:
                    contains = re.match(r"^包?含[:：]\s*(.*)$", left)
                    if contains:
                        match_mode = "contains"
                        left = contains.group(1)
                    languages = re.split(r"\s*[+,&，、]\s*", left)
            if match_mode == "min_count":
                if min_count >= 1 and output:
                    rules.append({"match": "min_count", "min_count": min_count, "languages": [], "value": output[:120]})
                continue
            canonical = [aliases.get(str(item).strip().lower(), str(item).strip()) for item in languages]
            canonical = sorted(set(item for item in canonical if item), key=lambda item: (MediaFileProbe._LANGUAGE_ORDER.get(item, 99), item))
            if canonical and output:
                rules.append({
                    "match": "contains" if match_mode == "contains" else "exact",
                    "languages": canonical, "value": output[:120],
                })
        return rules

    @classmethod
    def map_subtitles(cls, result: Dict[str, Any], rules: Any) -> str:
        """按用户规则映射字幕组合；没有规则命中时回退到自动语言组合。"""
        context = result.get("context") or {}
        labels = [item for item in str(context.get("probe_subtitle_track_labels") or "").split("、") if item]
        if not labels:
            # 兼容旧缓存结果：track_labels 尚不存在时退回语言字段
            labels = [item for item in str(context.get("probe_subtitle_languages") or "").split("、") if item]
        label_set = set(labels)
        # 规则两侧都同时按组合标签和原子语言并集比较：
        # “简体+繁体+日语”与“简日+繁日”可互相命中，用户不需要关心轨道封装方式
        atom_set = set().union(*(cls._decompose_label(label) for label in labels)) if labels else set()
        for rule in cls.parse_subtitle_rules(rules):
            match_mode = rule.get("match") or "exact"
            if match_mode == "min_count":
                if atom_set and len(atom_set) >= rule.get("min_count", 0):
                    return rule["value"]
                continue
            rule_set = set(rule.get("languages") or [])
            if not rule_set:
                continue
            rule_atoms = set().union(*(cls._decompose_label(label) for label in rule_set))
            if match_mode == "contains":
                if label_set and (rule_set.issubset(label_set | atom_set) or rule_atoms.issubset(atom_set)):
                    return rule["value"]
            elif rule_set == label_set or (atom_set and rule_atoms == atom_set):
                return rule["value"]
        return cls._auto_profile(labels)

    @classmethod
    def apply_fields(
            cls,
            rename_dict: Dict[str, Any],
            result: Dict[str, Any],
            enabled_fields: Iterable[str],
            policy: str = "fill_empty",
            overwrite_fields: Optional[Iterable[str]] = None,
            field_policies: Optional[Dict[str, str]] = None,
            subtitle_rules: Any = None,
            subtitle_to_customization: bool = True,
            customization_separator: str = "@",
    ) -> List[Dict[str, Any]]:
        """把扫描结果注入命名上下文，并按策略补齐 MP 标准字段。"""
        selected_targets = cls.SCAN_TARGETS.intersection(str(item) for item in enabled_fields or [])
        selected = cls.MP_FIELDS.intersection(selected_targets)
        context_keys = set().union(*(cls.CONTEXT_BY_TARGET.get(item, set()) for item in selected_targets))
        source_context = result.get("context") or {}
        rename_dict.update({key: source_context.get(key) for key in context_keys if key in source_context})
        overwrite_all = str(policy or "fill_empty") == "overwrite"
        overwrite_set = {str(item) for item in overwrite_fields or []}
        policies = {
            str(key): str(value)
            for key, value in (field_policies or {}).items()
            if str(value) in {"fill_empty", "overwrite", "append"}
        }
        changes: List[Dict[str, Any]] = []
        for field in selected:
            value = (result.get("fields") or {}).get(field)
            before = rename_dict.get(field)
            field_policy = policies.get(field) or ("overwrite" if overwrite_all or field in overwrite_set else "fill_empty")
            if value in (None, "") or (field_policy == "fill_empty" and before not in (None, "", 0)):
                continue
            after = value
            if field_policy == "append" and before not in (None, "", 0):
                before_text = str(before).strip()
                value_text = str(value).strip()
                parts = before_text.split()
                after = before_text if value_text in parts else f"{before_text} {value_text}"
            if before == after:
                continue
            rename_dict[field] = after
            changes.append({
                "field": field, "before": before, "after": after,
                "source": "ffprobe", "policy": field_policy,
            })
        if "subtitle" in selected_targets:
            mapped = cls.map_subtitles(result, subtitle_rules)
            rename_dict["probe_subtitle_mapped"] = mapped
            if mapped and subtitle_to_customization:
                before = rename_dict.get("customization")
                field_policy = policies.get("subtitle") or (
                    "overwrite" if overwrite_all or "subtitle" in overwrite_set else "fill_empty"
                )
                if field_policy != "fill_empty" or before in (None, "", 0):
                    after = mapped
                    if field_policy == "append" and before not in (None, "", 0):
                        separator = str(customization_separator or "@")
                        before_text = str(before).strip()
                        parts = [part for part in before_text.split(separator) if part]
                        after = before_text if mapped in parts else f"{before_text}{separator}{mapped}"
                    if before != after:
                        rename_dict["customization"] = after
                        changes.append({
                            "field": "customization", "before": before, "after": after,
                            "source": "ffprobe_subtitle", "policy": field_policy,
                        })
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
