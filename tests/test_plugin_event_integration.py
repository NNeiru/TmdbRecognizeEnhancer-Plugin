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


def test_bangumi_quarter_import_reads_all_pages(monkeypatch):
    module = _load_plugin(monkeypatch)
    plugin = _plugin_with_runtime(module, SimpleNamespace())
    offsets = []

    class FakeResponse:
        def __init__(self, offset):
            self.offset = offset

        @staticmethod
        def raise_for_status():
            return None

        def json(self):
            if self.offset == 0:
                return {"data": [{"id": value} for value in range(100)], "total": 101}
            return {"data": [{"id": 100}], "total": 101}

    class FakeRequest:
        def __init__(self, **kwargs):
            pass

        @staticmethod
        def get_res(url):
            offset = int(url.rsplit("offset=", 1)[1])
            offsets.append(offset)
            return FakeResponse(offset)

    monkeypatch.setattr(module, "RequestUtils", FakeRequest)

    result = plugin._fetch_bangumi_quarter_month(2026, 7, {"User-Agent": "test"})

    assert len(result) == 101
    assert offsets == [0, 100]
