<script setup>
import { computed, onMounted, ref } from 'vue'
import StrategySettings from './StrategySettings.vue'
import { cloneConfig, mediaTypeText, scoreColor, unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'TmdbRecognizeEnhancer' },
  hideTitle: { type: Boolean, default: false },
})

const loading = ref(false)
const saving = ref(false)
const previewing = ref(false)
const error = ref('')
const tab = ref('overview')
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

async function loadStatus() {
  loading.value = true
  error.value = ''
  try {
    const response = await props.api.get(`${pluginBase.value}/status`)
    status.value = unwrapResponse(response) || status.value
  } catch (err) {
    error.value = err?.message || '状态加载失败'
  } finally {
    loading.value = false
  }
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

async function runPreview() {
  previewing.value = true
  error.value = ''
  preview.value = null
  try {
    const response = await props.api.post(`${pluginBase.value}/preview`, { ...previewInput.value })
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

defineExpose({ loadStatus, saveConfig, loading, saving })
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
          <div class="text-h5 font-weight-bold hero-title">TMDB 识别增强</div>
          <div class="text-body-2 hero-subtitle">让失败标题经过可解释的候选选择，再安全回到原生整理链</div>
        </div>
        <VSpacer />
        <VChip :color="config.enabled ? 'success' : 'default'" variant="flat" prepend-icon="mdi-circle-medium">
          {{ config.enabled ? '正在接管失败识别' : '当前未启用' }}
        </VChip>
      </div>
    </div>

    <div class="page-body">
      <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</VAlert>

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
        <VTabs v-model="tab" color="primary" class="px-2">
          <VTab value="overview" prepend-icon="mdi-radar">策略总览</VTab>
          <VTab value="settings" prepend-icon="mdi-tune-variant">参数设置</VTab>
          <VTab value="preview" prepend-icon="mdi-flask-outline">识别试跑</VTab>
          <VTab value="history" prepend-icon="mdi-history">运行记录</VTab>
          <VTab value="parser" prepend-icon="mdi-puzzle-outline">解析扩展</VTab>
        </VTabs>
        <VDivider />

        <div class="workspace-panels">
          <section v-show="tab === 'overview'" class="workspace-panel">
            <div class="tab-content">
              <VRow>
                <VCol cols="12" md="7">
                  <div class="text-h6 mb-1">当前决策链</div>
                  <div class="text-body-2 text-medium-emphasis mb-5">仅在 MoviePilot 原生识别失败后执行，不改变 Rust 标题提取。</div>
                  <div v-for="(step, index) in [
                    ['原生完全匹配', '沿用 MoviePilot 当前严格匹配，成功即结束', 'mdi-check-bold'],
                    ['生成降级搜索词', '完整标题失败后，尝试冒号前的稳定主体名称', 'mdi-text-search'],
                    ['拉取并合并候选', '按 TMDB ID 去重，补充别名、译名和季信息', 'mdi-database-sync-outline'],
                    ['双阈值决策', '最佳分数与领先分差必须同时满足才会注入', 'mdi-shield-check-outline'],
                  ]" :key="step[0]" class="flow-step">
                    <div class="flow-index">{{ index + 1 }}</div>
                    <VAvatar size="38" color="primary" variant="tonal"><VIcon :icon="step[2]" size="20" /></VAvatar>
                    <div><div class="font-weight-bold">{{ step[0] }}</div><div class="text-body-2 text-medium-emphasis">{{ step[1] }}</div></div>
                  </div>
                </VCol>
                <VCol cols="12" md="5">
                  <VCard color="primary" variant="tonal" class="example-card">
                    <VCardItem><VCardTitle>典型降级示例</VCardTitle><VCardSubtitle>搜索词从具体到宽泛</VCardSubtitle></VCardItem>
                    <VCardText>
                      <div class="code-title">Mushoku Tensei: Isekai Ittara Honki Dasu</div>
                      <div class="arrow-line"><VIcon icon="mdi-arrow-down" size="18" /></div>
                      <div class="code-title code-title-main">Mushoku Tensei</div>
                      <VDivider class="my-4" />
                      <div class="d-flex justify-space-between text-body-2"><span>最低得分</span><strong>{{ config.minimum_score }}</strong></div>
                      <div class="d-flex justify-space-between text-body-2 mt-2"><span>领先分差</span><strong>{{ config.minimum_margin }}</strong></div>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </div>
          </section>

          <section v-show="tab === 'settings'" class="workspace-panel">
            <div class="tab-content">
              <StrategySettings v-model="config" />
              <div class="sticky-actions"><VBtn color="primary" prepend-icon="mdi-content-save" :loading="saving" @click="saveConfig">保存并立即生效</VBtn></div>
            </div>
          </section>

          <section v-show="tab === 'preview'" class="workspace-panel">
            <div class="tab-content">
              <VRow>
                <VCol cols="12" md="5">
                  <VCard variant="outlined">
                    <VCardItem><VCardTitle>输入失败样本</VCardTitle><VCardSubtitle>试跑不会修改文件，也不会写入整理链</VCardSubtitle></VCardItem>
                    <VCardText>
                      <VAlert type="info" variant="tonal" density="compact" class="mb-4">可直接粘贴原始文件名；插件会先复用 MoviePilot 识别词与解析器，再生成 TMDB 搜索词。</VAlert>
                      <VTextarea v-model="previewInput.title" label="原标题或已提取标题" rows="4" auto-grow variant="outlined" hide-details class="preview-title-field" />
                      <VRow dense class="preview-hints">
                        <VCol cols="6"><div class="field-label">年份提示</div><VTextField v-model="previewInput.year" aria-label="年份提示" placeholder="可选" variant="outlined" density="comfortable" hide-details /></VCol>
                        <VCol cols="6"><div class="field-label">类型提示</div><VSelect v-model="previewInput.media_type" aria-label="类型提示" :items="[{title:'未知',value:''},{title:'电影',value:'movie'},{title:'电视剧',value:'tv'}]" variant="outlined" density="comfortable" hide-details /></VCol>
                        <VCol cols="6"><div class="field-label">季提示</div><VTextField v-model="previewInput.season" aria-label="季提示" type="number" placeholder="可选" variant="outlined" density="comfortable" hide-details /></VCol>
                        <VCol cols="6"><div class="field-label">集提示</div><VTextField v-model="previewInput.episode" aria-label="集提示" type="number" placeholder="可选" variant="outlined" density="comfortable" hide-details /></VCol>
                      </VRow>
                      <VBtn block color="primary" size="large" prepend-icon="mdi-play" :loading="previewing" @click="runPreview">开始候选分析</VBtn>
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol cols="12" md="7">
                  <VCard v-if="preview" variant="outlined" :color="preview.accepted ? 'success' : 'warning'" class="result-card">
                    <VCardItem>
                      <template #prepend><VAvatar :color="preview.accepted ? 'success' : 'warning'" variant="tonal"><VIcon :icon="preview.accepted ? 'mdi-check-decagram' : 'mdi-shield-alert-outline'" /></VAvatar></template>
                      <VCardTitle>{{ preview.accepted ? '候选已通过' : '本次安全拒绝' }}</VCardTitle>
                      <VCardSubtitle>{{ preview.reason }}</VCardSubtitle>
                    </VCardItem>
                    <VCardText>
                      <VAlert v-if="preview.original_title" type="info" variant="tonal" density="compact" class="mb-4">解析后标题：{{ preview.title }}</VAlert>
                      <VAlert v-if="preview.web_search?.attempted" type="info" variant="tonal" density="compact" class="mb-4">
                        搜索引擎兜底已执行：{{ preview.web_search.engine }} 返回 {{ preview.web_search.result_count }} 条，发现 {{ preview.web_search.discovered?.length || 0 }} 个 TMDB 链接，{{ preview.web_search.evidence_candidates || 0 }} 个候选通过外部证据阈值。
                      </VAlert>
                      <div class="text-caption text-medium-emphasis mb-2">实际搜索词</div>
                      <div class="d-flex flex-wrap ga-2 mb-4"><VChip v-for="query in preview.queries" :key="query" size="small" color="primary" variant="tonal">{{ query }}</VChip></div>
                      <div v-if="preview.best" class="best-result">
                        <div><div class="text-h6">{{ preview.best.name }}</div><div class="text-caption text-medium-emphasis">{{ mediaTypeText(preview.best.media_type) }} · {{ preview.best.year || '未知年份' }} · TMDB {{ preview.best.tmdb_id }}</div></div>
                        <VProgressCircular :model-value="preview.best.score" :color="scoreColor(preview.best.score)" size="68" width="7"><strong>{{ preview.best.score }}</strong></VProgressCircular>
                      </div>
                      <VTable v-if="preview.candidates?.length" density="compact" class="candidate-table mt-4">
                        <thead><tr><th>候选</th><th>命中名称</th><th>得分</th></tr></thead>
                        <tbody><tr v-for="candidate in preview.candidates" :key="`${candidate.media_type}-${candidate.tmdb_id}`"><td><strong>{{ candidate.name }}</strong><div class="text-caption text-medium-emphasis">{{ candidate.year || '—' }} · #{{ candidate.tmdb_id }}</div></td><td class="text-caption">{{ candidate.matched_name || '—' }}<div class="text-medium-emphasis">查询来源 {{ candidate.query_confidence ?? 0 }}<span v-if="candidate.web_evidence"> · 外部证据 {{ candidate.web_evidence }}</span></div></td><td><VChip size="small" :color="scoreColor(candidate.score)">{{ candidate.score }}</VChip></td></tr></tbody>
                      </VTable>
                    </VCardText>
                  </VCard>
                  <div v-else class="empty-preview"><VIcon icon="mdi-chart-bubble" size="64" color="primary" /><div class="text-h6 mt-3">等待一次试跑</div><div class="text-body-2 text-medium-emphasis">结果会解释为何接纳或拒绝每个候选</div></div>
                </VCol>
              </VRow>
            </div>
          </section>

          <section v-show="tab === 'history'" class="workspace-panel">
            <div class="tab-content">
              <div class="d-flex align-center mb-4"><div><div class="text-h6">最近识别记录</div><div class="text-body-2 text-medium-emphasis">只保存决策摘要，不保存 TMDB 完整响应</div></div><VSpacer /><VBtn variant="text" color="error" prepend-icon="mdi-delete-sweep-outline" :disabled="!history.length" @click="clearHistory">清空</VBtn><VBtn icon="mdi-refresh" variant="text" :loading="loading" @click="loadStatus" /></div>
              <div v-if="history.length" class="history-list">
                <div v-for="item in history" :key="`${item.created_at}-${item.title}`" class="history-row">
                  <div class="history-marker" :class="item.accepted ? 'history-marker-success' : 'history-marker-warning'"><span /></div>
                  <VCard variant="outlined" class="history-card">
                    <VCardText><div class="d-flex align-start"><div class="flex-grow-1"><div class="font-weight-bold">{{ item.title }}</div><div v-if="item.original_title" class="text-caption text-medium-emphasis text-truncate mt-1" :title="item.original_title">原标题：{{ item.original_title }}</div><div class="text-caption text-medium-emphasis mt-1">{{ item.created_at }} · {{ item.reason }}</div><div class="d-flex flex-wrap ga-1 mt-2"><VChip v-for="query in item.queries" :key="query" size="x-small" variant="tonal">{{ query }}</VChip><VChip v-if="item.web_search?.attempted" size="x-small" color="info" variant="tonal" prepend-icon="mdi-web">外部 {{ item.web_search.result_count }} 条 · 证据 {{ item.web_search.evidence_candidates || 0 }}</VChip></div></div><VChip :color="item.accepted ? 'success' : 'warning'" size="small">{{ item.best?.score ?? '拒绝' }}</VChip></div></VCardText>
                  </VCard>
                </div>
              </div>
              <div v-else class="empty-preview"><VIcon icon="mdi-history" size="60" /><div class="text-h6 mt-3">尚无运行记录</div></div>
            </div>
          </section>

          <section v-show="tab === 'parser'" class="workspace-panel">
            <div class="tab-content">
              <VAlert type="info" variant="tonal" icon="mdi-language-rust">当前版本不会修改 MoviePilot-Rust。这里预留给后续的解析器规则、罗马数字季号与标题提取诊断。</VAlert>
              <VRow class="mt-3"><VCol v-for="item in [['罗马数字季号','III → Season 3','mdi-numeric-3-box-outline'],['标题切片规则','保留稳定主体与别名','mdi-content-cut'],['解析对照调试','Rust / Python 结果并排','mdi-compare-horizontal']]" :key="item[0]" cols="12" md="4"><VCard variant="outlined" class="future-card"><VCardText><VAvatar color="secondary" variant="tonal"><VIcon :icon="item[2]" /></VAvatar><div class="text-subtitle-1 font-weight-bold mt-4">{{ item[0] }}</div><div class="text-body-2 text-medium-emphasis">{{ item[1] }}</div><VChip class="mt-4" size="small" variant="tonal">后续版本</VChip></VCardText></VCard></VCol></VRow>
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
.metric-card, .workspace-card, .history-card, .future-card { border-color: rgba(var(--v-theme-on-surface), .1); }
.metric-card { height: 100%; background: linear-gradient(145deg, rgba(var(--v-theme-surface),1), rgba(var(--v-theme-primary),.035)); }
.workspace-card { overflow: visible; }
.workspace-panels, .workspace-panel { width: 100%; }
.tab-content { min-height: 440px; padding: 26px; }
.flow-step { position: relative; display: grid; grid-template-columns: 28px 38px 1fr; gap: 14px; align-items: center; margin-bottom: 22px; }
.flow-step:not(:last-child)::after { content: ''; position: absolute; left: 46px; top: 42px; width: 1px; height: 30px; background: rgba(var(--v-theme-primary),.25); }
.flow-index { color: rgba(var(--v-theme-on-surface),.5); font-size: .8rem; font-weight: 700; }
.example-card { border-radius: 18px; }
.code-title { padding: 12px 14px; border: 1px solid rgba(var(--v-theme-primary),.16); border-radius: 10px; background: rgba(var(--v-theme-surface),.72); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: .84rem; }
.code-title-main { color: rgb(var(--v-theme-primary)); font-weight: 700; }
.arrow-line { padding: 4px 0; text-align: center; color: rgb(var(--v-theme-primary)); }
.sticky-actions { position: sticky; bottom: 0; z-index: 3; display: flex; justify-content: flex-end; margin: 18px -26px -26px; padding: 14px 26px; border-top: 1px solid rgba(var(--v-theme-on-surface),.08); background: rgba(var(--v-theme-surface),.94); backdrop-filter: blur(10px); }
.preview-title-field { margin-bottom: 24px; }
.preview-hints { margin-bottom: 12px; row-gap: 10px; }
.field-label { margin: 0 0 7px 2px; color: rgba(var(--v-theme-on-surface),.7); font-size: .78rem; font-weight: 600; line-height: 1.2; }
.result-card { min-height: 390px; }
.best-result { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px; border-radius: 14px; background: rgba(var(--v-theme-primary),.055); }
.candidate-table { border-radius: 12px; border: 1px solid rgba(var(--v-theme-on-surface),.08); overflow: hidden; }
.empty-preview { min-height: 390px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: rgba(var(--v-theme-on-surface),.52); }
.history-list { display: flex; flex-direction: column; gap: 16px; }
.history-row { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 12px; align-items: stretch; }
.history-marker { position: relative; display: flex; justify-content: center; padding-top: 20px; }
.history-marker::after { content: ''; position: absolute; top: 36px; bottom: -17px; width: 2px; background: rgba(var(--v-theme-on-surface),.11); }
.history-row:last-child .history-marker::after { display: none; }
.history-marker span { position: relative; z-index: 1; width: 14px; height: 14px; border: 3px solid rgb(var(--v-theme-surface)); border-radius: 50%; box-shadow: 0 0 0 2px currentColor; background: currentColor; }
.history-marker-success { color: rgb(var(--v-theme-success)); }
.history-marker-warning { color: rgb(var(--v-theme-warning)); }
.history-card { min-width: 0; background: rgb(var(--v-theme-surface)); }
.future-card { height: 100%; }
@media (max-width: 720px) { .hero-content { align-items: flex-start; flex-wrap: wrap; padding: 22px; } .hero-content :deep(.v-spacer) { display: none; } .tab-content { padding: 18px; } .sticky-actions { margin: 18px -18px -18px; } }
</style>
