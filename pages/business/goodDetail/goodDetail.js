const filmRest = require('../../../rest/filmRest.js')
const planRest = require('../../../rest/planRest.js')
const storeRest = require('../../../rest/storeRest.js')
const modalUtil = require('../../../util/modalUtil.js')
var app = getApp();
Page({
  data: {
    goodsDetail: {
      detail: null,
      classType: null
    },
    bottomTxt: '马上购买'
  },
  onLoad: function (e) {
    this.data.goodsDetail.classType = e.classType
    storeRest.getGoodsDetail(e.goodsId, success => {
      this.data.goodsDetail.detail = success.goodInfo
      this.setData(this.data)
    }, error => {
      console.log(error)
    })
  },
  confirm: function (e) {
    modalUtil.showLoadingToast()
    let goodsStr = this.data.goodsDetail.detail.goodsId + ':1'
    storeRest.createGoodsOrder(app.globalData.cinemaCode, app.getUserInfo().bindmobile, goodsStr, success => {
      modalUtil.hideLoadingToast()
      wx.navigateTo({
        url: '../orderConfirm/orderConfirm?orderId='+success+'&number=1&goodsId='+this.data.goodsDetail.detail.goodsId,
      })
    }, error => {
      modalUtil.hideLoadingToast()
      modalUtil.showWarnToast(error.text);
    })
    
  }
})