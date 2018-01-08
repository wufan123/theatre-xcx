const orderRest = require('../../../../rest/orderRest')
const modalUtil = require('../../../../util/modalUtil.js')
var app = getApp()

Page({
  data: {
    dataList: []
  },
  onLoad: function (options) {
    this.requestOrderList()
  },
  // 获取数据
  requestOrderList: function() {
    modalUtil.showLoadingToast()
    orderRest.getPackageOrderList(success => {
      success.forEach(item => {
        if (item.price>0) {
          this.data.dataList.push(item);
        }
      })
      this.setData(this.data)
      modalUtil.hideLoadingToast()
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