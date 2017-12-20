const orderRest = require('../../../../rest/orderRest.js')
const dateFormatter = require('../../../../util/timeUtil')
const modalUtils = require('../../../../util/modalUtil.js')
const qrcodeUtil = require('../../../../util/qrcode.js')
const app = getApp()

Page({
    data: {
        item: {},
        orderInfo: {},
        order_id: -1,
        orderTimer: -1,
        retryTime: 0,
        time:null,
        orderTip:'',
        isMoreOn:true,
        isShowMore:false,
      },
    
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
        let that = this;
      //   console.log('8888',options.info)
      var info = JSON.parse(options.params)
      //console.log('88888',info)
      //   var info = JSON.parse(options.info)
      //   info.seats = info.seatIntroduce.split(',')
    info.startTimetStr = dateFormatter.formatDate(info.startTime, 8) + " "+dateFormatter.formatDate(info.startTime, 5) + " " + dateFormatter.formatDate(info.startTime, 7)
       this.generateQRCode(info.qrCode)
        this.setData({
          orderInfo: info,
          order_id: info.orderCode,
          retryTime: 0,
          orderTip: app.globalData.orderTip
        })
        modalUtils.showLoadingToast('订单加载中')
    
        that.requestOrderDetail();
      },
      moreFn:function () {
        if(!this.data.isShowMore) return;
        console.log('this.data.isMoreOn',this.data.isMoreOn)
        this.setData({
          isMoreOn:!this.data.isMoreOn
        })
      },
      //获取订单详情
      requestOrderDetail: function () {
        let that = this;
        orderRest.getOrderPayInfo(this.data.order_id,
          function (res) {
            console.log(' success order detail', res);
            // res.data.movie_begin_time = util.formatTime(res.data.movie_begin_time, 'yyyy-mm-dd DD hh:nn').displayedDate;
           
           res.payInfo&&res.payInfo.forEach(a=>{
             console.log('1111',a)
             if(a.type!='weixinpay'){
               that.data.isShowMore = true
             }
           })
           that.data.item = res
            that.setData(that.data)
            modalUtils.hideLoadingToast()
          }
          ,
          function (res) {
            that.setData({
              retryTime: that.data.retryTime + 1
            })
            console.log(' fail ', res, ' 次数 ', that.data.retryTime);
            //尝试次数唱过6次 停止定时器
            if (that.data.retryTime > 6) {
              // clearInterval(that.orderTimer);
              modalUtils.showLoadingToast('详情页加载失败')
            }
          }
        );
      },
      generateQRCode: function (str) {
        if (!str) {
          str = ""
        }
        var size = qrcodeUtil.qrApi.getCanvasSize(460)
        qrcodeUtil.qrApi.draw(str, "qrcode", size.w, size.h)
      },
      //退款
      refunPaidOrder: function (e) {
        let that = this;
        var orderCode = e.currentTarget.dataset.orderid;
        wx.showModal({
          title: '温馨提示',
          content: '您确定申请退票吗',
          confirmColor: '#dc3c38',
          success: function (res) {
            if (res.confirm) {
              setTimeout(function() {
                modalUtils.showLoadingToast('退票中')
              }, 100);
              orderRest.backTieck(orderCode, (res) => {
                that.orderPay(res.orderId)
              });
            }
          }
        })
      },
        //请求支付
        orderPay: function (orderId,payType='account') {
          var that = this
          function requestSuccess(res) {
              console.log("请求支付", res)
              that.data.time = setInterval(()=>{
                orderRest.getBackFilmStatus(orderId,(res)=>{
                  if (res.status == "0") {
                    modalUtils.hideLoadingToast()
                    clearInterval(that.data.time)
                    modalUtils.showSuccessToast('退票成功！')
                    setTimeout(() => {
                      that.getRefundMovieList(that.data.page)
                    }, 2000);
                  }
                })
              },3000)
              // if ((kThis.data.orderInfo && kThis.data.orderInfo.price == 0)) {
              //     console.log("无需支付", res)
              //     pageUtil.gotoRefunding(kThis.data.orderId, kThis.data.orderType)
              // } else if (kThis.data.comboPayWay && kThis.data.comboPayWay.price == 0) {
              //     console.log("无需支付", res)
              //     pageUtil.gotoRefunding(kThis.data.orderId, kThis.data.orderType)
              // }
          }
          var openId = app.getOpenId()
          orderRest.changeFilePay(orderId, payType, openId, requestSuccess)
      },
      onUnload:function () {
        if (this.data.time){
          clearInterval(this.data.time)
        }
      },
      
      confirmPlayOrder: function (e) {
        console.log("confirm order info ", e.currentTarget.dataset.orderid);
        let order_id = {
          order_id: e.currentTarget.dataset.orderid
        }
        setTimeout(() => {
          wx.navigateTo({
            url: '../confirmPayment/confirmPayment' + '?res=' + JSON.stringify(order_id)
          });
        }, 100);
    
      }
})