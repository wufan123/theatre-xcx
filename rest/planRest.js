/**
 * 排片信息接口
 */
var httpRest = require('./httpBaseApi.js');

/**
 * 排片时间列表
 *
 * @param {*} cinemaCode 影院编码
 * @param {*} success_cb
 * @param {*} fail_cb
 */
function getTimes(param, success_cb, fail_cb) {
    var vQuery = {};
    if (param.filmNo) {
        vQuery.filmNo = param.filmNo;
    }
    vQuery.cinemaCode = param.cinemaCode;
    httpRest.postRequest('/home/getTimes', vQuery, success_cb, fail_cb);
}

/**
 * 排片列表
 *
 * @param {*} time 时间
 * @param {*} cinemaCode 影院编码
 * @param {*} success_cb
 * @param {*} fail_cb
 */
function getPlans(param, success_cb, fail_cb) {
    var vQuery = {};
    if (param.filmNo) {
        vQuery.filmNo = param.filmNo;
    }
    vQuery.cinemaCode = param.cinemaCode;
    vQuery.time = param.time;
    httpRest.postRequest('/home/getPlans', vQuery, success_cb, fail_cb);
}
//排期日期
function planDay(filmNo, cinemaCode, success_cb, fail_cb) {
    httpRest.postRequest('/home/getTimes', {
        filmNo: filmNo,
        cinemaCode: cinemaCode
    }, success_cb, fail_cb);
}

function getPlansSeatInfo(featureAppNoList, cinemaCode, success_cb, fail_cb) {
    httpRest.postRequest('/home/getPlansSeatInfo', {
        featureAppNoList: featureAppNoList,
        cinemaCode: cinemaCode
    }, success_cb, fail_cb);
}
module.exports = {
    getTimes: getTimes,
    getPlans: getPlans,
    planDay: planDay,
    getPlansSeatInfo: getPlansSeatInfo
};