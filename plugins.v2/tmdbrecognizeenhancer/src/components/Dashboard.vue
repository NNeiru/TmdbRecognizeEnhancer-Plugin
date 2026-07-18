<script setup>
import { computed, onMounted, ref } from 'vue'
import { ensureUiVersion, unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  config: { type: Object, default: () => ({ attrs: {} }) },
  allowRefresh: { type: Boolean, default: true },
})
const loading = ref(false)
const status = ref({ summary: {} })
const summary = computed(() => status.value.summary || {})
const attrs = computed(() => props.config?.attrs || {})

async function loadStatus() {
  loading.value = true
  try {
    const nextStatus = unwrapResponse(await props.api.get('plugin/TmdbRecognizeEnhancer/status')) || status.value
    ensureUiVersion(nextStatus.backend_version)
    status.value = nextStatus
  } finally {
    loading.value = false
  }
}
onMounted(loadStatus)
</script>

<template>
  <VCard :loading="loading" :flat="attrs.border === false" class="dashboard-card">
    <VCardItem>
      <template #prepend><VAvatar color="primary" variant="tonal"><VIcon icon="mdi-database-search-outline" /></VAvatar></template>
      <VCardTitle>{{ attrs.title || 'TMDB 识别增强' }}</VCardTitle>
      <VCardSubtitle>{{ summary.enabled ? '插件总开关已开启' : '插件当前未启用' }}</VCardSubtitle>
    </VCardItem>
    <VCardText>
      <div class="dashboard-metrics">
        <div><span>最近处理</span><strong>{{ summary.total || 0 }}</strong></div>
        <div><span>已接纳</span><strong class="text-success">{{ summary.accepted || 0 }}</strong></div>
        <div><span>接纳率</span><strong>{{ summary.acceptance_rate || 0 }}%</strong></div>
      </div>
    </VCardText>
    <VDivider v-if="allowRefresh" />
    <VCardActions v-if="allowRefresh"><VSpacer /><VBtn icon="mdi-refresh" variant="text" size="small" :loading="loading" @click="loadStatus" /></VCardActions>
  </VCard>
</template>

<style scoped>
.dashboard-card { height: 100%; }
.dashboard-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.dashboard-metrics div { padding: 10px; border-radius: 10px; background: rgba(var(--v-theme-primary),.05); }
.dashboard-metrics span, .dashboard-metrics strong { display: block; }
.dashboard-metrics span { font-size: .72rem; color: rgba(var(--v-theme-on-surface),.58); }
.dashboard-metrics strong { margin-top: 3px; font-size: 1.15rem; }
</style>
