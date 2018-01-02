const orderRest = require('../../../../rest/orderRest')
const modalUtil = require('../../../../util/modalUtil.js')

Page({
  data: {
    dataList: []
  },
  onLoad: function (options) {
    modalUtil.showLoadingToast()
    orderRest.getGoodsOrderList(success => {
      modalUtil.hideLoadingToast()
      this.data.dataList = success;
      this.setData(this.data)
    }, error => {
      modalUtil.hideLoadingToast()
    })
  },
  orderDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?orderNo='+e.currentTarget.id,
    })
  }
})