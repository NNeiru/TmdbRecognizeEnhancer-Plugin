<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { unwrapResponse } from '../utils'
import MediaFilePicker from './MediaFilePicker.vue'
import ModuleHeader from './ModuleHeader.vue'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'TmdbRecognizeEnhancer' },
  modelValue: { type: Object, default: () => ({}) },
  savingConfig: { type: Boolean, default: false },
  mode: { type: String, default: 'metadata' },
})
const emit = defineEmits(['update:modelValue', 'save-config'])
const headerInfo = computed(() => {
  if (props.mode === 'naming') return { icon: 'mdi-rename-box-outline', title: '命名规则', subtitle: '统一管理连接符、制作组、自定义字段和最终文本映射，并按实际执行顺序排列。', color: 'orange' }
  if (props.mode === 'probe') return { icon: 'mdi-waveform', title: '媒体信息识别', subtitle: '整理前读取真实媒体流，补齐技术参数并输出可用于命名的 Jinja2 变量。', color: 'purple' }
  return { icon: 'mdi-code-braces-box', title: '字段与制作组', subtitle: '查看 MP 当前版本实际加载的识别规则，并为制作组提供候选类型证据。', color: 'primary' }
})
const loading = ref(false)
const saving = ref('')
const error = ref('')
const data = ref({ release_groups: { items: [] }, recognition_rules: { items: [], fields: [], overrides: [] }, rename_fields: { builtin: [], context: [], custom: [] }, rename_mappings: { items: [], stages: [] }, release_group_arrangements: { items: [], positions: [], connectors: [] }, media_probe: { field_options: [] }, capabilities: {} })
const section = ref(props.mode === 'naming' ? 'mapping' : props.mode === 'probe' ? 'probe' : 'rules')
const search = ref('')
const field = ref('all')
const source = ref('all')
const page = ref(1)
const groupKind = ref('all')
const groupProfileDialog = ref(false)
const groupProfileForm = ref({ id: '', display_name: '', kind: 'unknown', field_policy: 'fill_empty', field_values: {}, custom_field_values: {} })
const probePath = ref('')
const probeSection = ref('scan')
const probeResult = ref(null)
const probeForce = ref(true)
const probeCacheNotice = ref('')
const strmSync = ref({
  available: false, enabled: false, active: false, worker_running: false,
  servers: [], jobs: [], counts: { pending: 0, completed: 0, attention: 0 },
  config: { enabled: false, servers: [], initial_delay_seconds: 20, retry_seconds: 30, max_wait_minutes: 30, path_mappings: [] },
})
const strmTargetPath = ref('')
const strmPreview = ref(null)
const dialog = ref(false)
const form = ref({ id: '', source_rule_id: '', field: 'videoBit', pattern: '', value: '{match}', action: 'override', enabled: true, priority: 100, label: '' })
const previewTitle = ref('[Group] Example.S01E01.1080p.WEB-DL.H265.10bit.AAC.mkv')
const preview = ref(null)
const renameDialog = ref(false)
const renameForm = ref({ original_key: '', key: '', label: '', expression: '', fallback: '', enabled: true })
const renamePreviewing = ref(false)
const renamePreview = ref(null)
const renameFieldSearch = ref('')
const openRenameFieldGroups = ref(['媒体信息', '文件解析', '源文件上下文'])
const copiedVariable = ref('')
const fieldDetailDialog = ref(false)
const fieldDetail = ref(null)
const fieldPresetLimit = ref(80)
const mappingDialog = ref(false)
const mappingForm = ref({ id: '', label: '', stage: 'final_result', mode: 'literal', pattern: '', replacement: '', enabled: true, priority: 100 })
const mappingPreviewInput = ref({ value: 'AB/C.chi.zh-cn.ass' })
const mappingPreview = ref(null)
const renameRuleSection = ref('defaults')
const groupArrangementDialog = ref(false)
const groupArrangementForm = ref({ id: '', label: '', match_name: '', aliases: '', output_name: '', position: 'keep', connector: '__default__', order: 100, enabled: true })
const groupArrangementPreviewInput = ref('ADWeb@A@VCB')
const groupArrangementPreview = ref(null)
const renamePreviewInput = ref({
  original_name: '[Group] Example.S01E01.1080p.WEB-DL.mkv',
  type: '电视剧', category: '动漫',
  source_path: '/downloads/anime/Example.S01E01.mkv',
  target_dir: '/media/TV/动漫',
})

const pluginBase = computed(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`)
const config = computed({ get: () => props.modelValue || {}, set: value => emit('update:modelValue', value) })
const kindItems = [
  { title: '未分类 / 不参与', value: 'unknown' },
  { title: '动漫', value: 'animation' },
  { title: '真人电视剧', value: 'live_action' },
]
const sourceItems = [
  { title: '全部来源', value: 'all' },
  { title: '插件自定义覆盖', value: 'plugin_user' },
  { title: 'MP Python / Rust', value: 'mp_python_rust' },
  { title: 'MP Python 内置表', value: 'mp_python' },
  { title: 'MP 词表设置', value: 'mp_config' },
]
const fieldItems = computed(() => [{ title: '全部识别字段', value: 'all' }, ...(data.value.recognition_rules?.fields || []).map(item => ({ title: `${item.label} (${item.count})`, value: item.key }))])
const rules = computed(() => {
  const query = search.value.trim().toLowerCase()
  return (data.value.recognition_rules?.items || []).filter(item => {
    if (field.value !== 'all' && item.field !== field.value) return false
    if (source.value !== 'all' && item.source !== source.value) return false
    return !query || [item.field, item.field_label, item.label, item.pattern, item.value].some(value => String(value || '').toLowerCase().includes(query))
  })
})
const pageSize = 30
const pageCount = computed(() => Math.max(1, Math.ceil(rules.value.length / pageSize)))
const pagedRules = computed(() => rules.value.slice((page.value - 1) * pageSize, page.value * pageSize))
const groups = computed(() => {
  const query = search.value.trim().toLowerCase()
  return (data.value.release_groups?.items || []).filter(item => {
    if (groupKind.value !== 'all' && item.kind !== groupKind.value) return false
    return !query || [item.display_name, item.pattern, item.category].some(value => String(value || '').toLowerCase().includes(query))
  })
})
const groupPageCount = computed(() => Math.max(1, Math.ceil(groups.value.length / pageSize)))
const pagedGroups = computed(() => groups.value.slice((page.value - 1) * pageSize, page.value * pageSize))
const kindLabel = value => ({ animation: '动漫', live_action: '真人电视剧', unknown: '未分类' })[value] || '未分类'
const kindColor = value => ({ animation: 'primary', live_action: 'orange', unknown: 'default' })[value] || 'default'
const mediaProbeFieldItems = [
  { key: 'videoFormat', label: '分辨率', target: 'videoFormat', detail: '根据实际宽高生成 720P、1080P、2160P 等' },
  { key: 'videoCodec', label: '视频编码', target: 'videoCodec', detail: 'H264、H265、AV1、VP9 等' },
  { key: 'videoBit', label: '视频位深', target: 'videoBit', detail: '8bit、10bit、12bit 等' },
  { key: 'effect', label: '画面特效', target: 'effect', detail: 'DOVI、HDR10+、HDR10、HLG；普通 SDR 不写入 effect' },
  { key: 'fps', label: '帧率', target: 'fps', detail: '读取主视频流的实际平均帧率' },
  { key: 'audioCodec', label: '音频信息', target: 'audioCodec', detail: '主音频编码，并提供全部音轨编码和语言上下文' },
  { key: 'subtitle', label: '内封字幕', target: 'customization', detail: '扫描容器内字幕流语言，按下方规则映射到 customization' },
  { key: 'duration', label: '媒体时长', target: 'probe_duration', detail: '只作为 Jinja2 扫描变量提供，不覆盖 MP 标准字段' },
]
const fieldPolicyItems = [
  { title: '仅补空值', value: 'fill_empty' },
  { title: '覆盖原值', value: 'overwrite' },
  { title: '追加到原值', value: 'append' },
]
const selectedProbeFieldItems = computed(() => mediaProbeFieldItems.filter(item => probeFieldSelected(item.key)))
const mediaProbeBackendSupported = computed(() => Object.prototype.hasOwnProperty.call(data.value || {}, 'media_probe') && Array.isArray(data.value.media_probe?.field_options))
const strmServerItems = computed(() => (strmSync.value.servers || []).map(item => ({
  title: `${item.name}${item.connected ? '' : '（未连接）'}`,
  value: item.name,
  props: { disabled: !item.connected },
})))
const strmStatusText = computed(() => {
  if (!strmSync.value.available) return '当前 MoviePilot 不支持媒体服务器服务目录'
  if (!strmSync.value.config?.enabled) return '已停用'
  if (!config.value.media_probe_enabled) return '等待启用整理前媒体流扫描'
  if (!strmSync.value.servers?.length) return '未配置 Emby'
  return strmSync.value.worker_running ? '正在监听整理入库' : '后台工作器未运行'
})
const supplementFieldItems = [
  { key: 'resourceType', label: '资源类型', placeholder: 'WEB-DL' },
  { key: 'webSource', label: '流媒体平台', placeholder: 'Netflix / Bilibili' },
  { key: 'effect', label: '画面特效', placeholder: 'HDR10 / DOVI' },
  { key: 'videoFormat', label: '分辨率', placeholder: '1080P' },
  { key: 'videoCodec', label: '视频编码', placeholder: 'H265' },
  { key: 'videoBit', label: '视频位深', placeholder: '10bit' },
  { key: 'audioCodec', label: '音频编码', placeholder: 'AAC' },
  { key: 'fps', label: '帧率', placeholder: '23.976' },
  { key: 'customization', label: '自定义占位符', placeholder: '简日内封' },
]
const mappingRules = computed(() => data.value.rename_mappings?.items || [])
const mappingStages = computed(() => data.value.rename_mappings?.stages || [
  { value: 'final_result', label: '最终命名结果' },
  { value: 'release_group', label: '旧版制作组映射' },
])
const mappingStageLabel = value => mappingStages.value.find(item => item.value === value)?.label || value
const groupArrangementRules = computed(() => data.value.release_group_arrangements?.items || [])
const groupPositionItems = computed(() => data.value.release_group_arrangements?.positions || [
  { value: 'first', label: '固定最前' },
  { value: 'keep', label: '保持原标题顺序' },
  { value: 'last', label: '固定最后' },
])
const groupPositionLabel = value => groupPositionItems.value.find(item => item.value === value)?.label || value
const separatorOptions = [
  { title: '空格', value: ' ' }, { title: '点（.）', value: '.' },
  { title: '横杠（-）', value: '-' }, { title: '下划线（_）', value: '_' },
  { title: '@', value: '@' }, { title: '&', value: '&' }, { title: '+', value: '+' },
]
const groupConnectorItems = computed(() => [
  { title: `继承标题，否则默认（${config.value.release_group_default_connector === ' ' ? '空格' : config.value.release_group_default_connector || '@'}）`, value: data.value.release_group_arrangements?.default_connector_value || '__default__' },
  ...(data.value.release_group_arrangements?.connectors || ['@', '&', '+', '-', '_', '.', ' ']).map(value => ({ title: value === ' ' ? '空格' : value, value })),
])
const separatorFieldKeys = new Set(['title', 'en_title', 'original_title', 'name', 'en_name', 'original_name', 'resourceType', 'effect', 'edition', 'videoFormat', 'resource_term', 'releaseGroup', 'videoCodec', 'videoBit', 'audioCodec', 'fps', 'webSource', 'customization'])
const separatorFieldItems = computed(() => (data.value.rename_fields?.builtin || [])
  .filter(item => separatorFieldKeys.has(item.key))
  .map(item => ({ title: `${item.label}（${item.key}）`, value: item.key })))
const customFields = computed(() => data.value.rename_fields?.custom || [])
const probeContextFieldItems = computed(() => (data.value.rename_fields?.context || [])
  .filter(item => String(item.key || '').startsWith('probe_')))
const probeStandardPreviewItems = computed(() => Object.entries(probeResult.value?.fields || {}).map(([key, value]) => ({
  key,
  value,
  label: mediaProbeFieldItems.find(item => item.target === key)?.label || key,
})))
const probeContextPreviewItems = computed(() => probeContextFieldItems.value.map(item => ({
  ...item,
  value: probeResult.value?.context?.[item.key],
})))
const probeValuePresent = value => value !== '' && value !== null && value !== undefined
const probeDetectedContextItems = computed(() => probeContextPreviewItems.value.filter(item => probeValuePresent(item.value)))
const probeMissingContextItems = computed(() => probeContextPreviewItems.value.filter(item => !probeValuePresent(item.value)))
const probeFileName = computed(() => String(probePath.value || '').split(/[\\/]/).pop() || '尚未选择文件')
const probeSummaryPresentation = key => ({
  videoFormat: { icon: 'mdi-monitor-screenshot', color: 'primary' },
  videoCodec: { icon: 'mdi-movie-cog-outline', color: 'secondary' },
  videoBit: { icon: 'mdi-gradient-horizontal', color: 'deep-purple' },
  effect: { icon: 'mdi-creation-outline', color: 'amber-darken-2' },
  fps: { icon: 'mdi-speedometer', color: 'info' },
  audioCodec: { icon: 'mdi-volume-high', color: 'success' },
  customization: { icon: 'mdi-subtitles-outline', color: 'teal' },
  probe_duration: { icon: 'mdi-timer-outline', color: 'blue-grey' },
})[key] || { icon: 'mdi-information-outline', color: 'secondary' }
const availableRenameFields = computed(() => [
  ...(data.value.rename_fields?.builtin || []),
  ...(data.value.rename_fields?.context || []),
  ...customFields.value.map(item => ({
    ...item,
    category: '用户自定义',
    description: `由表达式计算：${item.expression}`,
    availability: item.enabled ? '按表达式依赖阶段可用' : '当前已停用',
    phase: 'custom',
    source: 'user_custom',
    source_label: '用户自定义字段',
    type: 'Jinja2 计算结果',
    values: item.fallback ? `表达式输出；计算为空或失败时回退为 ${item.fallback}` : '由用户表达式和当前输入字段共同决定；可能为空。',
    logic: item.expression || '尚未设置表达式。',
    template_usage: 'direct',
    template_usage_label: '可直接用于 MP 命名模板',
    template_usage_detail: (item.dependencies || []).some(key => ['target_dir', 'rendered_relative_path', 'target_path_before_custom'].includes(key))
      ? '模板可以直接引用该自定义字段；它依赖首次渲染后的目标上下文，因此插件会在目标路径计算后执行一次安全重渲染。'
      : '保存并启用后可直接写进 MoviePilot 命名模板；插件会在首次模板渲染前计算该字段。',
  })),
])
const renameFieldGroups = computed(() => {
  const query = renameFieldSearch.value.trim().toLowerCase()
  const filtered = availableRenameFields.value.filter(item => !query || [
    item.key, item.label, item.category, item.description, item.availability,
  ].some(value => String(value || '').toLowerCase().includes(query)))
  const groups = new Map()
  filtered.forEach(item => {
    if (!groups.has(item.category)) groups.set(item.category, [])
    groups.get(item.category).push(item)
  })
  return [...groups.entries()].map(([category, items]) => ({ category, items }))
})

watch([search, field, source, groupKind, section], () => { page.value = 1 })

function explainError(err, fallback) {
  const status = err?.response?.status || err?.status
  if (status === 404 || String(err?.message || '').includes('404')) {
    return '前端文件已更新，但 MoviePilot 仍在运行旧插件后端，尚未注册新接口。请在 MP 中重载插件；若无重载按钮，只需重启一次 MP 容器。'
  }
  return err?.message || fallback
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.get(`${pluginBase.value}/metadata-tools`)) || data.value
    if (props.mode === 'probe' && Object.prototype.hasOwnProperty.call(data.value || {}, 'strm_sync')) {
      await loadStrmSync()
    }
  } catch (err) {
    error.value = explainError(err, '内置识别规则加载失败')
  } finally { loading.value = false }
}

async function loadStrmSync() {
  strmSync.value = unwrapResponse(await props.api.get(`${pluginBase.value}/metadata-tools/strm-sync`)) || strmSync.value
}

async function saveStrmSync() {
  saving.value = 'strm-config'
  error.value = ''
  try {
    strmSync.value = unwrapResponse(await props.api.post(
      `${pluginBase.value}/metadata-tools/strm-sync/config`, strmSync.value.config,
    )) || strmSync.value
  } catch (err) { error.value = explainError(err, '神医联动设置保存失败') }
  finally { saving.value = '' }
}

function addStrmMapping() {
  if (!Array.isArray(strmSync.value.config.path_mappings)) strmSync.value.config.path_mappings = []
  strmSync.value.config.path_mappings.push({ server: '*', source: '', target: '' })
}

async function previewStrmSync() {
  saving.value = 'strm-preview'
  strmPreview.value = null
  error.value = ''
  try {
    strmPreview.value = unwrapResponse(await props.api.post(
      `${pluginBase.value}/metadata-tools/strm-sync/preview`, {
        source_path: probePath.value,
        target_path: strmTargetPath.value || probePath.value,
        servers: strmSync.value.config.servers,
      },
    ))
    await loadStrmSync()
  } catch (err) { error.value = explainError(err, '神医媒体信息试推失败') }
  finally { saving.value = '' }
}

async function retryStrmJob(jobId = '') {
  saving.value = `strm-retry:${jobId || 'all'}`
  try {
    strmSync.value = unwrapResponse(await props.api.post(
      `${pluginBase.value}/metadata-tools/strm-sync/retry`, { job_id: jobId },
    )) || strmSync.value
  } catch (err) { error.value = explainError(err, '重新排队失败') }
  finally { saving.value = '' }
}

async function deleteStrmJob(jobId = '') {
  saving.value = `strm-delete:${jobId || 'finished'}`
  try {
    strmSync.value = unwrapResponse(await props.api.post(
      `${pluginBase.value}/metadata-tools/strm-sync/delete`, jobId ? { job_id: jobId } : { finished_only: true },
    )) || strmSync.value
  } catch (err) { error.value = explainError(err, '删除任务失败') }
  finally { saving.value = '' }
}

async function saveGroup(item, kind) {
  saving.value = item.id
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group`, { id: item.id, kind, display_name: item.display_name, field_policy: item.field_policy, field_values: item.field_values, custom_field_values: item.custom_field_values })) || data.value
  } catch (err) { error.value = explainError(err, '制作组类型保存失败') }
  finally { saving.value = '' }
}

function openGroupProfile(item) {
  groupProfileForm.value = {
    id: item.id, display_name: item.display_name, kind: item.kind || 'unknown',
    field_policy: item.field_policy || 'fill_empty', field_values: { ...(item.field_values || {}) },
    custom_field_values: { ...(item.custom_field_values || {}) },
  }
  groupProfileDialog.value = true
}

async function saveGroupProfile() {
  saving.value = 'group-profile'
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group`, groupProfileForm.value)) || data.value
    groupProfileDialog.value = false
  } catch (err) { error.value = explainError(err, '制作组字段保存失败') }
  finally { saving.value = '' }
}

async function previewMediaProbe() {
  saving.value = 'media-probe'
  probeResult.value = null
  error.value = ''
  try {
    probeResult.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/media-probe/preview`, { source_path: probePath.value, timeout: config.value.media_probe_timeout, force: probeForce.value }))
  } catch (err) { error.value = explainError(err, '媒体流扫描失败') }
  finally { saving.value = '' }
}

async function clearProbeCache() {
  saving.value = 'probe-cache'
  error.value = ''
  probeCacheNotice.value = ''
  try {
    const response = await props.api.post(`${pluginBase.value}/metadata-tools/media-probe/cache/clear`)
    const capability = unwrapResponse(response)
    // 只合并容量/统计字段，保留 field_options 等目录信息，否则会误报“后端仍是旧实例”
    if (data.value && capability) data.value.media_probe = { ...(data.value.media_probe || {}), ...capability }
    probeCacheNotice.value = response?.data?.message || response?.message || '扫描缓存已清除'
  } catch (err) { error.value = explainError(err, '清除扫描缓存失败') }
  finally { saving.value = '' }
}

const staticFfprobe = computed(() => data.value.media_probe?.static_ffprobe || {})
let staticFfprobePoll = null

async function installStaticFfprobe(silent = false) {
  saving.value = 'static-ffprobe'
  if (!silent) error.value = ''
  try {
    const response = await props.api.post(`${pluginBase.value}/metadata-tools/media-probe/static-ffprobe/install`)
    const status = unwrapResponse(response)
    if (data.value?.media_probe && status) data.value.media_probe.static_ffprobe = status
    scheduleStaticFfprobePoll()
  } catch (err) { if (!silent) error.value = explainError(err, '静态 ffprobe 下载触发失败') }
  finally { saving.value = '' }
}

function scheduleStaticFfprobePoll() {
  // 下载在后端后台线程执行，前端轮询 metadata-tools 直到就绪或报错
  if (staticFfprobePoll) window.clearTimeout(staticFfprobePoll)
  staticFfprobePoll = window.setTimeout(async () => {
    staticFfprobePoll = null
    try { await load() } catch (_) { /* 轮询失败静默 */ }
    const status = staticFfprobe.value
    if (status.installing) scheduleStaticFfprobePoll()
  }, 3000)
}

async function reloadPlugin() {
  saving.value = 'plugin-reload'
  error.value = ''
  probeCacheNotice.value = ''
  try {
    // MP 核心接口：热重载插件后端（清 sys.modules 并重新实例化），等效于插件页的“重载”
    await props.api.get(`plugin/reload/${props.pluginId || 'TmdbRecognizeEnhancer'}`)
    probeCacheNotice.value = '插件后端已重载，新代码与接口已生效'
    await load()
  } catch (err) { error.value = explainError(err, '插件重载失败，请在 MP 插件页手动重载或重启容器') }
  finally { saving.value = '' }
}

function probeFieldSelected(key) {
  return (config.value.media_probe_fields || []).includes(key)
}

function toggleProbeField(key, enabled) {
  const fields = new Set(config.value.media_probe_fields || [])
  enabled ? fields.add(key) : fields.delete(key)
  config.value.media_probe_fields = [...fields]
  if (!enabled) config.value.media_probe_overwrite_fields = (config.value.media_probe_overwrite_fields || []).filter(item => item !== key)
}

function probeFieldPolicy(key) {
  const configured = config.value.media_probe_field_policies?.[key]
  if (['fill_empty', 'overwrite', 'append'].includes(configured)) return configured
  if (config.value.media_probe_policy === 'overwrite' || (config.value.media_probe_overwrite_fields || []).includes(key)) return 'overwrite'
  return 'fill_empty'
}

function setProbeFieldPolicy(key, value) {
  config.value.media_probe_field_policies = { ...(config.value.media_probe_field_policies || {}), [key]: value }
  config.value.media_probe_policy = 'fill_empty'
  config.value.media_probe_overwrite_fields = []
}

function openRule(item = null) {
  const effective = item?.effective || item
  form.value = {
    id: item?.effective?.id || '', source_rule_id: item?.builtin ? item.id : '',
    field: effective?.field || 'videoBit', pattern: effective?.pattern || '',
    value: effective?.value || '{match}', action: effective?.action || 'override',
    enabled: effective?.enabled !== false, priority: effective?.priority ?? 100,
    label: effective?.label || item?.label || '用户覆盖',
  }
  dialog.value = true
}

function openNewRule() { openRule(null) }

async function saveRule() {
  saving.value = 'rule'
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/recognition-rule`, form.value)) || data.value
    dialog.value = false
  } catch (err) { error.value = explainError(err, '识别规则保存失败') }
  finally { saving.value = '' }
}

async function resetRule(item) {
  saving.value = `reset:${item.id}`
  try {
    const payload = item.builtin ? { source_rule_id: item.id } : { id: item.effective?.id || item.id }
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/recognition-rule/delete`, payload)) || data.value
  } catch (err) { error.value = explainError(err, '恢复内置规则失败') }
  finally { saving.value = '' }
}

async function previewRules() {
  saving.value = 'preview'
  preview.value = null
  try {
    preview.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/recognition-rule/preview`, { title: previewTitle.value }))
  } catch (err) { error.value = explainError(err, '覆盖规则试算失败') }
  finally { saving.value = '' }
}

function openRenameField(item = null) {
  renameForm.value = item ? {
    original_key: item.key, key: item.key, label: item.label || item.key,
    expression: item.expression || '', fallback: item.fallback || '', enabled: item.enabled !== false,
  } : {
    original_key: '', key: '', label: '',
    expression: "{% if 'CHS&CHT' in original_name %}简繁{% elif 'CHS' in original_name %}简中{% else %}未知{% endif %}",
    fallback: '', enabled: true,
  }
  renameDialog.value = true
}

async function saveRenameField() {
  saving.value = 'rename-field'
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-field`, renameForm.value)) || data.value
    renameDialog.value = false
  } catch (err) { error.value = explainError(err, '自定义字段保存失败') }
  finally { saving.value = '' }
}

async function deleteRenameField(item) {
  saving.value = `rename-delete:${item.key}`
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-field/delete`, { key: item.key })) || data.value
  } catch (err) { error.value = explainError(err, '自定义字段删除失败') }
  finally { saving.value = '' }
}

async function previewRenameFields() {
  renamePreviewing.value = true
  renamePreview.value = null
  error.value = ''
  try {
    const input = renamePreviewInput.value
    renamePreview.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-field/preview`, {
      context: { original_name: input.original_name, type: input.type, category: input.category },
      source_path: input.source_path,
      target_dir: input.target_dir,
      rendered_relative_path: '示例/首次渲染.mkv',
    }))
  } catch (err) { error.value = explainError(err, '自定义字段试算失败') }
  finally { renamePreviewing.value = false }
}

function variableSyntax(key) { return `{{ ${key} }}` }
function fieldSourceColor(source) { return ({ moviepilot: 'primary', plugin_context: 'secondary', ffprobe: 'purple', user_custom: 'success' })[source] || 'default' }
function openFieldDetail(item) { fieldDetail.value = item; fieldPresetLimit.value = 80; fieldDetailDialog.value = true }
function fieldPresetRules(item) {
  if (!item?.key) return []
  if (item.key === 'releaseGroup') {
    return (data.value.release_groups?.items || []).map(rule => ({
      id: rule.id, label: rule.display_name, pattern: rule.pattern,
      value: rule.display_name, source_label: `${rule.source_label || 'MoviePilot'} · ${rule.category || '制作组'}`,
      overridden: false,
    }))
  }
  return (data.value.recognition_rules?.items || [])
    .filter(rule => rule.field === item.key)
    .map(rule => {
      const effective = rule.effective || rule
      return {
        id: rule.id,
        label: effective.label || rule.label,
        pattern: effective.pattern || rule.pattern,
        value: effective.action === 'clear' ? '（命中后清空）' : (effective.value ?? rule.value ?? '—'),
        source_label: rule.source_label || rule.source,
        overridden: Boolean(rule.overridden),
      }
    })
}
const fieldDetailPresetRules = computed(() => fieldPresetRules(fieldDetail.value))
const visibleFieldPresetRules = computed(() => fieldDetailPresetRules.value.slice(0, fieldPresetLimit.value))

async function copyVariable(key) {
  const text = variableSyntax(key)
  let copied = false
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      copied = true
    }
  } catch (_) { /* 回退到 execCommand */ }
  if (!copied) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try { copied = document.execCommand('copy') } catch (_) { copied = false }
    document.body.removeChild(textarea)
  }
  if (!copied) {
    error.value = `浏览器拒绝访问剪贴板，请手动复制：${text}`
    return
  }
  copiedVariable.value = key
  window.setTimeout(() => { if (copiedVariable.value === key) copiedVariable.value = '' }, 1600)
}

function openMappingRule(item = null) {
  mappingForm.value = item ? { ...item } : { id: '', label: '', stage: 'final_result', mode: 'literal', pattern: '', replacement: '', enabled: true, priority: 100 }
  mappingDialog.value = true
}

async function saveMappingRule(rule = mappingForm.value, closeDialog = true) {
  saving.value = 'rename-mapping'
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-mapping`, rule)) || data.value
    if (closeDialog) mappingDialog.value = false
    return true
  } catch (err) { error.value = explainError(err, '命名映射保存失败'); return false }
  finally { saving.value = '' }
}

async function deleteMappingRule(item) {
  if (!window.confirm(`确认删除命名映射“${item.label || item.pattern}”？`)) return
  saving.value = `mapping-delete:${item.id}`
  try { data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-mapping/delete`, { id: item.id })) || data.value }
  catch (err) { error.value = explainError(err, '命名映射删除失败') }
  finally { saving.value = '' }
}

async function addSubtitleMappingPreset() {
  const presets = [
    { label: '简体字幕后缀', stage: 'final_result', mode: 'literal', pattern: '.chi.zh-cn', replacement: '.chs', enabled: true, priority: 120 },
    { label: '繁体字幕后缀', stage: 'final_result', mode: 'literal', pattern: '.zh-tw', replacement: '.cht', enabled: true, priority: 110 },
  ]
  for (const preset of presets) {
    if (!(await saveMappingRule(preset, false))) return
  }
}

async function previewMappingRules() {
  saving.value = 'mapping-preview'
  mappingPreview.value = null
  try { mappingPreview.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-mapping/preview`, mappingPreviewInput.value)) }
  catch (err) { error.value = explainError(err, '命名映射试算失败') }
  finally { saving.value = '' }
}

function openGroupArrangement(item = null) {
  groupArrangementForm.value = item ? {
    ...item,
    aliases: (item.aliases || []).join('\n'),
  } : {
    id: '', label: '', match_name: '', aliases: '', output_name: '',
    position: 'keep', connector: '__default__', order: 100, enabled: true,
  }
  groupArrangementDialog.value = true
}

async function saveGroupArrangement() {
  saving.value = 'group-arrangement'
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group-arrangement`, groupArrangementForm.value)) || data.value
    groupArrangementDialog.value = false
  } catch (err) { error.value = explainError(err, '制作组编排规则保存失败') }
  finally { saving.value = '' }
}

async function deleteGroupArrangement(item) {
  if (!window.confirm(`确认删除制作组编排“${item.label || item.output_name}”？`)) return
  saving.value = `group-arrangement-delete:${item.id}`
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group-arrangement/delete`, { id: item.id })) || data.value
  } catch (err) { error.value = explainError(err, '制作组编排规则删除失败') }
  finally { saving.value = '' }
}

async function previewGroupArrangement() {
  saving.value = 'group-arrangement-preview'
  groupArrangementPreview.value = null
  error.value = ''
  try {
    groupArrangementPreview.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group-arrangement/preview`, { value: groupArrangementPreviewInput.value }))
  } catch (err) { error.value = explainError(err, '制作组编排试算失败') }
  finally { saving.value = '' }
}

onMounted(load)
onUnmounted(() => { if (staticFfprobePoll) window.clearTimeout(staticFfprobePoll) })
</script>

<template>
  <div>
    <ModuleHeader :icon="headerInfo.icon" :title="headerInfo.title" :subtitle="headerInfo.subtitle" :color="headerInfo.color">
      <template #actions>
        <VBtn variant="text" prepend-icon="mdi-refresh" :loading="loading" @click="load">{{ props.mode === 'probe' ? '刷新状态' : '重新读取 MP 规则' }}</VBtn>
        <VBtn color="primary" prepend-icon="mdi-content-save" :loading="savingConfig" @click="emit('save-config')">{{ props.mode === 'probe' ? '保存设置' : '保存模块开关' }}</VBtn>
      </template>
      <template #controls>
        <template v-if="props.mode === 'probe'">
          <VSwitch v-model="config.media_probe_enabled" color="purple" label="整理前自动扫描" hide-details />
          <div class="module-status-chips">
            <VChip size="small" :color="data.media_probe?.available ? 'success' : 'warning'" variant="tonal" :prepend-icon="data.media_probe?.available ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'">{{ data.media_probe?.available ? 'ffprobe 可用' : 'ffprobe 待检查' }}</VChip>
            <VChip size="small" color="purple" variant="tonal">{{ selectedProbeFieldItems.length }} 个扫描项</VChip>
            <VChip size="small" variant="tonal">缓存 {{ data.media_probe?.cache_entries || 0 }}</VChip>
          </div>
        </template>
        <template v-else-if="props.mode === 'naming'">
          <VSwitch v-model="config.custom_rename_fields_enabled" color="secondary" label="启用自定义命名字段" hide-details />
          <VSwitch v-model="config.rename_mapping_enabled" color="orange" label="启用最终文本映射" hide-details />
        </template>
        <template v-else>
          <VSwitch v-model="config.recognition_rule_overrides_enabled" color="primary" label="启用识别字段覆盖" hide-details />
          <VSwitch v-model="config.release_group_assist_enabled" color="success" label="制作组辅助 TMDB 判断" hide-details />
          <VSwitch v-model="config.release_group_field_supplements_enabled" color="secondary" label="制作组补充命名字段" hide-details />
        </template>
      </template>
    </ModuleHeader>
    <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</VAlert>
    <VAlert type="info" variant="tonal" density="compact" class="mb-4">
      {{ props.mode === 'naming' ? '实际顺序：连接与分隔、制作组编排（在「字段与制作组」页维护）和自定义字段参与 MoviePilot 模板渲染；文本映射最后处理完整相对路径与字幕后缀。' : props.mode === 'probe' ? '扫描发生在命名渲染前，不修改源文件；标准字段可补空、覆盖或追加，probe_* 变量可直接用于命名模板。' : '这里展示当前 MP 实际加载的识别预设；插件覆盖不会修改 MP 或 Rust 文件。' }}
    </VAlert>
    <VAlert v-if="data.recognition_rules?.errors?.length" type="warning" variant="tonal" density="compact" class="mb-4">
      部分规则读取失败：{{ data.recognition_rules.errors.join('；') }}
    </VAlert>

    <VTabs v-if="props.mode === 'metadata'" v-model="section" color="primary" class="mb-4">
      <VTab value="rules" prepend-icon="mdi-text-box-search-outline">内置识别字段</VTab>
      <VTab value="groups" prepend-icon="mdi-account-group-outline">制作组类型与字段</VTab>
      <VTab value="arrange" prepend-icon="mdi-account-multiple-check-outline">制作组编排</VTab>
      <VTab value="test" prepend-icon="mdi-flask-outline">覆盖试算</VTab>
    </VTabs>

    <section v-if="props.mode !== 'naming' && section === 'rules'">
      <div class="filter-row mb-3">
        <VTextField v-model="search" label="搜索字段、名称或正则" prepend-inner-icon="mdi-magnify" clearable hide-details />
        <VSelect v-model="field" label="识别字段" :items="fieldItems" hide-details />
        <VSelect v-model="source" label="规则来源" :items="sourceItems" hide-details />
        <VBtn color="primary" prepend-icon="mdi-plus" @click="openNewRule">新增覆盖</VBtn>
      </div>
      <div class="text-caption text-medium-emphasis mb-2">当前 MP 共读取 {{ data.recognition_rules?.count || 0 }} 条，已覆盖 {{ data.recognition_rules?.override_count || 0 }} 条；筛选结果 {{ rules.length }} 条。</div>
      <VTable density="comfortable" class="tools-table">
        <thead><tr><th style="width:150px">字段</th><th>MP 内置匹配内容</th><th style="width:190px">来源</th><th style="width:150px">操作</th></tr></thead>
        <tbody><tr v-for="item in pagedRules" :key="item.id">
          <td><div class="font-weight-medium">{{ item.field_label }}</div><code>{{ item.field }}</code></td>
          <td><div class="d-flex align-center ga-2"><span>{{ item.effective?.label || item.label }}</span><VChip v-if="item.overridden" size="x-small" color="warning" variant="tonal">插件已覆盖</VChip></div><div class="rule-pattern" :title="item.effective?.pattern || item.pattern">{{ item.effective?.pattern || item.pattern }}</div><div v-if="item.overridden && item.builtin && item.effective?.pattern !== item.pattern" class="text-caption text-medium-emphasis">MP 原正则：{{ item.pattern }}</div><div class="text-caption text-medium-emphasis">{{ item.effective?.action === 'clear' ? '命中后清空字段' : `输出：${item.effective?.value ?? item.value}` }}</div></td>
          <td><VChip size="small" variant="tonal">{{ item.source_label }}</VChip></td>
          <td><VBtn size="small" variant="tonal" prepend-icon="mdi-pencil-outline" @click="openRule(item)">编辑</VBtn><VBtn v-if="item.overridden" size="small" variant="text" color="warning" :loading="saving === `reset:${item.id}`" @click="resetRule(item)">{{ item.builtin ? '恢复' : '删除' }}</VBtn></td>
        </tr></tbody>
      </VTable>
      <VPagination v-if="pageCount > 1" v-model="page" :length="pageCount" :total-visible="7" class="mt-3" />
    </section>

    <section v-else-if="section === 'groups'">
      <div class="filter-row mb-3"><VTextField v-model="search" label="搜索制作组或正则" prepend-inner-icon="mdi-magnify" clearable hide-details /><VSelect v-model="groupKind" label="参与判断的类型" :items="[{title:'全部类型',value:'all'}, ...kindItems]" hide-details /></div>
      <VTable density="comfortable" class="tools-table"><thead><tr><th>制作组规则</th><th>来源</th><th style="width:230px">类型</th><th style="width:150px">补充字段</th></tr></thead><tbody>
        <tr v-for="item in pagedGroups" :key="item.id"><td><div class="font-weight-medium">{{ item.display_name }}</div><div class="rule-pattern">{{ item.pattern }}</div></td><td><VChip size="small" variant="tonal">{{ item.source_label }} · {{ item.category }}</VChip></td><td><VSelect :model-value="item.kind" :items="kindItems" density="compact" hide-details :loading="saving === item.id" @update:model-value="value => saveGroup(item, value)"><template #selection><VChip size="small" :color="kindColor(item.kind)" variant="tonal">{{ kindLabel(item.kind) }}</VChip></template></VSelect></td><td><VBtn size="small" variant="tonal" prepend-icon="mdi-tune-variant" @click="openGroupProfile(item)">{{ Object.keys(item.field_values || {}).length + Object.keys(item.custom_field_values || {}).length ? `${Object.keys(item.field_values || {}).length + Object.keys(item.custom_field_values || {}).length} 项` : '设置' }}</VBtn></td></tr>
      </tbody></VTable>
      <VPagination v-if="groupPageCount > 1" v-model="page" :length="groupPageCount" :total-visible="7" class="mt-3" />
    </section>

    <section v-else-if="props.mode === 'metadata' && section === 'arrange'">
      <div class="d-flex align-center flex-wrap ga-3 mb-4">
        <VAlert type="info" variant="tonal" density="compact" class="flex-grow-1 mb-0">为每个制作组指定别名、最终名称、固定位置和它前面的连接符；未配置的组保持原名与相对顺序。属于「命名规则」模块，随其总开关生效；连接符默认值在命名规则 → 连接与分隔中设置。</VAlert>
        <VBtn color="primary" prepend-icon="mdi-plus" @click="openGroupArrangement()">新增制作组规则</VBtn>
      </div>
      <VAlert v-if="data.release_group_arrangements?.errors?.length" type="warning" variant="tonal" density="compact" class="mb-4">{{ data.release_group_arrangements.errors.join('；') }}</VAlert>
      <div v-if="groupArrangementRules.length" class="group-layout-grid">
        <VCard v-for="item in groupArrangementRules" :key="item.id" variant="outlined" class="mapping-card">
          <VCardText class="group-layout-card">
            <div class="group-layout-main">
              <div class="d-flex align-center flex-wrap ga-2"><span class="font-weight-bold">{{ item.label || item.output_name }}</span><VChip size="x-small" color="primary" variant="tonal">{{ groupPositionLabel(item.position) }}</VChip><VChip v-if="!item.enabled" size="x-small" variant="tonal">已停用</VChip></div>
              <div class="mapping-expression"><code>{{ item.match_name }}</code><VIcon icon="mdi-arrow-right" size="16" /><code>{{ item.output_name }}</code></div>
              <div class="text-caption text-medium-emphasis">别名 {{ item.aliases?.length ? item.aliases.join('、') : '无' }} · 前置连接符 <code>{{ item.connector === '__default__' ? `继承标题／默认（${config.release_group_default_connector === ' ' ? '空格' : config.release_group_default_connector || '@'}）` : item.connector === ' ' ? '空格' : item.connector || '无' }}</code> · 排序值 {{ item.order }}</div>
            </div>
            <div class="d-flex"><VBtn icon="mdi-pencil-outline" size="small" variant="text" @click="openGroupArrangement(item)" /><VBtn icon="mdi-delete-outline" size="small" color="error" variant="text" :loading="saving === `group-arrangement-delete:${item.id}`" @click="deleteGroupArrangement(item)" /></div>
          </VCardText>
        </VCard>
      </div>
      <div v-else class="empty-fields"><VIcon icon="mdi-account-switch-outline" size="48" /><div class="mt-2">尚未设置制作组编排</div><div class="text-caption mt-1">例如让 VCB-Studio 固定最后并使用 &amp;，让 ADWeb 固定最后并使用 @</div></div>
      <VCard variant="outlined" class="mt-4"><VCardItem><VCardTitle>制作组编排试算</VCardTitle><VCardSubtitle>按 MP 的 releaseGroup 字段格式输入，支持 @、&amp;、+ 形式。</VCardSubtitle></VCardItem><VCardText>
        <div class="group-preview-form"><VTextField v-model="groupArrangementPreviewInput" label="输入制作组" placeholder="ADWeb@A@VCB" hide-details /><VBtn color="secondary" prepend-icon="mdi-play" :loading="saving === 'group-arrangement-preview'" @click="previewGroupArrangement">开始试算</VBtn></div>
        <VAlert v-if="groupArrangementPreview" :type="groupArrangementPreview.trace?.applied ? 'success' : 'info'" variant="tonal" class="mt-4"><div>输出：<code>{{ groupArrangementPreview.output }}</code></div><div class="text-caption mt-1">{{ groupArrangementPreview.trace?.reason }}</div><div v-if="groupArrangementPreview.trace?.members?.length" class="member-trace mt-3"><VChip v-for="(member, index) in groupArrangementPreview.trace.members" :key="`${member.output}-${index}`" size="small" variant="tonal"><span v-if="index">{{ member.connector === ' ' ? '空格' : member.connector }}</span>{{ member.output }} · {{ groupPositionLabel(member.position) }}</VChip></div></VAlert>
      </VCardText></VCard>
    </section>

    <section v-else-if="props.mode === 'probe' && section === 'probe'">
      <VTabs v-model="probeSection" color="primary" class="sub-tabs mb-4">
        <VTab value="scan" prepend-icon="mdi-waveform">媒体扫描</VTab>
        <VTab value="strm" prepend-icon="mdi-server-network">
          神医联动
          <VChip size="x-small" color="primary" variant="tonal" class="ms-2">Pro</VChip>
          <VBadge v-if="Number(strmSync.counts?.pending || 0)" :content="strmSync.counts.pending" color="warning" inline class="ms-2" />
        </VTab>
      </VTabs>

      <div v-if="probeSection === 'scan'" class="probe-workspace mb-4">
        <VCard variant="flat" border class="workspace-card probe-strategy-card">
          <VCardItem>
            <template #prepend><VAvatar color="primary" variant="tonal" size="38"><VIcon icon="mdi-tune-vertical" size="21" /></VAvatar></template>
            <VCardTitle class="text-subtitle-1">扫描与写入策略</VCardTitle>
            <VCardSubtitle>选择需要读取的媒体信息，并分别决定如何写回 MP 字段。</VCardSubtitle>
            <template #append><VChip size="small" color="primary" variant="tonal">{{ selectedProbeFieldItems.length }} / {{ mediaProbeFieldItems.length }}</VChip></template>
          </VCardItem>
          <VCardText class="probe-config-body">
          <VAlert v-if="!mediaProbeBackendSupported" type="error" variant="tonal" density="compact">
            新版页面已加载，但插件后端仍是旧实例，因此字段目录显示为空且能力会被误报为 unavailable。
            <template #append><VBtn size="small" color="error" variant="flat" prepend-icon="mdi-restart" :loading="saving === 'plugin-reload'" @click="reloadPlugin">重载插件后端</VBtn></template>
          </VAlert>
          <VAlert v-else-if="!data.media_probe?.available" type="warning" variant="tonal" density="compact">{{ data.media_probe?.message }}</VAlert>
          <div class="probe-selection-summary">
            <template v-if="selectedProbeFieldItems.length">
              <VChip v-for="item in selectedProbeFieldItems" :key="item.key" size="small" color="secondary" variant="tonal">{{ item.label }}<span class="probe-chip-policy">{{ fieldPolicyItems.find(policy => policy.value === probeFieldPolicy(item.key))?.title }}</span></VChip>
            </template>
            <div v-else class="probe-selection-empty"><VIcon icon="mdi-selection-off" size="18" /> 尚未选择扫描项</div>
          </div>
          <VExpansionPanels variant="accordion" multiple class="probe-panels">
            <VExpansionPanel>
              <VExpansionPanelTitle><div><div class="font-weight-medium">扫描字段</div><div class="text-caption text-medium-emphasis">支持补空、覆盖和追加；点击展开逐项配置</div></div></VExpansionPanelTitle>
              <VExpansionPanelText><div class="probe-field-list">
                <div v-for="item in mediaProbeFieldItems" :key="item.key" class="probe-field-row">
                  <VCheckboxBtn :model-value="probeFieldSelected(item.key)" color="primary" @update:model-value="value => toggleProbeField(item.key, value)" />
                  <div class="probe-field-main"><div class="font-weight-medium">{{ item.label }} <code>{{ item.target }}</code></div><div class="text-caption text-medium-emphasis">{{ item.detail }}</div></div>
                  <VSelect :model-value="probeFieldPolicy(item.key)" :items="fieldPolicyItems" density="compact" hide-details class="probe-policy-select" :disabled="!probeFieldSelected(item.key)" @update:model-value="value => setProbeFieldPolicy(item.key, value)" />
                </div>
              </div><VAlert type="info" variant="tonal" density="compact" class="mt-3">追加模式保留原标题/MP 已识别值并去重添加扫描值，例如 <code>HDR10 + DOVI → HDR10 DOVI</code>；字幕映射按自定义占位符连接符追加。</VAlert></VExpansionPanelText>
            </VExpansionPanel>
            <VExpansionPanel v-if="probeFieldSelected('subtitle')">
              <VExpansionPanelTitle><div><div class="font-weight-medium">字幕语言映射</div><div class="text-caption text-medium-emphasis">把内封字幕轨组合映射为 customization 或 Jinja 扫描变量</div></div></VExpansionPanelTitle>
              <VExpansionPanelText><div class="subtitle-mapping-box">
                <VSwitch v-model="config.media_probe_subtitle_to_customization" color="secondary" label="将字幕映射结果写入 customization" hide-details />
                <VTextarea v-model="config.media_probe_subtitle_rules" label="字幕组合映射（每行一条，首条命中生效；未命中自动回退为语言组合）" rows="4" auto-grow placeholder="中文 => 中字内封" hint="未命中规则时自动生成语言组合（简繁日内封等），只需为想改名的组合写规则。「简体+繁体+日语」与「简日+繁日」写法可互相命中；「包含:简体+日语 => 简日内封」为子集匹配；「>=4 => 多国字幕」按语言数量。" persistent-hint />
                <div class="text-caption text-medium-emphasis">可扫描 MKV/MP4 中独立存在的内封字幕流；烧录进画面的硬字幕没有字幕轨，ffprobe 无法判断语言。</div>
              </div></VExpansionPanelText>
            </VExpansionPanel>
            <VExpansionPanel>
              <VExpansionPanelTitle><div><div class="font-weight-medium">高级设置与 ffprobe</div><div class="text-caption text-medium-emphasis">超时、自定义程序路径和安装诊断</div></div></VExpansionPanelTitle>
              <VExpansionPanelText><div class="probe-advanced-grid"><VTextField v-model.number="config.media_probe_timeout" type="number" min="3" max="30" label="单文件超时（秒）" hide-details /><VTextField v-model="config.media_probe_executable" label="自定义 ffprobe 路径（通常留空）" placeholder="/usr/local/bin/ffprobe" clearable hide-details /></div>
                <div v-if="mediaProbeBackendSupported && !data.media_probe?.available" class="mt-3"><div class="text-body-2 mb-2">MoviePilot 当前官方 Dockerfile 已包含 <code>/usr/local/bin/ffprobe</code>。不可用通常表示旧镜像或自定义镜像遗漏。</div><ol class="ffprobe-help"><li>拉取当前 MoviePilot 镜像并重新创建容器。</li><li>自定义镜像可继承官方镜像，或持久挂载 ffprobe。</li><li>容器内执行 <code>ffprobe -version</code> 验证。</li></ol><VAlert type="warning" variant="tonal" density="compact" class="mt-3">常规扫描不会自动下载可执行文件；只有下方「ISO 原盘探测」显式开启后才会下载专用静态 ffprobe。</VAlert></div>
              </VExpansionPanelText>
            </VExpansionPanel>
            <VExpansionPanel>
              <VExpansionPanelTitle><div><div class="font-weight-medium">ISO 原盘探测 <VChip size="x-small" :color="staticFfprobe.installed ? 'success' : config.media_probe_iso_enabled ? 'warning' : 'default'" variant="tonal" class="ms-1">{{ staticFfprobe.installed ? '已就绪' : staticFfprobe.installing ? '下载中' : config.media_probe_iso_enabled ? '未就绪' : '未启用' }}</VChip></div><div class="text-caption text-medium-emphasis">自动下载带蓝光支持的静态 ffprobe，仅接管 .iso 文件的媒体流提取</div></div></VExpansionPanelTitle>
              <VExpansionPanelText><div class="subtitle-mapping-box">
                <VSwitch v-model="config.media_probe_iso_enabled" color="secondary" label="启用 ISO 原盘探测（保存设置后自动下载安装）" hide-details @update:model-value="value => value && installStaticFfprobe(true)" />
                <VAlert type="info" variant="tonal" density="compact">容器自带的 ffprobe 没有 libbluray，读不出 ISO 原盘的播放列表。开启后插件从 <a href="https://github.com/sjtuross/StrmAssistant.Releases/tree/main/static-ffprobe" target="_blank" rel="noopener">StrmAssistant.Releases</a> 下载对应平台的静态构建（v{{ staticFfprobe.version || '8.1.2' }}）到插件数据目录，<strong>只用于 .iso 文件</strong>，普通视频仍走原 ffprobe；卸载插件删除数据目录即可清除。下载走 MP 的 GITHUB_PROXY 与代理设置。</VAlert>
                <div v-if="config.media_probe_iso_enabled" class="d-flex align-center flex-wrap ga-3">
                  <VChip size="small" :color="staticFfprobe.installed ? 'success' : staticFfprobe.installing ? 'info' : 'warning'" variant="tonal" :prepend-icon="staticFfprobe.installed ? 'mdi-check-circle-outline' : staticFfprobe.installing ? 'mdi-progress-download' : 'mdi-alert-circle-outline'">
                    {{ staticFfprobe.installed ? `已安装：${staticFfprobe.path}` : staticFfprobe.installing ? '正在后台下载安装……' : staticFfprobe.last_error || '尚未安装' }}
                  </VChip>
                  <VBtn v-if="!staticFfprobe.installed" size="small" variant="tonal" prepend-icon="mdi-download" :loading="saving === 'static-ffprobe' || staticFfprobe.installing" @click="installStaticFfprobe(false)">{{ staticFfprobe.last_error ? '重试下载' : '立即下载' }}</VBtn>
                </div>
              </div></VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
          <div class="probe-card-actions"><span class="text-caption text-medium-emphasis">设置只影响新进入整理流程的文件</span><VBtn color="primary" variant="tonal" prepend-icon="mdi-content-save" :loading="savingConfig" @click="emit('save-config')">保存策略</VBtn></div>
        </VCardText></VCard>

        <VCard variant="flat" border class="workspace-card probe-trial-card">
          <VCardItem>
            <template #prepend><VAvatar color="secondary" variant="tonal" size="38"><VIcon icon="mdi-file-search-outline" size="21" /></VAvatar></template>
            <VCardTitle class="text-subtitle-1">文件试扫</VCardTitle>
            <VCardSubtitle>读取 MP 容器内的真实文件，只分析媒体流，不修改文件。</VCardSubtitle>
          </VCardItem>
          <VCardText class="probe-config-body">
          <div class="probe-path-row"><VTextField v-model="probePath" label="容器内文件路径" placeholder="/downloads/anime/Example.mkv" prepend-inner-icon="mdi-file-video-outline" hide-details /><MediaFilePicker v-model="probePath" :api="props.api" /></div>
          <div class="probe-scan-bar">
            <VBtn color="secondary" prepend-icon="mdi-waveform" :loading="saving === 'media-probe'" :disabled="!probePath" @click="previewMediaProbe">开始扫描</VBtn>
            <VSwitch v-model="probeForce" label="忽略缓存" density="compact" color="secondary" hide-details class="probe-force-switch" />
            <VTooltip text="清空 ffprobe 扫描结果缓存；下次整理或试扫会重新读取文件" location="top"><template #activator="{ props: tip }"><VBtn v-bind="tip" variant="text" size="small" prepend-icon="mdi-broom" :loading="saving === 'probe-cache'" @click="clearProbeCache">清除缓存{{ data.media_probe?.cache_entries ? `（${data.media_probe.cache_entries}）` : '' }}</VBtn></template></VTooltip>
          </div>
          <VAlert v-if="probeCacheNotice" type="success" variant="tonal" density="compact" closable @click:close="probeCacheNotice = ''">{{ probeCacheNotice }}</VAlert>
          <template v-if="probeResult">
            <div class="probe-result-header">
              <div class="probe-result-file"><VIcon icon="mdi-file-video-outline" color="secondary" /><div><span>扫描完成</span><strong :title="probePath">{{ probeFileName }}</strong></div></div>
              <div class="probe-stream-counts"><span><VIcon icon="mdi-video-outline" size="16" /> {{ probeResult.streams?.video || 0 }} 视频</span><span><VIcon icon="mdi-volume-high" size="16" /> {{ probeResult.streams?.audio || 0 }} 音频</span><span><VIcon icon="mdi-subtitles-outline" size="16" /> {{ probeResult.streams?.subtitle || 0 }} 字幕</span><VChip v-if="probeResult.cached" size="x-small" variant="tonal">缓存</VChip></div>
            </div>
            <VAlert v-for="item in probeResult.diagnostics || []" :key="item.code" :type="item.level === 'warning' ? 'warning' : 'info'" variant="tonal" density="compact">{{ item.message }}</VAlert>
            <div v-if="probeStandardPreviewItems.length" class="probe-summary-section">
              <div class="probe-section-heading"><div><span>写入字段预览</span><small>根据当前策略准备写入 MoviePilot 的值</small></div></div>
              <div class="probe-result-table"><div v-for="item in probeStandardPreviewItems" :key="item.key" class="probe-result-row"><div class="probe-summary-icon" :class="`text-${probeSummaryPresentation(item.key).color}`"><VIcon :icon="probeSummaryPresentation(item.key).icon" size="19" /></div><div><span>{{ item.label }}</span><strong>{{ probeValuePresent(item.value) ? item.value : '未读取' }}</strong></div></div></div>
            </div>
            <VExpansionPanels variant="accordion" class="probe-variable-panel"><VExpansionPanel><VExpansionPanelTitle><div class="probe-variable-title"><div><div class="font-weight-medium">Jinja2 扫描变量</div><div class="text-caption text-medium-emphasis">{{ probeDetectedContextItems.length }} 个有值，可直接用于命名模板</div></div><VChip size="x-small" color="secondary" variant="tonal">probe_*</VChip></div></VExpansionPanelTitle><VExpansionPanelText>
              <div v-if="probeDetectedContextItems.length" class="probe-variable-list"><div v-for="item in probeDetectedContextItems" :key="item.key" class="probe-variable-row" :title="item.description || item.label"><div><span>{{ item.label }}</span><code>{{ item.key }}</code></div><strong>{{ item.value }}</strong></div></div>
              <div v-else class="probe-result-empty compact"><VIcon icon="mdi-code-braces" size="28" /><span>该文件没有生成可用的扫描变量</span></div>
              <VExpansionPanels v-if="probeMissingContextItems.length" variant="accordion" class="probe-missing-panel mt-3"><VExpansionPanel><VExpansionPanelTitle>未取到值的变量（{{ probeMissingContextItems.length }}）</VExpansionPanelTitle><VExpansionPanelText><div class="probe-missing-chips"><VChip v-for="item in probeMissingContextItems" :key="item.key" size="x-small" variant="tonal">{{ item.key }}</VChip></div></VExpansionPanelText></VExpansionPanel></VExpansionPanels>
            </VExpansionPanelText></VExpansionPanel></VExpansionPanels>
          </template>
          <div v-else class="probe-result-empty"><div class="probe-empty-icon"><VIcon icon="mdi-waveform" size="30" /></div><strong>等待选择媒体文件</strong><span>扫描后将在这里展示写入字段、媒体流数量和 Jinja2 变量。</span></div>
        </VCardText></VCard>
      </div>

      <div v-else class="strm-page mb-4">
        <VCard variant="flat" border class="workspace-card strm-overview-card">
          <VCardItem>
            <template #prepend><VAvatar color="secondary" variant="tonal" size="40"><VIcon icon="mdi-server-network" size="22" /></VAvatar></template>
            <VCardTitle class="text-subtitle-1">神医媒体信息联动 <VChip size="x-small" color="secondary" variant="tonal" class="ms-1">仅 Pro</VChip></VCardTitle>
            <VCardSubtitle>复用 MP 传输前的 ffprobe 结果，由 StrmAssistant Pro 写入 Emby，避免网盘侧重复探测。</VCardSubtitle>
            <template #append><VChip size="small" :color="strmSync.active ? 'success' : 'default'" variant="tonal">{{ strmStatusText }}</VChip></template>
          </VCardItem>
          <VCardText class="strm-overview-body">
            <div class="strm-control-row">
              <VSwitch v-model="strmSync.config.enabled" color="secondary" label="启用媒体信息推送" hide-details />
              <div class="strm-counters"><div><span>等待</span><strong>{{ strmSync.counts?.pending || 0 }}</strong></div><div><span>完成</span><strong>{{ strmSync.counts?.completed || 0 }}</strong></div><div><span>需处理</span><strong>{{ strmSync.counts?.attention || 0 }}</strong></div></div>
            </div>
            <VAlert :type="!config.media_probe_enabled ? 'warning' : 'info'" variant="tonal" density="compact">
              <template v-if="!config.media_probe_enabled">请先在“媒体扫描”中启用整理前扫描，否则没有媒体信息可以推送。</template>
              <template v-else>使用 StrmAssistant Pro 的 <code>POST /Items/SyncMediaInfo</code>；不生成 sidecar JSON，也不调用 ffmpeg。</template>
            </VAlert>
          </VCardText>
        </VCard>

        <VCard variant="flat" border class="workspace-card">
          <VCardItem><template #prepend><VAvatar color="primary" variant="tonal" size="38"><VIcon icon="mdi-tune-variant" size="20" /></VAvatar></template><VCardTitle class="text-subtitle-1">联动设置</VCardTitle><VCardSubtitle>选择服务器、设置重试节奏，并在 MP 与 Emby 路径不一致时添加映射。</VCardSubtitle></VCardItem>
          <VCardText class="strm-card-body">
            <div class="strm-config-grid">
              <section class="strm-config-section">
                <div class="strm-section-head"><div><VIcon icon="mdi-server-outline" size="19" color="secondary" /><div><strong>服务器与重试</strong><span>留空目标服务器时推送到全部已连接 Emby</span></div></div></div>
              <VSelect v-model="strmSync.config.servers" :items="strmServerItems" multiple chips clearable label="目标 Emby" hide-details />
              <div class="strm-timing-grid">
                <VTextField v-model.number="strmSync.config.initial_delay_seconds" type="number" min="0" max="300" label="首次等待（秒）" hint="等待 Emby 发现文件" persistent-hint />
                <VTextField v-model.number="strmSync.config.retry_seconds" type="number" min="10" max="600" label="重试间隔（秒）" hint="Path 未入库时重试" persistent-hint />
                <VTextField v-model.number="strmSync.config.max_wait_minutes" type="number" min="1" max="1440" label="最长等待（分钟）" hint="超时后可手动重试" persistent-hint />
              </div>
              </section>
              <section class="strm-config-section">
                <div class="strm-section-head"><div><VIcon icon="mdi-folder-swap-outline" size="19" color="secondary" /><div><strong>路径映射</strong><span>把 MP 整理路径转换成 Emby 中看到的路径</span></div></div><VBtn size="small" variant="tonal" prepend-icon="mdi-plus" @click="addStrmMapping">添加映射</VBtn></div>
              <div v-if="strmSync.config.path_mappings?.length" class="strm-mapping-list">
                <div v-for="(mapping, index) in strmSync.config.path_mappings" :key="index" class="strm-mapping-row">
                  <VSelect v-model="mapping.server" :items="[{ title: '全部服务器', value: '*' }, ...strmServerItems]" label="服务器" density="compact" hide-details />
                  <div class="strm-path-pair"><VTextField v-model="mapping.source" label="MP 前缀" placeholder="/media" density="compact" hide-details /><VIcon icon="mdi-arrow-right" color="medium-emphasis" /><VTextField v-model="mapping.target" label="Emby 前缀" placeholder="/mnt/media" density="compact" hide-details /></div>
                  <VBtn icon="mdi-delete-outline" size="small" color="error" variant="text" @click="strmSync.config.path_mappings.splice(index, 1)" />
                </div>
              </div>
              <div v-else class="strm-empty compact"><VIcon icon="mdi-map-marker-path" size="26" /><span>MP 与 Emby 路径相同时无需配置</span></div>
              </section>
            </div>
            <div class="strm-save-row"><span class="text-caption text-medium-emphasis">启用状态、服务器、重试和路径映射会一起保存</span><VBtn color="secondary" prepend-icon="mdi-content-save" :loading="saving === 'strm-config'" @click="saveStrmSync">保存联动设置</VBtn></div>
          </VCardText>
        </VCard>

        <VCard variant="flat" border class="workspace-card">
          <VCardItem><template #prepend><VAvatar color="secondary" variant="tonal" size="38"><VIcon icon="mdi-flask-outline" size="20" /></VAvatar></template><VCardTitle class="text-subtitle-1">立即试推</VCardTitle><VCardSubtitle>使用已扫描的源文件，向 Emby 真实写入一次媒体信息。</VCardSubtitle></VCardItem>
          <VCardText class="strm-card-body">
            <div class="strm-preview-row">
              <VTextField :model-value="probePath" label="MP 可读源文件" readonly hide-details prepend-inner-icon="mdi-file-video-outline" />
              <VTextField v-model="strmTargetPath" label="MP 整理后目标路径" placeholder="/media/TV/Anime/Season 01/E01.mkv" hide-details prepend-inner-icon="mdi-folder-arrow-right-outline" />
              <VBtn color="secondary" prepend-icon="mdi-send-check-outline" :loading="saving === 'strm-preview'" :disabled="!probePath || !strmTargetPath" @click="previewStrmSync">扫描并试推</VBtn>
            </div>
            <VAlert v-if="!probePath" type="info" variant="tonal" density="compact">尚未选择源文件；切换到“媒体扫描”完成文件选择后再返回本页。</VAlert>
            <VAlert v-if="strmPreview" :type="strmPreview.retryable ? 'warning' : 'info'" variant="tonal" density="compact">
              <div v-for="(result, name) in strmPreview.results || {}" :key="name"><strong>{{ name }}</strong>：{{ result.status }} · {{ result.reason }}<span v-if="result.mapped_path">（{{ result.mapped_path }}）</span></div>
              <div v-if="!Object.keys(strmPreview.results || {}).length">{{ strmPreview.reason || '没有服务器结果' }}</div>
            </VAlert>
          </VCardText>
        </VCard>

        <VCard variant="flat" border class="workspace-card">
          <VCardItem><template #prepend><VAvatar color="primary" variant="tonal" size="38"><VIcon icon="mdi-format-list-checks" size="20" /></VAvatar></template><VCardTitle class="text-subtitle-1">推送任务</VCardTitle><VCardSubtitle>后台等待 Emby 入库，最多保留 80 条已结束记录。</VCardSubtitle><template #append><div class="d-flex ga-1"><VBtn size="small" variant="text" prepend-icon="mdi-replay" @click="retryStrmJob()">重试未完成</VBtn><VBtn size="small" variant="text" color="error" prepend-icon="mdi-delete-sweep-outline" @click="deleteStrmJob()">清理已结束</VBtn></div></template></VCardItem>
          <VCardText v-if="strmSync.jobs?.length" class="strm-job-list">
            <div v-for="job in strmSync.jobs" :key="job.id" class="strm-job-row">
              <div class="min-w-0"><div class="font-weight-medium text-truncate">{{ job.title || job.target_path }}</div><div class="text-caption text-medium-emphasis text-truncate">{{ job.target_path }}</div><div class="text-caption">{{ job.reason }} · 尝试 {{ job.attempts || 0 }} 次</div></div>
              <VChip size="small" :color="job.status === 'completed' ? 'success' : job.status === 'pending' || job.status === 'running' ? 'info' : 'warning'" variant="tonal">{{ job.status }}</VChip>
              <VBtn icon="mdi-replay" size="small" variant="text" :disabled="job.status === 'completed'" @click="retryStrmJob(job.id)" />
              <VBtn icon="mdi-delete-outline" size="small" color="error" variant="text" @click="deleteStrmJob(job.id)" />
            </div>
          </VCardText>
          <VCardText v-else class="strm-empty"><VIcon icon="mdi-inbox-outline" size="34" /><span>暂无推送任务</span></VCardText>
        </VCard>
      </div>
    </section>

    <section v-else-if="props.mode === 'naming'">
      <VTabs v-model="renameRuleSection" color="secondary" class="sub-tabs mb-4">
        <VTab value="defaults" prepend-icon="mdi-tune-variant">连接与分隔</VTab>
        <VTab value="fields" prepend-icon="mdi-code-braces">自定义字段</VTab>
        <VTab value="text" prepend-icon="mdi-find-replace">文本映射</VTab>
      </VTabs>
      <div v-if="renameRuleSection === 'fields'">
        <div class="d-flex align-center flex-wrap ga-3 mb-4">
          <div class="flex-grow-1"><div class="text-h6">Jinja2 自定义字段</div><div class="text-body-2 text-medium-emphasis">保存后可在 MP 命名模板中直接使用 <code v-pre>{{ your_field }}</code>；固定文字可直接填写，条件与组合可使用 Jinja2。</div></div>
          <VBtn color="primary" prepend-icon="mdi-plus" @click="openRenameField()">新增字段</VBtn>
        </div>
        <VAlert v-if="!data.capabilities?.custom_independent_field" type="warning" variant="tonal" class="mb-4">当前 MP 不支持渲染前上下文事件，无法注入自定义字段。请更新 MoviePilot。</VAlert>
        <VCard variant="outlined"><VCardItem><VCardTitle>已定义字段</VCardTitle><VCardSubtitle>{{ customFields.length }} 个字段 · 支持字段间依赖</VCardSubtitle></VCardItem><VCardText>
          <div v-if="customFields.length" class="custom-field-list">
            <div v-for="item in customFields" :key="item.key" class="custom-field-row">
              <div class="flex-grow-1 min-w-0"><div class="d-flex align-center ga-2"><code>{{ item.key }}</code><VChip size="x-small" :color="item.enabled ? 'success' : 'default'" variant="tonal">{{ item.enabled ? '启用' : '停用' }}</VChip></div><div class="font-weight-medium mt-1">{{ item.label || item.key }}</div><div class="rule-pattern text-truncate" :title="item.expression">{{ item.expression }}</div><div v-if="item.dependencies?.length" class="text-caption text-medium-emphasis">依赖：{{ item.dependencies.join('、') }}</div></div>
              <VBtn icon="mdi-content-copy" size="small" variant="text" title="复制模板变量" @click="copyVariable(item.key)" /><VBtn icon="mdi-pencil-outline" size="small" variant="text" @click="openRenameField(item)" /><VBtn icon="mdi-delete-outline" size="small" color="error" variant="text" :loading="saving === `rename-delete:${item.key}`" @click="deleteRenameField(item)" />
            </div>
          </div>
          <div v-else class="empty-fields custom-fields-empty"><VIcon icon="mdi-code-braces" size="34" /><div class="mt-2">尚未定义自定义字段</div><div class="text-caption mt-1">需要时点击右上角“新增字段”</div></div>
        </VCardText></VCard>

        <VCard variant="outlined" class="mt-4"><VCardItem><VCardTitle>上下文试算</VCardTitle><VCardSubtitle>手工构造一次命名上下文，只验证自定义字段输出，不执行文件整理。</VCardSubtitle></VCardItem><VCardText>
          <div class="rename-preview-form">
            <VTextarea v-model="renamePreviewInput.original_name" label="MP 原始标题 original_name" rows="1" auto-grow hide-details class="preview-original" />
            <VTextField v-model="renamePreviewInput.type" label="媒体类型 type" hide-details />
            <VTextField v-model="renamePreviewInput.category" label="二级分类 category" hide-details />
            <VTextField v-model="renamePreviewInput.source_path" label="真实源路径 source_path" hide-details />
            <VTextField v-model="renamePreviewInput.target_dir" label="分类后目标根目录 target_dir" hide-details />
            <VBtn color="secondary" prepend-icon="mdi-play" :loading="renamePreviewing" class="preview-wide" @click="previewRenameFields">试算全部字段</VBtn>
          </div>
          <div v-if="renamePreview" class="preview-output mt-4"><div v-for="(value, key) in renamePreview.values" :key="key" class="d-flex justify-space-between ga-3"><code>{{ key }}</code><span class="text-right text-break">{{ value || '（空）' }}</span></div><VAlert v-if="renamePreview.errors?.length" type="warning" variant="tonal" density="compact" class="mt-3">{{ renamePreview.errors.map(item => `${item.key}: ${item.message}`).join('；') }}</VAlert></div>
        </VCardText></VCard>

        <VCard variant="outlined" class="mt-4"><VCardItem><VCardTitle>可用于文件命名的 Jinja2 输入字段</VCardTitle><VCardSubtitle>统一展示 MoviePilot 原生字段、插件上下文字段与 ffprobe 扫描字段；可复制变量或查看取值详情。</VCardSubtitle></VCardItem><VCardText>
          <VAlert type="info" variant="tonal" density="compact" class="mb-4">每张卡片底部标注了用法：<span class="text-success font-weight-bold">绿色 = 可直接写入 MP 命名模板</span>；<span class="text-warning font-weight-bold">黄色（虚线卡片）= 间接使用</span>——这些目标目录字段在 MP 首次渲染后才产生，不能直接进模板，请先在自定义字段的表达式里引用它们，再把自定义字段写进模板（插件会安全重渲染一次）。彩色小标签仅表示字段来源。</VAlert>
          <VTextField v-model="renameFieldSearch" label="搜索字段名称、变量或用途" prepend-inner-icon="mdi-magnify" clearable hide-details class="mb-4" />
          <VExpansionPanels v-model="openRenameFieldGroups" multiple variant="accordion" class="field-panels">
            <VExpansionPanel v-for="group in renameFieldGroups" :key="group.category" :value="group.category">
              <VExpansionPanelTitle><div class="d-flex align-center ga-3"><span class="font-weight-medium">{{ group.category }}</span><VChip size="x-small" variant="tonal">{{ group.items.length }} 项</VChip></div></VExpansionPanelTitle>
              <VExpansionPanelText><div class="field-description-grid">
                <div v-for="item in group.items" :key="item.key" class="field-description-card" :class="{ 'field-card-indirect': item.template_usage === 'custom_dependency' }">
                  <div class="field-description-head"><code>{{ item.key }}</code><VChip size="x-small" variant="tonal" :color="fieldSourceColor(item.source)">{{ item.source_label || '命名字段' }}</VChip></div>
                  <div class="field-description-label">{{ item.label }}</div>
                  <div class="field-description-text">{{ item.description }}</div>
                  <div class="field-value-summary"><span>{{ item.type || '文本' }}</span><span class="text-truncate">{{ item.values || '按上下文决定' }}</span></div>
                  <div class="field-usage-line" :class="item.template_usage === 'custom_dependency' ? 'usage-indirect' : 'usage-direct'">
                    <VIcon :icon="item.template_usage === 'custom_dependency' ? 'mdi-function-variant' : 'mdi-check-circle-outline'" size="14" />
                    <span>{{ item.template_usage === 'custom_dependency' ? '间接使用：仅作自定义字段依赖' : '可直接写入命名模板' }}</span>
                  </div>
                  <div class="field-card-actions"><VBtn size="small" variant="text" :prepend-icon="copiedVariable === item.key ? 'mdi-check' : 'mdi-content-copy'" @click="copyVariable(item.key)">{{ copiedVariable === item.key ? '已复制' : '复制变量' }}</VBtn><VBtn size="small" variant="tonal" prepend-icon="mdi-information-outline" @click="openFieldDetail(item)">取值详情</VBtn></div>
                </div>
              </div></VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
          <div v-if="!renameFieldGroups.length" class="empty-fields compact-empty">没有匹配的字段</div>
        </VCardText></VCard>
      </div>
      <VCard v-if="renameRuleSection === 'defaults'" variant="outlined" class="mb-4 naming-defaults-card"><VCardItem><VCardTitle>命名连接与分隔默认值</VCardTitle><VCardSubtitle>单组专属连接符 &gt; 标题原连接符 &gt; 全局默认连接符；下方开关决定是否跳过标题原连接符。</VCardSubtitle></VCardItem><VCardText>
        <VAlert v-if="config.enabled && data.capabilities?.customization_separator === false" type="warning" variant="tonal" density="compact" class="mb-4">{{ data.capabilities?.customization_separator_message || '当前 MP 无法动态设置自定义占位符连接符。' }}</VAlert>
        <div class="naming-default-grid">
          <VCombobox v-model="config.rename_default_separator" label="字段空白分隔符" :items="separatorOptions" item-title="title" item-value="value" :return-object="false" clearable hint="留空关闭；例如 WEB DL → WEB.DL" persistent-hint />
          <VCombobox v-model="config.customization_separator" label="自定义占位符连接符" :items="separatorOptions" item-title="title" item-value="value" :return-object="false" hint="多个 customization 命中结果的连接符" persistent-hint />
          <VCombobox v-model="config.release_group_default_connector" label="制作组默认连接符" :items="separatorOptions" item-title="title" item-value="value" :return-object="false" hint="标题无连接符可继承时使用" persistent-hint />
          <VSelect v-model="config.rename_separator_fields" class="separator-scope" label="字段空白分隔符生效范围" :items="separatorFieldItems" multiple chips closable-chips clearable hint="只修改字段内部的空白；不会全局替换路径中的空格" persistent-hint />
          <div class="separator-scope rule-enabled-box"><div><div class="font-weight-medium">默认连接符覆盖标题原连接符</div><div class="text-caption text-medium-emphasis">关闭：未设置专属连接符的组保留标题中的 @、&amp; 或 +；开启：统一改用上面的默认连接符。单组专属设置始终优先。</div></div><VSwitch v-model="config.release_group_normalize_unknown_connectors" color="success" hide-details /></div>
        </div>
      </VCardText><VDivider /><VCardActions><VSpacer /><VBtn color="primary" prepend-icon="mdi-content-save" :loading="savingConfig" @click="emit('save-config')">保存命名默认值</VBtn></VCardActions></VCard>

      <div v-else-if="renameRuleSection === 'text'">
        <div class="d-flex align-center flex-wrap ga-3 mb-4">
          <VAlert type="info" variant="tonal" density="compact" class="flex-grow-1 mb-0">无需判断标题、目录还是字幕。把 MP 的完整首次结果当作输入，例如 <code>AB/C.chi.zh-cn.ass</code>，规则连续执行后得到最终路径。</VAlert>
          <VBtn variant="tonal" color="secondary" prepend-icon="mdi-closed-caption-outline" @click="addSubtitleMappingPreset">添加简繁字幕预设</VBtn>
          <VBtn color="primary" prepend-icon="mdi-plus" @click="openMappingRule()">新增文本映射</VBtn>
        </div>
        <VAlert v-if="!data.rename_mappings?.subtitle_compatible" type="warning" variant="tonal" density="compact" class="mb-4">{{ data.rename_mappings?.subtitle_message || '当前 MP 暂不支持在字幕语言后缀生成后执行；视频最终命名仍可使用。' }}</VAlert>
        <div v-if="mappingRules.length" class="mapping-list">
          <VCard v-for="item in mappingRules" :key="item.id" variant="outlined" class="mapping-card">
            <VCardText class="d-flex align-start ga-3">
              <VAvatar :color="item.stage === 'release_group' ? 'primary' : 'orange'" variant="tonal" size="38"><VIcon :icon="item.stage === 'release_group' ? 'mdi-account-group-outline' : 'mdi-find-replace'" /></VAvatar>
              <div class="flex-grow-1 min-w-0"><div class="d-flex align-center flex-wrap ga-2"><span class="font-weight-bold">{{ item.label }}</span><VChip size="x-small" variant="tonal">{{ mappingStageLabel(item.stage) }}</VChip><VChip size="x-small" :color="item.mode === 'regex' ? 'warning' : 'default'" variant="tonal">{{ item.mode === 'regex' ? '正则' : '字面' }}</VChip><VChip v-if="!item.enabled" size="x-small" variant="tonal">已停用</VChip></div><div class="mapping-expression"><code>{{ item.pattern }}</code><VIcon icon="mdi-arrow-right" size="16" /><code>{{ item.replacement || '（删除）' }}</code></div><div class="text-caption text-medium-emphasis">优先级 {{ item.priority }}</div></div>
              <VBtn icon="mdi-pencil-outline" size="small" variant="text" @click="openMappingRule(item)" /><VBtn icon="mdi-delete-outline" size="small" color="error" variant="text" :loading="saving === `mapping-delete:${item.id}`" @click="deleteMappingRule(item)" />
            </VCardText>
          </VCard>
        </div>
        <div v-else class="empty-fields"><VIcon icon="mdi-find-replace" size="48" /><div class="mt-2">尚未设置最终命名规则</div><div class="text-caption mt-1">可先添加简繁字幕预设，或按 MP 模板生成的完整路径建立任意文字替换</div></div>
        <VCard variant="outlined" class="mt-4"><VCardItem><VCardTitle>最终结果试算</VCardTitle><VCardSubtitle>输入 MP 模板生成的相对路径或文件名；这里只试算，不执行文件整理。</VCardSubtitle></VCardItem><VCardText>
          <div class="mapping-preview-form final-mapping-preview"><VTextField v-model="mappingPreviewInput.value" label="模板生成的完整路径" placeholder="AB/C.chi.zh-cn.ass" hide-details /><VBtn color="secondary" prepend-icon="mdi-play" :loading="saving === 'mapping-preview'" @click="previewMappingRules">开始试算</VBtn></div>
          <VAlert v-if="mappingPreview" :type="mappingPreview.changes?.length ? 'success' : 'info'" variant="tonal" class="mt-4"><div>输出：<code>{{ mappingPreview.output }}</code></div><div class="text-caption mt-1">命中 {{ mappingPreview.changes?.length || 0 }} 条规则</div></VAlert>
        </VCardText></VCard>
      </div>
    </section>

    <section v-else>
      <VCard variant="outlined"><VCardItem><VCardTitle>覆盖层试算</VCardTitle><VCardSubtitle>只运行已保存的插件覆盖规则，不请求 TMDB，也不写整理链。</VCardSubtitle></VCardItem><VCardText>
        <div class="overlay-preview-form"><VTextarea v-model="previewTitle" label="原标题" rows="3" auto-grow hide-details /><div class="overlay-preview-actions"><VBtn color="primary" prepend-icon="mdi-play" :loading="saving === 'preview'" @click="previewRules">开始试算</VBtn></div></div>
        <VAlert v-if="preview && !preview.changes?.length" type="info" variant="tonal" class="mt-4">没有覆盖规则命中；MP 原始解析结果会保持不变。</VAlert>
        <VTable v-else-if="preview?.changes?.length" density="compact" class="tools-table mt-4"><thead><tr><th>字段</th><th>原值</th><th>覆盖值</th><th>规则</th></tr></thead><tbody><tr v-for="item in preview.changes" :key="item.rule_id"><td>{{ item.field }}</td><td>{{ item.before ?? '空' }}</td><td>{{ item.after ?? '清空' }}</td><td>{{ item.label }}</td></tr></tbody></VTable>
      </VCardText></VCard>
    </section>

    <VDialog v-model="groupProfileDialog" max-width="900">
      <VCard><VCardItem><VCardTitle>制作组类型与命名字段</VCardTitle><VCardSubtitle>{{ groupProfileForm.display_name }} · 标准字段、自定义 Jinja 字段共用同一写入策略。</VCardSubtitle></VCardItem><VDivider /><VCardText class="rule-dialog-body">
        <VRow><VCol cols="12" sm="6"><VSelect v-model="groupProfileForm.kind" label="内容类型" :items="kindItems" hide-details /></VCol><VCol cols="12" sm="6"><VSelect v-model="groupProfileForm.field_policy" label="字段写入策略" :items="fieldPolicyItems" hide-details /></VCol></VRow>
        <VAlert type="info" variant="tonal" density="compact">处理顺序：制作组标准字段 → ffprobe 的 <code>probe_*</code> 变量 → 自定义 Jinja 字段计算 → 制作组对自定义字段补充。追加模式会保留已有内容并去重合并；多个合作组给出冲突值时仍会安全跳过。</VAlert>
        <VExpansionPanels variant="accordion" multiple>
          <VExpansionPanel><VExpansionPanelTitle>MP 标准命名字段</VExpansionPanelTitle><VExpansionPanelText><div class="supplement-field-grid"><VTextField v-for="item in supplementFieldItems" :key="item.key" v-model="groupProfileForm.field_values[item.key]" :label="`${item.label}（${item.key}）`" :placeholder="item.placeholder" clearable hide-details /></div></VExpansionPanelText></VExpansionPanel>
          <VExpansionPanel v-if="customFields.length"><VExpansionPanelTitle>用户自定义 Jinja 字段（{{ customFields.length }}）</VExpansionPanelTitle><VExpansionPanelText><div class="supplement-field-grid"><VTextField v-for="item in customFields" :key="item.key" v-model="groupProfileForm.custom_field_values[item.key]" :label="`${item.label || item.key}（${item.key}）`" clearable hide-details /></div><div class="text-caption text-medium-emphasis mt-3">这里填的是该制作组对字段的固定补充值；字段本身的 Jinja 表达式仍在“命名规则 → 自定义字段”维护。</div></VExpansionPanelText></VExpansionPanel>
        </VExpansionPanels>
      </VCardText><VDivider /><VCardActions class="rule-dialog-actions"><VSpacer /><VBtn variant="text" @click="groupProfileDialog = false">取消</VBtn><VBtn color="primary" prepend-icon="mdi-content-save" :loading="saving === 'group-profile'" @click="saveGroupProfile">保存设置</VBtn></VCardActions></VCard>
    </VDialog>

    <VDialog v-model="fieldDetailDialog" max-width="920" scrollable>
      <VCard v-if="fieldDetail"><VCardItem><template #prepend><VAvatar color="secondary" variant="tonal"><VIcon icon="mdi-code-braces" /></VAvatar></template><VCardTitle>{{ fieldDetail.label }}</VCardTitle><VCardSubtitle><code>{{ fieldDetail.key }}</code> · {{ fieldDetail.source_label || '命名字段' }}</VCardSubtitle></VCardItem><VDivider /><VCardText class="field-detail-body">
        <div class="field-detail-meta"><VChip size="small" :color="fieldSourceColor(fieldDetail.source)" variant="tonal">{{ fieldDetail.source_label }}</VChip><VChip size="small" variant="tonal">{{ fieldDetail.type || '文本' }}</VChip><VChip size="small" variant="tonal">{{ fieldDetail.availability || '按上下文可用' }}</VChip></div>
        <VAlert :type="fieldDetail.template_usage === 'custom_dependency' ? 'warning' : 'success'" variant="tonal" density="compact"><strong>{{ fieldDetail.template_usage_label || '可直接用于 MP 命名模板' }}</strong><div class="text-caption mt-1">{{ fieldDetail.template_usage_detail || '可直接复制下方变量写入 MoviePilot 命名模板。' }}</div></VAlert>
        <div class="field-detail-section"><div class="field-detail-title">用途</div><div>{{ fieldDetail.description }}</div></div>
        <div class="field-detail-section"><div class="field-detail-title">可能值与格式</div><div>{{ fieldDetail.values || '具体值由当前命名上下文决定。' }}</div></div>
        <div class="field-detail-section"><div class="field-detail-title">生成逻辑 / 使用注意</div><div>{{ fieldDetail.logic || '使用前建议判断字段是否为空。' }}</div></div>
        <div class="field-detail-section"><div class="field-detail-title">Jinja2 写法</div><code class="field-syntax-block">{{ variableSyntax(fieldDetail.key) }}</code></div>
        <VExpansionPanels v-if="fieldDetailPresetRules.length" variant="accordion">
          <VExpansionPanel><VExpansionPanelTitle><div><div class="font-weight-medium">当前 MP 已加载的识别预设</div><div class="text-caption text-medium-emphasis">{{ fieldDetailPresetRules.length }} 条；展示当前实例实际生效的内置词、正则和插件覆盖</div></div></VExpansionPanelTitle><VExpansionPanelText>
            <div class="preset-table-wrap"><VTable density="compact" class="preset-table"><thead><tr><th>名称</th><th>匹配词 / 正则</th><th>输出值</th><th>来源</th></tr></thead><tbody><tr v-for="rule in visibleFieldPresetRules" :key="rule.id"><td>{{ rule.label }}</td><td><code>{{ rule.pattern }}</code></td><td><code>{{ rule.value }}</code></td><td><VChip size="x-small" :color="rule.overridden ? 'warning' : 'default'" variant="tonal">{{ rule.source_label }}<span v-if="rule.overridden"> · 已覆盖</span></VChip></td></tr></tbody></VTable></div>
            <div v-if="visibleFieldPresetRules.length < fieldDetailPresetRules.length" class="d-flex justify-center mt-3"><VBtn variant="tonal" size="small" @click="fieldPresetLimit += 80">再显示 {{ Math.min(80, fieldDetailPresetRules.length - visibleFieldPresetRules.length) }} 条</VBtn></div>
          </VExpansionPanelText></VExpansionPanel>
        </VExpansionPanels>
      </VCardText><VDivider /><VCardActions><VBtn color="primary" variant="tonal" prepend-icon="mdi-content-copy" @click="copyVariable(fieldDetail.key)">复制变量</VBtn><VSpacer /><VBtn variant="text" @click="fieldDetailDialog = false">关闭</VBtn></VCardActions></VCard>
    </VDialog>

    <VDialog v-model="dialog" max-width="780">
      <VCard class="rule-dialog-card">
        <VCardItem class="rule-dialog-header"><VCardTitle>{{ form.source_rule_id ? '编辑 MP 内置规则的插件覆盖' : '新增识别字段覆盖' }}</VCardTitle><VCardSubtitle>保存后立即作用于新进入 MP 识别链的标题；不会修改容器文件。</VCardSubtitle></VCardItem>
        <VDivider />
        <VCardText class="rule-dialog-body">
          <VRow>
            <VCol cols="12" sm="7"><VSelect v-model="form.field" label="目标字段" :items="fieldItems.filter(item => item.value !== 'all')" hide-details /></VCol>
            <VCol cols="12" sm="5"><VSelect v-model="form.action" label="动作" :items="[{title:'命中后覆盖字段',value:'override'},{title:'命中后清空字段',value:'clear'}]" hide-details /></VCol>
          </VRow>
          <VTextField v-model="form.label" label="规则名称" hide-details />
          <VTextarea v-model="form.pattern" label="匹配正则" rows="4" auto-grow hide-details />
          <VTextField v-if="form.action === 'override'" v-model="form.value" label="输出值" hint="可用 {match}、{first_group}、{1} 或命名组如 {bit}" persistent-hint />
          <VRow align="center">
            <VCol cols="12" sm="7"><VTextField v-model="form.priority" type="number" label="优先级" hint="数值越高越先执行" persistent-hint /></VCol>
            <VCol cols="12" sm="5"><div class="rule-enabled-box"><div><div class="font-weight-medium">启用规则</div><div class="text-caption text-medium-emphasis">保存后立即参与识别</div></div><VSwitch v-model="form.enabled" color="success" hide-details /></div></VCol>
          </VRow>
        </VCardText>
        <VDivider />
        <VCardActions class="rule-dialog-actions"><VSpacer /><VBtn variant="text" @click="dialog = false">取消</VBtn><VBtn color="primary" :loading="saving === 'rule'" @click="saveRule">保存覆盖</VBtn></VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="renameDialog" max-width="820">
      <VCard><VCardItem><VCardTitle>{{ renameForm.original_key ? '编辑自定义命名字段' : '新增自定义命名字段' }}</VCardTitle><VCardSubtitle>字段会作为独立变量加入 MP 的 Jinja2 命名上下文，不覆盖原有字段。</VCardSubtitle></VCardItem><VDivider /><VCardText class="rule-dialog-body">
        <VRow><VCol cols="12" sm="5"><VTextField v-model="renameForm.key" label="字段名" :disabled="!!renameForm.original_key" hint="保存后字段名固定，避免破坏其它字段依赖" persistent-hint /></VCol><VCol cols="12" sm="7"><VTextField v-model="renameForm.label" label="显示名称" /></VCol></VRow>
        <VTextarea v-model="renameForm.expression" label="字段内容 / Jinja2 表达式" rows="6" auto-grow hint="固定内容直接填写；组合使用 {{ title }}；条件可使用 {% if ... %}...{% endif %}" persistent-hint />
        <VTextField v-model="renameForm.fallback" label="计算失败时的回退值" clearable />
        <div class="rule-enabled-box"><div><div class="font-weight-medium">启用字段</div><div class="text-caption text-medium-emphasis">停用后变量不会注入命名模板</div></div><VSwitch v-model="renameForm.enabled" color="success" hide-details /></div>
        <VAlert type="info" variant="tonal" density="compact">MP 命名模板中使用：<code v-pre>{{ 字段名 }}</code>。目标目录字段在初次渲染后补算，并由插件用同一模板安全重渲染一次。</VAlert>
      </VCardText><VDivider /><VCardActions class="rule-dialog-actions"><VSpacer /><VBtn variant="text" @click="renameDialog = false">取消</VBtn><VBtn color="primary" :loading="saving === 'rename-field'" @click="saveRenameField">保存字段</VBtn></VCardActions></VCard>
    </VDialog>

    <VDialog v-model="groupArrangementDialog" max-width="820">
      <VCard><VCardItem><VCardTitle>{{ groupArrangementForm.id ? '编辑制作组编排' : '新增制作组编排' }}</VCardTitle><VCardSubtitle>规则针对单个制作组生效，不需要枚举 A+B、B+A 等所有组合。</VCardSubtitle></VCardItem><VDivider /><VCardText class="rule-dialog-body">
        <VRow><VCol cols="12" sm="5"><VTextField v-model="groupArrangementForm.match_name" label="识别名称" placeholder="VCB-Studio" hint="MP releaseGroup 中出现的主要名称" persistent-hint /></VCol><VCol cols="12" sm="7"><VTextField v-model="groupArrangementForm.output_name" label="最终显示名称" placeholder="VCB-Studio" hint="留空时与识别名称相同" persistent-hint /></VCol></VRow>
        <VTextField v-model="groupArrangementForm.label" label="规则名称" placeholder="例如：VCB 固定最后" />
        <VTextarea v-model="groupArrangementForm.aliases" label="其它别名（每行一个）" rows="3" auto-grow placeholder="VCB&#10;VCB Studio" hint="别名只做单个制作组归一化，不会改 MP 的原始识别词" persistent-hint />
        <VRow><VCol cols="12" sm="5"><VSelect v-model="groupArrangementForm.position" label="所在位置" :items="groupPositionItems" item-title="label" item-value="value" /></VCol><VCol cols="12" sm="3"><VCombobox v-model="groupArrangementForm.connector" label="前置连接符" :items="groupConnectorItems" item-title="title" item-value="value" :return-object="false" hint="不指定时先继承标题连接符，再回退全局默认" persistent-hint /></VCol><VCol cols="12" sm="4"><VTextField v-model="groupArrangementForm.order" type="number" label="同位置排序值" hint="数值越小越靠前" persistent-hint /></VCol></VRow>
        <div class="rule-enabled-box"><div><div class="font-weight-medium">启用规则</div><div class="text-caption text-medium-emphasis">停用后保留配置但不参与编排</div></div><VSwitch v-model="groupArrangementForm.enabled" color="success" hide-details /></div>
        <VAlert type="info" variant="tonal" density="compact">示例：全局默认连接符设为 <code>@</code>；VCB-Studio 单独设置“固定最后 + &amp;”，ADWeb 选择“使用默认”，输入 <code>ADWeb@A@VCB</code> 将得到 <code>A&amp;VCB-Studio@ADWeb</code>。只有一个制作组时不会在开头添加连接符。</VAlert>
      </VCardText><VDivider /><VCardActions class="rule-dialog-actions"><VSpacer /><VBtn variant="text" @click="groupArrangementDialog = false">取消</VBtn><VBtn color="primary" :loading="saving === 'group-arrangement'" @click="saveGroupArrangement">保存编排</VBtn></VCardActions></VCard>
    </VDialog>

    <VDialog v-model="mappingDialog" max-width="820">
      <VCard><VCardItem><VCardTitle>{{ mappingForm.id ? '编辑最终命名规则' : '新增最终命名规则' }}</VCardTitle><VCardSubtitle>规则处理 MP 模板生成的完整相对路径，并按优先级从高到低连续执行。</VCardSubtitle></VCardItem><VDivider /><VCardText class="rule-dialog-body">
        <VSelect v-model="mappingForm.mode" label="匹配模式" :items="[{title:'字面替换',value:'literal'},{title:'正则替换',value:'regex'}]" />
        <VTextField v-model="mappingForm.label" label="规则名称" placeholder="例如：统一合作字幕组顺序" />
        <VTextarea v-model="mappingForm.pattern" :label="mappingForm.mode === 'regex' ? '匹配正则' : '查找文字'" rows="3" auto-grow />
        <VTextField v-model="mappingForm.replacement" label="替换为" hint="留空表示删除；正则模式支持 Python re.sub 的 \1 与 \g<name> 引用" persistent-hint />
        <VRow align="center"><VCol cols="12" sm="7"><VTextField v-model="mappingForm.priority" type="number" label="优先级" hint="数值越大越先执行；后续规则继续处理本规则输出" persistent-hint /></VCol><VCol cols="12" sm="5"><div class="rule-enabled-box"><div><div class="font-weight-medium">启用规则</div><div class="text-caption text-medium-emphasis">停用后保留配置但不执行</div></div><VSwitch v-model="mappingForm.enabled" color="success" hide-details /></div></VCol></VRow>
        <VAlert type="info" variant="tonal" density="compact">示例：依次添加 <code>AB/C → ABC</code> 与 <code>.chi.zh-cn → .chs</code>，输入 <code>AB/C.chi.zh-cn.ass</code> 会得到 <code>ABC.chs.ass</code>。绝对路径及包含 <code>..</code> 的危险结果会被拒绝。</VAlert>
      </VCardText><VDivider /><VCardActions class="rule-dialog-actions"><VSpacer /><VBtn variant="text" @click="mappingDialog = false">取消</VBtn><VBtn color="primary" :loading="saving === 'rename-mapping'" @click="saveMappingRule()">保存映射</VBtn></VCardActions></VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.filter-row { display: grid; grid-template-columns: minmax(260px, 1fr) minmax(180px, 240px) minmax(180px, 240px) auto; gap: 12px; align-items: center; }
.tools-table { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; overflow: hidden; }
.rule-pattern { max-width: 660px; margin-top: 4px; color: rgba(var(--v-theme-on-surface), .64); font: .76rem/1.45 ui-monospace, SFMono-Regular, Consolas, monospace; overflow-wrap: anywhere; }
code { color: rgb(var(--v-theme-primary)); font-weight: 600; }
.rule-dialog-header { padding: 20px 24px 18px; }
.rule-dialog-body { display: grid; gap: 18px; padding: 24px !important; }
.rule-dialog-body :deep(.v-row) { margin-top: -8px; margin-bottom: -8px; }
.rule-enabled-box { min-height: 56px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 7px 14px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 10px; }
.rule-dialog-actions { padding: 14px 20px; }
.custom-field-list { display: grid; gap: 10px; }
.custom-field-row { display: flex; align-items: center; gap: 8px; padding: 13px 14px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; }
.empty-fields { min-height: 230px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(var(--v-theme-on-surface), .5); }
.custom-fields-empty { min-height: 108px; }
.compact-empty { min-height: 110px; }
.preview-output { display: grid; gap: 8px; padding: 12px 14px; border-radius: 12px; background: rgba(var(--v-theme-secondary), .055); }
.rename-preview-form { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px 14px; }
.preview-original, .preview-wide { grid-column: 1 / -1; }
.field-panels { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; overflow: hidden; }
.field-description-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; padding: 4px 0 10px; }
.field-description-card { min-width: 0; padding: 14px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; background: rgba(var(--v-theme-surface), 1); color: inherit; text-align: left; transition: border-color .16s ease, background-color .16s ease; }
.field-description-card:hover { border-color: rgba(var(--v-theme-primary), .55); background: rgba(var(--v-theme-primary), .035); }
.field-description-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.field-description-label { margin-top: 9px; font-weight: 600; }
.field-description-text { min-height: 40px; margin-top: 4px; color: rgba(var(--v-theme-on-surface), .65); font-size: .82rem; line-height: 1.5; }
.field-value-summary { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 8px; margin-top: 9px; color: rgba(var(--v-theme-on-surface), .58); font-size: .75rem; }
.field-value-summary > span:first-child { padding: 1px 7px; border-radius: 8px; background: rgba(var(--v-theme-secondary), .08); color: rgb(var(--v-theme-secondary)); }
.field-card-actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 9px -6px -6px; }
.field-card-indirect { border-style: dashed; border-color: rgba(var(--v-theme-warning), .5); background: rgba(var(--v-theme-warning), .03); }
.field-card-indirect:hover { border-color: rgba(var(--v-theme-warning), .8); background: rgba(var(--v-theme-warning), .06); }
.field-usage-line { display: flex; align-items: center; gap: 5px; margin-top: 8px; font-size: .72rem; font-weight: 600; }
.usage-direct { color: rgb(var(--v-theme-success)); }
.usage-indirect { color: rgb(var(--v-theme-warning)); }
.field-detail-body { display: grid; gap: 16px; padding: 22px 24px !important; }
.field-detail-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.field-detail-section { display: grid; gap: 6px; padding: 12px 14px; border-radius: 10px; background: rgba(var(--v-theme-secondary), .045); line-height: 1.6; overflow-wrap: anywhere; }
.field-detail-title { color: rgba(var(--v-theme-on-surface), .58); font-size: .78rem; font-weight: 600; }
.field-syntax-block { display: block; padding: 10px 12px; border-radius: 8px; background: rgba(var(--v-theme-primary), .07); color: rgb(var(--v-theme-primary)); }
.mapping-list { display: grid; gap: 10px; }
.mapping-card { background: rgba(var(--v-theme-surface), 1); }
.mapping-expression { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin: 8px 0 3px; overflow-wrap: anywhere; }
.mapping-preview-form { display: grid; grid-template-columns: minmax(180px, 240px) minmax(280px, 1fr) auto; gap: 14px; align-items: center; }
.final-mapping-preview { grid-template-columns: minmax(280px, 1fr) auto; }
.naming-default-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.separator-scope { grid-column: 1 / -1; }
.sub-tabs { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.group-layout-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 12px; }
.group-layout-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; min-height: 126px; }
.group-layout-main { min-width: 0; flex: 1; }
.group-preview-form { display: grid; grid-template-columns: minmax(280px, 1fr) auto; gap: 14px; align-items: center; }
.member-trace { display: flex; flex-wrap: wrap; gap: 8px; }
.overlay-preview-form { display: grid; gap: 14px; }
.overlay-preview-actions { display: flex; align-items: center; min-height: 38px; }
.workspace-card { background: rgb(var(--v-theme-surface)); box-shadow: none !important; }
.module-status-chips { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.workspace-card { border-radius: 14px !important; }
.probe-workspace { display: grid; grid-template-columns: minmax(360px, .86fr) minmax(480px, 1.14fr); gap: 16px; align-items: start; }
.probe-strategy-card, .probe-trial-card { min-width: 0; }
.strm-page { display: grid; gap: 14px; }
.strm-overview-body, .strm-card-body { display: grid; gap: 12px; }
.strm-control-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px 24px; }
.strm-counters { display: flex; align-items: center; gap: 8px; }
.strm-counters > div { display: grid; grid-template-columns: auto auto; gap: 7px; align-items: baseline; min-width: 72px; padding: 7px 10px; border-radius: 9px; background: rgba(var(--v-theme-on-surface), .035); }
.strm-counters span { color: rgba(var(--v-theme-on-surface), .58); font-size: .7rem; }
.strm-counters strong { font-size: .95rem; }
.strm-config-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 0; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 11px; overflow: hidden; }
.strm-config-section { min-width: 0; display: grid; align-content: start; gap: 13px; padding: 16px; }
.strm-config-section + .strm-config-section { border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.strm-section-head { min-height: 40px; display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.strm-section-head > div { min-width: 0; display: flex; align-items: flex-start; gap: 9px; }
.strm-section-head > div > div { min-width: 0; display: grid; }
.strm-section-head strong { font-size: .9rem; }
.strm-section-head span { color: rgba(var(--v-theme-on-surface), .55); font-size: .72rem; line-height: 1.4; }
.strm-timing-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.strm-mapping-list, .strm-job-list { display: grid; gap: 8px; }
.strm-mapping-row { display: grid; grid-template-columns: minmax(125px, .42fr) minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 8px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 10px; }
.strm-path-pair { min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 7px; align-items: center; }
.strm-save-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.strm-preview-row { display: grid; grid-template-columns: minmax(220px, 1fr) minmax(260px, 1fr) auto; gap: 10px; align-items: center; }
.strm-job-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto auto; gap: 8px; align-items: center; padding: 9px 10px; border-radius: 9px; background: rgba(var(--v-theme-on-surface), .035); }
.strm-empty { min-height: 96px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 7px; color: rgba(var(--v-theme-on-surface), .48); text-align: center; }
.strm-empty.compact { min-height: 112px; border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 10px; }
.probe-config-body { display: grid; gap: 14px; padding-top: 10px !important; }
.probe-selection-summary { min-height: 34px; display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.probe-selection-summary :deep(.v-chip__content) { gap: 6px; }
.probe-chip-policy { padding-left: 6px; border-left: 1px solid currentColor; opacity: .65; font-size: .66rem; }
.probe-selection-empty { display: flex; align-items: center; gap: 7px; color: rgba(var(--v-theme-on-surface), .48); font-size: .82rem; }
.probe-panels { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; overflow: hidden; }
.probe-field-list { display: grid; overflow: hidden; }
.probe-field-row { min-width: 0; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 9px 4px; border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.probe-field-row:last-child { border-bottom: 0; }
.probe-field-main { min-width: 0; }
.probe-policy-select { width: 148px; }
.subtitle-mapping-box { display: grid; gap: 12px; padding: 14px; border-radius: 12px; background: rgba(var(--v-theme-secondary), .05); }
.probe-advanced-grid { display: grid; grid-template-columns: minmax(120px, .45fr) minmax(0, 1fr); gap: 12px; }
.ffprobe-help { display: grid; gap: 6px; padding-left: 22px; }
.probe-card-actions { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 2px; }
.probe-path-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 10px; }
.probe-scan-bar { display: flex; align-items: center; gap: 4px 12px; flex-wrap: wrap; padding: 8px; border-radius: 10px; background: rgba(var(--v-theme-secondary), .045); }
.probe-force-switch { flex: 0 0 auto; }
.probe-scan-bar > :last-child { margin-left: auto; }
.probe-result-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 13px; border-radius: 11px; background: rgba(var(--v-theme-secondary), .06); }
.probe-result-file { min-width: 0; display: flex; align-items: center; gap: 9px; }
.probe-result-file > div { min-width: 0; display: grid; }
.probe-result-file span { color: rgb(var(--v-theme-success)); font-size: .7rem; font-weight: 600; }
.probe-result-file strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .86rem; }
.probe-stream-counts { flex: 0 0 auto; display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; color: rgba(var(--v-theme-on-surface), .65); font-size: .74rem; }
.probe-stream-counts > span { display: flex; align-items: center; gap: 3px; }
.probe-summary-section { display: grid; gap: 8px; }
.probe-section-heading > div { display: grid; }
.probe-section-heading span { font-size: .9rem; font-weight: 600; }
.probe-section-heading small { color: rgba(var(--v-theme-on-surface), .55); font-size: .72rem; }
.probe-result-table { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.probe-result-row { min-width: 0; display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 9px; padding: 10px 11px; border-radius: 10px; background: rgba(var(--v-theme-on-surface), .035); }
.probe-summary-icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 9px; background: rgba(var(--v-theme-secondary), .08); }
.probe-result-row > div:last-child { min-width: 0; display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.probe-result-row span { min-width: 0; color: rgba(var(--v-theme-on-surface), .58); font-size: .73rem; }
.probe-result-row strong { flex: 0 0 auto; max-width: 58%; overflow: hidden; text-overflow: ellipsis; font-size: .9rem; white-space: nowrap; }
.probe-variable-panel { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 11px; overflow: hidden; }
.probe-variable-title { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-right: 8px; }
.probe-variable-list { display: grid; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 10px; overflow: hidden; }
.probe-variable-row { min-width: 0; display: grid; grid-template-columns: minmax(0, .9fr) minmax(120px, 1.1fr); gap: 14px; align-items: center; padding: 9px 11px; border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.probe-variable-row:last-child { border-bottom: 0; }
.probe-variable-row > div { min-width: 0; display: flex; align-items: baseline; gap: 8px; }
.probe-variable-row span { flex: 0 0 auto; color: rgba(var(--v-theme-on-surface), .62); font-size: .76rem; }
.probe-variable-row code { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .7rem; }
.probe-variable-row strong { min-width: 0; overflow-wrap: anywhere; text-align: right; font-size: .84rem; }
.probe-missing-panel { border: 0; }
.probe-missing-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.probe-result-empty { min-height: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; color: rgba(var(--v-theme-on-surface), .52); text-align: center; }
.probe-result-empty.compact { min-height: 100px; }
.probe-result-empty > span { max-width: 360px; font-size: .78rem; }
.probe-empty-icon { display: grid; place-items: center; width: 58px; height: 58px; margin-bottom: 4px; border-radius: 18px; background: rgba(var(--v-theme-secondary), .075); color: rgb(var(--v-theme-secondary)); }
.preset-table-wrap { max-height: 420px; overflow: auto; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 10px; }
.preset-table thead { position: sticky; top: 0; z-index: 1; background: rgb(var(--v-theme-surface)); }
.preset-table code { white-space: normal; overflow-wrap: anywhere; }
.supplement-field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 1050px) {
  .probe-workspace, .strm-config-grid { grid-template-columns: 1fr; }
  .strm-config-section + .strm-config-section { border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-left: 0; }
}
@media (max-width: 900px) {
  .filter-row { grid-template-columns: 1fr 1fr; }
  .strm-timing-grid { grid-template-columns: 1fr 1fr; }
  .strm-preview-row { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .filter-row, .rename-preview-form { grid-template-columns: 1fr; }
  .preview-original, .preview-wide { grid-column: auto; }
  .field-description-grid { grid-template-columns: 1fr; }
  .mapping-preview-form { grid-template-columns: 1fr; }
  .naming-default-grid { grid-template-columns: 1fr; }
  .separator-scope { grid-column: auto; }
  .group-layout-grid, .group-preview-form { grid-template-columns: 1fr; }
  .probe-result-table, .supplement-field-grid, .strm-timing-grid { grid-template-columns: 1fr; }
  .module-status-chips { width: 100%; }
  .probe-path-row { grid-template-columns: 1fr; }
  .strm-mapping-row { grid-template-columns: 1fr auto; }
  .strm-path-pair { grid-column: 1 / -1; }
  .strm-job-row { grid-template-columns: minmax(0, 1fr) auto; }
  .strm-job-row > .v-btn { grid-row: 2; }
  .strm-save-row { align-items: flex-start; flex-direction: column; }
  .probe-variable-row { grid-template-columns: 1fr; gap: 4px; padding: 9px 10px; }
  .probe-variable-row strong { text-align: left; }
  .probe-field-row { grid-template-columns: auto minmax(0, 1fr); }
  .probe-policy-select { grid-column: 2; width: 100%; }
  .probe-advanced-grid { grid-template-columns: 1fr; }
}
</style>
