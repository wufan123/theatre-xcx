//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    // serverUrlBase: 'https://m.zmaxfilm.com/Api_35',
    serverUrlBase: 'https://premapi.zmaxfilm.com/Api_35',
    
    appAccount: 'zhongruijufang',
    appPasswd: 'zrjf1123',
    appName: '中瑞剧坊',
    appVersion: '1.0.0',
    deviceType: 'weixin-xcx',

    tokenId: null,

  },
  setTokenId: function (tokenId) {
    this.globalData.tokenId = tokenId
    wx.setStorageSync('zmaxfilm_tokenId', tokenId)
  },
  setUserAccount: function (account, passwd) {
    let info
    if (account && passwd)
      info = {
        account: account,
        passwd: passwd
      }
    wx.setStorageSync('zmaxfilm_account', info)
  },
  getUserAccount: function () {
    return wx.getStorageSync('zmaxfilm_account')
  }
})