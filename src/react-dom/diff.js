import { setAttribute, setComponentProps, _render, renderFunction } from './index'
import { getType,isObjectValueEqual } from '../utils'

export function diffVirtualDOM(oldVirtualDOM, newVirtualDOM,dom) {
    const patch = [];
    diffVnode(oldVirtualDOM, newVirtualDOM,dom,patch);
    patch.forEach((item)=>{
        item();
    })
}

export function diffVnode(oldVirtualDOM,newVirtualDOM,dom,patch){
    // console.log("oldVirtualDOM:",oldVirtualDOM);
    // console.log("newVirtualDOM:",newVirtualDOM);
    // console.log("dom:",dom);
    // console.log("dom.childNodes:",dom.childNodes);
    // const tag  = newVirtualDOM.childrens[8].tag;
    // console.log(tag,tag.base,VirtualDOM)
    if(oldVirtualDOM.tag === newVirtualDOM.tag){
        if(isObjectValueEqual(oldVirtualDOM.attrs,newVirtualDOM.attrs)===false){
            diffAttribute(dom,newVirtualDOM);
        }
        let domIndex = { key:0 };
        for ( let i=0; i < oldVirtualDOM.childrens.length; i++){
            const oldVnode = oldVirtualDOM.childrens[i];
            const newVnode = newVirtualDOM.childrens[i];

            const oldDomType = getType(oldVnode);
            const newDomType = getType(newVnode);
            if(oldDomType==="Array"&&newDomType==="Array"){
                //  递归遍历
                diffListVnode(oldVnode,newVnode,domIndex,dom,patch);
            }else{

                const childDom = dom.childNodes[domIndex.key];
                diffChildVnode(oldVnode,newVnode,childDom,patch);
                domIndex.key++;
            }
        }
    }else{
        dom.parentNode.replaceChild(_render(newVirtualDOM),dom);
    }
}

function diffChildVnode(oldVnode,newVnode,dom,patch){
    /*  如果字符串、数字,false 等基本数据类型相等， 则跳出循环  */
    if(oldVnode==newVnode){
        return;
    }
    const oldDomType = getType(oldVnode);
    const newDomType = getType(newVnode);
    // console.log("diffChildVnode:",oldVnode,newVnode,'dom:',dom)
    // console.log("oldVnode:",oldVnode);
    // console.log("newVnode:",newVnode);
    // console.log("dom:",dom);
    //  对比新节点如果是基本数据类型且（数据不同）直接替换
    if( (newDomType === 'String'||newDomType === 'Number'||
        newDomType === 'Boolean'||newDomType === 'Null'||
        newDomType === 'Undefined')&& oldVnode!=newVnode ){
        patch.push(function () {
            dom.parentNode.replaceChild(_render(newVnode),dom);
        })
        // 元素类型不同直接替换
        return;
    }
    //  对比旧节点如果是基本数据类型且（数据不同）直接替换
    if( (oldDomType === 'String'||oldDomType === 'Number'||
        oldDomType === 'Boolean'||oldDomType === 'Null'||
        oldDomType === 'Undefined')&& oldVnode!=newVnode ){
        patch.push(function () {
            dom.parentNode.replaceChild(_render(newVnode),dom);
        })
        // 元素类型不同直接替换
        return;
    }

    if(oldDomType==="Object"&&newDomType==="Object"){
        if(oldVnode.tag===newVnode.tag&&getType(newVnode.tag)=="Function"){
            //  如果新旧 component attrs 值没变说明没更新
            if (!isObjectValueEqual(oldVnode.attrs,newVnode.attrs)){
                //  递归遍历
                //  判断是（class）组件还是（function）组件
                if(newVnode.tag.prototype && newVnode.tag.prototype.render){
                    // console.log(oldVnode,newVnode)
                    setComponentProps(oldVnode.ref,newVnode.attrs);
                    // console.log(newVnode.tag.render(newVnode.attrs));
                }else{
                    // console.log(oldVnode,newVnode)
                    // console.log(newVnode.tag(newVnode.attrs));
                    renderFunction(oldVnode.ref,newVnode,patch)
                }
            }
            newVnode.ref = oldVnode.ref;
        }else if(oldVnode.tag===newVnode.tag){
            //  递归遍历
            diffVnode(oldVnode,newVnode,dom,patch);
        } else{
            //  元素类型不同直接替换
            patch.push(function () {
                dom.parentNode.replaceChild(_render(newVnode),dom);
            })
        }
    }else if(oldDomType!==newDomType){
        //  元素类型不同直接替换
        patch.push(function () {
            dom.parentNode.replaceChild(_render(newVnode),dom);
        })
    }
}

function diffListVnode(oldVirtualDOM,newVirtualDOM,domIndex,dom,patch){
    console.log(oldVirtualDOM.map(item=>item.attrs),newVirtualDOM.map(item=>item.attrs),
        domIndex,dom,dom.childNodes,patch)
    const num = domIndex.key;
    // console.log(oldVnode,newVnode);
    const oldVirtualDOMCopy = JSON.parse(JSON.stringify(oldVirtualDOM));
    let removeOldVirtualDOMCopys = [];
    const oldVirtualDOMId = {};
    oldVirtualDOMCopy.forEach((item,index)=>{
        if(item.attrs.key){
            oldVirtualDOMId[item.attrs.key] = {index,value:item};
        }
    })
    console.log("oldVirtualDOMId:",oldVirtualDOMId);
    const Add = [];
    const Move = [];
    //  是否被移动
    const IsItMoved = [];
    const Delete = [];
    const Update = [];

    // console.log('newVirtualDOMId: ',newVirtualDOMId);
    for ( let i=0; i < newVirtualDOM.length; i++){
        const newVnode = newVirtualDOM[i];
        const oldVnode = oldVirtualDOM[i];
        // console.log(`i：${i}`,newVnode);
        if(newVnode.attrs.key!==undefined){
            const oldItemVirtual = oldVirtualDOMId[newVnode.attrs.key];
            let childNode;
            if(oldItemVirtual){
                childNode = dom.childNodes[oldItemVirtual.index+num];
            }
            if(!oldItemVirtual){
                Add.push(function () {
                    let number = i+num;
                    const refNode = number>dom.childNodes.length?null: dom.childNodes[number];
                    const newDom =  _render(newVnode);
                    console.log("Add: ",newDom,number,refNode);
                    dom.insertBefore(newDom,refNode);
                });
            } else if(oldItemVirtual.index!==i){
                diffVnode(oldItemVirtual.value,newVnode,childNode,Update);
                Move.push(function (){
                    let number = i+num;
                    if(oldItemVirtual.index<=i) number++;
                    const refNode = number>dom.childNodes.length?null: dom.childNodes[number];
                    // console.log(childNode,refNode,oldItemVirtual.value
                    //     ,number,dom.childNodes);
                    console.log("Move: ",childNode,number,refNode,'i+num=',i+num,'childNode==refNode:',childNode==refNode);
                    if(childNode!=refNode){
                        dom.insertBefore(childNode,refNode);
                    }
                });
                removeOldVirtualDOMCopys.push(oldItemVirtual.index);
            } else if (oldItemVirtual.index===i){
                diffVnode(oldItemVirtual.value,newVnode,childNode,Update);
                const number = i+num;
                IsItMoved.push(function () {
                    const refNode = number>dom.childNodes.length?null: dom.childNodes[number];
                    console.log("IsItMoved: ",childNode,refNode,'i+num=',number,'childNode==refNode:',childNode==refNode);
                    if(childNode!=refNode){
                        dom.insertBefore(childNode,refNode);
                    }
                });
                removeOldVirtualDOMCopys.push(oldItemVirtual.index);
            }
            // console.log(newItemVirtua)
        } else if(oldVnode.attrs.key===undefined){
            const childNode = dom.childNodes[i+num];
            diffVnode(oldVnode,newVnode,childNode,Update);
            removeOldVirtualDOMCopys.push(i);
        } else{
            
        }
        domIndex.key++;
    }
    removeOldVirtualDOMCopys = removeOldVirtualDOMCopys.sort((a,b)=>b-a);
    // console.log("removeOldVirtualDOMCopys:",removeOldVirtualDOMCopys);
    removeOldVirtualDOMCopys.forEach(item=>{
        oldVirtualDOMCopy.splice(item,1);
    });
    // console.log('Delete oldVirtualDOMCopy: ',oldVirtualDOMCopy);
    for (let i=oldVirtualDOMCopy.length;i>0;--i){
        const item = oldVirtualDOMCopy[i-1];
        const oldItemVirtual = oldVirtualDOMId[item.attrs.key];
        const childNode = dom.childNodes[oldItemVirtual.index+num];
        console.log("delete oldItem:",childNode);
        Delete.push(function () {
            if(childNode.parentNode){
                childNode.parentNode.removeChild(childNode);
            }
        })
    }

    patch.push(...Delete,...Move,...Add,...IsItMoved,...Update)
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

