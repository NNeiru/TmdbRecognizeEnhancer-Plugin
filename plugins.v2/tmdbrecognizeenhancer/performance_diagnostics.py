"""按需采样 MoviePilot 进程状态，不启动后台监控线程。"""

from __future__ import annotations

import os
import platform
import threading
import time
from typing import Any, Dict, List


class PerformanceDiagnostics:
    """生成一次性性能快照和保守诊断提示。"""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._last_process_cpu = None
        self._last_process_time = None
        self._last_wall_time = None

    def snapshot(self, plugin_stats: Dict[str, Any]) -> Dict[str, Any]:
        started = time.perf_counter()
        process, system, errors = self._sample()
        findings = self._findings(process, system, plugin_stats)
        return {
            "sampled_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "sampling_ms": round((time.perf_counter() - started) * 1000, 2),
            "process": process,
            "system": system,
            "plugin": plugin_stats,
            "findings": findings,
            "errors": errors,
            "mode": "manual",
        }

    def _sample(self):
        errors: List[str] = []
        try:
            import psutil
            proc = psutil.Process(os.getpid())
            wall_now = time.perf_counter()
            with proc.oneshot():
                memory = proc.memory_info()
                cpu_times = proc.cpu_times()
                process_time = cpu_times.user + cpu_times.system
                with self._lock:
                    process_cpu = 0.0
                    if self._last_process_time is not None and self._last_wall_time is not None:
                        elapsed = max(wall_now - self._last_wall_time, 0.001)
                        process_cpu = max(0.0, (process_time - self._last_process_time) / elapsed * 100)
                    self._last_process_time = process_time
                    self._last_wall_time = wall_now
                process = {
                    "pid": proc.pid,
                    "cpu_percent": round(process_cpu, 1),
                    "rss_mb": round(memory.rss / 1024 / 1024, 1),
                    "vms_mb": round(memory.vms / 1024 / 1024, 1),
                    "memory_percent": round(proc.memory_percent(), 2),
                    "threads": proc.num_threads(),
                    "status": proc.status(),
                    "uptime_seconds": round(time.time() - proc.create_time()),
                }
            virtual = psutil.virtual_memory()
            system = {
                "cpu_percent": round(psutil.cpu_percent(interval=None), 1),
                "cpu_count": psutil.cpu_count() or 1,
                "memory_percent": round(virtual.percent, 1),
                "memory_available_mb": round(virtual.available / 1024 / 1024, 1),
                "load_average": list(os.getloadavg()) if hasattr(os, "getloadavg") else [],
                "platform": platform.platform(),
            }
            return process, system, errors
        except Exception as err:
            errors.append(f"psutil 采样不可用：{err}")

        now = time.perf_counter()
        cpu_times = os.times()
        process_time = cpu_times.user + cpu_times.system
        with self._lock:
            cpu_percent = 0.0
            if self._last_process_time is not None and self._last_wall_time is not None:
                elapsed = max(now - self._last_wall_time, 0.001)
                cpu_percent = max(0.0, (process_time - self._last_process_time) / elapsed * 100)
            self._last_process_time = process_time
            self._last_wall_time = now
        process = {
            "pid": os.getpid(), "cpu_percent": round(cpu_percent, 1),
            "rss_mb": None, "vms_mb": None, "memory_percent": None,
            "threads": threading.active_count(), "status": "unknown",
        }
        system = {
            "cpu_percent": None, "cpu_count": os.cpu_count() or 1,
            "memory_percent": None,
            "load_average": list(os.getloadavg()) if hasattr(os, "getloadavg") else [],
            "platform": platform.platform(),
        }
        return process, system, errors

    @staticmethod
    def _findings(process: Dict[str, Any], system: Dict[str, Any], plugin: Dict[str, Any]) -> List[Dict[str, str]]:
        findings: List[Dict[str, str]] = []
        proc_cpu = float(process.get("cpu_percent") or 0)
        sys_cpu = float(system.get("cpu_percent") or 0)
        memory = float(system.get("memory_percent") or 0)
        active_scans = int(plugin.get("active_catalog_scans") or 0)
        if proc_cpu >= 80:
            findings.append({"level": "error", "title": "MoviePilot 进程 CPU 很高", "detail": f"当前进程约 {proc_cpu}% CPU。"})
        elif proc_cpu >= 40:
            findings.append({"level": "warning", "title": "MoviePilot 进程 CPU 偏高", "detail": f"当前进程约 {proc_cpu}% CPU。"})
        if sys_cpu >= 90:
            findings.append({"level": "error", "title": "服务器 CPU 接近满载", "detail": f"整机 CPU 约 {sys_cpu}%，卡顿不一定由本插件单独造成。"})
        if memory >= 90:
            findings.append({"level": "error", "title": "服务器内存紧张", "detail": f"内存使用率约 {memory}%，可能触发交换和界面超时。"})
        elif memory >= 80:
            findings.append({"level": "warning", "title": "服务器内存偏高", "detail": f"内存使用率约 {memory}%。"})
        if active_scans:
            findings.append({"level": "info", "title": "季度 TMDB 扫描正在运行", "detail": f"当前有 {active_scans} 个季度扫描任务，网络请求和候选详情读取会增加负载。"})
        if int(plugin.get("web_cache_entries") or 0) > 500:
            findings.append({"level": "warning", "title": "外部搜索缓存较大", "detail": "可重启插件释放内存缓存；这不会删除维护规则。"})
        if not findings:
            findings.append({"level": "success", "title": "本次采样未发现明显服务端瓶颈", "detail": "若页面仍卡，请同时查看浏览器指标和请求耗时。"})
        return findings
