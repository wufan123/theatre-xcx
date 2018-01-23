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
    modalUtil.showLoadingToast()
    storeRest.getGoodsDetail(e.goodsId, success => {
      modalUtil.hideLoadingToast()
      this.data.goodsDetail.detail = success.goodInfo
      this.setData(this.data)
    }, error => {
      modalUtil.hideLoadingToast()
      modalUtil.showWarnToast('信息获取失败');
    })
  },
  confirm: function (e) {
    let bindmobile = app.getUserInfo(true).bindmobile;
    if (!bindmobile) {
      return;
    }
    modalUtil.showLoadingToast()
    let goodsStr = this.data.goodsDetail.detail.goodsId + ':1'
    storeRest.createGoodsOrder(app.globalData.cinemaCode, bindmobile, goodsStr, success => {
      modalUtil.hideLoadingToast()
      wx.navigateTo({
        url: '../orderConfirm/orderConfirm?orderId='+success+'&number=1&goodsId='+this.data.goodsDetail.detail.goodsId,
      })
    }, error => {
      modalUtil.hideLoadingToast()
      modalUtil.showWarnToast('卖品已下架');
    })
    
  }
})