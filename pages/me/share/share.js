var app = getApp()

Page({
  data: {
    isShare:false
  },
  onLoad: function (options) {
  
  },
  goShare:function(){
    this.setData({
      isShare:true
    })
  },
  cancelShare: function () {
    this.setData({
      isShare: false
    })
  },
  onShareAppMessage: function () {
    let path = '/pages/index/index';
    let phone = app.getUserInfo(false).bindmobile
    if (phone) {
      path += '?promoter='+phone
    }
    return {
        title: '中瑞剧坊',
        desc: '中瑞三坊七巷影音秀购票',
        path: path
    }
  }
})