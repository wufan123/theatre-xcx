const planRest = require('../../../rest/storeRest.js')
var app = getApp()

Page({
    data: {
        goodsList: [],
        bottomTxt: '不选了，直接下单购票'
    },
    onLoad: function (e) {
        planRest.getGoodsList(app.globalData.cinemaCode, res => {
            this.data.goodsList = res;
            this.setData(this.data);
        }, res => {
            console.log(res)
        })
    },
    confirm: function() {
        wx.redirectTo({
            url: '../confirm/confirm',
        })
    }
})