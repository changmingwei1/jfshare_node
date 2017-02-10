/**
 * Created by makan on 16/6/22.
 */


var domain = "http://proxy.jfshare.com/manager/"
//根据订单详情页状态渲染商品状态描述
var mapOrderState = {
    "1" : "待支付",
    //"2" : "订单审核中",
    "3" : "待发货",
    "4" : "待收货",
    "5" : "已完成",
    "6" : "已关闭",
    "7" : "退款/售后"
};
Handlebars.registerHelper("showDetailStateDesc", function(order,options) {
    var state = order["orderState"];
    if(order['afterSaleList'] && order['afterSaleList'].length){
        state = 71;
    }
    var mapState = getMapState(state);
    if(state) {
        if(state < 20) {
            //待支付
        } else if(state < 30) {
            //审核中
        } else if(state < 40) {
            //待发货
        } else if(state < 50) {
            //已发货
        } else if(state < 60) {
            //交易成功
        } else if(state < 70) {
            //已关闭
        }
    }
    return new Handlebars.SafeString(mapOrderState[mapState]);
});


//支付方式
Handlebars.registerHelper("payMethod", function(payChannel,options) {
    var str = "";
    if(payChannel == "0"){
        str = "(积分支付)"
    }else if(payChannel == "1"){
        str = "(天翼支付)"
    }else if(payChannel == "2"){
        str = "(支付宝支付)"
    }else if(payChannel == "3"){
        str = "(微信支付)"
    }else if(payChannel == "4"){
        str = "(微信h5支付)"
    }else if(payChannel == "5"){
        str = "(支付宝h5支付)"
    }else if(payChannel == "6"){
        str = "(和包H5支付)";
    }else if(payChannel == "7"){
        str = "(支付宝app支付)"
    }else if(payChannel == "8"){
        str = "(PC端和包)"
    }else if(payChannel == "9"){
        str = "(微信APP支付）"
    }
    return new Handlebars.SafeString(str);

});

//显示现金支付多少
Handlebars.registerHelper("needPay", function(closingPrice,exchangeCash,options) {
    var str = "";
    console.log(closingPrice)
    console.log(exchangeCash)
    if(closingPrice-exchangeCash){
        str = (closingPrice-exchangeCash).toFixed(2)+"元";
    }else{
        str = "0元"
    }
    return new Handlebars.SafeString(str);

});

//订单除了待付款意外的请款
Handlebars.registerHelper("exceptFukuan", function(order,options){
    if(order.orderState >= 30 && order.payChannel == 1){
        return Boolean(true);
    }else{
        return Boolean(false);
    }
});

//如果订单是天翼支付
Handlebars.registerHelper("isTianyi", function(order,options){
    var str = "";
    if(order.thirdPrice == 0){
        str = "全积分支付:"+order.thirdScore+"积分(天翼支付)";
    }else if(order.thirdScore == 0){
        str = "现金支付:"+order.thirdPrice+"元(天翼支付)"
    }else{
        str = "积分+现金支付:"+order.thirdPrice+"元+"+order.thirdScore+"积分"+"    "+"(天翼支付)"
    }
    return new Handlebars.SafeString("<span>"+str+"</span>");
});



function getMapState(state) {
    var mapState;
    if(state < 20) {
        mapState = 1;
    } else if(state >= 20 && state < 30) {
        mapState = 2;
    } else if(state >= 30 && state < 40) {
        mapState = 3;
    } else if(state >= 40 && state < 50) {
        mapState = 4;
    } else if(state >= 50 && state < 60) {
        mapState = 5;
    } else if(state >= 60 && state < 70) {
        mapState = 6;
    }else{
        mapState = 7;
    }
    return mapState;
}
