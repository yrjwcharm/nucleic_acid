import Taro, {Events} from '@tarojs/taro';
import {View, Button} from '@tarojs/components';
import {showErrorToast} from '../../../utils/util';
import {set as setGlobalData} from '../../../global_data';

import * as user from '../../../utils/user';
import './login.less';
import React, {Component} from "react";
class Login extends Component {
  wxLogin =(e) => {
    if (e.detail.userInfo) {
      console.log(333,e);
      Taro.setStorageSync('userInfo',e.detail.userInfo)
      Taro.reLaunch({
        url: '/pages/index/index'
      })

    }

  }

  render() {
    return (
      <View className='container'>
        <View className='login-box'>
          <Button type='primary' openType='getUserInfo' className='wx-login-btn'
                  onGetUserInfo={this.wxLogin}>用户授权</Button>
        </View>
      </View>
    );
  }
}

export default Login;
