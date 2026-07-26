<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ModuleHeader from './ModuleHeader.vue'
import { unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginBase: { type: String, required: true },
})
const emit = defineEmits(['config-saved'])

const loading = ref(false)
const saving = ref(false)
const testing = ref(false)
const candidateLoading = ref(false)
const candidateSyncing = ref(false)
const actionLoading = ref(false)
const error = ref('')
const notice = ref('')
const data = ref({
  active: false,
  config: {},
  failure_categories: [],
  records: [],
  record_counts: {},
  candidates: { ready: [], failed: [] },
  notification_services: [],
  notification_channels: [],
  candidate_schedule: {},
})
const now = new Date()
const selectedQuarter = ref(`${now.getFullYear()}-Q${Math.floor(now.getMonth() / 3) + 1}`)
const selectedReadyIds = ref([])
const selectedFailedIds = ref([])
const manualCandidateBusy = ref('')
const manualCandidateDialog = ref(false)
const manualCandidateItem = ref(null)
const manualCandidateTmdbId = ref('')
const recordFilter = ref('all')
const showRecords = ref(false)

const config = computed(() => data.value.config || {})
const modeItems = [
  { title: '仅观察', value: 'observe', subtitle: '只分类和记录，不发送额外消息' },
  { title: '并行增强', value: 'parallel', subtitle: '保留原生通知，同时发送增强通知' },
  { title: '接管发送', value: 'takeover', subtitle: '由插件发送；需关闭原生渠道类型' },
]
const policyItems = [
  { title: '立即通知', value: 'notify' },
  { title: '进入摘要', value: 'digest' },
  { title: '静默记录', value: 'silent' },
]
const recordActionText = {
  observed: '已观察',
  notified: '已提交到 MP',
  delivered: '渠道确认送达',
  delivery_failed: '渠道发送失败',
  suppressed: '已静默',
  digest_pending: '等待摘要',
  digest_sent: '摘要已提交',
}
const quarterItems = computed(() => {
  const values = []
  for (let year = now.getFullYear() + 1; year >= now.getFullYear() - 3; year -= 1) {
    for (let quarter = 4; quarter >= 1; quarter -= 1) {
      values.push({ title: `${year} 年 Q${quarter}`, value: `${year}-Q${quarter}` })
    }
  }
  return values
})
const records = computed(() => (data.value.records || []).filter(item => {
  if (recordFilter.value === 'all') return true
  return item.scene === recordFilter.value
}))
const readyCandidates = computed(() => data.value.candidates?.ready || [])
const failedCandidates = computed(() => data.value.candidates?.failed || [])
const notificationServiceItems = computed(() => (
  (data.value.notification_services || [])
    .filter(item => item.accepts_plugin)
    .map(item => ({
      title: item.title,
      value: item.value,
      subtitle: item.subtitle,
    }))
))
const unavailableNotificationServices = computed(() => (
  (data.value.notification_services || []).filter(item => !item.accepts_plugin)
))
const allReadySelected = computed(() => (
  readyCandidates.value.length > 0
  && selectedReadyIds.value.length === readyCandidates.value.length
))
const allFailedSelected = computed(() => (
  failedCandidates.value.length > 0
  && selectedFailedIds.value.length === failedCandidates.value.length
))

function setAllReady(value) {
  selectedReadyIds.value = value
    ? readyCandidates.value.map(item => item.id)
    : []
}

function setAllFailed(value) {
  selectedFailedIds.value = value
    ? failedCandidates.value.map(item => item.id)
    : []
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    data.value = unwrapResponse(
      await props.api.get(`${props.pluginBase}/notification-enhancer`),
    ) || data.value
    if (/^\d{4}-Q[1-4]$/.test(data.value.config?.notification_candidate_quarter || '')) {
      selectedQuarter.value = data.value.config.notification_candidate_quarter
    }
  } catch (err) {
    error.value = err?.message || '通知模块加载失败'
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  error.value = ''
  notice.value = ''
  try {
    const next = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/config`,
      config.value,
    ))
    data.value = { ...data.value, ...(next || {}) }
    emit('config-saved', config.value)
    notice.value = '设置已保存并立即生效'
  } catch (err) {
    error.value = err?.message || '保存失败'
  } finally {
    saving.value = false
  }
}

async function sendTest(scene) {
  testing.value = true
  error.value = ''
  try {
    const next = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/test`, { scene },
    ))
    data.value = { ...data.value, ...(next || {}) }
    notice.value = '目标通知实例已返回发送成功'
  } catch (err) {
    error.value = err?.message || '测试消息发送失败'
  } finally {
    testing.value = false
  }
}

async function queryCandidates(options = {}) {
  const silent = options?.silent === true
  if (candidateLoading.value || candidateSyncing.value) return
  if (silent) candidateSyncing.value = true
  else candidateLoading.value = true
  error.value = ''
  if (!silent) {
    selectedReadyIds.value = []
    selectedFailedIds.value = []
  }
  try {
    const result = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/candidates`,
      {
        quarter: selectedQuarter.value,
        region: config.value.notification_candidate_region,
        platforms: config.value.notification_candidate_platforms,
        sequel_only: config.value.notification_candidate_sequel_only,
      },
    )) || {}
    data.value.candidates = {
      ready: result.ready || result.items || [],
      failed: result.failed || [],
    }
    if (silent) {
      const readyIds = new Set(data.value.candidates.ready.map(item => item.id))
      const failedIds = new Set(data.value.candidates.failed.map(item => item.id))
      selectedReadyIds.value = selectedReadyIds.value.filter(id => readyIds.has(id))
      selectedFailedIds.value = selectedFailedIds.value.filter(id => failedIds.has(id))
    }
  } catch (err) {
    if (!silent) error.value = err?.message || '候选查询失败'
  } finally {
    if (silent) candidateSyncing.value = false
    else candidateLoading.value = false
  }
}

async function candidateAction(action, candidateType = 'ready') {
  const ids = candidateType === 'failed' ? selectedFailedIds.value : selectedReadyIds.value
  if (!ids.length) return
  actionLoading.value = true
  error.value = ''
  try {
    const result = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/candidates/action`,
      {
        quarter: selectedQuarter.value,
        item_ids: ids,
        action,
        region: config.value.notification_candidate_region,
        platforms: config.value.notification_candidate_platforms,
        sequel_only: config.value.notification_candidate_sequel_only,
      },
    )) || {}
    data.value.candidates = {
      ready: result.ready || result.items || [],
      failed: result.failed || [],
    }
    selectedReadyIds.value = []
    selectedFailedIds.value = []
    if (action === 'ignore') notice.value = '已忽略所选候选'
    else if (action === 'retry') notice.value = '已在后台重新扫描所选失败条目'
    else notice.value = `候选已提交到集数偏移维护规则${result.operation_failures?.length ? `，${result.operation_failures.length} 条失败` : ''}`
  } catch (err) {
    error.value = err?.message || '候选处理失败'
  } finally {
    actionLoading.value = false
  }
}

function candidateFilterPayload() {
  return {
    notification_candidate_quarter: selectedQuarter.value,
    notification_candidate_region: config.value.notification_candidate_region,
    notification_candidate_platforms: config.value.notification_candidate_platforms,
    notification_candidate_sequel_only: config.value.notification_candidate_sequel_only,
    notification_candidate_preference: config.value.notification_candidate_preference,
  }
}

let candidateFilterSaveQueue = Promise.resolve()
let candidateFilterRevision = 0

function persistCandidateFilters() {
  const payload = candidateFilterPayload()
  candidateFilterSaveQueue = candidateFilterSaveQueue
    .catch(() => {})
    .then(async () => {
      await props.api.post(
        `${props.pluginBase}/notification-enhancer/config`,
        payload,
      )
      emit('config-saved', { ...config.value, ...payload })
    })
  return candidateFilterSaveQueue
}

async function applyCandidateFilters() {
  const revision = ++candidateFilterRevision
  try {
    await persistCandidateFilters()
    if (revision !== candidateFilterRevision) return
    await queryCandidates()
  } catch (err) {
    error.value = err?.message || '筛选条件保存失败'
  }
}

function openFailedCandidate(item) {
  manualCandidateItem.value = item
  manualCandidateTmdbId.value = ''
  manualCandidateDialog.value = true
  error.value = ''
}

async function addFailedCandidate(action) {
  const item = manualCandidateItem.value
  if (!item) return
  const tmdbId = Number(manualCandidateTmdbId.value || 0)
  if (!tmdbId) {
    error.value = `请先为“${item.title}”填写 TMDBID`
    return
  }
  manualCandidateBusy.value = item.id
  error.value = ''
  try {
    const result = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/candidates/action`,
      {
        quarter: selectedQuarter.value,
        item_ids: [item.id],
        action,
        tmdb_id_overrides: { [item.id]: tmdbId },
        region: config.value.notification_candidate_region,
        platforms: config.value.notification_candidate_platforms,
        sequel_only: config.value.notification_candidate_sequel_only,
      },
    )) || {}
    data.value.candidates = {
      ready: result.ready || result.items || [],
      failed: result.failed || [],
    }
    if (result.operation_failures?.length) {
      throw new Error(result.operation_failures[0]?.reason || '规则添加失败')
    }
    manualCandidateDialog.value = false
    manualCandidateItem.value = null
    manualCandidateTmdbId.value = ''
    notice.value = `已按 TMDB ${tmdbId} 建立维护规则`
  } catch (err) {
    error.value = err?.message || '补充 TMDBID 失败'
  } finally {
    manualCandidateBusy.value = ''
  }
}

async function sendCandidateBatch() {
  actionLoading.value = true
  error.value = ''
  try {
    await persistCandidateFilters()
    const result = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/candidates/batch/send`,
      {
        quarter: selectedQuarter.value,
        region: config.value.notification_candidate_region,
        platforms: config.value.notification_candidate_platforms,
        sequel_only: config.value.notification_candidate_sequel_only,
      },
    )) || {}
    if (result.snapshot) data.value.candidates = result.snapshot
    if (result.candidate_schedule) data.value.candidate_schedule = result.candidate_schedule
    notice.value = `计划批次已发送：可加入 ${result.ready || 0} 部，扫描失败 ${result.failed || 0} 部`
  } catch (err) {
    error.value = err?.message || '发送计划批次失败'
  } finally {
    actionLoading.value = false
  }
}

async function clearRecords() {
  try {
    const next = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/records/clear`, {},
    ))
    data.value = { ...data.value, ...(next || {}) }
  } catch (err) {
    error.value = err?.message || '清空失败'
  }
}

async function sendDigest() {
  try {
    const next = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/digest/send`, {},
    ))
    data.value = { ...data.value, ...(next || {}) }
    notice.value = '失败摘要已提交到“插件”通知渠道'
  } catch (err) {
    error.value = err?.message || '摘要发送失败'
  }
}

let candidateRefreshTimer = null

function refreshCandidatesWhenVisible() {
  if (
    document.visibilityState === 'visible'
    && !actionLoading.value
    && !manualCandidateDialog.value
  ) {
    queryCandidates({ silent: true })
  }
}

onMounted(async () => {
  await load()
  await queryCandidates()
  candidateRefreshTimer = window.setInterval(refreshCandidatesWhenVisible, 15000)
  document.addEventListener('visibilitychange', refreshCandidatesWhenVisible)
  window.addEventListener('focus', refreshCandidatesWhenVisible)
})

onBeforeUnmount(() => {
  if (candidateRefreshTimer) window.clearInterval(candidateRefreshTimer)
  document.removeEventListener('visibilitychange', refreshCandidatesWhenVisible)
  window.removeEventListener('focus', refreshCandidatesWhenVisible)
})
</script>

<template>
  <div class="notification-page">
    <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</VAlert>
    <VAlert v-if="notice" type="success" variant="tonal" closable density="compact" class="mb-4" @click:close="notice = ''">{{ notice }}</VAlert>

    <ModuleHeader
      icon="mdi-bell-cog-outline"
      title="入库通知增强"
      subtitle="观察 MoviePilot 最终通知，按失败类型决定发送、摘要或静默，并补充整理上下文。"
      color="primary"
    >
      <template #actions>
        <VBtn variant="tonal" prepend-icon="mdi-bell-check-outline" :loading="testing" @click="sendTest('success')">测试成功通知</VBtn>
        <VBtn color="primary" prepend-icon="mdi-content-save" :loading="saving" @click="save">保存设置</VBtn>
      </template>
      <template #controls>
        <VSwitch v-model="config.notification_enhancer_enabled" color="success" hide-details label="启用通知增强" />
        <VChip :color="data.active ? 'success' : 'default'" variant="tonal" size="small">
          {{ data.active ? '正在运行' : '尚未运行' }}
        </VChip>
        <VSpacer />
        <VSwitch v-model="config.notification_plugin_enabled" color="primary" hide-details label="允许插件发送通知" />
      </template>
    </ModuleHeader>

    <section class="section-shell">
      <div class="section-heading">
        <div>
          <h3>发送方式</h3>
          <p>先选择插件介入范围；观察模式适合先验证分类结果。</p>
        </div>
      </div>
      <div class="mode-grid">
        <button
          v-for="item in modeItems"
          :key="item.value"
          type="button"
          class="mode-card"
          :class="{ active: config.notification_mode === item.value }"
          @click="config.notification_mode = item.value"
        >
          <VIcon :icon="item.value === 'observe' ? 'mdi-eye-outline' : item.value === 'parallel' ? 'mdi-call-split' : 'mdi-swap-horizontal-bold'" />
          <span><strong>{{ item.title }}</strong><small>{{ item.subtitle }}</small></span>
          <VIcon v-if="config.notification_mode === item.value" icon="mdi-check-circle" color="primary" />
        </button>
      </div>
      <VAlert v-if="config.notification_mode === 'takeover'" type="warning" variant="tonal" density="compact" class="mt-3">
        {{ data.takeover_note }}
      </VAlert>
      <div class="option-row mt-3">
        <VSwitch v-model="config.notification_success_enabled" color="success" hide-details label="增强成功通知" />
        <VSwitch v-model="config.notification_failure_enabled" color="warning" hide-details label="处理失败通知" />
        <VSwitch v-model="config.notification_passthrough_manual" color="primary" hide-details label="接管时转发其它人工通知" />
      </div>
      <div class="notification-route-grid">
        <VSelect
          v-model="config.notification_success_service"
          :items="notificationServiceItems"
          label="入库成功通知实例"
          placeholder="留空则发送到全部插件通知渠道"
          density="comfortable"
          variant="outlined"
          clearable
          hide-details
        />
        <VSelect
          v-model="config.notification_failure_service"
          :items="notificationServiceItems"
          label="入库失败通知实例"
          placeholder="留空则发送到全部插件通知渠道"
          density="comfortable"
          variant="outlined"
          clearable
          hide-details
        />
      </div>
      <VExpansionPanels variant="accordion" class="notification-template-panels">
        <VExpansionPanel>
          <VExpansionPanelTitle>
            <div class="template-panel-title">
              <VIcon icon="mdi-code-braces" color="primary" />
              <span>
                <strong>通知样式与 Jinja2 模板</strong>
                <small>默认原样使用 MoviePilot 已渲染的通知；只有模板显式引用路径时才会加入路径。</small>
              </span>
            </div>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <VAlert type="info" variant="tonal" density="compact" class="mb-3">
              MoviePilot 的系统通知模板会先完成渲染，<code>original_title</code> 与
              <code>original_text</code> 就是其最终结果。可用：
              <code>scene</code>、<code>category_label</code>、<code>reason</code>、
              <code>source_path</code>、<code>target_path</code>、<code>current_time</code>。
            </VAlert>
            <div class="notification-template-grid">
              <div class="notification-template-card success">
                <h4><VIcon icon="mdi-check-circle-outline" /> 入库成功</h4>
                <VTextField
                  v-model="config.notification_success_title_template"
                  label="标题模板"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
                <VTextarea
                  v-model="config.notification_success_text_template"
                  label="正文模板"
                  variant="outlined"
                  rows="4"
                  auto-grow
                  hide-details
                />
              </div>
              <div class="notification-template-card failure">
                <h4><VIcon icon="mdi-alert-circle-outline" /> 入库失败</h4>
                <VTextField
                  v-model="config.notification_failure_title_template"
                  label="标题模板"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
                <VTextarea
                  v-model="config.notification_failure_text_template"
                  label="正文模板"
                  variant="outlined"
                  rows="4"
                  auto-grow
                  hide-details
                />
              </div>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </section>

    <section class="section-shell">
      <div class="section-heading">
        <div>
          <h3>失败类型策略</h3>
          <p>失败原因会在通知发送前分类；未分类异常始终通知，避免静默吞错。</p>
        </div>
        <VBtn variant="text" color="warning" prepend-icon="mdi-bell-alert-outline" :loading="testing" @click="sendTest('failure')">测试失败通知</VBtn>
      </div>
      <div class="policy-grid">
        <div v-for="item in data.failure_categories" :key="item.key" class="policy-card">
          <VAvatar size="38" color="primary" variant="tonal"><VIcon :icon="item.icon" size="20" /></VAvatar>
          <div class="policy-copy">
            <strong>{{ item.label }}</strong>
            <small>{{ item.description }}</small>
          </div>
          <VSelect
            v-model="config.notification_failure_policies[item.key]"
            :items="policyItems"
            :disabled="item.locked"
            density="compact"
            variant="outlined"
            hide-details
            class="policy-select"
          />
        </div>
      </div>
    </section>

    <section class="section-shell">
      <div class="section-heading responsive">
        <div>
          <h3>集数偏移通知与审批</h3>
          <p>存量按月或季度汇总；基线之后新增的匹配及失败条目逐部通知。</p>
        </div>
        <VSwitch v-model="config.notification_episode_candidates_enabled" color="success" hide-details label="启用集数候选通知" />
      </div>
      <div class="delivery-grid">
        <VSelect
          v-model="config.notification_candidate_service"
          :items="notificationServiceItems"
          label="集数偏移审批通知实例"
          placeholder="请选择具体通知实例"
          density="comfortable"
          variant="outlined"
          clearable
          hide-details
        />
        <div class="delivery-mode">
          <VSwitch v-model="config.notification_candidate_batch_enabled" color="primary" hide-details label="定时批量" />
          <VSelect
            v-model="config.notification_candidate_batch_frequency"
            :items="[
              { title: '每月月初', value: 'monthly' },
              { title: '每季度首月月初', value: 'quarterly' },
            ]"
            density="compact"
            variant="outlined"
            hide-details
            :disabled="!config.notification_candidate_batch_enabled"
          />
          <VSelect
            v-model="config.notification_candidate_batch_hour"
            :items="Array.from({ length: 24 }, (_, value) => ({ title: `${String(value).padStart(2, '0')}:00`, value }))"
            density="compact"
            variant="outlined"
            hide-details
            :disabled="!config.notification_candidate_batch_enabled"
          />
        </div>
        <div class="delivery-mode realtime">
          <VSwitch v-model="config.notification_candidate_realtime_enabled" color="success" hide-details label="实时监控新增" />
          <small>首次开启以当前缓存为基线；之后新增或失败转成功时逐部推送。</small>
        </div>
      </div>
      <div class="candidate-message-style">
        <span>
          <strong>候选通知样式</strong>
          <small>经典消息沿用 MoviePilot 通知格式；Rich Message 使用新版 Telegram 富文本和媒体页面。</small>
        </span>
        <VBtnToggle
          v-model="config.notification_candidate_message_style"
          mandatory
          density="compact"
          color="primary"
          variant="outlined"
          divided
        >
          <VBtn value="classic" prepend-icon="mdi-message-text-outline">经典消息</VBtn>
          <VBtn value="rich" prepend-icon="mdi-card-text-outline">Rich Message</VBtn>
        </VBtnToggle>
        <VTextField
          v-if="config.notification_candidate_message_style === 'rich'"
          v-model="config.notification_candidate_custom_emoji_id"
          label="会员表情 ID（可选）"
          placeholder="留空使用普通符号"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          class="premium-emoji-field"
        />
      </div>
      <small v-if="config.notification_candidate_message_style === 'rich'" class="premium-emoji-help">
        用于总览与详情标题装饰；填写 Telegram custom_emoji_id。Bot 无权限或留空时自动使用普通表情。
      </small>
      <VAlert type="info" variant="tonal" density="compact" class="mt-3">
        这里按 MoviePilot 的通知配置名称精确投递；即使有多个 Telegram，也只会发送到选中的实例。
        请确保该实例已启用“插件”通知类型。
      </VAlert>
      <VAlert
        v-if="unavailableNotificationServices.length"
        type="warning"
        variant="tonal"
        density="compact"
        class="mt-2"
      >
        {{ unavailableNotificationServices.map(item => item.title).join('、') }}
        尚未启用“插件”通知类型，因此暂不可选择。
      </VAlert>
      <div class="candidate-controls">
        <VSelect v-model="selectedQuarter" :items="quarterItems" label="季度" density="comfortable" variant="outlined" hide-details @update:model-value="applyCandidateFilters" />
        <VSelect v-model="config.notification_candidate_region" :items="[
          { title: '日漫', value: 'japan' }, { title: '国漫', value: 'china' },
          { title: '海外动画', value: 'other' }, { title: '全部地区', value: 'all' },
        ]" label="地区" density="comfortable" variant="outlined" hide-details @update:model-value="applyCandidateFilters" />
        <VSelect v-model="config.notification_candidate_preference" :items="[
          { title: '优先剧集组', value: 'group_preferred' },
          { title: 'TMDB 默认编集', value: 'default' },
        ]" label="通知一键审批目标" density="comfortable" variant="outlined" hide-details @update:model-value="persistCandidateFilters" />
        <VBtn variant="tonal" prepend-icon="mdi-refresh" :loading="candidateLoading" @click="applyCandidateFilters">刷新</VBtn>
        <VBtn color="primary" variant="tonal" prepend-icon="mdi-send-clock" :loading="actionLoading" @click="sendCandidateBatch">立即生成批次</VBtn>
      </div>
      <div class="option-row compact">
        <VSwitch v-model="config.notification_candidate_sequel_only" color="primary" hide-details label="仅续作或多季作品" @update:model-value="applyCandidateFilters" />
        <VSelect v-model="config.notification_candidate_platforms" :items="['TV', 'TV SHORT', 'ONA', 'OVA']" multiple chips closable-chips label="载体" density="compact" variant="outlined" hide-details class="platform-select" @update:model-value="applyCandidateFilters" />
      </div>
      <div v-if="readyCandidates.length" class="candidate-list">
        <div class="candidate-toolbar">
          <VCheckboxBtn :model-value="allReadySelected" @update:model-value="setAllReady" />
          <span><strong>匹配完成</strong><small>{{ readyCandidates.length }} 部可直接加入维护规则</small></span>
          <VSpacer />
          <div class="candidate-actions">
            <VBtn variant="text" color="default" :disabled="!selectedReadyIds.length" @click="candidateAction('ignore')">忽略所选</VBtn>
            <VBtn variant="tonal" color="primary" :loading="actionLoading" :disabled="!selectedReadyIds.length" @click="candidateAction('add_default')">按 TMDB 默认加入</VBtn>
            <VBtn color="primary" :loading="actionLoading" :disabled="!selectedReadyIds.length" @click="candidateAction('add_group')">优先剧集组加入</VBtn>
          </div>
        </div>
        <div class="candidate-items">
          <label v-for="item in readyCandidates" :key="item.id" class="candidate-item">
            <VCheckboxBtn v-model="selectedReadyIds" :value="item.id" />
            <VImg v-if="item.poster" :src="item.poster" width="48" height="68" cover class="candidate-poster" />
            <div v-else class="candidate-poster candidate-poster-placeholder">
              <VIcon icon="mdi-image-off-outline" size="20" />
            </div>
            <div class="candidate-copy">
              <strong>{{ item.title }}</strong>
              <span>TMDB {{ item.tmdb_id }} · {{ item.platform }}<template v-if="item.has_prequel"> · 续作</template></span>
            </div>
            <VChip v-if="item.score != null" size="x-small" color="success" variant="tonal">{{ item.score }}</VChip>
          </label>
        </div>
      </div>
      <div v-if="failedCandidates.length" class="candidate-list failed-list">
        <div class="candidate-toolbar">
          <VCheckboxBtn :model-value="allFailedSelected" @update:model-value="setAllFailed" />
          <span><strong>扫描失败</strong><small>{{ failedCandidates.length }} 部可批量重试、忽略或逐部补录</small></span>
          <VSpacer />
          <div class="candidate-actions">
            <VBtn variant="text" color="default" :disabled="!selectedFailedIds.length" @click="candidateAction('ignore', 'failed')">忽略所选</VBtn>
            <VBtn color="warning" variant="tonal" prepend-icon="mdi-refresh" :loading="actionLoading" :disabled="!selectedFailedIds.length" @click="candidateAction('retry', 'failed')">重新扫描</VBtn>
          </div>
        </div>
        <div class="candidate-items">
          <div v-for="item in failedCandidates" :key="item.id" class="candidate-item failed-candidate-item">
            <VCheckboxBtn v-model="selectedFailedIds" :value="item.id" />
            <VImg v-if="item.poster" :src="item.poster" width="48" height="68" cover class="candidate-poster" />
            <div v-else class="candidate-poster candidate-poster-placeholder">
              <VIcon icon="mdi-image-off-outline" size="20" />
            </div>
            <div class="candidate-copy">
              <strong>{{ item.title }}</strong>
              <span>{{ item.scan_error || '未匹配到可信 TMDB 条目' }}</span>
            </div>
            <VBtn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-database-edit-outline"
              :loading="manualCandidateBusy === item.id"
              @click="openFailedCandidate(item)"
            >补录 TMDB</VBtn>
          </div>
        </div>
      </div>
      <div v-if="!readyCandidates.length && !failedCandidates.length" class="empty-inline">
        <VIcon icon="mdi-check-decagram-outline" />
        <span>{{ candidateLoading ? '正在读取季度缓存…' : '当前筛选没有待处理条目；请先在“集数偏移”中加载并扫描该季度看板。' }}</span>
      </div>
    </section>

    <VDialog v-model="manualCandidateDialog" max-width="560">
      <VCard class="manual-candidate-dialog">
        <VCardItem>
          <template #prepend>
            <VAvatar color="primary" variant="tonal">
              <VIcon icon="mdi-database-edit-outline" />
            </VAvatar>
          </template>
          <VCardTitle>补录 TMDB</VCardTitle>
          <VCardSubtitle>{{ manualCandidateItem?.title }}</VCardSubtitle>
        </VCardItem>
        <VDivider />
        <VCardText>
          <VTextField
            v-model="manualCandidateTmdbId"
            label="TMDBID"
            type="number"
            autofocus
            variant="outlined"
            prepend-inner-icon="mdi-movie-search-outline"
            hint="填写电视剧 TMDBID，再选择最终采用的编集方式。"
            persistent-hint
          />
        </VCardText>
        <VCardActions class="manual-candidate-actions">
          <VBtn variant="text" @click="manualCandidateDialog = false">取消</VBtn>
          <VSpacer />
          <VBtn
            color="primary"
            variant="tonal"
            prepend-icon="mdi-database-outline"
            :disabled="!Number(manualCandidateTmdbId || 0)"
            :loading="manualCandidateBusy === manualCandidateItem?.id"
            @click="addFailedCandidate('add_default')"
          >按 TMDB 默认编集加入</VBtn>
          <VBtn
            color="primary"
            prepend-icon="mdi-animation-outline"
            :disabled="!Number(manualCandidateTmdbId || 0)"
            :loading="manualCandidateBusy === manualCandidateItem?.id"
            @click="addFailedCandidate('add_group')"
          >优先剧集组加入</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <section class="section-shell">
      <button type="button" class="records-heading" @click="showRecords = !showRecords">
        <span>
          <strong>通知运行记录</strong>
          <small>
            共 {{ data.record_counts?.total || 0 }} 条
            · 渠道确认 {{ data.record_counts?.delivered || 0 }}
            · 已提交 {{ data.record_counts?.submitted || 0 }}
            · 静默 {{ data.record_counts?.suppressed || 0 }}
            · 待摘要 {{ data.record_counts?.digest || 0 }}
          </small>
        </span>
        <VIcon :icon="showRecords ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
      </button>
      <VExpandTransition>
        <div v-if="showRecords">
          <div class="record-toolbar">
            <VBtnToggle v-model="recordFilter" mandatory density="compact" color="primary" variant="outlined">
              <VBtn value="all">全部</VBtn><VBtn value="success">成功</VBtn><VBtn value="failure">失败</VBtn>
            </VBtnToggle>
            <VSpacer />
          <VBtn variant="text" color="error" prepend-icon="mdi-delete-outline" @click="clearRecords">清空</VBtn>
          <VBtn
            v-if="data.record_counts?.digest"
            variant="tonal"
            color="warning"
            prepend-icon="mdi-text-box-check-outline"
            @click="sendDigest"
          >发送待处理摘要</VBtn>
          </div>
          <div v-if="records.length" class="record-list">
            <article v-for="item in records" :key="item.id" class="record-item">
              <VIcon
                :icon="item.action === 'delivery_failed' ? 'mdi-send-alert-outline' : item.scene === 'success' ? 'mdi-check-circle-outline' : item.action === 'suppressed' ? 'mdi-bell-off-outline' : 'mdi-alert-circle-outline'"
                :color="item.action === 'delivery_failed' ? 'error' : item.scene === 'success' ? 'success' : item.action === 'suppressed' ? 'default' : 'warning'"
              />
              <div>
                <strong>{{ item.title }}</strong>
                <span>{{ item.created_at }} · {{ item.category?.label || '入库成功' }} · {{ recordActionText[item.action] || item.action }}</span>
                <small v-if="item.action === 'delivery_failed'">
                  {{ item.details?.delivery_error || '目标通知实例未返回成功结果' }}
                </small>
              </div>
              <VChip size="x-small" variant="tonal">{{ item.policy }}</VChip>
            </article>
          </div>
          <div v-else class="empty-inline"><VIcon icon="mdi-history" /><span>尚无符合条件的记录</span></div>
        </div>
      </VExpandTransition>
    </section>
  </div>
</template>

<style scoped>
.notification-page { display: grid; gap: 16px; }
.section-shell {
  padding: 18px;
  border: 1px solid rgba(var(--v-theme-on-surface), .1);
  border-radius: 16px;
  background: rgba(var(--v-theme-surface), .78);
}
.section-heading, .section-heading.responsive {
  display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px;
}
.section-heading h3 { margin: 0; font-size: 1rem; font-weight: 650; }
.section-heading p { margin: 3px 0 0; color: rgba(var(--v-theme-on-surface), .58); font-size: .8rem; }
.mode-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.mode-card {
  display: flex; align-items: center; gap: 12px; min-height: 72px; padding: 12px 14px;
  color: inherit; text-align: left; border: 1px solid rgba(var(--v-theme-on-surface), .1);
  border-radius: 13px; background: rgba(var(--v-theme-on-surface), .025); cursor: pointer;
}
.mode-card.active { border-color: rgba(var(--v-theme-primary), .55); background: rgba(var(--v-theme-primary), .075); }
.mode-card span, .policy-copy, .candidate-copy, .records-heading span, .record-item div { display: grid; min-width: 0; gap: 2px; }
.mode-card span { flex: 1; }
.mode-card small, .policy-copy small, .candidate-copy span, .records-heading small, .record-item span {
  color: rgba(var(--v-theme-on-surface), .58); font-size: .75rem;
}
.option-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 22px; }
.option-row.compact { margin-top: 12px; }
.notification-route-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}
.policy-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.policy-card {
  display: flex; align-items: center; gap: 11px; min-height: 66px; padding: 10px 12px;
  border-radius: 12px; background: rgba(var(--v-theme-on-surface), .035);
}
.policy-copy { flex: 1; }
.policy-select { flex: 0 0 158px; }
.delivery-grid { display: grid; grid-template-columns: minmax(220px, .8fr) minmax(360px, 1.2fr) minmax(260px, 1fr); gap: 10px; }
.delivery-mode {
  display: flex; align-items: center; gap: 10px; min-height: 56px; padding: 7px 11px;
  border: 1px solid rgba(var(--v-theme-on-surface), .1); border-radius: 12px;
}
.delivery-mode .v-select { min-width: 118px; }
.delivery-mode.realtime { align-items: flex-start; flex-direction: column; justify-content: center; gap: 0; }
.delivery-mode small { color: rgba(var(--v-theme-on-surface), .58); font-size: .72rem; line-height: 1.45; }
.candidate-message-style {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin-top: 10px; padding: 10px 12px;
  border: 1px solid rgba(var(--v-theme-on-surface), .1); border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), .02);
}
.candidate-message-style > span { display: grid; min-width: 0; gap: 2px; }
.candidate-message-style small { color: rgba(var(--v-theme-on-surface), .58); font-size: .72rem; }
.premium-emoji-field { flex: 0 1 280px; min-width: 220px; }
.premium-emoji-help {
  display: block; margin: 5px 12px 0;
  color: rgba(var(--v-theme-on-surface), .55); font-size: .72rem; line-height: 1.45;
}
.candidate-controls { display: grid; grid-template-columns: minmax(130px, .7fr) minmax(130px, .7fr) minmax(190px, 1.1fr) auto auto; gap: 10px; margin-top: 14px; }
.platform-select { max-width: 440px; min-width: 260px; }
.candidate-list {
  margin-top: 14px;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), .09);
  border-radius: 14px;
  background: rgba(var(--v-theme-on-surface), .015);
}
.candidate-toolbar { display: flex; align-items: center; gap: 8px; min-height: 62px; padding: 9px 14px; background: rgba(var(--v-theme-primary), .045); }
.candidate-toolbar > span { display: grid; gap: 1px; }
.candidate-toolbar > span small { color: rgba(var(--v-theme-on-surface), .55); font-size: .72rem; }
.candidate-actions { display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
.failed-list .candidate-toolbar { background: rgba(var(--v-theme-warning), .055); }
.candidate-items {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  padding: 10px;
}
.candidate-item {
  display: grid;
  grid-template-columns: 32px 48px minmax(0, 1fr) max-content;
  align-items: center;
  justify-items: start;
  gap: 11px;
  min-width: 0;
  min-height: 92px;
  padding: 11px 12px;
  border: 1px solid rgba(var(--v-theme-on-surface), .075);
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), .82);
  cursor: pointer;
  text-align: left;
}
.candidate-item > .v-checkbox-btn { grid-column: 1; justify-self: start; }
.candidate-poster {
  grid-column: 2;
  width: 48px;
  height: 68px;
  border-radius: 8px;
}
.candidate-poster-placeholder {
  display: grid;
  place-items: center;
  color: rgba(var(--v-theme-on-surface), .38);
  background: rgba(var(--v-theme-on-surface), .055);
}
.candidate-copy { grid-column: 3; width: 100%; overflow: hidden; }
.candidate-item > .v-chip,
.candidate-item > .v-btn { grid-column: 4; justify-self: end; }
.candidate-copy strong { overflow-wrap: anywhere; line-height: 1.4; }
.candidate-copy span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.failed-candidate-item { cursor: default; }
.manual-candidate-dialog { overflow: hidden; border-radius: 16px !important; }
.manual-candidate-actions { flex-wrap: wrap; gap: 8px; padding: 12px 20px 18px; }
.empty-inline { display: flex; align-items: center; justify-content: center; gap: 9px; min-height: 86px; color: rgba(var(--v-theme-on-surface), .55); font-size: .82rem; }
.records-heading { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0; color: inherit; text-align: left; border: 0; background: transparent; cursor: pointer; }
.record-toolbar { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
.record-list { display: grid; gap: 7px; margin-top: 10px; }
.record-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 11px; background: rgba(var(--v-theme-on-surface), .035); }
.record-item div { flex: 1; }
.record-item small {
  display: block;
  margin-top: 2px;
  color: rgb(var(--v-theme-error));
  font-size: .72rem;
}
.notification-template-panels {
  margin-top: 14px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 14px;
  overflow: hidden;
}
.template-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.template-panel-title span {
  display: grid;
  gap: 2px;
}
.template-panel-title small {
  color: rgba(var(--v-theme-on-surface), .6);
  font-weight: 400;
}
.notification-template-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.notification-template-card {
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), .025);
}
.notification-template-card h4 {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
}
.notification-template-card.success h4 { color: rgb(var(--v-theme-success)); }
.notification-template-card.failure h4 { color: rgb(var(--v-theme-warning)); }
@media (max-width: 900px) {
  .mode-grid, .policy-grid, .candidate-items, .delivery-grid, .notification-route-grid, .notification-template-grid { grid-template-columns: 1fr; }
  .candidate-controls { grid-template-columns: 1fr 1fr; }
  .candidate-toolbar { align-items: flex-start; flex-wrap: wrap; }
  .candidate-actions { flex: 1 0 100%; justify-content: flex-start; padding-left: 34px; }
}
@media (max-width: 600px) {
  .section-shell { padding: 14px; }
  .section-heading.responsive { align-items: flex-start; flex-direction: column; }
  .candidate-controls { grid-template-columns: 1fr; }
  .policy-card { align-items: flex-start; flex-wrap: wrap; }
  .policy-select { flex: 1 0 100%; }
  .candidate-message-style { align-items: stretch; flex-direction: column; }
  .candidate-message-style .v-btn-toggle { width: 100%; }
  .candidate-message-style .v-btn { flex: 1; }
  .premium-emoji-field { flex-basis: auto; width: 100%; }
  .candidate-actions { padding-left: 0; }
  .candidate-actions .v-btn { flex: 1; }
  .candidate-item { grid-template-columns: 32px 48px minmax(0, 1fr); }
  .candidate-item > .v-chip { grid-column: 3; justify-self: start; }
  .candidate-item > .v-btn {
    grid-column: 2 / -1;
    justify-self: stretch;
    width: 100%;
  }
  .manual-candidate-actions .v-btn { flex: 1 0 100%; }
}
</style>
