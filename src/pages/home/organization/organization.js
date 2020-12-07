import Taro from '@tarojs/taro'
import {View, Text, ScrollView,  Image} from '@tarojs/components'
import {AtSearchBar, AtIcon} from 'taro-ui'
import Marker from '@assets/home/location.png';
import Pic from '@assets/home/pic.svg'
import Api from '../../../config/api'
import './organization.scss'
import React, { Component } from 'react'
import {getQueryOrgListByNameApi} from "../../../services/home";

class Organization extends Component {
  state={
    queryName:''
  }

  onChange = (value) => {
      this.setState({queryName:value},()=>{
        this._getList();
      })
  }
  componentDidMount() {
      this._getList();
  }
  _getList =()=>{
    Taro.showLoading({
      title: '加载中...',
    });
    getQueryOrgListByNameApi({
      queryName:this.state.queryName,
    }).then(res => {
      console.log(444,res);
        this.setState({list:Array.isArray(res)?res:[]})
      Taro.hideLoading();
    })

  }
  goToCombo = (item) => {
    Taro.navigateTo({
      url: `/pages/home/combo/combo?orgId=${item.orgId}&item=${item}`})
  }
    render(){
      // orgCode: "JMQZ100001030"
      // orgId: "731564657587781632"
      // orgName: "体检医院"
      // orgType: "350200201913000001"

      const {list} = this.state;
      return (
        <View className='container'>
          <View className='container_header'>
            <View className='container_header_location'>
              <Image src={Marker} className='container_header_location_marker'/>
              <Text className='container_header_location_city'>北京</Text>
            </View>
            <View className='container_header_wrap'>
              <AtSearchBar
                className='container_header_wrap_city'
                value={this.state.queryName}
                onChange={this.onChange}
                placeholder={'搜索医院名称'}
              />
            </View>
          </View>
          {list&&list.map((item,index)=>{
            return(
              <View className='container_list_item' onClick={()=>this.goToCombo(item)} key={item.orgId+" "}>
                <Image src={item.url?Api.imgUrl+item.url:Pic} className='container_list_item_pic'/>
                <View className='container_list_item_desc'>
                  <Text className='container_list_item_desc_hospital'>{item.orgName}</Text>
                  <Text className='container_list_item_desc_item'>{'核酸检测'}</Text>
                  <Text className='container_list_item_desc_address'>{item.wholeAddress}</Text>
                </View>
              </View>
            )
          })}
        </View>

      )
    }
  }

export default Organization
