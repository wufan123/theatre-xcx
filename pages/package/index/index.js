const theatreRest = require('../../../rest/theatreRest.js')
const storeRest = require('../../../rest/storeRest.js')
const modalUtil = require('../../../util/modalUtil.js')
var app = getApp()
Page({
  data: {
    dataList: []
  },
  onLoad: function (options) {
    theatreRest.getPackageList(200, success => {
      this.data.dataList = success;
      this.setData(this.data)
    }, error => {
      console.log(success)
    })
  },
  goBuy : function(e){
    wx.navigateTo({
      url: '../detail/detail?packageId='+e.currentTarget.id,
    })
  }
})