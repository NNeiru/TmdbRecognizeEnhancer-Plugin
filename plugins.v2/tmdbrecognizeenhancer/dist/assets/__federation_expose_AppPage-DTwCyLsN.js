import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { S as StrategySettings } from './StrategySettings-D3MqvjgH.js';
import { _ as _export_sfc, u as unwrapResponse, c as cloneConfig, m as mediaTypeText, s as scoreColor } from './utils-DaBy4w3m.js';

const {toDisplayString:_toDisplayString$1,createTextVNode:_createTextVNode$1,resolveComponent:_resolveComponent$1,withCtx:_withCtx$1,openBlock:_openBlock$1,createBlock:_createBlock$1,createCommentVNode:_createCommentVNode$1,createElementVNode:_createElementVNode$1,createElementBlock:_createElementBlock$1,createVNode:_createVNode$1,withKeys:_withKeys,renderList:_renderList$1,Fragment:_Fragment$1,vShow:_vShow$1,withDirectives:_withDirectives$1,unref:_unref$1,mergeProps:_mergeProps} = await importShared('vue');


const _hoisted_1$1 = { class: "episode-normalizer" };
const _hoisted_2$1 = { key: 0 };
const _hoisted_3$1 = { key: 1 };
const _hoisted_4$1 = { class: "preview-line" };
const _hoisted_5$1 = { class: "font-weight-bold" };
const _hoisted_6$1 = { key: 0 };
const _hoisted_7$1 = { key: 0 };
const _hoisted_8$1 = { key: 0 };
const _hoisted_9$1 = { key: 1 };
const _hoisted_10$1 = { class: "rules-scroll" };
const _hoisted_11$1 = { class: "rules-grid pa-4 pt-0" };
const _hoisted_12$1 = { class: "flex-grow-1 min-w-0" };
const _hoisted_13$1 = { class: "font-weight-bold text-truncate" };
const _hoisted_14$1 = { class: "text-caption text-medium-emphasis" };
const _hoisted_15$1 = {
  key: 0,
  class: "empty-rules"
};
const _hoisted_16$1 = { class: "board-controls mb-3" };
const _hoisted_17$1 = { class: "batch-bar mb-4" };
const _hoisted_18$1 = { class: "text-caption text-medium-emphasis mb-3" };
const _hoisted_19$1 = { key: 0 };
const _hoisted_20$1 = { key: 1 };
const _hoisted_21$1 = { class: "catalog-grid" };
const _hoisted_22$1 = { class: "select-corner" };
const _hoisted_23$1 = { class: "d-flex flex-wrap ga-1" };
const _hoisted_24$1 = {
  key: 0,
  class: "text-caption text-medium-emphasis mt-2"
};
const _hoisted_25$1 = {
  key: 0,
  class: "empty-catalog"
};
const _hoisted_26$1 = { class: "d-flex align-center ga-3 mb-4" };
const _hoisted_27$1 = { class: "tmdb-correction mb-4" };
const _hoisted_28$1 = {
  key: 2,
  class: "text-caption text-medium-emphasis mb-4"
};
const _hoisted_29$1 = { class: "d-flex align-center mb-2" };
const _hoisted_30$1 = { class: "manual-match" };

const {computed: computed$1,onBeforeUnmount,onMounted: onMounted$1,ref: ref$1,watch} = await importShared('vue');


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
const previewTitle = ref$1('');
const previewLoading = ref$1(false);
const previewResult = ref$1(null);
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
  const keyword = board.value.search.trim().toLocaleLowerCase();
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

async function loadRules() {
  const data = unwrapResponse(await props.api.get(`${props.pluginBase}/episode-normalizer`)) || {};
  rules.value = data.rules || [];
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

async function runPreview() {
  if (!previewTitle.value.trim()) return
  previewLoading.value = true;
  previewResult.value = null;
  error.value = '';
  try {
    previewResult.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/preview`,
      { title: previewTitle.value },
    ));
  } catch (err) {
    error.value = err?.message || '归一化试跑失败';
  } finally {
    previewLoading.value = false;
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
    title: '', quarter: '', aliases: '', source_season: '', target_start_season: 1, target_start_episode: 1,
  });
}

function groupType(type) {
  return ({ 1: '原始播出', 2: '绝对编号', 3: 'DVD', 4: 'Digital', 5: '故事线', 6: '制片', 7: 'TV' })[type] || `类型 ${type}`
}

watch(() => [board.value.year, board.value.quarter], () => loadQuarter(false));
onBeforeUnmount(() => { if (scanTimer) clearTimeout(scanTimer); });
onMounted$1(async () => {
  try {
    await Promise.all([loadRules(), loadQuarter(false)]);
  } catch (err) {
    error.value = err?.message || '集数归一化数据加载失败';
  }
});

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent$1("VAlert");
  const _component_VIcon = _resolveComponent$1("VIcon");
  const _component_VAvatar = _resolveComponent$1("VAvatar");
  const _component_VCardTitle = _resolveComponent$1("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$1("VCardSubtitle");
  const _component_VCardItem = _resolveComponent$1("VCardItem");
  const _component_VTextField = _resolveComponent$1("VTextField");
  const _component_VBtn = _resolveComponent$1("VBtn");
  const _component_VCardText = _resolveComponent$1("VCardText");
  const _component_VCard = _resolveComponent$1("VCard");
  const _component_VExpandTransition = _resolveComponent$1("VExpandTransition");
  const _component_VSelect = _resolveComponent$1("VSelect");
  const _component_VSwitch = _resolveComponent$1("VSwitch");
  const _component_VCheckbox = _resolveComponent$1("VCheckbox");
  const _component_VSpacer = _resolveComponent$1("VSpacer");
  const _component_VProgressLinear = _resolveComponent$1("VProgressLinear");
  const _component_VImg = _resolveComponent$1("VImg");
  const _component_VChip = _resolveComponent$1("VChip");
  const _component_VProgressCircular = _resolveComponent$1("VProgressCircular");
  const _component_VListItem = _resolveComponent$1("VListItem");
  const _component_VList = _resolveComponent$1("VList");
  const _component_VMenu = _resolveComponent$1("VMenu");
  const _component_VCardActions = _resolveComponent$1("VCardActions");
  const _component_VDivider = _resolveComponent$1("VDivider");
  const _component_VRadio = _resolveComponent$1("VRadio");
  const _component_VRadioGroup = _resolveComponent$1("VRadioGroup");
  const _component_VExpansionPanelTitle = _resolveComponent$1("VExpansionPanelTitle");
  const _component_VCol = _resolveComponent$1("VCol");
  const _component_VTextarea = _resolveComponent$1("VTextarea");
  const _component_VRow = _resolveComponent$1("VRow");
  const _component_VExpansionPanelText = _resolveComponent$1("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent$1("VExpansionPanel");
  const _component_VExpansionPanels = _resolveComponent$1("VExpansionPanels");
  const _component_VDialog = _resolveComponent$1("VDialog");
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
            _cache[23] || (_cache[23] = _createElementVNode$1("div", { class: "font-weight-bold" }, "归一化暂不能接管实际整理", -1)),
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
              color: "primary",
              variant: "tonal"
            }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VIcon, { icon: "mdi-flask-outline" })
              ]),
              _: 1
            })
          ]),
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardTitle, null, {
              default: _withCtx$1(() => [...(_cache[24] || (_cache[24] = [
                _createTextVNode$1("标题试跑", -1)
              ]))]),
              _: 1
            }),
            _createVNode$1(_component_VCardSubtitle, null, {
              default: _withCtx$1(() => [...(_cache[25] || (_cache[25] = [
                _createTextVNode$1("粘贴原标题，自动解析季集、匹配 TMDB 并检查维护规则", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$1(_component_VCardText, null, {
          default: _withCtx$1(() => [
            _createElementVNode$1("div", _hoisted_4$1, [
              _createVNode$1(_component_VTextField, {
                modelValue: previewTitle.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((previewTitle).value = $event)),
                label: "原标题或完整文件名",
                "hide-details": "",
                "prepend-inner-icon": "mdi-file-video-outline",
                onKeyup: _withKeys(runPreview, ["enter"])
              }, null, 8, ["modelValue"]),
              _createVNode$1(_component_VBtn, {
                color: "primary",
                "prepend-icon": "mdi-play",
                loading: previewLoading.value,
                onClick: runPreview
              }, {
                default: _withCtx$1(() => [...(_cache[26] || (_cache[26] = [
                  _createTextVNode$1("开始试跑", -1)
                ]))]),
                _: 1
              }, 8, ["loading"])
            ]),
            (previewResult.value)
              ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
                  key: 0,
                  type: previewResult.value.result?.applied ? 'success' : 'info',
                  variant: "tonal",
                  class: "mt-4"
                }, {
                  default: _withCtx$1(() => [
                    _createElementVNode$1("div", _hoisted_5$1, [
                      _createTextVNode$1(_toDisplayString$1(previewResult.value.parsed_title || '未提取标题') + " ", 1),
                      (previewResult.value.recognition?.best)
                        ? (_openBlock$1(), _createElementBlock$1("span", _hoisted_6$1, " · TMDB " + _toDisplayString$1(previewResult.value.recognition.best.tmdb_id), 1))
                        : _createCommentVNode$1("", true)
                    ]),
                    (previewResult.value.result)
                      ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_7$1, [
                          _createTextVNode$1(" S" + _toDisplayString$1(previewResult.value.result.season ?? '?') + "E" + _toDisplayString$1(previewResult.value.result.episode ?? '?') + " ", 1),
                          (previewResult.value.result.end_episode)
                            ? (_openBlock$1(), _createElementBlock$1("span", _hoisted_8$1, "-E" + _toDisplayString$1(previewResult.value.result.end_episode), 1))
                            : _createCommentVNode$1("", true),
                          _createTextVNode$1(" · " + _toDisplayString$1(previewResult.value.result.reason), 1)
                        ]))
                      : (_openBlock$1(), _createElementBlock$1("div", _hoisted_9$1, _toDisplayString$1(previewResult.value.recognition?.reason || '没有获得可信 TMDB 候选'), 1))
                  ]),
                  _: 1
                }, 8, ["type"]))
              : _createCommentVNode$1("", true)
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
              onClick: _cache[2] || (_cache[2] = $event => (rulesOpen.value = !rulesOpen.value))
            }, null, 8, ["icon", "title"])
          ]),
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardTitle, null, {
              default: _withCtx$1(() => [...(_cache[27] || (_cache[27] = [
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
            _withDirectives$1(_createElementVNode$1("div", _hoisted_10$1, [
              _createElementVNode$1("div", _hoisted_11$1, [
                (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(rules.value, (rule) => {
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
                          _createElementVNode$1("div", _hoisted_12$1, [
                            _createElementVNode$1("div", _hoisted_13$1, _toDisplayString$1(rule.title), 1),
                            _createElementVNode$1("div", _hoisted_14$1, "TMDB " + _toDisplayString$1(rule.tmdb_id) + " · " + _toDisplayString$1(rule.target_type === 'group' ? '剧集组' : '默认编集') + " · " + _toDisplayString$1(rule.installments?.length || 0) + " 个季度片段", 1)
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
                }), 128)),
                (!rules.value.length)
                  ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_15$1, "从季度看板直接加入，或批量建立规则。"))
                  : _createCommentVNode$1("", true)
              ])
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
            _createVNode$1(_component_VBtn, {
              icon: "mdi-refresh",
              variant: "text",
              loading: catalogLoading.value,
              onClick: _cache[3] || (_cache[3] = $event => (loadQuarter(true)))
            }, null, 8, ["loading"])
          ]),
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardTitle, null, {
              default: _withCtx$1(() => [...(_cache[28] || (_cache[28] = [
                _createTextVNode$1("季度番剧看板", -1)
              ]))]),
              _: 1
            }),
            _createVNode$1(_component_VCardSubtitle, null, {
              default: _withCtx$1(() => [
                _createTextVNode$1("AniList 季度目录 · AniBridge/TMDB 匹配；当前仅显示 " + _toDisplayString$1(quarterKey.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$1(_component_VCardText, null, {
          default: _withCtx$1(() => [
            _createElementVNode$1("div", _hoisted_16$1, [
              _createVNode$1(_component_VSelect, {
                modelValue: board.value.year,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((board.value.year) = $event)),
                items: _unref$1(years),
                label: "年份",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$1(_component_VSelect, {
                modelValue: board.value.quarter,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((board.value.quarter) = $event)),
                items: [1,2,3,4].map(value => ({ title: `Q${value}`, value })),
                label: "季度",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$1(_component_VTextField, {
                modelValue: board.value.search,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((board.value.search) = $event)),
                label: "搜索番剧",
                "prepend-inner-icon": "mdi-magnify",
                clearable: "",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue"]),
              _createVNode$1(_component_VSelect, {
                modelValue: board.value.region,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((board.value.region) = $event)),
                label: "地区",
                "hide-details": "",
                density: "compact",
                items: [{title:'全部地区',value:'all'},{title:'日漫',value:'japan'},{title:'国漫',value:'china'},{title:'海外动画',value:'western'},{title:'地区未知',value:'unknown'}]
              }, null, 8, ["modelValue"]),
              _createVNode$1(_component_VSelect, {
                modelValue: board.value.platform,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((board.value.platform) = $event)),
                items: platforms.value,
                label: "载体",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$1(_component_VSelect, {
                modelValue: board.value.scanStatus,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((board.value.scanStatus) = $event)),
                label: "扫描状态",
                "hide-details": "",
                density: "compact",
                items: [{title:'全部状态',value:'all'},{title:'正在扫描',value:'scanning'},{title:'已匹配',value:'matched'},{title:'匹配失败',value:'failed'}]
              }, null, 8, ["modelValue"]),
              _createVNode$1(_component_VSwitch, {
                modelValue: board.value.multiOnly,
                "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((board.value.multiOnly) = $event)),
                label: "仅续作/多季",
                color: "secondary",
                "hide-details": "",
                density: "compact"
              }, null, 8, ["modelValue"])
            ]),
            _createElementVNode$1("div", _hoisted_17$1, [
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
                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((batchPreference).value = $event)),
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
            _createElementVNode$1("div", _hoisted_18$1, [
              _createTextVNode$1(" 当前 " + _toDisplayString$1(filteredCatalog.value.length) + " / " + _toDisplayString$1(catalog.value.length) + " 条 ", 1),
              (catalogMeta.value.scanning_count)
                ? (_openBlock$1(), _createElementBlock$1("span", _hoisted_19$1, " · " + _toDisplayString$1(catalogMeta.value.scanning_count) + " 条正在扫描", 1))
                : _createCommentVNode$1("", true),
              (catalogMeta.value.updated_at)
                ? (_openBlock$1(), _createElementBlock$1("span", _hoisted_20$1, " · 更新于 " + _toDisplayString$1(catalogMeta.value.updated_at), 1))
                : _createCommentVNode$1("", true)
            ]),
            _createElementVNode$1("div", _hoisted_21$1, [
              (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(filteredCatalog.value, (item) => {
                return (_openBlock$1(), _createBlock$1(_component_VCard, {
                  key: item.id,
                  variant: "outlined",
                  class: "catalog-card"
                }, {
                  default: _withCtx$1(() => [
                    _createElementVNode$1("div", _hoisted_22$1, [
                      _createVNode$1(_component_VCheckbox, {
                        modelValue: selectedIds.value,
                        "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((selectedIds).value = $event)),
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
                        _createElementVNode$1("div", _hoisted_23$1, [
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
                                default: _withCtx$1(() => [...(_cache[29] || (_cache[29] = [
                                  _createTextVNode$1("续作/多季", -1)
                                ]))]),
                                _: 1
                              }))
                            : _createCommentVNode$1("", true),
                          (item.scan_status === 'scanning')
                            ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                key: 3,
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
                                  _cache[30] || (_cache[30] = _createTextVNode$1("正在扫描 ", -1))
                                ]),
                                _: 1
                              }))
                            : (item.scan_status === 'failed')
                              ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                  key: 4,
                                  size: "x-small",
                                  color: "warning",
                                  variant: "tonal"
                                }, {
                                  default: _withCtx$1(() => [...(_cache[31] || (_cache[31] = [
                                    _createTextVNode$1("匹配待补充", -1)
                                  ]))]),
                                  _: 1
                                }))
                              : _createCommentVNode$1("", true),
                          (item.maintained)
                            ? (_openBlock$1(), _createBlock$1(_component_VChip, {
                                key: 5,
                                size: "x-small",
                                color: "success",
                                "prepend-icon": "mdi-check"
                              }, {
                                default: _withCtx$1(() => [...(_cache[32] || (_cache[32] = [
                                  _createTextVNode$1("已维护", -1)
                                ]))]),
                                _: 1
                              }))
                            : _createCommentVNode$1("", true)
                        ]),
                        (item.tmdb_match?.best)
                          ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_24$1, " TMDB " + _toDisplayString$1(item.tmdb_match.best.tmdb_id) + " · " + _toDisplayString$1(item.tmdb_match.best.name), 1))
                          : _createCommentVNode$1("", true)
                      ]),
                      _: 2
                    }, 1024),
                    _createVNode$1(_component_VCardActions, null, {
                      default: _withCtx$1(() => [
                        (!item.maintained)
                          ? (_openBlock$1(), _createBlock$1(_component_VMenu, { key: 0 }, {
                              activator: _withCtx$1(({ props: menuProps }) => [
                                _createVNode$1(_component_VBtn, _mergeProps({ ref_for: true }, menuProps, {
                                  color: "primary",
                                  variant: "tonal",
                                  "append-icon": "mdi-menu-down",
                                  loading: busyId.value === item.id
                                }), {
                                  default: _withCtx$1(() => [...(_cache[33] || (_cache[33] = [
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
                          : (_openBlock$1(), _createBlock$1(_component_VBtn, {
                              key: 1,
                              variant: "text",
                              "prepend-icon": "mdi-pencil-outline",
                              onClick: $event => (openEditor(rules.value.find(rule => Number(rule.tmdb_id) === Number(item.tmdb_match?.best?.tmdb_id))))
                            }, {
                              default: _withCtx$1(() => [...(_cache[34] || (_cache[34] = [
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
                ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_25$1, [
                    _createVNode$1(_component_VIcon, {
                      icon: "mdi-calendar-search",
                      size: "48"
                    }),
                    _cache[35] || (_cache[35] = _createElementVNode$1("div", null, "当前筛选条件没有番剧", -1))
                  ]))
                : _createCommentVNode$1("", true)
            ])
          ]),
          _: 1
        })
      ]),
      _: 1
    }),
    _createVNode$1(_component_VDialog, {
      modelValue: editorOpen.value,
      "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((editorOpen).value = $event)),
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
                      onClick: _cache[13] || (_cache[13] = $event => (editorOpen.value = false))
                    })
                  ]),
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VCardTitle, null, {
                      default: _withCtx$1(() => [...(_cache[36] || (_cache[36] = [
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
                    _createElementVNode$1("div", _hoisted_26$1, [
                      _createVNode$1(_component_VSwitch, {
                        modelValue: editForm.value.enabled,
                        "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((editForm.value.enabled) = $event)),
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
                        default: _withCtx$1(() => [...(_cache[37] || (_cache[37] = [
                          _createTextVNode$1("刷新编集", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _createElementVNode$1("div", _hoisted_27$1, [
                      _createVNode$1(_component_VTextField, {
                        modelValue: editForm.value.tmdb_id,
                        "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((editForm.value.tmdb_id) = $event)),
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
                        default: _withCtx$1(() => [...(_cache[38] || (_cache[38] = [
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
                    _createVNode$1(_component_VRadioGroup, {
                      modelValue: editForm.value.target_type,
                      "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((editForm.value.target_type) = $event)),
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
                          key: 1,
                          modelValue: editForm.value.episode_group_id,
                          "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((editForm.value.episode_group_id) = $event)),
                          class: "mt-3",
                          items: (inspection.value?.groups || []).map(group => ({ title: `${group.name} · ${groupType(group.type)} · ${group.episode_count} 集`, value: group.id })),
                          label: "目标剧集组"
                        }, null, 8, ["modelValue", "items"]))
                      : _createCommentVNode$1("", true),
                    (selectedGroup.value)
                      ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_28$1, [
                          (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(selectedGroup.value.seasons || [], (season) => {
                            return (_openBlock$1(), _createElementBlock$1("span", {
                              key: season.season,
                              class: "me-3"
                            }, "S" + _toDisplayString$1(season.season) + " · " + _toDisplayString$1(season.episode_count) + " 集", 1))
                          }), 128))
                        ]))
                      : _createCommentVNode$1("", true),
                    _createElementVNode$1("div", _hoisted_29$1, [
                      _cache[40] || (_cache[40] = _createElementVNode$1("strong", null, "季度片段", -1)),
                      _createVNode$1(_component_VSpacer),
                      _createVNode$1(_component_VBtn, {
                        size: "small",
                        variant: "tonal",
                        "prepend-icon": "mdi-plus",
                        onClick: addInstallment
                      }, {
                        default: _withCtx$1(() => [...(_cache[39] || (_cache[39] = [
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
                                      _createVNode$1(_component_VCol, { cols: "6" }, {
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
                                      _createVNode$1(_component_VCol, { cols: "6" }, {
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
                                    default: _withCtx$1(() => [...(_cache[41] || (_cache[41] = [
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
                      onClick: _cache[18] || (_cache[18] = $event => (editorOpen.value = false))
                    }, {
                      default: _withCtx$1(() => [...(_cache[42] || (_cache[42] = [
                        _createTextVNode$1("取消", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$1(_component_VBtn, {
                      color: "primary",
                      loading: editorLoading.value,
                      onClick: saveRule
                    }, {
                      default: _withCtx$1(() => [...(_cache[43] || (_cache[43] = [
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
      "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((failureDialog).value = $event)),
      "max-width": "720"
    }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCard, null, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardItem, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardTitle, null, {
                  default: _withCtx$1(() => [...(_cache[44] || (_cache[44] = [
                    _createTextVNode$1("这些番剧未能自动匹配", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VCardSubtitle, null, {
                  default: _withCtx$1(() => [...(_cache[45] || (_cache[45] = [
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
                      _createElementVNode$1("div", _hoisted_30$1, [
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
                          default: _withCtx$1(() => [...(_cache[46] || (_cache[46] = [
                            _createTextVNode$1("补充并加入", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading", "onClick"]),
                        _createVNode$1(_component_VBtn, {
                          variant: "text",
                          color: "medium-emphasis",
                          onClick: $event => (ignoreFailure(failure))
                        }, {
                          default: _withCtx$1(() => [...(_cache[47] || (_cache[47] = [
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
                  onClick: _cache[20] || (_cache[20] = $event => (failureDialog.value = false))
                }, {
                  default: _withCtx$1(() => [...(_cache[48] || (_cache[48] = [
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
      "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((snackbar).value = $event)),
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
const EpisodeNormalizer = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-444d86fe"]]);

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
const _hoisted_10 = { class: "flow-index" };
const _hoisted_11 = { class: "font-weight-bold" };
const _hoisted_12 = { class: "text-body-2 text-medium-emphasis" };
const _hoisted_13 = { class: "arrow-line" };
const _hoisted_14 = { class: "d-flex justify-space-between text-body-2" };
const _hoisted_15 = { class: "d-flex justify-space-between text-body-2 mt-2" };
const _hoisted_16 = { class: "workspace-panel" };
const _hoisted_17 = { class: "tab-content" };
const _hoisted_18 = { class: "sticky-actions" };
const _hoisted_19 = { class: "workspace-panel" };
const _hoisted_20 = { class: "tab-content" };
const _hoisted_21 = { class: "d-flex flex-wrap ga-2 mb-4" };
const _hoisted_22 = {
  key: 2,
  class: "best-result"
};
const _hoisted_23 = { class: "text-h6" };
const _hoisted_24 = { class: "text-caption text-medium-emphasis" };
const _hoisted_25 = { class: "text-caption text-medium-emphasis" };
const _hoisted_26 = { class: "text-caption" };
const _hoisted_27 = { class: "text-medium-emphasis" };
const _hoisted_28 = { key: 0 };
const _hoisted_29 = {
  key: 1,
  class: "empty-preview"
};
const _hoisted_30 = { class: "workspace-panel" };
const _hoisted_31 = { class: "tab-content" };
const _hoisted_32 = { class: "d-flex align-center mb-4" };
const _hoisted_33 = {
  key: 0,
  class: "history-list"
};
const _hoisted_34 = { class: "d-flex align-start" };
const _hoisted_35 = { class: "flex-grow-1" };
const _hoisted_36 = { class: "font-weight-bold" };
const _hoisted_37 = ["title"];
const _hoisted_38 = { class: "text-caption text-medium-emphasis mt-1" };
const _hoisted_39 = { class: "d-flex flex-wrap ga-1 mt-2" };
const _hoisted_40 = {
  key: 1,
  class: "empty-preview"
};
const _hoisted_41 = { class: "workspace-panel" };
const _hoisted_42 = { class: "tab-content" };
const _hoisted_43 = { class: "workspace-panel" };
const _hoisted_44 = { class: "tab-content" };
const _hoisted_45 = { class: "text-subtitle-1 font-weight-bold mt-4" };
const _hoisted_46 = { class: "text-body-2 text-medium-emphasis" };

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
const tab = ref('overview');
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
    const response = await props.api.post(`${pluginBase.value}/preview`, { ...previewInput.value });
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
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent("VCardSubtitle");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VTextarea = _resolveComponent("VTextarea");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VSelect = _resolveComponent("VSelect");
  const _component_VProgressCircular = _resolveComponent("VProgressCircular");
  const _component_VTable = _resolveComponent("VTable");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    (!__props.hideTitle)
      ? (_openBlock(), _createElementBlock("div", _hoisted_2, [
          _cache[9] || (_cache[9] = _createElementVNode("div", { class: "hero-glow hero-glow-a" }, null, -1)),
          _cache[10] || (_cache[10] = _createElementVNode("div", { class: "hero-glow hero-glow-b" }, null, -1)),
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
            _cache[8] || (_cache[8] = _createElementVNode("div", null, [
              _createElementVNode("div", { class: "text-h5 font-weight-bold hero-title" }, "TMDB 识别增强"),
              _createElementVNode("div", { class: "text-body-2 hero-subtitle" }, "可解释地确定 TMDBID，并按目标编集归一化动漫季集")
            ], -1)),
            _createVNode(_component_VSpacer),
            _createVNode(_component_VChip, {
              color: config.value.enabled ? 'success' : 'default',
              variant: "flat",
              "prepend-icon": "mdi-circle-medium"
            }, {
              default: _withCtx(() => [
                _createTextVNode(_toDisplayString(config.value.enabled ? '正在接管失败识别' : '当前未启用'), 1)
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
            class: "px-2"
          }, {
            default: _withCtx(() => [
              _createVNode(_component_VTab, {
                value: "overview",
                "prepend-icon": "mdi-radar"
              }, {
                default: _withCtx(() => [...(_cache[11] || (_cache[11] = [
                  _createTextVNode("策略总览", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "settings",
                "prepend-icon": "mdi-tune-variant"
              }, {
                default: _withCtx(() => [...(_cache[12] || (_cache[12] = [
                  _createTextVNode("参数设置", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "preview",
                "prepend-icon": "mdi-flask-outline"
              }, {
                default: _withCtx(() => [...(_cache[13] || (_cache[13] = [
                  _createTextVNode("识别试跑", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "history",
                "prepend-icon": "mdi-history"
              }, {
                default: _withCtx(() => [...(_cache[14] || (_cache[14] = [
                  _createTextVNode("运行记录", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "episodes",
                "prepend-icon": "mdi-animation-outline"
              }, {
                default: _withCtx(() => [...(_cache[15] || (_cache[15] = [
                  _createTextVNode("集数归一化", -1)
                ]))]),
                _: 1
              }),
              _createVNode(_component_VTab, {
                value: "parser",
                "prepend-icon": "mdi-puzzle-outline"
              }, {
                default: _withCtx(() => [...(_cache[16] || (_cache[16] = [
                  _createTextVNode("解析扩展", -1)
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
                _createVNode(_component_VRow, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      md: "7"
                    }, {
                      default: _withCtx(() => [
                        _cache[17] || (_cache[17] = _createElementVNode("div", { class: "text-h6 mb-1" }, "当前决策链", -1)),
                        _cache[18] || (_cache[18] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis mb-5" }, "候选搜索保持原策略；集数归一化只在 TMDBID 命中已维护目标时执行，不改变 Rust 标题提取。", -1)),
                        (_openBlock(), _createElementBlock(_Fragment, null, _renderList([
                    ['原生完全匹配', '沿用 MoviePilot 当前严格匹配，成功即结束', 'mdi-check-bold'],
                    ['生成降级搜索词', '完整标题失败后，尝试冒号前的稳定主体名称', 'mdi-text-search'],
                    ['拉取并合并候选', '按 TMDB ID 去重，补充别名、译名和季信息', 'mdi-database-sync-outline'],
                    ['双阈值决策', '最佳分数与领先分差必须同时满足才会注入', 'mdi-shield-check-outline'],
                  ], (step, index) => {
                          return _createElementVNode("div", {
                            key: step[0],
                            class: "flow-step"
                          }, [
                            _createElementVNode("div", _hoisted_10, _toDisplayString(index + 1), 1),
                            _createVNode(_component_VAvatar, {
                              size: "38",
                              color: "primary",
                              variant: "tonal"
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_VIcon, {
                                  icon: step[2],
                                  size: "20"
                                }, null, 8, ["icon"])
                              ]),
                              _: 2
                            }, 1024),
                            _createElementVNode("div", null, [
                              _createElementVNode("div", _hoisted_11, _toDisplayString(step[0]), 1),
                              _createElementVNode("div", _hoisted_12, _toDisplayString(step[1]), 1)
                            ])
                          ])
                        }), 64))
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCol, {
                      cols: "12",
                      md: "5"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VCard, {
                          color: "primary",
                          variant: "tonal",
                          class: "example-card"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VCardItem, null, {
                              default: _withCtx(() => [
                                _createVNode(_component_VCardTitle, null, {
                                  default: _withCtx(() => [...(_cache[19] || (_cache[19] = [
                                    _createTextVNode("典型降级示例", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VCardSubtitle, null, {
                                  default: _withCtx(() => [...(_cache[20] || (_cache[20] = [
                                    _createTextVNode("搜索词从具体到宽泛", -1)
                                  ]))]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            _createVNode(_component_VCardText, null, {
                              default: _withCtx(() => [
                                _cache[23] || (_cache[23] = _createElementVNode("div", { class: "code-title" }, "Mushoku Tensei: Isekai Ittara Honki Dasu", -1)),
                                _createElementVNode("div", _hoisted_13, [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-arrow-down",
                                    size: "18"
                                  })
                                ]),
                                _cache[24] || (_cache[24] = _createElementVNode("div", { class: "code-title code-title-main" }, "Mushoku Tensei", -1)),
                                _createVNode(_component_VDivider, { class: "my-4" }),
                                _createElementVNode("div", _hoisted_14, [
                                  _cache[21] || (_cache[21] = _createElementVNode("span", null, "最低得分", -1)),
                                  _createElementVNode("strong", null, _toDisplayString(config.value.minimum_score), 1)
                                ]),
                                _createElementVNode("div", _hoisted_15, [
                                  _cache[22] || (_cache[22] = _createElementVNode("span", null, "领先分差", -1)),
                                  _createElementVNode("strong", null, _toDisplayString(config.value.minimum_margin), 1)
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
                  ]),
                  _: 1
                })
              ])
            ], 512), [
              [_vShow, tab.value === 'overview']
            ]),
            _withDirectives(_createElementVNode("section", _hoisted_16, [
              _createElementVNode("div", _hoisted_17, [
                _createVNode(StrategySettings, {
                  modelValue: config.value,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config).value = $event))
                }, null, 8, ["modelValue"]),
                _createElementVNode("div", _hoisted_18, [
                  _createVNode(_component_VBtn, {
                    color: "primary",
                    "prepend-icon": "mdi-content-save",
                    loading: saving.value,
                    onClick: saveConfig
                  }, {
                    default: _withCtx(() => [...(_cache[25] || (_cache[25] = [
                      _createTextVNode("保存并立即生效", -1)
                    ]))]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ])
            ], 512), [
              [_vShow, tab.value === 'settings']
            ]),
            _withDirectives(_createElementVNode("section", _hoisted_19, [
              _createElementVNode("div", _hoisted_20, [
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
                                  default: _withCtx(() => [...(_cache[26] || (_cache[26] = [
                                    _createTextVNode("输入失败样本", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VCardSubtitle, null, {
                                  default: _withCtx(() => [...(_cache[27] || (_cache[27] = [
                                    _createTextVNode("试跑不会修改文件，也不会写入整理链", -1)
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
                                  default: _withCtx(() => [...(_cache[28] || (_cache[28] = [
                                    _createTextVNode("可直接粘贴原始文件名；插件会先复用 MoviePilot 识别词与解析器，再生成 TMDB 搜索词。", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VTextarea, {
                                  modelValue: previewInput.value.title,
                                  "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((previewInput.value.title) = $event)),
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
                                        _cache[29] || (_cache[29] = _createElementVNode("div", { class: "field-label" }, "年份提示", -1)),
                                        _createVNode(_component_VTextField, {
                                          modelValue: previewInput.value.year,
                                          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((previewInput.value.year) = $event)),
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
                                        _cache[30] || (_cache[30] = _createElementVNode("div", { class: "field-label" }, "类型提示", -1)),
                                        _createVNode(_component_VSelect, {
                                          modelValue: previewInput.value.media_type,
                                          "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((previewInput.value.media_type) = $event)),
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
                                        _cache[31] || (_cache[31] = _createElementVNode("div", { class: "field-label" }, "季提示", -1)),
                                        _createVNode(_component_VTextField, {
                                          modelValue: previewInput.value.season,
                                          "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((previewInput.value.season) = $event)),
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
                                        _cache[32] || (_cache[32] = _createElementVNode("div", { class: "field-label" }, "集提示", -1)),
                                        _createVNode(_component_VTextField, {
                                          modelValue: previewInput.value.episode,
                                          "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((previewInput.value.episode) = $event)),
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
                                  default: _withCtx(() => [...(_cache[33] || (_cache[33] = [
                                    _createTextVNode("开始候选分析", -1)
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
                                    (preview.value.original_title)
                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                          key: 0,
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
                                    (preview.value.web_search?.attempted)
                                      ? (_openBlock(), _createBlock(_component_VAlert, {
                                          key: 1,
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
                                    _cache[35] || (_cache[35] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mb-2" }, "实际搜索词", -1)),
                                    _createElementVNode("div", _hoisted_21, [
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
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_22, [
                                          _createElementVNode("div", null, [
                                            _createElementVNode("div", _hoisted_23, _toDisplayString(preview.value.best.name), 1),
                                            _createElementVNode("div", _hoisted_24, _toDisplayString(_unref(mediaTypeText)(preview.value.best.media_type)) + " · " + _toDisplayString(preview.value.best.year || '未知年份') + " · TMDB " + _toDisplayString(preview.value.best.tmdb_id), 1)
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
                                    (preview.value.candidates?.length)
                                      ? (_openBlock(), _createBlock(_component_VTable, {
                                          key: 3,
                                          density: "compact",
                                          class: "candidate-table mt-4"
                                        }, {
                                          default: _withCtx(() => [
                                            _cache[34] || (_cache[34] = _createElementVNode("thead", null, [
                                              _createElementVNode("tr", null, [
                                                _createElementVNode("th", null, "候选"),
                                                _createElementVNode("th", null, "命中名称"),
                                                _createElementVNode("th", null, "得分")
                                              ])
                                            ], -1)),
                                            _createElementVNode("tbody", null, [
                                              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.candidates, (candidate) => {
                                                return (_openBlock(), _createElementBlock("tr", {
                                                  key: `${candidate.media_type}-${candidate.tmdb_id}`
                                                }, [
                                                  _createElementVNode("td", null, [
                                                    _createElementVNode("strong", null, _toDisplayString(candidate.name), 1),
                                                    _createElementVNode("div", _hoisted_25, _toDisplayString(candidate.year || '—') + " · #" + _toDisplayString(candidate.tmdb_id), 1)
                                                  ]),
                                                  _createElementVNode("td", _hoisted_26, [
                                                    _createTextVNode(_toDisplayString(candidate.matched_name || '—'), 1),
                                                    _createElementVNode("div", _hoisted_27, [
                                                      _createTextVNode("查询来源 " + _toDisplayString(candidate.query_confidence ?? 0), 1),
                                                      (candidate.web_evidence)
                                                        ? (_openBlock(), _createElementBlock("span", _hoisted_28, " · 外部证据 " + _toDisplayString(candidate.web_evidence), 1))
                                                        : _createCommentVNode("", true)
                                                    ])
                                                  ]),
                                                  _createElementVNode("td", null, [
                                                    _createVNode(_component_VChip, {
                                                      size: "small",
                                                      color: _unref(scoreColor)(candidate.score)
                                                    }, {
                                                      default: _withCtx(() => [
                                                        _createTextVNode(_toDisplayString(candidate.score), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])
                                                  ])
                                                ]))
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
                          : (_openBlock(), _createElementBlock("div", _hoisted_29, [
                              _createVNode(_component_VIcon, {
                                icon: "mdi-chart-bubble",
                                size: "64",
                                color: "primary"
                              }),
                              _cache[36] || (_cache[36] = _createElementVNode("div", { class: "text-h6 mt-3" }, "等待一次试跑", -1)),
                              _cache[37] || (_cache[37] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "结果会解释为何接纳或拒绝每个候选", -1))
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
            _withDirectives(_createElementVNode("section", _hoisted_30, [
              _createElementVNode("div", _hoisted_31, [
                _createElementVNode("div", _hoisted_32, [
                  _cache[39] || (_cache[39] = _createElementVNode("div", null, [
                    _createElementVNode("div", { class: "text-h6" }, "最近识别记录"),
                    _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "只保存决策摘要，不保存 TMDB 完整响应")
                  ], -1)),
                  _createVNode(_component_VSpacer),
                  _createVNode(_component_VBtn, {
                    variant: "text",
                    color: "error",
                    "prepend-icon": "mdi-delete-sweep-outline",
                    disabled: !history.value.length,
                    onClick: clearHistory
                  }, {
                    default: _withCtx(() => [...(_cache[38] || (_cache[38] = [
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
                  ? (_openBlock(), _createElementBlock("div", _hoisted_33, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(history.value, (item) => {
                        return (_openBlock(), _createElementBlock("div", {
                          key: `${item.created_at}-${item.title}`,
                          class: "history-row"
                        }, [
                          _createElementVNode("div", {
                            class: _normalizeClass(["history-marker", item.accepted ? 'history-marker-success' : 'history-marker-warning'])
                          }, [...(_cache[40] || (_cache[40] = [
                            _createElementVNode("span", null, null, -1)
                          ]))], 2),
                          _createVNode(_component_VCard, {
                            variant: "outlined",
                            class: "history-card"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VCardText, null, {
                                default: _withCtx(() => [
                                  _createElementVNode("div", _hoisted_34, [
                                    _createElementVNode("div", _hoisted_35, [
                                      _createElementVNode("div", _hoisted_36, _toDisplayString(item.title), 1),
                                      (item.original_title)
                                        ? (_openBlock(), _createElementBlock("div", {
                                            key: 0,
                                            class: "text-caption text-medium-emphasis text-truncate mt-1",
                                            title: item.original_title
                                          }, "原标题：" + _toDisplayString(item.original_title), 9, _hoisted_37))
                                        : _createCommentVNode("", true),
                                      _createElementVNode("div", _hoisted_38, _toDisplayString(item.created_at) + " · " + _toDisplayString(item.reason), 1),
                                      _createElementVNode("div", _hoisted_39, [
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
                  : (_openBlock(), _createElementBlock("div", _hoisted_40, [
                      _createVNode(_component_VIcon, {
                        icon: "mdi-history",
                        size: "60"
                      }),
                      _cache[41] || (_cache[41] = _createElementVNode("div", { class: "text-h6 mt-3" }, "尚无运行记录", -1))
                    ]))
              ])
            ], 512), [
              [_vShow, tab.value === 'history']
            ]),
            _withDirectives(_createElementVNode("section", _hoisted_41, [
              _createElementVNode("div", _hoisted_42, [
                _createVNode(EpisodeNormalizer, {
                  api: __props.api,
                  "plugin-base": pluginBase.value,
                  "runtime-status": normalizerStatus.value
                }, null, 8, ["api", "plugin-base", "runtime-status"])
              ])
            ], 512), [
              [_vShow, tab.value === 'episodes']
            ]),
            _withDirectives(_createElementVNode("section", _hoisted_43, [
              _createElementVNode("div", _hoisted_44, [
                _createVNode(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  icon: "mdi-language-rust"
                }, {
                  default: _withCtx(() => [...(_cache[42] || (_cache[42] = [
                    _createTextVNode("当前版本不会修改 MoviePilot-Rust。这里预留给后续的解析器规则、罗马数字季号与标题提取诊断。", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VRow, { class: "mt-3" }, {
                  default: _withCtx(() => [
                    (_openBlock(), _createElementBlock(_Fragment, null, _renderList([['罗马数字季号','III → Season 3','mdi-numeric-3-box-outline'],['标题切片规则','保留稳定主体与别名','mdi-content-cut'],['解析对照调试','Rust / Python 结果并排','mdi-compare-horizontal']], (item) => {
                      return _createVNode(_component_VCol, {
                        key: item[0],
                        cols: "12",
                        md: "4"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCard, {
                            variant: "outlined",
                            class: "future-card"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VCardText, null, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VAvatar, {
                                    color: "secondary",
                                    variant: "tonal"
                                  }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VIcon, {
                                        icon: item[2]
                                      }, null, 8, ["icon"])
                                    ]),
                                    _: 2
                                  }, 1024),
                                  _createElementVNode("div", _hoisted_45, _toDisplayString(item[0]), 1),
                                  _createElementVNode("div", _hoisted_46, _toDisplayString(item[1]), 1),
                                  _createVNode(_component_VChip, {
                                    class: "mt-4",
                                    size: "small",
                                    variant: "tonal"
                                  }, {
                                    default: _withCtx(() => [...(_cache[43] || (_cache[43] = [
                                      _createTextVNode("后续版本", -1)
                                    ]))]),
                                    _: 1
                                  })
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)
                    }), 64))
                  ]),
                  _: 1
                })
              ])
            ], 512), [
              [_vShow, tab.value === 'parser']
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
const AppPage = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-cf5d19ea"]]);

export { AppPage as default };
