const orderRest = require('../../../../rest/orderRest.js')
const dateFormatter = require('../../../../util/timeUtil')
const modalUtils = require('../../../../util/modalUtil.js')
var app = getApp();

Page({
  data: {
    coupon: null
  },
  onLoad: function (options) {
    var coupon = app.getPageData()
    this.setData({
      coupon: coupon
    });
    this.fetchData();
  },
  fetchData: function () {
    if (this.data.coupon && this.data.coupon.voucherNum) {
      orderRest.userVoucherDetail(this.data.coupon.voucherNum, app.globalData.cinemaCode, res => {
        if (res) {
          res.startTimeStr = dateFormatter.formatDate(res.startTime, 4)
          res.validDataStr = dateFormatter.formatDate(res.validData, 4)
          if (res.voucherType == 0) {
            res._voucherValue = '兑换券'
          } else {
            res._voucherValue = '￥' + res.voucherValue
          }
          this.setData({
            coupon: res
          });
        }
      });
    }
  },
  // 解除绑定
  delVoucher: function(e) {
    if (this.data.coupon && this.data.coupon.voucherNum) {
      modalUtils.showLoadingToast()
      orderRest.userVoucherDelete(this.data.coupon.voucherNum, success => {
        modalUtils.hideLoadingToast()
        modalUtils.showSuccessToast('解绑成功')
        // 列表更新
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.reloadCouponList()

        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      }, error => {
        modalUtils.hideLoadingToast()
        modalUtils.showFailToast('解绑失败')
      });
    }
  }
})