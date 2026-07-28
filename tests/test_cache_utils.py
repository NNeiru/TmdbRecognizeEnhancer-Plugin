"""Bounded runtime cache behavior."""

import importlib.util
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "plugins.v2" / "tmdbrecognizeenhancer" / "cache_utils.py"


def _cache_class():
    spec = importlib.util.spec_from_file_location("cache_utils_test", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module.BoundedTTLCache


def test_cache_evicts_least_recently_used_item():
    cache = _cache_class()(max_size=2, ttl_seconds=60)
    cache["first"] = 1
    cache["second"] = 2

    assert cache["first"] == 1
    cache["third"] = 3

    assert "first" in cache
    assert "second" not in cache
    assert cache["third"] == 3


def test_cache_expires_idle_items():
    now = [10.0]
    cache = _cache_class()(
        max_size=2,
        ttl_seconds=5,
        clock=lambda: now[0],
    )
    cache["item"] = {"value": 1}

    now[0] = 14.9
    assert cache["item"] == {"value": 1}
    now[0] = 20.0

    assert "item" not in cache
    assert len(cache) == 0
