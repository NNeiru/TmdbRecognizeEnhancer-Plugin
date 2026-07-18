import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { S as StrategySettings } from './StrategySettings-CHy4gxB0.js';
import { _ as _export_sfc, u as unwrapResponse, c as cloneConfig, U as UI_VERSION, m as mediaTypeText, s as scoreColor, e as ensureUiVersion } from './utils-CHJBX6dL.js';

const {toDisplayString:_toDisplayString$3,createTextVNode:_createTextVNode$3,resolveComponent:_resolveComponent$3,withCtx:_withCtx$3,openBlock:_openBlock$3,createBlock:_createBlock$3,createCommentVNode:_createCommentVNode$3,createElementVNode:_createElementVNode$3,createElementBlock:_createElementBlock$3,createVNode:_createVNode$3,renderList:_renderList$3,Fragment:_Fragment$3,normalizeClass:_normalizeClass$1,unref:_unref$1,mergeProps:_mergeProps} = await importShared('vue');


const _hoisted_1$3 = { class: "episode-normalizer" };
const _hoisted_2$3 = { key: 0 };
const _hoisted_3$3 = { key: 1 };
const _hoisted_4$3 = {
  key: 0,
  class: "rules-scroll"
};
const _hoisted_5$2 = { class: "rules-controls pa-4 pt-4" };
const _hoisted_6$2 = { class: "rule-group-title mb-2" };
const _hoisted_7$2 = { class: "text-caption text-medium-emphasis" };
const _hoisted_8$2 = { class: "flex-grow-1 min-w-0" };
const _hoisted_9$2 = { class: "font-weight-bold text-truncate" };
const _hoisted_10$2 = { class: "text-caption text-medium-emphasis" };
const _hoisted_11$2 = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mt-1"
};
const _hoisted_12$2 = {
  key: 0,
  class: "empty-rules"
};
const _hoisted_13$2 = { class: "d-flex align-center ga-2" };
const _hoisted_14$2 = { class: "board-controls mb-3" };
const _hoisted_15$2 = { class: "batch-bar mb-4" };
const _hoisted_16$2 = { class: "text-caption text-medium-emphasis mb-3" };
const _hoisted_17$2 = { key: 0 };
const _hoisted_18$2 = { key: 1 };
const _hoisted_19$2 = { class: "select-corner" };
const _hoisted_20$2 = { class: "d-flex flex-wrap ga-1" };
const _hoisted_21$2 = {
  key: 0,
  class: "text-caption text-medium-emphasis mt-2"
};
const _hoisted_22$2 = {
  key: 0,
  class: "empty-catalog"
};
const _hoisted_23$2 = { class: "d-flex align-center ga-3 mb-4" };
const _hoisted_24$2 = { class: "tmdb-correction mb-4" };
const _hoisted_25$2 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_26$2 = { class: "flex-grow-1" };
const _hoisted_27$2 = {
  key: 3,
  class: "group-preview mb-4"
};
const _hoisted_28$2 = { class: "d-flex align-center flex-wrap ga-2 mb-2" };
const _hoisted_29$2 = { class: "group-season-grid" };
const _hoisted_30$2 = { class: "d-flex align-center ga-2" };
const _hoisted_31$2 = { class: "text-truncate" };
const _hoisted_32$2 = { class: "text-caption text-medium-emphasis mt-1" };
const _hoisted_33$2 = {
  key: 0,
  class: "text-caption text-medium-emphasis"
};
const _hoisted_34$2 = { key: 0 };
const _hoisted_35$2 = { class: "d-flex align-center mb-2" };
const _hoisted_36$2 = { class: "manual-match" };

const {computed: computed$3,onActivated,onBeforeUnmount,onDeactivated,onMounted: onMounted$2,ref: ref$3,watch: watch$1} = await importShared('vue');

const uiStateKey = 'tmdbrecognizeenhancer:episode-normalizer-ui:v1';

const _sfc_main$3 = {
  __name: 'EpisodeNormalizer',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginBase: { type: String, required: true },
  runtimeStatus: { type: Object, default: () => ({}) },
},
  setup(__props) {

const props = __props;

const now = new Date();
const years = Array.from({ length: now.getFullYear() - 1999 }, (_, index) => now.getFullYear() + 1 - index);
const error = ref$3('');
const notice = ref$3('');
const snackbar = ref$3(false);
const rules = ref$3([]);
const rulesOpen = ref$3(true);
const ruleView = ref$3('grid');
const ruleSearch = ref$3('');
const ruleQuarter = ref$3('all');
const deleteRulesDialog = ref$3(false);
const deleteRulesLoading = ref$3(false);
const manualDialog = ref$3(false);
const manualLoading = ref$3(false);
const manualMessage = ref$3('');
const manualForm = ref$3({
  tmdb_id: '', preference: 'default', specify_quarter: false,
  year: now.getFullYear(), quarter: Math.floor(now.getMonth() / 3) + 1,
});
const catalog = ref$3([]);
const catalogLoading = ref$3(false);
const batchLoading = ref$3(false);
const busyId = ref$3('');
const selectedIds = ref$3([]);
const catalogMeta = ref$3({});
const board = ref$3({
  year: now.getFullYear(),
  quarter: Math.floor(now.getMonth() / 3) + 1,
  search: '',
  region: 'all',
  platform: 'all',
  scanStatus: 'all',
  multiOnly: false,
});
const batchPreference = ref$3('default');
const boardView = ref$3('grid');
const editorOpen = ref$3(false);
const editorLoading = ref$3(false);
const inspection = ref$3(null);
const editForm = ref$3(null);
const failureDialog = ref$3(false);
const failures = ref$3([]);
const manualTmdb = ref$3({});
let scanTimer = null;
let persistTimer = null;
let initialized = false;
let componentActive = true;

const quarterKey = computed$3(() => `${board.value.year}-Q${board.value.quarter}`);
const platforms = computed$3(() => [
  { title: '全部载体', value: 'all' },
  ...Array.from(new Set(catalog.value.map(item => item.platform).filter(Boolean)))
    .sort()
    .map(value => ({ title: value, value })),
]);
const filteredCatalog = computed$3(() => {
  const keyword = String(board.value.search || '').trim().toLocaleLowerCase();
  return catalog.value.filter(item => {
    if (board.value.region !== 'all' && item.region !== board.value.region) return false
    if (board.value.platform !== 'all' && item.platform !== board.value.platform) return false
    if (board.value.scanStatus !== 'all' && item.scan_status !== board.value.scanStatus) return false
    if (board.value.multiOnly && !item.is_multi_season) return false
    if (!keyword) return true
    return [item.name, item.name_cn, ...(item.aliases || [])]
      .join(' ')
      .toLocaleLowerCase()
      .includes(keyword)
  })
});
const selectedIdSet = computed$3(() => new Set(selectedIds.value));
const allFilteredSelected = computed$3(() => (
  filteredCatalog.value.length > 0
  && filteredCatalog.value.every(item => selectedIdSet.value.has(item.id))
));
const ruleByTmdbId = computed$3(() => new Map(
  rules.value.map(rule => [Number(rule.tmdb_id), rule]),
));
const selectedGroup = computed$3(() => inspection.value?.groups?.find(
  item => item.id === editForm.value?.episode_group_id,
));
const ruleQuarterOptions = computed$3(() => {
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
const filteredRules = computed$3(() => {
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
const groupedRules = computed$3(() => {
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
    notice.value = `${data.title || `TMDB ${data.tmdb_id}`} 已加入${data.quarter ? ` ${data.quarter}` : ''} 维护规则`;
    snackbar.value = true;
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
    notice.value = `已删除 ${data.deleted || deletedIds.size} 条维护规则`;
    snackbar.value = true;
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
    notice.value = data.message || `${item.display_name || item.name_cn || item.name} 已加入维护规则`;
    snackbar.value = true;
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
    notice.value = `已加入 ${data.added?.length || 0} 条${attention ? `，其中 ${attention} 条需要补充季度起点` : ''}`;
    snackbar.value = true;
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
    notice.value = '维护规则已保存';
    snackbar.value = true;
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
watch$1(() => [board.value.year, board.value.quarter], () => loadQuarter(false));
watch$1(
  [board, ruleSearch, ruleQuarter, batchPreference, rulesOpen, ruleView, boardView],
  schedulePersistUiState,
  { deep: true },
);
onActivated(() => {
  componentActive = true;
  if (initialized) loadQuarter(false, true);
});
onDeactivated(() => {
  componentActive = false;
  if (scanTimer) clearTimeout(scanTimer);
  scanTimer = null;
});
onBeforeUnmount(() => {
  if (scanTimer) clearTimeout(scanTimer);
  if (persistTimer) clearTimeout(persistTimer);
});
onMounted$2(async () => {
  try {
    await Promise.all([loadRules(), loadQuarter(false)]);
    initialized = true;
  } catch (err) {
    error.value = err?.message || '集数偏移数据加载失败';
  }
});

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent$3("VAlert");
  const _component_VIcon = _resolveComponent$3("VIcon");
  const _component_VAvatar = _resolveComponent$3("VAvatar");
  const _component_VCardTitle = _resolveComponent$3("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$3("VCardSubtitle");
  const _component_VBtn = _resolveComponent$3("VBtn");
  const _component_VCardItem = _resolveComponent$3("VCardItem");
  const _component_VTextField = _resolveComponent$3("VTextField");
  const _component_VSelect = _resolveComponent$3("VSelect");
  const _component_VBtnToggle = _resolveComponent$3("VBtnToggle");
  const _component_VChip = _resolveComponent$3("VChip");
  const _component_VCardText = _resolveComponent$3("VCardText");
  const _component_VCard = _resolveComponent$3("VCard");
  const _component_VExpandTransition = _resolveComponent$3("VExpandTransition");
  const _component_VSwitch = _resolveComponent$3("VSwitch");
  const _component_VCheckbox = _resolveComponent$3("VCheckbox");
  const _component_VSpacer = _resolveComponent$3("VSpacer");
  const _component_VProgressLinear = _resolveComponent$3("VProgressLinear");
  const _component_VImg = _resolveComponent$3("VImg");
  const _component_VProgressCircular = _resolveComponent$3("VProgressCircular");
  const _component_VListItem = _resolveComponent$3("VListItem");
  const _component_VList = _resolveComponent$3("VList");
  const _component_VMenu = _resolveComponent$3("VMenu");
  const _component_VCardActions = _resolveComponent$3("VCardActions");
  const _component_VDivider = _resolveComponent$3("VDivider");
  const _component_VCol = _resolveComponent$3("VCol");
  const _component_VRow = _resolveComponent$3("VRow");
  const _component_VDialog = _resolveComponent$3("VDialog");
  const _component_VRadio = _resolveComponent$3("VRadio");
  const _component_VRadioGroup = _resolveComponent$3("VRadioGroup");
  const _component_VExpansionPanelTitle = _resolveComponent$3("VExpansionPanelTitle");
  const _component_VTextarea = _resolveComponent$3("VTextarea");
  const _component_VExpansionPanelText = _resolveComponent$3("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent$3("VExpansionPanel");
  const _component_VExpansionPanels = _resolveComponent$3("VExpansionPanels");
  const _component_VSnackbar = _resolveComponent$3("VSnackbar");

  return (_openBlock$3(), _createElementBlock$3("div", _hoisted_1$3, [
    (error.value)
      ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          closable: "",
          class: "mb-4",
          "onClick:close": _cache[0] || (_cache[0] = $event => (error.value = ''))
        }, {
          default: _withCtx$3(() => [
            _createTextVNode$3(_toDisplayString$3(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$3("", true),
    (!__props.runtimeStatus.runtime_compatible || !__props.runtimeStatus.plugin_first)
      ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
          key: 1,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: _withCtx$3(() => [
            _cache[37] || (_cache[37] = _createElementVNode$3("div", { class: "font-weight-bold" }, "集数偏移暂不能接管实际整理", -1)),
            (!__props.runtimeStatus.runtime_compatible)
              ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_2$3, _toDisplayString$3(__props.runtimeStatus.runtime_message), 1))
              : _createCommentVNode$3("", true),
            (!__props.runtimeStatus.plugin_first)
              ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_3$3, "请在 MoviePilot 中开启“识别插件优先”。"))
              : _createCommentVNode$3("", true)
          ]),
          _: 1
        }))
      : _createCommentVNode$3("", true),
    _createVNode$3(_component_VCard, {
      variant: "outlined",
      class: "normalizer-card mb-4"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCardItem, null, {
          prepend: _withCtx$3(() => [
            _createVNode$3(_component_VAvatar, {
              color: "success",
              variant: "tonal"
            }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VIcon, { icon: "mdi-playlist-check" })
              ]),
              _: 1
            })
          ]),
          append: _withCtx$3(() => [
            _createVNode$3(_component_VBtn, {
              icon: rulesOpen.value ? 'mdi-chevron-up' : 'mdi-chevron-down',
              variant: "text",
              title: rulesOpen.value ? '收起规则' : '展开规则',
              onClick: _cache[1] || (_cache[1] = $event => (rulesOpen.value = !rulesOpen.value))
            }, null, 8, ["icon", "title"])
          ]),
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardTitle, null, {
              default: _withCtx$3(() => [...(_cache[38] || (_cache[38] = [
                _createTextVNode$3("已维护规则", -1)
              ]))]),
              _: 1
            }),
            _createVNode$3(_component_VCardSubtitle, null, {
              default: _withCtx$3(() => [
                _createTextVNode$3(_toDisplayString$3(rules.value.length) + " 个 TMDB 条目；规则固定显示在季度看板前", 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$3(_component_VExpandTransition, null, {
          default: _withCtx$3(() => [
            (rulesOpen.value)
              ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_4$3, [
                  _createElementVNode$3("div", _hoisted_5$2, [
                    _createVNode$3(_component_VTextField, {
                      modelValue: ruleSearch.value,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((ruleSearch).value = $event)),
                      label: "搜索标题、别名或 TMDBID",
                      "prepend-inner-icon": "mdi-magnify",
                      clearable: "",
                      "hide-details": "",
                      density: "compact"
                    }, null, 8, ["modelValue"]),
                    _createVNode$3(_component_VSelect, {
                      modelValue: ruleQuarter.value,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((ruleQuarter).value = $event)),
                      items: ruleQuarterOptions.value,
                      label: "按季度查看",
                      "hide-details": "",
                      density: "compact"
                    }, null, 8, ["modelValue", "items"]),
                    _createVNode$3(_component_VBtnToggle, {
                      modelValue: ruleView.value,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((ruleView).value = $event)),
                      mandatory: "",
                      density: "compact",
                      variant: "outlined",
                      divided: ""
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VBtn, {
                          value: "grid",
                          icon: "mdi-view-grid-outline",
                          title: "平铺"
                        }),
                        _createVNode$3(_component_VBtn, {
                          value: "list",
                          icon: "mdi-view-list-outline",
                          title: "列表"
                        }),
                        _createVNode$3(_component_VBtn, {
                          value: "compact",
                          icon: "mdi-view-headline",
                          title: "紧凑"
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    _createVNode$3(_component_VBtn, {
                      color: "primary",
                      variant: "tonal",
                      "prepend-icon": "mdi-plus",
                      onClick: openManualDialog
                    }, {
                      default: _withCtx$3(() => [...(_cache[39] || (_cache[39] = [
                        _createTextVNode$3("手动添加", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$3(_component_VBtn, {
                      color: "error",
                      variant: "tonal",
                      "prepend-icon": "mdi-delete-sweep-outline",
                      disabled: !filteredRules.value.length,
                      onClick: _cache[5] || (_cache[5] = $event => (deleteRulesDialog.value = true))
                    }, {
                      default: _withCtx$3(() => [
                        _createTextVNode$3("删除当前结果 " + _toDisplayString$3(filteredRules.value.length || ''), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ]),
                  (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(groupedRules.value, (group) => {
                    return (_openBlock$3(), _createElementBlock$3("div", {
                      key: group.quarter,
                      class: "rule-group px-4 pb-4"
                    }, [
                      _createElementVNode$3("div", _hoisted_6$2, [
                        _createVNode$3(_component_VIcon, {
                          icon: "mdi-calendar-month-outline",
                          size: "18"
                        }),
                        _createElementVNode$3("strong", null, _toDisplayString$3(group.quarter), 1),
                        _createElementVNode$3("span", _hoisted_7$2, _toDisplayString$3(group.items.length) + " 条", 1)
                      ]),
                      _createElementVNode$3("div", {
                        class: _normalizeClass$1(['rules-grid', `view-${ruleView.value}`])
                      }, [
                        (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(group.items, (rule) => {
                          return (_openBlock$3(), _createBlock$3(_component_VCard, {
                            key: rule.tmdb_id,
                            variant: "tonal",
                            class: "rule-card"
                          }, {
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VCardText, { class: "d-flex align-center ga-3" }, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VAvatar, {
                                    color: rule.enabled ? 'success' : 'default',
                                    variant: "tonal"
                                  }, {
                                    default: _withCtx$3(() => [
                                      _createVNode$3(_component_VIcon, { icon: "mdi-animation-outline" })
                                    ]),
                                    _: 1
                                  }, 8, ["color"]),
                                  _createElementVNode$3("div", _hoisted_8$2, [
                                    _createElementVNode$3("div", _hoisted_9$2, _toDisplayString$3(rule.title), 1),
                                    _createElementVNode$3("div", _hoisted_10$2, "TMDB " + _toDisplayString$3(rule.tmdb_id) + " · " + _toDisplayString$3(rule.target_type === 'group' ? '剧集组' : '默认编集') + " · " + _toDisplayString$3(rule.installments?.length || 0) + " 个季度片段", 1),
                                    (rule.installments?.some(item => item.quarter))
                                      ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_11$2, [
                                          (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(Array.from(new Set(rule.installments.map(item => item.quarter).filter(Boolean))).sort().reverse(), (quarter) => {
                                            return (_openBlock$3(), _createBlock$3(_component_VChip, {
                                              key: quarter,
                                              size: "x-small",
                                              variant: "outlined"
                                            }, {
                                              default: _withCtx$3(() => [
                                                _createTextVNode$3(_toDisplayString$3(quarter), 1)
                                              ]),
                                              _: 2
                                            }, 1024))
                                          }), 128))
                                        ]))
                                      : _createCommentVNode$3("", true)
                                  ]),
                                  _createVNode$3(_component_VBtn, {
                                    icon: "mdi-pencil-outline",
                                    variant: "text",
                                    onClick: $event => (openEditor(rule))
                                  }, null, 8, ["onClick"]),
                                  _createVNode$3(_component_VBtn, {
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
                    ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_12$2, "当前季度或搜索条件下没有维护规则。"))
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
      class: "normalizer-card mb-4"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCardItem, null, {
          prepend: _withCtx$3(() => [
            _createVNode$3(_component_VAvatar, {
              color: "secondary",
              variant: "tonal"
            }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VIcon, { icon: "mdi-view-dashboard-outline" })
              ]),
              _: 1
            })
          ]),
          append: _withCtx$3(() => [
            _createElementVNode$3("div", _hoisted_13$2, [
              _createVNode$3(_component_VBtnToggle, {
                modelValue: boardView.value,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((boardView).value = $event)),
                mandatory: "",
                density: "compact",
                variant: "outlined",
                divided: ""
              }, {
                default: _withCtx$3(() => [
                  _createVNode$3(_component_VBtn, {
                    value: "grid",
                    icon: "mdi-view-grid-outline",
                    title: "平铺"
                  }),
                  _createVNode$3(_component_VBtn, {
                    value: "list",
                    icon: "mdi-view-list-outline",
                    title: "列表"
                  }),
                  _createVNode$3(_component_VBtn, {
                    value: "compact",
                    icon: "mdi-view-headline",
                    title: "紧凑"
                  })
                ]),
                _: 1
              }, 8, ["modelValue"]),
              _createVNode$3(_component_VBtn, {
                icon: "mdi-refresh",
                variant: "text",
                loading: catalogLoading.value,
                onClick: _cache[7] || (_cache[7] = $event => (loadQuarter(true)))
              }, null, 8, ["loading"])
            ])
          ]),
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardTitle, null, {
              default: _withCtx$3(() => [...(_cache[40] || (_cache[40] = [
                _createTextVNode$3("季度番剧看板", -1)
              ]))]),
              _: 1
            }),
            _createVNode$3(_component_VCardSubtitle, null, {
              default: _withCtx$3(() => [
                _createTextVNode$3("AniList 日漫主目录 · Bangumi/TMDB 补充国漫与海外动画；当前仅显示 " + _toDisplayString$3(quarterKey.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$3(_component_VCardText, null, {
          default: _withCtx$3(() => [
            _createElementVNode$3("div", _hoisted_14$2, [
              _createVNode$3(_component_VSelect, {
                modelValue: board.value.year,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((board.value.year) = $event)),
                items: _unref$1(years),
                label: "年份",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$3(_component_VSelect, {
                modelValue: board.value.quarter,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((board.value.quarter) = $event)),
                items: [1,2,3,4].map(value => ({ title: `Q${value}`, value })),
                label: "季度",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$3(_component_VTextField, {
                modelValue: board.value.search,
                "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((board.value.search) = $event)),
                label: "搜索番剧",
                "prepend-inner-icon": "mdi-magnify",
                clearable: "",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue"]),
              _createVNode$3(_component_VSelect, {
                modelValue: board.value.region,
                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((board.value.region) = $event)),
                label: "地区",
                "hide-details": "",
                density: "compact",
                items: [{title:'全部地区',value:'all'},{title:'日漫',value:'japan'},{title:'国漫',value:'china'},{title:'海外动画',value:'western'},{title:'地区未知',value:'unknown'}]
              }, null, 8, ["modelValue"]),
              _createVNode$3(_component_VSelect, {
                modelValue: board.value.platform,
                "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((board.value.platform) = $event)),
                items: platforms.value,
                label: "载体",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$3(_component_VSelect, {
                modelValue: board.value.scanStatus,
                "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((board.value.scanStatus) = $event)),
                label: "扫描状态",
                "hide-details": "",
                density: "compact",
                items: [{title:'全部状态',value:'all'},{title:'正在扫描',value:'scanning'},{title:'已匹配',value:'matched'},{title:'匹配失败',value:'failed'}]
              }, null, 8, ["modelValue"]),
              _createVNode$3(_component_VSwitch, {
                modelValue: board.value.multiOnly,
                "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((board.value.multiOnly) = $event)),
                label: "仅续作/多季",
                color: "secondary",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue"])
            ]),
            _createElementVNode$3("div", _hoisted_15$2, [
              _createVNode$3(_component_VCheckbox, {
                "model-value": allFilteredSelected.value,
                indeterminate: selectedIds.value.length > 0 && !allFilteredSelected.value,
                label: "选择当前筛选结果",
                "hide-details": "",
                density: "compact",
                onClick: toggleAllFiltered
              }, null, 8, ["model-value", "indeterminate"]),
              _createVNode$3(_component_VSpacer),
              _createVNode$3(_component_VSelect, {
                modelValue: batchPreference.value,
                "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((batchPreference).value = $event)),
                class: "batch-target",
                "hide-details": "",
                density: "compact",
                items: [{title:'优先 TMDB 默认编集',value:'default'},{title:'优先剧集组（Production/Season）',value:'group_preferred'}]
              }, null, 8, ["modelValue"]),
              _createVNode$3(_component_VBtn, {
                color: "secondary",
                "prepend-icon": "mdi-playlist-plus",
                loading: batchLoading.value,
                disabled: !selectedIds.value.length,
                onClick: batchAdd
              }, {
                default: _withCtx$3(() => [
                  _createTextVNode$3("批量加入 " + _toDisplayString$3(selectedIds.value.length || ''), 1)
                ]),
                _: 1
              }, 8, ["loading", "disabled"])
            ]),
            (catalogLoading.value)
              ? (_openBlock$3(), _createBlock$3(_component_VProgressLinear, {
                  key: 0,
                  indeterminate: "",
                  color: "secondary",
                  class: "mb-4"
                }))
              : _createCommentVNode$3("", true),
            _createElementVNode$3("div", _hoisted_16$2, [
              _createTextVNode$3(" 当前 " + _toDisplayString$3(filteredCatalog.value.length) + " / " + _toDisplayString$3(catalog.value.length) + " 条 ", 1),
              (catalogMeta.value.scanning_count)
                ? (_openBlock$3(), _createElementBlock$3("span", _hoisted_17$2, " · " + _toDisplayString$3(catalogMeta.value.scanning_count) + " 条正在扫描", 1))
                : _createCommentVNode$3("", true),
              (catalogMeta.value.updated_at)
                ? (_openBlock$3(), _createElementBlock$3("span", _hoisted_18$2, " · 更新于 " + _toDisplayString$3(catalogMeta.value.updated_at), 1))
                : _createCommentVNode$3("", true)
            ]),
            _createElementVNode$3("div", {
              class: _normalizeClass$1(['catalog-grid', `view-${boardView.value}`])
            }, [
              (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(filteredCatalog.value, (item) => {
                return (_openBlock$3(), _createBlock$3(_component_VCard, {
                  key: item.id,
                  variant: "outlined",
                  class: "catalog-card"
                }, {
                  default: _withCtx$3(() => [
                    _createElementVNode$3("div", _hoisted_19$2, [
                      _createVNode$3(_component_VCheckbox, {
                        modelValue: selectedIds.value,
                        "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((selectedIds).value = $event)),
                        value: item.id,
                        "hide-details": "",
                        density: "compact"
                      }, null, 8, ["modelValue", "value"])
                    ]),
                    (item.poster)
                      ? (_openBlock$3(), _createBlock$3(_component_VImg, {
                          key: 0,
                          src: item.poster,
                          height: "170",
                          cover: ""
                        }, null, 8, ["src"]))
                      : _createCommentVNode$3("", true),
                    _createVNode$3(_component_VCardItem, null, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1 text-wrap" }, {
                          default: _withCtx$3(() => [
                            _createTextVNode$3(_toDisplayString$3(item.display_name || item.name_cn || item.name), 1)
                          ]),
                          _: 2
                        }, 1024),
                        _createVNode$3(_component_VCardSubtitle, null, {
                          default: _withCtx$3(() => [
                            _createTextVNode$3(_toDisplayString$3(item.date || '日期未知') + " · " + _toDisplayString$3(item.episode_count || '?') + " 集", 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024),
                    _createVNode$3(_component_VCardText, { class: "pt-0" }, {
                      default: _withCtx$3(() => [
                        _createElementVNode$3("div", _hoisted_20$2, [
                          (item.region_name)
                            ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                key: 0,
                                size: "x-small",
                                variant: "tonal"
                              }, {
                                default: _withCtx$3(() => [
                                  _createTextVNode$3(_toDisplayString$3(item.region_name), 1)
                                ]),
                                _: 2
                              }, 1024))
                            : _createCommentVNode$3("", true),
                          (item.platform)
                            ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                key: 1,
                                size: "x-small",
                                variant: "tonal"
                              }, {
                                default: _withCtx$3(() => [
                                  _createTextVNode$3(_toDisplayString$3(item.platform), 1)
                                ]),
                                _: 2
                              }, 1024))
                            : _createCommentVNode$3("", true),
                          (item.is_multi_season)
                            ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                key: 2,
                                size: "x-small",
                                color: "secondary",
                                variant: "tonal"
                              }, {
                                default: _withCtx$3(() => [...(_cache[41] || (_cache[41] = [
                                  _createTextVNode$3("续作/多季", -1)
                                ]))]),
                                _: 1
                              }))
                            : _createCommentVNode$3("", true),
                          (item.matched_media_type)
                            ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                key: 3,
                                size: "x-small",
                                variant: "tonal"
                              }, {
                                default: _withCtx$3(() => [
                                  _createTextVNode$3(_toDisplayString$3(item.matched_media_type), 1)
                                ]),
                                _: 2
                              }, 1024))
                            : _createCommentVNode$3("", true),
                          (item.scan_status === 'scanning')
                            ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                key: 4,
                                size: "x-small",
                                color: "info",
                                variant: "tonal"
                              }, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VProgressCircular, {
                                    indeterminate: "",
                                    size: "11",
                                    width: "2",
                                    class: "me-1"
                                  }),
                                  _cache[42] || (_cache[42] = _createTextVNode$3("正在扫描 ", -1))
                                ]),
                                _: 1
                              }))
                            : (item.scan_status === 'failed')
                              ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                  key: 5,
                                  size: "x-small",
                                  color: "warning",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$3(() => [...(_cache[43] || (_cache[43] = [
                                    _createTextVNode$3("匹配待补充", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode$3("", true),
                          (item.maintained)
                            ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                key: 6,
                                size: "x-small",
                                color: "success",
                                "prepend-icon": "mdi-check"
                              }, {
                                default: _withCtx$3(() => [...(_cache[44] || (_cache[44] = [
                                  _createTextVNode$3("已维护", -1)
                                ]))]),
                                _: 1
                              }))
                            : _createCommentVNode$3("", true)
                        ]),
                        (item.tmdb_match?.best)
                          ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_21$2, " TMDB " + _toDisplayString$3(item.tmdb_match.best.tmdb_id) + " · " + _toDisplayString$3(item.tmdb_match.best.name), 1))
                          : _createCommentVNode$3("", true)
                      ]),
                      _: 2
                    }, 1024),
                    _createVNode$3(_component_VCardActions, null, {
                      default: _withCtx$3(() => [
                        (!item.maintained && item.rule_eligible !== false)
                          ? (_openBlock$3(), _createBlock$3(_component_VMenu, { key: 0 }, {
                              activator: _withCtx$3(({ props: menuProps }) => [
                                _createVNode$3(_component_VBtn, _mergeProps({ ref_for: true }, menuProps, {
                                  color: "primary",
                                  variant: "tonal",
                                  "append-icon": "mdi-menu-down",
                                  loading: busyId.value === item.id
                                }), {
                                  default: _withCtx$3(() => [...(_cache[45] || (_cache[45] = [
                                    _createTextVNode$3("加入规则", -1)
                                  ]))]),
                                  _: 1
                                }, 16, ["loading"])
                              ]),
                              default: _withCtx$3(() => [
                                _createVNode$3(_component_VList, { density: "compact" }, {
                                  default: _withCtx$3(() => [
                                    _createVNode$3(_component_VListItem, {
                                      title: "使用 TMDB 默认编集",
                                      "prepend-icon": "mdi-database-outline",
                                      onClick: $event => (addCatalogItem(item, 'default'))
                                    }, null, 8, ["onClick"]),
                                    _createVNode$3(_component_VListItem, {
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
                            ? (_openBlock$3(), _createBlock$3(_component_VBtn, {
                                key: 1,
                                variant: "text",
                                disabled: "",
                                "prepend-icon": "mdi-movie-open-outline"
                              }, {
                                default: _withCtx$3(() => [...(_cache[46] || (_cache[46] = [
                                  _createTextVNode$3("电影条目无需集数规则", -1)
                                ]))]),
                                _: 1
                              }))
                            : (_openBlock$3(), _createBlock$3(_component_VBtn, {
                                key: 2,
                                variant: "text",
                                "prepend-icon": "mdi-pencil-outline",
                                onClick: $event => (openEditor(ruleByTmdbId.value.get(Number(item.tmdb_match?.best?.tmdb_id))))
                              }, {
                                default: _withCtx$3(() => [...(_cache[47] || (_cache[47] = [
                                  _createTextVNode$3("编辑规则", -1)
                                ]))]),
                                _: 1
                              }, 8, ["onClick"]))
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024))
              }), 128)),
              (!catalogLoading.value && !filteredCatalog.value.length)
                ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_22$2, [
                    _createVNode$3(_component_VIcon, {
                      icon: "mdi-calendar-search",
                      size: "48"
                    }),
                    _cache[48] || (_cache[48] = _createElementVNode$3("div", null, "当前筛选条件没有番剧", -1))
                  ]))
                : _createCommentVNode$3("", true)
            ], 2)
          ]),
          _: 1
        })
      ]),
      _: 1
    }),
    _createVNode$3(_component_VDialog, {
      modelValue: manualDialog.value,
      "onUpdate:modelValue": _cache[24] || (_cache[24] = $event => ((manualDialog).value = $event)),
      "max-width": "620"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCard, null, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardItem, null, {
              append: _withCtx$3(() => [
                _createVNode$3(_component_VBtn, {
                  icon: "mdi-close",
                  variant: "text",
                  onClick: _cache[17] || (_cache[17] = $event => (manualDialog.value = false))
                })
              ]),
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardTitle, null, {
                  default: _withCtx$3(() => [...(_cache[49] || (_cache[49] = [
                    _createTextVNode$3("手动添加维护规则", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VCardSubtitle, null, {
                  default: _withCtx$3(() => [...(_cache[50] || (_cache[50] = [
                    _createTextVNode$3("适用于季度看板中没有收录的电视剧或动画", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardText, { class: "manual-rule-form" }, {
              default: _withCtx$3(() => [
                (manualMessage.value)
                  ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                      key: 0,
                      type: "warning",
                      variant: "tonal",
                      density: "compact",
                      class: "mb-4"
                    }, {
                      default: _withCtx$3(() => [
                        _createTextVNode$3(_toDisplayString$3(manualMessage.value), 1)
                      ]),
                      _: 1
                    }))
                  : _createCommentVNode$3("", true),
                _createVNode$3(_component_VTextField, {
                  modelValue: manualForm.value.tmdb_id,
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((manualForm.value.tmdb_id) = $event)),
                  modelModifiers: { number: true },
                  label: "TMDBID",
                  type: "number",
                  "prepend-inner-icon": "mdi-database-search",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VSelect, {
                  modelValue: manualForm.value.preference,
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((manualForm.value.preference) = $event)),
                  label: "目标编集",
                  items: [{title:'使用 TMDB 默认编集',value:'default'},{title:'优先 Production/Season 剧集组',value:'group_preferred'}],
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$3(_component_VSwitch, {
                  modelValue: manualForm.value.specify_quarter,
                  "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((manualForm.value.specify_quarter) = $event)),
                  label: "手动指定归属季度",
                  color: "primary",
                  "hide-details": "",
                  class: "mb-3"
                }, null, 8, ["modelValue"]),
                (manualForm.value.specify_quarter)
                  ? (_openBlock$3(), _createBlock$3(_component_VRow, {
                      key: 1,
                      dense: ""
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VCol, { cols: "7" }, {
                          default: _withCtx$3(() => [
                            _createVNode$3(_component_VSelect, {
                              modelValue: manualForm.value.year,
                              "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((manualForm.value.year) = $event)),
                              items: _unref$1(years),
                              label: "年份"
                            }, null, 8, ["modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        _createVNode$3(_component_VCol, { cols: "5" }, {
                          default: _withCtx$3(() => [
                            _createVNode$3(_component_VSelect, {
                              modelValue: manualForm.value.quarter,
                              "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((manualForm.value.quarter) = $event)),
                              items: [1,2,3,4].map(value => ({title:`Q${value}`,value})),
                              label: "季度"
                            }, null, 8, ["modelValue", "items"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }))
                  : _createCommentVNode$3("", true),
                _cache[51] || (_cache[51] = _createElementVNode$3("div", { class: "text-caption text-medium-emphasis" }, " 不指定时会根据 TMDB 最新有效季的首播日期自动归类；TMDB 缺少日期时会提示补充。 ", -1))
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VCardActions, { class: "pa-4" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VSpacer),
                _createVNode$3(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[23] || (_cache[23] = $event => (manualDialog.value = false))
                }, {
                  default: _withCtx$3(() => [...(_cache[52] || (_cache[52] = [
                    _createTextVNode$3("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VBtn, {
                  color: "primary",
                  loading: manualLoading.value,
                  disabled: !manualForm.value.tmdb_id,
                  onClick: manualAddRule
                }, {
                  default: _withCtx$3(() => [...(_cache[53] || (_cache[53] = [
                    _createTextVNode$3("读取并加入", -1)
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
    _createVNode$3(_component_VDialog, {
      modelValue: deleteRulesDialog.value,
      "onUpdate:modelValue": _cache[26] || (_cache[26] = $event => ((deleteRulesDialog).value = $event)),
      "max-width": "520"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCard, null, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardItem, null, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardTitle, null, {
                  default: _withCtx$3(() => [...(_cache[54] || (_cache[54] = [
                    _createTextVNode$3("删除当前筛选结果？", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VCardSubtitle, null, {
                  default: _withCtx$3(() => [
                    _createTextVNode$3("将删除 " + _toDisplayString$3(filteredRules.value.length) + " 条维护规则，季度看板数据不会被删除", 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VCardText, null, {
              default: _withCtx$3(() => [...(_cache[55] || (_cache[55] = [
                _createTextVNode$3("此操作会立即停止这些 TMDB 条目的集数偏移，请确认当前季度和搜索条件正确。", -1)
              ]))]),
              _: 1
            }),
            _createVNode$3(_component_VCardActions, { class: "pa-4" }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VSpacer),
                _createVNode$3(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[25] || (_cache[25] = $event => (deleteRulesDialog.value = false))
                }, {
                  default: _withCtx$3(() => [...(_cache[56] || (_cache[56] = [
                    _createTextVNode$3("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VBtn, {
                  color: "error",
                  loading: deleteRulesLoading.value,
                  onClick: deleteFilteredRules
                }, {
                  default: _withCtx$3(() => [...(_cache[57] || (_cache[57] = [
                    _createTextVNode$3("确认删除", -1)
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
      modelValue: editorOpen.value,
      "onUpdate:modelValue": _cache[33] || (_cache[33] = $event => ((editorOpen).value = $event)),
      "max-width": "820",
      scrollable: ""
    }, {
      default: _withCtx$3(() => [
        (editForm.value)
          ? (_openBlock$3(), _createBlock$3(_component_VCard, { key: 0 }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardItem, null, {
                  append: _withCtx$3(() => [
                    _createVNode$3(_component_VBtn, {
                      icon: "mdi-close",
                      variant: "text",
                      onClick: _cache[27] || (_cache[27] = $event => (editorOpen.value = false))
                    })
                  ]),
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VCardTitle, null, {
                      default: _withCtx$3(() => [...(_cache[58] || (_cache[58] = [
                        _createTextVNode$3("编辑维护规则", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$3(_component_VCardSubtitle, null, {
                      default: _withCtx$3(() => [
                        _createTextVNode$3(_toDisplayString$3(editForm.value.title) + " · TMDB " + _toDisplayString$3(editForm.value.tmdb_id), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VDivider),
                _createVNode$3(_component_VCardText, null, {
                  default: _withCtx$3(() => [
                    _createElementVNode$3("div", _hoisted_23$2, [
                      _createVNode$3(_component_VSwitch, {
                        modelValue: editForm.value.enabled,
                        "onUpdate:modelValue": _cache[28] || (_cache[28] = $event => ((editForm.value.enabled) = $event)),
                        label: "启用规则",
                        color: "success",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode$3(_component_VSpacer),
                      _createVNode$3(_component_VBtn, {
                        variant: "tonal",
                        "prepend-icon": "mdi-refresh",
                        loading: editorLoading.value,
                        onClick: inspectTarget
                      }, {
                        default: _withCtx$3(() => [...(_cache[59] || (_cache[59] = [
                          _createTextVNode$3("刷新编集", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _createElementVNode$3("div", _hoisted_24$2, [
                      _createVNode$3(_component_VTextField, {
                        modelValue: editForm.value.tmdb_id,
                        "onUpdate:modelValue": _cache[29] || (_cache[29] = $event => ((editForm.value.tmdb_id) = $event)),
                        modelModifiers: { number: true },
                        label: "TMDBID",
                        type: "number",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode$3(_component_VBtn, {
                        variant: "tonal",
                        "prepend-icon": "mdi-database-search",
                        loading: editorLoading.value,
                        onClick: inspectTarget
                      }, {
                        default: _withCtx$3(() => [...(_cache[60] || (_cache[60] = [
                          _createTextVNode$3("读取并校验", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    (Number(editForm.value.original_tmdb_id) !== Number(editForm.value.tmdb_id))
                      ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                          key: 0,
                          type: "warning",
                          variant: "tonal",
                          density: "compact",
                          class: "mb-4"
                        }, {
                          default: _withCtx$3(() => [
                            _createTextVNode$3("保存后将用 TMDB " + _toDisplayString$3(editForm.value.tmdb_id) + " 替换原规则 TMDB " + _toDisplayString$3(editForm.value.original_tmdb_id), 1)
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$3("", true),
                    (inspection.value?.recommendation)
                      ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                          key: 1,
                          type: "info",
                          variant: "tonal",
                          density: "compact",
                          class: "mb-3"
                        }, {
                          default: _withCtx$3(() => [
                            _createElementVNode$3("div", _hoisted_25$2, [
                              _createElementVNode$3("span", _hoisted_26$2, [
                                _createElementVNode$3("strong", null, "智能建议：" + _toDisplayString$3(inspection.value.recommendation.target_type === 'group' ? '剧集组' : 'TMDB 默认编集'), 1),
                                _createTextVNode$3(" · " + _toDisplayString$3(inspection.value.recommendation.reason), 1)
                              ]),
                              _createVNode$3(_component_VBtn, {
                                size: "small",
                                variant: "tonal",
                                onClick: applyTargetRecommendation
                              }, {
                                default: _withCtx$3(() => [...(_cache[61] || (_cache[61] = [
                                  _createTextVNode$3("采用建议", -1)
                                ]))]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$3("", true),
                    _createVNode$3(_component_VRadioGroup, {
                      modelValue: editForm.value.target_type,
                      "onUpdate:modelValue": _cache[30] || (_cache[30] = $event => ((editForm.value.target_type) = $event)),
                      "hide-details": ""
                    }, {
                      default: _withCtx$3(() => [
                        _createVNode$3(_component_VRadio, {
                          value: "default",
                          label: "TMDB 默认编集"
                        }),
                        _createVNode$3(_component_VRadio, {
                          value: "group",
                          label: "TMDB 剧集组"
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    (editForm.value.target_type === 'group')
                      ? (_openBlock$3(), _createBlock$3(_component_VSelect, {
                          key: 2,
                          modelValue: editForm.value.episode_group_id,
                          "onUpdate:modelValue": _cache[31] || (_cache[31] = $event => ((editForm.value.episode_group_id) = $event)),
                          class: "mt-3",
                          items: (inspection.value?.groups || []).map(group => ({ title: `${group.recommended ? '推荐 · ' : ''}${group.name} · ${groupType(group.type)} · ${group.episode_count} 集`, value: group.id })),
                          label: "目标剧集组"
                        }, null, 8, ["modelValue", "items"]))
                      : _createCommentVNode$3("", true),
                    (selectedGroup.value)
                      ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_27$2, [
                          _createElementVNode$3("div", _hoisted_28$2, [
                            _cache[63] || (_cache[63] = _createElementVNode$3("strong", null, "分季预览", -1)),
                            _createVNode$3(_component_VChip, {
                              size: "x-small",
                              variant: "tonal"
                            }, {
                              default: _withCtx$3(() => [
                                _createTextVNode$3(_toDisplayString$3(selectedGroup.value.seasons?.filter(item => !item.is_special).length || 0) + " 个常规季", 1)
                              ]),
                              _: 1
                            }),
                            (selectedGroup.value.seasons?.some(item => item.is_special))
                              ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                  key: 0,
                                  size: "x-small",
                                  color: "secondary",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$3(() => [...(_cache[62] || (_cache[62] = [
                                    _createTextVNode$3("包含 Special", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode$3("", true),
                            (selectedGroup.value.coverage)
                              ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                  key: 1,
                                  size: "x-small",
                                  variant: "outlined"
                                }, {
                                  default: _withCtx$3(() => [
                                    _createTextVNode$3("正片覆盖 " + _toDisplayString$3(selectedGroup.value.coverage) + "%", 1)
                                  ]),
                                  _: 1
                                }))
                              : _createCommentVNode$3("", true)
                          ]),
                          _createElementVNode$3("div", _hoisted_29$2, [
                            (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(selectedGroup.value.seasons || [], (season) => {
                              return (_openBlock$3(), _createElementBlock$3("div", {
                                key: season.season,
                                class: _normalizeClass$1(['group-season-item', { special: season.is_special }])
                              }, [
                                _createElementVNode$3("div", _hoisted_30$2, [
                                  _createElementVNode$3("strong", null, "S" + _toDisplayString$3(String(season.season).padStart(2, '0')), 1),
                                  (season.is_special)
                                    ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                        key: 0,
                                        size: "x-small",
                                        color: "secondary"
                                      }, {
                                        default: _withCtx$3(() => [...(_cache[64] || (_cache[64] = [
                                          _createTextVNode$3("Special", -1)
                                        ]))]),
                                        _: 1
                                      }))
                                    : _createCommentVNode$3("", true),
                                  _createElementVNode$3("span", _hoisted_31$2, _toDisplayString$3(season.name), 1)
                                ]),
                                _createElementVNode$3("div", _hoisted_32$2, _toDisplayString$3(season.episode_count) + " 集 · E" + _toDisplayString$3(String(season.first_episode || 1).padStart(2, '0')) + "–E" + _toDisplayString$3(String(season.last_episode || season.episode_count).padStart(2, '0')), 1),
                                (season.first_air_date || season.last_air_date)
                                  ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_33$2, [
                                      _createTextVNode$3(_toDisplayString$3(season.first_air_date || '日期未知'), 1),
                                      (season.last_air_date && season.last_air_date !== season.first_air_date)
                                        ? (_openBlock$3(), _createElementBlock$3("span", _hoisted_34$2, " → " + _toDisplayString$3(season.last_air_date), 1))
                                        : _createCommentVNode$3("", true)
                                    ]))
                                  : _createCommentVNode$3("", true)
                              ], 2))
                            }), 128))
                          ])
                        ]))
                      : _createCommentVNode$3("", true),
                    _createElementVNode$3("div", _hoisted_35$2, [
                      _cache[66] || (_cache[66] = _createElementVNode$3("strong", null, "季度片段", -1)),
                      _createVNode$3(_component_VSpacer),
                      _createVNode$3(_component_VBtn, {
                        size: "small",
                        variant: "tonal",
                        "prepend-icon": "mdi-plus",
                        onClick: addInstallment
                      }, {
                        default: _withCtx$3(() => [...(_cache[65] || (_cache[65] = [
                          _createTextVNode$3("添加", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _createVNode$3(_component_VExpansionPanels, { variant: "accordion" }, {
                      default: _withCtx$3(() => [
                        (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(editForm.value.installments, (item, index) => {
                          return (_openBlock$3(), _createBlock$3(_component_VExpansionPanel, {
                            key: item.id || index
                          }, {
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VExpansionPanelTitle, null, {
                                default: _withCtx$3(() => [
                                  _createTextVNode$3(_toDisplayString$3(item.title || `季度片段 ${index + 1}`) + " · S" + _toDisplayString$3(item.target_start_season) + "E" + _toDisplayString$3(item.target_start_episode), 1)
                                ]),
                                _: 2
                              }, 1024),
                              _createVNode$3(_component_VExpansionPanelText, null, {
                                default: _withCtx$3(() => [
                                  _createVNode$3(_component_VRow, { dense: "" }, {
                                    default: _withCtx$3(() => [
                                      _createVNode$3(_component_VCol, {
                                        cols: "12",
                                        sm: "6"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VTextField, {
                                            modelValue: item.title,
                                            "onUpdate:modelValue": $event => ((item.title) = $event),
                                            label: "片段名称"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$3(_component_VCol, {
                                        cols: "12",
                                        sm: "3"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VTextField, {
                                            modelValue: item.quarter,
                                            "onUpdate:modelValue": $event => ((item.quarter) = $event),
                                            label: "季度"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$3(_component_VCol, {
                                        cols: "12",
                                        sm: "3"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VTextField, {
                                            modelValue: item.source_season,
                                            "onUpdate:modelValue": $event => ((item.source_season) = $event),
                                            label: "来源季",
                                            type: "number"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$3(_component_VCol, { cols: "12" }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VTextarea, {
                                            modelValue: item.aliases,
                                            "onUpdate:modelValue": $event => ((item.aliases) = $event),
                                            label: "命中别名（每行一个）",
                                            rows: "2",
                                            "auto-grow": ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$3(_component_VCol, {
                                        cols: "12",
                                        sm: "4"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VTextField, {
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
                                      _createVNode$3(_component_VCol, {
                                        cols: "6",
                                        sm: "4"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VTextField, {
                                            modelValue: item.target_start_season,
                                            "onUpdate:modelValue": $event => ((item.target_start_season) = $event),
                                            label: "目标起始季",
                                            type: "number"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$3(_component_VCol, {
                                        cols: "6",
                                        sm: "4"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _createVNode$3(_component_VTextField, {
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
                                  _createVNode$3(_component_VBtn, {
                                    color: "error",
                                    variant: "text",
                                    "prepend-icon": "mdi-delete-outline",
                                    onClick: $event => (editForm.value.installments.splice(index, 1))
                                  }, {
                                    default: _withCtx$3(() => [...(_cache[67] || (_cache[67] = [
                                      _createTextVNode$3("删除片段", -1)
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
                _createVNode$3(_component_VDivider),
                _createVNode$3(_component_VCardActions, { class: "pa-4" }, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VSpacer),
                    _createVNode$3(_component_VBtn, {
                      variant: "text",
                      onClick: _cache[32] || (_cache[32] = $event => (editorOpen.value = false))
                    }, {
                      default: _withCtx$3(() => [...(_cache[68] || (_cache[68] = [
                        _createTextVNode$3("取消", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$3(_component_VBtn, {
                      color: "primary",
                      loading: editorLoading.value,
                      onClick: saveRule
                    }, {
                      default: _withCtx$3(() => [...(_cache[69] || (_cache[69] = [
                        _createTextVNode$3("保存规则", -1)
                      ]))]),
                      _: 1
                    }, 8, ["loading"])
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
      modelValue: failureDialog.value,
      "onUpdate:modelValue": _cache[35] || (_cache[35] = $event => ((failureDialog).value = $event)),
      "max-width": "720"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCard, null, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardItem, null, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardTitle, null, {
                  default: _withCtx$3(() => [...(_cache[70] || (_cache[70] = [
                    _createTextVNode$3("这些番剧未能自动匹配", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$3(_component_VCardSubtitle, null, {
                  default: _withCtx$3(() => [...(_cache[71] || (_cache[71] = [
                    _createTextVNode$3("补充正确 TMDBID 后重试，或直接放弃该条目", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$3(_component_VDivider),
            _createVNode$3(_component_VList, { lines: "three" }, {
              default: _withCtx$3(() => [
                (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(failures.value, (failure) => {
                  return (_openBlock$3(), _createBlock$3(_component_VListItem, {
                    key: failure.id,
                    title: failure.title,
                    subtitle: failure.reason
                  }, {
                    append: _withCtx$3(() => [
                      _createElementVNode$3("div", _hoisted_36$2, [
                        _createVNode$3(_component_VTextField, {
                          modelValue: manualTmdb.value[failure.id],
                          "onUpdate:modelValue": $event => ((manualTmdb.value[failure.id]) = $event),
                          label: "TMDBID",
                          type: "number",
                          "hide-details": "",
                          density: "compact"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        _createVNode$3(_component_VBtn, {
                          color: "primary",
                          variant: "tonal",
                          loading: busyId.value === failure.id,
                          onClick: $event => (retryFailure(failure))
                        }, {
                          default: _withCtx$3(() => [...(_cache[72] || (_cache[72] = [
                            _createTextVNode$3("补充并加入", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading", "onClick"]),
                        _createVNode$3(_component_VBtn, {
                          variant: "text",
                          color: "medium-emphasis",
                          onClick: $event => (ignoreFailure(failure))
                        }, {
                          default: _withCtx$3(() => [...(_cache[73] || (_cache[73] = [
                            _createTextVNode$3("忽略", -1)
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
            _createVNode$3(_component_VCardActions, null, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VSpacer),
                _createVNode$3(_component_VBtn, {
                  onClick: _cache[34] || (_cache[34] = $event => (failureDialog.value = false))
                }, {
                  default: _withCtx$3(() => [...(_cache[74] || (_cache[74] = [
                    _createTextVNode$3("关闭", -1)
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
    _createVNode$3(_component_VSnackbar, {
      modelValue: snackbar.value,
      "onUpdate:modelValue": _cache[36] || (_cache[36] = $event => ((snackbar).value = $event)),
      color: "success",
      timeout: "3500"
    }, {
      default: _withCtx$3(() => [
        _createTextVNode$3(_toDisplayString$3(notice.value), 1)
      ]),
      _: 1
    }, 8, ["modelValue"])
  ]))
}
}

};
const EpisodeNormalizer = /*#__PURE__*/_export_sfc(_sfc_main$3, [['__scopeId',"data-v-3c515e9c"]]);

const {toDisplayString:_toDisplayString$2,createTextVNode:_createTextVNode$2,resolveComponent:_resolveComponent$2,withCtx:_withCtx$2,openBlock:_openBlock$2,createBlock:_createBlock$2,createCommentVNode:_createCommentVNode$2,createElementVNode:_createElementVNode$2,createVNode:_createVNode$2,renderList:_renderList$2,Fragment:_Fragment$2,createElementBlock:_createElementBlock$2} = await importShared('vue');


const _hoisted_1$2 = { class: "d-flex align-center flex-wrap ga-3 mb-4" };
const _hoisted_2$2 = { key: 2 };
const _hoisted_3$2 = { class: "filter-row mb-3" };
const _hoisted_4$2 = { class: "text-caption text-medium-emphasis mb-2" };
const _hoisted_5$1 = { class: "font-weight-medium" };
const _hoisted_6$1 = { class: "d-flex align-center ga-2" };
const _hoisted_7$1 = ["title"];
const _hoisted_8$1 = {
  key: 0,
  class: "text-caption text-medium-emphasis"
};
const _hoisted_9$1 = { class: "text-caption text-medium-emphasis" };
const _hoisted_10$1 = { key: 3 };
const _hoisted_11$1 = { class: "filter-row mb-3" };
const _hoisted_12$1 = { class: "font-weight-medium" };
const _hoisted_13$1 = { class: "rule-pattern" };
const _hoisted_14$1 = { key: 4 };
const _hoisted_15$1 = { class: "d-flex align-center flex-wrap ga-3 mb-4" };
const _hoisted_16$1 = {
  key: 0,
  class: "custom-field-list"
};
const _hoisted_17$1 = { class: "flex-grow-1 min-w-0" };
const _hoisted_18$1 = { class: "d-flex align-center ga-2" };
const _hoisted_19$1 = { class: "font-weight-medium mt-1" };
const _hoisted_20$1 = ["title"];
const _hoisted_21$1 = {
  key: 0,
  class: "text-caption text-medium-emphasis"
};
const _hoisted_22$1 = {
  key: 1,
  class: "empty-fields"
};
const _hoisted_23$1 = { class: "rename-preview-form" };
const _hoisted_24$1 = {
  key: 0,
  class: "preview-output mt-4"
};
const _hoisted_25$1 = { class: "text-right text-break" };
const _hoisted_26$1 = { class: "d-flex align-center ga-3" };
const _hoisted_27$1 = { class: "font-weight-medium" };
const _hoisted_28$1 = { class: "field-description-grid" };
const _hoisted_29$1 = ["onClick"];
const _hoisted_30$1 = { class: "field-description-head" };
const _hoisted_31$1 = { class: "field-description-label" };
const _hoisted_32$1 = { class: "field-description-text" };
const _hoisted_33$1 = { class: "field-copy-hint" };
const _hoisted_34$1 = {
  key: 0,
  class: "empty-fields compact-empty"
};
const _hoisted_35$1 = { key: 5 };
const _hoisted_36$1 = { class: "naming-default-grid" };
const _hoisted_37$1 = { key: 0 };
const _hoisted_38$1 = { class: "d-flex align-center flex-wrap ga-3 mb-4" };
const _hoisted_39$1 = {
  key: 1,
  class: "group-layout-grid"
};
const _hoisted_40$1 = { class: "group-layout-main" };
const _hoisted_41$1 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_42$1 = { class: "font-weight-bold" };
const _hoisted_43$1 = { class: "mapping-expression" };
const _hoisted_44$1 = { class: "text-caption text-medium-emphasis" };
const _hoisted_45$1 = { class: "d-flex" };
const _hoisted_46$1 = {
  key: 2,
  class: "empty-fields"
};
const _hoisted_47$1 = { class: "group-preview-form" };
const _hoisted_48$1 = { class: "text-caption mt-1" };
const _hoisted_49$1 = {
  key: 0,
  class: "member-trace mt-3"
};
const _hoisted_50$1 = { key: 0 };
const _hoisted_51$1 = { key: 1 };
const _hoisted_52$1 = { class: "d-flex align-center flex-wrap ga-3 mb-4" };
const _hoisted_53$1 = {
  key: 1,
  class: "mapping-list"
};
const _hoisted_54$1 = { class: "flex-grow-1 min-w-0" };
const _hoisted_55$1 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_56$1 = { class: "font-weight-bold" };
const _hoisted_57$1 = { class: "mapping-expression" };
const _hoisted_58$1 = { class: "text-caption text-medium-emphasis" };
const _hoisted_59$1 = {
  key: 2,
  class: "empty-fields"
};
const _hoisted_60$1 = { class: "mapping-preview-form final-mapping-preview" };
const _hoisted_61$1 = { class: "text-caption mt-1" };
const _hoisted_62$1 = { key: 6 };
const _hoisted_63$1 = { class: "rule-enabled-box" };
const _hoisted_64$1 = { class: "rule-enabled-box" };
const _hoisted_65$1 = { class: "rule-enabled-box" };
const _hoisted_66$1 = { class: "rule-enabled-box" };

const {computed: computed$2,onMounted: onMounted$1,ref: ref$2,watch} = await importShared('vue');

const pageSize = 30;

const _sfc_main$2 = {
  __name: 'MetadataTools',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'TmdbRecognizeEnhancer' },
  modelValue: { type: Object, default: () => ({}) },
  savingConfig: { type: Boolean, default: false },
},
  emits: ['update:modelValue', 'save-config'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;
const loading = ref$2(false);
const saving = ref$2('');
const error = ref$2('');
const data = ref$2({ release_groups: { items: [] }, recognition_rules: { items: [], fields: [], overrides: [] }, rename_fields: { builtin: [], context: [], custom: [] }, rename_mappings: { items: [], stages: [] }, release_group_arrangements: { items: [], positions: [], connectors: [] }, capabilities: {} });
const section = ref$2('rules');
const search = ref$2('');
const field = ref$2('all');
const source = ref$2('all');
const page = ref$2(1);
const groupKind = ref$2('all');
const dialog = ref$2(false);
const form = ref$2({ id: '', source_rule_id: '', field: 'videoBit', pattern: '', value: '{match}', action: 'override', enabled: true, priority: 100, label: '' });
const previewTitle = ref$2('[Group] Example.S01E01.1080p.WEB-DL.H265.10bit.AAC.mkv');
const preview = ref$2(null);
const renameDialog = ref$2(false);
const renameForm = ref$2({ original_key: '', key: '', label: '', expression: '', fallback: '', enabled: true });
const renamePreviewing = ref$2(false);
const renamePreview = ref$2(null);
const renameFieldSearch = ref$2('');
const openRenameFieldGroups = ref$2(['媒体信息', '文件解析', '源文件上下文']);
const copiedVariable = ref$2('');
const mappingDialog = ref$2(false);
const mappingForm = ref$2({ id: '', label: '', stage: 'final_result', mode: 'literal', pattern: '', replacement: '', enabled: true, priority: 100 });
const mappingPreviewInput = ref$2({ value: 'AB/C.chi.zh-cn.ass' });
const mappingPreview = ref$2(null);
const renameRuleSection = ref$2('groups');
const groupArrangementDialog = ref$2(false);
const groupArrangementForm = ref$2({ id: '', label: '', match_name: '', aliases: '', output_name: '', position: 'keep', connector: '__default__', order: 100, enabled: true });
const groupArrangementPreviewInput = ref$2('ADWeb@A@VCB');
const groupArrangementPreview = ref$2(null);
const renamePreviewInput = ref$2({
  original_name: '[Group] Example.S01E01.1080p.WEB-DL.mkv',
  type: '电视剧', category: '动漫',
  source_path: '/downloads/anime/Example.S01E01.mkv',
  target_dir: '/media/TV/动漫',
});

const pluginBase = computed$2(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`);
const config = computed$2({ get: () => props.modelValue || {}, set: value => emit('update:modelValue', value) });
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
const fieldItems = computed$2(() => [{ title: '全部识别字段', value: 'all' }, ...(data.value.recognition_rules?.fields || []).map(item => ({ title: `${item.label} (${item.count})`, value: item.key }))]);
const rules = computed$2(() => {
  const query = search.value.trim().toLowerCase();
  return (data.value.recognition_rules?.items || []).filter(item => {
    if (field.value !== 'all' && item.field !== field.value) return false
    if (source.value !== 'all' && item.source !== source.value) return false
    return !query || [item.field, item.field_label, item.label, item.pattern, item.value].some(value => String(value || '').toLowerCase().includes(query))
  })
});
const pageCount = computed$2(() => Math.max(1, Math.ceil(rules.value.length / pageSize)));
const pagedRules = computed$2(() => rules.value.slice((page.value - 1) * pageSize, page.value * pageSize));
const groups = computed$2(() => {
  const query = search.value.trim().toLowerCase();
  return (data.value.release_groups?.items || []).filter(item => {
    if (groupKind.value !== 'all' && item.kind !== groupKind.value) return false
    return !query || [item.display_name, item.pattern, item.category].some(value => String(value || '').toLowerCase().includes(query))
  })
});
const groupPageCount = computed$2(() => Math.max(1, Math.ceil(groups.value.length / pageSize)));
const pagedGroups = computed$2(() => groups.value.slice((page.value - 1) * pageSize, page.value * pageSize));
const kindLabel = value => ({ animation: '动漫', live_action: '真人电视剧', unknown: '未分类' })[value] || '未分类';
const kindColor = value => ({ animation: 'primary', live_action: 'orange', unknown: 'default' })[value] || 'default';
const mappingRules = computed$2(() => data.value.rename_mappings?.items || []);
const mappingStages = computed$2(() => data.value.rename_mappings?.stages || [
  { value: 'final_result', label: '最终命名结果' },
  { value: 'release_group', label: '旧版制作组映射' },
]);
const mappingStageLabel = value => mappingStages.value.find(item => item.value === value)?.label || value;
const groupArrangementRules = computed$2(() => data.value.release_group_arrangements?.items || []);
const groupPositionItems = computed$2(() => data.value.release_group_arrangements?.positions || [
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
const groupConnectorItems = computed$2(() => [
  { title: `使用默认（${config.value.release_group_default_connector === ' ' ? '空格' : config.value.release_group_default_connector || '@'}）`, value: data.value.release_group_arrangements?.default_connector_value || '__default__' },
  ...(data.value.release_group_arrangements?.connectors || ['@', '&', '+', '-', '_', '.', ' ']).map(value => ({ title: value === ' ' ? '空格' : value, value })),
]);
const separatorFieldKeys = new Set(['title', 'en_title', 'original_title', 'name', 'en_name', 'original_name', 'resourceType', 'effect', 'edition', 'videoFormat', 'resource_term', 'releaseGroup', 'videoCodec', 'videoBit', 'audioCodec', 'fps', 'webSource', 'customization']);
const separatorFieldItems = computed$2(() => (data.value.rename_fields?.builtin || [])
  .filter(item => separatorFieldKeys.has(item.key))
  .map(item => ({ title: `${item.label}（${item.key}）`, value: item.key })));
const customFields = computed$2(() => data.value.rename_fields?.custom || []);
const availableRenameFields = computed$2(() => [
  ...(data.value.rename_fields?.builtin || []),
  ...(data.value.rename_fields?.context || []),
  ...customFields.value.map(item => ({
    ...item,
    category: '用户自定义',
    description: `由表达式计算：${item.expression}`,
    availability: item.enabled ? '按表达式依赖阶段可用' : '当前已停用',
    phase: 'custom',
  })),
]);
const renameFieldGroups = computed$2(() => {
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

watch([search, field, source, groupKind, section], () => { page.value = 1; });

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
  } catch (err) {
    error.value = explainError(err, '内置识别规则加载失败');
  } finally { loading.value = false; }
}

async function saveGroup(item, kind) {
  saving.value = item.id;
  try {
    data.value = unwrapResponse(await props.api.post(`${pluginBase.value}/metadata-tools/release-group`, { id: item.id, kind, display_name: item.display_name })) || data.value;
  } catch (err) { error.value = explainError(err, '制作组类型保存失败'); }
  finally { saving.value = ''; }
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

onMounted$1(load);

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent$2("VAlert");
  const _component_VSpacer = _resolveComponent$2("VSpacer");
  const _component_VBtn = _resolveComponent$2("VBtn");
  const _component_VSwitch = _resolveComponent$2("VSwitch");
  const _component_VCardText = _resolveComponent$2("VCardText");
  const _component_VCard = _resolveComponent$2("VCard");
  const _component_VTab = _resolveComponent$2("VTab");
  const _component_VTabs = _resolveComponent$2("VTabs");
  const _component_VTextField = _resolveComponent$2("VTextField");
  const _component_VSelect = _resolveComponent$2("VSelect");
  const _component_VChip = _resolveComponent$2("VChip");
  const _component_VTable = _resolveComponent$2("VTable");
  const _component_VPagination = _resolveComponent$2("VPagination");
  const _component_VCardTitle = _resolveComponent$2("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$2("VCardSubtitle");
  const _component_VCardItem = _resolveComponent$2("VCardItem");
  const _component_VIcon = _resolveComponent$2("VIcon");
  const _component_VTextarea = _resolveComponent$2("VTextarea");
  const _component_VExpansionPanelTitle = _resolveComponent$2("VExpansionPanelTitle");
  const _component_VExpansionPanelText = _resolveComponent$2("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent$2("VExpansionPanel");
  const _component_VExpansionPanels = _resolveComponent$2("VExpansionPanels");
  const _component_VCombobox = _resolveComponent$2("VCombobox");
  const _component_VDivider = _resolveComponent$2("VDivider");
  const _component_VCardActions = _resolveComponent$2("VCardActions");
  const _component_VAvatar = _resolveComponent$2("VAvatar");
  const _component_VCol = _resolveComponent$2("VCol");
  const _component_VRow = _resolveComponent$2("VRow");
  const _component_VDialog = _resolveComponent$2("VDialog");

  return (_openBlock$2(), _createElementBlock$2("div", null, [
    (error.value)
      ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          closable: "",
          class: "mb-4",
          "onClick:close": _cache[0] || (_cache[0] = $event => (error.value = ''))
        }, {
          default: _withCtx$2(() => [
            _createTextVNode$2(_toDisplayString$2(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$2("", true),
    _createElementVNode$2("div", _hoisted_1$2, [
      _cache[69] || (_cache[69] = _createElementVNode$2("div", null, [
        _createElementVNode$2("div", { class: "text-h6" }, "MP 内置识别词管理"),
        _createElementVNode$2("div", { class: "text-body-2 text-medium-emphasis" }, "查看 MP 当前版本实际加载的规则；修改保存在插件覆盖层，不改 MP 或 Rust 文件。")
      ], -1)),
      _createVNode$2(_component_VSpacer),
      _createVNode$2(_component_VBtn, {
        variant: "text",
        "prepend-icon": "mdi-refresh",
        loading: loading.value,
        onClick: load
      }, {
        default: _withCtx$2(() => [...(_cache[68] || (_cache[68] = [
          _createTextVNode$2("重新读取 MP 规则", -1)
        ]))]),
        _: 1
      }, 8, ["loading"])
    ]),
    _createVNode$2(_component_VCard, {
      variant: "outlined",
      class: "mb-4"
    }, {
      default: _withCtx$2(() => [
        _createVNode$2(_component_VCardText, { class: "d-flex align-center flex-wrap ga-6" }, {
          default: _withCtx$2(() => [
            _createVNode$2(_component_VSwitch, {
              modelValue: config.value.recognition_rule_overrides_enabled,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((config.value.recognition_rule_overrides_enabled) = $event)),
              color: "primary",
              label: "启用识别字段覆盖",
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createVNode$2(_component_VSwitch, {
              modelValue: config.value.release_group_assist_enabled,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config.value.release_group_assist_enabled) = $event)),
              color: "success",
              label: "制作组辅助 TMDB 判断",
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createVNode$2(_component_VSwitch, {
              modelValue: config.value.custom_rename_fields_enabled,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.value.custom_rename_fields_enabled) = $event)),
              color: "secondary",
              label: "启用自定义命名字段",
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createVNode$2(_component_VSwitch, {
              modelValue: config.value.rename_mapping_enabled,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.rename_mapping_enabled) = $event)),
              color: "orange",
              label: "启用命名规则",
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createVNode$2(_component_VSpacer),
            _createVNode$2(_component_VBtn, {
              color: "primary",
              "prepend-icon": "mdi-content-save",
              loading: __props.savingConfig,
              onClick: _cache[5] || (_cache[5] = $event => (emit('save-config')))
            }, {
              default: _withCtx$2(() => [...(_cache[70] || (_cache[70] = [
                _createTextVNode$2("保存模块开关", -1)
              ]))]),
              _: 1
            }, 8, ["loading"])
          ]),
          _: 1
        })
      ]),
      _: 1
    }),
    _createVNode$2(_component_VAlert, {
      type: "info",
      variant: "tonal",
      density: "compact",
      class: "mb-4"
    }, {
      default: _withCtx$2(() => [...(_cache[71] || (_cache[71] = [
        _createTextVNode$2(" 内置字段覆盖作用于 MP 解析结果；自定义命名字段则在文件整理的 Jinja2 渲染上下文中新增变量，不修改 MP/Rust 文件，也不会覆盖同名内置字段。 ", -1)
      ]))]),
      _: 1
    }),
    (data.value.recognition_rules?.errors?.length)
      ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
          key: 1,
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: _withCtx$2(() => [
            _createTextVNode$2(" 部分规则读取失败：" + _toDisplayString$2(data.value.recognition_rules.errors.join('；')), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$2("", true),
    _createVNode$2(_component_VTabs, {
      modelValue: section.value,
      "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((section).value = $event)),
      color: "primary",
      class: "mb-4"
    }, {
      default: _withCtx$2(() => [
        _createVNode$2(_component_VTab, {
          value: "rules",
          "prepend-icon": "mdi-text-box-search-outline"
        }, {
          default: _withCtx$2(() => [...(_cache[72] || (_cache[72] = [
            _createTextVNode$2("内置识别字段", -1)
          ]))]),
          _: 1
        }),
        _createVNode$2(_component_VTab, {
          value: "groups",
          "prepend-icon": "mdi-account-group-outline"
        }, {
          default: _withCtx$2(() => [...(_cache[73] || (_cache[73] = [
            _createTextVNode$2("制作组类型", -1)
          ]))]),
          _: 1
        }),
        _createVNode$2(_component_VTab, {
          value: "rename",
          "prepend-icon": "mdi-code-braces"
        }, {
          default: _withCtx$2(() => [...(_cache[74] || (_cache[74] = [
            _createTextVNode$2("自定义命名字段", -1)
          ]))]),
          _: 1
        }),
        _createVNode$2(_component_VTab, {
          value: "mapping",
          "prepend-icon": "mdi-rename-box-outline"
        }, {
          default: _withCtx$2(() => [...(_cache[75] || (_cache[75] = [
            _createTextVNode$2("命名规则", -1)
          ]))]),
          _: 1
        }),
        _createVNode$2(_component_VTab, {
          value: "test",
          "prepend-icon": "mdi-flask-outline"
        }, {
          default: _withCtx$2(() => [...(_cache[76] || (_cache[76] = [
            _createTextVNode$2("覆盖试算", -1)
          ]))]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    (section.value === 'rules')
      ? (_openBlock$2(), _createElementBlock$2("section", _hoisted_2$2, [
          _createElementVNode$2("div", _hoisted_3$2, [
            _createVNode$2(_component_VTextField, {
              modelValue: search.value,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((search).value = $event)),
              label: "搜索字段、名称或正则",
              "prepend-inner-icon": "mdi-magnify",
              clearable: "",
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createVNode$2(_component_VSelect, {
              modelValue: field.value,
              "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((field).value = $event)),
              label: "识别字段",
              items: fieldItems.value,
              "hide-details": ""
            }, null, 8, ["modelValue", "items"]),
            _createVNode$2(_component_VSelect, {
              modelValue: source.value,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((source).value = $event)),
              label: "规则来源",
              items: sourceItems,
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createVNode$2(_component_VBtn, {
              color: "primary",
              "prepend-icon": "mdi-plus",
              onClick: openNewRule
            }, {
              default: _withCtx$2(() => [...(_cache[77] || (_cache[77] = [
                _createTextVNode$2("新增覆盖", -1)
              ]))]),
              _: 1
            })
          ]),
          _createElementVNode$2("div", _hoisted_4$2, "当前 MP 共读取 " + _toDisplayString$2(data.value.recognition_rules?.count || 0) + " 条，已覆盖 " + _toDisplayString$2(data.value.recognition_rules?.override_count || 0) + " 条；筛选结果 " + _toDisplayString$2(rules.value.length) + " 条。", 1),
          _createVNode$2(_component_VTable, {
            density: "comfortable",
            class: "tools-table"
          }, {
            default: _withCtx$2(() => [
              _cache[80] || (_cache[80] = _createElementVNode$2("thead", null, [
                _createElementVNode$2("tr", null, [
                  _createElementVNode$2("th", { style: {"width":"150px"} }, "字段"),
                  _createElementVNode$2("th", null, "MP 内置匹配内容"),
                  _createElementVNode$2("th", { style: {"width":"190px"} }, "来源"),
                  _createElementVNode$2("th", { style: {"width":"150px"} }, "操作")
                ])
              ], -1)),
              _createElementVNode$2("tbody", null, [
                (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(pagedRules.value, (item) => {
                  return (_openBlock$2(), _createElementBlock$2("tr", {
                    key: item.id
                  }, [
                    _createElementVNode$2("td", null, [
                      _createElementVNode$2("div", _hoisted_5$1, _toDisplayString$2(item.field_label), 1),
                      _createElementVNode$2("code", null, _toDisplayString$2(item.field), 1)
                    ]),
                    _createElementVNode$2("td", null, [
                      _createElementVNode$2("div", _hoisted_6$1, [
                        _createElementVNode$2("span", null, _toDisplayString$2(item.effective?.label || item.label), 1),
                        (item.overridden)
                          ? (_openBlock$2(), _createBlock$2(_component_VChip, {
                              key: 0,
                              size: "x-small",
                              color: "warning",
                              variant: "tonal"
                            }, {
                              default: _withCtx$2(() => [...(_cache[78] || (_cache[78] = [
                                _createTextVNode$2("插件已覆盖", -1)
                              ]))]),
                              _: 1
                            }))
                          : _createCommentVNode$2("", true)
                      ]),
                      _createElementVNode$2("div", {
                        class: "rule-pattern",
                        title: item.effective?.pattern || item.pattern
                      }, _toDisplayString$2(item.effective?.pattern || item.pattern), 9, _hoisted_7$1),
                      (item.overridden && item.builtin && item.effective?.pattern !== item.pattern)
                        ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_8$1, "MP 原正则：" + _toDisplayString$2(item.pattern), 1))
                        : _createCommentVNode$2("", true),
                      _createElementVNode$2("div", _hoisted_9$1, _toDisplayString$2(item.effective?.action === 'clear' ? '命中后清空字段' : `输出：${item.effective?.value ?? item.value}`), 1)
                    ]),
                    _createElementVNode$2("td", null, [
                      _createVNode$2(_component_VChip, {
                        size: "small",
                        variant: "tonal"
                      }, {
                        default: _withCtx$2(() => [
                          _createTextVNode$2(_toDisplayString$2(item.source_label), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _createElementVNode$2("td", null, [
                      _createVNode$2(_component_VBtn, {
                        size: "small",
                        variant: "tonal",
                        "prepend-icon": "mdi-pencil-outline",
                        onClick: $event => (openRule(item))
                      }, {
                        default: _withCtx$2(() => [...(_cache[79] || (_cache[79] = [
                          _createTextVNode$2("编辑", -1)
                        ]))]),
                        _: 1
                      }, 8, ["onClick"]),
                      (item.overridden)
                        ? (_openBlock$2(), _createBlock$2(_component_VBtn, {
                            key: 0,
                            size: "small",
                            variant: "text",
                            color: "warning",
                            loading: saving.value === `reset:${item.id}`,
                            onClick: $event => (resetRule(item))
                          }, {
                            default: _withCtx$2(() => [
                              _createTextVNode$2(_toDisplayString$2(item.builtin ? '恢复' : '删除'), 1)
                            ]),
                            _: 2
                          }, 1032, ["loading", "onClick"]))
                        : _createCommentVNode$2("", true)
                    ])
                  ]))
                }), 128))
              ])
            ]),
            _: 1
          }),
          (pageCount.value > 1)
            ? (_openBlock$2(), _createBlock$2(_component_VPagination, {
                key: 0,
                modelValue: page.value,
                "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((page).value = $event)),
                length: pageCount.value,
                "total-visible": 7,
                class: "mt-3"
              }, null, 8, ["modelValue", "length"]))
            : _createCommentVNode$2("", true)
        ]))
      : (section.value === 'groups')
        ? (_openBlock$2(), _createElementBlock$2("section", _hoisted_10$1, [
            _createElementVNode$2("div", _hoisted_11$1, [
              _createVNode$2(_component_VTextField, {
                modelValue: search.value,
                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((search).value = $event)),
                label: "搜索制作组或正则",
                "prepend-inner-icon": "mdi-magnify",
                clearable: "",
                "hide-details": ""
              }, null, 8, ["modelValue"]),
              _createVNode$2(_component_VSelect, {
                modelValue: groupKind.value,
                "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((groupKind).value = $event)),
                label: "参与判断的类型",
                items: [{title:'全部类型',value:'all'}, ...kindItems],
                "hide-details": ""
              }, null, 8, ["modelValue", "items"])
            ]),
            _createVNode$2(_component_VTable, {
              density: "comfortable",
              class: "tools-table"
            }, {
              default: _withCtx$2(() => [
                _cache[81] || (_cache[81] = _createElementVNode$2("thead", null, [
                  _createElementVNode$2("tr", null, [
                    _createElementVNode$2("th", null, "制作组规则"),
                    _createElementVNode$2("th", null, "来源"),
                    _createElementVNode$2("th", { style: {"width":"230px"} }, "类型")
                  ])
                ], -1)),
                _createElementVNode$2("tbody", null, [
                  (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(pagedGroups.value, (item) => {
                    return (_openBlock$2(), _createElementBlock$2("tr", {
                      key: item.id
                    }, [
                      _createElementVNode$2("td", null, [
                        _createElementVNode$2("div", _hoisted_12$1, _toDisplayString$2(item.display_name), 1),
                        _createElementVNode$2("div", _hoisted_13$1, _toDisplayString$2(item.pattern), 1)
                      ]),
                      _createElementVNode$2("td", null, [
                        _createVNode$2(_component_VChip, {
                          size: "small",
                          variant: "tonal"
                        }, {
                          default: _withCtx$2(() => [
                            _createTextVNode$2(_toDisplayString$2(item.source_label) + " · " + _toDisplayString$2(item.category), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _createElementVNode$2("td", null, [
                        _createVNode$2(_component_VSelect, {
                          "model-value": item.kind,
                          items: kindItems,
                          density: "compact",
                          "hide-details": "",
                          loading: saving.value === item.id,
                          "onUpdate:modelValue": value => saveGroup(item, value)
                        }, {
                          selection: _withCtx$2(() => [
                            _createVNode$2(_component_VChip, {
                              size: "small",
                              color: kindColor(item.kind),
                              variant: "tonal"
                            }, {
                              default: _withCtx$2(() => [
                                _createTextVNode$2(_toDisplayString$2(kindLabel(item.kind)), 1)
                              ]),
                              _: 2
                            }, 1032, ["color"])
                          ]),
                          _: 2
                        }, 1032, ["model-value", "loading", "onUpdate:modelValue"])
                      ])
                    ]))
                  }), 128))
                ])
              ]),
              _: 1
            }),
            (groupPageCount.value > 1)
              ? (_openBlock$2(), _createBlock$2(_component_VPagination, {
                  key: 0,
                  modelValue: page.value,
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((page).value = $event)),
                  length: groupPageCount.value,
                  "total-visible": 7,
                  class: "mt-3"
                }, null, 8, ["modelValue", "length"]))
              : _createCommentVNode$2("", true)
          ]))
        : (section.value === 'rename')
          ? (_openBlock$2(), _createElementBlock$2("section", _hoisted_14$1, [
              _createElementVNode$2("div", _hoisted_15$1, [
                _cache[83] || (_cache[83] = _createElementVNode$2("div", { class: "flex-grow-1" }, [
                  _createElementVNode$2("div", { class: "text-h6" }, "Jinja2 自定义字段"),
                  _createElementVNode$2("div", { class: "text-body-2 text-medium-emphasis" }, [
                    _createTextVNode$2("保存后可在 MP 命名模板中直接使用 "),
                    _createElementVNode$2("code", null, "{{ your_field }}"),
                    _createTextVNode$2("；固定文字可直接填写，条件与组合可使用 Jinja2。")
                  ])
                ], -1)),
                _createVNode$2(_component_VBtn, {
                  color: "primary",
                  "prepend-icon": "mdi-plus",
                  onClick: _cache[14] || (_cache[14] = $event => (openRenameField()))
                }, {
                  default: _withCtx$2(() => [...(_cache[82] || (_cache[82] = [
                    _createTextVNode$2("新增字段", -1)
                  ]))]),
                  _: 1
                })
              ]),
              (!data.value.capabilities?.custom_independent_field)
                ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
                    key: 0,
                    type: "warning",
                    variant: "tonal",
                    class: "mb-4"
                  }, {
                    default: _withCtx$2(() => [...(_cache[84] || (_cache[84] = [
                      _createTextVNode$2("当前 MP 不支持渲染前上下文事件，无法注入自定义字段。请更新 MoviePilot。", -1)
                    ]))]),
                    _: 1
                  }))
                : _createCommentVNode$2("", true),
              _createVNode$2(_component_VCard, { variant: "outlined" }, {
                default: _withCtx$2(() => [
                  _createVNode$2(_component_VCardItem, null, {
                    default: _withCtx$2(() => [
                      _createVNode$2(_component_VCardTitle, null, {
                        default: _withCtx$2(() => [...(_cache[85] || (_cache[85] = [
                          _createTextVNode$2("已定义字段", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode$2(_component_VCardSubtitle, null, {
                        default: _withCtx$2(() => [
                          _createTextVNode$2(_toDisplayString$2(customFields.value.length) + " 个字段 · 支持字段间依赖", 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  _createVNode$2(_component_VCardText, null, {
                    default: _withCtx$2(() => [
                      (customFields.value.length)
                        ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_16$1, [
                            (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(customFields.value, (item) => {
                              return (_openBlock$2(), _createElementBlock$2("div", {
                                key: item.key,
                                class: "custom-field-row"
                              }, [
                                _createElementVNode$2("div", _hoisted_17$1, [
                                  _createElementVNode$2("div", _hoisted_18$1, [
                                    _createElementVNode$2("code", null, _toDisplayString$2(item.key), 1),
                                    _createVNode$2(_component_VChip, {
                                      size: "x-small",
                                      color: item.enabled ? 'success' : 'default',
                                      variant: "tonal"
                                    }, {
                                      default: _withCtx$2(() => [
                                        _createTextVNode$2(_toDisplayString$2(item.enabled ? '启用' : '停用'), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["color"])
                                  ]),
                                  _createElementVNode$2("div", _hoisted_19$1, _toDisplayString$2(item.label || item.key), 1),
                                  _createElementVNode$2("div", {
                                    class: "rule-pattern text-truncate",
                                    title: item.expression
                                  }, _toDisplayString$2(item.expression), 9, _hoisted_20$1),
                                  (item.dependencies?.length)
                                    ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_21$1, "依赖：" + _toDisplayString$2(item.dependencies.join('、')), 1))
                                    : _createCommentVNode$2("", true)
                                ]),
                                _createVNode$2(_component_VBtn, {
                                  icon: "mdi-content-copy",
                                  size: "small",
                                  variant: "text",
                                  title: "复制模板变量",
                                  onClick: $event => (copyVariable(item.key))
                                }, null, 8, ["onClick"]),
                                _createVNode$2(_component_VBtn, {
                                  icon: "mdi-pencil-outline",
                                  size: "small",
                                  variant: "text",
                                  onClick: $event => (openRenameField(item))
                                }, null, 8, ["onClick"]),
                                _createVNode$2(_component_VBtn, {
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
                        : (_openBlock$2(), _createElementBlock$2("div", _hoisted_22$1, [
                            _createVNode$2(_component_VIcon, {
                              icon: "mdi-code-braces",
                              size: "48"
                            }),
                            _cache[86] || (_cache[86] = _createElementVNode$2("div", { class: "mt-2" }, "尚未定义自定义字段", -1))
                          ]))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode$2(_component_VCard, {
                variant: "outlined",
                class: "mt-4"
              }, {
                default: _withCtx$2(() => [
                  _createVNode$2(_component_VCardItem, null, {
                    default: _withCtx$2(() => [
                      _createVNode$2(_component_VCardTitle, null, {
                        default: _withCtx$2(() => [...(_cache[87] || (_cache[87] = [
                          _createTextVNode$2("上下文试算", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode$2(_component_VCardSubtitle, null, {
                        default: _withCtx$2(() => [...(_cache[88] || (_cache[88] = [
                          _createTextVNode$2("手工构造一次命名上下文，只验证自定义字段输出，不执行文件整理。", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  _createVNode$2(_component_VCardText, null, {
                    default: _withCtx$2(() => [
                      _createElementVNode$2("div", _hoisted_23$1, [
                        _createVNode$2(_component_VTextarea, {
                          modelValue: renamePreviewInput.value.original_name,
                          "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((renamePreviewInput.value.original_name) = $event)),
                          label: "MP 原始标题 original_name",
                          rows: "2",
                          "hide-details": "",
                          class: "preview-original"
                        }, null, 8, ["modelValue"]),
                        _createVNode$2(_component_VTextField, {
                          modelValue: renamePreviewInput.value.type,
                          "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((renamePreviewInput.value.type) = $event)),
                          label: "媒体类型 type",
                          "hide-details": ""
                        }, null, 8, ["modelValue"]),
                        _createVNode$2(_component_VTextField, {
                          modelValue: renamePreviewInput.value.category,
                          "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((renamePreviewInput.value.category) = $event)),
                          label: "二级分类 category",
                          "hide-details": ""
                        }, null, 8, ["modelValue"]),
                        _createVNode$2(_component_VTextField, {
                          modelValue: renamePreviewInput.value.source_path,
                          "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((renamePreviewInput.value.source_path) = $event)),
                          label: "真实源路径 source_path",
                          "hide-details": "",
                          class: "preview-wide"
                        }, null, 8, ["modelValue"]),
                        _createVNode$2(_component_VTextField, {
                          modelValue: renamePreviewInput.value.target_dir,
                          "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((renamePreviewInput.value.target_dir) = $event)),
                          label: "分类后目标根目录 target_dir",
                          "hide-details": "",
                          class: "preview-wide"
                        }, null, 8, ["modelValue"]),
                        _createVNode$2(_component_VBtn, {
                          color: "secondary",
                          "prepend-icon": "mdi-play",
                          loading: renamePreviewing.value,
                          class: "preview-wide",
                          onClick: previewRenameFields
                        }, {
                          default: _withCtx$2(() => [...(_cache[89] || (_cache[89] = [
                            _createTextVNode$2("试算全部字段", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      (renamePreview.value)
                        ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_24$1, [
                            (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(renamePreview.value.values, (value, key) => {
                              return (_openBlock$2(), _createElementBlock$2("div", {
                                key: key,
                                class: "d-flex justify-space-between ga-3"
                              }, [
                                _createElementVNode$2("code", null, _toDisplayString$2(key), 1),
                                _createElementVNode$2("span", _hoisted_25$1, _toDisplayString$2(value || '（空）'), 1)
                              ]))
                            }), 128)),
                            (renamePreview.value.errors?.length)
                              ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
                                  key: 0,
                                  type: "warning",
                                  variant: "tonal",
                                  density: "compact",
                                  class: "mt-3"
                                }, {
                                  default: _withCtx$2(() => [
                                    _createTextVNode$2(_toDisplayString$2(renamePreview.value.errors.map(item => `${item.key}: ${item.message}`).join('；')), 1)
                                  ]),
                                  _: 1
                                }))
                              : _createCommentVNode$2("", true)
                          ]))
                        : _createCommentVNode$2("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode$2(_component_VCard, {
                variant: "outlined",
                class: "mt-4"
              }, {
                default: _withCtx$2(() => [
                  _createVNode$2(_component_VCardItem, null, {
                    default: _withCtx$2(() => [
                      _createVNode$2(_component_VCardTitle, null, {
                        default: _withCtx$2(() => [...(_cache[90] || (_cache[90] = [
                          _createTextVNode$2("可用于文件命名的输入字段", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode$2(_component_VCardSubtitle, null, {
                        default: _withCtx$2(() => [...(_cache[91] || (_cache[91] = [
                          _createTextVNode$2("这里只列出命名渲染时真实存在的字段；种子信息和整理完成结果不会进入文件命名上下文。", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  _createVNode$2(_component_VCardText, null, {
                    default: _withCtx$2(() => [
                      _createVNode$2(_component_VAlert, {
                        type: "info",
                        variant: "tonal",
                        density: "compact",
                        class: "mb-4"
                      }, {
                        default: _withCtx$2(() => [...(_cache[92] || (_cache[92] = [
                          _createTextVNode$2("目标目录相关字段是在 MP 首次渲染之后、实际复制/移动/链接之前取得的。插件会据此重渲染一次，所以它们仍能影响最终命名，并不是整理完成后的结果。", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode$2(_component_VTextField, {
                        modelValue: renameFieldSearch.value,
                        "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((renameFieldSearch).value = $event)),
                        label: "搜索字段名称、变量或用途",
                        "prepend-inner-icon": "mdi-magnify",
                        clearable: "",
                        "hide-details": "",
                        class: "mb-4"
                      }, null, 8, ["modelValue"]),
                      _createVNode$2(_component_VExpansionPanels, {
                        modelValue: openRenameFieldGroups.value,
                        "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((openRenameFieldGroups).value = $event)),
                        multiple: "",
                        variant: "accordion",
                        class: "field-panels"
                      }, {
                        default: _withCtx$2(() => [
                          (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(renameFieldGroups.value, (group) => {
                            return (_openBlock$2(), _createBlock$2(_component_VExpansionPanel, {
                              key: group.category,
                              value: group.category
                            }, {
                              default: _withCtx$2(() => [
                                _createVNode$2(_component_VExpansionPanelTitle, null, {
                                  default: _withCtx$2(() => [
                                    _createElementVNode$2("div", _hoisted_26$1, [
                                      _createElementVNode$2("span", _hoisted_27$1, _toDisplayString$2(group.category), 1),
                                      _createVNode$2(_component_VChip, {
                                        size: "x-small",
                                        variant: "tonal"
                                      }, {
                                        default: _withCtx$2(() => [
                                          _createTextVNode$2(_toDisplayString$2(group.items.length) + " 项", 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ])
                                  ]),
                                  _: 2
                                }, 1024),
                                _createVNode$2(_component_VExpansionPanelText, null, {
                                  default: _withCtx$2(() => [
                                    _createElementVNode$2("div", _hoisted_28$1, [
                                      (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(group.items, (item) => {
                                        return (_openBlock$2(), _createElementBlock$2("button", {
                                          key: item.key,
                                          type: "button",
                                          class: "field-description-card",
                                          onClick: $event => (copyVariable(item.key))
                                        }, [
                                          _createElementVNode$2("div", _hoisted_30$1, [
                                            _createElementVNode$2("code", null, _toDisplayString$2(item.key), 1),
                                            _createVNode$2(_component_VChip, {
                                              size: "x-small",
                                              variant: "tonal",
                                              color: "secondary"
                                            }, {
                                              default: _withCtx$2(() => [
                                                _createTextVNode$2(_toDisplayString$2(item.availability || '按上下文可用'), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _createElementVNode$2("div", _hoisted_31$1, _toDisplayString$2(item.label), 1),
                                          _createElementVNode$2("div", _hoisted_32$1, _toDisplayString$2(item.description), 1),
                                          _createElementVNode$2("div", _hoisted_33$1, [
                                            _createVNode$2(_component_VIcon, {
                                              icon: copiedVariable.value === item.key ? 'mdi-check' : 'mdi-content-copy',
                                              size: "14"
                                            }, null, 8, ["icon"]),
                                            _createTextVNode$2(" " + _toDisplayString$2(copiedVariable.value === item.key ? '已复制' : '点击复制') + " ", 1),
                                            _createElementVNode$2("code", null, _toDisplayString$2(variableSyntax(item.key)), 1)
                                          ])
                                        ], 8, _hoisted_29$1))
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
                        ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_34$1, "没有匹配的字段"))
                        : _createCommentVNode$2("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]))
          : (section.value === 'mapping')
            ? (_openBlock$2(), _createElementBlock$2("section", _hoisted_35$1, [
                _cache[117] || (_cache[117] = _createElementVNode$2("div", { class: "d-flex align-center flex-wrap ga-3 mb-4" }, [
                  _createElementVNode$2("div", { class: "flex-grow-1" }, [
                    _createElementVNode$2("div", { class: "text-h6" }, "统一命名规则"),
                    _createElementVNode$2("div", { class: "text-body-2 text-medium-emphasis" }, "先编排制作组；MP 完成首次命名及字幕后缀后，再对完整相对路径统一二次渲染一次。")
                  ])
                ], -1)),
                _createVNode$2(_component_VCard, {
                  variant: "outlined",
                  class: "mb-4 naming-defaults-card"
                }, {
                  default: _withCtx$2(() => [
                    _createVNode$2(_component_VCardItem, null, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VCardTitle, null, {
                          default: _withCtx$2(() => [...(_cache[93] || (_cache[93] = [
                            _createTextVNode$2("命名连接与分隔默认值", -1)
                          ]))]),
                          _: 1
                        }),
                        _createVNode$2(_component_VCardSubtitle, null, {
                          default: _withCtx$2(() => [...(_cache[94] || (_cache[94] = [
                            _createTextVNode$2("全局值只作用于选择的字段或未指定连接符的制作组；单条制作组规则仍可覆盖。", -1)
                          ]))]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    _createVNode$2(_component_VCardText, null, {
                      default: _withCtx$2(() => [
                        (config.value.enabled && data.value.capabilities?.customization_separator === false)
                          ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
                              key: 0,
                              type: "warning",
                              variant: "tonal",
                              density: "compact",
                              class: "mb-4"
                            }, {
                              default: _withCtx$2(() => [
                                _createTextVNode$2(_toDisplayString$2(data.value.capabilities?.customization_separator_message || '当前 MP 无法动态设置自定义占位符连接符。'), 1)
                              ]),
                              _: 1
                            }))
                          : _createCommentVNode$2("", true),
                        _createElementVNode$2("div", _hoisted_36$1, [
                          _createVNode$2(_component_VCombobox, {
                            modelValue: config.value.rename_default_separator,
                            "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((config.value.rename_default_separator) = $event)),
                            label: "字段空白分隔符",
                            items: separatorOptions,
                            "item-title": "title",
                            "item-value": "value",
                            "return-object": false,
                            clearable: "",
                            hint: "留空关闭；例如 WEB DL → WEB.DL",
                            "persistent-hint": ""
                          }, null, 8, ["modelValue"]),
                          _createVNode$2(_component_VCombobox, {
                            modelValue: config.value.customization_separator,
                            "onUpdate:modelValue": _cache[23] || (_cache[23] = $event => ((config.value.customization_separator) = $event)),
                            label: "自定义占位符连接符",
                            items: separatorOptions,
                            "item-title": "title",
                            "item-value": "value",
                            "return-object": false,
                            hint: "多个 customization 命中结果的连接符",
                            "persistent-hint": ""
                          }, null, 8, ["modelValue"]),
                          _createVNode$2(_component_VCombobox, {
                            modelValue: config.value.release_group_default_connector,
                            "onUpdate:modelValue": _cache[24] || (_cache[24] = $event => ((config.value.release_group_default_connector) = $event)),
                            label: "制作组默认连接符",
                            items: separatorOptions,
                            "item-title": "title",
                            "item-value": "value",
                            "return-object": false,
                            hint: "用于未配置组和选择“使用默认”的规则",
                            "persistent-hint": ""
                          }, null, 8, ["modelValue"]),
                          _createVNode$2(_component_VSelect, {
                            modelValue: config.value.rename_separator_fields,
                            "onUpdate:modelValue": _cache[25] || (_cache[25] = $event => ((config.value.rename_separator_fields) = $event)),
                            class: "separator-scope",
                            label: "字段空白分隔符生效范围",
                            items: separatorFieldItems.value,
                            multiple: "",
                            chips: "",
                            "closable-chips": "",
                            clearable: "",
                            hint: "只修改字段内部的空白；不会全局替换路径中的空格",
                            "persistent-hint": ""
                          }, null, 8, ["modelValue", "items"])
                        ])
                      ]),
                      _: 1
                    }),
                    _createVNode$2(_component_VDivider),
                    _createVNode$2(_component_VCardActions, null, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VSpacer),
                        _createVNode$2(_component_VBtn, {
                          color: "primary",
                          "prepend-icon": "mdi-content-save",
                          loading: __props.savingConfig,
                          onClick: _cache[26] || (_cache[26] = $event => (emit('save-config')))
                        }, {
                          default: _withCtx$2(() => [...(_cache[95] || (_cache[95] = [
                            _createTextVNode$2("保存命名默认值", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$2(_component_VTabs, {
                  modelValue: renameRuleSection.value,
                  "onUpdate:modelValue": _cache[27] || (_cache[27] = $event => ((renameRuleSection).value = $event)),
                  color: "secondary",
                  class: "sub-tabs mb-4"
                }, {
                  default: _withCtx$2(() => [
                    _createVNode$2(_component_VTab, {
                      value: "groups",
                      "prepend-icon": "mdi-account-multiple-check-outline"
                    }, {
                      default: _withCtx$2(() => [...(_cache[96] || (_cache[96] = [
                        _createTextVNode$2("制作组编排", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$2(_component_VTab, {
                      value: "text",
                      "prepend-icon": "mdi-find-replace"
                    }, {
                      default: _withCtx$2(() => [...(_cache[97] || (_cache[97] = [
                        _createTextVNode$2("文本映射", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                (renameRuleSection.value === 'groups')
                  ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_37$1, [
                      _createElementVNode$2("div", _hoisted_38$1, [
                        _createVNode$2(_component_VAlert, {
                          type: "info",
                          variant: "tonal",
                          density: "compact",
                          class: "flex-grow-1 mb-0"
                        }, {
                          default: _withCtx$2(() => [...(_cache[98] || (_cache[98] = [
                            _createTextVNode$2("为每个制作组指定别名、最终名称、固定位置和它前面的连接符；未配置的组保持原名与相对顺序。", -1)
                          ]))]),
                          _: 1
                        }),
                        _createVNode$2(_component_VBtn, {
                          color: "primary",
                          "prepend-icon": "mdi-plus",
                          onClick: _cache[28] || (_cache[28] = $event => (openGroupArrangement()))
                        }, {
                          default: _withCtx$2(() => [...(_cache[99] || (_cache[99] = [
                            _createTextVNode$2("新增制作组规则", -1)
                          ]))]),
                          _: 1
                        })
                      ]),
                      (data.value.release_group_arrangements?.errors?.length)
                        ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
                            key: 0,
                            type: "warning",
                            variant: "tonal",
                            density: "compact",
                            class: "mb-4"
                          }, {
                            default: _withCtx$2(() => [
                              _createTextVNode$2(_toDisplayString$2(data.value.release_group_arrangements.errors.join('；')), 1)
                            ]),
                            _: 1
                          }))
                        : _createCommentVNode$2("", true),
                      (groupArrangementRules.value.length)
                        ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_39$1, [
                            (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(groupArrangementRules.value, (item) => {
                              return (_openBlock$2(), _createBlock$2(_component_VCard, {
                                key: item.id,
                                variant: "outlined",
                                class: "mapping-card"
                              }, {
                                default: _withCtx$2(() => [
                                  _createVNode$2(_component_VCardText, { class: "group-layout-card" }, {
                                    default: _withCtx$2(() => [
                                      _createElementVNode$2("div", _hoisted_40$1, [
                                        _createElementVNode$2("div", _hoisted_41$1, [
                                          _createElementVNode$2("span", _hoisted_42$1, _toDisplayString$2(item.label || item.output_name), 1),
                                          _createVNode$2(_component_VChip, {
                                            size: "x-small",
                                            color: "primary",
                                            variant: "tonal"
                                          }, {
                                            default: _withCtx$2(() => [
                                              _createTextVNode$2(_toDisplayString$2(groupPositionLabel(item.position)), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          (!item.enabled)
                                            ? (_openBlock$2(), _createBlock$2(_component_VChip, {
                                                key: 0,
                                                size: "x-small",
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx$2(() => [...(_cache[100] || (_cache[100] = [
                                                  _createTextVNode$2("已停用", -1)
                                                ]))]),
                                                _: 1
                                              }))
                                            : _createCommentVNode$2("", true)
                                        ]),
                                        _createElementVNode$2("div", _hoisted_43$1, [
                                          _createElementVNode$2("code", null, _toDisplayString$2(item.match_name), 1),
                                          _createVNode$2(_component_VIcon, {
                                            icon: "mdi-arrow-right",
                                            size: "16"
                                          }),
                                          _createElementVNode$2("code", null, _toDisplayString$2(item.output_name), 1)
                                        ]),
                                        _createElementVNode$2("div", _hoisted_44$1, [
                                          _createTextVNode$2("别名 " + _toDisplayString$2(item.aliases?.length ? item.aliases.join('、') : '无') + " · 前置连接符 ", 1),
                                          _createElementVNode$2("code", null, _toDisplayString$2(item.connector === '__default__' ? `默认（${config.value.release_group_default_connector === ' ' ? '空格' : config.value.release_group_default_connector || '@'}）` : item.connector === ' ' ? '空格' : item.connector || '无'), 1),
                                          _createTextVNode$2(" · 排序值 " + _toDisplayString$2(item.order), 1)
                                        ])
                                      ]),
                                      _createElementVNode$2("div", _hoisted_45$1, [
                                        _createVNode$2(_component_VBtn, {
                                          icon: "mdi-pencil-outline",
                                          size: "small",
                                          variant: "text",
                                          onClick: $event => (openGroupArrangement(item))
                                        }, null, 8, ["onClick"]),
                                        _createVNode$2(_component_VBtn, {
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
                        : (_openBlock$2(), _createElementBlock$2("div", _hoisted_46$1, [
                            _createVNode$2(_component_VIcon, {
                              icon: "mdi-account-switch-outline",
                              size: "48"
                            }),
                            _cache[101] || (_cache[101] = _createElementVNode$2("div", { class: "mt-2" }, "尚未设置制作组编排", -1)),
                            _cache[102] || (_cache[102] = _createElementVNode$2("div", { class: "text-caption mt-1" }, "例如让 VCB-Studio 固定最后并使用 &，让 ADWeb 固定最后并使用 @", -1))
                          ])),
                      _createVNode$2(_component_VCard, {
                        variant: "outlined",
                        class: "mt-4"
                      }, {
                        default: _withCtx$2(() => [
                          _createVNode$2(_component_VCardItem, null, {
                            default: _withCtx$2(() => [
                              _createVNode$2(_component_VCardTitle, null, {
                                default: _withCtx$2(() => [...(_cache[103] || (_cache[103] = [
                                  _createTextVNode$2("制作组编排试算", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode$2(_component_VCardSubtitle, null, {
                                default: _withCtx$2(() => [...(_cache[104] || (_cache[104] = [
                                  _createTextVNode$2("按 MP 的 releaseGroup 字段格式输入，支持 @、&、+ 形式。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode$2(_component_VCardText, null, {
                            default: _withCtx$2(() => [
                              _createElementVNode$2("div", _hoisted_47$1, [
                                _createVNode$2(_component_VTextField, {
                                  modelValue: groupArrangementPreviewInput.value,
                                  "onUpdate:modelValue": _cache[29] || (_cache[29] = $event => ((groupArrangementPreviewInput).value = $event)),
                                  label: "输入制作组",
                                  placeholder: "ADWeb@A@VCB",
                                  "hide-details": ""
                                }, null, 8, ["modelValue"]),
                                _createVNode$2(_component_VBtn, {
                                  color: "secondary",
                                  "prepend-icon": "mdi-play",
                                  loading: saving.value === 'group-arrangement-preview',
                                  onClick: previewGroupArrangement
                                }, {
                                  default: _withCtx$2(() => [...(_cache[105] || (_cache[105] = [
                                    _createTextVNode$2("开始试算", -1)
                                  ]))]),
                                  _: 1
                                }, 8, ["loading"])
                              ]),
                              (groupArrangementPreview.value)
                                ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
                                    key: 0,
                                    type: groupArrangementPreview.value.trace?.applied ? 'success' : 'info',
                                    variant: "tonal",
                                    class: "mt-4"
                                  }, {
                                    default: _withCtx$2(() => [
                                      _createElementVNode$2("div", null, [
                                        _cache[106] || (_cache[106] = _createTextVNode$2("输出：", -1)),
                                        _createElementVNode$2("code", null, _toDisplayString$2(groupArrangementPreview.value.output), 1)
                                      ]),
                                      _createElementVNode$2("div", _hoisted_48$1, _toDisplayString$2(groupArrangementPreview.value.trace?.reason), 1),
                                      (groupArrangementPreview.value.trace?.members?.length)
                                        ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_49$1, [
                                            (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(groupArrangementPreview.value.trace.members, (member, index) => {
                                              return (_openBlock$2(), _createBlock$2(_component_VChip, {
                                                key: `${member.output}-${index}`,
                                                size: "small",
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx$2(() => [
                                                  index
                                                    ? (_openBlock$2(), _createElementBlock$2("span", _hoisted_50$1, _toDisplayString$2(member.connector === ' ' ? '空格' : member.connector), 1))
                                                    : _createCommentVNode$2("", true),
                                                  _createTextVNode$2(_toDisplayString$2(member.output) + " · " + _toDisplayString$2(groupPositionLabel(member.position)), 1)
                                                ]),
                                                _: 2
                                              }, 1024))
                                            }), 128))
                                          ]))
                                        : _createCommentVNode$2("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["type"]))
                                : _createCommentVNode$2("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]))
                  : (_openBlock$2(), _createElementBlock$2("div", _hoisted_51$1, [
                      _createElementVNode$2("div", _hoisted_52$1, [
                        _createVNode$2(_component_VAlert, {
                          type: "info",
                          variant: "tonal",
                          density: "compact",
                          class: "flex-grow-1 mb-0"
                        }, {
                          default: _withCtx$2(() => [...(_cache[107] || (_cache[107] = [
                            _createTextVNode$2("无需判断标题、目录还是字幕。把 MP 的完整首次结果当作输入，例如 ", -1),
                            _createElementVNode$2("code", null, "AB/C.chi.zh-cn.ass", -1),
                            _createTextVNode$2("，规则连续执行后得到最终路径。", -1)
                          ]))]),
                          _: 1
                        }),
                        _createVNode$2(_component_VBtn, {
                          variant: "tonal",
                          color: "secondary",
                          "prepend-icon": "mdi-closed-caption-outline",
                          onClick: addSubtitleMappingPreset
                        }, {
                          default: _withCtx$2(() => [...(_cache[108] || (_cache[108] = [
                            _createTextVNode$2("添加简繁字幕预设", -1)
                          ]))]),
                          _: 1
                        }),
                        _createVNode$2(_component_VBtn, {
                          color: "primary",
                          "prepend-icon": "mdi-plus",
                          onClick: _cache[30] || (_cache[30] = $event => (openMappingRule()))
                        }, {
                          default: _withCtx$2(() => [...(_cache[109] || (_cache[109] = [
                            _createTextVNode$2("新增文本映射", -1)
                          ]))]),
                          _: 1
                        })
                      ]),
                      (!data.value.rename_mappings?.subtitle_compatible)
                        ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
                            key: 0,
                            type: "warning",
                            variant: "tonal",
                            density: "compact",
                            class: "mb-4"
                          }, {
                            default: _withCtx$2(() => [
                              _createTextVNode$2(_toDisplayString$2(data.value.rename_mappings?.subtitle_message || '当前 MP 暂不支持在字幕语言后缀生成后执行；视频最终命名仍可使用。'), 1)
                            ]),
                            _: 1
                          }))
                        : _createCommentVNode$2("", true),
                      (mappingRules.value.length)
                        ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_53$1, [
                            (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(mappingRules.value, (item) => {
                              return (_openBlock$2(), _createBlock$2(_component_VCard, {
                                key: item.id,
                                variant: "outlined",
                                class: "mapping-card"
                              }, {
                                default: _withCtx$2(() => [
                                  _createVNode$2(_component_VCardText, { class: "d-flex align-start ga-3" }, {
                                    default: _withCtx$2(() => [
                                      _createVNode$2(_component_VAvatar, {
                                        color: item.stage === 'release_group' ? 'primary' : 'orange',
                                        variant: "tonal",
                                        size: "38"
                                      }, {
                                        default: _withCtx$2(() => [
                                          _createVNode$2(_component_VIcon, {
                                            icon: item.stage === 'release_group' ? 'mdi-account-group-outline' : 'mdi-find-replace'
                                          }, null, 8, ["icon"])
                                        ]),
                                        _: 2
                                      }, 1032, ["color"]),
                                      _createElementVNode$2("div", _hoisted_54$1, [
                                        _createElementVNode$2("div", _hoisted_55$1, [
                                          _createElementVNode$2("span", _hoisted_56$1, _toDisplayString$2(item.label), 1),
                                          _createVNode$2(_component_VChip, {
                                            size: "x-small",
                                            variant: "tonal"
                                          }, {
                                            default: _withCtx$2(() => [
                                              _createTextVNode$2(_toDisplayString$2(mappingStageLabel(item.stage)), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          _createVNode$2(_component_VChip, {
                                            size: "x-small",
                                            color: item.mode === 'regex' ? 'warning' : 'default',
                                            variant: "tonal"
                                          }, {
                                            default: _withCtx$2(() => [
                                              _createTextVNode$2(_toDisplayString$2(item.mode === 'regex' ? '正则' : '字面'), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"]),
                                          (!item.enabled)
                                            ? (_openBlock$2(), _createBlock$2(_component_VChip, {
                                                key: 0,
                                                size: "x-small",
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx$2(() => [...(_cache[110] || (_cache[110] = [
                                                  _createTextVNode$2("已停用", -1)
                                                ]))]),
                                                _: 1
                                              }))
                                            : _createCommentVNode$2("", true)
                                        ]),
                                        _createElementVNode$2("div", _hoisted_57$1, [
                                          _createElementVNode$2("code", null, _toDisplayString$2(item.pattern), 1),
                                          _createVNode$2(_component_VIcon, {
                                            icon: "mdi-arrow-right",
                                            size: "16"
                                          }),
                                          _createElementVNode$2("code", null, _toDisplayString$2(item.replacement || '（删除）'), 1)
                                        ]),
                                        _createElementVNode$2("div", _hoisted_58$1, "优先级 " + _toDisplayString$2(item.priority), 1)
                                      ]),
                                      _createVNode$2(_component_VBtn, {
                                        icon: "mdi-pencil-outline",
                                        size: "small",
                                        variant: "text",
                                        onClick: $event => (openMappingRule(item))
                                      }, null, 8, ["onClick"]),
                                      _createVNode$2(_component_VBtn, {
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
                        : (_openBlock$2(), _createElementBlock$2("div", _hoisted_59$1, [
                            _createVNode$2(_component_VIcon, {
                              icon: "mdi-find-replace",
                              size: "48"
                            }),
                            _cache[111] || (_cache[111] = _createElementVNode$2("div", { class: "mt-2" }, "尚未设置最终命名规则", -1)),
                            _cache[112] || (_cache[112] = _createElementVNode$2("div", { class: "text-caption mt-1" }, "可先添加简繁字幕预设，或按 MP 首次命名结果建立任意文字替换", -1))
                          ])),
                      _createVNode$2(_component_VCard, {
                        variant: "outlined",
                        class: "mt-4"
                      }, {
                        default: _withCtx$2(() => [
                          _createVNode$2(_component_VCardItem, null, {
                            default: _withCtx$2(() => [
                              _createVNode$2(_component_VCardTitle, null, {
                                default: _withCtx$2(() => [...(_cache[113] || (_cache[113] = [
                                  _createTextVNode$2("最终结果试算", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode$2(_component_VCardSubtitle, null, {
                                default: _withCtx$2(() => [...(_cache[114] || (_cache[114] = [
                                  _createTextVNode$2("输入 MP 第一次生成的相对路径或文件名；这里只试算，不执行文件整理。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode$2(_component_VCardText, null, {
                            default: _withCtx$2(() => [
                              _createElementVNode$2("div", _hoisted_60$1, [
                                _createVNode$2(_component_VTextField, {
                                  modelValue: mappingPreviewInput.value.value,
                                  "onUpdate:modelValue": _cache[31] || (_cache[31] = $event => ((mappingPreviewInput.value.value) = $event)),
                                  label: "MP 首次命名结果",
                                  placeholder: "AB/C.chi.zh-cn.ass",
                                  "hide-details": ""
                                }, null, 8, ["modelValue"]),
                                _createVNode$2(_component_VBtn, {
                                  color: "secondary",
                                  "prepend-icon": "mdi-play",
                                  loading: saving.value === 'mapping-preview',
                                  onClick: previewMappingRules
                                }, {
                                  default: _withCtx$2(() => [...(_cache[115] || (_cache[115] = [
                                    _createTextVNode$2("开始试算", -1)
                                  ]))]),
                                  _: 1
                                }, 8, ["loading"])
                              ]),
                              (mappingPreview.value)
                                ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
                                    key: 0,
                                    type: mappingPreview.value.changes?.length ? 'success' : 'info',
                                    variant: "tonal",
                                    class: "mt-4"
                                  }, {
                                    default: _withCtx$2(() => [
                                      _createElementVNode$2("div", null, [
                                        _cache[116] || (_cache[116] = _createTextVNode$2("输出：", -1)),
                                        _createElementVNode$2("code", null, _toDisplayString$2(mappingPreview.value.output), 1)
                                      ]),
                                      _createElementVNode$2("div", _hoisted_61$1, "命中 " + _toDisplayString$2(mappingPreview.value.changes?.length || 0) + " 条规则", 1)
                                    ]),
                                    _: 1
                                  }, 8, ["type"]))
                                : _createCommentVNode$2("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]))
              ]))
            : (_openBlock$2(), _createElementBlock$2("section", _hoisted_62$1, [
                _createVNode$2(_component_VCard, { variant: "outlined" }, {
                  default: _withCtx$2(() => [
                    _createVNode$2(_component_VCardItem, null, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VCardTitle, null, {
                          default: _withCtx$2(() => [...(_cache[118] || (_cache[118] = [
                            _createTextVNode$2("覆盖层试算", -1)
                          ]))]),
                          _: 1
                        }),
                        _createVNode$2(_component_VCardSubtitle, null, {
                          default: _withCtx$2(() => [...(_cache[119] || (_cache[119] = [
                            _createTextVNode$2("只运行已保存的插件覆盖规则，不请求 TMDB，也不写整理链。", -1)
                          ]))]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    _createVNode$2(_component_VCardText, null, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VTextarea, {
                          modelValue: previewTitle.value,
                          "onUpdate:modelValue": _cache[32] || (_cache[32] = $event => ((previewTitle).value = $event)),
                          label: "原标题",
                          rows: "3",
                          "auto-grow": ""
                        }, null, 8, ["modelValue"]),
                        _createVNode$2(_component_VBtn, {
                          color: "primary",
                          "prepend-icon": "mdi-play",
                          loading: saving.value === 'preview',
                          onClick: previewRules
                        }, {
                          default: _withCtx$2(() => [...(_cache[120] || (_cache[120] = [
                            _createTextVNode$2("开始试算", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading"]),
                        (preview.value && !preview.value.changes?.length)
                          ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
                              key: 0,
                              type: "info",
                              variant: "tonal",
                              class: "mt-4"
                            }, {
                              default: _withCtx$2(() => [...(_cache[121] || (_cache[121] = [
                                _createTextVNode$2("没有覆盖规则命中；MP 原始解析结果会保持不变。", -1)
                              ]))]),
                              _: 1
                            }))
                          : (preview.value?.changes?.length)
                            ? (_openBlock$2(), _createBlock$2(_component_VTable, {
                                key: 1,
                                density: "compact",
                                class: "tools-table mt-4"
                              }, {
                                default: _withCtx$2(() => [
                                  _cache[122] || (_cache[122] = _createElementVNode$2("thead", null, [
                                    _createElementVNode$2("tr", null, [
                                      _createElementVNode$2("th", null, "字段"),
                                      _createElementVNode$2("th", null, "原值"),
                                      _createElementVNode$2("th", null, "覆盖值"),
                                      _createElementVNode$2("th", null, "规则")
                                    ])
                                  ], -1)),
                                  _createElementVNode$2("tbody", null, [
                                    (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(preview.value.changes, (item) => {
                                      return (_openBlock$2(), _createElementBlock$2("tr", {
                                        key: item.rule_id
                                      }, [
                                        _createElementVNode$2("td", null, _toDisplayString$2(item.field), 1),
                                        _createElementVNode$2("td", null, _toDisplayString$2(item.before ?? '空'), 1),
                                        _createElementVNode$2("td", null, _toDisplayString$2(item.after ?? '清空'), 1),
                                        _createElementVNode$2("td", null, _toDisplayString$2(item.label), 1)
                                      ]))
                                    }), 128))
                                  ])
                                ]),
                                _: 1
                              }))
                            : _createCommentVNode$2("", true)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ])),
    _createVNode$2(_component_VDialog, {
      modelValue: dialog.value,
      "onUpdate:modelValue": _cache[41] || (_cache[41] = $event => ((dialog).value = $event)),
      "max-width": "780"
    }, {
      default: _withCtx$2(() => [
        _createVNode$2(_component_VCard, { class: "rule-dialog-card" }, {
          default: _withCtx$2(() => [
            _createVNode$2(_component_VCardItem, { class: "rule-dialog-header" }, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VCardTitle, null, {
                  default: _withCtx$2(() => [
                    _createTextVNode$2(_toDisplayString$2(form.value.source_rule_id ? '编辑 MP 内置规则的插件覆盖' : '新增识别字段覆盖'), 1)
                  ]),
                  _: 1
                }),
                _createVNode$2(_component_VCardSubtitle, null, {
                  default: _withCtx$2(() => [...(_cache[123] || (_cache[123] = [
                    _createTextVNode$2("保存后立即作用于新进入 MP 识别链的标题；不会修改容器文件。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$2(_component_VDivider),
            _createVNode$2(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VRow, null, {
                  default: _withCtx$2(() => [
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VSelect, {
                          modelValue: form.value.field,
                          "onUpdate:modelValue": _cache[33] || (_cache[33] = $event => ((form.value.field) = $event)),
                          label: "目标字段",
                          items: fieldItems.value.filter(item => item.value !== 'all'),
                          "hide-details": ""
                        }, null, 8, ["modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VSelect, {
                          modelValue: form.value.action,
                          "onUpdate:modelValue": _cache[34] || (_cache[34] = $event => ((form.value.action) = $event)),
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
                _createVNode$2(_component_VTextField, {
                  modelValue: form.value.label,
                  "onUpdate:modelValue": _cache[35] || (_cache[35] = $event => ((form.value.label) = $event)),
                  label: "规则名称",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$2(_component_VTextarea, {
                  modelValue: form.value.pattern,
                  "onUpdate:modelValue": _cache[36] || (_cache[36] = $event => ((form.value.pattern) = $event)),
                  label: "匹配正则",
                  rows: "4",
                  "auto-grow": "",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                (form.value.action === 'override')
                  ? (_openBlock$2(), _createBlock$2(_component_VTextField, {
                      key: 0,
                      modelValue: form.value.value,
                      "onUpdate:modelValue": _cache[37] || (_cache[37] = $event => ((form.value.value) = $event)),
                      label: "输出值",
                      hint: "可用 {match}、{first_group}、{1} 或命名组如 {bit}",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]))
                  : _createCommentVNode$2("", true),
                _createVNode$2(_component_VRow, { align: "center" }, {
                  default: _withCtx$2(() => [
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VTextField, {
                          modelValue: form.value.priority,
                          "onUpdate:modelValue": _cache[38] || (_cache[38] = $event => ((form.value.priority) = $event)),
                          type: "number",
                          label: "优先级",
                          hint: "数值越高越先执行",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$2(() => [
                        _createElementVNode$2("div", _hoisted_63$1, [
                          _cache[124] || (_cache[124] = _createElementVNode$2("div", null, [
                            _createElementVNode$2("div", { class: "font-weight-medium" }, "启用规则"),
                            _createElementVNode$2("div", { class: "text-caption text-medium-emphasis" }, "保存后立即参与识别")
                          ], -1)),
                          _createVNode$2(_component_VSwitch, {
                            modelValue: form.value.enabled,
                            "onUpdate:modelValue": _cache[39] || (_cache[39] = $event => ((form.value.enabled) = $event)),
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
            _createVNode$2(_component_VDivider),
            _createVNode$2(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VSpacer),
                _createVNode$2(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[40] || (_cache[40] = $event => (dialog.value = false))
                }, {
                  default: _withCtx$2(() => [...(_cache[125] || (_cache[125] = [
                    _createTextVNode$2("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$2(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'rule',
                  onClick: saveRule
                }, {
                  default: _withCtx$2(() => [...(_cache[126] || (_cache[126] = [
                    _createTextVNode$2("保存覆盖", -1)
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
    _createVNode$2(_component_VDialog, {
      modelValue: renameDialog.value,
      "onUpdate:modelValue": _cache[48] || (_cache[48] = $event => ((renameDialog).value = $event)),
      "max-width": "820"
    }, {
      default: _withCtx$2(() => [
        _createVNode$2(_component_VCard, null, {
          default: _withCtx$2(() => [
            _createVNode$2(_component_VCardItem, null, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VCardTitle, null, {
                  default: _withCtx$2(() => [
                    _createTextVNode$2(_toDisplayString$2(renameForm.value.original_key ? '编辑自定义命名字段' : '新增自定义命名字段'), 1)
                  ]),
                  _: 1
                }),
                _createVNode$2(_component_VCardSubtitle, null, {
                  default: _withCtx$2(() => [...(_cache[127] || (_cache[127] = [
                    _createTextVNode$2("字段会作为独立变量加入 MP 的 Jinja2 命名上下文，不覆盖原有字段。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$2(_component_VDivider),
            _createVNode$2(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VRow, null, {
                  default: _withCtx$2(() => [
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VTextField, {
                          modelValue: renameForm.value.key,
                          "onUpdate:modelValue": _cache[42] || (_cache[42] = $event => ((renameForm.value.key) = $event)),
                          label: "字段名",
                          disabled: !!renameForm.value.original_key,
                          hint: "保存后字段名固定，避免破坏其它字段依赖",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue", "disabled"])
                      ]),
                      _: 1
                    }),
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VTextField, {
                          modelValue: renameForm.value.label,
                          "onUpdate:modelValue": _cache[43] || (_cache[43] = $event => ((renameForm.value.label) = $event)),
                          label: "显示名称"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$2(_component_VTextarea, {
                  modelValue: renameForm.value.expression,
                  "onUpdate:modelValue": _cache[44] || (_cache[44] = $event => ((renameForm.value.expression) = $event)),
                  label: "字段内容 / Jinja2 表达式",
                  rows: "6",
                  "auto-grow": "",
                  hint: "固定内容直接填写；组合使用 {{ title }}；条件可使用 {% if ... %}...{% endif %}",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode$2(_component_VTextField, {
                  modelValue: renameForm.value.fallback,
                  "onUpdate:modelValue": _cache[45] || (_cache[45] = $event => ((renameForm.value.fallback) = $event)),
                  label: "计算失败时的回退值",
                  clearable: ""
                }, null, 8, ["modelValue"]),
                _createElementVNode$2("div", _hoisted_64$1, [
                  _cache[128] || (_cache[128] = _createElementVNode$2("div", null, [
                    _createElementVNode$2("div", { class: "font-weight-medium" }, "启用字段"),
                    _createElementVNode$2("div", { class: "text-caption text-medium-emphasis" }, "停用后变量不会注入命名模板")
                  ], -1)),
                  _createVNode$2(_component_VSwitch, {
                    modelValue: renameForm.value.enabled,
                    "onUpdate:modelValue": _cache[46] || (_cache[46] = $event => ((renameForm.value.enabled) = $event)),
                    color: "success",
                    "hide-details": ""
                  }, null, 8, ["modelValue"])
                ]),
                _createVNode$2(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx$2(() => [...(_cache[129] || (_cache[129] = [
                    _createTextVNode$2("MP 命名模板中使用：", -1),
                    _createElementVNode$2("code", null, "{{ 字段名 }}", -1),
                    _createTextVNode$2("。目标目录字段在初次渲染后补算，并由插件用同一模板安全重渲染一次。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$2(_component_VDivider),
            _createVNode$2(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VSpacer),
                _createVNode$2(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[47] || (_cache[47] = $event => (renameDialog.value = false))
                }, {
                  default: _withCtx$2(() => [...(_cache[130] || (_cache[130] = [
                    _createTextVNode$2("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$2(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'rename-field',
                  onClick: saveRenameField
                }, {
                  default: _withCtx$2(() => [...(_cache[131] || (_cache[131] = [
                    _createTextVNode$2("保存字段", -1)
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
    _createVNode$2(_component_VDialog, {
      modelValue: groupArrangementDialog.value,
      "onUpdate:modelValue": _cache[58] || (_cache[58] = $event => ((groupArrangementDialog).value = $event)),
      "max-width": "820"
    }, {
      default: _withCtx$2(() => [
        _createVNode$2(_component_VCard, null, {
          default: _withCtx$2(() => [
            _createVNode$2(_component_VCardItem, null, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VCardTitle, null, {
                  default: _withCtx$2(() => [
                    _createTextVNode$2(_toDisplayString$2(groupArrangementForm.value.id ? '编辑制作组编排' : '新增制作组编排'), 1)
                  ]),
                  _: 1
                }),
                _createVNode$2(_component_VCardSubtitle, null, {
                  default: _withCtx$2(() => [...(_cache[132] || (_cache[132] = [
                    _createTextVNode$2("规则针对单个制作组生效，不需要枚举 A+B、B+A 等所有组合。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$2(_component_VDivider),
            _createVNode$2(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VRow, null, {
                  default: _withCtx$2(() => [
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VTextField, {
                          modelValue: groupArrangementForm.value.match_name,
                          "onUpdate:modelValue": _cache[49] || (_cache[49] = $event => ((groupArrangementForm.value.match_name) = $event)),
                          label: "识别名称",
                          placeholder: "VCB-Studio",
                          hint: "MP releaseGroup 中出现的主要名称",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VTextField, {
                          modelValue: groupArrangementForm.value.output_name,
                          "onUpdate:modelValue": _cache[50] || (_cache[50] = $event => ((groupArrangementForm.value.output_name) = $event)),
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
                _createVNode$2(_component_VTextField, {
                  modelValue: groupArrangementForm.value.label,
                  "onUpdate:modelValue": _cache[51] || (_cache[51] = $event => ((groupArrangementForm.value.label) = $event)),
                  label: "规则名称",
                  placeholder: "例如：VCB 固定最后"
                }, null, 8, ["modelValue"]),
                _createVNode$2(_component_VTextarea, {
                  modelValue: groupArrangementForm.value.aliases,
                  "onUpdate:modelValue": _cache[52] || (_cache[52] = $event => ((groupArrangementForm.value.aliases) = $event)),
                  label: "其它别名（每行一个）",
                  rows: "3",
                  "auto-grow": "",
                  placeholder: "VCB\nVCB Studio",
                  hint: "别名只做单个制作组归一化，不会改 MP 的原始识别词",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode$2(_component_VRow, null, {
                  default: _withCtx$2(() => [
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VSelect, {
                          modelValue: groupArrangementForm.value.position,
                          "onUpdate:modelValue": _cache[53] || (_cache[53] = $event => ((groupArrangementForm.value.position) = $event)),
                          label: "所在位置",
                          items: groupPositionItems.value,
                          "item-title": "label",
                          "item-value": "value"
                        }, null, 8, ["modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "3"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VCombobox, {
                          modelValue: groupArrangementForm.value.connector,
                          "onUpdate:modelValue": _cache[54] || (_cache[54] = $event => ((groupArrangementForm.value.connector) = $event)),
                          label: "前置连接符",
                          items: groupConnectorItems.value,
                          "item-title": "title",
                          "item-value": "value",
                          "return-object": false,
                          hint: "可继承全局默认；仅在前面已有组时使用",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "4"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VTextField, {
                          modelValue: groupArrangementForm.value.order,
                          "onUpdate:modelValue": _cache[55] || (_cache[55] = $event => ((groupArrangementForm.value.order) = $event)),
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
                _createElementVNode$2("div", _hoisted_65$1, [
                  _cache[133] || (_cache[133] = _createElementVNode$2("div", null, [
                    _createElementVNode$2("div", { class: "font-weight-medium" }, "启用规则"),
                    _createElementVNode$2("div", { class: "text-caption text-medium-emphasis" }, "停用后保留配置但不参与编排")
                  ], -1)),
                  _createVNode$2(_component_VSwitch, {
                    modelValue: groupArrangementForm.value.enabled,
                    "onUpdate:modelValue": _cache[56] || (_cache[56] = $event => ((groupArrangementForm.value.enabled) = $event)),
                    color: "success",
                    "hide-details": ""
                  }, null, 8, ["modelValue"])
                ]),
                _createVNode$2(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx$2(() => [...(_cache[134] || (_cache[134] = [
                    _createTextVNode$2("示例：全局默认连接符设为 ", -1),
                    _createElementVNode$2("code", null, "@", -1),
                    _createTextVNode$2("；VCB-Studio 单独设置“固定最后 + &”，ADWeb 选择“使用默认”，输入 ", -1),
                    _createElementVNode$2("code", null, "ADWeb@A@VCB", -1),
                    _createTextVNode$2(" 将得到 ", -1),
                    _createElementVNode$2("code", null, "A&VCB-Studio@ADWeb", -1),
                    _createTextVNode$2("。只有一个制作组时不会在开头添加连接符。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$2(_component_VDivider),
            _createVNode$2(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VSpacer),
                _createVNode$2(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[57] || (_cache[57] = $event => (groupArrangementDialog.value = false))
                }, {
                  default: _withCtx$2(() => [...(_cache[135] || (_cache[135] = [
                    _createTextVNode$2("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$2(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'group-arrangement',
                  onClick: saveGroupArrangement
                }, {
                  default: _withCtx$2(() => [...(_cache[136] || (_cache[136] = [
                    _createTextVNode$2("保存编排", -1)
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
    _createVNode$2(_component_VDialog, {
      modelValue: mappingDialog.value,
      "onUpdate:modelValue": _cache[67] || (_cache[67] = $event => ((mappingDialog).value = $event)),
      "max-width": "820"
    }, {
      default: _withCtx$2(() => [
        _createVNode$2(_component_VCard, null, {
          default: _withCtx$2(() => [
            _createVNode$2(_component_VCardItem, null, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VCardTitle, null, {
                  default: _withCtx$2(() => [
                    _createTextVNode$2(_toDisplayString$2(mappingForm.value.id ? '编辑最终命名规则' : '新增最终命名规则'), 1)
                  ]),
                  _: 1
                }),
                _createVNode$2(_component_VCardSubtitle, null, {
                  default: _withCtx$2(() => [...(_cache[137] || (_cache[137] = [
                    _createTextVNode$2("规则以 MP 的完整首次命名结果为输入，并按优先级从高到低连续执行。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$2(_component_VDivider),
            _createVNode$2(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VSelect, {
                  modelValue: mappingForm.value.mode,
                  "onUpdate:modelValue": _cache[59] || (_cache[59] = $event => ((mappingForm.value.mode) = $event)),
                  label: "匹配模式",
                  items: [{title:'字面替换',value:'literal'},{title:'正则替换',value:'regex'}]
                }, null, 8, ["modelValue"]),
                _createVNode$2(_component_VTextField, {
                  modelValue: mappingForm.value.label,
                  "onUpdate:modelValue": _cache[60] || (_cache[60] = $event => ((mappingForm.value.label) = $event)),
                  label: "规则名称",
                  placeholder: "例如：统一合作字幕组顺序"
                }, null, 8, ["modelValue"]),
                _createVNode$2(_component_VTextarea, {
                  modelValue: mappingForm.value.pattern,
                  "onUpdate:modelValue": _cache[61] || (_cache[61] = $event => ((mappingForm.value.pattern) = $event)),
                  label: mappingForm.value.mode === 'regex' ? '匹配正则' : '查找文字',
                  rows: "3",
                  "auto-grow": ""
                }, null, 8, ["modelValue", "label"]),
                _createVNode$2(_component_VTextField, {
                  modelValue: mappingForm.value.replacement,
                  "onUpdate:modelValue": _cache[62] || (_cache[62] = $event => ((mappingForm.value.replacement) = $event)),
                  label: "替换为",
                  hint: "留空表示删除；正则模式支持 Python re.sub 的 \\1 与 \\g<name> 引用",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode$2(_component_VRow, { align: "center" }, {
                  default: _withCtx$2(() => [
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx$2(() => [
                        _createVNode$2(_component_VTextField, {
                          modelValue: mappingForm.value.priority,
                          "onUpdate:modelValue": _cache[63] || (_cache[63] = $event => ((mappingForm.value.priority) = $event)),
                          type: "number",
                          label: "优先级",
                          hint: "数值越大越先执行；后续规则继续处理本规则输出",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode$2(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx$2(() => [
                        _createElementVNode$2("div", _hoisted_66$1, [
                          _cache[138] || (_cache[138] = _createElementVNode$2("div", null, [
                            _createElementVNode$2("div", { class: "font-weight-medium" }, "启用规则"),
                            _createElementVNode$2("div", { class: "text-caption text-medium-emphasis" }, "停用后保留配置但不执行")
                          ], -1)),
                          _createVNode$2(_component_VSwitch, {
                            modelValue: mappingForm.value.enabled,
                            "onUpdate:modelValue": _cache[64] || (_cache[64] = $event => ((mappingForm.value.enabled) = $event)),
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
                _createVNode$2(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx$2(() => [...(_cache[139] || (_cache[139] = [
                    _createTextVNode$2("示例：依次添加 ", -1),
                    _createElementVNode$2("code", null, "AB/C → ABC", -1),
                    _createTextVNode$2(" 与 ", -1),
                    _createElementVNode$2("code", null, ".chi.zh-cn → .chs", -1),
                    _createTextVNode$2("，输入 ", -1),
                    _createElementVNode$2("code", null, "AB/C.chi.zh-cn.ass", -1),
                    _createTextVNode$2(" 会得到 ", -1),
                    _createElementVNode$2("code", null, "ABC.chs.ass", -1),
                    _createTextVNode$2("。绝对路径及包含 ", -1),
                    _createElementVNode$2("code", null, "..", -1),
                    _createTextVNode$2(" 的危险结果会被拒绝。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$2(_component_VDivider),
            _createVNode$2(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VSpacer),
                _createVNode$2(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[65] || (_cache[65] = $event => (mappingDialog.value = false))
                }, {
                  default: _withCtx$2(() => [...(_cache[140] || (_cache[140] = [
                    _createTextVNode$2("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$2(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'rename-mapping',
                  onClick: _cache[66] || (_cache[66] = $event => (saveMappingRule()))
                }, {
                  default: _withCtx$2(() => [...(_cache[141] || (_cache[141] = [
                    _createTextVNode$2("保存映射", -1)
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
const MetadataTools = /*#__PURE__*/_export_sfc(_sfc_main$2, [['__scopeId',"data-v-2b3d0ad8"]]);

const {toDisplayString:_toDisplayString$1,createTextVNode:_createTextVNode$1,resolveComponent:_resolveComponent$1,withCtx:_withCtx$1,openBlock:_openBlock$1,createBlock:_createBlock$1,createCommentVNode:_createCommentVNode$1,createElementVNode:_createElementVNode$1,createVNode:_createVNode$1,createElementBlock:_createElementBlock$1,renderList:_renderList$1,Fragment:_Fragment$1} = await importShared('vue');


const _hoisted_1$1 = { class: "d-flex align-center flex-wrap ga-3 mb-5" };
const _hoisted_2$1 = {
  key: 1,
  class: "diagnostic-grid mb-4"
};
const _hoisted_3$1 = {
  key: 2,
  class: "finding-list"
};
const _hoisted_4$1 = {
  key: 3,
  class: "empty-state"
};

const {computed: computed$1,ref: ref$1} = await importShared('vue');


const _sfc_main$1 = {
  __name: 'PerformanceDiagnostics',
  props: { api: { type: Object, default: () => ({}) }, pluginId: { type: String, default: 'TmdbRecognizeEnhancer' } },
  setup(__props) {

const props = __props;
const loading = ref$1(false);
const error = ref$1('');
const server = ref$1(null);
const browser = ref$1(null);
const pluginBase = computed$1(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`);

function mb(value) { return value == null ? '不可用' : `${value} MB` }
function explainError(err) {
  const status = err?.response?.status || err?.status;
  if (status === 404 || String(err?.message || '').includes('404')) return '后端仍是旧插件实例，尚未注册诊断接口；请重载插件或重启一次 MP 容器。'
  return err?.message || '性能采样失败'
}

async function sampleBrowser() {
  const started = performance.now();
  let frames = 0;
  await new Promise(resolve => {
    const end = started + 500;
    const tick = now => { frames += 1; if (now < end) requestAnimationFrame(tick); else resolve(); };
    requestAnimationFrame(tick);
  });
  const memory = performance.memory;
  return {
    fps: Math.min(120, Math.round(frames * 2)),
    dom_nodes: document.getElementsByTagName('*').length,
    js_heap_mb: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024 * 10) / 10 : null,
    heap_limit_mb: memory ? Math.round(memory.jsHeapSizeLimit / 1024 / 1024) : null,
  }
}

async function sample() {
  loading.value = true;
  error.value = '';
  const requestStart = performance.now();
  try {
    const [response, browserResult] = await Promise.all([
      props.api.get(`${pluginBase.value}/diagnostics`), sampleBrowser(),
    ]);
    server.value = unwrapResponse(response);
    browser.value = { ...browserResult, api_rtt_ms: Math.round((performance.now() - requestStart) * 10) / 10 };
  } catch (err) { error.value = explainError(err); }
  finally { loading.value = false; }
}

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent$1("VAlert");
  const _component_VSpacer = _resolveComponent$1("VSpacer");
  const _component_VBtn = _resolveComponent$1("VBtn");
  const _component_VCardTitle = _resolveComponent$1("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$1("VCardSubtitle");
  const _component_VCardItem = _resolveComponent$1("VCardItem");
  const _component_VCardText = _resolveComponent$1("VCardText");
  const _component_VCard = _resolveComponent$1("VCard");
  const _component_VIcon = _resolveComponent$1("VIcon");

  return (_openBlock$1(), _createElementBlock$1("div", null, [
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
    _createElementVNode$1("div", _hoisted_1$1, [
      _cache[2] || (_cache[2] = _createElementVNode$1("div", null, [
        _createElementVNode$1("div", { class: "text-h6" }, "性能与占用诊断"),
        _createElementVNode$1("div", { class: "text-body-2 text-medium-emphasis" }, "手动采样 MP 进程、服务器、插件缓存和当前浏览器页面；默认不轮询、不驻留监控。")
      ], -1)),
      _createVNode$1(_component_VSpacer),
      _createVNode$1(_component_VBtn, {
        color: "primary",
        "prepend-icon": "mdi-speedometer",
        loading: loading.value,
        onClick: sample
      }, {
        default: _withCtx$1(() => [...(_cache[1] || (_cache[1] = [
          _createTextVNode$1("立即采样", -1)
        ]))]),
        _: 1
      }, 8, ["loading"])
    ]),
    _createVNode$1(_component_VAlert, {
      type: "info",
      variant: "tonal",
      density: "compact",
      class: "mb-4"
    }, {
      default: _withCtx$1(() => [...(_cache[3] || (_cache[3] = [
        _createTextVNode$1("CPU 百分比是瞬时值，连续采样两次更有参考意义。该页能区分“MP 后端繁忙”和“浏览器页面渲染卡顿”，但不能替代系统级火焰图。", -1)
      ]))]),
      _: 1
    }),
    (server.value)
      ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_2$1, [
          _createVNode$1(_component_VCard, { variant: "outlined" }, {
            default: _withCtx$1(() => [
              _createVNode$1(_component_VCardItem, null, {
                default: _withCtx$1(() => [
                  _createVNode$1(_component_VCardTitle, null, {
                    default: _withCtx$1(() => [...(_cache[4] || (_cache[4] = [
                      _createTextVNode$1("MoviePilot 进程", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode$1(_component_VCardSubtitle, null, {
                    default: _withCtx$1(() => [
                      _createTextVNode$1("PID " + _toDisplayString$1(server.value.process?.pid) + " · " + _toDisplayString$1(server.value.process?.status), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode$1(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx$1(() => [
                  _createElementVNode$1("div", null, [
                    _cache[5] || (_cache[5] = _createElementVNode$1("span", null, "CPU", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(server.value.process?.cpu_percent ?? '—') + "%", 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[6] || (_cache[6] = _createElementVNode$1("span", null, "常驻内存", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(mb(server.value.process?.rss_mb)), 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[7] || (_cache[7] = _createElementVNode$1("span", null, "内存占比", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(server.value.process?.memory_percent ?? '—') + "%", 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[8] || (_cache[8] = _createElementVNode$1("span", null, "线程", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(server.value.process?.threads ?? '—'), 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode$1(_component_VCard, { variant: "outlined" }, {
            default: _withCtx$1(() => [
              _createVNode$1(_component_VCardItem, null, {
                default: _withCtx$1(() => [
                  _createVNode$1(_component_VCardTitle, null, {
                    default: _withCtx$1(() => [...(_cache[9] || (_cache[9] = [
                      _createTextVNode$1("服务器", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode$1(_component_VCardSubtitle, null, {
                    default: _withCtx$1(() => [
                      _createTextVNode$1(_toDisplayString$1(server.value.system?.cpu_count) + " 逻辑 CPU", 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode$1(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx$1(() => [
                  _createElementVNode$1("div", null, [
                    _cache[10] || (_cache[10] = _createElementVNode$1("span", null, "整机 CPU", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(server.value.system?.cpu_percent ?? '—') + "%", 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[11] || (_cache[11] = _createElementVNode$1("span", null, "内存使用", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(server.value.system?.memory_percent ?? '—') + "%", 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[12] || (_cache[12] = _createElementVNode$1("span", null, "可用内存", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(mb(server.value.system?.memory_available_mb)), 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[13] || (_cache[13] = _createElementVNode$1("span", null, "Load Average", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(server.value.system?.load_average?.join(' / ') || '不可用'), 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode$1(_component_VCard, { variant: "outlined" }, {
            default: _withCtx$1(() => [
              _createVNode$1(_component_VCardItem, null, {
                default: _withCtx$1(() => [
                  _createVNode$1(_component_VCardTitle, null, {
                    default: _withCtx$1(() => [...(_cache[14] || (_cache[14] = [
                      _createTextVNode$1("插件运行量", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode$1(_component_VCardSubtitle, null, {
                    default: _withCtx$1(() => [
                      _createTextVNode$1("采样耗时 " + _toDisplayString$1(server.value.sampling_ms) + " ms", 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode$1(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx$1(() => [
                  _createElementVNode$1("div", null, [
                    _cache[15] || (_cache[15] = _createElementVNode$1("span", null, "季度扫描", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(server.value.plugin?.active_catalog_scans || 0), 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[16] || (_cache[16] = _createElementVNode$1("span", null, "维护规则", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(server.value.plugin?.episode_rules || 0), 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[17] || (_cache[17] = _createElementVNode$1("span", null, "识别字段覆盖", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(server.value.plugin?.compiled_rules || 0), 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[18] || (_cache[18] = _createElementVNode$1("span", null, "外部搜索缓存", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(server.value.plugin?.web_cache_entries || 0), 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode$1(_component_VCard, { variant: "outlined" }, {
            default: _withCtx$1(() => [
              _createVNode$1(_component_VCardItem, null, {
                default: _withCtx$1(() => [
                  _createVNode$1(_component_VCardTitle, null, {
                    default: _withCtx$1(() => [...(_cache[19] || (_cache[19] = [
                      _createTextVNode$1("浏览器页面", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode$1(_component_VCardSubtitle, null, {
                    default: _withCtx$1(() => [...(_cache[20] || (_cache[20] = [
                      _createTextVNode$1("仅当前管理页面", -1)
                    ]))]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode$1(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx$1(() => [
                  _createElementVNode$1("div", null, [
                    _cache[21] || (_cache[21] = _createElementVNode$1("span", null, "短时帧率", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(browser.value?.fps ?? '—') + " FPS", 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[22] || (_cache[22] = _createElementVNode$1("span", null, "DOM 节点", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(browser.value?.dom_nodes ?? '—'), 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[23] || (_cache[23] = _createElementVNode$1("span", null, "JS 堆", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(browser.value?.js_heap_mb == null ? '浏览器不提供' : mb(browser.value.js_heap_mb)), 1)
                  ]),
                  _createElementVNode$1("div", null, [
                    _cache[24] || (_cache[24] = _createElementVNode$1("span", null, "接口往返", -1)),
                    _createElementVNode$1("strong", null, _toDisplayString$1(browser.value?.api_rtt_ms ?? '—') + " ms", 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]))
      : _createCommentVNode$1("", true),
    (server.value?.findings?.length)
      ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_3$1, [
          (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(server.value.findings, (item, index) => {
            return (_openBlock$1(), _createBlock$1(_component_VAlert, {
              key: index,
              type: item.level,
              variant: "tonal",
              density: "compact"
            }, {
              default: _withCtx$1(() => [
                _createElementVNode$1("strong", null, _toDisplayString$1(item.title), 1),
                _createElementVNode$1("div", null, _toDisplayString$1(item.detail), 1)
              ]),
              _: 2
            }, 1032, ["type"]))
          }), 128))
        ]))
      : (_openBlock$1(), _createElementBlock$1("div", _hoisted_4$1, [
          _createVNode$1(_component_VIcon, {
            icon: "mdi-gauge-empty",
            size: "64"
          }),
          _cache[25] || (_cache[25] = _createElementVNode$1("div", { class: "text-h6 mt-3" }, "等待手动采样", -1)),
          _cache[26] || (_cache[26] = _createElementVNode$1("div", { class: "text-body-2 text-medium-emphasis" }, "不会在后台持续消耗 CPU 或发起请求", -1))
        ]))
  ]))
}
}

};
const PerformanceDiagnostics = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-fdb4630e"]]);

const {createElementVNode:_createElementVNode,resolveComponent:_resolveComponent,createVNode:_createVNode,withCtx:_withCtx,toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,createBlock:_createBlock,unref:_unref,renderList:_renderList,Fragment:_Fragment,normalizeClass:_normalizeClass,KeepAlive:_KeepAlive,vShow:_vShow,withDirectives:_withDirectives} = await importShared('vue');


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
const _hoisted_10 = { class: "d-flex align-center flex-wrap ga-3 mb-5" };
const _hoisted_11 = { class: "module-grid" };
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
const _hoisted_22 = {
  key: 1,
  class: "workspace-panel"
};
const _hoisted_23 = { class: "tab-content" };
const _hoisted_24 = { class: "sticky-actions" };
const _hoisted_25 = { class: "text-caption text-medium-emphasis mr-auto" };
const _hoisted_26 = {
  key: 2,
  class: "workspace-panel"
};
const _hoisted_27 = { class: "tab-content" };
const _hoisted_28 = {
  key: 3,
  class: "workspace-panel"
};
const _hoisted_29 = { class: "tab-content" };
const _hoisted_30 = { key: 0 };
const _hoisted_31 = { key: 0 };
const _hoisted_32 = {
  key: 6,
  class: "pipeline-list mb-4"
};
const _hoisted_33 = { class: "text-caption text-medium-emphasis" };
const _hoisted_34 = { class: "d-flex flex-wrap ga-2 mb-4" };
const _hoisted_35 = {
  key: 8,
  class: "best-result"
};
const _hoisted_36 = { class: "text-h6" };
const _hoisted_37 = { class: "text-caption text-medium-emphasis" };
const _hoisted_38 = { key: 0 };
const _hoisted_39 = { class: "result-path" };
const _hoisted_40 = { class: "custom-preview-values" };
const _hoisted_41 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_42 = { class: "result-path" };
const _hoisted_43 = { class: "text-caption text-medium-emphasis mt-2" };
const _hoisted_44 = { class: "text-caption text-medium-emphasis" };
const _hoisted_45 = { class: "text-caption" };
const _hoisted_46 = { class: "text-medium-emphasis" };
const _hoisted_47 = { key: 0 };
const _hoisted_48 = {
  key: 0,
  class: "text-medium-emphasis"
};
const _hoisted_49 = {
  key: 1,
  class: "context-evidence"
};
const _hoisted_50 = {
  key: 2,
  class: "context-evidence"
};
const _hoisted_51 = {
  key: 1,
  class: "empty-preview"
};
const _hoisted_52 = {
  key: 4,
  class: "workspace-panel"
};
const _hoisted_53 = { class: "tab-content" };
const _hoisted_54 = { class: "d-flex align-center mb-4" };
const _hoisted_55 = {
  key: 0,
  class: "history-list"
};
const _hoisted_56 = { class: "d-flex align-start ga-3" };
const _hoisted_57 = { class: "flex-grow-1" };
const _hoisted_58 = { class: "d-flex flex-wrap align-center ga-2" };
const _hoisted_59 = { class: "font-weight-bold" };
const _hoisted_60 = ["title"];
const _hoisted_61 = { class: "text-caption text-medium-emphasis mt-1" };
const _hoisted_62 = {
  key: 1,
  class: "text-caption mt-1"
};
const _hoisted_63 = { key: 0 };
const _hoisted_64 = { class: "d-flex flex-wrap ga-1 mt-2" };
const _hoisted_65 = {
  key: 1,
  class: "empty-preview"
};
const _hoisted_66 = {
  key: 5,
  class: "workspace-panel"
};
const _hoisted_67 = { class: "tab-content" };
const _hoisted_68 = { class: "workspace-panel" };
const _hoisted_69 = { class: "tab-content" };

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
const status = ref({ config: cloneConfig(), summary: {}, history: [] });
const previewInput = ref({
  title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
  year: '', media_type: '', season: '', episode: '', rendered_path: '',
});
const preview = ref(null);

const pluginBase = computed(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`);
const config = computed({
  get: () => status.value.config || cloneConfig(),
  set: value => { status.value.config = value; },
});
const summary = computed(() => status.value.summary || {});
const history = computed(() => status.value.history || []);
const normalizerStatus = computed(() => status.value.episode_normalizer || {});
const modules = computed(() => status.value.modules || {});

async function loadStatus() {
  loading.value = true;
  error.value = '';
  try {
    const response = await props.api.get(`${pluginBase.value}/status`);
    const nextStatus = unwrapResponse(response) || status.value;
    uiVersionMismatch.value = ensureUiVersion(nextStatus.backend_version);
    status.value = nextStatus;
    statusLoaded.value = true;
  } catch (err) {
    error.value = err?.message || '状态加载失败';
  } finally {
    loading.value = false;
  }
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

function typeConstraintSourceText(source) {
  return ({
    manual: '手动指定',
    moviepilot: 'MoviePilot 解析',
    season_episode: '根据季集信息自动判断',
    provided: '识别链提供',
  })[source] || '标题信息'
}

__expose({ loadStatus, saveConfig, loading, saving });
onMounted(loadStatus);

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VAvatar = _resolveComponent("VAvatar");
  const _component_VSpacer = _resolveComponent("VSpacer");
  const _component_VChip = _resolveComponent("VChip");
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VCol = _resolveComponent("VCol");
  const _component_VRow = _resolveComponent("VRow");
  const _component_VTab = _resolveComponent("VTab");
  const _component_VTabs = _resolveComponent("VTabs");
  const _component_VDivider = _resolveComponent("VDivider");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent("VCardSubtitle");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VTextarea = _resolveComponent("VTextarea");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VSelect = _resolveComponent("VSelect");
  const _component_VExpansionPanelTitle = _resolveComponent("VExpansionPanelTitle");
  const _component_VExpansionPanelText = _resolveComponent("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent("VExpansionPanel");
  const _component_VExpansionPanels = _resolveComponent("VExpansionPanels");
  const _component_VProgressCircular = _resolveComponent("VProgressCircular");
  const _component_VTable = _resolveComponent("VTable");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    (!__props.hideTitle)
      ? (_openBlock(), _createElementBlock("div", _hoisted_2, [
          _cache[19] || (_cache[19] = _createElementVNode("div", { class: "hero-glow hero-glow-a" }, null, -1)),
          _cache[20] || (_cache[20] = _createElementVNode("div", { class: "hero-glow hero-glow-b" }, null, -1)),
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
            _cache[18] || (_cache[18] = _createElementVNode("div", null, [
              _createElementVNode("div", { class: "text-h5 font-weight-bold hero-title" }, "TMDB 识别增强"),
              _createElementVNode("div", { class: "text-body-2 hero-subtitle" }, "增强 TMDB 搜索，并按维护规则完成动漫集数偏移")
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
          }, {
            default: _withCtx(() => [...(_cache[21] || (_cache[21] = [
              _createTextVNode(" 管理页已更新，但插件后端仍是旧实例。字段管理和性能诊断接口尚未注册，请重载插件；若 MP 没有重载入口，重启一次容器即可。 ", -1)
            ]))]),
            _: 1
          }))
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
            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((tab).value = $event)),
            color: "primary",
            class: "px-2",
            "show-arrows": ""
          }, {
            default: _withCtx(() => [
              _createVNode(_component_VTab, {
                value: "status",
                "prepend-icon": "mdi-view-dashboard-outline"
              }, {
                default: _withCtx(() => [...(_cache[22] || (_cache[22] = [
                  _createTextVNode("状态与开关", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "settings",
                "prepend-icon": "mdi-database-search-outline"
              }, {
                default: _withCtx(() => [...(_cache[23] || (_cache[23] = [
                  _createTextVNode("TMDB 搜索增强", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "episodes",
                "prepend-icon": "mdi-animation-outline"
              }, {
                default: _withCtx(() => [...(_cache[24] || (_cache[24] = [
                  _createTextVNode("集数偏移", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "metadata",
                "prepend-icon": "mdi-code-braces-box"
              }, {
                default: _withCtx(() => [...(_cache[25] || (_cache[25] = [
                  _createTextVNode("字段与制作组", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "preview",
                "prepend-icon": "mdi-flask-outline"
              }, {
                default: _withCtx(() => [...(_cache[26] || (_cache[26] = [
                  _createTextVNode("综合试跑", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "history",
                "prepend-icon": "mdi-text-box-search-outline"
              }, {
                default: _withCtx(() => [...(_cache[27] || (_cache[27] = [
                  _createTextVNode("日志", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "diagnostics",
                "prepend-icon": "mdi-speedometer"
              }, {
                default: _withCtx(() => [...(_cache[28] || (_cache[28] = [
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
                    _createElementVNode("div", _hoisted_10, [
                      _cache[30] || (_cache[30] = _createElementVNode("div", null, [
                        _createElementVNode("div", { class: "text-h6" }, "插件与模块状态"),
                        _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "总开关关闭时所有接管停止；模块开关可独立控制功能。")
                      ], -1)),
                      _createVNode(_component_VSpacer),
                      _createVNode(_component_VBtn, {
                        color: "primary",
                        "prepend-icon": "mdi-content-save",
                        loading: saving.value,
                        onClick: saveConfig
                      }, {
                        default: _withCtx(() => [...(_cache[29] || (_cache[29] = [
                          _createTextVNode("保存并立即生效", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _createVNode(_component_VCard, {
                      variant: "outlined",
                      class: "master-switch mb-4"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VCardText, { class: "d-flex align-center flex-wrap ga-4" }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VAvatar, {
                              color: "primary",
                              variant: "tonal"
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_VIcon, { icon: "mdi-power" })
                              ]),
                              _: 1
                            }),
                            _cache[31] || (_cache[31] = _createElementVNode("div", { class: "flex-grow-1" }, [
                              _createElementVNode("div", { class: "font-weight-bold" }, "插件总开关"),
                              _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "控制事件接管、运行时适配和全部模块")
                            ], -1)),
                            _createVNode(_component_VSwitch, {
                              modelValue: config.value.show_sidebar_nav,
                              "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config.value.show_sidebar_nav) = $event)),
                              color: "primary",
                              "hide-details": "",
                              label: "显示侧栏工作台"
                            }, null, 8, ["modelValue"]),
                            _createVNode(_component_VSwitch, {
                              modelValue: config.value.enabled,
                              "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.value.enabled) = $event)),
                              color: "success",
                              "hide-details": "",
                              label: config.value.enabled ? '运行中' : '已关闭'
                            }, null, 8, ["modelValue", "label"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    _createElementVNode("div", _hoisted_11, [
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
                                default: _withCtx(() => [...(_cache[32] || (_cache[32] = [
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
                                "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.recognizer_enabled) = $event)),
                                color: "primary",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_12, [
                                _cache[33] || (_cache[33] = _createElementVNode("span", null, "选择模式", -1)),
                                _createElementVNode("strong", null, _toDisplayString(config.value.recognition_mode === 'tmdb_first' ? '单次首结果' : '可解释评分'), 1)
                              ]),
                              _createElementVNode("div", _hoisted_13, [
                                _cache[34] || (_cache[34] = _createElementVNode("span", null, "年份提示", -1)),
                                _createElementVNode("strong", null, _toDisplayString(config.value.use_year_hint ? '接收 MP 年份' : '忽略'), 1)
                              ]),
                              _createElementVNode("div", _hoisted_14, [
                                _cache[35] || (_cache[35] = _createElementVNode("span", null, "原标题证据", -1)),
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
                                default: _withCtx(() => [...(_cache[36] || (_cache[36] = [
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
                                "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config.value.episode_normalizer_enabled) = $event)),
                                color: "success",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_15, [
                                _cache[37] || (_cache[37] = _createElementVNode("span", null, "维护规则", -1)),
                                _createElementVNode("strong", null, _toDisplayString(normalizerStatus.value.rule_count || 0) + " 条", 1)
                              ]),
                              _createElementVNode("div", _hoisted_16, [
                                _cache[38] || (_cache[38] = _createElementVNode("span", null, "MP 插件优先", -1)),
                                _createElementVNode("strong", null, _toDisplayString(normalizerStatus.value.plugin_first ? '已开启' : '未开启'), 1)
                              ]),
                              _createElementVNode("div", _hoisted_17, [
                                _cache[39] || (_cache[39] = _createElementVNode("span", null, "运行时适配", -1)),
                                _createElementVNode("strong", null, _toDisplayString(normalizerStatus.value.runtime_compatible ? '兼容' : normalizerStatus.value.runtime_message || '不可用'), 1)
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
                                default: _withCtx(() => [...(_cache[40] || (_cache[40] = [
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
                                "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((config.value.release_group_assist_enabled) = $event)),
                                color: "primary",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _cache[41] || (_cache[41] = _createElementVNode("div", { class: "status-line" }, [
                                _createElementVNode("span", null, "分类范围"),
                                _createElementVNode("strong", null, "动漫 / 真人电视剧")
                              ], -1)),
                              _cache[42] || (_cache[42] = _createElementVNode("div", { class: "status-line" }, [
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
                                default: _withCtx(() => [...(_cache[43] || (_cache[43] = [
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
                                "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((config.value.recognition_rule_overrides_enabled) = $event)),
                                color: "success",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_18, [
                                _cache[44] || (_cache[44] = _createElementVNode("span", null, "内置规则目录", -1)),
                                _createElementVNode("strong", null, _toDisplayString(modules.value.recognition_rules?.catalog_rules || 0) + " 条", 1)
                              ]),
                              _createElementVNode("div", _hoisted_19, [
                                _cache[45] || (_cache[45] = _createElementVNode("span", null, "已启用覆盖", -1)),
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
                                default: _withCtx(() => [...(_cache[46] || (_cache[46] = [
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
                                "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((config.value.custom_rename_fields_enabled) = $event)),
                                color: "secondary",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_20, [
                                _cache[47] || (_cache[47] = _createElementVNode("span", null, "独立字段", -1)),
                                _createElementVNode("strong", null, _toDisplayString(modules.value.rename_fields?.field_count || 0) + " 个", 1)
                              ]),
                              _cache[48] || (_cache[48] = _createElementVNode("div", { class: "status-line" }, [
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
                                default: _withCtx(() => [...(_cache[49] || (_cache[49] = [
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
                                "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((config.value.rename_mapping_enabled) = $event)),
                                color: "orange",
                                label: "启用模块",
                                "hide-details": ""
                              }, null, 8, ["modelValue"]),
                              _createElementVNode("div", _hoisted_21, [
                                _cache[50] || (_cache[50] = _createElementVNode("span", null, "结构化与文本规则", -1)),
                                _createElementVNode("strong", null, _toDisplayString(modules.value.rename_mapping?.rule_count || 0) + " 条", 1)
                              ]),
                              _cache[51] || (_cache[51] = _createElementVNode("div", { class: "status-line" }, [
                                _createElementVNode("span", null, "作用范围"),
                                _createElementVNode("strong", null, "制作组 / 标题 / 路径 / 字幕")
                              ], -1))
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
              ? (_openBlock(), _createElementBlock("section", _hoisted_22, [
                  _createElementVNode("div", _hoisted_23, [
                    _createVNode(StrategySettings, {
                      modelValue: config.value,
                      "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((config).value = $event)),
                      "show-module-switches": false
                    }, null, 8, ["modelValue"]),
                    _createElementVNode("div", _hoisted_24, [
                      _createElementVNode("div", _hoisted_25, "近期记忆：" + _toDisplayString(summary.value.recognition_memory?.active_targets || 0) + " 个已生效目标 / " + _toDisplayString(summary.value.recognition_memory?.sample_count || 0) + " 个不同文件", 1),
                      _createVNode(_component_VBtn, {
                        variant: "text",
                        "prepend-icon": "mdi-delete-clock-outline",
                        disabled: !(summary.value.recognition_memory?.sample_count),
                        onClick: clearRecognitionMemory
                      }, {
                        default: _withCtx(() => [...(_cache[52] || (_cache[52] = [
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
                        default: _withCtx(() => [...(_cache[53] || (_cache[53] = [
                          _createTextVNode("保存并立即生效", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'metadata')
              ? (_openBlock(), _createElementBlock("section", _hoisted_26, [
                  _createElementVNode("div", _hoisted_27, [
                    _createVNode(MetadataTools, {
                      modelValue: config.value,
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((config).value = $event)),
                      api: __props.api,
                      "plugin-id": __props.pluginId,
                      "saving-config": saving.value,
                      onSaveConfig: saveConfig
                    }, null, 8, ["modelValue", "api", "plugin-id", "saving-config"])
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'preview')
              ? (_openBlock(), _createElementBlock("section", _hoisted_28, [
                  _createElementVNode("div", _hoisted_29, [
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
                                      default: _withCtx(() => [...(_cache[54] || (_cache[54] = [
                                        _createTextVNode("输入完整样本", -1)
                                      ]))]),
                                      _: 1
                                    }),
                                    _createVNode(_component_VCardSubtitle, null, {
                                      default: _withCtx(() => [...(_cache[55] || (_cache[55] = [
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
                                      default: _withCtx(() => [...(_cache[56] || (_cache[56] = [
                                        _createTextVNode("可直接粘贴原始文件名；插件会先复用 MoviePilot 识别词与解析器，再生成 TMDB 搜索词。", -1)
                                      ]))]),
                                      _: 1
                                    }),
                                    _createVNode(_component_VTextarea, {
                                      modelValue: previewInput.value.title,
                                      "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((previewInput.value.title) = $event)),
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
                                            _cache[57] || (_cache[57] = _createElementVNode("div", { class: "field-label" }, "年份提示", -1)),
                                            _createVNode(_component_VTextField, {
                                              modelValue: previewInput.value.year,
                                              "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((previewInput.value.year) = $event)),
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
                                            _cache[58] || (_cache[58] = _createElementVNode("div", { class: "field-label" }, "类型提示", -1)),
                                            _createVNode(_component_VSelect, {
                                              modelValue: previewInput.value.media_type,
                                              "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((previewInput.value.media_type) = $event)),
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
                                            _cache[59] || (_cache[59] = _createElementVNode("div", { class: "field-label" }, "季提示", -1)),
                                            _createVNode(_component_VTextField, {
                                              modelValue: previewInput.value.season,
                                              "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((previewInput.value.season) = $event)),
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
                                            _cache[60] || (_cache[60] = _createElementVNode("div", { class: "field-label" }, "集提示", -1)),
                                            _createVNode(_component_VTextField, {
                                              modelValue: previewInput.value.episode,
                                              "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((previewInput.value.episode) = $event)),
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
                                    _createVNode(_component_VExpansionPanels, {
                                      variant: "accordion",
                                      class: "mb-4 preview-naming-panel"
                                    }, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_VExpansionPanel, null, {
                                          default: _withCtx(() => [
                                            _createVNode(_component_VExpansionPanelTitle, null, {
                                              default: _withCtx(() => [...(_cache[61] || (_cache[61] = [
                                                _createTextVNode("最终命名精确试算（可选）", -1)
                                              ]))]),
                                              _: 1
                                            }),
                                            _createVNode(_component_VExpansionPanelText, null, {
                                              default: _withCtx(() => [
                                                _createVNode(_component_VTextarea, {
                                                  modelValue: previewInput.value.rendered_path,
                                                  "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((previewInput.value.rendered_path) = $event)),
                                                  label: "MP 首次生成的相对路径或文件名",
                                                  placeholder: "不填时以原标题作为试算基线",
                                                  rows: "2",
                                                  "auto-grow": "",
                                                  variant: "outlined",
                                                  "hide-details": ""
                                                }, null, 8, ["modelValue"]),
                                                _cache[62] || (_cache[62] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mt-2" }, "填写后可精确验证最终二次渲染；不填仍会完成其它模块，并用原标题演示命名规则是否命中。", -1))
                                              ]),
                                              _: 1
                                            })
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
                                      default: _withCtx(() => [...(_cache[63] || (_cache[63] = [
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
                                          color: preview.value.selection_mode === 'tmdb_first' ? 'primary' : 'secondary',
                                          variant: "tonal"
                                        }, {
                                          default: _withCtx(() => [
                                            _createTextVNode(" 实际：" + _toDisplayString(preview.value.selection_mode === 'tmdb_first' ? '单次首结果' : '可解释评分'), 1)
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
                                              default: _withCtx(() => [...(_cache[64] || (_cache[64] = [
                                                _createTextVNode(" 页面请求模式与插件已保存模式不同：本次按页面选择执行；请重新保存配置，确保实际整理使用相同模式。 ", -1)
                                              ]))]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true),
                                        (preview.value.original_title)
                                          ? (_openBlock(), _createBlock(_component_VAlert, {
                                              key: 1,
                                              type: "info",
                                              variant: "tonal",
                                              density: "compact",
                                              class: "mb-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _createTextVNode("解析后标题：" + _toDisplayString(preview.value.title), 1)
                                              ]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true),
                                        (preview.value.recognition_rule_changes?.length)
                                          ? (_openBlock(), _createBlock(_component_VAlert, {
                                              key: 2,
                                              type: "success",
                                              variant: "tonal",
                                              density: "compact",
                                              class: "mb-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _cache[65] || (_cache[65] = _createTextVNode(" 识别字段覆盖：", -1)),
                                                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.recognition_rule_changes, (item, index) => {
                                                  return (_openBlock(), _createElementBlock("span", {
                                                    key: item.rule_id || index
                                                  }, [
                                                    index
                                                      ? (_openBlock(), _createElementBlock("span", _hoisted_30, "；"))
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
                                              key: 3,
                                              type: "info",
                                              variant: "tonal",
                                              density: "compact",
                                              class: "mb-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _createTextVNode(" 类型约束：" + _toDisplayString(preview.value.type_constraint.label) + "（" + _toDisplayString(typeConstraintSourceText(preview.value.type_constraint.source)) + "）", 1),
                                                (preview.value.type_constraint.removed_count)
                                                  ? (_openBlock(), _createElementBlock("span", _hoisted_31, "；已排除 " + _toDisplayString(preview.value.type_constraint.removed_count) + " 个类型冲突候选", 1))
                                                  : _createCommentVNode("", true)
                                              ]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true),
                                        (preview.value.duplicate_summary?.suppressed_count)
                                          ? (_openBlock(), _createBlock(_component_VAlert, {
                                              key: 4,
                                              type: "info",
                                              variant: "tonal",
                                              density: "compact",
                                              class: "mb-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _createTextVNode(" 已归并 " + _toDisplayString(preview.value.duplicate_summary.suppressed_count) + " 个同名、同年、同类型的重复候选；分差只比较不同作品。 ", 1)
                                              ]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true),
                                        (preview.value.duplicate_summary?.shadow_season_count)
                                          ? (_openBlock(), _createBlock(_component_VAlert, {
                                              key: 5,
                                              type: "info",
                                              variant: "tonal",
                                              density: "compact",
                                              class: "mb-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _createTextVNode(" 已排除 " + _toDisplayString(preview.value.duplicate_summary.shadow_season_count) + " 个平行单季条目：目标季已存在于更早创建的总系列条目中。 ", 1)
                                              ]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true),
                                        (preview.value.pipeline?.length)
                                          ? (_openBlock(), _createElementBlock("div", _hoisted_32, [
                                              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.pipeline, (step) => {
                                                return (_openBlock(), _createElementBlock("div", {
                                                  key: step.module,
                                                  class: "pipeline-item"
                                                }, [
                                                  _createVNode(_component_VIcon, {
                                                    icon: step.status === 'applied' || step.status === 'accepted' || step.status === 'completed' ? 'mdi-check-circle-outline' : 'mdi-minus-circle-outline',
                                                    color: step.status === 'rejected' ? 'warning' : step.status === 'skipped' ? 'medium-emphasis' : 'success'
                                                  }, null, 8, ["icon", "color"]),
                                                  _createElementVNode("div", null, [
                                                    _createElementVNode("strong", null, _toDisplayString(step.module), 1),
                                                    _createElementVNode("div", _hoisted_33, _toDisplayString(step.summary), 1)
                                                  ])
                                                ]))
                                              }), 128))
                                            ]))
                                          : _createCommentVNode("", true),
                                        (preview.value.web_search?.attempted)
                                          ? (_openBlock(), _createBlock(_component_VAlert, {
                                              key: 7,
                                              type: "info",
                                              variant: "tonal",
                                              density: "compact",
                                              class: "mb-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _createTextVNode(" 搜索引擎兜底已执行：" + _toDisplayString(preview.value.web_search.engine) + " 返回 " + _toDisplayString(preview.value.web_search.result_count) + " 条，发现 " + _toDisplayString(preview.value.web_search.discovered?.length || 0) + " 个 TMDB 链接，" + _toDisplayString(preview.value.web_search.evidence_candidates || 0) + " 个候选通过外部证据阈值。 ", 1)
                                              ]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true),
                                        _cache[71] || (_cache[71] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mb-2" }, "实际搜索词", -1)),
                                        _createElementVNode("div", _hoisted_34, [
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
                                        ]),
                                        (preview.value.best)
                                          ? (_openBlock(), _createElementBlock("div", _hoisted_35, [
                                              _createElementVNode("div", null, [
                                                _createElementVNode("div", _hoisted_36, _toDisplayString(preview.value.best.name), 1),
                                                _createElementVNode("div", _hoisted_37, _toDisplayString(_unref(mediaTypeText)(preview.value.best.media_type)) + " · " + _toDisplayString(preview.value.best.year || '未知年份') + " · TMDB " + _toDisplayString(preview.value.best.tmdb_id), 1)
                                              ]),
                                              _createVNode(_component_VProgressCircular, {
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
                                            ]))
                                          : _createCommentVNode("", true),
                                        (preview.value.episode_adjustment)
                                          ? (_openBlock(), _createBlock(_component_VAlert, {
                                              key: 9,
                                              type: preview.value.episode_adjustment.applied ? 'success' : 'info',
                                              variant: "tonal",
                                              density: "compact",
                                              class: "mt-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _cache[66] || (_cache[66] = _createElementVNode("strong", null, "集数偏移：", -1)),
                                                _createTextVNode(_toDisplayString(preview.value.episode_adjustment.reason) + " ", 1),
                                                (preview.value.episode_adjustment.coordinates_authoritative !== false && preview.value.episode_adjustment.season != null && preview.value.episode_adjustment.episode != null)
                                                  ? (_openBlock(), _createElementBlock("span", _hoisted_38, " · 最终 S" + _toDisplayString(String(preview.value.episode_adjustment.season).padStart(2, '0')) + "E" + _toDisplayString(String(preview.value.episode_adjustment.episode).padStart(2, '0')), 1))
                                                  : _createCommentVNode("", true)
                                              ]),
                                              _: 1
                                            }, 8, ["type"]))
                                          : _createCommentVNode("", true),
                                        (preview.value.release_group_arrangement?.input)
                                          ? (_openBlock(), _createBlock(_component_VCard, {
                                              key: 10,
                                              variant: "tonal",
                                              color: "secondary",
                                              class: "mt-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _createVNode(_component_VCardText, null, {
                                                  default: _withCtx(() => [
                                                    _cache[67] || (_cache[67] = _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "制作组命名编排", -1)),
                                                    _createElementVNode("div", _hoisted_39, [
                                                      _createElementVNode("code", null, _toDisplayString(preview.value.release_group_arrangement.input), 1),
                                                      _createVNode(_component_VIcon, {
                                                        icon: "mdi-arrow-right",
                                                        size: "18"
                                                      }),
                                                      _createElementVNode("code", null, _toDisplayString(preview.value.release_group_arrangement.output), 1)
                                                    ])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true),
                                        (Object.keys(preview.value.custom_rename_fields?.values || {}).length)
                                          ? (_openBlock(), _createBlock(_component_VCard, {
                                              key: 11,
                                              variant: "outlined",
                                              class: "mt-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _createVNode(_component_VCardText, null, {
                                                  default: _withCtx(() => [
                                                    _cache[68] || (_cache[68] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mb-2" }, "自定义命名字段试算", -1)),
                                                    _createElementVNode("div", _hoisted_40, [
                                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.custom_rename_fields.values, (value, key) => {
                                                        return (_openBlock(), _createElementBlock("div", { key: key }, [
                                                          _createElementVNode("code", null, _toDisplayString(key), 1),
                                                          _createElementVNode("span", null, _toDisplayString(value || '（空）'), 1)
                                                        ]))
                                                      }), 128))
                                                    ]),
                                                    (preview.value.custom_rename_fields.errors?.length)
                                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                                          key: 0,
                                                          type: "warning",
                                                          variant: "tonal",
                                                          density: "compact",
                                                          class: "mt-3"
                                                        }, {
                                                          default: _withCtx(() => [
                                                            _createTextVNode(_toDisplayString(preview.value.custom_rename_fields.errors.map(item => `${item.key}：${item.message}`).join('；')), 1)
                                                          ]),
                                                          _: 1
                                                        }))
                                                      : _createCommentVNode("", true)
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true),
                                        (preview.value.final_naming)
                                          ? (_openBlock(), _createBlock(_component_VCard, {
                                              key: 12,
                                              variant: "tonal",
                                              color: "primary",
                                              class: "mt-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _createVNode(_component_VCardText, null, {
                                                  default: _withCtx(() => [
                                                    _createElementVNode("div", _hoisted_41, [
                                                      _cache[69] || (_cache[69] = _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "最终命名二次渲染", -1)),
                                                      _createVNode(_component_VChip, {
                                                        size: "x-small",
                                                        variant: "tonal"
                                                      }, {
                                                        default: _withCtx(() => [
                                                          _createTextVNode(_toDisplayString(preview.value.final_naming.exact_input ? '精确输入' : '原标题演示'), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _createElementVNode("div", _hoisted_42, [
                                                      _createElementVNode("code", null, _toDisplayString(preview.value.final_naming.input), 1),
                                                      _createVNode(_component_VIcon, {
                                                        icon: "mdi-arrow-right",
                                                        size: "18"
                                                      }),
                                                      _createElementVNode("code", null, _toDisplayString(preview.value.final_naming.output), 1)
                                                    ]),
                                                    _createElementVNode("div", _hoisted_43, "命中 " + _toDisplayString(preview.value.final_naming.changes?.length || 0) + " 条规则；真实整理时输入来自 MP 完成首次命名及字幕后缀后的完整相对路径。", 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true),
                                        (preview.value.candidates?.length)
                                          ? (_openBlock(), _createBlock(_component_VTable, {
                                              key: 13,
                                              density: "compact",
                                              class: "candidate-table mt-4"
                                            }, {
                                              default: _withCtx(() => [
                                                _cache[70] || (_cache[70] = _createElementVNode("thead", null, [
                                                  _createElementVNode("tr", null, [
                                                    _createElementVNode("th", null, "候选"),
                                                    _createElementVNode("th", null, "命中名称"),
                                                    _createElementVNode("th", null, "得分")
                                                  ])
                                                ], -1)),
                                                _createElementVNode("tbody", null, [
                                                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.candidates, (candidate) => {
                                                    return (_openBlock(), _createElementBlock("tr", {
                                                      key: `${candidate.media_type}-${candidate.tmdb_id}`,
                                                      class: _normalizeClass({ 'candidate-suppressed': candidate.suppressed_as_duplicate || candidate.suppressed_as_shadow_season })
                                                    }, [
                                                      _createElementVNode("td", null, [
                                                        _createElementVNode("strong", null, _toDisplayString(candidate.name), 1),
                                                        _createElementVNode("div", _hoisted_44, _toDisplayString(candidate.year || '—') + " · #" + _toDisplayString(candidate.tmdb_id), 1),
                                                        (candidate.suppressed_as_duplicate)
                                                          ? (_openBlock(), _createBlock(_component_VChip, {
                                                              key: 0,
                                                              size: "x-small",
                                                              color: "info",
                                                              variant: "tonal",
                                                              class: "mt-1"
                                                            }, {
                                                              default: _withCtx(() => [
                                                                _createTextVNode("重复项，归入 #" + _toDisplayString(candidate.duplicate_of), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024))
                                                          : (candidate.suppressed_as_shadow_season)
                                                            ? (_openBlock(), _createBlock(_component_VChip, {
                                                                key: 1,
                                                                size: "x-small",
                                                                color: "warning",
                                                                variant: "tonal",
                                                                class: "mt-1"
                                                              }, {
                                                                default: _withCtx(() => [
                                                                  _createTextVNode("平行单季项，归入 #" + _toDisplayString(candidate.shadow_of), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024))
                                                            : _createCommentVNode("", true)
                                                      ]),
                                                      _createElementVNode("td", _hoisted_45, [
                                                        _createTextVNode(_toDisplayString(candidate.matched_name || '—'), 1),
                                                        _createElementVNode("div", _hoisted_46, [
                                                          _createTextVNode("查询来源 " + _toDisplayString(candidate.query_confidence ?? 0), 1),
                                                          (candidate.web_evidence)
                                                            ? (_openBlock(), _createElementBlock("span", _hoisted_47, " · 外部证据 " + _toDisplayString(candidate.web_evidence), 1))
                                                            : _createCommentVNode("", true)
                                                        ]),
                                                        (candidate.release_group_evidence?.component !== null)
                                                          ? (_openBlock(), _createElementBlock("div", _hoisted_48, "制作组 " + _toDisplayString(candidate.release_group_evidence.label) + "：" + _toDisplayString(candidate.release_group_evidence.component) + " 分", 1))
                                                          : _createCommentVNode("", true),
                                                        (candidate.seasonal_evidence?.active)
                                                          ? (_openBlock(), _createElementBlock("div", _hoisted_49, "当季 " + _toDisplayString(candidate.seasonal_evidence.quarter) + "：" + _toDisplayString(candidate.seasonal_evidence.component) + " 分", 1))
                                                          : _createCommentVNode("", true),
                                                        (candidate.memory_evidence?.active)
                                                          ? (_openBlock(), _createElementBlock("div", _hoisted_50, "近期命中 " + _toDisplayString(candidate.memory_evidence.hits) + " 次（" + _toDisplayString(candidate.memory_evidence.age_days) + " 天前）：" + _toDisplayString(candidate.memory_evidence.component) + " 分", 1))
                                                          : _createCommentVNode("", true)
                                                      ]),
                                                      _createElementVNode("td", null, [
                                                        _createVNode(_component_VChip, {
                                                          size: "small",
                                                          color: _unref(scoreColor)(candidate.score)
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
                                }, 8, ["color"]))
                              : (_openBlock(), _createElementBlock("div", _hoisted_51, [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-chart-bubble",
                                    size: "64",
                                    color: "primary"
                                  }),
                                  _cache[72] || (_cache[72] = _createElementVNode("div", { class: "text-h6 mt-3" }, "等待一次综合试跑", -1)),
                                  _cache[73] || (_cache[73] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "结果会解释从标题解析到最终命名的完整插件链路", -1))
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
              ? (_openBlock(), _createElementBlock("section", _hoisted_52, [
                  _createElementVNode("div", _hoisted_53, [
                    _createElementVNode("div", _hoisted_54, [
                      _cache[75] || (_cache[75] = _createElementVNode("div", null, [
                        _createElementVNode("div", { class: "text-h6" }, "模块运行日志"),
                        _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "汇总 TMDB 搜索增强与集数偏移的运行结论，不保存完整响应")
                      ], -1)),
                      _createVNode(_component_VSpacer),
                      _createVNode(_component_VBtn, {
                        variant: "text",
                        color: "error",
                        "prepend-icon": "mdi-delete-sweep-outline",
                        disabled: !history.value.length,
                        onClick: clearHistory
                      }, {
                        default: _withCtx(() => [...(_cache[74] || (_cache[74] = [
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
                    (history.value.length)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_55, [
                          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(history.value, (item) => {
                            return (_openBlock(), _createElementBlock("div", {
                              key: `${item.created_at}-${item.title}`,
                              class: "history-row"
                            }, [
                              _createElementVNode("div", {
                                class: _normalizeClass(["history-marker", item.accepted ? 'history-marker-success' : 'history-marker-warning'])
                              }, [...(_cache[76] || (_cache[76] = [
                                _createElementVNode("span", null, null, -1)
                              ]))], 2),
                              _createVNode(_component_VCard, {
                                variant: "outlined",
                                class: "history-card"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VCardText, null, {
                                    default: _withCtx(() => [
                                      _createElementVNode("div", _hoisted_56, [
                                        _createElementVNode("div", _hoisted_57, [
                                          _createElementVNode("div", _hoisted_58, [
                                            _createElementVNode("div", _hoisted_59, _toDisplayString(item.title), 1),
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
                                              }, "原标题：" + _toDisplayString(item.original_title), 9, _hoisted_60))
                                            : _createCommentVNode("", true),
                                          _createElementVNode("div", _hoisted_61, _toDisplayString(item.created_at) + " · " + _toDisplayString(item.reason), 1),
                                          (item.episode_adjustment)
                                            ? (_openBlock(), _createElementBlock("div", _hoisted_62, [
                                                _createTextVNode("集数偏移：" + _toDisplayString(item.episode_adjustment.reason), 1),
                                                (item.episode_adjustment.season != null)
                                                  ? (_openBlock(), _createElementBlock("span", _hoisted_63, " · S" + _toDisplayString(item.episode_adjustment.season) + "E" + _toDisplayString(item.episode_adjustment.episode), 1))
                                                  : _createCommentVNode("", true)
                                              ]))
                                            : _createCommentVNode("", true),
                                          _createElementVNode("div", _hoisted_64, [
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
                                          color: item.accepted ? 'success' : 'warning',
                                          size: "small"
                                        }, {
                                          default: _withCtx(() => [
                                            _createTextVNode(_toDisplayString(item.best?.score ?? '拒绝'), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["color"])
                                      ])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ]))
                          }), 128))
                        ]))
                      : (_openBlock(), _createElementBlock("div", _hoisted_65, [
                          _createVNode(_component_VIcon, {
                            icon: "mdi-text-box-search-outline",
                            size: "60"
                          }),
                          _cache[77] || (_cache[77] = _createElementVNode("div", { class: "text-h6 mt-3" }, "尚无模块日志", -1))
                        ]))
                  ])
                ]))
              : _createCommentVNode("", true),
            (tab.value === 'diagnostics')
              ? (_openBlock(), _createElementBlock("section", _hoisted_66, [
                  _createElementVNode("div", _hoisted_67, [
                    _createVNode(PerformanceDiagnostics, {
                      api: __props.api,
                      "plugin-id": __props.pluginId
                    }, null, 8, ["api", "plugin-id"])
                  ])
                ]))
              : _createCommentVNode("", true),
            _withDirectives(_createElementVNode("section", _hoisted_68, [
              _createElementVNode("div", _hoisted_69, [
                (_openBlock(), _createBlock(_KeepAlive, null, [
                  (tab.value === 'episodes')
                    ? (_openBlock(), _createBlock(EpisodeNormalizer, {
                        key: 0,
                        api: __props.api,
                        "plugin-base": pluginBase.value,
                        "runtime-status": normalizerStatus.value
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
const AppPage = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-8f1b5cd0"]]);

export { AppPage as default };
