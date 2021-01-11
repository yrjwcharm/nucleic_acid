import Taro from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import React, {Component, useEffect, useState} from 'react'
import './orderAppointSuccess.scss'
import { Barcode, QRCode } from 'taro-code'
import moment from 'moment';
import Api from '../../../config/api'
import {getCurrentInstance} from "@tarojs/runtime";
const OrderAppointSuccess =(props)=>{
  const [comboName,setComboName] =useState('');
  const [date,setDate] = useState('');
  const [orgName,setOrgName] = useState('');
  const [phone,setPhone] = useState('');
  const [qrCode,setQrCode] = useState('');
  useEffect(()=>{
    let {item} = getCurrentInstance().router.params;
    const {comboName,date,orgName,phone,qrcode} = JSON.parse(item);
    setComboName(comboName);
    setPhone(phone);
    setOrgName(orgName);
    setQrCode(qrcode);
    setDate(moment(date).format('YYYY-MM-DD'));
    setQrCode(qrcode);
    // comboName: "核酸检测"
    // date: 1609862400000
    // orgName: "北京市红十字会急诊抢救中心"
    // phone: "18311410379"
    // qrcode: "/home/hmp/images/qrcode/265965661749116928.jpg"
  },[])
  return(
    <View className='container'>
        <View className='container_header'>
          <QRCode
            text={Api.imgUrl+qrCode}
            size={150}
            scale={4}
            errorCorrectLevel='M'
            typeNumber={2}
          />
          <Text className='container_header_orderSuccess'>预约成功</Text>
        </View>
      <View className='container_devider'/>
      <View className='container_footer'>
        <View  className='container_footer_item'>
          <Text className='container_footer_item_label'>预约时间</Text>
          <Text className='container_footer_item_value'>{date}</Text>
        </View>
        <View  className='container_footer_item'>
          <Text className='container_footer_item_label'>联系电话</Text>
          <Text className='container_footer_item_value'>{phone}</Text>
        </View>
        <View  className='container_footer_item'>
          <Text className='container_footer_item_label'>预约医院</Text>
          <Text className='container_footer_item_value'>{orgName}</Text>
        </View>
        <View  className='container_footer_item'>
          <Text className='container_footer_item_label'>预约套餐</Text>
          <Text className='container_footer_item_value'>{comboName}</Text>
        </View>
      </View>
    </View>
  )
}
export  default  OrderAppointSuccess
