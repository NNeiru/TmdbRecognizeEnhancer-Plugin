import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { _ as _export_sfc } from './utils-B91K-_Zl.js';

const {createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,createVNode:_createVNode,Fragment:_Fragment,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,createBlock:_createBlock,renderList:_renderList} = await importShared('vue');


const _hoisted_1 = { class: "strategy-settings" };
const _hoisted_2 = {
  key: 0,
  class: "web-fallback-box mt-3"
};
const _hoisted_3 = { class: "slider-label" };
const _hoisted_4 = { class: "slider-label" };
const _hoisted_5 = { class: "context-box" };
const _hoisted_6 = { class: "context-box" };
const _hoisted_7 = { class: "d-flex align-center ga-2 mb-1" };
const _hoisted_8 = { class: "d-flex flex-wrap align-center ga-2" };
const _hoisted_9 = { class: "weight-box" };
const _hoisted_10 = { class: "d-flex align-center ga-2 mb-2" };
const _hoisted_11 = { class: "text-body-2" };

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

function applyTmdbFirstPreset() {
  Object.assign(config.value, {
    recognition_mode: 'tmdb_first',
  });
}

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
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent("VCardSubtitle");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VSelect = _resolveComponent("VSelect");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VCol = _resolveComponent("VCol");
  const _component_VRow = _resolveComponent("VRow");
  const _component_VExpandTransition = _resolveComponent("VExpandTransition");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VSlider = _resolveComponent("VSlider");
  const _component_VDivider = _resolveComponent("VDivider");
  const _component_VCombobox = _resolveComponent("VCombobox");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VSpacer = _resolveComponent("VSpacer");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode(_component_VAlert, {
      type: "info",
      variant: "tonal",
      density: "comfortable",
      class: "mb-5",
      icon: "mdi-database-search-outline"
    }, {
      default: _withCtx(() => [...(_cache[34] || (_cache[34] = [
        _createTextVNode(" 首结果模式完全按 TMDB 一次搜索的顺序选择；评分模式才使用标题、原标题、年份、类型、查询来源和双阈值。 ", -1)
      ]))]),
      _: 1
    }),
    _createVNode(_component_VRow, null, {
      default: _withCtx(() => [
        _createVNode(_component_VCol, {
          cols: "12",
          md: __props.compact || tmdbFirstMode.value ? 12 : 5
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VCard, {
              variant: "outlined",
              class: "setting-card h-100"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VCardItem, null, {
                  prepend: _withCtx(() => [
                    _createVNode(_component_VIcon, {
                      icon: "mdi-tune-variant",
                      color: "primary"
                    })
                  ]),
                  default: _withCtx(() => [
                    _createVNode(_component_VCardTitle, null, {
                      default: _withCtx(() => [...(_cache[35] || (_cache[35] = [
                        _createTextVNode("运行方式", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode(_component_VCardSubtitle, null, {
                      default: _withCtx(() => [...(_cache[36] || (_cache[36] = [
                        _createTextVNode("控制接管范围与搜索成本", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode(_component_VCardText, null, {
                  default: _withCtx(() => [
                    (__props.showModuleSwitches)
                      ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                          _createVNode(_component_VSwitch, {
                            modelValue: config.value.enabled,
                            "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((config.value.enabled) = $event)),
                            color: "primary",
                            label: "插件总开关",
                            "hide-details": ""
                          }, null, 8, ["modelValue"]),
                          _createVNode(_component_VSwitch, {
                            modelValue: config.value.recognizer_enabled,
                            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((config.value.recognizer_enabled) = $event)),
                            color: "primary",
                            label: "启用 TMDB 搜索增强",
                            "hide-details": ""
                          }, null, 8, ["modelValue"]),
                          _createVNode(_component_VSwitch, {
                            modelValue: config.value.episode_normalizer_enabled,
                            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config.value.episode_normalizer_enabled) = $event)),
                            color: "success",
                            label: "启用集数偏移",
                            "hide-details": ""
                          }, null, 8, ["modelValue"])
                        ], 64))
                      : _createCommentVNode("", true),
                    _createVNode(_component_VSelect, {
                      modelValue: config.value.recognition_mode,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.value.recognition_mode) = $event)),
                      items: [
              {title:'TMDB 单次首结果（默认）',value:'tmdb_first'},
              {title:'可解释评分模式',value:'scored'},
            ],
                      label: "候选选择模式",
                      class: "mt-3"
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.prefer_parsed_title,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.prefer_parsed_title) = $event)),
                      color: "primary",
                      label: "优先使用 MP 解析标题",
                      hint: "原标题进入事件后，复用识别词与 Rust 解析结果作为搜索标题",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.use_year_hint,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config.value.use_year_hint) = $event)),
                      color: "primary",
                      label: "使用 MP 年份提示",
                      hint: "MP MetaBase 已包含识别词处理后的年份；仅在存在年份时参与评分",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.use_original_title_evidence,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((config.value.use_original_title_evidence) = $event)),
                      color: "primary",
                      label: "使用原标题交叉验证",
                      hint: "将 MP 未应用识别词时的名称作为锚点，验证降级候选仍与原片相关",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.fetch_aliases,
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((config.value.fetch_aliases) = $event)),
                      color: "primary",
                      label: "拉取候选别名与译名",
                      hint: tmdbFirstMode.value ? '首结果模式中不影响选择，只用于展示和诊断' : '用于标题、原标题和罗马音交叉验证',
                      "persistent-hint": ""
                    }, null, 8, ["modelValue", "hint"]),
                    (!tmdbFirstMode.value)
                      ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                          _createVNode(_component_VSwitch, {
                            modelValue: config.value.main_title_fallback,
                            "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((config.value.main_title_fallback) = $event)),
                            color: "primary",
                            label: "启用主体名称降级",
                            hint: "例如 Mushoku Tensei: ... → Mushoku Tensei",
                            "persistent-hint": ""
                          }, null, 8, ["modelValue"]),
                          _createVNode(_component_VSwitch, {
                            modelValue: config.value.progressive_fallback,
                            "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((config.value.progressive_fallback) = $event)),
                            color: "warning",
                            label: "启用逐词缩短（实验性）",
                            hint: "每次降级均须通过未缩减标题锚点验证",
                            "persistent-hint": ""
                          }, null, 8, ["modelValue"]),
                          _createVNode(_component_VSwitch, {
                            modelValue: config.value.web_search_fallback,
                            "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((config.value.web_search_fallback) = $event)),
                            color: "warning",
                            label: "启用搜索引擎交叉验证",
                            hint: "仅接受指向具体 TMDB 条目的直链，并缓存同一查询结果",
                            "persistent-hint": ""
                          }, null, 8, ["modelValue"])
                        ], 64))
                      : _createCommentVNode("", true),
                    _createVNode(_component_VExpandTransition, null, {
                      default: _withCtx(() => [
                        (!tmdbFirstMode.value && config.value.web_search_fallback)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_2, [
                              _createVNode(_component_VAlert, {
                                type: "warning",
                                variant: "tonal",
                                density: "compact",
                                class: "mb-3"
                              }, {
                                default: _withCtx(() => [...(_cache[37] || (_cache[37] = [
                                  _createTextVNode("自动模式固定使用 DuckDuckGo，避免聚合多引擎造成结果漂移；外部结果只有 TMDB 直链与原标题/候选别名共现时才形成证据。", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VSelect, {
                                modelValue: config.value.web_search_engine,
                                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((config.value.web_search_engine) = $event)),
                                items: [
                  { title: '自动选择', value: 'auto' },
                  { title: 'DuckDuckGo', value: 'duckduckgo' },
                  { title: 'Google', value: 'google' },
                  { title: 'Brave', value: 'brave' },
                  { title: 'Yahoo', value: 'yahoo' },
                  { title: 'Yandex', value: 'yandex' },
                  { title: 'Mojeek', value: 'mojeek' },
                ],
                                label: "搜索引擎",
                                density: "comfortable"
                              }, null, 8, ["modelValue"]),
                              _createVNode(_component_VRow, { dense: "" }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_VCol, { cols: "6" }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VTextField, {
                                        modelValue: config.value.web_search_max_results,
                                        "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((config.value.web_search_max_results) = $event)),
                                        modelModifiers: { number: true },
                                        type: "number",
                                        min: "3",
                                        max: "15",
                                        label: "最多结果"
                                      }, null, 8, ["modelValue"])
                                    ]),
                                    _: 1
                                  }),
                                  _createVNode(_component_VCol, { cols: "6" }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VTextField, {
                                        modelValue: config.value.web_search_timeout,
                                        "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((config.value.web_search_timeout) = $event)),
                                        modelModifiers: { number: true },
                                        type: "number",
                                        min: "5",
                                        max: "30",
                                        label: "超时",
                                        suffix: "秒"
                                      }, null, 8, ["modelValue"])
                                    ]),
                                    _: 1
                                  }),
                                  _createVNode(_component_VCol, { cols: "12" }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_VTextField, {
                                        modelValue: config.value.web_search_min_evidence,
                                        "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((config.value.web_search_min_evidence) = $event)),
                                        modelModifiers: { number: true },
                                        type: "number",
                                        min: "50",
                                        max: "100",
                                        label: "外部证据最低分",
                                        hint: "建议不低于 78；仅有一个 TMDB 链接而没有别名共现时最高 60 分",
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
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.debug,
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((config.value.debug) = $event)),
                      color: "primary",
                      label: "输出详细调试日志",
                      "hide-details": ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["md"]),
        (!tmdbFirstMode.value)
          ? (_openBlock(), _createBlock(_component_VCol, {
              key: 0,
              cols: "12",
              md: __props.compact ? 12 : 7
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VCard, {
                  variant: "outlined",
                  class: "setting-card h-100"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCardItem, null, {
                      prepend: _withCtx(() => [
                        _createVNode(_component_VIcon, {
                          icon: "mdi-shield-star-outline",
                          color: "success"
                        })
                      ]),
                      default: _withCtx(() => [
                        _createVNode(_component_VCardTitle, null, {
                          default: _withCtx(() => [...(_cache[38] || (_cache[38] = [
                            _createTextVNode("接纳门槛", -1)
                          ]))]),
                          _: 1
                        }),
                        _createVNode(_component_VCardSubtitle, null, {
                          default: _withCtx(() => [...(_cache[39] || (_cache[39] = [
                            _createTextVNode("宁可拒绝，也不把资源整理到错误作品", -1)
                          ]))]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCardText, null, {
                      default: _withCtx(() => [
                        _createElementVNode("div", _hoisted_3, [
                          _cache[40] || (_cache[40] = _createElementVNode("span", null, "最低得分", -1)),
                          _createElementVNode("strong", null, _toDisplayString(config.value.minimum_score), 1)
                        ]),
                        _createVNode(_component_VSlider, {
                          modelValue: config.value.minimum_score,
                          "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((config.value.minimum_score) = $event)),
                          min: 40,
                          max: 95,
                          step: 1,
                          color: "primary",
                          "thumb-label": ""
                        }, null, 8, ["modelValue"]),
                        _createElementVNode("div", _hoisted_4, [
                          _cache[41] || (_cache[41] = _createElementVNode("span", null, "第一名领先分差", -1)),
                          _createElementVNode("strong", null, _toDisplayString(config.value.minimum_margin), 1)
                        ]),
                        _createVNode(_component_VSlider, {
                          modelValue: config.value.minimum_margin,
                          "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((config.value.minimum_margin) = $event)),
                          min: 0,
                          max: 30,
                          step: 1,
                          color: "primary",
                          "thumb-label": ""
                        }, null, 8, ["modelValue"]),
                        _createVNode(_component_VRow, { dense: "" }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VCol, { cols: "6" }, {
                              default: _withCtx(() => [
                                _createVNode(_component_VTextField, {
                                  modelValue: config.value.max_queries,
                                  "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((config.value.max_queries) = $event)),
                                  modelModifiers: { number: true },
                                  type: "number",
                                  min: "1",
                                  max: "8",
                                  label: "最多搜索词"
                                }, null, 8, ["modelValue"])
                              ]),
                              _: 1
                            }),
                            _createVNode(_component_VCol, { cols: "6" }, {
                              default: _withCtx(() => [
                                _createVNode(_component_VTextField, {
                                  modelValue: config.value.minimum_query_length,
                                  "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((config.value.minimum_query_length) = $event)),
                                  modelModifiers: { number: true },
                                  type: "number",
                                  min: "2",
                                  max: "20",
                                  label: "降级词最短字符"
                                }, null, 8, ["modelValue"])
                              ]),
                              _: 1
                            }),
                            _createVNode(_component_VCol, { cols: "6" }, {
                              default: _withCtx(() => [
                                _createVNode(_component_VTextField, {
                                  modelValue: config.value.candidate_limit,
                                  "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((config.value.candidate_limit) = $event)),
                                  modelModifiers: { number: true },
                                  type: "number",
                                  min: "1",
                                  max: "20",
                                  label: "每词候选上限"
                                }, null, 8, ["modelValue"])
                              ]),
                              _: 1
                            }),
                            _createVNode(_component_VCol, { cols: "6" }, {
                              default: _withCtx(() => [
                                _createVNode(_component_VTextField, {
                                  modelValue: config.value.detail_limit,
                                  "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((config.value.detail_limit) = $event)),
                                  modelModifiers: { number: true },
                                  type: "number",
                                  min: "0",
                                  max: "15",
                                  label: "拉取详情上限"
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
            }, 8, ["md"]))
          : _createCommentVNode("", true)
      ]),
      _: 1
    }),
    (tmdbFirstMode.value)
      ? (_openBlock(), _createBlock(_component_VAlert, {
          key: 0,
          type: "success",
          variant: "tonal",
          class: "mt-4"
        }, {
          default: _withCtx(() => [...(_cache[42] || (_cache[42] = [
            _createTextVNode(" 当前只提交一次完整解析标题。通常采用 TMDB 第一个影视结果；若近期季度目录、识别记忆或人工优先名单明确指向本次候选之一，会在保留搜索顺序的基础上优先该候选。评分与分差不参与选择。 ", -1)
          ]))]),
          _: 1
        }))
      : _createCommentVNode("", true),
    _createVNode(_component_VCard, {
      variant: "outlined",
      class: "setting-card mt-4"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VCardItem, null, {
          prepend: _withCtx(() => [
            _createVNode(_component_VIcon, {
              icon: "mdi-compass-rose",
              color: "primary"
            })
          ]),
          default: _withCtx(() => [
            _createVNode(_component_VCardTitle, null, {
              default: _withCtx(() => [...(_cache[43] || (_cache[43] = [
                _createTextVNode("上下文辅助", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VCardSubtitle, null, {
              default: _withCtx(() => [...(_cache[44] || (_cache[44] = [
                _createTextVNode("两类证据互相独立；关闭后完全不参与候选选择", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode(_component_VCardText, null, {
          default: _withCtx(() => [
            _createVNode(_component_VRow, null, {
              default: _withCtx(() => [
                _createVNode(_component_VCol, {
                  cols: "12",
                  md: "6"
                }, {
                  default: _withCtx(() => [
                    _createElementVNode("div", _hoisted_5, [
                      _createVNode(_component_VSwitch, {
                        modelValue: config.value.seasonal_evidence_enabled,
                        "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((config.value.seasonal_evidence_enabled) = $event)),
                        color: "primary",
                        label: "使用近期季度动画目录",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _cache[46] || (_cache[46] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis mb-3" }, "AniList 的单季查询不会自动带入上季开播的跨季番；插件会读取已缓存的当前及此前季度看板，兼顾跨季连载和上一季资源补整，识别时不访问外部网站。", -1)),
                      _createVNode(_component_VSelect, {
                        modelValue: config.value.seasonal_evidence_quarters,
                        "onUpdate:modelValue": _cache[23] || (_cache[23] = $event => ((config.value.seasonal_evidence_quarters) = $event)),
                        modelModifiers: { number: true },
                        items: [
                { title: '仅当前季度', value: 1 },
                { title: '当前 + 上一季度（推荐）', value: 2 },
                { title: '最近三个季度', value: 3 },
                { title: '最近四个季度', value: 4 },
              ],
                        label: "季度证据窗口",
                        density: "comfortable",
                        disabled: !config.value.seasonal_evidence_enabled
                      }, null, 8, ["modelValue", "disabled"]),
                      _createVNode(_component_VSlider, {
                        modelValue: config.value.seasonal_evidence_weight,
                        "onUpdate:modelValue": _cache[24] || (_cache[24] = $event => ((config.value.seasonal_evidence_weight) = $event)),
                        min: 0,
                        max: 40,
                        step: 1,
                        color: "primary",
                        disabled: !config.value.seasonal_evidence_enabled,
                        "thumb-label": ""
                      }, {
                        prepend: _withCtx(() => [...(_cache[45] || (_cache[45] = [
                          _createElementVNode("span", { class: "evidence-label" }, "影响强度", -1)
                        ]))]),
                        append: _withCtx(() => [
                          _createElementVNode("strong", null, _toDisplayString(config.value.seasonal_evidence_weight), 1)
                        ]),
                        _: 1
                      }, 8, ["modelValue", "disabled"])
                    ])
                  ]),
                  _: 1
                }),
                _createVNode(_component_VCol, {
                  cols: "12",
                  md: "6"
                }, {
                  default: _withCtx(() => [
                    _createElementVNode("div", _hoisted_6, [
                      _createVNode(_component_VSwitch, {
                        modelValue: config.value.recognition_memory_enabled,
                        "onUpdate:modelValue": _cache[25] || (_cache[25] = $event => ((config.value.recognition_memory_enabled) = $event)),
                        color: "secondary",
                        label: "使用近期重复命中",
                        "hide-details": ""
                      }, null, 8, ["modelValue"]),
                      _cache[48] || (_cache[48] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis mb-3" }, "只累计正式整理链中不同文件对同一完整解析标题的命中；综合试跑和同一文件重复运行不会刷高频次。", -1)),
                      _createVNode(_component_VRow, { dense: "" }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VCol, { cols: "12" }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VSlider, {
                                modelValue: config.value.recognition_memory_weight,
                                "onUpdate:modelValue": _cache[26] || (_cache[26] = $event => ((config.value.recognition_memory_weight) = $event)),
                                min: 0,
                                max: 40,
                                step: 1,
                                color: "secondary",
                                disabled: !config.value.recognition_memory_enabled,
                                "thumb-label": ""
                              }, {
                                prepend: _withCtx(() => [...(_cache[47] || (_cache[47] = [
                                  _createElementVNode("span", { class: "evidence-label" }, "影响强度", -1)
                                ]))]),
                                append: _withCtx(() => [
                                  _createElementVNode("strong", null, _toDisplayString(config.value.recognition_memory_weight), 1)
                                ]),
                                _: 1
                              }, 8, ["modelValue", "disabled"])
                            ]),
                            _: 1
                          }),
                          _createVNode(_component_VCol, { cols: "6" }, {
                            default: _withCtx(() => [
                              _createVNode(_component_VTextField, {
                                modelValue: config.value.recognition_memory_min_hits,
                                "onUpdate:modelValue": _cache[27] || (_cache[27] = $event => ((config.value.recognition_memory_min_hits) = $event)),
                                modelModifiers: { number: true },
                                type: "number",
                                min: "2",
                                max: "10",
                                label: "生效所需文件数",
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
                                "onUpdate:modelValue": _cache[28] || (_cache[28] = $event => ((config.value.recognition_memory_ttl_days) = $event)),
                                modelModifiers: { number: true },
                                type: "number",
                                min: "1",
                                max: "90",
                                label: "记忆保存时间",
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
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VDivider, { class: "my-5" }),
            _createElementVNode("div", _hoisted_7, [
              _createVNode(_component_VIcon, {
                icon: "mdi-playlist-star",
                color: "primary"
              }),
              _cache[49] || (_cache[49] = _createElementVNode("strong", null, "TMDB 候选人工规则", -1))
            ]),
            _cache[50] || (_cache[50] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis mb-4" }, "只处理本次搜索实际返回的候选，不会凭 ID 强行创建结果。排除先执行；优先名单命中后直接选择，多个优先 ID 同时出现时按填写顺序。", -1)),
            _createVNode(_component_VRow, { dense: "" }, {
              default: _withCtx(() => [
                _createVNode(_component_VCol, {
                  cols: "12",
                  md: "6"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCombobox, {
                      modelValue: config.value.tmdb_exclude_ids,
                      "onUpdate:modelValue": _cache[29] || (_cache[29] = $event => ((config.value.tmdb_exclude_ids) = $event)),
                      multiple: "",
                      chips: "",
                      "closable-chips": "",
                      clearable: "",
                      label: "TMDB 排除名单",
                      placeholder: "输入 ID 后按回车",
                      hint: "命中的候选会在评分和分差计算前移除；与优先名单冲突时排除优先",
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
                      "onUpdate:modelValue": _cache[30] || (_cache[30] = $event => ((config.value.tmdb_prefer_ids) = $event)),
                      multiple: "",
                      chips: "",
                      "closable-chips": "",
                      clearable: "",
                      label: "TMDB 优先名单",
                      placeholder: "输入 ID 后按回车",
                      hint: "本轮候选出现其中一个 ID 时直接选择；越靠前优先级越高",
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
      ? (_openBlock(), _createBlock(_component_VCard, {
          key: 1,
          variant: "outlined",
          class: "setting-card mt-4"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VCardItem, null, {
              prepend: _withCtx(() => [
                _createVNode(_component_VIcon, {
                  icon: "mdi-scale-balance",
                  color: "secondary"
                })
              ]),
              default: _withCtx(() => [
                _createVNode(_component_VCardTitle, null, {
                  default: _withCtx(() => [...(_cache[51] || (_cache[51] = [
                    _createTextVNode("评分权重", -1)
                  ]))]),
                  _: 1
                }),
                _createVNode(_component_VCardSubtitle, null, {
                  default: _withCtx(() => [
                    _createTextVNode("权重会自动按总和归一化 · 当前合计 " + _toDisplayString(weightTotal.value), 1)
                  ]),
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
                  density: "comfortable",
                  class: "mb-4"
                }, {
                  default: _withCtx(() => [
                    _createElementVNode("div", _hoisted_8, [
                      _cache[54] || (_cache[54] = _createElementVNode("div", { class: "flex-grow-1" }, "评分模式会验证降级候选与未缩减标题、MP 原标题之间的关联；关联不足会额外扣分。", -1)),
                      _createVNode(_component_VBtn, {
                        size: "small",
                        color: "primary",
                        variant: "tonal",
                        "prepend-icon": "mdi-numeric-1-circle",
                        onClick: applyTmdbFirstPreset
                      }, {
                        default: _withCtx(() => [...(_cache[52] || (_cache[52] = [
                          _createTextVNode("切换单次首结果", -1)
                        ]))]),
                        _: 1
                      }),
                      _createVNode(_component_VBtn, {
                        size: "small",
                        variant: "text",
                        "prepend-icon": "mdi-restore",
                        onClick: applyBalancedPreset
                      }, {
                        default: _withCtx(() => [...(_cache[53] || (_cache[53] = [
                          _createTextVNode("恢复均衡预设", -1)
                        ]))]),
                        _: 1
                      })
                    ])
                  ]),
                  _: 1
                }),
                _createVNode(_component_VRow, { dense: "" }, {
                  default: _withCtx(() => [
                    (_openBlock(), _createElementBlock(_Fragment, null, _renderList([
            ['token_weight', 'Token 覆盖', 'mdi-format-list-bulleted'],
            ['similarity_weight', '字符相似', 'mdi-approximately-equal'],
            ['prefix_weight', '主体前缀', 'mdi-format-align-left'],
            ['rank_weight', '搜索排名', 'mdi-sort-numeric-ascending'],
            ['query_confidence_weight', '查询来源', 'mdi-source-branch-check'],
            ['anchor_weight', '原标题锚点', 'mdi-link-variant'],
            ['year_weight', '年份匹配', 'mdi-calendar-check'],
            ['type_weight', '类型匹配', 'mdi-movie-filter-outline'],
          ], (item) => {
                      return _createVNode(_component_VCol, {
                        key: item[0],
                        cols: "12",
                        sm: "6",
                        md: "4"
                      }, {
                        default: _withCtx(() => [
                          _createElementVNode("div", _hoisted_9, [
                            _createElementVNode("div", _hoisted_10, [
                              _createVNode(_component_VIcon, {
                                icon: item[2],
                                size: "18",
                                color: "primary"
                              }, null, 8, ["icon"]),
                              _createElementVNode("span", _hoisted_11, _toDisplayString(item[1]), 1),
                              _createVNode(_component_VSpacer),
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
                          "onUpdate:modelValue": _cache[31] || (_cache[31] = $event => ((config.value.season_missing_penalty) = $event)),
                          modelModifiers: { number: true },
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
                          "onUpdate:modelValue": _cache[32] || (_cache[32] = $event => ((config.value.fallback_anchor_min) = $event)),
                          modelModifiers: { number: true },
                          type: "number",
                          min: "0",
                          max: "100",
                          label: "降级候选最低锚点关联",
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
                          modelValue: config.value.history_limit,
                          "onUpdate:modelValue": _cache[33] || (_cache[33] = $event => ((config.value.history_limit) = $event)),
                          modelModifiers: { number: true },
                          type: "number",
                          min: "5",
                          max: "100",
                          label: "保留模块日志",
                          suffix: "条"
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
      : _createCommentVNode("", true)
  ]))
}
}

};
const StrategySettings = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-cc329c5f"]]);

export { StrategySettings as S };
