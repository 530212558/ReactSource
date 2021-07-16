import Component from './Component'

function createElement(tag, attrs, ...childrens) {
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
