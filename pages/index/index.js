//获取应用实例
const theatreRest = require('../../rest/theatreRest.js')
var app = getApp()
Page({
  data: {
    bannerList: {
      list: []
    }
  },
  onLoad: function (option) {
    console.log(option)
    // 记录推广信息
    if (option.promoter) {
      app.recordPromotion(option.promoter, option.type)
    }
    // banner
    theatreRest.getInformationList(10, success => {
      this.data.bannerList.list = success
      this.setData(this.data)
    }, error => {
      console.log(error)
    })
  },
  login: function() {
    let userInfo = app.getUserInfo(false)
    if (userInfo) {
      wx.navigateTo({
        url: '../me/index/index'
      });
    } else {
      wx.navigateTo({
        url: '../login/login/login'
      });
    }
  },
  // banner 点击
  bannerClick: function(e) {
    let banner = e.currentTarget.dataset.banner
    if (!banner.click) {
      return;
    }
    // 链接跳转
    if (banner.redirectType == 1 || banner.redirectType == 2 || banner.redirectType == 3) {
      wx.navigateTo({
        url: '/pages/webview/webview?url='+banner.contentUrl
      });
    } 
    // 卖品
    else if (banner.redirectType == 4) {
      wx.navigateTo({
        url: '/pages/business/goodDetail/goodDetail?goodsId='+banner.redirectId
      });
    }
    // 套票
    else if (banner.redirectType == 5) {
      wx.navigateTo({
        url: '/pages/package/detail/detail?packageId='+banner.redirectId
      });
    }
    // 场次票
    else if (banner.redirectType == 6) {
      wx.navigateTo({
        url: '/pages/ticket/index/index'
      });
    }
  },
  // 场次票购买
  ticketFilm: function() {
    wx.navigateTo({
      url: '../ticket/index/index'
    });
  },
  // 套票购买
  createPackageOrder: function(e) {
    wx.navigateTo({
      url: '../package/index/index'
    });
  },
  // 限时抢购
  flashSale: function() {
    wx.navigateTo({
      url: '../business/flashSale/index',
    })
  },
  localProduct:function(e){
    wx.navigateTo({
      url: '../business/localProduct/localProduct?classType='+e.currentTarget.id,
    })
  },
  // 跳转我的优惠券
  seeCardClick: function () {
    wx.navigateTo({
      url: '/pages/me/coupon/index/index'
    })
  },
  onShareAppMessage: function () {
    let path = '/pages/index/index';
    let phone = app.getUserInfo(false).bindmobile
    if (phone) {
      path += '?promoter='+phone
    }
    return {
        title: '中瑞剧坊',
        desc: '中瑞三坊七巷影音秀购票',
        path: path
    }
  }
})
