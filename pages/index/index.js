//获取应用实例
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
    wx.navigateTo({
      url: '../me/coupon/index/index'
    });
  },
  login: function() {
    wx.navigateTo({
      // url: '../login/login/login'
      url: '../me/index/index'
    });
  }
})
