var app = getApp()

Page({
  data: {
    cardList:[]
  },
  onLoad: function (e) {
    if (e.pageData==1) {
      this.data.cardList = app.getPageData()
    }
    this.setData(this.data)
  },
  selectClick: function(e) {
    let card = e.currentTarget.dataset.card
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if (card._selected) {
      prevPage.setUseCard(null)
    } else {
      prevPage.setUseCard(card)
    }
    wx.navigateBack()
  }
})