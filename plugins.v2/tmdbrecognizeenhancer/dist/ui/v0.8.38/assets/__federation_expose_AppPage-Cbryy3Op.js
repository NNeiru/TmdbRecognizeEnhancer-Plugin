import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { M as ModuleHeader, S as StrategySettings } from './StrategySettings-D5LFrf_J.js';
import { _ as _export_sfc, u as unwrapResponse, c as cloneConfig, U as UI_VERSION, m as mediaTypeText, s as scoreColor, e as ensureUiVersion } from './utils-DUpwc40u.js';

const {toDisplayString:_toDisplayString$5,createTextVNode:_createTextVNode$5,resolveComponent:_resolveComponent$5,withCtx:_withCtx$5,createVNode:_createVNode$5,openBlock:_openBlock$5,createBlock:_createBlock$5,createCommentVNode:_createCommentVNode$5,createElementVNode:_createElementVNode$5,renderList:_renderList$4,Fragment:_Fragment$5,createElementBlock:_createElementBlock$5,normalizeClass:_normalizeClass$3,vShow:_vShow$2,withDirectives:_withDirectives$2,unref:_unref$2,mergeProps:_mergeProps$3} = await importShared('vue');


const _hoisted_1$5 = { class: "episode-normalizer" };
const _hoisted_2$5 = {
  key: 0,
  class: "rules-scroll"
};
const _hoisted_3$4 = { class: "rules-controls pa-4 pt-4" };
const _hoisted_4$4 = { class: "rule-group-title mb-2" };
const _hoisted_5$4 = { class: "text-caption text-medium-emphasis" };
const _hoisted_6$4 = { class: "flex-grow-1 min-w-0" };
const _hoisted_7$4 = { class: "font-weight-bold text-truncate" };
const _hoisted_8$4 = { class: "text-caption text-medium-emphasis" };
const _hoisted_9$4 = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mt-1"
};
const _hoisted_10$4 = {
  key: 0,
  class: "empty-rules"
};
const _hoisted_11$4 = { class: "d-flex align-center ga-2" };
const _hoisted_12$4 = { class: "board-controls mb-3" };
const _hoisted_13$4 = { class: "batch-bar mb-4" };
const _hoisted_14$4 = { class: "text-caption text-medium-emphasis mb-3" };
const _hoisted_15$4 = { key: 0 };
const _hoisted_16$4 = { key: 1 };
const _hoisted_17$4 = { class: "select-corner" };
const _hoisted_18$3 = { class: "catalog-card-layout" };
const _hoisted_19$3 = {
  key: 1,
  class: "catalog-poster catalog-poster-placeholder"
};
const _hoisted_20$3 = { class: "d-flex flex-wrap ga-1" };
const _hoisted_21$3 = ["title"];
const _hoisted_22$3 = {
  key: 0,
  class: "empty-catalog"
};
const _hoisted_23$3 = { class: "emby-sync-module" };
const _hoisted_24$3 = { class: "sync-metrics mb-4" };
const _hoisted_25$3 = { class: "sync-settings-grid" };
const _hoisted_26$3 = { class: "d-flex align-center flex-wrap ga-2 mt-5 mb-2" };
const _hoisted_27$3 = {
  key: 0,
  class: "path-mapping-list"
};
const _hoisted_28$3 = {
  key: 1,
  class: "text-caption text-medium-emphasis py-2"
};
const _hoisted_29$3 = { class: "sync-preview-grid" };
const _hoisted_30$3 = {
  key: 0,
  class: "sync-result-list mt-4"
};
const _hoisted_31$3 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_32$3 = { class: "text-body-2 mt-3" };
const _hoisted_33$3 = {
  key: 0,
  class: "mapped-path mt-3"
};
const _hoisted_34$3 = {
  key: 1,
  class: "text-caption text-medium-emphasis mt-1"
};
const _hoisted_35$3 = {
  key: 2,
  class: "text-caption"
};
const _hoisted_36$3 = {
  key: 3,
  class: "candidate-path-list mt-3"
};
const _hoisted_37$3 = {
  key: 4,
  class: "text-caption text-medium-emphasis mt-2"
};
const _hoisted_38$3 = {
  key: 5,
  class: "candidate-path-list mt-3"
};
const _hoisted_39$3 = { class: "d-flex ga-1" };
const _hoisted_40$3 = { class: "d-flex align-start ga-3" };
const _hoisted_41$3 = { class: "flex-grow-1 min-w-0" };
const _hoisted_42$3 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_43$3 = { class: "text-caption text-medium-emphasis" };
const _hoisted_44$3 = { class: "text-body-2 mt-1" };
const _hoisted_45$3 = ["title"];
const _hoisted_46$3 = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mt-2"
};
const _hoisted_47$3 = { class: "d-flex" };
const _hoisted_48$3 = {
  key: 2,
  class: "empty-sync"
};
const _hoisted_49$3 = { class: "d-flex align-center ga-3 mb-4" };
const _hoisted_50$2 = { class: "tmdb-correction mb-4" };
const _hoisted_51$2 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_52$2 = { class: "flex-grow-1" };
const _hoisted_53$2 = {
  key: 3,
  class: "group-preview mb-4"
};
const _hoisted_54$2 = { class: "d-flex align-center flex-wrap ga-2 mb-2" };
const _hoisted_55$2 = { class: "group-season-grid" };
const _hoisted_56$2 = { class: "d-flex align-center ga-2" };
const _hoisted_57$2 = { class: "text-truncate" };
const _hoisted_58$2 = { class: "text-caption text-medium-emphasis mt-1" };
const _hoisted_59$2 = {
  key: 0,
  class: "text-caption text-medium-emphasis"
};
const _hoisted_60$2 = { key: 0 };
const _hoisted_61$2 = { class: "d-flex align-center mb-2" };
const _hoisted_62$2 = { class: "manual-match" };

const {computed: computed$5,onActivated,onBeforeUnmount: onBeforeUnmount$2,onDeactivated,onMounted: onMounted$5,ref: ref$5,watch: watch$3} = await importShared('vue');

const uiStateKey = 'tmdbrecognizeenhancer:episode-normalizer-ui:v1';

const _sfc_main$5 = {
  __name: 'EpisodeNormalizer',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginBase: { type: String, required: true },
  runtimeStatus: { type: Object, default: () => ({}) },
},
  emits: ['config-saved'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;

const now = new Date();
const years = Array.from({ length: now.getFullYear() - 1999 }, (_, index) => now.getFullYear() + 1 - index);
const error = ref$5('');
const notice = ref$5('');
const snackbar = ref$5(false);
const snackbarColor = ref$5('success');
const subModule = ref$5('rules');
const rules = ref$5([]);
const rulesOpen = ref$5(true);
const ruleView = ref$5('grid');
const ruleSearch = ref$5('');
const ruleQuarter = ref$5('all');
const deleteRulesDialog = ref$5(false);
const deleteRulesLoading = ref$5(false);
const manualDialog = ref$5(false);
const manualLoading = ref$5(false);
const manualMessage = ref$5('');
const manualForm = ref$5({
  tmdb_id: '', preference: 'default', specify_quarter: false,
  year: now.getFullYear(), quarter: Math.floor(now.getMonth() / 3) + 1,
});
const catalog = ref$5([]);
const catalogLoading = ref$5(false);
const batchLoading = ref$5(false);
const busyId = ref$5('');
const selectedIds = ref$5([]);
const catalogMeta = ref$5({});
const board = ref$5({
  year: now.getFullYear(),
  quarter: Math.floor(now.getMonth() / 3) + 1,
  search: '',
  region: 'all',
  platform: 'all',
  scanStatus: 'all',
  multiOnly: false,
});
const batchPreference = ref$5('default');
const boardView = ref$5('grid');
const editorOpen = ref$5(false);
const editorLoading = ref$5(false);
const inspection = ref$5(null);
const editForm = ref$5(null);
const failureDialog = ref$5(false);
const failures = ref$5([]);
const manualTmdb = ref$5({});
const embySync = ref$5({
  available: true, enabled: false, active: false, worker_running: false,
  servers: [], jobs: [], counts: {},
  config: {
    enabled: false, servers: [], initial_delay_seconds: 15, retry_seconds: 30,
    max_wait_minutes: 15, path_mappings: [], conflict_policy: 'skip', refresh_metadata: true,
  },
});
const embyLoading = ref$5(false);
const embySaving = ref$5(false);
const embyPreviewing = ref$5(false);
const embyApplyingAll = ref$5('');
const embyPreview = ref$5(null);
const embyPreviewRule = ref$5('');
const embyPreviewPath = ref$5('');
let scanTimer = null;
let persistTimer = null;
let embyTimer = null;
let initialized = false;
let componentActive = true;

function showNotice(message, color = 'success') {
  notice.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

const quarterKey = computed$5(() => `${board.value.year}-Q${board.value.quarter}`);
const platforms = computed$5(() => [
  { title: '全部载体', value: 'all' },
  ...Array.from(new Set(catalog.value.map(item => item.platform).filter(Boolean)))
    .sort()
    .map(value => ({ title: value, value })),
]);
const filteredCatalog = computed$5(() => {
  const keyword = String(board.value.search || '').trim().toLocaleLowerCase();
  return catalog.value.filter(item => {
    if (board.value.region !== 'all' && item.region !== board.value.region) return false
    if (board.value.platform !== 'all' && item.platform !== board.value.platform) return false
    if (
      board.value.scanStatus !== 'all'
      && (
        board.value.scanStatus === 'ignored'
          ? !item.notification_ignored
          : item.scan_status !== board.value.scanStatus
      )
    ) return false
    if (board.value.multiOnly && !item.is_multi_season) return false
    if (!keyword) return true
    return [item.name, item.name_cn, ...(item.aliases || [])]
      .join(' ')
      .toLocaleLowerCase()
      .includes(keyword)
  })
});
const selectedIdSet = computed$5(() => new Set(selectedIds.value));
const allFilteredSelected = computed$5(() => (
  filteredCatalog.value.length > 0
  && filteredCatalog.value.every(item => selectedIdSet.value.has(item.id))
));
const ruleByTmdbId = computed$5(() => new Map(
  rules.value.map(rule => [Number(rule.tmdb_id), rule]),
));
const selectedGroup = computed$5(() => inspection.value?.groups?.find(
  item => item.id === editForm.value?.episode_group_id,
));
const ruleQuarterOptions = computed$5(() => {
  const values = new Set();
  rules.value.forEach(rule => (rule.installments || []).forEach(item => {
    if (item.quarter) values.add(item.quarter);
  }));
  return [
    { title: '全部季度', value: 'all' },
    ...Array.from(values).sort().reverse().map(value => ({ title: value, value })),
    { title: '未分类', value: 'unclassified' },
  ]
});
const filteredRules = computed$5(() => {
  const keyword = String(ruleSearch.value || '').trim().toLocaleLowerCase();
  return rules.value.filter(rule => {
    const quarters = Array.from(new Set((rule.installments || []).map(item => item.quarter).filter(Boolean)));
    if (ruleQuarter.value === 'unclassified' && quarters.length) return false
    if (ruleQuarter.value !== 'all' && ruleQuarter.value !== 'unclassified' && !quarters.includes(ruleQuarter.value)) return false
    if (!keyword) return true
    const haystack = [
      rule.title, rule.tmdb_id,
      ...(rule.installments || []).flatMap(item => [item.title, item.quarter, ...(item.aliases || [])]),
    ].join(' ').toLocaleLowerCase();
    return haystack.includes(keyword)
  })
});
const groupedRules = computed$5(() => {
  const groups = new Map();
  filteredRules.value.forEach(rule => {
    const quarters = Array.from(new Set((rule.installments || []).map(item => item.quarter).filter(Boolean))).sort().reverse();
    const key = (ruleQuarter.value !== 'all' && ruleQuarter.value !== 'unclassified')
      ? ruleQuarter.value
      : (quarters[0] || '未分类');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(rule);
  });
  return Array.from(groups.entries())
    .sort(([left], [right]) => left === '未分类' ? 1 : right === '未分类' ? -1 : right.localeCompare(left))
    .map(([quarter, items]) => ({ quarter, items }))
});
const embyServerItems = computed$5(() => (embySync.value.servers || []).map(item => ({
  title: `${item.name}${item.connected ? '' : '（未连接）'}`,
  value: item.name,
})));
const embyGroupRuleItems = computed$5(() => rules.value
  .filter(rule => rule.enabled && rule.target_type === 'group' && rule.episode_group_id)
  .map(rule => ({
    title: `${rule.title} · TMDB ${rule.tmdb_id}`,
    value: `${rule.tmdb_id}|${rule.episode_group_id}`,
  })));
const embyStatusText = computed$5(() => {
  if (!embySync.value.available) return '当前 MoviePilot 不支持媒体服务器服务目录'
  if (!embySync.value.config?.enabled) return '已停用'
  if (!embySync.value.active) return '等待插件总开关与集数偏移模块'
  if (!embySync.value.servers?.length) return '未配置 Emby'
  return embySync.value.worker_running ? '正在监听整理入库' : '后台工作器未运行'
});

async function loadEmbySync(background = false) {
  if (!background) embyLoading.value = true;
  try {
    embySync.value = unwrapResponse(await props.api.get(
      `${props.pluginBase}/episode-normalizer/emby-sync`,
    )) || embySync.value;
    scheduleEmbyPoll();
  } catch (err) {
    if (!background) error.value = err?.message || 'Emby 剧集组联动状态加载失败';
  } finally {
    if (!background) embyLoading.value = false;
  }
}

function scheduleEmbyPoll() {
  if (embyTimer) clearTimeout(embyTimer);
  embyTimer = null;
  if (componentActive && subModule.value === 'emby' && Number(embySync.value.counts?.pending || 0) > 0) {
    embyTimer = setTimeout(() => loadEmbySync(true), 5000);
  }
}

async function saveEmbySync() {
  embySaving.value = true;
  error.value = '';
  try {
    const saved = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/emby-sync/config`, embySync.value.config,
    )) || embySync.value;
    embySync.value = saved;
    emit('config-saved', saved);
    showNotice('Emby 剧集组联动设置已保存');
    scheduleEmbyPoll();
  } catch (err) {
    error.value = err?.message || '联动设置保存失败';
  } finally {
    embySaving.value = false;
  }
}

function addPathMapping() {
  if (!Array.isArray(embySync.value.config.path_mappings)) embySync.value.config.path_mappings = [];
  embySync.value.config.path_mappings.push({ server: '*', source: '', target: '' });
}

async function previewEmbySync() {
  const [tmdbId, groupId] = String(embyPreviewRule.value || '').split('|');
  if (!tmdbId || !groupId || !embyPreviewPath.value) return
  embyPreviewing.value = true;
  error.value = '';
  try {
    embyPreview.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/emby-sync/preview`,
      {
        tmdb_id: Number(tmdbId), episode_group_id: groupId,
        target_path: embyPreviewPath.value, servers: embySync.value.config.servers,
      },
    ));
  } catch (err) {
    error.value = err?.message || 'Emby 定位试跑失败';
  } finally {
    embyPreviewing.value = false;
  }
}

async function applyAllEmbyCandidates(server, result) {
  const [tmdbId, groupId] = String(embyPreviewRule.value || '').split('|');
  const count = Number(result?.candidate_count || result?.candidates?.length || 0);
  if (!tmdbId || !groupId || !server || count < 1) return
  const policy = result?.conflict_policy === 'overwrite'
    ? '已有不同 TmdbEg 的条目也会按当前设置覆盖。'
    : '已有不同 TmdbEg 的条目会按当前安全策略跳过。';
  if (!window.confirm(`确认处理 ${server} 中全部 ${count} 个同 TMDBID Series？${policy}`)) return
  embyApplyingAll.value = server;
  error.value = '';
  try {
    const outcome = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/emby-sync/apply-all`,
      {
        tmdb_id: Number(tmdbId), episode_group_id: groupId,
        target_path: embyPreviewPath.value, servers: [server],
      },
    )) || {};
    const serverResult = outcome.results?.[server];
    if (!serverResult) throw new Error(outcome.reason || `${server} 没有返回处理结果`)
    if (serverResult) {
      embyPreview.value = {
        ...(embyPreview.value || {}),
        results: { ...(embyPreview.value?.results || {}), [server]: serverResult },
      };
    }
    showNotice(`${server}：${serverResult.reason}`, embyResultColor(serverResult.status));
    await loadEmbySync(true);
  } catch (err) {
    error.value = err?.message || '批量写入 Emby 剧集组失败';
  } finally {
    embyApplyingAll.value = '';
  }
}

async function retryEmbyJob(jobId = '') {
  embyLoading.value = true;
  try {
    embySync.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/emby-sync/retry`, { job_id: jobId },
    )) || embySync.value;
    scheduleEmbyPoll();
  } catch (err) {
    error.value = err?.message || '任务重新排队失败';
  } finally {
    embyLoading.value = false;
  }
}

async function deleteEmbyJob(jobId = '') {
  embyLoading.value = true;
  try {
    embySync.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/emby-sync/delete`,
      jobId ? { job_id: jobId } : { finished_only: true },
    )) || embySync.value;
  } catch (err) {
    error.value = err?.message || '任务删除失败';
  } finally {
    embyLoading.value = false;
  }
}

function embyResultColor(status) {
  if (['updated', 'already', 'ready', 'completed'].includes(status)) return 'success'
  if (['pending', 'running'].includes(status)) return 'info'
  if (['conflict', 'ambiguous', 'unsupported', 'partial', 'attention', 'timeout'].includes(status)) return 'warning'
  return 'error'
}

function embyResultText(status) {
  return ({
    ready: '定位成功', updated: '已写入', already: '已正确配置', pending: '等待入库',
    running: '正在处理', completed: '全部完成', attention: '需要处理', timeout: '等待超时',
    conflict: '已有冲突', ambiguous: '定位歧义', unsupported: '神医不支持', error: '请求失败',
    partial: '部分完成',
  })[status] || status || '未知'
}

async function loadRules() {
  const data = unwrapResponse(await props.api.get(`${props.pluginBase}/episode-normalizer`)) || {};
  rules.value = data.rules || [];
}

function openManualDialog() {
  manualMessage.value = '';
  manualForm.value = {
    tmdb_id: '', preference: 'default', specify_quarter: false,
    year: board.value.year, quarter: board.value.quarter,
  };
  manualDialog.value = true;
}

async function manualAddRule() {
  if (!manualForm.value.tmdb_id) return
  manualLoading.value = true;
  manualMessage.value = '';
  try {
    const quarter = manualForm.value.specify_quarter
      ? `${manualForm.value.year}-Q${manualForm.value.quarter}`
      : '';
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/manual-add`,
      { tmdb_id: manualForm.value.tmdb_id, preference: manualForm.value.preference, quarter },
    )) || {};
    if (data.requires_quarter) {
      manualForm.value.specify_quarter = true;
      manualMessage.value = `${data.title || `TMDB ${data.tmdb_id}`} 没有可用的季首播日期，请指定归属季度后再次加入。`;
      return
    }
    rules.value = data.rules || rules.value;
    manualDialog.value = false;
    showNotice(`${data.title || `TMDB ${data.tmdb_id}`} 已加入${data.quarter ? ` ${data.quarter}` : ''} 维护规则`);
    await loadQuarter(false, true);
    if (data.needs_attention && data.rule) await openEditor(data.rule);
  } catch (err) {
    manualMessage.value = err?.message || '手动建立规则失败';
  } finally {
    manualLoading.value = false;
  }
}

async function deleteFilteredRules() {
  if (!filteredRules.value.length) return
  deleteRulesLoading.value = true;
  try {
    const deletedIds = new Set(filteredRules.value.map(rule => Number(rule.tmdb_id)));
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/rule/batch-delete`,
      { tmdb_ids: Array.from(deletedIds) },
    )) || {};
    rules.value = data.rules || [];
    catalog.value.forEach(item => {
      if (deletedIds.has(Number(item.tmdb_match?.best?.tmdb_id))) item.maintained = false;
    });
    deleteRulesDialog.value = false;
    showNotice(`已删除 ${data.deleted || deletedIds.size} 条维护规则`);
  } catch (err) {
    error.value = err?.message || '批量删除维护规则失败';
  } finally {
    deleteRulesLoading.value = false;
  }
}

async function loadQuarter(refresh = false, background = false) {
  if (!background) catalogLoading.value = true;
  error.value = '';
  if (!background) {
    selectedIds.value = [];
  }
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/catalog/query`,
      { year: board.value.year, quarter: board.value.quarter, refresh },
    )) || {};
    catalog.value = data.catalog || [];
    catalogMeta.value = data;
    if (!platforms.value.some(item => item.value === board.value.platform)) board.value.platform = 'all';
    scheduleScanPoll(Number(data.scanning_count || 0));
  } catch (err) {
    error.value = err?.message || '季度看板加载失败';
    if (!background) catalog.value = [];
  } finally {
    if (!background) catalogLoading.value = false;
  }
}

function scheduleScanPoll(scanningCount) {
  if (scanTimer) clearTimeout(scanTimer);
  scanTimer = null;
  if (componentActive && scanningCount > 0) {
    scanTimer = setTimeout(() => loadQuarter(false, true), 1800);
  }
}

async function addCatalogItem(item, preference, tmdbId = '', singleFailure = true) {
  busyId.value = item.id;
  error.value = '';
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/catalog/add`,
      { id: item.id, quarter: quarterKey.value, preference, tmdb_id: tmdbId || undefined },
    )) || {};
    const saved = (data.rules || []).some(rule => Number(rule.tmdb_id) === Number(data.tmdb_id));
    if (!data.rule || !data.tmdb_id || !saved) throw new Error('后端未确认规则写入，未标记为已维护')
    rules.value = data.rules || rules.value;
    Object.assign(item, data.item || {}, { maintained: true });
    failures.value = failures.value.filter(value => value.id !== item.id);
    showNotice(data.message || `${item.display_name || item.name_cn || item.name} 已加入维护规则`);
    if (data.needs_attention) openEditor(data.rule);
  } catch (err) {
    const failure = {
      id: item.id,
      title: item.display_name || item.name_cn || item.name,
      reason: err?.message || '自动匹配 TMDB 失败',
      item,
      preference,
    };
    failures.value = singleFailure
      ? [failure]
      : [...failures.value.filter(value => value.id !== item.id), failure];
    failureDialog.value = true;
  } finally {
    busyId.value = '';
  }
}

async function batchAdd() {
  if (!selectedIds.value.length) return
  batchLoading.value = true;
  error.value = '';
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/catalog/batch-add`,
      { quarter: quarterKey.value, ids: selectedIds.value, preference: batchPreference.value },
    )) || {};
    rules.value = data.rules || rules.value;
    const savedTmdbIds = new Set((data.rules || []).map(rule => Number(rule.tmdb_id)));
    const addedIds = new Set((data.added || [])
      .filter(item => item.tmdb_id && savedTmdbIds.has(Number(item.tmdb_id)))
      .map(item => item.id));
    catalog.value = data.catalog || catalog.value;
    catalog.value.forEach(item => { if (addedIds.has(item.id)) item.maintained = true; });
    failures.value = (data.failed || []).map(value => ({
      ...value,
      item: catalog.value.find(item => item.id === value.id),
      preference: batchPreference.value,
    }));
    if (failures.value.length) failureDialog.value = true;
    const attention = data.needs_attention?.length || 0;
    showNotice(`已加入 ${data.added?.length || 0} 条${attention ? `，其中 ${attention} 条需要补充季度起点` : ''}`);
    selectedIds.value = failures.value.map(item => item.id);
  } catch (err) {
    error.value = err?.message || '批量加入失败';
  } finally {
    batchLoading.value = false;
  }
}

async function retryFailure(failure) {
  const tmdbId = manualTmdb.value[failure.id];
  if (!tmdbId || !failure.item) return
  await addCatalogItem(failure.item, failure.preference, tmdbId, false);
  if (!failures.value.length) failureDialog.value = false;
}

function toggleAllFiltered() {
  const filteredIds = filteredCatalog.value.map(item => item.id);
  const filteredIdSet = new Set(filteredIds);
  if (allFilteredSelected.value) {
    selectedIds.value = selectedIds.value.filter(id => !filteredIdSet.has(id));
  } else {
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...filteredIds]));
  }
}

function ignoreFailure(failure) {
  failures.value = failures.value.filter(value => value.id !== failure.id);
  selectedIds.value = selectedIds.value.filter(id => id !== failure.id);
  delete manualTmdb.value[failure.id];
  if (!failures.value.length) failureDialog.value = false;
}

function prepareRule(rule) {
  const cloned = JSON.parse(JSON.stringify(rule));
  cloned.original_tmdb_id = rule.tmdb_id;
  cloned.installments = (cloned.installments || []).map(item => ({
    ...item,
    aliases: Array.isArray(item.aliases) ? item.aliases.join('\n') : (item.aliases || ''),
  }));
  return cloned
}

async function openEditor(rule) {
  if (!rule) return
  editForm.value = prepareRule(rule);
  editorOpen.value = true;
  inspection.value = null;
  await inspectTarget();
}

async function inspectTarget() {
  if (!editForm.value?.tmdb_id) return
  editorLoading.value = true;
  try {
    inspection.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/inspect`,
      { tmdb_id: editForm.value.tmdb_id },
    ));
    if (Number(editForm.value.original_tmdb_id) !== Number(editForm.value.tmdb_id) && inspection.value?.title) {
      editForm.value.title = inspection.value.title;
      editForm.value.episode_group_id = '';
    }
  } catch (err) {
    error.value = err?.message || '目标编集读取失败';
  } finally {
    editorLoading.value = false;
  }
}

async function saveRule() {
  if (!editForm.value) return
  editorLoading.value = true;
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/rule`, editForm.value,
    )) || {};
    rules.value = data.rules || rules.value;
    await loadQuarter(false, true);
    editorOpen.value = false;
    showNotice('维护规则已保存');
  } catch (err) {
    error.value = err?.message || '规则保存失败';
  } finally {
    editorLoading.value = false;
  }
}

async function deleteRule(rule) {
  busyId.value = `rule-${rule.tmdb_id}`;
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/rule/delete`,
      { tmdb_id: rule.tmdb_id },
    )) || {};
    rules.value = data.rules || [];
    catalog.value.forEach(item => {
      if (Number(item.tmdb_match?.best?.tmdb_id) === Number(rule.tmdb_id)) item.maintained = false;
    });
  } finally {
    busyId.value = '';
  }
}

function addInstallment() {
  editForm.value.installments.push({
    id: `manual-${Date.now()}`,
    title: '', quarter: '', aliases: '', source_season: '', source_start_episode: '',
    target_start_season: 1, target_start_episode: 1,
  });
}

function groupType(type) {
  return ({ 1: '原始播出', 2: '绝对编号', 3: 'DVD', 4: 'Digital', 5: '故事线', 6: '制片', 7: 'TV' })[type] || `类型 ${type}`
}

function applyTargetRecommendation() {
  const recommendation = inspection.value?.recommendation;
  if (!recommendation || !editForm.value) return
  editForm.value.target_type = recommendation.target_type || 'default';
  editForm.value.episode_group_id = recommendation.target_type === 'group'
    ? (recommendation.episode_group_id || '')
    : '';
}

function restoreUiState() {
  try {
    const saved = JSON.parse(localStorage.getItem(uiStateKey) || '{}');
    if (saved.board && typeof saved.board === 'object') Object.assign(board.value, saved.board);
    if (typeof saved.ruleSearch === 'string') ruleSearch.value = saved.ruleSearch;
    if (typeof saved.ruleQuarter === 'string') ruleQuarter.value = saved.ruleQuarter;
    if (typeof saved.batchPreference === 'string') batchPreference.value = saved.batchPreference;
    if (typeof saved.rulesOpen === 'boolean') rulesOpen.value = saved.rulesOpen;
    if (['grid', 'list', 'compact'].includes(saved.ruleView)) ruleView.value = saved.ruleView;
    if (['grid', 'list', 'compact'].includes(saved.boardView)) boardView.value = saved.boardView;
    if (['rules', 'catalog', 'emby'].includes(saved.subModule)) subModule.value = saved.subModule;
  } catch (_) {
    // 浏览器禁用存储或旧数据损坏时使用默认值。
  }
}

function persistUiState() {
  try {
    localStorage.setItem(uiStateKey, JSON.stringify({
      board: board.value,
      ruleSearch: ruleSearch.value,
      ruleQuarter: ruleQuarter.value,
      batchPreference: batchPreference.value,
      rulesOpen: rulesOpen.value,
      ruleView: ruleView.value,
      boardView: boardView.value,
      subModule: subModule.value,
    }));
  } catch (_) {
    // 无痕模式下存储失败不影响功能。
  }
}

function schedulePersistUiState() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persistTimer = null;
    persistUiState();
  }, 220);
}

restoreUiState();
watch$3(() => [board.value.year, board.value.quarter], () => {
  if (subModule.value === 'catalog') loadQuarter(false);
});
watch$3(subModule, value => {
  schedulePersistUiState();
  if (value === 'catalog' && initialized && !catalog.value.length) loadQuarter(false);
  if (value === 'emby' && initialized) loadEmbySync(false);
});
watch$3(
  [board, ruleSearch, ruleQuarter, batchPreference, rulesOpen, ruleView, boardView, subModule],
  schedulePersistUiState,
  { deep: true },
);
onActivated(() => {
  componentActive = true;
  if (initialized && subModule.value === 'catalog') loadQuarter(false, true);
  if (initialized && subModule.value === 'emby') loadEmbySync(true);
});
onDeactivated(() => {
  componentActive = false;
  if (scanTimer) clearTimeout(scanTimer);
  scanTimer = null;
  if (embyTimer) clearTimeout(embyTimer);
  embyTimer = null;
});
onBeforeUnmount$2(() => {
  if (scanTimer) clearTimeout(scanTimer);
  if (persistTimer) clearTimeout(persistTimer);
  if (embyTimer) clearTimeout(embyTimer);
});
onMounted$5(async () => {
  try {
    await Promise.all([
      loadRules(),
      subModule.value === 'catalog' ? loadQuarter(false) : Promise.resolve(),
      subModule.value === 'emby' ? loadEmbySync(false) : Promise.resolve(),
    ]);
    initialized = true;
  } catch (err) {
    error.value = err?.message || '集数偏移数据加载失败';
  }
});

return (_ctx, _cache) => {
  const _component_VChip = _resolveComponent$5("VChip");
  const _component_VTab = _resolveComponent$5("VTab");
  const _component_VTabs = _resolveComponent$5("VTabs");
  const _component_VAlert = _resolveComponent$5("VAlert");
  const _component_VIcon = _resolveComponent$5("VIcon");
  const _component_VAvatar = _resolveComponent$5("VAvatar");
  const _component_VCardTitle = _resolveComponent$5("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$5("VCardSubtitle");
  const _component_VBtn = _resolveComponent$5("VBtn");
  const _component_VCardItem = _resolveComponent$5("VCardItem");
  const _component_VTextField = _resolveComponent$5("VTextField");
  const _component_VSelect = _resolveComponent$5("VSelect");
  const _component_VBtnToggle = _resolveComponent$5("VBtnToggle");
  const _component_VCardText = _resolveComponent$5("VCardText");
  const _component_VCard = _resolveComponent$5("VCard");
  const _component_VExpandTransition = _resolveComponent$5("VExpandTransition");
  const _component_VSwitch = _resolveComponent$5("VSwitch");
  const _component_VCheckbox = _resolveComponent$5("VCheckbox");
  const _component_VSpacer = _resolveComponent$5("VSpacer");
  const _component_VProgressLinear = _resolveComponent$5("VProgressLinear");
  const _component_VImg = _resolveComponent$5("VImg");
  const _component_VProgressCircular = _resolveComponent$5("VProgressCircular");
  const _component_VListItem = _resolveComponent$5("VListItem");
  const _component_VList = _resolveComponent$5("VList");
  const _component_VMenu = _resolveComponent$5("VMenu");
  const _component_VCardActions = _resolveComponent$5("VCardActions");
  const _component_VDivider = _resolveComponent$5("VDivider");
  const _component_VCol = _resolveComponent$5("VCol");
  const _component_VRow = _resolveComponent$5("VRow");
  const _component_VDialog = _resolveComponent$5("VDialog");
  const _component_VRadio = _resolveComponent$5("VRadio");
  const _component_VRadioGroup = _resolveComponent$5("VRadioGroup");
  const _component_VExpansionPanelTitle = _resolveComponent$5("VExpansionPanelTitle");
  const _component_VTextarea = _resolveComponent$5("VTextarea");
  const _component_VExpansionPanelText = _resolveComponent$5("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent$5("VExpansionPanel");
  const _component_VExpansionPanels = _resolveComponent$5("VExpansionPanels");
  const _component_VSnackbar = _resolveComponent$5("VSnackbar");

  return (_openBlock$5(), _createElementBlock$5("div", _hoisted_1$5, [
    _createVNode$5(ModuleHeader, {
      icon: "mdi-animation-outline",
      title: "集数偏移",
      subtitle: "将片源的季集坐标归一化到 TMDB 默认编集或指定剧集组，并可联动 Emby 元数据。",
      color: "success"
    }, {
      actions: _withCtx$5(() => [
        _createVNode$5(_component_VChip, {
          color: __props.runtimeStatus.runtime_compatible ? 'success' : 'warning',
          variant: "tonal",
          size: "small",
          "prepend-icon": __props.runtimeStatus.runtime_compatible ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'
        }, {
          default: _withCtx$5(() => [
            _createTextVNode$5(_toDisplayString$5(__props.runtimeStatus.runtime_compatible ? `${rules.value.length} 条维护规则` : '运行时不兼容'), 1)
          ]),
          _: 1
        }, 8, ["color", "prepend-icon"])
      ]),
      controls: _withCtx$5(() => [
        _createVNode$5(_component_VTabs, {
          modelValue: subModule.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((subModule).value = $event)),
          color: "primary",
          "show-arrows": "",
          class: "module-header-tabs"
        }, {
          default: _withCtx$5(() => [
            _createVNode$5(_component_VTab, {
              value: "rules",
              "prepend-icon": "mdi-playlist-check"
            }, {
              default: _withCtx$5(() => [...(_cache[50] || (_cache[50] = [
                _createTextVNode$5("偏移规则维护", -1)
              ]))]),
              _: 1
            }),
            _createVNode$5(_component_VTab, {
              value: "catalog",
              "prepend-icon": "mdi-view-dashboard-outline"
            }, {
              default: _withCtx$5(() => [...(_cache[51] || (_cache[51] = [
                _createTextVNode$5("季度番剧看板", -1)
              ]))]),
              _: 1
            }),
            _createVNode$5(_component_VTab, {
              value: "emby",
              "prepend-icon": "mdi-server-network"
            }, {
              default: _withCtx$5(() => [...(_cache[52] || (_cache[52] = [
                _createTextVNode$5("Emby 剧集组联动", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      _: 1
    }),
    (error.value)
      ? (_openBlock$5(), _createBlock$5(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          closable: "",
          class: "mb-4",
          "onClick:close": _cache[1] || (_cache[1] = $event => (error.value = ''))
        }, {
          default: _withCtx$5(() => [
            _createTextVNode$5(_toDisplayString$5(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$5("", true),
    (!__props.runtimeStatus.runtime_compatible)
      ? (_openBlock$5(), _createBlock$5(_component_VAlert, {
          key: 1,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: _withCtx$5(() => [
            _cache[53] || (_cache[53] = _createElementVNode$5("div", { class: "font-weight-bold" }, "集数偏移暂不能接管实际整理", -1)),
            _createElementVNode$5("div", null, _toDisplayString$5(__props.runtimeStatus.runtime_message), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$5("", true),
    _withDirectives$2(_createVNode$5(_component_VCard, {
      variant: "outlined",
      class: "normalizer-card mb-4"
    }, {
      default: _withCtx$5(() => [
        _createVNode$5(_component_VCardItem, null, {
          prepend: _withCtx$5(() => [
            _createVNode$5(_component_VAvatar, {
              color: "success",
              variant: "tonal"
            }, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VIcon, { icon: "mdi-playlist-check" })
              ]),
              _: 1
            })
          ]),
          append: _withCtx$5(() => [
            _createVNode$5(_component_VBtn, {
              icon: rulesOpen.value ? 'mdi-chevron-up' : 'mdi-chevron-down',
              variant: "text",
              title: rulesOpen.value ? '收起规则' : '展开规则',
              onClick: _cache[2] || (_cache[2] = $event => (rulesOpen.value = !rulesOpen.value))
            }, null, 8, ["icon", "title"])
          ]),
          default: _withCtx$5(() => [
            _createVNode$5(_component_VCardTitle, null, {
              default: _withCtx$5(() => [...(_cache[54] || (_cache[54] = [
                _createTextVNode$5("已维护规则", -1)
              ]))]),
              _: 1
            }),
            _createVNode$5(_component_VCardSubtitle, null, {
              default: _withCtx$5(() => [
                _createTextVNode$5(_toDisplayString$5(rules.value.length) + " 个 TMDB 条目；定义来源集数到目标编集的映射", 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$5(_component_VExpandTransition, null, {
          default: _withCtx$5(() => [
            (rulesOpen.value)
              ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_2$5, [
                  _createElementVNode$5("div", _hoisted_3$4, [
                    _createVNode$5(_component_VTextField, {
                      modelValue: ruleSearch.value,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((ruleSearch).value = $event)),
                      label: "搜索标题、别名或 TMDBID",
                      "prepend-inner-icon": "mdi-magnify",
                      clearable: "",
                      "hide-details": "",
                      density: "compact"
                    }, null, 8, ["modelValue"]),
                    _createVNode$5(_component_VSelect, {
                      modelValue: ruleQuarter.value,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((ruleQuarter).value = $event)),
                      items: ruleQuarterOptions.value,
                      label: "按季度查看",
                      "hide-details": "",
                      density: "compact"
                    }, null, 8, ["modelValue", "items"]),
                    _createVNode$5(_component_VBtnToggle, {
                      modelValue: ruleView.value,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((ruleView).value = $event)),
                      mandatory: "",
                      density: "compact",
                      variant: "outlined",
                      divided: ""
                    }, {
                      default: _withCtx$5(() => [
                        _createVNode$5(_component_VBtn, {
                          value: "grid",
                          icon: "mdi-view-grid-outline",
                          title: "平铺"
                        }),
                        _createVNode$5(_component_VBtn, {
                          value: "list",
                          icon: "mdi-view-list-outline",
                          title: "列表"
                        }),
                        _createVNode$5(_component_VBtn, {
                          value: "compact",
                          icon: "mdi-view-headline",
                          title: "紧凑"
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    _createVNode$5(_component_VBtn, {
                      color: "primary",
                      variant: "tonal",
                      "prepend-icon": "mdi-plus",
                      onClick: openManualDialog
                    }, {
                      default: _withCtx$5(() => [...(_cache[55] || (_cache[55] = [
                        _createTextVNode$5("手动添加", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$5(_component_VBtn, {
                      color: "error",
                      variant: "tonal",
                      "prepend-icon": "mdi-delete-sweep-outline",
                      disabled: !filteredRules.value.length,
                      onClick: _cache[6] || (_cache[6] = $event => (deleteRulesDialog.value = true))
                    }, {
                      default: _withCtx$5(() => [
                        _createTextVNode$5("删除当前结果 " + _toDisplayString$5(filteredRules.value.length || ''), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ]),
                  (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(groupedRules.value, (group) => {
                    return (_openBlock$5(), _createElementBlock$5("div", {
                      key: group.quarter,
                      class: "rule-group px-4 pb-4"
                    }, [
                      _createElementVNode$5("div", _hoisted_4$4, [
                        _createVNode$5(_component_VIcon, {
                          icon: "mdi-calendar-month-outline",
                          size: "18"
                        }),
                        _createElementVNode$5("strong", null, _toDisplayString$5(group.quarter), 1),
                        _createElementVNode$5("span", _hoisted_5$4, _toDisplayString$5(group.items.length) + " 条", 1)
                      ]),
                      _createElementVNode$5("div", {
                        class: _normalizeClass$3(['rules-grid', `view-${ruleView.value}`])
                      }, [
                        (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(group.items, (rule) => {
                          return (_openBlock$5(), _createBlock$5(_component_VCard, {
                            key: rule.tmdb_id,
                            variant: "tonal",
                            class: "rule-card"
                          }, {
                            default: _withCtx$5(() => [
                              _createVNode$5(_component_VCardText, { class: "d-flex align-center ga-3" }, {
                                default: _withCtx$5(() => [
                                  _createVNode$5(_component_VAvatar, {
                                    color: rule.enabled ? 'success' : 'default',
                                    variant: "tonal"
                                  }, {
                                    default: _withCtx$5(() => [
                                      _createVNode$5(_component_VIcon, { icon: "mdi-animation-outline" })
                                    ]),
                                    _: 1
                                  }, 8, ["color"]),
                                  _createElementVNode$5("div", _hoisted_6$4, [
                                    _createElementVNode$5("div", _hoisted_7$4, _toDisplayString$5(rule.title), 1),
                                    _createElementVNode$5("div", _hoisted_8$4, "TMDB " + _toDisplayString$5(rule.tmdb_id) + " · " + _toDisplayString$5(rule.target_type === 'group' ? '剧集组' : '默认编集') + " · " + _toDisplayString$5(rule.installments?.length || 0) + " 个季度片段", 1),
                                    (rule.installments?.some(item => item.quarter))
                                      ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_9$4, [
                                          (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(Array.from(new Set(rule.installments.map(item => item.quarter).filter(Boolean))).sort().reverse(), (quarter) => {
                                            return (_openBlock$5(), _createBlock$5(_component_VChip, {
                                              key: quarter,
                                              size: "x-small",
                                              variant: "outlined"
                                            }, {
                                              default: _withCtx$5(() => [
                                                _createTextVNode$5(_toDisplayString$5(quarter), 1)
                                              ]),
                                              _: 2
                                            }, 1024))
                                          }), 128))
                                        ]))
                                      : _createCommentVNode$5("", true)
                                  ]),
                                  _createVNode$5(_component_VBtn, {
                                    icon: "mdi-pencil-outline",
                                    variant: "text",
                                    onClick: $event => (openEditor(rule))
                                  }, null, 8, ["onClick"]),
                                  _createVNode$5(_component_VBtn, {
                                    icon: "mdi-delete-outline",
                                    variant: "text",
                                    color: "error",
                                    loading: busyId.value === `rule-${rule.tmdb_id}`,
                                    onClick: $event => (deleteRule(rule))
                                  }, null, 8, ["loading", "onClick"])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024))
                        }), 128))
                      ], 2)
                    ]))
                  }), 128)),
                  (!filteredRules.value.length)
                    ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_10$4, "当前季度或搜索条件下没有维护规则。"))
                    : _createCommentVNode$5("", true)
                ]))
              : _createCommentVNode$5("", true)
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 512), [
      [_vShow$2, subModule.value === 'rules']
    ]),
    _withDirectives$2(_createVNode$5(_component_VCard, {
      variant: "outlined",
      class: "normalizer-card mb-4"
    }, {
      default: _withCtx$5(() => [
        _createVNode$5(_component_VCardItem, null, {
          prepend: _withCtx$5(() => [
            _createVNode$5(_component_VAvatar, {
              color: "secondary",
              variant: "tonal"
            }, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VIcon, { icon: "mdi-view-dashboard-outline" })
              ]),
              _: 1
            })
          ]),
          append: _withCtx$5(() => [
            _createElementVNode$5("div", _hoisted_11$4, [
              _createVNode$5(_component_VBtnToggle, {
                modelValue: boardView.value,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((boardView).value = $event)),
                mandatory: "",
                density: "compact",
                variant: "outlined",
                divided: ""
              }, {
                default: _withCtx$5(() => [
                  _createVNode$5(_component_VBtn, {
                    value: "grid",
                    icon: "mdi-view-grid-outline",
                    title: "平铺"
                  }),
                  _createVNode$5(_component_VBtn, {
                    value: "list",
                    icon: "mdi-view-list-outline",
                    title: "列表"
                  }),
                  _createVNode$5(_component_VBtn, {
                    value: "compact",
                    icon: "mdi-view-headline",
                    title: "紧凑"
                  })
                ]),
                _: 1
              }, 8, ["modelValue"]),
              _createVNode$5(_component_VBtn, {
                icon: "mdi-refresh",
                variant: "text",
                loading: catalogLoading.value,
                onClick: _cache[8] || (_cache[8] = $event => (loadQuarter(true)))
              }, null, 8, ["loading"])
            ])
          ]),
          default: _withCtx$5(() => [
            _createVNode$5(_component_VCardTitle, null, {
              default: _withCtx$5(() => [...(_cache[56] || (_cache[56] = [
                _createTextVNode$5("季度番剧看板", -1)
              ]))]),
              _: 1
            }),
            _createVNode$5(_component_VCardSubtitle, null, {
              default: _withCtx$5(() => [
                _createTextVNode$5("AniList 日漫主目录 · 跨站 ID 优先映射 · 未命中再搜索 TMDB；当前仅显示 " + _toDisplayString$5(quarterKey.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$5(_component_VCardText, null, {
          default: _withCtx$5(() => [
            _createElementVNode$5("div", _hoisted_12$4, [
              _createVNode$5(_component_VSelect, {
                modelValue: board.value.year,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((board.value.year) = $event)),
                items: _unref$2(years),
                label: "年份",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$5(_component_VSelect, {
                modelValue: board.value.quarter,
                "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((board.value.quarter) = $event)),
                items: [1,2,3,4].map(value => ({ title: `Q${value}`, value })),
                label: "季度",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$5(_component_VTextField, {
                modelValue: board.value.search,
                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((board.value.search) = $event)),
                label: "搜索番剧",
                "prepend-inner-icon": "mdi-magnify",
                clearable: "",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue"]),
              _createVNode$5(_component_VSelect, {
                modelValue: board.value.region,
                "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((board.value.region) = $event)),
                label: "地区",
                "hide-details": "",
                density: "compact",
                items: [{title:'全部地区',value:'all'},{title:'日漫',value:'japan'},{title:'国漫',value:'china'},{title:'海外动画',value:'western'},{title:'地区未知',value:'unknown'}]
              }, null, 8, ["modelValue"]),
              _createVNode$5(_component_VSelect, {
                modelValue: board.value.platform,
                "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((board.value.platform) = $event)),
                items: platforms.value,
                label: "载体",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$5(_component_VSelect, {
                modelValue: board.value.scanStatus,
                "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((board.value.scanStatus) = $event)),
                label: "扫描状态",
                "hide-details": "",
                density: "compact",
                items: [{title:'全部状态',value:'all'},{title:'正在扫描',value:'scanning'},{title:'已匹配',value:'matched'},{title:'匹配失败',value:'failed'},{title:'通知已忽略',value:'ignored'}]
              }, null, 8, ["modelValue"]),
              _createVNode$5(_component_VSwitch, {
                modelValue: board.value.multiOnly,
                "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((board.value.multiOnly) = $event)),
                label: "仅续作/多季",
                color: "secondary",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue"])
            ]),
            _createElementVNode$5("div", _hoisted_13$4, [
              _createVNode$5(_component_VCheckbox, {
                "model-value": allFilteredSelected.value,
                indeterminate: selectedIds.value.length > 0 && !allFilteredSelected.value,
                label: "选择当前筛选结果",
                "hide-details": "",
                density: "compact",
                onClick: toggleAllFiltered
              }, null, 8, ["model-value", "indeterminate"]),
              _createVNode$5(_component_VSpacer),
              _createVNode$5(_component_VSelect, {
                modelValue: batchPreference.value,
                "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((batchPreference).value = $event)),
                class: "batch-target",
                "hide-details": "",
                density: "compact",
                items: [{title:'优先 TMDB 默认编集',value:'default'},{title:'优先剧集组（Production/Season）',value:'group_preferred'}]
              }, null, 8, ["modelValue"]),
              _createVNode$5(_component_VBtn, {
                color: "secondary",
                "prepend-icon": "mdi-playlist-plus",
                loading: batchLoading.value,
                disabled: !selectedIds.value.length,
                onClick: batchAdd
              }, {
                default: _withCtx$5(() => [
                  _createTextVNode$5("批量加入 " + _toDisplayString$5(selectedIds.value.length || ''), 1)
                ]),
                _: 1
              }, 8, ["loading", "disabled"])
            ]),
            (catalogLoading.value)
              ? (_openBlock$5(), _createBlock$5(_component_VProgressLinear, {
                  key: 0,
                  indeterminate: "",
                  color: "secondary",
                  class: "mb-4"
                }))
              : _createCommentVNode$5("", true),
            _createElementVNode$5("div", _hoisted_14$4, [
              _createTextVNode$5(" 当前 " + _toDisplayString$5(filteredCatalog.value.length) + " / " + _toDisplayString$5(catalog.value.length) + " 条 ", 1),
              (catalogMeta.value.scanning_count)
                ? (_openBlock$5(), _createElementBlock$5("span", _hoisted_15$4, " · " + _toDisplayString$5(catalogMeta.value.scanning_count) + " 条正在扫描", 1))
                : _createCommentVNode$5("", true),
              (catalogMeta.value.updated_at)
                ? (_openBlock$5(), _createElementBlock$5("span", _hoisted_16$4, " · 更新于 " + _toDisplayString$5(catalogMeta.value.updated_at), 1))
                : _createCommentVNode$5("", true)
            ]),
            _createElementVNode$5("div", {
              class: _normalizeClass$3(['catalog-grid', `view-${boardView.value}`])
            }, [
              (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(filteredCatalog.value, (item) => {
                return (_openBlock$5(), _createBlock$5(_component_VCard, {
                  key: item.id,
                  variant: "outlined",
                  class: "catalog-card"
                }, {
                  default: _withCtx$5(() => [
                    _createElementVNode$5("div", _hoisted_17$4, [
                      _createVNode$5(_component_VCheckbox, {
                        modelValue: selectedIds.value,
                        "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((selectedIds).value = $event)),
                        value: item.id,
                        "hide-details": "",
                        density: "compact"
                      }, null, 8, ["modelValue", "value"])
                    ]),
                    _createElementVNode$5("div", _hoisted_18$3, [
                      (item.poster)
                        ? (_openBlock$5(), _createBlock$5(_component_VImg, {
                            key: 0,
                            src: item.poster,
                            cover: "",
                            class: "catalog-poster"
                          }, null, 8, ["src"]))
                        : (_openBlock$5(), _createElementBlock$5("div", _hoisted_19$3, [
                            _createVNode$5(_component_VIcon, {
                              icon: "mdi-image-off-outline",
                              size: "30"
                            })
                          ])),
                      _createVNode$5(_component_VCardItem, { class: "catalog-summary" }, {
                        default: _withCtx$5(() => [
                          _createVNode$5(_component_VCardTitle, { class: "text-subtitle-1 text-wrap" }, {
                            default: _withCtx$5(() => [
                              _createTextVNode$5(_toDisplayString$5(item.display_name || item.name_cn || item.name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          _createVNode$5(_component_VCardSubtitle, null, {
                            default: _withCtx$5(() => [
                              _createTextVNode$5(_toDisplayString$5(item.date || '日期未知') + " · " + _toDisplayString$5(item.episode_count || '?') + " 集", 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      _createVNode$5(_component_VCardText, { class: "catalog-details" }, {
                        default: _withCtx$5(() => [
                          _createElementVNode$5("div", _hoisted_20$3, [
                            (item.region_name)
                              ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                  key: 0,
                                  size: "x-small",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$5(() => [
                                    _createTextVNode$5(_toDisplayString$5(item.region_name), 1)
                                  ]),
                                  _: 2
                                }, 1024))
                              : _createCommentVNode$5("", true),
                            (item.platform)
                              ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                  key: 1,
                                  size: "x-small",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$5(() => [
                                    _createTextVNode$5(_toDisplayString$5(item.platform), 1)
                                  ]),
                                  _: 2
                                }, 1024))
                              : _createCommentVNode$5("", true),
                            (item.is_multi_season)
                              ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                  key: 2,
                                  size: "x-small",
                                  color: "secondary",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$5(() => [...(_cache[57] || (_cache[57] = [
                                    _createTextVNode$5("续作/多季", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode$5("", true),
                            (item.matched_media_type)
                              ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                  key: 3,
                                  size: "x-small",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$5(() => [
                                    _createTextVNode$5(_toDisplayString$5(item.matched_media_type), 1)
                                  ]),
                                  _: 2
                                }, 1024))
                              : _createCommentVNode$5("", true),
                            (item.scan_status === 'scanning')
                              ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                  key: 4,
                                  size: "x-small",
                                  color: "info",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$5(() => [
                                    _createVNode$5(_component_VProgressCircular, {
                                      indeterminate: "",
                                      size: "11",
                                      width: "2",
                                      class: "me-1"
                                    }),
                                    _cache[58] || (_cache[58] = _createTextVNode$5("正在扫描 ", -1))
                                  ]),
                                  _: 1
                                }))
                              : (item.scan_status === 'failed' && !item.maintained)
                                ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                    key: 5,
                                    size: "x-small",
                                    color: "warning",
                                    variant: "tonal"
                                  }, {
                                    default: _withCtx$5(() => [...(_cache[59] || (_cache[59] = [
                                      _createTextVNode$5("匹配待补充", -1)
                                    ]))]),
                                    _: 1
                                  }))
                                : _createCommentVNode$5("", true),
                            (item.maintained)
                              ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                  key: 6,
                                  size: "x-small",
                                  color: "success",
                                  "prepend-icon": "mdi-check"
                                }, {
                                  default: _withCtx$5(() => [...(_cache[60] || (_cache[60] = [
                                    _createTextVNode$5("已维护", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode$5("", true),
                            (item.notification_ignored)
                              ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                  key: 7,
                                  size: "x-small",
                                  color: "default",
                                  variant: "tonal",
                                  "prepend-icon": "mdi-bell-off-outline"
                                }, {
                                  default: _withCtx$5(() => [...(_cache[61] || (_cache[61] = [
                                    _createTextVNode$5("通知已忽略", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode$5("", true)
                          ]),
                          (item.tmdb_match?.best || item.maintained_tmdb_id)
                            ? (_openBlock$5(), _createElementBlock$5("div", {
                                key: 0,
                                class: "text-caption text-medium-emphasis mt-2 text-truncate",
                                title: `TMDB ${item.tmdb_match?.best?.tmdb_id || item.maintained_tmdb_id} · ${item.tmdb_match?.best?.name || '已维护规则'}`
                              }, " TMDB " + _toDisplayString$5(item.tmdb_match?.best?.tmdb_id || item.maintained_tmdb_id) + " · " + _toDisplayString$5(item.tmdb_match?.best?.name || '已维护规则'), 9, _hoisted_21$3))
                            : _createCommentVNode$5("", true)
                        ]),
                        _: 2
                      }, 1024),
                      _createVNode$5(_component_VCardActions, { class: "catalog-actions" }, {
                        default: _withCtx$5(() => [
                          (!item.maintained && item.rule_eligible !== false)
                            ? (_openBlock$5(), _createBlock$5(_component_VMenu, { key: 0 }, {
                                activator: _withCtx$5(({ props: menuProps }) => [
                                  _createVNode$5(_component_VBtn, _mergeProps$3({ ref_for: true }, menuProps, {
                                    color: "primary",
                                    variant: "tonal",
                                    "append-icon": "mdi-menu-down",
                                    loading: busyId.value === item.id
                                  }), {
                                    default: _withCtx$5(() => [...(_cache[62] || (_cache[62] = [
                                      _createTextVNode$5("加入规则", -1)
                                    ]))]),
                                    _: 1
                                  }, 16, ["loading"])
                                ]),
                                default: _withCtx$5(() => [
                                  _createVNode$5(_component_VList, { density: "compact" }, {
                                    default: _withCtx$5(() => [
                                      _createVNode$5(_component_VListItem, {
                                        title: "使用 TMDB 默认编集",
                                        "prepend-icon": "mdi-database-outline",
                                        onClick: $event => (addCatalogItem(item, 'default'))
                                      }, null, 8, ["onClick"]),
                                      _createVNode$5(_component_VListItem, {
                                        title: "优先 Production/Season 剧集组",
                                        "prepend-icon": "mdi-animation-outline",
                                        onClick: $event => (addCatalogItem(item, 'group_preferred'))
                                      }, null, 8, ["onClick"])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024))
                            : (item.rule_eligible === false)
                              ? (_openBlock$5(), _createBlock$5(_component_VBtn, {
                                  key: 1,
                                  variant: "text",
                                  disabled: "",
                                  "prepend-icon": "mdi-movie-open-outline"
                                }, {
                                  default: _withCtx$5(() => [...(_cache[63] || (_cache[63] = [
                                    _createTextVNode$5("电影条目无需集数规则", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : (_openBlock$5(), _createBlock$5(_component_VBtn, {
                                  key: 2,
                                  variant: "text",
                                  "prepend-icon": "mdi-pencil-outline",
                                  onClick: $event => (openEditor(ruleByTmdbId.value.get(Number(item.tmdb_match?.best?.tmdb_id || item.maintained_tmdb_id))))
                                }, {
                                  default: _withCtx$5(() => [...(_cache[64] || (_cache[64] = [
                                    _createTextVNode$5("编辑规则", -1)
                                  ]))]),
                                  _: 1
                                }, 8, ["onClick"]))
                        ]),
                        _: 2
                      }, 1024)
                    ])
                  ]),
                  _: 2
                }, 1024))
              }), 128)),
              (!catalogLoading.value && !filteredCatalog.value.length)
                ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_22$3, [
                    _createVNode$5(_component_VIcon, {
                      icon: "mdi-calendar-search",
                      size: "48"
                    }),
                    _cache[65] || (_cache[65] = _createElementVNode$5("div", null, "当前筛选条件没有番剧", -1))
                  ]))
                : _createCommentVNode$5("", true)
            ], 2)
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 512), [
      [_vShow$2, subModule.value === 'catalog']
    ]),
    _withDirectives$2(_createElementVNode$5("div", _hoisted_23$3, [
      _createVNode$5(_component_VAlert, {
        type: "info",
        variant: "tonal",
        density: "compact",
        class: "mb-4"
      }, {
        default: _withCtx$5(() => [...(_cache[66] || (_cache[66] = [
          _createTextVNode$5(" 仅当实际整理采用剧集组规则时才会排队；插件通过 TMDBID 与最终路径定位 Emby Series，写入神医使用的 ", -1),
          _createElementVNode$5("code", null, "TmdbEg", -1),
          _createTextVNode$5("。已正确配置的条目会自动跳过。 ", -1)
        ]))]),
        _: 1
      }),
      (!embySync.value.available)
        ? (_openBlock$5(), _createBlock$5(_component_VAlert, {
            key: 0,
            type: "warning",
            variant: "tonal",
            class: "mb-4"
          }, {
            default: _withCtx$5(() => [...(_cache[67] || (_cache[67] = [
              _createTextVNode$5(" 当前 MoviePilot 缺少媒体服务器服务目录，无法复用已配置的 Emby。此限制不会影响集数偏移本身。 ", -1)
            ]))]),
            _: 1
          }))
        : _createCommentVNode$5("", true),
      _createVNode$5(_component_VCard, {
        variant: "outlined",
        class: "normalizer-card mb-4"
      }, {
        default: _withCtx$5(() => [
          _createVNode$5(_component_VCardItem, null, {
            prepend: _withCtx$5(() => [
              _createVNode$5(_component_VAvatar, {
                color: "primary",
                variant: "tonal"
              }, {
                default: _withCtx$5(() => [
                  _createVNode$5(_component_VIcon, { icon: "mdi-server-network" })
                ]),
                _: 1
              })
            ]),
            append: _withCtx$5(() => [
              _createVNode$5(_component_VSwitch, {
                modelValue: embySync.value.config.enabled,
                "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((embySync.value.config.enabled) = $event)),
                color: "success",
                "hide-details": "",
                label: "启用联动"
              }, null, 8, ["modelValue"])
            ]),
            default: _withCtx$5(() => [
              _createVNode$5(_component_VCardTitle, null, {
                default: _withCtx$5(() => [...(_cache[68] || (_cache[68] = [
                  _createTextVNode$5("入库联动设置", -1)
                ]))]),
                _: 1
              }),
              _createVNode$5(_component_VCardSubtitle, null, {
                default: _withCtx$5(() => [
                  _createTextVNode$5(_toDisplayString$5(embyStatusText.value), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode$5(_component_VCardText, null, {
            default: _withCtx$5(() => [
              _createElementVNode$5("div", _hoisted_24$3, [
                _createElementVNode$5("div", null, [
                  _cache[69] || (_cache[69] = _createElementVNode$5("span", null, "等待处理", -1)),
                  _createElementVNode$5("strong", null, _toDisplayString$5(embySync.value.counts?.pending || 0), 1)
                ]),
                _createElementVNode$5("div", null, [
                  _cache[70] || (_cache[70] = _createElementVNode$5("span", null, "已完成", -1)),
                  _createElementVNode$5("strong", null, _toDisplayString$5(embySync.value.counts?.completed || 0), 1)
                ]),
                _createElementVNode$5("div", null, [
                  _cache[71] || (_cache[71] = _createElementVNode$5("span", null, "需要处理", -1)),
                  _createElementVNode$5("strong", null, _toDisplayString$5(embySync.value.counts?.attention || 0), 1)
                ])
              ]),
              _createElementVNode$5("div", _hoisted_25$3, [
                _createVNode$5(_component_VSelect, {
                  modelValue: embySync.value.config.servers,
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((embySync.value.config.servers) = $event)),
                  items: embyServerItems.value,
                  multiple: "",
                  chips: "",
                  clearable: "",
                  label: "目标 Emby（留空表示全部）",
                  hint: "直接读取 MoviePilot 已配置的 Emby，不保存 API Key",
                  "persistent-hint": ""
                }, null, 8, ["modelValue", "items"]),
                _createVNode$5(_component_VSelect, {
                  modelValue: embySync.value.config.conflict_policy,
                  "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((embySync.value.config.conflict_policy) = $event)),
                  label: "已有不同 TmdbEg 时",
                  items: [{title:'安全跳过并报告冲突',value:'skip'},{title:'以当前维护规则覆盖',value:'overwrite'}],
                  hint: "默认不覆盖 Emby 中已有的人工选择",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode$5(_component_VTextField, {
                  modelValue: embySync.value.config.initial_delay_seconds,
                  "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((embySync.value.config.initial_delay_seconds) = $event)),
                  modelModifiers: { number: true },
                  type: "number",
                  min: "0",
                  max: "300",
                  label: "首次等待（秒）",
                  hint: "给 Emby 留出发现新文件的时间",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode$5(_component_VTextField, {
                  modelValue: embySync.value.config.retry_seconds,
                  "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((embySync.value.config.retry_seconds) = $event)),
                  modelModifiers: { number: true },
                  type: "number",
                  min: "10",
                  max: "600",
                  label: "重试间隔（秒）",
                  hint: "未扫描到 Series 时后台重试",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode$5(_component_VTextField, {
                  modelValue: embySync.value.config.max_wait_minutes,
                  "onUpdate:modelValue": _cache[23] || (_cache[23] = $event => ((embySync.value.config.max_wait_minutes) = $event)),
                  modelModifiers: { number: true },
                  type: "number",
                  min: "1",
                  max: "1440",
                  label: "最长等待（分钟）",
                  hint: "超时后保留任务供手动重试",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode$5(_component_VSwitch, {
                  modelValue: embySync.value.config.refresh_metadata,
                  "onUpdate:modelValue": _cache[24] || (_cache[24] = $event => ((embySync.value.config.refresh_metadata) = $event)),
                  color: "primary",
                  label: "写入后刷新 Series 元数据",
                  hint: "使神医按新剧集组重新刮削",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"])
              ]),
              _createElementVNode$5("div", _hoisted_26$3, [
                _cache[73] || (_cache[73] = _createElementVNode$5("div", { class: "flex-grow-1" }, [
                  _createElementVNode$5("div", { class: "font-weight-bold" }, "容器路径映射"),
                  _createElementVNode$5("div", { class: "text-caption text-medium-emphasis" }, "MP 与 Emby 看到的媒体路径相同时无需配置；不同时按最长前缀转换。")
                ], -1)),
                _createVNode$5(_component_VBtn, {
                  variant: "tonal",
                  "prepend-icon": "mdi-plus",
                  onClick: addPathMapping
                }, {
                  default: _withCtx$5(() => [...(_cache[72] || (_cache[72] = [
                    _createTextVNode$5("添加映射", -1)
                  ]))]),
                  _: 1
                })
              ]),
              (embySync.value.config.path_mappings?.length)
                ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_27$3, [
                    (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(embySync.value.config.path_mappings, (mapping, index) => {
                      return (_openBlock$5(), _createElementBlock$5("div", {
                        key: index,
                        class: "path-mapping-row"
                      }, [
                        _createVNode$5(_component_VSelect, {
                          modelValue: mapping.server,
                          "onUpdate:modelValue": $event => ((mapping.server) = $event),
                          label: "Emby",
                          items: [{title:'全部 Emby',value:'*'}, ...embyServerItems.value],
                          "hide-details": "",
                          density: "compact",
                          variant: "outlined"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                        _createVNode$5(_component_VTextField, {
                          modelValue: mapping.source,
                          "onUpdate:modelValue": $event => ((mapping.source) = $event),
                          label: "MP 路径前缀",
                          placeholder: "/media/TV",
                          "hide-details": "",
                          density: "compact",
                          variant: "outlined"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        _createVNode$5(_component_VIcon, {
                          icon: "mdi-arrow-right",
                          color: "medium-emphasis"
                        }),
                        _createVNode$5(_component_VTextField, {
                          modelValue: mapping.target,
                          "onUpdate:modelValue": $event => ((mapping.target) = $event),
                          label: "Emby 路径前缀",
                          placeholder: "/mnt/media/TV",
                          "hide-details": "",
                          density: "compact",
                          variant: "outlined"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        _createVNode$5(_component_VBtn, {
                          icon: "mdi-delete-outline",
                          color: "error",
                          variant: "text",
                          onClick: $event => (embySync.value.config.path_mappings.splice(index, 1))
                        }, null, 8, ["onClick"])
                      ]))
                    }), 128))
                  ]))
                : (_openBlock$5(), _createElementBlock$5("div", _hoisted_28$3, "未设置路径映射，将直接比较 MP 最终路径与 Emby Series 路径。"))
            ]),
            _: 1
          }),
          _createVNode$5(_component_VDivider),
          _createVNode$5(_component_VCardActions, { class: "pa-4" }, {
            default: _withCtx$5(() => [
              _createVNode$5(_component_VBtn, {
                variant: "text",
                "prepend-icon": "mdi-refresh",
                loading: embyLoading.value,
                onClick: _cache[25] || (_cache[25] = $event => (loadEmbySync(false)))
              }, {
                default: _withCtx$5(() => [...(_cache[74] || (_cache[74] = [
                  _createTextVNode$5("刷新状态", -1)
                ]))]),
                _: 1
              }, 8, ["loading"]),
              _createVNode$5(_component_VSpacer),
              _createVNode$5(_component_VBtn, {
                color: "primary",
                "prepend-icon": "mdi-content-save",
                loading: embySaving.value,
                onClick: saveEmbySync
              }, {
                default: _withCtx$5(() => [...(_cache[75] || (_cache[75] = [
                  _createTextVNode$5("保存联动设置", -1)
                ]))]),
                _: 1
              }, 8, ["loading"])
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      _createVNode$5(_component_VCard, {
        variant: "outlined",
        class: "normalizer-card mb-4"
      }, {
        default: _withCtx$5(() => [
          _createVNode$5(_component_VCardItem, null, {
            prepend: _withCtx$5(() => [
              _createVNode$5(_component_VAvatar, {
                color: "secondary",
                variant: "tonal"
              }, {
                default: _withCtx$5(() => [
                  _createVNode$5(_component_VIcon, { icon: "mdi-flask-outline" })
                ]),
                _: 1
              })
            ]),
            default: _withCtx$5(() => [
              _createVNode$5(_component_VCardTitle, null, {
                default: _withCtx$5(() => [...(_cache[76] || (_cache[76] = [
                  _createTextVNode$5("Series 定位试跑", -1)
                ]))]),
                _: 1
              }),
              _createVNode$5(_component_VCardSubtitle, null, {
                default: _withCtx$5(() => [...(_cache[77] || (_cache[77] = [
                  _createTextVNode$5("定位本身只读；出现同 TMDBID 歧义时，可确认将剧集组应用到全部候选", -1)
                ]))]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode$5(_component_VCardText, null, {
            default: _withCtx$5(() => [
              _createElementVNode$5("div", _hoisted_29$3, [
                _createVNode$5(_component_VSelect, {
                  modelValue: embyPreviewRule.value,
                  "onUpdate:modelValue": _cache[26] || (_cache[26] = $event => ((embyPreviewRule).value = $event)),
                  items: embyGroupRuleItems.value,
                  label: "剧集组维护规则",
                  "hide-details": ""
                }, null, 8, ["modelValue", "items"]),
                _createVNode$5(_component_VTextField, {
                  modelValue: embyPreviewPath.value,
                  "onUpdate:modelValue": _cache[27] || (_cache[27] = $event => ((embyPreviewPath).value = $event)),
                  label: "MP 整理后的实际文件路径",
                  placeholder: "/media/TV/作品/Season 02/E01.mkv",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$5(_component_VBtn, {
                  color: "secondary",
                  "prepend-icon": "mdi-radar",
                  loading: embyPreviewing.value,
                  disabled: !embyPreviewRule.value || !embyPreviewPath.value,
                  onClick: previewEmbySync
                }, {
                  default: _withCtx$5(() => [...(_cache[78] || (_cache[78] = [
                    _createTextVNode$5("开始定位", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              (embyPreview.value?.results)
                ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_30$3, [
                    (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(embyPreview.value.results, (result, server) => {
                      return (_openBlock$5(), _createBlock$5(_component_VCard, {
                        key: server,
                        variant: "outlined",
                        class: _normalizeClass$3(["sync-result-card", `sync-result-${embyResultColor(result.status)}`])
                      }, {
                        default: _withCtx$5(() => [
                          _createVNode$5(_component_VCardText, null, {
                            default: _withCtx$5(() => [
                              _createElementVNode$5("div", _hoisted_31$3, [
                                _createVNode$5(_component_VAvatar, {
                                  color: embyResultColor(result.status),
                                  variant: "tonal",
                                  size: "34"
                                }, {
                                  default: _withCtx$5(() => [
                                    _createVNode$5(_component_VIcon, {
                                      icon: result.status === 'ambiguous' ? 'mdi-source-branch' : result.status === 'updated' || result.status === 'already' ? 'mdi-check' : 'mdi-information-outline',
                                      size: "19"
                                    }, null, 8, ["icon"])
                                  ]),
                                  _: 2
                                }, 1032, ["color"]),
                                _createElementVNode$5("strong", null, _toDisplayString$5(server), 1),
                                _createVNode$5(_component_VChip, {
                                  size: "x-small",
                                  color: embyResultColor(result.status),
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$5(() => [
                                    _createTextVNode$5(_toDisplayString$5(embyResultText(result.status)), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["color"]),
                                _createVNode$5(_component_VSpacer),
                                (result.status === 'ambiguous' && Number(result.candidate_count || result.candidates?.length || 0) > 1)
                                  ? (_openBlock$5(), _createBlock$5(_component_VBtn, {
                                      key: 0,
                                      size: "small",
                                      color: "warning",
                                      variant: "tonal",
                                      "prepend-icon": "mdi-playlist-check",
                                      loading: embyApplyingAll.value === server,
                                      disabled: Boolean(embyApplyingAll.value) && embyApplyingAll.value !== server,
                                      onClick: $event => (applyAllEmbyCandidates(server, result))
                                    }, {
                                      default: _withCtx$5(() => [...(_cache[79] || (_cache[79] = [
                                        _createTextVNode$5("修改全部候选", -1)
                                      ]))]),
                                      _: 1
                                    }, 8, ["loading", "disabled", "onClick"]))
                                  : _createCommentVNode$5("", true)
                              ]),
                              _createElementVNode$5("div", _hoisted_32$3, _toDisplayString$5(result.reason), 1),
                              (result.mapped_target_path)
                                ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_33$3, [
                                    _cache[80] || (_cache[80] = _createElementVNode$5("span", null, "实际比较路径", -1)),
                                    _createElementVNode$5("code", null, _toDisplayString$5(result.mapped_target_path), 1)
                                  ]))
                                : _createCommentVNode$5("", true),
                              (result.item_name)
                                ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_34$3, _toDisplayString$5(result.item_name) + " · " + _toDisplayString$5(result.item_path || '路径未知'), 1))
                                : _createCommentVNode$5("", true),
                              (result.existing_group_id)
                                ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_35$3, "当前 TmdbEg：" + _toDisplayString$5(result.existing_group_id), 1))
                                : _createCommentVNode$5("", true),
                              (result.candidates?.length)
                                ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_36$3, [
                                    (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(result.candidates, (item) => {
                                      return (_openBlock$5(), _createElementBlock$5("div", {
                                        key: item.item_id
                                      }, [
                                        _createElementVNode$5("span", null, _toDisplayString$5(item.name), 1),
                                        _createElementVNode$5("code", null, _toDisplayString$5(item.path || '无路径'), 1)
                                      ]))
                                    }), 128))
                                  ]))
                                : _createCommentVNode$5("", true),
                              (Number(result.candidate_count || 0) > Number(result.candidates?.length || 0))
                                ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_37$3, " 共 " + _toDisplayString$5(result.candidate_count) + " 个候选，此处仅展示前 " + _toDisplayString$5(result.candidates?.length || 0) + " 个 ", 1))
                                : _createCommentVNode$5("", true),
                              (result.items?.length)
                                ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_38$3, [
                                    (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(result.items, (item) => {
                                      return (_openBlock$5(), _createElementBlock$5("div", {
                                        key: item.item_id
                                      }, [
                                        _createElementVNode$5("span", null, _toDisplayString$5(item.item_name) + " · " + _toDisplayString$5(embyResultText(item.status)), 1),
                                        _createElementVNode$5("code", null, _toDisplayString$5(item.item_path || '无路径'), 1)
                                      ]))
                                    }), 128))
                                  ]))
                                : _createCommentVNode$5("", true)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["class"]))
                    }), 128))
                  ]))
                : _createCommentVNode$5("", true)
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      _createVNode$5(_component_VCard, {
        variant: "outlined",
        class: "normalizer-card mb-4"
      }, {
        default: _withCtx$5(() => [
          _createVNode$5(_component_VCardItem, null, {
            prepend: _withCtx$5(() => [
              _createVNode$5(_component_VAvatar, {
                color: "success",
                variant: "tonal"
              }, {
                default: _withCtx$5(() => [
                  _createVNode$5(_component_VIcon, { icon: "mdi-progress-clock" })
                ]),
                _: 1
              })
            ]),
            append: _withCtx$5(() => [
              _createElementVNode$5("div", _hoisted_39$3, [
                _createVNode$5(_component_VBtn, {
                  variant: "text",
                  "prepend-icon": "mdi-replay",
                  disabled: !embySync.value.jobs?.length,
                  onClick: _cache[28] || (_cache[28] = $event => (retryEmbyJob()))
                }, {
                  default: _withCtx$5(() => [...(_cache[83] || (_cache[83] = [
                    _createTextVNode$5("重试未完成", -1)
                  ]))]),
                  _: 1
                }, 8, ["disabled"]),
                _createVNode$5(_component_VBtn, {
                  variant: "text",
                  color: "error",
                  "prepend-icon": "mdi-delete-sweep-outline",
                  onClick: _cache[29] || (_cache[29] = $event => (deleteEmbyJob()))
                }, {
                  default: _withCtx$5(() => [...(_cache[84] || (_cache[84] = [
                    _createTextVNode$5("清理已结束", -1)
                  ]))]),
                  _: 1
                })
              ])
            ]),
            default: _withCtx$5(() => [
              _createVNode$5(_component_VCardTitle, null, {
                default: _withCtx$5(() => [...(_cache[81] || (_cache[81] = [
                  _createTextVNode$5("联动任务", -1)
                ]))]),
                _: 1
              }),
              _createVNode$5(_component_VCardSubtitle, null, {
                default: _withCtx$5(() => [...(_cache[82] || (_cache[82] = [
                  _createTextVNode$5("任务持久保存，MoviePilot 重启后仍可继续重试", -1)
                ]))]),
                _: 1
              })
            ]),
            _: 1
          }),
          (embyLoading.value)
            ? (_openBlock$5(), _createBlock$5(_component_VProgressLinear, {
                key: 0,
                indeterminate: "",
                color: "primary"
              }))
            : _createCommentVNode$5("", true),
          (embySync.value.jobs?.length)
            ? (_openBlock$5(), _createBlock$5(_component_VCardText, {
                key: 1,
                class: "sync-job-list"
              }, {
                default: _withCtx$5(() => [
                  (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(embySync.value.jobs, (job) => {
                    return (_openBlock$5(), _createBlock$5(_component_VCard, {
                      key: job.id,
                      variant: "tonal",
                      class: "sync-job-card"
                    }, {
                      default: _withCtx$5(() => [
                        _createVNode$5(_component_VCardText, null, {
                          default: _withCtx$5(() => [
                            _createElementVNode$5("div", _hoisted_40$3, [
                              _createVNode$5(_component_VAvatar, {
                                color: embyResultColor(job.status),
                                variant: "tonal"
                              }, {
                                default: _withCtx$5(() => [
                                  _createVNode$5(_component_VIcon, {
                                    icon: job.status === 'completed' ? 'mdi-check' : job.status === 'pending' || job.status === 'running' ? 'mdi-clock-outline' : 'mdi-alert-outline'
                                  }, null, 8, ["icon"])
                                ]),
                                _: 2
                              }, 1032, ["color"]),
                              _createElementVNode$5("div", _hoisted_41$3, [
                                _createElementVNode$5("div", _hoisted_42$3, [
                                  _createElementVNode$5("strong", null, _toDisplayString$5(job.title), 1),
                                  _createVNode$5(_component_VChip, {
                                    size: "x-small",
                                    color: embyResultColor(job.status)
                                  }, {
                                    default: _withCtx$5(() => [
                                      _createTextVNode$5(_toDisplayString$5(embyResultText(job.status)), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["color"])
                                ]),
                                _createElementVNode$5("div", _hoisted_43$3, "TMDB " + _toDisplayString$5(job.tmdb_id) + " · TmdbEg " + _toDisplayString$5(job.episode_group_id) + " · 已尝试 " + _toDisplayString$5(job.attempts || 0) + " 次", 1),
                                _createElementVNode$5("div", _hoisted_44$3, _toDisplayString$5(job.reason), 1),
                                _createElementVNode$5("div", {
                                  class: "text-caption text-medium-emphasis text-truncate mt-1",
                                  title: job.target_path
                                }, _toDisplayString$5(job.target_path), 9, _hoisted_45$3),
                                (Object.keys(job.server_results || {}).length)
                                  ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_46$3, [
                                      (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(job.server_results, (result, server) => {
                                        return (_openBlock$5(), _createBlock$5(_component_VChip, {
                                          key: server,
                                          size: "x-small",
                                          color: embyResultColor(result.status),
                                          variant: "tonal",
                                          title: result.reason
                                        }, {
                                          default: _withCtx$5(() => [
                                            _createTextVNode$5(_toDisplayString$5(server) + " · " + _toDisplayString$5(embyResultText(result.status)), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["color", "title"]))
                                      }), 128))
                                    ]))
                                  : _createCommentVNode$5("", true)
                              ]),
                              _createElementVNode$5("div", _hoisted_47$3, [
                                _createVNode$5(_component_VBtn, {
                                  icon: "mdi-replay",
                                  variant: "text",
                                  title: "重新检查",
                                  onClick: $event => (retryEmbyJob(job.id))
                                }, null, 8, ["onClick"]),
                                _createVNode$5(_component_VBtn, {
                                  icon: "mdi-delete-outline",
                                  variant: "text",
                                  color: "error",
                                  title: "删除任务",
                                  onClick: $event => (deleteEmbyJob(job.id))
                                }, null, 8, ["onClick"])
                              ])
                            ])
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024))
                  }), 128))
                ]),
                _: 1
              }))
            : (_openBlock$5(), _createElementBlock$5("div", _hoisted_48$3, [
                _createVNode$5(_component_VIcon, {
                  icon: "mdi-server-network-off",
                  size: "48"
                }),
                _cache[85] || (_cache[85] = _createElementVNode$5("div", null, "尚无剧集组联动任务", -1)),
                _cache[86] || (_cache[86] = _createElementVNode$5("div", { class: "text-caption" }, "启用后，下一次实际使用剧集组规则整理时会自动建立任务。", -1))
              ]))
        ]),
        _: 1
      })
    ], 512), [
      [_vShow$2, subModule.value === 'emby']
    ]),
    _createVNode$5(_component_VDialog, {
      modelValue: manualDialog.value,
      "onUpdate:modelValue": _cache[37] || (_cache[37] = $event => ((manualDialog).value = $event)),
      "max-width": "620"
    }, {
      default: _withCtx$5(() => [
        _createVNode$5(_component_VCard, null, {
          default: _withCtx$5(() => [
            _createVNode$5(_component_VCardItem, null, {
              append: _withCtx$5(() => [
                _createVNode$5(_component_VBtn, {
                  icon: "mdi-close",
                  variant: "text",
                  onClick: _cache[30] || (_cache[30] = $event => (manualDialog.value = false))
                })
              ]),
              default: _withCtx$5(() => [
                _createVNode$5(_component_VCardTitle, null, {
                  default: _withCtx$5(() => [...(_cache[87] || (_cache[87] = [
                    _createTextVNode$5("手动添加维护规则", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$5(_component_VCardSubtitle, null, {
                  default: _withCtx$5(() => [...(_cache[88] || (_cache[88] = [
                    _createTextVNode$5("适用于季度看板中没有收录的电视剧或动画", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$5(_component_VDivider),
            _createVNode$5(_component_VCardText, { class: "manual-rule-form" }, {
              default: _withCtx$5(() => [
                (manualMessage.value)
                  ? (_openBlock$5(), _createBlock$5(_component_VAlert, {
                      key: 0,
                      type: "warning",
                      variant: "tonal",
                      density: "compact",
                      class: "mb-4"
                    }, {
                      default: _withCtx$5(() => [
                        _createTextVNode$5(_toDisplayString$5(manualMessage.value), 1)
                      ]),
                      _: 1
                    }))
                  : _createCommentVNode$5("", true),
                _createVNode$5(_component_VTextField, {
                  modelValue: manualForm.value.tmdb_id,
                  "onUpdate:modelValue": _cache[31] || (_cache[31] = $event => ((manualForm.value.tmdb_id) = $event)),
                  modelModifiers: { number: true },
                  label: "TMDBID",
                  type: "number",
                  "prepend-inner-icon": "mdi-database-search",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$5(_component_VSelect, {
                  modelValue: manualForm.value.preference,
                  "onUpdate:modelValue": _cache[32] || (_cache[32] = $event => ((manualForm.value.preference) = $event)),
                  label: "目标编集",
                  items: [{title:'使用 TMDB 默认编集',value:'default'},{title:'优先 Production/Season 剧集组',value:'group_preferred'}],
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$5(_component_VSwitch, {
                  modelValue: manualForm.value.specify_quarter,
                  "onUpdate:modelValue": _cache[33] || (_cache[33] = $event => ((manualForm.value.specify_quarter) = $event)),
                  label: "手动指定归属季度",
                  color: "primary",
                  "hide-details": "",
                  class: "mb-3"
                }, null, 8, ["modelValue"]),
                (manualForm.value.specify_quarter)
                  ? (_openBlock$5(), _createBlock$5(_component_VRow, {
                      key: 1,
                      dense: ""
                    }, {
                      default: _withCtx$5(() => [
                        _createVNode$5(_component_VCol, { cols: "7" }, {
                          default: _withCtx$5(() => [
                            _createVNode$5(_component_VSelect, {
                              modelValue: manualForm.value.year,
                              "onUpdate:modelValue": _cache[34] || (_cache[34] = $event => ((manualForm.value.year) = $event)),
                              items: _unref$2(years),
                              label: "年份"
                            }, null, 8, ["modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        _createVNode$5(_component_VCol, { cols: "5" }, {
                          default: _withCtx$5(() => [
                            _createVNode$5(_component_VSelect, {
                              modelValue: manualForm.value.quarter,
                              "onUpdate:modelValue": _cache[35] || (_cache[35] = $event => ((manualForm.value.quarter) = $event)),
                              items: [1,2,3,4].map(value => ({title:`Q${value}`,value})),
                              label: "季度"
                            }, null, 8, ["modelValue", "items"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }))
                  : _createCommentVNode$5("", true),
                _cache[89] || (_cache[89] = _createElementVNode$5("div", { class: "text-caption text-medium-emphasis" }, " 不指定时会根据 TMDB 最新有效季的首播日期自动归类；TMDB 缺少日期时会提示补充。 ", -1))
              ]),
              _: 1
            }),
            _createVNode$5(_component_VDivider),
            _createVNode$5(_component_VCardActions, { class: "pa-4" }, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VSpacer),
                _createVNode$5(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[36] || (_cache[36] = $event => (manualDialog.value = false))
                }, {
                  default: _withCtx$5(() => [...(_cache[90] || (_cache[90] = [
                    _createTextVNode$5("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$5(_component_VBtn, {
                  color: "primary",
                  loading: manualLoading.value,
                  disabled: !manualForm.value.tmdb_id,
                  onClick: manualAddRule
                }, {
                  default: _withCtx$5(() => [...(_cache[91] || (_cache[91] = [
                    _createTextVNode$5("读取并加入", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$5(_component_VDialog, {
      modelValue: deleteRulesDialog.value,
      "onUpdate:modelValue": _cache[39] || (_cache[39] = $event => ((deleteRulesDialog).value = $event)),
      "max-width": "520"
    }, {
      default: _withCtx$5(() => [
        _createVNode$5(_component_VCard, null, {
          default: _withCtx$5(() => [
            _createVNode$5(_component_VCardItem, null, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VCardTitle, null, {
                  default: _withCtx$5(() => [...(_cache[92] || (_cache[92] = [
                    _createTextVNode$5("删除当前筛选结果？", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$5(_component_VCardSubtitle, null, {
                  default: _withCtx$5(() => [
                    _createTextVNode$5("将删除 " + _toDisplayString$5(filteredRules.value.length) + " 条维护规则，季度看板数据不会被删除", 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$5(_component_VCardText, null, {
              default: _withCtx$5(() => [...(_cache[93] || (_cache[93] = [
                _createTextVNode$5("此操作会立即停止这些 TMDB 条目的集数偏移，请确认当前季度和搜索条件正确。", -1)
              ]))]),
              _: 1
            }),
            _createVNode$5(_component_VCardActions, { class: "pa-4" }, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VSpacer),
                _createVNode$5(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[38] || (_cache[38] = $event => (deleteRulesDialog.value = false))
                }, {
                  default: _withCtx$5(() => [...(_cache[94] || (_cache[94] = [
                    _createTextVNode$5("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$5(_component_VBtn, {
                  color: "error",
                  loading: deleteRulesLoading.value,
                  onClick: deleteFilteredRules
                }, {
                  default: _withCtx$5(() => [...(_cache[95] || (_cache[95] = [
                    _createTextVNode$5("确认删除", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$5(_component_VDialog, {
      modelValue: editorOpen.value,
      "onUpdate:modelValue": _cache[46] || (_cache[46] = $event => ((editorOpen).value = $event)),
      "max-width": "820",
      scrollable: ""
    }, {
      default: _withCtx$5(() => [
        (editForm.value)
          ? (_openBlock$5(), _createBlock$5(_component_VCard, { key: 0 }, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VCardItem, null, {
                  append: _withCtx$5(() => [
                    _createVNode$5(_component_VBtn, {
                      icon: "mdi-close",
                      variant: "text",
                      onClick: _cache[40] || (_cache[40] = $event => (editorOpen.value = false))
                    })
                  ]),
                  default: _withCtx$5(() => [
                    _createVNode$5(_component_VCardTitle, null, {
                      default: _withCtx$5(() => [...(_cache[96] || (_cache[96] = [
                        _createTextVNode$5("编辑维护规则", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$5(_component_VCardSubtitle, null, {
                      default: _withCtx$5(() => [
                        _createTextVNode$5(_toDisplayString$5(editForm.value.title) + " · TMDB " + _toDisplayString$5(editForm.value.tmdb_id), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$5(_component_VDivider),
                _createVNode$5(_component_VCardText, null, {
                  default: _withCtx$5(() => [
                    _createElementVNode$5("div", _hoisted_49$3, [
                      _createVNode$5(_component_VSwitch, {
                        modelValue: editForm.value.enabled,
                        "onUpdate:modelValue": _cache[41] || (_cache[41] = $event => ((editForm.value.enabled) = $event)),
                        label: "启用规则",
                        color: "success",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode$5(_component_VSpacer),
                      _createVNode$5(_component_VBtn, {
                        variant: "tonal",
                        "prepend-icon": "mdi-refresh",
                        loading: editorLoading.value,
                        onClick: inspectTarget
                      }, {
                        default: _withCtx$5(() => [...(_cache[97] || (_cache[97] = [
                          _createTextVNode$5("刷新编集", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _createElementVNode$5("div", _hoisted_50$2, [
                      _createVNode$5(_component_VTextField, {
                        modelValue: editForm.value.tmdb_id,
                        "onUpdate:modelValue": _cache[42] || (_cache[42] = $event => ((editForm.value.tmdb_id) = $event)),
                        modelModifiers: { number: true },
                        label: "TMDBID",
                        type: "number",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode$5(_component_VBtn, {
                        variant: "tonal",
                        "prepend-icon": "mdi-database-search",
                        loading: editorLoading.value,
                        onClick: inspectTarget
                      }, {
                        default: _withCtx$5(() => [...(_cache[98] || (_cache[98] = [
                          _createTextVNode$5("读取并校验", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    (Number(editForm.value.original_tmdb_id) !== Number(editForm.value.tmdb_id))
                      ? (_openBlock$5(), _createBlock$5(_component_VAlert, {
                          key: 0,
                          type: "warning",
                          variant: "tonal",
                          density: "compact",
                          class: "mb-4"
                        }, {
                          default: _withCtx$5(() => [
                            _createTextVNode$5("保存后将用 TMDB " + _toDisplayString$5(editForm.value.tmdb_id) + " 替换原规则 TMDB " + _toDisplayString$5(editForm.value.original_tmdb_id), 1)
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$5("", true),
                    (inspection.value?.recommendation)
                      ? (_openBlock$5(), _createBlock$5(_component_VAlert, {
                          key: 1,
                          type: "info",
                          variant: "tonal",
                          density: "compact",
                          class: "mb-3"
                        }, {
                          default: _withCtx$5(() => [
                            _createElementVNode$5("div", _hoisted_51$2, [
                              _createElementVNode$5("span", _hoisted_52$2, [
                                _createElementVNode$5("strong", null, "智能建议：" + _toDisplayString$5(inspection.value.recommendation.target_type === 'group' ? '剧集组' : 'TMDB 默认编集'), 1),
                                _createTextVNode$5(" · " + _toDisplayString$5(inspection.value.recommendation.reason), 1)
                              ]),
                              _createVNode$5(_component_VBtn, {
                                size: "small",
                                variant: "tonal",
                                onClick: applyTargetRecommendation
                              }, {
                                default: _withCtx$5(() => [...(_cache[99] || (_cache[99] = [
                                  _createTextVNode$5("采用建议", -1)
                                ]))]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$5("", true),
                    _createVNode$5(_component_VRadioGroup, {
                      modelValue: editForm.value.target_type,
                      "onUpdate:modelValue": _cache[43] || (_cache[43] = $event => ((editForm.value.target_type) = $event)),
                      "hide-details": ""
                    }, {
                      default: _withCtx$5(() => [
                        _createVNode$5(_component_VRadio, {
                          value: "default",
                          label: "TMDB 默认编集"
                        }),
                        _createVNode$5(_component_VRadio, {
                          value: "group",
                          label: "TMDB 剧集组"
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    (editForm.value.target_type === 'group')
                      ? (_openBlock$5(), _createBlock$5(_component_VSelect, {
                          key: 2,
                          modelValue: editForm.value.episode_group_id,
                          "onUpdate:modelValue": _cache[44] || (_cache[44] = $event => ((editForm.value.episode_group_id) = $event)),
                          class: "mt-3",
                          items: (inspection.value?.groups || []).map(group => ({ title: `${group.recommended ? '推荐 · ' : ''}${group.name} · ${groupType(group.type)} · ${group.episode_count} 集`, value: group.id })),
                          label: "目标剧集组"
                        }, null, 8, ["modelValue", "items"]))
                      : _createCommentVNode$5("", true),
                    (selectedGroup.value)
                      ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_53$2, [
                          _createElementVNode$5("div", _hoisted_54$2, [
                            _cache[101] || (_cache[101] = _createElementVNode$5("strong", null, "分季预览", -1)),
                            _createVNode$5(_component_VChip, {
                              size: "x-small",
                              variant: "tonal"
                            }, {
                              default: _withCtx$5(() => [
                                _createTextVNode$5(_toDisplayString$5(selectedGroup.value.seasons?.filter(item => !item.is_special).length || 0) + " 个常规季", 1)
                              ]),
                              _: 1
                            }),
                            (selectedGroup.value.seasons?.some(item => item.is_special))
                              ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                  key: 0,
                                  size: "x-small",
                                  color: "secondary",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$5(() => [...(_cache[100] || (_cache[100] = [
                                    _createTextVNode$5("包含 Special", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode$5("", true),
                            (selectedGroup.value.coverage)
                              ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                  key: 1,
                                  size: "x-small",
                                  variant: "outlined"
                                }, {
                                  default: _withCtx$5(() => [
                                    _createTextVNode$5("正片覆盖 " + _toDisplayString$5(selectedGroup.value.coverage) + "%", 1)
                                  ]),
                                  _: 1
                                }))
                              : _createCommentVNode$5("", true)
                          ]),
                          _createElementVNode$5("div", _hoisted_55$2, [
                            (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(selectedGroup.value.seasons || [], (season) => {
                              return (_openBlock$5(), _createElementBlock$5("div", {
                                key: season.season,
                                class: _normalizeClass$3(['group-season-item', { special: season.is_special }])
                              }, [
                                _createElementVNode$5("div", _hoisted_56$2, [
                                  _createElementVNode$5("strong", null, "S" + _toDisplayString$5(String(season.season).padStart(2, '0')), 1),
                                  (season.is_special)
                                    ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                                        key: 0,
                                        size: "x-small",
                                        color: "secondary"
                                      }, {
                                        default: _withCtx$5(() => [...(_cache[102] || (_cache[102] = [
                                          _createTextVNode$5("Special", -1)
                                        ]))]),
                                        _: 1
                                      }))
                                    : _createCommentVNode$5("", true),
                                  _createElementVNode$5("span", _hoisted_57$2, _toDisplayString$5(season.name), 1)
                                ]),
                                _createElementVNode$5("div", _hoisted_58$2, _toDisplayString$5(season.episode_count) + " 集 · E" + _toDisplayString$5(String(season.first_episode || 1).padStart(2, '0')) + "–E" + _toDisplayString$5(String(season.last_episode || season.episode_count).padStart(2, '0')), 1),
                                (season.first_air_date || season.last_air_date)
                                  ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_59$2, [
                                      _createTextVNode$5(_toDisplayString$5(season.first_air_date || '日期未知'), 1),
                                      (season.last_air_date && season.last_air_date !== season.first_air_date)
                                        ? (_openBlock$5(), _createElementBlock$5("span", _hoisted_60$2, " → " + _toDisplayString$5(season.last_air_date), 1))
                                        : _createCommentVNode$5("", true)
                                    ]))
                                  : _createCommentVNode$5("", true)
                              ], 2))
                            }), 128))
                          ])
                        ]))
                      : _createCommentVNode$5("", true),
                    _createElementVNode$5("div", _hoisted_61$2, [
                      _cache[104] || (_cache[104] = _createElementVNode$5("strong", null, "季度片段", -1)),
                      _createVNode$5(_component_VSpacer),
                      _createVNode$5(_component_VBtn, {
                        size: "small",
                        variant: "tonal",
                        "prepend-icon": "mdi-plus",
                        onClick: addInstallment
                      }, {
                        default: _withCtx$5(() => [...(_cache[103] || (_cache[103] = [
                          _createTextVNode$5("添加", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _createVNode$5(_component_VExpansionPanels, { variant: "accordion" }, {
                      default: _withCtx$5(() => [
                        (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(editForm.value.installments, (item, index) => {
                          return (_openBlock$5(), _createBlock$5(_component_VExpansionPanel, {
                            key: item.id || index
                          }, {
                            default: _withCtx$5(() => [
                              _createVNode$5(_component_VExpansionPanelTitle, null, {
                                default: _withCtx$5(() => [
                                  _createTextVNode$5(_toDisplayString$5(item.title || `季度片段 ${index + 1}`) + " · S" + _toDisplayString$5(item.target_start_season) + "E" + _toDisplayString$5(item.target_start_episode), 1)
                                ]),
                                _: 2
                              }, 1024),
                              _createVNode$5(_component_VExpansionPanelText, null, {
                                default: _withCtx$5(() => [
                                  _createVNode$5(_component_VRow, { dense: "" }, {
                                    default: _withCtx$5(() => [
                                      _createVNode$5(_component_VCol, {
                                        cols: "12",
                                        sm: "6"
                                      }, {
                                        default: _withCtx$5(() => [
                                          _createVNode$5(_component_VTextField, {
                                            modelValue: item.title,
                                            "onUpdate:modelValue": $event => ((item.title) = $event),
                                            label: "片段名称"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$5(_component_VCol, {
                                        cols: "12",
                                        sm: "3"
                                      }, {
                                        default: _withCtx$5(() => [
                                          _createVNode$5(_component_VTextField, {
                                            modelValue: item.quarter,
                                            "onUpdate:modelValue": $event => ((item.quarter) = $event),
                                            label: "季度"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$5(_component_VCol, {
                                        cols: "12",
                                        sm: "3"
                                      }, {
                                        default: _withCtx$5(() => [
                                          _createVNode$5(_component_VTextField, {
                                            modelValue: item.source_season,
                                            "onUpdate:modelValue": $event => ((item.source_season) = $event),
                                            label: "来源季",
                                            type: "number"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$5(_component_VCol, { cols: "12" }, {
                                        default: _withCtx$5(() => [
                                          _createVNode$5(_component_VTextarea, {
                                            modelValue: item.aliases,
                                            "onUpdate:modelValue": $event => ((item.aliases) = $event),
                                            label: "命中别名（每行一个）",
                                            rows: "2",
                                            "auto-grow": ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$5(_component_VCol, {
                                        cols: "12",
                                        sm: "4"
                                      }, {
                                        default: _withCtx$5(() => [
                                          _createVNode$5(_component_VTextField, {
                                            modelValue: item.source_start_episode,
                                            "onUpdate:modelValue": $event => ((item.source_start_episode) = $event),
                                            label: "来源起始集（留空自动）",
                                            type: "number",
                                            hint: "累计编号拆入 Special 时会按 Episode ID 自动推导",
                                            "persistent-hint": ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$5(_component_VCol, {
                                        cols: "6",
                                        sm: "4"
                                      }, {
                                        default: _withCtx$5(() => [
                                          _createVNode$5(_component_VTextField, {
                                            modelValue: item.target_start_season,
                                            "onUpdate:modelValue": $event => ((item.target_start_season) = $event),
                                            label: "目标起始季",
                                            type: "number"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$5(_component_VCol, {
                                        cols: "6",
                                        sm: "4"
                                      }, {
                                        default: _withCtx$5(() => [
                                          _createVNode$5(_component_VTextField, {
                                            modelValue: item.target_start_episode,
                                            "onUpdate:modelValue": $event => ((item.target_start_episode) = $event),
                                            label: "目标起始集",
                                            type: "number"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  _createVNode$5(_component_VBtn, {
                                    color: "error",
                                    variant: "text",
                                    "prepend-icon": "mdi-delete-outline",
                                    onClick: $event => (editForm.value.installments.splice(index, 1))
                                  }, {
                                    default: _withCtx$5(() => [...(_cache[105] || (_cache[105] = [
                                      _createTextVNode$5("删除片段", -1)
                                    ]))]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024))
                        }), 128))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$5(_component_VDivider),
                _createVNode$5(_component_VCardActions, { class: "pa-4" }, {
                  default: _withCtx$5(() => [
                    _createVNode$5(_component_VSpacer),
                    _createVNode$5(_component_VBtn, {
                      variant: "text",
                      onClick: _cache[45] || (_cache[45] = $event => (editorOpen.value = false))
                    }, {
                      default: _withCtx$5(() => [...(_cache[106] || (_cache[106] = [
                        _createTextVNode$5("取消", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$5(_component_VBtn, {
                      color: "primary",
                      loading: editorLoading.value,
                      onClick: saveRule
                    }, {
                      default: _withCtx$5(() => [...(_cache[107] || (_cache[107] = [
                        _createTextVNode$5("保存规则", -1)
                      ]))]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : _createCommentVNode$5("", true)
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$5(_component_VDialog, {
      modelValue: failureDialog.value,
      "onUpdate:modelValue": _cache[48] || (_cache[48] = $event => ((failureDialog).value = $event)),
      "max-width": "720"
    }, {
      default: _withCtx$5(() => [
        _createVNode$5(_component_VCard, null, {
          default: _withCtx$5(() => [
            _createVNode$5(_component_VCardItem, null, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VCardTitle, null, {
                  default: _withCtx$5(() => [...(_cache[108] || (_cache[108] = [
                    _createTextVNode$5("这些番剧未能自动匹配", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$5(_component_VCardSubtitle, null, {
                  default: _withCtx$5(() => [...(_cache[109] || (_cache[109] = [
                    _createTextVNode$5("补充正确 TMDBID 后重试，或直接放弃该条目", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$5(_component_VDivider),
            _createVNode$5(_component_VList, { lines: "three" }, {
              default: _withCtx$5(() => [
                (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$4(failures.value, (failure) => {
                  return (_openBlock$5(), _createBlock$5(_component_VListItem, {
                    key: failure.id,
                    title: failure.title,
                    subtitle: failure.reason
                  }, {
                    append: _withCtx$5(() => [
                      _createElementVNode$5("div", _hoisted_62$2, [
                        _createVNode$5(_component_VTextField, {
                          modelValue: manualTmdb.value[failure.id],
                          "onUpdate:modelValue": $event => ((manualTmdb.value[failure.id]) = $event),
                          label: "TMDBID",
                          type: "number",
                          "hide-details": "",
                          density: "compact"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        _createVNode$5(_component_VBtn, {
                          color: "primary",
                          variant: "tonal",
                          loading: busyId.value === failure.id,
                          onClick: $event => (retryFailure(failure))
                        }, {
                          default: _withCtx$5(() => [...(_cache[110] || (_cache[110] = [
                            _createTextVNode$5("补充并加入", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading", "onClick"]),
                        _createVNode$5(_component_VBtn, {
                          variant: "text",
                          color: "medium-emphasis",
                          onClick: $event => (ignoreFailure(failure))
                        }, {
                          default: _withCtx$5(() => [...(_cache[111] || (_cache[111] = [
                            _createTextVNode$5("忽略", -1)
                          ]))]),
                          _: 1
                        }, 8, ["onClick"])
                      ])
                    ]),
                    _: 2
                  }, 1032, ["title", "subtitle"]))
                }), 128))
              ]),
              _: 1
            }),
            _createVNode$5(_component_VCardActions, null, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VSpacer),
                _createVNode$5(_component_VBtn, {
                  onClick: _cache[47] || (_cache[47] = $event => (failureDialog.value = false))
                }, {
                  default: _withCtx$5(() => [...(_cache[112] || (_cache[112] = [
                    _createTextVNode$5("关闭", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$5(_component_VSnackbar, {
      modelValue: snackbar.value,
      "onUpdate:modelValue": _cache[49] || (_cache[49] = $event => ((snackbar).value = $event)),
      color: snackbarColor.value,
      timeout: "5000"
    }, {
      default: _withCtx$5(() => [
        _createTextVNode$5(_toDisplayString$5(notice.value), 1)
      ]),
      _: 1
    }, 8, ["modelValue", "color"])
  ]))
}
}

};
const EpisodeNormalizer = /*#__PURE__*/_export_sfc(_sfc_main$5, [['__scopeId',"data-v-b763ccf2"]]);

const {resolveComponent:_resolveComponent$4,mergeProps:_mergeProps$2,createVNode:_createVNode$4,withCtx:_withCtx$4,openBlock:_openBlock$4,createBlock:_createBlock$4,createCommentVNode:_createCommentVNode$4,toDisplayString:_toDisplayString$4,createTextVNode:_createTextVNode$4,createElementVNode:_createElementVNode$4,Fragment:_Fragment$4,createElementBlock:_createElementBlock$4} = await importShared('vue');


const _hoisted_1$4 = { class: "file-tree-box" };
const _hoisted_2$4 = { class: "selected-path" };

const {computed: computed$4,onMounted: onMounted$4,ref: ref$4,watch: watch$2} = await importShared('vue');


const _sfc_main$4 = {
  __name: 'MediaFilePicker',
  props: {
  api: { type: Object, default: () => ({}) },
  modelValue: { type: String, default: '' },
  compact: { type: Boolean, default: false },
  buttonLabel: { type: String, default: '浏览文件' },
},
  emits: ['update:modelValue'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;

const dialog = ref$4(false);
const loading = ref$4(false);
const error = ref$4('');
const emptyNotice = ref$4('');
const storage = ref$4('local');
const storages = ref$4([{ title: '本地存储', value: 'local' }]);
const treeItems = ref$4([]);
const openedItems = ref$4([]);
const activatedItems = ref$4([]);
const mediaExtensions = new Set(['mkv', 'mp4', 'avi', 'mov', 'ts', 'm2ts', 'webm', 'flv', 'wmv', 'mpg', 'mpeg']);
let treeEpoch = 0;

const selectedItem = computed$4(() => activatedItems.value[0]?.raw || activatedItems.value[0] || null);
const selectedPath = computed$4(() => selectedItem.value?.type === 'file' ? selectedItem.value.path : '');

function rootItem() {
  // fileid 与官方文件管理器保持一致，部分网盘存储按 ID 定位根目录
  return { name: '/', basename: '/', path: '/', storage: storage.value, type: 'dir', fileid: 'root', children: [] }
}

function normalizeList(response) {
  if (response === undefined || response === null) throw new Error('存储接口无响应')
  const value = unwrapResponse(response);
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.value)) return value.value
  if (Array.isArray(response?.data?.value)) return response.data.value
  return []
}

function isMediaFile(item) {
  if (item?.type !== 'file') return false
  const name = String(item.name || item.basename || item.path || '');
  return mediaExtensions.has(name.split('.').pop()?.toLowerCase())
}

async function fetchChildren(item) {
  if (!item || item.type !== 'dir' || item.__loaded) return
  item.__loaded = true;
  try {
    const children = normalizeList(await props.api.post('/storage/list?sort=name', item))
      .filter(child => child?.type === 'dir' || isMediaFile(child))
      .map(child => {
        if (child.type === 'dir') return { ...child, children: [], __loaded: false }
        // 接口返回的 FileItem 自带 children: []，会让树把文件当成可展开分组而无法选中，必须剥掉
        const { children: _ignored, ...file } = child;
        return file
      });
    item.children.splice(0, item.children.length, ...children);
  } catch (err) {
    item.__loaded = false;
    error.value = err?.message || '目录读取失败';
  }
}

async function loadStorages() {
  try {
    const response = await props.api.get('system/setting/public/Storages');
    const value = response?.data?.value || unwrapResponse(response)?.value || unwrapResponse(response);
    if (Array.isArray(value) && value.length) {
      storages.value = value.map(item => ({ title: item.name || item.type, value: item.type }));
      if (!storages.value.some(item => item.value === storage.value)) storage.value = storages.value[0].value;
    }
  } catch (_) { /* 保留本地存储兜底 */ }
}

async function resetTree() {
  // 切换存储会并发触发 resetTree，晚返回的旧请求不能覆盖新树的展开状态
  const epoch = ++treeEpoch;
  error.value = '';
  emptyNotice.value = '';
  activatedItems.value = [];
  openedItems.value = [];
  treeItems.value = [rootItem()];
  // 必须从 ref 取回响应式代理再填充 children；
  // 直接改原始对象不会触发树的重新渲染，且 __loaded 会挡住后续点击重试。
  const root = treeItems.value[0];
  loading.value = true;
  await fetchChildren(root);
  if (epoch !== treeEpoch) return
  openedItems.value = [root];
  loading.value = false;
  if (!error.value && !root.children.length) {
    // MP 后端在存储浏览失败时也会返回空列表（HTTP 200），这里必须给出反馈
    emptyNotice.value = '该存储根目录未返回任何内容：存储可能未就绪、无访问权限或后端浏览失败，请检查 MoviePilot 日志。';
  }
}

async function openPicker() {
  dialog.value = true;
  await loadStorages();
  await resetTree();
}

function chooseFile() {
  if (!selectedPath.value) return
  emit('update:modelValue', selectedPath.value);
  dialog.value = false;
}

watch$2(storage, () => { if (dialog.value) resetTree(); });
onMounted$4(loadStorages);

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent$4("VBtn");
  const _component_VTooltip = _resolveComponent$4("VTooltip");
  const _component_VIcon = _resolveComponent$4("VIcon");
  const _component_VAvatar = _resolveComponent$4("VAvatar");
  const _component_VCardTitle = _resolveComponent$4("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$4("VCardSubtitle");
  const _component_VCardItem = _resolveComponent$4("VCardItem");
  const _component_VDivider = _resolveComponent$4("VDivider");
  const _component_VSelect = _resolveComponent$4("VSelect");
  const _component_VAlert = _resolveComponent$4("VAlert");
  const _component_VProgressLinear = _resolveComponent$4("VProgressLinear");
  const _component_VTreeview = _resolveComponent$4("VTreeview");
  const _component_VCardText = _resolveComponent$4("VCardText");
  const _component_VSpacer = _resolveComponent$4("VSpacer");
  const _component_VCardActions = _resolveComponent$4("VCardActions");
  const _component_VCard = _resolveComponent$4("VCard");
  const _component_VDialog = _resolveComponent$4("VDialog");

  return (_openBlock$4(), _createElementBlock$4(_Fragment$4, null, [
    (__props.compact)
      ? (_openBlock$4(), _createBlock$4(_component_VTooltip, {
          key: 0,
          text: __props.buttonLabel,
          location: "top"
        }, {
          activator: _withCtx$4(({ props: tip }) => [
            _createVNode$4(_component_VBtn, _mergeProps$2(tip, {
              icon: "mdi-folder-search-outline",
              variant: "tonal",
              color: "secondary",
              size: "large",
              "aria-label": __props.buttonLabel,
              onClick: openPicker
            }), null, 16, ["aria-label"])
          ]),
          _: 1
        }, 8, ["text"]))
      : (_openBlock$4(), _createBlock$4(_component_VBtn, {
          key: 1,
          variant: "tonal",
          color: "secondary",
          "prepend-icon": "mdi-folder-search-outline",
          onClick: openPicker
        }, {
          default: _withCtx$4(() => [
            _createTextVNode$4(_toDisplayString$4(__props.buttonLabel), 1)
          ]),
          _: 1
        })),
    _createVNode$4(_component_VDialog, {
      modelValue: dialog.value,
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((dialog).value = $event)),
      "max-width": "760"
    }, {
      default: _withCtx$4(() => [
        _createVNode$4(_component_VCard, null, {
          default: _withCtx$4(() => [
            _createVNode$4(_component_VCardItem, null, {
              prepend: _withCtx$4(() => [
                _createVNode$4(_component_VAvatar, {
                  color: "secondary",
                  variant: "tonal"
                }, {
                  default: _withCtx$4(() => [
                    _createVNode$4(_component_VIcon, { icon: "mdi-file-tree-outline" })
                  ]),
                  _: 1
                })
              ]),
              default: _withCtx$4(() => [
                _createVNode$4(_component_VCardTitle, null, {
                  default: _withCtx$4(() => [...(_cache[5] || (_cache[5] = [
                    _createTextVNode$4("选择容器内媒体文件", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$4(_component_VCardSubtitle, null, {
                  default: _withCtx$4(() => [...(_cache[6] || (_cache[6] = [
                    _createTextVNode$4("使用 MoviePilot 的存储接口浏览；仅显示目录和常见视频文件。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$4(_component_VDivider),
            _createVNode$4(_component_VCardText, { class: "file-picker-body" }, {
              default: _withCtx$4(() => [
                _createVNode$4(_component_VSelect, {
                  modelValue: storage.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((storage).value = $event)),
                  items: storages.value,
                  label: "MoviePilot 存储",
                  "hide-details": ""
                }, null, 8, ["modelValue", "items"]),
                (error.value)
                  ? (_openBlock$4(), _createBlock$4(_component_VAlert, {
                      key: 0,
                      type: "error",
                      variant: "tonal",
                      density: "compact"
                    }, {
                      default: _withCtx$4(() => [
                        _createTextVNode$4(_toDisplayString$4(error.value), 1)
                      ]),
                      _: 1
                    }))
                  : (emptyNotice.value)
                    ? (_openBlock$4(), _createBlock$4(_component_VAlert, {
                        key: 1,
                        type: "info",
                        variant: "tonal",
                        density: "compact"
                      }, {
                        default: _withCtx$4(() => [
                          _createTextVNode$4(_toDisplayString$4(emptyNotice.value), 1)
                        ]),
                        _: 1
                      }))
                    : _createCommentVNode$4("", true),
                (loading.value)
                  ? (_openBlock$4(), _createBlock$4(_component_VProgressLinear, {
                      key: 2,
                      indeterminate: "",
                      color: "secondary"
                    }))
                  : _createCommentVNode$4("", true),
                _createElementVNode$4("div", _hoisted_1$4, [
                  _createVNode$4(_component_VTreeview, {
                    activated: activatedItems.value,
                    "onUpdate:activated": _cache[1] || (_cache[1] = $event => ((activatedItems).value = $event)),
                    opened: openedItems.value,
                    "onUpdate:opened": _cache[2] || (_cache[2] = $event => ((openedItems).value = $event)),
                    items: treeItems.value,
                    "load-children": fetchChildren,
                    "item-key": "path",
                    "item-title": "name",
                    "item-value": "path",
                    activatable: "",
                    "return-object": "",
                    "open-on-click": ""
                  }, {
                    prepend: _withCtx$4(({ item }) => [
                      _createVNode$4(_component_VIcon, {
                        icon: (item.raw?.type || item.type) === 'dir' ? 'mdi-folder-outline' : 'mdi-file-video-outline',
                        size: "18"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["activated", "opened", "items"])
                ]),
                _createElementVNode$4("div", _hoisted_2$4, [
                  _cache[7] || (_cache[7] = _createElementVNode$4("span", null, "已选择", -1)),
                  _createElementVNode$4("code", null, _toDisplayString$4(selectedPath.value || '请在目录树中选择一个媒体文件'), 1)
                ])
              ]),
              _: 1
            }),
            _createVNode$4(_component_VDivider),
            _createVNode$4(_component_VCardActions, null, {
              default: _withCtx$4(() => [
                _createVNode$4(_component_VSpacer),
                _createVNode$4(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[3] || (_cache[3] = $event => (dialog.value = false))
                }, {
                  default: _withCtx$4(() => [...(_cache[8] || (_cache[8] = [
                    _createTextVNode$4("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$4(_component_VBtn, {
                  color: "primary",
                  disabled: !selectedPath.value,
                  onClick: chooseFile
                }, {
                  default: _withCtx$4(() => [...(_cache[9] || (_cache[9] = [
                    _createTextVNode$4("使用此文件", -1)
                  ]))]),
                  _: 1
                }, 8, ["disabled"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"])
  ], 64))
}
}

};
const MediaFilePicker = /*#__PURE__*/_export_sfc(_sfc_main$4, [['__scopeId',"data-v-cf5745d2"]]);

const {toDisplayString:_toDisplayString$3,createTextVNode:_createTextVNode$3,resolveComponent:_resolveComponent$3,withCtx:_withCtx$3,createVNode:_createVNode$3,createElementVNode:_createElementVNode$3,Fragment:_Fragment$3,openBlock:_openBlock$3,createElementBlock:_createElementBlock$3,createCommentVNode:_createCommentVNode$3,createBlock:_createBlock$3,renderList:_renderList$3,mergeProps:_mergeProps$1,normalizeClass:_normalizeClass$2} = await importShared('vue');


const _hoisted_1$3 = { class: "module-status-chips" };
const _hoisted_2$3 = { key: 3 };
const _hoisted_3$3 = { class: "filter-row mb-3" };
const _hoisted_4$3 = { class: "rule-filter-actions" };
const _hoisted_5$3 = { class: "text-caption text-medium-emphasis mb-2" };
const _hoisted_6$3 = { class: "font-weight-medium" };
const _hoisted_7$3 = { class: "d-flex align-center ga-2" };
const _hoisted_8$3 = ["title"];
const _hoisted_9$3 = {
  key: 0,
  class: "text-caption text-medium-emphasis"
};
const _hoisted_10$3 = { class: "text-caption text-medium-emphasis" };
const _hoisted_11$3 = {
  key: 0,
  class: "text-caption text-medium-emphasis mt-1"
};
const _hoisted_12$3 = { key: 4 };
const _hoisted_13$3 = { class: "filter-row mb-3" };
const _hoisted_14$3 = { class: "font-weight-medium" };
const _hoisted_15$3 = { class: "rule-pattern" };
const _hoisted_16$3 = { key: 5 };
const _hoisted_17$3 = { class: "d-flex align-center flex-wrap ga-3 mb-4" };
const _hoisted_18$2 = {
  key: 1,
  class: "group-layout-grid"
};
const _hoisted_19$2 = { class: "group-layout-main" };
const _hoisted_20$2 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_21$2 = { class: "font-weight-bold" };
const _hoisted_22$2 = { class: "mapping-expression" };
const _hoisted_23$2 = { class: "text-caption text-medium-emphasis" };
const _hoisted_24$2 = { class: "d-flex" };
const _hoisted_25$2 = {
  key: 2,
  class: "empty-fields"
};
const _hoisted_26$2 = { class: "group-preview-form" };
const _hoisted_27$2 = { class: "text-caption mt-1" };
const _hoisted_28$2 = {
  key: 0,
  class: "member-trace mt-3"
};
const _hoisted_29$2 = { key: 0 };
const _hoisted_30$2 = { key: 6 };
const _hoisted_31$2 = {
  key: 0,
  class: "probe-workspace mb-4"
};
const _hoisted_32$2 = { class: "probe-selection-summary" };
const _hoisted_33$2 = { class: "probe-chip-policy" };
const _hoisted_34$2 = {
  key: 1,
  class: "probe-selection-empty"
};
const _hoisted_35$2 = { class: "probe-field-list" };
const _hoisted_36$2 = { class: "probe-field-main" };
const _hoisted_37$2 = { class: "font-weight-medium" };
const _hoisted_38$2 = { class: "text-caption text-medium-emphasis" };
const _hoisted_39$2 = { class: "probe-field-controls" };
const _hoisted_40$2 = { class: "subtitle-mapping-box" };
const _hoisted_41$2 = { class: "probe-advanced-grid" };
const _hoisted_42$2 = {
  key: 0,
  class: "mt-3"
};
const _hoisted_43$2 = { class: "font-weight-medium" };
const _hoisted_44$2 = { class: "subtitle-mapping-box iso-probe-box" };
const _hoisted_45$2 = {
  key: 0,
  class: "static-ffprobe-actions"
};
const _hoisted_46$2 = { class: "probe-card-actions" };
const _hoisted_47$2 = { class: "probe-path-row" };
const _hoisted_48$2 = { class: "probe-scan-bar" };
const _hoisted_49$2 = { class: "probe-result-header" };
const _hoisted_50$1 = { class: "probe-result-file" };
const _hoisted_51$1 = ["title"];
const _hoisted_52$1 = { class: "probe-stream-counts" };
const _hoisted_53$1 = {
  key: 0,
  class: "probe-summary-section"
};
const _hoisted_54$1 = { class: "probe-result-table" };
const _hoisted_55$1 = { class: "probe-variable-title" };
const _hoisted_56$1 = { class: "text-caption text-medium-emphasis" };
const _hoisted_57$1 = {
  key: 0,
  class: "probe-variable-list"
};
const _hoisted_58$1 = ["title"];
const _hoisted_59$1 = {
  key: 1,
  class: "probe-result-empty compact"
};
const _hoisted_60$1 = { class: "probe-missing-chips" };
const _hoisted_61$1 = {
  key: 2,
  class: "probe-result-empty"
};
const _hoisted_62$1 = { class: "probe-empty-icon" };
const _hoisted_63$1 = {
  key: 1,
  class: "strm-page mb-4"
};
const _hoisted_64$1 = { class: "strm-control-row" };
const _hoisted_65$1 = { class: "strm-counters" };
const _hoisted_66$1 = { class: "strm-config-grid" };
const _hoisted_67$1 = { class: "strm-config-section" };
const _hoisted_68$1 = { class: "strm-section-head" };
const _hoisted_69$1 = { class: "strm-timing-grid" };
const _hoisted_70$1 = { class: "strm-config-section" };
const _hoisted_71$1 = { class: "strm-section-head" };
const _hoisted_72$1 = {
  key: 0,
  class: "strm-mapping-list"
};
const _hoisted_73$1 = { class: "strm-mapping-meta" };
const _hoisted_74$1 = { class: "strm-path-pair" };
const _hoisted_75$1 = {
  key: 1,
  class: "strm-empty compact"
};
const _hoisted_76$1 = { class: "strm-save-row" };
const _hoisted_77$1 = { class: "strm-preview-workbench" };
const _hoisted_78$1 = { class: "strm-preview-files" };
const _hoisted_79$1 = { class: "strm-preview-path-card" };
const _hoisted_80$1 = { class: "strm-preview-path-heading" };
const _hoisted_81$1 = { class: "strm-preview-path" };
const _hoisted_82$1 = { class: "strm-preview-arrow" };
const _hoisted_83$1 = { class: "strm-preview-path-card" };
const _hoisted_84$1 = { class: "strm-preview-path-heading" };
const _hoisted_85$1 = { class: "strm-preview-path" };
const _hoisted_86$1 = { class: "strm-preview-actions" };
const _hoisted_87$1 = { key: 0 };
const _hoisted_88$1 = { key: 0 };
const _hoisted_89$1 = { class: "strm-job-toolbar" };
const _hoisted_90$1 = { class: "strm-job-summary" };
const _hoisted_91$1 = { class: "strm-job-actions" };
const _hoisted_92$1 = {
  key: 0,
  class: "strm-job-section"
};
const _hoisted_93$1 = { class: "strm-job-section-title" };
const _hoisted_94$1 = { class: "strm-job-list" };
const _hoisted_95$1 = ["onClick"];
const _hoisted_96$1 = { class: "strm-job-row-actions" };
const _hoisted_97$1 = {
  key: 0,
  class: "strm-job-detail"
};
const _hoisted_98$1 = {
  key: 0,
  class: "strm-server-results"
};
const _hoisted_99$1 = { key: 0 };
const _hoisted_100$1 = { class: "strm-completed-title" };
const _hoisted_101$1 = { class: "strm-job-list strm-completed-list" };
const _hoisted_102$1 = ["onClick"];
const _hoisted_103 = { class: "strm-job-row-actions" };
const _hoisted_104 = {
  key: 0,
  class: "strm-job-detail"
};
const _hoisted_105 = {
  key: 0,
  class: "strm-server-results"
};
const _hoisted_106 = { key: 0 };
const _hoisted_107 = { key: 7 };
const _hoisted_108 = { key: 0 };
const _hoisted_109 = { class: "d-flex align-center flex-wrap ga-3 mb-4" };
const _hoisted_110 = {
  key: 0,
  class: "custom-field-list"
};
const _hoisted_111 = { class: "flex-grow-1 min-w-0" };
const _hoisted_112 = { class: "d-flex align-center ga-2" };
const _hoisted_113 = { class: "font-weight-medium mt-1" };
const _hoisted_114 = ["title"];
const _hoisted_115 = {
  key: 0,
  class: "text-caption text-medium-emphasis"
};
const _hoisted_116 = {
  key: 1,
  class: "empty-fields custom-fields-empty"
};
const _hoisted_117 = { class: "rename-preview-form" };
const _hoisted_118 = {
  key: 0,
  class: "preview-output mt-4"
};
const _hoisted_119 = { class: "text-right text-break" };
const _hoisted_120 = { class: "d-flex align-center ga-3" };
const _hoisted_121 = { class: "font-weight-medium" };
const _hoisted_122 = { class: "field-description-grid" };
const _hoisted_123 = { class: "field-description-head" };
const _hoisted_124 = { class: "field-description-label" };
const _hoisted_125 = { class: "field-description-text" };
const _hoisted_126 = { class: "field-value-summary" };
const _hoisted_127 = { class: "text-truncate" };
const _hoisted_128 = { class: "field-card-actions" };
const _hoisted_129 = {
  key: 0,
  class: "empty-fields compact-empty"
};
const _hoisted_130 = { class: "naming-default-grid" };
const _hoisted_131 = { class: "separator-scope rule-enabled-box" };
const _hoisted_132 = { key: 2 };
const _hoisted_133 = { class: "d-flex align-center flex-wrap ga-3 mb-4" };
const _hoisted_134 = {
  key: 1,
  class: "mapping-list"
};
const _hoisted_135 = { class: "flex-grow-1 min-w-0" };
const _hoisted_136 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_137 = { class: "font-weight-bold" };
const _hoisted_138 = { class: "mapping-expression" };
const _hoisted_139 = { class: "text-caption text-medium-emphasis" };
const _hoisted_140 = {
  key: 2,
  class: "empty-fields"
};
const _hoisted_141 = { class: "mapping-preview-form final-mapping-preview" };
const _hoisted_142 = { class: "text-caption mt-1" };
const _hoisted_143 = { key: 8 };
const _hoisted_144 = { class: "overlay-preview-form" };
const _hoisted_145 = { class: "overlay-preview-actions" };
const _hoisted_146 = { class: "supplement-field-grid" };
const _hoisted_147 = { class: "supplement-field-grid" };
const _hoisted_148 = { class: "field-detail-meta" };
const _hoisted_149 = { class: "text-caption mt-1" };
const _hoisted_150 = { class: "field-detail-section" };
const _hoisted_151 = { class: "field-detail-section" };
const _hoisted_152 = { class: "field-detail-section" };
const _hoisted_153 = { class: "field-detail-section" };
const _hoisted_154 = { class: "field-syntax-block" };
const _hoisted_155 = { class: "text-caption text-medium-emphasis" };
const _hoisted_156 = { class: "preset-table-wrap" };
const _hoisted_157 = { key: 0 };
const _hoisted_158 = {
  key: 0,
  class: "d-flex justify-center mt-3"
};
const _hoisted_159 = { class: "rule-enabled-box" };
const _hoisted_160 = { class: "rule-enabled-box" };
const _hoisted_161 = { class: "rule-enabled-box" };
const _hoisted_162 = { class: "rule-enabled-box" };

const {computed: computed$3,onMounted: onMounted$3,onUnmounted,ref: ref$3,watch: watch$1} = await importShared('vue');

const pageSize = 30;

const _sfc_main$3 = {
  __name: 'MetadataTools',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'TmdbRecognizeEnhancer' },
  modelValue: { type: Object, default: () => ({}) },
  savingConfig: { type: Boolean, default: false },
  mode: { type: String, default: 'metadata' },
},
  emits: ['update:modelValue', 'save-config'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;
const headerInfo = computed$3(() => {
  if (props.mode === 'naming') return { icon: 'mdi-rename-box-outline', title: '命名规则', subtitle: '统一管理连接符、制作组、自定义字段和最终文本映射，并按实际执行顺序排列。', color: 'orange' }
  if (props.mode === 'probe') return { icon: 'mdi-waveform', title: '媒体信息识别', subtitle: '整理前读取真实媒体流，补齐技术参数并输出可用于命名的 Jinja2 变量。', color: 'purple' }
  return { icon: 'mdi-code-braces-box', title: '字段与制作组', subtitle: '查看 MP 当前版本实际加载的识别规则，并为制作组提供候选类型证据。', color: 'primary' }
});
const loading = ref$3(false);
const saving = ref$3('');
const error = ref$3('');
const data = ref$3({ release_groups: { items: [] }, recognition_rules: { items: [], fields: [], overrides: [] }, rename_fields: { builtin: [], context: [], custom: [] }, rename_mappings: { items: [], stages: [] }, release_group_arrangements: { items: [], positions: [], connectors: [] }, media_probe: { field_options: [] }, capabilities: {} });
const section = ref$3(props.mode === 'naming' ? 'mapping' : props.mode === 'probe' ? 'probe' : 'rules');
const search = ref$3('');
const field = ref$3('all');
const source = ref$3('all');
const page = ref$3(1);
const groupKind = ref$3('all');
const groupProfileDialog = ref$3(false);
const groupProfileForm = ref$3({ id: '', display_name: '', kind: 'unknown', field_policy: 'fill_empty', field_values: {}, custom_field_values: {} });
const probePath = ref$3('');
const probeSection = ref$3('scan');
const probeResult = ref$3(null);
const probeForce = ref$3(true);
const probeCacheNotice = ref$3('');
const strmSync = ref$3({
  available: false, enabled: false, active: false, worker_running: false, worker_error: '',
  servers: [], jobs: [], counts: { pending: 0, completed: 0, attention: 0 },
  config: { enabled: false, servers: [], initial_delay_seconds: 20, retry_seconds: 30, max_wait_minutes: 30, path_mappings: [] },
});
const strmTargetPath = ref$3('');
const strmPreview = ref$3(null);
const openStrmJobDetails = ref$3([]);
const dialog = ref$3(false);
const form = ref$3({ id: '', source_rule_id: '', field: 'videoBit', pattern: '', value: '{match}', action: 'override', enabled: true, priority: 100, label: '' });
const bulkPriorityDialog = ref$3(false);
const bulkPriority = ref$3(100);
const previewTitle = ref$3('[Group] Example.S01E01.1080p.WEB-DL.H265.10bit.AAC.mkv');
const preview = ref$3(null);
const renameDialog = ref$3(false);
const renameForm = ref$3({ original_key: '', key: '', label: '', expression: '', fallback: '', enabled: true });
const renamePreviewing = ref$3(false);
const renamePreview = ref$3(null);
const renameFieldSearch = ref$3('');
const openRenameFieldGroups = ref$3(['媒体信息', '文件解析', '源文件上下文']);
const copiedVariable = ref$3('');
const fieldDetailDialog = ref$3(false);
const fieldDetail = ref$3(null);
const fieldPresetLimit = ref$3(80);
const mappingDialog = ref$3(false);
const mappingForm = ref$3({ id: '', label: '', stage: 'final_result', mode: 'literal', pattern: '', replacement: '', enabled: true, priority: 100 });
const mappingPreviewInput = ref$3({ value: 'AB/C.chi.zh-cn.ass' });
const mappingPreview = ref$3(null);
const renameRuleSection = ref$3('defaults');
const groupArrangementDialog = ref$3(false);
const groupArrangementForm = ref$3({ id: '', label: '', match_name: '', aliases: '', output_name: '', position: 'keep', connector: '__default__', order: 100, enabled: true });
const groupArrangementPreviewInput = ref$3('ADWeb@A@VCB');
const groupArrangementPreview = ref$3(null);
const renamePreviewInput = ref$3({
  original_name: '[Group] Example.S01E01.1080p.WEB-DL.mkv',
  type: '电视剧', category: '动漫',
  source_path: '/downloads/anime/Example.S01E01.mkv',
  target_dir: '/media/TV/动漫',
});

const pluginBase = computed$3(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`);
const config = computed$3({ get: () => props.modelValue || {}, set: value => emit('update:modelValue', value) });
const kindItems = [
  { title: '未分类 / 不参与', value: 'unknown' },
  { title: '动漫', value: 'animation' },
  { title: '真人电视剧', value: 'live_action' },
];
const sourceItems = [
  { title: '全部来源', value: 'all' },
  { title: '插件自定义覆盖', value: 'plugin_user' },
  { title: 'MP Python / Rust', value: 'mp_python_rust' },
  { title: 'MP Python 内置表', value: 'mp_python' },
  { title: 'MP 词表设置', value: 'mp_config' },
];
const fieldItems = computed$3(() => [{ title: '全部识别字段', value: 'all' }, ...(data.value.recognition_rules?.fields || []).map(item => ({ title: `${item.label} (${item.count})`, value: item.key }))]);
const rules = computed$3(() => {
  const query = search.value.trim().toLowerCase();
  return (data.value.recognition_rules?.items || []).filter(item => {
    if (field.value !== 'all' && item.field !== field.value) return false
    if (source.value !== 'all' && item.source !== source.value) return false
    return !query || [item.field, item.field_label, item.label, item.pattern, item.value].some(value => String(value || '').toLowerCase().includes(query))
  })
});
const pageCount = computed$3(() => Math.max(1, Math.ceil(rules.value.length / pageSize)));
const pagedRules = computed$3(() => rules.value.slice((page.value - 1) * pageSize, page.value * pageSize));
const groups = computed$3(() => {
  const query = search.value.trim().toLowerCase();
  return (data.value.release_groups?.items || []).filter(item => {
    if (groupKind.value !== 'all' && item.kind !== groupKind.value) return false
    return !query || [item.display_name, item.pattern, item.category].some(value => String(value || '').toLowerCase().includes(query))
  })
});
const groupPageCount = computed$3(() => Math.max(1, Math.ceil(groups.value.length / pageSize)));
const pagedGroups = computed$3(() => groups.value.slice((page.value - 1) * pageSize, page.value * pageSize));
const kindLabel = value => ({ animation: '动漫', live_action: '真人电视剧', unknown: '未分类' })[value] || '未分类';
const kindColor = value => ({ animation: 'primary', live_action: 'orange', unknown: 'default' })[value] || 'default';
const mediaProbeFieldItems = [
  { key: 'videoFormat', label: '分辨率', target: 'videoFormat', detail: '根据实际宽高生成 720P、1080P、2160P 等' },
  { key: 'videoCodec', label: '视频编码', target: 'videoCodec', detail: 'H264、H265、AV1、VP9 等' },
  { key: 'videoBit', label: '视频位深', target: 'videoBit', detail: '8bit、10bit、12bit 等' },
  { key: 'effect', label: '画面特效', target: 'effect', detail: 'DOVI、HDR10+、HDR10、HLG；普通 SDR 不写入 effect' },
  { key: 'fps', label: '帧率', target: 'fps', detail: '读取主视频流的实际平均帧率' },
  { key: 'audioCodec', label: '音频信息', target: 'audioCodec', detail: '主音频编码，并提供全部音轨编码和语言上下文' },
  { key: 'subtitle', label: '内封字幕', target: 'customization', detail: '扫描容器内字幕流语言，按下方规则映射到 customization' },
  { key: 'duration', label: '媒体时长', target: 'probe_duration', detail: '只作为 Jinja2 扫描变量提供，不覆盖 MP 标准字段' },
];
const fieldPolicyItems = [
  { title: '仅补空值', value: 'fill_empty' },
  { title: '覆盖原值', value: 'overwrite' },
  { title: '追加到原值', value: 'append' },
];
const strmTargetKindItems = [
  { title: 'STRM 条目路径（.strm）', value: 'strm' },
  { title: '普通媒体条目路径（原扩展名）', value: 'media' },
];
const selectedProbeFieldItems = computed$3(() => mediaProbeFieldItems.filter(item => probeFieldSelected(item.key)));
const mediaProbeBackendSupported = computed$3(() => Object.prototype.hasOwnProperty.call(data.value || {}, 'media_probe') && Array.isArray(data.value.media_probe?.field_options));
const strmServerItems = computed$3(() => (strmSync.value.servers || []).map(item => ({
  title: `${item.name}${item.connected ? '' : '（未连接）'}`,
  value: item.name,
  props: { disabled: !item.connected },
})));
const strmStatusText = computed$3(() => {
  if (!strmSync.value.available) return '当前 MoviePilot 不支持媒体服务器服务目录'
  if (!config.value.enabled) return '等待启用插件总开关'
  if (!strmSync.value.config?.enabled) return '已停用'
  if (!config.value.media_probe_enabled) return '等待启用整理前媒体流扫描'
  if (!strmSync.value.servers?.length) return '未配置 Emby'
  if (strmSync.value.worker_running) return '正在监听整理入库'
  return strmSync.value.worker_error ? '后台工作器异常' : '后台工作器正在恢复'
});
const activeStrmJobs = computed$3(() => (
  (strmSync.value.jobs || []).filter(job => job.status !== 'completed')
));
const completedStrmJobs = computed$3(() => (
  (strmSync.value.jobs || []).filter(job => job.status === 'completed')
));
const strmJobStatusPresentation = status => ({
  pending: { label: '等待入库', color: 'info', icon: 'mdi-clock-outline' },
  running: { label: '正在推送', color: 'info', icon: 'mdi-progress-clock' },
  completed: { label: '已完成', color: 'success', icon: 'mdi-check-circle-outline' },
  timeout: { label: '等待超时', color: 'warning', icon: 'mdi-timer-alert-outline' },
  failed: { label: '推送失败', color: 'error', icon: 'mdi-alert-circle-outline' },
  attention: { label: '需要处理', color: 'warning', icon: 'mdi-alert-outline' },
})[status] || { label: status || '未知状态', color: 'default', icon: 'mdi-help-circle-outline' };
const strmServerStatusPresentation = status => ({
  synced: { label: '插件推送已接受', color: 'success', icon: 'mdi-cloud-check-outline' },
  local: { label: '沿用 Emby 原值', color: 'info', icon: 'mdi-database-check-outline' },
  pending: { label: '等待 Emby 入库', color: 'warning', icon: 'mdi-clock-outline' },
  error: { label: '连接失败', color: 'error', icon: 'mdi-alert-circle-outline' },
  unsupported: { label: '不支持此接口', color: 'warning', icon: 'mdi-api-off' },
  empty: { label: '接口拒绝或空响应', color: 'warning', icon: 'mdi-database-alert-outline' },
  invalid: { label: '扫描数据无效', color: 'error', icon: 'mdi-file-alert-outline' },
})[status] || { label: status || '未知', color: 'default', icon: 'mdi-help-circle-outline' };
const strmServerResults = job => Object.entries(job?.server_results || {}).map(([name, result]) => ({
  name,
  ...(result || {}),
  presentation: strmServerStatusPresentation(result?.status),
}));
const strmJobSummary = job => {
  const results = strmServerResults(job);
  if (!results.length) return job?.reason || '暂无说明'
  const synced = results.filter(item => item.status === 'synced').length;
  const local = results.filter(item => item.status === 'local').length;
  if (synced && !local && synced === results.length) return '神医接口已接受本次插件推送，响应与推送媒体信息一致'
  if (local && !synced && local === results.length) return 'Emby 已有媒体信息，神医保留原值，本次插件数据未覆盖'
  if (synced || local) return `${synced} 个目标接受插件推送，${local} 个目标沿用 Emby 原有信息`
  return job?.reason || '暂无说明'
};
const strmJobDetailOpen = jobId => openStrmJobDetails.value.includes(String(jobId));
function toggleStrmJobDetail(jobId) {
  const key = String(jobId);
  openStrmJobDetails.value = strmJobDetailOpen(key)
    ? openStrmJobDetails.value.filter(item => item !== key)
    : [...openStrmJobDetails.value, key];
}
const supplementFieldItems = [
  { key: 'resourceType', label: '资源类型', placeholder: 'WEB-DL' },
  { key: 'webSource', label: '流媒体平台', placeholder: 'Netflix / Bilibili' },
  { key: 'effect', label: '画面特效', placeholder: 'HDR10 / DOVI' },
  { key: 'videoFormat', label: '分辨率', placeholder: '1080P' },
  { key: 'videoCodec', label: '视频编码', placeholder: 'H265' },
  { key: 'videoBit', label: '视频位深', placeholder: '10bit' },
  { key: 'audioCodec', label: '音频编码', placeholder: 'AAC' },
  { key: 'fps', label: '帧率', placeholder: '23.976' },
  { key: 'customization', label: '自定义占位符', placeholder: '简日内封' },
];
const mappingRules = computed$3(() => data.value.rename_mappings?.items || []);
const mappingStages = computed$3(() => data.value.rename_mappings?.stages || [
  { value: 'final_result', label: '最终命名结果' },
  { value: 'release_group', label: '旧版制作组映射' },
]);
const mappingStageLabel = value => mappingStages.value.find(item => item.value === value)?.label || value;
const groupArrangementRules = computed$3(() => data.value.release_group_arrangements?.items || []);
const groupPositionItems = computed$3(() => data.value.release_group_arrangements?.positions || [
  { value: 'first', label: '固定最前' },
  { value: 'keep', label: '保持原标题顺序' },
  { value: 'last', label: '固定最后' },
]);
const groupPositionLabel = value => groupPositionItems.value.find(item => item.value === value)?.label || value;
const separatorOptions = [
  { title: '空格', value: ' ' }, { title: '点（.）', value: '.' },
  { title: '横杠（-）', value: '-' }, { title: '下划线（_）', value: '_' },
  { title: '@', value: '@' }, { title: '&', value: '&' }, { title: '+', value: '+' },
];
const groupConnectorItems = computed$3(() => [
  { title: `继承标题，否则默认（${config.value.release_group_default_connector === ' ' ? '空格' : config.value.release_group_default_connector || '@'}）`, value: data.value.release_group_arrangements?.default_connector_value || '__default__' },
  ...(data.value.release_group_arrangements?.connectors || ['@', '&', '+', '-', '_', '.', ' ']).map(value => ({ title: value === ' ' ? '空格' : value, value })),
]);
const separatorFieldKeys = new Set(['title', 'en_title', 'original_title', 'name', 'en_name', 'original_name', 'resourceType', 'effect', 'edition', 'videoFormat', 'resource_term', 'releaseGroup', 'videoCodec', 'videoBit', 'audioCodec', 'fps', 'webSource', 'customization']);
const separatorFieldItems = computed$3(() => (data.value.rename_fields?.builtin || [])
  .filter(item => separatorFieldKeys.has(item.key))
  .map(item => ({ title: `${item.label}（${item.key}）`, value: item.key })));
const customFields = computed$3(() => data.value.rename_fields?.custom || []);
const probeContextFieldItems = computed$3(() => (data.value.rename_fields?.context || [])
  .filter(item => String(item.key || '').startsWith('probe_')));
const probeStandardPreviewItems = computed$3(() => Object.entries(probeResult.value?.fields || {}).map(([key, value]) => ({
  key,
  value,
  label: mediaProbeFieldItems.find(item => item.target === key)?.label || key,
})));
const probeContextPreviewItems = computed$3(() => probeContextFieldItems.value.map(item => ({
  ...item,
  value: probeResult.value?.context?.[item.key],
})));
const probeValuePresent = value => value !== '' && value !== null && value !== undefined;
const probeDetectedContextItems = computed$3(() => probeContextPreviewItems.value.filter(item => probeValuePresent(item.value)));
const probeMissingContextItems = computed$3(() => probeContextPreviewItems.value.filter(item => !probeValuePresent(item.value)));
const probeFileName = computed$3(() => String(probePath.value || '').split(/[\\/]/).pop() || '尚未选择文件');
const probeSummaryPresentation = key => ({
  videoFormat: { icon: 'mdi-monitor-screenshot', color: 'primary' },
  videoCodec: { icon: 'mdi-movie-cog-outline', color: 'secondary' },
  videoBit: { icon: 'mdi-gradient-horizontal', color: 'deep-purple' },
  effect: { icon: 'mdi-creation-outline', color: 'amber-darken-2' },
  fps: { icon: 'mdi-speedometer', color: 'info' },
  audioCodec: { icon: 'mdi-volume-high', color: 'success' },
  customization: { icon: 'mdi-subtitles-outline', color: 'teal' },
  probe_duration: { icon: 'mdi-timer-outline', color: 'blue-grey' },
})[key] || { icon: 'mdi-information-outline', color: 'secondary' };
const availableRenameFields = computed$3(() => [
  ...(data.value.rename_fields?.builtin || []),
  ...(data.value.rename_fields?.context || []),
  ...customFields.value.map(item => ({
    ...item,
    category: '用户自定义',
    description: `由表达式计算：${item.expression}`,
    availability: item.enabled ? '按表达式依赖阶段可用' : '当前已停用',
    phase: 'custom',
    source: 'user_custom',
    source_label: '用户自定义字段',
    type: 'Jinja2 计算结果',
    values: item.fallback ? `表达式输出；计算为空或失败时回退为 ${item.fallback}` : '由用户表达式和当前输入字段共同决定；可能为空。',
    logic: item.expression || '尚未设置表达式。',
    template_usage: 'direct',
    template_usage_label: '可直接用于 MP 命名模板',
    template_usage_detail: (item.dependencies || []).some(key => ['target_dir', 'rendered_relative_path', 'target_path_before_custom'].includes(key))
      ? '模板可以直接引用该自定义字段；它依赖首次渲染后的目标上下文，因此插件会在目标路径计算后执行一次安全重渲染。'
      : '保存并启用后可直接写进 MoviePilot 命名模板；插件会在首次模板渲染前计算该字段。',
  })),
]);
const renameFieldGroups = computed$3(() => {
  const query = renameFieldSearch.value.trim().toLowerCase();
  const filtered = availableRenameFields.value.filter(item => !query || [
    item.key, item.label, item.category, item.description, item.availability,
  ].some(value => String(value || '').toLowerCase().includes(query)));
  const groups = new Map();
  filtered.forEach(item => {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category).push(item);
  });
  return [...groups.entries()].map(([category, items]) => ({ category, items }))
});

watch$1([search, field, source, groupKind, section], () => { page.value = 1; });

function explainError(err, fallback) {
  const status = err?.response?.status || err?.status;
  if (status === 404 || String(err?.message || '').includes('404')) {
    return '前端文件已更新，但 MoviePilot 仍在运行旧插件后端，尚未注册新接口。请在 MP 中重载插件；若无重载按钮，只需重启一次 MP 容器。'
  }
  return err?.message || fallback
}

async function load() {
  loading.value = true;
  error.value = '';
  try {
    data.value = unwrapResponse(await props.api.get(`${pluginBase.value}/metadata-tools`)) || data.value;
    if (props.mode === 'probe' && Object.prototype.hasOwnProperty.call(data.value || {}, 'strm_sync')) {
      await loadStrmSync();
    }
  } catch (err) {
    error.value = explainError(err, '内置识别规则加载失败');
  } finally { loading.value = false; }
}

async function loadStrmSync() {
  strmSync.value = unwrapResponse(await props.api.get(`${pluginBase.value}/metadata-tools/strm-sync`)) || strmSync.value;
}

async function saveStrmSync() {
  saving.value = 'strm-config';
  error.value = '';
  try {
    strmSync.value = unwrapResponse(await props.api.post(
      `${pluginBase.value}/metadata-tools/strm-sync/config`, strmSync.value.config,
    )) || strmSync.value;
  } catch (err) { error.value = explainError(err, '神医联动设置保存失败'); }
  finally { saving.value = ''; }
}

async function toggleStrmSyncEnabled(value) {
  const previous = Boolean(strmSync.value.config.enabled);
  strmSync.value.config.enabled = Boolean(value);
  saving.value = 'strm-toggle';
  error.value = '';
  try {
    strmSync.value = unwrapResponse(await props.api.post(
      `${pluginBase.value}/metadata-tools/strm-sync/config`, strmSync.value.config,
    )) || strmSync.value;
  } catch (err) {
    strmSync.value.config.enabled = previous;
    error.value = explainError(err, '媒体信息推送开关保存失败');
  } finally { saving.value = ''; }
}

function addStrmMapping() {
  if (!Array.isArray(strmSync.value.config.path_mappings)) strmSync.value.config.path_mappings = [];
  strmSync.value.config.path_mappings.push({ server: '*', source: '', target: '', target_kind: 'strm' });
}

async function previewStrmSync() {
  saving.value = 'strm-preview';
  strmPreview.value = null;
  error.value = '';
  try {
    strmPreview.value = unwrapResponse(await props.api.post(
      `${pluginBase.value}/metadata-tools/strm-sync/preview`, {
        source_path: probePath.value,
        target_path: strmTargetPath.value || probePath.value,
        servers: strmSync.value.config.servers,
      },
    ));
    await loadStrmSync();
  } catch (err) { error.value = explainError(err, '神医媒体信息试推失败'); }
  finally { saving.value = ''; }
}

async function retryStrmJob(jobId = '') {
  saving.value = `strm-retry:${jobId || 'all'}`;
  try {
    strmSync.value = unwrapResponse(await props.api.post(
      `${pluginBase.value}/metadata-tools/strm-sync/retry`, { job_id: jobId },
    )) || strmSync.value;
  } catch (err) { error.value = explainError(err, '重新排队失败'); }
  finally { saving.value = ''; }
}

async function deleteStrmJob(jobId = '') {
  saving.value = `strm-delete:${jobId || 'finished'}`;
  try {
    strmSync.value = unwrapResponse(await props.api.post(
      `${pluginBase.value}/metadata-tools/strm-sync/delete`, jobId ? { job_id: jobId } : { finished_only: true },
    )) || strmSync.value;
  } catch (err) { error.value = explainError(err, '删除任务失败'); }
  finally { saving.value = ''; }
}

async function saveGroup(item, kind) {
  saving.value = item.id;
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group`, { id: item.id, kind, display_name: item.display_name, field_policy: item.field_policy, field_values: item.field_values, custom_field_values: item.custom_field_values })) || data.value;
  } catch (err) { error.value = explainError(err, '制作组类型保存失败'); }
  finally { saving.value = ''; }
}

function openGroupProfile(item) {
  groupProfileForm.value = {
    id: item.id, display_name: item.display_name, kind: item.kind || 'unknown',
    field_policy: item.field_policy || 'fill_empty', field_values: { ...(item.field_values || {}) },
    custom_field_values: { ...(item.custom_field_values || {}) },
  };
  groupProfileDialog.value = true;
}

async function saveGroupProfile() {
  saving.value = 'group-profile';
  error.value = '';
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group`, groupProfileForm.value)) || data.value;
    groupProfileDialog.value = false;
  } catch (err) { error.value = explainError(err, '制作组字段保存失败'); }
  finally { saving.value = ''; }
}

async function previewMediaProbe() {
  saving.value = 'media-probe';
  probeResult.value = null;
  error.value = '';
  try {
    probeResult.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/media-probe/preview`, { source_path: probePath.value, timeout: config.value.media_probe_timeout, force: probeForce.value }));
  } catch (err) { error.value = explainError(err, '媒体流扫描失败'); }
  finally { saving.value = ''; }
}

async function clearProbeCache() {
  saving.value = 'probe-cache';
  error.value = '';
  probeCacheNotice.value = '';
  try {
    const response = await props.api.post(`${pluginBase.value}/metadata-tools/media-probe/cache/clear`);
    const capability = unwrapResponse(response);
    // 只合并容量/统计字段，保留 field_options 等目录信息，否则会误报“后端仍是旧实例”
    if (data.value && capability) data.value.media_probe = { ...(data.value.media_probe || {}), ...capability };
    probeCacheNotice.value = response?.data?.message || response?.message || '扫描缓存已清除';
  } catch (err) { error.value = explainError(err, '清除扫描缓存失败'); }
  finally { saving.value = ''; }
}

const staticFfprobe = computed$3(() => data.value.media_probe?.static_ffprobe || {});
let staticFfprobePoll = null;

async function installStaticFfprobe(silent = false) {
  saving.value = 'static-ffprobe';
  if (!silent) error.value = '';
  try {
    const response = await props.api.post(`${pluginBase.value}/metadata-tools/media-probe/static-ffprobe/install`);
    const status = unwrapResponse(response);
    if (data.value?.media_probe && status) data.value.media_probe.static_ffprobe = status;
    scheduleStaticFfprobePoll();
  } catch (err) { if (!silent) error.value = explainError(err, '静态 ffprobe 下载触发失败'); }
  finally { saving.value = ''; }
}

function scheduleStaticFfprobePoll() {
  // 下载在后端后台线程执行，前端轮询 metadata-tools 直到就绪或报错
  if (staticFfprobePoll) window.clearTimeout(staticFfprobePoll);
  staticFfprobePoll = window.setTimeout(async () => {
    staticFfprobePoll = null;
    try { await load(); } catch (_) { /* 轮询失败静默 */ }
    const status = staticFfprobe.value;
    if (status.installing) scheduleStaticFfprobePoll();
  }, 3000);
}

async function reloadPlugin() {
  saving.value = 'plugin-reload';
  error.value = '';
  probeCacheNotice.value = '';
  try {
    // MP 核心接口：热重载插件后端（清 sys.modules 并重新实例化），等效于插件页的“重载”
    await props.api.get(`plugin/reload/${props.pluginId || 'TmdbRecognizeEnhancer'}`);
    probeCacheNotice.value = '插件后端已重载，新代码与接口已生效';
    await load();
  } catch (err) { error.value = explainError(err, '插件重载失败，请在 MP 插件页手动重载或重启容器'); }
  finally { saving.value = ''; }
}

function probeFieldSelected(key) {
  return (config.value.media_probe_fields || []).includes(key)
}

function toggleProbeField(key, enabled) {
  const fields = new Set(config.value.media_probe_fields || []);
  enabled ? fields.add(key) : fields.delete(key);
  config.value.media_probe_fields = [...fields];
  if (!enabled) config.value.media_probe_overwrite_fields = (config.value.media_probe_overwrite_fields || []).filter(item => item !== key);
}

function probeFieldPolicy(key) {
  const configured = config.value.media_probe_field_policies?.[key];
  if (['fill_empty', 'overwrite', 'append'].includes(configured)) return configured
  if (config.value.media_probe_policy === 'overwrite' || (config.value.media_probe_overwrite_fields || []).includes(key)) return 'overwrite'
  return 'fill_empty'
}

function setProbeFieldPolicy(key, value) {
  config.value.media_probe_field_policies = { ...(config.value.media_probe_field_policies || {}), [key]: value };
  config.value.media_probe_policy = 'fill_empty';
  config.value.media_probe_overwrite_fields = [];
}

function openRule(item = null) {
  const effective = item?.effective || item;
  form.value = {
    id: item?.effective?.id || '', source_rule_id: item?.builtin ? item.id : '',
    field: effective?.field || 'videoBit', pattern: effective?.pattern || '',
    value: effective?.value || '{match}', action: effective?.action || 'override',
    enabled: effective?.enabled !== false, priority: effective?.priority ?? 100,
    label: effective?.label || item?.label || '用户覆盖',
  };
  dialog.value = true;
}

function openNewRule() { openRule(null); }

function openBulkPriority() {
  const priorities = [...new Set(
    rules.value
      .map(item => item.effective?.priority)
      .filter(value => value !== undefined && value !== null),
  )];
  bulkPriority.value = priorities.length === 1 ? priorities[0] : 100;
  bulkPriorityDialog.value = true;
}

async function saveRule() {
  saving.value = 'rule';
  error.value = '';
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/recognition-rule`, form.value)) || data.value;
    dialog.value = false;
  } catch (err) { error.value = explainError(err, '识别规则保存失败'); }
  finally { saving.value = ''; }
}

async function resetRule(item) {
  saving.value = `reset:${item.id}`;
  try {
    const payload = item.builtin ? { source_rule_id: item.id } : { id: item.effective?.id || item.id };
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/recognition-rule/delete`, payload)) || data.value;
  } catch (err) { error.value = explainError(err, '恢复内置规则失败'); }
  finally { saving.value = ''; }
}

async function saveBulkPriority() {
  if (!rules.value.length) return
  saving.value = 'bulk-priority';
  error.value = '';
  try {
    data.value = unwrapResponse(await props.api.post(
      `${pluginBase.value}/metadata-tools/recognition-rule/priority/bulk`,
      {
        rule_ids: rules.value.map(item => item.id),
        priority: Number(bulkPriority.value),
      },
    )) || data.value;
    bulkPriorityDialog.value = false;
  } catch (err) { error.value = explainError(err, '批量优先级保存失败'); }
  finally { saving.value = ''; }
}

async function previewRules() {
  saving.value = 'preview';
  preview.value = null;
  try {
    preview.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/recognition-rule/preview`, { title: previewTitle.value }));
  } catch (err) { error.value = explainError(err, '覆盖规则试算失败'); }
  finally { saving.value = ''; }
}

function openRenameField(item = null) {
  renameForm.value = item ? {
    original_key: item.key, key: item.key, label: item.label || item.key,
    expression: item.expression || '', fallback: item.fallback || '', enabled: item.enabled !== false,
  } : {
    original_key: '', key: '', label: '',
    expression: "{% if 'CHS&CHT' in original_name %}简繁{% elif 'CHS' in original_name %}简中{% else %}未知{% endif %}",
    fallback: '', enabled: true,
  };
  renameDialog.value = true;
}

async function saveRenameField() {
  saving.value = 'rename-field';
  error.value = '';
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-field`, renameForm.value)) || data.value;
    renameDialog.value = false;
  } catch (err) { error.value = explainError(err, '自定义字段保存失败'); }
  finally { saving.value = ''; }
}

async function deleteRenameField(item) {
  saving.value = `rename-delete:${item.key}`;
  error.value = '';
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-field/delete`, { key: item.key })) || data.value;
  } catch (err) { error.value = explainError(err, '自定义字段删除失败'); }
  finally { saving.value = ''; }
}

async function previewRenameFields() {
  renamePreviewing.value = true;
  renamePreview.value = null;
  error.value = '';
  try {
    const input = renamePreviewInput.value;
    renamePreview.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-field/preview`, {
      context: { original_name: input.original_name, type: input.type, category: input.category },
      source_path: input.source_path,
      target_dir: input.target_dir,
      rendered_relative_path: '示例/首次渲染.mkv',
    }));
  } catch (err) { error.value = explainError(err, '自定义字段试算失败'); }
  finally { renamePreviewing.value = false; }
}

function variableSyntax(key) { return `{{ ${key} }}` }
function fieldSourceColor(source) { return ({ moviepilot: 'primary', plugin_context: 'secondary', ffprobe: 'purple', user_custom: 'success' })[source] || 'default' }
function openFieldDetail(item) { fieldDetail.value = item; fieldPresetLimit.value = 80; fieldDetailDialog.value = true; }
function fieldPresetRules(item) {
  if (!item?.key) return []
  if (item.key === 'releaseGroup') {
    return (data.value.release_groups?.items || []).map(rule => ({
      id: rule.id, label: rule.display_name, pattern: rule.pattern,
      value: rule.display_name, source_label: `${rule.source_label || 'MoviePilot'} · ${rule.category || '制作组'}`,
      overridden: false,
    }))
  }
  return (data.value.recognition_rules?.items || [])
    .filter(rule => rule.field === item.key)
    .map(rule => {
      const effective = rule.effective || rule;
      return {
        id: rule.id,
        label: effective.label || rule.label,
        pattern: effective.pattern || rule.pattern,
        value: effective.action === 'clear' ? '（命中后清空）' : (effective.value ?? rule.value ?? '—'),
        source_label: rule.source_label || rule.source,
        overridden: Boolean(rule.overridden),
      }
    })
}
const fieldDetailPresetRules = computed$3(() => fieldPresetRules(fieldDetail.value));
const visibleFieldPresetRules = computed$3(() => fieldDetailPresetRules.value.slice(0, fieldPresetLimit.value));

async function copyVariable(key) {
  const text = variableSyntax(key);
  let copied = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      copied = true;
    }
  } catch (_) { /* 回退到 execCommand */ }
  if (!copied) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    document.body.removeChild(textarea);
  }
  if (!copied) {
    error.value = `浏览器拒绝访问剪贴板，请手动复制：${text}`;
    return
  }
  copiedVariable.value = key;
  window.setTimeout(() => { if (copiedVariable.value === key) copiedVariable.value = ''; }, 1600);
}

function openMappingRule(item = null) {
  mappingForm.value = item ? { ...item } : { id: '', label: '', stage: 'final_result', mode: 'literal', pattern: '', replacement: '', enabled: true, priority: 100 };
  mappingDialog.value = true;
}

async function saveMappingRule(rule = mappingForm.value, closeDialog = true) {
  saving.value = 'rename-mapping';
  error.value = '';
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-mapping`, rule)) || data.value;
    if (closeDialog) mappingDialog.value = false;
    return true
  } catch (err) { error.value = explainError(err, '命名映射保存失败'); return false }
  finally { saving.value = ''; }
}

async function deleteMappingRule(item) {
  if (!window.confirm(`确认删除命名映射“${item.label || item.pattern}”？`)) return
  saving.value = `mapping-delete:${item.id}`;
  try { data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-mapping/delete`, { id: item.id })) || data.value; }
  catch (err) { error.value = explainError(err, '命名映射删除失败'); }
  finally { saving.value = ''; }
}

async function addSubtitleMappingPreset() {
  const presets = [
    { label: '简体字幕后缀', stage: 'final_result', mode: 'literal', pattern: '.chi.zh-cn', replacement: '.chs', enabled: true, priority: 120 },
    { label: '繁体字幕后缀', stage: 'final_result', mode: 'literal', pattern: '.zh-tw', replacement: '.cht', enabled: true, priority: 110 },
  ];
  for (const preset of presets) {
    if (!(await saveMappingRule(preset, false))) return
  }
}

async function previewMappingRules() {
  saving.value = 'mapping-preview';
  mappingPreview.value = null;
  try { mappingPreview.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/rename-mapping/preview`, mappingPreviewInput.value)); }
  catch (err) { error.value = explainError(err, '命名映射试算失败'); }
  finally { saving.value = ''; }
}

function openGroupArrangement(item = null) {
  groupArrangementForm.value = item ? {
    ...item,
    aliases: (item.aliases || []).join('\n'),
  } : {
    id: '', label: '', match_name: '', aliases: '', output_name: '',
    position: 'keep', connector: '__default__', order: 100, enabled: true,
  };
  groupArrangementDialog.value = true;
}

async function saveGroupArrangement() {
  saving.value = 'group-arrangement';
  error.value = '';
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group-arrangement`, groupArrangementForm.value)) || data.value;
    groupArrangementDialog.value = false;
  } catch (err) { error.value = explainError(err, '制作组编排规则保存失败'); }
  finally { saving.value = ''; }
}

async function deleteGroupArrangement(item) {
  if (!window.confirm(`确认删除制作组编排“${item.label || item.output_name}”？`)) return
  saving.value = `group-arrangement-delete:${item.id}`;
  error.value = '';
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group-arrangement/delete`, { id: item.id })) || data.value;
  } catch (err) { error.value = explainError(err, '制作组编排规则删除失败'); }
  finally { saving.value = ''; }
}

async function previewGroupArrangement() {
  saving.value = 'group-arrangement-preview';
  groupArrangementPreview.value = null;
  error.value = '';
  try {
    groupArrangementPreview.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group-arrangement/preview`, { value: groupArrangementPreviewInput.value }));
  } catch (err) { error.value = explainError(err, '制作组编排试算失败'); }
  finally { saving.value = ''; }
}

onMounted$3(load);
onUnmounted(() => { if (staticFfprobePoll) window.clearTimeout(staticFfprobePoll); });

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent$3("VBtn");
  const _component_VSwitch = _resolveComponent$3("VSwitch");
  const _component_VChip = _resolveComponent$3("VChip");
  const _component_VAlert = _resolveComponent$3("VAlert");
  const _component_VTab = _resolveComponent$3("VTab");
  const _component_VTabs = _resolveComponent$3("VTabs");
  const _component_VTextField = _resolveComponent$3("VTextField");
  const _component_VSelect = _resolveComponent$3("VSelect");
  const _component_VTable = _resolveComponent$3("VTable");
  const _component_VPagination = _resolveComponent$3("VPagination");
  const _component_VIcon = _resolveComponent$3("VIcon");
  const _component_VCardText = _resolveComponent$3("VCardText");
  const _component_VCard = _resolveComponent$3("VCard");
  const _component_VCardTitle = _resolveComponent$3("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$3("VCardSubtitle");
  const _component_VCardItem = _resolveComponent$3("VCardItem");
  const _component_VBadge = _resolveComponent$3("VBadge");
  const _component_VAvatar = _resolveComponent$3("VAvatar");
  const _component_VExpansionPanelTitle = _resolveComponent$3("VExpansionPanelTitle");
  const _component_VCheckboxBtn = _resolveComponent$3("VCheckboxBtn");
  const _component_VExpansionPanelText = _resolveComponent$3("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent$3("VExpansionPanel");
  const _component_VTextarea = _resolveComponent$3("VTextarea");
  const _component_VExpansionPanels = _resolveComponent$3("VExpansionPanels");
  const _component_VTooltip = _resolveComponent$3("VTooltip");
  const _component_VExpandTransition = _resolveComponent$3("VExpandTransition");
  const _component_VCombobox = _resolveComponent$3("VCombobox");
  const _component_VDivider = _resolveComponent$3("VDivider");
  const _component_VSpacer = _resolveComponent$3("VSpacer");
  const _component_VCardActions = _resolveComponent$3("VCardActions");
  const _component_VCol = _resolveComponent$3("VCol");
  const _component_VRow = _resolveComponent$3("VRow");
  const _component_VDialog = _resolveComponent$3("VDialog");

  return (_openBlock$3(), _createElementBlock$3("div", null, [
    _createVNode$3(ModuleHeader, {
      icon: headerInfo.value.icon,
      title: headerInfo.value.title,
      subtitle: headerInfo.value.subtitle,
      color: headerInfo.value.color
    }, {
      actions: _withCtx$3(() => [
        _createVNode$3(_component_VBtn, {
          variant: "text",
          "prepend-icon": "mdi-refresh",
          loading: loading.value,
          onClick: load
        }, {
          default: _withCtx$3(() => [
            _createTextVNode$3(_toDisplayString$3(props.mode === 'probe' ? '刷新状态' : '重新读取 MP 规则'), 1)
          ]),
          _: 1
        }, 8, ["loading"]),
        _createVNode$3(_component_VBtn, {
          color: "primary",
          "prepend-icon": "mdi-content-save",
          loading: __props.savingConfig,
          onClick: _cache[0] || (_cache[0] = $event => (emit('save-config')))
        }, {
          default: _withCtx$3(() => [
            _createTextVNode$3(_toDisplayString$3(props.mode === 'probe' ? '保存设置' : '保存模块开关'), 1)
          ]),
          _: 1
        }, 8, ["loading"])
      ]),
      controls: _withCtx$3(() => [
        (props.mode === 'probe')
          ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
              _createVNode$3(_component_VSwitch, {
                modelValue: config.value.media_probe_enabled,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((config.value.media_probe_enabled) = $event)),
                color: "purple",
                label: "整理前自动扫描",
                "hide-details": ""
              }, null, 8, ["modelValue"]),
              _createElementVNode$3("div", _hoisted_1$3, [
                _createVNode$3(_component_VChip, {
                  size: "small",
                  color: data.value.media_probe?.available ? 'success' : 'warning',
                  variant: "tonal",
                  "prepend-icon": data.value.media_probe?.available ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'
                }, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3(_toDisplayString$3(data.value.media_probe?.available ? 'ffprobe 可用' : 'ffprobe 待检查'), 1)
                  ]),
                  _: 1
                }, 8, ["color", "prepend-icon"]),
                _createVNode$3(_component_VChip, {
                  size: "small",
                  color: "purple",
                  variant: "tonal"
                }, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3(_toDisplayString$3(selectedProbeFieldItems.value.length) + " 个输出项", 1)
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VChip, {
                  size: "small",
                  variant: "tonal"
                }, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3("缓存 " + _toDisplayString$3(data.value.media_probe?.cache_entries || 0), 1)
                  ]),
                  _: 1
                })
              ])
            ], 64))
          : (props.mode === 'naming')
            ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 1 }, [
                _createVNode$3(_component_VSwitch, {
                  modelValue: config.value.custom_rename_fields_enabled,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config.value.custom_rename_fields_enabled) = $event)),
                  color: "secondary",
                  label: "启用自定义命名字段",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VSwitch, {
                  modelValue: config.value.rename_mapping_enabled,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.value.rename_mapping_enabled) = $event)),
                  color: "orange",
                  label: "启用最终文本映射",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ], 64))
            : (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 2 }, [
                _createVNode$3(_component_VSwitch, {
                  modelValue: config.value.recognition_rule_overrides_enabled,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.recognition_rule_overrides_enabled) = $event)),
                  color: "primary",
                  label: "启用识别字段覆盖",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VSwitch, {
                  modelValue: config.value.release_group_assist_enabled,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config.value.release_group_assist_enabled) = $event)),
                  color: "success",
                  label: "制作组辅助 TMDB 判断",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VSwitch, {
                  modelValue: config.value.release_group_field_supplements_enabled,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((config.value.release_group_field_supplements_enabled) = $event)),
                  color: "secondary",
                  label: "制作组补充命名字段",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ], 64))
      ]),
      _: 1
    }, 8, ["icon", "title", "subtitle", "color"]),
    (error.value)
      ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          closable: "",
          class: "mb-4",
          "onClick:close": _cache[7] || (_cache[7] = $event => (error.value = ''))
        }, {
          default: _withCtx$3(() => [
            _createTextVNode$3(_toDisplayString$3(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$3("", true),
    _createVNode$3(_component_VAlert, {
      type: "info",
      variant: "tonal",
      density: "compact",
      class: "mb-4"
    }, {
      default: _withCtx$3(() => [
        _createTextVNode$3(_toDisplayString$3(props.mode === 'naming' ? '实际顺序：连接与分隔、制作组编排（在「字段与制作组」页维护）和自定义字段参与 MoviePilot 模板渲染；文本映射最后处理完整相对路径与字幕后缀。' : props.mode === 'probe' ? 'ffprobe 每次完整读取媒体流；下方选项只控制向 MP/Jinja 命名上下文输出哪些字段，不会裁剪神医联动数据。' : '这里展示当前 MP 实际加载的识别预设；插件覆盖不会修改 MP 或 Rust 文件。'), 1)
      ]),
      _: 1
    }),
    (data.value.recognition_rules?.errors?.length)
      ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
          key: 1,
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: _withCtx$3(() => [
            _createTextVNode$3(" 部分规则读取失败：" + _toDisplayString$3(data.value.recognition_rules.errors.join('；')), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$3("", true),
    (props.mode === 'metadata')
      ? (_openBlock$3(), _createBlock$3(_component_VTabs, {
          key: 2,
          modelValue: section.value,
          "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((section).value = $event)),
          color: "primary",
          class: "mb-4"
        }, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VTab, {
              value: "rules",
              "prepend-icon": "mdi-text-box-search-outline"
            }, {
              default: _withCtx$3(() => [...(_cache[105] || (_cache[105] = [
                _createTextVNode$3("内置识别字段", -1)
              ]))]),
              _: 1
            }),
            _createVNode$3(_component_VTab, {
              value: "groups",
              "prepend-icon": "mdi-account-group-outline"
            }, {
              default: _withCtx$3(() => [...(_cache[106] || (_cache[106] = [
                _createTextVNode$3("制作组类型与字段", -1)
              ]))]),
              _: 1
            }),
            _createVNode$3(_component_VTab, {
              value: "arrange",
              "prepend-icon": "mdi-account-multiple-check-outline"
            }, {
              default: _withCtx$3(() => [...(_cache[107] || (_cache[107] = [
                _createTextVNode$3("制作组编排", -1)
              ]))]),
              _: 1
            }),
            _createVNode$3(_component_VTab, {
              value: "test",
              "prepend-icon": "mdi-flask-outline"
            }, {
              default: _withCtx$3(() => [...(_cache[108] || (_cache[108] = [
                _createTextVNode$3("覆盖试算", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]))
      : _createCommentVNode$3("", true),
    (props.mode !== 'naming' && section.value === 'rules')
      ? (_openBlock$3(), _createElementBlock$3("section", _hoisted_2$3, [
          _createElementVNode$3("div", _hoisted_3$3, [
            _createVNode$3(_component_VTextField, {
              modelValue: search.value,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((search).value = $event)),
              label: "搜索字段、名称或正则",
              "prepend-inner-icon": "mdi-magnify",
              clearable: "",
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createVNode$3(_component_VSelect, {
              modelValue: field.value,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((field).value = $event)),
              label: "识别字段",
              items: fieldItems.value,
              "hide-details": ""
            }, null, 8, ["modelValue", "items"]),
            _createVNode$3(_component_VSelect, {
              modelValue: source.value,
              "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((source).value = $event)),
              label: "规则来源",
              items: sourceItems,
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createElementVNode$3("div", _hoisted_4$3, [
              _createVNode$3(_component_VBtn, {
                variant: "tonal",
                "prepend-icon": "mdi-format-list-numbered",
                disabled: !rules.value.length,
                onClick: openBulkPriority
              }, {
                default: _withCtx$3(() => [...(_cache[109] || (_cache[109] = [
                  _createTextVNode$3("批量优先级", -1)
                ]))]),
                _: 1
              }, 8, ["disabled"]),
              _createVNode$3(_component_VBtn, {
                color: "primary",
                "prepend-icon": "mdi-plus",
                onClick: openNewRule
              }, {
                default: _withCtx$3(() => [...(_cache[110] || (_cache[110] = [
                  _createTextVNode$3("新增覆盖", -1)
                ]))]),
                _: 1
              })
            ])
          ]),
          _createElementVNode$3("div", _hoisted_5$3, "当前 MP 共读取 " + _toDisplayString$3(data.value.recognition_rules?.count || 0) + " 条，已覆盖 " + _toDisplayString$3(data.value.recognition_rules?.override_count || 0) + " 条；筛选结果 " + _toDisplayString$3(rules.value.length) + " 条。", 1),
          _createVNode$3(_component_VTable, {
            density: "comfortable",
            class: "tools-table"
          }, {
            default: _withCtx$3(() => [
              _cache[113] || (_cache[113] = _createElementVNode$3("thead", null, [
                _createElementVNode$3("tr", null, [
                  _createElementVNode$3("th", { style: {"width":"150px"} }, "字段"),
                  _createElementVNode$3("th", null, "MP 内置匹配内容"),
                  _createElementVNode$3("th", { style: {"width":"190px"} }, "来源"),
                  _createElementVNode$3("th", { style: {"width":"150px"} }, "操作")
                ])
              ], -1)),
              _createElementVNode$3("tbody", null, [
                (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(pagedRules.value, (item) => {
                  return (_openBlock$3(), _createElementBlock$3("tr", {
                    key: item.id
                  }, [
                    _createElementVNode$3("td", null, [
                      _createElementVNode$3("div", _hoisted_6$3, _toDisplayString$3(item.field_label), 1),
                      _createElementVNode$3("code", null, _toDisplayString$3(item.field), 1)
                    ]),
                    _createElementVNode$3("td", null, [
                      _createElementVNode$3("div", _hoisted_7$3, [
                        _createElementVNode$3("span", null, _toDisplayString$3(item.effective?.label || item.label), 1),
                        (item.overridden)
                          ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                              key: 0,
                              size: "x-small",
                              color: "warning",
                              variant: "tonal"
                            }, {
                              default: _withCtx$3(() => [...(_cache[111] || (_cache[111] = [
                                _createTextVNode$3("插件已覆盖", -1)
                              ]))]),
                              _: 1
                            }))
                          : _createCommentVNode$3("", true)
                      ]),
                      _createElementVNode$3("div", {
                        class: "rule-pattern",
                        title: item.effective?.pattern || item.pattern
                      }, _toDisplayString$3(item.effective?.pattern || item.pattern), 9, _hoisted_8$3),
                      (item.overridden && item.builtin && item.effective?.pattern !== item.pattern)
                        ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_9$3, "MP 原正则：" + _toDisplayString$3(item.pattern), 1))
                        : _createCommentVNode$3("", true),
                      _createElementVNode$3("div", _hoisted_10$3, _toDisplayString$3(item.effective?.action === 'clear' ? '命中后清空字段' : `输出：${item.effective?.value ?? item.value}`), 1)
                    ]),
                    _createElementVNode$3("td", null, [
                      _createVNode$3(_component_VChip, {
                        size: "small",
                        variant: "tonal"
                      }, {
                        default: _withCtx$3(() => [
                          _createTextVNode$3(_toDisplayString$3(item.source_label), 1)
                        ]),
                        _: 2
                      }, 1024),
                      (item.overridden)
                        ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_11$3, "插件优先级 " + _toDisplayString$3(item.effective?.priority ?? 100), 1))
                        : _createCommentVNode$3("", true)
                    ]),
                    _createElementVNode$3("td", null, [
                      _createVNode$3(_component_VBtn, {
                        size: "small",
                        variant: "tonal",
                        "prepend-icon": "mdi-pencil-outline",
                        onClick: $event => (openRule(item))
                      }, {
                        default: _withCtx$3(() => [...(_cache[112] || (_cache[112] = [
                          _createTextVNode$3("编辑", -1)
                        ]))]),
                        _: 1
                      }, 8, ["onClick"]),
                      (item.overridden)
                        ? (_openBlock$3(), _createBlock$3(_component_VBtn, {
                            key: 0,
                            size: "small",
                            variant: "text",
                            color: "warning",
                            loading: saving.value === `reset:${item.id}`,
                            onClick: $event => (resetRule(item))
                          }, {
                            default: _withCtx$3(() => [
                              _createTextVNode$3(_toDisplayString$3(item.builtin ? '恢复' : '删除'), 1)
                            ]),
                            _: 2
                          }, 1032, ["loading", "onClick"]))
                        : _createCommentVNode$3("", true)
                    ])
                  ]))
                }), 128))
              ])
            ]),
            _: 1
          }),
          (pageCount.value > 1)
            ? (_openBlock$3(), _createBlock$3(_component_VPagination, {
                key: 0,
                modelValue: page.value,
                "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((page).value = $event)),
                length: pageCount.value,
                "total-visible": 7,
                class: "mt-3"
              }, null, 8, ["modelValue", "length"]))
            : _createCommentVNode$3("", true)
        ]))
      : (section.value === 'groups')
        ? (_openBlock$3(), _createElementBlock$3("section", _hoisted_12$3, [
            _createElementVNode$3("div", _hoisted_13$3, [
              _createVNode$3(_component_VTextField, {
                modelValue: search.value,
                "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((search).value = $event)),
                label: "搜索制作组或正则",
                "prepend-inner-icon": "mdi-magnify",
                clearable: "",
                "hide-details": ""
              }, null, 8, ["modelValue"]),
              _createVNode$3(_component_VSelect, {
                modelValue: groupKind.value,
                "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((groupKind).value = $event)),
                label: "参与判断的类型",
                items: [{title:'全部类型',value:'all'}, ...kindItems],
                "hide-details": ""
              }, null, 8, ["modelValue", "items"])
            ]),
            _createVNode$3(_component_VTable, {
              density: "comfortable",
              class: "tools-table"
            }, {
              default: _withCtx$3(() => [
                _cache[114] || (_cache[114] = _createElementVNode$3("thead", null, [
                  _createElementVNode$3("tr", null, [
                    _createElementVNode$3("th", null, "制作组规则"),
                    _createElementVNode$3("th", null, "来源"),
                    _createElementVNode$3("th", { style: {"width":"230px"} }, "类型"),
                    _createElementVNode$3("th", { style: {"width":"150px"} }, "补充字段")
                  ])
                ], -1)),
                _createElementVNode$3("tbody", null, [
                  (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(pagedGroups.value, (item) => {
                    return (_openBlock$3(), _createElementBlock$3("tr", {
                      key: item.id
                    }, [
                      _createElementVNode$3("td", null, [
                        _createElementVNode$3("div", _hoisted_14$3, _toDisplayString$3(item.display_name), 1),
                        _createElementVNode$3("div", _hoisted_15$3, _toDisplayString$3(item.pattern), 1)
                      ]),
                      _createElementVNode$3("td", null, [
                        _createVNode$3(_component_VChip, {
                          size: "small",
                          variant: "tonal"
                        }, {
                          default: _withCtx$3(() => [
                            _createTextVNode$3(_toDisplayString$3(item.source_label) + " · " + _toDisplayString$3(item.category), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _createElementVNode$3("td", null, [
                        _createVNode$3(_component_VSelect, {
                          "model-value": item.kind,
                          items: kindItems,
                          density: "compact",
                          "hide-details": "",
                          loading: saving.value === item.id,
                          "onUpdate:modelValue": value => saveGroup(item, value)
                        }, {
                          selection: _withCtx$3(() => [
                            _createVNode$3(_component_VChip, {
                              size: "small",
                              color: kindColor(item.kind),
                              variant: "tonal"
                            }, {
                              default: _withCtx$3(() => [
                                _createTextVNode$3(_toDisplayString$3(kindLabel(item.kind)), 1)
                              ]),
                              _: 2
                            }, 1032, ["color"])
                          ]),
                          _: 2
                        }, 1032, ["model-value", "loading", "onUpdate:modelValue"])
                      ]),
                      _createElementVNode$3("td", null, [
                        _createVNode$3(_component_VBtn, {
                          size: "small",
                          variant: "tonal",
                          "prepend-icon": "mdi-tune-variant",
                          onClick: $event => (openGroupProfile(item))
                        }, {
                          default: _withCtx$3(() => [
                            _createTextVNode$3(_toDisplayString$3(Object.keys(item.field_values || {}).length + Object.keys(item.custom_field_values || {}).length ? `${Object.keys(item.field_values || {}).length + Object.keys(item.custom_field_values || {}).length} 项` : '设置'), 1)
                          ]),
                          _: 2
                        }, 1032, ["onClick"])
                      ])
                    ]))
                  }), 128))
                ])
              ]),
              _: 1
            }),
            (groupPageCount.value > 1)
              ? (_openBlock$3(), _createBlock$3(_component_VPagination, {
                  key: 0,
                  modelValue: page.value,
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((page).value = $event)),
                  length: groupPageCount.value,
                  "total-visible": 7,
                  class: "mt-3"
                }, null, 8, ["modelValue", "length"]))
              : _createCommentVNode$3("", true)
          ]))
        : (props.mode === 'metadata' && section.value === 'arrange')
          ? (_openBlock$3(), _createElementBlock$3("section", _hoisted_16$3, [
              _createElementVNode$3("div", _hoisted_17$3, [
                _createVNode$3(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact",
                  class: "flex-grow-1 mb-0"
                }, {
                  default: _withCtx$3(() => [...(_cache[115] || (_cache[115] = [
                    _createTextVNode$3("为每个制作组指定别名、最终名称、固定位置和它前面的连接符；未配置的组保持原名与相对顺序。属于「命名规则」模块，随其总开关生效；连接符默认值在命名规则 → 连接与分隔中设置。", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VBtn, {
                  color: "primary",
                  "prepend-icon": "mdi-plus",
                  onClick: _cache[16] || (_cache[16] = $event => (openGroupArrangement()))
                }, {
                  default: _withCtx$3(() => [...(_cache[116] || (_cache[116] = [
                    _createTextVNode$3("新增制作组规则", -1)
                  ]))]),
                  _: 1
                })
              ]),
              (data.value.release_group_arrangements?.errors?.length)
                ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                    key: 0,
                    type: "warning",
                    variant: "tonal",
                    density: "compact",
                    class: "mb-4"
                  }, {
                    default: _withCtx$3(() => [
                      _createTextVNode$3(_toDisplayString$3(data.value.release_group_arrangements.errors.join('；')), 1)
                    ]),
                    _: 1
                  }))
                : _createCommentVNode$3("", true),
              (groupArrangementRules.value.length)
                ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_18$2, [
                    (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(groupArrangementRules.value, (item) => {
                      return (_openBlock$3(), _createBlock$3(_component_VCard, {
                        key: item.id,
                        variant: "outlined",
                        class: "mapping-card"
                      }, {
                        default: _withCtx$3(() => [
                          _createVNode$3(_component_VCardText, { class: "group-layout-card" }, {
                            default: _withCtx$3(() => [
                              _createElementVNode$3("div", _hoisted_19$2, [
                                _createElementVNode$3("div", _hoisted_20$2, [
                                  _createElementVNode$3("span", _hoisted_21$2, _toDisplayString$3(item.label || item.output_name), 1),
                                  _createVNode$3(_component_VChip, {
                                    size: "x-small",
                                    color: "primary",
                                    variant: "tonal"
                                  }, {
                                    default: _withCtx$3(() => [
                                      _createTextVNode$3(_toDisplayString$3(groupPositionLabel(item.position)), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  (!item.enabled)
                                    ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                        key: 0,
                                        size: "x-small",
                                        variant: "tonal"
                                      }, {
                                        default: _withCtx$3(() => [...(_cache[117] || (_cache[117] = [
                                          _createTextVNode$3("已停用", -1)
                                        ]))]),
                                        _: 1
                                      }))
                                    : _createCommentVNode$3("", true)
                                ]),
                                _createElementVNode$3("div", _hoisted_22$2, [
                                  _createElementVNode$3("code", null, _toDisplayString$3(item.match_name), 1),
                                  _createVNode$3(_component_VIcon, {
                                    icon: "mdi-arrow-right",
                                    size: "16"
                                  }),
                                  _createElementVNode$3("code", null, _toDisplayString$3(item.output_name), 1)
                                ]),
                                _createElementVNode$3("div", _hoisted_23$2, [
                                  _createTextVNode$3("别名 " + _toDisplayString$3(item.aliases?.length ? item.aliases.join('、') : '无') + " · 前置连接符 ", 1),
                                  _createElementVNode$3("code", null, _toDisplayString$3(item.connector === '__default__' ? `继承标题／默认（${config.value.release_group_default_connector === ' ' ? '空格' : config.value.release_group_default_connector || '@'}）` : item.connector === ' ' ? '空格' : item.connector || '无'), 1),
                                  _createTextVNode$3(" · 排序值 " + _toDisplayString$3(item.order), 1)
                                ])
                              ]),
                              _createElementVNode$3("div", _hoisted_24$2, [
                                _createVNode$3(_component_VBtn, {
                                  icon: "mdi-pencil-outline",
                                  size: "small",
                                  variant: "text",
                                  onClick: $event => (openGroupArrangement(item))
                                }, null, 8, ["onClick"]),
                                _createVNode$3(_component_VBtn, {
                                  icon: "mdi-delete-outline",
                                  size: "small",
                                  color: "error",
                                  variant: "text",
                                  loading: saving.value === `group-arrangement-delete:${item.id}`,
                                  onClick: $event => (deleteGroupArrangement(item))
                                }, null, 8, ["loading", "onClick"])
                              ])
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024))
                    }), 128))
                  ]))
                : (_openBlock$3(), _createElementBlock$3("div", _hoisted_25$2, [
                    _createVNode$3(_component_VIcon, {
                      icon: "mdi-account-switch-outline",
                      size: "48"
                    }),
                    _cache[118] || (_cache[118] = _createElementVNode$3("div", { class: "mt-2" }, "尚未设置制作组编排", -1)),
                    _cache[119] || (_cache[119] = _createElementVNode$3("div", { class: "text-caption mt-1" }, "例如让 VCB-Studio 固定最后并使用 &，让 ADWeb 固定最后并使用 @", -1))
                  ])),
              _createVNode$3(_component_VCard, {
                variant: "outlined",
                class: "mt-4"
              }, {
                default: _withCtx$3(() => [
                  _createVNode$3(_component_VCardItem, null, {
                    default: _withCtx$3(() => [
                      _createVNode$3(_component_VCardTitle, null, {
                        default: _withCtx$3(() => [...(_cache[120] || (_cache[120] = [
                          _createTextVNode$3("制作组编排试算", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode$3(_component_VCardSubtitle, null, {
                        default: _withCtx$3(() => [...(_cache[121] || (_cache[121] = [
                          _createTextVNode$3("按 MP 的 releaseGroup 字段格式输入，支持 @、&、+ 形式。", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  _createVNode$3(_component_VCardText, null, {
                    default: _withCtx$3(() => [
                      _createElementVNode$3("div", _hoisted_26$2, [
                        _createVNode$3(_component_VTextField, {
                          modelValue: groupArrangementPreviewInput.value,
                          "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((groupArrangementPreviewInput).value = $event)),
                          label: "输入制作组",
                          placeholder: "ADWeb@A@VCB",
                          "hide-details": ""
                        }, null, 8, ["modelValue"]),
                        _createVNode$3(_component_VBtn, {
                          color: "secondary",
                          "prepend-icon": "mdi-play",
                          loading: saving.value === 'group-arrangement-preview',
                          onClick: previewGroupArrangement
                        }, {
                          default: _withCtx$3(() => [...(_cache[122] || (_cache[122] = [
                            _createTextVNode$3("开始试算", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      (groupArrangementPreview.value)
                        ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                            key: 0,
                            type: groupArrangementPreview.value.trace?.applied ? 'success' : 'info',
                            variant: "tonal",
                            class: "mt-4"
                          }, {
                            default: _withCtx$3(() => [
                              _createElementVNode$3("div", null, [
                                _cache[123] || (_cache[123] = _createTextVNode$3("输出：", -1)),
                                _createElementVNode$3("code", null, _toDisplayString$3(groupArrangementPreview.value.output), 1)
                              ]),
                              _createElementVNode$3("div", _hoisted_27$2, _toDisplayString$3(groupArrangementPreview.value.trace?.reason), 1),
                              (groupArrangementPreview.value.trace?.members?.length)
                                ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_28$2, [
                                    (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(groupArrangementPreview.value.trace.members, (member, index) => {
                                      return (_openBlock$3(), _createBlock$3(_component_VChip, {
                                        key: `${member.output}-${index}`,
                                        size: "small",
                                        variant: "tonal"
                                      }, {
                                        default: _withCtx$3(() => [
                                          index
                                            ? (_openBlock$3(), _createElementBlock$3("span", _hoisted_29$2, _toDisplayString$3(member.connector === ' ' ? '空格' : member.connector), 1))
                                            : _createCommentVNode$3("", true),
                                          _createTextVNode$3(_toDisplayString$3(member.output) + " · " + _toDisplayString$3(groupPositionLabel(member.position)), 1)
                                        ]),
                                        _: 2
                                      }, 1024))
                                    }), 128))
                                  ]))
                                : _createCommentVNode$3("", true)
                            ]),
                            _: 1
                          }, 8, ["type"]))
                        : _createCommentVNode$3("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]))
          : (props.mode === 'probe' && section.value === 'probe')
            ? (_openBlock$3(), _createElementBlock$3("section", _hoisted_30$2, [
                _createVNode$3(_component_VTabs, {
                  modelValue: probeSection.value,
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((probeSection).value = $event)),
                  color: "primary",
                  class: "sub-tabs mb-4"
                }, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VTab, {
                      value: "scan",
                      "prepend-icon": "mdi-waveform"
                    }, {
                      default: _withCtx$3(() => [...(_cache[124] || (_cache[124] = [
                        _createTextVNode$3("媒体扫描", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$3(_component_VTab, {
                      value: "strm",
                      "prepend-icon": "mdi-server-network"
                    }, {
                      default: _withCtx$3(() => [
                        _cache[126] || (_cache[126] = _createTextVNode$3(" 神医联动 ", -1)),
                        _createVNode$3(_component_VChip, {
                          size: "x-small",
                          color: "primary",
                          variant: "tonal",
                          class: "ms-2"
                        }, {
                          default: _withCtx$3(() => [...(_cache[125] || (_cache[125] = [
                            _createTextVNode$3("Pro", -1)
                          ]))]),
                          _: 1
                        }),
                        (Number(strmSync.value.counts?.pending || 0))
                          ? (_openBlock$3(), _createBlock$3(_component_VBadge, {
                              key: 0,
                              content: strmSync.value.counts.pending,
                              color: "warning",
                              inline: "",
                              class: "ms-2"
                            }, null, 8, ["content"]))
                          : _createCommentVNode$3("", true)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                (probeSection.value === 'scan')
                  ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_31$2, [
                      _createVNode$3(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card probe-strategy-card"
                      }, {
                        default: _withCtx$3(() => [
                          _createVNode$3(_component_VCardItem, null, {
                            prepend: _withCtx$3(() => [
                              _createVNode$3(_component_VAvatar, {
                                color: "primary",
                                variant: "tonal",
                                size: "38"
                              }, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VIcon, {
                                    icon: "mdi-tune-vertical",
                                    size: "21"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            append: _withCtx$3(() => [
                              _createVNode$3(_component_VChip, {
                                size: "small",
                                color: "primary",
                                variant: "tonal"
                              }, {
                                default: _withCtx$3(() => [
                                  _createTextVNode$3(_toDisplayString$3(selectedProbeFieldItems.value.length) + " / " + _toDisplayString$3(mediaProbeFieldItems.length), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx$3(() => [...(_cache[127] || (_cache[127] = [
                                  _createTextVNode$3("字段输出策略", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode$3(_component_VCardSubtitle, null, {
                                default: _withCtx$3(() => [...(_cache[128] || (_cache[128] = [
                                  _createTextVNode$3("ffprobe 始终完整扫描；这里只决定哪些结果参与命名以及如何写回 MP 字段。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode$3(_component_VCardText, { class: "probe-config-body" }, {
                            default: _withCtx$3(() => [
                              (!mediaProbeBackendSupported.value)
                                ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                    key: 0,
                                    type: "error",
                                    variant: "tonal",
                                    density: "compact"
                                  }, {
                                    append: _withCtx$3(() => [
                                      _createVNode$3(_component_VBtn, {
                                        size: "small",
                                        color: "error",
                                        variant: "flat",
                                        "prepend-icon": "mdi-restart",
                                        loading: saving.value === 'plugin-reload',
                                        onClick: reloadPlugin
                                      }, {
                                        default: _withCtx$3(() => [...(_cache[129] || (_cache[129] = [
                                          _createTextVNode$3("重载插件后端", -1)
                                        ]))]),
                                        _: 1
                                      }, 8, ["loading"])
                                    ]),
                                    default: _withCtx$3(() => [
                                      _cache[130] || (_cache[130] = _createTextVNode$3(" 新版页面已加载，但插件后端仍是旧实例，因此字段目录显示为空且能力会被误报为 unavailable。 ", -1))
                                    ]),
                                    _: 1
                                  }))
                                : (!data.value.media_probe?.available)
                                  ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                      key: 1,
                                      type: "warning",
                                      variant: "tonal",
                                      density: "compact"
                                    }, {
                                      default: _withCtx$3(() => [
                                        _createTextVNode$3(_toDisplayString$3(data.value.media_probe?.message), 1)
                                      ]),
                                      _: 1
                                    }))
                                  : _createCommentVNode$3("", true),
                              _createElementVNode$3("div", _hoisted_32$2, [
                                (selectedProbeFieldItems.value.length)
                                  ? (_openBlock$3(true), _createElementBlock$3(_Fragment$3, { key: 0 }, _renderList$3(selectedProbeFieldItems.value, (item) => {
                                      return (_openBlock$3(), _createBlock$3(_component_VChip, {
                                        key: item.key,
                                        size: "small",
                                        color: "secondary",
                                        variant: "tonal"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createTextVNode$3(_toDisplayString$3(item.label), 1),
                                          _createElementVNode$3("span", _hoisted_33$2, _toDisplayString$3(fieldPolicyItems.find(policy => policy.value === probeFieldPolicy(item.key))?.title), 1)
                                        ]),
                                        _: 2
                                      }, 1024))
                                    }), 128))
                                  : (_openBlock$3(), _createElementBlock$3("div", _hoisted_34$2, [
                                      _createVNode$3(_component_VIcon, {
                                        icon: "mdi-selection-off",
                                        size: "18"
                                      }),
                                      _cache[131] || (_cache[131] = _createTextVNode$3(" 未选择命名输出项；神医联动仍会使用完整扫描结果", -1))
                                    ]))
                              ]),
                              _createVNode$3(_component_VExpansionPanels, {
                                variant: "accordion",
                                multiple: "",
                                class: "probe-panels"
                              }, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VExpansionPanel, null, {
                                    default: _withCtx$3(() => [
                                      _createVNode$3(_component_VExpansionPanelTitle, null, {
                                        default: _withCtx$3(() => [...(_cache[132] || (_cache[132] = [
                                          _createElementVNode$3("div", null, [
                                            _createElementVNode$3("div", { class: "font-weight-medium" }, "命名字段输出"),
                                            _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, "选择写入 MP/Jinja 上下文的字段，并设置补空、覆盖或追加")
                                          ], -1)
                                        ]))]),
                                        _: 1
                                      }),
                                      _createVNode$3(_component_VExpansionPanelText, null, {
                                        default: _withCtx$3(() => [
                                          _createElementVNode$3("div", _hoisted_35$2, [
                                            (_openBlock$3(), _createElementBlock$3(_Fragment$3, null, _renderList$3(mediaProbeFieldItems, (item) => {
                                              return _createElementVNode$3("div", {
                                                key: item.key,
                                                class: "probe-field-row"
                                              }, [
                                                _createElementVNode$3("div", _hoisted_36$2, [
                                                  _createElementVNode$3("div", _hoisted_37$2, [
                                                    _createTextVNode$3(_toDisplayString$3(item.label) + " ", 1),
                                                    _createElementVNode$3("code", null, _toDisplayString$3(item.target), 1)
                                                  ]),
                                                  _createElementVNode$3("div", _hoisted_38$2, _toDisplayString$3(item.detail), 1)
                                                ]),
                                                _createElementVNode$3("div", _hoisted_39$2, [
                                                  _createVNode$3(_component_VSelect, {
                                                    "model-value": probeFieldPolicy(item.key),
                                                    items: fieldPolicyItems,
                                                    density: "compact",
                                                    "hide-details": "",
                                                    class: "probe-policy-select",
                                                    disabled: !probeFieldSelected(item.key),
                                                    "onUpdate:modelValue": value => setProbeFieldPolicy(item.key, value)
                                                  }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                                                  _createVNode$3(_component_VCheckboxBtn, {
                                                    "model-value": probeFieldSelected(item.key),
                                                    color: "primary",
                                                    "onUpdate:modelValue": value => toggleProbeField(item.key, value)
                                                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                                                ])
                                              ])
                                            }), 64))
                                          ]),
                                          _createVNode$3(_component_VAlert, {
                                            type: "info",
                                            variant: "tonal",
                                            density: "compact",
                                            class: "mt-3"
                                          }, {
                                            default: _withCtx$3(() => [...(_cache[133] || (_cache[133] = [
                                              _createTextVNode$3("追加模式保留原标题/MP 已识别值并去重添加扫描值，例如 ", -1),
                                              _createElementVNode$3("code", null, "HDR10 + DOVI → HDR10 DOVI", -1),
                                              _createTextVNode$3("；字幕映射按自定义占位符连接符追加。", -1)
                                            ]))]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  (probeFieldSelected('subtitle'))
                                    ? (_openBlock$3(), _createBlock$3(_component_VExpansionPanel, { key: 0 }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VExpansionPanelTitle, null, {
                                            default: _withCtx$3(() => [...(_cache[134] || (_cache[134] = [
                                              _createElementVNode$3("div", null, [
                                                _createElementVNode$3("div", { class: "font-weight-medium" }, "字幕语言映射"),
                                                _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, "把内封字幕轨组合映射为 customization 或 Jinja 扫描变量")
                                              ], -1)
                                            ]))]),
                                            _: 1
                                          }),
                                          _createVNode$3(_component_VExpansionPanelText, null, {
                                            default: _withCtx$3(() => [
                                              _createElementVNode$3("div", _hoisted_40$2, [
                                                _createVNode$3(_component_VSwitch, {
                                                  modelValue: config.value.media_probe_subtitle_to_customization,
                                                  "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((config.value.media_probe_subtitle_to_customization) = $event)),
                                                  color: "secondary",
                                                  label: "将字幕映射结果写入 customization",
                                                  "hide-details": ""
                                                }, null, 8, ["modelValue"]),
                                                _createVNode$3(_component_VTextarea, {
                                                  modelValue: config.value.media_probe_subtitle_rules,
                                                  "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((config.value.media_probe_subtitle_rules) = $event)),
                                                  label: "字幕组合映射（每行一条，首条命中生效；未命中自动回退为语言组合）",
                                                  rows: "4",
                                                  "auto-grow": "",
                                                  placeholder: "中文 => 中字内封",
                                                  hint: "未命中规则时自动生成语言组合（简繁日内封等），只需为想改名的组合写规则。「简体+繁体+日语」与「简日+繁日」写法可互相命中；「包含:简体+日语 => 简日内封」为子集匹配；「>=4 => 多国字幕」按语言数量。",
                                                  "persistent-hint": ""
                                                }, null, 8, ["modelValue"]),
                                                _cache[135] || (_cache[135] = _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, "可扫描 MKV/MP4 中独立存在的内封字幕流；烧录进画面的硬字幕没有字幕轨，ffprobe 无法判断语言。", -1))
                                              ])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }))
                                    : _createCommentVNode$3("", true),
                                  _createVNode$3(_component_VExpansionPanel, null, {
                                    default: _withCtx$3(() => [
                                      _createVNode$3(_component_VExpansionPanelTitle, null, {
                                        default: _withCtx$3(() => [...(_cache[136] || (_cache[136] = [
                                          _createElementVNode$3("div", null, [
                                            _createElementVNode$3("div", { class: "font-weight-medium" }, "高级设置与 ffprobe"),
                                            _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, "超时、自定义程序路径和安装诊断")
                                          ], -1)
                                        ]))]),
                                        _: 1
                                      }),
                                      _createVNode$3(_component_VExpansionPanelText, null, {
                                        default: _withCtx$3(() => [
                                          _createElementVNode$3("div", _hoisted_41$2, [
                                            _createVNode$3(_component_VTextField, {
                                              modelValue: config.value.media_probe_timeout,
                                              "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((config.value.media_probe_timeout) = $event)),
                                              modelModifiers: { number: true },
                                              type: "number",
                                              min: "3",
                                              max: "30",
                                              label: "单文件超时（秒）",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue"]),
                                            _createVNode$3(_component_VTextField, {
                                              modelValue: config.value.media_probe_executable,
                                              "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((config.value.media_probe_executable) = $event)),
                                              label: "自定义 ffprobe 路径（通常留空）",
                                              placeholder: "/usr/local/bin/ffprobe",
                                              clearable: "",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue"])
                                          ]),
                                          (mediaProbeBackendSupported.value && !data.value.media_probe?.available)
                                            ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_42$2, [
                                                _cache[138] || (_cache[138] = _createElementVNode$3("div", { class: "text-body-2 mb-2" }, [
                                                  _createTextVNode$3("MoviePilot 当前官方 Dockerfile 已包含 "),
                                                  _createElementVNode$3("code", null, "/usr/local/bin/ffprobe"),
                                                  _createTextVNode$3("。不可用通常表示旧镜像或自定义镜像遗漏。")
                                                ], -1)),
                                                _cache[139] || (_cache[139] = _createElementVNode$3("ol", { class: "ffprobe-help" }, [
                                                  _createElementVNode$3("li", null, "拉取当前 MoviePilot 镜像并重新创建容器。"),
                                                  _createElementVNode$3("li", null, "自定义镜像可继承官方镜像，或持久挂载 ffprobe。"),
                                                  _createElementVNode$3("li", null, [
                                                    _createTextVNode$3("容器内执行 "),
                                                    _createElementVNode$3("code", null, "ffprobe -version"),
                                                    _createTextVNode$3(" 验证。")
                                                  ])
                                                ], -1)),
                                                _createVNode$3(_component_VAlert, {
                                                  type: "warning",
                                                  variant: "tonal",
                                                  density: "compact",
                                                  class: "mt-3"
                                                }, {
                                                  default: _withCtx$3(() => [...(_cache[137] || (_cache[137] = [
                                                    _createTextVNode$3("常规扫描不会自动下载可执行文件；只有下方「ISO 原盘探测」显式开启后才会下载专用静态 ffprobe。", -1)
                                                  ]))]),
                                                  _: 1
                                                })
                                              ]))
                                            : _createCommentVNode$3("", true)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  _createVNode$3(_component_VExpansionPanel, null, {
                                    default: _withCtx$3(() => [
                                      _createVNode$3(_component_VExpansionPanelTitle, null, {
                                        default: _withCtx$3(() => [
                                          _createElementVNode$3("div", null, [
                                            _createElementVNode$3("div", _hoisted_43$2, [
                                              _cache[140] || (_cache[140] = _createTextVNode$3("ISO 原盘探测 ", -1)),
                                              _createVNode$3(_component_VChip, {
                                                size: "x-small",
                                                color: staticFfprobe.value.installed ? 'success' : config.value.media_probe_iso_enabled ? 'warning' : 'default',
                                                variant: "tonal",
                                                class: "ms-1"
                                              }, {
                                                default: _withCtx$3(() => [
                                                  _createTextVNode$3(_toDisplayString$3(staticFfprobe.value.installed ? '已就绪' : staticFfprobe.value.installing ? '下载中' : config.value.media_probe_iso_enabled ? '未就绪' : '未启用'), 1)
                                                ]),
                                                _: 1
                                              }, 8, ["color"])
                                            ]),
                                            _cache[141] || (_cache[141] = _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, "自动下载带蓝光支持的静态 ffprobe，仅接管 .iso 文件的媒体流提取", -1))
                                          ])
                                        ]),
                                        _: 1
                                      }),
                                      _createVNode$3(_component_VExpansionPanelText, null, {
                                        default: _withCtx$3(() => [
                                          _createElementVNode$3("div", _hoisted_44$2, [
                                            _createVNode$3(_component_VSwitch, {
                                              modelValue: config.value.media_probe_iso_enabled,
                                              "onUpdate:modelValue": [
                                                _cache[23] || (_cache[23] = $event => ((config.value.media_probe_iso_enabled) = $event)),
                                                _cache[24] || (_cache[24] = value => value && installStaticFfprobe(true))
                                              ],
                                              color: "secondary",
                                              label: "启用 ISO 原盘探测（保存设置后自动下载安装）",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue"]),
                                            _createVNode$3(_component_VAlert, {
                                              type: "info",
                                              variant: "tonal",
                                              density: "compact",
                                              class: "probe-help-alert"
                                            }, {
                                              default: _withCtx$3(() => [
                                                _cache[142] || (_cache[142] = _createTextVNode$3("容器自带的 ffprobe 没有 libbluray，读不出 ISO 原盘的播放列表。开启后插件从 ", -1)),
                                                _cache[143] || (_cache[143] = _createElementVNode$3("a", {
                                                  href: "https://github.com/sjtuross/StrmAssistant.Releases/tree/main/static-ffprobe",
                                                  target: "_blank",
                                                  rel: "noopener"
                                                }, "StrmAssistant.Releases", -1)),
                                                _createTextVNode$3(" 下载对应平台的静态构建（v" + _toDisplayString$3(staticFfprobe.value.version || '8.1.2') + "）到插件数据目录，", 1),
                                                _cache[144] || (_cache[144] = _createElementVNode$3("strong", null, "只用于 .iso 文件", -1)),
                                                _cache[145] || (_cache[145] = _createTextVNode$3("，普通视频仍走原 ffprobe；卸载插件删除数据目录即可清除。下载走 MP 的 GITHUB_PROXY 与代理设置。", -1))
                                              ]),
                                              _: 1
                                            }),
                                            (config.value.media_probe_iso_enabled)
                                              ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_45$2, [
                                                  _createVNode$3(_component_VChip, {
                                                    size: "small",
                                                    color: staticFfprobe.value.installed ? 'success' : staticFfprobe.value.installing ? 'info' : 'warning',
                                                    variant: "tonal",
                                                    "prepend-icon": staticFfprobe.value.installed ? 'mdi-check-circle-outline' : staticFfprobe.value.installing ? 'mdi-progress-download' : 'mdi-alert-circle-outline',
                                                    class: "static-ffprobe-chip"
                                                  }, {
                                                    default: _withCtx$3(() => [
                                                      _createTextVNode$3(_toDisplayString$3(staticFfprobe.value.installed ? `已安装：${staticFfprobe.value.path}` : staticFfprobe.value.installing ? '正在后台下载安装……' : staticFfprobe.value.last_error || '尚未安装'), 1)
                                                    ]),
                                                    _: 1
                                                  }, 8, ["color", "prepend-icon"]),
                                                  (!staticFfprobe.value.installed)
                                                    ? (_openBlock$3(), _createBlock$3(_component_VBtn, {
                                                        key: 0,
                                                        size: "small",
                                                        variant: "tonal",
                                                        "prepend-icon": "mdi-download",
                                                        loading: saving.value === 'static-ffprobe' || staticFfprobe.value.installing,
                                                        onClick: _cache[25] || (_cache[25] = $event => (installStaticFfprobe(false)))
                                                      }, {
                                                        default: _withCtx$3(() => [
                                                          _createTextVNode$3(_toDisplayString$3(staticFfprobe.value.last_error ? '重试下载' : '立即下载'), 1)
                                                        ]),
                                                        _: 1
                                                      }, 8, ["loading"]))
                                                    : _createCommentVNode$3("", true)
                                                ]))
                                              : _createCommentVNode$3("", true)
                                          ])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              _createElementVNode$3("div", _hoisted_46$2, [
                                _cache[147] || (_cache[147] = _createElementVNode$3("span", { class: "text-caption text-medium-emphasis" }, "设置只影响新进入整理流程的文件", -1)),
                                _createVNode$3(_component_VBtn, {
                                  color: "primary",
                                  variant: "tonal",
                                  "prepend-icon": "mdi-content-save",
                                  loading: __props.savingConfig,
                                  onClick: _cache[26] || (_cache[26] = $event => (emit('save-config')))
                                }, {
                                  default: _withCtx$3(() => [...(_cache[146] || (_cache[146] = [
                                    _createTextVNode$3("保存策略", -1)
                                  ]))]),
                                  _: 1
                                }, 8, ["loading"])
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode$3(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card probe-trial-card"
                      }, {
                        default: _withCtx$3(() => [
                          _createVNode$3(_component_VCardItem, null, {
                            prepend: _withCtx$3(() => [
                              _createVNode$3(_component_VAvatar, {
                                color: "secondary",
                                variant: "tonal",
                                size: "38"
                              }, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VIcon, {
                                    icon: "mdi-file-search-outline",
                                    size: "21"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx$3(() => [...(_cache[148] || (_cache[148] = [
                                  _createTextVNode$3("文件试扫", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode$3(_component_VCardSubtitle, null, {
                                default: _withCtx$3(() => [...(_cache[149] || (_cache[149] = [
                                  _createTextVNode$3("读取 MP 容器内的真实文件，只分析媒体流，不修改文件。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode$3(_component_VCardText, { class: "probe-config-body" }, {
                            default: _withCtx$3(() => [
                              _createElementVNode$3("div", _hoisted_47$2, [
                                _createVNode$3(_component_VTextField, {
                                  modelValue: probePath.value,
                                  "onUpdate:modelValue": _cache[27] || (_cache[27] = $event => ((probePath).value = $event)),
                                  label: "容器内文件路径",
                                  placeholder: "/downloads/anime/Example.mkv",
                                  "prepend-inner-icon": "mdi-file-video-outline",
                                  "hide-details": ""
                                }, null, 8, ["modelValue"]),
                                _createVNode$3(MediaFilePicker, {
                                  modelValue: probePath.value,
                                  "onUpdate:modelValue": _cache[28] || (_cache[28] = $event => ((probePath).value = $event)),
                                  api: props.api
                                }, null, 8, ["modelValue", "api"])
                              ]),
                              _createElementVNode$3("div", _hoisted_48$2, [
                                _createVNode$3(_component_VBtn, {
                                  color: "secondary",
                                  "prepend-icon": "mdi-waveform",
                                  loading: saving.value === 'media-probe',
                                  disabled: !probePath.value,
                                  onClick: previewMediaProbe
                                }, {
                                  default: _withCtx$3(() => [...(_cache[150] || (_cache[150] = [
                                    _createTextVNode$3("开始扫描", -1)
                                  ]))]),
                                  _: 1
                                }, 8, ["loading", "disabled"]),
                                _createVNode$3(_component_VSwitch, {
                                  modelValue: probeForce.value,
                                  "onUpdate:modelValue": _cache[29] || (_cache[29] = $event => ((probeForce).value = $event)),
                                  label: "忽略缓存",
                                  density: "compact",
                                  color: "secondary",
                                  "hide-details": "",
                                  class: "probe-force-switch"
                                }, null, 8, ["modelValue"]),
                                _createVNode$3(_component_VTooltip, {
                                  text: "清空 ffprobe 扫描结果缓存；下次整理或试扫会重新读取文件",
                                  location: "top"
                                }, {
                                  activator: _withCtx$3(({ props: tip }) => [
                                    _createVNode$3(_component_VBtn, _mergeProps$1(tip, {
                                      variant: "text",
                                      size: "small",
                                      "prepend-icon": "mdi-broom",
                                      loading: saving.value === 'probe-cache',
                                      onClick: clearProbeCache
                                    }), {
                                      default: _withCtx$3(() => [
                                        _createTextVNode$3("清除缓存" + _toDisplayString$3(data.value.media_probe?.cache_entries ? `（${data.value.media_probe.cache_entries}）` : ''), 1)
                                      ]),
                                      _: 1
                                    }, 16, ["loading"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              (probeCacheNotice.value)
                                ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                    key: 0,
                                    type: "success",
                                    variant: "tonal",
                                    density: "compact",
                                    closable: "",
                                    "onClick:close": _cache[30] || (_cache[30] = $event => (probeCacheNotice.value = ''))
                                  }, {
                                    default: _withCtx$3(() => [
                                      _createTextVNode$3(_toDisplayString$3(probeCacheNotice.value), 1)
                                    ]),
                                    _: 1
                                  }))
                                : _createCommentVNode$3("", true),
                              (probeResult.value)
                                ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 1 }, [
                                    _createElementVNode$3("div", _hoisted_49$2, [
                                      _createElementVNode$3("div", _hoisted_50$1, [
                                        _createVNode$3(_component_VIcon, {
                                          icon: "mdi-file-video-outline",
                                          color: "secondary"
                                        }),
                                        _createElementVNode$3("div", null, [
                                          _cache[151] || (_cache[151] = _createElementVNode$3("span", null, "扫描完成", -1)),
                                          _createElementVNode$3("strong", { title: probePath.value }, _toDisplayString$3(probeFileName.value), 9, _hoisted_51$1)
                                        ])
                                      ]),
                                      _createElementVNode$3("div", _hoisted_52$1, [
                                        _createElementVNode$3("span", null, [
                                          _createVNode$3(_component_VIcon, {
                                            icon: "mdi-video-outline",
                                            size: "16"
                                          }),
                                          _createTextVNode$3(" " + _toDisplayString$3(probeResult.value.streams?.video || 0) + " 视频", 1)
                                        ]),
                                        _createElementVNode$3("span", null, [
                                          _createVNode$3(_component_VIcon, {
                                            icon: "mdi-volume-high",
                                            size: "16"
                                          }),
                                          _createTextVNode$3(" " + _toDisplayString$3(probeResult.value.streams?.audio || 0) + " 音频", 1)
                                        ]),
                                        _createElementVNode$3("span", null, [
                                          _createVNode$3(_component_VIcon, {
                                            icon: "mdi-subtitles-outline",
                                            size: "16"
                                          }),
                                          _createTextVNode$3(" " + _toDisplayString$3(probeResult.value.streams?.subtitle || 0) + " 字幕", 1)
                                        ]),
                                        (probeResult.value.cached)
                                          ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                              key: 0,
                                              size: "x-small",
                                              variant: "tonal"
                                            }, {
                                              default: _withCtx$3(() => [...(_cache[152] || (_cache[152] = [
                                                _createTextVNode$3("缓存", -1)
                                              ]))]),
                                              _: 1
                                            }))
                                          : _createCommentVNode$3("", true)
                                      ])
                                    ]),
                                    (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(probeResult.value.diagnostics || [], (item) => {
                                      return (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                        key: item.code,
                                        type: item.level === 'warning' ? 'warning' : 'info',
                                        variant: "tonal",
                                        density: "compact"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createTextVNode$3(_toDisplayString$3(item.message), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["type"]))
                                    }), 128)),
                                    (probeStandardPreviewItems.value.length)
                                      ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_53$1, [
                                          _cache[153] || (_cache[153] = _createElementVNode$3("div", { class: "probe-section-heading" }, [
                                            _createElementVNode$3("div", null, [
                                              _createElementVNode$3("span", null, "写入字段预览"),
                                              _createElementVNode$3("small", null, "根据当前策略准备写入 MoviePilot 的值")
                                            ])
                                          ], -1)),
                                          _createElementVNode$3("div", _hoisted_54$1, [
                                            (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(probeStandardPreviewItems.value, (item) => {
                                              return (_openBlock$3(), _createElementBlock$3("div", {
                                                key: item.key,
                                                class: "probe-result-row"
                                              }, [
                                                _createElementVNode$3("div", {
                                                  class: _normalizeClass$2(["probe-summary-icon", `text-${probeSummaryPresentation(item.key).color}`])
                                                }, [
                                                  _createVNode$3(_component_VIcon, {
                                                    icon: probeSummaryPresentation(item.key).icon,
                                                    size: "19"
                                                  }, null, 8, ["icon"])
                                                ], 2),
                                                _createElementVNode$3("div", null, [
                                                  _createElementVNode$3("span", null, _toDisplayString$3(item.label), 1),
                                                  _createElementVNode$3("strong", null, _toDisplayString$3(probeValuePresent(item.value) ? item.value : '未读取'), 1)
                                                ])
                                              ]))
                                            }), 128))
                                          ])
                                        ]))
                                      : _createCommentVNode$3("", true),
                                    _createVNode$3(_component_VExpansionPanels, {
                                      variant: "accordion",
                                      class: "probe-variable-panel"
                                    }, {
                                      default: _withCtx$3(() => [
                                        _createVNode$3(_component_VExpansionPanel, null, {
                                          default: _withCtx$3(() => [
                                            _createVNode$3(_component_VExpansionPanelTitle, null, {
                                              default: _withCtx$3(() => [
                                                _createElementVNode$3("div", _hoisted_55$1, [
                                                  _createElementVNode$3("div", null, [
                                                    _cache[154] || (_cache[154] = _createElementVNode$3("div", { class: "font-weight-medium" }, "Jinja2 扫描变量", -1)),
                                                    _createElementVNode$3("div", _hoisted_56$1, _toDisplayString$3(probeDetectedContextItems.value.length) + " 个有值，可直接用于命名模板", 1)
                                                  ]),
                                                  _createVNode$3(_component_VChip, {
                                                    size: "x-small",
                                                    color: "secondary",
                                                    variant: "tonal"
                                                  }, {
                                                    default: _withCtx$3(() => [...(_cache[155] || (_cache[155] = [
                                                      _createTextVNode$3("probe_*", -1)
                                                    ]))]),
                                                    _: 1
                                                  })
                                                ])
                                              ]),
                                              _: 1
                                            }),
                                            _createVNode$3(_component_VExpansionPanelText, null, {
                                              default: _withCtx$3(() => [
                                                (probeDetectedContextItems.value.length)
                                                  ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_57$1, [
                                                      (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(probeDetectedContextItems.value, (item) => {
                                                        return (_openBlock$3(), _createElementBlock$3("div", {
                                                          key: item.key,
                                                          class: "probe-variable-row",
                                                          title: item.description || item.label
                                                        }, [
                                                          _createElementVNode$3("div", null, [
                                                            _createElementVNode$3("span", null, _toDisplayString$3(item.label), 1),
                                                            _createElementVNode$3("code", null, _toDisplayString$3(item.key), 1)
                                                          ]),
                                                          _createElementVNode$3("strong", null, _toDisplayString$3(item.value), 1)
                                                        ], 8, _hoisted_58$1))
                                                      }), 128))
                                                    ]))
                                                  : (_openBlock$3(), _createElementBlock$3("div", _hoisted_59$1, [
                                                      _createVNode$3(_component_VIcon, {
                                                        icon: "mdi-code-braces",
                                                        size: "28"
                                                      }),
                                                      _cache[156] || (_cache[156] = _createElementVNode$3("span", null, "该文件没有生成可用的扫描变量", -1))
                                                    ])),
                                                (probeMissingContextItems.value.length)
                                                  ? (_openBlock$3(), _createBlock$3(_component_VExpansionPanels, {
                                                      key: 2,
                                                      variant: "accordion",
                                                      class: "probe-missing-panel mt-3"
                                                    }, {
                                                      default: _withCtx$3(() => [
                                                        _createVNode$3(_component_VExpansionPanel, null, {
                                                          default: _withCtx$3(() => [
                                                            _createVNode$3(_component_VExpansionPanelTitle, null, {
                                                              default: _withCtx$3(() => [
                                                                _createTextVNode$3("未取到值的变量（" + _toDisplayString$3(probeMissingContextItems.value.length) + "）", 1)
                                                              ]),
                                                              _: 1
                                                            }),
                                                            _createVNode$3(_component_VExpansionPanelText, null, {
                                                              default: _withCtx$3(() => [
                                                                _createElementVNode$3("div", _hoisted_60$1, [
                                                                  (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(probeMissingContextItems.value, (item) => {
                                                                    return (_openBlock$3(), _createBlock$3(_component_VChip, {
                                                                      key: item.key,
                                                                      size: "x-small",
                                                                      variant: "tonal"
                                                                    }, {
                                                                      default: _withCtx$3(() => [
                                                                        _createTextVNode$3(_toDisplayString$3(item.key), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024))
                                                                  }), 128))
                                                                ])
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }))
                                                  : _createCommentVNode$3("", true)
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ], 64))
                                : (_openBlock$3(), _createElementBlock$3("div", _hoisted_61$1, [
                                    _createElementVNode$3("div", _hoisted_62$1, [
                                      _createVNode$3(_component_VIcon, {
                                        icon: "mdi-waveform",
                                        size: "30"
                                      })
                                    ]),
                                    _cache[157] || (_cache[157] = _createElementVNode$3("strong", null, "等待选择媒体文件", -1)),
                                    _cache[158] || (_cache[158] = _createElementVNode$3("span", null, "扫描后将在这里展示写入字段、媒体流数量和 Jinja2 变量。", -1))
                                  ]))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]))
                  : (_openBlock$3(), _createElementBlock$3("div", _hoisted_63$1, [
                      _createVNode$3(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card strm-overview-card"
                      }, {
                        default: _withCtx$3(() => [
                          _createVNode$3(_component_VCardItem, null, {
                            prepend: _withCtx$3(() => [
                              _createVNode$3(_component_VAvatar, {
                                color: "secondary",
                                variant: "tonal",
                                size: "40"
                              }, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VIcon, {
                                    icon: "mdi-server-network",
                                    size: "22"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            append: _withCtx$3(() => [
                              _createVNode$3(_component_VChip, {
                                size: "small",
                                color: strmSync.value.active ? 'success' : 'default',
                                variant: "tonal"
                              }, {
                                default: _withCtx$3(() => [
                                  _createTextVNode$3(_toDisplayString$3(strmStatusText.value), 1)
                                ]),
                                _: 1
                              }, 8, ["color"])
                            ]),
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx$3(() => [
                                  _cache[160] || (_cache[160] = _createTextVNode$3("神医媒体信息联动 ", -1)),
                                  _createVNode$3(_component_VChip, {
                                    size: "x-small",
                                    color: "secondary",
                                    variant: "tonal",
                                    class: "ms-1"
                                  }, {
                                    default: _withCtx$3(() => [...(_cache[159] || (_cache[159] = [
                                      _createTextVNode$3("仅 Pro", -1)
                                    ]))]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              _createVNode$3(_component_VCardSubtitle, null, {
                                default: _withCtx$3(() => [...(_cache[161] || (_cache[161] = [
                                  _createTextVNode$3("复用 MP 传输前的 ffprobe 结果，由 StrmAssistant Pro 写入 Emby，避免网盘侧重复探测。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode$3(_component_VCardText, { class: "strm-overview-body" }, {
                            default: _withCtx$3(() => [
                              _createElementVNode$3("div", _hoisted_64$1, [
                                _createVNode$3(_component_VSwitch, {
                                  "model-value": strmSync.value.config.enabled,
                                  color: "secondary",
                                  label: "启用媒体信息推送",
                                  "hide-details": "",
                                  loading: saving.value === 'strm-toggle',
                                  disabled: saving.value === 'strm-toggle',
                                  "onUpdate:modelValue": toggleStrmSyncEnabled
                                }, null, 8, ["model-value", "loading", "disabled"]),
                                _createElementVNode$3("div", _hoisted_65$1, [
                                  _createElementVNode$3("div", null, [
                                    _cache[162] || (_cache[162] = _createElementVNode$3("span", null, "等待", -1)),
                                    _createElementVNode$3("strong", null, _toDisplayString$3(strmSync.value.counts?.pending || 0), 1)
                                  ]),
                                  _createElementVNode$3("div", null, [
                                    _cache[163] || (_cache[163] = _createElementVNode$3("span", null, "完成", -1)),
                                    _createElementVNode$3("strong", null, _toDisplayString$3(strmSync.value.counts?.completed || 0), 1)
                                  ]),
                                  _createElementVNode$3("div", null, [
                                    _cache[164] || (_cache[164] = _createElementVNode$3("span", null, "需处理", -1)),
                                    _createElementVNode$3("strong", null, _toDisplayString$3(strmSync.value.counts?.attention || 0), 1)
                                  ])
                                ])
                              ]),
                              _createVNode$3(_component_VAlert, {
                                type: !config.value.media_probe_enabled ? 'warning' : 'info',
                                variant: "tonal",
                                density: "compact"
                              }, {
                                default: _withCtx$3(() => [
                                  (!config.value.media_probe_enabled)
                                    ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
                                        _createTextVNode$3("请先在“媒体扫描”中启用整理前扫描，否则没有媒体信息可以推送。")
                                      ], 64))
                                    : (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 1 }, [
                                        _cache[165] || (_cache[165] = _createTextVNode$3("使用 StrmAssistant Pro 的 ", -1)),
                                        _cache[166] || (_cache[166] = _createElementVNode$3("code", null, "POST /Items/SyncMediaInfo", -1)),
                                        _cache[167] || (_cache[167] = _createTextVNode$3("；不生成 sidecar JSON，也不调用 ffmpeg。", -1))
                                      ], 64))
                                ]),
                                _: 1
                              }, 8, ["type"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode$3(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card"
                      }, {
                        default: _withCtx$3(() => [
                          _createVNode$3(_component_VCardItem, null, {
                            prepend: _withCtx$3(() => [
                              _createVNode$3(_component_VAvatar, {
                                color: "primary",
                                variant: "tonal",
                                size: "38"
                              }, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VIcon, {
                                    icon: "mdi-tune-variant",
                                    size: "20"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx$3(() => [...(_cache[168] || (_cache[168] = [
                                  _createTextVNode$3("联动设置", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode$3(_component_VCardSubtitle, null, {
                                default: _withCtx$3(() => [...(_cache[169] || (_cache[169] = [
                                  _createTextVNode$3("选择服务器、设置重试节奏，并在 MP 与 Emby 路径不一致时添加映射。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode$3(_component_VCardText, { class: "strm-card-body" }, {
                            default: _withCtx$3(() => [
                              _createElementVNode$3("div", _hoisted_66$1, [
                                _createElementVNode$3("section", _hoisted_67$1, [
                                  _createElementVNode$3("div", _hoisted_68$1, [
                                    _createElementVNode$3("div", null, [
                                      _createVNode$3(_component_VIcon, {
                                        icon: "mdi-server-outline",
                                        size: "19",
                                        color: "secondary"
                                      }),
                                      _cache[170] || (_cache[170] = _createElementVNode$3("div", null, [
                                        _createElementVNode$3("strong", null, "服务器与重试"),
                                        _createElementVNode$3("span", null, "留空目标服务器时推送到全部已连接 Emby")
                                      ], -1))
                                    ])
                                  ]),
                                  _createVNode$3(_component_VSelect, {
                                    modelValue: strmSync.value.config.servers,
                                    "onUpdate:modelValue": _cache[31] || (_cache[31] = $event => ((strmSync.value.config.servers) = $event)),
                                    items: strmServerItems.value,
                                    multiple: "",
                                    chips: "",
                                    clearable: "",
                                    label: "目标 Emby",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue", "items"]),
                                  _createElementVNode$3("div", _hoisted_69$1, [
                                    _createVNode$3(_component_VTextField, {
                                      modelValue: strmSync.value.config.initial_delay_seconds,
                                      "onUpdate:modelValue": _cache[32] || (_cache[32] = $event => ((strmSync.value.config.initial_delay_seconds) = $event)),
                                      modelModifiers: { number: true },
                                      type: "number",
                                      min: "0",
                                      max: "300",
                                      label: "首次等待（秒）",
                                      hint: "等待 Emby 发现文件",
                                      "persistent-hint": ""
                                    }, null, 8, ["modelValue"]),
                                    _createVNode$3(_component_VTextField, {
                                      modelValue: strmSync.value.config.retry_seconds,
                                      "onUpdate:modelValue": _cache[33] || (_cache[33] = $event => ((strmSync.value.config.retry_seconds) = $event)),
                                      modelModifiers: { number: true },
                                      type: "number",
                                      min: "10",
                                      max: "600",
                                      label: "重试间隔（秒）",
                                      hint: "Path 未入库时重试",
                                      "persistent-hint": ""
                                    }, null, 8, ["modelValue"]),
                                    _createVNode$3(_component_VTextField, {
                                      modelValue: strmSync.value.config.max_wait_minutes,
                                      "onUpdate:modelValue": _cache[34] || (_cache[34] = $event => ((strmSync.value.config.max_wait_minutes) = $event)),
                                      modelModifiers: { number: true },
                                      type: "number",
                                      min: "1",
                                      max: "1440",
                                      label: "最长等待（分钟）",
                                      hint: "超时后可手动重试",
                                      "persistent-hint": ""
                                    }, null, 8, ["modelValue"])
                                  ])
                                ]),
                                _createElementVNode$3("section", _hoisted_70$1, [
                                  _createElementVNode$3("div", _hoisted_71$1, [
                                    _createElementVNode$3("div", null, [
                                      _createVNode$3(_component_VIcon, {
                                        icon: "mdi-folder-swap-outline",
                                        size: "19",
                                        color: "secondary"
                                      }),
                                      _cache[171] || (_cache[171] = _createElementVNode$3("div", null, [
                                        _createElementVNode$3("strong", null, "Emby 条目路径映射"),
                                        _createElementVNode$3("span", null, "右侧填写 Emby 条目的路径前缀；STRM 库使用 .strm 文件所在目录，不填写 .strm 内记录的真实媒体地址")
                                      ], -1))
                                    ]),
                                    _createVNode$3(_component_VBtn, {
                                      size: "small",
                                      variant: "tonal",
                                      "prepend-icon": "mdi-plus",
                                      onClick: addStrmMapping
                                    }, {
                                      default: _withCtx$3(() => [...(_cache[172] || (_cache[172] = [
                                        _createTextVNode$3("添加映射", -1)
                                      ]))]),
                                      _: 1
                                    })
                                  ]),
                                  (strmSync.value.config.path_mappings?.length)
                                    ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_72$1, [
                                        (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(strmSync.value.config.path_mappings, (mapping, index) => {
                                          return (_openBlock$3(), _createElementBlock$3("div", {
                                            key: index,
                                            class: "strm-mapping-row"
                                          }, [
                                            _createElementVNode$3("div", _hoisted_73$1, [
                                              _createVNode$3(_component_VSelect, {
                                                modelValue: mapping.server,
                                                "onUpdate:modelValue": $event => ((mapping.server) = $event),
                                                items: [{ title: '全部服务器', value: '*' }, ...strmServerItems.value],
                                                label: "服务器",
                                                density: "compact",
                                                "hide-details": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                                              _createVNode$3(_component_VSelect, {
                                                modelValue: mapping.target_kind,
                                                "onUpdate:modelValue": $event => ((mapping.target_kind) = $event),
                                                items: strmTargetKindItems,
                                                label: "Emby 条目类型",
                                                density: "compact",
                                                "hide-details": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              _createVNode$3(_component_VBtn, {
                                                icon: "mdi-delete-outline",
                                                size: "small",
                                                color: "error",
                                                variant: "text",
                                                onClick: $event => (strmSync.value.config.path_mappings.splice(index, 1))
                                              }, null, 8, ["onClick"])
                                            ]),
                                            _createElementVNode$3("div", _hoisted_74$1, [
                                              _createVNode$3(_component_VTextField, {
                                                modelValue: mapping.source,
                                                "onUpdate:modelValue": $event => ((mapping.source) = $event),
                                                label: "MP 真实媒体目录前缀",
                                                placeholder: "/pilipili",
                                                density: "compact",
                                                "hide-details": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              _createVNode$3(_component_VIcon, {
                                                icon: "mdi-arrow-right",
                                                color: "medium-emphasis"
                                              }),
                                              _createVNode$3(_component_VTextField, {
                                                modelValue: mapping.target,
                                                "onUpdate:modelValue": $event => ((mapping.target) = $event),
                                                label: "Emby 条目目录前缀",
                                                placeholder: "/mnt2/strm/pilipili2",
                                                density: "compact",
                                                "hide-details": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ])
                                          ]))
                                        }), 128))
                                      ]))
                                    : (_openBlock$3(), _createElementBlock$3("div", _hoisted_75$1, [
                                        _createVNode$3(_component_VIcon, {
                                          icon: "mdi-map-marker-path",
                                          size: "26"
                                        }),
                                        _cache[173] || (_cache[173] = _createElementVNode$3("span", null, "MP 与 Emby 路径相同时无需配置", -1))
                                      ]))
                                ])
                              ]),
                              _createElementVNode$3("div", _hoisted_76$1, [
                                _cache[175] || (_cache[175] = _createElementVNode$3("span", { class: "text-caption text-medium-emphasis" }, "启用状态、服务器、重试和路径映射会一起保存", -1)),
                                _createVNode$3(_component_VBtn, {
                                  color: "secondary",
                                  "prepend-icon": "mdi-content-save",
                                  loading: saving.value === 'strm-config',
                                  onClick: saveStrmSync
                                }, {
                                  default: _withCtx$3(() => [...(_cache[174] || (_cache[174] = [
                                    _createTextVNode$3("保存联动设置", -1)
                                  ]))]),
                                  _: 1
                                }, 8, ["loading"])
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode$3(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card"
                      }, {
                        default: _withCtx$3(() => [
                          _createVNode$3(_component_VCardItem, null, {
                            prepend: _withCtx$3(() => [
                              _createVNode$3(_component_VAvatar, {
                                color: "secondary",
                                variant: "tonal",
                                size: "38"
                              }, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VIcon, {
                                    icon: "mdi-flask-outline",
                                    size: "20"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx$3(() => [...(_cache[176] || (_cache[176] = [
                                  _createTextVNode$3("立即试推", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode$3(_component_VCardSubtitle, null, {
                                default: _withCtx$3(() => [...(_cache[177] || (_cache[177] = [
                                  _createTextVNode$3("使用已扫描的源文件，向 Emby 真实写入一次媒体信息。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode$3(_component_VCardText, { class: "strm-card-body" }, {
                            default: _withCtx$3(() => [
                              _createElementVNode$3("div", _hoisted_77$1, [
                                _createElementVNode$3("div", _hoisted_78$1, [
                                  _createElementVNode$3("div", _hoisted_79$1, [
                                    _createElementVNode$3("div", _hoisted_80$1, [
                                      _createVNode$3(_component_VIcon, {
                                        icon: "mdi-file-video-outline",
                                        color: "secondary",
                                        size: "19"
                                      }),
                                      _cache[178] || (_cache[178] = _createElementVNode$3("div", null, [
                                        _createElementVNode$3("strong", null, "源媒体文件"),
                                        _createElementVNode$3("span", null, "MP 容器内可以直接读取的真实文件")
                                      ], -1))
                                    ]),
                                    _createElementVNode$3("div", _hoisted_81$1, [
                                      _createVNode$3(_component_VTextField, {
                                        modelValue: probePath.value,
                                        "onUpdate:modelValue": _cache[35] || (_cache[35] = $event => ((probePath).value = $event)),
                                        label: "容器内文件路径",
                                        placeholder: "/downloads/Anime/E01.mkv",
                                        density: "comfortable",
                                        "hide-details": ""
                                      }, null, 8, ["modelValue"]),
                                      _createVNode$3(MediaFilePicker, {
                                        modelValue: probePath.value,
                                        "onUpdate:modelValue": _cache[36] || (_cache[36] = $event => ((probePath).value = $event)),
                                        api: props.api,
                                        compact: "",
                                        "button-label": "浏览源文件"
                                      }, null, 8, ["modelValue", "api"])
                                    ])
                                  ]),
                                  _createElementVNode$3("div", _hoisted_82$1, [
                                    _createVNode$3(_component_VIcon, {
                                      icon: "mdi-arrow-right",
                                      size: "20"
                                    })
                                  ]),
                                  _createElementVNode$3("div", _hoisted_83$1, [
                                    _createElementVNode$3("div", _hoisted_84$1, [
                                      _createVNode$3(_component_VIcon, {
                                        icon: "mdi-folder-arrow-right-outline",
                                        color: "primary",
                                        size: "19"
                                      }),
                                      _cache[179] || (_cache[179] = _createElementVNode$3("div", null, [
                                        _createElementVNode$3("strong", null, "整理后目标文件"),
                                        _createElementVNode$3("span", null, "MP 实际生成、并用于映射 Emby 条目的路径")
                                      ], -1))
                                    ]),
                                    _createElementVNode$3("div", _hoisted_85$1, [
                                      _createVNode$3(_component_VTextField, {
                                        modelValue: strmTargetPath.value,
                                        "onUpdate:modelValue": _cache[37] || (_cache[37] = $event => ((strmTargetPath).value = $event)),
                                        label: "整理后文件路径",
                                        placeholder: "/media/TV/Anime/Season 01/E01.mkv",
                                        density: "comfortable",
                                        "hide-details": ""
                                      }, null, 8, ["modelValue"]),
                                      _createVNode$3(MediaFilePicker, {
                                        modelValue: strmTargetPath.value,
                                        "onUpdate:modelValue": _cache[38] || (_cache[38] = $event => ((strmTargetPath).value = $event)),
                                        api: props.api,
                                        compact: "",
                                        "button-label": "浏览目标文件"
                                      }, null, 8, ["modelValue", "api"])
                                    ])
                                  ])
                                ]),
                                _createElementVNode$3("div", _hoisted_86$1, [
                                  _createElementVNode$3("span", null, [
                                    _createVNode$3(_component_VIcon, {
                                      icon: "mdi-information-outline",
                                      size: "16"
                                    }),
                                    _cache[180] || (_cache[180] = _createTextVNode$3(" 将重新扫描源文件，并向匹配到的 Emby 条目真实写入媒体信息", -1))
                                  ]),
                                  _createVNode$3(_component_VBtn, {
                                    color: "secondary",
                                    "prepend-icon": "mdi-send-check-outline",
                                    loading: saving.value === 'strm-preview',
                                    disabled: !probePath.value || !strmTargetPath.value,
                                    onClick: previewStrmSync
                                  }, {
                                    default: _withCtx$3(() => [...(_cache[181] || (_cache[181] = [
                                      _createTextVNode$3("扫描并试推", -1)
                                    ]))]),
                                    _: 1
                                  }, 8, ["loading", "disabled"])
                                ])
                              ]),
                              (!probePath.value)
                                ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                    key: 0,
                                    type: "info",
                                    variant: "tonal",
                                    density: "compact"
                                  }, {
                                    default: _withCtx$3(() => [...(_cache[182] || (_cache[182] = [
                                      _createTextVNode$3("请输入或浏览选择 MP 容器内可读取的源文件。", -1)
                                    ]))]),
                                    _: 1
                                  }))
                                : _createCommentVNode$3("", true),
                              (strmSync.value.worker_error)
                                ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                    key: 1,
                                    type: "warning",
                                    variant: "tonal",
                                    density: "compact"
                                  }, {
                                    default: _withCtx$3(() => [
                                      _createTextVNode$3("后台工作器最近一次异常：" + _toDisplayString$3(strmSync.value.worker_error) + "。刷新状态会自动尝试恢复。", 1)
                                    ]),
                                    _: 1
                                  }))
                                : _createCommentVNode$3("", true),
                              (strmPreview.value)
                                ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                    key: 2,
                                    type: strmPreview.value.retryable ? 'warning' : 'info',
                                    variant: "tonal",
                                    density: "compact"
                                  }, {
                                    default: _withCtx$3(() => [
                                      (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(strmPreview.value.results || {}, (result, name) => {
                                        return (_openBlock$3(), _createElementBlock$3("div", { key: name }, [
                                          _createElementVNode$3("strong", null, _toDisplayString$3(name), 1),
                                          _createTextVNode$3("：" + _toDisplayString$3(result.status) + " · " + _toDisplayString$3(result.reason), 1),
                                          (result.mapped_path)
                                            ? (_openBlock$3(), _createElementBlock$3("span", _hoisted_87$1, "（" + _toDisplayString$3(result.mapped_path) + "）", 1))
                                            : _createCommentVNode$3("", true)
                                        ]))
                                      }), 128)),
                                      (!Object.keys(strmPreview.value.results || {}).length)
                                        ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_88$1, _toDisplayString$3(strmPreview.value.reason || '没有服务器结果'), 1))
                                        : _createCommentVNode$3("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["type"]))
                                : _createCommentVNode$3("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode$3(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card"
                      }, {
                        default: _withCtx$3(() => [
                          _createVNode$3(_component_VCardItem, null, {
                            prepend: _withCtx$3(() => [
                              _createVNode$3(_component_VAvatar, {
                                color: "primary",
                                variant: "tonal",
                                size: "38"
                              }, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VIcon, {
                                    icon: "mdi-format-list-checks",
                                    size: "20"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            append: _withCtx$3(() => [
                              _createVNode$3(_component_VChip, {
                                size: "small",
                                variant: "tonal"
                              }, {
                                default: _withCtx$3(() => [
                                  _createTextVNode$3(_toDisplayString$3(strmSync.value.jobs?.length || 0) + " 条", 1)
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx$3(() => [...(_cache[183] || (_cache[183] = [
                                  _createTextVNode$3("推送任务", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode$3(_component_VCardSubtitle, null, {
                                default: _withCtx$3(() => [...(_cache[184] || (_cache[184] = [
                                  _createTextVNode$3("未结束任务优先展示；已完成记录默认折叠，最多保留 80 条。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          (strmSync.value.jobs?.length)
                            ? (_openBlock$3(), _createBlock$3(_component_VCardText, {
                                key: 0,
                                class: "strm-job-area"
                              }, {
                                default: _withCtx$3(() => [
                                  _createElementVNode$3("div", _hoisted_89$1, [
                                    _createElementVNode$3("div", _hoisted_90$1, [
                                      (activeStrmJobs.value.length)
                                        ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                            key: 0,
                                            size: "small",
                                            color: "warning",
                                            variant: "tonal"
                                          }, {
                                            default: _withCtx$3(() => [
                                              _createTextVNode$3(_toDisplayString$3(activeStrmJobs.value.length) + " 条待处理", 1)
                                            ]),
                                            _: 1
                                          }))
                                        : _createCommentVNode$3("", true),
                                      _createVNode$3(_component_VChip, {
                                        size: "small",
                                        color: "success",
                                        variant: "tonal"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createTextVNode$3(_toDisplayString$3(completedStrmJobs.value.length) + " 条已完成", 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _createElementVNode$3("div", _hoisted_91$1, [
                                      _createVNode$3(_component_VBtn, {
                                        size: "small",
                                        variant: "text",
                                        "prepend-icon": "mdi-replay",
                                        disabled: !activeStrmJobs.value.length,
                                        onClick: _cache[39] || (_cache[39] = $event => (retryStrmJob()))
                                      }, {
                                        default: _withCtx$3(() => [...(_cache[185] || (_cache[185] = [
                                          _createTextVNode$3("重试未完成", -1)
                                        ]))]),
                                        _: 1
                                      }, 8, ["disabled"]),
                                      _createVNode$3(_component_VBtn, {
                                        size: "small",
                                        variant: "text",
                                        color: "error",
                                        "prepend-icon": "mdi-delete-sweep-outline",
                                        disabled: !completedStrmJobs.value.length,
                                        onClick: _cache[40] || (_cache[40] = $event => (deleteStrmJob()))
                                      }, {
                                        default: _withCtx$3(() => [...(_cache[186] || (_cache[186] = [
                                          _createTextVNode$3("清理已完成", -1)
                                        ]))]),
                                        _: 1
                                      }, 8, ["disabled"])
                                    ])
                                  ]),
                                  (activeStrmJobs.value.length)
                                    ? (_openBlock$3(), _createElementBlock$3("section", _hoisted_92$1, [
                                        _createElementVNode$3("div", _hoisted_93$1, [
                                          _createVNode$3(_component_VIcon, {
                                            icon: "mdi-progress-clock",
                                            size: "17",
                                            color: "warning"
                                          }),
                                          _cache[187] || (_cache[187] = _createElementVNode$3("span", null, "进行中与需要处理", -1))
                                        ]),
                                        _createElementVNode$3("div", _hoisted_94$1, [
                                          (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(activeStrmJobs.value, (job) => {
                                            return (_openBlock$3(), _createElementBlock$3("div", {
                                              key: job.id,
                                              class: "strm-job-row"
                                            }, [
                                              _createVNode$3(_component_VIcon, {
                                                icon: strmJobStatusPresentation(job.status).icon,
                                                color: strmJobStatusPresentation(job.status).color,
                                                size: "20"
                                              }, null, 8, ["icon", "color"]),
                                              _createElementVNode$3("button", {
                                                type: "button",
                                                class: "strm-job-main",
                                                onClick: $event => (toggleStrmJobDetail(job.id))
                                              }, [
                                                _createElementVNode$3("strong", null, _toDisplayString$3(job.title || job.target_path), 1),
                                                _createElementVNode$3("span", null, _toDisplayString$3(strmJobSummary(job) || '等待后台处理'), 1)
                                              ], 8, _hoisted_95$1),
                                              _createVNode$3(_component_VChip, {
                                                size: "small",
                                                color: strmJobStatusPresentation(job.status).color,
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx$3(() => [
                                                  _createTextVNode$3(_toDisplayString$3(strmJobStatusPresentation(job.status).label), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"]),
                                              _createElementVNode$3("div", _hoisted_96$1, [
                                                _createVNode$3(_component_VBtn, {
                                                  icon: strmJobDetailOpen(job.id) ? 'mdi-chevron-up' : 'mdi-chevron-down',
                                                  size: "small",
                                                  variant: "text",
                                                  onClick: $event => (toggleStrmJobDetail(job.id))
                                                }, null, 8, ["icon", "onClick"]),
                                                _createVNode$3(_component_VBtn, {
                                                  icon: "mdi-replay",
                                                  size: "small",
                                                  variant: "text",
                                                  onClick: $event => (retryStrmJob(job.id))
                                                }, null, 8, ["onClick"]),
                                                _createVNode$3(_component_VBtn, {
                                                  icon: "mdi-delete-outline",
                                                  size: "small",
                                                  color: "error",
                                                  variant: "text",
                                                  onClick: $event => (deleteStrmJob(job.id))
                                                }, null, 8, ["onClick"])
                                              ]),
                                              _createVNode$3(_component_VExpandTransition, null, {
                                                default: _withCtx$3(() => [
                                                  (strmJobDetailOpen(job.id))
                                                    ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_97$1, [
                                                        _createElementVNode$3("div", null, [
                                                          _cache[188] || (_cache[188] = _createElementVNode$3("span", null, "目标路径", -1)),
                                                          _createElementVNode$3("code", null, _toDisplayString$3(job.target_path || '未记录'), 1)
                                                        ]),
                                                        _createElementVNode$3("div", null, [
                                                          _cache[189] || (_cache[189] = _createElementVNode$3("span", null, "处理说明", -1)),
                                                          _createElementVNode$3("strong", null, _toDisplayString$3(strmJobSummary(job)), 1)
                                                        ]),
                                                        _createElementVNode$3("div", null, [
                                                          _cache[190] || (_cache[190] = _createElementVNode$3("span", null, "尝试次数", -1)),
                                                          _createElementVNode$3("strong", null, _toDisplayString$3(job.attempts || 0) + " 次", 1)
                                                        ]),
                                                        (strmServerResults(job).length)
                                                          ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_98$1, [
                                                              _cache[191] || (_cache[191] = _createElementVNode$3("span", null, "服务器结果", -1)),
                                                              (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(strmServerResults(job), (result) => {
                                                                return (_openBlock$3(), _createElementBlock$3("div", {
                                                                  key: result.name,
                                                                  class: "strm-server-result"
                                                                }, [
                                                                  _createVNode$3(_component_VIcon, {
                                                                    icon: result.presentation.icon,
                                                                    color: result.presentation.color,
                                                                    size: "17"
                                                                  }, null, 8, ["icon", "color"]),
                                                                  _createElementVNode$3("div", null, [
                                                                    _createElementVNode$3("div", null, [
                                                                      _createElementVNode$3("strong", null, _toDisplayString$3(result.name), 1),
                                                                      _createVNode$3(_component_VChip, {
                                                                        size: "x-small",
                                                                        color: result.presentation.color,
                                                                        variant: "tonal"
                                                                      }, {
                                                                        default: _withCtx$3(() => [
                                                                          _createTextVNode$3(_toDisplayString$3(result.presentation.label), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1032, ["color"])
                                                                    ]),
                                                                    _createElementVNode$3("small", null, _toDisplayString$3(result.reason), 1),
                                                                    (result.mapped_path)
                                                                      ? (_openBlock$3(), _createElementBlock$3("code", _hoisted_99$1, _toDisplayString$3(result.mapped_path), 1))
                                                                      : _createCommentVNode$3("", true)
                                                                  ])
                                                                ]))
                                                              }), 128))
                                                            ]))
                                                          : _createCommentVNode$3("", true)
                                                      ]))
                                                    : _createCommentVNode$3("", true)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]))
                                          }), 128))
                                        ])
                                      ]))
                                    : _createCommentVNode$3("", true),
                                  (completedStrmJobs.value.length)
                                    ? (_openBlock$3(), _createBlock$3(_component_VExpansionPanels, {
                                        key: 1,
                                        variant: "accordion",
                                        class: "strm-completed-panel"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VExpansionPanel, null, {
                                            default: _withCtx$3(() => [
                                              _createVNode$3(_component_VExpansionPanelTitle, null, {
                                                default: _withCtx$3(() => [
                                                  _createElementVNode$3("div", _hoisted_100$1, [
                                                    _createElementVNode$3("div", null, [
                                                      _createVNode$3(_component_VIcon, {
                                                        icon: "mdi-check-all",
                                                        color: "success",
                                                        size: "19"
                                                      }),
                                                      _cache[192] || (_cache[192] = _createElementVNode$3("span", null, "已完成记录", -1))
                                                    ]),
                                                    _createVNode$3(_component_VChip, {
                                                      size: "x-small",
                                                      color: "success",
                                                      variant: "tonal"
                                                    }, {
                                                      default: _withCtx$3(() => [
                                                        _createTextVNode$3(_toDisplayString$3(completedStrmJobs.value.length), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ])
                                                ]),
                                                _: 1
                                              }),
                                              _createVNode$3(_component_VExpansionPanelText, null, {
                                                default: _withCtx$3(() => [
                                                  _createElementVNode$3("div", _hoisted_101$1, [
                                                    (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(completedStrmJobs.value, (job) => {
                                                      return (_openBlock$3(), _createElementBlock$3("div", {
                                                        key: job.id,
                                                        class: "strm-job-row completed"
                                                      }, [
                                                        _createVNode$3(_component_VIcon, {
                                                          icon: "mdi-check-circle-outline",
                                                          color: "success",
                                                          size: "20"
                                                        }),
                                                        _createElementVNode$3("button", {
                                                          type: "button",
                                                          class: "strm-job-main",
                                                          onClick: $event => (toggleStrmJobDetail(job.id))
                                                        }, [
                                                          _createElementVNode$3("strong", null, _toDisplayString$3(job.title || job.target_path), 1),
                                                          _createElementVNode$3("span", null, _toDisplayString$3(strmJobSummary(job)), 1)
                                                        ], 8, _hoisted_102$1),
                                                        _createVNode$3(_component_VChip, {
                                                          size: "small",
                                                          color: "success",
                                                          variant: "tonal"
                                                        }, {
                                                          default: _withCtx$3(() => [...(_cache[193] || (_cache[193] = [
                                                            _createTextVNode$3("已完成", -1)
                                                          ]))]),
                                                          _: 1
                                                        }),
                                                        _createElementVNode$3("div", _hoisted_103, [
                                                          _createVNode$3(_component_VBtn, {
                                                            icon: strmJobDetailOpen(job.id) ? 'mdi-chevron-up' : 'mdi-chevron-down',
                                                            size: "small",
                                                            variant: "text",
                                                            onClick: $event => (toggleStrmJobDetail(job.id))
                                                          }, null, 8, ["icon", "onClick"]),
                                                          _createVNode$3(_component_VBtn, {
                                                            icon: "mdi-delete-outline",
                                                            size: "small",
                                                            color: "error",
                                                            variant: "text",
                                                            onClick: $event => (deleteStrmJob(job.id))
                                                          }, null, 8, ["onClick"])
                                                        ]),
                                                        _createVNode$3(_component_VExpandTransition, null, {
                                                          default: _withCtx$3(() => [
                                                            (strmJobDetailOpen(job.id))
                                                              ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_104, [
                                                                  _createElementVNode$3("div", null, [
                                                                    _cache[194] || (_cache[194] = _createElementVNode$3("span", null, "目标路径", -1)),
                                                                    _createElementVNode$3("code", null, _toDisplayString$3(job.target_path || '未记录'), 1)
                                                                  ]),
                                                                  _createElementVNode$3("div", null, [
                                                                    _cache[195] || (_cache[195] = _createElementVNode$3("span", null, "处理说明", -1)),
                                                                    _createElementVNode$3("strong", null, _toDisplayString$3(strmJobSummary(job)), 1)
                                                                  ]),
                                                                  _createElementVNode$3("div", null, [
                                                                    _cache[196] || (_cache[196] = _createElementVNode$3("span", null, "尝试次数", -1)),
                                                                    _createElementVNode$3("strong", null, _toDisplayString$3(job.attempts || 0) + " 次", 1)
                                                                  ]),
                                                                  (strmServerResults(job).length)
                                                                    ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_105, [
                                                                        _cache[197] || (_cache[197] = _createElementVNode$3("span", null, "服务器结果", -1)),
                                                                        (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(strmServerResults(job), (result) => {
                                                                          return (_openBlock$3(), _createElementBlock$3("div", {
                                                                            key: result.name,
                                                                            class: "strm-server-result"
                                                                          }, [
                                                                            _createVNode$3(_component_VIcon, {
                                                                              icon: result.presentation.icon,
                                                                              color: result.presentation.color,
                                                                              size: "17"
                                                                            }, null, 8, ["icon", "color"]),
                                                                            _createElementVNode$3("div", null, [
                                                                              _createElementVNode$3("div", null, [
                                                                                _createElementVNode$3("strong", null, _toDisplayString$3(result.name), 1),
                                                                                _createVNode$3(_component_VChip, {
                                                                                  size: "x-small",
                                                                                  color: result.presentation.color,
                                                                                  variant: "tonal"
                                                                                }, {
                                                                                  default: _withCtx$3(() => [
                                                                                    _createTextVNode$3(_toDisplayString$3(result.presentation.label), 1)
                                                                                  ]),
                                                                                  _: 2
                                                                                }, 1032, ["color"])
                                                                              ]),
                                                                              _createElementVNode$3("small", null, _toDisplayString$3(result.reason), 1),
                                                                              (result.mapped_path)
                                                                                ? (_openBlock$3(), _createElementBlock$3("code", _hoisted_106, _toDisplayString$3(result.mapped_path), 1))
                                                                                : _createCommentVNode$3("", true)
                                                                            ])
                                                                          ]))
                                                                        }), 128))
                                                                      ]))
                                                                    : _createCommentVNode$3("", true)
                                                                ]))
                                                              : _createCommentVNode$3("", true)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]))
                                                    }), 128))
                                                  ])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }))
                                    : _createCommentVNode$3("", true)
                                ]),
                                _: 1
                              }))
                            : (_openBlock$3(), _createBlock$3(_component_VCardText, {
                                key: 1,
                                class: "strm-empty"
                              }, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VIcon, {
                                    icon: "mdi-inbox-outline",
                                    size: "34"
                                  }),
                                  _cache[198] || (_cache[198] = _createElementVNode$3("span", null, "暂无推送任务", -1))
                                ]),
                                _: 1
                              }))
                        ]),
                        _: 1
                      })
                    ]))
              ]))
            : (props.mode === 'naming')
              ? (_openBlock$3(), _createElementBlock$3("section", _hoisted_107, [
                  _createVNode$3(_component_VTabs, {
                    modelValue: renameRuleSection.value,
                    "onUpdate:modelValue": _cache[41] || (_cache[41] = $event => ((renameRuleSection).value = $event)),
                    color: "primary",
                    class: "sub-tabs mb-4"
                  }, {
                    default: _withCtx$3(() => [
                      _createVNode$3(_component_VTab, {
                        value: "defaults",
                        "prepend-icon": "mdi-tune-variant"
                      }, {
                        default: _withCtx$3(() => [...(_cache[199] || (_cache[199] = [
                          _createTextVNode$3("连接与分隔", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode$3(_component_VTab, {
                        value: "fields",
                        "prepend-icon": "mdi-code-braces"
                      }, {
                        default: _withCtx$3(() => [...(_cache[200] || (_cache[200] = [
                          _createTextVNode$3("自定义字段", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode$3(_component_VTab, {
                        value: "text",
                        "prepend-icon": "mdi-find-replace"
                      }, {
                        default: _withCtx$3(() => [...(_cache[201] || (_cache[201] = [
                          _createTextVNode$3("文本映射", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  (renameRuleSection.value === 'fields')
                    ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_108, [
                        _createElementVNode$3("div", _hoisted_109, [
                          _cache[203] || (_cache[203] = _createElementVNode$3("div", { class: "flex-grow-1" }, [
                            _createElementVNode$3("div", { class: "text-h6" }, "Jinja2 自定义字段"),
                            _createElementVNode$3("div", { class: "text-body-2 text-medium-emphasis" }, [
                              _createTextVNode$3("保存后可在 MP 命名模板中直接使用 "),
                              _createElementVNode$3("code", null, "{{ your_field }}"),
                              _createTextVNode$3("；固定文字可直接填写，条件与组合可使用 Jinja2。")
                            ])
                          ], -1)),
                          _createVNode$3(_component_VBtn, {
                            color: "primary",
                            "prepend-icon": "mdi-plus",
                            onClick: _cache[42] || (_cache[42] = $event => (openRenameField()))
                          }, {
                            default: _withCtx$3(() => [...(_cache[202] || (_cache[202] = [
                              _createTextVNode$3("新增字段", -1)
                            ]))]),
                            _: 1
                          })
                        ]),
                        (!data.value.capabilities?.custom_independent_field)
                          ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                              key: 0,
                              type: "warning",
                              variant: "tonal",
                              class: "mb-4"
                            }, {
                              default: _withCtx$3(() => [...(_cache[204] || (_cache[204] = [
                                _createTextVNode$3("当前 MP 不支持渲染前上下文事件，无法注入自定义字段。请更新 MoviePilot。", -1)
                              ]))]),
                              _: 1
                            }))
                          : _createCommentVNode$3("", true),
                        _createVNode$3(_component_VCard, { variant: "outlined" }, {
                          default: _withCtx$3(() => [
                            _createVNode$3(_component_VCardItem, null, {
                              default: _withCtx$3(() => [
                                _createVNode$3(_component_VCardTitle, null, {
                                  default: _withCtx$3(() => [...(_cache[205] || (_cache[205] = [
                                    _createTextVNode$3("已定义字段", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode$3(_component_VCardSubtitle, null, {
                                  default: _withCtx$3(() => [
                                    _createTextVNode$3(_toDisplayString$3(customFields.value.length) + " 个字段 · 支持字段间依赖", 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            _createVNode$3(_component_VCardText, null, {
                              default: _withCtx$3(() => [
                                (customFields.value.length)
                                  ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_110, [
                                      (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(customFields.value, (item) => {
                                        return (_openBlock$3(), _createElementBlock$3("div", {
                                          key: item.key,
                                          class: "custom-field-row"
                                        }, [
                                          _createElementVNode$3("div", _hoisted_111, [
                                            _createElementVNode$3("div", _hoisted_112, [
                                              _createElementVNode$3("code", null, _toDisplayString$3(item.key), 1),
                                              _createVNode$3(_component_VChip, {
                                                size: "x-small",
                                                color: item.enabled ? 'success' : 'default',
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx$3(() => [
                                                  _createTextVNode$3(_toDisplayString$3(item.enabled ? '启用' : '停用'), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ]),
                                            _createElementVNode$3("div", _hoisted_113, _toDisplayString$3(item.label || item.key), 1),
                                            _createElementVNode$3("div", {
                                              class: "rule-pattern text-truncate",
                                              title: item.expression
                                            }, _toDisplayString$3(item.expression), 9, _hoisted_114),
                                            (item.dependencies?.length)
                                              ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_115, "依赖：" + _toDisplayString$3(item.dependencies.join('、')), 1))
                                              : _createCommentVNode$3("", true)
                                          ]),
                                          _createVNode$3(_component_VBtn, {
                                            icon: "mdi-content-copy",
                                            size: "small",
                                            variant: "text",
                                            title: "复制模板变量",
                                            onClick: $event => (copyVariable(item.key))
                                          }, null, 8, ["onClick"]),
                                          _createVNode$3(_component_VBtn, {
                                            icon: "mdi-pencil-outline",
                                            size: "small",
                                            variant: "text",
                                            onClick: $event => (openRenameField(item))
                                          }, null, 8, ["onClick"]),
                                          _createVNode$3(_component_VBtn, {
                                            icon: "mdi-delete-outline",
                                            size: "small",
                                            color: "error",
                                            variant: "text",
                                            loading: saving.value === `rename-delete:${item.key}`,
                                            onClick: $event => (deleteRenameField(item))
                                          }, null, 8, ["loading", "onClick"])
                                        ]))
                                      }), 128))
                                    ]))
                                  : (_openBlock$3(), _createElementBlock$3("div", _hoisted_116, [
                                      _createVNode$3(_component_VIcon, {
                                        icon: "mdi-code-braces",
                                        size: "34"
                                      }),
                                      _cache[206] || (_cache[206] = _createElementVNode$3("div", { class: "mt-2" }, "尚未定义自定义字段", -1)),
                                      _cache[207] || (_cache[207] = _createElementVNode$3("div", { class: "text-caption mt-1" }, "需要时点击右上角“新增字段”", -1))
                                    ]))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        _createVNode$3(_component_VCard, {
                          variant: "outlined",
                          class: "mt-4"
                        }, {
                          default: _withCtx$3(() => [
                            _createVNode$3(_component_VCardItem, null, {
                              default: _withCtx$3(() => [
                                _createVNode$3(_component_VCardTitle, null, {
                                  default: _withCtx$3(() => [...(_cache[208] || (_cache[208] = [
                                    _createTextVNode$3("上下文试算", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode$3(_component_VCardSubtitle, null, {
                                  default: _withCtx$3(() => [...(_cache[209] || (_cache[209] = [
                                    _createTextVNode$3("手工构造一次命名上下文，只验证自定义字段输出，不执行文件整理。", -1)
                                  ]))]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            _createVNode$3(_component_VCardText, null, {
                              default: _withCtx$3(() => [
                                _createElementVNode$3("div", _hoisted_117, [
                                  _createVNode$3(_component_VTextarea, {
                                    modelValue: renamePreviewInput.value.original_name,
                                    "onUpdate:modelValue": _cache[43] || (_cache[43] = $event => ((renamePreviewInput.value.original_name) = $event)),
                                    label: "MP 原始标题 original_name",
                                    rows: "1",
                                    "auto-grow": "",
                                    "hide-details": "",
                                    class: "preview-original"
                                  }, null, 8, ["modelValue"]),
                                  _createVNode$3(_component_VTextField, {
                                    modelValue: renamePreviewInput.value.type,
                                    "onUpdate:modelValue": _cache[44] || (_cache[44] = $event => ((renamePreviewInput.value.type) = $event)),
                                    label: "媒体类型 type",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue"]),
                                  _createVNode$3(_component_VTextField, {
                                    modelValue: renamePreviewInput.value.category,
                                    "onUpdate:modelValue": _cache[45] || (_cache[45] = $event => ((renamePreviewInput.value.category) = $event)),
                                    label: "二级分类 category",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue"]),
                                  _createVNode$3(_component_VTextField, {
                                    modelValue: renamePreviewInput.value.source_path,
                                    "onUpdate:modelValue": _cache[46] || (_cache[46] = $event => ((renamePreviewInput.value.source_path) = $event)),
                                    label: "真实源路径 source_path",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue"]),
                                  _createVNode$3(_component_VTextField, {
                                    modelValue: renamePreviewInput.value.target_dir,
                                    "onUpdate:modelValue": _cache[47] || (_cache[47] = $event => ((renamePreviewInput.value.target_dir) = $event)),
                                    label: "分类后目标根目录 target_dir",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue"]),
                                  _createVNode$3(_component_VBtn, {
                                    color: "secondary",
                                    "prepend-icon": "mdi-play",
                                    loading: renamePreviewing.value,
                                    class: "preview-wide",
                                    onClick: previewRenameFields
                                  }, {
                                    default: _withCtx$3(() => [...(_cache[210] || (_cache[210] = [
                                      _createTextVNode$3("试算全部字段", -1)
                                    ]))]),
                                    _: 1
                                  }, 8, ["loading"])
                                ]),
                                (renamePreview.value)
                                  ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_118, [
                                      (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(renamePreview.value.values, (value, key) => {
                                        return (_openBlock$3(), _createElementBlock$3("div", {
                                          key: key,
                                          class: "d-flex justify-space-between ga-3"
                                        }, [
                                          _createElementVNode$3("code", null, _toDisplayString$3(key), 1),
                                          _createElementVNode$3("span", _hoisted_119, _toDisplayString$3(value || '（空）'), 1)
                                        ]))
                                      }), 128)),
                                      (renamePreview.value.errors?.length)
                                        ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                            key: 0,
                                            type: "warning",
                                            variant: "tonal",
                                            density: "compact",
                                            class: "mt-3"
                                          }, {
                                            default: _withCtx$3(() => [
                                              _createTextVNode$3(_toDisplayString$3(renamePreview.value.errors.map(item => `${item.key}: ${item.message}`).join('；')), 1)
                                            ]),
                                            _: 1
                                          }))
                                        : _createCommentVNode$3("", true)
                                    ]))
                                  : _createCommentVNode$3("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        _createVNode$3(_component_VCard, {
                          variant: "outlined",
                          class: "mt-4"
                        }, {
                          default: _withCtx$3(() => [
                            _createVNode$3(_component_VCardItem, null, {
                              default: _withCtx$3(() => [
                                _createVNode$3(_component_VCardTitle, null, {
                                  default: _withCtx$3(() => [...(_cache[211] || (_cache[211] = [
                                    _createTextVNode$3("可用于文件命名的 Jinja2 输入字段", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode$3(_component_VCardSubtitle, null, {
                                  default: _withCtx$3(() => [...(_cache[212] || (_cache[212] = [
                                    _createTextVNode$3("统一展示 MoviePilot 原生字段、插件上下文字段与 ffprobe 扫描字段；可复制变量或查看取值详情。", -1)
                                  ]))]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            _createVNode$3(_component_VCardText, null, {
                              default: _withCtx$3(() => [
                                _createVNode$3(_component_VAlert, {
                                  type: "info",
                                  variant: "tonal",
                                  density: "compact",
                                  class: "mb-4"
                                }, {
                                  default: _withCtx$3(() => [...(_cache[213] || (_cache[213] = [
                                    _createTextVNode$3("每张卡片底部标注了用法：", -1),
                                    _createElementVNode$3("span", { class: "text-success font-weight-bold" }, "绿色 = 可直接写入 MP 命名模板", -1),
                                    _createTextVNode$3("；", -1),
                                    _createElementVNode$3("span", { class: "text-warning font-weight-bold" }, "黄色（虚线卡片）= 间接使用", -1),
                                    _createTextVNode$3("——这些目标目录字段在 MP 首次渲染后才产生，不能直接进模板，请先在自定义字段的表达式里引用它们，再把自定义字段写进模板（插件会安全重渲染一次）。彩色小标签仅表示字段来源。", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode$3(_component_VTextField, {
                                  modelValue: renameFieldSearch.value,
                                  "onUpdate:modelValue": _cache[48] || (_cache[48] = $event => ((renameFieldSearch).value = $event)),
                                  label: "搜索字段名称、变量或用途",
                                  "prepend-inner-icon": "mdi-magnify",
                                  clearable: "",
                                  "hide-details": "",
                                  class: "mb-4"
                                }, null, 8, ["modelValue"]),
                                _createVNode$3(_component_VExpansionPanels, {
                                  modelValue: openRenameFieldGroups.value,
                                  "onUpdate:modelValue": _cache[49] || (_cache[49] = $event => ((openRenameFieldGroups).value = $event)),
                                  multiple: "",
                                  variant: "accordion",
                                  class: "field-panels"
                                }, {
                                  default: _withCtx$3(() => [
                                    (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(renameFieldGroups.value, (group) => {
                                      return (_openBlock$3(), _createBlock$3(_component_VExpansionPanel, {
                                        key: group.category,
                                        value: group.category
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VExpansionPanelTitle, null, {
                                            default: _withCtx$3(() => [
                                              _createElementVNode$3("div", _hoisted_120, [
                                                _createElementVNode$3("span", _hoisted_121, _toDisplayString$3(group.category), 1),
                                                _createVNode$3(_component_VChip, {
                                                  size: "x-small",
                                                  variant: "tonal"
                                                }, {
                                                  default: _withCtx$3(() => [
                                                    _createTextVNode$3(_toDisplayString$3(group.items.length) + " 项", 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024),
                                          _createVNode$3(_component_VExpansionPanelText, null, {
                                            default: _withCtx$3(() => [
                                              _createElementVNode$3("div", _hoisted_122, [
                                                (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(group.items, (item) => {
                                                  return (_openBlock$3(), _createElementBlock$3("div", {
                                                    key: item.key,
                                                    class: _normalizeClass$2(["field-description-card", { 'field-card-indirect': item.template_usage === 'custom_dependency' }])
                                                  }, [
                                                    _createElementVNode$3("div", _hoisted_123, [
                                                      _createElementVNode$3("code", null, _toDisplayString$3(item.key), 1),
                                                      _createVNode$3(_component_VChip, {
                                                        size: "x-small",
                                                        variant: "tonal",
                                                        color: fieldSourceColor(item.source)
                                                      }, {
                                                        default: _withCtx$3(() => [
                                                          _createTextVNode$3(_toDisplayString$3(item.source_label || '命名字段'), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"])
                                                    ]),
                                                    _createElementVNode$3("div", _hoisted_124, _toDisplayString$3(item.label), 1),
                                                    _createElementVNode$3("div", _hoisted_125, _toDisplayString$3(item.description), 1),
                                                    _createElementVNode$3("div", _hoisted_126, [
                                                      _createElementVNode$3("span", null, _toDisplayString$3(item.type || '文本'), 1),
                                                      _createElementVNode$3("span", _hoisted_127, _toDisplayString$3(item.values || '按上下文决定'), 1)
                                                    ]),
                                                    _createElementVNode$3("div", {
                                                      class: _normalizeClass$2(["field-usage-line", item.template_usage === 'custom_dependency' ? 'usage-indirect' : 'usage-direct'])
                                                    }, [
                                                      _createVNode$3(_component_VIcon, {
                                                        icon: item.template_usage === 'custom_dependency' ? 'mdi-function-variant' : 'mdi-check-circle-outline',
                                                        size: "14"
                                                      }, null, 8, ["icon"]),
                                                      _createElementVNode$3("span", null, _toDisplayString$3(item.template_usage === 'custom_dependency' ? '间接使用：仅作自定义字段依赖' : '可直接写入命名模板'), 1)
                                                    ], 2),
                                                    _createElementVNode$3("div", _hoisted_128, [
                                                      _createVNode$3(_component_VBtn, {
                                                        size: "small",
                                                        variant: "text",
                                                        "prepend-icon": copiedVariable.value === item.key ? 'mdi-check' : 'mdi-content-copy',
                                                        onClick: $event => (copyVariable(item.key))
                                                      }, {
                                                        default: _withCtx$3(() => [
                                                          _createTextVNode$3(_toDisplayString$3(copiedVariable.value === item.key ? '已复制' : '复制变量'), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["prepend-icon", "onClick"]),
                                                      _createVNode$3(_component_VBtn, {
                                                        size: "small",
                                                        variant: "tonal",
                                                        "prepend-icon": "mdi-information-outline",
                                                        onClick: $event => (openFieldDetail(item))
                                                      }, {
                                                        default: _withCtx$3(() => [...(_cache[214] || (_cache[214] = [
                                                          _createTextVNode$3("取值详情", -1)
                                                        ]))]),
                                                        _: 1
                                                      }, 8, ["onClick"])
                                                    ])
                                                  ], 2))
                                                }), 128))
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1032, ["value"]))
                                    }), 128))
                                  ]),
                                  _: 1
                                }, 8, ["modelValue"]),
                                (!renameFieldGroups.value.length)
                                  ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_129, "没有匹配的字段"))
                                  : _createCommentVNode$3("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]))
                    : _createCommentVNode$3("", true),
                  (renameRuleSection.value === 'defaults')
                    ? (_openBlock$3(), _createBlock$3(_component_VCard, {
                        key: 1,
                        variant: "outlined",
                        class: "mb-4 naming-defaults-card"
                      }, {
                        default: _withCtx$3(() => [
                          _createVNode$3(_component_VCardItem, null, {
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VCardTitle, null, {
                                default: _withCtx$3(() => [...(_cache[215] || (_cache[215] = [
                                  _createTextVNode$3("命名连接与分隔默认值", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode$3(_component_VCardSubtitle, null, {
                                default: _withCtx$3(() => [...(_cache[216] || (_cache[216] = [
                                  _createTextVNode$3("单组专属连接符 > 标题原连接符 > 全局默认连接符；下方开关决定是否跳过标题原连接符。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode$3(_component_VCardText, null, {
                            default: _withCtx$3(() => [
                              (config.value.enabled && data.value.capabilities?.customization_separator === false)
                                ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                    key: 0,
                                    type: "warning",
                                    variant: "tonal",
                                    density: "compact",
                                    class: "mb-4"
                                  }, {
                                    default: _withCtx$3(() => [
                                      _createTextVNode$3(_toDisplayString$3(data.value.capabilities?.customization_separator_message || '当前 MP 无法动态设置自定义占位符连接符。'), 1)
                                    ]),
                                    _: 1
                                  }))
                                : _createCommentVNode$3("", true),
                              _createElementVNode$3("div", _hoisted_130, [
                                _createVNode$3(_component_VCombobox, {
                                  modelValue: config.value.rename_default_separator,
                                  "onUpdate:modelValue": _cache[50] || (_cache[50] = $event => ((config.value.rename_default_separator) = $event)),
                                  label: "字段空白分隔符",
                                  items: separatorOptions,
                                  "item-title": "title",
                                  "item-value": "value",
                                  "return-object": false,
                                  clearable: "",
                                  hint: "留空关闭；例如 WEB DL → WEB.DL",
                                  "persistent-hint": ""
                                }, null, 8, ["modelValue"]),
                                _createVNode$3(_component_VCombobox, {
                                  modelValue: config.value.customization_separator,
                                  "onUpdate:modelValue": _cache[51] || (_cache[51] = $event => ((config.value.customization_separator) = $event)),
                                  label: "自定义占位符连接符",
                                  items: separatorOptions,
                                  "item-title": "title",
                                  "item-value": "value",
                                  "return-object": false,
                                  hint: "多个 customization 命中结果的连接符",
                                  "persistent-hint": ""
                                }, null, 8, ["modelValue"]),
                                _createVNode$3(_component_VCombobox, {
                                  modelValue: config.value.release_group_default_connector,
                                  "onUpdate:modelValue": _cache[52] || (_cache[52] = $event => ((config.value.release_group_default_connector) = $event)),
                                  label: "制作组默认连接符",
                                  items: separatorOptions,
                                  "item-title": "title",
                                  "item-value": "value",
                                  "return-object": false,
                                  hint: "标题无连接符可继承时使用",
                                  "persistent-hint": ""
                                }, null, 8, ["modelValue"]),
                                _createVNode$3(_component_VSelect, {
                                  modelValue: config.value.rename_separator_fields,
                                  "onUpdate:modelValue": _cache[53] || (_cache[53] = $event => ((config.value.rename_separator_fields) = $event)),
                                  class: "separator-scope",
                                  label: "字段空白分隔符生效范围",
                                  items: separatorFieldItems.value,
                                  multiple: "",
                                  chips: "",
                                  "closable-chips": "",
                                  clearable: "",
                                  hint: "只修改字段内部的空白；不会全局替换路径中的空格",
                                  "persistent-hint": ""
                                }, null, 8, ["modelValue", "items"]),
                                _createElementVNode$3("div", _hoisted_131, [
                                  _cache[217] || (_cache[217] = _createElementVNode$3("div", null, [
                                    _createElementVNode$3("div", { class: "font-weight-medium" }, "默认连接符覆盖标题原连接符"),
                                    _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, "关闭：未设置专属连接符的组保留标题中的 @、& 或 +；开启：统一改用上面的默认连接符。单组专属设置始终优先。")
                                  ], -1)),
                                  _createVNode$3(_component_VSwitch, {
                                    modelValue: config.value.release_group_normalize_unknown_connectors,
                                    "onUpdate:modelValue": _cache[54] || (_cache[54] = $event => ((config.value.release_group_normalize_unknown_connectors) = $event)),
                                    color: "success",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue"])
                                ])
                              ])
                            ]),
                            _: 1
                          }),
                          _createVNode$3(_component_VDivider),
                          _createVNode$3(_component_VCardActions, null, {
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VSpacer),
                              _createVNode$3(_component_VBtn, {
                                color: "primary",
                                "prepend-icon": "mdi-content-save",
                                loading: __props.savingConfig,
                                onClick: _cache[55] || (_cache[55] = $event => (emit('save-config')))
                              }, {
                                default: _withCtx$3(() => [...(_cache[218] || (_cache[218] = [
                                  _createTextVNode$3("保存命名默认值", -1)
                                ]))]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }))
                    : (renameRuleSection.value === 'text')
                      ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_132, [
                          _createElementVNode$3("div", _hoisted_133, [
                            _createVNode$3(_component_VAlert, {
                              type: "info",
                              variant: "tonal",
                              density: "compact",
                              class: "flex-grow-1 mb-0"
                            }, {
                              default: _withCtx$3(() => [...(_cache[219] || (_cache[219] = [
                                _createTextVNode$3("无需判断标题、目录还是字幕。把 MP 的完整首次结果当作输入，例如 ", -1),
                                _createElementVNode$3("code", null, "AB/C.chi.zh-cn.ass", -1),
                                _createTextVNode$3("，规则连续执行后得到最终路径。", -1)
                              ]))]),
                              _: 1
                            }),
                            _createVNode$3(_component_VBtn, {
                              variant: "tonal",
                              color: "secondary",
                              "prepend-icon": "mdi-closed-caption-outline",
                              onClick: addSubtitleMappingPreset
                            }, {
                              default: _withCtx$3(() => [...(_cache[220] || (_cache[220] = [
                                _createTextVNode$3("添加简繁字幕预设", -1)
                              ]))]),
                              _: 1
                            }),
                            _createVNode$3(_component_VBtn, {
                              color: "primary",
                              "prepend-icon": "mdi-plus",
                              onClick: _cache[56] || (_cache[56] = $event => (openMappingRule()))
                            }, {
                              default: _withCtx$3(() => [...(_cache[221] || (_cache[221] = [
                                _createTextVNode$3("新增文本映射", -1)
                              ]))]),
                              _: 1
                            })
                          ]),
                          (!data.value.rename_mappings?.subtitle_compatible)
                            ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                key: 0,
                                type: "warning",
                                variant: "tonal",
                                density: "compact",
                                class: "mb-4"
                              }, {
                                default: _withCtx$3(() => [
                                  _createTextVNode$3(_toDisplayString$3(data.value.rename_mappings?.subtitle_message || '当前 MP 暂不支持在字幕语言后缀生成后执行；视频最终命名仍可使用。'), 1)
                                ]),
                                _: 1
                              }))
                            : _createCommentVNode$3("", true),
                          (mappingRules.value.length)
                            ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_134, [
                                (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(mappingRules.value, (item) => {
                                  return (_openBlock$3(), _createBlock$3(_component_VCard, {
                                    key: item.id,
                                    variant: "outlined",
                                    class: "mapping-card"
                                  }, {
                                    default: _withCtx$3(() => [
                                      _createVNode$3(_component_VCardText, { class: "d-flex align-start ga-3" }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VAvatar, {
                                            color: item.stage === 'release_group' ? 'primary' : 'orange',
                                            variant: "tonal",
                                            size: "38"
                                          }, {
                                            default: _withCtx$3(() => [
                                              _createVNode$3(_component_VIcon, {
                                                icon: item.stage === 'release_group' ? 'mdi-account-group-outline' : 'mdi-find-replace'
                                              }, null, 8, ["icon"])
                                            ]),
                                            _: 2
                                          }, 1032, ["color"]),
                                          _createElementVNode$3("div", _hoisted_135, [
                                            _createElementVNode$3("div", _hoisted_136, [
                                              _createElementVNode$3("span", _hoisted_137, _toDisplayString$3(item.label), 1),
                                              _createVNode$3(_component_VChip, {
                                                size: "x-small",
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx$3(() => [
                                                  _createTextVNode$3(_toDisplayString$3(mappingStageLabel(item.stage)), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              _createVNode$3(_component_VChip, {
                                                size: "x-small",
                                                color: item.mode === 'regex' ? 'warning' : 'default',
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx$3(() => [
                                                  _createTextVNode$3(_toDisplayString$3(item.mode === 'regex' ? '正则' : '字面'), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"]),
                                              (!item.enabled)
                                                ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                                    key: 0,
                                                    size: "x-small",
                                                    variant: "tonal"
                                                  }, {
                                                    default: _withCtx$3(() => [...(_cache[222] || (_cache[222] = [
                                                      _createTextVNode$3("已停用", -1)
                                                    ]))]),
                                                    _: 1
                                                  }))
                                                : _createCommentVNode$3("", true)
                                            ]),
                                            _createElementVNode$3("div", _hoisted_138, [
                                              _createElementVNode$3("code", null, _toDisplayString$3(item.pattern), 1),
                                              _createVNode$3(_component_VIcon, {
                                                icon: "mdi-arrow-right",
                                                size: "16"
                                              }),
                                              _createElementVNode$3("code", null, _toDisplayString$3(item.replacement || '（删除）'), 1)
                                            ]),
                                            _createElementVNode$3("div", _hoisted_139, "优先级 " + _toDisplayString$3(item.priority), 1)
                                          ]),
                                          _createVNode$3(_component_VBtn, {
                                            icon: "mdi-pencil-outline",
                                            size: "small",
                                            variant: "text",
                                            onClick: $event => (openMappingRule(item))
                                          }, null, 8, ["onClick"]),
                                          _createVNode$3(_component_VBtn, {
                                            icon: "mdi-delete-outline",
                                            size: "small",
                                            color: "error",
                                            variant: "text",
                                            loading: saving.value === `mapping-delete:${item.id}`,
                                            onClick: $event => (deleteMappingRule(item))
                                          }, null, 8, ["loading", "onClick"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024))
                                }), 128))
                              ]))
                            : (_openBlock$3(), _createElementBlock$3("div", _hoisted_140, [
                                _createVNode$3(_component_VIcon, {
                                  icon: "mdi-find-replace",
                                  size: "48"
                                }),
                                _cache[223] || (_cache[223] = _createElementVNode$3("div", { class: "mt-2" }, "尚未设置最终命名规则", -1)),
                                _cache[224] || (_cache[224] = _createElementVNode$3("div", { class: "text-caption mt-1" }, "可先添加简繁字幕预设，或按 MP 模板生成的完整路径建立任意文字替换", -1))
                              ])),
                          _createVNode$3(_component_VCard, {
                            variant: "outlined",
                            class: "mt-4"
                          }, {
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VCardItem, null, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VCardTitle, null, {
                                    default: _withCtx$3(() => [...(_cache[225] || (_cache[225] = [
                                      _createTextVNode$3("最终结果试算", -1)
                                    ]))]),
                                    _: 1
                                  }),
                                  _createVNode$3(_component_VCardSubtitle, null, {
                                    default: _withCtx$3(() => [...(_cache[226] || (_cache[226] = [
                                      _createTextVNode$3("输入 MP 模板生成的相对路径或文件名；这里只试算，不执行文件整理。", -1)
                                    ]))]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              _createVNode$3(_component_VCardText, null, {
                                default: _withCtx$3(() => [
                                  _createElementVNode$3("div", _hoisted_141, [
                                    _createVNode$3(_component_VTextField, {
                                      modelValue: mappingPreviewInput.value.value,
                                      "onUpdate:modelValue": _cache[57] || (_cache[57] = $event => ((mappingPreviewInput.value.value) = $event)),
                                      label: "模板生成的完整路径",
                                      placeholder: "AB/C.chi.zh-cn.ass",
                                      "hide-details": ""
                                    }, null, 8, ["modelValue"]),
                                    _createVNode$3(_component_VBtn, {
                                      color: "secondary",
                                      "prepend-icon": "mdi-play",
                                      loading: saving.value === 'mapping-preview',
                                      onClick: previewMappingRules
                                    }, {
                                      default: _withCtx$3(() => [...(_cache[227] || (_cache[227] = [
                                        _createTextVNode$3("开始试算", -1)
                                      ]))]),
                                      _: 1
                                    }, 8, ["loading"])
                                  ]),
                                  (mappingPreview.value)
                                    ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                        key: 0,
                                        type: mappingPreview.value.changes?.length ? 'success' : 'info',
                                        variant: "tonal",
                                        class: "mt-4"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createElementVNode$3("div", null, [
                                            _cache[228] || (_cache[228] = _createTextVNode$3("输出：", -1)),
                                            _createElementVNode$3("code", null, _toDisplayString$3(mappingPreview.value.output), 1)
                                          ]),
                                          _createElementVNode$3("div", _hoisted_142, "命中 " + _toDisplayString$3(mappingPreview.value.changes?.length || 0) + " 条规则", 1)
                                        ]),
                                        _: 1
                                      }, 8, ["type"]))
                                    : _createCommentVNode$3("", true)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]))
                      : _createCommentVNode$3("", true)
                ]))
              : (_openBlock$3(), _createElementBlock$3("section", _hoisted_143, [
                  _createVNode$3(_component_VCard, { variant: "outlined" }, {
                    default: _withCtx$3(() => [
                      _createVNode$3(_component_VCardItem, null, {
                        default: _withCtx$3(() => [
                          _createVNode$3(_component_VCardTitle, null, {
                            default: _withCtx$3(() => [...(_cache[229] || (_cache[229] = [
                              _createTextVNode$3("覆盖层试算", -1)
                            ]))]),
                            _: 1
                          }),
                          _createVNode$3(_component_VCardSubtitle, null, {
                            default: _withCtx$3(() => [...(_cache[230] || (_cache[230] = [
                              _createTextVNode$3("只运行已保存的插件覆盖规则，不请求 TMDB，也不写整理链。", -1)
                            ]))]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode$3(_component_VCardText, null, {
                        default: _withCtx$3(() => [
                          _createElementVNode$3("div", _hoisted_144, [
                            _createVNode$3(_component_VTextarea, {
                              modelValue: previewTitle.value,
                              "onUpdate:modelValue": _cache[58] || (_cache[58] = $event => ((previewTitle).value = $event)),
                              label: "原标题",
                              rows: "3",
                              "auto-grow": "",
                              "hide-details": ""
                            }, null, 8, ["modelValue"]),
                            _createElementVNode$3("div", _hoisted_145, [
                              _createVNode$3(_component_VBtn, {
                                color: "primary",
                                "prepend-icon": "mdi-play",
                                loading: saving.value === 'preview',
                                onClick: previewRules
                              }, {
                                default: _withCtx$3(() => [...(_cache[231] || (_cache[231] = [
                                  _createTextVNode$3("开始试算", -1)
                                ]))]),
                                _: 1
                              }, 8, ["loading"])
                            ])
                          ]),
                          (preview.value && !preview.value.changes?.length)
                            ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                key: 0,
                                type: "info",
                                variant: "tonal",
                                class: "mt-4"
                              }, {
                                default: _withCtx$3(() => [...(_cache[232] || (_cache[232] = [
                                  _createTextVNode$3("没有覆盖规则命中；MP 原始解析结果会保持不变。", -1)
                                ]))]),
                                _: 1
                              }))
                            : (preview.value?.changes?.length)
                              ? (_openBlock$3(), _createBlock$3(_component_VTable, {
                                  key: 1,
                                  density: "compact",
                                  class: "tools-table mt-4"
                                }, {
                                  default: _withCtx$3(() => [
                                    _cache[233] || (_cache[233] = _createElementVNode$3("thead", null, [
                                      _createElementVNode$3("tr", null, [
                                        _createElementVNode$3("th", null, "字段"),
                                        _createElementVNode$3("th", null, "原值"),
                                        _createElementVNode$3("th", null, "覆盖值"),
                                        _createElementVNode$3("th", null, "规则")
                                      ])
                                    ], -1)),
                                    _createElementVNode$3("tbody", null, [
                                      (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(preview.value.changes, (item) => {
                                        return (_openBlock$3(), _createElementBlock$3("tr", {
                                          key: item.rule_id
                                        }, [
                                          _createElementVNode$3("td", null, _toDisplayString$3(item.field), 1),
                                          _createElementVNode$3("td", null, _toDisplayString$3(item.before ?? '空'), 1),
                                          _createElementVNode$3("td", null, _toDisplayString$3(item.after ?? '清空'), 1),
                                          _createElementVNode$3("td", null, _toDisplayString$3(item.label), 1)
                                        ]))
                                      }), 128))
                                    ])
                                  ]),
                                  _: 1
                                }))
                              : _createCommentVNode$3("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ])),
    _createVNode$3(_component_VDialog, {
      modelValue: groupProfileDialog.value,
      "onUpdate:modelValue": _cache[62] || (_cache[62] = $event => ((groupProfileDialog).value = $event)),
      "max-width": "900"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCard, null, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardItem, null, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardTitle, null, {
                  default: _withCtx$3(() => [...(_cache[234] || (_cache[234] = [
                    _createTextVNode$3("制作组类型与命名字段", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VCardSubtitle, null, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3(_toDisplayString$3(groupProfileForm.value.display_name) + " · 标准字段、自定义 Jinja 字段共用同一写入策略。", 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VRow, null, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "6"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VSelect, {
                          modelValue: groupProfileForm.value.kind,
                          "onUpdate:modelValue": _cache[59] || (_cache[59] = $event => ((groupProfileForm.value.kind) = $event)),
                          label: "内容类型",
                          items: kindItems,
                          "hide-details": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "6"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VSelect, {
                          modelValue: groupProfileForm.value.field_policy,
                          "onUpdate:modelValue": _cache[60] || (_cache[60] = $event => ((groupProfileForm.value.field_policy) = $event)),
                          label: "字段写入策略",
                          items: fieldPolicyItems,
                          "hide-details": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx$3(() => [...(_cache[235] || (_cache[235] = [
                    _createTextVNode$3("处理顺序：制作组标准字段 → ffprobe 的 ", -1),
                    _createElementVNode$3("code", null, "probe_*", -1),
                    _createTextVNode$3(" 变量 → 自定义 Jinja 字段计算 → 制作组对自定义字段补充。追加模式会保留已有内容并去重合并；多个合作组给出冲突值时仍会安全跳过。", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VExpansionPanels, {
                  variant: "accordion",
                  multiple: ""
                }, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VExpansionPanel, null, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VExpansionPanelTitle, null, {
                          default: _withCtx$3(() => [...(_cache[236] || (_cache[236] = [
                            _createTextVNode$3("MP 标准命名字段", -1)
                          ]))]),
                          _: 1
                        }),
                        _createVNode$3(_component_VExpansionPanelText, null, {
                          default: _withCtx$3(() => [
                            _createElementVNode$3("div", _hoisted_146, [
                              (_openBlock$3(), _createElementBlock$3(_Fragment$3, null, _renderList$3(supplementFieldItems, (item) => {
                                return _createVNode$3(_component_VTextField, {
                                  key: item.key,
                                  modelValue: groupProfileForm.value.field_values[item.key],
                                  "onUpdate:modelValue": $event => ((groupProfileForm.value.field_values[item.key]) = $event),
                                  label: `${item.label}（${item.key}）`,
                                  placeholder: item.placeholder,
                                  clearable: "",
                                  "hide-details": ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "placeholder"])
                              }), 64))
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    (customFields.value.length)
                      ? (_openBlock$3(), _createBlock$3(_component_VExpansionPanel, { key: 0 }, {
                          default: _withCtx$3(() => [
                            _createVNode$3(_component_VExpansionPanelTitle, null, {
                              default: _withCtx$3(() => [
                                _createTextVNode$3("用户自定义 Jinja 字段（" + _toDisplayString$3(customFields.value.length) + "）", 1)
                              ]),
                              _: 1
                            }),
                            _createVNode$3(_component_VExpansionPanelText, null, {
                              default: _withCtx$3(() => [
                                _createElementVNode$3("div", _hoisted_147, [
                                  (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(customFields.value, (item) => {
                                    return (_openBlock$3(), _createBlock$3(_component_VTextField, {
                                      key: item.key,
                                      modelValue: groupProfileForm.value.custom_field_values[item.key],
                                      "onUpdate:modelValue": $event => ((groupProfileForm.value.custom_field_values[item.key]) = $event),
                                      label: `${item.label || item.key}（${item.key}）`,
                                      clearable: "",
                                      "hide-details": ""
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "label"]))
                                  }), 128))
                                ]),
                                _cache[237] || (_cache[237] = _createElementVNode$3("div", { class: "text-caption text-medium-emphasis mt-3" }, "这里填的是该制作组对字段的固定补充值；字段本身的 Jinja 表达式仍在“命名规则 → 自定义字段”维护。", -1))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$3("", true)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VSpacer),
                _createVNode$3(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[61] || (_cache[61] = $event => (groupProfileDialog.value = false))
                }, {
                  default: _withCtx$3(() => [...(_cache[238] || (_cache[238] = [
                    _createTextVNode$3("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VBtn, {
                  color: "primary",
                  "prepend-icon": "mdi-content-save",
                  loading: saving.value === 'group-profile',
                  onClick: saveGroupProfile
                }, {
                  default: _withCtx$3(() => [...(_cache[239] || (_cache[239] = [
                    _createTextVNode$3("保存设置", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$3(_component_VDialog, {
      modelValue: fieldDetailDialog.value,
      "onUpdate:modelValue": _cache[66] || (_cache[66] = $event => ((fieldDetailDialog).value = $event)),
      "max-width": "920",
      scrollable: ""
    }, {
      default: _withCtx$3(() => [
        (fieldDetail.value)
          ? (_openBlock$3(), _createBlock$3(_component_VCard, { key: 0 }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardItem, null, {
                  prepend: _withCtx$3(() => [
                    _createVNode$3(_component_VAvatar, {
                      color: "secondary",
                      variant: "tonal"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VIcon, { icon: "mdi-code-braces" })
                      ]),
                      _: 1
                    })
                  ]),
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VCardTitle, null, {
                      default: _withCtx$3(() => [
                        _createTextVNode$3(_toDisplayString$3(fieldDetail.value.label), 1)
                      ]),
                      _: 1
                    }),
                    _createVNode$3(_component_VCardSubtitle, null, {
                      default: _withCtx$3(() => [
                        _createElementVNode$3("code", null, _toDisplayString$3(fieldDetail.value.key), 1),
                        _createTextVNode$3(" · " + _toDisplayString$3(fieldDetail.value.source_label || '命名字段'), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VDivider),
                _createVNode$3(_component_VCardText, { class: "field-detail-body" }, {
                  default: _withCtx$3(() => [
                    _createElementVNode$3("div", _hoisted_148, [
                      _createVNode$3(_component_VChip, {
                        size: "small",
                        color: fieldSourceColor(fieldDetail.value.source),
                        variant: "tonal"
                      }, {
                        default: _withCtx$3(() => [
                          _createTextVNode$3(_toDisplayString$3(fieldDetail.value.source_label), 1)
                        ]),
                        _: 1
                      }, 8, ["color"]),
                      _createVNode$3(_component_VChip, {
                        size: "small",
                        variant: "tonal"
                      }, {
                        default: _withCtx$3(() => [
                          _createTextVNode$3(_toDisplayString$3(fieldDetail.value.type || '文本'), 1)
                        ]),
                        _: 1
                      }),
                      _createVNode$3(_component_VChip, {
                        size: "small",
                        variant: "tonal"
                      }, {
                        default: _withCtx$3(() => [
                          _createTextVNode$3(_toDisplayString$3(fieldDetail.value.availability || '按上下文可用'), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _createVNode$3(_component_VAlert, {
                      type: fieldDetail.value.template_usage === 'custom_dependency' ? 'warning' : 'success',
                      variant: "tonal",
                      density: "compact"
                    }, {
                      default: _withCtx$3(() => [
                        _createElementVNode$3("strong", null, _toDisplayString$3(fieldDetail.value.template_usage_label || '可直接用于 MP 命名模板'), 1),
                        _createElementVNode$3("div", _hoisted_149, _toDisplayString$3(fieldDetail.value.template_usage_detail || '可直接复制下方变量写入 MoviePilot 命名模板。'), 1)
                      ]),
                      _: 1
                    }, 8, ["type"]),
                    _createElementVNode$3("div", _hoisted_150, [
                      _cache[240] || (_cache[240] = _createElementVNode$3("div", { class: "field-detail-title" }, "用途", -1)),
                      _createElementVNode$3("div", null, _toDisplayString$3(fieldDetail.value.description), 1)
                    ]),
                    _createElementVNode$3("div", _hoisted_151, [
                      _cache[241] || (_cache[241] = _createElementVNode$3("div", { class: "field-detail-title" }, "可能值与格式", -1)),
                      _createElementVNode$3("div", null, _toDisplayString$3(fieldDetail.value.values || '具体值由当前命名上下文决定。'), 1)
                    ]),
                    _createElementVNode$3("div", _hoisted_152, [
                      _cache[242] || (_cache[242] = _createElementVNode$3("div", { class: "field-detail-title" }, "生成逻辑 / 使用注意", -1)),
                      _createElementVNode$3("div", null, _toDisplayString$3(fieldDetail.value.logic || '使用前建议判断字段是否为空。'), 1)
                    ]),
                    _createElementVNode$3("div", _hoisted_153, [
                      _cache[243] || (_cache[243] = _createElementVNode$3("div", { class: "field-detail-title" }, "Jinja2 写法", -1)),
                      _createElementVNode$3("code", _hoisted_154, _toDisplayString$3(variableSyntax(fieldDetail.value.key)), 1)
                    ]),
                    (fieldDetailPresetRules.value.length)
                      ? (_openBlock$3(), _createBlock$3(_component_VExpansionPanels, {
                          key: 0,
                          variant: "accordion"
                        }, {
                          default: _withCtx$3(() => [
                            _createVNode$3(_component_VExpansionPanel, null, {
                              default: _withCtx$3(() => [
                                _createVNode$3(_component_VExpansionPanelTitle, null, {
                                  default: _withCtx$3(() => [
                                    _createElementVNode$3("div", null, [
                                      _cache[244] || (_cache[244] = _createElementVNode$3("div", { class: "font-weight-medium" }, "当前 MP 已加载的识别预设", -1)),
                                      _createElementVNode$3("div", _hoisted_155, _toDisplayString$3(fieldDetailPresetRules.value.length) + " 条；展示当前实例实际生效的内置词、正则和插件覆盖", 1)
                                    ])
                                  ]),
                                  _: 1
                                }),
                                _createVNode$3(_component_VExpansionPanelText, null, {
                                  default: _withCtx$3(() => [
                                    _createElementVNode$3("div", _hoisted_156, [
                                      _createVNode$3(_component_VTable, {
                                        density: "compact",
                                        class: "preset-table"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _cache[245] || (_cache[245] = _createElementVNode$3("thead", null, [
                                            _createElementVNode$3("tr", null, [
                                              _createElementVNode$3("th", null, "名称"),
                                              _createElementVNode$3("th", null, "匹配词 / 正则"),
                                              _createElementVNode$3("th", null, "输出值"),
                                              _createElementVNode$3("th", null, "来源")
                                            ])
                                          ], -1)),
                                          _createElementVNode$3("tbody", null, [
                                            (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(visibleFieldPresetRules.value, (rule) => {
                                              return (_openBlock$3(), _createElementBlock$3("tr", {
                                                key: rule.id
                                              }, [
                                                _createElementVNode$3("td", null, _toDisplayString$3(rule.label), 1),
                                                _createElementVNode$3("td", null, [
                                                  _createElementVNode$3("code", null, _toDisplayString$3(rule.pattern), 1)
                                                ]),
                                                _createElementVNode$3("td", null, [
                                                  _createElementVNode$3("code", null, _toDisplayString$3(rule.value), 1)
                                                ]),
                                                _createElementVNode$3("td", null, [
                                                  _createVNode$3(_component_VChip, {
                                                    size: "x-small",
                                                    color: rule.overridden ? 'warning' : 'default',
                                                    variant: "tonal"
                                                  }, {
                                                    default: _withCtx$3(() => [
                                                      _createTextVNode$3(_toDisplayString$3(rule.source_label), 1),
                                                      (rule.overridden)
                                                        ? (_openBlock$3(), _createElementBlock$3("span", _hoisted_157, " · 已覆盖"))
                                                        : _createCommentVNode$3("", true)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])
                                                ])
                                              ]))
                                            }), 128))
                                          ])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    (visibleFieldPresetRules.value.length < fieldDetailPresetRules.value.length)
                                      ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_158, [
                                          _createVNode$3(_component_VBtn, {
                                            variant: "tonal",
                                            size: "small",
                                            onClick: _cache[63] || (_cache[63] = $event => (fieldPresetLimit.value += 80))
                                          }, {
                                            default: _withCtx$3(() => [
                                              _createTextVNode$3("再显示 " + _toDisplayString$3(Math.min(80, fieldDetailPresetRules.value.length - visibleFieldPresetRules.value.length)) + " 条", 1)
                                            ]),
                                            _: 1
                                          })
                                        ]))
                                      : _createCommentVNode$3("", true)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$3("", true)
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VDivider),
                _createVNode$3(_component_VCardActions, null, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VBtn, {
                      color: "primary",
                      variant: "tonal",
                      "prepend-icon": "mdi-content-copy",
                      onClick: _cache[64] || (_cache[64] = $event => (copyVariable(fieldDetail.value.key)))
                    }, {
                      default: _withCtx$3(() => [...(_cache[246] || (_cache[246] = [
                        _createTextVNode$3("复制变量", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$3(_component_VSpacer),
                    _createVNode$3(_component_VBtn, {
                      variant: "text",
                      onClick: _cache[65] || (_cache[65] = $event => (fieldDetailDialog.value = false))
                    }, {
                      default: _withCtx$3(() => [...(_cache[247] || (_cache[247] = [
                        _createTextVNode$3("关闭", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : _createCommentVNode$3("", true)
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$3(_component_VDialog, {
      modelValue: dialog.value,
      "onUpdate:modelValue": _cache[75] || (_cache[75] = $event => ((dialog).value = $event)),
      "max-width": "780"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCard, { class: "rule-dialog-card" }, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardItem, { class: "rule-dialog-header" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardTitle, null, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3(_toDisplayString$3(form.value.source_rule_id ? '编辑 MP 内置规则的插件覆盖' : '新增识别字段覆盖'), 1)
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VCardSubtitle, null, {
                  default: _withCtx$3(() => [...(_cache[248] || (_cache[248] = [
                    _createTextVNode$3("保存后立即作用于新进入 MP 识别链的标题；不会修改容器文件。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VRow, null, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VSelect, {
                          modelValue: form.value.field,
                          "onUpdate:modelValue": _cache[67] || (_cache[67] = $event => ((form.value.field) = $event)),
                          label: "目标字段",
                          items: fieldItems.value.filter(item => item.value !== 'all'),
                          "hide-details": ""
                        }, null, 8, ["modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VSelect, {
                          modelValue: form.value.action,
                          "onUpdate:modelValue": _cache[68] || (_cache[68] = $event => ((form.value.action) = $event)),
                          label: "动作",
                          items: [{title:'命中后覆盖字段',value:'override'},{title:'命中后清空字段',value:'clear'}],
                          "hide-details": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VTextField, {
                  modelValue: form.value.label,
                  "onUpdate:modelValue": _cache[69] || (_cache[69] = $event => ((form.value.label) = $event)),
                  label: "规则名称",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VTextarea, {
                  modelValue: form.value.pattern,
                  "onUpdate:modelValue": _cache[70] || (_cache[70] = $event => ((form.value.pattern) = $event)),
                  label: "匹配正则",
                  rows: "4",
                  "auto-grow": "",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                (form.value.action === 'override')
                  ? (_openBlock$3(), _createBlock$3(_component_VTextField, {
                      key: 0,
                      modelValue: form.value.value,
                      "onUpdate:modelValue": _cache[71] || (_cache[71] = $event => ((form.value.value) = $event)),
                      label: "输出值",
                      hint: "可用 {match}、{first_group}、{1} 或命名组如 {bit}",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]))
                  : _createCommentVNode$3("", true),
                _createVNode$3(_component_VRow, { align: "center" }, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VTextField, {
                          modelValue: form.value.priority,
                          "onUpdate:modelValue": _cache[72] || (_cache[72] = $event => ((form.value.priority) = $event)),
                          type: "number",
                          label: "优先级",
                          hint: "数值越高越先执行",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$3(() => [
                        _createElementVNode$3("div", _hoisted_159, [
                          _cache[249] || (_cache[249] = _createElementVNode$3("div", null, [
                            _createElementVNode$3("div", { class: "font-weight-medium" }, "启用规则"),
                            _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, "保存后立即参与识别")
                          ], -1)),
                          _createVNode$3(_component_VSwitch, {
                            modelValue: form.value.enabled,
                            "onUpdate:modelValue": _cache[73] || (_cache[73] = $event => ((form.value.enabled) = $event)),
                            color: "success",
                            "hide-details": ""
                          }, null, 8, ["modelValue"])
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VSpacer),
                _createVNode$3(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[74] || (_cache[74] = $event => (dialog.value = false))
                }, {
                  default: _withCtx$3(() => [...(_cache[250] || (_cache[250] = [
                    _createTextVNode$3("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'rule',
                  onClick: saveRule
                }, {
                  default: _withCtx$3(() => [...(_cache[251] || (_cache[251] = [
                    _createTextVNode$3("保存覆盖", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$3(_component_VDialog, {
      modelValue: bulkPriorityDialog.value,
      "onUpdate:modelValue": _cache[78] || (_cache[78] = $event => ((bulkPriorityDialog).value = $event)),
      "max-width": "580"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCard, { class: "rule-dialog-card" }, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardItem, { class: "rule-dialog-header" }, {
              prepend: _withCtx$3(() => [
                _createVNode$3(_component_VAvatar, {
                  color: "primary",
                  variant: "tonal"
                }, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VIcon, { icon: "mdi-format-list-numbered" })
                  ]),
                  _: 1
                })
              ]),
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardTitle, null, {
                  default: _withCtx$3(() => [...(_cache[252] || (_cache[252] = [
                    _createTextVNode$3("批量修改筛选结果优先级", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VCardSubtitle, null, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3("只处理当前搜索、字段和来源共同筛选出的 " + _toDisplayString$3(rules.value.length) + " 条规则，不受分页影响。", 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VTextField, {
                  modelValue: bulkPriority.value,
                  "onUpdate:modelValue": _cache[76] || (_cache[76] = $event => ((bulkPriority).value = $event)),
                  type: "number",
                  min: "-1000",
                  max: "1000",
                  label: "插件覆盖优先级",
                  hint: "范围 -1000～1000；数值越高，同一字段命中多条插件规则时越先采用",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VSpacer),
                _createVNode$3(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[77] || (_cache[77] = $event => (bulkPriorityDialog.value = false))
                }, {
                  default: _withCtx$3(() => [...(_cache[253] || (_cache[253] = [
                    _createTextVNode$3("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VBtn, {
                  color: "primary",
                  "prepend-icon": "mdi-check-all",
                  loading: saving.value === 'bulk-priority',
                  onClick: saveBulkPriority
                }, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3("应用到 " + _toDisplayString$3(rules.value.length) + " 条", 1)
                  ]),
                  _: 1
                }, 8, ["loading"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$3(_component_VDialog, {
      modelValue: renameDialog.value,
      "onUpdate:modelValue": _cache[85] || (_cache[85] = $event => ((renameDialog).value = $event)),
      "max-width": "820"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCard, null, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardItem, null, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardTitle, null, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3(_toDisplayString$3(renameForm.value.original_key ? '编辑自定义命名字段' : '新增自定义命名字段'), 1)
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VCardSubtitle, null, {
                  default: _withCtx$3(() => [...(_cache[254] || (_cache[254] = [
                    _createTextVNode$3("字段会作为独立变量加入 MP 的 Jinja2 命名上下文，不覆盖原有字段。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VRow, null, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VTextField, {
                          modelValue: renameForm.value.key,
                          "onUpdate:modelValue": _cache[79] || (_cache[79] = $event => ((renameForm.value.key) = $event)),
                          label: "字段名",
                          disabled: !!renameForm.value.original_key,
                          hint: "保存后字段名固定，避免破坏其它字段依赖",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue", "disabled"])
                      ]),
                      _: 1
                    }),
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VTextField, {
                          modelValue: renameForm.value.label,
                          "onUpdate:modelValue": _cache[80] || (_cache[80] = $event => ((renameForm.value.label) = $event)),
                          label: "显示名称"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VTextarea, {
                  modelValue: renameForm.value.expression,
                  "onUpdate:modelValue": _cache[81] || (_cache[81] = $event => ((renameForm.value.expression) = $event)),
                  label: "字段内容 / Jinja2 表达式",
                  rows: "6",
                  "auto-grow": "",
                  hint: "固定内容直接填写；组合使用 {{ title }}；条件可使用 {% if ... %}...{% endif %}",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VTextField, {
                  modelValue: renameForm.value.fallback,
                  "onUpdate:modelValue": _cache[82] || (_cache[82] = $event => ((renameForm.value.fallback) = $event)),
                  label: "计算失败时的回退值",
                  clearable: ""
                }, null, 8, ["modelValue"]),
                _createElementVNode$3("div", _hoisted_160, [
                  _cache[255] || (_cache[255] = _createElementVNode$3("div", null, [
                    _createElementVNode$3("div", { class: "font-weight-medium" }, "启用字段"),
                    _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, "停用后变量不会注入命名模板")
                  ], -1)),
                  _createVNode$3(_component_VSwitch, {
                    modelValue: renameForm.value.enabled,
                    "onUpdate:modelValue": _cache[83] || (_cache[83] = $event => ((renameForm.value.enabled) = $event)),
                    color: "success",
                    "hide-details": ""
                  }, null, 8, ["modelValue"])
                ]),
                _createVNode$3(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx$3(() => [...(_cache[256] || (_cache[256] = [
                    _createTextVNode$3("MP 命名模板中使用：", -1),
                    _createElementVNode$3("code", null, "{{ 字段名 }}", -1),
                    _createTextVNode$3("。目标目录字段在初次渲染后补算，并由插件用同一模板安全重渲染一次。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VSpacer),
                _createVNode$3(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[84] || (_cache[84] = $event => (renameDialog.value = false))
                }, {
                  default: _withCtx$3(() => [...(_cache[257] || (_cache[257] = [
                    _createTextVNode$3("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'rename-field',
                  onClick: saveRenameField
                }, {
                  default: _withCtx$3(() => [...(_cache[258] || (_cache[258] = [
                    _createTextVNode$3("保存字段", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$3(_component_VDialog, {
      modelValue: groupArrangementDialog.value,
      "onUpdate:modelValue": _cache[95] || (_cache[95] = $event => ((groupArrangementDialog).value = $event)),
      "max-width": "820"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCard, null, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardItem, null, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardTitle, null, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3(_toDisplayString$3(groupArrangementForm.value.id ? '编辑制作组编排' : '新增制作组编排'), 1)
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VCardSubtitle, null, {
                  default: _withCtx$3(() => [...(_cache[259] || (_cache[259] = [
                    _createTextVNode$3("规则针对单个制作组生效，不需要枚举 A+B、B+A 等所有组合。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VRow, null, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VTextField, {
                          modelValue: groupArrangementForm.value.match_name,
                          "onUpdate:modelValue": _cache[86] || (_cache[86] = $event => ((groupArrangementForm.value.match_name) = $event)),
                          label: "识别名称",
                          placeholder: "VCB-Studio",
                          hint: "MP releaseGroup 中出现的主要名称",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VTextField, {
                          modelValue: groupArrangementForm.value.output_name,
                          "onUpdate:modelValue": _cache[87] || (_cache[87] = $event => ((groupArrangementForm.value.output_name) = $event)),
                          label: "最终显示名称",
                          placeholder: "VCB-Studio",
                          hint: "留空时与识别名称相同",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VTextField, {
                  modelValue: groupArrangementForm.value.label,
                  "onUpdate:modelValue": _cache[88] || (_cache[88] = $event => ((groupArrangementForm.value.label) = $event)),
                  label: "规则名称",
                  placeholder: "例如：VCB 固定最后"
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VTextarea, {
                  modelValue: groupArrangementForm.value.aliases,
                  "onUpdate:modelValue": _cache[89] || (_cache[89] = $event => ((groupArrangementForm.value.aliases) = $event)),
                  label: "其它别名（每行一个）",
                  rows: "3",
                  "auto-grow": "",
                  placeholder: "VCB\nVCB Studio",
                  hint: "别名只做单个制作组归一化，不会改 MP 的原始识别词",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VRow, null, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VSelect, {
                          modelValue: groupArrangementForm.value.position,
                          "onUpdate:modelValue": _cache[90] || (_cache[90] = $event => ((groupArrangementForm.value.position) = $event)),
                          label: "所在位置",
                          items: groupPositionItems.value,
                          "item-title": "label",
                          "item-value": "value"
                        }, null, 8, ["modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "3"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VCombobox, {
                          modelValue: groupArrangementForm.value.connector,
                          "onUpdate:modelValue": _cache[91] || (_cache[91] = $event => ((groupArrangementForm.value.connector) = $event)),
                          label: "前置连接符",
                          items: groupConnectorItems.value,
                          "item-title": "title",
                          "item-value": "value",
                          "return-object": false,
                          hint: "不指定时先继承标题连接符，再回退全局默认",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "4"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VTextField, {
                          modelValue: groupArrangementForm.value.order,
                          "onUpdate:modelValue": _cache[92] || (_cache[92] = $event => ((groupArrangementForm.value.order) = $event)),
                          type: "number",
                          label: "同位置排序值",
                          hint: "数值越小越靠前",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createElementVNode$3("div", _hoisted_161, [
                  _cache[260] || (_cache[260] = _createElementVNode$3("div", null, [
                    _createElementVNode$3("div", { class: "font-weight-medium" }, "启用规则"),
                    _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, "停用后保留配置但不参与编排")
                  ], -1)),
                  _createVNode$3(_component_VSwitch, {
                    modelValue: groupArrangementForm.value.enabled,
                    "onUpdate:modelValue": _cache[93] || (_cache[93] = $event => ((groupArrangementForm.value.enabled) = $event)),
                    color: "success",
                    "hide-details": ""
                  }, null, 8, ["modelValue"])
                ]),
                _createVNode$3(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx$3(() => [...(_cache[261] || (_cache[261] = [
                    _createTextVNode$3("示例：全局默认连接符设为 ", -1),
                    _createElementVNode$3("code", null, "@", -1),
                    _createTextVNode$3("；VCB-Studio 单独设置“固定最后 + &”，ADWeb 选择“使用默认”，输入 ", -1),
                    _createElementVNode$3("code", null, "ADWeb@A@VCB", -1),
                    _createTextVNode$3(" 将得到 ", -1),
                    _createElementVNode$3("code", null, "A&VCB-Studio@ADWeb", -1),
                    _createTextVNode$3("。只有一个制作组时不会在开头添加连接符。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VSpacer),
                _createVNode$3(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[94] || (_cache[94] = $event => (groupArrangementDialog.value = false))
                }, {
                  default: _withCtx$3(() => [...(_cache[262] || (_cache[262] = [
                    _createTextVNode$3("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'group-arrangement',
                  onClick: saveGroupArrangement
                }, {
                  default: _withCtx$3(() => [...(_cache[263] || (_cache[263] = [
                    _createTextVNode$3("保存编排", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$3(_component_VDialog, {
      modelValue: mappingDialog.value,
      "onUpdate:modelValue": _cache[104] || (_cache[104] = $event => ((mappingDialog).value = $event)),
      "max-width": "820"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCard, null, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardItem, null, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardTitle, null, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3(_toDisplayString$3(mappingForm.value.id ? '编辑最终命名规则' : '新增最终命名规则'), 1)
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VCardSubtitle, null, {
                  default: _withCtx$3(() => [...(_cache[264] || (_cache[264] = [
                    _createTextVNode$3("规则处理 MP 模板生成的完整相对路径，并按优先级从高到低连续执行。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VSelect, {
                  modelValue: mappingForm.value.mode,
                  "onUpdate:modelValue": _cache[96] || (_cache[96] = $event => ((mappingForm.value.mode) = $event)),
                  label: "匹配模式",
                  items: [{title:'字面替换',value:'literal'},{title:'正则替换',value:'regex'}]
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VTextField, {
                  modelValue: mappingForm.value.label,
                  "onUpdate:modelValue": _cache[97] || (_cache[97] = $event => ((mappingForm.value.label) = $event)),
                  label: "规则名称",
                  placeholder: "例如：统一合作字幕组顺序"
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VTextarea, {
                  modelValue: mappingForm.value.pattern,
                  "onUpdate:modelValue": _cache[98] || (_cache[98] = $event => ((mappingForm.value.pattern) = $event)),
                  label: mappingForm.value.mode === 'regex' ? '匹配正则' : '查找文字',
                  rows: "3",
                  "auto-grow": ""
                }, null, 8, ["modelValue", "label"]),
                _createVNode$3(_component_VTextField, {
                  modelValue: mappingForm.value.replacement,
                  "onUpdate:modelValue": _cache[99] || (_cache[99] = $event => ((mappingForm.value.replacement) = $event)),
                  label: "替换为",
                  hint: "留空表示删除；正则模式支持 Python re.sub 的 \\1 与 \\g<name> 引用",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VRow, { align: "center" }, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VTextField, {
                          modelValue: mappingForm.value.priority,
                          "onUpdate:modelValue": _cache[100] || (_cache[100] = $event => ((mappingForm.value.priority) = $event)),
                          type: "number",
                          label: "优先级",
                          hint: "数值越大越先执行；后续规则继续处理本规则输出",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode$3(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$3(() => [
                        _createElementVNode$3("div", _hoisted_162, [
                          _cache[265] || (_cache[265] = _createElementVNode$3("div", null, [
                            _createElementVNode$3("div", { class: "font-weight-medium" }, "启用规则"),
                            _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, "停用后保留配置但不执行")
                          ], -1)),
                          _createVNode$3(_component_VSwitch, {
                            modelValue: mappingForm.value.enabled,
                            "onUpdate:modelValue": _cache[101] || (_cache[101] = $event => ((mappingForm.value.enabled) = $event)),
                            color: "success",
                            "hide-details": ""
                          }, null, 8, ["modelValue"])
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx$3(() => [...(_cache[266] || (_cache[266] = [
                    _createTextVNode$3("示例：依次添加 ", -1),
                    _createElementVNode$3("code", null, "AB/C → ABC", -1),
                    _createTextVNode$3(" 与 ", -1),
                    _createElementVNode$3("code", null, ".chi.zh-cn → .chs", -1),
                    _createTextVNode$3("，输入 ", -1),
                    _createElementVNode$3("code", null, "AB/C.chi.zh-cn.ass", -1),
                    _createTextVNode$3(" 会得到 ", -1),
                    _createElementVNode$3("code", null, "ABC.chs.ass", -1),
                    _createTextVNode$3("。绝对路径及包含 ", -1),
                    _createElementVNode$3("code", null, "..", -1),
                    _createTextVNode$3(" 的危险结果会被拒绝。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VSpacer),
                _createVNode$3(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[102] || (_cache[102] = $event => (mappingDialog.value = false))
                }, {
                  default: _withCtx$3(() => [...(_cache[267] || (_cache[267] = [
                    _createTextVNode$3("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'rename-mapping',
                  onClick: _cache[103] || (_cache[103] = $event => (saveMappingRule()))
                }, {
                  default: _withCtx$3(() => [...(_cache[268] || (_cache[268] = [
                    _createTextVNode$3("保存映射", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"])
  ]))
}
}

};
const MetadataTools = /*#__PURE__*/_export_sfc(_sfc_main$3, [['__scopeId',"data-v-9c196eb7"]]);

const {createTextVNode:_createTextVNode$2,resolveComponent:_resolveComponent$2,withCtx:_withCtx$2,createVNode:_createVNode$2,unref:_unref$1,toDisplayString:_toDisplayString$2,openBlock:_openBlock$2,createBlock:_createBlock$2,createCommentVNode:_createCommentVNode$2,createElementVNode:_createElementVNode$2,createElementBlock:_createElementBlock$2,renderList:_renderList$2,Fragment:_Fragment$2} = await importShared('vue');


const _hoisted_1$2 = {
  key: 2,
  class: "live-strip mb-4"
};
const _hoisted_2$2 = { class: "live-metric" };
const _hoisted_3$2 = {
  viewBox: "0 0 180 42",
  preserveAspectRatio: "none"
};
const _hoisted_4$2 = ["points"];
const _hoisted_5$2 = { class: "live-metric" };
const _hoisted_6$2 = {
  viewBox: "0 0 180 42",
  preserveAspectRatio: "none"
};
const _hoisted_7$2 = ["points"];
const _hoisted_8$2 = { class: "live-metric" };
const _hoisted_9$2 = {
  viewBox: "0 0 180 42",
  preserveAspectRatio: "none"
};
const _hoisted_10$2 = ["points"];
const _hoisted_11$2 = { class: "live-metric" };
const _hoisted_12$2 = {
  viewBox: "0 0 180 42",
  preserveAspectRatio: "none"
};
const _hoisted_13$2 = ["points"];
const _hoisted_14$2 = {
  key: 3,
  class: "diagnostic-grid mb-4"
};
const _hoisted_15$2 = {
  key: 4,
  class: "finding-list"
};
const _hoisted_16$2 = {
  key: 5,
  class: "empty-state"
};
const _hoisted_17$2 = { class: "text-h6 mt-3" };

const {computed: computed$2,onBeforeUnmount: onBeforeUnmount$1,onMounted: onMounted$2,ref: ref$2,watch} = await importShared('vue');


const _sfc_main$2 = {
  __name: 'PerformanceDiagnostics',
  props: { api: { type: Object, default: () => ({}) }, pluginId: { type: String, default: 'TmdbRecognizeEnhancer' } },
  setup(__props) {

const props = __props;
const loading = ref$2(false);
const error = ref$2('');
const server = ref$2(null);
const browser = ref$2(null);
const samples = ref$2([]);
const autoRefresh = ref$2(true);
const intervalSeconds = ref$2(3);
let timer = null;
const pluginBase = computed$2(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`);
const intervalItems = [2, 3, 5, 10].map(value => ({ title: `${value} 秒`, value }));

function mb(value) { return value == null ? '不可用' : `${value} MB` }
function rate(value) { return value == null ? '不可用' : `${value} KB/s` }
function duration(value) {
  if (value == null) return '不可用'
  const seconds = Number(value) || 0;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds % 86400 / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  return days ? `${days} 天 ${hours} 小时` : hours ? `${hours} 小时 ${minutes} 分` : `${minutes} 分钟`
}
function explainError(err) {
  const status = err?.response?.status || err?.status;
  if (status === 404 || String(err?.message || '').includes('404')) return '后端仍是旧插件实例，尚未注册诊断接口；请重载插件或重启一次 MP 容器。'
  return err?.message || '性能采样失败'
}

async function sampleBrowser() {
  const started = performance.now();
  let frames = 0;
  await new Promise(resolve => {
    const end = started + 300;
    const tick = now => { frames += 1; if (now < end) requestAnimationFrame(tick); else resolve(); };
    requestAnimationFrame(tick);
  });
  const elapsed = Math.max(performance.now() - started, 1);
  const memory = performance.memory;
  return {
    fps: Math.min(120, Math.round(frames * 1000 / elapsed)),
    dom_nodes: document.getElementsByTagName('*').length,
    js_heap_mb: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024 * 10) / 10 : null,
    heap_limit_mb: memory ? Math.round(memory.jsHeapSizeLimit / 1024 / 1024) : null,
  }
}

function addSample(serverResult, browserResult) {
  samples.value = [...samples.value, {
    time: Date.now(),
    process_cpu: Number(serverResult.process?.cpu_percent || 0),
    system_cpu: Number(serverResult.system?.cpu_percent || 0),
    rss: Number(serverResult.process?.rss_mb || 0),
    api_rtt: Number(browserResult.api_rtt_ms || 0),
    fps: Number(browserResult.fps || 0),
  }].slice(-30);
}

async function sample() {
  if (loading.value) return
  loading.value = true;
  error.value = '';
  const requestStart = performance.now();
  try {
    const [response, browserResult] = await Promise.all([
      props.api.get(`${pluginBase.value}/diagnostics`), sampleBrowser(),
    ]);
    const serverResult = unwrapResponse(response);
    const completedBrowser = { ...browserResult, api_rtt_ms: Math.round((performance.now() - requestStart) * 10) / 10 };
    server.value = serverResult;
    browser.value = completedBrowser;
    addSample(serverResult, completedBrowser);
  } catch (err) { error.value = explainError(err); }
  finally { loading.value = false; }
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}
function syncTimer() {
  stopTimer();
  if (!autoRefresh.value) return
  sample();
  timer = setInterval(sample, Math.max(2, Number(intervalSeconds.value) || 3) * 1000);
}

watch([autoRefresh, intervalSeconds], syncTimer);
onMounted$2(syncTimer);
onBeforeUnmount$1(stopTimer);

function sparkline(key) {
  const values = samples.value.map(item => Number(item[key])).filter(Number.isFinite);
  if (!values.length) return ''
  const width = 180;
  const height = 42;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1);
  return values.map((value, index) => {
    const x = values.length === 1 ? width : index * width / (values.length - 1);
    const y = height - 3 - (value - min) / spread * (height - 6);
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

const browserFindings = computed$2(() => {
  const result = [];
  if (browser.value?.fps != null && browser.value.fps < 30) result.push({ level: 'warning', title: '当前管理页面帧率偏低', detail: `短时约 ${browser.value.fps} FPS，卡顿更偏向浏览器渲染侧。` });
  if (browser.value?.api_rtt_ms >= 1200) result.push({ level: 'warning', title: '插件接口响应偏慢', detail: `本次往返约 ${browser.value.api_rtt_ms} ms，需结合 MP CPU、I/O 和季度扫描判断。` });
  if (browser.value?.dom_nodes >= 8000) result.push({ level: 'warning', title: '页面 DOM 节点较多', detail: `当前约 ${browser.value.dom_nodes} 个节点，超长列表可能造成滚动卡顿。` });
  return result
});
const findings = computed$2(() => {
  const browserItems = browserFindings.value;
  const serverItems = server.value?.findings || [];
  const filteredServer = browserItems.length
    ? serverItems.filter(item => !(item.level === 'success' && item.title?.includes('未发现明显')))
    : serverItems;
  return [...filteredServer, ...browserItems]
});

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent$2("VBtn");
  const _component_VSwitch = _resolveComponent$2("VSwitch");
  const _component_VSelect = _resolveComponent$2("VSelect");
  const _component_VAlert = _resolveComponent$2("VAlert");
  const _component_VCardTitle = _resolveComponent$2("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$2("VCardSubtitle");
  const _component_VCardItem = _resolveComponent$2("VCardItem");
  const _component_VCardText = _resolveComponent$2("VCardText");
  const _component_VCard = _resolveComponent$2("VCard");
  const _component_VProgressCircular = _resolveComponent$2("VProgressCircular");
  const _component_VIcon = _resolveComponent$2("VIcon");

  return (_openBlock$2(), _createElementBlock$2("div", null, [
    _createVNode$2(ModuleHeader, {
      icon: "mdi-speedometer",
      title: "性能与占用诊断",
      subtitle: "区分 MoviePilot 后端负载、插件任务和当前浏览器页面卡顿；最多保留 30 个页面内采样点。",
      color: "secondary"
    }, {
      actions: _withCtx$2(() => [
        _createVNode$2(_component_VBtn, {
          color: "primary",
          "prepend-icon": "mdi-refresh",
          loading: loading.value,
          onClick: sample
        }, {
          default: _withCtx$2(() => [...(_cache[3] || (_cache[3] = [
            _createTextVNode$2("立即采样", -1)
          ]))]),
          _: 1
        }, 8, ["loading"])
      ]),
      controls: _withCtx$2(() => [
        _createVNode$2(_component_VSwitch, {
          modelValue: autoRefresh.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((autoRefresh).value = $event)),
          color: "success",
          label: "实时刷新",
          "hide-details": ""
        }, null, 8, ["modelValue"]),
        _createVNode$2(_component_VSelect, {
          modelValue: intervalSeconds.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((intervalSeconds).value = $event)),
          items: _unref$1(intervalItems),
          "item-title": "title",
          "item-value": "value",
          density: "compact",
          "hide-details": "",
          class: "interval-select",
          disabled: !autoRefresh.value
        }, null, 8, ["modelValue", "items", "disabled"])
      ]),
      _: 1
    }),
    (error.value)
      ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          closable: "",
          class: "mb-4",
          "onClick:close": _cache[2] || (_cache[2] = $event => (error.value = ''))
        }, {
          default: _withCtx$2(() => [
            _createTextVNode$2(_toDisplayString$2(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$2("", true),
    _createVNode$2(_component_VAlert, {
      type: "info",
      variant: "tonal",
      density: "compact",
      class: "mb-4"
    }, {
      default: _withCtx$2(() => [...(_cache[4] || (_cache[4] = [
        _createTextVNode$2("实时刷新只在本页打开时工作，离开页面即停止；推荐 3–5 秒间隔。进程 CPU 需至少两个采样点才有参考价值。", -1)
      ]))]),
      _: 1
    }),
    (server.value?.errors?.length)
      ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: _withCtx$2(() => [
            _createTextVNode$2(_toDisplayString$2(server.value.errors.join('；')) + "。已自动改用系统原生兼容采样，个别指标可能显示不可用。", 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$2("", true),
    (server.value)
      ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_1$2, [
          _createElementVNode$2("div", _hoisted_2$2, [
            _cache[5] || (_cache[5] = _createElementVNode$2("span", null, "MP CPU", -1)),
            _createElementVNode$2("strong", null, _toDisplayString$2(server.value.process?.cpu_percent ?? '—') + "%", 1),
            (_openBlock$2(), _createElementBlock$2("svg", _hoisted_3$2, [
              _createElementVNode$2("polyline", {
                points: sparkline('process_cpu')
              }, null, 8, _hoisted_4$2)
            ]))
          ]),
          _createElementVNode$2("div", _hoisted_5$2, [
            _cache[6] || (_cache[6] = _createElementVNode$2("span", null, "常驻内存", -1)),
            _createElementVNode$2("strong", null, _toDisplayString$2(mb(server.value.process?.rss_mb)), 1),
            (_openBlock$2(), _createElementBlock$2("svg", _hoisted_6$2, [
              _createElementVNode$2("polyline", {
                points: sparkline('rss')
              }, null, 8, _hoisted_7$2)
            ]))
          ]),
          _createElementVNode$2("div", _hoisted_8$2, [
            _cache[7] || (_cache[7] = _createElementVNode$2("span", null, "接口往返", -1)),
            _createElementVNode$2("strong", null, _toDisplayString$2(browser.value?.api_rtt_ms ?? '—') + " ms", 1),
            (_openBlock$2(), _createElementBlock$2("svg", _hoisted_9$2, [
              _createElementVNode$2("polyline", {
                points: sparkline('api_rtt')
              }, null, 8, _hoisted_10$2)
            ]))
          ]),
          _createElementVNode$2("div", _hoisted_11$2, [
            _cache[8] || (_cache[8] = _createElementVNode$2("span", null, "页面帧率", -1)),
            _createElementVNode$2("strong", null, _toDisplayString$2(browser.value?.fps ?? '—') + " FPS", 1),
            (_openBlock$2(), _createElementBlock$2("svg", _hoisted_12$2, [
              _createElementVNode$2("polyline", {
                points: sparkline('fps')
              }, null, 8, _hoisted_13$2)
            ]))
          ])
        ]))
      : _createCommentVNode$2("", true),
    (server.value)
      ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_14$2, [
          _createVNode$2(_component_VCard, { variant: "outlined" }, {
            default: _withCtx$2(() => [
              _createVNode$2(_component_VCardItem, null, {
                default: _withCtx$2(() => [
                  _createVNode$2(_component_VCardTitle, null, {
                    default: _withCtx$2(() => [...(_cache[9] || (_cache[9] = [
                      _createTextVNode$2("MoviePilot 进程", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode$2(_component_VCardSubtitle, null, {
                    default: _withCtx$2(() => [
                      _createTextVNode$2("PID " + _toDisplayString$2(server.value.process?.pid) + " · 已运行 " + _toDisplayString$2(duration(server.value.process?.uptime_seconds)), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode$2(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx$2(() => [
                  _createElementVNode$2("div", null, [
                    _cache[10] || (_cache[10] = _createElementVNode$2("span", null, "CPU / 内存占比", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(server.value.process?.cpu_percent ?? '—') + "% / " + _toDisplayString$2(server.value.process?.memory_percent ?? '—') + "%", 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[11] || (_cache[11] = _createElementVNode$2("span", null, "RSS / 虚拟内存", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(mb(server.value.process?.rss_mb)) + " / " + _toDisplayString$2(mb(server.value.process?.vms_mb)), 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[12] || (_cache[12] = _createElementVNode$2("span", null, "线程 / 文件描述符", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(server.value.process?.threads ?? '—') + " / " + _toDisplayString$2(server.value.process?.file_descriptors ?? '—'), 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[13] || (_cache[13] = _createElementVNode$2("span", null, "读取 / 写入", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(rate(server.value.process?.io_read_kbps)) + " / " + _toDisplayString$2(rate(server.value.process?.io_write_kbps)), 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode$2(_component_VCard, { variant: "outlined" }, {
            default: _withCtx$2(() => [
              _createVNode$2(_component_VCardItem, null, {
                default: _withCtx$2(() => [
                  _createVNode$2(_component_VCardTitle, null, {
                    default: _withCtx$2(() => [...(_cache[14] || (_cache[14] = [
                      _createTextVNode$2("服务器资源", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode$2(_component_VCardSubtitle, null, {
                    default: _withCtx$2(() => [
                      _createTextVNode$2(_toDisplayString$2(server.value.system?.cpu_count) + " 逻辑 CPU · " + _toDisplayString$2(server.value.system?.platform), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode$2(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx$2(() => [
                  _createElementVNode$2("div", null, [
                    _cache[15] || (_cache[15] = _createElementVNode$2("span", null, "整机 CPU / Load", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(server.value.system?.cpu_percent ?? '—') + "% / " + _toDisplayString$2(server.value.system?.load_average?.join(' / ') || '—'), 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[16] || (_cache[16] = _createElementVNode$2("span", null, "内存 / Swap", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(server.value.system?.memory_percent ?? '—') + "% / " + _toDisplayString$2(server.value.system?.swap_percent ?? '—') + "%", 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[17] || (_cache[17] = _createElementVNode$2("span", null, "可用内存", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(mb(server.value.system?.memory_available_mb)), 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[18] || (_cache[18] = _createElementVNode$2("span", null, "磁盘使用 / 剩余", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(server.value.system?.disk_percent ?? '—') + "% / " + _toDisplayString$2(mb(server.value.system?.disk_free_mb)), 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode$2(_component_VCard, { variant: "outlined" }, {
            default: _withCtx$2(() => [
              _createVNode$2(_component_VCardItem, null, {
                default: _withCtx$2(() => [
                  _createVNode$2(_component_VCardTitle, null, {
                    default: _withCtx$2(() => [...(_cache[19] || (_cache[19] = [
                      _createTextVNode$2("插件运行量", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode$2(_component_VCardSubtitle, null, {
                    default: _withCtx$2(() => [
                      _createTextVNode$2("服务端采样 " + _toDisplayString$2(server.value.sampling_ms) + " ms · 序号 " + _toDisplayString$2(server.value.sequence), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode$2(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx$2(() => [
                  _createElementVNode$2("div", null, [
                    _cache[20] || (_cache[20] = _createElementVNode$2("span", null, "季度扫描 / 看板条目", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(server.value.plugin?.active_catalog_scans || 0) + " / " + _toDisplayString$2(server.value.plugin?.season_catalog_items || 0), 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[21] || (_cache[21] = _createElementVNode$2("span", null, "集数规则 / 字段覆盖", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(server.value.plugin?.episode_rules || 0) + " / " + _toDisplayString$2(server.value.plugin?.compiled_rules || 0), 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[22] || (_cache[22] = _createElementVNode$2("span", null, "自定义字段 / 命名规则", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(server.value.plugin?.custom_rename_fields || 0) + " / " + _toDisplayString$2((server.value.plugin?.rename_mapping_rules || 0) + (server.value.plugin?.release_group_rules || 0)), 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[23] || (_cache[23] = _createElementVNode$2("span", null, "外部缓存 / 模块日志", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(server.value.plugin?.web_cache_entries || 0) + " / " + _toDisplayString$2(server.value.plugin?.history_records || 0), 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode$2(_component_VCard, { variant: "outlined" }, {
            default: _withCtx$2(() => [
              _createVNode$2(_component_VCardItem, null, {
                default: _withCtx$2(() => [
                  _createVNode$2(_component_VCardTitle, null, {
                    default: _withCtx$2(() => [...(_cache[24] || (_cache[24] = [
                      _createTextVNode$2("当前浏览器页面", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode$2(_component_VCardSubtitle, null, {
                    default: _withCtx$2(() => [
                      _createTextVNode$2(_toDisplayString$2(samples.value.length) + " / 30 个趋势采样点", 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode$2(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx$2(() => [
                  _createElementVNode$2("div", null, [
                    _cache[25] || (_cache[25] = _createElementVNode$2("span", null, "短时帧率", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(browser.value?.fps ?? '—') + " FPS", 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[26] || (_cache[26] = _createElementVNode$2("span", null, "DOM 节点", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(browser.value?.dom_nodes ?? '—'), 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[27] || (_cache[27] = _createElementVNode$2("span", null, "JS 堆 / 上限", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(browser.value?.js_heap_mb == null ? '浏览器不提供' : `${mb(browser.value.js_heap_mb)} / ${mb(browser.value.heap_limit_mb)}`), 1)
                  ]),
                  _createElementVNode$2("div", null, [
                    _cache[28] || (_cache[28] = _createElementVNode$2("span", null, "接口往返", -1)),
                    _createElementVNode$2("strong", null, _toDisplayString$2(browser.value?.api_rtt_ms ?? '—') + " ms", 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]))
      : _createCommentVNode$2("", true),
    (findings.value.length)
      ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_15$2, [
          (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(findings.value, (item, index) => {
            return (_openBlock$2(), _createBlock$2(_component_VAlert, {
              key: index,
              type: item.level,
              variant: "tonal",
              density: "compact"
            }, {
              default: _withCtx$2(() => [
                _createElementVNode$2("strong", null, _toDisplayString$2(item.title), 1),
                _createElementVNode$2("div", null, _toDisplayString$2(item.detail), 1)
              ]),
              _: 2
            }, 1032, ["type"]))
          }), 128))
        ]))
      : (_openBlock$2(), _createElementBlock$2("div", _hoisted_16$2, [
          (loading.value)
            ? (_openBlock$2(), _createBlock$2(_component_VProgressCircular, {
                key: 0,
                indeterminate: "",
                color: "primary"
              }))
            : (_openBlock$2(), _createBlock$2(_component_VIcon, {
                key: 1,
                icon: "mdi-gauge-empty",
                size: "52"
              })),
          _createElementVNode$2("div", _hoisted_17$2, _toDisplayString$2(loading.value ? '正在采样' : '尚无诊断结果'), 1)
        ]))
  ]))
}
}

};
const PerformanceDiagnostics = /*#__PURE__*/_export_sfc(_sfc_main$2, [['__scopeId',"data-v-db27feb0"]]);

const {toDisplayString:_toDisplayString$1,createTextVNode:_createTextVNode$1,resolveComponent:_resolveComponent$1,withCtx:_withCtx$1,openBlock:_openBlock$1,createBlock:_createBlock$1,createCommentVNode:_createCommentVNode$1,createVNode:_createVNode$1,renderList:_renderList$1,Fragment:_Fragment$1,createElementBlock:_createElementBlock$1,createElementVNode:_createElementVNode$1,normalizeClass:_normalizeClass$1,vShow:_vShow$1,withDirectives:_withDirectives$1} = await importShared('vue');


const _hoisted_1$1 = { class: "notification-page" };
const _hoisted_2$1 = {
  class: "notification-workspace-nav",
  "aria-label": "通知接管功能分区"
};
const _hoisted_3$1 = ["onClick"];
const _hoisted_4$1 = { class: "section-shell" };
const _hoisted_5$1 = { class: "mode-grid" };
const _hoisted_6$1 = ["onClick"];
const _hoisted_7$1 = { class: "route-defaults" };
const _hoisted_8$1 = { class: "route-legend" };
const _hoisted_9$1 = { class: "notification-type-grid" };
const _hoisted_10$1 = { class: "notification-type-copy" };
const _hoisted_11$1 = {
  key: 1,
  class: "route-service-placeholder"
};
const _hoisted_12$1 = { class: "template-panel-title" };
const _hoisted_13$1 = { class: "notification-template-grid" };
const _hoisted_14$1 = { class: "notification-template-card success" };
const _hoisted_15$1 = { class: "notification-template-card failure" };
const _hoisted_16$1 = { class: "notification-template-card generic" };
const _hoisted_17$1 = { class: "option-row mt-3" };
const _hoisted_18$1 = { class: "section-shell" };
const _hoisted_19$1 = { class: "section-heading" };
const _hoisted_20$1 = { class: "policy-grid" };
const _hoisted_21$1 = { class: "policy-copy" };
const _hoisted_22$1 = { class: "section-shell" };
const _hoisted_23$1 = { class: "section-heading responsive" };
const _hoisted_24$1 = { class: "delivery-grid" };
const _hoisted_25$1 = { class: "delivery-mode" };
const _hoisted_26$1 = { class: "delivery-mode realtime" };
const _hoisted_27$1 = { class: "candidate-message-style" };
const _hoisted_28$1 = {
  key: 0,
  class: "premium-emoji-help"
};
const _hoisted_29$1 = { class: "candidate-controls" };
const _hoisted_30$1 = { class: "option-row compact" };
const _hoisted_31$1 = {
  key: 2,
  class: "candidate-list"
};
const _hoisted_32$1 = { class: "candidate-toolbar" };
const _hoisted_33$1 = { class: "candidate-actions" };
const _hoisted_34$1 = { class: "candidate-items" };
const _hoisted_35$1 = {
  key: 1,
  class: "candidate-poster candidate-poster-placeholder"
};
const _hoisted_36$1 = { class: "candidate-copy" };
const _hoisted_37$1 = {
  key: 3,
  class: "candidate-list failed-list"
};
const _hoisted_38$1 = { class: "candidate-toolbar" };
const _hoisted_39$1 = { class: "candidate-actions" };
const _hoisted_40$1 = { class: "candidate-items" };
const _hoisted_41$1 = {
  key: 1,
  class: "candidate-poster candidate-poster-placeholder"
};
const _hoisted_42$1 = { class: "candidate-copy" };
const _hoisted_43$1 = {
  key: 4,
  class: "empty-inline"
};
const _hoisted_44$1 = { class: "section-shell" };
const _hoisted_45$1 = { key: 0 };
const _hoisted_46$1 = { class: "record-toolbar" };
const _hoisted_47$1 = {
  key: 0,
  class: "record-list"
};
const _hoisted_48$1 = { key: 0 };
const _hoisted_49$1 = {
  key: 1,
  class: "empty-inline"
};

const {computed: computed$1,onBeforeUnmount,onMounted: onMounted$1,ref: ref$1} = await importShared('vue');


const _sfc_main$1 = {
  __name: 'NotificationEnhancer',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginBase: { type: String, required: true },
},
  emits: ['config-saved'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;

const loading = ref$1(false);
const saving = ref$1(false);
const testing = ref$1(false);
const candidateLoading = ref$1(false);
const candidateSyncing = ref$1(false);
const actionLoading = ref$1(false);
const error = ref$1('');
const notice = ref$1('');
const data = ref$1({
  active: false,
  config: {},
  failure_categories: [],
  records: [],
  record_counts: {},
  candidates: { ready: [], failed: [] },
  notification_types: [],
  notification_services: [],
  notification_channels: [],
  candidate_schedule: {},
});
const now = new Date();
const selectedQuarter = ref$1(`${now.getFullYear()}-Q${Math.floor(now.getMonth() / 3) + 1}`);
const selectedReadyIds = ref$1([]);
const selectedFailedIds = ref$1([]);
const manualCandidateBusy = ref$1('');
const manualCandidateDialog = ref$1(false);
const manualCandidateItem = ref$1(null);
const manualCandidateTmdbId = ref$1('');
const recordFilter = ref$1('all');
const showRecords = ref$1(false);
const activeWorkspace = ref$1('routes');

const config = computed$1(() => data.value.config || {});
const modeItems = [
  { title: '仅观察', value: 'observe', subtitle: '只分类和记录，不发送额外消息' },
  { title: '并行增强', value: 'parallel', subtitle: '保留原生通知，同时发送增强通知' },
  { title: '接管发送', value: 'takeover', subtitle: '由插件发送；需关闭原生渠道类型' },
];
const policyItems = [
  { title: '立即通知', value: 'notify' },
  { title: '进入摘要', value: 'digest' },
  { title: '静默记录', value: 'silent' },
];
const routePolicyItems = [
  { title: '接管发送', value: 'notify' },
  { title: '仅记录', value: 'record' },
  { title: '静默忽略', value: 'silent' },
];
const workspaceItems = [
  { title: '通知路由', value: 'routes', icon: 'mdi-routes' },
  { title: '失败策略', value: 'failures', icon: 'mdi-alert-decagram-outline' },
  { title: '集数偏移审批', value: 'candidates', icon: 'mdi-counter' },
  { title: '运行记录', value: 'records', icon: 'mdi-text-box-search-outline' },
];
const recordActionText = {
  observed: '已观察',
  notified: '已提交到 MP',
  delivered: '渠道确认送达',
  delivery_failed: '渠道发送失败',
  suppressed: '已静默',
  digest_pending: '等待摘要',
  digest_sent: '摘要已提交',
};
const quarterItems = computed$1(() => {
  const values = [];
  for (let year = now.getFullYear() + 1; year >= now.getFullYear() - 3; year -= 1) {
    for (let quarter = 4; quarter >= 1; quarter -= 1) {
      values.push({ title: `${year} 年 Q${quarter}`, value: `${year}-Q${quarter}` });
    }
  }
  return values
});
const records = computed$1(() => (data.value.records || []).filter(item => {
  if (recordFilter.value === 'all') return true
  return item.scene === recordFilter.value
}));
const readyCandidates = computed$1(() => data.value.candidates?.ready || []);
const failedCandidates = computed$1(() => data.value.candidates?.failed || []);
const notificationTypes = computed$1(() => data.value.notification_types || []);
const notificationServiceItems = computed$1(() => (
  (data.value.notification_services || [])
    .filter(item => item.accepts_plugin)
    .map(item => ({
      title: item.title,
      value: item.value,
      subtitle: item.subtitle,
    }))
));
const unavailableNotificationServices = computed$1(() => (
  (data.value.notification_services || []).filter(item => !item.accepts_plugin)
));
const allReadySelected = computed$1(() => (
  readyCandidates.value.length > 0
  && selectedReadyIds.value.length === readyCandidates.value.length
));
const allFailedSelected = computed$1(() => (
  failedCandidates.value.length > 0
  && selectedFailedIds.value.length === failedCandidates.value.length
));

function setAllReady(value) {
  selectedReadyIds.value = value
    ? readyCandidates.value.map(item => item.id)
    : [];
}

function setAllFailed(value) {
  selectedFailedIds.value = value
    ? failedCandidates.value.map(item => item.id)
    : [];
}

async function load() {
  loading.value = true;
  error.value = '';
  try {
    data.value = unwrapResponse(
      await props.api.get(`${props.pluginBase}/notification-enhancer`),
    ) || data.value;
    if (/^\d{4}-Q[1-4]$/.test(data.value.config?.notification_candidate_quarter || '')) {
      selectedQuarter.value = data.value.config.notification_candidate_quarter;
    }
  } catch (err) {
    error.value = err?.message || '通知模块加载失败';
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  error.value = '';
  notice.value = '';
  try {
    const next = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/config`,
      config.value,
    ));
    data.value = { ...data.value, ...(next || {}) };
    emit('config-saved', config.value);
    notice.value = '设置已保存并立即生效';
  } catch (err) {
    error.value = err?.message || '保存失败';
  } finally {
    saving.value = false;
  }
}

async function sendTest(scene) {
  testing.value = true;
  error.value = '';
  try {
    const next = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/test`, { scene },
    ));
    data.value = { ...data.value, ...(next || {}) };
    notice.value = '目标通知实例已返回发送成功';
  } catch (err) {
    error.value = err?.message || '测试消息发送失败';
  } finally {
    testing.value = false;
  }
}

async function queryCandidates(options = {}) {
  const silent = options?.silent === true;
  if (candidateLoading.value || candidateSyncing.value) return
  if (silent) candidateSyncing.value = true;
  else candidateLoading.value = true;
  error.value = '';
  if (!silent) {
    selectedReadyIds.value = [];
    selectedFailedIds.value = [];
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
    )) || {};
    data.value.candidates = {
      ready: result.ready || result.items || [],
      failed: result.failed || [],
    };
    if (silent) {
      const readyIds = new Set(data.value.candidates.ready.map(item => item.id));
      const failedIds = new Set(data.value.candidates.failed.map(item => item.id));
      selectedReadyIds.value = selectedReadyIds.value.filter(id => readyIds.has(id));
      selectedFailedIds.value = selectedFailedIds.value.filter(id => failedIds.has(id));
    }
  } catch (err) {
    if (!silent) error.value = err?.message || '候选查询失败';
  } finally {
    if (silent) candidateSyncing.value = false;
    else candidateLoading.value = false;
  }
}

function switchWorkspace(value) {
  activeWorkspace.value = value;
  if (value === 'records') showRecords.value = true;
}

async function candidateAction(action, candidateType = 'ready') {
  const ids = candidateType === 'failed' ? selectedFailedIds.value : selectedReadyIds.value;
  if (!ids.length) return
  actionLoading.value = true;
  error.value = '';
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
    )) || {};
    data.value.candidates = {
      ready: result.ready || result.items || [],
      failed: result.failed || [],
    };
    selectedReadyIds.value = [];
    selectedFailedIds.value = [];
    if (action === 'ignore') notice.value = '已忽略所选候选';
    else if (action === 'retry') notice.value = '已在后台重新扫描所选失败条目';
    else notice.value = `候选已提交到集数偏移维护规则${result.operation_failures?.length ? `，${result.operation_failures.length} 条失败` : ''}`;
  } catch (err) {
    error.value = err?.message || '候选处理失败';
  } finally {
    actionLoading.value = false;
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

let candidateFilterSaveQueue = Promise.resolve();
let candidateFilterRevision = 0;

function persistCandidateFilters() {
  const payload = candidateFilterPayload();
  candidateFilterSaveQueue = candidateFilterSaveQueue
    .catch(() => {})
    .then(async () => {
      await props.api.post(
        `${props.pluginBase}/notification-enhancer/config`,
        payload,
      );
      emit('config-saved', { ...config.value, ...payload });
    });
  return candidateFilterSaveQueue
}

async function applyCandidateFilters() {
  const revision = ++candidateFilterRevision;
  try {
    await persistCandidateFilters();
    if (revision !== candidateFilterRevision) return
    await queryCandidates();
  } catch (err) {
    error.value = err?.message || '筛选条件保存失败';
  }
}

function openFailedCandidate(item) {
  manualCandidateItem.value = item;
  manualCandidateTmdbId.value = '';
  manualCandidateDialog.value = true;
  error.value = '';
}

async function addFailedCandidate(action) {
  const item = manualCandidateItem.value;
  if (!item) return
  const tmdbId = Number(manualCandidateTmdbId.value || 0);
  if (!tmdbId) {
    error.value = `请先为“${item.title}”填写 TMDBID`;
    return
  }
  manualCandidateBusy.value = item.id;
  error.value = '';
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
    )) || {};
    data.value.candidates = {
      ready: result.ready || result.items || [],
      failed: result.failed || [],
    };
    if (result.operation_failures?.length) {
      throw new Error(result.operation_failures[0]?.reason || '规则添加失败')
    }
    manualCandidateDialog.value = false;
    manualCandidateItem.value = null;
    manualCandidateTmdbId.value = '';
    notice.value = `已按 TMDB ${tmdbId} 建立维护规则`;
  } catch (err) {
    error.value = err?.message || '补充 TMDBID 失败';
  } finally {
    manualCandidateBusy.value = '';
  }
}

async function sendCandidateBatch() {
  actionLoading.value = true;
  error.value = '';
  try {
    await persistCandidateFilters();
    const result = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/candidates/batch/send`,
      {
        quarter: selectedQuarter.value,
        region: config.value.notification_candidate_region,
        platforms: config.value.notification_candidate_platforms,
        sequel_only: config.value.notification_candidate_sequel_only,
      },
    )) || {};
    if (result.snapshot) data.value.candidates = result.snapshot;
    if (result.candidate_schedule) data.value.candidate_schedule = result.candidate_schedule;
    notice.value = `计划批次已发送：可加入 ${result.ready || 0} 部，扫描失败 ${result.failed || 0} 部`;
  } catch (err) {
    error.value = err?.message || '发送计划批次失败';
  } finally {
    actionLoading.value = false;
  }
}

async function clearRecords() {
  try {
    const next = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/records/clear`, {},
    ));
    data.value = { ...data.value, ...(next || {}) };
  } catch (err) {
    error.value = err?.message || '清空失败';
  }
}

async function sendDigest() {
  try {
    const next = unwrapResponse(await props.api.post(
      `${props.pluginBase}/notification-enhancer/digest/send`, {},
    ));
    data.value = { ...data.value, ...(next || {}) };
    notice.value = '失败摘要已提交到“插件”通知渠道';
  } catch (err) {
    error.value = err?.message || '摘要发送失败';
  }
}

let candidateRefreshTimer = null;

function refreshCandidatesWhenVisible() {
  if (
    document.visibilityState === 'visible'
    && !actionLoading.value
    && !manualCandidateDialog.value
  ) {
    queryCandidates({ silent: true });
  }
}

onMounted$1(async () => {
  await load();
  await queryCandidates();
  candidateRefreshTimer = window.setInterval(refreshCandidatesWhenVisible, 15000);
  document.addEventListener('visibilitychange', refreshCandidatesWhenVisible);
  window.addEventListener('focus', refreshCandidatesWhenVisible);
});

onBeforeUnmount(() => {
  if (candidateRefreshTimer) window.clearInterval(candidateRefreshTimer);
  document.removeEventListener('visibilitychange', refreshCandidatesWhenVisible);
  window.removeEventListener('focus', refreshCandidatesWhenVisible);
});

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent$1("VAlert");
  const _component_VBtn = _resolveComponent$1("VBtn");
  const _component_VSwitch = _resolveComponent$1("VSwitch");
  const _component_VChip = _resolveComponent$1("VChip");
  const _component_VSpacer = _resolveComponent$1("VSpacer");
  const _component_VIcon = _resolveComponent$1("VIcon");
  const _component_VSelect = _resolveComponent$1("VSelect");
  const _component_VAvatar = _resolveComponent$1("VAvatar");
  const _component_VExpansionPanelTitle = _resolveComponent$1("VExpansionPanelTitle");
  const _component_VTextField = _resolveComponent$1("VTextField");
  const _component_VTextarea = _resolveComponent$1("VTextarea");
  const _component_VExpansionPanelText = _resolveComponent$1("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent$1("VExpansionPanel");
  const _component_VExpansionPanels = _resolveComponent$1("VExpansionPanels");
  const _component_VBtnToggle = _resolveComponent$1("VBtnToggle");
  const _component_VCheckboxBtn = _resolveComponent$1("VCheckboxBtn");
  const _component_VImg = _resolveComponent$1("VImg");
  const _component_VCardTitle = _resolveComponent$1("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$1("VCardSubtitle");
  const _component_VCardItem = _resolveComponent$1("VCardItem");
  const _component_VDivider = _resolveComponent$1("VDivider");
  const _component_VCardText = _resolveComponent$1("VCardText");
  const _component_VCardActions = _resolveComponent$1("VCardActions");
  const _component_VCard = _resolveComponent$1("VCard");
  const _component_VDialog = _resolveComponent$1("VDialog");
  const _component_VExpandTransition = _resolveComponent$1("VExpandTransition");

  return (_openBlock$1(), _createElementBlock$1("div", _hoisted_1$1, [
    (error.value)
      ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          closable: "",
          class: "mb-4",
          "onClick:close": _cache[0] || (_cache[0] = $event => (error.value = ''))
        }, {
          default: _withCtx$1(() => [
            _createTextVNode$1(_toDisplayString$1(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$1("", true),
    (notice.value)
      ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
          key: 1,
          type: "success",
          variant: "tonal",
          closable: "",
          density: "compact",
          class: "mb-4",
          "onClick:close": _cache[1] || (_cache[1] = $event => (notice.value = ''))
        }, {
          default: _withCtx$1(() => [
            _createTextVNode$1(_toDisplayString$1(notice.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$1("", true),
    _createVNode$1(ModuleHeader, {
      icon: "mdi-bell-cog-outline",
      title: "通知接管",
      subtitle: "统一接管 MoviePilot 的下载、整理、订阅、站点、媒体服务器及其它系统通知。",
      color: "primary"
    }, {
      actions: _withCtx$1(() => [
        _createVNode$1(_component_VBtn, {
          variant: "tonal",
          "prepend-icon": "mdi-bell-check-outline",
          loading: testing.value,
          onClick: _cache[2] || (_cache[2] = $event => (sendTest('success')))
        }, {
          default: _withCtx$1(() => [...(_cache[43] || (_cache[43] = [
            _createTextVNode$1("测试成功通知", -1)
          ]))]),
          _: 1
        }, 8, ["loading"]),
        _createVNode$1(_component_VBtn, {
          color: "primary",
          "prepend-icon": "mdi-content-save",
          loading: saving.value,
          onClick: save
        }, {
          default: _withCtx$1(() => [...(_cache[44] || (_cache[44] = [
            _createTextVNode$1("保存设置", -1)
          ]))]),
          _: 1
        }, 8, ["loading"])
      ]),
      controls: _withCtx$1(() => [
        _createVNode$1(_component_VSwitch, {
          modelValue: config.value.notification_enhancer_enabled,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.value.notification_enhancer_enabled) = $event)),
          color: "success",
          "hide-details": "",
          label: "启用通知接管"
        }, null, 8, ["modelValue"]),
        _createVNode$1(_component_VChip, {
          color: data.value.active ? 'success' : 'default',
          variant: "tonal",
          size: "small"
        }, {
          default: _withCtx$1(() => [
            _createTextVNode$1(_toDisplayString$1(data.value.active ? '正在运行' : '尚未运行'), 1)
          ]),
          _: 1
        }, 8, ["color"]),
        _createVNode$1(_component_VSpacer),
        _createVNode$1(_component_VSwitch, {
          modelValue: config.value.notification_plugin_enabled,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.notification_plugin_enabled) = $event)),
          color: "primary",
          "hide-details": "",
          label: "允许插件发送通知"
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _createElementVNode$1("nav", _hoisted_2$1, [
      (_openBlock$1(), _createElementBlock$1(_Fragment$1, null, _renderList$1(workspaceItems, (item) => {
        return _createElementVNode$1("button", {
          key: item.value,
          type: "button",
          class: _normalizeClass$1({ active: activeWorkspace.value === item.value }),
          onClick: $event => (switchWorkspace(item.value))
        }, [
          _createVNode$1(_component_VIcon, {
            icon: item.icon,
            size: "19"
          }, null, 8, ["icon"]),
          _createElementVNode$1("span", null, _toDisplayString$1(item.title), 1)
        ], 10, _hoisted_3$1)
      }), 64))
    ]),
    _withDirectives$1(_createElementVNode$1("section", _hoisted_4$1, [
      _cache[51] || (_cache[51] = _createElementVNode$1("div", { class: "section-heading" }, [
        _createElementVNode$1("div", null, [
          _createElementVNode$1("h3", null, "接管范围与通知路由"),
          _createElementVNode$1("p", null, "先决定插件如何介入，再分别设置九类 MoviePilot 通知的处理方式和目标实例。")
        ])
      ], -1)),
      _createElementVNode$1("div", _hoisted_5$1, [
        (_openBlock$1(), _createElementBlock$1(_Fragment$1, null, _renderList$1(modeItems, (item) => {
          return _createElementVNode$1("button", {
            key: item.value,
            type: "button",
            class: _normalizeClass$1(["mode-card", { active: config.value.notification_mode === item.value }]),
            onClick: $event => (config.value.notification_mode = item.value)
          }, [
            _createVNode$1(_component_VIcon, {
              icon: item.value === 'observe' ? 'mdi-eye-outline' : item.value === 'parallel' ? 'mdi-call-split' : 'mdi-swap-horizontal-bold'
            }, null, 8, ["icon"]),
            _createElementVNode$1("span", null, [
              _createElementVNode$1("strong", null, _toDisplayString$1(item.title), 1),
              _createElementVNode$1("small", null, _toDisplayString$1(item.subtitle), 1)
            ]),
            (config.value.notification_mode === item.value)
              ? (_openBlock$1(), _createBlock$1(_component_VIcon, {
                  key: 0,
                  icon: "mdi-check-circle",
                  color: "primary"
                }))
              : _createCommentVNode$1("", true)
          ], 10, _hoisted_6$1)
        }), 64))
      ]),
      (config.value.notification_mode === 'takeover')
        ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
            key: 0,
            type: "warning",
            variant: "tonal",
            density: "compact",
            class: "mt-3"
          }, {
            default: _withCtx$1(() => [
              _createTextVNode$1(_toDisplayString$1(data.value.takeover_note), 1)
            ]),
            _: 1
          }))
        : _createCommentVNode$1("", true),
      _createElementVNode$1("div", _hoisted_7$1, [
        _createVNode$1(_component_VSelect, {
          modelValue: config.value.notification_default_service,
          "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config.value.notification_default_service) = $event)),
          items: notificationServiceItems.value,
          label: "默认通知实例",
          placeholder: "各类型未指定实例时使用；留空则广播到插件渠道",
          density: "comfortable",
          variant: "outlined",
          clearable: "",
          "hide-details": ""
        }, null, 8, ["modelValue", "items"]),
        _createElementVNode$1("div", _hoisted_8$1, [
          _createVNode$1(_component_VIcon, {
            icon: "mdi-information-outline",
            color: "primary"
          }),
          _cache[45] || (_cache[45] = _createElementVNode$1("span", null, "“接管发送”才会重发；“仅记录”只进入运行记录；“静默忽略”不会外发。", -1))
        ])
      ]),
      _createElementVNode$1("div", _hoisted_9$1, [
        (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(notificationTypes.value, (item) => {
          return (_openBlock$1(), _createElementBlock$1("article", {
            key: item.key,
            class: "notification-type-card"
          }, [
            _createVNode$1(_component_VAvatar, {
              size: "38",
              color: "primary",
              variant: "tonal"
            }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VIcon, {
                  icon: item.icon,
                  size: "20"
                }, null, 8, ["icon"])
              ]),
              _: 2
            }, 1024),
            _createElementVNode$1("div", _hoisted_10$1, [
              _createElementVNode$1("strong", null, _toDisplayString$1(item.label), 1),
              _createElementVNode$1("small", null, _toDisplayString$1(item.description), 1)
            ]),
            _createVNode$1(_component_VSelect, {
              modelValue: config.value.notification_type_routes[item.key].policy,
              "onUpdate:modelValue": $event => ((config.value.notification_type_routes[item.key].policy) = $event),
              items: routePolicyItems,
              density: "compact",
              variant: "outlined",
              "hide-details": "",
              class: "route-policy-select"
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            (config.value.notification_type_routes[item.key].policy === 'notify')
              ? (_openBlock$1(), _createBlock$1(_component_VSelect, {
                  key: 0,
                  modelValue: config.value.notification_type_routes[item.key].service,
                  "onUpdate:modelValue": $event => ((config.value.notification_type_routes[item.key].service) = $event),
                  items: notificationServiceItems.value,
                  placeholder: "沿用默认实例",
                  density: "compact",
                  variant: "outlined",
                  clearable: "",
                  "hide-details": "",
                  class: "route-service-select"
                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]))
              : (_openBlock$1(), _createElementBlock$1("div", _hoisted_11$1, _toDisplayString$1(config.value.notification_type_routes[item.key].policy === 'record' ? '仅保留审计记录' : '不发送、不打扰'), 1))
          ]))
        }), 128))
      ]),
      _createVNode$1(_component_VExpansionPanels, {
        variant: "accordion",
        class: "notification-template-panels"
      }, {
        default: _withCtx$1(() => [
          _createVNode$1(_component_VExpansionPanel, null, {
            default: _withCtx$1(() => [
              _createVNode$1(_component_VExpansionPanelTitle, null, {
                default: _withCtx$1(() => [
                  _createElementVNode$1("div", _hoisted_12$1, [
                    _createVNode$1(_component_VIcon, {
                      icon: "mdi-code-braces",
                      color: "primary"
                    }),
                    _cache[46] || (_cache[46] = _createElementVNode$1("span", null, [
                      _createElementVNode$1("strong", null, "通知模板与高级设置"),
                      _createElementVNode$1("small", null, "默认原样转发 MP 已渲染内容；整理成功、整理失败和其它通知可分别定制。")
                    ], -1))
                  ])
                ]),
                _: 1
              }),
              _createVNode$1(_component_VExpansionPanelText, null, {
                default: _withCtx$1(() => [
                  _createVNode$1(_component_VAlert, {
                    type: "info",
                    variant: "tonal",
                    density: "compact",
                    class: "mb-3"
                  }, {
                    default: _withCtx$1(() => [...(_cache[47] || (_cache[47] = [
                      _createTextVNode$1(" MoviePilot 的系统通知模板会先完成渲染，", -1),
                      _createElementVNode$1("code", null, "original_title", -1),
                      _createTextVNode$1(" 与 ", -1),
                      _createElementVNode$1("code", null, "original_text", -1),
                      _createTextVNode$1(" 就是其最终结果。可用： ", -1),
                      _createElementVNode$1("code", null, "scene", -1),
                      _createTextVNode$1("、", -1),
                      _createElementVNode$1("code", null, "category_label", -1),
                      _createTextVNode$1("、", -1),
                      _createElementVNode$1("code", null, "reason", -1),
                      _createTextVNode$1("、 ", -1),
                      _createElementVNode$1("code", null, "source_path", -1),
                      _createTextVNode$1("、", -1),
                      _createElementVNode$1("code", null, "target_path", -1),
                      _createTextVNode$1("、", -1),
                      _createElementVNode$1("code", null, "notification_type_label", -1),
                      _createTextVNode$1("、 ", -1),
                      _createElementVNode$1("code", null, "current_time", -1),
                      _createTextVNode$1("。 ", -1)
                    ]))]),
                    _: 1
                  }),
                  _createElementVNode$1("div", _hoisted_13$1, [
                    _createElementVNode$1("div", _hoisted_14$1, [
                      _createElementVNode$1("h4", null, [
                        _createVNode$1(_component_VIcon, { icon: "mdi-check-circle-outline" }),
                        _cache[48] || (_cache[48] = _createTextVNode$1(" 入库成功", -1))
                      ]),
                      _createVNode$1(_component_VTextField, {
                        modelValue: config.value.notification_success_title_template,
                        "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((config.value.notification_success_title_template) = $event)),
                        label: "标题模板",
                        variant: "outlined",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode$1(_component_VTextarea, {
                        modelValue: config.value.notification_success_text_template,
                        "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((config.value.notification_success_text_template) = $event)),
                        label: "正文模板",
                        variant: "outlined",
                        rows: "4",
                        "auto-grow": "",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ]),
                    _createElementVNode$1("div", _hoisted_15$1, [
                      _createElementVNode$1("h4", null, [
                        _createVNode$1(_component_VIcon, { icon: "mdi-alert-circle-outline" }),
                        _cache[49] || (_cache[49] = _createTextVNode$1(" 入库失败", -1))
                      ]),
                      _createVNode$1(_component_VTextField, {
                        modelValue: config.value.notification_failure_title_template,
                        "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((config.value.notification_failure_title_template) = $event)),
                        label: "标题模板",
                        variant: "outlined",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode$1(_component_VTextarea, {
                        modelValue: config.value.notification_failure_text_template,
                        "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((config.value.notification_failure_text_template) = $event)),
                        label: "正文模板",
                        variant: "outlined",
                        rows: "4",
                        "auto-grow": "",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ]),
                    _createElementVNode$1("div", _hoisted_16$1, [
                      _createElementVNode$1("h4", null, [
                        _createVNode$1(_component_VIcon, { icon: "mdi-bell-outline" }),
                        _cache[50] || (_cache[50] = _createTextVNode$1(" 其它通知类型", -1))
                      ]),
                      _createVNode$1(_component_VTextField, {
                        modelValue: config.value.notification_generic_title_template,
                        "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((config.value.notification_generic_title_template) = $event)),
                        label: "标题模板",
                        variant: "outlined",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode$1(_component_VTextarea, {
                        modelValue: config.value.notification_generic_text_template,
                        "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((config.value.notification_generic_text_template) = $event)),
                        label: "正文模板",
                        variant: "outlined",
                        rows: "4",
                        "auto-grow": "",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ])
                  ]),
                  _createElementVNode$1("div", _hoisted_17$1, [
                    _createVNode$1(_component_VSwitch, {
                      modelValue: config.value.notification_success_enabled,
                      "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((config.value.notification_success_enabled) = $event)),
                      color: "success",
                      "hide-details": "",
                      label: "处理整理成功"
                    }, null, 8, ["modelValue"]),
                    _createVNode$1(_component_VSwitch, {
                      modelValue: config.value.notification_failure_enabled,
                      "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((config.value.notification_failure_enabled) = $event)),
                      color: "warning",
                      "hide-details": "",
                      label: "处理整理失败"
                    }, null, 8, ["modelValue"]),
                    _createVNode$1(_component_VSwitch, {
                      modelValue: config.value.notification_passthrough_manual,
                      "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((config.value.notification_passthrough_manual) = $event)),
                      color: "primary",
                      "hide-details": "",
                      label: "保留其它手动处理通知"
                    }, null, 8, ["modelValue"])
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ], 512), [
      [_vShow$1, activeWorkspace.value === 'routes']
    ]),
    _withDirectives$1(_createElementVNode$1("section", _hoisted_18$1, [
      _createElementVNode$1("div", _hoisted_19$1, [
        _cache[53] || (_cache[53] = _createElementVNode$1("div", null, [
          _createElementVNode$1("h3", null, "失败类型策略"),
          _createElementVNode$1("p", null, "失败原因会在通知发送前分类；未分类异常始终通知，避免静默吞错。")
        ], -1)),
        _createVNode$1(_component_VBtn, {
          variant: "text",
          color: "warning",
          "prepend-icon": "mdi-bell-alert-outline",
          loading: testing.value,
          onClick: _cache[15] || (_cache[15] = $event => (sendTest('failure')))
        }, {
          default: _withCtx$1(() => [...(_cache[52] || (_cache[52] = [
            _createTextVNode$1("测试失败通知", -1)
          ]))]),
          _: 1
        }, 8, ["loading"])
      ]),
      _createElementVNode$1("div", _hoisted_20$1, [
        (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(data.value.failure_categories, (item) => {
          return (_openBlock$1(), _createElementBlock$1("div", {
            key: item.key,
            class: "policy-card"
          }, [
            _createVNode$1(_component_VAvatar, {
              size: "38",
              color: "primary",
              variant: "tonal"
            }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VIcon, {
                  icon: item.icon,
                  size: "20"
                }, null, 8, ["icon"])
              ]),
              _: 2
            }, 1024),
            _createElementVNode$1("div", _hoisted_21$1, [
              _createElementVNode$1("strong", null, _toDisplayString$1(item.label), 1),
              _createElementVNode$1("small", null, _toDisplayString$1(item.description), 1)
            ]),
            _createVNode$1(_component_VSelect, {
              modelValue: config.value.notification_failure_policies[item.key],
              "onUpdate:modelValue": $event => ((config.value.notification_failure_policies[item.key]) = $event),
              items: policyItems,
              disabled: item.locked,
              density: "compact",
              variant: "outlined",
              "hide-details": "",
              class: "policy-select"
            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
          ]))
        }), 128))
      ])
    ], 512), [
      [_vShow$1, activeWorkspace.value === 'failures']
    ]),
    _withDirectives$1(_createElementVNode$1("section", _hoisted_22$1, [
      _createElementVNode$1("div", _hoisted_23$1, [
        _cache[54] || (_cache[54] = _createElementVNode$1("div", null, [
          _createElementVNode$1("h3", null, "集数偏移通知与审批"),
          _createElementVNode$1("p", null, "存量按月或季度汇总；基线之后新增的匹配及失败条目逐部通知。")
        ], -1)),
        _createVNode$1(_component_VSwitch, {
          modelValue: config.value.notification_episode_candidates_enabled,
          "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((config.value.notification_episode_candidates_enabled) = $event)),
          color: "success",
          "hide-details": "",
          label: "启用集数候选通知"
        }, null, 8, ["modelValue"])
      ]),
      _createElementVNode$1("div", _hoisted_24$1, [
        _createVNode$1(_component_VSelect, {
          modelValue: config.value.notification_candidate_service,
          "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((config.value.notification_candidate_service) = $event)),
          items: notificationServiceItems.value,
          label: "集数偏移审批通知实例",
          placeholder: "请选择具体通知实例",
          density: "comfortable",
          variant: "outlined",
          clearable: "",
          "hide-details": ""
        }, null, 8, ["modelValue", "items"]),
        _createElementVNode$1("div", _hoisted_25$1, [
          _createVNode$1(_component_VSwitch, {
            modelValue: config.value.notification_candidate_batch_enabled,
            "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((config.value.notification_candidate_batch_enabled) = $event)),
            color: "primary",
            "hide-details": "",
            label: "定时批量"
          }, null, 8, ["modelValue"]),
          _createVNode$1(_component_VSelect, {
            modelValue: config.value.notification_candidate_batch_frequency,
            "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((config.value.notification_candidate_batch_frequency) = $event)),
            items: [
              { title: '每月月初', value: 'monthly' },
              { title: '每季度首月月初', value: 'quarterly' },
            ],
            density: "compact",
            variant: "outlined",
            "hide-details": "",
            disabled: !config.value.notification_candidate_batch_enabled
          }, null, 8, ["modelValue", "disabled"]),
          _createVNode$1(_component_VSelect, {
            modelValue: config.value.notification_candidate_batch_hour,
            "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((config.value.notification_candidate_batch_hour) = $event)),
            items: Array.from({ length: 24 }, (_, value) => ({ title: `${String(value).padStart(2, '0')}:00`, value })),
            density: "compact",
            variant: "outlined",
            "hide-details": "",
            disabled: !config.value.notification_candidate_batch_enabled
          }, null, 8, ["modelValue", "items", "disabled"])
        ]),
        _createElementVNode$1("div", _hoisted_26$1, [
          _createVNode$1(_component_VSwitch, {
            modelValue: config.value.notification_candidate_realtime_enabled,
            "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((config.value.notification_candidate_realtime_enabled) = $event)),
            color: "success",
            "hide-details": "",
            label: "实时监控新增"
          }, null, 8, ["modelValue"]),
          _cache[55] || (_cache[55] = _createElementVNode$1("small", null, "首次开启以当前缓存为基线；之后新增或失败转成功时逐部推送。", -1))
        ])
      ]),
      _createElementVNode$1("div", _hoisted_27$1, [
        _cache[58] || (_cache[58] = _createElementVNode$1("span", null, [
          _createElementVNode$1("strong", null, "候选通知样式"),
          _createElementVNode$1("small", null, "经典消息沿用 MoviePilot 通知格式；Rich Message 使用新版 Telegram 富文本和媒体页面。")
        ], -1)),
        _createVNode$1(_component_VBtnToggle, {
          modelValue: config.value.notification_candidate_message_style,
          "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((config.value.notification_candidate_message_style) = $event)),
          mandatory: "",
          density: "compact",
          color: "primary",
          variant: "outlined",
          divided: ""
        }, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VBtn, {
              value: "classic",
              "prepend-icon": "mdi-message-text-outline"
            }, {
              default: _withCtx$1(() => [...(_cache[56] || (_cache[56] = [
                _createTextVNode$1("经典消息", -1)
              ]))]),
              _: 1
            }),
            _createVNode$1(_component_VBtn, {
              value: "rich",
              "prepend-icon": "mdi-card-text-outline"
            }, {
              default: _withCtx$1(() => [...(_cache[57] || (_cache[57] = [
                _createTextVNode$1("Rich Message", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        (config.value.notification_candidate_message_style === 'rich')
          ? (_openBlock$1(), _createBlock$1(_component_VTextField, {
              key: 0,
              modelValue: config.value.notification_candidate_custom_emoji_id,
              "onUpdate:modelValue": _cache[23] || (_cache[23] = $event => ((config.value.notification_candidate_custom_emoji_id) = $event)),
              label: "会员表情 ID（可选）",
              placeholder: "留空使用普通符号",
              density: "compact",
              variant: "outlined",
              "hide-details": "",
              clearable: "",
              class: "premium-emoji-field"
            }, null, 8, ["modelValue"]))
          : _createCommentVNode$1("", true)
      ]),
      (config.value.notification_candidate_message_style === 'rich')
        ? (_openBlock$1(), _createElementBlock$1("small", _hoisted_28$1, " 用于总览与详情标题装饰；填写 Telegram custom_emoji_id。Bot 无权限或留空时自动使用普通表情。 "))
        : _createCommentVNode$1("", true),
      _createVNode$1(_component_VAlert, {
        type: "info",
        variant: "tonal",
        density: "compact",
        class: "mt-3"
      }, {
        default: _withCtx$1(() => [...(_cache[59] || (_cache[59] = [
          _createTextVNode$1(" 这里按 MoviePilot 的通知配置名称精确投递；即使有多个 Telegram，也只会发送到选中的实例。 请确保该实例已启用“插件”通知类型。 ", -1)
        ]))]),
        _: 1
      }),
      (unavailableNotificationServices.value.length)
        ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
            key: 1,
            type: "warning",
            variant: "tonal",
            density: "compact",
            class: "mt-2"
          }, {
            default: _withCtx$1(() => [
              _createTextVNode$1(_toDisplayString$1(unavailableNotificationServices.value.map(item => item.title).join('、')) + " 尚未启用“插件”通知类型，因此暂不可选择。 ", 1)
            ]),
            _: 1
          }))
        : _createCommentVNode$1("", true),
      _createElementVNode$1("div", _hoisted_29$1, [
        _createVNode$1(_component_VSelect, {
          modelValue: selectedQuarter.value,
          "onUpdate:modelValue": [
            _cache[24] || (_cache[24] = $event => ((selectedQuarter).value = $event)),
            applyCandidateFilters
          ],
          items: quarterItems.value,
          label: "季度",
          density: "comfortable",
          variant: "outlined",
          "hide-details": ""
        }, null, 8, ["modelValue", "items"]),
        _createVNode$1(_component_VSelect, {
          modelValue: config.value.notification_candidate_region,
          "onUpdate:modelValue": [
            _cache[25] || (_cache[25] = $event => ((config.value.notification_candidate_region) = $event)),
            applyCandidateFilters
          ],
          items: [
          { title: '日漫', value: 'japan' }, { title: '国漫', value: 'china' },
          { title: '海外动画', value: 'other' }, { title: '全部地区', value: 'all' },
        ],
          label: "地区",
          density: "comfortable",
          variant: "outlined",
          "hide-details": ""
        }, null, 8, ["modelValue"]),
        _createVNode$1(_component_VSelect, {
          modelValue: config.value.notification_candidate_preference,
          "onUpdate:modelValue": [
            _cache[26] || (_cache[26] = $event => ((config.value.notification_candidate_preference) = $event)),
            persistCandidateFilters
          ],
          items: [
          { title: '优先剧集组', value: 'group_preferred' },
          { title: 'TMDB 默认编集', value: 'default' },
        ],
          label: "通知一键审批目标",
          density: "comfortable",
          variant: "outlined",
          "hide-details": ""
        }, null, 8, ["modelValue"]),
        _createVNode$1(_component_VBtn, {
          variant: "tonal",
          "prepend-icon": "mdi-refresh",
          loading: candidateLoading.value,
          onClick: applyCandidateFilters
        }, {
          default: _withCtx$1(() => [...(_cache[60] || (_cache[60] = [
            _createTextVNode$1("刷新", -1)
          ]))]),
          _: 1
        }, 8, ["loading"]),
        _createVNode$1(_component_VBtn, {
          color: "primary",
          variant: "tonal",
          "prepend-icon": "mdi-send-clock",
          loading: actionLoading.value,
          onClick: sendCandidateBatch
        }, {
          default: _withCtx$1(() => [...(_cache[61] || (_cache[61] = [
            _createTextVNode$1("立即生成批次", -1)
          ]))]),
          _: 1
        }, 8, ["loading"])
      ]),
      _createElementVNode$1("div", _hoisted_30$1, [
        _createVNode$1(_component_VSwitch, {
          modelValue: config.value.notification_candidate_sequel_only,
          "onUpdate:modelValue": [
            _cache[27] || (_cache[27] = $event => ((config.value.notification_candidate_sequel_only) = $event)),
            applyCandidateFilters
          ],
          color: "primary",
          "hide-details": "",
          label: "仅续作或多季作品"
        }, null, 8, ["modelValue"]),
        _createVNode$1(_component_VSelect, {
          modelValue: config.value.notification_candidate_platforms,
          "onUpdate:modelValue": [
            _cache[28] || (_cache[28] = $event => ((config.value.notification_candidate_platforms) = $event)),
            applyCandidateFilters
          ],
          items: ['TV', 'TV SHORT', 'ONA', 'OVA'],
          multiple: "",
          chips: "",
          "closable-chips": "",
          label: "载体",
          density: "compact",
          variant: "outlined",
          "hide-details": "",
          class: "platform-select"
        }, null, 8, ["modelValue"])
      ]),
      (readyCandidates.value.length)
        ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_31$1, [
            _createElementVNode$1("div", _hoisted_32$1, [
              _createVNode$1(_component_VCheckboxBtn, {
                "model-value": allReadySelected.value,
                "onUpdate:modelValue": setAllReady
              }, null, 8, ["model-value"]),
              _createElementVNode$1("span", null, [
                _cache[62] || (_cache[62] = _createElementVNode$1("strong", null, "匹配完成", -1)),
                _createElementVNode$1("small", null, _toDisplayString$1(readyCandidates.value.length) + " 部可直接加入维护规则", 1)
              ]),
              _createVNode$1(_component_VSpacer),
              _createElementVNode$1("div", _hoisted_33$1, [
                _createVNode$1(_component_VBtn, {
                  variant: "text",
                  color: "default",
                  disabled: !selectedReadyIds.value.length,
                  onClick: _cache[29] || (_cache[29] = $event => (candidateAction('ignore')))
                }, {
                  default: _withCtx$1(() => [...(_cache[63] || (_cache[63] = [
                    _createTextVNode$1("忽略所选", -1)
                  ]))]),
                  _: 1
                }, 8, ["disabled"]),
                _createVNode$1(_component_VBtn, {
                  variant: "tonal",
                  color: "primary",
                  loading: actionLoading.value,
                  disabled: !selectedReadyIds.value.length,
                  onClick: _cache[30] || (_cache[30] = $event => (candidateAction('add_default')))
                }, {
                  default: _withCtx$1(() => [...(_cache[64] || (_cache[64] = [
                    _createTextVNode$1("按 TMDB 默认加入", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading", "disabled"]),
                _createVNode$1(_component_VBtn, {
                  color: "primary",
                  loading: actionLoading.value,
                  disabled: !selectedReadyIds.value.length,
                  onClick: _cache[31] || (_cache[31] = $event => (candidateAction('add_group')))
                }, {
                  default: _withCtx$1(() => [...(_cache[65] || (_cache[65] = [
                    _createTextVNode$1("优先剧集组加入", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ]),
            _createElementVNode$1("div", _hoisted_34$1, [
              (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(readyCandidates.value, (item) => {
                return (_openBlock$1(), _createElementBlock$1("label", {
                  key: item.id,
                  class: "candidate-item"
                }, [
                  _createVNode$1(_component_VCheckboxBtn, {
                    modelValue: selectedReadyIds.value,
                    "onUpdate:modelValue": _cache[32] || (_cache[32] = $event => ((selectedReadyIds).value = $event)),
                    value: item.id
                  }, null, 8, ["modelValue", "value"]),
                  (item.poster)
                    ? (_openBlock$1(), _createBlock$1(_component_VImg, {
                        key: 0,
                        src: item.poster,
                        width: "48",
                        height: "68",
                        cover: "",
                        class: "candidate-poster"
                      }, null, 8, ["src"]))
                    : (_openBlock$1(), _createElementBlock$1("div", _hoisted_35$1, [
                        _createVNode$1(_component_VIcon, {
                          icon: "mdi-image-off-outline",
                          size: "20"
                        })
                      ])),
                  _createElementVNode$1("div", _hoisted_36$1, [
                    _createElementVNode$1("strong", null, _toDisplayString$1(item.title), 1),
                    _createElementVNode$1("span", null, [
                      _createTextVNode$1("TMDB " + _toDisplayString$1(item.tmdb_id) + " · " + _toDisplayString$1(item.platform), 1),
                      (item.has_prequel)
                        ? (_openBlock$1(), _createElementBlock$1(_Fragment$1, { key: 0 }, [
                            _createTextVNode$1(" · 续作")
                          ], 64))
                        : _createCommentVNode$1("", true)
                    ])
                  ]),
                  (item.score != null)
                    ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                        key: 2,
                        size: "x-small",
                        color: "success",
                        variant: "tonal"
                      }, {
                        default: _withCtx$1(() => [
                          _createTextVNode$1(_toDisplayString$1(item.score), 1)
                        ]),
                        _: 2
                      }, 1024))
                    : _createCommentVNode$1("", true)
                ]))
              }), 128))
            ])
          ]))
        : _createCommentVNode$1("", true),
      (failedCandidates.value.length)
        ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_37$1, [
            _createElementVNode$1("div", _hoisted_38$1, [
              _createVNode$1(_component_VCheckboxBtn, {
                "model-value": allFailedSelected.value,
                "onUpdate:modelValue": setAllFailed
              }, null, 8, ["model-value"]),
              _createElementVNode$1("span", null, [
                _cache[66] || (_cache[66] = _createElementVNode$1("strong", null, "扫描失败", -1)),
                _createElementVNode$1("small", null, _toDisplayString$1(failedCandidates.value.length) + " 部可批量重试、忽略或逐部补录", 1)
              ]),
              _createVNode$1(_component_VSpacer),
              _createElementVNode$1("div", _hoisted_39$1, [
                _createVNode$1(_component_VBtn, {
                  variant: "text",
                  color: "default",
                  disabled: !selectedFailedIds.value.length,
                  onClick: _cache[33] || (_cache[33] = $event => (candidateAction('ignore', 'failed')))
                }, {
                  default: _withCtx$1(() => [...(_cache[67] || (_cache[67] = [
                    _createTextVNode$1("忽略所选", -1)
                  ]))]),
                  _: 1
                }, 8, ["disabled"]),
                _createVNode$1(_component_VBtn, {
                  color: "warning",
                  variant: "tonal",
                  "prepend-icon": "mdi-refresh",
                  loading: actionLoading.value,
                  disabled: !selectedFailedIds.value.length,
                  onClick: _cache[34] || (_cache[34] = $event => (candidateAction('retry', 'failed')))
                }, {
                  default: _withCtx$1(() => [...(_cache[68] || (_cache[68] = [
                    _createTextVNode$1("重新扫描", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ]),
            _createElementVNode$1("div", _hoisted_40$1, [
              (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(failedCandidates.value, (item) => {
                return (_openBlock$1(), _createElementBlock$1("div", {
                  key: item.id,
                  class: "candidate-item failed-candidate-item"
                }, [
                  _createVNode$1(_component_VCheckboxBtn, {
                    modelValue: selectedFailedIds.value,
                    "onUpdate:modelValue": _cache[35] || (_cache[35] = $event => ((selectedFailedIds).value = $event)),
                    value: item.id
                  }, null, 8, ["modelValue", "value"]),
                  (item.poster)
                    ? (_openBlock$1(), _createBlock$1(_component_VImg, {
                        key: 0,
                        src: item.poster,
                        width: "48",
                        height: "68",
                        cover: "",
                        class: "candidate-poster"
                      }, null, 8, ["src"]))
                    : (_openBlock$1(), _createElementBlock$1("div", _hoisted_41$1, [
                        _createVNode$1(_component_VIcon, {
                          icon: "mdi-image-off-outline",
                          size: "20"
                        })
                      ])),
                  _createElementVNode$1("div", _hoisted_42$1, [
                    _createElementVNode$1("strong", null, _toDisplayString$1(item.title), 1),
                    _createElementVNode$1("span", null, _toDisplayString$1(item.scan_error || '未匹配到可信 TMDB 条目'), 1)
                  ]),
                  _createVNode$1(_component_VBtn, {
                    color: "primary",
                    variant: "tonal",
                    "prepend-icon": "mdi-database-edit-outline",
                    loading: manualCandidateBusy.value === item.id,
                    onClick: $event => (openFailedCandidate(item))
                  }, {
                    default: _withCtx$1(() => [...(_cache[69] || (_cache[69] = [
                      _createTextVNode$1("补录 TMDB", -1)
                    ]))]),
                    _: 1
                  }, 8, ["loading", "onClick"])
                ]))
              }), 128))
            ])
          ]))
        : _createCommentVNode$1("", true),
      (!readyCandidates.value.length && !failedCandidates.value.length)
        ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_43$1, [
            _createVNode$1(_component_VIcon, { icon: "mdi-check-decagram-outline" }),
            _createElementVNode$1("span", null, _toDisplayString$1(candidateLoading.value ? '正在读取季度缓存…' : '当前筛选没有待处理条目；请先在“集数偏移”中加载并扫描该季度看板。'), 1)
          ]))
        : _createCommentVNode$1("", true)
    ], 512), [
      [_vShow$1, activeWorkspace.value === 'candidates']
    ]),
    _createVNode$1(_component_VDialog, {
      modelValue: manualCandidateDialog.value,
      "onUpdate:modelValue": _cache[40] || (_cache[40] = $event => ((manualCandidateDialog).value = $event)),
      "max-width": "560"
    }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCard, { class: "manual-candidate-dialog" }, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardItem, null, {
              prepend: _withCtx$1(() => [
                _createVNode$1(_component_VAvatar, {
                  color: "primary",
                  variant: "tonal"
                }, {
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VIcon, { icon: "mdi-database-edit-outline" })
                  ]),
                  _: 1
                })
              ]),
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardTitle, null, {
                  default: _withCtx$1(() => [...(_cache[70] || (_cache[70] = [
                    _createTextVNode$1("补录 TMDB", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VCardSubtitle, null, {
                  default: _withCtx$1(() => [
                    _createTextVNode$1(_toDisplayString$1(manualCandidateItem.value?.title), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$1(_component_VDivider),
            _createVNode$1(_component_VCardText, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VTextField, {
                  modelValue: manualCandidateTmdbId.value,
                  "onUpdate:modelValue": _cache[36] || (_cache[36] = $event => ((manualCandidateTmdbId).value = $event)),
                  label: "TMDBID",
                  type: "number",
                  autofocus: "",
                  variant: "outlined",
                  "prepend-inner-icon": "mdi-movie-search-outline",
                  hint: "填写电视剧 TMDBID，再选择最终采用的编集方式。",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            _createVNode$1(_component_VCardActions, { class: "manual-candidate-actions" }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[37] || (_cache[37] = $event => (manualCandidateDialog.value = false))
                }, {
                  default: _withCtx$1(() => [...(_cache[71] || (_cache[71] = [
                    _createTextVNode$1("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VSpacer),
                _createVNode$1(_component_VBtn, {
                  color: "primary",
                  variant: "tonal",
                  "prepend-icon": "mdi-database-outline",
                  disabled: !Number(manualCandidateTmdbId.value || 0),
                  loading: manualCandidateBusy.value === manualCandidateItem.value?.id,
                  onClick: _cache[38] || (_cache[38] = $event => (addFailedCandidate('add_default')))
                }, {
                  default: _withCtx$1(() => [...(_cache[72] || (_cache[72] = [
                    _createTextVNode$1("按 TMDB 默认编集加入", -1)
                  ]))]),
                  _: 1
                }, 8, ["disabled", "loading"]),
                _createVNode$1(_component_VBtn, {
                  color: "primary",
                  "prepend-icon": "mdi-animation-outline",
                  disabled: !Number(manualCandidateTmdbId.value || 0),
                  loading: manualCandidateBusy.value === manualCandidateItem.value?.id,
                  onClick: _cache[39] || (_cache[39] = $event => (addFailedCandidate('add_group')))
                }, {
                  default: _withCtx$1(() => [...(_cache[73] || (_cache[73] = [
                    _createTextVNode$1("优先剧集组加入", -1)
                  ]))]),
                  _: 1
                }, 8, ["disabled", "loading"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _withDirectives$1(_createElementVNode$1("section", _hoisted_44$1, [
      _createElementVNode$1("button", {
        type: "button",
        class: "records-heading",
        onClick: _cache[41] || (_cache[41] = $event => (showRecords.value = !showRecords.value))
      }, [
        _createElementVNode$1("span", null, [
          _cache[74] || (_cache[74] = _createElementVNode$1("strong", null, "通知运行记录", -1)),
          _createElementVNode$1("small", null, " 共 " + _toDisplayString$1(data.value.record_counts?.total || 0) + " 条 · 渠道确认 " + _toDisplayString$1(data.value.record_counts?.delivered || 0) + " · 已提交 " + _toDisplayString$1(data.value.record_counts?.submitted || 0) + " · 静默 " + _toDisplayString$1(data.value.record_counts?.suppressed || 0) + " · 待摘要 " + _toDisplayString$1(data.value.record_counts?.digest || 0), 1)
        ]),
        _createVNode$1(_component_VIcon, {
          icon: showRecords.value ? 'mdi-chevron-up' : 'mdi-chevron-down'
        }, null, 8, ["icon"])
      ]),
      _createVNode$1(_component_VExpandTransition, null, {
        default: _withCtx$1(() => [
          (showRecords.value)
            ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_45$1, [
                _createElementVNode$1("div", _hoisted_46$1, [
                  _createVNode$1(_component_VBtnToggle, {
                    modelValue: recordFilter.value,
                    "onUpdate:modelValue": _cache[42] || (_cache[42] = $event => ((recordFilter).value = $event)),
                    mandatory: "",
                    density: "compact",
                    color: "primary",
                    variant: "outlined"
                  }, {
                    default: _withCtx$1(() => [
                      _createVNode$1(_component_VBtn, { value: "all" }, {
                        default: _withCtx$1(() => [...(_cache[75] || (_cache[75] = [
                          _createTextVNode$1("全部", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode$1(_component_VBtn, { value: "success" }, {
                        default: _withCtx$1(() => [...(_cache[76] || (_cache[76] = [
                          _createTextVNode$1("入库成功", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode$1(_component_VBtn, { value: "failure" }, {
                        default: _withCtx$1(() => [...(_cache[77] || (_cache[77] = [
                          _createTextVNode$1("入库失败", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode$1(_component_VBtn, { value: "other" }, {
                        default: _withCtx$1(() => [...(_cache[78] || (_cache[78] = [
                          _createTextVNode$1("其它通知", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  _createVNode$1(_component_VSpacer),
                  _createVNode$1(_component_VBtn, {
                    variant: "text",
                    color: "error",
                    "prepend-icon": "mdi-delete-outline",
                    onClick: clearRecords
                  }, {
                    default: _withCtx$1(() => [...(_cache[79] || (_cache[79] = [
                      _createTextVNode$1("清空", -1)
                    ]))]),
                    _: 1
                  }),
                  (data.value.record_counts?.digest)
                    ? (_openBlock$1(), _createBlock$1(_component_VBtn, {
                        key: 0,
                        variant: "tonal",
                        color: "warning",
                        "prepend-icon": "mdi-text-box-check-outline",
                        onClick: sendDigest
                      }, {
                        default: _withCtx$1(() => [...(_cache[80] || (_cache[80] = [
                          _createTextVNode$1("发送待处理摘要", -1)
                        ]))]),
                        _: 1
                      }))
                    : _createCommentVNode$1("", true)
                ]),
                (records.value.length)
                  ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_47$1, [
                      (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(records.value, (item) => {
                        return (_openBlock$1(), _createElementBlock$1("article", {
                          key: item.id,
                          class: "record-item"
                        }, [
                          _createVNode$1(_component_VIcon, {
                            icon: item.action === 'delivery_failed' ? 'mdi-send-alert-outline' : item.scene === 'success' ? 'mdi-check-circle-outline' : item.action === 'suppressed' ? 'mdi-bell-off-outline' : 'mdi-alert-circle-outline',
                            color: item.action === 'delivery_failed' ? 'error' : item.scene === 'success' ? 'success' : item.action === 'suppressed' ? 'default' : 'warning'
                          }, null, 8, ["icon", "color"]),
                          _createElementVNode$1("div", null, [
                            _createElementVNode$1("strong", null, _toDisplayString$1(item.title), 1),
                            _createElementVNode$1("span", null, _toDisplayString$1(item.created_at) + " · " + _toDisplayString$1(item.category?.label || item.details?.notification_type_label || '入库成功') + " · " + _toDisplayString$1(recordActionText[item.action] || item.action), 1),
                            (item.action === 'delivery_failed')
                              ? (_openBlock$1(), _createElementBlock$1("small", _hoisted_48$1, _toDisplayString$1(item.details?.delivery_error || '目标通知实例未返回成功结果'), 1))
                              : _createCommentVNode$1("", true)
                          ]),
                          _createVNode$1(_component_VChip, {
                            size: "x-small",
                            variant: "tonal"
                          }, {
                            default: _withCtx$1(() => [
                              _createTextVNode$1(_toDisplayString$1(item.policy), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]))
                      }), 128))
                    ]))
                  : (_openBlock$1(), _createElementBlock$1("div", _hoisted_49$1, [
                      _createVNode$1(_component_VIcon, { icon: "mdi-history" }),
                      _cache[81] || (_cache[81] = _createElementVNode$1("span", null, "尚无符合条件的记录", -1))
                    ]))
              ]))
            : _createCommentVNode$1("", true)
        ]),
        _: 1
      })
    ], 512), [
      [_vShow$1, activeWorkspace.value === 'records']
    ])
  ]))
}
}

};
const NotificationEnhancer = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-080c9a37"]]);

const {createElementVNode:_createElementVNode,resolveComponent:_resolveComponent,createVNode:_createVNode,withCtx:_withCtx,toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,createBlock:_createBlock,createSlots:_createSlots,unref:_unref,renderList:_renderList,Fragment:_Fragment,mergeProps:_mergeProps,normalizeClass:_normalizeClass,normalizeStyle:_normalizeStyle,KeepAlive:_KeepAlive,vShow:_vShow,withDirectives:_withDirectives} = await importShared('vue');


const _hoisted_1 = { class: "enhancer-page" };
const _hoisted_2 = {
  key: 0,
  class: "hero-shell"
};
const _hoisted_3 = { class: "hero-content" };
const _hoisted_4 = { class: "page-body" };
const _hoisted_5 = { class: "text-caption text-medium-emphasis" };
const _hoisted_6 = { class: "text-h6 font-weight-bold" };
const _hoisted_7 = { class: "workspace-panels" };
const _hoisted_8 = {
  key: 0,
  class: "workspace-panel"
};
const _hoisted_9 = { class: "tab-content" };
const _hoisted_10 = { class: "module-grid" };
const _hoisted_11 = { class: "status-line" };
const _hoisted_12 = { class: "status-line" };
const _hoisted_13 = { class: "status-line" };
const _hoisted_14 = { class: "status-line" };
const _hoisted_15 = { class: "status-line" };
const _hoisted_16 = { class: "status-line" };
const _hoisted_17 = { class: "status-line" };
const _hoisted_18 = { class: "status-line" };
const _hoisted_19 = { class: "status-line" };
const _hoisted_20 = { class: "status-line" };
const _hoisted_21 = { class: "status-line" };
const _hoisted_22 = { class: "status-line" };
const _hoisted_23 = { class: "status-line" };
const _hoisted_24 = { class: "status-line" };
const _hoisted_25 = { class: "status-line" };
const _hoisted_26 = {
  key: 1,
  class: "workspace-panel"
};
const _hoisted_27 = { class: "tab-content" };
const _hoisted_28 = { class: "sticky-actions" };
const _hoisted_29 = { class: "text-caption text-medium-emphasis mr-auto" };
const _hoisted_30 = {
  key: 2,
  class: "workspace-panel"
};
const _hoisted_31 = { class: "tab-content" };
const _hoisted_32 = {
  key: 3,
  class: "workspace-panel"
};
const _hoisted_33 = { class: "tab-content" };
const _hoisted_34 = {
  key: 4,
  class: "workspace-panel"
};
const _hoisted_35 = { class: "tab-content" };
const _hoisted_36 = {
  key: 5,
  class: "workspace-panel"
};
const _hoisted_37 = { class: "tab-content" };
const _hoisted_38 = { class: "d-flex align-center ga-2" };
const _hoisted_39 = { class: "final-name-output" };
const _hoisted_40 = { class: "best-result-visual" };
const _hoisted_41 = {
  key: 1,
  class: "best-result-poster-placeholder"
};
const _hoisted_42 = { class: "best-result-copy" };
const _hoisted_43 = { class: "best-result-heading" };
const _hoisted_44 = { class: "text-h6" };
const _hoisted_45 = {
  key: 0,
  class: "best-result-original"
};
const _hoisted_46 = { class: "best-result-meta" };
const _hoisted_47 = {
  key: 0,
  class: "best-result-genres"
};
const _hoisted_48 = {
  key: 1,
  class: "best-result-overview"
};
const _hoisted_49 = { key: 0 };
const _hoisted_50 = {
  key: 0,
  class: "pipeline-timeline"
};
const _hoisted_51 = { class: "pipeline-stage-rail" };
const _hoisted_52 = { class: "pipeline-stage-marker" };
const _hoisted_53 = { class: "pipeline-stage-card" };
const _hoisted_54 = { class: "pipeline-stage-header" };
const _hoisted_55 = { class: "pipeline-stage-index" };
const _hoisted_56 = {
  key: 0,
  class: "pipeline-active-list"
};
const _hoisted_57 = ["title"];
const _hoisted_58 = {
  key: 1,
  class: "pipeline-skipped"
};
const _hoisted_59 = {
  key: 2,
  class: "pipeline-stage-detail"
};
const _hoisted_60 = {
  key: 3,
  class: "pipeline-custom-fields"
};
const _hoisted_61 = {
  key: 1,
  class: "pipeline-empty"
};
const _hoisted_62 = { key: 0 };
const _hoisted_63 = { key: 0 };
const _hoisted_64 = { key: 0 };
const _hoisted_65 = { key: 1 };
const _hoisted_66 = { key: 0 };
const _hoisted_67 = { key: 0 };
const _hoisted_68 = { class: "d-flex flex-wrap ga-2 mb-4" };
const _hoisted_69 = { class: "d-flex flex-wrap ga-2 mb-4" };
const _hoisted_70 = { class: "text-caption text-medium-emphasis" };
const _hoisted_71 = { class: "text-caption" };
const _hoisted_72 = { class: "text-medium-emphasis" };
const _hoisted_73 = { key: 0 };
const _hoisted_74 = {
  key: 0,
  class: "text-medium-emphasis"
};
const _hoisted_75 = {
  key: 1,
  class: "context-evidence"
};
const _hoisted_76 = {
  key: 2,
  class: "context-evidence"
};
const _hoisted_77 = {
  key: 3,
  class: "context-evidence"
};
const _hoisted_78 = {
  key: 4,
  class: "text-medium-emphasis"
};
const _hoisted_79 = {
  key: 1,
  class: "empty-preview"
};
const _hoisted_80 = {
  key: 6,
  class: "workspace-panel"
};
const _hoisted_81 = { class: "tab-content" };
const _hoisted_82 = {
  key: 0,
  class: "history-list",
  role: "list"
};
const _hoisted_83 = {
  class: "history-card",
  role: "listitem"
};
const _hoisted_84 = { class: "history-card-content" };
const _hoisted_85 = { class: "d-flex align-start ga-3" };
const _hoisted_86 = { class: "flex-grow-1" };
const _hoisted_87 = { class: "d-flex flex-wrap align-center ga-2" };
const _hoisted_88 = { class: "font-weight-bold" };
const _hoisted_89 = ["title"];
const _hoisted_90 = { class: "text-caption text-medium-emphasis mt-1" };
const _hoisted_91 = {
  key: 1,
  class: "text-caption text-info mt-1"
};
const _hoisted_92 = {
  key: 2,
  class: "text-caption mt-1"
};
const _hoisted_93 = { key: 0 };
const _hoisted_94 = { class: "d-flex flex-wrap ga-1 mt-2" };
const _hoisted_95 = {
  key: 1,
  class: "empty-preview"
};
const _hoisted_96 = { class: "text-h6 mt-3" };
const _hoisted_97 = {
  key: 7,
  class: "workspace-panel"
};
const _hoisted_98 = { class: "tab-content" };
const _hoisted_99 = {
  key: 8,
  class: "workspace-panel"
};
const _hoisted_100 = { class: "tab-content" };
const _hoisted_101 = { class: "workspace-panel" };
const _hoisted_102 = { class: "tab-content" };

const {computed,onMounted,ref} = await importShared('vue');


const _sfc_main = {
  __name: 'AppPage',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'TmdbRecognizeEnhancer' },
  hideTitle: { type: Boolean, default: false },
},
  setup(__props, { expose: __expose }) {

const props = __props;

const loading = ref(false);
const statusLoaded = ref(false);
const uiVersionMismatch = ref(false);
const saving = ref(false);
const previewing = ref(false);
const error = ref('');
const tab = ref('status');
const historyFilter = ref('all');
const status = ref({ config: cloneConfig(), summary: {}, history: [] });
const previewInput = ref({
  title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
  year: '', media_type: '', season: '', episode: '',
});
const preview = ref(null);

const pluginBase = computed(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`);
const config = computed({
  get: () => status.value.config || cloneConfig(),
  set: value => { status.value.config = value; },
});
const summary = computed(() => status.value.summary || {});
const history = computed(() => status.value.history || []);
const historyFilterItems = [
  { title: '全部模块', value: 'all' },
  { title: '识别与偏移', value: 'recognition' },
  { title: '字段与命名', value: 'operation' },
  { title: '仅异常/未接管', value: 'warning' },
];
const filteredHistory = computed(() => history.value.filter(item => {
  if (historyFilter.value === 'all') return true
  if (historyFilter.value === 'warning') return !item.accepted
  return (item.kind || 'recognition') === historyFilter.value
}));
const normalizerStatus = computed(() => status.value.episode_normalizer || {});
const modules = computed(() => status.value.modules || {});
const crossIdStatus = computed(() => status.value.anime_cross_id_database || {});
const pipelineStageDefinitions = [
  {
    key: 'prepare', title: '解析与上下文', icon: 'mdi-text-search-variant',
    modules: ['MoviePilot 标题解析（识别前）', '识别字段覆盖', '制作组类型辅助'],
  },
  {
    key: 'recognize', title: '媒体识别', icon: 'mdi-database-search-outline',
    modules: ['TMDB 搜索增强'],
  },
  {
    key: 'episode', title: '季集处理', icon: 'mdi-counter',
    modules: ['集数偏移'],
  },
  {
    key: 'naming', title: '命名输出', icon: 'mdi-file-edit-outline',
    modules: ['制作组命名编排', '自定义命名字段', 'MoviePilot 模板与最终命名'],
  },
  {
    key: 'library', title: '入库后联动', icon: 'mdi-server-network',
    modules: ['Emby 剧集组联动（入库后）'],
  },
];
const previewPipelineGroups = computed(() => {
  const steps = preview.value?.pipeline || [];
  return pipelineStageDefinitions.map((definition, index) => {
    const stageSteps = definition.modules
      .map(module => steps.find(step => step.module === module))
      .filter(Boolean);
    const active = stageSteps.filter(step => step.status !== 'skipped');
    const skipped = stageSteps.filter(step => step.status === 'skipped');
    const rejected = stageSteps.some(step => step.status === 'rejected');
    const applied = stageSteps.some(step => ['applied', 'accepted', 'completed'].includes(step.status));
    return {
      ...definition,
      index: index + 1,
      active,
      skipped,
      status: rejected ? 'rejected' : applied ? 'completed' : 'skipped',
    }
  }).filter(stage => stage.active.length || stage.skipped.length)
});

function pipelineStagePresentation(status) {
  return ({
    completed: { label: '已处理', color: 'success', icon: 'mdi-check' },
    rejected: { label: '未通过', color: 'warning', icon: 'mdi-shield-alert-outline' },
    skipped: { label: '未触发', color: 'default', icon: 'mdi-minus' },
  })[status] || { label: '未知', color: 'default', icon: 'mdi-help' }
}

function pipelineStepSummary(step) {
  if (step?.module === 'MoviePilot 模板与最终命名' && step.status === 'completed') {
    return '最终相对路径已生成，完整结果见上方“最终命名”'
  }
  return step?.summary || '没有补充信息'
}

function historyStatus(item) {
  if (item.accepted) return { color: 'success', marker: 'success', label: item.kind === 'operation' ? '完成' : (item.best?.score ?? '通过') }
  if (item.kind === 'operation') return { color: 'error', marker: 'warning', label: '异常' }
  return { color: 'info', marker: 'info', label: '未接管' }
}

async function loadStatus() {
  loading.value = true;
  error.value = '';
  try {
    const response = await props.api.get(`${pluginBase.value}/status`);
    const nextStatus = unwrapResponse(response) || status.value;
    uiVersionMismatch.value = ensureUiVersion(nextStatus.backend_version);
    status.value = nextStatus;
    statusLoaded.value = true;
    maybeAutoReloadBackend();
  } catch (err) {
    error.value = err?.message || '状态加载失败';
  } finally {
    loading.value = false;
  }
}

const reloadingBackend = ref(false);
const autoReloadTried = ref(false);

async function reloadBackend(silent = false) {
  reloadingBackend.value = true;
  if (!silent) error.value = '';
  try {
    // MP 核心接口：热重载插件后端（清 Python 模块缓存并重新实例化），等效于插件页的“重载”
    await props.api.get(`plugin/reload/${props.pluginId || 'TmdbRecognizeEnhancer'}`);
    await loadStatus();
    return true
  } catch (err) {
    if (!silent) error.value = err?.message || '插件后端重载失败，请在 MP 插件页手动重载或重启容器';
    return false
  } finally {
    reloadingBackend.value = false;
  }
}

function maybeAutoReloadBackend() {
  // 后端未上报版本号 = 旧实例仍在内存中（插件文件已更新但未重载）。
  // 自动重载一次即可自愈；sessionStorage 守卫防止接口异常时反复触发。
  if (status.value.backend_version || autoReloadTried.value || reloadingBackend.value) return
  const guardKey = `tmdb-enhancer-backend-reload:${UI_VERSION}`;
  if (typeof window !== 'undefined' && window.sessionStorage?.getItem(guardKey) === 'done') {
    autoReloadTried.value = true;
    return
  }
  window.sessionStorage?.setItem(guardKey, 'done');
  autoReloadTried.value = true;
  reloadBackend(true);
}

async function saveConfig() {
  saving.value = true;
  error.value = '';
  try {
    const response = await props.api.post(`${pluginBase.value}/config`, cloneConfig(config.value));
    status.value = unwrapResponse(response) || status.value;
  } catch (err) {
    error.value = err?.message || '配置保存失败';
  } finally {
    saving.value = false;
  }
}

function mergeEmbySyncConfig(sync = {}) {
  const saved = sync?.config || {};
  const patch = {
    emby_episode_group_sync_enabled: Boolean(saved.enabled),
    emby_episode_group_sync_servers: Array.isArray(saved.servers) ? saved.servers : [],
    emby_episode_group_sync_initial_delay_seconds: Number(saved.initial_delay_seconds ?? 15),
    emby_episode_group_sync_retry_seconds: Number(saved.retry_seconds ?? 30),
    emby_episode_group_sync_max_wait_minutes: Number(saved.max_wait_minutes ?? 15),
    emby_episode_group_sync_path_mappings: Array.isArray(saved.path_mappings) ? saved.path_mappings : [],
    emby_episode_group_sync_conflict_policy: saved.conflict_policy || 'skip',
    emby_episode_group_sync_refresh_metadata: saved.refresh_metadata !== false,
  };
  let moduleStatus = '等待插件总开关与集数偏移模块';
  if (!saved.enabled) moduleStatus = '已停用';
  else if (!sync.available) moduleStatus = '当前 MP 不支持媒体服务器服务目录';
  else if (sync.active) moduleStatus = sync.worker_running ? '监听整理入库' : '工作器未运行';
  status.value = {
    ...status.value,
    config: { ...(status.value.config || {}), ...patch },
    modules: {
      ...(status.value.modules || {}),
      emby_episode_group_sync: {
        ...(status.value.modules?.emby_episode_group_sync || {}),
        enabled: Boolean(saved.enabled),
        status: moduleStatus,
        ...(sync.counts || {}),
      },
    },
    episode_normalizer: {
      ...(status.value.episode_normalizer || {}),
      emby_sync: sync,
    },
  };
}

function mergeNotificationConfig(saved = {}) {
  status.value = {
    ...status.value,
    config: { ...(status.value.config || {}), ...(saved || {}) },
    modules: {
      ...(status.value.modules || {}),
      notification_enhancer: {
        ...(status.value.modules?.notification_enhancer || {}),
        enabled: Boolean(saved.notification_enhancer_enabled),
        mode: saved.notification_mode || 'observe',
        status: !saved.notification_enhancer_enabled
          ? '已停用'
          : saved.notification_mode === 'observe'
            ? '仅记录'
            : saved.notification_mode === 'parallel' ? '并行增强' : '接管发送',
      },
    },
  };
}

async function runPreview() {
  previewing.value = true;
  error.value = '';
  preview.value = null;
  try {
    const response = await props.api.post(`${pluginBase.value}/preview`, {
      ...previewInput.value,
      recognition_mode: config.value.recognition_mode,
    });
    preview.value = unwrapResponse(response);
  } catch (err) {
    error.value = err?.message || '试跑失败';
  } finally {
    previewing.value = false;
  }
}

async function clearHistory() {
  loading.value = true;
  try {
    const response = await props.api.post(`${pluginBase.value}/history/clear`, {});
    status.value = unwrapResponse(response) || status.value;
  } finally {
    loading.value = false;
  }
}

async function clearRecognitionMemory() {
  loading.value = true;
  error.value = '';
  try {
    const response = await props.api.post(`${pluginBase.value}/recognition-memory/clear`, {});
    status.value = unwrapResponse(response) || status.value;
  } catch (err) {
    error.value = err?.message || '近期识别记忆清理失败';
  } finally {
    loading.value = false;
  }
}

async function refreshCrossId() {
  error.value = '';
  try {
    const response = await props.api.post(`${pluginBase.value}/anime-cross-id/refresh`, {});
    status.value = {
      ...status.value,
      anime_cross_id_database: unwrapResponse(response) || crossIdStatus.value,
    };
    window.setTimeout(loadStatus, 1200);
  } catch (err) {
    error.value = err?.message || '跨站 ID 数据库更新失败';
  }
}

function typeConstraintSourceText(source) {
  return ({
    manual: '手动指定',
    moviepilot: 'MoviePilot 解析',
    season_episode: '根据季集信息自动判断',
    provided: '识别链提供',
  })[source] || '标题信息'
}

__expose({ loadStatus, saveConfig, reloadBackend, loading, saving, reloadingBackend });
onMounted(loadStatus);

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VAvatar = _resolveComponent("VAvatar");
  const _component_VSpacer = _resolveComponent("VSpacer");
  const _component_VChip = _resolveComponent("VChip");
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VCol = _resolveComponent("VCol");
  const _component_VRow = _resolveComponent("VRow");
  const _component_VTab = _resolveComponent("VTab");
  const _component_VTabs = _resolveComponent("VTabs");
  const _component_VDivider = _resolveComponent("VDivider");
  const _component_VTooltip = _resolveComponent("VTooltip");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent("VCardSubtitle");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VTextarea = _resolveComponent("VTextarea");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VSelect = _resolveComponent("VSelect");
  const _component_VImg = _resolveComponent("VImg");
  const _component_VProgressCircular = _resolveComponent("VProgressCircular");
  const _component_VExpansionPanelTitle = _resolveComponent("VExpansionPanelTitle");
  const _component_VExpansionPanelText = _resolveComponent("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent("VExpansionPanel");
  const _component_VTable = _resolveComponent("VTable");
  const _component_VExpansionPanels = _resolveComponent("VExpansionPanels");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    (!__props.hideTitle)
      ? (_openBlock(), _createElementBlock("div", _hoisted_2, [
          _cache[25] || (_cache[25] = _createElementVNode("div", { class: "hero-glow hero-glow-a" }, null, -1)),
          _cache[26] || (_cache[26] = _createElementVNode("div", { class: "hero-glow hero-glow-b" }, null, -1)),
          _createElementVNode("div", _hoisted_3, [
            _createVNode(_component_VAvatar, {
              size: "54",
              color: "white",
              variant: "tonal"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VIcon, {
                  icon: "mdi-database-search-outline",
                  size: "30"
                })
              ]),
              _: 1
            }),
            _cache[24] || (_cache[24] = _createElementVNode("div", null, [
              _createElementVNode("div", { class: "text-h5 font-weight-bold hero-title" }, "媒体整理增强"),
              _createElementVNode("div", { class: "text-body-2 hero-subtitle" }, "统一增强媒体识别、集数、命名与整理诊断")
            ], -1)),
            _createVNode(_component_VSpacer),
            _createVNode(_component_VChip, {
              color: config.value.enabled ? 'success' : 'default',
              variant: "flat",
              "prepend-icon": "mdi-circle-medium"
            }, {
              default: _withCtx(() => [
                _createTextVNode(_toDisplayString(config.value.enabled ? '插件总开关已开启' : '插件总开关已关闭'), 1)
              ]),
              _: 1
            }, 8, ["color"])
          ])
        ]))
      : _createCommentVNode("", true),
    _createElementVNode("div", _hoisted_4, [
      (error.value)
        ? (_openBlock(), _createBlock(_component_VAlert, {
            key: 0,
            type: "error",
            variant: "tonal",
            closable: "",
            class: "mb-4",
            "onClick:close": _cache[0] || (_cache[0] = $event => (error.value = ''))
          }, {
            default: _withCtx(() => [
              _createTextVNode(_toDisplayString(error.value), 1)
            ]),
            _: 1
          }))
        : _createCommentVNode("", true),
      (statusLoaded.value && !status.value.backend_version)
        ? (_openBlock(), _createBlock(_component_VAlert, {
            key: 1,
            type: "warning",
            variant: "tonal",
            density: "compact",
            class: "mb-4"
          }, _createSlots({
            default: _withCtx(() => [
              _createTextVNode(" 管理页已更新，但插件后端仍是旧实例" + _toDisplayString(reloadingBackend.value ? '，正在自动重载插件后端……' : '，已尝试自动重载但仍未生效。') + " ", 1)
            ]),
            _: 2
          }, [
            (!reloadingBackend.value)
              ? {
                  name: "append",
                  fn: _withCtx(() => [
                    _createVNode(_component_VBtn, {
                      size: "small",
                      color: "warning",
                      variant: "flat",
                      "prepend-icon": "mdi-restart",
                      onClick: _cache[1] || (_cache[1] = $event => (reloadBackend()))
                    }, {
                      default: _withCtx(() => [...(_cache[27] || (_cache[27] = [
                        _createTextVNode("再次重载", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  key: "0"
                }
              : undefined
          ]), 1024))
        : _createCommentVNode("", true),
      (uiVersionMismatch.value)
        ? (_openBlock(), _createBlock(_component_VAlert, {
            key: 2,
            type: "info",
            variant: "tonal",
            density: "compact",
            class: "mb-4"
          }, {
            default: _withCtx(() => [
              _createTextVNode(" 检测到页面版本 " + _toDisplayString(_unref(UI_VERSION)) + " 与插件后端 " + _toDisplayString(status.value.backend_version) + " 不一致，正在自动载入新版页面…… ", 1)
            ]),
            _: 1
          }))
        : _createCommentVNode("", true),
      _createVNode(_component_VRow, { class: "mb-2" }, {
        default: _withCtx(() => [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList([
          ['最近处理', summary.value.total || 0, 'mdi-file-search-outline', 'primary'],
          ['已接纳', summary.value.accepted || 0, 'mdi-check-decagram-outline', 'success'],
          ['安全拒绝', summary.value.rejected || 0, 'mdi-shield-remove-outline', 'warning'],
          ['接纳率', `${summary.value.acceptance_rate || 0}%`, 'mdi-chart-donut', 'secondary'],
        ], (card) => {
            return (_openBlock(), _createBlock(_component_VCol, {
              key: card[0],
              cols: "6",
              md: "3"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VCard, {
                  variant: "outlined",
                  class: "metric-card"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCardText, { class: "d-flex align-center ga-3" }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VAvatar, {
                          color: card[3],
                          variant: "tonal"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VIcon, {
                              icon: card[2]
                            }, null, 8, ["icon"])
                          ]),
                          _: 2
                        }, 1032, ["color"]),
                        _createElementVNode("div", null, [
                          _createElementVNode("div", _hoisted_5, _toDisplayString(card[0]), 1),
                          _createElementVNode("div", _hoisted_6, _toDisplayString(card[1]), 1)
                        ])
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024)
              ]),
              _: 2
            }, 1024))
          }), 128))
        ]),
        _: 1
      }),
      _createVNode(_component_VCard, {
        variant: "outlined",
        class: "workspace-card"
      }, {
        default: _withCtx(() => [
          _createVNode(_component_VTabs, {
            modelValue: tab.value,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((tab).value = $event)),
            color: "primary",
            class: "px-2",
            "show-arrows": ""
          }, {
            default: _withCtx(() => [
              _createVNode(_component_VTab, {
                value: "status",
                "prepend-icon": "mdi-view-dashboard-outline"
              }, {
                default: _withCtx(() => [...(_cache[28] || (_cache[28] = [
                  _createTextVNode("状态与开关", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "settings",
                "prepend-icon": "mdi-database-search-outline"
              }, {
                default: _withCtx(() => [...(_cache[29] || (_cache[29] = [
                  _createTextVNode("TMDB 搜索增强", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "episodes",
                "prepend-icon": "mdi-animation-outline"
              }, {
                default: _withCtx(() => [...(_cache[30] || (_cache[30] = [
                  _createTextVNode("集数偏移", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "metadata",
                "prepend-icon": "mdi-code-braces-box"
              }, {
                default: _withCtx(() => [...(_cache[31] || (_cache[31] = [
                  _createTextVNode("字段与制作组", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "media",
                "prepend-icon": "mdi-waveform"
              }, {
                default: _withCtx(() => [...(_cache[32] || (_cache[32] = [
                  _createTextVNode("媒体信息识别", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "naming",
                "prepend-icon": "mdi-rename-box-outline"
              }, {
                default: _withCtx(() => [...(_cache[33] || (_cache[33] = [
                  _createTextVNode("命名规则", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "preview",
                "prepend-icon": "mdi-flask-outline"
              }, {
                default: _withCtx(() => [...(_cache[34] || (_cache[34] = [
                  _createTextVNode("综合试跑", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "notifications",
                "prepend-icon": "mdi-bell-cog-outline"
              }, {
                default: _withCtx(() => [...(_cache[35] || (_cache[35] = [
                  _createTextVNode("入库通知", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "history",
                "prepend-icon": "mdi-text-box-search-outline"
              }, {
                default: _withCtx(() => [...(_cache[36] || (_cache[36] = [
                  _createTextVNode("日志", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "diagnostics",
                "prepend-icon": "mdi-speedometer"
              }, {
                default: _withCtx(() => [...(_cache[37] || (_cache[37] = [
                  _createTextVNode("性能诊断", -1)
                ]))]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"]),
          _createVNode(_component_VDivider),
          _createElementVNode("div", _hoisted_7, [
            (tab.value === 'status')
              ? (_openBlock(), _createElementBlock("section", _hoisted_8, [
                  _createElementVNode("div", _hoisted_9, [
                    _createVNode(ModuleHeader, {
                      icon: "mdi-view-dashboard-outline",
                      title: "插件与模块状态",
                      subtitle: "总开关关闭时所有接管停止；模块开关可独立控制功能。"
                    }, {
                      actions: _withCtx(() => [
                        _createVNode(_component_VTooltip, {
                          text: "调用 MoviePilot 插件热重载：更新插件版本或接口异常（404）时点击，让新后端代码立即生效，无需重启容器",
                          location: "bottom"
                        }, {
                          activator: _withCtx(({ props: tip }) => [
                            _createVNode(_component_VBtn, _mergeProps(tip, {
                              variant: "tonal",
                              "prepend-icon": "mdi-restart",
                              loading: reloadingBackend.value,
                              onClick: _cache[3] || (_cache[3] = $event => (reloadBackend()))
                            }), {
                              default: _withCtx(() => [...(_cache[38] || (_cache[38] = [
                                _createTextVNode("重载插件后端", -1)
                              ]))]),
                              _: 1
                            }, 16, ["loading"])
                          ]),
                          _: 1
                        }),
                        _createVNode(_component_VBtn, {
                          color: "primary",
                          "prepend-icon": "mdi-content-save",
                          loading: saving.value,
                          onClick: saveConfig
                        }, {
                          default: _withCtx(() => [...(_cache[39] || (_cache[39] = [
                            _createTextVNode("保存并立即生效", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      controls: _withCtx(() => [
                        _cache[40] || (_cache[40] = _createElementVNode("div", { class: "header-control-copy" }, [
                          _createElementVNode("strong", null, "插件总开关"),
                          _createElementVNode("span", null, "控制事件接管、运行时适配和全部模块")
                        ], -1)),
                        _createVNode(_component_VSpacer),
                        _createVNode(_component_VSwitch, {
                          modelValue: config.value.show_sidebar_nav,
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.show_sidebar_nav) = $event)),
                          color: "primary",
                          "hide-details": "",
                          label: "显示侧栏工作台"
                        }, null, 8, ["modelValue"]),
                        _createVNode(_component_VSwitch, {
                          modelValue: config.value.enabled,
                          "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config.value.enabled) = $event)),
                          color: "success",
                          "hide-details": "",
                          label: config.value.enabled ? '运行中' : '已关闭'
                        }, null, 8, ["modelValue", "label"])
                      ]),
                      _: 1
                    }),
                    _createElementVNode("div", _hoisted_10, [
                      _createVNode(_component_VCard, {
                        variant: "outlined",
                        class: "module-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "primary",
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, { icon: "mdi-database-search-outline" })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, null, {
                                default: _withCtx(() => [...(_cache[41] || (_cache[41] = [
                                  _createTextVNode("TMDB 搜索增强", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(modules.value.recognizer?.status || '状态未知'), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, null, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSwitch, {
                                modelValue: config.value.recognizer_enabled,
                                "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((config.value.recognizer_enabled) = $event)),
                                color: "primary",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_11, [
                                _cache[42] || (_cache[42] = _createElementVNode("span", null, "选择模式", -1)),
                                _createElementVNode("strong", null, _toDisplayString(config.value.recognition_mode === 'tmdb_first' ? '单次首结果' : '可解释评分'), 1)
                              ]),
                              _createElementVNode("div", _hoisted_12, [
                                _cache[43] || (_cache[43] = _createElementVNode("span", null, "年份提示", -1)),
                                _createElementVNode("strong", null, _toDisplayString(config.value.use_year_hint ? '接收 MP 年份' : '忽略'), 1)
                              ]),
                              _createElementVNode("div", _hoisted_13, [
                                _cache[44] || (_cache[44] = _createElementVNode("span", null, "原标题证据", -1)),
                                _createElementVNode("strong", null, _toDisplayString(config.value.use_original_title_evidence ? '启用' : '关闭'), 1)
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode(_component_VCard, {
                        variant: "outlined",
                        class: "module-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "success",
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, { icon: "mdi-swap-vertical-bold" })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, null, {
                                default: _withCtx(() => [...(_cache[45] || (_cache[45] = [
                                  _createTextVNode("集数偏移", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(modules.value.episode_offset?.status || '状态未知'), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, null, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSwitch, {
                                modelValue: config.value.episode_normalizer_enabled,
                                "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((config.value.episode_normalizer_enabled) = $event)),
                                color: "success",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_14, [
                                _cache[46] || (_cache[46] = _createElementVNode("span", null, "维护规则", -1)),
                                _createElementVNode("strong", null, _toDisplayString(normalizerStatus.value.rule_count || 0) + " 条", 1)
                              ]),
                              _createElementVNode("div", _hoisted_15, [
                                _cache[47] || (_cache[47] = _createElementVNode("span", null, "MP 识别顺序", -1)),
                                _createElementVNode("strong", null, _toDisplayString(normalizerStatus.value.plugin_first ? '插件优先' : '原生优先'), 1)
                              ]),
                              _cache[50] || (_cache[50] = _createElementVNode("div", { class: "status-line" }, [
                                _createElementVNode("span", null, "偏移阶段"),
                                _createElementVNode("strong", null, "最终识别后")
                              ], -1)),
                              _createElementVNode("div", _hoisted_16, [
                                _cache[48] || (_cache[48] = _createElementVNode("span", null, "运行时适配", -1)),
                                _createElementVNode("strong", null, _toDisplayString(normalizerStatus.value.runtime_compatible ? '兼容' : normalizerStatus.value.runtime_message || '不可用'), 1)
                              ]),
                              _createElementVNode("div", _hoisted_17, [
                                _cache[49] || (_cache[49] = _createElementVNode("span", null, "Emby 剧集组联动", -1)),
                                _createElementVNode("strong", null, _toDisplayString(modules.value.emby_episode_group_sync?.status || '已停用'), 1)
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode(_component_VCard, {
                        variant: "outlined",
                        class: "module-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "primary",
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, { icon: "mdi-account-group-outline" })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, null, {
                                default: _withCtx(() => [...(_cache[51] || (_cache[51] = [
                                  _createTextVNode("制作组辅助", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(modules.value.release_group_assist?.status || '状态未知'), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, null, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSwitch, {
                                modelValue: config.value.release_group_assist_enabled,
                                "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((config.value.release_group_assist_enabled) = $event)),
                                color: "primary",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _cache[52] || (_cache[52] = _createElementVNode("div", { class: "status-line" }, [
                                _createElementVNode("span", null, "分类范围"),
                                _createElementVNode("strong", null, "动漫 / 真人电视剧")
                              ], -1)),
                              _cache[53] || (_cache[53] = _createElementVNode("div", { class: "status-line" }, [
                                _createElementVNode("span", null, "作用阶段"),
                                _createElementVNode("strong", null, "TMDB 候选选择")
                              ], -1))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode(_component_VCard, {
                        variant: "outlined",
                        class: "module-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "success",
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, { icon: "mdi-text-box-edit-outline" })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, null, {
                                default: _withCtx(() => [...(_cache[54] || (_cache[54] = [
                                  _createTextVNode("识别字段覆盖", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(modules.value.recognition_rules?.status || '状态未知'), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, null, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSwitch, {
                                modelValue: config.value.recognition_rule_overrides_enabled,
                                "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((config.value.recognition_rule_overrides_enabled) = $event)),
                                color: "success",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_18, [
                                _cache[55] || (_cache[55] = _createElementVNode("span", null, "内置规则目录", -1)),
                                _createElementVNode("strong", null, _toDisplayString(modules.value.recognition_rules?.catalog_rules || 0) + " 条", 1)
                              ]),
                              _createElementVNode("div", _hoisted_19, [
                                _cache[56] || (_cache[56] = _createElementVNode("span", null, "已启用覆盖", -1)),
                                _createElementVNode("strong", null, _toDisplayString(modules.value.recognition_rules?.compiled_rules || 0) + " 条", 1)
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode(_component_VCard, {
                        variant: "outlined",
                        class: "module-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "purple",
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, { icon: "mdi-waveform" })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, null, {
                                default: _withCtx(() => [...(_cache[57] || (_cache[57] = [
                                  _createTextVNode("媒体信息识别", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(modules.value.media_probe?.status || (config.value.media_probe_enabled ? '已启用' : '已停用')), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, null, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSwitch, {
                                modelValue: config.value.media_probe_enabled,
                                "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((config.value.media_probe_enabled) = $event)),
                                color: "purple",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_20, [
                                _cache[58] || (_cache[58] = _createElementVNode("span", null, "扫描字段", -1)),
                                _createElementVNode("strong", null, _toDisplayString(config.value.media_probe_fields?.length || 0) + " 项", 1)
                              ]),
                              _cache[60] || (_cache[60] = _createElementVNode("div", { class: "status-line" }, [
                                _createElementVNode("span", null, "作用阶段"),
                                _createElementVNode("strong", null, "整理前 / 命名渲染前")
                              ], -1)),
                              _createElementVNode("div", _hoisted_21, [
                                _cache[59] || (_cache[59] = _createElementVNode("span", null, "神医 Pro 联动", -1)),
                                _createElementVNode("strong", null, _toDisplayString(modules.value.strm_media_info_sync?.status || '已停用'), 1)
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode(_component_VCard, {
                        variant: "outlined",
                        class: "module-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "secondary",
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, { icon: "mdi-code-braces" })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, null, {
                                default: _withCtx(() => [...(_cache[61] || (_cache[61] = [
                                  _createTextVNode("自定义命名字段", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(modules.value.rename_fields?.status || '状态未知'), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, null, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSwitch, {
                                modelValue: config.value.custom_rename_fields_enabled,
                                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((config.value.custom_rename_fields_enabled) = $event)),
                                color: "secondary",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_22, [
                                _cache[62] || (_cache[62] = _createElementVNode("span", null, "独立字段", -1)),
                                _createElementVNode("strong", null, _toDisplayString(modules.value.rename_fields?.field_count || 0) + " 个", 1)
                              ]),
                              _cache[63] || (_cache[63] = _createElementVNode("div", { class: "status-line" }, [
                                _createElementVNode("span", null, "作用阶段"),
                                _createElementVNode("strong", null, "Jinja2 命名渲染")
                              ], -1))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode(_component_VCard, {
                        variant: "outlined",
                        class: "module-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "orange",
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, { icon: "mdi-rename-box-outline" })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, null, {
                                default: _withCtx(() => [...(_cache[64] || (_cache[64] = [
                                  _createTextVNode("命名规则", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(modules.value.rename_mapping?.status || '状态未知'), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, null, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSwitch, {
                                modelValue: config.value.rename_mapping_enabled,
                                "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((config.value.rename_mapping_enabled) = $event)),
                                color: "orange",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_23, [
                                _cache[65] || (_cache[65] = _createElementVNode("span", null, "结构化与文本规则", -1)),
                                _createElementVNode("strong", null, _toDisplayString(modules.value.rename_mapping?.rule_count || 0) + " 条", 1)
                              ]),
                              _cache[66] || (_cache[66] = _createElementVNode("div", { class: "status-line" }, [
                                _createElementVNode("span", null, "作用范围"),
                                _createElementVNode("strong", null, "制作组 / 标题 / 路径 / 字幕")
                              ], -1))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode(_component_VCard, {
                        variant: "outlined",
                        class: "module-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "primary",
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, { icon: "mdi-bell-cog-outline" })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, null, {
                                default: _withCtx(() => [...(_cache[67] || (_cache[67] = [
                                  _createTextVNode("入库通知增强", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(modules.value.notification_enhancer?.status || '已停用'), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, null, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSwitch, {
                                modelValue: config.value.notification_enhancer_enabled,
                                "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((config.value.notification_enhancer_enabled) = $event)),
                                color: "primary",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_24, [
                                _cache[68] || (_cache[68] = _createElementVNode("span", null, "运行方式", -1)),
                                _createElementVNode("strong", null, _toDisplayString(config.value.notification_mode === 'takeover' ? '接管发送' : config.value.notification_mode === 'parallel' ? '并行增强' : '仅观察'), 1)
                              ]),
                              _createElementVNode("div", _hoisted_25, [
                                _cache[69] || (_cache[69] = _createElementVNode("span", null, "通知记录", -1)),
                                _createElementVNode("strong", null, _toDisplayString(modules.value.notification_enhancer?.record_count || 0) + " 条", 1)
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'settings')
              ? (_openBlock(), _createElementBlock("section", _hoisted_26, [
                  _createElementVNode("div", _hoisted_27, [
                    _createVNode(StrategySettings, {
                      modelValue: config.value,
                      "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((config).value = $event)),
                      "show-module-switches": false,
                      "cross-id-status": crossIdStatus.value,
                      onRefreshCrossId: refreshCrossId
                    }, null, 8, ["modelValue", "cross-id-status"]),
                    _createElementVNode("div", _hoisted_28, [
                      _createElementVNode("div", _hoisted_29, "近期记忆：" + _toDisplayString(summary.value.recognition_memory?.active_targets || 0) + " 个已生效目标 / " + _toDisplayString(summary.value.recognition_memory?.sample_count || 0) + " 个不同文件", 1),
                      _createVNode(_component_VBtn, {
                        variant: "text",
                        "prepend-icon": "mdi-delete-clock-outline",
                        disabled: !(summary.value.recognition_memory?.sample_count),
                        onClick: clearRecognitionMemory
                      }, {
                        default: _withCtx(() => [...(_cache[70] || (_cache[70] = [
                          _createTextVNode("清除近期记忆", -1)
                        ]))]),
                        _: 1
                      }, 8, ["disabled"]),
                      _createVNode(_component_VBtn, {
                        color: "primary",
                        "prepend-icon": "mdi-content-save",
                        loading: saving.value,
                        onClick: saveConfig
                      }, {
                        default: _withCtx(() => [...(_cache[71] || (_cache[71] = [
                          _createTextVNode("保存并立即生效", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'metadata')
              ? (_openBlock(), _createElementBlock("section", _hoisted_30, [
                  _createElementVNode("div", _hoisted_31, [
                    _createVNode(MetadataTools, {
                      modelValue: config.value,
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((config).value = $event)),
                      mode: "metadata",
                      api: __props.api,
                      "plugin-id": __props.pluginId,
                      "saving-config": saving.value,
                      onSaveConfig: saveConfig
                    }, null, 8, ["modelValue", "api", "plugin-id", "saving-config"])
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'media')
              ? (_openBlock(), _createElementBlock("section", _hoisted_32, [
                  _createElementVNode("div", _hoisted_33, [
                    _createVNode(MetadataTools, {
                      modelValue: config.value,
                      "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((config).value = $event)),
                      mode: "probe",
                      api: __props.api,
                      "plugin-id": __props.pluginId,
                      "saving-config": saving.value,
                      onSaveConfig: saveConfig
                    }, null, 8, ["modelValue", "api", "plugin-id", "saving-config"])
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'naming')
              ? (_openBlock(), _createElementBlock("section", _hoisted_34, [
                  _createElementVNode("div", _hoisted_35, [
                    _createVNode(MetadataTools, {
                      modelValue: config.value,
                      "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((config).value = $event)),
                      mode: "naming",
                      api: __props.api,
                      "plugin-id": __props.pluginId,
                      "saving-config": saving.value,
                      onSaveConfig: saveConfig
                    }, null, 8, ["modelValue", "api", "plugin-id", "saving-config"])
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'preview')
              ? (_openBlock(), _createElementBlock("section", _hoisted_36, [
                  _createElementVNode("div", _hoisted_37, [
                    _createVNode(ModuleHeader, {
                      icon: "mdi-flask-outline",
                      title: "综合试跑",
                      subtitle: "串联检查标题解析、TMDB 候选、集数偏移、制作组编排和最终命名，不写入整理链。",
                      color: "secondary"
                    }),
                    _createVNode(_component_VRow, null, {
                      default: _withCtx(() => [
                        _createVNode(_component_VCol, {
                          cols: "12",
                          md: "5"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VCard, { variant: "outlined" }, {
                              default: _withCtx(() => [
                                _createVNode(_component_VCardItem, null, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_VCardTitle, null, {
                                      default: _withCtx(() => [...(_cache[72] || (_cache[72] = [
                                        _createTextVNode("输入完整样本", -1)
                                      ]))]),
                                      _: 1
                                    }),
                                    _createVNode(_component_VCardSubtitle, null, {
                                      default: _withCtx(() => [...(_cache[73] || (_cache[73] = [
                                        _createTextVNode("串联检查解析、TMDB、集数偏移、制作组编排与最终命名，不写入整理链", -1)
                                      ]))]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                _createVNode(_component_VCardText, null, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_VAlert, {
                                      type: "info",
                                      variant: "tonal",
                                      density: "compact",
                                      class: "mb-4"
                                    }, {
                                      default: _withCtx(() => [...(_cache[74] || (_cache[74] = [
                                        _createTextVNode("可直接粘贴原始文件名；插件会先复用 MoviePilot 识别词与解析器，再生成 TMDB 搜索词。", -1)
                                      ]))]),
                                      _: 1
                                    }),
                                    _createVNode(_component_VTextarea, {
                                      modelValue: previewInput.value.title,
                                      "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((previewInput.value.title) = $event)),
                                      label: "原标题或已提取标题",
                                      rows: "4",
                                      "auto-grow": "",
                                      variant: "outlined",
                                      "hide-details": "",
                                      class: "preview-title-field"
                                    }, null, 8, ["modelValue"]),
                                    _createVNode(_component_VRow, {
                                      dense: "",
                                      class: "preview-hints"
                                    }, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_VCol, { cols: "6" }, {
                                          default: _withCtx(() => [
                                            _cache[75] || (_cache[75] = _createElementVNode("div", { class: "field-label" }, "年份提示", -1)),
                                            _createVNode(_component_VTextField, {
                                              modelValue: previewInput.value.year,
                                              "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((previewInput.value.year) = $event)),
                                              "aria-label": "年份提示",
                                              placeholder: "可选",
                                              variant: "outlined",
                                              density: "comfortable",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        _createVNode(_component_VCol, { cols: "6" }, {
                                          default: _withCtx(() => [
                                            _cache[76] || (_cache[76] = _createElementVNode("div", { class: "field-label" }, "类型提示", -1)),
                                            _createVNode(_component_VSelect, {
                                              modelValue: previewInput.value.media_type,
                                              "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((previewInput.value.media_type) = $event)),
                                              "aria-label": "类型提示",
                                              items: [{title:'未知',value:''},{title:'电影',value:'movie'},{title:'电视剧',value:'tv'}],
                                              variant: "outlined",
                                              density: "comfortable",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        _createVNode(_component_VCol, { cols: "6" }, {
                                          default: _withCtx(() => [
                                            _cache[77] || (_cache[77] = _createElementVNode("div", { class: "field-label" }, "季提示", -1)),
                                            _createVNode(_component_VTextField, {
                                              modelValue: previewInput.value.season,
                                              "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((previewInput.value.season) = $event)),
                                              "aria-label": "季提示",
                                              type: "number",
                                              placeholder: "可选",
                                              variant: "outlined",
                                              density: "comfortable",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        _createVNode(_component_VCol, { cols: "6" }, {
                                          default: _withCtx(() => [
                                            _cache[78] || (_cache[78] = _createElementVNode("div", { class: "field-label" }, "集提示", -1)),
                                            _createVNode(_component_VTextField, {
                                              modelValue: previewInput.value.episode,
                                              "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((previewInput.value.episode) = $event)),
                                              "aria-label": "集提示",
                                              type: "number",
                                              placeholder: "可选",
                                              variant: "outlined",
                                              density: "comfortable",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    _createVNode(_component_VBtn, {
                                      block: "",
                                      color: "primary",
                                      size: "large",
                                      "prepend-icon": "mdi-play",
                                      loading: previewing.value,
                                      onClick: runPreview
                                    }, {
                                      default: _withCtx(() => [...(_cache[79] || (_cache[79] = [
                                        _createTextVNode("开始综合试跑", -1)
                                      ]))]),
                                      _: 1
                                    }, 8, ["loading"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        _createVNode(_component_VCol, {
                          cols: "12",
                          md: "7"
                        }, {
                          default: _withCtx(() => [
                            (preview.value)
                              ? (_openBlock(), _createBlock(_component_VCard, {
                                  key: 0,
                                  variant: "outlined",
                                  color: preview.value.accepted ? 'success' : 'warning',
                                  class: "result-card"
                                }, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_VCardItem, null, {
                                      prepend: _withCtx(() => [
                                        _createVNode(_component_VAvatar, {
                                          color: preview.value.accepted ? 'success' : 'warning',
                                          variant: "tonal"
                                        }, {
                                          default: _withCtx(() => [
                                            _createVNode(_component_VIcon, {
                                              icon: preview.value.accepted ? 'mdi-check-decagram' : 'mdi-shield-alert-outline'
                                            }, null, 8, ["icon"])
                                          ]),
                                          _: 1
                                        }, 8, ["color"])
                                      ]),
                                      append: _withCtx(() => [
                                        _createVNode(_component_VChip, {
                                          size: "small",
                                          color: preview.value.selection_mode === 'cross_id' ? 'success' : (preview.value.selection_mode === 'tmdb_first' ? 'primary' : 'secondary'),
                                          variant: "tonal"
                                        }, {
                                          default: _withCtx(() => [
                                            _createTextVNode(" 实际：" + _toDisplayString(preview.value.selection_mode === 'cross_id' ? '跨站 ID 精确映射' : (preview.value.selection_mode === 'tmdb_first' ? '单次首结果' : '可解释评分')), 1)
                                          ]),
                                          _: 1
                                        }, 8, ["color"])
                                      ]),
                                      default: _withCtx(() => [
                                        _createVNode(_component_VCardTitle, null, {
                                          default: _withCtx(() => [
                                            _createTextVNode(_toDisplayString(preview.value.accepted ? '候选已通过' : '本次安全拒绝'), 1)
                                          ]),
                                          _: 1
                                        }),
                                        _createVNode(_component_VCardSubtitle, null, {
                                          default: _withCtx(() => [
                                            _createTextVNode(_toDisplayString(preview.value.reason), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    _createVNode(_component_VCardText, null, {
                                      default: _withCtx(() => [
                                        (preview.value.mode_mismatch)
                                          ? (_openBlock(), _createBlock(_component_VAlert, {
                                              key: 0,
                                              type: "warning",
                                              variant: "tonal",
                                              density: "compact",
                                              class: "mb-4"
                                            }, {
                                              default: _withCtx(() => [...(_cache[80] || (_cache[80] = [
                                                _createTextVNode(" 页面请求模式与插件已保存模式不同：本次按页面选择执行；请重新保存配置，确保实际整理使用相同模式。 ", -1)
                                              ]))]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true),
                                        (preview.value.final_naming?.available)
                                          ? (_openBlock(), _createBlock(_component_VCard, {
                                              key: 1,
                                              variant: "tonal",
                                              color: "primary",
                                              class: "final-name-card mb-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _createVNode(_component_VCardText, null, {
                                                  default: _withCtx(() => [
                                                    _createElementVNode("div", _hoisted_38, [
                                                      _createVNode(_component_VIcon, { icon: "mdi-file-check-outline" }),
                                                      _cache[81] || (_cache[81] = _createElementVNode("strong", null, "最终命名", -1)),
                                                      _createVNode(_component_VChip, {
                                                        size: "x-small",
                                                        variant: "tonal"
                                                      }, {
                                                        default: _withCtx(() => [
                                                          _createTextVNode(_toDisplayString(preview.value.final_naming.template_source), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _createElementVNode("code", _hoisted_39, _toDisplayString(preview.value.final_naming.output), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }))
                                          : (preview.value.final_naming)
                                            ? (_openBlock(), _createBlock(_component_VAlert, {
                                                key: 2,
                                                type: "warning",
                                                variant: "tonal",
                                                density: "compact",
                                                class: "mb-4"
                                              }, {
                                                default: _withCtx(() => [
                                                  _createTextVNode(" 最终命名未生成：" + _toDisplayString(preview.value.final_naming.reason), 1)
                                                ]),
                                                _: 1
                                              }))
                                            : _createCommentVNode("", true),
                                        (preview.value.best)
                                          ? (_openBlock(), _createElementBlock("div", {
                                              key: 3,
                                              class: _normalizeClass(["best-result", { 'has-backdrop': preview.value.best.backdrop }]),
                                              style: _normalizeStyle(preview.value.best.backdrop ? { '--best-backdrop': `url(${preview.value.best.backdrop})` } : {})
                                            }, [
                                              _createElementVNode("div", _hoisted_40, [
                                                (preview.value.best.poster)
                                                  ? (_openBlock(), _createBlock(_component_VImg, {
                                                      key: 0,
                                                      src: preview.value.best.poster,
                                                      alt: `${preview.value.best.name} 海报`,
                                                      cover: "",
                                                      class: "best-result-poster"
                                                    }, null, 8, ["src", "alt"]))
                                                  : (_openBlock(), _createElementBlock("div", _hoisted_41, [
                                                      _createVNode(_component_VIcon, {
                                                        icon: "mdi-movie-open-outline",
                                                        size: "34"
                                                      })
                                                    ]))
                                              ]),
                                              _createElementVNode("div", _hoisted_42, [
                                                _createElementVNode("div", _hoisted_43, [
                                                  _createElementVNode("div", null, [
                                                    _createElementVNode("div", _hoisted_44, _toDisplayString(preview.value.best.name), 1),
                                                    (preview.value.best.original_name && preview.value.best.original_name !== preview.value.best.name)
                                                      ? (_openBlock(), _createElementBlock("div", _hoisted_45, _toDisplayString(preview.value.best.original_name), 1))
                                                      : _createCommentVNode("", true)
                                                  ]),
                                                  (preview.value.best.tmdb_url)
                                                    ? (_openBlock(), _createBlock(_component_VBtn, {
                                                        key: 0,
                                                        href: preview.value.best.tmdb_url,
                                                        target: "_blank",
                                                        rel: "noopener",
                                                        icon: "mdi-open-in-new",
                                                        size: "small",
                                                        variant: "text",
                                                        title: "打开 TMDB 条目"
                                                      }, null, 8, ["href"]))
                                                    : _createCommentVNode("", true)
                                                ]),
                                                _createElementVNode("div", _hoisted_46, [
                                                  _createVNode(_component_VChip, {
                                                    size: "x-small",
                                                    color: "primary",
                                                    variant: "tonal"
                                                  }, {
                                                    default: _withCtx(() => [
                                                      _createTextVNode(_toDisplayString(_unref(mediaTypeText)(preview.value.best.media_type)), 1)
                                                    ]),
                                                    _: 1
                                                  }),
                                                  _createVNode(_component_VChip, {
                                                    size: "x-small",
                                                    variant: "tonal"
                                                  }, {
                                                    default: _withCtx(() => [
                                                      _createTextVNode(_toDisplayString(preview.value.best.year || '未知年份'), 1)
                                                    ]),
                                                    _: 1
                                                  }),
                                                  _createVNode(_component_VChip, {
                                                    size: "x-small",
                                                    variant: "tonal"
                                                  }, {
                                                    default: _withCtx(() => [
                                                      _createTextVNode("TMDB " + _toDisplayString(preview.value.best.tmdb_id), 1)
                                                    ]),
                                                    _: 1
                                                  }),
                                                  (preview.value.best.vote_average)
                                                    ? (_openBlock(), _createBlock(_component_VChip, {
                                                        key: 0,
                                                        size: "x-small",
                                                        color: "warning",
                                                        variant: "tonal",
                                                        "prepend-icon": "mdi-star"
                                                      }, {
                                                        default: _withCtx(() => [
                                                          _createTextVNode("TMDB " + _toDisplayString(preview.value.best.vote_average), 1)
                                                        ]),
                                                        _: 1
                                                      }))
                                                    : _createCommentVNode("", true),
                                                  (preview.value.selection_mode === 'cross_id')
                                                    ? (_openBlock(), _createBlock(_component_VChip, {
                                                        key: 1,
                                                        size: "x-small",
                                                        color: "success",
                                                        variant: "tonal"
                                                      }, {
                                                        default: _withCtx(() => [...(_cache[82] || (_cache[82] = [
                                                          _createTextVNode("跨站 ID 定位", -1)
                                                        ]))]),
                                                        _: 1
                                                      }))
                                                    : _createCommentVNode("", true)
                                                ]),
                                                (preview.value.best.genres?.length)
                                                  ? (_openBlock(), _createElementBlock("div", _hoisted_47, [
                                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.best.genres.slice(0, 4), (genre) => {
                                                        return (_openBlock(), _createElementBlock("span", {
                                                          key: genre.name || genre
                                                        }, _toDisplayString(genre.name || genre), 1))
                                                      }), 128))
                                                    ]))
                                                  : _createCommentVNode("", true),
                                                (preview.value.best.overview)
                                                  ? (_openBlock(), _createElementBlock("p", _hoisted_48, _toDisplayString(preview.value.best.overview), 1))
                                                  : _createCommentVNode("", true)
                                              ]),
                                              _createVNode(_component_VProgressCircular, {
                                                class: "best-result-score",
                                                "model-value": preview.value.best.score,
                                                color: _unref(scoreColor)(preview.value.best.score),
                                                size: "68",
                                                width: "7"
                                              }, {
                                                default: _withCtx(() => [
                                                  _createElementVNode("strong", null, _toDisplayString(preview.value.best.score), 1)
                                                ]),
                                                _: 1
                                              }, 8, ["model-value", "color"])
                                            ], 6))
                                          : _createCommentVNode("", true),
                                        (preview.value.episode_adjustment)
                                          ? (_openBlock(), _createBlock(_component_VAlert, {
                                              key: 4,
                                              type: preview.value.episode_adjustment.applied ? 'success' : 'info',
                                              variant: "tonal",
                                              density: "compact",
                                              class: "mt-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _cache[83] || (_cache[83] = _createElementVNode("strong", null, "集数偏移：", -1)),
                                                _createTextVNode(_toDisplayString(preview.value.episode_adjustment.reason) + " ", 1),
                                                (preview.value.episode_adjustment.coordinates_authoritative !== false && preview.value.episode_adjustment.season != null && preview.value.episode_adjustment.episode != null)
                                                  ? (_openBlock(), _createElementBlock("span", _hoisted_49, " · 最终 S" + _toDisplayString(String(preview.value.episode_adjustment.season).padStart(2, '0')) + "E" + _toDisplayString(String(preview.value.episode_adjustment.episode).padStart(2, '0')), 1))
                                                  : _createCommentVNode("", true)
                                              ]),
                                              _: 1
                                            }, 8, ["type"]))
                                          : _createCommentVNode("", true),
                                        _createVNode(_component_VExpansionPanels, {
                                          variant: "accordion",
                                          class: "preview-detail-panels mt-4"
                                        }, {
                                          default: _withCtx(() => [
                                            _createVNode(_component_VExpansionPanel, null, {
                                              default: _withCtx(() => [
                                                _createVNode(_component_VExpansionPanelTitle, null, {
                                                  default: _withCtx(() => [...(_cache[84] || (_cache[84] = [
                                                    _createElementVNode("div", null, [
                                                      _createElementVNode("strong", null, "处理流程"),
                                                      _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "按解析、识别、季集、命名、入库后联动的顺序查看")
                                                    ], -1)
                                                  ]))]),
                                                  _: 1
                                                }),
                                                _createVNode(_component_VExpansionPanelText, null, {
                                                  default: _withCtx(() => [
                                                    (previewPipelineGroups.value.length)
                                                      ? (_openBlock(), _createElementBlock("div", _hoisted_50, [
                                                          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(previewPipelineGroups.value, (stage) => {
                                                            return (_openBlock(), _createElementBlock("section", {
                                                              key: stage.key,
                                                              class: _normalizeClass(["pipeline-stage", `pipeline-stage-${stage.status}`])
                                                            }, [
                                                              _createElementVNode("div", _hoisted_51, [
                                                                _createElementVNode("div", _hoisted_52, [
                                                                  _createVNode(_component_VIcon, {
                                                                    icon: stage.icon,
                                                                    size: "18"
                                                                  }, null, 8, ["icon"])
                                                                ])
                                                              ]),
                                                              _createElementVNode("div", _hoisted_53, [
                                                                _createElementVNode("header", _hoisted_54, [
                                                                  _createElementVNode("div", null, [
                                                                    _createElementVNode("span", _hoisted_55, _toDisplayString(String(stage.index).padStart(2, '0')), 1),
                                                                    _createElementVNode("strong", null, _toDisplayString(stage.title), 1)
                                                                  ]),
                                                                  _createVNode(_component_VChip, {
                                                                    size: "x-small",
                                                                    color: pipelineStagePresentation(stage.status).color,
                                                                    variant: "tonal",
                                                                    "prepend-icon": pipelineStagePresentation(stage.status).icon
                                                                  }, {
                                                                    default: _withCtx(() => [
                                                                      _createTextVNode(_toDisplayString(pipelineStagePresentation(stage.status).label), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["color", "prepend-icon"])
                                                                ]),
                                                                (stage.active.length)
                                                                  ? (_openBlock(), _createElementBlock("div", _hoisted_56, [
                                                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(stage.active, (step) => {
                                                                        return (_openBlock(), _createElementBlock("div", {
                                                                          key: step.module,
                                                                          class: "pipeline-active-step"
                                                                        }, [
                                                                          _createVNode(_component_VIcon, {
                                                                            icon: step.status === 'rejected' ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline',
                                                                            color: step.status === 'rejected' ? 'warning' : 'success',
                                                                            size: "18"
                                                                          }, null, 8, ["icon", "color"]),
                                                                          _createElementVNode("div", null, [
                                                                            _createElementVNode("strong", null, _toDisplayString(step.module), 1),
                                                                            _createElementVNode("span", {
                                                                              title: step.summary
                                                                            }, _toDisplayString(pipelineStepSummary(step)), 9, _hoisted_57)
                                                                          ])
                                                                        ]))
                                                                      }), 128))
                                                                    ]))
                                                                  : _createCommentVNode("", true),
                                                                (stage.skipped.length && stage.active.length)
                                                                  ? (_openBlock(), _createElementBlock("div", _hoisted_58, [
                                                                      _createVNode(_component_VIcon, {
                                                                        icon: "mdi-minus-circle-outline",
                                                                        size: "15"
                                                                      }),
                                                                      _createElementVNode("span", null, "未触发：" + _toDisplayString(stage.skipped.map(item => item.module).join('、')), 1)
                                                                    ]))
                                                                  : _createCommentVNode("", true),
                                                                (stage.key === 'naming' && preview.value.release_group_arrangement?.input && preview.value.release_group_arrangement?.applied)
                                                                  ? (_openBlock(), _createElementBlock("div", _hoisted_59, [
                                                                      _cache[85] || (_cache[85] = _createElementVNode("span", null, "制作组", -1)),
                                                                      _createElementVNode("code", null, _toDisplayString(preview.value.release_group_arrangement.input), 1),
                                                                      _createVNode(_component_VIcon, {
                                                                        icon: "mdi-arrow-right",
                                                                        size: "15"
                                                                      }),
                                                                      _createElementVNode("code", null, _toDisplayString(preview.value.release_group_arrangement.output), 1)
                                                                    ]))
                                                                  : _createCommentVNode("", true),
                                                                (stage.key === 'naming' && Object.keys(preview.value.custom_rename_fields?.values || {}).length)
                                                                  ? (_openBlock(), _createElementBlock("div", _hoisted_60, [
                                                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.custom_rename_fields.values, (value, key) => {
                                                                        return (_openBlock(), _createElementBlock("span", { key: key }, [
                                                                          _createElementVNode("code", null, _toDisplayString(key), 1),
                                                                          _createElementVNode("strong", null, _toDisplayString(value || '（空）'), 1)
                                                                        ]))
                                                                      }), 128))
                                                                    ]))
                                                                  : _createCommentVNode("", true)
                                                              ])
                                                            ], 2))
                                                          }), 128))
                                                        ]))
                                                      : (_openBlock(), _createElementBlock("div", _hoisted_61, [
                                                          _createVNode(_component_VIcon, {
                                                            icon: "mdi-timeline-question-outline",
                                                            size: "24"
                                                          }),
                                                          _cache[86] || (_cache[86] = _createElementVNode("span", null, "本次试跑没有返回处理阶段", -1))
                                                        ]))
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            _createVNode(_component_VExpansionPanel, null, {
                                              default: _withCtx(() => [
                                                _createVNode(_component_VExpansionPanelTitle, null, {
                                                  default: _withCtx(() => [...(_cache[87] || (_cache[87] = [
                                                    _createElementVNode("div", null, [
                                                      _createElementVNode("strong", null, "TMDB 候选与评分诊断"),
                                                      _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "搜索词、约束、去重和全部候选默认折叠")
                                                    ], -1)
                                                  ]))]),
                                                  _: 1
                                                }),
                                                _createVNode(_component_VExpansionPanelText, null, {
                                                  default: _withCtx(() => [
                                                    (preview.value.original_title)
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 0,
                                                          type: "info",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _createTextVNode("解析后标题：" + _toDisplayString(preview.value.title), 1)
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.recognition_rule_changes?.length)
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 1,
                                                          type: "success",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _cache[88] || (_cache[88] = _createTextVNode("识别字段覆盖：", -1)),
                                                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.recognition_rule_changes, (item, index) => {
                                                              return (_openBlock(), _createElementBlock("span", {
                                                                key: item.rule_id || index
                                                              }, [
                                                                index
                                                                  ? (_openBlock(), _createElementBlock("span", _hoisted_62, "；"))
                                                                  : _createCommentVNode("", true),
                                                                _createTextVNode(_toDisplayString(item.field) + "：" + _toDisplayString(item.before ?? '空') + " → " + _toDisplayString(item.after ?? '空'), 1)
                                                              ]))
                                                            }), 128))
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.type_constraint?.active)
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 2,
                                                          type: "info",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _createTextVNode("类型约束：" + _toDisplayString(preview.value.type_constraint.label) + "（" + _toDisplayString(typeConstraintSourceText(preview.value.type_constraint.source)) + "）", 1),
                                                            (preview.value.type_constraint.removed_count)
                                                              ? (_openBlock(), _createElementBlock("span", _hoisted_63, "；排除 " + _toDisplayString(preview.value.type_constraint.removed_count) + " 个冲突候选", 1))
                                                              : _createCommentVNode("", true)
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.hints?.year && Number(preview.value.hints?.season || 0) > 1 && (preview.value.hints?.media_type === '电视剧' || preview.value.hints?.media_type === 'tv'))
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 3,
                                                          type: "info",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _createTextVNode("年份语义：S" + _toDisplayString(preview.value.hints.season) + " 的 " + _toDisplayString(preview.value.hints.year) + " 作为本季播出上下文保留，不与 TMDB Series 首播年份强匹配。", 1)
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.release_group_preference?.active)
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 4,
                                                          type: "success",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _createTextVNode("制作组题材约束：" + _toDisplayString(preview.value.release_group_preference.release_group || '已分类制作组') + " → " + _toDisplayString(preview.value.release_group_preference.label), 1),
                                                            (preview.value.release_group_preference.removed_count)
                                                              ? (_openBlock(), _createElementBlock("span", _hoisted_64, "；排除 " + _toDisplayString(preview.value.release_group_preference.removed_count) + " 个题材冲突候选", 1))
                                                              : (_openBlock(), _createElementBlock("span", _hoisted_65, "；本次没有发现明确冲突候选"))
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.candidate_sources?.typed?.attempted)
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 5,
                                                          type: "info",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _createTextVNode("候选来源：Multi Search 与" + _toDisplayString(preview.value.candidate_sources.typed.media_type === '电视剧' ? ' TV Search' : ' Movie Search') + " 已合并去重；专用搜索返回 " + _toDisplayString(preview.value.candidate_sources.typed.candidate_count || 0) + " 个候选。", 1)
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.candidate_sources?.shared?.attempted || preview.value.candidate_sources?.shared?.reason !== '仅在 TMDB 无候选时查询')
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 6,
                                                          type: preview.value.candidate_sources?.shared?.hit ? 'success' : 'info',
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _createTextVNode("MP 共享识别：" + _toDisplayString(preview.value.candidate_sources.shared.reason), 1),
                                                            (preview.value.candidate_sources.shared.tmdb_id)
                                                              ? (_openBlock(), _createElementBlock("span", _hoisted_66, " · TMDB " + _toDisplayString(preview.value.candidate_sources.shared.tmdb_id), 1))
                                                              : _createCommentVNode("", true)
                                                          ]),
                                                          _: 1
                                                        }, 8, ["type"]))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.duplicate_summary?.suppressed_count || preview.value.duplicate_summary?.shadow_season_count)
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 7,
                                                          type: "info",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _createTextVNode("归并重复候选 " + _toDisplayString(preview.value.duplicate_summary?.suppressed_count || 0) + " 个；排除平行单季条目 " + _toDisplayString(preview.value.duplicate_summary?.shadow_season_count || 0) + " 个。", 1)
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.best?.eligible_rank != null && preview.value.best?.tmdb_rank != null && preview.value.best.eligible_rank !== preview.value.best.tmdb_rank)
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 8,
                                                          type: "info",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [...(_cache[89] || (_cache[89] = [
                                                            _createTextVNode("候选过滤后已按剩余结果重算有效排名；TMDB 原始排名仅保留为诊断信息。", -1)
                                                          ]))]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.best?.season_coordinate_evidence?.checked)
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 9,
                                                          type: "info",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _createTextVNode("季集校验：" + _toDisplayString(preview.value.best.season_coordinate_evidence.reason), 1),
                                                            (preview.value.best.season_coordinate_evidence.matched_group_name)
                                                              ? (_openBlock(), _createElementBlock("span", _hoisted_67, " · " + _toDisplayString(preview.value.best.season_coordinate_evidence.matched_group_name), 1))
                                                              : _createCommentVNode("", true)
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.web_search?.attempted)
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 10,
                                                          type: "info",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mb-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _createTextVNode("搜索引擎兜底：" + _toDisplayString(preview.value.web_search.engine) + " 返回 " + _toDisplayString(preview.value.web_search.result_count) + " 条，发现 " + _toDisplayString(preview.value.web_search.discovered?.length || 0) + " 个 TMDB 链接。", 1)
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true),
                                                    (preview.value.selection_mode === 'cross_id')
                                                      ? (_openBlock(), _createElementBlock(_Fragment, { key: 11 }, [
                                                          _cache[90] || (_cache[90] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mb-2" }, "跨站身份", -1)),
                                                          _createElementVNode("div", _hoisted_68, [
                                                            _createVNode(_component_VChip, {
                                                              size: "small",
                                                              color: "success",
                                                              variant: "tonal"
                                                            }, {
                                                              default: _withCtx(() => [
                                                                _createTextVNode("TMDB " + _toDisplayString(preview.value.cross_id?.tmdb_id), 1)
                                                              ]),
                                                              _: 1
                                                            }),
                                                            (preview.value.cross_id?.anilist_id)
                                                              ? (_openBlock(), _createBlock(_component_VChip, {
                                                                  key: 0,
                                                                  size: "small",
                                                                  variant: "tonal"
                                                                }, {
                                                                  default: _withCtx(() => [
                                                                    _createTextVNode("AniList " + _toDisplayString(preview.value.cross_id.anilist_id), 1)
                                                                  ]),
                                                                  _: 1
                                                                }))
                                                              : _createCommentVNode("", true),
                                                            (preview.value.cross_id?.bangumi_id)
                                                              ? (_openBlock(), _createBlock(_component_VChip, {
                                                                  key: 1,
                                                                  size: "small",
                                                                  variant: "tonal"
                                                                }, {
                                                                  default: _withCtx(() => [
                                                                    _createTextVNode("Bangumi " + _toDisplayString(preview.value.cross_id.bangumi_id), 1)
                                                                  ]),
                                                                  _: 1
                                                                }))
                                                              : _createCommentVNode("", true)
                                                          ])
                                                        ], 64))
                                                      : (_openBlock(), _createElementBlock(_Fragment, { key: 12 }, [
                                                          _cache[91] || (_cache[91] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mb-2" }, "实际搜索词", -1)),
                                                          _createElementVNode("div", _hoisted_69, [
                                                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.queries, (query) => {
                                                              return (_openBlock(), _createBlock(_component_VChip, {
                                                                key: query,
                                                                size: "small",
                                                                color: "primary",
                                                                variant: "tonal"
                                                              }, {
                                                                default: _withCtx(() => [
                                                                  _createTextVNode(_toDisplayString(query), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024))
                                                            }), 128))
                                                          ])
                                                        ], 64)),
                                                    (preview.value.candidates?.length)
                                                      ? (_openBlock(), _createBlock(_component_VTable, {
                                                          key: 13,
                                                          density: "compact",
                                                          class: "candidate-table"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _cache[92] || (_cache[92] = _createElementVNode("thead", null, [
                                                              _createElementVNode("tr", null, [
                                                                _createElementVNode("th", null, "候选"),
                                                                _createElementVNode("th", null, "命中与证据"),
                                                                _createElementVNode("th", null, "得分")
                                                              ])
                                                            ], -1)),
                                                            _createElementVNode("tbody", null, [
                                                              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.candidates, (candidate) => {
                                                                return (_openBlock(), _createElementBlock("tr", {
                                                                  key: `${candidate.media_type}-${candidate.tmdb_id}`,
                                                                  class: _normalizeClass({ 'candidate-suppressed': candidate.suppressed_as_duplicate || candidate.suppressed_as_shadow_season || candidate.suppressed_by_exclusion })
                                                                }, [
                                                                  _createElementVNode("td", null, [
                                                                    _createElementVNode("strong", null, _toDisplayString(candidate.name), 1),
                                                                    _createElementVNode("div", _hoisted_70, _toDisplayString(candidate.year || '—') + " · #" + _toDisplayString(candidate.tmdb_id), 1)
                                                                  ]),
                                                                  _createElementVNode("td", _hoisted_71, [
                                                                    _createTextVNode(_toDisplayString(candidate.matched_name || '—'), 1),
                                                                    _createElementVNode("div", _hoisted_72, [
                                                                      _createTextVNode("查询来源 " + _toDisplayString(candidate.query_confidence ?? 0), 1),
                                                                      (candidate.web_evidence)
                                                                        ? (_openBlock(), _createElementBlock("span", _hoisted_73, " · 外部证据 " + _toDisplayString(candidate.web_evidence), 1))
                                                                        : _createCommentVNode("", true)
                                                                    ]),
                                                                    (candidate.release_group_evidence?.component !== null)
                                                                      ? (_openBlock(), _createElementBlock("div", _hoisted_74, "制作组 " + _toDisplayString(candidate.release_group_evidence.label) + "：" + _toDisplayString(candidate.release_group_evidence.component) + " 分", 1))
                                                                      : _createCommentVNode("", true),
                                                                    (candidate.seasonal_evidence?.active)
                                                                      ? (_openBlock(), _createElementBlock("div", _hoisted_75, "季度目录 " + _toDisplayString(candidate.seasonal_evidence.quarter) + "：" + _toDisplayString(candidate.seasonal_evidence.component) + " 分", 1))
                                                                      : _createCommentVNode("", true),
                                                                    (candidate.memory_evidence?.active)
                                                                      ? (_openBlock(), _createElementBlock("div", _hoisted_76, "近期命中 " + _toDisplayString(candidate.memory_evidence.hits) + " 次：" + _toDisplayString(candidate.memory_evidence.component) + " 分", 1))
                                                                      : _createCommentVNode("", true),
                                                                    (candidate.preferred_by_policy)
                                                                      ? (_openBlock(), _createElementBlock("div", _hoisted_77, "命中 TMDB 优先名单"))
                                                                      : _createCommentVNode("", true),
                                                                    (candidate.suppressed_by_exclusion)
                                                                      ? (_openBlock(), _createElementBlock("div", _hoisted_78, "已被 TMDB 排除名单剔除"))
                                                                      : _createCommentVNode("", true)
                                                                  ]),
                                                                  _createElementVNode("td", null, [
                                                                    _createVNode(_component_VChip, {
                                                                      size: "small",
                                                                      variant: "tonal",
                                                                      color: candidate.suppressed_as_duplicate || candidate.suppressed_as_shadow_season || candidate.suppressed_by_exclusion ? 'grey' : _unref(scoreColor)(candidate.score)
                                                                    }, {
                                                                      default: _withCtx(() => [
                                                                        _createTextVNode(_toDisplayString(preview.value.selection_mode === 'tmdb_first' ? '诊断 ' : '') + _toDisplayString(candidate.diagnostic_score ?? candidate.score), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1032, ["color"])
                                                                  ])
                                                                ], 2))
                                                              }), 128))
                                                            ])
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true)
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["color"]))
                              : (_openBlock(), _createElementBlock("div", _hoisted_79, [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-chart-bubble",
                                    size: "64",
                                    color: "primary"
                                  }),
                                  _cache[93] || (_cache[93] = _createElementVNode("div", { class: "text-h6 mt-3" }, "等待一次综合试跑", -1)),
                                  _cache[94] || (_cache[94] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "结果会解释从标题解析到最终命名的完整插件链路", -1))
                                ]))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'history')
              ? (_openBlock(), _createElementBlock("section", _hoisted_80, [
                  _createElementVNode("div", _hoisted_81, [
                    _createVNode(ModuleHeader, {
                      icon: "mdi-text-box-search-outline",
                      title: "模块运行日志",
                      subtitle: "汇总识别决策、集数偏移、字段覆盖及命名处理结果，不保存完整响应。"
                    }, {
                      actions: _withCtx(() => [
                        _createVNode(_component_VSelect, {
                          modelValue: historyFilter.value,
                          "onUpdate:modelValue": _cache[23] || (_cache[23] = $event => ((historyFilter).value = $event)),
                          items: historyFilterItems,
                          "item-title": "title",
                          "item-value": "value",
                          density: "compact",
                          "hide-details": "",
                          class: "history-filter"
                        }, null, 8, ["modelValue"]),
                        _createVNode(_component_VBtn, {
                          variant: "text",
                          color: "error",
                          "prepend-icon": "mdi-delete-sweep-outline",
                          disabled: !history.value.length,
                          onClick: clearHistory
                        }, {
                          default: _withCtx(() => [...(_cache[95] || (_cache[95] = [
                            _createTextVNode("清空", -1)
                          ]))]),
                          _: 1
                        }, 8, ["disabled"]),
                        _createVNode(_component_VBtn, {
                          icon: "mdi-refresh",
                          variant: "text",
                          loading: loading.value,
                          onClick: loadStatus
                        }, null, 8, ["loading"])
                      ]),
                      _: 1
                    }),
                    (filteredHistory.value.length)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_82, [
                          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(filteredHistory.value, (item, historyIndex) => {
                            return (_openBlock(), _createElementBlock("div", {
                              key: `${item.created_at}-${item.module}-${item.title}-${historyIndex}`,
                              class: "history-row"
                            }, [
                              _createElementVNode("div", {
                                class: _normalizeClass(["history-marker", `history-marker-${historyStatus(item).marker}`])
                              }, [...(_cache[96] || (_cache[96] = [
                                _createElementVNode("span", null, null, -1)
                              ]))], 2),
                              _createElementVNode("article", _hoisted_83, [
                                _createElementVNode("div", _hoisted_84, [
                                  _createElementVNode("div", _hoisted_85, [
                                    _createElementVNode("div", _hoisted_86, [
                                      _createElementVNode("div", _hoisted_87, [
                                        _createElementVNode("div", _hoisted_88, _toDisplayString(item.title), 1),
                                        _createVNode(_component_VChip, {
                                          size: "x-small",
                                          color: "primary",
                                          variant: "tonal"
                                        }, {
                                          default: _withCtx(() => [
                                            _createTextVNode(_toDisplayString(item.module || 'TMDB 搜索增强'), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      (item.original_title)
                                        ? (_openBlock(), _createElementBlock("div", {
                                            key: 0,
                                            class: "text-caption text-medium-emphasis text-truncate mt-1",
                                            title: item.original_title
                                          }, "原标题：" + _toDisplayString(item.original_title), 9, _hoisted_89))
                                        : _createCommentVNode("", true),
                                      _createElementVNode("div", _hoisted_90, _toDisplayString(item.created_at) + " · " + _toDisplayString(item.reason), 1),
                                      (!item.accepted && item.kind !== 'operation')
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_91, "插件未接管本次候选选择，MoviePilot 仍会继续执行原生识别与整理；这不代表最终整理失败。"))
                                        : _createCommentVNode("", true),
                                      (item.episode_adjustment)
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_92, [
                                            _createTextVNode("集数偏移：" + _toDisplayString(item.episode_adjustment.reason), 1),
                                            (item.episode_adjustment.season != null)
                                              ? (_openBlock(), _createElementBlock("span", _hoisted_93, " · S" + _toDisplayString(item.episode_adjustment.season) + "E" + _toDisplayString(item.episode_adjustment.episode), 1))
                                              : _createCommentVNode("", true)
                                          ]))
                                        : _createCommentVNode("", true),
                                      _createElementVNode("div", _hoisted_94, [
                                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(item.stages, (stage) => {
                                          return (_openBlock(), _createBlock(_component_VChip, {
                                            key: stage,
                                            size: "x-small",
                                            color: "secondary",
                                            variant: "tonal"
                                          }, {
                                            default: _withCtx(() => [
                                              _createTextVNode(_toDisplayString(stage), 1)
                                            ]),
                                            _: 2
                                          }, 1024))
                                        }), 128)),
                                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(item.queries, (query) => {
                                          return (_openBlock(), _createBlock(_component_VChip, {
                                            key: query,
                                            size: "x-small",
                                            variant: "tonal"
                                          }, {
                                            default: _withCtx(() => [
                                              _createTextVNode(_toDisplayString(query), 1)
                                            ]),
                                            _: 2
                                          }, 1024))
                                        }), 128)),
                                        (item.web_search?.attempted)
                                          ? (_openBlock(), _createBlock(_component_VChip, {
                                              key: 0,
                                              size: "x-small",
                                              color: "info",
                                              variant: "tonal",
                                              "prepend-icon": "mdi-web"
                                            }, {
                                              default: _withCtx(() => [
                                                _createTextVNode("外部 " + _toDisplayString(item.web_search.result_count) + " 条 · 证据 " + _toDisplayString(item.web_search.evidence_candidates || 0), 1)
                                              ]),
                                              _: 2
                                            }, 1024))
                                          : _createCommentVNode("", true)
                                      ])
                                    ]),
                                    _createVNode(_component_VChip, {
                                      color: historyStatus(item).color,
                                      size: "small"
                                    }, {
                                      default: _withCtx(() => [
                                        _createTextVNode(_toDisplayString(historyStatus(item).label), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["color"])
                                  ])
                                ])
                              ])
                            ]))
                          }), 128))
                        ]))
                      : (_openBlock(), _createElementBlock("div", _hoisted_95, [
                          _createVNode(_component_VIcon, {
                            icon: "mdi-text-box-search-outline",
                            size: "60"
                          }),
                          _createElementVNode("div", _hoisted_96, _toDisplayString(history.value.length ? '当前筛选没有日志' : '尚无模块日志'), 1)
                        ]))
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'notifications')
              ? (_openBlock(), _createElementBlock("section", _hoisted_97, [
                  _createElementVNode("div", _hoisted_98, [
                    _createVNode(NotificationEnhancer, {
                      api: __props.api,
                      "plugin-base": pluginBase.value,
                      onConfigSaved: mergeNotificationConfig
                    }, null, 8, ["api", "plugin-base"])
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'diagnostics')
              ? (_openBlock(), _createElementBlock("section", _hoisted_99, [
                  _createElementVNode("div", _hoisted_100, [
                    _createVNode(PerformanceDiagnostics, {
                      api: __props.api,
                      "plugin-id": __props.pluginId
                    }, null, 8, ["api", "plugin-id"])
                  ])
                ]))
              : _createCommentVNode("", true),
            _withDirectives(_createElementVNode("section", _hoisted_101, [
              _createElementVNode("div", _hoisted_102, [
                (_openBlock(), _createBlock(_KeepAlive, null, [
                  (tab.value === 'episodes')
                    ? (_openBlock(), _createBlock(EpisodeNormalizer, {
                        key: 0,
                        api: __props.api,
                        "plugin-base": pluginBase.value,
                        "runtime-status": normalizerStatus.value,
                        onConfigSaved: mergeEmbySyncConfig
                      }, null, 8, ["api", "plugin-base", "runtime-status"]))
                    : _createCommentVNode("", true)
                ], 1024))
              ])
            ], 512), [
              [_vShow, tab.value === 'episodes']
            ])
          ])
        ]),
        _: 1
      })
    ])
  ]))
}
}

};
const AppPage = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-1fddc7dd"]]);

export { AppPage as default };
