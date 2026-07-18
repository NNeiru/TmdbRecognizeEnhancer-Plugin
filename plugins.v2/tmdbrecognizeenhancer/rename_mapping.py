"""最终命名结果的可配置顺序映射。"""

from __future__ import annotations

import hashlib
import re
import threading
from copy import deepcopy
from typing import Any, Dict, Iterable, List, Tuple


RENAME_MAPPING_STAGES: Dict[str, Dict[str, str]] = {
    "final_result": {
        "label": "最终命名结果",
        "description": "以 MP 首次渲染及字幕后缀处理完成后的相对路径为输入，在文件操作前统一改写一次。",
    },
    "release_group": {
        "label": "旧版制作组映射",
        "description": "兼容旧配置；新制作组规则请使用结构化制作组编排。",
    },
}

_LEGACY_FINAL_STAGES = {"rendered_path", "subtitle_name"}


class RenameMappingRegistry:
    """编译并顺序应用用户维护的命名映射规则。"""

    _MAX_RULES = 300
    _MODES = {"literal", "regex"}

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._rules: List[Dict[str, Any]] = []
        self._compiled: List[Tuple[Dict[str, Any], Any]] = []
        self._errors: List[str] = []
        self._apply_count = 0
        self._match_count = 0

    @staticmethod
    def _rule_id(stage: str, mode: str, pattern: str, replacement: str) -> str:
        digest = hashlib.sha1(
            f"{stage}\0{mode}\0{pattern}\0{replacement}".encode("utf-8")
        ).hexdigest()[:18]
        return f"rename:{digest}"

    @staticmethod
    def _safe_int(value: Any, default: int = 0) -> int:
        try:
            return int(value)
        except (TypeError, ValueError):
            return default

    @classmethod
    def normalize_rules(cls, value: Any) -> List[Dict[str, Any]]:
        if not isinstance(value, list):
            return []
        output: List[Dict[str, Any]] = []
        seen = set()
        seen_semantics = set()
        for raw in value[:cls._MAX_RULES]:
            if not isinstance(raw, dict):
                continue
            stage = str(raw.get("stage") or "final_result").strip().lower()
            if stage in _LEGACY_FINAL_STAGES:
                stage = "final_result"
            mode = str(raw.get("mode") or "literal").strip().lower()
            pattern = str(raw.get("pattern") or "")
            replacement = str(raw.get("replacement") or "")
            if stage not in RENAME_MAPPING_STAGES or mode not in cls._MODES:
                continue
            if not pattern or len(pattern) > 2000 or len(replacement) > 1000:
                continue
            semantic_key = (stage, mode, pattern, replacement)
            if semantic_key in seen_semantics:
                continue
            seen_semantics.add(semantic_key)
            rule_id = str(raw.get("id") or "").strip() or cls._rule_id(
                stage, mode, pattern, replacement
            )
            if rule_id in seen:
                continue
            seen.add(rule_id)
            output.append({
                "id": rule_id,
                "label": str(raw.get("label") or pattern).strip()[:100],
                "stage": stage,
                "mode": mode,
                "pattern": pattern,
                "replacement": replacement,
                "enabled": bool(raw.get("enabled", True)),
                "priority": max(-1000, min(1000, cls._safe_int(raw.get("priority"), 100))),
            })
        return sorted(output, key=lambda item: (-item["priority"], item["id"]))

    def refresh(self, value: Any) -> None:
        rules = self.normalize_rules(value)
        compiled: List[Tuple[Dict[str, Any], Any]] = []
        errors: List[str] = []
        for rule in rules:
            if not rule["enabled"]:
                continue
            if rule["mode"] == "literal":
                compiled.append((rule, None))
                continue
            try:
                compiled.append((rule, re.compile(rule["pattern"])))
            except re.error as err:
                errors.append(f"{rule['label']}：{err}")
        with self._lock:
            self._rules = rules
            self._compiled = compiled
            self._errors = errors

    def apply(self, value: Any, stage: str) -> Tuple[str, List[Dict[str, str]]]:
        """按优先级依次应用规则；后续规则接收前一条规则的输出。"""
        text = str(value or "")
        if not text or stage not in RENAME_MAPPING_STAGES:
            return text, []
        with self._lock:
            compiled = list(self._compiled)
            self._apply_count += 1
        changes: List[Dict[str, str]] = []
        for rule, pattern in compiled:
            if rule["stage"] != stage:
                continue
            before = text
            if rule["mode"] == "literal":
                text = text.replace(rule["pattern"], rule["replacement"])
            else:
                text = pattern.sub(rule["replacement"], text)
            if text != before:
                changes.append({
                    "id": rule["id"],
                    "label": rule["label"],
                    "before": before,
                    "after": text,
                })
        if changes:
            with self._lock:
                self._match_count += len(changes)
        return text, changes

    def catalog(self) -> Dict[str, Any]:
        with self._lock:
            rules = deepcopy(self._rules)
            errors = list(self._errors)
            stats = {
                "apply_count": self._apply_count,
                "match_count": self._match_count,
            }
        return {
            "items": rules,
            "count": len(rules),
            "errors": errors,
            "stages": [
                {"value": key, **deepcopy(spec)}
                for key, spec in RENAME_MAPPING_STAGES.items()
            ],
            "stats": stats,
        }

    @classmethod
    def validate_rule(cls, rule: Dict[str, Any], existing: Iterable[Dict[str, Any]] = ()) -> List[Dict[str, Any]]:
        """严格校验单条 API 输入，同时返回完整规范化规则集。"""
        candidate = dict(rule or {})
        if not str(candidate.get("id") or "").strip():
            candidate["id"] = cls._rule_id(
                str(candidate.get("stage") or "final_result"),
                str(candidate.get("mode") or "literal"),
                str(candidate.get("pattern") or ""),
                str(candidate.get("replacement") or ""),
            )
        merged = [item for item in existing if item.get("id") != candidate["id"]] + [candidate]
        normalized = cls.normalize_rules(merged)
        saved = next((item for item in normalized if item["id"] == candidate["id"]), None)
        if not saved:
            raise ValueError("映射规则缺少有效的阶段、匹配内容或模式")
        if saved["mode"] == "regex":
            try:
                re.compile(saved["pattern"])
            except re.error as err:
                raise ValueError(f"正则表达式无效：{err}") from err
        return normalized
