/**
 * Created by zhaoshenghai on 16/3/21.
 */
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Order = require('../lib/models/order');
var Util = require('../lib/models/util');
var afterSale = require('../lib/models/afterSale');
var Express = require('../lib/models/express');
// 查询订单列表
router.post('/list', function (request, response, next) {

    var result = {code: 200};


    var params = request.body;
    logger.info("查询订单列表请求参数：" + JSON.stringify(params));


    if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {
        result.code = 400;
        result.desc = "参数错误";
        response.json(result);
        return;
    }

    if (params.percount == null || params.percount == "" || params.percount <= 0) {
        result.code = 400;
        result.desc = "参数错误";
        response.json(result);
        return;
    }

    if (params.curpage == null || params.curpage == "" || params.curpage <= 0) {
        result.code = 400;
        result.desc = "参数错误";
        response.json(result);
        return;
    }

    var afterSaleList = [];
    var productList = [];
    async.series([
            function (callback) {
                try {
                    Order.orderProfileQuery(params, function (err, orderInfo) {
                        if (err) {
                            logger.error("订单服务异常");
                            return callback(1, null);
                        }
                        var page = {total: orderInfo.total, pageCount: orderInfo.pageCount};
                        var orderList = [];
                        if (orderInfo.orderProfileList !== null) {
                            orderInfo.orderProfileList.forEach(function (order) {
                                var orderItem = {
                                    orderId: order.orderId,
                                    sellerId:order.sellerId,
                                    userId:order.userId,
                                    orderPrice: order.closingPrice,
                                    //添加了应答的数据
                                    postage: order.postage,
                                    username: order.username,
                                    cancelName: order.cancelName,
                                    sellerName: order.sellerName,
                                    createTime: order.createTime,
                                    expressNo: order.expressNo,
                                    expressName: order.expressName,
                                    receiverAddress: order.receiverAddress,
                                    receiverName: order.receiverName,
                                    receiverMobile: order.receiverMobile,
                                    receiverTele: order.receiverTele,
                                    orderState: order.orderState,
                                    sellerComment: order.sellerComment,
                                    buyerComment: order.buyerComment,
                                    deliverTime: order.deliverTime,
                                    successTime: order.successTime,
                                    exchangeCash: order.exchangeCash,
                                    exchangeScore: order.exchangeScore,
                                    activeState: order.activeState,
                                    curTime: order.curTime
                                };
                                var productList = [];
                                if (order.productList !== null && order.productList.length > 0) {
                                    for (var i = 0; i < order.productList.length; i++) {
                                        var productItem = {
                                            productId: order.productList[i].productId,
                                            productName: order.productList[i].productName,
                                            skunum: order.productList[i].skuNum,
                                            curPrice: order.productList[i].curPrice,
                                            imgUrl: order.productList[i].imagesUrl.split(',')[0],
                                            count: order.productList[i].count
                                        };
                                        productList.push(productItem);
                                    }
                                    orderItem.productList = productList;
                                    orderList.push(orderItem);
                                }
                            });
                            result.orderList = orderList;
                            result.page = page;
                        }
                        logger.info("get order list response:" + JSON.stringify(result));
                        return callback(null, result);
                    });

                } catch (ex) {
                    logger.info("订单服务异常:" + ex);
                    return callback(1, null);
                }
            },
            function (callback) {
                try {
                    if (params.orderState == null || params.orderState == 1) {
                        afterSale.queryAfterSale(params, function (err, data) {
                            if (err) {
                                return callback(2, null);
                            }
                            logger.info("get order list response:" + JSON.stringify(result));
                            afterSaleList = data;
                            return callback(null, afterSaleList);
                        });
                    } else {
                        return callback(3, null);
                    }
                } catch (ex) {
                    logger.info("售后服务异常:" + ex);
                    return callback(2, null);
                }

            }
        ],
        function (err, results) {
            if (err == 1) {
                logger.error("查询订单列表失败---订单服务异常：" + err);
                result.code = 500;
                result.desc = "查询订单失败";
                response.json(result);
                return;
            }
            if (err == 2) {
                logger.error("查询售后失败--售后服务异常：" + err);
                response.json(results[0]);
                return;
            }

            if (err == null && err != 3) {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[0];
                result.afterSaleList = results[1];
                response.json(result);
                return;
            } else {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[0];

                response.json(result);
                return;
            }
        });
});
// 查询订单详情
router.post('/info', function (request, response, next) {
    var result = {code: 200};

    //var params = request.query;
    var params = request.body;
    if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {
        result.code = 400;
        result.desc = "参数错误";
        response.json(result);
        return;
    }

    if (params.orderId == null || params.orderId == "") {
        result.code = 400;
        result.desc = "参数错误";
        response.json(result);
        return;
    }

    //订单详情，没有处理3的情况，这里就写2
    params.userType = 2; // 1:买家 2：卖家 3：系统

    logger.info("查询订单祥情请求参数：" + JSON.stringify(params));

    var afterSaleList = [];
    async.series([
            function (callback) {
                try {

                    Order.queryOrderDetail(params, function (err, orderInfo) {
                        if (err) {
                            logger.error("订单服务异常");
                            return callback(1, null);
                        }

                        result.orderid = orderInfo.orderId;
                        result.postage = orderInfo.postage;
                        result.postage = orderInfo.postage;
                        result. exchangeScore = orderInfo.exchangeScore;
                        result.closingPrice = orderInfo.closingPrice;
                        result.createTime = orderInfo.deliverTime;
                        result.comment = orderInfo.buyerComment;
                        if (orderInfo.deliverInfo !== null) {

                            var deliverInfo = {
                                receiverName: orderInfo.deliverInfo.receiverName,
                                receiverMobile: orderInfo.deliverInfo.receiverMobile,
                                receiverAddress: orderInfo.deliverInfo.receiverAddress,
                                expressId: orderInfo.deliverInfo.expressId,
                                expressName: orderInfo.deliverInfo.expressName,
                                expressNo: orderInfo.deliverInfo.expressNo
                            };
                            result.deliverInfo = deliverInfo;
                        }

                        var productList = [];
                        if (orderInfo.productList !== null && orderInfo.productList.length > 0) {
                            for (var i = 0; i < orderInfo.productList.length; i++) {
                                productList.push({
                                    productId: orderInfo.productList[i].productId,
                                    productName: orderInfo.productList[i].productName,
                                    skunum: {
                                        skuNum: orderInfo.productList[i].skuNum,
                                        skuDesc: orderInfo.productList[i].skuDesc
                                    },
                                    curPrice: orderInfo.productList[i].curPrice,
                                    orgPrice: orderInfo.productList[i].orgPrice,
                                    imgUrl: orderInfo.productList[i].imagesUrl,
                                    count: orderInfo.productList[i].count,
                                    postage:orderInfo.productList[i].postage,
                                    type:orderInfo.productList[i].postage
                                });
                            }
                            result.productList = productList;

                            logger.info("get order info response:" + JSON.stringify(result));
                            callback(null, result);
                        }
                    });
                }
                catch
                    (ex) {
                    logger.info("订单服务异常:" + ex);
                    return callback(1, null);
                }
            },
            function (callback) {
                try {
                    if (params.orderState == null || params.orderState == 1) {
                        afterSale.queryAfterSale(params, function (err, data) {
                            if (err) {
                                return callback(2, null);
                            }
                            logger.info("get order list response:" + JSON.stringify(result));
                            afterSaleList = data;
                            result.afterSaleList = afterSaleList;
                            return callback(null, afterSaleList);
                        });
                    } else {
                        return callback(3, null);
                    }
                } catch (ex) {
                    logger.info("售后服务异常:" + ex);
                    return callback(2, null);
                }

            }
        ],
        function (err, results) {
            if (err == 1) {
                logger.error("查询订单列表失败---订单服务异常：" + err);
                result.code = 500;
                result.desc = "查询订单失败";
                response.json(result);
                return;
            }
            if (err == 2) {
                logger.error("查询售后失败--售后服务异常：" + err);
                response.json(results[0]);
                return;
            }

            if (err == null && err != 3) {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[0];
                result.afterSaleList = results[1];
                response.json(result);
                return;
            } else {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[0];

                response.json(result);
                return;
            }
        }
    )
    ;
})
;


//查询售后的订单个数
router.post('/queryafterSaleOrder', function (request, response, next) {
    var result = {code: 200};
    result.count = 0;
    try {
        var params = request.body;
        logger.info("查询订单状态个数请求参数：" + JSON.stringify(params));
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        afterSale.queryAfterSaleOrderList(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.count = data;
            response.json(result);
            return
        });

    } catch (ex) {
        logger.error("查询售后订单个数失败：" + ex);
        result.code = 500;
        result.desc = "查询售后订单个数失败";
        response.json(result);
    }
});
// 查询订单状态个数
router.post('/queryOrder', function (request, response,next) {
    var result = {code: 200};
    try {
        var params = request.body;

        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        logger.info("查询订单状态个数请求参数：" + JSON.stringify(params));

        Order.orderStateQuery(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("Order.orderStateQuery response:" + JSON.stringify(data));

            result.orderCountList  = data;
            response.json(result);
            return
        });

    } catch (ex) {
        logger.error("查询订单状态个数失败：" + ex);
        result.code = 500;
        result.desc = "查询订单状态个数失败";
        response.json(result);
    }
});
//获取物流信息
router.post('/queryexpress', function (request, response, next) {
    logger.info("进入获取物流信息流程");


    var result = {code: 200};

    try {
        //var params = request.query;
        var params = request.body;
        logger.info("Express.expressQuery params:" + JSON.stringify(params));
        if (params.orderId == null || params.orderId == "" || params.orderId <= 0) {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.num == null || params.num == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.comId == null || params.comId == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Express.expressQuery(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("Express.expressQuery response:" + JSON.stringify(result));
            if (data.expressInfo != null) {
                result.name = data.expressInfo.name;
            }
            if (data.expressTrace != null) {

                result.traceItems = data.expressTrace.traceItems;
            }

            response.json(result);
            return
        });


    } catch (ex) {
        logger.error("查询物流信息失败：" + ex);
        result.code = 500;
        result.desc = "查询物流信息失败";
        response.json(result);
    }
});
//取消订单
router.post('/cancelOrder', function (request, response, next) {
    logger.info("进入取消订单流程");
    var result = {code: 200};

    try {

        var params = request.body;

        if (params.orderId == null || params.orderId == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.account == null || params.account == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.sellerId == null || params.sellerId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Order.cancelOrder(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(result);
            return
        });

    } catch (ex) {
        logger.error("查询物流信息失败：" + ex);
        result.code = 500;
        result.desc = "查询物流信息失败";
        response.json(result);
    }
});


//更新物流单
router.post('/updateExpressInfo', function (request, response, next) {
    logger.info("进入取消订单流程");
    var result = {code: 200};

    try {

        var params = request.body;

        if (params.sellerId == null || params.sellerId == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.orderId == null || params.orderId == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        //params.expressId,params.expressNo,params.expressName
        if (params.expressId == null || params.expressId == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.expressNo == null || params.expressNo == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.expressName == null || params.expressName == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Order.updateExpressInfo(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(result);
            return
        });

    } catch (ex) {
        logger.error("查询物流信息失败：" + ex);
        result.code = 500;
        result.desc = "查询物流信息失败";
        response.json(result);
    }
});


//获取物流单单号
router.post('/getExpressInfo', function (request, response, next) {
    logger.info("进入取消订单流程");
    var result = {code: 200};

    try {

        var params = request.body;

        if (params.sellerId == null || params.sellerId == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.orderId == null || params.orderId == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        Order.queryOrderDetail(params, function (err, orderInfo) {
            if (err) {
                response.json(error);
                return;
            }

            result.OrderId = orderInfo.orderId;

            result.comment = orderInfo.sellerComment;
            if (orderInfo.deliverInfo !== null) {
                result.expressId = orderInfo.deliverInfo.expressId;
                result.expressName = orderInfo.deliverInfo.expressName;
                result.expressNo = orderInfo.deliverInfo.expressNo;
            }
            response.json(result);
        });

    } catch (ex) {
        logger.error("查询物流信息失败：" + ex);
        result.code = 500;
        result.desc = "查询物流信息失败";
        response.json(result);
    }
});
//获取售后的订单列表
router.post('/afterSalelist', function (request, response, next) {
    logger.info("进入获取售后的订单列表");
    var result = {code: 200};
    var afterOrderList = [];
    var orderList = [];
    try {
        var params = request.body;

        if (params.sellerId == "" || params.sellerId == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.percount == "" || params.percount == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.curpage == "" || params.curpage == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        var isExist = 0;
        logger.info("进入获取售后的订单列表--params" + JSON.stringify(params));
        async.series([
                function (callback) {
                    try {
                        afterSale.queryAfterSaleOrderListBySellerId(params, function (err, data) {
                            if (err) {
                                callback(1, null);
                                return;
                            }
                            if(data==null || data.afterSaleOrders==null){
                                callback(null,2);
                                isExist =1;
                            }else{
                                afterOrderList = data.afterSaleOrders;
                                page = data.pagination;
                                callback(null, 1);
                                return;
                            }

                        });
                    }
                    catch
                        (ex) {
                        logger.info("售后服务异常:" + ex);
                        return callback(1, null);
                    }
                },
                function (callback) {
                    try {
                        var page = {total: 0, pageCount: 0};
                        var orderIdList = [];
                        logger.info("-----isExist------:" + isExist);
                        if(isExist){
                            result.orderList = orderList;
                            result.page = page;
                            return callback(null,2);
                        }


                        for (var i = 0; i < afterOrderList.length; i++) {
                            orderIdList.push(afterOrderList[i].orderId);
                        }
                        params.orderList = orderIdList;
                        Order.orderProfileQuery(params, function (err, orderInfo) {
                            if (err) {
                                logger.error("订单服务异常");
                                return callback(1, null);
                            }
                            page.total = orderInfo.total;
                            page.pageCount = orderInfo.pageCount;
                            if (orderInfo.orderProfileList !== null) {
                                orderInfo.orderProfileList.forEach(function (order) {
                                    var orderItem = {
                                        orderId: order.orderId,
                                        userId: order.userId,
                                        orderPrice: order.closingPrice,
                                        //添加了应答的数据
                                        postage: order.postage,
                                        username: order.username,
                                        cancelName: order.cancelName,
                                        sellerName: order.sellerName,
                                        sellerId: order.sellerId,
                                        createTime: order.createTime,
                                        expressNo: order.expressNo,
                                        expressName: order.expressName,
                                        receiverAddress: order.receiverAddress,
                                        receiverName: order.receiverName,
                                        receiverMobile: order.receiverMobile,
                                        receiverTele: order.receiverTele,
                                        orderState: order.orderState,
                                        sellerComment: order.sellerComment,
                                        buyerComment: order.buyerComment,
                                        deliverTime: order.deliverTime,
                                        successTime: order.successTime,
                                        exchangeCash: order.exchangeCash,
                                        exchangeScore: order.exchangeScore,
                                        activeState: order.activeState,
                                        curTime: order.curTime
                                    };
                                    var productList = [];
                                    if (order.productList !== null && order.productList.length > 0) {
                                        for (var i = 0; i < order.productList.length; i++) {
                                            var productItem = {
                                                productId: order.productList[i].productId,
                                                productName: order.productList[i].productName,
                                                skunum: order.productList[i].skuNum,
                                                curPrice: order.productList[i].curPrice,
                                                imgUrl: order.productList[i].imagesUrl.split(',')[0],
                                                count: order.productList[i].count
                                            };
                                            orderList.push(productItem);
                                        }
                                        orderItem.productList = productList;
                                        orderList.push(orderItem);
                                    }
                                });
                                result.orderList = orderList;
                                result.page = page;
                            }
                            return callback(null, result);
                        });
                    } catch (ex) {
                        logger.error("订单服务异常:" + ex);
                        return callback(2, null);
                    }

                }
            ],
            function (err, results) {
                if (err) {
                    result.code = 500;
                    result.desc = "获取物流商列表";
                    response.json(result);
                    return;
                } else {
                    if (results[1] != null) {
                        response.json(results[1]);
                        return;
                    }
                }
            }
        );
    } catch (ex) {
        logger.error("query expressList error:" + ex);
        result.code = 500;
        result.desc = "获取物流商列表";
        response.json(result);
    }
});


//查询卖家交易流水
router.post('/querydealList', function (request, response, next) {
    logger.info("进入查询交易流水流程");
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("查询交易流水请求入参，params:" + JSON.stringify(params));

        if (params.sellerId == null || params.sellerId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        //if (params.date == null || params.date == "") {
        //    result.code = 500;
        //    result.desc = "参数错误";
        //    response.json(result);
        //    return;
        //}

        if (params.perCount == null || params.perCount == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.curPage == null || params.curPage == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        //-------------------------前台测试数据-----------------------------------
        result.perice="44.54";
        var productDeatilList=[];
        if(params.date=="2016-02-17"||params.date=="2015-11-28"||params.date=="2016-05-27"||params.date=="2016-05-28"){
            result.count=60;
            result.page = {
                total:60,
                pageCount:3
            };

            for(var i=1;i<=20;i++){
                productDeatilList.push({
                    productDetId:i,
                    date:"13:25:14",
                    type:"收款",
                    paymode:"积分+和包",
                    perice:"20.45"
                });
            }
        }else{
            result.count=1;
            result.page = {
                total:1,
                pageCount:1
            };
            for(var i=1;i<=1;i++){
                productDeatilList.push({
                    productDetId:i,
                    date:"12:28:35",
                    type:"收款",
                    paymode:"积分+和包",
                    perice:"12.47"
                });
            }
        }
        result.productDeatilList=productDeatilList;
        response.json(result);
        return;
        //------------------------------------------------------------------

        Order.querydealList(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(result);
            return
        });

    } catch (ex) {
        logger.error("查询交易流水失败，=========：" + ex);
        result.code = 500;
        result.desc = "查询交易流水失败";
        response.json(result);
    }
});

//查询卖家交易明细
router.post('/querydealDetail', function (request, response, next) {
    logger.info("进入查询卖家交易明细流程");
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("查询卖家交易明细请求入参，params:" + JSON.stringify(params));

        if (params.productDetId == null || params.productDetId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        //------------------------前台测试数据--------------------------------
        var productDetail={};
        productDetail=({
            type:2,
            payprice:"22.73",
            orderId:"234s234fwef43",
            mobile:"13211111111",
            nickname:"测试：nick名",
            paymode:"微信",
            dealdate:"2016-05-25 12:22:35"

        });
        result.productDetail=productDetail;
        response.json(result);
        return;
        //---------------------------------------------------------------

        Order.querydealDetail(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(result);
            return
        });

    } catch (ex) {
        logger.error("查询卖家交易明细失败，=========：" + ex);
        result.code = 500;
        result.desc = "查询卖家交易明细失败";
        response.json(result);
    }
});
/*扫码预生成订单*/
router.post('/payOrderCreates', function (request, response, next) {
    logger.info("进入扫码预生成订单");
    var result = {code: 200};
    try {
        var params = request.body;
        logger.info("扫码预生成订单请求入参, args:" + JSON.stringify(params));

        if (params.userId == null || params.userId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.username == null || params.username == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.sellerId == null || params.sellerId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.sellerName == null || params.sellerName == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.amount == null || params.amount == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.tradeCode == null || params.tradeCode == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        //----------------------------------------------------------------
        result.extend="33.28";
        var orderIdList=[];
        orderIdList.push("2");
        orderIdList.push("3");
        result.orderIdList=orderIdList;
        response.json(result);
        return;
        //---------------------------------------------------------------------

        Order.payOrderCreates(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.value = data[0].value;
            response.json(result);
            logger.info("响应的结果:" + JSON.stringify(result));
        });
    } catch (ex) {
        response.json(result);
    }
});


/*扫码预生成订单*/
router.post('/payOrderCreates', function (request, response, next) {
    logger.info("进入扫码预生成订单");
    var result = {code: 200};
    try {
        var params = request.body;
        logger.info("扫码预生成订单请求入参, args:" + JSON.stringify(params));

        if (params.userId == null || params.userId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.username == null || params.username == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.sellerId == null || params.sellerId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.sellerName == null || params.sellerName == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.amount == null || params.amount == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.tradeCode == null || params.tradeCode == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        //----------------------------------------------------------------
        result.extend="33.28";
        var orderIdList=[];
        orderIdList.push("2");
        orderIdList.push("3");
        result.orderIdList=orderIdList;
        response.json(result);
        return;
        //---------------------------------------------------------------------

        Order.payOrderCreates(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.value = data[0].value;
            response.json(result);
            logger.info("响应的结果:" + JSON.stringify(result));
        });
    } catch (ex) {
        response.json(result);
    }
});


router.post('/queryExportOrderInfo', function (request, response, next) {
    logger.info("进入导出订单的流程");
    var result = {code: 200};

    try {

        var params = request.body;

        if (params.sellerId == null || params.sellerId == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.startTime == null || params.startTime == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.endTime == null || params.endTime == "") {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Order.batchExportOrder(params, function (err, data) {
            if (err) {
                response.json(error);
                return;
            }else{
                response.json(data);
            }

        });

    } catch (ex) {
        logger.error("导出订单失败：" + ex);
        result.code = 500;
        result.desc = "导出订单失败";
        response.json(result);
    }
});

module.exports = router;