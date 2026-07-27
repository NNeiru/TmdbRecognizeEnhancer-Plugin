import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { u as unwrapResponse } from './utils-Wv8mt00E.js';
import { M as ModuleHeader } from './ModuleHeader-D43l2fc-.js';
import { _ as _export_sfc } from './_plugin-vue_export-helper-pcqpp-6-.js';

const {createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,createVNode:_createVNode,unref:_unref,toDisplayString:_toDisplayString,openBlock:_openBlock,createBlock:_createBlock,createCommentVNode:_createCommentVNode,createElementVNode:_createElementVNode,createElementBlock:_createElementBlock,renderList:_renderList,Fragment:_Fragment} = await importShared('vue');


const _hoisted_1 = {
  key: 2,
  class: "live-strip mb-4"
};
const _hoisted_2 = { class: "live-metric" };
const _hoisted_3 = {
  viewBox: "0 0 180 42",
  preserveAspectRatio: "none"
};
const _hoisted_4 = ["points"];
const _hoisted_5 = { class: "live-metric" };
const _hoisted_6 = {
  viewBox: "0 0 180 42",
  preserveAspectRatio: "none"
};
const _hoisted_7 = ["points"];
const _hoisted_8 = { class: "live-metric" };
const _hoisted_9 = {
  viewBox: "0 0 180 42",
  preserveAspectRatio: "none"
};
const _hoisted_10 = ["points"];
const _hoisted_11 = { class: "live-metric" };
const _hoisted_12 = {
  viewBox: "0 0 180 42",
  preserveAspectRatio: "none"
};
const _hoisted_13 = ["points"];
const _hoisted_14 = {
  key: 3,
  class: "diagnostic-grid mb-4"
};
const _hoisted_15 = {
  key: 4,
  class: "finding-list"
};
const _hoisted_16 = {
  key: 5,
  class: "empty-state"
};
const _hoisted_17 = { class: "text-h6 mt-3" };

const {computed,onBeforeUnmount,onMounted,ref,watch} = await importShared('vue');


const _sfc_main = {
  __name: 'PerformanceDiagnostics',
  props: { api: { type: Object, default: () => ({}) }, pluginId: { type: String, default: 'TmdbRecognizeEnhancer' } },
  setup(__props) {

const props = __props;
const loading = ref(false);
const error = ref('');
const server = ref(null);
const browser = ref(null);
const samples = ref([]);
const autoRefresh = ref(true);
const intervalSeconds = ref(3);
let timer = null;
const pluginBase = computed(() => `plugin/${props.pluginId || 'TmdbRecognizeEnhancer'}`);
const intervalItems = [2, 3, 5, 10].map(value => ({ title: `${value} 秒`, value }));

function mb(value) { return value == null ? '不可用' : `${value} MB` }
function rate(value) { return value == null ? '不可用' : `${value} KB/s` }
function duration(value) {
  if (value == null) return '不可用'
  const seconds = Number(value) || 0;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds % 86400 / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  return days ? `${days} 天 ${hours} 小时` : hours ? `${hours} 小时 ${minutes} 分` : `${minutes} 分钟`
}
function explainError(err) {
  const status = err?.response?.status || err?.status;
  if (status === 404 || String(err?.message || '').includes('404')) return '后端仍是旧插件实例，尚未注册诊断接口；请重载插件或重启一次 MP 容器。'
  return err?.message || '性能采样失败'
}

async function sampleBrowser() {
  const started = performance.now();
  let frames = 0;
  await new Promise(resolve => {
    const end = started + 300;
    const tick = now => { frames += 1; if (now < end) requestAnimationFrame(tick); else resolve(); };
    requestAnimationFrame(tick);
  });
  const elapsed = Math.max(performance.now() - started, 1);
  const memory = performance.memory;
  return {
    fps: Math.min(120, Math.round(frames * 1000 / elapsed)),
    dom_nodes: document.getElementsByTagName('*').length,
    js_heap_mb: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024 * 10) / 10 : null,
    heap_limit_mb: memory ? Math.round(memory.jsHeapSizeLimit / 1024 / 1024) : null,
  }
}

function addSample(serverResult, browserResult) {
  samples.value = [...samples.value, {
    time: Date.now(),
    process_cpu: Number(serverResult.process?.cpu_percent || 0),
    system_cpu: Number(serverResult.system?.cpu_percent || 0),
    rss: Number(serverResult.process?.rss_mb || 0),
    api_rtt: Number(browserResult.api_rtt_ms || 0),
    fps: Number(browserResult.fps || 0),
  }].slice(-30);
}

async function sample() {
  if (loading.value) return
  loading.value = true;
  error.value = '';
  const requestStart = performance.now();
  try {
    const [response, browserResult] = await Promise.all([
      props.api.get(`${pluginBase.value}/diagnostics`), sampleBrowser(),
    ]);
    const serverResult = unwrapResponse(response);
    const completedBrowser = { ...browserResult, api_rtt_ms: Math.round((performance.now() - requestStart) * 10) / 10 };
    server.value = serverResult;
    browser.value = completedBrowser;
    addSample(serverResult, completedBrowser);
  } catch (err) { error.value = explainError(err); }
  finally { loading.value = false; }
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}
function syncTimer() {
  stopTimer();
  if (!autoRefresh.value) return
  sample();
  timer = setInterval(sample, Math.max(2, Number(intervalSeconds.value) || 3) * 1000);
}

watch([autoRefresh, intervalSeconds], syncTimer);
onMounted(syncTimer);
onBeforeUnmount(stopTimer);

function sparkline(key) {
  const values = samples.value.map(item => Number(item[key])).filter(Number.isFinite);
  if (!values.length) return ''
  const width = 180;
  const height = 42;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1);
  return values.map((value, index) => {
    const x = values.length === 1 ? width : index * width / (values.length - 1);
    const y = height - 3 - (value - min) / spread * (height - 6);
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

const browserFindings = computed(() => {
  const result = [];
  if (browser.value?.fps != null && browser.value.fps < 30) result.push({ level: 'warning', title: '当前管理页面帧率偏低', detail: `短时约 ${browser.value.fps} FPS，卡顿更偏向浏览器渲染侧。` });
  if (browser.value?.api_rtt_ms >= 1200) result.push({ level: 'warning', title: '插件接口响应偏慢', detail: `本次往返约 ${browser.value.api_rtt_ms} ms，需结合 MP CPU、I/O 和季度扫描判断。` });
  if (browser.value?.dom_nodes >= 8000) result.push({ level: 'warning', title: '页面 DOM 节点较多', detail: `当前约 ${browser.value.dom_nodes} 个节点，超长列表可能造成滚动卡顿。` });
  return result
});
const findings = computed(() => {
  const browserItems = browserFindings.value;
  const serverItems = server.value?.findings || [];
  const filteredServer = browserItems.length
    ? serverItems.filter(item => !(item.level === 'success' && item.title?.includes('未发现明显')))
    : serverItems;
  return [...filteredServer, ...browserItems]
});

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VSelect = _resolveComponent("VSelect");
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent("VCardSubtitle");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VProgressCircular = _resolveComponent("VProgressCircular");
  const _component_VIcon = _resolveComponent("VIcon");

  return (_openBlock(), _createElementBlock("div", null, [
    _createVNode(ModuleHeader, {
      icon: "mdi-speedometer",
      title: "性能与占用诊断",
      subtitle: "区分 MoviePilot 后端负载、插件任务和当前浏览器页面卡顿；最多保留 30 个页面内采样点。",
      color: "secondary"
    }, {
      actions: _withCtx(() => [
        _createVNode(_component_VBtn, {
          color: "primary",
          "prepend-icon": "mdi-refresh",
          loading: loading.value,
          onClick: sample
        }, {
          default: _withCtx(() => [...(_cache[3] || (_cache[3] = [
            _createTextVNode("立即采样", -1)
          ]))]),
          _: 1
        }, 8, ["loading"])
      ]),
      controls: _withCtx(() => [
        _createVNode(_component_VSwitch, {
          modelValue: autoRefresh.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((autoRefresh).value = $event)),
          color: "success",
          label: "实时刷新",
          "hide-details": ""
        }, null, 8, ["modelValue"]),
        _createVNode(_component_VSelect, {
          modelValue: intervalSeconds.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((intervalSeconds).value = $event)),
          items: _unref(intervalItems),
          "item-title": "title",
          "item-value": "value",
          density: "compact",
          "hide-details": "",
          class: "interval-select",
          disabled: !autoRefresh.value
        }, null, 8, ["modelValue", "items", "disabled"])
      ]),
      _: 1
    }),
    (error.value)
      ? (_openBlock(), _createBlock(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          closable: "",
          class: "mb-4",
          "onClick:close": _cache[2] || (_cache[2] = $event => (error.value = ''))
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
      default: _withCtx(() => [...(_cache[4] || (_cache[4] = [
        _createTextVNode("实时刷新只在本页打开时工作，离开页面即停止；推荐 3–5 秒间隔。进程 CPU 需至少两个采样点才有参考价值。", -1)
      ]))]),
      _: 1
    }),
    (server.value?.errors?.length)
      ? (_openBlock(), _createBlock(_component_VAlert, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(server.value.errors.join('；')) + "。已自动改用系统原生兼容采样，个别指标可能显示不可用。", 1)
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    (server.value)
      ? (_openBlock(), _createElementBlock("div", _hoisted_1, [
          _createElementVNode("div", _hoisted_2, [
            _cache[5] || (_cache[5] = _createElementVNode("span", null, "MP CPU", -1)),
            _createElementVNode("strong", null, _toDisplayString(server.value.process?.cpu_percent ?? '—') + "%", 1),
            (_openBlock(), _createElementBlock("svg", _hoisted_3, [
              _createElementVNode("polyline", {
                points: sparkline('process_cpu')
              }, null, 8, _hoisted_4)
            ]))
          ]),
          _createElementVNode("div", _hoisted_5, [
            _cache[6] || (_cache[6] = _createElementVNode("span", null, "常驻内存", -1)),
            _createElementVNode("strong", null, _toDisplayString(mb(server.value.process?.rss_mb)), 1),
            (_openBlock(), _createElementBlock("svg", _hoisted_6, [
              _createElementVNode("polyline", {
                points: sparkline('rss')
              }, null, 8, _hoisted_7)
            ]))
          ]),
          _createElementVNode("div", _hoisted_8, [
            _cache[7] || (_cache[7] = _createElementVNode("span", null, "接口往返", -1)),
            _createElementVNode("strong", null, _toDisplayString(browser.value?.api_rtt_ms ?? '—') + " ms", 1),
            (_openBlock(), _createElementBlock("svg", _hoisted_9, [
              _createElementVNode("polyline", {
                points: sparkline('api_rtt')
              }, null, 8, _hoisted_10)
            ]))
          ]),
          _createElementVNode("div", _hoisted_11, [
            _cache[8] || (_cache[8] = _createElementVNode("span", null, "页面帧率", -1)),
            _createElementVNode("strong", null, _toDisplayString(browser.value?.fps ?? '—') + " FPS", 1),
            (_openBlock(), _createElementBlock("svg", _hoisted_12, [
              _createElementVNode("polyline", {
                points: sparkline('fps')
              }, null, 8, _hoisted_13)
            ]))
          ])
        ]))
      : _createCommentVNode("", true),
    (server.value)
      ? (_openBlock(), _createElementBlock("div", _hoisted_14, [
          _createVNode(_component_VCard, { variant: "outlined" }, {
            default: _withCtx(() => [
              _createVNode(_component_VCardItem, null, {
                default: _withCtx(() => [
                  _createVNode(_component_VCardTitle, null, {
                    default: _withCtx(() => [...(_cache[9] || (_cache[9] = [
                      _createTextVNode("MoviePilot 进程", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode(_component_VCardSubtitle, null, {
                    default: _withCtx(() => [
                      _createTextVNode("PID " + _toDisplayString(server.value.process?.pid) + " · 已运行 " + _toDisplayString(duration(server.value.process?.uptime_seconds)), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx(() => [
                  _createElementVNode("div", null, [
                    _cache[10] || (_cache[10] = _createElementVNode("span", null, "CPU / 内存占比", -1)),
                    _createElementVNode("strong", null, _toDisplayString(server.value.process?.cpu_percent ?? '—') + "% / " + _toDisplayString(server.value.process?.memory_percent ?? '—') + "%", 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[11] || (_cache[11] = _createElementVNode("span", null, "RSS / 虚拟内存", -1)),
                    _createElementVNode("strong", null, _toDisplayString(mb(server.value.process?.rss_mb)) + " / " + _toDisplayString(mb(server.value.process?.vms_mb)), 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[12] || (_cache[12] = _createElementVNode("span", null, "线程 / 文件描述符", -1)),
                    _createElementVNode("strong", null, _toDisplayString(server.value.process?.threads ?? '—') + " / " + _toDisplayString(server.value.process?.file_descriptors ?? '—'), 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[13] || (_cache[13] = _createElementVNode("span", null, "读取 / 写入", -1)),
                    _createElementVNode("strong", null, _toDisplayString(rate(server.value.process?.io_read_kbps)) + " / " + _toDisplayString(rate(server.value.process?.io_write_kbps)), 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode(_component_VCard, { variant: "outlined" }, {
            default: _withCtx(() => [
              _createVNode(_component_VCardItem, null, {
                default: _withCtx(() => [
                  _createVNode(_component_VCardTitle, null, {
                    default: _withCtx(() => [...(_cache[14] || (_cache[14] = [
                      _createTextVNode("服务器资源", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode(_component_VCardSubtitle, null, {
                    default: _withCtx(() => [
                      _createTextVNode(_toDisplayString(server.value.system?.cpu_count) + " 逻辑 CPU · " + _toDisplayString(server.value.system?.platform), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx(() => [
                  _createElementVNode("div", null, [
                    _cache[15] || (_cache[15] = _createElementVNode("span", null, "整机 CPU / Load", -1)),
                    _createElementVNode("strong", null, _toDisplayString(server.value.system?.cpu_percent ?? '—') + "% / " + _toDisplayString(server.value.system?.load_average?.join(' / ') || '—'), 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[16] || (_cache[16] = _createElementVNode("span", null, "内存 / Swap", -1)),
                    _createElementVNode("strong", null, _toDisplayString(server.value.system?.memory_percent ?? '—') + "% / " + _toDisplayString(server.value.system?.swap_percent ?? '—') + "%", 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[17] || (_cache[17] = _createElementVNode("span", null, "可用内存", -1)),
                    _createElementVNode("strong", null, _toDisplayString(mb(server.value.system?.memory_available_mb)), 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[18] || (_cache[18] = _createElementVNode("span", null, "磁盘使用 / 剩余", -1)),
                    _createElementVNode("strong", null, _toDisplayString(server.value.system?.disk_percent ?? '—') + "% / " + _toDisplayString(mb(server.value.system?.disk_free_mb)), 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode(_component_VCard, { variant: "outlined" }, {
            default: _withCtx(() => [
              _createVNode(_component_VCardItem, null, {
                default: _withCtx(() => [
                  _createVNode(_component_VCardTitle, null, {
                    default: _withCtx(() => [...(_cache[19] || (_cache[19] = [
                      _createTextVNode("插件运行量", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode(_component_VCardSubtitle, null, {
                    default: _withCtx(() => [
                      _createTextVNode("服务端采样 " + _toDisplayString(server.value.sampling_ms) + " ms · 序号 " + _toDisplayString(server.value.sequence), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx(() => [
                  _createElementVNode("div", null, [
                    _cache[20] || (_cache[20] = _createElementVNode("span", null, "季度扫描 / 看板条目", -1)),
                    _createElementVNode("strong", null, _toDisplayString(server.value.plugin?.active_catalog_scans || 0) + " / " + _toDisplayString(server.value.plugin?.season_catalog_items || 0), 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[21] || (_cache[21] = _createElementVNode("span", null, "集数规则 / 字段覆盖", -1)),
                    _createElementVNode("strong", null, _toDisplayString(server.value.plugin?.episode_rules || 0) + " / " + _toDisplayString(server.value.plugin?.compiled_rules || 0), 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[22] || (_cache[22] = _createElementVNode("span", null, "自定义字段 / 命名规则", -1)),
                    _createElementVNode("strong", null, _toDisplayString(server.value.plugin?.custom_rename_fields || 0) + " / " + _toDisplayString((server.value.plugin?.rename_mapping_rules || 0) + (server.value.plugin?.release_group_rules || 0)), 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[23] || (_cache[23] = _createElementVNode("span", null, "外部缓存 / 模块日志", -1)),
                    _createElementVNode("strong", null, _toDisplayString(server.value.plugin?.web_cache_entries || 0) + " / " + _toDisplayString(server.value.plugin?.history_records || 0), 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _createVNode(_component_VCard, { variant: "outlined" }, {
            default: _withCtx(() => [
              _createVNode(_component_VCardItem, null, {
                default: _withCtx(() => [
                  _createVNode(_component_VCardTitle, null, {
                    default: _withCtx(() => [...(_cache[24] || (_cache[24] = [
                      _createTextVNode("当前浏览器页面", -1)
                    ]))]),
                    _: 1
                  }),
                  _createVNode(_component_VCardSubtitle, null, {
                    default: _withCtx(() => [
                      _createTextVNode(_toDisplayString(samples.value.length) + " / 30 个趋势采样点", 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              _createVNode(_component_VCardText, { class: "metric-list" }, {
                default: _withCtx(() => [
                  _createElementVNode("div", null, [
                    _cache[25] || (_cache[25] = _createElementVNode("span", null, "短时帧率", -1)),
                    _createElementVNode("strong", null, _toDisplayString(browser.value?.fps ?? '—') + " FPS", 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[26] || (_cache[26] = _createElementVNode("span", null, "DOM 节点", -1)),
                    _createElementVNode("strong", null, _toDisplayString(browser.value?.dom_nodes ?? '—'), 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[27] || (_cache[27] = _createElementVNode("span", null, "JS 堆 / 上限", -1)),
                    _createElementVNode("strong", null, _toDisplayString(browser.value?.js_heap_mb == null ? '浏览器不提供' : `${mb(browser.value.js_heap_mb)} / ${mb(browser.value.heap_limit_mb)}`), 1)
                  ]),
                  _createElementVNode("div", null, [
                    _cache[28] || (_cache[28] = _createElementVNode("span", null, "接口往返", -1)),
                    _createElementVNode("strong", null, _toDisplayString(browser.value?.api_rtt_ms ?? '—') + " ms", 1)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]))
      : _createCommentVNode("", true),
    (findings.value.length)
      ? (_openBlock(), _createElementBlock("div", _hoisted_15, [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(findings.value, (item, index) => {
            return (_openBlock(), _createBlock(_component_VAlert, {
              key: index,
              type: item.level,
              variant: "tonal",
              density: "compact"
            }, {
              default: _withCtx(() => [
                _createElementVNode("strong", null, _toDisplayString(item.title), 1),
                _createElementVNode("div", null, _toDisplayString(item.detail), 1)
              ]),
              _: 2
            }, 1032, ["type"]))
          }), 128))
        ]))
      : (_openBlock(), _createElementBlock("div", _hoisted_16, [
          (loading.value)
            ? (_openBlock(), _createBlock(_component_VProgressCircular, {
                key: 0,
                indeterminate: "",
                color: "primary"
              }))
            : (_openBlock(), _createBlock(_component_VIcon, {
                key: 1,
                icon: "mdi-gauge-empty",
                size: "52"
              })),
          _createElementVNode("div", _hoisted_17, _toDisplayString(loading.value ? '正在采样' : '尚无诊断结果'), 1)
        ]))
  ]))
}
}

};
const PerformanceDiagnostics = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-db27feb0"]]);

export { PerformanceDiagnostics as default };
