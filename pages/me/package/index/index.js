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
  Detail: function () {
    wx.navigateTo({
      url: '../detail/detail',
    })
  }
})