import Taro  from '@tarojs/taro'
import {View, Text, ScrollView, Image, Input, Textarea, Picker} from '@tarojs/components'
import React, {Component, useEffect, useState} from 'react';
import { AtActionSheet, AtActionSheetItem } from "taro-ui"

import './addPersonData.scss'
import ArrowRight from '@assets/home/write-person-data/arrow_right.svg'
import ArrowDown from '@assets/home/write-person-data/arrow_down.svg'
import AddressPicker from "../../../components/address-picker/AddressPicker";
import {getCurrentInstance} from "@tarojs/runtime";
const AddPersonData = (props) => {
  const [userId,setUserId] =useState('');
  const [userType,setUserType] =useState('');
  const [date,setDate] =useState('');
  const[sourceId,setSourceId] =useState('');
  const [orgId,setOrgId] =useState('');
  const[provinceid,setProvinceId] =useState('');
  const [districtid,setDistrictId]=useState('');
  const [streetdesc,setStreetDesc] =useState('');
  const[docUrl,setDocUrl] = useState('');
  const[name,setName] =useState('');
  const [phone,setPhone] =useState('');
  const [idCard,setIdCard] =useState('');
  const[entourageIdCard,setEntourageIdCard] =useState('');
  const [entourageName,setEntourageName] =useState('');
  const [entouragePhone,setEntouragePhone] =useState('');
  const [entourageRelation,setEntourageRelation] =useState('父亲');
  // payType	支付方式 0 线上支付 1 线下支付
  const [payType,setPayType] =useState(0);
  const [relationList,setRelationList]=useState([{label:0,value:"父亲"},{label:1,value:'母亲'},{label:2,value:'亲戚'},{label:3,value:'朋友'}])
  const [showPicker, setShowPicker] = useState(false);
  const [area, setArea] = useState('请选择');
  const [visible,setVisible] = useState(false);
  const [insEscortStaff, setInsEscortStaff] = useState(false);
  const listItems = [
    {label: '姓名', value: '',type:'text'},
    {label: '电话', value: '',type :'number'},
    {label: '请输入验证码', value: '',type :'number'},
    {label: '身份证号', value: '',type:'number'},
  ]
  useEffect(()=>{
   _initData();
  },[])
  const handleChange = () => {

  }
  const _initData = async ()=>{
    const {item,userType} =getCurrentInstance().router.params;
    const {userId } = Taro.getStorageSync('loginInfo');
     const {sourceId,orgId,date,} =JSON.parse(item);
     setSourceId(sourceId);
     setOrgId(orgId);
     setDate(date);
     setUserType(userType);
     setUserId(userId)
  }
  const toggleAddressPicker = (areaInfo, disCoding) => {
    console.log(444, areaInfo + ' ' + disCoding);
    setShowPicker(false);
    setArea(areaInfo);

  }
  const goToImmediatelyOrder = () => {
    Taro.navigateTo({
      url: '/pages/home/immediate-order/immediateOrder',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {data: 'test'})
      }
    })
  }
  const _onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }
  const insEscortStaffClick = () => {
    setInsEscortStaff(true);
  }
  const showAreaPicker = () => {
    setShowPicker(true);
  }
  return (
    <View className='container'>
      <View className='container_section'>
        {listItems.map((item, index) => {
          return (
            <View className='clearfix listRow' key={index.toString()}>
              <Text className='listRow_left'>{item.label}</Text>
              <Input type={item.type} className='listRow_right_' placeholder='' value={item.value} maxLength='20'/>

              {/*<Text className='listRow_right'>{item.value}</Text>*/}
            </View>
          )
        })}
        <View className='clearfix listRow' style='border:none;' onClick={showAreaPicker}>
          <Text className='listRow_left'>地址</Text>
          <View className='listRow_right'>
            <Text className='listRow_right_address' style='color:#999'>{area}</Text>
            <Image src={ArrowRight} className='listRow_right_arrow'/>
          </View>
        </View>
        <AddressPicker pickerShow={showPicker} onHandleToggleShow={toggleAddressPicker}/>
        <Textarea value={''} placeholder={'请输入详细地址'} className='detail_address'/>
        {userType==1&&!insEscortStaff ? <View className='insEscortStaff' onClick={insEscortStaffClick}>
          <Text className='insEscortStaff_text'>+增加陪同人员</Text>
        </View> : null}
        {insEscortStaff ? <View className='insEscortStaff_wrap'>
          <View className='clearfix listRow'>
            <Text className='listRow_left'>姓名</Text>
            <Input type='text' className='listRow_right_' placeholder='' value={entourageName} maxLength='20'/>
          </View>
          <View className='relationship'>
            <Text className='relationship_left'>与患者关系</Text>
            <View className='relationship_right' onClick={()=>{
              setVisible(true);
            }}>
              <Text className='acc'>{entourageRelation}</Text>
              <Image src={ArrowDown} style='transform: rotate(270deg);' className='arrow_down'/>
            </View>
          </View>
          <View className='clearfix listRow'>
            <Text className='listRow_left'>电话</Text>
            <Input type='number' className='listRow_right_' placeholder='' value={entouragePhone} maxLength='20'/>
          </View>
          <View className='clearfix listRow'>
            <Text className='listRow_left'>身份证号</Text>
            <Input type='number' className='listRow_right_' placeholder='' value={entourageIdCard} maxLength='20'/>
          </View>
        </View> : null}
      </View>
      <View className='container__footer' onClick={goToImmediatelyOrder}>
        <View className='container_footer'>
          <Text className='container_footer_next'>下一步</Text>
        </View>
      </View>
      <AtActionSheet isOpened={visible} cancelText='取消'>
        {relationList.map(item=>{
          return(
            <AtActionSheetItem key={item.label+""} onClick={()=>{
              setVisible(false);
              setEntourageRelation(item.value)
            }
            }>
              {item.value}
            </AtActionSheetItem>
          )
        })}
      </AtActionSheet>

    </View>
  )
}
export default AddPersonData
