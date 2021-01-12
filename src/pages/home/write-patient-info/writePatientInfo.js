import Taro from '@tarojs/taro'
import {Input, Text, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react';
import './writePatientInfo.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import {isEmpty} from "../../../utils/EmptyUtil";
import {isIdCard, isMobile} from "../../../utils/RegUtil";
import {fetchAppointDetectApi} from "../../../services/combo";
import AddressPicker from "../../../components/addressPicker";

const WritePatientInfo = () => {
  const [userId, setUserId] = useState('');
  const [userType, setUserType] = useState('');
  const [date, setDate] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [orgId, setOrgId] = useState('');
  const [provinceid, setProvinceId] = useState('140000');
  const [cityid, setCityId] = useState('140100');
  const [districtid, setDistrictId] = useState('140105');
  const [streetdesc, setStreetDesc] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [entourageIdCard, setEntourageIdCard] = useState('');
  const [entourageName, setEntourageName] = useState('');
  const [entouragePhone, setEntouragePhone] = useState('');
  const [entourageRelation, setEntourageRelation] = useState('父亲');
  // payType	支付方式 0 线上支付 1 线下支付
  const [payType, setPayType] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [area, setArea] = useState('请选择');
  useEffect(() => {
    _initData();
  }, [])
  const _initData = async () => {
    const {item, userType} = getCurrentInstance().router.params;
    const {userId} = Taro.getStorageSync('loginInfo');
    const {sourceId, orgId, date,} = JSON.parse(item);
    setSourceId(sourceId);
    setOrgId(orgId);
    setDate(date);
    setUserType(userType);
    setUserId(userId)
  }
  const nextStep = async () => {
    if (isEmpty(name)) {
      Taro.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return;
    }
    if (isEmpty(phone)) {
      Taro.showToast({
        title: '手机号不能为空',
        icon: 'none',
      })
      return;
    }
    if (!isMobile(phone)) {
      Taro.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(idCard)) {
      Taro.showToast({
        title: '身份证号不能为空',
        icon: 'none',
      })
      return;
    }
    if (!isIdCard(idCard)) {
      Taro.showToast({
        title: '身份证号格式不正确',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(provinceid) && isEmpty(cityid) && isEmpty(districtid)) {
      Taro.showToast({
        title: '请选择省市区',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(streetdesc)) {
      Taro.showToast({
        title: '详细地址不能为空',
        icon: 'none',
      })
      return;
    }

    const res = await fetchAppointDetectApi({
      cityid,
      date,
      districtid,
      docUrl,
      entourageIdCard,
      entourageName,
      entouragePhone,
      entourageRelation,
      idCard,
      name,
      orgId,
      payType,
      phone,
      provinceid,
      sourceId,
      streetdesc,
      userId,
      userType,
    })
    // if(res.code===200){
    //
    //   Taro.showToast({
    //     title:'已预约',
    //     icon:'none'
    //   })
    //    const _res = await  fetchAppointSuccessQrCodeApi({
    //     appointId:res.data
    //   })
    //   _res.code ===200&&Taro.navigateTo({
    //     url:`/pages/user/order-success/orderAppointSuccess?item=${JSON.stringify(_res.data)}`,
    //
    //   })
    // }


  }
  const toggleAddressPicker = (areaInfo, coding) => {
    const _coding = coding.split(',');
    console.log(333, areaInfo, coding);
    setArea(areaInfo);
    setProvinceId(_coding[0]);
    setCityId(_coding[1]);
    setDistrictId(_coding[2]);
    setShowPicker(false);
  }
  return (
    <View className='container'>
      <View className='main'>
        <View className="self-info-view">
          <Text className='self-info-text'>本人信息</Text>
        </View>
        <View className='list-row-container'>
          <View className='list-row-view'>
            <Text className='list-row-text'>姓名</Text>
            <Input placeholder='请输入姓名' placeholderClass='list-row-input-placeholder' />
          </View>
        </View>
      </View>
      <AddressPicker pickerShow={showPicker} onHandleToggleShow={toggleAddressPicker}/>
    </View>
  )
}
export default WritePatientInfo
