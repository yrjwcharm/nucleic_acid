import Taro from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import React,{Component} from 'react'
import './detail.scss'
const Detail =(props)=>{
  const listItems=[
    {label:'检测结果',value:'阴性'},
    {label:'检测人姓名',value:'金灿灿'},
    {label:'检测医院',value:'大厂回族自治县人民医院'},
    {label:'检测日期',value:'2019-01-09'},
    {label:'lgG抗体',value:'阴性'},
  ]
  return(
    <View className='container'>
      <View className='container_header'>
        <Text className='container_header_title'>2020-nCoV-RNA核酸检测结果</Text>
      </View>
      {listItems.map((item,index)=>{
        return(
          <View key={index.toString()} className='container_list'>
            <Text className='container_list_left'>{item.label}</Text>
            <Text className='container_list_right'>{item.value}</Text>
          </View>
        )
      })}
    </View>
  )
}
export  default  Detail
