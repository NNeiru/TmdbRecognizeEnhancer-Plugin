import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { _ as _export_sfc } from './_plugin-vue_export-helper-pcqpp-6-.js';

const {resolveComponent:_resolveComponent,createVNode:_createVNode,withCtx:_withCtx,toDisplayString:_toDisplayString,createElementVNode:_createElementVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,renderSlot:_renderSlot} = await importShared('vue');


const _hoisted_1 = { class: "module-header" };
const _hoisted_2 = { class: "module-header__main" };
const _hoisted_3 = { class: "module-header__identity" };
const _hoisted_4 = { class: "module-header__copy" };
const _hoisted_5 = { key: 0 };
const _hoisted_6 = {
  key: 0,
  class: "module-header__actions"
};
const _hoisted_7 = {
  key: 0,
  class: "module-header__controls"
};


const _sfc_main = {
  __name: 'ModuleHeader',
  props: {
  icon: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  color: { type: String, default: 'primary' },
},
  setup(__props) {



return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VAvatar = _resolveComponent("VAvatar");

  return (_openBlock(), _createElementBlock("section", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("div", _hoisted_3, [
        _createVNode(_component_VAvatar, {
          color: __props.color,
          variant: "tonal",
          size: "44",
          class: "module-header__icon"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VIcon, {
              icon: __props.icon,
              size: "23"
            }, null, 8, ["icon"])
          ]),
          _: 1
        }, 8, ["color"]),
        _createElementVNode("div", _hoisted_4, [
          _createElementVNode("h2", null, _toDisplayString(__props.title), 1),
          (__props.subtitle)
            ? (_openBlock(), _createElementBlock("p", _hoisted_5, _toDisplayString(__props.subtitle), 1))
            : _createCommentVNode("", true)
        ])
      ]),
      (_ctx.$slots.actions)
        ? (_openBlock(), _createElementBlock("div", _hoisted_6, [
            _renderSlot(_ctx.$slots, "actions", {}, undefined, true)
          ]))
        : _createCommentVNode("", true)
    ]),
    (_ctx.$slots.controls)
      ? (_openBlock(), _createElementBlock("div", _hoisted_7, [
          _renderSlot(_ctx.$slots, "controls", {}, undefined, true)
        ]))
      : _createCommentVNode("", true)
  ]))
}
}

};
const ModuleHeader = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-d0f26125"]]);

export { ModuleHeader as M };
