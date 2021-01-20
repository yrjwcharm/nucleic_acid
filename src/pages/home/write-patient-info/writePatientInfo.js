import Taro from '@tarojs/taro'
import {Image, Input, Text, Textarea, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react';
import './writePatientInfo.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import {isEmpty} from "../../../utils/EmptyUtil";
import {isIdCard, isMobile} from "../../../utils/RegUtil";
import AddressPicker from "../../../components/addressPicker";
import Forward from '../../../assets/home/forward.svg'
import Api from "../../../config/api";

const WritePatientInfo = () => {
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [imgCode, setImgCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [userType, setUserType] = useState(2);
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [orgId, setOrgId] = useState('');
  const [provinceid, setProvinceId] = useState('');
  const [cityid, setCityId] = useState('');
  const [districtid, setDistrictId] = useState('');
  const [streetdesc, setStreetDesc] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [code, setCode] = useState('');
  // payType	支付方式 0 线上支付 1 线下支付
  const [payType, setPayType] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [area, setArea] = useState('请选择所属区域');
  const [verifyCode, setVerifyCode] = useState('');
  const [timeType, setTimeType] = useState('');
  useEffect(() => {
    _initData();
    getImageCode();
  }, [])
  const _initData = async () => {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    const {item, obj} = getCurrentInstance().router.params;
    const {sourceId, orgId, date, appointId, orgName, timeType, price} = JSON.parse(item);
    setSourceId(sourceId);
    setOrgId(orgId);
    setDate(date);
    setOrgName(orgName);
    setPrice(price);
    setTimeType(timeType);

    setIsIphoneX(isIphoneX);
  }

  const getRandomCode = () => {
    let code = "";
    const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e',
      'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
      'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    for (let i = 0; i < 4; i++) {
      let id = Math.round(Math.random() * 61);
      code += array[id];
    }
    return code;
  }
  const getImageCode = async () => {
    // const res = await  fetchImgCodeApi({})
    // console.log(333,res);
    const code = getRandomCode();
    Taro.request({
      url: Api.getImgCode,
      data: {code},
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        // 'X-Litemall-Token': Taro.getStorageSync('token')
      },
      responseType: 'arraybuffer',
      success: function (res) {
        console.log(333, res)
        let url = 'data:image/png;base64,' + Taro.arrayBufferToBase64(res.data);
        setImgCode(url);
        setCode(code);
      }
    })
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
    if (code.toLowerCase() != verifyCode.toLowerCase()) {
      Taro.showToast({
        title: '验证码输入不正确',
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

    let item = {
      cityid,
      date,
      districtid,
      docUrl,
      idCard,
      name,
      orgId,
      payType,
      phone,
      area,
      timeType,
      provinceid,
      sourceId,
      streetdesc,
      userType,
      orgName,
      price
    };
    Taro.navigateTo({
      url: `/pages/home/confirm/confirm?item=${JSON.stringify(item)}&userType=2`
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
  const showAreaPicker = () => {
    setShowPicker(true);
  }
  return (
    <View className='container'>
      <View className='main'>
        <View className="self-info-view">
          <Text className='self-info-text'>本人信息</Text>
        </View>
        <ListRow className='list-row-input' type='text' onInput={(e) => {
          setName(e.detail.value);

        }} label='姓名' placeholder='请输入姓名'/>
        <ListRow className='list-row-input' type='number' onInput={(e) => {
          setPhone(e.detail.value);
        }} label='电话' placeholder='请输入电话号码'/>
        <View className='list-row-container'>
          <View className='list-row-wrap'>
            <View className='list-row-view  flex-between'>
                <Text className='list-row-text'>验证码</Text>
              <Input type='text' className='list-row-padding' onInput={(e) => {
                setVerifyCode(e.detail.value);
              }} placeholder={'请输入图片验证码'}
                     placeholderClass='list-row-input-placeholder'/>
              <View className='code-view' onClick={getImageCode}>
                <Image src={imgCode} className='img-code'/>
              </View>
            </View>
          </View>
          <View className='line'/>
        </View>
        <ListRow className='_list-row-input' type='idcard' onInput={(e) => {
          setIdCard(e.detail.value);
        }} label='身份证号' placeholder='请输入身份证号'/>
        <View className='address-info-container' onClick={showAreaPicker}>
          <View className='address-info-wrap'>
            <View className='address-info-view'>
              <View style='display:flex;alignItems:center'>
                <Text className='dist-name-text'>地区信息</Text>
                <Text className='select-city-text _list-row-input'>{area}</Text>
              </View>
              <Image src={Forward} className='list-row-arrow'/>
            </View>
          </View>
          <View className='line'/>
        </View>
        <View className='detail-address-container'>
          <View className='detail-address-textarea'>
            <Textarea onInput={e => {
              setStreetDesc(e.detail.value)
            }} className='textarea-text' placeholder='详细地址' placeholderClass='list-row-input-placeholder'/>
          </View>
        </View>
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
        <View className='btn-submit-view' style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}
              onClick={nextStep}>
          <Text className='btn-submit-text'>下一步</Text>
        </View>
      </View>
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
                 placeholderClass='list-row-input-placeholder'
          />
        </View>
      </View>
      <View className='line'/>
    </View>
  )
}

export default WritePatientInfo
