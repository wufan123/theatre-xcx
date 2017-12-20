const filmRest = require('../../../rest/filmRest.js')
const planRest = require('../../../rest/planRest.js')
const modalUtil = require('../../../util/modalUtil.js')
var app = getApp();
Page({
    data: {
        filmDetail: {
            detail: null,
            showPlan: false
        },
        filmPlan: {
            timeList: [{time: "20161220"},{time: "20161221"},{time: "20161222"}],
            planList: [{time: "15:30"},{time: "17:00"},{time: "20:00"}],
            count: 0
        }
    },
    onLoad: function (e) {
        this.loadFilmDetail();
    },
    confirm: function(e) {
        if (!this.data.filmDetail.showPlan) {
            this.data.filmDetail.showPlan = true;
            this.setData(this.data)
        }
    },
    hidePlan: function() {
        this.data.filmDetail.showPlan = false;
        this.setData(this.data)
    },
    emptyBtn: function() {

    },
    // 加载影片详情
    loadFilmDetail: function() {
        modalUtil.showLoadingToast()
        filmRest.getMove(1, app.globalData.cinemaCode, res => {
            if (res.length > 0) {
                filmRest.getFilmDetail(res[0].id, res => {
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
                    this.loadFilmTime();
                }, res => {
                    console.log(res)
                    modalUtil.hideLoadingToast();
                    modalUtil.showWarnToast("影片加载失败");
                });
            } else {
                modalUtil.hideLoadingToast();
                modalUtil.showWarnToast("影片加载失败");
            }
        }, res => {
            console.log(res)
            modalUtil.hideLoadingToast();
            modalUtil.showWarnToast("影片加载失败");
        });
    },
    loadFilmTime: function() {
        let params = {
            filmNo: this.data.filmDetail.detail.filmNo,
            cinemaCode: app.globalData.cinemaCode
        }
        planRest.getTimes(params, res => {
            this.data.filmPlan.timeList = res;
            this.setData(this.data)
            if (res.length > 0) {
                this.loadFilmPlan(res[0].time);
            }
        }, res => {
            console.log(res)
        })
    },
    loadFilmPlan: function(time) {
        let params = {
            filmNo: this.data.filmDetail.detail.filmNo,
            cinemaCode: app.globalData.cinemaCode,
            time: time
        }
        planRest.getPlans(params, res => {
            console.log(res)
        }, res => {
            console.log(res)
        })
    },

    // 排期
    subtract: function () {
        this.data.filmPlan.count = this.data.filmPlan.count - 1;
        this.data.filmPlan.count = this.data.filmPlan.count > 0 ? this.data.filmPlan.count : 0
        this.setData(this.data)
    },
    add: function () {
        this.data.filmPlan.count = Number(this.data.filmPlan.count) + 1
        this.setData(this.data)
    }
})