const orderRest = require('../../../../rest/orderRest.js')
const dateFormatter = require('../../../../util/timeUtil')
const modalUtils = require('../../../../util/modalUtil.js')
var app = getApp()

Page({
    data: {
        couponList: {
          list: []
        },
        inputValue: null,
        dataList: [],
        canUseList: [],
        invalidList: [],
        totalNum: 0,
        curTab: 0,
        isSeeExpire:false,
    },

    bindInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

    seeExpireCoupon:function(){
      this.setData({
        isSeeExpire: !this.data.isSeeExpire
      })
    },

    couponDetail: function (res) {
        var coupon;
        this.data.dataList.forEach(item => {
            if (item.memberVoucherId == res.currentTarget.id) {
                coupon = item;
            }
        })
        if (!coupon) {
            return;
        }
        wx.navigateTo({
          url: '/pages/me/coupon/detail/detail?info=' + JSON.stringify(coupon)
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

<<<<<<< HEAD
=======
    formatCouponList: function (couponList, tab, pageIndex) {
      console.log('dataList', couponList)
        if (pageIndex == 1) {
          this.data.couponList.list = couponList
        }
        this.setData(this.data)
    },

>>>>>>> 52e54340370c2661dda5d4b7e6cd18aef1845874
    requestAddVoucher: function (voucherNum) {
        modalUtils.showLoadingToast()
        orderRest.addVoucher(voucherNum, res => {
            console.log(res)
            // modalUtils.hideLoadingToast()
            modalUtils.showSuccessToast("添加成功")
            this.requestCouponList()
        })
    },

    requestCouponList: function () {
        orderRest.userVoucherList(success => {
            this.data.dataList = success.voucherList
            this.data.canUseList = []
            this.data.invalidList = []
            success.voucherList.forEach(item => {
                if (item.status == 2) {
                    this.data.canUseList.push(item)
                } else {
                    this.data.invalidList.push(item)
                }
            });
            console.log(this.data.canUseList)
            console.log(this.data.invalidList)
            this.setData(this.data)
        }, res => {
            modalUtils.showResError(res)
            this.data.couponData[tab].isFirst = false
            this.setData({
                couponData: this.data.couponData
            })
        })
    },

    onLoad: function (options) {
        this.requestCouponList() // 票券
    },
})