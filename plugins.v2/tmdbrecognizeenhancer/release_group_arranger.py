"""Structure-aware release-group naming rules."""

from __future__ import annotations

import hashlib
import re
import threading
from copy import deepcopy
from typing import Any, Dict, List, Tuple


class ReleaseGroupArrangementRegistry:
    """Normalize, order and render multiple release groups without touching MP source."""

    _MAX_RULES = 300
    _POSITIONS = {"first", "keep", "last"}
    _SPLIT_RE = re.compile(r"\s*([@&+])\s*")
    _INVALID_NAME_RE = re.compile(r"[\\/:*?\"<>|\x00-\x1f]")
    DEFAULT_CONNECTOR = "__default__"

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._rules: List[Dict[str, Any]] = []
        self._alias_map: Dict[str, Dict[str, Any]] = {}
        self._errors: List[str] = []
        self._default_connector = "@"
        self._normalize_unknown = False
        self._apply_count = 0
        self._match_count = 0

    @staticmethod
    def _safe_int(value: Any, default: int = 0) -> int:
        try:
            return int(value)
        except (TypeError, ValueError):
            return default

    @staticmethod
    def _rule_id(match_name: str, output_name: str) -> str:
        digest = hashlib.sha1(
            f"{match_name}\0{output_name}".encode("utf-8")
        ).hexdigest()[:18]
        return f"group-layout:{digest}"

    @classmethod
    def _clean_name(cls, value: Any, *, required: bool = False) -> str:
        text = str(value or "").strip()
        if required and not text:
            raise ValueError("制作组匹配名称不能为空")
        if len(text) > 120:
            raise ValueError("制作组名称不能超过 120 个字符")
        if text and cls._INVALID_NAME_RE.search(text):
            raise ValueError("制作组名称不能包含路径或文件名非法字符")
        return text

    @staticmethod
    def _normalize_aliases(value: Any) -> List[str]:
        if isinstance(value, str):
            values = re.split(r"[\r\n,;]+", value)
        elif isinstance(value, (list, tuple, set)):
            values = list(value)
        else:
            values = []
        aliases: List[str] = []
        seen = set()
        for raw in values:
            text = str(raw or "").strip()
            key = text.casefold()
            if not text or key in seen:
                continue
            if len(text) > 120:
                raise ValueError("制作组别名不能超过 120 个字符")
            seen.add(key)
            aliases.append(text)
        return aliases[:40]

    @staticmethod
    def _normalize_connector(value: Any) -> str:
        raw = str("@" if value is None else value)
        if raw == ReleaseGroupArrangementRegistry.DEFAULT_CONNECTOR:
            return raw
        return " " if raw and raw.isspace() else raw.strip()

    @classmethod
    def normalize_default_connector(cls, value: Any) -> str:
        connector = cls._normalize_connector("@" if value is None else value)
        if connector == cls.DEFAULT_CONNECTOR or len(connector) > 8 or cls._INVALID_NAME_RE.search(connector):
            return "@"
        return connector

    @classmethod
    def normalize_rules(cls, value: Any) -> List[Dict[str, Any]]:
        if not isinstance(value, list):
            return []
        output: List[Dict[str, Any]] = []
        seen_ids = set()
        for raw in value[:cls._MAX_RULES]:
            if not isinstance(raw, dict):
                continue
            try:
                match_name = cls._clean_name(raw.get("match_name"), required=True)
                output_name = cls._clean_name(raw.get("output_name") or match_name, required=True)
                aliases = cls._normalize_aliases(raw.get("aliases"))
            except ValueError:
                continue
            position = str(raw.get("position") or "keep").strip().lower()
            if position not in cls._POSITIONS:
                position = "keep"
            connector = cls._normalize_connector(raw.get("connector"))
            if connector != cls.DEFAULT_CONNECTOR and (
                    len(connector) > 8 or cls._INVALID_NAME_RE.search(connector)
            ):
                connector = "@"
            rule_id = str(raw.get("id") or "").strip() or cls._rule_id(match_name, output_name)
            if rule_id in seen_ids:
                continue
            seen_ids.add(rule_id)
            output.append({
                "id": rule_id,
                "label": str(raw.get("label") or output_name).strip()[:100],
                "match_name": match_name,
                "aliases": aliases,
                "output_name": output_name,
                "position": position,
                "connector": connector,
                "order": max(-1000, min(1000, cls._safe_int(raw.get("order"), 100))),
                "enabled": bool(raw.get("enabled", True)),
            })
        return sorted(output, key=lambda item: (item["order"], item["id"]))

    @classmethod
    def validate_rule(cls, rule: Dict[str, Any], existing: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        candidate = dict(rule or {})
        match_name = cls._clean_name(candidate.get("match_name"), required=True)
        output_name = cls._clean_name(candidate.get("output_name") or match_name, required=True)
        cls._normalize_aliases(candidate.get("aliases"))
        connector = cls._normalize_connector(candidate.get("connector"))
        if connector != cls.DEFAULT_CONNECTOR and (
                len(connector) > 8 or cls._INVALID_NAME_RE.search(connector)
        ):
            raise ValueError("连接符不能超过 8 个字符，也不能包含路径或文件名非法字符")
        if str(candidate.get("position") or "keep").lower() not in cls._POSITIONS:
            raise ValueError("固定位置只支持最前、保持原顺序或最后")
        if not str(candidate.get("id") or "").strip():
            candidate["id"] = cls._rule_id(match_name, output_name)
        merged = [
            item for item in (existing or [])
            if item.get("id") != candidate["id"]
        ] + [candidate]
        normalized = cls.normalize_rules(merged)
        if not any(item["id"] == candidate["id"] for item in normalized):
            raise ValueError("制作组编排规则无效")
        return normalized

    def refresh(
            self, value: Any, default_connector: Any = "@",
            normalize_unknown: bool = False,
    ) -> None:
        rules = self.normalize_rules(value)
        alias_map: Dict[str, Dict[str, Any]] = {}
        errors: List[str] = []
        for rule in rules:
            if not rule["enabled"]:
                continue
            names = [rule["match_name"], rule["output_name"], *rule["aliases"]]
            for name in names:
                key = name.casefold()
                existing = alias_map.get(key)
                if existing and existing["id"] != rule["id"]:
                    errors.append(
                        f"别名“{name}”同时属于“{existing['label']}”和“{rule['label']}”，已采用排序靠前的规则"
                    )
                    continue
                alias_map[key] = rule
        with self._lock:
            self._rules = rules
            self._alias_map = alias_map
            self._errors = errors
            self._default_connector = self.normalize_default_connector(default_connector)
            self._normalize_unknown = bool(normalize_unknown)

    def apply(self, value: Any) -> Tuple[str, Dict[str, Any]]:
        raw = str(value or "").strip()
        with self._lock:
            alias_map = dict(self._alias_map)
            default_connector = self._default_connector
            override_original_connector = self._normalize_unknown
            self._apply_count += 1
        empty_trace = {
            "applied": False, "input": raw, "output": raw,
            "members": [], "reason": "没有可处理的制作组",
        }
        if not raw:
            return raw, empty_trace

        # A policy for the complete value wins over connector parsing. This keeps a
        # legitimate group whose official name contains '&' or '+' intact.
        whole_rule = alias_map.get(raw.casefold())
        if whole_rule:
            parts = [(raw, "")]
        else:
            tokens = self._SPLIT_RE.split(raw)
            parts = []
            first = str(tokens[0] or "").strip() if tokens else ""
            if first:
                # The first member has no leading connector while it remains first,
                # but it still needs the title's first connector if a rule moves it.
                # Example: VCB+A -> A+VCB, rather than falling back to a global '&'.
                first_connector = str(tokens[1] or "").strip() if len(tokens) > 1 else ""
                parts.append((first, first_connector))
            for index in range(1, len(tokens), 2):
                connector = str(tokens[index] or "").strip()
                name = str(tokens[index + 1] or "").strip() if index + 1 < len(tokens) else ""
                if name:
                    parts.append((name, connector))
        if not parts:
            return raw, empty_trace

        members: List[Dict[str, Any]] = []
        matched = 0
        seen = set()
        for index, (part, original_connector) in enumerate(parts):
            rule = alias_map.get(part.casefold())
            output_name = rule["output_name"] if rule else part
            dedupe_key = output_name.casefold()
            if dedupe_key in seen:
                continue
            seen.add(dedupe_key)
            if rule:
                matched += 1
            explicit_connector = (
                rule.get("connector")
                if rule and rule.get("connector") != self.DEFAULT_CONNECTOR else ""
            )
            if explicit_connector:
                connector = explicit_connector
                connector_source = "rule"
            elif override_original_connector:
                connector = default_connector
                connector_source = "default_override"
            elif original_connector:
                connector = original_connector
                connector_source = "original"
            else:
                connector = default_connector
                connector_source = "default_fallback"
            members.append({
                "input": part,
                "output": output_name,
                "position": rule["position"] if rule else "keep",
                "connector": connector,
                "connector_source": connector_source,
                "original_connector": original_connector,
                "order": rule["order"] if rule else 0,
                "rule_id": rule["id"] if rule else "",
                "rule_label": rule["label"] if rule else "未配置",
                "source_index": index,
            })
        first = sorted(
            (item for item in members if item["position"] == "first"),
            key=lambda item: (item["order"], item["source_index"]),
        )
        middle = [item for item in members if item["position"] == "keep"]
        last = sorted(
            (item for item in members if item["position"] == "last"),
            key=lambda item: (item["order"], item["source_index"]),
        )
        ordered = [*first, *middle, *last]
        rendered = ""
        for index, item in enumerate(ordered):
            if index:
                rendered += item["connector"]
            rendered += item["output"]
        trace = {
            "applied": bool(matched or rendered != raw),
            "input": raw,
            "output": rendered,
            "matched_rules": matched,
            "changed": rendered != raw,
            "members": deepcopy(ordered),
            "reason": (
                "已按制作组规则规范名称、顺序和连接符"
                if matched else
                "默认连接符已覆盖标题原连接符"
                if override_original_connector and rendered != raw else
                "未命中单组规则，已保留标题原连接符"
            ),
        }
        with self._lock:
            self._match_count += matched
        return rendered, trace

    def catalog(self) -> Dict[str, Any]:
        with self._lock:
            rules = deepcopy(self._rules)
            errors = list(self._errors)
            default_connector = self._default_connector
            normalize_unknown = self._normalize_unknown
            stats = {
                "apply_count": self._apply_count,
                "match_count": self._match_count,
            }
        return {
            "items": rules,
            "count": len(rules),
            "errors": errors,
            "stats": stats,
            "positions": [
                {"value": "first", "label": "固定最前"},
                {"value": "keep", "label": "保持原标题顺序"},
                {"value": "last", "label": "固定最后"},
            ],
            "connectors": ["@", "&", "+", "-", "_", ".", " "],
            "default_connector": default_connector,
            "normalize_unknown": normalize_unknown,
            "default_connector_value": self.DEFAULT_CONNECTOR,
        }
