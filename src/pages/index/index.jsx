import React, {Component} from 'react'
import {View, Text} from '@tarojs/components'
import './index.scss'
import Taro from "@tarojs/taro";

export default class Index extends Component {

  componentWillMount() {
  }

  componentDidMount() {
    console.log(444, 'ssssss');
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }
  render() {
    return (
      <View className='index'>

        <View onClick={this._goToTest}>
          <Text>Hello world!</Text>
        </View>
      </View>
    )
  }
}
