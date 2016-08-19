/**
 * Created by lenovo on 2015/10/12.
 */
//页面设定参数
var orderDetail = null;

/**
 * 渲染页面数据入口
 */
$(function() {
    renderData();
});

/**
 * 异步渲染页面数据
 */
function renderData() {
    $.ajax({
        url: "/buyer/orderDetail?ssid="+ssid+"&orderId=" + orderId,
        type: 'get',
        //async: false,
        success: function (data) {
            if(data.result){
                orderDetail = data.order;
                renderOrder();
                renderOrderInfo();
                renderTotal();
                renderSellerInfo();
                renderExpressTrace();
            }
        }
    })
}

/**
 * 渲染订单基本信息
 */
function renderOrder() {
    $("#myOrderPanel").html(_hbs_order(orderDetail));
}

function renderOrderInfo() {
    $("#myOrderInfoPanel").html(_hbs_orderInfo(orderDetail));
}

/**
 * 渲染结算信息
 */
function renderTotal() {
    if(empty(orderDetail.orderId)) {
        return;
    }
    var source = $("#order_bottom_template").html();
    var template = Handlebars.compile(source);
    $("#bottomPanel").html(template(orderDetail));
}

/**
 * 渲染卖家信息
 * @param orderData
 */
function renderSellerInfo() {
    if (empty(orderDetail)) {
        return;
    }
    var sellerIds = {};
    sellerIds[orderDetail.sellerId] = orderDetail.sellerId;
    if (!empty(sellerIds)) {
        $.ajax({
            url: "/seller/infos?sellerIds=" + JSON.stringify(sellerIds),
            type: 'get',
            //data: JSON.stringify(sellerIds),
            dataType: "json",
            success: function (ret) {
                if (ret.status == 200) {
                    if (!empty(ret.data)) {
                        $('span[id^="seller_"]').each(function () {
                            var s_id = this.id;
                            try {
                                var sellerId = s_id.substr(7, s_id.length);
                                if (!empty(ret.data[sellerId])) {
                                    var sellerName = ret.data[sellerId].seller.sellerName;
                                    $(this).attr("title", sellerName);
                                    $(this).find("a").find("span").text(sellerName);
                                }
                            } catch (err) {
                            }
                        });
                    }
                }
            }
        });
    }
}

function renderExpressTrace(){
    if(!orderDetail.deliverTime) {
        return;
    }

    var params = {
        orderId:orderDetail.orderId,
        comId:orderDetail.deliverInfo.expressId,
        num:orderDetail.deliverInfo.expressNo,
        queryType:3,
        ssid:$("#ssid").val()
    }

    $.ajax({
        url: "/order/expressInfoAndTrace",
        type: 'post',
        data: params,
        dataType:'json',
        async:true,
        success: function (data) {
            if (data.result) {
                var traceHtml = "<ul>";
                $.each(data.expressTrace.traceItems, function(i, traceItem){
                    traceHtml += "<li>[" + traceItem["ftime"] + "]&nbsp;&nbsp;" + traceItem["context"] + "</li>";
                });
                traceHtml += "</ul>";
                var listSettings = {content:traceHtml,
                        title:'',
                        padding:true
                    };
                var settings = {
                    trigger:'click',
                    title:'物流详情',
                    content:'',
                    width:500,
                    multi:true,
                    closeable:false,
                    style:'',
                    delay:300,
                    padding:true
                };
                $('a.express-trace').webuiPopover('destroy').webuiPopover($.extend({},settings,listSettings));
            }
        }
    })
}

