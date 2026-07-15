import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { S as StrategySettings } from './StrategySettings-DyK8JrVO.js';
import { _ as _export_sfc, c as cloneConfig, m as mediaTypeText, s as scoreColor, u as unwrapResponse } from './utils-qGcEndyN.js';

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
const _hoisted_43 = { class: "text-subtitle-1 font-weight-bold mt-4" };
const _hoisted_44 = { class: "text-body-2 text-medium-emphasis" };

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
              _createElementVNode("div", { class: "text-body-2 hero-subtitle" }, "让失败标题经过可解释的候选选择，再安全回到原生整理链")
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
                value: "parser",
                "prepend-icon": "mdi-puzzle-outline"
              }, {
                default: _withCtx(() => [...(_cache[15] || (_cache[15] = [
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
                        _cache[16] || (_cache[16] = _createElementVNode("div", { class: "text-h6 mb-1" }, "当前决策链", -1)),
                        _cache[17] || (_cache[17] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis mb-5" }, "仅在 MoviePilot 原生识别失败后执行，不改变 Rust 标题提取。", -1)),
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
                                  default: _withCtx(() => [...(_cache[18] || (_cache[18] = [
                                    _createTextVNode("典型降级示例", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VCardSubtitle, null, {
                                  default: _withCtx(() => [...(_cache[19] || (_cache[19] = [
                                    _createTextVNode("搜索词从具体到宽泛", -1)
                                  ]))]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            _createVNode(_component_VCardText, null, {
                              default: _withCtx(() => [
                                _cache[22] || (_cache[22] = _createElementVNode("div", { class: "code-title" }, "Mushoku Tensei: Isekai Ittara Honki Dasu", -1)),
                                _createElementVNode("div", _hoisted_13, [
                                  _createVNode(_component_VIcon, {
                                    icon: "mdi-arrow-down",
                                    size: "18"
                                  })
                                ]),
                                _cache[23] || (_cache[23] = _createElementVNode("div", { class: "code-title code-title-main" }, "Mushoku Tensei", -1)),
                                _createVNode(_component_VDivider, { class: "my-4" }),
                                _createElementVNode("div", _hoisted_14, [
                                  _cache[20] || (_cache[20] = _createElementVNode("span", null, "最低得分", -1)),
                                  _createElementVNode("strong", null, _toDisplayString(config.value.minimum_score), 1)
                                ]),
                                _createElementVNode("div", _hoisted_15, [
                                  _cache[21] || (_cache[21] = _createElementVNode("span", null, "领先分差", -1)),
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
                    default: _withCtx(() => [...(_cache[24] || (_cache[24] = [
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
                                  default: _withCtx(() => [...(_cache[25] || (_cache[25] = [
                                    _createTextVNode("输入失败样本", -1)
                                  ]))]),
                                  _: 1
                                }),
                                _createVNode(_component_VCardSubtitle, null, {
                                  default: _withCtx(() => [...(_cache[26] || (_cache[26] = [
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
                                  default: _withCtx(() => [...(_cache[27] || (_cache[27] = [
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
                                        _cache[28] || (_cache[28] = _createElementVNode("div", { class: "field-label" }, "年份提示", -1)),
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
                                        _cache[29] || (_cache[29] = _createElementVNode("div", { class: "field-label" }, "类型提示", -1)),
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
                                        _cache[30] || (_cache[30] = _createElementVNode("div", { class: "field-label" }, "季提示", -1)),
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
                                        _cache[31] || (_cache[31] = _createElementVNode("div", { class: "field-label" }, "集提示", -1)),
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
                                  default: _withCtx(() => [...(_cache[32] || (_cache[32] = [
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
                                    _cache[34] || (_cache[34] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mb-2" }, "实际搜索词", -1)),
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
                                            _cache[33] || (_cache[33] = _createElementVNode("thead", null, [
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
                              _cache[35] || (_cache[35] = _createElementVNode("div", { class: "text-h6 mt-3" }, "等待一次试跑", -1)),
                              _cache[36] || (_cache[36] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "结果会解释为何接纳或拒绝每个候选", -1))
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
                  _cache[38] || (_cache[38] = _createElementVNode("div", null, [
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
                    default: _withCtx(() => [...(_cache[37] || (_cache[37] = [
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
                          }, [...(_cache[39] || (_cache[39] = [
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
                      _cache[40] || (_cache[40] = _createElementVNode("div", { class: "text-h6 mt-3" }, "尚无运行记录", -1))
                    ]))
              ])
            ], 512), [
              [_vShow, tab.value === 'history']
            ]),
            _withDirectives(_createElementVNode("section", _hoisted_41, [
              _createElementVNode("div", _hoisted_42, [
                _createVNode(_component_VAlert, {
                  type: "info",
                  variant: "tonal",
                  icon: "mdi-language-rust"
                }, {
                  default: _withCtx(() => [...(_cache[41] || (_cache[41] = [
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
                                  _createElementVNode("div", _hoisted_43, _toDisplayString(item[0]), 1),
                                  _createElementVNode("div", _hoisted_44, _toDisplayString(item[1]), 1),
                                  _createVNode(_component_VChip, {
                                    class: "mt-4",
                                    size: "small",
                                    variant: "tonal"
                                  }, {
                                    default: _withCtx(() => [...(_cache[42] || (_cache[42] = [
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
const AppPage = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-1d9a6b83"]]);

export { AppPage as default };
