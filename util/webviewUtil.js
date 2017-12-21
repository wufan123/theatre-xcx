function goto(uri) {
    let url = getApp().globalData.wapServerUrlBase + uri;
    wx.navigateTo({
      url: '../webview/webview?url='+url
    });
}

module.exports = {
    goto: goto
};