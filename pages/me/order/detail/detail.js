const orderRest = require('../../../../rest/orderRest')
const qrcodeUtil = require('../../../../util/qrcode')
const timeUtil = require('../../../../util/timeUtil.js')

Page({
  data: {
    orderInfo: null,
    orderDetail: null,
    orderFilmDetail: null
  },
  onLoad: function (option) {
    // this.data.orderInfo = JSON.parse(option.info)
    // this.data.orderInfo._startTime = timeUtil.formatTimeByStamp(this.data.orderInfo.startTime, 'MM月dd日 HH:mm')
    // this.setData(this.data)
    // this.generateQRCode(this.data.orderInfo.verifyCode)
    // console.log(this.data)
    orderRest.getCinemaOrderInfo(option.orderId, success => {
      this.data.orderDetail = success
      this.data.orderDetail._price = parseFloat(this.data.orderDetail.film.price)
      this.data.orderDetail._startTime = timeUtil.formatTimeByStamp(this.data.orderDetail.film.startTime, 'MM月dd日 HH:mm')
      if (this.data.orderDetail.goods&&this.data.orderDetail.goods.list.length > 0) {
        this.data.orderDetail.goods.list.forEach(item => {
          this.data.orderDetail._price += parseFloat(item.price)
        })
      }
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
  },
  // 生成二维码
  generateQRCode: function (str) {
    if (str && str.length > 0) {
        var size = qrcodeUtil.qrApi.getCanvasSize(300)
        qrcodeUtil.qrApi.draw(str, "qrcode", size.w, size.h)
    }
  }
})