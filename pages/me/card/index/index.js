Page({
    data: {
        cardList: []
    },
    onLoad: function (e) {
    },
    addCard: function () {
      wx.navigateTo({
        url: '../addCard/addCard',
      })
    }
})