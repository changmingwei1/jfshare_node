/**
 * Created by lenovo on 2015/10/12.
 */
//页面设定参数
var listUrl = null;
/**
 * 渲染页面数据入口
 */
$(function() {
    listUrl = "/buyer/orderList?tabState="  + $("#tabState").val();
    renderOrderNavInit();
    navClientEvent();
});

function queryOrderList(url) {
    //var queryParam = {"orderTabState": orderTabState};
    $.ajax({
        url: url, // + JSON.stringify(queryParam),
        type: 'get',
        async: false,
        success: function (data) {
            //alert(userId);
            //alert(data.nodeNowTime);
            renderOrderList(data);
            initCountDownTime1();
            renderOrderPage(data);
            renderSellerInfo(data);
        }
    })
}

/**
 * 渲染页签
 */
function renderOrderNavInit() {
    var source   = $("#nav_show_template").html();
    var template = Handlebars.compile(source);
    $("#myOrderNavPanel").html(template());
    $("#orderListMenu").find("a").each(function () {
        //alert("cur=" + $(this).attr("url") + ",listurl=" + listUrl);
        if ($(this).attr("url") == listUrl) {
            $(this).parent().addClass("cur");
            //alert($(this.parent).html());
        }
    });

}

/**
 * 渲染列表
 * @param orderData
 */
function renderOrderList(orderData) {
    if (empty(orderData)) {
        orderData = "";
    }
    var source   = $("#list_show_template").html();
    var template = Handlebars.compile(source);
    Handlebars.registerHelper('self_product_url',function(val1) {
        return empty(val1) ? "javascript:;" :  "/product/" + val1;
    });
    Handlebars.registerHelper('self_product_snap_url',function(val1) {
        return empty(val1) ? "javascript:;" :  "/product/snapshot/" + val1;
    });
    Handlebars.registerHelper('self_pic_url',function(val1) {
        return empty(val1) ? "javascript:;" : img_bath + getZoomImg(val1, "90x90");
    });
    //订单多商品rowSpan
    Handlebars.registerHelper('self_product_size',function(val1) {
        return empty(val1) ? 1 : val1.length;
    });
    //控制订单1+N的<td>个数
    Handlebars.registerHelper('self_if_index_check', function(v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    //倒计时参数， date from string to long  1447060518532,1447060538532
    Handlebars.registerHelper('self_time_count_param',function(val1, val2) {
        var timeParam = "";
        try {
            var time0 = new Date(val1).getTime();
            var time1 =  GetTimeByTimeStr(val2).getTime();
            timeParam = time0+","+time1;
        } catch (err) {

        }
        //alert(timeParam);
        return timeParam;
    });
    Handlebars.registerHelper('self_order_state_enum',function(val1) {
        return getOrderStateBuyerEnum(val1);
    });
    Handlebars.registerHelper('self_if_wait_pay', function(v1, options) {
        if(isWaitPayState(v1)) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    //在父级循环对象中添加一个_index属性，用来保存父级每次循环的索引，因为索引本身不支持相对路径
   Handlebars.registerHelper("self_keep_index",function(index){
       this._index = index;
      //返回+1之后的结果
      return this._index;
   });
   //无数据时显示
    Handlebars.registerHelper('self_blank_rows', function(orderProfileList, options) {
        if(empty(orderProfileList)) {
            //alert("无数据");
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('self_sku_desc',function(val1) {
        return empty(val1) ? "默认规格" : val1;
    });
    $("#myorderListPanel").html(template(orderData));
    //alert( $("#myorderListPanel").html());
    //console.log("-----------------------------"+  $("#myorderListPanel").html()); //输出到浏览器控制台
    //alert(orderData.orderProfileList[0].cancelTime);
}

/**
 * 渲染分页
 */
function renderOrderPage(orderData) {
    if (empty(orderData)) {
        orderData = "";
    }
    var pagination = {};
    pagination.curPage = orderData.curPage; //当前页码
    pagination.pageSize = orderData.count; //每页大小
    pagination.pageCount = orderData.pageCount; //总页数
    pagination.total = orderData.total; //总记录数
    pagination.pageUrl = listUrl; //列表url
    pagination.callback = "queryOrderList";

    renderPageHtml(pagination, "myorderPagePanel");
}

/**
 * 渲染卖家信息
 * @param orderData
 */
function renderSellerInfo(orderData) {
    if (empty(orderData) || empty(orderData.orderProfileList)) {
       return;
    }
    var sellerIds = {};
    for (var i in orderData.orderProfileList) {
        var order = orderData.orderProfileList[i];
        sellerIds[order.sellerId] = order.sellerId;
    }
    if (!empty(sellerIds)) {
        $.ajax({
            url: "/seller/infos?sellerIds=" + JSON.stringify(sellerIds),
            type: 'get',
            //data: JSON.stringify(sellerIds),
            dataType: "json",
            success: function (ret) {
                if (ret.status == 200) {
                    if (!empty(ret.data)) {
                        //alert(ret.data["1"]);
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

function navClientEvent() {
    queryOrderList(listUrl);
    $("#orderListMenu").find("a").bind("click", function () {
        //if ($(this).attr('class') != "cur") {
            //alert($(this).html());
            //alert($(this).attr("href"));
        //alert($(this).attr("url"));
            $(this).parent().addClass("cur");
            $(this).parent().siblings().removeClass("cur");
            listUrl = $(this).attr("url");
            queryOrderList(listUrl);
    });
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
    //jQuery("#cancelOrderLayer").load(frontPath + "/member/updateorder.jsp", params, function () {
    //    center("#cancelOrderLayer")
    //});
}

function checkCancelForm(formObj) {
    if (empty($(formObj).find("input[name='refundReason']:checked").val())) {
        alert("请选择取消原因");
        return false;
    }
    if (empty($(formObj).find("input[name='orderId']").val())) {
        alert("订单号不能为空");
        return false;
    }
    $(formObj).attr("action","/order/cancel");
    return true;
}

/**
 * 买家付款
 * @param id
 */
function payOrder(id) {
    var params = {};
    params.orderId = id;
    window.open("/order/pay_select?orderId=" + params.orderId);
}


