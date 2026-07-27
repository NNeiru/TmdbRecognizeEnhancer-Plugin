"""MoviePilot TMDB 候选识别增强插件。"""

from __future__ import annotations

import hashlib
import html as html_utils
import json
import re
import threading
import time
import unicodedata
from calendar import monthrange
from concurrent.futures import ThreadPoolExecutor, as_completed
from copy import deepcopy
from datetime import datetime
from difflib import SequenceMatcher
from io import BytesIO
from pathlib import Path
from types import SimpleNamespace
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import unquote, urlencode, urlparse

from apscheduler.triggers.cron import CronTrigger
from fastapi import Body
from jinja2 import Template
from starlette.responses import FileResponse, PlainTextResponse

from app import schemas
from app.core.config import settings
from app.core.event import Event, eventmanager
from app.core.metainfo import MetaInfo
from app.log import logger
from app.modules.themoviedb.tmdbapi import TmdbApi
from app.plugins import _PluginBase
from app.schemas.types import ChainEventType, MediaType
from app.utils.http import RequestUtils

try:
    from PIL import Image, ImageFilter, ImageOps
except ImportError:  # pragma: no cover - MoviePilot 正常镜像内置 Pillow。
    Image = None
    ImageFilter = None
    ImageOps = None

try:
    from app.core.context import MediaInfo as MoviePilotMediaInfo
    from app.modules.filemanager import FileManagerModule
except ImportError:  # pragma: no cover - 旧版 MP 或测试桩没有命名试算入口。
    MoviePilotMediaInfo = None
    FileManagerModule = None

try:
    from app.helper.mediaserver import MediaServerHelper
except ImportError:  # pragma: no cover - 旧版 MP 能加载插件，但界面会提示能力不可用。
    MediaServerHelper = None

try:
    from app.helper.server import MoviePilotServerHelper
except ImportError:  # pragma: no cover - 旧版 MP 没有共享识别帮助类时自动停用该候选源。
    MoviePilotServerHelper = None

try:
    from app.helper.notification import NotificationHelper
except ImportError:  # pragma: no cover - 旧版 MP 不能枚举具体通知实例时保留基础通知能力。
    NotificationHelper = None

try:
    from app.helper.interaction import plugin_input_interaction_manager
except ImportError:  # pragma: no cover - 旧版 MP 不支持插件文本输入会话。
    plugin_input_interaction_manager = None

try:
    from app.schemas.types import EventType
except ImportError:  # pragma: no cover - 仅用于兼容缺少异步事件枚举的旧版 MP。
    EventType = None

try:
    from app.schemas.types import MessageChannel, NotificationType
except ImportError:  # pragma: no cover - 旧版 MP 可继续记录，但不能重发增强通知。
    MessageChannel = None
    NotificationType = None

from .emby_episode_group_sync import EmbyEpisodeGroupSynchronizer
from .anime_cross_id import AnimeCrossIdDatabase
from .emby_media_info import build_sync_payload, is_acceptable as media_info_acceptable
from .episode_normalizer import EpisodeNormalizer
from .media_probe import MediaFileProbe, StaticFfprobeProvisioner
from .strm_media_info_sync import StrmMediaInfoSynchronizer
from .metadata_tools import ReleaseGroupRegistry, RenameFieldRegistry
from .notification_enhancer import (
    FAILURE_CATEGORIES,
    NOTIFICATION_CONTENT_TEMPLATES,
    NOTIFICATION_TYPES,
    build_record,
    classify_failure,
    compact_records,
    extract_notice,
    extract_reason,
    normalize_failure_policies,
    normalize_notification_content_templates,
    normalize_notification_routes,
    notification_content_key,
    notification_kind,
    notification_type_key,
    summarize_digest,
)
from .performance_diagnostics import PerformanceDiagnostics
from .recognition_rules import FIELD_SPECS, RecognitionRuleRegistry
from .release_group_arranger import ReleaseGroupArrangementRegistry
from .rename_mapping import RenameMappingRegistry
from .runtime_adapter import (
    CustomizationSeparatorAdapter,
    EpisodeNormalizationTransferAdapter,
    MoviePilotRuntimeAdapter,
    SubtitleRenameAdapter,
)


class TmdbRecognizeEnhancer(_PluginBase):
    """增强 MoviePilot 的媒体识别、季集归一化与最终命名链。"""

    plugin_name = "媒体整理增强"
    plugin_desc = "增强媒体识别、媒体流字段、动漫集数偏移、命名规则及 Emby 剧集组联动。"
    plugin_icon = "tmdbrecognizeenhancer.svg"
    plugin_version = "0.8.47"
    plugin_author = "NNeiru"
    author_url = "https://github.com/NNeiru"
    plugin_config_prefix = "tmdbrecognizeenhancer_"
    plugin_order = 42
    auth_level = 1

    DATA_KEY_HISTORY = "recognize_history"
    DATA_KEY_EPISODE_RULES = "episode_normalizer_rules"
    DATA_KEY_SEASON_CATALOG = "season_catalog"
    DATA_KEY_RELEASE_GROUP_PROFILES = "release_group_profiles"
    DATA_KEY_RECOGNITION_RULE_OVERRIDES = "recognition_rule_overrides"
    DATA_KEY_RECOGNITION_MEMORY = "recognition_memory"
    DATA_KEY_CUSTOM_RENAME_FIELDS = "custom_rename_fields"
    DATA_KEY_RENAME_MAPPINGS = "rename_mappings"
    DATA_KEY_RELEASE_GROUP_ARRANGEMENTS = "release_group_arrangements"
    DATA_KEY_EMBY_EPISODE_GROUP_JOBS = "emby_episode_group_jobs"
    DATA_KEY_STRM_MEDIA_INFO_JOBS = "strm_media_info_jobs"
    DATA_KEY_NOTIFICATION_RECORDS = "notification_enhancer_records"
    DATA_KEY_NOTIFICATION_APPROVALS = "notification_episode_approvals"
    # 季度目录匹配使用独立策略，不继承整理识别的 max_queries、降级开关等参数。
    CATALOG_QUERY_LIMIT = 8
    CATALOG_RESULT_LIMIT = 8
    CATALOG_SCHEMA_VERSION = 3
    NOTIFICATION_CANDIDATE_PAGE_SIZE = 1
    NOTIFICATION_COLLAGE_LIMIT = 9
    DEFAULT_CONFIG: Dict[str, Any] = {
        "enabled": False,
        "recognizer_enabled": True,
        "show_sidebar_nav": True,
        "debug": False,
        "recognition_mode": "tmdb_first",
        "prefer_parsed_title": True,
        "use_year_hint": True,
        "use_original_title_evidence": True,
        "shared_recognition_enabled": True,
        "anime_cross_id_enabled": True,
        "anime_cross_id_auto_update": True,
        "anime_cross_id_update_interval_hours": 24,
        "anime_cross_id_anilist_resolver_enabled": True,
        "web_search_fallback": False,
        "web_search_engine": "auto",
        "web_search_max_results": 8,
        "web_search_timeout": 15,
        "web_search_min_evidence": 78.0,
        "main_title_fallback": True,
        "progressive_fallback": False,
        "fetch_aliases": True,
        "max_queries": 4,
        "candidate_limit": 8,
        "detail_limit": 6,
        "minimum_score": 72.0,
        "minimum_margin": 8.0,
        "minimum_query_length": 4,
        "token_weight": 38.0,
        "similarity_weight": 24.0,
        "prefix_weight": 14.0,
        "rank_weight": 10.0,
        "query_confidence_weight": 18.0,
        "anchor_weight": 24.0,
        "fallback_anchor_min": 32.0,
        "year_weight": 8.0,
        "type_weight": 6.0,
        "season_missing_penalty": 20.0,
        "history_limit": 30,
        "episode_normalizer_enabled": False,
        "emby_episode_group_sync_enabled": False,
        "emby_episode_group_sync_servers": [],
        "emby_episode_group_sync_initial_delay_seconds": 15,
        "emby_episode_group_sync_retry_seconds": 30,
        "emby_episode_group_sync_max_wait_minutes": 15,
        "emby_episode_group_sync_path_mappings": [],
        "emby_episode_group_sync_conflict_policy": "skip",
        "emby_episode_group_sync_refresh_metadata": True,
        "release_group_assist_enabled": True,
        "release_group_field_supplements_enabled": True,
        "recognition_rule_overrides_enabled": True,
        "release_group_type_weight": 12.0,
        "seasonal_evidence_enabled": True,
        "seasonal_evidence_weight": 18.0,
        "seasonal_evidence_quarters": 2,
        "recognition_memory_enabled": True,
        "recognition_memory_weight": 16.0,
        "recognition_memory_min_hits": 3,
        "recognition_memory_ttl_days": 14,
        "tmdb_exclude_ids": [],
        "tmdb_prefer_ids": [],
        "custom_rename_fields_enabled": True,
        "media_probe_enabled": False,
        "media_probe_policy": "fill_empty",
        "media_probe_timeout": 12,
        "media_probe_executable": "",
        "media_probe_iso_enabled": False,
        "media_probe_fields": [
            "videoFormat", "videoCodec", "videoBit", "audioCodec", "effect", "fps", "subtitle",
        ],
        "media_probe_overwrite_fields": [],
        "media_probe_field_policies": {},
        "media_probe_subtitle_to_customization": True,
        # 未命中规则时自动回退为语言组合（简繁日内封等），默认只保留与自动结果不同的映射
        "media_probe_subtitle_rules": (
            "中文 => 中字内封\n"
            ">=4 => 多国字幕"
        ),
        "rename_mapping_enabled": True,
        "rename_default_separator": "",
        "rename_separator_fields": [],
        "customization_separator": "@",
        "release_group_default_connector": "@",
        "release_group_normalize_unknown_connectors": False,
        # 神医助手（StrmAssistant）Pro 媒体信息推送
        "strm_media_info_sync_enabled": False,
        "strm_media_info_sync_servers": [],
        "strm_media_info_sync_initial_delay_seconds": 20,
        "strm_media_info_sync_retry_seconds": 30,
        "strm_media_info_sync_max_wait_minutes": 30,
        "strm_media_info_sync_path_mappings": [],
        # 通知接管
        "notification_enhancer_enabled": False,
        "notification_mode": "observe",
        "notification_success_enabled": True,
        "notification_failure_enabled": True,
        "notification_plugin_enabled": True,
        "notification_include_paths": True,
        "notification_success_title_template": "{{ original_title }}",
        "notification_success_text_template": "{{ original_text }}",
        "notification_failure_title_template": "{{ original_title }}",
        "notification_failure_text_template": "{{ original_text }}",
        "notification_passthrough_manual": True,
        "notification_record_limit": 200,
        "notification_failure_policies": {
            item["key"]: "notify" for item in FAILURE_CATEGORIES
        },
        "notification_default_service": "",
        "notification_type_routes": normalize_notification_routes({}),
        "notification_content_templates": normalize_notification_content_templates({}),
        "notification_generic_title_template": "{{ original_title }}",
        "notification_generic_text_template": "{{ original_text }}",
        "notification_success_service": "",
        "notification_failure_service": "",
        "notification_episode_candidates_enabled": False,
        "notification_candidate_service": "",
        "notification_candidate_channel": "",
        "notification_candidate_batch_enabled": True,
        "notification_candidate_batch_frequency": "monthly",
        "notification_candidate_batch_hour": 9,
        "notification_candidate_realtime_enabled": True,
        "notification_candidate_quarter": "",
        "notification_candidate_region": "japan",
        "notification_candidate_platforms": ["TV", "TV SHORT"],
        "notification_candidate_sequel_only": True,
        "notification_candidate_preference": "group_preferred",
        "notification_candidate_message_style": "rich",
        "notification_candidate_custom_emoji_id": "",
    }

    # 这组配置由集数偏移页的独立接口维护。主设置页可能长期保留旧快照，
    # 因此通用保存接口不能用旧值反向覆盖刚保存的 Emby 联动设置。
    EMBY_SYNC_CONFIG_KEYS = (
        "emby_episode_group_sync_enabled",
        "emby_episode_group_sync_servers",
        "emby_episode_group_sync_initial_delay_seconds",
        "emby_episode_group_sync_retry_seconds",
        "emby_episode_group_sync_max_wait_minutes",
        "emby_episode_group_sync_path_mappings",
        "emby_episode_group_sync_conflict_policy",
        "emby_episode_group_sync_refresh_metadata",
    )

    # 神医联动同理：由媒体信息识别页的独立接口维护，通用保存不回写旧快照。
    STRM_SYNC_CONFIG_KEYS = (
        "strm_media_info_sync_enabled",
        "strm_media_info_sync_servers",
        "strm_media_info_sync_initial_delay_seconds",
        "strm_media_info_sync_retry_seconds",
        "strm_media_info_sync_max_wait_minutes",
        "strm_media_info_sync_path_mappings",
    )

    # 通知页独立保存；主设置页的旧快照不能覆盖刚保存的接管策略。
    NOTIFICATION_CONFIG_KEYS = (
        "notification_enhancer_enabled",
        "notification_mode",
        "notification_success_enabled",
        "notification_failure_enabled",
        "notification_plugin_enabled",
        "notification_include_paths",
        "notification_success_title_template",
        "notification_success_text_template",
        "notification_failure_title_template",
        "notification_failure_text_template",
        "notification_passthrough_manual",
        "notification_record_limit",
        "notification_failure_policies",
        "notification_default_service",
        "notification_type_routes",
        "notification_content_templates",
        "notification_generic_title_template",
        "notification_generic_text_template",
        "notification_success_service",
        "notification_failure_service",
        "notification_episode_candidates_enabled",
        "notification_candidate_service",
        "notification_candidate_channel",
        "notification_candidate_batch_enabled",
        "notification_candidate_batch_frequency",
        "notification_candidate_batch_hour",
        "notification_candidate_realtime_enabled",
        "notification_candidate_quarter",
        "notification_candidate_region",
        "notification_candidate_platforms",
        "notification_candidate_sequel_only",
        "notification_candidate_preference",
        "notification_candidate_message_style",
        "notification_candidate_custom_emoji_id",
    )

    RENAME_SEPARATOR_FIELDS = {
        "title", "en_title", "original_title", "name", "en_name", "original_name",
        "resourceType", "effect", "edition", "videoFormat", "resource_term",
        "releaseGroup", "videoCodec", "videoBit", "audioCodec", "fps", "webSource",
        "customization",
    }

    _split_pattern = re.compile(r"\s*(?::|：|\||｜|/|／|—|–)\s*")
    _bracket_suffix_pattern = re.compile(r"\s*[\[(（【][^\])）】]{1,40}[\])）】]\s*$")
    _season_pattern = re.compile(
        r"(?i)(?:\bS(?:eason)?\s*(\d{1,2})(?=E\d|\b)|第\s*(\d{1,2})\s*季)"
    )
    _episode_pattern = re.compile(r"(?i)(?:(?<![A-Z])E(?:P(?:ISODE)?)?\s*0*(\d{1,4})\b|第\s*(\d{1,4})\s*[集话])")
    _token_pattern = re.compile(r"[a-z0-9]+|[\u3400-\u9fff]+", re.IGNORECASE)
    _tmdb_url_pattern = re.compile(
        r"https?://(?:www\.)?themoviedb\.org/(tv|movie)/(\d+)", re.IGNORECASE,
    )
    _web_stop_tokens = {
        "a", "an", "and", "at", "by", "de", "for", "from", "in", "no", "of",
        "on", "s", "the", "to", "wa", "wo", "ga", "ni", "tv", "tmdb", "movie",
        "series", "anime",
    }
    _web_search_engines = {"auto", "duckduckgo", "google", "brave", "yahoo", "yandex", "mojeek"}
    # 多后端聚合每次返回顺序都可能不同。“自动”固定使用单一后端，用户仍可
    # 显式选择其它引擎；外部搜索仅提供 TMDB 直链交叉证据，不直接决定结果。
    _ddgs_auto_backend = "duckduckgo"

    def __init__(self):
        """初始化运行时对象，网络客户端延迟到插件初始化阶段创建。"""
        super().__init__()
        self._config = dict(self.DEFAULT_CONFIG)
        self._tmdb_api: Optional[TmdbApi] = None
        self._anime_cross_id: Optional[AnimeCrossIdDatabase] = None
        self._anime_identity_cache_lock = threading.RLock()
        self._anime_identity_cache: Dict[str, Dict[str, Any]] = {}
        self._episode_normalizer: Optional[EpisodeNormalizer] = None
        self._runtime_adapter = MoviePilotRuntimeAdapter()
        self._episode_transfer_adapter = EpisodeNormalizationTransferAdapter()
        self._release_group_registry = ReleaseGroupRegistry()
        self._recognition_rules = RecognitionRuleRegistry()
        self._rename_fields = RenameFieldRegistry()
        self._media_probe = MediaFileProbe()
        self._static_ffprobe = StaticFfprobeProvisioner(
            self._plugin_data_dir, self._download_github_asset,
        )
        self._custom_rename_fields: Tuple[Dict[str, Any], ...] = tuple()
        self._release_group_arrangements = ReleaseGroupArrangementRegistry()
        self._rename_mappings = RenameMappingRegistry()
        self._subtitle_rename_adapter = SubtitleRenameAdapter()
        self._customization_separator_adapter = CustomizationSeparatorAdapter()
        self._diagnostics = PerformanceDiagnostics()
        self._preview_state = threading.local()
        self._config_lock = threading.RLock()
        self._history_lock = threading.RLock()
        self._web_cache_lock = threading.RLock()
        self._web_cache: Dict[Tuple[str, str], List[Dict[str, str]]] = {}
        self._catalog_lock = threading.RLock()
        self._catalog_scans: set = set()
        self._memory_lock = threading.RLock()
        self._emby_sync_lock = threading.RLock()
        self._emby_sync_stop = threading.Event()
        self._emby_sync_wakeup = threading.Event()
        self._emby_sync_thread: Optional[threading.Thread] = None
        self._emby_sync = EmbyEpisodeGroupSynchronizer(self._get_emby_services)
        self._strm_sync_lock = threading.RLock()
        self._strm_sync_stop = threading.Event()
        self._strm_sync_wakeup = threading.Event()
        self._strm_sync_thread: Optional[threading.Thread] = None
        self._strm_sync_worker_error = ""
        self._strm_sync = StrmMediaInfoSynchronizer(self._get_emby_services)
        self._notification_lock = threading.RLock()
        self._notification_recent_lock = threading.RLock()
        self._notification_recent: Dict[str, Dict[str, Any]] = {}
        self._notification_notice_tokens: List[Dict[str, Any]] = []
        self._notification_fallback_tokens: List[Dict[str, Any]] = []
        self._notification_outgoing_lock = threading.RLock()
        self._notification_outgoing: Dict[str, float] = {}
        self._notification_incoming_lock = threading.RLock()
        self._notification_incoming: Dict[str, float] = {}
        self._notification_telegram_send_lock = threading.RLock()
        self._notification_rich_intent_lock = threading.RLock()
        self._notification_rich_intents: Dict[Tuple[str, str, str], int] = {}
        self._notification_rich_message_state: Dict[
            Tuple[str, str, str], Dict[str, str]
        ] = {}
        self._notification_rich_intent_sequence = 0

    def init_plugin(self, config: Optional[Dict[str, Any]] = None):
        """加载配置并启停名称识别事件处理器。"""
        with self._config_lock:
            self._config = self._normalize_config(config or {})
        if self._tmdb_api:
            self._close_tmdb_client()
        self._tmdb_api = TmdbApi()
        self._episode_normalizer = EpisodeNormalizer(self._tmdb_api)
        self._sync_anime_cross_id_state()
        self._refresh_metadata_tools()
        self._sync_runtime_adapter_state()
        self._sync_subtitle_adapter_state()
        self._sync_customization_separator_state()
        self._sync_event_handler_state()
        self._recover_emby_sync_jobs()
        self._sync_emby_worker_state()
        self._recover_strm_sync_jobs()
        self._sync_strm_worker_state()
        self._sync_static_ffprobe_state()

    def _plugin_data_dir(self) -> Optional[Path]:
        """插件数据目录；测试桩没有 get_data_path 时返回 None。"""
        try:
            return Path(self.get_data_path())
        except Exception:  # noqa: BLE001 - 桩环境/权限异常时静默降级
            return None

    @staticmethod
    def _download_github_asset(url: str) -> Optional[bytes]:
        """下载 GitHub raw 资源，自动套用 MP 的 GITHUB_PROXY 设置。"""
        candidates = [url]
        proxy_base = str(getattr(settings, "GITHUB_PROXY", "") or "").strip()
        if proxy_base:
            candidates.insert(0, f"{proxy_base.rstrip('/')}/{url}")
        for candidate in candidates:
            try:
                response = RequestUtils(proxies=settings.PROXY, timeout=120).get_res(candidate)
                if response is not None and response.status_code == 200 and response.content:
                    return response.content
            except Exception as err:  # noqa: BLE001 - 逐个候选降级
                logger.debug(f"[媒体整理增强] 静态 ffprobe 下载失败 {candidate}: {err}")
        return None

    def _sync_anime_cross_id_state(self) -> None:
        """加载本地跨站 ID 快照，并按配置在后台维护最新版。"""
        if self._anime_cross_id is None:
            self._anime_cross_id = AnimeCrossIdDatabase(
                self._plugin_data_dir(), self._download_github_asset,
            )
            self._anime_cross_id.load()
        if (
                not self.get_state()
                or not self._config.get("anime_cross_id_enabled", True)
        ):
            return
        interval = self._safe_int(
            self._config.get("anime_cross_id_update_interval_hours"), 24,
        )
        if (
                self._config.get("anime_cross_id_auto_update", True)
                and self._anime_cross_id.needs_refresh(interval)
        ):
            self._anime_cross_id.refresh_in_background()

    def _sync_static_ffprobe_state(self) -> None:
        """按配置在后台准备 ISO 探测用静态 ffprobe。"""
        if not self._config.get("media_probe_iso_enabled"):
            return
        try:
            self._static_ffprobe.ensure_installed(background=True)
        except Exception as err:  # noqa: BLE001 - 安装失败不能阻断插件初始化
            logger.warning(f"[媒体整理增强] 静态 ffprobe 安装调度失败：{err}")

    def _iso_executable(self) -> str:
        """ISO 探测启用且静态 ffprobe 已就绪时返回其路径。"""
        if not self._config.get("media_probe_iso_enabled"):
            return ""
        return self._static_ffprobe.installed_path()

    def get_state(self) -> bool:
        """返回插件是否启用。"""
        return bool(self._config.get("enabled"))

    @staticmethod
    def get_command() -> List[Dict[str, Any]]:
        """插件当前不注册远程命令。"""
        return []

    def get_service(self) -> List[Dict[str, Any]]:
        """每小时检查一次候选批次是否到达计划发送时间。

        使用固定服务而不是按用户配置动态重建 CronTrigger，这样用户保存
        月度/季度策略后可立即生效，无需重启 MoviePilot。
        """
        if not self.get_state():
            return []
        return [{
            "id": "TmdbRecognizeEnhancerCandidateBatch",
            "name": "集数偏移候选定时批次",
            "trigger": CronTrigger(minute=7),
            "func": self._scheduled_notification_candidate_tick,
            "kwargs": {},
        }]

    @classmethod
    def get_render_mode(cls) -> Tuple[str, str]:
        """声明版本化 Vue 联邦目录，避免升级后继续命中旧 remoteEntry。"""
        safe_version = re.sub(r"[^A-Za-z0-9._-]+", "_", cls.plugin_version)
        return "vue", f"dist/ui/v{safe_version}/assets"

    def get_form(self) -> Tuple[List[dict], Dict[str, Any]]:
        """返回 Vue 配置组件使用的初始配置。"""
        return [], self._current_config()

    @staticmethod
    def get_page() -> List[dict]:
        """详情页由 Vue 远程组件渲染。"""
        return []

    def get_sidebar_nav(self) -> List[Dict[str, Any]]:
        """启用时将识别策略工作台加入整理分组。"""
        if not self.get_state() or not self._config.get("show_sidebar_nav", True):
            return []
        return [{
            "nav_key": "main",
            "title": "媒体整理增强",
            "icon": "mdi-database-search-outline",
            "section": "organize",
            "permission": "manage",
            "order": 40,
        }]

    def get_dashboard_meta(self) -> Optional[List[Dict[str, str]]]:
        """启用时提供一个识别决策摘要仪表板组件。"""
        if not self.get_state():
            return []
        return [{"key": "recognize", "name": "媒体整理增强"}]

    def get_dashboard(
            self,
            key: str,
            **kwargs,
    ) -> Optional[Tuple[Dict[str, Any], Dict[str, Any], Optional[List[dict]]]]:
        """返回 Vue 仪表板的布局和刷新配置。"""
        if not self.get_state() or key != "recognize":
            return None
        return (
            {"cols": 12, "sm": 6, "md": 4},
            {
                "title": "媒体整理增强",
                "subtitle": "整理链运行摘要",
                "refresh": 30,
                "border": True,
            },
            None,
        )

    def get_api(self) -> List[Dict[str, Any]]:
        """注册联邦界面所需的状态、配置、试跑和历史接口。"""
        return [
            {
                "path": "/status",
                "endpoint": self.get_status,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "获取媒体整理增强状态",
            },
            {
                "path": "/config",
                "endpoint": self.save_config_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "保存媒体整理增强配置",
            },
            {
                "path": "/preview",
                "endpoint": self.preview_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "试跑一次候选识别",
            },
            {
                "path": "/history/clear",
                "endpoint": self.clear_history_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "清空识别历史",
            },
            {
                "path": "/recognition-memory/clear",
                "endpoint": self.clear_recognition_memory_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "清空近期识别记忆",
            },
            {
                "path": "/anime-cross-id/status",
                "endpoint": self.get_anime_cross_id_status_api,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "获取动画跨站 ID 数据库状态",
            },
            {
                "path": "/anime-cross-id/refresh",
                "endpoint": self.refresh_anime_cross_id_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "后台更新动画跨站 ID 数据库",
            },
            {
                "path": "/episode-normalizer",
                "endpoint": self.get_episode_normalizer_api,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "获取集数归一化规则和季度条目",
            },
            {
                "path": "/episode-normalizer/rule",
                "endpoint": self.save_episode_rule_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "保存目标编集规则",
            },
            {
                "path": "/episode-normalizer/rule/delete",
                "endpoint": self.delete_episode_rule_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "删除目标编集规则",
            },
            {
                "path": "/episode-normalizer/rule/batch-delete",
                "endpoint": self.batch_delete_episode_rules_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "批量删除目标编集规则",
            },
            {
                "path": "/episode-normalizer/manual-add",
                "endpoint": self.manual_add_episode_rule_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "使用 TMDBID 手动建立目标编集规则",
            },
            {
                "path": "/episode-normalizer/inspect",
                "endpoint": self.inspect_episode_target_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "查看 TMDB 默认编集和剧集组",
            },
            {
                "path": "/episode-normalizer/preview",
                "endpoint": self.preview_episode_normalizer_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "试跑集数归一化",
            },
            {
                "path": "/episode-normalizer/catalog/query",
                "endpoint": self.query_season_catalog_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "按季度查询动画看板",
            },
            {
                "path": "/episode-normalizer/catalog/add",
                "endpoint": self.add_season_catalog_rule_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "从季度看板直接加入维护规则",
            },
            {
                "path": "/episode-normalizer/catalog/batch-add",
                "endpoint": self.batch_add_season_catalog_rules_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "批量匹配季度动画并加入维护规则",
            },
            {
                "path": "/episode-normalizer/emby-sync",
                "endpoint": self.get_emby_sync_api,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "获取 Emby 剧集组联动状态",
            },
            {
                "path": "/episode-normalizer/emby-sync/config",
                "endpoint": self.save_emby_sync_config_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "保存 Emby 剧集组联动设置",
            },
            {
                "path": "/episode-normalizer/emby-sync/preview",
                "endpoint": self.preview_emby_sync_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "只读试跑 Emby Series 定位",
            },
            {
                "path": "/episode-normalizer/emby-sync/apply-all",
                "endpoint": self.apply_all_emby_sync_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "将剧集组写入全部同 TMDBID Series",
            },
            {
                "path": "/episode-normalizer/emby-sync/retry",
                "endpoint": self.retry_emby_sync_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "重试 Emby 剧集组联动任务",
            },
            {
                "path": "/episode-normalizer/emby-sync/delete",
                "endpoint": self.delete_emby_sync_job_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "删除 Emby 剧集组联动任务",
            },
            {
                "path": "/metadata-tools/strm-sync",
                "endpoint": self.get_strm_sync_api,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "获取神医媒体信息推送设置与任务",
            },
            {
                "path": "/metadata-tools/strm-sync/config",
                "endpoint": self.save_strm_sync_config_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "保存神医媒体信息推送设置",
            },
            {
                "path": "/metadata-tools/strm-sync/preview",
                "endpoint": self.preview_strm_sync_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "对单个文件试推神医媒体信息",
            },
            {
                "path": "/metadata-tools/strm-sync/retry",
                "endpoint": self.retry_strm_sync_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "重试神医媒体信息推送任务",
            },
            {
                "path": "/metadata-tools/strm-sync/delete",
                "endpoint": self.delete_strm_sync_job_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "删除神医媒体信息推送任务",
            },
            {
                "path": "/metadata-tools",
                "endpoint": self.get_metadata_tools_api,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "获取制作组和重命名字段目录",
            },
            {
                "path": "/metadata-tools/release-group",
                "endpoint": self.save_release_group_profile_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "设置制作组类型",
            },
            {
                "path": "/metadata-tools/media-probe/preview",
                "endpoint": self.preview_media_probe_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "读取实际媒体流并预览命名字段",
            },
            {
                "path": "/metadata-tools/media-probe/cache/clear",
                "endpoint": self.clear_media_probe_cache_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "清除媒体流扫描缓存",
            },
            {
                "path": "/metadata-tools/media-probe/static-ffprobe/install",
                "endpoint": self.install_static_ffprobe_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "下载并安装 ISO 探测用静态 ffprobe",
            },
            {
                "path": "/metadata-tools/recognition-rule",
                "endpoint": self.save_recognition_rule_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "保存内置识别字段覆盖规则",
            },
            {
                "path": "/metadata-tools/recognition-rule/delete",
                "endpoint": self.delete_recognition_rule_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "删除内置识别字段覆盖规则",
            },
            {
                "path": "/metadata-tools/recognition-rule/priority/bulk",
                "endpoint": self.bulk_recognition_rule_priority_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "批量修改当前筛选识别规则的插件优先级",
            },
            {
                "path": "/metadata-tools/recognition-rule/preview",
                "endpoint": self.preview_recognition_rule_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "试算内置识别字段覆盖规则",
            },
            {
                "path": "/metadata-tools/rename-field",
                "endpoint": self.save_custom_rename_field_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "保存自定义重命名字段",
            },
            {
                "path": "/metadata-tools/rename-field/delete",
                "endpoint": self.delete_custom_rename_field_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "删除自定义重命名字段",
            },
            {
                "path": "/metadata-tools/rename-field/preview",
                "endpoint": self.preview_custom_rename_fields_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "试算自定义重命名字段",
            },
            {
                "path": "/metadata-tools/release-group-arrangement",
                "endpoint": self.save_release_group_arrangement_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "保存制作组名称、顺序和连接符规则",
            },
            {
                "path": "/metadata-tools/release-group-arrangement/delete",
                "endpoint": self.delete_release_group_arrangement_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "删除制作组编排规则",
            },
            {
                "path": "/metadata-tools/release-group-arrangement/preview",
                "endpoint": self.preview_release_group_arrangement_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "试算制作组名称、顺序和连接符",
            },
            {
                "path": "/metadata-tools/rename-mapping",
                "endpoint": self.save_rename_mapping_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "保存命名阶段映射规则",
            },
            {
                "path": "/metadata-tools/rename-mapping/delete",
                "endpoint": self.delete_rename_mapping_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "删除命名阶段映射规则",
            },
            {
                "path": "/metadata-tools/rename-mapping/preview",
                "endpoint": self.preview_rename_mapping_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "试算命名阶段映射规则",
            },
            {
                "path": "/notification-enhancer",
                "endpoint": self.get_notification_enhancer_api,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "获取通知接管状态、路由、记录与候选审批",
            },
            {
                "path": "/notification-enhancer/config",
                "endpoint": self.save_notification_enhancer_config_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "保存通知接管设置",
            },
            {
                "path": "/notification-enhancer/test",
                "endpoint": self.test_notification_enhancer_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "发送通知接管测试消息",
            },
            {
                "path": "/notification-enhancer/records/clear",
                "endpoint": self.clear_notification_records_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "清空入库通知记录",
            },
            {
                "path": "/notification-enhancer/digest/send",
                "endpoint": self.send_notification_digest_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "立即发送待汇总的入库失败摘要",
            },
            {
                "path": "/notification-enhancer/candidates",
                "endpoint": self.query_notification_candidates_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "查询季度集数规则审批候选",
            },
            {
                "path": "/notification-enhancer/candidates/action",
                "endpoint": self.action_notification_candidates_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "加入或忽略季度集数规则候选",
            },
            {
                "path": "/notification-enhancer/candidates/batch/send",
                "endpoint": self.send_notification_candidate_batch_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "立即生成并发送集数偏移候选批次",
            },
            {
                "path": "/notification-enhancer/candidates/collage/{batch_id}",
                "endpoint": self.get_notification_candidate_collage_api,
                "methods": ["GET"],
                "auth": "apikey",
                "summary": "获取集数偏移候选海报拼图",
            },
            {
                "path": "/diagnostics",
                "endpoint": self.get_diagnostics_api,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "按需采样 MoviePilot 和插件性能",
            },
        ]

    def stop_service(self):
        """禁用事件处理器并释放 TMDB 客户端。"""
        self._stop_emby_worker()
        self._stop_strm_worker()
        self._sync_event_handler_state(enabled=False)
        self._runtime_adapter.uninstall()
        self._episode_transfer_adapter.uninstall()
        self._subtitle_rename_adapter.uninstall()
        self._customization_separator_adapter.uninstall()
        self._close_tmdb_client()

    def get_status(self) -> schemas.Response:
        """返回当前配置、运行摘要和最近识别记录。"""
        history = self._read_history()
        recognition_history = [
            item for item in history if item.get("kind", "recognition") == "recognition"
        ]
        accepted = sum(1 for item in recognition_history if item.get("accepted"))
        return schemas.Response(
            success=True,
            data={
                "backend_version": self.plugin_version,
                "api_schema": 2,
                "config": self._current_config(),
                "summary": {
                    "enabled": self.get_state(),
                    "total": len(recognition_history),
                    "accepted": accepted,
                    "rejected": len(recognition_history) - accepted,
                    "acceptance_rate": (
                        round(accepted * 100 / len(recognition_history), 1)
                        if recognition_history else 0
                    ),
                    "recognition_memory": self._recognition_memory_summary(),
                },
                "modules": {
                    "recognizer": {
                        "enabled": bool(self._config.get("recognizer_enabled")),
                        "mode": self._config.get("recognition_mode"),
                        "status": "运行中" if self.get_state() and self._config.get("recognizer_enabled") else "已停用",
                    },
                    "anime_cross_id": {
                        "enabled": bool(self._config.get("anime_cross_id_enabled")),
                        "status": (
                            "已停用" if not self._config.get("anime_cross_id_enabled")
                            else "更新中" if self._anime_cross_id_status().get("updating")
                            else "运行中" if self._anime_cross_id_status().get("ready")
                            else "等待首次同步"
                        ),
                        **self._anime_cross_id_status(),
                    },
                    "episode_offset": {
                        "enabled": bool(self._config.get("episode_normalizer_enabled")),
                        "status": (
                            "运行中" if self.get_state() and self._config.get("episode_normalizer_enabled")
                            and self._runtime_adapter.compatible
                            and self._episode_transfer_adapter.compatible else "等待运行时适配"
                            if self.get_state() and self._config.get("episode_normalizer_enabled") else "已停用"
                        ),
                    },
                    "emby_episode_group_sync": {
                        "enabled": bool(self._config.get("emby_episode_group_sync_enabled")),
                        "status": self._emby_sync_module_status(),
                        **self._emby_sync_counts(),
                    },
                    "strm_media_info_sync": {
                        "enabled": bool(self._config.get("strm_media_info_sync_enabled")),
                        "status": self._strm_sync_module_status(),
                        **self._strm_sync_counts(),
                    },
                    "notification_enhancer": {
                        "enabled": bool(self._config.get("notification_enhancer_enabled")),
                        "mode": self._config.get("notification_mode"),
                        "status": (
                            "已停用"
                            if not self._config.get("notification_enhancer_enabled")
                            else "仅记录"
                            if self._config.get("notification_mode") == "observe"
                            else "并行增强"
                            if self._config.get("notification_mode") == "parallel"
                            else "接管发送"
                        ),
                        "record_count": len(self._read_notification_records()),
                    },
                    "release_group_assist": {
                        "enabled": bool(self._config.get("release_group_assist_enabled")),
                        "status": (
                            "运行中" if self.get_state() and self._config.get("recognizer_enabled")
                            and self._config.get("release_group_assist_enabled") else "已停用"
                        ),
                    },
                    "recognition_rules": {
                        "enabled": bool(self._config.get("recognition_rule_overrides_enabled")),
                        "status": (
                            "运行中" if self.get_state() and self._config.get("recognition_rule_overrides_enabled")
                            else "已停用"
                        ),
                        **self._recognition_rules.runtime_stats(),
                    },
                    "rename_fields": {
                        "enabled": bool(self._config.get("custom_rename_fields_enabled")),
                        "status": (
                            "运行中" if self.get_state() and self._config.get("custom_rename_fields_enabled")
                            else "已停用"
                        ),
                        "field_count": len(self._custom_rename_fields),
                    },
                    "rename_mapping": {
                        "enabled": bool(self._config.get("rename_mapping_enabled")),
                        "status": (
                            "运行中" if self.get_state() and self._config.get("rename_mapping_enabled")
                            and self._subtitle_rename_adapter.compatible else "普通命名可用，字幕适配等待兼容"
                            if self.get_state() and self._config.get("rename_mapping_enabled") else "已停用"
                        ),
                        "rule_count": (
                            self._rename_mappings.catalog().get("count", 0)
                            + self._release_group_arrangements.catalog().get("count", 0)
                        ),
                    },
                },
                "history": history,
                "episode_normalizer": {
                    "enabled": bool(self._config.get("episode_normalizer_enabled")),
                    "rule_count": len(self._read_episode_rules()),
                    "catalog_count": sum(
                        len(value.get("items") or [])
                        for value in self._read_season_catalog_cache().values()
                        if isinstance(value, dict)
                    ),
                    "runtime_compatible": (
                        self._runtime_adapter.compatible
                        and self._episode_transfer_adapter.compatible
                    ),
                    "runtime_message": (
                        f"{self._runtime_adapter.message}；"
                        f"{self._episode_transfer_adapter.message}"
                    ),
                    "plugin_first": bool(getattr(settings, "RECOGNIZE_PLUGIN_FIRST", False)),
                    "emby_sync": self._emby_sync_status_data(include_jobs=False),
                },
                "anime_cross_id_database": self._anime_cross_id_status(),
            },
        )

    def save_config_api(self, config: dict = Body(...)) -> schemas.Response:
        """校验并保存联邦界面提交的插件配置。"""
        submitted = dict(config or {})
        with self._config_lock:
            # Emby 联动在子模块内独立保存。保留运行时最新值，避免主页面的
            # 旧配置快照在随后保存其它模块时把联动开关和路径映射重置。
            for key in self.EMBY_SYNC_CONFIG_KEYS:
                submitted[key] = deepcopy(self._config.get(key, self.DEFAULT_CONFIG[key]))
            for key in self.STRM_SYNC_CONFIG_KEYS:
                submitted[key] = deepcopy(self._config.get(key, self.DEFAULT_CONFIG[key]))
            self._config = self._normalize_config(submitted)
            self.update_config(self._current_config())
        self._refresh_metadata_tools()
        self._sync_runtime_adapter_state()
        self._sync_subtitle_adapter_state()
        self._sync_customization_separator_state()
        self._sync_event_handler_state()
        self._sync_emby_worker_state()
        self._sync_strm_worker_state()
        self._sync_static_ffprobe_state()
        self._sync_anime_cross_id_state()
        return self.get_status()

    def _anime_cross_id_status(self) -> Dict[str, Any]:
        status = (
            self._anime_cross_id.status()
            if self._anime_cross_id else {
                "ready": False, "updating": False, "item_count": 0,
                "tmdb_count": 0, "error": "",
            }
        )
        return {
            **status,
            "enabled": bool(self._config.get("anime_cross_id_enabled", True)),
            "auto_update": bool(self._config.get("anime_cross_id_auto_update", True)),
            "update_interval_hours": self._safe_int(
                self._config.get("anime_cross_id_update_interval_hours"), 24,
            ),
            "anilist_resolver_enabled": bool(
                self._config.get("anime_cross_id_anilist_resolver_enabled", True)
            ),
        }

    def get_anime_cross_id_status_api(self) -> schemas.Response:
        """返回跨站数据库当前快照与更新状态。"""
        return schemas.Response(success=True, data=self._anime_cross_id_status())

    def refresh_anime_cross_id_api(self) -> schemas.Response:
        """立即在后台检查最新版，不阻塞管理页面请求。"""
        if self._anime_cross_id is None:
            self._sync_anime_cross_id_state()
        started = bool(
            self._anime_cross_id
            and self._anime_cross_id.refresh_in_background(force=True)
        )
        return schemas.Response(
            success=True,
            data={**self._anime_cross_id_status(), "started": started},
        )

    def clear_recognition_memory_api(self) -> schemas.Response:
        """清空用户可控的近期识别偏好，不影响运行日志和季度看板。"""
        with self._memory_lock:
            self.save_data(self.DATA_KEY_RECOGNITION_MEMORY, {"entries": {}})
        return self.get_status()

    def get_metadata_tools_api(self) -> schemas.Response:
        """返回制作组分类和 MP 内置识别规则目录。"""
        catalog = self._release_group_registry.catalog()
        return schemas.Response(success=True, data={
            "backend_version": self.plugin_version,
            "api_schema": 3,
            "release_groups": catalog,
            "release_group_profiles": self._read_release_group_profiles(),
            "media_probe": {
                **self._media_probe.capability(self._config.get("media_probe_executable")),
                "static_ffprobe": self._static_ffprobe.status(),
                "field_options": [
                    {"key": "videoFormat", "label": "分辨率"},
                    {"key": "videoCodec", "label": "视频编码"},
                    {"key": "videoBit", "label": "视频位深"},
                    {"key": "audioCodec", "label": "主音频编码"},
                    {"key": "effect", "label": "HDR / 杜比视界"},
                    {"key": "fps", "label": "帧率"},
                    {"key": "subtitle", "label": "内封字幕语言与组合", "target": "customization"},
                    {"key": "duration", "label": "媒体时长", "target": "probe_duration"},
                ],
            },
            "recognition_rules": self._recognition_rules.catalog(),
            "rename_fields": {
                "builtin": self._rename_fields.builtin_catalog(),
                "context": self._rename_fields.context_catalog(),
                "custom": list(deepcopy(self._custom_rename_fields)),
                "count": len(self._custom_rename_fields),
            },
            "rename_mappings": {
                **self._rename_mappings.catalog(),
                "subtitle_compatible": self._subtitle_rename_adapter.compatible,
                "subtitle_message": self._subtitle_rename_adapter.message,
            },
            "release_group_arrangements": self._release_group_arrangements.catalog(),
            "strm_sync": self._strm_sync_status_data(include_jobs=False),
            "capabilities": {
                "runtime_override": self._runtime_adapter.compatible,
                "runtime_message": self._runtime_adapter.message,
                "customization_separator": self._customization_separator_adapter.compatible,
                "customization_separator_message": self._customization_separator_adapter.message,
                "source_mutation": False,
                "custom_independent_field": hasattr(ChainEventType, "TransferRenameBuild"),
                "target_directory_context": hasattr(ChainEventType, "TransferRename"),
                "subtitle_post_mapping": self._subtitle_rename_adapter.compatible,
                "media_probe": self._media_probe.capability(
                    self._config.get("media_probe_executable")
                ).get("available", False),
            },
        })

    def save_release_group_profile_api(self, payload: dict = Body(...)) -> schemas.Response:
        """保存单条制作组的动漫、真人或未分类设置。"""
        rule_id = str(payload.get("id") or "").strip()
        kind = str(payload.get("kind") or "unknown").strip().lower()
        valid_ids = {item.get("id") for item in self._release_group_registry.catalog().get("items") or []}
        if not rule_id or rule_id not in valid_ids:
            return schemas.Response(success=False, message="制作组规则不存在或已随 MP 更新变化")
        if kind not in ("animation", "live_action", "unknown"):
            return schemas.Response(success=False, message="制作组类型只支持动漫、真人电视剧或未分类")
        profiles = self._read_release_group_profiles()
        profiles[rule_id] = {
            "kind": kind,
            "display_name": str(payload.get("display_name") or "").strip()[:80],
            "field_policy": str(payload.get("field_policy") or "fill_empty"),
            "field_values": payload.get("field_values") or {},
            "custom_field_values": payload.get("custom_field_values") or {},
        }
        self.save_data(self.DATA_KEY_RELEASE_GROUP_PROFILES, profiles)
        self._release_group_registry.refresh(profiles)
        return self.get_metadata_tools_api()

    def install_static_ffprobe_api(self) -> schemas.Response:
        """手动触发静态 ffprobe 下载安装（后台执行，前端轮询状态）。"""
        status = self._static_ffprobe.ensure_installed(background=True)
        message = (
            "静态 ffprobe 已就绪" if status.get("installed")
            else "已开始后台下载静态 ffprobe，完成后自动生效"
        )
        return schemas.Response(success=True, message=message, data=status)

    def clear_media_probe_cache_api(self) -> schemas.Response:
        """清空 ffprobe 扫描缓存；下次整理或试扫会重新读取文件。"""
        cleared = self._media_probe.clear_cache()
        return schemas.Response(
            success=True,
            message=f"已清除 {cleared} 条扫描缓存",
            data=self._media_probe.capability(self._config.get("media_probe_executable")),
        )

    def preview_media_probe_api(self, payload: dict = Body(...)) -> schemas.Response:
        """对容器内可读取文件执行一次 ffprobe，只返回预览，不修改文件。"""
        path = str(payload.get("source_path") or "").strip()
        if not path:
            return schemas.Response(success=False, message="请输入 MoviePilot 容器内看到的真实文件路径")
        result = self._media_probe.probe(
            path,
            timeout=self._safe_int(
                payload.get("timeout"), self._safe_int(self._config.get("media_probe_timeout"), 12),
            ),
            executable_path=self._config.get("media_probe_executable"),
            force=bool(payload.get("force")),
            iso_executable_path=self._iso_executable(),
        )
        if not result.get("success"):
            return schemas.Response(success=False, message=str(result.get("reason") or "媒体流扫描失败"), data=result)
        mapped = self._media_probe.map_subtitles(
            result, self._config.get("media_probe_subtitle_rules"),
        )
        result.setdefault("context", {})["probe_subtitle_mapped"] = mapped
        # 原始 ffprobe JSON 仅供后端转换与内存缓存使用；前端试扫无需下载整份 streams/chapters。
        result.pop("raw", None)
        return schemas.Response(success=True, data=result)

    def save_recognition_rule_api(self, payload: dict = Body(...)) -> schemas.Response:
        """新增或更新一个插件覆盖规则；不会写入 MP/Rust 文件。"""
        try:
            re.compile(str(payload.get("pattern") or ""), re.IGNORECASE)
        except re.error as err:
            return schemas.Response(success=False, message=f"正则表达式无效：{err}")
        overrides = self._read_recognition_rule_overrides()
        rule_id = str(payload.get("id") or "").strip()
        source_rule_id = str(payload.get("source_rule_id") or "").strip()
        overrides = [
            item for item in overrides
            if not (rule_id and item.get("id") == rule_id)
            and not (source_rule_id and item.get("source_rule_id") == source_rule_id)
        ]
        overrides.append(payload)
        normalized = RecognitionRuleRegistry.normalize_overrides(overrides)
        if len(normalized) <= len(overrides) - 1:
            return schemas.Response(success=False, message="规则字段或正则无效")
        self.save_data(self.DATA_KEY_RECOGNITION_RULE_OVERRIDES, normalized)
        self._recognition_rules.refresh(normalized)
        return self.get_metadata_tools_api()

    def delete_recognition_rule_api(self, payload: dict = Body(...)) -> schemas.Response:
        """删除用户规则或恢复一条被修改的内置规则。"""
        rule_id = str(payload.get("id") or "").strip()
        source_rule_id = str(payload.get("source_rule_id") or "").strip()
        overrides = [
            item for item in self._read_recognition_rule_overrides()
            if item.get("id") != rule_id and item.get("source_rule_id") != source_rule_id
        ]
        self.save_data(self.DATA_KEY_RECOGNITION_RULE_OVERRIDES, overrides)
        self._recognition_rules.refresh(overrides)
        return self.get_metadata_tools_api()

    def bulk_recognition_rule_priority_api(self, payload: dict = Body(...)) -> schemas.Response:
        """批量设置目录规则的插件覆盖优先级；不会修改 MP/Rust 文件。"""
        payload = payload or {}
        rule_ids = payload.get("rule_ids")
        if not isinstance(rule_ids, list) or not rule_ids:
            return schemas.Response(success=False, message="当前筛选结果为空，没有可修改的规则")
        normalized, updated, missing = self._recognition_rules.bulk_set_priority(
            self._read_recognition_rule_overrides(),
            rule_ids,
            payload.get("priority"),
        )
        if not updated:
            return schemas.Response(success=False, message="筛选规则已经失效，请刷新 MP 规则后重试")
        self.save_data(self.DATA_KEY_RECOGNITION_RULE_OVERRIDES, normalized)
        self._recognition_rules.refresh(normalized)
        response = self.get_metadata_tools_api()
        if missing:
            response.message = f"已修改 {updated} 条；另有 {len(missing)} 条规则已随 MP 更新失效"
        return response

    def preview_recognition_rule_api(self, payload: dict = Body(...)) -> schemas.Response:
        """用临时 MetaBase 试算当前已保存的覆盖层。"""
        title = self._clean_title(payload.get("title"))
        if not title:
            return schemas.Response(success=False, message="请输入需要试算的原标题")
        meta = type("RulePreviewMeta", (), {})()
        meta.title = title
        meta.org_string = title
        meta.original_name = title
        meta.name = title
        for spec in FIELD_SPECS.values():
            setattr(meta, spec["attr"], None)
        changes = self._recognition_rules.apply(meta)
        return schemas.Response(success=True, data={"title": title, "changes": changes})

    def save_custom_rename_field_api(self, payload: dict = Body(...)) -> schemas.Response:
        """新增或更新一个独立 Jinja2 重命名字段。"""
        current = self._read_custom_rename_fields()
        key = str(payload.get("key") or "").strip()
        original_key = str(payload.get("original_key") or key).strip()
        candidate = [item for item in current if item.get("key") not in (key, original_key)]
        candidate.append(payload)
        try:
            normalized = RenameFieldRegistry.normalize_fields(candidate)
        except ValueError as err:
            return schemas.Response(success=False, message=str(err))
        self.save_data(self.DATA_KEY_CUSTOM_RENAME_FIELDS, normalized)
        self._custom_rename_fields = tuple(deepcopy(normalized))
        return self.get_metadata_tools_api()

    def delete_custom_rename_field_api(self, payload: dict = Body(...)) -> schemas.Response:
        """删除一个独立重命名字段，并重新校验剩余字段依赖。"""
        key = str(payload.get("key") or "").strip()
        candidate = [item for item in self._read_custom_rename_fields() if item.get("key") != key]
        try:
            normalized = RenameFieldRegistry.normalize_fields(candidate)
        except ValueError as err:
            return schemas.Response(success=False, message=str(err))
        self.save_data(self.DATA_KEY_CUSTOM_RENAME_FIELDS, normalized)
        self._custom_rename_fields = tuple(deepcopy(normalized))
        return self.get_metadata_tools_api()

    def preview_custom_rename_fields_api(self, payload: dict = Body(...)) -> schemas.Response:
        """使用用户提供的安全上下文试算全部自定义重命名字段。"""
        raw_context = payload.get("context") or {}
        context = dict(raw_context) if isinstance(raw_context, dict) else {}
        context.update(self._build_rename_source_context(
            payload.get("source_path"), payload.get("source_item"),
        ))
        target_dir = str(payload.get("target_dir") or "").strip()
        rendered_relative = str(payload.get("rendered_relative_path") or "").strip()
        context.update(self._build_rename_target_context(target_dir, rendered_relative))
        values, errors = self._rename_fields.evaluate(self._custom_rename_fields, context)
        return schemas.Response(success=True, data={
            "values": values,
            "errors": errors,
            "context": {
                key: value for key, value in context.items()
                if not str(key).startswith("__")
            },
        })

    def save_rename_mapping_api(self, payload: dict = Body(...)) -> schemas.Response:
        """新增或更新一条最终命名映射；旧版制作组规则继续只做兼容。"""
        current = self._read_rename_mappings()
        rule_id = str(payload.get("id") or "").strip()
        candidate = [item for item in current if not rule_id or item.get("id") != rule_id]
        payload = dict(payload or {})
        existing = next((item for item in current if item.get("id") == rule_id), None)
        if not existing or existing.get("stage") != "release_group":
            payload["stage"] = "final_result"
        try:
            normalized = RenameMappingRegistry.validate_rule(payload, candidate)
        except ValueError as err:
            return schemas.Response(success=False, message=str(err))
        self.save_data(self.DATA_KEY_RENAME_MAPPINGS, normalized)
        self._rename_mappings.refresh(normalized)
        return self.get_metadata_tools_api()

    def save_release_group_arrangement_api(self, payload: dict = Body(...)) -> schemas.Response:
        """新增或更新一条结构化制作组编排规则。"""
        current = self._read_release_group_arrangements()
        rule_id = str(payload.get("id") or "").strip()
        candidate = [item for item in current if not rule_id or item.get("id") != rule_id]
        try:
            normalized = ReleaseGroupArrangementRegistry.validate_rule(payload, candidate)
        except ValueError as err:
            return schemas.Response(success=False, message=str(err))
        self.save_data(self.DATA_KEY_RELEASE_GROUP_ARRANGEMENTS, normalized)
        self._release_group_arrangements.refresh(
            normalized,
            self._config.get("release_group_default_connector"),
            self._config.get("release_group_normalize_unknown_connectors"),
        )
        return self.get_metadata_tools_api()

    def delete_release_group_arrangement_api(self, payload: dict = Body(...)) -> schemas.Response:
        """删除一条结构化制作组编排规则。"""
        rule_id = str(payload.get("id") or "").strip()
        rules = [
            item for item in self._read_release_group_arrangements()
            if item.get("id") != rule_id
        ]
        self.save_data(self.DATA_KEY_RELEASE_GROUP_ARRANGEMENTS, rules)
        self._release_group_arrangements.refresh(
            rules,
            self._config.get("release_group_default_connector"),
            self._config.get("release_group_normalize_unknown_connectors"),
        )
        return self.get_metadata_tools_api()

    def preview_release_group_arrangement_api(self, payload: dict = Body(...)) -> schemas.Response:
        """按实际执行顺序试算结构化制作组编排。"""
        value = str(payload.get("value") or "")
        output, trace = self._release_group_arrangements.apply(value)
        return schemas.Response(success=True, data={
            "input": value,
            "output": output,
            "trace": trace,
        })

    def delete_rename_mapping_api(self, payload: dict = Body(...)) -> schemas.Response:
        """删除一条命名映射。"""
        rule_id = str(payload.get("id") or "").strip()
        rules = [item for item in self._read_rename_mappings() if item.get("id") != rule_id]
        self.save_data(self.DATA_KEY_RENAME_MAPPINGS, rules)
        self._rename_mappings.refresh(rules)
        return self.get_metadata_tools_api()

    def preview_rename_mapping_api(self, payload: dict = Body(...)) -> schemas.Response:
        """按实际顺序试算文件操作前的完整相对命名结果。"""
        stage = "final_result"
        value = str(payload.get("value") or "")
        output, changes = self._rename_mappings.apply(value, stage)
        return schemas.Response(success=True, data={
            "stage": stage,
            "input": value,
            "output": output,
            "changes": changes,
        })

    def get_diagnostics_api(self) -> schemas.Response:
        """执行一次轻量性能采样；是否连续刷新由前端页面控制。"""
        season_catalog = self._read_season_catalog_cache()
        mapping_catalog = self._rename_mappings.catalog()
        arrangement_catalog = self._release_group_arrangements.catalog()
        plugin_stats = {
            **self._recognition_rules.runtime_stats(),
            "history_records": len(self._read_history()),
            "episode_rules": len(self._read_episode_rules()),
            "active_catalog_scans": len(self._catalog_scans),
            "web_cache_entries": len(self._web_cache),
            "season_catalog_quarters": len(season_catalog),
            "season_catalog_items": sum(
                len(value.get("items") or [])
                for value in season_catalog.values() if isinstance(value, dict)
            ),
            "custom_rename_fields": len(self._custom_rename_fields),
            "rename_mapping_rules": int(mapping_catalog.get("count") or 0),
            "release_group_rules": int(arrangement_catalog.get("count") or 0),
            "recognition_mode": self._config.get("recognition_mode"),
            "web_search_fallback": bool(self._config.get("web_search_fallback")),
            "fetch_aliases": bool(self._config.get("fetch_aliases")),
            "emby_sync_enabled": bool(self._config.get("emby_episode_group_sync_enabled")),
            "emby_sync_worker_running": bool(self._emby_sync_thread and self._emby_sync_thread.is_alive()),
            "emby_sync_jobs": len(self._read_emby_sync_jobs()),
            **{f"emby_sync_{key}": value for key, value in self._emby_sync_counts().items()},
            "strm_sync_enabled": bool(self._config.get("strm_media_info_sync_enabled")),
            "strm_sync_worker_running": bool(self._strm_sync_thread and self._strm_sync_thread.is_alive()),
            **{f"strm_sync_{key}": value for key, value in self._strm_sync_counts().items()},
        }
        return schemas.Response(success=True, data=self._diagnostics.snapshot(plugin_stats))

    def preview_api(self, payload: dict = Body(...)) -> schemas.Response:
        """使用当前策略试跑标题，但不向 MoviePilot 识别链注入结果。"""
        raw_title = self._clean_title(payload.get("title"))
        if not raw_title:
            return schemas.Response(success=False, message="请输入需要测试的标题")
        title, hints = self._prepare_recognition_input(raw_title)
        supplied_hints = {
            "year": self._normalize_year(payload.get("year")),
            "media_type": self._normalize_media_type(payload.get("media_type")),
            "season": self._safe_int(payload.get("season"), 0),
            "episode": self._safe_int(payload.get("episode"), 0),
        }
        hints.update({key: value for key, value in supplied_hints.items() if value not in (None, "", 0)})
        if supplied_hints["media_type"]:
            hints["media_type_source"] = "manual"
        requested_mode = str(payload.get("recognition_mode") or "").strip().lower()
        if requested_mode not in ("tmdb_first", "scored"):
            requested_mode = None
        try:
            result = self._recognize_title(
                title,
                hints=hints,
                include_candidates=True,
                recognition_mode=requested_mode,
            )
            result["requested_mode"] = requested_mode or ""
            result["saved_mode"] = self._config.get("recognition_mode")
            result["mode_mismatch"] = bool(
                requested_mode and requested_mode != self._config.get("recognition_mode")
            )
            result["original_title"] = raw_title if raw_title != title else ""
            episode_preview = self._preview_episode_pipeline(
                best=result.get("best") if result.get("accepted") else None,
                hints=hints,
                raw_title=raw_title,
                parsed_title=title,
            )
            result["episode_rule"] = episode_preview.get("rule")
            result["episode_adjustment"] = episode_preview.get("result")
            raw_group = str(hints.get("release_group") or "")
            arranged_group, group_trace = self._release_group_arrangements.apply(raw_group)
            arranged_group, legacy_group_changes = self._rename_mappings.apply(
                arranged_group, "release_group"
            )
            group_trace = dict(group_trace or {})
            group_trace.update({
                "input": raw_group,
                "output": arranged_group,
                "legacy_changes": legacy_group_changes,
                "applied": bool(group_trace.get("applied") or legacy_group_changes),
            })
            final_coordinates = episode_preview.get("result") or {}
            best = result.get("best") or {}
            media_type = self._normalize_media_type(best.get("media_type") or hints.get("media_type"))
            rename_context = {
                "title": best.get("name") or title,
                "name": title,
                "original_name": raw_title,
                "year": best.get("year") or hints.get("year") or "",
                "type": getattr(media_type, "value", media_type) or "",
                "tmdbid": best.get("tmdb_id") or "",
                "season": final_coordinates.get("season", hints.get("season")),
                "episode": final_coordinates.get("episode", hints.get("episode")),
                "releaseGroup": arranged_group,
            }
            rename_context.update(self._build_rename_source_context(raw_title))
            rename_context.update(self._build_rename_target_context("", raw_title))
            custom_values, custom_errors = self._rename_fields.evaluate(
                self._custom_rename_fields, rename_context,
            ) if self._config.get("custom_rename_fields_enabled") else ({}, [])
            result["release_group_arrangement"] = group_trace
            result["recognition_rule_changes"] = hints.get("recognition_rule_changes") or []
            result["custom_rename_fields"] = {
                "values": custom_values,
                "errors": custom_errors,
                "configured": len(self._custom_rename_fields),
                "simulated": True,
            }
            result["final_naming"] = self._preview_final_name(
                raw_title=raw_title,
                parsed_title=title,
                best=best if result.get("accepted") else {},
                hints=hints,
                episode_result=final_coordinates,
            )
            final_output = str((result.get("final_naming") or {}).get("output") or "")
            result["pipeline"] = [
                {
                    "module": "MoviePilot 标题解析（识别前）",
                    "status": "completed",
                    "summary": f"{title} · 年份 {hints.get('year') or '未提供'} · S{hints.get('season') or '?'}E{hints.get('episode') or '?'}",
                },
                {
                    "module": "识别字段覆盖",
                    "status": "applied" if hints.get("recognition_rule_changes") else "skipped",
                    "summary": (
                        f"命中 {len(hints.get('recognition_rule_changes') or [])} 条用户覆盖规则"
                        if hints.get("recognition_rule_changes") else
                        "没有识别字段覆盖规则命中"
                    ),
                },
                {
                    "module": "制作组类型辅助",
                    "status": "applied" if hints.get("release_group_profile") else "skipped",
                    "summary": (
                        f"{hints['release_group_profile'].get('release_group')} → "
                        f"{'动漫' if hints['release_group_profile'].get('kind') == 'animation' else '真人电视剧'}"
                        if hints.get("release_group_profile") else
                        "未识别到已分类制作组，不参与本次候选判断"
                    ),
                },
                {
                    "module": "TMDB 搜索增强",
                    "status": "accepted" if result.get("accepted") else "rejected",
                    "summary": (
                        f"{result.get('reason')}（实际模式："
                        f"{'单次首结果' if result.get('selection_mode') == 'tmdb_first' else '可解释评分'}）"
                    ),
                },
                {
                    "module": "集数偏移",
                    "status": (
                        "applied" if (episode_preview.get("result") or {}).get("applied") else "skipped"
                    ),
                    "summary": (episode_preview.get("result") or {}).get("reason"),
                },
                {
                    "module": "制作组命名编排",
                    "status": "applied" if group_trace.get("applied") else "skipped",
                    "summary": (
                        f"{raw_group} → {arranged_group}"
                        if group_trace.get("applied") else
                        ("未识别到制作组" if not raw_group else "制作组保持原样")
                    ),
                },
                {
                    "module": "自定义命名字段",
                    "status": "applied" if custom_values else "skipped",
                    "summary": (
                        f"试算 {len(custom_values)} 个字段"
                        if custom_values else
                        (f"已配置 {len(self._custom_rename_fields)} 个字段，本样本未产生值" if self._custom_rename_fields else "未配置自定义命名字段")
                    ),
                },
                {
                    "module": "MoviePilot 模板与最终命名",
                    "status": "completed" if final_output else "skipped",
                    "summary": (
                        final_output
                        if final_output else (result.get("final_naming") or {}).get("reason", "未生成最终命名")
                    ),
                },
                {
                    "module": "Emby 剧集组联动（入库后）",
                    "status": (
                        "applied" if (episode_preview.get("result") or {}).get("episode_group")
                        and self._emby_sync_active() else "skipped"
                    ),
                    "summary": (
                        f"实际整理完成后将以 TMDB {best.get('tmdb_id')} 和最终路径定位 Series，"
                        f"写入 TmdbEg {(episode_preview.get('result') or {}).get('episode_group')}"
                        if (episode_preview.get("result") or {}).get("episode_group")
                        and self._emby_sync_active() else
                        "本次未采用剧集组，或 Emby 剧集组联动尚未启用"
                    ),
                },
            ]
            return schemas.Response(success=True, data=result)
        except Exception as err:
            logger.error(f"[TMDB识别增强] 试跑失败：{err}")
            return schemas.Response(success=False, message=f"试跑失败：{err}")

    def _preview_final_name(
            self,
            raw_title: str,
            parsed_title: str,
            best: Dict[str, Any],
            hints: Dict[str, Any],
            episode_result: Dict[str, Any],
    ) -> Dict[str, Any]:
        """调用 MP 当前命名模板得到最终相对路径，不执行任何文件操作。"""
        if not best:
            return {"available": False, "output": "", "reason": "TMDB 候选未通过，无法生成最终命名"}
        if MoviePilotMediaInfo is None or FileManagerModule is None:
            return {
                "available": False,
                "output": "",
                "reason": "当前 MoviePilot 版本未提供命名模板试算入口",
            }
        media_type = self._normalize_media_type(best.get("media_type") or hints.get("media_type"))
        tmdb_id = self._safe_int(best.get("tmdb_id"), 0)
        if not media_type or not tmdb_id:
            return {"available": False, "output": "", "reason": "缺少媒体类型或 TMDBID"}
        try:
            tmdb_info = self._tmdb_client().get_info(
                mtype=media_type, tmdbid=tmdb_id,
            )
            if not tmdb_info:
                return {"available": False, "output": "", "reason": "无法读取 TMDB 详情"}
            mediainfo = MoviePilotMediaInfo(tmdb_info=tmdb_info)
            meta = MetaInfo(raw_title)
            season = self._optional_int(episode_result.get("season"))
            episode = self._optional_int(episode_result.get("episode"))
            end_episode = self._optional_int(episode_result.get("end_episode"))
            group_id = str(episode_result.get("episode_group") or "").strip()
            meta.type = media_type
            meta.name = parsed_title or getattr(meta, "name", None)
            meta.tmdbid = str(tmdb_id)
            if season is not None:
                meta.begin_season = season
                # episode_result 表示一个目标季坐标，并不是“起止季范围”。
                # begin/end 同时写成同一季时，MP 会按范围渲染为
                # S01-S01，随后再拼接 E04，最终形成错误的 S01-S01E04。
                meta.end_season = None
                mediainfo.season = season
            if episode is not None:
                meta.begin_episode = episode
                # 单集必须保持 end_episode 为空；若把同一个集数同时写入起止值，
                # MoviePilot 命名模板会将其渲染成 E13-E13 这样的伪范围。
                meta.end_episode = (
                    end_episode
                    if end_episode is not None and end_episode != episode else None
                )
            if group_id:
                meta.episode_group = group_id
                mediainfo.episode_group = group_id
            self._preview_state.active = True
            try:
                output = str(FileManagerModule.recommend_name(meta=meta, mediainfo=mediainfo) or "")
            finally:
                self._preview_state.active = False
            return {
                "available": bool(output),
                "output": output,
                "reason": "已按 MoviePilot 当前命名模板生成" if output else "MoviePilot 命名模板没有生成结果",
                "template_source": "MoviePilot 当前命名模板",
            }
        except Exception as err:
            self._preview_state.active = False
            logger.warning(f"[TMDB识别增强] 最终命名试算失败：{err}")
            return {"available": False, "output": "", "reason": f"最终命名试算失败：{err}"}

    def _preview_episode_pipeline(
            self,
            best: Optional[Dict[str, Any]],
            hints: Dict[str, Any],
            raw_title: str,
            parsed_title: str,
    ) -> Dict[str, Any]:
        """综合试跑中的集数偏移阶段，不依赖运行时适配器，也不写入 MP。"""
        if not self._config.get("episode_normalizer_enabled"):
            return {"rule": None, "result": {
                "applied": False, "strategy": "module-disabled", "reason": "集数偏移模块未启用",
                "season": hints.get("season"), "episode": hints.get("episode"),
                "coordinates_authoritative": False,
            }}
        if not best:
            return {"rule": None, "result": {
                "applied": False, "strategy": "recognition-missing", "reason": "TMDB 未通过，无法检查偏移",
                "season": hints.get("season"), "episode": hints.get("episode"),
                "coordinates_authoritative": False,
            }}
        if self._normalize_media_type(best.get("media_type")) != MediaType.TV:
            return {"rule": None, "result": {
                "applied": False, "strategy": "not-tv", "reason": "电影不执行集数偏移",
                "season": hints.get("season"), "episode": hints.get("episode"),
                "coordinates_authoritative": False,
            }}
        tmdb_id = self._safe_int(best.get("tmdb_id"), 0)
        rule = next((
            item for item in self._read_episode_rules()
            if item.get("enabled", True) and self._safe_int(item.get("tmdb_id"), 0) == tmdb_id
        ), None)
        if not rule:
            return {"rule": None, "result": {
                "applied": False,
                "strategy": "rule-missing",
                "reason": f"TMDB {tmdb_id} 没有维护偏移规则；插件未修改季集，沿用 MP 后续识别结果",
                "season": hints.get("season"), "episode": hints.get("episode"),
                "coordinates_authoritative": False,
            }}
        result = self._normalizer().normalize(
            rule=rule,
            season=self._optional_int(hints.get("season")),
            episode=self._optional_int(hints.get("episode")),
            end_episode=self._optional_int(hints.get("end_episode")),
            raw_title=raw_title,
            parsed_name=parsed_title,
        )
        result["coordinates_authoritative"] = True
        return {"rule": rule, "result": result}

    def clear_history_api(self) -> schemas.Response:
        """清空插件保存的最近识别历史。"""
        with self._history_lock:
            self.save_data(self.DATA_KEY_HISTORY, [])
        return self.get_status()

    def get_episode_normalizer_api(self) -> schemas.Response:
        """返回目标编集规则；季度看板按用户当前选择单独查询。"""
        return schemas.Response(
            success=True,
            data={
                "rules": self._read_episode_rules(),
                "enabled": bool(self._config.get("episode_normalizer_enabled")),
                "emby_sync": self._emby_sync_status_data(include_jobs=False),
            },
        )

    def get_emby_sync_api(self) -> schemas.Response:
        """返回 Emby 剧集组联动设置、服务目录和持久任务。"""
        return schemas.Response(success=True, data=self._emby_sync_status_data(include_jobs=True))

    def save_emby_sync_config_api(self, payload: dict = Body(...)) -> schemas.Response:
        """独立保存联动设置，不要求用户在总开关页编辑复杂路径映射。"""
        payload = payload or {}
        updates = {
            "emby_episode_group_sync_enabled": payload.get("enabled"),
            "emby_episode_group_sync_servers": payload.get("servers"),
            "emby_episode_group_sync_initial_delay_seconds": payload.get("initial_delay_seconds"),
            "emby_episode_group_sync_retry_seconds": payload.get("retry_seconds"),
            "emby_episode_group_sync_max_wait_minutes": payload.get("max_wait_minutes"),
            "emby_episode_group_sync_path_mappings": payload.get("path_mappings"),
            "emby_episode_group_sync_conflict_policy": payload.get("conflict_policy"),
            "emby_episode_group_sync_refresh_metadata": payload.get("refresh_metadata"),
        }
        with self._config_lock:
            merged = {**self._config, **{key: value for key, value in updates.items() if value is not None}}
            self._config = self._normalize_config(merged)
            self.update_config(self._current_config())
        self._sync_emby_worker_state()
        return self.get_emby_sync_api()

    def preview_emby_sync_api(self, payload: dict = Body(...)) -> schemas.Response:
        """只读定位一个 TMDB 剧集组对应的 Emby Series，不执行写入。"""
        payload = payload or {}
        tmdb_id = self._safe_int(payload.get("tmdb_id"), 0)
        group_id = str(payload.get("episode_group_id") or "").strip()
        target_path = str(payload.get("target_path") or "").strip()
        if not tmdb_id or not group_id:
            return schemas.Response(success=False, message="请选择剧集组维护规则")
        if not target_path:
            return schemas.Response(success=False, message="请输入 MP 整理后的实际文件路径")
        rule = next((
            item for item in self._read_episode_rules()
            if item.get("enabled", True)
            and self._safe_int(item.get("tmdb_id"), 0) == tmdb_id
            and item.get("target_type") == "group"
            and str(item.get("episode_group_id") or "") == group_id
        ), None)
        if not rule:
            return schemas.Response(success=False, message="该 TMDBID 当前没有匹配的剧集组维护规则")
        config = self._emby_sync_runtime_config()
        requested_servers = [str(value) for value in payload.get("servers") or [] if str(value).strip()]
        if requested_servers:
            config["servers"] = requested_servers
        outcome = self._emby_sync.reconcile(
            job={
                "tmdb_id": tmdb_id,
                "episode_group_id": group_id,
                "title": rule.get("title") or f"TMDB {tmdb_id}",
                "target_path": target_path,
            },
            config=config,
            dry_run=True,
        )
        return schemas.Response(success=True, data=outcome)

    def apply_all_emby_sync_api(self, payload: dict = Body(...)) -> schemas.Response:
        """用户明确确认后，将剧集组幂等写入所选 Emby 的全部同 TMDBID Series。"""
        payload = payload or {}
        tmdb_id = self._safe_int(payload.get("tmdb_id"), 0)
        group_id = str(payload.get("episode_group_id") or "").strip()
        target_path = str(payload.get("target_path") or "").strip()
        requested_servers = [str(value) for value in payload.get("servers") or [] if str(value).strip()]
        if not tmdb_id or not group_id:
            return schemas.Response(success=False, message="请选择剧集组维护规则")
        if not requested_servers:
            return schemas.Response(success=False, message="请选择要修改全部候选的 Emby")
        available_servers = {
            str(item.get("name") or "")
            for item in self._emby_sync.server_catalog()
            if item.get("connected") and str(item.get("name") or "")
        }
        unavailable_servers = [name for name in requested_servers if name not in available_servers]
        if unavailable_servers:
            return schemas.Response(
                success=False,
                message=f"Emby 当前不可用或配置已变化：{'、'.join(unavailable_servers)}",
            )
        rule = next((
            item for item in self._read_episode_rules()
            if item.get("enabled", True)
            and self._safe_int(item.get("tmdb_id"), 0) == tmdb_id
            and item.get("target_type") == "group"
            and str(item.get("episode_group_id") or "") == group_id
        ), None)
        if not rule:
            return schemas.Response(success=False, message="该 TMDBID 当前没有匹配的剧集组维护规则")
        config = self._emby_sync_runtime_config()
        config["servers"] = requested_servers
        outcome = self._emby_sync.reconcile(
            job={
                "tmdb_id": tmdb_id,
                "episode_group_id": group_id,
                "title": rule.get("title") or f"TMDB {tmdb_id}",
                "target_path": target_path,
            },
            config=config,
            dry_run=False,
            all_matches=True,
        )
        return schemas.Response(success=True, data=outcome)

    def retry_emby_sync_api(self, payload: dict = Body(...)) -> schemas.Response:
        """重置一个或全部未成功任务，并立即唤醒后台工作器。"""
        job_id = str((payload or {}).get("job_id") or "").strip()
        changed = 0
        with self._emby_sync_lock:
            jobs = self._read_emby_sync_jobs()
            for job in jobs:
                if job_id and str(job.get("id")) != job_id:
                    continue
                if job.get("status") == "completed":
                    continue
                job["status"] = "pending"
                job["reason"] = "用户请求重新检查"
                job["attempts"] = 0
                job["next_attempt_ts"] = time.time()
                job["server_results"] = {
                    name: result for name, result in (job.get("server_results") or {}).items()
                    if result.get("status") in EmbyEpisodeGroupSynchronizer.SUCCESS_STATUSES
                }
                job["history_logged"] = False
                changed += 1
            self._save_emby_sync_jobs(jobs)
        self._emby_sync_wakeup.set()
        return schemas.Response(
            success=True,
            message=f"已重新排队 {changed} 个任务",
            data=self._emby_sync_status_data(include_jobs=True),
        )

    def delete_emby_sync_job_api(self, payload: dict = Body(...)) -> schemas.Response:
        """删除单个任务，或清理全部已结束任务。"""
        job_id = str((payload or {}).get("job_id") or "").strip()
        finished_only = bool((payload or {}).get("finished_only", not bool(job_id)))
        with self._emby_sync_lock:
            jobs = self._read_emby_sync_jobs()
            before = len(jobs)
            if job_id:
                jobs = [item for item in jobs if str(item.get("id")) != job_id]
            elif finished_only:
                jobs = [item for item in jobs if item.get("status") in {"pending", "running"}]
            else:
                jobs = []
            self._save_emby_sync_jobs(jobs)
        return schemas.Response(
            success=True,
            message=f"已删除 {before - len(jobs)} 个任务",
            data=self._emby_sync_status_data(include_jobs=True),
        )

    def get_strm_sync_api(self) -> schemas.Response:
        """返回神医媒体信息推送设置、服务目录和持久任务。"""
        # 页面刷新同时承担轻量健康检查：配置要求运行但线程意外退出时，
        # 无需重启 MoviePilot 即可自动拉起工作器。
        self._sync_strm_worker_state()
        return schemas.Response(success=True, data=self._strm_sync_status_data(include_jobs=True))

    def save_strm_sync_config_api(self, payload: dict = Body(...)) -> schemas.Response:
        """独立保存神医推送设置，与主设置页解耦。"""
        payload = payload or {}
        updates = {
            "strm_media_info_sync_enabled": payload.get("enabled"),
            "strm_media_info_sync_servers": payload.get("servers"),
            "strm_media_info_sync_initial_delay_seconds": payload.get("initial_delay_seconds"),
            "strm_media_info_sync_retry_seconds": payload.get("retry_seconds"),
            "strm_media_info_sync_max_wait_minutes": payload.get("max_wait_minutes"),
            "strm_media_info_sync_path_mappings": payload.get("path_mappings"),
        }
        with self._config_lock:
            merged = {**self._config, **{key: value for key, value in updates.items() if value is not None}}
            self._config = self._normalize_config(merged)
            self.update_config(self._current_config())
        self._sync_strm_worker_state()
        return self.get_strm_sync_api()

    def preview_strm_sync_api(self, payload: dict = Body(...)) -> schemas.Response:
        """对单个容器内文件立即扫描并推送到所选 Emby，返回每台服务器结果。

        这是实际推送（神医接口没有干跑模式），用于验证 Pro 接口连通性。
        """
        payload = payload or {}
        source_path = str(payload.get("source_path") or "").strip()
        target_path = str(payload.get("target_path") or source_path).strip()
        if not source_path:
            return schemas.Response(success=False, message="请输入 MoviePilot 容器内可读取的媒体文件路径")
        probe_result = self._media_probe.probe(
            source_path,
            timeout=self._safe_int(self._config.get("media_probe_timeout"), 12),
            executable_path=self._config.get("media_probe_executable"),
            iso_executable_path=self._iso_executable(),
            force=True,
        )
        raw = probe_result.get("raw")
        if not probe_result.get("success") or not isinstance(raw, dict):
            return schemas.Response(
                success=False,
                message=str(probe_result.get("reason") or "媒体流扫描失败"),
            )
        sync_payload = build_sync_payload(
            raw,
            size=self._safe_int(probe_result.get("source_size"), 0) or None,
            file_name=Path(target_path).name,
        )
        if not media_info_acceptable(sync_payload[0]):
            return schemas.Response(success=False, message="扫描结果缺少大小或时长，神医会拒绝该媒体信息")
        config = self._strm_sync_runtime_config()
        requested_servers = [str(value) for value in payload.get("servers") or [] if str(value).strip()]
        if requested_servers:
            config["servers"] = requested_servers
        outcome = self._strm_sync.push(
            job={"target_path": target_path, "sync_payload": sync_payload},
            config=config,
        )
        source = sync_payload[0].get("MediaSourceInfo") or {}
        return schemas.Response(success=True, data={
            **outcome,
            "payload_summary": {
                "container": source.get("Container"),
                "size": source.get("Size"),
                "runtime_ticks": source.get("RunTimeTicks"),
                "stream_count": len(source.get("MediaStreams") or []),
                "chapter_count": len(sync_payload[0].get("Chapters") or []),
            },
        })

    def retry_strm_sync_api(self, payload: dict = Body(...)) -> schemas.Response:
        """重置一个或全部未成功推送任务并唤醒工作器。"""
        job_id = str((payload or {}).get("job_id") or "").strip()
        changed = 0
        with self._strm_sync_lock:
            jobs = self._read_strm_sync_jobs()
            for job in jobs:
                if job_id and str(job.get("id")) != job_id:
                    continue
                if job.get("status") == "completed":
                    continue
                job["status"] = "pending"
                job["reason"] = "用户请求重新推送"
                job["attempts"] = 0
                job["created_ts"] = time.time()
                job["next_attempt_ts"] = time.time()
                job["server_results"] = {
                    name: result for name, result in (job.get("server_results") or {}).items()
                    if result.get("status") in StrmMediaInfoSynchronizer.SUCCESS_STATUSES
                }
                changed += 1
            self._save_strm_sync_jobs(jobs)
        self._strm_sync_wakeup.set()
        return schemas.Response(
            success=True,
            message=f"已重新排队 {changed} 个任务",
            data=self._strm_sync_status_data(include_jobs=True),
        )

    def delete_strm_sync_job_api(self, payload: dict = Body(...)) -> schemas.Response:
        """删除单个推送任务，或清理全部已结束任务。"""
        job_id = str((payload or {}).get("job_id") or "").strip()
        finished_only = bool((payload or {}).get("finished_only", not bool(job_id)))
        with self._strm_sync_lock:
            jobs = self._read_strm_sync_jobs()
            before = len(jobs)
            if job_id:
                jobs = [item for item in jobs if str(item.get("id")) != job_id]
            elif finished_only:
                jobs = [item for item in jobs if item.get("status") in {"pending", "running"}]
            else:
                jobs = []
            self._save_strm_sync_jobs(jobs)
        return schemas.Response(
            success=True,
            message=f"已删除 {before - len(jobs)} 个任务",
            data=self._strm_sync_status_data(include_jobs=True),
        )

    def save_episode_rule_api(self, payload: dict = Body(...)) -> schemas.Response:
        """新增或更新一个 TMDBID 的目标编集规则。"""
        payload = payload or {}
        original_tmdb_id = self._safe_int(payload.get("original_tmdb_id"), 0)
        try:
            rule = self._normalize_episode_rule(payload)
        except ValueError as err:
            return schemas.Response(success=False, message=str(err))
        if original_tmdb_id and original_tmdb_id != rule["tmdb_id"]:
            try:
                info = self._tmdb_api.get_info(mtype=MediaType.TV, tmdbid=rule["tmdb_id"]) or {}
            except Exception as err:
                return schemas.Response(success=False, message=f"读取新 TMDBID 失败：{err}")
            if not info:
                return schemas.Response(success=False, message="新的 TMDBID 不存在或不是电视剧")
            rule["title"] = str(
                info.get("name") or info.get("title") or rule.get("title") or f"TMDB {rule['tmdb_id']}"
            ).strip()
            if rule["target_type"] == "group":
                try:
                    groups = self._normalizer().inspect(rule["tmdb_id"]).get("groups") or []
                except Exception as err:
                    return schemas.Response(success=False, message=f"校验新 TMDBID 的剧集组失败：{err}")
                if rule["episode_group_id"] not in {
                    str(group.get("id") or "") for group in groups if isinstance(group, dict)
                }:
                    return schemas.Response(
                        success=False,
                        message="TMDBID 已更改，请读取新编集并重新选择目标剧集组",
                    )
        rules = self._read_episode_rules()
        replaced_ids = {rule["tmdb_id"]}
        if original_tmdb_id:
            replaced_ids.add(original_tmdb_id)
        rules = [
            item for item in rules
            if self._safe_int(item.get("tmdb_id"), 0) not in replaced_ids
        ]
        rules.append(rule)
        rules.sort(key=lambda item: (str(item.get("title") or ""), item.get("tmdb_id") or 0))
        self.save_data(self.DATA_KEY_EPISODE_RULES, rules)
        if original_tmdb_id and original_tmdb_id != rule["tmdb_id"]:
            self._replace_catalog_tmdb_match(
                original_tmdb_id=original_tmdb_id,
                tmdb_id=rule["tmdb_id"],
                title=rule["title"],
            )
        if self._episode_normalizer:
            self._episode_normalizer.clear_cache()
        return schemas.Response(
            success=True,
            data={"rule": rule, "rules": rules, "original_tmdb_id": original_tmdb_id or rule["tmdb_id"]},
        )

    def delete_episode_rule_api(self, payload: dict = Body(...)) -> schemas.Response:
        """按 TMDBID 删除目标编集规则。"""
        tmdb_id = self._safe_int((payload or {}).get("tmdb_id"), 0)
        if not tmdb_id:
            return schemas.Response(success=False, message="缺少有效的 TMDBID")
        rules = [
            item for item in self._read_episode_rules()
            if self._safe_int(item.get("tmdb_id"), 0) != tmdb_id
        ]
        self.save_data(self.DATA_KEY_EPISODE_RULES, rules)
        return schemas.Response(success=True, data={"rules": rules})

    def batch_delete_episode_rules_api(self, payload: dict = Body(...)) -> schemas.Response:
        """一次删除界面当前筛选出的维护规则。"""
        tmdb_ids = {
            self._safe_int(value, 0) for value in (payload or {}).get("tmdb_ids") or []
            if self._safe_int(value, 0)
        }
        if not tmdb_ids:
            return schemas.Response(success=False, message="没有可删除的维护规则")
        existing = self._read_episode_rules()
        rules = [
            item for item in existing
            if self._safe_int(item.get("tmdb_id"), 0) not in tmdb_ids
        ]
        deleted = len(existing) - len(rules)
        self.save_data(self.DATA_KEY_EPISODE_RULES, rules)
        if self._episode_normalizer:
            self._episode_normalizer.clear_cache()
        return schemas.Response(
            success=True,
            message=f"已删除 {deleted} 条维护规则",
            data={"rules": rules, "deleted": deleted},
        )

    def manual_add_episode_rule_api(self, payload: dict = Body(...)) -> schemas.Response:
        """看板外按 TMDBID 建立规则，并尽可能从 TMDB 季信息推断季度。"""
        payload = payload or {}
        tmdb_id = self._safe_int(payload.get("tmdb_id"), 0)
        if not tmdb_id:
            return schemas.Response(success=False, message="请输入有效的 TMDBID")
        requested_quarter = str(payload.get("quarter") or "").strip().upper()
        if requested_quarter and not re.fullmatch(r"\d{4}-Q[1-4]", requested_quarter):
            return schemas.Response(success=False, message="季度格式应为 2026-Q3")
        try:
            info = self._tmdb_api.get_info(mtype=MediaType.TV, tmdbid=tmdb_id) or {}
        except Exception as err:
            return schemas.Response(success=False, message=f"读取 TMDB {tmdb_id} 失败：{err}")
        if not info:
            return schemas.Response(success=False, message=f"TMDB {tmdb_id} 不存在或不是电视剧")

        item, inferred_quarter = self._manual_catalog_item(
            tmdb_id=tmdb_id,
            info=info,
            quarter=requested_quarter,
        )
        if not requested_quarter and not inferred_quarter:
            return schemas.Response(
                success=True,
                message="TMDB 没有可用的季首播日期，请补充季度",
                data={
                    "requires_quarter": True,
                    "tmdb_id": tmdb_id,
                    "title": item.get("display_name") or item.get("name"),
                },
            )
        rules = self._read_episode_rules()
        try:
            outcome = self._add_catalog_item_to_rules(
                item=item,
                preference=str(payload.get("preference") or "default"),
                rules=rules,
                tmdb_id_override=tmdb_id,
            )
        except ValueError as err:
            return schemas.Response(success=False, message=str(err))
        self.save_data(self.DATA_KEY_EPISODE_RULES, rules)
        return schemas.Response(
            success=True,
            message=outcome.get("message") or "已加入维护规则",
            data={
                **outcome,
                "rules": rules,
                "quarter": inferred_quarter or requested_quarter,
                "quarter_inferred": not bool(requested_quarter),
                "requires_quarter": False,
            },
        )

    def inspect_episode_target_api(self, payload: dict = Body(...)) -> schemas.Response:
        """读取 TMDB 默认季和剧集组，供用户选择目标编集。"""
        tmdb_id = self._safe_int((payload or {}).get("tmdb_id"), 0)
        if not tmdb_id:
            return schemas.Response(success=False, message="请输入有效的 TMDBID")
        try:
            normalizer = self._normalizer()
            normalizer.clear_cache()
            return schemas.Response(success=True, data=normalizer.inspect(tmdb_id))
        except Exception as err:
            logger.error(f"[TMDB识别增强] 获取 TMDB {tmdb_id} 编集失败：{err}")
            return schemas.Response(success=False, message=f"获取目标编集失败：{err}")

    def preview_episode_normalizer_api(self, payload: dict = Body(...)) -> schemas.Response:
        """只接收原标题，自动完成解析、TMDB 匹配和已维护规则试跑。"""
        payload = payload or {}
        raw_title = self._clean_title(payload.get("title"))
        if not raw_title:
            return schemas.Response(success=False, message="请输入需要试跑的原标题")
        parsed_title, hints = self._prepare_recognition_input(raw_title)
        try:
            recognition = self._recognize_title(parsed_title, hints=hints, include_candidates=False)
        except Exception as err:
            return schemas.Response(success=False, message=f"TMDB 匹配失败：{err}")
        best = recognition.get("best") or {}
        if not recognition.get("accepted") or not best.get("tmdb_id"):
            return schemas.Response(
                success=True,
                data={
                    "title": raw_title,
                    "parsed_title": parsed_title,
                    "hints": self._serialize_hints(hints),
                    "recognition": recognition,
                    "rule": None,
                    "result": None,
                },
            )
        tmdb_id = self._safe_int(best.get("tmdb_id"), 0)
        rule = next((
            item for item in self._read_episode_rules()
            if self._safe_int(item.get("tmdb_id"), 0) == tmdb_id
        ), None)
        if not rule:
            return schemas.Response(
                success=True,
                data={
                    "title": raw_title,
                    "parsed_title": parsed_title,
                    "hints": self._serialize_hints(hints),
                    "recognition": recognition,
                    "rule": None,
                    "result": {
                        "applied": False,
                        "season": hints.get("season"),
                        "episode": hints.get("episode"),
                        "end_episode": hints.get("end_episode"),
                        "strategy": "rule-missing",
                        "reason": f"TMDB {tmdb_id} 尚未加入维护规则",
                    },
                },
            )
        result = self._normalizer().normalize(
            rule=rule,
            season=self._optional_int(hints.get("season")),
            episode=self._optional_int(hints.get("episode")),
            end_episode=self._optional_int(hints.get("end_episode")),
            raw_title=raw_title,
            parsed_name=parsed_title,
        )
        return schemas.Response(
            success=True,
            data={
                "title": raw_title,
                "parsed_title": parsed_title,
                "hints": self._serialize_hints(hints),
                "recognition": recognition,
                "rule": rule,
                "result": result,
            },
        )

    def query_season_catalog_api(self, payload: dict = Body(...)) -> schemas.Response:
        """选择季度即返回 AniList 看板，并优先用本地跨站数据库映射 TMDB。"""
        payload = payload or {}
        year = self._safe_int(payload.get("year"), datetime.now().year)
        quarter = self._safe_int(payload.get("quarter"), 1)
        if year < 1900 or year > 2099 or quarter not in (1, 2, 3, 4):
            return schemas.Response(success=False, message="年份或季度无效")
        headers = {
            "User-Agent": (
                "NNeiru/TmdbRecognizeEnhancer-Plugin "
                "(https://github.com/NNeiru/TmdbRecognizeEnhancer-Plugin)"
            ),
            "Accept": "application/json",
        }
        quarter_key = f"{year}-Q{quarter}"
        cache = self._read_season_catalog_cache()
        cached = cache.get(quarter_key) or {}
        catalog = cached.get("items") if isinstance(cached, dict) else None
        source_outdated = bool(catalog) and any(
            str(item.get("source") or "") not in ("anilist", "bangumi", "tmdb-discover")
            for item in catalog if isinstance(item, dict)
        )
        schema_outdated = self._safe_int(cached.get("schema_version"), 0) != self.CATALOG_SCHEMA_VERSION
        refreshed = (
            bool(payload.get("refresh")) or not isinstance(catalog, list)
            or source_outdated or schema_outdated
        )
        if refreshed:
            try:
                raw_items = self._fetch_anilist_quarter(year, quarter, headers)
            except Exception as err:
                logger.error(f"[TMDB识别增强] 查询 {quarter_key} AniList 看板失败：{err}")
                return schemas.Response(success=False, message=f"季度看板加载失败：{err}")
            catalog = []
            for raw_item in raw_items:
                item = self._normalize_anilist_media(raw_item, quarter_key)
                if not item:
                    continue
                catalog.append(item)
            catalog.sort(
                key=lambda item: (
                    str(item.get("date") or "9999-99-99"),
                    self._safe_int(item.get("popularity"), 0),
                ),
            )
            for item in catalog:
                item["scan_status"] = "scanning"
                item.pop("scan_error", None)
            self._save_season_catalog_quarter(quarter_key, catalog)

        initialized_scan_status = False
        for item in catalog or []:
            if not item.get("scan_status"):
                item["scan_status"] = "scanning"
                initialized_scan_status = True
        if initialized_scan_status:
            self._save_season_catalog_quarter(quarter_key, catalog)
        if any(str(item.get("scan_status") or "") == "scanning" for item in catalog or []):
            self._start_catalog_scan(quarter_key)

        episode_rules = self._read_episode_rules()
        approvals = self._read_notification_approvals()
        ignored_ids = {
            str(value) for value in approvals.get("ignored") or []
        }
        ignored_keys = {
            str(value) for value in approvals.get("ignored_keys") or []
        }
        view = []
        for item in deepcopy(catalog or []):
            maintained_tmdb_id = self._catalog_maintained_tmdb_id(
                item, episode_rules,
            )
            item["maintained"] = bool(maintained_tmdb_id)
            item["maintained_tmdb_id"] = maintained_tmdb_id or None
            item["notification_ignored"] = (
                str(item.get("id") or "") in ignored_ids
                or bool(
                    self._notification_candidate_identity_keys(item)
                    .intersection(ignored_keys)
                )
            )
            view.append(item)
        scanning_count = sum(1 for item in view if item.get("scan_status") == "scanning")
        matched_count = sum(1 for item in view if item.get("scan_status") == "matched")
        failed_count = sum(1 for item in view if item.get("scan_status") == "failed")
        return schemas.Response(
            success=True,
            data={
                "quarter": quarter_key,
                "catalog": view,
                "count": len(view),
                "cached": not refreshed,
                "scanning_count": scanning_count,
                "matched_count": matched_count,
                "failed_count": failed_count,
                "updated_at": (cache.get(quarter_key) or {}).get("updated_at") if not refreshed else datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            },
        )

    def _fetch_anilist_quarter(
            self, year: int, quarter: int, headers: Dict[str, str]
    ) -> List[Dict[str, Any]]:
        """分页读取 AniList 季度目录；地区、载体和续作关系均来自同一响应。"""
        season = {1: "WINTER", 2: "SPRING", 3: "SUMMER", 4: "FALL"}[quarter]
        query = """
        query($page:Int,$season:MediaSeason,$year:Int){
          Page(page:$page,perPage:50){
            pageInfo{hasNextPage}
            media(type:ANIME,season:$season,seasonYear:$year,sort:[START_DATE,POPULARITY_DESC],isAdult:false){
              id idMal title{romaji english native} synonyms format countryOfOrigin episodes popularity genres
              startDate{year month day} coverImage{large medium} siteUrl
              relations{edges{relationType node{id type format startDate{year}}}}
            }
          }
        }
        """
        items: List[Dict[str, Any]] = []
        request = RequestUtils(
            headers=headers,
            proxies=self._valid_proxies(getattr(settings, "PROXY", None)),
            timeout=30,
        )
        for page in range(1, 6):
            response = request.post_res(
                "https://graphql.anilist.co",
                json={"query": query, "variables": {"page": page, "season": season, "year": year}},
            )
            if not response:
                raise RuntimeError(f"AniList API 第 {page} 页未返回响应")
            response.raise_for_status()
            raw = response.json()
            if raw.get("errors"):
                raise RuntimeError(str(raw["errors"][0].get("message") or "AniList GraphQL 查询失败"))
            page_data = ((raw.get("data") or {}).get("Page") or {})
            media = page_data.get("media") or []
            if not isinstance(media, list):
                raise RuntimeError("AniList API 返回了无法识别的数据结构")
            items.extend(item for item in media if isinstance(item, dict))
            if not (page_data.get("pageInfo") or {}).get("hasNextPage"):
                break
        return items

    def _enrich_bangumi_chinese_titles(
            self,
            year: int,
            quarter: int,
            catalog: List[Dict[str, Any]],
            headers: Dict[str, str],
    ) -> None:
        """仅使用 Bangumi 原名→中文名覆盖显示层，不参与地区和续作判断。"""
        month = 1 + (quarter - 1) * 3
        request = RequestUtils(
            headers=headers,
            proxies=self._valid_proxies(getattr(settings, "PROXY", None)),
            timeout=25,
        )
        subjects: List[Dict[str, Any]] = []
        for current_month in range(month, month + 3):
            offset = 0
            total: Optional[int] = None
            while total is None or offset < total:
                response = request.get_res(
                    "https://api.bgm.tv/v0/subjects"
                    f"?type=2&sort=date&year={year}&month={current_month}"
                    f"&limit=100&offset={offset}"
                )
                if not response:
                    break
                response.raise_for_status()
                raw = response.json()
                page = raw.get("data") if isinstance(raw, dict) else []
                if not isinstance(page, list):
                    break
                subjects.extend(value for value in page if isinstance(value, dict))
                total = self._safe_int(raw.get("total"), len(subjects)) if isinstance(raw, dict) else len(page)
                offset += len(page)
                if not page or offset >= 500:
                    break
        alias_index: Dict[str, Dict[str, Any]] = {}
        for item in catalog:
            for alias in item.get("aliases") or []:
                normalized = self._normalize_text(alias)
                if normalized:
                    alias_index.setdefault(normalized, item)
        for subject in subjects:
            original = self._clean_title(subject.get("name"))
            chinese = self._clean_title(subject.get("name_cn"))
            item = alias_index.get(self._normalize_text(original))
            if item:
                if chinese:
                    item["name_cn"] = chinese
                    item["display_name"] = chinese
                    item["aliases"] = list(dict.fromkeys([*(item.get("aliases") or []), chinese]))
                continue
            normalized = self._normalize_bangumi_subject(subject, f"{year}-Q{quarter}")
            if not normalized or normalized.get("region") not in ("china", "western"):
                continue
            normalized["scan_status"] = "scanning"
            bangumi_platform = str(normalized.get("platform") or "").upper()
            normalized["catalog_media_type"] = (
                "movie" if bangumi_platform == "MOVIE" or "剧场" in bangumi_platform else "tv"
            )
            normalized["rule_eligible"] = normalized["catalog_media_type"] == "tv"
            catalog.append(normalized)

    def _start_catalog_scan(self, quarter: str) -> None:
        """启动一个季度的后台 TMDB 扫描；同一季度同一时刻只运行一个任务。"""
        with self._catalog_lock:
            if quarter in self._catalog_scans:
                return
            cache = self._read_season_catalog_cache()
            data = cache.get(quarter) or {}
            items = data.get("items") if isinstance(data, dict) else []
            pending = [
                deepcopy(item) for item in items or []
                if str(item.get("scan_status") or "scanning") == "scanning"
            ]
            if not pending:
                return
            self._catalog_scans.add(quarter)
        threading.Thread(
            target=self._scan_catalog_worker,
            args=(quarter, pending),
            name=f"tmdb-catalog-{quarter}",
            daemon=True,
        ).start()

    def _enrich_tmdb_animation_catalog(
            self, year: int, quarter: int, catalog: List[Dict[str, Any]]
    ) -> None:
        """用 TMDB 动画发现补充 AniList 较少覆盖的国漫和欧美动画。"""
        start_month = 1 + (quarter - 1) * 3
        end_month = start_month + 2
        date_from = f"{year}-{start_month:02d}-01"
        date_to = f"{year}-{end_month:02d}-{monthrange(year, end_month)[1]:02d}"
        existing_tmdb = {
            self._safe_int(((item.get("tmdb_match") or {}).get("best") or {}).get("tmdb_id"), 0)
            for item in catalog
        }
        api = TmdbApi(language="zh-CN")
        try:
            for region, countries in (("china", ("CN",)), ("western", ("US", "GB", "CA"))):
                region_added = 0
                for country in countries:
                    if region_added >= 80:
                        break
                    for media_type in (MediaType.TV, MediaType.MOVIE):
                        if region_added >= 80:
                            break
                        pages = (1, 2) if media_type == MediaType.TV else (1,)
                        for page in pages:
                            if region_added >= 80:
                                break
                            params = {
                                "sort_by": "popularity.desc",
                                "with_genres": "16",
                                "with_origin_country": country,
                                "page": page,
                            }
                            if media_type == MediaType.TV:
                                params.update({"first_air_date.gte": date_from, "first_air_date.lte": date_to})
                                results = api.discover_tvs(params) or []
                            else:
                                params.update({"primary_release_date.gte": date_from, "primary_release_date.lte": date_to})
                                results = api.discover_movies(params) or []
                            if not results:
                                break
                            for raw in results:
                                tmdb_id = self._safe_int(raw.get("id"), 0)
                                if not tmdb_id or tmdb_id in existing_tmdb:
                                    continue
                                title = self._clean_title(raw.get("name") or raw.get("title"))
                                original = self._clean_title(raw.get("original_name") or raw.get("original_title"))
                                air_date = str(raw.get("first_air_date") or raw.get("release_date") or "")
                                if not title and not original:
                                    continue
                                aliases = list(dict.fromkeys(value for value in (title, original) if value))
                                catalog.append({
                                    "id": f"tmdb:{media_type.value}:{tmdb_id}",
                                    "source": "tmdb-discover",
                                    "source_id": tmdb_id,
                                    "quarter": f"{year}-Q{quarter}",
                                    "name": original or title,
                                    "name_cn": title if re.search(r"[\u3400-\u9fff]", title) else "",
                                    "display_name": title or original,
                                    "aliases": aliases,
                                    "search_titles": aliases,
                                    "date": air_date,
                                    "episode_count": 0,
                                    "platform": "TV" if media_type == MediaType.TV else "MOVIE",
                                    "catalog_media_type": "tv" if media_type == MediaType.TV else "movie",
                                    "rule_eligible": media_type == MediaType.TV,
                                    "region": region,
                                    "region_name": "国漫" if region == "china" else "海外动画",
                                    "country": country,
                                    "genres": ["Animation"],
                                    "is_multi_season": False,
                                    "has_prequel": False,
                                    "franchise_start_year": self._safe_int(air_date[:4], 0),
                                    "popularity": raw.get("popularity") or 0,
                                    "poster": (
                                        f"https://image.tmdb.org/t/p/w500{raw.get('poster_path')}"
                                        if str(raw.get("poster_path") or "").startswith("/")
                                        else str(raw.get("poster_path") or "")
                                    ),
                                    "scan_status": "scanning",
                                    "tmdb_match": {
                                        "accepted": True, "attempted": True,
                                        "reason": "TMDB 动画发现直接映射",
                                        "best": {
                                            "tmdb_id": tmdb_id,
                                            "name": title or original,
                                            "year": air_date[:4],
                                            "media_type": media_type.value,
                                            "score": 100.0,
                                            "source": "tmdb-discover",
                                        },
                                    },
                                })
                                existing_tmdb.add(tmdb_id)
                                region_added += 1
        finally:
            try:
                api.close()
            except Exception:
                pass

    def _merge_catalog_source_items(self, quarter: str, source_items: List[Dict[str, Any]]) -> None:
        """把后台补充来源安全合并进季度缓存，供前端轮询即时看到。"""
        with self._catalog_lock:
            cache = self._read_season_catalog_cache()
            data = cache.get(quarter) or {}
            current = data.get("items") if isinstance(data, dict) else []
            index = {str(item.get("id")): item for item in current or []}
            for source in source_items:
                item_id = str(source.get("id") or "")
                if not item_id:
                    continue
                if item_id in index:
                    current_match = index[item_id].get("tmdb_match") or {}
                    user_locked = str(current_match.get("reason") or "").startswith("用户")
                    for key in ("display_name", "name_cn", "aliases", "tmdb_match", "scan_status"):
                        if user_locked and key in ("display_name", "name_cn", "aliases", "tmdb_match"):
                            continue
                        if key in source:
                            index[item_id][key] = deepcopy(source[key])
                else:
                    current.append(deepcopy(source))
                    index[item_id] = current[-1]
            current.sort(key=lambda item: (str(item.get("date") or "9999-99-99"), str(item.get("display_name") or item.get("name") or "")))
            data["items"] = current
            data["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cache[quarter] = data
            self.save_data(self.DATA_KEY_SEASON_CATALOG, cache)

    def _scan_catalog_worker(self, quarter: str, items: List[Dict[str, Any]]) -> None:
        """并发扫描 TMDB，逐条合并结果，避免覆盖用户同期写入的看板数据。"""
        try:
            match = re.fullmatch(r"(\d{4})-Q([1-4])", quarter)
            if match:
                year, season = int(match.group(1)), int(match.group(2))
                headers = {
                    "User-Agent": (
                        "NNeiru/TmdbRecognizeEnhancer-Plugin "
                        "(https://github.com/NNeiru/TmdbRecognizeEnhancer-Plugin)"
                    ),
                    "Accept": "application/json",
                }
                # AniList 看板天然携带稳定 ID，先查本地数据库；绝大多数日漫
                # 到这里即可得到 Series，不需要发起任何标题搜索。
                self._enrich_cross_id_catalog_mappings(items)
                with ThreadPoolExecutor(max_workers=2, thread_name_prefix="catalog-source") as source_executor:
                    source_futures = {
                        source_executor.submit(self._enrich_anibridge_mappings, items, headers): "AniBridge 映射",
                        source_executor.submit(
                            self._enrich_bangumi_chinese_titles, year, season, items, headers,
                        ): "Bangumi 中文标题",
                    }
                    for future in as_completed(source_futures):
                        try:
                            future.result()
                        except Exception as err:
                            logger.warning(
                                f"[TMDB识别增强] {source_futures[future]}后台加载失败：{err}"
                            )
                # Bangumi 补源会追加国漫/海外条目，再补查一次它们的稳定 ID。
                self._enrich_cross_id_catalog_mappings(items)
                try:
                    self._enrich_tmdb_animation_catalog(year, season, items)
                except Exception as err:
                    logger.warning(f"[TMDB识别增强] TMDB 国漫/欧美动画目录补充失败：{err}")
                self._merge_catalog_source_items(quarter, items)
            with ThreadPoolExecutor(max_workers=min(6, len(items)), thread_name_prefix="tmdb-scan") as executor:
                futures = {executor.submit(self._scan_catalog_item, item): item for item in items}
                for future in as_completed(futures):
                    item = futures[future]
                    try:
                        updated = future.result()
                    except Exception as err:
                        item["scan_status"] = "failed"
                        item["scan_error"] = str(err)
                        updated = item
                    self._merge_catalog_scan_item(quarter, updated)
            # 季度扫描只负责刷新缓存。存量候选由计划批次汇总，只有基线之后
            # 新增或由失败转为成功的条目才走实时单条通知。
            self._monitor_notification_candidates(quarter)
        finally:
            with self._catalog_lock:
                self._catalog_scans.discard(quarter)

    def _scan_catalog_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """完成单条快速匹配及本地化详情补充。"""
        match = item.get("tmdb_match") or {}
        locked_tmdb_id = (
            self._safe_int(item.get("manual_tmdb_id"), 0)
            or self._catalog_maintained_tmdb_id(item)
        )
        if locked_tmdb_id:
            match = {
                "accepted": True,
                "attempted": True,
                "reason": "用户指定或已维护规则锁定 TMDBID",
                "margin": 100.0,
                "best": {
                    "tmdb_id": locked_tmdb_id,
                    "name": (
                        (match.get("best") or {}).get("name")
                        or item.get("display_name")
                        or item.get("name_cn")
                        or item.get("name")
                        or f"TMDB {locked_tmdb_id}"
                    ),
                    "media_type": MediaType.TV.value,
                    "score": 100.0,
                    "source": "user-maintained",
                },
            }
        if not match.get("accepted"):
            match = self._fast_catalog_tmdb_match(item)
        tmdb_id = self._safe_int((match.get("best") or {}).get("tmdb_id"), 0)
        if not tmdb_id:
            raise ValueError("未获得有效 TMDBID")
        media_type = self._normalize_media_type((match.get("best") or {}).get("media_type")) or MediaType.TV
        api = TmdbApi()
        try:
            info = api.get_info(mtype=media_type, tmdbid=tmdb_id) or {}
        finally:
            try:
                api.close()
            except Exception:
                pass
        if not info:
            raise ValueError(f"TMDB {tmdb_id} 不存在或媒体类型不匹配")
        localized = self._clean_title(info.get("name") or info.get("title"))
        if localized:
            item["display_name"] = item.get("name_cn") or localized
            if re.search(r"[\u3400-\u9fff]", localized):
                item["name_cn"] = localized
                item["display_name"] = localized
            item["aliases"] = list(dict.fromkeys([*(item.get("aliases") or []), localized]))
            match["best"]["name"] = localized
        seasons = [
            season for season in info.get("seasons") or []
            if self._safe_int(season.get("season_number"), 0) > 0
        ] if media_type == MediaType.TV else []
        item["is_multi_season"] = bool(item.get("is_multi_season") or len(seasons) > 1)
        item["rule_eligible"] = media_type == MediaType.TV
        item["matched_media_type"] = media_type.value
        match["season_count"] = len(seasons)
        item["tmdb_match"] = match
        item["scan_status"] = "matched"
        item.pop("scan_error", None)
        return item

    def _merge_catalog_scan_item(self, quarter: str, updated: Dict[str, Any]) -> None:
        """只合并扫描字段，保留用户同时执行的规则添加和其它缓存变化。"""
        with self._catalog_lock:
            cache = self._read_season_catalog_cache()
            data = cache.get(quarter) or {}
            items = data.get("items") if isinstance(data, dict) else []
            current = next((item for item in items or [] if item.get("id") == updated.get("id")), None)
            if not current:
                return
            current_match = current.get("tmdb_match") or {}
            user_locked = (
                str(current_match.get("reason") or "").startswith("用户")
                or str((current_match.get("best") or {}).get("source") or "") == "user-corrected"
            )
            for key in (
                    "tmdb_match", "scan_status", "scan_error", "is_multi_season",
                    "display_name", "name_cn", "aliases", "rule_eligible",
                    "matched_media_type", "manual_tmdb_id",
            ):
                if user_locked and key in ("tmdb_match", "display_name", "name_cn", "aliases"):
                    continue
                if key in updated:
                    current[key] = deepcopy(updated[key])
                elif key == "scan_error":
                    current.pop(key, None)
            data["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cache[quarter] = data
            self.save_data(self.DATA_KEY_SEASON_CATALOG, cache)

    def add_season_catalog_rule_api(self, payload: dict = Body(...)) -> schemas.Response:
        """单条看板项目直接匹配 TMDB 并建立目标规则。"""
        payload = payload or {}
        quarter_key = str(payload.get("quarter") or "").strip()
        item_id = str(payload.get("id") or "").strip()
        item, catalog = self._find_catalog_item(quarter_key, item_id)
        if not item:
            return schemas.Response(success=False, message="当前季度中没有找到该番剧")
        try:
            rules = self._read_episode_rules()
            outcome = self._add_catalog_item_to_rules(
                item=item,
                preference=str(payload.get("preference") or "default"),
                rules=rules,
                tmdb_id_override=self._safe_int(payload.get("tmdb_id"), 0),
            )
            self.save_data(self.DATA_KEY_EPISODE_RULES, rules)
            self._save_season_catalog_quarter(quarter_key, catalog)
            return schemas.Response(success=True, data={**outcome, "rules": rules, "item": item})
        except ValueError as err:
            self._save_season_catalog_quarter(quarter_key, catalog)
            return schemas.Response(success=False, message=str(err), data={"item": item})

    def batch_add_season_catalog_rules_api(self, payload: dict = Body(...)) -> schemas.Response:
        """批量把当前看板选择项加入规则，并逐条返回需人工补充的项目。"""
        payload = payload or {}
        quarter_key = str(payload.get("quarter") or "").strip()
        item_ids = list(dict.fromkeys(str(value) for value in payload.get("ids") or [] if value))[:200]
        if not quarter_key or not item_ids:
            return schemas.Response(success=False, message="请选择需要批量加入的番剧")
        cache = self._read_season_catalog_cache()
        quarter_data = cache.get(quarter_key) or {}
        catalog = quarter_data.get("items") if isinstance(quarter_data, dict) else []
        if not isinstance(catalog, list):
            return schemas.Response(success=False, message="当前季度看板尚未加载")
        index = {str(item.get("id")): item for item in catalog if isinstance(item, dict)}
        rules = self._read_episode_rules()
        added, failed, needs_attention = [], [], []
        preference = str(payload.get("preference") or "default")
        selected_items = [index[item_id] for item_id in item_ids if item_id in index]
        pending = [
            item for item in selected_items
            if not ((item.get("tmdb_match") or {}).get("accepted"))
        ]
        if pending:
            worker_count = min(6, len(pending))
            with ThreadPoolExecutor(max_workers=worker_count, thread_name_prefix="tmdb-catalog") as executor:
                futures = {executor.submit(self._fast_catalog_tmdb_match, item): item for item in pending}
                for future in as_completed(futures):
                    try:
                        future.result()
                    except ValueError:
                        pass
                    except Exception as err:
                        item = futures[future]
                        item["tmdb_match"] = {
                            "accepted": False,
                            "attempted": True,
                            "reason": f"快速匹配异常：{err}",
                            "best": None,
                        }
        for item_id in item_ids:
            item = index.get(item_id)
            if not item:
                failed.append({"id": item_id, "title": item_id, "reason": "看板条目不存在"})
                continue
            try:
                outcome = self._add_catalog_item_to_rules(item, preference, rules)
                added.append(outcome)
                if outcome.get("needs_attention"):
                    needs_attention.append(outcome)
            except ValueError as err:
                failed.append({
                    "id": item_id,
                    "title": item.get("display_name") or item.get("name_cn") or item.get("name") or item_id,
                    "reason": str(err),
                })
        self.save_data(self.DATA_KEY_EPISODE_RULES, rules)
        self._save_season_catalog_quarter(quarter_key, catalog)
        return schemas.Response(
            success=True,
            message=f"成功加入 {len(added)} 条，失败 {len(failed)} 条",
            data={
                "added": added,
                "failed": failed,
                "needs_attention": needs_attention,
                "rules": rules,
                "catalog": catalog,
            },
        )

    # ------------------------------------------------------------------
    # 通知接管
    # ------------------------------------------------------------------

    def _notification_active(self) -> bool:
        return bool(
            self.get_state()
            and self._config.get("notification_enhancer_enabled")
        )

    def _read_notification_records(self) -> List[Dict[str, Any]]:
        stored = self.get_data(self.DATA_KEY_NOTIFICATION_RECORDS) or []
        return deepcopy(stored) if isinstance(stored, list) else []

    def _append_notification_record(self, record: Dict[str, Any]) -> None:
        with self._notification_lock:
            records = [record, *self._read_notification_records()]
            self.save_data(
                self.DATA_KEY_NOTIFICATION_RECORDS,
                compact_records(
                    records,
                    self._safe_int(self._config.get("notification_record_limit"), 200),
                ),
            )

    def _read_notification_approvals(self) -> Dict[str, Any]:
        stored = self.get_data(self.DATA_KEY_NOTIFICATION_APPROVALS) or {}
        if not isinstance(stored, dict):
            stored = {}
        stored.setdefault("ignored", [])
        stored.setdefault("ignored_keys", [])
        stored.setdefault("notified", [])
        stored.setdefault("realtime_seen", [])
        stored.setdefault("realtime_initialized", False)
        stored.setdefault("last_batch_periods", {})
        stored.setdefault("batches", {})
        return deepcopy(stored)

    def _save_notification_approvals(self, value: Dict[str, Any]) -> None:
        ignored = list(dict.fromkeys(str(item) for item in value.get("ignored") or []))[-1000:]
        ignored_keys = list(dict.fromkeys(
            str(item) for item in value.get("ignored_keys") or []
        ))[-3000:]
        notified = list(dict.fromkeys(str(item) for item in value.get("notified") or []))[-1000:]
        realtime_seen = list(dict.fromkeys(
            str(item) for item in value.get("realtime_seen") or []
        ))[-3000:]
        batches = value.get("batches") if isinstance(value.get("batches"), dict) else {}
        last_batch_periods = (
            value.get("last_batch_periods")
            if isinstance(value.get("last_batch_periods"), dict)
            else {}
        )
        value.update({
            "ignored": ignored,
            "ignored_keys": ignored_keys,
            "notified": notified,
            "realtime_seen": realtime_seen,
            "realtime_initialized": bool(value.get("realtime_initialized")),
            "last_batch_periods": last_batch_periods,
            "batches": dict(list(batches.items())[-100:]),
        })
        self.save_data(self.DATA_KEY_NOTIFICATION_APPROVALS, value)

    def _notification_candidate_identity_keys(
            self, item: Dict[str, Any],
    ) -> set[str]:
        """生成跨刷新稳定的候选身份，避免用户忽略后因缓存重建再次出现。"""
        keys: set[str] = set()
        item_id = str(item.get("id") or "").strip()
        if item_id:
            keys.add(f"id:{item_id}")
        for field, prefix in (
            ("anilist_id", "anilist"),
            ("bangumi_id", "bangumi"),
            ("anidb_id", "anidb"),
            ("mal_id", "mal"),
        ):
            value = str(item.get(field) or "").strip()
            if value:
                keys.add(f"{prefix}:{value}")
        title = self._normalize_text(
            item.get("name")
            or item.get("original_title")
            or item.get("display_name")
            or item.get("title")
        )
        quarter = str(item.get("quarter") or "").strip()
        if title:
            keys.add(f"title:{quarter}:{title}")
        return keys

    def _notification_config_data(self) -> Dict[str, Any]:
        config = {
            key: deepcopy(self._config.get(key, self.DEFAULT_CONFIG.get(key)))
            for key in self.NOTIFICATION_CONFIG_KEYS
        }
        target = self._notification_candidate_target()
        if target and not config.get("notification_candidate_service"):
            # 旧版只保存渠道类型；当该类型仅有一个可用实例时无歧义迁移到实例选择。
            config["notification_candidate_service"] = target[1]
        return config

    @staticmethod
    def _message_channel_for_notification_type(service_type: Any) -> Any:
        """把 MP 通知模块类型转换为 MessageChannel。"""
        if MessageChannel is None:
            return None
        normalized = re.sub(r"[^a-z0-9]+", "", str(service_type or "").lower())
        channel_name = {
            "wechat": "Wechat",
            "feishu": "Feishu",
            "wechatclawbot": "WechatClawBot",
            "telegram": "Telegram",
            "slack": "Slack",
            "discord": "Discord",
            "synologychat": "SynologyChat",
            "vocechat": "VoceChat",
            "voicechat": "VoceChat",
            "webpush": "WebPush",
            "qq": "QQ",
            "qqbot": "QQ",
        }.get(normalized)
        return getattr(MessageChannel, channel_name, None) if channel_name else None

    def _notification_service_options(self) -> List[Dict[str, Any]]:
        """列出能接收 Plugin 通知的具体 MP 通知配置实例。"""
        if NotificationHelper is None or NotificationType is None:
            return []
        try:
            configs = NotificationHelper().get_configs()
        except Exception as err:  # noqa: BLE001 - 通知配置读取失败不影响其它模块。
            logger.warning(f"[媒体整理增强] 读取 MoviePilot 通知实例失败：{err}")
            return []
        plugin_type = str(getattr(NotificationType.Plugin, "value", NotificationType.Plugin))
        options: List[Dict[str, Any]] = []
        for name, conf in configs.items():
            channel = self._message_channel_for_notification_type(
                getattr(conf, "type", None)
            )
            if channel is None:
                continue
            switchs = {
                str(getattr(value, "value", value))
                for value in (getattr(conf, "switchs", None) or [])
            }
            accepts_plugin = plugin_type in switchs
            options.append({
                "title": f"{name} · {channel.value}",
                "value": str(name),
                "channel": channel.value,
                "service_type": str(getattr(conf, "type", None) or ""),
                "accepts_plugin": accepts_plugin,
                "subtitle": (
                    "可接收插件通知"
                    if accepts_plugin else "尚未启用“插件”通知类型"
                ),
            })
        return sorted(
            options,
            key=lambda item: (
                not item["accepts_plugin"],
                item["channel"].casefold(),
                item["title"].casefold(),
            ),
        )

    def _notification_status_data(self) -> Dict[str, Any]:
        records = self._read_notification_records()
        policies = normalize_failure_policies(
            self._config.get("notification_failure_policies")
        )
        routes = normalize_notification_routes(
            self._config.get("notification_type_routes")
        )
        notification_services = self._notification_service_options()
        return {
            "active": self._notification_active(),
            "config": self._notification_config_data(),
            "failure_categories": [
                {
                    "key": item["key"],
                    "label": item["label"],
                    "description": item["description"],
                    "icon": item["icon"],
                    "policy": policies[item["key"]],
                    "locked": item["key"] == "unknown",
                }
                for item in FAILURE_CATEGORIES
            ],
            "notification_types": [
                {
                    **deepcopy(item),
                    "route": deepcopy(routes[item["key"]]),
                }
                for item in NOTIFICATION_TYPES
            ],
            "notification_content_templates": [
                deepcopy(item) for item in NOTIFICATION_CONTENT_TEMPLATES
            ],
            "records": records,
            "record_counts": {
                "total": len(records),
                "notified": sum(
                    1 for item in records
                    if item.get("action") in ("notified", "delivered")
                ),
                "submitted": sum(
                    1 for item in records if item.get("action") == "notified"
                ),
                "delivered": sum(
                    1 for item in records if item.get("action") == "delivered"
                ),
                "delivery_failed": sum(
                    1 for item in records
                    if item.get("action") == "delivery_failed"
                ),
                "suppressed": sum(1 for item in records if item.get("action") == "suppressed"),
                "digest": summarize_digest(records).get("total", 0),
            },
            "notification_services": notification_services,
            # 旧前端字段保留一个版本，避免后端先更新时页面直接失去可选项。
            "notification_channels": notification_services,
            "candidate_schedule": self._notification_candidate_schedule_status(),
            "takeover_note": (
                "接管模式会把路由为“发送”的原生消息改由“插件”通知精确投递。"
                "确认运行记录正常后，可在 MoviePilot 通知渠道里关闭相应原生通知类型，"
                "但需保留“插件”类型。"
            ),
        }

    def get_notification_enhancer_api(self) -> schemas.Response:
        """获取完整通知接管配置、运行记录和当前季度候选。"""
        data = self._notification_status_data()
        data["candidates"] = self._notification_candidate_snapshot(
            self._current_quarter_key()
        )
        return schemas.Response(success=True, data=data)

    def save_notification_enhancer_config_api(
            self, payload: dict = Body(...),
    ) -> schemas.Response:
        """独立保存通知配置，避免其它页面旧快照覆盖。"""
        submitted = dict(payload or {})
        previous_realtime = bool(
            self._config.get("notification_candidate_realtime_enabled")
        )
        with self._config_lock:
            merged = self._current_config()
            for key in self.NOTIFICATION_CONFIG_KEYS:
                if key in submitted:
                    merged[key] = deepcopy(submitted[key])
            if "notification_candidate_service" in submitted:
                # 新前端已明确提交实例选择（包括主动清空），不再回落旧版渠道字段。
                merged["notification_candidate_channel"] = ""
            self._config = self._normalize_config(merged)
            self.update_config(self._current_config())
        if (
                self._config.get("notification_candidate_realtime_enabled")
                and not previous_realtime
        ):
            self._initialize_notification_candidate_realtime_baseline()
        return schemas.Response(
            success=True,
            message="通知接管设置已保存",
            data=self._notification_status_data(),
        )

    def clear_notification_records_api(self) -> schemas.Response:
        self.save_data(self.DATA_KEY_NOTIFICATION_RECORDS, [])
        return schemas.Response(
            success=True, message="通知记录已清空",
            data=self._notification_status_data(),
        )

    def send_notification_digest_api(self) -> schemas.Response:
        """把当前待汇总失败压缩成一条通知，并标记为已发送。"""
        if not self._config.get("notification_plugin_enabled"):
            return schemas.Response(
                success=False, message="请先启用“允许插件发送通知”",
            )
        with self._notification_lock:
            records = self._read_notification_records()
            pending = [
                item for item in records
                if item.get("policy") == "digest"
                and item.get("action") == "digest_pending"
            ]
            if not pending:
                return schemas.Response(
                    success=True, message="当前没有待发送的失败摘要",
                    data=self._notification_status_data(),
                )
            category_counts: Dict[str, int] = {}
            for item in pending:
                label = str((item.get("category") or {}).get("label") or "未分类异常")
                category_counts[label] = category_counts.get(label, 0) + 1
            lines = [
                f"• {label}：{count} 条"
                for label, count in sorted(
                    category_counts.items(), key=lambda pair: pair[1], reverse=True,
                )
            ]
            lines.extend(
                f"\n{index}. {item.get('title')}"
                for index, item in enumerate(pending[:8], 1)
            )
            if len(pending) > 8:
                lines.append(f"\n…另有 {len(pending) - 8} 条")
            delivery = self._send_enhanced_notification(
                title=f"入库失败摘要 · {len(pending)} 条",
                text="\n".join(lines),
                source_notice={},
                **self._notification_target_kwargs("failure"),
            )
            if not delivery.get("success"):
                return schemas.Response(
                    success=False,
                    message=(
                        "入库失败摘要发送失败："
                        f"{delivery.get('error') or '通知实例未返回成功结果'}"
                    ),
                    data=self._notification_status_data(),
                )
            pending_ids = {str(item.get("id")) for item in pending}
            for item in records:
                if str(item.get("id")) in pending_ids:
                    item["action"] = "digest_sent"
            self.save_data(
                self.DATA_KEY_NOTIFICATION_RECORDS,
                compact_records(
                    records,
                    self._safe_int(self._config.get("notification_record_limit"), 200),
                ),
            )
        return schemas.Response(
            success=True, message=f"已发送 {len(pending)} 条失败摘要",
            data=self._notification_status_data(),
        )

    def test_notification_enhancer_api(
            self, payload: dict = Body(default={}),
    ) -> schemas.Response:
        """向具体通知实例直发测试消息，并使用渠道回执判断是否送达。"""
        payload = payload or {}
        scene = str(payload.get("scene") or "success").strip().lower()
        if scene == "failure":
            category = classify_failure("测试：目标目录权限不足")
            title = f"⚠ 入库失败 · {category['label']}"
            text = "测试媒体 S01E01\n原因：目标目录权限不足\n\n这是一条测试消息，没有执行文件操作。"
        else:
            category = {}
            title = "✅ 入库完成 · 通知增强测试"
            text = "测试媒体 S01E01\n这是一条测试消息，没有执行文件操作。"
        target = self._notification_test_target(scene)
        if not target:
            return schemas.Response(
                success=False,
                message=(
                    f"请选择{'入库失败' if scene == 'failure' else '入库成功'}"
                    "通知实例；如果只有一个可用实例，"
                    "请确认它已启用“插件”通知类型"
                ),
                data=self._notification_status_data(),
            )
        delivery = self._send_direct_test_notification(
            title=title,
            text=text,
            channel=target[0],
            service=target[1],
        )
        self._append_notification_record(build_record(
            scene=scene, title=title, text=text, category=category,
            action="delivered" if delivery["success"] else "delivery_failed",
            source=target[1],
            details={
                "channel": getattr(target[0], "value", str(target[0])),
                "message_id": delivery.get("message_id"),
                "chat_id": delivery.get("chat_id"),
            },
        ))
        if not delivery["success"]:
            return schemas.Response(
                success=False,
                message=(
                    f"通知实例“{target[1]}”未返回发送成功。"
                    "请检查该 Telegram 的 Token、Chat ID 与 MoviePilot 日志"
                ),
                data=self._notification_status_data(),
            )
        return schemas.Response(
            success=True,
            message=f"通知实例“{target[1]}”已确认送达",
            data=self._notification_status_data(),
        )

    def _notification_candidate_snapshot(
            self,
            quarter: str,
            options: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, List[Dict[str, Any]]]:
        """将季度缓存拆成“可加入”和“扫描失败”两条审批队列。"""
        cached = self._read_season_catalog_cache().get(quarter) or {}
        items = cached.get("items") if isinstance(cached, dict) else []
        approvals = self._read_notification_approvals()
        ignored = set(str(value) for value in approvals.get("ignored") or [])
        ignored_keys = set(
            str(value) for value in approvals.get("ignored_keys") or []
        )
        rules = self._read_episode_rules()
        options = options if isinstance(options, dict) else {}
        region = str(
            options.get("region")
            or self._config.get("notification_candidate_region")
            or "japan"
        )
        platform_values = (
            options.get("platforms")
            if "platforms" in options and options.get("platforms") is not None
            else self._config.get("notification_candidate_platforms")
        )
        platforms = set(
            str(value).strip().upper()
            for value in (platform_values or [])
        )
        sequel_only = (
            bool(options.get("sequel_only"))
            if options.get("sequel_only") is not None
            else bool(self._config.get("notification_candidate_sequel_only"))
        )
        ready: List[Dict[str, Any]] = []
        failed: List[Dict[str, Any]] = []
        for item in items or []:
            item_id = str(item.get("id") or "")
            identity_item = {**item, "quarter": item.get("quarter") or quarter}
            match = item.get("tmdb_match") or {}
            best = match.get("best") or {}
            tmdb_id = self._safe_int(best.get("tmdb_id"), 0)
            maintained_tmdb_id = self._catalog_maintained_tmdb_id(item, rules)
            if (
                    not item_id
                    or item_id in ignored
                    or self._notification_candidate_identity_keys(
                        identity_item,
                    ).intersection(ignored_keys)
            ):
                continue
            if maintained_tmdb_id:
                continue
            if region != "all" and str(item.get("region") or "") != region:
                continue
            if platforms and str(item.get("platform") or "").strip().upper() not in platforms:
                continue
            if (
                    sequel_only
                    and not (item.get("has_prequel") or item.get("is_multi_season"))
            ):
                continue
            candidate = {
                "id": item_id,
                "quarter": quarter,
                "anilist_id": item.get("anilist_id"),
                "bangumi_id": item.get("bangumi_id"),
                "anidb_id": item.get("anidb_id"),
                "mal_id": item.get("mal_id"),
                "title": item.get("display_name") or item.get("name_cn") or item.get("name"),
                "name": item.get("name") or "",
                "original_title": item.get("name") or "",
                "tmdb_id": tmdb_id,
                "poster": item.get("poster") or "",
                "platform": item.get("platform") or "",
                "region": item.get("region") or "",
                "date": item.get("date") or "",
                "episode_count": self._safe_int(item.get("episode_count"), 0),
                "catalog_media_type": item.get("catalog_media_type") or "",
                "has_prequel": bool(item.get("has_prequel")),
                "is_multi_season": bool(item.get("is_multi_season")),
                "score": best.get("score"),
                "scan_status": str(item.get("scan_status") or ""),
                "scan_error": str(item.get("scan_error") or ""),
            }
            if match.get("accepted") and tmdb_id:
                candidate["candidate_type"] = "ready"
                ready.append(candidate)
            elif str(item.get("scan_status") or "").lower() == "failed":
                candidate["candidate_type"] = "failed"
                failed.append(candidate)
        return {"ready": ready, "failed": failed}

    def _catalog_maintained_tmdb_id(
            self,
            item: Dict[str, Any],
            rules: Optional[List[Dict[str, Any]]] = None,
    ) -> int:
        """识别看板条目是否已被维护，包括没有自动匹配 ID 的手动规则。

        优先使用明确 TMDBID 和 catalog:<item_id> 片段；对于看板外手工添加的
        规则，只接受去季号后标题的唯一精确命中，避免同名作品误关联。
        """
        rules = rules if isinstance(rules, list) else self._read_episode_rules()
        best = ((item.get("tmdb_match") or {}).get("best") or {})
        matched_tmdb_id = self._safe_int(best.get("tmdb_id"), 0)
        maintained_ids = {
            self._safe_int(rule.get("tmdb_id"), 0)
            for rule in rules if self._safe_int(rule.get("tmdb_id"), 0)
        }
        if matched_tmdb_id in maintained_ids:
            return matched_tmdb_id

        item_id = str(item.get("id") or "")
        segment_id = f"catalog:{item_id}" if item_id else ""
        for rule in rules:
            if segment_id and any(
                    str(segment.get("id") or "") == segment_id
                    for segment in rule.get("installments") or []
                    if isinstance(segment, dict)
            ):
                return self._safe_int(rule.get("tmdb_id"), 0)

        item_titles = {
            self._normalize_text(value)
            for value in self._catalog_search_titles(item)
            if self._normalize_text(value)
        }
        if not item_titles:
            return 0
        matches = set()
        item_quarter = str(item.get("quarter") or "")
        for rule in rules:
            values = [rule.get("title")]
            for segment in rule.get("installments") or []:
                if not isinstance(segment, dict):
                    continue
                segment_quarter = str(segment.get("quarter") or "")
                if item_quarter and segment_quarter and segment_quarter != item_quarter:
                    continue
                values.extend([
                    segment.get("title"),
                    *(segment.get("aliases") or []),
                ])
            rule_titles = {
                self._normalize_text(value)
                for value in self._catalog_search_titles({
                    "name": rule.get("title"),
                    "aliases": values,
                })
                if self._normalize_text(value)
            }
            if item_titles.intersection(rule_titles):
                tmdb_id = self._safe_int(rule.get("tmdb_id"), 0)
                if tmdb_id:
                    matches.add(tmdb_id)
        return next(iter(matches)) if len(matches) == 1 else 0

    def _notification_candidates(
            self,
            quarter: str,
            options: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """兼容旧调用：只返回已经匹配成功、可直接加入规则的候选。"""
        return self._notification_candidate_snapshot(quarter, options)["ready"]

    def _notification_service_target(
            self, configured_service: Any,
    ) -> Optional[Tuple[Any, str]]:
        """把具体通知配置名解析为“渠道枚举 + 实例名”目标。"""
        configured_service = str(configured_service or "").strip()
        options = self._notification_service_options()
        if configured_service:
            selected = next(
                (
                    item for item in options
                    if item["value"] == configured_service
                    and item["accepts_plugin"]
                ),
                None,
            )
            if not selected:
                return None
            channel = next(
                (
                    item for item in MessageChannel
                    if item.value == selected["channel"]
                ),
                None,
            ) if MessageChannel is not None else None
            return (channel, configured_service) if channel is not None else None
        return None

    def _notification_candidate_target(self) -> Optional[Tuple[Any, str]]:
        """解析候选通知目标为“渠道枚举 + 具体配置实例名”。"""
        options = self._notification_service_options()
        configured_service = str(
            self._config.get("notification_candidate_service") or ""
        ).strip()
        selected_target = self._notification_service_target(configured_service)
        if configured_service:
            return selected_target

        # 兼容 0.8.9：旧配置只保存渠道类型。仅在恰好存在一个同类可用实例时迁移，
        # 多个 Telegram 等情况必须由用户明确选择，避免误发到所有实例。
        legacy_channel = str(
            self._config.get("notification_candidate_channel") or ""
        ).strip()
        matches = [
            item for item in options
            if item["channel"] == legacy_channel and item["accepts_plugin"]
        ]
        if len(matches) != 1 or MessageChannel is None:
            return None
        channel = next(
            (item for item in MessageChannel if item.value == legacy_channel),
            None,
        )
        return (channel, matches[0]["value"]) if channel is not None else None

    def _notification_scene_target(
            self, scene: str,
    ) -> Optional[Tuple[Any, str]]:
        """解析入库成功与失败目标；依次回落类型路由和全局默认实例。"""
        legacy_key = (
            "notification_failure_service"
            if str(scene or "").lower() == "failure"
            else "notification_success_service"
        )
        type_key = "manual" if str(scene or "").lower() == "failure" else "organize"
        routes = normalize_notification_routes(
            self._config.get("notification_type_routes")
        )
        configured = routes.get(type_key, {}).get("service")
        if configured:
            return self._notification_service_target(configured)
        configured = self._config.get(legacy_key)
        if configured:
            return self._notification_service_target(configured)
        return self._notification_service_target(
            self._config.get("notification_default_service")
        )

    def _notification_type_target(
            self, type_key: str,
    ) -> Optional[Tuple[Any, str]]:
        """解析普通通知类型的独立实例；未指定时使用全局默认实例。"""
        routes = normalize_notification_routes(
            self._config.get("notification_type_routes")
        )
        route = routes.get(type_key) or routes["other"]
        configured = (
            route.get("service")
            or self._config.get("notification_default_service")
        )
        return self._notification_service_target(configured)

    def _notification_target_kwargs(self, scene: str) -> Dict[str, Any]:
        target = self._notification_scene_target(scene)
        return (
            {"channel": target[0], "service": target[1]}
            if target else {}
        )

    def _notification_candidate_channel(self) -> Any:
        """兼容旧内部调用，仅返回已选实例对应的渠道枚举。"""
        target = self._notification_candidate_target()
        return target[0] if target else None

    def _notification_test_target(
            self, scene: str = "success",
    ) -> Optional[Tuple[Any, str]]:
        """优先使用对应入库场景实例；只有一个可用实例时允许免选择测试。"""
        target = self._notification_scene_target(scene)
        if target:
            return target
        available = [
            item for item in self._notification_service_options()
            if item.get("accepts_plugin")
        ]
        if len(available) != 1 or MessageChannel is None:
            return None
        channel = next(
            (
                item for item in MessageChannel
                if item.value == available[0].get("channel")
            ),
            None,
        )
        return (channel, str(available[0]["value"])) if channel is not None else None

    def _send_direct_test_notification(
            self,
            *,
            title: str,
            text: str,
            channel: Any,
            service: str,
    ) -> Dict[str, Any]:
        """测试入口复用真实通知的实例直发链路。"""
        return self._send_direct_instance_notification(
            title=title,
            text=text,
            channel=channel,
            service=service,
            source_notice={},
        )

    def _send_direct_instance_notification(
            self,
            *,
            title: str,
            text: str,
            channel: Any,
            service: str,
            source_notice: Optional[Dict[str, Any]] = None,
            buttons: Optional[List[List[dict]]] = None,
    ) -> Dict[str, Any]:
        """绕过普通通知队列向具体实例直发，并返回渠道真实回执。"""
        if NotificationType is None or not getattr(self, "chain", None):
            return {
                "success": False,
                "direct": True,
                "error": "MoviePilot direct notification unavailable",
            }
        notification_cls = getattr(schemas, "Notification", None)
        if notification_cls is None:
            return {
                "success": False,
                "direct": True,
                "error": "Notification schema unavailable",
            }
        notice = source_notice if isinstance(source_notice, dict) else {}
        notification_kwargs: Dict[str, Any] = {}
        for key in ("image", "link", "userid", "username", "targets"):
            if notice.get(key):
                notification_kwargs[key] = notice[key]
        resolved_buttons = buttons if buttons is not None else notice.get("buttons")
        if resolved_buttons:
            notification_kwargs["buttons"] = resolved_buttons
        try:
            response = self.chain.send_direct_message(notification_cls(
                channel=channel,
                source=service,
                mtype=NotificationType.Plugin,
                title=title,
                text=text,
                save_history=False,
                **notification_kwargs,
            ))
        except Exception as err:  # noqa: BLE001 - 测试失败需原样记录，不影响模块运行。
            logger.error(f"[媒体整理增强] 通知实例 {service} 直发失败：{err}")
            return {
                "success": False,
                "direct": True,
                "error": str(err),
            }
        if isinstance(response, dict):
            return {
                "success": bool(response.get("success")),
                "direct": True,
                "message_id": response.get("message_id"),
                "chat_id": response.get("chat_id"),
                "error": response.get("error"),
            }
        return {
            "success": bool(getattr(response, "success", False)),
            "direct": True,
            "message_id": getattr(response, "message_id", None),
            "chat_id": getattr(response, "chat_id", None),
            "error": getattr(response, "error", None),
        }

    def _send_candidate_instance_notification(
            self,
            *,
            title: str,
            text: str,
            buttons: List[List[dict]],
            channel: Any,
            service: str,
            image: str = "",
            original_message_id: Optional[int] = None,
            original_media_message_id: Optional[int] = None,
            original_photo_unique_id: str = "",
            original_image_digest: str = "",
            original_chat_id: Optional[str] = None,
            force_reply: bool = False,
            userid: Optional[str] = None,
            rich_markdown: str = "",
            rich_text: str = "",
            rich_blocks: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """绕过 MP 定时队列，向具体通知实例立即发送候选交互消息。"""
        if NotificationHelper is None:
            return {"success": False, "error": "NotificationHelper unavailable"}
        try:
            service_info = NotificationHelper().get_service(name=service)
        except Exception as err:  # noqa: BLE001 - 实例解析失败需反馈给调用方。
            logger.error(f"[媒体整理增强] 读取通知实例 {service} 失败：{err}")
            return {"success": False, "error": str(err)}
        if not service_info or not getattr(service_info, "instance", None):
            return {"success": False, "error": "notification instance unavailable"}

        # Telegram 的 MP 包装器尚未支持 Bot API 10.2 Rich Message。
        # 候选页直接调用 sendRichMessage/editMessageText，并把图片作为原生
        # RichBlockPhoto 附件一起原位更新；旧 API 不支持时再回退 MP HTML。
        if (
                MessageChannel is not None
                and channel == getattr(MessageChannel, "Telegram", None)
                and callable(getattr(service_info.instance, "send_msg", None))
        ):
            instance = service_info.instance
            use_rich_messages = (
                self._config.get(
                    "notification_candidate_message_style", "rich",
                ) == "rich"
            )
            if (
                    (rich_markdown or rich_blocks)
                    and not force_reply
                    and use_rich_messages
            ):
                message_key = (
                    str(service or ""),
                    str(original_chat_id or userid or ""),
                    str(
                        original_message_id
                        or f"new:{threading.get_ident()}:{time.time_ns()}"
                    ),
                )
                with self._notification_rich_intent_lock:
                    self._notification_rich_intent_sequence += 1
                    intent_sequence = self._notification_rich_intent_sequence
                    self._notification_rich_intents[message_key] = intent_sequence
                # 同一 Rich Message 的媒体替换必须串行提交。快速连续翻页时，
                # 后一次点击会登记为更新意图；尚未开始的旧请求直接丢弃，已经
                # 开始的请求完成后再由新请求覆盖，避免旧海报晚到反压新页面。
                with self._notification_telegram_send_lock:
                    with self._notification_rich_intent_lock:
                        if (
                                self._notification_rich_intents.get(message_key)
                                != intent_sequence
                        ):
                            return {
                                "success": True,
                                "stale_intent_skipped": True,
                            }
                        remembered_state = dict(
                            self._notification_rich_message_state.get(
                                message_key,
                            ) or {}
                        )
                    rich_result = self._send_candidate_rich_telegram(
                        instance=instance,
                        rich_markdown=rich_markdown,
                        rich_blocks=rich_blocks,
                        buttons=buttons,
                        image=image,
                        original_message_id=original_message_id,
                        original_media_message_id=original_media_message_id,
                        original_photo_unique_id=(
                            remembered_state.get("photo_unique_id")
                            or original_photo_unique_id
                        ),
                        original_image_digest=(
                            remembered_state.get("image_digest")
                            or original_image_digest
                        ),
                        original_chat_id=original_chat_id,
                        userid=userid,
                    )
                    if rich_result.get("success"):
                        with self._notification_rich_intent_lock:
                            self._notification_rich_message_state[message_key] = {
                                "photo_unique_id": str(
                                    rich_result.get("photo_unique_id") or ""
                                ),
                                "image_digest": str(
                                    rich_result.get("image_digest") or ""
                                ),
                            }
                if rich_result.get("success"):
                    return rich_result
                logger.warning(
                    "[媒体整理增强] Telegram Rich Message 发送或编辑失败："
                    f"{rich_result.get('error') or '未知错误'}"
                )
                if original_message_id:
                    # 已经是 Rich Message 的交互消息不降级为普通消息。部分
                    # Telegram 客户端/服务端在编辑媒体时可能暂时不返回完整
                    # RichBlockPhoto 元数据；此时保留当前 Rich 页面，让用户
                    # 可以再次操作，也避免 send_msg 覆盖掉组合图和区块结构。
                    return {
                        "success": False,
                        "preserved_rich_message": True,
                        "error": rich_result.get("error") or "Rich Message 编辑失败",
                    }
            local_image = None
            if image and original_message_id and original_chat_id:
                try:
                    candidate_path = Path(str(image))
                    if candidate_path.is_file():
                        local_image = candidate_path
                except (OSError, ValueError):
                    local_image = None
            try:
                # MoviePilot 当前 Telegram 包装器尚未透传 Bot API 新增的
                # primary/success/danger 样式。仅在本次同步发送期间替换键盘工厂，
                # 支持新版 pyTelegramBotAPI 时启用颜色，旧版自动忽略并保持可用。
                keyboard_factory = self._build_candidate_telegram_keyboard
                with self._notification_telegram_send_lock:
                    had_factory = "_create_inline_keyboard" in getattr(
                        instance, "__dict__", {},
                    )
                    previous_factory = getattr(
                        instance, "__dict__", {},
                    ).get("_create_inline_keyboard")
                    setattr(instance, "_create_inline_keyboard", keyboard_factory)
                    try:
                        if local_image:
                            with local_image.open("rb") as image_file:
                                result = instance.send_msg(
                                    title=title,
                                    text=(
                                        rich_text
                                        if use_rich_messages and rich_text
                                        else html_utils.escape(text)
                                    ),
                                    image=image_file,
                                    buttons=buttons,
                                    force_reply=force_reply,
                                    userid=userid,
                                    original_message_id=original_message_id,
                                    original_chat_id=original_chat_id,
                                    parse_mode="HTML",
                                )
                        else:
                            result = instance.send_msg(
                                title=title,
                                text=(
                                    rich_text
                                    if use_rich_messages and rich_text
                                    else html_utils.escape(text)
                                ),
                                image=image or None,
                                buttons=buttons,
                                force_reply=force_reply,
                                userid=userid,
                                original_message_id=original_message_id,
                                original_chat_id=original_chat_id,
                                parse_mode="HTML",
                            )
                    finally:
                        if had_factory:
                            setattr(
                                instance,
                                "_create_inline_keyboard",
                                previous_factory,
                            )
                        else:
                            delattr(instance, "_create_inline_keyboard")
            except Exception as err:  # noqa: BLE001 - 渠道异常不能中断候选扫描。
                logger.error(f"[媒体整理增强] Telegram 实例 {service} 发送候选失败：{err}")
                return {"success": False, "error": str(err)}
            return {
                "success": bool(result and result.get("success")),
                "message_id": result.get("message_id") if isinstance(result, dict) else None,
                "chat_id": result.get("chat_id") if isinstance(result, dict) else None,
            }

        # 其它渠道通过其运行模块立即投递。部分渠道没有同步回执，只能确认模块已接受。
        notification_cls = getattr(schemas, "Notification", None)
        module = getattr(service_info, "module", None)
        if notification_cls is None or not callable(getattr(module, "post_message", None)):
            return {"success": False, "error": "notification module cannot post"}
        try:
            module.post_message(notification_cls(
                channel=channel,
                source=service,
                mtype=NotificationType.Plugin if NotificationType is not None else None,
                title=title,
                text=text,
                image=image or None,
                buttons=buttons,
                force_reply=force_reply,
                userid=userid,
                original_message_id=original_message_id,
                original_chat_id=original_chat_id,
                save_history=False,
            ))
            return {"success": True, "confirmed": False}
        except Exception as err:  # noqa: BLE001 - 渠道异常不能中断候选扫描。
            logger.error(f"[媒体整理增强] 通知实例 {service} 发送候选失败：{err}")
            return {"success": False, "error": str(err)}

    @staticmethod
    def _rich_markdown_escape(value: Any) -> str:
        """转义来自 TMDB/AniList/用户输入的 Rich Markdown 行内文本。"""
        text = re.sub(r"\s+", " ", str(value or "")).strip()
        for character in ("\\", "`", "*", "_", "[", "]", "<", ">", "|", "~"):
            text = text.replace(character, f"\\{character}")
        return text

    @staticmethod
    def _candidate_rich_table(
            rows: List[Tuple[Any, Any]],
    ) -> Dict[str, Any]:
        """生成 Telegram 10.2 原生表格，避免在 Markdown 表格中堆叠图标。"""
        cells = [[
            {
                "text": "项目",
                "is_header": True,
                "align": "left",
                "valign": "middle",
            },
            {
                "text": "信息",
                "is_header": True,
                "align": "left",
                "valign": "middle",
            },
        ]]
        cells.extend([
            [
                {
                    "text": str(label or ""),
                    "align": "left",
                    "valign": "middle",
                },
                {
                    "text": value,
                    "align": "left",
                    "valign": "middle",
                },
            ]
            for label, value in rows
        ])
        return {
            "type": "table",
            "cells": cells,
            "is_bordered": True,
            "is_striped": True,
        }

    @staticmethod
    def _candidate_telegram_reply_markup(
            buttons: List[List[dict]],
    ) -> Dict[str, Any]:
        """生成原生 Bot API 键盘，保留新版彩色按钮属性。"""
        keyboard: List[List[Dict[str, Any]]] = []
        for row in buttons or []:
            button_row: List[Dict[str, Any]] = []
            for button in row:
                item: Dict[str, Any] = {
                    "text": str(button.get("text") or ""),
                }
                for key in (
                        "url",
                        "callback_data",
                        "style",
                        "icon_custom_emoji_id",
                ):
                    if button.get(key) not in (None, ""):
                        item[key] = button[key]
                button_row.append(item)
            if button_row:
                keyboard.append(button_row)
        return {"inline_keyboard": keyboard}

    @classmethod
    def _candidate_plain_emoji_fallback(cls, value: Any) -> Any:
        """把会员表情递归降级为 alternative_text，保持 Rich 结构不变。"""
        if isinstance(value, dict):
            if value.get("type") == "custom_emoji":
                return str(value.get("alternative_text") or "✨")
            return {
                key: cls._candidate_plain_emoji_fallback(item)
                for key, item in value.items()
            }
        if isinstance(value, list):
            return [
                cls._candidate_plain_emoji_fallback(item)
                for item in value
            ]
        return value

    def _prepare_candidate_rich_photo(
            self,
            image: str,
    ) -> Dict[str, Any]:
        """读取真实图片并生成 Rich Message 媒体上传附件。"""
        image_value = str(image or "").strip()
        if not image_value:
            return {"success": True, "digest": "", "files": None}

        content: Optional[bytes] = None
        filename = "candidate-cover.jpg"
        try:
            local_path = Path(image_value)
            if local_path.is_file():
                content = local_path.read_bytes()
                filename = local_path.name or filename
        except (OSError, ValueError):
            pass
        if content is None and image_value.startswith(("https://", "http://")):
            content = self._fetch_candidate_poster(image_value)
        if not content:
            return {
                "success": False,
                "error": f"无法读取候选图片：{image_value}",
            }

        prepared = BytesIO()
        try:
            if Image is not None:
                with Image.open(BytesIO(content)) as source:
                    normalized_source = source.convert("RGB")
                    # 详情页使用 TMDB 等远程单张海报。统一为 2:3 画布，
                    # 避免横图、方图或不同分辨率令 Rich Message 高度跳动。
                    # 总览拼图是本地生成文件，保持自身的网格比例。
                    if (
                            ImageOps is not None
                            and image_value.startswith(("https://", "http://"))
                    ):
                        resampling = getattr(
                            getattr(Image, "Resampling", Image),
                            "LANCZOS",
                        )
                        canvas_size = (720, 1080)
                        background = ImageOps.fit(
                            normalized_source,
                            canvas_size,
                            method=resampling,
                            centering=(0.5, 0.5),
                        )
                        if ImageFilter is not None:
                            background = background.filter(
                                ImageFilter.GaussianBlur(radius=28),
                            )
                        # 压暗柔化背景，令完整海报本体保持清晰。
                        background = Image.blend(
                            background,
                            Image.new("RGB", canvas_size, (18, 16, 24)),
                            0.34,
                        )
                        foreground = ImageOps.contain(
                            normalized_source,
                            (696, 1056),
                            method=resampling,
                        )
                        foreground_x = (
                            canvas_size[0] - foreground.width
                        ) // 2
                        foreground_y = (
                            canvas_size[1] - foreground.height
                        ) // 2
                        background.paste(
                            foreground,
                            (foreground_x, foreground_y),
                        )
                        normalized_source = background
                    normalized_source.save(
                        prepared,
                        format="JPEG",
                        quality=92,
                        optimize=True,
                    )
            else:
                prepared.write(content)
        except Exception:  # noqa: BLE001 - 非 Pillow 支持格式交给 Telegram 判断。
            prepared.seek(0)
            prepared.truncate(0)
            prepared.write(content)
        prepared.seek(0)
        normalized = prepared.getvalue()
        if not normalized:
            prepared.close()
            return {"success": False, "error": "候选图片内容为空"}

        digest = hashlib.sha256(normalized).hexdigest()
        attachment_key = f"candidate_cover_{digest[:24]}"
        # Bot API 10.2 会把 media id 暴露为 Markdown 中的 tg:// 引用。
        # 即使来回切换到同一张海报，每次请求也使用不同 id，避免客户端按
        # Rich Message 区块位置复用上一次渲染的组合图。
        media_id = (
            f"candidate_{digest[:20]}_{time.time_ns():x}"
        )[:64]
        prepared.seek(0)
        return {
            "success": True,
            "digest": digest,
            "media_id": media_id,
            "attachment_key": attachment_key,
            "media": f"attach://{attachment_key}",
            "files": {
                attachment_key: (
                    filename,
                    prepared,
                    "image/jpeg",
                ),
            },
            "handle": prepared,
        }

    @staticmethod
    def _candidate_markdown_with_photo(
            markdown: str,
            media_id: str,
    ) -> str:
        """把显式上传媒体作为独立 Markdown 区块插入首个标题后。"""
        content = str(markdown or "").strip()
        photo_block = f"![](tg://photo?id={media_id})"
        if not content:
            return photo_block
        lines = content.splitlines()
        if lines and re.match(r"^\s{0,3}#{1,6}\s+", lines[0]):
            tail = "\n".join(lines[1:]).lstrip()
            return (
                f"{lines[0].rstrip()}\n\n{photo_block}"
                + (f"\n\n{tail}" if tail else "")
            )
        return f"{photo_block}\n\n{content}"

    @staticmethod
    def _telegram_rich_photo_identity(
            message: Dict[str, Any],
    ) -> Dict[str, str]:
        """从 Bot API 编辑结果中读取首个 RichBlockPhoto 的媒体标识。"""
        rich_message = message.get("rich_message")
        rich_message = rich_message if isinstance(rich_message, dict) else {}

        def find_photo(blocks: Any) -> Optional[List[Dict[str, Any]]]:
            if not isinstance(blocks, list):
                return None
            for block in blocks:
                if not isinstance(block, dict):
                    continue
                if block.get("type") == "photo":
                    photos = block.get("photo")
                    if isinstance(photos, list):
                        return [
                            item for item in photos if isinstance(item, dict)
                        ]
                nested = (
                    block.get("blocks")
                    or block.get("items")
                    or block.get("children")
                )
                found = find_photo(nested)
                if found:
                    return found
            return None

        photos = find_photo(rich_message.get("blocks")) or []
        if not photos:
            return {"file_id": "", "file_unique_id": ""}
        best = max(
            photos,
            key=lambda item: (
                int(item.get("width") or 0) * int(item.get("height") or 0),
                int(item.get("file_size") or 0),
            ),
        )
        return {
            "file_id": str(best.get("file_id") or ""),
            "file_unique_id": str(best.get("file_unique_id") or ""),
        }

    @staticmethod
    def _delete_candidate_telegram_message(
            *,
            token: str,
            chat_id: Any,
            message_id: Optional[int],
            api_template: str,
            proxies: Any,
    ) -> None:
        """升级旧双消息批次时清理一次遗留的独立视觉消息。"""
        if not message_id:
            return
        response = None
        try:
            api_url = str(api_template).format(token, "deleteMessage")
            response = RequestUtils(
                headers={
                    "Accept": "application/json",
                    "User-Agent": str(getattr(settings, "USER_AGENT", "") or ""),
                },
                proxies=proxies,
                timeout=20,
            ).post_res(api_url, json={
                "chat_id": chat_id,
                "message_id": int(message_id),
            })
        except Exception as err:  # noqa: BLE001 - 清理失败不影响已更新的主消息。
            logger.warning(
                "[媒体整理增强] Telegram 旧候选视觉消息清理失败："
                f"{err}"
            )
        finally:
            if response is not None:
                try:
                    response.close()
                except Exception:
                    pass

    def _send_candidate_rich_telegram(
            self,
            *,
            instance: Any,
            rich_markdown: str,
            rich_blocks: Optional[List[Dict[str, Any]]] = None,
            buttons: List[List[dict]],
            image: str = "",
            original_message_id: Optional[int] = None,
            original_media_message_id: Optional[int] = None,
            original_photo_unique_id: str = "",
            original_image_digest: str = "",
            original_chat_id: Optional[str] = None,
            userid: Optional[str] = None,
    ) -> Dict[str, Any]:
        """通过 Bot API 10.2 原生 Rich Message 发送或更新候选页。"""
        token = str(getattr(instance, "_telegram_token", "") or "").strip()
        determine_chat = getattr(instance, "_determine_target_chat_id", None)
        if not token or not callable(determine_chat):
            return {"success": False, "error": "Telegram 实例缺少 Token 或 Chat ID"}
        try:
            chat_id = determine_chat(userid, original_chat_id)
        except Exception as err:  # noqa: BLE001 - 兼容第三方 Telegram 模块实现。
            return {"success": False, "error": f"无法确定 Chat ID：{err}"}
        if chat_id in (None, ""):
            return {"success": False, "error": "Telegram Chat ID 为空"}

        # Bot API 10.2 起，图片通过 InputRichMessage.media 显式绑定到 Markdown
        # 中唯一的 tg://photo?id= 引用。相比直接改 InputRichBlockPhoto，这能让
        # 客户端明确识别“媒体引用已经变化”，同时保留 Markdown 原生表格。
        # 图片仍由插件作为附件上传，不依赖第三方图床。
        method = "editMessageText" if original_message_id else "sendRichMessage"
        api_template = "https://api.telegram.org/bot{0}/{1}"
        try:
            from telebot import apihelper

            api_template = getattr(
                apihelper,
                "API_URL",
                api_template,
            )
            api_url = str(api_template).format(token, method)
            proxies = getattr(apihelper, "proxy", None)
        except Exception:  # pragma: no cover - MP 正常 Telegram 环境必有 telebot。
            api_url = f"https://api.telegram.org/bot{token}/{method}"
            proxies = getattr(settings, "PROXY", None)

        markdown = str(rich_markdown or "").strip()
        blocks = deepcopy(rich_blocks) if rich_blocks else []
        photo = self._prepare_candidate_rich_photo(image)
        if not photo.get("success"):
            return {
                "success": False,
                "error": (
                    "Telegram 候选图片读取失败："
                    f"{photo.get('error') or '未知错误'}"
                ),
            }
        legacy_blocks = deepcopy(blocks)
        if image:
            photo_block = {
                "type": "photo",
                "photo": {
                    "type": "photo",
                    "media": photo["media"],
                },
            }
            if legacy_blocks:
                # 海报或总览拼图始终作为首个视觉区块；标题和后续信息放在
                # 图片下方，避免大标题抢占消息最上方。
                legacy_blocks.insert(0, photo_block)
            else:
                legacy_blocks = [
                    photo_block,
                    {
                        "type": "heading",
                        "size": 2,
                        "text": "候选审批",
                    },
                    {
                        "type": "paragraph",
                        "text": markdown,
                    },
                ]
        # 原生 blocks 是 Rich Message 最直接的结构：图片和表格都在同一棵
        # InputRichBlock 树中。优先使用它，避免 Markdown 解析器把编辑前后的
        # tg:// 引用归并成同一个视觉块；显式 media 引用仅作为旧服务端回退。
        rich_messages: List[Tuple[str, Dict[str, Any]]] = [(
            "blocks_media" if legacy_blocks else "markdown",
            (
                {
                    "blocks": legacy_blocks,
                    "skip_entity_detection": True,
                }
                if legacy_blocks else {
                    "markdown": markdown,
                    "skip_entity_detection": True,
                }
            ),
        )]
        plain_emoji_blocks = self._candidate_plain_emoji_fallback(
            legacy_blocks,
        )
        if plain_emoji_blocks != legacy_blocks:
            rich_messages.append((
                "blocks_plain_emoji",
                {
                    "blocks": plain_emoji_blocks,
                    "skip_entity_detection": True,
                },
            ))
        if image and markdown and photo.get("media_id"):
            media_id = str(photo["media_id"])
            rich_messages.append((
                "markdown_media",
                {
                    "markdown": self._candidate_markdown_with_photo(
                        markdown,
                        media_id,
                    ),
                    "media": [{
                        "id": media_id,
                        "media": {
                            "type": "photo",
                            "media": photo["media"],
                        },
                    }],
                    "skip_entity_detection": True,
                },
            ))

        response = None
        requester = None
        files = photo.get("files")
        image_handle = photo.get("handle")
        result: Dict[str, Any] = {}
        rich_mode = ""
        errors: List[str] = []
        try:
            requester = RequestUtils(
                headers={
                    "Accept": "application/json",
                    "User-Agent": str(getattr(settings, "USER_AGENT", "") or ""),
                },
                proxies=proxies,
                timeout=20,
            )
            previous_digest = str(original_image_digest or "")
            current_digest = str(photo.get("digest") or "")
            if (
                    original_message_id
                    and image
                    and previous_digest
                    and current_digest
                    and previous_digest != current_digest
            ):
                # Telegram Desktop 的 Rich Message 媒体编辑曾存在客户端缓存
                # 问题：直接用新 Photo 块覆盖旧 Photo 块时，客户端可能保留旧
                # 位图，只改变裁切与缩放。先提交一次完全不含媒体的 Rich
                # Message，让服务端产生明确的“媒体已移除”版本，再在同一
                # message_id 上添加新图。两步都仍是 editMessageText + Rich
                # Message，不会转换成普通 Photo 消息。
                clear_blocks = deepcopy(blocks)
                if not clear_blocks:
                    clear_blocks = [{
                        "type": "paragraph",
                        "text": "正在切换候选图片…",
                    }]
                clear_payload = {
                    "chat_id": chat_id,
                    "message_id": int(original_message_id),
                    "rich_message": {
                        "blocks": clear_blocks,
                        "skip_entity_detection": True,
                    },
                    "reply_markup": self._candidate_telegram_reply_markup(
                        buttons,
                    ),
                }
                response = requester.post_res(api_url, json=clear_payload)
                cleared = response.json() if response is not None else {}
                try:
                    response.close()
                except Exception:
                    pass
                response = None
                if not isinstance(cleared, dict) or not cleared.get("ok"):
                    description = (
                        cleared.get("description")
                        if isinstance(cleared, dict)
                        else "Telegram 未返回有效结果"
                    )
                    logger.warning(
                        "[媒体整理增强] Telegram Rich Message 媒体预清除"
                        f"失败，继续直接替换：{description}"
                    )
                else:
                    cleared_message = cleared.get("result")
                    cleared_message = (
                        cleared_message
                        if isinstance(cleared_message, dict)
                        else {}
                    )
                    cleared_identity = self._telegram_rich_photo_identity(
                        cleared_message,
                    )
                    logger.info(
                        "[媒体整理增强] Telegram Rich Message 旧图片已预清除："
                        f"message_id={original_message_id} "
                        f"remaining_photo={bool(cleared_identity['file_unique_id'])}"
                    )
            for attempt, (mode, rich_message) in enumerate(rich_messages):
                payload: Dict[str, Any] = {
                    "chat_id": chat_id,
                    "rich_message": rich_message,
                    "reply_markup": self._candidate_telegram_reply_markup(
                        buttons,
                    ),
                }
                if original_message_id:
                    payload["message_id"] = int(original_message_id)
                if image_handle is not None:
                    image_handle.seek(0)
                if files:
                    response = requester.post_res(
                        api_url,
                        data={
                            key: (
                                json.dumps(value, ensure_ascii=False)
                                if isinstance(value, (dict, list))
                                else str(value)
                            )
                            for key, value in payload.items()
                        },
                        files=files,
                    )
                else:
                    response = requester.post_res(api_url, json=payload)
                current = response.json() if response is not None else {}
                try:
                    response.close()
                except Exception:
                    pass
                response = None
                if isinstance(current, dict) and current.get("ok"):
                    result = current
                    rich_mode = mode
                    break
                description = (
                    current.get("description")
                    if isinstance(current, dict)
                    else "Telegram 未返回有效结果"
                )
                errors.append(f"{mode}: {description}")
                if attempt + 1 < len(rich_messages):
                    logger.info(
                        "[媒体整理增强] Telegram Rich Markdown 媒体"
                        "不可用，回退图片区块格式："
                        f"{description}"
                    )
        except Exception as err:  # noqa: BLE001 - Rich API 异常由旧消息路径兜底。
            return {"success": False, "error": str(err)}
        finally:
            if response is not None:
                try:
                    response.close()
                except Exception:
                    pass
            if image_handle is not None:
                image_handle.close()

        if not isinstance(result, dict) or not result.get("ok"):
            return {
                "success": False,
                "error": "；".join(errors) or "Telegram 未返回有效结果",
            }
        message = result.get("result")
        message = message if isinstance(message, dict) else {}
        photo_identity = self._telegram_rich_photo_identity(message)
        image_digest = str(photo.get("digest") or "")
        photo_unique_id = photo_identity["file_unique_id"]
        previous_digest = str(original_image_digest or "")
        previous_unique_id = str(original_photo_unique_id or "")
        if image and not photo_unique_id:
            logger.warning(
                "[媒体整理增强] Telegram 已接受 Rich Message，但回执未携带"
                " RichBlockPhoto 媒体标识；保留 Rich 结果并按图片摘要继续跟踪"
            )
        if (
                image
                and previous_digest
                and previous_unique_id
                and image_digest != previous_digest
                and photo_unique_id == previous_unique_id
        ):
            logger.warning(
                "[媒体整理增强] Telegram Rich Message 图片身份未变化："
                f"old_digest={previous_digest[:12]} "
                f"new_digest={image_digest[:12]} "
                f"file_unique_id={photo_unique_id}"
            )
            # 两阶段编辑已在提交新图前清除旧图片区块。客户端返回旧 ID
            # 不足以证明编辑失败；若把它当失败再走普通消息回退，反而会
            # 确定性地破坏 Rich 页面。保留服务端已接受的新 Rich 内容。
        if image:
            logger.info(
                "[媒体整理增强] Telegram Rich Message 图片已确认："
                f"method={method} mode={rich_mode} "
                f"digest={image_digest[:12]} "
                f"file_unique_id={photo_unique_id}"
            )

        # v0.8.23 曾把图片拆成独立 Photo 消息。新单消息编辑确认成功后，
        # 只在升级旧批次时清理一次，不参与日常翻页。
        self._delete_candidate_telegram_message(
            token=token,
            chat_id=chat_id,
            message_id=original_media_message_id,
            api_template=api_template,
            proxies=proxies,
        )
        result_chat = message.get("chat")
        result_chat = result_chat if isinstance(result_chat, dict) else {}
        result_chat_id = result_chat.get("id") or chat_id
        return {
            "success": True,
            "rich_message": True,
            "message_id": message.get("message_id") or original_message_id,
            "media_message_id": None,
            "photo_file_id": photo_identity["file_id"],
            "photo_unique_id": photo_unique_id,
            "image_digest": image_digest,
            "rich_media_mode": rich_mode,
            "chat_id": result_chat_id,
        }

    @staticmethod
    def _build_candidate_telegram_keyboard(
            buttons: List[List[dict]],
    ) -> Any:
        """构造支持 Telegram 新按钮样式、同时兼容旧 SDK 的内联键盘。"""
        from inspect import signature
        from telebot.types import InlineKeyboardButton, InlineKeyboardMarkup

        supported = set(signature(InlineKeyboardButton).parameters)
        keyboard = []
        for row in buttons:
            button_row = []
            for button in row:
                kwargs = {"text": str(button.get("text") or "")}
                if button.get("url"):
                    kwargs["url"] = button["url"]
                else:
                    kwargs["callback_data"] = button.get("callback_data")
                if button.get("style") and "style" in supported:
                    kwargs["style"] = button["style"]
                if (
                        button.get("icon_custom_emoji_id")
                        and "icon_custom_emoji_id" in supported
                ):
                    kwargs["icon_custom_emoji_id"] = button[
                        "icon_custom_emoji_id"
                    ]
                button_row.append(InlineKeyboardButton(**kwargs))
            keyboard.append(button_row)
        return InlineKeyboardMarkup(keyboard)

    def _notification_candidate_delivery_active(self) -> bool:
        return bool(
            self._notification_active()
            and self._config.get("notification_plugin_enabled")
            and self._config.get("notification_episode_candidates_enabled")
            and self._notification_candidate_target() is not None
        )

    def _notification_collage_path(self, batch_id: str) -> Path:
        return (
            self.get_data_path()
            / "notification-candidate-collages"
            / f"{batch_id}.jpg"
        )

    def _notification_collage_url(self, batch_id: str) -> str:
        query = urlencode({"apikey": str(settings.API_TOKEN or "")})
        return (
            f"http://127.0.0.1:{settings.PORT}/api/v1/plugin/"
            f"{self.__class__.__name__}/notification-enhancer/candidates/"
            f"collage/{batch_id}?{query}"
        )

    def _notification_collage_edit_source(
            self,
            *,
            batch_id: str,
            batch: Dict[str, Any],
    ) -> str:
        """返回可由 Telegram 编辑接口直接上传的本地总览拼图。"""
        path = self._notification_collage_path(batch_id)
        if not path.is_file() and batch.get("items"):
            self._build_notification_candidate_collage(
                batch_id=batch_id,
                candidates=list(batch.get("items") or []),
            )
        return str(path) if path.is_file() else ""

    def get_notification_candidate_collage_api(self, batch_id: str):
        """供 MoviePilot Telegram 模块读取本地候选海报拼图。"""
        if not re.fullmatch(r"[0-9a-f]{12}", str(batch_id or "")):
            return PlainTextResponse("collage not found", status_code=404)
        path = self._notification_collage_path(batch_id)
        if not path.exists() or not path.is_file():
            return PlainTextResponse("collage not found", status_code=404)
        return FileResponse(path, media_type="image/jpeg", filename=f"{batch_id}.jpg")

    @staticmethod
    def _sample_candidate_posters(
            candidates: List[Dict[str, Any]], limit: int,
    ) -> List[str]:
        posters = list(dict.fromkeys(
            str(item.get("poster") or "").strip()
            for item in candidates
            if str(item.get("poster") or "").strip()
        ))
        if len(posters) <= limit:
            return posters
        indexes = [
            round(index * (len(posters) - 1) / (limit - 1))
            for index in range(limit)
        ]
        return [posters[index] for index in indexes]

    @staticmethod
    def _fetch_candidate_poster(url: str) -> Optional[bytes]:
        response = None
        try:
            response = RequestUtils(
                proxies=settings.PROXY,
                timeout=8,
            ).get_res(url=url)
            if response is None or response.status_code != 200:
                return None
            return response.content
        except Exception as err:  # noqa: BLE001 - 单张海报失败不影响通知正文。
            logger.debug(f"[媒体整理增强] 候选海报下载失败：{url}，{err}")
            return None
        finally:
            if response is not None:
                try:
                    response.close()
                except Exception:
                    pass

    def _build_notification_candidate_collage(
            self,
            *,
            batch_id: str,
            candidates: List[Dict[str, Any]],
    ) -> str:
        """从批次中均匀抽取最多九张海报，生成 Telegram 总览拼图。"""
        if Image is None or ImageOps is None:
            return ""
        urls = self._sample_candidate_posters(
            candidates, self.NOTIFICATION_COLLAGE_LIMIT,
        )
        if not urls:
            return ""
        fetched: Dict[str, bytes] = {}
        with ThreadPoolExecutor(max_workers=min(6, len(urls))) as executor:
            futures = {
                executor.submit(self._fetch_candidate_poster, url): url
                for url in urls
            }
            for future in as_completed(futures):
                content = future.result()
                if content:
                    fetched[futures[future]] = content
        posters = []
        for url in urls:
            content = fetched.get(url)
            if not content:
                continue
            try:
                posters.append(Image.open(BytesIO(content)).convert("RGB"))
            except Exception as err:  # noqa: BLE001 - 损坏图片只跳过该张。
                logger.debug(f"[媒体整理增强] 候选海报解码失败：{url}，{err}")
        if not posters:
            return ""

        columns = min(3, len(posters))
        rows = (len(posters) + columns - 1) // columns
        tile_width, tile_height, gap = 240, 360, 8
        canvas = Image.new(
            "RGB",
            (
                columns * tile_width + (columns + 1) * gap,
                rows * tile_height + (rows + 1) * gap,
            ),
            (28, 25, 38),
        )
        resampling = getattr(getattr(Image, "Resampling", Image), "LANCZOS")
        for index, poster in enumerate(posters):
            tile = ImageOps.fit(
                poster,
                (tile_width, tile_height),
                method=resampling,
                centering=(0.5, 0.5),
            )
            x = gap + (index % columns) * (tile_width + gap)
            y = gap + (index // columns) * (tile_height + gap)
            canvas.paste(tile, (x, y))

        path = self._notification_collage_path(batch_id)
        path.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(path, format="JPEG", quality=88, optimize=True)
        # 审批批次可能跨季度才处理；过早删除会令“返回总览”只能恢复文字。
        # 与候选任务的长期可操作性保持一致，拼图保留 90 天。
        cutoff = time.time() - 90 * 24 * 3600
        for old_path in path.parent.glob("*.jpg"):
            try:
                if old_path != path and old_path.stat().st_mtime < cutoff:
                    old_path.unlink(missing_ok=True)
            except OSError:
                continue
        return self._notification_collage_url(batch_id)

    def _notification_candidate_callback(
            self, action: str, batch_id: str, page: int = 0,
    ) -> str:
        value = (
            f"[PLUGIN]{self.__class__.__name__}|"
            f"nc:{action}:{batch_id}:{max(0, int(page))}"
        )
        if len(value.encode("utf-8")) > 64:
            raise ValueError("Telegram callback_data exceeds 64 bytes")
        return value

    def _notification_candidate_group_callback(
            self,
            batch_id: str,
            page: int,
            group_index: int,
    ) -> str:
        value = (
            f"[PLUGIN]{self.__class__.__name__}|"
            f"nc:s:{batch_id}:{max(0, int(page))}:{max(0, int(group_index))}"
        )
        if len(value.encode("utf-8")) > 64:
            raise ValueError("Telegram callback_data exceeds 64 bytes")
        return value

    @staticmethod
    def _notification_candidate_text(value: Any, limit: int) -> str:
        text = re.sub(r"\s+", " ", str(value or "")).strip()
        return text if len(text) <= limit else f"{text[:max(1, limit - 1)]}…"

    def _notification_candidate_heading(
            self,
            title: str,
            *,
            fallback_emoji: str,
    ) -> Any:
        """生成醒目的 Rich 标题；会员表情不可用时保留普通表情。"""
        custom_emoji_id = str(
            self._config.get("notification_candidate_custom_emoji_id") or ""
        ).strip()
        if custom_emoji_id:
            return [
                {
                    "type": "custom_emoji",
                    "custom_emoji_id": custom_emoji_id,
                    "alternative_text": fallback_emoji,
                },
                " ",
                title,
            ]
        return f"{fallback_emoji} {title}"

    @staticmethod
    def _notification_batch_pending_items(
            batch: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        handled = set(str(value) for value in batch.get("handled_ids") or [])
        return [
            item for item in batch.get("items") or []
            if str(item.get("id") or "") not in handled
        ]

    def _render_notification_candidate_summary(
            self,
            *,
            batch_id: str,
            batch: Dict[str, Any],
            notice: str = "",
    ) -> Dict[str, Any]:
        pending = self._notification_batch_pending_items(batch)
        candidate_type = str(batch.get("candidate_type") or "ready")
        quarter = str(batch.get("quarter") or "")
        total = len(batch.get("items") or [])
        handled = total - len(pending)
        page_count = max(
            1,
            (len(pending) + self.NOTIFICATION_CANDIDATE_PAGE_SIZE - 1)
            // self.NOTIFICATION_CANDIDATE_PAGE_SIZE,
        )
        if not pending:
            completed_text = notice or f"本批次 {total} 部候选均已处理。"
            rich_completed = self._rich_markdown_escape(completed_text)
            return {
                "title": f"批次处理完成 · {quarter}",
                "text": completed_text,
                "rich_markdown": (
                    "# ✅ 批次处理完成\n\n"
                    f"**{self._rich_markdown_escape(quarter)} · {total} 部**\n\n"
                    f"> {rich_completed}"
                ),
                "rich_text": (
                    f"<blockquote>{html_utils.escape(completed_text)}</blockquote>"
                ),
                "rich_blocks": [
                    {
                        "type": "heading",
                        "size": 1,
                        "text": self._notification_candidate_heading(
                            "批次处理完成",
                            fallback_emoji="✅",
                        ),
                    },
                    {
                        "type": "divider",
                    },
                    {
                        "type": "paragraph",
                        "text": {
                            "type": "bold",
                            "text": f"{quarter} · {total} 部",
                        },
                    },
                    {
                        "type": "paragraph",
                        "text": completed_text,
                    },
                ],
                "buttons": [],
                "image": str(batch.get("collage") or ""),
            }

        kind_text = "集数偏移候选" if candidate_type == "ready" else "扫描失败候选"
        lines = [
            f"{quarter} · {kind_text}",
            "",
            f"待审批：{len(pending)} 部",
            "",
            f"处理进度：{handled} / {total}",
            "",
            f"详情分页：共 {page_count} 页",
        ]
        if notice:
            lines.extend(["", f"操作结果：{notice}"])
        lines.extend(["", "可进入详情逐项处理，也可直接处理整批。"])
        rich_lines = []
        if notice:
            rich_lines.append(
                f"<blockquote>{html_utils.escape(notice)}</blockquote>"
            )
        rich_lines.extend([
            f"<b>{html_utils.escape(kind_text)} · {len(pending)} 部</b>",
            (
                f"已处理 <b>{handled}</b> / {total}"
                f"　·　共 <b>{page_count}</b> 页"
            ),
            (
                "<i>来源："
                f"{html_utils.escape('实时新增' if batch.get('realtime') else '计划批次')}"
                f" · {html_utils.escape(quarter)}</i>"
            ),
            (
                "<blockquote>进入详情页可逐项查看海报、匹配证据并处理；"
                "也可在总览直接处理整批。</blockquote>"
            ),
        ])
        rich_notice = ""
        if notice:
            rich_notice = (
                f"> {self._rich_markdown_escape(notice)}\n\n"
            )
        source_text = self._rich_markdown_escape(
            "实时新增" if batch.get("realtime") else "计划批次"
        )
        rich_markdown = (
            f"# {'🎬' if candidate_type == 'ready' else '⚠️'} "
            f"{self._rich_markdown_escape(kind_text)}\n\n"
            f"{rich_notice}"
            f"## {self._rich_markdown_escape(quarter)} · "
            f"{len(pending)} 部待审批\n\n"
            f"**处理进度**　{handled}/{total}\n\n"
            f"**详情分页**　{page_count} 页\n\n"
            f"**来源**　{source_text}\n\n"
            "> 查看详情可逐项处理，也可使用下方按钮处理整批。"
        )
        buttons = [[{
            "text": f"📋 查看详情 1/{page_count}",
            "style": "primary",
            "callback_data": self._notification_candidate_callback(
                "p", batch_id, 0,
            ),
        }]]
        if candidate_type == "ready":
            buttons.extend([
                [
                    {
                        "text": "✅ 整批按 TMDB 默认加入",
                        "style": "success",
                        "callback_data": self._notification_candidate_callback(
                            "D", batch_id,
                        ),
                    },
                    {
                        "text": "🎞 整批优先剧集组加入",
                        "style": "success",
                        "callback_data": self._notification_candidate_callback(
                            "G", batch_id,
                        ),
                    },
                ],
                [{
                    "text": "🗑 忽略整批",
                    "style": "danger",
                    "callback_data": self._notification_candidate_callback(
                        "I", batch_id,
                    ),
                }],
            ])
        else:
            buttons.append([
                {
                    "text": "🔄 整批重新扫描",
                    "style": "success",
                    "callback_data": self._notification_candidate_callback(
                        "R", batch_id,
                    ),
                },
                {
                    "text": "🗑 忽略整批",
                    "style": "danger",
                    "callback_data": self._notification_candidate_callback(
                        "I", batch_id,
                    ),
                },
            ])
        return {
            "title": f"{quarter} · {kind_text} {len(pending)} 部",
            "text": "\n".join(lines),
            "rich_markdown": rich_markdown,
            "rich_text": "\n\n".join(rich_lines),
            "rich_blocks": [
                {
                    "type": "heading",
                    "size": 1,
                    "text": self._notification_candidate_heading(
                        (
                            f"{'集数偏移候选' if candidate_type == 'ready' else '扫描失败候选'}"
                            " · 审批总览"
                        ),
                        fallback_emoji=(
                            "🎬" if candidate_type == "ready" else "⚠️"
                        ),
                    ),
                },
                {
                    "type": "divider",
                },
                {
                    "type": "paragraph",
                    "text": {
                        "type": "bold",
                        "text": f"{quarter} · 待审批 {len(pending)} 部",
                    },
                },
                {
                    "type": "paragraph",
                    "text": [
                        {
                            "type": "bold",
                            "text": "处理进度",
                        },
                        f"　{handled}/{total}",
                    ],
                },
                {
                    "type": "paragraph",
                    "text": [
                        {
                            "type": "bold",
                            "text": "详情分页",
                        },
                        f"　{page_count} 页",
                    ],
                },
                *(
                    [{
                        "type": "paragraph",
                        "text": {
                            "type": "bold",
                            "text": notice,
                        },
                    }]
                    if notice else []
                ),
            ],
            "buttons": buttons,
            "image": str(batch.get("collage") or ""),
        }

    def _render_notification_candidate_page(
            self,
            *,
            batch_id: str,
            batch: Dict[str, Any],
            page: int,
            notice: str = "",
    ) -> Dict[str, Any]:
        pending = self._notification_batch_pending_items(batch)
        if not pending:
            return self._render_notification_candidate_summary(
                batch_id=batch_id, batch=batch, notice=notice,
            )
        page_size = self.NOTIFICATION_CANDIDATE_PAGE_SIZE
        page_count = max(1, (len(pending) + page_size - 1) // page_size)
        page = min(max(0, page), page_count - 1)
        page_items = pending[page * page_size:(page + 1) * page_size]
        candidate_type = str(batch.get("candidate_type") or "ready")
        lines = [f"操作结果：{notice}", ""] if notice else []
        rich_lines = (
            [f"<blockquote>{html_utils.escape(notice)}</blockquote>"]
            if notice else []
        )
        for offset, item in enumerate(page_items, start=page * page_size + 1):
            if lines and lines[-1] != "":
                lines.append("")
            title = self._notification_candidate_text(
                item.get("title") or item.get("original_title") or "未命名",
                80,
            )
            original = self._notification_candidate_text(
                item.get("original_title"), 90,
            )
            lines.append(f"{offset}. {title}")
            rich_lines.append(
                f"<b>{offset}. {html_utils.escape(title)}</b>"
            )
            if original and original.casefold() != title.casefold():
                lines.append(f"   原名：{original}")
                rich_lines.append(
                    f"<i>原名：{html_utils.escape(original)}</i>"
                )
            if candidate_type == "ready":
                score = item.get("score")
                evidence = f"TMDB {item.get('tmdb_id')}"
                if score is not None:
                    evidence += f" · 匹配 {score} 分"
                lines.append(f"   {evidence}")
                rich_lines.append(
                    f"<code>{html_utils.escape(evidence)}</code>"
                )
            else:
                failure_reason = self._notification_candidate_text(
                    item.get("scan_error") or "未匹配到可信 TMDB 候选",
                    120,
                )
                lines.append(
                    "   原因："
                    f"{failure_reason}"
                )
                rich_lines.append(
                    "<blockquote expandable>扫描原因："
                    f"{html_utils.escape(failure_reason)}</blockquote>"
                )
            facts = [
                str(item.get("platform") or "").replace("_", " "),
                str(item.get("date") or ""),
            ]
            if self._safe_int(item.get("episode_count"), 0):
                facts.append(f"{self._safe_int(item.get('episode_count'), 0)} 集")
            if item.get("has_prequel"):
                facts.append("续作")
            if item.get("is_multi_season"):
                facts.append("多季")
            fact_text = " · ".join(value for value in facts if value)
            lines.append(f"   {fact_text}")
            if fact_text:
                rich_lines.append(f"<i>{html_utils.escape(fact_text)}</i>")
        lines.extend([
            "",
            f"详情分页：第 {page + 1} / {page_count} 页",
            f"尚待处理：{len(pending)} 部",
        ])
        rich_lines.append(
            f"<blockquote>第 <b>{page + 1}</b> / {page_count} 页"
            f"　·　尚待处理 <b>{len(pending)}</b> 部</blockquote>"
        )
        focus = page_items[0]
        focus_title = self._notification_candidate_text(
            focus.get("title") or focus.get("original_title") or "未命名",
            120,
        )
        original_title = self._notification_candidate_text(
            focus.get("original_title"), 180,
        )
        score = focus.get("score")
        platform = str(focus.get("platform") or "未知").replace("_", " ")
        date_value = str(focus.get("date") or "未提供")
        episode_count = self._safe_int(focus.get("episode_count"), 0)
        traits = [
            value for value, enabled in (
                ("续作", focus.get("has_prequel")),
                ("多季", focus.get("is_multi_season")),
            )
            if enabled
        ]
        status_text = (
            "匹配完成" if candidate_type == "ready" else "扫描未通过"
        )
        tmdb_id = self._safe_int(focus.get("tmdb_id"), 0)
        tmdb_value = (
            f"[{tmdb_id}](https://www.themoviedb.org/tv/{tmdb_id})"
            if tmdb_id else "—"
        )
        detail_rows = [
            (
                "状态",
                f"{status_text} · 第 {page + 1}/{page_count} 页",
            ),
            ("TMDB", tmdb_value),
        ]
        if score is not None:
            detail_rows.append(("匹配分", f"**{score} 分**"))
        detail_rows.extend([
            ("载体", self._rich_markdown_escape(platform)),
            ("开播日期", self._rich_markdown_escape(date_value)),
            ("集数", f"{episode_count} 集" if episode_count else "—"),
        ])
        if traits:
            detail_rows.append((
                "作品特征",
                " · ".join(
                    self._rich_markdown_escape(value)
                    for value in traits
                ),
            ))
        if original_title:
            detail_rows.append((
                "原名", self._rich_markdown_escape(original_title),
            ))
        if candidate_type != "ready":
            detail_rows.append((
                "失败原因",
                self._rich_markdown_escape(
                    self._notification_candidate_text(
                        focus.get("scan_error") or "未匹配到可信 TMDB 候选",
                        100,
                    ),
                ),
            ))
        if notice:
            detail_rows.append((
                "操作结果", self._rich_markdown_escape(notice),
            ))
        rich_markdown_lines = [
            f"# {self._rich_markdown_escape(focus_title)}",
            "",
            "| 项目 | 信息 |",
            "|:--|:--|",
            *[
                f"| {self._rich_markdown_escape(label)} | {value} |"
                for label, value in detail_rows
            ],
        ]
        rich_markdown = "\n".join(rich_markdown_lines)
        block_rows: List[Tuple[Any, Any]] = [
            (
                "状态",
                {
                    "type": "bold",
                    "text": f"{status_text} · 第 {page + 1}/{page_count} 页",
                },
            ),
            (
                "TMDB",
                (
                    {
                        "type": "url",
                        "text": str(tmdb_id),
                        "url": f"https://www.themoviedb.org/tv/{tmdb_id}",
                    }
                    if tmdb_id else "—"
                ),
            ),
        ]
        if score is not None:
            block_rows.append((
                "匹配分",
                {
                    "type": "bold",
                    "text": f"{score} 分",
                },
            ))
        block_rows.extend([
            ("载体", platform),
            ("开播日期", date_value),
            ("集数", f"{episode_count} 集" if episode_count else "—"),
        ])
        if traits:
            block_rows.append(("作品特征", " · ".join(traits)))
        if original_title:
            block_rows.append(("原名", original_title))
        if candidate_type != "ready":
            block_rows.append((
                "失败原因",
                self._notification_candidate_text(
                    focus.get("scan_error") or "未匹配到可信 TMDB 候选",
                    100,
                ),
            ))
        if notice:
            block_rows.append(("操作结果", notice))

        nav = []
        if page > 0:
            nav.append({
                "text": "⬅️ 上一页",
                "callback_data": self._notification_candidate_callback(
                    "p", batch_id, page - 1,
                ),
            })
        nav.append({
            "text": "🏠 返回总览",
            "style": "primary",
            "callback_data": self._notification_candidate_callback(
                "o", batch_id,
            ),
        })
        if page + 1 < page_count:
            nav.append({
                "text": "下一页 ➡️",
                "callback_data": self._notification_candidate_callback(
                    "p", batch_id, page + 1,
                ),
            })
        buttons = [nav]
        if candidate_type == "ready":
            buttons.extend([
                [
                    {
                        "text": "✅ 按 TMDB 默认加入",
                        "style": "success",
                        "callback_data": self._notification_candidate_callback(
                            "d", batch_id, page,
                        ),
                    },
                    {
                        "text": "查看剧集组",
                        "style": "primary",
                        "callback_data": self._notification_candidate_callback(
                            "v", batch_id, page,
                        ),
                    },
                ],
                [{
                    "text": "🗑 忽略此项",
                    "style": "danger",
                    "callback_data": self._notification_candidate_callback(
                        "i", batch_id, page,
                    ),
                }],
            ])
        else:
            buttons.extend([
                [
                    {
                        "text": "填写 TMDB · 默认编集",
                        "style": "primary",
                        "callback_data": self._notification_candidate_callback(
                            "m", batch_id, page,
                        ),
                    },
                    {
                        "text": "填写 TMDB · 选择剧集组",
                        "style": "primary",
                        "callback_data": self._notification_candidate_callback(
                            "M", batch_id, page,
                        ),
                    },
                ],
                [
                    {
                        "text": "🔄 重新扫描此项",
                        "style": "success",
                        "callback_data": self._notification_candidate_callback(
                            "r", batch_id, page,
                        ),
                    },
                    {
                        "text": "🗑 忽略此项",
                        "style": "danger",
                        "callback_data": self._notification_candidate_callback(
                            "i", batch_id, page,
                        ),
                    },
                ],
            ])
        # 详情页只能展示当前条目的单张海报；没有海报时宁可只显示文字，
        # 也不能回退总览拼图造成“详情仍是组合图”的错觉。
        image = str(page_items[0].get("poster") or "")
        return {
            "title": (
                f"{focus_title} · "
                f"{'候选详情' if candidate_type == 'ready' else '失败详情'} "
                f"{page + 1}/{page_count}"
            ),
            "text": "\n".join(lines),
            "rich_markdown": rich_markdown,
            "rich_text": "\n\n".join(rich_lines),
            "rich_blocks": [
                {
                    "type": "heading",
                    "size": 1,
                    "text": self._notification_candidate_heading(
                        focus_title,
                        fallback_emoji=(
                            "🎞" if candidate_type == "ready" else "🔎"
                        ),
                    ),
                },
                self._candidate_rich_table(block_rows),
            ],
            "buttons": buttons,
            "image": image,
            "page_item_ids": [
                str(item.get("id")) for item in page_items if item.get("id")
            ],
            "page": page,
        }

    @staticmethod
    def _episode_group_type_label(value: Any) -> str:
        return {
            1: "原始播出",
            2: "绝对顺序",
            3: "DVD",
            4: "数字发行",
            5: "故事线",
            6: "制片",
        }.get(TmdbRecognizeEnhancer._safe_int(value, 0), "自定义")

    def _notification_candidate_group_inspection(
            self,
            *,
            batch: Dict[str, Any],
            item: Dict[str, Any],
    ) -> Dict[str, Any]:
        tmdb_id = self._safe_int(item.get("tmdb_id"), 0)
        cache = batch.setdefault("episode_group_inspections", {})
        cached = cache.get(str(tmdb_id)) if isinstance(cache, dict) else None
        if isinstance(cached, dict):
            return cached
        if not tmdb_id:
            result = {"tmdb_id": 0, "groups": [], "error": "候选缺少 TMDBID"}
        else:
            try:
                result = self._normalizer().inspect(tmdb_id)
            except Exception as err:  # noqa: BLE001 - 通知页需把 TMDB 错误反馈出来。
                result = {
                    "tmdb_id": tmdb_id,
                    "groups": [],
                    "error": str(err),
                }
        cache[str(tmdb_id)] = deepcopy(result)
        return result

    def _render_notification_candidate_groups(
            self,
            *,
            batch_id: str,
            batch: Dict[str, Any],
            page: int,
            notice: str = "",
    ) -> Dict[str, Any]:
        page_view = self._render_notification_candidate_page(
            batch_id=batch_id,
            batch=batch,
            page=page,
        )
        item_ids = page_view.get("page_item_ids") or []
        pending_index = {
            str(item.get("id") or ""): item
            for item in self._notification_batch_pending_items(batch)
        }
        item = pending_index.get(str(item_ids[0])) if item_ids else None
        if not item:
            return self._render_notification_candidate_summary(
                batch_id=batch_id,
                batch=batch,
                notice=notice or "当前候选已处理。",
            )
        inspection = self._notification_candidate_group_inspection(
            batch=batch,
            item=item,
        )
        groups = [
            group for group in inspection.get("groups") or []
            if isinstance(group, dict) and str(group.get("id") or "").strip()
        ]
        focus_title = self._notification_candidate_text(
            inspection.get("title")
            or item.get("title")
            or item.get("original_title")
            or "未命名",
            120,
        )
        default_info = inspection.get("default") or {}
        default_seasons = [
            season for season in default_info.get("seasons") or []
            if not season.get("is_special")
        ]
        blocks: List[Dict[str, Any]] = [
            {
                "type": "heading",
                "size": 1,
                "text": self._notification_candidate_heading(
                    f"{focus_title} · 剧集组",
                    fallback_emoji="🎞",
                ),
            },
            {
                "type": "paragraph",
                "text": (
                    f"TMDB 默认编集：{len(default_seasons)} 个正季 · "
                    f"{self._safe_int(default_info.get('episode_count'), 0)} 集"
                ),
            },
        ]
        recommendation = inspection.get("recommendation") or {}
        recommended_group_id = str(
            recommendation.get("episode_group_id") or ""
        )
        if notice:
            blocks.append({
                "type": "blockquote",
                "blocks": [{"type": "paragraph", "text": notice}],
            })
        if groups:
            for group in groups:
                group_id = str(group.get("id") or "")
                group_name = self._notification_candidate_text(
                    group.get("name") or "未命名剧集组",
                    80,
                )
                group_type = self._episode_group_type_label(group.get("type"))
                recommended = group_id == recommended_group_id
                rows: List[Tuple[Any, Any]] = [
                    ("类型", group_type),
                    (
                        "规模",
                        f"{self._safe_int(group.get('group_count'), 0)} 组 · "
                        f"{self._safe_int(group.get('episode_count'), 0)} 集",
                    ),
                ]
                for season in group.get("seasons") or []:
                    season_number = self._safe_int(
                        season.get("season"), 0,
                    )
                    season_label = (
                        "S00 特别篇"
                        if season.get("is_special") or season_number == 0
                        else f"S{season_number:02d} {season.get('name') or ''}".strip()
                    )
                    first_episode = self._safe_int(
                        season.get("first_episode"), 0,
                    )
                    last_episode = self._safe_int(
                        season.get("last_episode"), 0,
                    )
                    episode_range = (
                        f"E{first_episode:02d}–E{last_episode:02d}"
                        if first_episode and last_episode else "集号未提供"
                    )
                    dates = [
                        str(season.get("first_air_date") or ""),
                        str(season.get("last_air_date") or ""),
                    ]
                    date_range = " → ".join(value for value in dates if value)
                    season_value = (
                        f"{self._safe_int(season.get('episode_count'), 0)} 集 · "
                        f"{episode_range}"
                    )
                    if date_range:
                        season_value += f"\n{date_range}"
                    rows.append((season_label, season_value))
                summary: Any = [
                    {
                        "type": "bold",
                        "text": f"{'推荐 · ' if recommended else ''}{group_name}",
                    },
                    f"　{group_type}",
                ]
                blocks.append({
                    "type": "details",
                    "summary": summary,
                    "blocks": [self._candidate_rich_table(rows)],
                    "is_open": recommended,
                })
        else:
            error_text = str(
                inspection.get("error") or "TMDB 没有提供可选剧集组"
            )
            blocks.append({
                "type": "blockquote",
                "blocks": [{
                    "type": "paragraph",
                    "text": error_text,
                }],
            })

        buttons: List[List[Dict[str, Any]]] = []
        for index, group in enumerate(groups):
            name = self._notification_candidate_text(
                group.get("name") or f"剧集组 {index + 1}",
                30,
            )
            buttons.append([{
                "text": f"选择 {name}",
                "style": (
                    "success"
                    if str(group.get("id") or "") == recommended_group_id
                    else "primary"
                ),
                "callback_data": self._notification_candidate_group_callback(
                    batch_id, page, index,
                ),
            }])
        buttons.append([{
            "text": "返回候选详情",
            "callback_data": self._notification_candidate_callback(
                "p", batch_id, page,
            ),
        }])
        lines = [
            f"{focus_title} · 剧集组",
            f"TMDB {self._safe_int(item.get('tmdb_id'), 0)}",
            f"可选剧集组：{len(groups)} 个",
        ]
        return {
            "title": f"{focus_title} · 选择剧集组",
            "text": "\n".join(lines),
            "rich_markdown": (
                f"# {self._rich_markdown_escape(focus_title)} · 剧集组\n\n"
                f"可选剧集组：**{len(groups)}** 个"
            ),
            "rich_text": (
                f"<b>{html_utils.escape(focus_title)} · 剧集组</b>\n"
                f"可选剧集组：{len(groups)} 个"
            ),
            "rich_blocks": blocks,
            "buttons": buttons,
            "image": str(item.get("poster") or ""),
            "page_item_ids": [str(item.get("id") or "")],
            "page": self._safe_int(page_view.get("page"), 0),
            "groups": groups,
        }

    @staticmethod
    def _candidate_seen_key(candidate: Dict[str, Any]) -> str:
        return (
            f"{candidate.get('candidate_type') or 'ready'}:"
            f"{candidate.get('quarter')}:{candidate.get('id')}"
        )

    def _initialize_notification_candidate_realtime_baseline(self) -> None:
        """以当前缓存为基线，开启监控时不逐条推送全部存量。"""
        approvals = self._read_notification_approvals()
        snapshot = self._notification_candidate_snapshot(self._current_quarter_key())
        approvals["realtime_seen"] = [
            *(approvals.get("realtime_seen") or []),
            *[
                self._candidate_seen_key(item)
                for item in [*snapshot["ready"], *snapshot["failed"]]
            ],
        ]
        approvals["realtime_initialized"] = True
        self._save_notification_approvals(approvals)

    def _store_notification_candidate_batch(
            self,
            *,
            quarter: str,
            candidate_type: str,
            candidates: List[Dict[str, Any]],
            batch_id: str = "",
            collage: str = "",
            delivery: Optional[Dict[str, Any]] = None,
            realtime: bool = False,
    ) -> str:
        item_ids = [str(item.get("id")) for item in candidates if item.get("id")]
        batch_id = batch_id or self._new_notification_candidate_batch_id(
            quarter=quarter,
            candidate_type=candidate_type,
            candidates=candidates,
        )
        approvals = self._read_notification_approvals()
        batches = approvals.get("batches") if isinstance(approvals.get("batches"), dict) else {}
        batches[batch_id] = {
            "quarter": quarter,
            "candidate_type": candidate_type,
            "item_ids": item_ids,
            "items": deepcopy(candidates),
            "handled_ids": [],
            "preference": self._config.get("notification_candidate_preference"),
            "collage": collage,
            "message_id": (delivery or {}).get("message_id"),
            "media_message_id": (delivery or {}).get("media_message_id"),
            "rich_photo_unique_id": (
                (delivery or {}).get("photo_unique_id") or ""
            ),
            "rich_image_digest": (
                (delivery or {}).get("image_digest") or ""
            ),
            "chat_id": (delivery or {}).get("chat_id"),
            "realtime": bool(realtime),
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        approvals["batches"] = batches
        approvals["realtime_seen"] = [
            *(approvals.get("realtime_seen") or []),
            *[self._candidate_seen_key(item) for item in candidates],
        ]
        self._save_notification_approvals(approvals)
        return batch_id

    def _remember_notification_candidate_media_message(
            self,
            *,
            batch_id: str,
            batch: Dict[str, Any],
            delivery: Dict[str, Any],
    ) -> None:
        """记录 Rich 图片身份，并清理升级前批次的独立视觉消息状态。"""
        media_message_id = (
            self._safe_int(delivery.get("media_message_id"), 0) or None
        )
        photo_unique_id = str(delivery.get("photo_unique_id") or "")
        image_digest = str(delivery.get("image_digest") or "")
        if (
                batch.get("media_message_id") == media_message_id
                and str(batch.get("rich_photo_unique_id") or "")
                == photo_unique_id
                and str(batch.get("rich_image_digest") or "")
                == image_digest
        ):
            return
        batch["media_message_id"] = media_message_id
        batch["rich_photo_unique_id"] = photo_unique_id
        batch["rich_image_digest"] = image_digest
        approvals = self._read_notification_approvals()
        batches = (
            approvals.get("batches")
            if isinstance(approvals.get("batches"), dict)
            else {}
        )
        batches[batch_id] = batch
        approvals["batches"] = batches
        self._save_notification_approvals(approvals)

    @staticmethod
    def _new_notification_candidate_batch_id(
            *,
            quarter: str,
            candidate_type: str,
            candidates: List[Dict[str, Any]],
    ) -> str:
        item_ids = [str(item.get("id")) for item in candidates if item.get("id")]
        return hashlib.sha1(
            (
                f"{quarter}|{candidate_type}|{time.time_ns()}|"
                f"{'|'.join(item_ids)}"
            ).encode("utf-8", errors="ignore")
        ).hexdigest()[:12]

    def _send_notification_candidate_group(
            self,
            *,
            quarter: str,
            candidate_type: str,
            candidates: List[Dict[str, Any]],
            realtime: bool = False,
    ) -> bool:
        """向候选专用实例立即发送一批或一条交互通知。"""
        if not candidates or not self._notification_candidate_delivery_active():
            return False
        batch_id = self._new_notification_candidate_batch_id(
            quarter=quarter,
            candidate_type=candidate_type,
            candidates=candidates,
        )
        target = self._notification_candidate_target()
        if not target:
            logger.warning("[媒体整理增强] 未选择可接收“插件”通知的候选专用实例")
            return False
        collage = self._build_notification_candidate_collage(
            batch_id=batch_id,
            candidates=candidates,
        )
        pending_batch = {
            "quarter": quarter,
            "candidate_type": candidate_type,
            "items": deepcopy(candidates),
            "handled_ids": [],
            "collage": collage,
            "realtime": bool(realtime),
        }
        view = self._render_notification_candidate_summary(
            batch_id=batch_id,
            batch=pending_batch,
        )
        delivery = self._send_candidate_instance_notification(
            title=view["title"],
            text=view["text"],
            buttons=view["buttons"],
            channel=target[0],
            service=target[1],
            image=(
                str(self._notification_collage_path(batch_id))
                if self._notification_collage_path(batch_id).is_file()
                else view["image"]
            ),
            rich_markdown=view.get("rich_markdown", ""),
            rich_text=view.get("rich_text", ""),
            rich_blocks=view.get("rich_blocks"),
        )
        if not delivery.get("success"):
            logger.error(
                f"[媒体整理增强] 候选通知发送失败：实例={target[1]}，"
                f"季度={quarter}，类型={candidate_type}"
            )
            return False
        self._store_notification_candidate_batch(
            quarter=quarter,
            candidate_type=candidate_type,
            candidates=candidates,
            batch_id=batch_id,
            collage=collage,
            delivery=delivery,
            realtime=realtime,
        )
        return True

    def _monitor_notification_candidates(self, quarter: str) -> None:
        """扫描后仅推送相对基线新增的候选，每个条目单独通知。"""
        if not (
                self._notification_candidate_delivery_active()
                and self._config.get("notification_candidate_realtime_enabled")
        ):
            return
        snapshot = self._notification_candidate_snapshot(quarter)
        candidates = [*snapshot["ready"], *snapshot["failed"]]
        approvals = self._read_notification_approvals()
        if not approvals.get("realtime_initialized"):
            approvals["realtime_seen"] = [
                *(approvals.get("realtime_seen") or []),
                *[self._candidate_seen_key(item) for item in candidates],
            ]
            approvals["realtime_initialized"] = True
            self._save_notification_approvals(approvals)
            return
        seen = set(str(value) for value in approvals.get("realtime_seen") or [])
        for candidate in candidates:
            if self._candidate_seen_key(candidate) in seen:
                continue
            self._send_notification_candidate_group(
                quarter=quarter,
                candidate_type=str(candidate.get("candidate_type") or "ready"),
                candidates=[candidate],
                realtime=True,
            )

    def _notification_candidate_batch_period(
            self, now: Optional[datetime] = None,
    ) -> str:
        now = now or datetime.now()
        frequency = str(
            self._config.get("notification_candidate_batch_frequency") or "monthly"
        )
        if frequency == "quarterly":
            return f"{now.year}-Q{((now.month - 1) // 3) + 1}"
        return now.strftime("%Y-%m")

    def _notification_candidate_schedule_status(self) -> Dict[str, Any]:
        frequency = str(
            self._config.get("notification_candidate_batch_frequency") or "monthly"
        )
        approvals = self._read_notification_approvals()
        return {
            "frequency": frequency,
            "hour": self._safe_int(
                self._config.get("notification_candidate_batch_hour"), 9,
            ),
            "last_period": str(
                (approvals.get("last_batch_periods") or {}).get(frequency) or ""
            ),
            "current_period": self._notification_candidate_batch_period(),
        }

    def _scheduled_notification_candidate_tick(self) -> None:
        """小时服务：月初或季度首月月初生成一次存量审批批次。"""
        now = datetime.now()
        if not (
                self._notification_candidate_delivery_active()
                and self._config.get("notification_candidate_batch_enabled")
        ):
            return
        frequency = str(
            self._config.get("notification_candidate_batch_frequency") or "monthly"
        )
        hour = self._safe_int(
            self._config.get("notification_candidate_batch_hour"), 9,
        )
        if now.day > 3 or now.hour < hour:
            return
        if frequency == "quarterly" and now.month not in (1, 4, 7, 10):
            return
        self._send_notification_candidate_batch(force=False, now=now)

    def _send_notification_candidate_batch(
            self,
            *,
            force: bool,
            now: Optional[datetime] = None,
            quarter_override: str = "",
            candidate_options: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        now = now or datetime.now()
        frequency = str(
            self._config.get("notification_candidate_batch_frequency") or "monthly"
        )
        period = self._notification_candidate_batch_period(now)
        approvals = self._read_notification_approvals()
        periods = (
            approvals.get("last_batch_periods")
            if isinstance(approvals.get("last_batch_periods"), dict)
            else {}
        )
        if not force and str(periods.get(frequency) or "") == period:
            return {"sent": False, "reason": "本周期已发送", "period": period}
        quarter = (
            quarter_override
            if re.fullmatch(r"\d{4}-Q[1-4]", quarter_override or "")
            else f"{now.year}-Q{((now.month - 1) // 3) + 1}"
        )
        snapshot = self._notification_candidate_snapshot(
            quarter,
            candidate_options,
        )
        ready_sent = False
        failed_sent = False
        if self._notification_candidate_delivery_active():
            if snapshot["ready"]:
                ready_sent = self._send_notification_candidate_group(
                    quarter=quarter,
                    candidate_type="ready",
                    candidates=snapshot["ready"],
                )
            if snapshot["failed"]:
                failed_sent = self._send_notification_candidate_group(
                    quarter=quarter,
                    candidate_type="failed",
                    candidates=snapshot["failed"],
                )
        attempted = int(bool(snapshot["ready"])) + int(bool(snapshot["failed"]))
        delivered = int(ready_sent) + int(failed_sent)
        # 手工“立即生成”仅用于试发和临时审批，不占用计划任务本周期配额。
        if not force and attempted and delivered == attempted:
            approvals = self._read_notification_approvals()
            approvals["last_batch_periods"] = {
                **(approvals.get("last_batch_periods") or {}),
                frequency: period,
            }
            self._save_notification_approvals(approvals)
        return {
            "sent": bool(delivered),
            "delivery_attempted": attempted,
            "delivery_succeeded": delivered,
            "delivery_failed": max(0, attempted - delivered),
            "period": period,
            "quarter": quarter,
            "ready": len(snapshot["ready"]),
            "failed": len(snapshot["failed"]),
        }

    def send_notification_candidate_batch_api(
            self, payload: dict = Body(default={}),
    ) -> schemas.Response:
        """立即生成一批，用于验证筛选和专用通知实例。"""
        payload = payload or {}
        if not self._notification_candidate_delivery_active():
            return schemas.Response(
                success=False,
                message="请先启用候选通知、允许插件发送，并选择可接收“插件”消息的专用通知实例",
            )
        result = self._send_notification_candidate_batch(
            force=True,
            quarter_override=str(payload.get("quarter") or ""),
            candidate_options={
                "region": payload.get("region"),
                "platforms": payload.get("platforms"),
                "sequel_only": payload.get("sequel_only"),
            },
        )
        response_options = {
            "region": payload.get("region"),
            "platforms": payload.get("platforms"),
            "sequel_only": payload.get("sequel_only"),
        }
        delivery_failed = self._safe_int(result.get("delivery_failed"), 0)
        if delivery_failed:
            return schemas.Response(
                success=False,
                message=(
                    f"候选批次发送失败：{delivery_failed} 条通知未获得渠道成功结果。"
                    "请检查所选实例的 Token、Chat ID 和 MoviePilot 日志"
                ),
                data={
                    **result,
                    "snapshot": self._notification_candidate_snapshot(
                        result["quarter"],
                        response_options,
                    ),
                    "candidate_schedule": self._notification_candidate_schedule_status(),
                },
            )
        return schemas.Response(
            success=True,
            message=(
                f"批次已发送：可加入 {result['ready']} 部，"
                f"扫描失败 {result['failed']} 部"
            ),
            data={
                **result,
                "snapshot": self._notification_candidate_snapshot(
                    result["quarter"],
                    response_options,
                ),
                "candidate_schedule": self._notification_candidate_schedule_status(),
            },
        )

    def query_notification_candidates_api(
            self, payload: dict = Body(default={}),
    ) -> schemas.Response:
        quarter = str((payload or {}).get("quarter") or self._current_quarter_key())
        if not re.fullmatch(r"\d{4}-Q[1-4]", quarter):
            return schemas.Response(success=False, message="季度格式应为 2026-Q3")
        snapshot = self._notification_candidate_snapshot(quarter, {
            "region": (payload or {}).get("region"),
            "platforms": (payload or {}).get("platforms"),
            "sequel_only": (payload or {}).get("sequel_only"),
        })
        return schemas.Response(success=True, data={
            "quarter": quarter,
            "items": snapshot["ready"],
            "ready": snapshot["ready"],
            "failed": snapshot["failed"],
        })

    def action_notification_candidates_api(
            self, payload: dict = Body(...),
    ) -> schemas.Response:
        """批量加入、重试或忽略当前季度候选。"""
        payload = payload or {}
        quarter = str(payload.get("quarter") or self._current_quarter_key())
        action = str(payload.get("action") or "").strip().lower()
        item_ids = list(dict.fromkeys(
            str(value) for value in payload.get("item_ids") or [] if str(value)
        ))
        if not item_ids:
            return schemas.Response(success=False, message="请选择至少一个候选")
        candidate_options = {
            "region": payload.get("region"),
            "platforms": payload.get("platforms"),
            "sequel_only": payload.get("sequel_only"),
        }
        if action == "ignore":
            cached = self._read_season_catalog_cache().get(quarter) or {}
            catalog = cached.get("items") if isinstance(cached, dict) else []
            index = {
                str(item.get("id")): item for item in catalog or []
                if item.get("id")
            }
            ignored_identity_keys = []
            for item_id in item_ids:
                item = index.get(item_id)
                if item:
                    ignored_identity_keys.extend(
                        self._notification_candidate_identity_keys({
                            **item,
                            "quarter": item.get("quarter") or quarter,
                        })
                    )
            approvals = self._read_notification_approvals()
            approvals["ignored"] = [*(approvals.get("ignored") or []), *item_ids]
            approvals["ignored_keys"] = [
                *(approvals.get("ignored_keys") or []),
                *ignored_identity_keys,
            ]
            self._save_notification_approvals(approvals)
            snapshot = self._notification_candidate_snapshot(
                quarter, candidate_options,
            )
            return schemas.Response(
                success=True, message=f"已忽略 {len(item_ids)} 条候选",
                data={
                    "quarter": quarter,
                    "items": snapshot["ready"],
                    "ready": snapshot["ready"],
                    "failed": snapshot["failed"],
                },
            )
        if action == "retry":
            cached = self._read_season_catalog_cache().get(quarter) or {}
            catalog = cached.get("items") if isinstance(cached, dict) else []
            index = {str(item.get("id")): item for item in catalog or []}
            selected = [deepcopy(index[item_id]) for item_id in item_ids if item_id in index]
            if not selected:
                return schemas.Response(success=False, message="季度缓存中没有这些失败条目")
            threading.Thread(
                target=self._retry_notification_candidates_worker,
                args=(quarter, selected),
                name="notification-candidate-retry",
                daemon=True,
            ).start()
            snapshot = self._notification_candidate_snapshot(
                quarter, candidate_options,
            )
            return schemas.Response(
                success=True,
                message=f"已开始重新扫描 {len(selected)} 条失败候选",
                data={
                    "quarter": quarter,
                    "items": snapshot["ready"],
                    "ready": snapshot["ready"],
                    "failed": snapshot["failed"],
                    "retrying": [str(item.get("id")) for item in selected],
                },
            )
        if action not in ("add_default", "add_group"):
            return schemas.Response(success=False, message="不支持的审批动作")
        cached = self._read_season_catalog_cache().get(quarter) or {}
        catalog = cached.get("items") if isinstance(cached, dict) else []
        index = {str(item.get("id")): item for item in catalog or []}
        raw_overrides = payload.get("tmdb_id_overrides") or {}
        tmdb_id_overrides = {
            str(key): self._safe_int(value, 0)
            for key, value in raw_overrides.items()
            if self._safe_int(value, 0)
        } if isinstance(raw_overrides, dict) else {}
        raw_group_overrides = payload.get("episode_group_overrides") or {}
        episode_group_overrides = {
            str(key): str(value or "").strip()
            for key, value in raw_group_overrides.items()
            if str(value or "").strip()
        } if isinstance(raw_group_overrides, dict) else {}
        preference = "group_preferred" if action == "add_group" else "default"
        rules = self._read_episode_rules()
        added, failed = [], []
        for item_id in item_ids:
            item = index.get(item_id)
            if not item:
                failed.append({"id": item_id, "reason": "季度缓存中不存在"})
                continue
            try:
                add_kwargs = {
                    "tmdb_id_override": tmdb_id_overrides.get(item_id, 0),
                }
                if episode_group_overrides.get(item_id):
                    add_kwargs["episode_group_id_override"] = (
                        episode_group_overrides[item_id]
                    )
                added.append(self._add_catalog_item_to_rules(
                    item, preference, rules, **add_kwargs,
                ))
            except Exception as err:  # noqa: BLE001 - 批量审批逐条报告
                failed.append({"id": item_id, "reason": str(err)})
        if added:
            self.save_data(self.DATA_KEY_EPISODE_RULES, rules)
            # 人工补充 TMDBID 会同步改写 item 的匹配状态；必须持久化回季度
            # 缓存，否则下一次刷新仍会把同一条目列入“扫描失败”。
            self._save_season_catalog_quarter(quarter, catalog)
        snapshot = self._notification_candidate_snapshot(
            quarter, candidate_options,
        )
        return schemas.Response(
            success=True,
            message=f"已加入 {len(added)} 条，失败 {len(failed)} 条",
            data={
                "quarter": quarter,
                "added": added,
                "operation_failures": failed,
                "items": snapshot["ready"],
                "ready": snapshot["ready"],
                "failed": snapshot["failed"],
            },
        )

    def _retry_notification_candidates_worker(
            self,
            quarter: str,
            items: List[Dict[str, Any]],
    ) -> None:
        """后台逐条全新重试；不复用旧失败结果，并重新应用跨站 ID 数据库。"""
        for item in items:
            try:
                item["tmdb_match"] = {}
                item.pop("tmdb_candidates", None)
                item["scan_status"] = "scanning"
                item.pop("scan_error", None)
                self._merge_catalog_scan_item(quarter, item)
                self._enrich_cross_id_catalog_mappings([item])
                updated = self._scan_catalog_item(item)
            except Exception as err:  # noqa: BLE001 - 批量重试逐条保留错误
                item["scan_status"] = "failed"
                item["scan_error"] = str(err)
                updated = item
            self._merge_catalog_scan_item(quarter, updated)
        self._monitor_notification_candidates(quarter)

    def _send_enhanced_notification(
            self,
            *,
            title: str,
            text: str,
            source_notice: Dict[str, Any],
            buttons: Optional[List[List[dict]]] = None,
            channel: Any = None,
            service: str = "",
    ) -> Dict[str, Any]:
        """发送增强通知；指定实例时直发并取得回执，未指定时沿用 MP 广播队列。"""
        if NotificationType is None:
            logger.warning("[媒体整理增强] 当前 MoviePilot 缺少 NotificationType，无法发送增强通知")
            return {
                "success": False,
                "direct": bool(channel is not None and service),
                "error": "NotificationType unavailable",
            }
        delivery_fingerprint = hashlib.sha1(
            json.dumps(
                {
                    "channel": str(getattr(channel, "value", channel) or ""),
                    "service": str(service or ""),
                    "title": str(title or ""),
                    "text": str(text or ""),
                },
                ensure_ascii=False,
                sort_keys=True,
                separators=(",", ":"),
            ).encode("utf-8", errors="ignore")
        ).hexdigest()
        if not self._claim_shared_notification(
                "delivery",
                delivery_fingerprint,
                ttl=10.0,
        ):
            logger.info(
                "[媒体整理增强] 热更新切换窗口内已发送相同通知，本次不再重复投递："
                f"{title or '无标题'}"
            )
            return {
                "success": True,
                "direct": bool(channel is not None and service),
                "deduplicated": True,
                "error": None,
            }
        self._remember_outgoing_notification(title=title, text=text)
        if channel is not None and service:
            return self._send_direct_instance_notification(
                title=title,
                text=text,
                channel=channel,
                service=service,
                source_notice=source_notice,
                buttons=buttons,
            )
        kwargs: Dict[str, Any] = {}
        for key in ("image", "link", "userid", "username", "targets"):
            if source_notice.get(key):
                kwargs[key] = source_notice[key]
        if channel is not None:
            kwargs["channel"] = channel
        if service:
            kwargs["source"] = str(service)
        resolved_buttons = buttons if buttons is not None else source_notice.get("buttons")
        if resolved_buttons:
            kwargs["buttons"] = resolved_buttons
        self.post_message(
            mtype=NotificationType.Plugin,
            title=title,
            text=text,
            **kwargs,
        )
        return {"success": True, "direct": False, "submitted": True}

    def _prompt_notification_candidate_tmdb(
            self,
            *,
            event_data: Dict[str, Any],
            batch_id: str,
            batch: Dict[str, Any],
            page: int,
            preference: str,
            channel: Any,
            service: str,
    ) -> bool:
        """通过 MoviePilot 插件输入会话向 Telegram 用户索取一个 TMDBID。"""
        if plugin_input_interaction_manager is None:
            return False
        view = self._render_notification_candidate_page(
            batch_id=batch_id, batch=batch, page=page,
        )
        item_ids = view.get("page_item_ids") or []
        if not item_ids:
            return False
        item_id = str(item_ids[0])
        item = next(
            (
                value for value in batch.get("items") or []
                if str(value.get("id") or "") == item_id
            ),
            {},
        )
        userid = event_data.get("userid")
        chat_id = event_data.get("original_chat_id") or event_data.get("chat_id")
        if userid in (None, "") or chat_id in (None, ""):
            return False
        target_text = (
            "优先剧集组" if preference == "group_preferred" else "TMDB 默认编集"
        )
        prompt = self._send_candidate_instance_notification(
            title=(
                "补充 TMDBID · 选择剧集组"
                if preference == "group_preferred"
                else "补充 TMDBID · 默认编集"
            ),
            text=(
                f"{item.get('title') or item.get('original_title') or item_id}\n"
                f"目标：{target_text}\n"
                "请回复纯数字 TMDBID。"
                + (
                    "\n收到后会打开该 TMDB 条目的剧集组列表，"
                    "由你选择具体剧集组。"
                    if preference == "group_preferred" else ""
                )
                + "\n回复“取消”可退出。"
            ),
            buttons=[],
            channel=channel,
            service=service,
            force_reply=True,
            userid=str(userid),
            original_message_id=event_data.get("original_message_id"),
            original_chat_id=str(chat_id),
            rich_text=(
                f"<b>{html_utils.escape(str(
                    item.get('title') or item.get('original_title') or item_id
                ))}</b>\n"
                f"目标：<code>{html_utils.escape(target_text)}</code>\n"
                "<blockquote>请回复纯数字 TMDBID。"
                + (
                    "收到后会打开剧集组列表供你选择。"
                    if preference == "group_preferred" else ""
                )
                + "回复“取消”可退出。</blockquote>"
            ),
        )
        if not prompt.get("success") or not prompt.get("message_id"):
            return False
        plugin_input_interaction_manager.create_or_replace(
            user_id=userid,
            plugin_id=self.__class__.__name__,
            channel=channel,
            source=service,
            username=event_data.get("username"),
            chat_id=prompt.get("chat_id") or chat_id,
            prompt_message_id=prompt.get("message_id"),
            prompt_id=f"candidate-tmdb:{batch_id}:{item_id}",
            timeout_seconds=180,
            payload={
                "kind": "notification_candidate_tmdb",
                "batch_id": batch_id,
                "item_id": item_id,
                "page": page,
                "preference": preference,
                "original_message_id": event_data.get("original_message_id"),
                "original_chat_id": str(chat_id),
            },
        )
        return True

    def _handle_notification_candidate_tmdb_input(
            self, data: Dict[str, Any],
    ) -> None:
        """把 Telegram 文本回复作为失败候选的人工 TMDB 纠错并立即建规则。"""
        payload = data.get("payload") or {}
        if not isinstance(payload, dict) or payload.get("kind") != "notification_candidate_tmdb":
            return
        batch_id = str(payload.get("batch_id") or "")
        item_id = str(payload.get("item_id") or "")
        tmdb_text = str(data.get("input_text") or "").strip()
        tmdb_id = self._safe_int(tmdb_text, 0) if re.fullmatch(r"\d{1,9}", tmdb_text) else 0
        target = self._notification_candidate_target()
        channel = data.get("channel") or (target[0] if target else None)
        service = str(data.get("source") or (target[1] if target else ""))
        approvals = self._read_notification_approvals()
        batch = (approvals.get("batches") or {}).get(batch_id) or {}
        if not batch or not item_id:
            return

        if not tmdb_id:
            delivery = self._send_candidate_instance_notification(
                title="TMDBID 格式不正确",
                text="请输入纯数字 TMDBID。当前输入已取消，请在候选详情中重新点击“填写 TMDB”。",
                buttons=[],
                channel=channel,
                service=service,
                userid=str(data.get("userid") or "") or None,
                original_chat_id=str(data.get("chat_id") or "") or None,
            )
            return

        preference = str(payload.get("preference") or "default")
        if preference == "group_preferred":
            for item in batch.get("items") or []:
                if str(item.get("id") or "") == item_id:
                    item["tmdb_id"] = tmdb_id
                    break
            manual_overrides = (
                batch.get("tmdb_id_overrides")
                if isinstance(batch.get("tmdb_id_overrides"), dict)
                else {}
            )
            manual_overrides[item_id] = tmdb_id
            batch["tmdb_id_overrides"] = manual_overrides
            inspections = (
                batch.get("episode_group_inspections")
                if isinstance(batch.get("episode_group_inspections"), dict)
                else {}
            )
            inspections.pop(str(tmdb_id), None)
            batch["episode_group_inspections"] = inspections
            view = self._render_notification_candidate_groups(
                batch_id=batch_id,
                batch=batch,
                page=self._safe_int(payload.get("page"), 0),
                notice=f"已指定 TMDB {tmdb_id}，请选择确切剧集组。",
            )
            batches = (
                approvals.get("batches")
                if isinstance(approvals.get("batches"), dict)
                else {}
            )
            batches[batch_id] = batch
            approvals["batches"] = batches
            self._save_notification_approvals(approvals)
            delivery = self._send_candidate_instance_notification(
                title=view["title"],
                text=view["text"],
                buttons=view["buttons"],
                image=view.get("image", ""),
                channel=channel,
                service=service,
                original_message_id=payload.get("original_message_id"),
                original_media_message_id=batch.get("media_message_id"),
                original_photo_unique_id=batch.get("rich_photo_unique_id", ""),
                original_image_digest=batch.get("rich_image_digest", ""),
                original_chat_id=(
                    payload.get("original_chat_id")
                    or data.get("chat_id")
                ),
                rich_markdown=view.get("rich_markdown", ""),
                rich_text=view.get("rich_text", ""),
                rich_blocks=view.get("rich_blocks"),
            )
            if delivery.get("success"):
                self._remember_notification_candidate_media_message(
                    batch_id=batch_id,
                    batch=batch,
                    delivery=delivery,
                )
            return

        api_action = "add_group" if preference == "group_preferred" else "add_default"
        result = self.action_notification_candidates_api({
            "quarter": batch.get("quarter"),
            "item_ids": [item_id],
            "action": api_action,
            "tmdb_id_overrides": {item_id: tmdb_id},
        })
        result_data = getattr(result, "data", None)
        failures = (
            result_data.get("operation_failures") or []
            if isinstance(result_data, dict) else []
        )
        succeeded = bool(getattr(result, "success", False)) and not failures
        if succeeded:
            batch["handled_ids"] = list(dict.fromkeys([
                *(batch.get("handled_ids") or []), item_id,
            ]))
            batches = approvals.get("batches") or {}
            batches[batch_id] = batch
            approvals["batches"] = batches
            self._save_notification_approvals(approvals)
            notice = f"已按 TMDB {tmdb_id} 建立维护规则。"
        else:
            reason = (
                failures[0].get("reason")
                if failures and isinstance(failures[0], dict)
                else getattr(result, "message", None)
            )
            notice = f"TMDB {tmdb_id} 添加失败：{reason or '未知错误'}"

        page = self._safe_int(payload.get("page"), 0)
        view = (
            self._render_notification_candidate_page(
                batch_id=batch_id, batch=batch, page=page, notice=notice,
            )
            if self._notification_batch_pending_items(batch)
            else self._render_notification_candidate_summary(
                batch_id=batch_id, batch=batch, notice=notice,
            )
        )
        delivery = self._send_candidate_instance_notification(
            title=view["title"],
            text=view["text"],
            buttons=view["buttons"],
            image=(
                view["image"]
                if self._notification_batch_pending_items(batch) else ""
            ),
            channel=channel,
            service=service,
            original_message_id=payload.get("original_message_id"),
            original_media_message_id=batch.get("media_message_id"),
            original_photo_unique_id=batch.get("rich_photo_unique_id", ""),
            original_image_digest=batch.get("rich_image_digest", ""),
            original_chat_id=payload.get("original_chat_id"),
            rich_markdown=view.get("rich_markdown", ""),
            rich_text=view.get("rich_text", ""),
            rich_blocks=view.get("rich_blocks"),
        )
        if delivery.get("success"):
            self._remember_notification_candidate_media_message(
                batch_id=batch_id,
                batch=batch,
                delivery=delivery,
            )

    @staticmethod
    def _notification_fingerprint(
            *,
            title: Any,
            text: Any,
            mtype: Any = None,
    ) -> str:
        type_value = str(getattr(mtype, "value", mtype) or "")
        return hashlib.sha1(
            f"{type_value}\0{str(title or '')}\0{str(text or '')}".encode(
                "utf-8", errors="ignore",
            )
        ).hexdigest()

    def _remember_outgoing_notification(self, *, title: str, text: str) -> None:
        """短暂记录插件自发消息，避免 NoticeMessage 再次被通知增强接管。"""
        fingerprint = self._notification_fingerprint(
            title=title,
            text=text,
            mtype=NotificationType.Plugin if NotificationType is not None else "插件",
        )
        now = time.monotonic()
        with self._notification_outgoing_lock:
            self._notification_outgoing = {
                key: expires
                for key, expires in self._notification_outgoing.items()
                if expires > now
            }
            self._notification_outgoing[fingerprint] = now + 30.0

    def _is_outgoing_notification(self, notice: Dict[str, Any]) -> bool:
        fingerprint = self._notification_fingerprint(
            title=notice.get("title"),
            text=notice.get("text"),
            mtype=notice.get("mtype") or notice.get("type"),
        )
        now = time.monotonic()
        with self._notification_outgoing_lock:
            expires = self._notification_outgoing.get(fingerprint, 0)
            self._notification_outgoing = {
                key: deadline
                for key, deadline in self._notification_outgoing.items()
                if deadline > now
            }
        return expires > now

    @staticmethod
    def _claim_shared_notification(
            bucket: str,
            fingerprint: str,
            *,
            ttl: float,
    ) -> bool:
        """在 MoviePilot 进程级事件管理器上原子认领通知。

        插件热更新会替换运行实例，但 EventManager 单例持续存在。把短时防重
        状态放在这个稳定对象上，可避免旧定时回调与新实例在切换窗口内各发
        一次；完整重启会自然清空状态，不会留下跨重启脏记录。
        """
        try:
            state = vars(eventmanager).setdefault(
                "_tmdb_recognize_enhancer_notification_dedupe",
                {
                    "lock": threading.RLock(),
                    "buckets": {},
                },
            )
            lock = state.get("lock")
            if lock is None:
                lock = threading.RLock()
                state["lock"] = lock
            now = time.monotonic()
            with lock:
                buckets = state.setdefault("buckets", {})
                claims = buckets.get(bucket)
                if not isinstance(claims, dict):
                    claims = {}
                claims = {
                    key: deadline
                    for key, deadline in claims.items()
                    if deadline > now
                }
                if claims.get(fingerprint, 0) > now:
                    buckets[bucket] = claims
                    return False
                claims[fingerprint] = now + max(float(ttl), 0.1)
                buckets[bucket] = claims
                return True
        except Exception:
            # 测试桩或极旧 MP 若不允许给 EventManager 写属性，退回实例防重。
            return True

    @staticmethod
    def _incoming_notification_fingerprint(
            notice: Dict[str, Any],
    ) -> str:
        """生成与 MP 接收目标无关的通知指纹。

        MoviePilot 会在管理员/用户隔离发送时，为同一条已渲染通知按 targets
        分别广播 NoticeMessage。插件最终只投递到用户指定的一个通知实例，
        因而不能把 targets 纳入指纹，否则同一消息会被接管发送多次。
        """
        payload = {
            "mtype": str(notice.get("mtype") or notice.get("type") or ""),
            "ctype": str(notice.get("ctype") or ""),
            "title": str(notice.get("title") or ""),
            "text": str(notice.get("text") or ""),
        }
        return hashlib.sha1(
            json.dumps(
                payload,
                ensure_ascii=False,
                sort_keys=True,
                separators=(",", ":"),
                default=str,
            ).encode("utf-8", errors="ignore")
        ).hexdigest()

    def _claim_incoming_notification(
            self,
            notice: Dict[str, Any],
            *,
            ttl: float = 5.0,
    ) -> bool:
        """原子认领 MP 通知；短时间内完全相同的后续广播返回 False。"""
        fingerprint = self._incoming_notification_fingerprint(notice)
        if not self._claim_shared_notification(
                "incoming",
                fingerprint,
                ttl=ttl,
        ):
            return False
        now = time.monotonic()
        # MoviePilot 热更新插件时可能保留旧运行实例，只替换类方法。新增的
        # 实例属性不能假定已经由 __init__ 创建，否则更新后第一个通知会因
        # AttributeError 在事件入口被吞掉，页面和渠道都看不到记录。
        incoming_lock = getattr(self, "_notification_incoming_lock", None)
        if incoming_lock is None:
            incoming_lock = (
                getattr(self, "_notification_recent_lock", None)
                or threading.RLock()
            )
            self._notification_incoming_lock = incoming_lock
        with incoming_lock:
            incoming = getattr(self, "_notification_incoming", None)
            if not isinstance(incoming, dict):
                incoming = {}
            incoming = {
                key: deadline
                for key, deadline in incoming.items()
                if deadline > now
            }
            if incoming.get(fingerprint, 0) > now:
                self._notification_incoming = incoming
                return False
            incoming[fingerprint] = now + max(ttl, 0.1)
            self._notification_incoming = incoming
            return True

    def _remember_transfer_notice_context(
            self, data: Any, scene: str, event_kind: str = "",
    ) -> Dict[str, Any]:
        """短暂保留结构化整理事件，补齐随后 NoticeMessage 缺失的路径。"""
        fileitem = self._event_get(data, "fileitem")
        meta = self._event_get(data, "meta")
        transferinfo = self._event_get(data, "transferinfo")
        mediainfo = self._event_get(data, "mediainfo")
        target_item = self._event_get(transferinfo, "target_item")
        source_path = str(self._event_get(fileitem, "path") or "")
        target_path = str(self._event_get(target_item, "path") or "")
        title = str(
            self._event_get(mediainfo, "title_year")
            or self._event_get(mediainfo, "title")
            or Path(source_path).name
            or "未命名媒体"
        )
        context = {
            "scene": scene,
            "title": title,
            "source_path": source_path,
            "target_path": target_path,
            "reason": str(self._event_get(transferinfo, "message") or ""),
            "season_episode": str(
                self._event_get(meta, "season_episode")
                or self._event_get(meta, "season")
                or ""
            ),
            "image": str(
                (
                    mediainfo.get_message_image()
                    if callable(getattr(mediainfo, "get_message_image", None))
                    else ""
                )
                or ""
            ),
            "history_id": self._event_get(data, "transfer_history_id"),
            "event_kind": event_kind,
            "created_ts": time.time(),
        }
        with self._notification_recent_lock:
            self._notification_recent[f"{scene}:{time.time_ns()}"] = context
            self._notification_recent = {
                key: value for key, value in self._notification_recent.items()
                if time.time() - self._safe_float(value.get("created_ts"), 0) < 180
            }
        return context

    @staticmethod
    def _notification_token_title_related(left: Any, right: Any) -> bool:
        left_key = TmdbRecognizeEnhancer._normalize_text(left)
        right_key = TmdbRecognizeEnhancer._normalize_text(right)
        return bool(
            left_key and right_key
            and (left_key in right_key or right_key in left_key)
        )

    def _claim_ingest_native_notice(self, scene: str, title: str) -> bool:
        """原生通知原子认领；若兜底已发送则返回 True，阻止迟到重复。"""
        now = time.time()
        with self._notification_recent_lock:
            self._notification_notice_tokens = [
                item for item in self._notification_notice_tokens
                if now - self._safe_float(item.get("created_ts"), 0) < 30
            ]
            self._notification_fallback_tokens = [
                item for item in self._notification_fallback_tokens
                if now - self._safe_float(item.get("created_ts"), 0) < 30
            ]
            matches = [
                (index, item)
                for index, item in enumerate(self._notification_fallback_tokens)
                if item.get("scene") == scene
                and (
                    self._notification_token_title_related(
                        title, item.get("title"),
                    )
                    or now - self._safe_float(item.get("created_ts"), 0) <= 12
                )
            ]
            if matches:
                self._notification_fallback_tokens.pop(matches[-1][0])
                return True
            self._notification_notice_tokens.append({
                "scene": scene,
                "title": str(title or ""),
                "created_ts": now,
            })
            return False

    def _claim_ingest_fallback(
            self,
            scene: str,
            title: str,
            event_created_ts: float,
    ) -> bool:
        """兜底原子认领；若原生通知已到则返回 True，否则登记兜底发送。"""
        now = time.time()
        with self._notification_recent_lock:
            self._notification_notice_tokens = [
                item for item in self._notification_notice_tokens
                if now - self._safe_float(item.get("created_ts"), 0) < 30
            ]
            self._notification_fallback_tokens = [
                item for item in self._notification_fallback_tokens
                if now - self._safe_float(item.get("created_ts"), 0) < 30
            ]
            candidates = [
                (index, item)
                for index, item in enumerate(self._notification_notice_tokens)
                if item.get("scene") == scene
                and abs(
                    self._safe_float(item.get("created_ts"), 0)
                    - event_created_ts
                ) <= 8
            ]
            related = [
                (index, item)
                for index, item in candidates
                if self._notification_token_title_related(
                    title, item.get("title"),
                )
            ]
            selected = related[-1:] or candidates[-1:]
            if selected:
                self._notification_notice_tokens.pop(selected[0][0])
                return True
            self._notification_fallback_tokens.append({
                "scene": scene,
                "title": str(title or ""),
                "created_ts": now,
            })
            return False

    def _send_transfer_event_notification_fallback(
            self,
            context: Dict[str, Any],
    ) -> None:
        """MP 未产生失败 NoticeMessage 时，以整理事实事件兜底发送一次。

        TransferComplete 是逐文件事件，而 MP 的入库成功通知是在整批任务完成后
        才渲染。这里不能用逐文件事件兜底成功通知，否则多文件任务会提前发出
        “媒体文件已整理完成”，还会抢先于 MP 的完整 Jinja2 入库模板。
        """
        scene = str(context.get("scene") or "")
        if scene != "failure":
            return
        if not self._notification_active():
            return
        if str(self._config.get("notification_mode") or "observe") not in (
                "parallel", "takeover",
        ):
            return
        if not self._config.get("notification_plugin_enabled"):
            return
        if scene == "success" and not self._config.get("notification_success_enabled"):
            return
        if scene == "failure" and not self._config.get("notification_failure_enabled"):
            return
        if self._claim_ingest_fallback(
                scene,
                str(context.get("title") or ""),
                self._safe_float(context.get("created_ts"), time.time()),
        ):
            return

        title = " ".join(
            value for value in (
                str(context.get("title") or "").strip(),
                str(context.get("season_episode") or "").strip(),
            )
            if value
        ) or "未命名媒体"
        title = f"{title} 入库失败！"
        text = f"原因：{context.get('reason') or '未知'}"
        notice_type = "手动处理"
        self._handle_notice_message(
            SimpleNamespace(event_data={
                "source": "MoviePilot",
                "type": notice_type,
                "title": title,
                "text": text,
                "image": str(context.get("image") or ""),
            }),
            remember_token=False,
        )

    def _schedule_transfer_event_notification_fallback(
            self,
            context: Dict[str, Any],
    ) -> None:
        """等待 MP 原生渲染通知；缺席时再使用结构化事件，避免重复发送。"""
        if not context or not self._notification_active():
            return
        timer = threading.Timer(
            6.0,
            self._send_transfer_event_notification_fallback,
            args=(deepcopy(context),),
        )
        timer.daemon = True
        timer.start()

    def _recent_transfer_context(
            self, scene: str, notice_title: str = "",
    ) -> Dict[str, Any]:
        with self._notification_recent_lock:
            matches = [
                value for value in self._notification_recent.values()
                if value.get("scene") == scene
                and time.time() - self._safe_float(value.get("created_ts"), 0) < 180
            ]
        if not matches:
            return {}
        title_key = self._normalize_text(notice_title)
        if title_key:
            correlated = [
                value for value in matches
                if (
                    self._normalize_text(value.get("title")) in title_key
                    or title_key in self._normalize_text(value.get("title"))
                )
            ]
            if correlated:
                matches = correlated
        return max(matches, key=lambda value: value.get("created_ts") or 0)

    @staticmethod
    def _render_ingest_notification_template(
            template_text: Any,
            template_context: Dict[str, Any],
            fallback: str,
            *,
            allow_empty: bool = False,
    ) -> str:
        """渲染用户通知模板；语法错误时保留 MP 已渲染的原通知。"""
        source = str(template_text or "")
        if not source:
            return "" if allow_empty else fallback
        try:
            rendered = Template(source).render(**template_context).strip()
            return rendered if rendered or allow_empty else fallback
        except Exception as err:  # noqa: BLE001 - 模板错误不能吞掉入库通知。
            logger.warning(f"[媒体整理增强] 入库通知 Jinja2 模板渲染失败：{err}")
            return fallback

    def _handle_generic_notification(
            self,
            *,
            notice: Dict[str, Any],
            type_key: str,
            mode: str,
    ) -> None:
        """按完整通知类型路由转发非整理消息，并留下可审计记录。"""
        routes = normalize_notification_routes(
            self._config.get("notification_type_routes")
        )
        route = routes.get(type_key) or routes["other"]
        type_spec = next(
            (item for item in NOTIFICATION_TYPES if item["key"] == type_key),
            NOTIFICATION_TYPES[-1],
        )
        policy = str(route.get("policy") or "notify")
        title = str(notice.get("title") or type_spec["label"])
        original_text = str(notice.get("text") or "")
        template_context = {
            "original_title": title,
            "original_text": original_text,
            "title": title,
            "text": original_text,
            "scene": "other",
            "notification_type": type_key,
            "notification_type_label": type_spec["label"],
            "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        content_key = notification_content_key(notice.get("ctype"))
        content_template = normalize_notification_content_templates(
            self._config.get("notification_content_templates")
        ).get(content_key, {})
        title_template = (
            content_template.get("title_template")
            or
            route.get("title_template")
            or self._config.get("notification_generic_title_template")
        )
        text_template = (
            content_template.get("text_template")
            or
            route.get("text_template")
            or self._config.get("notification_generic_text_template")
        )
        enhanced_title = self._render_ingest_notification_template(
            title_template, template_context, title,
        )
        enhanced_text = self._render_ingest_notification_template(
            text_template, template_context, original_text,
        )
        action = "observed"
        delivery: Dict[str, Any] = {}
        target = self._notification_type_target(type_key)
        if policy == "silent":
            action = "suppressed"
        elif (
                policy == "notify"
                and mode in ("parallel", "takeover")
                and self._config.get("notification_plugin_enabled")
        ):
            delivery = self._send_enhanced_notification(
                title=enhanced_title,
                text=enhanced_text,
                source_notice=notice,
                **(
                    {"channel": target[0], "service": target[1]}
                    if target else {}
                ),
            )
            action = (
                "delivered" if delivery.get("success") else "delivery_failed"
            ) if delivery.get("direct") else "notified"
        self._append_notification_record(build_record(
            scene="other",
            title=title,
            text=enhanced_text,
            policy=policy,
            action=action,
            source=str(notice.get("source") or "MoviePilot"),
            details={
                "notification_type": type_key,
                "notification_type_label": type_spec["label"],
                "notification_service": (
                    target[1] if target else ""
                ),
                "message_id": delivery.get("message_id"),
                "chat_id": delivery.get("chat_id"),
                "delivery_error": delivery.get("error"),
            },
        ))

    def _handle_notice_message(
            self,
            event: Event,
            *,
            remember_token: bool = True,
    ) -> None:
        if not self._notification_active() or not event or not event.event_data:
            return
        notice = extract_notice(event.event_data)
        if self._is_outgoing_notification(notice):
            return
        if not self._claim_incoming_notification(notice):
            logger.info(
                "[媒体整理增强] 忽略 MoviePilot 接收目标拆分产生的重复通知："
                f"{notice.get('title') or '无标题'}"
            )
            return
        scene = notification_kind(notice)
        type_key = notification_type_key(
            notice.get("mtype") or notice.get("type")
        )
        if scene in ("success", "failure") and remember_token:
            if self._claim_ingest_native_notice(
                    scene, str(notice.get("title") or ""),
            ):
                logger.info(
                    f"[媒体整理增强] 已由整理事件兜底发送，忽略迟到的"
                    f"{'成功' if scene == 'success' else '失败'}原生通知"
                )
                return
        mode = str(self._config.get("notification_mode") or "observe")
        if scene == "other":
            if (
                    type_key == "manual"
                    and not self._config.get("notification_passthrough_manual")
            ):
                return
            self._handle_generic_notification(
                notice=notice, type_key=type_key, mode=mode,
            )
            return
        if scene == "success" and not self._config.get("notification_success_enabled"):
            return
        if scene == "failure" and not self._config.get("notification_failure_enabled"):
            return
        route_policy = normalize_notification_routes(
            self._config.get("notification_type_routes")
        ).get(type_key, {}).get("policy", "notify")
        title = str(notice.get("title") or ("入库完成" if scene == "success" else "入库失败"))
        original_text = str(notice.get("text") or "")
        context = self._recent_transfer_context(scene, title)
        category: Dict[str, Any] = {}
        policy = "notify"
        if scene == "failure":
            reason = context.get("reason") or extract_reason(original_text)
            category = classify_failure(
                reason,
                event_kind=str(context.get("event_kind") or ""),
                title=title,
            )
            policy = normalize_failure_policies(
                self._config.get("notification_failure_policies")
            ).get(category["key"], "notify")
        else:
            reason = ""
        if route_policy in ("record", "silent"):
            policy = route_policy
        template_context = {
            "original_title": title,
            "original_text": original_text,
            # title/text 是便于书写的短别名，均指 MP 原生模板已经渲染后的结果。
            "title": title,
            "text": original_text,
            "scene": scene,
            "category": str(category.get("key") or ""),
            "category_label": str(category.get("label") or ""),
            "reason": str(reason or ""),
            "source_path": str(context.get("source_path") or ""),
            "target_path": str(context.get("target_path") or ""),
            "history_id": context.get("history_id") or "",
            "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        template_prefix = (
            "notification_failure" if scene == "failure"
            else "notification_success"
        )
        content_template = {}
        if scene == "success":
            content_template = normalize_notification_content_templates(
                self._config.get("notification_content_templates")
            ).get("organizeSuccess", {})
        enhanced_title = self._render_ingest_notification_template(
            content_template.get("title_template")
            or self._config.get(f"{template_prefix}_title_template"),
            template_context,
            title,
        )
        enhanced_text = self._render_ingest_notification_template(
            content_template.get("text_template")
            or self._config.get(f"{template_prefix}_text_template"),
            template_context,
            original_text,
        )
        action = "observed"
        if scene == "failure" and policy == "silent":
            action = "suppressed"
        elif scene == "success" and policy == "silent":
            action = "suppressed"
        elif scene == "failure" and policy == "digest":
            action = "digest_pending"
        elif (
                policy == "notify"
                and
                mode in ("parallel", "takeover")
                and self._config.get("notification_plugin_enabled")
        ):
            delivery = self._send_enhanced_notification(
                title=enhanced_title,
                text=enhanced_text,
                source_notice=notice,
                **self._notification_target_kwargs(scene),
            )
            if delivery.get("direct"):
                action = (
                    "delivered"
                    if delivery.get("success")
                    else "delivery_failed"
                )
            else:
                action = "notified"
            context = {
                **context,
                "notification_service": (
                    self._config.get("notification_failure_service")
                    if scene == "failure"
                    else self._config.get("notification_success_service")
                ),
                "message_id": delivery.get("message_id"),
                "chat_id": delivery.get("chat_id"),
                "delivery_error": delivery.get("error"),
            }
        self._append_notification_record(build_record(
            scene=scene,
            title=title,
            text=enhanced_text,
            category=category,
            policy=policy,
            action=action,
            source=str(notice.get("source") or "MoviePilot"),
            details=context,
        ))

    @eventmanager.register(getattr(EventType, "TransferComplete", "transfer.complete"))
    def on_transfer_complete(self, event: Event) -> None:
        """整理完成后分发 Emby 剧集组联动与神医媒体信息推送任务。"""
        if not event or not event.event_data:
            return
        if self._notification_active():
            self._remember_transfer_notice_context(
                event.event_data, "success",
            )
        try:
            self._maybe_enqueue_strm_sync(event.event_data)
        except Exception as err:
            logger.error(f"[媒体整理增强] 神医媒体信息推送排队失败：{err}")
        self._on_transfer_complete_episode_group(event)

    @eventmanager.register(getattr(EventType, "TransferFailed", "transfer.failed"))
    def on_transfer_failed(self, event: Event) -> None:
        """缓存媒体文件整理失败上下文，实际通知由 NoticeMessage 统一决策。"""
        if self._notification_active() and event and event.event_data:
            context = self._remember_transfer_notice_context(
                event.event_data, "failure", "transfer.failed",
            )
            self._schedule_transfer_event_notification_fallback(context)

    @eventmanager.register(getattr(
        EventType, "SubtitleTransferFailed", "transfer.subtitle.failed",
    ))
    def on_subtitle_transfer_failed(self, event: Event) -> None:
        if self._notification_active() and event and event.event_data:
            context = self._remember_transfer_notice_context(
                event.event_data, "failure", "transfer.subtitle.failed",
            )
            self._schedule_transfer_event_notification_fallback(context)

    @eventmanager.register(getattr(
        EventType, "AudioTransferFailed", "transfer.audio.failed",
    ))
    def on_audio_transfer_failed(self, event: Event) -> None:
        if self._notification_active() and event and event.event_data:
            context = self._remember_transfer_notice_context(
                event.event_data, "failure", "transfer.audio.failed",
            )
            self._schedule_transfer_event_notification_fallback(context)

    @eventmanager.register(getattr(EventType, "NoticeMessage", "notice.message"))
    def on_notice_message(self, event: Event) -> None:
        """观察 MP 最终渲染后的通知，并按策略记录或重新发送。"""
        try:
            self._handle_notice_message(event)
        except Exception as err:  # noqa: BLE001 - 通知增强不得影响原整理链
            logger.error(f"[媒体整理增强] 入库通知处理失败：{err}")

    @eventmanager.register(getattr(EventType, "MessageAction", "message.action"))
    def on_notification_message_action(self, event: Event) -> None:
        """处理季度候选总览、分页导航、当页及整批审批动作。"""
        if not event or not isinstance(event.event_data, dict):
            return
        data = event.event_data
        if str(data.get("plugin_id") or "") != self.__class__.__name__:
            return
        content = str(data.get("text") or "")
        if content.startswith("plugin_input|"):
            self._handle_notification_candidate_tmdb_input(data)
            return
        if content.startswith("plugin_input_cancel|") or content.startswith("plugin_input_expired|"):
            return
        group_match = re.fullmatch(
            r"nc:s:([0-9a-f]{12}):(\d{1,3}):(\d{1,2})",
            content,
        )
        group_index: Optional[int] = None
        if group_match:
            batch_id, page_text, group_index_text = group_match.groups()
            action = "s"
            page = self._safe_int(page_text, 0)
            group_index = self._safe_int(group_index_text, -1)
            match = None
        else:
            match = re.fullmatch(
                r"nc:([opdvgimMDGIrR]):([0-9a-f]{12}):(\d{1,3})",
                content,
            )
        if match:
            action, batch_id, page_text = match.groups()
            page = self._safe_int(page_text, 0)
        elif not group_match:
            page = 0
        compact_legacy = re.fullmatch(r"nc:([ari]):([0-9a-f]{12})", content)
        legacy_match = re.fullmatch(
            r"notify-candidates:(approve|retry|ignore):([0-9a-f]{12})",
            content,
        )
        if not match and not group_match:
            old_match = compact_legacy or legacy_match
            if not old_match:
                return
            old_action, batch_id = old_match.groups()
            action = {
                "a": "A",
                "approve": "A",
                "r": "R",
                "retry": "R",
                "i": "I",
                "ignore": "I",
            }.get(old_action, "")
            if not action:
                return

        approvals = self._read_notification_approvals()
        batch = (approvals.get("batches") or {}).get(batch_id) or {}
        quarter = str(batch.get("quarter") or "")
        if not quarter:
            return

        # 兼容 0.8.9—0.8.13 已经保存但未携带详情快照的审批批次。
        if not batch.get("items"):
            snapshot = self._notification_candidate_snapshot(quarter)
            item_index = {
                str(item.get("id")): item
                for item in [*snapshot["ready"], *snapshot["failed"]]
            }
            batch["items"] = [
                item_index[item_id]
                for item_id in batch.get("item_ids") or []
                if item_id in item_index
            ]
            batch.setdefault("handled_ids", [])
        if not batch.get("items"):
            return

        target = self._notification_candidate_target()
        channel = data.get("channel") or (target[0] if target else None)
        service = str(data.get("source") or (target[1] if target else ""))

        if action == "v":
            view = self._render_notification_candidate_groups(
                batch_id=batch_id,
                batch=batch,
                page=page,
            )
            batches = (
                approvals.get("batches")
                if isinstance(approvals.get("batches"), dict)
                else {}
            )
            batches[batch_id] = batch
            approvals["batches"] = batches
            self._save_notification_approvals(approvals)
            delivery = self._send_candidate_instance_notification(
                title=view["title"],
                text=view["text"],
                buttons=view["buttons"],
                image=view.get("image", ""),
                channel=channel,
                service=service,
                original_message_id=data.get("original_message_id"),
                original_media_message_id=batch.get("media_message_id"),
                original_photo_unique_id=batch.get("rich_photo_unique_id", ""),
                original_image_digest=batch.get("rich_image_digest", ""),
                original_chat_id=data.get("original_chat_id"),
                rich_markdown=view.get("rich_markdown", ""),
                rich_text=view.get("rich_text", ""),
                rich_blocks=view.get("rich_blocks"),
            )
            if delivery.get("success"):
                self._remember_notification_candidate_media_message(
                    batch_id=batch_id,
                    batch=batch,
                    delivery=delivery,
                )
            return

        if action in ("m", "M"):
            prompted = self._prompt_notification_candidate_tmdb(
                event_data=data,
                batch_id=batch_id,
                batch=batch,
                page=page,
                preference="group_preferred" if action == "M" else "default",
                channel=channel,
                service=service,
            )
            if not prompted:
                view = self._render_notification_candidate_page(
                    batch_id=batch_id,
                    batch=batch,
                    page=page,
                    notice="当前通知渠道无法接收文本输入，请到插件季度看板补充 TMDBID。",
                )
                self._send_candidate_instance_notification(
                    title=view["title"],
                    text=view["text"],
                    buttons=view["buttons"],
                    image="",
                    channel=channel,
                    service=service,
                    original_message_id=data.get("original_message_id"),
                    original_media_message_id=batch.get("media_message_id"),
                    original_photo_unique_id=batch.get("rich_photo_unique_id", ""),
                    original_image_digest=batch.get("rich_image_digest", ""),
                    original_chat_id=data.get("original_chat_id"),
                    rich_markdown=view.get("rich_markdown", ""),
                    rich_text=view.get("rich_text", ""),
                    rich_blocks=view.get("rich_blocks"),
                )
            return

        if action in ("o", "p"):
            view = (
                self._render_notification_candidate_summary(
                    batch_id=batch_id, batch=batch,
                )
                if action == "o"
                else self._render_notification_candidate_page(
                    batch_id=batch_id, batch=batch, page=page,
                )
            )
            delivery = self._send_candidate_instance_notification(
                title=view["title"],
                text=view["text"],
                buttons=view["buttons"],
                # 详情使用公网单张海报；返回总览时直接上传容器内拼图文件，
                # 避免 Telegram 无法访问 127.0.0.1 导致仅文字更新。
                image=(
                    view["image"]
                    if action == "p"
                    else self._notification_collage_edit_source(
                        batch_id=batch_id,
                        batch=batch,
                    )
                ),
                channel=channel,
                service=service,
                original_message_id=data.get("original_message_id"),
                original_media_message_id=batch.get("media_message_id"),
                original_photo_unique_id=batch.get("rich_photo_unique_id", ""),
                original_image_digest=batch.get("rich_image_digest", ""),
                original_chat_id=data.get("original_chat_id"),
                rich_markdown=view.get("rich_markdown", ""),
                rich_text=view.get("rich_text", ""),
                rich_blocks=view.get("rich_blocks"),
            )
            if delivery.get("success"):
                self._remember_notification_candidate_media_message(
                    batch_id=batch_id,
                    batch=batch,
                    delivery=delivery,
                )
            return

        pending = self._notification_batch_pending_items(batch)
        selected_group_id = ""
        if action == "s":
            page_view = self._render_notification_candidate_groups(
                batch_id=batch_id, batch=batch, page=page,
            )
            groups = page_view.get("groups") or []
            if (
                    group_index is None
                    or group_index < 0
                    or group_index >= len(groups)
            ):
                return
            selected_group_id = str(
                groups[group_index].get("id") or ""
            ).strip()
        elif action in ("d", "g", "i", "r"):
            page_view = self._render_notification_candidate_page(
                batch_id=batch_id, batch=batch, page=page,
            )
        else:
            page_view = {}
        if action in ("d", "g", "i", "r", "s"):
            item_ids = page_view.get("page_item_ids") or []
            page = self._safe_int(page_view.get("page"), 0)
        else:
            item_ids = [
                str(item.get("id")) for item in pending if item.get("id")
            ]
        if not item_ids:
            view = self._render_notification_candidate_summary(
                batch_id=batch_id, batch=batch, notice="本页没有待处理候选。",
            )
            self._send_candidate_instance_notification(
                title=view["title"],
                text=view["text"],
                buttons=view["buttons"],
                image="",
                channel=channel,
                service=service,
                original_message_id=data.get("original_message_id"),
                original_media_message_id=batch.get("media_message_id"),
                original_photo_unique_id=batch.get("rich_photo_unique_id", ""),
                original_image_digest=batch.get("rich_image_digest", ""),
                original_chat_id=data.get("original_chat_id"),
                rich_markdown=view.get("rich_markdown", ""),
                rich_text=view.get("rich_text", ""),
                rich_blocks=view.get("rich_blocks"),
            )
            return

        if action in ("i", "I"):
            api_action = "ignore"
        elif action in ("r", "R"):
            api_action = "retry"
        elif action in ("d", "D"):
            api_action = "add_default"
        elif action in ("g", "G", "s"):
            api_action = "add_group"
        else:  # 旧版“按推荐加入”
            preference = str(batch.get("preference") or "group_preferred")
            api_action = (
                "add_group" if preference == "group_preferred" else "add_default"
            )
        api_payload = {
            "quarter": quarter,
            "item_ids": item_ids,
            "action": api_action,
        }
        if selected_group_id and item_ids:
            api_payload["episode_group_overrides"] = {
                item_ids[0]: selected_group_id,
            }
        manual_tmdb_overrides = (
            batch.get("tmdb_id_overrides")
            if isinstance(batch.get("tmdb_id_overrides"), dict)
            else {}
        )
        selected_tmdb_overrides = {
            item_id: self._safe_int(manual_tmdb_overrides.get(item_id), 0)
            for item_id in item_ids
            if self._safe_int(manual_tmdb_overrides.get(item_id), 0)
        }
        if selected_tmdb_overrides:
            api_payload["tmdb_id_overrides"] = selected_tmdb_overrides
        result = self.action_notification_candidates_api(api_payload)
        result_data = getattr(result, "data", None)
        result_data = result_data if isinstance(result_data, dict) else {}
        succeeded_ids = set(item_ids)
        if api_action in ("add_default", "add_group"):
            failed_ids = {
                str(item.get("id"))
                for item in result_data.get("operation_failures") or []
                if item.get("id")
            }
            succeeded_ids -= failed_ids
        if not bool(getattr(result, "success", False)):
            succeeded_ids.clear()
        batch["handled_ids"] = list(dict.fromkeys([
            *(batch.get("handled_ids") or []),
            *succeeded_ids,
        ]))
        # action_notification_candidates_api 可能刚刚写入 ignored/ignored_keys。
        # 必须重新读取后再保存批次进度，不能用回调开始时的旧快照覆盖忽略状态。
        approvals = self._read_notification_approvals()
        batches = (
            approvals.get("batches")
            if isinstance(approvals.get("batches"), dict)
            else {}
        )
        batches[batch_id] = batch
        approvals["batches"] = batches
        self._save_notification_approvals(approvals)

        message = str(getattr(result, "message", "") or "审批动作已处理")
        if self._notification_batch_pending_items(batch):
            view = self._render_notification_candidate_page(
                batch_id=batch_id,
                batch=batch,
                page=page,
                notice=message,
            )
        else:
            view = self._render_notification_candidate_summary(
                batch_id=batch_id,
                batch=batch,
                notice=message,
            )
        delivery = self._send_candidate_instance_notification(
            title=view["title"],
            text=view["text"],
            buttons=view["buttons"],
            image=(
                view["image"]
                if self._notification_batch_pending_items(batch)
                else ""
            ),
            channel=channel,
            service=service,
            original_message_id=data.get("original_message_id"),
            original_media_message_id=batch.get("media_message_id"),
            original_photo_unique_id=batch.get("rich_photo_unique_id", ""),
            original_image_digest=batch.get("rich_image_digest", ""),
            original_chat_id=data.get("original_chat_id"),
            rich_markdown=view.get("rich_markdown", ""),
            rich_text=view.get("rich_text", ""),
            rich_blocks=view.get("rich_blocks"),
        )
        if not delivery.get("success"):
            logger.warning(
                f"[媒体整理增强] 候选审批已执行，但 Telegram 原消息更新失败："
                f"批次={batch_id}，动作={api_action}"
            )
        else:
            self._remember_notification_candidate_media_message(
                batch_id=batch_id,
                batch=batch,
                delivery=delivery,
            )

    def _maybe_enqueue_strm_sync(self, data: Any) -> None:
        """为每个整理完成的视频文件排队媒体信息推送（电影与剧集都适用）。"""
        if not self._strm_sync_active():
            return
        transferinfo = self._event_get(data, "transferinfo")
        mediainfo = self._event_get(data, "mediainfo")
        target_item = self._event_get(transferinfo, "target_item")
        target_path = str(self._event_get(target_item, "path") or "").strip()
        if not target_path:
            return
        # 优先复用命名阶段的源文件扫描缓存；移动整理完成后源路径可能已不存在。
        fileitem = self._event_get(data, "fileitem")
        source_path = str(self._event_get(fileitem, "path") or "").strip()
        probe_result = self._media_probe.cached_result(source_path)
        # 神医需要完整的 ffprobe streams/format/chapters 原始结果。这里不读取
        # media_probe_fields：那些选项只决定哪些值进入 MP/Jinja 命名上下文，
        # 不能裁剪或关闭入库联动所需的媒体信息采集。
        if not probe_result or not isinstance(probe_result.get("raw"), dict):
            candidates = [item for item in (source_path, target_path) if item]
            readable = next((item for item in candidates if Path(item).is_file()), "")
            if not readable:
                if self._config.get("debug"):
                    logger.info(
                        f"[媒体整理增强] 神医推送跳过：没有预扫缓存，且源与目标路径均不可直读（{target_path}）"
                    )
                return
            probe_result = self._media_probe.probe(
                readable,
                timeout=self._safe_int(self._config.get("media_probe_timeout"), 12),
                executable_path=self._config.get("media_probe_executable"),
                iso_executable_path=self._iso_executable(),
            )
        title = str(self._event_get(mediainfo, "title") or "").strip()
        year = str(self._event_get(mediainfo, "year") or "").strip()
        display = f"{title} ({year})" if title and year else title
        self._enqueue_strm_sync_job(probe_result, target_path, display)

    def _on_transfer_complete_episode_group(self, event: Event) -> None:
        """仅为本次实际采用剧集组归一化的整理结果建立 Emby 联动任务。"""
        if not self._emby_sync_active() or not event or not event.event_data:
            return
        data = event.event_data
        meta = self._event_get(data, "meta")
        mediainfo = self._event_get(data, "mediainfo")
        transferinfo = self._event_get(data, "transferinfo")
        group_id = str(
            self._event_get(meta, "episode_group")
            or self._event_get(mediainfo, "episode_group")
            or ""
        ).strip()
        tmdb_id = self._safe_int(
            self._event_get(mediainfo, "tmdb_id")
            or self._event_get(mediainfo, "tmdbid"),
            0,
        )
        if not group_id or not tmdb_id:
            return
        media_type = self._normalize_media_type(self._event_get(mediainfo, "type"))
        if media_type != MediaType.TV:
            return
        rule = next((
            item for item in self._read_episode_rules()
            if item.get("enabled", True)
            and self._safe_int(item.get("tmdb_id"), 0) == tmdb_id
            and item.get("target_type") == "group"
            and str(item.get("episode_group_id") or "") == group_id
        ), None)
        if not rule:
            logger.warning(
                f"[媒体整理增强] 已收到剧集组 {group_id}，但 TMDB {tmdb_id} 的维护规则不一致，"
                "不会写入 Emby"
            )
            return
        target_item = self._event_get(transferinfo, "target_item")
        target_diritem = self._event_get(transferinfo, "target_diritem")
        target_path = str(self._event_get(target_item, "path") or "").strip()
        series_path = str(self._event_get(target_diritem, "path") or target_path).strip()
        if not target_path:
            logger.warning(f"[媒体整理增强] TMDB {tmdb_id} 整理完成事件缺少目标路径，无法安全联动 Emby")
            return
        job_key = f"{tmdb_id}|{group_id}|{EmbyEpisodeGroupSynchronizer.normalize_path(series_path).casefold()}"
        job_id = hashlib.sha1(job_key.encode("utf-8", errors="ignore")).hexdigest()[:20]
        now = time.time()
        with self._emby_sync_lock:
            jobs = self._read_emby_sync_jobs()
            existing = next((item for item in jobs if str(item.get("id")) == job_id), None)
            if existing and existing.get("status") == "completed":
                return
            job = existing or {
                "id": job_id,
                "tmdb_id": tmdb_id,
                "episode_group_id": group_id,
                "title": str(self._event_get(mediainfo, "title") or rule.get("title") or f"TMDB {tmdb_id}"),
                "year": str(self._event_get(mediainfo, "year") or ""),
                "series_path": series_path,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "created_ts": now,
                "attempts": 0,
                "server_results": {},
            }
            job.update({
                "target_path": target_path,
                "status": "pending",
                "reason": "等待 Emby 入库扫描",
                "next_attempt_ts": now + int(self._config.get("emby_episode_group_sync_initial_delay_seconds", 15)),
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "history_logged": False,
            })
            jobs = [item for item in jobs if str(item.get("id")) != job_id]
            jobs.insert(0, job)
            self._save_emby_sync_jobs(jobs)
        logger.info(
            f"[媒体整理增强] Emby 剧集组联动已排队：{job['title']}，"
            f"TMDB {tmdb_id}，TmdbEg {group_id}"
        )
        self._emby_sync_wakeup.set()

    def _get_emby_services(self) -> Dict[str, Any]:
        """复用 MoviePilot 媒体服务器配置，不向插件复制地址或 API Key。"""
        if MediaServerHelper is None:
            return {}
        try:
            return MediaServerHelper().get_services(type_filter="emby") or {}
        except Exception as err:
            logger.warning(f"[媒体整理增强] 读取 MoviePilot Emby 配置失败：{err}")
            return {}

    def _emby_sync_active(self) -> bool:
        return bool(
            self.get_state()
            and self._config.get("episode_normalizer_enabled")
            and self._config.get("emby_episode_group_sync_enabled")
            and MediaServerHelper is not None
        )

    def _sync_emby_worker_state(self) -> None:
        if self._emby_sync_active():
            self._start_emby_worker()
        else:
            self._stop_emby_worker()

    def _start_emby_worker(self) -> None:
        if self._emby_sync_thread and self._emby_sync_thread.is_alive():
            self._emby_sync_wakeup.set()
            return
        self._emby_sync_stop = threading.Event()
        self._emby_sync_wakeup = threading.Event()
        self._emby_sync_thread = threading.Thread(
            target=self._emby_sync_worker,
            name="tmdb-enhancer-emby-group-sync",
            daemon=True,
        )
        self._emby_sync_thread.start()

    def _stop_emby_worker(self) -> None:
        self._emby_sync_stop.set()
        self._emby_sync_wakeup.set()
        thread = self._emby_sync_thread
        if thread and thread.is_alive() and thread is not threading.current_thread():
            thread.join(timeout=1.5)
        if not thread or not thread.is_alive():
            self._emby_sync_thread = None

    def _emby_sync_worker(self) -> None:
        """串行处理网络任务，避免整理线程被 Emby 扫描和重试阻塞。"""
        while not self._emby_sync_stop.is_set():
            job = self._next_emby_sync_job()
            if not job:
                self._emby_sync_wakeup.wait(timeout=2.0)
                self._emby_sync_wakeup.clear()
                continue
            try:
                self._process_emby_sync_job(job)
            except Exception as err:
                logger.error(f"[媒体整理增强] Emby 剧集组联动任务异常：{err}")
                self._mark_emby_job_error(str(job.get("id") or ""), str(err))

    def _next_emby_sync_job(self) -> Optional[Dict[str, Any]]:
        now = time.time()
        with self._emby_sync_lock:
            jobs = self._read_emby_sync_jobs()
            return next((
                deepcopy(item) for item in jobs
                if item.get("status") == "pending"
                and float(item.get("next_attempt_ts") or 0) <= now
            ), None)

    def _process_emby_sync_job(self, job: Dict[str, Any]) -> None:
        job_id = str(job.get("id") or "")
        with self._emby_sync_lock:
            jobs = self._read_emby_sync_jobs()
            current = next((item for item in jobs if str(item.get("id")) == job_id), None)
            if not current or current.get("status") != "pending":
                return
            current["status"] = "running"
            current["attempts"] = self._safe_int(current.get("attempts"), 0) + 1
            current["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self._save_emby_sync_jobs(jobs)
            job = deepcopy(current)

        outcome = self._emby_sync.reconcile(
            job=job,
            config=self._emby_sync_runtime_config(),
            previous=job.get("server_results") or {},
        )
        now = time.time()
        max_wait = int(self._config.get("emby_episode_group_sync_max_wait_minutes", 15)) * 60
        elapsed = max(0.0, now - float(job.get("created_ts") or now))
        results = outcome.get("results") or {}
        retryable = bool(outcome.get("retryable"))
        if retryable and elapsed < max_wait:
            status = "pending"
            reason = outcome.get("reason") or "等待 Emby 扫描或连接恢复"
            next_attempt = now + int(self._config.get("emby_episode_group_sync_retry_seconds", 30))
        elif retryable:
            status = "timeout"
            reason = f"等待 {int(max_wait / 60)} 分钟后仍未完成，请检查入库扫描、路径映射和服务器连接"
            next_attempt = 0
        else:
            statuses = {str(value.get("status") or "") for value in results.values()}
            if statuses and statuses <= EmbyEpisodeGroupSynchronizer.SUCCESS_STATUSES:
                status = "completed"
                reason = "所有目标 Emby 均已配置正确剧集组"
            else:
                status = "attention"
                reason = "存在冲突、定位歧义或服务器不支持，请检查任务详情"
            next_attempt = 0

        log_record = None
        with self._emby_sync_lock:
            jobs = self._read_emby_sync_jobs()
            current = next((item for item in jobs if str(item.get("id")) == job_id), None)
            if not current:
                return
            current.update({
                "status": status,
                "reason": reason,
                "server_results": results,
                "next_attempt_ts": next_attempt,
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })
            if status in {"completed", "attention", "timeout"} and not current.get("history_logged"):
                current["history_logged"] = True
                log_record = deepcopy(current)
            self._save_emby_sync_jobs(jobs)
        if log_record:
            self._append_module_history(
                module="Emby 剧集组联动",
                title=str(log_record.get("title") or f"TMDB {log_record.get('tmdb_id')}"),
                reason=reason,
                stages=[
                    f"TMDB {log_record.get('tmdb_id')}",
                    f"TmdbEg {log_record.get('episode_group_id')}",
                    *[f"{name}：{value.get('status')}" for name, value in results.items()],
                ],
                accepted=status == "completed",
            )

    def _mark_emby_job_error(self, job_id: str, reason: str) -> None:
        with self._emby_sync_lock:
            jobs = self._read_emby_sync_jobs()
            current = next((item for item in jobs if str(item.get("id")) == job_id), None)
            if current:
                current.update({
                    "status": "pending",
                    "reason": reason,
                    "next_attempt_ts": time.time() + int(self._config.get("emby_episode_group_sync_retry_seconds", 30)),
                    "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                })
                self._save_emby_sync_jobs(jobs)

    def _read_emby_sync_jobs(self) -> List[Dict[str, Any]]:
        value = self.get_data(self.DATA_KEY_EMBY_EPISODE_GROUP_JOBS) or []
        return value if isinstance(value, list) else []

    def _recover_emby_sync_jobs(self) -> None:
        """插件或容器在请求中退出时，把遗留 running 任务恢复为可重试状态。"""
        with self._emby_sync_lock:
            jobs = self._read_emby_sync_jobs()
            changed = False
            for job in jobs:
                if job.get("status") != "running":
                    continue
                job.update({
                    "status": "pending",
                    "reason": "上次处理被插件重载或容器重启中断，已恢复排队",
                    "next_attempt_ts": time.time(),
                    "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                })
                changed = True
            if changed:
                self._save_emby_sync_jobs(jobs)

    def _save_emby_sync_jobs(self, jobs: List[Dict[str, Any]]) -> None:
        active = [item for item in jobs if item.get("status") in {"pending", "running"}]
        finished = [item for item in jobs if item.get("status") not in {"pending", "running"}]
        self.save_data(self.DATA_KEY_EMBY_EPISODE_GROUP_JOBS, [*active, *finished[:80]])

    def _emby_sync_runtime_config(self) -> Dict[str, Any]:
        return {
            "servers": list(self._config.get("emby_episode_group_sync_servers") or []),
            "path_mappings": deepcopy(self._config.get("emby_episode_group_sync_path_mappings") or []),
            "conflict_policy": str(self._config.get("emby_episode_group_sync_conflict_policy") or "skip"),
            "refresh_metadata": bool(self._config.get("emby_episode_group_sync_refresh_metadata", True)),
        }

    def _emby_sync_status_data(self, include_jobs: bool) -> Dict[str, Any]:
        data = {
            "available": MediaServerHelper is not None,
            "enabled": bool(self._config.get("emby_episode_group_sync_enabled")),
            "active": self._emby_sync_active(),
            "worker_running": bool(self._emby_sync_thread and self._emby_sync_thread.is_alive()),
            "servers": self._emby_sync.server_catalog(),
            "config": {
                "enabled": bool(self._config.get("emby_episode_group_sync_enabled")),
                "servers": list(self._config.get("emby_episode_group_sync_servers") or []),
                "initial_delay_seconds": int(self._config.get("emby_episode_group_sync_initial_delay_seconds", 15)),
                "retry_seconds": int(self._config.get("emby_episode_group_sync_retry_seconds", 30)),
                "max_wait_minutes": int(self._config.get("emby_episode_group_sync_max_wait_minutes", 15)),
                "path_mappings": deepcopy(self._config.get("emby_episode_group_sync_path_mappings") or []),
                "conflict_policy": str(self._config.get("emby_episode_group_sync_conflict_policy") or "skip"),
                "refresh_metadata": bool(self._config.get("emby_episode_group_sync_refresh_metadata", True)),
            },
            "counts": self._emby_sync_counts(),
        }
        if include_jobs:
            data["jobs"] = self._read_emby_sync_jobs()
        return data

    def _emby_sync_counts(self) -> Dict[str, int]:
        jobs = self._read_emby_sync_jobs()
        return {
            "pending": sum(1 for item in jobs if item.get("status") in {"pending", "running"}),
            "completed": sum(1 for item in jobs if item.get("status") == "completed"),
            "attention": sum(1 for item in jobs if item.get("status") in {"attention", "timeout"}),
        }

    def _emby_sync_module_status(self) -> str:
        if not self.get_state() or not self._config.get("emby_episode_group_sync_enabled"):
            return "已停用"
        if not self._config.get("episode_normalizer_enabled"):
            return "等待启用集数偏移"
        if MediaServerHelper is None:
            return "当前 MP 不支持媒体服务器服务目录"
        if not self._emby_sync.server_catalog():
            return "未配置 Emby"
        return "监听整理入库" if self._emby_sync_thread and self._emby_sync_thread.is_alive() else "工作器未运行"

    # ------------------------------------------------------------------
    # 神医助手（StrmAssistant）Pro 媒体信息推送

    def _strm_sync_module_status(self) -> str:
        if not self.get_state() or not self._config.get("strm_media_info_sync_enabled"):
            return "已停用"
        if not self._config.get("media_probe_enabled"):
            return "等待启用媒体流扫描"
        if MediaServerHelper is None:
            return "当前 MP 不支持媒体服务器服务目录"
        if not self._strm_sync.server_catalog():
            return "未配置 Emby"
        return "监听整理入库" if self._strm_sync_thread and self._strm_sync_thread.is_alive() else "工作器未运行"

    def _strm_sync_active(self) -> bool:
        return bool(
            self.get_state()
            and self._config.get("media_probe_enabled")
            and self._config.get("strm_media_info_sync_enabled")
            and MediaServerHelper is not None
        )

    def _sync_strm_worker_state(self) -> None:
        if self._strm_sync_active():
            self._start_strm_worker()
        else:
            self._stop_strm_worker()

    def _start_strm_worker(self) -> None:
        if self._strm_sync_thread and self._strm_sync_thread.is_alive():
            self._strm_sync_wakeup.set()
            return
        self._strm_sync_stop = threading.Event()
        self._strm_sync_wakeup = threading.Event()
        self._strm_sync_worker_error = ""
        self._strm_sync_thread = threading.Thread(
            target=self._strm_sync_worker,
            name="tmdb-enhancer-strm-media-info-sync",
            daemon=True,
        )
        try:
            self._strm_sync_thread.start()
        except Exception as err:  # noqa: BLE001 - 状态接口需要呈现启动失败原因
            self._strm_sync_worker_error = str(err)
            self._strm_sync_thread = None
            logger.error(f"[媒体整理增强] 神医媒体信息后台工作器启动失败：{err}")

    def _stop_strm_worker(self) -> None:
        self._strm_sync_stop.set()
        self._strm_sync_wakeup.set()
        thread = self._strm_sync_thread
        if thread and thread.is_alive() and thread is not threading.current_thread():
            thread.join(timeout=1.5)
        if not thread or not thread.is_alive():
            self._strm_sync_thread = None

    def _strm_sync_worker(self) -> None:
        """串行推送媒体信息，避免整理线程被 Emby 入库延迟阻塞。"""
        while not self._strm_sync_stop.is_set():
            try:
                job = self._next_strm_sync_job()
            except Exception as err:  # noqa: BLE001 - 数据读取异常不应永久杀死工作器
                self._strm_sync_worker_error = str(err)
                logger.error(f"[媒体整理增强] 神医媒体信息后台工作器读取队列失败：{err}")
                self._strm_sync_wakeup.wait(timeout=2.0)
                self._strm_sync_wakeup.clear()
                continue
            if not job:
                self._strm_sync_wakeup.wait(timeout=2.0)
                self._strm_sync_wakeup.clear()
                continue
            try:
                self._process_strm_sync_job(job)
                self._strm_sync_worker_error = ""
            except Exception as err:
                self._strm_sync_worker_error = str(err)
                logger.error(f"[媒体整理增强] 神医媒体信息推送任务异常：{err}")
                self._mark_strm_job_error(str(job.get("id") or ""), str(err))

    def _next_strm_sync_job(self) -> Optional[Dict[str, Any]]:
        now = time.time()
        with self._strm_sync_lock:
            jobs = self._read_strm_sync_jobs()
            return next((
                deepcopy(item) for item in jobs
                if item.get("status") == "pending"
                and float(item.get("next_attempt_ts") or 0) <= now
            ), None)

    def _process_strm_sync_job(self, job: Dict[str, Any]) -> None:
        job_id = str(job.get("id") or "")
        with self._strm_sync_lock:
            jobs = self._read_strm_sync_jobs()
            current = next((item for item in jobs if str(item.get("id")) == job_id), None)
            if not current or current.get("status") != "pending":
                return
            current["status"] = "running"
            current["attempts"] = self._safe_int(current.get("attempts"), 0) + 1
            current["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self._save_strm_sync_jobs(jobs)
            job = deepcopy(current)

        outcome = self._strm_sync.push(
            job=job,
            config=self._strm_sync_runtime_config(),
            previous=job.get("server_results") or {},
        )
        now = time.time()
        max_wait = int(self._config.get("strm_media_info_sync_max_wait_minutes", 30)) * 60
        elapsed = max(0.0, now - float(job.get("created_ts") or now))
        results = outcome.get("results") or {}
        retryable = bool(outcome.get("retryable"))
        if retryable and elapsed < max_wait:
            status = "pending"
            reason = outcome.get("reason") or "等待 Emby 入库扫描或连接恢复"
            next_attempt = now + int(self._config.get("strm_media_info_sync_retry_seconds", 30))
        elif retryable:
            status = "timeout"
            reason = f"等待 {int(max_wait / 60)} 分钟后仍未完成，请检查入库扫描、路径映射和服务器连接"
            next_attempt = 0
        else:
            statuses = {str(value.get("status") or "") for value in results.values()}
            if statuses and statuses <= StrmMediaInfoSynchronizer.SUCCESS_STATUSES:
                status = "completed"
                synced_count = sum(
                    str(value.get("status") or "") == "synced"
                    for value in results.values()
                )
                local_count = sum(
                    str(value.get("status") or "") == "local"
                    for value in results.values()
                )
                if synced_count and not local_count:
                    reason = "所有目标神医接口均已接受本次插件推送"
                elif local_count and not synced_count:
                    reason = "所有目标 Emby 均已有媒体信息，本次插件数据未覆盖"
                else:
                    reason = (
                        f"{synced_count} 个目标接受插件推送，"
                        f"{local_count} 个目标沿用 Emby 原有媒体信息"
                    )
            elif not statuses:
                status = "attention"
                reason = outcome.get("reason") or "推送未产生结果，请检查扫描数据与服务器配置"
            else:
                status = "attention"
                reason = "存在不支持的服务器（需神医 Pro）或推送被拒绝，请检查任务详情"
            next_attempt = 0

        with self._strm_sync_lock:
            jobs = self._read_strm_sync_jobs()
            current = next((item for item in jobs if str(item.get("id")) == job_id), None)
            if not current:
                return
            current.update({
                "status": status,
                "reason": reason,
                "server_results": results,
                "next_attempt_ts": next_attempt,
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })
            # 成功后无需再保存完整 MediaStreams/Chapters，避免已完成记录长期膨胀插件数据。
            if status == "completed":
                current.pop("sync_payload", None)
            self._save_strm_sync_jobs(jobs)
        if status == "completed":
            logger.info(f"[媒体整理增强] 神医媒体信息推送完成：{job.get('title') or job.get('target_path')}")
        elif status != "pending":
            logger.warning(f"[媒体整理增强] 神医媒体信息推送 {status}：{reason}")

    def _mark_strm_job_error(self, job_id: str, reason: str) -> None:
        with self._strm_sync_lock:
            jobs = self._read_strm_sync_jobs()
            current = next((item for item in jobs if str(item.get("id")) == job_id), None)
            if current:
                current.update({
                    "status": "pending",
                    "reason": reason,
                    "next_attempt_ts": time.time() + int(self._config.get("strm_media_info_sync_retry_seconds", 30)),
                    "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                })
                self._save_strm_sync_jobs(jobs)

    def _read_strm_sync_jobs(self) -> List[Dict[str, Any]]:
        value = self.get_data(self.DATA_KEY_STRM_MEDIA_INFO_JOBS) or []
        return value if isinstance(value, list) else []

    def _recover_strm_sync_jobs(self) -> None:
        with self._strm_sync_lock:
            jobs = self._read_strm_sync_jobs()
            changed = False
            for job in jobs:
                if job.get("status") != "running":
                    continue
                job.update({
                    "status": "pending",
                    "reason": "上次处理被插件重载或容器重启中断，已恢复排队",
                    "next_attempt_ts": time.time(),
                    "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                })
                changed = True
            if changed:
                self._save_strm_sync_jobs(jobs)

    def _save_strm_sync_jobs(self, jobs: List[Dict[str, Any]]) -> None:
        active = [item for item in jobs if item.get("status") in {"pending", "running"}]
        finished = [item for item in jobs if item.get("status") not in {"pending", "running"}]
        self.save_data(self.DATA_KEY_STRM_MEDIA_INFO_JOBS, [*active, *finished[:80]])

    def _strm_sync_runtime_config(self) -> Dict[str, Any]:
        return {
            "servers": list(self._config.get("strm_media_info_sync_servers") or []),
            "path_mappings": deepcopy(self._config.get("strm_media_info_sync_path_mappings") or []),
        }

    def _strm_sync_status_data(self, include_jobs: bool) -> Dict[str, Any]:
        data = {
            "available": MediaServerHelper is not None,
            "enabled": bool(self._config.get("strm_media_info_sync_enabled")),
            "active": self._strm_sync_active(),
            "worker_running": bool(self._strm_sync_thread and self._strm_sync_thread.is_alive()),
            "worker_error": str(self._strm_sync_worker_error or ""),
            "requires_media_probe": not bool(self._config.get("media_probe_enabled")),
            "servers": self._strm_sync.server_catalog(),
            "config": {
                "enabled": bool(self._config.get("strm_media_info_sync_enabled")),
                "servers": list(self._config.get("strm_media_info_sync_servers") or []),
                "initial_delay_seconds": int(self._config.get("strm_media_info_sync_initial_delay_seconds", 20)),
                "retry_seconds": int(self._config.get("strm_media_info_sync_retry_seconds", 30)),
                "max_wait_minutes": int(self._config.get("strm_media_info_sync_max_wait_minutes", 30)),
                "path_mappings": deepcopy(self._config.get("strm_media_info_sync_path_mappings") or []),
            },
            "counts": self._strm_sync_counts(),
        }
        if include_jobs:
            data["jobs"] = self._read_strm_sync_jobs()
        return data

    def _strm_sync_counts(self) -> Dict[str, int]:
        jobs = self._read_strm_sync_jobs()
        return {
            "pending": sum(1 for item in jobs if item.get("status") in {"pending", "running"}),
            "completed": sum(1 for item in jobs if item.get("status") == "completed"),
            "attention": sum(1 for item in jobs if item.get("status") in {"attention", "timeout"}),
        }

    def _enqueue_strm_sync_job(self, probe_result: Dict[str, Any], target_path: str, title: str) -> None:
        """把传输前预扫结果转换并排队；不在网络工作器中重复读取媒体文件。"""
        raw = probe_result.get("raw")
        if not probe_result.get("success") or not isinstance(raw, dict):
            if self._config.get("debug"):
                logger.info(
                    f"[媒体整理增强] 神医推送跳过（无原始扫描数据）：{probe_result.get('reason')}"
                )
            return
        file_name = Path(str(target_path)).name
        payload = build_sync_payload(
            raw,
            size=self._safe_int(probe_result.get("source_size"), 0) or None,
            file_name=file_name,
        )
        if not media_info_acceptable(payload[0]):
            logger.warning(
                f"[媒体整理增强] 神医推送跳过：{file_name} 扫描结果缺少大小或时长"
            )
            return
        job_id = hashlib.sha1(
            EmbyEpisodeGroupSynchronizer.normalize_path(target_path).casefold().encode("utf-8", errors="ignore")
        ).hexdigest()[:20]
        now = time.time()
        with self._strm_sync_lock:
            jobs = self._read_strm_sync_jobs()
            existing = next((item for item in jobs if str(item.get("id")) == job_id), None)
            job = existing or {
                "id": job_id,
                "title": title or file_name,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "created_ts": now,
                "attempts": 0,
                "server_results": {},
            }
            job.update({
                "target_path": target_path,
                "sync_payload": payload,
                "status": "pending",
                "reason": "等待 Emby 入库扫描",
                "created_ts": now,
                "server_results": {},
                "next_attempt_ts": now + int(self._config.get("strm_media_info_sync_initial_delay_seconds", 20)),
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })
            jobs = [item for item in jobs if str(item.get("id")) != job_id]
            jobs.insert(0, job)
            self._save_strm_sync_jobs(jobs)
        logger.info(f"[媒体整理增强] 神医媒体信息推送已排队：{job['title']}")
        self._strm_sync_wakeup.set()

    def _apply_release_group_supplements(
            self,
            rename_dict: Dict[str, Any],
            supplements: Dict[str, Any],
            include_fields: Optional[set] = None,
            exclude_fields: Optional[set] = None,
    ) -> List[Dict[str, Any]]:
        """按每条制作组档案的策略补充 MP 命名字段，并维护组合字段。"""
        changes: List[Dict[str, Any]] = []
        for field, spec in (supplements.get("fields") or {}).items():
            if include_fields is not None and field not in include_fields:
                continue
            if exclude_fields is not None and field in exclude_fields:
                continue
            value = spec.get("value")
            before = rename_dict.get(field)
            policy = spec.get("policy") or "fill_empty"
            if value in (None, "") or (policy == "fill_empty" and before not in (None, "", 0)):
                continue
            after = value
            if policy == "append" and before not in (None, "", 0):
                separator = (
                    str(self._config.get("customization_separator") or "@")
                    if field == "customization" else " "
                )
                before_text = str(before).strip()
                value_text = str(value).strip()
                parts = [part for part in before_text.split(separator) if part]
                after = before_text if value_text in parts else f"{before_text}{separator}{value_text}"
            if before == after:
                continue
            rename_dict[field] = after
            changes.append({
                "field": field,
                "before": before,
                "after": after,
                "source": "release_group",
                "policy": policy,
            })
        changed_fields = {item["field"] for item in changes}
        if changed_fields.intersection({"resourceType", "effect"}):
            rename_dict["edition"] = " ".join(
                str(rename_dict.get(key) or "").strip() for key in ("resourceType", "effect")
                if str(rename_dict.get(key) or "").strip()
            )
        if changed_fields.intersection({"resourceType", "effect", "videoFormat"}):
            rename_dict["resource_term"] = " ".join(
                str(rename_dict.get(key) or "").strip()
                for key in ("resourceType", "effect", "videoFormat")
                if str(rename_dict.get(key) or "").strip()
            )
        return changes

    @eventmanager.register(ChainEventType.TransferRenameBuild, priority=1)
    def on_transfer_rename_build(self, event: Event) -> None:
        """在 MP 首次渲染前补充制作组约定、实际媒体流与自定义字段。"""
        if not self.get_state() or not (
                self._config.get("custom_rename_fields_enabled")
                or self._config.get("rename_mapping_enabled")
                or self._config.get("media_probe_enabled")
                or self._config.get("release_group_field_supplements_enabled")
        ):
            return
        if not event or not event.event_data:
            return
        data = event.event_data
        rename_dict = self._event_get(data, "rename_dict")
        if not isinstance(rename_dict, dict):
            return
        log_stages: List[str] = []
        log_details: List[str] = []
        raw_release_group = rename_dict.get("releaseGroup")
        custom_field_keys = {str(item.get("key") or "") for item in self._custom_rename_fields}
        supplements: Dict[str, Any] = {}
        if self._config.get("release_group_field_supplements_enabled") and raw_release_group:
            supplements = self._release_group_registry.supplements(raw_release_group)
            supplement_changes = self._apply_release_group_supplements(
                rename_dict, supplements, exclude_fields=custom_field_keys,
            )
            if supplement_changes:
                log_stages.append("制作组字段补充")
                log_details.append(f"按制作组补齐 {len(supplement_changes)} 个命名字段")
            if supplements.get("conflicts"):
                log_stages.append("制作组字段冲突")
                log_details.append(f"跳过 {len(supplements['conflicts'])} 个冲突字段")
            if self._config.get("debug") and (supplement_changes or supplements.get("conflicts")):
                logger.info(f"[媒体整理增强] 制作组字段补充：{supplements}")
        source_context = self._build_rename_source_context(
            self._event_get(data, "source_path"), self._event_get(data, "source_item"),
        )
        rename_dict.update(source_context)
        if self._config.get("media_probe_enabled"):
            probe_result = self._media_probe.probe(
                source_context.get("source_path"),
                timeout=self._safe_int(self._config.get("media_probe_timeout"), 12),
                executable_path=self._config.get("media_probe_executable"),
                iso_executable_path=self._iso_executable(),
            )
            if probe_result.get("success"):
                probe_changes = self._media_probe.apply_fields(
                    rename_dict,
                    probe_result,
                    self._config.get("media_probe_fields") or [],
                    self._config.get("media_probe_policy") or "fill_empty",
                    overwrite_fields=self._config.get("media_probe_overwrite_fields") or [],
                    field_policies=self._config.get("media_probe_field_policies") or {},
                    subtitle_rules=self._config.get("media_probe_subtitle_rules"),
                    subtitle_to_customization=self._config.get("media_probe_subtitle_to_customization", True),
                    customization_separator=self._config.get("customization_separator") or "@",
                )
                log_stages.append("媒体流扫描")
                log_details.append(
                    f"读取 {probe_result.get('streams', {}).get('video', 0)} 视频 / "
                    f"{probe_result.get('streams', {}).get('audio', 0)} 音频 / "
                    f"{probe_result.get('streams', {}).get('subtitle', 0)} 字幕流"
                    + (f"，补齐 {len(probe_changes)} 个 MP 字段" if probe_changes else "")
                )
            elif self._config.get("debug"):
                logger.info(f"[媒体整理增强] 跳过媒体流扫描：{probe_result.get('reason')}")
        separator_changes = self._apply_rename_field_separators(rename_dict)
        if separator_changes and self._config.get("debug"):
            logger.info(f"[TMDB识别增强] 命名字段分隔符：{separator_changes}")
        if separator_changes:
            log_stages.append("连接与分隔")
            log_details.append(f"规范了 {len(separator_changes)} 个命名字段")
        if self._config.get("rename_mapping_enabled") and rename_dict.get("releaseGroup"):
            arranged_group, arrangement = self._release_group_arrangements.apply(
                rename_dict.get("releaseGroup")
            )
            mapped_group, changes = self._rename_mappings.apply(
                arranged_group, "release_group"
            )
            rename_dict["releaseGroup"] = mapped_group
            if arrangement.get("applied") and self._config.get("debug"):
                logger.info(f"[TMDB识别增强] 制作组结构化编排：{arrangement}")
            if changes and self._config.get("debug"):
                logger.info(f"[TMDB识别增强] 制作组命名映射：{changes}")
            if arrangement.get("applied") or changes:
                log_stages.append("制作组编排")
                log_details.append(
                    f"制作组：{arrangement.get('input') or rename_dict.get('releaseGroup')} → {mapped_group}"
                )
        if not self._config.get("custom_rename_fields_enabled"):
            self._event_set(data, "rename_dict", rename_dict)
            if log_stages:
                self._append_module_history(
                    module="命名预处理",
                    title=self._rename_event_title(data, rename_dict),
                    reason="；".join(log_details),
                    stages=log_stages,
                )
            return
        independent, _ = self._rename_fields.split_by_target_dependency(self._custom_rename_fields)
        values, errors = self._rename_fields.evaluate(independent, rename_dict)
        rename_dict.update(values)
        if values:
            log_stages.append("自定义字段")
            log_details.append(f"生成了 {len(values)} 个自定义字段")
        custom_supplement_changes = self._apply_release_group_supplements(
            rename_dict, supplements, include_fields=custom_field_keys,
        ) if supplements and custom_field_keys else []
        if custom_supplement_changes:
            log_stages.append("制作组自定义字段")
            log_details.append(f"按制作组补充 {len(custom_supplement_changes)} 个 Jinja2 自定义字段")
        self._event_set(data, "rename_dict", rename_dict)
        if errors:
            log_stages.append("自定义字段异常")
            log_details.append(f"{len(errors)} 个字段计算失败")
        if log_stages:
            self._append_module_history(
                module="命名预处理",
                title=self._rename_event_title(data, rename_dict),
                reason="；".join(log_details),
                stages=log_stages,
                accepted=not errors,
            )
        if errors and self._config.get("debug"):
            logger.warning(f"[TMDB识别增强] 自定义重命名字段预渲染失败：{errors}")

    @eventmanager.register(ChainEventType.TransferRename, priority=1)
    def on_transfer_rename(self, event: Event) -> None:
        """补算目标目录相关字段，并在其它智能重命名插件前更新渲染结果。"""
        if not self.get_state() or not self._config.get("custom_rename_fields_enabled"):
            return
        if not event or not event.event_data:
            return
        data = event.event_data
        rename_dict = self._event_get(data, "rename_dict")
        template_string = str(self._event_get(data, "template_string") or "")
        if not isinstance(rename_dict, dict) or not template_string:
            return
        _, target_fields = self._rename_fields.split_by_target_dependency(self._custom_rename_fields)
        references_target = any(
            re.search(rf"\b{re.escape(key)}\b", template_string)
            for key in RenameFieldRegistry.TARGET_CONTEXT_KEYS
        )
        if not target_fields and not references_target:
            return
        source_context = self._build_rename_source_context(
            self._event_get(data, "source_path"), self._event_get(data, "source_item"),
        )
        target_context = self._build_rename_target_context(
            self._event_get(data, "path"), self._event_get(data, "render_str"),
        )
        rename_dict.update({**source_context, **target_context})
        values, errors = self._rename_fields.evaluate(self._custom_rename_fields, rename_dict)
        rename_dict.update(values)
        previous_render = str(self._event_get(data, "render_str") or "")
        try:
            rendered = self._rename_fields.render_template(template_string, rename_dict)
        except Exception as err:
            logger.warning(f"[TMDB识别增强] 自定义字段二次渲染失败，保留 MP 原结果：{err}")
            return
        self._event_set(data, "rename_dict", rename_dict)
        self._event_set(data, "render_str", rendered)
        self._event_set(data, "updated", True)
        self._event_set(data, "updated_str", rendered)
        self._event_set(data, "source", self.__class__.__name__)
        if rendered != previous_render or errors:
            self._append_module_history(
                module="自定义命名字段",
                title=self._rename_event_title(data, rename_dict),
                reason=(
                    f"补算目标目录字段并重新渲染；{len(errors)} 个字段失败"
                    if errors else "补算目标目录相关字段并重新渲染"
                ),
                stages=["自定义字段"],
                accepted=not errors,
            )
        if errors and self._config.get("debug"):
            logger.warning(f"[TMDB识别增强] 自定义重命名字段目标阶段失败：{errors}")

    @eventmanager.register(ChainEventType.TransferRename, priority=100)
    def on_transfer_rename_mapping(self, event: Event) -> None:
        """在文件操作前统一改写最终相对路径；字幕延迟到 MP 追加语言后缀之后。"""
        if not self.get_state() or not self._config.get("rename_mapping_enabled"):
            return
        if not event or not event.event_data:
            return
        data = event.event_data
        if self._is_subtitle_transfer(data) and self._subtitle_rename_adapter.compatible:
            # __rename_subtitles 紧接 TransferRename 执行。这里只记录媒体库根目录，
            # 等语言后缀生成完成后再对完整相对路径统一执行一次，避免重复替换。
            self._subtitle_rename_adapter.prepare(self._event_get(data, "path"))
            return
        self._subtitle_rename_adapter.clear_pending()
        current = (
            self._event_get(data, "updated_str")
            if self._event_get(data, "updated") else self._event_get(data, "render_str")
        )
        mapped, changes = self._apply_final_naming_mapping(current, include_changes=True)
        if not changes:
            return
        self._event_set(data, "render_str", mapped)
        self._event_set(data, "updated", True)
        self._event_set(data, "updated_str", mapped)
        self._event_set(data, "source", self.__class__.__name__)
        self._append_module_history(
            module="文本映射",
            title=self._rename_event_title(data),
            reason=f"命中 {len(changes)} 条规则：{current} → {mapped}",
            stages=["文本映射"],
        )
        if self._config.get("debug"):
            logger.info(f"[TMDB识别增强] 命名结果映射：{changes}")

    @eventmanager.register(ChainEventType.NameRecognize, priority=5)
    def on_name_recognize(self, event: Event) -> None:
        """处理名称识别事件，并在高置信度时写回 TMDBID 与目标季集。"""
        if not self.get_state() or not event or not event.event_data:
            return
        event_data = event.event_data
        if self._event_get(event_data, "source_plugin") or self._event_get(event_data, "name"):
            return
        raw_title = self._clean_title(self._event_get(event_data, "title"))
        if not raw_title:
            return

        # 运行在 MoviePilot 正式识别链中时，优先使用其已经执行识别词后的
        # MetaBase；旧版核心或识别试验接口没有运行时上下文时再安全回退。
        title, hints = self._prepare_event_recognition_input(event_data, raw_title)

        # MP 传统识别词中显式指定的 ID 拥有最高优先级。TMDBID 命中本插件
        # 规则时只做第三步季集归一化，不重新搜索、更不覆盖这个 ID；豆瓣等
        # 其它固定 ID 则完全交回原生链处理。
        runtime_meta = self._runtime_adapter.current_meta()
        fixed_tmdb_id = self._safe_int(getattr(runtime_meta, "tmdbid", 0), 0)
        other_fixed_id = any((
            getattr(runtime_meta, "doubanid", None),
            getattr(runtime_meta, "bangumiid", None),
        )) if runtime_meta is not None else False
        if fixed_tmdb_id:
            fixed_type = self._normalize_media_type(getattr(runtime_meta, "type", None)) or MediaType.TV
            fixed_best = {
                "tmdb_id": fixed_tmdb_id,
                "name": title,
                "year": self._normalize_year(getattr(runtime_meta, "year", "")),
                "media_type": fixed_type.value,
                "score": 100.0,
            }
            adjustment = self._normalize_best_episode(
                best=fixed_best,
                hints=hints,
                raw_title=raw_title,
                parsed_name=title,
            )
            if adjustment is not None:
                self._apply_runtime_meta(fixed_best, adjustment)
                self._append_history({
                    "accepted": True,
                    "title": title,
                    "original_title": raw_title if raw_title != title else "",
                    "reason": "沿用 MP 传统识别词指定的 TMDBID，仅检查目标编集",
                    "queries": [],
                    "hints": self._serialize_hints(hints),
                    "best": fixed_best,
                    "runner_up": None,
                    "margin": 100.0,
                    "episode_adjustment": adjustment,
                    "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                })
            return
        if other_fixed_id:
            return
        if not self._config.get("recognizer_enabled", True):
            return

        try:
            result = self._recognize_title(title, hints=hints, include_candidates=False)
        except Exception as err:
            logger.error(f"[TMDB识别增强] {title} 候选识别失败：{err}")
            result = {
                "accepted": False,
                "title": title,
                "reason": f"候选检索异常：{err}",
                "queries": [],
                "best": None,
                "margin": 0,
            }
        result["original_title"] = raw_title if raw_title != title else ""

        best = result.get("best") or {}
        if not result.get("accepted") or not best.get("name"):
            self._append_history(result)
            if self._config.get("debug"):
                logger.info(f"[TMDB识别增强] 拒绝注入：{title}，{result.get('reason')}")
            return

        adjustment = self._normalize_best_episode(
            best=best,
            hints=hints,
            raw_title=raw_title,
            parsed_name=title,
        )
        result["episode_adjustment"] = adjustment
        self._apply_runtime_meta(best, adjustment)
        self._append_history(result)

        self._event_set(event_data, "name", best.get("name"))
        self._event_set(event_data, "year", best.get("year") or "")
        self._event_set(event_data, "tmdbid", best.get("tmdb_id"))
        media_type = best.get("media_type")
        self._event_set(
            event_data,
            "media_type",
            media_type.value if isinstance(media_type, MediaType) else media_type,
        )
        final_season = adjustment.get("season") if adjustment else hints.get("season")
        final_episode = adjustment.get("episode") if adjustment else hints.get("episode")
        final_end_episode = adjustment.get("end_episode") if adjustment else hints.get("end_episode")
        if final_season is not None:
            self._event_set(event_data, "season", final_season)
        if final_episode is not None:
            self._event_set(event_data, "episode", final_episode)
        if final_end_episode is not None:
            self._event_set(event_data, "end_episode", final_end_episode)
        if adjustment and adjustment.get("episode_group"):
            self._event_set(event_data, "episode_group", adjustment.get("episode_group"))
        self._event_set(event_data, "source_plugin", self.__class__.__name__)
        self._event_set(event_data, "confidence", round(float(best.get("score") or 0) / 100, 3))
        self._event_set(event_data, "reason", result.get("reason"))
        logger.info(
            f"[TMDB识别增强] {raw_title} => {best.get('name')} ({best.get('year') or '未知年份'}) "
            f"TMDB {best.get('tmdb_id')}，得分 {best.get('score')}，分差 {result.get('margin')}；"
            f"季集：S{final_season}E{final_episode}，"
            f"归一化：{(adjustment or {}).get('reason') or '未启用'}"
        )

    def _sync_event_handler_state(self, enabled: Optional[bool] = None) -> None:
        """同步方法与插件类两层事件状态，确保配置保存后立即生效。"""
        enabled = self.get_state() if enabled is None else bool(enabled)
        if enabled:
            eventmanager.enable_event_handler(type(self))
            eventmanager.enable_event_handler(self.on_name_recognize)
        else:
            eventmanager.disable_event_handler(self.on_name_recognize)
            eventmanager.disable_event_handler(type(self))

    def _refresh_metadata_tools(self) -> None:
        """加载制作组档案和识别字段覆盖层。"""
        profiles = self._read_release_group_profiles()
        self._release_group_registry.refresh(profiles)
        self._recognition_rules.refresh(self._read_recognition_rule_overrides())
        self._custom_rename_fields = tuple(deepcopy(self._read_custom_rename_fields()))
        self._release_group_arrangements.refresh(
            self._read_release_group_arrangements(),
            self._config.get("release_group_default_connector"),
            self._config.get("release_group_normalize_unknown_connectors"),
        )
        self._rename_mappings.refresh(self._read_rename_mappings())

    def _read_custom_rename_fields(self) -> List[Dict[str, Any]]:
        """读取并校验用户自定义重命名字段；异常旧数据不会阻断插件启动。"""
        stored = self.get_data(self.DATA_KEY_CUSTOM_RENAME_FIELDS) or []
        try:
            return RenameFieldRegistry.normalize_fields(stored)
        except ValueError as err:
            logger.warning(f"[TMDB识别增强] 自定义重命名字段加载失败：{err}")
            return []

    def _read_rename_mappings(self) -> List[Dict[str, Any]]:
        """读取制作组与最终命名映射。"""
        return RenameMappingRegistry.normalize_rules(
            self.get_data(self.DATA_KEY_RENAME_MAPPINGS) or []
        )

    def _read_release_group_arrangements(self) -> List[Dict[str, Any]]:
        """读取结构化制作组名称、位置和连接符规则。"""
        return ReleaseGroupArrangementRegistry.normalize_rules(
            self.get_data(self.DATA_KEY_RELEASE_GROUP_ARRANGEMENTS) or []
        )

    @staticmethod
    def _build_rename_source_context(source_path: Any, source_item: Any = None) -> Dict[str, Any]:
        """从重命名事件构造可用于 Jinja2 的纯值源文件上下文。"""
        def item_value(key: str, default: Any = "") -> Any:
            if isinstance(source_item, dict):
                return source_item.get(key, default)
            return getattr(source_item, key, default)

        raw_path = str(source_path or item_value("path") or "").strip()
        path = Path(raw_path) if raw_path else None
        name = str(item_value("name") or (path.name if path else ""))
        extension = str(item_value("extension") or "").strip().lstrip(".")
        suffix = f".{extension}" if extension else (path.suffix if path else "")
        stem = Path(name).stem if name else (path.stem if path else "")
        return {
            "source_path": raw_path,
            "source_dir": str(path.parent) if path else "",
            "source_name": name,
            "source_stem": stem,
            "source_ext": suffix,
            "source_storage": str(item_value("storage") or ""),
            "source_item_type": str(item_value("type") or ""),
            "source_size": TmdbRecognizeEnhancer._safe_int(item_value("size", 0), 0),
        }

    @staticmethod
    def _build_rename_target_context(target_dir: Any, rendered_relative_path: Any) -> Dict[str, Any]:
        """构造目标目录上下文；目标路径只描述首次渲染结果，避免循环依赖。"""
        root = str(target_dir or "").strip()
        relative = str(rendered_relative_path or "").strip()
        combined = str(Path(root) / relative) if root and relative else (root or relative)
        return {
            "target_dir": root,
            "rendered_relative_path": relative,
            "target_path_before_custom": combined,
        }

    def _read_release_group_profiles(self) -> Dict[str, Dict[str, Any]]:
        """读取制作组类型及字段补充配置，并兼容异常旧数据。"""
        return ReleaseGroupRegistry.normalize_profiles(
            self.get_data(self.DATA_KEY_RELEASE_GROUP_PROFILES) or {}
        )

    def _read_recognition_rule_overrides(self) -> List[Dict[str, Any]]:
        """读取插件覆盖规则并兼容异常旧数据。"""
        return RecognitionRuleRegistry.normalize_overrides(
            self.get_data(self.DATA_KEY_RECOGNITION_RULE_OVERRIDES) or []
        )

    def _apply_recognition_rule_overrides(self, meta: Any) -> None:
        """运行时入口：只在模块开启且存在覆盖规则时校正 MetaBase。"""
        if not self.get_state() or not self._config.get("recognition_rule_overrides_enabled"):
            return
        try:
            changes = self._recognition_rules.apply(meta)
            if changes and self._config.get("debug"):
                logger.info(
                    "[TMDB识别增强] 内置识别字段覆盖："
                    + "；".join(f"{item['field']}={item['before']}→{item['after']}" for item in changes)
                )
            if changes:
                self._append_module_history(
                    module="识别字段覆盖",
                    title=str(
                        getattr(meta, "original_name", None)
                        or getattr(meta, "name", None)
                        or "未命名媒体"
                    ),
                    reason="；".join(
                        f"{item['field']}：{item['before']} → {item['after']}"
                        for item in changes
                    ),
                    stages=["识别字段覆盖"],
                )
        except Exception as err:
            logger.warning(f"[TMDB识别增强] 识别字段覆盖失败，保留 MP 原结果：{err}")
            self._append_module_history(
                module="识别字段覆盖",
                title=str(
                    getattr(meta, "original_name", None)
                    or getattr(meta, "name", None)
                    or "未命名媒体"
                ),
                reason=f"覆盖执行失败，已保留 MP 原结果：{err}",
                stages=["识别字段覆盖"],
                accepted=False,
            )

    def _sync_runtime_adapter_state(self) -> None:
        """只在插件启用期间安装运行时适配器。"""
        if self.get_state():
            self._runtime_adapter.install(
                self._apply_recognition_rule_overrides,
                self._apply_post_recognition_episode_normalization,
            )
            self._episode_transfer_adapter.install(
                self._apply_transfer_episode_normalization,
            )
        else:
            self._runtime_adapter.uninstall()
            self._episode_transfer_adapter.uninstall()

    def _sync_subtitle_adapter_state(self) -> None:
        """按模块开关安装或恢复 MP 字幕后缀后的最终命名点。"""
        if self.get_state() and self._config.get("rename_mapping_enabled"):
            self._subtitle_rename_adapter.install(self._apply_subtitle_final_naming_mapping)
        else:
            self._subtitle_rename_adapter.uninstall()

    def _sync_customization_separator_state(self) -> None:
        """同步 MP 自定义占位符组合连接符，不修改 MoviePilot 文件。"""
        if self.get_state():
            self._customization_separator_adapter.install(
                self._config.get("customization_separator") or "@"
            )
        else:
            self._customization_separator_adapter.uninstall()

    def _apply_rename_field_separators(self, rename_dict: Dict[str, Any]) -> List[Dict[str, str]]:
        """按用户选择的字段，把字段内部空白统一为命名分隔符。"""
        separator = str(self._config.get("rename_default_separator") or "")
        fields = self._config.get("rename_separator_fields") or []
        if not separator or not fields:
            return []
        changes: List[Dict[str, str]] = []
        for field in fields:
            value = rename_dict.get(field)
            if not isinstance(value, str) or not re.search(r"\s", value.strip()):
                continue
            updated = separator.join(value.split())
            if updated == value:
                continue
            rename_dict[field] = updated
            changes.append({"field": field, "before": value, "after": updated})
        return changes

    def _apply_final_naming_mapping(
            self, value: Any, include_changes: bool = False,
    ) -> Any:
        """统一执行最终命名规则，并拒绝绝对路径和父目录逃逸。"""
        original = str(value or "")
        mapped, changes = self._rename_mappings.apply(original, "final_result")
        candidate = Path(mapped)
        if candidate.is_absolute() or ".." in candidate.parts:
            logger.warning(f"[TMDB识别增强] 最终命名规则产生了不安全路径，已拒绝：{mapped}")
            mapped, changes = original, []
        if changes and self._config.get("debug"):
            logger.info(f"[TMDB识别增强] 最终命名二次渲染：{changes}")
        return (mapped, changes) if include_changes else mapped

    def _apply_subtitle_final_naming_mapping(self, value: Any) -> str:
        """字幕语言后缀生成后执行最终映射，并补记实际命名日志。"""
        mapped, changes = self._apply_final_naming_mapping(value, include_changes=True)
        if changes:
            self._append_module_history(
                module="文本映射",
                title=Path(str(value or "")).name or str(value or "字幕文件"),
                reason=f"字幕后缀生成后命中 {len(changes)} 条规则：{value} → {mapped}",
                stages=["字幕后缀", "文本映射"],
            )
        return str(mapped)

    @classmethod
    def _is_subtitle_transfer(cls, data: Any) -> bool:
        """从 TransferRename 事件识别字幕源文件，兼容字典与对象形式。"""
        source_item = cls._event_get(data, "source_item")
        if isinstance(source_item, dict):
            extension = source_item.get("extension") or source_item.get("ext")
            source_name = source_item.get("name") or source_item.get("path")
        else:
            extension = getattr(source_item, "extension", None) or getattr(source_item, "ext", None)
            source_name = getattr(source_item, "name", None) or getattr(source_item, "path", None)
        if not source_name:
            source_name = cls._event_get(data, "source_path")
        suffix = str(extension or Path(str(source_name or "")).suffix).lower().lstrip(".")
        return suffix in {"ass", "ssa", "srt", "sub", "sup", "vtt"}

    def _prepare_recognition_input(self, raw_title: str) -> Tuple[str, Dict[str, Any]]:
        """复用 MoviePilot 元数据解析结果，返回搜索标题与识别提示。"""
        raw_title = self._clean_title(raw_title)
        title = raw_title
        hints = self._extract_hints(raw_title)
        if not raw_title or not self._config.get("prefer_parsed_title", True):
            return title, self._enrich_release_group_hints(hints)

        try:
            meta = MetaInfo(raw_title)
            recognition_rule_changes = []
            if self._config.get("recognition_rule_overrides_enabled"):
                recognition_rule_changes = self._recognition_rules.apply(meta)
            parsed_title = self._clean_title(getattr(meta, "name", ""))
            if parsed_title:
                title = parsed_title

            parsed_hints = {
                "year": self._normalize_year(getattr(meta, "year", "")),
                "media_type": self._normalize_media_type(getattr(meta, "type", None)),
                "season": self._safe_int(getattr(meta, "begin_season", 0), 0),
                "episode": self._safe_int(getattr(meta, "begin_episode", 0), 0),
                "end_episode": self._optional_int(getattr(meta, "end_episode", None)),
                "original_title": self._clean_title(
                    getattr(meta, "original_name", "") or getattr(meta, "org_string", "")
                ),
                "release_group": self._clean_title(getattr(meta, "resource_team", "")),
                "anilist_id": (
                    getattr(meta, "anilist_id", None)
                    or getattr(meta, "anilistid", None)
                ),
                "bangumi_id": (
                    getattr(meta, "bangumi_id", None)
                    or getattr(meta, "bangumiid", None)
                ),
                "anidb_id": (
                    getattr(meta, "anidb_id", None)
                    or getattr(meta, "anidbid", None)
                ),
            }
            hints.update({key: value for key, value in parsed_hints.items() if value not in (None, "", 0)})
            if recognition_rule_changes:
                hints["recognition_rule_changes"] = recognition_rule_changes
            if parsed_hints["media_type"]:
                hints["media_type_source"] = "moviepilot"
            if self._config.get("debug") and title != raw_title:
                logger.info(f"[TMDB识别增强] 使用 MoviePilot 解析标题：{raw_title} => {title}")
        except Exception as err:
            logger.warning(f"[TMDB识别增强] MoviePilot 标题解析失败，回退原标题：{raw_title}，{err}")
        return title, self._enrich_release_group_hints(hints)

    def _prepare_event_recognition_input(
            self, event_data: Any, raw_title: str
    ) -> Tuple[str, Dict[str, Any]]:
        """优先采用 MP 已执行识别词后的结构化结果，旧核心则回退自行解析。"""
        runtime_meta = self._runtime_adapter.current_meta()
        parsed_name = self._clean_title(getattr(runtime_meta, "name", ""))
        if runtime_meta is not None and parsed_name:
            hints = self._extract_hints(raw_title)
            runtime_hints = {
                "year": self._normalize_year(getattr(runtime_meta, "year", "")),
                "media_type": self._normalize_media_type(getattr(runtime_meta, "type", None)),
                "season": self._optional_int(getattr(runtime_meta, "begin_season", None)),
                "episode": self._optional_int(getattr(runtime_meta, "begin_episode", None)),
                "end_episode": self._optional_int(getattr(runtime_meta, "end_episode", None)),
                "original_title": self._clean_title(
                    getattr(runtime_meta, "original_name", "")
                    or getattr(runtime_meta, "org_string", "")
                    or raw_title
                ),
                "release_group": self._clean_title(getattr(runtime_meta, "resource_team", "")),
                "anilist_id": (
                    getattr(runtime_meta, "anilist_id", None)
                    or getattr(runtime_meta, "anilistid", None)
                ),
                "bangumi_id": (
                    getattr(runtime_meta, "bangumi_id", None)
                    or getattr(runtime_meta, "bangumiid", None)
                ),
                "anidb_id": (
                    getattr(runtime_meta, "anidb_id", None)
                    or getattr(runtime_meta, "anidbid", None)
                ),
            }
            hints.update({key: value for key, value in runtime_hints.items() if value not in (None, "")})
            if runtime_hints["media_type"]:
                hints["media_type_source"] = "moviepilot"
            return parsed_name, self._enrich_release_group_hints(hints)

        parsed_name = self._clean_title(self._event_get(event_data, "parsed_name"))
        if not parsed_name:
            return self._prepare_recognition_input(raw_title)
        hints = self._extract_hints(raw_title)
        parsed_hints = {
            "year": self._normalize_year(self._event_get(event_data, "parsed_year")),
            "media_type": self._normalize_media_type(self._event_get(event_data, "parsed_media_type")),
            "season": self._optional_int(self._event_get(event_data, "parsed_season")),
            "episode": self._optional_int(self._event_get(event_data, "parsed_episode")),
            "end_episode": self._optional_int(self._event_get(event_data, "parsed_end_episode")),
            "original_title": self._clean_title(
                self._event_get(event_data, "original_title") or raw_title
            ),
            "release_group": self._clean_title(self._event_get(event_data, "release_group")),
        }
        hints.update({key: value for key, value in parsed_hints.items() if value not in (None, "")})
        if parsed_hints["media_type"]:
            hints["media_type_source"] = "moviepilot"
        return parsed_name, self._enrich_release_group_hints(hints)

    def _enrich_release_group_hints(self, hints: Dict[str, Any]) -> Dict[str, Any]:
        """把用户明确设置的制作组分类转换为 TMDB 题材硬约束。"""
        if not self._config.get("release_group_assist_enabled", True):
            return hints
        profile = self._release_group_registry.classify(hints.get("release_group"))
        if profile.get("kind") in ("animation", "live_action"):
            hints["release_group_profile"] = profile
        return hints

    def _apply_runtime_meta(
            self,
            best: Dict[str, Any],
            adjustment: Optional[Dict[str, Any]],
            meta: Any = None,
    ) -> None:
        """直接写回本次识别 MetaBase，使原版 MP 能按 TMDBID 和目标编集继续处理。"""
        meta = meta or self._runtime_adapter.current_meta()
        if meta is None:
            return
        tmdb_id = self._safe_int(best.get("tmdb_id"), 0)
        if tmdb_id:
            meta.tmdbid = tmdb_id
        media_type = self._normalize_media_type(best.get("media_type"))
        if media_type:
            meta.type = media_type
        if not adjustment:
            return
        if adjustment.get("season") is not None:
            meta.begin_season = int(adjustment["season"])
        if adjustment.get("episode") is not None:
            meta.begin_episode = int(adjustment["episode"])
        if adjustment.get("end_episode") is not None:
            meta.end_episode = int(adjustment["end_episode"])
            if meta.begin_episode is not None:
                meta.total_episode = max(0, meta.end_episode - meta.begin_episode + 1)
        if "episode_group" in adjustment:
            meta.episode_group = (
                str(adjustment["episode_group"])
                if adjustment.get("episode_group") else None
            )

    def _apply_post_recognition_episode_normalization(
            self, meta: Any, mediainfo: Any
    ) -> Any:
        """无论最终结果来自 MP 原生还是插件，都在识别成功后检查目标编集。"""
        if (
                not self.get_state()
                or not self._config.get("episode_normalizer_enabled")
                or meta is None
                or mediainfo is None
        ):
            return mediainfo
        try:
            media_type = self._normalize_media_type(
                self._event_get(mediainfo, "type") or getattr(meta, "type", None)
            )
            tmdb_id = self._safe_int(
                self._event_get(mediainfo, "tmdb_id")
                or self._event_get(mediainfo, "tmdbid")
                or getattr(meta, "tmdbid", 0),
                0,
            )
            if media_type != MediaType.TV or not tmdb_id:
                return mediainfo

            raw_title = self._clean_title(
                getattr(meta, "original_name", "")
                or getattr(meta, "org_string", "")
                or getattr(meta, "name", "")
            )
            parsed_name = self._clean_title(
                getattr(meta, "name", "") or getattr(meta, "title", "")
            )
            hints = {
                "season": self._optional_int(getattr(meta, "begin_season", None)),
                "episode": self._optional_int(getattr(meta, "begin_episode", None)),
                "end_episode": self._optional_int(getattr(meta, "end_episode", None)),
            }
            adjustment = self._normalize_best_episode(
                best={
                    "tmdb_id": tmdb_id,
                    "media_type": media_type,
                    "name": self._event_get(mediainfo, "title") or parsed_name,
                    "year": self._event_get(mediainfo, "year") or getattr(meta, "year", ""),
                },
                hints=hints,
                raw_title=raw_title,
                parsed_name=parsed_name,
            )
            if not adjustment or not (
                    adjustment.get("applied")
                    or adjustment.get("strategy") == "target-coordinate"
            ):
                return mediainfo

            before = (
                self._optional_int(getattr(meta, "begin_season", None)),
                self._optional_int(getattr(meta, "begin_episode", None)),
                self._optional_int(getattr(meta, "end_episode", None)),
                str(getattr(meta, "episode_group", "") or ""),
                self._optional_int(self._event_get(mediainfo, "season")),
                str(self._event_get(mediainfo, "episode_group") or ""),
            )
            self._apply_runtime_meta(
                {"tmdb_id": tmdb_id, "media_type": media_type},
                adjustment,
                meta=meta,
            )
            self._event_set(mediainfo, "season", adjustment.get("season"))
            self._event_set(
                mediainfo,
                "episode_group",
                adjustment.get("episode_group") or None,
            )
            after = (
                self._optional_int(getattr(meta, "begin_season", None)),
                self._optional_int(getattr(meta, "begin_episode", None)),
                self._optional_int(getattr(meta, "end_episode", None)),
                str(getattr(meta, "episode_group", "") or ""),
                self._optional_int(self._event_get(mediainfo, "season")),
                str(self._event_get(mediainfo, "episode_group") or ""),
            )
            if before == after:
                return mediainfo
            self._append_module_history(
                module="集数偏移",
                title=str(
                    self._event_get(mediainfo, "title")
                    or parsed_name
                    or f"TMDB {tmdb_id}"
                ),
                reason=(
                    f"最终识别结果 TMDB {tmdb_id}："
                    f"S{hints.get('season')}E{hints.get('episode')} → "
                    f"S{adjustment.get('season')}E{adjustment.get('episode')}；"
                    f"{adjustment.get('reason') or adjustment.get('strategy')}"
                ),
                stages=["最终识别结果", "集数偏移"],
            )
        except Exception as err:
            logger.warning(
                f"[媒体整理增强] 最终识别后的集数归一化失败，保留 MP 原结果：{err}"
            )
        return mediainfo

    def _apply_transfer_episode_normalization(
            self, meta: Any, mediainfo: Any, episodes_info: Any
    ) -> Any:
        """兜底处理直接携带识别结果的整理任务，并刷新对应目标季集数据。"""
        before = (
            self._optional_int(getattr(meta, "begin_season", None)) if meta else None,
            self._optional_int(getattr(meta, "begin_episode", None)) if meta else None,
            self._optional_int(getattr(meta, "end_episode", None)) if meta else None,
            str(getattr(meta, "episode_group", "") or "") if meta else "",
            self._optional_int(self._event_get(mediainfo, "season")),
            str(self._event_get(mediainfo, "episode_group") or ""),
        )
        self._apply_post_recognition_episode_normalization(meta, mediainfo)
        after = (
            self._optional_int(getattr(meta, "begin_season", None)) if meta else None,
            self._optional_int(getattr(meta, "begin_episode", None)) if meta else None,
            self._optional_int(getattr(meta, "end_episode", None)) if meta else None,
            str(getattr(meta, "episode_group", "") or "") if meta else "",
            self._optional_int(self._event_get(mediainfo, "season")),
            str(self._event_get(mediainfo, "episode_group") or ""),
        )
        if before == after or mediainfo is None:
            return episodes_info
        try:
            from app.chain.tmdb import TmdbChain

            tmdb_id = self._safe_int(
                self._event_get(mediainfo, "tmdb_id")
                or self._event_get(mediainfo, "tmdbid"),
                0,
            )
            season = self._optional_int(self._event_get(mediainfo, "season"))
            if season is None and meta is not None:
                season = self._optional_int(getattr(meta, "begin_season", None))
            if not tmdb_id:
                return episodes_info
            return TmdbChain().tmdb_episodes(
                tmdbid=tmdb_id,
                season=1 if season is None else season,
                episode_group=self._event_get(mediainfo, "episode_group") or None,
            )
        except Exception as err:
            logger.warning(
                f"[媒体整理增强] 集数偏移后刷新 TMDB 季集数据失败，沿用原数据：{err}"
            )
            return episodes_info

    def _normalize_best_episode(
            self,
            best: Dict[str, Any],
            hints: Dict[str, Any],
            raw_title: str,
            parsed_name: str,
    ) -> Optional[Dict[str, Any]]:
        """对已确定 TMDBID 的电视剧执行可选目标编集归一化。"""
        if not self._config.get("episode_normalizer_enabled"):
            return None
        if not self._runtime_adapter.compatible:
            return {
                "applied": False,
                "season": hints.get("season"),
                "episode": hints.get("episode"),
                "end_episode": hints.get("end_episode"),
                "reason": self._runtime_adapter.message,
                "strategy": "runtime-incompatible",
            }
        media_type = self._normalize_media_type(best.get("media_type"))
        if media_type != MediaType.TV:
            return None
        tmdb_id = self._safe_int(best.get("tmdb_id"), 0)
        rule = next((
            item for item in self._read_episode_rules()
            if item.get("enabled", True) and self._safe_int(item.get("tmdb_id"), 0) == tmdb_id
        ), None)
        if not rule:
            return None
        result = self._normalizer().normalize(
            rule=rule,
            season=self._optional_int(hints.get("season")),
            episode=self._optional_int(hints.get("episode")),
            end_episode=self._optional_int(hints.get("end_episode")),
            raw_title=raw_title,
            parsed_name=parsed_name,
        )
        if result.get("applied"):
            logger.info(
                f"[TMDB识别增强] TMDB {tmdb_id} 集数归一化："
                f"S{hints.get('season')}E{hints.get('episode')} => "
                f"S{result.get('season')}E{result.get('episode')}（{result.get('strategy')}）"
            )
        return result

    def _recognize_title(
            self,
            title: str,
            hints: Optional[Dict[str, Any]] = None,
            include_candidates: bool = False,
            recognition_mode: Optional[str] = None,
    ) -> Dict[str, Any]:
        """生成降级搜索词、检索并评分候选，返回可解释的选择结果。"""
        merged_hints = self._extract_hints(title)
        for key, value in (hints or {}).items():
            if value not in (None, "") and (value != 0 or key in ("season", "episode", "end_episode")):
                merged_hints[key] = value
        hints = merged_hints
        type_constraint = self._resolve_media_type_constraint(hints)
        if not self._config.get("use_year_hint", True):
            hints.pop("year", None)
        if not self._config.get("use_original_title_evidence", True):
            hints.pop("original_title", None)
        cross_id = self._recognize_by_anime_cross_id(
            title, hints, include_candidates=include_candidates,
        )
        if cross_id.get("accepted"):
            return cross_id
        mode = recognition_mode if recognition_mode in ("tmdb_first", "scored") \
            else self._config.get("recognition_mode")
        search_title = title
        if mode == "tmdb_first":
            result = self._recognize_tmdb_first_result(search_title, hints, include_candidates)
            result.update({
                "title": title,
                "search_title": search_title,
                "cross_id": cross_id,
            })
            return result

        queries = self._build_queries(search_title)
        candidates = self._search_candidates(queries, hints)
        candidates, type_constraint = self._filter_candidates_by_media_type(
            candidates, hints, type_constraint
        )
        candidates, release_group_preference = self._prefer_candidates_by_release_group(
            candidates, hints
        )
        candidates, excluded_candidates, candidate_policy = self._apply_tmdb_candidate_policy(
            candidates,
        )
        candidates = self._attach_context_evidence(candidates, search_title)
        candidates = self._attach_episode_coordinate_evidence(candidates, hints)
        scored = [self._score_candidate(search_title, queries, candidate, hints) for candidate in candidates]
        excluded_scored = [
            self._score_candidate(search_title, queries, candidate, hints)
            for candidate in excluded_candidates
        ]
        for candidate in excluded_scored:
            candidate["suppressed_by_exclusion"] = True
        scored.sort(key=lambda item: (item["score"], item.get("popularity") or 0), reverse=True)

        ranked, duplicate_summary = self._collapse_duplicate_candidates(scored)
        ranked, shadow_count = self._suppress_shadow_season_entries(ranked, hints)
        duplicate_summary["shadow_season_count"] = shadow_count
        ranked = self._rescore_eligible_candidates(
            search_title, queries, candidates, ranked, hints,
        )
        scored.sort(key=lambda item: (item["score"], item.get("popularity") or 0), reverse=True)
        ranked, decisive = self._apply_decisive_year_evidence(ranked, hints)
        ranked, shared_decisive = self._apply_shared_recognition_evidence(ranked)
        ranked, policy_decisive = self._promote_policy_candidate(
            ranked, scored, candidate_policy,
        )
        decisive = policy_decisive or shared_decisive or decisive
        best = ranked[0] if ranked else None
        runner_up = ranked[1] if len(ranked) > 1 else None
        margin = round(best["score"] - runner_up["score"], 2) if best and runner_up else (100.0 if best else 0.0)
        raw_margin = margin
        if decisive and margin < 0:
            margin = 0.0
        minimum_score = float(self._config["minimum_score"])
        minimum_margin = float(self._config["minimum_margin"])
        policy_override = bool(policy_decisive and best)
        shared_override = bool(best and best.get("shared_recognition"))
        margin_waived = bool(
            policy_override or shared_override
            or (decisive and best and best["score"] >= minimum_score)
        )
        accepted = bool(
            best and (
                policy_override or shared_override or (
                    best["score"] >= minimum_score
                    and (margin >= minimum_margin or margin_waived)
                )
            )
        )
        web_search = {"attempted": False}

        if self._config.get("web_search_fallback") and not accepted:
            candidates, web_search = self._apply_web_search_fallback(
                search_title, hints, [*candidates, *excluded_candidates],
            )
            candidates, type_constraint = self._filter_candidates_by_media_type(
                candidates, hints, type_constraint
            )
            candidates, release_group_preference = self._prefer_candidates_by_release_group(
                candidates, hints
            )
            candidates, excluded_candidates, candidate_policy = self._apply_tmdb_candidate_policy(
                candidates,
            )
            candidates = self._attach_context_evidence(candidates, search_title)
            candidates = self._attach_episode_coordinate_evidence(candidates, hints)
            scored = [self._score_candidate(search_title, queries, candidate, hints) for candidate in candidates]
            excluded_scored = [
                self._score_candidate(search_title, queries, candidate, hints)
                for candidate in excluded_candidates
            ]
            for candidate in excluded_scored:
                candidate["suppressed_by_exclusion"] = True
            scored.sort(key=lambda item: (item["score"], item.get("popularity") or 0), reverse=True)
            ranked, duplicate_summary = self._collapse_duplicate_candidates(scored)
            ranked, shadow_count = self._suppress_shadow_season_entries(ranked, hints)
            duplicate_summary["shadow_season_count"] = shadow_count
            ranked = self._rescore_eligible_candidates(
                search_title, queries, candidates, ranked, hints,
            )
            scored.sort(key=lambda item: (item["score"], item.get("popularity") or 0), reverse=True)
            ranked, decisive = self._apply_decisive_year_evidence(ranked, hints)
            ranked, shared_decisive = self._apply_shared_recognition_evidence(ranked)
            ranked, policy_decisive = self._promote_policy_candidate(
                ranked, scored, candidate_policy,
            )
            decisive = policy_decisive or shared_decisive or decisive
            best = ranked[0] if ranked else None
            runner_up = ranked[1] if len(ranked) > 1 else None
            margin = round(best["score"] - runner_up["score"], 2) if best and runner_up else (100.0 if best else 0.0)
            raw_margin = margin
            if decisive and margin < 0:
                margin = 0.0
            policy_override = bool(policy_decisive and best)
            shared_override = bool(best and best.get("shared_recognition"))
            margin_waived = bool(
                policy_override or shared_override
                or (decisive and best and best["score"] >= minimum_score)
            )
            accepted = bool(
                best and (
                    policy_override or shared_override or (
                        best["score"] >= minimum_score
                        and (margin >= minimum_margin or margin_waived)
                    )
                )
            )

        candidate_sources = self._candidate_source_summary()
        if not best:
            if candidate_policy.get("excluded_count"):
                reason = "本次 TMDB 候选均命中排除名单，已按用户规则拒绝"
            elif type_constraint.get("active") and type_constraint.get("removed_count"):
                reason = (
                    f"类型约束为{type_constraint['label']}，TMDB 返回的候选均为其他类型，已安全拒绝"
                )
            elif release_group_preference.get("active") and release_group_preference.get("removed_count"):
                reason = (
                    f"制作组标记为{release_group_preference['label']}，TMDB 返回的候选均与该题材冲突，已安全拒绝"
                )
            else:
                if web_search.get("attempted"):
                    reason = "TMDB、MP 共享识别与搜索引擎兜底均未返回可验证候选"
                elif candidate_sources.get("shared", {}).get("attempted"):
                    reason = "TMDB Multi/类型专用搜索与 MP 共享识别均未返回候选"
                else:
                    reason = "所有 TMDB 搜索词均未返回候选"
        elif policy_decisive:
            reason = policy_decisive["reason"]
        elif best.get("shared_recognition"):
            reason = (
                f"TMDB 直接搜索无候选，MoviePilot 共享识别命中 TMDB {best['tmdb_id']}；"
                "类型与用户排除规则检查通过"
            )
        elif best["score"] < minimum_score:
            reason = f"最佳候选 {best['score']} 分，低于阈值 {minimum_score:g}"
        elif decisive:
            reason = decisive["reason"]
        elif margin < minimum_margin:
            reason = f"前两名仅相差 {margin:g} 分，低于分差阈值 {minimum_margin:g}"
        elif best.get("web_evidence", 0) >= float(self._config["web_search_min_evidence"]):
            reason = f"搜索引擎交叉证据通过，得分 {best['score']}，领先 {margin:g} 分"
        elif best.get("query_evidence", {}).get("unique") \
                and best.get("query_evidence", {}).get("query_index") == 0:
            reason = f"完整标题唯一命中 TMDB 候选，得分 {best['score']}，领先 {margin:g} 分"
        else:
            reason = f"最佳候选通过阈值，得分 {best['score']}，领先 {margin:g} 分"

        self._enrich_selected_candidate(best)
        result = {
            "accepted": accepted,
            "selection_mode": "scored",
            "title": title,
            "search_title": search_title,
            "reason": reason,
            "queries": queries,
            "hints": self._serialize_hints(hints),
            "best": best,
            "runner_up": runner_up,
            "margin": margin,
            "raw_margin": raw_margin,
            "margin_waived": margin_waived,
            "decisive_evidence": decisive,
            "duplicate_summary": duplicate_summary,
            "candidate_policy": candidate_policy,
            "web_search": web_search,
            "type_constraint": type_constraint,
            "release_group_preference": release_group_preference,
            "candidate_sources": candidate_sources,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "cross_id": cross_id,
        }
        if include_candidates:
            result["candidates"] = [*scored, *excluded_scored]
        return result

    def _recognize_by_anime_cross_id(
            self,
            title: str,
            hints: Dict[str, Any],
            include_candidates: bool = False,
    ) -> Dict[str, Any]:
        """先用确定的跨站 ID 映射；不唯一或找不到时明确回落原 TMDB 链。"""
        base = {
            "accepted": False,
            "attempted": False,
            "selection_mode": "cross_id",
            "reason": "动画跨站 ID 数据库未启用",
        }
        if not self._config.get("anime_cross_id_enabled", True):
            return base
        release_kind = str(
            (hints.get("release_group_profile") or {}).get("kind") or ""
        )
        if release_kind == "live_action":
            return {
                **base,
                "reason": "制作组已明确标记为真人电视剧，跳过动画跨站数据库",
            }
        database = self._anime_cross_id
        if database is None or not database.status().get("ready"):
            return {
                **base,
                "attempted": True,
                "reason": "动画跨站 ID 数据库尚未就绪，继续使用 TMDB 搜索",
            }

        lookup = database.lookup(
            title=title,
            original_title=hints.get("original_title"),
            anilist_id=hints.get("anilist_id"),
            bangumi_id=hints.get("bangumi_id"),
            anidb_id=hints.get("anidb_id"),
            # 季集文件中的年份通常是本季播出年，不拿它筛选 Series 身份。
            media_type=hints.get("media_type"),
        )
        source = "local"
        if (
                not lookup.get("accepted")
                and self._config.get("anime_cross_id_anilist_resolver_enabled", True)
        ):
            resolved = self._resolve_anilist_identity(title)
            if resolved.get("anilist_id"):
                lookup = database.lookup(
                    anilist_id=resolved["anilist_id"],
                    media_type=hints.get("media_type"),
                )
                lookup["anilist_resolution"] = resolved
                source = "anilist"

        if not lookup.get("accepted"):
            return {
                **base,
                "attempted": True,
                "reason": (
                    f"{lookup.get('reason') or '跨站身份未唯一确定'}，继续使用 TMDB 搜索"
                ),
                "lookup": lookup,
            }

        tmdb_id = self._safe_int(lookup.get("tmdb_id"), 0)
        if tmdb_id in set(self._config.get("tmdb_exclude_ids") or []):
            return {
                **base,
                "attempted": True,
                "reason": f"跨站映射命中 TMDB {tmdb_id}，但该 ID 在排除名单中",
                "lookup": lookup,
            }
        media_type = self._normalize_media_type(lookup.get("media_type"))
        if not tmdb_id or not media_type:
            return {
                **base,
                "attempted": True,
                "reason": "跨站映射缺少有效 TMDB 类型或 ID，继续使用 TMDB 搜索",
                "lookup": lookup,
            }

        detail: Dict[str, Any] = {}
        try:
            detail = self._tmdb_client().get_info(
                mtype=media_type, tmdbid=tmdb_id,
            ) or {}
        except Exception as err:  # noqa: BLE001 - ID 映射本身仍有效
            logger.debug(f"[媒体整理增强] 跨站映射 TMDB 详情读取失败：{err}")
        record = lookup.get("record") or {}
        aliases = record.get("aliases") or []
        fallback_name = next(
            (value for value in aliases if re.search(r"[\u3400-\u9fff]", str(value))),
            record.get("title") or title,
        )
        name = (
            detail.get("name") or detail.get("title")
            or detail.get("original_name") or detail.get("original_title")
            or fallback_name
        )
        year = self._normalize_year(
            str(
                detail.get("first_air_date") or detail.get("release_date")
                or record.get("begin") or ""
            )[:4]
        )
        best = {
            "tmdb_id": tmdb_id,
            "name": name,
            "original_name": (
                detail.get("original_name") or detail.get("original_title")
                or record.get("title") or ""
            ),
            "year": year,
            "media_type": media_type.value,
            "score": 100.0,
            "diagnostic_score": 100.0,
            "matched_name": (
                (lookup.get("anilist_resolution") or {}).get("matched_title")
                or lookup.get("matched_title") or title
            ),
            "cross_id_source": source,
            "cross_id": {
                key: record.get(key) for key in (
                    "anilist_id", "bangumi_id", "anidb_id", "mal_id",
                )
            },
        }
        self._enrich_selected_candidate(best, detail=detail)
        result = {
            "accepted": True,
            "attempted": True,
            "selection_mode": "cross_id",
            "title": title,
            "search_title": title,
            "reason": (
                f"动画跨站 ID 精确映射命中 TMDB {tmdb_id}；"
                "无需执行 TMDB 标题模糊搜索"
            ),
            "queries": [],
            "hints": self._serialize_hints(hints),
            "best": best,
            "runner_up": None,
            "margin": 100.0,
            "raw_margin": 100.0,
            "candidate_sources": {
                "cross_id": {
                    "attempted": True, "source": source, "count": 1,
                }
            },
            "cross_id": {
                "source": source,
                "match_kind": lookup.get("match_kind") or "",
                "tmdb_id": tmdb_id,
                "media_type": media_type.value,
                **best["cross_id"],
            },
            "lookup": lookup,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        if include_candidates:
            result["candidates"] = [best]
        return result

    def _resolve_anilist_identity(self, title: str) -> Dict[str, Any]:
        """按严格标题同一性查 AniList ID；AniList 不直接决定 TMDB 候选。"""
        query_title = self._clean_title(title)
        cache_key = AnimeCrossIdDatabase.normalize_title(query_title)
        if not cache_key:
            return {}
        now = time.time()
        with self._anime_identity_cache_lock:
            cached = self._anime_identity_cache.get(cache_key) or {}
            cache_ttl = 86400 if cached.get("value") else 3600
            if now - self._safe_float(cached.get("cached_at"), 0) < cache_ttl:
                return deepcopy(cached.get("value") or {})

        query = """
        query($search:String){
          Page(page:1,perPage:10){
            media(type:ANIME,search:$search,isAdult:false,sort:SEARCH_MATCH){
              id title{romaji english native} synonyms format
            }
          }
        }
        """
        resolved: Dict[str, Any] = {}
        try:
            request = RequestUtils(
                headers={"User-Agent": "MoviePilot-MediaEnhancer/1.0"},
                proxies=self._valid_proxies(getattr(settings, "PROXY", None)),
                timeout=15,
            )
            tokens = re.findall(r"[A-Za-z0-9]+", query_title)
            search_terms = list(dict.fromkeys(filter(None, (
                query_title,
                " ".join(tokens[-4:]) if len(tokens) > 4 else "",
                " ".join(tokens[-3:]) if len(tokens) > 5 else "",
            ))))
            exact = []
            for search_term in search_terms:
                response = request.post_res(
                    "https://graphql.anilist.co",
                    json={"query": query, "variables": {"search": search_term}},
                )
                if not response:
                    continue
                response.raise_for_status()
                media = ((((response.json().get("data") or {}).get("Page") or {})
                          .get("media")) or [])
                for item in media:
                    if not isinstance(item, dict):
                        continue
                    titles = item.get("title") or {}
                    aliases = [
                        titles.get("romaji"), titles.get("english"), titles.get("native"),
                        *(item.get("synonyms") or []),
                    ]
                    matched = next((
                        str(alias) for alias in aliases
                        if alias and AnimeCrossIdDatabase.normalize_title(alias) == cache_key
                    ), "")
                    if matched:
                        exact.append({
                            "anilist_id": self._safe_int(item.get("id"), 0),
                            "matched_title": matched,
                            "format": item.get("format") or "",
                        })
                if exact:
                    break
            exact = [item for item in exact if item["anilist_id"]]
            if len({item["anilist_id"] for item in exact}) == 1:
                resolved = exact[0]
        except Exception as err:  # noqa: BLE001 - 失败后正常回落 TMDB
            logger.debug(f"[媒体整理增强] AniList 身份解析失败：{err}")
        with self._anime_identity_cache_lock:
            self._anime_identity_cache[cache_key] = {
                "cached_at": now, "value": deepcopy(resolved),
            }
            if len(self._anime_identity_cache) > 300:
                oldest = min(
                    self._anime_identity_cache,
                    key=lambda key: self._anime_identity_cache[key].get("cached_at", 0),
                )
                self._anime_identity_cache.pop(oldest, None)
        return resolved

    @staticmethod
    def _apply_shared_recognition_evidence(
            ranked: List[Dict[str, Any]],
    ) -> Tuple[List[Dict[str, Any]], Optional[Dict[str, Any]]]:
        """共享识别仅在直搜无候选时产生，命中后作为可解释的直接 ID 证据。"""
        selected = next((item for item in ranked if item.get("shared_recognition")), None)
        if not selected:
            return ranked, None
        selected["diagnostic_score"] = selected.get("score")
        selected["score"] = 100.0
        reordered = [selected, *(item for item in ranked if item is not selected)]
        return reordered, {
            "kind": "moviepilot-shared-recognition",
            "tmdb_id": selected.get("tmdb_id"),
            "reason": f"MoviePilot 共享识别命中 TMDB {selected.get('tmdb_id')}",
        }

    def _recognize_tmdb_first_result(
            self,
            title: str,
            hints: Dict[str, Any],
            include_candidates: bool,
    ) -> Dict[str, Any]:
        """独立执行一次 TMDB Multi Search，并直接采用第一个影视候选。"""
        query = self._clean_title(title)
        queries = [query] if query else []
        candidates = self._search_candidates(queries, hints)
        type_constraint = self._resolve_media_type_constraint(hints)
        candidates, type_constraint = self._filter_candidates_by_media_type(
            candidates, hints, type_constraint
        )
        candidates, excluded_candidates, candidate_policy = self._apply_tmdb_candidate_policy(
            candidates,
        )
        candidates, release_group_preference = self._prefer_candidates_by_release_group(
            candidates, hints
        )
        candidates = self._attach_context_evidence(candidates, title)
        candidates = self._attach_episode_coordinate_evidence(candidates, hints)
        candidates.sort(
            key=lambda item: (
                int(self._safe_int(item.get("id"), 0) == candidate_policy.get("preferred_id")),
                self._safe_float(item.get("_context_priority"), 0.0),
            ),
            reverse=True,
        )
        diagnostics = [self._score_candidate(title, queries, item, hints) for item in candidates]
        excluded_diagnostics = [
            self._score_candidate(title, queries, item, hints)
            for item in excluded_candidates
        ]
        for candidate in excluded_diagnostics:
            candidate["suppressed_by_exclusion"] = True
        best = diagnostics[0] if diagnostics else None
        runner_up = diagnostics[1] if len(diagnostics) > 1 else None
        if best:
            # 评分仅保留为诊断信息，不参与该模式的选择。
            best["diagnostic_score"] = best.get("score")
            best["score"] = 100.0
            self._enrich_selected_candidate(best)
        candidate_sources = self._candidate_source_summary()
        result = {
            "accepted": bool(best),
            "selection_mode": "tmdb_first",
            "title": title,
            "reason": (
                (
                    f"候选命中 TMDB 优先名单 #{candidate_policy['preferred_id']}，已直接选择；"
                    if candidate_policy.get("preferred_found") else
                    f"TMDB 直搜无候选，MoviePilot 共享识别命中 #{best['tmdb_id']}；"
                    if best and best.get("shared_recognition") else
                    f"单次 TMDB Multi Search 已直接采用第一个{type_constraint.get('label') or '影视'}结果；"
                )
                + (
                    f"制作组标记为{release_group_preference['label']}，已按题材约束筛选候选"
                    + (
                        f"并排除 {release_group_preference.get('removed_count', 0)} 个冲突项；"
                        if release_group_preference.get("removed_count") else "；"
                    )
                    if release_group_preference.get("applied") else ""
                )
                + (
                    "季度目录或近期识别记忆已调整候选优先级；"
                    if best and self._safe_float(best.get("context_priority"), 0) > 0 else ""
                )
                + "评分与分差未参与决策"
                if best else (
                    "本次 TMDB 候选均命中排除名单，已按用户规则拒绝"
                    if candidate_policy.get("excluded_count") else
                    f"类型约束为{type_constraint['label']}，TMDB 未返回该类型候选"
                    if type_constraint.get("active") else
                    f"制作组标记为{release_group_preference['label']}，TMDB 候选均与该题材冲突"
                    if release_group_preference.get("active") and release_group_preference.get("removed_count") else
                    "TMDB Multi/类型专用搜索与可选 MP 共享识别均未返回候选"
                )
            ),
            "queries": queries,
            "hints": self._serialize_hints(hints),
            "best": best,
            "runner_up": runner_up,
            "margin": 0.0,
            "web_search": {"attempted": False, "reason": "首结果模式不执行外部兜底"},
            "type_constraint": type_constraint,
            "release_group_preference": release_group_preference,
            "candidate_policy": candidate_policy,
            "candidate_sources": candidate_sources,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        if include_candidates:
            result["candidates"] = [*diagnostics, *excluded_diagnostics]
        return result

    def _prefer_candidates_by_release_group(
            self, candidates: List[Dict[str, Any]], hints: Dict[str, Any]
    ) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """把用户明确分类的制作组作为题材硬约束，未知题材候选保守保留。"""
        profile = hints.get("release_group_profile") or {}
        kind = str(profile.get("kind") or "unknown")
        summary = {
            "active": kind in ("animation", "live_action"),
            "applied": False,
            "kind": kind,
            "label": "动漫" if kind == "animation" else (
                "真人电视剧" if kind == "live_action" else "未分类"
            ),
            "release_group": profile.get("release_group") or "",
            "hard_constraint": True,
            "matching_count": 0,
            "unknown_count": 0,
            "removed_count": 0,
        }
        if not summary["active"] or not candidates:
            return candidates, summary

        preferred: List[Dict[str, Any]] = []
        unknown: List[Dict[str, Any]] = []
        conflicting: List[Dict[str, Any]] = []
        for candidate in candidates:
            genre_ids = {
                self._safe_int(item.get("id") if isinstance(item, dict) else item, 0)
                for item in (candidate.get("genres") or candidate.get("genre_ids") or [])
            }
            genre_ids.discard(0)
            if not genre_ids:
                unknown.append(candidate)
                continue
            is_animation = 16 in genre_ids
            matched = (kind == "animation" and is_animation) or (kind == "live_action" and not is_animation)
            (preferred if matched else conflicting).append(candidate)
        summary["matching_count"] = len(preferred)
        summary["unknown_count"] = len(unknown)
        summary["removed_count"] = len(conflicting)
        filtered = [*preferred, *unknown]
        summary["applied"] = bool(conflicting) or bool(
            filtered and filtered[0] is not candidates[0]
        )
        # 已知一致项始终排在缺少 genre 信息的候选之前；明确冲突项不再进入评分、
        # 人工优先和分差计算。若 TMDB 尚未提供 genre，则保守保留，避免误杀。
        return filtered, summary

    def _resolve_media_type_constraint(self, hints: Dict[str, Any]) -> Dict[str, Any]:
        """把明确类型或季集坐标转成候选硬约束，避免电视剧被电影候选截胡。"""
        requested_type = self._normalize_media_type(hints.get("media_type"))
        source = str(hints.get("media_type_source") or "").strip()
        has_coordinates = any(
            hints.get(key) not in (None, "") for key in ("season", "episode")
        )
        if has_coordinates and source != "manual" and requested_type != MediaType.TV:
            requested_type = MediaType.TV
            hints["media_type"] = requested_type
            source = "season_episode"
            hints["media_type_source"] = source
        elif requested_type:
            hints["media_type"] = requested_type
            source = source or "provided"
        elif has_coordinates:
            requested_type = MediaType.TV
            hints["media_type"] = requested_type
            source = "season_episode"
            hints["media_type_source"] = source
        label = "电视剧" if requested_type == MediaType.TV else (
            "电影" if requested_type == MediaType.MOVIE else ""
        )
        return {
            "active": bool(requested_type),
            "media_type": requested_type.value if requested_type else "",
            "label": label,
            "source": source,
            "inferred": source == "season_episode",
            "removed_count": 0,
        }

    def _filter_candidates_by_media_type(
            self,
            candidates: List[Dict[str, Any]],
            hints: Dict[str, Any],
            constraint: Optional[Dict[str, Any]] = None,
    ) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """在评分和首结果选择之前剔除与明确媒体类型冲突的候选。"""
        constraint = dict(constraint or self._resolve_media_type_constraint(hints))
        requested_type = self._normalize_media_type(constraint.get("media_type"))
        if not requested_type:
            return candidates, constraint
        filtered = [
            candidate for candidate in candidates
            if self._normalize_media_type(candidate.get("media_type")) == requested_type
        ]
        constraint["removed_count"] = max(
            self._safe_int(constraint.get("removed_count"), 0),
            len(candidates) - len(filtered),
        )
        constraint["candidate_count"] = len(filtered)
        return filtered, constraint

    def _apply_tmdb_candidate_policy(
            self, candidates: List[Dict[str, Any]]
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], Dict[str, Any]]:
        """先排除禁用 ID，再确定本轮实际出现的首个人工优先 ID。"""
        excluded_ids = {
            self._safe_int(value, 0) for value in self._config.get("tmdb_exclude_ids") or []
        }
        excluded_ids.discard(0)
        prefer_ids = [
            self._safe_int(value, 0) for value in self._config.get("tmdb_prefer_ids") or []
            if self._safe_int(value, 0) not in excluded_ids
        ]
        allowed: List[Dict[str, Any]] = []
        excluded: List[Dict[str, Any]] = []
        for candidate in candidates:
            tmdb_id = self._safe_int(candidate.get("id"), 0)
            if tmdb_id in excluded_ids:
                candidate["_policy_excluded"] = True
                excluded.append(candidate)
            else:
                allowed.append(candidate)
        available_ids = {self._safe_int(item.get("id"), 0) for item in allowed}
        preferred_id = next((value for value in prefer_ids if value in available_ids), 0)
        return allowed, excluded, {
            "active": bool(excluded_ids or prefer_ids),
            "excluded_count": len(excluded),
            "excluded_ids": [self._safe_int(item.get("id"), 0) for item in excluded],
            "preferred_id": preferred_id or None,
            "preferred_found": bool(preferred_id),
        }

    @staticmethod
    def _promote_policy_candidate(
            ranked: List[Dict[str, Any]],
            scored: List[Dict[str, Any]],
            policy: Dict[str, Any],
    ) -> Tuple[List[Dict[str, Any]], Optional[Dict[str, Any]]]:
        """把人工优先候选提升为最终第一名，不受去重代表项影响。"""
        preferred_id = policy.get("preferred_id")
        if not preferred_id:
            return ranked, None
        selected = next(
            (item for item in scored if item.get("tmdb_id") == preferred_id), None,
        )
        if not selected:
            return ranked, None
        previous_duplicate = selected.get("duplicate_of")
        if previous_duplicate:
            former = next(
                (item for item in scored if item.get("tmdb_id") == previous_duplicate), None,
            )
            if former:
                former["suppressed_as_duplicate"] = True
                former["duplicate_of"] = preferred_id
                former["suppressed_reason"] = (
                    f"用户优先名单明确选择 TMDB {preferred_id} 作为同作品代表项"
                )
        selected.pop("suppressed_as_duplicate", None)
        selected.pop("duplicate_of", None)
        selected.pop("suppressed_reason", None)
        selected.pop("suppressed_as_shadow_season", None)
        selected["preferred_by_policy"] = True
        promoted = [selected, *(
            item for item in ranked if item.get("tmdb_id") != preferred_id
        )]
        return promoted, {
            "kind": "tmdb-prefer-list",
            "tmdb_id": preferred_id,
            "reason": f"候选命中 TMDB 优先名单 #{preferred_id}，已按用户规则直接选择",
        }

    def _search_candidates(
            self,
            queries: List[str],
            hints: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """合并 TMDB Multi、类型专用搜索与可选共享识别候选。"""
        tmdb_api = self._tmdb_client()
        hints = hints or {}
        candidate_limit = int(self._config["candidate_limit"])
        collected: Dict[Tuple[str, int], Dict[str, Any]] = {}
        requested_type = self._normalize_media_type(hints.get("media_type"))
        source_summary = {
            "multi": {"attempted": 0, "candidate_count": 0},
            "typed": {
                "attempted": 0,
                "candidate_count": 0,
                "media_type": requested_type.value if requested_type else "",
            },
            "shared": self._empty_shared_summary(),
        }
        for query_index, query in enumerate(queries):
            search_batches = [("tmdb_multi", tmdb_api.search_multiis(query) or [])]
            source_summary["multi"]["attempted"] += 1
            typed_results = self._search_typed_candidates(query, requested_type, hints)
            if requested_type:
                source_summary["typed"]["attempted"] += 1
                typed_source = "tmdb_tv" if requested_type == MediaType.TV else "tmdb_movie"
                search_batches.append((typed_source, typed_results))

            for source, results in search_batches:
                valid_results = []
                for raw in results:
                    media_type = self._normalize_media_type(raw.get("media_type"))
                    tmdb_id = self._safe_int(raw.get("id"), 0)
                    if not media_type or not tmdb_id:
                        continue
                    valid_results.append((raw, media_type, tmdb_id))
                    if len(valid_results) >= candidate_limit:
                        break
                result_count = len(valid_results)
                summary_key = "multi" if source == "tmdb_multi" else "typed"
                source_summary[summary_key]["candidate_count"] += result_count
                for rank, (raw, media_type, tmdb_id) in enumerate(valid_results):
                    key = (media_type.value, tmdb_id)
                    candidate = collected.setdefault(key, dict(raw))
                    hits = candidate.setdefault("_query_hits", [])
                    hits.append({
                        "query": query,
                        "query_index": query_index,
                        "rank": rank,
                        "result_count": result_count,
                        "source": source,
                    })

        if not collected and queries:
            shared_candidate, shared_summary = self._search_shared_candidate(
                queries[0], hints,
            )
            source_summary["shared"] = shared_summary
            if shared_candidate:
                media_type = self._normalize_media_type(shared_candidate.get("media_type"))
                tmdb_id = self._safe_int(shared_candidate.get("id"), 0)
                if media_type and tmdb_id:
                    collected[(media_type.value, tmdb_id)] = shared_candidate

        self._preview_state.candidate_sources = source_summary

        ordered = sorted(
            collected.values(),
            key=lambda item: min(
                (hit["query_index"], hit["rank"]) for hit in item.get("_query_hits", [])
            ),
        )
        needs_coordinate_detail = bool(
            requested_type == MediaType.TV
            and self._safe_int(hints.get("season"), 0) > 0
        )
        if self._config.get("fetch_aliases") or needs_coordinate_detail:
            for candidate in ordered[: int(self._config["detail_limit"])]:
                media_type = self._normalize_media_type(candidate.get("media_type"))
                try:
                    detail = self._tmdb_api.get_info(media_type, int(candidate["id"])) or {}
                    hits = candidate.get("_query_hits", [])
                    candidate.update(detail)
                    candidate["_query_hits"] = hits
                except Exception as err:
                    logger.debug(f"[TMDB识别增强] 获取 TMDB {candidate.get('id')} 详情失败：{err}")
        return ordered

    def _attach_episode_coordinate_evidence(
            self,
            candidates: List[Dict[str, Any]],
            hints: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        """为前排电视剧候选补充独立于目标编集规则的季集存在性证据。"""
        requested_season = self._safe_int(hints.get("season"), 0)
        if requested_season <= 0:
            return candidates
        requested_episode = self._optional_int(hints.get("episode"))
        detail_limit = max(1, int(self._config.get("detail_limit") or 1))
        checked = 0
        for candidate in candidates:
            if self._normalize_media_type(candidate.get("media_type")) != MediaType.TV:
                continue
            if checked >= detail_limit:
                break
            checked += 1
            tmdb_id = self._safe_int(candidate.get("id"), 0)
            if not tmdb_id:
                continue
            detail = candidate if candidate.get("seasons") or candidate.get("episode_groups") else None
            try:
                candidate["_season_coordinate_evidence"] = self._normalizer().coordinate_evidence(
                    tmdb_id=tmdb_id,
                    season=requested_season,
                    episode=requested_episode,
                    info=detail,
                )
            except Exception as err:
                logger.debug(f"[TMDB识别增强] TMDB {tmdb_id} 季集证据检查失败：{err}")
        return candidates

    def _rescore_eligible_candidates(
            self,
            original_title: str,
            queries: List[str],
            candidates: List[Dict[str, Any]],
            ranked: List[Dict[str, Any]],
            hints: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        """候选硬过滤与重复项归并后，按剩余候选重新计算有效排名分。"""
        surviving_keys = {
            (str(item.get("media_type") or ""), self._safe_int(item.get("tmdb_id"), 0))
            for item in ranked
        }
        raw_by_key = {
            (
                (media_type.value if media_type else ""),
                self._safe_int(item.get("id"), 0),
            ): item
            for item in candidates
            if (media_type := self._normalize_media_type(item.get("media_type")))
        }
        survivors = [
            raw_by_key[key] for key in surviving_keys
            if key in raw_by_key
        ]
        for candidate in survivors:
            candidate.pop("_eligible_rank", None)
        hit_groups: Dict[Tuple[int, str], List[Tuple[Dict[str, Any], Dict[str, Any]]]] = {}
        for candidate in survivors:
            for hit in candidate.get("_query_hits") or []:
                group_key = (
                    self._safe_int(hit.get("query_index"), 99),
                    str(hit.get("source") or "tmdb"),
                )
                hit_groups.setdefault(group_key, []).append((candidate, hit))
        for entries in hit_groups.values():
            entries.sort(key=lambda value: self._safe_int(value[1].get("rank"), 99))
            for effective_rank, (candidate, _) in enumerate(entries):
                previous = candidate.get("_eligible_rank")
                if previous is None or effective_rank < self._safe_int(previous, 99):
                    candidate["_eligible_rank"] = effective_rank

        rescored = {}
        for candidate in survivors:
            media_type = self._normalize_media_type(candidate.get("media_type"))
            key = (
                media_type.value if media_type else "",
                self._safe_int(candidate.get("id"), 0),
            )
            rescored[key] = self._score_candidate(original_title, queries, candidate, hints)
        for item in ranked:
            key = (str(item.get("media_type") or ""), self._safe_int(item.get("tmdb_id"), 0))
            updated = rescored.get(key)
            if updated:
                item.clear()
                item.update(updated)
        ranked.sort(key=lambda item: (item["score"], item.get("popularity") or 0), reverse=True)
        return ranked

    def _search_typed_candidates(
            self,
            query: str,
            requested_type: Optional[MediaType],
            hints: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        """已知媒体类型时调用 TMDB 专用搜索，补回 Multi 首页遗漏候选。"""
        if not requested_type or not getattr(self._tmdb_api, "search", None):
            return []
        effective_year = self._effective_series_year(hints)
        try:
            if requested_type == MediaType.TV:
                kwargs = {"term": query}
                if effective_year:
                    kwargs["release_year"] = effective_year
                results = self._tmdb_api.search.tv_shows(**kwargs) or []
            elif requested_type == MediaType.MOVIE:
                kwargs = {"term": query}
                if effective_year:
                    kwargs["year"] = effective_year
                results = self._tmdb_api.search.movies(**kwargs) or []
            else:
                return []
        except Exception as err:
            logger.debug(f"[TMDB识别增强] TMDB 类型专用搜索失败：{err}")
            return []
        normalized = []
        for item in results:
            candidate = dict(item)
            candidate["media_type"] = requested_type
            normalized.append(candidate)
        return normalized

    def _search_shared_candidate(
            self,
            title: str,
            hints: Dict[str, Any],
    ) -> Tuple[Optional[Dict[str, Any]], Dict[str, Any]]:
        """TMDB 无候选时查询 MoviePilot 共享识别，并取回对应 TMDB 详情。"""
        summary = self._empty_shared_summary()
        if not self._config.get("shared_recognition_enabled", True):
            summary["reason"] = "插件设置已关闭"
            return None, summary
        if MoviePilotServerHelper is None:
            summary["reason"] = "当前 MoviePilot 不提供共享识别接口"
            return None, summary
        if not bool(getattr(settings, "MEDIA_RECOGNIZE_SHARE", False)):
            summary["reason"] = "MoviePilot 全局共享识别已关闭"
            return None, summary

        media_type = self._normalize_media_type(hints.get("media_type"))
        season = self._optional_int(hints.get("season"))
        year = self._normalize_year(hints.get("year"))
        variants = [year]
        if media_type == MediaType.TV and season and season > 1 and year:
            variants.append(None)
        summary.update({
            "available": True,
            "attempted": True,
            "media_type": media_type.value if media_type else "",
        })
        for query_year in dict.fromkeys(variants):
            try:
                meta = MetaInfo(title)
                meta.original_name = title
                meta.name = title
                if media_type:
                    meta.type = media_type
                meta.year = str(query_year) if query_year else None
                meta.begin_season = season
                item = MoviePilotServerHelper.query_recognize_share(
                    meta=meta,
                    mtype=media_type,
                    keyword_meta=meta,
                )
                params = MoviePilotServerHelper.to_recognize_params(item)
            except Exception as err:
                logger.debug(f"[TMDB识别增强] MoviePilot 共享识别查询失败：{err}")
                summary["reason"] = "共享识别请求失败"
                continue
            tmdb_id = self._safe_int((params or {}).get("tmdbid"), 0)
            shared_type = self._normalize_media_type((params or {}).get("mtype")) or media_type
            if not tmdb_id or not shared_type:
                continue
            try:
                detail = self._tmdb_api.get_info(shared_type, tmdb_id) or {}
            except Exception as err:
                logger.debug(f"[TMDB识别增强] 共享候选 TMDB {tmdb_id} 详情失败：{err}")
                summary["reason"] = "共享结果详情读取失败"
                continue
            if not detail:
                continue
            detail.update({
                "id": tmdb_id,
                "media_type": shared_type,
                "_shared_recognition": True,
                "_query_hits": [{
                    "query": title,
                    "query_index": 0,
                    "rank": 0,
                    "result_count": 1,
                    "source": "moviepilot_share",
                }],
            })
            summary.update({
                "hit": True,
                "tmdb_id": tmdb_id,
                "query_year": query_year,
                "reason": "MoviePilot 共享识别命中",
            })
            return detail, summary
        if not summary.get("reason"):
            summary["reason"] = "共享识别未命中"
        return None, summary

    def _empty_shared_summary(self) -> Dict[str, Any]:
        """返回共享识别候选源的默认诊断状态。"""
        return {
            "enabled": bool(self._config.get("shared_recognition_enabled", True)),
            "available": False,
            "attempted": False,
            "hit": False,
            "tmdb_id": None,
            "reason": "仅在 TMDB 无候选时查询",
        }

    def _candidate_source_summary(self) -> Dict[str, Any]:
        """读取当前线程最近一次候选搜索的来源诊断。"""
        return deepcopy(getattr(self._preview_state, "candidate_sources", {}))

    def _apply_web_search_fallback(
            self,
            title: str,
            hints: Dict[str, Any],
            candidates: List[Dict[str, Any]],
    ) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """用稳定的 TMDB 直链结果发现 ID，并以原标题/别名共现进行验证。"""
        evidence_titles = list(dict.fromkeys(
            self._clean_title(value) for value in (title, hints.get("original_title"))
            if self._clean_title(value)
        ))[:2]
        queries = [f'"{value}" site:themoviedb.org' for value in evidence_titles]
        results: List[Dict[str, str]] = []
        for query in queries:
            for item in self._search_web(query):
                results.append({**item, "source_query": query})
        summary = {
            "attempted": True,
            "query": queries[0] if queries else "",
            "queries": queries,
            "engine": self._config.get("web_search_engine", "auto"),
            "result_count": len(results),
            "discovered": [],
            "evidence_candidates": 0,
        }
        if not results:
            return candidates, summary

        collected: Dict[Tuple[str, int], Dict[str, Any]] = {}
        for candidate in candidates:
            media_type = self._normalize_media_type(candidate.get("media_type"))
            tmdb_id = self._safe_int(candidate.get("id"), 0)
            if media_type and tmdb_id:
                collected[(media_type.value, tmdb_id)] = candidate

        requested_type = self._normalize_media_type(hints.get("media_type"))
        for rank, result in enumerate(results):
            reference = self._extract_tmdb_reference(result.get("url"))
            if not reference:
                continue
            media_type, tmdb_id = reference
            if requested_type and media_type != requested_type:
                continue
            key = (media_type.value, tmdb_id)
            if key in collected:
                continue
            try:
                detail = self._tmdb_api.get_info(media_type, tmdb_id) or {}
            except Exception as err:
                logger.debug(f"[TMDB识别增强] 搜索引擎候选 TMDB {tmdb_id} 详情失败：{err}")
                continue
            if not detail:
                continue
            detail["id"] = tmdb_id
            detail["media_type"] = media_type
            detail["_query_hits"] = [{
                "query": title,
                "query_index": 0,
                "rank": rank,
                "result_count": 0,
                "source": "web",
            }]
            detail["_web_discovered"] = True
            collected[key] = detail
            summary["discovered"].append(f"{media_type.value}:{tmdb_id}")

        minimum_evidence = float(self._config["web_search_min_evidence"])
        for candidate in collected.values():
            best_evidence = self._best_web_evidence(title, candidate, results)
            candidate["_web_match_score"] = best_evidence.get("score", 0.0)
            candidate["_web_evidence_title"] = best_evidence.get("title", "")
            candidate["_web_evidence_url"] = best_evidence.get("url", "")
            if candidate["_web_match_score"] >= minimum_evidence:
                summary["evidence_candidates"] += 1

        return list(collected.values()), summary

    def _search_web(self, query: str) -> List[Dict[str, str]]:
        """通过 MoviePilot 已使用的 DDGS 依赖搜索网络，失败时安全返回空列表。"""
        try:
            from ddgs import DDGS
        except ImportError:
            logger.warning("[TMDB识别增强] 未安装 ddgs，无法使用搜索引擎兜底")
            return []

        engine = str(self._config.get("web_search_engine") or "auto").strip().lower()
        backend = self._ddgs_auto_backend if engine == "auto" else engine
        cache_key = (backend, self._normalize_text(query))
        with self._web_cache_lock:
            cached = self._web_cache.get(cache_key)
            if cached is not None:
                return deepcopy(cached)
        kwargs: Dict[str, Any] = {"timeout": int(self._config["web_search_timeout"])}
        proxy = self._proxy_url(getattr(settings, "PROXY", None))
        if proxy:
            kwargs["proxy"] = proxy
        try:
            with DDGS(**kwargs) as ddgs:
                raw_results = ddgs.text(
                    query,
                    max_results=int(self._config["web_search_max_results"]),
                    backend=backend,
                ) or []
                results = [
                    {
                        "title": str(item.get("title") or "").strip(),
                        "snippet": str(item.get("body") or item.get("snippet") or "").strip(),
                        "url": str(item.get("href") or item.get("url") or "").strip(),
                    }
                    for item in raw_results
                    if isinstance(item, dict)
                ]
                with self._web_cache_lock:
                    self._web_cache[cache_key] = deepcopy(results)
                return results
        except Exception as err:
            logger.warning(f"[TMDB识别增强] 搜索引擎兜底失败：{err}")
            return []

    def _best_web_evidence(
            self,
            title: str,
            candidate: Dict[str, Any],
            results: List[Dict[str, str]],
    ) -> Dict[str, Any]:
        """计算罗马音标题与 TMDB 候选别名在同一搜索结果中的共现强度。"""
        query_tokens = self._significant_tokens(title)
        if len(query_tokens) < 2:
            return {"score": 0.0}
        aliases = self._candidate_aliases(candidate)
        best = {"score": 0.0, "title": "", "url": ""}
        candidate_type = self._normalize_media_type(candidate.get("media_type"))
        candidate_id = self._safe_int(candidate.get("id"), 0)
        direct_occurrences = sum(
            self._extract_tmdb_reference(item.get("url")) == (candidate_type, candidate_id)
            for item in results
        )

        for rank, result in enumerate(results):
            text = f"{result.get('title', '')} {result.get('snippet', '')}".strip()
            text_tokens = set(self._significant_tokens(text))
            if not text_tokens:
                continue
            query_coverage = len(set(query_tokens) & text_tokens) / len(set(query_tokens))
            alias_coverage = 0.0
            for alias in aliases:
                alias_tokens = self._significant_tokens(alias)
                if len(alias_tokens) < 2:
                    continue
                coverage = len(set(alias_tokens) & text_tokens) / len(set(alias_tokens))
                alias_coverage = max(alias_coverage, coverage)

            direct_reference = self._extract_tmdb_reference(result.get("url"))
            direct_match = bool(
                direct_reference and direct_reference == (candidate_type, candidate_id)
            )
            if not direct_match:
                # 普通网页中的同名文本不具备稳定身份，禁止给候选加证据。
                continue
            if query_coverage >= 0.55 and alias_coverage >= 0.45:
                score = (query_coverage * 0.45 + alias_coverage * 0.55) * 100
                score += 4.0 + min(8.0, max(0, direct_occurrences - 1) * 4.0)
                score -= rank * 3.0
            else:
                # 仅有搜索排名而无罗马音/别名共现时，不足以越过默认外部证据阈值。
                score = 60.0 - rank * 4.0
            score = round(max(0.0, min(score, 98.0)), 2)
            if score > best["score"]:
                best = {"score": score, "title": result.get("title", ""), "url": result.get("url", "")}
        return best

    @classmethod
    def _significant_tokens(cls, value: Any) -> List[str]:
        """移除罗马音助词、英文停用词和搜索噪声词。"""
        return [
            token for token in cls._tokens(value)
            if token not in cls._web_stop_tokens
            and (len(token) > 1 or bool(re.fullmatch(r"[\u3400-\u9fff]", token)))
        ]

    @classmethod
    def _extract_tmdb_reference(cls, value: Any) -> Optional[Tuple[MediaType, int]]:
        """从普通链接或搜索引擎跳转链接中提取 TMDB 类型和 ID。"""
        match = cls._tmdb_url_pattern.search(unquote(str(value or "")))
        if not match:
            return None
        media_type = MediaType.TV if match.group(1).lower() == "tv" else MediaType.MOVIE
        return media_type, int(match.group(2))

    @staticmethod
    def _proxy_url(proxy_setting: Any) -> Optional[str]:
        """兼容 MoviePilot 字典或字符串形式的代理配置。"""
        if isinstance(proxy_setting, dict):
            proxy_setting = proxy_setting.get("http") or proxy_setting.get("https")
        value = str(proxy_setting or "").strip()
        if not value:
            return None
        parsed = urlparse(value)
        return value if parsed.scheme and parsed.hostname else None

    @classmethod
    def _valid_proxies(cls, proxy_setting: Any) -> Optional[dict]:
        """过滤 http:// 这类没有主机的无效系统代理。"""
        if not isinstance(proxy_setting, dict):
            value = cls._proxy_url(proxy_setting)
            return {"http": value, "https": value} if value else None
        proxies = {
            key: value for key, raw in proxy_setting.items()
            if key in ("http", "https") and (value := cls._proxy_url(raw))
        }
        return proxies or None

    @staticmethod
    def _current_quarter_key(now: Optional[datetime] = None) -> str:
        """返回当前自然季度键，作为可配置近期季度窗口的起点。"""
        now = now or datetime.now()
        return f"{now.year}-Q{(now.month - 1) // 3 + 1}"

    @classmethod
    def _recent_quarter_keys(cls, current: str, count: int) -> List[str]:
        """从当前季度向前生成窗口；用于兼容跨季连载和上一季资源补整。"""
        match = re.fullmatch(r"(\d{4})-Q([1-4])", str(current or ""))
        if not match:
            return [current] if current else []
        year, quarter = int(match.group(1)), int(match.group(2))
        keys: List[str] = []
        for _ in range(max(1, min(4, count))):
            keys.append(f"{year}-Q{quarter}")
            quarter -= 1
            if quarter == 0:
                year -= 1
                quarter = 4
        return keys

    def _seasonal_candidate_evidence(
            self, candidate: Dict[str, Any], title: str,
            quarter: str = "", items: Optional[List[Dict[str, Any]]] = None,
            quarter_offset: int = 0,
    ) -> Dict[str, Any]:
        """用指定季度已缓存的 AniList→TMDB 映射提供无网络软证据。"""
        if not self._config.get("seasonal_evidence_enabled"):
            return {}
        tmdb_id = self._safe_int(candidate.get("id"), 0)
        if not tmdb_id:
            return {}
        quarter = quarter or self._current_quarter_key()
        if items is None:
            quarter_data = self._read_season_catalog_cache().get(quarter) or {}
            items = quarter_data.get("items") if isinstance(quarter_data, dict) else []
        best_match = None
        best_relation = 0.0
        for item in items or []:
            match = item.get("tmdb_match") or {}
            matched = match.get("best") or {}
            if not match.get("accepted") or self._safe_int(matched.get("tmdb_id"), 0) != tmdb_id:
                continue
            aliases = list(dict.fromkeys(value for value in (
                item.get("display_name"), item.get("name"), item.get("name_cn"),
                *(item.get("aliases") or []),
            ) if value))
            relations = []
            for alias in aliases:
                components = self._title_components(title, alias)
                relations.append(
                    components["token"] * .5
                    + components["similarity"] * .3
                    + components["prefix"] * .2
                )
            relation = max(relations, default=0.0)
            if relation > best_relation:
                best_relation = relation
                best_match = item
        if not best_match or best_relation < 55:
            return {}
        recency = max(.7, 1.0 - max(0, quarter_offset) * .08)
        return {
            "active": True,
            "component": round((100.0 if best_relation >= 72 else 82.0) * recency, 2),
            "quarter": quarter,
            "quarter_offset": max(0, quarter_offset),
            "title": best_match.get("display_name") or best_match.get("name_cn") or best_match.get("name"),
            "relation": round(best_relation, 2),
        }

    def _read_recognition_memory(self, prune: bool = True) -> Dict[str, Any]:
        """读取近期识别记忆，并按 TTL、数量上限清理异常或过期记录。"""
        with self._memory_lock:
            stored = self.get_data(self.DATA_KEY_RECOGNITION_MEMORY) or {}
            entries = stored.get("entries") if isinstance(stored, dict) else {}
            entries = deepcopy(entries) if isinstance(entries, dict) else {}
            if not prune:
                return {"entries": entries}
            now = datetime.now().timestamp()
            ttl_seconds = int(self._config.get("recognition_memory_ttl_days") or 14) * 86400
            cleaned = {
                key: value for key, value in entries.items()
                if isinstance(value, dict)
                and now - self._safe_float(value.get("updated_at"), 0) <= ttl_seconds
            }
            ordered = sorted(
                cleaned.items(),
                key=lambda pair: self._safe_float(pair[1].get("updated_at"), 0),
                reverse=True,
            )[:300]
            normalized = {"entries": dict(ordered)}
            if len(entries) != len(ordered):
                self.save_data(self.DATA_KEY_RECOGNITION_MEMORY, normalized)
            return normalized

    def _memory_candidate_evidence(
            self, candidate: Dict[str, Any], title: str, memory: Dict[str, Any]
    ) -> Dict[str, Any]:
        """只对同一完整解析标题的领先历史目标加权，避免宽泛别名串片。"""
        if not self._config.get("recognition_memory_enabled"):
            return {}
        key = self._normalize_text(title)
        entry = (memory.get("entries") or {}).get(key) or {}
        targets = entry.get("targets") if isinstance(entry, dict) else {}
        if not isinstance(targets, dict) or not targets:
            return {}
        ranked = sorted(
            targets.values(),
            key=lambda value: (
                self._safe_int(value.get("count"), 0),
                self._safe_float(value.get("last_seen"), 0),
            ),
            reverse=True,
        )
        leader = ranked[0]
        leader_count = self._safe_int(leader.get("count"), 0)
        minimum_hits = int(self._config.get("recognition_memory_min_hits") or 3)
        if leader_count < minimum_hits:
            return {}
        if len(ranked) > 1 and self._safe_int(ranked[1].get("count"), 0) == leader_count:
            return {}
        candidate_id = self._safe_int(candidate.get("id"), 0)
        candidate_type = self._normalize_media_type(candidate.get("media_type"))
        leader_type = self._normalize_media_type(leader.get("media_type"))
        if candidate_id != self._safe_int(leader.get("tmdb_id"), 0) or candidate_type != leader_type:
            return {}
        total = sum(max(0, self._safe_int(value.get("count"), 0)) for value in ranked)
        share = leader_count / max(total, 1)
        now = datetime.now().timestamp()
        ttl_seconds = int(self._config.get("recognition_memory_ttl_days") or 14) * 86400
        age_seconds = max(0.0, now - self._safe_float(leader.get("last_seen"), now))
        freshness = max(0.0, 1.0 - age_seconds / max(ttl_seconds, 1))
        component = 100.0 * share * (.6 + .4 * freshness)
        return {
            "active": True,
            "component": round(component, 2),
            "hits": leader_count,
            "total_hits": total,
            "share": round(share * 100, 1),
            "age_days": round(age_seconds / 86400, 1),
            "ttl_days": int(self._config.get("recognition_memory_ttl_days") or 14),
        }

    def _attach_context_evidence(
            self, candidates: List[Dict[str, Any]], title: str
    ) -> List[Dict[str, Any]]:
        """一次读取上下文，将近期季度目录与识别记忆注入候选。"""
        memory = self._read_recognition_memory() if self._config.get("recognition_memory_enabled") else {"entries": {}}
        quarter = self._current_quarter_key()
        quarter_windows: List[Tuple[str, List[Dict[str, Any]]]] = []
        if self._config.get("seasonal_evidence_enabled"):
            cache = self._read_season_catalog_cache()
            window_size = self._safe_int(
                self._config.get("seasonal_evidence_quarters"), 2,
            )
            for quarter_key in self._recent_quarter_keys(quarter, window_size):
                quarter_data = cache.get(quarter_key) or {}
                items = quarter_data.get("items") if isinstance(quarter_data, dict) else []
                quarter_windows.append((quarter_key, items or []))
        for candidate in candidates:
            seasonal_matches = [
                self._seasonal_candidate_evidence(
                    candidate, title, quarter=quarter_key, items=items,
                    quarter_offset=index,
                )
                for index, (quarter_key, items) in enumerate(quarter_windows)
            ]
            seasonal = max(
                (item for item in seasonal_matches if item.get("active")),
                key=lambda item: self._safe_float(item.get("component"), 0),
                default={},
            )
            recent = self._memory_candidate_evidence(candidate, title, memory)
            candidate["_seasonal_evidence"] = seasonal
            candidate["_memory_evidence"] = recent
            candidate["_context_priority"] = round(
                self._safe_float(seasonal.get("component"), 0)
                * self._safe_float(self._config.get("seasonal_evidence_weight"), 0)
                + self._safe_float(recent.get("component"), 0)
                * self._safe_float(self._config.get("recognition_memory_weight"), 0),
                2,
            )
        return candidates

    def _score_candidate(
            self,
            original_title: str,
            queries: List[str],
            candidate: Dict[str, Any],
            hints: Dict[str, Any],
    ) -> Dict[str, Any]:
        """计算单个候选的标题、排名和元数据综合得分。"""
        aliases = self._candidate_aliases(candidate)
        original_normalized = self._normalize_text(original_title)
        anchor_titles = list(dict.fromkeys(value for value in (
            original_title,
            self._clean_title(hints.get("original_title")),
        ) if value))
        anchor_components = {"token": 0.0, "similarity": 0.0, "prefix": 0.0, "matched_name": ""}
        for anchor_title in anchor_titles:
            for alias in aliases:
                components = self._title_components(anchor_title, alias)
                value = components["token"] * .45 + components["similarity"] * .35 + components["prefix"] * .2
                previous = (
                    anchor_components["token"] * .45 + anchor_components["similarity"] * .35
                    + anchor_components["prefix"] * .2
                )
                if value > previous:
                    anchor_components = {**components, "matched_name": alias}
        anchor_score = round(
            anchor_components["token"] * .45 + anchor_components["similarity"] * .35
            + anchor_components["prefix"] * .2,
            2,
        )
        exact_original = any(
            self._normalize_text(alias) == self._normalize_text(anchor)
            for anchor in anchor_titles for alias in aliases
        ) if original_normalized else False
        best_components = {"token": 0.0, "similarity": 0.0, "prefix": 0.0, "matched_name": ""}
        for query in queries:
            for alias in aliases:
                components = self._title_components(query, alias)
                if (
                        components["token"] + components["similarity"] + components["prefix"]
                        > best_components["token"] + best_components["similarity"] + best_components["prefix"]
                ):
                    best_components = {**components, "matched_name": alias}

        web_evidence = self._safe_float(candidate.get("_web_match_score"), 0.0)
        if web_evidence >= float(self._config["web_search_min_evidence"]):
            for component in ("token", "similarity", "prefix"):
                best_components[component] = max(best_components[component], web_evidence)
            best_components["matched_name"] = f"搜索引擎交叉证据：{candidate.get('_web_evidence_title') or original_title}"

        hits = candidate.get("_query_hits") or []
        tmdb_hits = [
            hit for hit in hits
            if str(hit.get("source") or "tmdb").startswith("tmdb")
            or hit.get("source") == "moviepilot_share"
        ]
        best_rank = min((hit.get("rank", 0) for hit in tmdb_hits), default=int(self._config["candidate_limit"]))
        eligible_rank = self._safe_int(candidate.get("_eligible_rank"), best_rank)
        rank_component = max(
            0.0,
            100.0 - eligible_rank * (100.0 / max(int(self._config["candidate_limit"]), 1)),
        )
        query_confidence, query_evidence = self._query_confidence(tmdb_hits)
        weighted = [
            (best_components["token"], float(self._config["token_weight"])),
            (best_components["similarity"], float(self._config["similarity_weight"])),
            (best_components["prefix"], float(self._config["prefix_weight"])),
            (rank_component, float(self._config["rank_weight"])),
            (query_confidence, float(self._config["query_confidence_weight"])),
            (anchor_score, float(self._config["anchor_weight"])),
        ]

        candidate_year = self._candidate_year(candidate)
        requested_year = self._effective_series_year(hints)
        year_hint_role = "series_first_air_year" if requested_year else (
            "episode_air_year_ignored"
            if self._normalize_year(hints.get("year")) else "not_provided"
        )
        year_component = None
        if requested_year:
            if candidate_year:
                gap = abs(int(candidate_year) - int(requested_year))
                year_component = 100.0 if gap == 0 else (70.0 if gap == 1 else 0.0)
            else:
                year_component = 25.0
            weighted.append((year_component, float(self._config["year_weight"])))

        candidate_type = self._normalize_media_type(candidate.get("media_type"))
        requested_type = self._normalize_media_type(hints.get("media_type"))
        type_component = None
        if requested_type:
            type_component = 100.0 if candidate_type == requested_type else 0.0
            weighted.append((type_component, float(self._config["type_weight"])))

        candidate_genre_ids = {
            genre_id for item in (candidate.get("genres") or candidate.get("genre_ids") or [])
            if (genre_id := self._safe_int(
                item.get("id") if isinstance(item, dict) else item, 0
            ))
        }
        release_group_component = None
        release_group_profile = hints.get("release_group_profile") or {}
        release_group_kind = str(release_group_profile.get("kind") or "unknown")
        if candidate_genre_ids and release_group_kind in ("animation", "live_action"):
            is_animation = 16 in candidate_genre_ids
            release_group_component = 100.0 if (
                (release_group_kind == "animation" and is_animation)
                or (release_group_kind == "live_action" and not is_animation)
            ) else 0.0
            weighted.append((
                release_group_component,
                float(self._config.get("release_group_type_weight") or 0),
            ))

        seasonal_evidence = candidate.get("_seasonal_evidence") or {}
        seasonal_component = self._safe_float(seasonal_evidence.get("component"), 0.0)
        if self._config.get("seasonal_evidence_enabled") and seasonal_component > 0:
            weighted.append((
                seasonal_component,
                float(self._config.get("seasonal_evidence_weight") or 0),
            ))

        memory_evidence = candidate.get("_memory_evidence") or {}
        memory_component = self._safe_float(memory_evidence.get("component"), 0.0)
        if self._config.get("recognition_memory_enabled") and memory_component > 0:
            weighted.append((
                memory_component,
                float(self._config.get("recognition_memory_weight") or 0),
            ))

        weight_total = sum(weight for _, weight in weighted if weight > 0)
        score = sum(value * weight for value, weight in weighted if weight > 0) / weight_total if weight_total else 0
        if exact_original:
            # 完全同名是强标题证据，但不能抹掉年份、类型、TMDB 排名和原标题锚点。
            # 直接赋 100 会令重复条目永久形成 100/100，制造假分差。
            score = min(100.0, score + 6.0)
        best_query_index = min(
            (self._safe_int(hit.get("query_index"), 99) for hit in tmdb_hits),
            default=99,
        )
        fallback_anchor_ok = True
        if best_query_index > 0:
            minimum_anchor = float(self._config["fallback_anchor_min"])
            fallback_anchor_ok = anchor_score >= minimum_anchor
            if not fallback_anchor_ok:
                # 降级词能搜到不代表它属于原始标题。锚点关联不足时按差距
                # 扣分，避免逐词缩短后的宽泛候选反客为主。
                score -= min(55.0, 25.0 + (minimum_anchor - anchor_score))
        requested_season = self._safe_int(hints.get("season"), 0)
        season_exists = None
        season_numbers = {
            self._safe_int(season.get("season_number"), -1)
            for season in candidate.get("seasons") or []
            if isinstance(season, dict)
            and self._safe_int(season.get("season_number"), -1) >= 0
        }
        if requested_season and candidate_type == MediaType.TV:
            coordinate_evidence = candidate.get("_season_coordinate_evidence") or {}
            if coordinate_evidence.get("checked"):
                season_exists = coordinate_evidence.get("season_exists")
                if season_exists is False:
                    score -= float(self._config["season_missing_penalty"])
            elif season_numbers:
                season_exists = requested_season in season_numbers
                if not season_exists:
                    score -= float(self._config["season_missing_penalty"])
        score = round(max(0.0, min(score, 100.0)), 2)
        display_name = self._candidate_name(candidate)
        return {
            "tmdb_id": self._safe_int(candidate.get("id"), 0),
            "name": display_name,
            "original_name": candidate.get("original_title") or candidate.get("original_name") or "",
            "year": candidate_year,
            "year_hint_role": year_hint_role,
            "media_type": candidate_type.value if candidate_type else "",
            "score": score,
            "popularity": round(float(candidate.get("popularity") or 0), 2),
            "vote_count": self._safe_int(candidate.get("vote_count"), 0),
            "vote_average": round(self._safe_float(candidate.get("vote_average"), 0.0), 1),
            "poster_path": candidate.get("poster_path") or candidate.get("poster") or "",
            "backdrop_path": candidate.get("backdrop_path") or candidate.get("backdrop") or "",
            "overview": str(candidate.get("overview") or "").strip(),
            "original_language": str(candidate.get("original_language") or ""),
            "query_index": best_query_index,
            "tmdb_rank": best_rank,
            "eligible_rank": eligible_rank,
            "identity_names": list(dict.fromkeys(
                normalized for value in (
                    display_name,
                    candidate.get("original_title") or candidate.get("original_name"),
                    best_components["matched_name"],
                ) if (normalized := self._normalize_text(value))
            )),
            "genre_ids": sorted(candidate_genre_ids),
            "release_group_evidence": {
                "kind": release_group_kind,
                "label": "动漫" if release_group_kind == "animation" else (
                    "真人电视剧" if release_group_kind == "live_action" else "未分类"
                ),
                "component": release_group_component,
                "release_group": release_group_profile.get("release_group") or "",
                "matched_rules": release_group_profile.get("matches") or [],
            },
            "seasonal_evidence": seasonal_evidence,
            "memory_evidence": memory_evidence,
            "context_priority": round(self._safe_float(candidate.get("_context_priority"), 0.0), 2),
            "season_numbers": sorted(season_numbers),
            "number_of_seasons": self._safe_int(candidate.get("number_of_seasons"), 0),
            "title_season": (
                self._infer_title_season(display_name)
                or self._infer_title_season(candidate.get("original_title") or candidate.get("original_name") or "")
            ),
            "franchise_base": self._franchise_base_title(
                candidate.get("original_title") or candidate.get("original_name") or display_name
            ),
            "matched_name": best_components["matched_name"],
            "exact_original": exact_original,
            "season_exists": season_exists,
            "season_coordinate_evidence": candidate.get("_season_coordinate_evidence") or {},
            "web_discovered": bool(candidate.get("_web_discovered")),
            "shared_recognition": bool(candidate.get("_shared_recognition")),
            "web_evidence": web_evidence,
            "web_evidence_url": candidate.get("_web_evidence_url") or "",
            "query_confidence": query_confidence,
            "query_evidence": query_evidence,
            "anchor_score": anchor_score,
            "fallback_anchor_ok": fallback_anchor_ok,
            "components": {
                "token": round(best_components["token"], 1),
                "similarity": round(best_components["similarity"], 1),
                "prefix": round(best_components["prefix"], 1),
                "rank": round(rank_component, 1),
                "query": query_confidence,
                "anchor": anchor_score,
                "year": year_component,
                "type": type_component,
                "release_group": release_group_component,
                "seasonal": seasonal_component or None,
                "memory": memory_component or None,
                "web": web_evidence,
            },
            "queries": [hit.get("query") for hit in hits],
        }

    def _collapse_duplicate_candidates(
            self, scored: List[Dict[str, Any]]
    ) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """同名同年同类型候选先归组，避免重复条目占据前两名制造假分差。"""
        groups: List[List[Dict[str, Any]]] = []
        for candidate in scored:
            group = next(
                (items for items in groups if self._same_work_identity(candidate, items[0])),
                None,
            )
            if group is None:
                groups.append([candidate])
            else:
                group.append(candidate)

        representatives: List[Dict[str, Any]] = []
        suppressed = 0
        for group in groups:
            winner = min(group, key=lambda item: (
                self._safe_int(item.get("query_index"), 99),
                self._safe_int(item.get("tmdb_rank"), 99),
                -self._safe_int(item.get("vote_count"), 0),
                -self._safe_float(item.get("popularity"), 0),
            ))
            winner["duplicate_count"] = len(group)
            representatives.append(winner)
            for candidate in group:
                if candidate is winner:
                    continue
                candidate["suppressed_as_duplicate"] = True
                candidate["duplicate_of"] = winner.get("tmdb_id")
                candidate["suppressed_reason"] = (
                    f"与 TMDB {winner.get('tmdb_id')} 同名、同年且类型一致；"
                    "按完整查询中的 TMDB 原始排名保留代表条目"
                )
                suppressed += 1
        representatives.sort(
            key=lambda item: (item["score"], item.get("popularity") or 0),
            reverse=True,
        )
        return representatives, {
            "group_count": len(groups),
            "suppressed_count": suppressed,
        }

    def _suppress_shadow_season_entries(
            self, ranked: List[Dict[str, Any]], hints: Dict[str, Any]
    ) -> Tuple[List[Dict[str, Any]], int]:
        """目标季已存在于总条目时，保守排除同系列的私人单季平行条目。"""
        requested_season = self._safe_int(hints.get("season"), 0)
        if requested_season <= 1:
            return ranked, 0
        parents = [
            item for item in ranked
            if requested_season in set(item.get("season_numbers") or [])
        ]
        if not parents:
            return ranked, 0
        suppressed_ids = set()
        for child in ranked:
            if self._safe_int(child.get("title_season"), 0) != requested_season:
                continue
            child_base = child.get("franchise_base")
            if not child_base:
                continue
            child_regular_seasons = {
                value for value in child.get("season_numbers") or [] if self._safe_int(value, 0) > 0
            }
            if self._safe_int(child.get("number_of_seasons"), 0) > 1 or len(child_regular_seasons) > 1:
                continue
            parent = next((item for item in parents if (
                item is not child
                and item.get("franchise_base") == child_base
                and self._safe_int(item.get("year"), 9999) < self._safe_int(child.get("year"), 0)
            )), None)
            if not parent:
                continue
            child["suppressed_as_shadow_season"] = True
            child["suppressed_reason"] = (
                f"TMDB {parent.get('tmdb_id')} 已包含第 {requested_season} 季；"
                f"当前条目只描述同系列第 {requested_season} 季，按平行单季条目排除"
            )
            child["shadow_of"] = parent.get("tmdb_id")
            suppressed_ids.add(child.get("tmdb_id"))
        return [item for item in ranked if item.get("tmdb_id") not in suppressed_ids], len(suppressed_ids)

    @classmethod
    def _franchise_base_title(cls, value: Any) -> str:
        text = str(value or "")
        text = re.sub(
            r"(?i)(?:\bseason\s*\d{1,2}\b|\b\d{1,2}(?:st|nd|rd|th)\s+season\b|"
            r"\bS\d{1,2}\b|第\s*[一二三四五六七八九十\d]{1,3}\s*季)",
            " ",
            text,
        )
        return cls._normalize_text(text)

    def _same_work_identity(self, left: Dict[str, Any], right: Dict[str, Any]) -> bool:
        """只合并具有共享身份名、同年、同媒体类型且题材不冲突的保守重复项。"""
        if left.get("media_type") != right.get("media_type"):
            return False
        if not left.get("year") or left.get("year") != right.get("year"):
            return False
        left_names = set(left.get("identity_names") or [])
        right_names = set(right.get("identity_names") or [])
        if not left_names or not right_names or not (left_names & right_names):
            return False
        left_genres = set(left.get("genre_ids") or [])
        right_genres = set(right.get("genre_ids") or [])
        return not left_genres or not right_genres or bool(left_genres & right_genres)

    def _apply_decisive_year_evidence(
            self, ranked: List[Dict[str, Any]], hints: Dict[str, Any]
    ) -> Tuple[List[Dict[str, Any]], Optional[Dict[str, Any]]]:
        """标题身份一致时由精确年份裁决同名改编，不再依赖微小权重差。"""
        requested_year = self._effective_series_year(hints)
        if not requested_year or len(ranked) < 2:
            return ranked, None
        current = ranked[0]
        if current.get("year") == requested_year:
            return ranked, None
        exact = [item for item in ranked if item.get("year") == requested_year]
        if not exact:
            return ranked, None
        chosen = max(exact, key=lambda item: (
            self._safe_float(item.get("score"), 0),
            -self._safe_int(item.get("tmdb_rank"), 99),
        ))
        if not self._same_title_family(current, chosen):
            return ranked, None
        if self._safe_float(chosen.get("score"), 0) + 12 \
                < self._safe_float(current.get("score"), 0):
            return ranked, None
        current["year_conflict"] = True
        reordered = [chosen, *[item for item in ranked if item is not chosen]]
        return reordered, {
            "kind": "exact_year",
            "requested_year": requested_year,
            "excluded_tmdb_id": current.get("tmdb_id"),
            "reason": (
                f"年份强证据裁决：TMDB {chosen.get('tmdb_id')} 与提示年份 {requested_year} 精确一致；"
                f"同名候选 TMDB {current.get('tmdb_id')} 为 {current.get('year') or '未知年份'}，"
                "因此不再要求二者满足普通分差门槛"
            ),
        }

    @staticmethod
    def _same_title_family(left: Dict[str, Any], right: Dict[str, Any]) -> bool:
        if left.get("media_type") != right.get("media_type"):
            return False
        left_names = set(left.get("identity_names") or [])
        right_names = set(right.get("identity_names") or [])
        return bool(left_names and right_names and left_names & right_names)

    def _query_confidence(self, hits: List[Dict[str, Any]]) -> Tuple[float, Dict[str, Any]]:
        """评价候选来自完整查询还是宽泛降级词，并奖励唯一与重复命中。"""
        if not hits:
            return 0.0, {}
        ordered = sorted(
            hits,
            key=lambda hit: (self._safe_int(hit.get("query_index"), 99), self._safe_int(hit.get("rank"), 99)),
        )
        best = ordered[0]
        query_index = self._safe_int(best.get("query_index"), 99)
        rank = self._safe_int(best.get("rank"), 99)
        result_count = self._safe_int(best.get("result_count"), 0)
        distinct_queries = len({self._safe_int(hit.get("query_index"), 99) for hit in hits})

        # 每次降级都会显著扩大召回范围；完整查询与第一次缩短之间必须拉开足够分差。
        specificity = max(0.0, 90.0 - query_index * 40.0)
        unique_bonus = 10.0 if result_count == 1 else 0.0
        consensus_bonus = min(12.0, max(0, distinct_queries - 1) * 6.0)
        rank_penalty = rank * 8.0
        confidence = round(max(0.0, min(100.0, specificity + unique_bonus + consensus_bonus - rank_penalty)), 2)
        return confidence, {
            "query": best.get("query") or "",
            "query_index": query_index,
            "rank": rank,
            "result_count": result_count,
            "distinct_queries": distinct_queries,
            "unique": result_count == 1,
        }

    def _build_queries(self, title: str) -> List[str]:
        """按风险从低到高生成有限数量的降级搜索词。"""
        cleaned = self._clean_title(title)
        queries = [cleaned] if cleaned else []
        if self._config.get("main_title_fallback"):
            parts = [part.strip(" -_.") for part in self._split_pattern.split(cleaned) if part.strip(" -_.")]
            if len(parts) > 1 and self._query_is_viable(parts[0]):
                queries.append(parts[0])
        without_suffix = cleaned
        while True:
            reduced = self._bracket_suffix_pattern.sub("", without_suffix).strip()
            if reduced == without_suffix:
                break
            without_suffix = reduced
        if without_suffix != cleaned and self._query_is_viable(without_suffix):
            queries.append(without_suffix)
        if self._config.get("progressive_fallback"):
            tokens = cleaned.split()
            while len(tokens) > 2:
                tokens.pop()
                query = " ".join(tokens).strip(" -_.:")
                if self._query_is_viable(query):
                    queries.append(query)
                if len(queries) >= int(self._config["max_queries"]):
                    break
        return list(dict.fromkeys(queries))[: int(self._config["max_queries"])]

    def _query_is_viable(self, query: str) -> bool:
        """拒绝过短的降级搜索词，降低宽泛查询导致的误识别。"""
        normalized = self._normalize_text(query)
        if len(normalized) < int(self._config["minimum_query_length"]):
            return False
        tokens = self._tokens(query)
        has_cjk = bool(re.search(r"[\u3400-\u9fff]", query))
        return has_cjk or len(tokens) >= 2

    @classmethod
    def _title_components(cls, query: str, candidate_name: str) -> Dict[str, float]:
        """返回查询词与候选名称间的 token、字符和主体前缀分量。"""
        query_normalized = cls._normalize_text(query)
        candidate_normalized = cls._normalize_text(candidate_name)
        if not query_normalized or not candidate_normalized:
            return {"token": 0.0, "similarity": 0.0, "prefix": 0.0}
        query_tokens = set(cls._tokens(query))
        candidate_tokens = set(cls._tokens(candidate_name))
        intersection = len(query_tokens & candidate_tokens)
        query_coverage = intersection / len(query_tokens) if query_tokens else 0.0
        union = len(query_tokens | candidate_tokens)
        jaccard = intersection / union if union else 0.0
        token_score = (query_coverage * 0.75 + jaccard * 0.25) * 100
        similarity = SequenceMatcher(None, query_normalized, candidate_normalized).ratio() * 100
        if query_normalized == candidate_normalized:
            prefix = 100.0
        elif candidate_normalized.startswith(query_normalized) or query_normalized.startswith(candidate_normalized):
            prefix = 100.0
        elif query_normalized in candidate_normalized or candidate_normalized in query_normalized:
            prefix = 60.0
        else:
            prefix = 0.0
        return {"token": token_score, "similarity": similarity, "prefix": prefix}

    @classmethod
    def _candidate_aliases(cls, candidate: Dict[str, Any]) -> List[str]:
        """收集搜索结果和详情中的所有可用标题并保持顺序去重。"""
        values = [
            candidate.get("title"), candidate.get("name"),
            candidate.get("original_title"), candidate.get("original_name"),
            candidate.get("en_title"), candidate.get("hk_title"),
            candidate.get("tw_title"), candidate.get("sg_title"),
        ]
        values.extend(candidate.get("names") or [])
        return list(dict.fromkeys(str(value).strip() for value in values if str(value or "").strip()))

    @staticmethod
    def _candidate_name(candidate: Dict[str, Any]) -> str:
        """返回可交回 MoviePilot 再次精确识别的本地化标准名称。"""
        return str(candidate.get("title") or candidate.get("name") or "").strip()

    @staticmethod
    def _candidate_year(candidate: Dict[str, Any]) -> str:
        """从电影上映日或电视剧首播日提取四位年份。"""
        date_value = str(candidate.get("release_date") or candidate.get("first_air_date") or "")
        match = re.match(r"(\d{4})", date_value)
        return match.group(1) if match else ""

    def _effective_series_year(self, hints: Dict[str, Any]) -> str:
        """返回可与 TMDB 条目首播年比较的年份；续季文件年份不作强证据。"""
        requested_year = self._normalize_year(hints.get("year"))
        if not requested_year:
            return ""
        media_type = self._normalize_media_type(hints.get("media_type"))
        season = self._safe_int(hints.get("season"), 0)
        if media_type == MediaType.TV and season > 1:
            return ""
        return requested_year

    @classmethod
    def _extract_hints(cls, title: str) -> Dict[str, Any]:
        """仅提取明确的年份、S/E 标记，不猜测方括号数字的含义。"""
        year_match = re.search(r"(?<!\d)((?:19|20)\d{2})(?!\d)", title)
        season_match = cls._season_pattern.search(title)
        episode_match = cls._episode_pattern.search(title)
        season = next((int(value) for value in season_match.groups() if value), 0) if season_match else None
        episode = next((int(value) for value in episode_match.groups() if value), 0) if episode_match else None
        return {
            "year": year_match.group(1) if year_match else "",
            "media_type": MediaType.TV if season or episode else None,
            "media_type_source": "season_episode" if season_match or episode_match else "",
            "season": season,
            "episode": episode,
        }

    @classmethod
    def _normalize_text(cls, value: Any) -> str:
        """将标题标准化为仅含字母、数字和中日韩字符的比较串。"""
        text = unicodedata.normalize("NFKC", str(value or "")).casefold()
        return "".join(char for char in text if char.isalnum())

    @classmethod
    def _tokens(cls, value: Any) -> List[str]:
        """提取拉丁数字 token；连续中日韩文本按字符参与覆盖率比较。"""
        text = unicodedata.normalize("NFKC", str(value or "")).casefold()
        tokens: List[str] = []
        for token in cls._token_pattern.findall(text):
            if re.fullmatch(r"[\u3400-\u9fff]+", token):
                tokens.extend(list(token))
            else:
                tokens.append(token)
        return tokens

    @classmethod
    def _clean_title(cls, value: Any) -> str:
        """清理标题首尾空白并合并连续空格。"""
        return re.sub(r"\s+", " ", str(value or "")).strip()

    @staticmethod
    def _safe_int(value: Any, default: int) -> int:
        """将配置值安全转换为整数。"""
        try:
            return int(value)
        except (TypeError, ValueError):
            return default

    @staticmethod
    def _optional_int(value: Any) -> Optional[int]:
        """把可选季集值转换为整数，空值保持 None。"""
        if value in (None, ""):
            return None
        try:
            return int(value)
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _safe_float(value: Any, default: float) -> float:
        """将配置值安全转换为浮点数。"""
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    @staticmethod
    def _normalize_year(value: Any) -> str:
        """只接受 1900 至 2099 的四位年份。"""
        text = str(value or "").strip()
        return text if re.fullmatch(r"(?:19|20)\d{2}", text) else ""

    @staticmethod
    def _normalize_media_type(value: Any) -> Optional[MediaType]:
        """兼容 MediaType 枚举和 movie/tv 字符串。"""
        if isinstance(value, MediaType):
            return value if value in (MediaType.MOVIE, MediaType.TV) else None
        normalized = str(value or "").strip().lower()
        mapping = {
            "movie": MediaType.MOVIE,
            "电影": MediaType.MOVIE,
            "tv": MediaType.TV,
            "电视剧": MediaType.TV,
        }
        return mapping.get(normalized)

    @staticmethod
    def _event_get(event_data: Any, key: str, default: Any = None) -> Any:
        """兼容读取字典或链式事件数据模型。"""
        if isinstance(event_data, dict):
            return event_data.get(key, default)
        return getattr(event_data, key, default)

    @staticmethod
    def _event_set(event_data: Any, key: str, value: Any) -> None:
        """兼容写入字典或链式事件数据模型。"""
        if isinstance(event_data, dict):
            event_data[key] = value
        else:
            setattr(event_data, key, value)

    def _normalize_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """合并默认值并限制数值配置范围。"""
        supplied_routes = (
            config.get("notification_type_routes")
            if isinstance(config, dict) else None
        )
        supplied_content_templates = (
            config.get("notification_content_templates")
            if isinstance(config, dict) else None
        )
        migrate_legacy_notification_routes = not isinstance(
            supplied_routes, dict
        )
        migrate_legacy_content_templates = not isinstance(
            supplied_content_templates, dict
        )
        merged = {**self.DEFAULT_CONFIG, **(config or {})}
        bool_keys = (
            "enabled", "recognizer_enabled", "show_sidebar_nav", "debug", "prefer_parsed_title",
            "use_year_hint", "use_original_title_evidence", "shared_recognition_enabled",
            "anime_cross_id_enabled", "anime_cross_id_auto_update",
            "anime_cross_id_anilist_resolver_enabled",
            "web_search_fallback",
            "main_title_fallback",
            "progressive_fallback", "fetch_aliases", "episode_normalizer_enabled",
            "emby_episode_group_sync_enabled", "emby_episode_group_sync_refresh_metadata",
            "strm_media_info_sync_enabled",
            "release_group_assist_enabled", "release_group_field_supplements_enabled",
            "recognition_rule_overrides_enabled",
            "seasonal_evidence_enabled", "recognition_memory_enabled",
            "custom_rename_fields_enabled", "rename_mapping_enabled", "media_probe_enabled",
            "media_probe_subtitle_to_customization", "media_probe_iso_enabled",
            "release_group_normalize_unknown_connectors",
            "notification_enhancer_enabled", "notification_success_enabled",
            "notification_failure_enabled", "notification_plugin_enabled",
            "notification_include_paths", "notification_passthrough_manual",
            "notification_episode_candidates_enabled",
            "notification_candidate_batch_enabled",
            "notification_candidate_realtime_enabled",
            "notification_candidate_sequel_only",
        )
        for key in bool_keys:
            merged[key] = bool(merged.get(key))
        ranges = {
            "max_queries": (1, 8),
            "candidate_limit": (1, 20),
            "detail_limit": (0, 15),
            "minimum_query_length": (2, 20),
            "history_limit": (5, 100),
            "web_search_max_results": (3, 15),
            "web_search_timeout": (5, 30),
            "recognition_memory_min_hits": (2, 10),
            "recognition_memory_ttl_days": (1, 90),
            "seasonal_evidence_quarters": (1, 4),
            "emby_episode_group_sync_initial_delay_seconds": (0, 300),
            "emby_episode_group_sync_retry_seconds": (10, 600),
            "emby_episode_group_sync_max_wait_minutes": (1, 1440),
            "strm_media_info_sync_initial_delay_seconds": (0, 300),
            "strm_media_info_sync_retry_seconds": (10, 600),
            "strm_media_info_sync_max_wait_minutes": (1, 1440),
            "media_probe_timeout": (3, 30),
            "anime_cross_id_update_interval_hours": (1, 168),
            "notification_record_limit": (20, 500),
            "notification_candidate_batch_hour": (0, 23),
        }
        for key, (minimum, maximum) in ranges.items():
            merged[key] = max(minimum, min(maximum, self._safe_int(merged.get(key), int(self.DEFAULT_CONFIG[key]))))
        float_ranges = {
            "minimum_score": (0.0, 100.0),
            "minimum_margin": (0.0, 50.0),
            "token_weight": (0.0, 100.0),
            "similarity_weight": (0.0, 100.0),
            "prefix_weight": (0.0, 100.0),
            "rank_weight": (0.0, 100.0),
            "query_confidence_weight": (0.0, 100.0),
            "anchor_weight": (0.0, 100.0),
            "fallback_anchor_min": (0.0, 100.0),
            "year_weight": (0.0, 100.0),
            "type_weight": (0.0, 100.0),
            "release_group_type_weight": (0.0, 30.0),
            "seasonal_evidence_weight": (0.0, 40.0),
            "recognition_memory_weight": (0.0, 40.0),
            "season_missing_penalty": (0.0, 100.0),
            "web_search_min_evidence": (50.0, 100.0),
        }
        for key, (minimum, maximum) in float_ranges.items():
            value = self._safe_float(merged.get(key), float(self.DEFAULT_CONFIG[key]))
            merged[key] = max(minimum, min(maximum, value))
        scoring_keys = (
            "token_weight", "similarity_weight", "prefix_weight", "rank_weight",
            "query_confidence_weight", "anchor_weight",
        )
        if not any(merged.get(key) for key in scoring_keys):
            for key in scoring_keys:
                merged[key] = self.DEFAULT_CONFIG[key]
        engine = str(merged.get("web_search_engine") or "auto").strip().lower()
        merged["web_search_engine"] = engine if engine in self._web_search_engines else "auto"
        mode = str(merged.get("recognition_mode") or "tmdb_first").strip().lower()
        merged["recognition_mode"] = mode if mode in ("tmdb_first", "scored") else "tmdb_first"
        notification_mode = str(
            merged.get("notification_mode") or "observe"
        ).strip().lower()
        merged["notification_mode"] = (
            notification_mode
            if notification_mode in ("observe", "parallel", "takeover")
            else "observe"
        )
        merged["notification_failure_policies"] = normalize_failure_policies(
            merged.get("notification_failure_policies")
        )
        merged["notification_default_service"] = str(
            merged.get("notification_default_service") or ""
        ).strip()[:160]
        merged["notification_type_routes"] = normalize_notification_routes(
            merged.get("notification_type_routes")
        )
        if migrate_legacy_content_templates:
            merged["notification_content_templates"] = (
                normalize_notification_content_templates({
                    "organizeSuccess": {
                        "title_template": merged.get(
                            "notification_success_title_template"
                        ),
                        "text_template": merged.get(
                            "notification_success_text_template"
                        ),
                    },
                    **{
                        key: {
                            "title_template": merged.get(
                                "notification_generic_title_template"
                            ),
                            "text_template": merged.get(
                                "notification_generic_text_template"
                            ),
                        }
                        for key in (
                            "downloadAdded",
                            "subscribeAdded",
                            "subscribeComplete",
                        )
                    },
                })
            )
        else:
            merged["notification_content_templates"] = (
                normalize_notification_content_templates(
                    merged.get("notification_content_templates")
                )
            )
        if migrate_legacy_notification_routes:
            legacy_success = str(
                merged.get("notification_success_service") or ""
            ).strip()[:160]
            legacy_failure = str(
                merged.get("notification_failure_service") or ""
            ).strip()[:160]
            if legacy_success:
                merged["notification_type_routes"]["organize"]["service"] = (
                    legacy_success
                )
            if legacy_failure:
                merged["notification_type_routes"]["manual"]["service"] = (
                    legacy_failure
                )
        merged["notification_success_service"] = str(
            merged.get("notification_success_service") or ""
        ).strip()[:160]
        merged["notification_failure_service"] = str(
            merged.get("notification_failure_service") or ""
        ).strip()[:160]
        for key in (
            "notification_success_title_template",
            "notification_success_text_template",
            "notification_failure_title_template",
            "notification_failure_text_template",
            "notification_generic_title_template",
            "notification_generic_text_template",
        ):
            fallback = str(self.DEFAULT_CONFIG.get(key) or "")
            value = merged.get(key)
            merged[key] = (
                str(value)[:12000]
                if value is not None and str(value).strip()
                else fallback
            )
        merged["notification_candidate_service"] = str(
            merged.get("notification_candidate_service") or ""
        ).strip()[:160]
        candidate_channel = str(
            merged.get("notification_candidate_channel") or ""
        ).strip()
        valid_channels = (
            {channel.value for channel in MessageChannel}
            if MessageChannel is not None else set()
        )
        merged["notification_candidate_channel"] = (
            candidate_channel if candidate_channel in valid_channels else ""
        )
        candidate_frequency = str(
            merged.get("notification_candidate_batch_frequency") or "monthly"
        ).strip().lower()
        merged["notification_candidate_batch_frequency"] = (
            candidate_frequency
            if candidate_frequency in ("monthly", "quarterly")
            else "monthly"
        )
        candidate_quarter = str(
            merged.get("notification_candidate_quarter") or ""
        ).strip().upper()
        merged["notification_candidate_quarter"] = (
            candidate_quarter
            if re.fullmatch(r"\d{4}-Q[1-4]", candidate_quarter)
            else ""
        )
        candidate_region = str(
            merged.get("notification_candidate_region") or "japan"
        ).strip().lower()
        merged["notification_candidate_region"] = (
            candidate_region
            if candidate_region in ("all", "japan", "china", "other")
            else "japan"
        )
        candidate_platforms = merged.get("notification_candidate_platforms") or []
        if isinstance(candidate_platforms, str):
            candidate_platforms = re.split(r"[\s,;，；]+", candidate_platforms)
        if not isinstance(candidate_platforms, (list, tuple, set)):
            candidate_platforms = []
        merged["notification_candidate_platforms"] = list(dict.fromkeys(
            str(value).strip().upper()
            for value in candidate_platforms
            if str(value).strip()
        ))[:12] or ["TV", "TV SHORT"]
        candidate_preference = str(
            merged.get("notification_candidate_preference") or "group_preferred"
        ).strip().lower()
        merged["notification_candidate_preference"] = (
            candidate_preference
            if candidate_preference in ("default", "group_preferred")
            else "group_preferred"
        )
        candidate_message_style = str(
            merged.get("notification_candidate_message_style") or "rich"
        ).strip().lower()
        merged["notification_candidate_message_style"] = (
            candidate_message_style
            if candidate_message_style in ("classic", "rich")
            else "rich"
        )
        custom_emoji_id = re.sub(
            r"\D+",
            "",
            str(merged.get("notification_candidate_custom_emoji_id") or ""),
        )
        merged["notification_candidate_custom_emoji_id"] = custom_emoji_id[:32]
        candidate_lists: Dict[str, List[int]] = {}
        for key in ("tmdb_exclude_ids", "tmdb_prefer_ids"):
            raw_values = merged.get(key) or []
            if isinstance(raw_values, str):
                raw_values = re.split(r"[\s,;，；]+", raw_values)
            elif not isinstance(raw_values, (list, tuple, set)):
                raw_values = []
            values: List[int] = []
            for raw in raw_values:
                value = self._safe_int(raw, 0)
                if value > 0 and value not in values:
                    values.append(value)
            candidate_lists[key] = values[:200]
        excluded_ids = set(candidate_lists["tmdb_exclude_ids"])
        merged["tmdb_exclude_ids"] = candidate_lists["tmdb_exclude_ids"]
        # 同一 ID 同时出现时以排除为准，避免互相冲突的强制规则。
        merged["tmdb_prefer_ids"] = [
            value for value in candidate_lists["tmdb_prefer_ids"]
            if value not in excluded_ids
        ]
        invalid_separator = re.compile(r"[\\/:*?\"<>|\x00-\x1f]")
        for key, default in (
                ("rename_default_separator", ""),
                ("customization_separator", "@"),
                ("release_group_default_connector", "@"),
        ):
            raw = str(merged.get(key) if merged.get(key) is not None else default)
            separator = " " if raw and raw.isspace() else raw.strip()
            if len(separator) > 8 or invalid_separator.search(separator):
                separator = default
            if key != "rename_default_separator" and not separator:
                separator = default
            merged[key] = separator
        fields = merged.get("rename_separator_fields") or []
        if not isinstance(fields, (list, tuple, set)):
            fields = []
        merged["rename_separator_fields"] = [
            field for field in dict.fromkeys(str(item) for item in fields)
            if field in self.RENAME_SEPARATOR_FIELDS
        ]
        servers = merged.get("emby_episode_group_sync_servers") or []
        if not isinstance(servers, (list, tuple, set)):
            servers = []
        merged["emby_episode_group_sync_servers"] = list(dict.fromkeys(
            str(value).strip() for value in servers if str(value).strip()
        ))
        policy = str(merged.get("emby_episode_group_sync_conflict_policy") or "skip").strip().lower()
        merged["emby_episode_group_sync_conflict_policy"] = policy if policy in {"skip", "overwrite"} else "skip"
        probe_policy = str(merged.get("media_probe_policy") or "fill_empty").strip().lower()
        merged["media_probe_policy"] = probe_policy if probe_policy in {"fill_empty", "overwrite"} else "fill_empty"
        probe_fields = merged.get("media_probe_fields") or []
        if not isinstance(probe_fields, (list, tuple, set)):
            probe_fields = []
        merged["media_probe_fields"] = [
            field for field in dict.fromkeys(str(item) for item in probe_fields)
            if field in MediaFileProbe.SCAN_TARGETS
        ]
        overwrite_fields = merged.get("media_probe_overwrite_fields") or []
        if not isinstance(overwrite_fields, (list, tuple, set)):
            overwrite_fields = []
        merged["media_probe_overwrite_fields"] = [
            field for field in dict.fromkeys(str(item) for item in overwrite_fields)
            if field in MediaFileProbe.SCAN_TARGETS and field in merged["media_probe_fields"]
        ]
        raw_probe_policies = merged.get("media_probe_field_policies") or {}
        if not isinstance(raw_probe_policies, dict):
            raw_probe_policies = {}
        merged["media_probe_field_policies"] = {
            str(key): str(value)
            for key, value in raw_probe_policies.items()
            if str(key) in merged["media_probe_fields"]
            and str(value) in {"fill_empty", "overwrite", "append"}
        }
        executable = str(merged.get("media_probe_executable") or "").strip()
        merged["media_probe_executable"] = executable[:500]
        subtitle_rules = str(merged.get("media_probe_subtitle_rules") or "")
        merged["media_probe_subtitle_rules"] = subtitle_rules[:10000]
        mappings = []
        for item in merged.get("emby_episode_group_sync_path_mappings") or []:
            if not isinstance(item, dict):
                continue
            source = EmbyEpisodeGroupSynchronizer.normalize_path(str(item.get("source") or ""))
            target = EmbyEpisodeGroupSynchronizer.normalize_path(str(item.get("target") or ""))
            if not source or not target:
                continue
            mappings.append({
                "server": str(item.get("server") or "*").strip() or "*",
                "source": source,
                "target": target,
            })
        merged["emby_episode_group_sync_path_mappings"] = mappings
        strm_servers = merged.get("strm_media_info_sync_servers") or []
        if not isinstance(strm_servers, (list, tuple, set)):
            strm_servers = []
        merged["strm_media_info_sync_servers"] = list(dict.fromkeys(
            str(value).strip() for value in strm_servers if str(value).strip()
        ))
        strm_mappings = []
        for item in merged.get("strm_media_info_sync_path_mappings") or []:
            if not isinstance(item, dict):
                continue
            source = EmbyEpisodeGroupSynchronizer.normalize_path(str(item.get("source") or ""))
            target = EmbyEpisodeGroupSynchronizer.normalize_path(str(item.get("target") or ""))
            if not source or not target:
                continue
            strm_mappings.append({
                "server": str(item.get("server") or "*").strip() or "*",
                "source": source,
                "target": target,
                # 神医联动主要服务 STRM 媒体库。旧配置没有该字段时按
                # STRM 处理，确保传给 SyncMediaInfo 的是 Emby 条目自身
                # 的 .strm 路径，而不是 STRM 内容指向的真实媒体路径。
                "target_kind": (
                    str(item.get("target_kind") or "strm").strip().casefold()
                    if str(item.get("target_kind") or "strm").strip().casefold() in {"strm", "media"}
                    else "strm"
                ),
            })
        merged["strm_media_info_sync_path_mappings"] = strm_mappings
        return merged

    def _current_config(self) -> Dict[str, Any]:
        """返回独立的当前配置快照。"""
        return dict(self._config)

    @staticmethod
    def _serialize_hints(hints: Dict[str, Any]) -> Dict[str, Any]:
        """把媒体类型枚举转换为可序列化字符串。"""
        media_type = hints.get("media_type")
        return {
            **hints,
            "media_type": media_type.value if isinstance(media_type, MediaType) else str(media_type or ""),
        }

    def _read_history(self) -> List[Dict[str, Any]]:
        """读取最近识别历史并兼容异常旧数据。"""
        records = self.get_data(self.DATA_KEY_HISTORY) or []
        return records if isinstance(records, list) else []

    def _append_history(self, result: Dict[str, Any]) -> None:
        """保存跨模块运行日志摘要，避免完整响应无限增长。"""
        adjustment = result.get("episode_adjustment")
        has_search = bool(result.get("queries"))
        has_cross_id = result.get("selection_mode") == "cross_id"
        if has_search and result.get("accepted"):
            self._remember_recognition(result)
        record = {
            key: result.get(key)
            for key in (
                "accepted", "title", "original_title", "reason", "queries", "hints",
                "best", "runner_up", "margin", "web_search", "episode_adjustment", "selection_mode",
                "candidate_policy", "cross_id", "created_at",
            )
        }
        record["kind"] = "recognition"
        record["module"] = (
            "动画跨站 ID + 集数偏移" if has_cross_id and adjustment is not None
            else "动画跨站 ID" if has_cross_id
            else "TMDB 搜索增强 + 集数偏移" if has_search and adjustment is not None
            else "集数偏移" if adjustment is not None else "TMDB 搜索增强"
        )
        record["level"] = "success" if result.get("accepted") else "warning"
        with self._history_lock:
            records = self._read_history()
            records.insert(0, record)
            self.save_data(self.DATA_KEY_HISTORY, records[: int(self._config["history_limit"])])

    def _append_module_history(
            self,
            module: str,
            title: str,
            reason: str,
            stages: Optional[List[str]] = None,
            accepted: bool = True,
    ) -> None:
        """记录非识别模块的实际改写结果，不影响识别接纳率统计。"""
        if bool(getattr(getattr(self, "_preview_state", None), "active", False)):
            return
        record = {
            "kind": "operation",
            "module": str(module or "插件处理"),
            "accepted": bool(accepted),
            "level": "success" if accepted else "warning",
            "title": str(title or "未命名媒体"),
            "original_title": "",
            "reason": str(reason or "处理完成"),
            "stages": list(dict.fromkeys(str(item) for item in (stages or []) if item)),
            "queries": [],
            "best": None,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        with self._history_lock:
            records = self._read_history()
            records.insert(0, record)
            self.save_data(self.DATA_KEY_HISTORY, records[: int(self._config["history_limit"])])

    @classmethod
    def _rename_event_title(
            cls, data: Any, rename_dict: Optional[Dict[str, Any]] = None,
    ) -> str:
        """为命名模块日志提取稳定且便于阅读的文件标题。"""
        context = rename_dict if isinstance(rename_dict, dict) else cls._event_get(data, "rename_dict")
        if isinstance(context, dict):
            value = context.get("original_name") or context.get("name") or context.get("title")
            if value:
                return str(value)
        source_path = cls._event_get(data, "source_path")
        if source_path:
            return Path(str(source_path)).name or str(source_path)
        rendered = cls._event_get(data, "updated_str") or cls._event_get(data, "render_str")
        return str(rendered or "未命名媒体")

    def _remember_recognition(self, result: Dict[str, Any]) -> None:
        """累计正式整理链的不同文件命中；相同文件重复运行不会刷高频次。"""
        if not self._config.get("recognition_memory_enabled"):
            return
        best = result.get("best") or {}
        tmdb_id = self._safe_int(best.get("tmdb_id"), 0)
        media_type = self._normalize_media_type(best.get("media_type"))
        title_key = self._normalize_text(result.get("search_title") or result.get("title"))
        if not tmdb_id or not media_type or len(title_key) < 4:
            return
        sample_source = str(result.get("original_title") or result.get("title") or title_key)
        sample_hash = hashlib.sha256(sample_source.casefold().encode("utf-8")).hexdigest()[:20]
        now = datetime.now().timestamp()
        ttl_seconds = int(self._config.get("recognition_memory_ttl_days") or 14) * 86400
        with self._memory_lock:
            memory = self._read_recognition_memory(prune=True)
            entries = memory.setdefault("entries", {})
            entry = entries.setdefault(title_key, {
                "title": result.get("title") or "",
                "updated_at": now,
                "targets": {},
                "samples": {},
            })
            samples = entry.get("samples") if isinstance(entry.get("samples"), dict) else {}
            samples = {
                key: timestamp for key, timestamp in samples.items()
                if now - self._safe_float(timestamp, 0) <= ttl_seconds
            }
            if sample_hash in samples:
                return
            samples[sample_hash] = now
            target_key = f"{media_type.value}:{tmdb_id}"
            targets = entry.get("targets") if isinstance(entry.get("targets"), dict) else {}
            target = targets.setdefault(target_key, {
                "tmdb_id": tmdb_id,
                "media_type": media_type.value,
                "name": best.get("name") or "",
                "count": 0,
            })
            target["count"] = self._safe_int(target.get("count"), 0) + 1
            target["last_seen"] = now
            target["name"] = best.get("name") or target.get("name") or ""
            entry.update({
                "title": result.get("title") or entry.get("title") or "",
                "updated_at": now,
                "targets": targets,
                "samples": dict(sorted(samples.items(), key=lambda pair: pair[1], reverse=True)[:60]),
            })
            entries[title_key] = entry
            memory["entries"] = dict(sorted(
                entries.items(),
                key=lambda pair: self._safe_float(pair[1].get("updated_at"), 0),
                reverse=True,
            )[:300])
            self.save_data(self.DATA_KEY_RECOGNITION_MEMORY, memory)

    def _recognition_memory_summary(self) -> Dict[str, Any]:
        """返回状态页所需的轻量记忆统计，不暴露完整文件名。"""
        entries = (self._read_recognition_memory().get("entries") or {}) \
            if self._config.get("recognition_memory_enabled") else {}
        minimum_hits = int(self._config.get("recognition_memory_min_hits") or 3)
        active_targets = 0
        sample_count = 0
        for entry in entries.values():
            targets = entry.get("targets") if isinstance(entry, dict) else {}
            samples = entry.get("samples") if isinstance(entry, dict) else {}
            sample_count += len(samples) if isinstance(samples, dict) else 0
            active_targets += sum(
                1 for value in (targets or {}).values()
                if self._safe_int(value.get("count"), 0) >= minimum_hits
            )
        return {
            "title_count": len(entries),
            "sample_count": sample_count,
            "active_targets": active_targets,
            "ttl_days": int(self._config.get("recognition_memory_ttl_days") or 14),
        }

    def _normalizer(self) -> EpisodeNormalizer:
        """返回当前 TMDB 客户端对应的归一化服务。"""
        if not self._episode_normalizer:
            self._episode_normalizer = EpisodeNormalizer(self._tmdb_client())
        return self._episode_normalizer

    def _tmdb_client(self) -> TmdbApi:
        """返回可用 TMDB 客户端，兼容插件热重载和跨站 ID 先行命中。"""
        with self._config_lock:
            if self._tmdb_api is None:
                self._tmdb_api = TmdbApi()
            return self._tmdb_api

    @staticmethod
    def _tmdb_image_url(value: Any, size: str) -> str:
        """把 TMDB 图片路径转成可直接展示的地址。"""
        path = str(value or "").strip()
        if not path:
            return ""
        if path.startswith(("http://", "https://", "data:")):
            return path
        if not path.startswith("/"):
            path = f"/{path}"
        return f"https://image.tmdb.org/t/p/{size}{path}"

    def _enrich_selected_candidate(
            self,
            candidate: Optional[Dict[str, Any]],
            detail: Optional[Dict[str, Any]] = None,
    ) -> Optional[Dict[str, Any]]:
        """只为最终入选项读取一次详情，补齐统一展示所需的 TMDB 元数据。"""
        if not candidate:
            return candidate
        media_type = self._normalize_media_type(candidate.get("media_type"))
        tmdb_id = self._safe_int(candidate.get("tmdb_id"), 0)
        if not media_type or not tmdb_id:
            return candidate
        resolved = detail or {}
        if not resolved:
            try:
                resolved = self._tmdb_client().get_info(
                    mtype=media_type, tmdbid=tmdb_id,
                ) or {}
            except Exception as err:  # noqa: BLE001 - 详情失败不影响已完成的候选选择
                logger.debug(f"[媒体整理增强] TMDB {tmdb_id} 展示详情读取失败：{err}")
        poster_path = (
            resolved.get("poster_path") or resolved.get("poster")
            or candidate.get("poster_path") or candidate.get("poster")
        )
        backdrop_path = (
            resolved.get("backdrop_path") or resolved.get("backdrop")
            or candidate.get("backdrop_path") or candidate.get("backdrop")
        )
        genres = [
            str(item.get("name") or "").strip()
            for item in (resolved.get("genres") or [])
            if isinstance(item, dict) and str(item.get("name") or "").strip()
        ]
        candidate.update({
            "poster": self._tmdb_image_url(poster_path, "w342"),
            "backdrop": self._tmdb_image_url(backdrop_path, "w780"),
            "overview": str(
                resolved.get("overview") or candidate.get("overview") or ""
            ).strip(),
            "vote_average": round(self._safe_float(
                resolved.get("vote_average", candidate.get("vote_average")), 0.0,
            ), 1),
            "genres": genres or candidate.get("genres") or [],
            "original_language": str(
                resolved.get("original_language")
                or candidate.get("original_language") or ""
            ),
            "tmdb_url": (
                f"https://www.themoviedb.org/"
                f"{'tv' if media_type == MediaType.TV else 'movie'}/{tmdb_id}"
            ),
            "details_loaded": bool(resolved),
        })
        return candidate

    def _read_episode_rules(self) -> List[Dict[str, Any]]:
        """读取目标编集规则。"""
        rules = self.get_data(self.DATA_KEY_EPISODE_RULES) or []
        return deepcopy(rules) if isinstance(rules, list) else []

    def _read_season_catalog_cache(self) -> Dict[str, Dict[str, Any]]:
        """读取按季度隔离的看板缓存，并兼容 v0.3.0 的聚合列表。"""
        with self._catalog_lock:
            stored = self.get_data(self.DATA_KEY_SEASON_CATALOG) or {}
        if isinstance(stored, dict):
            return deepcopy(stored)
        if not isinstance(stored, list):
            return {}
        migrated: Dict[str, Dict[str, Any]] = {}
        for item in stored:
            if not isinstance(item, dict):
                continue
            quarter = str(item.get("quarter") or "未知季度")
            migrated.setdefault(quarter, {"items": [], "updated_at": ""})["items"].append(item)
        return migrated

    def _save_season_catalog_quarter(self, quarter: str, items: List[Dict[str, Any]]) -> None:
        """只缓存最近八个季度，界面始终仅返回当前选择季度。"""
        with self._catalog_lock:
            cache = self._read_season_catalog_cache()
            cache[quarter] = {
                "items": deepcopy(items),
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "schema_version": self.CATALOG_SCHEMA_VERSION,
            }
            ordered_keys = sorted(cache.keys(), reverse=True)
            cache = {key: cache[key] for key in ordered_keys[:8]}
            self.save_data(self.DATA_KEY_SEASON_CATALOG, cache)

    def _replace_catalog_tmdb_match(
            self, original_tmdb_id: int, tmdb_id: int, title: str = ""
    ) -> None:
        """用户纠正规则 ID 时，同步修正看板里指向旧 ID 的自动匹配。"""
        if not original_tmdb_id or not tmdb_id or original_tmdb_id == tmdb_id:
            return
        with self._catalog_lock:
            cache = self._read_season_catalog_cache()
            changed = False
            for quarter_data in cache.values():
                quarter_changed = False
                items = quarter_data.get("items") if isinstance(quarter_data, dict) else []
                for item in items or []:
                    match = item.get("tmdb_match") or {}
                    best = match.get("best") or {}
                    if self._safe_int(best.get("tmdb_id"), 0) != original_tmdb_id:
                        continue
                    best["tmdb_id"] = tmdb_id
                    if title:
                        best["name"] = title
                        item["aliases"] = list(dict.fromkeys([*(item.get("aliases") or []), title]))
                        if re.search(r"[\u3400-\u9fff]", title):
                            item["name_cn"] = title
                            item["display_name"] = title
                    best["source"] = "user-corrected"
                    match["accepted"] = True
                    match["attempted"] = True
                    match["reason"] = "用户在维护规则中纠正 TMDBID"
                    match["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    item["scan_status"] = "matched"
                    item.pop("scan_error", None)
                    changed = True
                    quarter_changed = True
                if quarter_changed and isinstance(quarter_data, dict):
                    quarter_data["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            if changed:
                self.save_data(self.DATA_KEY_SEASON_CATALOG, cache)

    def _find_catalog_item(
            self, quarter: str, item_id: str
    ) -> Tuple[Optional[Dict[str, Any]], List[Dict[str, Any]]]:
        cache = self._read_season_catalog_cache()
        data = cache.get(quarter) or {}
        catalog = data.get("items") if isinstance(data, dict) else []
        if not isinstance(catalog, list):
            return None, []
        item = next((value for value in catalog if str(value.get("id")) == item_id), None)
        return item, catalog

    @classmethod
    def _quarter_from_date(cls, value: Any) -> str:
        """把 TMDB 的 YYYY-MM-DD 日期转换成季度键。"""
        match = re.match(r"^(\d{4})-(\d{1,2})", str(value or "").strip())
        if not match:
            return ""
        year, month = int(match.group(1)), int(match.group(2))
        if not 1 <= month <= 12:
            return ""
        return f"{year}-Q{(month - 1) // 3 + 1}"

    @classmethod
    def _manual_catalog_item(
            cls, tmdb_id: int, info: Dict[str, Any], quarter: str = ""
    ) -> Tuple[Dict[str, Any], str]:
        """从 TMDB 详情构造一个与季度看板条目兼容的手工条目。"""
        seasons = [
            season for season in info.get("seasons") or []
            if isinstance(season, dict) and cls._safe_int(season.get("season_number"), 0) > 0
        ]
        dated_seasons = [season for season in seasons if cls._quarter_from_date(season.get("air_date"))]
        selected = None
        if quarter:
            matching = [
                season for season in dated_seasons
                if cls._quarter_from_date(season.get("air_date")) == quarter
            ]
            if matching:
                selected = max(
                    matching,
                    key=lambda season: (
                        str(season.get("air_date") or ""),
                        cls._safe_int(season.get("season_number"), 0),
                    ),
                )
        elif dated_seasons:
            selected = max(
                dated_seasons,
                key=lambda season: (
                    str(season.get("air_date") or ""),
                    cls._safe_int(season.get("season_number"), 0),
                ),
            )

        air_date = str((selected or {}).get("air_date") or info.get("first_air_date") or "")
        inferred_quarter = quarter or cls._quarter_from_date(air_date)
        if quarter and not selected:
            year, number = quarter.split("-Q", 1)
            air_date = f"{year}-{1 + (int(number) - 1) * 3:02d}-01"
        aliases = cls._candidate_aliases(info)
        localized = cls._clean_title(info.get("name") or info.get("title"))
        original = cls._clean_title(info.get("original_name") or info.get("original_title"))
        display_name = localized or original or f"TMDB {tmdb_id}"
        aliases = list(dict.fromkeys([display_name, original, *aliases]))
        aliases = [value for value in aliases if value]
        return {
            "id": f"manual:{tmdb_id}:{inferred_quarter or 'unclassified'}",
            "source": "manual",
            "quarter": inferred_quarter,
            "name": original or display_name,
            "name_cn": display_name if re.search(r"[\u3400-\u9fff]", display_name) else "",
            "display_name": display_name,
            "aliases": aliases,
            "search_titles": aliases,
            "date": air_date,
            "source_season": cls._safe_int((selected or {}).get("season_number"), 0) or None,
            "is_multi_season": len(seasons) > 1,
            "tmdb_match": {
                "accepted": True,
                "attempted": True,
                "reason": "用户指定 TMDBID",
                "best": {
                    "tmdb_id": tmdb_id,
                    "name": display_name,
                    "year": cls._candidate_year(info),
                    "media_type": MediaType.TV.value,
                    "score": 100.0,
                    "source": "user-manual",
                },
            },
        }, inferred_quarter

    def _match_catalog_item(
            self, item: Dict[str, Any], tmdb_id_override: int = 0
    ) -> Dict[str, Any]:
        """匹配单个番剧；允许用户在自动匹配失败后补充 TMDBID。"""
        if tmdb_id_override:
            info = self._tmdb_api.get_info(mtype=MediaType.TV, tmdbid=tmdb_id_override) or {}
            if not info:
                raise ValueError(f"TMDB {tmdb_id_override} 不存在或不是电视剧")
            best = {
                "tmdb_id": tmdb_id_override,
                "name": info.get("name") or info.get("title") or f"TMDB {tmdb_id_override}",
                "year": self._candidate_year(info),
                "media_type": MediaType.TV.value,
                "score": 100.0,
            }
            match = {"accepted": True, "best": best, "reason": "用户补充 TMDBID", "margin": 100.0}
        else:
            cached = item.get("tmdb_match") or {}
            cached_best = cached.get("best") or {}
            if (
                    cached.get("accepted") and cached_best.get("tmdb_id")
                    and self._normalize_media_type(cached_best.get("media_type")) == MediaType.TV
            ):
                match = cached
            elif cached.get("attempted"):
                reason = cached.get("reason") or "没有可信的 TMDB 候选"
                raise ValueError(f"自动匹配 TMDB 失败：{reason}；请补充 TMDBID 或放弃该条目")
            else:
                match = self._fast_catalog_tmdb_match(item)

        best = match.get("best") or {}
        if self._normalize_media_type(best.get("media_type")) != MediaType.TV:
            raise ValueError("匹配结果不是电视剧，不能建立集数归一化规则")
        tmdb_id = self._safe_int(best.get("tmdb_id"), 0)
        info = self._tmdb_api.get_info(mtype=MediaType.TV, tmdbid=tmdb_id) or {}
        seasons = [
            season for season in info.get("seasons") or []
            if self._safe_int(season.get("season_number"), 0) > 0
        ]
        item["is_multi_season"] = bool(item.get("is_multi_season") or len(seasons) > 1)
        localized = self._clean_title(info.get("name") or info.get("title"))
        if localized:
            item["display_name"] = item.get("name_cn") or localized
            if re.search(r"[\u3400-\u9fff]", localized):
                item["name_cn"] = localized
                item["display_name"] = localized
            item["aliases"] = list(dict.fromkeys([*(item.get("aliases") or []), localized]))
            best["name"] = localized
        item["tmdb_match"] = {
            "accepted": True,
            "reason": match.get("reason") or "匹配成功",
            "best": best,
            "season_count": len(seasons),
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        item["scan_status"] = "matched"
        if tmdb_id_override:
            item["manual_tmdb_id"] = tmdb_id
        item.pop("scan_error", None)
        return item["tmdb_match"]

    def _fast_catalog_tmdb_match(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """使用季度目录专用的多别名策略，不受整理识别参数影响。"""
        titles = self._catalog_search_titles(item)[: self.CATALOG_QUERY_LIMIT]
        if not titles:
            raise ValueError("没有可用于搜索的标题")
        platform = str(item.get("platform") or "").upper()
        preferred_type = MediaType.MOVIE if item.get("catalog_media_type") == "movie" or platform == "MOVIE" else MediaType.TV
        allowed_types = {preferred_type}
        if platform in ("ONA", "OVA", "SPECIAL"):
            allowed_types = {MediaType.TV, MediaType.MOVIE}
        api = TmdbApi(language="en-US")
        collected: Dict[str, Dict[str, Any]] = {}
        try:
            for query_index, title in enumerate(titles):
                results = api.search_multiis(title) or []
                media_results = [
                    value for value in results
                    if self._normalize_media_type(value.get("media_type")) in allowed_types
                    and self._safe_int(value.get("id"), 0)
                ][: self.CATALOG_RESULT_LIMIT]
                for rank, raw in enumerate(media_results):
                    tmdb_id = self._safe_int(raw.get("id"), 0)
                    media_type = self._normalize_media_type(raw.get("media_type"))
                    candidate_key = f"{media_type.value if media_type else ''}:{tmdb_id}"
                    candidate = collected.setdefault(candidate_key, dict(raw))
                    hit = candidate.setdefault("_catalog_hits", [])
                    hit.append({"query": title, "query_index": query_index, "rank": rank, "count": len(media_results)})
            if item.get("is_multi_season") or item.get("has_prequel"):
                detail_candidates = sorted(
                    collected.values(),
                    key=lambda value: min(
                        (hit.get("query_index", 99), hit.get("rank", 99))
                        for hit in value.get("_catalog_hits") or [{}]
                    ),
                )[:4]
                for candidate in detail_candidates:
                    media_type = self._normalize_media_type(candidate.get("media_type"))
                    try:
                        candidate["_catalog_detail"] = api.get_info(
                            mtype=media_type or preferred_type,
                            tmdbid=self._safe_int(candidate.get("id"), 0),
                        ) or {}
                    except Exception:
                        candidate["_catalog_detail"] = {}
        finally:
            try:
                api.close()
            except Exception:
                pass

        scored: List[Dict[str, Any]] = []
        for candidate in collected.values():
            detail = candidate.get("_catalog_detail") or {}
            genre_values = candidate.get("genre_ids") or detail.get("genre_ids") or []
            genre_ids = {
                self._safe_int(value.get("id") if isinstance(value, dict) else value, 0)
                for value in [*genre_values, *(detail.get("genres") or [])]
            }
            genre_ids.discard(0)
            if genre_ids and 16 not in genre_ids:  # 季度目录只接受 Animation 候选，排除同名真人剧。
                continue
            aliases = list(dict.fromkeys([
                *self._candidate_aliases(candidate),
                *self._candidate_aliases(detail),
            ]))
            comparisons = [
                self._title_components(title, alias)
                for title in titles for alias in aliases
            ]
            best_similarity = max((value["similarity"] for value in comparisons), default=0.0)
            best_token = max((value["token"] for value in comparisons), default=0.0)
            exact = any(
                self._normalize_text(title) == self._normalize_text(alias)
                for title in titles for alias in aliases
            )
            hit = min(candidate.get("_catalog_hits") or [{}], key=lambda value: (value.get("query_index", 99), value.get("rank", 99)))
            rank = self._safe_int(hit.get("rank"), 99)
            query_index = self._safe_int(hit.get("query_index"), 99)
            score = 88.0 if exact else min(
                90.0,
                best_similarity * 0.55 + best_token * 0.25
                + max(0.0, 18.0 - rank * 6.0) + (6.0 if query_index == 0 else 0.0),
            )
            candidate_type = self._normalize_media_type(candidate.get("media_type"))
            score += 8.0 if candidate_type == preferred_type else -6.0
            if 16 in genre_ids:
                score += 8.0
            expected_language = {"japan": "ja", "china": "zh", "western": "en"}.get(item.get("region"))
            original_language = str(candidate.get("original_language") or detail.get("original_language") or "")
            if expected_language and original_language:
                score += 5.0 if original_language == expected_language else -4.0
            candidate_year = self._safe_int(self._candidate_year(detail or candidate), 0)
            item_year = self._safe_int(str(item.get("date") or "")[:4], 0)
            franchise_year = self._safe_int(item.get("franchise_start_year"), 0) or item_year
            if candidate_year and item_year:
                if candidate_year > item_year + 1:
                    continue
                score += max(0.0, 8.0 - min(8, abs(candidate_year - franchise_year)))
                if item.get("has_prequel") and candidate_year >= item_year:
                    score -= 12.0
            if candidate_type == MediaType.TV and (item.get("is_multi_season") or item.get("has_prequel")):
                seasons = [
                    season for season in detail.get("seasons") or []
                    if self._safe_int(season.get("season_number"), 0) > 0
                ]
                score += 15.0 if len(seasons) >= 2 else -35.0
            score = max(0.0, min(100.0, score))
            scored.append({
                "raw": candidate,
                "tmdb_id": self._safe_int(candidate.get("id"), 0),
                "score": round(score, 2),
                "exact": exact,
                "similarity": best_similarity,
                "rank": rank,
                "query_index": query_index,
                "media_type": candidate_type,
            })
        scored.sort(
            key=lambda value: (value["exact"], value["score"], -value["query_index"], -value["rank"]),
            reverse=True,
        )
        best = scored[0] if scored else None
        accepted = bool(best and (
            (best["exact"] and best["score"] >= 82.0)
            or (not best["exact"] and best["score"] >= 78.0)
            or (not best["exact"] and best["query_index"] == 0 and best["rank"] == 0 and best["similarity"] >= 60.0)
            or (not best["exact"] and len(scored) == 1 and best["similarity"] >= 50.0)
        ))
        if not accepted:
            reason = "TMDB 未返回可信的电视剧候选"
            item["tmdb_match"] = {
                "accepted": False, "attempted": True, "reason": reason,
                "best": None, "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
            raise ValueError(reason)
        raw = best["raw"]
        runner_score = scored[1]["score"] if len(scored) > 1 else 0.0
        match = {
            "accepted": True,
            "attempted": True,
            "reason": f"季度目录独立多别名匹配（查询 {len(titles)} 个标题）",
            "best": {
                "tmdb_id": best["tmdb_id"],
                "name": self._candidate_name(raw),
                "year": self._candidate_year(raw.get("_catalog_detail") or raw),
                "media_type": (best.get("media_type") or preferred_type).value,
                "score": best["score"],
                "source": "tmdb-fast",
            },
            "margin": round(best["score"] - runner_score, 2),
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        item["tmdb_match"] = match
        return match

    @classmethod
    def _catalog_search_titles(cls, item: Dict[str, Any]) -> List[str]:
        """为季度匹配生成去季号标题；完整别名仍保留在条目中供显示和规则命中。"""
        originals = list(dict.fromkeys(
            cls._clean_title(value)
            for value in [*(item.get("search_titles") or []), *(item.get("aliases") or []), item.get("name")]
            if cls._clean_title(value)
        ))
        stripped_by_title: Dict[str, str] = {}
        patterns = (
            r"(?i)\b\d{1,2}(?:st|nd|rd|th)\s+(?:season|part|cour)\b",
            r"(?i)\b(?:season|series|part|cour)\s*(?:\d{1,2}|[ivx]{1,5})\b",
            r"(?i)\b(?:the\s+)?final\s+season\b",
            r"(?i)\bS\s*0*\d{1,2}\b",
            r"第\s*[0-9一二三四五六七八九十百]+\s*[季期部]",
            r"第\s*[0-9一二三四五六七八九十百]+\s*クール",
            r"(?i)(?:続編|续篇|續篇|第二期|新章)$",
        )
        for title in originals:
            reduced = title
            for pattern in patterns:
                reduced = re.sub(pattern, " ", reduced)
            reduced = re.sub(r"\s*[-:：/／|｜]\s*$", "", reduced)
            reduced = cls._clean_title(reduced).strip(" -_:：/／|｜")
            if item.get("is_multi_season"):
                parts = cls._split_pattern.split(reduced, maxsplit=1)
                if len(parts) > 1 and len(cls._tokens(parts[0])) >= 2:
                    reduced = parts[0]
                reduced = re.sub(r"(?i)\s+(?:[2-9]|II|III|IV|V|VI|VII|VIII|IX|X)$", "", reduced).strip()
            if reduced and cls._normalize_text(reduced) != cls._normalize_text(title):
                stripped_by_title[title] = reduced
        queries: List[str] = []
        normalized_seen = set()
        for title in originals:
            for value in (stripped_by_title.get(title), title):
                normalized = cls._normalize_text(value)
                if not value or not normalized or normalized in normalized_seen:
                    continue
                queries.append(value)
                normalized_seen.add(normalized)
        return queries

    def _add_catalog_item_to_rules(
            self,
            item: Dict[str, Any],
            preference: str,
            rules: List[Dict[str, Any]],
            tmdb_id_override: int = 0,
            episode_group_id_override: str = "",
    ) -> Dict[str, Any]:
        """把一个看板条目转成规则，已有规则只追加季度片段、不覆盖用户目标。"""
        match = self._match_catalog_item(item, tmdb_id_override)
        best = match.get("best") or {}
        tmdb_id = self._safe_int(best.get("tmdb_id"), 0)
        if not tmdb_id:
            raise ValueError("TMDB 匹配结果缺少有效 ID")

        existing_index = next((
            index for index, rule in enumerate(rules)
            if self._safe_int(rule.get("tmdb_id"), 0) == tmdb_id
        ), None)
        existing = rules[existing_index] if existing_index is not None else None
        explicit_group_id = str(episode_group_id_override or "").strip()
        if explicit_group_id:
            inspection = self._normalizer().inspect(tmdb_id)
            selected_group = next((
                group for group in inspection.get("groups") or []
                if str(group.get("id") or "") == explicit_group_id
            ), None)
            if not selected_group:
                raise ValueError("指定的 TMDB 剧集组不存在或已失效")
            target_type = "group"
            group_id = explicit_group_id
            recommendation = {
                "target_type": "group",
                "episode_group_id": group_id,
                "group": selected_group,
                "reason": "已按通知中明确选择的剧集组加入",
            }
        elif existing:
            target_type = str(existing.get("target_type") or "default")
            group_id = str(existing.get("episode_group_id") or "")
            selected_group = None
            recommendation = None
        elif preference in ("group", "group_preferred"):
            recommendation = self._normalizer().recommend_target(tmdb_id)
            selected_group = recommendation.get("group")
            target_type = "group" if selected_group else "default"
            group_id = str((selected_group or {}).get("id") or "")
        else:
            selected_group = None
            recommendation = None
            target_type = "default"
            group_id = ""

        season_hint = self._optional_int(item.get("source_season")) or self._infer_title_season(
            " ".join(str(value or "") for value in [item.get("name"), item.get("name_cn"), *(item.get("aliases") or [])])
        )
        suggestion = self._normalizer().suggest_installment_start(
            tmdb_id=tmdb_id,
            target_type=target_type,
            group_id=group_id,
            air_date=str(item.get("date") or ""),
            season_hint=season_hint,
        )
        installments = deepcopy((existing or {}).get("installments") or [])
        segment_id = f"catalog:{item.get('id')}"
        installments = [value for value in installments if str(value.get("id")) != segment_id]
        if suggestion:
            installments.append({
                "id": segment_id,
                "title": item.get("display_name") or item.get("name_cn") or item.get("name") or "",
                "quarter": item.get("quarter") or "",
                "aliases": item.get("aliases") or [],
                "source_season": season_hint or 1,
                "source_start_episode": suggestion.get("source_start_episode"),
                "target_start_season": suggestion.get("season"),
                "target_start_episode": suggestion.get("episode"),
            })

        rule = self._normalize_episode_rule({
            "tmdb_id": tmdb_id,
            "title": (existing or {}).get("title") or best.get("name") or item.get("display_name") or item.get("name_cn") or item.get("name"),
            "enabled": (existing or {}).get("enabled", True),
            "target_type": target_type,
            "episode_group_id": group_id,
            "installments": installments,
        })
        if existing_index is None:
            rules.append(rule)
        else:
            rules[existing_index] = rule
        rules.sort(key=lambda value: (str(value.get("title") or ""), value.get("tmdb_id") or 0))
        return {
            "id": item.get("id"),
            "title": item.get("display_name") or item.get("name_cn") or item.get("name") or rule["title"],
            "tmdb_id": tmdb_id,
            "rule": rule,
            "target": "剧集组" if target_type == "group" else "TMDB 默认",
            "group": selected_group,
            "recommendation": recommendation,
            "needs_attention": suggestion is None,
            "message": (
                "已加入规则，但无法自动确定该季度在目标编集中的起点，请在维护规则中补充"
                if suggestion is None else (
                    f"已加入维护规则；{recommendation.get('reason')}"
                    if recommendation else "已加入维护规则"
                )
            ),
        }

    @classmethod
    def _infer_title_season(cls, value: str) -> Optional[int]:
        """从中英日常见续作标题中提取明确季号。"""
        text = str(value or "")
        digit_match = re.search(
            r"(?i)(?:season\s*|第\s*|\bS)(\d{1,2})(?:\s*季|\b)|\b(\d{1,2})(?:st|nd|rd|th)\s+season\b",
            text,
        )
        if digit_match:
            return cls._safe_int(digit_match.group(1) or digit_match.group(2), 0) or None
        chinese_match = re.search(r"第\s*([一二三四五六七八九十]+)\s*季", text)
        if not chinese_match:
            return None
        numbers = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9}
        token = chinese_match.group(1)
        if token == "十":
            return 10
        if "十" in token:
            left, right = token.split("十", 1)
            return numbers.get(left, 1) * 10 + numbers.get(right, 0)
        return numbers.get(token)

    def _normalize_episode_rule(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """校验目标编集规则，并把别名和季度片段转换为稳定结构。"""
        tmdb_id = self._safe_int(payload.get("tmdb_id"), 0)
        if not tmdb_id:
            raise ValueError("请输入有效的 TMDBID")
        target_type = str(payload.get("target_type") or "default").strip().lower()
        if target_type not in ("default", "group"):
            raise ValueError("目标编集只能是 TMDB 默认或剧集组")
        episode_group_id = str(payload.get("episode_group_id") or "").strip()
        if target_type == "group" and not episode_group_id:
            raise ValueError("选择剧集组目标时必须指定 Group ID")

        installments = []
        for index, item in enumerate(payload.get("installments") or []):
            if not isinstance(item, dict):
                continue
            aliases = item.get("aliases") or []
            if isinstance(aliases, str):
                aliases = [value.strip() for value in aliases.split("\n") if value.strip()]
            start_season = self._optional_int(item.get("target_start_season"))
            start_episode = self._optional_int(item.get("target_start_episode"))
            if start_season is None or start_episode is None:
                continue
            installments.append({
                "id": str(item.get("id") or f"segment-{index + 1}"),
                "title": str(item.get("title") or "").strip(),
                "quarter": str(item.get("quarter") or "").strip(),
                "aliases": list(dict.fromkeys(str(value).strip() for value in aliases if str(value).strip())),
                "source_season": self._optional_int(item.get("source_season")),
                "source_start_episode": self._optional_int(item.get("source_start_episode")),
                "target_start_season": start_season,
                "target_start_episode": start_episode,
            })

        return {
            "tmdb_id": tmdb_id,
            "title": str(payload.get("title") or f"TMDB {tmdb_id}").strip(),
            "enabled": bool(payload.get("enabled", True)),
            "target_type": target_type,
            "episode_group_id": episode_group_id if target_type == "group" else "",
            "installments": installments,
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

    @classmethod
    def _normalize_anilist_media(
            cls, media: Dict[str, Any], quarter: str
    ) -> Optional[Dict[str, Any]]:
        """把 AniList Media 转为看板字段，筛选信息在加载阶段一次成形。"""
        media_id = cls._safe_int(media.get("id"), 0)
        titles = media.get("title") or {}
        romaji = cls._clean_title(titles.get("romaji"))
        english = cls._clean_title(titles.get("english"))
        native = cls._clean_title(titles.get("native"))
        if not media_id or not (romaji or english or native):
            return None
        aliases = list(dict.fromkeys(
            value for value in [english, romaji, native, *(media.get("synonyms") or [])]
            if cls._clean_title(value)
        ))
        aliases = [cls._clean_title(value) for value in aliases]
        start = media.get("startDate") or {}
        year = cls._safe_int(start.get("year"), 0)
        month = cls._safe_int(start.get("month"), 0)
        day = cls._safe_int(start.get("day"), 0)
        date = "-".join((
            f"{year:04d}" if year else "0000",
            f"{month:02d}" if month else "00",
            f"{day:02d}" if day else "00",
        ))
        country = str(media.get("countryOfOrigin") or "").upper()
        region = {"JP": "japan", "CN": "china"}.get(country, "western" if country else "unknown")
        relations = (media.get("relations") or {}).get("edges") or []
        has_prequel = any(
            str(edge.get("relationType") or "").upper() == "PREQUEL"
            and str((edge.get("node") or {}).get("type") or "ANIME").upper() == "ANIME"
            for edge in relations if isinstance(edge, dict)
        )
        prequel_years = [
            cls._safe_int(((edge.get("node") or {}).get("startDate") or {}).get("year"), 0)
            for edge in relations if isinstance(edge, dict)
            and str(edge.get("relationType") or "").upper() == "PREQUEL"
        ]
        season_hint = cls._infer_title_season(" ".join(aliases))
        images = media.get("coverImage") or {}
        display_name = english or romaji or native
        platform = str(media.get("format") or "").replace("_", " ")
        catalog_media_type = "movie" if platform == "MOVIE" else "tv"
        return {
            "id": f"anilist:{media_id}",
            "source": "anilist",
            "source_id": media_id,
            "anilist_id": media_id,
            "mal_id": cls._safe_int(media.get("idMal"), 0) or None,
            "quarter": quarter,
            "name": romaji or english or native,
            "name_cn": "",
            "display_name": display_name,
            "aliases": aliases,
            "search_titles": aliases[:8],
            "date": date,
            "episode_count": cls._safe_int(media.get("episodes"), 0),
            "platform": platform,
            "catalog_media_type": catalog_media_type,
            "rule_eligible": catalog_media_type == "tv",
            "region": region,
            "region_name": {
                "japan": "日漫", "china": "国漫", "western": "海外动画", "unknown": "地区未知",
            }[region],
            "is_multi_season": bool(has_prequel or (season_hint and season_hint > 1)),
            "has_prequel": has_prequel,
            "franchise_start_year": min([value for value in [year, *prequel_years] if value] or [year or 0]),
            "country": country,
            "genres": [str(value) for value in media.get("genres") or [] if value],
            "popularity": cls._safe_int(media.get("popularity"), 0),
            "poster": images.get("large") or images.get("medium") or "",
            "url": str(media.get("siteUrl") or f"https://anilist.co/anime/{media_id}"),
            "imported_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

    def _enrich_anibridge_mappings(
            self, catalog: List[Dict[str, Any]], headers: Dict[str, str]
    ) -> None:
        """本地数据库未覆盖时，再用 AniBridge 补充 AniList→TMDB TV 关系。"""
        wanted = {
            self._safe_int(item.get("anilist_id"), 0): item
            for item in catalog
            if self._safe_int(item.get("anilist_id"), 0)
            and not (item.get("tmdb_match") or {}).get("accepted")
        }
        if not wanted:
            return
        response = RequestUtils(
            headers=headers,
            proxies=self._valid_proxies(getattr(settings, "PROXY", None)),
            timeout=60,
        ).get_res(
            "https://github.com/anibridge/anibridge-mappings/releases/download/v3/mappings.min.json"
        )
        if not response:
            raise RuntimeError("AniBridge 映射服务未返回响应")
        response.raise_for_status()
        mappings = response.json()
        candidates: Dict[int, set] = {key: set() for key in wanted}
        for source, targets in mappings.items():
            if not isinstance(targets, dict):
                continue
            anilist_match = re.fullmatch(r"anilist:(\d+)", str(source))
            tmdb_match = re.fullmatch(r"tmdb_show:(\d+):s\d+", str(source))
            if anilist_match:
                anilist_id = self._safe_int(anilist_match.group(1), 0)
                if anilist_id not in wanted:
                    continue
                for descriptor in targets:
                    target = re.fullmatch(r"tmdb_show:(\d+):s\d+", str(descriptor))
                    if target:
                        candidates[anilist_id].add(self._safe_int(target.group(1), 0))
            elif tmdb_match:
                tmdb_id = self._safe_int(tmdb_match.group(1), 0)
                for descriptor in targets:
                    target = re.fullmatch(r"anilist:(\d+)", str(descriptor))
                    if target:
                        anilist_id = self._safe_int(target.group(1), 0)
                        if anilist_id in wanted:
                            candidates[anilist_id].add(tmdb_id)
        for anilist_id, ids in candidates.items():
            valid_ids = sorted(value for value in ids if value)
            item = wanted[anilist_id]
            if (item.get("tmdb_match") or {}).get("accepted"):
                continue
            item["tmdb_candidates"] = valid_ids
            if len(valid_ids) != 1:
                continue
            tmdb_id = valid_ids[0]
            item["tmdb_match"] = {
                "accepted": True,
                "attempted": True,
                "reason": "AniBridge 跨库映射",
                "best": {
                    "tmdb_id": tmdb_id,
                    "name": item.get("display_name") or item.get("name"),
                    "year": str(item.get("date") or "")[:4],
                    "media_type": MediaType.TV.value,
                    "score": 100.0,
                    "source": "anibridge",
                },
                "margin": 100.0,
            }

    def _enrich_cross_id_catalog_mappings(
            self, catalog: List[Dict[str, Any]],
    ) -> int:
        """用看板条目自带的 AniList/Bangumi ID 直接映射 TMDB。"""
        if (
                not self._config.get("anime_cross_id_enabled", True)
                or self._anime_cross_id is None
                or not self._anime_cross_id.status().get("ready")
        ):
            return 0
        matched = 0
        for item in catalog:
            current = item.get("tmdb_match") or {}
            if current.get("accepted"):
                continue
            lookup = self._anime_cross_id.lookup(
                anilist_id=item.get("anilist_id"),
                bangumi_id=(
                    item.get("bangumi_id")
                    or (
                        item.get("source_id")
                        if item.get("source") == "bangumi" else None
                    )
                ),
                media_type=item.get("catalog_media_type"),
            )
            if not lookup.get("accepted"):
                continue
            tmdb_id = self._safe_int(lookup.get("tmdb_id"), 0)
            media_type = self._normalize_media_type(lookup.get("media_type"))
            if not tmdb_id or not media_type:
                continue
            record = lookup.get("record") or {}
            tmdb_path = str(record.get("tmdb_path") or "")
            season_match = re.search(r"/season/(\d+)", tmdb_path)
            if season_match and item.get("source_season") is None:
                item["source_season"] = self._safe_int(season_match.group(1), 0)
            item["tmdb_match"] = {
                "accepted": True,
                "attempted": True,
                "reason": "bangumi-data 跨站 ID 精确映射",
                "best": {
                    "tmdb_id": tmdb_id,
                    "name": item.get("display_name") or item.get("name"),
                    "year": str(item.get("date") or "")[:4],
                    "media_type": media_type.value,
                    "score": 100.0,
                    "source": "bangumi-data",
                },
                "margin": 100.0,
                "cross_id": {
                    "anilist_id": record.get("anilist_id") or item.get("anilist_id"),
                    "bangumi_id": record.get("bangumi_id") or item.get("bangumi_id"),
                    "tmdb_path": tmdb_path,
                },
            }
            matched += 1
        return matched

    @classmethod
    def _normalize_bangumi_subject(
            cls, subject: Dict[str, Any], quarter: str
    ) -> Optional[Dict[str, Any]]:
        """把 Bangumi Subject 转换为季度看板使用的稳定字段。"""
        subject_id = cls._safe_int(subject.get("id"), 0)
        name = cls._clean_title(subject.get("name"))
        name_cn = cls._clean_title(subject.get("name_cn"))
        if not subject_id or not (name or name_cn):
            return None

        aliases: List[str] = []
        for item in subject.get("infobox") or []:
            if not isinstance(item, dict):
                continue
            key = str(item.get("key") or "").casefold()
            if not any(token in key for token in ("别名", "alias", "英文", "日文", "中文")):
                continue
            value = item.get("value")
            if isinstance(value, list):
                values = []
                for entry in value:
                    if isinstance(entry, dict):
                        values.append(entry.get("v") or entry.get("value"))
                    else:
                        values.append(entry)
            else:
                values = re.split(r"[\n、/]", str(value or ""))
            aliases.extend(cls._clean_title(value) for value in values if cls._clean_title(value))
        aliases = list(dict.fromkeys([name, name_cn, *aliases]))
        images = subject.get("images") or {}
        tag_names = [
            str(item.get("name") or "") for item in subject.get("tags") or []
            if isinstance(item, dict)
        ]
        meta_tags = [str(value or "") for value in subject.get("meta_tags") or []]
        region = cls._detect_anime_region([*tag_names, *meta_tags])
        platform = cls._clean_title(subject.get("platform")) or "未知"
        multi_text = " ".join([name, name_cn, *aliases])
        return {
            "id": f"bangumi:{subject_id}",
            "source": "bangumi",
            "source_id": subject_id,
            "quarter": quarter,
            "name": name,
            "name_cn": name_cn,
            "aliases": aliases,
            "date": str(subject.get("date") or ""),
            "episode_count": cls._safe_int(subject.get("total_episodes") or subject.get("eps"), 0),
            "platform": platform,
            "region": region,
            "region_name": {"japan": "日漫", "china": "国漫", "western": "美漫/欧美", "unknown": "地区未知"}[region],
            "is_multi_season": bool(cls._infer_title_season(multi_text) and cls._infer_title_season(multi_text) > 1),
            "tags": tag_names[:12],
            "poster": images.get("common") or images.get("large") or "",
            "url": f"https://bgm.tv/subject/{subject_id}",
            "imported_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

    @staticmethod
    def _detect_anime_region(values: List[str]) -> str:
        """按 Bangumi 标签给看板提供保守的地区筛选。"""
        text = " ".join(str(value or "").casefold() for value in values)
        if any(token in text for token in ("中国", "国产", "大陆", "国漫", "donghua")):
            return "china"
        if any(token in text for token in ("欧美", "美国", "加拿大", "英国", "法国", "欧洲", "american")):
            return "western"
        if any(token in text for token in ("日本", "日漫", "japan")):
            return "japan"
        return "unknown"

    def _close_tmdb_client(self) -> None:
        """安全关闭 TMDB 客户端。"""
        if not self._tmdb_api:
            return
        try:
            self._tmdb_api.close()
        except Exception as err:
            logger.debug(f"[TMDB识别增强] 关闭 TMDB 客户端失败：{err}")
        finally:
            self._tmdb_api = None
            self._episode_normalizer = None
