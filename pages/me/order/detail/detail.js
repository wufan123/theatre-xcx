const orderRest = require('../../../../rest/orderRest')
const qrcodeUtil = require('../../../../util/qrcode')
const timeUtil = require('../../../../util/timeUtil.js')

Page({
  data: {
    orderDetail: null
  },
  onLoad: function (options) {
    orderRest.getGoodsOrderDetail(options.orderNo, success => {
      this.data.orderDetail = success
      this.data.orderDetail._downTime = timeUtil.formatTimeByStamp(this.data.orderDetail.downTime, 'yyyy年MM月dd日 HH:mm:ss')
      this.setData(this.data)
      this.generateQRCode(success.qrCode)
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