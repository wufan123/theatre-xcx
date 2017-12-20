const userRest = require('../../../rest/userRest.js')
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
    orderManage: function(e) {
      wx.navigateTo({
        url: '../order/index/index'
      });
    },
    makeCall:function(){
      wx.makePhoneCall({
        phoneNumber: app.globalData.servicePhone
      })
    },
    loginOut: function (e) {
      wx.showModal({
          title: '温馨提示',
          content: '确定退出登录?',
          confirmColor: '#dc3c38',
          success: function (res) {
              if (res.confirm) {
                userRest.logout(() => {
                      app.setUserInfo(null)
                      app.setUserAccount()
                      wx.navigateBack()
                  })
              } else if (res.cancel) {
  
              }
          }
      })
  
    }
  })