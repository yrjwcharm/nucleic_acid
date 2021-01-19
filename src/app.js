import './app.scss'
import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import * as user from "./utils/user";
import {set as setGlobalData, get as getGlobalData} from './global_data';
import {loginByWXApi} from "./services/auth";
import Api from './config/api'
class App extends Component {

  componentWillMount() {
    this.update();

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
        Taro.getUserInfo({
          success: function(res) {
            let userInfo = res.userInfo
            Taro.setStorageSync('userInfo',userInfo);
          },
          fail:function (res) {
            Taro.redirectTo({
              url:'/pages/auth/login/login',
            })
          }
        })

    Taro.requestSubscribeMessage({
      tmplIds:Api.tmplIds,
      success: function (res) {

      },fail:function (res){
        Taro.redirectTo({
          url:'/pages/auth/login/login',
        })
      }
    })
  }
  componentDidShow(){
    Taro.loadFontFace ({
      family: 'Regular',

      source: 'url("http://hstest.youjiankang.net/hmp/images/font/PingFang-Regular.ttf")',

      success: function(){
        console.log('load font success')
      },
      fail:function (){
        console.log(333,'chucuowl');
      }


    })
  }
  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
