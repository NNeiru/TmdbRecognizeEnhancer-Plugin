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


def test_coordinate_evidence_checks_production_group_independently():
    """默认编集缺少目标季时，可信 Production 组仍应证明该 Series 可容纳坐标。"""
    normalizer = EpisodeNormalizer(FakeTmdbApi())

    result = normalizer.coordinate_evidence(100, season=2, episode=1)

    assert result["season_exists"] is True
    assert result["episode_exists"] is True
    assert result["source"] == "episode_group"
    assert result["matched_group_id"] == "production"


def test_coordinate_evidence_keeps_missing_group_episode_non_fatal():
    """剧集组已有目标季但尚未建立最新集时，应保留季号证据而不误判缺季。"""
    normalizer = EpisodeNormalizer(FakeTmdbApi())

    result = normalizer.coordinate_evidence(100, season=2, episode=13)

    assert result["season_exists"] is True
    assert result["episode_exists"] is False
    assert "可能尚未建立" in result["reason"]


def test_missing_season_with_clear_absolute_episode_maps_to_target_season():
    normalizer = EpisodeNormalizer(FakeTmdbApi())
    rule = {
        "tmdb_id": 100,
        "enabled": True,
        "target_type": "group",
        "episode_group_id": "production",
    }

    result = normalizer.normalize(rule, season=None, episode=13)

    assert result["applied"] is True
    assert (result["season"], result["episode"]) == (2, 1)
    assert result["strategy"] == "absolute-episode-missing-season"


def test_missing_season_with_ambiguous_local_episode_is_not_guessed():
    normalizer = EpisodeNormalizer(FakeTmdbApi())
    rule = {
        "tmdb_id": 100,
        "enabled": True,
        "target_type": "group",
        "episode_group_id": "production",
    }

    result = normalizer.normalize(rule, season=None, episode=2)

    assert result["applied"] is False
    assert result["strategy"] == "missing-season-ambiguous"


def test_missing_season_can_use_unique_installment_alias():
    normalizer = EpisodeNormalizer(FakeTmdbApi())
    rule = {
        "tmdb_id": 200,
        "enabled": True,
        "target_type": "default",
        "installments": [{
            "aliases": ["Anime 200 Season 3"],
            "source_season": 3,
            "target_start_season": 3,
            "target_start_episode": 1,
        }],
    }

    result = normalizer.normalize(
        rule,
        season=None,
        episode=2,
        raw_title="Anime 200 Season 3 - 02.mkv",
    )

    assert result["applied"] is True
    assert (result["season"], result["episode"]) == (3, 2)
    assert result["strategy"] == "installment"


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


def test_cumulative_default_special_maps_to_s00_without_corrupting_regular_episode():
    """默认 E13-E17 被剧集组拆为 Special 时，E16->S00E04，而 E11 仍是 S01E11。"""
    class DefaultTailSpecials(FakeTmdbApi):
        @staticmethod
        def get_info(mtype, tmdbid):
            return {
                "id": tmdbid,
                "name": "Next Shine",
                "seasons": [{"season_number": 1, "episode_count": 17}],
                "episode_groups": {"results": [{
                    "id": "production", "name": "Production Seasons", "type": 6,
                    "group_count": 2, "episode_count": 17,
                }]},
            }

        @staticmethod
        def get_tv_season_detail(tmdbid, season):
            return {"episodes": [
                {"id": index, "season_number": 1, "episode_number": index}
                for index in range(1, 18)
            ]}

        @staticmethod
        def get_tv_group_seasons(group_id):
            return [
                {"order": 0, "name": "Specials", "episodes": [
                    {"id": index, "season_number": 1, "episode_number": index}
                    for index in range(13, 18)
                ]},
                {"order": 1, "name": "Season 1", "episodes": [
                    {"id": index, "season_number": 1, "episode_number": index}
                    for index in range(1, 13)
                ]},
            ]

    normalizer = EpisodeNormalizer(DefaultTailSpecials())
    rule = {
        "tmdb_id": 277513,
        "enabled": True,
        "target_type": "group",
        "episode_group_id": "production",
        "installments": [{
            "title": "Next Shine!",
            "aliases": ["Next Shine!"],
            "source_season": 1,
            "target_start_season": 0,
            "target_start_episode": 1,
        }],
    }

    special = normalizer.normalize(
        rule, season=1, episode=16, raw_title="[Sakurato] Next Shine! [16].mkv",
    )
    regular = normalizer.normalize(
        rule, season=1, episode=11, raw_title="[Sakurato] Next Shine! [11].mkv",
    )

    assert special["applied"] is True
    assert (special["season"], special["episode"]) == (0, 4)
    assert special["strategy"] == "tmdb-default-special"
    assert regular["applied"] is False
    assert (regular["season"], regular["episode"]) == (1, 11)
    assert regular["strategy"] == "target-coordinate"


def test_group_recommendation_ignores_specials_missing_from_production_group():
    """Production 组完整覆盖正篇时，不因缺少大量 S00 小剧场而被判不完整。"""
    class GroupWithoutDefaultSpecials(FakeTmdbApi):
        @staticmethod
        def get_info(mtype, tmdbid):
            return {
                "id": tmdbid,
                "name": "Long Running Anime",
                "seasons": [
                    {"season_number": 0, "episode_count": 30},
                    {"season_number": 1, "episode_count": 24},
                ],
                "episode_groups": {"results": [{
                    "id": "production", "name": "Production Season", "type": 6,
                    "group_count": 2, "episode_count": 24,
                }]},
            }

        @staticmethod
        def get_tv_season_detail(tmdbid, season):
            if season == 0:
                return {"episodes": [
                    {"id": 1000 + index, "season_number": 0, "episode_number": index}
                    for index in range(1, 31)
                ]}
            return {"episodes": [
                {"id": index, "season_number": 1, "episode_number": index}
                for index in range(1, 25)
            ]}

        @staticmethod
        def get_tv_group_seasons(group_id):
            return [
                {"order": 0, "name": "Season 1", "episodes": [
                    {"id": index, "season_number": 1, "episode_number": index}
                    for index in range(1, 13)
                ]},
                {"order": 1, "name": "Season 2", "episodes": [
                    {"id": index, "season_number": 1, "episode_number": index}
                    for index in range(13, 25)
                ]},
            ]

    normalizer = EpisodeNormalizer(GroupWithoutDefaultSpecials())
    recommendation = normalizer.recommend_target(117465)
    missing_special = normalizer.normalize({
        "tmdb_id": 117465,
        "enabled": True,
        "target_type": "group",
        "episode_group_id": "production",
    }, season=0, episode=1)

    assert recommendation["target_type"] == "group"
    assert recommendation["episode_group_id"] == "production"
    assert recommendation["group"]["coverage"] == 100.0
    assert missing_special["applied"] is False
    assert missing_special["strategy"] == "special-missing-from-target"
