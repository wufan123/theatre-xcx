const theatreRest = require('../../../rest/theatreRest.js')
Page({
  data: {
    dataList: []
  },
  onLoad: function (options) {
    if (options.classType == 102) {
      wx.setNavigationBarTitle({
        title: '超级联合日'
      })
    }
    theatreRest.getGoodsList(options.classType, success => {
      this.data.dataList = success;
      this.setData(this.data);
    }, error => {
      console.log(success)
    })
  },
  goBuy : function(){
    wx.navigateTo({
      url: '../goodDetail/goodDetail',
    })
  }
})