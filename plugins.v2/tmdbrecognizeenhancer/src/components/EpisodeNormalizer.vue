<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginBase: { type: String, required: true },
  runtimeStatus: { type: Object, default: () => ({}) },
})

const now = new Date()
const years = Array.from({ length: now.getFullYear() - 1999 }, (_, index) => now.getFullYear() + 1 - index)
const error = ref('')
const notice = ref('')
const snackbar = ref(false)
const rules = ref([])
const rulesOpen = ref(true)
const ruleSearch = ref('')
const ruleQuarter = ref('all')
const deleteRulesDialog = ref(false)
const deleteRulesLoading = ref(false)
const manualDialog = ref(false)
const manualLoading = ref(false)
const manualMessage = ref('')
const manualForm = ref({
  tmdb_id: '', preference: 'default', specify_quarter: false,
  year: now.getFullYear(), quarter: Math.floor(now.getMonth() / 3) + 1,
})
const catalog = ref([])
const catalogLoading = ref(false)
const batchLoading = ref(false)
const busyId = ref('')
const selectedIds = ref([])
const catalogMeta = ref({})
const board = ref({
  year: now.getFullYear(),
  quarter: Math.floor(now.getMonth() / 3) + 1,
  search: '',
  region: 'all',
  platform: 'all',
  scanStatus: 'all',
  multiOnly: false,
})
const batchPreference = ref('default')
const previewTitle = ref('')
const previewLoading = ref(false)
const previewResult = ref(null)
const editorOpen = ref(false)
const editorLoading = ref(false)
const inspection = ref(null)
const editForm = ref(null)
const failureDialog = ref(false)
const failures = ref([])
const manualTmdb = ref({})
let scanTimer = null

const quarterKey = computed(() => `${board.value.year}-Q${board.value.quarter}`)
const platforms = computed(() => [
  { title: '全部载体', value: 'all' },
  ...Array.from(new Set(catalog.value.map(item => item.platform).filter(Boolean)))
    .sort()
    .map(value => ({ title: value, value })),
])
const filteredCatalog = computed(() => {
  const keyword = board.value.search.trim().toLocaleLowerCase()
  return catalog.value.filter(item => {
    if (board.value.region !== 'all' && item.region !== board.value.region) return false
    if (board.value.platform !== 'all' && item.platform !== board.value.platform) return false
    if (board.value.scanStatus !== 'all' && item.scan_status !== board.value.scanStatus) return false
    if (board.value.multiOnly && !item.is_multi_season) return false
    if (!keyword) return true
    return [item.name, item.name_cn, ...(item.aliases || [])]
      .join(' ')
      .toLocaleLowerCase()
      .includes(keyword)
  })
})
const allFilteredSelected = computed(() => (
  filteredCatalog.value.length > 0
  && filteredCatalog.value.every(item => selectedIds.value.includes(item.id))
))
const selectedGroup = computed(() => inspection.value?.groups?.find(
  item => item.id === editForm.value?.episode_group_id,
))
const ruleQuarterOptions = computed(() => {
  const values = new Set()
  rules.value.forEach(rule => (rule.installments || []).forEach(item => {
    if (item.quarter) values.add(item.quarter)
  }))
  return [
    { title: '全部季度', value: 'all' },
    ...Array.from(values).sort().reverse().map(value => ({ title: value, value })),
    { title: '未分类', value: 'unclassified' },
  ]
})
const filteredRules = computed(() => {
  const keyword = ruleSearch.value.trim().toLocaleLowerCase()
  return rules.value.filter(rule => {
    const quarters = Array.from(new Set((rule.installments || []).map(item => item.quarter).filter(Boolean)))
    if (ruleQuarter.value === 'unclassified' && quarters.length) return false
    if (ruleQuarter.value !== 'all' && ruleQuarter.value !== 'unclassified' && !quarters.includes(ruleQuarter.value)) return false
    if (!keyword) return true
    const haystack = [
      rule.title, rule.tmdb_id,
      ...(rule.installments || []).flatMap(item => [item.title, item.quarter, ...(item.aliases || [])]),
    ].join(' ').toLocaleLowerCase()
    return haystack.includes(keyword)
  })
})
const groupedRules = computed(() => {
  const groups = new Map()
  filteredRules.value.forEach(rule => {
    const quarters = Array.from(new Set((rule.installments || []).map(item => item.quarter).filter(Boolean))).sort().reverse()
    const key = (ruleQuarter.value !== 'all' && ruleQuarter.value !== 'unclassified')
      ? ruleQuarter.value
      : (quarters[0] || '未分类')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(rule)
  })
  return Array.from(groups.entries())
    .sort(([left], [right]) => left === '未分类' ? 1 : right === '未分类' ? -1 : right.localeCompare(left))
    .map(([quarter, items]) => ({ quarter, items }))
})

async function loadRules() {
  const data = unwrapResponse(await props.api.get(`${props.pluginBase}/episode-normalizer`)) || {}
  rules.value = data.rules || []
}

function openManualDialog() {
  manualMessage.value = ''
  manualForm.value = {
    tmdb_id: '', preference: 'default', specify_quarter: false,
    year: board.value.year, quarter: board.value.quarter,
  }
  manualDialog.value = true
}

async function manualAddRule() {
  if (!manualForm.value.tmdb_id) return
  manualLoading.value = true
  manualMessage.value = ''
  try {
    const quarter = manualForm.value.specify_quarter
      ? `${manualForm.value.year}-Q${manualForm.value.quarter}`
      : ''
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/manual-add`,
      { tmdb_id: manualForm.value.tmdb_id, preference: manualForm.value.preference, quarter },
    )) || {}
    if (data.requires_quarter) {
      manualForm.value.specify_quarter = true
      manualMessage.value = `${data.title || `TMDB ${data.tmdb_id}`} 没有可用的季首播日期，请指定归属季度后再次加入。`
      return
    }
    rules.value = data.rules || rules.value
    manualDialog.value = false
    notice.value = `${data.title || `TMDB ${data.tmdb_id}`} 已加入${data.quarter ? ` ${data.quarter}` : ''} 维护规则`
    snackbar.value = true
    await loadQuarter(false, true)
    if (data.needs_attention && data.rule) await openEditor(data.rule)
  } catch (err) {
    manualMessage.value = err?.message || '手动建立规则失败'
  } finally {
    manualLoading.value = false
  }
}

async function deleteFilteredRules() {
  if (!filteredRules.value.length) return
  deleteRulesLoading.value = true
  try {
    const deletedIds = new Set(filteredRules.value.map(rule => Number(rule.tmdb_id)))
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/rule/batch-delete`,
      { tmdb_ids: Array.from(deletedIds) },
    )) || {}
    rules.value = data.rules || []
    catalog.value.forEach(item => {
      if (deletedIds.has(Number(item.tmdb_match?.best?.tmdb_id))) item.maintained = false
    })
    deleteRulesDialog.value = false
    notice.value = `已删除 ${data.deleted || deletedIds.size} 条维护规则`
    snackbar.value = true
  } catch (err) {
    error.value = err?.message || '批量删除维护规则失败'
  } finally {
    deleteRulesLoading.value = false
  }
}

async function loadQuarter(refresh = false, background = false) {
  if (!background) catalogLoading.value = true
  error.value = ''
  if (!background) selectedIds.value = []
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/catalog/query`,
      { year: board.value.year, quarter: board.value.quarter, refresh },
    )) || {}
    catalog.value = data.catalog || []
    catalogMeta.value = data
    if (!platforms.value.some(item => item.value === board.value.platform)) board.value.platform = 'all'
    scheduleScanPoll(Number(data.scanning_count || 0))
  } catch (err) {
    error.value = err?.message || '季度看板加载失败'
    if (!background) catalog.value = []
  } finally {
    if (!background) catalogLoading.value = false
  }
}

function scheduleScanPoll(scanningCount) {
  if (scanTimer) clearTimeout(scanTimer)
  scanTimer = null
  if (scanningCount > 0) {
    scanTimer = setTimeout(() => loadQuarter(false, true), 1800)
  }
}

async function runPreview() {
  if (!previewTitle.value.trim()) return
  previewLoading.value = true
  previewResult.value = null
  error.value = ''
  try {
    previewResult.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/preview`,
      { title: previewTitle.value },
    ))
  } catch (err) {
    error.value = err?.message || '归一化试跑失败'
  } finally {
    previewLoading.value = false
  }
}

async function addCatalogItem(item, preference, tmdbId = '', singleFailure = true) {
  busyId.value = item.id
  error.value = ''
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/catalog/add`,
      { id: item.id, quarter: quarterKey.value, preference, tmdb_id: tmdbId || undefined },
    )) || {}
    const saved = (data.rules || []).some(rule => Number(rule.tmdb_id) === Number(data.tmdb_id))
    if (!data.rule || !data.tmdb_id || !saved) throw new Error('后端未确认规则写入，未标记为已维护')
    rules.value = data.rules || rules.value
    Object.assign(item, data.item || {}, { maintained: true })
    failures.value = failures.value.filter(value => value.id !== item.id)
    notice.value = data.message || `${item.display_name || item.name_cn || item.name} 已加入维护规则`
    snackbar.value = true
    if (data.needs_attention) openEditor(data.rule)
  } catch (err) {
    const failure = {
      id: item.id,
      title: item.display_name || item.name_cn || item.name,
      reason: err?.message || '自动匹配 TMDB 失败',
      item,
      preference,
    }
    failures.value = singleFailure
      ? [failure]
      : [...failures.value.filter(value => value.id !== item.id), failure]
    failureDialog.value = true
  } finally {
    busyId.value = ''
  }
}

async function batchAdd() {
  if (!selectedIds.value.length) return
  batchLoading.value = true
  error.value = ''
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/catalog/batch-add`,
      { quarter: quarterKey.value, ids: selectedIds.value, preference: batchPreference.value },
    )) || {}
    rules.value = data.rules || rules.value
    const savedTmdbIds = new Set((data.rules || []).map(rule => Number(rule.tmdb_id)))
    const addedIds = new Set((data.added || [])
      .filter(item => item.tmdb_id && savedTmdbIds.has(Number(item.tmdb_id)))
      .map(item => item.id))
    catalog.value = data.catalog || catalog.value
    catalog.value.forEach(item => { if (addedIds.has(item.id)) item.maintained = true })
    failures.value = (data.failed || []).map(value => ({
      ...value,
      item: catalog.value.find(item => item.id === value.id),
      preference: batchPreference.value,
    }))
    if (failures.value.length) failureDialog.value = true
    const attention = data.needs_attention?.length || 0
    notice.value = `已加入 ${data.added?.length || 0} 条${attention ? `，其中 ${attention} 条需要补充季度起点` : ''}`
    snackbar.value = true
    selectedIds.value = failures.value.map(item => item.id)
  } catch (err) {
    error.value = err?.message || '批量加入失败'
  } finally {
    batchLoading.value = false
  }
}

async function retryFailure(failure) {
  const tmdbId = manualTmdb.value[failure.id]
  if (!tmdbId || !failure.item) return
  await addCatalogItem(failure.item, failure.preference, tmdbId, false)
  if (!failures.value.length) failureDialog.value = false
}

function toggleAllFiltered() {
  const visible = filteredCatalog.value.map(item => item.id)
  if (allFilteredSelected.value) {
    selectedIds.value = selectedIds.value.filter(id => !visible.includes(id))
  } else {
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...visible]))
  }
}

function ignoreFailure(failure) {
  failures.value = failures.value.filter(value => value.id !== failure.id)
  selectedIds.value = selectedIds.value.filter(id => id !== failure.id)
  delete manualTmdb.value[failure.id]
  if (!failures.value.length) failureDialog.value = false
}

function prepareRule(rule) {
  const cloned = JSON.parse(JSON.stringify(rule))
  cloned.original_tmdb_id = rule.tmdb_id
  cloned.installments = (cloned.installments || []).map(item => ({
    ...item,
    aliases: Array.isArray(item.aliases) ? item.aliases.join('\n') : (item.aliases || ''),
  }))
  return cloned
}

async function openEditor(rule) {
  if (!rule) return
  editForm.value = prepareRule(rule)
  editorOpen.value = true
  inspection.value = null
  await inspectTarget()
}

async function inspectTarget() {
  if (!editForm.value?.tmdb_id) return
  editorLoading.value = true
  try {
    inspection.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/inspect`,
      { tmdb_id: editForm.value.tmdb_id },
    ))
    if (Number(editForm.value.original_tmdb_id) !== Number(editForm.value.tmdb_id) && inspection.value?.title) {
      editForm.value.title = inspection.value.title
      editForm.value.episode_group_id = ''
    }
  } catch (err) {
    error.value = err?.message || '目标编集读取失败'
  } finally {
    editorLoading.value = false
  }
}

async function saveRule() {
  if (!editForm.value) return
  editorLoading.value = true
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/rule`, editForm.value,
    )) || {}
    rules.value = data.rules || rules.value
    await loadQuarter(false, true)
    editorOpen.value = false
    notice.value = '维护规则已保存'
    snackbar.value = true
  } catch (err) {
    error.value = err?.message || '规则保存失败'
  } finally {
    editorLoading.value = false
  }
}

async function deleteRule(rule) {
  busyId.value = `rule-${rule.tmdb_id}`
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/rule/delete`,
      { tmdb_id: rule.tmdb_id },
    )) || {}
    rules.value = data.rules || []
    catalog.value.forEach(item => {
      if (Number(item.tmdb_match?.best?.tmdb_id) === Number(rule.tmdb_id)) item.maintained = false
    })
  } finally {
    busyId.value = ''
  }
}

function addInstallment() {
  editForm.value.installments.push({
    id: `manual-${Date.now()}`,
    title: '', quarter: '', aliases: '', source_season: '', target_start_season: 1, target_start_episode: 1,
  })
}

function groupType(type) {
  return ({ 1: '原始播出', 2: '绝对编号', 3: 'DVD', 4: 'Digital', 5: '故事线', 6: '制片', 7: 'TV' })[type] || `类型 ${type}`
}

watch(() => [board.value.year, board.value.quarter], () => loadQuarter(false))
onBeforeUnmount(() => { if (scanTimer) clearTimeout(scanTimer) })
onMounted(async () => {
  try {
    await Promise.all([loadRules(), loadQuarter(false)])
  } catch (err) {
    error.value = err?.message || '集数归一化数据加载失败'
  }
})
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
      <div v-if="!runtimeStatus.plugin_first">请在 MoviePilot 中开启“识别插件优先”。</div>
    </VAlert>

    <VCard variant="outlined" class="normalizer-card mb-4">
      <VCardItem>
        <template #prepend><VAvatar color="primary" variant="tonal"><VIcon icon="mdi-flask-outline" /></VAvatar></template>
        <VCardTitle>标题试跑</VCardTitle>
        <VCardSubtitle>粘贴原标题，自动解析季集、匹配 TMDB 并检查维护规则</VCardSubtitle>
      </VCardItem>
      <VCardText>
        <div class="preview-line">
          <VTextField
            v-model="previewTitle" label="原标题或完整文件名" hide-details
            prepend-inner-icon="mdi-file-video-outline" @keyup.enter="runPreview"
          />
          <VBtn color="primary" prepend-icon="mdi-play" :loading="previewLoading" @click="runPreview">开始试跑</VBtn>
        </div>
        <VAlert v-if="previewResult" :type="previewResult.result?.applied ? 'success' : 'info'" variant="tonal" class="mt-4">
          <div class="font-weight-bold">
            {{ previewResult.parsed_title || '未提取标题' }}
            <span v-if="previewResult.recognition?.best"> · TMDB {{ previewResult.recognition.best.tmdb_id }}</span>
          </div>
          <div v-if="previewResult.result">
            S{{ previewResult.result.season ?? '?' }}E{{ previewResult.result.episode ?? '?' }}
            <span v-if="previewResult.result.end_episode">-E{{ previewResult.result.end_episode }}</span>
            · {{ previewResult.result.reason }}
          </div>
          <div v-else>{{ previewResult.recognition?.reason || '没有获得可信 TMDB 候选' }}</div>
        </VAlert>
      </VCardText>
    </VCard>

    <VCard variant="outlined" class="normalizer-card mb-4">
      <VCardItem>
        <template #prepend><VAvatar color="success" variant="tonal"><VIcon icon="mdi-playlist-check" /></VAvatar></template>
        <VCardTitle>已维护规则</VCardTitle>
        <VCardSubtitle>{{ rules.length }} 个 TMDB 条目；规则固定显示在季度看板前</VCardSubtitle>
        <template #append>
          <VBtn
            :icon="rulesOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" variant="text"
            :title="rulesOpen ? '收起规则' : '展开规则'" @click="rulesOpen = !rulesOpen"
          />
        </template>
      </VCardItem>
      <VExpandTransition>
        <div v-show="rulesOpen" class="rules-scroll">
          <div class="rules-controls pa-4 pt-0">
            <VTextField
              v-model="ruleSearch" label="搜索标题、别名或 TMDBID" prepend-inner-icon="mdi-magnify"
              clearable hide-details density="compact"
            />
            <VSelect v-model="ruleQuarter" :items="ruleQuarterOptions" label="按季度查看" hide-details density="compact" />
            <VBtn color="primary" variant="tonal" prepend-icon="mdi-plus" @click="openManualDialog">手动添加</VBtn>
            <VBtn
              color="error" variant="tonal" prepend-icon="mdi-delete-sweep-outline"
              :disabled="!filteredRules.length" @click="deleteRulesDialog = true"
            >删除当前结果 {{ filteredRules.length || '' }}</VBtn>
          </div>
          <div v-for="group in groupedRules" :key="group.quarter" class="rule-group px-4 pb-4">
            <div class="rule-group-title mb-2">
              <VIcon icon="mdi-calendar-month-outline" size="18" />
              <strong>{{ group.quarter }}</strong>
              <span class="text-caption text-medium-emphasis">{{ group.items.length }} 条</span>
            </div>
            <div class="rules-grid">
              <VCard v-for="rule in group.items" :key="rule.tmdb_id" variant="tonal" class="rule-card">
                <VCardText class="d-flex align-center ga-3">
                  <VAvatar :color="rule.enabled ? 'success' : 'default'" variant="tonal"><VIcon icon="mdi-animation-outline" /></VAvatar>
                  <div class="flex-grow-1 min-w-0">
                    <div class="font-weight-bold text-truncate">{{ rule.title }}</div>
                    <div class="text-caption text-medium-emphasis">TMDB {{ rule.tmdb_id }} · {{ rule.target_type === 'group' ? '剧集组' : '默认编集' }} · {{ rule.installments?.length || 0 }} 个季度片段</div>
                    <div v-if="rule.installments?.some(item => item.quarter)" class="d-flex flex-wrap ga-1 mt-1">
                      <VChip
                        v-for="quarter in Array.from(new Set(rule.installments.map(item => item.quarter).filter(Boolean))).sort().reverse()"
                        :key="quarter" size="x-small" variant="outlined"
                      >{{ quarter }}</VChip>
                    </div>
                  </div>
                  <VBtn icon="mdi-pencil-outline" variant="text" @click="openEditor(rule)" />
                  <VBtn icon="mdi-delete-outline" variant="text" color="error" :loading="busyId === `rule-${rule.tmdb_id}`" @click="deleteRule(rule)" />
                </VCardText>
              </VCard>
            </div>
          </div>
          <div v-if="!filteredRules.length" class="empty-rules">当前季度或搜索条件下没有维护规则。</div>
        </div>
      </VExpandTransition>
    </VCard>

    <VCard variant="outlined" class="normalizer-card mb-4">
      <VCardItem>
        <template #prepend><VAvatar color="secondary" variant="tonal"><VIcon icon="mdi-view-dashboard-outline" /></VAvatar></template>
        <VCardTitle>季度番剧看板</VCardTitle>
        <VCardSubtitle>AniList 季度目录 · AniBridge/TMDB 匹配；当前仅显示 {{ quarterKey }}</VCardSubtitle>
        <template #append><VBtn icon="mdi-refresh" variant="text" :loading="catalogLoading" @click="loadQuarter(true)" /></template>
      </VCardItem>
      <VCardText>
        <div class="board-controls mb-3">
          <VSelect v-model="board.year" :items="years" label="年份" hide-details density="compact" />
          <VSelect v-model="board.quarter" :items="[1,2,3,4].map(value => ({ title: `Q${value}`, value }))" label="季度" hide-details density="compact" />
          <VTextField v-model="board.search" label="搜索番剧" prepend-inner-icon="mdi-magnify" clearable hide-details density="compact" />
          <VSelect
            v-model="board.region" label="地区" hide-details density="compact"
            :items="[{title:'全部地区',value:'all'},{title:'日漫',value:'japan'},{title:'国漫',value:'china'},{title:'海外动画',value:'western'},{title:'地区未知',value:'unknown'}]"
          />
          <VSelect v-model="board.platform" :items="platforms" label="载体" hide-details density="compact" />
          <VSelect
            v-model="board.scanStatus" label="扫描状态" hide-details density="compact"
            :items="[{title:'全部状态',value:'all'},{title:'正在扫描',value:'scanning'},{title:'已匹配',value:'matched'},{title:'匹配失败',value:'failed'}]"
          />
          <VSwitch v-model="board.multiOnly" label="仅续作/多季" color="secondary" hide-details density="compact" />
        </div>

        <div class="batch-bar mb-4">
          <VCheckbox
            :model-value="allFilteredSelected" :indeterminate="selectedIds.length > 0 && !allFilteredSelected"
            label="选择当前筛选结果" hide-details density="compact" @click="toggleAllFiltered"
          />
          <VSpacer />
          <VSelect
            v-model="batchPreference" class="batch-target" hide-details density="compact"
            :items="[{title:'优先 TMDB 默认编集',value:'default'},{title:'优先剧集组（Production/Season）',value:'group_preferred'}]"
          />
          <VBtn
            color="secondary" prepend-icon="mdi-playlist-plus" :loading="batchLoading"
            :disabled="!selectedIds.length" @click="batchAdd"
          >批量加入 {{ selectedIds.length || '' }}</VBtn>
        </div>

        <VProgressLinear v-if="catalogLoading" indeterminate color="secondary" class="mb-4" />
        <div class="text-caption text-medium-emphasis mb-3">
          当前 {{ filteredCatalog.length }} / {{ catalog.length }} 条
          <span v-if="catalogMeta.scanning_count"> · {{ catalogMeta.scanning_count }} 条正在扫描</span>
          <span v-if="catalogMeta.updated_at"> · 更新于 {{ catalogMeta.updated_at }}</span>
        </div>
        <div class="catalog-grid">
          <VCard v-for="item in filteredCatalog" :key="item.id" variant="outlined" class="catalog-card">
            <div class="select-corner"><VCheckbox v-model="selectedIds" :value="item.id" hide-details density="compact" /></div>
            <VImg v-if="item.poster" :src="item.poster" height="170" cover />
            <VCardItem>
              <VCardTitle class="text-subtitle-1 text-wrap">{{ item.display_name || item.name_cn || item.name }}</VCardTitle>
              <VCardSubtitle>{{ item.date || '日期未知' }} · {{ item.episode_count || '?' }} 集</VCardSubtitle>
            </VCardItem>
            <VCardText class="pt-0">
              <div class="d-flex flex-wrap ga-1">
                <VChip v-if="item.region_name" size="x-small" variant="tonal">{{ item.region_name }}</VChip>
                <VChip v-if="item.platform" size="x-small" variant="tonal">{{ item.platform }}</VChip>
                <VChip v-if="item.is_multi_season" size="x-small" color="secondary" variant="tonal">续作/多季</VChip>
                <VChip v-if="item.scan_status === 'scanning'" size="x-small" color="info" variant="tonal">
                  <VProgressCircular indeterminate size="11" width="2" class="me-1" />正在扫描
                </VChip>
                <VChip v-else-if="item.scan_status === 'failed'" size="x-small" color="warning" variant="tonal">匹配待补充</VChip>
                <VChip v-if="item.maintained" size="x-small" color="success" prepend-icon="mdi-check">已维护</VChip>
              </div>
              <div v-if="item.tmdb_match?.best" class="text-caption text-medium-emphasis mt-2">
                TMDB {{ item.tmdb_match.best.tmdb_id }} · {{ item.tmdb_match.best.name }}
              </div>
            </VCardText>
            <VCardActions>
              <VMenu v-if="!item.maintained">
                <template #activator="{ props: menuProps }">
                  <VBtn v-bind="menuProps" color="primary" variant="tonal" append-icon="mdi-menu-down" :loading="busyId === item.id">加入规则</VBtn>
                </template>
                <VList density="compact">
                  <VListItem title="使用 TMDB 默认编集" prepend-icon="mdi-database-outline" @click="addCatalogItem(item, 'default')" />
                  <VListItem title="优先 Production/Season 剧集组" prepend-icon="mdi-animation-outline" @click="addCatalogItem(item, 'group_preferred')" />
                </VList>
              </VMenu>
              <VBtn
                v-else variant="text" prepend-icon="mdi-pencil-outline"
                @click="openEditor(rules.find(rule => Number(rule.tmdb_id) === Number(item.tmdb_match?.best?.tmdb_id)))"
              >编辑规则</VBtn>
            </VCardActions>
          </VCard>
          <div v-if="!catalogLoading && !filteredCatalog.length" class="empty-catalog">
            <VIcon icon="mdi-calendar-search" size="48" /><div>当前筛选条件没有番剧</div>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VDialog v-model="manualDialog" max-width="620">
      <VCard>
        <VCardItem>
          <VCardTitle>手动添加维护规则</VCardTitle>
          <VCardSubtitle>适用于季度看板中没有收录的电视剧或动画</VCardSubtitle>
          <template #append><VBtn icon="mdi-close" variant="text" @click="manualDialog = false" /></template>
        </VCardItem>
        <VDivider />
        <VCardText>
          <VAlert v-if="manualMessage" type="warning" variant="tonal" density="compact" class="mb-4">{{ manualMessage }}</VAlert>
          <VTextField v-model.number="manualForm.tmdb_id" label="TMDBID" type="number" prepend-inner-icon="mdi-database-search" />
          <VSelect
            v-model="manualForm.preference" label="目标编集"
            :items="[{title:'使用 TMDB 默认编集',value:'default'},{title:'优先 Production/Season 剧集组',value:'group_preferred'}]"
          />
          <VSwitch v-model="manualForm.specify_quarter" label="手动指定归属季度" color="primary" hide-details class="mb-3" />
          <VRow v-if="manualForm.specify_quarter" dense>
            <VCol cols="7"><VSelect v-model="manualForm.year" :items="years" label="年份" /></VCol>
            <VCol cols="5"><VSelect v-model="manualForm.quarter" :items="[1,2,3,4].map(value => ({title:`Q${value}`,value}))" label="季度" /></VCol>
          </VRow>
          <div class="text-caption text-medium-emphasis">
            不指定时会根据 TMDB 最新有效季的首播日期自动归类；TMDB 缺少日期时会提示补充。
          </div>
        </VCardText>
        <VDivider />
        <VCardActions class="pa-4">
          <VSpacer /><VBtn variant="text" @click="manualDialog = false">取消</VBtn>
          <VBtn color="primary" :loading="manualLoading" :disabled="!manualForm.tmdb_id" @click="manualAddRule">读取并加入</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="deleteRulesDialog" max-width="520">
      <VCard>
        <VCardItem>
          <VCardTitle>删除当前筛选结果？</VCardTitle>
          <VCardSubtitle>将删除 {{ filteredRules.length }} 条维护规则，季度看板数据不会被删除</VCardSubtitle>
        </VCardItem>
        <VCardText>此操作会立即停止这些 TMDB 条目的集数归一化，请确认当前季度和搜索条件正确。</VCardText>
        <VCardActions class="pa-4">
          <VSpacer /><VBtn variant="text" @click="deleteRulesDialog = false">取消</VBtn>
          <VBtn color="error" :loading="deleteRulesLoading" @click="deleteFilteredRules">确认删除</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="editorOpen" max-width="820" scrollable>
      <VCard v-if="editForm">
        <VCardItem>
          <VCardTitle>编辑维护规则</VCardTitle>
          <VCardSubtitle>{{ editForm.title }} · TMDB {{ editForm.tmdb_id }}</VCardSubtitle>
          <template #append><VBtn icon="mdi-close" variant="text" @click="editorOpen = false" /></template>
        </VCardItem>
        <VDivider />
        <VCardText>
          <div class="d-flex align-center ga-3 mb-4">
            <VSwitch v-model="editForm.enabled" label="启用规则" color="success" hide-details />
            <VSpacer /><VBtn variant="tonal" prepend-icon="mdi-refresh" :loading="editorLoading" @click="inspectTarget">刷新编集</VBtn>
          </div>
          <div class="tmdb-correction mb-4">
            <VTextField v-model.number="editForm.tmdb_id" label="TMDBID" type="number" hide-details />
            <VBtn variant="tonal" prepend-icon="mdi-database-search" :loading="editorLoading" @click="inspectTarget">读取并校验</VBtn>
          </div>
          <VAlert
            v-if="Number(editForm.original_tmdb_id) !== Number(editForm.tmdb_id)"
            type="warning" variant="tonal" density="compact" class="mb-4"
          >保存后将用 TMDB {{ editForm.tmdb_id }} 替换原规则 TMDB {{ editForm.original_tmdb_id }}</VAlert>
          <VRadioGroup v-model="editForm.target_type" hide-details>
            <VRadio value="default" label="TMDB 默认编集" />
            <VRadio value="group" label="TMDB 剧集组" />
          </VRadioGroup>
          <VSelect
            v-if="editForm.target_type === 'group'" v-model="editForm.episode_group_id" class="mt-3"
            :items="(inspection?.groups || []).map(group => ({ title: `${group.name} · ${groupType(group.type)} · ${group.episode_count} 集`, value: group.id }))"
            label="目标剧集组"
          />
          <div v-if="selectedGroup" class="text-caption text-medium-emphasis mb-4">
            <span v-for="season in selectedGroup.seasons || []" :key="season.season" class="me-3">S{{ season.season }} · {{ season.episode_count }} 集</span>
          </div>
          <div class="d-flex align-center mb-2"><strong>季度片段</strong><VSpacer /><VBtn size="small" variant="tonal" prepend-icon="mdi-plus" @click="addInstallment">添加</VBtn></div>
          <VExpansionPanels variant="accordion">
            <VExpansionPanel v-for="(item, index) in editForm.installments" :key="item.id || index">
              <VExpansionPanelTitle>{{ item.title || `季度片段 ${index + 1}` }} · S{{ item.target_start_season }}E{{ item.target_start_episode }}</VExpansionPanelTitle>
              <VExpansionPanelText>
                <VRow dense>
                  <VCol cols="12" sm="6"><VTextField v-model="item.title" label="片段名称" /></VCol>
                  <VCol cols="12" sm="3"><VTextField v-model="item.quarter" label="季度" /></VCol>
                  <VCol cols="12" sm="3"><VTextField v-model="item.source_season" label="来源季" type="number" /></VCol>
                  <VCol cols="12"><VTextarea v-model="item.aliases" label="命中别名（每行一个）" rows="2" auto-grow /></VCol>
                  <VCol cols="6"><VTextField v-model="item.target_start_season" label="目标起始季" type="number" /></VCol>
                  <VCol cols="6"><VTextField v-model="item.target_start_episode" label="目标起始集" type="number" /></VCol>
                </VRow>
                <VBtn color="error" variant="text" prepend-icon="mdi-delete-outline" @click="editForm.installments.splice(index, 1)">删除片段</VBtn>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </VCardText>
        <VDivider />
        <VCardActions class="pa-4"><VSpacer /><VBtn variant="text" @click="editorOpen = false">取消</VBtn><VBtn color="primary" :loading="editorLoading" @click="saveRule">保存规则</VBtn></VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="failureDialog" max-width="720">
      <VCard>
        <VCardItem><VCardTitle>这些番剧未能自动匹配</VCardTitle><VCardSubtitle>补充正确 TMDBID 后重试，或直接放弃该条目</VCardSubtitle></VCardItem>
        <VDivider />
        <VList lines="three">
          <VListItem v-for="failure in failures" :key="failure.id" :title="failure.title" :subtitle="failure.reason">
            <template #append>
              <div class="manual-match">
                <VTextField v-model="manualTmdb[failure.id]" label="TMDBID" type="number" hide-details density="compact" />
                <VBtn color="primary" variant="tonal" :loading="busyId === failure.id" @click="retryFailure(failure)">补充并加入</VBtn>
                <VBtn variant="text" color="medium-emphasis" @click="ignoreFailure(failure)">忽略</VBtn>
              </div>
            </template>
          </VListItem>
        </VList>
        <VCardActions><VSpacer /><VBtn @click="failureDialog = false">关闭</VBtn></VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar v-model="snackbar" color="success" timeout="3500">{{ notice }}</VSnackbar>
  </div>
</template>

<style scoped>
.normalizer-card { border-color: rgba(var(--v-theme-on-surface), .1); }
.preview-line { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center; }
.board-controls { display: grid; grid-template-columns: 110px 100px minmax(210px, 1fr) 135px 135px 135px auto; gap: 10px; align-items: center; }
.batch-bar { display: flex; gap: 12px; align-items: center; padding: 10px 12px; border-radius: 12px; background: rgba(var(--v-theme-secondary), .055); }
.batch-target { max-width: 280px; }
.catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(245px, 1fr)); gap: 14px; }
.catalog-card { position: relative; overflow: hidden; }
.select-corner { position: absolute; z-index: 2; inset-block-start: 6px; inset-inline-start: 6px; border-radius: 10px; background: rgba(var(--v-theme-surface), .9); }
.rules-controls { display: grid; grid-template-columns: minmax(220px, 1fr) 160px auto auto; gap: 10px; align-items: center; }
.rules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 10px; }
.rules-scroll { max-height: 480px; overflow-y: auto; }
.rule-group-title { display: flex; align-items: center; gap: 7px; color: rgba(var(--v-theme-on-surface), .82); }
.rule-card { border: 1px solid rgba(var(--v-theme-success), .1); }
.empty-catalog, .empty-rules { grid-column: 1 / -1; min-height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: rgba(var(--v-theme-on-surface), .55); }
.manual-match { display: grid; grid-template-columns: 120px auto auto; gap: 8px; align-items: center; min-width: 350px; }
.tmdb-correction { display: grid; grid-template-columns: minmax(180px, 1fr) auto; gap: 10px; align-items: center; }
@media (max-width: 1000px) {
  .board-controls, .rules-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 700px) {
  .preview-line { grid-template-columns: 1fr; }
  .board-controls { grid-template-columns: 1fr; }
  .rules-controls { grid-template-columns: 1fr; }
  .batch-bar { align-items: stretch; flex-direction: column; }
  .batch-target { max-width: none; }
  .rules-grid { grid-template-columns: 1fr; }
  .manual-match { grid-template-columns: 1fr; min-width: 160px; }
  .tmdb-correction { grid-template-columns: 1fr; }
}
</style>
