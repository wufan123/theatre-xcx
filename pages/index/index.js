//获取应用实例
import marquee from '../../components/marquee/marquee.js';

const theatreRest = require('../../rest/theatreRest.js')
const urlUtil = require('../../util/urlUtil.js')
var app = getApp()
Page({
  data: {
    bannerList: {
      list: [],
      indicatorDots: false
    },
    messageInfo: {
      marquee: { text: '' },
      marqueeDetail: null
    },
  },
  onLoad: function (option) {
    if (option.q) {
      let promoteInfo = urlUtil.getSearchParams(unescape(option.q))
      if (promoteInfo) {
        app.recordPromotion(promoteInfo.promoter, promoteInfo.type)
      }
    } else if (option.recommendId) {
      app.recordPromotion(null, null, option.recommendId)
    }
  },
  onShow: function() {
    // banner
    this.requestBanner();
    // 跑马灯
    this.requestMarquee();
  },
  login: function() {
    let userInfo = app.getUserInfo(false)
    if (userInfo) {
      wx.navigateTo({
        url: '../me/index/index'
      });
    } else {
      wx.navigateTo({
        url: '../login/login/login'
      });
    }
  },
  // 获取banner列表
  requestBanner: function() {
    theatreRest.getInformationList(10, success => {
      this.data.bannerList.list = success
      if (success && success.length > 1) {
        this.data.bannerList.indicatorDots = true
      }
      this.setData(this.data)
    }, error => {
      console.log(error)
    })
  },
  // 获取跑马灯消息
  requestMarquee: function() {
    theatreRest.getInformationList(40, success => {
      if (success&&success.length>0) {
        this.data.messageInfo.marqueeDetail = success[0];

        // 消息跑马灯 
        const str = this.data.messageInfo.marqueeDetail.title;
        this.data.messageInfo.marquee.text = str;
        this.data.messageInfo.marquee.width = marquee.getWidth(str);
        this.data.messageInfo.marquee.duration = (this.data.messageInfo.marquee.width + 25) * 5 / 25
        this.setData({
          messageInfo: this.data.messageInfo
        });
      }
    }, error => {
      console.log(error)
    })
  },
  // banner 点击
  bannerClick: function(e) {
    console.log(e)
    let banner = e.currentTarget.dataset.banner
    if (!banner.click) {
      return;
    }
    // 链接跳转
    if (banner.redirectType == 1 || banner.redirectType == 2 || banner.redirectType == 3) {
      wx.navigateTo({
        url: '/pages/webview/webview?url='+banner.contentUrl
      });
    } 
    // 卖品
    else if (banner.redirectType == 4) {
      wx.navigateTo({
        url: '/pages/business/goodDetail/goodDetail?goodsId='+banner.redirectId
      });
    }
    // 套票
    else if (banner.redirectType == 5) {
      wx.navigateTo({
        url: '/pages/package/detail/detail?packageId='+banner.redirectId
      });
    }
    // 场次票
    else if (banner.redirectType == 6) {
      wx.navigateTo({
        url: '/pages/ticket/index/index'
      });
    }
  },
  // 场次票购买
  ticketFilm: function() {
    wx.navigateTo({
      url: '../ticket/index/index'
    });
  },
  // 套票购买
  createPackageOrder: function(e) {
    wx.navigateTo({
      url: '../package/index/index'
    });
  },
  // 限时抢购
  flashSale: function() {
    wx.navigateTo({
      url: '../business/flashSale/index',
    })
  },
  localProduct:function(e){
    wx.navigateTo({
      url: '../business/localProduct/localProduct?classType='+e.currentTarget.id,
    })
  },
  // 跳转我的优惠券
  seeCardClick: function () {
    wx.navigateTo({
      url: '/pages/me/coupon/index/index'
    })
  },
  onShareAppMessage: function () {
    return app.shareMessage()
  }
})
