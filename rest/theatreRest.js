var httpRest = require('./httpBaseApi.js');

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

module.exports = {
    getClassList: getClassList,
    getGoodsList: getGoodsList,
    getPackageList: getPackageList,
    getInformationList: getInformationList
}