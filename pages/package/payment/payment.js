const storeRest = require('../../../rest/storeRest.js')
const comboRest = require('../../../rest/comboRest.js')
var wxRest = require('../../../rest/wxRest.js')
var modalUtils = require('../../../util/modalUtil.js')
var app = getApp()

Page({
  data: {
    radioList: [
      // {
      //   name: '会员卡：余额￥20.00',
      //   icon: '../../../assets/images/ticket/member_card_icon.png',
      //   disabled: true,
      //   checked: false
      // }, 
      {
        name: '微信',
        icon: '../../../assets/images/ticket/wx_icon.png',
        disabled: false,
        checked: true
      }
    ],
    orderId: null,
    packageId: null,

    goodsDetail: {},
    payWay: {}
  },
  onLoad: function (options) {
    console.log(options)
    this.data.orderId = options.orderId;
    this.data.packageId = options.packageId;
    this.setData(this.data)

    this.fetchInitData()
  },

  fetchInitData: function () {
    //获取套票信息
    comboRest.getPackageDetail(this.data.packageId, "package", success => {
        this.data.goodsDetail = success
        this.setData(this.data)
    }, error => {

    })

    // 获取支付方式
    comboRest.getPackageBuyPayway(this.data.orderId, success => {
      this.data.payWay = success
      this.setData(this.data)
    }, error => {

    })
  },

  submit: function() {
    comboRest.packagePay(this.data.orderId, 'weixinpay', app.getOpenId(), success => {
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

    })
  }
  
})