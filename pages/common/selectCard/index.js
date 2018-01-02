Page({
  data: {
    cardList:[]
  },
  onLoad: function (e) {
    this.data.cardList = JSON.parse(e.info)
    this.setData(this.data)
  },
  selectClick: function(e) {
    let card = e.currentTarget.dataset.card
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setUseCard(card)
    wx.navigateBack()
  }
})