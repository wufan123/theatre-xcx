/**
 * 选择优惠券
 */
const timeUtil = require('../../../util/timeUtil')
var app = getApp()
Page({
  data: {
    couponList:[],
    seatCount: 1,
    selectCount: 0,
    voucherType: null
  },
  onLoad: function (e) {
    if (e.pageData==1) {
      this.data.couponList = app.getPageData()
    }
    if (e.seatCount) {
      this.data.seatCount = e.seatCount
    }
    this.data.couponList.forEach(item => {
      item.startTimeStr = timeUtil.formatDate(item.startTime, 4)
      item.validDataStr = timeUtil.formatDate(item.validData, 4)
    })
    this.setData(this.data)
  },
  couponCheck: function(e) {
    let coupon = e.currentTarget.dataset.coupon;
    if (coupon._disable) {
      return;
    }
    // if (coupon.status != 1) {
    //   return
    // }
    this.changeSelect(coupon)
    this.setData(this.data)
  },
  // 修改选中状态，voucher type : 0兑换券，1立减券，2 卖品券
  changeSelect: function(coupon) {
    let itemCheck = !coupon.checked // 当前选中状态
    // 初始化选中类型
    if (!this.data.voucherType && itemCheck) {
      this.data.voucherType = coupon.voucherType
      // 已选中兑换券，立减券不可选。或者已选中立减券，兑换券不可选
      this.data.couponList.forEach(item => {
        item._disable = (this.data.voucherType==0&&item.voucherType!=0)||(this.data.voucherType!=0&&item.voucherType==0)
      })
    }

    // 修改选中状态
    this.data.couponList.forEach(item => {
      if (item.voucherNum == coupon.voucherNum) {
        item.checked = !item.checked
      } else {
        // 除了兑换券，其他单选
        if (itemCheck && coupon.voucherType != 0) {
          item.checked = false
        }
      }
    })

    // 选中个数
    this.data.selectCount = 0;
    this.data.couponList.forEach(item => {
      if (item.checked) {
        this.data.selectCount++
      }
    })

    // 无选中状态，清除当前类型
    if(this.data.selectCount == 0) {
      this.data.voucherType = null
      this.data.couponList.forEach(item => {
        item._disable = false
      })
    }

    // 如果是兑换券，且已经达到最大
    if (this.data.voucherType == 0) {
      this.data.couponList.forEach(item => {
        if (item.voucherType == 0) {
          item._disable = (this.data.selectCount >= this.data.seatCount) && (!item.checked)
        }
      })
    }
  },
  confirm: function() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setCouponList(this.data.couponList)
    wx.navigateBack()
  }
})