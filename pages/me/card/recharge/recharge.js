const cardRest = require('../../../../rest/cardRest.js')
const modalUtil = require('../../../../util/modalUtil.js')
const wxRest = require('../../../../rest/wxRest.js')
const app = getApp()

Page({
  data: {
    amount: 0,
    cardId: ''
  },
  onLoad: function (options) {
    console.log('cardId', options)
    this.data.cardId = options.cardId
    this.setData(this.data)
  },
  bindAmountInput: function (e) {
    this.data.amount = e.detail.value
    this.setData(this.data)
  },
  recharge: function () {
    var that = this;
    if (!this.data.amount||this.data.amount<=0) {
      modalUtil.showFailToast("请输入充值金额")
      return;
    }
    modalUtil.showLoadingToast()
    let openId = app.getOpenId();
    let payType = 'weixinpay'
    console.log('openId',openId)
    cardRest.recharge(this.data.amount, app.globalData.cinemaCode, this.data.cardId, payType, openId, function (res) {
      console.log("请求支付", res)
      modalUtil.hideLoadingToast()
      if (payType == 'weixinpay') {//启动微信支付
        that.requestWxPay(res.weixinpay)
      } else {
        console.log("无需支付", res)
        this.checkOrderStatus()
      }
      console.log('充值成功')
    })
  },
  //启动微信支付
  requestWxPay: function (weixinpay) {
    var kThis = this
    function complete(res) {
      console.log("启动微信支付 支付成功", res)
      if (res.errMsg === "requestPayment:ok") {
        var pages = getCurrentPages();

        var prevPage = pages[pages.length - 2]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        console.log('pages', pages, prevPage)
        prevPage.addCardSuccess("充值成功！")
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      } else if (res.errMsg === "requestPayment:fail") {
        console.log('支付失败', res)
        modalUtil.showFailToast("支付失败");
      }
    }
    var cinemaCode = app.globalData.cinemaCode
    wxRest.requestWxPay(weixinpay, complete)
  },
  subtract: function () {
    this.data.amount = this.data.amount - 100
    this.data.amount = this.data.amount > 0 ? this.data.amount : 0
    this.setData({
      amount: this.data.amount
    })
  },
  add: function () {
    this.data.amount = Number(this.data.amount) + 100
    this.setData({
      amount: this.data.amount
    })
  },
})