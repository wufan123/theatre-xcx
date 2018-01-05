const orderRest = require('../../../rest/orderRest.js')
const storeRest = require('../../../rest/storeRest.js')
const modalUtil = require('../../../util/modalUtil.js')
const timeUtil = require('../../../util/timeUtil.js')
var app = getApp()
Page({
    data: {
        orderDetail: {
            orderId: "",
            orderType: "goodsAndFilm"
        },
        orderPayWay: "",
        orderInfo: "",
        amount: 0, //最后总价
        selectGoodsCoupon: null,
        selectFilmCoupon: null,
        useCard: null,
        isUseCard: false,
        oldPhone: null,
        clearTime: null,
        destoryCancelOrder: true,

        goodsCouponList: [],
        filmCouponList: [],
        memberCardList: [],
        couponListStr: [],
        selectType: null, // 选择类型
    },
    fetchInitData: function () {
        //获取优惠券信息
        this.data.goodsCouponList = []
        this.data.filmCouponList = []
        this.data.memberCardList = []
        this.data.couponListStr = []
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
            //影票优惠券判断
            if (res.couponList && res.couponList.length > 0) {
                res.couponList.forEach(element => {
                    this.data.filmCouponList.push(element)
                });
            }
            //卖品优惠券判断
            if (res.saleCouponList && res.saleCouponList.length > 0) {
                res.saleCouponList.forEach(element => {
                    this.data.goodsCouponList.push(element)
                })
            }
            // 会员卡
            if (res.memberCard && res.memberCard.length > 0) {
                res.memberCard.forEach(element => {
                    this.data.memberCardList.push(element)
                })
            }
            this.setData(this.data)
        }, res => modalUtil.showFailToast(res.text))
        //获取订单信息
        orderRest.getCinemaOrderInfo(this.data.orderDetail.orderId, res => {
            this.data.orderInfo = res
            this.data.orderInfo.film._startTime = timeUtil.formatDate(res.film.startTime, 5) + "  " + timeUtil.formatDate(res.film.startTime, 6)
            //服务费&价格
            let seatArr = {}
            let _serviceFee = 0
            this.data.orderInfo.film._priceStr = ''
            this.data.orderInfo.film.seatInfo.forEach(e => {
                let seatPieceName = e.seatPieceName
                let seatPieceNo = e.seatPieceNo
                _serviceFee += parseFloat(e.serviceCharge)

                if (seatArr[seatPieceNo]) {
                    seatArr[seatPieceNo]["count"] += 1
                } else {
                    seatArr[seatPieceNo] = {};
                    seatArr[seatPieceNo]["count"] = 1
                    seatArr[seatPieceNo]["price"] = parseFloat(e.oldPrice).toFixed(2)
                    seatArr[seatPieceNo]["name"] = seatPieceName
                }
            })
            for (let key in seatArr) {
                if (this.data.orderInfo.film._priceStr)
                    this.data.orderInfo.film._priceStr += "+"
                this.data.orderInfo.film._priceStr += seatArr[key].name + seatArr[key].price + "*" + seatArr[key].count
            }
            // $.each(seatArr, function(i, v) { _str += i + v.price + "*" + v.count });
            this.data.orderInfo.film._priceStr += "(含服务费¥" + _serviceFee.toFixed(2) + ")"
            this.data.orderInfo.phone = app.getUserInfo(false).bindmobile
            this.data.oldPhone = this.data.orderInfo.phone
            this.setData(this.data)
            this.caculateCount()
        }, res => modalUtil.showFailToast(res.text));
    },
    caculateCount: function () { //计算总价
        //初始化显示订单价格
        this.data.orderInfo.film._price = parseFloat(this.data.orderInfo.film.price)
        //如果有使用会员卡
        if (this.data.useCard) {
            this.data.orderInfo.film._price = parseFloat(this.data.useCard.settlementPrice) * parseInt(this.data.orderInfo.film.seatCount)
        }
        this.data.orderInfo._price = this.data.orderInfo.film._price + (this.data.orderInfo.goods ? parseFloat(this.data.orderInfo.goods.price) : 0)
        let couponPrice = 0;
        let goodsPrice = parseFloat(this.data.orderInfo.goods ? this.data.orderInfo.goods.price : 0)
        let filmPrice = parseFloat(this.data.orderInfo.film._price)

        this.data.couponListStr = []
        if (this.data.goodsCouponList.length > 0) {
            let goodsCouponPrice = 0
            this.data.goodsCouponList.forEach(item => {
                if (item.checked) {
                    let amount = parseFloat(item.ticketValue)
                    let couponRet = (goodsCouponPrice+amount) < goodsPrice ? amount : (goodsPrice-goodsCouponPrice)
                    goodsCouponPrice += couponRet
                    this.data.couponListStr.push({
                        name: '卖品优惠',
                        value: '-￥'+couponRet
                    })
                }
            })
            couponPrice += goodsCouponPrice;
        }

        if (this.data.filmCouponList.length > 0) {
            let voucherType;
            let filmCouponPrice = 0;
            this.data.filmCouponList.forEach(item => {
                if (item.checked) {
                    voucherType = item.voucherType
                    if (voucherType != 0) {
                        let amount = parseFloat(item.ticketValue)
                        let couponRet = (filmCouponPrice+amount) < filmPrice ? amount : (filmPrice-filmCouponPrice)
                        filmCouponPrice += couponRet
                        this.data.couponListStr.push({
                            name: '影票优惠',
                            value: '-￥'+couponRet
                        })
                    } else {
                        filmCouponPrice++;
                    }
                }
            })
            if (voucherType == 0) {
                filmPrice = 0
                this.data.couponListStr.push({
                    name: '已兑换',
                    value: filmCouponPrice+'张票'
                })
            } else {
                couponPrice += filmCouponPrice;
            }
        }

        this.data.amount = (goodsPrice + filmPrice - couponPrice).toFixed(2)
        this.data.orderInfo.film._price = parseFloat(this.data.orderInfo.film._price).toFixed(2)
        this.data.orderInfo._price = parseFloat(this.data.orderInfo._price).toFixed(2)
        this.setData(this.data)
    },
    setCouponList: function(couponList) {
        if (this.data.selectType == 'goods') {
            this.data.goodsCouponList = couponList
        } else {
            this.data.filmCouponList = couponList
        }
        this.setData(this.data)
        this.caculateCount()
    },
    // 选择卖品优惠券点击
    selectGoodsCoupon: function () {
        this.data.selectType = 'goods'
        this.setData(this.data)
        app.setPageData(this.data.goodsCouponList)
        wx.navigateTo({
            url: '/pages/common/selectCoupon/index?pageData=1'
        })
    },
    // 选择影票优惠券点击
    selectFilmCoupon: function () {
        this.data.selectType = 'film'
        this.setData(this.data)
        app.setPageData(this.data.filmCouponList)
        wx.navigateTo({
            url: '/pages/common/selectCoupon/index?pageData=1&seatCount=' + this.data.orderInfo.film.seatCount
        })
    },
    getSelectCouponStr: function () {
        var couponStr = ""
        this.data.goodsCouponList.forEach(item => {
            if (item.checked) {
                couponStr += item.voucherNum + ','
            }
        })
        this.data.filmCouponList.forEach(item => {
            if (item.checked) {
                couponStr += item.voucherNum + ','
            }
        })
        if (couponStr != "") {
            couponStr = couponStr.substr(0, couponStr.length - 1)
        }
        return couponStr
    },
    // 设置使用的会员卡
    setUseCard: function(useCard) {
        this.data.useCard = useCard;
        this.setData(this.data)
    },
    // 选择会员卡点击
    selectUseCard: function() {
        app.setPageData(this.data.memberCardList)
        wx.navigateTo({
            url: '/pages/common/selectCard/index?pageData=1'
        })
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
        let cardId = null
        if (this.data.useCard) {
            cardId = this.data.useCard.id
        }
        modalUtil.showLoadingToast()
        storeRest.getOrderPayLock(cinemaCode, orderId, orderType, cardId, couponStr, requestSuccess)
    },

    //请求支付
    requestGoodsAndFilmComfirmNewPay: function (orderId, orderType) {
        var openId = app.getOpenId()
        var payType = "account"
        var integralNum
        modalUtil.showLoadingToast()
        storeRest.goodsAndFilmComfirmNewPay(orderId, orderType, payType, integralNum, openId, res => {
            modalUtil.hideLoadingToast()
            wx.redirectTo({
                url: '/pages/common/payResult/paySuccess/index?orderId=' + orderId + "&orderType=" + orderType
            })
        })
    },
    /**
     * 去支付
     */
    gotoOrderPay: function (payLockInfo) {
        this.data.destoryCancelOrder = false
        this.setData(this.data)
        var orderId = this.data.orderDetail.orderId
        var orderType = this.data.orderDetail.orderType
        if (payLockInfo && payLockInfo.price == 0) {
            this.requestGoodsAndFilmComfirmNewPay(orderId, orderType)
        } else {
            app.setPageData(payLockInfo)
            wx.redirectTo({
                url: '/pages/common/payment/payment?orderId=' + orderId + "&orderType=" + orderType + "&pageData=1"
            })
        }

    },
    onLoad: function (option) {
        this.data.orderDetail.orderId = option.orderId
        this.fetchInitData()
    },
    clearPhone: function () {
        this.data.orderInfo.phone = ''
        this.setData(this.data)
    },
    onUnload: function () {
        clearInterval(this.data.clearTime)
        // 如果不是跳转到支付界面，取消订单
        if (this.data.destoryCancelOrder) {
            orderRest.cancelOrder(this.data.orderDetail.orderId, res => {
                console.log(res)
            });
        }
    }
})