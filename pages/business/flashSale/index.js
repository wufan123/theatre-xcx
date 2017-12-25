const storeRest = require('../../../rest/storeRest.js')
const theatreRest = require('../../../rest/theatreRest.js')
var app=getApp()
Page({
  data: {
    dataList: null
  },
  onLoad: function (e) {
    theatreRest.getPackageList(202, success => {
      this.data.dataList = success
      this.setData(this.data)
    }, error => {
      console.log(error)
    })
  }
})