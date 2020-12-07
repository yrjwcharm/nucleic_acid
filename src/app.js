import './app.scss'
import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import * as user from "./utils/user";
import {set as setGlobalData, get as getGlobalData} from './global_data';
import {loginByWXApi} from "./services/auth";
class App extends Component {

  componentWillMount() {

  }

  update = () => {
    if(process.env.TARO_ENV === 'weapp') {
      const updateManager = Taro.getUpdateManager();
      Taro.getUpdateManager().onUpdateReady(function() {
        Taro.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
    }
  }

  componentDidMount() {
     this.update();
  }
  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
