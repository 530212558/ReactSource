

export function getType(value) {
    //  引入数据类型 Object
    //  7种基本数据类型：String Number Boolean Null Undefined symbol bigint
    //  Function Array Object String Number Boolean Null Undefined
    return Object.prototype.toString.call(value).slice(8,-1);
}