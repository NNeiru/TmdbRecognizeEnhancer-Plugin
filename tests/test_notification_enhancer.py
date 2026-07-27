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


def test_notification_type_routes_cover_all_moviepilot_types():
    assert module.notification_type_key("资源下载") == "download"
    assert module.notification_type_key("订阅") == "subscribe"
    assert module.notification_type_key("媒体服务器") == "media_server"
    assert module.notification_type_key("不存在的新类型") == "other"

    routes = module.normalize_notification_routes({
        "subscribe": {"policy": "record", "service": "订阅通知 · Telegram"},
        "site": {"policy": "invalid"},
    })
    assert set(routes) == {
        "download", "organize", "subscribe", "site", "media_server",
        "manual", "plugin", "agent", "other",
    }
    assert routes["subscribe"]["policy"] == "record"
    assert routes["subscribe"]["service"] == "订阅通知 · Telegram"
    assert routes["site"]["policy"] == "notify"


def test_content_templates_cover_moviepilot_native_template_types():
    assert module.notification_content_key("organizeSuccess") == "organizeSuccess"
    assert module.notification_content_key("ContentType.SubscribeComplete") == (
        "subscribeComplete"
    )
    assert module.notification_content_key("unknown") == ""

    templates = module.normalize_notification_content_templates({
        "downloadAdded": {
            "title_template": "下载：{{ original_title }}",
            "text_template": "",
        },
    })
    assert set(templates) == {
        "organizeSuccess",
        "downloadAdded",
        "subscribeAdded",
        "subscribeComplete",
    }
    assert templates["downloadAdded"]["title_template"] == (
        "下载：{{ original_title }}"
    )
    assert templates["downloadAdded"]["text_template"] == "{{ original_text }}"
