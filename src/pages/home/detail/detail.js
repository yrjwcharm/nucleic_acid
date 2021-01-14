import {Image, Text, View} from '@tarojs/components'
import React from 'react'
import './detail.scss'

const Detail = (props) => {
  return (
    <View className='container'>
      <View className='main'>
        <View className='result-view'>
          <Text className='result-text'>2020-nCoV-RNA核酸检测结果</Text>
        </View>
        <View className='status-view'>
          <Text className='status-text'>阴性</Text>
          <Image src={null} className='status-img'/>
        </View>
        <View className='list-row-view '>
          <Text className='label'>检测人姓名</Text>
          <Text className='value'>王琰龙</Text>
        </View>
        <View className='list-row-view'>
        <Text className='label'>检测医院</Text>
        <Text className='value'>大厂回族自治县人民医院</Text>
      </View>
        <View className='list-row-view'>
        <Text className='label'>检测日期</Text>
        <Text className='value'>2019-01-01</Text>
      </View>
      </View>
    </View>
  )
}
export default Detail
