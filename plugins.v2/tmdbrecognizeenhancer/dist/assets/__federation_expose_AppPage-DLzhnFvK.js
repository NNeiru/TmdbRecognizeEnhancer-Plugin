import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { S as StrategySettings } from './StrategySettings-zjnxC5G-.js';
import { _ as _export_sfc, u as unwrapResponse, c as cloneConfig, m as mediaTypeText, s as scoreColor } from './utils-mQOiSG-V.js';

const {toDisplayString:_toDisplayString$1,createTextVNode:_createTextVNode$1,resolveComponent:_resolveComponent$1,withCtx:_withCtx$1,openBlock:_openBlock$1,createBlock:_createBlock$1,createCommentVNode:_createCommentVNode$1,createElementVNode:_createElementVNode$1,createElementBlock:_createElementBlock$1,createVNode:_createVNode$1,renderList:_renderList$1,Fragment:_Fragment$1} = await importShared('vue');


const _hoisted_1$1 = { class: "episode-normalizer" };
const _hoisted_2$1 = { key: 0 };
const _hoisted_3$1 = { key: 1 };
const _hoisted_4$1 = { class: "d-flex align-center ga-2 mt-3" };
const _hoisted_5$1 = { class: "text-caption text-medium-emphasis ms-9" };
const _hoisted_6$1 = {
  key: 1,
  class: "text-caption text-medium-emphasis mt-2 ms-2"
};
const _hoisted_7$1 = { class: "mt-1" };
const _hoisted_8$1 = { class: "d-flex align-center mt-5 mb-2" };
const _hoisted_9$1 = { class: "d-flex align-center mb-2" };
const _hoisted_10$1 = { class: "font-weight-bold" };
const _hoisted_11$1 = { key: 0 };
const _hoisted_12$1 = { class: "d-flex flex-wrap align-center ga-3 mb-4" };
const _hoisted_13$1 = { class: "catalog-grid" };
const _hoisted_14$1 = { class: "text-caption mt-2 text-medium-emphasis" };
const _hoisted_15$1 = {
  key: 0,
  class: "empty-catalog"
};

const {computed: computed$1,onMounted: onMounted$1,ref: ref$1} = await importShared('vue');


const _sfc_main$1 = {
  __name: 'EpisodeNormalizer',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginBase: { type: String, required: true },
  runtimeStatus: { type: Object, default: () => ({}) },
},
  setup(__props) {

const props = __props;

const loading = ref$1(false);
const error = ref$1('');
const rules = ref$1([]);
const catalog = ref$1([]);
const inspection = ref$1(null);
const previewResult = ref$1(null);
const importForm = ref$1({ year: new Date().getFullYear(), quarter: Math.floor(new Date().getMonth() / 3) + 1 });
const previewForm = ref$1({ season: 1, episode: 1, end_episode: '', title: '' });

const emptyRule = () => ({
  tmdb_id: '', title: '', enabled: true, target_type: 'default', episode_group_id: '', installments: [],
});
const form = ref$1(emptyRule());

const selectedGroup = computed$1(() =>
  inspection.value?.groups?.find(item => item.id === form.value.episode_group_id),
);

async function loadData() {
  loading.value = true;
  error.value = '';
  try {
    const response = await props.api.get(`${props.pluginBase}/episode-normalizer`);
    const data = unwrapResponse(response) || {};
    rules.value = data.rules || [];
    catalog.value = data.catalog || [];
  } catch (err) {
    error.value = err?.message || '集数归一化数据加载失败';
  } finally {
    loading.value = false;
  }
}

async function inspectTarget() {
  if (!form.value.tmdb_id) return
  loading.value = true;
  error.value = '';
  try {
    inspection.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/inspect`, { tmdb_id: form.value.tmdb_id },
    ));
    if (inspection.value?.title && !form.value.title) form.value.title = inspection.value.title;
  } catch (err) {
    error.value = err?.message || '目标编集读取失败';
  } finally {
    loading.value = false;
  }
}

async function saveRule() {
  loading.value = true;
  error.value = '';
  try {
    const data = unwrapResponse(await props.api.post(`${props.pluginBase}/episode-normalizer/rule`, form.value)) || {};
    rules.value = data.rules || rules.value;
  } catch (err) {
    error.value = err?.message || '规则保存失败';
  } finally {
    loading.value = false;
  }
}

async function deleteRule(tmdbId) {
  loading.value = true;
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/rule/delete`, { tmdb_id: tmdbId },
    )) || {};
    rules.value = data.rules || [];
    if (Number(form.value.tmdb_id) === Number(tmdbId)) resetForm();
  } finally {
    loading.value = false;
  }
}

async function runPreview() {
  previewResult.value = null;
  loading.value = true;
  try {
    const payload = { ...previewForm.value, tmdb_id: form.value.tmdb_id, rule: form.value };
    previewResult.value = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/preview`, payload,
    ));
  } catch (err) {
    error.value = err?.message || '归一化试跑失败';
  } finally {
    loading.value = false;
  }
}

async function importQuarter() {
  loading.value = true;
  error.value = '';
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/catalog/import`, importForm.value,
    )) || {};
    catalog.value = data.catalog || [];
  } catch (err) {
    error.value = err?.message || '季度目录导入失败';
  } finally {
    loading.value = false;
  }
}

async function matchCatalog(item) {
  loading.value = true;
  try {
    const data = unwrapResponse(await props.api.post(
      `${props.pluginBase}/episode-normalizer/catalog/match`, { id: item.id },
    )) || {};
    catalog.value = data.catalog || catalog.value;
  } catch (err) {
    error.value = err?.message || 'TMDB 匹配失败';
  } finally {
    loading.value = false;
  }
}

function editRule(rule) {
  form.value = prepareRuleForForm(rule);
  inspection.value = null;
  previewResult.value = null;
  inspectTarget();
}

function resetForm() {
  form.value = emptyRule();
  inspection.value = null;
  previewResult.value = null;
}

function addInstallment(seed = {}) {
  form.value.installments.push({
    id: `segment-${Date.now()}`,
    title: seed.title || '',
    quarter: seed.quarter || '',
    aliases: Array.isArray(seed.aliases) ? seed.aliases.join('\n') : (seed.aliases || ''),
    source_season: '',
    target_start_season: 1,
    target_start_episode: 1,
  });
}

function useCatalogItem(item) {
  const best = item.tmdb_match?.best;
  if (!best?.tmdb_id) return
  const existing = rules.value.find(rule => Number(rule.tmdb_id) === Number(best.tmdb_id));
  form.value = existing ? prepareRuleForForm(existing) : {
    ...emptyRule(), tmdb_id: best.tmdb_id, title: best.name || item.name_cn || item.name,
  };
  addInstallment({ title: item.name_cn || item.name, quarter: item.quarter, aliases: item.aliases });
  inspection.value = null;
  inspectTarget();
}

function prepareRuleForForm(rule) {
  const cloned = JSON.parse(JSON.stringify(rule));
  cloned.installments = (cloned.installments || []).map(item => ({
    ...item,
    aliases: Array.isArray(item.aliases) ? item.aliases.join('\n') : (item.aliases || ''),
  }));
  return cloned
}

function removeInstallment(index) {
  form.value.installments.splice(index, 1);
}

function groupType(type) {
  return ({ 1: '原始播出', 2: '绝对编号', 3: 'DVD', 4: 'Digital', 5: '故事线', 6: '制片', 7: 'TV' })[type] || `类型 ${type}`
}

onMounted$1(loadData);

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent$1("VAlert");
  const _component_VIcon = _resolveComponent$1("VIcon");
  const _component_VAvatar = _resolveComponent$1("VAvatar");
  const _component_VCardTitle = _resolveComponent$1("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent$1("VCardSubtitle");
  const _component_VBtn = _resolveComponent$1("VBtn");
  const _component_VCardItem = _resolveComponent$1("VCardItem");
  const _component_VTextField = _resolveComponent$1("VTextField");
  const _component_VCol = _resolveComponent$1("VCol");
  const _component_VRow = _resolveComponent$1("VRow");
  const _component_VSwitch = _resolveComponent$1("VSwitch");
  const _component_VRadio = _resolveComponent$1("VRadio");
  const _component_VCard = _resolveComponent$1("VCard");
  const _component_VSelect = _resolveComponent$1("VSelect");
  const _component_VRadioGroup = _resolveComponent$1("VRadioGroup");
  const _component_VSpacer = _resolveComponent$1("VSpacer");
  const _component_VTextarea = _resolveComponent$1("VTextarea");
  const _component_VCardText = _resolveComponent$1("VCardText");
  const _component_VDivider = _resolveComponent$1("VDivider");
  const _component_VCardActions = _resolveComponent$1("VCardActions");
  const _component_VListItem = _resolveComponent$1("VListItem");
  const _component_VList = _resolveComponent$1("VList");
  const _component_VImg = _resolveComponent$1("VImg");
  const _component_VChip = _resolveComponent$1("VChip");

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
            _cache[13] || (_cache[13] = _createElementVNode$1("div", { class: "font-weight-bold" }, "归一化暂不能接管实际整理", -1)),
            (!__props.runtimeStatus.runtime_compatible)
              ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_2$1, _toDisplayString$1(__props.runtimeStatus.runtime_message), 1))
              : _createCommentVNode$1("", true),
            (!__props.runtimeStatus.plugin_first)
              ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_3$1, "请在 MoviePilot 中开启“识别插件优先”。否则原生识别成功时不会调用本插件。"))
              : _createCommentVNode$1("", true)
          ]),
          _: 1
        }))
      : (_openBlock$1(), _createBlock$1(_component_VAlert, {
          key: 2,
          type: "success",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: _withCtx$1(() => [
            _createTextVNode$1(_toDisplayString$1(__props.runtimeStatus.runtime_message) + "；识别插件优先已开启。MoviePilot 源码不会被覆盖。 ", 1)
          ]),
          _: 1
        })),
    _createVNode$1(_component_VRow, null, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCol, {
          cols: "12",
          lg: "7"
        }, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCard, {
              variant: "outlined",
              class: "normalizer-card"
            }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardItem, null, {
                  prepend: _withCtx$1(() => [
                    _createVNode$1(_component_VAvatar, {
                      color: "primary",
                      variant: "tonal"
                    }, {
                      default: _withCtx$1(() => [
                        _createVNode$1(_component_VIcon, { icon: "mdi-tune-vertical-variant" })
                      ]),
                      _: 1
                    })
                  ]),
                  append: _withCtx$1(() => [
                    _createVNode$1(_component_VBtn, {
                      variant: "text",
                      "prepend-icon": "mdi-plus",
                      onClick: resetForm
                    }, {
                      default: _withCtx$1(() => [...(_cache[16] || (_cache[16] = [
                        _createTextVNode$1("新规则", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VCardTitle, null, {
                      default: _withCtx$1(() => [...(_cache[14] || (_cache[14] = [
                        _createTextVNode$1("目标编集", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$1(_component_VCardSubtitle, null, {
                      default: _withCtx$1(() => [...(_cache[15] || (_cache[15] = [
                        _createTextVNode$1("只定义最终采用 TMDB 默认还是某个剧集组", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$1(_component_VCardText, null, {
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VRow, { dense: "" }, {
                      default: _withCtx$1(() => [
                        _createVNode$1(_component_VCol, {
                          cols: "12",
                          sm: "4"
                        }, {
                          default: _withCtx$1(() => [
                            _createVNode$1(_component_VTextField, {
                              modelValue: form.value.tmdb_id,
                              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((form.value.tmdb_id) = $event)),
                              label: "TMDBID",
                              type: "number",
                              "hide-details": ""
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        _createVNode$1(_component_VCol, {
                          cols: "12",
                          sm: "8"
                        }, {
                          default: _withCtx$1(() => [
                            _createVNode$1(_component_VTextField, {
                              modelValue: form.value.title,
                              "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((form.value.title) = $event)),
                              label: "显示名称",
                              "hide-details": ""
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    _createElementVNode$1("div", _hoisted_4$1, [
                      _createVNode$1(_component_VBtn, {
                        color: "primary",
                        variant: "tonal",
                        "prepend-icon": "mdi-database-eye-outline",
                        loading: loading.value,
                        onClick: inspectTarget
                      }, {
                        default: _withCtx$1(() => [...(_cache[17] || (_cache[17] = [
                          _createTextVNode$1("读取编集", -1)
                        ]))]),
                        _: 1
                      }, 8, ["loading"]),
                      _createVNode$1(_component_VSwitch, {
                        modelValue: form.value.enabled,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((form.value.enabled) = $event)),
                        label: "启用",
                        color: "success",
                        "hide-details": "",
                        density: "compact"
                      }, null, 8, ["modelValue"])
                    ]),
                    _createVNode$1(_component_VRadioGroup, {
                      modelValue: form.value.target_type,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((form.value.target_type) = $event)),
                      class: "target-options mt-4",
                      "hide-details": ""
                    }, {
                      default: _withCtx$1(() => [
                        _createVNode$1(_component_VCard, {
                          variant: "tonal",
                          color: form.value.target_type === 'default' ? 'primary' : undefined,
                          class: "target-option"
                        }, {
                          default: _withCtx$1(() => [
                            _createVNode$1(_component_VRadio, {
                              value: "default",
                              label: "TMDB 默认编集",
                              color: "primary"
                            }),
                            _createElementVNode$1("div", _hoisted_5$1, [
                              (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(inspection.value?.default?.seasons || [], (season) => {
                                return (_openBlock$1(), _createElementBlock$1("span", {
                                  key: season.season,
                                  class: "me-3"
                                }, "S" + _toDisplayString$1(season.season) + " · " + _toDisplayString$1(season.episode_count) + " 集", 1))
                              }), 128))
                            ])
                          ]),
                          _: 1
                        }, 8, ["color"]),
                        _createVNode$1(_component_VCard, {
                          variant: "tonal",
                          color: form.value.target_type === 'group' ? 'secondary' : undefined,
                          class: "target-option mt-3"
                        }, {
                          default: _withCtx$1(() => [
                            _createVNode$1(_component_VRadio, {
                              value: "group",
                              label: "TMDB 剧集组",
                              color: "secondary"
                            }),
                            (form.value.target_type === 'group')
                              ? (_openBlock$1(), _createBlock$1(_component_VSelect, {
                                  key: 0,
                                  modelValue: form.value.episode_group_id,
                                  "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((form.value.episode_group_id) = $event)),
                                  items: (inspection.value?.groups || []).map(group => ({ title: `${group.name} · ${groupType(group.type)} · ${group.episode_count} 集`, value: group.id })),
                                  label: "选择 Group ID",
                                  class: "mt-2",
                                  "hide-details": ""
                                }, null, 8, ["modelValue", "items"]))
                              : _createCommentVNode$1("", true),
                            (selectedGroup.value)
                              ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_6$1, [
                                  _createElementVNode$1("div", null, _toDisplayString$1(selectedGroup.value.description || '该剧集组暂无说明'), 1),
                                  _createElementVNode$1("div", _hoisted_7$1, [
                                    (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(selectedGroup.value.seasons || [], (season) => {
                                      return (_openBlock$1(), _createElementBlock$1("span", {
                                        key: season.season,
                                        class: "me-3"
                                      }, "S" + _toDisplayString$1(season.season) + " · " + _toDisplayString$1(season.episode_count) + " 集", 1))
                                    }), 128))
                                  ])
                                ]))
                              : _createCommentVNode$1("", true)
                          ]),
                          _: 1
                        }, 8, ["color"])
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    _createElementVNode$1("div", _hoisted_8$1, [
                      _cache[19] || (_cache[19] = _createElementVNode$1("div", null, [
                        _createElementVNode$1("div", { class: "font-weight-bold" }, "季度片段定位"),
                        _createElementVNode$1("div", { class: "text-caption text-medium-emphasis" }, "仅用于“第三期 - 01”这类数字本身无法判断季度的标题")
                      ], -1)),
                      _createVNode$1(_component_VSpacer),
                      _createVNode$1(_component_VBtn, {
                        size: "small",
                        variant: "tonal",
                        "prepend-icon": "mdi-plus",
                        onClick: _cache[6] || (_cache[6] = $event => (addInstallment()))
                      }, {
                        default: _withCtx$1(() => [...(_cache[18] || (_cache[18] = [
                          _createTextVNode$1("添加片段", -1)
                        ]))]),
                        _: 1
                      })
                    ]),
                    (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(form.value.installments, (item, index) => {
                      return (_openBlock$1(), _createBlock$1(_component_VCard, {
                        key: item.id || index,
                        variant: "outlined",
                        class: "segment-card mb-3"
                      }, {
                        default: _withCtx$1(() => [
                          _createVNode$1(_component_VCardText, null, {
                            default: _withCtx$1(() => [
                              _createElementVNode$1("div", _hoisted_9$1, [
                                _createElementVNode$1("strong", null, _toDisplayString$1(item.title || `片段 ${index + 1}`), 1),
                                _createVNode$1(_component_VSpacer),
                                _createVNode$1(_component_VBtn, {
                                  icon: "mdi-delete-outline",
                                  size: "small",
                                  variant: "text",
                                  color: "error",
                                  onClick: $event => (removeInstallment(index))
                                }, null, 8, ["onClick"])
                              ]),
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
                                        label: "季度",
                                        placeholder: "2026-Q3"
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
                                        label: "来源季（可空）",
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
                _createVNode$1(_component_VDivider),
                _createVNode$1(_component_VCardActions, { class: "pa-4" }, {
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VBtn, {
                      color: "primary",
                      "prepend-icon": "mdi-content-save",
                      loading: loading.value,
                      onClick: saveRule
                    }, {
                      default: _withCtx$1(() => [...(_cache[20] || (_cache[20] = [
                        _createTextVNode$1("保存目标编集", -1)
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
        _createVNode$1(_component_VCol, {
          cols: "12",
          lg: "5"
        }, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCard, {
              variant: "outlined",
              class: "normalizer-card mb-4"
            }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardItem, null, {
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VCardTitle, null, {
                      default: _withCtx$1(() => [...(_cache[21] || (_cache[21] = [
                        _createTextVNode$1("归一化试跑", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$1(_component_VCardSubtitle, null, {
                      default: _withCtx$1(() => [...(_cache[22] || (_cache[22] = [
                        _createTextVNode$1("验证来源季集最终会落到哪里", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$1(_component_VCardText, null, {
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VTextField, {
                      modelValue: previewForm.value.title,
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((previewForm.value.title) = $event)),
                      label: "原标题（用于命中季度别名）",
                      class: "mb-2"
                    }, null, 8, ["modelValue"]),
                    _createVNode$1(_component_VRow, { dense: "" }, {
                      default: _withCtx$1(() => [
                        _createVNode$1(_component_VCol, { cols: "4" }, {
                          default: _withCtx$1(() => [
                            _createVNode$1(_component_VTextField, {
                              modelValue: previewForm.value.season,
                              "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((previewForm.value.season) = $event)),
                              label: "来源季",
                              type: "number"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        _createVNode$1(_component_VCol, { cols: "4" }, {
                          default: _withCtx$1(() => [
                            _createVNode$1(_component_VTextField, {
                              modelValue: previewForm.value.episode,
                              "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((previewForm.value.episode) = $event)),
                              label: "开始集",
                              type: "number"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        _createVNode$1(_component_VCol, { cols: "4" }, {
                          default: _withCtx$1(() => [
                            _createVNode$1(_component_VTextField, {
                              modelValue: previewForm.value.end_episode,
                              "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((previewForm.value.end_episode) = $event)),
                              label: "结束集",
                              type: "number"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    _createVNode$1(_component_VBtn, {
                      block: "",
                      color: "secondary",
                      "prepend-icon": "mdi-play",
                      loading: loading.value,
                      onClick: runPreview
                    }, {
                      default: _withCtx$1(() => [...(_cache[23] || (_cache[23] = [
                        _createTextVNode$1("试跑当前规则", -1)
                      ]))]),
                      _: 1
                    }, 8, ["loading"]),
                    (previewResult.value?.result)
                      ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
                          key: 0,
                          type: previewResult.value.result.applied ? 'success' : 'info',
                          variant: "tonal",
                          class: "mt-4"
                        }, {
                          default: _withCtx$1(() => [
                            _createElementVNode$1("div", _hoisted_10$1, [
                              _createTextVNode$1("S" + _toDisplayString$1(previewResult.value.result.season) + "E" + _toDisplayString$1(previewResult.value.result.episode), 1),
                              (previewResult.value.result.end_episode)
                                ? (_openBlock$1(), _createElementBlock$1("span", _hoisted_11$1, "-E" + _toDisplayString$1(previewResult.value.result.end_episode), 1))
                                : _createCommentVNode$1("", true)
                            ]),
                            _createElementVNode$1("div", null, _toDisplayString$1(previewResult.value.result.reason) + " · " + _toDisplayString$1(previewResult.value.result.strategy), 1)
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
              class: "normalizer-card"
            }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardItem, null, {
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VCardTitle, null, {
                      default: _withCtx$1(() => [...(_cache[24] || (_cache[24] = [
                        _createTextVNode$1("已维护规则", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$1(_component_VCardSubtitle, null, {
                      default: _withCtx$1(() => [
                        _createTextVNode$1(_toDisplayString$1(rules.value.length) + " 个 TMDB 条目", 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$1(_component_VList, { lines: "two" }, {
                  default: _withCtx$1(() => [
                    (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(rules.value, (rule) => {
                      return (_openBlock$1(), _createBlock$1(_component_VListItem, {
                        key: rule.tmdb_id,
                        title: rule.title,
                        subtitle: `TMDB ${rule.tmdb_id} · ${rule.target_type === 'group' ? '剧集组' : '默认编集'}`
                      }, {
                        prepend: _withCtx$1(() => [
                          _createVNode$1(_component_VAvatar, {
                            color: rule.enabled ? 'success' : 'default',
                            variant: "tonal"
                          }, {
                            default: _withCtx$1(() => [
                              _createVNode$1(_component_VIcon, { icon: "mdi-animation-outline" })
                            ]),
                            _: 1
                          }, 8, ["color"])
                        ]),
                        append: _withCtx$1(() => [
                          _createVNode$1(_component_VBtn, {
                            icon: "mdi-pencil-outline",
                            variant: "text",
                            onClick: $event => (editRule(rule))
                          }, null, 8, ["onClick"]),
                          _createVNode$1(_component_VBtn, {
                            icon: "mdi-delete-outline",
                            variant: "text",
                            color: "error",
                            onClick: $event => (deleteRule(rule.tmdb_id))
                          }, null, 8, ["onClick"])
                        ]),
                        _: 2
                      }, 1032, ["title", "subtitle"]))
                    }), 128)),
                    (!rules.value.length)
                      ? (_openBlock$1(), _createBlock$1(_component_VListItem, {
                          key: 0,
                          title: "还没有目标编集规则",
                          subtitle: "从左侧手动添加，或从下方季度目录创建"
                        }))
                      : _createCommentVNode$1("", true)
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
    _createVNode$1(_component_VCard, {
      variant: "outlined",
      class: "normalizer-card mt-4"
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
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardTitle, null, {
              default: _withCtx$1(() => [...(_cache[25] || (_cache[25] = [
                _createTextVNode$1("季度番剧看板", -1)
              ]))]),
              _: 1
            }),
            _createVNode$1(_component_VCardSubtitle, null, {
              default: _withCtx$1(() => [...(_cache[26] || (_cache[26] = [
                _createTextVNode$1("Bangumi 官方 API 导入；TMDB 匹配后再选择目标编集", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$1(_component_VCardText, null, {
          default: _withCtx$1(() => [
            _createElementVNode$1("div", _hoisted_12$1, [
              _createVNode$1(_component_VTextField, {
                modelValue: importForm.value.year,
                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((importForm.value.year) = $event)),
                label: "年份",
                type: "number",
                density: "compact",
                "hide-details": "",
                class: "quarter-field"
              }, null, 8, ["modelValue"]),
              _createVNode$1(_component_VSelect, {
                modelValue: importForm.value.quarter,
                "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((importForm.value.quarter) = $event)),
                items: [1,2,3,4].map(value => ({ title: `Q${value}`, value })),
                label: "季度",
                density: "compact",
                "hide-details": "",
                class: "quarter-field"
              }, null, 8, ["modelValue", "items"]),
              _createVNode$1(_component_VBtn, {
                color: "secondary",
                "prepend-icon": "mdi-cloud-download-outline",
                loading: loading.value,
                onClick: importQuarter
              }, {
                default: _withCtx$1(() => [...(_cache[27] || (_cache[27] = [
                  _createTextVNode$1("导入季度列表", -1)
                ]))]),
                _: 1
              }, 8, ["loading"]),
              _createVNode$1(_component_VSpacer),
              _createVNode$1(_component_VBtn, {
                icon: "mdi-refresh",
                variant: "text",
                loading: loading.value,
                onClick: loadData
              }, null, 8, ["loading"])
            ]),
            _createElementVNode$1("div", _hoisted_13$1, [
              (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(catalog.value, (item) => {
                return (_openBlock$1(), _createBlock$1(_component_VCard, {
                  key: item.id,
                  variant: "outlined",
                  class: "catalog-card"
                }, {
                  default: _withCtx$1(() => [
                    (item.poster)
                      ? (_openBlock$1(), _createBlock$1(_component_VImg, {
                          key: 0,
                          src: item.poster,
                          height: "150",
                          cover: ""
                        }, null, 8, ["src"]))
                      : _createCommentVNode$1("", true),
                    _createVNode$1(_component_VCardItem, null, {
                      default: _withCtx$1(() => [
                        _createVNode$1(_component_VCardTitle, { class: "text-subtitle-1" }, {
                          default: _withCtx$1(() => [
                            _createTextVNode$1(_toDisplayString$1(item.name_cn || item.name), 1)
                          ]),
                          _: 2
                        }, 1024),
                        _createVNode$1(_component_VCardSubtitle, null, {
                          default: _withCtx$1(() => [
                            _createTextVNode$1(_toDisplayString$1(item.quarter) + " · " + _toDisplayString$1(item.date || '日期未知') + " · " + _toDisplayString$1(item.episode_count || '?') + " 集", 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024),
                    (item.tmdb_match?.best)
                      ? (_openBlock$1(), _createBlock$1(_component_VCardText, {
                          key: 1,
                          class: "pt-0"
                        }, {
                          default: _withCtx$1(() => [
                            _createVNode$1(_component_VChip, {
                              color: item.tmdb_match.accepted ? 'success' : 'warning',
                              size: "small"
                            }, {
                              default: _withCtx$1(() => [
                                _createTextVNode$1("TMDB " + _toDisplayString$1(item.tmdb_match.best.tmdb_id) + " · " + _toDisplayString$1(item.tmdb_match.best.score) + " 分", 1)
                              ]),
                              _: 2
                            }, 1032, ["color"]),
                            _createElementVNode$1("div", _hoisted_14$1, _toDisplayString$1(item.tmdb_match.best.name), 1)
                          ]),
                          _: 2
                        }, 1024))
                      : _createCommentVNode$1("", true),
                    _createVNode$1(_component_VCardActions, null, {
                      default: _withCtx$1(() => [
                        _createVNode$1(_component_VBtn, {
                          size: "small",
                          variant: "tonal",
                          loading: loading.value,
                          onClick: $event => (matchCatalog(item))
                        }, {
                          default: _withCtx$1(() => [...(_cache[28] || (_cache[28] = [
                            _createTextVNode$1("匹配 TMDB", -1)
                          ]))]),
                          _: 1
                        }, 8, ["loading", "onClick"]),
                        (item.tmdb_match?.accepted)
                          ? (_openBlock$1(), _createBlock$1(_component_VBtn, {
                              key: 0,
                              size: "small",
                              color: "primary",
                              onClick: $event => (useCatalogItem(item))
                            }, {
                              default: _withCtx$1(() => [...(_cache[29] || (_cache[29] = [
                                _createTextVNode$1("建立目标", -1)
                              ]))]),
                              _: 1
                            }, 8, ["onClick"]))
                          : _createCommentVNode$1("", true)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024))
              }), 128)),
              (!catalog.value.length)
                ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_15$1, [
                    _createVNode$1(_component_VIcon, {
                      icon: "mdi-calendar-blank-outline",
                      size: "48"
                    }),
                    _cache[30] || (_cache[30] = _createElementVNode$1("div", null, "导入一个季度后在这里选择番剧", -1))
                  ]))
                : _createCommentVNode$1("", true)
            ])
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
const EpisodeNormalizer = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-3f1baa13"]]);

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
