import Taro from '@tarojs/taro'
import {Image, ScrollView, Text, View} from '@tarojs/components'
import './home.scss';
import React, {Component} from 'react'
import Carousel from '@assets/home/banner.png'
import Order from '@assets/home/yuyue.png'
import Query from '@assets/home/query.png'
import {getQueryOrgListByNameApi} from "../../services/home";
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
      this._getList(userType);
    } else {
      Taro.redirectTo({
        url: '/pages/auth/login/login',
      })
    }


  }
  _getList =(userType)=>{
    getQueryOrgListByNameApi({
      queryName:'',
    }).then(res => {
      if(res.length>1){
        Taro.navigateTo({
          url: `/pages/home/organization/organization?userType=${userType}`,
        })
      }else{
        let item =res[0];
        Taro.navigateTo({
          url: `/pages/home/combo/combo?userType=${userType}&orgId=${item.orgId}&item=${JSON.stringify(item)}`})
        // Taro.navigateTo({
        //   url:'/pages/home/certification/certification'
        // })
      }

    })

  }

  render() {
    return (
      <ScrollView scrollY={true} className='container'>
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
            {/*<View className='home_wrap' onClick={() => this.goToOrganization(1)}>*/}
            {/*  <Image className='home_wrap_img'*/}
            {/*         src={Free}/>*/}
            {/*  <View className='home_wrap_desp'>*/}
            {/*    <Text className='home_wrap_desp_title'>个人免费核酸检测预约</Text>*/}
            {/*    <Text className='home_wrap_desp_detail'>发热门诊或住院患者可免费预约核酸检测</Text>*/}
            {/*  </View>*/}
            {/*</View>*/}
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
                为落实国家关于“应检尽检、愿检尽检”的文件要求，廊坊中医医院开通了面对居民的个人自费核酸检测预约，现将核酸检测网上预约有关注意事项公布如下：
              </Text>
            </View>
            <View className='tip-view'>
              <Text className='tip-text'>
                1.  个人自费核酸检测预约所有人均可预约
              </Text>
            </View>
            <View className='tip-view'>
              <Text className='tip-text'>
                2. 核酸检测预约实现实名制网上预约，仅限公民使用本人身份预约，预约信息不准确可能导致您无法进行核酸检测。核酸检测取样前需要出示身份证核实身份，冒用身份需承担法律责任
              </Text>
            </View> <View className='tip-view'>
              <Text className='tip-text'>
                3. 个人来院进行核酸检测，必须携带身份证，戴口罩、出示健康码，与他人保持1米距离，有序待检；
              </Text>
            </View>
            <View className='tip-view'>
              <Text className='tip-text'>
                4. 核酸检测预约成功后，如果预约检测当日未能按时取号，超过预约时段后将视为爽约，且不能取消，未到达预约时段结束时间前，在没有现场签到之前均可取消；
              </Text>
            </View>
            <View className='tip-view'>
              <Text className='tip-text'>
                5. 核酸检测结果单最快是24小时返回检测结果, 超过72小时仍未收到检测结果的，请与医院联系；
              </Text>
            </View>
          </View>
      </ScrollView>
    )
  }

}
