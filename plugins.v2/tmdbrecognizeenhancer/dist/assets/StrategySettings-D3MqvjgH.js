import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { _ as _export_sfc } from './utils-DaBy4w3m.js';

const {createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,createVNode:_createVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,createBlock:_createBlock,renderList:_renderList,Fragment:_Fragment} = await importShared('vue');


const _hoisted_1 = { class: "strategy-settings" };
const _hoisted_2 = {
  key: 0,
  class: "web-fallback-box mt-3"
};
const _hoisted_3 = { class: "slider-label" };
const _hoisted_4 = { class: "slider-label" };
const _hoisted_5 = { class: "d-flex flex-wrap align-center ga-2" };
const _hoisted_6 = { class: "weight-box" };
const _hoisted_7 = { class: "d-flex align-center ga-2 mb-2" };
const _hoisted_8 = { class: "text-body-2" };

const {computed} = await importShared('vue');



const _sfc_main = {
  __name: 'StrategySettings',
  props: {
  modelValue: { type: Object, required: true },
  compact: { type: Boolean, default: false },
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
  'token_weight', 'similarity_weight', 'prefix_weight', 'rank_weight', 'query_confidence_weight', 'year_weight', 'type_weight',
].reduce((sum, key) => sum + Number(config.value[key] || 0), 0));

const tmdbFirstMode = computed(() =>
  Number(config.value.query_confidence_weight) > 0
  && ['token_weight', 'similarity_weight', 'prefix_weight', 'rank_weight', 'year_weight', 'type_weight']
    .every(key => Number(config.value[key] || 0) === 0)
  && Number(config.value.max_queries) === 1
  && !config.value.web_search_fallback,
);

function applyTmdbFirstPreset() {
  Object.assign(config.value, {
    main_title_fallback: false,
    progressive_fallback: false,
    web_search_fallback: false,
    max_queries: 1,
    minimum_score: 80,
    minimum_margin: 8,
    token_weight: 0,
    similarity_weight: 0,
    prefix_weight: 0,
    rank_weight: 0,
    query_confidence_weight: 100,
    year_weight: 0,
    type_weight: 0,
    season_missing_penalty: 0,
  });
}

function applyBalancedPreset() {
  Object.assign(config.value, {
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
  const _component_VChip = _resolveComponent("VChip");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VSpacer = _resolveComponent("VSpacer");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode(_component_VAlert, {
      type: "info",
      variant: "tonal",
      density: "comfortable",
      class: "mb-5",
      icon: "mdi-shield-check-outline"
    }, {
      default: _withCtx(() => [...(_cache[21] || (_cache[21] = [
        _createTextVNode(" 候选必须同时越过最低分与领先分差。启用集数归一化时，请在 MoviePilot 开启识别插件优先；没有维护目标规则的作品仍按原结果处理。 ", -1)
      ]))]),
      _: 1
    }),
    _createVNode(_component_VRow, null, {
      default: _withCtx(() => [
        _createVNode(_component_VCol, {
          cols: "12",
          md: __props.compact ? 12 : 5
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
                      default: _withCtx(() => [...(_cache[22] || (_cache[22] = [
                        _createTextVNode("运行方式", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode(_component_VCardSubtitle, null, {
                      default: _withCtx(() => [...(_cache[23] || (_cache[23] = [
                        _createTextVNode("控制接管范围与搜索成本", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode(_component_VCardText, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.enabled,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((config.value.enabled) = $event)),
                      color: "primary",
                      label: "启用整理失败兜底",
                      "hide-details": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.show_sidebar_nav,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((config.value.show_sidebar_nav) = $event)),
                      color: "primary",
                      label: "显示侧栏工作台",
                      "hide-details": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.prefer_parsed_title,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config.value.prefer_parsed_title) = $event)),
                      color: "primary",
                      label: "优先使用 MP 解析标题",
                      hint: "原标题进入事件后，复用识别词与 Rust 解析结果作为搜索标题",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.main_title_fallback,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.value.main_title_fallback) = $event)),
                      color: "primary",
                      label: "启用主体名称降级",
                      hint: "例如 Mushoku Tensei: ... → Mushoku Tensei",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.fetch_aliases,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.value.fetch_aliases) = $event)),
                      color: "primary",
                      label: "拉取候选别名与译名",
                      hint: "准确率更高，但会增加少量 TMDB 请求",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.episode_normalizer_enabled,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config.value.episode_normalizer_enabled) = $event)),
                      color: "success",
                      label: "启用动漫集数归一化",
                      hint: "TMDBID 命中已维护规则时，按默认编集或剧集组修正季集；需在 MP 开启识别插件优先",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.progressive_fallback,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((config.value.progressive_fallback) = $event)),
                      color: "warning",
                      label: "启用逐词缩短（实验性）",
                      hint: "会扩大召回范围，建议保持关闭",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VSwitch, {
                      modelValue: config.value.web_search_fallback,
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((config.value.web_search_fallback) = $event)),
                      color: "warning",
                      label: "启用搜索引擎兜底",
                      hint: "仅在 TMDB 候选未过阈值时搜索，并要求罗马音与候选别名交叉验证",
                      "persistent-hint": ""
                    }, null, 8, ["modelValue"]),
                    _createVNode(_component_VExpandTransition, null, {
                      default: _withCtx(() => [
                        (config.value.web_search_fallback)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_2, [
                              _createVNode(_component_VAlert, {
                                type: "warning",
                                variant: "tonal",
                                density: "compact",
                                class: "mb-3"
                              }, {
                                default: _withCtx(() => [...(_cache[24] || (_cache[24] = [
                                  _createTextVNode("会向外部搜索引擎发送解析后的标题，并自动使用 MoviePilot 系统代理。搜索结果不会被直接采用。", -1)
                                ]))]),
                                _: 1
                              }),
                              _createVNode(_component_VSelect, {
                                modelValue: config.value.web_search_engine,
                                "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((config.value.web_search_engine) = $event)),
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
                                        "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((config.value.web_search_max_results) = $event)),
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
                                        "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((config.value.web_search_timeout) = $event)),
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
                                        "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((config.value.web_search_min_evidence) = $event)),
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
                      "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((config.value.debug) = $event)),
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
        _createVNode(_component_VCol, {
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
                      default: _withCtx(() => [...(_cache[25] || (_cache[25] = [
                        _createTextVNode("接纳门槛", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode(_component_VCardSubtitle, null, {
                      default: _withCtx(() => [...(_cache[26] || (_cache[26] = [
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
                      _cache[27] || (_cache[27] = _createElementVNode("span", null, "最低得分", -1)),
                      _createElementVNode("strong", null, _toDisplayString(config.value.minimum_score), 1)
                    ]),
                    _createVNode(_component_VSlider, {
                      modelValue: config.value.minimum_score,
                      "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((config.value.minimum_score) = $event)),
                      min: 40,
                      max: 95,
                      step: 1,
                      color: "primary",
                      "thumb-label": ""
                    }, null, 8, ["modelValue"]),
                    _createElementVNode("div", _hoisted_4, [
                      _cache[28] || (_cache[28] = _createElementVNode("span", null, "第一名领先分差", -1)),
                      _createElementVNode("strong", null, _toDisplayString(config.value.minimum_margin), 1)
                    ]),
                    _createVNode(_component_VSlider, {
                      modelValue: config.value.minimum_margin,
                      "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((config.value.minimum_margin) = $event)),
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
                              "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((config.value.max_queries) = $event)),
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
                              "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((config.value.minimum_query_length) = $event)),
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
                              "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((config.value.candidate_limit) = $event)),
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
                              "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((config.value.detail_limit) = $event)),
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
        }, 8, ["md"])
      ]),
      _: 1
    }),
    _createVNode(_component_VCard, {
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
          append: _withCtx(() => [
            (tmdbFirstMode.value)
              ? (_openBlock(), _createBlock(_component_VChip, {
                  key: 0,
                  color: "success",
                  size: "small"
                }, {
                  default: _withCtx(() => [...(_cache[30] || (_cache[30] = [
                    _createTextVNode("TMDB 首轮优先", -1)
                  ]))]),
                  _: 1
                }))
              : _createCommentVNode("", true)
          ]),
          default: _withCtx(() => [
            _createVNode(_component_VCardTitle, null, {
              default: _withCtx(() => [...(_cache[29] || (_cache[29] = [
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
                _createElementVNode("div", _hoisted_5, [
                  _cache[33] || (_cache[33] = _createElementVNode("div", { class: "flex-grow-1" }, "策略预设只会填写下方参数，保存前仍可继续调整。首轮优先模式只执行一次完整标题的 TMDB Multi Search：唯一结果为 100，第一名为 90，第二名为 82。", -1)),
                  _createVNode(_component_VBtn, {
                    size: "small",
                    color: "primary",
                    variant: "tonal",
                    "prepend-icon": "mdi-numeric-1-circle",
                    onClick: applyTmdbFirstPreset
                  }, {
                    default: _withCtx(() => [...(_cache[31] || (_cache[31] = [
                      _createTextVNode("TMDB 首轮优先", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode(_component_VBtn, {
                    size: "small",
                    variant: "text",
                    "prepend-icon": "mdi-restore",
                    onClick: applyBalancedPreset
                  }, {
                    default: _withCtx(() => [...(_cache[32] || (_cache[32] = [
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
                      _createElementVNode("div", _hoisted_6, [
                        _createElementVNode("div", _hoisted_7, [
                          _createVNode(_component_VIcon, {
                            icon: item[2],
                            size: "18",
                            color: "primary"
                          }, null, 8, ["icon"]),
                          _createElementVNode("span", _hoisted_8, _toDisplayString(item[1]), 1),
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
                      "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((config.value.season_missing_penalty) = $event)),
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
                      modelValue: config.value.history_limit,
                      "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((config.value.history_limit) = $event)),
                      modelModifiers: { number: true },
                      type: "number",
                      min: "5",
                      max: "100",
                      label: "保留运行记录",
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
    })
  ]))
}
}

};
const StrategySettings = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-898fe132"]]);

export { StrategySettings as S };
