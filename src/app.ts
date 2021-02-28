import { Component } from 'react';
import { get } from 'lodash';

import { getAuthToken } from './services';
import './app.less';

class App extends Component {
  componentDidMount() {
    getAuthToken().then(res => {
      localStorage.setItem('token', get(res, 'data.data.access_token'));
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
