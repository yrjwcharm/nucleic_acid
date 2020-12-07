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
import {getResultQueryListApi} from "../../../services/result_query";
import moment from 'moment';

let max = 14;

class Combo extends Component {
  state = {
    scrollTop: 0,
    threshold: 20,
    orgId: '',
    item: {},
    dateArr: [],
    comboList: [],
  }

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    this.setState({orgId: params.orgId, item: params.item}, () => {
      let dateArr = [];
      for (let i = 0; i <= max; i++) {
        let date = moment().add('days',).format('YYYY-MM-DD');
        let week = this._getWeek(date);
        dateArr.push({
          id: i,
          date,
          week,
          checked: false,
        })

      }
      this.setState({dateArr}, () => {
        this._initData(this.state.orgId);
      })
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

    const res = await getResultQueryListApi({
      orgId
    })
    console.log(33, orgId);
  }

  onScrollToUpper = () => {

  }
  onScroll = () => {

  }
  render() {
    const {dateArr, comboList} = this.state;
    return (
      <View className='container'>
        <View className='container_header'>
          <View className='container_header_list_item'>
            <Image src={Pic} className='container_header_list_item_pic'/>
            <View className='container_header_list_item_desc'>
              <Text className='container_header_list_item_desc_hospital'>大厂回族自治县人民医院</Text>
              <Text className='container_header_list_item_desc_item'>核酸检测</Text>
              <Text className='container_header_list_item_desc_address'>地址：北京市海淀区知春路53号</Text>
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
                    <Text className='wrap_content_status' style={item.checked ? 'color: #fff' : 'color:#999'}></Text>
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
          <View className='footer_comboList'>
            <View className='footer_comboList_leftLayout'>
              <Image src={Doctor} className='footer_comboList_leftLayout_doctor'/>
              <View className='footer_comboList_leftLayout_info'>
                <Text className='footer_comboList_leftLayout_info_title'>
                  新冠核算检测套餐
                </Text>
                <View className='footer_comboList_leftLayout_info_itemList'>
                  <View style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
                    <Image src={Dot} style={{width: '4px', height: '4px', borderRadius: '2px'}}/>
                    <Text style={{color: '#666', marginLeft: '5px', fontSize: '12px'}}>新型冠状病毒核酸检测</Text>
                  </View>
                  <View style={{display: 'flex', alignItems: 'center'}}>
                    <Image src={Dot} style={{width: '4px', height: '4px', borderRadius: '2px'}}/>
                    <Text style={{color: '#666', marginLeft: '5px', fontSize: '12px'}}>预约挂号</Text>
                  </View>
                </View>
                <Text className='footer_comboList_leftLayout_info_money' style={{marginTop: '5px'}}>
                  ¥250
                </Text>
              </View>
            </View>
            <View>

            </View>
          </View>
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
