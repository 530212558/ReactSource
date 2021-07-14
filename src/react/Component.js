import { renderClass } from '../react-dom'
class Component {
  constructor(props = {}){
    // console.log(props)
    this.props = props;
    this.state = {};
  }
  setState(stateChange){
    //  对象拷贝
    Object.assign(this.state,stateChange);
    //  渲染组件
    renderClass(this);
  }
}

export default Component;
