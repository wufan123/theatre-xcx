Page({
  data: {
    radioList: [
      {
        name: '会员卡：余额￥20.00',
        icon: '../../../assets/images/ticket/member_card_icon.png',
        disabled: true,
        checked: false
      }, {
        name: '微信',
        icon: '../../../assets/images/ticket/wx_icon.png',
        disabled: false,
        checked: true
      }
    ],
  },
  onLoad: function (e) {
  },
  pay: function () {
    wx.redirectTo({
      url: '../payResult/paySuccess/index',
    })
  }
})