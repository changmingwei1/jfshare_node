/**
 * Created by Administrator on 2016/5/3.
 */
//分页插件
(function ($) {
    var ms = {
        init: function (obj, args) {
            return (function () {
                ms.fillHtml(obj, args);
                ms.bindEvent(obj, args);
            })();
        },
        //填充html
        fillHtml: function (obj, args) {
            return (function () {
                obj.empty();
                //上一页
                if (args.current > 1) {
                    obj.append('<a href="javascript:;" class="prevPage">上一页</a>');
                } else {
                    obj.remove('.prevPage');
                    obj.append('<span class="disabled">上一页</span>');
                }
                //中间页码
                if (args.current != 1 && args.current >= 4 && args.pageCount != 4) {
                    obj.append('<a href="javascript:;" class="tcdNumber">' + 1 + '</a>');
                }
                if (args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                var start = args.current - 2, end = args.current + 2;
                if ((start > 1 && args.current < 4) || args.current == 1) {
                    end++;
                }
                if (args.current > args.pageCount - 4 && args.current >= args.pageCount) {
                    start--;
                }
                for (; start <= end; start++) {
                    if (start <= args.pageCount && start >= 1) {
                        if (start != args.current) {
                            obj.append('<a href="javascript:;" class="tcdNumber">' + start + '</a>');
                        } else {
                            obj.append('<span class="current">' + start + '</span>');
                        }
                    }
                }
                if (args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                if (args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
                    obj.append('<a href="javascript:;" class="tcdNumber">' + args.pageCount + '</a>');
                }
                //下一页
                if (args.current < args.pageCount) {
                    obj.append('<a href="javascript:;" class="nextPage">下一页</a>');
                } else {
                    obj.remove('.nextPage');
                    obj.append('<span class="disabled">下一页</span>');
                }
            })();
        },
        //绑定事件
        bindEvent: function (obj, args) {
            return (function () {
                obj.on("click", "a.tcdNumber", function () {
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj, {"current": current, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current);
                    }
                });
                //上一页
                obj.on("click", "a.prevPage", function () {
                    var current = parseInt($(this).siblings("span.current").text());
                    ms.fillHtml(obj, {"current": current - 1, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current - 1);
                    }
                });
                //下一页
                obj.on("click", "a.nextPage", function () {
                    var current = parseInt($(this).siblings("span.current").text());
                    ms.fillHtml(obj, {"current": current + 1, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current + 1);
                    }
                });
            })();
        }
    };
    $.fn.createPage = function (options) {
        var args = $.extend({
            pageCount: 10,
            current: 1,
            backFn: function () {
            }
        }, options);
        ms.init(this, args);
    }
})($);
var $productUserId = $("#productUserId");
var $dataTbody = $("#dataTbody");

var $goodsModal = $("#goodsModal");  //物流模态窗口
var $cancelgoodsModal = $("#cancelgoodsModal"); //取消订单窗口
var $corfirmorcancel = $("#corfirmorcancel"); //取消订单确认按钮
var $Toreturn = $("#Toreturn");               //取消订单取消按钮
var $goodsStatus = $("#goodsStatus");         //取消原因
var $cancelOrder = $("#cancelOrder");         //取消备注

var $goodsSave = $("#goodsSave");           //获取物流单保存按钮

var $goodsList = $("#goodsList");           //获取物流单id
var $goodsNumber = $("#goodsNumber");
var $goodsDesc = $("#goodsDesc");           //备注
var $num = $("#num");                       //订单号
var $orderState = 0;            //选择的订单状态,导出订单是需要用


var Imgurl = "http://proxy.jfshare.com/system/v1/jfs_image/";  //图片显示路径
var list = null;

var gainIndex = 0;  //物流单的索引值
var goodsIndex = 0; //取消订单索引

var offBtn1 = null;  //物流添加
var offBtn2 = null;  //物流添加

var $find = $("#find");
var nowstate = 0;
var magId = window.localStorage.getItem("managerId");
var domain = "http://proxy.jfshare.com"       //域名


init();  //加载第一页

var $virtualFileModal = $("#uploadFileDialog");         //获取 上传文件

function init() {
    $("#startTime").datepicker({
        minDate: "1900-01-01 00:00:00",
        maxDate: new Date()

    });
    $("#endTime").datepicker({
        maxDate: new Date()

    });
    dataSearch(1, nowstate);
}


$("#myTab").children("li").on("click", function () {
    var state = $(this).attr("state");
    console.log("now     " + state);
    $("input[name='productStatus']").val(state);
    $orderState = state;
    dataSearch(1, state);
});

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    //var currentdate = year + seperator1 + month + seperator1 + strDate
    //    + " " + date.getHours() + seperator2 + date.getMinutes()
    //    + seperator2 + date.getSeconds();
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/*初始化加载订单详情信息*/
function dataSearch(curpage, clickState) {
    var html = "";
    var percount = 10;
    var curpage = curpage;
    var url = domain + "/manager/order/list";
    if (clickState >= 0) {
        nowstate = clickState;
    }
    var sellerid = $("#productUserId").val();
    var startTime = $("#startTime").val();
    if (startTime && startTime.length > 0) {
        startTime = startTime + " 00:00:00"
    } else {
        var time = getNowFormatDate();
        $("#startTime").val(time);
        startTime = time + " 00:00:00"
    }
    var endTime = $("#endTime").val();
    if (endTime && endTime.length > 0) {
        endTime = endTime + " 23:59:59"
    } else {
        var time = getNowFormatDate();
        $("#endTime").val(time);
        endTime = time + " 23:59:59"
    }
    if (nowstate == 1000) {
        console.log("nowstate是1000了")
        afterurl = domain + "/manager/order/afterSalelist";
        $.ajax({
            url: afterurl,
            type: "post",
            //data: {percount: percount, curpage: curpage,sellerId:sellerid,orderState: nowstate },
            data: {percount: percount, curpage: curpage, sellerId: sellerid, startTime: startTime, endTime: endTime},
            dataType: "json",
            success: function (data) {   //这里需要修改
                if (data && data.code == 200) {
                    $dataTbody.empty();
                    if(!data.orderList){
                        html += "<td style='height:200px;width:100%;font-size:14px;text-align: center' colspan='8'>"
                        html += "暂无数据,请选择其他下单时间"
                        html += "</td>"
                        $dataTbody.html(html);
                        return false
                    }
                    $.each(data.afterSaleList,function(i,e){
                        $.each(data.orderList,function(index,ele){
                            $.each(ele.productList,function(x,y){
                                if((e.skuNum == y.skunum || (y.skunum == null && e.skuNum=="")) && (e.orderId == ele.orderId) && (e.productId == y.productId)){
                                    y.state = e.state;
                                    return true;

                                }
                            })
                        })
                    })
                    list = data.orderList;
                    console.log(list)
                    $.each(list, function (i, val) {
                        html += "<tr>";
                        html += "<td style='text-align: center; vertical-align: middle'><p>" + val.orderId + "</p><p>" + val.createTime + "</p></td>";
                        html += "<td style='text-align: center; vertical-align: middle'>" + val.sellerId + "</td>";
                        html += "<td style='text-align: center; vertical-align: middle'>" +

                            "<img src='" + Imgurl + val.productList[0].imgUrl + "' style='float:left; margin-left:10px' width='100'>" +
                            "<div style='float:left;margin-left:10px;width:80px'>" +
                            "<p>" + val.productList[0].productName + "</p>" +
                            "</div>" +
                            "</td>";
                        html += "<td style='text-align: center; vertical-align: middle'>" + (val.productList[0].curPrice * val.productList[0].count) + "</td>";
                        html += "<td style='text-align: center; vertical-align: middle'>" + val.postage + "</td>";
                        html += "<td style='text-align: center; vertical-align: middle'>" + val.orderPrice + "</td>";


                        html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>"+stateWords(val.productList[0].state)+"</a></td>";
                        html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                        html += "</tr>";
                    });
                    $(".pagination").off().createPage({
                        pageCount: data.page.pageCount,
                        current: curpage,
                        backFn: function (p) {
                            dataSearch(p, nowstate);
                        }
                    });
                    $dataTbody.html(html);

                }
            }
        })
    } else {
        $.ajax({
            url: url,
            type: "post",
            data: {
                percount: percount,
                curpage: curpage,
                sellerId: sellerid,
                orderStatus: nowstate,
                startTime: startTime,
                endTime: endTime
            },
            dataType: "json",
            success: function (data) {   //这里需要修改
                if (data && data.code == 200) {
                    if (data.orderList.length == 0 && data.afterSaleList.length == 0) {
                        html += "<tr>"
                        html += "<td style='height:200px;width:100%;font-size:14px;text-align: center' colspan='8'>"
                        html += "暂无数据,请选择其他下单时间"
                        html += "</td>"
                        html += "</tr>";
                        $dataTbody.html(html);
                        return false;
                    }
                    $dataTbody.empty();
                    list = data.orderList;
                    var afterSaleList = data.afterSaleList;
                    $.each(list, function (i, val) {
                        var isAfter = false;
                        if (afterSaleList.length) {
                            for (var j = 0; j < afterSaleList.length; j++) {
                                var afterval = afterSaleList[j];
                                if (afterval.orderId == val.orderId) {
                                    isAfter = true;
                                    break;
                                }
                            }
                        }
                        if (isAfter && clickState == 5){
                            return true
                        }
                        html += "<tr>";
                        html += "<td style='text-align: center; vertical-align: middle'><p>" + val.orderId + "</p><p>" + val.createTime + "</p></td>";
                        html += "<td style='text-align: center; vertical-align: middle'>" + val.sellerId + "</td>";
                        html += "<td style='text-align: center; vertical-align: middle'>"
                            + "<a href='http://buy.jfshare.com/html/products.html?productId=" + val.productList[0].productId + "'    target='_blank'>"
                            + "<img src='" + Imgurl + val.productList[0].imgUrl + "' style='float:left; margin-left:10px' width='100'></a>" +
                            "<div style='float:left;margin-left:10px;width:80px'>" +
                            "<p>" + val.productList[0].productName + "</p>" +
                            "</div>" +
                            "</td>";
                        html += "<td style='text-align: center; vertical-align: middle'>" + (val.productList[0].curPrice * val.productList[0].count) + "</td>";
                        html += "<td style='text-align: center; vertical-align: middle'>" + val.postage + "</td>";
                        html += "<td style='text-align: center; vertical-align: middle'>" + val.orderPrice + "</td>";



                        if (isAfter) {
                            html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>售后中</a></td>";
                            html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                        } else {
                            if (val.orderState == 10) {
                                html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>待支付</a></td>";
                                html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                            } else if (val.orderState == 11) {
                                html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>支付中</a></td>";
                                html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                            } else if (val.orderState == 20) {
                                html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>审核中</a></td>";
                                html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                            } else if (val.orderState == 30) { //这里需要修改
                                html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>待发货</a></td>";
                                html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p><p><a href='javascript:void(0)' class='logisticsListadd'>添加物流单</a></p><p><a href='javascript:void(0)' class='cancelList'>取消订单</a></p></td>";
                            } else if (val.orderState == 40) {
                                html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>待收货</a></td>";
                                html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p><p><a href='javascript:void(0)' class='logisticsList'>编辑物流单</a></p></td>";
                            } else if (val.orderState == 50) {
                                html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>待评价</a></td>";
                                html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                            } else if (val.orderState == 51) {
                                html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>已评价</a></td>";
                                html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                            } else if (val.orderState == 60) {
                                html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>交易自动关闭</a></td>";
                                html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                            } else if (val.orderState == 61) {
                                html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)' class='refundorservice_return'>退款/售后</a></td>";
                                html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                            }

                        }

                        html += "</tr>";
                    });
                    $(".pagination").off().createPage({
                        pageCount: data.page.pageCount,
                        current: curpage,
                        backFn: function (p) {
                            dataSearch(p, nowstate);
                        }
                    });
                    getOrderCount(sellerid, startTime, endTime);

                    $dataTbody.html(html);

                }
            }
        })
    }
}
$find.on("click", function () {
    dataConditionSearch(1);
});

$("#find2").on("click", function () {
    $("#orderNumber").val("");
    dataSearch(1, nowstate);
});

/*根据订单id查询订单*/
function dataConditionSearch(curpage, clickState) {
    var html = "";
    var url = domain + "/manager/order/list";
    var orderNumber = $("#orderNumber").val();
    if (orderNumber.length <= 0) {
        alert("输入订单id！");
    }
    var percount = 10;
    var curpage = curpage;
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    if (startTime && startTime.length > 0) {
        startTime = startTime + " 00:00:00"
    } else {
        var time = getNowFormatDate();
        $("#startTime").val(time);
        startTime = time + " 00:00:00"
    }
    if (endTime && endTime.length > 0) {
        endTime = endTime + " 23:59:59"
    } else {
        var time = getNowFormatDate();
        $("#endTime").val(time);
        endTime = time + " 23:59:59"
    }

    $.ajax({
        url: url,
        type: "post",
        data: {orderId: orderNumber, startTime: "", endTime: "", percount: percount, curpage: curpage},
        dataType: "json",
        success: function (data) {   //这里需要修改
            if (data && data.code == 200) {
                if(data.afterSaleList.length){
                    $.each(data.afterSaleList,function(i,e){
                        $.each(data.orderList,function(index,ele){
                            $.each(ele.productList,function(x,y){
                                if((e.skuNum == y.skunum) && (e.orderId == ele.orderId) && (e.productId == y.productId)){
                                    y.state = e.state

                                }
                            })
                        })
                    })
                }
                list = data.orderList;
                console.log(list)
                $.each(list, function (i, val) {
                    html += "<tr>";
                    html += "<td style='text-align: center; vertical-align: middle'><p>" + val.orderId + "</p><p>" + val.createTime + "</p></td>";
                    html += "<td style='text-align: center; vertical-align: middle'>" + val.sellerId + "</td>";
                    html += "<td style='text-align: center; vertical-align: middle'>" +
                        "<img src='" + Imgurl + val.productList[0].imgUrl + "' style='float:left; margin-left:10px' width='100'>" +
                        "<div style='float:left;margin-left:10px;width:80px'>" +
                        "<p>" + val.productList[0].productName + "</p>" +
                        "</div>" +
                        "</td>";
                    html += "<td style='text-align: center; vertical-align: middle'>" + (val.productList[0].curPrice * val.productList[0].count) + "</td>";
                    html += "<td style='text-align: center; vertical-align: middle'>" + val.postage + "</td>";
                    html += "<td style='text-align: center; vertical-align: middle'>" + val.orderPrice + "</td>";


                   if(data.afterSaleList.length){   //这里只能判断订单里面只有一个商品的时候,点击搜索,判断状态
                       if(val.productList[0].state == 1){
                           html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>退货申请中</a></td>";
                           html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                       }else if(val.productList[0].state == 3){
                           html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>退货失败</a></td>";
                           html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                       }else if(val.productList[0].state == 2){
                           html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>退货成功</a></td>";
                           html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                       }else{
                           html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>售后中</a></td>";
                           html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                       }
                   }else{
                        if (val.orderState == 10) {
                            html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>待支付</a></td>";
                            html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                        } else if (val.orderState == 11) {
                            html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>支付中</a></td>";
                            html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                        } else if (val.orderState == 20) {
                            html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>审核中</a></td>";
                            html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                        } else if (val.orderState == 30) { //这里需要修改
                            html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>待发货</a></td>";
                            html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p><p><a href='javascript:void(0)' class='logisticsListadd'>添加物流单</a></p><p><a href='javascript:void(0)' class='cancelList'>取消订单</a></p></td>";
                        } else if (val.orderState == 40) {
                            html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>待收货</a></td>";
                            html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p><p><a href='javascript:void(0)' class='logisticsList'>编辑物流单</a></p></td>";
                        } else if (val.orderState == 50) {
                            html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>待评价</a></td>";
                            html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                        } else if (val.orderState == 51) {
                            html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>已评价</a></td>";
                            html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                        } else if (val.orderState == 60) {
                            html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)'>交易自动关闭</a></td>";
                            html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                        } else if (val.orderState == 61) {
                            html += "<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)' class='refundorservice_return'>退款/售后</a></td>";
                            html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderDetails'>订单详情</a></p></td>";
                        }
                    }

                    html += "</tr>";
                });

                $("#pagination").empty();
                $dataTbody.html(html);

            }
        }
    })

}

/*用户点击订单详情后*/
$dataTbody.on("click", "a.OrderDetails", function () {
    var index = $(this).parents("tr").index();
    var orderId = list[index].orderId;
    var sellId = list[index].sellerId;
    var state = list[index].orderState;
    window.localStorage.setItem("orderId", orderId);
    window.localStorage.setItem("sellId", sellId);
    window.localStorage.setItem("orderState", state);
    window.location = "/product/ToBepaid";
});

/*物流单，显示模态窗口,并把物流单信息显示在窗口中*/
$dataTbody.off().on("click", "a.logisticsList", function () {
    var url = domain + "/manager/order/getExpressInfo";
    goodsIndex = $(this).parents("tr").index();
    var orderId = list[goodsIndex].orderId;
    var sellerId = list[goodsIndex].sellerId;
    //通过ajax获取物流商
    gain();

    $.ajax({   //通过ajax获取物流单
        url: url,
        type: "post",
        data: {sellerId: sellerId, orderId: orderId},
        dataType: "json",
        success: function (data) {
            console.log(data);
            //alert(4);
            offBtn2 = true;      //编辑
            $num.html("订单号：" + data.orderId);
            $goodsNumber.val(data.expressNo);  //物流单id
            $(".sellerComments").text(data.sellerComment);
            $goodsList.val(data.expressId);       //物流公司
            $goodsDesc.val(data.remark);

        }
    });

    $goodsModal.modal("show");    //打开物流模态窗口;
});
/*添加物流单*/
$dataTbody.on("click", "a.logisticsListadd", function () {
    goodsIndex = $(this).parents("tr").index();
    var orderId = list[goodsIndex].orderId;
    /*通过ajax获取物流商*/
    gain();
    //alert(3);
    offBtn1 = true;      //添加
    $num.html("订单号：" + orderId);
    $goodsNumber.val("");         //把信息都清空
    $(".sellerComments").text("");
    $goodsModal.modal("show");    //打开物流模态窗口;
});


/*取消订单,显示模态窗口*/
$dataTbody.on("click", "a.cancelList", function () {
    $cancelgoodsModal.modal("show");
    goodsIndex = $(this).parents("tr").index();
});

/*点击物流单保存按钮*/
$goodsSave.off('click').on("click",function(){
    var url=domain+"/manager/order/deliver";
    var orderId=list[goodsIndex].orderId;
    var sellerId=list[goodsIndex].sellerId;
    var $goodsNumberVal=$goodsNumber.val();  //物流单id
    var $goodsListVal=$goodsList.find("option:selected").val();  //物流公司id
    var $goodsListText=$goodsList.find("option:selected").text();  //物流公司
    var $goodsDescText=$goodsDesc.val();                                //备注
    var userId=list[goodsIndex].userId;   //后台发回的userid值
    console.log(userId);
    if(offBtn1){     //添加物流单
        $.ajax({
            url:url,
            type:"post",
            data:{orderId:orderId,sellerId:sellerId,expressNo:$goodsNumberVal,
                expressId:$goodsListVal,expressName:$goodsListText,
                remark:$goodsDescText,userId:userId
            },
            dataType:"json",
            success:function(data){
                console.log(data);
                if (data.code == 200) {
                    alert("保存成功");
                    window.location.reload();
                } else {
                    alert(data.desc);
                }
            }
        });
    }else if(offBtn2){       //更新物流单
        var urlupdate=domain+"/manager/order/updateExpressInfo";
        $.ajax({
            url:urlupdate,
            type:"post",
            data:{orderId:orderId,sellerId:sellerId,expressNo:$goodsNumberVal,
                expressId:$goodsListVal,expressName:$goodsListText,
                remark:$goodsDescText
            },
            dataType:"json",
            success:function(data){
                console.log(data);
                if (data.code == 200) {
                    alert("更新成功")
                } else {
                    alert(data.desc);
                }
            }

        });

    }

    //关闭模态窗口
    $goodsModal.modal("hide");

});
/*用户点击订单详情后*/
$dataTbody.on("click", "a.OrderDetails", function () {
    var index = $(this).parents("tr").index();
    var orderId = list[index].orderId;
    var sellId = list[index].sellerId;
    var state = list[index].orderState;
    window.localStorage.setItem("orderId", orderId);
    window.localStorage.setItem("sellId", sellId);
    window.localStorage.setItem("orderState", state);
    window.location = "/product/ToBepaid";
});







/*点击取消按钮,取消订单*/
$corfirmorcancel.off("click").on("click", function () {
    var url = domain+"/manager/order/cancelOrder";
    var $goodsStatusText = $goodsStatus.find("option:selected").val();
    //var $cancelOrderText = $cancelOrder.text();
    var orderId=list[goodsIndex].orderId;
    var sellerId=list[goodsIndex].sellerId;
    var userId=list[goodsIndex].userId;
    console.log(userId);
    console.log(orderId);
    $.ajax({
        url: url,
        type: "post",
        data: {account: $goodsStatusText,orderId:orderId,userId:userId,sellerId:sellerId},
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.code == 200) {
                setTimeout(function(){
                    alert("取消成功");
                    window.location.reload();
                },1800)
            } else {
                alert(data.desc);
            }
            $cancelgoodsModal.modal("hide");
        }
    })

});

/*取消订单*/
$dataTbody.on("click", "a.cancelList", function () {
    $cancelgoodsModal.modal("show");
});

/*点击取消按钮，关闭模态窗口*/
$Toreturn.on("click", function () {
    $cancelgoodsModal.modal("hide");
});

//通过ajax获取物流商
function gain() {
    var exphtml = "";
    var urlexp = domain + "/manager/order/expresslist";
    $.ajax({
        url: urlexp,
        type: "post",
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                console.log(data);
                var List = data.expressList;
                exphtml += "<option value='0'>--请选择--</option>";
                $.each(List, function (i, val) {
                    exphtml += "<option value=" + val.id + ">" + val.name + "</option>";
                });
                $goodsList.html(exphtml);
            }
        }
    });
}


function getOrderCount(sellerId, startTime, endTime) {
    if ($("#sellerId")) {
        var urlorder = domain + "/manager/order/queryOrder";
        $.ajax({
            url: urlorder,
            type: "post",
            data: {sellerId: sellerId, startTime: startTime, endTime: endTime},
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    console.log(data);
                    $("#orderCount").text(data.count);
                    //var list=data.orderCountList;
                    //for(var i=0;i<list.length;i++){
                    //    var val = list[i];
                    //    if(val.orderState==30){
                    //        $("#orderCount").text(val.count);
                    //        break;
                    //    }
                    //}
                }
            }
        });

        var urlafter = domain + "/manager/order/queryafterSaleOrder";
        $.ajax({
            url: urlafter,
            type: "post",
            data: {sellerId: sellerId},
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    console.log(data);
                    var count = data.count;
                    $("#afterCount").text(data.count);
                }
            }
        });

    }
}
/*退货，售后操作*/
$dataTbody.on("click", "a.refundorservice_return", function () {
    window.location.href = "/product/refundorservice_return"
});

/*查询物流*/


/**  批量导出订单*/
$("#exportOrders").off().on("click", function () {
    var sellerId = $("#productUserId").val();
    var orderId = $("#orderNumber").val();
    var startTime = $("#startTime").val();
    if (startTime && startTime.length > 0) {
        startTime = startTime + " 00:00:00"
    } else {
        var time = getNowFormatDate();
        $("#startTime").val(time);
        startTime = time + " 00:00:00"
    }
    var endTime = $("#endTime").val();
    if (endTime && endTime.length > 0) {
        endTime = endTime + " 23:59:59"
    } else {
        var time = getNowFormatDate();
        $("#endTime").val(time);
        endTime = time + " 23:59:59"
    }
    if(orderId){
        startTime = "";
        endTime = "";
    }
    var params = {};
    params.sellerId = sellerId;
    params.orderId = orderId || null;
    params.orderState = $orderState;
    params.startTime = startTime;
    params.endTime = endTime;
    var queryKey = null;
    $.ajax({
        type: "post",
        url: "http://proxy.jfshare.com/manager/order/queryExportOrderInfo",
        async: false, // 使用异步方式
        // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
        // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data && data.code == 200) {
                console.log(data);
                params.queryKey = data.queryKey;
            }
        }
    });
    if (params.queryKey == null) {
        alert("导出订单失败");
    } else {
        isOver(params);
    }
});
function isOver(params) {
    var result = null;
    $.ajax({
        type: "post",
        url: "http://proxy.jfshare.com/manager/order/getExportOrderResult",
        async: false, // 使用异步方式
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    if (result != null) {
        if (result.value.code == -1) {
            alert("导出订单失败");
            return;
        }
        if (result.value.code ==0) {
            isOver(params);
        }
        if(result.value.code ==1){
            //alert(result.value.desc);
            //$("#downFileAncher").attr("href",result.value.desc);
            window.location.href=result.value.desc;
            return;
        }
    }
}
//上传图片插件
$("#fulAvatar").uploadify({
    'swf': '/misc/uploadify.swf',
    'formData': {'wh': $("#hidden_upload_type").val() == "1" ? '800f1000f800f1000' : ''},
    'uploader': "http://proxy.jfshare.com/system/uploadFiles",
    'queueID': 'fileQueue',
    'width': 100,
    'fileSizeLimit': '2MB',
    'buttonText': '批量导入物流',
    'fileTypeExts': '*.xlsx;*.xls;',
    'fileTypeDesc': 'only xlsx  xls',
    'auto': true,
    'method': 'get',
    'multi': false,
    'onUploadSuccess': function (file, data, response) {
        var resObj = JSON.parse(data);
        console.log(data)
        console.log(file)
        console.log(response)
        if (resObj.result) {
            uploadCallback(resObj.title);

        } else {
            alert('上传文件[ ' + file.name + ']失败，原因: ' + resObj.failDesc);
        }
        $virtualFileModal.modal('hide');
    },
    'onUploadError': function (file, errorCode, errorMsg, errorString) {
        alert('上传文件[ ' + file.name + ']失败，原因: ' + errorString);
    }
});


/**  批量导入物流单*/
$("#importExpress").on("click", function () {
    $virtualFileModal.modal("show");

});

function stateWords(state){
    var str = "";
    if(state == 1){
        str = "退货申请中";
    }else if(state == 2){
        str = "退货成功"
    }else if(state == 3){
        str = "退货失败"
    }else{
        str = "售后中"
    }
    return str;
}



