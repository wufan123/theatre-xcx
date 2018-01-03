const comboRest = require('../../../rest/comboRest.js')
const theatreRest = require('../../../rest/theatreRest.js')
const modalUtil = require('../../../util/modalUtil.js')
var app=getApp()
Page({
  data: {
    dataList: null,
    buyingDetail: null
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
    this.data.buyingDetail = detail
    this.setData(detail)
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
      if (this.data.buyingDetail) {
        this.data.dataList.forEach(item => {
          if (item.id == this.data.buyingDetail.id) {
            item.stock--
          }
        })
        this.setData(this.data)
      }
      modalUtil.hideLoadingToast()
      modalUtil.showMsgModal('抢购成功')
    }, error => {
      modalUtil.hideLoadingToast()
      modalUtil.showWarnToast(error.text);
    })
  }
})