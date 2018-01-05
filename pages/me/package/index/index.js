const orderRest = require('../../../../rest/orderRest')
const modalUtil = require('../../../../util/modalUtil.js')
var app = getApp()

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
    app.setPageData(e.currentTarget.dataset.order)
    wx.navigateTo({
      url: '../detail/detail?pageData=1'
    })
  }
})