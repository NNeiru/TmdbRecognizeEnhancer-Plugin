"""MoviePilot TMDB 候选识别增强插件。"""

from __future__ import annotations

import re
import threading
import unicodedata
from datetime import datetime
from difflib import SequenceMatcher
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import unquote

from fastapi import Body

from app import schemas
from app.core.config import settings
from app.core.event import Event, eventmanager
from app.core.metainfo import MetaInfo
from app.log import logger
from app.modules.themoviedb.tmdbapi import TmdbApi
from app.plugins import _PluginBase
from app.schemas.types import ChainEventType, MediaType


class TmdbRecognizeEnhancer(_PluginBase):
    """在原生识别失败后，通过降级搜索词和候选评分提供 TMDB 标准名称。"""

    plugin_name = "TMDB 识别增强"
    plugin_desc = "原生识别失败后降级搜索 TMDB，并以标题、年份、类型和季信息对候选进行受控评分。"
    plugin_icon = "tmdbrecognizeenhancer.svg"
    plugin_version = "0.2.3"
    plugin_author = "NNeiru"
    author_url = "https://github.com/NNeiru"
    plugin_config_prefix = "tmdbrecognizeenhancer_"
    plugin_order = 42
    auth_level = 1

    DATA_KEY_HISTORY = "recognize_history"
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
        self._history_lock = threading.RLock()

    def init_plugin(self, config: Optional[Dict[str, Any]] = None):
        """加载配置并启停名称识别事件处理器。"""
        self._config = self._normalize_config(config or {})
        if self._tmdb_api:
            self._close_tmdb_client()
        self._tmdb_api = TmdbApi()
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
        ]

    def stop_service(self):
        """禁用事件处理器并释放 TMDB 客户端。"""
        self._sync_event_handler_state(enabled=False)
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
            },
        )

    def save_config_api(self, config: dict = Body(...)) -> schemas.Response:
        """校验并保存联邦界面提交的插件配置。"""
        self._config = self._normalize_config(config or {})
        self.update_config(self._current_config())
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

    @eventmanager.register(ChainEventType.NameRecognize, priority=5)
    def on_name_recognize(self, event: Event) -> None:
        """处理原生识别失败事件，并在高置信度时写回标准 TMDB 名称。"""
        if not self.get_state() or not event or not event.event_data:
            return
        event_data = event.event_data
        if self._event_get(event_data, "source_plugin") or self._event_get(event_data, "name"):
            return
        raw_title = self._clean_title(self._event_get(event_data, "title"))
        if not raw_title:
            return

        title, hints = self._prepare_recognition_input(raw_title)
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

        self._append_history(result)
        best = result.get("best") or {}
        if not result.get("accepted") or not best.get("name"):
            if self._config.get("debug"):
                logger.info(f"[TMDB识别增强] 拒绝注入：{title}，{result.get('reason')}")
            return

        self._event_set(event_data, "name", best.get("name"))
        self._event_set(event_data, "year", best.get("year") or "")
        self._event_set(event_data, "season", hints.get("season") or 0)
        self._event_set(event_data, "episode", hints.get("episode") or 0)
        self._event_set(event_data, "source_plugin", self.__class__.__name__)
        self._event_set(event_data, "confidence", round(float(best.get("score") or 0) / 100, 3))
        self._event_set(event_data, "reason", result.get("reason"))
        logger.info(
            f"[TMDB识别增强] {raw_title} => {best.get('name')} ({best.get('year') or '未知年份'}) "
            f"TMDB {best.get('tmdb_id')}，得分 {best.get('score')}，分差 {result.get('margin')}"
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
            return proxy_setting.get("http") or proxy_setting.get("https")
        return str(proxy_setting).strip() if proxy_setting else None

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
            "progressive_fallback", "fetch_aliases",
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
                "best", "runner_up", "margin", "web_search", "created_at",
            )
        }
        with self._history_lock:
            records = self._read_history()
            records.insert(0, record)
            self.save_data(self.DATA_KEY_HISTORY, records[: int(self._config["history_limit"])])

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
