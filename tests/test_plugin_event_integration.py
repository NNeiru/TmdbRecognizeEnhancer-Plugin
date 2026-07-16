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

    class FakeTmdb:
        def __init__(self, language=None):
            assert language == "en-US"

        @staticmethod
        def search_multiis(title):
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
    assert match["best"]["score"] == 100.0


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
        preferred_group=Mock(return_value={"id": "production", "name": "Season Order", "type": 6}),
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
