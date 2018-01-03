import Countdown from '../../../components/countdown'
const inputUtil = require('../../../util/inputUtil.js')
const modalUtils = require('../../../util/modalUtil.js')
const userRest = require('../../../rest/userRest.js')
const wxRest = require('../../../rest/wxRest.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    curreyTab: 'member',
    phoneNum:'',
    phoneCode:'',
    phonePw:''
  },
  inputNum(e) {
    let value = e.detail.value
    this.setData({
      phoneNum: value
    })
  },
  inputCode(e) {
    let value = e.detail.value
    this.setData({
      phoneCode: value
    })
  },
  inputPw(e) {
    let value = e.detail.value
    this.setData({
      phonePw: value
    })
  },
  tabChang: function (e) {
    if(this.data.phoneNum){
    }
    this.setData({
      curreyTab: e.target.dataset.currey
    });
  },
  confirmLogin: function (params) {
    var that = this;
    var warn = ''
    if (!inputUtil.validatePhoneNum(this.data.phoneNum, true))
      return 0;

    if (!this.data.phonePw || !this.data.phonePw.trim()) {
      warn = "请输入密码";
      modalUtils.showWarnToast(warn);
      return;
    }
    modalUtils.showLoadingToast('登录中')

    //账号登陆
    userRest.login(this.data.phoneNum, this.data.phonePw, function (params) {
      app.setUserInfo(params);
      app.setUserAccount(that.data.phoneNum, that.data.phonePw);
      app.loginPromotion();
      modalUtils.hideLoadingToast()
      wx.navigateBack({
        // delta: 2
      });

    })
    if (!app.getOpenId())
      wxRest.wxLogin(app.globalData.cinemaCode)
  },
  vcode: function () {
    if (!inputUtil.validatePhoneNum(this.data.phoneNum, true))
      return 0;

    if (this.c2 && this.c2.interval) return !1
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

    //请求手机验证码
    userRest.requestMobileVerifyCode('firstLogin', this.data.phoneNum,
      function (res) {
        console.log(' success ' + res);
      }
    );
  },
  confirmCodeLogin: function () {
    if (!inputUtil.validatePhoneNum(this.data.phoneNum, true))
      return 0;
    if (!this.data.phoneCode) {
      var warn = "请输入验证码";
      modalUtils.showWarnToast(warn);
      return;
    }
    modalUtils.showLoadingToast('登录中')

    //手机验证码登录
    userRest.getValidateCode(this.data.phoneNum, this.data.phoneCode, app.globalData.cinemaCode,
      function (res) {
        app.setUserInfo(res);
        app.setUserAccount()
        modalUtils.hideLoadingToast()
        wx.navigateBack({
          delta: 2
        });

      }
    );
    if (!app.getOpenId())
      wxRest.wxLogin(app.globalData.cinemaCode)
  },
  userProtocol :function(){
    wx.navigateTo({
      url: '../protocol/protocol'
    });
  }
})