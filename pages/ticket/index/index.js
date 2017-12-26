const filmRest = require('../../../rest/filmRest.js')
const planRest = require('../../../rest/planRest.js')
const orderRest = require('../../../rest/orderRest.js')
const modalUtil = require('../../../util/modalUtil.js')
var app = getApp();
Page({
    data: {
        filmDetail: {
            detail: null,
            standardPrice: 0,
            showPlan: false
        },
        filmPlan: {
            timeList: [],
            planList: [],
            timeSelected: null,
            planSelected: null,
            count: 0
        },
        bottomTxt: '马上购买',
        selectSeats: null, // 选中排期座位信息
    },
    onLoad: function (e) {
        this.loadFilmTime();
    },
    confirm: function(e) {
        if (!this.data.filmDetail.showPlan) {
            this.data.filmDetail.showPlan = true;
            this.data.bottomTxt = '确定'
            this.setData(this.data)
        } else {
            this.createOrder()
        }
    },
    hidePlan: function() {
        this.data.filmDetail.showPlan = false;
        this.data.bottomTxt = '马上购买'
        this.setData(this.data)
    },
    emptyBtn: function() {

    },
    // 营业日期
    loadFilmTime: function() {
        let params = {
            cinemaCode: app.globalData.cinemaCode
        }
        planRest.getTimes(params, res => {
            this.data.filmPlan.timeList = res;
            this.setData(this.data)
            if (res.length > 0) {
                this.data.filmPlan.timeSelected = res[0].time
                this.loadFilmPlan(res[0].time);
            }
        }, res => {
            console.log(res)
        })
    },
    // 排期
    loadFilmPlan: function(time) {
        modalUtil.showLoadingToast()
        let params = {
            cinemaCode: app.globalData.cinemaCode,
            time: time
        }
        planRest.getPlans(params, res => {
            modalUtil.hideLoadingToast();
            if (res.length>0) {
                if (!this.data.filmDetail.detail) {
                    this.loadFilmDetail(res[0].filmId)
                }
                this.data.filmPlan.planList = res[0].planInfo;
                this.data.filmDetail.standardPrice = res[0].planInfo[0].standardPrice // 取价格
                this.data.filmPlan.planSelected = res[0].planInfo[0].featureAppNo
                this.setData(this.data)
                this.loadSeat(this.data.filmPlan.planSelected)
            }
        }, res => {
            modalUtil.hideLoadingToast();
            console.log(res)
        })
    },
    // 加载影片详情
    loadFilmDetail: function(filmId) {
        modalUtil.showLoadingToast()
        filmRest.getFilmDetail(filmId, res => {
            modalUtil.hideLoadingToast();
            res.introduction = res.introduction.replace('&lt;html&gt;&lt;body&gt;', '')
                                                .replace('&lt;/body&gt;&lt;/html&gt;', '')
                                                .replace(/&lt;/g, "<")
                                                .replace(/&gt;/g, ">")
                                                .replace(/&amp;/g, "&")
                                                .replace(/&quot;/g, '"')
                                                .replace(/&apos;/g, "'")
                                                .replace(/\<br\s*\/\>/g, "\r\n")
            this.data.filmDetail.detail = res
            this.setData(this.data)
        }, res => {
            console.log(res)
            modalUtil.hideLoadingToast();
            modalUtil.showWarnToast("影片加载失败");
        });
    },
    // 加载座位信息
    loadSeat: function(featureAppNo) {
        modalUtil.showLoadingToast()
        filmRest.getSeat(featureAppNo, success => {
            modalUtil.hideLoadingToast();
            this.data.selectSeats = success
            this.setData(this.data)
            this.checkOrder(this.data.selectSeats)
        }, error => {
            modalUtil.hideLoadingToast();
        })
    },
    // 未完成订单提醒
    checkOrder: function(seatInfo) {
        if (seatInfo.hasOrder) {
            wx.showModal({
                title: '温馨提示',
                content: '存在未付款影票订单',
                cancelText: '取消订单',
                cancelColor: '#000000',
                confirmText: '支付订单',
                confirmColor: '#159eec',
                success: _res => {
                    if (_res.confirm) {
                        wx.redirectTo({
                            url: '../confirm/confirm?orderId=' + seatInfo.hasOrder
                        });
                    } else {
                        modalUtil.showLoadingToast('正在取消订单');
                        orderRest.cancelOrder(seatInfo.hasOrder, res => {
                            setTimeout(() => {
                                modalUtil.hideLoadingToast();
                                modalUtil.showSuccessToast('订单取消成功');
                            }, 8000);
                        });
                    }
                }
            });
        }
    },

    // 数量
    subtract: function () {
        this.data.filmPlan.count = this.data.filmPlan.count - 1;
        this.data.filmPlan.count = this.data.filmPlan.count > 0 ? this.data.filmPlan.count : 0
        this.setData(this.data)
    },
    add: function () {
        this.data.filmPlan.count = Number(this.data.filmPlan.count) + 1
        this.setData(this.data)
    },
    // 营业日期选择
    selectTime: function(e) {
        this.data.filmPlan.timeSelected = e.currentTarget.id
        this.setData(this.data)
        this.loadFilmPlan(this.data.filmPlan.timeSelected)
    },
    // 排期选择
    selectPlan: function(e) {
        this.data.filmPlan.planSelected = e.currentTarget.id
        this.setData(this.data)
        this.loadSeat(this.data.filmPlan.planSelected)
    },
    // 锁座，创建订单
    createOrder: function() {
        if (this.data.filmPlan.count <= 0) {
            modalUtil.showFailToast('数量必须大于0');
            return;
        }
        if (!this.data.selectSeats || !this.data.selectSeats.seatinfos) {
          modalUtil.showFailToast('已售罄');
          return;
        }
        let seat = [];
        this.data.selectSeats.seatinfos.seat.forEach(row => {
          row.forEach(col => {
            if (col.SeatState == 0) {
              seat.push(col)
            }
          })
        })
        if (seat.length == 0) {
            modalUtil.showFailToast('已售罄');
            return;
        }
        if(seat.length < this.data.filmPlan.count){
            modalUtil.showFailToast('余票不足');
            return;
        }

        let selectedSeat = seat.slice(0, this.data.filmPlan.count)
        let seatIntroduce = [], datas = []
        selectedSeat.forEach(e => {
            seatIntroduce.push(e.SeatRow + '排' + e.SeatCol + '座')
            datas.push({ seatNo: e.SeatNo, seatPieceNo: e.seatPieceNo })
        })
        modalUtil.showLoadingToast()
        orderRest.setPlanAndGoodsOrder({
            cinemaCode: app.globalData.cinemaCode,
            mobile: app.getUserInfo().bindmobile,
            featureAppNo: this.data.filmPlan.planSelected,
            seatIntroduce: seatIntroduce.join(','),
            datas: JSON.stringify(datas)
        }, success => {
            modalUtil.hideLoadingToast();
            wx.navigateTo({
                url: '../goods/goods?orderId=' + success.planOrderId
            });
            // 还原界面状态
            setTimeout(() => {
                this.hidePlan()
            }, 1000)
        }, error => {
            console.log(error)
            modalUtil.showFailToast('锁座失败');
        })
    }
})