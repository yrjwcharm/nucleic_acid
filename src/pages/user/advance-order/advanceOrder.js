import Taro from '@tarojs/taro'
import {Image, Text, View} from '@tarojs/components'
import {AtTabs, AtTabsPane,} from "taro-ui"
import './advanceOrder.scss'
import {getMyAppointListApi} from "../../../services/user";
import moment from "moment";
import React, {Component} from 'react'
import Api from '../../../config/api';
import * as user from "../../../utils/user";
import Forward from '@assets/home/forward.svg'
import Config from "../../../../project.config.json";
import _Empty from "@assets/empty.png";

export class AdvanceOrder extends Component {
  state = {
    current: 0,
    list: [],
    state: '',
    page: 1,
    limit: 10,
    totalPage: 1,
    userId: '',
    tabList: [{title: '全部', id: 0}, {title: '预约中', id: 1}, {title: '已预约', id: 2}, {title: '已完成', id: 3}]
  }

  componentDidMount() {
    this._initData();
  }

  _initData = async () => {
    const res = await user.loginByWeixin({appid: Config.appid});
    if (res.code === 200) {
      console.log(333, res);
      const {userId, wxid, unionid, sectionKey} = res.data;
      this.setState({userId}, () => {
        this._getList();
      })
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  }

  _getList = () => {
    Taro.showLoading({
      title: '加载中...',
    });
    getMyAppointListApi({
      userId: this.state.userId,
      page: this.state.page,
      size: this.state.limit,
      state: this.state.state
    }).then(res => {
      console.log(444, res);
      if (res.code === 200) {
        if (res.data) {
          const {object, totalPage} = res.data;
          if (Array.isArray(object)) {
            this.setState({list: this.state.list.concat(object), totalPage})
          } else {
            this.setState({list: this.state.list.concat([]), totalPage})
          }
        }
      }
      Taro.hideLoading();
    })

  }

  onReachBottom() {
    if (this.state.totalPage > this.state.page) {
      this.setState({
        page: this.state.page + 1
      }, () => {
        this._getList();
      });

    } else {
      Taro.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  }

  handleClick = (value) => {
    let state = '';
    switch (value) {
      case 0:
        state = '';
        break;
      case 1:
        state = 0;
        break;
      case 2:
        state = 1;
        break;
      case 3:
        state = 2;
        break;
      case 4:
        state = 3;
        break;
    }
    this.setState({current: value, state, page: 1, list: []}, () => {
      this._getList();
    })
  }
  goToPage = (item) => {
    console.log(333,item);
    if (item.state == 1) {
      Taro.navigateTo({
        url: `/pages/user/order-success/orderAppointSuccess?item=${JSON.stringify(item)}`,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {
            console.log(data)
          },
          someEvent: function (data) {
            console.log(data)
          }
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', {data: 'test'})
        }
      })
    }
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
  _orderOp = async (item) => {
    item.state == 1 && Taro.request({
      url: Api.cancelOrder + `?id=${item.id}`, //仅为示例，并非真实的接口地址
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(333, res);
        const _res = res.data;
        _res.code == 200 && this.setState({page: 1, list: []}, () => {
          this._getList();
        })
      }
    })

  }
  _deleteOrder = (item) => {
    Taro.request({
      url: Api.deleteOrder + `?id=${item.id}`, //仅为示例，并非真实的接口地址
      data: {},
      method: 'DELETE',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        const _res = res.data;
        _res.code == 200 && this.setState({page: 1, list: []}, () => {
          this._getList();
        })
      }
    })
  }

  render() {
    const {current, tabList, list} = this.state;
    console.log(333, list);
    return (
      <View className='container'>
        <View className='main'>
          <AtTabs current={current} tabList={tabList} onClick={this.handleClick}>
            {tabList.map((item, index) => {
              return (
                <AtTabsPane  className='at-tab' key={item.id + ""} current={current} index={index}>
                  {list.length!==0?list.map((_item, index) => {
                      let date = moment(_item.date).format('YYYY-MM-DD');
                      let week = this._getWeek(_item.date);
                      return (
                        <View className='wrap' key={_item.id + " "} >
                          <View className='main'>
                            <View className='listItem'>
                              <View className='listItem_left'>
                                <Text className='listItem_left_appoint'>预约人:{_item.name}</Text>
                                <Text className='listItem_left_date'>{date} {week}</Text>
                              </View>
                              <View className='listItem_right' onClick={(item) => this.goToPage(_item)}>
                                <Text
                                  className='listItem_right_status'>{_item.state == 0 ? '预约中' : _item.state == 1 ? '已预约' : _item.state == 2 ? '已完成' : '已取消'}</Text>
                                <Image src={Forward} className='listItem_right_arrow'/>
                              </View>
                            </View>
                            <View className='footer' >
                              <View className='op_btn_1' onClick={() => this._orderOp(_item)}>
                                <Text>{_item.state == 1 ? '取消预约' : '再次预约'}</Text>
                              </View>
                              {_item.state == 3 && <View className='op_btn_2' onClick={() => this._deleteOrder(_item)}>
                                <Text>删除</Text>
                              </View>}
                            </View>
                          </View>
                        </View>
                      )
                    }):<Empty/>}
                </AtTabsPane>
              )
            })}
          </AtTabs>
        </View>
      </View>
    )
  }
}

const Empty = () => {
  return (
    <View className='empty-view'>
      <View className='empty-wrap'>
        <Image src={_Empty} className='empty-img'/>
        <Text className='empty-text'>暂无预约信息哦~</Text>
      </View>
    </View>
  )
}
export default AdvanceOrder
