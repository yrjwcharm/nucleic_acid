import Taro from '@tarojs/taro'
import {View, Text, ScrollView,  Image} from '@tarojs/components'
import {AtSearchBar, AtIcon} from 'taro-ui'
import Marker from '@assets/home/location.png';
import Pic from '@assets/home/pic.svg'
import Api from '../../../config/api'
import './organization.scss'
import React, { Component } from 'react'
import {getQueryOrgListByNameApi} from "../../../services/home";
import {getCurrentInstance} from "@tarojs/runtime";
let QQMapWX = require('../../../utils/qqmap-wx-jssdk.min');
class Organization extends Component {
  state={
    queryName:'',
    city:'北京',
  }

  onChange = (value) => {
      this.setState({queryName:value},()=>{
        this._getList();
      })
  }
  componentDidMount() {
      this._getAuthorize();
      this._getList();
  }
  _getAuthorize=()=>{
    let _this =this;
    Taro.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          Taro.authorize({
            scope: 'scope.userLocation',
            success: function () {
              _this._getLocation();
            }
          })
        }else{
          _this._getLocation();
        }
      }
    })
  }
  _getLocation=()=>{
    // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
    Taro.getLocation({
      type: 'gcj02', //返回可以用于 Taro.openLocation的经纬度
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(222,res);
        //下载qqmap-wx-jssdk,然后引入其中的js文件
        let qqmapsdk = new QQMapWX({
          key: '4HCBZ-ERO6U-AQTVJ-BMVJH-FCJI6-WFB2T'// 必填
        });

        //逆地址解析,通过经纬度获取位置等信息
        qqmapsdk.reverseGeocoder({
          location:{latitude,longitude},
          success: (res) =>{
            console.log(333,res);
            // 获取当前城市
            this.setState({city:res.result.address_component.city});
          }
        })
      }
    })
  }
  _getList =()=>{
    Taro.showLoading({
      title: '加载中...',
    });
    getQueryOrgListByNameApi({
      queryName:this.state.queryName,
    }).then(res => {
        this.setState({list:Array.isArray(res)?res:[]})
      Taro.hideLoading();
    })

  }
  goToCombo = (item) => {
    const {userType} =getCurrentInstance().router.params;

    Taro.navigateTo({
      url: `/pages/home/combo/combo?userType=${userType}&orgId=${item.orgId}&item=${JSON.stringify(item)}`})
    // Taro.navigateTo({
    //   url:'/pages/home/certification/certification'
    // })
  }
    render(){
      // orgCode: "JMQZ100001030"
      // orgId: "731564657587781632"
      // orgName: "体检医院"
      // orgType: "350200201913000001"

      const {list,city} = this.state;
      return (
        <View className='container'>
          <View className='main'>
              <View className='search-view'>
                  <View className='search-wrap'>
                    <View style='display:flex;flex-direction:row;align-items:center'>
                      <Image src={Marker} className='marker-img'/>
                      <Text className='city-text'>{city}</Text>
                    </View>
                    <AtSearchBar
                      className='search-bar'
                      value={this.state.queryName}
                      onChange={this.onChange}
                      placeholder={'搜索医院名称'}
                    />
                  </View>
              </View>
            {list&&list.map((item,index)=>{
              return(
                <View className='list-row-container' onClick={()=>this.goToCombo(item)} key={item.orgId+" "}>
                  <View className='list-row-view'>
                    <Image src={Api.imgUrl+item.url} className='hospital-img'/>
                    <View className='hospital-info-view'>
                      <Text className='hospital-title'>{item.orgName}</Text>
                      <Text className='hospital-subtitle'>核酸检测预约中心</Text>
                      <Text className='hospital-address'>地址：{item.wholeAddress}</Text>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
          {/*<View className='container_header'>*/}
          {/*  <View className='container_header_location'>*/}
          {/*    <Image src={Marker} className='container_header_location_marker'/>*/}
          {/*    <Text className='container_header_location_city'>{city}</Text>*/}
          {/*  </View>*/}
          {/*  <View className='container_header_wrap'>*/}
          {/*    <AtSearchBar*/}
          {/*      className='container_header_wrap_city'*/}
          {/*      value={this.state.queryName}*/}
          {/*      onChange={this.onChange}*/}
          {/*      placeholder={'搜索医院名称'}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*</View>*/}

        </View>

      )
    }
  }

export default Organization
