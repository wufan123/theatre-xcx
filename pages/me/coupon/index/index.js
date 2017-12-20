const orderRest = require('../../../../rest/orderRest.js')
const dateFormatter = require('../../../../util/timeUtil')
const modalUtils = require('../../../../util/modalUtil.js')
var app = getApp()

Page({
    data: {
        inputValue: null,
        couponData: [{
            couponList: [],
            page: 1,
            status: 1,
            isFirst: true
        }, {
            couponList: [],
            page: 1,
            status: 4,
            isFirst: true
        }, {
            couponList: [],
            page: 1,
            status: 2,
            isFirst: true
        },],
        totalNum: 0,
        curTab: 0,

    },

    selectTab: function (event) {
        console.log(event)
        var index = event.currentTarget.dataset.index
        if (index != this.data.curTab) {
            this.data.curTab = index
            this.setData(this.data)
        }
    },

    bindInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

    couponDetail: function (res) {
        var couponList = this.data.couponData[this.data.curTab].couponList
        console.log(res)
        var index = res.currentTarget.id
        var coupon = JSON.stringify(couponList[index])
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
        if (couponList) {
            for (var i = 0; i < couponList.length; i++) {
                var coupon = couponList[i]
                if (tab == 0) {
                    if (coupon.voucherType == 0) {
                        coupon._couponImage = '/images/coupon-1.png';
                        coupon._helpImage = '/images/coupon-h2.png';
                        coupon._color = 'c-blue'
                    } else if (coupon.voucherType == 1) {
                        coupon._couponImage = '/images/coupon-1.png';
                        coupon._helpImage = '/images/coupon-h2.png';
                        coupon._color = 'c-green'
                    } else {
                        coupon._couponImage = '/images/coupon-1.png';
                        coupon._helpImage = '/images/coupon-h2.png';
                        coupon._color = 'c-orange'
                    }
                } else {
                    coupon._couponImage = '/images/coupon-2.png'
                    coupon._helpImage = '/images/coupon-h1.png';
                    coupon._color = 'c-gray'
                }

                coupon.startTime = dateFormatter.formatTimeByStamp(coupon.startTime, "yyyy-MM-dd")
                coupon.validData = dateFormatter.formatTimeByStamp(coupon.validData, "yyyy-MM-dd")
                if (coupon.validData && coupon.validData < dateFormatter.formatTimeByDate(new Date(), "yyyy-MM-dd")) {
                    coupon.isExpire = true
                }
                if (coupon.startTime && coupon.startTime > dateFormatter.formatTimeByDate(new Date(), "yyyy-MM-dd")) {
                    coupon.isUnEffective = true
                }
                if (coupon.useDateTime) {
                    coupon.useDateTime = dateFormatter.formatTimeByStamp(coupon.useDateTime, "yyyy-MM-dd")
                }
            }
        }
        if (pageIndex == 1) {
            this.data.couponData[tab].couponList = couponList
        } else {
            if (couponList && couponList.length > 0) {
                for (var i = 0; i < couponList.length; i++) {
                    var coupon = couponList[i]
                    this.data.couponData[tab].couponList.push(coupon)
                }

            }

        }
        this.data.couponData[tab].page = pageIndex
        this.data.couponData[tab].isFirst = false
        if (this.data.curTab == tab)
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
        console.log("onLoad")
        modalUtils.showLoadingToast()
        this.requestCouponList(1, this.data.couponData[0].status, 0)
        this.requestCouponList(1, this.data.couponData[1].status, 1)
        this.requestCouponList(1, this.data.couponData[2].status, 2)
    },

    onPullDownRefresh: function () {
        var page = 1
        var tab = this.data.curTab
        var status = this.data.couponData[tab].status
        this.requestCouponList(page, status, tab)
    },
    onReachBottom: function () {
        var tab = this.data.curTab
        var page = this.data.couponData[tab].page + 1
        var status = this.data.couponData[tab].status
        if (this.data.couponData[tab].couponList && this.data.couponData[tab].couponList.length > 0)
            this.requestCouponList(page, status, tab)
    }
})