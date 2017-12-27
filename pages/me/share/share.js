
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
})