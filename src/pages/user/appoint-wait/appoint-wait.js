import React, {useState} from 'react'
import Taro from '@tarojs/taro'
import {Button, Image, Text, View} from "@tarojs/components";
import './appoint-wait.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import Wait from '@assets/wait.svg'
import {fetchAppointSuccessQrCodeApi} from "../../../services/combo";
import {AtModal, AtModalAction} from "taro-ui";

let timer = null;
const AppointWait = () => {
  const [visible, setVisible] = useState(false);
  const skip = async () => {
    Taro.showLoading({
      title: '请稍等...',
    });
    if (timer == null) {
      timer = setInterval(async () => {

        const {id} = getCurrentInstance().router.params;
        const res = await fetchAppointSuccessQrCodeApi({appointId: id})
        // console.log(333, res);
        if (res.code === 200) {
          const {
            state
          } = res.data;
          if (state == 1) {
            Taro.hideLoading();
            Taro.navigateTo({
              url: `/pages/user/payment-success/payment-success?id=${id}`
            })
            clearInterval(timer);
          } else if (state == 2) {
            Taro.hideLoading();
            Taro.showToast({
              icon: 'none',
              title: res.msg
            })
            // Taro.reLaunch({url: '/pages/index/index'})
            clearInterval(timer);
          }
        } else {
          clearInterval(timer);
          Taro.hideLoading();
          Taro.showToast({
            icon: 'none',
            title: res.msg
          })
        }
      }, 1000)
    }

  }
  const back = () => {
    setVisible(true);
  }
  const _enter = () => {
    setVisible(false)
    Taro.navigateTo({
      url: '/pages/index/index'
    })
  }
  return (
    <View className='appoint-wait-box'>
      <View className='main'>
        <Image src={Wait} className='wait-img'/>
        <Text className='title'>预约处理中</Text>
        <Text className='reason'>预计需要2~10秒钟...</Text>
        <View className='deal'>
          <View className='index' onClick={back}>
            <Text className='index-text'>返回首页</Text>
          </View>
          <View className='wait' onClick={skip}>
            <Text className='wait-text'>继续等待</Text>
          </View>
        </View>
      </View>
      <AtModal
        isOpened={visible}
      >
        <View className='modal-view'>
          <View className='modal-wrap'>
            <Text className='modal-text'>返回首页不影响预约，请到【我的预约】中查看预约</Text>
          </View>
        </View>
        <AtModalAction>
          {/*<Button className={'btn'} onClick={() =>setVisible(false)}>取消</Button>*/}
          <Button onClick={_enter}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
}
export default AppointWait
