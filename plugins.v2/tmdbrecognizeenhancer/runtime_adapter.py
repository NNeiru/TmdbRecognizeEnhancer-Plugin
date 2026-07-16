"""MoviePilot 运行时适配器：不改源码地暴露当前识别 MetaBase。"""

from __future__ import annotations

from contextvars import ContextVar
from functools import wraps
from typing import Any, Optional


class MoviePilotRuntimeAdapter:
    """临时包装媒体识别入口，在同一同步/异步上下文中保存 MetaBase。"""

    _context_attr = "_tmdb_enhancer_meta_context"
    _sync_marker = "_tmdb_enhancer_sync_wrapper"
    _async_marker = "_tmdb_enhancer_async_wrapper"

    def __init__(self):
        self.compatible = False
        self.message = "尚未安装运行时适配器"
        self._owner_token = object()

    def install(self) -> bool:
        """安装轻量包装；MoviePilot 接口不兼容时安全返回 False。"""
        try:
            from app.chain.media import MediaChain
        except Exception as err:
            self.message = f"无法导入 MoviePilot MediaChain：{err}"
            return False

        sync_name = "_recognize_with_fallback_by_meta"
        async_name = "_async_recognize_with_fallback_by_meta"
        if not hasattr(MediaChain, sync_name) or not hasattr(MediaChain, async_name):
            self.message = "当前 MoviePilot 缺少可兼容的媒体识别入口"
            return False

        context = getattr(MediaChain, self._context_attr, None)
        if not isinstance(context, ContextVar):
            context = ContextVar("tmdb_recognize_enhancer_meta", default=None)
            setattr(MediaChain, self._context_attr, context)

        current_sync = getattr(MediaChain, sync_name)
        if not getattr(current_sync, self._sync_marker, False):
            original_sync = current_sync

            @wraps(original_sync)
            def sync_wrapper(chain, metainfo, *args, **kwargs):
                token = context.set(metainfo)
                try:
                    return original_sync(chain, metainfo, *args, **kwargs)
                finally:
                    context.reset(token)

            setattr(sync_wrapper, self._sync_marker, True)
            setattr(sync_wrapper, "_tmdb_enhancer_original", original_sync)
            setattr(sync_wrapper, "_tmdb_enhancer_owner", self._owner_token)
            setattr(MediaChain, sync_name, sync_wrapper)
        else:
            # 插件热更新可能先创建新实例、后停止旧实例。把现有包装的所有权
            # 交给新实例，避免旧实例的 stop_service 把新实例正在使用的包装卸掉。
            setattr(current_sync, "_tmdb_enhancer_owner", self._owner_token)

        current_async = getattr(MediaChain, async_name)
        if not getattr(current_async, self._async_marker, False):
            original_async = current_async

            @wraps(original_async)
            async def async_wrapper(chain, metainfo, *args, **kwargs):
                token = context.set(metainfo)
                try:
                    return await original_async(chain, metainfo, *args, **kwargs)
                finally:
                    context.reset(token)

            setattr(async_wrapper, self._async_marker, True)
            setattr(async_wrapper, "_tmdb_enhancer_original", original_async)
            setattr(async_wrapper, "_tmdb_enhancer_owner", self._owner_token)
            setattr(MediaChain, async_name, async_wrapper)
        else:
            setattr(current_async, "_tmdb_enhancer_owner", self._owner_token)

        self.compatible = True
        self.message = "已捕获 MP 识别词处理后的媒体元数据"
        return True

    def uninstall(self) -> None:
        """仅恢复由本适配器安装的包装，不触碰 MoviePilot 文件。"""
        try:
            from app.chain.media import MediaChain
        except Exception:
            return
        for method_name, marker in (
            ("_recognize_with_fallback_by_meta", self._sync_marker),
            ("_async_recognize_with_fallback_by_meta", self._async_marker),
        ):
            current = getattr(MediaChain, method_name, None)
            original = getattr(current, "_tmdb_enhancer_original", None)
            owner = getattr(current, "_tmdb_enhancer_owner", None)
            if (
                    current and getattr(current, marker, False) and original
                    and owner is self._owner_token
            ):
                setattr(MediaChain, method_name, original)
        self.compatible = False
        self.message = "运行时适配器已卸载"

    @staticmethod
    def current_meta() -> Optional[Any]:
        """返回当前识别调用中的 MetaBase。"""
        try:
            from app.chain.media import MediaChain
        except Exception:
            return None
        context = getattr(MediaChain, MoviePilotRuntimeAdapter._context_attr, None)
        return context.get() if isinstance(context, ContextVar) else None
