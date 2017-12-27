const orderRest = require('../../../../rest/orderRest.js')
const dateFormatter = require('../../../../util/timeUtil')
var app = getApp();

Page({
    data: {
        coupon: null
      },
      onLoad: function (options) {
        var coupon = JSON.parse(options.info);
        this.setData({
          coupon: coupon
        });
        this.fetchData();
      },
      fetchData: function () {
        if (this.data.coupon && this.data.coupon.voucherNum) {
            orderRest.userVoucherDetail(this.data.coupon.voucherNum, app.globalData.cinemaCode, res => {
            res.startTime = dateFormatter.formatDate(res.startTime, 4)
            res.validData = dateFormatter.formatDate(res.validData, 4)
            if (res) {
              this.setData({
                coupon: res
              });
            }
          });
        }
      }
})