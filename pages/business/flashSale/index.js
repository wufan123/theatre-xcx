const storeRest = require('../../../rest/storeRest.js')
var app=getApp()
Page({
  data: {
    dataList: null
  },
  onLoad: function (e) {
    storeRest.getBuyingGoods(app.globalData.cinemaCode, result => {
      this.data.dataList = result
      this.setData(this.data)
    }, error => {

    })
  }
})