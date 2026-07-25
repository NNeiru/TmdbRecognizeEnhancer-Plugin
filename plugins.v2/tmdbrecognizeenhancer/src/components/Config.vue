<script setup>
import { onMounted, ref } from 'vue'
import StrategySettings from './StrategySettings.vue'
import { cloneConfig, ensureUiVersion, unwrapResponse } from '../utils'

const props = defineProps({
  initialConfig: { type: Object, default: () => ({}) },
  api: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['save', 'close'])
const config = ref(cloneConfig())
const crossIdStatus = ref({})

async function refreshCrossId() {
  try {
    crossIdStatus.value = unwrapResponse(
      await props.api.post('plugin/TmdbRecognizeEnhancer/anime-cross-id/refresh', {}),
    ) || crossIdStatus.value
  } catch (_) {
    // 更新异常会在状态详情中展示，配置弹窗本身保持可用。
  }
}

onMounted(async () => {
  config.value = cloneConfig(props.initialConfig)
  try {
    const status = unwrapResponse(await props.api.get('plugin/TmdbRecognizeEnhancer/status'))
    ensureUiVersion(status?.backend_version)
    crossIdStatus.value = status?.anime_cross_id_database || {}
  } catch (_) {
    // 配置本身仍可使用；版本检查失败不能阻止用户关闭弹窗。
  }
})
</script>

<template>
  <div class="tmdb-config">
    <VToolbar density="comfortable" color="transparent">
      <VAvatar class="ms-3" size="34" color="primary" variant="tonal">
        <VIcon icon="mdi-database-search-outline" size="20" />
      </VAvatar>
      <div class="ms-3">
        <div class="text-subtitle-1 font-weight-bold">媒体整理增强</div>
        <div class="text-caption text-medium-emphasis">整理链与命名策略</div>
      </div>
      <VSpacer />
      <VBtn icon="mdi-content-save" variant="text" color="primary" @click="emit('save', cloneConfig(config))" />
      <VBtn icon="mdi-close" variant="text" @click="emit('close')" />
    </VToolbar>
    <VDivider />
    <StrategySettings
      v-model="config"
      compact
      class="pa-4"
      :cross-id-status="crossIdStatus"
      @refresh-cross-id="refreshCrossId"
    />
  </div>
</template>
