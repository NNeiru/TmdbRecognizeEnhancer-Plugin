<script setup>
import { ref } from 'vue'
import AppPage from './AppPage.vue'

defineProps({ api: { type: Object, default: () => ({}) } })
const emit = defineEmits(['close'])
const pageRef = ref(null)
</script>

<template>
  <div class="plugin-page">
    <VToolbar density="comfortable" class="toolbar">
      <VIcon icon="mdi-database-search-outline" color="primary" class="ms-3" />
      <div class="text-subtitle-1 font-weight-bold ms-3">TMDB 识别增强</div>
      <VSpacer />
      <VBtn icon="mdi-refresh" variant="text" :loading="pageRef?.loading" @click="pageRef?.loadStatus()" />
      <VBtn icon="mdi-content-save" variant="text" color="primary" :loading="pageRef?.saving" @click="pageRef?.saveConfig()" />
      <VBtn icon="mdi-close" variant="text" @click="emit('close')" />
    </VToolbar>
    <VDivider />
    <AppPage ref="pageRef" :api="api" plugin-id="TmdbRecognizeEnhancer" hide-title />
  </div>
</template>

<style scoped>.toolbar { position: sticky; top: 0; z-index: 10; background: rgb(var(--v-theme-surface)); }</style>
