const orderRest = require('../../../../rest/orderRest')
const theatreRest = require('../../../../rest/theatreRest')
const timeUtil = require('../../../../util/timeUtil.js')
const jsQrcodeUtil = require('../../../../util/qrcode/wxqrcode')
var app = getApp()

Page({
  data: {
    orderInfo: null,
    orderDetail: null,
    orderFilmDetail: null,
    orderPayInfo: null,
    qrcodeImg: '',
    ruleConfig: ''
  },
  onLoad: function (option) {
    orderRest.getCinemaOrderInfo(option.orderId, success => {
      this.data.orderDetail = success
      this.data.orderDetail._startTime = timeUtil.formatTimeByStamp(this.data.orderDetail.film.startTime, 'MM月dd日 HH:mm')
      this.setData(this.data)
    }, error => {

    })

    orderRest.getCinemaOrderFilmDetail(option.orderId, success => {
      this.data.orderFilmDetail = success
      this.data.orderFilmDetail._orderTime = timeUtil.formatTimeByStamp(success.orderTime, 'yyyy-MM-dd HH:mm:ss')
      this.setData(this.data)
      this.generateQRCode(success.qrCode)
    }, error => {

    })

    // 支付信息
    orderRest.getOrderPayInfo(option.orderId, 'goodsAndFilm', success => {
      this.data.orderPayInfo = success
      this.setData(this.data)
    }, error => {

    })

    // 规则说明
    theatreRest.getMiscConfig('show_order_info', success => {
      if (success && success.length > 0) {
        this.data.ruleConfig = success[0].miscVal
        this.setData(this.data)
      }
    })
  },
  // 生成二维码
  generateQRCode: function (str) {
    if (str && str.length > 0) {
      this.data.qrcodeImg = jsQrcodeUtil.createQrCodeImg(str, {'size':300})
      this.setData(this.data)
    }
  },
  makeCall: function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone
    })
  }
})