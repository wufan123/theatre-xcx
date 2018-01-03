const filmRest = require('../../../rest/filmRest.js')
const planRest = require('../../../rest/planRest.js')
const comboRest = require('../../../rest/comboRest.js')
const storeRest = require('../../../rest/storeRest.js')
const modalUtil = require('../../../util/modalUtil.js')
var app = getApp();
Page({
  data: {
    goodsDetail: {
      detail: null
    },
    bottomTxt: '马上购买'
  },
  onLoad: function (e) {
    comboRest.getPackageDetail(e.packageId, "package", success => {
      this.data.goodsDetail.detail = success
      this.setData(this.data)
    }, error => {

    })
  },
  confirm: function (e) {
    let bindmobile = app.getUserInfo(true).bindmobile;
    if (bindmobile) {
      return;
    }
    modalUtil.showLoadingToast()
    let packageStr = this.data.goodsDetail.detail.packageId + ":1"
    comboRest.createOrder(packageStr, bindmobile, app.globalData.cinemaCode, success => {
      modalUtil.hideLoadingToast()
      wx.navigateTo({
        url: '../confirm/confirm?orderId='+success.packageId+'&number=1&packageId='+this.data.goodsDetail.detail.packageId,
      })
    }, error => {
        modalUtil.hideLoadingToast()
        modalUtil.showWarnToast(error.text);
    })
  }
})