import Taro from '@tarojs/taro'
import {Image, ScrollView, Text, View} from '@tarojs/components'
import './combo.scss'
import React, {Component} from "react";
import {getCurrentInstance} from "@tarojs/runtime";
import {fetchSourceApi, queryComboListByOrgApi} from "../../../services/combo";
import moment from 'moment';
import Api from '../../../config/api'
import Clock from '@assets/clock.png';
let max = 14;

class Combo extends Component {
  state = {
    scrollTop: 0,
    threshold: 20,
    orgId: '',
    item: {},
    dateArr: [],
    comboList: [],
    comboId: '',
    userType: '',
    startDate: '',
    endDate: '',
    visible: false,
    source: {},
  }

  componentDidMount() {
    let {orgId, item, userType} = getCurrentInstance().router.params;
    console.log(333, userType);
    this.setState({orgId, userType, item: JSON.parse(item)}, () => {

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
    const endDate = moment().add('days', max).format('YYYY-MM-DD');
    const res = await queryComboListByOrgApi({
      orgId
    })

    if (res.code === 200) {
      if (Array.isArray(res.data)) {
        res.data.map((item, index) => {
          index === 0 ? item.checked = true : item.checked = false;
        })
        this.setState({comboList: res.data, comboId: res.data[0].comboId}, () => {
          this._getSource(res.data[0].comboId, startDate, endDate);
        })
      }
    }
  }
  /**
   * 初始化获取号源
   * @param comboId
   * @param startDate
   * @param endDate
   * @returns {Promise<void>}
   * @private
   */
  _getSource = async (comboId, startDate, endDate) => {
    let dateArr = [];
    for (let i = 0; i <= max; i++) {
      let date = moment().add('days', i).format('YYYY-MM-DD');
      let week = this._getWeek(date);
      dateArr.push({
        id: i,
        date,
        week,
        amount: 0,
        comboId: '',
        orgId: '',
        sourceId: '',
        surplus: 0,
        checked: false,
      })
    }
    if (comboId) {
      const _res = await fetchSourceApi({
        comboId,
        startDate,
        endDate
      })
      if (_res.code === 200) {
        Array.isArray(_res.data) && _res.data.map(_item => {
          dateArr.map(item => {
            let date = moment(_item.date).format('YYYY-MM-DD');
            if (item.date === date) {
              item.amount = _item.amount;
              item.surplus = _item.surplus;
              item.comboId = _item.comboId;
              item.orgId = _item.orgId;
              item.sourceId = _item.sourceId;
            }
          })
        })
        this.setState({dateArr: [...dateArr], startDate, endDate})
      }
    } else {
      this._initData(this.state.orgId);
    }
  }
  onScrollToUpper = () => {

  }
  _selectedSource = (item) => {
    this.state.dateArr.map((_item, index) => {
      _item.checked = false;
      if (JSON.stringify(item) === JSON.stringify(_item)) {

        _item.checked = !item.checked;

      }
    })
    this.setState({dateArr: [...this.state.dateArr]})
  }
  onScroll = () => {
  }
  /**
   * 选择套餐
   * @param item
   * @private
   */
  _selectedCombo = (item) => {
    this.state.comboList.map((_item, index) => {
      _item.checked = false;
      if (JSON.stringify(item) === JSON.stringify(_item)) {

        _item.checked = !item.checked;

      }
    })
    this.setState({comboList: [...this.state.comboList]}, () => {
      let comboId = '';
      const {comboList} = this.state;
      for (let i = 0; i < comboList.length; i++) {
        if (comboList[i].checked) {
          comboId = comboList[i].comboId;
        }
      }
      this._getSource(comboId, this.state.startDate, this.state.endDate);
    })

  }
  /**
   * 下一步
   * @private
   */
  _nextStep = () => {
    const {dateArr, userType} = this.state;
    let item = {};
    for (let i = 0; i < dateArr.length; i++) {
      if (dateArr[i].checked) {
        if (dateArr[i].surplus > 0) {
          item = dateArr[i];
          break;
        }
      }
    }
    Object.keys(item).length === 0 ? Taro.showToast({
      title: '请选择有号源的预约时间',
      icon: 'none'
    }) : this.setState({visible: true, source: item}, () => {
      userType == 1 && Taro.navigateTo({
        url: `/pages/home/write-person-info/addPersonData?item=${JSON.stringify(this.state.source)}`
      })
      userType == 2 && Taro.navigateTo({
        url: `/pages/home/write-patient-info/writePatientInfo?item=${JSON.stringify(this.state.source)}`
      })
    })
  }

  render() {
    const {dateArr, comboList, item} = this.state;
    console.log(333, item);
    return (
      <View className='container-box'>
        <View className='main'>
          <View className='list-row-container' onClick={() => this.goToCombo(item)} key={item.orgId + " "}>
            <View className='list-row-view'>
              <Image src={Api.imgUrl + item.url} className='hospital-img'/>
              <View className='hospital-info-view'>
                <Text className='hospital-title'>{item.orgName}</Text>
                <Text className='hospital-subtitle'>核酸检测预约中心</Text>
                <Text className='hospital-address'>地址：{item.wholeAddress}</Text>
              </View>
            </View>
          </View>
          <View className='order-time-view'>
            <Text className='order-time'>预约时间</Text>
          </View>
          <View className='section'>
            <ScrollView
              className='scrollView'
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
                  <View className='wrap' key={item.id + " "} onClick={() => this._selectedSource(item)}>
                    <View className='wrap_content'
                          style={item.checked ? 'background-color:rgba(51, 153, 255, 0.698039215686274)' : 'background-color:white'}>
                      <Text className='wrap_content_week'
                            style={item.checked ? 'color:#fff' : item.surplus > 0 ? 'color: #222222;' : 'color:#333'}>{item.week}</Text>
                      <Text className='wrap_content_date'
                            style={item.checked ? 'color:#fff' : item.surplus > 0 ? 'color:#222222' : 'color:#666'}>{month_day}</Text>
                      <Text className='wrap_content_status'
                            style={item.checked ? 'color: #fff' : item.surplus > 0 ? 'color: #3299FF' : 'color:#999'}>
                        {item.surplus > 0 ? '有号' : item.surplus == 0 ? '无号' : '约满'}
                      </Text>
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          </View>
          <View className='combo-choice-view'>
            <Text className='combo-choice-text'>套餐选择</Text>
          </View>
          <View className='combo-list'>
            <View className='combo-wrap'>
              <View style='display:flex;flex-direction:column;'>
                <Text className='title'>新冠核酸检测预约套餐</Text>
                <Text className='content'>套餐内容：预约挂号、核酸检测</Text>
                <Text className='price'>￥120</Text>
              </View>
              <View className='choice-view'>
                <View className='choice-wrap'>

                </View>
              </View>
            </View>
          </View>
          <View className='list-row'>
            <View className='list-row-wrap'>
              <View style='display:flex;flex-direction:row;align-items:center'>
                <Image src={Clock} className='clock-img'/>
                <Text className='time-text'>上午</Text>
                <Text className='time-range-text'>8:00～11:00</Text>
              </View>
              <View style='display:flex;flex-direction:row;align-items:center'>
                <Text className='sy-text'>剩余：</Text>
                <Text  className='surplus--text'>33</Text>
              </View>
              <View className='right-away-order-view' onClick={this._nextStep()}>
                  <Text className='right-away-order-text'>立即预约</Text>
              </View>
            </View>
          </View>
          {/*{comboList.map((item, index) => {*/}
          {/*  return (*/}
          {/*    <View key={item.comboId + ""} onClick={() => this._selectedCombo(item)}>*/}
          {/*      <View className='am-wrap'>*/}
          {/*        <Text className='am'>上午</Text>*/}
          {/*      </View>*/}
          {/*      <View className='combo'>*/}
          {/*        <View className='combo-item'>*/}
          {/*          <Text className='title'>核酸检测</Text>*/}
          {/*          <Text className='price'>￥{item.price}.00</Text>*/}
          {/*          <View className='btn-wrap'>*/}
          {/*            <Text className='btn'>剩余{item.surplus}</Text>*/}
          {/*          </View>*/}
          {/*        </View>*/}
          {/*      </View>*/}
          {/*    </View>*/}
          {/*  )*/}
          {/*})}*/}

        </View>

        {/*<View className='footer'>*/}
        {/*  <Text className='footer_combo'>*/}
        {/*    选择套餐*/}
        {/*  </Text>*/}
        {/*  {comboList.map((item, index) => {*/}
        {/*    return (*/}
        {/*      <View className='footer_comboList' key={item.comboId + " "} onClick={() => this._selectedCombo(item)}>*/}
        {/*        <View className='footer_comboList_leftLayout'>*/}
        {/*          <Image src={Doctor} className='footer_comboList_leftLayout_doctor'/>*/}
        {/*          <View className='footer_comboList_leftLayout_info'>*/}
        {/*            <Text className='footer_comboList_leftLayout_info_title'>*/}
        {/*              新冠核算检测套餐*/}
        {/*            </Text>*/}
        {/*            <View className='footer_comboList_leftLayout_info_itemList'>*/}
        {/*              <View style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>*/}
        {/*                <Image src={Dot} style={{width: '4px', height: '4px', borderRadius: '2px'}}/>*/}
        {/*                <Text style={{color: '#666', marginLeft: '5px', fontSize: '12px'}}>{item.name}</Text>*/}
        {/*              </View>*/}
        {/*              <View style={{display: 'flex', alignItems: 'center'}}>*/}
        {/*                <Image src={Dot} style={{width: '4px', height: '4px', borderRadius: '2px'}}/>*/}
        {/*                <Text style={{color: '#666', marginLeft: '5px', fontSize: '12px'}}>预约挂号</Text>*/}
        {/*              </View>*/}
        {/*            </View>*/}
        {/*            <Text className='footer_comboList_leftLayout_info_money' style={{marginTop: '5px'}}>*/}
        {/*              ¥{item.price}*/}
        {/*            </Text>*/}
        {/*          </View>*/}
        {/*        </View>*/}
        {/*        <View className='choice'>*/}
        {/*          <View className='choice_wrap'*/}
        {/*                style={item.checked ? 'background-color:#3298ff' : 'background-color:white'}>*/}

        {/*          </View>*/}
        {/*        </View>*/}
        {/*      </View>*/}
        {/*    )*/}
        {/*  })}*/}
        {/*</View>*/}
        {/*<View className='footer'>*/}
        {/*  <View className='bottom-wrap' onClick={this._nextStep}>*/}
        {/*    <Text style='margin:auto;color:#fff;' className='next-wrap'>下一步</Text>*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>
    )
  }
}

export default Combo
