<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const dialog = ref(false)
const loading = ref(false)
const error = ref('')
const storage = ref('local')
const storages = ref([{ title: '本地存储', value: 'local' }])
const treeItems = ref([])
const openedItems = ref([])
const activatedItems = ref([])
const mediaExtensions = new Set(['mkv', 'mp4', 'avi', 'mov', 'ts', 'm2ts', 'webm', 'flv', 'wmv', 'mpg', 'mpeg'])

const selectedItem = computed(() => activatedItems.value[0] || null)
const selectedPath = computed(() => selectedItem.value?.type === 'file' ? selectedItem.value.path : '')

function rootItem() {
  return { name: '/', basename: '/', path: '/', storage: storage.value, type: 'dir', children: [] }
}

function normalizeList(response) {
  const value = unwrapResponse(response)
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.value)) return value.value
  if (Array.isArray(response?.data?.value)) return response.data.value
  return []
}

function isMediaFile(item) {
  if (item?.type !== 'file') return false
  const name = String(item.name || item.basename || item.path || '')
  return mediaExtensions.has(name.split('.').pop()?.toLowerCase())
}

async function fetchChildren(item) {
  if (!item || item.type !== 'dir' || item.__loaded) return
  item.__loaded = true
  try {
    const children = normalizeList(await props.api.post('/storage/list', item))
      .filter(child => child?.type === 'dir' || isMediaFile(child))
      .map(child => child.type === 'dir' ? { ...child, children: [], __loaded: false } : { ...child })
    item.children.splice(0, item.children.length, ...children)
  } catch (err) {
    item.__loaded = false
    error.value = err?.message || '目录读取失败'
  }
}

async function loadStorages() {
  try {
    const response = await props.api.get('system/setting/public/Storages')
    const value = response?.data?.value || unwrapResponse(response)?.value || unwrapResponse(response)
    if (Array.isArray(value) && value.length) {
      storages.value = value.map(item => ({ title: item.name || item.type, value: item.type }))
      if (!storages.value.some(item => item.value === storage.value)) storage.value = storages.value[0].value
    }
  } catch (_) { /* 保留本地存储兜底 */ }
}

async function resetTree() {
  error.value = ''
  activatedItems.value = []
  openedItems.value = []
  const root = rootItem()
  treeItems.value = [root]
  loading.value = true
  await fetchChildren(root)
  openedItems.value = [root]
  loading.value = false
}

async function openPicker() {
  dialog.value = true
  await loadStorages()
  await resetTree()
}

function chooseFile() {
  if (!selectedPath.value) return
  emit('update:modelValue', selectedPath.value)
  dialog.value = false
}

watch(storage, () => { if (dialog.value) resetTree() })
onMounted(loadStorages)
</script>

<template>
  <VBtn variant="tonal" color="secondary" prepend-icon="mdi-folder-search-outline" @click="openPicker">浏览文件</VBtn>
  <VDialog v-model="dialog" max-width="760">
    <VCard>
      <VCardItem>
        <template #prepend><VAvatar color="secondary" variant="tonal"><VIcon icon="mdi-file-tree-outline" /></VAvatar></template>
        <VCardTitle>选择容器内媒体文件</VCardTitle>
        <VCardSubtitle>使用 MoviePilot 的存储接口浏览；仅显示目录和常见视频文件。</VCardSubtitle>
      </VCardItem>
      <VDivider />
      <VCardText class="file-picker-body">
        <VSelect v-model="storage" :items="storages" label="MoviePilot 存储" hide-details />
        <VAlert v-if="error" type="error" variant="tonal" density="compact">{{ error }}</VAlert>
        <VProgressLinear v-if="loading" indeterminate color="secondary" />
        <div class="file-tree-box">
          <VTreeview
            v-model:activated="activatedItems"
            v-model:opened="openedItems"
            :items="treeItems"
            :load-children="fetchChildren"
            item-key="path"
            item-title="name"
            item-value="path"
            activatable
            return-object
            open-on-click
            expand-icon="mdi-folder"
            collapse-icon="mdi-folder-open"
          >
            <template #prepend="{ item }"><VIcon :icon="item.type === 'dir' ? 'mdi-folder-outline' : 'mdi-file-video-outline'" size="18" /></template>
          </VTreeview>
        </div>
        <div class="selected-path"><span>已选择</span><code>{{ selectedPath || '请在目录树中选择一个媒体文件' }}</code></div>
      </VCardText>
      <VDivider />
      <VCardActions><VSpacer /><VBtn variant="text" @click="dialog = false">取消</VBtn><VBtn color="primary" :disabled="!selectedPath" @click="chooseFile">使用此文件</VBtn></VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.file-picker-body { display: grid; gap: 14px; }
.file-tree-box { min-height: 280px; max-height: 52vh; overflow: auto; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; padding: 6px; }
.selected-path { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 10px; align-items: center; padding: 10px 12px; border-radius: 10px; background: rgba(var(--v-theme-secondary), .06); }
.selected-path span { color: rgba(var(--v-theme-on-surface), .6); font-size: .78rem; }
.selected-path code { overflow-wrap: anywhere; }
</style>
