/**
 * 选择优惠券
 */
const timeUtil = require('../../../util/timeUtil')
const modalUtil = require('../../../util/modalUtil.js')
var app = getApp()
Page({
  data: {
    couponList:[],
    seatCount: 1,
    selectCount: 0,
    firstCoupon: null // 初始选中的票券
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
      if (item.status != 1) {
        item._disable = true
      }
      if (item.voucherType == 0) {
        item._voucherValue = '兑换券'
    } else {
        item._voucherValue = '￥' + item.voucherValue
    }
    })
    this.setData(this.data)
  },
  couponCheck: function(e) {
    let coupon = e.currentTarget.dataset.coupon;
    if (coupon._disable) {
      return;
    }
    this.changeSelect(coupon)
    this.setData(this.data)
  },
  // 修改选中状态，voucher type : 0兑换券，1立减券，2 卖品券
  changeSelect: function(coupon) {
    let itemCheck = !coupon.checked // 当前选中状态
    // 初始化选中类型
    if (!this.data.firstCoupon && itemCheck) {
      this.data.firstCoupon = coupon
      // 已选中兑换券，立减券不可选。或者已选中立减券，兑换券不可选
      this.data.couponList.forEach(item => {
        if (item.status == 1) {
          item._disable = (this.data.firstCoupon.voucherType==0&&item.voucherType!=0)||(this.data.firstCoupon.voucherType!=0&&item.voucherType==0)
        }
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
      this.data.firstCoupon = null
      this.data.couponList.forEach(item => {
        if (item.status == 1) {
          item._disable = false
        }
      })
    }

    // 如果是兑换券，且已经达到最大
    if (this.data.firstCoupon&&this.data.firstCoupon.voucherType == 0) {
      this.data.couponList.forEach(item => {
        if (item.voucherType == 0 && item.status == 1) {
          if (item.ticketValue != this.data.firstCoupon.ticketValue) { // 不同类型兑换券不可用
            item._disable = true
          } else {
            item._disable = (this.data.selectCount >= this.data.seatCount) && (!item.checked)
          }
        }
      })
    }
  },
  confirm: function() {
    // 如果是兑换券，兑换券票数必须和座位数一致
    if (this.data.firstCoupon&&this.data.firstCoupon.voucherType == 0) {
      let couponCount = 0;
      this.data.couponList.forEach(item => {
        if (item.checked) {
          couponCount++;
        }
      })
      if (couponCount != this.data.seatCount) {
        modalUtil.showFailToast("还需要"+(this.data.seatCount-couponCount)+'张')
        return;
      }
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setCouponList(this.data.couponList)
    wx.navigateBack()
  }
})