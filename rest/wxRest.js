var httpRest = require('./httpBaseApi.js')
var app = getApp()
//调用微信支付
function requestWxPay(weixinpay, complete_cb, success_cb, fail_cb) {
  console.log(weixinpay)
  wx.requestPayment({
    'timeStamp': weixinpay.timeStamp + '',
    'nonceStr': weixinpay.nonceStr,
    'package': weixinpay.package,
    'signType': 'MD5',
    'paySign': weixinpay.paySign + '',
    'complete': complete_cb,
    'success': success_cb,
    'fail': fail_cb
  })
}

function getOpenId(wxCode, cinemaCode) {
  var params = {
    cinemaCode: cinemaCode,
    code: wxCode
  }
  function success_cb(res) {
    app.setOpenId(res.openId)
  }
  function fail_cb() {

  }
  httpRest.getRequest('/user/getWeixinOpenId', params, success_cb, fail_cb)
}

function wxLogin(cinemaCode) {
  var KThis = this
  function success(weixinResult) {
    console.log("微信登陆 success", weixinResult)
    KThis.getOpenId(weixinResult.code, cinemaCode)
  }
  function fail(res) {
    console.log("微信登陆 fail_cb", res)
  }
  wx.login({
    'success': success,
    'fail': fail
  })
}

module.exports = {
  requestWxPay: requestWxPay,
  wxLogin: wxLogin,
  getOpenId: getOpenId
}
