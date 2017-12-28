var httpRest = require('./httpBaseApi.js');

/**
 * 获取套票详情
 * @param {*} id 
 * @param {*} type 	package 套票 alk 爱莱卡
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function getPackageDetail(id, type, success_cb, fail_cb) {
    var params = {
        id: id,
        type: type
    };
    httpRest.getRequest('/package/getPackageDetail', params, success_cb, fail_cb);
}

/**
 * 使用余额支付套票
 * @param {*} orderId 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function packageUseAccount(orderId, success_cb, fail_cb) {
    var params = {
        orderId: orderId
    };
    httpRest.getRequest('/pay/packageUseAccount', params, success_cb, fail_cb);
}

/**
 * 取消使用余额支付套票
 */
function packageCancelAccount(orderId, success_cb, fail_cb) {
    var params = {
        orderId: orderId
    };
    httpRest.getRequest('/pay/packageCancelAccount', params, success_cb, fail_cb);
}

/**
 * 使用积分支付套票
 */
function packageUseIntegral(orderId, success_cb, fail_cb) {
    var params = {
        orderId: orderId
    };
    httpRest.getRequest('/pay/packageUseIntegral', params, success_cb, fail_cb);
}

/**
 * 取消使用积分支付套票
 */
function packageCancelIntegral(orderId, success_cb, fail_cb) {
    var params = {
        orderId: orderId
    };
    httpRest.getRequest('/pay/packageCancelIntegral', params, success_cb, fail_cb);
}

/**
 * 获取可以购买套票的支付方式
 */
function getPackageBuyPayway(orderId, success_cb, fail_cb) {
    var params = {
        orderId: orderId
    };
    httpRest.getRequest('/pay/getPackageBuyPayway', params, success_cb, fail_cb);
}

/**
 * 获取可以购买套票的支付方式
 */
function packagePay(orderId, payType, openId, success_cb, fail_cb) {
    var params = {
        orderId: orderId,
        payType: payType,
        openId: openId
    };
    httpRest.getRequest('/pay/packagePay', params, success_cb, fail_cb);
}

/**
 * 查看套票订单结果
 */
function getPackageOrderStatus(orderId, success_cb, fail_cb) {
    var params = {
        orderId: orderId
    };
    httpRest.getRequest('/pay/getPackageOrderStatus', params, success_cb, fail_cb);
}

/**
 * 创建套票订单
 */
function createOrder(packages, mobile, cinemaCode, success_cb, fail_cb) {
    var params = {
        packages: packages,
        mobile: mobile,
        cinemaCode: cinemaCode
    };
    httpRest.getRequest('/package/createOrder', params, success_cb, fail_cb);
}

module.exports = {
    getPackageDetail: getPackageDetail,
    packageUseAccount: packageUseAccount,
    packageCancelAccount: packageCancelAccount,
    packageUseIntegral: packageUseIntegral,
    packageCancelIntegral: packageCancelIntegral,
    getPackageBuyPayway: getPackageBuyPayway,
    packagePay: packagePay,
    getPackageOrderStatus: getPackageOrderStatus,
    createOrder: createOrder
};