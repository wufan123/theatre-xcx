const orderRest = require('../../../../rest/orderRest')

Page({
  data: {
    dataList: []
  },
  onLoad: function (options) {
    orderRest.getAllMoiveOrder(9, 0, success => {
      this.data.dataList = success;
      this.setData(this.data)
    }, error => {

    })
  },
  orderDetail: function (e) {
    let order = e.currentTarget.dataset.order
    wx.navigateTo({
      url: '../detail/detail?info='+JSON.stringify(order),
    })
  }
})