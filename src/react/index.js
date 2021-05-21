import Component from './Component'

function createElement(tag, attrs, ...childrens) {
    // childrens = childrens.flat();
    // console.log(tag, attrs, '----------->', ...childrens)
    attrs = attrs || {};
    return {
        tag,
        attrs,
        childrens
    }
}

export default {
    createElement,
    Component
};
