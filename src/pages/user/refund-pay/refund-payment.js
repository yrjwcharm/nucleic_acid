import React, {Component, useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './refund-payment.scss'
import submitSuccess from '@assets/submit.png'
import {getCurrentInstance} from "@tarojs/runtime";
const RefundPayment =()=>{
  const [item,setItem]=useState({});
  const skip=()=>{
    Taro.reLaunch({
      url:'/pages/user/advance-order/advanceOrder',
    })
  }
  return (
    <View className='audit-detail-box'>
      <View className='main'>
        <View  className='img-view'>
          <Image src={submitSuccess} className='img'/>
          <Text className='title'>预约取消已成功</Text>
          <Text className='reason'>退款将在72小时内到账，请随时关注~</Text>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-submit-view' onClick={skip}>
          <Text className='btn-submit-text'>返回首页</Text>
        </View>
      </View>
    </View>
  )
}
export  default RefundPayment;
