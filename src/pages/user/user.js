import Taro,{Events} from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import Arrow from '@assets/home/check-result-query/arrow__right.svg'
import List from '@assets/ucenter/list.svg';
import Order from '@assets/order.png';
import Audit from '@assets/audit.png';
import ArrowRight from '@assets/ucenter/arrow.svg'
import './user.scss'
import DefaultAvatar from '@assets/ucenter/avatar.png'
import React, {useState, useEffect, Component} from 'react'
import {get} from "../../global_data";
const events = new Events()
class User  extends Component {
  constructor() {
    super();
    this.state = {
      userInfo:null,
      listItems: [
        {label: '审核记录', id: 0, img:Order, onPress: () => this._goToAuditRecord()},
        {label: '我的预约', id: 1, img:Audit, onPress: () => this.goToAdvanceOrder()}
      ]
    }
  }
  componentDidMount() {
    const userInfo = Taro.getStorageSync('userInfo')
     this.setState({userInfo});
  }
  goToAdvanceOrder = () => {
    if(this.state.userInfo){
      Taro.navigateTo({
        url: '/pages/user/advance-order/advanceOrder',
      })
    }else{
      Taro.navigateTo({
        url:'/pages/auth/login/login'
      })
    }

  }
  _goToAuditRecord=()=>{
    if(this.state.userInfo){
      Taro.navigateTo({
        url:'/pages/user/audit-record/auditRecord'
      })
    }else{
      Taro.redirectTo({
        url:'/pages/auth/login/login'
      })
    }

  }
   _goToAuth=()=>{
   !this.state.userInfo&&Taro.redirectTo({
        url:'/pages/auth/login/login'
      })
  }

  goToPage=(id)=>{
    if(id ===0)
      this._goToAuditRecord();
    else
      this.goToAdvanceOrder();
  }
  render() {
    const {hasLogin,listItems,userInfo}= this.state;
    return (
      <View className='container'>
        <View className='header'>
          <View className='header_wrap' onClick={this._goToAuth}>
            <Image src={userInfo ? userInfo&&userInfo.avatarUrl : DefaultAvatar} className='header_wrap_avatar'/>
            <Text className='header_wrap_username'>{userInfo ?userInfo&&userInfo.nickName : '请先登录'}</Text>
          </View>
        </View>
        {listItems.map((item, index) => {
          return (
            <View className='section' key={item.id + ""} onClick={() =>this.goToPage(item.id)}>
              <View className='section_wrap'>
                <View className='section_wrap_left'>
                  <Image src={item.img} className='section_wrap_left_list'/>
                  <Text className='section_wrap_left_title'>{item.label}</Text>
                </View>
                <Image src={ArrowRight} className='section_wrap_right'/>
              </View>
            </View>
          )
        })}
      </View>
    )
  }

}
export default User
