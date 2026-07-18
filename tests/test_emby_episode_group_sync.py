"""Emby 剧集组联动的路径消歧与幂等写入测试。"""

import importlib.util
import sys
from pathlib import Path
from types import ModuleType, SimpleNamespace


app_module = sys.modules.setdefault("app", ModuleType("app"))
utils_module = sys.modules.setdefault("app.utils", ModuleType("app.utils"))
http_module = sys.modules.setdefault("app.utils.http", ModuleType("app.utils.http"))
if not hasattr(http_module, "RequestUtils"):
    http_module.RequestUtils = object

module_path = Path(__file__).parents[1] / "plugins.v2" / "tmdbrecognizeenhancer" / "emby_episode_group_sync.py"
spec = importlib.util.spec_from_file_location("emby_episode_group_sync_under_test", module_path)
sync_module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(sync_module)
EmbyEpisodeGroupSynchronizer = sync_module.EmbyEpisodeGroupSynchronizer


def test_path_mapping_prefers_server_specific_longest_prefix():
    mapped = EmbyEpisodeGroupSynchronizer.map_path(
        "/media/TV/Anime/Season 02/E01.mkv",
        "主 Emby",
        [
            {"server": "*", "source": "/media", "target": "/mnt/media"},
            {"server": "主 Emby", "source": "/media/TV", "target": "/library/series"},
        ],
    )

    assert mapped == "/library/series/Anime/Season 02/E01.mkv"


def test_multiple_tmdb_series_requires_unique_path_match():
    items = [
        {"Id": "one", "Name": "Anime", "Path": "/library/a/Anime"},
        {"Id": "two", "Name": "Anime", "Path": "/library/b/Anime"},
    ]

    selected, reason = EmbyEpisodeGroupSynchronizer.select_series(
        items, "/library/b/Anime/Season 01/E01.mkv",
    )
    assert selected["Id"] == "two"
    assert "路径唯一定位" in reason

    selected, reason = EmbyEpisodeGroupSynchronizer.select_series(items, "/unknown/E01.mkv")
    assert selected is None
    assert "无法安全" in reason or "未能唯一" in reason


class FakeResponse:
    def __init__(self, status_code=200, payload=None):
        self.status_code = status_code
        self._payload = payload
        self.content = b"{}" if payload is not None else b""

    def json(self):
        return self._payload

    def close(self):
        return None


class FakeRequester:
    def __init__(self, state):
        self.state = state

    def get_res(self, url, params=None):
        self.state["calls"].append(("get", url, params, None))
        if url.endswith("/emby/Items"):
            return FakeResponse(payload={"Items": [{
                "Id": "series-1", "Name": "Anime", "Path": "/library/Anime",
                "ProviderIds": {"Tmdb": "223564"},
            }]})
        if url.endswith("/ExternalIdInfos"):
            return FakeResponse(payload=[{"Key": "TmdbEg"}])
        if "/Users/user-1/Items/series-1" in url:
            return FakeResponse(payload=self.state["detail"].copy() | {
                "ProviderIds": dict(self.state["detail"]["ProviderIds"]),
            })
        raise AssertionError(url)

    def post_res(self, url, params=None, json=None):
        self.state["calls"].append(("post", url, params, json))
        if url.endswith("/emby/Items/series-1"):
            self.state["detail"] = json
            return FakeResponse(status_code=204)
        if url.endswith("/Refresh"):
            return FakeResponse(status_code=204)
        raise AssertionError(url)


def _synchronizer(existing_group=""):
    provider_ids = {"Tmdb": "223564", "Tvdb": "9876"}
    if existing_group:
        provider_ids["TmdbEg"] = existing_group
    state = {
        "calls": [],
        "detail": {"Id": "series-1", "Name": "Anime", "ProviderIds": provider_ids},
    }
    instance = SimpleNamespace(_host="http://emby/", _apikey="secret", user="user-1")
    services = {"主 Emby": SimpleNamespace(type="emby", instance=instance)}
    sync = EmbyEpisodeGroupSynchronizer(
        lambda: services,
        request_factory=lambda **kwargs: FakeRequester(state),
    )
    return sync, state


def test_existing_correct_group_is_idempotent():
    sync, state = _synchronizer(existing_group="production-group")
    outcome = sync.reconcile(
        {"tmdb_id": 223564, "episode_group_id": "production-group", "target_path": "/library/Anime/E01.mkv"},
        {"servers": [], "path_mappings": [], "conflict_policy": "skip", "refresh_metadata": True},
    )

    assert outcome["results"]["主 Emby"]["status"] == "already"
    assert not [call for call in state["calls"] if call[0] == "post"]


def test_write_preserves_existing_provider_ids_and_refreshes():
    sync, state = _synchronizer()
    outcome = sync.reconcile(
        {"tmdb_id": 223564, "episode_group_id": "production-group", "target_path": "/library/Anime/E01.mkv"},
        {"servers": [], "path_mappings": [], "conflict_policy": "skip", "refresh_metadata": True},
    )

    assert outcome["results"]["主 Emby"]["status"] == "updated"
    assert state["detail"]["ProviderIds"] == {
        "Tmdb": "223564", "Tvdb": "9876", "TmdbEg": "production-group",
    }
    assert any(call[0] == "post" and call[1].endswith("/Refresh") for call in state["calls"])
