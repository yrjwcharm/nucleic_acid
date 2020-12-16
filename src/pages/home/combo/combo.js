import Taro from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import {AtList, AtListItem} from "taro-ui"
import Pic from '@assets/home/pic.svg'
import Doctor from '@assets/home/combo/doctor.png'
import Dot from '@assets/home/combo/dot.svg'
import Checked from '@assets/home/combo/checked.svg'
import './combo.scss'
import React, {Component} from "react";
import {getCurrentInstance} from "@tarojs/runtime";
import {queryComboListByOrgApi,fetchSourceApi} from "../../../services/combo";
import moment from 'moment';
import Api from '../../../config/api'
let max = 14;

class Combo extends Component {
  state = {
    scrollTop: 0,
    threshold: 20,
    orgId: '',
    item: {},
    dateArr: [],
    comboList: [],
    comboId:'',
  }

  componentDidMount() {
    let {orgId,item} = getCurrentInstance().router.params;
    this.setState({orgId, item:JSON.parse(item)}, () => {

        this._initData(this.state.orgId);

    })

  }

  _getWeek = (date) => {
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
  _initData = async (orgId) => {
    const startDate = moment().format('YYYY-MM-DD');
    const endDate = moment().add('days',max).format('YYYY-MM-DD');
    const res = await queryComboListByOrgApi({
      orgId
    })

    if(res.code===200) {
      if (Array.isArray(res.data)) {
        res.data.map((item, index) => {
          index === 0 ? item.checked = true : item.checked = false;
        })
        this.setState({comboList: res.data,comboId:res.data[0].comboId},()=>{
          this._getSource(res.data[0].comboId,startDate,endDate);
        })
      }
    }
  }
  _getSource= async (comboId,startDate,endDate)=>{
    let dateArr = [];
    for (let i = 0; i <= max; i++) {
      let date = moment().add('days',i).format('YYYY-MM-DD');
      let week = this._getWeek(date);
      dateArr.push({
        id: i,
        date,
        week,
        checked: false,
      })
    }
    const _res = await fetchSourceApi({
      comboId,
      startDate,
      endDate
    })
  }
  onScrollToUpper = () => {

  }
  onScroll = () => {
  }
  _selectedCombo=(item)=>{
    this.state.comboList.map((_item,index)=>{

        if(JSON.stringify(item)===JSON.stringify(_item)){

           index===0? _item.checked = true:_item.checked = !item.checked;

        }
    })
    this.setState({comboList:[...this.state.comboList]})

  }
  render() {
    const {dateArr, comboList,item} = this.state;
    return (
      <View className='container'>
        <View className='container_header'>
          <View className='container_header_list_item'>
            <Image src={Api.imgUrl+item.url} className='container_header_list_item_pic'/>
            <View className='container_header_list_item_desc'>
              <Text className='container_header_list_item_desc_hospital'>{item.orgName&&item.orgName}</Text>
              <Text className='container_header_list_item_desc_item'>核酸检测</Text>
              <Text className='container_header_list_item_desc_address'>{item.wholeAddress&&item.wholeAddress}</Text>
            </View>
          </View>
        </View>
        <View className='section'>
          <Text className='section_orderTime'>预约时间</Text>
          <ScrollView
            className='scrollview'
            scrollX={true}
            scrollWithAnimation
            scrollTop={this.state.scrollTop}
            // style={scrollStyle}
            lowerThreshold={this.state.threshold}
            upperThreshold={this.state.threshold}
            onScrollToUpper={this.onScrollToUpper} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
            onScroll={this.onScroll}
          >
            {dateArr.map((item, index) => {
              let month_day = moment(item.date).format('MM-DD');
              return (
                <View className='wrap' key={item.id + " "}>
                  <View className='wrap_content'
                        style={item.checked ? 'background-color:rgba(51, 153, 255, 0.698039215686274)' : 'background-color:white'}>
                    <Text className='wrap_content_week' style={item.checked ? 'color:#fff' : 'color:#333'}>{item.week}</Text>
                    <Text className='wrap_content_date' style={item.checked ? 'color:#fff' : 'color:#666'}>{month_day}</Text>
                    <Text className='wrap_content_status' style={item.checked ? 'color: #fff' : 'color:#999'}/>
                  </View>
                </View>
              )
            })}
          </ScrollView>
        </View>
        <View className='footer'>
          <Text className='footer_combo'>
            选择套餐
          </Text>
          {comboList.map((item,index)=>{
            return(
              <View className='footer_comboList' key={item.comboId+" "} onClick={()=>this._selectedCombo(item)}>
                <View className='footer_comboList_leftLayout'>
                  <Image src={Doctor} className='footer_comboList_leftLayout_doctor'/>
                  <View className='footer_comboList_leftLayout_info'>
                    <Text className='footer_comboList_leftLayout_info_title'>
                      新冠核算检测套餐
                    </Text>
                    <View className='footer_comboList_leftLayout_info_itemList'>
                      <View style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
                        <Image src={Dot} style={{width: '4px', height: '4px', borderRadius: '2px'}}/>
                        <Text style={{color: '#666', marginLeft: '5px', fontSize: '12px'}}>{item.name}</Text>
                      </View>
                      <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={Dot} style={{width: '4px', height: '4px', borderRadius: '2px'}}/>
                        <Text style={{color: '#666', marginLeft: '5px', fontSize: '12px'}}>预约挂号</Text>
                      </View>
                    </View>
                    <Text className='footer_comboList_leftLayout_info_money' style={{marginTop: '5px'}}>
                      ¥{item.price}
                    </Text>
                  </View>
                </View>
                <View className='choice' >
                  <View className='choice_wrap' style={item.checked?'background-color:#3298ff':'background-color:white'}>

                  </View>
                </View>
              </View>
            )
          })}
        </View>
        <View className='yellow'>
          <Text style={{fontSize: '13px'}}>1</Text>
        </View>
        <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
          <View className='bottom_wrap'>
            <Text style={{color: '#fff', fontSize: '16px'}}>立即预约</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default Combo
