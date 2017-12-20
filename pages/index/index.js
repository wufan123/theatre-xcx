//获取应用实例
var app = getApp()
Page({
  data: {
    bannerList: {
      list: [
        {url: "http://pic23.photophoto.cn/20120530/0020033092420808_b.jpg"}
      ]
    },
    goodsList: {
      ticketShow: [
        {id: "123"},{id: "456"},{id: "789"},{id: "456"},{id: "789"}
      ],
      ticketSet: [
        {id: "123"},{id: "456"},{id: "789"}
      ],
      ticketVoucher: [
        {id: "123"},{id: "456"},{id: "789"}
      ]
    }
  },
  onLoad: function (e) {
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
  ticketFilm: function() {
    wx.navigateTo({
      url: '../film/index/index'
    });
  }
})
