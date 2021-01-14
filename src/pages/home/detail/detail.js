import {Image, Text, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react'
import './detail.scss'
import Status from '@assets/status.png'
import {getCurrentInstance} from "@tarojs/runtime";
import moment from 'moment';
import Api from "../../../config/api";
const Detail = (props) => {
  const [item,setItem]=useState({});
  useEffect(()=>{
    let {item} = getCurrentInstance().router.params;
    console.log(333,item);
    setItem(JSON.parse(item))
  },[])

  return (
    <View className='container'>
      <View className='main'>
        <View className='img-view'>
          <Image src={Api.imgUrl+item.resultUrl} />
        </View>
        {/*<View className='result-view'>*/}
        {/*  <Text className='result-text'>2020-nCoV-RNA核酸检测结果</Text>*/}
        {/*</View>*/}
        {/*<View className='status-view'>*/}
        {/*  <Text className='status-text'>阴性</Text>*/}
        {/*  <Image src={Status} className='status-img'/>*/}
        {/*</View>*/}
        {/*<View className='list-row-view '>*/}
        {/*  <Text className='label'>检测人姓名</Text>*/}
        {/*  <Text className='value'>王琰龙</Text>*/}
        {/*</View>*/}
        <View className='list-row-view'>
        <Text className='label'>检测日期</Text>
        <Text className='value'>{moment(item.date).format('YYYY-MM-DD')}</Text>
      </View>
        <View className='list-row-view'>
        <Text className='label'>检测人姓名</Text>
        <Text className='value'>{item.name}</Text>
      </View>
      </View>
    </View>
  )
}
export default Detail
