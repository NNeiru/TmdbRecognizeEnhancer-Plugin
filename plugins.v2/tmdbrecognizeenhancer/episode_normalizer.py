"""把来源季集坐标归一化到用户选择的 TMDB 默认编集或剧集组。"""

from __future__ import annotations

import re
import threading
from copy import deepcopy
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional, Tuple

from app.schemas.types import MediaType


class EpisodeNormalizer:
    """基于 TMDB Episode ID、目标坐标和全局顺序进行安全的季集归一化。"""

    _alias_space_re = re.compile(r"[\W_]+", re.UNICODE)
    _special_group_re = re.compile(
        r"(?i)\b(?:specials?|ova|oad|extra|bonus|sp|recap|pilot|shorts?)\b|"
        r"特别|特別|番外|特典|未放送|总集|總集|総集|特别篇|特別編|スペシャル|外伝|短編"
    )
    TAIL_EXTENSION_LIMIT = 4
    COORDINATE_GROUP_LIMIT = 6
    COORDINATE_GROUP_MIN_PRIORITY = 60

    def __init__(self, tmdb_api: Any):
        self._tmdb = tmdb_api
        self._cache: Dict[Tuple[str, int, str], Dict[str, Any]] = {}
        self._lock = threading.RLock()

    def clear_cache(self) -> None:
        """清空 TMDB 编集快照缓存。"""
        with self._lock:
            self._cache.clear()

    def inspect(self, tmdb_id: int) -> Dict[str, Any]:
        """返回默认编集和可选剧集组摘要，供看板选择目标。"""
        info = self._series_info(tmdb_id)
        default_layout = self._default_layout(tmdb_id, info)
        groups = []
        metadata = sorted(
            self._group_metadata(info),
            key=lambda item: (0 if self._safe_int(item.get("type"), 0) == 6 else 1,
                              0 if self._safe_int(item.get("type"), 0) == 2 else 1,
                              str(item.get("name") or "")),
        )
        for group in metadata:
            group_id = str(group.get("id") or "")
            try:
                layout = self._layout_summary(self._group_layout(tmdb_id, group_id)) if group_id else {}
            except Exception:
                layout = {}
            groups.append({
                "id": group_id,
                "name": group.get("name") or "未命名剧集组",
                "type": self._safe_int(group.get("type"), 0),
                "group_count": self._safe_int(group.get("group_count"), 0),
                "episode_count": self._safe_int(group.get("episode_count"), 0),
                "description": group.get("description") or "",
                "seasons": layout.get("seasons") or [],
            })
        recommendation = self.recommend_target(tmdb_id)
        for group in groups:
            group["recommended"] = (
                recommendation.get("target_type") == "group"
                and recommendation.get("episode_group_id") == group.get("id")
            )
        return {
            "tmdb_id": tmdb_id,
            "title": info.get("name") or info.get("title") or "",
            "original_title": info.get("original_name") or info.get("original_title") or "",
            "poster_path": info.get("poster_path") or "",
            "default": self._layout_summary(default_layout),
            "groups": groups,
            "recommendation": recommendation,
        }

    def preferred_group(self, tmdb_id: int) -> Optional[Dict[str, Any]]:
        """仅当默认编集不是正常多季结构时，返回主流多季剧集组。"""
        recommendation = self.recommend_target(tmdb_id)
        return recommendation.get("group") if recommendation.get("target_type") == "group" else None

    def coordinate_evidence(
            self,
            tmdb_id: int,
            season: int,
            episode: Optional[int] = None,
            info: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        检查默认编集或可信剧集组能否解释来源季集坐标。

        此判断只服务于 Series 候选可信度，与用户最终选择的目标编集无关。

        :param tmdb_id: TMDB 电视剧 ID
        :param season: 来源标题解析出的季号
        :param episode: 来源标题解析出的集号
        :param info: 可选的 TMDB 详情，用于复用候选检索已经取得的数据
        :return: 默认编集与可信剧集组的季集存在性证据
        """
        requested_season = self._safe_int(season, 0)
        requested_episode = self._optional_int(episode)
        if requested_season <= 0:
            return {
                "checked": False,
                "season_exists": None,
                "episode_exists": None,
                "source": "not-applicable",
                "reason": "标题没有可校验的正季坐标",
            }

        series_info = deepcopy(info) if isinstance(info, dict) and info else self._series_info(tmdb_id)
        default_seasons = {
            self._safe_int(item.get("season_number"), -1): self._safe_int(item.get("episode_count"), 0)
            for item in series_info.get("seasons") or []
            if isinstance(item, dict) and self._safe_int(item.get("season_number"), -1) >= 0
        }
        default_season_exists = requested_season in default_seasons
        default_episode_count = default_seasons.get(requested_season, 0)
        default_episode_exists = None
        if requested_episode is not None and default_season_exists and default_episode_count > 0:
            default_episode_exists = requested_episode <= default_episode_count
        if default_season_exists and (requested_episode is None or default_episode_exists is True):
            return {
                "checked": True,
                "season_exists": True,
                "episode_exists": default_episode_exists,
                "source": "default",
                "matched_group_id": "",
                "matched_group_name": "TMDB 默认编集",
                "checked_group_count": 0,
                "reason": "TMDB 默认编集包含来源季集坐标",
            }

        checked_groups = 0
        season_match: Optional[Dict[str, Any]] = None
        metadata = sorted(
            self._group_metadata(series_info),
            key=self._coordinate_group_priority,
            reverse=True,
        )
        for group in metadata:
            priority = self._coordinate_group_priority(group)
            if priority < self.COORDINATE_GROUP_MIN_PRIORITY:
                continue
            group_id = str(group.get("id") or "").strip()
            if not group_id:
                continue
            try:
                layout = self._group_layout(tmdb_id, group_id)
            except Exception:
                continue
            checked_groups += 1
            coordinates = layout.get("by_coord") or {}
            group_season_exists = any(
                self._safe_int(item.get("season"), -1) == requested_season
                and not item.get("is_special")
                for item in layout.get("all_entries") or []
            )
            if not group_season_exists:
                if checked_groups >= self.COORDINATE_GROUP_LIMIT:
                    break
                continue
            evidence = {
                "checked": True,
                "season_exists": True,
                "episode_exists": (
                    (requested_season, requested_episode) in coordinates
                    if requested_episode is not None else None
                ),
                "source": "episode_group",
                "matched_group_id": group_id,
                "matched_group_name": group.get("name") or "未命名剧集组",
                "matched_group_type": self._safe_int(group.get("type"), 0),
                "checked_group_count": checked_groups,
                "reason": "可信 TMDB 剧集组包含来源季集坐标",
            }
            if evidence["episode_exists"] is True or requested_episode is None:
                return evidence
            season_match = season_match or evidence
            if checked_groups >= self.COORDINATE_GROUP_LIMIT:
                break

        if season_match:
            season_match["checked_group_count"] = checked_groups
            season_match["reason"] = "可信 TMDB 剧集组包含来源季号，但目标集可能尚未建立"
            return season_match
        return {
            "checked": True,
            "season_exists": default_season_exists,
            "episode_exists": default_episode_exists,
            "source": "default" if default_season_exists else "none",
            "matched_group_id": "",
            "matched_group_name": "TMDB 默认编集" if default_season_exists else "",
            "checked_group_count": checked_groups,
            "reason": (
                "TMDB 默认编集包含来源季号，但目标集可能尚未建立"
                if default_season_exists else
                "默认编集与可信剧集组均未发现来源季号"
            ),
        }

    def recommend_target(self, tmdb_id: int) -> Dict[str, Any]:
        """在默认编集与剧集组之间选择更符合主流多季分配的目标。"""
        info = self._series_info(tmdb_id)
        default_layout = self._default_layout(tmdb_id, info)
        default_profile = self._layout_profile(default_layout)
        if default_profile["regular_group_count"] >= 2:
            return {
                "target_type": "default",
                "episode_group_id": "",
                "reason": f"TMDB 默认编集已经按 {default_profile['regular_group_count']} 季划分",
                "default_profile": default_profile,
                "group": None,
            }

        prepared = []
        # 剧集组是否完整只比较正篇 Episode ID。TMDB 默认编集可能收录大量
        # S00 小剧场，而 Production/Season 组只负责正篇；缺少这些 Special
        # 不应降低多季剧集组的可信度。
        default_ids = {
            item.get("id") for item in default_layout.get("sequence") or []
            if item.get("id") is not None
        }
        default_count = len(default_layout.get("sequence") or [])
        for group in self._group_metadata(info):
            group_id = str(group.get("id") or "").strip()
            if not group_id:
                continue
            try:
                layout = self._group_layout(tmdb_id, group_id)
            except Exception:
                continue
            profile = self._layout_profile(layout)
            if profile["regular_group_count"] < 2:
                continue
            layout_ids = {
                item.get("id") for item in layout.get("sequence") or []
                if item.get("id") is not None
            }
            overlap = len(default_ids & layout_ids)
            coverage = overlap / len(default_ids) if default_ids else 0.0
            if not default_ids:
                metadata_count = self._safe_int(group.get("episode_count"), 0)
                coverage = min(1.0, metadata_count / default_count) if default_count else 1.0
            prepared.append({
                "metadata": group,
                "layout": layout,
                "profile": profile,
                "coverage": coverage,
            })
        if not prepared:
            return {
                "target_type": "default", "episode_group_id": "",
                "reason": "没有找到至少划分为两季的完整剧集组",
                "default_profile": default_profile, "group": None,
            }

        partition_frequency: Dict[int, int] = {}
        for item in prepared:
            count = item["profile"]["regular_group_count"]
            partition_frequency[count] = partition_frequency.get(count, 0) + 1
        for item in prepared:
            item["score"] = self._mainstream_group_score(
                item["metadata"], item["profile"], item["coverage"],
                default_count, partition_frequency,
            )
        selected = max(
            prepared,
            key=lambda item: (
                item["score"], item["coverage"], item["profile"]["has_specials"],
                -item["profile"]["regular_group_count"],
            ),
        )
        if selected["score"] < 75 or (default_count >= 6 and selected["coverage"] < 0.55):
            return {
                "target_type": "default", "episode_group_id": "",
                "reason": "现有剧集组的分季结构或正片覆盖率不足，安全保留默认编集",
                "default_profile": default_profile, "group": None,
            }
        group = selected["metadata"]
        profile = selected["profile"]
        result = {
            "id": str(group.get("id") or ""),
            "name": group.get("name") or "未命名剧集组",
            "type": self._safe_int(group.get("type"), 0),
            "group_count": self._safe_int(group.get("group_count"), 0),
            "episode_count": self._safe_int(group.get("episode_count"), 0),
            "seasons": self._layout_summary(selected["layout"]).get("seasons") or [],
            "score": round(selected["score"], 2),
            "coverage": round(selected["coverage"] * 100, 1),
            "has_specials": profile["has_specials"],
            "selection_reason": (
                f"默认编集仅 {default_profile['regular_group_count']} 季；该组按 "
                f"{profile['regular_group_count']} 季划分，覆盖 {selected['coverage'] * 100:.0f}% 正片"
                f"{'，并包含 Special' if profile['has_specials'] else ''}"
            ),
        }
        return {
            "target_type": "group", "episode_group_id": result["id"],
            "reason": result["selection_reason"],
            "default_profile": default_profile, "group": result,
        }

    def suggest_installment_start(
            self,
            tmdb_id: int,
            target_type: str,
            group_id: str = "",
            air_date: str = "",
            season_hint: Optional[int] = None,
    ) -> Optional[Dict[str, Any]]:
        """根据明确季号或首播日期建议季度条目在目标编集中的起点。"""
        info = self._series_info(tmdb_id)
        target = self._target_layout(tmdb_id, target_type, group_id, info)
        sequence = target.get("sequence") or []
        if not sequence:
            return None

        season_hint = self._optional_int(season_hint)
        if season_hint is not None:
            hinted = [item for item in sequence if item.get("season") == season_hint]
            if hinted:
                first = hinted[0]
                return {
                    "season": first["season"],
                    "episode": first["episode"],
                    "strategy": "title-season",
                }

        requested_date = self._parse_date(air_date)
        if requested_date:
            dated = []
            for item in sequence:
                episode_date = self._parse_date(item.get("air_date"))
                if episode_date:
                    dated.append((abs((episode_date - requested_date).days), episode_date, item))
            if dated:
                distance, _, closest = min(dated, key=lambda value: (value[0], value[1]))
                if distance <= 120:
                    return {
                        "season": closest["season"],
                        "episode": closest["episode"],
                        "strategy": "air-date",
                    }

        seasons = {item.get("season") for item in sequence}
        if len(seasons) == 1:
            first = sequence[0]
            return {
                "season": first["season"],
                "episode": first["episode"],
                "strategy": "single-season",
            }
        return None

    def normalize(
            self,
            rule: Dict[str, Any],
            season: Optional[int],
            episode: Optional[int],
            end_episode: Optional[int] = None,
            raw_title: str = "",
            parsed_name: str = "",
    ) -> Dict[str, Any]:
        """将输入坐标转换到 rule 指定的目标编集；无法唯一判断时保持原值。"""
        tmdb_id = self._safe_int(rule.get("tmdb_id"), 0)
        season = self._optional_int(season)
        episode = self._optional_int(episode)
        end_episode = self._optional_int(end_episode)
        target_type = str(rule.get("target_type") or "default").strip().lower()
        group_id = str(rule.get("episode_group_id") or "").strip()
        base_result = {
            "applied": False,
            "season": season,
            "episode": episode,
            "end_episode": end_episode,
            "target_type": target_type,
            "episode_group": group_id if target_type == "group" else None,
            "reason": "未执行集数归一化",
            "strategy": "none",
        }
        if not rule.get("enabled", True):
            return {**base_result, "reason": "目标编集规则未启用"}
        if not tmdb_id or episode is None:
            missing = "TMDBID" if not tmdb_id else "集信息"
            return {**base_result, "reason": f"缺少{missing}"}
        if target_type == "group" and not group_id:
            return {**base_result, "reason": "目标为剧集组但未选择 Group ID"}

        try:
            info = self._series_info(tmdb_id)
            target = self._target_layout(tmdb_id, target_type, group_id, info)
        except Exception as err:
            return {**base_result, "reason": f"目标编集加载失败：{err}"}
        if not target.get("sequence"):
            return {**base_result, "reason": "目标编集没有可用正片集数据"}

        default_layout = self._default_layout(tmdb_id, info)

        # 当文件使用 TMDB 默认编集的累计编号，而目标剧集组把其中若干集拆到
        # Special 时，Episode ID 是比标题片段偏移更强的证据。例如默认 E16
        # 与剧集组 S00E04 是同一 Episode，必须先完成这次精确映射，不能把 16
        # 当作某个季度片段的第 16 集。
        special_candidates: List[Dict[str, Any]] = []
        self._append_coordinate_candidate(
            special_candidates, default_layout, target, season, episode, end_episode,
            "tmdb-default-special",
        )
        special_candidates = [
            item for item in self._unique_candidates(special_candidates)
            if (target.get("by_coord") or {}).get(
                (item.get("season"), item.get("episode")), {}
            ).get("is_special")
        ]
        if len(special_candidates) == 1:
            return self._result_from_mapping(
                base_result, special_candidates[0], "tmdb-default-special",
                "通过 TMDB Episode ID 映射到目标编集 Special",
            )

        # 季度条目/续作别名明确命中时优先。它能解决“第三期 - 01”被解析为 S01E01 的歧义。
        installment = self._match_installment(rule.get("installments") or [], raw_title, parsed_name, season)
        if installment:
            source_start_episode = self._resolve_source_start_episode(
                tmdb_id, info, target, installment,
            )
            default_source = (default_layout.get("by_coord") or {}).get((season, episode))
            installment_start_season = self._optional_int(installment.get("target_start_season"))
            if (
                    installment_start_season == 0
                    and default_source and default_source.get("id") is not None
                    and default_source.get("id") not in (target.get("by_id") or {})
            ):
                return {
                    **base_result,
                    "reason": "目标剧集组未收录该 Special，已安全保留原坐标",
                    "strategy": "special-missing-from-target",
                }
            current = target["by_coord"].get((season, episode))
            # MP 传统识别词可能已经把累计集数偏移到了该季度在目标编集中的
            # 起点或其后。此时目标坐标本身可信，不能再把 E13 当成相对第 13 集
            # 二次偏移；只有当前坐标位于季度目标起点之前时才按相对集数映射。
            if current and self._is_at_or_after_installment_start(target, installment, current):
                if end_episode is not None and (season, end_episode) not in target["by_coord"]:
                    mapped = self._map_installment(
                        target, installment, episode, end_episode, source_start_episode,
                    )
                    if mapped and mapped.get("provisional"):
                        return self._result_from_mapping(
                            base_result, mapped, "installment-tail",
                            "TMDB 暂缺最新集条目，已在同一目标季内安全推算",
                        )
                    return {**base_result, "reason": "开始集符合目标，但结束集不在同一目标季中"}
                return {
                    **base_result,
                    "reason": "传统识别词或原标题已提供目标编集坐标",
                    "strategy": "target-coordinate",
                }
            mapped = self._map_installment(
                target, installment, episode, end_episode, source_start_episode,
            )
            if mapped:
                return self._result_from_mapping(
                    base_result,
                    mapped,
                    "installment-tail" if mapped.get("provisional") else "installment",
                    (
                        "TMDB 暂缺最新集条目，已在同一目标季内安全推算"
                        if mapped.get("provisional") else "命中季度条目对应片段"
                    ),
                )

        # 裸集号不能一律补成 S01，否则“第三期 - 01”会被误写为第一季。
        # 但累计编号通常能够由目标编集本身唯一证明：例如目标为
        # S01E01-E12、S02E01-E12、S03E01-E03 时，裸 E26 只能解释为
        # 全局第 26 集，即 S03E02。单一常规季同样不存在季号歧义。
        if season is None:
            sequence = target.get("sequence") or []
            regular_seasons = {
                self._safe_int(item.get("season"), -1)
                for item in sequence if not item.get("is_special")
            }
            local_episode_max = max((
                self._safe_int(item.get("episode"), 0)
                for item in sequence if not item.get("is_special")
            ), default=0)
            can_infer_absolute = len(regular_seasons) == 1 or episode > local_episode_max
            if can_infer_absolute:
                absolute = self._map_sequence_position(target, episode, end_episode)
                if absolute:
                    return self._result_from_mapping(
                        base_result,
                        absolute,
                        "absolute-episode-missing-season",
                        "标题未提供季号，已通过目标编集唯一定位累计集数",
                    )
            return {
                **base_result,
                "reason": "标题未提供季号，当前集数可能是相对编号或累计编号，已安全跳过",
                "strategy": "missing-season-ambiguous",
            }

        # 明确的 S00 来源必须通过 Episode ID 找到目标 Special；剧集组未收录
        # 时绝不能把 S00E01 当成正片全局第 1 集。
        if season == 0:
            default_source = (default_layout.get("by_coord") or {}).get((season, episode))
            if (
                    default_source and default_source.get("id") is not None
                    and default_source.get("id") not in (target.get("by_id") or {})
            ):
                return {
                    **base_result,
                    "reason": "目标编集未收录该 Special，已安全保留原坐标",
                    "strategy": "special-missing-from-target",
                }

        current = target["by_coord"].get((season, episode))
        if current:
            if end_episode is not None and (season, end_episode) not in target["by_coord"]:
                return {**base_result, "reason": "开始集符合目标，但结束集不在同一目标季中"}
            return {**base_result, "reason": "当前季集已经符合目标编集", "strategy": "target-coordinate"}

        candidates: List[Dict[str, Any]] = []

        # 输入可能来自 TMDB 默认编集，而目标是剧集组。
        self._append_coordinate_candidate(
            candidates, default_layout, target, season, episode, end_episode, "tmdb-default",
        )

        # 输入也可能来自同一条目的其它绝对/制片剧集组。
        for group in self._group_metadata(info):
            source_group_id = str(group.get("id") or "")
            if not source_group_id or (target_type == "group" and source_group_id == group_id):
                continue
            group_type = self._safe_int(group.get("type"), 0)
            if group_type not in (2, 6):  # Absolute / Production 优先作为常见来源坐标。
                continue
            try:
                source_layout = self._group_layout(tmdb_id, source_group_id)
            except Exception:
                continue
            self._append_coordinate_candidate(
                candidates, source_layout, target, season, episode, end_episode,
                f"episode-group:{source_group_id}",
            )

        # Episode 本身可能就是从 1 递增的全局集数。
        absolute = self._map_sequence_position(target, episode, end_episode)
        # Season>1 且已经能通过其它 TMDB 编集的 Episode ID 定位时，E01 应解释为该季局部集，
        # 不再同时把它当作全局第 1 集；没有坐标证据时仍允许 S02E13 这类累计集数回退。
        if absolute and (season == 1 or not candidates):
            candidates.append({**absolute, "strategy": "absolute-episode"})

        unique = self._unique_candidates(candidates)
        if not unique:
            return {**base_result, "reason": "没有找到可验证的目标集", "strategy": "unresolved"}
        if len(unique) > 1:
            return {
                **base_result,
                "reason": "存在多个不同的目标集解释，已安全跳过",
                "strategy": "ambiguous",
                "candidates": [self._candidate_summary(item) for item in unique],
            }

        selected = unique[0]
        return self._result_from_mapping(
            base_result,
            selected,
            selected.get("strategy") or "resolved",
            "已归一化到目标编集",
        )

    def _series_info(self, tmdb_id: int) -> Dict[str, Any]:
        key = ("info", tmdb_id, "")
        with self._lock:
            if key not in self._cache:
                info = self._tmdb.get_info(mtype=MediaType.TV, tmdbid=tmdb_id) or {}
                if not info:
                    raise ValueError(f"TMDB {tmdb_id} 不存在或不是电视剧")
                self._cache[key] = deepcopy(info)
            return deepcopy(self._cache[key])

    def _target_layout(
            self, tmdb_id: int, target_type: str, group_id: str, info: Dict[str, Any]
    ) -> Dict[str, Any]:
        if target_type == "group":
            return self._group_layout(tmdb_id, group_id)
        return self._default_layout(tmdb_id, info)

    def _default_layout(self, tmdb_id: int, info: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        key = ("default", tmdb_id, "")
        with self._lock:
            if key in self._cache:
                return deepcopy(self._cache[key])

        info = info or self._series_info(tmdb_id)
        entries: List[Dict[str, Any]] = []
        seasons = info.get("seasons") or []
        for season_info in sorted(seasons, key=lambda item: self._safe_int(item.get("season_number"), 0)):
            season_number = self._safe_int(season_info.get("season_number"), 0)
            season_name = str(season_info.get("name") or ("Specials" if season_number == 0 else f"Season {season_number}"))
            detail = self._tmdb.get_tv_season_detail(tmdb_id, season_number) or {}
            episodes = detail.get("episodes") or []
            if episodes:
                for item in episodes:
                    entries.append({
                        "id": self._optional_int(item.get("id")),
                        "season": season_number,
                        "episode": self._safe_int(item.get("episode_number"), 0),
                        "air_date": item.get("air_date") or "",
                        "group_name": season_name,
                        "is_special": season_number == 0,
                    })
                continue
            # TMDB 季详情暂不可用时仍可用 episode_count 构造同编集坐标。
            episode_count = self._safe_int(season_info.get("episode_count"), 0)
            entries.extend({
                "id": None,
                "season": season_number,
                "episode": number,
                "air_date": "",
                "group_name": season_name,
                "is_special": season_number == 0,
            } for number in range(1, episode_count + 1))

        layout = self._build_layout("default", entries, exclude_specials=True)
        with self._lock:
            self._cache[key] = deepcopy(layout)
        return layout

    def _group_layout(self, tmdb_id: int, group_id: str) -> Dict[str, Any]:
        key = ("group", tmdb_id, group_id)
        with self._lock:
            if key in self._cache:
                return deepcopy(self._cache[key])

        groups = self._tmdb.get_tv_group_seasons(group_id) or []
        entries: List[Dict[str, Any]] = []
        regular_season = 0
        special_episode = 0
        for group in sorted(groups, key=lambda item: self._safe_int(item.get("order"), 0)):
            group_name = str(group.get("name") or "")
            episodes = group.get("episodes") or []
            is_special = self._is_special_episode_group(group_name, episodes)
            if is_special:
                season_number = 0
            else:
                regular_season += 1
                season_number = regular_season
            for index, item in enumerate(episodes, start=1):
                if is_special:
                    special_episode += 1
                    episode_number = special_episode
                else:
                    # 自定义剧集组中的 episode_number 仍可能是默认编集的累计编号；
                    # 目标多季坐标必须以组内顺序重新从 E01 开始。
                    episode_number = index
                entries.append({
                    "id": self._optional_int(item.get("id")),
                    "season": season_number,
                    "episode": episode_number,
                    "air_date": item.get("air_date") or "",
                    "group_name": group_name or ("Specials" if is_special else f"Season {season_number}"),
                    "is_special": is_special,
                    "original_season": self._optional_int(item.get("season_number")),
                    "original_episode": self._optional_int(item.get("episode_number")),
                })
        # Special 保留在坐标/ID 索引中供显式 S00 使用，但绝不进入正片顺序，
        # 否则累计集数和季度片段会从特别篇开始计算。
        layout = self._build_layout(f"group:{group_id}", entries, exclude_specials=True)
        with self._lock:
            self._cache[key] = deepcopy(layout)
        return layout

    @classmethod
    def _is_special_episode_group(
            cls, group_name: str, episodes: Iterable[Dict[str, Any]]
    ) -> bool:
        """不依赖组顺序，通过名称和原始 S00 占比识别 Special。"""
        if cls._special_group_re.search(str(group_name or "")):
            return True
        values = [
            cls._optional_int(item.get("season_number"))
            for item in episodes if isinstance(item, dict)
        ]
        values = [value for value in values if value is not None]
        return bool(values and sum(value == 0 for value in values) * 2 >= len(values))

    @staticmethod
    def _build_layout(name: str, entries: Iterable[Dict[str, Any]], exclude_specials: bool) -> Dict[str, Any]:
        all_entries = [item for item in entries if item.get("episode", 0) > 0]
        all_entries.sort(key=lambda item: (item.get("season", 0), item.get("episode", 0)))
        sequence = [item for item in all_entries if not exclude_specials or item.get("season") != 0]
        by_coord = {(item["season"], item["episode"]): item for item in all_entries}
        by_id = {item["id"]: item for item in all_entries if item.get("id") is not None}
        sequence_index = {
            item["id"]: index for index, item in enumerate(sequence)
            if item.get("id") is not None
        }
        return {
            "name": name,
            "all_entries": all_entries,
            "sequence": sequence,
            "by_coord": by_coord,
            "by_id": by_id,
            "sequence_index": sequence_index,
        }

    @staticmethod
    def _group_metadata(info: Dict[str, Any]) -> List[Dict[str, Any]]:
        groups = info.get("episode_groups") or []
        if isinstance(groups, dict):
            groups = groups.get("results") or []
        return [item for item in groups if isinstance(item, dict)]

    @classmethod
    def _layout_profile(cls, layout: Dict[str, Any]) -> Dict[str, Any]:
        """提取分组数量、每组集数和 Special 覆盖等结构特征。"""
        regular: Dict[int, int] = {}
        specials: Dict[int, int] = {}
        for item in layout.get("all_entries") or layout.get("sequence") or []:
            season = cls._safe_int(item.get("season"), 0)
            name = str(item.get("group_name") or "")
            target = specials if item.get("is_special") or (name and cls._special_group_re.search(name)) else regular
            target[season] = max(target.get(season, 0), cls._safe_int(item.get("episode"), 0))
        return {
            "regular_group_count": len(regular),
            "regular_counts": [regular[key] for key in sorted(regular)],
            "special_group_count": len(specials),
            "special_episode_count": sum(specials.values()),
            "has_specials": bool(specials),
            "episode_count": len(layout.get("sequence") or []),
        }

    @classmethod
    def _mainstream_group_score(
            cls,
            group: Dict[str, Any],
            profile: Dict[str, Any],
            coverage: float,
            default_count: int,
            partition_frequency: Dict[int, int],
    ) -> float:
        """按类型、结构共识、正片覆盖和 Special 完整度评估剧集组。"""
        group_type = cls._safe_int(group.get("type"), 0)
        name = str(group.get("name") or "").casefold()
        score = {
            6: 65,   # Production
            1: 35,   # Original air date
            7: 25,   # TV
            2: 5,    # Absolute 通常不是期望的多季相对编号
            3: 0,
            4: -5,
            5: -20,
        }.get(group_type, 0)
        if any(token in name for token in ("season", "production", "制片", "制作", "シーズン", "季")):
            score += 28
        if any(token in name for token in (
                "netflix", "disney", "crunchyroll", "broadcast", "air date",
                "dvd", "blu-ray", "stream", "平台", "放送顺", "放送順",
        )):
            score -= 35
        regular_count = profile.get("regular_group_count") or 0
        score += min(40.0, max(0.0, coverage) * 40.0)
        score += min(24, partition_frequency.get(regular_count, 0) * 8)
        score += 10 if profile.get("has_specials") else 0
        regular_counts = profile.get("regular_counts") or []
        if regular_count >= 2:
            score += 20
        if default_count >= 12 and regular_counts:
            average = sum(regular_counts) / len(regular_counts)
            if average < 3:
                score -= 25
        # episode_count 元数据包含/缺少 Special 的口径并不稳定，尾部完整度必须
        # 以已经解析出的正篇数量为准。
        missing = max(0, default_count - cls._safe_int(profile.get("episode_count"), 0))
        if missing > cls.TAIL_EXTENSION_LIMIT:
            score -= min(35, (missing - cls.TAIL_EXTENSION_LIMIT) * 4)
        return score

    @classmethod
    def _coordinate_group_priority(cls, group: Dict[str, Any]) -> int:
        """按组类型和名称筛选适合证明正季坐标的剧集组。"""
        group_type = cls._safe_int(group.get("type"), 0)
        name = str(group.get("name") or "").casefold()
        score = {6: 100, 1: 72, 7: 64, 2: 10}.get(group_type, 30)
        if any(token in name for token in ("season", "production", "制片", "制作", "シーズン", "季")):
            score += 24
        if any(token in name for token in (
                "absolute", "netflix", "disney", "crunchyroll", "broadcast",
                "air date", "dvd", "blu-ray", "stream", "平台", "放送顺", "放送順",
        )):
            score -= 45
        return score

    @staticmethod
    def _parse_date(value: Any):
        try:
            return datetime.strptime(str(value or "")[:10], "%Y-%m-%d").date()
        except (TypeError, ValueError):
            return None

    @classmethod
    def _match_installment(
            cls,
            installments: Iterable[Dict[str, Any]],
            raw_title: str,
            parsed_name: str,
            source_season: Optional[int],
    ) -> Optional[Dict[str, Any]]:
        haystacks = [cls._normalize_alias(raw_title), cls._normalize_alias(parsed_name)]
        matched = []
        for item in installments:
            expected_season = cls._optional_int(item.get("source_season"))
            if (
                    expected_season is not None
                    and source_season is not None
                    and expected_season != source_season
            ):
                continue
            aliases = item.get("aliases") or []
            if isinstance(aliases, str):
                aliases = [value.strip() for value in aliases.split("\n") if value.strip()]
            normalized = [cls._normalize_alias(value) for value in aliases if value]
            if normalized and any(alias in text for alias in normalized for text in haystacks if text):
                matched.append(item)
        return matched[0] if len(matched) == 1 else None

    def _map_installment(
            self,
            target: Dict[str, Any],
            installment: Dict[str, Any],
            episode: int,
            end_episode: Optional[int],
            source_start_episode: int = 1,
    ) -> Optional[Dict[str, Any]]:
        start_season = self._optional_int(installment.get("target_start_season"))
        start_episode = self._optional_int(installment.get("target_start_episode"))
        if start_season is None or start_episode is None:
            return None
        start = target["by_coord"].get((start_season, start_episode))
        if (
                start_season == 0
                and (not start or not start.get("is_special"))
                and not self._installment_targets_special(installment)
                and target["by_coord"].get((1, start_episode))
        ):
            # 兼容旧版本按 group.order=0 保存的第一常规季起点。
            start_season = 1
            start = target["by_coord"].get((start_season, start_episode))
        if not start:
            return None
        relative_begin = episode - source_start_episode
        relative_end = (end_episode if end_episode is not None else episode) - source_start_episode
        if relative_begin < 0 or relative_end < relative_begin:
            return None

        # Special 不在正片 sequence 中，按 S00 内的相对坐标映射。这里不做
        # 缺集外推，避免把 TMDB 尚未收录的 OVA 错认成另一条特别篇。
        if start.get("is_special") or start_season == 0:
            begin = target["by_coord"].get((start_season, start_episode + relative_begin))
            end = target["by_coord"].get((start_season, start_episode + relative_end))
            if not begin or not end or not begin.get("is_special") or not end.get("is_special"):
                return None
            return {
                "season": begin["season"],
                "episode": begin["episode"],
                "end_episode": end["episode"] if end_episode is not None else None,
            }
        try:
            start_index = target["sequence"].index(start)
        except ValueError:
            return None
        begin_index = start_index + relative_begin
        end_index = start_index + relative_end
        mapped = self._mapping_from_indexes(target, begin_index, end_index, end_episode is not None)
        if mapped:
            return mapped
        return self._extend_installment_tail(
            target=target,
            start_season=start_season,
            start_episode=start_episode,
            episode=episode,
            end_episode=end_episode,
            source_start_episode=source_start_episode,
        )

    @classmethod
    def _extend_installment_tail(
            cls,
            target: Dict[str, Any],
            start_season: int,
            start_episode: int,
            episode: int,
            end_episode: Optional[int],
            source_start_episode: int = 1,
    ) -> Optional[Dict[str, Any]]:
        """只在目标最后一个常规季末尾缺少少量集数时进行受控推算。"""
        season_entries = [
            item for item in target.get("sequence") or []
            if item.get("season") == start_season
        ]
        if not season_entries:
            return None
        last = max(season_entries, key=lambda item: cls._safe_int(item.get("episode"), 0))
        last_index = (target.get("sequence") or []).index(last)
        later_regular = [
            item for item in (target.get("sequence") or [])[last_index + 1:]
            if not item.get("is_special")
            and not cls._special_group_re.search(str(item.get("group_name") or ""))
        ]
        if later_regular:
            return None
        begin = start_episode + episode - source_start_episode
        end = start_episode + (end_episode if end_episode is not None else episode) - source_start_episode
        known_max = cls._safe_int(last.get("episode"), 0)
        if (
                begin < start_episode or end < begin or end <= known_max
                or end - known_max > cls.TAIL_EXTENSION_LIMIT
                or (begin <= known_max and (start_season, begin) not in (target.get("by_coord") or {}))
        ):
            return None
        return {
            "season": start_season,
            "episode": begin,
            "end_episode": end if end_episode is not None else None,
            "provisional": True,
        }

    @classmethod
    def _is_at_or_after_installment_start(
            cls, target: Dict[str, Any], installment: Dict[str, Any], current: Dict[str, Any]
    ) -> bool:
        """判断当前目标坐标是否已经落在季度起点之后。"""
        start_season = cls._optional_int(installment.get("target_start_season"))
        start_episode = cls._optional_int(installment.get("target_start_episode"))
        start = target["by_coord"].get((start_season, start_episode))
        if (
                start_season == 0
                and (not start or not start.get("is_special"))
                and not cls._installment_targets_special(installment)
                and target["by_coord"].get((1, start_episode))
        ):
            start = target["by_coord"].get((1, start_episode))
        if not start:
            return False
        try:
            return target["sequence"].index(current) >= target["sequence"].index(start)
        except ValueError:
            return False

    def _resolve_source_start_episode(
            self,
            tmdb_id: int,
            info: Dict[str, Any],
            target: Dict[str, Any],
            installment: Dict[str, Any],
    ) -> int:
        """推导片段在来源累计编号中的首集；显式配置始终优先。"""
        configured = self._optional_int(installment.get("source_start_episode"))
        if configured is not None and configured > 0:
            return configured
        start_season = self._optional_int(installment.get("target_start_season"))
        start_episode = self._optional_int(installment.get("target_start_episode"))
        start = (target.get("by_coord") or {}).get((start_season, start_episode))
        if not start or not start.get("is_special") or start.get("id") is None:
            return 1
        default_item = (self._default_layout(tmdb_id, info).get("by_id") or {}).get(start.get("id"))
        if not default_item:
            return 1
        return max(1, self._safe_int(default_item.get("episode"), 1))

    @classmethod
    def _installment_targets_special(cls, installment: Dict[str, Any]) -> bool:
        aliases = installment.get("aliases") or []
        if isinstance(aliases, str):
            aliases = aliases.splitlines()
        text = " ".join([
            str(installment.get("title") or ""),
            *(str(value or "") for value in aliases),
        ])
        return bool(cls._special_group_re.search(text))

    @staticmethod
    def _append_coordinate_candidate(
            candidates: List[Dict[str, Any]],
            source: Dict[str, Any],
            target: Dict[str, Any],
            season: int,
            episode: int,
            end_episode: Optional[int],
            strategy: str,
    ) -> None:
        begin = source["by_coord"].get((season, episode))
        end = source["by_coord"].get((season, end_episode)) if end_episode is not None else begin
        if not begin or not end or begin.get("id") is None or end.get("id") is None:
            return
        target_begin = target["by_id"].get(begin["id"])
        target_end = target["by_id"].get(end["id"])
        if not target_begin or not target_end or target_begin["season"] != target_end["season"]:
            return
        candidates.append({
            "season": target_begin["season"],
            "episode": target_begin["episode"],
            "end_episode": target_end["episode"] if end_episode is not None else None,
            "strategy": strategy,
        })

    def _map_sequence_position(
            self, target: Dict[str, Any], episode: int, end_episode: Optional[int]
    ) -> Optional[Dict[str, Any]]:
        begin_index = episode - 1
        end_index = (end_episode if end_episode is not None else episode) - 1
        return self._mapping_from_indexes(target, begin_index, end_index, end_episode is not None)

    @staticmethod
    def _mapping_from_indexes(
            target: Dict[str, Any], begin_index: int, end_index: int, include_end: bool
    ) -> Optional[Dict[str, Any]]:
        sequence = target.get("sequence") or []
        if begin_index < 0 or end_index < begin_index or end_index >= len(sequence):
            return None
        begin = sequence[begin_index]
        end = sequence[end_index]
        if begin["season"] != end["season"]:
            return None
        return {
            "season": begin["season"],
            "episode": begin["episode"],
            "end_episode": end["episode"] if include_end else None,
        }

    @staticmethod
    def _unique_candidates(candidates: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
        unique: Dict[Tuple[Any, Any, Any], Dict[str, Any]] = {}
        for item in candidates:
            key = (item.get("season"), item.get("episode"), item.get("end_episode"))
            if key not in unique:
                unique[key] = item
            elif str(item.get("strategy", "")).startswith("tmdb-default"):
                unique[key] = item
        return list(unique.values())

    @staticmethod
    def _result_from_mapping(
            base: Dict[str, Any], mapped: Dict[str, Any], strategy: str, reason: str
    ) -> Dict[str, Any]:
        changed = any((
            mapped.get("season") != base.get("season"),
            mapped.get("episode") != base.get("episode"),
            mapped.get("end_episode") != base.get("end_episode"),
        ))
        return {
            **base,
            "applied": changed,
            "season": mapped.get("season"),
            "episode": mapped.get("episode"),
            "end_episode": mapped.get("end_episode"),
            "strategy": strategy,
            "reason": reason if changed else "当前季集已经符合目标编集",
        }

    @staticmethod
    def _candidate_summary(item: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "season": item.get("season"),
            "episode": item.get("episode"),
            "end_episode": item.get("end_episode"),
            "strategy": item.get("strategy"),
        }

    @staticmethod
    def _layout_summary(layout: Dict[str, Any]) -> Dict[str, Any]:
        seasons: Dict[int, List[Dict[str, Any]]] = {}
        for item in layout.get("all_entries") or layout.get("sequence") or []:
            seasons.setdefault(item["season"], []).append(item)
        summaries = []
        for season, entries in sorted(seasons.items()):
            episodes = [EpisodeNormalizer._safe_int(item.get("episode"), 0) for item in entries]
            dates = sorted(str(item.get("air_date") or "") for item in entries if item.get("air_date"))
            name = next((str(item.get("group_name") or "") for item in entries if item.get("group_name")), "")
            is_special = any(item.get("is_special") for item in entries) or season == 0
            summaries.append({
                "season": season,
                "name": name or ("Specials" if is_special else f"Season {season}"),
                "episode_count": len(entries),
                "first_episode": min(episodes) if episodes else 0,
                "last_episode": max(episodes) if episodes else 0,
                "first_air_date": dates[0] if dates else "",
                "last_air_date": dates[-1] if dates else "",
                "is_special": is_special,
            })
        return {
            "episode_count": len(layout.get("sequence") or []),
            "special_episode_count": sum(item["episode_count"] for item in summaries if item["is_special"]),
            "seasons": summaries,
        }

    @classmethod
    def _normalize_alias(cls, value: Any) -> str:
        return cls._alias_space_re.sub("", str(value or "").casefold())

    @staticmethod
    def _safe_int(value: Any, default: int) -> int:
        try:
            return int(value)
        except (TypeError, ValueError):
            return default

    @staticmethod
    def _optional_int(value: Any) -> Optional[int]:
        if value in (None, ""):
            return None
        try:
            return int(value)
        except (TypeError, ValueError):
            return None
