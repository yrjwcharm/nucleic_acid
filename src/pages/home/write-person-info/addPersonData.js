import Taro from '@tarojs/taro'
import {View, Text, ScrollView, Image, Input, Textarea, Picker} from '@tarojs/components'
import React, {Component, useEffect, useState} from 'react';
import {AtActionSheet, AtActionSheetItem} from "taro-ui"

import './addPersonData.scss'
import ArrowRight from '@assets/home/write-person-data/arrow_right.svg'
import ArrowDown from '@assets/home/write-person-data/arrow_down.svg'
import {getCurrentInstance} from "@tarojs/runtime";
import {isEmpty} from "../../../utils/EmptyUtil";
import {isIdCard, isMobile} from "../../../utils/RegUtil";
import {fetchAppointDetectApi, fetchAppointSuccessQrCodeApi, fetchSourceApi} from "../../../services/combo";
import AddressPicker from "../../../components/addressPicker";
import {debounce, throttle} from "../../../utils/common";

const AddPersonData = () => {
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
  const [payType, setPayType] = useState(1);
  const [relationList, setRelationList] = useState([{label: 0, value: "父亲"}, {label: 1, value: '母亲'}, {
    label: 2,
    value: '亲戚'
  }, {label: 3, value: '朋友'}])
  const [showPicker, setShowPicker] = useState(false);
  const [area, setArea] = useState('请选择');
  const [visible, setVisible] = useState(false);
  const [insEscortStaff, setInsEscortStaff] = useState(false);
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

    console.log(333, name, phone);
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
    if(isEmpty(streetdesc)){
      Taro.showToast({
        title:'详细地址不能为空',
        icon:'none',
      })
      return;
    }

    if (userType == 1) {
      if (isEmpty(entourageName)) {
        Taro.showToast({
          icon: 'none',
          title: '陪同人姓名不能为空'
        })
        return;
      }
      if (isEmpty(entourageRelation)) {
        Taro.showToast({
          title: '陪同人关系不能为空',
          icon: 'none',
        })
        return;
      }
      if (isEmpty(entouragePhone)) {
        Taro.showToast({
          title: '陪同人手机号不能为空',
          icon: 'none',
        })
        return;
      }
      if (!isMobile(entouragePhone)) {
        Taro.showToast({
          title: '陪同人手机号格式不正确',
          icon: 'none',
        })
        return;
      }
      if (isEmpty(entourageIdCard)) {
        Taro.showToast({
          title: '陪同人身份证号不能为空',
          icon: 'none',
        })
        return;
      }
      if (!isIdCard(entourageIdCard)) {
        Taro.showToast({
          title: '陪同人身份证号格式不正确',
          icon: 'none',
        })
        return;
      }
      Taro.navigateTo({
        url:`/pages/home/certification/certification?item=${JSON.stringify({
          cityid,
          date,
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
        })}`
      })

    } else {
      setEntourageRelation('');
      console.log(333,
        streetdesc,
      );
      const res  = await  fetchAppointDetectApi({
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
      if(res.code===200){
        Taro.showToast({
          title:'已预约',
          icon:'none'
        })
         const _res = await  fetchAppointSuccessQrCodeApi({
          appointId:res.data
        })
        console.log(333,_res.data);
        _res.code ===200&&Taro.navigateTo({
          url:`/pages/user/order-success/orderAppointSuccess?item=${JSON.stringify(_res.data)}`,

        })
      }



    }

  }
  const toggleAddressPicker=(areaInfo,coding)=>{
    const _coding = coding.split(',');
    console.log(333,areaInfo,coding);
    setArea(areaInfo);
    setProvinceId(_coding[0]);
    setCityId(_coding[1]);
    setDistrictId(_coding[2]);
    setShowPicker(false);
  }
  const insEscortStaffClick = () => {
    setInsEscortStaff(true);
  }
  const showAreaPicker = () => {
    setShowPicker(true);
  }
  const ListRow = (props) => {
    const {label, type, onInput, value, placeholder, maxLength} = props;
    return (
      <View className='clearfix listRow'>
        <Text className='listRow_left'>{label}</Text>
        <Input controlled type={type} onInput={onInput} className='listRow_right_' placeholder={placeholder} value={value}
               maxLength={maxLength}/>
      </View>
    )
  }

  return (
    <View className='container'>
      <View className='container_section'>
        <ListRow type='text' label='姓名' onInput={debounce( (e)=>{
          const {value} =e.detail;
          setName(value);
        },1000)} value={name} placeholder='请输入姓名' maxLength={6}/>
        <ListRow type='number' label='电话' onInput={debounce((event)=> {
          const {value} = event.detail;
           setPhone(value);
        },1000)} value={phone} placeholder='请输入电话' maxLength={11}/>
        <ListRow type='idcard' label='身份证号' onInput={debounce((event) => {
          const {value} = event.detail;
          setIdCard(value);
        },1000)} value={idCard} placeholder='请输入身份证号' maxLength={18}/>
        <View className='clearfix listRow' style='border:none;' onClick={showAreaPicker}>
          <Text className='listRow_left'>地址</Text>
          <View className='listRow_right'>
            <Text  className='listRow_right_address' style='color:#999'>{area}</Text>
            <Image src={ArrowRight} className='listRow_right_arrow'/>
          </View>
        </View>

        <Textarea value={streetdesc} onInput={(event)=>{
           const {value} = event.detail;
           console.log('333',event)
           setStreetDesc(value);
        }} placeholder={'请输入详细地址'} className='detail_address'/>
        {userType == 1 && !insEscortStaff ? <View className='insEscortStaff' onClick={insEscortStaffClick}>
          <Text className='insEscortStaff_text'>+增加陪同人员</Text>
        </View> : null}
        {insEscortStaff ? <View className='insEscortStaff_wrap'>
          <View className='clearfix listRow'>
            <Text className='listRow_left'>姓名</Text>
            <Input type='text' onInput={debounce(event => {
              const {value} = event.detail;
              setEntourageName(value)
            },1000)} className='listRow_right_' placeholder='请输入陪同人姓名' value={entourageName} maxLength='6'/>
          </View>
          <View className='relationship' onClick={()=>setVisible(true)}>
            <Text className='relationship_left'>与患者关系</Text>
            <View className='relationship_right'>
              <Text className='acc'>{entourageRelation}</Text>
              <Image src={ArrowDown} style='transform: rotate(270deg);' className='arrow_down'/>
            </View>
          </View>
          <View className='clearfix listRow'>
            <Text className='listRow_left'>电话</Text>
            <Input type='number' onInput={debounce((event) => {
              const {value} = event.detail;
              setEntouragePhone(value);
            },1000)} className='listRow_right_' placeholder='请输入陪同人电话号码' value={entouragePhone}
                   maxLength='11'/>
          </View>
          <View className='clearfix listRow'>
            <Text className='listRow_left'>身份证号</Text>
            <Input onInput={debounce((event) => {
              const {value} = event.detail;
              setEntourageIdCard(value)
            },1000)} type='idcard' className='listRow_right_' placeholder='请输入陪同人身份证号' value={entourageIdCard}
                   maxLength='18'/>
          </View>
        </View> : null}
      </View>
      <View className='container__footer' onClick={nextStep}>
        <View className='container_footer'>
          <Text className='container_footer_next'>下一步</Text>
        </View>
      </View>
      <AtActionSheet  isOpened={visible} onCancel={()=>setVisible(false)}   onClose={()=>setVisible(false)} cancelText='取消'>
        {relationList.map(item => {
          return (
            <AtActionSheetItem key={item.label + ""} onClick={() => {
              setVisible(false);
              setEntourageRelation(item.value)
            }
            }>
              {item.value}
            </AtActionSheetItem>
          )
        })}
      </AtActionSheet>
      <AddressPicker pickerShow={showPicker}   onHandleToggleShow={toggleAddressPicker}/>
    </View>
  )
}
export default AddPersonData
