const orderRest = require('../../../../rest/orderRest')

Page({
  data: {
    dataList: []
  },
  onLoad: function (options) {
    orderRest.getGoodsOrderList(success => {
      this.data.dataList = success;
      this.setData(this.data)
    }, error => {

    })
  },
  orderDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?orderNo='+e.currentTarget.id,
    })
  }
})