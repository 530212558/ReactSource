import Component from './Component'

function createElement(tag, attrs, ...childrens) {
    // childrens = childrens.flat();
    // console.log(tag, attrs, '----------->', ...childrens)
    attrs = attrs || {};
    return {
        tag,
        attrs,
        childrens,
        key: attrs.key || null
    }
}

export default {
    createElement,
    Component
};
