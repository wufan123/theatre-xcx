const theatreRest = require('../../../rest/theatreRest.js')
const modalUtil = require('../../../util/modalUtil.js')
Page({
  data: {
    dataList: [],
    classType: null
  },
  onLoad: function (options) {
    this.data.classType = options.classType
    this.setData(this.data)
    if (this.data.classType == 102) {
      wx.setNavigationBarTitle({
        title: '3D Café'
      })
    }
    modalUtil.showLoadingToast()
    theatreRest.getGoodsList(this.data.classType, success => {
      modalUtil.hideLoadingToast()
      this.data.dataList = success;
      this.setData(this.data);
    }, error => {
      modalUtil.hideLoadingToast()
      modalUtil.showWarnToast('列表获取失败');
    })
  },
  goBuy : function(e){
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodsId='+e.currentTarget.id+'&classType='+this.data.classType,
    })
  }
})