const orderRest = require('../../../rest/orderRest.js')
const storeRest = require('../../../rest/storeRest.js')
const comboRest = require('../../../rest/comboRest.js')
const modalUtil = require('../../../util/modalUtil.js')
const timeUtil = require('../../../util/timeUtil.js')
const wxRest = require('../../../rest/wxRest.js')
var app = getApp()
Page({
    data: {
        goodsDetail: {},
        amount: 0, //最后总价
        oldPhone: null,
        clearTime: null
    },
    fetchInitData: function () {
        //获取套票信息
        comboRest.getPackageDetail(this.data.goodsDetail.packageId, "package", success => {
            this.data.goodsDetail = success
            this.setData(this.data)
        }, error => {

        })
    },

    requestOrderPayLock: function () {
        var kThis = this

        if (this.data.phone === '') {
            modalUtil.showWarnToast("手机号不能为空");
            return
        } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.phone))) {
            modalUtil.showWarnToast("请输入正确的手机号");
            return
        }
        if (this.data.oldPhone !== this.data.phone) {
            orderRest.updateOrderMobile(this.data.phone)
        }

        modalUtil.showLoadingToast()
        let packageStr = this.data.goodsDetail.packageId + ":1"
        comboRest.createOrder(packageStr, this.data.phone, app.globalData.cinemaCode, success => {
            comboRest.packagePay(success.packageId, 'weixinpay', app.getOpenId(), success => {
                modalUtil.hideLoadingToast()
                wxRest.requestWxPay(success.weixinpay, complete => {
                  if (complete.errMsg === "requestPayment:ok") {
                    wx.redirectTo({
                      url: '/pages/ticket/payResult/paySuccess/index?orderId=' + this.data.orderId + "&orderType=" + this.data.orderType
                    })
                  } else if (complete.errMsg === "requestPayment:fail") {
                    wx.redirectTo({
                      url: '/pages/ticket/payResult/payFail/index'
                    })
                  }
                })
              }, error => {
                modalUtil.hideLoadingToast()
                modalUtil.showWarnToast(error.text);
              })
        }, error => {
            modalUtil.hideLoadingToast()
            modalUtil.showWarnToast(error.text);
        })
    },

    setOrderPhone: function (event) {
        this.data.oldPhone = this.data.phone
        this.data.phone = event.detail.value
    },
    onLoad: function (option) {
        this.data.goodsDetail.packageId = option.packageId
        this.data.phone = app.getUserInfo().bindmobile
        this.data.oldPhone = this.data.phone
        this.fetchInitData()
    },
    onUnload: function () {
        console.log("clearInterval")
        clearInterval(this.data.clearTime)
    }
})