import {Image, Text, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react'
import './entourage-success.scss'
import {Barcode, QRCode} from 'taro-code'
import {getCurrentInstance} from "@tarojs/runtime";
import {fetchAppointSuccessQrCodeApi} from "../../../services/combo";
import moment from 'moment';
const EntourageSuccess = (props) => {
  const [item,setItem] =useState({});
  useEffect(() => {
    let {item} = getCurrentInstance().router.params;
    setItem(JSON.parse(item));
    // qrcode: "/home/hmp/images/qrcode/265965661749116928.jpg"
  }, [])
  return (
    <View className='container'>
      <View className='main'>
        <View className='tsm-view'>
          <View className='qrcode-view'>
            <Barcode text={item.entourageHisId} width={283} height={96} scale={4}/>
            <View className='qrcode'>
              <QRCode
                text={item.entourageHisId}
                size={122}
                scale={4}
                errorCorrectLevel='M'
                typeNumber={2}
              />
            </View>
            <Text className='order-status'>预约成功</Text>
            <Text className='desc'>若【取消预约】请前往【我的预约】内进行取消</Text>
          </View>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>陪同人姓名</Text>
          <Text className='value'>{item.entourageName}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>与陪同人关系</Text>
          <Text className='value'>{item.entourageRelation}</Text>
        </View>
      </View>
    </View>
  )
}
export default EntourageSuccess
