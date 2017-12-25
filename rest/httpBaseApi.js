var app = getApp()
var modalUtils = require('../util/modalUtil.js')
var signUtil = require('../util/signUtil.js')


/**
 * 请求结果处理
 * 
 * @param {*} res 响应数据
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function responseCallback(res, success_cb, fail_cb) {
    if (res.statusCode == 200 && res.data.status == 0) {
        if (success_cb == null) {
            return
        }
        success_cb(res.data.data)
    } else {
        if (fail_cb == null) {
            return
        }
        if (typeof res.data == 'object') {
            fail_cb(res.data)
        } else {
            fail_cb({
                status: '-1',
                data: '',
                text: res.data
            })
        }
    }
}

/**
 * HTTP GET 基础请求
 * 
 * @param {*} uri 请求基础地址
 * @param {*} params 请求参数
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function httpGet(uri, params, success_cb, fail_cb) {
    wx.request({
        url: app.globalData.serverUrlBase + uri,
        data: params,
        header: {
            'content-type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
            responseCallback(res, success_cb, fail_cb)
        },
        fail: function () {
            let res = {
                status: '-1',
                data: '',
                text: '网络请求失败'
            }
            fail_cb && fail_cb(res)
        }
    })
}

/**
 * HTTP POST 基础请求
 * 
 * @param {*} uri 请求基础地址
 * @param {*} params 请求参数
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function httpPost(uri, params, success_cb, fail_cb) {
    wx.request({
        url: app.globalData.serverUrlBase + uri,
        data: params,
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
            responseCallback(res, success_cb, fail_cb)
        },
        fail: function () {
            let res = {
                status: '-1',
                data: '',
                text: '网络请求失败'
            }
            fail_cb && fail_cb(res)
        }
    })
}

function getSign(params, tokenId) {
    if (params) {
        params.tokenId = tokenId
    }
    return signUtil.getSign(params)
}

/**
 * 获取会话ID
 * 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function getToken(success_cb, fail_cb) {
    let params = { // 先添加测试环境标识，发布的时候去掉
        appAccount: app.globalData.appAccount,
        appPasswd: app.globalData.appPasswd,
        appVersion: app.globalData.appVersion,
        deviceNumber: '',
        deviceType: app.globalData.deviceType,
        // tokenId: app.globalData.tokenId
        // sign: ''
    }
    httpPost('/huoying/service/getToken?sign=' + getSign(params,app.globalData.tokenId), params, success_cb, fail_cb)
}

/**
 * 业务通用处理
 * 
 * @param {*} requestRest 
 * @param {*} uri 
 * @param {*} params 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function businessRest(requestRest, uri, params, success_cb, fail_cb, isAgain) {
    if (fail_cb == null) {
        //1  modalUtils.hideLoadingToast()
        fail_cb = function (res) {
            modalUtils.hideLoadingToast()
            wx.stopPullDownRefresh()
            //此错误码是未登陆
            modalUtils.showFailToast(res.text || '未知异常')
        }
    }
    function tokenSuccess(res) {
        app.setTokenId(res.tokenId)
        var requestUri = uri + '?tokenId=' + res.tokenId + "&sign=" + getSign(params, res.tokenId)// 先添加测试环境标识，发布的时候去掉
        requestRest(requestUri, params, success_cb, businessSuccProc)
    }
    function tokenFail(res) {
        fail_cb(res)
    }
    function businessSuccProc(res) {
        if (res.status == '10001') { // 令牌失效
            getToken(tokenSuccess, tokenFail)
        } else if (res.status == '20001') {
            let account = app.getUserAccount()
            //如果有使用账号密码登陆，并且第一次重试
            if (account && !isAgain) {
                //modalUtils.showLoadingToast("自动登陆,请稍后...")
                postRequest('/huoying/user/login', {
                    userAccount: account.account,
                    userPasswd: account.passwd
                }, res => {
                    console.log('登陆成功。。。。')
                    businessRest(requestRest, uri, params, success_cb, fail_cb, true)
                }, err => {
                    modalUtils.hideLoadingToast()
                    wx.stopPullDownRefresh()
                    modalUtils.showLoginModal()
                })
            } else {
                modalUtils.hideLoadingToast()
                wx.stopPullDownRefresh()
                modalUtils.showLoginModal()
            }

            //fail_cb(res)
        } else {
            fail_cb(res)
        }
    }
    if (app.globalData.tokenId == null || app.globalData.tokenId == '') {
        app.globalData.tokenId = wx.getStorageSync('zmaxfilm_tokenId')
    }
    if (app.globalData.tokenId == null || app.globalData.tokenId == '') {
        getToken(tokenSuccess, tokenFail)
        return
    }
    var requestUri = uri + '?tokenId=' + app.globalData.tokenId + "&sign=" + getSign(params, app.globalData.tokenId) // 先添加测试环境标识，发布的时候去掉
    requestRest(requestUri, params,success_cb,businessSuccProc )
}

/**
 * 业务 GET 请求
 * 
 * @param {*} uri 
 * @param {*} params 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function getRequest(uri, params, success_cb, fail_cb) {
    businessRest(httpGet, "/huoying" + uri, params, success_cb, fail_cb)
}

/**
 * 业务 POST 请求
 * 
 * @param {*} uri 
 * @param {*} params 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function postRequest(uri, params, success_cb, fail_cb) {
    businessRest(httpPost, "/huoying" + uri, params, success_cb, fail_cb)
}

/**
 * 剧坊服务接口
 * @param {*} uri 
 * @param {*} params 
 * @param {*} success_cb 
 * @param {*} fail_cb 
 */
function getTheatreRequest(uri, params, success_cb, fail_cb) {
    businessRest(httpGet, "/theatre" + uri, params, success_cb, fail_cb)
}

module.exports = {
    postRequest: postRequest,
    getRequest: getRequest,
    getTheatreRequest: getTheatreRequest
}