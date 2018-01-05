const orderRest = require('../../../../rest/orderRest')
const theatreRest = require('../../../../rest/theatreRest')
const timeUtil = require('../../../../util/timeUtil.js')
const jsQrcodeUtil = require('../../../../util/qrcode/wxqrcode')
var app = getApp()

Page({
  data: {
    orderDetail: null,
    orderPayInfo: null,
    qrcodeImg: '',
    ruleConfig: ''
  },
  onLoad: function (options) {
    orderRest.getGoodsOrderDetail(options.orderNo, success => {
      this.data.orderDetail = success
      this.data.orderDetail._downTime = timeUtil.formatTimeByStamp(this.data.orderDetail.downTime, 'yyyy-MM-dd HH:mm:ss')
      this.setData(this.data)
      this.generateQRCode(success.qrCode)
      // 支付信息
      orderRest.getOrderPayInfo(success.orderId, 'goods', success => {
        this.data.orderPayInfo = success
        this.setData(this.data)
      }, error => {

      })
    }, error => {

    })

    // 规则说明
    theatreRest.getMiscConfig('goods_order_info', success => {
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
  makeCall:function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone
    })
  }
})