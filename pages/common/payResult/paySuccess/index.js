var app = getApp()
Page({
  data: {
    orderId: '',
    orderType: ''
  },
  onLoad: function (e) {
    this.data.orderId = e.orderId
    this.data.orderType = e.orderType
    this.setData(this.data)
    // 场次票购买完成
    if (this.data.orderType == 'goodsAndFilm') {
      app.finishPromotion(this.data.orderId)
    }
  },
  gotoOrderDetail: function() {
    if (this.data.orderType == 'package') {
      wx.redirectTo({
        url: '/pages/me/package/index/index'
      })
    } else if (this.data.orderType == 'goodsAndFilm') {
      wx.redirectTo({
        url: '/pages/me/order/index/index'
      })
    } else if (this.data.orderType == 'goods') {
      wx.redirectTo({
        url: '/pages/me/localProduct/index/index'
      })
    } else {
      wx.navigateBack();
    }
  }
})