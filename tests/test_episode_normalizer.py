"""目标编集归一化核心测试。"""

import importlib.util
import sys
from enum import Enum
from pathlib import Path
from types import ModuleType


class _MediaType(Enum):
    TV = "电视剧"


app_module = ModuleType("app")
schemas_module = ModuleType("app.schemas")
types_module = ModuleType("app.schemas.types")
types_module.MediaType = _MediaType
sys.modules.setdefault("app", app_module)
sys.modules.setdefault("app.schemas", schemas_module)
sys.modules.setdefault("app.schemas.types", types_module)

module_path = Path(__file__).parents[1] / "plugins.v2" / "tmdbrecognizeenhancer" / "episode_normalizer.py"
spec = importlib.util.spec_from_file_location("episode_normalizer_under_test", module_path)
normalizer_module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(normalizer_module)
EpisodeNormalizer = normalizer_module.EpisodeNormalizer


class FakeTmdbApi:
    """提供一个默认单季、Production 两季，以及一个默认三季的稳定数据集。"""

    @staticmethod
    def get_info(mtype, tmdbid):
        if tmdbid == 200:
            seasons = [
                {"season_number": 1, "episode_count": 12},
                {"season_number": 2, "episode_count": 12},
                {"season_number": 3, "episode_count": 12},
            ]
            groups = []
        else:
            seasons = [{"season_number": 1, "episode_count": 24}]
            groups = [{
                "id": "production",
                "name": "Production Order",
                "type": 6,
                "group_count": 2,
                "episode_count": 24,
            }]
        return {
            "id": tmdbid,
            "name": f"Anime {tmdbid}",
            "seasons": seasons,
            "episode_groups": {"results": groups},
        }

    @staticmethod
    def get_tv_season_detail(tmdbid, season):
        if tmdbid == 200:
            start = (season - 1) * 12
            count = 12
        else:
            start = 0
            count = 24
        return {
            "episodes": [
                {"id": start + index, "season_number": season, "episode_number": index}
                for index in range(1, count + 1)
            ]
        }

    @staticmethod
    def get_tv_group_seasons(group_id):
        assert group_id == "production"
        return [
            {
                "order": 1,
                "episodes": [
                    {"id": index, "season_number": 1, "episode_number": index}
                    for index in range(1, 13)
                ],
            },
            {
                "order": 2,
                "episodes": [
                    {"id": index, "season_number": 1, "episode_number": index - 12}
                    for index in range(13, 25)
                ],
            },
        ]


def test_default_absolute_episode_maps_to_production_season():
    normalizer = EpisodeNormalizer(FakeTmdbApi())
    rule = {
        "tmdb_id": 100,
        "enabled": True,
        "target_type": "group",
        "episode_group_id": "production",
    }

    result = normalizer.normalize(rule, season=1, episode=13)

    assert result["applied"] is True
    assert (result["season"], result["episode"]) == (2, 1)


def test_production_local_episode_maps_to_flat_default():
    normalizer = EpisodeNormalizer(FakeTmdbApi())
    rule = {"tmdb_id": 100, "enabled": True, "target_type": "default"}

    result = normalizer.normalize(rule, season=2, episode=1)

    assert result["applied"] is True
    assert (result["season"], result["episode"]) == (1, 13)
    assert result["strategy"].startswith("episode-group:")


def test_target_coordinate_is_idempotent():
    normalizer = EpisodeNormalizer(FakeTmdbApi())
    rule = {
        "tmdb_id": 100,
        "enabled": True,
        "target_type": "group",
        "episode_group_id": "production",
    }

    result = normalizer.normalize(rule, season=2, episode=1)

    assert result["applied"] is False
    assert result["strategy"] == "target-coordinate"


def test_installment_alias_resolves_third_season_even_when_s1e1_is_valid():
    normalizer = EpisodeNormalizer(FakeTmdbApi())
    rule = {
        "tmdb_id": 200,
        "enabled": True,
        "target_type": "default",
        "installments": [{
            "aliases": ["Anime 200 Season 3", "第三期"],
            "target_start_season": 3,
            "target_start_episode": 1,
        }],
    }

    result = normalizer.normalize(
        rule, season=1, episode=1, raw_title="[Group] Anime 200 Season 3 - 01.mkv",
    )

    assert result["applied"] is True
    assert (result["season"], result["episode"]) == (3, 1)
    assert result["strategy"] == "installment"


def test_installment_does_not_apply_twice_after_traditional_offset():
    normalizer = EpisodeNormalizer(FakeTmdbApi())
    rule = {
        "tmdb_id": 100,
        "enabled": True,
        "target_type": "default",
        "installments": [{
            "aliases": ["Anime 100 Part 2"],
            "target_start_season": 1,
            "target_start_episode": 13,
        }],
    }

    result = normalizer.normalize(
        rule, season=1, episode=13, raw_title="Anime 100 Part 2 - 01.mkv",
    )

    assert result["applied"] is False
    assert result["strategy"] == "target-coordinate"


def test_batch_crossing_target_seasons_is_safely_rejected():
    normalizer = EpisodeNormalizer(FakeTmdbApi())
    rule = {
        "tmdb_id": 100,
        "enabled": True,
        "target_type": "group",
        "episode_group_id": "production",
    }

    result = normalizer.normalize(rule, season=1, episode=12, end_episode=13)

    assert result["applied"] is False
    assert "结束集" in result["reason"] or result["strategy"] in ("unresolved", "ambiguous")


def test_group_preference_selects_production_layout():
    normalizer = EpisodeNormalizer(FakeTmdbApi())

    group = normalizer.preferred_group(100)

    assert group["id"] == "production"
    assert group["type"] == 6
    assert [(item["season"], item["episode_count"], item["is_special"]) for item in group["seasons"]] == [
        (1, 12, False),
        (2, 12, False),
    ]


def test_special_group_is_forced_to_s00_and_excluded_from_regular_sequence():
    class SpecialBetweenSeasons(FakeTmdbApi):
        @staticmethod
        def get_info(mtype, tmdbid):
            info = FakeTmdbApi.get_info(mtype, tmdbid)
            info["episode_groups"] = {"results": [{
                "id": "production", "name": "Production Seasons", "type": 6,
                "group_count": 3, "episode_count": 26,
            }]}
            return info

        @staticmethod
        def get_tv_group_seasons(group_id):
            return [
                {"order": 0, "name": "Season One", "episodes": [
                    {"id": index, "season_number": 1, "episode_number": index}
                    for index in range(1, 13)
                ]},
                {"order": 1, "name": "特别篇", "episodes": [
                    {"id": 100 + index, "season_number": 0, "episode_number": index}
                    for index in range(1, 3)
                ]},
                {"order": 2, "name": "Season Two", "episodes": [
                    {"id": 12 + index, "season_number": 1, "episode_number": 12 + index}
                    for index in range(1, 13)
                ]},
            ]

    normalizer = EpisodeNormalizer(SpecialBetweenSeasons())
    layout = normalizer._group_layout(100, "production")
    summary = normalizer._layout_summary(layout)

    assert (layout["sequence"][0]["season"], layout["sequence"][0]["episode"]) == (1, 1)
    assert all(item["season"] != 0 for item in layout["sequence"])
    assert (layout["by_id"][101]["season"], layout["by_id"][101]["episode"]) == (0, 1)
    assert [(item["season"], item["is_special"]) for item in summary["seasons"]] == [
        (0, True), (1, False), (2, False),
    ]


def test_group_preference_keeps_default_when_default_is_already_multiseason():
    class DefaultMultiWithPlatformGroup(FakeTmdbApi):
        @staticmethod
        def get_info(mtype, tmdbid):
            info = FakeTmdbApi.get_info(mtype, 200)
            info["id"] = tmdbid
            info["episode_groups"] = {"results": [{
                "id": "production", "name": "Netflix Order", "type": 6,
                "group_count": 1, "episode_count": 36,
            }]}
            return info

    normalizer = EpisodeNormalizer(DefaultMultiWithPlatformGroup())

    recommendation = normalizer.recommend_target(300)

    assert recommendation["target_type"] == "default"
    assert recommendation["group"] is None
    assert "已经按 3 季" in recommendation["reason"]


def test_missing_latest_group_episode_is_safely_extended_from_installment():
    class IncompleteGroup(FakeTmdbApi):
        @staticmethod
        def get_tv_group_seasons(group_id):
            groups = FakeTmdbApi.get_tv_group_seasons(group_id)
            groups[1]["episodes"] = groups[1]["episodes"][:-1]
            return groups

    normalizer = EpisodeNormalizer(IncompleteGroup())
    rule = {
        "tmdb_id": 100,
        "enabled": True,
        "target_type": "group",
        "episode_group_id": "production",
        "installments": [{
            "aliases": ["Anime 100 Part 2"],
            "target_start_season": 2,
            "target_start_episode": 1,
        }],
    }

    result = normalizer.normalize(
        rule, season=1, episode=12, raw_title="Anime 100 Part 2 - 12.mkv",
    )

    assert result["applied"] is True
    assert (result["season"], result["episode"]) == (2, 12)
    assert result["strategy"] == "installment-tail"


def test_installment_start_uses_explicit_title_season():
    normalizer = EpisodeNormalizer(FakeTmdbApi())

    start = normalizer.suggest_installment_start(
        tmdb_id=200,
        target_type="default",
        season_hint=3,
        air_date="2026-07-01",
    )

    assert start == {"season": 3, "episode": 1, "strategy": "title-season"}
