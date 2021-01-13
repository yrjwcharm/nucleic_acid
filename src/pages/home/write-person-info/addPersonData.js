import Taro from '@tarojs/taro'
import {Image, Input, Text, Textarea, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react';
import {AtActionSheet, AtActionSheetItem} from "taro-ui"
import Down from '@assets/down.svg'
import './addPersonData.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import {isEmpty} from "../../../utils/EmptyUtil";
import {isIdCard, isMobile} from "../../../utils/RegUtil";
import AddressPicker from "../../../components/addressPicker";
import Forward from "../../../assets/home/forward.svg";
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";

const AddPersonData = () => {
  const [userId, setUserId] = useState('');
  const [userType, setUserType] = useState(1);
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
  // payType	支付方式 0 线上支付
  const [payType, setPayType] = useState(0);
  const [relationList, setRelationList] = useState([{label: 0, value: "父亲"}, {label: 1, value: '母亲'}, {
    label: 2,
    value: '亲戚'
  }, {label: 3, value: '朋友'}])
  const [code,setCode] =useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [area, setArea] = useState('请选择');
  const [visible, setVisible] = useState(false);
  const [insEscortStaff, setInsEscortStaff] = useState(false);
  useEffect(() => {
    _initData();
  }, [])
  const _initData = async () => {
    const {item, userType} = getCurrentInstance().router.params;
    const {sourceId, orgId, date,} = JSON.parse(item);
    setSourceId(sourceId);
    setOrgId(orgId);
    setDate(date);
    setUserType(userType);
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
     if (!isEmpty(entouragePhone)) {
        if (!isMobile(entouragePhone)) {
          Taro.showToast({
            title: '陪同人手机号格式不正确',
            icon: 'none',
          })
          return;
        }
      }

      if (!isEmpty(entourageIdCard)) {
        if (!isIdCard(entourageIdCard)) {
          Taro.showToast({
            title: '陪同人身份证号格式不正确',
            icon: 'none',
          })
          return;
        }
      }

      Taro.navigateTo({
        url: `/pages/home/certification/certification?item=${JSON.stringify({
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
  const insEscortStaffClick = (flag) => {
    setInsEscortStaff(flag);
  }
  const showAreaPicker = () => {
    setShowPicker(true);
  }
  return (
    <View className='container'>
      <View className='main'>
        <ListRow className='list-row-input' type='text' onInput={(e) => {
          setName(e.detail.value);

        }} label='姓名' placeholder='请输入姓名'/>
        <ListRow className='list-row-input' type='number' onInput={(e) => {
          setPhone(e.detail.value);
        }} label='电话' placeholder='请输入电话'/>
        <View className='list-row-container'>
          <View className='list-row-wrap'>
            <View className='list-row-view  flex-between'>
              <Text className='list-row-text'>图片验证码</Text>
              <Input type='number' className='__list-row-input' onInput={(e)=>{
                setCode(e.detail.value);
              }} placeholder={'请输入图片验证码'}
                     placeholderClass='list-row-input-placeholder'/>
              <View className='code-view'>
              </View>
            </View>
          </View>
        </View>
        <ListRow className='_list-row-input' type='idcard' onInput={(e) => {
          setIdCard(e.detail.value);
        }} label='身份证号' placeholder='请输入身份证号'/>
        <View className='address-info-container' onClick={showAreaPicker}>
          <View className='address-info-wrap'>
            <View className='address-info-view flex-between'>
              <View style='display:flex;alignItems:center'>
                <Text className='dist-name-text'>地区信息</Text>
                <Text className='select-city-text _list-row-input'>{area}</Text>
              </View>
              <Image src={Forward} className='list-row-arrow'/>
            </View>
          </View>
        </View>
        <View className='detail-address-container'>
          <View className='detail-address-textarea'>
            <Textarea onInput={e => {
              setStreetDesc(e.detail.value)
            }} placeholder='详细地址' placeholderClass='list-row-input-placeholder'/>
          </View>
        </View>

        {!insEscortStaff ? <View className='acc-info-view' onClick={() => insEscortStaffClick(true)}>
          <Text className='acc-info-text'>+增加陪同人员</Text>
        </View> : null}
        {insEscortStaff ?
          <View className='acc-info-container'>
            <ListRow className='list-row-input' type='text' onInput={(e) => {
              setEntourageName(e.detail.value);

            }} label='姓名' placeholder='请输入姓名'/>
            <View className='address-info-container' onClick={()=>setVisible(true)}>
              <View className='address-info-wrap'>
                <View className='address-info-view'>
                  <View style='display:flex;alignItems:center'>
                    <Text className='dist-name-text'>与患者关系</Text>
                    <Text className='select-city-text _list-row-input'>{entourageRelation}</Text>
                  </View>
                  <Image src={Down} className='list-row-down'/>
                </View>
              </View>
            </View>
            <ListRow className='list-row-input' type='number' onInput={(e) => {
              setEntouragePhone(e.detail.value);
            }} label='电话' placeholder='请输入电话'/>
            <ListRow className='_list-row-input' type='idcard' onInput={(e) => {
              setEntourageIdCard(e.detail.value);
            }} label='身份证号' placeholder='请输入身份证号'/>
          </View> : null}
        {insEscortStaff ? <View className='acc-info-cancel' onClick={() => insEscortStaffClick(false)}>
          <Text className='acc-info-cancel-text'>-取消陪同人员</Text>
        </View> : null}
        <View className='tip-container'>
          <Text className='tip'>温馨提示</Text>
        </View>
        <View className='tip-view'>
          <Text className='tip-text'>
            1. 就诊人信息必须是核酸检测者本人，姓名、身份证号必须和身份证内容保持完全一致，核酸检测取样前需要出示身份证核实身份，冒用身份需承担法律责任；
          </Text>
        </View>
        <View className='tip-view'>
          <Text className='tip-text'>2. 所有填写的信息务必做到真实，不要使用他人手机号进行验证，否则将会导致他人身份无法核验；</Text>
        </View>
        <View className='tip-view'>
          <Text className='tip-text'>
            3. 详细地址必须为本人现住宅或办公真实地址，精确到门牌号；
          </Text>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-submit-view' onClick={nextStep}>
          <Text className='btn-submit-text'>下一步</Text>
        </View>
      </View>
      <AtActionSheet isOpened={visible} onCancel={() => setVisible(false)} onClose={() => setVisible(false)}
                     cancelText='取消'>
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
      <AddressPicker pickerShow={showPicker} onHandleToggleShow={toggleAddressPicker}/>
    </View>
  )
}
const ListRow = (props) => {
  const {label, placeholder, className, type, onInput} = props;
  return (
    <View className='list-row-container'>
      <View className='list-row-wrap'>
        <View className='list-row-view'>
          <Text className='list-row-text'>{label}</Text>
          <Input type={type} className={className} onInput={onInput} placeholder={placeholder}
                 placeholderClass='list-row-input-placeholder'/>
        </View>
      </View>
    </View>
  )
}
export default AddPersonData
