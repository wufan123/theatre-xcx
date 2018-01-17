const storeRest = require('../../../rest/storeRest.js')
const orderRest = require('../../../rest/orderRest.js')
const modalUtil = require('../../../util/modalUtil.js')
var app = getApp()

Page({
    data: {
        goodsList: [],
        orderId: '',
        bottomTxt: '不选了，直接下单购票',
        destoryCancelOrder: true
    },
    onLoad: function (option) {
        this.data.orderId = option.orderId;
        this.setData(this.data);
        storeRest.getGoodsList(app.globalData.cinemaCode, res => {
            this.data.goodsList = res;
            this.setData(this.data);
            if (res.length==0) {
              this.gotoConfirm();
            }
        }, res => {
            console.log(res)
        })
    },
    onUnload: function () {
        // 如果不是跳转到取人界面，取消订单
        if (this.data.destoryCancelOrder) {
            orderRest.cancelOrder(this.data.orderId, res => {
                console.log(res)
            });
        }
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
    // 跳转确认页面
    gotoConfirm: function() {
        this.data.destoryCancelOrder = false
        this.setData(this.data)
        wx.redirectTo({
            url: '../confirm/confirm?orderId=' + this.data.orderId
        });
    },
    confirm: function() {
        var goodsStr = "";
        for (var i = 0; i < this.data.goodsList.length; i++) {
            var goods = this.data.goodsList[i];
            if (goods.num && goods.num != 0) {
                if (goodsStr) {
                    goodsStr += ",";
                }
                goodsStr += goods.goodsId + ":" + goods.num;
            }
        }
        if (goodsStr.length == 0) {
            this.gotoConfirm();
            return;
        }
        let bindmobile = app.getUserInfo(true).bindmobile;
        if (!bindmobile) {
            return;
        }
        modalUtil.showLoadingToast()
        storeRest.createGoodsFilmOrder(app.globalData.cinemaCode, bindmobile, goodsStr, this.data.orderId, res => {
            orderRest.mergeOrder(this.data.orderId, res, bindmobile, res => {
                this.gotoConfirm();
            }, res => {
                modalUtils.showWarnToast(res.text);
            });
        }, res => {
            modalUtils.showWarnToast(res.text);
        });
        modalUtil.hideLoadingToast()
    }
})