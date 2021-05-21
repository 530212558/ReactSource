
/**
 * 引用数据类型: Object Array
 *
 * 7种基本数据类型: String Number Boolean Null Undefined symbol bigint
 *
 * @return { String }
 * */
export function getType(value) {
    //  引入数据类型 Object Array
    //  7种基本数据类型：String Number Boolean Null Undefined symbol bigint
    //  Function Array Object String Number Boolean Null Undefined
    return Object.prototype.toString.call(value).slice(8,-1);
}

/**
 * 返回两个对象的值是否相等
 * @return { boolean }
 * */
export function isObjectValueEqual(obj1, obj2) {
    let aProps = Object.getOwnPropertyNames(obj1);
    let bProps = Object.getOwnPropertyNames(obj2);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]

        var propA = obj1[propName]
        var propB = obj2[propName]
        // 故先判断两边都有相同键名
        if(!obj2.hasOwnProperty(propName)) return false
        if ((propA instanceof Object)) {
            if (isObjectValueEqual(propA, propB)) {
                // return true     这里不能return ,后面的对象还没判断
            } else {
                return false
            }
        } else if (propA !== propB) {
            return false
        }
    }
    return true
}
