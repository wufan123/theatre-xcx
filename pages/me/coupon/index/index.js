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
        page: 1
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
        app.setPageData(coupon)
        wx.navigateTo({
          url: '/pages/me/coupon/detail/detail?pageData=1'
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
            setTimeout(() => {
                this.reloadCouponList()
            }, 1000)
        })
    },

    reloadCouponList: function() {
        this.data.canUseList.list = []
        this.data.invalidList.list = []
        this.data.dataList = []
        this.data.page = 1
        this.requestCouponList(this.data.page)
    },

    requestCouponList: function (page) {
        modalUtils.showLoadingToast()
        orderRest.userVoucherList(page, success => {
            modalUtils.hideLoadingToast()
            success.voucherList.forEach(item => {
                if (item.bindStatus==1) {
                    this.data.dataList.push(item)
                    item.startTimeStr = dateFormatter.formatDate(item.startTime, 4)
                    item.validDataStr = dateFormatter.formatDate(item.validData, 4)
                    if (item.status == 2 && (new Date().getTime()/1000 < item.validData)) {
                        this.data.canUseList.list.push(item)
                    } else {
                        item.stock = true
                        this.data.invalidList.list.push(item)
                    }
                }
            });
            if (success.voucherList.length > 0) {
                this.data.page += 1
                this.requestCouponList(this.data.page)
            // } else {
                if (!this.data.isSeeExpire&&this.data.canUseList.list.length==0) {
                    this.data.isSeeExpire = true
                }
                this.setData(this.data)
            }
        }, res => {
            modalUtils.hideLoadingToast()
            modalUtils.showResError(res)
            this.data.couponData[tab].isFirst = false
            this.setData({
                couponData: this.data.couponData
            })
        })
    },

    onLoad: function (options) {
        this.reloadCouponList()
    }
})