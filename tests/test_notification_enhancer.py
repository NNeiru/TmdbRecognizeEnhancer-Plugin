"""入库通知分类和策略测试。"""

import importlib.util
from pathlib import Path


def _load_module():
    path = (
        Path(__file__).parents[1]
        / "plugins.v2"
        / "tmdbrecognizeenhancer"
        / "notification_enhancer.py"
    )
    spec = importlib.util.spec_from_file_location("notification_enhancer_test", path)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


module = _load_module()


def test_classifies_recognition_failure():
    result = module.classify_failure("未识别到媒体信息，无法匹配 TMDB")
    assert result["key"] == "recognition"


def test_classifies_structured_subtitle_failure_before_text():
    result = module.classify_failure(
        "目标目录权限不足",
        event_kind="transfer.subtitle.failed",
    )
    assert result["key"] == "subtitle_audio"


def test_unknown_failure_cannot_be_silenced():
    policies = module.normalize_failure_policies({
        "recognition": "silent",
        "unknown": "silent",
    })
    assert policies["recognition"] == "silent"
    assert policies["unknown"] == "notify"


def test_notice_kind_understands_native_success_and_failure():
    assert module.notification_kind({
        "mtype": "整理入库",
        "ctype": "organizeSuccess",
        "title": "入库完成",
    }) == "success"
    assert module.notification_kind({
        "mtype": "手动处理",
        "title": "动画 S01E01 入库失败！",
        "text": "原因：目标目录不可用",
    }) == "failure"
    assert module.notification_kind({
        "mtype": "手动处理",
        "title": "站点 Cookie 失效",
    }) == "other"


def test_extracts_failure_reason_and_compacts_records():
    assert module.extract_reason("原因：权限不足\n\n请检查目录") == "权限不足"
    first = module.build_record(
        scene="failure",
        title="测试",
        text="原因：权限不足",
        category={"key": "storage"},
    )
    compacted = module.compact_records([first, first], limit=20)
    assert len(compacted) == 1


def test_digest_summary_only_counts_pending_digest():
    assert module.summarize_digest([
        {"policy": "digest", "action": "digest_pending", "category": {"key": "storage"}},
        {"policy": "digest", "action": "digest_sent", "category": {"key": "storage"}},
        {"policy": "notify", "action": "notified", "category": {"key": "recognition"}},
    ]) == {"total": 1, "categories": {"storage": 1}}
