//渲染页面主方法
var renderPage = function(){
    getOrderStateCounts(function(orderCountList) {
        var orderStates = {}
        var orderCountTotal = 0;
        $.each(orderCountList, function(i, orderCount){
            orderStates[orderCount.orderState] = orderCount.count;
            orderCountTotal += orderCount.count;
        });
        orderStates["0"] = orderCountTotal;
        $.each($(".ct > ul > li"), function(i, li){
            $(li).children("h3").append("<span> "+orderStates[$(li).attr("orderState")]+"</span>")
        });
    });

    var orderQueryParams = {orderState:0, pageSize:5, curPage:1}
    orderListQuery(orderQueryParams, function(orderProfilePages) {
        var tab_selected = $(".ct").children("ul").children(".select");     //当前激活的tab
        if(orderProfilePages.total == 0) {
            $(".tabItem :eq(" + tab_selected.index() + ")").addClass("noContent");
        } else {
            $(".tabItem :eq(" + tab_selected.index() + ")").html(_hbs_orderProfiles(orderProfilePages));
        }
    })
}

$(function(){
    checkTYLoginStatus($("#ssid").val(), renderPage);
    //checkJFXLoginStatus($("#ssid").val(), renderPage, callbackLogout);
    //绑定tab 页切换事件
    $(".ct").children("ul ").children("li").on("click", function(){
        var tab_selected = $(this);
        var orderQueryParams = {orderState:tab_selected.attr("orderState")/10, pageSize:5, curPage:1}
        orderListQuery(orderQueryParams, function(orderProfilePages) {
            if(orderProfilePages.total == 0) {
                $(".tabItem :eq(" + tab_selected.index() + ")").addClass("noContent");
            } else {
                $(".tabItem :eq(" + tab_selected.index() + ")").html(_hbs_orderProfiles(orderProfilePages));
            }
        });
    });

});



/**
 * 查下个状态下订单数量
 * @param callback
 */
function getOrderStateCounts(callback) {
    $.ajax({
        url: "/buyer/orderStateCount",
        type: 'get',
        data:{ssid:$("#ssid").val()},
        dataType:'json',
        async:true,
        success: function (data) {
            if (data.result) {
                callback(data.orderCountList);
            } else {
                alert(data.failDesc.desc);
            }
        }
    })
}

/**
 * 查下订单列表
 * @param params 需包含订单状态、当前页面、每页数量
 * @param callback
 */
function orderListQuery(params, callback) {
    params["ssid"] = $("#ssid").val();
    $.ajax({
        url: "/buyer/orderList",
        type: 'get',
        data:params,
        dataType:'json',
        async:true,
        success: function (data) {
            if (data.result) {
                callback(data.orderProfilePages);
            } else {
                alert(data.failDesc.desc);
            }
        }
    })
}

/**
 * 买家取消订单
 * @param id
 */
function cancelOrder(id) {
    var params = {};
    params.orderId = id;

    var source   = $("#cacelreason_show_template").html();
    var template = Handlebars.compile(source);
    $("#cancelOrderLayer").html(template(params));
    center("#cancelOrderLayer");
}

/**
 * 提交取消订单验证
 * @param formObj
 * @returns {boolean}
 */
function checkCancelForm(formObj) {
    if (empty($(formObj).find("input[name='refundReason']:checked").val())) {
        alert("请选择取消原因");
        return false;
    }
    if (empty($(formObj).find("input[name='orderId']").val())) {
        alert("订单号不能为空");
        return false;
    }
    $(formObj).attr('action','/order/cancel?ssid='+$("#ssid").val());
    return true;
}

function confirmReceipt(orderId) {
    var action = '/order/confirmReceipt?ssid='+$("#ssid").val();
    var form = $("<form></form>")
    form.attr('action',action)
    form.attr('method','post')
    var inputOrderId = $("<input type='hidden' name='orderId' />")
    inputOrderId.attr('value',orderId)
    form.append(inputOrderId)
    form.appendTo("body")
    form.css('display','none')
    form.submit()
}

function dataSearch(curPage){
    var tab_selected = $(".ct").children("ul").children(".select");     //当前激活的tab
    var orderState = tab_selected.attr("orderState")/10;
    var orderQueryParams = {orderState:orderState, pageSize:5, curPage:curPage}
    orderListQuery(orderQueryParams, function(orderProfilePages) {
        $(".tabItem :eq(" + tab_selected.index() + ")").html(_hbs_orderProfiles(orderProfilePages));
    })
}