"""内置识别字段覆盖层测试。"""

import importlib.util
from pathlib import Path
from types import SimpleNamespace


def _load_module():
    path = Path(__file__).parents[1] / "plugins.v2" / "tmdbrecognizeenhancer" / "recognition_rules.py"
    spec = importlib.util.spec_from_file_location("recognition_rules_under_test", path)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


def _meta(title):
    values = {spec["attr"]: None for spec in _load_module().FIELD_SPECS.values()}
    return SimpleNamespace(title=title, org_string=title, original_name=title, name=title, **values)


def test_override_changes_video_bit_after_mp_parse():
    module = _load_module()
    registry = module.RecognitionRuleRegistry()
    registry.refresh([{
        "field": "videoBit", "pattern": r"10[ ._-]*bit", "value": "12bit",
        "label": "测试位深覆盖", "enabled": True,
    }])
    meta = _meta("Example.S01E01.1080p.10-bit.mkv")
    meta.video_bit = "10bit"

    changes = registry.apply(meta)

    assert meta.video_bit == "12bit"
    assert changes[0]["field"] == "videoBit"
    assert changes[0]["before"] == "10bit"


def test_named_group_can_build_video_bit_value():
    module = _load_module()
    registry = module.RecognitionRuleRegistry()
    registry.refresh([{
        "field": "videoBit", "pattern": r"(?P<bit>8|10|12)[ ._-]*bits?",
        "value": "{bit}bit", "enabled": True,
    }])
    meta = _meta("Title.10bit.WEB-DL")

    registry.apply(meta)

    assert meta.video_bit == "10bit"


def test_clear_action_can_remove_mp_result():
    module = _load_module()
    registry = module.RecognitionRuleRegistry()
    registry.refresh([{
        "field": "webSource", "pattern": r"\bADWeb\b", "action": "clear",
        "enabled": True,
    }])
    meta = _meta("Title.WEB-DL-ADWeb")
    meta.web_source = "ADWeb"

    registry.apply(meta)

    assert meta.web_source is None


def test_user_rule_is_visible_in_catalog():
    module = _load_module()
    registry = module.RecognitionRuleRegistry()
    registry.refresh([{
        "field": "videoCodec", "pattern": r"VVC", "value": "H266",
        "label": "自定义 VVC", "enabled": True,
    }])

    custom = [item for item in registry.catalog()["items"] if item.get("source") == "plugin_user"]

    assert len(custom) == 1
    assert custom[0]["field"] == "videoCodec"
    assert custom[0]["builtin"] is False


def test_bulk_priority_creates_builtin_override_and_preserves_existing_edits():
    module = _load_module()
    registry = module.RecognitionRuleRegistry()
    first = registry._builtin_item(
        "videoCodec", r"\bHEVC\b", "H265", "HEVC",
        "mp_python", "MP 内置",
    )
    second = registry._builtin_item(
        "videoCodec", r"\bAVC\b", "H264", "AVC",
        "mp_python", "MP 内置",
    )
    registry._catalog = [first, second]
    existing = [{
        "source_rule_id": second["id"],
        "field": "videoCodec",
        "pattern": r"\bAVC(?:1)?\b",
        "value": "x264",
        "label": "用户已编辑",
        "enabled": False,
        "priority": 20,
    }]

    rules, updated, missing = registry.bulk_set_priority(
        existing, [first["id"], second["id"]], 240,
    )

    assert updated == 2
    assert missing == []
    assert len(rules) == 2
    by_source = {item["source_rule_id"]: item for item in rules}
    assert by_source[first["id"]]["priority"] == 240
    assert by_source[first["id"]]["pattern"] == r"\bHEVC\b"
    assert by_source[second["id"]]["priority"] == 240
    assert by_source[second["id"]]["pattern"] == r"\bAVC(?:1)?\b"
    assert by_source[second["id"]]["value"] == "x264"
    assert by_source[second["id"]]["enabled"] is False


def test_low_plugin_priority_still_runs_after_native_parse():
    module = _load_module()
    registry = module.RecognitionRuleRegistry()
    registry.refresh([{
        "field": "videoCodec",
        "pattern": r"\bHEVC\b",
        "value": "H265",
        "priority": -1000,
        "enabled": True,
    }])
    meta = _meta("Example.HEVC.mkv")
    meta.video_encode = "MP 原生结果"

    registry.apply(meta)

    assert meta.video_encode == "H265"
