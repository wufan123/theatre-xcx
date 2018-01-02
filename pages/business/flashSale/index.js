const comboRest = require('../../../rest/comboRest.js')
const theatreRest = require('../../../rest/theatreRest.js')
const modalUtil = require('../../../util/modalUtil.js')
var app=getApp()
Page({
  data: {
    dataList: null
  },
  onLoad: function (e) {
    this.loadList()
  },
  // 刷新列表
  loadList: function() {
    modalUtil.showLoadingToast()
    theatreRest.getPackageList(202, success => {
      modalUtil.hideLoadingToast()
      this.data.dataList = success
      this.setData(this.data)
    }, error => {
      modalUtil.hideLoadingToast()
    })
  },
  // 立即抢
  submit: function(e) {
    this.createOrder(e.currentTarget.dataset.detail)
  },
  // 跳转我的优惠券
  seeCardClick: function() {
    wx.navigateTo({
      url: '/pages/me/coupon/index/index'
    })
  },
  // 创建订单
  createOrder: function(detail) {
    let packageStr = detail.hyPackageId + ":1"
    modalUtil.showLoadingToast()
    comboRest.createOrder(packageStr, app.getUserInfo().bindmobile, app.globalData.cinemaCode, success => {
      this.requestWxPay(success.packageId)
    }, error => {
        modalUtil.hideLoadingToast()
        modalUtil.showWarnToast(error.text);
    })
  },
  // 调用支付
  requestWxPay: function(orderId) {
    comboRest.packagePay(orderId, 'account', app.getOpenId(), success => {
      modalUtil.hideLoadingToast()
      modalUtil.showMsgModal('抢购成功')
    }, error => {
      modalUtil.hideLoadingToast()
      modalUtil.showWarnToast(error.text);
    })
  }
})