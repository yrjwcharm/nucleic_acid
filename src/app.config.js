export default {
  pages: [
     'pages/home/home',
     'pages/user/user',
    'pages/auth/login/login',
    'pages/user/audit-record/auditRecord',
    'pages/home/query/checkResult',
    'pages/home/detail/detail',
    'pages/user/advance-order/advanceOrder',
    'pages/user/order-success/orderAppointSuccess',
    'pages/home/organization/organization',
    'pages/home/write-person-info/addPersonData',
    'pages/home/combo/combo',
    'pages/home/certification/certification'

  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#999",
    selectedColor: "#3399ff",
    backgroundColor: "#fff",
    borderStyle: 'black',
    list: [{
      pagePath: "pages/home/home",
      iconPath: "./assets/tab-bar/home.png",
      selectedIconPath: "./assets/tab-bar/home-active.png",
      text: "首页"
    }, {
      pagePath:'pages/user/user',
      iconPath: "./assets/tab-bar/user.png",
      selectedIconPath: "./assets/tab-bar/user-active.png",
      text: "我的"
    }],
  },

}
