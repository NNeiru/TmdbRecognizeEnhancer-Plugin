import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { u as unwrapResponse } from './utils-Wv8mt00E.js';
import { M as ModuleHeader } from './ModuleHeader-D43l2fc-.js';
import { _ as _export_sfc } from './_plugin-vue_export-helper-pcqpp-6-.js';

const {toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,createVNode:_createVNode,openBlock:_openBlock,createBlock:_createBlock,createCommentVNode:_createCommentVNode,createElementVNode:_createElementVNode,renderList:_renderList,Fragment:_Fragment,createElementBlock:_createElementBlock,normalizeClass:_normalizeClass,vShow:_vShow,withDirectives:_withDirectives,unref:_unref,mergeProps:_mergeProps} = await importShared('vue');


const _hoisted_1 = { class: "episode-normalizer" };
const _hoisted_2 = {
  key: 0,
  class: "rules-scroll"
};
const _hoisted_3 = { class: "rules-controls pa-4 pt-4" };
const _hoisted_4 = { class: "rule-group-title mb-2" };
const _hoisted_5 = { class: "text-caption text-medium-emphasis" };
const _hoisted_6 = { class: "flex-grow-1 min-w-0" };
const _hoisted_7 = { class: "font-weight-bold text-truncate" };
const _hoisted_8 = { class: "text-caption text-medium-emphasis" };
const _hoisted_9 = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mt-1"
};
const _hoisted_10 = {
  key: 0,
  class: "empty-rules"
};
const _hoisted_11 = { class: "d-flex align-center ga-2" };
const _hoisted_12 = { class: "board-controls mb-3" };
const _hoisted_13 = { class: "batch-bar mb-4" };
const _hoisted_14 = { class: "text-caption text-medium-emphasis mb-3" };
const _hoisted_15 = { key: 0 };
const _hoisted_16 = { key: 1 };
const _hoisted_17 = { class: "select-corner" };
const _hoisted_18 = { class: "catalog-card-layout" };
const _hoisted_19 = {
  key: 1,
  class: "catalog-poster catalog-poster-placeholder"
};
const _hoisted_20 = { class: "d-flex flex-wrap ga-1" };
const _hoisted_21 = ["title"];
const _hoisted_22 = {
  key: 0,
  class: "empty-catalog"
};
const _hoisted_23 = { class: "emby-sync-module" };
const _hoisted_24 = { class: "sync-metrics mb-4" };
const _hoisted_25 = { class: "sync-settings-grid" };
const _hoisted_26 = { class: "d-flex align-center flex-wrap ga-2 mt-5 mb-2" };
const _hoisted_27 = {
  key: 0,
  class: "path-mapping-list"
};
const _hoisted_28 = {
  key: 1,
  class: "text-caption text-medium-emphasis py-2"
};
const _hoisted_29 = { class: "sync-preview-grid" };
const _hoisted_30 = {
  key: 0,
  class: "sync-result-list mt-4"
};
const _hoisted_31 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_32 = { class: "text-body-2 mt-3" };
const _hoisted_33 = {
  key: 0,
  class: "mapped-path mt-3"
};
const _hoisted_34 = {
  key: 1,
  class: "text-caption text-medium-emphasis mt-1"
};
const _hoisted_35 = {
  key: 2,
  class: "text-caption"
};
const _hoisted_36 = {
  key: 3,
  class: "candidate-path-list mt-3"
};
const _hoisted_37 = {
  key: 4,
  class: "text-caption text-medium-emphasis mt-2"
};
const _hoisted_38 = {
  key: 5,
  class: "candidate-path-list mt-3"
};
const _hoisted_39 = { class: "d-flex ga-1" };
const _hoisted_40 = { class: "d-flex align-start ga-3" };
const _hoisted_41 = { class: "flex-grow-1 min-w-0" };
const _hoisted_42 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_43 = { class: "text-caption text-medium-emphasis" };
const _hoisted_44 = { class: "text-body-2 mt-1" };
const _hoisted_45 = ["title"];
const _hoisted_46 = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mt-2"
};
const _hoisted_47 = { class: "d-flex" };
const _hoisted_48 = {
  key: 2,
  class: "empty-sync"
};
const _hoisted_49 = { class: "d-flex align-center ga-3 mb-4" };
const _hoisted_50 = { class: "tmdb-correction mb-4" };
const _hoisted_51 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_52 = { class: "flex-grow-1" };
const _hoisted_53 = {
  key: 3,
  class: "group-preview mb-4"
};
const _hoisted_54 = { class: "d-flex align-center flex-wrap ga-2 mb-2" };
const _hoisted_55 = { class: "group-season-grid" };
const _hoisted_56 = { class: "d-flex align-center ga-2" };
const _hoisted_57 = { class: "text-truncate" };
const _hoisted_58 = { class: "text-caption text-medium-emphasis mt-1" };
const _hoisted_59 = {
  key: 0,
  class: "text-caption text-medium-emphasis"
};
const _hoisted_60 = { key: 0 };
const _hoisted_61 = { class: "d-flex align-center mb-2" };
const _hoisted_62 = { class: "manual-match" };

const {computed,onActivated,onBeforeUnmount,onDeactivated,onMounted,ref,watch} = await importShared('vue');

const uiStateKey = 'tmdbrecognizeenhancer:episode-normalizer-ui:v1';

const _sfc_main = {
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
const error = ref('');
const notice = ref('');
const snackbar = ref(false);
const snackbarColor = ref('success');
const subModule = ref('rules');
const rules = ref([]);
const rulesOpen = ref(true);
const ruleView = ref('grid');
const ruleSearch = ref('');
const ruleQuarter = ref('all');
const deleteRulesDialog = ref(false);
const deleteRulesLoading = ref(false);
const manualDialog = ref(false);
const manualLoading = ref(false);
const manualMessage = ref('');
const manualForm = ref({
  tmdb_id: '', preference: 'default', specify_quarter: false,
  year: now.getFullYear(), quarter: Math.floor(now.getMonth() / 3) + 1,
});
const catalog = ref([]);
const catalogLoading = ref(false);
const batchLoading = ref(false);
const busyId = ref('');
const selectedIds = ref([]);
const catalogMeta = ref({});
const board = ref({
  year: now.getFullYear(),
  quarter: Math.floor(now.getMonth() / 3) + 1,
  search: '',
  region: 'all',
  platform: 'all',
  scanStatus: 'all',
  multiOnly: false,
});
const batchPreference = ref('default');
const boardView = ref('grid');
const editorOpen = ref(false);
const editorLoading = ref(false);
const inspection = ref(null);
const editForm = ref(null);
const failureDialog = ref(false);
const failures = ref([]);
const manualTmdb = ref({});
const embySync = ref({
  available: true, enabled: false, active: false, worker_running: false,
  servers: [], jobs: [], counts: {},
  config: {
    enabled: false, servers: [], initial_delay_seconds: 15, retry_seconds: 30,
    max_wait_minutes: 15, path_mappings: [], conflict_policy: 'skip', refresh_metadata: true,
  },
});
const embyLoading = ref(false);
const embySaving = ref(false);
const embyPreviewing = ref(false);
const embyApplyingAll = ref('');
const embyPreview = ref(null);
const embyPreviewRule = ref('');
const embyPreviewPath = ref('');
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

const quarterKey = computed(() => `${board.value.year}-Q${board.value.quarter}`);
const platforms = computed(() => [
  { title: '全部载体', value: 'all' },
  ...Array.from(new Set(catalog.value.map(item => item.platform).filter(Boolean)))
    .sort()
    .map(value => ({ title: value, value })),
]);
const filteredCatalog = computed(() => {
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
const selectedIdSet = computed(() => new Set(selectedIds.value));
const allFilteredSelected = computed(() => (
  filteredCatalog.value.length > 0
  && filteredCatalog.value.every(item => selectedIdSet.value.has(item.id))
));
const ruleByTmdbId = computed(() => new Map(
  rules.value.map(rule => [Number(rule.tmdb_id), rule]),
));
const selectedGroup = computed(() => inspection.value?.groups?.find(
  item => item.id === editForm.value?.episode_group_id,
));
const ruleQuarterOptions = computed(() => {
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
const filteredRules = computed(() => {
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
const groupedRules = computed(() => {
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
const embyServerItems = computed(() => (embySync.value.servers || []).map(item => ({
  title: `${item.name}${item.connected ? '' : '（未连接）'}`,
  value: item.name,
})));
const embyGroupRuleItems = computed(() => rules.value
  .filter(rule => rule.enabled && rule.target_type === 'group' && rule.episode_group_id)
  .map(rule => ({
    title: `${rule.title} · TMDB ${rule.tmdb_id}`,
    value: `${rule.tmdb_id}|${rule.episode_group_id}`,
  })));
const embyStatusText = computed(() => {
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
watch(() => [board.value.year, board.value.quarter], () => {
  if (subModule.value === 'catalog') loadQuarter(false);
});
watch(subModule, value => {
  schedulePersistUiState();
  if (value === 'catalog' && initialized && !catalog.value.length) loadQuarter(false);
  if (value === 'emby' && initialized) loadEmbySync(false);
});
watch(
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
onBeforeUnmount(() => {
  if (scanTimer) clearTimeout(scanTimer);
  if (persistTimer) clearTimeout(persistTimer);
  if (embyTimer) clearTimeout(embyTimer);
});
onMounted(async () => {
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
  const _component_VChip = _resolveComponent("VChip");
  const _component_VTab = _resolveComponent("VTab");
  const _component_VTabs = _resolveComponent("VTabs");
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VAvatar = _resolveComponent("VAvatar");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent("VCardSubtitle");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VSelect = _resolveComponent("VSelect");
  const _component_VBtnToggle = _resolveComponent("VBtnToggle");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VExpandTransition = _resolveComponent("VExpandTransition");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VCheckbox = _resolveComponent("VCheckbox");
  const _component_VSpacer = _resolveComponent("VSpacer");
  const _component_VProgressLinear = _resolveComponent("VProgressLinear");
  const _component_VImg = _resolveComponent("VImg");
  const _component_VProgressCircular = _resolveComponent("VProgressCircular");
  const _component_VListItem = _resolveComponent("VListItem");
  const _component_VList = _resolveComponent("VList");
  const _component_VMenu = _resolveComponent("VMenu");
  const _component_VCardActions = _resolveComponent("VCardActions");
  const _component_VDivider = _resolveComponent("VDivider");
  const _component_VCol = _resolveComponent("VCol");
  const _component_VRow = _resolveComponent("VRow");
  const _component_VDialog = _resolveComponent("VDialog");
  const _component_VRadio = _resolveComponent("VRadio");
  const _component_VRadioGroup = _resolveComponent("VRadioGroup");
  const _component_VExpansionPanelTitle = _resolveComponent("VExpansionPanelTitle");
  const _component_VTextarea = _resolveComponent("VTextarea");
  const _component_VExpansionPanelText = _resolveComponent("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent("VExpansionPanel");
  const _component_VExpansionPanels = _resolveComponent("VExpansionPanels");
  const _component_VSnackbar = _resolveComponent("VSnackbar");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode(ModuleHeader, {
      icon: "mdi-animation-outline",
      title: "集数偏移",
      subtitle: "将片源的季集坐标归一化到 TMDB 默认编集或指定剧集组，并可联动 Emby 元数据。",
      color: "success"
    }, {
      actions: _withCtx(() => [
        _createVNode(_component_VChip, {
          color: __props.runtimeStatus.runtime_compatible ? 'success' : 'warning',
          variant: "tonal",
          size: "small",
          "prepend-icon": __props.runtimeStatus.runtime_compatible ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(__props.runtimeStatus.runtime_compatible ? `${rules.value.length} 条维护规则` : '运行时不兼容'), 1)
          ]),
          _: 1
        }, 8, ["color", "prepend-icon"])
      ]),
      controls: _withCtx(() => [
        _createVNode(_component_VTabs, {
          modelValue: subModule.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((subModule).value = $event)),
          color: "primary",
          "show-arrows": "",
          class: "module-header-tabs"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VTab, {
              value: "rules",
              "prepend-icon": "mdi-playlist-check"
            }, {
              default: _withCtx(() => [...(_cache[50] || (_cache[50] = [
                _createTextVNode("偏移规则维护", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VTab, {
              value: "catalog",
              "prepend-icon": "mdi-view-dashboard-outline"
            }, {
              default: _withCtx(() => [...(_cache[51] || (_cache[51] = [
                _createTextVNode("季度番剧看板", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VTab, {
              value: "emby",
              "prepend-icon": "mdi-server-network"
            }, {
              default: _withCtx(() => [...(_cache[52] || (_cache[52] = [
                _createTextVNode("Emby 剧集组联动", -1)
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
      ? (_openBlock(), _createBlock(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          closable: "",
          class: "mb-4",
          "onClick:close": _cache[1] || (_cache[1] = $event => (error.value = ''))
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    (!__props.runtimeStatus.runtime_compatible)
      ? (_openBlock(), _createBlock(_component_VAlert, {
          key: 1,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: _withCtx(() => [
            _cache[53] || (_cache[53] = _createElementVNode("div", { class: "font-weight-bold" }, "集数偏移暂不能接管实际整理", -1)),
            _createElementVNode("div", null, _toDisplayString(__props.runtimeStatus.runtime_message), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    _withDirectives(_createVNode(_component_VCard, {
      variant: "outlined",
      class: "normalizer-card mb-4"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCardItem, null, {
          prepend: _withCtx(() => [
            _createVNode(_component_VAvatar, {
              color: "success",
              variant: "tonal"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VIcon, { icon: "mdi-playlist-check" })
              ]),
              _: 1
            })
          ]),
          append: _withCtx(() => [
            _createVNode(_component_VBtn, {
              icon: rulesOpen.value ? 'mdi-chevron-up' : 'mdi-chevron-down',
              variant: "text",
              title: rulesOpen.value ? '收起规则' : '展开规则',
              onClick: _cache[2] || (_cache[2] = $event => (rulesOpen.value = !rulesOpen.value))
            }, null, 8, ["icon", "title"])
          ]),
          default: _withCtx(() => [
            _createVNode(_component_VCardTitle, null, {
              default: _withCtx(() => [...(_cache[54] || (_cache[54] = [
                _createTextVNode("已维护规则", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VCardSubtitle, null, {
              default: _withCtx(() => [
                _createTextVNode(_toDisplayString(rules.value.length) + " 个 TMDB 条目；定义来源集数到目标编集的映射", 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode(_component_VExpandTransition, null, {
          default: _withCtx(() => [
            (rulesOpen.value)
              ? (_openBlock(), _createElementBlock("div", _hoisted_2, [
                  _createElementVNode("div", _hoisted_3, [
                    _createVNode(_component_VTextField, {
                      modelValue: ruleSearch.value,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((ruleSearch).value = $event)),
                      label: "搜索标题、别名或 TMDBID",
                      "prepend-inner-icon": "mdi-magnify",
                      clearable: "",
                      "hide-details": "",
                      density: "compact"
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSelect, {
                      modelValue: ruleQuarter.value,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((ruleQuarter).value = $event)),
                      items: ruleQuarterOptions.value,
                      label: "按季度查看",
                      "hide-details": "",
                      density: "compact"
                    }, null, 8, ["modelValue", "items"]),
                    _createVNode(_component_VBtnToggle, {
                      modelValue: ruleView.value,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((ruleView).value = $event)),
                      mandatory: "",
                      density: "compact",
                      variant: "outlined",
                      divided: ""
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VBtn, {
                          value: "grid",
                          icon: "mdi-view-grid-outline",
                          title: "平铺"
                        }),
                        _createVNode(_component_VBtn, {
                          value: "list",
                          icon: "mdi-view-list-outline",
                          title: "列表"
                        }),
                        _createVNode(_component_VBtn, {
                          value: "compact",
                          icon: "mdi-view-headline",
                          title: "紧凑"
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    _createVNode(_component_VBtn, {
                      color: "primary",
                      variant: "tonal",
                      "prepend-icon": "mdi-plus",
                      onClick: openManualDialog
                    }, {
                      default: _withCtx(() => [...(_cache[55] || (_cache[55] = [
                        _createTextVNode("手动添加", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode(_component_VBtn, {
                      color: "error",
                      variant: "tonal",
                      "prepend-icon": "mdi-delete-sweep-outline",
                      disabled: !filteredRules.value.length,
                      onClick: _cache[6] || (_cache[6] = $event => (deleteRulesDialog.value = true))
                    }, {
                      default: _withCtx(() => [
                        _createTextVNode("删除当前结果 " + _toDisplayString(filteredRules.value.length || ''), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ]),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(groupedRules.value, (group) => {
                    return (_openBlock(), _createElementBlock("div", {
                      key: group.quarter,
                      class: "rule-group px-4 pb-4"
                    }, [
                      _createElementVNode("div", _hoisted_4, [
                        _createVNode(_component_VIcon, {
                          icon: "mdi-calendar-month-outline",
                          size: "18"
                        }),
                        _createElementVNode("strong", null, _toDisplayString(group.quarter), 1),
                        _createElementVNode("span", _hoisted_5, _toDisplayString(group.items.length) + " 条", 1)
                      ]),
                      _createElementVNode("div", {
                        class: _normalizeClass(['rules-grid', `view-${ruleView.value}`])
                      }, [
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(group.items, (rule) => {
                          return (_openBlock(), _createBlock(_component_VCard, {
                            key: rule.tmdb_id,
                            variant: "tonal",
                            class: "rule-card"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VCardText, { class: "d-flex align-center ga-3" }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VAvatar, {
                                    color: rule.enabled ? 'success' : 'default',
                                    variant: "tonal"
                                  }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VIcon, { icon: "mdi-animation-outline" })
                                    ]),
                                    _: 1
                                  }, 8, ["color"]),
                                  _createElementVNode("div", _hoisted_6, [
                                    _createElementVNode("div", _hoisted_7, _toDisplayString(rule.title), 1),
                                    _createElementVNode("div", _hoisted_8, "TMDB " + _toDisplayString(rule.tmdb_id) + " · " + _toDisplayString(rule.target_type === 'group' ? '剧集组' : '默认编集') + " · " + _toDisplayString(rule.installments?.length || 0) + " 个季度片段", 1),
                                    (rule.installments?.some(item => item.quarter))
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_9, [
                                          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(Array.from(new Set(rule.installments.map(item => item.quarter).filter(Boolean))).sort().reverse(), (quarter) => {
                                            return (_openBlock(), _createBlock(_component_VChip, {
                                              key: quarter,
                                              size: "x-small",
                                              variant: "outlined"
                                            }, {
                                              default: _withCtx(() => [
                                                _createTextVNode(_toDisplayString(quarter), 1)
                                              ]),
                                              _: 2
                                            }, 1024))
                                          }), 128))
                                        ]))
                                      : _createCommentVNode("", true)
                                  ]),
                                  _createVNode(_component_VBtn, {
                                    icon: "mdi-pencil-outline",
                                    variant: "text",
                                    onClick: $event => (openEditor(rule))
                                  }, null, 8, ["onClick"]),
                                  _createVNode(_component_VBtn, {
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
                    ? (_openBlock(), _createElementBlock("div", _hoisted_10, "当前季度或搜索条件下没有维护规则。"))
                    : _createCommentVNode("", true)
                ]))
              : _createCommentVNode("", true)
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 512), [
      [_vShow, subModule.value === 'rules']
    ]),
    _withDirectives(_createVNode(_component_VCard, {
      variant: "outlined",
      class: "normalizer-card mb-4"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCardItem, null, {
          prepend: _withCtx(() => [
            _createVNode(_component_VAvatar, {
              color: "secondary",
              variant: "tonal"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VIcon, { icon: "mdi-view-dashboard-outline" })
              ]),
              _: 1
            })
          ]),
          append: _withCtx(() => [
            _createElementVNode("div", _hoisted_11, [
              _createVNode(_component_VBtnToggle, {
                modelValue: boardView.value,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((boardView).value = $event)),
                mandatory: "",
                density: "compact",
                variant: "outlined",
                divided: ""
              }, {
                default: _withCtx(() => [
                  _createVNode(_component_VBtn, {
                    value: "grid",
                    icon: "mdi-view-grid-outline",
                    title: "平铺"
                  }),
                  _createVNode(_component_VBtn, {
                    value: "list",
                    icon: "mdi-view-list-outline",
                    title: "列表"
                  }),
                  _createVNode(_component_VBtn, {
                    value: "compact",
                    icon: "mdi-view-headline",
                    title: "紧凑"
                  })
                ]),
                _: 1
              }, 8, ["modelValue"]),
              _createVNode(_component_VBtn, {
                icon: "mdi-refresh",
                variant: "text",
                loading: catalogLoading.value,
                onClick: _cache[8] || (_cache[8] = $event => (loadQuarter(true)))
              }, null, 8, ["loading"])
            ])
          ]),
          default: _withCtx(() => [
            _createVNode(_component_VCardTitle, null, {
              default: _withCtx(() => [...(_cache[56] || (_cache[56] = [
                _createTextVNode("季度番剧看板", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VCardSubtitle, null, {
              default: _withCtx(() => [
                _createTextVNode("AniList 日漫主目录 · 跨站 ID 优先映射 · 未命中再搜索 TMDB；当前仅显示 " + _toDisplayString(quarterKey.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode(_component_VCardText, null, {
          default: _withCtx(() => [
            _createElementVNode("div", _hoisted_12, [
              _createVNode(_component_VSelect, {
                modelValue: board.value.year,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((board.value.year) = $event)),
                items: _unref(years),
                label: "年份",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode(_component_VSelect, {
                modelValue: board.value.quarter,
                "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((board.value.quarter) = $event)),
                items: [1,2,3,4].map(value => ({ title: `Q${value}`, value })),
                label: "季度",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode(_component_VTextField, {
                modelValue: board.value.search,
                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((board.value.search) = $event)),
                label: "搜索番剧",
                "prepend-inner-icon": "mdi-magnify",
                clearable: "",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue"]),
              _createVNode(_component_VSelect, {
                modelValue: board.value.region,
                "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((board.value.region) = $event)),
                label: "地区",
                "hide-details": "",
                density: "compact",
                items: [{title:'全部地区',value:'all'},{title:'日漫',value:'japan'},{title:'国漫',value:'china'},{title:'海外动画',value:'western'},{title:'地区未知',value:'unknown'}]
              }, null, 8, ["modelValue"]),
              _createVNode(_component_VSelect, {
                modelValue: board.value.platform,
                "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((board.value.platform) = $event)),
                items: platforms.value,
                label: "载体",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode(_component_VSelect, {
                modelValue: board.value.scanStatus,
                "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((board.value.scanStatus) = $event)),
                label: "扫描状态",
                "hide-details": "",
                density: "compact",
                items: [{title:'全部状态',value:'all'},{title:'正在扫描',value:'scanning'},{title:'已匹配',value:'matched'},{title:'匹配失败',value:'failed'},{title:'通知已忽略',value:'ignored'}]
              }, null, 8, ["modelValue"]),
              _createVNode(_component_VSwitch, {
                modelValue: board.value.multiOnly,
                "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((board.value.multiOnly) = $event)),
                label: "仅续作/多季",
                color: "secondary",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue"])
            ]),
            _createElementVNode("div", _hoisted_13, [
              _createVNode(_component_VCheckbox, {
                "model-value": allFilteredSelected.value,
                indeterminate: selectedIds.value.length > 0 && !allFilteredSelected.value,
                label: "选择当前筛选结果",
                "hide-details": "",
                density: "compact",
                onClick: toggleAllFiltered
              }, null, 8, ["model-value", "indeterminate"]),
              _createVNode(_component_VSpacer),
              _createVNode(_component_VSelect, {
                modelValue: batchPreference.value,
                "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((batchPreference).value = $event)),
                class: "batch-target",
                "hide-details": "",
                density: "compact",
                items: [{title:'优先 TMDB 默认编集',value:'default'},{title:'优先剧集组（Production/Season）',value:'group_preferred'}]
              }, null, 8, ["modelValue"]),
              _createVNode(_component_VBtn, {
                color: "secondary",
                "prepend-icon": "mdi-playlist-plus",
                loading: batchLoading.value,
                disabled: !selectedIds.value.length,
                onClick: batchAdd
              }, {
                default: _withCtx(() => [
                  _createTextVNode("批量加入 " + _toDisplayString(selectedIds.value.length || ''), 1)
                ]),
                _: 1
              }, 8, ["loading", "disabled"])
            ]),
            (catalogLoading.value)
              ? (_openBlock(), _createBlock(_component_VProgressLinear, {
                  key: 0,
                  indeterminate: "",
                  color: "secondary",
                  class: "mb-4"
                }))
              : _createCommentVNode("", true),
            _createElementVNode("div", _hoisted_14, [
              _createTextVNode(" 当前 " + _toDisplayString(filteredCatalog.value.length) + " / " + _toDisplayString(catalog.value.length) + " 条 ", 1),
              (catalogMeta.value.scanning_count)
                ? (_openBlock(), _createElementBlock("span", _hoisted_15, " · " + _toDisplayString(catalogMeta.value.scanning_count) + " 条正在扫描", 1))
                : _createCommentVNode("", true),
              (catalogMeta.value.updated_at)
                ? (_openBlock(), _createElementBlock("span", _hoisted_16, " · 更新于 " + _toDisplayString(catalogMeta.value.updated_at), 1))
                : _createCommentVNode("", true)
            ]),
            _createElementVNode("div", {
              class: _normalizeClass(['catalog-grid', `view-${boardView.value}`])
            }, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(filteredCatalog.value, (item) => {
                return (_openBlock(), _createBlock(_component_VCard, {
                  key: item.id,
                  variant: "outlined",
                  class: "catalog-card"
                }, {
                  default: _withCtx(() => [
                    _createElementVNode("div", _hoisted_17, [
                      _createVNode(_component_VCheckbox, {
                        modelValue: selectedIds.value,
                        "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((selectedIds).value = $event)),
                        value: item.id,
                        "hide-details": "",
                        density: "compact"
                      }, null, 8, ["modelValue", "value"])
                    ]),
                    _createElementVNode("div", _hoisted_18, [
                      (item.poster)
                        ? (_openBlock(), _createBlock(_component_VImg, {
                            key: 0,
                            src: item.poster,
                            cover: "",
                            class: "catalog-poster"
                          }, null, 8, ["src"]))
                        : (_openBlock(), _createElementBlock("div", _hoisted_19, [
                            _createVNode(_component_VIcon, {
                              icon: "mdi-image-off-outline",
                              size: "30"
                            })
                          ])),
                      _createVNode(_component_VCardItem, { class: "catalog-summary" }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardTitle, { class: "text-subtitle-1 text-wrap" }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(item.display_name || item.name_cn || item.name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          _createVNode(_component_VCardSubtitle, null, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(item.date || '日期未知') + " · " + _toDisplayString(item.episode_count || '?') + " 集", 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      _createVNode(_component_VCardText, { class: "catalog-details" }, {
                        default: _withCtx(() => [
                          _createElementVNode("div", _hoisted_20, [
                            (item.region_name)
                              ? (_openBlock(), _createBlock(_component_VChip, {
                                  key: 0,
                                  size: "x-small",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx(() => [
                                    _createTextVNode(_toDisplayString(item.region_name), 1)
                                  ]),
                                  _: 2
                                }, 1024))
                              : _createCommentVNode("", true),
                            (item.platform)
                              ? (_openBlock(), _createBlock(_component_VChip, {
                                  key: 1,
                                  size: "x-small",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx(() => [
                                    _createTextVNode(_toDisplayString(item.platform), 1)
                                  ]),
                                  _: 2
                                }, 1024))
                              : _createCommentVNode("", true),
                            (item.is_multi_season)
                              ? (_openBlock(), _createBlock(_component_VChip, {
                                  key: 2,
                                  size: "x-small",
                                  color: "secondary",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx(() => [...(_cache[57] || (_cache[57] = [
                                    _createTextVNode("续作/多季", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode("", true),
                            (item.matched_media_type)
                              ? (_openBlock(), _createBlock(_component_VChip, {
                                  key: 3,
                                  size: "x-small",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx(() => [
                                    _createTextVNode(_toDisplayString(item.matched_media_type), 1)
                                  ]),
                                  _: 2
                                }, 1024))
                              : _createCommentVNode("", true),
                            (item.scan_status === 'scanning')
                              ? (_openBlock(), _createBlock(_component_VChip, {
                                  key: 4,
                                  size: "x-small",
                                  color: "info",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_VProgressCircular, {
                                      indeterminate: "",
                                      size: "11",
                                      width: "2",
                                      class: "me-1"
                                    }),
                                    _cache[58] || (_cache[58] = _createTextVNode("正在扫描 ", -1))
                                  ]),
                                  _: 1
                                }))
                              : (item.scan_status === 'failed' && !item.maintained)
                                ? (_openBlock(), _createBlock(_component_VChip, {
                                    key: 5,
                                    size: "x-small",
                                    color: "warning",
                                    variant: "tonal"
                                  }, {
                                    default: _withCtx(() => [...(_cache[59] || (_cache[59] = [
                                      _createTextVNode("匹配待补充", -1)
                                    ]))]),
                                    _: 1
                                  }))
                                : _createCommentVNode("", true),
                            (item.maintained)
                              ? (_openBlock(), _createBlock(_component_VChip, {
                                  key: 6,
                                  size: "x-small",
                                  color: "success",
                                  "prepend-icon": "mdi-check"
                                }, {
                                  default: _withCtx(() => [...(_cache[60] || (_cache[60] = [
                                    _createTextVNode("已维护", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode("", true),
                            (item.notification_ignored)
                              ? (_openBlock(), _createBlock(_component_VChip, {
                                  key: 7,
                                  size: "x-small",
                                  color: "default",
                                  variant: "tonal",
                                  "prepend-icon": "mdi-bell-off-outline"
                                }, {
                                  default: _withCtx(() => [...(_cache[61] || (_cache[61] = [
                                    _createTextVNode("通知已忽略", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode("", true)
                          ]),
                          (item.tmdb_match?.best || item.maintained_tmdb_id)
                            ? (_openBlock(), _createElementBlock("div", {
                                key: 0,
                                class: "text-caption text-medium-emphasis mt-2 text-truncate",
                                title: `TMDB ${item.tmdb_match?.best?.tmdb_id || item.maintained_tmdb_id} · ${item.tmdb_match?.best?.name || '已维护规则'}`
                              }, " TMDB " + _toDisplayString(item.tmdb_match?.best?.tmdb_id || item.maintained_tmdb_id) + " · " + _toDisplayString(item.tmdb_match?.best?.name || '已维护规则'), 9, _hoisted_21))
                            : _createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1024),
                      _createVNode(_component_VCardActions, { class: "catalog-actions" }, {
                        default: _withCtx(() => [
                          (!item.maintained && item.rule_eligible !== false)
                            ? (_openBlock(), _createBlock(_component_VMenu, { key: 0 }, {
                                activator: _withCtx(({ props: menuProps }) => [
                                  _createVNode(_component_VBtn, _mergeProps({ ref_for: true }, menuProps, {
                                    color: "primary",
                                    variant: "tonal",
                                    "append-icon": "mdi-menu-down",
                                    loading: busyId.value === item.id
                                  }), {
                                    default: _withCtx(() => [...(_cache[62] || (_cache[62] = [
                                      _createTextVNode("加入规则", -1)
                                    ]))]),
                                    _: 1
                                  }, 16, ["loading"])
                                ]),
                                default: _withCtx(() => [
                                  _createVNode(_component_VList, { density: "compact" }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VListItem, {
                                        title: "使用 TMDB 默认编集",
                                        "prepend-icon": "mdi-database-outline",
                                        onClick: $event => (addCatalogItem(item, 'default'))
                                      }, null, 8, ["onClick"]),
                                      _createVNode(_component_VListItem, {
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
                              ? (_openBlock(), _createBlock(_component_VBtn, {
                                  key: 1,
                                  variant: "text",
                                  disabled: "",
                                  "prepend-icon": "mdi-movie-open-outline"
                                }, {
                                  default: _withCtx(() => [...(_cache[63] || (_cache[63] = [
                                    _createTextVNode("电影条目无需集数规则", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : (_openBlock(), _createBlock(_component_VBtn, {
                                  key: 2,
                                  variant: "text",
                                  "prepend-icon": "mdi-pencil-outline",
                                  onClick: $event => (openEditor(ruleByTmdbId.value.get(Number(item.tmdb_match?.best?.tmdb_id || item.maintained_tmdb_id))))
                                }, {
                                  default: _withCtx(() => [...(_cache[64] || (_cache[64] = [
                                    _createTextVNode("编辑规则", -1)
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
                ? (_openBlock(), _createElementBlock("div", _hoisted_22, [
                    _createVNode(_component_VIcon, {
                      icon: "mdi-calendar-search",
                      size: "48"
                    }),
                    _cache[65] || (_cache[65] = _createElementVNode("div", null, "当前筛选条件没有番剧", -1))
                  ]))
                : _createCommentVNode("", true)
            ], 2)
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 512), [
      [_vShow, subModule.value === 'catalog']
    ]),
    _withDirectives(_createElementVNode("div", _hoisted_23, [
      _createVNode(_component_VAlert, {
        type: "info",
        variant: "tonal",
        density: "compact",
        class: "mb-4"
      }, {
        default: _withCtx(() => [...(_cache[66] || (_cache[66] = [
          _createTextVNode(" 仅当实际整理采用剧集组规则时才会排队；插件通过 TMDBID 与最终路径定位 Emby Series，写入神医使用的 ", -1),
          _createElementVNode("code", null, "TmdbEg", -1),
          _createTextVNode("。已正确配置的条目会自动跳过。 ", -1)
        ]))]),
        _: 1
      }),
      (!embySync.value.available)
        ? (_openBlock(), _createBlock(_component_VAlert, {
            key: 0,
            type: "warning",
            variant: "tonal",
            class: "mb-4"
          }, {
            default: _withCtx(() => [...(_cache[67] || (_cache[67] = [
              _createTextVNode(" 当前 MoviePilot 缺少媒体服务器服务目录，无法复用已配置的 Emby。此限制不会影响集数偏移本身。 ", -1)
            ]))]),
            _: 1
          }))
        : _createCommentVNode("", true),
      _createVNode(_component_VCard, {
        variant: "outlined",
        class: "normalizer-card mb-4"
      }, {
        default: _withCtx(() => [
          _createVNode(_component_VCardItem, null, {
            prepend: _withCtx(() => [
              _createVNode(_component_VAvatar, {
                color: "primary",
                variant: "tonal"
              }, {
                default: _withCtx(() => [
                  _createVNode(_component_VIcon, { icon: "mdi-server-network" })
                ]),
                _: 1
              })
            ]),
            append: _withCtx(() => [
              _createVNode(_component_VSwitch, {
                modelValue: embySync.value.config.enabled,
                "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((embySync.value.config.enabled) = $event)),
                color: "success",
                "hide-details": "",
                label: "启用联动"
              }, null, 8, ["modelValue"])
            ]),
            default: _withCtx(() => [
              _createVNode(_component_VCardTitle, null, {
                default: _withCtx(() => [...(_cache[68] || (_cache[68] = [
                  _createTextVNode("入库联动设置", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VCardSubtitle, null, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString(embyStatusText.value), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode(_component_VCardText, null, {
            default: _withCtx(() => [
              _createElementVNode("div", _hoisted_24, [
                _createElementVNode("div", null, [
                  _cache[69] || (_cache[69] = _createElementVNode("span", null, "等待处理", -1)),
                  _createElementVNode("strong", null, _toDisplayString(embySync.value.counts?.pending || 0), 1)
                ]),
                _createElementVNode("div", null, [
                  _cache[70] || (_cache[70] = _createElementVNode("span", null, "已完成", -1)),
                  _createElementVNode("strong", null, _toDisplayString(embySync.value.counts?.completed || 0), 1)
                ]),
                _createElementVNode("div", null, [
                  _cache[71] || (_cache[71] = _createElementVNode("span", null, "需要处理", -1)),
                  _createElementVNode("strong", null, _toDisplayString(embySync.value.counts?.attention || 0), 1)
                ])
              ]),
              _createElementVNode("div", _hoisted_25, [
                _createVNode(_component_VSelect, {
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
                _createVNode(_component_VSelect, {
                  modelValue: embySync.value.config.conflict_policy,
                  "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((embySync.value.config.conflict_policy) = $event)),
                  label: "已有不同 TmdbEg 时",
                  items: [{title:'安全跳过并报告冲突',value:'skip'},{title:'以当前维护规则覆盖',value:'overwrite'}],
                  hint: "默认不覆盖 Emby 中已有的人工选择",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VTextField, {
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
                _createVNode(_component_VTextField, {
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
                _createVNode(_component_VTextField, {
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
                _createVNode(_component_VSwitch, {
                  modelValue: embySync.value.config.refresh_metadata,
                  "onUpdate:modelValue": _cache[24] || (_cache[24] = $event => ((embySync.value.config.refresh_metadata) = $event)),
                  color: "primary",
                  label: "写入后刷新 Series 元数据",
                  hint: "使神医按新剧集组重新刮削",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"])
              ]),
              _createElementVNode("div", _hoisted_26, [
                _cache[73] || (_cache[73] = _createElementVNode("div", { class: "flex-grow-1" }, [
                  _createElementVNode("div", { class: "font-weight-bold" }, "容器路径映射"),
                  _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "MP 与 Emby 看到的媒体路径相同时无需配置；不同时按最长前缀转换。")
                ], -1)),
                _createVNode(_component_VBtn, {
                  variant: "tonal",
                  "prepend-icon": "mdi-plus",
                  onClick: addPathMapping
                }, {
                  default: _withCtx(() => [...(_cache[72] || (_cache[72] = [
                    _createTextVNode("添加映射", -1)
                  ]))]),
                  _: 1
                })
              ]),
              (embySync.value.config.path_mappings?.length)
                ? (_openBlock(), _createElementBlock("div", _hoisted_27, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(embySync.value.config.path_mappings, (mapping, index) => {
                      return (_openBlock(), _createElementBlock("div", {
                        key: index,
                        class: "path-mapping-row"
                      }, [
                        _createVNode(_component_VSelect, {
                          modelValue: mapping.server,
                          "onUpdate:modelValue": $event => ((mapping.server) = $event),
                          label: "Emby",
                          items: [{title:'全部 Emby',value:'*'}, ...embyServerItems.value],
                          "hide-details": "",
                          density: "compact",
                          variant: "outlined"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                        _createVNode(_component_VTextField, {
                          modelValue: mapping.source,
                          "onUpdate:modelValue": $event => ((mapping.source) = $event),
                          label: "MP 路径前缀",
                          placeholder: "/media/TV",
                          "hide-details": "",
                          density: "compact",
                          variant: "outlined"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        _createVNode(_component_VIcon, {
                          icon: "mdi-arrow-right",
                          color: "medium-emphasis"
                        }),
                        _createVNode(_component_VTextField, {
                          modelValue: mapping.target,
                          "onUpdate:modelValue": $event => ((mapping.target) = $event),
                          label: "Emby 路径前缀",
                          placeholder: "/mnt/media/TV",
                          "hide-details": "",
                          density: "compact",
                          variant: "outlined"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        _createVNode(_component_VBtn, {
                          icon: "mdi-delete-outline",
                          color: "error",
                          variant: "text",
                          onClick: $event => (embySync.value.config.path_mappings.splice(index, 1))
                        }, null, 8, ["onClick"])
                      ]))
                    }), 128))
                  ]))
                : (_openBlock(), _createElementBlock("div", _hoisted_28, "未设置路径映射，将直接比较 MP 最终路径与 Emby Series 路径。"))
            ]),
            _: 1
          }),
          _createVNode(_component_VDivider),
          _createVNode(_component_VCardActions, { class: "pa-4" }, {
            default: _withCtx(() => [
              _createVNode(_component_VBtn, {
                variant: "text",
                "prepend-icon": "mdi-refresh",
                loading: embyLoading.value,
                onClick: _cache[25] || (_cache[25] = $event => (loadEmbySync(false)))
              }, {
                default: _withCtx(() => [...(_cache[74] || (_cache[74] = [
                  _createTextVNode("刷新状态", -1)
                ]))]),
                _: 1
              }, 8, ["loading"]),
              _createVNode(_component_VSpacer),
              _createVNode(_component_VBtn, {
                color: "primary",
                "prepend-icon": "mdi-content-save",
                loading: embySaving.value,
                onClick: saveEmbySync
              }, {
                default: _withCtx(() => [...(_cache[75] || (_cache[75] = [
                  _createTextVNode("保存联动设置", -1)
                ]))]),
                _: 1
              }, 8, ["loading"])
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      _createVNode(_component_VCard, {
        variant: "outlined",
        class: "normalizer-card mb-4"
      }, {
        default: _withCtx(() => [
          _createVNode(_component_VCardItem, null, {
            prepend: _withCtx(() => [
              _createVNode(_component_VAvatar, {
                color: "secondary",
                variant: "tonal"
              }, {
                default: _withCtx(() => [
                  _createVNode(_component_VIcon, { icon: "mdi-flask-outline" })
                ]),
                _: 1
              })
            ]),
            default: _withCtx(() => [
              _createVNode(_component_VCardTitle, null, {
                default: _withCtx(() => [...(_cache[76] || (_cache[76] = [
                  _createTextVNode("Series 定位试跑", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VCardSubtitle, null, {
                default: _withCtx(() => [...(_cache[77] || (_cache[77] = [
                  _createTextVNode("定位本身只读；出现同 TMDBID 歧义时，可确认将剧集组应用到全部候选", -1)
                ]))]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode(_component_VCardText, null, {
            default: _withCtx(() => [
              _createElementVNode("div", _hoisted_29, [
                _createVNode(_component_VSelect, {
                  modelValue: embyPreviewRule.value,
                  "onUpdate:modelValue": _cache[26] || (_cache[26] = $event => ((embyPreviewRule).value = $event)),
                  items: embyGroupRuleItems.value,
                  label: "剧集组维护规则",
                  "hide-details": ""
                }, null, 8, ["modelValue", "items"]),
                _createVNode(_component_VTextField, {
                  modelValue: embyPreviewPath.value,
                  "onUpdate:modelValue": _cache[27] || (_cache[27] = $event => ((embyPreviewPath).value = $event)),
                  label: "MP 整理后的实际文件路径",
                  placeholder: "/media/TV/作品/Season 02/E01.mkv",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VBtn, {
                  color: "secondary",
                  "prepend-icon": "mdi-radar",
                  loading: embyPreviewing.value,
                  disabled: !embyPreviewRule.value || !embyPreviewPath.value,
                  onClick: previewEmbySync
                }, {
                  default: _withCtx(() => [...(_cache[78] || (_cache[78] = [
                    _createTextVNode("开始定位", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              (embyPreview.value?.results)
                ? (_openBlock(), _createElementBlock("div", _hoisted_30, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(embyPreview.value.results, (result, server) => {
                      return (_openBlock(), _createBlock(_component_VCard, {
                        key: server,
                        variant: "outlined",
                        class: _normalizeClass(["sync-result-card", `sync-result-${embyResultColor(result.status)}`])
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardText, null, {
                            default: _withCtx(() => [
                              _createElementVNode("div", _hoisted_31, [
                                _createVNode(_component_VAvatar, {
                                  color: embyResultColor(result.status),
                                  variant: "tonal",
                                  size: "34"
                                }, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_VIcon, {
                                      icon: result.status === 'ambiguous' ? 'mdi-source-branch' : result.status === 'updated' || result.status === 'already' ? 'mdi-check' : 'mdi-information-outline',
                                      size: "19"
                                    }, null, 8, ["icon"])
                                  ]),
                                  _: 2
                                }, 1032, ["color"]),
                                _createElementVNode("strong", null, _toDisplayString(server), 1),
                                _createVNode(_component_VChip, {
                                  size: "x-small",
                                  color: embyResultColor(result.status),
                                  variant: "tonal"
                                }, {
                                  default: _withCtx(() => [
                                    _createTextVNode(_toDisplayString(embyResultText(result.status)), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["color"]),
                                _createVNode(_component_VSpacer),
                                (result.status === 'ambiguous' && Number(result.candidate_count || result.candidates?.length || 0) > 1)
                                  ? (_openBlock(), _createBlock(_component_VBtn, {
                                      key: 0,
                                      size: "small",
                                      color: "warning",
                                      variant: "tonal",
                                      "prepend-icon": "mdi-playlist-check",
                                      loading: embyApplyingAll.value === server,
                                      disabled: Boolean(embyApplyingAll.value) && embyApplyingAll.value !== server,
                                      onClick: $event => (applyAllEmbyCandidates(server, result))
                                    }, {
                                      default: _withCtx(() => [...(_cache[79] || (_cache[79] = [
                                        _createTextVNode("修改全部候选", -1)
                                      ]))]),
                                      _: 1
                                    }, 8, ["loading", "disabled", "onClick"]))
                                  : _createCommentVNode("", true)
                              ]),
                              _createElementVNode("div", _hoisted_32, _toDisplayString(result.reason), 1),
                              (result.mapped_target_path)
                                ? (_openBlock(), _createElementBlock("div", _hoisted_33, [
                                    _cache[80] || (_cache[80] = _createElementVNode("span", null, "实际比较路径", -1)),
                                    _createElementVNode("code", null, _toDisplayString(result.mapped_target_path), 1)
                                  ]))
                                : _createCommentVNode("", true),
                              (result.item_name)
                                ? (_openBlock(), _createElementBlock("div", _hoisted_34, _toDisplayString(result.item_name) + " · " + _toDisplayString(result.item_path || '路径未知'), 1))
                                : _createCommentVNode("", true),
                              (result.existing_group_id)
                                ? (_openBlock(), _createElementBlock("div", _hoisted_35, "当前 TmdbEg：" + _toDisplayString(result.existing_group_id), 1))
                                : _createCommentVNode("", true),
                              (result.candidates?.length)
                                ? (_openBlock(), _createElementBlock("div", _hoisted_36, [
                                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(result.candidates, (item) => {
                                      return (_openBlock(), _createElementBlock("div", {
                                        key: item.item_id
                                      }, [
                                        _createElementVNode("span", null, _toDisplayString(item.name), 1),
                                        _createElementVNode("code", null, _toDisplayString(item.path || '无路径'), 1)
                                      ]))
                                    }), 128))
                                  ]))
                                : _createCommentVNode("", true),
                              (Number(result.candidate_count || 0) > Number(result.candidates?.length || 0))
                                ? (_openBlock(), _createElementBlock("div", _hoisted_37, " 共 " + _toDisplayString(result.candidate_count) + " 个候选，此处仅展示前 " + _toDisplayString(result.candidates?.length || 0) + " 个 ", 1))
                                : _createCommentVNode("", true),
                              (result.items?.length)
                                ? (_openBlock(), _createElementBlock("div", _hoisted_38, [
                                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(result.items, (item) => {
                                      return (_openBlock(), _createElementBlock("div", {
                                        key: item.item_id
                                      }, [
                                        _createElementVNode("span", null, _toDisplayString(item.item_name) + " · " + _toDisplayString(embyResultText(item.status)), 1),
                                        _createElementVNode("code", null, _toDisplayString(item.item_path || '无路径'), 1)
                                      ]))
                                    }), 128))
                                  ]))
                                : _createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["class"]))
                    }), 128))
                  ]))
                : _createCommentVNode("", true)
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      _createVNode(_component_VCard, {
        variant: "outlined",
        class: "normalizer-card mb-4"
      }, {
        default: _withCtx(() => [
          _createVNode(_component_VCardItem, null, {
            prepend: _withCtx(() => [
              _createVNode(_component_VAvatar, {
                color: "success",
                variant: "tonal"
              }, {
                default: _withCtx(() => [
                  _createVNode(_component_VIcon, { icon: "mdi-progress-clock" })
                ]),
                _: 1
              })
            ]),
            append: _withCtx(() => [
              _createElementVNode("div", _hoisted_39, [
                _createVNode(_component_VBtn, {
                  variant: "text",
                  "prepend-icon": "mdi-replay",
                  disabled: !embySync.value.jobs?.length,
                  onClick: _cache[28] || (_cache[28] = $event => (retryEmbyJob()))
                }, {
                  default: _withCtx(() => [...(_cache[83] || (_cache[83] = [
                    _createTextVNode("重试未完成", -1)
                  ]))]),
                  _: 1
                }, 8, ["disabled"]),
                _createVNode(_component_VBtn, {
                  variant: "text",
                  color: "error",
                  "prepend-icon": "mdi-delete-sweep-outline",
                  onClick: _cache[29] || (_cache[29] = $event => (deleteEmbyJob()))
                }, {
                  default: _withCtx(() => [...(_cache[84] || (_cache[84] = [
                    _createTextVNode("清理已结束", -1)
                  ]))]),
                  _: 1
                })
              ])
            ]),
            default: _withCtx(() => [
              _createVNode(_component_VCardTitle, null, {
                default: _withCtx(() => [...(_cache[81] || (_cache[81] = [
                  _createTextVNode("联动任务", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VCardSubtitle, null, {
                default: _withCtx(() => [...(_cache[82] || (_cache[82] = [
                  _createTextVNode("任务持久保存，MoviePilot 重启后仍可继续重试", -1)
                ]))]),
                _: 1
              })
            ]),
            _: 1
          }),
          (embyLoading.value)
            ? (_openBlock(), _createBlock(_component_VProgressLinear, {
                key: 0,
                indeterminate: "",
                color: "primary"
              }))
            : _createCommentVNode("", true),
          (embySync.value.jobs?.length)
            ? (_openBlock(), _createBlock(_component_VCardText, {
                key: 1,
                class: "sync-job-list"
              }, {
                default: _withCtx(() => [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(embySync.value.jobs, (job) => {
                    return (_openBlock(), _createBlock(_component_VCard, {
                      key: job.id,
                      variant: "tonal",
                      class: "sync-job-card"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VCardText, null, {
                          default: _withCtx(() => [
                            _createElementVNode("div", _hoisted_40, [
                              _createVNode(_component_VAvatar, {
                                color: embyResultColor(job.status),
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, {
                                    icon: job.status === 'completed' ? 'mdi-check' : job.status === 'pending' || job.status === 'running' ? 'mdi-clock-outline' : 'mdi-alert-outline'
                                  }, null, 8, ["icon"])
                                ]),
                                _: 2
                              }, 1032, ["color"]),
                              _createElementVNode("div", _hoisted_41, [
                                _createElementVNode("div", _hoisted_42, [
                                  _createElementVNode("strong", null, _toDisplayString(job.title), 1),
                                  _createVNode(_component_VChip, {
                                    size: "x-small",
                                    color: embyResultColor(job.status)
                                  }, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(embyResultText(job.status)), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["color"])
                                ]),
                                _createElementVNode("div", _hoisted_43, "TMDB " + _toDisplayString(job.tmdb_id) + " · TmdbEg " + _toDisplayString(job.episode_group_id) + " · 已尝试 " + _toDisplayString(job.attempts || 0) + " 次", 1),
                                _createElementVNode("div", _hoisted_44, _toDisplayString(job.reason), 1),
                                _createElementVNode("div", {
                                  class: "text-caption text-medium-emphasis text-truncate mt-1",
                                  title: job.target_path
                                }, _toDisplayString(job.target_path), 9, _hoisted_45),
                                (Object.keys(job.server_results || {}).length)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_46, [
                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(job.server_results, (result, server) => {
                                        return (_openBlock(), _createBlock(_component_VChip, {
                                          key: server,
                                          size: "x-small",
                                          color: embyResultColor(result.status),
                                          variant: "tonal",
                                          title: result.reason
                                        }, {
                                          default: _withCtx(() => [
                                            _createTextVNode(_toDisplayString(server) + " · " + _toDisplayString(embyResultText(result.status)), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["color", "title"]))
                                      }), 128))
                                    ]))
                                  : _createCommentVNode("", true)
                              ]),
                              _createElementVNode("div", _hoisted_47, [
                                _createVNode(_component_VBtn, {
                                  icon: "mdi-replay",
                                  variant: "text",
                                  title: "重新检查",
                                  onClick: $event => (retryEmbyJob(job.id))
                                }, null, 8, ["onClick"]),
                                _createVNode(_component_VBtn, {
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
            : (_openBlock(), _createElementBlock("div", _hoisted_48, [
                _createVNode(_component_VIcon, {
                  icon: "mdi-server-network-off",
                  size: "48"
                }),
                _cache[85] || (_cache[85] = _createElementVNode("div", null, "尚无剧集组联动任务", -1)),
                _cache[86] || (_cache[86] = _createElementVNode("div", { class: "text-caption" }, "启用后，下一次实际使用剧集组规则整理时会自动建立任务。", -1))
              ]))
        ]),
        _: 1
      })
    ], 512), [
      [_vShow, subModule.value === 'emby']
    ]),
    _createVNode(_component_VDialog, {
      modelValue: manualDialog.value,
      "onUpdate:modelValue": _cache[37] || (_cache[37] = $event => ((manualDialog).value = $event)),
      "max-width": "620"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCard, null, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, null, {
              append: _withCtx(() => [
                _createVNode(_component_VBtn, {
                  icon: "mdi-close",
                  variant: "text",
                  onClick: _cache[30] || (_cache[30] = $event => (manualDialog.value = false))
                })
              ]),
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [...(_cache[87] || (_cache[87] = [
                    _createTextVNode("手动添加维护规则", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [...(_cache[88] || (_cache[88] = [
                    _createTextVNode("适用于季度看板中没有收录的电视剧或动画", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardText, { class: "manual-rule-form" }, {
              default: _withCtx(() => [
                (manualMessage.value)
                  ? (_openBlock(), _createBlock(_component_VAlert, {
                      key: 0,
                      type: "warning",
                      variant: "tonal",
                      density: "compact",
                      class: "mb-4"
                    }, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(manualMessage.value), 1)
                      ]),
                      _: 1
                    }))
                  : _createCommentVNode("", true),
                _createVNode(_component_VTextField, {
                  modelValue: manualForm.value.tmdb_id,
                  "onUpdate:modelValue": _cache[31] || (_cache[31] = $event => ((manualForm.value.tmdb_id) = $event)),
                  modelModifiers: { number: true },
                  label: "TMDBID",
                  type: "number",
                  "prepend-inner-icon": "mdi-database-search",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VSelect, {
                  modelValue: manualForm.value.preference,
                  "onUpdate:modelValue": _cache[32] || (_cache[32] = $event => ((manualForm.value.preference) = $event)),
                  label: "目标编集",
                  items: [{title:'使用 TMDB 默认编集',value:'default'},{title:'优先 Production/Season 剧集组',value:'group_preferred'}],
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VSwitch, {
                  modelValue: manualForm.value.specify_quarter,
                  "onUpdate:modelValue": _cache[33] || (_cache[33] = $event => ((manualForm.value.specify_quarter) = $event)),
                  label: "手动指定归属季度",
                  color: "primary",
                  "hide-details": "",
                  class: "mb-3"
                }, null, 8, ["modelValue"]),
                (manualForm.value.specify_quarter)
                  ? (_openBlock(), _createBlock(_component_VRow, {
                      key: 1,
                      dense: ""
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VCol, { cols: "7" }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VSelect, {
                              modelValue: manualForm.value.year,
                              "onUpdate:modelValue": _cache[34] || (_cache[34] = $event => ((manualForm.value.year) = $event)),
                              items: _unref(years),
                              label: "年份"
                            }, null, 8, ["modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        _createVNode(_component_VCol, { cols: "5" }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VSelect, {
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
                  : _createCommentVNode("", true),
                _cache[89] || (_cache[89] = _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, " 不指定时会根据 TMDB 最新有效季的首播日期自动归类；TMDB 缺少日期时会提示补充。 ", -1))
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardActions, { class: "pa-4" }, {
              default: _withCtx(() => [
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[36] || (_cache[36] = $event => (manualDialog.value = false))
                }, {
                  default: _withCtx(() => [...(_cache[90] || (_cache[90] = [
                    _createTextVNode("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  loading: manualLoading.value,
                  disabled: !manualForm.value.tmdb_id,
                  onClick: manualAddRule
                }, {
                  default: _withCtx(() => [...(_cache[91] || (_cache[91] = [
                    _createTextVNode("读取并加入", -1)
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
    _createVNode(_component_VDialog, {
      modelValue: deleteRulesDialog.value,
      "onUpdate:modelValue": _cache[39] || (_cache[39] = $event => ((deleteRulesDialog).value = $event)),
      "max-width": "520"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCard, null, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, null, {
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [...(_cache[92] || (_cache[92] = [
                    _createTextVNode("删除当前筛选结果？", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [
                    _createTextVNode("将删除 " + _toDisplayString(filteredRules.value.length) + " 条维护规则，季度看板数据不会被删除", 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VCardText, null, {
              default: _withCtx(() => [...(_cache[93] || (_cache[93] = [
                _createTextVNode("此操作会立即停止这些 TMDB 条目的集数偏移，请确认当前季度和搜索条件正确。", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VCardActions, { class: "pa-4" }, {
              default: _withCtx(() => [
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[38] || (_cache[38] = $event => (deleteRulesDialog.value = false))
                }, {
                  default: _withCtx(() => [...(_cache[94] || (_cache[94] = [
                    _createTextVNode("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VBtn, {
                  color: "error",
                  loading: deleteRulesLoading.value,
                  onClick: deleteFilteredRules
                }, {
                  default: _withCtx(() => [...(_cache[95] || (_cache[95] = [
                    _createTextVNode("确认删除", -1)
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
    _createVNode(_component_VDialog, {
      modelValue: editorOpen.value,
      "onUpdate:modelValue": _cache[46] || (_cache[46] = $event => ((editorOpen).value = $event)),
      "max-width": "820",
      scrollable: ""
    }, {
      default: _withCtx(() => [
        (editForm.value)
          ? (_openBlock(), _createBlock(_component_VCard, { key: 0 }, {
              default: _withCtx(() => [
                _createVNode(_component_VCardItem, null, {
                  append: _withCtx(() => [
                    _createVNode(_component_VBtn, {
                      icon: "mdi-close",
                      variant: "text",
                      onClick: _cache[40] || (_cache[40] = $event => (editorOpen.value = false))
                    })
                  ]),
                  default: _withCtx(() => [
                    _createVNode(_component_VCardTitle, null, {
                      default: _withCtx(() => [...(_cache[96] || (_cache[96] = [
                        _createTextVNode("编辑维护规则", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode(_component_VCardSubtitle, null, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(editForm.value.title) + " · TMDB " + _toDisplayString(editForm.value.tmdb_id), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode(_component_VDivider),
                _createVNode(_component_VCardText, null, {
                  default: _withCtx(() => [
                    _createElementVNode("div", _hoisted_49, [
                      _createVNode(_component_VSwitch, {
                        modelValue: editForm.value.enabled,
                        "onUpdate:modelValue": _cache[41] || (_cache[41] = $event => ((editForm.value.enabled) = $event)),
                        label: "启用规则",
                        color: "success",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode(_component_VSpacer),
                      _createVNode(_component_VBtn, {
                        variant: "tonal",
                        "prepend-icon": "mdi-refresh",
                        loading: editorLoading.value,
                        onClick: inspectTarget
                      }, {
                        default: _withCtx(() => [...(_cache[97] || (_cache[97] = [
                          _createTextVNode("刷新编集", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _createElementVNode("div", _hoisted_50, [
                      _createVNode(_component_VTextField, {
                        modelValue: editForm.value.tmdb_id,
                        "onUpdate:modelValue": _cache[42] || (_cache[42] = $event => ((editForm.value.tmdb_id) = $event)),
                        modelModifiers: { number: true },
                        label: "TMDBID",
                        type: "number",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode(_component_VBtn, {
                        variant: "tonal",
                        "prepend-icon": "mdi-database-search",
                        loading: editorLoading.value,
                        onClick: inspectTarget
                      }, {
                        default: _withCtx(() => [...(_cache[98] || (_cache[98] = [
                          _createTextVNode("读取并校验", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    (Number(editForm.value.original_tmdb_id) !== Number(editForm.value.tmdb_id))
                      ? (_openBlock(), _createBlock(_component_VAlert, {
                          key: 0,
                          type: "warning",
                          variant: "tonal",
                          density: "compact",
                          class: "mb-4"
                        }, {
                          default: _withCtx(() => [
                            _createTextVNode("保存后将用 TMDB " + _toDisplayString(editForm.value.tmdb_id) + " 替换原规则 TMDB " + _toDisplayString(editForm.value.original_tmdb_id), 1)
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode("", true),
                    (inspection.value?.recommendation)
                      ? (_openBlock(), _createBlock(_component_VAlert, {
                          key: 1,
                          type: "info",
                          variant: "tonal",
                          density: "compact",
                          class: "mb-3"
                        }, {
                          default: _withCtx(() => [
                            _createElementVNode("div", _hoisted_51, [
                              _createElementVNode("span", _hoisted_52, [
                                _createElementVNode("strong", null, "智能建议：" + _toDisplayString(inspection.value.recommendation.target_type === 'group' ? '剧集组' : 'TMDB 默认编集'), 1),
                                _createTextVNode(" · " + _toDisplayString(inspection.value.recommendation.reason), 1)
                              ]),
                              _createVNode(_component_VBtn, {
                                size: "small",
                                variant: "tonal",
                                onClick: applyTargetRecommendation
                              }, {
                                default: _withCtx(() => [...(_cache[99] || (_cache[99] = [
                                  _createTextVNode("采用建议", -1)
                                ]))]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode("", true),
                    _createVNode(_component_VRadioGroup, {
                      modelValue: editForm.value.target_type,
                      "onUpdate:modelValue": _cache[43] || (_cache[43] = $event => ((editForm.value.target_type) = $event)),
                      "hide-details": ""
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VRadio, {
                          value: "default",
                          label: "TMDB 默认编集"
                        }),
                        _createVNode(_component_VRadio, {
                          value: "group",
                          label: "TMDB 剧集组"
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    (editForm.value.target_type === 'group')
                      ? (_openBlock(), _createBlock(_component_VSelect, {
                          key: 2,
                          modelValue: editForm.value.episode_group_id,
                          "onUpdate:modelValue": _cache[44] || (_cache[44] = $event => ((editForm.value.episode_group_id) = $event)),
                          class: "mt-3",
                          items: (inspection.value?.groups || []).map(group => ({ title: `${group.recommended ? '推荐 · ' : ''}${group.name} · ${groupType(group.type)} · ${group.episode_count} 集`, value: group.id })),
                          label: "目标剧集组"
                        }, null, 8, ["modelValue", "items"]))
                      : _createCommentVNode("", true),
                    (selectedGroup.value)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_53, [
                          _createElementVNode("div", _hoisted_54, [
                            _cache[101] || (_cache[101] = _createElementVNode("strong", null, "分季预览", -1)),
                            _createVNode(_component_VChip, {
                              size: "x-small",
                              variant: "tonal"
                            }, {
                              default: _withCtx(() => [
                                _createTextVNode(_toDisplayString(selectedGroup.value.seasons?.filter(item => !item.is_special).length || 0) + " 个常规季", 1)
                              ]),
                              _: 1
                            }),
                            (selectedGroup.value.seasons?.some(item => item.is_special))
                              ? (_openBlock(), _createBlock(_component_VChip, {
                                  key: 0,
                                  size: "x-small",
                                  color: "secondary",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx(() => [...(_cache[100] || (_cache[100] = [
                                    _createTextVNode("包含 Special", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode("", true),
                            (selectedGroup.value.coverage)
                              ? (_openBlock(), _createBlock(_component_VChip, {
                                  key: 1,
                                  size: "x-small",
                                  variant: "outlined"
                                }, {
                                  default: _withCtx(() => [
                                    _createTextVNode("正片覆盖 " + _toDisplayString(selectedGroup.value.coverage) + "%", 1)
                                  ]),
                                  _: 1
                                }))
                              : _createCommentVNode("", true)
                          ]),
                          _createElementVNode("div", _hoisted_55, [
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(selectedGroup.value.seasons || [], (season) => {
                              return (_openBlock(), _createElementBlock("div", {
                                key: season.season,
                                class: _normalizeClass(['group-season-item', { special: season.is_special }])
                              }, [
                                _createElementVNode("div", _hoisted_56, [
                                  _createElementVNode("strong", null, "S" + _toDisplayString(String(season.season).padStart(2, '0')), 1),
                                  (season.is_special)
                                    ? (_openBlock(), _createBlock(_component_VChip, {
                                        key: 0,
                                        size: "x-small",
                                        color: "secondary"
                                      }, {
                                        default: _withCtx(() => [...(_cache[102] || (_cache[102] = [
                                          _createTextVNode("Special", -1)
                                        ]))]),
                                        _: 1
                                      }))
                                    : _createCommentVNode("", true),
                                  _createElementVNode("span", _hoisted_57, _toDisplayString(season.name), 1)
                                ]),
                                _createElementVNode("div", _hoisted_58, _toDisplayString(season.episode_count) + " 集 · E" + _toDisplayString(String(season.first_episode || 1).padStart(2, '0')) + "–E" + _toDisplayString(String(season.last_episode || season.episode_count).padStart(2, '0')), 1),
                                (season.first_air_date || season.last_air_date)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_59, [
                                      _createTextVNode(_toDisplayString(season.first_air_date || '日期未知'), 1),
                                      (season.last_air_date && season.last_air_date !== season.first_air_date)
                                        ? (_openBlock(), _createElementBlock("span", _hoisted_60, " → " + _toDisplayString(season.last_air_date), 1))
                                        : _createCommentVNode("", true)
                                    ]))
                                  : _createCommentVNode("", true)
                              ], 2))
                            }), 128))
                          ])
                        ]))
                      : _createCommentVNode("", true),
                    _createElementVNode("div", _hoisted_61, [
                      _cache[104] || (_cache[104] = _createElementVNode("strong", null, "季度片段", -1)),
                      _createVNode(_component_VSpacer),
                      _createVNode(_component_VBtn, {
                        size: "small",
                        variant: "tonal",
                        "prepend-icon": "mdi-plus",
                        onClick: addInstallment
                      }, {
                        default: _withCtx(() => [...(_cache[103] || (_cache[103] = [
                          _createTextVNode("添加", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _createVNode(_component_VExpansionPanels, { variant: "accordion" }, {
                      default: _withCtx(() => [
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(editForm.value.installments, (item, index) => {
                          return (_openBlock(), _createBlock(_component_VExpansionPanel, {
                            key: item.id || index
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VExpansionPanelTitle, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(item.title || `季度片段 ${index + 1}`) + " · S" + _toDisplayString(item.target_start_season) + "E" + _toDisplayString(item.target_start_episode), 1)
                                ]),
                                _: 2
                              }, 1024),
                              _createVNode(_component_VExpansionPanelText, null, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VRow, { dense: "" }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VCol, {
                                        cols: "12",
                                        sm: "6"
                                      }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VTextField, {
                                            modelValue: item.title,
                                            "onUpdate:modelValue": $event => ((item.title) = $event),
                                            label: "片段名称"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode(_component_VCol, {
                                        cols: "12",
                                        sm: "3"
                                      }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VTextField, {
                                            modelValue: item.quarter,
                                            "onUpdate:modelValue": $event => ((item.quarter) = $event),
                                            label: "季度"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode(_component_VCol, {
                                        cols: "12",
                                        sm: "3"
                                      }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VTextField, {
                                            modelValue: item.source_season,
                                            "onUpdate:modelValue": $event => ((item.source_season) = $event),
                                            label: "来源季",
                                            type: "number"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode(_component_VCol, { cols: "12" }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VTextarea, {
                                            modelValue: item.aliases,
                                            "onUpdate:modelValue": $event => ((item.aliases) = $event),
                                            label: "命中别名（每行一个）",
                                            rows: "2",
                                            "auto-grow": ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode(_component_VCol, {
                                        cols: "12",
                                        sm: "4"
                                      }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VTextField, {
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
                                      _createVNode(_component_VCol, {
                                        cols: "6",
                                        sm: "4"
                                      }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VTextField, {
                                            modelValue: item.target_start_season,
                                            "onUpdate:modelValue": $event => ((item.target_start_season) = $event),
                                            label: "目标起始季",
                                            type: "number"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode(_component_VCol, {
                                        cols: "6",
                                        sm: "4"
                                      }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VTextField, {
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
                                  _createVNode(_component_VBtn, {
                                    color: "error",
                                    variant: "text",
                                    "prepend-icon": "mdi-delete-outline",
                                    onClick: $event => (editForm.value.installments.splice(index, 1))
                                  }, {
                                    default: _withCtx(() => [...(_cache[105] || (_cache[105] = [
                                      _createTextVNode("删除片段", -1)
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
                _createVNode(_component_VDivider),
                _createVNode(_component_VCardActions, { class: "pa-4" }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VSpacer),
                    _createVNode(_component_VBtn, {
                      variant: "text",
                      onClick: _cache[45] || (_cache[45] = $event => (editorOpen.value = false))
                    }, {
                      default: _withCtx(() => [...(_cache[106] || (_cache[106] = [
                        _createTextVNode("取消", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode(_component_VBtn, {
                      color: "primary",
                      loading: editorLoading.value,
                      onClick: saveRule
                    }, {
                      default: _withCtx(() => [...(_cache[107] || (_cache[107] = [
                        _createTextVNode("保存规则", -1)
                      ]))]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : _createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode(_component_VDialog, {
      modelValue: failureDialog.value,
      "onUpdate:modelValue": _cache[48] || (_cache[48] = $event => ((failureDialog).value = $event)),
      "max-width": "720"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCard, null, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, null, {
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [...(_cache[108] || (_cache[108] = [
                    _createTextVNode("这些番剧未能自动匹配", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [...(_cache[109] || (_cache[109] = [
                    _createTextVNode("补充正确 TMDBID 后重试，或直接放弃该条目", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VList, { lines: "three" }, {
              default: _withCtx(() => [
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(failures.value, (failure) => {
                  return (_openBlock(), _createBlock(_component_VListItem, {
                    key: failure.id,
                    title: failure.title,
                    subtitle: failure.reason
                  }, {
                    append: _withCtx(() => [
                      _createElementVNode("div", _hoisted_62, [
                        _createVNode(_component_VTextField, {
                          modelValue: manualTmdb.value[failure.id],
                          "onUpdate:modelValue": $event => ((manualTmdb.value[failure.id]) = $event),
                          label: "TMDBID",
                          type: "number",
                          "hide-details": "",
                          density: "compact"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        _createVNode(_component_VBtn, {
                          color: "primary",
                          variant: "tonal",
                          loading: busyId.value === failure.id,
                          onClick: $event => (retryFailure(failure))
                        }, {
                          default: _withCtx(() => [...(_cache[110] || (_cache[110] = [
                            _createTextVNode("补充并加入", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading", "onClick"]),
                        _createVNode(_component_VBtn, {
                          variant: "text",
                          color: "medium-emphasis",
                          onClick: $event => (ignoreFailure(failure))
                        }, {
                          default: _withCtx(() => [...(_cache[111] || (_cache[111] = [
                            _createTextVNode("忽略", -1)
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
            _createVNode(_component_VCardActions, null, {
              default: _withCtx(() => [
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  onClick: _cache[47] || (_cache[47] = $event => (failureDialog.value = false))
                }, {
                  default: _withCtx(() => [...(_cache[112] || (_cache[112] = [
                    _createTextVNode("关闭", -1)
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
    _createVNode(_component_VSnackbar, {
      modelValue: snackbar.value,
      "onUpdate:modelValue": _cache[49] || (_cache[49] = $event => ((snackbar).value = $event)),
      color: snackbarColor.value,
      timeout: "5000"
    }, {
      default: _withCtx(() => [
        _createTextVNode(_toDisplayString(notice.value), 1)
      ]),
      _: 1
    }, 8, ["modelValue", "color"])
  ]))
}
}

};
const EpisodeNormalizer = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-b763ccf2"]]);

export { EpisodeNormalizer as default };
