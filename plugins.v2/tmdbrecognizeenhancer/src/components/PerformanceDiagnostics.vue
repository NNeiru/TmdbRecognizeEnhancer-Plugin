<script setup>
import { computed, ref } from 'vue'
import { unwrapResponse } from '../utils'

const props = defineProps({ api: { type: Object, default: () => ({}) }, pluginId: { type: String, default: 'TmdbRecognizeEnhancer' } })
const loading = ref(false)
const error = ref('')
const server = ref(null)
const browser = ref(null)
const pluginBase = computed(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`)

function mb(value) { return value == null ? '不可用' : `${value} MB` }
function explainError(err) {
  const status = err?.response?.status || err?.status
  if (status === 404 || String(err?.message || '').includes('404')) return '后端仍是旧插件实例，尚未注册诊断接口；请重载插件或重启一次 MP 容器。'
  return err?.message || '性能采样失败'
}

async function sampleBrowser() {
  const started = performance.now()
  let frames = 0
  await new Promise(resolve => {
    const end = started + 500
    const tick = now => { frames += 1; if (now < end) requestAnimationFrame(tick); else resolve() }
    requestAnimationFrame(tick)
  })
  const memory = performance.memory
  return {
    fps: Math.min(120, Math.round(frames * 2)),
    dom_nodes: document.getElementsByTagName('*').length,
    js_heap_mb: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024 * 10) / 10 : null,
    heap_limit_mb: memory ? Math.round(memory.jsHeapSizeLimit / 1024 / 1024) : null,
  }
}

async function sample() {
  loading.value = true
  error.value = ''
  const requestStart = performance.now()
  try {
    const [response, browserResult] = await Promise.all([
      props.api.get(`${pluginBase.value}/diagnostics`), sampleBrowser(),
    ])
    server.value = unwrapResponse(response)
    browser.value = { ...browserResult, api_rtt_ms: Math.round((performance.now() - requestStart) * 10) / 10 }
  } catch (err) { error.value = explainError(err) }
  finally { loading.value = false }
}
</script>

<template>
  <div>
    <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</VAlert>
    <div class="d-flex align-center flex-wrap ga-3 mb-5"><div><div class="text-h6">性能与占用诊断</div><div class="text-body-2 text-medium-emphasis">手动采样 MP 进程、服务器、插件缓存和当前浏览器页面；默认不轮询、不驻留监控。</div></div><VSpacer /><VBtn color="primary" prepend-icon="mdi-speedometer" :loading="loading" @click="sample">立即采样</VBtn></div>
    <VAlert type="info" variant="tonal" density="compact" class="mb-4">CPU 百分比是瞬时值，连续采样两次更有参考意义。该页能区分“MP 后端繁忙”和“浏览器页面渲染卡顿”，但不能替代系统级火焰图。</VAlert>
    <div v-if="server" class="diagnostic-grid mb-4">
      <VCard variant="outlined"><VCardItem><VCardTitle>MoviePilot 进程</VCardTitle><VCardSubtitle>PID {{ server.process?.pid }} · {{ server.process?.status }}</VCardSubtitle></VCardItem><VCardText class="metric-list"><div><span>CPU</span><strong>{{ server.process?.cpu_percent ?? '—' }}%</strong></div><div><span>常驻内存</span><strong>{{ mb(server.process?.rss_mb) }}</strong></div><div><span>内存占比</span><strong>{{ server.process?.memory_percent ?? '—' }}%</strong></div><div><span>线程</span><strong>{{ server.process?.threads ?? '—' }}</strong></div></VCardText></VCard>
      <VCard variant="outlined"><VCardItem><VCardTitle>服务器</VCardTitle><VCardSubtitle>{{ server.system?.cpu_count }} 逻辑 CPU</VCardSubtitle></VCardItem><VCardText class="metric-list"><div><span>整机 CPU</span><strong>{{ server.system?.cpu_percent ?? '—' }}%</strong></div><div><span>内存使用</span><strong>{{ server.system?.memory_percent ?? '—' }}%</strong></div><div><span>可用内存</span><strong>{{ mb(server.system?.memory_available_mb) }}</strong></div><div><span>Load Average</span><strong>{{ server.system?.load_average?.join(' / ') || '不可用' }}</strong></div></VCardText></VCard>
      <VCard variant="outlined"><VCardItem><VCardTitle>插件运行量</VCardTitle><VCardSubtitle>采样耗时 {{ server.sampling_ms }} ms</VCardSubtitle></VCardItem><VCardText class="metric-list"><div><span>季度扫描</span><strong>{{ server.plugin?.active_catalog_scans || 0 }}</strong></div><div><span>维护规则</span><strong>{{ server.plugin?.episode_rules || 0 }}</strong></div><div><span>识别字段覆盖</span><strong>{{ server.plugin?.compiled_rules || 0 }}</strong></div><div><span>外部搜索缓存</span><strong>{{ server.plugin?.web_cache_entries || 0 }}</strong></div></VCardText></VCard>
      <VCard variant="outlined"><VCardItem><VCardTitle>浏览器页面</VCardTitle><VCardSubtitle>仅当前管理页面</VCardSubtitle></VCardItem><VCardText class="metric-list"><div><span>短时帧率</span><strong>{{ browser?.fps ?? '—' }} FPS</strong></div><div><span>DOM 节点</span><strong>{{ browser?.dom_nodes ?? '—' }}</strong></div><div><span>JS 堆</span><strong>{{ browser?.js_heap_mb == null ? '浏览器不提供' : mb(browser.js_heap_mb) }}</strong></div><div><span>接口往返</span><strong>{{ browser?.api_rtt_ms ?? '—' }} ms</strong></div></VCardText></VCard>
    </div>
    <div v-if="server?.findings?.length" class="finding-list"><VAlert v-for="(item, index) in server.findings" :key="index" :type="item.level" variant="tonal" density="compact"><strong>{{ item.title }}</strong><div>{{ item.detail }}</div></VAlert></div>
    <div v-else class="empty-state"><VIcon icon="mdi-gauge-empty" size="64" /><div class="text-h6 mt-3">等待手动采样</div><div class="text-body-2 text-medium-emphasis">不会在后台持续消耗 CPU 或发起请求</div></div>
  </div>
</template>

<style scoped>
.diagnostic-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.metric-list { display: grid; gap: 11px; }
.metric-list > div { display: flex; justify-content: space-between; gap: 16px; color: rgba(var(--v-theme-on-surface), .68); }
.metric-list strong { color: rgb(var(--v-theme-on-surface)); }
.finding-list { display: grid; gap: 10px; }
.empty-state { min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(var(--v-theme-on-surface), .5); }
@media (max-width: 760px) { .diagnostic-grid { grid-template-columns: 1fr; } }
</style>
