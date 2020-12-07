import Taro  from '@tarojs/taro'
import {View, Text, ScrollView, Image, Input, Textarea, Picker} from '@tarojs/components'
import React,{Component,useState} from 'react'
import './addPersonData.scss'
import ArrowRight from '@assets/home/write-person-data/arrow_right.svg'
import ArrowDown from '@assets/home/write-person-data/arrow_down.svg'
import AddressPicker from "../../../components/address-picker/AddressPicker";
const AddPersonData = (props) => {
  const [detailAddress, setDetailAddress] = useState('');
  const [selector, setSelector] = useState(['父亲', '朋友', '亲戚', '母亲'])
  const [selectorChecked, setSelectorChecked] = useState('父亲');
  const [showPicker, setShowPicker] = useState(false);
  const [area, setArea] = useState('请选择');
  const [insEscortStaff, setInsEscortStaff] = useState(false);
  const listItems = [
    {label: '姓名', value: '闫瑞锋',type:'text'},
    {label: '电话', value: '18311410379',type :'number'},
    {label: '请输入验证码', value: '32123',type :'number'},
    {label: '身份证号', value: '142601199412139117',type:'number'},
  ]
  const handleChange = () => {

  }
  const toggleAddressPicker = (areaInfo, disCoding) => {
    console.log(444, areaInfo + ' ' + disCoding);
    setShowPicker(false);
    setArea(areaInfo);

  }
  const goToImmediatelyOrder = () => {
    Taro.navigateTo({
      url: '/pages/home/immediate-order/immediateOrder',
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
  const _onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }
  const insEscortStaffClick = () => {
    setInsEscortStaff(true);
  }
  const showAreaPicker = () => {
    setShowPicker(true);
  }
  return (
    <View className='container'>
      <View className='container_section'>
        {listItems.map((item, index) => {
          return (
            <View className='clearfix listRow' key={index.toString()}>
              <Text className='listRow_left'>{item.label}</Text>
              <Input type={item.type} className='listRow_right_' placeholder='' value={item.value} maxLength='20'/>

              {/*<Text className='listRow_right'>{item.value}</Text>*/}
            </View>
          )
        })}
        <View className='clearfix listRow' style='border:none;' onClick={showAreaPicker}>
          <Text className='listRow_left'>地址</Text>
          <View className='listRow_right'>
            <Text className='listRow_right_address' style='color:#999'>{area}</Text>
            <Image src={ArrowRight} className='listRow_right_arrow'/>
          </View>
        </View>
        <AddressPicker pickerShow={showPicker} onHandleToggleShow={toggleAddressPicker}/>
        <Textarea value={''} placeholder={'请输入详细地址'} className='detail_address'/>
        {!insEscortStaff ? <View className='insEscortStaff' onClick={insEscortStaffClick}>
          <Text className='insEscortStaff_text'>+增加陪同人员</Text>
        </View> : null}
        {insEscortStaff ? <View className='insEscortStaff_wrap'>
          <View className='clearfix listRow'>
            <Text className='listRow_left'>姓名</Text>
            <Input type='text' className='listRow_right_' placeholder='' value={'张三'} maxLength='20'/>
          </View>
          <View className='clearfix listRow'>
            <Text className='listRow_left'>与患者关系</Text>
            <View className='listRow_right'>
              <Text className='listRow_right_relative'>父亲</Text>
              <Image src={ArrowDown} style='transform: rotate(270deg);' className='listRow_right_arrowDown'/>
            </View>
          </View>
          <View className='clearfix listRow'>
            <Text className='listRow_left'>电话</Text>
            <Input type='number' className='listRow_right_' placeholder='' value='18311410379' maxLength='20'/>
          </View>
          <View className='clearfix listRow'>
            <Text className='listRow_left'>身份证号</Text>
            <Input type='number' className='listRow_right_' placeholder='' value='142601199412139117' maxLength='20'/>
          </View>
        </View> : null}
      </View>
      <View className='container__footer' onClick={goToImmediatelyOrder}>
        <View className='container_footer'>
          <Text className='container_footer_next'>下一步</Text>
        </View>
      </View>
    </View>
  )
}
export default AddPersonData
