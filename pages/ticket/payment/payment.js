Page({
    data: {
    },
    onLoad: function (e) {
    },
    pay: function() {
      wx.redirectTo({
        url: '../payResult/paySuccess/index',
      })
    }
})