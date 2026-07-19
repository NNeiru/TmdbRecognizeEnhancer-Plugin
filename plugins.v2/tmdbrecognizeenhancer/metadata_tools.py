"""制作组档案和重命名字段扩展。"""

from __future__ import annotations

import hashlib
import re
import threading
from copy import deepcopy
from typing import Any, Dict, Iterable, List, Optional, Tuple

from .media_probe import MediaFileProbe

RELEASE_GROUP_KINDS = {"animation", "live_action", "unknown"}
RELEASE_GROUP_FIELD_KEYS = {
    "resourceType", "effect", "videoFormat", "videoCodec", "videoBit",
    "audioCodec", "fps", "webSource", "customization",
}


class ReleaseGroupRegistry:
    """读取 MP 制作组规则，并将用户分类编译为运行时快照。"""

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._profiles: Dict[str, Dict[str, Any]] = {}
        self._catalog: List[Dict[str, Any]] = []
        self._compiled: List[Tuple[Dict[str, Any], Any]] = []
        self._message = "尚未加载"

    @staticmethod
    def _rule_id(source: str, category: str, pattern: str) -> str:
        digest = hashlib.sha1(
            f"{source}\0{category}\0{pattern}".encode("utf-8")
        ).hexdigest()[:16]
        return f"{source}:{digest}"

    @staticmethod
    def normalize_profiles(value: Any) -> Dict[str, Dict[str, Any]]:
        """规范化持久化档案，并保留允许注入命名上下文的补充字段。"""
        if not isinstance(value, dict):
            return {}
        normalized: Dict[str, Dict[str, Any]] = {}
        for rule_id, raw in value.items():
            if not isinstance(raw, dict):
                continue
            kind = str(raw.get("kind") or "unknown").strip().lower()
            if kind not in RELEASE_GROUP_KINDS:
                kind = "unknown"
            field_values = raw.get("field_values") or {}
            if not isinstance(field_values, dict):
                field_values = {}
            custom_field_values = raw.get("custom_field_values") or {}
            if not isinstance(custom_field_values, dict):
                custom_field_values = {}
            policy = str(raw.get("field_policy") or "fill_empty").lower()
            normalized[str(rule_id)] = {
                "kind": kind,
                "display_name": str(raw.get("display_name") or "").strip()[:80],
                "field_policy": policy if policy in {"fill_empty", "overwrite", "append"} else "fill_empty",
                "field_values": {
                    str(key): str(field_values.get(key) or "").strip()[:120]
                    for key in RELEASE_GROUP_FIELD_KEYS
                    if str(field_values.get(key) or "").strip()
                },
                "custom_field_values": {
                    str(key): str(value or "").strip()[:500]
                    for key, value in custom_field_values.items()
                    if re.fullmatch(r"[A-Za-z][A-Za-z0-9_]{0,63}", str(key))
                    and str(value or "").strip()
                },
            }
        return normalized

    def refresh(self, profiles: Any) -> None:
        """重新读取 MP 内置和自定义规则并生成线程安全快照。"""
        normalized_profiles = self.normalize_profiles(profiles)
        catalog: List[Dict[str, Any]] = []
        message = "已读取 MoviePilot 制作组规则"
        try:
            from app.core.meta.releasegroup import ReleaseGroupsMatcher

            groups = getattr(ReleaseGroupsMatcher, "RELEASE_GROUPS", {}) or {}
            if isinstance(groups, dict):
                for category, patterns in groups.items():
                    for pattern in patterns or []:
                        if not pattern:
                            continue
                        rule_id = self._rule_id("builtin", str(category), str(pattern))
                        override = normalized_profiles.get(rule_id) or {}
                        default_kind = "animation" if str(category).lower() == "anime" else "unknown"
                        catalog.append({
                            "id": rule_id,
                            "source": "builtin",
                            "source_label": "MP 内置",
                            "category": str(category),
                            "pattern": str(pattern),
                            "display_name": override.get("display_name") or str(pattern),
                            "kind": override.get("kind") or default_kind,
                            "default_kind": default_kind,
                            "overridden": rule_id in normalized_profiles,
                            "field_policy": override.get("field_policy") or "fill_empty",
                            "field_values": deepcopy(override.get("field_values") or {}),
                            "custom_field_values": deepcopy(override.get("custom_field_values") or {}),
                        })
        except Exception as err:
            message = f"无法读取 MP 内置制作组规则：{err}"

        try:
            from app.db.systemconfig_oper import SystemConfigOper
            from app.schemas.types import SystemConfigKey

            custom_patterns = SystemConfigOper().get(SystemConfigKey.CustomReleaseGroups) or []
            if isinstance(custom_patterns, str):
                custom_patterns = [line.strip() for line in custom_patterns.splitlines() if line.strip()]
            for pattern in custom_patterns if isinstance(custom_patterns, list) else []:
                rule_id = self._rule_id("mp_custom", "custom", str(pattern))
                override = normalized_profiles.get(rule_id) or {}
                catalog.append({
                    "id": rule_id,
                    "source": "mp_custom",
                    "source_label": "MP 自定义",
                    "category": "custom",
                    "pattern": str(pattern),
                    "display_name": override.get("display_name") or str(pattern),
                    "kind": override.get("kind") or "unknown",
                    "default_kind": "unknown",
                    "overridden": rule_id in normalized_profiles,
                    "field_policy": override.get("field_policy") or "fill_empty",
                    "field_values": deepcopy(override.get("field_values") or {}),
                    "custom_field_values": deepcopy(override.get("custom_field_values") or {}),
                })
        except Exception as err:
            if not catalog:
                message = f"无法读取 MP 制作组配置：{err}"

        compiled: List[Tuple[Dict[str, Any], Any]] = []
        for item in catalog:
            if item["kind"] == "unknown" and not item.get("field_values") and not item.get("custom_field_values"):
                continue
            try:
                compiled.append((item, re.compile(item["pattern"], re.IGNORECASE)))
            except re.error:
                item["invalid"] = True

        with self._lock:
            self._profiles = normalized_profiles
            self._catalog = catalog
            self._compiled = compiled
            self._message = message

    def catalog(self) -> Dict[str, Any]:
        """返回供界面展示的制作组目录快照。"""
        with self._lock:
            items = deepcopy(self._catalog)
            message = self._message
        return {
            "items": items,
            "message": message,
            "count": len(items),
            "classified_count": sum(item.get("kind") != "unknown" for item in items),
        }

    def classify(self, release_group: Any) -> Dict[str, Any]:
        """根据 MP 已识别的制作组名称返回动漫、真人或冲突结论。"""
        names = [part.strip() for part in re.split(r"\s*[@&+]\s*", str(release_group or "")) if part.strip()]
        if not names:
            return {"kind": "unknown", "release_group": "", "matches": []}
        with self._lock:
            compiled = list(self._compiled)
        matches: List[Dict[str, Any]] = []
        for name in names:
            for item, pattern in compiled:
                try:
                    if pattern.search(name):
                        matches.append({
                            "id": item["id"],
                            "name": name,
                            "label": item.get("display_name") or item["pattern"],
                            "kind": item["kind"],
                            "field_policy": item.get("field_policy") or "fill_empty",
                            "field_values": deepcopy(item.get("field_values") or {}),
                            "custom_field_values": deepcopy(item.get("custom_field_values") or {}),
                        })
                except Exception:
                    continue
        kinds = {item["kind"] for item in matches if item["kind"] in RELEASE_GROUP_KINDS - {"unknown"}}
        kind = next(iter(kinds)) if len(kinds) == 1 else "unknown"
        return {
            "kind": kind,
            "release_group": "@".join(names),
            "matches": matches,
            "conflict": len(kinds) > 1,
        }

    def supplements(self, release_group: Any) -> Dict[str, Any]:
        """汇总命中制作组的字段补充；冲突字段不自动写入。"""
        result = self.classify(release_group)
        candidates: Dict[str, List[Dict[str, Any]]] = {}
        for match in result.get("matches") or []:
            combined_values = {
                **(match.get("field_values") or {}),
                **(match.get("custom_field_values") or {}),
            }
            for field, value in combined_values.items():
                candidates.setdefault(field, []).append({
                    "value": value,
                    "policy": match.get("field_policy") or "fill_empty",
                    "rule_id": match.get("id"),
                    "label": match.get("label"),
                })
        fields: Dict[str, Dict[str, Any]] = {}
        conflicts: List[Dict[str, Any]] = []
        for field, values in candidates.items():
            distinct = {str(item.get("value") or "") for item in values}
            if len(distinct) != 1:
                conflicts.append({"field": field, "values": sorted(distinct), "matches": values})
                continue
            policies = {str(item.get("policy") or "fill_empty") for item in values}
            effective_policy = (
                "overwrite" if "overwrite" in policies
                else "append" if "append" in policies
                else "fill_empty"
            )
            fields[field] = {
                "value": values[0]["value"],
                "policy": effective_policy,
                "matches": values,
            }
        return {
            "release_group": result.get("release_group") or "",
            "fields": fields,
            "conflicts": conflicts,
            "matches": result.get("matches") or [],
        }


class RenameFieldRegistry:
    """提供内置字段目录，并安全计算用户自定义重命名字段。"""

    _key_pattern = re.compile(r"^[A-Za-z][A-Za-z0-9_]{0,63}$")
    _environment = None
    # 这里只列出 TransHandler.get_naming_dict() 在命名渲染前真实传入的字段。
    # TemplateContextBuilder 还支持 torrentinfo / transferinfo，但文件命名调用并未传入
    # 这两个对象；相应字段只服务于通知模板，不能冒充为可用的命名字段。
    BUILTIN_FIELDS: Tuple[Tuple[str, str, str, str, str], ...] = (
        ("title", "媒体标题", "媒体信息", "TMDB/豆瓣识别后的主标题。", "识别成功后可用"),
        ("en_title", "英文标题", "媒体信息", "TMDB 返回的英文标题；识别源没有英文资料时为空。", "可能为空"),
        ("original_title", "原语种标题", "媒体信息", "TMDB/豆瓣返回的原语种标题，不是源文件名。", "可能为空"),
        ("name", "文件识别名称", "文件解析", "MoviePilot 从文件名中解析出的名称，存在中英文时通常优先中文。", "解析成功后可用"),
        ("en_name", "文件识别英文名", "文件解析", "MoviePilot 从文件名中解析出的英文名称。", "可能为空"),
        ("original_name", "MP 原始标题", "文件解析", "MetaBase 保存的原始标题；它不是完整路径，真实文件名请使用 source_name。", "解析阶段可用"),
        ("year", "年份", "媒体信息", "媒体年份；优先采用识别结果，识别结果缺失时可能沿用文件解析年份。", "可能为空"),
        ("title_year", "标题与年份", "媒体信息", "MoviePilot 组合的“标题 (年份)”文本；无年份时通常只有标题。", "识别成功后可用"),
        ("type", "媒体类型", "媒体信息", "MoviePilot 媒体类型，通常为“电影”或“电视剧”。", "识别成功后可用"),
        ("category", "二级分类", "媒体信息", "MoviePilot 根据分类配置得到的媒体分类，例如动漫；未配置或未命中时为空。", "可能为空"),
        ("vote_average", "评分", "媒体信息", "识别源返回的媒体评分。", "可能为空"),
        ("poster", "海报", "媒体信息", "识别源返回的海报图片地址。", "可能为空"),
        ("backdrop", "背景图", "媒体信息", "识别源返回的背景图片地址。", "可能为空"),
        ("actors", "演员", "媒体信息", "识别结果中的前五位演员，以顿号连接。", "可能为空"),
        ("overview", "简介", "媒体信息", "识别源返回的媒体简介。", "可能为空"),
        ("tmdbid", "TMDB ID", "媒体信息", "TMDB 媒体编号；非 TMDB 识别源时为空。", "按识别源可用"),
        ("imdbid", "IMDB ID", "媒体信息", "IMDB 媒体编号；识别结果未提供时为空。", "可能为空"),
        ("doubanid", "豆瓣 ID", "媒体信息", "豆瓣媒体编号；非豆瓣识别源时为空。", "按识别源可用"),
        ("season", "季号", "季集信息", "数值季号，例如 1；仅电视剧且成功解析季信息时有意义。", "电视剧可用"),
        ("season_fmt", "格式化季号", "季集信息", "格式化季号，例如 S01。", "电视剧可用"),
        ("episode", "集号", "季集信息", "当前集号或多集列表。", "剧集文件可用"),
        ("total_episodes", "本季总集数", "季集信息", "本次识别取得的 TMDB 当前季集数；未拉取集详情时为 0。", "电视剧可用"),
        ("season_episode", "季集组合", "季集信息", "MoviePilot 组合的 SxxExx 季集文本。", "剧集文件可用"),
        ("episode_title", "单集标题", "季集信息", "TMDB 对应集的标题；需要取得剧集详情且集号命中。", "可能为空"),
        ("episode_date", "单集日期", "季集信息", "TMDB 对应集的播出日期；需要取得剧集详情且集号命中。", "可能为空"),
        ("season_year", "季度年份", "季集信息", "识别结果中当前季的首播年份。", "可能为空"),
        ("part", "分段", "文件解析", "从文件名识别的 Part/Disc 分段编号。", "可能为空"),
        ("fileExt", "文件扩展名", "文件解析", "当前待整理文件扩展名，例如 .mkv；整目录资源时可能为空。", "文件整理可用"),
        ("customization", "MP 自定义占位符", "文件解析", "MoviePilot 识别词产生的自定义占位符结果。", "命中规则时可用"),
        ("resourceType", "资源类型", "技术参数", "从文件名解析的 WEB-DL、BluRay 等资源类型。", "可能为空"),
        ("effect", "特效", "技术参数", "从文件名解析的 HDR、杜比视界等效果。", "可能为空"),
        ("edition", "版本", "技术参数", "MoviePilot 组合的资源类型与特效信息。", "可能为空"),
        ("videoFormat", "分辨率", "技术参数", "从文件名解析的 1080p、2160p 等分辨率。", "可能为空"),
        ("resource_term", "质量组合", "技术参数", "MoviePilot 组合的资源类型、特效和分辨率。", "可能为空"),
        ("releaseGroup", "制作组/字幕组", "技术参数", "从文件名中识别到的发布组。", "可能为空"),
        ("videoCodec", "视频编码", "技术参数", "从文件名解析的 H264、H265 等视频编码。", "可能为空"),
        ("videoBit", "视频位深", "技术参数", "从文件名解析的 8bit、10bit 等视频位深。", "可能为空"),
        ("audioCodec", "音频编码", "技术参数", "从文件名解析的 AAC、FLAC 等音频编码。", "可能为空"),
        ("fps", "帧率", "技术参数", "从文件名解析的帧率；不会自动读取文件媒体流。", "可能为空"),
        ("webSource", "流媒体平台", "技术参数", "从文件名解析的 Netflix、Amazon 等平台。", "可能为空"),
    )
    CONTEXT_FIELDS: Tuple[Tuple[str, str, str, str, str], ...] = (
        ("source_path", "源文件完整路径", "源文件上下文", "待整理文件或目录的完整路径；MP 仅做命名预览而未提供源对象时为空。", "实际整理渲染前可用"),
        ("source_dir", "源文件所在目录", "源文件上下文", "源文件的父目录；待整理对象是目录时则为该目录的上级目录。", "实际整理渲染前可用"),
        ("source_name", "真实源文件名", "源文件上下文", "FileItem 中包含扩展名的真实文件名；需要完整文件名时应使用它而不是 original_name。", "实际整理渲染前可用"),
        ("source_stem", "源文件主名", "源文件上下文", "真实源文件名去掉最后一个扩展名后的部分。", "实际整理渲染前可用"),
        ("source_ext", "源文件扩展名", "源文件上下文", "真实源文件扩展名，例如 .mkv。", "实际整理渲染前可用"),
        ("source_storage", "源存储标识", "源文件上下文", "MoviePilot FileItem 的存储标识，不一定是用户看到的显示名称。", "实际整理渲染前可用"),
        ("source_item_type", "源项目类型", "源文件上下文", "待整理对象类型，通常为 file 或 dir。", "实际整理渲染前可用"),
        ("source_size", "源文件大小", "源文件上下文", "FileItem 提供的字节数；不可用、命名预览或目录资源时可能为 0。", "实际整理渲染前可用"),
        ("target_dir", "分类后目标根目录", "目标路径上下文（整理前）", "MP 已完成媒体库及二级分类选择后的目标根目录。它在文件操作前已确定，但插件只能在首次模板渲染后取得。", "第二阶段重渲染可用"),
        ("rendered_relative_path", "首次命名结果", "目标路径上下文（整理前）", "MP 使用原命名上下文首次渲染出的相对路径；此时尚未复制、移动或链接文件。", "第二阶段重渲染可用"),
        ("target_path_before_custom", "自定义处理前目标路径", "目标路径上下文（整理前）", "目标根目录与首次命名结果组合后的路径，用于根据原定目标做条件判断；并非整理完成后的实际结果。", "第二阶段重渲染可用"),
        *tuple(
            (key, label, "实际媒体流", description, "启用整理前媒体扫描且文件可读取时可用")
            for key, label, description in MediaFileProbe.CONTEXT_FIELDS
        ),
    )
    VALUE_GUIDES: Dict[str, Dict[str, str]] = {
        "title": {"type": "文本", "values": "识别源中的本地化标题，例如 相反的你和我。", "logic": "通常作为最终目录和文件名的主标题。"},
        "en_title": {"type": "文本", "values": "TMDB 英文标题；资料不存在时为空。", "logic": "可用 {{ en_title or title }} 回退到主标题。"},
        "original_title": {"type": "文本", "values": "作品原语种标题，例如 正反対な君と僕。", "logic": "不是下载文件名；源文件名应使用 source_name。"},
        "name": {"type": "文本", "values": "MP 从文件名解析出的名称。", "logic": "识别成功前产生，可能已被 MP 识别词修改。"},
        "en_name": {"type": "文本", "values": "MP 从文件名解析出的英文或罗马音名称；可能为空。", "logic": "可用 {{ en_name or name }}。"},
        "original_name": {"type": "文本", "values": "MP MetaBase 保存的原始标题文本。", "logic": "不保证包含完整路径或等同磁盘真实文件名。"},
        "year": {"type": "整数/文本", "values": "四位年份，例如 2026；未知时为空。", "logic": "条件示例：{% if year %} ({{ year }}){% endif %}"},
        "title_year": {"type": "文本", "values": "标题与年份组合，例如 相反的你和我 (2026)。", "logic": "由 MP 根据 title 和 year 组合，无年份时通常只有标题。"},
        "type": {"type": "枚举文本", "values": "电影、电视剧。", "logic": "条件示例：{{ 'TV' if type == '电视剧' else 'Movie' }}"},
        "category": {"type": "配置文本", "values": "用户在 MP 分类中配置的名称，例如 动漫、纪录片、综艺；也可能为空。", "logic": "不是固定枚举，取值由当前 MP 分类配置决定。"},
        "vote_average": {"type": "小数", "values": "识别源评分，例如 8.4；缺失时为空或 0。", "logic": "可使用 round 过滤器控制显示精度。"},
        "poster": {"type": "URL 文本", "values": "海报图片地址；资料缺失时为空。", "logic": "通常用于模板上下文，不建议直接组成文件名。"},
        "backdrop": {"type": "URL 文本", "values": "背景图片地址；资料缺失时为空。", "logic": "通常用于模板上下文，不建议直接组成文件名。"},
        "actors": {"type": "文本", "values": "最多五位演员，通常以顿号连接。", "logic": "它是已拼接文本，不是可直接循环的演员对象列表。"},
        "overview": {"type": "文本", "values": "识别源简介；可能包含较长文本或为空。", "logic": "不建议直接用于路径，除非先截断和清理。"},
        "tmdbid": {"type": "整数/文本", "values": "TMDB 数字 ID，例如 278043；非 TMDB 识别源时为空。", "logic": "条件示例：{% if tmdbid %}{tmdbid={{ tmdbid }}}{% endif %}"},
        "imdbid": {"type": "文本", "values": "IMDB ID，例如 tt1234567；可能为空。", "logic": "不是所有 TMDB 条目都会返回 IMDB ID。"},
        "doubanid": {"type": "整数/文本", "values": "豆瓣数字 ID；非豆瓣识别源时为空。", "logic": "使用前应先判断是否有值。"},
        "season": {"type": "整数", "values": "0、1、2…；S00 表示特别篇。", "logic": "格式化显示建议使用 season_fmt，不要自行假设固定两位。"},
        "season_fmt": {"type": "文本", "values": "S00、S01、S02…", "logic": "由 MP 按季号格式化。"},
        "episode": {"type": "整数或集号集合", "values": "单集可为 1；多集资源可能是列表或 MP 可格式化的集合。", "logic": "不要假设永远是整数；完整季集文本优先使用 season_episode。"},
        "total_episodes": {"type": "整数", "values": "0 或本季总集数，例如 12。", "logic": "0 也可能表示未拉取到季详情，不一定代表本季没有剧集。"},
        "season_episode": {"type": "文本", "values": "S01E01、S01E01-E02 等 MP 格式化结果。", "logic": "适合直接进入电视剧命名模板。"},
        "episode_title": {"type": "文本", "values": "识别源中的单集标题；未取得剧集详情时为空。", "logic": "建议用 {% if episode_title %}...{% endif %} 包裹。"},
        "episode_date": {"type": "日期/文本", "values": "单集播出日期，例如 2026-07-20；可能为空。", "logic": "具体运行类型取决于 MP 当前版本，安全做法是作为文本输出。"},
        "season_year": {"type": "整数/文本", "values": "当前季首播年份，例如 2026；可能为空。", "logic": "与作品 year 可能不同。"},
        "part": {"type": "整数/文本", "values": "1、2…，仅多碟、分段或 Part 资源可能存在。", "logic": "使用前判断是否有值。"},
        "fileExt": {"type": "文本", "values": ".mkv、.mp4、.ass 等，通常包含开头的点。", "logic": "不要再次手动添加点；整目录资源时可能为空。"},
        "customization": {"type": "文本", "values": "MP 识别词产生的用户自定义内容，例如 简繁内封。", "logic": "多个结果使用插件设置的自定义占位符连接符组合。"},
        "resourceType": {"type": "枚举/文本", "values": "WEB-DL、WEBRip、BluRay、Remux、HDTV、UHD BluRay 等；取决于 MP 规则。", "logic": "制作组补充和 ffprobe 扫描均可按配置补齐，但 ffprobe 通常不能判断来源。"},
        "effect": {"type": "枚举/组合文本", "values": "DOVI、HDR10+、HDR10、HLG 等；普通 SDR 通常为空。", "logic": "追加模式可能得到 HDR10 DOVI 这样的组合。"},
        "edition": {"type": "组合文本", "values": "resourceType 与 effect 的组合，例如 WEB-DL HDR10。", "logic": "字段补充改变 resourceType/effect 后插件会重新组合。"},
        "videoFormat": {"type": "枚举/文本", "values": "720P、1080P、1440P、2160P、4320P 等。", "logic": "文件名解析值与实际扫描值可按补空、覆盖或追加策略处理。"},
        "resource_term": {"type": "组合文本", "values": "资源类型、特效、分辨率组合，例如 WEB-DL HDR10 2160P。", "logic": "由 resourceType、effect、videoFormat 组合。"},
        "releaseGroup": {"type": "文本", "values": "字幕组/制作组名称或合作组组合，例如 Nekomoe kissaten&LoliHouse。", "logic": "可能经过插件制作组排序、连接符和名称映射。"},
        "videoCodec": {"type": "枚举/文本", "values": "H264、H265、AV1、VP9、MPEG2、AVS2、AVS3 等。", "logic": "可来自文件名解析或 ffprobe 主视频流。"},
        "videoBit": {"type": "枚举文本", "values": "8bit、10bit、12bit 等。", "logic": "可来自文件名解析或 ffprobe 像素格式/位深信息。"},
        "audioCodec": {"type": "枚举/文本", "values": "AAC、FLAC、AC3、DDP、TrueHD、DTS、LPCM、Opus 等。", "logic": "标准字段通常代表主音轨；全部音轨编码使用 probe_audio_codecs。"},
        "fps": {"type": "整数/小数", "values": "23.976、24、25、29.97、30、60 等。", "logic": "文件名未写帧率时通常为空；启用扫描可读取主视频流。"},
        "webSource": {"type": "枚举/文本", "values": "Netflix、Amazon、Disney+、Bilibili 等；取决于 MP 规则。", "logic": "ffprobe 无法判断流媒体来源，通常来自文件名或制作组固定补充。"},
        "source_path": {"type": "路径文本", "values": "/downloads/anime/Example.S01E01.mkv 等容器内真实路径。", "logic": "条件示例：{% if '/anime/' in source_path %}Anime{% endif %}"},
        "source_dir": {"type": "路径文本", "values": "源文件父目录，例如 /downloads/anime。", "logic": "可用 source_dir.split('/')[-1] 取得末级目录名。"},
        "source_name": {"type": "文本", "values": "磁盘真实文件名并包含扩展名。", "logic": "需要原始文件名时优先使用它，而不是 original_name。"},
        "source_stem": {"type": "文本", "values": "真实文件名去掉最后一个扩展名，例如 Example.S01E01。", "logic": "只去除最后一层扩展名。"},
        "source_ext": {"type": "文本", "values": ".mkv、.mp4、.ass 等。", "logic": "来自真实源对象，通常包含开头的点。"},
        "source_storage": {"type": "文本", "values": "local、rclone 等 MP 内部存储标识，具体值由存储配置决定。", "logic": "不是固定枚举，也不一定等于界面显示名称。"},
        "source_item_type": {"type": "枚举文本", "values": "file、dir。", "logic": "可用来区分单文件和整目录整理。"},
        "source_size": {"type": "整数", "values": "字节数，例如 1073741824；目录或预览时可能为 0。", "logic": "换算 GiB 示例：{{ (source_size / 1073741824) | round(2) }}"},
        "target_dir": {"type": "路径文本", "values": "MP 分类后选定的目标根目录，例如 /media/TV/动漫。", "logic": "第二阶段才可用，但仍发生在复制/移动/链接之前。"},
        "rendered_relative_path": {"type": "相对路径文本", "values": "MP 首次模板渲染结果，例如 动漫/标题/Season 1/file.mkv。", "logic": "可据此计算自定义字段后触发一次安全重渲染。"},
        "target_path_before_custom": {"type": "路径文本", "values": "目标根目录与首次相对路径组合出的完整目标路径。", "logic": "它是插件二次处理前路径，不是整理完成后的实际文件状态。"},
        "probe_video_codec": {"type": "枚举/文本", "values": "H264、H265、AV1、VP9、MPEG2、AVS2、AVS3、VC1 等。", "logic": "ffprobe 主视频流 codec_name 归一化结果。"},
        "probe_video_bit": {"type": "枚举文本", "values": "8bit、10bit、12bit 等；无法判断时为空。", "logic": "综合 bits_per_raw_sample、bits_per_sample 与像素格式推断。"},
        "probe_video_format": {"type": "枚举文本", "values": "480P、720P、1080P、1440P、2160P、4320P 等。", "logic": "根据主视频流实际宽高分档，不读取文件名。"},
        "probe_effect": {"type": "枚举文本", "values": "DOVI、HDR10+、HDR10、HLG、SDR；无法判断时为空。", "logic": "根据流侧数据、色彩传递和配置识别；SDR 只作为 probe 变量，不主动写入 MP effect。"},
        "probe_fps": {"type": "整数/小数", "values": "23.976、24、25、29.97、30、60 等。", "logic": "优先 avg_frame_rate，回退 r_frame_rate，保留最多三位小数。"},
        "probe_audio_codec": {"type": "枚举/文本", "values": "AAC、FLAC、AC3、DDP、TrueHD、DTS、LPCM、Opus 等。", "logic": "默认音轨优先，否则使用第一条音轨。"},
        "probe_audio_codecs": {"type": "组合文本", "values": "例如 AAC、FLAC；多种编码使用顿号连接并去重。", "logic": "涵盖容器内全部音轨，不只是默认音轨。"},
        "probe_audio_languages": {"type": "组合文本", "values": "简体、繁体、中文、日语、英语、韩语等；多种语言用顿号连接。", "logic": "仅依据音轨 language/title 标签；没有标签时为空，不根据文件名猜测。"},
        "probe_subtitle_languages": {"type": "组合文本", "values": "拆解后的单一语言，例如 简体、繁体、日语；多种语言用顿号连接。", "logic": "把每条字幕轨（含双语轨）拆成单语言取并集；只检查独立字幕流的 language/title，硬字幕或无字幕轨时为空。"},
        "probe_subtitle_titles": {"type": "组合文本", "values": "字幕轨原始标题，例如 简日双语、繁日雙語；轨道未设置标题时为空。", "logic": "ffprobe tags.title 原文去重后用顿号连接，用于核对语言识别依据。"},
        "probe_subtitle_track_labels": {"type": "组合文本", "values": "每条字幕轨归一后的简写标签，例如 简日、繁日；无法识别时回退到原标题。", "logic": "把每条轨的原始标题压缩成简写（简日双语 → 简日），去重后按语言顺序连接。"},
        "probe_subtitle_profile": {"type": "组合文本", "values": "简体内封、简繁内封、简繁日内封、多国内封等。", "logic": "按检测到的单一语言并集自动压缩；超过 3 种语言显示多国内封。不受自定义规则影响，始终有值。"},
        "probe_subtitle_mapped": {"type": "用户映射文本", "values": "由字幕组合映射规则决定，例如 简繁日内封、多国字幕；未命中规则时为空。", "logic": "规则按行序首条命中，是写入 customization 的值；精确与包含匹配同时按组合标签和单语言并集比较，>=N 按单语言数量。"},
        "probe_subtitle_count": {"type": "整数", "values": "0、1、2…，表示容器内独立字幕流数量。", "logic": "0 是有效结果；文件名中的 ASSx2 不参与计算，硬字幕也不计入。"},
        "probe_video_width": {"type": "整数", "values": "实际像素宽度，例如 1920、3840。", "logic": "来自主视频流 width。"},
        "probe_video_height": {"type": "整数", "values": "实际像素高度，例如 1080、2160。", "logic": "来自主视频流 height。"},
        "probe_duration": {"type": "小数", "values": "媒体总时长秒数，例如 1438.125；无法取得时为空。", "logic": "来自 ffprobe format.duration，保留三位小数。"},
    }
    TARGET_CONTEXT_KEYS = {"target_dir", "rendered_relative_path", "target_path_before_custom"}
    _builtin_keys = {item[0] for item in BUILTIN_FIELDS}
    _context_keys = {item[0] for item in CONTEXT_FIELDS}

    @classmethod
    def _get_environment(cls):
        """按需创建 Jinja 沙箱，避免只浏览目录时引入额外运行成本。"""
        if cls._environment is not None:
            return cls._environment
        try:
            from jinja2 import StrictUndefined
            from jinja2.sandbox import SandboxedEnvironment
        except ImportError as err:
            raise ValueError("当前环境缺少 Jinja2，不能使用自定义重命名字段") from err
        cls._environment = SandboxedEnvironment(undefined=StrictUndefined, autoescape=False)
        return cls._environment

    @classmethod
    def builtin_catalog(cls) -> List[Dict[str, str]]:
        """返回内置重命名字段说明。"""
        return [
            {
                "key": key,
                "label": label,
                "category": category,
                "description": description,
                "availability": availability,
                "phase": "mp_naming",
                "source": "moviepilot",
                "source_label": "MoviePilot 字段",
                "template_usage": "direct",
                "template_usage_label": "可直接用于 MP 命名模板",
                "template_usage_detail": "这是 MoviePilot 原生命名上下文字段，可直接写作 {{ %s }}；实际整理对象未提供时可能为空。" % key,
                **cls.VALUE_GUIDES.get(key, {"type": "文本", "values": "取值由 MoviePilot 当前上下文决定。", "logic": "使用前建议判断是否为空。"}),
            }
            for key, label, category, description, availability in cls.BUILTIN_FIELDS
        ]

    @classmethod
    def context_catalog(cls) -> List[Dict[str, str]]:
        """返回插件在重命名事件中补充的源文件与目标目录字段。"""
        return [
            {
                "key": key,
                "label": label,
                "category": category,
                "description": description,
                "availability": availability,
                "phase": "target_rerender" if key in cls.TARGET_CONTEXT_KEYS else "plugin_pre_render",
                "source": "ffprobe" if key.startswith("probe_") else "plugin_context",
                "source_label": "ffprobe 扫描字段" if key.startswith("probe_") else "插件上下文字段",
                "template_usage": "custom_dependency" if key in cls.TARGET_CONTEXT_KEYS else "direct",
                "template_usage_label": "作为自定义字段依赖使用" if key in cls.TARGET_CONTEXT_KEYS else "可直接用于 MP 命名模板",
                "template_usage_detail": (
                    "该值在 MoviePilot 首次渲染目标路径后才产生，不能可靠地直接写进首次命名模板；请先用它计算插件自定义字段，再在模板中引用该自定义字段。"
                    if key in cls.TARGET_CONTEXT_KEYS else
                    ("由整理前 ffprobe 扫描注入，可直接写作 {{ %s }}；需要启用媒体信息识别且容器能读取真实文件。" % key
                     if key.startswith("probe_") else
                     "由插件在 MoviePilot 首次命名渲染前注入，可直接写作 {{ %s }}；缺少对应整理上下文时可能为空。" % key)
                ),
                **cls.VALUE_GUIDES.get(key, {"type": "文本", "values": "取值由当前整理上下文决定。", "logic": "使用前建议判断是否为空。"}),
            }
            for key, label, category, description, availability in cls.CONTEXT_FIELDS
        ]

    @classmethod
    def normalize_fields(cls, value: Any) -> List[Dict[str, Any]]:
        """校验自定义字段，解析依赖并按可计算顺序排序。"""
        if not isinstance(value, list):
            return []
        if not value:
            return []
        environment = cls._get_environment()
        from jinja2 import meta
        fields: Dict[str, Dict[str, Any]] = {}
        for raw in value[:80]:
            if not isinstance(raw, dict):
                continue
            key = str(raw.get("key") or "").strip()
            if not cls._key_pattern.fullmatch(key):
                raise ValueError(f"字段名 {key or '<空>'} 不合法")
            if key in cls._builtin_keys or key in cls._context_keys or key.startswith("__"):
                raise ValueError(f"字段 {key} 是 MP 保留字段，第一版不允许覆盖")
            expression = str(raw.get("expression") or "").strip()
            if not expression:
                raise ValueError(f"字段 {key} 没有表达式")
            if len(expression) > 1000:
                raise ValueError(f"字段 {key} 表达式过长")
            try:
                parsed = environment.parse(expression)
                dependencies = sorted(meta.find_undeclared_variables(parsed))
                environment.from_string(expression)
            except Exception as err:
                raise ValueError(f"字段 {key} 表达式无效：{err}") from err
            fields[key] = {
                "key": key,
                "label": str(raw.get("label") or key).strip()[:80],
                "expression": expression,
                "fallback": str(raw.get("fallback") or "")[:500],
                "enabled": bool(raw.get("enabled", True)),
                "dependencies": dependencies,
            }

        custom_keys = set(fields)
        allowed_dependencies = cls._builtin_keys | cls._context_keys | custom_keys | set(environment.globals)
        for field in fields.values():
            unknown = sorted(set(field["dependencies"]) - allowed_dependencies)
            if unknown:
                raise ValueError(
                    f"字段 {field['key']} 引用了不存在的变量：{'、'.join(unknown)}"
                )
        ordered: List[Dict[str, Any]] = []
        visiting: set = set()
        visited: set = set()

        def visit(key: str) -> None:
            if key in visited:
                return
            if key in visiting:
                raise ValueError(f"自定义字段存在循环依赖：{key}")
            visiting.add(key)
            for dependency in fields[key]["dependencies"]:
                if dependency in custom_keys:
                    visit(dependency)
            visiting.remove(key)
            visited.add(key)
            ordered.append(fields[key])

        for field_key in fields:
            visit(field_key)
        return ordered

    @classmethod
    def split_by_target_dependency(
            cls, fields: Iterable[Dict[str, Any]]
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """把可预渲染字段与依赖目标目录的字段分开，并传播自定义字段依赖。"""
        independent: List[Dict[str, Any]] = []
        target_dependent: List[Dict[str, Any]] = []
        target_keys = set(cls.TARGET_CONTEXT_KEYS)
        for field in fields:
            dependencies = set(field.get("dependencies") or [])
            if dependencies & target_keys:
                target_dependent.append(field)
                target_keys.add(field["key"])
            else:
                independent.append(field)
        return independent, target_dependent

    @classmethod
    def evaluate(
            cls, fields: Iterable[Dict[str, Any]], context: Dict[str, Any]
    ) -> Tuple[Dict[str, str], List[Dict[str, str]]]:
        """使用沙箱模板计算字段；单字段失败时回退，不中断整理。"""
        safe_context = {
            key: value for key, value in (context or {}).items()
            if not str(key).startswith("__") and isinstance(
                value, (str, int, float, bool, list, tuple, dict, type(None))
            )
        }
        output: Dict[str, str] = {}
        errors: List[Dict[str, str]] = []
        fields = list(fields)
        if not fields:
            return output, errors
        environment = cls._get_environment()
        for field in fields:
            if not field.get("enabled", True):
                continue
            key = field["key"]
            try:
                value = environment.from_string(field["expression"]).render({**safe_context, **output})
            except Exception as err:
                value = str(field.get("fallback") or "")
                errors.append({"key": key, "message": str(err)})
            output[key] = value
        return output, errors

    @staticmethod
    def render_template(template_string: str, context: Dict[str, Any]) -> str:
        """使用 MP 同款 Jinja2 Template 对补齐字段后的命名模板重新渲染。"""
        from jinja2 import Template
        return Template(template_string).render(context)
