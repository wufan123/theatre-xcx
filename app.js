//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    serverUrlBase: 'https://m.zmaxfilm.com/Api_35',
    // serverUrlBase: 'https://premapi.zmaxfilm.com/Api_35',
    //serverUrlBase: 'http://newzr10.zmaxfilm.net:8181/Api_35',
    wapServerUrlBase: 'http://localhost:8080/#',
    
    appAccount: 'zhongruijufang',
    appPasswd: 'zrjf1123',
    appName: '中瑞剧坊',
    appVersion: '1.0.0',
    deviceType: 'weixin-xcx',
    cinemaCode: 'JC170001',
    servicePhone: '400-850-7010',

    tokenId: null,
    openId:'',

    userInfo: null,
    canUseCouponNum:0

  },
  setTokenId: function (tokenId) {
    this.globalData.tokenId = tokenId
    wx.setStorageSync('zmaxfilm_tokenId', tokenId)
  },
  setOpenId: function (openId) {
    wx.setStorageSync('zmaxfilm_openId', openId)
    this.globalData.openId = openId
  },
  getOpenId: function () {
    if (this.globalData.openId)
      return this.globalData.openId
    var openId = wx.getStorageSync('zmaxfilm_openId')
    this.globalData.openId = openId
    return this.globalData.openId
  },
  setUserAccount: function (account, passwd) {
    let info
    if (account && passwd)
      info = {
        account: account,
        passwd: passwd
      }
    wx.setStorageSync('zmaxfilm_account', info)
  },
  getUserAccount: function () {
    return wx.getStorageSync('zmaxfilm_account')
  },
  setUserInfo: function (userInfo) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('zmaxfilm_userInfo', userInfo);
  },
  getUserInfo: function () {
    var userInfo = wx.getStorageSync('zmaxfilm_userInfo');
    this.globalData.userInfo = userInfo;
    return userInfo;
  },
  getCinema: function () {
    var cinema = wx.getStorageSync('cinema')
    this.globalData.cinema = cinema
    this.globalData.cinemaCode = cinema.cinemaCode
  },
  setCinema: function (cinema) {
      this.globalData.cinema = cinema
      this.globalData.cinemaCode = cinema.cinemaCode
      wx.setStorageSync('cinema', cinema)
  },
  setCanUseCouponNum: function(num){
    this.globalData.canUseCouponNum = num;
  }
})