import './app.scss'
import Taro from '@tarojs/taro'
import React, {Component} from 'react'
import Api from './config/api'

class App extends Component {

  componentWillMount() {
    this.update();
    this._getSystemInfo()
  }

  _getSystemInfo = () => {
   Taro.getSystemInfo({
      success: function (res) {
//model中包含着设备信息
        console.log(res.model)
        var model = res.model
        if (model.search('iPhone X') != -1||model.search('iPhone 11')!=-1||model.search('iPhone 12')!=-1) {
            console.log(333,'zoule');
          Taro.setStorageSync('isIphoneX',true);
        } else {
          Taro.setStorageSync('isIphoneX',false);
        }
      }
    })
  }


  update = () => {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  }

  componentDidMount() {
    Taro.getUserInfo({
      success: function (res) {
        let userInfo = res.userInfo
        Taro.setStorageSync('userInfo', userInfo);
      },
      fail: function (res) {
        // Taro.navigateTo({
        //   url: '/pages/auth/login/login',
        // })
      }
    })

    Taro.requestSubscribeMessage({
      tmplIds: Api.tmplIds,
      success: function (res) {

      }, fail: function (res) {
        // Taro.redirectTo({
        //   url: '/pages/auth/login/login',
        // })
      }
    })
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App
