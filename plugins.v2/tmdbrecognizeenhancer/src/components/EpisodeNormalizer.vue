<script setup>
import { computed, onMounted, ref } from 'vue'
import { unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginBase: { type: String, required: true },
  runtimeStatus: { type: Object, default: () => ({}) },
})

const loading = ref(false)
const error = ref('')
const rules = ref([])
const catalog = ref([])
const inspection = ref(null)
const previewResult = ref(null)
const importForm = ref({ year: new Date().getFullYear(), quarter: Math.floor(new Date().getMonth() / 3) + 1 })
const previewForm = ref({ season: 1, episode: 1, end_episode: '', title: '' })

const emptyRule = () => ({
  tmdb_id: '', title: '', enabled: true, target_type: 'default', episode_group_id: '', installments: [],
})
const form = ref(emptyRule())

const selectedGroup = computed(() =>
  inspection.value?.groups?.find(item => item.id === form.value.episode_group_id),
)

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const response = await props.api.get(`${props.pluginBase}/episode-normalizer`)
    const data = unwrapResponse(response) || {}
    rules.value = data.rules || []
    catalog.value = data.catalog || []
  } catch (err) {
    error.value = err?.message || '集数归一化数据加载失败'
  } finally {
    loading.value = false
  }
}

async function inspectTarget() {
  if (!form.value.tmdb_id) return
  loading.value = true
  error.value = ''
  try {
    inspection.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/inspect`, { tmdb_id: form.value.tmdb_id },
    ))
    if (inspection.value?.title && !form.value.title) form.value.title = inspection.value.title
  } catch (err) {
    error.value = err?.message || '目标编集读取失败'
  } finally {
    loading.value = false
  }
}

async function saveRule() {
  loading.value = true
  error.value = ''
  try {
    const data = unwrapResponse(await props.api.post(`${props.pluginBase}/episode-normalizer/rule`, form.value)) || {}
    rules.value = data.rules || rules.value
  } catch (err) {
    error.value = err?.message || '规则保存失败'
  } finally {
    loading.value = false
  }
}

async function deleteRule(tmdbId) {
  loading.value = true
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/rule/delete`, { tmdb_id: tmdbId },
    )) || {}
    rules.value = data.rules || []
    if (Number(form.value.tmdb_id) === Number(tmdbId)) resetForm()
  } finally {
    loading.value = false
  }
}

async function runPreview() {
  previewResult.value = null
  loading.value = true
  try {
    const payload = { ...previewForm.value, tmdb_id: form.value.tmdb_id, rule: form.value }
    previewResult.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/preview`, payload,
    ))
  } catch (err) {
    error.value = err?.message || '归一化试跑失败'
  } finally {
    loading.value = false
  }
}

async function importQuarter() {
  loading.value = true
  error.value = ''
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/catalog/import`, importForm.value,
    )) || {}
    catalog.value = data.catalog || []
  } catch (err) {
    error.value = err?.message || '季度目录导入失败'
  } finally {
    loading.value = false
  }
}

async function matchCatalog(item) {
  loading.value = true
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/catalog/match`, { id: item.id },
    )) || {}
    catalog.value = data.catalog || catalog.value
  } catch (err) {
    error.value = err?.message || 'TMDB 匹配失败'
  } finally {
    loading.value = false
  }
}

function editRule(rule) {
  form.value = prepareRuleForForm(rule)
  inspection.value = null
  previewResult.value = null
  inspectTarget()
}

function resetForm() {
  form.value = emptyRule()
  inspection.value = null
  previewResult.value = null
}

function addInstallment(seed = {}) {
  form.value.installments.push({
    id: `segment-${Date.now()}`,
    title: seed.title || '',
    quarter: seed.quarter || '',
    aliases: Array.isArray(seed.aliases) ? seed.aliases.join('\n') : (seed.aliases || ''),
    source_season: '',
    target_start_season: 1,
    target_start_episode: 1,
  })
}

function useCatalogItem(item) {
  const best = item.tmdb_match?.best
  if (!best?.tmdb_id) return
  const existing = rules.value.find(rule => Number(rule.tmdb_id) === Number(best.tmdb_id))
  form.value = existing ? prepareRuleForForm(existing) : {
    ...emptyRule(), tmdb_id: best.tmdb_id, title: best.name || item.name_cn || item.name,
  }
  addInstallment({ title: item.name_cn || item.name, quarter: item.quarter, aliases: item.aliases })
  inspection.value = null
  inspectTarget()
}

function prepareRuleForForm(rule) {
  const cloned = JSON.parse(JSON.stringify(rule))
  cloned.installments = (cloned.installments || []).map(item => ({
    ...item,
    aliases: Array.isArray(item.aliases) ? item.aliases.join('\n') : (item.aliases || ''),
  }))
  return cloned
}

function removeInstallment(index) {
  form.value.installments.splice(index, 1)
}

function groupType(type) {
  return ({ 1: '原始播出', 2: '绝对编号', 3: 'DVD', 4: 'Digital', 5: '故事线', 6: '制片', 7: 'TV' })[type] || `类型 ${type}`
}

onMounted(loadData)
</script>

<template>
  <div class="episode-normalizer">
    <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</VAlert>
    <VAlert
      v-if="!runtimeStatus.runtime_compatible || !runtimeStatus.plugin_first"
      type="warning" variant="tonal" class="mb-4"
    >
      <div class="font-weight-bold">归一化暂不能接管实际整理</div>
      <div v-if="!runtimeStatus.runtime_compatible">{{ runtimeStatus.runtime_message }}</div>
      <div v-if="!runtimeStatus.plugin_first">请在 MoviePilot 中开启“识别插件优先”。否则原生识别成功时不会调用本插件。</div>
    </VAlert>
    <VAlert v-else type="success" variant="tonal" density="compact" class="mb-4">
      {{ runtimeStatus.runtime_message }}；识别插件优先已开启。MoviePilot 源码不会被覆盖。
    </VAlert>

    <VRow>
      <VCol cols="12" lg="7">
        <VCard variant="outlined" class="normalizer-card">
          <VCardItem>
            <template #prepend><VAvatar color="primary" variant="tonal"><VIcon icon="mdi-tune-vertical-variant" /></VAvatar></template>
            <VCardTitle>目标编集</VCardTitle>
            <VCardSubtitle>只定义最终采用 TMDB 默认还是某个剧集组</VCardSubtitle>
            <template #append><VBtn variant="text" prepend-icon="mdi-plus" @click="resetForm">新规则</VBtn></template>
          </VCardItem>
          <VCardText>
            <VRow dense>
              <VCol cols="12" sm="4"><VTextField v-model="form.tmdb_id" label="TMDBID" type="number" hide-details /></VCol>
              <VCol cols="12" sm="8"><VTextField v-model="form.title" label="显示名称" hide-details /></VCol>
            </VRow>
            <div class="d-flex align-center ga-2 mt-3">
              <VBtn color="primary" variant="tonal" prepend-icon="mdi-database-eye-outline" :loading="loading" @click="inspectTarget">读取编集</VBtn>
              <VSwitch v-model="form.enabled" label="启用" color="success" hide-details density="compact" />
            </div>

            <VRadioGroup v-model="form.target_type" class="target-options mt-4" hide-details>
              <VCard variant="tonal" :color="form.target_type === 'default' ? 'primary' : undefined" class="target-option">
                <VRadio value="default" label="TMDB 默认编集" color="primary" />
                <div class="text-caption text-medium-emphasis ms-9">
                  <span v-for="season in inspection?.default?.seasons || []" :key="season.season" class="me-3">S{{ season.season }} · {{ season.episode_count }} 集</span>
                </div>
              </VCard>
              <VCard variant="tonal" :color="form.target_type === 'group' ? 'secondary' : undefined" class="target-option mt-3">
                <VRadio value="group" label="TMDB 剧集组" color="secondary" />
                <VSelect
                  v-if="form.target_type === 'group'" v-model="form.episode_group_id"
                  :items="(inspection?.groups || []).map(group => ({ title: `${group.name} · ${groupType(group.type)} · ${group.episode_count} 集`, value: group.id }))"
                  label="选择 Group ID" class="mt-2" hide-details
                />
                <div v-if="selectedGroup" class="text-caption text-medium-emphasis mt-2 ms-2">
                  <div>{{ selectedGroup.description || '该剧集组暂无说明' }}</div>
                  <div class="mt-1"><span v-for="season in selectedGroup.seasons || []" :key="season.season" class="me-3">S{{ season.season }} · {{ season.episode_count }} 集</span></div>
                </div>
              </VCard>
            </VRadioGroup>

            <div class="d-flex align-center mt-5 mb-2">
              <div><div class="font-weight-bold">季度片段定位</div><div class="text-caption text-medium-emphasis">仅用于“第三期 - 01”这类数字本身无法判断季度的标题</div></div>
              <VSpacer /><VBtn size="small" variant="tonal" prepend-icon="mdi-plus" @click="addInstallment()">添加片段</VBtn>
            </div>
            <VCard v-for="(item, index) in form.installments" :key="item.id || index" variant="outlined" class="segment-card mb-3">
              <VCardText>
                <div class="d-flex align-center mb-2"><strong>{{ item.title || `片段 ${index + 1}` }}</strong><VSpacer /><VBtn icon="mdi-delete-outline" size="small" variant="text" color="error" @click="removeInstallment(index)" /></div>
                <VRow dense>
                  <VCol cols="12" sm="6"><VTextField v-model="item.title" label="片段名称" /></VCol>
                  <VCol cols="12" sm="3"><VTextField v-model="item.quarter" label="季度" placeholder="2026-Q3" /></VCol>
                  <VCol cols="12" sm="3"><VTextField v-model="item.source_season" label="来源季（可空）" type="number" /></VCol>
                  <VCol cols="12"><VTextarea v-model="item.aliases" label="命中别名（每行一个）" rows="2" auto-grow /></VCol>
                  <VCol cols="6"><VTextField v-model="item.target_start_season" label="目标起始季" type="number" /></VCol>
                  <VCol cols="6"><VTextField v-model="item.target_start_episode" label="目标起始集" type="number" /></VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCardText>
          <VDivider />
          <VCardActions class="pa-4"><VBtn color="primary" prepend-icon="mdi-content-save" :loading="loading" @click="saveRule">保存目标编集</VBtn></VCardActions>
        </VCard>
      </VCol>

      <VCol cols="12" lg="5">
        <VCard variant="outlined" class="normalizer-card mb-4">
          <VCardItem><VCardTitle>归一化试跑</VCardTitle><VCardSubtitle>验证来源季集最终会落到哪里</VCardSubtitle></VCardItem>
          <VCardText>
            <VTextField v-model="previewForm.title" label="原标题（用于命中季度别名）" class="mb-2" />
            <VRow dense>
              <VCol cols="4"><VTextField v-model="previewForm.season" label="来源季" type="number" /></VCol>
              <VCol cols="4"><VTextField v-model="previewForm.episode" label="开始集" type="number" /></VCol>
              <VCol cols="4"><VTextField v-model="previewForm.end_episode" label="结束集" type="number" /></VCol>
            </VRow>
            <VBtn block color="secondary" prepend-icon="mdi-play" :loading="loading" @click="runPreview">试跑当前规则</VBtn>
            <VAlert v-if="previewResult?.result" :type="previewResult.result.applied ? 'success' : 'info'" variant="tonal" class="mt-4">
              <div class="font-weight-bold">S{{ previewResult.result.season }}E{{ previewResult.result.episode }}<span v-if="previewResult.result.end_episode">-E{{ previewResult.result.end_episode }}</span></div>
              <div>{{ previewResult.result.reason }} · {{ previewResult.result.strategy }}</div>
            </VAlert>
          </VCardText>
        </VCard>

        <VCard variant="outlined" class="normalizer-card">
          <VCardItem><VCardTitle>已维护规则</VCardTitle><VCardSubtitle>{{ rules.length }} 个 TMDB 条目</VCardSubtitle></VCardItem>
          <VList lines="two">
            <VListItem v-for="rule in rules" :key="rule.tmdb_id" :title="rule.title" :subtitle="`TMDB ${rule.tmdb_id} · ${rule.target_type === 'group' ? '剧集组' : '默认编集'}`">
              <template #prepend><VAvatar :color="rule.enabled ? 'success' : 'default'" variant="tonal"><VIcon icon="mdi-animation-outline" /></VAvatar></template>
              <template #append><VBtn icon="mdi-pencil-outline" variant="text" @click="editRule(rule)" /><VBtn icon="mdi-delete-outline" variant="text" color="error" @click="deleteRule(rule.tmdb_id)" /></template>
            </VListItem>
            <VListItem v-if="!rules.length" title="还没有目标编集规则" subtitle="从左侧手动添加，或从下方季度目录创建" />
          </VList>
        </VCard>
      </VCol>
    </VRow>

    <VCard variant="outlined" class="normalizer-card mt-4">
      <VCardItem>
        <template #prepend><VAvatar color="secondary" variant="tonal"><VIcon icon="mdi-view-dashboard-outline" /></VAvatar></template>
        <VCardTitle>季度番剧看板</VCardTitle>
        <VCardSubtitle>Bangumi 官方 API 导入；TMDB 匹配后再选择目标编集</VCardSubtitle>
      </VCardItem>
      <VCardText>
        <div class="d-flex flex-wrap align-center ga-3 mb-4">
          <VTextField v-model="importForm.year" label="年份" type="number" density="compact" hide-details class="quarter-field" />
          <VSelect v-model="importForm.quarter" :items="[1,2,3,4].map(value => ({ title: `Q${value}`, value }))" label="季度" density="compact" hide-details class="quarter-field" />
          <VBtn color="secondary" prepend-icon="mdi-cloud-download-outline" :loading="loading" @click="importQuarter">导入季度列表</VBtn>
          <VSpacer /><VBtn icon="mdi-refresh" variant="text" :loading="loading" @click="loadData" />
        </div>
        <div class="catalog-grid">
          <VCard v-for="item in catalog" :key="item.id" variant="outlined" class="catalog-card">
            <VImg v-if="item.poster" :src="item.poster" height="150" cover />
            <VCardItem><VCardTitle class="text-subtitle-1">{{ item.name_cn || item.name }}</VCardTitle><VCardSubtitle>{{ item.quarter }} · {{ item.date || '日期未知' }} · {{ item.episode_count || '?' }} 集</VCardSubtitle></VCardItem>
            <VCardText v-if="item.tmdb_match?.best" class="pt-0"><VChip :color="item.tmdb_match.accepted ? 'success' : 'warning'" size="small">TMDB {{ item.tmdb_match.best.tmdb_id }} · {{ item.tmdb_match.best.score }} 分</VChip><div class="text-caption mt-2 text-medium-emphasis">{{ item.tmdb_match.best.name }}</div></VCardText>
            <VCardActions><VBtn size="small" variant="tonal" :loading="loading" @click="matchCatalog(item)">匹配 TMDB</VBtn><VBtn v-if="item.tmdb_match?.accepted" size="small" color="primary" @click="useCatalogItem(item)">建立目标</VBtn></VCardActions>
          </VCard>
          <div v-if="!catalog.length" class="empty-catalog"><VIcon icon="mdi-calendar-blank-outline" size="48" /><div>导入一个季度后在这里选择番剧</div></div>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.normalizer-card { border-color: rgba(var(--v-theme-on-surface), .1); }
.target-options :deep(.v-selection-control-group) { display: block; }
.target-option { padding: 12px 14px; border: 1px solid rgba(var(--v-theme-on-surface), .08); }
.segment-card { background: rgba(var(--v-theme-primary), .025); }
.quarter-field { flex: 0 0 130px; }
.catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
.catalog-card { overflow: hidden; }
.empty-catalog { grid-column: 1 / -1; min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: rgba(var(--v-theme-on-surface), .5); }
</style>
