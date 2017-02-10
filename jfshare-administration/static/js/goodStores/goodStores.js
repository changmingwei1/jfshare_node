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
var domain = "http://proxy.jfshare.com"       //域名

var init = function (curPage) {
    var param = {};
    /*第三方商家标识别  0全部 1我买网 */
    param.thirdPartyIdentify = $("select[name='sellerName']").find("option:selected").val() || "0";
    param.productName = $("input[name='productName']").val() || "";
    console.log("  param.thirdPartyIdentify:" + param.thirdPartyIdentify);
    var productStatus = $("select[name='status']").find("option:selected").val() || "";
    if (productStatus == 0) {
        param.activeState = 0;
        /*商品状态 0全部  300在售 101下架*/
    } else if (productStatus == 1) {
        param.activeState = 300;
    } else {
        param.activeState = 101;
    }
    param.stockState = $("select[name='stroes']").find("option:selected").val() || "";//商品库存 0全部 1全区有货 2 部分缺货 3 全区缺货
    param.priceState = $("select[name='prices']").find("option:selected").val() || "";//价格变化 0全部  1上升 2 下降 3持平
    param.offerState = $("select[name='tbStatus']").find("option:selected").val() || "";//0全部 1已提报 2未提报
    param.curpage = curPage;
    /*当前页*/
    param.percount = 10;
    /*每页显示数量*/
    ;
    $.when(
        $.ajax({
            type: "post",
            //url: "http://proxy.jfshare.com/manager/product/thirdPartyProductQuery",
            url: "http://120.24.153.102/manager/product/thirdPartyProductQuery",
            //http://120.24.153.102/manager/product/thirdPartyProductQuery
            data: param,
            dataType: "json",
            beforeSend: function () {
                $('#dataTbody').html("<tr><td height='100px' colspan='10' class='text-center'>数据加载中<img src='/img/load.gif' alt='' width='30px;' height='30px'></td></tr>");
            }
        }).promise()
    ).done(function (data) {
        if (data.code == 200) {
            var html = "";
            var imgurl = "http://proxy.jfshare.com/system/v1/jfs_image/";
            if (!data.thirdPartyProductList || data.thirdPartyProductList.length == 0) {
                $('#dataTbody').html("<tr><td height='200px' colspan='10' class='text-center'>暂无数据</td></tr>");
                $(".pagination").hide();
                return false;
            }
            $(".pagination").show();
            $.each(data.thirdPartyProductList, function (i, val) {
                html += "<tr>";
                if (val.productId.length == 0) {
                    if (!val.imgKey || val.imgKey.length > 0) {
                        var imgkeys = val.imgKey
                        html += "<td style='text-align:center;vertical-align:middle'>" +
                            "<img src=imgkeys[0] width='100' height='100'><br/>" +
                            "<span>商品名称:</span>" + val.name + "</span><br/>" +
                            "</td>";
                    }
                } else {
                    html += "<td style='text-align:center;vertical-align:middle'>" +
                        "<img src=val.imgKey width='100' height='100'><br/>" +
                        "<span>商品名称:</span>" + val.name + "</span><br/>" +
                        "<span>商品id：" + val.productId + "</span>" +
                        "</td>";

                }


                if (val.thirdPartyIdentify == 0) {
                    html += "<td style='text-align:center;vertical-align:middle;' sellerName=" + val.sellerName + ">全部</td>";
                } else if (val.thirdPartyIdentify == 1) {
                    html += "<td style='text-align:center;vertical-align:middle;' sellerName=" + val.sellerName + ">我买网</td>";
                }
                //商品商家编码
                html += "<td style='text-align:center;vertical-align:middle;' sellerCode=" + val.sellerCode + ">" + val.sellerClassNum + "</td>";
                //结算价
                html += "<td style='text-align:center;vertical-align:middle;' refPrice=" + val.refPrice + ">" + val.curPrice + "</td>";
                //价格变化
                if (val.priceState == 1) {
                    html += "<td style='text-align:center;vertical-align:middle;' style＝'font-size:20px;color:#ff0000'>↑</td>";
                } else if (val.priceState == 2) {
                    html += "<td style='text-align:center;vertical-align:middle;' style＝'font-size:20px;color:#008000'>↓</td>";
                } else if (val.priceState == 3) {
                    html += "<td style='text-align:center;vertical-align:middle;' style＝'font-size:20px;color:#008000'>—</td>";
                }

                //库存信息
                var storeStr = "";
                var objStore = JSON.parse(val.stockInfo);
                if (storeName.length && objStore) {
                    for (var index in objStore) {
                        storeStr += storeName[index] + ":" + objStore[index] + "</br>";
                    }
                    if (storeStr.length) {
                        storeStr.substring(0, storeStr.length - 1);
                    } else {
                        storeStr = "无";
                    }
                }


                html += "<td style='text-align:center;vertical-align:middle;' stores=" + val.stores + ">" + storeStr + "</td>";

                //商品状态
                if (val.activeState == 0) {
                    html += "<td style='text-align:center;vertical-align:middle;'><span >全部</span></td>";
                } else if (val.activeState == 300) {
                    html += "<td style='text-align:center;vertical-align:middle;'><span >在售</span></td>";
                } else if (val.activeState == 101) {
                    html += "<td style='text-align:center;vertical-align:middle;'><span  style='color:#ff0000'>下架</span></td>";
                }
                //提报
                if (val.offerState == 0) {
                    html += "<td style='text-align:center;vertical-align:middle;'><span >全部</span></td>";
                } else if (val.offerState == 1) {
                    html += "<td style='text-align:center;vertical-align:middle;'><span  style='color:#ff0000'>已提报</span></td>";
                } else if (val.offerState == 2) {
                    html += "<td style='text-align:center;vertical-align:middle;'><span  style='color:#ff0000'>未提报</span></td>";
                }


                html += "<td style='text-align:center;vertical-align:middle;' updata=" + val.updata + ">" + val.updateTime + "</td>";

                html += "<td style='text-align:center;vertical-align:middle;'>";
                if (val.activeState == 300 && val.offerState == 1) {
                    //在售已提报
                    html += "<a class='integrationChange' href='http://buy.jfshare.com/html/products.html?productId=" + val.productId + "'   target='_blank'><i ></i>聚分享详情</a><br/><br/>"
                } else if (val.activeState == 101 && val.offerState == 2) {
                    //商品下架并且未提报
                    html += "<a class='integrationChange' href='javascript:void(0)' disabled='disabled' style='color:#ccc;border:1px solid #ccc'>提报</a><br/><br/>";
                } else if (val.activeState == 300 && val.offerState == 2) {
                    // 在售未提报
                    html += "<a class='integrationChange' href='javascript:void(0)' data-productId='" + val.productId + "'><i  icon-white'></i>提报</a><br/><br/>";
                }

                //http://gz.womai.com/Product-200-534701.htm
                console.log("id - " + val.thirdPartyProductId);
                html += "<a class='integrationChange' href='http://gz.womai.com/Product-200-" + val.thirdPartyProductId + ".htm'   target='_blank'><i ></i>第三方详情</a><br/><br/>";
                html += "<a  class='viewNote' data-productId='" + val.thirdPartyProductId + "'>查看日志</a><br/><br/>";
                html += "</td>";
                html += "</tr>"
            });
            $("#dataTbody").html(html);
            $(".pagination").off().createPage({
                pageCount: data.pagination.pageNumCount,
                current: curPage,
                backFn: function (p) {
                    console.log("current  + " + p);
                    // dataSearch(p,nowstate)
                    curPage = p;
                    init(curPage);
                }
            });


            $(".viewNote").on('click', function () {
                $("#reviewModal").modal('show');
                var productId = $(this).attr('data-productId');
                getlogs(1, productId);
                var show = function () {
                    $('.bodyContents').html("数据加载中<img src='/img/load.gif' alt='' width='30px;' height='30px' style='margin:0 auto'>");
                }
            });
            function getlogs(curPage, productId) {
                var logs = ""
                var paramLog = {};
                paramLog.thirdPartyProductId = productId;
                paramLog.thirdPartyIdentify = 1;
                paramLog.curpage = curPage;
                paramLog.percount = 10;
                console.log(productId + "");
                console.log(JSON.stringify(paramLog) + "");
                $.when(
                    $.ajax({
                        type: "post",
                        url: "http://proxy.jfshare.com/manager/product/getThirdPartyProductLog",
                        data: paramLog,
                        dataType: "json",
                    })
                ).done(function (data) {
                    if (data.code == 200) {
                        if (!data.logs || data.logs.length == 0) {
                            $('.bodyContents').html("<tr><td height='200px' colspan='10' class='text-center'>暂无数据</td></tr>");
                            $("#logPage").hide();
                            return false;
                        } else {
                            $.each(data.logs, function (i, e) {
                                var curState = "";
                                if (e.productState == 101) {
                                    curState = "在售";
                                } else if (e.productState == 300) {
                                    curState = "下架";
                                }
                                logs += "<p>更新时间:" + e.updateTime + "价格:" + e.curPrice + "商品状态:" + curState + "</p>";

                            })
                            $("#logPage").show();
                            $(".bodyContents").html(logs);
                            console.log(JSON.stringify(data));
                            $(".logPageContent .pagination").off().createPage({
                                pageCount: data.pagination.pageNumCount,
                                current: curPage,
                                backFn: function (p) {
                                    curPage = p;
                                    getlogs(curPage, productId);
                                }
                            });
                        }

                    } else {
                        console.log(data.desc);
                    }


                })

            }

        } else {
            console.log(data.desc)
        }

    }).fail(function (error) {
        console.log("请求失败");
    })

}


$(document).ready(function () {


    var param = {};
    param.sellerId = 63;

    console.log(param);
    window.storeName = [];

    $.when(
        $.ajax({
            type: "post",
            url: "http://proxy.jfshare.com/seller/template/listStorehouse",
            data: param,
            dataType: "json"

        }).promise()
    ).done(function (data) {
        if (data.code == 200) {
            console.log(" get list datas ~~~  ")
            // console.log(JSON.stringify(data));
            $.each(data.storehouseList, function (i, val) {
                // console.log(val.sellerId +"  " +val.name);
                storeName[val.id] = val.name;
            });
            init(1);
        } else {
            console.log(data.desc)
        }

    }).fail(function (error) {

    })


    $("#search").off().on('click', function () {
        init(1);
    });

//导出数据
    $("#integrationCardExport").off().on("click", function () {
        exportIntegrationCard();
    })
    $(".tbOperat").on('click', function () {
        var productId = $(this).attr('data-productId');
        $.when(
            $.ajax({
                type: "post",
                url: "",
                data: {
                    productId: productId
                },
                dataType: "json",
            })
        ).done(function () {
            if (data.code == 200) {
                $("#tbStatusModal").modal('show');
            } else {
                console.log(data.desc);
            }
        })
    })
    function exportIntegrationCard(){
        var param = {};
        /*第三方商家标识别  0全部 1我买网 */
        param.thirdPartyIdentify = $("select[name='sellerName']").find("option:selected").val() || "0";
        param.productName = $("input[name='productName']").val() || "";
        console.log("  param.thirdPartyIdentify:" + param.thirdPartyIdentify);
        var productStatus = $("select[name='status']").find("option:selected").val() || "";
        if (productStatus == 0) {
            param.activeState = 0;
            /*商品状态 0全部  300在售 101下架*/
        } else if (productStatus == 1) {
            param.activeState = 300;
        } else {
            param.activeState = 101;
        }
        param.stockState = $("select[name='stroes']").find("option:selected").val() || "";//商品库存 0全部 1全区有货 2 部分缺货 3 全区缺货
        param.priceState = $("select[name='prices']").find("option:selected").val() || "";//价格变化 0全部  1上升 2 下降 3持平
        param.offerState = $("select[name='tbStatus']").find("option:selected").val() || "";//0全部 1已提报 2未提报
        $.when(
            $.ajax({
                type: "post",
                url: "http://120.24.153.102/manager/product/exportThirdPartyProduct",
                data: param,
                dataType: "json",

            }).promise()
        ).done(function (data) {
            if (data.code == 200) {
                window.location.href="http://120.24.153.155/"+data.value;
            } else {
                console.log(data.desc)
            }

        }).fail(function (error) {
            console.log("请求失败");
        })

    }
})

