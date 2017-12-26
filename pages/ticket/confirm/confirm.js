const orderRest = require('../../../rest/orderRest.js')
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
                            pageUtil.goToHomePage()
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
            this.data.orderInfo.phone = app.getUserInfo().bindmobile
            console.log(this.data)
            this.setData(this.data)
            this.caculateCount()
        }, res => modalUtil.showFailToast(res.text));
    },
    caculateCount: function () { //计算总价
        //初始化显示订单价格
        this.data.orderInfo.film._price = parseFloat(this.data.orderInfo.film.price)
        //如果有使用会员卡
        if (this.data.isUseCard && this.data.useCard) {
            this.data.orderInfo.film._price = parseFloat(this.data.useCard.settlementPrice) * parseInt(this.data.orderInfo.film.seatCount)
        }
        this.data.orderInfo._price = this.data.orderInfo.film._price + (parseFloat(this.data.orderInfo.goods ? this.data.orderInfo.goods.price : 0))
        let couponPrice = 0;
        let goodsPrice = parseFloat(this.data.orderInfo.goods ? this.data.orderInfo.goods.price : 0)
        let filmPrice = parseFloat(this.data.orderInfo.film._price)
        let goodsCouponText = ''
        let filmCouponText = ''
        if (this.data.selectGoodsCouponList.length > 0) {
            let amount = parseFloat(this.data.selectGoodsCouponList[0].ticketValue)
            couponPrice += amount < goodsPrice ? amount : goodsPrice
            goodsCouponText = '卖品优惠-¥' + couponPrice
        }

        if (this.data.selectFilmCouponList.length > 0) {
            let _filmcoupon = this.data.selectFilmCouponList[0]
            if (_filmcoupon.voucherType == 0) {
                filmPrice = 0
                this.data.selectFilmCouponList.forEach(function (element) {
                    filmPrice += parseFloat(element.ticketValue)
                }, this);
                filmPrice = parseFloat(filmPrice)
                filmCouponText = '已兑换' + this.data.selectFilmCouponList.length + '张票'
            } else {
                let amount = parseFloat(_filmcoupon.ticketValue)
                couponPrice += amount < filmPrice ? amount : filmPrice
                filmCouponText = '影票优惠-¥' + parseFloat(_filmcoupon.ticketValue) * this.data.selectFilmCouponList.length
            }
        }
        this.data.goodsCouponText = goodsCouponText
        this.data.filmCouponText = filmCouponText
        this.data.amount = (goodsPrice + filmPrice - couponPrice).toFixed(2)
        this.data.orderInfo.film._price = parseFloat(this.data.orderInfo.film._price).toFixed(2)
        this.data.orderInfo._price = parseFloat(this.data.orderInfo._price).toFixed(2)
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
            pageUtil.gotoOrderPay(orderId, orderType, payLockInfo)
        }

    },
    onLoad: function (option) {
        this.data.orderDetail.orderId = '700836722' //option.orderId
      //  this.setData(this.data)
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
            url: '/pages/card/addCard/addCard',
            success: function (res) {
                // success
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
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