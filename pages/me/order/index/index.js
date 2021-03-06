const orderRest = require('../../../../rest/orderRest')
const modalUtil = require('../../../../util/modalUtil.js')

Page({
  data: {
    dataList: [],
    page: 1,
    canReachBottom: true
  },
  onLoad: function (options) {
    this.requestOrderList()
  },
  // 获取数据
  requestOrderList: function() {
    modalUtil.showLoadingToast()
    orderRest.getAllMoiveOrder(null, this.data.page, success => {
      modalUtil.hideLoadingToast()
      if (!success || success.length <= 0) {
        this.data.canReachBottom = false
        this.setData(this.data)
        return;
      }
      success.forEach(item => {
        this.data.dataList.push(item);
      })
      this.data.canReachBottom = true
      this.setData(this.data)
    }, error => {
      modalUtil.hideLoadingToast()
    })
  },
  // 触底加载
  onReachBottom: function() {
    if (!this.data.canReachBottom) {
      return;
    }
    this.data.page += 1
    this.setData(this.data)
    this.requestOrderList()
  },
  // 点击详情
  orderDetail: function (e) {
    let order = e.currentTarget.dataset.order
    wx.navigateTo({
      url: '../detail/detail?orderId='+order.orderCode,
    })
  }
})