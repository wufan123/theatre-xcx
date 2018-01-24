const theatreRest = require('../../../rest/theatreRest')
var app = getApp()

Page({
  data: {
    isShare:false,
    titleConfig: '',
    subtitleConfig: '',
    ruleConfig: ''
  },
  onLoad: function (options) {
    theatreRest.getMiscConfig('invite_reg_title', success => {
      if (success && success.length > 0) {
        this.data.titleConfig = success[0].miscVal
        this.setData(this.data)
      }
    })
    theatreRest.getMiscConfig('invite_reg_subtitle', success => {
      if (success && success.length > 0) {
        this.data.subtitleConfig = success[0].miscVal
        this.setData(this.data)
      }
    })
    theatreRest.getMiscConfig('invite_reg_rule', success => {
      if (success && success.length > 0) {
        this.data.ruleConfig = success[0].miscVal
        this.setData(this.data)
      }
    })
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
    return app.shareMessage()
  }
})