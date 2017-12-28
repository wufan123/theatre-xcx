const orderRest = require('../../../../rest/orderRest')
const qrcodeUtil = require('../../../../util/qrcode')
const timeUtil = require('../../../../util/timeUtil.js')

Page({
  data: {
    orderInfo: null,
    orderDetail: null
  },
  onLoad: function (option) {
    this.data.orderInfo = JSON.parse(option.info)
    this.data.orderInfo._startTime = timeUtil.formatTimeByStamp(this.data.orderInfo.startTime, 'MM月dd日 HH:mm')
    this.setData(this.data)
    this.generateQRCode(this.data.orderInfo.verifyCode)
    console.log(this.data)
    orderRest.getCinemaOrderInfo(this.data.orderInfo.orderCode, success => {
      this.data.orderDetail = success
      this.data.orderDetail._price = parseFloat(this.data.orderDetail.film.price)
      if (this.data.orderDetail.goods&&this.data.orderDetail.goods.list.length > 0) {
        this.data.orderDetail.goods.list.forEach(item => {
          this.data.orderDetail._price += parseFloat(item.price)
        })
      }
      this.setData(this.data)
    }, error => {

    })
  },
  // 生成二维码
  generateQRCode: function (str) {
    if (str && str.length > 0) {
        var size = qrcodeUtil.qrApi.getCanvasSize(200)
        qrcodeUtil.qrApi.draw(str, "qrcode", size.w, size.h)
    }
  }
})