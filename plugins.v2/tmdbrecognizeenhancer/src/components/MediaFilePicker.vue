<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  modelValue: { type: String, default: '' },
  compact: { type: Boolean, default: false },
  buttonLabel: { type: String, default: '浏览文件' },
})
const emit = defineEmits(['update:modelValue'])

const dialog = ref(false)
const loading = ref(false)
const error = ref('')
const emptyNotice = ref('')
const storage = ref('local')
const storages = ref([{ title: '本地存储', value: 'local' }])
const treeItems = ref([])
const openedItems = ref([])
const activatedItems = ref([])
const mediaExtensions = new Set(['mkv', 'mp4', 'avi', 'mov', 'ts', 'm2ts', 'webm', 'flv', 'wmv', 'mpg', 'mpeg'])
let treeEpoch = 0

const selectedItem = computed(() => activatedItems.value[0]?.raw || activatedItems.value[0] || null)
const selectedPath = computed(() => selectedItem.value?.type === 'file' ? selectedItem.value.path : '')

function rootItem() {
  // fileid 与官方文件管理器保持一致，部分网盘存储按 ID 定位根目录
  return { name: '/', basename: '/', path: '/', storage: storage.value, type: 'dir', fileid: 'root', children: [] }
}

function normalizeList(response) {
  if (response === undefined || response === null) throw new Error('存储接口无响应')
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
    const children = normalizeList(await props.api.post('/storage/list?sort=name', item))
      .filter(child => child?.type === 'dir' || isMediaFile(child))
      .map(child => {
        if (child.type === 'dir') return { ...child, children: [], __loaded: false }
        // 接口返回的 FileItem 自带 children: []，会让树把文件当成可展开分组而无法选中，必须剥掉
        const { children: _ignored, ...file } = child
        return file
      })
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
  // 切换存储会并发触发 resetTree，晚返回的旧请求不能覆盖新树的展开状态
  const epoch = ++treeEpoch
  error.value = ''
  emptyNotice.value = ''
  activatedItems.value = []
  openedItems.value = []
  treeItems.value = [rootItem()]
  // 必须从 ref 取回响应式代理再填充 children；
  // 直接改原始对象不会触发树的重新渲染，且 __loaded 会挡住后续点击重试。
  const root = treeItems.value[0]
  loading.value = true
  await fetchChildren(root)
  if (epoch !== treeEpoch) return
  openedItems.value = [root]
  loading.value = false
  if (!error.value && !root.children.length) {
    // MP 后端在存储浏览失败时也会返回空列表（HTTP 200），这里必须给出反馈
    emptyNotice.value = '该存储根目录未返回任何内容：存储可能未就绪、无访问权限或后端浏览失败，请检查 MoviePilot 日志。'
  }
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
  <VTooltip v-if="compact" :text="buttonLabel" location="top">
    <template #activator="{ props: tip }"><VBtn v-bind="tip" icon="mdi-folder-search-outline" variant="tonal" color="secondary" size="large" :aria-label="buttonLabel" @click="openPicker" /></template>
  </VTooltip>
  <VBtn v-else variant="tonal" color="secondary" prepend-icon="mdi-folder-search-outline" @click="openPicker">{{ buttonLabel }}</VBtn>
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
        <VAlert v-else-if="emptyNotice" type="info" variant="tonal" density="compact">{{ emptyNotice }}</VAlert>
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
          >
            <template #prepend="{ item }"><VIcon :icon="(item.raw?.type || item.type) === 'dir' ? 'mdi-folder-outline' : 'mdi-file-video-outline'" size="18" /></template>
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
