Page({
    data: {
    },
    onLoad: function (e) {
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