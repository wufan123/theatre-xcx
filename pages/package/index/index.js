const theatreRest = require('../../../rest/theatreRest.js')
const storeRest = require('../../../rest/storeRest.js')
const modalUtil = require('../../../util/modalUtil.js')
var app = getApp()
Page({
  data: {
    dataList: []
  },
  onLoad: function (options) {
    modalUtil.showLoadingToast()
    theatreRest.getPackageList(200, success => {
      modalUtil.hideLoadingToast()
      success.forEach(item => {
        try {
          item.imgs = JSON.parse(item.imgs)
        } catch(error) {}
      })
      this.data.dataList = success;
      this.setData(this.data)
    }, error => {
      modalUtil.hideLoadingToast()
      modalUtil.showWarnToast('列表获取失败');
    })
  },
  goBuy : function(e){
    wx.navigateTo({
      url: '../detail/detail?packageId='+e.currentTarget.id,
    })
  }
})