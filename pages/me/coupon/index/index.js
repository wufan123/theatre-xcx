const orderRest = require('../../../../rest/orderRest.js')
const dateFormatter = require('../../../../util/timeUtil')
const modalUtils = require('../../../../util/modalUtil.js')
var app = getApp()

Page({
    data: {
        inputValue: null,
        dataList: [],
        canUseList: {
            list: []
        },
        invalidList: {
            list: []
        },
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
            console.log('not found coupon.')
            return;
        }
        wx.navigateTo({
          url: '/pages/me/coupon/detail/detail?info=' + JSON.stringify(coupon)
        })
    },

    scanCouponCode: function () {
        var kThis = this
        function success(res) {
            var couponCode = res.result
            kThis.requestAddVoucher(couponCode)

        }
        function fail(res) {

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

    requestAddVoucher: function (voucherNum) {
        modalUtils.showLoadingToast()
        orderRest.addVoucher(voucherNum, res => {
            modalUtils.showSuccessToast("添加成功")
            this.requestCouponList()
        })
    },

    requestCouponList: function () {
        orderRest.userVoucherList(success => {
            this.data.dataList = success.voucherList
            this.data.canUseList.list = []
            this.data.invalidList.list = []
            success.voucherList.forEach(item => {
                item.startTime = dateFormatter.formatDate(item.startTime, 4)
                item.validData = dateFormatter.formatDate(item.validData, 4)
                if (item.status == 2) {
                    this.data.canUseList.list.push(item)
                } else {
                    this.data.invalidList.list.push(item)
                }
            });
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