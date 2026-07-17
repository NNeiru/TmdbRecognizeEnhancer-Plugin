<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  compact: { type: Boolean, default: false },
  showModuleSwitches: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])
const config = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const weightTotal = computed(() => [
  'token_weight', 'similarity_weight', 'prefix_weight', 'rank_weight', 'query_confidence_weight', 'anchor_weight', 'year_weight', 'type_weight',
].reduce((sum, key) => sum + Number(config.value[key] || 0), 0))

const tmdbFirstMode = computed(() => config.value.recognition_mode === 'tmdb_first')

function applyTmdbFirstPreset() {
  Object.assign(config.value, {
    recognition_mode: 'tmdb_first',
  })
}

function applyBalancedPreset() {
  Object.assign(config.value, {
    recognition_mode: 'scored',
    main_title_fallback: true,
    progressive_fallback: false,
    web_search_fallback: false,
    max_queries: 4,
    minimum_score: 72,
    minimum_margin: 8,
    token_weight: 38,
    similarity_weight: 24,
    prefix_weight: 14,
    rank_weight: 10,
    query_confidence_weight: 18,
    anchor_weight: 24,
    fallback_anchor_min: 32,
    year_weight: 8,
    type_weight: 6,
    season_missing_penalty: 20,
  })
}
</script>

<template>
  <div class="strategy-settings">
    <VAlert type="info" variant="tonal" density="comfortable" class="mb-5" icon="mdi-database-search-outline">
      首结果模式完全按 TMDB 一次搜索的顺序选择；评分模式才使用标题、原标题、年份、类型、查询来源和双阈值。
    </VAlert>

    <VRow>
      <VCol cols="12" :md="compact || tmdbFirstMode ? 12 : 5">
        <VCard variant="outlined" class="setting-card h-100">
          <VCardItem>
            <template #prepend><VIcon icon="mdi-tune-variant" color="primary" /></template>
            <VCardTitle>运行方式</VCardTitle>
            <VCardSubtitle>控制接管范围与搜索成本</VCardSubtitle>
          </VCardItem>
          <VCardText>
            <template v-if="showModuleSwitches">
              <VSwitch v-model="config.enabled" color="primary" label="插件总开关" hide-details />
              <VSwitch v-model="config.recognizer_enabled" color="primary" label="启用 TMDB 搜索增强" hide-details />
              <VSwitch v-model="config.episode_normalizer_enabled" color="success" label="启用集数偏移" hide-details />
            </template>
            <VSwitch v-model="config.show_sidebar_nav" color="primary" label="显示侧栏工作台" hide-details />
            <VSelect v-model="config.recognition_mode" :items="[
              {title:'TMDB 单次首结果（默认）',value:'tmdb_first'},
              {title:'可解释评分模式',value:'scored'},
            ]" label="候选选择模式" class="mt-3" />
            <VSwitch v-model="config.prefer_parsed_title" color="primary" label="优先使用 MP 解析标题" hint="原标题进入事件后，复用识别词与 Rust 解析结果作为搜索标题" persistent-hint />
            <VSwitch v-model="config.use_year_hint" color="primary" label="使用 MP 年份提示" hint="MP MetaBase 已包含识别词处理后的年份；仅在存在年份时参与评分" persistent-hint />
            <VSwitch v-model="config.use_original_title_evidence" color="primary" label="使用原标题交叉验证" hint="将 MP 未应用识别词时的名称作为锚点，验证降级候选仍与原片相关" persistent-hint />
            <VSwitch v-model="config.recover_truncated_title" color="primary" label="恢复异常截断标题" hint="当 MP 只解析出原标题的短前缀时，在季集与发布参数之前保守恢复完整英文标题" persistent-hint />
            <VSwitch v-model="config.fetch_aliases" color="primary" label="拉取候选别名与译名" :hint="tmdbFirstMode ? '首结果模式中不影响选择，只用于展示和诊断' : '用于标题、原标题和罗马音交叉验证'" persistent-hint />
            <template v-if="!tmdbFirstMode">
              <VSwitch v-model="config.main_title_fallback" color="primary" label="启用主体名称降级" hint="例如 Mushoku Tensei: ... → Mushoku Tensei" persistent-hint />
              <VSwitch v-model="config.progressive_fallback" color="warning" label="启用逐词缩短（实验性）" hint="每次降级均须通过未缩减标题锚点验证" persistent-hint />
              <VSwitch v-model="config.web_search_fallback" color="warning" label="启用搜索引擎交叉验证" hint="仅接受指向具体 TMDB 条目的直链，并缓存同一查询结果" persistent-hint />
            </template>
            <VExpandTransition>
              <div v-if="!tmdbFirstMode && config.web_search_fallback" class="web-fallback-box mt-3">
                <VAlert type="warning" variant="tonal" density="compact" class="mb-3">自动模式固定使用 DuckDuckGo，避免聚合多引擎造成结果漂移；外部结果只有 TMDB 直链与原标题/候选别名共现时才形成证据。</VAlert>
                <VSelect v-model="config.web_search_engine" :items="[
                  { title: '自动选择', value: 'auto' },
                  { title: 'DuckDuckGo', value: 'duckduckgo' },
                  { title: 'Google', value: 'google' },
                  { title: 'Brave', value: 'brave' },
                  { title: 'Yahoo', value: 'yahoo' },
                  { title: 'Yandex', value: 'yandex' },
                  { title: 'Mojeek', value: 'mojeek' },
                ]" label="搜索引擎" density="comfortable" />
                <VRow dense>
                  <VCol cols="6"><VTextField v-model.number="config.web_search_max_results" type="number" min="3" max="15" label="最多结果" /></VCol>
                  <VCol cols="6"><VTextField v-model.number="config.web_search_timeout" type="number" min="5" max="30" label="超时" suffix="秒" /></VCol>
                  <VCol cols="12"><VTextField v-model.number="config.web_search_min_evidence" type="number" min="50" max="100" label="外部证据最低分" hint="建议不低于 78；仅有一个 TMDB 链接而没有别名共现时最高 60 分" persistent-hint /></VCol>
                </VRow>
              </div>
            </VExpandTransition>
            <VSwitch v-model="config.debug" color="primary" label="输出详细调试日志" hide-details />
          </VCardText>
        </VCard>
      </VCol>

      <VCol v-if="!tmdbFirstMode" cols="12" :md="compact ? 12 : 7">
        <VCard variant="outlined" class="setting-card h-100">
          <VCardItem>
            <template #prepend><VIcon icon="mdi-shield-star-outline" color="success" /></template>
            <VCardTitle>接纳门槛</VCardTitle>
            <VCardSubtitle>宁可拒绝，也不把资源整理到错误作品</VCardSubtitle>
          </VCardItem>
          <VCardText>
            <div class="slider-label"><span>最低得分</span><strong>{{ config.minimum_score }}</strong></div>
            <VSlider v-model="config.minimum_score" :min="40" :max="95" :step="1" color="primary" thumb-label />
            <div class="slider-label"><span>第一名领先分差</span><strong>{{ config.minimum_margin }}</strong></div>
            <VSlider v-model="config.minimum_margin" :min="0" :max="30" :step="1" color="primary" thumb-label />
            <VRow dense>
              <VCol cols="6"><VTextField v-model.number="config.max_queries" type="number" min="1" max="8" label="最多搜索词" /></VCol>
              <VCol cols="6"><VTextField v-model.number="config.minimum_query_length" type="number" min="2" max="20" label="降级词最短字符" /></VCol>
              <VCol cols="6"><VTextField v-model.number="config.candidate_limit" type="number" min="1" max="20" label="每词候选上限" /></VCol>
              <VCol cols="6"><VTextField v-model.number="config.detail_limit" type="number" min="0" max="15" label="拉取详情上限" /></VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VAlert v-if="tmdbFirstMode" type="success" variant="tonal" class="mt-4">
      当前只提交一次完整解析标题并采用 TMDB 返回的第一个影视结果。最低分、领先分差和评分权重全部不参与选择；年份与别名仍会显示在试跑诊断中。
    </VAlert>

    <VCard v-else variant="outlined" class="setting-card mt-4">
      <VCardItem>
        <template #prepend><VIcon icon="mdi-scale-balance" color="secondary" /></template>
        <VCardTitle>评分权重</VCardTitle>
        <VCardSubtitle>权重会自动按总和归一化 · 当前合计 {{ weightTotal }}</VCardSubtitle>
      </VCardItem>
      <VCardText>
        <VAlert type="info" variant="tonal" density="comfortable" class="mb-4">
          <div class="d-flex flex-wrap align-center ga-2">
            <div class="flex-grow-1">评分模式会验证降级候选与未缩减标题、MP 原标题之间的关联；关联不足会额外扣分。</div>
            <VBtn size="small" color="primary" variant="tonal" prepend-icon="mdi-numeric-1-circle" @click="applyTmdbFirstPreset">切换单次首结果</VBtn>
            <VBtn size="small" variant="text" prepend-icon="mdi-restore" @click="applyBalancedPreset">恢复均衡预设</VBtn>
          </div>
        </VAlert>
        <VRow dense>
          <VCol v-for="item in [
            ['token_weight', 'Token 覆盖', 'mdi-format-list-bulleted'],
            ['similarity_weight', '字符相似', 'mdi-approximately-equal'],
            ['prefix_weight', '主体前缀', 'mdi-format-align-left'],
            ['rank_weight', '搜索排名', 'mdi-sort-numeric-ascending'],
            ['query_confidence_weight', '查询来源', 'mdi-source-branch-check'],
            ['anchor_weight', '原标题锚点', 'mdi-link-variant'],
            ['year_weight', '年份匹配', 'mdi-calendar-check'],
            ['type_weight', '类型匹配', 'mdi-movie-filter-outline'],
          ]" :key="item[0]" cols="12" sm="6" md="4">
            <div class="weight-box">
              <div class="d-flex align-center ga-2 mb-2">
                <VIcon :icon="item[2]" size="18" color="primary" />
                <span class="text-body-2">{{ item[1] }}</span>
                <VSpacer /><strong>{{ config[item[0]] }}</strong>
              </div>
              <VSlider v-model="config[item[0]]" :min="0" :max="60" :step="1" hide-details color="primary" />
            </div>
          </VCol>
          <VCol cols="12" sm="6">
            <VTextField v-model.number="config.season_missing_penalty" type="number" min="0" max="100" label="候选缺少目标季时扣分" prefix="-" suffix="分" />
          </VCol>
          <VCol cols="12" sm="6">
            <VTextField v-model.number="config.fallback_anchor_min" type="number" min="0" max="100" label="降级候选最低锚点关联" suffix="分" />
          </VCol>
          <VCol cols="12" sm="6">
            <VTextField v-model.number="config.history_limit" type="number" min="5" max="100" label="保留模块日志" suffix="条" />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.setting-card { border-color: rgba(var(--v-theme-on-surface), .1); }
.slider-label { display: flex; justify-content: space-between; margin-bottom: -6px; color: rgba(var(--v-theme-on-surface), .72); }
.slider-label strong { color: rgb(var(--v-theme-primary)); font-variant-numeric: tabular-nums; }
.weight-box { padding: 12px 14px; border-radius: 12px; background: rgba(var(--v-theme-primary), .045); }
.web-fallback-box { padding: 14px; border: 1px solid rgba(var(--v-theme-warning), .22); border-radius: 14px; background: rgba(var(--v-theme-warning), .045); }
</style>
