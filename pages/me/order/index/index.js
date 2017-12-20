const orderRest = require('../../../../rest/orderRest.js')
const dateFormatter = require('../../../../util/timeUtil')
const modalUtils = require('../../../../util/modalUtil.js')

Page({
    data: {
        curTab: 0,
        //完成，退票，异常
        orderData: [{
          orderList: [],
          page: 1,
          status: 3,
          isFirst: true
        }, {
          orderList: [],
          page: 1,
          status: 9,
          isFirst: true
        }, {
          orderList: [],
          page: 1,
          status: 6,
          isFirst: true
        }],
        items: [],
        totalNum: -1
      },
      onLoad(options) {
        var tab = this.data.curTab
        var status = this.data.orderData[tab].status
        var page = this.data.orderData[tab].page
        // modalUtils.showLoadingToast()
        this.requestNewMovieList(status, page, tab);
      },
      onPullDownRefresh: function () {
        // modalUtils.showLoadingToast()
        var tab = this.data.curTab
        var status = this.data.orderData[tab].status
        var page = this.data.orderData[tab].page
        this.requestNewMovieList(status, page, tab);
      },
      onReachBottom: function () {
        // modalUtils.showLoadingToast()
        var tab = this.data.curTab
        var page = this.data.orderData[tab].page + 1
        var status = this.data.orderData[tab].status
        if (this.data.orderData[tab].orderList && this.data.orderData[tab].orderList.length > 0)
          this.requestNewMovieList(status, page, tab)
      },
      requestNewMovieList: function (status, page, tab) {
        var that = this;
        modalUtils.showLoadingToast()
        orderRest.getAllMoiveOrder(status, page,
          function (res) {
            modalUtils.hideLoadingToast()
            wx.stopPullDownRefresh()  
            res.forEach(e => {
              e.startTimetStr = dateFormatter.formatDate(e.startTime, 5) + " " + dateFormatter.formatDate(e.startTime, 6)
              e.seats = e.seatIntroduce.split(',')
            })
            console.log('res', res)
            if (page == 1) {
              that.data.orderData[tab].orderList = res
              that.data.orderData[tab].page = page
            } else {
              //如果Page>1,并且有数据
              if (res && res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                  that.data.orderData[tab].orderList.push(res[i])
                }
                that.data.orderData[tab].page = page
              }
            }
            that.data.orderData[tab].isFirst = false
            that.data.orderData[tab].totalNum = that.data.orderData[tab].length || 0
            if (that.data.curTab == tab)
              that.setData(that.data)
            
          },
          function (res) {
            modalUtils.hideLoadingToast()
            wx.stopPullDownRefresh()
            console.log(' fail ', res);
          }
        )
      },
      selectTab: function (event) {
        var index = event.currentTarget.dataset.index
        if (index != this.data.curTab) {
          this.data.curTab = index;
          this.setData(this.data)
          this.updateDataWithIndex(parseInt(index))
        }
      },
      updateDataWithIndex: function (index) {
        if (!this.data.orderData[index].orderList || this.data.orderData[index].orderList.length == 0) {
          modalUtils.showLoadingToast()
          var status = this.data.orderData[index].status
          var page = 1
          var tab = index
          this.requestNewMovieList(status, page, tab)
        }
      },
      orderDetailPage: function (e) {
        if (e.currentTarget.dataset.indexid >= 0) {
          var orderItem = this.data.orderData[this.data.curTab].orderList[e.currentTarget.dataset.indexid];
          var vquery = {
            orderCode : orderItem.orderCode,
            qrCode:orderItem.qrCode,
            verifyCode:orderItem.verifyCode,
            status:orderItem.status,
            startTime:orderItem.startTime,
            statustr:orderItem.statustr,
            filmImg:orderItem.filmImg
          }
          wx.navigateTo({
            url: '../detail/detail' + '?params=' + JSON.stringify(vquery)
          });
    
        }
      }
})