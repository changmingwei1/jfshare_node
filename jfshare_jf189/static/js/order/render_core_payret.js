/**
 * Created by lenovo on 2015/10/12.
 */
//页面设定参数

/**
 * 渲染页面数据入口
 */
$(function() {
    rendData();
});

/**
 * 异步渲染页面各模块动态数据
 */
function rendData() {
    renderGuide();
    renderPayRet();
}

/**
 * 渲染导购提示
 */
function renderGuide() {
    var fromBatchTip="";
    //if (empty(fromBatch) || fromBatch == "1") {
        fromBatchTip = "选购";
    //} else {
    //    fromBatchTip = "我的购物车";
    //}
    var source   = $("#guide_show_template").html();
    var template = Handlebars.compile(source);
    $("#guidePanel").html(template({"fromBatchTip":fromBatchTip}));
}

function renderPayRet() {
    var source   = $("#pay_ret_template").html();
    var template = Handlebars.compile(source);
    Handlebars.registerHelper('self_order_url',function() {
        return "/buyer/myOrders";
    });
    $("#payRetPanel").html(template(payret));
}