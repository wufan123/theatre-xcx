const qrcodeUtil = require('../../../../util/qrcode')
const timeUtil = require('../../../../util/timeUtil.js')
var app = getApp()

Page({
  data: {
    order: null
  },
  onLoad: function (options) {
    this.data.order = JSON.parse(options.info);
    this.data.order._downTime = timeUtil.formatTimeByStamp(this.data.order.downTime, 'yyyy-MM-dd HH:mm:ss')
    this.setData(this.data)
    this.generateQRCode(this.data.order.convcode)
  },
  // 生成二维码
  generateQRCode: function (str) {
    if (str && str.length > 0) {
        var size = qrcodeUtil.qrApi.getCanvasSize(300)
        qrcodeUtil.qrApi.draw(str, "qrcode", size.w, size.h)
    }
  },
  makeCall:function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone
    })
  }
})