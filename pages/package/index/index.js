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
    modalUtil.showLoadingToast()
    let goodsStr = e.currentTarget.id + ':1'
    console.log(e)
    storeRest.createComboOrder(app.globalData.cinemaCode, app.getUserInfo().bindmobile, goodsStr, success => {
      modalUtil.hideLoadingToast()
      wx.navigateTo({
        url: '../packageConfirm/packageConfirm?orderId='+success.packageId+'&number=1&packageId='+e.currentTarget.id,
      })
    }, error => {
      modalUtil.hideLoadingToast()
      modalUtil.showWarnToast(error.text);
    })
  }
})