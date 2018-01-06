const cardRest = require('../../../../rest/cardRest.js')
const modalUtil = require('../../../../util/modalUtil.js')
const timeUtil = require('../../../../util/timeUtil.js')
const app = getApp()
Page({
    data: {
        cardList: []
    },
    onLoad: function (e) {
    },
    fetchData: function () {
      cardRest.getCardInfo(res => {
        modalUtil.hideLoadingToast()
        var today = new Date()
        for (var i = 0; i < res.length; i++) {
          res[i]._expireDate = timeUtil.formatTime(timeUtil.getLocalTime(res[i].expireDate * 1000), "yyyy-mm-dd").displayedDate
        }
        this.data.cardList = res
        this.setData(this.data)
      })
    },
    addCard: function () {
      wx.navigateTo({
        url: '../addCard/addCard',
      })
    },
    deleteCardEvent: function (e) {
      console.log('asdfasd')
      var card = e.target.dataset.card
      wx.showModal({
        title: '提示',
        content: '确定要解绑会员卡：' + card.cardNumber,
        success: res => {
          if (res.confirm) {
            this.deleteCard(card)
          } else if (res.cancel) {
  
          }
        }
      })
    },
    addCardSuccess: function (showInfo) {
      if (showInfo) {
        modalUtil.showSuccessToast(showInfo)
      }
      setTimeout(() => {
        this.fetchData()
      }, 1000)
  
    },
    deleteCard: function (card) {
      modalUtil.showLoadingToast()
      cardRest.setUserUnbind(card.id, 1, res => {
        modalUtil.hideLoadingToast()
        modalUtil.showSuccessToast("已成功解绑会员卡")
        this.removeCard(card)
      })
    },
    removeCard: function (card) {
      if (!card || !this.data.cardList)
        return
      for (var i = 0; i < this.data.cardList.length; i++) {
        if (card.id == this.data.cardList[i].id)
          this.data.cardList.splice(i, 1)
      }
      this.setData(this.data)
    },
    recharge: function (e) {
      app.setPageData(e.currentTarget.dataset.card)
      wx.navigateTo({
        url: '../recharge/recharge?pageData=1',
      })
    },
    onLoad() {
      modalUtil.showLoadingToast()
      this.fetchData()
    },
})