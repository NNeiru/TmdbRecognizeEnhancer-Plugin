const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/StrategySettings-Dd_kPtDu.js","assets/__federation_fn_import-JrT3xvdd.js","assets/ModuleHeader-D43l2fc-.js","assets/_plugin-vue_export-helper-pcqpp-6-.js","assets/ModuleHeader-CJFJwYP4.css","assets/StrategySettings-tq7KzN-Y.css","assets/EpisodeNormalizer-Cj1vOmvr.js","assets/utils-Wv8mt00E.js","assets/EpisodeNormalizer-BJzGmUhq.css","assets/MetadataTools-UUBkkaoN.js","assets/MetadataTools-CzSryxFc.css","assets/PerformanceDiagnostics-B4fuVGgv.js","assets/PerformanceDiagnostics-BYwISp9j.css","assets/NotificationEnhancer-BzIk-M5j.js","assets/NotificationEnhancer-DcIMo7DJ.css"])))=>i.map(i=>d[i]);
import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { M as ModuleHeader } from './ModuleHeader-D43l2fc-.js';
import { c as cloneConfig, U as UI_VERSION, m as mediaTypeText, s as scoreColor, u as unwrapResponse, e as ensureUiVersion } from './utils-Wv8mt00E.js';
import { _ as _export_sfc } from './_plugin-vue_export-helper-pcqpp-6-.js';

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true && deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};

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

const {computed,defineAsyncComponent,onMounted,ref} = await importShared('vue');

// 工作台模块较多，全部静态导入会让插件入口在打开前一次性解析数百 KB
// 的页面代码。仅保留首页共用组件同步加载，其余模块切换到对应标签时再取。

const _sfc_main = {
  __name: 'AppPage',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'TmdbRecognizeEnhancer' },
  hideTitle: { type: Boolean, default: false },
},
  setup(__props, { expose: __expose }) {

const StrategySettings = defineAsyncComponent(() => __vitePreload(() => import('./StrategySettings-Dd_kPtDu.js'),true?__vite__mapDeps([0,1,2,3,4,5]):void 0));
const EpisodeNormalizer = defineAsyncComponent(() => __vitePreload(() => import('./EpisodeNormalizer-Cj1vOmvr.js'),true?__vite__mapDeps([6,1,7,2,3,4,8]):void 0));
const MetadataTools = defineAsyncComponent(() => __vitePreload(() => import('./MetadataTools-UUBkkaoN.js'),true?__vite__mapDeps([9,1,7,3,2,4,10]):void 0));
const PerformanceDiagnostics = defineAsyncComponent(() => __vitePreload(() => import('./PerformanceDiagnostics-B4fuVGgv.js'),true?__vite__mapDeps([11,1,7,2,3,4,12]):void 0));
const NotificationEnhancer = defineAsyncComponent(() => __vitePreload(() => import('./NotificationEnhancer-BzIk-M5j.js'),true?__vite__mapDeps([13,1,2,3,4,7,14]):void 0));

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
                    _createVNode(_unref(StrategySettings), {
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
                    _createVNode(_unref(MetadataTools), {
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
                    _createVNode(_unref(MetadataTools), {
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
                    _createVNode(_unref(MetadataTools), {
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
                    _createVNode(_unref(NotificationEnhancer), {
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
                    _createVNode(_unref(PerformanceDiagnostics), {
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
                    ? (_openBlock(), _createBlock(_unref(EpisodeNormalizer), {
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
const AppPage = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-44d59995"]]);

export { AppPage as default };
