/**
 * Created by lenovo on 2015/11/10.
 */

function getOrderStateBuyerEnum(orderState) {
    if (empty(orderState)) {
        return "";
    }
    var state = Number(orderState);
    if (state >= 10 && state < 20) {
        return "待支付";
    } else if (state >= 20 && state < 40) {
        return "待发货";
    } else if (state >= 40 && state < 50) {
        return "待收货";
    } else if (state == 50) {
        return "待评论";
    } else if (state >= 51 && state < 60) {
        return "已完成";
    } else if (state >= 60 && state < 70) {
        return "已取消";
    }

    return "";
}

function isWaitPayState(orderState) {
    if (empty(orderState)) {
        return false;
    }
    var state = Number(orderState);
    if (state >= 10 && state < 20) {
        return true;
    }

    return false;
}

function getPayChannelEnum(payChannel) {
    if (empty(payChannel)) {
        return "";
    }
    var state = Number(payChannel);
    if (payChannel == 1) {
        return "天翼支付";
    }

    return "";
}
