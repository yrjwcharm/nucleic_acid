import Taro from '@tarojs/taro'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import './combo.scss'
import React, { Component } from "react";
import { getCurrentInstance } from "@tarojs/runtime";
import { fetchSourceApi, queryComboListByOrgApi } from "../../../services/combo";
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
    orgName: '',
    sourceList: [],
    price: 0,
    obj: {},
  }

  componentDidMount() {
    let { orgId, item, userType, obj } = getCurrentInstance().router.params;
    const { orgName, } = JSON.parse(item);
    this.setState({ orgId, userType, orgName, obj: obj && JSON.parse(obj), item: JSON.parse(item) }, () => {

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
    let dateArr = [];
    for (let i = 0; i <= max; i++) {
      let date = moment().add('days', i).format('YYYY-MM-DD');
      let week = this._getWeek(date);
      if (i === 0) {

        dateArr.push({
          id: i,
          date,
          week,
          amount: 0,
          comboId: '',
          orgId: '',
          sourceId: '',
          surplus: 0,
          checked: true,
        })
      } else {
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
    }

    const res = await queryComboListByOrgApi({
      orgId
    })

    if (res.code === 200) {
      if (Array.isArray(res.data)) {
        res.data.map((item, index) => {
          index === 0 ? item.checked = true : item.checked = false;
        })
        this.setState({ comboList: res.data, price: res.data[0].price, comboId: res.data[0].comboId, dateArr: [...dateArr] }, () => {
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
    if (comboId) {
      const _res = await fetchSourceApi({
        comboId,
        startDate,
        endDate
      })
      const { dateArr } = this.state;
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
              // _item.surplus>0?item.checked=true:item.checked = false;
            }
          })
        })
        this.setState({ dateArr: [...dateArr], sourceList: _res.data, startDate, endDate })
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

        _item.checked = true;

      }
    })
    this.setState({ dateArr: [...this.state.dateArr] }, () => {
      this._getSource(this.state.comboId, item.date, item.date);
    })
  }
  onScroll = () => {
  }
  // /**
  //  * 选择套餐
  //  * @param item
  //  * @private
  //  */
  // _selectedCombo = (item) => {
  //   // this.state.comboList.map((_item, index) => {
  //   //   _item.checked = false;
  //   //   if (JSON.stringify(item) === JSON.stringify(_item)) {
  //   //
  //   //     _item.checked = !item.checked;
  //   //
  //   //   }
  //   // })
  //   // this.setState({comboList: [...this.state.comboList]}, () => {
  //   //   let comboId = '';
  //   //   const {comboList} = this.state;
  //   //   for (let i = 0; i < comboList.length; i++) {
  //   //     if (comboList[i].checked) {
  //   //       comboId = comboList[i].comboId;
  //   //     }
  //   //   }
  //   // })
  //
  // }
  /**
   * 下一步
   * @private
   */
  _nextStep = (item) => {
    const { dateArr, userType, orgName, obj } = this.state;
    let source = { comboId: this.state.comboId, ...item, orgName, price: this.state.price }
    console.log(333, userType);
    if (item.amount > 0) {
      userType == 1 && Taro.navigateTo({
        url: `/pages/home/write-person-info/addPersonData?item=${JSON.stringify(source)}&obj=${JSON.stringify(obj)}`
      })
      userType == 2 && Taro.navigateTo({
        url: `/pages/home/write-patient-info/writePatientInfo?item=${JSON.stringify(source)}&obj=${JSON.stringify(obj)}`
      })
    }
  }

  render() {
    const { dateArr, comboList, startDate, sourceList, item } = this.state;
    let _item = {};
    let _sourceList = sourceList && sourceList.filter(item => moment(item.date).format('YYYY-MM-DD') === startDate);
    // console.log(333,_sourceList);
    // for (let i = 0; i < _sourceList.length; i++) {
    //   if (_sourceList[i].timeType === 0) {
    //     _item = _sourceList[i];
    //     _sourceList.splice(i, 1);
    //     break;
    //   }
    // }
    // _sourceList.unshift(_item);
    return (
      <View className='container-box'>
        <View className='main'>
          <View className='list-row-container' onClick={() => this.goToCombo(item)} key={item.orgId + " "}>
            <View className='list-row-view'>
              <Image src={Api.imgUrl + item.url} className='hospital-img' />
              <View className='hospital-info-view'>
                <Text
                  className='hospital-title'>{item.orgName && item.orgName.length > 10 ? item.orgName.substring(0, 10) + "..." : item.orgName}</Text>
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
                        {item.surplus > 0 ? '有号' : '约满'}
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
          {comboList.length !== 0 && comboList.map((item, index) => {
            return (
              <View className='combo-list' key={item.comboId + " "}>
                <View className='combo-wrap'>
                  <View style='display:flex;flex-direction:column;'>
                    <Text className='title'>新冠核酸检测预约套餐</Text>
                    <Text className='content'>套餐内容：预约挂号、核酸检测</Text>
                    <Text className='price'>￥{item.price}</Text>
                  </View>
                  <View className='choice-view'>
                    <View className='choice-wrap'
                      style={item.checked ? 'background: #3299FF' : 'background:transparent'}>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
          {_sourceList.length !== 0 && _sourceList.map(item => {
            return (
              <View className='list-row' key={item.sourceId + " "}>
                <View className='list-row-wrap'>
                  <View style='display:flex;flex-direction:row;align-items:center'>
                    <Image src={Clock} className='clock-img' />
                    <Text className='time-text'>{item.timeType === 0 ? '上午' : item.timeType === 1 ? '下午' : '全天'}</Text>
                    <Text className='time-range-text'>{item.timeType === 0 ? '8:00～11:00' : '1:00～4:00'}</Text>
                  </View>
                  <View style='display:flex;flex-direction:row;align-items:center'>
                    <Text className='sy-text'>剩余：</Text>
                    <Text className='surplus--text'>{item.surplus}</Text>
                  </View>
                  <View className='right-away-order-view' style={item.amount > 0 ? 'background-color:#3299FF' : 'background: #DDDDDD'} onClick={() => this._nextStep(item)}>
                    <Text className='right-away-order-text'>立即预约</Text>
                  </View>
                </View>
              </View>)
          })}
        </View>
      </View>
    )
  }
}

export default Combo
