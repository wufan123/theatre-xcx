const orderRest = require('../../../rest/orderRest.js')
const modalUtil = require('../../../util/modalUtil.js')
Page({
    data: {
        orderId: '',
        filmInfo: null,
        goodsInfo: null
    },
    onLoad: function (option) {
        this.data.orderId = option.orderId;
        this.setData(this.data);
        orderRest.getCinemaOrderInfo(this.data.orderId, success => {
            this.data.filmInfo = success.film;
            this.data.goodsInfo = success.goods;
            this.setData(this.data)
        }, error => {
            modalUtil.showFailToast('订单获取失败')
        })
    },
    confirm: function() {
        wx.redirectTo({
            url: '../payment/payment',
        })
    }
})