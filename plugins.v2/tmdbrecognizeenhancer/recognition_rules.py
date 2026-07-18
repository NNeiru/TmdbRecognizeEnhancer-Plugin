"""MoviePilot 内置识别规则目录与插件覆盖层。"""

from __future__ import annotations

import hashlib
import os
import re
import threading
from copy import deepcopy
from typing import Any, Dict, Iterable, List, Optional, Tuple


FIELD_SPECS: Dict[str, Dict[str, Any]] = {
    "releaseGroup": {"label": "制作组 / 字幕组", "attr": "resource_team", "cast": "text"},
    "resourceType": {"label": "资源类型", "attr": "resource_type", "cast": "text"},
    "effect": {"label": "画面特效", "attr": "resource_effect", "cast": "text"},
    "videoFormat": {"label": "分辨率", "attr": "resource_pix", "cast": "text"},
    "videoCodec": {"label": "视频编码", "attr": "video_encode", "cast": "text"},
    "videoBit": {"label": "视频位深", "attr": "video_bit", "cast": "text"},
    "audioCodec": {"label": "音频编码", "attr": "audio_encode", "cast": "text"},
    "fps": {"label": "帧率", "attr": "fps", "cast": "int"},
    "webSource": {"label": "流媒体平台", "attr": "web_source", "cast": "text"},
    "customization": {"label": "自定义占位符", "attr": "customization", "cast": "text"},
    "season": {"label": "季号", "attr": "begin_season", "cast": "int"},
    "episode": {"label": "集号", "attr": "begin_episode", "cast": "int"},
    "part": {"label": "段 / 碟号", "attr": "part", "cast": "text"},
}


class RecognitionRuleRegistry:
    """读取 MP 规则，并把用户修改编译为低成本运行时覆盖。"""

    _MAX_OVERRIDES = 300
    _ACTIONS = {"override", "clear"}

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._catalog: List[Dict[str, Any]] = []
        self._overrides: List[Dict[str, Any]] = []
        self._compiled: List[Tuple[Dict[str, Any], Any]] = []
        self._errors: List[str] = []
        self._apply_count = 0
        self._match_count = 0

    @staticmethod
    def _rule_id(field: str, source: str, pattern: str, value: str = "") -> str:
        digest = hashlib.sha1(
            f"{field}\0{source}\0{pattern}\0{value}".encode("utf-8")
        ).hexdigest()[:18]
        return f"{field}:{digest}"

    @classmethod
    def normalize_overrides(cls, value: Any) -> List[Dict[str, Any]]:
        if not isinstance(value, list):
            return []
        output: List[Dict[str, Any]] = []
        seen = set()
        for raw in value[:cls._MAX_OVERRIDES]:
            if not isinstance(raw, dict):
                continue
            field = str(raw.get("field") or "").strip()
            pattern = str(raw.get("pattern") or "").strip()
            if field not in FIELD_SPECS or not pattern or len(pattern) > 4000:
                continue
            source_rule_id = str(raw.get("source_rule_id") or "").strip()
            rule_id = str(raw.get("id") or "").strip() or cls._rule_id(
                field, "user", pattern, str(raw.get("value") or "")
            )
            if rule_id in seen:
                continue
            seen.add(rule_id)
            action = str(raw.get("action") or "override").strip().lower()
            output.append({
                "id": rule_id,
                "source_rule_id": source_rule_id,
                "field": field,
                "pattern": pattern,
                "value": str(raw.get("value") or "{match}")[:500],
                "action": action if action in cls._ACTIONS else "override",
                "enabled": bool(raw.get("enabled", True)),
                "priority": max(-1000, min(1000, cls._safe_int(raw.get("priority"), 100))),
                "label": str(raw.get("label") or "用户覆盖")[:100],
            })
        return sorted(output, key=lambda item: (-item["priority"], item["id"]))

    @staticmethod
    def _safe_int(value: Any, default: int = 0) -> int:
        try:
            return int(value)
        except (TypeError, ValueError):
            return default

    @classmethod
    def _builtin_item(
            cls, field: str, pattern: str, value: str, label: str,
            source: str, source_label: str, editable: bool = True,
    ) -> Dict[str, Any]:
        return {
            "id": cls._rule_id(field, source, pattern, value),
            "field": field,
            "field_label": FIELD_SPECS[field]["label"],
            "pattern": pattern,
            "value": value,
            "label": label,
            "source": source,
            "source_label": source_label,
            "editable": editable,
            "builtin": True,
        }

    def refresh(self, overrides: Any) -> None:
        catalog, errors = self._discover_builtin_rules()
        normalized = self.normalize_overrides(overrides)
        by_source = {item["source_rule_id"]: item for item in normalized if item["source_rule_id"]}
        for item in catalog:
            override = by_source.get(item["id"])
            item["overridden"] = bool(override)
            item["effective"] = deepcopy(override) if override else None
        for override in normalized:
            if override["source_rule_id"]:
                continue
            catalog.append({
                **deepcopy(override),
                "field_label": FIELD_SPECS[override["field"]]["label"],
                "source": "plugin_user",
                "source_label": "插件自定义覆盖",
                "builtin": False,
                "editable": True,
                "overridden": True,
                "effective": deepcopy(override),
            })

        compiled: List[Tuple[Dict[str, Any], Any]] = []
        for item in normalized:
            if not item["enabled"]:
                continue
            try:
                compiled.append((item, re.compile(item["pattern"], re.IGNORECASE)))
            except re.error as err:
                errors.append(f"覆盖规则 {item['label']} 正则无效：{err}")

        with self._lock:
            self._catalog = catalog
            self._overrides = normalized
            self._compiled = compiled
            self._errors = errors

    def _discover_builtin_rules(self) -> Tuple[List[Dict[str, Any]], List[str]]:
        items: List[Dict[str, Any]] = []
        errors: List[str] = []
        try:
            from app.core.meta.releasegroup import ReleaseGroupsMatcher
            groups = getattr(ReleaseGroupsMatcher, "RELEASE_GROUPS", {}) or {}
            for category, patterns in groups.items() if isinstance(groups, dict) else []:
                for pattern in patterns or []:
                    if pattern:
                        items.append(self._builtin_item(
                            "releaseGroup", str(pattern), "{match}", str(category),
                            "mp_python", "MP 内置 · releasegroup.py",
                        ))
        except Exception as err:
            errors.append(f"releaseGroup：{err}")

        try:
            from app.db.systemconfig_oper import SystemConfigOper
            from app.schemas.types import SystemConfigKey
            custom = SystemConfigOper().get(SystemConfigKey.CustomReleaseGroups) or []
            if isinstance(custom, str):
                custom = [line.strip() for line in custom.splitlines() if line.strip()]
            for pattern in custom if isinstance(custom, list) else []:
                items.append(self._builtin_item(
                    "releaseGroup", str(pattern), "{match}", "MP 用户识别词",
                    "mp_config", "MP 词表设置",
                ))
        except Exception as err:
            errors.append(f"MP 自定义制作组：{err}")

        try:
            from app.core.meta.customization import CustomizationMatcher
            from app.db.systemconfig_oper import SystemConfigOper
            from app.schemas.types import SystemConfigKey
            customizations = CustomizationMatcher.normalize_customization(
                SystemConfigOper().get(SystemConfigKey.Customization)
            )
            for pattern in customizations:
                items.append(self._builtin_item(
                    "customization", str(pattern), "{match}", "MP 自定义占位符",
                    "mp_config", "MP 词表设置",
                ))
        except Exception as err:
            errors.append(f"customization：{err}")

        try:
            from app.core.meta.streamingplatform import StreamingPlatforms
            for short_name, full_name in getattr(StreamingPlatforms, "STREAMING_PLATFORMS", []) or []:
                canonical = str(full_name or short_name or "").strip()
                for alias in {str(short_name or "").strip(), str(full_name or "").strip()} - {""}:
                    items.append(self._builtin_item(
                        "webSource", rf"^{re.escape(alias)}$", canonical,
                        canonical, "mp_python", "MP 内置 · streamingplatform.py",
                    ))
        except Exception as err:
            errors.append(f"webSource：{err}")

        regex_specs = (
            ("resourceType", "_source_re", "{match}", "资源类型"),
            ("effect", "_effect_re", "{match}", "画面特效"),
            ("videoFormat", "_resources_pix_re", "{match}", "分辨率"),
            ("videoFormat", "_resources_pix_re2", "{match}", "K 分辨率"),
            ("videoCodec", "_video_encode_re", "{match}", "视频编码"),
            ("audioCodec", "_audio_encode_re", "{match}", "音频编码"),
            ("fps", "_fps_re", "{1}", "帧率"),
            ("season", "_season_re", "{first_group}", "季号"),
            ("episode", "_episode_re", "{first_group}", "集号"),
            ("part", "_part_re", "{match}", "段 / 碟号"),
        )
        try:
            from app.core.meta.metavideo import MetaVideo
            for field, attr, value, label in regex_specs:
                pattern = str(getattr(MetaVideo, attr, "") or "")
                if pattern:
                    items.append(self._builtin_item(
                        field, pattern, value, label,
                        "mp_python_rust", "MP Python / Rust 内置正则",
                    ))
        except Exception as err:
            errors.append(f"视频元信息正则：{err}")

        try:
            from app.core.meta.metabase import VIDEO_BIT_RE
            pattern = str(getattr(VIDEO_BIT_RE, "pattern", VIDEO_BIT_RE) or "")
            if pattern:
                items.append(self._builtin_item(
                    "videoBit", pattern, "{bit}bit", "视频位深",
                    "mp_python_rust", "MP Python / Rust 内置正则",
                ))
        except Exception as err:
            errors.append(f"videoBit：{err}")

        return items, errors

    def catalog(self) -> Dict[str, Any]:
        with self._lock:
            items = deepcopy(self._catalog)
            overrides = deepcopy(self._overrides)
            errors = list(self._errors)
        return {
            "items": items,
            "overrides": overrides,
            "errors": errors,
            "fields": [
                {"key": key, "label": spec["label"], "count": sum(1 for item in items if item["field"] == key)}
                for key, spec in FIELD_SPECS.items()
            ],
            "count": len(items),
            "override_count": len(overrides),
        }

    def apply(self, meta: Any) -> List[Dict[str, Any]]:
        """在 MP 解析后覆盖字段；无覆盖规则时只做一次空列表判断。"""
        with self._lock:
            compiled = list(self._compiled)
            self._apply_count += 1
        if not compiled or meta is None:
            return []
        raw = self._raw_title(meta)
        if not raw:
            return []
        tokens = [token for token in re.split(r"[\s.\-_\[\]【】()（）]+", raw) if token]
        changes: List[Dict[str, Any]] = []
        changed_fields = set()
        for rule, pattern in compiled:
            field = rule["field"]
            if field in changed_fields:
                continue
            match = pattern.search(raw)
            if not match:
                for token in tokens:
                    match = pattern.search(token)
                    if match:
                        break
            if not match:
                continue
            spec = FIELD_SPECS[field]
            attr = spec["attr"]
            before = getattr(meta, attr, None)
            if rule["action"] == "clear":
                after = None
            else:
                rendered = self._render_value(rule["value"], match)
                after = self._cast_value(rendered, spec["cast"])
                if after is None:
                    continue
            setattr(meta, attr, after)
            changed_fields.add(field)
            changes.append({
                "field": field, "before": before, "after": after,
                "rule_id": rule["id"], "label": rule["label"],
            })
        if changes:
            with self._lock:
                self._match_count += len(changes)
        return changes

    @staticmethod
    def _raw_title(meta: Any) -> str:
        values = (
            getattr(meta, "title", None), getattr(meta, "org_string", None),
            getattr(meta, "original_name", None), getattr(meta, "name", None),
        )
        return " ".join(str(value) for value in values if value)

    @staticmethod
    def _render_value(template: str, match: Any) -> str:
        value = str(template or "{match}")
        groups = match.groupdict() if hasattr(match, "groupdict") else {}
        replacements = {"match": match.group(0), **{key: val or "" for key, val in groups.items()}}
        numbered = [value for value in match.groups() if value is not None]
        replacements["first_group"] = numbered[0] if numbered else match.group(0)
        for index, item in enumerate(match.groups(), 1):
            replacements[str(index)] = item or ""
        for key, replacement in replacements.items():
            value = value.replace("{" + key + "}", str(replacement))
        return value.strip()

    @staticmethod
    def _cast_value(value: str, cast: str) -> Optional[Any]:
        if cast != "int":
            return value or None
        match = re.search(r"\d+", str(value or ""))
        return int(match.group(0)) if match else None

    def runtime_stats(self) -> Dict[str, int]:
        with self._lock:
            return {
                "catalog_rules": len(self._catalog),
                "override_rules": len(self._overrides),
                "compiled_rules": len(self._compiled),
                "apply_calls": self._apply_count,
                "matched_changes": self._match_count,
            }


def process_identity() -> Dict[str, Any]:
    """供诊断页显示当前 Python 进程身份。"""
    return {"pid": os.getpid(), "python": os.sys.version.split()[0]}
