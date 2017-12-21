Page({

  /**
   * 页面的初始数据
   */
  data: {
    canUseWeb: wx.canIUse('web-view'),
    protocolWebUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      protocolWebUrl: options.url+"?source=xcx"
    });
  }
})