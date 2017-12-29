Page({
  data: {
    orderId: '',
    orderType: ''
  },
  onLoad: function (e) {
    this.data.orderId = e.orderId
    this.data.orderType = e.orderType
    this.setData(this.data)
  },
  gotoOrderDetail: function() {
    if (this.data.orderType == 'package') {
      wx.redirectTo({
        url: '/pages/me/package/index/index'
      })
    } else {
      wx.navigateBack();
    }
  }
})