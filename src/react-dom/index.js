import React from '../react'
import { diffVirtualDOM, diffVnode } from './diff'

const ReactDom = {
    render
}

function render(vnode, container, dom) {
    // console.log(vnode,container,dom)
    // return diff(dom,vnode,container);
    // console.log(vnode,'==>',1)
    // vnode&&container.appendChild(_render(vnode));
    return container.appendChild(_render(vnode));
}

/*
* 根据 vdom 创建真实 DOM
* */
export function _render(vnode) {
    if (typeof vnode === undefined || typeof vnode === null) return document.createTextNode('');
    if (typeof vnode === 'boolean') return document.createTextNode('');
    /*如果 vnode 是字符串*/
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        //  创建文本节点
        return document.createTextNode(vnode);
    }

    //  否则就是虚拟DOM对象
    const {tag, attrs, childrens} = vnode;

    //  如果tag是函数，则渲染组件 react 函数就是一个组件
    if (typeof tag === 'function') {
        console.log(vnode,'function==>1');
        //  1.创建组件
        const comp = createComponent(tag, attrs);
        vnode.ref = comp;
            //  2.设置组件的属性
        setComponentProps(comp, attrs);
        //  3.组件渲染节点对象返回
        // console.log(comp.base)
        return comp.base;
    }

    //  创建节点对象
    const dom = document.createElement(tag);

    if (attrs) {  //  有属性 key className = 'active'
        Object.keys(attrs).forEach(key => {
            const value = attrs[key];
            setAttribute(dom, key, value)
        })
    }

    //  递归渲染 子节点
    childrens && childrens.forEach(child => {
        if(Object.prototype.toString.call(child) === '[object Array]'){
            child.forEach((item)=>{
                render(item,dom)
            })
        }else {
            render(child, dom);
        }
    });
    // console.log(dom)
    return dom;
}

export function createComponent(comp, props) {
    let inst;
    if (comp.prototype && comp.prototype.render) {  //  如果是类定义的组件 则创建实例 返回
        inst = new comp(props);
    } else { //  如果是函数组件,将函数组件扩展成类组件 方便后面管理
        inst = new React.Component(props);
        inst.constructor = comp;
        //  定义render函数
        inst.render = function () {
            return this.constructor(props)  //  执行函数组件,并传入参数。
        }
    }
    console.log(inst,'createComponent==>2');
    return inst;
}

export function renderClass(comp) {
    let base;
    // console.log(comp,'renderClass==>3  请求vdom 节点数据')
    const newVirtualDOM = comp.render(); //  返回jsx（vdom节点） 对象
    // console.log('newVirtualDOM:',newVirtualDOM)
    if(comp.base){  //  如果真实DOM 存在！
        //  传入 旧虚拟DOM 和 新虚拟DOM
        diffVirtualDOM(comp.VirtualDOM,newVirtualDOM,comp.base);
        comp.VirtualDOM = newVirtualDOM;
    }else {
        console.log(newVirtualDOM,'生成vdom树==>4');
        base = _render(newVirtualDOM);
        // console.log('------------------',comp,'--------------------')
        /*  保存虚拟 DOM  */
        comp.VirtualDOM = newVirtualDOM;
        console.log(base,'_render渲染到DOM节点，并重新插入到页面==>5');
        // base =diffNode(comp.base,newVirtualDOM);
        comp.base = base;

    }

    if (comp.base && comp.componentWillUpdate) {
        comp.componentWillUpdate();
    }
    if (comp.base && comp.componentDidUpdate) {
        comp.componentDidUpdate();
    } else if (!comp.base && comp.componentDidMount) {
        comp.componentDidMount();
    }
}

export function renderFunction(comp,newVnode,patch) {
    // console.log(comp,'renderFunction==>3  请求vdom 节点数据')
    comp.props = newVnode.attrs;
    const newVirtualDOM = newVnode.tag(newVnode.attrs) //  返回jsx（vdom节点） 对象

    diffVnode(comp.VirtualDOM,newVirtualDOM,comp.base,patch);
    comp.VirtualDOM = newVirtualDOM;
}

export function setComponentProps(comp, props) {
    //  如果组件还没有执行过 render 方法。
    if (!comp.base) {
        comp.componentWillMount && comp.componentWillMount();
    } else if (comp.componentWillReveiveProps) {
        //  已经执行过渲染方法。
        comp.componentWillReveiveProps();
    }
    //  设置组件属性
    comp.props = props;
    // console.log(comp);
    //  渲染组件
    renderClass(comp);
}

export function setAttribute(dom, key, value) {
    //  将className 转换成 class
    if (key === 'className') {
        key = 'class'
    }
    // console.log(dom.tagName,'===>setAttr');
    //  如果是事件 onClick onBlur ...
    if (/on\w+/.test(key)) {
        //  转成小写
        key = key.toLowerCase();
        dom[key] = value || '';
    }/*else if(key=='value'&&(dom.tagName.toLowerCase()=='input'||dom.tagName.toLowerCase()=='textarea')){
        dom.value = value;
    }*/ else if (key === "style") {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || '';
        } else if (value && typeof value === 'object') {
            //  { width:20 }
            for (let k in value) {
                if (typeof value[k] === 'number') {
                    dom.style[k] = value[k] + 'px';
                } else {
                    dom.style[k] = value[k];
                }
            }
        }
    } else { //  其他属性
        // if(key in dom){
        //   dom[key] = value || '';
        // }
        // console.log(dom)
        if (value) {
            dom.setAttribute(key, value);
        } else {
            dom.removeAttribute(key);
        }
    }
}

export default ReactDom
