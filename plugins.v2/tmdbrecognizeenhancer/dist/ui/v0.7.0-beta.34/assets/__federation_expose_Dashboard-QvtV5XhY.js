import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { _ as _export_sfc, u as unwrapResponse, e as ensureUiVersion } from './utils-DqT4SFj4.js';

const {resolveComponent:_resolveComponent,createVNode:_createVNode,withCtx:_withCtx,toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,createElementVNode:_createElementVNode,openBlock:_openBlock,createBlock:_createBlock,createCommentVNode:_createCommentVNode} = await importShared('vue');


const _hoisted_1 = { class: "dashboard-metrics" };
const _hoisted_2 = { class: "text-success" };

const {computed,onMounted,ref} = await importShared('vue');


const _sfc_main = {
  __name: 'Dashboard',
  props: {
  api: { type: Object, default: () => ({}) },
  config: { type: Object, default: () => ({ attrs: {} }) },
  allowRefresh: { type: Boolean, default: true },
},
  setup(__props) {

const props = __props;
const loading = ref(false);
const status = ref({ summary: {} });
const summary = computed(() => status.value.summary || {});
const attrs = computed(() => props.config?.attrs || {});

async function loadStatus() {
  loading.value = true;
  try {
    const nextStatus = unwrapResponse(await props.api.get('plugin/TmdbRecognizeEnhancer/status')) || status.value;
    ensureUiVersion(nextStatus.backend_version);
    status.value = nextStatus;
  } finally {
    loading.value = false;
  }
}
onMounted(loadStatus);

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VAvatar = _resolveComponent("VAvatar");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardSubtitle = _resolveComponent("VCardSubtitle");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VDivider = _resolveComponent("VDivider");
  const _component_VSpacer = _resolveComponent("VSpacer");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VCardActions = _resolveComponent("VCardActions");
  const _component_VCard = _resolveComponent("VCard");

  return (_openBlock(), _createBlock(_component_VCard, {
    loading: loading.value,
    flat: attrs.value.border === false,
    class: "dashboard-card"
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
            default: _withCtx(() => [
              _createTextVNode(_toDisplayString(attrs.value.title || '媒体整理增强'), 1)
            ]),
            _: 1
          }),
          _createVNode(_component_VCardSubtitle, null, {
            default: _withCtx(() => [
              _createTextVNode(_toDisplayString(summary.value.enabled ? '插件总开关已开启' : '插件当前未启用'), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      _createVNode(_component_VCardText, null, {
        default: _withCtx(() => [
          _createElementVNode("div", _hoisted_1, [
            _createElementVNode("div", null, [
              _cache[0] || (_cache[0] = _createElementVNode("span", null, "最近处理", -1)),
              _createElementVNode("strong", null, _toDisplayString(summary.value.total || 0), 1)
            ]),
            _createElementVNode("div", null, [
              _cache[1] || (_cache[1] = _createElementVNode("span", null, "已接纳", -1)),
              _createElementVNode("strong", _hoisted_2, _toDisplayString(summary.value.accepted || 0), 1)
            ]),
            _createElementVNode("div", null, [
              _cache[2] || (_cache[2] = _createElementVNode("span", null, "接纳率", -1)),
              _createElementVNode("strong", null, _toDisplayString(summary.value.acceptance_rate || 0) + "%", 1)
            ])
          ])
        ]),
        _: 1
      }),
      (__props.allowRefresh)
        ? (_openBlock(), _createBlock(_component_VDivider, { key: 0 }))
        : _createCommentVNode("", true),
      (__props.allowRefresh)
        ? (_openBlock(), _createBlock(_component_VCardActions, { key: 1 }, {
            default: _withCtx(() => [
              _createVNode(_component_VSpacer),
              _createVNode(_component_VBtn, {
                icon: "mdi-refresh",
                variant: "text",
                size: "small",
                loading: loading.value,
                onClick: loadStatus
              }, null, 8, ["loading"])
            ]),
            _: 1
          }))
        : _createCommentVNode("", true)
    ]),
    _: 1
  }, 8, ["loading", "flat"]))
}
}

};
const Dashboard = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-8910b95a"]]);

export { Dashboard as default };
