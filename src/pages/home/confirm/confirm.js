import {Text, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react';
import './confirm.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import moment from "moment";
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";
import {fetchAppointDetectApi} from "../../../services/combo";
import Taro from "@tarojs/taro";

const Confirm = () => {
  const [item, setItem] = useState({})
  const [userType, setUserType] = useState(0);
  useEffect(() => {
    let {item, userType} = getCurrentInstance().router.params;
    const _item = JSON.parse(item);
    setUserType(userType);
    setItem(_item);
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
    let {item, userType} = getCurrentInstance().router.params;
    const {
      cityid,
      date,
      districtid,
      docUrl,
      idCard,
      name,
      orgId,
      payType,
      phone,
      provinceid,
      sourceId,
      streetdesc,
    } = JSON.parse(item);
    const _res = await user.loginByWeixin({appid: Config.appid});
    if (_res.code === 200) {
      const {userId, wxid, unionid, sectionKey} = _res.data;
      const res = await fetchAppointDetectApi({
        cityid,
        date,
        districtid,
        docUrl,
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
      console.log(333, res);
      if (res.code === 200) {
        Taro.showToast({
          title: '已预约',
          icon: 'none',
        })
      }
    }
  }
  return (
    <View className='container'>
      <View className='main'>
        <View className='order-info-view'>
          <Text className='order-info-text'>预约信息</Text>
        </View>
        <View className='info-confirm-view'>
          <View className='info-confirm-wrap'>
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
            <Text className='value'>{item && item.streetdesc}</Text>
          </View>
          <View className='info-confirm-wrap'>
            <Text className='label'>联系电话</Text>
            <Text className='value'>{item && item.phone}</Text>
          </View>
          <View className='info-confirm-wrap'>
            <Text className='label'>身份证号</Text>
            <Text className='value'>{item && item.idCard}</Text>
          </View>
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
        <View className='btn-wrap-view'>
          <View className='price-view'>
            <Text className='RMB'>￥</Text>
            <Text className={userType == 1 ? 'price' : '_price'}>{item && item.price}</Text>
          </View>
          <View className='enter-view' onClick={_enterOrder}>
            <Text className='enter-pay'>确认预约</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default Confirm
