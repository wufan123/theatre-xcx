Page({
    data: {
    },
    onLoad: function (e) {
    },
    confirm: function() {
        wx.redirectTo({
            url: '../payment/payment',
        })
    }
})