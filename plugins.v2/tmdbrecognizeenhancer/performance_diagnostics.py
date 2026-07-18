"""轻量采样 MoviePilot 进程状态；刷新节奏完全由前端诊断页控制。"""

from __future__ import annotations

import os
import platform
import shutil
import threading
import time
from pathlib import Path
from typing import Any, Dict, List


class PerformanceDiagnostics:
    """生成一次性性能快照和保守诊断提示。"""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._last_process_cpu = None
        self._last_process_time = None
        self._last_wall_time = None
        self._last_io_read = None
        self._last_io_write = None
        self._last_system_total = None
        self._last_system_idle = None
        self._sequence = 0

    def snapshot(self, plugin_stats: Dict[str, Any]) -> Dict[str, Any]:
        started = time.perf_counter()
        process, system, errors = self._sample()
        findings = self._findings(process, system, plugin_stats)
        with self._lock:
            self._sequence += 1
            sequence = self._sequence
        return {
            "sequence": sequence,
            "sampled_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "sampling_ms": round((time.perf_counter() - started) * 1000, 2),
            "process": process,
            "system": system,
            "plugin": plugin_stats,
            "findings": findings,
            "errors": errors,
            "mode": "on_demand",
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
                try:
                    io = proc.io_counters()
                    io_read = int(io.read_bytes)
                    io_write = int(io.write_bytes)
                except Exception:
                    io_read = io_write = None
                try:
                    context_switches = proc.num_ctx_switches()
                    voluntary_switches = int(context_switches.voluntary)
                    involuntary_switches = int(context_switches.involuntary)
                except Exception:
                    voluntary_switches = involuntary_switches = None
                try:
                    open_files = len(proc.open_files())
                except Exception:
                    open_files = None
                try:
                    file_descriptors = proc.num_fds()
                except Exception:
                    file_descriptors = None
                with self._lock:
                    process_cpu = 0.0
                    io_read_rate = io_write_rate = 0.0
                    if self._last_process_time is not None and self._last_wall_time is not None:
                        elapsed = max(wall_now - self._last_wall_time, 0.001)
                        process_cpu = max(0.0, (process_time - self._last_process_time) / elapsed * 100)
                        if io_read is not None and self._last_io_read is not None:
                            io_read_rate = max(0.0, (io_read - self._last_io_read) / elapsed)
                        if io_write is not None and self._last_io_write is not None:
                            io_write_rate = max(0.0, (io_write - self._last_io_write) / elapsed)
                    self._last_process_time = process_time
                    self._last_wall_time = wall_now
                    self._last_io_read = io_read
                    self._last_io_write = io_write
                process = {
                    "pid": proc.pid,
                    "cpu_percent": round(process_cpu, 1),
                    "rss_mb": round(memory.rss / 1024 / 1024, 1),
                    "vms_mb": round(memory.vms / 1024 / 1024, 1),
                    "memory_percent": round(proc.memory_percent(), 2),
                    "threads": proc.num_threads(),
                    "open_files": open_files,
                    "file_descriptors": file_descriptors,
                    "io_read_kbps": round(io_read_rate / 1024, 1),
                    "io_write_kbps": round(io_write_rate / 1024, 1),
                    "context_switches": {
                        "voluntary": voluntary_switches,
                        "involuntary": involuntary_switches,
                    },
                    "status": proc.status(),
                    "uptime_seconds": round(time.time() - proc.create_time()),
                }
            virtual = psutil.virtual_memory()
            swap = psutil.swap_memory()
            try:
                disk = psutil.disk_usage("/")
                disk_percent = round(disk.percent, 1)
                disk_free_mb = round(disk.free / 1024 / 1024, 1)
            except Exception:
                disk_percent = disk_free_mb = None
            system = {
                "cpu_percent": round(psutil.cpu_percent(interval=None), 1),
                "cpu_count": psutil.cpu_count() or 1,
                "memory_percent": round(virtual.percent, 1),
                "memory_available_mb": round(virtual.available / 1024 / 1024, 1),
                "swap_percent": round(swap.percent, 1),
                "swap_used_mb": round(swap.used / 1024 / 1024, 1),
                "disk_percent": disk_percent,
                "disk_free_mb": disk_free_mb,
                "load_average": list(os.getloadavg()) if hasattr(os, "getloadavg") else [],
                "platform": platform.platform(),
            }
            return process, system, errors
        except Exception as err:
            errors.append(f"psutil 采样不可用：{err}")

        now = time.perf_counter()
        cpu_times = os.times()
        process_time = cpu_times.user + cpu_times.system
        status_values = self._read_proc_key_values("/proc/self/status")
        mem_values = self._read_proc_key_values("/proc/meminfo")
        io_values = self._read_proc_key_values("/proc/self/io")
        io_read = self._proc_number(io_values.get("read_bytes"))
        io_write = self._proc_number(io_values.get("write_bytes"))
        with self._lock:
            cpu_percent = 0.0
            io_read_rate = io_write_rate = 0.0
            if self._last_process_time is not None and self._last_wall_time is not None:
                elapsed = max(now - self._last_wall_time, 0.001)
                cpu_percent = max(0.0, (process_time - self._last_process_time) / elapsed * 100)
                if io_read is not None and self._last_io_read is not None:
                    io_read_rate = max(0.0, (io_read - self._last_io_read) / elapsed)
                if io_write is not None and self._last_io_write is not None:
                    io_write_rate = max(0.0, (io_write - self._last_io_write) / elapsed)
            self._last_process_time = process_time
            self._last_wall_time = now
            self._last_io_read = io_read
            self._last_io_write = io_write
        rss_mb = self._proc_kb_to_mb(status_values.get("VmRSS"))
        vms_mb = self._proc_kb_to_mb(status_values.get("VmSize"))
        memory_total_mb = self._proc_kb_to_mb(mem_values.get("MemTotal"))
        memory_available_mb = self._proc_kb_to_mb(mem_values.get("MemAvailable"))
        memory_percent = (
            round((memory_total_mb - memory_available_mb) * 100 / memory_total_mb, 1)
            if memory_total_mb and memory_available_mb is not None else None
        )
        process_memory_percent = (
            round(rss_mb * 100 / memory_total_mb, 2)
            if rss_mb is not None and memory_total_mb else None
        )
        swap_total_mb = self._proc_kb_to_mb(mem_values.get("SwapTotal"))
        swap_free_mb = self._proc_kb_to_mb(mem_values.get("SwapFree"))
        swap_used_mb = (
            max(0.0, swap_total_mb - (swap_free_mb or 0.0))
            if swap_total_mb is not None else None
        )
        swap_percent = (
            round(swap_used_mb * 100 / swap_total_mb, 1)
            if swap_total_mb and swap_used_mb is not None else 0.0
        )
        system_cpu = self._fallback_system_cpu_percent()
        try:
            disk = shutil.disk_usage("/")
            disk_percent = round((disk.total - disk.free) * 100 / disk.total, 1) if disk.total else None
            disk_free_mb = round(disk.free / 1024 / 1024, 1)
        except Exception:
            disk_percent = disk_free_mb = None
        try:
            file_descriptors = len(list(Path("/proc/self/fd").iterdir()))
        except Exception:
            file_descriptors = None
        process = {
            "pid": os.getpid(), "cpu_percent": round(cpu_percent, 1),
            "rss_mb": rss_mb, "vms_mb": vms_mb,
            "memory_percent": process_memory_percent,
            "threads": self._proc_number(status_values.get("Threads")) or threading.active_count(),
            "open_files": None, "file_descriptors": file_descriptors,
            "io_read_kbps": round(io_read_rate / 1024, 1),
            "io_write_kbps": round(io_write_rate / 1024, 1),
            "context_switches": {
                "voluntary": self._proc_number(status_values.get("voluntary_ctxt_switches")),
                "involuntary": self._proc_number(status_values.get("nonvoluntary_ctxt_switches")),
            },
            "status": status_values.get("State", "unknown"),
            "uptime_seconds": self._fallback_process_uptime(),
        }
        system = {
            "cpu_percent": system_cpu, "cpu_count": os.cpu_count() or 1,
            "memory_percent": memory_percent,
            "memory_available_mb": memory_available_mb,
            "swap_percent": swap_percent,
            "swap_used_mb": round(swap_used_mb, 1) if swap_used_mb is not None else None,
            "disk_percent": disk_percent,
            "disk_free_mb": disk_free_mb,
            "load_average": list(os.getloadavg()) if hasattr(os, "getloadavg") else [],
            "platform": platform.platform(),
        }
        return process, system, errors

    @staticmethod
    def _read_proc_key_values(path: str) -> Dict[str, str]:
        try:
            result: Dict[str, str] = {}
            for line in Path(path).read_text(encoding="utf-8", errors="replace").splitlines():
                if ":" not in line:
                    continue
                key, value = line.split(":", 1)
                result[key.strip()] = value.strip()
            return result
        except Exception:
            return {}

    @staticmethod
    def _proc_number(value: Any):
        if value is None:
            return None
        try:
            return int(str(value).split()[0])
        except (TypeError, ValueError, IndexError):
            return None

    @classmethod
    def _proc_kb_to_mb(cls, value: Any):
        number = cls._proc_number(value)
        return round(number / 1024, 1) if number is not None else None

    def _fallback_system_cpu_percent(self):
        try:
            fields = Path("/proc/stat").read_text(encoding="utf-8").splitlines()[0].split()[1:]
            values = [int(value) for value in fields]
            total = sum(values)
            idle = values[3] + (values[4] if len(values) > 4 else 0)
            with self._lock:
                percent = 0.0
                if self._last_system_total is not None and total > self._last_system_total:
                    total_delta = total - self._last_system_total
                    idle_delta = idle - (self._last_system_idle or 0)
                    percent = max(0.0, min(100.0, (total_delta - idle_delta) * 100 / total_delta))
                self._last_system_total = total
                self._last_system_idle = idle
            return round(percent, 1)
        except Exception:
            return None

    @staticmethod
    def _fallback_process_uptime():
        try:
            stat_fields = Path("/proc/self/stat").read_text(encoding="utf-8").split()
            start_ticks = int(stat_fields[21])
            clock_ticks = os.sysconf("SC_CLK_TCK")
            system_uptime = float(Path("/proc/uptime").read_text(encoding="utf-8").split()[0])
            return max(0, round(system_uptime - start_ticks / clock_ticks))
        except Exception:
            return None

    @staticmethod
    def _findings(process: Dict[str, Any], system: Dict[str, Any], plugin: Dict[str, Any]) -> List[Dict[str, str]]:
        findings: List[Dict[str, str]] = []
        proc_cpu = float(process.get("cpu_percent") or 0)
        sys_cpu = float(system.get("cpu_percent") or 0)
        memory = float(system.get("memory_percent") or 0)
        active_scans = int(plugin.get("active_catalog_scans") or 0)
        threads = int(process.get("threads") or 0)
        rss_mb = float(process.get("rss_mb") or 0)
        swap = float(system.get("swap_percent") or 0)
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
        if swap >= 30:
            findings.append({"level": "warning", "title": "服务器正在较多使用交换空间", "detail": f"Swap 使用率约 {swap}%，可能造成明显的间歇卡顿。"})
        if rss_mb >= 2048:
            findings.append({"level": "warning", "title": "MoviePilot 常驻内存较大", "detail": f"当前进程 RSS 约 {rss_mb:.0f} MB，建议结合趋势确认是否持续增长。"})
        if threads >= 120:
            findings.append({"level": "warning", "title": "MoviePilot 线程数较多", "detail": f"当前约 {threads} 个线程，需结合正在运行的扫描和下载任务判断。"})
        if active_scans:
            findings.append({"level": "info", "title": "季度 TMDB 扫描正在运行", "detail": f"当前有 {active_scans} 个季度扫描任务，网络请求和候选详情读取会增加负载。"})
        if int(plugin.get("web_cache_entries") or 0) > 500:
            findings.append({"level": "warning", "title": "外部搜索缓存较大", "detail": "可重启插件释放内存缓存；这不会删除维护规则。"})
        if not findings:
            findings.append({"level": "success", "title": "本次采样未发现明显服务端瓶颈", "detail": "若页面仍卡，请同时查看浏览器指标和请求耗时。"})
        return findings
