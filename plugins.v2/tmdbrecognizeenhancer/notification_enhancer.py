"""入库通知增强的分类、策略和展示数据模型。

本模块保持为纯 Python，既方便单元测试，也避免把通知规则继续堆进插件主类。
"""

from __future__ import annotations

import hashlib
import re
from datetime import datetime
from typing import Any, Dict, Iterable, List, Mapping, Optional


FAILURE_CATEGORIES: tuple[Dict[str, Any], ...] = (
    {
        "key": "recognition",
        "label": "媒体识别失败",
        "description": "标题、TMDB/豆瓣或媒体类型无法识别",
        "icon": "mdi-database-remove-outline",
        "patterns": (
            r"未识别到媒体信息", r"无法识别", r"识别失败", r"tmdb.*(?:失败|不存在|未匹配)",
            r"douban.*(?:失败|不存在|未匹配)", r"媒体信息为空",
        ),
    },
    {
        "key": "episode",
        "label": "季集信息异常",
        "description": "缺少季集、集数超范围或季集映射失败",
        "icon": "mdi-counter",
        "patterns": (
            r"季集", r"集数", r"剧集", r"episode", r"season", r"缺少.*(?:集|季)",
            r"未找到.*(?:集|季)", r"不存在.*(?:集|季)",
        ),
    },
    {
        "key": "metadata",
        "label": "分类或元数据异常",
        "description": "分类、刮削、命名元数据或目录模板不完整",
        "icon": "mdi-tag-outline",
        "patterns": (
            r"分类", r"元数据", r"刮削", r"模板", r"命名", r"category", r"metadata",
            r"render", r"jinja",
        ),
    },
    {
        "key": "duplicate",
        "label": "重复或覆盖冲突",
        "description": "目标已存在、重复入库或覆盖策略拒绝",
        "icon": "mdi-content-duplicate",
        "patterns": (
            r"已存在", r"重复", r"覆盖", r"冲突", r"duplicate", r"exist", r"overwrite",
            r"目标文件.*相同",
        ),
    },
    {
        "key": "storage",
        "label": "路径或存储异常",
        "description": "目录不可用、权限不足、空间不足或存储不可达",
        "icon": "mdi-folder-alert-outline",
        "patterns": (
            r"路径", r"目录", r"存储", r"空间不足", r"权限", r"只读", r"不存在",
            r"path", r"directory", r"storage", r"permission", r"read.?only", r"no space",
        ),
    },
    {
        "key": "file_operation",
        "label": "文件操作失败",
        "description": "复制、移动、硬链接、软链接或删除失败",
        "icon": "mdi-file-alert-outline",
        "patterns": (
            r"复制", r"移动", r"硬链接", r"软链接", r"链接失败", r"删除失败",
            r"copy", r"move", r"link", r"rename", r"unlink",
        ),
    },
    {
        "key": "subtitle_audio",
        "label": "字幕或音频失败",
        "description": "外挂字幕、音轨或伴随文件整理失败",
        "icon": "mdi-subtitles-outline",
        "patterns": (
            r"字幕", r"音频", r"音轨", r"subtitle", r"audio",
        ),
    },
    {
        "key": "unknown",
        "label": "未分类异常",
        "description": "暂未命中已知分类；默认始终通知",
        "icon": "mdi-alert-circle-outline",
        "patterns": (),
    },
)

FAILURE_CATEGORY_MAP = {item["key"]: item for item in FAILURE_CATEGORIES}
VALID_POLICIES = {"notify", "digest", "record", "silent"}

NOTIFICATION_TYPES: tuple[Dict[str, Any], ...] = (
    {
        "key": "download",
        "label": "资源下载",
        "description": "下载任务新增、开始、完成及下载异常",
        "icon": "mdi-download-circle-outline",
    },
    {
        "key": "organize",
        "label": "整理入库",
        "description": "媒体整理成功与入库完成",
        "icon": "mdi-folder-move-outline",
    },
    {
        "key": "subscribe",
        "label": "订阅",
        "description": "订阅新增、命中、完成及订阅状态变化",
        "icon": "mdi-rss-box",
    },
    {
        "key": "site",
        "label": "站点",
        "description": "站点消息、签到、Cookie 与站点异常",
        "icon": "mdi-web",
    },
    {
        "key": "media_server",
        "label": "媒体服务器",
        "description": "Emby、Jellyfin 或 Plex 的媒体库消息",
        "icon": "mdi-server-network",
    },
    {
        "key": "manual",
        "label": "手动处理",
        "description": "需人工确认的处理结果与整理失败",
        "icon": "mdi-hand-back-right-outline",
    },
    {
        "key": "plugin",
        "label": "插件",
        "description": "其它插件主动发出的通知；本插件自发消息会自动去重",
        "icon": "mdi-puzzle-outline",
    },
    {
        "key": "agent",
        "label": "智能体",
        "description": "MoviePilot 智能体任务与执行结果",
        "icon": "mdi-robot-outline",
    },
    {
        "key": "other",
        "label": "其它",
        "description": "未归入以上类型的系统通知",
        "icon": "mdi-bell-outline",
    },
)

NOTIFICATION_TYPE_MAP = {item["key"]: item for item in NOTIFICATION_TYPES}
VALID_ROUTE_POLICIES = {"notify", "record", "silent"}
_NOTIFICATION_TYPE_ALIASES = {
    "资源下载": "download",
    "download": "download",
    "整理入库": "organize",
    "organize": "organize",
    "订阅": "subscribe",
    "subscribe": "subscribe",
    "站点": "site",
    "站点消息": "site",
    "site": "site",
    "sitemessage": "site",
    "媒体服务器": "media_server",
    "mediaserver": "media_server",
    "手动处理": "manual",
    "manual": "manual",
    "插件": "plugin",
    "plugin": "plugin",
    "智能体": "agent",
    "agent": "agent",
    "其它": "other",
    "其他": "other",
    "other": "other",
}


def _text(value: Any) -> str:
    if value is None:
        return ""
    enum_value = getattr(value, "value", None)
    return str(enum_value if enum_value is not None else value).strip()


def classify_failure(
        reason: Any,
        *,
        event_kind: str = "",
        title: Any = "",
) -> Dict[str, str]:
    """根据结构化事件类型与错误文本给失败分类。"""
    event_text = _text(event_kind).casefold()
    if "subtitle" in event_text or "audio" in event_text:
        selected = FAILURE_CATEGORY_MAP["subtitle_audio"]
        return {
            "key": selected["key"],
            "label": selected["label"],
            "description": selected["description"],
        }
    haystack = " ".join((_text(title), _text(reason))).casefold()
    for item in FAILURE_CATEGORIES:
        if item["key"] == "unknown":
            continue
        if any(re.search(pattern, haystack, flags=re.IGNORECASE) for pattern in item["patterns"]):
            return {
                "key": item["key"],
                "label": item["label"],
                "description": item["description"],
            }
    selected = FAILURE_CATEGORY_MAP["unknown"]
    return {
        "key": selected["key"],
        "label": selected["label"],
        "description": selected["description"],
    }


def normalize_failure_policies(value: Any) -> Dict[str, str]:
    """补齐全部失败分类策略；未知错误不允许静默。"""
    source = value if isinstance(value, Mapping) else {}
    policies: Dict[str, str] = {}
    for item in FAILURE_CATEGORIES:
        policy = _text(source.get(item["key"]) or "notify").lower()
        if policy not in VALID_POLICIES:
            policy = "notify"
        if item["key"] == "unknown" and policy == "silent":
            policy = "notify"
        policies[item["key"]] = policy
    return policies


def notification_type_key(value: Any) -> str:
    """把 MP 不同版本的 NotificationType 枚举或文本统一成稳定键。"""
    normalized = re.sub(r"[\s_\-]+", "", _text(value)).casefold()
    return _NOTIFICATION_TYPE_ALIASES.get(normalized, "other")


def normalize_notification_routes(value: Any) -> Dict[str, Dict[str, str]]:
    """补齐九类通知的接管策略、目标实例和可选模板。"""
    source = value if isinstance(value, Mapping) else {}
    routes: Dict[str, Dict[str, str]] = {}
    for item in NOTIFICATION_TYPES:
        raw = source.get(item["key"])
        raw = raw if isinstance(raw, Mapping) else {}
        policy = _text(raw.get("policy") or "notify").lower()
        if policy not in VALID_ROUTE_POLICIES:
            policy = "notify"
        routes[item["key"]] = {
            "policy": policy,
            "service": _text(raw.get("service"))[:160],
            "title_template": _text(raw.get("title_template"))[:12000],
            "text_template": _text(raw.get("text_template"))[:12000],
        }
    return routes


def notification_kind(data: Any) -> str:
    """识别 NoticeMessage 是否为整理成功、整理失败或其它消息。"""
    source = _mapping(data)
    message = source.get("message")
    if isinstance(message, Mapping):
        merged = {**message, **source}
    else:
        merged = source
    mtype = _text(merged.get("mtype") or merged.get("type")).casefold()
    ctype = _text(merged.get("ctype")).casefold()
    title = _text(merged.get("title"))
    body = _text(merged.get("text"))
    if "organizesuccess" in ctype or "整理入库" in mtype:
        return "success"
    if (
            "手动处理" in mtype
            and re.search(r"(?:入库|整理).*(?:失败|错误)|(?:失败|错误).*(?:入库|整理)", f"{title} {body}")
    ):
        return "failure"
    return "other"


def extract_notice(data: Any) -> Dict[str, Any]:
    """把 MP 新旧版本的扁平/包装 NoticeMessage 转成统一字典。"""
    source = _mapping(data)
    message = source.get("message")
    merged = {**message, **source} if isinstance(message, Mapping) else dict(source)
    return {
        key: merged.get(key)
        for key in (
            "source", "mtype", "type", "ctype", "title", "text", "image", "link",
            "userid", "username", "buttons", "targets", "channel",
        )
        if key in merged
    }


def _mapping(value: Any) -> Dict[str, Any]:
    if isinstance(value, Mapping):
        return dict(value)
    model_dump = getattr(value, "model_dump", None)
    if callable(model_dump):
        try:
            dumped = model_dump()
            return dict(dumped) if isinstance(dumped, Mapping) else {}
        except Exception:
            return {}
    raw = getattr(value, "__dict__", None)
    return dict(raw) if isinstance(raw, Mapping) else {}


def extract_reason(text: Any) -> str:
    """从 MP 失败通知正文中提取原因；失败时保留原正文。"""
    body = _text(text)
    match = re.search(r"(?:^|\n)\s*原因[：:]\s*(.+?)(?=\n|$)", body, flags=re.IGNORECASE)
    return match.group(1).strip() if match else body


def build_record(
        *,
        scene: str,
        title: Any,
        text: Any = "",
        category: Optional[Mapping[str, Any]] = None,
        policy: str = "notify",
        action: str = "observed",
        source: str = "",
        details: Optional[Mapping[str, Any]] = None,
) -> Dict[str, Any]:
    """生成可持久化、可去重的轻量通知记录。"""
    created = datetime.now()
    detail_map = dict(details or {})
    identity = "|".join((
        _text(scene), _text(title), _text(text),
        _text(detail_map.get("source_path")), _text(detail_map.get("target_path")),
        created.strftime("%Y%m%d%H%M%S"),
    ))
    return {
        "id": hashlib.sha1(identity.encode("utf-8", errors="ignore")).hexdigest()[:20],
        "created_at": created.strftime("%Y-%m-%d %H:%M:%S"),
        "created_ts": created.timestamp(),
        "scene": _text(scene) or "other",
        "title": _text(title) or "未命名通知",
        "text": _text(text),
        "category": dict(category or {}),
        "policy": policy if policy in VALID_POLICIES else "notify",
        "action": _text(action) or "observed",
        "source": _text(source),
        "details": detail_map,
    }


def compact_records(records: Iterable[Mapping[str, Any]], limit: int = 200) -> List[Dict[str, Any]]:
    """按 ID 去重并保留最新记录。"""
    result: List[Dict[str, Any]] = []
    seen = set()
    for raw in records:
        if not isinstance(raw, Mapping):
            continue
        item = dict(raw)
        identity = _text(item.get("id"))
        if not identity:
            identity = hashlib.sha1(
                "|".join((
                    _text(item.get("scene")), _text(item.get("title")),
                    _text(item.get("text")), _text(item.get("created_at")),
                )).encode("utf-8", errors="ignore")
            ).hexdigest()[:20]
            item["id"] = identity
        if identity in seen:
            continue
        seen.add(identity)
        result.append(item)
        if len(result) >= max(10, min(int(limit or 200), 1000)):
            break
    return result


def summarize_digest(records: Iterable[Mapping[str, Any]]) -> Dict[str, Any]:
    """汇总暂存失败记录，供页面和后续定时摘要通知复用。"""
    counts: Dict[str, int] = {}
    total = 0
    for item in records:
        if item.get("policy") != "digest" or item.get("action") == "digest_sent":
            continue
        key = _text((item.get("category") or {}).get("key")) or "unknown"
        counts[key] = counts.get(key, 0) + 1
        total += 1
    return {"total": total, "categories": counts}
