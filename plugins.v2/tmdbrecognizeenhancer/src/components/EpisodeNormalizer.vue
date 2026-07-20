<script setup>
import { computed, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue'
import { unwrapResponse } from '../utils'
import ModuleHeader from './ModuleHeader.vue'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginBase: { type: String, required: true },
  runtimeStatus: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['config-saved'])

const now = new Date()
const uiStateKey = 'tmdbrecognizeenhancer:episode-normalizer-ui:v1'
const years = Array.from({ length: now.getFullYear() - 1999 }, (_, index) => now.getFullYear() + 1 - index)
const error = ref('')
const notice = ref('')
const snackbar = ref(false)
const snackbarColor = ref('success')
const subModule = ref('rules')
const rules = ref([])
const rulesOpen = ref(true)
const ruleView = ref('grid')
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
const boardView = ref('grid')
const editorOpen = ref(false)
const editorLoading = ref(false)
const inspection = ref(null)
const editForm = ref(null)
const failureDialog = ref(false)
const failures = ref([])
const manualTmdb = ref({})
const embySync = ref({
  available: true, enabled: false, active: false, worker_running: false,
  servers: [], jobs: [], counts: {},
  config: {
    enabled: false, servers: [], initial_delay_seconds: 15, retry_seconds: 30,
    max_wait_minutes: 15, path_mappings: [], conflict_policy: 'skip', refresh_metadata: true,
  },
})
const embyLoading = ref(false)
const embySaving = ref(false)
const embyPreviewing = ref(false)
const embyApplyingAll = ref('')
const embyPreview = ref(null)
const embyPreviewRule = ref('')
const embyPreviewPath = ref('')
let scanTimer = null
let persistTimer = null
let embyTimer = null
let initialized = false
let componentActive = true

function showNotice(message, color = 'success') {
  notice.value = message
  snackbarColor.value = color
  snackbar.value = true
}

const quarterKey = computed(() => `${board.value.year}-Q${board.value.quarter}`)
const platforms = computed(() => [
  { title: '全部载体', value: 'all' },
  ...Array.from(new Set(catalog.value.map(item => item.platform).filter(Boolean)))
    .sort()
    .map(value => ({ title: value, value })),
])
const filteredCatalog = computed(() => {
  const keyword = String(board.value.search || '').trim().toLocaleLowerCase()
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
const selectedIdSet = computed(() => new Set(selectedIds.value))
const allFilteredSelected = computed(() => (
  filteredCatalog.value.length > 0
  && filteredCatalog.value.every(item => selectedIdSet.value.has(item.id))
))
const ruleByTmdbId = computed(() => new Map(
  rules.value.map(rule => [Number(rule.tmdb_id), rule]),
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
  const keyword = String(ruleSearch.value || '').trim().toLocaleLowerCase()
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
const embyServerItems = computed(() => (embySync.value.servers || []).map(item => ({
  title: `${item.name}${item.connected ? '' : '（未连接）'}`,
  value: item.name,
})))
const embyGroupRuleItems = computed(() => rules.value
  .filter(rule => rule.enabled && rule.target_type === 'group' && rule.episode_group_id)
  .map(rule => ({
    title: `${rule.title} · TMDB ${rule.tmdb_id}`,
    value: `${rule.tmdb_id}|${rule.episode_group_id}`,
  })))
const embyStatusText = computed(() => {
  if (!embySync.value.available) return '当前 MoviePilot 不支持媒体服务器服务目录'
  if (!embySync.value.config?.enabled) return '已停用'
  if (!embySync.value.active) return '等待插件总开关与集数偏移模块'
  if (!embySync.value.servers?.length) return '未配置 Emby'
  return embySync.value.worker_running ? '正在监听整理入库' : '后台工作器未运行'
})

async function loadEmbySync(background = false) {
  if (!background) embyLoading.value = true
  try {
    embySync.value = unwrapResponse(await props.api.get(
      `${props.pluginBase}/episode-normalizer/emby-sync`,
    )) || embySync.value
    scheduleEmbyPoll()
  } catch (err) {
    if (!background) error.value = err?.message || 'Emby 剧集组联动状态加载失败'
  } finally {
    if (!background) embyLoading.value = false
  }
}

function scheduleEmbyPoll() {
  if (embyTimer) clearTimeout(embyTimer)
  embyTimer = null
  if (componentActive && subModule.value === 'emby' && Number(embySync.value.counts?.pending || 0) > 0) {
    embyTimer = setTimeout(() => loadEmbySync(true), 5000)
  }
}

async function saveEmbySync() {
  embySaving.value = true
  error.value = ''
  try {
    const saved = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/emby-sync/config`, embySync.value.config,
    )) || embySync.value
    embySync.value = saved
    emit('config-saved', saved)
    showNotice('Emby 剧集组联动设置已保存')
    scheduleEmbyPoll()
  } catch (err) {
    error.value = err?.message || '联动设置保存失败'
  } finally {
    embySaving.value = false
  }
}

function addPathMapping() {
  if (!Array.isArray(embySync.value.config.path_mappings)) embySync.value.config.path_mappings = []
  embySync.value.config.path_mappings.push({ server: '*', source: '', target: '' })
}

async function previewEmbySync() {
  const [tmdbId, groupId] = String(embyPreviewRule.value || '').split('|')
  if (!tmdbId || !groupId || !embyPreviewPath.value) return
  embyPreviewing.value = true
  error.value = ''
  try {
    embyPreview.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/emby-sync/preview`,
      {
        tmdb_id: Number(tmdbId), episode_group_id: groupId,
        target_path: embyPreviewPath.value, servers: embySync.value.config.servers,
      },
    ))
  } catch (err) {
    error.value = err?.message || 'Emby 定位试跑失败'
  } finally {
    embyPreviewing.value = false
  }
}

async function applyAllEmbyCandidates(server, result) {
  const [tmdbId, groupId] = String(embyPreviewRule.value || '').split('|')
  const count = Number(result?.candidate_count || result?.candidates?.length || 0)
  if (!tmdbId || !groupId || !server || count < 1) return
  const policy = result?.conflict_policy === 'overwrite'
    ? '已有不同 TmdbEg 的条目也会按当前设置覆盖。'
    : '已有不同 TmdbEg 的条目会按当前安全策略跳过。'
  if (!window.confirm(`确认处理 ${server} 中全部 ${count} 个同 TMDBID Series？${policy}`)) return
  embyApplyingAll.value = server
  error.value = ''
  try {
    const outcome = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/emby-sync/apply-all`,
      {
        tmdb_id: Number(tmdbId), episode_group_id: groupId,
        target_path: embyPreviewPath.value, servers: [server],
      },
    )) || {}
    const serverResult = outcome.results?.[server]
    if (!serverResult) throw new Error(outcome.reason || `${server} 没有返回处理结果`)
    if (serverResult) {
      embyPreview.value = {
        ...(embyPreview.value || {}),
        results: { ...(embyPreview.value?.results || {}), [server]: serverResult },
      }
    }
    showNotice(`${server}：${serverResult.reason}`, embyResultColor(serverResult.status))
    await loadEmbySync(true)
  } catch (err) {
    error.value = err?.message || '批量写入 Emby 剧集组失败'
  } finally {
    embyApplyingAll.value = ''
  }
}

async function retryEmbyJob(jobId = '') {
  embyLoading.value = true
  try {
    embySync.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/emby-sync/retry`, { job_id: jobId },
    )) || embySync.value
    scheduleEmbyPoll()
  } catch (err) {
    error.value = err?.message || '任务重新排队失败'
  } finally {
    embyLoading.value = false
  }
}

async function deleteEmbyJob(jobId = '') {
  embyLoading.value = true
  try {
    embySync.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/emby-sync/delete`,
      jobId ? { job_id: jobId } : { finished_only: true },
    )) || embySync.value
  } catch (err) {
    error.value = err?.message || '任务删除失败'
  } finally {
    embyLoading.value = false
  }
}

function embyResultColor(status) {
  if (['updated', 'already', 'ready', 'completed'].includes(status)) return 'success'
  if (['pending', 'running'].includes(status)) return 'info'
  if (['conflict', 'ambiguous', 'unsupported', 'partial', 'attention', 'timeout'].includes(status)) return 'warning'
  return 'error'
}

function embyResultText(status) {
  return ({
    ready: '定位成功', updated: '已写入', already: '已正确配置', pending: '等待入库',
    running: '正在处理', completed: '全部完成', attention: '需要处理', timeout: '等待超时',
    conflict: '已有冲突', ambiguous: '定位歧义', unsupported: '神医不支持', error: '请求失败',
    partial: '部分完成',
  })[status] || status || '未知'
}

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
    showNotice(`${data.title || `TMDB ${data.tmdb_id}`} 已加入${data.quarter ? ` ${data.quarter}` : ''} 维护规则`)
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
    showNotice(`已删除 ${data.deleted || deletedIds.size} 条维护规则`)
  } catch (err) {
    error.value = err?.message || '批量删除维护规则失败'
  } finally {
    deleteRulesLoading.value = false
  }
}

async function loadQuarter(refresh = false, background = false) {
  if (!background) catalogLoading.value = true
  error.value = ''
  if (!background) {
    selectedIds.value = []
  }
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
  if (componentActive && scanningCount > 0) {
    scanTimer = setTimeout(() => loadQuarter(false, true), 1800)
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
    showNotice(data.message || `${item.display_name || item.name_cn || item.name} 已加入维护规则`)
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
    showNotice(`已加入 ${data.added?.length || 0} 条${attention ? `，其中 ${attention} 条需要补充季度起点` : ''}`)
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
  const filteredIds = filteredCatalog.value.map(item => item.id)
  const filteredIdSet = new Set(filteredIds)
  if (allFilteredSelected.value) {
    selectedIds.value = selectedIds.value.filter(id => !filteredIdSet.has(id))
  } else {
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...filteredIds]))
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
    showNotice('维护规则已保存')
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
    title: '', quarter: '', aliases: '', source_season: '', source_start_episode: '',
    target_start_season: 1, target_start_episode: 1,
  })
}

function groupType(type) {
  return ({ 1: '原始播出', 2: '绝对编号', 3: 'DVD', 4: 'Digital', 5: '故事线', 6: '制片', 7: 'TV' })[type] || `类型 ${type}`
}

function applyTargetRecommendation() {
  const recommendation = inspection.value?.recommendation
  if (!recommendation || !editForm.value) return
  editForm.value.target_type = recommendation.target_type || 'default'
  editForm.value.episode_group_id = recommendation.target_type === 'group'
    ? (recommendation.episode_group_id || '')
    : ''
}

function restoreUiState() {
  try {
    const saved = JSON.parse(localStorage.getItem(uiStateKey) || '{}')
    if (saved.board && typeof saved.board === 'object') Object.assign(board.value, saved.board)
    if (typeof saved.ruleSearch === 'string') ruleSearch.value = saved.ruleSearch
    if (typeof saved.ruleQuarter === 'string') ruleQuarter.value = saved.ruleQuarter
    if (typeof saved.batchPreference === 'string') batchPreference.value = saved.batchPreference
    if (typeof saved.rulesOpen === 'boolean') rulesOpen.value = saved.rulesOpen
    if (['grid', 'list', 'compact'].includes(saved.ruleView)) ruleView.value = saved.ruleView
    if (['grid', 'list', 'compact'].includes(saved.boardView)) boardView.value = saved.boardView
    if (['rules', 'catalog', 'emby'].includes(saved.subModule)) subModule.value = saved.subModule
  } catch (_) {
    // 浏览器禁用存储或旧数据损坏时使用默认值。
  }
}

function persistUiState() {
  try {
    localStorage.setItem(uiStateKey, JSON.stringify({
      board: board.value,
      ruleSearch: ruleSearch.value,
      ruleQuarter: ruleQuarter.value,
      batchPreference: batchPreference.value,
      rulesOpen: rulesOpen.value,
      ruleView: ruleView.value,
      boardView: boardView.value,
      subModule: subModule.value,
    }))
  } catch (_) {
    // 无痕模式下存储失败不影响功能。
  }
}

function schedulePersistUiState() {
  if (persistTimer) clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    persistTimer = null
    persistUiState()
  }, 220)
}

restoreUiState()
watch(() => [board.value.year, board.value.quarter], () => {
  if (subModule.value === 'catalog') loadQuarter(false)
})
watch(subModule, value => {
  schedulePersistUiState()
  if (value === 'catalog' && initialized && !catalog.value.length) loadQuarter(false)
  if (value === 'emby' && initialized) loadEmbySync(false)
})
watch(
  [board, ruleSearch, ruleQuarter, batchPreference, rulesOpen, ruleView, boardView, subModule],
  schedulePersistUiState,
  { deep: true },
)
onActivated(() => {
  componentActive = true
  if (initialized && subModule.value === 'catalog') loadQuarter(false, true)
  if (initialized && subModule.value === 'emby') loadEmbySync(true)
})
onDeactivated(() => {
  componentActive = false
  if (scanTimer) clearTimeout(scanTimer)
  scanTimer = null
  if (embyTimer) clearTimeout(embyTimer)
  embyTimer = null
})
onBeforeUnmount(() => {
  if (scanTimer) clearTimeout(scanTimer)
  if (persistTimer) clearTimeout(persistTimer)
  if (embyTimer) clearTimeout(embyTimer)
})
onMounted(async () => {
  try {
    await Promise.all([
      loadRules(),
      subModule.value === 'catalog' ? loadQuarter(false) : Promise.resolve(),
      subModule.value === 'emby' ? loadEmbySync(false) : Promise.resolve(),
    ])
    initialized = true
  } catch (err) {
    error.value = err?.message || '集数偏移数据加载失败'
  }
})
</script>

<template>
  <div class="episode-normalizer">
    <ModuleHeader icon="mdi-animation-outline" title="集数偏移" subtitle="将片源的季集坐标归一化到 TMDB 默认编集或指定剧集组，并可联动 Emby 元数据。" color="success">
      <template #actions>
        <VChip :color="runtimeStatus.runtime_compatible ? 'success' : 'warning'" variant="tonal" size="small" :prepend-icon="runtimeStatus.runtime_compatible ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'">
          {{ runtimeStatus.runtime_compatible ? `${rules.length} 条维护规则` : '运行时不兼容' }}
        </VChip>
      </template>
      <template #controls>
        <VTabs v-model="subModule" color="primary" show-arrows class="module-header-tabs">
          <VTab value="rules" prepend-icon="mdi-playlist-check">偏移规则维护</VTab>
          <VTab value="catalog" prepend-icon="mdi-view-dashboard-outline">季度番剧看板</VTab>
          <VTab value="emby" prepend-icon="mdi-server-network">Emby 剧集组联动</VTab>
        </VTabs>
      </template>
    </ModuleHeader>
    <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</VAlert>
    <VAlert v-if="!runtimeStatus.runtime_compatible" type="warning" variant="tonal" class="mb-4">
      <div class="font-weight-bold">集数偏移暂不能接管实际整理</div>
      <div>{{ runtimeStatus.runtime_message }}</div>
    </VAlert>

    <VCard v-show="subModule === 'rules'" variant="outlined" class="normalizer-card mb-4">
      <VCardItem>
        <template #prepend><VAvatar color="success" variant="tonal"><VIcon icon="mdi-playlist-check" /></VAvatar></template>
        <VCardTitle>已维护规则</VCardTitle>
        <VCardSubtitle>{{ rules.length }} 个 TMDB 条目；定义来源集数到目标编集的映射</VCardSubtitle>
        <template #append>
          <VBtn
            :icon="rulesOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" variant="text"
            :title="rulesOpen ? '收起规则' : '展开规则'" @click="rulesOpen = !rulesOpen"
          />
        </template>
      </VCardItem>
      <VExpandTransition>
        <div v-if="rulesOpen" class="rules-scroll">
          <div class="rules-controls pa-4 pt-4">
            <VTextField
              v-model="ruleSearch" label="搜索标题、别名或 TMDBID" prepend-inner-icon="mdi-magnify"
              clearable hide-details density="compact"
            />
            <VSelect v-model="ruleQuarter" :items="ruleQuarterOptions" label="按季度查看" hide-details density="compact" />
            <VBtnToggle v-model="ruleView" mandatory density="compact" variant="outlined" divided>
              <VBtn value="grid" icon="mdi-view-grid-outline" title="平铺" />
              <VBtn value="list" icon="mdi-view-list-outline" title="列表" />
              <VBtn value="compact" icon="mdi-view-headline" title="紧凑" />
            </VBtnToggle>
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
            <div :class="['rules-grid', `view-${ruleView}`]">
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

    <VCard v-show="subModule === 'catalog'" variant="outlined" class="normalizer-card mb-4">
      <VCardItem>
        <template #prepend><VAvatar color="secondary" variant="tonal"><VIcon icon="mdi-view-dashboard-outline" /></VAvatar></template>
        <VCardTitle>季度番剧看板</VCardTitle>
        <VCardSubtitle>AniList 日漫主目录 · Bangumi/TMDB 补充国漫与海外动画；当前仅显示 {{ quarterKey }}</VCardSubtitle>
        <template #append>
          <div class="d-flex align-center ga-2">
            <VBtnToggle v-model="boardView" mandatory density="compact" variant="outlined" divided>
              <VBtn value="grid" icon="mdi-view-grid-outline" title="平铺" />
              <VBtn value="list" icon="mdi-view-list-outline" title="列表" />
              <VBtn value="compact" icon="mdi-view-headline" title="紧凑" />
            </VBtnToggle>
            <VBtn icon="mdi-refresh" variant="text" :loading="catalogLoading" @click="loadQuarter(true)" />
          </div>
        </template>
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
        <div :class="['catalog-grid', `view-${boardView}`]">
          <VCard v-for="item in filteredCatalog" :key="item.id" variant="outlined" class="catalog-card">
            <div class="select-corner"><VCheckbox v-model="selectedIds" :value="item.id" hide-details density="compact" /></div>
            <div class="catalog-card-layout">
              <VImg v-if="item.poster" :src="item.poster" cover class="catalog-poster" />
              <div v-else class="catalog-poster catalog-poster-placeholder"><VIcon icon="mdi-image-off-outline" size="30" /></div>
              <VCardItem class="catalog-summary">
                <VCardTitle class="text-subtitle-1 text-wrap">{{ item.display_name || item.name_cn || item.name }}</VCardTitle>
                <VCardSubtitle>{{ item.date || '日期未知' }} · {{ item.episode_count || '?' }} 集</VCardSubtitle>
              </VCardItem>
              <VCardText class="catalog-details">
                <div class="d-flex flex-wrap ga-1">
                  <VChip v-if="item.region_name" size="x-small" variant="tonal">{{ item.region_name }}</VChip>
                  <VChip v-if="item.platform" size="x-small" variant="tonal">{{ item.platform }}</VChip>
                  <VChip v-if="item.is_multi_season" size="x-small" color="secondary" variant="tonal">续作/多季</VChip>
                  <VChip v-if="item.matched_media_type" size="x-small" variant="tonal">{{ item.matched_media_type }}</VChip>
                  <VChip v-if="item.scan_status === 'scanning'" size="x-small" color="info" variant="tonal">
                    <VProgressCircular indeterminate size="11" width="2" class="me-1" />正在扫描
                  </VChip>
                  <VChip v-else-if="item.scan_status === 'failed'" size="x-small" color="warning" variant="tonal">匹配待补充</VChip>
                  <VChip v-if="item.maintained" size="x-small" color="success" prepend-icon="mdi-check">已维护</VChip>
                </div>
                <div v-if="item.tmdb_match?.best" class="text-caption text-medium-emphasis mt-2 text-truncate" :title="`TMDB ${item.tmdb_match.best.tmdb_id} · ${item.tmdb_match.best.name}`">
                  TMDB {{ item.tmdb_match.best.tmdb_id }} · {{ item.tmdb_match.best.name }}
                </div>
              </VCardText>
              <VCardActions class="catalog-actions">
                <VMenu v-if="!item.maintained && item.rule_eligible !== false">
                  <template #activator="{ props: menuProps }">
                    <VBtn v-bind="menuProps" color="primary" variant="tonal" append-icon="mdi-menu-down" :loading="busyId === item.id">加入规则</VBtn>
                  </template>
                  <VList density="compact">
                    <VListItem title="使用 TMDB 默认编集" prepend-icon="mdi-database-outline" @click="addCatalogItem(item, 'default')" />
                    <VListItem title="优先 Production/Season 剧集组" prepend-icon="mdi-animation-outline" @click="addCatalogItem(item, 'group_preferred')" />
                  </VList>
                </VMenu>
                <VBtn v-else-if="item.rule_eligible === false" variant="text" disabled prepend-icon="mdi-movie-open-outline">电影条目无需集数规则</VBtn>
                <VBtn
                  v-else variant="text" prepend-icon="mdi-pencil-outline"
                  @click="openEditor(ruleByTmdbId.get(Number(item.tmdb_match?.best?.tmdb_id)))"
                >编辑规则</VBtn>
              </VCardActions>
            </div>
          </VCard>
          <div v-if="!catalogLoading && !filteredCatalog.length" class="empty-catalog">
            <VIcon icon="mdi-calendar-search" size="48" /><div>当前筛选条件没有番剧</div>
          </div>
        </div>
      </VCardText>
    </VCard>

    <div v-show="subModule === 'emby'" class="emby-sync-module">
      <VAlert type="info" variant="tonal" density="compact" class="mb-4">
        仅当实际整理采用剧集组规则时才会排队；插件通过 TMDBID 与最终路径定位 Emby Series，写入神医使用的 <code>TmdbEg</code>。已正确配置的条目会自动跳过。
      </VAlert>
      <VAlert v-if="!embySync.available" type="warning" variant="tonal" class="mb-4">
        当前 MoviePilot 缺少媒体服务器服务目录，无法复用已配置的 Emby。此限制不会影响集数偏移本身。
      </VAlert>

      <VCard variant="outlined" class="normalizer-card mb-4">
        <VCardItem>
          <template #prepend><VAvatar color="primary" variant="tonal"><VIcon icon="mdi-server-network" /></VAvatar></template>
          <VCardTitle>入库联动设置</VCardTitle>
          <VCardSubtitle>{{ embyStatusText }}</VCardSubtitle>
          <template #append>
            <VSwitch v-model="embySync.config.enabled" color="success" hide-details label="启用联动" />
          </template>
        </VCardItem>
        <VCardText>
          <div class="sync-metrics mb-4">
            <div><span>等待处理</span><strong>{{ embySync.counts?.pending || 0 }}</strong></div>
            <div><span>已完成</span><strong>{{ embySync.counts?.completed || 0 }}</strong></div>
            <div><span>需要处理</span><strong>{{ embySync.counts?.attention || 0 }}</strong></div>
          </div>
          <div class="sync-settings-grid">
            <VSelect
              v-model="embySync.config.servers" :items="embyServerItems" multiple chips clearable
              label="目标 Emby（留空表示全部）" hint="直接读取 MoviePilot 已配置的 Emby，不保存 API Key" persistent-hint
            />
            <VSelect
              v-model="embySync.config.conflict_policy" label="已有不同 TmdbEg 时"
              :items="[{title:'安全跳过并报告冲突',value:'skip'},{title:'以当前维护规则覆盖',value:'overwrite'}]"
              hint="默认不覆盖 Emby 中已有的人工选择" persistent-hint
            />
            <VTextField v-model.number="embySync.config.initial_delay_seconds" type="number" min="0" max="300" label="首次等待（秒）" hint="给 Emby 留出发现新文件的时间" persistent-hint />
            <VTextField v-model.number="embySync.config.retry_seconds" type="number" min="10" max="600" label="重试间隔（秒）" hint="未扫描到 Series 时后台重试" persistent-hint />
            <VTextField v-model.number="embySync.config.max_wait_minutes" type="number" min="1" max="1440" label="最长等待（分钟）" hint="超时后保留任务供手动重试" persistent-hint />
            <VSwitch v-model="embySync.config.refresh_metadata" color="primary" label="写入后刷新 Series 元数据" hint="使神医按新剧集组重新刮削" persistent-hint />
          </div>

          <div class="d-flex align-center flex-wrap ga-2 mt-5 mb-2">
            <div class="flex-grow-1"><div class="font-weight-bold">容器路径映射</div><div class="text-caption text-medium-emphasis">MP 与 Emby 看到的媒体路径相同时无需配置；不同时按最长前缀转换。</div></div>
            <VBtn variant="tonal" prepend-icon="mdi-plus" @click="addPathMapping">添加映射</VBtn>
          </div>
          <div v-if="embySync.config.path_mappings?.length" class="path-mapping-list">
            <div v-for="(mapping, index) in embySync.config.path_mappings" :key="index" class="path-mapping-row">
              <VSelect
                v-model="mapping.server" label="Emby"
                :items="[{title:'全部 Emby',value:'*'}, ...embyServerItems]" hide-details density="compact" variant="outlined"
              />
              <VTextField v-model="mapping.source" label="MP 路径前缀" placeholder="/media/TV" hide-details density="compact" variant="outlined" />
              <VIcon icon="mdi-arrow-right" color="medium-emphasis" />
              <VTextField v-model="mapping.target" label="Emby 路径前缀" placeholder="/mnt/media/TV" hide-details density="compact" variant="outlined" />
              <VBtn icon="mdi-delete-outline" color="error" variant="text" @click="embySync.config.path_mappings.splice(index, 1)" />
            </div>
          </div>
          <div v-else class="text-caption text-medium-emphasis py-2">未设置路径映射，将直接比较 MP 最终路径与 Emby Series 路径。</div>
        </VCardText>
        <VDivider />
        <VCardActions class="pa-4">
          <VBtn variant="text" prepend-icon="mdi-refresh" :loading="embyLoading" @click="loadEmbySync(false)">刷新状态</VBtn>
          <VSpacer />
          <VBtn color="primary" prepend-icon="mdi-content-save" :loading="embySaving" @click="saveEmbySync">保存联动设置</VBtn>
        </VCardActions>
      </VCard>

      <VCard variant="outlined" class="normalizer-card mb-4">
        <VCardItem>
          <template #prepend><VAvatar color="secondary" variant="tonal"><VIcon icon="mdi-flask-outline" /></VAvatar></template>
          <VCardTitle>Series 定位试跑</VCardTitle>
          <VCardSubtitle>定位本身只读；出现同 TMDBID 歧义时，可确认将剧集组应用到全部候选</VCardSubtitle>
        </VCardItem>
        <VCardText>
          <div class="sync-preview-grid">
            <VSelect v-model="embyPreviewRule" :items="embyGroupRuleItems" label="剧集组维护规则" hide-details />
            <VTextField v-model="embyPreviewPath" label="MP 整理后的实际文件路径" placeholder="/media/TV/作品/Season 02/E01.mkv" hide-details />
            <VBtn color="secondary" prepend-icon="mdi-radar" :loading="embyPreviewing" :disabled="!embyPreviewRule || !embyPreviewPath" @click="previewEmbySync">开始定位</VBtn>
          </div>
          <div v-if="embyPreview?.results" class="sync-result-list mt-4">
            <VCard
              v-for="(result, server) in embyPreview.results" :key="server" variant="outlined"
              class="sync-result-card" :class="`sync-result-${embyResultColor(result.status)}`"
            >
              <VCardText>
                <div class="d-flex align-center flex-wrap ga-2">
                  <VAvatar :color="embyResultColor(result.status)" variant="tonal" size="34"><VIcon :icon="result.status === 'ambiguous' ? 'mdi-source-branch' : result.status === 'updated' || result.status === 'already' ? 'mdi-check' : 'mdi-information-outline'" size="19" /></VAvatar>
                  <strong>{{ server }}</strong>
                  <VChip size="x-small" :color="embyResultColor(result.status)" variant="tonal">{{ embyResultText(result.status) }}</VChip>
                  <VSpacer />
                  <VBtn
                    v-if="result.status === 'ambiguous' && Number(result.candidate_count || result.candidates?.length || 0) > 1"
                    size="small" color="warning" variant="tonal" prepend-icon="mdi-playlist-check"
                    :loading="embyApplyingAll === server" :disabled="Boolean(embyApplyingAll) && embyApplyingAll !== server" @click="applyAllEmbyCandidates(server, result)"
                  >修改全部候选</VBtn>
                </div>
                <div class="text-body-2 mt-3">{{ result.reason }}</div>
                <div v-if="result.mapped_target_path" class="mapped-path mt-3"><span>实际比较路径</span><code>{{ result.mapped_target_path }}</code></div>
                <div v-if="result.item_name" class="text-caption text-medium-emphasis mt-1">{{ result.item_name }} · {{ result.item_path || '路径未知' }}</div>
                <div v-if="result.existing_group_id" class="text-caption">当前 TmdbEg：{{ result.existing_group_id }}</div>
                <div v-if="result.candidates?.length" class="candidate-path-list mt-3">
                  <div v-for="item in result.candidates" :key="item.item_id"><span>{{ item.name }}</span><code>{{ item.path || '无路径' }}</code></div>
                </div>
                <div v-if="Number(result.candidate_count || 0) > Number(result.candidates?.length || 0)" class="text-caption text-medium-emphasis mt-2">
                  共 {{ result.candidate_count }} 个候选，此处仅展示前 {{ result.candidates?.length || 0 }} 个
                </div>
                <div v-if="result.items?.length" class="candidate-path-list mt-3">
                  <div v-for="item in result.items" :key="item.item_id"><span>{{ item.item_name }} · {{ embyResultText(item.status) }}</span><code>{{ item.item_path || '无路径' }}</code></div>
                </div>
              </VCardText>
            </VCard>
          </div>
        </VCardText>
      </VCard>

      <VCard variant="outlined" class="normalizer-card mb-4">
        <VCardItem>
          <template #prepend><VAvatar color="success" variant="tonal"><VIcon icon="mdi-progress-clock" /></VAvatar></template>
          <VCardTitle>联动任务</VCardTitle>
          <VCardSubtitle>任务持久保存，MoviePilot 重启后仍可继续重试</VCardSubtitle>
          <template #append><div class="d-flex ga-1"><VBtn variant="text" prepend-icon="mdi-replay" :disabled="!embySync.jobs?.length" @click="retryEmbyJob()">重试未完成</VBtn><VBtn variant="text" color="error" prepend-icon="mdi-delete-sweep-outline" @click="deleteEmbyJob()">清理已结束</VBtn></div></template>
        </VCardItem>
        <VProgressLinear v-if="embyLoading" indeterminate color="primary" />
        <VCardText v-if="embySync.jobs?.length" class="sync-job-list">
          <VCard v-for="job in embySync.jobs" :key="job.id" variant="tonal" class="sync-job-card">
            <VCardText>
              <div class="d-flex align-start ga-3">
                <VAvatar :color="embyResultColor(job.status)" variant="tonal"><VIcon :icon="job.status === 'completed' ? 'mdi-check' : job.status === 'pending' || job.status === 'running' ? 'mdi-clock-outline' : 'mdi-alert-outline'" /></VAvatar>
                <div class="flex-grow-1 min-w-0">
                  <div class="d-flex align-center flex-wrap ga-2"><strong>{{ job.title }}</strong><VChip size="x-small" :color="embyResultColor(job.status)">{{ embyResultText(job.status) }}</VChip></div>
                  <div class="text-caption text-medium-emphasis">TMDB {{ job.tmdb_id }} · TmdbEg {{ job.episode_group_id }} · 已尝试 {{ job.attempts || 0 }} 次</div>
                  <div class="text-body-2 mt-1">{{ job.reason }}</div>
                  <div class="text-caption text-medium-emphasis text-truncate mt-1" :title="job.target_path">{{ job.target_path }}</div>
                  <div v-if="Object.keys(job.server_results || {}).length" class="d-flex flex-wrap ga-1 mt-2">
                    <VChip v-for="(result, server) in job.server_results" :key="server" size="x-small" :color="embyResultColor(result.status)" variant="tonal" :title="result.reason">{{ server }} · {{ embyResultText(result.status) }}</VChip>
                  </div>
                </div>
                <div class="d-flex"><VBtn icon="mdi-replay" variant="text" title="重新检查" @click="retryEmbyJob(job.id)" /><VBtn icon="mdi-delete-outline" variant="text" color="error" title="删除任务" @click="deleteEmbyJob(job.id)" /></div>
              </div>
            </VCardText>
          </VCard>
        </VCardText>
        <div v-else class="empty-sync"><VIcon icon="mdi-server-network-off" size="48" /><div>尚无剧集组联动任务</div><div class="text-caption">启用后，下一次实际使用剧集组规则整理时会自动建立任务。</div></div>
      </VCard>
    </div>

    <VDialog v-model="manualDialog" max-width="620">
      <VCard>
        <VCardItem>
          <VCardTitle>手动添加维护规则</VCardTitle>
          <VCardSubtitle>适用于季度看板中没有收录的电视剧或动画</VCardSubtitle>
          <template #append><VBtn icon="mdi-close" variant="text" @click="manualDialog = false" /></template>
        </VCardItem>
        <VDivider />
        <VCardText class="manual-rule-form">
          <VAlert v-if="manualMessage" type="warning" variant="tonal" density="compact" class="mb-4">{{ manualMessage }}</VAlert>
          <VTextField v-model.number="manualForm.tmdb_id" label="TMDBID" type="number" prepend-inner-icon="mdi-database-search" hide-details />
          <VSelect
            v-model="manualForm.preference" label="目标编集"
            :items="[{title:'使用 TMDB 默认编集',value:'default'},{title:'优先 Production/Season 剧集组',value:'group_preferred'}]"
            hide-details
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
        <VCardText>此操作会立即停止这些 TMDB 条目的集数偏移，请确认当前季度和搜索条件正确。</VCardText>
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
          <VAlert v-if="inspection?.recommendation" type="info" variant="tonal" density="compact" class="mb-3">
            <div class="d-flex align-center flex-wrap ga-2">
              <span class="flex-grow-1">
                <strong>智能建议：{{ inspection.recommendation.target_type === 'group' ? '剧集组' : 'TMDB 默认编集' }}</strong>
                · {{ inspection.recommendation.reason }}
              </span>
              <VBtn size="small" variant="tonal" @click="applyTargetRecommendation">采用建议</VBtn>
            </div>
          </VAlert>
          <VRadioGroup v-model="editForm.target_type" hide-details>
            <VRadio value="default" label="TMDB 默认编集" />
            <VRadio value="group" label="TMDB 剧集组" />
          </VRadioGroup>
          <VSelect
            v-if="editForm.target_type === 'group'" v-model="editForm.episode_group_id" class="mt-3"
            :items="(inspection?.groups || []).map(group => ({ title: `${group.recommended ? '推荐 · ' : ''}${group.name} · ${groupType(group.type)} · ${group.episode_count} 集`, value: group.id }))"
            label="目标剧集组"
          />
          <div v-if="selectedGroup" class="group-preview mb-4">
            <div class="d-flex align-center flex-wrap ga-2 mb-2">
              <strong>分季预览</strong>
              <VChip size="x-small" variant="tonal">{{ selectedGroup.seasons?.filter(item => !item.is_special).length || 0 }} 个常规季</VChip>
              <VChip v-if="selectedGroup.seasons?.some(item => item.is_special)" size="x-small" color="secondary" variant="tonal">包含 Special</VChip>
              <VChip v-if="selectedGroup.coverage" size="x-small" variant="outlined">正片覆盖 {{ selectedGroup.coverage }}%</VChip>
            </div>
            <div class="group-season-grid">
              <div v-for="season in selectedGroup.seasons || []" :key="season.season" :class="['group-season-item', { special: season.is_special }]">
                <div class="d-flex align-center ga-2">
                  <strong>S{{ String(season.season).padStart(2, '0') }}</strong>
                  <VChip v-if="season.is_special" size="x-small" color="secondary">Special</VChip>
                  <span class="text-truncate">{{ season.name }}</span>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  {{ season.episode_count }} 集 · E{{ String(season.first_episode || 1).padStart(2, '0') }}–E{{ String(season.last_episode || season.episode_count).padStart(2, '0') }}
                </div>
                <div v-if="season.first_air_date || season.last_air_date" class="text-caption text-medium-emphasis">
                  {{ season.first_air_date || '日期未知' }}<span v-if="season.last_air_date && season.last_air_date !== season.first_air_date"> → {{ season.last_air_date }}</span>
                </div>
              </div>
            </div>
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
                  <VCol cols="12" sm="4">
                    <VTextField v-model="item.source_start_episode" label="来源起始集（留空自动）" type="number" hint="累计编号拆入 Special 时会按 Episode ID 自动推导" persistent-hint />
                  </VCol>
                  <VCol cols="6" sm="4"><VTextField v-model="item.target_start_season" label="目标起始季" type="number" /></VCol>
                  <VCol cols="6" sm="4"><VTextField v-model="item.target_start_episode" label="目标起始集" type="number" /></VCol>
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

    <VSnackbar v-model="snackbar" :color="snackbarColor" timeout="5000">{{ notice }}</VSnackbar>
  </div>
</template>

<style scoped>
.normalizer-card { border-color: rgba(var(--v-theme-on-surface), .1); border-radius: 14px; }
.module-header-tabs { flex: 1 1 520px; min-width: 0; }
.module-header-tabs :deep(.v-slide-group__content) { justify-content: flex-start; }
.episode-normalizer :deep(.v-card-title),
.episode-normalizer :deep(.v-card-subtitle),
.episode-normalizer :deep(.v-field-label) { overflow-wrap: anywhere; }
.board-controls { display: grid; grid-template-columns: 110px 100px minmax(210px, 1fr) 135px 135px 135px auto; gap: 10px; align-items: center; }
.batch-bar { display: flex; gap: 12px; align-items: center; padding: 10px 12px; border-radius: 12px; background: rgba(var(--v-theme-secondary), .055); }
.batch-target { max-width: 280px; }
.catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(245px, 1fr)); gap: 14px; }
.catalog-card { position: relative; overflow: hidden; content-visibility: auto; contain-intrinsic-size: 320px; }
.catalog-card-layout { height: 100%; display: flex; flex-direction: column; min-width: 0; }
.catalog-poster { width: 100%; height: 170px; flex: 0 0 170px; }
.catalog-poster-placeholder { display: flex; align-items: center; justify-content: center; color: rgba(var(--v-theme-on-surface), .34); background: rgba(var(--v-theme-surface-variant), .35); }
.catalog-summary { min-width: 0; }
.catalog-details { min-width: 0; padding-top: 0 !important; }
.catalog-actions { flex-wrap: wrap; row-gap: 6px; margin-top: auto; }
.catalog-grid.view-list { grid-template-columns: 1fr; }
.catalog-grid.view-list .catalog-card-layout { display: grid; grid-template-columns: 112px minmax(0, 1fr) minmax(145px, auto); grid-template-rows: auto 1fr; min-height: 148px; align-items: center; }
.catalog-grid.view-list .catalog-poster { grid-column: 1; grid-row: 1 / 3; width: 112px; height: 148px; min-height: 148px; align-self: stretch; }
.catalog-grid.view-list .catalog-summary { grid-column: 2; grid-row: 1; padding: 16px 18px 6px; align-self: end; }
.catalog-grid.view-list .catalog-details { grid-column: 2; grid-row: 2; padding: 5px 18px 14px !important; align-self: start; }
.catalog-grid.view-list .catalog-actions { grid-column: 3; grid-row: 1 / 3; align-self: center; justify-content: flex-end; margin: 0; padding: 12px 16px 12px 8px; }
.catalog-grid.view-compact { grid-template-columns: 1fr; gap: 8px; }
.catalog-grid.view-compact .catalog-card-layout { display: grid; grid-template-columns: minmax(230px, 1.2fr) minmax(260px, 1fr) auto; align-items: center; min-height: 72px; }
.catalog-grid.view-compact .catalog-poster { display: none; }
.catalog-grid.view-compact .catalog-summary { grid-column: 1; padding: 10px 12px 10px 52px; }
.catalog-grid.view-compact .catalog-details { grid-column: 2; padding: 8px 12px !important; }
.catalog-grid.view-compact .catalog-actions { grid-column: 3; justify-content: flex-end; margin: 0; padding: 8px 12px; }
.select-corner { position: absolute; z-index: 2; inset-block-start: 6px; inset-inline-start: 6px; border-radius: 10px; background: rgba(var(--v-theme-surface), .9); }
.rules-controls { display: grid; grid-template-columns: minmax(220px, 1fr) 160px auto auto auto; gap: 10px; align-items: center; }
.rules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 10px; }
.rules-grid.view-list, .rules-grid.view-compact { grid-template-columns: 1fr; }
.rules-grid.view-compact .rule-card :deep(.v-card-text) { padding-block: 8px; }
.rules-grid.view-compact .rule-card :deep(.v-avatar) { width: 30px !important; height: 30px !important; }
.rules-scroll { max-height: 480px; overflow-y: auto; }
.rule-group-title { display: flex; align-items: center; gap: 7px; color: rgba(var(--v-theme-on-surface), .82); }
.rule-card { border: 1px solid rgba(var(--v-theme-success), .1); }
.group-preview { padding: 12px; border: 1px solid rgba(var(--v-theme-primary), .16); border-radius: 12px; background: rgba(var(--v-theme-primary), .035); }
.group-season-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 8px; }
.group-season-item { min-width: 0; padding: 10px; border-radius: 9px; background: rgba(var(--v-theme-surface), .72); border: 1px solid rgba(var(--v-theme-on-surface), .08); }
.group-season-item.special { border-color: rgba(var(--v-theme-secondary), .22); background: rgba(var(--v-theme-secondary), .055); }
.empty-catalog, .empty-rules { grid-column: 1 / -1; min-height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: rgba(var(--v-theme-on-surface), .55); }
.manual-match { display: grid; grid-template-columns: 120px auto auto; gap: 8px; align-items: center; min-width: 350px; }
.tmdb-correction { display: grid; grid-template-columns: minmax(180px, 1fr) auto; gap: 10px; align-items: center; }
.manual-rule-form { display: grid; gap: 14px; }
.manual-rule-form :deep(.v-alert), .manual-rule-form :deep(.v-switch), .manual-rule-form :deep(.v-row) { margin-block: 0 !important; }
.sync-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.sync-metrics > div { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; border-radius: 12px; background: rgba(var(--v-theme-primary), .045); }
.sync-metrics span { color: rgba(var(--v-theme-on-surface), .65); font-size: .82rem; }
.sync-metrics strong { font-size: 1.15rem; }
.sync-settings-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; align-items: start; }
.path-mapping-list { display: grid; gap: 9px; }
.path-mapping-row { display: grid; grid-template-columns: minmax(150px, .7fr) minmax(190px, 1fr) auto minmax(190px, 1fr) auto; gap: 8px; align-items: center; padding: 12px; border: 1px solid rgba(var(--v-theme-primary), .14); border-radius: 12px; background: linear-gradient(120deg, rgba(var(--v-theme-primary), .035), rgba(var(--v-theme-surface), 1) 58%); }
.sync-preview-grid { display: grid; grid-template-columns: minmax(250px, .8fr) minmax(320px, 1.4fr) auto; gap: 10px; align-items: center; }
.sync-result-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 10px; }
.sync-result-card { border-width: 1px; background: rgb(var(--v-theme-surface)); }
.sync-result-success { border-color: rgba(var(--v-theme-success), .34); background: linear-gradient(120deg, rgba(var(--v-theme-success), .07), rgba(var(--v-theme-surface), 1) 60%); }
.sync-result-info { border-color: rgba(var(--v-theme-info), .3); background: linear-gradient(120deg, rgba(var(--v-theme-info), .065), rgba(var(--v-theme-surface), 1) 60%); }
.sync-result-warning { border-color: rgba(var(--v-theme-warning), .38); background: linear-gradient(120deg, rgba(var(--v-theme-warning), .085), rgba(var(--v-theme-surface), 1) 60%); }
.sync-result-error { border-color: rgba(var(--v-theme-error), .34); background: linear-gradient(120deg, rgba(var(--v-theme-error), .07), rgba(var(--v-theme-surface), 1) 60%); }
.mapped-path { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 10px; align-items: baseline; padding: 9px 11px; border-radius: 9px; background: rgba(var(--v-theme-primary), .045); font-size: .76rem; }
.mapped-path span { color: rgba(var(--v-theme-on-surface), .6); }
.mapped-path code, .candidate-path-list code { color: rgb(var(--v-theme-primary)); overflow-wrap: anywhere; }
.candidate-path-list { display: grid; gap: 7px; }
.candidate-path-list > div { display: grid; grid-template-columns: minmax(130px, .45fr) minmax(0, 1fr); gap: 10px; padding: 8px 10px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 9px; background: rgba(var(--v-theme-surface), .72); font-size: .76rem; }
.sync-job-list { display: grid; gap: 10px; }
.sync-job-card { border: 1px solid rgba(var(--v-theme-on-surface), .07); }
.empty-sync { min-height: 190px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: rgba(var(--v-theme-on-surface), .55); }
@media (max-width: 1000px) {
  .board-controls, .rules-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sync-settings-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .path-mapping-row { grid-template-columns: 1fr 1fr auto; }
  .path-mapping-row > :nth-child(3) { display: none; }
  .path-mapping-row > :nth-child(4) { grid-column: 1 / 3; }
}
@media (max-width: 1280px) and (min-width: 1001px) {
  .board-controls { grid-template-columns: 100px 90px minmax(180px, 1fr) repeat(2, 125px); }
  .board-controls > :nth-child(6), .board-controls > :nth-child(7) { grid-column: span 1; }
}
@media (max-width: 700px) {
  .board-controls { grid-template-columns: 1fr; }
  .rules-controls { grid-template-columns: 1fr; }
  .batch-bar { align-items: stretch; flex-direction: column; }
  .batch-target { max-width: none; }
  .rules-grid { grid-template-columns: 1fr; }
  .manual-match { grid-template-columns: 1fr; min-width: 160px; }
  .tmdb-correction { grid-template-columns: 1fr; }
  .sync-metrics, .sync-settings-grid, .sync-preview-grid { grid-template-columns: 1fr; }
  .path-mapping-row { grid-template-columns: 1fr auto; }
  .path-mapping-row > :nth-child(1), .path-mapping-row > :nth-child(2), .path-mapping-row > :nth-child(4) { grid-column: 1; }
  .path-mapping-row > :nth-child(5) { grid-column: 2; grid-row: 1; }
  .catalog-grid.view-list .catalog-card-layout { grid-template-columns: 92px minmax(0, 1fr); grid-template-rows: auto auto auto; }
  .catalog-grid.view-list .catalog-poster { width: 92px; height: 126px; min-height: 126px; grid-row: 1 / 3; }
  .catalog-grid.view-list .catalog-summary { padding: 12px 12px 4px; }
  .catalog-grid.view-list .catalog-details { padding: 4px 12px 10px !important; }
  .catalog-grid.view-list .catalog-actions { grid-column: 1 / 3; grid-row: 3; justify-content: flex-end; padding: 8px 10px; border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
  .catalog-grid.view-compact .catalog-card-layout { grid-template-columns: 1fr auto; }
  .catalog-grid.view-compact .catalog-summary { grid-column: 1; padding-left: 48px; }
  .catalog-grid.view-compact .catalog-details { grid-column: 1 / 3; grid-row: 2; padding: 0 12px 8px 48px !important; }
  .catalog-grid.view-compact .catalog-actions { grid-column: 2; grid-row: 1; }
}
</style>
