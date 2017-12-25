const filmRest = require('../../../rest/filmRest.js')
const planRest = require('../../../rest/planRest.js')
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
        bottomTxt: '马上购买'
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
            // TODO 判断参数
            wx.navigateTo({
                url: '../goods/goods',
            })

            // 还原界面状态
            setTimeout(() => {
                this.data.filmDetail.showPlan = false;
                this.data.bottomTxt = '马上购买'
                this.setData(this.data)
            }, 1000)
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
        let params = {
            cinemaCode: app.globalData.cinemaCode,
            time: time
        }
        planRest.getPlans(params, res => {
            if (res.length>0) {
                if (!this.data.filmDetail.detail) {
                    this.loadFilmDetail(res[0].filmId)
                }
                this.data.filmPlan.planList = res[0].planInfo;
                this.data.filmDetail.standardPrice = res[0].planInfo[0].standardPrice // 取价格
                this.data.filmPlan.planSelected = res[0].planInfo[0].featureAppNo
                this.setData(this.data)
            }
        }, res => {
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
        // TODO
    },
    // 排期选择
    selectPlan: function(e) {
        this.data.filmPlan.planSelected = e.currentTarget.id
        this.setData(this.data)
        // TODO 
    }
})