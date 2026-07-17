"""名称识别事件与 MP 运行时元数据的轻量接入测试。"""

import importlib.util
import sys
from enum import Enum
from pathlib import Path
from types import ModuleType, SimpleNamespace
from unittest.mock import Mock


def _load_plugin(monkeypatch):
    class MediaType(Enum):
        MOVIE = "电影"
        TV = "电视剧"

    class ChainEventType(Enum):
        NameRecognize = "NameRecognize"

    class PluginBase:
        def __init__(self):
            self._data = {}

        def get_data(self, key):
            return self._data.get(key)

        def save_data(self, key, value):
            self._data[key] = value

        def update_config(self, config):
            return None

    class EventManager:
        @staticmethod
        def register(*args, **kwargs):
            return lambda function: function

    class Response:
        def __init__(self, success=True, data=None, message=None):
            self.success = success
            self.data = data
            self.message = message

    class Body:
        def __new__(cls, default=None, **kwargs):
            return default

    stubs = {
        "fastapi": ModuleType("fastapi"),
        "app": ModuleType("app"),
        "app.schemas": ModuleType("app.schemas"),
        "app.core": ModuleType("app.core"),
        "app.core.config": ModuleType("app.core.config"),
        "app.core.event": ModuleType("app.core.event"),
        "app.core.metainfo": ModuleType("app.core.metainfo"),
        "app.log": ModuleType("app.log"),
        "app.modules": ModuleType("app.modules"),
        "app.modules.themoviedb": ModuleType("app.modules.themoviedb"),
        "app.modules.themoviedb.tmdbapi": ModuleType("app.modules.themoviedb.tmdbapi"),
        "app.plugins": ModuleType("app.plugins"),
        "app.schemas.types": ModuleType("app.schemas.types"),
        "app.utils": ModuleType("app.utils"),
        "app.utils.http": ModuleType("app.utils.http"),
    }
    stubs["fastapi"].Body = Body
    stubs["app"].schemas = stubs["app.schemas"]
    stubs["app.schemas"].Response = Response
    stubs["app.core.config"].settings = SimpleNamespace(RECOGNIZE_PLUGIN_FIRST=True, PROXY=None)
    stubs["app.core.event"].Event = SimpleNamespace
    stubs["app.core.event"].eventmanager = EventManager()
    stubs["app.core.metainfo"].MetaInfo = lambda title: SimpleNamespace(name=title)
    stubs["app.log"].logger = SimpleNamespace(
        debug=lambda *args, **kwargs: None,
        info=lambda *args, **kwargs: None,
        warning=lambda *args, **kwargs: None,
        error=lambda *args, **kwargs: None,
    )
    stubs["app.modules.themoviedb.tmdbapi"].TmdbApi = object
    stubs["app.plugins"]._PluginBase = PluginBase
    stubs["app.schemas.types"].ChainEventType = ChainEventType
    stubs["app.schemas.types"].MediaType = MediaType
    stubs["app.utils.http"].RequestUtils = object
    for name, module in stubs.items():
        monkeypatch.setitem(sys.modules, name, module)

    plugin_dir = Path(__file__).parents[1] / "plugins.v2" / "tmdbrecognizeenhancer"
    package_name = "tmdbrecognizeenhancer_event_test"
    spec = importlib.util.spec_from_file_location(
        package_name,
        plugin_dir / "__init__.py",
        submodule_search_locations=[str(plugin_dir)],
    )
    module = importlib.util.module_from_spec(spec)
    monkeypatch.setitem(sys.modules, package_name, module)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


def _plugin_with_runtime(module, runtime_meta):
    plugin = module.TmdbRecognizeEnhancer()
    plugin._config = plugin._normalize_config({"enabled": True})
    plugin._runtime_adapter = SimpleNamespace(
        current_meta=lambda: runtime_meta,
        compatible=True,
        message="ok",
    )
    return plugin


def test_event_searches_post_word_meta_name(monkeypatch):
    module = _load_plugin(monkeypatch)
    runtime_meta = SimpleNamespace(
        name="识别词处理后的标题",
        year="2026",
        type=module.MediaType.TV,
        begin_season=2,
        begin_episode=1,
        end_episode=None,
        tmdbid=None,
        doubanid=None,
        bangumiid=None,
    )
    plugin = _plugin_with_runtime(module, runtime_meta)
    plugin._recognize_title = Mock(return_value={
        "accepted": False,
        "title": runtime_meta.name,
        "reason": "test",
        "queries": [],
        "best": None,
        "margin": 0,
    })
    plugin._append_history = Mock()
    event = SimpleNamespace(event_data={"title": "[发布组] 原始文件名.mkv"})

    plugin.on_name_recognize(event)

    searched_title = plugin._recognize_title.call_args.args[0]
    assert searched_title == "识别词处理后的标题"
    assert plugin._recognize_title.call_args.kwargs["hints"]["year"] == "2026"


def test_runtime_original_name_is_forwarded_as_anchor_evidence(monkeypatch):
    module = _load_plugin(monkeypatch)
    runtime_meta = SimpleNamespace(
        name="识别词处理后的标题", original_name="未应用识别词的标题", org_string="原标题",
        year="2025", type=module.MediaType.TV, begin_season=1, begin_episode=2,
        end_episode=None, tmdbid=None, doubanid=None, bangumiid=None,
    )
    plugin = _plugin_with_runtime(module, runtime_meta)
    plugin._recognize_title = Mock(return_value={
        "accepted": False, "title": runtime_meta.name, "reason": "test",
        "queries": [], "best": None, "margin": 0,
    })
    plugin._append_history = Mock()

    plugin.on_name_recognize(SimpleNamespace(event_data={"title": "[Group] Raw File.mkv"}))

    hints = plugin._recognize_title.call_args.kwargs["hints"]
    assert hints["year"] == "2025"
    assert hints["original_title"] == "未应用识别词的标题"


def test_tmdb_first_mode_uses_first_result_without_score_or_margin(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._config = plugin._normalize_config({
        "enabled": True, "recognition_mode": "tmdb_first", "fetch_aliases": False,
    })
    plugin._tmdb_api = SimpleNamespace(search_multiis=lambda query: [
        {"id": 20, "media_type": "tv", "name": "TMDB First", "first_air_date": "2020-01-01"},
        {"id": 10, "media_type": "tv", "name": "Higher Text Match", "first_air_date": "2025-01-01"},
    ])

    result = plugin._recognize_title("Some Input", hints={"year": "2025"}, include_candidates=True)

    assert result["accepted"] is True
    assert result["selection_mode"] == "tmdb_first"
    assert result["best"]["tmdb_id"] == 20
    assert result["best"]["score"] == 100.0
    assert result["margin"] == 0.0


def test_preview_mode_override_cannot_fall_into_saved_scoring_thresholds(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._config = plugin._normalize_config({
        "recognition_mode": "scored", "minimum_margin": 50, "fetch_aliases": False,
    })
    plugin._tmdb_api = SimpleNamespace(search_multiis=lambda query: [
        {"id": 1, "media_type": "tv", "name": "Same", "first_air_date": "2020-01-01"},
        {"id": 2, "media_type": "tv", "name": "Same", "first_air_date": "2020-01-01"},
    ])

    result = plugin._recognize_title(
        "Same", include_candidates=True, recognition_mode="tmdb_first",
    )

    assert result["accepted"] is True
    assert result["selection_mode"] == "tmdb_first"
    assert "低于分差阈值" not in result["reason"]


def test_duplicate_tmdb_entries_share_one_decision_slot(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    candidates = [
        {
            "tmdb_id": 65942, "name": "Re:Zero", "year": "2016", "media_type": "电视剧",
            "score": 98, "popularity": 10, "vote_count": 20, "query_index": 0,
            "tmdb_rank": 0, "identity_names": ["re zero"], "genre_ids": [16],
        },
        {
            "tmdb_id": 328386, "name": "Re:Zero", "year": "2016", "media_type": "电视剧",
            "score": 100, "popularity": 30, "vote_count": 10, "query_index": 0,
            "tmdb_rank": 1, "identity_names": ["re zero"], "genre_ids": [16],
        },
        {
            "tmdb_id": 3, "name": "Different", "year": "2016", "media_type": "电视剧",
            "score": 80, "popularity": 1, "vote_count": 1, "query_index": 0,
            "tmdb_rank": 2, "identity_names": ["different"], "genre_ids": [16],
        },
    ]

    ranked, summary = plugin._collapse_duplicate_candidates(candidates)

    assert [item["tmdb_id"] for item in ranked] == [65942, 3]
    assert summary["suppressed_count"] == 1
    assert candidates[1]["duplicate_of"] == 65942


def test_parallel_single_season_entry_is_suppressed_when_parent_contains_target_season(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    parent = {
        "tmdb_id": 100, "year": "2020", "tmdb_rank": 0,
        "season_numbers": [0, 1, 2, 3, 4], "number_of_seasons": 4,
        "title_season": None, "franchise_base": "exampleanime",
    }
    standalone = {
        "tmdb_id": 104, "year": "2026", "tmdb_rank": 1,
        "season_numbers": [0, 1], "number_of_seasons": 1,
        "title_season": 4, "franchise_base": "exampleanime",
    }

    ranked, count = plugin._suppress_shadow_season_entries(
        [standalone, parent], {"season": 4},
    )

    assert [item["tmdb_id"] for item in ranked] == [100]
    assert count == 1
    assert standalone["shadow_of"] == 100


def test_exact_year_can_decide_between_same_title_adaptations(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._config = plugin._normalize_config({
        "recognition_mode": "scored", "minimum_score": 72, "minimum_margin": 8,
    })
    raw_candidates = [{"id": 263121}, {"id": 123249}]
    scored = {
        263121: {
            "tmdb_id": 263121, "name": "Sono Bisque Doll", "year": "2024",
            "media_type": "电视剧", "score": 83.88, "popularity": 1,
            "identity_names": ["sono bisque doll wa koi o suru"], "genre_ids": [],
            "query_index": 0, "tmdb_rank": 0, "vote_count": 0,
        },
        123249: {
            "tmdb_id": 123249, "name": "Sono Bisque Doll", "year": "2022",
            "media_type": "电视剧", "score": 82.11, "popularity": 1,
            "identity_names": ["sono bisque doll wa koi o suru"], "genre_ids": [16],
            "query_index": 0, "tmdb_rank": 1, "vote_count": 0,
        },
    }
    plugin._search_candidates = Mock(return_value=raw_candidates)
    plugin._score_candidate = Mock(side_effect=lambda title, queries, item, hints: dict(scored[item["id"]]))

    result = plugin._recognize_title(
        "Sono Bisque Doll Wa Koi O Suru", hints={"year": "2022"},
        recognition_mode="scored",
    )

    assert result["accepted"] is True
    assert result["best"]["tmdb_id"] == 123249
    assert result["margin_waived"] is True
    assert result["decisive_evidence"]["kind"] == "exact_year"


def test_recovers_title_truncated_by_single_letter_roman_token(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    filename = "That.Time.I.Got.Reincarnated.as.a.Slime.S04E14.2026.1080p.LINETV.WEB-DL.H264.AAC-ADWeb.mkv"

    title, evidence = plugin._recover_search_title("That Time", {"source_title": filename})

    assert title == "That Time I Got Reincarnated as a Slime"
    assert evidence["from"] == "That Time"


def test_scored_fallback_requires_relation_to_unshortened_title(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._config = plugin._normalize_config({
        "recognition_mode": "scored", "fallback_anchor_min": 60,
        "fetch_aliases": False,
    })
    candidate = {
        "id": 99, "media_type": "tv", "name": "Completely Different Show",
        "first_air_date": "2025-01-01", "_query_hits": [{
            "query": "Different Show", "query_index": 2, "rank": 0,
            "result_count": 1, "source": "tmdb",
        }],
    }

    scored = plugin._score_candidate(
        "Original Long Anime Title", ["Original Long Anime Title", "Different Show"],
        candidate, {"original_title": "Original Long Anime Title"},
    )

    assert scored["fallback_anchor_ok"] is False
    assert scored["anchor_score"] < 60


def test_web_evidence_requires_direct_matching_tmdb_link(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    candidate = {"id": 123, "media_type": "tv", "name": "Original Anime Title"}
    generic = plugin._best_web_evidence("Original Anime Title", candidate, [{
        "title": "Original Anime Title TMDB", "snippet": "Original Anime Title",
        "url": "https://example.com/article",
    }])
    direct = plugin._best_web_evidence("Original Anime Title", candidate, [{
        "title": "Original Anime Title", "snippet": "Original Anime Title",
        "url": "https://www.themoviedb.org/tv/123-original-anime-title",
    }])

    assert generic["score"] == 0
    assert direct["score"] > 0


def test_traditional_fixed_tmdb_id_is_never_researched_or_overwritten(monkeypatch):
    module = _load_plugin(monkeypatch)
    runtime_meta = SimpleNamespace(
        name="传统规则标题",
        year="2026",
        type=module.MediaType.TV,
        begin_season=2,
        begin_episode=1,
        end_episode=None,
        tmdbid=123456,
        doubanid=None,
        bangumiid=None,
    )
    plugin = _plugin_with_runtime(module, runtime_meta)
    plugin._recognize_title = Mock()
    plugin._normalize_best_episode = Mock(return_value=None)
    event = SimpleNamespace(event_data={"title": "原始文件名.mkv"})

    plugin.on_name_recognize(event)

    plugin._recognize_title.assert_not_called()
    assert runtime_meta.tmdbid == 123456


def test_recognizer_module_switch_does_not_disable_fixed_id_episode_stage(monkeypatch):
    module = _load_plugin(monkeypatch)
    runtime_meta = SimpleNamespace(
        name="固定 TMDB 标题", year="2026", type=module.MediaType.TV,
        begin_season=1, begin_episode=13, end_episode=None, tmdbid=123456,
        doubanid=None, bangumiid=None,
    )
    plugin = _plugin_with_runtime(module, runtime_meta)
    plugin._config = plugin._normalize_config({
        "enabled": True, "recognizer_enabled": False, "episode_normalizer_enabled": True,
    })
    plugin._recognize_title = Mock()
    plugin._normalize_best_episode = Mock(return_value={
        "applied": True, "season": 2, "episode": 1, "end_episode": None,
        "episode_group": "group", "reason": "test",
    })
    plugin._append_history = Mock()

    plugin.on_name_recognize(SimpleNamespace(event_data={"title": "Fixed Show E13.mkv"}))

    plugin._recognize_title.assert_not_called()
    assert (runtime_meta.begin_season, runtime_meta.begin_episode) == (2, 1)


def test_anilist_quarter_import_reads_all_pages(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    pages = []

    class FakeResponse:
        def __init__(self, page):
            self.page = page

        @staticmethod
        def raise_for_status():
            return None

        def json(self):
            return {"data": {"Page": {
                "pageInfo": {"hasNextPage": self.page == 1},
                "media": [{"id": self.page}],
            }}}

    class FakeRequest:
        def __init__(self, **kwargs):
            pass

        @staticmethod
        def post_res(url, json):
            page = json["variables"]["page"]
            pages.append(page)
            return FakeResponse(page)

    monkeypatch.setattr(module, "RequestUtils", FakeRequest)

    result = plugin._fetch_anilist_quarter(2026, 3, {"User-Agent": "test"})

    assert [item["id"] for item in result] == [1, 2]
    assert pages == [1, 2]


def test_catalog_helpers_classify_region_and_sequel(monkeypatch):
    module = _load_plugin(monkeypatch)
    subject = {
        "id": 1,
        "name": "Example Anime 3rd Season",
        "name_cn": "示例动画 第三季",
        "date": "2026-07-03",
        "platform": "TV",
        "tags": [{"name": "日本"}],
        "meta_tags": ["日本", "TV"],
        "images": {},
    }

    item = module.TmdbRecognizeEnhancer._normalize_bangumi_subject(subject, "2026-Q3")

    assert item["region"] == "japan"
    assert item["is_multi_season"] is True
    assert module.TmdbRecognizeEnhancer._infer_title_season("示例动画 第十二季") == 12


def test_anilist_catalog_has_filter_fields_before_tmdb_matching(monkeypatch):
    module = _load_plugin(monkeypatch)
    media = {
        "id": 88,
        "idMal": 99,
        "title": {"romaji": "Example 2nd Season", "english": "Example Season 2", "native": "例"},
        "synonyms": ["Example II"],
        "format": "TV",
        "countryOfOrigin": "JP",
        "episodes": 12,
        "startDate": {"year": 2026, "month": 7, "day": 3},
        "coverImage": {},
        "relations": {"edges": [{"relationType": "PREQUEL", "node": {"type": "ANIME"}}]},
    }

    item = module.TmdbRecognizeEnhancer._normalize_anilist_media(media, "2026-Q3")

    assert item["region"] == "japan"
    assert item["platform"] == "TV"
    assert item["is_multi_season"] is True
    assert "tmdb_match" not in item


def test_anibridge_mapping_prefills_tmdb_without_title_search(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    catalog = [{
        "id": "anilist:88", "anilist_id": 88, "display_name": "Example",
        "name": "Example", "date": "2026-07-03",
    }]

    class FakeResponse:
        @staticmethod
        def raise_for_status():
            return None

        @staticmethod
        def json():
            return {"anilist:88": {"tmdb_show:456:s2": {"1-12": "1-12"}}}

    class FakeRequest:
        def __init__(self, **kwargs):
            pass

        @staticmethod
        def get_res(url):
            return FakeResponse()

    monkeypatch.setattr(module, "RequestUtils", FakeRequest)
    plugin._enrich_anibridge_mappings(catalog, {})

    assert catalog[0]["tmdb_match"]["accepted"] is True
    assert catalog[0]["tmdb_match"]["best"]["tmdb_id"] == 456
    assert catalog[0]["tmdb_match"]["best"]["source"] == "anibridge"


def test_catalog_fast_match_uses_structured_english_title(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._config["max_queries"] = 1
    searched = []

    class FakeTmdb:
        def __init__(self, language=None):
            assert language == "en-US"

        @staticmethod
        def search_multiis(title):
            searched.append(title)
            return [{
                "id": 789,
                "name": "The Example Anime",
                "original_name": "例のアニメ",
                "first_air_date": "2026-07-01",
                "media_type": module.MediaType.TV,
            }]

        @staticmethod
        def close():
            return None

    monkeypatch.setattr(module, "TmdbApi", FakeTmdb)
    item = {
        "search_titles": ["The Example Anime", "Rei no Anime"],
        "aliases": ["The Example Anime", "Rei no Anime", "例のアニメ"],
        "name": "Rei no Anime",
    }

    match = plugin._fast_catalog_tmdb_match(item)

    assert match["accepted"] is True
    assert match["best"]["tmdb_id"] == 789
    assert match["best"]["score"] >= 90.0
    assert len(searched) >= 2
    assert "Rei no Anime" in searched


def test_catalog_search_titles_remove_season_noise_but_keep_aliases(monkeypatch):
    module = _load_plugin(monkeypatch)
    item = {
        "search_titles": [
            "Mushoku Tensei II: Isekai Ittara Honki Dasu Part 2",
            "Mushoku Tensei: Jobless Reincarnation Season 2 Part 2",
            "无职转生 第二季",
        ],
        "aliases": ["無職転生 II ～異世界行ったら本気だす～"],
        "name": "Mushoku Tensei II: Isekai Ittara Honki Dasu Part 2",
        "is_multi_season": True,
    }

    titles = module.TmdbRecognizeEnhancer._catalog_search_titles(item)

    assert titles[0] == "Mushoku Tensei"
    assert "无职转生" in titles
    assert "Mushoku Tensei: Jobless Reincarnation Season 2 Part 2" in titles
    assert item["aliases"] == ["無職転生 II ～異世界行ったら本気だす～"]


def test_catalog_match_prefers_main_multiseason_animation_over_rogue_sequel(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())

    class FakeTmdb:
        def __init__(self, language=None):
            pass

        @staticmethod
        def search_multiis(title):
            return [
                {
                    "id": 10, "name": "Example Season 2", "media_type": module.MediaType.TV,
                    "first_air_date": "2026-07-01", "genre_ids": [16], "original_language": "ja",
                },
                {
                    "id": 20, "name": "Example", "media_type": module.MediaType.TV,
                    "first_air_date": "2024-01-01", "genre_ids": [16], "original_language": "ja",
                },
            ]

        @staticmethod
        def get_info(mtype, tmdbid):
            return {
                "name": "Example Season 2" if tmdbid == 10 else "Example",
                "first_air_date": "2026-07-01" if tmdbid == 10 else "2024-01-01",
                "genres": [{"id": 16}], "original_language": "ja",
                "seasons": (
                    [{"season_number": 1}]
                    if tmdbid == 10 else [{"season_number": 1}, {"season_number": 2}]
                ),
            }

        @staticmethod
        def close():
            return None

    monkeypatch.setattr(module, "TmdbApi", FakeTmdb)
    item = {
        "search_titles": ["Example Season 2", "Example"],
        "aliases": ["Example Season 2", "Example"],
        "name": "Example Season 2",
        "date": "2026-07-01",
        "region": "japan",
        "has_prequel": True,
        "is_multi_season": True,
        "franchise_start_year": 2024,
        "platform": "TV",
    }

    match = plugin._fast_catalog_tmdb_match(item)

    assert match["accepted"] is True
    assert match["best"]["tmdb_id"] == 20
    assert match["best"]["score"] > 90


def test_catalog_movie_uses_movie_candidate_and_rejects_live_action(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())

    class FakeTmdb:
        def __init__(self, language=None):
            pass

        @staticmethod
        def search_multiis(title):
            return [
                {
                    "id": 1, "title": "Animated Example", "media_type": module.MediaType.MOVIE,
                    "release_date": "2026-07-01", "genre_ids": [18], "original_language": "en",
                },
                {
                    "id": 2, "title": "Animated Example", "media_type": module.MediaType.MOVIE,
                    "release_date": "2026-07-01", "genre_ids": [16], "original_language": "en",
                },
            ]

        @staticmethod
        def close():
            return None

    monkeypatch.setattr(module, "TmdbApi", FakeTmdb)
    item = {
        "search_titles": ["Animated Example"], "aliases": ["Animated Example"],
        "name": "Animated Example", "date": "2026-07-01", "region": "western",
        "platform": "MOVIE", "catalog_media_type": "movie",
    }

    match = plugin._fast_catalog_tmdb_match(item)

    assert match["accepted"] is True
    assert match["best"]["tmdb_id"] == 2
    assert match["best"]["media_type"] == module.MediaType.MOVIE.value


def test_manual_catalog_item_infers_latest_tmdb_season_quarter(monkeypatch):
    module = _load_plugin(monkeypatch)

    item, quarter = module.TmdbRecognizeEnhancer._manual_catalog_item(321, {
        "name": "中文片名",
        "original_name": "Anime Name",
        "first_air_date": "2024-01-01",
        "seasons": [
            {"season_number": 1, "air_date": "2024-01-05"},
            {"season_number": 2, "air_date": "2026-07-03"},
        ],
    })

    assert quarter == "2026-Q3"
    assert item["quarter"] == "2026-Q3"
    assert item["source_season"] == 2
    assert item["display_name"] == "中文片名"


def test_manual_add_tmdb_rule_uses_inferred_quarter(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    info = {
        "name": "中文片名", "original_name": "Anime Name",
        "first_air_date": "2024-01-01",
        "seasons": [
            {"season_number": 1, "air_date": "2024-01-05"},
            {"season_number": 2, "air_date": "2026-07-03"},
        ],
    }
    plugin._tmdb_api = SimpleNamespace(get_info=lambda **kwargs: info)
    plugin._episode_normalizer = SimpleNamespace(
        suggest_installment_start=lambda **kwargs: {"season": 2, "episode": 1},
        clear_cache=lambda: None,
    )

    response = plugin.manual_add_episode_rule_api({"tmdb_id": 321, "preference": "default"})

    assert response.success is True
    assert response.data["quarter"] == "2026-Q3"
    assert response.data["quarter_inferred"] is True
    rule = response.data["rule"]
    assert rule["tmdb_id"] == 321
    assert rule["installments"][0]["quarter"] == "2026-Q3"
    assert rule["installments"][0]["source_season"] == 2


def test_batch_delete_episode_rules_only_removes_requested_ids(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._data[plugin.DATA_KEY_EPISODE_RULES] = [
        {"tmdb_id": 1, "title": "One"},
        {"tmdb_id": 2, "title": "Two"},
        {"tmdb_id": 3, "title": "Three"},
    ]

    response = plugin.batch_delete_episode_rules_api({"tmdb_ids": [1, 3]})

    assert response.success is True
    assert response.data["deleted"] == 2
    assert [rule["tmdb_id"] for rule in response.data["rules"]] == [2]


def test_rule_tmdb_id_can_be_corrected_without_leaving_old_rule(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._tmdb_api = SimpleNamespace(get_info=lambda **kwargs: {"id": 456, "name": "正确中文标题"})
    plugin._data[plugin.DATA_KEY_EPISODE_RULES] = [{
        "tmdb_id": 123, "title": "错误标题", "enabled": True,
        "target_type": "default", "episode_group_id": "", "installments": [],
    }]
    plugin._data[plugin.DATA_KEY_SEASON_CATALOG] = {
        "2026-Q3": {
            "items": [{
                "id": "anilist:1", "name": "Wrong",
                "tmdb_match": {
                    "accepted": True,
                    "best": {"tmdb_id": 123, "name": "错误标题", "media_type": "电视剧"},
                },
            }],
            "updated_at": "",
        },
    }

    response = plugin.save_episode_rule_api({
        "original_tmdb_id": 123,
        "tmdb_id": 456,
        "title": "错误标题",
        "enabled": True,
        "target_type": "default",
        "installments": [],
    })

    assert response.success is True
    assert [rule["tmdb_id"] for rule in response.data["rules"]] == [456]
    assert response.data["rule"]["title"] == "正确中文标题"
    catalog_item = plugin._data[plugin.DATA_KEY_SEASON_CATALOG]["2026-Q3"]["items"][0]
    assert catalog_item["tmdb_match"]["best"]["tmdb_id"] == 456
    assert catalog_item["display_name"] == "正确中文标题"
    assert catalog_item["scan_status"] == "matched"


def test_catalog_scan_adds_localized_title_and_multi_season(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())

    class FakeTmdb:
        def __init__(self, language=None):
            pass

        @staticmethod
        def get_info(**kwargs):
            return {
                "name": "中文动画名",
                "seasons": [{"season_number": 1}, {"season_number": 2}],
            }

        @staticmethod
        def close():
            return None

    monkeypatch.setattr(module, "TmdbApi", FakeTmdb)
    item = {
        "id": "anilist:1",
        "name": "Anime",
        "aliases": ["Anime"],
        "is_multi_season": False,
        "tmdb_match": {
            "accepted": True,
            "best": {"tmdb_id": 789, "name": "Anime", "media_type": module.MediaType.TV.value},
        },
    }

    updated = plugin._scan_catalog_item(item)

    assert updated["scan_status"] == "matched"
    assert updated["display_name"] == "中文动画名"
    assert updated["is_multi_season"] is True


def test_scan_result_merge_preserves_concurrent_catalog_fields(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._data[plugin.DATA_KEY_SEASON_CATALOG] = {
        "2026-Q3": {
            "items": [{
                "id": "anilist:1", "name": "Anime", "maintained": True,
                "scan_status": "scanning", "custom_field": "keep",
            }],
            "updated_at": "",
        }
    }

    plugin._merge_catalog_scan_item("2026-Q3", {
        "id": "anilist:1", "scan_status": "matched", "display_name": "中文名",
        "tmdb_match": {"accepted": True, "best": {"tmdb_id": 1}},
    })

    item = plugin._data[plugin.DATA_KEY_SEASON_CATALOG]["2026-Q3"]["items"][0]
    assert item["scan_status"] == "matched"
    assert item["display_name"] == "中文名"
    assert item["maintained"] is True
    assert item["custom_field"] == "keep"


def test_scan_result_does_not_overwrite_user_corrected_match(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._data[plugin.DATA_KEY_SEASON_CATALOG] = {
        "2026-Q3": {
            "items": [{
                "id": "anilist:1", "display_name": "用户选择",
                "scan_status": "matched",
                "tmdb_match": {
                    "accepted": True, "reason": "用户补充 TMDBID",
                    "best": {"tmdb_id": 456, "name": "用户选择"},
                },
            }],
            "updated_at": "",
        }
    }

    plugin._merge_catalog_scan_item("2026-Q3", {
        "id": "anilist:1", "scan_status": "matched", "display_name": "后台错误结果",
        "tmdb_match": {"accepted": True, "best": {"tmdb_id": 123}},
    })

    item = plugin._data[plugin.DATA_KEY_SEASON_CATALOG]["2026-Q3"]["items"][0]
    assert item["tmdb_match"]["best"]["tmdb_id"] == 456
    assert item["display_name"] == "用户选择"


def test_title_only_episode_preview_uses_saved_rule(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._data[plugin.DATA_KEY_EPISODE_RULES] = [{
        "tmdb_id": 123,
        "title": "Example",
        "enabled": True,
        "target_type": "default",
        "episode_group_id": "",
        "installments": [],
    }]
    plugin._recognize_title = Mock(return_value={
        "accepted": True,
        "best": {"tmdb_id": 123, "name": "Example", "media_type": module.MediaType.TV.value},
        "reason": "matched",
    })
    fake_normalizer = SimpleNamespace(normalize=Mock(return_value={
        "applied": False,
        "season": 1,
        "episode": 2,
        "reason": "already normalized",
        "strategy": "target-coordinate",
    }))
    plugin._episode_normalizer = fake_normalizer
    monkeypatch.setattr(module, "MetaInfo", lambda title: SimpleNamespace(
        name="Example",
        year="",
        type=module.MediaType.TV,
        begin_season=1,
        begin_episode=2,
        end_episode=None,
    ))

    response = plugin.preview_episode_normalizer_api({"title": "Example S01E02.mkv"})

    assert response.success is True
    assert response.data["recognition"]["best"]["tmdb_id"] == 123
    assert fake_normalizer.normalize.call_args.kwargs["episode"] == 2


def test_catalog_add_prefers_production_but_preserves_existing_target(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    plugin._match_catalog_item = Mock(return_value={
        "accepted": True,
        "best": {"tmdb_id": 456, "name": "Example", "media_type": module.MediaType.TV.value},
    })
    normalizer = SimpleNamespace(
        recommend_target=Mock(return_value={
            "target_type": "group",
            "reason": "默认单季，推荐主流多季剧集组",
            "group": {"id": "production", "name": "Season Order", "type": 6},
        }),
        suggest_installment_start=Mock(return_value={"season": 2, "episode": 1, "strategy": "air-date"}),
    )
    plugin._normalizer = lambda: normalizer
    item = {
        "id": "bangumi:1",
        "name": "Example 2nd Season",
        "name_cn": "示例 第二季",
        "aliases": ["Example Season 2"],
        "quarter": "2026-Q3",
        "date": "2026-07-01",
    }
    rules = []

    outcome = plugin._add_catalog_item_to_rules(item, "group_preferred", rules)

    assert outcome["rule"]["target_type"] == "group"
    assert outcome["rule"]["episode_group_id"] == "production"
    assert outcome["rule"]["installments"][0]["target_start_season"] == 2

    existing = outcome["rule"]
    existing["target_type"] = "default"
    existing["episode_group_id"] = ""
    rules[:] = [existing]
    plugin._add_catalog_item_to_rules(item, "group_preferred", rules)
    assert rules[0]["target_type"] == "default"
