import React,{Component} from 'react'
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './certification.scss'
import {AtActionSheet, AtActionSheetItem} from "taro-ui"

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

  }
  __selectPic=()=>{

  }
  // _getPicFromCapture=()=>{
  //   const cameraContext = Taro.createCameraContext()
  //    cameraContext.takePhoto({
  //      quality:'normal',
  //      fail:(res => {
  //         console.log(2222,res);
  //      }),
  //      success:(result => {
  //         console.log(3333,result);
  //      })
  //    })
  // }
  _chooseImage=()=>{
    // 文档提供的示例
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(333,res);
        let tempFilePaths = res.tempFilePaths
        Taro.uploadFile({
          url: Api.uploadFile, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success (res){
            const data = res.data
            //do something
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
            <Image src={url}/>
            <Text>证明</Text>
          </View>
        </View>
        <View className='footer' onClick={this._submitAudit}>
          <View className='footer_wrap'>
            <Text className='footer_wrap_btn'>提交审核</Text>
          </View>
        </View>
        {/*<AtActionSheet isOpened={visible} cancelText='取消' title='选择'>*/}
        {/*  <AtActionSheetItem onClick={ this._getPicFromCapture }>*/}
        {/*     拍摄*/}
        {/*  </AtActionSheetItem>*/}
        {/*  <AtActionSheetItem  onClick={this._getPicFromGallery}>*/}
        {/*    从相册选取*/}
        {/*  </AtActionSheetItem>*/}
        {/*</AtActionSheet>*/}

      </View>
    )
  }
}
