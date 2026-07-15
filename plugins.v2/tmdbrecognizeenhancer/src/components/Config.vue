<script setup>
import { onMounted, ref } from 'vue'
import StrategySettings from './StrategySettings.vue'
import { cloneConfig } from '../utils'

const props = defineProps({
  initialConfig: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['save', 'close'])
const config = ref(cloneConfig())

onMounted(() => {
  config.value = cloneConfig(props.initialConfig)
})
</script>

<template>
  <div class="tmdb-config">
    <VToolbar density="comfortable" color="transparent">
      <VAvatar class="ms-3" size="34" color="primary" variant="tonal">
        <VIcon icon="mdi-database-search-outline" size="20" />
      </VAvatar>
      <div class="ms-3">
        <div class="text-subtitle-1 font-weight-bold">TMDB 识别增强</div>
        <div class="text-caption text-medium-emphasis">候选选择策略</div>
      </div>
      <VSpacer />
      <VBtn icon="mdi-content-save" variant="text" color="primary" @click="emit('save', cloneConfig(config))" />
      <VBtn icon="mdi-close" variant="text" @click="emit('close')" />
    </VToolbar>
    <VDivider />
    <StrategySettings v-model="config" compact class="pa-4" />
  </div>
</template>
