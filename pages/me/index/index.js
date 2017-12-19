var app = getApp()
Page({
    data: {
      userInfo: {}
    },
    onLoad: function (e) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      console.log(app.globalData.userInfo)
    },
    cardManage: function() {
      wx.navigateTo({
        url: '../card/index/index'
      });
    },
    couponManage: function() {
      wx.navigateTo({
        url: '../coupon/index/index'
      });
    },
    makeCall:function(){
      wx.makePhoneCall({
        phoneNumber: '400-850-7010'
      })
    }
  })