"""Emby 剧集组外部 ID 联动。

只使用 Emby 标准 REST API。StrmAssistant 注册的剧集组 ProviderId 键为
``TmdbEg``；本模块负责安全定位 Series、幂等写入并按需刷新元数据。
"""

from __future__ import annotations

from copy import deepcopy
from typing import Any, Callable, Dict, Iterable, List, Optional, Tuple

from app.utils.http import RequestUtils


class EmbyEpisodeGroupSynchronizer:
    """在 MoviePilot 已配置的 Emby 实例上写入 ``TmdbEg``。"""

    PROVIDER_KEY = "TmdbEg"
    TERMINAL_STATUSES = {"updated", "already", "conflict", "ambiguous", "unsupported"}
    SUCCESS_STATUSES = {"updated", "already"}

    def __init__(
            self,
            service_provider: Callable[[], Dict[str, Any]],
            request_factory: Callable[..., Any] = RequestUtils,
    ) -> None:
        self._service_provider = service_provider
        self._request_factory = request_factory

    def server_catalog(self) -> List[Dict[str, Any]]:
        """返回不含地址、令牌的 Emby 服务目录。"""
        services = self._services()
        return [
            {
                "name": name,
                "type": str(getattr(service, "type", "") or ""),
                "connected": bool(
                    getattr(getattr(service, "instance", None), "_host", None)
                    and getattr(getattr(service, "instance", None), "_apikey", None)
                ),
            }
            for name, service in services.items()
        ]

    def reconcile(
            self,
            job: Dict[str, Any],
            config: Dict[str, Any],
            previous: Optional[Dict[str, Dict[str, Any]]] = None,
            dry_run: bool = False,
            all_matches: bool = False,
    ) -> Dict[str, Any]:
        """在目标服务器中定位并写入剧集组，返回每台服务器的独立结果。"""
        selected = {
            str(value).strip() for value in config.get("servers") or [] if str(value).strip()
        }
        services = self._services()
        if selected:
            services = {name: service for name, service in services.items() if name in selected}
        results = deepcopy(previous or {})
        if not services:
            return {
                "results": results,
                "retryable": True,
                "reason": "没有可用的 Emby 服务器，等待 MoviePilot 媒体服务器配置",
            }

        for name, service in services.items():
            old = results.get(name) or {}
            if not dry_run and old.get("status") in self.TERMINAL_STATUSES:
                continue
            results[name] = self._reconcile_server(
                server_name=name,
                instance=getattr(service, "instance", None),
                job=job,
                config=config,
                dry_run=dry_run,
                all_matches=all_matches,
            )

        retryable = any(
            value.get("status") in {"pending", "error"}
            for value in results.values()
        )
        return {"results": results, "retryable": retryable, "reason": ""}

    def _reconcile_server(
            self,
            server_name: str,
            instance: Any,
            job: Dict[str, Any],
            config: Dict[str, Any],
            dry_run: bool,
            all_matches: bool = False,
    ) -> Dict[str, Any]:
        if not instance or not getattr(instance, "_host", None) or not getattr(instance, "_apikey", None):
            return self._result("error", "Emby 实例缺少连接信息")

        tmdb_id = self._safe_int(job.get("tmdb_id"))
        group_id = str(job.get("episode_group_id") or "").strip()
        if not tmdb_id or not group_id:
            return self._result("error", "任务缺少 TMDBID 或剧集组 ID")

        items, query_error = self._find_series(instance, tmdb_id, str(job.get("title") or ""))
        if query_error:
            return self._result("error", query_error)
        if not items:
            return self._result("pending", f"尚未在 Emby 中发现 TMDB {tmdb_id}，等待入库扫描")

        mapped_path = self.map_path(
            str(job.get("target_path") or ""),
            server_name,
            config.get("path_mappings") or [],
        )
        if all_matches:
            outcomes = []
            for item in items:
                try:
                    outcome = self._reconcile_item(
                        instance=instance,
                        selected=item,
                        job=job,
                        config=config,
                        dry_run=dry_run,
                        mapped_path=mapped_path,
                        selection="用户明确选择修改全部同 TMDBID 候选",
                    )
                except Exception as err:
                    outcome = self._result(
                        "error",
                        f"处理候选时发生异常：{err}",
                        item_id=str(item.get("Id") or ""),
                        item_name=str(item.get("Name") or ""),
                        item_path=str(item.get("Path") or ""),
                    )
                outcomes.append(outcome)
            statuses = [str(item.get("status") or "error") for item in outcomes]
            successful = sum(status in self.SUCCESS_STATUSES or status == "ready" for status in statuses)
            if successful == len(outcomes):
                status = "updated" if "updated" in statuses else "ready" if "ready" in statuses else "already"
            elif successful:
                status = "partial"
            elif statuses and len(set(statuses)) == 1:
                status = statuses[0]
            else:
                status = "partial"
            return {
                **self._result(
                    status,
                    f"已处理 {len(outcomes)} 个同 TMDBID Series：成功 {successful} 个，需处理 {len(outcomes) - successful} 个",
                ),
                "mapped_target_path": mapped_path,
                "all_matches": True,
                "candidate_count": len(items),
                "conflict_policy": str(config.get("conflict_policy") or "skip"),
                "items": outcomes,
                "candidates": [self._candidate_summary(item) for item in items[:20]],
            }

        selected, selection = self.select_series(items, mapped_path)
        if not selected:
            return {
                **self._result("ambiguous", selection),
                "mapped_target_path": mapped_path,
                "candidate_count": len(items),
                "conflict_policy": str(config.get("conflict_policy") or "skip"),
                "candidates": [self._candidate_summary(item) for item in items[:20]],
            }

        return self._reconcile_item(
            instance=instance,
            selected=selected,
            job=job,
            config=config,
            dry_run=dry_run,
            mapped_path=mapped_path,
            selection=selection,
        )

    def _reconcile_item(
            self,
            instance: Any,
            selected: Dict[str, Any],
            job: Dict[str, Any],
            config: Dict[str, Any],
            dry_run: bool,
            mapped_path: str,
            selection: str,
    ) -> Dict[str, Any]:
        """幂等检查并更新一个已经确定的 Emby Series。"""
        group_id = str(job.get("episode_group_id") or "").strip()
        tmdb_id = self._safe_int(job.get("tmdb_id"))

        item_id = str(selected.get("Id") or "")
        item_name = str(selected.get("Name") or job.get("title") or f"TMDB {tmdb_id}")
        item_path = str(selected.get("Path") or "")
        detail, detail_error = self._get_item(instance, item_id)
        if detail_error:
            return self._result("error", detail_error, item_id=item_id, item_name=item_name, item_path=item_path)

        provider_ids = dict(detail.get("ProviderIds") or {})
        current_group = self._provider_value(provider_ids, self.PROVIDER_KEY)
        base = {
            "item_id": item_id,
            "item_name": item_name,
            "item_path": item_path,
            "mapped_target_path": mapped_path,
            "existing_group_id": current_group,
            "target_group_id": group_id,
            "selection": selection,
        }
        if current_group == group_id:
            return {**self._result("already", "对应 Series 已配置此剧集组"), **base}
        if current_group and current_group != group_id and config.get("conflict_policy") != "overwrite":
            return {
                **self._result("conflict", f"Emby 已配置其它剧集组 {current_group}，按安全策略未覆盖"),
                **base,
            }

        capability, capability_error = self._supports_episode_group(instance, item_id)
        if capability is False:
            return {
                **self._result("unsupported", "当前 Emby 未注册 TmdbEg，请确认已安装并启用支持剧集组的 StrmAssistant"),
                **base,
            }
        if dry_run:
            message = "定位成功；正式任务将写入 TmdbEg"
            if capability is None:
                message += f"（能力接口无法确认：{capability_error}）"
            return {**self._result("ready", message), **base}

        self._set_provider_value(provider_ids, self.PROVIDER_KEY, group_id)
        detail["ProviderIds"] = provider_ids
        update_error = self._update_item(instance, item_id, detail)
        if update_error:
            return {**self._result("error", update_error), **base}

        verified, verify_error = self._get_item(instance, item_id)
        persisted_group = self._provider_value((verified or {}).get("ProviderIds") or {}, self.PROVIDER_KEY)
        if verify_error or persisted_group != group_id:
            return {
                **self._result("error", verify_error or "Emby 未保存 TmdbEg，写入校验失败"),
                **base,
            }

        refresh_warning = ""
        if config.get("refresh_metadata", True):
            refresh_warning = self._refresh_item(instance, item_id) or ""
        reason = "已写入 TmdbEg 并触发元数据刷新" if not refresh_warning else f"TmdbEg 已写入；刷新失败：{refresh_warning}"
        return {
            **self._result("updated", reason),
            **base,
            "existing_group_id": group_id,
            "capability_unconfirmed": capability is None,
        }

    def _find_series(self, instance: Any, tmdb_id: int, title: str) -> Tuple[List[Dict[str, Any]], str]:
        params = {
            "IncludeItemTypes": "Series",
            "Recursive": "true",
            "Fields": "ProviderIds,Path,ProductionYear,OriginalTitle",
            "AnyProviderIdEquals": f"tmdb.{tmdb_id}",
            "StartIndex": 0,
            "Limit": 100,
        }
        payload, error, _ = self._request_json(instance, "get", "emby/Items", params=params)
        if error:
            return [], f"查询 Emby Series 失败：{error}"
        items = self._filter_tmdb((payload or {}).get("Items") or [], tmdb_id)
        if items or not title:
            return items, ""

        # 兼容忽略 AnyProviderIdEquals 的旧 Emby：按标题补查后仍严格核对 TMDBID。
        fallback = {**params, "SearchTerm": title}
        fallback.pop("AnyProviderIdEquals", None)
        payload, error, _ = self._request_json(instance, "get", "emby/Items", params=fallback)
        if error:
            return [], f"查询 Emby Series 失败：{error}"
        return self._filter_tmdb((payload or {}).get("Items") or [], tmdb_id), ""

    def _get_item(self, instance: Any, item_id: str) -> Tuple[Dict[str, Any], str]:
        user = str(getattr(instance, "user", "") or "").strip()
        path = f"emby/Users/{user}/Items/{item_id}" if user else f"emby/Items/{item_id}"
        payload, error, _ = self._request_json(instance, "get", path)
        return (payload if isinstance(payload, dict) else {}), error

    def _supports_episode_group(self, instance: Any, item_id: str) -> Tuple[Optional[bool], str]:
        payload, error, status = self._request_json(
            instance, "get", f"emby/Items/{item_id}/ExternalIdInfos", allow_error=True,
        )
        if error or status != 200:
            return None, error or f"HTTP {status}"
        values = payload if isinstance(payload, list) else []
        keys = {
            str(item.get("Key") or item.get("key") or "").casefold()
            for item in values if isinstance(item, dict)
        }
        return self.PROVIDER_KEY.casefold() in keys, ""

    def _update_item(self, instance: Any, item_id: str, item: Dict[str, Any]) -> str:
        _, error, status = self._request_json(
            instance, "post", f"emby/Items/{item_id}", json_body=item, allow_error=True,
        )
        return "" if status in {200, 204} else error or f"HTTP {status}"

    def _refresh_item(self, instance: Any, item_id: str) -> str:
        params = {
            "Recursive": "true",
            "MetadataRefreshMode": "FullRefresh",
            "ImageRefreshMode": "Default",
            "ReplaceAllMetadata": "false",
            "ReplaceAllImages": "false",
        }
        _, error, status = self._request_json(
            instance, "post", f"emby/Items/{item_id}/Refresh", params=params, allow_error=True,
        )
        return "" if status in {200, 204} else error or f"HTTP {status}"

    def _request_json(
            self,
            instance: Any,
            method: str,
            path: str,
            params: Optional[Dict[str, Any]] = None,
            json_body: Optional[Dict[str, Any]] = None,
            allow_error: bool = False,
    ) -> Tuple[Any, str, int]:
        host = str(getattr(instance, "_host", "") or "").rstrip("/") + "/"
        apikey = str(getattr(instance, "_apikey", "") or "")
        query = {**(params or {}), "api_key": apikey}
        response = None
        try:
            requester = self._request_factory(content_type="application/json", timeout=20)
            if method == "post":
                response = requester.post_res(f"{host}{path.lstrip('/')}", params=query, json=json_body)
            else:
                response = requester.get_res(f"{host}{path.lstrip('/')}", params=query)
            if response is None:
                return None, "服务器无响应", 0
            status = int(getattr(response, "status_code", 0) or 0)
            payload: Any = None
            if getattr(response, "content", None):
                try:
                    payload = response.json()
                except Exception:
                    payload = None
            if status < 200 or status >= 300:
                message = ""
                if isinstance(payload, dict):
                    message = str(payload.get("Message") or payload.get("message") or "")
                return payload, message or f"HTTP {status}", status
            return payload, "", status
        except Exception as err:
            return None, str(err), 0
        finally:
            if response is not None:
                try:
                    response.close()
                except Exception:
                    pass

    def _services(self) -> Dict[str, Any]:
        try:
            values = self._service_provider() or {}
        except Exception:
            return {}
        return {
            str(name): service for name, service in values.items()
            if str(getattr(service, "type", "") or "").casefold() == "emby"
        }

    @classmethod
    def select_series(
            cls, items: Iterable[Dict[str, Any]], target_path: str,
    ) -> Tuple[Optional[Dict[str, Any]], str]:
        """TMDBID 已严格过滤后，优先用最终文件路径消除多库歧义。"""
        candidates = [item for item in items if isinstance(item, dict) and item.get("Id")]
        if len(candidates) == 1:
            return candidates[0], "TMDBID 唯一命中"
        if not candidates:
            return None, "没有候选 Series"
        target = cls.normalize_path(target_path)
        path_matches = [
            item for item in candidates
            if cls.path_contains(str(item.get("Path") or ""), target)
        ]
        if len(path_matches) == 1:
            return path_matches[0], "TMDBID 多条命中，已用整理目标路径唯一定位"
        if len(path_matches) > 1:
            return None, "多个同 TMDBID Series 都覆盖整理目标路径，无法安全选择"
        return None, "同一 TMDBID 在 Emby 中存在多个 Series，目标路径未能唯一对应"

    @classmethod
    def map_path(cls, path: str, server_name: str, mappings: Iterable[Dict[str, Any]]) -> str:
        normalized = cls.normalize_path(path)
        matches: List[Tuple[int, str, str]] = []
        for item in mappings or []:
            if not isinstance(item, dict):
                continue
            server = str(item.get("server") or "*").strip()
            if server not in {"*", server_name}:
                continue
            source = cls.normalize_path(str(item.get("source") or ""))
            target = cls.normalize_path(str(item.get("target") or ""))
            if source and target and (normalized.casefold() == source.casefold() or normalized.casefold().startswith(source.casefold().rstrip("/") + "/")):
                matches.append((len(source), source, target))
        if not matches:
            return normalized
        _, source, target = max(matches, key=lambda value: value[0])
        suffix = normalized[len(source):].lstrip("/")
        return target.rstrip("/") + (f"/{suffix}" if suffix else "")

    @staticmethod
    def normalize_path(value: str) -> str:
        path = str(value or "").strip().replace("\\", "/")
        while "//" in path:
            path = path.replace("//", "/")
        return path.rstrip("/")

    @classmethod
    def path_contains(cls, parent: str, child: str) -> bool:
        parent_value = cls.normalize_path(parent).casefold()
        child_value = cls.normalize_path(child).casefold()
        return bool(parent_value and child_value and (
            child_value == parent_value or child_value.startswith(parent_value.rstrip("/") + "/")
        ))

    @staticmethod
    def _provider_value(provider_ids: Dict[str, Any], key: str) -> str:
        return next((str(value or "") for name, value in provider_ids.items() if str(name).casefold() == key.casefold()), "")

    @staticmethod
    def _set_provider_value(provider_ids: Dict[str, Any], key: str, value: str) -> None:
        old_key = next((name for name in provider_ids if str(name).casefold() == key.casefold()), key)
        provider_ids[old_key] = value

    @classmethod
    def _filter_tmdb(cls, items: Iterable[Dict[str, Any]], tmdb_id: int) -> List[Dict[str, Any]]:
        return [
            item for item in items if isinstance(item, dict)
            and cls._safe_int(cls._provider_value(item.get("ProviderIds") or {}, "Tmdb")) == tmdb_id
        ]

    @staticmethod
    def _candidate_summary(item: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "item_id": str(item.get("Id") or ""),
            "name": str(item.get("Name") or ""),
            "year": item.get("ProductionYear"),
            "path": str(item.get("Path") or ""),
        }

    @staticmethod
    def _safe_int(value: Any) -> int:
        try:
            return int(value or 0)
        except (TypeError, ValueError):
            return 0

    @staticmethod
    def _result(status: str, reason: str, **kwargs: Any) -> Dict[str, Any]:
        return {"status": status, "reason": reason, **kwargs}
