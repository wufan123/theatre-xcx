/**
 * 影片相关接口
 */
var httpRest = require('./httpBaseApi.js');

/**
 * 广告栏信息
 *
 * @param {*} type 0: banner， 1：广告， 2：购票成功弹窗
 * @param {*} cinemaCode 影院编码
 * @param {*} success_cb
 * @param {*} fail_cb
 */
function getBanner(type, cinemaCode, success_cb, fail_cb) {
    httpRest.postRequest('/home/getBanner', {
        type: type,
        cinemaCode: cinemaCode
    }, success_cb, fail_cb);
}

/**
 * 影片列表
 *
 * @param {*} type 类型，1：热映电影，2：待映电影
 * @param {*} cinemaCode 影院编码
 * @param {*} success_cb
 * @param {*} fail_cb
 */
function getMove(type, cinemaCode, success_cb, fail_cb) {
    httpRest.postRequest('/home/getMove', {
        type: type,
        cinemaCode: cinemaCode
    }, success_cb, fail_cb);
}

function getFilmDetail(filmId, success_cb, fail_cb) {
    httpRest.postRequest('/home/filmDetail', {
        filmId: filmId
    }, success_cb, fail_cb);
}

function follow(filmId, success_cb, fail_cb) {
    httpRest.postRequest('/user/remind', {
        filmId: filmId
    }, success_cb, fail_cb);
}

function unremind(filmId, success_cb, fail_cb) {
    httpRest.getRequest('/user/unremind', {
        filmId: filmId
    }, success_cb, fail_cb);
}

function filmEvaluateList(filmId, success_cb, fail_cb) {
    let timestamp = Date.parse(new Date()) / 1000;
    httpRest.postRequest('/home/filmViews', {
        filmId: filmId,
        refresh: timestamp
    }, success_cb, fail_cb);
}
function filmReplyList(evalauteId, success_cb, fail_cb) {
    httpRest.postRequest('/home/backViews', {
        pid: evalauteId
    }, success_cb, fail_cb);
}

function getSeat(featureAppNo, success_cb, fail_cb) {
    httpRest.postRequest('/home/seat', {
        featureAppNo: featureAppNo
    }, success_cb, fail_cb);
}
//电影关注
function remind(filmId, success_cb, fail_cb) {
    httpRest.getRequest('/user/remind', {
        filmId: filmId
    }, success_cb, fail_cb);
}

module.exports = {
    getBanner: getBanner,
    getMove: getMove,
    getFilmDetail: getFilmDetail, //获取电影详情
    unremind: unremind, //取消关注
    filmEvaluateList: filmEvaluateList, //电影评价列表
    filmReplyList: filmReplyList, //评价回复列表
    getSeat: getSeat, //选座
    remind: remind //关注影片
};