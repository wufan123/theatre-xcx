const filmRest = require('../../../rest/filmRest.js')
const planRest = require('../../../rest/planRest.js')
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
    storeRest.getGoodsDetail(e.goodsId, success => {
      this.data.goodsDetail.detail = success.goodInfo
      this.setData(this.data)
    }, error => {
      console.log(error)
    })
  },
  confirm: function (e) {
    // wx.navigateTo({
    //   url: '../goods/goods',
    // })
  }
})