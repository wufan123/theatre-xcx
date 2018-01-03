//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    serverUrlBase: 'https://jufang.zmaxfilm.com/preapi',
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
    canUseCouponNum:0,

    promoter: null, // 推广人手机号
    promotionType: 1,

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
  // needLogin=true，弹窗提示需要登陆
  getUserInfo: function (needLogin) {
    if (this.globalData.userInfo) {
      return this.globalData.userInfo;
    }
    var userInfo = wx.getStorageSync('zmaxfilm_userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      return userInfo;
    }
    if (needLogin) {
      var modalUtil = require('./util/modalUtil')
      modalUtil.showLoginModal()
    }
    return ''
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
  },

  // 记录推广信息（点击进入）
  recordPromotion: function(promoter, type) {
    this.globalData.promoter = promoter;
    if (type) {
      this.globalData.promotionType = type;
    }
    this.loginPromotion()
  },
  // 本次推广已登陆
  loginPromotion: function() {
    if (!this.globalData.promoter) {
      return;
    }
    let bindmobile = this.getUserInfo(false).bindmobile
    if (bindmobile) {
      var theatreRest = require('./rest/theatreRest')
      theatreRest.loginPromotion(this.globalData.promoter, bindmobile, this.globalData.promotionType, success => {
        this.globalData.promoter = null
      })
    }
  },
  // 完成推广（已下单）
  finishPromotion: function(orderId) {
    let bindmobile = this.getUserInfo(false).bindmobile
    if (bindmobile) {
      var theatreRest = require('./rest/theatreRest')
      theatreRest.finishPromotion(bindmobile, orderId)
    }
  }
})