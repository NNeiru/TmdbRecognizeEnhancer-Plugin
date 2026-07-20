<script setup>
import { computed, onMounted, ref } from 'vue'
import StrategySettings from './StrategySettings.vue'
import EpisodeNormalizer from './EpisodeNormalizer.vue'
import MetadataTools from './MetadataTools.vue'
import PerformanceDiagnostics from './PerformanceDiagnostics.vue'
import { cloneConfig, ensureUiVersion, mediaTypeText, scoreColor, UI_VERSION, unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'TmdbRecognizeEnhancer' },
  hideTitle: { type: Boolean, default: false },
})

const loading = ref(false)
const statusLoaded = ref(false)
const uiVersionMismatch = ref(false)
const saving = ref(false)
const previewing = ref(false)
const error = ref('')
const tab = ref('status')
const historyFilter = ref('all')
const status = ref({ config: cloneConfig(), summary: {}, history: [] })
const previewInput = ref({
  title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
  year: '', media_type: '', season: '', episode: '',
})
const preview = ref(null)

const pluginBase = computed(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`)
const config = computed({
  get: () => status.value.config || cloneConfig(),
  set: value => { status.value.config = value },
})
const summary = computed(() => status.value.summary || {})
const history = computed(() => status.value.history || [])
const historyFilterItems = [
  { title: '全部模块', value: 'all' },
  { title: '识别与偏移', value: 'recognition' },
  { title: '字段与命名', value: 'operation' },
  { title: '仅异常/未接管', value: 'warning' },
]
const filteredHistory = computed(() => history.value.filter(item => {
  if (historyFilter.value === 'all') return true
  if (historyFilter.value === 'warning') return !item.accepted
  return (item.kind || 'recognition') === historyFilter.value
}))
const normalizerStatus = computed(() => status.value.episode_normalizer || {})
const modules = computed(() => status.value.modules || {})

function historyStatus(item) {
  if (item.accepted) return { color: 'success', marker: 'success', label: item.kind === 'operation' ? '完成' : (item.best?.score ?? '通过') }
  if (item.kind === 'operation') return { color: 'error', marker: 'warning', label: '异常' }
  return { color: 'info', marker: 'info', label: '未接管' }
}

async function loadStatus() {
  loading.value = true
  error.value = ''
  try {
    const response = await props.api.get(`${pluginBase.value}/status`)
    const nextStatus = unwrapResponse(response) || status.value
    uiVersionMismatch.value = ensureUiVersion(nextStatus.backend_version)
    status.value = nextStatus
    statusLoaded.value = true
    maybeAutoReloadBackend()
  } catch (err) {
    error.value = err?.message || '状态加载失败'
  } finally {
    loading.value = false
  }
}

const reloadingBackend = ref(false)
const autoReloadTried = ref(false)

async function reloadBackend(silent = false) {
  reloadingBackend.value = true
  if (!silent) error.value = ''
  try {
    // MP 核心接口：热重载插件后端（清 Python 模块缓存并重新实例化），等效于插件页的“重载”
    await props.api.get(`plugin/reload/${props.pluginId || 'TmdbRecognizeEnhancer'}`)
    await loadStatus()
    return true
  } catch (err) {
    if (!silent) error.value = err?.message || '插件后端重载失败，请在 MP 插件页手动重载或重启容器'
    return false
  } finally {
    reloadingBackend.value = false
  }
}

function maybeAutoReloadBackend() {
  // 后端未上报版本号 = 旧实例仍在内存中（插件文件已更新但未重载）。
  // 自动重载一次即可自愈；sessionStorage 守卫防止接口异常时反复触发。
  if (status.value.backend_version || autoReloadTried.value || reloadingBackend.value) return
  const guardKey = `tmdb-enhancer-backend-reload:${UI_VERSION}`
  if (typeof window !== 'undefined' && window.sessionStorage?.getItem(guardKey) === 'done') {
    autoReloadTried.value = true
    return
  }
  window.sessionStorage?.setItem(guardKey, 'done')
  autoReloadTried.value = true
  reloadBackend(true)
}

async function saveConfig() {
  saving.value = true
  error.value = ''
  try {
    const response = await props.api.post(`${pluginBase.value}/config`, cloneConfig(config.value))
    status.value = unwrapResponse(response) || status.value
  } catch (err) {
    error.value = err?.message || '配置保存失败'
  } finally {
    saving.value = false
  }
}

function mergeEmbySyncConfig(sync = {}) {
  const saved = sync?.config || {}
  const patch = {
    emby_episode_group_sync_enabled: Boolean(saved.enabled),
    emby_episode_group_sync_servers: Array.isArray(saved.servers) ? saved.servers : [],
    emby_episode_group_sync_initial_delay_seconds: Number(saved.initial_delay_seconds ?? 15),
    emby_episode_group_sync_retry_seconds: Number(saved.retry_seconds ?? 30),
    emby_episode_group_sync_max_wait_minutes: Number(saved.max_wait_minutes ?? 15),
    emby_episode_group_sync_path_mappings: Array.isArray(saved.path_mappings) ? saved.path_mappings : [],
    emby_episode_group_sync_conflict_policy: saved.conflict_policy || 'skip',
    emby_episode_group_sync_refresh_metadata: saved.refresh_metadata !== false,
  }
  let moduleStatus = '等待插件总开关与集数偏移模块'
  if (!saved.enabled) moduleStatus = '已停用'
  else if (!sync.available) moduleStatus = '当前 MP 不支持媒体服务器服务目录'
  else if (sync.active) moduleStatus = sync.worker_running ? '监听整理入库' : '工作器未运行'
  status.value = {
    ...status.value,
    config: { ...(status.value.config || {}), ...patch },
    modules: {
      ...(status.value.modules || {}),
      emby_episode_group_sync: {
        ...(status.value.modules?.emby_episode_group_sync || {}),
        enabled: Boolean(saved.enabled),
        status: moduleStatus,
        ...(sync.counts || {}),
      },
    },
    episode_normalizer: {
      ...(status.value.episode_normalizer || {}),
      emby_sync: sync,
    },
  }
}

async function runPreview() {
  previewing.value = true
  error.value = ''
  preview.value = null
  try {
    const response = await props.api.post(`${pluginBase.value}/preview`, {
      ...previewInput.value,
      recognition_mode: config.value.recognition_mode,
    })
    preview.value = unwrapResponse(response)
  } catch (err) {
    error.value = err?.message || '试跑失败'
  } finally {
    previewing.value = false
  }
}

async function clearHistory() {
  loading.value = true
  try {
    const response = await props.api.post(`${pluginBase.value}/history/clear`, {})
    status.value = unwrapResponse(response) || status.value
  } finally {
    loading.value = false
  }
}

async function clearRecognitionMemory() {
  loading.value = true
  error.value = ''
  try {
    const response = await props.api.post(`${pluginBase.value}/recognition-memory/clear`, {})
    status.value = unwrapResponse(response) || status.value
  } catch (err) {
    error.value = err?.message || '近期识别记忆清理失败'
  } finally {
    loading.value = false
  }
}

function typeConstraintSourceText(source) {
  return ({
    manual: '手动指定',
    moviepilot: 'MoviePilot 解析',
    season_episode: '根据季集信息自动判断',
    provided: '识别链提供',
  })[source] || '标题信息'
}

defineExpose({ loadStatus, saveConfig, reloadBackend, loading, saving, reloadingBackend })
onMounted(loadStatus)
</script>

<template>
  <div class="enhancer-page">
    <div v-if="!hideTitle" class="hero-shell">
      <div class="hero-glow hero-glow-a" />
      <div class="hero-glow hero-glow-b" />
      <div class="hero-content">
        <VAvatar size="54" color="white" variant="tonal"><VIcon icon="mdi-database-search-outline" size="30" /></VAvatar>
        <div>
          <div class="text-h5 font-weight-bold hero-title">媒体整理增强</div>
          <div class="text-body-2 hero-subtitle">统一增强媒体识别、集数、命名与整理诊断</div>
        </div>
        <VSpacer />
        <VChip :color="config.enabled ? 'success' : 'default'" variant="flat" prepend-icon="mdi-circle-medium">
          {{ config.enabled ? '插件总开关已开启' : '插件总开关已关闭' }}
        </VChip>
      </div>
    </div>

    <div class="page-body">
      <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</VAlert>
      <VAlert v-if="statusLoaded && !status.backend_version" type="warning" variant="tonal" density="compact" class="mb-4">
        管理页已更新，但插件后端仍是旧实例{{ reloadingBackend ? '，正在自动重载插件后端……' : '，已尝试自动重载但仍未生效。' }}
        <template v-if="!reloadingBackend" #append><VBtn size="small" color="warning" variant="flat" prepend-icon="mdi-restart" @click="reloadBackend()">再次重载</VBtn></template>
      </VAlert>
      <VAlert v-if="uiVersionMismatch" type="info" variant="tonal" density="compact" class="mb-4">
        检测到页面版本 {{ UI_VERSION }} 与插件后端 {{ status.backend_version }} 不一致，正在自动载入新版页面……
      </VAlert>

      <VRow class="mb-2">
        <VCol v-for="card in [
          ['最近处理', summary.total || 0, 'mdi-file-search-outline', 'primary'],
          ['已接纳', summary.accepted || 0, 'mdi-check-decagram-outline', 'success'],
          ['安全拒绝', summary.rejected || 0, 'mdi-shield-remove-outline', 'warning'],
          ['接纳率', `${summary.acceptance_rate || 0}%`, 'mdi-chart-donut', 'secondary'],
        ]" :key="card[0]" cols="6" md="3">
          <VCard variant="outlined" class="metric-card">
            <VCardText class="d-flex align-center ga-3">
              <VAvatar :color="card[3]" variant="tonal"><VIcon :icon="card[2]" /></VAvatar>
              <div><div class="text-caption text-medium-emphasis">{{ card[0] }}</div><div class="text-h6 font-weight-bold">{{ card[1] }}</div></div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <VCard variant="outlined" class="workspace-card">
        <VTabs v-model="tab" color="primary" class="px-2" show-arrows>
          <VTab value="status" prepend-icon="mdi-view-dashboard-outline">状态与开关</VTab>
          <VTab value="settings" prepend-icon="mdi-database-search-outline">TMDB 搜索增强</VTab>
          <VTab value="episodes" prepend-icon="mdi-animation-outline">集数偏移</VTab>
          <VTab value="metadata" prepend-icon="mdi-code-braces-box">字段与制作组</VTab>
          <VTab value="media" prepend-icon="mdi-waveform">媒体信息识别</VTab>
          <VTab value="naming" prepend-icon="mdi-rename-box-outline">命名规则</VTab>
          <VTab value="preview" prepend-icon="mdi-flask-outline">综合试跑</VTab>
          <VTab value="history" prepend-icon="mdi-text-box-search-outline">日志</VTab>
          <VTab value="diagnostics" prepend-icon="mdi-speedometer">性能诊断</VTab>
        </VTabs>
        <VDivider />

        <div class="workspace-panels">
          <section v-if="tab === 'status'" class="workspace-panel">
            <div class="tab-content">
              <div class="d-flex align-center flex-wrap ga-3 mb-5">
                <div><div class="text-h6">插件与模块状态</div><div class="text-body-2 text-medium-emphasis">总开关关闭时所有接管停止；模块开关可独立控制功能。</div></div>
                <VSpacer />
                <VTooltip text="调用 MoviePilot 插件热重载：更新插件版本或接口异常（404）时点击，让新后端代码立即生效，无需重启容器" location="bottom"><template #activator="{ props: tip }"><VBtn v-bind="tip" variant="tonal" prepend-icon="mdi-restart" :loading="reloadingBackend" @click="reloadBackend()">重载插件后端</VBtn></template></VTooltip>
                <VBtn color="primary" prepend-icon="mdi-content-save" :loading="saving" @click="saveConfig">保存并立即生效</VBtn>
              </div>
              <VCard variant="outlined" class="master-switch mb-4">
                <VCardText class="d-flex align-center flex-wrap ga-4">
                  <VAvatar color="primary" variant="tonal"><VIcon icon="mdi-power" /></VAvatar>
                  <div class="flex-grow-1"><div class="font-weight-bold">插件总开关</div><div class="text-body-2 text-medium-emphasis">控制事件接管、运行时适配和全部模块</div></div>
                  <VSwitch v-model="config.show_sidebar_nav" color="primary" hide-details label="显示侧栏工作台" />
                  <VSwitch v-model="config.enabled" color="success" hide-details :label="config.enabled ? '运行中' : '已关闭'" />
                </VCardText>
              </VCard>
              <div class="module-grid">
                <VCard variant="outlined" class="module-card">
                  <VCardItem><template #prepend><VAvatar color="primary" variant="tonal"><VIcon icon="mdi-database-search-outline" /></VAvatar></template><VCardTitle>TMDB 搜索增强</VCardTitle><VCardSubtitle>{{ modules.recognizer?.status || '状态未知' }}</VCardSubtitle></VCardItem>
                  <VCardText><VSwitch v-model="config.recognizer_enabled" color="primary" label="启用模块" hide-details /><div class="status-line"><span>选择模式</span><strong>{{ config.recognition_mode === 'tmdb_first' ? '单次首结果' : '可解释评分' }}</strong></div><div class="status-line"><span>年份提示</span><strong>{{ config.use_year_hint ? '接收 MP 年份' : '忽略' }}</strong></div><div class="status-line"><span>原标题证据</span><strong>{{ config.use_original_title_evidence ? '启用' : '关闭' }}</strong></div></VCardText>
                </VCard>
                <VCard variant="outlined" class="module-card">
                  <VCardItem><template #prepend><VAvatar color="success" variant="tonal"><VIcon icon="mdi-swap-vertical-bold" /></VAvatar></template><VCardTitle>集数偏移</VCardTitle><VCardSubtitle>{{ modules.episode_offset?.status || '状态未知' }}</VCardSubtitle></VCardItem>
                  <VCardText><VSwitch v-model="config.episode_normalizer_enabled" color="success" label="启用模块" hide-details /><div class="status-line"><span>维护规则</span><strong>{{ normalizerStatus.rule_count || 0 }} 条</strong></div><div class="status-line"><span>MP 识别顺序</span><strong>{{ normalizerStatus.plugin_first ? '插件优先' : '原生优先' }}</strong></div><div class="status-line"><span>偏移阶段</span><strong>最终识别后</strong></div><div class="status-line"><span>运行时适配</span><strong>{{ normalizerStatus.runtime_compatible ? '兼容' : normalizerStatus.runtime_message || '不可用' }}</strong></div><div class="status-line"><span>Emby 剧集组联动</span><strong>{{ modules.emby_episode_group_sync?.status || '已停用' }}</strong></div></VCardText>
                </VCard>
                <VCard variant="outlined" class="module-card">
                  <VCardItem><template #prepend><VAvatar color="primary" variant="tonal"><VIcon icon="mdi-account-group-outline" /></VAvatar></template><VCardTitle>制作组辅助</VCardTitle><VCardSubtitle>{{ modules.release_group_assist?.status || '状态未知' }}</VCardSubtitle></VCardItem>
                  <VCardText><VSwitch v-model="config.release_group_assist_enabled" color="primary" label="启用模块" hide-details /><div class="status-line"><span>分类范围</span><strong>动漫 / 真人电视剧</strong></div><div class="status-line"><span>作用阶段</span><strong>TMDB 候选选择</strong></div></VCardText>
                </VCard>
                <VCard variant="outlined" class="module-card">
                  <VCardItem><template #prepend><VAvatar color="success" variant="tonal"><VIcon icon="mdi-text-box-edit-outline" /></VAvatar></template><VCardTitle>识别字段覆盖</VCardTitle><VCardSubtitle>{{ modules.recognition_rules?.status || '状态未知' }}</VCardSubtitle></VCardItem>
                  <VCardText><VSwitch v-model="config.recognition_rule_overrides_enabled" color="success" label="启用模块" hide-details /><div class="status-line"><span>内置规则目录</span><strong>{{ modules.recognition_rules?.catalog_rules || 0 }} 条</strong></div><div class="status-line"><span>已启用覆盖</span><strong>{{ modules.recognition_rules?.compiled_rules || 0 }} 条</strong></div></VCardText>
                </VCard>
                <VCard variant="outlined" class="module-card">
                  <VCardItem><template #prepend><VAvatar color="purple" variant="tonal"><VIcon icon="mdi-waveform" /></VAvatar></template><VCardTitle>媒体信息识别</VCardTitle><VCardSubtitle>{{ modules.media_probe?.status || (config.media_probe_enabled ? '已启用' : '已停用') }}</VCardSubtitle></VCardItem>
                  <VCardText><VSwitch v-model="config.media_probe_enabled" color="purple" label="启用模块" hide-details /><div class="status-line"><span>扫描字段</span><strong>{{ config.media_probe_fields?.length || 0 }} 项</strong></div><div class="status-line"><span>作用阶段</span><strong>整理前 / 命名渲染前</strong></div><div class="status-line"><span>神医 Pro 联动</span><strong>{{ modules.strm_media_info_sync?.status || '已停用' }}</strong></div></VCardText>
                </VCard>
                <VCard variant="outlined" class="module-card">
                  <VCardItem><template #prepend><VAvatar color="secondary" variant="tonal"><VIcon icon="mdi-code-braces" /></VAvatar></template><VCardTitle>自定义命名字段</VCardTitle><VCardSubtitle>{{ modules.rename_fields?.status || '状态未知' }}</VCardSubtitle></VCardItem>
                  <VCardText><VSwitch v-model="config.custom_rename_fields_enabled" color="secondary" label="启用模块" hide-details /><div class="status-line"><span>独立字段</span><strong>{{ modules.rename_fields?.field_count || 0 }} 个</strong></div><div class="status-line"><span>作用阶段</span><strong>Jinja2 命名渲染</strong></div></VCardText>
                </VCard>
                <VCard variant="outlined" class="module-card">
                  <VCardItem><template #prepend><VAvatar color="orange" variant="tonal"><VIcon icon="mdi-rename-box-outline" /></VAvatar></template><VCardTitle>命名规则</VCardTitle><VCardSubtitle>{{ modules.rename_mapping?.status || '状态未知' }}</VCardSubtitle></VCardItem>
                  <VCardText><VSwitch v-model="config.rename_mapping_enabled" color="orange" label="启用模块" hide-details /><div class="status-line"><span>结构化与文本规则</span><strong>{{ modules.rename_mapping?.rule_count || 0 }} 条</strong></div><div class="status-line"><span>作用范围</span><strong>制作组 / 标题 / 路径 / 字幕</strong></div></VCardText>
                </VCard>
              </div>
            </div>
          </section>

          <section v-if="tab === 'settings'" class="workspace-panel">
            <div class="tab-content">
              <StrategySettings v-model="config" :show-module-switches="false" />
              <div class="sticky-actions">
                <div class="text-caption text-medium-emphasis mr-auto">近期记忆：{{ summary.recognition_memory?.active_targets || 0 }} 个已生效目标 / {{ summary.recognition_memory?.sample_count || 0 }} 个不同文件</div>
                <VBtn variant="text" prepend-icon="mdi-delete-clock-outline" :disabled="!(summary.recognition_memory?.sample_count)" @click="clearRecognitionMemory">清除近期记忆</VBtn>
                <VBtn color="primary" prepend-icon="mdi-content-save" :loading="saving" @click="saveConfig">保存并立即生效</VBtn>
              </div>
            </div>
          </section>

          <section v-if="tab === 'metadata'" class="workspace-panel">
            <div class="tab-content">
              <MetadataTools v-model="config" mode="metadata" :api="api" :plugin-id="pluginId" :saving-config="saving" @save-config="saveConfig" />
            </div>
          </section>

          <section v-if="tab === 'media'" class="workspace-panel">
            <div class="tab-content">
              <MetadataTools v-model="config" mode="probe" :api="api" :plugin-id="pluginId" :saving-config="saving" @save-config="saveConfig" />
            </div>
          </section>

          <section v-if="tab === 'naming'" class="workspace-panel">
            <div class="tab-content">
              <MetadataTools v-model="config" mode="naming" :api="api" :plugin-id="pluginId" :saving-config="saving" @save-config="saveConfig" />
            </div>
          </section>

          <section v-if="tab === 'preview'" class="workspace-panel">
            <div class="tab-content">
              <VRow>
                <VCol cols="12" md="5">
                  <VCard variant="outlined">
                    <VCardItem><VCardTitle>输入完整样本</VCardTitle><VCardSubtitle>串联检查解析、TMDB、集数偏移、制作组编排与最终命名，不写入整理链</VCardSubtitle></VCardItem>
                    <VCardText>
                      <VAlert type="info" variant="tonal" density="compact" class="mb-4">可直接粘贴原始文件名；插件会先复用 MoviePilot 识别词与解析器，再生成 TMDB 搜索词。</VAlert>
                      <VTextarea v-model="previewInput.title" label="原标题或已提取标题" rows="4" auto-grow variant="outlined" hide-details class="preview-title-field" />
                      <VRow dense class="preview-hints">
                        <VCol cols="6"><div class="field-label">年份提示</div><VTextField v-model="previewInput.year" aria-label="年份提示" placeholder="可选" variant="outlined" density="comfortable" hide-details /></VCol>
                        <VCol cols="6"><div class="field-label">类型提示</div><VSelect v-model="previewInput.media_type" aria-label="类型提示" :items="[{title:'未知',value:''},{title:'电影',value:'movie'},{title:'电视剧',value:'tv'}]" variant="outlined" density="comfortable" hide-details /></VCol>
                        <VCol cols="6"><div class="field-label">季提示</div><VTextField v-model="previewInput.season" aria-label="季提示" type="number" placeholder="可选" variant="outlined" density="comfortable" hide-details /></VCol>
                        <VCol cols="6"><div class="field-label">集提示</div><VTextField v-model="previewInput.episode" aria-label="集提示" type="number" placeholder="可选" variant="outlined" density="comfortable" hide-details /></VCol>
                      </VRow>
                      <VBtn block color="primary" size="large" prepend-icon="mdi-play" :loading="previewing" @click="runPreview">开始综合试跑</VBtn>
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol cols="12" md="7">
                  <VCard v-if="preview" variant="outlined" :color="preview.accepted ? 'success' : 'warning'" class="result-card">
                    <VCardItem>
                      <template #prepend><VAvatar :color="preview.accepted ? 'success' : 'warning'" variant="tonal"><VIcon :icon="preview.accepted ? 'mdi-check-decagram' : 'mdi-shield-alert-outline'" /></VAvatar></template>
                      <VCardTitle>{{ preview.accepted ? '候选已通过' : '本次安全拒绝' }}</VCardTitle>
                      <VCardSubtitle>{{ preview.reason }}</VCardSubtitle>
                      <template #append>
                        <VChip size="small" :color="preview.selection_mode === 'tmdb_first' ? 'primary' : 'secondary'" variant="tonal">
                          实际：{{ preview.selection_mode === 'tmdb_first' ? '单次首结果' : '可解释评分' }}
                        </VChip>
                      </template>
                    </VCardItem>
                    <VCardText>
                      <VAlert v-if="preview.mode_mismatch" type="warning" variant="tonal" density="compact" class="mb-4">
                        页面请求模式与插件已保存模式不同：本次按页面选择执行；请重新保存配置，确保实际整理使用相同模式。
                      </VAlert>
                      <VCard v-if="preview.final_naming?.available" variant="tonal" color="primary" class="final-name-card mb-4">
                        <VCardText>
                          <div class="d-flex align-center ga-2"><VIcon icon="mdi-file-check-outline" /><strong>最终命名</strong><VChip size="x-small" variant="tonal">{{ preview.final_naming.template_source }}</VChip></div>
                          <code class="final-name-output">{{ preview.final_naming.output }}</code>
                        </VCardText>
                      </VCard>
                      <VAlert v-else-if="preview.final_naming" type="warning" variant="tonal" density="compact" class="mb-4">
                        最终命名未生成：{{ preview.final_naming.reason }}
                      </VAlert>
                      <div v-if="preview.best" class="best-result">
                        <div><div class="text-h6">{{ preview.best.name }}</div><div class="text-caption text-medium-emphasis">{{ mediaTypeText(preview.best.media_type) }} · {{ preview.best.year || '未知年份' }} · TMDB {{ preview.best.tmdb_id }}</div></div>
                        <VProgressCircular :model-value="preview.best.score" :color="scoreColor(preview.best.score)" size="68" width="7"><strong>{{ preview.best.score }}</strong></VProgressCircular>
                      </div>
                      <VAlert v-if="preview.episode_adjustment" :type="preview.episode_adjustment.applied ? 'success' : 'info'" variant="tonal" density="compact" class="mt-4">
                        <strong>集数偏移：</strong>{{ preview.episode_adjustment.reason }}
                        <span v-if="preview.episode_adjustment.coordinates_authoritative !== false && preview.episode_adjustment.season != null && preview.episode_adjustment.episode != null"> · 最终 S{{ String(preview.episode_adjustment.season).padStart(2, '0') }}E{{ String(preview.episode_adjustment.episode).padStart(2, '0') }}</span>
                      </VAlert>
                      <VExpansionPanels variant="accordion" class="preview-detail-panels mt-4">
                        <VExpansionPanel>
                          <VExpansionPanelTitle><div><strong>处理流程</strong><div class="text-caption text-medium-emphasis">按解析、识别、季集、命名、入库后联动的顺序查看</div></div></VExpansionPanelTitle>
                          <VExpansionPanelText>
                            <div v-if="preview.pipeline?.length" class="pipeline-list">
                              <div v-for="step in preview.pipeline" :key="step.module" class="pipeline-item">
                                <VIcon :icon="step.status === 'applied' || step.status === 'accepted' || step.status === 'completed' ? 'mdi-check-circle-outline' : 'mdi-minus-circle-outline'" :color="step.status === 'rejected' ? 'warning' : step.status === 'skipped' ? 'medium-emphasis' : 'success'" />
                                <div><strong>{{ step.module }}</strong><div class="text-caption text-medium-emphasis">{{ step.summary }}</div></div>
                              </div>
                            </div>
                            <div v-if="preview.release_group_arrangement?.input" class="detail-block mt-3"><strong>制作组编排</strong><div class="result-path"><code>{{ preview.release_group_arrangement.input }}</code><VIcon icon="mdi-arrow-right" size="18" /><code>{{ preview.release_group_arrangement.output }}</code></div></div>
                            <div v-if="Object.keys(preview.custom_rename_fields?.values || {}).length" class="detail-block mt-3"><strong>自定义命名字段</strong><div class="custom-preview-values mt-2"><div v-for="(value, key) in preview.custom_rename_fields.values" :key="key"><code>{{ key }}</code><span>{{ value || '（空）' }}</span></div></div></div>
                          </VExpansionPanelText>
                        </VExpansionPanel>
                        <VExpansionPanel>
                          <VExpansionPanelTitle><div><strong>TMDB 候选与评分诊断</strong><div class="text-caption text-medium-emphasis">搜索词、约束、去重和全部候选默认折叠</div></div></VExpansionPanelTitle>
                          <VExpansionPanelText>
                            <VAlert v-if="preview.original_title" type="info" variant="tonal" density="compact" class="mb-3">解析后标题：{{ preview.title }}</VAlert>
                            <VAlert v-if="preview.recognition_rule_changes?.length" type="success" variant="tonal" density="compact" class="mb-3">识别字段覆盖：<span v-for="(item, index) in preview.recognition_rule_changes" :key="item.rule_id || index"><span v-if="index">；</span>{{ item.field }}：{{ item.before ?? '空' }} → {{ item.after ?? '空' }}</span></VAlert>
                            <VAlert v-if="preview.type_constraint?.active" type="info" variant="tonal" density="compact" class="mb-3">类型约束：{{ preview.type_constraint.label }}（{{ typeConstraintSourceText(preview.type_constraint.source) }}）<span v-if="preview.type_constraint.removed_count">；排除 {{ preview.type_constraint.removed_count }} 个冲突候选</span></VAlert>
                            <VAlert v-if="preview.hints?.year && Number(preview.hints?.season || 0) > 1 && (preview.hints?.media_type === '电视剧' || preview.hints?.media_type === 'tv')" type="info" variant="tonal" density="compact" class="mb-3">年份语义：S{{ preview.hints.season }} 的 {{ preview.hints.year }} 作为本季播出上下文保留，不与 TMDB Series 首播年份强匹配。</VAlert>
                            <VAlert v-if="preview.release_group_preference?.active" type="success" variant="tonal" density="compact" class="mb-3">制作组题材约束：{{ preview.release_group_preference.release_group || '已分类制作组' }} → {{ preview.release_group_preference.label }}<span v-if="preview.release_group_preference.removed_count">；排除 {{ preview.release_group_preference.removed_count }} 个题材冲突候选</span><span v-else>；本次没有发现明确冲突候选</span></VAlert>
                            <VAlert v-if="preview.candidate_sources?.typed?.attempted" type="info" variant="tonal" density="compact" class="mb-3">候选来源：Multi Search 与{{ preview.candidate_sources.typed.media_type === '电视剧' ? ' TV Search' : ' Movie Search' }} 已合并去重；专用搜索返回 {{ preview.candidate_sources.typed.candidate_count || 0 }} 个候选。</VAlert>
                            <VAlert v-if="preview.candidate_sources?.shared?.attempted || preview.candidate_sources?.shared?.reason !== '仅在 TMDB 无候选时查询'" :type="preview.candidate_sources?.shared?.hit ? 'success' : 'info'" variant="tonal" density="compact" class="mb-3">MP 共享识别：{{ preview.candidate_sources.shared.reason }}<span v-if="preview.candidate_sources.shared.tmdb_id"> · TMDB {{ preview.candidate_sources.shared.tmdb_id }}</span></VAlert>
                            <VAlert v-if="preview.duplicate_summary?.suppressed_count || preview.duplicate_summary?.shadow_season_count" type="info" variant="tonal" density="compact" class="mb-3">归并重复候选 {{ preview.duplicate_summary?.suppressed_count || 0 }} 个；排除平行单季条目 {{ preview.duplicate_summary?.shadow_season_count || 0 }} 个。</VAlert>
                            <VAlert v-if="preview.best?.eligible_rank != null && preview.best?.tmdb_rank != null && preview.best.eligible_rank !== preview.best.tmdb_rank" type="info" variant="tonal" density="compact" class="mb-3">候选过滤后已按剩余结果重算有效排名；TMDB 原始排名仅保留为诊断信息。</VAlert>
                            <VAlert v-if="preview.best?.season_coordinate_evidence?.checked" type="info" variant="tonal" density="compact" class="mb-3">季集校验：{{ preview.best.season_coordinate_evidence.reason }}<span v-if="preview.best.season_coordinate_evidence.matched_group_name"> · {{ preview.best.season_coordinate_evidence.matched_group_name }}</span></VAlert>
                            <VAlert v-if="preview.web_search?.attempted" type="info" variant="tonal" density="compact" class="mb-3">搜索引擎兜底：{{ preview.web_search.engine }} 返回 {{ preview.web_search.result_count }} 条，发现 {{ preview.web_search.discovered?.length || 0 }} 个 TMDB 链接。</VAlert>
                            <div class="text-caption text-medium-emphasis mb-2">实际搜索词</div>
                            <div class="d-flex flex-wrap ga-2 mb-4"><VChip v-for="query in preview.queries" :key="query" size="small" color="primary" variant="tonal">{{ query }}</VChip></div>
                            <VTable v-if="preview.candidates?.length" density="compact" class="candidate-table">
                              <thead><tr><th>候选</th><th>命中与证据</th><th>得分</th></tr></thead>
                              <tbody><tr v-for="candidate in preview.candidates" :key="`${candidate.media_type}-${candidate.tmdb_id}`" :class="{ 'candidate-suppressed': candidate.suppressed_as_duplicate || candidate.suppressed_as_shadow_season || candidate.suppressed_by_exclusion }"><td><strong>{{ candidate.name }}</strong><div class="text-caption text-medium-emphasis">{{ candidate.year || '—' }} · #{{ candidate.tmdb_id }}</div></td><td class="text-caption">{{ candidate.matched_name || '—' }}<div class="text-medium-emphasis">查询来源 {{ candidate.query_confidence ?? 0 }}<span v-if="candidate.web_evidence"> · 外部证据 {{ candidate.web_evidence }}</span></div><div v-if="candidate.release_group_evidence?.component !== null" class="text-medium-emphasis">制作组 {{ candidate.release_group_evidence.label }}：{{ candidate.release_group_evidence.component }} 分</div><div v-if="candidate.seasonal_evidence?.active" class="context-evidence">季度目录 {{ candidate.seasonal_evidence.quarter }}：{{ candidate.seasonal_evidence.component }} 分</div><div v-if="candidate.memory_evidence?.active" class="context-evidence">近期命中 {{ candidate.memory_evidence.hits }} 次：{{ candidate.memory_evidence.component }} 分</div><div v-if="candidate.preferred_by_policy" class="context-evidence">命中 TMDB 优先名单</div><div v-if="candidate.suppressed_by_exclusion" class="text-medium-emphasis">已被 TMDB 排除名单剔除</div></td><td><VChip size="small" variant="tonal" :color="candidate.suppressed_as_duplicate || candidate.suppressed_as_shadow_season || candidate.suppressed_by_exclusion ? 'grey' : scoreColor(candidate.score)">{{ preview.selection_mode === 'tmdb_first' ? '诊断 ' : '' }}{{ candidate.diagnostic_score ?? candidate.score }}</VChip></td></tr></tbody>
                            </VTable>
                          </VExpansionPanelText>
                        </VExpansionPanel>
                      </VExpansionPanels>
                    </VCardText>
                  </VCard>
                  <div v-else class="empty-preview"><VIcon icon="mdi-chart-bubble" size="64" color="primary" /><div class="text-h6 mt-3">等待一次综合试跑</div><div class="text-body-2 text-medium-emphasis">结果会解释从标题解析到最终命名的完整插件链路</div></div>
                </VCol>
              </VRow>
            </div>
          </section>

          <section v-if="tab === 'history'" class="workspace-panel">
            <div class="tab-content">
              <div class="d-flex align-center flex-wrap ga-2 mb-4"><div class="flex-grow-1"><div class="text-h6">模块运行日志</div><div class="text-body-2 text-medium-emphasis">汇总识别决策、集数偏移、字段覆盖及命名处理结果，不保存完整响应</div></div><VSelect v-model="historyFilter" :items="historyFilterItems" item-title="title" item-value="value" density="compact" hide-details class="history-filter" /><VBtn variant="text" color="error" prepend-icon="mdi-delete-sweep-outline" :disabled="!history.length" @click="clearHistory">清空</VBtn><VBtn icon="mdi-refresh" variant="text" :loading="loading" @click="loadStatus" /></div>
              <div v-if="filteredHistory.length" class="history-list">
                <div v-for="(item, historyIndex) in filteredHistory" :key="`${item.created_at}-${item.module}-${item.title}-${historyIndex}`" class="history-row">
                  <div class="history-marker" :class="`history-marker-${historyStatus(item).marker}`"><span /></div>
                  <VCard variant="outlined" class="history-card">
                    <VCardText><div class="d-flex align-start ga-3"><div class="flex-grow-1"><div class="d-flex flex-wrap align-center ga-2"><div class="font-weight-bold">{{ item.title }}</div><VChip size="x-small" color="primary" variant="tonal">{{ item.module || 'TMDB 搜索增强' }}</VChip></div><div v-if="item.original_title" class="text-caption text-medium-emphasis text-truncate mt-1" :title="item.original_title">原标题：{{ item.original_title }}</div><div class="text-caption text-medium-emphasis mt-1">{{ item.created_at }} · {{ item.reason }}</div><div v-if="!item.accepted && item.kind !== 'operation'" class="text-caption text-info mt-1">插件未接管本次候选选择，MoviePilot 仍会继续执行原生识别与整理；这不代表最终整理失败。</div><div v-if="item.episode_adjustment" class="text-caption mt-1">集数偏移：{{ item.episode_adjustment.reason }}<span v-if="item.episode_adjustment.season != null"> · S{{ item.episode_adjustment.season }}E{{ item.episode_adjustment.episode }}</span></div><div class="d-flex flex-wrap ga-1 mt-2"><VChip v-for="stage in item.stages" :key="stage" size="x-small" color="secondary" variant="tonal">{{ stage }}</VChip><VChip v-for="query in item.queries" :key="query" size="x-small" variant="tonal">{{ query }}</VChip><VChip v-if="item.web_search?.attempted" size="x-small" color="info" variant="tonal" prepend-icon="mdi-web">外部 {{ item.web_search.result_count }} 条 · 证据 {{ item.web_search.evidence_candidates || 0 }}</VChip></div></div><VChip :color="historyStatus(item).color" size="small">{{ historyStatus(item).label }}</VChip></div></VCardText>
                  </VCard>
                </div>
              </div>
              <div v-else class="empty-preview"><VIcon icon="mdi-text-box-search-outline" size="60" /><div class="text-h6 mt-3">{{ history.length ? '当前筛选没有日志' : '尚无模块日志' }}</div></div>
            </div>
          </section>

          <section v-if="tab === 'diagnostics'" class="workspace-panel">
            <div class="tab-content"><PerformanceDiagnostics :api="api" :plugin-id="pluginId" /></div>
          </section>

          <section v-show="tab === 'episodes'" class="workspace-panel">
            <div class="tab-content">
              <KeepAlive>
                <EpisodeNormalizer
                  v-if="tab === 'episodes'"
                  :api="api" :plugin-base="pluginBase" :runtime-status="normalizerStatus"
                  @config-saved="mergeEmbySyncConfig"
                />
              </KeepAlive>
            </div>
          </section>

        </div>
      </VCard>
    </div>
  </div>
</template>

<style scoped>
.enhancer-page { min-height: 100%; color: rgb(var(--v-theme-on-surface)); }
.hero-shell { position: relative; overflow: hidden; margin: 16px 16px 0; border-radius: 20px; color: white; background: linear-gradient(125deg, #052f46 0%, #075985 50%, #0f766e 100%); }
.hero-content { position: relative; z-index: 2; display: flex; align-items: center; gap: 16px; min-height: 126px; padding: 26px 30px; }
.hero-title { color: #fff !important; text-shadow: 0 1px 2px rgba(0,0,0,.2); }
.hero-subtitle { color: rgba(255,255,255,.76); margin-top: 3px; }
.hero-glow { position: absolute; border-radius: 999px; filter: blur(2px); background: rgba(94,234,212,.18); }
.hero-glow-a { width: 220px; height: 220px; right: 8%; top: -120px; }
.hero-glow-b { width: 150px; height: 150px; left: 30%; bottom: -110px; }
.page-body { padding: 18px 16px 28px; }
.metric-card, .workspace-card, .history-card, .future-card { border-color: rgba(var(--v-theme-on-surface), .1); border-radius: 14px; }
.metric-card { height: 100%; background: linear-gradient(145deg, rgba(var(--v-theme-surface),1), rgba(var(--v-theme-primary),.035)); }
.master-switch { border-radius: 14px; background: linear-gradient(120deg, rgba(var(--v-theme-primary),.055), rgba(var(--v-theme-surface),1)); }
.module-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.module-card { min-width: 0; height: 100%; border-radius: 14px; background: rgb(var(--v-theme-surface)); }
.status-line { display: flex; justify-content: space-between; gap: 14px; margin-top: 12px; color: rgba(var(--v-theme-on-surface),.68); font-size: .86rem; }
.status-line strong { color: rgb(var(--v-theme-on-surface)); text-align: right; }
.workspace-card { overflow: visible; }
.workspace-card > :deep(.v-tabs) { border-radius: 14px 14px 0 0; background: rgba(var(--v-theme-on-surface), .018); }
.workspace-panels, .workspace-panel { width: 100%; }
.tab-content { min-height: 440px; padding: 26px; }
.workspace-panel :deep(.v-card--variant-outlined),
.workspace-panel :deep(.v-card--variant-flat.v-card--border) { border-color: rgba(var(--v-theme-on-surface), .1); border-radius: 14px; box-shadow: none; }
.workspace-panel :deep(.v-expansion-panels) { border-radius: 14px; overflow: hidden; }
.workspace-panel :deep(.v-expansion-panel-title) { min-height: 60px; }
.workspace-panel :deep(.v-field) { border-radius: 10px; }
.flow-step { position: relative; display: grid; grid-template-columns: 28px 38px 1fr; gap: 14px; align-items: center; margin-bottom: 22px; }
.flow-step:not(:last-child)::after { content: ''; position: absolute; left: 46px; top: 42px; width: 1px; height: 30px; background: rgba(var(--v-theme-primary),.25); }
.flow-index { color: rgba(var(--v-theme-on-surface),.5); font-size: .8rem; font-weight: 700; }
.example-card { border-radius: 18px; }
.code-title { padding: 12px 14px; border: 1px solid rgba(var(--v-theme-primary),.16); border-radius: 10px; background: rgba(var(--v-theme-surface),.72); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: .84rem; }
.code-title-main { color: rgb(var(--v-theme-primary)); font-weight: 700; }
.arrow-line { padding: 4px 0; text-align: center; color: rgb(var(--v-theme-primary)); }
.sticky-actions { position: sticky; bottom: 0; z-index: 3; display: flex; align-items: center; justify-content: flex-end; gap: 10px; margin: 18px -26px -26px; padding: 14px 26px; border-top: 1px solid rgba(var(--v-theme-on-surface),.08); background: rgba(var(--v-theme-surface),.94); backdrop-filter: blur(10px); }
.preview-title-field { margin-bottom: 24px; }
.preview-hints { margin-bottom: 12px; row-gap: 10px; }
.preview-naming-panel { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; overflow: hidden; }
.field-label { margin: 0 0 7px 2px; color: rgba(var(--v-theme-on-surface),.7); font-size: .78rem; font-weight: 600; line-height: 1.2; }
.result-card { min-height: 390px; }
.best-result { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px; border-radius: 14px; background: rgba(var(--v-theme-primary),.055); }
.final-name-card { border: 1px solid rgba(var(--v-theme-primary), .2); }
.final-name-output { display: block; margin-top: 12px; padding: 12px 14px; border-radius: 10px; background: rgba(var(--v-theme-surface), .72); color: rgb(var(--v-theme-primary)); font-size: .9rem; overflow-wrap: anywhere; white-space: normal; }
.preview-detail-panels { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; overflow: hidden; }
.detail-block { padding: 12px 14px; border-radius: 10px; background: rgba(var(--v-theme-secondary), .045); }
.pipeline-list { display: grid; gap: 8px; }
.result-path { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 8px; overflow-wrap: anywhere; }
.custom-preview-values { display: grid; gap: 7px; }
.custom-preview-values > div { display: flex; justify-content: space-between; gap: 14px; overflow-wrap: anywhere; }
.pipeline-item { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 10px; align-items: start; padding: 10px 12px; border-radius: 10px; background: rgba(var(--v-theme-primary),.035); }
.candidate-table { border-radius: 12px; border: 1px solid rgba(var(--v-theme-on-surface),.08); overflow: hidden; }
.candidate-suppressed { opacity: .62; background: rgba(var(--v-theme-info),.035); }
.context-evidence { margin-top: 2px; color: rgb(var(--v-theme-primary)); font-weight: 600; }
.empty-preview { min-height: 390px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: rgba(var(--v-theme-on-surface),.52); }
.history-list { display: flex; flex-direction: column; gap: 16px; }
.history-filter { flex: 0 0 150px; }
.history-row { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 12px; align-items: stretch; }
.history-marker { position: relative; display: flex; justify-content: center; padding-top: 20px; }
.history-marker::after { content: ''; position: absolute; top: 36px; bottom: -17px; width: 2px; background: rgba(var(--v-theme-on-surface),.11); }
.history-row:last-child .history-marker::after { display: none; }
.history-marker span { position: relative; z-index: 1; width: 14px; height: 14px; border: 3px solid rgb(var(--v-theme-surface)); border-radius: 50%; box-shadow: 0 0 0 2px currentColor; background: currentColor; }
.history-marker-success { color: rgb(var(--v-theme-success)); }
.history-marker-info { color: rgb(var(--v-theme-info)); }
.history-marker-warning { color: rgb(var(--v-theme-warning)); }
.history-card { min-width: 0; background: rgb(var(--v-theme-surface)); }
.future-card { height: 100%; }
@media (max-width: 720px) { .hero-content { align-items: flex-start; flex-wrap: wrap; padding: 22px; } .hero-content :deep(.v-spacer) { display: none; } .tab-content { padding: 18px; } .sticky-actions { margin: 18px -18px -18px; } .module-grid { grid-template-columns: 1fr; } }
</style>
