var modalUtils = require('modalUtil.js');
/**
  * 手机号合法性判断
  * @params phoneNum
  */
function validatePhoneNum(phoneNum, toast) {
  if (!phoneNum || phoneNum.length == 0) {
    if (toast) {
      var warn = "请输入手机号！";
      modalUtils.showWarnToast(warn);
    }
    return false;
  }
  if (phoneNum.length != 11) {
    if (toast) {
      var warn = "手机号长度有误！";
      modalUtils.showWarnToast(warn);
    }
    return false;
  }
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!myreg.test(phoneNum)) {
    if (toast) {
      var warn = "手机号有误！";
      modalUtils.showWarnToast(warn);
    }
    return false;
  }
  return true;
}

module.exports = {
  validatePhoneNum: validatePhoneNum
}

