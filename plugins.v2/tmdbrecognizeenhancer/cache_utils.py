"""Small, dependency-free cache primitives used by runtime services."""

from __future__ import annotations

import threading
import time
from collections import OrderedDict
from typing import Callable, Generic, Iterator, MutableMapping, Optional, Tuple, TypeVar


KeyT = TypeVar("KeyT")
ValueT = TypeVar("ValueT")


class BoundedTTLCache(MutableMapping[KeyT, ValueT], Generic[KeyT, ValueT]):
    """Thread-safe LRU cache with a fixed capacity and idle TTL.

    The cache deliberately does not copy values. Callers that expose mutable
    dictionaries or lists should keep using ``deepcopy`` at their API boundary.
    """

    def __init__(
            self,
            max_size: int = 256,
            ttl_seconds: float = 3600,
            *,
            clock: Optional[Callable[[], float]] = None,
    ) -> None:
        self._max_size = max(1, int(max_size))
        self._ttl_seconds = max(0.0, float(ttl_seconds))
        self._clock = clock or time.monotonic
        self._items: "OrderedDict[KeyT, Tuple[float, ValueT]]" = OrderedDict()
        self._lock = threading.RLock()

    def __getitem__(self, key: KeyT) -> ValueT:
        with self._lock:
            item = self._items.get(key)
            if item is None:
                raise KeyError(key)
            last_access, value = item
            now = self._clock()
            if self._expired(last_access, now):
                self._items.pop(key, None)
                raise KeyError(key)
            self._items[key] = (now, value)
            self._items.move_to_end(key)
            return value

    def __setitem__(self, key: KeyT, value: ValueT) -> None:
        with self._lock:
            self._items[key] = (self._clock(), value)
            self._items.move_to_end(key)
            self._evict_expired_locked()
            while len(self._items) > self._max_size:
                self._items.popitem(last=False)

    def __delitem__(self, key: KeyT) -> None:
        with self._lock:
            del self._items[key]

    def __iter__(self) -> Iterator[KeyT]:
        with self._lock:
            self._evict_expired_locked()
            return iter(tuple(self._items))

    def __len__(self) -> int:
        with self._lock:
            self._evict_expired_locked()
            return len(self._items)

    def __contains__(self, key: object) -> bool:
        try:
            self[key]  # type: ignore[index]
            return True
        except KeyError:
            return False

    def clear(self) -> None:
        with self._lock:
            self._items.clear()

    def _evict_expired_locked(self) -> None:
        if self._ttl_seconds <= 0:
            return
        now = self._clock()
        expired = [
            key for key, (last_access, _) in self._items.items()
            if self._expired(last_access, now)
        ]
        for key in expired:
            self._items.pop(key, None)

    def _expired(self, last_access: float, now: float) -> bool:
        return self._ttl_seconds > 0 and now - last_access >= self._ttl_seconds
