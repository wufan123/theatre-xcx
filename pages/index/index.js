//获取应用实例
const webviewUtil = require('../../util/webviewUtil.js')
const theatreRest = require('../../rest/theatreRest.js')
var app = getApp()
Page({
  data: {
    bannerList: {
      list: []
    },
    goodsList: {
      ticketShow: [
        {id: "123"},{id: "456"},{id: "789"},{id: "456"},{id: "789"}
      ],
      ticketSet: [],
      ticketVoucher: []
    }
  },
  onLoad: function (e) {
    // banner
    theatreRest.getInformationList(10, success => {
      this.data.bannerList.list = success
      this.setData(this.data)
    }, error => {
      console.log(error)
    })
    // 组合购
    theatreRest.getPackageList(200, success => {
      this.data.goodsList.ticketSet = success
      this.setData(this.data)
    }, error => {
      console.log(success)
    })
    // 通兑券
    theatreRest.getPackageList(201, success => {
      this.data.goodsList.ticketVoucher = success
      this.setData(this.data)
    }, error => {
      console.log(success)
    })
  },
  login: function() {
    let userInfo = app.getUserInfo()
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
  // 场次票购买
  ticketFilm: function() {
    wx.navigateTo({
      url: '../ticket/index/index'
    });
  },
  // 限时抢购
  flashSale: function() {
    wx.navigateTo({
      url: '../business/flashSale/index',
    })
  },
  // 超级联合日
  unionDay: function() {
    wx.navigateTo({
      url: '../business/unionDay/unionDay',
    })
  },
  localProduct:function(e){
    wx.navigateTo({
      url: '../business/localProduct/localProduct?classType='+e.currentTarget.id,
    })
  },
  onShareAppMessage: function () {
      return {
          title: '中瑞剧坊',
          desc: '中瑞三坊七巷影音秀购票',
          path: '/pages/index/index'
      }
  }
})
