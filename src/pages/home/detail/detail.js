import {Image, Text, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react'
import './detail.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import moment from 'moment';
const Detail = (props) => {
  const [item,setItem]=useState({});
  const [result,setResult] =useState('');
  useEffect(()=>{
    let {item,result} = getCurrentInstance().router.params;
    setItem(JSON.parse(item))
    setResult(result);
  },[])
 const  _getWeek = (date) => {
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
  return (
    <View className='container'>
      <View className='main'>
        <View className='result-view'>
          <Text className='result-text'>nCoV-RNA核酸检测结果</Text>
        </View>
        <View className='status-view'>
          <Text className='status-text'>{result}</Text>
        </View>
        <View className='list-row-view'>
          <Text className='label'>检测人姓名</Text>
          <Text className='value'>{item.name}</Text>
        </View>
        <View className='list-row-view '>
          <Text className='label'>检测人医院</Text>
          <Text className='value'>{item.orgName}</Text>
        </View>
        <View className='list-row-view'>
        <Text className='label'>检测日期</Text>
        <Text className='value'>{moment(item.date).format('YYYY-MM-DD')} {_getWeek(item.date)} </Text>
      </View>

      </View>
    </View>
  )
}
export default Detail
