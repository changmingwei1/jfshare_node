/**
 * Created by zhaoshenghai on 16/3/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

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
    result.orderList = [];
    result.afterSaleList =[];
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
                    if (params.orderState == null) {
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
                                    type:orderInfo.productList[i].type
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
    );
});


//查询订单的售后状态列表
router.post('/queryafterSaleOrder', function (request, response,next) {
    var result = {code: 200};
    try {
        var params = request.body;
        logger.info("查询订单状态个数请求参数：" + JSON.stringify(params));
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        afterSale.queryAfterSale(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("Order.orderStateQuery response:" + JSON.stringify(data));

            result.afterSaleOrderList  = data;
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
        result.name = "";
        result.traceItems = "";
        //射为默认值
        params.orderId = "17870082";
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
            return;
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

        Order.cancelOrder(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(result);
            return;
        });

    } catch (ex) {
        logger.error("查询物流信息失败：" + ex);
        result.code = 500;
        result.desc = "查询物流信息失败";
        response.json(result);
    }
});
//导出订单
router.post('/queryExportOrderInfo', function (request, response, next) {
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


        Order.queryExportOrderInfo(params, function (err, data) {
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

//添加物流单
router.post('/deliver', function (request, response, next) {
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

        Order.deliver(params, function (err, data) {
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


//获取物流单
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


//获取物流商列表
router.post('/expresslist', function (request, response, next) {
    logger.info("进入取消订单流程");
    var result = {code: 200};

    try {

        var params = request.body;

        Express.queryList(params, function (err, data) {
            if (err) {
                response.json(error);
                return;
            }


            response.json(data);
            return;
        });

    } catch (ex) {
        logger.error("查询物流商列表失败：" + ex);
        result.code = 500;
        result.desc = "查询物流商列表失败";
        response.json(result);
    }
});



module.exports = router;