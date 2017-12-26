const orderRest = require('../../../rest/orderRest.js')
Page({
    data: {
        orderId: ''
    },
    onLoad: function (option) {
        this.data.orderId = option.orderId;
        this.setData(this.data);
        orderRest.getCinemaOrderInfo(this.data.orderId, success => {

        }, error => {

        })
    },
    confirm: function() {
        wx.redirectTo({
            url: '../payment/payment',
        })
    }
})