Page({
    data: {
        inputValue: null,
        orderId: null,
        orderType: "film",
        couponList: null,
        selectCount: 0,
        couponType: "film",//优惠券类型 默认卖品 其他film
        hasSelectedList: null,//原本已选中的优惠券
        seatCount: 0,
        canSubmit: false, //是否可以确定
        showHint: false,//是否显示提示
        hintText: 0,
        action:''
    },
    onLoad: function (e) {
    }
})