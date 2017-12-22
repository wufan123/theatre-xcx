/**
 * 卖品相关接口
 */
var httpRest = require('./httpBaseApi.js')


/**
 * 获取卖品列表
 * @param {*} cinemaCode 影院编码
 */
function getGoodsList(cinemaCode, success_cb, fail_cb) {
  httpRest.getRequest('/home/getCinemaGoods', {
    cinemaCode: cinemaCode,
  }, success_cb, fail_cb)
}

/**
 * 获取卖品详情
 */
function getGoodsDetail(goodsId, success_cb, fail_cb) {
  httpRest.getRequest('/home/getCinemaGoodsDetail', {
    goodsId: goodsId,
  }, success_cb, fail_cb)
}
/**
 * 生成卖品订单
 * @param {*} cinemaCode 
 * @param {*} phoneNum 
 * @param {*} goods 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function createGoodsOrder(cinemaCode, phoneNum, goods, success_cb, fail_cb) {
  httpRest.getRequest('/sale/setCinemaOrder', {
    cinemaCode: cinemaCode,
    mobile: phoneNum,
    goods: goods
  }, success_cb, fail_cb)
}

/**
 * 生成卖品&影票订单
 * @param {*} cinemaCode 
 * @param {*} phoneNum 
 * @param {*} goods 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function createGoodsFilmOrder(cinemaCode, phoneNum, goods, orderId, success_cb, fail_cb) {
  httpRest.getRequest('/sale/setCinemaOrder', {
    cinemaCode: cinemaCode,
    mobile: phoneNum,
    goods: goods,
    orderId: orderId
  }, success_cb, fail_cb)
}

/**
 * 生成套票订单
 * @param {*} cinemaCode 
 * @param {*} phoneNum 
 * @param {*} packages 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function createComboOrder(cinemaCode, phoneNum, packages, success_cb, fail_cb) {
  httpRest.getRequest('/package/createOrder', {
    cinemaCode: cinemaCode,
    mobile: phoneNum,
    packages: packages
  }, success_cb, fail_cb)
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
  httpRest.getRequest('/user/getOrderPayWay', {
    cinemaCode: cinemaCode,
    orderId: orderId,
    orderType: orderType
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
 * 提交第一步确认支付 包含一起使用电影优惠券跟卖品券 会员卡
 * @param {*} cinemaCode 
 * @param {*} orderId 
 * @param {*} orderType 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function getPackageBuyPayway(orderId, success_cb, fail_cb) {
  var param = {
    orderId: orderId
  }
  httpRest.getRequest('/pay/getPackageBuyPayway', param, success_cb, fail_cb)
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
 * 使用票券
 * @param {*} orderId 
 * @param {*} voucherNum 
 * @param {*} type //	类型film：影票;goods：卖品;
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function useVoucher(orderId, voucherNum, type, success_cb, fail_cb) {
  httpRest.getRequest('/user/useVoucher', {
    voucherNum: voucherNum,
  }, success_cb, fail_cb)
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

function getPackagesList(cinemaCode, success_cb, fail_cb) {
  var params = {
    cinemaCode: cinemaCode
  }
  httpRest.getRequest('/package/getPackagesList', params, success_cb, fail_cb)
}

/**
 * 获取卖品订单状态
 * @param {*} orderId 
 */
function getGoodsStatus(orderId, success_cb, fail_cb) {
  var params = {
    orderId: orderId
  }
  httpRest.getRequest('/sale/getGoodsStatus', params, success_cb, fail_cb)
}

/**
 * 修改订单电话号码
 * @param {*} orderId 
 * @param {*} phone 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function updateGoodsOrder(orderId, phone, success_cb, fail_cb) {
  var params = {
    orderCode: orderId,
    mobile: phone,
  }
  httpRest.getRequest('/user/updateOrderFilmMobile', params, success_cb, fail_cb)
}

/**
 * 获取抢购卖品列表
 * @param {*} cinemaCode
 * @param {*} success_cb
 * @param {*} fail_cb
 */
function getBuyingGoods(cinemaCode, success_cb, fail_cb) {
  var params = {
    cinemaCode: cinemaCode
  }
  httpRest.getRequest('/Buying/getBuyingGoods', params, success_cb, fail_cb)
}

/**
 * 抢购卖品下单
 * @param {*} panicbuyingId 活动id
 * @param {*} orderNumber 抢购数量
 * @param {*} success_cb
 * @param {*} fail_cb
 */
function createBuyingOrder(panicbuyingId, orderNumber, success_cb, fail_cb) {
  var params = {
    panicbuyingId: panicbuyingId,
    number: orderNumber
  }
  httpRest.getRequest('/Sale/setCinemaBuyingOrderNew', params, success_cb, fail_cb)
}

module.exports = {
  getGoodsList: getGoodsList,
  createGoodsOrder: createGoodsOrder,
  getOrderPayWay: getOrderPayWay,
  getOrderPayLock: getOrderPayLock,
  addVoucher: addVoucher,
  useVoucher: useVoucher,
  goodsAndFilmComfirmNewPay: goodsAndFilmComfirmNewPay,
  getPackagesList: getPackagesList,
  createComboOrder: createComboOrder,
  getPackageBuyPayway: getPackageBuyPayway,
  getGoodsStatus: getGoodsStatus,
  createGoodsFilmOrder: createGoodsFilmOrder,
  getGoodsDetail: getGoodsDetail,
  updateGoodsOrder: updateGoodsOrder,
  getBuyingGoods: getBuyingGoods,
  createBuyingOrder: createBuyingOrder
}