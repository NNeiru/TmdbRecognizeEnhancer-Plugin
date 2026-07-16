"""MoviePilot TMDB 候选识别增强插件。"""

from __future__ import annotations

import re
import threading
import unicodedata
from copy import deepcopy
from datetime import datetime
from difflib import SequenceMatcher
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
from .runtime_adapter import MoviePilotRuntimeAdapter


class TmdbRecognizeEnhancer(_PluginBase):
    """提供可解释的 TMDB 候选选择与目标编集季集归一化。"""

    plugin_name = "TMDB 识别增强"
    plugin_desc = "增强 TMDB 候选识别，并将动漫季集归一化到默认编集或选定剧集组。"
    plugin_icon = "tmdbrecognizeenhancer.svg"
    plugin_version = "0.3.0"
    plugin_author = "NNeiru"
    author_url = "https://github.com/NNeiru"
    plugin_config_prefix = "tmdbrecognizeenhancer_"
    plugin_order = 42
    auth_level = 1

    DATA_KEY_HISTORY = "recognize_history"
    DATA_KEY_EPISODE_RULES = "episode_normalizer_rules"
    DATA_KEY_SEASON_CATALOG = "season_catalog"
    DEFAULT_CONFIG: Dict[str, Any] = {
        "enabled": False,
        "show_sidebar_nav": True,
        "debug": False,
        "prefer_parsed_title": True,
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
        "year_weight": 8.0,
        "type_weight": 6.0,
        "season_missing_penalty": 20.0,
        "history_limit": 30,
        "episode_normalizer_enabled": False,
    }

    _split_pattern = re.compile(r"\s*(?::|：|\||｜|/|／|—|–)\s*")
    _bracket_suffix_pattern = re.compile(r"\s*[\[(（【][^\])）】]{1,40}[\])）】]\s*$")
    _season_pattern = re.compile(r"(?i)(?:\bS(?:eason)?\s*0*(\d{1,2})\b|第\s*(\d{1,2})\s*季)")
    _episode_pattern = re.compile(r"(?i)(?:\bE(?:P(?:ISODE)?)?\s*0*(\d{1,4})\b|第\s*(\d{1,4})\s*[集话])")
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
    _ddgs_auto_backend = "duckduckgo,google,brave,yahoo,yandex,mojeek"

    def __init__(self):
        """初始化运行时对象，网络客户端延迟到插件初始化阶段创建。"""
        super().__init__()
        self._config = dict(self.DEFAULT_CONFIG)
        self._tmdb_api: Optional[TmdbApi] = None
        self._episode_normalizer: Optional[EpisodeNormalizer] = None
        self._runtime_adapter = MoviePilotRuntimeAdapter()
        self._history_lock = threading.RLock()

    def init_plugin(self, config: Optional[Dict[str, Any]] = None):
        """加载配置并启停名称识别事件处理器。"""
        self._config = self._normalize_config(config or {})
        if self._tmdb_api:
            self._close_tmdb_client()
        self._tmdb_api = TmdbApi()
        self._episode_normalizer = EpisodeNormalizer(self._tmdb_api)
        self._sync_runtime_adapter_state()
        self._sync_event_handler_state()

    def get_state(self) -> bool:
        """返回插件是否启用。"""
        return bool(self._config.get("enabled"))

    @staticmethod
    def get_command() -> List[Dict[str, Any]]:
        """插件当前不注册远程命令。"""
        return []

    @staticmethod
    def get_render_mode() -> Tuple[str, str]:
        """声明使用 Vue 模块联邦界面。"""
        return "vue", "dist/assets"

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
                "path": "/episode-normalizer/catalog/import",
                "endpoint": self.import_season_catalog_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "从 Bangumi 导入季度动画目录",
            },
            {
                "path": "/episode-normalizer/catalog/match",
                "endpoint": self.match_season_catalog_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "为季度动画匹配 TMDB 候选",
            },
        ]

    def stop_service(self):
        """禁用事件处理器并释放 TMDB 客户端。"""
        self._sync_event_handler_state(enabled=False)
        self._runtime_adapter.uninstall()
        self._close_tmdb_client()

    def get_status(self) -> schemas.Response:
        """返回当前配置、运行摘要和最近识别记录。"""
        history = self._read_history()
        accepted = sum(1 for item in history if item.get("accepted"))
        return schemas.Response(
            success=True,
            data={
                "config": self._current_config(),
                "summary": {
                    "enabled": self.get_state(),
                    "total": len(history),
                    "accepted": accepted,
                    "rejected": len(history) - accepted,
                    "acceptance_rate": round(accepted * 100 / len(history), 1) if history else 0,
                },
                "history": history,
                "episode_normalizer": {
                    "enabled": bool(self._config.get("episode_normalizer_enabled")),
                    "rule_count": len(self._read_episode_rules()),
                    "catalog_count": len(self._read_season_catalog()),
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
        self._sync_runtime_adapter_state()
        self._sync_event_handler_state()
        return self.get_status()

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
        try:
            result = self._recognize_title(title, hints=hints, include_candidates=True)
            result["original_title"] = raw_title if raw_title != title else ""
            return schemas.Response(success=True, data=result)
        except Exception as err:
            logger.error(f"[TMDB识别增强] 试跑失败：{err}")
            return schemas.Response(success=False, message=f"试跑失败：{err}")

    def clear_history_api(self) -> schemas.Response:
        """清空插件保存的最近识别历史。"""
        with self._history_lock:
            self.save_data(self.DATA_KEY_HISTORY, [])
        return self.get_status()

    def get_episode_normalizer_api(self) -> schemas.Response:
        """返回目标编集规则和已导入的季度番剧条目。"""
        return schemas.Response(
            success=True,
            data={
                "rules": self._read_episode_rules(),
                "catalog": self._read_season_catalog(),
                "enabled": bool(self._config.get("episode_normalizer_enabled")),
            },
        )

    def save_episode_rule_api(self, payload: dict = Body(...)) -> schemas.Response:
        """新增或更新一个 TMDBID 的目标编集规则。"""
        try:
            rule = self._normalize_episode_rule(payload or {})
        except ValueError as err:
            return schemas.Response(success=False, message=str(err))
        rules = self._read_episode_rules()
        rules = [item for item in rules if self._safe_int(item.get("tmdb_id"), 0) != rule["tmdb_id"]]
        rules.append(rule)
        rules.sort(key=lambda item: (str(item.get("title") or ""), item.get("tmdb_id") or 0))
        self.save_data(self.DATA_KEY_EPISODE_RULES, rules)
        if self._episode_normalizer:
            self._episode_normalizer.clear_cache()
        return schemas.Response(success=True, data={"rule": rule, "rules": rules})

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
        """试跑某一条规则，不写入识别链。"""
        payload = payload or {}
        tmdb_id = self._safe_int(payload.get("tmdb_id"), 0)
        rule = next((
            item for item in self._read_episode_rules()
            if self._safe_int(item.get("tmdb_id"), 0) == tmdb_id
        ), None)
        if not rule:
            try:
                rule = self._normalize_episode_rule(payload.get("rule") or payload)
            except ValueError as err:
                return schemas.Response(success=False, message=str(err))
        result = self._normalizer().normalize(
            rule=rule,
            season=self._optional_int(payload.get("season")),
            episode=self._optional_int(payload.get("episode")),
            end_episode=self._optional_int(payload.get("end_episode")),
            raw_title=str(payload.get("title") or ""),
            parsed_name=str(payload.get("parsed_name") or ""),
        )
        return schemas.Response(success=True, data={"rule": rule, "result": result})

    def import_season_catalog_api(self, payload: dict = Body(...)) -> schemas.Response:
        """通过 Bangumi 官方 API 导入指定季度首月的动画条目。"""
        payload = payload or {}
        year = self._safe_int(payload.get("year"), datetime.now().year)
        quarter = self._safe_int(payload.get("quarter"), 1)
        if year < 1900 or year > 2099 or quarter not in (1, 2, 3, 4):
            return schemas.Response(success=False, message="年份或季度无效")
        month = 1 + (quarter - 1) * 3
        headers = {
            "User-Agent": (
                "NNeiru/TmdbRecognizeEnhancer-Plugin "
                "(https://github.com/NNeiru/TmdbRecognizeEnhancer-Plugin)"
            ),
            "Accept": "application/json",
        }
        try:
            items = self._fetch_bangumi_quarter_month(year, month, headers)
        except Exception as err:
            logger.error(f"[TMDB识别增强] 导入 {year}-Q{quarter} Bangumi 目录失败：{err}")
            return schemas.Response(success=False, message=f"Bangumi 导入失败：{err}")

        quarter_key = f"{year}-Q{quarter}"
        imported = [self._normalize_bangumi_subject(item, quarter_key) for item in items if isinstance(item, dict)]
        imported = [item for item in imported if item]
        existing = self._read_season_catalog()
        index = {str(item.get("id")): item for item in existing if item.get("id")}
        for item in imported:
            previous = index.get(item["id"]) or {}
            index[item["id"]] = {**previous, **item, "tmdb_match": previous.get("tmdb_match")}
        catalog = sorted(index.values(), key=lambda item: (str(item.get("quarter") or ""), str(item.get("date") or ""), str(item.get("name") or "")), reverse=True)
        self.save_data(self.DATA_KEY_SEASON_CATALOG, catalog)
        return schemas.Response(
            success=True,
            data={"quarter": quarter_key, "imported": len(imported), "catalog": catalog},
        )

    def _fetch_bangumi_quarter_month(
            self, year: int, month: int, headers: Dict[str, str]
    ) -> List[Dict[str, Any]]:
        """分页读取季度首月条目，避免 Bangumi 单页 100 条造成静默缺失。"""
        page_size = 100
        offset = 0
        total: Optional[int] = None
        items: List[Dict[str, Any]] = []
        request = RequestUtils(
            headers=headers,
            proxies=self._valid_proxies(getattr(settings, "PROXY", None)),
            timeout=20,
        )
        while total is None or offset < total:
            url = (
                "https://api.bgm.tv/v0/subjects"
                f"?type=2&sort=date&year={year}&month={month}"
                f"&limit={page_size}&offset={offset}"
            )
            response = request.get_res(url)
            if not response:
                raise RuntimeError(f"Bangumi API 第 {offset // page_size + 1} 页未返回响应")
            response.raise_for_status()
            raw = response.json()
            page = raw.get("data") if isinstance(raw, dict) else raw
            if not isinstance(page, list):
                raise RuntimeError("Bangumi API 返回了无法识别的数据结构")
            items.extend(item for item in page if isinstance(item, dict))
            total = self._safe_int(raw.get("total"), len(items)) if isinstance(raw, dict) else len(items)
            offset += len(page)
            if not page or len(items) >= 500:
                break
        return items

    def match_season_catalog_api(self, payload: dict = Body(...)) -> schemas.Response:
        """使用现有 TMDB 候选算法为一个季度条目匹配 TMDBID。"""
        item_id = str((payload or {}).get("id") or "").strip()
        catalog = self._read_season_catalog()
        item = next((value for value in catalog if str(value.get("id")) == item_id), None)
        if not item:
            return schemas.Response(success=False, message="季度条目不存在")
        year = str(item.get("date") or "")[:4]
        hints = {"year": year, "media_type": MediaType.TV, "season": 0, "episode": 0}
        results = []
        for title in dict.fromkeys([item.get("name"), item.get("name_cn"), *(item.get("aliases") or [])]):
            title = self._clean_title(title)
            if not title:
                continue
            try:
                results.append(self._recognize_title(title, hints=hints, include_candidates=False))
            except Exception as err:
                logger.debug(f"[TMDB识别增强] 季度条目 {title} 匹配失败：{err}")
        accepted = [result for result in results if result.get("accepted") and result.get("best")]
        accepted.sort(key=lambda result: (result["best"].get("score") or 0, result.get("margin") or 0), reverse=True)
        match = accepted[0] if accepted else (results[0] if results else None)
        item["tmdb_match"] = {
            "accepted": bool(match and match.get("accepted")),
            "reason": match.get("reason") if match else "没有可用标题",
            "best": match.get("best") if match else None,
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        self.save_data(self.DATA_KEY_SEASON_CATALOG, catalog)
        return schemas.Response(success=True, data={"item": item, "catalog": catalog})

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

    def _sync_runtime_adapter_state(self) -> None:
        """只在插件启用期间安装运行时适配器。"""
        if self.get_state():
            self._runtime_adapter.install()
        else:
            self._runtime_adapter.uninstall()

    def _prepare_recognition_input(self, raw_title: str) -> Tuple[str, Dict[str, Any]]:
        """复用 MoviePilot 元数据解析结果，返回搜索标题与识别提示。"""
        raw_title = self._clean_title(raw_title)
        title = raw_title
        hints = self._extract_hints(raw_title)
        if not raw_title or not self._config.get("prefer_parsed_title", True):
            return title, hints

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
            }
            hints.update({key: value for key, value in parsed_hints.items() if value not in (None, "", 0)})
            if self._config.get("debug") and title != raw_title:
                logger.info(f"[TMDB识别增强] 使用 MoviePilot 解析标题：{raw_title} => {title}")
        except Exception as err:
            logger.warning(f"[TMDB识别增强] MoviePilot 标题解析失败，回退原标题：{raw_title}，{err}")
        return title, hints

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
            }
            hints.update({key: value for key, value in runtime_hints.items() if value not in (None, "")})
            return parsed_name, hints

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
        }
        hints.update({key: value for key, value in parsed_hints.items() if value not in (None, "")})
        return parsed_name, hints

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
    ) -> Dict[str, Any]:
        """生成降级搜索词、检索并评分候选，返回可解释的选择结果。"""
        merged_hints = self._extract_hints(title)
        for key, value in (hints or {}).items():
            if value not in (None, "", 0):
                merged_hints[key] = value
        hints = merged_hints
        queries = self._build_queries(title)
        candidates = self._search_candidates(queries)
        scored = [self._score_candidate(title, queries, candidate, hints) for candidate in candidates]
        scored.sort(key=lambda item: (item["score"], item.get("popularity") or 0), reverse=True)

        best = scored[0] if scored else None
        runner_up = scored[1] if len(scored) > 1 else None
        margin = round(best["score"] - runner_up["score"], 2) if best and runner_up else (100.0 if best else 0.0)
        minimum_score = float(self._config["minimum_score"])
        minimum_margin = float(self._config["minimum_margin"])
        accepted = bool(best and best["score"] >= minimum_score and margin >= minimum_margin)
        web_search = {"attempted": False}

        if self._config.get("web_search_fallback") and not accepted:
            candidates, web_search = self._apply_web_search_fallback(title, hints, candidates)
            scored = [self._score_candidate(title, queries, candidate, hints) for candidate in candidates]
            scored.sort(key=lambda item: (item["score"], item.get("popularity") or 0), reverse=True)
            best = scored[0] if scored else None
            runner_up = scored[1] if len(scored) > 1 else None
            margin = round(best["score"] - runner_up["score"], 2) if best and runner_up else (100.0 if best else 0.0)
            accepted = bool(best and best["score"] >= minimum_score and margin >= minimum_margin)

        if not best:
            reason = "TMDB 与搜索引擎兜底均未返回可验证候选" if web_search.get("attempted") \
                else "所有降级搜索词均未返回 TMDB 候选"
        elif best["score"] < minimum_score:
            reason = f"最佳候选 {best['score']} 分，低于阈值 {minimum_score:g}"
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
            "title": title,
            "reason": reason,
            "queries": queries,
            "hints": self._serialize_hints(hints),
            "best": best,
            "runner_up": runner_up,
            "margin": margin,
            "web_search": web_search,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        if include_candidates:
            result["candidates"] = scored
        return result

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
                (hit["rank"], hit["query_index"]) for hit in item.get("_query_hits", [])
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
        """用搜索结果发现 TMDB ID，并以标题共现证据增强已有候选。"""
        query = f"{title} TMDB"
        results = self._search_web(query)
        summary = {
            "attempted": True,
            "query": query,
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
                return [
                    {
                        "title": str(item.get("title") or "").strip(),
                        "snippet": str(item.get("body") or item.get("snippet") or "").strip(),
                        "url": str(item.get("href") or item.get("url") or "").strip(),
                    }
                    for item in raw_results
                    if isinstance(item, dict)
                ]
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
            if query_coverage >= 0.55 and alias_coverage >= 0.45:
                score = (query_coverage * 0.45 + alias_coverage * 0.55) * 100
                score += 4.0 if direct_match else 0.0
                score -= rank * 3.0
            elif direct_match:
                # 仅有搜索排名而无罗马音/别名共现时，不足以越过默认外部证据阈值。
                score = 60.0 - rank * 4.0
            else:
                score = 0.0
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
        exact_original = any(self._normalize_text(alias) == original_normalized for alias in aliases)
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

        weight_total = sum(weight for _, weight in weighted if weight > 0)
        score = sum(value * weight for value, weight in weighted if weight > 0) / weight_total if weight_total else 0
        if exact_original:
            score = 100.0
        requested_season = self._safe_int(hints.get("season"), 0)
        season_exists = None
        if requested_season and candidate_type == MediaType.TV:
            season_numbers = {
                self._safe_int(season.get("season_number"), -1)
                for season in candidate.get("seasons") or []
                if isinstance(season, dict)
            }
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
            "matched_name": best_components["matched_name"],
            "exact_original": exact_original,
            "season_exists": season_exists,
            "web_discovered": bool(candidate.get("_web_discovered")),
            "web_evidence": web_evidence,
            "web_evidence_url": candidate.get("_web_evidence_url") or "",
            "query_confidence": query_confidence,
            "query_evidence": query_evidence,
            "components": {
                "token": round(best_components["token"], 1),
                "similarity": round(best_components["similarity"], 1),
                "prefix": round(best_components["prefix"], 1),
                "rank": round(rank_component, 1),
                "query": query_confidence,
                "year": year_component,
                "type": type_component,
                "web": web_evidence,
            },
            "queries": [hit.get("query") for hit in hits],
        }

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
        season = next((int(value) for value in season_match.groups() if value), 0) if season_match else 0
        episode = next((int(value) for value in episode_match.groups() if value), 0) if episode_match else 0
        return {
            "year": year_match.group(1) if year_match else "",
            "media_type": MediaType.TV if season or episode else None,
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
            "enabled", "show_sidebar_nav", "debug", "prefer_parsed_title", "web_search_fallback",
            "main_title_fallback",
            "progressive_fallback", "fetch_aliases", "episode_normalizer_enabled",
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
            "year_weight": (0.0, 100.0),
            "type_weight": (0.0, 100.0),
            "season_missing_penalty": (0.0, 100.0),
            "web_search_min_evidence": (50.0, 100.0),
        }
        for key, (minimum, maximum) in float_ranges.items():
            value = self._safe_float(merged.get(key), float(self.DEFAULT_CONFIG[key]))
            merged[key] = max(minimum, min(maximum, value))
        scoring_keys = (
            "token_weight", "similarity_weight", "prefix_weight", "rank_weight",
            "query_confidence_weight",
        )
        if not any(merged.get(key) for key in scoring_keys):
            for key in scoring_keys:
                merged[key] = self.DEFAULT_CONFIG[key]
        engine = str(merged.get("web_search_engine") or "auto").strip().lower()
        merged["web_search_engine"] = engine if engine in self._web_search_engines else "auto"
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
        """保存精简后的识别结论，避免候选详情无限增长。"""
        record = {
            key: result.get(key)
            for key in (
                "accepted", "title", "original_title", "reason", "queries", "hints",
                "best", "runner_up", "margin", "web_search", "episode_adjustment", "created_at",
            )
        }
        with self._history_lock:
            records = self._read_history()
            records.insert(0, record)
            self.save_data(self.DATA_KEY_HISTORY, records[: int(self._config["history_limit"])])

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

    def _read_season_catalog(self) -> List[Dict[str, Any]]:
        """读取季度番剧目录。"""
        catalog = self.get_data(self.DATA_KEY_SEASON_CATALOG) or []
        return deepcopy(catalog) if isinstance(catalog, list) else []

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
            "poster": images.get("common") or images.get("large") or "",
            "url": f"https://bgm.tv/subject/{subject_id}",
            "imported_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

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
