<script setup>
import { computed, onMounted, ref } from 'vue'
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
const data = ref({ release_groups: { items: [] }, builtin_fields: [], custom_fields: [], capabilities: {} })
const section = ref('groups')
const groupSearch = ref('')
const groupKind = ref('all')
const groupSource = ref('all')
const groupPage = ref(1)
const fieldSearch = ref('')
const fieldCategory = ref('all')
const fieldDialog = ref(false)
const editingOriginalKey = ref('')
const fieldForm = ref({ key: '', label: '', expression: '', fallback: '', enabled: true })
const previewContext = ref({ title: '示例标题', name: 'Example Name', year: '2026', releaseGroup: '喵萌奶茶屋' })
const previewResult = ref(null)

const pluginBase = computed(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`)
const config = computed({
  get: () => props.modelValue || {},
  set: value => emit('update:modelValue', value),
})
const kindItems = [
  { title: '未分类 / 不参与', value: 'unknown' },
  { title: '动漫', value: 'animation' },
  { title: '真人电视剧', value: 'live_action' },
]
const kindLabel = value => ({ animation: '动漫', live_action: '真人电视剧', unknown: '未分类' })[value] || '未分类'
const kindColor = value => ({ animation: 'primary', live_action: 'orange', unknown: 'default' })[value] || 'default'
const groupRows = computed(() => {
  const query = groupSearch.value.trim().toLowerCase()
  return (data.value.release_groups?.items || []).filter(item => {
    if (groupKind.value !== 'all' && item.kind !== groupKind.value) return false
    if (groupSource.value !== 'all' && item.source !== groupSource.value) return false
    if (!query) return true
    return [item.display_name, item.pattern, item.category].some(value => String(value || '').toLowerCase().includes(query))
  })
})
const pageSize = 24
const pagedGroups = computed(() => groupRows.value.slice((groupPage.value - 1) * pageSize, groupPage.value * pageSize))
const pageCount = computed(() => Math.max(1, Math.ceil(groupRows.value.length / pageSize)))
const categories = computed(() => ['all', ...new Set((data.value.builtin_fields || []).map(item => item.category))])
const builtinFields = computed(() => {
  const query = fieldSearch.value.trim().toLowerCase()
  return (data.value.builtin_fields || []).filter(item => {
    if (fieldCategory.value !== 'all' && item.category !== fieldCategory.value) return false
    return !query || [item.key, item.label, item.description].some(value => String(value || '').toLowerCase().includes(query))
  })
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.get(`${pluginBase.value}/metadata-tools`)) || data.value
  } catch (err) {
    error.value = err?.message || '字段与制作组数据加载失败'
  } finally {
    loading.value = false
  }
}

async function saveGroup(item, kind) {
  saving.value = item.id
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group`, {
      id: item.id, kind, display_name: item.display_name,
    })) || data.value
  } catch (err) {
    error.value = err?.message || '制作组类型保存失败'
  } finally {
    saving.value = ''
  }
}

function openField(item = null) {
  editingOriginalKey.value = item?.key || ''
  fieldForm.value = item ? JSON.parse(JSON.stringify(item)) : {
    key: '', label: '', expression: '', fallback: '', enabled: true,
  }
  fieldDialog.value = true
}

async function saveField() {
  saving.value = 'field'
  error.value = ''
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/custom-field`, {
      ...fieldForm.value, original_key: editingOriginalKey.value || fieldForm.value.key,
    })) || data.value
    fieldDialog.value = false
  } catch (err) {
    error.value = err?.message || '自定义字段保存失败'
  } finally {
    saving.value = ''
  }
}

async function deleteField(item) {
  saving.value = `delete:${item.key}`
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/custom-field/delete`, { key: item.key })) || data.value
  } catch (err) {
    error.value = err?.message || '自定义字段删除失败'
  } finally {
    saving.value = ''
  }
}

async function previewFields() {
  saving.value = 'preview'
  try {
    previewResult.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/custom-field/preview`, {
      context: previewContext.value,
    }))
  } catch (err) {
    error.value = err?.message || '字段试算失败'
  } finally {
    saving.value = ''
  }
}

onMounted(load)
</script>

<template>
  <div>
    <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</VAlert>

    <div class="d-flex align-center flex-wrap ga-3 mb-4">
      <div>
        <div class="text-h6">字段与制作组</div>
        <div class="text-body-2 text-medium-emphasis">浏览 MP 内置能力，并为 TMDB 判断和重命名增加插件扩展。</div>
      </div>
      <VSpacer />
      <VBtn variant="text" prepend-icon="mdi-refresh" :loading="loading" @click="load">刷新内置目录</VBtn>
    </div>

    <VCard variant="outlined" class="mb-4">
      <VCardText class="d-flex align-center flex-wrap ga-6">
        <VSwitch v-model="config.release_group_assist_enabled" color="primary" label="制作组辅助 TMDB 判断" hide-details />
        <VSwitch v-model="config.custom_rename_fields_enabled" color="success" label="启用自定义重命名字段" hide-details />
        <VSpacer />
        <VBtn color="primary" prepend-icon="mdi-content-save" :loading="savingConfig" @click="emit('save-config')">保存模块开关</VBtn>
      </VCardText>
    </VCard>

    <VTabs v-model="section" color="primary" class="mb-4">
      <VTab value="groups" prepend-icon="mdi-account-group-outline">制作组类型</VTab>
      <VTab value="fields" prepend-icon="mdi-code-braces">重命名字段</VTab>
    </VTabs>

    <section v-if="section === 'groups'">
      <VAlert type="info" variant="tonal" density="compact" class="mb-4">
        MP 内置 anime 分类默认标记为动漫；你可以改为真人电视剧或未分类。类型只用于候选偏好，不改写 MP 源码。
      </VAlert>
      <VRow dense class="mb-3">
        <VCol cols="12" md="6"><VTextField v-model="groupSearch" label="搜索名称、正则或分类" prepend-inner-icon="mdi-magnify" clearable hide-details @update:model-value="groupPage = 1" /></VCol>
        <VCol cols="6" md="3"><VSelect v-model="groupKind" label="类型" :items="[{title:'全部类型',value:'all'}, ...kindItems]" hide-details @update:model-value="groupPage = 1" /></VCol>
        <VCol cols="6" md="3"><VSelect v-model="groupSource" label="来源" :items="[{title:'全部来源',value:'all'},{title:'MP 内置',value:'builtin'},{title:'MP 自定义',value:'mp_custom'}]" hide-details @update:model-value="groupPage = 1" /></VCol>
      </VRow>
      <div class="text-caption text-medium-emphasis mb-2">显示 {{ groupRows.length }} 条；已分类 {{ data.release_groups?.classified_count || 0 }} / {{ data.release_groups?.count || 0 }}</div>
      <VTable density="comfortable" class="tools-table">
        <thead><tr><th>制作组规则</th><th>来源</th><th style="width:220px">参与判断的类型</th></tr></thead>
        <tbody>
          <tr v-for="item in pagedGroups" :key="item.id">
            <td>
              <div class="font-weight-medium">{{ item.display_name }}</div>
              <div class="text-caption text-medium-emphasis text-truncate rule-pattern" :title="item.pattern">{{ item.pattern }}</div>
            </td>
            <td><VChip size="small" variant="tonal">{{ item.source_label }} · {{ item.category }}</VChip></td>
            <td>
              <VSelect :model-value="item.kind" :items="kindItems" density="compact" hide-details :loading="saving === item.id" @update:model-value="value => saveGroup(item, value)">
                <template #selection="{ item: selected }"><VChip size="small" :color="kindColor(selected.value)" variant="tonal">{{ kindLabel(selected.value) }}</VChip></template>
              </VSelect>
            </td>
          </tr>
        </tbody>
      </VTable>
      <VPagination v-if="pageCount > 1" v-model="groupPage" :length="pageCount" :total-visible="7" class="mt-3" />
    </section>

    <section v-else>
      <VAlert :type="data.capabilities?.rename_build_event ? 'success' : 'warning'" variant="tonal" density="compact" class="mb-4">
        {{ data.capabilities?.rename_build_message }}。自定义字段不能覆盖 MP 内置字段，避免破坏现有重命名格式。
      </VAlert>
      <VCard variant="outlined" class="mb-5">
        <VCardItem>
          <VCardTitle>自定义字段</VCardTitle>
          <VCardSubtitle>表达式使用现有命名字段，例如 <code v-text="'{{ title }} ({{ year }})'" /></VCardSubtitle>
          <template #append><VBtn color="primary" prepend-icon="mdi-plus" @click="openField()">新建字段</VBtn></template>
        </VCardItem>
        <VCardText v-if="!data.custom_fields?.length" class="text-medium-emphasis">尚未创建自定义字段。</VCardText>
        <VList v-else lines="two">
          <VListItem v-for="item in data.custom_fields" :key="item.key" :title="`${item.label} · {{ ${item.key} }}`" :subtitle="item.expression">
            <template #prepend><VAvatar color="success" variant="tonal"><VIcon icon="mdi-code-braces" /></VAvatar></template>
            <template #append><VBtn icon="mdi-pencil-outline" variant="text" @click="openField(item)" /><VBtn icon="mdi-delete-outline" color="error" variant="text" :loading="saving === `delete:${item.key}`" @click="deleteField(item)" /></template>
          </VListItem>
        </VList>
      </VCard>

      <VCard variant="outlined" class="mb-5">
        <VCardItem><VCardTitle>字段试算</VCardTitle><VCardSubtitle>不会执行整理，只检查当前自定义表达式的输出。</VCardSubtitle></VCardItem>
        <VCardText>
          <VRow dense>
            <VCol cols="12" sm="6"><VTextField v-model="previewContext.title" label="title" /></VCol>
            <VCol cols="12" sm="6"><VTextField v-model="previewContext.name" label="name" /></VCol>
            <VCol cols="12" sm="6"><VTextField v-model="previewContext.year" label="year" /></VCol>
            <VCol cols="12" sm="6"><VTextField v-model="previewContext.releaseGroup" label="releaseGroup" /></VCol>
          </VRow>
          <VBtn color="primary" variant="tonal" prepend-icon="mdi-play" :loading="saving === 'preview'" @click="previewFields">开始试算</VBtn>
          <VAlert v-if="previewResult" type="info" variant="tonal" class="mt-4">
            <div v-for="(value, key) in previewResult.values" :key="key"><strong>{{ key }}</strong> = {{ value }}</div>
            <div v-for="item in previewResult.errors" :key="item.key" class="text-error">{{ item.key }}：{{ item.message }}</div>
          </VAlert>
        </VCardText>
      </VCard>

      <div class="d-flex align-center flex-wrap ga-3 mb-3">
        <VTextField v-model="fieldSearch" label="搜索内置字段" prepend-inner-icon="mdi-magnify" clearable hide-details class="field-search" />
        <VSelect v-model="fieldCategory" label="字段来源" :items="categories.map(value => ({title:value === 'all' ? '全部来源' : value,value}))" hide-details class="field-category" />
      </div>
      <div class="field-grid">
        <VCard v-for="item in builtinFields" :key="item.key" variant="outlined" class="field-card">
          <VCardText><div class="d-flex align-center ga-2"><code>{{ item.key }}</code><VChip size="x-small" variant="tonal">{{ item.category }}</VChip></div><div class="font-weight-medium mt-2">{{ item.label }}</div><div class="text-caption text-medium-emphasis">{{ item.description }}</div></VCardText>
        </VCard>
      </div>
    </section>

    <VDialog v-model="fieldDialog" max-width="680">
      <VCard>
        <VCardItem><VCardTitle>{{ editingOriginalKey ? '编辑自定义字段' : '新建自定义字段' }}</VCardTitle><VCardSubtitle>字段可在 MP 重命名格式中使用 <code v-text="'{{ 字段名 }}'" /></VCardSubtitle></VCardItem>
        <VCardText>
          <VRow dense>
            <VCol cols="12" sm="5"><VTextField v-model="fieldForm.key" label="字段名" placeholder="anime_group" /></VCol>
            <VCol cols="12" sm="7"><VTextField v-model="fieldForm.label" label="中文名称" placeholder="动画字幕组" /></VCol>
          </VRow>
          <VTextarea v-model="fieldForm.expression" label="Jinja 表达式" placeholder="{{ releaseGroup or '未知字幕组' }}" rows="4" auto-grow />
          <VTextField v-model="fieldForm.fallback" label="计算失败时的回退值" />
          <VSwitch v-model="fieldForm.enabled" color="success" label="启用字段" hide-details />
        </VCardText>
        <VCardActions><VSpacer /><VBtn variant="text" @click="fieldDialog = false">取消</VBtn><VBtn color="primary" :loading="saving === 'field'" @click="saveField">保存字段</VBtn></VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.tools-table { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; }
.rule-pattern { max-width: 560px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
.field-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; }
.field-card { min-height: 122px; }
.field-search { min-width: min(420px, 100%); flex: 1 1 360px; }
.field-category { max-width: 240px; min-width: 190px; }
code { color: rgb(var(--v-theme-primary)); font-weight: 600; }
</style>
