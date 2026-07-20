import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { _ as _export_sfc } from './utils-DKLBthcF.js';

const {resolveComponent:_resolveComponent$1,createVNode:_createVNode$1,withCtx:_withCtx$1,toDisplayString:_toDisplayString$1,createElementVNode:_createElementVNode$1,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1,createCommentVNode:_createCommentVNode$1,renderSlot:_renderSlot} = await importShared('vue');


const _hoisted_1$1 = { class: "module-header" };
const _hoisted_2$1 = { class: "module-header__main" };
const _hoisted_3$1 = { class: "module-header__identity" };
const _hoisted_4$1 = { class: "module-header__copy" };
const _hoisted_5$1 = { key: 0 };
const _hoisted_6$1 = {
  key: 0,
  class: "module-header__actions"
};
const _hoisted_7$1 = {
  key: 0,
  class: "module-header__controls"
};


const _sfc_main$1 = {
  __name: 'ModuleHeader',
  props: {
  icon: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  color: { type: String, default: 'primary' },
},
  setup(__props) {



return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent$1("VIcon");
  const _component_VAvatar = _resolveComponent$1("VAvatar");

  return (_openBlock$1(), _createElementBlock$1("section", _hoisted_1$1, [
    _createElementVNode$1("div", _hoisted_2$1, [
      _createElementVNode$1("div", _hoisted_3$1, [
        _createVNode$1(_component_VAvatar, {
          color: __props.color,
          variant: "tonal",
          size: "44",
          class: "module-header__icon"
        }, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VIcon, {
              icon: __props.icon,
              size: "23"
            }, null, 8, ["icon"])
          ]),
          _: 1
        }, 8, ["color"]),
        _createElementVNode$1("div", _hoisted_4$1, [
          _createElementVNode$1("h2", null, _toDisplayString$1(__props.title), 1),
          (__props.subtitle)
            ? (_openBlock$1(), _createElementBlock$1("p", _hoisted_5$1, _toDisplayString$1(__props.subtitle), 1))
            : _createCommentVNode$1("", true)
        ])
      ]),
      (_ctx.$slots.actions)
        ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_6$1, [
            _renderSlot(_ctx.$slots, "actions", {}, undefined, true)
          ]))
        : _createCommentVNode$1("", true)
    ]),
    (_ctx.$slots.controls)
      ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_7$1, [
          _renderSlot(_ctx.$slots, "controls", {}, undefined, true)
        ]))
      : _createCommentVNode$1("", true)
  ]))
}
}

};
const ModuleHeader = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-d0f26125"]]);

const {createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,createVNode:_createVNode,Fragment:_Fragment,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,createBlock:_createBlock,createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,withModifiers:_withModifiers,renderList:_renderList} = await importShared('vue');


const _hoisted_1 = { class: "strategy-settings" };
const _hoisted_2 = { class: "quick-options-grid" };
const _hoisted_3 = { class: "toggle-item" };
const _hoisted_4 = { class: "toggle-item" };
const _hoisted_5 = { class: "toggle-item" };
const _hoisted_6 = { class: "toggle-item" };
const _hoisted_7 = { class: "toggle-item" };
const _hoisted_8 = { class: "toggle-item" };
const _hoisted_9 = { class: "toggle-item" };
const _hoisted_10 = { class: "toggle-item" };
const _hoisted_11 = { class: "toggle-item" };
const _hoisted_12 = {
  key: 0,
  class: "web-fallback-box mt-3"
};
const _hoisted_13 = { class: "weighted-options-grid mt-3" };
const _hoisted_14 = { class: "evidence-box" };
const _hoisted_15 = { class: "evidence-head" };
const _hoisted_16 = { class: "compact-slider" };
const _hoisted_17 = { class: "evidence-box" };
const _hoisted_18 = { class: "evidence-head" };
const _hoisted_19 = { class: "compact-slider" };
const _hoisted_20 = { class: "panel-title" };
const _hoisted_21 = { class: "panel-title" };
const _hoisted_22 = { class: "slider-label" };
const _hoisted_23 = { class: "slider-label" };
const _hoisted_24 = { class: "panel-title" };
const _hoisted_25 = { class: "panel-toolbar" };
const _hoisted_26 = { class: "weight-box" };
const _hoisted_27 = { class: "weight-head" };
const _hoisted_28 = { class: "panel-title" };

const {computed} = await importShared('vue');


const _sfc_main = {
  __name: 'StrategySettings',
  props: {
  modelValue: { type: Object, required: true },
  compact: { type: Boolean, default: false },
  showModuleSwitches: { type: Boolean, default: true },
},
  emits: ['update:modelValue'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;
const config = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});

const weightTotal = computed(() => [
  'token_weight', 'similarity_weight', 'prefix_weight', 'rank_weight', 'query_confidence_weight', 'anchor_weight', 'year_weight', 'type_weight',
  'seasonal_evidence_weight', 'recognition_memory_weight',
].reduce((sum, key) => sum + Number(config.value[key] || 0), 0));

const tmdbFirstMode = computed(() => config.value.recognition_mode === 'tmdb_first');

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
  });
}

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VBtnToggle = _resolveComponent("VBtnToggle");
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent("VCardSubtitle");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VSelect = _resolveComponent("VSelect");
  const _component_VCol = _resolveComponent("VCol");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VRow = _resolveComponent("VRow");
  const _component_VExpandTransition = _resolveComponent("VExpandTransition");
  const _component_VSlider = _resolveComponent("VSlider");
  const _component_VExpansionPanelTitle = _resolveComponent("VExpansionPanelTitle");
  const _component_VCombobox = _resolveComponent("VCombobox");
  const _component_VExpansionPanelText = _resolveComponent("VExpansionPanelText");
  const _component_VExpansionPanel = _resolveComponent("VExpansionPanel");
  const _component_VExpansionPanels = _resolveComponent("VExpansionPanels");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode(ModuleHeader, {
      icon: "mdi-database-search-outline",
      title: "候选选择策略",
      subtitle: "先选择决策模式，再按需要展开安全阈值和高级参数。"
    }, {
      actions: _withCtx(() => [
        _createVNode(_component_VBtnToggle, {
          modelValue: config.value.recognition_mode,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((config.value.recognition_mode) = $event)),
          mandatory: "",
          color: "primary",
          variant: "outlined",
          density: "comfortable",
          class: "mode-toggle"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VBtn, {
              value: "tmdb_first",
              "prepend-icon": "mdi-numeric-1-circle-outline"
            }, {
              default: _withCtx(() => [...(_cache[36] || (_cache[36] = [
                _createTextVNode("首结果", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VBtn, {
              value: "scored",
              "prepend-icon": "mdi-scale-balance"
            }, {
              default: _withCtx(() => [...(_cache[37] || (_cache[37] = [
                _createTextVNode("评分模式", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _createVNode(_component_VAlert, {
      type: tmdbFirstMode.value ? 'success' : 'info',
      variant: "tonal",
      density: "compact",
      class: "mode-summary"
    }, {
      default: _withCtx(() => [
        (tmdbFirstMode.value)
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              _createTextVNode("只搜索一次完整标题，通常采用 TMDB 首个影视结果；近期季度、识别记忆和人工优先名单可以在候选内调整顺序。")
            ], 64))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
              _createTextVNode("综合标题、别名、年份、类型和上下文评分，并通过最低分与领先分差控制是否接管。")
            ], 64))
      ]),
      _: 1
    }, 8, ["type"]),
    (__props.showModuleSwitches)
      ? (_openBlock(), _createBlock(_component_VCard, {
          key: 0,
          variant: "outlined",
          class: "setting-card mb-4"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VCardText, { class: "module-switches" }, {
              default: _withCtx(() => [
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.enabled,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((config.value.enabled) = $event)),
                  color: "primary",
                  label: "插件总开关",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.recognizer_enabled,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config.value.recognizer_enabled) = $event)),
                  color: "primary",
                  label: "TMDB 搜索增强",
                  "hide-details": ""
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.episode_normalizer_enabled,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.value.episode_normalizer_enabled) = $event)),
                  color: "success",
                  label: "集数偏移",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    _createVNode(_component_VCard, {
      variant: "outlined",
      class: "setting-card main-strategy-card mb-4"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCardItem, null, {
          prepend: _withCtx(() => [
            _createVNode(_component_VIcon, {
              icon: "mdi-text-search",
              color: "primary"
            })
          ]),
          default: _withCtx(() => [
            _createVNode(_component_VCardTitle, null, {
              default: _withCtx(() => [...(_cache[38] || (_cache[38] = [
                _createTextVNode("识别依据与搜索策略", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VCardSubtitle, null, {
              default: _withCtx(() => [...(_cache[39] || (_cache[39] = [
                _createTextVNode("集中设置标题来源、降级搜索和辅助证据", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode(_component_VCardText, null, {
          default: _withCtx(() => [
            _createElementVNode("div", _hoisted_2, [
              _createElementVNode("div", _hoisted_3, [
                _cache[40] || (_cache[40] = _createElementVNode("div", null, [
                  _createElementVNode("strong", null, "优先使用 MP 解析标题"),
                  _createElementVNode("small", null, "复用识别词和解析器处理后的主体名称")
                ], -1)),
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.prefer_parsed_title,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.prefer_parsed_title) = $event)),
                  color: "primary",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ]),
              _createElementVNode("div", _hoisted_4, [
                _cache[41] || (_cache[41] = _createElementVNode("div", null, [
                  _createElementVNode("strong", null, "使用年份提示"),
                  _createElementVNode("small", null, "标题带年份时参与候选筛选与评分")
                ], -1)),
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.use_year_hint,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config.value.use_year_hint) = $event)),
                  color: "primary",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ]),
              _createElementVNode("div", _hoisted_5, [
                _cache[42] || (_cache[42] = _createElementVNode("div", null, [
                  _createElementVNode("strong", null, "原标题交叉验证"),
                  _createElementVNode("small", null, "确认降级结果仍与未缩减标题相关")
                ], -1)),
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.use_original_title_evidence,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((config.value.use_original_title_evidence) = $event)),
                  color: "primary",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ]),
              _createElementVNode("div", _hoisted_6, [
                _createElementVNode("div", null, [
                  _cache[43] || (_cache[43] = _createElementVNode("strong", null, "拉取别名与译名", -1)),
                  _createElementVNode("small", null, _toDisplayString(tmdbFirstMode.value ? '用于展示和诊断，不改变首结果评分' : '用于标题、译名和罗马音交叉验证'), 1)
                ]),
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.fetch_aliases,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((config.value.fetch_aliases) = $event)),
                  color: "primary",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ]),
              _createElementVNode("div", _hoisted_7, [
                _cache[44] || (_cache[44] = _createElementVNode("div", null, [
                  _createElementVNode("strong", null, "使用 MP 共享识别"),
                  _createElementVNode("small", null, "TMDB 两路直搜均无候选时，查询 MoviePilot 中央共享结果")
                ], -1)),
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.shared_recognition_enabled,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((config.value.shared_recognition_enabled) = $event)),
                  color: "primary",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ]),
              (!tmdbFirstMode.value)
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                    _createElementVNode("div", _hoisted_8, [
                      _cache[45] || (_cache[45] = _createElementVNode("div", null, [
                        _createElementVNode("strong", null, "主体名称降级"),
                        _createElementVNode("small", null, "例如 Mushoku Tensei: … → Mushoku Tensei")
                      ], -1)),
                      _createVNode(_component_VSwitch, {
                        modelValue: config.value.main_title_fallback,
                        "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((config.value.main_title_fallback) = $event)),
                        color: "primary",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ]),
                    _createElementVNode("div", _hoisted_9, [
                      _cache[46] || (_cache[46] = _createElementVNode("div", null, [
                        _createElementVNode("strong", null, "逐词缩短"),
                        _createElementVNode("small", null, "每次缩短仍须通过原标题锚点验证")
                      ], -1)),
                      _createVNode(_component_VSwitch, {
                        modelValue: config.value.progressive_fallback,
                        "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((config.value.progressive_fallback) = $event)),
                        color: "warning",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ]),
                    _createElementVNode("div", _hoisted_10, [
                      _cache[47] || (_cache[47] = _createElementVNode("div", null, [
                        _createElementVNode("strong", null, "搜索引擎交叉验证"),
                        _createElementVNode("small", null, "只接受指向具体 TMDB 条目的直链证据")
                      ], -1)),
                      _createVNode(_component_VSwitch, {
                        modelValue: config.value.web_search_fallback,
                        "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((config.value.web_search_fallback) = $event)),
                        color: "warning",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ])
                  ], 64))
                : _createCommentVNode("", true),
              _createElementVNode("div", _hoisted_11, [
                _cache[48] || (_cache[48] = _createElementVNode("div", null, [
                  _createElementVNode("strong", null, "制作组辅助验证"),
                  _createElementVNode("small", null, "已分类制作组直接排除动画或真人冲突候选；未分类时不参与")
                ], -1)),
                _createVNode(_component_VSwitch, {
                  modelValue: config.value.release_group_assist_enabled,
                  "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((config.value.release_group_assist_enabled) = $event)),
                  color: "success",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ])
            ]),
            _createVNode(_component_VExpandTransition, null, {
              default: _withCtx(() => [
                (!tmdbFirstMode.value && config.value.web_search_fallback)
                  ? (_openBlock(), _createElementBlock("div", _hoisted_12, [
                      _createVNode(_component_VAlert, {
                        type: "warning",
                        variant: "tonal",
                        density: "compact",
                        class: "mb-3"
                      }, {
                        default: _withCtx(() => [...(_cache[49] || (_cache[49] = [
                          _createTextVNode("自动模式固定使用 DuckDuckGo；只有 TMDB 直链与原标题或候选别名共现时才形成证据。", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode(_component_VRow, { dense: "" }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCol, {
                            cols: "12",
                            md: "4"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSelect, {
                                modelValue: config.value.web_search_engine,
                                "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((config.value.web_search_engine) = $event)),
                                items: [
                { title: '自动选择', value: 'auto' }, { title: 'DuckDuckGo', value: 'duckduckgo' },
                { title: 'Google', value: 'google' }, { title: 'Brave', value: 'brave' },
                { title: 'Yahoo', value: 'yahoo' }, { title: 'Yandex', value: 'yandex' }, { title: 'Mojeek', value: 'mojeek' },
              ],
                                density: "compact",
                                label: "搜索引擎",
                                "hide-details": ""
                              }, null, 8, ["modelValue"])
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCol, {
                            cols: "6",
                            md: "2"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VTextField, {
                                modelValue: config.value.web_search_max_results,
                                "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((config.value.web_search_max_results) = $event)),
                                modelModifiers: { number: true },
                                density: "compact",
                                type: "number",
                                min: "3",
                                max: "15",
                                label: "最多结果",
                                "hide-details": ""
                              }, null, 8, ["modelValue"])
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCol, {
                            cols: "6",
                            md: "2"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VTextField, {
                                modelValue: config.value.web_search_timeout,
                                "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((config.value.web_search_timeout) = $event)),
                                modelModifiers: { number: true },
                                density: "compact",
                                type: "number",
                                min: "5",
                                max: "30",
                                label: "超时",
                                suffix: "秒",
                                "hide-details": ""
                              }, null, 8, ["modelValue"])
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCol, {
                            cols: "12",
                            md: "4"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VTextField, {
                                modelValue: config.value.web_search_min_evidence,
                                "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((config.value.web_search_min_evidence) = $event)),
                                modelModifiers: { number: true },
                                density: "compact",
                                type: "number",
                                min: "50",
                                max: "100",
                                label: "最低证据分",
                                hint: "建议不低于 78",
                                "persistent-hint": ""
                              }, null, 8, ["modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]))
                  : _createCommentVNode("", true)
              ]),
              _: 1
            }),
            _createElementVNode("div", _hoisted_13, [
              _createElementVNode("div", _hoisted_14, [
                _createElementVNode("div", _hoisted_15, [
                  _cache[50] || (_cache[50] = _createElementVNode("div", null, [
                    _createElementVNode("strong", null, "近期季度动画"),
                    _createElementVNode("small", null, "兼顾当前季、跨季连载和上一季补整")
                  ], -1)),
                  _createVNode(_component_VSwitch, {
                    modelValue: config.value.seasonal_evidence_enabled,
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((config.value.seasonal_evidence_enabled) = $event)),
                    color: "primary",
                    "hide-details": ""
                  }, null, 8, ["modelValue"])
                ]),
                _createVNode(_component_VSelect, {
                  modelValue: config.value.seasonal_evidence_quarters,
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((config.value.seasonal_evidence_quarters) = $event)),
                  modelModifiers: { number: true },
                  items: [
              { title: '仅当前季度', value: 1 },
              { title: '当前 + 上一季度（推荐）', value: 2 },
              { title: '最近三个季度', value: 3 },
              { title: '最近四个季度', value: 4 },
            ],
                  label: "证据窗口",
                  density: "compact",
                  "hide-details": "",
                  disabled: !config.value.seasonal_evidence_enabled
                }, null, 8, ["modelValue", "disabled"]),
                _createElementVNode("div", _hoisted_16, [
                  _cache[51] || (_cache[51] = _createElementVNode("span", null, "影响强度", -1)),
                  _createVNode(_component_VSlider, {
                    modelValue: config.value.seasonal_evidence_weight,
                    "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((config.value.seasonal_evidence_weight) = $event)),
                    min: 0,
                    max: 40,
                    step: 1,
                    color: "primary",
                    "hide-details": "",
                    disabled: !config.value.seasonal_evidence_enabled
                  }, null, 8, ["modelValue", "disabled"]),
                  _createElementVNode("strong", null, _toDisplayString(config.value.seasonal_evidence_weight), 1)
                ])
              ]),
              _createElementVNode("div", _hoisted_17, [
                _createElementVNode("div", _hoisted_18, [
                  _cache[52] || (_cache[52] = _createElementVNode("div", null, [
                    _createElementVNode("strong", null, "近期重复命中"),
                    _createElementVNode("small", null, "只统计正式整理中的不同文件")
                  ], -1)),
                  _createVNode(_component_VSwitch, {
                    modelValue: config.value.recognition_memory_enabled,
                    "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((config.value.recognition_memory_enabled) = $event)),
                    color: "secondary",
                    "hide-details": ""
                  }, null, 8, ["modelValue"])
                ]),
                _createElementVNode("div", _hoisted_19, [
                  _cache[53] || (_cache[53] = _createElementVNode("span", null, "影响强度", -1)),
                  _createVNode(_component_VSlider, {
                    modelValue: config.value.recognition_memory_weight,
                    "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((config.value.recognition_memory_weight) = $event)),
                    min: 0,
                    max: 40,
                    step: 1,
                    color: "secondary",
                    "hide-details": "",
                    disabled: !config.value.recognition_memory_enabled
                  }, null, 8, ["modelValue", "disabled"]),
                  _createElementVNode("strong", null, _toDisplayString(config.value.recognition_memory_weight), 1)
                ]),
                _createVNode(_component_VRow, {
                  dense: "",
                  class: "mt-1"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, { cols: "6" }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
                          modelValue: config.value.recognition_memory_min_hits,
                          "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((config.value.recognition_memory_min_hits) = $event)),
                          modelModifiers: { number: true },
                          density: "compact",
                          "hide-details": "",
                          type: "number",
                          min: "2",
                          max: "10",
                          label: "生效文件数",
                          suffix: "个",
                          disabled: !config.value.recognition_memory_enabled
                        }, null, 8, ["modelValue", "disabled"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCol, { cols: "6" }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
                          modelValue: config.value.recognition_memory_ttl_days,
                          "onUpdate:modelValue": _cache[23] || (_cache[23] = $event => ((config.value.recognition_memory_ttl_days) = $event)),
                          modelModifiers: { number: true },
                          density: "compact",
                          "hide-details": "",
                          type: "number",
                          min: "1",
                          max: "90",
                          label: "保存时间",
                          suffix: "天",
                          disabled: !config.value.recognition_memory_enabled
                        }, null, 8, ["modelValue", "disabled"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ])
            ])
          ]),
          _: 1
        })
      ]),
      _: 1
    }),
    _createVNode(_component_VExpansionPanels, {
      multiple: "",
      variant: "accordion",
      class: "advanced-panels"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VExpansionPanel, { value: "candidate-policy" }, {
          default: _withCtx(() => [
            _createVNode(_component_VExpansionPanelTitle, null, {
              default: _withCtx(() => [
                _createElementVNode("div", _hoisted_20, [
                  _createVNode(_component_VIcon, {
                    icon: "mdi-playlist-star",
                    color: "primary"
                  }),
                  _createElementVNode("div", null, [
                    _cache[54] || (_cache[54] = _createElementVNode("strong", null, "TMDB 人工候选规则", -1)),
                    _createElementVNode("small", null, "排除 " + _toDisplayString(config.value.tmdb_exclude_ids?.length || 0) + " 个 · 优先 " + _toDisplayString(config.value.tmdb_prefer_ids?.length || 0) + " 个", 1)
                  ])
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
                  class: "mb-4"
                }, {
                  default: _withCtx(() => [...(_cache[55] || (_cache[55] = [
                    _createTextVNode("只作用于本次搜索实际返回的候选。排除先执行；优先名单命中后直接选择，多个优先 ID 按填写顺序。MP 共享识别是中央只读服务，不能在插件内编辑；需要人工纠错时请使用这里的名单。", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VRow, { dense: "" }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VCombobox, {
                          modelValue: config.value.tmdb_exclude_ids,
                          "onUpdate:modelValue": _cache[24] || (_cache[24] = $event => ((config.value.tmdb_exclude_ids) = $event)),
                          multiple: "",
                          chips: "",
                          "closable-chips": "",
                          clearable: "",
                          label: "TMDB 排除名单",
                          placeholder: "输入 ID 后按回车",
                          hint: "在评分、排序和分差前移除；冲突时排除优先",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCol, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VCombobox, {
                          modelValue: config.value.tmdb_prefer_ids,
                          "onUpdate:modelValue": _cache[25] || (_cache[25] = $event => ((config.value.tmdb_prefer_ids) = $event)),
                          multiple: "",
                          chips: "",
                          "closable-chips": "",
                          clearable: "",
                          label: "TMDB 优先名单",
                          placeholder: "输入 ID 后按回车",
                          hint: "候选中出现指定 ID 时直接采用；越靠前越优先",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
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
        }),
        (!tmdbFirstMode.value)
          ? (_openBlock(), _createBlock(_component_VExpansionPanel, {
              key: 0,
              value: "thresholds"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VExpansionPanelTitle, null, {
                  default: _withCtx(() => [
                    _createElementVNode("div", _hoisted_21, [
                      _createVNode(_component_VIcon, {
                        icon: "mdi-shield-star-outline",
                        color: "success"
                      }),
                      _createElementVNode("div", null, [
                        _cache[56] || (_cache[56] = _createElementVNode("strong", null, "接纳门槛与搜索规模", -1)),
                        _createElementVNode("small", null, "最低 " + _toDisplayString(config.value.minimum_score) + " 分 · 领先 " + _toDisplayString(config.value.minimum_margin) + " 分 · 最多 " + _toDisplayString(config.value.max_queries) + " 个搜索词", 1)
                      ])
                    ])
                  ]),
                  _: 1
                }),
                _createVNode(_component_VExpansionPanelText, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VRow, null, {
                      default: _withCtx(() => [
                        _createVNode(_component_VCol, {
                          cols: "12",
                          md: "6"
                        }, {
                          default: _withCtx(() => [
                            _createElementVNode("div", _hoisted_22, [
                              _cache[57] || (_cache[57] = _createElementVNode("span", null, "最低得分", -1)),
                              _createElementVNode("strong", null, _toDisplayString(config.value.minimum_score), 1)
                            ]),
                            _createVNode(_component_VSlider, {
                              modelValue: config.value.minimum_score,
                              "onUpdate:modelValue": _cache[26] || (_cache[26] = $event => ((config.value.minimum_score) = $event)),
                              min: 40,
                              max: 95,
                              step: 1,
                              color: "primary",
                              "thumb-label": ""
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        _createVNode(_component_VCol, {
                          cols: "12",
                          md: "6"
                        }, {
                          default: _withCtx(() => [
                            _createElementVNode("div", _hoisted_23, [
                              _cache[58] || (_cache[58] = _createElementVNode("span", null, "第一名领先分差", -1)),
                              _createElementVNode("strong", null, _toDisplayString(config.value.minimum_margin), 1)
                            ]),
                            _createVNode(_component_VSlider, {
                              modelValue: config.value.minimum_margin,
                              "onUpdate:modelValue": _cache[27] || (_cache[27] = $event => ((config.value.minimum_margin) = $event)),
                              min: 0,
                              max: 30,
                              step: 1,
                              color: "primary",
                              "thumb-label": ""
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VRow, { dense: "" }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VCol, {
                          cols: "6",
                          md: "3"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VTextField, {
                              modelValue: config.value.max_queries,
                              "onUpdate:modelValue": _cache[28] || (_cache[28] = $event => ((config.value.max_queries) = $event)),
                              modelModifiers: { number: true },
                              density: "compact",
                              type: "number",
                              min: "1",
                              max: "8",
                              label: "最多搜索词"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        _createVNode(_component_VCol, {
                          cols: "6",
                          md: "3"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VTextField, {
                              modelValue: config.value.minimum_query_length,
                              "onUpdate:modelValue": _cache[29] || (_cache[29] = $event => ((config.value.minimum_query_length) = $event)),
                              modelModifiers: { number: true },
                              density: "compact",
                              type: "number",
                              min: "2",
                              max: "20",
                              label: "降级词最短字符"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        _createVNode(_component_VCol, {
                          cols: "6",
                          md: "3"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VTextField, {
                              modelValue: config.value.candidate_limit,
                              "onUpdate:modelValue": _cache[30] || (_cache[30] = $event => ((config.value.candidate_limit) = $event)),
                              modelModifiers: { number: true },
                              density: "compact",
                              type: "number",
                              min: "1",
                              max: "20",
                              label: "每词候选上限"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        _createVNode(_component_VCol, {
                          cols: "6",
                          md: "3"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VTextField, {
                              modelValue: config.value.detail_limit,
                              "onUpdate:modelValue": _cache[31] || (_cache[31] = $event => ((config.value.detail_limit) = $event)),
                              modelModifiers: { number: true },
                              density: "compact",
                              type: "number",
                              min: "0",
                              max: "15",
                              label: "详情拉取上限"
                            }, null, 8, ["modelValue"])
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
            }))
          : _createCommentVNode("", true),
        (!tmdbFirstMode.value)
          ? (_openBlock(), _createBlock(_component_VExpansionPanel, {
              key: 1,
              value: "weights"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VExpansionPanelTitle, null, {
                  default: _withCtx(() => [
                    _createElementVNode("div", _hoisted_24, [
                      _createVNode(_component_VIcon, {
                        icon: "mdi-tune-vertical",
                        color: "secondary"
                      }),
                      _createElementVNode("div", null, [
                        _cache[59] || (_cache[59] = _createElementVNode("strong", null, "评分权重", -1)),
                        _createElementVNode("small", null, "自动归一化 · 当前合计 " + _toDisplayString(weightTotal.value), 1)
                      ])
                    ])
                  ]),
                  _: 1
                }),
                _createVNode(_component_VExpansionPanelText, null, {
                  default: _withCtx(() => [
                    _createElementVNode("div", _hoisted_25, [
                      _cache[61] || (_cache[61] = _createElementVNode("span", null, "高级参数通常保持默认即可。", -1)),
                      _createVNode(_component_VBtn, {
                        size: "small",
                        variant: "tonal",
                        "prepend-icon": "mdi-restore",
                        onClick: _withModifiers(applyBalancedPreset, ["stop"])
                      }, {
                        default: _withCtx(() => [...(_cache[60] || (_cache[60] = [
                          _createTextVNode("恢复均衡预设", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    _createVNode(_component_VRow, { dense: "" }, {
                      default: _withCtx(() => [
                        (_openBlock(), _createElementBlock(_Fragment, null, _renderList([
              ['token_weight', 'Token 覆盖', 'mdi-format-list-bulleted'], ['similarity_weight', '字符相似', 'mdi-approximately-equal'],
              ['prefix_weight', '主体前缀', 'mdi-format-align-left'], ['rank_weight', '搜索排名', 'mdi-sort-numeric-ascending'],
              ['query_confidence_weight', '查询来源', 'mdi-source-branch-check'], ['anchor_weight', '原标题锚点', 'mdi-link-variant'],
              ['year_weight', '年份匹配', 'mdi-calendar-check'], ['type_weight', '类型匹配', 'mdi-movie-filter-outline'],
            ], (item) => {
                          return _createVNode(_component_VCol, {
                            key: item[0],
                            cols: "12",
                            sm: "6",
                            md: "4"
                          }, {
                            default: _withCtx(() => [
                              _createElementVNode("div", _hoisted_26, [
                                _createElementVNode("div", _hoisted_27, [
                                  _createVNode(_component_VIcon, {
                                    icon: item[2],
                                    size: "18",
                                    color: "primary"
                                  }, null, 8, ["icon"]),
                                  _createElementVNode("span", null, _toDisplayString(item[1]), 1),
                                  _createElementVNode("strong", null, _toDisplayString(config.value[item[0]]), 1)
                                ]),
                                _createVNode(_component_VSlider, {
                                  modelValue: config.value[item[0]],
                                  "onUpdate:modelValue": $event => ((config.value[item[0]]) = $event),
                                  min: 0,
                                  max: 60,
                                  step: 1,
                                  "hide-details": "",
                                  color: "primary"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ])
                            ]),
                            _: 2
                          }, 1024)
                        }), 64)),
                        _createVNode(_component_VCol, {
                          cols: "12",
                          sm: "6"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VTextField, {
                              modelValue: config.value.season_missing_penalty,
                              "onUpdate:modelValue": _cache[32] || (_cache[32] = $event => ((config.value.season_missing_penalty) = $event)),
                              modelModifiers: { number: true },
                              density: "compact",
                              type: "number",
                              min: "0",
                              max: "100",
                              label: "候选缺少目标季时扣分",
                              prefix: "-",
                              suffix: "分"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        _createVNode(_component_VCol, {
                          cols: "12",
                          sm: "6"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VTextField, {
                              modelValue: config.value.fallback_anchor_min,
                              "onUpdate:modelValue": _cache[33] || (_cache[33] = $event => ((config.value.fallback_anchor_min) = $event)),
                              modelModifiers: { number: true },
                              density: "compact",
                              type: "number",
                              min: "0",
                              max: "100",
                              label: "降级候选最低锚点关联",
                              suffix: "分"
                            }, null, 8, ["modelValue"])
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
            }))
          : _createCommentVNode("", true),
        _createVNode(_component_VExpansionPanel, { value: "diagnostics" }, {
          default: _withCtx(() => [
            _createVNode(_component_VExpansionPanelTitle, null, {
              default: _withCtx(() => [
                _createElementVNode("div", _hoisted_28, [
                  _createVNode(_component_VIcon, { icon: "mdi-bug-outline" }),
                  _createElementVNode("div", null, [
                    _cache[62] || (_cache[62] = _createElementVNode("strong", null, "日志与诊断", -1)),
                    _createElementVNode("small", null, "保留 " + _toDisplayString(config.value.history_limit) + " 条模块日志 · 调试日志" + _toDisplayString(config.value.debug ? '已开启' : '已关闭'), 1)
                  ])
                ])
              ]),
              _: 1
            }),
            _createVNode(_component_VExpansionPanelText, null, {
              default: _withCtx(() => [
                _createVNode(_component_VRow, {
                  dense: "",
                  align: "center"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
                          modelValue: config.value.history_limit,
                          "onUpdate:modelValue": _cache[34] || (_cache[34] = $event => ((config.value.history_limit) = $event)),
                          modelModifiers: { number: true },
                          density: "compact",
                          "hide-details": "",
                          type: "number",
                          min: "5",
                          max: "100",
                          label: "保留模块日志",
                          suffix: "条"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCol, {
                      cols: "12",
                      sm: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VSwitch, {
                          modelValue: config.value.debug,
                          "onUpdate:modelValue": _cache[35] || (_cache[35] = $event => ((config.value.debug) = $event)),
                          color: "primary",
                          label: "输出详细调试日志",
                          hint: "仅排查问题时开启，会增加日志量",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
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
    })
  ]))
}
}

};
const StrategySettings = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-2a44fc97"]]);

export { ModuleHeader as M, StrategySettings as S };
