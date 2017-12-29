const orderRest = require('../../../../rest/orderRest')

Page({
  data: {
    dataList: []
  },
  onLoad: function (options) {
    orderRest.getPackageOrderList(success => {
      this.data.dataList = success
      this.setData(this.data)
    }, error => {

    })
  },
  Detail: function (e) {
    let order = e.currentTarget.dataset.order
    var info = JSON.stringify(order)
    wx.navigateTo({
      url: '../detail/detail?info='+info,
    })
  }
})