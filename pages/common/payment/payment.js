var storeRest = require('../../../rest/storeRest.js')
var wxRest = require('../../../rest/wxRest.js')
var modalUtils = require('../../../util/modalUtil.js')
var app = getApp()

Page({
  data: {
    radioList: [
      {
        name: '会员卡：余额￥20.00',
        icon: '../../../assets/images/ticket/member_card_icon.png',
        disabled: true,
        checked: false
      }, {
        name: '微信',
        icon: '../../../assets/images/ticket/wx_icon.png',
        disabled: false,
        checked: true
      }
    ],
    orderId: null,
    orderType: null,
    payLockInfo: {
        canUseAccount: false,
        canUseIntegral: false,
        otherPayWay: [],
    },
    comboPayWay: null,
    payCount: 0, //最后还需支付的金额
    useAccount: 0,//当前已选择使用的账户余额
    useIntegral: 0,//当前已选择使用的积分抵扣
    _showAccount: 0,
    _showIntegral: 0,
    _showIntegralOriginal: 0,
    clearTime: null
  },
  onLoad: function (options) {
    console.log(options)
    var orderId = options.orderId
    var payLockInfo = JSON.parse(options.info)
    this.data.orderId = orderId
    this.data.orderType = options.orderType
    this.setPayLockInfo(payLockInfo)
    if (this.data.payLockInfo.price == 0) {
      var payType = this.getPayType()

      this.requestGoodsAndFilmComfirmNewPay(payType)
    } else {

    }
  },
  onUnload: function () {
      clearInterval(this.data.clearTime)
  },
  /**
   * 处理数据
   */
  setPayLockInfo: function (payLockInfo) {
    this.data.clearTime = setInterval(() => {
      if (this.data.payLockInfo.payTime > 0) {
          this.data.payLockInfo.payTime--
          this.data.payLockInfo._payTime = parseInt(this.data.payLockInfo.payTime / 60) + ":" + parseInt(this.data.payLockInfo.payTime % 60)
          this.setData(this.data)
      } else {
          clearInterval(this.data.clearTime)
          this.cancelOrder()
      }
    }, 1000)

    if (payLockInfo && payLockInfo.otherPayWay) {
        payLockInfo.canUseAccount = false
        payLockInfo.canUseIntegral = false
        payLockInfo.memberMoney = parseFloat(payLockInfo.memberMoney)
        payLockInfo.price = parseFloat(payLockInfo.price)
        payLockInfo.integral = parseFloat(payLockInfo.integral)
        payLockInfo.proportion = parseFloat(payLockInfo.proportion)
        for (var i = 0; i < payLockInfo.otherPayWay.length; i++) {
            var item = payLockInfo.otherPayWay[i]
            if (item == "account")
                payLockInfo.canUseAccount = true
            else if (item == "integral")
                payLockInfo.canUseIntegral = true

        }
        var integralToMoeny = payLockInfo.integral / payLockInfo.proportion
        integralToMoeny = Math.floor(integralToMoeny * 10) / 10 //积分只能抵扣到分
        payLockInfo._integralToMoeny = integralToMoeny
    }
    this.data.payLockInfo = payLockInfo
    this.caculateCount()
  },
  getPayType: function () {
    var payType = ""
    if (!this.data.payLockInfo)
        return payType
    if (this.data.useAccount > 0)
        payType = "account"
    if (this.data.useIntegral > 0) {
        if (payType)
            payType += ","
        payType += "integral"
    }
    if (this.data.payCount == 0) {
        //如果当前无需支付任何金额，优惠券全抵扣的情况下，默认传account
        if (!payType)
            payType = "account"
    } else {
        if (payType)
            payType += ","
        payType += "weixinpay"
    }
    return payType
  },

  switchUserAccountChangeListener: function (e) {
    var checked = e.detail.value
    if (checked) {
        if (this.data.payLockInfo.memberMoney == 0) {
            modalUtils.showWarnToast('账户余额不足')

            this.setData(this.data)
            return
        }
        if (this.data.payCount == 0) {
            modalUtils.showWarnToast('当前选择支付方式已足够支付')
            this.setData(this.data)
            return
        }
        this.data.useAccount = this.data.payCount > this.data.payLockInfo.memberMoney ? this.data.payLockInfo.memberMoney : this.data.payCount
    } else {
        this.data.useAccount = 0
        if (this.data.useIntegral > 0) {
            //积分只抵扣到角
            var price = Math.floor(this.data.payLockInfo.price * 10) / 10 //积分只能抵扣到分
            this.data.useIntegral = price > this.data.payLockInfo._integralToMoeny ? this.data.payLockInfo._integralToMoeny : price
        }
    }
    this.caculateCount()
  },
  switchUserIntegralChangeListener: function (e) {
    var checked = e.detail.value
    if (checked) {
        if (this.data.payLockInfo.integral == 0) {
            modalUtils.showWarnToast('积分不足')
            this.setData(this.data)
            return
        }
        if (this.data.payCount == 0) {
            modalUtils.showWarnToast('当前选择支付方式已足够支付')
            this.setData(this.data)
            return
        }
        //积分只抵扣到角
        var payCount = Math.floor(this.data.payCount * 10) / 10 //积分只能抵扣到分
        this.data.useIntegral = payCount > this.data.payLockInfo._integralToMoeny ? this.data.payLockInfo._integralToMoeny : payCount
    } else {
        this.data.useIntegral = 0
        if (this.data.useAccount > 0) {
            this.data.useAccount = this.data.payLockInfo.price > this.data.payLockInfo.memberMoney ? this.data.payLockInfo.memberMoney : this.data.payLockInfo.price
        }
    }
    this.caculateCount()
  },

  caculateCount: function () {
    var count = 0
    if (this.data.payLockInfo) {
        count = this.data.payLockInfo.price
        count -= this.data.useAccount
        count -= this.data.useIntegral
        count = count < 0 ? 0 : count
    }
    if (this.data.useAccount > 0) {
        this.data._showAccount = parseFloat(this.data.useAccount).toFixed(2)
    } else {
        this.data._showAccount = this.data.payLockInfo.memberMoney > count ? count : this.data.payLockInfo.memberMoney
    }
    if (this.data.useIntegral > 0) {
        this.data._showIntegral = parseFloat(this.data.useIntegral).toFixed(2)
    } else {
        //积分只抵扣到角
        var canUseMax = Math.floor(count * 10) / 10 //积分只能抵扣到分
        this.data._showIntegral = this.data.payLockInfo._integralToMoeny > canUseMax ? canUseMax : this.data.payLockInfo._integralToMoeny
    }
    this.data._showAccount = parseFloat(this.data._showAccount).toFixed(2)
    this.data._showIntegral = parseFloat(this.data._showIntegral).toFixed(2)
    this.data._showIntegralOriginal = parseInt(parseFloat(this.data._showIntegral) * this.data.payLockInfo.proportion)
    this.data.payCount = parseFloat(count).toFixed(2)
    this.setData(this.data)
  },

  //启动微信支付
  requestWxPay: function (weixinpay) {
    var cinemaCode = app.globalData.cinemaCode
    wxRest.requestWxPay(weixinpay, complete => {
        if (complete.errMsg === "requestPayment:ok") {
            wx.redirectTo({
              url: '/pages/common/payResult/paySuccess/index?orderId=' + this.data.orderId + "&orderType=" + this.data.orderType
            })
          } else if (complete.errMsg === "requestPayment:fail") {
            modalUtils.showFailToast('微信支付失败')
          }
    })
  },

  //请求支付
  requestGoodsAndFilmComfirmNewPay: function (payType, integralNum) {
    var orderType = this.data.orderType
    var orderId = this.data.orderId
    var openId = app.getOpenId()
    modalUtils.showLoadingToast()
    storeRest.goodsAndFilmComfirmNewPay(orderId, orderType, payType, integralNum, openId, res => {
        modalUtils.hideLoadingToast()
        if (this.data.payCount == 0) {
          pageUtil.gotoPaySuccess(this.data.orderId, this.data.orderType)
        }
        else {//启动微信支付
          this.requestWxPay(res.weixinpay)
        }
    })
  },

  //取消订单
  cancelOrder: function () {
    if (this.data.orderType != 'goods') {
        modalUtils.showFailToast("当前订单超时关闭")
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }, 1500);

    }
  },

  submit: function () {
    var payType = this.getPayType()
    var integral = this.data.useIntegral * this.data.payLockInfo.proportion
    this.requestGoodsAndFilmComfirmNewPay(payType, integral)
  },
})