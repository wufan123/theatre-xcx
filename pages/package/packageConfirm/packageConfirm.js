const orderRest = require('../../../rest/orderRest.js')
const storeRest = require('../../../rest/storeRest.js')
const comboRest = require('../../../rest/comboRest.js')
const modalUtil = require('../../../util/modalUtil.js')
const timeUtil = require('../../../util/timeUtil.js')
var app = getApp()
Page({
    data: {
        orderDetail: {
            orderId: "",
            orderType: "package"
        },
        orderPayWay: "",
        orderInfo: {},
        amount: 0, //最后总价
        selectGoodsCouponList: [],
        selectFilmCouponList: [],
        useCardId: null,
        goodsCouponText: '',
        filmCouponText: '',
        isUseCard: false,
        oldPhone: null,
        clearTime: null
    },
    fetchInitData: function () {
        // 卖品详情
        comboRest.getPackageDetail(this.data.orderInfo.goods.packageId, "package", success => {
            this.data.orderInfo.goods = success
            this.data.orderInfo.phone = app.getUserInfo().bindmobile
            this.data.oldPhone = this.data.orderInfo.phone
            this.setData(this.data)
            this.caculateCount()
        }, error => {

        })
        //获取优惠券信息
        orderRest.getOrderPayWay(app.globalData.cinemaCode, this.data.orderDetail.orderId, this.data.orderDetail.orderType, res => {
            this.data.orderPayWay = res
            //this.data.orderPayWay.payTime = 10
            if (this.data.orderPayWay.payTime) {
                this.data.clearTime = setInterval(() => {
                    if (this.data.orderPayWay.payTime > 0) {
                        this.data.orderPayWay.payTime--
                        this.data.orderPayWay._payTime = parseInt(this.data.orderPayWay.payTime / 60) + ":" + parseInt(this.data.orderPayWay.payTime % 60)
                        this.setData({
                            orderPayWay: this.data.orderPayWay
                        })
                    } else {
                        //取消订单
                        clearInterval(this.data.clearTime)
                        modalUtil.showFailToast("当前订单超时关闭")
                        setTimeout(() => {
                            wx.reLaunch({
                                url: '/pages/index/index',
                            })
                        }, 1500);

                    }
                }, 1000)
            }
            this.data.orderPayWay._orderPrice = res.orderPrice.toFixed(2)
            //优惠券判断
            if (res.couponList && res.couponList.length > 0) {
                var hasSelectedCouponList = []
                res.couponList.forEach(function (element) {
                    if (element.checked) {
                        hasSelectedCouponList.push(element)
                    }
                }, this);
                if (hasSelectedCouponList.length > 0) {
                    this.setSelectCouponList(hasSelectedCouponList)
                }
            }
            //卖品优惠券判断
            if (res.saleCouponList && res.saleCouponList.length > 0) {
                var hasSaleCouponList = []
                res.saleCouponList.forEach(function (element) {
                    if (element.checked) {
                        hasSaleCouponList.push(element)
                    }
                }, this)
                if (hasSaleCouponList.length > 0) {
                    this.setSelectCouponList(hasSaleCouponList,'goods')
                }
            }
            this.setData({
                orderPayWay: this.data.orderPayWay
            })
        }, res => modalUtil.showFailToast(res.text))
    },
    caculateCount: function () { //计算总价
        //如果有使用会员卡
        // if (this.data.isUseCard && this.data.useCard) {
        //     this.data.orderInfo.film._price = parseFloat(this.data.useCard.settlementPrice) * parseInt(this.data.orderInfo.film.seatCount)
        // }
        this.data.orderInfo._price = this.data.orderInfo.goods.price
        this.data.amount = this.data.orderInfo._price
        this.setData(this.data)
    },
    setSelectCouponList: function (selectCouponList, couponType) {
        if (couponType == 'goods')
            this.data.selectGoodsCouponList = selectCouponList
        else
            this.data.selectFilmCouponList = selectCouponList
        this.caculateCount()
    },
    selectGoodsCoupon: function () {
        let orderId = this.data.orderDetail.orderId
        pageUtil.selectCoupon(orderId, this.data.selectGoodsCouponList, this.data.orderDetail.orderType, 'goods')
    },
    selectFilmCoupon: function () {
        let orderId = this.data.orderDetail.orderId
        pageUtil.selectCoupon(orderId, this.data.selectFilmCouponList, this.data.orderDetail.orderType, 'film', this.data.orderInfo.film.seatCount)
    },
    getSelectCouponStr: function () {
        var couponStr = ""
        this.data.selectFilmCouponList.forEach(e => {
            couponStr += e.voucherNum + ','
        })
        this.data.selectGoodsCouponList.forEach(e => {
            couponStr += e.voucherNum + ','
        })
        if (couponStr != "") {
            couponStr = couponStr.substr(0, couponStr.length - 1)
        }
        return couponStr
    },
    setOrderPhone: function (event) {
        this.data.oldPhone = this.data.orderInfo.phone
        this.data.orderInfo.phone = event.detail.value
    },

    requestOrderPayLock: function () {
        var kThis = this

        if (this.data.orderInfo.phone === '') {
            modalUtil.showWarnToast("手机号不能为空");
            return
        } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.orderInfo.phone))) {
            modalUtil.showWarnToast("请输入正确的手机号");
            return
        }
        if (this.data.oldPhone !== this.data.orderInfo.phone) {
            orderRest.updateOrderMobile(this.data.orderInfo.phone)
        }

        function requestSuccess(res) {
            modalUtil.hideLoadingToast()
            //启动新页面支付
            kThis.gotoOrderPay(res)
        }
        var couponStr = this.getSelectCouponStr()
        var cinemaCode = app.globalData.cinemaCode
        var orderType = this.data.orderDetail.orderType
        var orderId = this.data.orderDetail.orderId
        var cardId
        if (this.data.isUseCard) {
            let card = this.data.useCard
            cardId = card ? this.data.useCard.id : null
        }
        modalUtil.showLoadingToast()
        storeRest.getOrderPayLock(cinemaCode, orderId, orderType, cardId, couponStr, requestSuccess)
    },

    radioChange: function (e) {
        if (!this.data.useCard)
            this.data.useCard = e.target.dataset.card
        else {
            if (this.data.useCard.cardId == e.target.dataset.card.cardId) {
                this.data.useCard = null
            } else {
                this.data.useCard = e.target.dataset.card
            }
        }
        this.caculateCount()
    },

    //请求支付
    requestGoodsAndFilmComfirmNewPay: function (orderId, orderType) {
        var openId = app.getOpenId()
        var payType = "account"
        var integralNum
        modalUtil.showLoadingToast()
        storeRest.goodsAndFilmComfirmNewPay(orderId, orderType, payType, integralNum, openId, res => {
            modalUtil.hideLoadingToast()
            pageUtil.gotoPaySuccess(orderId, orderType)
        })
    },
    /**
     * 去支付
     */
    gotoOrderPay: function (payLockInfo) {
        var orderId = this.data.orderDetail.orderId
        var orderType = this.data.orderDetail.orderType
        if (payLockInfo && payLockInfo.price == 0) {
            this.requestGoodsAndFilmComfirmNewPay(orderId, orderType)
        } else {
            var info = JSON.stringify(payLockInfo)
            wx.navigateTo({
                url: '/pages/ticket/payment/payment?orderId=' + orderId + "&orderType=" + orderType + "&info=" + info
            })
        }

    },
    onLoad: function (option) {
        this.data.orderDetail.orderId = option.orderId
        this.data.orderInfo.goods = {
            packageId: option.packageId
        }
        this.data.orderInfo.number = option.number
        this.setData(this.data)
        this.fetchInitData()
    },

    onPullDownRefresh: function () {
        this.requestGoodsList()
    },

    switchMember: function (e) {
        this.data.isUseCard = e.detail.value
        this.setData(this.data)
    },

    addCard: function (e) {
        wx.navigateTo({
            url: '/pages/card/addCard/addCard'
        })
    },

    addCardSuccess: function () {
        this.fetchInitData()
    },
    clearPhone: function () {
        this.data.orderInfo.phone = ''
        this.setData(this.data)
    },
    onUnload: function () {
        console.log("clearInterval")
        clearInterval(this.data.clearTime)
    }
})