import Taro from '@tarojs/taro'
import {CoverImage, Image, ScrollView, Text, View} from '@tarojs/components'
import {AtModal, AtModalAction, AtModalContent} from "taro-ui"

import Doctor from '@assets/home/combo/doctor.png'
import Dot from '@assets/home/combo/dot.svg'
import './combo.scss'
import React, {Component} from "react";
import {getCurrentInstance} from "@tarojs/runtime";
import {fetchSourceApi, queryComboListByOrgApi} from "../../../services/combo";
import moment from 'moment';
import Api from '../../../config/api'
import Shadow from '@assets/home/Shadow.png'

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
    startDate: '',
    endDate: '',
    visible: false,
    source: {},
    isFree: true,
    isSelfPay: false,
  }

  componentDidMount() {
    let {orgId, item} = getCurrentInstance().router.params;
    this.setState({orgId, item: JSON.parse(item)}, () => {

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
    const {dateArr} = this.state;
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
    }) : this.setState({visible: true, source: item})
  }

  _choiceFree = () => {
    this.setState({isFree: true, isSelfPay: false})
  }
  _choiceSelfPay = () => {
    this.setState({isFree: false, isSelfPay: true})
  }
  _confirmPayType = () => {
    if (this.state.isFree) {
      this.setState({visible: false}, () => {
        Taro.navigateTo({
          url: `/pages/home/write-person-info/addPersonData?item=${JSON.stringify(this.state.source)}&userType=1`
        })
      })
      return;
    }
    if (this.state.isSelfPay) {
      this.setState({visible: false}, () => {
        Taro.navigateTo({
          url: `/pages/home/write-person-info/addPersonData?item=${JSON.stringify(this.state.source)}&userType=2`
        })
      })
      return;
    }
    Taro.showToast({
      title: '请选择付费类型',
      icon: 'none'
    })
  }
  _cancelPayType = () => {
    this.setState({visible: false})
  }

  render() {
    const {dateArr, comboList, item} = this.state;
    console.log(333, item);
    return (
      <View className='container'>
        <View className='container_header'>
          <View className='container_header_list_item'>
            <Image src={Api.imgUrl + item.url} className='container_header_list_item_pic'/>
            <View className='container_header_list_item_desc'>
              <Text className='container_header_list_item_desc_hospital'>{item.orgName && item.orgName}</Text>
              <Text className='container_header_list_item_desc_item'>核酸检测</Text>
              <Text
                className='container_header_list_item_desc_address'>{item.wholeAddress && item.wholeAddress}</Text>
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
                <View className='wrap' key={item.id + " "} onClick={() => this._selectedSource(item)}>
                  <View className='wrap_content'
                        style={item.checked ? 'background-color:rgba(51, 153, 255, 0.698039215686274)' : 'background-color:white'}>
                    <Text className='wrap_content_week'
                          style={item.checked ? 'color:#fff' : 'color:#333'}>{item.week}</Text>
                    <Text className='wrap_content_date'
                          style={item.checked ? 'color:#fff' : 'color:#666'}>{month_day}</Text>
                    <Text className='wrap_content_status' style={item.checked ? 'color: #fff' : 'color:#999'}>
                      {'剩余' + item.surplus}
                    </Text>
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
          {comboList.map((item, index) => {
            return (
              <View className='footer_comboList' key={item.comboId + " "} onClick={() => this._selectedCombo(item)}>
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
                <View className='choice'>
                  <View className='choice_wrap'
                        style={item.checked ? 'background-color:#3298ff' : 'background-color:white'}>

                  </View>
                </View>
              </View>
            )
          })}
        </View>
        <AtModal closeOnClickOverlay={false} isOpened={this.state.visible}>
          <AtModalContent>
            <View className='payType'>
              <Text className='payType_title'>请选择付费类型</Text>
              <View className='pay_row pay_row_top' onClick={this._choiceFree}>
                <View className='radio'>
                  <View className='radio_wrap'
                        style={this.state.isFree ? 'background-color:#3399FF' : 'background-color:#fff'}/>
                </View>
                <Text className='radio_desc'>免费患者(发热门诊或住院患者)</Text>
              </View>
              <View className='pay_row pay_row__top' onClick={this._choiceSelfPay}>
                <View className='radio'>
                  <View className='radio_wrap'
                        style={this.state.isSelfPay ? 'background-color:#3399FF' : 'background-color:#fff'}/>
                </View>
                <Text className='radio_desc'>自费付费患者</Text>
              </View>
            </View>
          </AtModalContent>
          <AtModalAction>
            <View className='container_action'>
              <View className='cancel' onClick={this._cancelPayType}>
                <Text className='cancel_text'>取消</Text>
              </View>
              <View className='confirm' onClick={this._confirmPayType}>
                <Text className='confirm_text'>确定</Text>
              </View>
            </View>
          </AtModalAction>

        </AtModal>
        <View style={{position: 'absolute', bottom: 0, width: '100%'}} onClick={this._nextStep}>
          <View className='bottom_wrap'>
            <Text style={{color: '#fff', fontSize: '16px'}}>立即预约</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default Combo
