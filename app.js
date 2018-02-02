//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    serverUrlBase: 'https://jufang.zmaxfilm.com/preapi',
    
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
    recommendId: null,

    pageData: null, // 存放页面参数（有一些需要传递大量的数据，uri有长度限制）
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
  setPageData: function (pageData) {
    this.globalData.pageData = pageData
  },
  getPageData: function() {
    return this.globalData.pageData
  },
  // 记录推广信息（点击进入）
  recordPromotion: function(promoter, type, recommendId) {
    this.globalData.promoter = promoter;
    this.globalData.recommendId = recommendId;
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
  finishPromotion: function(orderId, price, ticketsCnt) {
    let bindmobile = this.getUserInfo(false).bindmobile
    if (bindmobile) {
      var theatreRest = require('./rest/theatreRest')
      theatreRest.finishPromotion(bindmobile, orderId, price, ticketsCnt)
    }
  },
  // 分享
  shareMessage: function() {
    let path = '/pages/index/index';
    let params = ''
    let phone = this.getUserInfo(false).bindmobile
    if (phone) {
      if (params) {
        params += '&';
      } else {
        params += '?';
      }
      params += 'promoter='+phone
    }
    let userId = this.getUserInfo(false).userId
    if (userId) {
      if (params) {
        params += '&';
      } else {
        params += '?';
      }
      params += 'recommendId='+userId
    }
    return {
        title: '中瑞剧坊',
        desc: '中瑞三坊七巷影音秀购票',
        path: path+params
    }
  }
})