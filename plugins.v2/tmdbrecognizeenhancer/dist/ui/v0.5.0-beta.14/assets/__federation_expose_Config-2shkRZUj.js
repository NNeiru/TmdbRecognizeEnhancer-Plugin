import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { S as StrategySettings } from './StrategySettings-DhwH1zA4.js';
import { c as cloneConfig, u as unwrapResponse, e as ensureUiVersion } from './utils-DmzjRxpT.js';

const {resolveComponent:_resolveComponent,createVNode:_createVNode,withCtx:_withCtx,createElementVNode:_createElementVNode,unref:_unref,openBlock:_openBlock,createElementBlock:_createElementBlock} = await importShared('vue');


const _hoisted_1 = { class: "tmdb-config" };

const {onMounted,ref} = await importShared('vue');


const _sfc_main = {
  __name: 'Config',
  props: {
  initialConfig: { type: Object, default: () => ({}) },
  api: { type: Object, default: () => ({}) },
},
  emits: ['save', 'close'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;
const config = ref(cloneConfig());

onMounted(async () => {
  config.value = cloneConfig(props.initialConfig);
  try {
    const status = unwrapResponse(await props.api.get('plugin/TmdbRecognizeEnhancer/status'));
    ensureUiVersion(status?.backend_version);
  } catch (_) {
    // 配置本身仍可使用；版本检查失败不能阻止用户关闭弹窗。
  }
});

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VAvatar = _resolveComponent("VAvatar");
  const _component_VSpacer = _resolveComponent("VSpacer");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VToolbar = _resolveComponent("VToolbar");
  const _component_VDivider = _resolveComponent("VDivider");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode(_component_VToolbar, {
      density: "comfortable",
      color: "transparent"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VAvatar, {
          class: "ms-3",
          size: "34",
          color: "primary",
          variant: "tonal"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VIcon, {
              icon: "mdi-database-search-outline",
              size: "20"
            })
          ]),
          _: 1
        }),
        _cache[3] || (_cache[3] = _createElementVNode("div", { class: "ms-3" }, [
          _createElementVNode("div", { class: "text-subtitle-1 font-weight-bold" }, "TMDB 识别增强"),
          _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, "候选选择策略")
        ], -1)),
        _createVNode(_component_VSpacer),
        _createVNode(_component_VBtn, {
          icon: "mdi-content-save",
          variant: "text",
          color: "primary",
          onClick: _cache[0] || (_cache[0] = $event => (emit('save', _unref(cloneConfig)(config.value))))
        }),
        _createVNode(_component_VBtn, {
          icon: "mdi-close",
          variant: "text",
          onClick: _cache[1] || (_cache[1] = $event => (emit('close')))
        })
      ]),
      _: 1
    }),
    _createVNode(_component_VDivider),
    _createVNode(StrategySettings, {
      modelValue: config.value,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config).value = $event)),
      compact: "",
      class: "pa-4"
    }, null, 8, ["modelValue"])
  ]))
}
}

};

export { _sfc_main as default };
