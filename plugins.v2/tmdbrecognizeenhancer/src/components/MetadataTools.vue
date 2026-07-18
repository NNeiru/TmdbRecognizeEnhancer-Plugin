<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'TmdbRecognizeEnhancer' },
  modelValue: { type: Object, default: () => ({}) },
  savingConfig: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'save-config'])
const loading = ref(false)
const saving = ref('')
const error = ref('')
const data = ref({ release_groups: { items: [] }, recognition_rules: { items: [], fields: [], overrides: [] }, rename_fields: { builtin: [], context: [], custom: [] }, rename_mappings: { items: [], stages: [] }, release_group_arrangements: { items: [], positions: [], connectors: [] }, capabilities: {} })
const section = ref('rules')
const search = ref('')
const field = ref('all')
const source = ref('all')
const page = ref(1)
const groupKind = ref('all')
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
const mappingDialog = ref(false)
const mappingForm = ref({ id: '', label: '', stage: 'final_result', mode: 'literal', pattern: '', replacement: '', enabled: true, priority: 100 })
const mappingPreviewInput = ref({ value: 'AB/C.chi.zh-cn.ass' })
const mappingPreview = ref(null)
const renameRuleSection = ref('groups')
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
const availableRenameFields = computed(() => [
  ...(data.value.rename_fields?.builtin || []),
  ...(data.value.rename_fields?.context || []),
  ...customFields.value.map(item => ({
    ...item,
    category: '用户自定义',
    description: `由表达式计算：${item.expression}`,
    availability: item.enabled ? '按表达式依赖阶段可用' : '当前已停用',
    phase: 'custom',
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
  } catch (err) {
    error.value = explainError(err, '内置识别规则加载失败')
  } finally { loading.value = false }
}

async function saveGroup(item, kind) {
  saving.value = item.id
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group`, { id: item.id, kind, display_name: item.display_name })) || data.value
  } catch (err) { error.value = explainError(err, '制作组类型保存失败') }
  finally { saving.value = '' }
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
</script>

<template>
  <div>
    <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</VAlert>
    <div class="d-flex align-center flex-wrap ga-3 mb-4">
      <div><div class="text-h6">MP 内置识别词管理</div><div class="text-body-2 text-medium-emphasis">查看 MP 当前版本实际加载的规则；修改保存在插件覆盖层，不改 MP 或 Rust 文件。</div></div>
      <VSpacer /><VBtn variant="text" prepend-icon="mdi-refresh" :loading="loading" @click="load">重新读取 MP 规则</VBtn>
    </div>
    <VCard variant="outlined" class="mb-4"><VCardText class="d-flex align-center flex-wrap ga-6">
      <VSwitch v-model="config.recognition_rule_overrides_enabled" color="primary" label="启用识别字段覆盖" hide-details />
      <VSwitch v-model="config.release_group_assist_enabled" color="success" label="制作组辅助 TMDB 判断" hide-details />
      <VSwitch v-model="config.custom_rename_fields_enabled" color="secondary" label="启用自定义命名字段" hide-details />
      <VSwitch v-model="config.rename_mapping_enabled" color="orange" label="启用命名规则" hide-details />
      <VSpacer /><VBtn color="primary" prepend-icon="mdi-content-save" :loading="savingConfig" @click="emit('save-config')">保存模块开关</VBtn>
    </VCardText></VCard>
    <VAlert type="info" variant="tonal" density="compact" class="mb-4">
      内置字段覆盖作用于 MP 解析结果；自定义命名字段则在文件整理的 Jinja2 渲染上下文中新增变量，不修改 MP/Rust 文件，也不会覆盖同名内置字段。
    </VAlert>
    <VAlert v-if="data.recognition_rules?.errors?.length" type="warning" variant="tonal" density="compact" class="mb-4">
      部分规则读取失败：{{ data.recognition_rules.errors.join('；') }}
    </VAlert>

    <VTabs v-model="section" color="primary" class="mb-4">
      <VTab value="rules" prepend-icon="mdi-text-box-search-outline">内置识别字段</VTab>
      <VTab value="groups" prepend-icon="mdi-account-group-outline">制作组类型</VTab>
      <VTab value="rename" prepend-icon="mdi-code-braces">自定义命名字段</VTab>
      <VTab value="mapping" prepend-icon="mdi-rename-box-outline">命名规则</VTab>
      <VTab value="test" prepend-icon="mdi-flask-outline">覆盖试算</VTab>
    </VTabs>

    <section v-if="section === 'rules'">
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
      <VTable density="comfortable" class="tools-table"><thead><tr><th>制作组规则</th><th>来源</th><th style="width:230px">类型</th></tr></thead><tbody>
        <tr v-for="item in pagedGroups" :key="item.id"><td><div class="font-weight-medium">{{ item.display_name }}</div><div class="rule-pattern">{{ item.pattern }}</div></td><td><VChip size="small" variant="tonal">{{ item.source_label }} · {{ item.category }}</VChip></td><td><VSelect :model-value="item.kind" :items="kindItems" density="compact" hide-details :loading="saving === item.id" @update:model-value="value => saveGroup(item, value)"><template #selection><VChip size="small" :color="kindColor(item.kind)" variant="tonal">{{ kindLabel(item.kind) }}</VChip></template></VSelect></td></tr>
      </tbody></VTable>
      <VPagination v-if="groupPageCount > 1" v-model="page" :length="groupPageCount" :total-visible="7" class="mt-3" />
    </section>

    <section v-else-if="section === 'rename'">
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
            <div v-else class="empty-fields"><VIcon icon="mdi-code-braces" size="48" /><div class="mt-2">尚未定义自定义字段</div></div>
          </VCardText></VCard>

      <VCard variant="outlined" class="mt-4"><VCardItem><VCardTitle>上下文试算</VCardTitle><VCardSubtitle>手工构造一次命名上下文，只验证自定义字段输出，不执行文件整理。</VCardSubtitle></VCardItem><VCardText>
        <div class="rename-preview-form">
          <VTextarea v-model="renamePreviewInput.original_name" label="MP 原始标题 original_name" rows="2" hide-details class="preview-original" />
          <VTextField v-model="renamePreviewInput.type" label="媒体类型 type" hide-details />
          <VTextField v-model="renamePreviewInput.category" label="二级分类 category" hide-details />
          <VTextField v-model="renamePreviewInput.source_path" label="真实源路径 source_path" hide-details class="preview-wide" />
          <VTextField v-model="renamePreviewInput.target_dir" label="分类后目标根目录 target_dir" hide-details class="preview-wide" />
          <VBtn color="secondary" prepend-icon="mdi-play" :loading="renamePreviewing" class="preview-wide" @click="previewRenameFields">试算全部字段</VBtn>
        </div>
        <div v-if="renamePreview" class="preview-output mt-4"><div v-for="(value, key) in renamePreview.values" :key="key" class="d-flex justify-space-between ga-3"><code>{{ key }}</code><span class="text-right text-break">{{ value || '（空）' }}</span></div><VAlert v-if="renamePreview.errors?.length" type="warning" variant="tonal" density="compact" class="mt-3">{{ renamePreview.errors.map(item => `${item.key}: ${item.message}`).join('；') }}</VAlert></div>
      </VCardText></VCard>

      <VCard variant="outlined" class="mt-4"><VCardItem><VCardTitle>可用于文件命名的输入字段</VCardTitle><VCardSubtitle>这里只列出命名渲染时真实存在的字段；种子信息和整理完成结果不会进入文件命名上下文。</VCardSubtitle></VCardItem><VCardText>
        <VAlert type="info" variant="tonal" density="compact" class="mb-4">目标目录相关字段是在 MP 首次渲染之后、实际复制/移动/链接之前取得的。插件会据此重渲染一次，所以它们仍能影响最终命名，并不是整理完成后的结果。</VAlert>
        <VTextField v-model="renameFieldSearch" label="搜索字段名称、变量或用途" prepend-inner-icon="mdi-magnify" clearable hide-details class="mb-4" />
        <VExpansionPanels v-model="openRenameFieldGroups" multiple variant="accordion" class="field-panels">
          <VExpansionPanel v-for="group in renameFieldGroups" :key="group.category" :value="group.category">
            <VExpansionPanelTitle><div class="d-flex align-center ga-3"><span class="font-weight-medium">{{ group.category }}</span><VChip size="x-small" variant="tonal">{{ group.items.length }} 项</VChip></div></VExpansionPanelTitle>
            <VExpansionPanelText><div class="field-description-grid">
              <button v-for="item in group.items" :key="item.key" type="button" class="field-description-card" @click="copyVariable(item.key)">
                <div class="field-description-head"><code>{{ item.key }}</code><VChip size="x-small" variant="tonal" color="secondary">{{ item.availability || '按上下文可用' }}</VChip></div>
                <div class="field-description-label">{{ item.label }}</div>
                <div class="field-description-text">{{ item.description }}</div>
                <div class="field-copy-hint"><VIcon :icon="copiedVariable === item.key ? 'mdi-check' : 'mdi-content-copy'" size="14" /> {{ copiedVariable === item.key ? '已复制' : '点击复制' }} <code>{{ variableSyntax(item.key) }}</code></div>
              </button>
            </div></VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
        <div v-if="!renameFieldGroups.length" class="empty-fields compact-empty">没有匹配的字段</div>
      </VCardText></VCard>
    </section>

    <section v-else-if="section === 'mapping'">
      <div class="d-flex align-center flex-wrap ga-3 mb-4">
        <div class="flex-grow-1"><div class="text-h6">统一命名规则</div><div class="text-body-2 text-medium-emphasis">先编排制作组；MP 完成首次命名及字幕后缀后，再对完整相对路径统一二次渲染一次。</div></div>
      </div>
      <VTabs v-model="renameRuleSection" color="secondary" class="sub-tabs mb-4">
        <VTab value="groups" prepend-icon="mdi-account-multiple-check-outline">制作组编排</VTab>
        <VTab value="text" prepend-icon="mdi-find-replace">文本映射</VTab>
        <VTab value="defaults" prepend-icon="mdi-tune-variant">连接与分隔默认值</VTab>
      </VTabs>
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

      <div v-if="renameRuleSection === 'groups'">
        <div class="d-flex align-center flex-wrap ga-3 mb-4">
          <VAlert type="info" variant="tonal" density="compact" class="flex-grow-1 mb-0">为每个制作组指定别名、最终名称、固定位置和它前面的连接符；未配置的组保持原名与相对顺序。</VAlert>
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
      </div>

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
        <div v-else class="empty-fields"><VIcon icon="mdi-find-replace" size="48" /><div class="mt-2">尚未设置最终命名规则</div><div class="text-caption mt-1">可先添加简繁字幕预设，或按 MP 首次命名结果建立任意文字替换</div></div>
        <VCard variant="outlined" class="mt-4"><VCardItem><VCardTitle>最终结果试算</VCardTitle><VCardSubtitle>输入 MP 第一次生成的相对路径或文件名；这里只试算，不执行文件整理。</VCardSubtitle></VCardItem><VCardText>
          <div class="mapping-preview-form final-mapping-preview"><VTextField v-model="mappingPreviewInput.value" label="MP 首次命名结果" placeholder="AB/C.chi.zh-cn.ass" hide-details /><VBtn color="secondary" prepend-icon="mdi-play" :loading="saving === 'mapping-preview'" @click="previewMappingRules">开始试算</VBtn></div>
          <VAlert v-if="mappingPreview" :type="mappingPreview.changes?.length ? 'success' : 'info'" variant="tonal" class="mt-4"><div>输出：<code>{{ mappingPreview.output }}</code></div><div class="text-caption mt-1">命中 {{ mappingPreview.changes?.length || 0 }} 条规则</div></VAlert>
        </VCardText></VCard>
      </div>
    </section>

    <section v-else>
      <VCard variant="outlined"><VCardItem><VCardTitle>覆盖层试算</VCardTitle><VCardSubtitle>只运行已保存的插件覆盖规则，不请求 TMDB，也不写整理链。</VCardSubtitle></VCardItem><VCardText>
        <VTextarea v-model="previewTitle" label="原标题" rows="3" auto-grow /><VBtn color="primary" prepend-icon="mdi-play" :loading="saving === 'preview'" @click="previewRules">开始试算</VBtn>
        <VAlert v-if="preview && !preview.changes?.length" type="info" variant="tonal" class="mt-4">没有覆盖规则命中；MP 原始解析结果会保持不变。</VAlert>
        <VTable v-else-if="preview?.changes?.length" density="compact" class="tools-table mt-4"><thead><tr><th>字段</th><th>原值</th><th>覆盖值</th><th>规则</th></tr></thead><tbody><tr v-for="item in preview.changes" :key="item.rule_id"><td>{{ item.field }}</td><td>{{ item.before ?? '空' }}</td><td>{{ item.after ?? '清空' }}</td><td>{{ item.label }}</td></tr></tbody></VTable>
      </VCardText></VCard>
    </section>

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
      <VCard><VCardItem><VCardTitle>{{ mappingForm.id ? '编辑最终命名规则' : '新增最终命名规则' }}</VCardTitle><VCardSubtitle>规则以 MP 的完整首次命名结果为输入，并按优先级从高到低连续执行。</VCardSubtitle></VCardItem><VDivider /><VCardText class="rule-dialog-body">
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
.compact-empty { min-height: 110px; }
.preview-output { display: grid; gap: 8px; padding: 12px 14px; border-radius: 12px; background: rgba(var(--v-theme-secondary), .055); }
.rename-preview-form { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px 20px; }
.preview-original, .preview-wide { grid-column: 1 / -1; }
.field-panels { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; overflow: hidden; }
.field-description-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; padding: 4px 0 10px; }
.field-description-card { min-width: 0; padding: 14px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; background: rgba(var(--v-theme-surface), 1); color: inherit; text-align: left; cursor: pointer; transition: border-color .16s ease, background-color .16s ease; }
.field-description-card:hover { border-color: rgba(var(--v-theme-primary), .55); background: rgba(var(--v-theme-primary), .035); }
.field-description-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.field-description-label { margin-top: 9px; font-weight: 600; }
.field-description-text { min-height: 40px; margin-top: 4px; color: rgba(var(--v-theme-on-surface), .65); font-size: .82rem; line-height: 1.5; }
.field-copy-hint { display: flex; align-items: center; gap: 5px; margin-top: 9px; color: rgba(var(--v-theme-on-surface), .48); font-size: .72rem; }
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
@media (max-width: 900px) { .filter-row { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) {
  .filter-row, .rename-preview-form { grid-template-columns: 1fr; }
  .preview-original, .preview-wide { grid-column: auto; }
  .field-description-grid { grid-template-columns: 1fr; }
  .mapping-preview-form { grid-template-columns: 1fr; }
  .naming-default-grid { grid-template-columns: 1fr; }
  .separator-scope { grid-column: auto; }
  .group-layout-grid, .group-preview-form { grid-template-columns: 1fr; }
}
</style>
