import Countdown from '../../../components/countdown'
const userRest = require('../../../rest/userRest.js')
const inputUtil = require('../../../util/inputUtil.js')
var modalUtils = require('../../../util/modalUtil.js');
var app = getApp()

Page({
  data: {
    phoneCode: ''
  },
  inputNum(e) {
    console.log(e)
    let value = e.detail.value
    console.log(value)
    this.setData({
      phoneNum: value
    })
  },
  inputCode(e) {
    let value = e.detail.value
    console.log(value)
    this.setData({
      phoneCode: value
    })
  },
  inputPw(e) {
    let value = e.detail.value
    console.log(value)
    this.setData({
      phonePw: value
    })
  },
  inputPw2(e) {
    let value = e.detail.value
    console.log(value)
    this.setData({
      phonePw2: value
    })
  },
  confirmRegister: function () {
    if (!inputUtil.validatePhoneNum(this.data.phoneNum, true))
      return 0;
    if (!this.data.phoneCode) {
      var warn = "请输入验证码";
      modalUtils.showWarnToast(warn);
      return;
    }
    if (!this.data.phonePw || !this.data.phonePw.trim()) {
      warn = "请输入密码";
      modalUtils.showWarnToast(warn);
      return;
    }
    if (!this.data.phonePw2 || !this.data.phonePw2.trim()) {
      warn = "请输入确认密码";
      modalUtils.showWarnToast(warn);
      return;
    }
    if(this.data.phonePw!==this.data.phonePw2){
      warn = "两次密码不一致";
      modalUtils.showWarnToast(warn);
      return;
    }

    modalUtils.showLoadingToast('登录中')

    //注册
    userRest.regostered(this.data.phoneNum, this.data.phoneCode, this.data.phonePw, app.globalData.cinemaCode,
      function (res) {
        modalUtils.hideLoadingToast()
        wx.navigateBack({
          //delta: 2
        });
      }
    );

  },
  initCountDown(){
    this.c2 = new Countdown({
      date: +(new Date) + 60000,
      onEnd() {
        this.setData({
          c2: '获取验证码',
        })
      },
      render(date) {
        const sec = this.leadingZeros(date.sec, 2) + ' s'
        date.sec !== 0 && this.setData({
          c2: sec,
        })
      },
    })
  },
  vcode: function () {
    if (!inputUtil.validatePhoneNum(this.data.phoneNum, true))
      return 0;

    if (this.c2 && this.c2.interval) return !1

    //请求手机验证码
    userRest.requestMobileVerifyCode('register', this.data.phoneNum,
       (res)=> {
        this.initCountDown()
        console.log(' success ' + res);
      });
  },
  userProtocol :function(){
    wx.navigateTo({
      url: '../mobileProtocol/mobileProtocol'
    });
  }
})