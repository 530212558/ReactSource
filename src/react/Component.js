import { renderComponent } from '../react-dom'
class Component {
  constructor(props = {}){
    // console.log(props)
    this.props = props;
    this.state = {};
  }
  setState(stateChange){
    //  对象拷贝
    // Object.assign(this.state,stateChange);
    //  渲染组件
    // console.log(this);
      // this.base.outerHTML = '<div class="321"><img src="avatar.png" class="profile"><h3> 321 num:6 </h3></div>'
    renderComponent(this);
  }
}

export default Component;