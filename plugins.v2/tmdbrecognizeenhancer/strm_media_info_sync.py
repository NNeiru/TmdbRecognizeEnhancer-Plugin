"""神医助手（StrmAssistant）Pro 媒体信息推送。

MoviePilot 在整理时已用本地 ffprobe 扫出真实媒体流；本模块把转换后的
``MediaSourceInfo``（见 emby_media_info.py）通过神医 Pro 的
``POST /Items/SyncMediaInfo`` 接口推送给 Emby，由神医写入数据库——
Emby（尤其网盘/strm 场景）无需再自行探测。

接口契约（来自神医 wiki「分布式媒体信息提取·集中共享方案」与社区版源码）：
- ``POST /emby/Items/SyncMediaInfo?Path=<url编码的Emby侧路径>&api_key=...``
- 请求体为 ``List<MediaSourceWithChapters>``；缺大小或时长会被拒绝并返回空数组
- 该媒体已有媒体信息时本地数据优先（返回本地 json）
- 找不到媒体或不是影音时返回 400 —— 通常意味着 Emby 还没扫到，稍后重试
- 外挂字幕与片头片尾信息由神医清除，插件只推内封流

社区版没有该接口（会 404），界面须明确标注 Pro 依赖。
"""

from __future__ import annotations

from typing import Any, Callable, Dict, List, Optional, Tuple

from app.utils.http import RequestUtils

from .emby_media_info import is_acceptable
from .emby_episode_group_sync import EmbyEpisodeGroupSynchronizer


class StrmMediaInfoSynchronizer:
    """把 MoviePilot 预扫的媒体信息灌入运行神医 Pro 的 Emby。"""

    TERMINAL_STATUSES = {"synced", "local", "empty", "unsupported", "invalid"}
    SUCCESS_STATUSES = {"synced", "local"}

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

    def push(
            self,
            job: Dict[str, Any],
            config: Dict[str, Any],
            previous: Optional[Dict[str, Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """向目标服务器推送一个任务的媒体信息，返回每台服务器的独立结果。"""
        payload = job.get("sync_payload")
        if not isinstance(payload, list) or not payload or not is_acceptable(payload[0]):
            return {
                "results": dict(previous or {}),
                "retryable": False,
                "reason": "扫描结果缺少大小或时长，神医会拒绝该媒体信息",
            }

        selected = {
            str(value).strip() for value in config.get("servers") or [] if str(value).strip()
        }
        services = self._services()
        if selected:
            services = {name: service for name, service in services.items() if name in selected}
        results: Dict[str, Dict[str, Any]] = dict(previous or {})
        if not services:
            return {
                "results": results,
                "retryable": True,
                "reason": "没有可用的 Emby 服务器，等待 MoviePilot 媒体服务器配置",
            }

        for name, service in services.items():
            old = results.get(name) or {}
            if old.get("status") in self.TERMINAL_STATUSES:
                continue
            results[name] = self._push_server(
                server_name=name,
                instance=getattr(service, "instance", None),
                job=job,
                config=config,
                payload=payload,
            )

        retryable = any(
            value.get("status") in {"pending", "error"}
            for value in results.values()
        )
        return {"results": results, "retryable": retryable, "reason": ""}

    def _push_server(
            self,
            server_name: str,
            instance: Any,
            job: Dict[str, Any],
            config: Dict[str, Any],
            payload: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        if not instance or not getattr(instance, "_host", None) or not getattr(instance, "_apikey", None):
            return self._result("error", "Emby 实例缺少连接信息")

        target_path = str(job.get("target_path") or "").strip()
        if not target_path:
            return self._result("invalid", "任务缺少整理目标路径")
        mapped_path = EmbyEpisodeGroupSynchronizer.map_path(
            target_path, server_name, config.get("path_mappings") or [],
        )

        body, error, status = self._request_json(
            instance,
            "emby/Items/SyncMediaInfo",
            params={"Path": mapped_path},
            json_body=payload,
        )
        base = {"mapped_path": mapped_path}
        if status == 404:
            return {
                **self._result(
                    "unsupported",
                    "服务器未注册 SyncMediaInfo 接口：需要神医助手（StrmAssistant）Pro 版",
                ),
                **base,
            }
        if status == 400:
            return {
                **self._result("pending", "Emby 尚未发现该路径对应的媒体，等待入库扫描"),
                **base,
            }
        if status == 401 or status == 403:
            return {**self._result("error", f"Emby 鉴权失败（HTTP {status}）"), **base}
        if status == 0 or error:
            return {**self._result("error", error or "服务器无响应"), **base}
        if status != 200:
            return {**self._result("error", f"HTTP {status}"), **base}

        if isinstance(body, list) and body:
            restored = body[0] if isinstance(body[0], dict) else {}
            local_ticks = ((restored.get("MediaSourceInfo") or {}).get("RunTimeTicks"))
            pushed_ticks = ((payload[0].get("MediaSourceInfo") or {}).get("RunTimeTicks"))
            if local_ticks and pushed_ticks and local_ticks != pushed_ticks:
                # 本地数据优先原则：返回的不是我们推的内容，说明 Emby 已有媒体信息
                return {
                    **self._result("local", "Emby 已存在媒体信息，神医按本地优先保留原值"),
                    **base,
                }
            return {**self._result("synced", "媒体信息已推送并由神医写入 Emby"), **base}
        if isinstance(body, dict) and body:
            return {**self._result("synced", "媒体信息已推送并由神医写入 Emby"), **base}
        return {
            **self._result(
                "empty",
                "神医返回空结果：请求体可能被拒绝（缺大小/时长）或服务端提取失败",
            ),
            **base,
        }

    def _request_json(
            self,
            instance: Any,
            path: str,
            params: Optional[Dict[str, Any]] = None,
            json_body: Any = None,
    ) -> Tuple[Any, str, int]:
        host = str(getattr(instance, "_host", "") or "").rstrip("/") + "/"
        apikey = str(getattr(instance, "_apikey", "") or "")
        query = {**(params or {}), "api_key": apikey}
        response = None
        try:
            requester = self._request_factory(content_type="application/json", timeout=30)
            response = requester.post_res(f"{host}{path.lstrip('/')}", params=query, json=json_body)
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
                return payload, message, status
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

    @staticmethod
    def _result(status: str, reason: str, **kwargs: Any) -> Dict[str, Any]:
        return {"status": status, "reason": reason, **kwargs}
