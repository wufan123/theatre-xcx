const qrcodeUtil = require('../../../../util/qrcode')

Page({
  data: {
    order: null
  },
  onLoad: function (options) {
    this.data.order = JSON.parse(options.info);
    this.setData(this.data)
    this.generateQRCode(this.data.order.convcode)
  },
  // 生成二维码
  generateQRCode: function (str) {
    if (str && str.length > 0) {
        var size = qrcodeUtil.qrApi.getCanvasSize(300)
        qrcodeUtil.qrApi.draw(str, "qrcode", size.w, size.h)
    }
  }
})