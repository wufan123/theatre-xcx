const theatreRest = require('../../../../rest/theatreRest')
const timeUtil = require('../../../../util/timeUtil.js')
var app = getApp()

Page({
  data: {
    order: null,
    ruleConfig: ''
  },
  onLoad: function (options) {
    this.data.order = JSON.parse(options.info);
    this.data.order._downTime = timeUtil.formatTimeByStamp(this.data.order.downTime, 'yyyy-MM-dd HH:mm:ss')
    this.setData(this.data)

    // 规则说明
    theatreRest.getMiscConfig('package_order_info', success => {
      if (success && success.length > 0) {
        this.data.ruleConfig = success[0].miscVal
        this.setData(this.data)
      }
    })
  },
  makeCall:function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone
    })
  }
})