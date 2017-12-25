//用户登录体系相关接口
var httpRest = require('./httpBaseApi.js');

// 用户信息获取
function getUserInfo(success_cb, fail_cb) {
  httpRest.postRequest('/user/getUserInfo', {}, success_cb, fail_cb)
}

//请求手机验证码
function requestMobileVerifyCode(codeType, userMobile, success_cb, fail_cb) {
  httpRest.postRequest('/service/getValidateCode', {
      userMobile: userMobile,
      codeType: codeType || 'firstLogin'
  }, success_cb, fail_cb);
}

//手机验证码登录
function getValidateCode(userMobile, validateCode, cinemaCode, success_cb, fail_cb) {
  httpRest.postRequest('/user/smsLogin', {
      userMobile: userMobile,
      validateCode: validateCode,
      cinemaCode: cinemaCode
  }, success_cb, fail_cb)
}

//账号登陆
function login(phone, passwd, success_cb, fail_cb) {
  httpRest.postRequest('/user/login', {
      userAccount: phone,
      userPasswd: passwd
  }, success_cb, fail_cb);
}
//注册
function regostered(userMobile, validateCode, userPasswd, cinemaCode, success_cb, fail_cb) {
  httpRest.postRequest('/user/registered', {
      userMobile: userMobile,
      validateCode: validateCode,
      userPasswd: userPasswd,
      cinemaCode: cinemaCode
  }, success_cb, fail_cb);
}

//退出登陆
function logout(success_cb, fail_cb) {
  httpRest.getRequest('/user/logout', {}, success_cb, fail_cb)
}

module.exports = {
  getUserInfo: getUserInfo,
  getValidateCode:getValidateCode,
  requestMobileVerifyCode: requestMobileVerifyCode,
  login:login,
  regostered:regostered,
  logout:logout,
}
