import Taro,{Events} from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import Arrow from '@assets/home/check-result-query/arrow__right.svg'
import List from '@assets/ucenter/list.svg';
import ArrowRight from '@assets/ucenter/arrow.png'
import './user.scss'
import DefaultAvatar from '@assets/ucenter/avatar.png'
import React, {useState, useEffect, Component} from 'react'
import {get} from "../../global_data";
const events = new Events()
class User  extends Component {
  state = {
    hasLogin: false,
    userInfo:null,
    listItems: [
      {label: '审核记录', id: 0, onPress: () => this._goToAuditRecord()},
      {label: '我的预约', id: 1, onPress: () => this.goToAdvanceOrder()}
    ]
  }
  componentDidMount() {
    Taro.eventCenter.on('_trigger',(arg1,arg2) => {
      console.log(111,arg1,arg2);
      this.setState({userInfo:arg1,hasLogin:arg2})
    })
    const userInfo = Taro.getStorageSync('userInfo');
    userInfo&&this.setState({hasLogin:true,userInfo})
  }
  componentWillUnmount() {
    Taro.eventCenter.off();
  }

  goToAdvanceOrder = () => {
    if(this.state.hasLogin){
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
    if(this.state.hasLogin){
      Taro.navigateTo({
        url:'/pages/user/audit-record/auditRecord'
      })
    }else{
      Taro.navigateTo({
        url:'/pages/auth/login/login'
      })
    }

  }
   _goToAuth=()=>{
   !this.state.hasLogin&&Taro.navigateTo({
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
            <Image src={hasLogin ? userInfo&&userInfo.avatarUrl : DefaultAvatar} className='header_wrap_avatar'/>
            <Text className='header_wrap_username'>{hasLogin ?userInfo&&userInfo.nickName : '请先登录'}</Text>
            {!hasLogin && <Image src={Arrow} className='header_wrap_arrow'/>}
          </View>
        </View>
        {listItems.map((item, index) => {
          return (
            <View className='section' key={item.id + ""} onClick={() =>this.goToPage(item.id)}>
              <View className='section_wrap'>
                <View className='section_wrap_left'>
                  <Image src={List} className='section_wrap_left_list'/>
                  <Text className='section_wrap_left_label'>{item.label}</Text>
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
