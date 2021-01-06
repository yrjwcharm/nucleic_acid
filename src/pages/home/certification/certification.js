import React,{Component} from 'react'
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './certification.scss'
import {AtActionSheet, AtActionSheetItem} from "taro-ui"
import Api from "../../../config/api";
import {isEmpty} from "../../../utils/EmptyUtil";
import {getCurrentInstance} from "@tarojs/runtime";
export  default  class UploadCertification extends Component{
  constructor() {
    super();
    this.state={
      url:'',
      visible:true,
    }

  }

  /**
   * 提交审核
   */
  _submitAudit=()=>{
    let {
      cityid,
      date,
      docUrl,
      entourageIdCard,
      entourageName,
      entouragePhone,
      entourageRelation,
      idCard,
      name,
      orgId,
      payType,
      phone,
      provinceid,
      sourceId,
      streetdesc,
      userId,
      userType,} = getCurrentInstance().router.params;
    const {url} =this.state;
    if(isEmpty(url)){
      Taro.showToast({
        title:'请先上传证明',
        icon:'none',
      })
      return;
    }
    Taro.showToast({
      title:'提交成功\n' +
        '\n' +
        '证明已上传成功，医生会在一个工作日内返回结果',
      icon:'none'
    })

  }
  _chooseImage=()=>{
    // 文档提供的示例
    let that =this;
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        Taro.uploadFile({
          url: Api.uploadFile, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
          },
          success (res){
            const data =JSON.parse(res.data) ;
            console.log(333,data.data);
            data.code===200&&that.setState({url:Api.imgUrl+data.data},()=>{
              Taro.showToast({
                title:'上传成功',
                icon:'none'
              })
            });
          }
        })
      }
    })

  }

  render() {
    const {url,visible}=this.state;
    return(
      <View className='container'>

        <View className='main'>
          <View className='section' onClick={this._chooseImage}>
            <View className='section_img'>
              <Image src={url} className='section_pic' />
            </View>
          </View>
        </View>
        <View className='footer' onClick={this._submitAudit}>
          <View className='footer_wrap'>
            <Text className='footer_wrap_btn'>提交审核</Text>
          </View>
        </View>

      </View>
    )
  }
}
