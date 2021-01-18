import Taro from '@tarojs/taro'
import {Image, ScrollView, Text, View} from '@tarojs/components'
import './checkResult.scss'
import {getResultQueryListApi} from "../../../services/result_query";
import moment from 'moment'
import React, {Component} from 'react'
import * as user from "../../../utils/user";
import Forward from '@assets/home/forward.svg'
import Config from "../../../../project.config.json";
import _Empty from "@assets/empty.png";
import {AtTabsPane} from "taro-ui";
class Check_Result extends Component {
  state = {
    type: 0,
    list: [],
    page: 1,
    limit: 10,
    totalPage: 1,
    userId: '',
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
    getResultQueryListApi({
      userId: this.state.userId,
      page: this.state.page,
      size: this.state.limit
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

  _goToDetail = (item) => {
    Taro.navigateTo({
      url: `/pages/home/detail/detail?item=${JSON.stringify(item)}`,
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

  render() {
    const {list} = this.state;
    return (
      <ScrollView scrollY className='container'>
        <View className='section'>
          {list.length!==0?list && list.map((item, index) => {
            let date = moment(item.date).format('YYYY-MM-DD');
            let week = this._getWeek(item.date);
            return (
              <View className='query-view'>
                <View className='listItem' key={item.id + ""} onClick={()=>this._goToDetail(item)}>
                  <View className='listItem_left'>
                    <Text className='listItem_left_appoint'>预约人:{item.name}</Text>
                    <Text className='listItem_left_date'>{date} {week}</Text>
                  </View>
                  <View className='listItem_right'>
                    <Text className='listItem_right_status'>{item.state === '1' ? '立即查看' : '结果正在生成中'}</Text>
                    <Image src={Forward} className='listItem_right_arrow'/>
                  </View>
                </View>
              </View>
            )
          }):<Empty/>}
        </View>
      </ScrollView>
    )

  }
}
const Empty = () => {
  return (
    <View className='empty-view'>
      <View className='empty-wrap'>
        <Image src={_Empty} className='empty-img'/>
        <Text className='empty-text'>暂无检验结果哦~</Text>
      </View>
    </View>
  )
}
export default Check_Result
