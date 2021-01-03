import Taro from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import React, {Component, useEffect, useState} from 'react'
import './orderAppointSuccess.scss'
import { Barcode, QRCode } from 'taro-code'
import {getCurrentInstance} from "@tarojs/runtime";
const OrderAppointSuccess =(props)=>{
  const [url,setUrl] = useState('');
  const listItems=[
    {label:'预约时间:',value:'02-04 周三'},
    {label:'联系电话:',value:'138772728272'},
    {label:'预约医院:',value:'大厂回族自治县人民医院'},
    {label:'预约套餐:',value:'新冠核酸检测套餐'}
  ]
  useEffect(()=>{
    let {url} = getCurrentInstance().router.params;
    setUrl(url);
  },[])
  return(
    <View className='container'>
        <View className='container_header'>
          <QRCode
            text={url}
            size={150}
            scale={4}
            errorCorrectLevel='M'
            typeNumber={2}
          />
          <Text className='container_header_orderSuccess'>预约成功</Text>
          <Text className='container_header_cancelOrder'>取消预约</Text>
        </View>
      <View className='container_devider'/>
      <View className='container_footer'>
        {listItems.map((item,index)=>{
          return(
            <View key={index.toString()} className='container_footer_item'>
              <Text className='container_footer_item_label'>{item.label}</Text>
              <Text className='container_footer_item_value'>{item.value}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}
export  default  OrderAppointSuccess
