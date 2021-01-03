import Taro, {Events} from '@tarojs/taro';
import {View, Button} from '@tarojs/components';
import {showErrorToast} from '../../../utils/util';
import {set as setGlobalData} from '../../../global_data';

import * as user from '../../../utils/user';
import './login.less';
import React, {Component} from "react";
const events = new Events()
class Login extends Component {

  state = {}

  accountLogin = () => {
    Taro.navigateTo({
      url: "/pages/auth/accountLogin/accountLogin"
    });
  }

  wxLogin =(e) => {
    let appId = "wxd5d6f7b3a0c905ca";
    console.log('e', e);
    if (e.detail.userInfo) {
      user.loginByWeixin({appid: appId}).then(loginRes=>{
        console.log(444,loginRes);
        Taro.setStorageSync('loginInfo', loginRes.data);
        Taro.setStorageSync('userInfo', e.detail.userInfo);
        setGlobalData('hasLogin', true);
        Taro.eventCenter.trigger('_trigger', e.detail.userInfo,true)
      }).catch((e)=>{
        setGlobalData('hasLogin', false);
        Taro.eventCenter.trigger('_trigger', e.detail.userInfo,false)
      })
    }
    Taro.navigateBack({
      delta: 1,
    })
  }

  render() {
    return (
      <View className='container'>
        <View className='login-box'>
          <Button type='primary' openType='getUserInfo' className='wx-login-btn'
                  onGetUserInfo={this.wxLogin}>微信一键授权</Button>
          {/*<Button type='primary' className='account-login-btn' onClick={this.accountLogin}>账号登录</Button>*/}
        </View>
      </View>
    );
  }
}

export default Login;
