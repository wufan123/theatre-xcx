//用户订单相关接口

var httpRest = require('./httpBaseApi.js');

//获取我的影片订单
function getAllMoiveOrder(status, page, success_cb, fail_cb) {
  let param = {
    page: page 
  }
  if (status) {
    param.status = status
  }
  httpRest.getRequest('/user/getCinemaOrders', param, success_cb, fail_cb);
}

//影票订单详情
function getCinemaOrderInfo(orderID, success_cb, fail_cb) {
  httpRest.getRequest('/user/getOrderInfo', {
      "orderId": orderID
  }, success_cb, fail_cb)
}

//影票订单详情
function getCinemaOrderFilmDetail(orderID, success_cb, fail_cb) {
  httpRest.getRequest('/user/getOrderFilmDetail', {
      "orderNo": orderID
  }, success_cb, fail_cb)
}

//影票订单详情2
function getOrderPayInfo(orderId, orderType, success_cb, fail_cb) {
  httpRest.getRequest("/user/getOrderPayInfo", {
      "orderId": orderId,
      "orderType": orderType
  }, success_cb, fail_cb)
}

// 卖品订单列表
function getGoodsOrderList(page, success_cb, fail_cb) {
  httpRest.getRequest("/sale/getMyGoods", {page: page}, success_cb, fail_cb)
}

// 卖品订单详情
function getGoodsOrderDetail(orderNo, success_cb, fail_cb) {
  httpRest.getRequest("/sale/getOrderGoodDetail", {
    orderNo: orderNo
  }, success_cb, fail_cb)
}

// 套票订单列表
function getPackageOrderList(success_cb, fail_cb) {
  httpRest.getRequest("/package/getMyOrders", {status: 1}, success_cb, fail_cb)
}

//获取可退订单
function getCinemaOrders(status, page, success_cb, fail_cb) {
  httpRest.getRequest('/user/getCinemaOrders', {
      "status": status,
      "page": page,
  }, success_cb, fail_cb)
}

// 合并影票卖品订单
function mergeOrder(filmOrderId, goodsOrderId, mobile, success_cb, fail_cb) {
  httpRest.postRequest('/user/mergeOrder', {
    filmOrderId: filmOrderId,
    goodsOrderId: goodsOrderId,
    mobile: mobile
  }, success_cb, fail_cb);
}

//退票
function backTieck(orderId, success_cb, fail_cb) {
  httpRest.getRequest("/user/backTieck", {
      orderCode: orderId
  }, success_cb, fail_cb)
}

/**
 * 获取退票支付能用的支付方式
 * @param {*} orderId 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function changeFilmOrderGetBuyWay(orderId, success_cb, fail_cb) {
  httpRest.getRequest("/pay/changeFilmOrderGetBuyWay", {
      orderId: orderId
  }, success_cb, fail_cb)
}

//退票状态查询
function getBackFilmStatus(orderId, success_cb, fail_cb) {
  httpRest.getRequest("/pay/getBackFilmStatus", {
      orderId: orderId
  }, success_cb, fail_cb)
}

/**
 * 座位信息接口
 * 
 * @param {*} featureAppNo 	排期编码
 */
function getSeat(featureAppNo,cinemaCode, success_cb, fail_cb) {
  var params = {
    cinemaCode:cinemaCode,
    featureAppNo: featureAppNo
  }
  params.refresh = new Date().getTime()
  httpRest.postRequest('/home/seat', params, success_cb, fail_cb)
}

function setPlanAndGoodsOrder(info, success_cb, fail_cb) {
  httpRest.postRequest('/user/setPlanAndGoodsOrder', info, success_cb, fail_cb)
}

/**
 * 获取当前订单可使用的优惠券，卡券等信息
 * @param {*} cinemaCode 
 * @param {*} orderId 
 * @param {*} orderType 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function getOrderPayWay(cinemaCode, orderId, orderType, success_cb, fail_cb) {
  let params = {
    cinemaCode: cinemaCode,
    orderType: orderType
  }
  if (orderId) {
    params.orderId = orderId
  }
  httpRest.getRequest('/user/getOrderPayWay', params, success_cb, fail_cb)
}  

/**
 * 取消订单
 */
function cancelOrder(orderid, success_cb, fail_cb) {
  httpRest.getRequest("/user/cancelOrder", {
    orderid: orderid
  }, success_cb, fail_cb)
}


/**
 * 提交第一步确认支付 包含一起使用电影优惠券跟卖品券 会员卡
 * @param {*} cinemaCode 
 * @param {*} orderId 
 * @param {*} orderType 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function getOrderPayLock(cinemaCode, orderId, orderType, cardId, couponCode, success_cb, fail_cb) {
  var param = {
    cinemaCode: cinemaCode,
    orderId: orderId,
    orderType: orderType,
  }
  if (cardId)
    param.cardId = cardId
  if (couponCode)
    param.couponCode = couponCode
  httpRest.getRequest('/user/getOrderPayLock', param, success_cb, fail_cb)
}

/**
 * 支付接口
 * @param {*} orderId 
 * @param {*} orderType 
 * @param {*} payType 
 * @param {*} integralNum 
 */
function goodsAndFilmComfirmNewPay(orderId, orderType, payType, integralNum, openId, success_cb, fail_cb) {
  var params = {
    orderId: orderId,
    orderType: orderType,
    payType: payType
  }
  if (openId)
    params.openId = openId
  if (integralNum && integralNum > 0)
    params.integralNum = integralNum
  httpRest.getRequest('/user/goodsAndFilmComfirmNewPay', params, success_cb, fail_cb)
}

function getOrderStatus(orderid, success_cb, fail_cb) {
  httpRest.getRequest("/user/getOrderStatus", {
    orderid: orderid
  }, success_cb, fail_cb)
}

/**
 * 添加票券
 * @param {*} voucherNum 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function addVoucher(voucherNum, success_cb, fail_cb) {
  httpRest.getRequest('/user/addVoucher', {
    voucherNum: voucherNum,
  }, success_cb, fail_cb)
}


/**
 * 获取票券列表
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function userVoucherList(page, success_cb, fail_cb) {
  httpRest.getRequest('/user/userVoucherList',{
    page: page
  }, success_cb, fail_cb)
}

/**
 * 获取优惠券详情
 */
function userVoucherDetail(voucherNum, cinemaCode, success_cb, fail_cb) {
  httpRest.getRequest('/user/userVoucherDetail', {
    voucherNum: voucherNum,
    cinemaCode: cinemaCode
  }, success_cb, fail_cb)
}

/**
 * 解绑票券
 * @param {*} voucherNum 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function userVoucherDelete(voucherNum, success_cb, fail_cb) {
  httpRest.getRequest('/user/delvoucher', {
    voucherNum: voucherNum
  }, success_cb, fail_cb)
}

/**
 * 退票支付手续费
 * @param {*} orderId 
 * @param {*} payType 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function changeFilePay(orderId, payType, openId, success_cb, fail_cb) {
  httpRest.getRequest("/pay/changeFilmPay", {
      orderId: orderId,
      payType: payType,
      openId: openId
  }, success_cb, fail_cb)
}

/**
 * 修改订单手机
 */
function updateOrderMobile(mobile, success_cb, fail_cb) {
  httpRest.postRequest('/user/updateOrderFilmMobile', {
      mobile: mobile
  }, success_cb, fail_cb)
}

module.exports = {
  getCinemaOrderInfo:getCinemaOrderInfo,
  getCinemaOrderFilmDetail: getCinemaOrderFilmDetail,
  getAllMoiveOrder: getAllMoiveOrder,
  getSeat,
  getOrderPayInfo:getOrderPayInfo,
  setPlanAndGoodsOrder,
  getCinemaOrders:getCinemaOrders,
  backTieck:backTieck,
  getBackFilmStatus:getBackFilmStatus,
  getOrderPayWay,
  cancelOrder,
  getOrderPayLock,
  goodsAndFilmComfirmNewPay,
  getOrderStatus,
  addVoucher,
  userVoucherList,
  userVoucherDetail,
  changeFilmOrderGetBuyWay,
  changeFilePay,
  mergeOrder,
  updateOrderMobile,
  userVoucherDelete,
  getGoodsOrderList,
  getGoodsOrderDetail,
  getPackageOrderList
}