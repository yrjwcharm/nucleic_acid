import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './certification.scss'
import Api from "../../../config/api";
import {isEmpty} from "../../../utils/EmptyUtil";
import {getCurrentInstance} from "@tarojs/runtime";
import {fetchAppointDetectApi} from "../../../services/combo";
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";

export default class UploadCertification extends Component {
  constructor() {
    super();
    this.state = {
      url: '',
      visible: true,
      userId:'',
    }

  }
  componentDidMount() {
    user.loginByWeixin({appid:Config.appid}).then(res => {
      if (res.code === 200) {
        console.log(333,res);
        const {userId, wxid, unionid, sectionKey} =res.data;
        this.setState({userId})
      }else{
        Taro.showToast({
          title:res.msg,
          icon:'none'
        })
      }
    })
  }

  /**
   * 提交审核
   */
  _submitAudit = async () => {
    const {url,userId} = this.state;
    let item = getCurrentInstance().router.params;

    console.log(333,item);
    const {
      cityid,
      date,
      districtid,
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

    } = JSON.parse(item);

    console.log(
      111,
      cityid,
      date,
      districtid,
      url,
      entourageIdCard,
      entourageName,
      entouragePhone,
      idCard,
      name,
      orgId,
      payType,
      phone,
      provinceid,
      sourceId,
      streetdesc,
      userId,

    );

    // if (isEmpty(url)) {
    //   Taro.showToast({
    //     title: '请先上传证明',
    //     icon: 'none',
    //   })
    //   return;
    // }
    // const res = await fetchAppointDetectApi({
    //   cityid,
    //   date,
    //   districtid,
    //   docUrl: url,
    //   entourageIdCard,
    //   entourageName,
    //   entouragePhone,
    //   entourageRelation,
    //   idCard,
    //   name,
    //   orgId,
    //   payType,
    //   phone,
    //   provinceid,
    //   sourceId,
    //   streetdesc,
    //   userId,
    //   userType:1,
    // })
    // res.code === 200 && Taro.redirectTo({
    //   url: '/pages/user/audit-record/auditRecord'
    // })

  }
  _chooseImage = () => {
    // 文档提供的示例
    let that = this;
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
          formData: {},
          success(res) {
            const data = JSON.parse(res.data);
            data.code === 200 && that.setState({url: Api.imgUrl + data.data}, () => {
              Taro.showToast({
                title: '上传成功',
                icon: 'none'
              })
            });
          }
        })
      }
    })

  }

  render() {
    const {url} = this.state;
    return (
      <View className='container'>

        <View className='main'>
          <View className='upload-img-container'>
            <View className='upload-img-view'>
              <View className='upload-img-wrap' onClick={this._chooseImage}>
                <Image src={url} className='upload-img'/>
                <Text className='upload-text'>上传证明</Text>
              </View>
            </View>
          </View>
          <View className='upload-wrap'>
            <Text className='upload-desc'>请联系医院工作人员获取证明，并拍照上传。</Text>
          </View>
        </View>
        <View className='footer'>
          <View className='btn-submit-view' onClick={this._submitAudit}>
            <Text className='btn-submit-text'>提交审核</Text>
          </View>
        </View>

      </View>
    )
  }
}
