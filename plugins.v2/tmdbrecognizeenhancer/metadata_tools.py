"""制作组档案和重命名字段扩展。"""

from __future__ import annotations

import hashlib
import re
import threading
from copy import deepcopy
from typing import Any, Dict, Iterable, List, Optional, Tuple

RELEASE_GROUP_KINDS = {"animation", "live_action", "unknown"}


class ReleaseGroupRegistry:
    """读取 MP 制作组规则，并将用户分类编译为运行时快照。"""

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._profiles: Dict[str, Dict[str, str]] = {}
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
    def normalize_profiles(value: Any) -> Dict[str, Dict[str, str]]:
        """规范化持久化档案，只保留支持的分类。"""
        if not isinstance(value, dict):
            return {}
        normalized: Dict[str, Dict[str, str]] = {}
        for rule_id, raw in value.items():
            if not isinstance(raw, dict):
                continue
            kind = str(raw.get("kind") or "unknown").strip().lower()
            if kind not in RELEASE_GROUP_KINDS:
                kind = "unknown"
            normalized[str(rule_id)] = {
                "kind": kind,
                "display_name": str(raw.get("display_name") or "").strip()[:80],
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
                })
        except Exception as err:
            if not catalog:
                message = f"无法读取 MP 制作组配置：{err}"

        compiled: List[Tuple[Dict[str, Any], Any]] = []
        for item in catalog:
            if item["kind"] == "unknown":
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
        names = [part.strip() for part in str(release_group or "").split("@") if part.strip()]
        if not names:
            return {"kind": "unknown", "release_group": "", "matches": []}
        with self._lock:
            compiled = list(self._compiled)
        matches: List[Dict[str, str]] = []
        for name in names:
            for item, pattern in compiled:
                try:
                    if pattern.search(name):
                        matches.append({
                            "id": item["id"],
                            "name": name,
                            "label": item.get("display_name") or item["pattern"],
                            "kind": item["kind"],
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


class RenameFieldRegistry:
    """提供内置字段目录，并安全计算用户自定义重命名字段。"""

    _key_pattern = re.compile(r"^[A-Za-z][A-Za-z0-9_]{0,63}$")
    _environment = None
    BUILTIN_FIELDS: Tuple[Tuple[str, str, str, str], ...] = (
        ("title", "媒体标题", "媒体信息", "TMDB/豆瓣标题"),
        ("en_title", "英文标题", "媒体信息", "TMDB 英文标题"),
        ("original_title", "原语种标题", "媒体信息", "TMDB/豆瓣原语种标题"),
        ("name", "识别名称", "文件解析", "文件名中识别的名称"),
        ("en_name", "识别英文名", "文件解析", "文件名中识别的英文名称"),
        ("original_name", "原文件名", "文件解析", "识别前的原始文件名"),
        ("year", "年份", "媒体信息", "媒体年份"),
        ("title_year", "标题与年份", "媒体信息", "标题和年份组合"),
        ("type", "媒体类型", "媒体信息", "电影或电视剧"),
        ("category", "媒体分类", "媒体信息", "MoviePilot 媒体分类"),
        ("vote_average", "评分", "媒体信息", "媒体评分"),
        ("poster", "海报", "媒体信息", "海报图片地址"),
        ("backdrop", "背景图", "媒体信息", "背景图片地址"),
        ("actors", "演员", "媒体信息", "最多五位演员"),
        ("overview", "简介", "媒体信息", "媒体简介"),
        ("tmdbid", "TMDB ID", "媒体信息", "TMDB 媒体编号"),
        ("imdbid", "IMDB ID", "媒体信息", "IMDB 媒体编号"),
        ("doubanid", "豆瓣 ID", "媒体信息", "豆瓣媒体编号"),
        ("season", "季号", "季集信息", "数字季号"),
        ("season_fmt", "格式化季号", "季集信息", "Sxx 格式季号"),
        ("episode", "集号", "季集信息", "当前集号或集号列表"),
        ("total_episodes", "本季总集数", "季集信息", "TMDB 当前季总集数"),
        ("season_episode", "季集组合", "季集信息", "SxxExx 格式季集"),
        ("episode_title", "单集标题", "季集信息", "TMDB 单集标题"),
        ("episode_date", "单集日期", "季集信息", "TMDB 单集播出日期"),
        ("season_year", "季度年份", "季集信息", "当前季首播年份"),
        ("part", "分段", "文件解析", "Part/段编号"),
        ("fileExt", "文件扩展名", "文件解析", "例如 .mkv"),
        ("customization", "自定义占位符", "文件解析", "MP 自定义占位符结果"),
        ("resourceType", "资源类型", "技术参数", "WEB-DL、BluRay 等"),
        ("effect", "特效", "技术参数", "HDR、杜比视界等"),
        ("edition", "版本", "技术参数", "资源类型与特效组合"),
        ("videoFormat", "分辨率", "技术参数", "1080p、2160p 等"),
        ("resource_term", "质量", "技术参数", "资源类型、特效和分辨率组合"),
        ("releaseGroup", "制作组/字幕组", "技术参数", "识别到的发布组"),
        ("videoCodec", "视频编码", "技术参数", "H264、H265 等"),
        ("videoBit", "视频位深", "技术参数", "8bit、10bit 等"),
        ("audioCodec", "音频编码", "技术参数", "AAC、FLAC 等"),
        ("fps", "帧率", "技术参数", "视频帧率"),
        ("webSource", "流媒体平台", "技术参数", "Netflix、Amazon 等"),
        ("torrent_title", "种子标题", "种子信息", "下载种子标题"),
        ("pubdate", "发布时间", "种子信息", "种子发布时间"),
        ("freedate", "免费剩余时间", "种子信息", "免费促销剩余时间"),
        ("seeders", "做种数", "种子信息", "种子做种人数"),
        ("volume_factor", "促销信息", "种子信息", "种子促销系数"),
        ("hit_and_run", "Hit&Run", "种子信息", "是否为 Hit&Run"),
        ("labels", "种子标签", "种子信息", "种子标签列表"),
        ("description", "种子描述", "种子信息", "已清理 HTML 的种子描述"),
        ("site_name", "站点名称", "种子信息", "来源站点"),
        ("size", "资源大小", "种子信息", "格式化资源大小"),
        ("transfer_type", "整理方式", "整理结果", "复制、硬链接等"),
        ("file_count", "文件数", "整理结果", "整理文件数量"),
        ("total_size", "整理总大小", "整理结果", "整理文件总大小"),
        ("err_msg", "错误信息", "整理结果", "整理失败信息"),
    )
    _builtin_keys = {item[0] for item in BUILTIN_FIELDS}

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
            {"key": key, "label": label, "category": category, "description": description}
            for key, label, category, description in cls.BUILTIN_FIELDS
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
            if key in cls._builtin_keys or key.startswith("__"):
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
