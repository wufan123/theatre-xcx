//用户会员卡相关接口
var httpRest = require('./httpBaseApi.js');

// 会员卡列表
function getCardInfo(success_cb, fail_cb) {
  httpRest.getRequest("/user/getCardInfo", {
  }, success_cb, fail_cb)
}
//绑定会员卡
function setUserBind(cinemaCode, cardCode, cardPwd, success_cb, fail_cb) {
  httpRest.getRequest("/user/setUserBind", {
      cardNumber: cardCode,
      cardPassword: cardPwd,
      cinemaCode: cinemaCode
  }, success_cb, fail_cb)
}
// 解绑会员卡  type 	1 实体卡 2爱莱卡
function setUserUnbind(id, type, success_cb, fail_cb) {
   httpRest.getRequest("/user/setUserUnbind", {
       id: id,
       type: type
   }, success_cb, fail_cb)
}
// 充值
function recharge(amount, cinemaCode,cardId,payType,openId, success_cb, fail_cb) {
  httpRest.getRequest("/user/recharge", {
    rechargeAmount: amount,
    payType:payType,
    cinemaCode: cinemaCode,
    cardId:cardId,
    openId:openId
  }, success_cb, fail_cb)
}

module.exports = {
  getCardInfo:getCardInfo,
  setUserBind:setUserBind,
  setUserUnbind:setUserUnbind,
  recharge:recharge
}