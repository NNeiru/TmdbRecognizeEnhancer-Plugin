<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { unwrapResponse } from '../utils'
import ModuleHeader from './ModuleHeader.vue'

const props = defineProps({ api: { type: Object, default: () => ({}) }, pluginId: { type: String, default: 'TmdbRecognizeEnhancer' } })
const loading = ref(false)
const error = ref('')
const server = ref(null)
const browser = ref(null)
const samples = ref([])
const autoRefresh = ref(true)
const intervalSeconds = ref(3)
let timer = null
const pluginBase = computed(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`)
const intervalItems = [2, 3, 5, 10].map(value => ({ title: `${value} 秒`, value }))

function mb(value) { return value == null ? '不可用' : `${value} MB` }
function rate(value) { return value == null ? '不可用' : `${value} KB/s` }
function duration(value) {
  if (value == null) return '不可用'
  const seconds = Number(value) || 0
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor(seconds % 86400 / 3600)
  const minutes = Math.floor(seconds % 3600 / 60)
  return days ? `${days} 天 ${hours} 小时` : hours ? `${hours} 小时 ${minutes} 分` : `${minutes} 分钟`
}
function explainError(err) {
  const status = err?.response?.status || err?.status
  if (status === 404 || String(err?.message || '').includes('404')) return '后端仍是旧插件实例，尚未注册诊断接口；请重载插件或重启一次 MP 容器。'
  return err?.message || '性能采样失败'
}

async function sampleBrowser() {
  const started = performance.now()
  let frames = 0
  await new Promise(resolve => {
    const end = started + 300
    const tick = now => { frames += 1; if (now < end) requestAnimationFrame(tick); else resolve() }
    requestAnimationFrame(tick)
  })
  const elapsed = Math.max(performance.now() - started, 1)
  const memory = performance.memory
  return {
    fps: Math.min(120, Math.round(frames * 1000 / elapsed)),
    dom_nodes: document.getElementsByTagName('*').length,
    js_heap_mb: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024 * 10) / 10 : null,
    heap_limit_mb: memory ? Math.round(memory.jsHeapSizeLimit / 1024 / 1024) : null,
  }
}

function addSample(serverResult, browserResult) {
  samples.value = [...samples.value, {
    time: Date.now(),
    process_cpu: Number(serverResult.process?.cpu_percent || 0),
    system_cpu: Number(serverResult.system?.cpu_percent || 0),
    rss: Number(serverResult.process?.rss_mb || 0),
    api_rtt: Number(browserResult.api_rtt_ms || 0),
    fps: Number(browserResult.fps || 0),
  }].slice(-30)
}

async function sample() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  const requestStart = performance.now()
  try {
    const [response, browserResult] = await Promise.all([
      props.api.get(`${pluginBase.value}/diagnostics`), sampleBrowser(),
    ])
    const serverResult = unwrapResponse(response)
    const completedBrowser = { ...browserResult, api_rtt_ms: Math.round((performance.now() - requestStart) * 10) / 10 }
    server.value = serverResult
    browser.value = completedBrowser
    addSample(serverResult, completedBrowser)
  } catch (err) { error.value = explainError(err) }
  finally { loading.value = false }
}

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
}
function syncTimer() {
  stopTimer()
  if (!autoRefresh.value) return
  sample()
  timer = setInterval(sample, Math.max(2, Number(intervalSeconds.value) || 3) * 1000)
}

watch([autoRefresh, intervalSeconds], syncTimer)
onMounted(syncTimer)
onBeforeUnmount(stopTimer)

function sparkline(key) {
  const values = samples.value.map(item => Number(item[key])).filter(Number.isFinite)
  if (!values.length) return ''
  const width = 180
  const height = 42
  const min = Math.min(...values)
  const max = Math.max(...values)
  const spread = Math.max(max - min, 1)
  return values.map((value, index) => {
    const x = values.length === 1 ? width : index * width / (values.length - 1)
    const y = height - 3 - (value - min) / spread * (height - 6)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

const browserFindings = computed(() => {
  const result = []
  if (browser.value?.fps != null && browser.value.fps < 30) result.push({ level: 'warning', title: '当前管理页面帧率偏低', detail: `短时约 ${browser.value.fps} FPS，卡顿更偏向浏览器渲染侧。` })
  if (browser.value?.api_rtt_ms >= 1200) result.push({ level: 'warning', title: '插件接口响应偏慢', detail: `本次往返约 ${browser.value.api_rtt_ms} ms，需结合 MP CPU、I/O 和季度扫描判断。` })
  if (browser.value?.dom_nodes >= 8000) result.push({ level: 'warning', title: '页面 DOM 节点较多', detail: `当前约 ${browser.value.dom_nodes} 个节点，超长列表可能造成滚动卡顿。` })
  return result
})
const findings = computed(() => {
  const browserItems = browserFindings.value
  const serverItems = server.value?.findings || []
  const filteredServer = browserItems.length
    ? serverItems.filter(item => !(item.level === 'success' && item.title?.includes('未发现明显')))
    : serverItems
  return [...filteredServer, ...browserItems]
})
</script>

<template>
  <div>
    <ModuleHeader icon="mdi-speedometer" title="性能与占用诊断" subtitle="区分 MoviePilot 后端负载、插件任务和当前浏览器页面卡顿；最多保留 30 个页面内采样点。" color="secondary">
      <template #actions><VBtn color="primary" prepend-icon="mdi-refresh" :loading="loading" @click="sample">立即采样</VBtn></template>
      <template #controls>
        <VSwitch v-model="autoRefresh" color="success" label="实时刷新" hide-details />
        <VSelect v-model="intervalSeconds" :items="intervalItems" item-title="title" item-value="value" density="compact" hide-details class="interval-select" :disabled="!autoRefresh" />
      </template>
    </ModuleHeader>
    <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</VAlert>
    <VAlert type="info" variant="tonal" density="compact" class="mb-4">实时刷新只在本页打开时工作，离开页面即停止；推荐 3–5 秒间隔。进程 CPU 需至少两个采样点才有参考价值。</VAlert>
    <VAlert v-if="server?.errors?.length" type="info" variant="tonal" density="compact" class="mb-4">{{ server.errors.join('；') }}。已自动改用系统原生兼容采样，个别指标可能显示不可用。</VAlert>

    <div v-if="server" class="live-strip mb-4">
      <div class="live-metric"><span>MP CPU</span><strong>{{ server.process?.cpu_percent ?? '—' }}%</strong><svg viewBox="0 0 180 42" preserveAspectRatio="none"><polyline :points="sparkline('process_cpu')" /></svg></div>
      <div class="live-metric"><span>常驻内存</span><strong>{{ mb(server.process?.rss_mb) }}</strong><svg viewBox="0 0 180 42" preserveAspectRatio="none"><polyline :points="sparkline('rss')" /></svg></div>
      <div class="live-metric"><span>接口往返</span><strong>{{ browser?.api_rtt_ms ?? '—' }} ms</strong><svg viewBox="0 0 180 42" preserveAspectRatio="none"><polyline :points="sparkline('api_rtt')" /></svg></div>
      <div class="live-metric"><span>页面帧率</span><strong>{{ browser?.fps ?? '—' }} FPS</strong><svg viewBox="0 0 180 42" preserveAspectRatio="none"><polyline :points="sparkline('fps')" /></svg></div>
    </div>

    <div v-if="server" class="diagnostic-grid mb-4">
      <VCard variant="outlined"><VCardItem><VCardTitle>MoviePilot 进程</VCardTitle><VCardSubtitle>PID {{ server.process?.pid }} · 已运行 {{ duration(server.process?.uptime_seconds) }}</VCardSubtitle></VCardItem><VCardText class="metric-list"><div><span>CPU / 内存占比</span><strong>{{ server.process?.cpu_percent ?? '—' }}% / {{ server.process?.memory_percent ?? '—' }}%</strong></div><div><span>RSS / 虚拟内存</span><strong>{{ mb(server.process?.rss_mb) }} / {{ mb(server.process?.vms_mb) }}</strong></div><div><span>线程 / 文件描述符</span><strong>{{ server.process?.threads ?? '—' }} / {{ server.process?.file_descriptors ?? '—' }}</strong></div><div><span>读取 / 写入</span><strong>{{ rate(server.process?.io_read_kbps) }} / {{ rate(server.process?.io_write_kbps) }}</strong></div></VCardText></VCard>
      <VCard variant="outlined"><VCardItem><VCardTitle>服务器资源</VCardTitle><VCardSubtitle>{{ server.system?.cpu_count }} 逻辑 CPU · {{ server.system?.platform }}</VCardSubtitle></VCardItem><VCardText class="metric-list"><div><span>整机 CPU / Load</span><strong>{{ server.system?.cpu_percent ?? '—' }}% / {{ server.system?.load_average?.join(' / ') || '—' }}</strong></div><div><span>内存 / Swap</span><strong>{{ server.system?.memory_percent ?? '—' }}% / {{ server.system?.swap_percent ?? '—' }}%</strong></div><div><span>可用内存</span><strong>{{ mb(server.system?.memory_available_mb) }}</strong></div><div><span>磁盘使用 / 剩余</span><strong>{{ server.system?.disk_percent ?? '—' }}% / {{ mb(server.system?.disk_free_mb) }}</strong></div></VCardText></VCard>
      <VCard variant="outlined"><VCardItem><VCardTitle>插件运行量</VCardTitle><VCardSubtitle>服务端采样 {{ server.sampling_ms }} ms · 序号 {{ server.sequence }}</VCardSubtitle></VCardItem><VCardText class="metric-list"><div><span>季度扫描 / 看板条目</span><strong>{{ server.plugin?.active_catalog_scans || 0 }} / {{ server.plugin?.season_catalog_items || 0 }}</strong></div><div><span>集数规则 / 字段覆盖</span><strong>{{ server.plugin?.episode_rules || 0 }} / {{ server.plugin?.compiled_rules || 0 }}</strong></div><div><span>自定义字段 / 命名规则</span><strong>{{ server.plugin?.custom_rename_fields || 0 }} / {{ (server.plugin?.rename_mapping_rules || 0) + (server.plugin?.release_group_rules || 0) }}</strong></div><div><span>外部缓存 / 模块日志</span><strong>{{ server.plugin?.web_cache_entries || 0 }} / {{ server.plugin?.history_records || 0 }}</strong></div></VCardText></VCard>
      <VCard variant="outlined"><VCardItem><VCardTitle>当前浏览器页面</VCardTitle><VCardSubtitle>{{ samples.length }} / 30 个趋势采样点</VCardSubtitle></VCardItem><VCardText class="metric-list"><div><span>短时帧率</span><strong>{{ browser?.fps ?? '—' }} FPS</strong></div><div><span>DOM 节点</span><strong>{{ browser?.dom_nodes ?? '—' }}</strong></div><div><span>JS 堆 / 上限</span><strong>{{ browser?.js_heap_mb == null ? '浏览器不提供' : `${mb(browser.js_heap_mb)} / ${mb(browser.heap_limit_mb)}` }}</strong></div><div><span>接口往返</span><strong>{{ browser?.api_rtt_ms ?? '—' }} ms</strong></div></VCardText></VCard>
    </div>

    <div v-if="findings.length" class="finding-list"><VAlert v-for="(item, index) in findings" :key="index" :type="item.level" variant="tonal" density="compact"><strong>{{ item.title }}</strong><div>{{ item.detail }}</div></VAlert></div>
    <div v-else class="empty-state"><VProgressCircular v-if="loading" indeterminate color="primary" /><VIcon v-else icon="mdi-gauge-empty" size="52" /><div class="text-h6 mt-3">{{ loading ? '正在采样' : '尚无诊断结果' }}</div></div>
  </div>
</template>

<style scoped>
.interval-select { flex: 0 0 110px; }
.live-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.live-metric { min-width: 0; padding: 14px 16px 9px; border: 1px solid rgba(var(--v-theme-on-surface), .1); border-radius: 14px; background: rgba(var(--v-theme-surface-variant), .16); }
.live-metric span { display: block; color: rgba(var(--v-theme-on-surface), .62); font-size: .78rem; }
.live-metric strong { display: block; margin-top: 2px; font-size: 1.15rem; }
.live-metric svg { display: block; width: 100%; height: 34px; margin-top: 4px; overflow: visible; }
.live-metric polyline { fill: none; stroke: rgb(var(--v-theme-primary)); stroke-width: 2.5; vector-effect: non-scaling-stroke; }
.diagnostic-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.metric-list { display: grid; gap: 10px; }
.metric-list > div { display: flex; justify-content: space-between; gap: 16px; color: rgba(var(--v-theme-on-surface), .68); }
.metric-list strong { color: rgb(var(--v-theme-on-surface)); text-align: right; }
.finding-list { display: grid; gap: 10px; }
.empty-state { min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(var(--v-theme-on-surface), .5); }
@media (max-width: 900px) { .live-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 760px) { .diagnostic-grid, .live-strip { grid-template-columns: 1fr; } .interval-select { flex-basis: 95px; } }
</style>
