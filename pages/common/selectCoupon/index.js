/**
 * 选择优惠券
 */
Page({
  data: {
    couponList:[],
    isRadio: 0
  },
  onLoad: function (e) {
    this.data.couponList = JSON.parse(e.info)
    if (e.isRadio) {
      this.data.isRadio = e.isRadio
    }
    console.log(this.data.isRadio)
    this.setData(this.data)
  },
  couponCheck: function(e) {
    // 单选
    if (this.data.isRadio == 1) {
      let coupon = e.currentTarget.dataset.coupon;
      this.data.couponList.forEach(item => {
        if (item.voucherNum == coupon.voucherNum) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      this.confirm()
    }
    // 多选
    else {
      let coupon = e.currentTarget.dataset.coupon;
      this.data.couponList.forEach(item => {
        if (item.voucherNum == coupon.voucherNum) {
          item.checked = !item.checked
        }
      })
      this.setData(this.data)
    }
  },
  confirm: function() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setCouponList(this.data.couponList)
    wx.navigateBack()
  }
})