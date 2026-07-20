"""神医 Pro SyncMediaInfo 客户端的路径映射与响应语义测试。"""

import importlib.util
import sys
from pathlib import Path
from types import ModuleType, SimpleNamespace


ROOT = Path(__file__).resolve().parents[1]
PLUGIN_DIR = ROOT / "plugins.v2" / "tmdbrecognizeenhancer"
PACKAGE = "strm_sync_testpkg"

app_module = sys.modules.setdefault("app", ModuleType("app"))
utils_module = sys.modules.setdefault("app.utils", ModuleType("app.utils"))
http_module = sys.modules.setdefault("app.utils.http", ModuleType("app.utils.http"))
if not hasattr(http_module, "RequestUtils"):
    http_module.RequestUtils = object

package_module = sys.modules.setdefault(PACKAGE, ModuleType(PACKAGE))
package_module.__path__ = [str(PLUGIN_DIR)]


def _load(name):
    full_name = f"{PACKAGE}.{name}"
    if full_name in sys.modules:
        return sys.modules[full_name]
    spec = importlib.util.spec_from_file_location(full_name, PLUGIN_DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[full_name] = module
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


_load("emby_media_info")
_load("emby_episode_group_sync")
sync_module = _load("strm_media_info_sync")
StrmMediaInfoSynchronizer = sync_module.StrmMediaInfoSynchronizer


def _payload(ticks=100_000_000):
    return [{
        "MediaSourceInfo": {
            "Size": 1024,
            "RunTimeTicks": ticks,
            "Container": "mkv",
            "MediaStreams": [],
        },
        "Chapters": [],
        "ZeroFingerprintConfidence": False,
    }]


class FakeResponse:
    def __init__(self, status_code=200, payload=None):
        self.status_code = status_code
        self._payload = payload
        self.content = b"json" if payload is not None else b""

    def json(self):
        return self._payload

    def close(self):
        return None


class FakeRequester:
    def __init__(self, state):
        self.state = state

    def post_res(self, url, params=None, json=None):
        self.state["calls"].append((url, params, json))
        return self.state["response"]


def _sync(response):
    state = {"calls": [], "response": response}
    instance = SimpleNamespace(_host="http://emby/", _apikey="secret")
    services = {"主 Emby": SimpleNamespace(type="emby", instance=instance)}
    sync = StrmMediaInfoSynchronizer(
        lambda: services,
        request_factory=lambda **_kwargs: FakeRequester(state),
    )
    return sync, state


def _push(sync, target="/mp/media/Anime/E01.mkv", payload=None):
    return sync.push(
        {"target_path": target, "sync_payload": payload or _payload()},
        {
            "servers": ["主 Emby"],
            "path_mappings": [{
                "server": "主 Emby", "source": "/mp/media", "target": "/emby/library",
            }],
        },
    )


def test_push_uses_mapped_path_and_pro_contract():
    sync, state = _sync(FakeResponse(200, _payload()))

    outcome = _push(sync)

    result = outcome["results"]["主 Emby"]
    assert result["status"] == "synced"
    assert result["mapped_path"] == "/emby/library/Anime/E01.mkv"
    url, params, body = state["calls"][0]
    assert url == "http://emby/emby/Items/SyncMediaInfo"
    assert params == {"Path": "/emby/library/Anime/E01.mkv", "api_key": "secret"}
    assert body == _payload()


def test_404_is_terminal_pro_unsupported():
    sync, _ = _sync(FakeResponse(404, {"Message": "Not Found"}))

    outcome = _push(sync)

    result = outcome["results"]["主 Emby"]
    assert result["status"] == "unsupported"
    assert "Pro" in result["reason"]
    assert outcome["retryable"] is False


def test_400_waits_for_emby_library_scan():
    sync, _ = _sync(FakeResponse(400, {"Message": "item not found"}))

    outcome = _push(sync)

    assert outcome["results"]["主 Emby"]["status"] == "pending"
    assert outcome["retryable"] is True


def test_empty_200_is_terminal_rejection():
    sync, _ = _sync(FakeResponse(200, []))

    outcome = _push(sync)

    assert outcome["results"]["主 Emby"]["status"] == "empty"
    assert outcome["retryable"] is False


def test_different_returned_ticks_means_local_media_info_won():
    sync, _ = _sync(FakeResponse(200, _payload(ticks=200_000_000)))

    outcome = _push(sync, payload=_payload(ticks=100_000_000))

    result = outcome["results"]["主 Emby"]
    assert result["status"] == "local"
    assert "本地优先" in result["reason"]


def test_missing_size_or_duration_never_sends_request():
    sync, state = _sync(FakeResponse(200, []))
    invalid = _payload()
    invalid[0]["MediaSourceInfo"].pop("Size")

    outcome = _push(sync, payload=invalid)

    assert outcome["retryable"] is False
    assert "大小或时长" in outcome["reason"]
    assert state["calls"] == []


def test_completed_server_is_not_pushed_twice():
    sync, state = _sync(FakeResponse(200, _payload()))

    outcome = sync.push(
        {"target_path": "/x.mkv", "sync_payload": _payload()},
        {"servers": [], "path_mappings": []},
        previous={"主 Emby": {"status": "synced", "reason": "done"}},
    )

    assert outcome["results"]["主 Emby"]["status"] == "synced"
    assert state["calls"] == []
