import React, {Component, useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './audit-detail.scss'
import Api from "../../../config/api";
import {isEmpty} from "../../../utils/EmptyUtil";
import Audit from '@assets/home/audit.png'
import {getCurrentInstance} from "@tarojs/runtime";
const AuditDetail =()=>{
  const [item,setItem]=useState({});

  useEffect(()=>{
     const {item}=getCurrentInstance().router.params;
     setItem(JSON.parse(item))
  },[])
  return (
     <View className='audit-detail-box'>
        <View className='main'>
            <View  className='img-view'>
              <Image src={Audit} className='img'/>
              <Text className='title'>已驳回</Text>
              <Text className='reason'>驳回原因：{item.refuseReason}</Text>
            </View>
        </View>
     </View>
  )
}
export  default AuditDetail;
