import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import AppPage from './__federation_expose_AppPage-Ujc7NUVj.js';
import { _ as _export_sfc } from './utils-DQdVpqbx.js';

const {resolveComponent:_resolveComponent,createVNode:_createVNode,createElementVNode:_createElementVNode,mergeProps:_mergeProps,withCtx:_withCtx,openBlock:_openBlock,createElementBlock:_createElementBlock} = await importShared('vue');


const _hoisted_1 = { class: "plugin-page" };

const {ref} = await importShared('vue');


const _sfc_main = {
  __name: 'Page',
  props: { api: { type: Object, default: () => ({}) } },
  emits: ['close'],
  setup(__props, { emit: __emit }) {


const emit = __emit;
const pageRef = ref(null);

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VSpacer = _resolveComponent("VSpacer");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VTooltip = _resolveComponent("VTooltip");
  const _component_VToolbar = _resolveComponent("VToolbar");
  const _component_VDivider = _resolveComponent("VDivider");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode(_component_VToolbar, {
      density: "comfortable",
      class: "toolbar"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VIcon, {
          icon: "mdi-database-search-outline",
          color: "primary",
          class: "ms-3"
        }),
        _cache[4] || (_cache[4] = _createElementVNode("div", { class: "text-subtitle-1 font-weight-bold ms-3" }, "媒体整理增强", -1)),
        _createVNode(_component_VSpacer),
        _createVNode(_component_VTooltip, {
          text: "重载插件后端（更新插件后让新代码生效）",
          location: "bottom"
        }, {
          activator: _withCtx(({ props: tip }) => [
            _createVNode(_component_VBtn, _mergeProps(tip, {
              icon: "mdi-restart",
              variant: "text",
              loading: pageRef.value?.reloadingBackend,
              onClick: _cache[0] || (_cache[0] = $event => (pageRef.value?.reloadBackend()))
            }), null, 16, ["loading"])
          ]),
          _: 1
        }),
        _createVNode(_component_VBtn, {
          icon: "mdi-refresh",
          variant: "text",
          loading: pageRef.value?.loading,
          onClick: _cache[1] || (_cache[1] = $event => (pageRef.value?.loadStatus()))
        }, null, 8, ["loading"]),
        _createVNode(_component_VBtn, {
          icon: "mdi-content-save",
          variant: "text",
          color: "primary",
          loading: pageRef.value?.saving,
          onClick: _cache[2] || (_cache[2] = $event => (pageRef.value?.saveConfig()))
        }, null, 8, ["loading"]),
        _createVNode(_component_VBtn, {
          icon: "mdi-close",
          variant: "text",
          onClick: _cache[3] || (_cache[3] = $event => (emit('close')))
        })
      ]),
      _: 1
    }),
    _createVNode(_component_VDivider),
    _createVNode(AppPage, {
      ref_key: "pageRef",
      ref: pageRef,
      api: __props.api,
      "plugin-id": "TmdbRecognizeEnhancer",
      "hide-title": ""
    }, null, 8, ["api"])
  ]))
}
}

};
const Page = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-2e943688"]]);

export { Page as default };
