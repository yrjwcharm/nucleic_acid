import React, {Component, useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {Button, Image, Text, View} from "@tarojs/components";
import './appoint-wait.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import Wait from '@assets/wait.svg'
import {fetchAppointSuccessQrCodeApi} from "../../../services/combo";
import {AtModal, AtModalAction} from "taro-ui";

let timer = null ,_animation=null,_interval;
export default  class AppointWait extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    }
  }
  componentDidMount() {
    this.skip();
  }
  timer = null;

  skip = async () => {
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
            Taro.navigateTo({
              url: `/pages/user/payment-success/payment-success?id=${id}`
            })
            clearInterval(timer);
          } else if (state == 2) {
            Taro.showToast({
              icon: 'none',
              title: res.msg
            })
            // Taro.reLaunch({url: '/pages/index/index'})
            clearInterval(timer);
          }
        } else {
          clearInterval(timer);
          Taro.showToast({
            icon: 'none',
            title: res.msg
          })
        }
      }, 1000)
    }

  }
  back = () => {
    this.setState({visible: true})
  }
  _enter = () => {
    this.setState({visible: false})
    Taro.navigateTo({
      url: '/pages/index/index'
    })
  }

  render() {
    return <View className='appoint-wait-box'>
      <View className='main'>
        <Image src={Wait} className='wait-img'/>
        <Text className='title'>预约处理中</Text>
        <Text className='reason'>预计需要2~10秒钟...</Text>
        <View className='deal'>
          <View className='index' onClick={this.back}>
            <Text className='index-text'>返回首页</Text>
          </View>
          {/*<View className='wait' onClick={this.skip}>*/}
          {/*  <Text className='wait-text'>继续等待</Text>*/}
          {/*</View>*/}
        </View>
      </View>
      <AtModal
        closeOnClickOverlay={false}
        isOpened={this.state.visible}
      >
        <View className='modal-view'>
          <View className='modal-wrap'>
            <Text className='modal-text'>返回首页不影响预约，请到【我的预约】中查看预约</Text>
          </View>
        </View>
        <AtModalAction>
          {/*<Button className={'btn'} onClick={() =>setVisible(false)}>取消</Button>*/}
          <Button onClick={this._enter}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>;
  }
}
