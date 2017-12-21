Page({
    data: {
        bottomTxt: '不选了，直接下单购票'
    },
    onLoad: function (e) {
    },
    confirm: function() {
        wx.redirectTo({
            url: '../confirm/confirm',
        })
    }
})