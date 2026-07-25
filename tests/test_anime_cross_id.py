"""动画跨站 ID 数据库的快照与唯一映射测试。"""

import importlib.util
import json
from pathlib import Path


def _load_module():
    path = (
        Path(__file__).parents[1]
        / "plugins.v2"
        / "tmdbrecognizeenhancer"
        / "anime_cross_id.py"
    )
    spec = importlib.util.spec_from_file_location("anime_cross_id_test", path)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


def _payload():
    items = []
    for index in range(1000):
        items.append({
            "title": f"Filler Anime {index}",
            "type": "tv",
            "lang": "ja",
            "begin": "2020-01-01",
            "sites": [
                {"site": "aniList", "id": str(10000 + index)},
                {"site": "tmdb", "id": f"tv/{20000 + index}"},
            ],
        })
    items.extend([
        {
            "title": "本篇",
            "titleTranslate": {"zh-Hans": ["测试动画"]},
            "type": "tv",
            "lang": "ja",
            "begin": "2023-10-01",
            "sites": [
                {"site": "aniList", "id": "5001"},
                {"site": "bangumi", "id": "6001"},
                {"site": "tmdb", "id": "tv/7001"},
            ],
        },
        {
            "title": "本篇 第二季",
            "titleTranslate": {"zh-Hans": ["测试动画 第二季"]},
            "type": "tv",
            "lang": "ja",
            "begin": "2025-01-01",
            "sites": [
                {"site": "aniList", "id": "5002"},
                {"site": "tmdb", "id": "tv/7001"},
            ],
        },
    ])
    return json.dumps({"items": items}, ensure_ascii=False).encode()


def test_refresh_persists_snapshot_and_lookup_uses_stable_id(tmp_path):
    module = _load_module()
    database = module.AnimeCrossIdDatabase(tmp_path, lambda _: _payload())

    refreshed = database.refresh(force=True)

    assert refreshed["updated"] is True
    assert refreshed["ready"] is True
    assert (tmp_path / database.DATA_FILE).exists()
    assert database.lookup(anilist_id=5001)["tmdb_id"] == 7001
    assert database.lookup(title="测试动画 第二季")["tmdb_id"] == 7001

    loaded = module.AnimeCrossIdDatabase(tmp_path, lambda _: None)
    assert loaded.load() is True
    assert loaded.lookup(bangumi_id=6001)["tmdb_id"] == 7001


def test_same_title_with_different_tmdb_identity_is_not_guessed(tmp_path):
    module = _load_module()
    document = json.loads(_payload())
    document["items"].append({
        "title": "另一原名",
        "titleTranslate": {"zh-Hans": ["测试动画"]},
        "type": "tv",
        "lang": "ja",
        "begin": "2023-10-01",
        "sites": [
            {"site": "aniList", "id": "5999"},
            {"site": "tmdb", "id": "tv/7999"},
        ],
    })
    database = module.AnimeCrossIdDatabase(
        tmp_path, lambda _: json.dumps(document, ensure_ascii=False).encode(),
    )
    database.refresh(force=True)

    result = database.lookup(title="测试动画")

    assert result["accepted"] is False
    assert len(result["candidate_ids"]) == 2
