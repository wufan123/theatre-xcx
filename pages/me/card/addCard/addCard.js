const cardRest = require('../../../../rest/cardRest.js')
const modalUtil = require('../../../../util/modalUtil.js')
var app = getApp()
Page({
    data: {
        cardCode: "",
        cardPassword: ""
    },
    bindCardCodeInput: function (e) {
      this.data.cardCode = e.detail.value
      this.setData(this.data)
    },
    bindCardPwdInput: function (e) {
      this.data.cardPassword = e.detail.value
      this.setData(this.data)
    },
    confirm: function () {
        if (!this.data.cardCode) {
            modalUtil.showFailToast("请输入会员卡号")
            return;
        }
        if (!this.data.cardPassword) {
            modalUtil.showFailToast("请输入会员卡密码")
            return;
        }
        modalUtil.showLoadingToast()
        cardRest.setUserBind(app.globalData.cinemaCode, this.data.cardCode, this.data.cardPassword, res => {
            //会员卡过期
            if (res && res.isExpire == 1) {
                modalUtil.hideLoadingToast()
                wx.showModal({
                    title: '温馨提示',
                    content: '会员卡已过期，请拨打'+app.globalData.servicePhone+'进行变更',
                    cancelText: '取消',
                    cancelColor: '#159eec',
                    confirmText: '立刻拨打',
                    confirmColor: '#159eec',
                    showCancel: true,
                    success: function (res) {
                        if (res.confirm) {
                            wx.makePhoneCall({
                                phoneNumber: app.globalData.servicePhone
                            })
                            wx.navigateBack()
                        } else {
                            wx.navigateBack()
                        }

                    },
                    fail: function () {

                    }
                })
                return
            }
            var pages = getCurrentPages();
            
            var prevPage = pages[pages.length - 2]; //上一个页面
            prevPage.addCardSuccess("添加成功！")
            setTimeout(() => {
                wx.navigateBack()
            }, 1000)
        })
    },
    onLoad: function (e) {
    }
})