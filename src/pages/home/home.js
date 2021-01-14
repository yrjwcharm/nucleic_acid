import Taro from '@tarojs/taro'
import {Image, Text, View} from '@tarojs/components'
import './home.scss';
import React, {Component} from 'react'
import Carousel from '@assets/home/banner.png'
import Order from '@assets/home/yuyue.png'
import Query from '@assets/home/query.png'
import Free from '@assets/home/free.png'

const RECOMMEND_SIZE = 20

// @connect(state => state.home, { ...actions, dispatchCartNum })
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: null,
    }
  }

  componentDidMount() {
    const userInfo = Taro.getStorageSync('userInfo');

    this.setState({userInfo});
  }

  _goToCheck_Result = () => {
    if (this.state.userInfo) {
      Taro.navigateTo({
        url: '/pages/home/query/checkResult',
      })
    } else {
      Taro.redirectTo({
        url: '/pages/auth/login/login',
      })
    }
  }
  goToOrganization = (userType) => {
    if (this.state.userInfo) {
      Taro.navigateTo({
        url: `/pages/home/organization/organization?userType=${userType}`,
      })
    } else {
      Taro.redirectTo({
        url: '/pages/auth/login/login',
      })
    }


  }

  render() {
    return (
      <View className='container'>
        <Image src={Carousel} className='carousel'/>
          <View className='container_section'>
            <View className='home_wrap' onClick={() => this.goToOrganization(2)}>
              <Image className='home_wrap_img'
                     src={Order}/>
              <View className='home_wrap_desp'>
                <Text className='home_wrap_desp_title'>个人自费核酸检测预约</Text>
                <Text className='home_wrap_desp_detail'>快速自费预约入口，安心筛选</Text>
              </View>
            </View>
            <View className='home_wrap' onClick={() => this.goToOrganization(1)}>
              <Image className='home_wrap_img'
                     src={Free}/>
              <View className='home_wrap_desp'>
                <Text className='home_wrap_desp_title'>个人免费核酸检测预约</Text>
                <Text className='home_wrap_desp_detail'>发热门诊或住院患者可免费预约核酸检测</Text>
              </View>
            </View>
            <View className='home_wrap' onClick={this._goToCheck_Result}>
              <Image className='home_wrap_img'
                     src={Query}/>
              <View className='home_wrap_desp'>
                <Text className='home_wrap_desp_title'>检验结果查询</Text>
                <Text className='home_wrap_desp_detail'>最快24小时出结果</Text>
              </View>
            </View>
          </View>
          <View className='container_footer'>
            <View className='tip-container'>
              <Text className='tip'>预约服务声明</Text>
            </View>
            <View className='tip-view'>
              <Text className='tip-text'>
                1. 请您根据个人实际情况选择预约检测入口，个人自费核酸检
                测预约入口所有人均可预约， 个人免费核酸检测预约必须是发
                热门诊或住院患者，同时需要拍照上传证明资料， 同时陪同家
                属有一个免费检测名额；
              </Text>
            </View>
            <View className='tip-view'>
              <Text className='tip-text'>
                2. 个人预约仅限公民使用本人身份预约不可代办，核酸检测取
                样前需要出示身份证核实身份，冒用身份需承担法律责任；
              </Text>
            </View>
            <View className='tip-view'>
              <Text className='tip-text'>
                3. 核酸检测结果单最快是24小时返回, 超过72小时仍未收到检
                测结果的，请与医院管理员联系；
              </Text>
            </View>
          </View>
      </View>
    )
  }

}
