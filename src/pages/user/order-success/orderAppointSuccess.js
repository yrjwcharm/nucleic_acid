import {Text, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react'
import './orderAppointSuccess.scss'
import {QRCode} from 'taro-code'
import moment from 'moment';
import Api from '../../../config/api'
import {getCurrentInstance} from "@tarojs/runtime";

const OrderAppointSuccess = (props) => {
  const [comboName, setComboName] = useState('');
  const [date, setDate] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [qrCode, setQrCode] = useState('');
  useEffect(() => {
    let {item} = getCurrentInstance().router.params;
    const {comboName, date, orgName, phone, qrcode} = JSON.parse(item);
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
  }, [])
  return (
    <View className='container'>
      <View className='main'>
        <View className='tsm-view'>
          <View>
            <QRCode
              text={Api.imgUrl + qrCode}
              size={150}
              scale={4}
              errorCorrectLevel='M'
              typeNumber={2}
            />
            <Text className='container_header_orderSuccess'>预约成功</Text>
            <Text>若【取消预约】请前往【我的预约】内进行取消</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default OrderAppointSuccess
