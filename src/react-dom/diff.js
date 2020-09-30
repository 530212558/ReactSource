import { setAttribute, setComponentProps, createComponent,_render } from './index'
import { getType } from '../utils'

export function diffNode(oldVirtualDOM, newVirtualDOM,dom) {
    console.log(oldVirtualDOM, newVirtualDOM,dom,dom.childNodes);
    if(oldVirtualDOM.tag === newVirtualDOM.tag){
        for ( let i=0; i < oldVirtualDOM.childrens.length; i++){
            const oldDom = oldVirtualDOM.childrens[i];
            const newDom = newVirtualDOM.childrens[i];
            /*  如果字符串、数字,false 等基本数据类型相等， 则跳出循环  */
            if(oldDom==newDom){
                continue;
            }
            const oldDomType = getType(oldDom);
            const newDomType = getType(newDom);
            //  String Number Boolean Null Undefined
            if( newDomType === 'String'||newDomType === 'Number'||newDomType === 'Boolean'||newDomType === 'Null'||newDomType === 'Undefined' ){

            }
        }
        diffAttribute(dom,newVirtualDOM)
    }else{
        dom.parentNode.replaceChild(_render(newVirtualDOM),dom);
    }
}

// export function diffNode(dom, vnode) {
//     // console.log(dom&&dom.childNodes, vnode);
//     // return false;
//     //  dom 为真实 dom  vnode 为虚拟dom
//     if (typeof vnode === undefined || typeof vnode === null || typeof vnode === 'boolean') return;
//     //  比较子节点（dom节点和组件）
//     if (vnode.childrens && vnode.childrens.length > 0 || (dom.childrens && dom.childrens.length > 0)) {
//         //  对比组件 或者子节点
//         diffChildren(dom, vnode.childrens);
//     }
// }

function diffChildren(domContainer, vChildrens) {
    const domChildren = domContainer.childNodes;
    // console.log(domChildren, vChildrens);
    const len  = vChildrens.length>domChildren.length?vChildrens.length:domChildren.length;
    for (let i=0;i<len;i++){
        // console.log(domChildren[i],vChildrens[i])
        let vnode  = vChildrens[i];
        let dom = domChildren[i];

        /*nodeType 属性
        元素	1
        属性	2
        文本	3
        注释	8
        文档	9*/
        if(typeof vnode =='object'&&typeof vnode.tag == 'function'){
            let NewVnode = createComponent(vnode.tag,vnode.attrs)
            // console.log(dom,NewVnode.render());
            diffChildren(dom,NewVnode.render().childrens);
            NewVnode = null;
            //  setComponentProps
            // console.log(dom,vnode,NewVnode);
        }else if(dom && dom.nodeType === 1 && typeof vnode =='object'){
            console.log(dom,vnode)
            diffAttribute(dom,vnode);
            if( dom.tagName.toLowerCase()!=vnode.tag ){
                // console.log(dom.parentNode,dom,vnode)
                dom.parentNode.replaceChild(_render(vnode),dom);
            }else if(vnode.childrens.length>0){
                let childrens = [];
                vnode.childrens.forEach((item)=>{
                    if(Object.prototype.toString.call(item) =='[object Array]'){
                        childrens.push(...item);
                    }else{
                        childrens.push(item);
                    }
                })
                // console.log(dom,'vnode.childrens:',childrens);
                // if(typeof vnode.childrens[0] =='object'){
                //     vnode.childrens.forEach((item)=>{
                //         diffChildren(dom,item);
                //     })
                // }else{
                //     diffChildren(dom,vnode.childrens);
                // }
                diffChildren(dom,childrens);
            }

            continue
        } else if(dom && dom.nodeType === 1 && (typeof vnode === 'string'|| typeof vnode === 'number')){
            // dom.innerHTML = vnode;
            let text = document.createTextNode(vnode);
            dom.parentNode.replaceChild(text,dom);
            continue
        } else if (dom && dom.nodeType === 3 && (typeof vnode == 'string' || typeof vnode == 'number')) {
            //  如果 vnode  是字符串  更新文本内容
            if(dom.textContent != vnode){
                dom.textContent = vnode;
            }
            // console.log('dom.textContent = vnode;',vnode);
            continue
        } else if(dom && dom.nodeType === 3 && typeof vnode =='object'){
            dom.parentNode.replaceChild(_render(vnode),dom);
            continue
        }else if(dom&&(dom.nodeType === 1||dom.nodeType === 3)&& typeof vnode=='boolean'){
            // console.log(vnode);
            let text = document.createTextNode('');
            dom.parentNode.replaceChild(text,dom);
        }

        if(!dom){
            if((typeof vnode === 'string'|| typeof vnode === 'number')){
                domContainer.appendChild(document.createTextNode(vnode));
            }else{
                domContainer.appendChild(_render(vnode))
            }
        }
    }

}

function diffAttribute(dom, vnode) {
    //  保存之前的DOM的所有属性
    const oldAttrs = {};
    const newAttrs = vnode.attrs;
    //  dom 是原有的节点对象 vnode 虚拟DOM
    const domAttrs = dom.attributes;
    // console.log(domAttrs);

    [...domAttrs].forEach(item => {
        oldAttrs[item.name] = item.value;
    })

    //  比较
    //  如果原来属性 跟新的属性对比，不在新的属性中，则将其移除掉（属性值为undefinne）
    for (let key in oldAttrs) {
        if (!(key in newAttrs)) {
            setAttribute(dom, key, undefined);
        }
    }
    //  更新 class='active' abc
    for (let key in newAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            //  值不同
            setAttribute(dom, key, newAttrs[key]);
        }
    }
}


export function diff(dom, vnode, container) {
    //  对比节点的变化
    const ret = diffNode(dom, vnode);

    if (container) {
        container.appendChild(ret);
    }
    return ret;
}

function diffComponent(dom, vnode) {
    let comp = dom;
    //  如果组件没有变化，重新设置props
    if (comp && comp.constructor === vnode.tag) {
        //  重新设置props
        setComponentProps(comp, vnode.attrs);
        //  赋值
        dom = comp.base;
    } else {
        //  组件类型发生变化
        console.log(comp)
        if (comp) {
            unmountComponent(comp);
            comp = null;
        }
        //  1.创建新组件
        comp = createComponent(vnode.tag, vnode.attrs);
        //  2.设置组件属性
        setComponentProps(comp, vnode.attrs);
        //  3.给当前挂载base
        dom = comp.base;
    }
    return dom;
}

function unmountComponent(comp) {
    removeNode(comp.base);
}

function removeNode(dom) {
    if (dom && dom.parentNode) {
        // console.log(dom.parentNode.removeNode)
        dom.parentNode.removeNode(dom);
    }
}

