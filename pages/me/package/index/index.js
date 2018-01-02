const orderRest = require('../../../../rest/orderRest')
const modalUtil = require('../../../../util/modalUtil.js')

Page({
  data: {
    dataList: []
  },
  onLoad: function (options) {
    modalUtil.showLoadingToast()
    orderRest.getPackageOrderList(success => {
      modalUtil.hideLoadingToast()
      this.data.dataList = success
      this.setData(this.data)
    }, error => {
      modalUtil.hideLoadingToast()
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