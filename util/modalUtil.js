function showMsgModal(msg) {
    wx.showModal({
        title: '温馨提示',
        content: msg,
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#159eec',
        showCancel: false,
        success: function (res) {},
        fail: function () {}
    });
}

function showWarnToast(msg) {
    wx.showToast && wx.showToast({
        title: msg,
        image: '/assets/images/warn-toast.png'
    });
}

function showFailToast(msg) {
    wx.showToast && wx.showToast({
        title: msg,
        image: '/assets/images/fail-toast.png'
    });
}

function showSuccessToast(msg) {
    wx.showToast && wx.showToast({
        title: msg,
        icon: "success"
    });
}

function showResError(res) {
    var msg = '未知异常';
    if (res && res.text) msg = res.text;
    showFailToast(msg);
}

function showLoadingToast(msg, mask) {
    if (!msg) msg = '加载中';
    if (!mask) mask = true;
    wx.showLoading && wx.showLoading({
        title: msg,
        mask: mask
    });
}

function hideLoadingToast() {
    wx.hideLoading && wx.hideLoading();
}



function getSystemInfo(success_cb) {
    wx.getSystemInfo && wx.getSystemInfo({
        success: success_cb
    });
}

function showLoginModal() {
  wx.showModal({
    title: '温馨提示',
    content: '您还未登陆，请先登陆后再进行操作哦',
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '立即登陆',
    confirmColor: '#dc3c38',
    success: function (res) {
        if (res.confirm) {
            wx.navigateTo({
                url: '/pages/login/login/login'
            })
        } else {
            // wx.switchTab({
            //     url: '/pages/index/index'
            // })
        }
    },
    fail: function () {

    }
  })
}

module.exports = {
    showWarnToast: showWarnToast,
    showFailToast: showFailToast,
    showLoadingToast: showLoadingToast,
    hideLoadingToast: hideLoadingToast,
    showSuccessToast: showSuccessToast,
    showMsgModal: showMsgModal,
    getSystemInfo: getSystemInfo,
    showResError: showResError,
    showLoginModal
};