
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
            array:[4,1,2,6,5,7,3]
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
        let array = [];
        for (let i =1;i<num;i++){
            array.push(i);
        }
        array = array.sort(() => (Math.random() - 0.5))
        // array = [3, 8, 5, 6, 2, 4, 1, 7]
        console.clear();
        console.log(array);
        this.setState({
            num:this.state.num+=1,
            array
        })
    }

    render(){
        return (
            <div className={this.props.title} onClick={this.handlerClick.bind(this)}>
                num:{this.state.num}
                {
                    this.state.num%2==0&&<input type="text" value={`2134566`} />
                }
                {
                    [1,2].map((item)=><span>item{item}</span>)
                }
                <img src="avatar.png" className={`profile${this.state.num}`} />
                <h3 >  {this.props.title} num:{this.state.num} </h3>
                <div className={`contaioner`}>
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
// console.log(<Profile title="321" />);
ReactDom.render(<Profile title="321" />,document.getElementById("app"));
