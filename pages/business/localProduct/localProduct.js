const theatreRest = require('../../../rest/theatreRest.js')
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
        title: '超级联合日'
      })
    }
    theatreRest.getGoodsList(this.data.classType, success => {
      this.data.dataList = success;
      this.setData(this.data);
    }, error => {
      console.log(success)
    })
  },
  goBuy : function(e){
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodsId='+e.currentTarget.id+'&classType='+this.data.classType,
    })
  }
})