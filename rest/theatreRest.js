var httpRest = require('./httpBaseApi.js')
/**
 * 分类字典列表
 * @param {*} sourceType 
 * @param {*} classType 
 */
function getClassList(sourceType, classType, success_cb, fail_cb) {
    httpRest.getTheatreRequest("/classType/list", {
        sourceType: sourceType,
        classType: classType
    }, success_cb, fail_cb)
}

/**
 * 信息列表
 * @param {*} classType 
 */
function getInformationList(classType, success_cb, fail_cb) {
    httpRest.getTheatreRequest("/information/list", {
        classType: classType
    }, success_cb, fail_cb)
}

/**
 * 卖品列表
 * @param {*} classType 
 */
function getGoodsList(classType, success_cb, fail_cb) {
    httpRest.getTheatreRequest("/goods/list", {
        classType: classType
    }, success_cb, fail_cb)
}

/**
 * 套票列表
 * @param {*} classType 
 */
function getPackageList(classType, success_cb, fail_cb) {
    httpRest.getTheatreRequest("/package/list", {
        classType: classType
    }, success_cb, fail_cb)
}

/**
 * 推广用户已登陆
 * @param {*} promoter 推广人手机号
 * @param {*} toer 被推广人手机号
 * @param {*} type 推广类型，1：邀请注册推广，2：场次票推广
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function loginPromotion(promoter, toer, type, success_cb, fail_cb) {
    httpRest.getTheatreRequest("/promotion/scanCode", {
        promoter: promoter,
        toer: toer,
        type: type
    }, success_cb, fail_cb)
}

/**
 * 完成推广（完成订单）
 * @param {*} toer 
 * @param {*} orderId 
 * @param {*} type 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function finishPromotion(toer, orderId, success_cb, fail_cb) {
    httpRest.getTheatreRequest("/promotion/finishPromotion", {
        promoter: promoter,
        toer: toer
    }, success_cb, fail_cb)
}

module.exports = {
    getClassList: getClassList,
    getGoodsList: getGoodsList,
    getPackageList: getPackageList,
    getInformationList: getInformationList,
    loginPromotion: loginPromotion,
    finishPromotion: finishPromotion,
}