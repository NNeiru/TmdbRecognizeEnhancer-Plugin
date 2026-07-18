"""MoviePilot TMDB 候选识别增强插件。"""

from __future__ import annotations

import hashlib
import re
import threading
import unicodedata
from calendar import monthrange
from concurrent.futures import ThreadPoolExecutor, as_completed
from copy import deepcopy
from datetime import datetime
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import unquote, urlparse

from fastapi import Body

from app import schemas
from app.core.config import settings
from app.core.event import Event, eventmanager
from app.core.metainfo import MetaInfo
from app.log import logger
from app.modules.themoviedb.tmdbapi import TmdbApi
from app.plugins import _PluginBase
from app.schemas.types import ChainEventType, MediaType
from app.utils.http import RequestUtils

from .episode_normalizer import EpisodeNormalizer
from .metadata_tools import ReleaseGroupRegistry, RenameFieldRegistry
from .performance_diagnostics import PerformanceDiagnostics
from .recognition_rules import FIELD_SPECS, RecognitionRuleRegistry
from .rename_mapping import RenameMappingRegistry
from .runtime_adapter import MoviePilotRuntimeAdapter, SubtitleRenameAdapter


class TmdbRecognizeEnhancer(_PluginBase):
    """提供可解释的 TMDB 候选选择与目标编集季集归一化。"""

    plugin_name = "TMDB 识别增强"
    plugin_desc = "增强 TMDB 候选搜索，并按默认编集或选定剧集组执行动漫集数偏移。"
    plugin_icon = "tmdbrecognizeenhancer.svg"
    plugin_version = "0.5.0-beta.7"
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
    # 季度目录匹配使用独立策略，不继承整理识别的 max_queries、降级开关等参数。
    CATALOG_QUERY_LIMIT = 8
    CATALOG_RESULT_LIMIT = 8
    CATALOG_SCHEMA_VERSION = 2
    DEFAULT_CONFIG: Dict[str, Any] = {
        "enabled": False,
        "recognizer_enabled": True,
        "show_sidebar_nav": True,
        "debug": False,
        "recognition_mode": "tmdb_first",
        "prefer_parsed_title": True,
        "use_year_hint": True,
        "use_original_title_evidence": True,
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
        "release_group_assist_enabled": True,
        "recognition_rule_overrides_enabled": True,
        "release_group_type_weight": 12.0,
        "seasonal_evidence_enabled": True,
        "seasonal_evidence_weight": 18.0,
        "recognition_memory_enabled": True,
        "recognition_memory_weight": 16.0,
        "recognition_memory_min_hits": 3,
        "recognition_memory_ttl_days": 14,
        "custom_rename_fields_enabled": True,
        "rename_mapping_enabled": True,
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
        self._episode_normalizer: Optional[EpisodeNormalizer] = None
        self._runtime_adapter = MoviePilotRuntimeAdapter()
        self._release_group_registry = ReleaseGroupRegistry()
        self._recognition_rules = RecognitionRuleRegistry()
        self._rename_fields = RenameFieldRegistry()
        self._custom_rename_fields: Tuple[Dict[str, Any], ...] = tuple()
        self._rename_mappings = RenameMappingRegistry()
        self._subtitle_rename_adapter = SubtitleRenameAdapter()
        self._diagnostics = PerformanceDiagnostics()
        self._history_lock = threading.RLock()
        self._web_cache_lock = threading.RLock()
        self._web_cache: Dict[Tuple[str, str], List[Dict[str, str]]] = {}
        self._catalog_lock = threading.RLock()
        self._catalog_scans: set = set()
        self._memory_lock = threading.RLock()

    def init_plugin(self, config: Optional[Dict[str, Any]] = None):
        """加载配置并启停名称识别事件处理器。"""
        self._config = self._normalize_config(config or {})
        if self._tmdb_api:
            self._close_tmdb_client()
        self._tmdb_api = TmdbApi()
        self._episode_normalizer = EpisodeNormalizer(self._tmdb_api)
        self._refresh_metadata_tools()
        self._sync_runtime_adapter_state()
        self._sync_subtitle_adapter_state()
        self._sync_event_handler_state()

    def get_state(self) -> bool:
        """返回插件是否启用。"""
        return bool(self._config.get("enabled"))

    @staticmethod
    def get_command() -> List[Dict[str, Any]]:
        """插件当前不注册远程命令。"""
        return []

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
            "title": "TMDB 识别增强",
            "icon": "mdi-database-search-outline",
            "section": "organize",
            "permission": "manage",
            "order": 40,
        }]

    def get_dashboard_meta(self) -> Optional[List[Dict[str, str]]]:
        """启用时提供一个识别决策摘要仪表板组件。"""
        if not self.get_state():
            return []
        return [{"key": "recognize", "name": "TMDB 识别增强"}]

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
                "title": "TMDB 识别增强",
                "subtitle": "候选选择运行摘要",
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
                "summary": "获取 TMDB 识别增强状态",
            },
            {
                "path": "/config",
                "endpoint": self.save_config_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "保存 TMDB 识别增强配置",
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
                "path": "/diagnostics",
                "endpoint": self.get_diagnostics_api,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "按需采样 MoviePilot 和插件性能",
            },
        ]

    def stop_service(self):
        """禁用事件处理器并释放 TMDB 客户端。"""
        self._sync_event_handler_state(enabled=False)
        self._runtime_adapter.uninstall()
        self._subtitle_rename_adapter.uninstall()
        self._close_tmdb_client()

    def get_status(self) -> schemas.Response:
        """返回当前配置、运行摘要和最近识别记录。"""
        history = self._read_history()
        accepted = sum(1 for item in history if item.get("accepted"))
        return schemas.Response(
            success=True,
            data={
                "backend_version": self.plugin_version,
                "api_schema": 2,
                "config": self._current_config(),
                "summary": {
                    "enabled": self.get_state(),
                    "total": len(history),
                    "accepted": accepted,
                    "rejected": len(history) - accepted,
                    "acceptance_rate": round(accepted * 100 / len(history), 1) if history else 0,
                    "recognition_memory": self._recognition_memory_summary(),
                },
                "modules": {
                    "recognizer": {
                        "enabled": bool(self._config.get("recognizer_enabled")),
                        "mode": self._config.get("recognition_mode"),
                        "status": "运行中" if self.get_state() and self._config.get("recognizer_enabled") else "已停用",
                    },
                    "episode_offset": {
                        "enabled": bool(self._config.get("episode_normalizer_enabled")),
                        "status": (
                            "运行中" if self.get_state() and self._config.get("episode_normalizer_enabled")
                            and self._runtime_adapter.compatible else "等待运行时适配"
                            if self.get_state() and self._config.get("episode_normalizer_enabled") else "已停用"
                        ),
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
                        "rule_count": self._rename_mappings.catalog().get("count", 0),
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
                    "runtime_compatible": self._runtime_adapter.compatible,
                    "runtime_message": self._runtime_adapter.message,
                    "plugin_first": bool(getattr(settings, "RECOGNIZE_PLUGIN_FIRST", False)),
                },
            },
        )

    def save_config_api(self, config: dict = Body(...)) -> schemas.Response:
        """校验并保存联邦界面提交的插件配置。"""
        self._config = self._normalize_config(config or {})
        self.update_config(self._current_config())
        self._refresh_metadata_tools()
        self._sync_runtime_adapter_state()
        self._sync_subtitle_adapter_state()
        self._sync_event_handler_state()
        return self.get_status()

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
            "api_schema": 2,
            "release_groups": catalog,
            "release_group_profiles": self._read_release_group_profiles(),
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
            "capabilities": {
                "runtime_override": self._runtime_adapter.compatible,
                "runtime_message": self._runtime_adapter.message,
                "source_mutation": False,
                "custom_independent_field": hasattr(ChainEventType, "TransferRenameBuild"),
                "target_directory_context": hasattr(ChainEventType, "TransferRename"),
                "subtitle_post_mapping": self._subtitle_rename_adapter.compatible,
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
        }
        self.save_data(self.DATA_KEY_RELEASE_GROUP_PROFILES, profiles)
        self._release_group_registry.refresh(profiles)
        return self.get_metadata_tools_api()

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
        """新增或更新一条制作组、命名结果或字幕文件名映射。"""
        current = self._read_rename_mappings()
        rule_id = str(payload.get("id") or "").strip()
        candidate = [item for item in current if not rule_id or item.get("id") != rule_id]
        try:
            normalized = RenameMappingRegistry.validate_rule(payload, candidate)
        except ValueError as err:
            return schemas.Response(success=False, message=str(err))
        self.save_data(self.DATA_KEY_RENAME_MAPPINGS, normalized)
        self._rename_mappings.refresh(normalized)
        return self.get_metadata_tools_api()

    def delete_rename_mapping_api(self, payload: dict = Body(...)) -> schemas.Response:
        """删除一条命名映射。"""
        rule_id = str(payload.get("id") or "").strip()
        rules = [item for item in self._read_rename_mappings() if item.get("id") != rule_id]
        self.save_data(self.DATA_KEY_RENAME_MAPPINGS, rules)
        self._rename_mappings.refresh(rules)
        return self.get_metadata_tools_api()

    def preview_rename_mapping_api(self, payload: dict = Body(...)) -> schemas.Response:
        """按实际顺序试算某一个命名阶段。"""
        stage = str(payload.get("stage") or "rendered_path").strip().lower()
        value = str(payload.get("value") or "")
        output, changes = self._rename_mappings.apply(value, stage)
        return schemas.Response(success=True, data={
            "stage": stage,
            "input": value,
            "output": output,
            "changes": changes,
        })

    def get_diagnostics_api(self) -> schemas.Response:
        """执行一次手动性能采样，不开启轮询或后台线程。"""
        plugin_stats = {
            **self._recognition_rules.runtime_stats(),
            "history_records": len(self._read_history()),
            "episode_rules": len(self._read_episode_rules()),
            "active_catalog_scans": len(self._catalog_scans),
            "web_cache_entries": len(self._web_cache),
            "season_catalog_quarters": len(self._read_season_catalog_cache()),
            "recognition_mode": self._config.get("recognition_mode"),
            "web_search_fallback": bool(self._config.get("web_search_fallback")),
            "fetch_aliases": bool(self._config.get("fetch_aliases")),
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
            result["pipeline"] = [
                {
                    "module": "MoviePilot 标题解析（识别前）",
                    "status": "completed",
                    "summary": f"{title} · 年份 {hints.get('year') or '未提供'} · S{hints.get('season') or '?'}E{hints.get('episode') or '?'}",
                },
                {
                    "module": "制作组辅助",
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
            ]
            return schemas.Response(success=True, data=result)
        except Exception as err:
            logger.error(f"[TMDB识别增强] 试跑失败：{err}")
            return schemas.Response(success=False, message=f"试跑失败：{err}")

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
            },
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
        """选择季度即返回 AniList 看板，并用 AniBridge 预填已知 TMDB 映射。"""
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

        rules = {self._safe_int(item.get("tmdb_id"), 0): item for item in self._read_episode_rules()}
        view = []
        for item in deepcopy(catalog or []):
            matched_id = self._safe_int(((item.get("tmdb_match") or {}).get("best") or {}).get("tmdb_id"), 0)
            item["maintained"] = matched_id in rules if matched_id else False
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
        finally:
            with self._catalog_lock:
                self._catalog_scans.discard(quarter)

    def _scan_catalog_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """完成单条快速匹配及本地化详情补充。"""
        match = item.get("tmdb_match") or {}
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
                    "display_name", "name_cn", "aliases", "rule_eligible", "matched_media_type",
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

    @eventmanager.register(ChainEventType.TransferRenameBuild, priority=1)
    def on_transfer_rename_build(self, event: Event) -> None:
        """在 MP 首次渲染前注入源文件上下文与不依赖目标目录的自定义字段。"""
        if not self.get_state() or not (
                self._config.get("custom_rename_fields_enabled")
                or self._config.get("rename_mapping_enabled")
        ):
            return
        if not event or not event.event_data:
            return
        data = event.event_data
        rename_dict = self._event_get(data, "rename_dict")
        if not isinstance(rename_dict, dict):
            return
        if self._config.get("rename_mapping_enabled") and rename_dict.get("releaseGroup"):
            mapped_group, changes = self._rename_mappings.apply(
                rename_dict.get("releaseGroup"), "release_group"
            )
            rename_dict["releaseGroup"] = mapped_group
            if changes and self._config.get("debug"):
                logger.info(f"[TMDB识别增强] 制作组命名映射：{changes}")
        if not self._config.get("custom_rename_fields_enabled"):
            self._event_set(data, "rename_dict", rename_dict)
            return
        source_context = self._build_rename_source_context(
            self._event_get(data, "source_path"), self._event_get(data, "source_item"),
        )
        rename_dict.update(source_context)
        independent, _ = self._rename_fields.split_by_target_dependency(self._custom_rename_fields)
        values, errors = self._rename_fields.evaluate(independent, rename_dict)
        rename_dict.update(values)
        self._event_set(data, "rename_dict", rename_dict)
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
        if errors and self._config.get("debug"):
            logger.warning(f"[TMDB识别增强] 自定义重命名字段目标阶段失败：{errors}")

    @eventmanager.register(ChainEventType.TransferRename, priority=100)
    def on_transfer_rename_mapping(self, event: Event) -> None:
        """在其它命名处理完成后顺序映射相对路径；字幕语言后缀由运行时适配器随后处理。"""
        if not self.get_state() or not self._config.get("rename_mapping_enabled"):
            return
        if not event or not event.event_data:
            return
        data = event.event_data
        current = (
            self._event_get(data, "updated_str")
            if self._event_get(data, "updated") else self._event_get(data, "render_str")
        )
        mapped, changes = self._rename_mappings.apply(current, "rendered_path")
        if not changes:
            return
        # render_str 只能是相对路径；拒绝规则把整理目标逃逸到媒体库根目录之外。
        candidate = Path(mapped)
        if candidate.is_absolute() or ".." in candidate.parts:
            logger.warning(f"[TMDB识别增强] 命名映射产生了不安全路径，已拒绝：{mapped}")
            return
        self._event_set(data, "render_str", mapped)
        self._event_set(data, "updated", True)
        self._event_set(data, "updated_str", mapped)
        self._event_set(data, "source", self.__class__.__name__)
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

    def _read_release_group_profiles(self) -> Dict[str, Dict[str, str]]:
        """读取制作组类型覆盖并兼容异常旧数据。"""
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
        except Exception as err:
            logger.warning(f"[TMDB识别增强] 识别字段覆盖失败，保留 MP 原结果：{err}")

    def _sync_runtime_adapter_state(self) -> None:
        """只在插件启用期间安装运行时适配器。"""
        if self.get_state():
            self._runtime_adapter.install(self._apply_recognition_rule_overrides)
        else:
            self._runtime_adapter.uninstall()

    def _sync_subtitle_adapter_state(self) -> None:
        """按模块开关安装或恢复 MP 字幕后缀后的文件名映射点。"""
        if self.get_state() and self._config.get("rename_mapping_enabled"):
            self._subtitle_rename_adapter.install(self._apply_subtitle_name_mapping)
        else:
            self._subtitle_rename_adapter.uninstall()

    def _apply_subtitle_name_mapping(self, filename: Any) -> str:
        """由字幕适配器调用；输入输出都只允许是文件名，不改变目录。"""
        mapped, changes = self._rename_mappings.apply(filename, "subtitle_name")
        if changes and self._config.get("debug"):
            logger.info(f"[TMDB识别增强] 字幕文件名映射：{changes}")
        return Path(mapped).name

    def _prepare_recognition_input(self, raw_title: str) -> Tuple[str, Dict[str, Any]]:
        """复用 MoviePilot 元数据解析结果，返回搜索标题与识别提示。"""
        raw_title = self._clean_title(raw_title)
        title = raw_title
        hints = self._extract_hints(raw_title)
        if not raw_title or not self._config.get("prefer_parsed_title", True):
            return title, self._enrich_release_group_hints(hints)

        try:
            meta = MetaInfo(raw_title)
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
            }
            hints.update({key: value for key, value in parsed_hints.items() if value not in (None, "", 0)})
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
        """把制作组分类转换为 TMDB 候选选择可用的轻量证据。"""
        if not self._config.get("release_group_assist_enabled", True):
            return hints
        profile = self._release_group_registry.classify(hints.get("release_group"))
        if profile.get("kind") in ("animation", "live_action"):
            hints["release_group_profile"] = profile
        return hints

    def _apply_runtime_meta(
            self, best: Dict[str, Any], adjustment: Optional[Dict[str, Any]]
    ) -> None:
        """直接写回本次识别 MetaBase，使原版 MP 能按 TMDBID 和目标编集继续处理。"""
        meta = self._runtime_adapter.current_meta()
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
        if adjustment.get("episode_group"):
            meta.episode_group = str(adjustment["episode_group"])

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
        if not bool(getattr(settings, "RECOGNIZE_PLUGIN_FIRST", False)):
            return {
                "applied": False,
                "season": hints.get("season"),
                "episode": hints.get("episode"),
                "end_episode": hints.get("end_episode"),
                "reason": "请先在 MP 中开启识别插件优先，否则原生识别成功时插件不会运行",
                "strategy": "plugin-first-required",
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
        mode = recognition_mode if recognition_mode in ("tmdb_first", "scored") \
            else self._config.get("recognition_mode")
        search_title = title
        if mode == "tmdb_first":
            result = self._recognize_tmdb_first_result(search_title, hints, include_candidates)
            result.update({
                "title": title,
                "search_title": search_title,
            })
            return result

        queries = self._build_queries(search_title)
        candidates = self._search_candidates(queries)
        candidates, type_constraint = self._filter_candidates_by_media_type(
            candidates, hints, type_constraint
        )
        candidates = self._attach_context_evidence(candidates, search_title)
        scored = [self._score_candidate(search_title, queries, candidate, hints) for candidate in candidates]
        scored.sort(key=lambda item: (item["score"], item.get("popularity") or 0), reverse=True)

        ranked, duplicate_summary = self._collapse_duplicate_candidates(scored)
        ranked, shadow_count = self._suppress_shadow_season_entries(ranked, hints)
        duplicate_summary["shadow_season_count"] = shadow_count
        ranked, decisive = self._apply_decisive_year_evidence(ranked, hints)
        best = ranked[0] if ranked else None
        runner_up = ranked[1] if len(ranked) > 1 else None
        margin = round(best["score"] - runner_up["score"], 2) if best and runner_up else (100.0 if best else 0.0)
        raw_margin = margin
        if decisive and margin < 0:
            margin = 0.0
        minimum_score = float(self._config["minimum_score"])
        minimum_margin = float(self._config["minimum_margin"])
        margin_waived = bool(decisive and best and best["score"] >= minimum_score)
        accepted = bool(
            best and best["score"] >= minimum_score
            and (margin >= minimum_margin or margin_waived)
        )
        web_search = {"attempted": False}

        if self._config.get("web_search_fallback") and not accepted:
            candidates, web_search = self._apply_web_search_fallback(search_title, hints, candidates)
            candidates, type_constraint = self._filter_candidates_by_media_type(
                candidates, hints, type_constraint
            )
            candidates = self._attach_context_evidence(candidates, search_title)
            scored = [self._score_candidate(search_title, queries, candidate, hints) for candidate in candidates]
            scored.sort(key=lambda item: (item["score"], item.get("popularity") or 0), reverse=True)
            ranked, duplicate_summary = self._collapse_duplicate_candidates(scored)
            ranked, shadow_count = self._suppress_shadow_season_entries(ranked, hints)
            duplicate_summary["shadow_season_count"] = shadow_count
            ranked, decisive = self._apply_decisive_year_evidence(ranked, hints)
            best = ranked[0] if ranked else None
            runner_up = ranked[1] if len(ranked) > 1 else None
            margin = round(best["score"] - runner_up["score"], 2) if best and runner_up else (100.0 if best else 0.0)
            raw_margin = margin
            if decisive and margin < 0:
                margin = 0.0
            margin_waived = bool(decisive and best and best["score"] >= minimum_score)
            accepted = bool(
                best and best["score"] >= minimum_score
                and (margin >= minimum_margin or margin_waived)
            )

        if not best:
            if type_constraint.get("active") and type_constraint.get("removed_count"):
                reason = (
                    f"类型约束为{type_constraint['label']}，TMDB 返回的候选均为其他类型，已安全拒绝"
                )
            else:
                reason = "TMDB 与搜索引擎兜底均未返回可验证候选" if web_search.get("attempted") \
                    else "所有降级搜索词均未返回 TMDB 候选"
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
            "web_search": web_search,
            "type_constraint": type_constraint,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        if include_candidates:
            result["candidates"] = scored
        return result

    def _recognize_tmdb_first_result(
            self,
            title: str,
            hints: Dict[str, Any],
            include_candidates: bool,
    ) -> Dict[str, Any]:
        """独立执行一次 TMDB Multi Search，并直接采用第一个影视候选。"""
        query = self._clean_title(title)
        queries = [query] if query else []
        candidates = self._search_candidates(queries)
        type_constraint = self._resolve_media_type_constraint(hints)
        candidates, type_constraint = self._filter_candidates_by_media_type(
            candidates, hints, type_constraint
        )
        candidates, release_group_preference = self._prefer_candidates_by_release_group(
            candidates, hints
        )
        candidates = self._attach_context_evidence(candidates, title)
        candidates.sort(
            key=lambda item: self._safe_float(item.get("_context_priority"), 0.0),
            reverse=True,
        )
        diagnostics = [self._score_candidate(title, queries, item, hints) for item in candidates]
        best = diagnostics[0] if diagnostics else None
        runner_up = diagnostics[1] if len(diagnostics) > 1 else None
        if best:
            # 评分仅保留为诊断信息，不参与该模式的选择。
            best["diagnostic_score"] = best.get("score")
            best["score"] = 100.0
        result = {
            "accepted": bool(best),
            "selection_mode": "tmdb_first",
            "title": title,
            "reason": (
                f"单次 TMDB Multi Search 已直接采用第一个{type_constraint.get('label') or '影视'}结果；"
                + (
                    f"制作组标记为{release_group_preference['label']}，已优先符合题材的候选；"
                    if release_group_preference.get("applied") else ""
                )
                + (
                    "当季目录或近期识别记忆已调整候选优先级；"
                    if best and self._safe_float(best.get("context_priority"), 0) > 0 else ""
                )
                + "评分与分差未参与决策"
                if best else (
                    f"类型约束为{type_constraint['label']}，TMDB 未返回该类型候选"
                    if type_constraint.get("active") else
                    "单次 TMDB Multi Search 未返回电影或电视剧结果"
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
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        if include_candidates:
            result["candidates"] = diagnostics
        return result

    def _prefer_candidates_by_release_group(
            self, candidates: List[Dict[str, Any]], hints: Dict[str, Any]
    ) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """首结果模式中稳定优先制作组题材一致候选，无一致项时保持 TMDB 顺序。"""
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
        }
        if not summary["active"] or len(candidates) < 2:
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
        if not preferred:
            return candidates, summary
        reordered = [*preferred, *unknown, *conflicting]
        summary["applied"] = reordered[0] is not candidates[0]
        summary["matching_count"] = len(preferred)
        return reordered, summary

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

    def _search_candidates(self, queries: List[str]) -> List[Dict[str, Any]]:
        """按查询词检索 TMDB，去重后为有限数量候选补充别名详情。"""
        if not self._tmdb_api:
            self._tmdb_api = TmdbApi()
        candidate_limit = int(self._config["candidate_limit"])
        collected: Dict[Tuple[str, int], Dict[str, Any]] = {}
        for query_index, query in enumerate(queries):
            results = self._tmdb_api.search_multiis(query) or []
            valid_results = []
            for raw in results[:candidate_limit]:
                media_type = self._normalize_media_type(raw.get("media_type"))
                tmdb_id = self._safe_int(raw.get("id"), 0)
                if not media_type or not tmdb_id:
                    continue
                valid_results.append((raw, media_type, tmdb_id))
            result_count = len(valid_results)
            for rank, (raw, media_type, tmdb_id) in enumerate(valid_results):
                key = (media_type.value, tmdb_id)
                candidate = collected.setdefault(key, dict(raw))
                hits = candidate.setdefault("_query_hits", [])
                hits.append({
                    "query": query,
                    "query_index": query_index,
                    "rank": rank,
                    "result_count": result_count,
                    "source": "tmdb",
                })

        ordered = sorted(
            collected.values(),
            key=lambda item: min(
                (hit["query_index"], hit["rank"]) for hit in item.get("_query_hits", [])
            ),
        )
        if self._config.get("fetch_aliases"):
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
        """返回当前自然季度键；季度证据只使用这一期，避免旧缓存干扰。"""
        now = now or datetime.now()
        return f"{now.year}-Q{(now.month - 1) // 3 + 1}"

    def _seasonal_candidate_evidence(
            self, candidate: Dict[str, Any], title: str,
            quarter: str = "", items: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """用已缓存的当季 AniList→TMDB 映射提供无网络软证据。"""
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
        return {
            "active": True,
            "component": round(100.0 if best_relation >= 72 else 82.0, 2),
            "quarter": quarter,
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
        """一次读取上下文，将当季与近期记忆注入当前候选并形成稳定优先级。"""
        memory = self._read_recognition_memory() if self._config.get("recognition_memory_enabled") else {"entries": {}}
        quarter = self._current_quarter_key()
        quarter_data = {}
        if self._config.get("seasonal_evidence_enabled"):
            quarter_data = self._read_season_catalog_cache().get(quarter) or {}
        seasonal_items = quarter_data.get("items") if isinstance(quarter_data, dict) else []
        for candidate in candidates:
            seasonal = self._seasonal_candidate_evidence(
                candidate, title, quarter=quarter, items=seasonal_items,
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
        tmdb_hits = [hit for hit in hits if hit.get("source", "tmdb") == "tmdb"]
        best_rank = min((hit.get("rank", 0) for hit in tmdb_hits), default=int(self._config["candidate_limit"]))
        rank_component = max(0.0, 100.0 - best_rank * (100.0 / max(int(self._config["candidate_limit"]), 1)))
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
        requested_year = self._normalize_year(hints.get("year"))
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
            if season_numbers:
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
            "media_type": candidate_type.value if candidate_type else "",
            "score": score,
            "popularity": round(float(candidate.get("popularity") or 0), 2),
            "vote_count": self._safe_int(candidate.get("vote_count"), 0),
            "query_index": best_query_index,
            "tmdb_rank": best_rank,
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
            "web_discovered": bool(candidate.get("_web_discovered")),
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
                and self._safe_int(item.get("tmdb_rank"), 99)
                <= self._safe_int(child.get("tmdb_rank"), 99)
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
        requested_year = self._normalize_year(hints.get("year"))
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
        merged = {**self.DEFAULT_CONFIG, **(config or {})}
        bool_keys = (
            "enabled", "recognizer_enabled", "show_sidebar_nav", "debug", "prefer_parsed_title",
            "use_year_hint", "use_original_title_evidence", "web_search_fallback",
            "main_title_fallback",
            "progressive_fallback", "fetch_aliases", "episode_normalizer_enabled",
            "release_group_assist_enabled", "recognition_rule_overrides_enabled",
            "seasonal_evidence_enabled", "recognition_memory_enabled",
            "custom_rename_fields_enabled", "rename_mapping_enabled",
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
        if has_search and result.get("accepted"):
            self._remember_recognition(result)
        record = {
            key: result.get(key)
            for key in (
                "accepted", "title", "original_title", "reason", "queries", "hints",
                "best", "runner_up", "margin", "web_search", "episode_adjustment", "selection_mode", "created_at",
            )
        }
        record["module"] = (
            "TMDB 搜索增强 + 集数偏移" if has_search and adjustment is not None
            else "集数偏移" if adjustment is not None else "TMDB 搜索增强"
        )
        record["level"] = "success" if result.get("accepted") else "warning"
        with self._history_lock:
            records = self._read_history()
            records.insert(0, record)
            self.save_data(self.DATA_KEY_HISTORY, records[: int(self._config["history_limit"])])

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
            if not self._tmdb_api:
                self._tmdb_api = TmdbApi()
            self._episode_normalizer = EpisodeNormalizer(self._tmdb_api)
        return self._episode_normalizer

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
        if existing:
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
        """一次下载每日映射并只保留当前季度的 AniList→TMDB TV 关系。"""
        wanted = {
            self._safe_int(item.get("anilist_id"), 0): item
            for item in catalog if self._safe_int(item.get("anilist_id"), 0)
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
