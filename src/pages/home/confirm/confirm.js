import {Button, Text, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react';
import './confirm.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import moment from "moment";
import {fetchApplyTradeApi, fetchAppointDetectApi} from "../../../services/combo";
import Taro from "@tarojs/taro";
import {throttle} from '../../../utils/common'
import {AtModal, AtModalAction} from "taro-ui";
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";
import Api from "../../../config/api";
let _timer =null;
const Confirm = () => {
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [item, setItem] = useState({})
  const [isWait,setIsWait] =useState(false);
  const [userType, setUserType] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    let {item, userType} = getCurrentInstance().router.params;
    const _item = JSON.parse(item);
    setUserType(userType);
    setItem(_item);
    setIsIphoneX(isIphoneX);
  }, [])
  const _getWeek = (date) => {
    let week = moment(date).day()
    switch (week) {
      case 0:
        return '周日';
      case 1:
        return '周一';
      case 2:
        return '周二';
      case 3:
        return '周三';
      case 4:
        return '周四';
      case 5:
        return '周五';
      case 6:
        return '周六'
    }
  }
  const _enterOrder = async () => {
    if(!isWait){
      setIsWait(true);
      let {item, userType} = getCurrentInstance().router.params;
      const {
        orgId,
        idCard,
      } = JSON.parse(item);
      Taro.request({
        url: Api.getPreAppoint + `?orgId=${orgId}&idCard=${idCard}`, //仅为示例，并非真实的接口地址
        data: {},
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (result) {
          console.log(333, result.data);
          const _result = result.data;
          if (_result.code == 200) {
            if (!_result.data) {
              setVisible(true);
              return;
            }
            _proceed();
          }
        }
      })
    }else{
      if(_timer==null) {
        _timer = setTimeout(() => {
          setIsWait(false);
          clearTimeout(_timer);
        }, 3000)
      }
    }

  }
  const _proceed = async () => {
    Taro.showLoading({
      title: '请稍等...',
    });
    let {item, userType} = getCurrentInstance().router.params;
    const {
      cityid,
      date,
      districtid,
      docUrl,
      orgId,
      payType,
      provinceid,
      sourceId,
      area,
      streetdesc,
      entourageIdCard,
      entourageName,
      entouragePhone,
      entourageRelation,
      orgName, name,
      phone, idCard, price,
    } = JSON.parse(item);
    const _res = await user.loginByWeixin({appid: Config.appid});
    console.log(123456, _res);

    if (_res.code === 200) {
      const {userId, wxid, unionid, sectionKey} = _res.data;


      const res = await fetchAppointDetectApi({
        cityid,
        date,
        districtid,
        docUrl,
        idCard,
        name,
        addrHome:'',
        orgId,
        payType,
        phone,
        provinceid,
        sourceId,
        streetdesc,
        userId,
        userType,
        entourageIdCard,
        entourageName,
        entouragePhone,
        entourageRelation,
      })
      console.log(123456, res);
      Taro.hideLoading();
      if (res.code === 200) {
        if (userType == 1) {
          Taro.navigateTo({
            url: '/pages/home/audit-result/audit-result'
          })
        } else if (userType == 2) {
          Taro.request({
            url: Api.createOrder + `?appointId=${res.data}`, //仅为示例，并非真实的接口地址
            data: {},
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: (result) => {
              console.log(333, result);
              const {code, data} = result.data;
              if (code == 200) {
                fetchApplyTradeApi({
                  payType: '02',
                  orderId: data
                }).then(response => {
                  // appId: "wx99bc91f0ade99f16"
                  // nonceStr: "mygY7r2Ac0pyI6XL"
                  // packageValue: "prepay_id=wx17140433899831f06b0a174a946b0a0000"
                  // paySign: "9B50AD71302BEB2F6DC9190C3F743F5C"
                  // signType: "MD5"
                  // timeStamp: "1610863474"
                  if (response.code == 200) {
                    const {
                      payResult: {timeStamp, paySign, nonceStr, appId, signType, packageValue},
                      tradeId
                    } = response.data;
                    Taro.requestPayment({
                      appId,
                      timeStamp,
                      nonceStr,
                      package: packageValue,
                      signType,
                      paySign,
                      success: function (result) {

                        Taro.navigateTo({
                          url: `/subPackages/pages/user/appoint-wait/appoint-wait?id=${res.data}`
                        })
                      },
                      fail: function (res) {
                        Taro.showToast({
                          title: '支付已取消,请在我的预约-进行支付',
                          icon: 'none',
                        })
                        let timer = setTimeout(() => {
                          Taro.reLaunch({url: '/pages/index/index'})
                          clearTimeout(timer);
                        }, 3000)

                      }
                    })
                  }
                }).catch(error => {
                  console.log(333, error);
                })
              } else {
                Taro.showToast({
                  title: '交易失败',
                  icon: 'none',
                })
              }
            }
          })
        }

      } else {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
        let timer = setTimeout(() => {
          Taro.reLaunch({url: '/pages/index/index'})
          clearTimeout(timer);
        }, 3000)
      }
    }

  }
  const _enter = () => {
    setVisible(false);
    _proceed();
  }
  return (
    <View className='container'>
      <View className='main'>
        <View className='order-info-view'>
          <Text className='order-info-text'>预约信息</Text>
        </View>
        <View className='info-confirm-view'>
          <View className='info-confirm-wrap' style={'margin-top:0'}>
            <Text className='label'>就诊医院</Text>
            <Text className='value'>{item && item.orgName}</Text>
          </View>
          <View className='info-confirm-wrap'>
            <Text className='label'>检测项目</Text>
            <Text className='value'>新冠核酸检测</Text>
          </View>
          <View className='info-confirm-wrap'>
            <Text className='label'>预约时间</Text>
            <Text
              className='value'>{moment(item.date).format('YYYY-MM-DD')} {_getWeek(item.date)} {item.timeType === 0 ? '上午' : item.timeType === 1 ? '下午' : '全天'}</Text>
          </View>
          <View className='info-confirm-wrap'>
            <Text className='label'>预约人</Text>
            <Text className='value'>{item && item.name}</Text>
          </View>
          <View className='info-confirm-wrap'>
            <Text className='label'>家庭住址</Text>
            <Text
              className='value'>{(item && item.area + '' + item.streetdesc).length > 0 ? (item && item.area + '' + item.streetdesc).substring(0, 20) + '...' : (item && item.area + '' + item.streetdesc)}</Text>
          </View>
          <View className='info-confirm-wrap'>
            <Text className='label'>联系电话</Text>
            <Text className='value'>{item && item.phone}</Text>
          </View>
          <View className='info-confirm-wrap'>
            <Text className='label'>身份证号</Text>
            <Text className='value'>{item && item.idCard}</Text>
          </View>
          {item.entourageIdCard &&
          <View>
            <View className='info-confirm-wrap'>
              <Text className='label'>陪同人姓名</Text>
              <Text className='value'>{item && item.entourageName}</Text>
            </View>
            <View className='info-confirm-wrap'>
              <Text className='label'>与患者关系</Text>
              <Text className='value'>{item && item.entourageRelation}</Text>
            </View>
            <View className='info-confirm-wrap'>
              <Text className='label'>联系电话</Text>
              <Text className='value'>{item && item.entouragePhone}</Text>
            </View>
            <View className='info-confirm-wrap'>
              <Text className='label'>身份证号</Text>
              <Text className='value'>{item && item.entourageIdCard}</Text>
            </View>
          </View>
          }
        </View>
        <View className='tip-container'>
          <Text className='tip'>温馨提示</Text>
        </View>
        <View className='tip-view'>
          <Text className='tip-text'>
            1.请您认真核对预约信息，姓名、身份证号必须和身份证内容
            保持完全一致，确认预约之后将不能再修改，请慎重操作；
          </Text>
        </View>
        <View className='tip-view'>
          <Text className='tip-text'>
            2. 如果发现有错误信息可以点击返回按钮继续完成修改，如果
            信息无异常请点击「确认预约」后继续完成预约；
          </Text>
        </View>
        <View className='tip-view'>
          <Text className='tip-text'>
            3.核酸检测开放时间上午8:00至11:00，下午13:00至16:30;
          </Text>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-wrap-view' style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}>
          <View className='price-view'>
            <Text className='RMB'>￥</Text>
            <Text className={userType == 1 ? 'price' : '_price'}>{item && item.price}</Text>
          </View>
          <View className='enter-view' onClick={_enterOrder}>
            <Text className='enter-pay'>确认预约</Text>
          </View>
        </View>
      </View>
      <AtModal
        closeOnClickOverlay={false}
        isOpened={visible}
      >
        <View className='modal-view'>
          <View className='modal-wrap'>
            <Text className='modal-text'>当前患者存在未完成的预约,确定继续预约？</Text>
          </View>
        </View>
        <AtModalAction>
          <Button className={'btn'} onClick={() => {
            Taro.reLaunch({
              url:'/pages/index/index'
            })
            setVisible(false)
          }}>取消</Button>

          <Button onClick={_enter}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
}
export default Confirm
