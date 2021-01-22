// 以下是业务服务器API地址
// 局域网测试使用
// var WxApiRoot = 'http://localhost:8082/wx/';
// 云平台部署时使用
let WxApiRoot = 'https://hstest.youjiankang.net';
export default {
  defineConstants: {
    LOCATION_APIKEY: JSON.stringify('4HCBZ-ERO6U-AQTVJ-BMVJH-FCJI6-WFB2T')
  },
  tmplIds:['91F5vWCWIp9dYyUdS4QLFuIa33gfzDM8WAX9_1Aimog','fjL81130dgH97zF7kO5IRmRn6ZSGR0TQFISyT7bxRwM','DpSCCpT6AjjRQyGEW-a-g1tTcO3jw5P9eQy8w5ryfT8'],
  imgUrl :'https://hstest.youjiankang.net/ncov',
  IndexUrl: WxApiRoot + 'home/index', //首页数据接口
  AboutUrl: WxApiRoot + 'home/about', //介绍信息
  CatalogList: WxApiRoot + 'catalog/index', //分类目录全部分类数据接口
  CatalogCurrent: WxApiRoot + 'catalog/current', //分类目录当前分类数据接口
  AuthLoginByWX: WxApiRoot + '/ncov/wx/user/login',
  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号
  StorageUpload: WxApiRoot + 'storage/upload', //图片上传,

  UserIndex: WxApiRoot + 'user/index', //个人页面用户相关信息
  IssueList: WxApiRoot + 'issue/list', //帮助信息
  CheckResultQuery:WxApiRoot + '/ncov/BaAppointmentController/my/result',
  checkResult:WxApiRoot + `/ncov/BaAppointmentController/result/get`,
  MyAppointApi:WxApiRoot + '/ncov/BaAppointmentController/getUserList',
  MyAuditRecord:WxApiRoot + '/ncov/BaAppointmentController/my/validate',
  queryOrgListByNameApi:WxApiRoot + '/ncov/baOrganization/getListByQueryName',
  queryComboListByOrgApi:WxApiRoot + `/ncov/BaComboController/getList`,
  fetchSourceApi:WxApiRoot +`/ncov/BaSourceController/getList`,
  appointDetect:WxApiRoot+'/ncov/BaAppointmentController/add',
  generateQrcode :WxApiRoot + `/ncov/BaAppointmentController/my/qrcode`,
  uploadFile:WxApiRoot+`/ncov/uploadController/perfect/uploadPhoto`,
  deleteOrder:WxApiRoot + `/ncov/BaAppointmentController/delete`,
  cancelOrder :WxApiRoot + `/ncov/BaAppointmentController/cancel`,
  getImgCode:WxApiRoot + `/ncov/BaAppointmentController/authImg`,
  QueryAppointRecord:WxApiRoot+`/ncov/BaAppointmentController/baseInfo/get`,
  createOrder :WxApiRoot +`/ncov/order/create`,
  getApplyTrade:WxApiRoot + `/ncov/trade/apply`
};
