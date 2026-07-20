"""插件运行时 MetaBase 捕获适配器测试。"""

import asyncio
import importlib.util
import sys
from pathlib import Path
from types import ModuleType, SimpleNamespace


def _load_adapter_module():
    module_path = Path(__file__).parents[1] / "plugins.v2" / "tmdbrecognizeenhancer" / "runtime_adapter.py"
    spec = importlib.util.spec_from_file_location("runtime_adapter_under_test", module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


def test_runtime_adapter_captures_sync_and_async_meta(monkeypatch):
    app_module = ModuleType("app")
    chain_module = ModuleType("app.chain")
    media_module = ModuleType("app.chain.media")

    class FakeMediaChain:
        def _recognize_with_fallback_by_meta(self, metainfo, **kwargs):
            return adapter.current_meta()

        async def _async_recognize_with_fallback_by_meta(self, metainfo, **kwargs):
            return adapter.current_meta()

    media_module.MediaChain = FakeMediaChain
    monkeypatch.setitem(sys.modules, "app", app_module)
    monkeypatch.setitem(sys.modules, "app.chain", chain_module)
    monkeypatch.setitem(sys.modules, "app.chain.media", media_module)

    module = _load_adapter_module()
    adapter = module.MoviePilotRuntimeAdapter()
    original_sync = FakeMediaChain._recognize_with_fallback_by_meta
    original_async = FakeMediaChain._async_recognize_with_fallback_by_meta
    meta = SimpleNamespace(name="Parsed Anime", begin_season=2, begin_episode=1)

    assert adapter.install() is True
    assert FakeMediaChain()._recognize_with_fallback_by_meta(meta) is meta
    assert asyncio.run(FakeMediaChain()._async_recognize_with_fallback_by_meta(meta)) is meta
    assert adapter.current_meta() is None

    adapter.uninstall()
    assert FakeMediaChain._recognize_with_fallback_by_meta is original_sync
    assert FakeMediaChain._async_recognize_with_fallback_by_meta is original_async


def test_new_adapter_instance_owns_wrapper_after_hot_reload(monkeypatch):
    app_module = ModuleType("app")
    chain_module = ModuleType("app.chain")
    media_module = ModuleType("app.chain.media")

    class FakeMediaChain:
        def _recognize_with_fallback_by_meta(self, metainfo, **kwargs):
            return metainfo

        async def _async_recognize_with_fallback_by_meta(self, metainfo, **kwargs):
            return metainfo

    media_module.MediaChain = FakeMediaChain
    monkeypatch.setitem(sys.modules, "app", app_module)
    monkeypatch.setitem(sys.modules, "app.chain", chain_module)
    monkeypatch.setitem(sys.modules, "app.chain.media", media_module)

    module = _load_adapter_module()
    old_adapter = module.MoviePilotRuntimeAdapter()
    new_adapter = module.MoviePilotRuntimeAdapter()
    original_sync = FakeMediaChain._recognize_with_fallback_by_meta

    assert old_adapter.install() is True
    assert new_adapter.install() is True
    old_adapter.uninstall()
    assert FakeMediaChain._recognize_with_fallback_by_meta is not original_sync

    new_adapter.uninstall()
    assert FakeMediaChain._recognize_with_fallback_by_meta is original_sync


def test_runtime_adapter_applies_processor_before_recognition(monkeypatch):
    app_module = ModuleType("app")
    chain_module = ModuleType("app.chain")
    media_module = ModuleType("app.chain.media")

    class FakeMediaChain:
        def _recognize_with_fallback_by_meta(self, metainfo, **kwargs):
            return metainfo.video_bit

        async def _async_recognize_with_fallback_by_meta(self, metainfo, **kwargs):
            return metainfo.video_bit

    media_module.MediaChain = FakeMediaChain
    monkeypatch.setitem(sys.modules, "app", app_module)
    monkeypatch.setitem(sys.modules, "app.chain", chain_module)
    monkeypatch.setitem(sys.modules, "app.chain.media", media_module)
    module = _load_adapter_module()
    adapter = module.MoviePilotRuntimeAdapter()

    assert adapter.install(lambda meta: setattr(meta, "video_bit", "12bit")) is True
    meta = SimpleNamespace(video_bit="10bit")
    assert FakeMediaChain()._recognize_with_fallback_by_meta(meta) == "12bit"
    meta.video_bit = "10bit"
    assert asyncio.run(FakeMediaChain()._async_recognize_with_fallback_by_meta(meta)) == "12bit"


def test_runtime_adapter_applies_postprocessor_after_native_result(monkeypatch):
    app_module = ModuleType("app")
    chain_module = ModuleType("app.chain")
    media_module = ModuleType("app.chain.media")

    class FakeMediaChain:
        def _recognize_with_fallback_by_meta(self, metainfo, **kwargs):
            return SimpleNamespace(tmdb_id=100, season=1)

        async def _async_recognize_with_fallback_by_meta(self, metainfo, **kwargs):
            return SimpleNamespace(tmdb_id=100, season=1)

    media_module.MediaChain = FakeMediaChain
    monkeypatch.setitem(sys.modules, "app", app_module)
    monkeypatch.setitem(sys.modules, "app.chain", chain_module)
    monkeypatch.setitem(sys.modules, "app.chain.media", media_module)
    module = _load_adapter_module()
    adapter = module.MoviePilotRuntimeAdapter()

    def postprocess(meta, media):
        assert adapter.current_meta() is meta
        meta.begin_season = 2
        media.season = 2
        return media

    assert adapter.install(postprocessor=postprocess) is True
    sync_meta = SimpleNamespace(begin_season=1)
    sync_result = FakeMediaChain()._recognize_with_fallback_by_meta(sync_meta)
    assert (sync_meta.begin_season, sync_result.season) == (2, 2)

    async_meta = SimpleNamespace(begin_season=1)
    async_result = asyncio.run(
        FakeMediaChain()._async_recognize_with_fallback_by_meta(async_meta)
    )
    assert (async_meta.begin_season, async_result.season) == (2, 2)


def test_transfer_adapter_normalizes_preidentified_task_and_replaces_episode_data(monkeypatch):
    app_module = ModuleType("app")
    modules_module = ModuleType("app.modules")
    filemanager_module = ModuleType("app.modules.filemanager")

    class FakeFileManagerModule:
        def transfer(
                self, fileitem, meta, mediainfo, episodes_info=None, preview=False,
        ):
            return meta, mediainfo, episodes_info

    filemanager_module.FileManagerModule = FakeFileManagerModule
    monkeypatch.setitem(sys.modules, "app", app_module)
    monkeypatch.setitem(sys.modules, "app.modules", modules_module)
    monkeypatch.setitem(sys.modules, "app.modules.filemanager", filemanager_module)
    module = _load_adapter_module()
    adapter = module.EpisodeNormalizationTransferAdapter()
    original = FakeFileManagerModule.transfer

    def normalize(meta, mediainfo, episodes_info):
        meta.begin_season = 2
        mediainfo.season = 2
        return ["S02E01"]

    assert adapter.install(normalize) is True
    meta = SimpleNamespace(begin_season=1)
    media = SimpleNamespace(season=1)
    returned_meta, returned_media, episodes = FakeFileManagerModule().transfer(
        object(), meta, media, episodes_info=["S01E13"],
    )

    assert returned_meta is meta
    assert returned_media is media
    assert (meta.begin_season, media.season) == (2, 2)
    assert episodes == ["S02E01"]

    adapter.uninstall()
    assert FakeFileManagerModule.transfer is original
