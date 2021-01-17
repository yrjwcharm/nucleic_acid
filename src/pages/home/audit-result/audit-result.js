import React, {Component, useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './audit-result.scss'
import Api from "../../../config/api";
import {isEmpty} from "../../../utils/EmptyUtil";
import AuditIn from '@assets/audit-in.svg'
import {getCurrentInstance} from "@tarojs/runtime";
const AuditResult =()=>{
  const [item,setItem]=useState({});
  const lookup=()=>{
    Taro.reLaunch({
      url:'/pages/user/advance-order/advanceOrder',
    })
  }
  return (
    <View className='audit-detail-box'>
      <View className='main'>
        <View  className='img-view'>
          <Image src={AuditIn} className='img'/>
          <Text className='title'>提交成功</Text>
          <Text className='reason'>审核结果将发送至微信服务通知，请及时关注</Text>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-submit-view' onClick={lookup}>
          <Text className='btn-submit-text'>查看预约</Text>
        </View>
      </View>
    </View>
  )
}
export  default AuditResult;
