import {Image, Text, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react'
import './payment-success.scss'
import {Barcode, QRCode} from 'taro-code'
import {getCurrentInstance} from "@tarojs/runtime";
import {fetchAppointSuccessQrCodeApi} from "../../../services/combo";
import moment from 'moment';
import Forward from '@assets/home/forward.svg'

const PaymentSuccess = (props) => {
  const [comboName, setComboName] = useState('');
  const [date, setDate] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [patientId, setPatientId] = useState('');
  const [name, setName] = useState('');
  useEffect(() => {
    let {id} = getCurrentInstance().router.params;
    // setName(name);
    _generateQrCode(id);
  }, [])
  const _generateQrCode = async (id) => {
    const res = await fetchAppointSuccessQrCodeApi({appointId: id})
    console.log(333, res);
    if (res.code === 200) {
      const {
        comboName, date,
        orgName, patientId,
      } = res.data;
      console.log(333,res.data);
      setComboName(comboName);
      setDate(date);
      setOrgName(orgName);
      setPatientId(patientId);
      // comboName: "核酸检测"
      // date: 1610640000000
      // orgName: "北京市红十字会急诊抢救中心"
    }
  }
  const skip =()=>{
    Taro.reLaunch({url:'/pages/index/index'})
  }
  return (
    <View className='container'>
      <View className='main'>
        <View className='tsm-view'>
          <View className='qrcode-view'>
            <Barcode text={patientId} width={283} height={96} scale={4}/>
            <View className='qrcode'>
              <QRCode
                text={patientId}
                size={122}
                scale={4}
                errorCorrectLevel='M'
                typeNumber={2}
              />
            </View>
            <Text className='order-status'>预约成功</Text>
            <Text className='desc' onClick={skip}>若【取消预约】请前往【我的预约】内进行取消</Text>
          </View>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>预约时间</Text>
          <Text className='value'>{moment(date).format('YYYY-MM-DD')}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>姓名</Text>
          <Text className='value'>{name}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>预约医院</Text>
          <Text className='value'>{orgName}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>预约套餐</Text>
          <Text className='value'>新冠核酸检测套餐</Text>
        </View>
      </View>
    </View>
  )
}
export default PaymentSuccess
