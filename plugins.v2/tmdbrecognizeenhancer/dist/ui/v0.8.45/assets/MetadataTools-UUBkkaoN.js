import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { u as unwrapResponse } from './utils-Wv8mt00E.js';
import { _ as _export_sfc } from './_plugin-vue_export-helper-pcqpp-6-.js';
import { M as ModuleHeader } from './ModuleHeader-D43l2fc-.js';

const {resolveComponent:_resolveComponent$1,mergeProps:_mergeProps$1,createVNode:_createVNode$1,withCtx:_withCtx$1,openBlock:_openBlock$1,createBlock:_createBlock$1,createCommentVNode:_createCommentVNode$1,toDisplayString:_toDisplayString$1,createTextVNode:_createTextVNode$1,createElementVNode:_createElementVNode$1,Fragment:_Fragment$1,createElementBlock:_createElementBlock$1} = await importShared('vue');


const _hoisted_1$1 = { class: "file-tree-box" };
const _hoisted_2$1 = { class: "selected-path" };

const {computed: computed$1,onMounted: onMounted$1,ref: ref$1,watch: watch$1} = await importShared('vue');


const _sfc_main$1 = {
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

const dialog = ref$1(false);
const loading = ref$1(false);
const error = ref$1('');
const emptyNotice = ref$1('');
const storage = ref$1('local');
const storages = ref$1([{ title: '本地存储', value: 'local' }]);
const treeItems = ref$1([]);
const openedItems = ref$1([]);
const activatedItems = ref$1([]);
const mediaExtensions = new Set(['mkv', 'mp4', 'avi', 'mov', 'ts', 'm2ts', 'webm', 'flv', 'wmv', 'mpg', 'mpeg']);
let treeEpoch = 0;

const selectedItem = computed$1(() => activatedItems.value[0]?.raw || activatedItems.value[0] || null);
const selectedPath = computed$1(() => selectedItem.value?.type === 'file' ? selectedItem.value.path : '');

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

watch$1(storage, () => { if (dialog.value) resetTree(); });
onMounted$1(loadStorages);

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent$1("VBtn");
  const _component_VTooltip = _resolveComponent$1("VTooltip");
  const _component_VIcon = _resolveComponent$1("VIcon");
  const _component_VAvatar = _resolveComponent$1("VAvatar");
  const _component_VCardTitle = _resolveComponent$1("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$1("VCardSubtitle");
  const _component_VCardItem = _resolveComponent$1("VCardItem");
  const _component_VDivider = _resolveComponent$1("VDivider");
  const _component_VSelect = _resolveComponent$1("VSelect");
  const _component_VAlert = _resolveComponent$1("VAlert");
  const _component_VProgressLinear = _resolveComponent$1("VProgressLinear");
  const _component_VTreeview = _resolveComponent$1("VTreeview");
  const _component_VCardText = _resolveComponent$1("VCardText");
  const _component_VSpacer = _resolveComponent$1("VSpacer");
  const _component_VCardActions = _resolveComponent$1("VCardActions");
  const _component_VCard = _resolveComponent$1("VCard");
  const _component_VDialog = _resolveComponent$1("VDialog");

  return (_openBlock$1(), _createElementBlock$1(_Fragment$1, null, [
    (__props.compact)
      ? (_openBlock$1(), _createBlock$1(_component_VTooltip, {
          key: 0,
          text: __props.buttonLabel,
          location: "top"
        }, {
          activator: _withCtx$1(({ props: tip }) => [
            _createVNode$1(_component_VBtn, _mergeProps$1(tip, {
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
      : (_openBlock$1(), _createBlock$1(_component_VBtn, {
          key: 1,
          variant: "tonal",
          color: "secondary",
          "prepend-icon": "mdi-folder-search-outline",
          onClick: openPicker
        }, {
          default: _withCtx$1(() => [
            _createTextVNode$1(_toDisplayString$1(__props.buttonLabel), 1)
          ]),
          _: 1
        })),
    _createVNode$1(_component_VDialog, {
      modelValue: dialog.value,
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((dialog).value = $event)),
      "max-width": "760"
    }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCard, null, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardItem, null, {
              prepend: _withCtx$1(() => [
                _createVNode$1(_component_VAvatar, {
                  color: "secondary",
                  variant: "tonal"
                }, {
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VIcon, { icon: "mdi-file-tree-outline" })
                  ]),
                  _: 1
                })
              ]),
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardTitle, null, {
                  default: _withCtx$1(() => [...(_cache[5] || (_cache[5] = [
                    _createTextVNode$1("选择容器内媒体文件", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VCardSubtitle, null, {
                  default: _withCtx$1(() => [...(_cache[6] || (_cache[6] = [
                    _createTextVNode$1("使用 MoviePilot 的存储接口浏览；仅显示目录和常见视频文件。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$1(_component_VDivider),
            _createVNode$1(_component_VCardText, { class: "file-picker-body" }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VSelect, {
                  modelValue: storage.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((storage).value = $event)),
                  items: storages.value,
                  label: "MoviePilot 存储",
                  "hide-details": ""
                }, null, 8, ["modelValue", "items"]),
                (error.value)
                  ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
                      key: 0,
                      type: "error",
                      variant: "tonal",
                      density: "compact"
                    }, {
                      default: _withCtx$1(() => [
                        _createTextVNode$1(_toDisplayString$1(error.value), 1)
                      ]),
                      _: 1
                    }))
                  : (emptyNotice.value)
                    ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
                        key: 1,
                        type: "info",
                        variant: "tonal",
                        density: "compact"
                      }, {
                        default: _withCtx$1(() => [
                          _createTextVNode$1(_toDisplayString$1(emptyNotice.value), 1)
                        ]),
                        _: 1
                      }))
                    : _createCommentVNode$1("", true),
                (loading.value)
                  ? (_openBlock$1(), _createBlock$1(_component_VProgressLinear, {
                      key: 2,
                      indeterminate: "",
                      color: "secondary"
                    }))
                  : _createCommentVNode$1("", true),
                _createElementVNode$1("div", _hoisted_1$1, [
                  _createVNode$1(_component_VTreeview, {
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
                    prepend: _withCtx$1(({ item }) => [
                      _createVNode$1(_component_VIcon, {
                        icon: (item.raw?.type || item.type) === 'dir' ? 'mdi-folder-outline' : 'mdi-file-video-outline',
                        size: "18"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["activated", "opened", "items"])
                ]),
                _createElementVNode$1("div", _hoisted_2$1, [
                  _cache[7] || (_cache[7] = _createElementVNode$1("span", null, "已选择", -1)),
                  _createElementVNode$1("code", null, _toDisplayString$1(selectedPath.value || '请在目录树中选择一个媒体文件'), 1)
                ])
              ]),
              _: 1
            }),
            _createVNode$1(_component_VDivider),
            _createVNode$1(_component_VCardActions, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VSpacer),
                _createVNode$1(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[3] || (_cache[3] = $event => (dialog.value = false))
                }, {
                  default: _withCtx$1(() => [...(_cache[8] || (_cache[8] = [
                    _createTextVNode$1("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode$1(_component_VBtn, {
                  color: "primary",
                  disabled: !selectedPath.value,
                  onClick: chooseFile
                }, {
                  default: _withCtx$1(() => [...(_cache[9] || (_cache[9] = [
                    _createTextVNode$1("使用此文件", -1)
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
const MediaFilePicker = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-cf5745d2"]]);

const {toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,createVNode:_createVNode,createElementVNode:_createElementVNode,Fragment:_Fragment,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,createBlock:_createBlock,renderList:_renderList,mergeProps:_mergeProps,normalizeClass:_normalizeClass} = await importShared('vue');


const _hoisted_1 = { class: "module-status-chips" };
const _hoisted_2 = { key: 3 };
const _hoisted_3 = { class: "filter-row mb-3" };
const _hoisted_4 = { class: "rule-filter-actions" };
const _hoisted_5 = { class: "text-caption text-medium-emphasis mb-2" };
const _hoisted_6 = { class: "font-weight-medium" };
const _hoisted_7 = { class: "d-flex align-center ga-2" };
const _hoisted_8 = ["title"];
const _hoisted_9 = {
  key: 0,
  class: "text-caption text-medium-emphasis"
};
const _hoisted_10 = { class: "text-caption text-medium-emphasis" };
const _hoisted_11 = {
  key: 0,
  class: "text-caption text-medium-emphasis mt-1"
};
const _hoisted_12 = { key: 4 };
const _hoisted_13 = { class: "filter-row mb-3" };
const _hoisted_14 = { class: "font-weight-medium" };
const _hoisted_15 = { class: "rule-pattern" };
const _hoisted_16 = { key: 5 };
const _hoisted_17 = { class: "d-flex align-center flex-wrap ga-3 mb-4" };
const _hoisted_18 = {
  key: 1,
  class: "group-layout-grid"
};
const _hoisted_19 = { class: "group-layout-main" };
const _hoisted_20 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_21 = { class: "font-weight-bold" };
const _hoisted_22 = { class: "mapping-expression" };
const _hoisted_23 = { class: "text-caption text-medium-emphasis" };
const _hoisted_24 = { class: "d-flex" };
const _hoisted_25 = {
  key: 2,
  class: "empty-fields"
};
const _hoisted_26 = { class: "group-preview-form" };
const _hoisted_27 = { class: "text-caption mt-1" };
const _hoisted_28 = {
  key: 0,
  class: "member-trace mt-3"
};
const _hoisted_29 = { key: 0 };
const _hoisted_30 = { key: 6 };
const _hoisted_31 = {
  key: 0,
  class: "probe-workspace mb-4"
};
const _hoisted_32 = { class: "probe-selection-summary" };
const _hoisted_33 = { class: "probe-chip-policy" };
const _hoisted_34 = {
  key: 1,
  class: "probe-selection-empty"
};
const _hoisted_35 = { class: "probe-field-list" };
const _hoisted_36 = { class: "probe-field-main" };
const _hoisted_37 = { class: "font-weight-medium" };
const _hoisted_38 = { class: "text-caption text-medium-emphasis" };
const _hoisted_39 = { class: "probe-field-controls" };
const _hoisted_40 = { class: "subtitle-mapping-box" };
const _hoisted_41 = { class: "probe-advanced-grid" };
const _hoisted_42 = {
  key: 0,
  class: "mt-3"
};
const _hoisted_43 = { class: "font-weight-medium" };
const _hoisted_44 = { class: "subtitle-mapping-box iso-probe-box" };
const _hoisted_45 = {
  key: 0,
  class: "static-ffprobe-actions"
};
const _hoisted_46 = { class: "probe-card-actions" };
const _hoisted_47 = { class: "probe-path-row" };
const _hoisted_48 = { class: "probe-scan-bar" };
const _hoisted_49 = { class: "probe-result-header" };
const _hoisted_50 = { class: "probe-result-file" };
const _hoisted_51 = ["title"];
const _hoisted_52 = { class: "probe-stream-counts" };
const _hoisted_53 = {
  key: 0,
  class: "probe-summary-section"
};
const _hoisted_54 = { class: "probe-result-table" };
const _hoisted_55 = { class: "probe-variable-title" };
const _hoisted_56 = { class: "text-caption text-medium-emphasis" };
const _hoisted_57 = {
  key: 0,
  class: "probe-variable-list"
};
const _hoisted_58 = ["title"];
const _hoisted_59 = {
  key: 1,
  class: "probe-result-empty compact"
};
const _hoisted_60 = { class: "probe-missing-chips" };
const _hoisted_61 = {
  key: 2,
  class: "probe-result-empty"
};
const _hoisted_62 = { class: "probe-empty-icon" };
const _hoisted_63 = {
  key: 1,
  class: "strm-page mb-4"
};
const _hoisted_64 = { class: "strm-control-row" };
const _hoisted_65 = { class: "strm-counters" };
const _hoisted_66 = { class: "strm-config-grid" };
const _hoisted_67 = { class: "strm-config-section" };
const _hoisted_68 = { class: "strm-section-head" };
const _hoisted_69 = { class: "strm-timing-grid" };
const _hoisted_70 = { class: "strm-config-section" };
const _hoisted_71 = { class: "strm-section-head" };
const _hoisted_72 = {
  key: 0,
  class: "strm-mapping-list"
};
const _hoisted_73 = { class: "strm-mapping-meta" };
const _hoisted_74 = { class: "strm-path-pair" };
const _hoisted_75 = {
  key: 1,
  class: "strm-empty compact"
};
const _hoisted_76 = { class: "strm-save-row" };
const _hoisted_77 = { class: "strm-preview-workbench" };
const _hoisted_78 = { class: "strm-preview-files" };
const _hoisted_79 = { class: "strm-preview-path-card" };
const _hoisted_80 = { class: "strm-preview-path-heading" };
const _hoisted_81 = { class: "strm-preview-path" };
const _hoisted_82 = { class: "strm-preview-arrow" };
const _hoisted_83 = { class: "strm-preview-path-card" };
const _hoisted_84 = { class: "strm-preview-path-heading" };
const _hoisted_85 = { class: "strm-preview-path" };
const _hoisted_86 = { class: "strm-preview-actions" };
const _hoisted_87 = { key: 0 };
const _hoisted_88 = { key: 0 };
const _hoisted_89 = { class: "strm-job-toolbar" };
const _hoisted_90 = { class: "strm-job-summary" };
const _hoisted_91 = { class: "strm-job-actions" };
const _hoisted_92 = {
  key: 0,
  class: "strm-job-section"
};
const _hoisted_93 = { class: "strm-job-section-title" };
const _hoisted_94 = { class: "strm-job-list" };
const _hoisted_95 = ["onClick"];
const _hoisted_96 = { class: "strm-job-row-actions" };
const _hoisted_97 = {
  key: 0,
  class: "strm-job-detail"
};
const _hoisted_98 = {
  key: 0,
  class: "strm-server-results"
};
const _hoisted_99 = { key: 0 };
const _hoisted_100 = { class: "strm-completed-title" };
const _hoisted_101 = { class: "strm-job-list strm-completed-list" };
const _hoisted_102 = ["onClick"];
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

const {computed,onMounted,onUnmounted,ref,watch} = await importShared('vue');

const pageSize = 30;

const _sfc_main = {
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
const headerInfo = computed(() => {
  if (props.mode === 'naming') return { icon: 'mdi-rename-box-outline', title: '命名规则', subtitle: '统一管理连接符、制作组、自定义字段和最终文本映射，并按实际执行顺序排列。', color: 'orange' }
  if (props.mode === 'probe') return { icon: 'mdi-waveform', title: '媒体信息识别', subtitle: '整理前读取真实媒体流，补齐技术参数并输出可用于命名的 Jinja2 变量。', color: 'purple' }
  return { icon: 'mdi-code-braces-box', title: '字段与制作组', subtitle: '查看 MP 当前版本实际加载的识别规则，并为制作组提供候选类型证据。', color: 'primary' }
});
const loading = ref(false);
const saving = ref('');
const error = ref('');
const data = ref({ release_groups: { items: [] }, recognition_rules: { items: [], fields: [], overrides: [] }, rename_fields: { builtin: [], context: [], custom: [] }, rename_mappings: { items: [], stages: [] }, release_group_arrangements: { items: [], positions: [], connectors: [] }, media_probe: { field_options: [] }, capabilities: {} });
const section = ref(props.mode === 'naming' ? 'mapping' : props.mode === 'probe' ? 'probe' : 'rules');
const search = ref('');
const field = ref('all');
const source = ref('all');
const page = ref(1);
const groupKind = ref('all');
const groupProfileDialog = ref(false);
const groupProfileForm = ref({ id: '', display_name: '', kind: 'unknown', field_policy: 'fill_empty', field_values: {}, custom_field_values: {} });
const probePath = ref('');
const probeSection = ref('scan');
const probeResult = ref(null);
const probeForce = ref(true);
const probeCacheNotice = ref('');
const strmSync = ref({
  available: false, enabled: false, active: false, worker_running: false, worker_error: '',
  servers: [], jobs: [], counts: { pending: 0, completed: 0, attention: 0 },
  config: { enabled: false, servers: [], initial_delay_seconds: 20, retry_seconds: 30, max_wait_minutes: 30, path_mappings: [] },
});
const strmTargetPath = ref('');
const strmPreview = ref(null);
const openStrmJobDetails = ref([]);
const dialog = ref(false);
const form = ref({ id: '', source_rule_id: '', field: 'videoBit', pattern: '', value: '{match}', action: 'override', enabled: true, priority: 100, label: '' });
const bulkPriorityDialog = ref(false);
const bulkPriority = ref(100);
const previewTitle = ref('[Group] Example.S01E01.1080p.WEB-DL.H265.10bit.AAC.mkv');
const preview = ref(null);
const renameDialog = ref(false);
const renameForm = ref({ original_key: '', key: '', label: '', expression: '', fallback: '', enabled: true });
const renamePreviewing = ref(false);
const renamePreview = ref(null);
const renameFieldSearch = ref('');
const openRenameFieldGroups = ref(['媒体信息', '文件解析', '源文件上下文']);
const copiedVariable = ref('');
const fieldDetailDialog = ref(false);
const fieldDetail = ref(null);
const fieldPresetLimit = ref(80);
const mappingDialog = ref(false);
const mappingForm = ref({ id: '', label: '', stage: 'final_result', mode: 'literal', pattern: '', replacement: '', enabled: true, priority: 100 });
const mappingPreviewInput = ref({ value: 'AB/C.chi.zh-cn.ass' });
const mappingPreview = ref(null);
const renameRuleSection = ref('defaults');
const groupArrangementDialog = ref(false);
const groupArrangementForm = ref({ id: '', label: '', match_name: '', aliases: '', output_name: '', position: 'keep', connector: '__default__', order: 100, enabled: true });
const groupArrangementPreviewInput = ref('ADWeb@A@VCB');
const groupArrangementPreview = ref(null);
const renamePreviewInput = ref({
  original_name: '[Group] Example.S01E01.1080p.WEB-DL.mkv',
  type: '电视剧', category: '动漫',
  source_path: '/downloads/anime/Example.S01E01.mkv',
  target_dir: '/media/TV/动漫',
});

const pluginBase = computed(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`);
const config = computed({ get: () => props.modelValue || {}, set: value => emit('update:modelValue', value) });
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
const fieldItems = computed(() => [{ title: '全部识别字段', value: 'all' }, ...(data.value.recognition_rules?.fields || []).map(item => ({ title: `${item.label} (${item.count})`, value: item.key }))]);
const rules = computed(() => {
  const query = search.value.trim().toLowerCase();
  return (data.value.recognition_rules?.items || []).filter(item => {
    if (field.value !== 'all' && item.field !== field.value) return false
    if (source.value !== 'all' && item.source !== source.value) return false
    return !query || [item.field, item.field_label, item.label, item.pattern, item.value].some(value => String(value || '').toLowerCase().includes(query))
  })
});
const pageCount = computed(() => Math.max(1, Math.ceil(rules.value.length / pageSize)));
const pagedRules = computed(() => rules.value.slice((page.value - 1) * pageSize, page.value * pageSize));
const groups = computed(() => {
  const query = search.value.trim().toLowerCase();
  return (data.value.release_groups?.items || []).filter(item => {
    if (groupKind.value !== 'all' && item.kind !== groupKind.value) return false
    return !query || [item.display_name, item.pattern, item.category].some(value => String(value || '').toLowerCase().includes(query))
  })
});
const groupPageCount = computed(() => Math.max(1, Math.ceil(groups.value.length / pageSize)));
const pagedGroups = computed(() => groups.value.slice((page.value - 1) * pageSize, page.value * pageSize));
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
const selectedProbeFieldItems = computed(() => mediaProbeFieldItems.filter(item => probeFieldSelected(item.key)));
const mediaProbeBackendSupported = computed(() => Object.prototype.hasOwnProperty.call(data.value || {}, 'media_probe') && Array.isArray(data.value.media_probe?.field_options));
const strmServerItems = computed(() => (strmSync.value.servers || []).map(item => ({
  title: `${item.name}${item.connected ? '' : '（未连接）'}`,
  value: item.name,
  props: { disabled: !item.connected },
})));
const strmStatusText = computed(() => {
  if (!strmSync.value.available) return '当前 MoviePilot 不支持媒体服务器服务目录'
  if (!config.value.enabled) return '等待启用插件总开关'
  if (!strmSync.value.config?.enabled) return '已停用'
  if (!config.value.media_probe_enabled) return '等待启用整理前媒体流扫描'
  if (!strmSync.value.servers?.length) return '未配置 Emby'
  if (strmSync.value.worker_running) return '正在监听整理入库'
  return strmSync.value.worker_error ? '后台工作器异常' : '后台工作器正在恢复'
});
const activeStrmJobs = computed(() => (
  (strmSync.value.jobs || []).filter(job => job.status !== 'completed')
));
const completedStrmJobs = computed(() => (
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
const mappingRules = computed(() => data.value.rename_mappings?.items || []);
const mappingStages = computed(() => data.value.rename_mappings?.stages || [
  { value: 'final_result', label: '最终命名结果' },
  { value: 'release_group', label: '旧版制作组映射' },
]);
const mappingStageLabel = value => mappingStages.value.find(item => item.value === value)?.label || value;
const groupArrangementRules = computed(() => data.value.release_group_arrangements?.items || []);
const groupPositionItems = computed(() => data.value.release_group_arrangements?.positions || [
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
const groupConnectorItems = computed(() => [
  { title: `继承标题，否则默认（${config.value.release_group_default_connector === ' ' ? '空格' : config.value.release_group_default_connector || '@'}）`, value: data.value.release_group_arrangements?.default_connector_value || '__default__' },
  ...(data.value.release_group_arrangements?.connectors || ['@', '&', '+', '-', '_', '.', ' ']).map(value => ({ title: value === ' ' ? '空格' : value, value })),
]);
const separatorFieldKeys = new Set(['title', 'en_title', 'original_title', 'name', 'en_name', 'original_name', 'resourceType', 'effect', 'edition', 'videoFormat', 'resource_term', 'releaseGroup', 'videoCodec', 'videoBit', 'audioCodec', 'fps', 'webSource', 'customization']);
const separatorFieldItems = computed(() => (data.value.rename_fields?.builtin || [])
  .filter(item => separatorFieldKeys.has(item.key))
  .map(item => ({ title: `${item.label}（${item.key}）`, value: item.key })));
const customFields = computed(() => data.value.rename_fields?.custom || []);
const probeContextFieldItems = computed(() => (data.value.rename_fields?.context || [])
  .filter(item => String(item.key || '').startsWith('probe_')));
const probeStandardPreviewItems = computed(() => Object.entries(probeResult.value?.fields || {}).map(([key, value]) => ({
  key,
  value,
  label: mediaProbeFieldItems.find(item => item.target === key)?.label || key,
})));
const probeContextPreviewItems = computed(() => probeContextFieldItems.value.map(item => ({
  ...item,
  value: probeResult.value?.context?.[item.key],
})));
const probeValuePresent = value => value !== '' && value !== null && value !== undefined;
const probeDetectedContextItems = computed(() => probeContextPreviewItems.value.filter(item => probeValuePresent(item.value)));
const probeMissingContextItems = computed(() => probeContextPreviewItems.value.filter(item => !probeValuePresent(item.value)));
const probeFileName = computed(() => String(probePath.value || '').split(/[\\/]/).pop() || '尚未选择文件');
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
const availableRenameFields = computed(() => [
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
const renameFieldGroups = computed(() => {
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

const staticFfprobe = computed(() => data.value.media_probe?.static_ffprobe || {});
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
const fieldDetailPresetRules = computed(() => fieldPresetRules(fieldDetail.value));
const visibleFieldPresetRules = computed(() => fieldDetailPresetRules.value.slice(0, fieldPresetLimit.value));

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

onMounted(load);
onUnmounted(() => { if (staticFfprobePoll) window.clearTimeout(staticFfprobePoll); });

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VChip = _resolveComponent("VChip");
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VTab = _resolveComponent("VTab");
  const _component_VTabs = _resolveComponent("VTabs");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VSelect = _resolveComponent("VSelect");
  const _component_VTable = _resolveComponent("VTable");
  const _component_VPagination = _resolveComponent("VPagination");
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent("VCardSubtitle");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VBadge = _resolveComponent("VBadge");
  const _component_VAvatar = _resolveComponent("VAvatar");
  const _component_VExpansionPanelTitle = _resolveComponent("VExpansionPanelTitle");
  const _component_VCheckboxBtn = _resolveComponent("VCheckboxBtn");
  const _component_VExpansionPanelText = _resolveComponent("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent("VExpansionPanel");
  const _component_VTextarea = _resolveComponent("VTextarea");
  const _component_VExpansionPanels = _resolveComponent("VExpansionPanels");
  const _component_VTooltip = _resolveComponent("VTooltip");
  const _component_VExpandTransition = _resolveComponent("VExpandTransition");
  const _component_VCombobox = _resolveComponent("VCombobox");
  const _component_VDivider = _resolveComponent("VDivider");
  const _component_VSpacer = _resolveComponent("VSpacer");
  const _component_VCardActions = _resolveComponent("VCardActions");
  const _component_VCol = _resolveComponent("VCol");
  const _component_VRow = _resolveComponent("VRow");
  const _component_VDialog = _resolveComponent("VDialog");

  return (_openBlock(), _createElementBlock("div", null, [
    _createVNode(ModuleHeader, {
      icon: headerInfo.value.icon,
      title: headerInfo.value.title,
      subtitle: headerInfo.value.subtitle,
      color: headerInfo.value.color
    }, {
      actions: _withCtx(() => [
        _createVNode(_component_VBtn, {
          variant: "text",
          "prepend-icon": "mdi-refresh",
          loading: loading.value,
          onClick: load
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(props.mode === 'probe' ? '刷新状态' : '重新读取 MP 规则'), 1)
          ]),
          _: 1
        }, 8, ["loading"]),
        _createVNode(_component_VBtn, {
          color: "primary",
          "prepend-icon": "mdi-content-save",
          loading: __props.savingConfig,
          onClick: _cache[0] || (_cache[0] = $event => (emit('save-config')))
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(props.mode === 'probe' ? '保存设置' : '保存模块开关'), 1)
          ]),
          _: 1
        }, 8, ["loading"])
      ]),
      controls: _withCtx(() => [
        (props.mode === 'probe')
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              _createVNode(_component_VSwitch, {
                modelValue: config.value.media_probe_enabled,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((config.value.media_probe_enabled) = $event)),
                color: "purple",
                label: "整理前自动扫描",
                "hide-details": ""
              }, null, 8, ["modelValue"]),
              _createElementVNode("div", _hoisted_1, [
                _createVNode(_component_VChip, {
                  size: "small",
                  color: data.value.media_probe?.available ? 'success' : 'warning',
                  variant: "tonal",
                  "prepend-icon": data.value.media_probe?.available ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'
                }, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(data.value.media_probe?.available ? 'ffprobe 可用' : 'ffprobe 待检查'), 1)
                  ]),
                  _: 1
                }, 8, ["color", "prepend-icon"]),
                _createVNode(_component_VChip, {
                  size: "small",
                  color: "purple",
                  variant: "tonal"
                }, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(selectedProbeFieldItems.value.length) + " 个输出项", 1)
                  ]),
                  _: 1
                }),
                _createVNode(_component_VChip, {
                  size: "small",
                  variant: "tonal"
                }, {
                  default: _withCtx(() => [
                    _createTextVNode("缓存 " + _toDisplayString(data.value.media_probe?.cache_entries || 0), 1)
                  ]),
                  _: 1
                })
              ])
            ], 64))
          : (props.mode === 'naming')
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.custom_rename_fields_enabled,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config.value.custom_rename_fields_enabled) = $event)),
                  color: "secondary",
                  label: "启用自定义命名字段",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.rename_mapping_enabled,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.value.rename_mapping_enabled) = $event)),
                  color: "orange",
                  label: "启用最终文本映射",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ], 64))
            : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.recognition_rule_overrides_enabled,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.recognition_rule_overrides_enabled) = $event)),
                  color: "primary",
                  label: "启用识别字段覆盖",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.release_group_assist_enabled,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config.value.release_group_assist_enabled) = $event)),
                  color: "success",
                  label: "制作组辅助 TMDB 判断",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VSwitch, {
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
      ? (_openBlock(), _createBlock(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          closable: "",
          class: "mb-4",
          "onClick:close": _cache[7] || (_cache[7] = $event => (error.value = ''))
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    _createVNode(_component_VAlert, {
      type: "info",
      variant: "tonal",
      density: "compact",
      class: "mb-4"
    }, {
      default: _withCtx(() => [
        _createTextVNode(_toDisplayString(props.mode === 'naming' ? '实际顺序：连接与分隔、制作组编排（在「字段与制作组」页维护）和自定义字段参与 MoviePilot 模板渲染；文本映射最后处理完整相对路径与字幕后缀。' : props.mode === 'probe' ? 'ffprobe 每次完整读取媒体流；下方选项只控制向 MP/Jinja 命名上下文输出哪些字段，不会裁剪神医联动数据。' : '这里展示当前 MP 实际加载的识别预设；插件覆盖不会修改 MP 或 Rust 文件。'), 1)
      ]),
      _: 1
    }),
    (data.value.recognition_rules?.errors?.length)
      ? (_openBlock(), _createBlock(_component_VAlert, {
          key: 1,
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: _withCtx(() => [
            _createTextVNode(" 部分规则读取失败：" + _toDisplayString(data.value.recognition_rules.errors.join('；')), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    (props.mode === 'metadata')
      ? (_openBlock(), _createBlock(_component_VTabs, {
          key: 2,
          modelValue: section.value,
          "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((section).value = $event)),
          color: "primary",
          class: "mb-4"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VTab, {
              value: "rules",
              "prepend-icon": "mdi-text-box-search-outline"
            }, {
              default: _withCtx(() => [...(_cache[105] || (_cache[105] = [
                _createTextVNode("内置识别字段", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VTab, {
              value: "groups",
              "prepend-icon": "mdi-account-group-outline"
            }, {
              default: _withCtx(() => [...(_cache[106] || (_cache[106] = [
                _createTextVNode("制作组类型与字段", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VTab, {
              value: "arrange",
              "prepend-icon": "mdi-account-multiple-check-outline"
            }, {
              default: _withCtx(() => [...(_cache[107] || (_cache[107] = [
                _createTextVNode("制作组编排", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VTab, {
              value: "test",
              "prepend-icon": "mdi-flask-outline"
            }, {
              default: _withCtx(() => [...(_cache[108] || (_cache[108] = [
                _createTextVNode("覆盖试算", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]))
      : _createCommentVNode("", true),
    (props.mode !== 'naming' && section.value === 'rules')
      ? (_openBlock(), _createElementBlock("section", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _createVNode(_component_VTextField, {
              modelValue: search.value,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((search).value = $event)),
              label: "搜索字段、名称或正则",
              "prepend-inner-icon": "mdi-magnify",
              clearable: "",
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createVNode(_component_VSelect, {
              modelValue: field.value,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((field).value = $event)),
              label: "识别字段",
              items: fieldItems.value,
              "hide-details": ""
            }, null, 8, ["modelValue", "items"]),
            _createVNode(_component_VSelect, {
              modelValue: source.value,
              "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((source).value = $event)),
              label: "规则来源",
              items: sourceItems,
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createElementVNode("div", _hoisted_4, [
              _createVNode(_component_VBtn, {
                variant: "tonal",
                "prepend-icon": "mdi-format-list-numbered",
                disabled: !rules.value.length,
                onClick: openBulkPriority
              }, {
                default: _withCtx(() => [...(_cache[109] || (_cache[109] = [
                  _createTextVNode("批量优先级", -1)
                ]))]),
                _: 1
              }, 8, ["disabled"]),
              _createVNode(_component_VBtn, {
                color: "primary",
                "prepend-icon": "mdi-plus",
                onClick: openNewRule
              }, {
                default: _withCtx(() => [...(_cache[110] || (_cache[110] = [
                  _createTextVNode("新增覆盖", -1)
                ]))]),
                _: 1
              })
            ])
          ]),
          _createElementVNode("div", _hoisted_5, "当前 MP 共读取 " + _toDisplayString(data.value.recognition_rules?.count || 0) + " 条，已覆盖 " + _toDisplayString(data.value.recognition_rules?.override_count || 0) + " 条；筛选结果 " + _toDisplayString(rules.value.length) + " 条。", 1),
          _createVNode(_component_VTable, {
            density: "comfortable",
            class: "tools-table"
          }, {
            default: _withCtx(() => [
              _cache[113] || (_cache[113] = _createElementVNode("thead", null, [
                _createElementVNode("tr", null, [
                  _createElementVNode("th", { style: {"width":"150px"} }, "字段"),
                  _createElementVNode("th", null, "MP 内置匹配内容"),
                  _createElementVNode("th", { style: {"width":"190px"} }, "来源"),
                  _createElementVNode("th", { style: {"width":"150px"} }, "操作")
                ])
              ], -1)),
              _createElementVNode("tbody", null, [
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(pagedRules.value, (item) => {
                  return (_openBlock(), _createElementBlock("tr", {
                    key: item.id
                  }, [
                    _createElementVNode("td", null, [
                      _createElementVNode("div", _hoisted_6, _toDisplayString(item.field_label), 1),
                      _createElementVNode("code", null, _toDisplayString(item.field), 1)
                    ]),
                    _createElementVNode("td", null, [
                      _createElementVNode("div", _hoisted_7, [
                        _createElementVNode("span", null, _toDisplayString(item.effective?.label || item.label), 1),
                        (item.overridden)
                          ? (_openBlock(), _createBlock(_component_VChip, {
                              key: 0,
                              size: "x-small",
                              color: "warning",
                              variant: "tonal"
                            }, {
                              default: _withCtx(() => [...(_cache[111] || (_cache[111] = [
                                _createTextVNode("插件已覆盖", -1)
                              ]))]),
                              _: 1
                            }))
                          : _createCommentVNode("", true)
                      ]),
                      _createElementVNode("div", {
                        class: "rule-pattern",
                        title: item.effective?.pattern || item.pattern
                      }, _toDisplayString(item.effective?.pattern || item.pattern), 9, _hoisted_8),
                      (item.overridden && item.builtin && item.effective?.pattern !== item.pattern)
                        ? (_openBlock(), _createElementBlock("div", _hoisted_9, "MP 原正则：" + _toDisplayString(item.pattern), 1))
                        : _createCommentVNode("", true),
                      _createElementVNode("div", _hoisted_10, _toDisplayString(item.effective?.action === 'clear' ? '命中后清空字段' : `输出：${item.effective?.value ?? item.value}`), 1)
                    ]),
                    _createElementVNode("td", null, [
                      _createVNode(_component_VChip, {
                        size: "small",
                        variant: "tonal"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(item.source_label), 1)
                        ]),
                        _: 2
                      }, 1024),
                      (item.overridden)
                        ? (_openBlock(), _createElementBlock("div", _hoisted_11, "插件优先级 " + _toDisplayString(item.effective?.priority ?? 100), 1))
                        : _createCommentVNode("", true)
                    ]),
                    _createElementVNode("td", null, [
                      _createVNode(_component_VBtn, {
                        size: "small",
                        variant: "tonal",
                        "prepend-icon": "mdi-pencil-outline",
                        onClick: $event => (openRule(item))
                      }, {
                        default: _withCtx(() => [...(_cache[112] || (_cache[112] = [
                          _createTextVNode("编辑", -1)
                        ]))]),
                        _: 1
                      }, 8, ["onClick"]),
                      (item.overridden)
                        ? (_openBlock(), _createBlock(_component_VBtn, {
                            key: 0,
                            size: "small",
                            variant: "text",
                            color: "warning",
                            loading: saving.value === `reset:${item.id}`,
                            onClick: $event => (resetRule(item))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(item.builtin ? '恢复' : '删除'), 1)
                            ]),
                            _: 2
                          }, 1032, ["loading", "onClick"]))
                        : _createCommentVNode("", true)
                    ])
                  ]))
                }), 128))
              ])
            ]),
            _: 1
          }),
          (pageCount.value > 1)
            ? (_openBlock(), _createBlock(_component_VPagination, {
                key: 0,
                modelValue: page.value,
                "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((page).value = $event)),
                length: pageCount.value,
                "total-visible": 7,
                class: "mt-3"
              }, null, 8, ["modelValue", "length"]))
            : _createCommentVNode("", true)
        ]))
      : (section.value === 'groups')
        ? (_openBlock(), _createElementBlock("section", _hoisted_12, [
            _createElementVNode("div", _hoisted_13, [
              _createVNode(_component_VTextField, {
                modelValue: search.value,
                "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((search).value = $event)),
                label: "搜索制作组或正则",
                "prepend-inner-icon": "mdi-magnify",
                clearable: "",
                "hide-details": ""
              }, null, 8, ["modelValue"]),
              _createVNode(_component_VSelect, {
                modelValue: groupKind.value,
                "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((groupKind).value = $event)),
                label: "参与判断的类型",
                items: [{title:'全部类型',value:'all'}, ...kindItems],
                "hide-details": ""
              }, null, 8, ["modelValue", "items"])
            ]),
            _createVNode(_component_VTable, {
              density: "comfortable",
              class: "tools-table"
            }, {
              default: _withCtx(() => [
                _cache[114] || (_cache[114] = _createElementVNode("thead", null, [
                  _createElementVNode("tr", null, [
                    _createElementVNode("th", null, "制作组规则"),
                    _createElementVNode("th", null, "来源"),
                    _createElementVNode("th", { style: {"width":"230px"} }, "类型"),
                    _createElementVNode("th", { style: {"width":"150px"} }, "补充字段")
                  ])
                ], -1)),
                _createElementVNode("tbody", null, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(pagedGroups.value, (item) => {
                    return (_openBlock(), _createElementBlock("tr", {
                      key: item.id
                    }, [
                      _createElementVNode("td", null, [
                        _createElementVNode("div", _hoisted_14, _toDisplayString(item.display_name), 1),
                        _createElementVNode("div", _hoisted_15, _toDisplayString(item.pattern), 1)
                      ]),
                      _createElementVNode("td", null, [
                        _createVNode(_component_VChip, {
                          size: "small",
                          variant: "tonal"
                        }, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(item.source_label) + " · " + _toDisplayString(item.category), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _createElementVNode("td", null, [
                        _createVNode(_component_VSelect, {
                          "model-value": item.kind,
                          items: kindItems,
                          density: "compact",
                          "hide-details": "",
                          loading: saving.value === item.id,
                          "onUpdate:modelValue": value => saveGroup(item, value)
                        }, {
                          selection: _withCtx(() => [
                            _createVNode(_component_VChip, {
                              size: "small",
                              color: kindColor(item.kind),
                              variant: "tonal"
                            }, {
                              default: _withCtx(() => [
                                _createTextVNode(_toDisplayString(kindLabel(item.kind)), 1)
                              ]),
                              _: 2
                            }, 1032, ["color"])
                          ]),
                          _: 2
                        }, 1032, ["model-value", "loading", "onUpdate:modelValue"])
                      ]),
                      _createElementVNode("td", null, [
                        _createVNode(_component_VBtn, {
                          size: "small",
                          variant: "tonal",
                          "prepend-icon": "mdi-tune-variant",
                          onClick: $event => (openGroupProfile(item))
                        }, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(Object.keys(item.field_values || {}).length + Object.keys(item.custom_field_values || {}).length ? `${Object.keys(item.field_values || {}).length + Object.keys(item.custom_field_values || {}).length} 项` : '设置'), 1)
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
              ? (_openBlock(), _createBlock(_component_VPagination, {
                  key: 0,
                  modelValue: page.value,
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((page).value = $event)),
                  length: groupPageCount.value,
                  "total-visible": 7,
                  class: "mt-3"
                }, null, 8, ["modelValue", "length"]))
              : _createCommentVNode("", true)
          ]))
        : (props.mode === 'metadata' && section.value === 'arrange')
          ? (_openBlock(), _createElementBlock("section", _hoisted_16, [
              _createElementVNode("div", _hoisted_17, [
                _createVNode(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact",
                  class: "flex-grow-1 mb-0"
                }, {
                  default: _withCtx(() => [...(_cache[115] || (_cache[115] = [
                    _createTextVNode("为每个制作组指定别名、最终名称、固定位置和它前面的连接符；未配置的组保持原名与相对顺序。属于「命名规则」模块，随其总开关生效；连接符默认值在命名规则 → 连接与分隔中设置。", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  "prepend-icon": "mdi-plus",
                  onClick: _cache[16] || (_cache[16] = $event => (openGroupArrangement()))
                }, {
                  default: _withCtx(() => [...(_cache[116] || (_cache[116] = [
                    _createTextVNode("新增制作组规则", -1)
                  ]))]),
                  _: 1
                })
              ]),
              (data.value.release_group_arrangements?.errors?.length)
                ? (_openBlock(), _createBlock(_component_VAlert, {
                    key: 0,
                    type: "warning",
                    variant: "tonal",
                    density: "compact",
                    class: "mb-4"
                  }, {
                    default: _withCtx(() => [
                      _createTextVNode(_toDisplayString(data.value.release_group_arrangements.errors.join('；')), 1)
                    ]),
                    _: 1
                  }))
                : _createCommentVNode("", true),
              (groupArrangementRules.value.length)
                ? (_openBlock(), _createElementBlock("div", _hoisted_18, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(groupArrangementRules.value, (item) => {
                      return (_openBlock(), _createBlock(_component_VCard, {
                        key: item.id,
                        variant: "outlined",
                        class: "mapping-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardText, { class: "group-layout-card" }, {
                            default: _withCtx(() => [
                              _createElementVNode("div", _hoisted_19, [
                                _createElementVNode("div", _hoisted_20, [
                                  _createElementVNode("span", _hoisted_21, _toDisplayString(item.label || item.output_name), 1),
                                  _createVNode(_component_VChip, {
                                    size: "x-small",
                                    color: "primary",
                                    variant: "tonal"
                                  }, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(groupPositionLabel(item.position)), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  (!item.enabled)
                                    ? (_openBlock(), _createBlock(_component_VChip, {
                                        key: 0,
                                        size: "x-small",
                                        variant: "tonal"
                                      }, {
                                        default: _withCtx(() => [...(_cache[117] || (_cache[117] = [
                                          _createTextVNode("已停用", -1)
                                        ]))]),
                                        _: 1
                                      }))
                                    : _createCommentVNode("", true)
                                ]),
                                _createElementVNode("div", _hoisted_22, [
                                  _createElementVNode("code", null, _toDisplayString(item.match_name), 1),
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-arrow-right",
                                    size: "16"
                                  }),
                                  _createElementVNode("code", null, _toDisplayString(item.output_name), 1)
                                ]),
                                _createElementVNode("div", _hoisted_23, [
                                  _createTextVNode("别名 " + _toDisplayString(item.aliases?.length ? item.aliases.join('、') : '无') + " · 前置连接符 ", 1),
                                  _createElementVNode("code", null, _toDisplayString(item.connector === '__default__' ? `继承标题／默认（${config.value.release_group_default_connector === ' ' ? '空格' : config.value.release_group_default_connector || '@'}）` : item.connector === ' ' ? '空格' : item.connector || '无'), 1),
                                  _createTextVNode(" · 排序值 " + _toDisplayString(item.order), 1)
                                ])
                              ]),
                              _createElementVNode("div", _hoisted_24, [
                                _createVNode(_component_VBtn, {
                                  icon: "mdi-pencil-outline",
                                  size: "small",
                                  variant: "text",
                                  onClick: $event => (openGroupArrangement(item))
                                }, null, 8, ["onClick"]),
                                _createVNode(_component_VBtn, {
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
                : (_openBlock(), _createElementBlock("div", _hoisted_25, [
                    _createVNode(_component_VIcon, {
                      icon: "mdi-account-switch-outline",
                      size: "48"
                    }),
                    _cache[118] || (_cache[118] = _createElementVNode("div", { class: "mt-2" }, "尚未设置制作组编排", -1)),
                    _cache[119] || (_cache[119] = _createElementVNode("div", { class: "text-caption mt-1" }, "例如让 VCB-Studio 固定最后并使用 &，让 ADWeb 固定最后并使用 @", -1))
                  ])),
              _createVNode(_component_VCard, {
                variant: "outlined",
                class: "mt-4"
              }, {
                default: _withCtx(() => [
                  _createVNode(_component_VCardItem, null, {
                    default: _withCtx(() => [
                      _createVNode(_component_VCardTitle, null, {
                        default: _withCtx(() => [...(_cache[120] || (_cache[120] = [
                          _createTextVNode("制作组编排试算", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode(_component_VCardSubtitle, null, {
                        default: _withCtx(() => [...(_cache[121] || (_cache[121] = [
                          _createTextVNode("按 MP 的 releaseGroup 字段格式输入，支持 @、&、+ 形式。", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  _createVNode(_component_VCardText, null, {
                    default: _withCtx(() => [
                      _createElementVNode("div", _hoisted_26, [
                        _createVNode(_component_VTextField, {
                          modelValue: groupArrangementPreviewInput.value,
                          "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((groupArrangementPreviewInput).value = $event)),
                          label: "输入制作组",
                          placeholder: "ADWeb@A@VCB",
                          "hide-details": ""
                        }, null, 8, ["modelValue"]),
                        _createVNode(_component_VBtn, {
                          color: "secondary",
                          "prepend-icon": "mdi-play",
                          loading: saving.value === 'group-arrangement-preview',
                          onClick: previewGroupArrangement
                        }, {
                          default: _withCtx(() => [...(_cache[122] || (_cache[122] = [
                            _createTextVNode("开始试算", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      (groupArrangementPreview.value)
                        ? (_openBlock(), _createBlock(_component_VAlert, {
                            key: 0,
                            type: groupArrangementPreview.value.trace?.applied ? 'success' : 'info',
                            variant: "tonal",
                            class: "mt-4"
                          }, {
                            default: _withCtx(() => [
                              _createElementVNode("div", null, [
                                _cache[123] || (_cache[123] = _createTextVNode("输出：", -1)),
                                _createElementVNode("code", null, _toDisplayString(groupArrangementPreview.value.output), 1)
                              ]),
                              _createElementVNode("div", _hoisted_27, _toDisplayString(groupArrangementPreview.value.trace?.reason), 1),
                              (groupArrangementPreview.value.trace?.members?.length)
                                ? (_openBlock(), _createElementBlock("div", _hoisted_28, [
                                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(groupArrangementPreview.value.trace.members, (member, index) => {
                                      return (_openBlock(), _createBlock(_component_VChip, {
                                        key: `${member.output}-${index}`,
                                        size: "small",
                                        variant: "tonal"
                                      }, {
                                        default: _withCtx(() => [
                                          index
                                            ? (_openBlock(), _createElementBlock("span", _hoisted_29, _toDisplayString(member.connector === ' ' ? '空格' : member.connector), 1))
                                            : _createCommentVNode("", true),
                                          _createTextVNode(_toDisplayString(member.output) + " · " + _toDisplayString(groupPositionLabel(member.position)), 1)
                                        ]),
                                        _: 2
                                      }, 1024))
                                    }), 128))
                                  ]))
                                : _createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["type"]))
                        : _createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]))
          : (props.mode === 'probe' && section.value === 'probe')
            ? (_openBlock(), _createElementBlock("section", _hoisted_30, [
                _createVNode(_component_VTabs, {
                  modelValue: probeSection.value,
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((probeSection).value = $event)),
                  color: "primary",
                  class: "sub-tabs mb-4"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VTab, {
                      value: "scan",
                      "prepend-icon": "mdi-waveform"
                    }, {
                      default: _withCtx(() => [...(_cache[124] || (_cache[124] = [
                        _createTextVNode("媒体扫描", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode(_component_VTab, {
                      value: "strm",
                      "prepend-icon": "mdi-server-network"
                    }, {
                      default: _withCtx(() => [
                        _cache[126] || (_cache[126] = _createTextVNode(" 神医联动 ", -1)),
                        _createVNode(_component_VChip, {
                          size: "x-small",
                          color: "primary",
                          variant: "tonal",
                          class: "ms-2"
                        }, {
                          default: _withCtx(() => [...(_cache[125] || (_cache[125] = [
                            _createTextVNode("Pro", -1)
                          ]))]),
                          _: 1
                        }),
                        (Number(strmSync.value.counts?.pending || 0))
                          ? (_openBlock(), _createBlock(_component_VBadge, {
                              key: 0,
                              content: strmSync.value.counts.pending,
                              color: "warning",
                              inline: "",
                              class: "ms-2"
                            }, null, 8, ["content"]))
                          : _createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                (probeSection.value === 'scan')
                  ? (_openBlock(), _createElementBlock("div", _hoisted_31, [
                      _createVNode(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card probe-strategy-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "primary",
                                variant: "tonal",
                                size: "38"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-tune-vertical",
                                    size: "21"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            append: _withCtx(() => [
                              _createVNode(_component_VChip, {
                                size: "small",
                                color: "primary",
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(selectedProbeFieldItems.value.length) + " / " + _toDisplayString(mediaProbeFieldItems.length), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx(() => [...(_cache[127] || (_cache[127] = [
                                  _createTextVNode("字段输出策略", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [...(_cache[128] || (_cache[128] = [
                                  _createTextVNode("ffprobe 始终完整扫描；这里只决定哪些结果参与命名以及如何写回 MP 字段。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, { class: "probe-config-body" }, {
                            default: _withCtx(() => [
                              (!mediaProbeBackendSupported.value)
                                ? (_openBlock(), _createBlock(_component_VAlert, {
                                    key: 0,
                                    type: "error",
                                    variant: "tonal",
                                    density: "compact"
                                  }, {
                                    append: _withCtx(() => [
                                      _createVNode(_component_VBtn, {
                                        size: "small",
                                        color: "error",
                                        variant: "flat",
                                        "prepend-icon": "mdi-restart",
                                        loading: saving.value === 'plugin-reload',
                                        onClick: reloadPlugin
                                      }, {
                                        default: _withCtx(() => [...(_cache[129] || (_cache[129] = [
                                          _createTextVNode("重载插件后端", -1)
                                        ]))]),
                                        _: 1
                                      }, 8, ["loading"])
                                    ]),
                                    default: _withCtx(() => [
                                      _cache[130] || (_cache[130] = _createTextVNode(" 新版页面已加载，但插件后端仍是旧实例，因此字段目录显示为空且能力会被误报为 unavailable。 ", -1))
                                    ]),
                                    _: 1
                                  }))
                                : (!data.value.media_probe?.available)
                                  ? (_openBlock(), _createBlock(_component_VAlert, {
                                      key: 1,
                                      type: "warning",
                                      variant: "tonal",
                                      density: "compact"
                                    }, {
                                      default: _withCtx(() => [
                                        _createTextVNode(_toDisplayString(data.value.media_probe?.message), 1)
                                      ]),
                                      _: 1
                                    }))
                                  : _createCommentVNode("", true),
                              _createElementVNode("div", _hoisted_32, [
                                (selectedProbeFieldItems.value.length)
                                  ? (_openBlock(true), _createElementBlock(_Fragment, { key: 0 }, _renderList(selectedProbeFieldItems.value, (item) => {
                                      return (_openBlock(), _createBlock(_component_VChip, {
                                        key: item.key,
                                        size: "small",
                                        color: "secondary",
                                        variant: "tonal"
                                      }, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(item.label), 1),
                                          _createElementVNode("span", _hoisted_33, _toDisplayString(fieldPolicyItems.find(policy => policy.value === probeFieldPolicy(item.key))?.title), 1)
                                        ]),
                                        _: 2
                                      }, 1024))
                                    }), 128))
                                  : (_openBlock(), _createElementBlock("div", _hoisted_34, [
                                      _createVNode(_component_VIcon, {
                                        icon: "mdi-selection-off",
                                        size: "18"
                                      }),
                                      _cache[131] || (_cache[131] = _createTextVNode(" 未选择命名输出项；神医联动仍会使用完整扫描结果", -1))
                                    ]))
                              ]),
                              _createVNode(_component_VExpansionPanels, {
                                variant: "accordion",
                                multiple: "",
                                class: "probe-panels"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VExpansionPanel, null, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VExpansionPanelTitle, null, {
                                        default: _withCtx(() => [...(_cache[132] || (_cache[132] = [
                                          _createElementVNode("div", null, [
                                            _createElementVNode("div", { class: "font-weight-medium" }, "命名字段输出"),
                                            _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "选择写入 MP/Jinja 上下文的字段，并设置补空、覆盖或追加")
                                          ], -1)
                                        ]))]),
                                        _: 1
                                      }),
                                      _createVNode(_component_VExpansionPanelText, null, {
                                        default: _withCtx(() => [
                                          _createElementVNode("div", _hoisted_35, [
                                            (_openBlock(), _createElementBlock(_Fragment, null, _renderList(mediaProbeFieldItems, (item) => {
                                              return _createElementVNode("div", {
                                                key: item.key,
                                                class: "probe-field-row"
                                              }, [
                                                _createElementVNode("div", _hoisted_36, [
                                                  _createElementVNode("div", _hoisted_37, [
                                                    _createTextVNode(_toDisplayString(item.label) + " ", 1),
                                                    _createElementVNode("code", null, _toDisplayString(item.target), 1)
                                                  ]),
                                                  _createElementVNode("div", _hoisted_38, _toDisplayString(item.detail), 1)
                                                ]),
                                                _createElementVNode("div", _hoisted_39, [
                                                  _createVNode(_component_VSelect, {
                                                    "model-value": probeFieldPolicy(item.key),
                                                    items: fieldPolicyItems,
                                                    density: "compact",
                                                    "hide-details": "",
                                                    class: "probe-policy-select",
                                                    disabled: !probeFieldSelected(item.key),
                                                    "onUpdate:modelValue": value => setProbeFieldPolicy(item.key, value)
                                                  }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"]),
                                                  _createVNode(_component_VCheckboxBtn, {
                                                    "model-value": probeFieldSelected(item.key),
                                                    color: "primary",
                                                    "onUpdate:modelValue": value => toggleProbeField(item.key, value)
                                                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                                                ])
                                              ])
                                            }), 64))
                                          ]),
                                          _createVNode(_component_VAlert, {
                                            type: "info",
                                            variant: "tonal",
                                            density: "compact",
                                            class: "mt-3"
                                          }, {
                                            default: _withCtx(() => [...(_cache[133] || (_cache[133] = [
                                              _createTextVNode("追加模式保留原标题/MP 已识别值并去重添加扫描值，例如 ", -1),
                                              _createElementVNode("code", null, "HDR10 + DOVI → HDR10 DOVI", -1),
                                              _createTextVNode("；字幕映射按自定义占位符连接符追加。", -1)
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
                                    ? (_openBlock(), _createBlock(_component_VExpansionPanel, { key: 0 }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VExpansionPanelTitle, null, {
                                            default: _withCtx(() => [...(_cache[134] || (_cache[134] = [
                                              _createElementVNode("div", null, [
                                                _createElementVNode("div", { class: "font-weight-medium" }, "字幕语言映射"),
                                                _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "把内封字幕轨组合映射为 customization 或 Jinja 扫描变量")
                                              ], -1)
                                            ]))]),
                                            _: 1
                                          }),
                                          _createVNode(_component_VExpansionPanelText, null, {
                                            default: _withCtx(() => [
                                              _createElementVNode("div", _hoisted_40, [
                                                _createVNode(_component_VSwitch, {
                                                  modelValue: config.value.media_probe_subtitle_to_customization,
                                                  "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((config.value.media_probe_subtitle_to_customization) = $event)),
                                                  color: "secondary",
                                                  label: "将字幕映射结果写入 customization",
                                                  "hide-details": ""
                                                }, null, 8, ["modelValue"]),
                                                _createVNode(_component_VTextarea, {
                                                  modelValue: config.value.media_probe_subtitle_rules,
                                                  "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((config.value.media_probe_subtitle_rules) = $event)),
                                                  label: "字幕组合映射（每行一条，首条命中生效；未命中自动回退为语言组合）",
                                                  rows: "4",
                                                  "auto-grow": "",
                                                  placeholder: "中文 => 中字内封",
                                                  hint: "未命中规则时自动生成语言组合（简繁日内封等），只需为想改名的组合写规则。「简体+繁体+日语」与「简日+繁日」写法可互相命中；「包含:简体+日语 => 简日内封」为子集匹配；「>=4 => 多国字幕」按语言数量。",
                                                  "persistent-hint": ""
                                                }, null, 8, ["modelValue"]),
                                                _cache[135] || (_cache[135] = _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "可扫描 MKV/MP4 中独立存在的内封字幕流；烧录进画面的硬字幕没有字幕轨，ffprobe 无法判断语言。", -1))
                                              ])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }))
                                    : _createCommentVNode("", true),
                                  _createVNode(_component_VExpansionPanel, null, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VExpansionPanelTitle, null, {
                                        default: _withCtx(() => [...(_cache[136] || (_cache[136] = [
                                          _createElementVNode("div", null, [
                                            _createElementVNode("div", { class: "font-weight-medium" }, "高级设置与 ffprobe"),
                                            _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "超时、自定义程序路径和安装诊断")
                                          ], -1)
                                        ]))]),
                                        _: 1
                                      }),
                                      _createVNode(_component_VExpansionPanelText, null, {
                                        default: _withCtx(() => [
                                          _createElementVNode("div", _hoisted_41, [
                                            _createVNode(_component_VTextField, {
                                              modelValue: config.value.media_probe_timeout,
                                              "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((config.value.media_probe_timeout) = $event)),
                                              modelModifiers: { number: true },
                                              type: "number",
                                              min: "3",
                                              max: "30",
                                              label: "单文件超时（秒）",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue"]),
                                            _createVNode(_component_VTextField, {
                                              modelValue: config.value.media_probe_executable,
                                              "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((config.value.media_probe_executable) = $event)),
                                              label: "自定义 ffprobe 路径（通常留空）",
                                              placeholder: "/usr/local/bin/ffprobe",
                                              clearable: "",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue"])
                                          ]),
                                          (mediaProbeBackendSupported.value && !data.value.media_probe?.available)
                                            ? (_openBlock(), _createElementBlock("div", _hoisted_42, [
                                                _cache[138] || (_cache[138] = _createElementVNode("div", { class: "text-body-2 mb-2" }, [
                                                  _createTextVNode("MoviePilot 当前官方 Dockerfile 已包含 "),
                                                  _createElementVNode("code", null, "/usr/local/bin/ffprobe"),
                                                  _createTextVNode("。不可用通常表示旧镜像或自定义镜像遗漏。")
                                                ], -1)),
                                                _cache[139] || (_cache[139] = _createElementVNode("ol", { class: "ffprobe-help" }, [
                                                  _createElementVNode("li", null, "拉取当前 MoviePilot 镜像并重新创建容器。"),
                                                  _createElementVNode("li", null, "自定义镜像可继承官方镜像，或持久挂载 ffprobe。"),
                                                  _createElementVNode("li", null, [
                                                    _createTextVNode("容器内执行 "),
                                                    _createElementVNode("code", null, "ffprobe -version"),
                                                    _createTextVNode(" 验证。")
                                                  ])
                                                ], -1)),
                                                _createVNode(_component_VAlert, {
                                                  type: "warning",
                                                  variant: "tonal",
                                                  density: "compact",
                                                  class: "mt-3"
                                                }, {
                                                  default: _withCtx(() => [...(_cache[137] || (_cache[137] = [
                                                    _createTextVNode("常规扫描不会自动下载可执行文件；只有下方「ISO 原盘探测」显式开启后才会下载专用静态 ffprobe。", -1)
                                                  ]))]),
                                                  _: 1
                                                })
                                              ]))
                                            : _createCommentVNode("", true)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  _createVNode(_component_VExpansionPanel, null, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VExpansionPanelTitle, null, {
                                        default: _withCtx(() => [
                                          _createElementVNode("div", null, [
                                            _createElementVNode("div", _hoisted_43, [
                                              _cache[140] || (_cache[140] = _createTextVNode("ISO 原盘探测 ", -1)),
                                              _createVNode(_component_VChip, {
                                                size: "x-small",
                                                color: staticFfprobe.value.installed ? 'success' : config.value.media_probe_iso_enabled ? 'warning' : 'default',
                                                variant: "tonal",
                                                class: "ms-1"
                                              }, {
                                                default: _withCtx(() => [
                                                  _createTextVNode(_toDisplayString(staticFfprobe.value.installed ? '已就绪' : staticFfprobe.value.installing ? '下载中' : config.value.media_probe_iso_enabled ? '未就绪' : '未启用'), 1)
                                                ]),
                                                _: 1
                                              }, 8, ["color"])
                                            ]),
                                            _cache[141] || (_cache[141] = _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "自动下载带蓝光支持的静态 ffprobe，仅接管 .iso 文件的媒体流提取", -1))
                                          ])
                                        ]),
                                        _: 1
                                      }),
                                      _createVNode(_component_VExpansionPanelText, null, {
                                        default: _withCtx(() => [
                                          _createElementVNode("div", _hoisted_44, [
                                            _createVNode(_component_VSwitch, {
                                              modelValue: config.value.media_probe_iso_enabled,
                                              "onUpdate:modelValue": [
                                                _cache[23] || (_cache[23] = $event => ((config.value.media_probe_iso_enabled) = $event)),
                                                _cache[24] || (_cache[24] = value => value && installStaticFfprobe(true))
                                              ],
                                              color: "secondary",
                                              label: "启用 ISO 原盘探测（保存设置后自动下载安装）",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue"]),
                                            _createVNode(_component_VAlert, {
                                              type: "info",
                                              variant: "tonal",
                                              density: "compact",
                                              class: "probe-help-alert"
                                            }, {
                                              default: _withCtx(() => [
                                                _cache[142] || (_cache[142] = _createTextVNode("容器自带的 ffprobe 没有 libbluray，读不出 ISO 原盘的播放列表。开启后插件从 ", -1)),
                                                _cache[143] || (_cache[143] = _createElementVNode("a", {
                                                  href: "https://github.com/sjtuross/StrmAssistant.Releases/tree/main/static-ffprobe",
                                                  target: "_blank",
                                                  rel: "noopener"
                                                }, "StrmAssistant.Releases", -1)),
                                                _createTextVNode(" 下载对应平台的静态构建（v" + _toDisplayString(staticFfprobe.value.version || '8.1.2') + "）到插件数据目录，", 1),
                                                _cache[144] || (_cache[144] = _createElementVNode("strong", null, "只用于 .iso 文件", -1)),
                                                _cache[145] || (_cache[145] = _createTextVNode("，普通视频仍走原 ffprobe；卸载插件删除数据目录即可清除。下载走 MP 的 GITHUB_PROXY 与代理设置。", -1))
                                              ]),
                                              _: 1
                                            }),
                                            (config.value.media_probe_iso_enabled)
                                              ? (_openBlock(), _createElementBlock("div", _hoisted_45, [
                                                  _createVNode(_component_VChip, {
                                                    size: "small",
                                                    color: staticFfprobe.value.installed ? 'success' : staticFfprobe.value.installing ? 'info' : 'warning',
                                                    variant: "tonal",
                                                    "prepend-icon": staticFfprobe.value.installed ? 'mdi-check-circle-outline' : staticFfprobe.value.installing ? 'mdi-progress-download' : 'mdi-alert-circle-outline',
                                                    class: "static-ffprobe-chip"
                                                  }, {
                                                    default: _withCtx(() => [
                                                      _createTextVNode(_toDisplayString(staticFfprobe.value.installed ? `已安装：${staticFfprobe.value.path}` : staticFfprobe.value.installing ? '正在后台下载安装……' : staticFfprobe.value.last_error || '尚未安装'), 1)
                                                    ]),
                                                    _: 1
                                                  }, 8, ["color", "prepend-icon"]),
                                                  (!staticFfprobe.value.installed)
                                                    ? (_openBlock(), _createBlock(_component_VBtn, {
                                                        key: 0,
                                                        size: "small",
                                                        variant: "tonal",
                                                        "prepend-icon": "mdi-download",
                                                        loading: saving.value === 'static-ffprobe' || staticFfprobe.value.installing,
                                                        onClick: _cache[25] || (_cache[25] = $event => (installStaticFfprobe(false)))
                                                      }, {
                                                        default: _withCtx(() => [
                                                          _createTextVNode(_toDisplayString(staticFfprobe.value.last_error ? '重试下载' : '立即下载'), 1)
                                                        ]),
                                                        _: 1
                                                      }, 8, ["loading"]))
                                                    : _createCommentVNode("", true)
                                                ]))
                                              : _createCommentVNode("", true)
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
                              _createElementVNode("div", _hoisted_46, [
                                _cache[147] || (_cache[147] = _createElementVNode("span", { class: "text-caption text-medium-emphasis" }, "设置只影响新进入整理流程的文件", -1)),
                                _createVNode(_component_VBtn, {
                                  color: "primary",
                                  variant: "tonal",
                                  "prepend-icon": "mdi-content-save",
                                  loading: __props.savingConfig,
                                  onClick: _cache[26] || (_cache[26] = $event => (emit('save-config')))
                                }, {
                                  default: _withCtx(() => [...(_cache[146] || (_cache[146] = [
                                    _createTextVNode("保存策略", -1)
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
                      _createVNode(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card probe-trial-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "secondary",
                                variant: "tonal",
                                size: "38"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-file-search-outline",
                                    size: "21"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx(() => [...(_cache[148] || (_cache[148] = [
                                  _createTextVNode("文件试扫", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [...(_cache[149] || (_cache[149] = [
                                  _createTextVNode("读取 MP 容器内的真实文件，只分析媒体流，不修改文件。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, { class: "probe-config-body" }, {
                            default: _withCtx(() => [
                              _createElementVNode("div", _hoisted_47, [
                                _createVNode(_component_VTextField, {
                                  modelValue: probePath.value,
                                  "onUpdate:modelValue": _cache[27] || (_cache[27] = $event => ((probePath).value = $event)),
                                  label: "容器内文件路径",
                                  placeholder: "/downloads/anime/Example.mkv",
                                  "prepend-inner-icon": "mdi-file-video-outline",
                                  "hide-details": ""
                                }, null, 8, ["modelValue"]),
                                _createVNode(MediaFilePicker, {
                                  modelValue: probePath.value,
                                  "onUpdate:modelValue": _cache[28] || (_cache[28] = $event => ((probePath).value = $event)),
                                  api: props.api
                                }, null, 8, ["modelValue", "api"])
                              ]),
                              _createElementVNode("div", _hoisted_48, [
                                _createVNode(_component_VBtn, {
                                  color: "secondary",
                                  "prepend-icon": "mdi-waveform",
                                  loading: saving.value === 'media-probe',
                                  disabled: !probePath.value,
                                  onClick: previewMediaProbe
                                }, {
                                  default: _withCtx(() => [...(_cache[150] || (_cache[150] = [
                                    _createTextVNode("开始扫描", -1)
                                  ]))]),
                                  _: 1
                                }, 8, ["loading", "disabled"]),
                                _createVNode(_component_VSwitch, {
                                  modelValue: probeForce.value,
                                  "onUpdate:modelValue": _cache[29] || (_cache[29] = $event => ((probeForce).value = $event)),
                                  label: "忽略缓存",
                                  density: "compact",
                                  color: "secondary",
                                  "hide-details": "",
                                  class: "probe-force-switch"
                                }, null, 8, ["modelValue"]),
                                _createVNode(_component_VTooltip, {
                                  text: "清空 ffprobe 扫描结果缓存；下次整理或试扫会重新读取文件",
                                  location: "top"
                                }, {
                                  activator: _withCtx(({ props: tip }) => [
                                    _createVNode(_component_VBtn, _mergeProps(tip, {
                                      variant: "text",
                                      size: "small",
                                      "prepend-icon": "mdi-broom",
                                      loading: saving.value === 'probe-cache',
                                      onClick: clearProbeCache
                                    }), {
                                      default: _withCtx(() => [
                                        _createTextVNode("清除缓存" + _toDisplayString(data.value.media_probe?.cache_entries ? `（${data.value.media_probe.cache_entries}）` : ''), 1)
                                      ]),
                                      _: 1
                                    }, 16, ["loading"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              (probeCacheNotice.value)
                                ? (_openBlock(), _createBlock(_component_VAlert, {
                                    key: 0,
                                    type: "success",
                                    variant: "tonal",
                                    density: "compact",
                                    closable: "",
                                    "onClick:close": _cache[30] || (_cache[30] = $event => (probeCacheNotice.value = ''))
                                  }, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(probeCacheNotice.value), 1)
                                    ]),
                                    _: 1
                                  }))
                                : _createCommentVNode("", true),
                              (probeResult.value)
                                ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                                    _createElementVNode("div", _hoisted_49, [
                                      _createElementVNode("div", _hoisted_50, [
                                        _createVNode(_component_VIcon, {
                                          icon: "mdi-file-video-outline",
                                          color: "secondary"
                                        }),
                                        _createElementVNode("div", null, [
                                          _cache[151] || (_cache[151] = _createElementVNode("span", null, "扫描完成", -1)),
                                          _createElementVNode("strong", { title: probePath.value }, _toDisplayString(probeFileName.value), 9, _hoisted_51)
                                        ])
                                      ]),
                                      _createElementVNode("div", _hoisted_52, [
                                        _createElementVNode("span", null, [
                                          _createVNode(_component_VIcon, {
                                            icon: "mdi-video-outline",
                                            size: "16"
                                          }),
                                          _createTextVNode(" " + _toDisplayString(probeResult.value.streams?.video || 0) + " 视频", 1)
                                        ]),
                                        _createElementVNode("span", null, [
                                          _createVNode(_component_VIcon, {
                                            icon: "mdi-volume-high",
                                            size: "16"
                                          }),
                                          _createTextVNode(" " + _toDisplayString(probeResult.value.streams?.audio || 0) + " 音频", 1)
                                        ]),
                                        _createElementVNode("span", null, [
                                          _createVNode(_component_VIcon, {
                                            icon: "mdi-subtitles-outline",
                                            size: "16"
                                          }),
                                          _createTextVNode(" " + _toDisplayString(probeResult.value.streams?.subtitle || 0) + " 字幕", 1)
                                        ]),
                                        (probeResult.value.cached)
                                          ? (_openBlock(), _createBlock(_component_VChip, {
                                              key: 0,
                                              size: "x-small",
                                              variant: "tonal"
                                            }, {
                                              default: _withCtx(() => [...(_cache[152] || (_cache[152] = [
                                                _createTextVNode("缓存", -1)
                                              ]))]),
                                              _: 1
                                            }))
                                          : _createCommentVNode("", true)
                                      ])
                                    ]),
                                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(probeResult.value.diagnostics || [], (item) => {
                                      return (_openBlock(), _createBlock(_component_VAlert, {
                                        key: item.code,
                                        type: item.level === 'warning' ? 'warning' : 'info',
                                        variant: "tonal",
                                        density: "compact"
                                      }, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(item.message), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["type"]))
                                    }), 128)),
                                    (probeStandardPreviewItems.value.length)
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_53, [
                                          _cache[153] || (_cache[153] = _createElementVNode("div", { class: "probe-section-heading" }, [
                                            _createElementVNode("div", null, [
                                              _createElementVNode("span", null, "写入字段预览"),
                                              _createElementVNode("small", null, "根据当前策略准备写入 MoviePilot 的值")
                                            ])
                                          ], -1)),
                                          _createElementVNode("div", _hoisted_54, [
                                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(probeStandardPreviewItems.value, (item) => {
                                              return (_openBlock(), _createElementBlock("div", {
                                                key: item.key,
                                                class: "probe-result-row"
                                              }, [
                                                _createElementVNode("div", {
                                                  class: _normalizeClass(["probe-summary-icon", `text-${probeSummaryPresentation(item.key).color}`])
                                                }, [
                                                  _createVNode(_component_VIcon, {
                                                    icon: probeSummaryPresentation(item.key).icon,
                                                    size: "19"
                                                  }, null, 8, ["icon"])
                                                ], 2),
                                                _createElementVNode("div", null, [
                                                  _createElementVNode("span", null, _toDisplayString(item.label), 1),
                                                  _createElementVNode("strong", null, _toDisplayString(probeValuePresent(item.value) ? item.value : '未读取'), 1)
                                                ])
                                              ]))
                                            }), 128))
                                          ])
                                        ]))
                                      : _createCommentVNode("", true),
                                    _createVNode(_component_VExpansionPanels, {
                                      variant: "accordion",
                                      class: "probe-variable-panel"
                                    }, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_VExpansionPanel, null, {
                                          default: _withCtx(() => [
                                            _createVNode(_component_VExpansionPanelTitle, null, {
                                              default: _withCtx(() => [
                                                _createElementVNode("div", _hoisted_55, [
                                                  _createElementVNode("div", null, [
                                                    _cache[154] || (_cache[154] = _createElementVNode("div", { class: "font-weight-medium" }, "Jinja2 扫描变量", -1)),
                                                    _createElementVNode("div", _hoisted_56, _toDisplayString(probeDetectedContextItems.value.length) + " 个有值，可直接用于命名模板", 1)
                                                  ]),
                                                  _createVNode(_component_VChip, {
                                                    size: "x-small",
                                                    color: "secondary",
                                                    variant: "tonal"
                                                  }, {
                                                    default: _withCtx(() => [...(_cache[155] || (_cache[155] = [
                                                      _createTextVNode("probe_*", -1)
                                                    ]))]),
                                                    _: 1
                                                  })
                                                ])
                                              ]),
                                              _: 1
                                            }),
                                            _createVNode(_component_VExpansionPanelText, null, {
                                              default: _withCtx(() => [
                                                (probeDetectedContextItems.value.length)
                                                  ? (_openBlock(), _createElementBlock("div", _hoisted_57, [
                                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(probeDetectedContextItems.value, (item) => {
                                                        return (_openBlock(), _createElementBlock("div", {
                                                          key: item.key,
                                                          class: "probe-variable-row",
                                                          title: item.description || item.label
                                                        }, [
                                                          _createElementVNode("div", null, [
                                                            _createElementVNode("span", null, _toDisplayString(item.label), 1),
                                                            _createElementVNode("code", null, _toDisplayString(item.key), 1)
                                                          ]),
                                                          _createElementVNode("strong", null, _toDisplayString(item.value), 1)
                                                        ], 8, _hoisted_58))
                                                      }), 128))
                                                    ]))
                                                  : (_openBlock(), _createElementBlock("div", _hoisted_59, [
                                                      _createVNode(_component_VIcon, {
                                                        icon: "mdi-code-braces",
                                                        size: "28"
                                                      }),
                                                      _cache[156] || (_cache[156] = _createElementVNode("span", null, "该文件没有生成可用的扫描变量", -1))
                                                    ])),
                                                (probeMissingContextItems.value.length)
                                                  ? (_openBlock(), _createBlock(_component_VExpansionPanels, {
                                                      key: 2,
                                                      variant: "accordion",
                                                      class: "probe-missing-panel mt-3"
                                                    }, {
                                                      default: _withCtx(() => [
                                                        _createVNode(_component_VExpansionPanel, null, {
                                                          default: _withCtx(() => [
                                                            _createVNode(_component_VExpansionPanelTitle, null, {
                                                              default: _withCtx(() => [
                                                                _createTextVNode("未取到值的变量（" + _toDisplayString(probeMissingContextItems.value.length) + "）", 1)
                                                              ]),
                                                              _: 1
                                                            }),
                                                            _createVNode(_component_VExpansionPanelText, null, {
                                                              default: _withCtx(() => [
                                                                _createElementVNode("div", _hoisted_60, [
                                                                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(probeMissingContextItems.value, (item) => {
                                                                    return (_openBlock(), _createBlock(_component_VChip, {
                                                                      key: item.key,
                                                                      size: "x-small",
                                                                      variant: "tonal"
                                                                    }, {
                                                                      default: _withCtx(() => [
                                                                        _createTextVNode(_toDisplayString(item.key), 1)
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
                                  ], 64))
                                : (_openBlock(), _createElementBlock("div", _hoisted_61, [
                                    _createElementVNode("div", _hoisted_62, [
                                      _createVNode(_component_VIcon, {
                                        icon: "mdi-waveform",
                                        size: "30"
                                      })
                                    ]),
                                    _cache[157] || (_cache[157] = _createElementVNode("strong", null, "等待选择媒体文件", -1)),
                                    _cache[158] || (_cache[158] = _createElementVNode("span", null, "扫描后将在这里展示写入字段、媒体流数量和 Jinja2 变量。", -1))
                                  ]))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]))
                  : (_openBlock(), _createElementBlock("div", _hoisted_63, [
                      _createVNode(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card strm-overview-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "secondary",
                                variant: "tonal",
                                size: "40"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-server-network",
                                    size: "22"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            append: _withCtx(() => [
                              _createVNode(_component_VChip, {
                                size: "small",
                                color: strmSync.value.active ? 'success' : 'default',
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(strmStatusText.value), 1)
                                ]),
                                _: 1
                              }, 8, ["color"])
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx(() => [
                                  _cache[160] || (_cache[160] = _createTextVNode("神医媒体信息联动 ", -1)),
                                  _createVNode(_component_VChip, {
                                    size: "x-small",
                                    color: "secondary",
                                    variant: "tonal",
                                    class: "ms-1"
                                  }, {
                                    default: _withCtx(() => [...(_cache[159] || (_cache[159] = [
                                      _createTextVNode("仅 Pro", -1)
                                    ]))]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [...(_cache[161] || (_cache[161] = [
                                  _createTextVNode("复用 MP 传输前的 ffprobe 结果，由 StrmAssistant Pro 写入 Emby，避免网盘侧重复探测。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, { class: "strm-overview-body" }, {
                            default: _withCtx(() => [
                              _createElementVNode("div", _hoisted_64, [
                                _createVNode(_component_VSwitch, {
                                  "model-value": strmSync.value.config.enabled,
                                  color: "secondary",
                                  label: "启用媒体信息推送",
                                  "hide-details": "",
                                  loading: saving.value === 'strm-toggle',
                                  disabled: saving.value === 'strm-toggle',
                                  "onUpdate:modelValue": toggleStrmSyncEnabled
                                }, null, 8, ["model-value", "loading", "disabled"]),
                                _createElementVNode("div", _hoisted_65, [
                                  _createElementVNode("div", null, [
                                    _cache[162] || (_cache[162] = _createElementVNode("span", null, "等待", -1)),
                                    _createElementVNode("strong", null, _toDisplayString(strmSync.value.counts?.pending || 0), 1)
                                  ]),
                                  _createElementVNode("div", null, [
                                    _cache[163] || (_cache[163] = _createElementVNode("span", null, "完成", -1)),
                                    _createElementVNode("strong", null, _toDisplayString(strmSync.value.counts?.completed || 0), 1)
                                  ]),
                                  _createElementVNode("div", null, [
                                    _cache[164] || (_cache[164] = _createElementVNode("span", null, "需处理", -1)),
                                    _createElementVNode("strong", null, _toDisplayString(strmSync.value.counts?.attention || 0), 1)
                                  ])
                                ])
                              ]),
                              _createVNode(_component_VAlert, {
                                type: !config.value.media_probe_enabled ? 'warning' : 'info',
                                variant: "tonal",
                                density: "compact"
                              }, {
                                default: _withCtx(() => [
                                  (!config.value.media_probe_enabled)
                                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                                        _createTextVNode("请先在“媒体扫描”中启用整理前扫描，否则没有媒体信息可以推送。")
                                      ], 64))
                                    : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                                        _cache[165] || (_cache[165] = _createTextVNode("使用 StrmAssistant Pro 的 ", -1)),
                                        _cache[166] || (_cache[166] = _createElementVNode("code", null, "POST /Items/SyncMediaInfo", -1)),
                                        _cache[167] || (_cache[167] = _createTextVNode("；不生成 sidecar JSON，也不调用 ffmpeg。", -1))
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
                      _createVNode(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "primary",
                                variant: "tonal",
                                size: "38"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-tune-variant",
                                    size: "20"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx(() => [...(_cache[168] || (_cache[168] = [
                                  _createTextVNode("联动设置", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [...(_cache[169] || (_cache[169] = [
                                  _createTextVNode("选择服务器、设置重试节奏，并在 MP 与 Emby 路径不一致时添加映射。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, { class: "strm-card-body" }, {
                            default: _withCtx(() => [
                              _createElementVNode("div", _hoisted_66, [
                                _createElementVNode("section", _hoisted_67, [
                                  _createElementVNode("div", _hoisted_68, [
                                    _createElementVNode("div", null, [
                                      _createVNode(_component_VIcon, {
                                        icon: "mdi-server-outline",
                                        size: "19",
                                        color: "secondary"
                                      }),
                                      _cache[170] || (_cache[170] = _createElementVNode("div", null, [
                                        _createElementVNode("strong", null, "服务器与重试"),
                                        _createElementVNode("span", null, "留空目标服务器时推送到全部已连接 Emby")
                                      ], -1))
                                    ])
                                  ]),
                                  _createVNode(_component_VSelect, {
                                    modelValue: strmSync.value.config.servers,
                                    "onUpdate:modelValue": _cache[31] || (_cache[31] = $event => ((strmSync.value.config.servers) = $event)),
                                    items: strmServerItems.value,
                                    multiple: "",
                                    chips: "",
                                    clearable: "",
                                    label: "目标 Emby",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue", "items"]),
                                  _createElementVNode("div", _hoisted_69, [
                                    _createVNode(_component_VTextField, {
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
                                    _createVNode(_component_VTextField, {
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
                                    _createVNode(_component_VTextField, {
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
                                _createElementVNode("section", _hoisted_70, [
                                  _createElementVNode("div", _hoisted_71, [
                                    _createElementVNode("div", null, [
                                      _createVNode(_component_VIcon, {
                                        icon: "mdi-folder-swap-outline",
                                        size: "19",
                                        color: "secondary"
                                      }),
                                      _cache[171] || (_cache[171] = _createElementVNode("div", null, [
                                        _createElementVNode("strong", null, "Emby 条目路径映射"),
                                        _createElementVNode("span", null, "右侧填写 Emby 条目的路径前缀；STRM 库使用 .strm 文件所在目录，不填写 .strm 内记录的真实媒体地址")
                                      ], -1))
                                    ]),
                                    _createVNode(_component_VBtn, {
                                      size: "small",
                                      variant: "tonal",
                                      "prepend-icon": "mdi-plus",
                                      onClick: addStrmMapping
                                    }, {
                                      default: _withCtx(() => [...(_cache[172] || (_cache[172] = [
                                        _createTextVNode("添加映射", -1)
                                      ]))]),
                                      _: 1
                                    })
                                  ]),
                                  (strmSync.value.config.path_mappings?.length)
                                    ? (_openBlock(), _createElementBlock("div", _hoisted_72, [
                                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(strmSync.value.config.path_mappings, (mapping, index) => {
                                          return (_openBlock(), _createElementBlock("div", {
                                            key: index,
                                            class: "strm-mapping-row"
                                          }, [
                                            _createElementVNode("div", _hoisted_73, [
                                              _createVNode(_component_VSelect, {
                                                modelValue: mapping.server,
                                                "onUpdate:modelValue": $event => ((mapping.server) = $event),
                                                items: [{ title: '全部服务器', value: '*' }, ...strmServerItems.value],
                                                label: "服务器",
                                                density: "compact",
                                                "hide-details": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                                              _createVNode(_component_VSelect, {
                                                modelValue: mapping.target_kind,
                                                "onUpdate:modelValue": $event => ((mapping.target_kind) = $event),
                                                items: strmTargetKindItems,
                                                label: "Emby 条目类型",
                                                density: "compact",
                                                "hide-details": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              _createVNode(_component_VBtn, {
                                                icon: "mdi-delete-outline",
                                                size: "small",
                                                color: "error",
                                                variant: "text",
                                                onClick: $event => (strmSync.value.config.path_mappings.splice(index, 1))
                                              }, null, 8, ["onClick"])
                                            ]),
                                            _createElementVNode("div", _hoisted_74, [
                                              _createVNode(_component_VTextField, {
                                                modelValue: mapping.source,
                                                "onUpdate:modelValue": $event => ((mapping.source) = $event),
                                                label: "MP 真实媒体目录前缀",
                                                placeholder: "/pilipili",
                                                density: "compact",
                                                "hide-details": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              _createVNode(_component_VIcon, {
                                                icon: "mdi-arrow-right",
                                                color: "medium-emphasis"
                                              }),
                                              _createVNode(_component_VTextField, {
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
                                    : (_openBlock(), _createElementBlock("div", _hoisted_75, [
                                        _createVNode(_component_VIcon, {
                                          icon: "mdi-map-marker-path",
                                          size: "26"
                                        }),
                                        _cache[173] || (_cache[173] = _createElementVNode("span", null, "MP 与 Emby 路径相同时无需配置", -1))
                                      ]))
                                ])
                              ]),
                              _createElementVNode("div", _hoisted_76, [
                                _cache[175] || (_cache[175] = _createElementVNode("span", { class: "text-caption text-medium-emphasis" }, "启用状态、服务器、重试和路径映射会一起保存", -1)),
                                _createVNode(_component_VBtn, {
                                  color: "secondary",
                                  "prepend-icon": "mdi-content-save",
                                  loading: saving.value === 'strm-config',
                                  onClick: saveStrmSync
                                }, {
                                  default: _withCtx(() => [...(_cache[174] || (_cache[174] = [
                                    _createTextVNode("保存联动设置", -1)
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
                      _createVNode(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "secondary",
                                variant: "tonal",
                                size: "38"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-flask-outline",
                                    size: "20"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx(() => [...(_cache[176] || (_cache[176] = [
                                  _createTextVNode("立即试推", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [...(_cache[177] || (_cache[177] = [
                                  _createTextVNode("使用已扫描的源文件，向 Emby 真实写入一次媒体信息。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, { class: "strm-card-body" }, {
                            default: _withCtx(() => [
                              _createElementVNode("div", _hoisted_77, [
                                _createElementVNode("div", _hoisted_78, [
                                  _createElementVNode("div", _hoisted_79, [
                                    _createElementVNode("div", _hoisted_80, [
                                      _createVNode(_component_VIcon, {
                                        icon: "mdi-file-video-outline",
                                        color: "secondary",
                                        size: "19"
                                      }),
                                      _cache[178] || (_cache[178] = _createElementVNode("div", null, [
                                        _createElementVNode("strong", null, "源媒体文件"),
                                        _createElementVNode("span", null, "MP 容器内可以直接读取的真实文件")
                                      ], -1))
                                    ]),
                                    _createElementVNode("div", _hoisted_81, [
                                      _createVNode(_component_VTextField, {
                                        modelValue: probePath.value,
                                        "onUpdate:modelValue": _cache[35] || (_cache[35] = $event => ((probePath).value = $event)),
                                        label: "容器内文件路径",
                                        placeholder: "/downloads/Anime/E01.mkv",
                                        density: "comfortable",
                                        "hide-details": ""
                                      }, null, 8, ["modelValue"]),
                                      _createVNode(MediaFilePicker, {
                                        modelValue: probePath.value,
                                        "onUpdate:modelValue": _cache[36] || (_cache[36] = $event => ((probePath).value = $event)),
                                        api: props.api,
                                        compact: "",
                                        "button-label": "浏览源文件"
                                      }, null, 8, ["modelValue", "api"])
                                    ])
                                  ]),
                                  _createElementVNode("div", _hoisted_82, [
                                    _createVNode(_component_VIcon, {
                                      icon: "mdi-arrow-right",
                                      size: "20"
                                    })
                                  ]),
                                  _createElementVNode("div", _hoisted_83, [
                                    _createElementVNode("div", _hoisted_84, [
                                      _createVNode(_component_VIcon, {
                                        icon: "mdi-folder-arrow-right-outline",
                                        color: "primary",
                                        size: "19"
                                      }),
                                      _cache[179] || (_cache[179] = _createElementVNode("div", null, [
                                        _createElementVNode("strong", null, "整理后目标文件"),
                                        _createElementVNode("span", null, "MP 实际生成、并用于映射 Emby 条目的路径")
                                      ], -1))
                                    ]),
                                    _createElementVNode("div", _hoisted_85, [
                                      _createVNode(_component_VTextField, {
                                        modelValue: strmTargetPath.value,
                                        "onUpdate:modelValue": _cache[37] || (_cache[37] = $event => ((strmTargetPath).value = $event)),
                                        label: "整理后文件路径",
                                        placeholder: "/media/TV/Anime/Season 01/E01.mkv",
                                        density: "comfortable",
                                        "hide-details": ""
                                      }, null, 8, ["modelValue"]),
                                      _createVNode(MediaFilePicker, {
                                        modelValue: strmTargetPath.value,
                                        "onUpdate:modelValue": _cache[38] || (_cache[38] = $event => ((strmTargetPath).value = $event)),
                                        api: props.api,
                                        compact: "",
                                        "button-label": "浏览目标文件"
                                      }, null, 8, ["modelValue", "api"])
                                    ])
                                  ])
                                ]),
                                _createElementVNode("div", _hoisted_86, [
                                  _createElementVNode("span", null, [
                                    _createVNode(_component_VIcon, {
                                      icon: "mdi-information-outline",
                                      size: "16"
                                    }),
                                    _cache[180] || (_cache[180] = _createTextVNode(" 将重新扫描源文件，并向匹配到的 Emby 条目真实写入媒体信息", -1))
                                  ]),
                                  _createVNode(_component_VBtn, {
                                    color: "secondary",
                                    "prepend-icon": "mdi-send-check-outline",
                                    loading: saving.value === 'strm-preview',
                                    disabled: !probePath.value || !strmTargetPath.value,
                                    onClick: previewStrmSync
                                  }, {
                                    default: _withCtx(() => [...(_cache[181] || (_cache[181] = [
                                      _createTextVNode("扫描并试推", -1)
                                    ]))]),
                                    _: 1
                                  }, 8, ["loading", "disabled"])
                                ])
                              ]),
                              (!probePath.value)
                                ? (_openBlock(), _createBlock(_component_VAlert, {
                                    key: 0,
                                    type: "info",
                                    variant: "tonal",
                                    density: "compact"
                                  }, {
                                    default: _withCtx(() => [...(_cache[182] || (_cache[182] = [
                                      _createTextVNode("请输入或浏览选择 MP 容器内可读取的源文件。", -1)
                                    ]))]),
                                    _: 1
                                  }))
                                : _createCommentVNode("", true),
                              (strmSync.value.worker_error)
                                ? (_openBlock(), _createBlock(_component_VAlert, {
                                    key: 1,
                                    type: "warning",
                                    variant: "tonal",
                                    density: "compact"
                                  }, {
                                    default: _withCtx(() => [
                                      _createTextVNode("后台工作器最近一次异常：" + _toDisplayString(strmSync.value.worker_error) + "。刷新状态会自动尝试恢复。", 1)
                                    ]),
                                    _: 1
                                  }))
                                : _createCommentVNode("", true),
                              (strmPreview.value)
                                ? (_openBlock(), _createBlock(_component_VAlert, {
                                    key: 2,
                                    type: strmPreview.value.retryable ? 'warning' : 'info',
                                    variant: "tonal",
                                    density: "compact"
                                  }, {
                                    default: _withCtx(() => [
                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(strmPreview.value.results || {}, (result, name) => {
                                        return (_openBlock(), _createElementBlock("div", { key: name }, [
                                          _createElementVNode("strong", null, _toDisplayString(name), 1),
                                          _createTextVNode("：" + _toDisplayString(result.status) + " · " + _toDisplayString(result.reason), 1),
                                          (result.mapped_path)
                                            ? (_openBlock(), _createElementBlock("span", _hoisted_87, "（" + _toDisplayString(result.mapped_path) + "）", 1))
                                            : _createCommentVNode("", true)
                                        ]))
                                      }), 128)),
                                      (!Object.keys(strmPreview.value.results || {}).length)
                                        ? (_openBlock(), _createElementBlock("div", _hoisted_88, _toDisplayString(strmPreview.value.reason || '没有服务器结果'), 1))
                                        : _createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["type"]))
                                : _createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode(_component_VCard, {
                        variant: "flat",
                        border: "",
                        class: "workspace-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            prepend: _withCtx(() => [
                              _createVNode(_component_VAvatar, {
                                color: "primary",
                                variant: "tonal",
                                size: "38"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-format-list-checks",
                                    size: "20"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            append: _withCtx(() => [
                              _createVNode(_component_VChip, {
                                size: "small",
                                variant: "tonal"
                              }, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(strmSync.value.jobs?.length || 0) + " 条", 1)
                                ]),
                                _: 1
                              })
                            ]),
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, { class: "text-subtitle-1" }, {
                                default: _withCtx(() => [...(_cache[183] || (_cache[183] = [
                                  _createTextVNode("推送任务", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [...(_cache[184] || (_cache[184] = [
                                  _createTextVNode("未结束任务优先展示；已完成记录默认折叠，最多保留 80 条。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          (strmSync.value.jobs?.length)
                            ? (_openBlock(), _createBlock(_component_VCardText, {
                                key: 0,
                                class: "strm-job-area"
                              }, {
                                default: _withCtx(() => [
                                  _createElementVNode("div", _hoisted_89, [
                                    _createElementVNode("div", _hoisted_90, [
                                      (activeStrmJobs.value.length)
                                        ? (_openBlock(), _createBlock(_component_VChip, {
                                            key: 0,
                                            size: "small",
                                            color: "warning",
                                            variant: "tonal"
                                          }, {
                                            default: _withCtx(() => [
                                              _createTextVNode(_toDisplayString(activeStrmJobs.value.length) + " 条待处理", 1)
                                            ]),
                                            _: 1
                                          }))
                                        : _createCommentVNode("", true),
                                      _createVNode(_component_VChip, {
                                        size: "small",
                                        color: "success",
                                        variant: "tonal"
                                      }, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(completedStrmJobs.value.length) + " 条已完成", 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _createElementVNode("div", _hoisted_91, [
                                      _createVNode(_component_VBtn, {
                                        size: "small",
                                        variant: "text",
                                        "prepend-icon": "mdi-replay",
                                        disabled: !activeStrmJobs.value.length,
                                        onClick: _cache[39] || (_cache[39] = $event => (retryStrmJob()))
                                      }, {
                                        default: _withCtx(() => [...(_cache[185] || (_cache[185] = [
                                          _createTextVNode("重试未完成", -1)
                                        ]))]),
                                        _: 1
                                      }, 8, ["disabled"]),
                                      _createVNode(_component_VBtn, {
                                        size: "small",
                                        variant: "text",
                                        color: "error",
                                        "prepend-icon": "mdi-delete-sweep-outline",
                                        disabled: !completedStrmJobs.value.length,
                                        onClick: _cache[40] || (_cache[40] = $event => (deleteStrmJob()))
                                      }, {
                                        default: _withCtx(() => [...(_cache[186] || (_cache[186] = [
                                          _createTextVNode("清理已完成", -1)
                                        ]))]),
                                        _: 1
                                      }, 8, ["disabled"])
                                    ])
                                  ]),
                                  (activeStrmJobs.value.length)
                                    ? (_openBlock(), _createElementBlock("section", _hoisted_92, [
                                        _createElementVNode("div", _hoisted_93, [
                                          _createVNode(_component_VIcon, {
                                            icon: "mdi-progress-clock",
                                            size: "17",
                                            color: "warning"
                                          }),
                                          _cache[187] || (_cache[187] = _createElementVNode("span", null, "进行中与需要处理", -1))
                                        ]),
                                        _createElementVNode("div", _hoisted_94, [
                                          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(activeStrmJobs.value, (job) => {
                                            return (_openBlock(), _createElementBlock("div", {
                                              key: job.id,
                                              class: "strm-job-row"
                                            }, [
                                              _createVNode(_component_VIcon, {
                                                icon: strmJobStatusPresentation(job.status).icon,
                                                color: strmJobStatusPresentation(job.status).color,
                                                size: "20"
                                              }, null, 8, ["icon", "color"]),
                                              _createElementVNode("button", {
                                                type: "button",
                                                class: "strm-job-main",
                                                onClick: $event => (toggleStrmJobDetail(job.id))
                                              }, [
                                                _createElementVNode("strong", null, _toDisplayString(job.title || job.target_path), 1),
                                                _createElementVNode("span", null, _toDisplayString(strmJobSummary(job) || '等待后台处理'), 1)
                                              ], 8, _hoisted_95),
                                              _createVNode(_component_VChip, {
                                                size: "small",
                                                color: strmJobStatusPresentation(job.status).color,
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx(() => [
                                                  _createTextVNode(_toDisplayString(strmJobStatusPresentation(job.status).label), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"]),
                                              _createElementVNode("div", _hoisted_96, [
                                                _createVNode(_component_VBtn, {
                                                  icon: strmJobDetailOpen(job.id) ? 'mdi-chevron-up' : 'mdi-chevron-down',
                                                  size: "small",
                                                  variant: "text",
                                                  onClick: $event => (toggleStrmJobDetail(job.id))
                                                }, null, 8, ["icon", "onClick"]),
                                                _createVNode(_component_VBtn, {
                                                  icon: "mdi-replay",
                                                  size: "small",
                                                  variant: "text",
                                                  onClick: $event => (retryStrmJob(job.id))
                                                }, null, 8, ["onClick"]),
                                                _createVNode(_component_VBtn, {
                                                  icon: "mdi-delete-outline",
                                                  size: "small",
                                                  color: "error",
                                                  variant: "text",
                                                  onClick: $event => (deleteStrmJob(job.id))
                                                }, null, 8, ["onClick"])
                                              ]),
                                              _createVNode(_component_VExpandTransition, null, {
                                                default: _withCtx(() => [
                                                  (strmJobDetailOpen(job.id))
                                                    ? (_openBlock(), _createElementBlock("div", _hoisted_97, [
                                                        _createElementVNode("div", null, [
                                                          _cache[188] || (_cache[188] = _createElementVNode("span", null, "目标路径", -1)),
                                                          _createElementVNode("code", null, _toDisplayString(job.target_path || '未记录'), 1)
                                                        ]),
                                                        _createElementVNode("div", null, [
                                                          _cache[189] || (_cache[189] = _createElementVNode("span", null, "处理说明", -1)),
                                                          _createElementVNode("strong", null, _toDisplayString(strmJobSummary(job)), 1)
                                                        ]),
                                                        _createElementVNode("div", null, [
                                                          _cache[190] || (_cache[190] = _createElementVNode("span", null, "尝试次数", -1)),
                                                          _createElementVNode("strong", null, _toDisplayString(job.attempts || 0) + " 次", 1)
                                                        ]),
                                                        (strmServerResults(job).length)
                                                          ? (_openBlock(), _createElementBlock("div", _hoisted_98, [
                                                              _cache[191] || (_cache[191] = _createElementVNode("span", null, "服务器结果", -1)),
                                                              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(strmServerResults(job), (result) => {
                                                                return (_openBlock(), _createElementBlock("div", {
                                                                  key: result.name,
                                                                  class: "strm-server-result"
                                                                }, [
                                                                  _createVNode(_component_VIcon, {
                                                                    icon: result.presentation.icon,
                                                                    color: result.presentation.color,
                                                                    size: "17"
                                                                  }, null, 8, ["icon", "color"]),
                                                                  _createElementVNode("div", null, [
                                                                    _createElementVNode("div", null, [
                                                                      _createElementVNode("strong", null, _toDisplayString(result.name), 1),
                                                                      _createVNode(_component_VChip, {
                                                                        size: "x-small",
                                                                        color: result.presentation.color,
                                                                        variant: "tonal"
                                                                      }, {
                                                                        default: _withCtx(() => [
                                                                          _createTextVNode(_toDisplayString(result.presentation.label), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1032, ["color"])
                                                                    ]),
                                                                    _createElementVNode("small", null, _toDisplayString(result.reason), 1),
                                                                    (result.mapped_path)
                                                                      ? (_openBlock(), _createElementBlock("code", _hoisted_99, _toDisplayString(result.mapped_path), 1))
                                                                      : _createCommentVNode("", true)
                                                                  ])
                                                                ]))
                                                              }), 128))
                                                            ]))
                                                          : _createCommentVNode("", true)
                                                      ]))
                                                    : _createCommentVNode("", true)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]))
                                          }), 128))
                                        ])
                                      ]))
                                    : _createCommentVNode("", true),
                                  (completedStrmJobs.value.length)
                                    ? (_openBlock(), _createBlock(_component_VExpansionPanels, {
                                        key: 1,
                                        variant: "accordion",
                                        class: "strm-completed-panel"
                                      }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VExpansionPanel, null, {
                                            default: _withCtx(() => [
                                              _createVNode(_component_VExpansionPanelTitle, null, {
                                                default: _withCtx(() => [
                                                  _createElementVNode("div", _hoisted_100, [
                                                    _createElementVNode("div", null, [
                                                      _createVNode(_component_VIcon, {
                                                        icon: "mdi-check-all",
                                                        color: "success",
                                                        size: "19"
                                                      }),
                                                      _cache[192] || (_cache[192] = _createElementVNode("span", null, "已完成记录", -1))
                                                    ]),
                                                    _createVNode(_component_VChip, {
                                                      size: "x-small",
                                                      color: "success",
                                                      variant: "tonal"
                                                    }, {
                                                      default: _withCtx(() => [
                                                        _createTextVNode(_toDisplayString(completedStrmJobs.value.length), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ])
                                                ]),
                                                _: 1
                                              }),
                                              _createVNode(_component_VExpansionPanelText, null, {
                                                default: _withCtx(() => [
                                                  _createElementVNode("div", _hoisted_101, [
                                                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(completedStrmJobs.value, (job) => {
                                                      return (_openBlock(), _createElementBlock("div", {
                                                        key: job.id,
                                                        class: "strm-job-row completed"
                                                      }, [
                                                        _createVNode(_component_VIcon, {
                                                          icon: "mdi-check-circle-outline",
                                                          color: "success",
                                                          size: "20"
                                                        }),
                                                        _createElementVNode("button", {
                                                          type: "button",
                                                          class: "strm-job-main",
                                                          onClick: $event => (toggleStrmJobDetail(job.id))
                                                        }, [
                                                          _createElementVNode("strong", null, _toDisplayString(job.title || job.target_path), 1),
                                                          _createElementVNode("span", null, _toDisplayString(strmJobSummary(job)), 1)
                                                        ], 8, _hoisted_102),
                                                        _createVNode(_component_VChip, {
                                                          size: "small",
                                                          color: "success",
                                                          variant: "tonal"
                                                        }, {
                                                          default: _withCtx(() => [...(_cache[193] || (_cache[193] = [
                                                            _createTextVNode("已完成", -1)
                                                          ]))]),
                                                          _: 1
                                                        }),
                                                        _createElementVNode("div", _hoisted_103, [
                                                          _createVNode(_component_VBtn, {
                                                            icon: strmJobDetailOpen(job.id) ? 'mdi-chevron-up' : 'mdi-chevron-down',
                                                            size: "small",
                                                            variant: "text",
                                                            onClick: $event => (toggleStrmJobDetail(job.id))
                                                          }, null, 8, ["icon", "onClick"]),
                                                          _createVNode(_component_VBtn, {
                                                            icon: "mdi-delete-outline",
                                                            size: "small",
                                                            color: "error",
                                                            variant: "text",
                                                            onClick: $event => (deleteStrmJob(job.id))
                                                          }, null, 8, ["onClick"])
                                                        ]),
                                                        _createVNode(_component_VExpandTransition, null, {
                                                          default: _withCtx(() => [
                                                            (strmJobDetailOpen(job.id))
                                                              ? (_openBlock(), _createElementBlock("div", _hoisted_104, [
                                                                  _createElementVNode("div", null, [
                                                                    _cache[194] || (_cache[194] = _createElementVNode("span", null, "目标路径", -1)),
                                                                    _createElementVNode("code", null, _toDisplayString(job.target_path || '未记录'), 1)
                                                                  ]),
                                                                  _createElementVNode("div", null, [
                                                                    _cache[195] || (_cache[195] = _createElementVNode("span", null, "处理说明", -1)),
                                                                    _createElementVNode("strong", null, _toDisplayString(strmJobSummary(job)), 1)
                                                                  ]),
                                                                  _createElementVNode("div", null, [
                                                                    _cache[196] || (_cache[196] = _createElementVNode("span", null, "尝试次数", -1)),
                                                                    _createElementVNode("strong", null, _toDisplayString(job.attempts || 0) + " 次", 1)
                                                                  ]),
                                                                  (strmServerResults(job).length)
                                                                    ? (_openBlock(), _createElementBlock("div", _hoisted_105, [
                                                                        _cache[197] || (_cache[197] = _createElementVNode("span", null, "服务器结果", -1)),
                                                                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(strmServerResults(job), (result) => {
                                                                          return (_openBlock(), _createElementBlock("div", {
                                                                            key: result.name,
                                                                            class: "strm-server-result"
                                                                          }, [
                                                                            _createVNode(_component_VIcon, {
                                                                              icon: result.presentation.icon,
                                                                              color: result.presentation.color,
                                                                              size: "17"
                                                                            }, null, 8, ["icon", "color"]),
                                                                            _createElementVNode("div", null, [
                                                                              _createElementVNode("div", null, [
                                                                                _createElementVNode("strong", null, _toDisplayString(result.name), 1),
                                                                                _createVNode(_component_VChip, {
                                                                                  size: "x-small",
                                                                                  color: result.presentation.color,
                                                                                  variant: "tonal"
                                                                                }, {
                                                                                  default: _withCtx(() => [
                                                                                    _createTextVNode(_toDisplayString(result.presentation.label), 1)
                                                                                  ]),
                                                                                  _: 2
                                                                                }, 1032, ["color"])
                                                                              ]),
                                                                              _createElementVNode("small", null, _toDisplayString(result.reason), 1),
                                                                              (result.mapped_path)
                                                                                ? (_openBlock(), _createElementBlock("code", _hoisted_106, _toDisplayString(result.mapped_path), 1))
                                                                                : _createCommentVNode("", true)
                                                                            ])
                                                                          ]))
                                                                        }), 128))
                                                                      ]))
                                                                    : _createCommentVNode("", true)
                                                                ]))
                                                              : _createCommentVNode("", true)
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
                                    : _createCommentVNode("", true)
                                ]),
                                _: 1
                              }))
                            : (_openBlock(), _createBlock(_component_VCardText, {
                                key: 1,
                                class: "strm-empty"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-inbox-outline",
                                    size: "34"
                                  }),
                                  _cache[198] || (_cache[198] = _createElementVNode("span", null, "暂无推送任务", -1))
                                ]),
                                _: 1
                              }))
                        ]),
                        _: 1
                      })
                    ]))
              ]))
            : (props.mode === 'naming')
              ? (_openBlock(), _createElementBlock("section", _hoisted_107, [
                  _createVNode(_component_VTabs, {
                    modelValue: renameRuleSection.value,
                    "onUpdate:modelValue": _cache[41] || (_cache[41] = $event => ((renameRuleSection).value = $event)),
                    color: "primary",
                    class: "sub-tabs mb-4"
                  }, {
                    default: _withCtx(() => [
                      _createVNode(_component_VTab, {
                        value: "defaults",
                        "prepend-icon": "mdi-tune-variant"
                      }, {
                        default: _withCtx(() => [...(_cache[199] || (_cache[199] = [
                          _createTextVNode("连接与分隔", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode(_component_VTab, {
                        value: "fields",
                        "prepend-icon": "mdi-code-braces"
                      }, {
                        default: _withCtx(() => [...(_cache[200] || (_cache[200] = [
                          _createTextVNode("自定义字段", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode(_component_VTab, {
                        value: "text",
                        "prepend-icon": "mdi-find-replace"
                      }, {
                        default: _withCtx(() => [...(_cache[201] || (_cache[201] = [
                          _createTextVNode("文本映射", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  (renameRuleSection.value === 'fields')
                    ? (_openBlock(), _createElementBlock("div", _hoisted_108, [
                        _createElementVNode("div", _hoisted_109, [
                          _cache[203] || (_cache[203] = _createElementVNode("div", { class: "flex-grow-1" }, [
                            _createElementVNode("div", { class: "text-h6" }, "Jinja2 自定义字段"),
                            _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, [
                              _createTextVNode("保存后可在 MP 命名模板中直接使用 "),
                              _createElementVNode("code", null, "{{ your_field }}"),
                              _createTextVNode("；固定文字可直接填写，条件与组合可使用 Jinja2。")
                            ])
                          ], -1)),
                          _createVNode(_component_VBtn, {
                            color: "primary",
                            "prepend-icon": "mdi-plus",
                            onClick: _cache[42] || (_cache[42] = $event => (openRenameField()))
                          }, {
                            default: _withCtx(() => [...(_cache[202] || (_cache[202] = [
                              _createTextVNode("新增字段", -1)
                            ]))]),
                            _: 1
                          })
                        ]),
                        (!data.value.capabilities?.custom_independent_field)
                          ? (_openBlock(), _createBlock(_component_VAlert, {
                              key: 0,
                              type: "warning",
                              variant: "tonal",
                              class: "mb-4"
                            }, {
                              default: _withCtx(() => [...(_cache[204] || (_cache[204] = [
                                _createTextVNode("当前 MP 不支持渲染前上下文事件，无法注入自定义字段。请更新 MoviePilot。", -1)
                              ]))]),
                              _: 1
                            }))
                          : _createCommentVNode("", true),
                        _createVNode(_component_VCard, { variant: "outlined" }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VCardItem, null, {
                              default: _withCtx(() => [
                                _createVNode(_component_VCardTitle, null, {
                                  default: _withCtx(() => [...(_cache[205] || (_cache[205] = [
                                    _createTextVNode("已定义字段", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VCardSubtitle, null, {
                                  default: _withCtx(() => [
                                    _createTextVNode(_toDisplayString(customFields.value.length) + " 个字段 · 支持字段间依赖", 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            _createVNode(_component_VCardText, null, {
                              default: _withCtx(() => [
                                (customFields.value.length)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_110, [
                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(customFields.value, (item) => {
                                        return (_openBlock(), _createElementBlock("div", {
                                          key: item.key,
                                          class: "custom-field-row"
                                        }, [
                                          _createElementVNode("div", _hoisted_111, [
                                            _createElementVNode("div", _hoisted_112, [
                                              _createElementVNode("code", null, _toDisplayString(item.key), 1),
                                              _createVNode(_component_VChip, {
                                                size: "x-small",
                                                color: item.enabled ? 'success' : 'default',
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx(() => [
                                                  _createTextVNode(_toDisplayString(item.enabled ? '启用' : '停用'), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ]),
                                            _createElementVNode("div", _hoisted_113, _toDisplayString(item.label || item.key), 1),
                                            _createElementVNode("div", {
                                              class: "rule-pattern text-truncate",
                                              title: item.expression
                                            }, _toDisplayString(item.expression), 9, _hoisted_114),
                                            (item.dependencies?.length)
                                              ? (_openBlock(), _createElementBlock("div", _hoisted_115, "依赖：" + _toDisplayString(item.dependencies.join('、')), 1))
                                              : _createCommentVNode("", true)
                                          ]),
                                          _createVNode(_component_VBtn, {
                                            icon: "mdi-content-copy",
                                            size: "small",
                                            variant: "text",
                                            title: "复制模板变量",
                                            onClick: $event => (copyVariable(item.key))
                                          }, null, 8, ["onClick"]),
                                          _createVNode(_component_VBtn, {
                                            icon: "mdi-pencil-outline",
                                            size: "small",
                                            variant: "text",
                                            onClick: $event => (openRenameField(item))
                                          }, null, 8, ["onClick"]),
                                          _createVNode(_component_VBtn, {
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
                                  : (_openBlock(), _createElementBlock("div", _hoisted_116, [
                                      _createVNode(_component_VIcon, {
                                        icon: "mdi-code-braces",
                                        size: "34"
                                      }),
                                      _cache[206] || (_cache[206] = _createElementVNode("div", { class: "mt-2" }, "尚未定义自定义字段", -1)),
                                      _cache[207] || (_cache[207] = _createElementVNode("div", { class: "text-caption mt-1" }, "需要时点击右上角“新增字段”", -1))
                                    ]))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        _createVNode(_component_VCard, {
                          variant: "outlined",
                          class: "mt-4"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VCardItem, null, {
                              default: _withCtx(() => [
                                _createVNode(_component_VCardTitle, null, {
                                  default: _withCtx(() => [...(_cache[208] || (_cache[208] = [
                                    _createTextVNode("上下文试算", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VCardSubtitle, null, {
                                  default: _withCtx(() => [...(_cache[209] || (_cache[209] = [
                                    _createTextVNode("手工构造一次命名上下文，只验证自定义字段输出，不执行文件整理。", -1)
                                  ]))]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            _createVNode(_component_VCardText, null, {
                              default: _withCtx(() => [
                                _createElementVNode("div", _hoisted_117, [
                                  _createVNode(_component_VTextarea, {
                                    modelValue: renamePreviewInput.value.original_name,
                                    "onUpdate:modelValue": _cache[43] || (_cache[43] = $event => ((renamePreviewInput.value.original_name) = $event)),
                                    label: "MP 原始标题 original_name",
                                    rows: "1",
                                    "auto-grow": "",
                                    "hide-details": "",
                                    class: "preview-original"
                                  }, null, 8, ["modelValue"]),
                                  _createVNode(_component_VTextField, {
                                    modelValue: renamePreviewInput.value.type,
                                    "onUpdate:modelValue": _cache[44] || (_cache[44] = $event => ((renamePreviewInput.value.type) = $event)),
                                    label: "媒体类型 type",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue"]),
                                  _createVNode(_component_VTextField, {
                                    modelValue: renamePreviewInput.value.category,
                                    "onUpdate:modelValue": _cache[45] || (_cache[45] = $event => ((renamePreviewInput.value.category) = $event)),
                                    label: "二级分类 category",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue"]),
                                  _createVNode(_component_VTextField, {
                                    modelValue: renamePreviewInput.value.source_path,
                                    "onUpdate:modelValue": _cache[46] || (_cache[46] = $event => ((renamePreviewInput.value.source_path) = $event)),
                                    label: "真实源路径 source_path",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue"]),
                                  _createVNode(_component_VTextField, {
                                    modelValue: renamePreviewInput.value.target_dir,
                                    "onUpdate:modelValue": _cache[47] || (_cache[47] = $event => ((renamePreviewInput.value.target_dir) = $event)),
                                    label: "分类后目标根目录 target_dir",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue"]),
                                  _createVNode(_component_VBtn, {
                                    color: "secondary",
                                    "prepend-icon": "mdi-play",
                                    loading: renamePreviewing.value,
                                    class: "preview-wide",
                                    onClick: previewRenameFields
                                  }, {
                                    default: _withCtx(() => [...(_cache[210] || (_cache[210] = [
                                      _createTextVNode("试算全部字段", -1)
                                    ]))]),
                                    _: 1
                                  }, 8, ["loading"])
                                ]),
                                (renamePreview.value)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_118, [
                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(renamePreview.value.values, (value, key) => {
                                        return (_openBlock(), _createElementBlock("div", {
                                          key: key,
                                          class: "d-flex justify-space-between ga-3"
                                        }, [
                                          _createElementVNode("code", null, _toDisplayString(key), 1),
                                          _createElementVNode("span", _hoisted_119, _toDisplayString(value || '（空）'), 1)
                                        ]))
                                      }), 128)),
                                      (renamePreview.value.errors?.length)
                                        ? (_openBlock(), _createBlock(_component_VAlert, {
                                            key: 0,
                                            type: "warning",
                                            variant: "tonal",
                                            density: "compact",
                                            class: "mt-3"
                                          }, {
                                            default: _withCtx(() => [
                                              _createTextVNode(_toDisplayString(renamePreview.value.errors.map(item => `${item.key}: ${item.message}`).join('；')), 1)
                                            ]),
                                            _: 1
                                          }))
                                        : _createCommentVNode("", true)
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
                          class: "mt-4"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VCardItem, null, {
                              default: _withCtx(() => [
                                _createVNode(_component_VCardTitle, null, {
                                  default: _withCtx(() => [...(_cache[211] || (_cache[211] = [
                                    _createTextVNode("可用于文件命名的 Jinja2 输入字段", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VCardSubtitle, null, {
                                  default: _withCtx(() => [...(_cache[212] || (_cache[212] = [
                                    _createTextVNode("统一展示 MoviePilot 原生字段、插件上下文字段与 ffprobe 扫描字段；可复制变量或查看取值详情。", -1)
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
                                  default: _withCtx(() => [...(_cache[213] || (_cache[213] = [
                                    _createTextVNode("每张卡片底部标注了用法：", -1),
                                    _createElementVNode("span", { class: "text-success font-weight-bold" }, "绿色 = 可直接写入 MP 命名模板", -1),
                                    _createTextVNode("；", -1),
                                    _createElementVNode("span", { class: "text-warning font-weight-bold" }, "黄色（虚线卡片）= 间接使用", -1),
                                    _createTextVNode("——这些目标目录字段在 MP 首次渲染后才产生，不能直接进模板，请先在自定义字段的表达式里引用它们，再把自定义字段写进模板（插件会安全重渲染一次）。彩色小标签仅表示字段来源。", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VTextField, {
                                  modelValue: renameFieldSearch.value,
                                  "onUpdate:modelValue": _cache[48] || (_cache[48] = $event => ((renameFieldSearch).value = $event)),
                                  label: "搜索字段名称、变量或用途",
                                  "prepend-inner-icon": "mdi-magnify",
                                  clearable: "",
                                  "hide-details": "",
                                  class: "mb-4"
                                }, null, 8, ["modelValue"]),
                                _createVNode(_component_VExpansionPanels, {
                                  modelValue: openRenameFieldGroups.value,
                                  "onUpdate:modelValue": _cache[49] || (_cache[49] = $event => ((openRenameFieldGroups).value = $event)),
                                  multiple: "",
                                  variant: "accordion",
                                  class: "field-panels"
                                }, {
                                  default: _withCtx(() => [
                                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(renameFieldGroups.value, (group) => {
                                      return (_openBlock(), _createBlock(_component_VExpansionPanel, {
                                        key: group.category,
                                        value: group.category
                                      }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VExpansionPanelTitle, null, {
                                            default: _withCtx(() => [
                                              _createElementVNode("div", _hoisted_120, [
                                                _createElementVNode("span", _hoisted_121, _toDisplayString(group.category), 1),
                                                _createVNode(_component_VChip, {
                                                  size: "x-small",
                                                  variant: "tonal"
                                                }, {
                                                  default: _withCtx(() => [
                                                    _createTextVNode(_toDisplayString(group.items.length) + " 项", 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024),
                                          _createVNode(_component_VExpansionPanelText, null, {
                                            default: _withCtx(() => [
                                              _createElementVNode("div", _hoisted_122, [
                                                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(group.items, (item) => {
                                                  return (_openBlock(), _createElementBlock("div", {
                                                    key: item.key,
                                                    class: _normalizeClass(["field-description-card", { 'field-card-indirect': item.template_usage === 'custom_dependency' }])
                                                  }, [
                                                    _createElementVNode("div", _hoisted_123, [
                                                      _createElementVNode("code", null, _toDisplayString(item.key), 1),
                                                      _createVNode(_component_VChip, {
                                                        size: "x-small",
                                                        variant: "tonal",
                                                        color: fieldSourceColor(item.source)
                                                      }, {
                                                        default: _withCtx(() => [
                                                          _createTextVNode(_toDisplayString(item.source_label || '命名字段'), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"])
                                                    ]),
                                                    _createElementVNode("div", _hoisted_124, _toDisplayString(item.label), 1),
                                                    _createElementVNode("div", _hoisted_125, _toDisplayString(item.description), 1),
                                                    _createElementVNode("div", _hoisted_126, [
                                                      _createElementVNode("span", null, _toDisplayString(item.type || '文本'), 1),
                                                      _createElementVNode("span", _hoisted_127, _toDisplayString(item.values || '按上下文决定'), 1)
                                                    ]),
                                                    _createElementVNode("div", {
                                                      class: _normalizeClass(["field-usage-line", item.template_usage === 'custom_dependency' ? 'usage-indirect' : 'usage-direct'])
                                                    }, [
                                                      _createVNode(_component_VIcon, {
                                                        icon: item.template_usage === 'custom_dependency' ? 'mdi-function-variant' : 'mdi-check-circle-outline',
                                                        size: "14"
                                                      }, null, 8, ["icon"]),
                                                      _createElementVNode("span", null, _toDisplayString(item.template_usage === 'custom_dependency' ? '间接使用：仅作自定义字段依赖' : '可直接写入命名模板'), 1)
                                                    ], 2),
                                                    _createElementVNode("div", _hoisted_128, [
                                                      _createVNode(_component_VBtn, {
                                                        size: "small",
                                                        variant: "text",
                                                        "prepend-icon": copiedVariable.value === item.key ? 'mdi-check' : 'mdi-content-copy',
                                                        onClick: $event => (copyVariable(item.key))
                                                      }, {
                                                        default: _withCtx(() => [
                                                          _createTextVNode(_toDisplayString(copiedVariable.value === item.key ? '已复制' : '复制变量'), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["prepend-icon", "onClick"]),
                                                      _createVNode(_component_VBtn, {
                                                        size: "small",
                                                        variant: "tonal",
                                                        "prepend-icon": "mdi-information-outline",
                                                        onClick: $event => (openFieldDetail(item))
                                                      }, {
                                                        default: _withCtx(() => [...(_cache[214] || (_cache[214] = [
                                                          _createTextVNode("取值详情", -1)
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
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_129, "没有匹配的字段"))
                                  : _createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]))
                    : _createCommentVNode("", true),
                  (renameRuleSection.value === 'defaults')
                    ? (_openBlock(), _createBlock(_component_VCard, {
                        key: 1,
                        variant: "outlined",
                        class: "mb-4 naming-defaults-card"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardItem, null, {
                            default: _withCtx(() => [
                              _createVNode(_component_VCardTitle, null, {
                                default: _withCtx(() => [...(_cache[215] || (_cache[215] = [
                                  _createTextVNode("命名连接与分隔默认值", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VCardSubtitle, null, {
                                default: _withCtx(() => [...(_cache[216] || (_cache[216] = [
                                  _createTextVNode("单组专属连接符 > 标题原连接符 > 全局默认连接符；下方开关决定是否跳过标题原连接符。", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCardText, null, {
                            default: _withCtx(() => [
                              (config.value.enabled && data.value.capabilities?.customization_separator === false)
                                ? (_openBlock(), _createBlock(_component_VAlert, {
                                    key: 0,
                                    type: "warning",
                                    variant: "tonal",
                                    density: "compact",
                                    class: "mb-4"
                                  }, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(data.value.capabilities?.customization_separator_message || '当前 MP 无法动态设置自定义占位符连接符。'), 1)
                                    ]),
                                    _: 1
                                  }))
                                : _createCommentVNode("", true),
                              _createElementVNode("div", _hoisted_130, [
                                _createVNode(_component_VCombobox, {
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
                                _createVNode(_component_VCombobox, {
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
                                _createVNode(_component_VCombobox, {
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
                                _createVNode(_component_VSelect, {
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
                                _createElementVNode("div", _hoisted_131, [
                                  _cache[217] || (_cache[217] = _createElementVNode("div", null, [
                                    _createElementVNode("div", { class: "font-weight-medium" }, "默认连接符覆盖标题原连接符"),
                                    _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "关闭：未设置专属连接符的组保留标题中的 @、& 或 +；开启：统一改用上面的默认连接符。单组专属设置始终优先。")
                                  ], -1)),
                                  _createVNode(_component_VSwitch, {
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
                          _createVNode(_component_VDivider),
                          _createVNode(_component_VCardActions, null, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSpacer),
                              _createVNode(_component_VBtn, {
                                color: "primary",
                                "prepend-icon": "mdi-content-save",
                                loading: __props.savingConfig,
                                onClick: _cache[55] || (_cache[55] = $event => (emit('save-config')))
                              }, {
                                default: _withCtx(() => [...(_cache[218] || (_cache[218] = [
                                  _createTextVNode("保存命名默认值", -1)
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
                      ? (_openBlock(), _createElementBlock("div", _hoisted_132, [
                          _createElementVNode("div", _hoisted_133, [
                            _createVNode(_component_VAlert, {
                              type: "info",
                              variant: "tonal",
                              density: "compact",
                              class: "flex-grow-1 mb-0"
                            }, {
                              default: _withCtx(() => [...(_cache[219] || (_cache[219] = [
                                _createTextVNode("无需判断标题、目录还是字幕。把 MP 的完整首次结果当作输入，例如 ", -1),
                                _createElementVNode("code", null, "AB/C.chi.zh-cn.ass", -1),
                                _createTextVNode("，规则连续执行后得到最终路径。", -1)
                              ]))]),
                              _: 1
                            }),
                            _createVNode(_component_VBtn, {
                              variant: "tonal",
                              color: "secondary",
                              "prepend-icon": "mdi-closed-caption-outline",
                              onClick: addSubtitleMappingPreset
                            }, {
                              default: _withCtx(() => [...(_cache[220] || (_cache[220] = [
                                _createTextVNode("添加简繁字幕预设", -1)
                              ]))]),
                              _: 1
                            }),
                            _createVNode(_component_VBtn, {
                              color: "primary",
                              "prepend-icon": "mdi-plus",
                              onClick: _cache[56] || (_cache[56] = $event => (openMappingRule()))
                            }, {
                              default: _withCtx(() => [...(_cache[221] || (_cache[221] = [
                                _createTextVNode("新增文本映射", -1)
                              ]))]),
                              _: 1
                            })
                          ]),
                          (!data.value.rename_mappings?.subtitle_compatible)
                            ? (_openBlock(), _createBlock(_component_VAlert, {
                                key: 0,
                                type: "warning",
                                variant: "tonal",
                                density: "compact",
                                class: "mb-4"
                              }, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(data.value.rename_mappings?.subtitle_message || '当前 MP 暂不支持在字幕语言后缀生成后执行；视频最终命名仍可使用。'), 1)
                                ]),
                                _: 1
                              }))
                            : _createCommentVNode("", true),
                          (mappingRules.value.length)
                            ? (_openBlock(), _createElementBlock("div", _hoisted_134, [
                                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(mappingRules.value, (item) => {
                                  return (_openBlock(), _createBlock(_component_VCard, {
                                    key: item.id,
                                    variant: "outlined",
                                    class: "mapping-card"
                                  }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VCardText, { class: "d-flex align-start ga-3" }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_VAvatar, {
                                            color: item.stage === 'release_group' ? 'primary' : 'orange',
                                            variant: "tonal",
                                            size: "38"
                                          }, {
                                            default: _withCtx(() => [
                                              _createVNode(_component_VIcon, {
                                                icon: item.stage === 'release_group' ? 'mdi-account-group-outline' : 'mdi-find-replace'
                                              }, null, 8, ["icon"])
                                            ]),
                                            _: 2
                                          }, 1032, ["color"]),
                                          _createElementVNode("div", _hoisted_135, [
                                            _createElementVNode("div", _hoisted_136, [
                                              _createElementVNode("span", _hoisted_137, _toDisplayString(item.label), 1),
                                              _createVNode(_component_VChip, {
                                                size: "x-small",
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx(() => [
                                                  _createTextVNode(_toDisplayString(mappingStageLabel(item.stage)), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              _createVNode(_component_VChip, {
                                                size: "x-small",
                                                color: item.mode === 'regex' ? 'warning' : 'default',
                                                variant: "tonal"
                                              }, {
                                                default: _withCtx(() => [
                                                  _createTextVNode(_toDisplayString(item.mode === 'regex' ? '正则' : '字面'), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"]),
                                              (!item.enabled)
                                                ? (_openBlock(), _createBlock(_component_VChip, {
                                                    key: 0,
                                                    size: "x-small",
                                                    variant: "tonal"
                                                  }, {
                                                    default: _withCtx(() => [...(_cache[222] || (_cache[222] = [
                                                      _createTextVNode("已停用", -1)
                                                    ]))]),
                                                    _: 1
                                                  }))
                                                : _createCommentVNode("", true)
                                            ]),
                                            _createElementVNode("div", _hoisted_138, [
                                              _createElementVNode("code", null, _toDisplayString(item.pattern), 1),
                                              _createVNode(_component_VIcon, {
                                                icon: "mdi-arrow-right",
                                                size: "16"
                                              }),
                                              _createElementVNode("code", null, _toDisplayString(item.replacement || '（删除）'), 1)
                                            ]),
                                            _createElementVNode("div", _hoisted_139, "优先级 " + _toDisplayString(item.priority), 1)
                                          ]),
                                          _createVNode(_component_VBtn, {
                                            icon: "mdi-pencil-outline",
                                            size: "small",
                                            variant: "text",
                                            onClick: $event => (openMappingRule(item))
                                          }, null, 8, ["onClick"]),
                                          _createVNode(_component_VBtn, {
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
                            : (_openBlock(), _createElementBlock("div", _hoisted_140, [
                                _createVNode(_component_VIcon, {
                                  icon: "mdi-find-replace",
                                  size: "48"
                                }),
                                _cache[223] || (_cache[223] = _createElementVNode("div", { class: "mt-2" }, "尚未设置最终命名规则", -1)),
                                _cache[224] || (_cache[224] = _createElementVNode("div", { class: "text-caption mt-1" }, "可先添加简繁字幕预设，或按 MP 模板生成的完整路径建立任意文字替换", -1))
                              ])),
                          _createVNode(_component_VCard, {
                            variant: "outlined",
                            class: "mt-4"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VCardItem, null, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VCardTitle, null, {
                                    default: _withCtx(() => [...(_cache[225] || (_cache[225] = [
                                      _createTextVNode("最终结果试算", -1)
                                    ]))]),
                                    _: 1
                                  }),
                                  _createVNode(_component_VCardSubtitle, null, {
                                    default: _withCtx(() => [...(_cache[226] || (_cache[226] = [
                                      _createTextVNode("输入 MP 模板生成的相对路径或文件名；这里只试算，不执行文件整理。", -1)
                                    ]))]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              _createVNode(_component_VCardText, null, {
                                default: _withCtx(() => [
                                  _createElementVNode("div", _hoisted_141, [
                                    _createVNode(_component_VTextField, {
                                      modelValue: mappingPreviewInput.value.value,
                                      "onUpdate:modelValue": _cache[57] || (_cache[57] = $event => ((mappingPreviewInput.value.value) = $event)),
                                      label: "模板生成的完整路径",
                                      placeholder: "AB/C.chi.zh-cn.ass",
                                      "hide-details": ""
                                    }, null, 8, ["modelValue"]),
                                    _createVNode(_component_VBtn, {
                                      color: "secondary",
                                      "prepend-icon": "mdi-play",
                                      loading: saving.value === 'mapping-preview',
                                      onClick: previewMappingRules
                                    }, {
                                      default: _withCtx(() => [...(_cache[227] || (_cache[227] = [
                                        _createTextVNode("开始试算", -1)
                                      ]))]),
                                      _: 1
                                    }, 8, ["loading"])
                                  ]),
                                  (mappingPreview.value)
                                    ? (_openBlock(), _createBlock(_component_VAlert, {
                                        key: 0,
                                        type: mappingPreview.value.changes?.length ? 'success' : 'info',
                                        variant: "tonal",
                                        class: "mt-4"
                                      }, {
                                        default: _withCtx(() => [
                                          _createElementVNode("div", null, [
                                            _cache[228] || (_cache[228] = _createTextVNode("输出：", -1)),
                                            _createElementVNode("code", null, _toDisplayString(mappingPreview.value.output), 1)
                                          ]),
                                          _createElementVNode("div", _hoisted_142, "命中 " + _toDisplayString(mappingPreview.value.changes?.length || 0) + " 条规则", 1)
                                        ]),
                                        _: 1
                                      }, 8, ["type"]))
                                    : _createCommentVNode("", true)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]))
                      : _createCommentVNode("", true)
                ]))
              : (_openBlock(), _createElementBlock("section", _hoisted_143, [
                  _createVNode(_component_VCard, { variant: "outlined" }, {
                    default: _withCtx(() => [
                      _createVNode(_component_VCardItem, null, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCardTitle, null, {
                            default: _withCtx(() => [...(_cache[229] || (_cache[229] = [
                              _createTextVNode("覆盖层试算", -1)
                            ]))]),
                            _: 1
                          }),
                          _createVNode(_component_VCardSubtitle, null, {
                            default: _withCtx(() => [...(_cache[230] || (_cache[230] = [
                              _createTextVNode("只运行已保存的插件覆盖规则，不请求 TMDB，也不写整理链。", -1)
                            ]))]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      _createVNode(_component_VCardText, null, {
                        default: _withCtx(() => [
                          _createElementVNode("div", _hoisted_144, [
                            _createVNode(_component_VTextarea, {
                              modelValue: previewTitle.value,
                              "onUpdate:modelValue": _cache[58] || (_cache[58] = $event => ((previewTitle).value = $event)),
                              label: "原标题",
                              rows: "3",
                              "auto-grow": "",
                              "hide-details": ""
                            }, null, 8, ["modelValue"]),
                            _createElementVNode("div", _hoisted_145, [
                              _createVNode(_component_VBtn, {
                                color: "primary",
                                "prepend-icon": "mdi-play",
                                loading: saving.value === 'preview',
                                onClick: previewRules
                              }, {
                                default: _withCtx(() => [...(_cache[231] || (_cache[231] = [
                                  _createTextVNode("开始试算", -1)
                                ]))]),
                                _: 1
                              }, 8, ["loading"])
                            ])
                          ]),
                          (preview.value && !preview.value.changes?.length)
                            ? (_openBlock(), _createBlock(_component_VAlert, {
                                key: 0,
                                type: "info",
                                variant: "tonal",
                                class: "mt-4"
                              }, {
                                default: _withCtx(() => [...(_cache[232] || (_cache[232] = [
                                  _createTextVNode("没有覆盖规则命中；MP 原始解析结果会保持不变。", -1)
                                ]))]),
                                _: 1
                              }))
                            : (preview.value?.changes?.length)
                              ? (_openBlock(), _createBlock(_component_VTable, {
                                  key: 1,
                                  density: "compact",
                                  class: "tools-table mt-4"
                                }, {
                                  default: _withCtx(() => [
                                    _cache[233] || (_cache[233] = _createElementVNode("thead", null, [
                                      _createElementVNode("tr", null, [
                                        _createElementVNode("th", null, "字段"),
                                        _createElementVNode("th", null, "原值"),
                                        _createElementVNode("th", null, "覆盖值"),
                                        _createElementVNode("th", null, "规则")
                                      ])
                                    ], -1)),
                                    _createElementVNode("tbody", null, [
                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(preview.value.changes, (item) => {
                                        return (_openBlock(), _createElementBlock("tr", {
                                          key: item.rule_id
                                        }, [
                                          _createElementVNode("td", null, _toDisplayString(item.field), 1),
                                          _createElementVNode("td", null, _toDisplayString(item.before ?? '空'), 1),
                                          _createElementVNode("td", null, _toDisplayString(item.after ?? '清空'), 1),
                                          _createElementVNode("td", null, _toDisplayString(item.label), 1)
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
                  })
                ])),
    _createVNode(_component_VDialog, {
      modelValue: groupProfileDialog.value,
      "onUpdate:modelValue": _cache[62] || (_cache[62] = $event => ((groupProfileDialog).value = $event)),
      "max-width": "900"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCard, null, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, null, {
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [...(_cache[234] || (_cache[234] = [
                    _createTextVNode("制作组类型与命名字段", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(groupProfileForm.value.display_name) + " · 标准字段、自定义 Jinja 字段共用同一写入策略。", 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx(() => [
                _createVNode(_component_VRow, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VSelect, {
                          modelValue: groupProfileForm.value.kind,
                          "onUpdate:modelValue": _cache[59] || (_cache[59] = $event => ((groupProfileForm.value.kind) = $event)),
                          label: "内容类型",
                          items: kindItems,
                          "hide-details": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VSelect, {
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
                _createVNode(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx(() => [...(_cache[235] || (_cache[235] = [
                    _createTextVNode("处理顺序：制作组标准字段 → ffprobe 的 ", -1),
                    _createElementVNode("code", null, "probe_*", -1),
                    _createTextVNode(" 变量 → 自定义 Jinja 字段计算 → 制作组对自定义字段补充。追加模式会保留已有内容并去重合并；多个合作组给出冲突值时仍会安全跳过。", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VExpansionPanels, {
                  variant: "accordion",
                  multiple: ""
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VExpansionPanel, null, {
                      default: _withCtx(() => [
                        _createVNode(_component_VExpansionPanelTitle, null, {
                          default: _withCtx(() => [...(_cache[236] || (_cache[236] = [
                            _createTextVNode("MP 标准命名字段", -1)
                          ]))]),
                          _: 1
                        }),
                        _createVNode(_component_VExpansionPanelText, null, {
                          default: _withCtx(() => [
                            _createElementVNode("div", _hoisted_146, [
                              (_openBlock(), _createElementBlock(_Fragment, null, _renderList(supplementFieldItems, (item) => {
                                return _createVNode(_component_VTextField, {
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
                      ? (_openBlock(), _createBlock(_component_VExpansionPanel, { key: 0 }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VExpansionPanelTitle, null, {
                              default: _withCtx(() => [
                                _createTextVNode("用户自定义 Jinja 字段（" + _toDisplayString(customFields.value.length) + "）", 1)
                              ]),
                              _: 1
                            }),
                            _createVNode(_component_VExpansionPanelText, null, {
                              default: _withCtx(() => [
                                _createElementVNode("div", _hoisted_147, [
                                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(customFields.value, (item) => {
                                    return (_openBlock(), _createBlock(_component_VTextField, {
                                      key: item.key,
                                      modelValue: groupProfileForm.value.custom_field_values[item.key],
                                      "onUpdate:modelValue": $event => ((groupProfileForm.value.custom_field_values[item.key]) = $event),
                                      label: `${item.label || item.key}（${item.key}）`,
                                      clearable: "",
                                      "hide-details": ""
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "label"]))
                                  }), 128))
                                ]),
                                _cache[237] || (_cache[237] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mt-3" }, "这里填的是该制作组对字段的固定补充值；字段本身的 Jinja 表达式仍在“命名规则 → 自定义字段”维护。", -1))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx(() => [
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[61] || (_cache[61] = $event => (groupProfileDialog.value = false))
                }, {
                  default: _withCtx(() => [...(_cache[238] || (_cache[238] = [
                    _createTextVNode("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  "prepend-icon": "mdi-content-save",
                  loading: saving.value === 'group-profile',
                  onClick: saveGroupProfile
                }, {
                  default: _withCtx(() => [...(_cache[239] || (_cache[239] = [
                    _createTextVNode("保存设置", -1)
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
      modelValue: fieldDetailDialog.value,
      "onUpdate:modelValue": _cache[66] || (_cache[66] = $event => ((fieldDetailDialog).value = $event)),
      "max-width": "920",
      scrollable: ""
    }, {
      default: _withCtx(() => [
        (fieldDetail.value)
          ? (_openBlock(), _createBlock(_component_VCard, { key: 0 }, {
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
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(fieldDetail.value.label), 1)
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCardSubtitle, null, {
                      default: _withCtx(() => [
                        _createElementVNode("code", null, _toDisplayString(fieldDetail.value.key), 1),
                        _createTextVNode(" · " + _toDisplayString(fieldDetail.value.source_label || '命名字段'), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode(_component_VDivider),
                _createVNode(_component_VCardText, { class: "field-detail-body" }, {
                  default: _withCtx(() => [
                    _createElementVNode("div", _hoisted_148, [
                      _createVNode(_component_VChip, {
                        size: "small",
                        color: fieldSourceColor(fieldDetail.value.source),
                        variant: "tonal"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(fieldDetail.value.source_label), 1)
                        ]),
                        _: 1
                      }, 8, ["color"]),
                      _createVNode(_component_VChip, {
                        size: "small",
                        variant: "tonal"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(fieldDetail.value.type || '文本'), 1)
                        ]),
                        _: 1
                      }),
                      _createVNode(_component_VChip, {
                        size: "small",
                        variant: "tonal"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(fieldDetail.value.availability || '按上下文可用'), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _createVNode(_component_VAlert, {
                      type: fieldDetail.value.template_usage === 'custom_dependency' ? 'warning' : 'success',
                      variant: "tonal",
                      density: "compact"
                    }, {
                      default: _withCtx(() => [
                        _createElementVNode("strong", null, _toDisplayString(fieldDetail.value.template_usage_label || '可直接用于 MP 命名模板'), 1),
                        _createElementVNode("div", _hoisted_149, _toDisplayString(fieldDetail.value.template_usage_detail || '可直接复制下方变量写入 MoviePilot 命名模板。'), 1)
                      ]),
                      _: 1
                    }, 8, ["type"]),
                    _createElementVNode("div", _hoisted_150, [
                      _cache[240] || (_cache[240] = _createElementVNode("div", { class: "field-detail-title" }, "用途", -1)),
                      _createElementVNode("div", null, _toDisplayString(fieldDetail.value.description), 1)
                    ]),
                    _createElementVNode("div", _hoisted_151, [
                      _cache[241] || (_cache[241] = _createElementVNode("div", { class: "field-detail-title" }, "可能值与格式", -1)),
                      _createElementVNode("div", null, _toDisplayString(fieldDetail.value.values || '具体值由当前命名上下文决定。'), 1)
                    ]),
                    _createElementVNode("div", _hoisted_152, [
                      _cache[242] || (_cache[242] = _createElementVNode("div", { class: "field-detail-title" }, "生成逻辑 / 使用注意", -1)),
                      _createElementVNode("div", null, _toDisplayString(fieldDetail.value.logic || '使用前建议判断字段是否为空。'), 1)
                    ]),
                    _createElementVNode("div", _hoisted_153, [
                      _cache[243] || (_cache[243] = _createElementVNode("div", { class: "field-detail-title" }, "Jinja2 写法", -1)),
                      _createElementVNode("code", _hoisted_154, _toDisplayString(variableSyntax(fieldDetail.value.key)), 1)
                    ]),
                    (fieldDetailPresetRules.value.length)
                      ? (_openBlock(), _createBlock(_component_VExpansionPanels, {
                          key: 0,
                          variant: "accordion"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VExpansionPanel, null, {
                              default: _withCtx(() => [
                                _createVNode(_component_VExpansionPanelTitle, null, {
                                  default: _withCtx(() => [
                                    _createElementVNode("div", null, [
                                      _cache[244] || (_cache[244] = _createElementVNode("div", { class: "font-weight-medium" }, "当前 MP 已加载的识别预设", -1)),
                                      _createElementVNode("div", _hoisted_155, _toDisplayString(fieldDetailPresetRules.value.length) + " 条；展示当前实例实际生效的内置词、正则和插件覆盖", 1)
                                    ])
                                  ]),
                                  _: 1
                                }),
                                _createVNode(_component_VExpansionPanelText, null, {
                                  default: _withCtx(() => [
                                    _createElementVNode("div", _hoisted_156, [
                                      _createVNode(_component_VTable, {
                                        density: "compact",
                                        class: "preset-table"
                                      }, {
                                        default: _withCtx(() => [
                                          _cache[245] || (_cache[245] = _createElementVNode("thead", null, [
                                            _createElementVNode("tr", null, [
                                              _createElementVNode("th", null, "名称"),
                                              _createElementVNode("th", null, "匹配词 / 正则"),
                                              _createElementVNode("th", null, "输出值"),
                                              _createElementVNode("th", null, "来源")
                                            ])
                                          ], -1)),
                                          _createElementVNode("tbody", null, [
                                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(visibleFieldPresetRules.value, (rule) => {
                                              return (_openBlock(), _createElementBlock("tr", {
                                                key: rule.id
                                              }, [
                                                _createElementVNode("td", null, _toDisplayString(rule.label), 1),
                                                _createElementVNode("td", null, [
                                                  _createElementVNode("code", null, _toDisplayString(rule.pattern), 1)
                                                ]),
                                                _createElementVNode("td", null, [
                                                  _createElementVNode("code", null, _toDisplayString(rule.value), 1)
                                                ]),
                                                _createElementVNode("td", null, [
                                                  _createVNode(_component_VChip, {
                                                    size: "x-small",
                                                    color: rule.overridden ? 'warning' : 'default',
                                                    variant: "tonal"
                                                  }, {
                                                    default: _withCtx(() => [
                                                      _createTextVNode(_toDisplayString(rule.source_label), 1),
                                                      (rule.overridden)
                                                        ? (_openBlock(), _createElementBlock("span", _hoisted_157, " · 已覆盖"))
                                                        : _createCommentVNode("", true)
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
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_158, [
                                          _createVNode(_component_VBtn, {
                                            variant: "tonal",
                                            size: "small",
                                            onClick: _cache[63] || (_cache[63] = $event => (fieldPresetLimit.value += 80))
                                          }, {
                                            default: _withCtx(() => [
                                              _createTextVNode("再显示 " + _toDisplayString(Math.min(80, fieldDetailPresetRules.value.length - visibleFieldPresetRules.value.length)) + " 条", 1)
                                            ]),
                                            _: 1
                                          })
                                        ]))
                                      : _createCommentVNode("", true)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                _createVNode(_component_VDivider),
                _createVNode(_component_VCardActions, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VBtn, {
                      color: "primary",
                      variant: "tonal",
                      "prepend-icon": "mdi-content-copy",
                      onClick: _cache[64] || (_cache[64] = $event => (copyVariable(fieldDetail.value.key)))
                    }, {
                      default: _withCtx(() => [...(_cache[246] || (_cache[246] = [
                        _createTextVNode("复制变量", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode(_component_VSpacer),
                    _createVNode(_component_VBtn, {
                      variant: "text",
                      onClick: _cache[65] || (_cache[65] = $event => (fieldDetailDialog.value = false))
                    }, {
                      default: _withCtx(() => [...(_cache[247] || (_cache[247] = [
                        _createTextVNode("关闭", -1)
                      ]))]),
                      _: 1
                    })
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
      modelValue: dialog.value,
      "onUpdate:modelValue": _cache[75] || (_cache[75] = $event => ((dialog).value = $event)),
      "max-width": "780"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCard, { class: "rule-dialog-card" }, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, { class: "rule-dialog-header" }, {
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(form.value.source_rule_id ? '编辑 MP 内置规则的插件覆盖' : '新增识别字段覆盖'), 1)
                  ]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [...(_cache[248] || (_cache[248] = [
                    _createTextVNode("保存后立即作用于新进入 MP 识别链的标题；不会修改容器文件。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx(() => [
                _createVNode(_component_VRow, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VSelect, {
                          modelValue: form.value.field,
                          "onUpdate:modelValue": _cache[67] || (_cache[67] = $event => ((form.value.field) = $event)),
                          label: "目标字段",
                          items: fieldItems.value.filter(item => item.value !== 'all'),
                          "hide-details": ""
                        }, null, 8, ["modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VSelect, {
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
                _createVNode(_component_VTextField, {
                  modelValue: form.value.label,
                  "onUpdate:modelValue": _cache[69] || (_cache[69] = $event => ((form.value.label) = $event)),
                  label: "规则名称",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VTextarea, {
                  modelValue: form.value.pattern,
                  "onUpdate:modelValue": _cache[70] || (_cache[70] = $event => ((form.value.pattern) = $event)),
                  label: "匹配正则",
                  rows: "4",
                  "auto-grow": "",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                (form.value.action === 'override')
                  ? (_openBlock(), _createBlock(_component_VTextField, {
                      key: 0,
                      modelValue: form.value.value,
                      "onUpdate:modelValue": _cache[71] || (_cache[71] = $event => ((form.value.value) = $event)),
                      label: "输出值",
                      hint: "可用 {match}、{first_group}、{1} 或命名组如 {bit}",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]))
                  : _createCommentVNode("", true),
                _createVNode(_component_VRow, { align: "center" }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
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
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx(() => [
                        _createElementVNode("div", _hoisted_159, [
                          _cache[249] || (_cache[249] = _createElementVNode("div", null, [
                            _createElementVNode("div", { class: "font-weight-medium" }, "启用规则"),
                            _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "保存后立即参与识别")
                          ], -1)),
                          _createVNode(_component_VSwitch, {
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
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx(() => [
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[74] || (_cache[74] = $event => (dialog.value = false))
                }, {
                  default: _withCtx(() => [...(_cache[250] || (_cache[250] = [
                    _createTextVNode("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'rule',
                  onClick: saveRule
                }, {
                  default: _withCtx(() => [...(_cache[251] || (_cache[251] = [
                    _createTextVNode("保存覆盖", -1)
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
      modelValue: bulkPriorityDialog.value,
      "onUpdate:modelValue": _cache[78] || (_cache[78] = $event => ((bulkPriorityDialog).value = $event)),
      "max-width": "580"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCard, { class: "rule-dialog-card" }, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, { class: "rule-dialog-header" }, {
              prepend: _withCtx(() => [
                _createVNode(_component_VAvatar, {
                  color: "primary",
                  variant: "tonal"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VIcon, { icon: "mdi-format-list-numbered" })
                  ]),
                  _: 1
                })
              ]),
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [...(_cache[252] || (_cache[252] = [
                    _createTextVNode("批量修改筛选结果优先级", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [
                    _createTextVNode("只处理当前搜索、字段和来源共同筛选出的 " + _toDisplayString(rules.value.length) + " 条规则，不受分页影响。", 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx(() => [
                _createVNode(_component_VTextField, {
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
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx(() => [
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[77] || (_cache[77] = $event => (bulkPriorityDialog.value = false))
                }, {
                  default: _withCtx(() => [...(_cache[253] || (_cache[253] = [
                    _createTextVNode("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  "prepend-icon": "mdi-check-all",
                  loading: saving.value === 'bulk-priority',
                  onClick: saveBulkPriority
                }, {
                  default: _withCtx(() => [
                    _createTextVNode("应用到 " + _toDisplayString(rules.value.length) + " 条", 1)
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
    _createVNode(_component_VDialog, {
      modelValue: renameDialog.value,
      "onUpdate:modelValue": _cache[85] || (_cache[85] = $event => ((renameDialog).value = $event)),
      "max-width": "820"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCard, null, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, null, {
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(renameForm.value.original_key ? '编辑自定义命名字段' : '新增自定义命名字段'), 1)
                  ]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [...(_cache[254] || (_cache[254] = [
                    _createTextVNode("字段会作为独立变量加入 MP 的 Jinja2 命名上下文，不覆盖原有字段。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx(() => [
                _createVNode(_component_VRow, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
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
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
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
                _createVNode(_component_VTextarea, {
                  modelValue: renameForm.value.expression,
                  "onUpdate:modelValue": _cache[81] || (_cache[81] = $event => ((renameForm.value.expression) = $event)),
                  label: "字段内容 / Jinja2 表达式",
                  rows: "6",
                  "auto-grow": "",
                  hint: "固定内容直接填写；组合使用 {{ title }}；条件可使用 {% if ... %}...{% endif %}",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VTextField, {
                  modelValue: renameForm.value.fallback,
                  "onUpdate:modelValue": _cache[82] || (_cache[82] = $event => ((renameForm.value.fallback) = $event)),
                  label: "计算失败时的回退值",
                  clearable: ""
                }, null, 8, ["modelValue"]),
                _createElementVNode("div", _hoisted_160, [
                  _cache[255] || (_cache[255] = _createElementVNode("div", null, [
                    _createElementVNode("div", { class: "font-weight-medium" }, "启用字段"),
                    _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "停用后变量不会注入命名模板")
                  ], -1)),
                  _createVNode(_component_VSwitch, {
                    modelValue: renameForm.value.enabled,
                    "onUpdate:modelValue": _cache[83] || (_cache[83] = $event => ((renameForm.value.enabled) = $event)),
                    color: "success",
                    "hide-details": ""
                  }, null, 8, ["modelValue"])
                ]),
                _createVNode(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx(() => [...(_cache[256] || (_cache[256] = [
                    _createTextVNode("MP 命名模板中使用：", -1),
                    _createElementVNode("code", null, "{{ 字段名 }}", -1),
                    _createTextVNode("。目标目录字段在初次渲染后补算，并由插件用同一模板安全重渲染一次。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx(() => [
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[84] || (_cache[84] = $event => (renameDialog.value = false))
                }, {
                  default: _withCtx(() => [...(_cache[257] || (_cache[257] = [
                    _createTextVNode("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'rename-field',
                  onClick: saveRenameField
                }, {
                  default: _withCtx(() => [...(_cache[258] || (_cache[258] = [
                    _createTextVNode("保存字段", -1)
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
      modelValue: groupArrangementDialog.value,
      "onUpdate:modelValue": _cache[95] || (_cache[95] = $event => ((groupArrangementDialog).value = $event)),
      "max-width": "820"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCard, null, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, null, {
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(groupArrangementForm.value.id ? '编辑制作组编排' : '新增制作组编排'), 1)
                  ]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [...(_cache[259] || (_cache[259] = [
                    _createTextVNode("规则针对单个制作组生效，不需要枚举 A+B、B+A 等所有组合。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx(() => [
                _createVNode(_component_VRow, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
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
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
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
                _createVNode(_component_VTextField, {
                  modelValue: groupArrangementForm.value.label,
                  "onUpdate:modelValue": _cache[88] || (_cache[88] = $event => ((groupArrangementForm.value.label) = $event)),
                  label: "规则名称",
                  placeholder: "例如：VCB 固定最后"
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VTextarea, {
                  modelValue: groupArrangementForm.value.aliases,
                  "onUpdate:modelValue": _cache[89] || (_cache[89] = $event => ((groupArrangementForm.value.aliases) = $event)),
                  label: "其它别名（每行一个）",
                  rows: "3",
                  "auto-grow": "",
                  placeholder: "VCB\nVCB Studio",
                  hint: "别名只做单个制作组归一化，不会改 MP 的原始识别词",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VRow, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VSelect, {
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
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "3"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VCombobox, {
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
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "4"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
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
                _createElementVNode("div", _hoisted_161, [
                  _cache[260] || (_cache[260] = _createElementVNode("div", null, [
                    _createElementVNode("div", { class: "font-weight-medium" }, "启用规则"),
                    _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "停用后保留配置但不参与编排")
                  ], -1)),
                  _createVNode(_component_VSwitch, {
                    modelValue: groupArrangementForm.value.enabled,
                    "onUpdate:modelValue": _cache[93] || (_cache[93] = $event => ((groupArrangementForm.value.enabled) = $event)),
                    color: "success",
                    "hide-details": ""
                  }, null, 8, ["modelValue"])
                ]),
                _createVNode(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx(() => [...(_cache[261] || (_cache[261] = [
                    _createTextVNode("示例：全局默认连接符设为 ", -1),
                    _createElementVNode("code", null, "@", -1),
                    _createTextVNode("；VCB-Studio 单独设置“固定最后 + &”，ADWeb 选择“使用默认”，输入 ", -1),
                    _createElementVNode("code", null, "ADWeb@A@VCB", -1),
                    _createTextVNode(" 将得到 ", -1),
                    _createElementVNode("code", null, "A&VCB-Studio@ADWeb", -1),
                    _createTextVNode("。只有一个制作组时不会在开头添加连接符。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx(() => [
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[94] || (_cache[94] = $event => (groupArrangementDialog.value = false))
                }, {
                  default: _withCtx(() => [...(_cache[262] || (_cache[262] = [
                    _createTextVNode("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'group-arrangement',
                  onClick: saveGroupArrangement
                }, {
                  default: _withCtx(() => [...(_cache[263] || (_cache[263] = [
                    _createTextVNode("保存编排", -1)
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
      modelValue: mappingDialog.value,
      "onUpdate:modelValue": _cache[104] || (_cache[104] = $event => ((mappingDialog).value = $event)),
      "max-width": "820"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCard, null, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, null, {
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(mappingForm.value.id ? '编辑最终命名规则' : '新增最终命名规则'), 1)
                  ]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [...(_cache[264] || (_cache[264] = [
                    _createTextVNode("规则处理 MP 模板生成的完整相对路径，并按优先级从高到低连续执行。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardText, { class: "rule-dialog-body" }, {
              default: _withCtx(() => [
                _createVNode(_component_VSelect, {
                  modelValue: mappingForm.value.mode,
                  "onUpdate:modelValue": _cache[96] || (_cache[96] = $event => ((mappingForm.value.mode) = $event)),
                  label: "匹配模式",
                  items: [{title:'字面替换',value:'literal'},{title:'正则替换',value:'regex'}]
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VTextField, {
                  modelValue: mappingForm.value.label,
                  "onUpdate:modelValue": _cache[97] || (_cache[97] = $event => ((mappingForm.value.label) = $event)),
                  label: "规则名称",
                  placeholder: "例如：统一合作字幕组顺序"
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VTextarea, {
                  modelValue: mappingForm.value.pattern,
                  "onUpdate:modelValue": _cache[98] || (_cache[98] = $event => ((mappingForm.value.pattern) = $event)),
                  label: mappingForm.value.mode === 'regex' ? '匹配正则' : '查找文字',
                  rows: "3",
                  "auto-grow": ""
                }, null, 8, ["modelValue", "label"]),
                _createVNode(_component_VTextField, {
                  modelValue: mappingForm.value.replacement,
                  "onUpdate:modelValue": _cache[99] || (_cache[99] = $event => ((mappingForm.value.replacement) = $event)),
                  label: "替换为",
                  hint: "留空表示删除；正则模式支持 Python re.sub 的 \\1 与 \\g<name> 引用",
                  "persistent-hint": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VRow, { align: "center" }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "7"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
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
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "5"
                    }, {
                      default: _withCtx(() => [
                        _createElementVNode("div", _hoisted_162, [
                          _cache[265] || (_cache[265] = _createElementVNode("div", null, [
                            _createElementVNode("div", { class: "font-weight-medium" }, "启用规则"),
                            _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "停用后保留配置但不执行")
                          ], -1)),
                          _createVNode(_component_VSwitch, {
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
                _createVNode(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: _withCtx(() => [...(_cache[266] || (_cache[266] = [
                    _createTextVNode("示例：依次添加 ", -1),
                    _createElementVNode("code", null, "AB/C → ABC", -1),
                    _createTextVNode(" 与 ", -1),
                    _createElementVNode("code", null, ".chi.zh-cn → .chs", -1),
                    _createTextVNode("，输入 ", -1),
                    _createElementVNode("code", null, "AB/C.chi.zh-cn.ass", -1),
                    _createTextVNode(" 会得到 ", -1),
                    _createElementVNode("code", null, "ABC.chs.ass", -1),
                    _createTextVNode("。绝对路径及包含 ", -1),
                    _createElementVNode("code", null, "..", -1),
                    _createTextVNode(" 的危险结果会被拒绝。", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider),
            _createVNode(_component_VCardActions, { class: "rule-dialog-actions" }, {
              default: _withCtx(() => [
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  variant: "text",
                  onClick: _cache[102] || (_cache[102] = $event => (mappingDialog.value = false))
                }, {
                  default: _withCtx(() => [...(_cache[267] || (_cache[267] = [
                    _createTextVNode("取消", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VBtn, {
                  color: "primary",
                  loading: saving.value === 'rename-mapping',
                  onClick: _cache[103] || (_cache[103] = $event => (saveMappingRule()))
                }, {
                  default: _withCtx(() => [...(_cache[268] || (_cache[268] = [
                    _createTextVNode("保存映射", -1)
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
const MetadataTools = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-9c196eb7"]]);

export { MetadataTools as default };
