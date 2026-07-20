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
  'seasonal_evidence_weight', 'recognition_memory_weight',
].reduce((sum, key) => sum + Number(config.value[key] || 0), 0))

const tmdbFirstMode = computed(() => config.value.recognition_mode === 'tmdb_first')

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
    <section class="strategy-hero">
      <div class="strategy-hero-copy">
        <VAvatar color="primary" variant="tonal" size="44"><VIcon icon="mdi-database-search-outline" /></VAvatar>
        <div>
          <h3>候选选择策略</h3>
          <p>先选择决策模式，再按需要展开安全阈值和高级参数。</p>
        </div>
      </div>
      <VBtnToggle v-model="config.recognition_mode" mandatory color="primary" variant="outlined" density="comfortable" class="mode-toggle">
        <VBtn value="tmdb_first" prepend-icon="mdi-numeric-1-circle-outline">首结果</VBtn>
        <VBtn value="scored" prepend-icon="mdi-scale-balance">评分模式</VBtn>
      </VBtnToggle>
    </section>

    <VAlert :type="tmdbFirstMode ? 'success' : 'info'" variant="tonal" density="compact" class="mode-summary">
      <template v-if="tmdbFirstMode">只搜索一次完整标题，通常采用 TMDB 首个影视结果；近期季度、识别记忆和人工优先名单可以在候选内调整顺序。</template>
      <template v-else>综合标题、别名、年份、类型和上下文评分，并通过最低分与领先分差控制是否接管。</template>
    </VAlert>

    <VCard v-if="showModuleSwitches" variant="outlined" class="setting-card mb-4">
      <VCardText class="module-switches">
        <VSwitch v-model="config.enabled" color="primary" label="插件总开关" hide-details />
        <VSwitch v-model="config.recognizer_enabled" color="primary" label="TMDB 搜索增强" hide-details />
        <VSwitch v-model="config.episode_normalizer_enabled" color="success" label="集数偏移" hide-details />
      </VCardText>
    </VCard>

    <VCard variant="outlined" class="setting-card main-strategy-card mb-4">
      <VCardItem>
        <template #prepend><VIcon icon="mdi-text-search" color="primary" /></template>
        <VCardTitle>识别依据与搜索策略</VCardTitle>
        <VCardSubtitle>集中设置标题来源、降级搜索和辅助证据</VCardSubtitle>
      </VCardItem>
      <VCardText class="unified-settings-grid">
            <div class="toggle-item">
              <div><strong>优先使用 MP 解析标题</strong><small>复用识别词和解析器处理后的主体名称</small></div>
              <VSwitch v-model="config.prefer_parsed_title" color="primary" hide-details />
            </div>
            <div class="toggle-item">
              <div><strong>使用年份提示</strong><small>标题带年份时参与候选筛选与评分</small></div>
              <VSwitch v-model="config.use_year_hint" color="primary" hide-details />
            </div>
            <div class="toggle-item">
              <div><strong>原标题交叉验证</strong><small>确认降级结果仍与未缩减标题相关</small></div>
              <VSwitch v-model="config.use_original_title_evidence" color="primary" hide-details />
            </div>
            <div class="toggle-item">
              <div><strong>拉取别名与译名</strong><small>{{ tmdbFirstMode ? '用于展示和诊断，不改变首结果评分' : '用于标题、译名和罗马音交叉验证' }}</small></div>
              <VSwitch v-model="config.fetch_aliases" color="primary" hide-details />
            </div>

        <template v-if="!tmdbFirstMode">
              <div class="toggle-item"><div><strong>主体名称降级</strong><small>例如 Mushoku Tensei: … → Mushoku Tensei</small></div><VSwitch v-model="config.main_title_fallback" color="primary" hide-details /></div>
              <div class="toggle-item"><div><strong>逐词缩短</strong><small>每次缩短仍须通过原标题锚点验证</small></div><VSwitch v-model="config.progressive_fallback" color="warning" hide-details /></div>
              <div class="toggle-item"><div><strong>搜索引擎交叉验证</strong><small>只接受指向具体 TMDB 条目的直链证据</small></div><VSwitch v-model="config.web_search_fallback" color="warning" hide-details /></div>
            <VExpandTransition>
              <div v-if="config.web_search_fallback" class="web-fallback-box grid-wide">
                <VAlert type="warning" variant="tonal" density="compact" class="mb-3">自动模式固定使用 DuckDuckGo；只有 TMDB 直链与原标题或候选别名共现时才形成证据。</VAlert>
                <VRow dense>
                  <VCol cols="12" md="4"><VSelect v-model="config.web_search_engine" :items="[
                    { title: '自动选择', value: 'auto' }, { title: 'DuckDuckGo', value: 'duckduckgo' },
                    { title: 'Google', value: 'google' }, { title: 'Brave', value: 'brave' },
                    { title: 'Yahoo', value: 'yahoo' }, { title: 'Yandex', value: 'yandex' }, { title: 'Mojeek', value: 'mojeek' },
                  ]" density="compact" label="搜索引擎" hide-details /></VCol>
                  <VCol cols="6" md="2"><VTextField v-model.number="config.web_search_max_results" density="compact" type="number" min="3" max="15" label="最多结果" hide-details /></VCol>
                  <VCol cols="6" md="2"><VTextField v-model.number="config.web_search_timeout" density="compact" type="number" min="5" max="30" label="超时" suffix="秒" hide-details /></VCol>
                  <VCol cols="12" md="4"><VTextField v-model.number="config.web_search_min_evidence" density="compact" type="number" min="50" max="100" label="最低证据分" hint="建议不低于 78" persistent-hint /></VCol>
                </VRow>
              </div>
            </VExpandTransition>
        </template>

          <div class="evidence-box">
            <div class="evidence-head">
              <div><strong>近期季度动画</strong><small>兼顾当前季、跨季连载和上一季补整</small></div>
              <VSwitch v-model="config.seasonal_evidence_enabled" color="primary" hide-details />
            </div>
            <VSelect v-model.number="config.seasonal_evidence_quarters" :items="[
              { title: '仅当前季度', value: 1 },
              { title: '当前 + 上一季度（推荐）', value: 2 },
              { title: '最近三个季度', value: 3 },
              { title: '最近四个季度', value: 4 },
            ]" label="证据窗口" density="compact" hide-details :disabled="!config.seasonal_evidence_enabled" />
            <div class="compact-slider"><span>影响强度</span><VSlider v-model="config.seasonal_evidence_weight" :min="0" :max="40" :step="1" color="primary" hide-details :disabled="!config.seasonal_evidence_enabled" /><strong>{{ config.seasonal_evidence_weight }}</strong></div>
          </div>
          <div class="evidence-box">
            <div class="evidence-head">
              <div><strong>近期重复命中</strong><small>只统计正式整理中的不同文件</small></div>
              <VSwitch v-model="config.recognition_memory_enabled" color="secondary" hide-details />
            </div>
            <div class="compact-slider"><span>影响强度</span><VSlider v-model="config.recognition_memory_weight" :min="0" :max="40" :step="1" color="secondary" hide-details :disabled="!config.recognition_memory_enabled" /><strong>{{ config.recognition_memory_weight }}</strong></div>
            <VRow dense class="mt-1">
              <VCol cols="6"><VTextField v-model.number="config.recognition_memory_min_hits" density="compact" hide-details type="number" min="2" max="10" label="生效文件数" suffix="个" :disabled="!config.recognition_memory_enabled" /></VCol>
              <VCol cols="6"><VTextField v-model.number="config.recognition_memory_ttl_days" density="compact" hide-details type="number" min="1" max="90" label="保存时间" suffix="天" :disabled="!config.recognition_memory_enabled" /></VCol>
            </VRow>
          </div>
          <div class="evidence-box">
            <div class="evidence-head">
              <div><strong>制作组辅助验证</strong><small>根据已分类字幕组判断动画或真人倾向</small></div>
              <VSwitch v-model="config.release_group_assist_enabled" color="success" hide-details />
            </div>
            <div class="constraint-note"><VIcon icon="mdi-filter-check-outline" size="18" color="success" /><span>已分类制作组作为硬约束，直接排除题材冲突候选；未分类时不参与。</span></div>
          </div>
      </VCardText>
    </VCard>

    <VExpansionPanels multiple variant="accordion" class="advanced-panels">
      <VExpansionPanel value="candidate-policy">
        <VExpansionPanelTitle>
          <div class="panel-title"><VIcon icon="mdi-playlist-star" color="primary" /><div><strong>TMDB 人工候选规则</strong><small>排除 {{ config.tmdb_exclude_ids?.length || 0 }} 个 · 优先 {{ config.tmdb_prefer_ids?.length || 0 }} 个</small></div></div>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VAlert type="info" variant="tonal" density="compact" class="mb-4">只作用于本次搜索实际返回的候选。排除先执行；优先名单命中后直接选择，多个优先 ID 按填写顺序。</VAlert>
          <VRow dense>
            <VCol cols="12" md="6"><VCombobox v-model="config.tmdb_exclude_ids" multiple chips closable-chips clearable label="TMDB 排除名单" placeholder="输入 ID 后按回车" hint="在评分、排序和分差前移除；冲突时排除优先" persistent-hint /></VCol>
            <VCol cols="12" md="6"><VCombobox v-model="config.tmdb_prefer_ids" multiple chips closable-chips clearable label="TMDB 优先名单" placeholder="输入 ID 后按回车" hint="候选中出现指定 ID 时直接采用；越靠前越优先" persistent-hint /></VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel v-if="!tmdbFirstMode" value="thresholds">
        <VExpansionPanelTitle>
          <div class="panel-title"><VIcon icon="mdi-shield-star-outline" color="success" /><div><strong>接纳门槛与搜索规模</strong><small>最低 {{ config.minimum_score }} 分 · 领先 {{ config.minimum_margin }} 分 · 最多 {{ config.max_queries }} 个搜索词</small></div></div>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VRow>
            <VCol cols="12" md="6"><div class="slider-label"><span>最低得分</span><strong>{{ config.minimum_score }}</strong></div><VSlider v-model="config.minimum_score" :min="40" :max="95" :step="1" color="primary" thumb-label /></VCol>
            <VCol cols="12" md="6"><div class="slider-label"><span>第一名领先分差</span><strong>{{ config.minimum_margin }}</strong></div><VSlider v-model="config.minimum_margin" :min="0" :max="30" :step="1" color="primary" thumb-label /></VCol>
          </VRow>
          <VRow dense>
            <VCol cols="6" md="3"><VTextField v-model.number="config.max_queries" density="compact" type="number" min="1" max="8" label="最多搜索词" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model.number="config.minimum_query_length" density="compact" type="number" min="2" max="20" label="降级词最短字符" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model.number="config.candidate_limit" density="compact" type="number" min="1" max="20" label="每词候选上限" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model.number="config.detail_limit" density="compact" type="number" min="0" max="15" label="详情拉取上限" /></VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel v-if="!tmdbFirstMode" value="weights">
        <VExpansionPanelTitle>
          <div class="panel-title"><VIcon icon="mdi-tune-vertical" color="secondary" /><div><strong>评分权重</strong><small>自动归一化 · 当前合计 {{ weightTotal }}</small></div></div>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="panel-toolbar"><span>高级参数通常保持默认即可。</span><VBtn size="small" variant="tonal" prepend-icon="mdi-restore" @click.stop="applyBalancedPreset">恢复均衡预设</VBtn></div>
          <VRow dense>
            <VCol v-for="item in [
              ['token_weight', 'Token 覆盖', 'mdi-format-list-bulleted'], ['similarity_weight', '字符相似', 'mdi-approximately-equal'],
              ['prefix_weight', '主体前缀', 'mdi-format-align-left'], ['rank_weight', '搜索排名', 'mdi-sort-numeric-ascending'],
              ['query_confidence_weight', '查询来源', 'mdi-source-branch-check'], ['anchor_weight', '原标题锚点', 'mdi-link-variant'],
              ['year_weight', '年份匹配', 'mdi-calendar-check'], ['type_weight', '类型匹配', 'mdi-movie-filter-outline'],
            ]" :key="item[0]" cols="12" sm="6" md="4">
              <div class="weight-box"><div class="weight-head"><VIcon :icon="item[2]" size="18" color="primary" /><span>{{ item[1] }}</span><strong>{{ config[item[0]] }}</strong></div><VSlider v-model="config[item[0]]" :min="0" :max="60" :step="1" hide-details color="primary" /></div>
            </VCol>
            <VCol cols="12" sm="6"><VTextField v-model.number="config.season_missing_penalty" density="compact" type="number" min="0" max="100" label="候选缺少目标季时扣分" prefix="-" suffix="分" /></VCol>
            <VCol cols="12" sm="6"><VTextField v-model.number="config.fallback_anchor_min" density="compact" type="number" min="0" max="100" label="降级候选最低锚点关联" suffix="分" /></VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel value="diagnostics">
        <VExpansionPanelTitle>
          <div class="panel-title"><VIcon icon="mdi-bug-outline" /><div><strong>日志与诊断</strong><small>保留 {{ config.history_limit }} 条模块日志 · 调试日志{{ config.debug ? '已开启' : '已关闭' }}</small></div></div>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VRow dense align="center">
            <VCol cols="12" sm="6"><VTextField v-model.number="config.history_limit" density="compact" hide-details type="number" min="5" max="100" label="保留模块日志" suffix="条" /></VCol>
            <VCol cols="12" sm="6"><VSwitch v-model="config.debug" color="primary" label="输出详细调试日志" hint="仅排查问题时开启，会增加日志量" persistent-hint /></VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style scoped>
.strategy-settings { display: flex; flex-direction: column; gap: 0; }
.strategy-hero { display: flex; align-items: center; gap: 20px; justify-content: space-between; margin-bottom: 12px; padding: 18px 20px; border: 1px solid rgba(var(--v-theme-primary), .14); border-radius: 16px; background: linear-gradient(120deg, rgba(var(--v-theme-primary), .065), rgba(var(--v-theme-secondary), .025)); }
.strategy-hero-copy { display: flex; align-items: center; gap: 14px; min-width: 0; }
.strategy-hero h3 { margin: 0; font-size: 1.08rem; }
.strategy-hero p { margin: 3px 0 0; color: rgba(var(--v-theme-on-surface), .62); font-size: .82rem; }
.mode-toggle { flex: 0 0 auto; border-radius: 10px; overflow: hidden; }
.mode-summary { margin-bottom: 16px; }
.setting-card { border-color: rgba(var(--v-theme-on-surface), .1); border-radius: 14px; }
.main-strategy-card { overflow: hidden; }
.module-switches { display: flex; flex-wrap: wrap; gap: 6px 28px; }
.module-switches :deep(.v-input) { flex: 0 0 auto; }
.unified-settings-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.grid-wide { grid-column: 1 / -1; }
.toggle-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 72px; padding: 10px 14px; border-radius: 12px; background: rgba(var(--v-theme-on-surface), .035); }
.toggle-item > div, .evidence-head > div { min-width: 0; }
.toggle-item strong, .evidence-head strong { display: block; font-size: .9rem; }
.toggle-item small, .evidence-head small, .panel-title small { display: block; margin-top: 3px; color: rgba(var(--v-theme-on-surface), .58); font-size: .75rem; line-height: 1.35; }
.toggle-item :deep(.v-input), .evidence-head :deep(.v-input) { flex: 0 0 auto; }
.evidence-box { padding: 15px; border: 1px solid rgba(var(--v-theme-primary), .1); border-radius: 13px; background: rgba(var(--v-theme-primary), .025); }
.evidence-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; margin-bottom: 12px; }
.constraint-note { display: flex; align-items: flex-start; gap: 7px; color: rgba(var(--v-theme-on-surface), .62); font-size: .76rem; line-height: 1.45; }
.compact-slider { display: grid; grid-template-columns: 66px minmax(80px, 1fr) 30px; align-items: center; gap: 8px; margin-top: 12px; color: rgba(var(--v-theme-on-surface), .67); font-size: .78rem; }
.compact-slider strong { color: rgb(var(--v-theme-primary)); text-align: right; font-variant-numeric: tabular-nums; }
.advanced-panels { border: 1px solid rgba(var(--v-theme-on-surface), .1); border-radius: 14px; overflow: hidden; }
.advanced-panels :deep(.v-expansion-panel) { border-radius: 0 !important; }
.advanced-panels :deep(.v-expansion-panel-title) { min-height: 66px; padding: 12px 18px; }
.panel-title { display: flex; align-items: center; gap: 13px; }
.panel-title > div { min-width: 0; }
.panel-title strong { display: block; font-size: .92rem; }
.slider-label { display: flex; justify-content: space-between; margin-bottom: -6px; color: rgba(var(--v-theme-on-surface), .72); }
.slider-label strong { color: rgb(var(--v-theme-primary)); font-variant-numeric: tabular-nums; }
.web-fallback-box { padding: 14px; border: 1px solid rgba(var(--v-theme-warning), .22); border-radius: 13px; background: rgba(var(--v-theme-warning), .04); }
.panel-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; color: rgba(var(--v-theme-on-surface), .62); font-size: .82rem; }
.weight-box { padding: 10px 12px; border-radius: 11px; background: rgba(var(--v-theme-primary), .04); }
.weight-head { display: flex; align-items: center; gap: 8px; font-size: .82rem; }
.weight-head strong { margin-left: auto; color: rgb(var(--v-theme-primary)); font-variant-numeric: tabular-nums; }
@media (max-width: 760px) {
  .strategy-hero { align-items: stretch; flex-direction: column; }
  .mode-toggle { width: 100%; }
  .mode-toggle :deep(.v-btn) { flex: 1 1 50%; }
  .unified-settings-grid { grid-template-columns: 1fr; }
  .panel-toolbar { align-items: flex-start; flex-direction: column; }
}
@media (min-width: 761px) and (max-width: 1180px) {
  .unified-settings-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
