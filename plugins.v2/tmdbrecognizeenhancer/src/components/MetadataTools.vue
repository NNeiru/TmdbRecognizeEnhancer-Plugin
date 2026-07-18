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
const data = ref({ release_groups: { items: [] }, recognition_rules: { items: [], fields: [], overrides: [] }, capabilities: {} })
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
      <VSpacer /><VBtn color="primary" prepend-icon="mdi-content-save" :loading="savingConfig" @click="emit('save-config')">保存模块开关</VBtn>
    </VCardText></VCard>
    <VAlert type="info" variant="tonal" density="compact" class="mb-4">
      MP 的技术字段规则分散在 Python 与 Rust 中，没有统一可写接口。这里展示原规则，编辑后在 MP 解析完成、进入识别链前覆盖字段值；“恢复内置”即可撤销。独立自定义重命名字段暂未启用。
    </VAlert>
    <VAlert v-if="data.recognition_rules?.errors?.length" type="warning" variant="tonal" density="compact" class="mb-4">
      部分规则读取失败：{{ data.recognition_rules.errors.join('；') }}
    </VAlert>

    <VTabs v-model="section" color="primary" class="mb-4">
      <VTab value="rules" prepend-icon="mdi-text-box-search-outline">内置识别字段</VTab>
      <VTab value="groups" prepend-icon="mdi-account-group-outline">制作组类型</VTab>
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

    <section v-else>
      <VCard variant="outlined"><VCardItem><VCardTitle>覆盖层试算</VCardTitle><VCardSubtitle>只运行已保存的插件覆盖规则，不请求 TMDB，也不写整理链。</VCardSubtitle></VCardItem><VCardText>
        <VTextarea v-model="previewTitle" label="原标题" rows="3" auto-grow /><VBtn color="primary" prepend-icon="mdi-play" :loading="saving === 'preview'" @click="previewRules">开始试算</VBtn>
        <VAlert v-if="preview && !preview.changes?.length" type="info" variant="tonal" class="mt-4">没有覆盖规则命中；MP 原始解析结果会保持不变。</VAlert>
        <VTable v-else-if="preview?.changes?.length" density="compact" class="tools-table mt-4"><thead><tr><th>字段</th><th>原值</th><th>覆盖值</th><th>规则</th></tr></thead><tbody><tr v-for="item in preview.changes" :key="item.rule_id"><td>{{ item.field }}</td><td>{{ item.before ?? '空' }}</td><td>{{ item.after ?? '清空' }}</td><td>{{ item.label }}</td></tr></tbody></VTable>
      </VCardText></VCard>
    </section>

    <VDialog v-model="dialog" max-width="760"><VCard><VCardItem><VCardTitle>{{ form.source_rule_id ? '编辑 MP 内置规则的插件覆盖' : '新增识别字段覆盖' }}</VCardTitle><VCardSubtitle>保存后立即作用于新进入 MP 识别链的标题；不会修改容器文件。</VCardSubtitle></VCardItem><VCardText>
      <VRow dense><VCol cols="12" sm="7"><VSelect v-model="form.field" label="目标字段" :items="fieldItems.filter(item => item.value !== 'all')" /></VCol><VCol cols="12" sm="5"><VSelect v-model="form.action" label="动作" :items="[{title:'命中后覆盖字段',value:'override'},{title:'命中后清空字段',value:'clear'}]" /></VCol></VRow>
      <VTextField v-model="form.label" label="规则名称" /><VTextarea v-model="form.pattern" label="匹配正则" rows="4" auto-grow /><VTextField v-if="form.action === 'override'" v-model="form.value" label="输出值" hint="可用 {match}、{first_group}、{1} 或命名组如 {bit}" persistent-hint />
      <VRow dense class="mt-2"><VCol cols="6"><VTextField v-model="form.priority" type="number" label="优先级" /></VCol><VCol cols="6"><VSwitch v-model="form.enabled" color="success" label="启用" hide-details /></VCol></VRow>
    </VCardText><VCardActions><VSpacer /><VBtn variant="text" @click="dialog = false">取消</VBtn><VBtn color="primary" :loading="saving === 'rule'" @click="saveRule">保存覆盖</VBtn></VCardActions></VCard></VDialog>
  </div>
</template>

<style scoped>
.filter-row { display: grid; grid-template-columns: minmax(260px, 1fr) minmax(180px, 240px) minmax(180px, 240px) auto; gap: 12px; align-items: center; }
.tools-table { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; overflow: hidden; }
.rule-pattern { max-width: 660px; margin-top: 4px; color: rgba(var(--v-theme-on-surface), .64); font: .76rem/1.45 ui-monospace, SFMono-Regular, Consolas, monospace; overflow-wrap: anywhere; }
code { color: rgb(var(--v-theme-primary)); font-weight: 600; }
@media (max-width: 900px) { .filter-row { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .filter-row { grid-template-columns: 1fr; } }
</style>
