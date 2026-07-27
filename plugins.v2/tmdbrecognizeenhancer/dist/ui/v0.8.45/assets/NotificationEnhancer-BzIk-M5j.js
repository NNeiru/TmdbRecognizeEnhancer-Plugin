import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { M as ModuleHeader } from './ModuleHeader-D43l2fc-.js';
import { u as unwrapResponse } from './utils-Wv8mt00E.js';
import { _ as _export_sfc } from './_plugin-vue_export-helper-pcqpp-6-.js';

const {toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,openBlock:_openBlock,createBlock:_createBlock,createCommentVNode:_createCommentVNode,createVNode:_createVNode,renderList:_renderList,Fragment:_Fragment,createElementBlock:_createElementBlock,createElementVNode:_createElementVNode,normalizeClass:_normalizeClass,vShow:_vShow,withDirectives:_withDirectives} = await importShared('vue');


const _hoisted_1 = { class: "notification-page" };
const _hoisted_2 = {
  class: "notification-workspace-nav",
  "aria-label": "通知接管功能分区"
};
const _hoisted_3 = ["onClick"];
const _hoisted_4 = { class: "section-shell" };
const _hoisted_5 = { class: "mode-grid" };
const _hoisted_6 = ["onClick"];
const _hoisted_7 = { class: "route-defaults" };
const _hoisted_8 = { class: "route-legend" };
const _hoisted_9 = { class: "notification-type-grid" };
const _hoisted_10 = { class: "notification-type-copy" };
const _hoisted_11 = {
  key: 1,
  class: "route-service-placeholder"
};
const _hoisted_12 = { class: "template-panel-title" };
const _hoisted_13 = { class: "notification-template-grid" };
const _hoisted_14 = { class: "notification-template-card failure" };
const _hoisted_15 = { class: "notification-template-card generic" };
const _hoisted_16 = { class: "option-row mt-3" };
const _hoisted_17 = { class: "section-shell" };
const _hoisted_18 = { class: "section-heading" };
const _hoisted_19 = { class: "policy-grid" };
const _hoisted_20 = { class: "policy-copy" };
const _hoisted_21 = { class: "section-shell" };
const _hoisted_22 = { class: "section-heading responsive" };
const _hoisted_23 = { class: "delivery-grid" };
const _hoisted_24 = { class: "delivery-mode" };
const _hoisted_25 = { class: "delivery-mode realtime" };
const _hoisted_26 = { class: "candidate-message-style" };
const _hoisted_27 = {
  key: 0,
  class: "premium-emoji-help"
};
const _hoisted_28 = { class: "candidate-controls" };
const _hoisted_29 = { class: "option-row compact" };
const _hoisted_30 = {
  key: 2,
  class: "candidate-list"
};
const _hoisted_31 = { class: "candidate-toolbar" };
const _hoisted_32 = { class: "candidate-actions" };
const _hoisted_33 = { class: "candidate-items" };
const _hoisted_34 = {
  key: 1,
  class: "candidate-poster candidate-poster-placeholder"
};
const _hoisted_35 = { class: "candidate-copy" };
const _hoisted_36 = {
  key: 3,
  class: "candidate-list failed-list"
};
const _hoisted_37 = { class: "candidate-toolbar" };
const _hoisted_38 = { class: "candidate-actions" };
const _hoisted_39 = { class: "candidate-items" };
const _hoisted_40 = {
  key: 1,
  class: "candidate-poster candidate-poster-placeholder"
};
const _hoisted_41 = { class: "candidate-copy" };
const _hoisted_42 = {
  key: 4,
  class: "empty-inline"
};
const _hoisted_43 = { class: "section-shell" };
const _hoisted_44 = { key: 0 };
const _hoisted_45 = { class: "record-toolbar" };
const _hoisted_46 = {
  key: 0,
  class: "record-list"
};
const _hoisted_47 = { key: 0 };
const _hoisted_48 = {
  key: 1,
  class: "empty-inline"
};

const {computed,onBeforeUnmount,onMounted,ref} = await importShared('vue');


const _sfc_main = {
  __name: 'NotificationEnhancer',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginBase: { type: String, required: true },
},
  emits: ['config-saved'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;

const loading = ref(false);
const saving = ref(false);
const testing = ref(false);
const candidateLoading = ref(false);
const candidateSyncing = ref(false);
const actionLoading = ref(false);
const error = ref('');
const notice = ref('');
const data = ref({
  active: false,
  config: {},
  failure_categories: [],
  records: [],
  record_counts: {},
  candidates: { ready: [], failed: [] },
  notification_types: [],
  notification_content_templates: [],
  notification_services: [],
  notification_channels: [],
  candidate_schedule: {},
});
const now = new Date();
const selectedQuarter = ref(`${now.getFullYear()}-Q${Math.floor(now.getMonth() / 3) + 1}`);
const selectedReadyIds = ref([]);
const selectedFailedIds = ref([]);
const manualCandidateBusy = ref('');
const manualCandidateDialog = ref(false);
const manualCandidateItem = ref(null);
const manualCandidateTmdbId = ref('');
const recordFilter = ref('all');
const showRecords = ref(false);
const activeWorkspace = ref('routes');

const config = computed(() => data.value.config || {});
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
const quarterItems = computed(() => {
  const values = [];
  for (let year = now.getFullYear() + 1; year >= now.getFullYear() - 3; year -= 1) {
    for (let quarter = 4; quarter >= 1; quarter -= 1) {
      values.push({ title: `${year} 年 Q${quarter}`, value: `${year}-Q${quarter}` });
    }
  }
  return values
});
const records = computed(() => (data.value.records || []).filter(item => {
  if (recordFilter.value === 'all') return true
  return item.scene === recordFilter.value
}));
const readyCandidates = computed(() => data.value.candidates?.ready || []);
const failedCandidates = computed(() => data.value.candidates?.failed || []);
const notificationTypes = computed(() => data.value.notification_types || []);
const notificationContentTemplates = computed(() => data.value.notification_content_templates || []);
const notificationServiceItems = computed(() => (
  (data.value.notification_services || [])
    .filter(item => item.accepts_plugin)
    .map(item => ({
      title: item.title,
      value: item.value,
      subtitle: item.subtitle,
    }))
));
const unavailableNotificationServices = computed(() => (
  (data.value.notification_services || []).filter(item => !item.accepts_plugin)
));
const allReadySelected = computed(() => (
  readyCandidates.value.length > 0
  && selectedReadyIds.value.length === readyCandidates.value.length
));
const allFailedSelected = computed(() => (
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

onMounted(async () => {
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
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VChip = _resolveComponent("VChip");
  const _component_VSpacer = _resolveComponent("VSpacer");
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VSelect = _resolveComponent("VSelect");
  const _component_VAvatar = _resolveComponent("VAvatar");
  const _component_VExpansionPanelTitle = _resolveComponent("VExpansionPanelTitle");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VTextarea = _resolveComponent("VTextarea");
  const _component_VExpansionPanelText = _resolveComponent("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent("VExpansionPanel");
  const _component_VExpansionPanels = _resolveComponent("VExpansionPanels");
  const _component_VBtnToggle = _resolveComponent("VBtnToggle");
  const _component_VCheckboxBtn = _resolveComponent("VCheckboxBtn");
  const _component_VImg = _resolveComponent("VImg");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent("VCardSubtitle");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VDivider = _resolveComponent("VDivider");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCardActions = _resolveComponent("VCardActions");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VDialog = _resolveComponent("VDialog");
  const _component_VExpandTransition = _resolveComponent("VExpandTransition");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
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
    (notice.value)
      ? (_openBlock(), _createBlock(_component_VAlert, {
          key: 1,
          type: "success",
          variant: "tonal",
          closable: "",
          density: "compact",
          class: "mb-4",
          "onClick:close": _cache[1] || (_cache[1] = $event => (notice.value = ''))
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(notice.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    _createVNode(ModuleHeader, {
      icon: "mdi-bell-cog-outline",
      title: "通知接管",
      subtitle: "统一接管 MoviePilot 的下载、整理、订阅、站点、媒体服务器及其它系统通知。",
      color: "primary"
    }, {
      actions: _withCtx(() => [
        _createVNode(_component_VBtn, {
          variant: "tonal",
          "prepend-icon": "mdi-bell-check-outline",
          loading: testing.value,
          onClick: _cache[2] || (_cache[2] = $event => (sendTest('success')))
        }, {
          default: _withCtx(() => [...(_cache[41] || (_cache[41] = [
            _createTextVNode("测试成功通知", -1)
          ]))]),
          _: 1
        }, 8, ["loading"]),
        _createVNode(_component_VBtn, {
          color: "primary",
          "prepend-icon": "mdi-content-save",
          loading: saving.value,
          onClick: save
        }, {
          default: _withCtx(() => [...(_cache[42] || (_cache[42] = [
            _createTextVNode("保存设置", -1)
          ]))]),
          _: 1
        }, 8, ["loading"])
      ]),
      controls: _withCtx(() => [
        _createVNode(_component_VSwitch, {
          modelValue: config.value.notification_enhancer_enabled,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.value.notification_enhancer_enabled) = $event)),
          color: "success",
          "hide-details": "",
          label: "启用通知接管"
        }, null, 8, ["modelValue"]),
        _createVNode(_component_VChip, {
          color: data.value.active ? 'success' : 'default',
          variant: "tonal",
          size: "small"
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(data.value.active ? '正在运行' : '尚未运行'), 1)
          ]),
          _: 1
        }, 8, ["color"]),
        _createVNode(_component_VSpacer),
        _createVNode(_component_VSwitch, {
          modelValue: config.value.notification_plugin_enabled,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.notification_plugin_enabled) = $event)),
          color: "primary",
          "hide-details": "",
          label: "允许插件发送通知"
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _createElementVNode("nav", _hoisted_2, [
      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(workspaceItems, (item) => {
        return _createElementVNode("button", {
          key: item.value,
          type: "button",
          class: _normalizeClass({ active: activeWorkspace.value === item.value }),
          onClick: $event => (switchWorkspace(item.value))
        }, [
          _createVNode(_component_VIcon, {
            icon: item.icon,
            size: "19"
          }, null, 8, ["icon"]),
          _createElementVNode("span", null, _toDisplayString(item.title), 1)
        ], 10, _hoisted_3)
      }), 64))
    ]),
    _withDirectives(_createElementVNode("section", _hoisted_4, [
      _cache[50] || (_cache[50] = _createElementVNode("div", { class: "section-heading" }, [
        _createElementVNode("div", null, [
          _createElementVNode("h3", null, "接管范围与通知路由"),
          _createElementVNode("p", null, "先决定插件如何介入，再分别设置九类 MoviePilot 通知的处理方式和目标实例。")
        ])
      ], -1)),
      _createElementVNode("div", _hoisted_5, [
        (_openBlock(), _createElementBlock(_Fragment, null, _renderList(modeItems, (item) => {
          return _createElementVNode("button", {
            key: item.value,
            type: "button",
            class: _normalizeClass(["mode-card", { active: config.value.notification_mode === item.value }]),
            onClick: $event => (config.value.notification_mode = item.value)
          }, [
            _createVNode(_component_VIcon, {
              icon: item.value === 'observe' ? 'mdi-eye-outline' : item.value === 'parallel' ? 'mdi-call-split' : 'mdi-swap-horizontal-bold'
            }, null, 8, ["icon"]),
            _createElementVNode("span", null, [
              _createElementVNode("strong", null, _toDisplayString(item.title), 1),
              _createElementVNode("small", null, _toDisplayString(item.subtitle), 1)
            ]),
            (config.value.notification_mode === item.value)
              ? (_openBlock(), _createBlock(_component_VIcon, {
                  key: 0,
                  icon: "mdi-check-circle",
                  color: "primary"
                }))
              : _createCommentVNode("", true)
          ], 10, _hoisted_6)
        }), 64))
      ]),
      (config.value.notification_mode === 'takeover')
        ? (_openBlock(), _createBlock(_component_VAlert, {
            key: 0,
            type: "warning",
            variant: "tonal",
            density: "compact",
            class: "mt-3"
          }, {
            default: _withCtx(() => [
              _createTextVNode(_toDisplayString(data.value.takeover_note), 1)
            ]),
            _: 1
          }))
        : _createCommentVNode("", true),
      _createElementVNode("div", _hoisted_7, [
        _createVNode(_component_VSelect, {
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
        _createElementVNode("div", _hoisted_8, [
          _createVNode(_component_VIcon, {
            icon: "mdi-information-outline",
            color: "primary"
          }),
          _cache[43] || (_cache[43] = _createElementVNode("span", null, "“接管发送”才会重发；“仅记录”只进入运行记录；“静默忽略”不会外发。", -1))
        ])
      ]),
      _createElementVNode("div", _hoisted_9, [
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(notificationTypes.value, (item) => {
          return (_openBlock(), _createElementBlock("article", {
            key: item.key,
            class: "notification-type-card"
          }, [
            _createVNode(_component_VAvatar, {
              size: "38",
              color: "primary",
              variant: "tonal"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VIcon, {
                  icon: item.icon,
                  size: "20"
                }, null, 8, ["icon"])
              ]),
              _: 2
            }, 1024),
            _createElementVNode("div", _hoisted_10, [
              _createElementVNode("strong", null, _toDisplayString(item.label), 1),
              _createElementVNode("small", null, _toDisplayString(item.description), 1)
            ]),
            _createVNode(_component_VSelect, {
              modelValue: config.value.notification_type_routes[item.key].policy,
              "onUpdate:modelValue": $event => ((config.value.notification_type_routes[item.key].policy) = $event),
              items: routePolicyItems,
              density: "compact",
              variant: "outlined",
              "hide-details": "",
              class: "route-policy-select"
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            (config.value.notification_type_routes[item.key].policy === 'notify')
              ? (_openBlock(), _createBlock(_component_VSelect, {
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
              : (_openBlock(), _createElementBlock("div", _hoisted_11, _toDisplayString(config.value.notification_type_routes[item.key].policy === 'record' ? '仅保留审计记录' : '不发送、不打扰'), 1))
          ]))
        }), 128))
      ]),
      _createVNode(_component_VExpansionPanels, {
        variant: "accordion",
        class: "notification-template-panels"
      }, {
        default: _withCtx(() => [
          _createVNode(_component_VExpansionPanel, null, {
            default: _withCtx(() => [
              _createVNode(_component_VExpansionPanelTitle, null, {
                default: _withCtx(() => [
                  _createElementVNode("div", _hoisted_12, [
                    _createVNode(_component_VIcon, {
                      icon: "mdi-code-braces",
                      color: "primary"
                    }),
                    _cache[44] || (_cache[44] = _createElementVNode("span", null, [
                      _createElementVNode("strong", null, "通知模板与高级设置"),
                      _createElementVNode("small", null, "完整覆盖 MP 的四种内置模板，并为入库失败和其它通知提供独立模板。")
                    ], -1))
                  ])
                ]),
                _: 1
              }),
              _createVNode(_component_VExpansionPanelText, null, {
                default: _withCtx(() => [
                  _createVNode(_component_VAlert, {
                    type: "info",
                    variant: "tonal",
                    density: "compact",
                    class: "mb-3"
                  }, {
                    default: _withCtx(() => [...(_cache[45] || (_cache[45] = [
                      _createTextVNode(" MoviePilot 的系统通知模板会先完成渲染，", -1),
                      _createElementVNode("code", null, "original_title", -1),
                      _createTextVNode(" 与 ", -1),
                      _createElementVNode("code", null, "original_text", -1),
                      _createTextVNode(" 就是其最终结果。可用： ", -1),
                      _createElementVNode("code", null, "scene", -1),
                      _createTextVNode("、", -1),
                      _createElementVNode("code", null, "category_label", -1),
                      _createTextVNode("、", -1),
                      _createElementVNode("code", null, "reason", -1),
                      _createTextVNode("、 ", -1),
                      _createElementVNode("code", null, "source_path", -1),
                      _createTextVNode("、", -1),
                      _createElementVNode("code", null, "target_path", -1),
                      _createTextVNode("、", -1),
                      _createElementVNode("code", null, "notification_type_label", -1),
                      _createTextVNode("、 ", -1),
                      _createElementVNode("code", null, "current_time", -1),
                      _createTextVNode("。 ", -1)
                    ]))]),
                    _: 1
                  }),
                  _createElementVNode("div", _hoisted_13, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(notificationContentTemplates.value, (item) => {
                      return (_openBlock(), _createElementBlock("div", {
                        key: item.key,
                        class: "notification-template-card content"
                      }, [
                        _createElementVNode("h4", null, [
                          _createVNode(_component_VIcon, {
                            icon: item.icon
                          }, null, 8, ["icon"]),
                          _createTextVNode(" " + _toDisplayString(item.label), 1)
                        ]),
                        _createElementVNode("p", null, _toDisplayString(item.description), 1),
                        _createVNode(_component_VTextField, {
                          modelValue: config.value.notification_content_templates[item.key].title_template,
                          "onUpdate:modelValue": $event => ((config.value.notification_content_templates[item.key].title_template) = $event),
                          label: "标题模板",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        _createVNode(_component_VTextarea, {
                          modelValue: config.value.notification_content_templates[item.key].text_template,
                          "onUpdate:modelValue": $event => ((config.value.notification_content_templates[item.key].text_template) = $event),
                          label: "正文模板",
                          variant: "outlined",
                          rows: "4",
                          "auto-grow": "",
                          "hide-details": ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]))
                    }), 128)),
                    _createElementVNode("div", _hoisted_14, [
                      _createElementVNode("h4", null, [
                        _createVNode(_component_VIcon, { icon: "mdi-alert-circle-outline" }),
                        _cache[46] || (_cache[46] = _createTextVNode(" 入库失败", -1))
                      ]),
                      _cache[47] || (_cache[47] = _createElementVNode("p", null, "MoviePilot 手动处理类中的整理失败通知。", -1)),
                      _createVNode(_component_VTextField, {
                        modelValue: config.value.notification_failure_title_template,
                        "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((config.value.notification_failure_title_template) = $event)),
                        label: "标题模板",
                        variant: "outlined",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode(_component_VTextarea, {
                        modelValue: config.value.notification_failure_text_template,
                        "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((config.value.notification_failure_text_template) = $event)),
                        label: "正文模板",
                        variant: "outlined",
                        rows: "4",
                        "auto-grow": "",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ]),
                    _createElementVNode("div", _hoisted_15, [
                      _createElementVNode("h4", null, [
                        _createVNode(_component_VIcon, { icon: "mdi-bell-outline" }),
                        _cache[48] || (_cache[48] = _createTextVNode(" 其它通知", -1))
                      ]),
                      _cache[49] || (_cache[49] = _createElementVNode("p", null, "不属于上面四种 MP 内置模板的通知默认使用此项。", -1)),
                      _createVNode(_component_VTextField, {
                        modelValue: config.value.notification_generic_title_template,
                        "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((config.value.notification_generic_title_template) = $event)),
                        label: "标题模板",
                        variant: "outlined",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _createVNode(_component_VTextarea, {
                        modelValue: config.value.notification_generic_text_template,
                        "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((config.value.notification_generic_text_template) = $event)),
                        label: "正文模板",
                        variant: "outlined",
                        rows: "4",
                        "auto-grow": "",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ])
                  ]),
                  _createElementVNode("div", _hoisted_16, [
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.notification_success_enabled,
                      "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((config.value.notification_success_enabled) = $event)),
                      color: "success",
                      "hide-details": "",
                      label: "处理整理成功"
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.notification_failure_enabled,
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((config.value.notification_failure_enabled) = $event)),
                      color: "warning",
                      "hide-details": "",
                      label: "处理整理失败"
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.notification_passthrough_manual,
                      "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((config.value.notification_passthrough_manual) = $event)),
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
      [_vShow, activeWorkspace.value === 'routes']
    ]),
    _withDirectives(_createElementVNode("section", _hoisted_17, [
      _createElementVNode("div", _hoisted_18, [
        _cache[52] || (_cache[52] = _createElementVNode("div", null, [
          _createElementVNode("h3", null, "失败类型策略"),
          _createElementVNode("p", null, "失败原因会在通知发送前分类；未分类异常始终通知，避免静默吞错。")
        ], -1)),
        _createVNode(_component_VBtn, {
          variant: "text",
          color: "warning",
          "prepend-icon": "mdi-bell-alert-outline",
          loading: testing.value,
          onClick: _cache[13] || (_cache[13] = $event => (sendTest('failure')))
        }, {
          default: _withCtx(() => [...(_cache[51] || (_cache[51] = [
            _createTextVNode("测试失败通知", -1)
          ]))]),
          _: 1
        }, 8, ["loading"])
      ]),
      _createElementVNode("div", _hoisted_19, [
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(data.value.failure_categories, (item) => {
          return (_openBlock(), _createElementBlock("div", {
            key: item.key,
            class: "policy-card"
          }, [
            _createVNode(_component_VAvatar, {
              size: "38",
              color: "primary",
              variant: "tonal"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VIcon, {
                  icon: item.icon,
                  size: "20"
                }, null, 8, ["icon"])
              ]),
              _: 2
            }, 1024),
            _createElementVNode("div", _hoisted_20, [
              _createElementVNode("strong", null, _toDisplayString(item.label), 1),
              _createElementVNode("small", null, _toDisplayString(item.description), 1)
            ]),
            _createVNode(_component_VSelect, {
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
      [_vShow, activeWorkspace.value === 'failures']
    ]),
    _withDirectives(_createElementVNode("section", _hoisted_21, [
      _createElementVNode("div", _hoisted_22, [
        _cache[53] || (_cache[53] = _createElementVNode("div", null, [
          _createElementVNode("h3", null, "集数偏移通知与审批"),
          _createElementVNode("p", null, "存量按月或季度汇总；基线之后新增的匹配及失败条目逐部通知。")
        ], -1)),
        _createVNode(_component_VSwitch, {
          modelValue: config.value.notification_episode_candidates_enabled,
          "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((config.value.notification_episode_candidates_enabled) = $event)),
          color: "success",
          "hide-details": "",
          label: "启用集数候选通知"
        }, null, 8, ["modelValue"])
      ]),
      _createElementVNode("div", _hoisted_23, [
        _createVNode(_component_VSelect, {
          modelValue: config.value.notification_candidate_service,
          "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((config.value.notification_candidate_service) = $event)),
          items: notificationServiceItems.value,
          label: "集数偏移审批通知实例",
          placeholder: "请选择具体通知实例",
          density: "comfortable",
          variant: "outlined",
          clearable: "",
          "hide-details": ""
        }, null, 8, ["modelValue", "items"]),
        _createElementVNode("div", _hoisted_24, [
          _createVNode(_component_VSwitch, {
            modelValue: config.value.notification_candidate_batch_enabled,
            "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((config.value.notification_candidate_batch_enabled) = $event)),
            color: "primary",
            "hide-details": "",
            label: "定时批量"
          }, null, 8, ["modelValue"]),
          _createVNode(_component_VSelect, {
            modelValue: config.value.notification_candidate_batch_frequency,
            "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((config.value.notification_candidate_batch_frequency) = $event)),
            items: [
              { title: '每月月初', value: 'monthly' },
              { title: '每季度首月月初', value: 'quarterly' },
            ],
            density: "compact",
            variant: "outlined",
            "hide-details": "",
            disabled: !config.value.notification_candidate_batch_enabled
          }, null, 8, ["modelValue", "disabled"]),
          _createVNode(_component_VSelect, {
            modelValue: config.value.notification_candidate_batch_hour,
            "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((config.value.notification_candidate_batch_hour) = $event)),
            items: Array.from({ length: 24 }, (_, value) => ({ title: `${String(value).padStart(2, '0')}:00`, value })),
            density: "compact",
            variant: "outlined",
            "hide-details": "",
            disabled: !config.value.notification_candidate_batch_enabled
          }, null, 8, ["modelValue", "items", "disabled"])
        ]),
        _createElementVNode("div", _hoisted_25, [
          _createVNode(_component_VSwitch, {
            modelValue: config.value.notification_candidate_realtime_enabled,
            "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((config.value.notification_candidate_realtime_enabled) = $event)),
            color: "success",
            "hide-details": "",
            label: "实时监控新增"
          }, null, 8, ["modelValue"]),
          _cache[54] || (_cache[54] = _createElementVNode("small", null, "首次开启以当前缓存为基线；之后新增或失败转成功时逐部推送。", -1))
        ])
      ]),
      _createElementVNode("div", _hoisted_26, [
        _cache[57] || (_cache[57] = _createElementVNode("span", null, [
          _createElementVNode("strong", null, "候选通知样式"),
          _createElementVNode("small", null, "经典消息沿用 MoviePilot 通知格式；Rich Message 使用新版 Telegram 富文本和媒体页面。")
        ], -1)),
        _createVNode(_component_VBtnToggle, {
          modelValue: config.value.notification_candidate_message_style,
          "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((config.value.notification_candidate_message_style) = $event)),
          mandatory: "",
          density: "compact",
          color: "primary",
          variant: "outlined",
          divided: ""
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VBtn, {
              value: "classic",
              "prepend-icon": "mdi-message-text-outline"
            }, {
              default: _withCtx(() => [...(_cache[55] || (_cache[55] = [
                _createTextVNode("经典消息", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VBtn, {
              value: "rich",
              "prepend-icon": "mdi-card-text-outline"
            }, {
              default: _withCtx(() => [...(_cache[56] || (_cache[56] = [
                _createTextVNode("Rich Message", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        (config.value.notification_candidate_message_style === 'rich')
          ? (_openBlock(), _createBlock(_component_VTextField, {
              key: 0,
              modelValue: config.value.notification_candidate_custom_emoji_id,
              "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((config.value.notification_candidate_custom_emoji_id) = $event)),
              label: "会员表情 ID（可选）",
              placeholder: "留空使用普通符号",
              density: "compact",
              variant: "outlined",
              "hide-details": "",
              clearable: "",
              class: "premium-emoji-field"
            }, null, 8, ["modelValue"]))
          : _createCommentVNode("", true)
      ]),
      (config.value.notification_candidate_message_style === 'rich')
        ? (_openBlock(), _createElementBlock("small", _hoisted_27, " 用于总览与详情标题装饰；填写 Telegram custom_emoji_id。Bot 无权限或留空时自动使用普通表情。 "))
        : _createCommentVNode("", true),
      _createVNode(_component_VAlert, {
        type: "info",
        variant: "tonal",
        density: "compact",
        class: "mt-3"
      }, {
        default: _withCtx(() => [...(_cache[58] || (_cache[58] = [
          _createTextVNode(" 这里按 MoviePilot 的通知配置名称精确投递；即使有多个 Telegram，也只会发送到选中的实例。 请确保该实例已启用“插件”通知类型。 ", -1)
        ]))]),
        _: 1
      }),
      (unavailableNotificationServices.value.length)
        ? (_openBlock(), _createBlock(_component_VAlert, {
            key: 1,
            type: "warning",
            variant: "tonal",
            density: "compact",
            class: "mt-2"
          }, {
            default: _withCtx(() => [
              _createTextVNode(_toDisplayString(unavailableNotificationServices.value.map(item => item.title).join('、')) + " 尚未启用“插件”通知类型，因此暂不可选择。 ", 1)
            ]),
            _: 1
          }))
        : _createCommentVNode("", true),
      _createElementVNode("div", _hoisted_28, [
        _createVNode(_component_VSelect, {
          modelValue: selectedQuarter.value,
          "onUpdate:modelValue": [
            _cache[22] || (_cache[22] = $event => ((selectedQuarter).value = $event)),
            applyCandidateFilters
          ],
          items: quarterItems.value,
          label: "季度",
          density: "comfortable",
          variant: "outlined",
          "hide-details": ""
        }, null, 8, ["modelValue", "items"]),
        _createVNode(_component_VSelect, {
          modelValue: config.value.notification_candidate_region,
          "onUpdate:modelValue": [
            _cache[23] || (_cache[23] = $event => ((config.value.notification_candidate_region) = $event)),
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
        _createVNode(_component_VSelect, {
          modelValue: config.value.notification_candidate_preference,
          "onUpdate:modelValue": [
            _cache[24] || (_cache[24] = $event => ((config.value.notification_candidate_preference) = $event)),
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
        _createVNode(_component_VBtn, {
          variant: "tonal",
          "prepend-icon": "mdi-refresh",
          loading: candidateLoading.value,
          onClick: applyCandidateFilters
        }, {
          default: _withCtx(() => [...(_cache[59] || (_cache[59] = [
            _createTextVNode("刷新", -1)
          ]))]),
          _: 1
        }, 8, ["loading"]),
        _createVNode(_component_VBtn, {
          color: "primary",
          variant: "tonal",
          "prepend-icon": "mdi-send-clock",
          loading: actionLoading.value,
          onClick: sendCandidateBatch
        }, {
          default: _withCtx(() => [...(_cache[60] || (_cache[60] = [
            _createTextVNode("立即生成批次", -1)
          ]))]),
          _: 1
        }, 8, ["loading"])
      ]),
      _createElementVNode("div", _hoisted_29, [
        _createVNode(_component_VSwitch, {
          modelValue: config.value.notification_candidate_sequel_only,
          "onUpdate:modelValue": [
            _cache[25] || (_cache[25] = $event => ((config.value.notification_candidate_sequel_only) = $event)),
            applyCandidateFilters
          ],
          color: "primary",
          "hide-details": "",
          label: "仅续作或多季作品"
        }, null, 8, ["modelValue"]),
        _createVNode(_component_VSelect, {
          modelValue: config.value.notification_candidate_platforms,
          "onUpdate:modelValue": [
            _cache[26] || (_cache[26] = $event => ((config.value.notification_candidate_platforms) = $event)),
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
        ? (_openBlock(), _createElementBlock("div", _hoisted_30, [
            _createElementVNode("div", _hoisted_31, [
              _createVNode(_component_VCheckboxBtn, {
                "model-value": allReadySelected.value,
                "onUpdate:modelValue": setAllReady
              }, null, 8, ["model-value"]),
              _createElementVNode("span", null, [
                _cache[61] || (_cache[61] = _createElementVNode("strong", null, "匹配完成", -1)),
                _createElementVNode("small", null, _toDisplayString(readyCandidates.value.length) + " 部可直接加入维护规则", 1)
              ]),
              _createVNode(_component_VSpacer),
              _createElementVNode("div", _hoisted_32, [
                _createVNode(_component_VBtn, {
                  variant: "text",
                  color: "default",
                  disabled: !selectedReadyIds.value.length,
                  onClick: _cache[27] || (_cache[27] = $event => (candidateAction('ignore')))
                }, {
                  default: _withCtx(() => [...(_cache[62] || (_cache[62] = [
                    _createTextVNode("忽略所选", -1)
                  ]))]),
                  _: 1
                }, 8, ["disabled"]),
                _createVNode(_component_VBtn, {
                  variant: "tonal",
                  color: "primary",
                  loading: actionLoading.value,
                  disabled: !selectedReadyIds.value.length,
                  onClick: _cache[28] || (_cache[28] = $event => (candidateAction('add_default')))
                }, {
                  default: _withCtx(() => [...(_cache[63] || (_cache[63] = [
                    _createTextVNode("按 TMDB 默认加入", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading", "disabled"]),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  loading: actionLoading.value,
                  disabled: !selectedReadyIds.value.length,
                  onClick: _cache[29] || (_cache[29] = $event => (candidateAction('add_group')))
                }, {
                  default: _withCtx(() => [...(_cache[64] || (_cache[64] = [
                    _createTextVNode("优先剧集组加入", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ]),
            _createElementVNode("div", _hoisted_33, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(readyCandidates.value, (item) => {
                return (_openBlock(), _createElementBlock("label", {
                  key: item.id,
                  class: "candidate-item"
                }, [
                  _createVNode(_component_VCheckboxBtn, {
                    modelValue: selectedReadyIds.value,
                    "onUpdate:modelValue": _cache[30] || (_cache[30] = $event => ((selectedReadyIds).value = $event)),
                    value: item.id
                  }, null, 8, ["modelValue", "value"]),
                  (item.poster)
                    ? (_openBlock(), _createBlock(_component_VImg, {
                        key: 0,
                        src: item.poster,
                        width: "48",
                        height: "68",
                        cover: "",
                        class: "candidate-poster"
                      }, null, 8, ["src"]))
                    : (_openBlock(), _createElementBlock("div", _hoisted_34, [
                        _createVNode(_component_VIcon, {
                          icon: "mdi-image-off-outline",
                          size: "20"
                        })
                      ])),
                  _createElementVNode("div", _hoisted_35, [
                    _createElementVNode("strong", null, _toDisplayString(item.title), 1),
                    _createElementVNode("span", null, [
                      _createTextVNode("TMDB " + _toDisplayString(item.tmdb_id) + " · " + _toDisplayString(item.platform), 1),
                      (item.has_prequel)
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                            _createTextVNode(" · 续作")
                          ], 64))
                        : _createCommentVNode("", true)
                    ])
                  ]),
                  (item.score != null)
                    ? (_openBlock(), _createBlock(_component_VChip, {
                        key: 2,
                        size: "x-small",
                        color: "success",
                        variant: "tonal"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(item.score), 1)
                        ]),
                        _: 2
                      }, 1024))
                    : _createCommentVNode("", true)
                ]))
              }), 128))
            ])
          ]))
        : _createCommentVNode("", true),
      (failedCandidates.value.length)
        ? (_openBlock(), _createElementBlock("div", _hoisted_36, [
            _createElementVNode("div", _hoisted_37, [
              _createVNode(_component_VCheckboxBtn, {
                "model-value": allFailedSelected.value,
                "onUpdate:modelValue": setAllFailed
              }, null, 8, ["model-value"]),
              _createElementVNode("span", null, [
                _cache[65] || (_cache[65] = _createElementVNode("strong", null, "扫描失败", -1)),
                _createElementVNode("small", null, _toDisplayString(failedCandidates.value.length) + " 部可批量重试、忽略或逐部补录", 1)
              ]),
              _createVNode(_component_VSpacer),
              _createElementVNode("div", _hoisted_38, [
                _createVNode(_component_VBtn, {
                  variant: "text",
                  color: "default",
                  disabled: !selectedFailedIds.value.length,
                  onClick: _cache[31] || (_cache[31] = $event => (candidateAction('ignore', 'failed')))
                }, {
                  default: _withCtx(() => [...(_cache[66] || (_cache[66] = [
                    _createTextVNode("忽略所选", -1)
                  ]))]),
                  _: 1
                }, 8, ["disabled"]),
                _createVNode(_component_VBtn, {
                  color: "warning",
                  variant: "tonal",
                  "prepend-icon": "mdi-refresh",
                  loading: actionLoading.value,
                  disabled: !selectedFailedIds.value.length,
                  onClick: _cache[32] || (_cache[32] = $event => (candidateAction('retry', 'failed')))
                }, {
                  default: _withCtx(() => [...(_cache[67] || (_cache[67] = [
                    _createTextVNode("重新扫描", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ]),
            _createElementVNode("div", _hoisted_39, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(failedCandidates.value, (item) => {
                return (_openBlock(), _createElementBlock("div", {
                  key: item.id,
                  class: "candidate-item failed-candidate-item"
                }, [
                  _createVNode(_component_VCheckboxBtn, {
                    modelValue: selectedFailedIds.value,
                    "onUpdate:modelValue": _cache[33] || (_cache[33] = $event => ((selectedFailedIds).value = $event)),
                    value: item.id
                  }, null, 8, ["modelValue", "value"]),
                  (item.poster)
                    ? (_openBlock(), _createBlock(_component_VImg, {
                        key: 0,
                        src: item.poster,
                        width: "48",
                        height: "68",
                        cover: "",
                        class: "candidate-poster"
                      }, null, 8, ["src"]))
                    : (_openBlock(), _createElementBlock("div", _hoisted_40, [
                        _createVNode(_component_VIcon, {
                          icon: "mdi-image-off-outline",
                          size: "20"
                        })
                      ])),
                  _createElementVNode("div", _hoisted_41, [
                    _createElementVNode("strong", null, _toDisplayString(item.title), 1),
                    _createElementVNode("span", null, _toDisplayString(item.scan_error || '未匹配到可信 TMDB 条目'), 1)
                  ]),
                  _createVNode(_component_VBtn, {
                    color: "primary",
                    variant: "tonal",
                    "prepend-icon": "mdi-database-edit-outline",
                    loading: manualCandidateBusy.value === item.id,
                    onClick: $event => (openFailedCandidate(item))
                  }, {
                    default: _withCtx(() => [...(_cache[68] || (_cache[68] = [
                      _createTextVNode("补录 TMDB", -1)
                    ]))]),
                    _: 1
                  }, 8, ["loading", "onClick"])
                ]))
              }), 128))
            ])
          ]))
        : _createCommentVNode("", true),
      (!readyCandidates.value.length && !failedCandidates.value.length)
        ? (_openBlock(), _createElementBlock("div", _hoisted_42, [
            _createVNode(_component_VIcon, { icon: "mdi-check-decagram-outline" }),
            _createElementVNode("span", null, _toDisplayString(candidateLoading.value ? '正在读取季度缓存…' : '当前筛选没有待处理条目；请先在“集数偏移”中加载并扫描该季度看板。'), 1)
          ]))
        : _createCommentVNode("", true)
    ], 512), [
      [_vShow, activeWorkspace.value === 'candidates']
    ]),
    _createVNode(_component_VDialog, {
      modelValue: manualCandidateDialog.value,
      "onUpdate:modelValue": _cache[38] || (_cache[38] = $event => ((manualCandidateDialog).value = $event)),
      "max-width": "560"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCard, { class: "manual-candidate-dialog" }, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, null, {
              prepend: _withCtx(() => [
                _createVNode(_component_VAvatar, {
                  color: "primary",
                  variant: "tonal"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VIcon, { icon: "mdi-database-edit-outline" })
                  ]),
                  _: 1
                })
              ]),
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [...(_cache[69] || (_cache[69] = [
                    _createTextVNode("补录 TMDB", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(manualCandidateItem.value?.title), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardText, null, {
              default: _withCtx(() => [
                _createVNode(_component_VTextField, {
                  modelValue: manualCandidateTmdbId.value,
                  "onUpdate:modelValue": _cache[34] || (_cache[34] = $event => ((manualCandidateTmdbId).value = $event)),
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
            _createVNode(_component_VCardActions, { class: "manual-candidate-actions" }, {
              default: _withCtx(() => [
                _createVNode(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[35] || (_cache[35] = $event => (manualCandidateDialog.value = false))
                }, {
                  default: _withCtx(() => [...(_cache[70] || (_cache[70] = [
                    _createTextVNode("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  variant: "tonal",
                  "prepend-icon": "mdi-database-outline",
                  disabled: !Number(manualCandidateTmdbId.value || 0),
                  loading: manualCandidateBusy.value === manualCandidateItem.value?.id,
                  onClick: _cache[36] || (_cache[36] = $event => (addFailedCandidate('add_default')))
                }, {
                  default: _withCtx(() => [...(_cache[71] || (_cache[71] = [
                    _createTextVNode("按 TMDB 默认编集加入", -1)
                  ]))]),
                  _: 1
                }, 8, ["disabled", "loading"]),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  "prepend-icon": "mdi-animation-outline",
                  disabled: !Number(manualCandidateTmdbId.value || 0),
                  loading: manualCandidateBusy.value === manualCandidateItem.value?.id,
                  onClick: _cache[37] || (_cache[37] = $event => (addFailedCandidate('add_group')))
                }, {
                  default: _withCtx(() => [...(_cache[72] || (_cache[72] = [
                    _createTextVNode("优先剧集组加入", -1)
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
    _withDirectives(_createElementVNode("section", _hoisted_43, [
      _createElementVNode("button", {
        type: "button",
        class: "records-heading",
        onClick: _cache[39] || (_cache[39] = $event => (showRecords.value = !showRecords.value))
      }, [
        _createElementVNode("span", null, [
          _cache[73] || (_cache[73] = _createElementVNode("strong", null, "通知运行记录", -1)),
          _createElementVNode("small", null, " 共 " + _toDisplayString(data.value.record_counts?.total || 0) + " 条 · 渠道确认 " + _toDisplayString(data.value.record_counts?.delivered || 0) + " · 已提交 " + _toDisplayString(data.value.record_counts?.submitted || 0) + " · 静默 " + _toDisplayString(data.value.record_counts?.suppressed || 0) + " · 待摘要 " + _toDisplayString(data.value.record_counts?.digest || 0), 1)
        ]),
        _createVNode(_component_VIcon, {
          icon: showRecords.value ? 'mdi-chevron-up' : 'mdi-chevron-down'
        }, null, 8, ["icon"])
      ]),
      _createVNode(_component_VExpandTransition, null, {
        default: _withCtx(() => [
          (showRecords.value)
            ? (_openBlock(), _createElementBlock("div", _hoisted_44, [
                _createElementVNode("div", _hoisted_45, [
                  _createVNode(_component_VBtnToggle, {
                    modelValue: recordFilter.value,
                    "onUpdate:modelValue": _cache[40] || (_cache[40] = $event => ((recordFilter).value = $event)),
                    mandatory: "",
                    density: "compact",
                    color: "primary",
                    variant: "outlined"
                  }, {
                    default: _withCtx(() => [
                      _createVNode(_component_VBtn, { value: "all" }, {
                        default: _withCtx(() => [...(_cache[74] || (_cache[74] = [
                          _createTextVNode("全部", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode(_component_VBtn, { value: "success" }, {
                        default: _withCtx(() => [...(_cache[75] || (_cache[75] = [
                          _createTextVNode("入库成功", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode(_component_VBtn, { value: "failure" }, {
                        default: _withCtx(() => [...(_cache[76] || (_cache[76] = [
                          _createTextVNode("入库失败", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode(_component_VBtn, { value: "other" }, {
                        default: _withCtx(() => [...(_cache[77] || (_cache[77] = [
                          _createTextVNode("其它通知", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  _createVNode(_component_VSpacer),
                  _createVNode(_component_VBtn, {
                    variant: "text",
                    color: "error",
                    "prepend-icon": "mdi-delete-outline",
                    onClick: clearRecords
                  }, {
                    default: _withCtx(() => [...(_cache[78] || (_cache[78] = [
                      _createTextVNode("清空", -1)
                    ]))]),
                    _: 1
                  }),
                  (data.value.record_counts?.digest)
                    ? (_openBlock(), _createBlock(_component_VBtn, {
                        key: 0,
                        variant: "tonal",
                        color: "warning",
                        "prepend-icon": "mdi-text-box-check-outline",
                        onClick: sendDigest
                      }, {
                        default: _withCtx(() => [...(_cache[79] || (_cache[79] = [
                          _createTextVNode("发送待处理摘要", -1)
                        ]))]),
                        _: 1
                      }))
                    : _createCommentVNode("", true)
                ]),
                (records.value.length)
                  ? (_openBlock(), _createElementBlock("div", _hoisted_46, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(records.value, (item) => {
                        return (_openBlock(), _createElementBlock("article", {
                          key: item.id,
                          class: "record-item"
                        }, [
                          _createVNode(_component_VIcon, {
                            icon: item.action === 'delivery_failed' ? 'mdi-send-alert-outline' : item.scene === 'success' ? 'mdi-check-circle-outline' : item.action === 'suppressed' ? 'mdi-bell-off-outline' : 'mdi-alert-circle-outline',
                            color: item.action === 'delivery_failed' ? 'error' : item.scene === 'success' ? 'success' : item.action === 'suppressed' ? 'default' : 'warning'
                          }, null, 8, ["icon", "color"]),
                          _createElementVNode("div", null, [
                            _createElementVNode("strong", null, _toDisplayString(item.title), 1),
                            _createElementVNode("span", null, _toDisplayString(item.created_at) + " · " + _toDisplayString(item.category?.label || item.details?.notification_type_label || '入库成功') + " · " + _toDisplayString(recordActionText[item.action] || item.action), 1),
                            (item.action === 'delivery_failed')
                              ? (_openBlock(), _createElementBlock("small", _hoisted_47, _toDisplayString(item.details?.delivery_error || '目标通知实例未返回成功结果'), 1))
                              : _createCommentVNode("", true)
                          ]),
                          _createVNode(_component_VChip, {
                            size: "x-small",
                            variant: "tonal"
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(item.policy), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]))
                      }), 128))
                    ]))
                  : (_openBlock(), _createElementBlock("div", _hoisted_48, [
                      _createVNode(_component_VIcon, { icon: "mdi-history" }),
                      _cache[80] || (_cache[80] = _createElementVNode("span", null, "尚无符合条件的记录", -1))
                    ]))
              ]))
            : _createCommentVNode("", true)
        ]),
        _: 1
      })
    ], 512), [
      [_vShow, activeWorkspace.value === 'records']
    ])
  ]))
}
}

};
const NotificationEnhancer = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-c2816d08"]]);

export { NotificationEnhancer as default };
