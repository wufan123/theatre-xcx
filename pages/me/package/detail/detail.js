const timeUtil = require('../../../../util/timeUtil.js')
var app = getApp()

Page({
  data: {
    order: null
  },
  onLoad: function (options) {
    this.data.order = JSON.parse(options.info);
    this.data.order._downTime = timeUtil.formatTimeByStamp(this.data.order.downTime, 'yyyy-MM-dd HH:mm:ss')
    this.setData(this.data)
  },
  makeCall:function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone
    })
  }
})