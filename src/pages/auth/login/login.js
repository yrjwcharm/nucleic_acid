import Taro from '@tarojs/taro';
import {Button, Image, Text, View} from '@tarojs/components';
import Icon from '@assets/icon.png'
import './login.scss';
import Api from '../../../config/api'
import React, {Component} from "react";
import {AtModal, AtModalAction} from "taro-ui";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    }
  }

  wxLogin = (e) => {
    if (e.detail.userInfo) {
      console.log(333, e);
      Taro.setStorageSync('userInfo', e.detail.userInfo)
      this.setState({visible: true})
    }
  }
  _enterOp = () => {
    let _this = this;
    Taro.requestSubscribeMessage({
      tmplIds: Api.tmplIds,
      success: function (res) {
        _this.setState({visible: false})
        Taro.reLaunch({
          url: '/pages/index/index'
        })
      }, fail: function (res) {
        // Taro.redirectTo({
        //   url:'/pages/auth/login/login',
        // })
        _this.setState({visible: false})
      }
    })
  }

  render() {
    return (
      <View className='container'>
        <View className='main'>
          <View className='login-box'>
            <Image src={Icon} className='hospital-img'/>
            <Text className='hospital'>廊坊中医院</Text>
            <View className='line'/>
          </View>
          <View className='wrap_line' cl>
            <View className='line'/>
          </View>
          <View className='_container'>
            <View className='wrap'>
              <Text className='auth'>登录后开发者将获得以下权限</Text>
            </View>
          </View>
          <View className='_container'>
            <View className='wrap'>
              <Text className='info'>·获得你的公开信息（昵称、头像等）</Text>
            </View>
          </View>
          <Button type='primary' openType='getUserInfo' className='wx-login-btn'
                  onGetUserInfo={this.wxLogin}>确认登录</Button>
        </View>
        <AtModal
          closeOnClickOverlay={false}
          isOpened={this.state.visible}
        >
          <View className='modal-view'>
            <Text className='modal-text'>是否允许微信服务通知？</Text>
          </View>
          <AtModalAction>
            <Button className={'btn'} onClick={() => this.setState({visible: false})}>取消</Button>
            <Button onClick={this._enterOp}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}

export default Login;
