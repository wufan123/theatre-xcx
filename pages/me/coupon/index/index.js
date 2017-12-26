const orderRest = require('../../../../rest/orderRest.js')
const dateFormatter = require('../../../../util/timeUtil')
const modalUtils = require('../../../../util/modalUtil.js')
var app = getApp()

Page({
    data: {
        inputValue: null,
        dataList:[],
        totalNum: 0,
        curTab: 0,

    },

    bindInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

    couponDetail: function (res) {
      var coupon = JSON.stringify(this.data.dataList[0])
        wx.navigateTo({
          url: '/pages/me/coupon/detail/detail?info=' + coupon,
          success: function (res) {
            // success
            console.log("success")
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
            console.log("complete")
          }
        })
    },

    scanCouponCode: function () {
        console.log("startScan")
        var kThis = this
        function success(res) {
            console.log(res)
            var couponCode = res.result
            kThis.requestAddVoucher(couponCode)

        }
        function fail(res) {
            console.log(res)
        }
        wx.scanCode({
            onlyFromCamera: true,
            success: success,
            fail: fail
        })
    },

    addVoucherClickListener: function () {
        this.requestAddVoucher(this.data.inputValue)
    },

    formatCouponList: function (couponList, tab, pageIndex) {
      console.log('dataList', couponList)
        if (pageIndex == 1) {
            this.data.dataList = couponList
        }
        this.setData(this.data)
    },

    requestAddVoucher: function (voucherNum) {

        modalUtils.showLoadingToast()
        orderRest.addVoucher(voucherNum, res => {
            console.log(res)
            // modalUtils.hideLoadingToast()
            modalUtils.showSuccessToast("添加成功")
            this.requestCouponList(1, this.data.couponData[0].status, 0)
        })
    },

    requestCouponList: function (page, status, tab) {
        var kThis = this
        function requestSuccess(res) {
            modalUtils.hideLoadingToast()
            wx.stopPullDownRefresh() //停止下拉刷新
            if (tab == 0) {
                kThis.data.totalNum = res.totalNum
            }
            kThis.formatCouponList(res.voucherList, tab, page)
        }

        orderRest.userVoucherList(page, status, requestSuccess, res => {
            modalUtils.showResError(res)
            this.data.couponData[tab].isFirst = false
            this.setData({
                couponData: this.data.couponData
            })
        })
    },

    onLoad: function (options) {
        this.requestCouponList(1, 1, 0)
    },
})