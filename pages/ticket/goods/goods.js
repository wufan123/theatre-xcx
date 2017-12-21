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
    addQuatity: function (e) {
        var goods = this.data.goodsList[e.currentTarget.dataset.index];
        if (!goods) return;
        if (!goods.num) goods.num = 0;
        goods.num++;
        this.caculateCount()
    },
    subtractQuatity: function (e) {
        var goods = this.data.goodsList[e.currentTarget.dataset.index];
        if (!goods || !goods.num) return;
        goods.num--;
        this.caculateCount()
    },
    caculateCount: function () {
        var count = 0;
        for (var i = 0; i < this.data.goodsList.length; i++) {
            var item = this.data.goodsList[i];
            if (item.num) count += item.num * item.price;
        }
        this.data.bottomTxt = count>0?"下一步（￥"+count+"）":"不选了，直接下单购票"
        this.setData(this.data);
    },
    confirm: function() {
        wx.redirectTo({
            url: '../confirm/confirm',
        })
    }
})