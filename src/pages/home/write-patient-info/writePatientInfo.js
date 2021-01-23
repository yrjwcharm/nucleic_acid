import Taro from '@tarojs/taro'
import {Button, Image, Input, Text, Textarea, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react';
import './writePatientInfo.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import {isEmpty} from "../../../utils/EmptyUtil";
import {isIdCard, isMobile} from "../../../utils/RegUtil";
import AddressPicker from "../../../components/addressPicker";
import Api from "../../../config/api";
import {AtModal, AtModalAction, AtModalContent, AtModalHeader} from "taro-ui";
import Location from '@assets/location.png';

const WritePatientInfo = () => {
  const [visible, setVisible] = useState(true);
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
    if (area === '请选择所属区域') {
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
      price,
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
  const getLocation = () => {
    Taro.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          Taro.authorize({
            scope: 'scope.userLocation',
            success: function () {
              // 用户已经同意小程序使用录音功能，后续调用 Taro.chooseLocation 接口不会弹窗询问
              _chooseLocation();
            }
          })
        } else {
          _chooseLocation();
        }
      }
    })

  }
  const _chooseLocation = () => {
    Taro.chooseLocation({
      success: function (res) {
        const {address} = res;
        setArea(address);
      },
      complete: function (res) {
        console.log(333, res);
        const {address,latitude, longitude} =res;
    // let url =`https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=${Api.key}&radius=1000&extensions=all`
    //       Taro.request({
    //         url,
    //         data:{},
    //         method:'GET',
    //         header: {
    //           'content-type': 'application/json' // 默认值
    //         },
    //         success:function (res){
    //               console.log(3333,res);
    //         }
    //       })


      },
      fail: function (res) {

      }
    })
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
              <Text className='list-row-text' style='margin-right:60rpx'>验证码</Text>
              <Input type='text' className='__list-row-input' onInput={(e) => {
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
        <View className='address-info-container' onClick={getLocation}>
          <View className='address-info-wrap'>
            <View className='address-info-view'>
              <View style='display:flex;alignItems:center'>
                <Text className='dist-name-text'>地区信息</Text>
                <Text className='select-city-text _list-row-input' style={area==='请选择所属区域'?'color:#999':'color:#666'}>{area}</Text>
              </View>
              <Image src={Location} className='location'/>
            </View>
          </View>
          <View className='line'/>
        </View>
        <View className='detail-address-container'>
          <View className='detail-address-textarea'>
            <Textarea onInput={e => {
              setStreetDesc(e.detail.value)
            }} className='textarea-text' placeholder='街道、楼牌号等' placeholderClass='list-row-input-placeholder'/>
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
      <AtModal isOpened={visible} closeOnClickOverlay={false}>
        <AtModalContent className='modal-content'>
          <View className='title-view'>
              <Text className='title-text'>预约提醒</Text>
          </View>
          <View className='notice-view'>
            <Text className='notice-text'>1.就诊人应保证提供真实、有效的个人信息；</Text>
          </View>
          <View className='notice-view'>
            <Text className='notice-text'>2.核酸检测取报告时需要出示身份证核实身份，请仔细输入并核对，冒用身份需承担法律责任；</Text>
          </View>
          <View className='notice-view'>
            <Text className='notice-text'>3.地址必须为本人现住宅或办公真实地址，精确到门牌号；</Text>
          </View>
          <View className='notice-view'>
          <Text className='notice-text'>4.核酸检测门诊仅面向无流行病学史，无任何症状的自愿进行新冠病素核酸检测人员；
          </Text>
        </View>
          <View className='notice-view'>
          <Text className='notice-text'>5.发热患者请去最近医院的发热门诊就诊；</Text>
        </View>
          <View className='enter-view' onClick={()=>setVisible(false)}>
            <View className='enter-wrap'>
              <Text className='enter-text'>知道了</Text>
            </View>
          </View>
        </AtModalContent>
        {/*<AtModalAction className='modal-footer'>*/}
        {/*  <Button type='#fff' className='bt-ok' onClick={() => setVisible(false)}>确定</Button>*/}
        {/*</AtModalAction>*/}
      </AtModal>
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
