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
            res.validData = dateFormatter.formatTimeByStamp(res.validData, "yyyy-MM-dd")
            if (res) {
              this.setData({
                coupon: res
              });
            }
          });
        }
      }
})