
import React from './react'
import ReactDom from './react-dom'

function Func  (props){
  return (
    <div >
      <img src="avatar.png" className="profile" />
      <h3>{props.title}:==>{props.num}</h3>
    </div>
  );
}
class Child extends React.Component{

    render(){
        return (
            <div >
                <img src="avatar.png" className="profile" />
                <h3>{this.props.title}:==>{this.props.num}</h3>
            </div>
        );
    }
}

class Profile extends React.Component{

    constructor(){
        super();
        this.state = {
            num:5,
            array: ["",6,"","",4,"",9,7],
            // array: ["","",7,9,""],
            // array: ["", 7, 3, 5, 8, 9, "", "", 4]
            // array: [5, 8, "", 6, "", "", "", 7, ""]
            // array: [3, 15, 9, null, null, 7, 13]
            // array: [9, 4, null, null, 10, null]
        }
    }

    componentWillMount(){
        // console.log("组件将要加载")
    }

    componentWillReveiveProps(props){
        // console.log(props)
    }

    componentWillUpdate(){
        // console.log('组件将要更新')
    }

    componentDidUpdate(){
        // console.log('组件更新完成')
    }

    componentWillMount(){
        // console.log('组件将要加载')
    }

    componentDidMount() {
        // console.log('组件加载完成')
    }

    handlerClick =()=>{
        // 基本均衡获取 0 到 10 的随机整数，其中获取最小值 0 和最大值 10 的几率少一半。
        const num  = Math.round(Math.random()*10);
        let obj = {};
        let oldArray = JSON.parse(JSON.stringify(this.state.array));

        // 定义存放生成随机数的数组
        let array=new Array();
        // 循环N次生成随机数
        while(true){
            // 只生成随机数
            if(array.length<num){
                let rand = parseInt(Math.random()*12);
                if(!obj[rand]){
                    rand = rand<3?null:rand;
                    array.push(rand);
                    obj[rand] = 1;
                }else{
                    obj[rand]++;
                }
            }else{
                break;
            }
        }
        console.clear();
        // array = [5, 9, ""];
        // array = [6, 9, 5, 4, "", 8, 7, ""]
        // array = [7, 8, 3, "", 9, 4, ""]
        // array = [4, "", 8, "", 6, 9, 7, 3, "", 5]
        // array = [null, 12, null, null, null, 7, 10, 6]
        // array = [11, null, 3, 9, 10]
        console.log("oldArray:",oldArray);
        console.log("array:   ",array);
        this.setState({
            num:this.state.num+=1,
            array
        })
        const div = document.getElementById(`container`).getElementsByTagName('div');

        [...div].forEach((item,index)=>{
            const key = item.getAttribute('key');
            if(key!=array[index]){
                throw "错误结果";
            }else{
                console.table({
                    'index:':index,
                    'key:':key,
                    'array[index]:':array[index],
                    "key==array[index]:":key==array[index]
                });
            }
        })
    }

    testDiff(){
        let i = 0;
        while (i<1000){
            i++;
            this.handlerClick();
        }

    }

    render(){
        return (
            <div className={this.props.title} onClick={this.testDiff.bind(this)}>
                num:{this.state.num}
                {
                    this.state.num%2==0&&<input type="text" value={`2134566`} />
                }
                {/*{*/}
                {/*    [1,2].map((item)=><span>item{item}</span>)*/}
                {/*}*/}
                <img src="avatar.png" className={`profile${this.state.num}`} />
                <h3 >  {this.props.title} num:{this.state.num} </h3>
                <div className={`contaioner`} id={`container`}>
                    header
                    {
                        this.state.array.map((item,key)=>(
                            <div key={item}>
                                {this.state.num!=5&&this.state.num}=><span>id</span>:{item}
                                {/*<span>item=></span>:*/}
                                {/*{*/}
                                {/*    this.state.array.map((item)=>(*/}
                                {/*        <span>{item}</span>*/}
                                {/*    ))*/}
                                {/*}*/}
                            </div>
                        ))
                    }
                </div>
                <Func num={ this.state.num } title="王生"/>
                <Child num={ this.state.num } title="王生" />
            </div>
        );
    }
}
ReactDom.render(<Profile title="321" />,document.getElementById("app"));
