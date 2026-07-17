import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { S as StrategySettings } from './StrategySettings-yIwMDGG4.js';
import { _ as _export_sfc, u as unwrapResponse, c as cloneConfig, m as mediaTypeText, s as scoreColor } from './utils-B-q32kVJ.js';

const {toDisplayString:_toDisplayString$1,createTextVNode:_createTextVNode$1,resolveComponent:_resolveComponent$1,withCtx:_withCtx$1,openBlock:_openBlock$1,createBlock:_createBlock$1,createCommentVNode:_createCommentVNode$1,createElementVNode:_createElementVNode$1,createElementBlock:_createElementBlock$1,createVNode:_createVNode$1,renderList:_renderList$1,Fragment:_Fragment$1,normalizeClass:_normalizeClass$1,vShow:_vShow$1,withDirectives:_withDirectives$1,unref:_unref$1,mergeProps:_mergeProps} = await importShared('vue');


const _hoisted_1$1 = { class: "episode-normalizer" };
const _hoisted_2$1 = { key: 0 };
const _hoisted_3$1 = { key: 1 };
const _hoisted_4$1 = { class: "rules-scroll" };
const _hoisted_5$1 = { class: "rules-controls pa-4 pt-4" };
const _hoisted_6$1 = { class: "rule-group-title mb-2" };
const _hoisted_7$1 = { class: "text-caption text-medium-emphasis" };
const _hoisted_8$1 = { class: "flex-grow-1 min-w-0" };
const _hoisted_9$1 = { class: "font-weight-bold text-truncate" };
const _hoisted_10$1 = { class: "text-caption text-medium-emphasis" };
const _hoisted_11$1 = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mt-1"
};
const _hoisted_12$1 = {
  key: 0,
  class: "empty-rules"
};
const _hoisted_13$1 = { class: "d-flex align-center ga-2" };
const _hoisted_14$1 = { class: "board-controls mb-3" };
const _hoisted_15$1 = { class: "batch-bar mb-4" };
const _hoisted_16$1 = { class: "text-caption text-medium-emphasis mb-3" };
const _hoisted_17$1 = { key: 0 };
const _hoisted_18$1 = { key: 1 };
const _hoisted_19$1 = { class: "select-corner" };
const _hoisted_20$1 = { class: "d-flex flex-wrap ga-1" };
const _hoisted_21$1 = {
  key: 0,
  class: "text-caption text-medium-emphasis mt-2"
};
const _hoisted_22$1 = {
  key: 0,
  class: "empty-catalog"
};
const _hoisted_23$1 = { class: "d-flex align-center ga-3 mb-4" };
const _hoisted_24$1 = { class: "tmdb-correction mb-4" };
const _hoisted_25$1 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_26$1 = { class: "flex-grow-1" };
const _hoisted_27$1 = {
  key: 3,
  class: "group-preview mb-4"
};
const _hoisted_28$1 = { class: "d-flex align-center flex-wrap ga-2 mb-2" };
const _hoisted_29$1 = { class: "group-season-grid" };
const _hoisted_30$1 = { class: "d-flex align-center ga-2" };
const _hoisted_31$1 = { class: "text-truncate" };
const _hoisted_32$1 = { class: "text-caption text-medium-emphasis mt-1" };
const _hoisted_33$1 = {
  key: 0,
  class: "text-caption text-medium-emphasis"
};
const _hoisted_34$1 = { key: 0 };
const _hoisted_35$1 = { class: "d-flex align-center mb-2" };
const _hoisted_36$1 = { class: "manual-match" };

const {computed: computed$1,onBeforeUnmount,onMounted: onMounted$1,ref: ref$1,watch} = await importShared('vue');

const uiStateKey = 'tmdbrecognizeenhancer:episode-normalizer-ui:v1';

const _sfc_main$1 = {
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
const error = ref$1('');
const notice = ref$1('');
const snackbar = ref$1(false);
const rules = ref$1([]);
const rulesOpen = ref$1(true);
const ruleView = ref$1('grid');
const ruleSearch = ref$1('');
const ruleQuarter = ref$1('all');
const deleteRulesDialog = ref$1(false);
const deleteRulesLoading = ref$1(false);
const manualDialog = ref$1(false);
const manualLoading = ref$1(false);
const manualMessage = ref$1('');
const manualForm = ref$1({
  tmdb_id: '', preference: 'default', specify_quarter: false,
  year: now.getFullYear(), quarter: Math.floor(now.getMonth() / 3) + 1,
});
const catalog = ref$1([]);
const catalogLoading = ref$1(false);
const batchLoading = ref$1(false);
const busyId = ref$1('');
const selectedIds = ref$1([]);
const catalogMeta = ref$1({});
const board = ref$1({
  year: now.getFullYear(),
  quarter: Math.floor(now.getMonth() / 3) + 1,
  search: '',
  region: 'all',
  platform: 'all',
  scanStatus: 'all',
  multiOnly: false,
});
const batchPreference = ref$1('default');
const boardView = ref$1('grid');
const editorOpen = ref$1(false);
const editorLoading = ref$1(false);
const inspection = ref$1(null);
const editForm = ref$1(null);
const failureDialog = ref$1(false);
const failures = ref$1([]);
const manualTmdb = ref$1({});
let scanTimer = null;

const quarterKey = computed$1(() => `${board.value.year}-Q${board.value.quarter}`);
const platforms = computed$1(() => [
  { title: '全部载体', value: 'all' },
  ...Array.from(new Set(catalog.value.map(item => item.platform).filter(Boolean)))
    .sort()
    .map(value => ({ title: value, value })),
]);
const filteredCatalog = computed$1(() => {
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
const allFilteredSelected = computed$1(() => (
  filteredCatalog.value.length > 0
  && filteredCatalog.value.every(item => selectedIds.value.includes(item.id))
));
const selectedGroup = computed$1(() => inspection.value?.groups?.find(
  item => item.id === editForm.value?.episode_group_id,
));
const ruleQuarterOptions = computed$1(() => {
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
const filteredRules = computed$1(() => {
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
const groupedRules = computed$1(() => {
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
  if (!background) selectedIds.value = [];
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
  if (scanningCount > 0) {
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
  const visible = filteredCatalog.value.map(item => item.id);
  if (allFilteredSelected.value) {
    selectedIds.value = selectedIds.value.filter(id => !visible.includes(id));
  } else {
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...visible]));
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

restoreUiState();
watch(() => [board.value.year, board.value.quarter], () => loadQuarter(false));
watch([board, ruleSearch, ruleQuarter, batchPreference, rulesOpen, ruleView, boardView], persistUiState, { deep: true });
onBeforeUnmount(() => { if (scanTimer) clearTimeout(scanTimer); });
onMounted$1(async () => {
  try {
    await Promise.all([loadRules(), loadQuarter(false)]);
  } catch (err) {
    error.value = err?.message || '集数偏移数据加载失败';
  }
});

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent$1("VAlert");
  const _component_VIcon = _resolveComponent$1("VIcon");
  const _component_VAvatar = _resolveComponent$1("VAvatar");
  const _component_VCardTitle = _resolveComponent$1("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$1("VCardSubtitle");
  const _component_VBtn = _resolveComponent$1("VBtn");
  const _component_VCardItem = _resolveComponent$1("VCardItem");
  const _component_VTextField = _resolveComponent$1("VTextField");
  const _component_VSelect = _resolveComponent$1("VSelect");
  const _component_VBtnToggle = _resolveComponent$1("VBtnToggle");
  const _component_VChip = _resolveComponent$1("VChip");
  const _component_VCardText = _resolveComponent$1("VCardText");
  const _component_VCard = _resolveComponent$1("VCard");
  const _component_VExpandTransition = _resolveComponent$1("VExpandTransition");
  const _component_VSwitch = _resolveComponent$1("VSwitch");
  const _component_VCheckbox = _resolveComponent$1("VCheckbox");
  const _component_VSpacer = _resolveComponent$1("VSpacer");
  const _component_VProgressLinear = _resolveComponent$1("VProgressLinear");
  const _component_VImg = _resolveComponent$1("VImg");
  const _component_VProgressCircular = _resolveComponent$1("VProgressCircular");
  const _component_VListItem = _resolveComponent$1("VListItem");
  const _component_VList = _resolveComponent$1("VList");
  const _component_VMenu = _resolveComponent$1("VMenu");
  const _component_VCardActions = _resolveComponent$1("VCardActions");
  const _component_VDivider = _resolveComponent$1("VDivider");
  const _component_VCol = _resolveComponent$1("VCol");
  const _component_VRow = _resolveComponent$1("VRow");
  const _component_VDialog = _resolveComponent$1("VDialog");
  const _component_VRadio = _resolveComponent$1("VRadio");
  const _component_VRadioGroup = _resolveComponent$1("VRadioGroup");
  const _component_VExpansionPanelTitle = _resolveComponent$1("VExpansionPanelTitle");
  const _component_VTextarea = _resolveComponent$1("VTextarea");
  const _component_VExpansionPanelText = _resolveComponent$1("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent$1("VExpansionPanel");
  const _component_VExpansionPanels = _resolveComponent$1("VExpansionPanels");
  const _component_VSnackbar = _resolveComponent$1("VSnackbar");

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
    (!__props.runtimeStatus.runtime_compatible || !__props.runtimeStatus.plugin_first)
      ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
          key: 1,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: _withCtx$1(() => [
            _cache[37] || (_cache[37] = _createElementVNode$1("div", { class: "font-weight-bold" }, "集数偏移暂不能接管实际整理", -1)),
            (!__props.runtimeStatus.runtime_compatible)
              ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_2$1, _toDisplayString$1(__props.runtimeStatus.runtime_message), 1))
              : _createCommentVNode$1("", true),
            (!__props.runtimeStatus.plugin_first)
              ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_3$1, "请在 MoviePilot 中开启“识别插件优先”。"))
              : _createCommentVNode$1("", true)
          ]),
          _: 1
        }))
      : _createCommentVNode$1("", true),
    _createVNode$1(_component_VCard, {
      variant: "outlined",
      class: "normalizer-card mb-4"
    }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCardItem, null, {
          prepend: _withCtx$1(() => [
            _createVNode$1(_component_VAvatar, {
              color: "success",
              variant: "tonal"
            }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VIcon, { icon: "mdi-playlist-check" })
              ]),
              _: 1
            })
          ]),
          append: _withCtx$1(() => [
            _createVNode$1(_component_VBtn, {
              icon: rulesOpen.value ? 'mdi-chevron-up' : 'mdi-chevron-down',
              variant: "text",
              title: rulesOpen.value ? '收起规则' : '展开规则',
              onClick: _cache[1] || (_cache[1] = $event => (rulesOpen.value = !rulesOpen.value))
            }, null, 8, ["icon", "title"])
          ]),
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardTitle, null, {
              default: _withCtx$1(() => [...(_cache[38] || (_cache[38] = [
                _createTextVNode$1("已维护规则", -1)
              ]))]),
              _: 1
            }),
            _createVNode$1(_component_VCardSubtitle, null, {
              default: _withCtx$1(() => [
                _createTextVNode$1(_toDisplayString$1(rules.value.length) + " 个 TMDB 条目；规则固定显示在季度看板前", 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$1(_component_VExpandTransition, null, {
          default: _withCtx$1(() => [
            _withDirectives$1(_createElementVNode$1("div", _hoisted_4$1, [
              _createElementVNode$1("div", _hoisted_5$1, [
                _createVNode$1(_component_VTextField, {
                  modelValue: ruleSearch.value,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((ruleSearch).value = $event)),
                  label: "搜索标题、别名或 TMDBID",
                  "prepend-inner-icon": "mdi-magnify",
                  clearable: "",
                  "hide-details": "",
                  density: "compact"
                }, null, 8, ["modelValue"]),
                _createVNode$1(_component_VSelect, {
                  modelValue: ruleQuarter.value,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((ruleQuarter).value = $event)),
                  items: ruleQuarterOptions.value,
                  label: "按季度查看",
                  "hide-details": "",
                  density: "compact"
                }, null, 8, ["modelValue", "items"]),
                _createVNode$1(_component_VBtnToggle, {
                  modelValue: ruleView.value,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((ruleView).value = $event)),
                  mandatory: "",
                  density: "compact",
                  variant: "outlined",
                  divided: ""
                }, {
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VBtn, {
                      value: "grid",
                      icon: "mdi-view-grid-outline",
                      title: "平铺"
                    }),
                    _createVNode$1(_component_VBtn, {
                      value: "list",
                      icon: "mdi-view-list-outline",
                      title: "列表"
                    }),
                    _createVNode$1(_component_VBtn, {
                      value: "compact",
                      icon: "mdi-view-headline",
                      title: "紧凑"
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                _createVNode$1(_component_VBtn, {
                  color: "primary",
                  variant: "tonal",
                  "prepend-icon": "mdi-plus",
                  onClick: openManualDialog
                }, {
                  default: _withCtx$1(() => [...(_cache[39] || (_cache[39] = [
                    _createTextVNode$1("手动添加", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VBtn, {
                  color: "error",
                  variant: "tonal",
                  "prepend-icon": "mdi-delete-sweep-outline",
                  disabled: !filteredRules.value.length,
                  onClick: _cache[5] || (_cache[5] = $event => (deleteRulesDialog.value = true))
                }, {
                  default: _withCtx$1(() => [
                    _createTextVNode$1("删除当前结果 " + _toDisplayString$1(filteredRules.value.length || ''), 1)
                  ]),
                  _: 1
                }, 8, ["disabled"])
              ]),
              (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(groupedRules.value, (group) => {
                return (_openBlock$1(), _createElementBlock$1("div", {
                  key: group.quarter,
                  class: "rule-group px-4 pb-4"
                }, [
                  _createElementVNode$1("div", _hoisted_6$1, [
                    _createVNode$1(_component_VIcon, {
                      icon: "mdi-calendar-month-outline",
                      size: "18"
                    }),
                    _createElementVNode$1("strong", null, _toDisplayString$1(group.quarter), 1),
                    _createElementVNode$1("span", _hoisted_7$1, _toDisplayString$1(group.items.length) + " 条", 1)
                  ]),
                  _createElementVNode$1("div", {
                    class: _normalizeClass$1(['rules-grid', `view-${ruleView.value}`])
                  }, [
                    (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(group.items, (rule) => {
                      return (_openBlock$1(), _createBlock$1(_component_VCard, {
                        key: rule.tmdb_id,
                        variant: "tonal",
                        class: "rule-card"
                      }, {
                        default: _withCtx$1(() => [
                          _createVNode$1(_component_VCardText, { class: "d-flex align-center ga-3" }, {
                            default: _withCtx$1(() => [
                              _createVNode$1(_component_VAvatar, {
                                color: rule.enabled ? 'success' : 'default',
                                variant: "tonal"
                              }, {
                                default: _withCtx$1(() => [
                                  _createVNode$1(_component_VIcon, { icon: "mdi-animation-outline" })
                                ]),
                                _: 1
                              }, 8, ["color"]),
                              _createElementVNode$1("div", _hoisted_8$1, [
                                _createElementVNode$1("div", _hoisted_9$1, _toDisplayString$1(rule.title), 1),
                                _createElementVNode$1("div", _hoisted_10$1, "TMDB " + _toDisplayString$1(rule.tmdb_id) + " · " + _toDisplayString$1(rule.target_type === 'group' ? '剧集组' : '默认编集') + " · " + _toDisplayString$1(rule.installments?.length || 0) + " 个季度片段", 1),
                                (rule.installments?.some(item => item.quarter))
                                  ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_11$1, [
                                      (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(Array.from(new Set(rule.installments.map(item => item.quarter).filter(Boolean))).sort().reverse(), (quarter) => {
                                        return (_openBlock$1(), _createBlock$1(_component_VChip, {
                                          key: quarter,
                                          size: "x-small",
                                          variant: "outlined"
                                        }, {
                                          default: _withCtx$1(() => [
                                            _createTextVNode$1(_toDisplayString$1(quarter), 1)
                                          ]),
                                          _: 2
                                        }, 1024))
                                      }), 128))
                                    ]))
                                  : _createCommentVNode$1("", true)
                              ]),
                              _createVNode$1(_component_VBtn, {
                                icon: "mdi-pencil-outline",
                                variant: "text",
                                onClick: $event => (openEditor(rule))
                              }, null, 8, ["onClick"]),
                              _createVNode$1(_component_VBtn, {
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
                ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_12$1, "当前季度或搜索条件下没有维护规则。"))
                : _createCommentVNode$1("", true)
            ], 512), [
              [_vShow$1, rulesOpen.value]
            ])
          ]),
          _: 1
        })
      ]),
      _: 1
    }),
    _createVNode$1(_component_VCard, {
      variant: "outlined",
      class: "normalizer-card mb-4"
    }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCardItem, null, {
          prepend: _withCtx$1(() => [
            _createVNode$1(_component_VAvatar, {
              color: "secondary",
              variant: "tonal"
            }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VIcon, { icon: "mdi-view-dashboard-outline" })
              ]),
              _: 1
            })
          ]),
          append: _withCtx$1(() => [
            _createElementVNode$1("div", _hoisted_13$1, [
              _createVNode$1(_component_VBtnToggle, {
                modelValue: boardView.value,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((boardView).value = $event)),
                mandatory: "",
                density: "compact",
                variant: "outlined",
                divided: ""
              }, {
                default: _withCtx$1(() => [
                  _createVNode$1(_component_VBtn, {
                    value: "grid",
                    icon: "mdi-view-grid-outline",
                    title: "平铺"
                  }),
                  _createVNode$1(_component_VBtn, {
                    value: "list",
                    icon: "mdi-view-list-outline",
                    title: "列表"
                  }),
                  _createVNode$1(_component_VBtn, {
                    value: "compact",
                    icon: "mdi-view-headline",
                    title: "紧凑"
                  })
                ]),
                _: 1
              }, 8, ["modelValue"]),
              _createVNode$1(_component_VBtn, {
                icon: "mdi-refresh",
                variant: "text",
                loading: catalogLoading.value,
                onClick: _cache[7] || (_cache[7] = $event => (loadQuarter(true)))
              }, null, 8, ["loading"])
            ])
          ]),
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardTitle, null, {
              default: _withCtx$1(() => [...(_cache[40] || (_cache[40] = [
                _createTextVNode$1("季度番剧看板", -1)
              ]))]),
              _: 1
            }),
            _createVNode$1(_component_VCardSubtitle, null, {
              default: _withCtx$1(() => [
                _createTextVNode$1("AniList 日漫主目录 · Bangumi/TMDB 补充国漫与海外动画；当前仅显示 " + _toDisplayString$1(quarterKey.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$1(_component_VCardText, null, {
          default: _withCtx$1(() => [
            _createElementVNode$1("div", _hoisted_14$1, [
              _createVNode$1(_component_VSelect, {
                modelValue: board.value.year,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((board.value.year) = $event)),
                items: _unref$1(years),
                label: "年份",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$1(_component_VSelect, {
                modelValue: board.value.quarter,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((board.value.quarter) = $event)),
                items: [1,2,3,4].map(value => ({ title: `Q${value}`, value })),
                label: "季度",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$1(_component_VTextField, {
                modelValue: board.value.search,
                "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((board.value.search) = $event)),
                label: "搜索番剧",
                "prepend-inner-icon": "mdi-magnify",
                clearable: "",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue"]),
              _createVNode$1(_component_VSelect, {
                modelValue: board.value.region,
                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((board.value.region) = $event)),
                label: "地区",
                "hide-details": "",
                density: "compact",
                items: [{title:'全部地区',value:'all'},{title:'日漫',value:'japan'},{title:'国漫',value:'china'},{title:'海外动画',value:'western'},{title:'地区未知',value:'unknown'}]
              }, null, 8, ["modelValue"]),
              _createVNode$1(_component_VSelect, {
                modelValue: board.value.platform,
                "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((board.value.platform) = $event)),
                items: platforms.value,
                label: "载体",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$1(_component_VSelect, {
                modelValue: board.value.scanStatus,
                "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((board.value.scanStatus) = $event)),
                label: "扫描状态",
                "hide-details": "",
                density: "compact",
                items: [{title:'全部状态',value:'all'},{title:'正在扫描',value:'scanning'},{title:'已匹配',value:'matched'},{title:'匹配失败',value:'failed'}]
              }, null, 8, ["modelValue"]),
              _createVNode$1(_component_VSwitch, {
                modelValue: board.value.multiOnly,
                "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((board.value.multiOnly) = $event)),
                label: "仅续作/多季",
                color: "secondary",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue"])
            ]),
            _createElementVNode$1("div", _hoisted_15$1, [
              _createVNode$1(_component_VCheckbox, {
                "model-value": allFilteredSelected.value,
                indeterminate: selectedIds.value.length > 0 && !allFilteredSelected.value,
                label: "选择当前筛选结果",
                "hide-details": "",
                density: "compact",
                onClick: toggleAllFiltered
              }, null, 8, ["model-value", "indeterminate"]),
              _createVNode$1(_component_VSpacer),
              _createVNode$1(_component_VSelect, {
                modelValue: batchPreference.value,
                "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((batchPreference).value = $event)),
                class: "batch-target",
                "hide-details": "",
                density: "compact",
                items: [{title:'优先 TMDB 默认编集',value:'default'},{title:'优先剧集组（Production/Season）',value:'group_preferred'}]
              }, null, 8, ["modelValue"]),
              _createVNode$1(_component_VBtn, {
                color: "secondary",
                "prepend-icon": "mdi-playlist-plus",
                loading: batchLoading.value,
                disabled: !selectedIds.value.length,
                onClick: batchAdd
              }, {
                default: _withCtx$1(() => [
                  _createTextVNode$1("批量加入 " + _toDisplayString$1(selectedIds.value.length || ''), 1)
                ]),
                _: 1
              }, 8, ["loading", "disabled"])
            ]),
            (catalogLoading.value)
              ? (_openBlock$1(), _createBlock$1(_component_VProgressLinear, {
                  key: 0,
                  indeterminate: "",
                  color: "secondary",
                  class: "mb-4"
                }))
              : _createCommentVNode$1("", true),
            _createElementVNode$1("div", _hoisted_16$1, [
              _createTextVNode$1(" 当前 " + _toDisplayString$1(filteredCatalog.value.length) + " / " + _toDisplayString$1(catalog.value.length) + " 条 ", 1),
              (catalogMeta.value.scanning_count)
                ? (_openBlock$1(), _createElementBlock$1("span", _hoisted_17$1, " · " + _toDisplayString$1(catalogMeta.value.scanning_count) + " 条正在扫描", 1))
                : _createCommentVNode$1("", true),
              (catalogMeta.value.updated_at)
                ? (_openBlock$1(), _createElementBlock$1("span", _hoisted_18$1, " · 更新于 " + _toDisplayString$1(catalogMeta.value.updated_at), 1))
                : _createCommentVNode$1("", true)
            ]),
            _createElementVNode$1("div", {
              class: _normalizeClass$1(['catalog-grid', `view-${boardView.value}`])
            }, [
              (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(filteredCatalog.value, (item) => {
                return (_openBlock$1(), _createBlock$1(_component_VCard, {
                  key: item.id,
                  variant: "outlined",
                  class: "catalog-card"
                }, {
                  default: _withCtx$1(() => [
                    _createElementVNode$1("div", _hoisted_19$1, [
                      _createVNode$1(_component_VCheckbox, {
                        modelValue: selectedIds.value,
                        "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((selectedIds).value = $event)),
                        value: item.id,
                        "hide-details": "",
                        density: "compact"
                      }, null, 8, ["modelValue", "value"])
                    ]),
                    (item.poster)
                      ? (_openBlock$1(), _createBlock$1(_component_VImg, {
                          key: 0,
                          src: item.poster,
                          height: "170",
                          cover: ""
                        }, null, 8, ["src"]))
                      : _createCommentVNode$1("", true),
                    _createVNode$1(_component_VCardItem, null, {
                      default: _withCtx$1(() => [
                        _createVNode$1(_component_VCardTitle, { class: "text-subtitle-1 text-wrap" }, {
                          default: _withCtx$1(() => [
                            _createTextVNode$1(_toDisplayString$1(item.display_name || item.name_cn || item.name), 1)
                          ]),
                          _: 2
                        }, 1024),
                        _createVNode$1(_component_VCardSubtitle, null, {
                          default: _withCtx$1(() => [
                            _createTextVNode$1(_toDisplayString$1(item.date || '日期未知') + " · " + _toDisplayString$1(item.episode_count || '?') + " 集", 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024),
                    _createVNode$1(_component_VCardText, { class: "pt-0" }, {
                      default: _withCtx$1(() => [
                        _createElementVNode$1("div", _hoisted_20$1, [
                          (item.region_name)
                            ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                key: 0,
                                size: "x-small",
                                variant: "tonal"
                              }, {
                                default: _withCtx$1(() => [
                                  _createTextVNode$1(_toDisplayString$1(item.region_name), 1)
                                ]),
                                _: 2
                              }, 1024))
                            : _createCommentVNode$1("", true),
                          (item.platform)
                            ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                key: 1,
                                size: "x-small",
                                variant: "tonal"
                              }, {
                                default: _withCtx$1(() => [
                                  _createTextVNode$1(_toDisplayString$1(item.platform), 1)
                                ]),
                                _: 2
                              }, 1024))
                            : _createCommentVNode$1("", true),
                          (item.is_multi_season)
                            ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                key: 2,
                                size: "x-small",
                                color: "secondary",
                                variant: "tonal"
                              }, {
                                default: _withCtx$1(() => [...(_cache[41] || (_cache[41] = [
                                  _createTextVNode$1("续作/多季", -1)
                                ]))]),
                                _: 1
                              }))
                            : _createCommentVNode$1("", true),
                          (item.matched_media_type)
                            ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                key: 3,
                                size: "x-small",
                                variant: "tonal"
                              }, {
                                default: _withCtx$1(() => [
                                  _createTextVNode$1(_toDisplayString$1(item.matched_media_type), 1)
                                ]),
                                _: 2
                              }, 1024))
                            : _createCommentVNode$1("", true),
                          (item.scan_status === 'scanning')
                            ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                key: 4,
                                size: "x-small",
                                color: "info",
                                variant: "tonal"
                              }, {
                                default: _withCtx$1(() => [
                                  _createVNode$1(_component_VProgressCircular, {
                                    indeterminate: "",
                                    size: "11",
                                    width: "2",
                                    class: "me-1"
                                  }),
                                  _cache[42] || (_cache[42] = _createTextVNode$1("正在扫描 ", -1))
                                ]),
                                _: 1
                              }))
                            : (item.scan_status === 'failed')
                              ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                  key: 5,
                                  size: "x-small",
                                  color: "warning",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$1(() => [...(_cache[43] || (_cache[43] = [
                                    _createTextVNode$1("匹配待补充", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode$1("", true),
                          (item.maintained)
                            ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                key: 6,
                                size: "x-small",
                                color: "success",
                                "prepend-icon": "mdi-check"
                              }, {
                                default: _withCtx$1(() => [...(_cache[44] || (_cache[44] = [
                                  _createTextVNode$1("已维护", -1)
                                ]))]),
                                _: 1
                              }))
                            : _createCommentVNode$1("", true)
                        ]),
                        (item.tmdb_match?.best)
                          ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_21$1, " TMDB " + _toDisplayString$1(item.tmdb_match.best.tmdb_id) + " · " + _toDisplayString$1(item.tmdb_match.best.name), 1))
                          : _createCommentVNode$1("", true)
                      ]),
                      _: 2
                    }, 1024),
                    _createVNode$1(_component_VCardActions, null, {
                      default: _withCtx$1(() => [
                        (!item.maintained && item.rule_eligible !== false)
                          ? (_openBlock$1(), _createBlock$1(_component_VMenu, { key: 0 }, {
                              activator: _withCtx$1(({ props: menuProps }) => [
                                _createVNode$1(_component_VBtn, _mergeProps({ ref_for: true }, menuProps, {
                                  color: "primary",
                                  variant: "tonal",
                                  "append-icon": "mdi-menu-down",
                                  loading: busyId.value === item.id
                                }), {
                                  default: _withCtx$1(() => [...(_cache[45] || (_cache[45] = [
                                    _createTextVNode$1("加入规则", -1)
                                  ]))]),
                                  _: 1
                                }, 16, ["loading"])
                              ]),
                              default: _withCtx$1(() => [
                                _createVNode$1(_component_VList, { density: "compact" }, {
                                  default: _withCtx$1(() => [
                                    _createVNode$1(_component_VListItem, {
                                      title: "使用 TMDB 默认编集",
                                      "prepend-icon": "mdi-database-outline",
                                      onClick: $event => (addCatalogItem(item, 'default'))
                                    }, null, 8, ["onClick"]),
                                    _createVNode$1(_component_VListItem, {
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
                            ? (_openBlock$1(), _createBlock$1(_component_VBtn, {
                                key: 1,
                                variant: "text",
                                disabled: "",
                                "prepend-icon": "mdi-movie-open-outline"
                              }, {
                                default: _withCtx$1(() => [...(_cache[46] || (_cache[46] = [
                                  _createTextVNode$1("电影条目无需集数规则", -1)
                                ]))]),
                                _: 1
                              }))
                            : (_openBlock$1(), _createBlock$1(_component_VBtn, {
                                key: 2,
                                variant: "text",
                                "prepend-icon": "mdi-pencil-outline",
                                onClick: $event => (openEditor(rules.value.find(rule => Number(rule.tmdb_id) === Number(item.tmdb_match?.best?.tmdb_id))))
                              }, {
                                default: _withCtx$1(() => [...(_cache[47] || (_cache[47] = [
                                  _createTextVNode$1("编辑规则", -1)
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
                ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_22$1, [
                    _createVNode$1(_component_VIcon, {
                      icon: "mdi-calendar-search",
                      size: "48"
                    }),
                    _cache[48] || (_cache[48] = _createElementVNode$1("div", null, "当前筛选条件没有番剧", -1))
                  ]))
                : _createCommentVNode$1("", true)
            ], 2)
          ]),
          _: 1
        })
      ]),
      _: 1
    }),
    _createVNode$1(_component_VDialog, {
      modelValue: manualDialog.value,
      "onUpdate:modelValue": _cache[24] || (_cache[24] = $event => ((manualDialog).value = $event)),
      "max-width": "620"
    }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCard, null, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardItem, null, {
              append: _withCtx$1(() => [
                _createVNode$1(_component_VBtn, {
                  icon: "mdi-close",
                  variant: "text",
                  onClick: _cache[17] || (_cache[17] = $event => (manualDialog.value = false))
                })
              ]),
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardTitle, null, {
                  default: _withCtx$1(() => [...(_cache[49] || (_cache[49] = [
                    _createTextVNode$1("手动添加维护规则", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VCardSubtitle, null, {
                  default: _withCtx$1(() => [...(_cache[50] || (_cache[50] = [
                    _createTextVNode$1("适用于季度看板中没有收录的电视剧或动画", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$1(_component_VDivider),
            _createVNode$1(_component_VCardText, { class: "manual-rule-form" }, {
              default: _withCtx$1(() => [
                (manualMessage.value)
                  ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
                      key: 0,
                      type: "warning",
                      variant: "tonal",
                      density: "compact",
                      class: "mb-4"
                    }, {
                      default: _withCtx$1(() => [
                        _createTextVNode$1(_toDisplayString$1(manualMessage.value), 1)
                      ]),
                      _: 1
                    }))
                  : _createCommentVNode$1("", true),
                _createVNode$1(_component_VTextField, {
                  modelValue: manualForm.value.tmdb_id,
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((manualForm.value.tmdb_id) = $event)),
                  modelModifiers: { number: true },
                  label: "TMDBID",
                  type: "number",
                  "prepend-inner-icon": "mdi-database-search",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$1(_component_VSelect, {
                  modelValue: manualForm.value.preference,
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((manualForm.value.preference) = $event)),
                  label: "目标编集",
                  items: [{title:'使用 TMDB 默认编集',value:'default'},{title:'优先 Production/Season 剧集组',value:'group_preferred'}],
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode$1(_component_VSwitch, {
                  modelValue: manualForm.value.specify_quarter,
                  "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((manualForm.value.specify_quarter) = $event)),
                  label: "手动指定归属季度",
                  color: "primary",
                  "hide-details": "",
                  class: "mb-3"
                }, null, 8, ["modelValue"]),
                (manualForm.value.specify_quarter)
                  ? (_openBlock$1(), _createBlock$1(_component_VRow, {
                      key: 1,
                      dense: ""
                    }, {
                      default: _withCtx$1(() => [
                        _createVNode$1(_component_VCol, { cols: "7" }, {
                          default: _withCtx$1(() => [
                            _createVNode$1(_component_VSelect, {
                              modelValue: manualForm.value.year,
                              "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((manualForm.value.year) = $event)),
                              items: _unref$1(years),
                              label: "年份"
                            }, null, 8, ["modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        _createVNode$1(_component_VCol, { cols: "5" }, {
                          default: _withCtx$1(() => [
                            _createVNode$1(_component_VSelect, {
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
                  : _createCommentVNode$1("", true),
                _cache[51] || (_cache[51] = _createElementVNode$1("div", { class: "text-caption text-medium-emphasis" }, " 不指定时会根据 TMDB 最新有效季的首播日期自动归类；TMDB 缺少日期时会提示补充。 ", -1))
              ]),
              _: 1
            }),
            _createVNode$1(_component_VDivider),
            _createVNode$1(_component_VCardActions, { class: "pa-4" }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VSpacer),
                _createVNode$1(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[23] || (_cache[23] = $event => (manualDialog.value = false))
                }, {
                  default: _withCtx$1(() => [...(_cache[52] || (_cache[52] = [
                    _createTextVNode$1("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VBtn, {
                  color: "primary",
                  loading: manualLoading.value,
                  disabled: !manualForm.value.tmdb_id,
                  onClick: manualAddRule
                }, {
                  default: _withCtx$1(() => [...(_cache[53] || (_cache[53] = [
                    _createTextVNode$1("读取并加入", -1)
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
    _createVNode$1(_component_VDialog, {
      modelValue: deleteRulesDialog.value,
      "onUpdate:modelValue": _cache[26] || (_cache[26] = $event => ((deleteRulesDialog).value = $event)),
      "max-width": "520"
    }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCard, null, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardItem, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardTitle, null, {
                  default: _withCtx$1(() => [...(_cache[54] || (_cache[54] = [
                    _createTextVNode$1("删除当前筛选结果？", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VCardSubtitle, null, {
                  default: _withCtx$1(() => [
                    _createTextVNode$1("将删除 " + _toDisplayString$1(filteredRules.value.length) + " 条维护规则，季度看板数据不会被删除", 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$1(_component_VCardText, null, {
              default: _withCtx$1(() => [...(_cache[55] || (_cache[55] = [
                _createTextVNode$1("此操作会立即停止这些 TMDB 条目的集数偏移，请确认当前季度和搜索条件正确。", -1)
              ]))]),
              _: 1
            }),
            _createVNode$1(_component_VCardActions, { class: "pa-4" }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VSpacer),
                _createVNode$1(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[25] || (_cache[25] = $event => (deleteRulesDialog.value = false))
                }, {
                  default: _withCtx$1(() => [...(_cache[56] || (_cache[56] = [
                    _createTextVNode$1("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VBtn, {
                  color: "error",
                  loading: deleteRulesLoading.value,
                  onClick: deleteFilteredRules
                }, {
                  default: _withCtx$1(() => [...(_cache[57] || (_cache[57] = [
                    _createTextVNode$1("确认删除", -1)
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
    _createVNode$1(_component_VDialog, {
      modelValue: editorOpen.value,
      "onUpdate:modelValue": _cache[33] || (_cache[33] = $event => ((editorOpen).value = $event)),
      "max-width": "820",
      scrollable: ""
    }, {
      default: _withCtx$1(() => [
        (editForm.value)
          ? (_openBlock$1(), _createBlock$1(_component_VCard, { key: 0 }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardItem, null, {
                  append: _withCtx$1(() => [
                    _createVNode$1(_component_VBtn, {
                      icon: "mdi-close",
                      variant: "text",
                      onClick: _cache[27] || (_cache[27] = $event => (editorOpen.value = false))
                    })
                  ]),
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VCardTitle, null, {
                      default: _withCtx$1(() => [...(_cache[58] || (_cache[58] = [
                        _createTextVNode$1("编辑维护规则", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$1(_component_VCardSubtitle, null, {
                      default: _withCtx$1(() => [
                        _createTextVNode$1(_toDisplayString$1(editForm.value.title) + " · TMDB " + _toDisplayString$1(editForm.value.tmdb_id), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$1(_component_VDivider),
                _createVNode$1(_component_VCardText, null, {
                  default: _withCtx$1(() => [
                    _createElementVNode$1("div", _hoisted_23$1, [
                      _createVNode$1(_component_VSwitch, {
                        modelValue: editForm.value.enabled,
                        "onUpdate:modelValue": _cache[28] || (_cache[28] = $event => ((editForm.value.enabled) = $event)),
                        label: "启用规则",
                        color: "success",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode$1(_component_VSpacer),
                      _createVNode$1(_component_VBtn, {
                        variant: "tonal",
                        "prepend-icon": "mdi-refresh",
                        loading: editorLoading.value,
                        onClick: inspectTarget
                      }, {
                        default: _withCtx$1(() => [...(_cache[59] || (_cache[59] = [
                          _createTextVNode$1("刷新编集", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _createElementVNode$1("div", _hoisted_24$1, [
                      _createVNode$1(_component_VTextField, {
                        modelValue: editForm.value.tmdb_id,
                        "onUpdate:modelValue": _cache[29] || (_cache[29] = $event => ((editForm.value.tmdb_id) = $event)),
                        modelModifiers: { number: true },
                        label: "TMDBID",
                        type: "number",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode$1(_component_VBtn, {
                        variant: "tonal",
                        "prepend-icon": "mdi-database-search",
                        loading: editorLoading.value,
                        onClick: inspectTarget
                      }, {
                        default: _withCtx$1(() => [...(_cache[60] || (_cache[60] = [
                          _createTextVNode$1("读取并校验", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    (Number(editForm.value.original_tmdb_id) !== Number(editForm.value.tmdb_id))
                      ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
                          key: 0,
                          type: "warning",
                          variant: "tonal",
                          density: "compact",
                          class: "mb-4"
                        }, {
                          default: _withCtx$1(() => [
                            _createTextVNode$1("保存后将用 TMDB " + _toDisplayString$1(editForm.value.tmdb_id) + " 替换原规则 TMDB " + _toDisplayString$1(editForm.value.original_tmdb_id), 1)
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$1("", true),
                    (inspection.value?.recommendation)
                      ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
                          key: 1,
                          type: "info",
                          variant: "tonal",
                          density: "compact",
                          class: "mb-3"
                        }, {
                          default: _withCtx$1(() => [
                            _createElementVNode$1("div", _hoisted_25$1, [
                              _createElementVNode$1("span", _hoisted_26$1, [
                                _createElementVNode$1("strong", null, "智能建议：" + _toDisplayString$1(inspection.value.recommendation.target_type === 'group' ? '剧集组' : 'TMDB 默认编集'), 1),
                                _createTextVNode$1(" · " + _toDisplayString$1(inspection.value.recommendation.reason), 1)
                              ]),
                              _createVNode$1(_component_VBtn, {
                                size: "small",
                                variant: "tonal",
                                onClick: applyTargetRecommendation
                              }, {
                                default: _withCtx$1(() => [...(_cache[61] || (_cache[61] = [
                                  _createTextVNode$1("采用建议", -1)
                                ]))]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$1("", true),
                    _createVNode$1(_component_VRadioGroup, {
                      modelValue: editForm.value.target_type,
                      "onUpdate:modelValue": _cache[30] || (_cache[30] = $event => ((editForm.value.target_type) = $event)),
                      "hide-details": ""
                    }, {
                      default: _withCtx$1(() => [
                        _createVNode$1(_component_VRadio, {
                          value: "default",
                          label: "TMDB 默认编集"
                        }),
                        _createVNode$1(_component_VRadio, {
                          value: "group",
                          label: "TMDB 剧集组"
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    (editForm.value.target_type === 'group')
                      ? (_openBlock$1(), _createBlock$1(_component_VSelect, {
                          key: 2,
                          modelValue: editForm.value.episode_group_id,
                          "onUpdate:modelValue": _cache[31] || (_cache[31] = $event => ((editForm.value.episode_group_id) = $event)),
                          class: "mt-3",
                          items: (inspection.value?.groups || []).map(group => ({ title: `${group.recommended ? '推荐 · ' : ''}${group.name} · ${groupType(group.type)} · ${group.episode_count} 集`, value: group.id })),
                          label: "目标剧集组"
                        }, null, 8, ["modelValue", "items"]))
                      : _createCommentVNode$1("", true),
                    (selectedGroup.value)
                      ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_27$1, [
                          _createElementVNode$1("div", _hoisted_28$1, [
                            _cache[63] || (_cache[63] = _createElementVNode$1("strong", null, "分季预览", -1)),
                            _createVNode$1(_component_VChip, {
                              size: "x-small",
                              variant: "tonal"
                            }, {
                              default: _withCtx$1(() => [
                                _createTextVNode$1(_toDisplayString$1(selectedGroup.value.seasons?.filter(item => !item.is_special).length || 0) + " 个常规季", 1)
                              ]),
                              _: 1
                            }),
                            (selectedGroup.value.seasons?.some(item => item.is_special))
                              ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                  key: 0,
                                  size: "x-small",
                                  color: "secondary",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$1(() => [...(_cache[62] || (_cache[62] = [
                                    _createTextVNode$1("包含 Special", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode$1("", true),
                            (selectedGroup.value.coverage)
                              ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                  key: 1,
                                  size: "x-small",
                                  variant: "outlined"
                                }, {
                                  default: _withCtx$1(() => [
                                    _createTextVNode$1("正片覆盖 " + _toDisplayString$1(selectedGroup.value.coverage) + "%", 1)
                                  ]),
                                  _: 1
                                }))
                              : _createCommentVNode$1("", true)
                          ]),
                          _createElementVNode$1("div", _hoisted_29$1, [
                            (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(selectedGroup.value.seasons || [], (season) => {
                              return (_openBlock$1(), _createElementBlock$1("div", {
                                key: season.season,
                                class: _normalizeClass$1(['group-season-item', { special: season.is_special }])
                              }, [
                                _createElementVNode$1("div", _hoisted_30$1, [
                                  _createElementVNode$1("strong", null, "S" + _toDisplayString$1(String(season.season).padStart(2, '0')), 1),
                                  (season.is_special)
                                    ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                        key: 0,
                                        size: "x-small",
                                        color: "secondary"
                                      }, {
                                        default: _withCtx$1(() => [...(_cache[64] || (_cache[64] = [
                                          _createTextVNode$1("Special", -1)
                                        ]))]),
                                        _: 1
                                      }))
                                    : _createCommentVNode$1("", true),
                                  _createElementVNode$1("span", _hoisted_31$1, _toDisplayString$1(season.name), 1)
                                ]),
                                _createElementVNode$1("div", _hoisted_32$1, _toDisplayString$1(season.episode_count) + " 集 · E" + _toDisplayString$1(String(season.first_episode || 1).padStart(2, '0')) + "–E" + _toDisplayString$1(String(season.last_episode || season.episode_count).padStart(2, '0')), 1),
                                (season.first_air_date || season.last_air_date)
                                  ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_33$1, [
                                      _createTextVNode$1(_toDisplayString$1(season.first_air_date || '日期未知'), 1),
                                      (season.last_air_date && season.last_air_date !== season.first_air_date)
                                        ? (_openBlock$1(), _createElementBlock$1("span", _hoisted_34$1, " → " + _toDisplayString$1(season.last_air_date), 1))
                                        : _createCommentVNode$1("", true)
                                    ]))
                                  : _createCommentVNode$1("", true)
                              ], 2))
                            }), 128))
                          ])
                        ]))
                      : _createCommentVNode$1("", true),
                    _createElementVNode$1("div", _hoisted_35$1, [
                      _cache[66] || (_cache[66] = _createElementVNode$1("strong", null, "季度片段", -1)),
                      _createVNode$1(_component_VSpacer),
                      _createVNode$1(_component_VBtn, {
                        size: "small",
                        variant: "tonal",
                        "prepend-icon": "mdi-plus",
                        onClick: addInstallment
                      }, {
                        default: _withCtx$1(() => [...(_cache[65] || (_cache[65] = [
                          _createTextVNode$1("添加", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _createVNode$1(_component_VExpansionPanels, { variant: "accordion" }, {
                      default: _withCtx$1(() => [
                        (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(editForm.value.installments, (item, index) => {
                          return (_openBlock$1(), _createBlock$1(_component_VExpansionPanel, {
                            key: item.id || index
                          }, {
                            default: _withCtx$1(() => [
                              _createVNode$1(_component_VExpansionPanelTitle, null, {
                                default: _withCtx$1(() => [
                                  _createTextVNode$1(_toDisplayString$1(item.title || `季度片段 ${index + 1}`) + " · S" + _toDisplayString$1(item.target_start_season) + "E" + _toDisplayString$1(item.target_start_episode), 1)
                                ]),
                                _: 2
                              }, 1024),
                              _createVNode$1(_component_VExpansionPanelText, null, {
                                default: _withCtx$1(() => [
                                  _createVNode$1(_component_VRow, { dense: "" }, {
                                    default: _withCtx$1(() => [
                                      _createVNode$1(_component_VCol, {
                                        cols: "12",
                                        sm: "6"
                                      }, {
                                        default: _withCtx$1(() => [
                                          _createVNode$1(_component_VTextField, {
                                            modelValue: item.title,
                                            "onUpdate:modelValue": $event => ((item.title) = $event),
                                            label: "片段名称"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$1(_component_VCol, {
                                        cols: "12",
                                        sm: "3"
                                      }, {
                                        default: _withCtx$1(() => [
                                          _createVNode$1(_component_VTextField, {
                                            modelValue: item.quarter,
                                            "onUpdate:modelValue": $event => ((item.quarter) = $event),
                                            label: "季度"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$1(_component_VCol, {
                                        cols: "12",
                                        sm: "3"
                                      }, {
                                        default: _withCtx$1(() => [
                                          _createVNode$1(_component_VTextField, {
                                            modelValue: item.source_season,
                                            "onUpdate:modelValue": $event => ((item.source_season) = $event),
                                            label: "来源季",
                                            type: "number"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$1(_component_VCol, { cols: "12" }, {
                                        default: _withCtx$1(() => [
                                          _createVNode$1(_component_VTextarea, {
                                            modelValue: item.aliases,
                                            "onUpdate:modelValue": $event => ((item.aliases) = $event),
                                            label: "命中别名（每行一个）",
                                            rows: "2",
                                            "auto-grow": ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$1(_component_VCol, {
                                        cols: "12",
                                        sm: "4"
                                      }, {
                                        default: _withCtx$1(() => [
                                          _createVNode$1(_component_VTextField, {
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
                                      _createVNode$1(_component_VCol, {
                                        cols: "6",
                                        sm: "4"
                                      }, {
                                        default: _withCtx$1(() => [
                                          _createVNode$1(_component_VTextField, {
                                            modelValue: item.target_start_season,
                                            "onUpdate:modelValue": $event => ((item.target_start_season) = $event),
                                            label: "目标起始季",
                                            type: "number"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createVNode$1(_component_VCol, {
                                        cols: "6",
                                        sm: "4"
                                      }, {
                                        default: _withCtx$1(() => [
                                          _createVNode$1(_component_VTextField, {
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
                                  _createVNode$1(_component_VBtn, {
                                    color: "error",
                                    variant: "text",
                                    "prepend-icon": "mdi-delete-outline",
                                    onClick: $event => (editForm.value.installments.splice(index, 1))
                                  }, {
                                    default: _withCtx$1(() => [...(_cache[67] || (_cache[67] = [
                                      _createTextVNode$1("删除片段", -1)
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
                _createVNode$1(_component_VDivider),
                _createVNode$1(_component_VCardActions, { class: "pa-4" }, {
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VSpacer),
                    _createVNode$1(_component_VBtn, {
                      variant: "text",
                      onClick: _cache[32] || (_cache[32] = $event => (editorOpen.value = false))
                    }, {
                      default: _withCtx$1(() => [...(_cache[68] || (_cache[68] = [
                        _createTextVNode$1("取消", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$1(_component_VBtn, {
                      color: "primary",
                      loading: editorLoading.value,
                      onClick: saveRule
                    }, {
                      default: _withCtx$1(() => [...(_cache[69] || (_cache[69] = [
                        _createTextVNode$1("保存规则", -1)
                      ]))]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : _createCommentVNode$1("", true)
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _createVNode$1(_component_VDialog, {
      modelValue: failureDialog.value,
      "onUpdate:modelValue": _cache[35] || (_cache[35] = $event => ((failureDialog).value = $event)),
      "max-width": "720"
    }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCard, null, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardItem, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardTitle, null, {
                  default: _withCtx$1(() => [...(_cache[70] || (_cache[70] = [
                    _createTextVNode$1("这些番剧未能自动匹配", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VCardSubtitle, null, {
                  default: _withCtx$1(() => [...(_cache[71] || (_cache[71] = [
                    _createTextVNode$1("补充正确 TMDBID 后重试，或直接放弃该条目", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$1(_component_VDivider),
            _createVNode$1(_component_VList, { lines: "three" }, {
              default: _withCtx$1(() => [
                (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(failures.value, (failure) => {
                  return (_openBlock$1(), _createBlock$1(_component_VListItem, {
                    key: failure.id,
                    title: failure.title,
                    subtitle: failure.reason
                  }, {
                    append: _withCtx$1(() => [
                      _createElementVNode$1("div", _hoisted_36$1, [
                        _createVNode$1(_component_VTextField, {
                          modelValue: manualTmdb.value[failure.id],
                          "onUpdate:modelValue": $event => ((manualTmdb.value[failure.id]) = $event),
                          label: "TMDBID",
                          type: "number",
                          "hide-details": "",
                          density: "compact"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        _createVNode$1(_component_VBtn, {
                          color: "primary",
                          variant: "tonal",
                          loading: busyId.value === failure.id,
                          onClick: $event => (retryFailure(failure))
                        }, {
                          default: _withCtx$1(() => [...(_cache[72] || (_cache[72] = [
                            _createTextVNode$1("补充并加入", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading", "onClick"]),
                        _createVNode$1(_component_VBtn, {
                          variant: "text",
                          color: "medium-emphasis",
                          onClick: $event => (ignoreFailure(failure))
                        }, {
                          default: _withCtx$1(() => [...(_cache[73] || (_cache[73] = [
                            _createTextVNode$1("忽略", -1)
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
            _createVNode$1(_component_VCardActions, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VSpacer),
                _createVNode$1(_component_VBtn, {
                  onClick: _cache[34] || (_cache[34] = $event => (failureDialog.value = false))
                }, {
                  default: _withCtx$1(() => [...(_cache[74] || (_cache[74] = [
                    _createTextVNode$1("关闭", -1)
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
    _createVNode$1(_component_VSnackbar, {
      modelValue: snackbar.value,
      "onUpdate:modelValue": _cache[36] || (_cache[36] = $event => ((snackbar).value = $event)),
      color: "success",
      timeout: "3500"
    }, {
      default: _withCtx$1(() => [
        _createTextVNode$1(_toDisplayString$1(notice.value), 1)
      ]),
      _: 1
    }, 8, ["modelValue"])
  ]))
}
}

};
const EpisodeNormalizer = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-71dd09de"]]);

const {createElementVNode:_createElementVNode,resolveComponent:_resolveComponent,createVNode:_createVNode,withCtx:_withCtx,toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,createBlock:_createBlock,renderList:_renderList,Fragment:_Fragment,vShow:_vShow,withDirectives:_withDirectives,unref:_unref,normalizeClass:_normalizeClass} = await importShared('vue');


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
const _hoisted_8 = { class: "workspace-panel" };
const _hoisted_9 = { class: "tab-content" };
const _hoisted_10 = { class: "d-flex align-center flex-wrap ga-3 mb-5" };
const _hoisted_11 = { class: "module-grid" };
const _hoisted_12 = { class: "status-line" };
const _hoisted_13 = { class: "status-line" };
const _hoisted_14 = { class: "status-line" };
const _hoisted_15 = { class: "status-line" };
const _hoisted_16 = { class: "status-line" };
const _hoisted_17 = { class: "status-line" };
const _hoisted_18 = { class: "workspace-panel" };
const _hoisted_19 = { class: "tab-content" };
const _hoisted_20 = { class: "sticky-actions" };
const _hoisted_21 = { class: "workspace-panel" };
const _hoisted_22 = { class: "tab-content" };
const _hoisted_23 = {
  key: 4,
  class: "pipeline-list mb-4"
};
const _hoisted_24 = { class: "text-caption text-medium-emphasis" };
const _hoisted_25 = { class: "d-flex flex-wrap ga-2 mb-4" };
const _hoisted_26 = {
  key: 6,
  class: "best-result"
};
const _hoisted_27 = { class: "text-h6" };
const _hoisted_28 = { class: "text-caption text-medium-emphasis" };
const _hoisted_29 = { key: 0 };
const _hoisted_30 = { class: "text-caption text-medium-emphasis" };
const _hoisted_31 = { class: "text-caption" };
const _hoisted_32 = { class: "text-medium-emphasis" };
const _hoisted_33 = { key: 0 };
const _hoisted_34 = {
  key: 1,
  class: "empty-preview"
};
const _hoisted_35 = { class: "workspace-panel" };
const _hoisted_36 = { class: "tab-content" };
const _hoisted_37 = { class: "d-flex align-center mb-4" };
const _hoisted_38 = {
  key: 0,
  class: "history-list"
};
const _hoisted_39 = { class: "d-flex align-start ga-3" };
const _hoisted_40 = { class: "flex-grow-1" };
const _hoisted_41 = { class: "d-flex flex-wrap align-center ga-2" };
const _hoisted_42 = { class: "font-weight-bold" };
const _hoisted_43 = ["title"];
const _hoisted_44 = { class: "text-caption text-medium-emphasis mt-1" };
const _hoisted_45 = {
  key: 1,
  class: "text-caption mt-1"
};
const _hoisted_46 = { key: 0 };
const _hoisted_47 = { class: "d-flex flex-wrap ga-1 mt-2" };
const _hoisted_48 = {
  key: 1,
  class: "empty-preview"
};
const _hoisted_49 = { class: "workspace-panel" };
const _hoisted_50 = { class: "tab-content" };

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
const saving = ref(false);
const previewing = ref(false);
const error = ref('');
const tab = ref('status');
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
const normalizerStatus = computed(() => status.value.episode_normalizer || {});
const modules = computed(() => status.value.modules || {});

async function loadStatus() {
  loading.value = true;
  error.value = '';
  try {
    const response = await props.api.get(`${pluginBase.value}/status`);
    status.value = unwrapResponse(response) || status.value;
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
  const _component_VProgressCircular = _resolveComponent("VProgressCircular");
  const _component_VTable = _resolveComponent("VTable");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    (!__props.hideTitle)
      ? (_openBlock(), _createElementBlock("div", _hoisted_2, [
          _cache[12] || (_cache[12] = _createElementVNode("div", { class: "hero-glow hero-glow-a" }, null, -1)),
          _cache[13] || (_cache[13] = _createElementVNode("div", { class: "hero-glow hero-glow-b" }, null, -1)),
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
            _cache[11] || (_cache[11] = _createElementVNode("div", null, [
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
                default: _withCtx(() => [...(_cache[14] || (_cache[14] = [
                  _createTextVNode("状态与开关", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "settings",
                "prepend-icon": "mdi-database-search-outline"
              }, {
                default: _withCtx(() => [...(_cache[15] || (_cache[15] = [
                  _createTextVNode("TMDB 搜索增强", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "episodes",
                "prepend-icon": "mdi-animation-outline"
              }, {
                default: _withCtx(() => [...(_cache[16] || (_cache[16] = [
                  _createTextVNode("集数偏移", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "preview",
                "prepend-icon": "mdi-flask-outline"
              }, {
                default: _withCtx(() => [...(_cache[17] || (_cache[17] = [
                  _createTextVNode("综合试跑", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "history",
                "prepend-icon": "mdi-text-box-search-outline"
              }, {
                default: _withCtx(() => [...(_cache[18] || (_cache[18] = [
                  _createTextVNode("日志", -1)
                ]))]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"]),
          _createVNode(_component_VDivider),
          _createElementVNode("div", _hoisted_7, [
            _withDirectives(_createElementVNode("section", _hoisted_8, [
              _createElementVNode("div", _hoisted_9, [
                _createElementVNode("div", _hoisted_10, [
                  _cache[20] || (_cache[20] = _createElementVNode("div", null, [
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
                    default: _withCtx(() => [...(_cache[19] || (_cache[19] = [
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
                        _cache[21] || (_cache[21] = _createElementVNode("div", { class: "flex-grow-1" }, [
                          _createElementVNode("div", { class: "font-weight-bold" }, "插件总开关"),
                          _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "控制事件接管、运行时适配和全部模块")
                        ], -1)),
                        _createVNode(_component_VSwitch, {
                          modelValue: config.value.enabled,
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config.value.enabled) = $event)),
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
                            default: _withCtx(() => [...(_cache[22] || (_cache[22] = [
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
                            "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.value.recognizer_enabled) = $event)),
                            color: "primary",
                            label: "启用模块",
                            "hide-details": ""
                          }, null, 8, ["modelValue"]),
                          _createElementVNode("div", _hoisted_12, [
                            _cache[23] || (_cache[23] = _createElementVNode("span", null, "选择模式", -1)),
                            _createElementVNode("strong", null, _toDisplayString(config.value.recognition_mode === 'tmdb_first' ? '单次首结果' : '可解释评分'), 1)
                          ]),
                          _createElementVNode("div", _hoisted_13, [
                            _cache[24] || (_cache[24] = _createElementVNode("span", null, "年份提示", -1)),
                            _createElementVNode("strong", null, _toDisplayString(config.value.use_year_hint ? '接收 MP 年份' : '忽略'), 1)
                          ]),
                          _createElementVNode("div", _hoisted_14, [
                            _cache[25] || (_cache[25] = _createElementVNode("span", null, "原标题证据", -1)),
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
                            default: _withCtx(() => [...(_cache[26] || (_cache[26] = [
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
                            "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.episode_normalizer_enabled) = $event)),
                            color: "success",
                            label: "启用模块",
                            "hide-details": ""
                          }, null, 8, ["modelValue"]),
                          _createElementVNode("div", _hoisted_15, [
                            _cache[27] || (_cache[27] = _createElementVNode("span", null, "维护规则", -1)),
                            _createElementVNode("strong", null, _toDisplayString(normalizerStatus.value.rule_count || 0) + " 条", 1)
                          ]),
                          _createElementVNode("div", _hoisted_16, [
                            _cache[28] || (_cache[28] = _createElementVNode("span", null, "MP 插件优先", -1)),
                            _createElementVNode("strong", null, _toDisplayString(normalizerStatus.value.plugin_first ? '已开启' : '未开启'), 1)
                          ]),
                          _createElementVNode("div", _hoisted_17, [
                            _cache[29] || (_cache[29] = _createElementVNode("span", null, "运行时适配", -1)),
                            _createElementVNode("strong", null, _toDisplayString(normalizerStatus.value.runtime_compatible ? '兼容' : normalizerStatus.value.runtime_message || '不可用'), 1)
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ])
              ])
            ], 512), [
              [_vShow, tab.value === 'status']
            ]),
            _withDirectives(_createElementVNode("section", _hoisted_18, [
              _createElementVNode("div", _hoisted_19, [
                _createVNode(StrategySettings, {
                  modelValue: config.value,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config).value = $event)),
                  "show-module-switches": false
                }, null, 8, ["modelValue"]),
                _createElementVNode("div", _hoisted_20, [
                  _createVNode(_component_VBtn, {
                    color: "primary",
                    "prepend-icon": "mdi-content-save",
                    loading: saving.value,
                    onClick: saveConfig
                  }, {
                    default: _withCtx(() => [...(_cache[30] || (_cache[30] = [
                      _createTextVNode("保存并立即生效", -1)
                    ]))]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ])
            ], 512), [
              [_vShow, tab.value === 'settings']
            ]),
            _withDirectives(_createElementVNode("section", _hoisted_21, [
              _createElementVNode("div", _hoisted_22, [
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
                                  default: _withCtx(() => [...(_cache[31] || (_cache[31] = [
                                    _createTextVNode("输入完整样本", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VCardSubtitle, null, {
                                  default: _withCtx(() => [...(_cache[32] || (_cache[32] = [
                                    _createTextVNode("依次检查 MP 解析、TMDB 选择和集数偏移，不写入整理链", -1)
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
                                  default: _withCtx(() => [...(_cache[33] || (_cache[33] = [
                                    _createTextVNode("可直接粘贴原始文件名；插件会先复用 MoviePilot 识别词与解析器，再生成 TMDB 搜索词。", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VTextarea, {
                                  modelValue: previewInput.value.title,
                                  "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((previewInput.value.title) = $event)),
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
                                        _cache[34] || (_cache[34] = _createElementVNode("div", { class: "field-label" }, "年份提示", -1)),
                                        _createVNode(_component_VTextField, {
                                          modelValue: previewInput.value.year,
                                          "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((previewInput.value.year) = $event)),
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
                                        _cache[35] || (_cache[35] = _createElementVNode("div", { class: "field-label" }, "类型提示", -1)),
                                        _createVNode(_component_VSelect, {
                                          modelValue: previewInput.value.media_type,
                                          "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((previewInput.value.media_type) = $event)),
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
                                        _cache[36] || (_cache[36] = _createElementVNode("div", { class: "field-label" }, "季提示", -1)),
                                        _createVNode(_component_VTextField, {
                                          modelValue: previewInput.value.season,
                                          "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((previewInput.value.season) = $event)),
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
                                        _cache[37] || (_cache[37] = _createElementVNode("div", { class: "field-label" }, "集提示", -1)),
                                        _createVNode(_component_VTextField, {
                                          modelValue: previewInput.value.episode,
                                          "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((previewInput.value.episode) = $event)),
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
                                  default: _withCtx(() => [...(_cache[38] || (_cache[38] = [
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
                                          default: _withCtx(() => [...(_cache[39] || (_cache[39] = [
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
                                    (preview.value.duplicate_summary?.suppressed_count)
                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                          key: 2,
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
                                          key: 3,
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
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_23, [
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
                                                _createElementVNode("div", _hoisted_24, _toDisplayString(step.summary), 1)
                                              ])
                                            ]))
                                          }), 128))
                                        ]))
                                      : _createCommentVNode("", true),
                                    (preview.value.web_search?.attempted)
                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                          key: 5,
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
                                    _cache[42] || (_cache[42] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mb-2" }, "实际搜索词", -1)),
                                    _createElementVNode("div", _hoisted_25, [
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
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_26, [
                                          _createElementVNode("div", null, [
                                            _createElementVNode("div", _hoisted_27, _toDisplayString(preview.value.best.name), 1),
                                            _createElementVNode("div", _hoisted_28, _toDisplayString(_unref(mediaTypeText)(preview.value.best.media_type)) + " · " + _toDisplayString(preview.value.best.year || '未知年份') + " · TMDB " + _toDisplayString(preview.value.best.tmdb_id), 1)
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
                                          key: 7,
                                          type: preview.value.episode_adjustment.applied ? 'success' : 'info',
                                          variant: "tonal",
                                          density: "compact",
                                          class: "mt-4"
                                        }, {
                                          default: _withCtx(() => [
                                            _cache[40] || (_cache[40] = _createElementVNode("strong", null, "集数偏移：", -1)),
                                            _createTextVNode(_toDisplayString(preview.value.episode_adjustment.reason) + " ", 1),
                                            (preview.value.episode_adjustment.coordinates_authoritative !== false && preview.value.episode_adjustment.season != null && preview.value.episode_adjustment.episode != null)
                                              ? (_openBlock(), _createElementBlock("span", _hoisted_29, " · 最终 S" + _toDisplayString(String(preview.value.episode_adjustment.season).padStart(2, '0')) + "E" + _toDisplayString(String(preview.value.episode_adjustment.episode).padStart(2, '0')), 1))
                                              : _createCommentVNode("", true)
                                          ]),
                                          _: 1
                                        }, 8, ["type"]))
                                      : _createCommentVNode("", true),
                                    (preview.value.candidates?.length)
                                      ? (_openBlock(), _createBlock(_component_VTable, {
                                          key: 8,
                                          density: "compact",
                                          class: "candidate-table mt-4"
                                        }, {
                                          default: _withCtx(() => [
                                            _cache[41] || (_cache[41] = _createElementVNode("thead", null, [
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
                                                    _createElementVNode("div", _hoisted_30, _toDisplayString(candidate.year || '—') + " · #" + _toDisplayString(candidate.tmdb_id), 1),
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
                                                  _createElementVNode("td", _hoisted_31, [
                                                    _createTextVNode(_toDisplayString(candidate.matched_name || '—'), 1),
                                                    _createElementVNode("div", _hoisted_32, [
                                                      _createTextVNode("查询来源 " + _toDisplayString(candidate.query_confidence ?? 0), 1),
                                                      (candidate.web_evidence)
                                                        ? (_openBlock(), _createElementBlock("span", _hoisted_33, " · 外部证据 " + _toDisplayString(candidate.web_evidence), 1))
                                                        : _createCommentVNode("", true)
                                                    ])
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
                          : (_openBlock(), _createElementBlock("div", _hoisted_34, [
                              _createVNode(_component_VIcon, {
                                icon: "mdi-chart-bubble",
                                size: "64",
                                color: "primary"
                              }),
                              _cache[43] || (_cache[43] = _createElementVNode("div", { class: "text-h6 mt-3" }, "等待一次综合试跑", -1)),
                              _cache[44] || (_cache[44] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "结果会同时解释 TMDB 候选与最终季集坐标", -1))
                            ]))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ])
            ], 512), [
              [_vShow, tab.value === 'preview']
            ]),
            _withDirectives(_createElementVNode("section", _hoisted_35, [
              _createElementVNode("div", _hoisted_36, [
                _createElementVNode("div", _hoisted_37, [
                  _cache[46] || (_cache[46] = _createElementVNode("div", null, [
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
                    default: _withCtx(() => [...(_cache[45] || (_cache[45] = [
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
                  ? (_openBlock(), _createElementBlock("div", _hoisted_38, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(history.value, (item) => {
                        return (_openBlock(), _createElementBlock("div", {
                          key: `${item.created_at}-${item.title}`,
                          class: "history-row"
                        }, [
                          _createElementVNode("div", {
                            class: _normalizeClass(["history-marker", item.accepted ? 'history-marker-success' : 'history-marker-warning'])
                          }, [...(_cache[47] || (_cache[47] = [
                            _createElementVNode("span", null, null, -1)
                          ]))], 2),
                          _createVNode(_component_VCard, {
                            variant: "outlined",
                            class: "history-card"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VCardText, null, {
                                default: _withCtx(() => [
                                  _createElementVNode("div", _hoisted_39, [
                                    _createElementVNode("div", _hoisted_40, [
                                      _createElementVNode("div", _hoisted_41, [
                                        _createElementVNode("div", _hoisted_42, _toDisplayString(item.title), 1),
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
                                          }, "原标题：" + _toDisplayString(item.original_title), 9, _hoisted_43))
                                        : _createCommentVNode("", true),
                                      _createElementVNode("div", _hoisted_44, _toDisplayString(item.created_at) + " · " + _toDisplayString(item.reason), 1),
                                      (item.episode_adjustment)
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_45, [
                                            _createTextVNode("集数偏移：" + _toDisplayString(item.episode_adjustment.reason), 1),
                                            (item.episode_adjustment.season != null)
                                              ? (_openBlock(), _createElementBlock("span", _hoisted_46, " · S" + _toDisplayString(item.episode_adjustment.season) + "E" + _toDisplayString(item.episode_adjustment.episode), 1))
                                              : _createCommentVNode("", true)
                                          ]))
                                        : _createCommentVNode("", true),
                                      _createElementVNode("div", _hoisted_47, [
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
                  : (_openBlock(), _createElementBlock("div", _hoisted_48, [
                      _createVNode(_component_VIcon, {
                        icon: "mdi-text-box-search-outline",
                        size: "60"
                      }),
                      _cache[48] || (_cache[48] = _createElementVNode("div", { class: "text-h6 mt-3" }, "尚无模块日志", -1))
                    ]))
              ])
            ], 512), [
              [_vShow, tab.value === 'history']
            ]),
            _withDirectives(_createElementVNode("section", _hoisted_49, [
              _createElementVNode("div", _hoisted_50, [
                _createVNode(EpisodeNormalizer, {
                  api: __props.api,
                  "plugin-base": pluginBase.value,
                  "runtime-status": normalizerStatus.value
                }, null, 8, ["api", "plugin-base", "runtime-status"])
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
const AppPage = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-c897e0cd"]]);

export { AppPage as default };
