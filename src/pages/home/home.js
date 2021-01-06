import Taro from '@tarojs/taro'
import {Image, Text, View} from '@tarojs/components'
import './home.scss';
import React, {Component} from 'react'
import Banner from './banner'
import Carousel from '@assets/home/banner.png'
import Order from '@assets/home/yuyue.png'
import Query from '@assets/home/query.png'
import * as user from "../../utils/user";
import Config from '../../../project.config.json'
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
  goToOrganization = () => {
    if (this.state.userInfo) {
      Taro.navigateTo({
        url: '/pages/home/organization/organization',
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
        <Banner list={[{rank: 0, img: Carousel}]}/>
        <View className='container_section'>
          <View className='home_wrap' onClick={this.goToOrganization}>
            <Image className='home_wrap_img'
                   src={Order}/>
            <View className='home_wrap_desp'>
              <Text className='home_wrap_desp_title'>个人核酸检测预约</Text>
              <Text className='home_wrap_desp_detail'>快速预约,安心筛选</Text>
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
          <Text className='container_footer_title'>预约服务说明</Text>
          <Text
            className='container_footer_desp'>请根据个人实际情况填写资料进行预约检测，个人预约仅限公民使用本人身份证预约不可待办预约，平台仅提供线上预约请预约后到医院线下缴费，具体服务费用请按照卫生部门及医疗机构公布为准</Text>
        </View>
      </View>
    )
  }

}
