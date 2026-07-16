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
