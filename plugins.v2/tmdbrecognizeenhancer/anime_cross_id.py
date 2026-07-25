from __future__ import annotations

import hashlib
import json
import re
import threading
import unicodedata
import zipfile
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, List, Optional, Tuple


class AnimeCrossIdDatabase:
    """本地维护 bangumi-data，并提供动画标题与跨站 ID 到 TMDB 的确定映射。"""

    DATA_URLS = (
        "https://unpkg.com/bangumi-data@0.3/dist/data.json",
        "https://raw.githubusercontent.com/bangumi-data/bangumi-data/master/dist/data.json",
    )
    DATA_FILE = "bangumi-data.json"
    META_FILE = "bangumi-data.meta.json"
    BUNDLED_FILE = "resources/bangumi-data.zip"

    def __init__(
        self,
        data_dir: Optional[Path],
        downloader: Callable[[str], Optional[bytes]],
    ) -> None:
        self._data_dir = Path(data_dir) if data_dir else None
        self._downloader = downloader
        self._lock = threading.RLock()
        self._refresh_lock = threading.Lock()
        self._refresh_thread: Optional[threading.Thread] = None
        self._records: List[Dict[str, Any]] = []
        self._title_index: Dict[str, List[int]] = {}
        self._id_indexes: Dict[str, Dict[str, List[int]]] = {
            "anilist": {},
            "bangumi": {},
            "anidb": {},
            "mal": {},
            "tmdb": {},
        }
        self._meta: Dict[str, Any] = {}
        self._last_error = ""

    @staticmethod
    def normalize_title(value: Any) -> str:
        """生成只用于严格身份索引的稳定标题键，不主动删除季号。"""
        text = unicodedata.normalize("NFKC", str(value or "")).casefold()
        text = text.replace("＆", "&")
        return "".join(re.findall(r"[a-z0-9\u3400-\u9fff]+", text))

    @staticmethod
    def _site_map(item: Dict[str, Any]) -> Dict[str, str]:
        result: Dict[str, str] = {}
        for site in item.get("sites") or []:
            if not isinstance(site, dict):
                continue
            name = str(site.get("site") or "").strip()
            value = str(site.get("id") or "").strip()
            if name and value and name not in result:
                result[name] = value
        return result

    @staticmethod
    def _aliases(item: Dict[str, Any]) -> List[str]:
        aliases = [str(item.get("title") or "").strip()]
        translations = item.get("titleTranslate") or {}
        if isinstance(translations, dict):
            for values in translations.values():
                if isinstance(values, list):
                    aliases.extend(str(value or "").strip() for value in values)
                elif values:
                    aliases.append(str(values).strip())
        return list(dict.fromkeys(value for value in aliases if value))

    @staticmethod
    def _tmdb_identity(value: str) -> Tuple[str, int]:
        # bangumi-data 会把后续季度精确写成 tv/123/season/2，或把 OVA
        # 写到具体 episode；身份仍属于同一个 TMDB Series/Movie。
        match = re.fullmatch(
            r"(tv|movie)/(\d+)(?:-[^/]+)?(?:/(?:season|episode)/\d+(?:/episode/\d+)?)?",
            str(value or "").strip(),
        )
        if not match:
            return "", 0
        return match.group(1), int(match.group(2))

    @staticmethod
    def _year(value: Any) -> str:
        match = re.match(r"(\d{4})", str(value or ""))
        return match.group(1) if match else ""

    def _paths(self) -> Tuple[Optional[Path], Optional[Path]]:
        if not self._data_dir:
            return None, None
        return self._data_dir / self.DATA_FILE, self._data_dir / self.META_FILE

    def load(self) -> bool:
        """从插件数据目录加载已有快照；文件异常时保留当前可用索引。"""
        data_path, meta_path = self._paths()
        if not data_path or not data_path.exists():
            return self._load_bundled_snapshot()
        try:
            payload = data_path.read_bytes()
            meta = {}
            if meta_path and meta_path.exists():
                loaded_meta = json.loads(meta_path.read_text(encoding="utf-8"))
                meta = loaded_meta if isinstance(loaded_meta, dict) else {}
            self._install_payload(payload, meta=meta)
            return True
        except Exception as err:  # noqa: BLE001 - 损坏快照应降级为 TMDB 搜索
            self._last_error = f"本地数据库加载失败：{err}"
            return self._load_bundled_snapshot()

    def _load_bundled_snapshot(self) -> bool:
        """首次安装时加载随插件发布的压缩快照，避免依赖即时联网。"""
        bundle = Path(__file__).resolve().parent / self.BUNDLED_FILE
        if not bundle.exists():
            return False
        try:
            with zipfile.ZipFile(bundle, "r") as archive:
                payload = archive.read("data.json")
            self._install_payload(payload, meta={
                "updated_at": datetime.fromtimestamp(
                    bundle.stat().st_mtime,
                ).astimezone().isoformat(timespec="seconds"),
                "source_url": "bundled://bangumi-data",
                "bundled": True,
            })
            return True
        except Exception as err:  # noqa: BLE001 - 内置快照异常仍可联网更新
            self._last_error = f"内置数据库加载失败：{err}"
            return False

    def _install_payload(
        self,
        payload: bytes,
        meta: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        if not payload:
            raise ValueError("数据库响应为空")
        document = json.loads(payload.decode("utf-8-sig"))
        if not isinstance(document, dict) or not isinstance(document.get("items"), list):
            raise ValueError("bangumi-data 缺少 items 数组")
        if len(document["items"]) < 1000:
            raise ValueError("bangumi-data 条目数量异常")

        records: List[Dict[str, Any]] = []
        title_index: Dict[str, List[int]] = {}
        id_indexes: Dict[str, Dict[str, List[int]]] = {
            "anilist": {},
            "bangumi": {},
            "anidb": {},
            "mal": {},
            "tmdb": {},
        }
        tmdb_count = 0
        for item in document["items"]:
            if not isinstance(item, dict):
                continue
            sites = self._site_map(item)
            media_type, tmdb_id = self._tmdb_identity(sites.get("tmdb", ""))
            aliases = self._aliases(item)
            if not aliases:
                continue
            record = {
                "title": aliases[0],
                "aliases": aliases,
                "type": str(item.get("type") or ""),
                "lang": str(item.get("lang") or ""),
                "begin": str(item.get("begin") or ""),
                "year": self._year(item.get("begin")),
                "tmdb_id": tmdb_id,
                "media_type": media_type,
                "tmdb_path": sites.get("tmdb", ""),
                "anilist_id": sites.get("aniList", ""),
                "bangumi_id": sites.get("bangumi", ""),
                "anidb_id": sites.get("anidb", ""),
                "mal_id": sites.get("mal", ""),
            }
            index = len(records)
            records.append(record)
            if tmdb_id:
                tmdb_count += 1
            for alias in aliases:
                key = self.normalize_title(alias)
                if key:
                    title_index.setdefault(key, []).append(index)
            for site, value in (
                ("anilist", record["anilist_id"]),
                ("bangumi", record["bangumi_id"]),
                ("anidb", record["anidb_id"]),
                ("mal", record["mal_id"]),
                ("tmdb", f"{media_type}/{tmdb_id}" if tmdb_id else ""),
            ):
                if value:
                    id_indexes[site].setdefault(str(value), []).append(index)

        if not records or not tmdb_count:
            raise ValueError("bangumi-data 未生成有效 TMDB 索引")
        digest = hashlib.sha256(payload).hexdigest()
        installed_meta = {
            **(meta or {}),
            "sha256": digest,
            "item_count": len(records),
            "tmdb_count": tmdb_count,
        }
        with self._lock:
            self._records = records
            self._title_index = title_index
            self._id_indexes = id_indexes
            self._meta = installed_meta
            self._last_error = ""
        return installed_meta

    def refresh(self, force: bool = False) -> Dict[str, Any]:
        """下载最新版快照并原子替换本地文件。"""
        if not self._refresh_lock.acquire(blocking=False):
            return {"updated": False, "busy": True, **self.status()}
        try:
            payload = None
            source_url = ""
            errors = []
            for url in self.DATA_URLS:
                try:
                    payload = self._downloader(url)
                    if payload:
                        source_url = url
                        break
                    errors.append(f"{url} 返回空内容")
                except Exception as err:  # noqa: BLE001 - 多下载源逐个降级
                    errors.append(f"{url}: {err}")
            if not payload:
                raise RuntimeError("；".join(errors) or "全部下载源均不可用")

            digest = hashlib.sha256(payload).hexdigest()
            now = datetime.now().astimezone().isoformat(timespec="seconds")
            with self._lock:
                previous_digest = str(self._meta.get("sha256") or "")
            if not force and previous_digest and digest == previous_digest:
                with self._lock:
                    self._meta["checked_at"] = now
                    self._meta["source_url"] = source_url
                data_path, _ = self._paths()
                if data_path and not data_path.exists():
                    data_path.parent.mkdir(parents=True, exist_ok=True)
                    temporary = data_path.with_suffix(".tmp")
                    temporary.write_bytes(payload)
                    temporary.replace(data_path)
                self._write_meta()
                return {"updated": False, "unchanged": True, **self.status()}

            meta = {
                "updated_at": now,
                "checked_at": now,
                "source_url": source_url,
                "sha256": digest,
            }
            self._install_payload(payload, meta=meta)
            data_path, _ = self._paths()
            if data_path:
                data_path.parent.mkdir(parents=True, exist_ok=True)
                temporary = data_path.with_suffix(".tmp")
                temporary.write_bytes(payload)
                temporary.replace(data_path)
                self._write_meta()
            return {"updated": True, **self.status()}
        except Exception as err:  # noqa: BLE001 - 更新失败时继续使用旧快照
            self._last_error = f"数据库更新失败：{err}"
            return {"updated": False, "error": self._last_error, **self.status()}
        finally:
            self._refresh_lock.release()

    def _write_meta(self) -> None:
        _, meta_path = self._paths()
        if not meta_path:
            return
        meta_path.parent.mkdir(parents=True, exist_ok=True)
        with self._lock:
            value = deepcopy(self._meta)
        temporary = meta_path.with_suffix(".tmp")
        temporary.write_text(
            json.dumps(value, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        temporary.replace(meta_path)

    def refresh_in_background(self, force: bool = False) -> bool:
        """合并重复更新请求，避免插件启动或页面刷新阻塞。"""
        if self._refresh_thread and self._refresh_thread.is_alive():
            return False

        def worker() -> None:
            self.refresh(force=force)

        self._refresh_thread = threading.Thread(
            target=worker,
            name="anime-cross-id-update",
            daemon=True,
        )
        self._refresh_thread.start()
        return True

    def needs_refresh(self, interval_hours: int) -> bool:
        """本地无数据或距上次检查超过指定小时即需更新。"""
        with self._lock:
            if not self._records:
                return True
            checked = self._meta.get("checked_at") or self._meta.get("updated_at")
        if not checked:
            return True
        try:
            checked_at = datetime.fromisoformat(str(checked))
            now = datetime.now().astimezone()
            if checked_at.tzinfo is None:
                checked_at = checked_at.astimezone()
            return (now - checked_at).total_seconds() >= max(1, interval_hours) * 3600
        except (TypeError, ValueError):
            return True

    def status(self) -> Dict[str, Any]:
        with self._lock:
            meta = deepcopy(self._meta)
            return {
                "ready": bool(self._records),
                "updating": bool(
                    self._refresh_thread and self._refresh_thread.is_alive()
                ),
                "item_count": len(self._records),
                "title_key_count": len(self._title_index),
                "anilist_count": len(self._id_indexes["anilist"]),
                "bangumi_count": len(self._id_indexes["bangumi"]),
                "tmdb_count": int(meta.get("tmdb_count") or 0),
                "updated_at": meta.get("updated_at") or "",
                "checked_at": meta.get("checked_at") or "",
                "source_url": meta.get("source_url") or "",
                "sha256": str(meta.get("sha256") or "")[:12],
                "error": self._last_error,
                "license": "CC BY 4.0",
                "project": "bangumi-data/bangumi-data",
            }

    def _records_for_ids(
        self,
        anilist_id: Any = None,
        bangumi_id: Any = None,
        anidb_id: Any = None,
    ) -> Tuple[List[int], str]:
        for site, value in (
            ("anilist", anilist_id),
            ("bangumi", bangumi_id),
            ("anidb", anidb_id),
        ):
            normalized = str(value or "").strip()
            if normalized:
                matches = list(self._id_indexes[site].get(normalized) or [])
                if matches:
                    return matches, f"{site}_id"
        return [], ""

    @staticmethod
    def _unique(values: Iterable[int]) -> List[int]:
        return list(dict.fromkeys(values))

    def lookup(
        self,
        *,
        title: Any = "",
        original_title: Any = "",
        anilist_id: Any = None,
        bangumi_id: Any = None,
        anidb_id: Any = None,
        year: Any = None,
        media_type: Any = None,
    ) -> Dict[str, Any]:
        """按稳定 ID 或严格标题查找；无法唯一确定 TMDB 时不猜测。"""
        with self._lock:
            if not self._records:
                return {"accepted": False, "reason": "跨站数据库尚未就绪"}
            indexes, match_kind = self._records_for_ids(
                anilist_id=anilist_id,
                bangumi_id=bangumi_id,
                anidb_id=anidb_id,
            )
            matched_title = ""
            if not indexes:
                for candidate_title in (title, original_title):
                    key = self.normalize_title(candidate_title)
                    if key and self._title_index.get(key):
                        indexes.extend(self._title_index[key])
                        matched_title = str(candidate_title or "")
                indexes = self._unique(indexes)
                match_kind = "title_exact" if indexes else ""
            records = [deepcopy(self._records[index]) for index in indexes]

        if not records:
            return {"accepted": False, "reason": "跨站数据库没有匹配条目"}
        records = [record for record in records if record.get("tmdb_id")]
        if not records:
            return {
                "accepted": False,
                "reason": "条目已匹配，但 bangumi-data 尚未维护 TMDB ID",
                "match_kind": match_kind,
            }

        requested_type = str(
            getattr(media_type, "value", media_type) or ""
        ).casefold()
        requested_type = "tv" if requested_type in ("tv", "电视剧") else (
            "movie" if requested_type in ("movie", "电影") else ""
        )
        if requested_type:
            typed = [
                record for record in records
                if record.get("media_type") == requested_type
            ]
            if typed:
                records = typed

        requested_year = self._year(year)
        if requested_year:
            same_year = [
                record for record in records
                if record.get("year") == requested_year
            ]
            if same_year:
                records = same_year

        identities: Dict[Tuple[str, int], List[Dict[str, Any]]] = {}
        for record in records:
            identity = (
                str(record.get("media_type") or ""),
                int(record.get("tmdb_id") or 0),
            )
            identities.setdefault(identity, []).append(record)
        if len(identities) != 1:
            return {
                "accepted": False,
                "reason": f"跨站数据库命中 {len(identities)} 个不同 TMDB 条目，无法安全唯一选择",
                "match_kind": match_kind,
                "candidate_ids": [
                    {"media_type": key[0], "tmdb_id": key[1]}
                    for key in identities
                ],
            }

        (resolved_type, tmdb_id), identity_records = next(iter(identities.items()))
        selected = identity_records[0]
        return {
            "accepted": True,
            "reason": (
                f"bangumi-data 通过 {match_kind} 精确映射到 "
                f"TMDB {resolved_type}/{tmdb_id}"
            ),
            "match_kind": match_kind,
            "matched_title": matched_title,
            "tmdb_id": tmdb_id,
            "media_type": resolved_type,
            "record": selected,
            "related_records": len(identity_records),
        }
