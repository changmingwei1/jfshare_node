/**
 * Created by zhaoshenghai on 16/3/21.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var xlsx = require('node-xlsx');
var fs = require('fs');
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var order_types = require('../lib/thrift/gen_code/order_types');
var Order = require('../lib/models/order');
var Util = require('../lib/models/util');
var afterSale = require('../lib/models/afterSale');
var Express = require('../lib/models/express');
var Product = require('../lib/models/product');
var Buyer = require('../lib/models/buyer');

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
    var orderIdList = [];
    async.series([
            function (callback) {
                logger.info("BUYER--data：");
                try {
                    if(params.loginName != null && params.loginName != ""){
                        Buyer.getBuyerInfo(params, function (err, data) {
                            logger.info("BUYER--data：" + JSON.stringify(data)+"  -----:params:"+JSON.stringify(params));
                            if (err) {
                                logger.error("Buyer服务异常");
                                return callback(1, null);
                            }
                            if (data[0].buyer != null) {
                                var buyer = data[0].buyer;
                                params.userId= buyer.userId;
                                return callback(null, params);
                            } else {
                                callback(1,null);
                            }
                        });
                    }else{
                        callback(null,params);
                    }
                } catch (ex) {
                    logger.info("调用buyer服务异常:" + ex);
                    return callback(1, null);
                }
            },
            function (callback) {
                try {
                    Order.orderProfileQuery(params, function (err, orderInfo) {
                        if (err) {
                            logger.error("订单服务异常");
                            return callback(2, null);
                        }
                        var page = {total: orderInfo.total, pageCount: orderInfo.pageCount};
                        var orderList = [];
                        if (orderInfo.orderProfileList !== null && orderInfo.orderProfileList.length > 0) {
                            for (var j = 0; j < orderInfo.orderProfileList.length; j++) {
                                var order = orderInfo.orderProfileList[j];
                                if (order.orderState >= 50) {
                                    orderIdList.push(order.orderId);
                                }
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
                                    receiverName: order.deliverInfo.receiverName,
                                    receiverMobile: order.deliverInfo.receiverMobile,
                                    receiverTele: order.receiverTele,
                                    orderState: order.orderState,
                                    sellerComment: order.sellerComment,
                                    buyerComment: order.buyerComment,
                                    deliverTime: order.deliverTime,
                                    successTime: order.successTime,
                                    exchangeCash: order.exchangeCash,
                                    exchangeScore: order.exchangeScore,
                                    activeState: order.activeState,
                                    curTime: order.curTime,
                                    payChannel: ""
                                };
                                if (order.payInfo != null) {
                                    orderItem.payChannel = order.payInfo.payChannel;
                                }
                                var productList = [];
                                if (order.productList !== null && order.productList.length > 0) {
                                    for (var i = 0; i < order.productList.length; i++) {
                                        var productItem = {
                                            productId: order.productList[i].productId,
                                            productName: order.productList[i].productName,
                                            skunum: order.productList[i].skuNum,
                                            skuDesc: order.productList[i].skuDesc,
                                            curPrice: order.productList[i].curPrice,
                                            imgUrl: "",
                                            count: order.productList[i].count,
                                            thirdExchangeRate: order.productList[i].thirdExchangeRate
                                        };
                                        if (order.productList[i].imagesUrl != null) {
                                            productItem.imgUrl = order.productList[i].imagesUrl.split(',')[0]
                                        }
                                        productList.push(productItem);
                                    }
                                    orderItem.productList = productList;
                                    orderList.push(orderItem);
                                }
                                //});
                            }

                            result.orderList = orderList;
                            result.page = page;
                            params.orderIdList = orderIdList;
                        }
                        logger.info("get order list response:" + JSON.stringify(result));
                        return callback(null, result);
                    });

                } catch (ex) {
                    logger.info("订单服务异常:" + ex);
                    return callback(2, null);
                }
            },
            function (callback) {
                try {
                    if ((params.orderState == null|| params.orderState == 5) && params.orderIdList != null && params.orderIdList.length > 0 ) {
                        afterSale.queryAfterSale(params, function (err, data) {
                            if (err) {
                                return callback(3, null);
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
                    return callback(3, null);
                }

            }
        ],
        function (err, results) {
            if (err == 1) {
                logger.error("查询账户信息失败---buyer服务异常：" + err);
                result.code = 500;
                result.desc = "查询账户信息";
                response.json(result);
                return;
            }
            if (err == 2) {
                logger.error("查询订单列表失败---订单服务异常：" + err);
                result.code = 500;
                result.desc = "查询订单失败";
                response.json(result);
                return;
            }
            if (err == null && err != 3) {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[1];
                result.afterSaleList = results[2];
                response.json(result);
                return;
            } else {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[1];

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


    var isVirtual = 0;

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
                        result.orderId = orderInfo.orderId;
                        result.closingPrice = orderInfo.closingPrice;
                        //result.orderState = Order.getOrderStateBuyerEnum(orderInfo.orderState);
                        result.orderState = orderInfo.orderState;
                        if (orderInfo.tradeCode == "Z0002" || orderInfo.tradeCode == "Z8002" || orderInfo.tradeCode == "Z8001") {
                            result.mobile = orderInfo.deliverInfo.receiverMobile;
                        } else {
                            if(orderInfo.deliverInfo!=null){
                                result.address = orderInfo.deliverInfo.provinceName +
                                    orderInfo.deliverInfo.cityName +
                                    orderInfo.deliverInfo.countyName +
                                    orderInfo.deliverInfo.receiverAddress;
                                result.receiverName = orderInfo.deliverInfo.receiverName;
                                result.mobile = orderInfo.deliverInfo.receiverMobile;
                            }
                        }
                        if (orderInfo.payInfo != null) {
                            result.payChannel = orderInfo.payInfo.payChannel;
                            result.payState =  orderInfo.payInfo.payState;
                            result.payTime =  orderInfo.payInfo.payTime; /*0921新增字段*/
                            if(result.payChannel == 1 || result.payChannel == 10){
                                result.tradePayId = orderInfo.tradePayId; /*payChannel为1和10的话，是外部订单，返回外部订单号*/
                            }
                        }


                        // result.curTime = new Date().getTime();
                        result.createTime = orderInfo.createTime;
                        result.deliverTime = orderInfo.deliverTime; //卖家发货时间
                        result.successTime = orderInfo.successTime; //确认收货时间
                        result.comment = orderInfo.buyerComment;
                        result.postage = orderInfo.postage;
                        result.sellerId = orderInfo.sellerId;
                        result.cancelTime = orderInfo.cancelTime;
                        params.userId = orderInfo.userId;

                        if(orderInfo.orderState == 61){
                            result.cancelDesc = "其他原因";
                            if(orderInfo.orderStateType ==1){
                                result.cancelDesc = "用户主动要求取消"
                            }
                            if(orderInfo.orderStateType ==4){
                                result.cancelDesc = "卖家缺货"
                            }

                        }

                        if (orderInfo.deliverInfo !== null) {
                            result.sellerComment = orderInfo.deliverInfo.sellerComment;
                            result.buyerComment = orderInfo.deliverInfo.buyerComment;
                            result.postCode = orderInfo.deliverInfo.postCode;
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

                        /*result.postageExt = orderInfo.postageExt; */
                        /*运费扩展信息  JSON*/
                        result.exchangeScore = orderInfo.exchangeScore; //添加字段
                        result.exchangeCash = orderInfo.exchangeCash; //添加字段
                        result.type = orderInfo.productList[0].type;
                        result.thirdScore = orderInfo.thirdScore;

                        result.thirdPrice =  orderInfo.thirdPrice;
                        var productList = [];
                        if (orderInfo.productList !== null && orderInfo.productList.length > 0) {

                            for (var i = 0; i < orderInfo.productList.length; i++) {
                                productList.push({
                                    productId: orderInfo.productList[i].productId,
                                    productName: orderInfo.productList[i].productName,
                                    sku: {
                                        skuNum: orderInfo.productList[i].skuNum,
                                        skuName: orderInfo.productList[i].skuDesc
                                    },
                                    curPrice: orderInfo.productList[i].curPrice,
                                    orgPrice: orderInfo.productList[i].orgPrice,
                                    imgKey: orderInfo.productList[i].imagesUrl,
                                    thirdExchangeRate: orderInfo.productList[i].thirdExchangeRate,
                                    count: orderInfo.productList[i].count
                                });
                            }
                            result.productList = productList;
                        }
                        params.sellerId = orderInfo.sellerId;
                        callback(null, result);
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
                            // result.afterSaleList = afterSaleList;
                            return callback(null, afterSaleList);
                        });
                    } else {
                        return callback(2, null);
                    }
                } catch (ex) {
                    logger.info("售后服务异常:" + ex);
                    return callback(2, null);
                }
            },
            function (callback) {
                /*根据买家id查询买家账户信息 0921新增*/
                try {
                    Buyer.getBuyer(params, function (err, data) {
                        if (err) {
                            return callback(3, null);
                        }
                        var buyer = data[0].buyer;
                        if (buyer != null) {
                            var loginName = buyer.loginName;
                            return callback(null,loginName);
                        } else {
                            callback(3,null);
                        }
                    });
                } catch (ex) {
                    logger.info("买家服务异常:" + ex);
                    return callback(3, null);
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
            if (err == 3) {
                logger.error("查询买家信息异常：" + err);
                result = results[0];
                result.afterSaleList = results[1];
                response.json(result);
                return;
            } else {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[0];
                result.afterSaleList = results[1];
                result.loginName = results[2];
                response.json(result);
                return;
            }
        }
    );
});


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
router.post('/queryOrder', function (request, response, next) {
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

            result.orderCountList = data;
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
////取消订单
//router.post('/cancelOrder', function (request, response, next) {
//    logger.info("进入取消订单流程");
//    var result = {code: 200};
//
//    try {
//
//        var params = request.body;
//
//        if (params.orderId == null || params.orderId == "") {
//
//            result.code = 500;
//            result.desc = "参数错误";
//            response.json(result);
//            return;
//        }
//
//        if (params.account == null || params.account == "") {
//            result.code = 500;
//            result.desc = "参数错误";
//            response.json(result);
//            return;
//        }
//
//        if (params.sellerId == null || params.sellerId == "") {
//            result.code = 500;
//            result.desc = "参数错误";
//            response.json(result);
//            return;
//        }
//        Order.cancelOrder(params, function (err, data) {
//            if (err) {
//                response.json(err);
//                return;
//            }
//            response.json(result);
//            return
//        });
//
//    } catch (ex) {
//        logger.error("查询物流信息失败：" + ex);
//        result.code = 500;
//        result.desc = "查询物流信息失败";
//        response.json(result);
//    }
//});


//更新物流单
router.post('/updateExpressInfo', function (request, response, next) {
    logger.info("进入更新物流单流程");
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


//获取售后的订单列表
router.post('/afterSalelist', function (request, response, next) {
    logger.info("进入获取售后的订单列表");
    var result = {code: 200};
    var afterOrderList = [];
    var orderList = [];
    try {
        var params = request.body;

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
        if (params.sellerId == "" || params.sellerId == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        var page = {total: 0, pageCount: 0};
        var isExist = 0;
        var afterSaleList = [];
        logger.info("进入获取售后的订单列表--params" + JSON.stringify(params));
        async.series([
                function (callback) {
                    try {
                        afterSale.queryAfterSaleOrderListBySellerId(params, function (err, data) {
                            if (err) {
                                callback(1, null);
                                return;
                            }
                            if (data == null || data.afterSaleOrders == null || data.afterSaleOrders.length == 0) {
                                isExist = 1;
                                return callback(null, 2);
                            } else {
                                if(data.pagination!=null){
                                    page.total = data.pagination.totalCount;
                                    page.pageCount = data.pagination.pageNumCount;
                                    callback(null, 1);
                                    return;
                                }else{
                                    page.total = 0;
                                    page.pageCount = 0;
                                    callback(null, 1);
                                    return;
                                }

                            }

                        });
                    }
                    catch
                        (ex) {
                        logger.error("售后服务异常:" + ex);
                        return callback(1, null);
                    }
                },
                function (callback) {
                    try {

                        var orderIdList = [];
                        logger.info("------isExist------:" + isExist);
                        if (isExist) {
                            result.orderList = orderList;
                            result.page = page;
                            return callback(null, result);
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
                            // page.total = orderInfo.total;
                            // page.pageCount = orderInfo.pageCount;
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
                                        // sellerComment: order.sellerComment,
                                        //  buyerComment: order.buyerComment,
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
                                                skuDesc: order.productList[i].skuDesc,
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
                            return callback(null, result);
                        });
                    } catch (ex) {
                        logger.info("订单服务异常:" + ex);
                        return callback(2, null);
                    }

                },

                function (callback) {
                    try {

                        afterSale.queryAfterSale(params, function (err, data) {
                            if (err) {
                                return callback(3, null);
                            }
                            logger.info("get order list response:" + JSON.stringify(result));
                            afterSaleList = data;
                            result.afterSaleList = afterSaleList;
                            return callback(null, result);
                        });
                    } catch (ex) {
                        logger.info("售后服务异常:" + ex);
                        return callback(3, null);
                    }
                }
            ],
            function (err, results) {
                if (err) {
                    result.code = 500;
                    result.desc = "查询售后订单列表失败";
                    response.json(result);
                    return;
                } else {
                    if (results[2] != null) {
                        response.json(results[2]);
                        return;
                    }
                }
            }
        );
    } catch (ex) {
        logger.error("query 售后失败:" + ex);
        result.code = 500;
        result.desc = "查询售后订单列表失败";
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
        if (params.date == null || params.date == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

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
        params.endDate=Util.getNextDay(params.date);

        Order.querydealList(params, function (err, data) {

            if (err) {
                response.json(err);
                return;
            } else {
                var orderProfilePage = data[0].orderProfilePage;
                var orderProfileList = data[0].orderProfilePage.orderProfileList;
                if (orderProfilePage == null || orderProfileList == null) {
                    result.code = 500;
                    result.desc = "查询交易流水失败！";
                    response.json(result);
                    return;
                }

                if (orderProfilePage.total == 0) {
                    var page = {
                        total: 0,
                        pageCount: orderProfilePage.pageCount
                    };
                    result.page = page;
                    response.json(result);
                    return
                }

                var count;
                var productDeatilList = [];
                var sumPerice = [];
                orderProfileList.forEach(function (order) {
                    productDeatilList.push({
                        productDetId: order.orderId,
                        type: "收款",
                        date: order.createTime,
                        paymode: order.payInfo.payChannel,
                        perice: order.closingPrice,
                        exchangeScore:order.exchangeScore
                    });
                    sumPerice.push(order.closingPrice);
                });
                for (var i = 0; i < productDeatilList.length; i++) {
                    if (productDeatilList[i].paymode == "1") {
                        if(productDeatilList[i].exchangeScore>0){
                            productDeatilList[i].paymode = "天翼+积分";
                        }else{
                            productDeatilList[i].paymode = "天翼";
                        }
                    } else if (productDeatilList[i].paymode == "2") {
                        if(productDeatilList[i].exchangeScore>0){
                            productDeatilList[i].paymode = "支付宝+积分";
                        }else{
                            productDeatilList[i].paymode = "支付宝";
                        }

                    } else if (productDeatilList[i].paymode == "3" || productDeatilList[i].paymode == "4" || productDeatilList[i].paymode == "9") {
                        if(productDeatilList[i].exchangeScore>0){
                            productDeatilList[i].paymode = "微信+积分";
                        }else{
                            productDeatilList[i].paymode = "微信";
                        }

                    } else if (productDeatilList[i].paymode == "5" || productDeatilList[i].paymode == "7") {
                        if(productDeatilList[i].exchangeScore>0){
                            productDeatilList[i].paymode = "支付宝+积分";
                        }else{
                            productDeatilList[i].paymode = "支付宝";
                        }
                    } else if (productDeatilList[i].paymode == "6" || productDeatilList[i].paymode == "8") {
                        if(productDeatilList[i].exchangeScore>0){
                            productDeatilList[i].paymode = "和包+积分";
                        }else{
                            productDeatilList[i].paymode = "和包";
                        }
                    } else {
                        productDeatilList[i].paymode = "积分";
                    }
                }
                var sum = 0;
                for (var i = 0; i < sumPerice.length; i++) {
                    sum += Number(sumPerice[i]);
                }

                count = productDeatilList.length;
                result.count = count;

                result.perice = sum.toFixed(2);
                result.productDeatilList = productDeatilList;

                var page = {
                    total: orderProfilePage.total,
                    pageCount: orderProfilePage.pageCount
                };
                result.page = page;

                logger.info("查询交易流水，response:" + JSON.stringify(result));

                response.json(result);
                return
            }

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
        if (params.sellerId == null || params.sellerId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

/*
        Order.querydealDetail(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            } else {
                var order = data[0].order;
                var orderDetail = {};

                if (order == null) {
                    result.code = 500;
                    result.desc = "参数错误";
                    response.json(result);
                    return;
                }

                if (order.deliverInfo == null) {
                    orderDetail.mobile = "";
                } else {
                    orderDetail.mobile = order.deliverInfo.receiverMobile;
                }

                if (order.payInfo == null) {
                    orderDetail.paymode = "";
                } else {
                    if (order.payInfo.payChannel == "1") {
                        orderDetail.paymode = "天翼";
                    } else if (order.payInfo.payChannel == "2") {
                        orderDetail.paymode = "支付宝";
                    } else if (order.payInfo.payChannel == "3" || order.payInfo.payChannel == "4" || order.payInfo.payChannel == "9") {
                        orderDetail.paymode = "微信";
                    } else if (order.payInfo.payChannel == "5" || order.payInfo.payChannel == "7") {
                        orderDetail.paymode = "支付宝";
                    } else if (order.payInfo.payChannel == "6" || order.payInfo.payChannel == "8") {
                        orderDetail.paymode = "和包";
                    } else {
                        orderDetail.paymode = "积分";
                    }
                }

                orderDetail.type = "收款";
                orderDetail.payprice = order.closingPrice;
                orderDetail.orderId = order.orderId;
                orderDetail.nickname = order.userName;
                orderDetail.dealdate = order.createTime;
                result.productDetail = orderDetail;
                response.json(result);
                return
            }

        });
        */
//----------------------------------------------------------------------------------
        var buyerTemp={};
        var orderDetail = {};
        async.series([
                function (callback) {
                    try {
                        Order.querydealDetail(params, function (err, data) {
                            if (err) {
                                callback(1, null);
                            } else {
                                var order = data[0].order;


                                if (order == null) {
                                    result.code = 500;
                                    result.desc = "参数错误";
                                    response.json(result);
                                    return;
                                }
                                params.userId=order.userId;
                                //if (order.deliverInfo == null) {
                                //    orderDetail.mobile = "";
                                //} else {
                                //    orderDetail.mobile = order.deliverInfo.receiverMobile;
                                //}

                                if (order.payInfo == null) {
                                    orderDetail.paymode = "";
                                } else {
                                    if (order.payInfo.payChannel == "1") {
                                        orderDetail.paymode = "天翼";
                                    } else if (order.payInfo.payChannel == "2") {
                                        orderDetail.paymode = "支付宝";
                                    } else if (order.payInfo.payChannel == "3" || order.payInfo.payChannel == "4" || order.payInfo.payChannel == "9") {
                                        orderDetail.paymode = "微信";
                                    } else if (order.payInfo.payChannel == "5" || order.payInfo.payChannel == "7") {
                                        orderDetail.paymode = "支付宝";
                                    } else if (order.payInfo.payChannel == "6" || order.payInfo.payChannel == "8") {
                                        orderDetail.paymode = "和包";
                                    } else {
                                        orderDetail.paymode = "积分";
                                    }
                                }

                                orderDetail.type = "收款";
                                orderDetail.payprice = order.closingPrice;
                                orderDetail.orderId = order.orderId;
                                //orderDetail.nickname = order.userName;
                                orderDetail.dealdate = order.createTime;
                                result.productDetail = orderDetail;
                            }

                            callback(null, result);
                        });

                    } catch (ex) {
                        logger.info("获取订单流水异常:" + ex);
                        result.code = 500;
                        result.desc = "获取流水失败";
                        response.json(result);
                        return;
                    }
                },
                function (callback) {
                    try {
                        logger.info("查询buyer params:" + JSON.stringify(params.userId));
                        Product.getBuyer(params, function (error, data) {
                            if (error) {
                                callback(2, null);
                            } else {
                                var buyer = data[0].buyer;
                                if (buyer != null) {
                                    //resContent.buyer = {
                                    //    userId: buyer.userId,
                                    //    userName: buyer.userName,
                                    //    favImg: buyer.favImg,
                                    //    birthday: buyer.birthday,
                                    //    sex: buyer.sex,
                                    //    mobile: buyer.mobile
                                    //};

                                    buyerTemp.userName=buyer.userName;
                                    buyerTemp.mobile=buyer.mobile;

                                    logger.info("个人用户信息响应:" + JSON.stringify(buyerTemp));
                                    callback(null, buyerTemp);

                                } else {
                                    result.code = 500;
                                    result.desc = "获取用户信息失败";
                                    response.json(result);
                                    logger.info("个人用户信息响应:" + JSON.stringify(result));
                                    return;
                                }
                            }
                        });

                    } catch (ex) {
                        logger.info("获取用户信息异常:" + ex);
                        result.code = 500;
                        result.desc = "获取用户信息失败";
                        response.json(result);
                        return;
                    }
                }
            ],
            function (err, results) {

                logger.info("result[0]:" + JSON.stringify(results[0]));
                logger.info("result[1]:" + JSON.stringify(results[1]));

                if (err == 1) {
                    logger.error("获取流水失败---order服务异常：" + err);
                    result.code = 500;
                    result.desc = "获取流水失败";
                    response.json(result);
                    return;
                }
                if (err == 2) {
                    logger.error("获取用户信息异常--order服务异常：" + err);
                    result.code = 500;
                    result.desc = "获取流水失败";
                    response.json(result);
                    return;
                }


                if (err == null) {
                    logger.info("shuju------------->" + JSON.stringify(results));

                    var proDetail= result.productDetail;
                    if(proDetail==null){
                        result.code = 500;
                        result.desc = "获取详情失败";
                        response.json(result);
                        return;
                    }
                    if(buyerTemp==null){
                        response.json(result);
                        return;
                    }

                    proDetail.mobile=buyerTemp.mobile;
                    proDetail.nickname=buyerTemp.userName;
                    response.json(result);
                    return;
                }
            });
        //--------------------------------------------------------------------------
    } catch (ex) {
        logger.error("查询卖家交易明细失败，=========：" + ex);
        result.code = 500;
        result.desc = "查询卖家交易明细失败";
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

        Order.batchExportOrder(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            } else {
                result.url = "http://101.201.39.63/" + data;
                response.json(result);
            }

        });

    } catch (ex) {
        logger.error("导出订单失败：" + ex);
        result.code = 500;
        result.desc = "导出订单失败";
        response.json(result);
    }
});

/*提交订单*/
router.post('/payOrderCreates', function (request, response, next) {
    logger.info("进入提交订单流程..");
    var result = {code: 200};
    try {
        var arg = request.body;
        if (arg == null || arg.userId == null || arg.sellerDetailList == null) {
            result.code = 400;
            result.desc = "没有填写用户ＩＤ";
            response.json(result);
            return;
        }
        //if (arg.token == "" || arg.token == null) {
        //    result.code = 400;
        //    result.desc = "鉴权信息不能为空";
        //    response.json(result);
        //    return;
        //}
        //if (arg.ppInfo == "" || arg.ppInfo == null) {
        //    result.code = 400;
        //    result.desc = "鉴权信息不能为空";
        //    response.json(result);
        //    return;
        //}
        //if (arg.browser == "" || arg.browser == null) {
        //    result.code = 400;
        //    result.desc = "浏览器标识不能为空";
        //    response.json(result);
        //    return;
        //}
        logger.info("提交订单请求， arg:" + JSON.stringify(arg));
//暂时去掉鉴权信息
//        Buyer.validAuth(arg, function (err, data) {
//            if (err) {
//                response.json(err);
//                return;
//            }
        Order.orderConfirm(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.orderIdList = data[0].orderIdList;
            //result.extend = JSON.parse(data[0].extend);
            response.json(result);
        });
        //});
    } catch (ex) {
        logger.error("submit order error:" + ex);
        result.code = 500;
        result.desc = "提交订单失败";
        response.json(result);
    }
});
var http = require('http');
/*批量发货*/
router.post('/batchDeliverOrder', function (request, response, next) {
    logger.info("进入批量发货流程..");
    var result = {code: 200};
    try {
        var params = request.body;
        logger.info("进入批量发货流程params:" + JSON.stringify(params));
        if (params.sellerId == "" || params.sellerId == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.path == "" || params.path == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        params.path ="http://101.201.39.61/system/v1/jfs_image/"+params.path;
       // logger.error("这不是错误，只是想看一下路径，不要去掉:"+ params.path);
        var isDownLoad = false;
        async.series([
                function (callback) {
                    try {
                        Order.downLoad(params, function (err, data) {
                            if (err) {
                                return callback(1, null);
                            } else {
                                isDownLoad = true;
                                return callback(null, isDownLoad);
                            }
                        });

                    } catch (ex) {
                        logger.info("下载物流单失败:" + ex);
                        return callback(1, null);
                    }
                },
                function (callback) {
                    try {
                        if (!isDownLoad) {
                            return callback(1, null);
                        }
                        var json = xlsx.parse("/data/run/jfshare_node/jfshare_seller_proxy/excel/excel.xlsx");
                        // console.log(json);
                        var list = [];
                        if (json != null && json.length > 0) {

                            var sheetData = json[0];

                            if (sheetData != null && sheetData.data != null && sheetData.data.length > 1) {

                                for (var i = 1; i < sheetData.data.length; i++) {

                                    if (sheetData.data[i].length >= 3) {
                                        var deliverInfo = new order_types.DeliverInfo({
                                            expressName: sheetData.data[i][2],
                                            expressNo: sheetData.data[i][1] + "",
                                            sellerComment: ""
                                        });
                                        if(sheetData.data[i].length > 3 &&sheetData.data[i][3]!=null && sheetData.data[i][3]!=""){
                                            deliverInfo.sellerComment = sheetData.data[i][3];
                                        }
                                        var order = new order_types.Order({
                                            orderId: sheetData.data[i][0] + "",
                                            deliverInfo: deliverInfo
                                        });
                                        list.push(order);
                                    }

                                }
                            }
                        }
                        params.list = list;
                        if (list.length > 0) {
                            Order.batchDeliverOrder(params, function (err, data) {
                                if (err) {
                                    return callback(err, err);
                                }
                                return callback(null, data);
                            });
                        } else {
                            callback(2, null);
                        }

                    } catch (ex) {
                        logger.info("批量发货失败:" + ex);
                        return callback(2, null);
                    }

                }
            ],
            function (err, results) {
                if (err) {
                    if (err == 1 || err == 2) {
                        result.code = 500;
                        result.desc = "批量发货失败";
                        response.json(result);
                    } else {
                        response.json(err);
                    }

                } else {
                    response.json(result);
                }
            });


        //});
    } catch (ex) {
        logger.error("批量发货 error:" + ex);
        result.code = 500;
        result.desc = "批量发货失败";
        response.json(result);
    }
});


//添加物流单-发货
router.post('/deliver', function (request, response, next) {
    logger.info("进入添加物流单流程");
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
        if (params.userId == null || params.userId == "") {

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
        logger.error("发货失败：" + ex);
        result.code = 500;
        result.desc = "发货信息失败";
        response.json(result);
    }
});
//更新物流单
router.post('/updateExpressInfo', function (request, response, next) {
    logger.info("进入更新物流单流程");
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("进入更新物流单流程---params" + JSON.stringify(params));
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
        logger.error("更新物流单失败：" + ex);
        result.code = 500;
        result.desc = "更新物流单失败";
        response.json(result);
    }
});


//获取物流单
router.post('/getExpressInfo', function (request, response, next) {
    logger.info("进入获取物流订单流程");
    var result = {code: 200};

    try {

        var params = request.body;
        logger.info("进入获取物流单流程" + JSON.stringify(params));
        //卖家
        params.userType = 2;
        if (params.sellerId == null || params.sellerId == "") {

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


        Order.queryOrderDetail(params, function (err, orderInfo) {
            if (err) {
                response.json(error);
                return;
            }

            result.orderId = orderInfo.orderId;


            logger.info(orderInfo.deliverInfo);
            if (orderInfo.deliverInfo != null) {
                result.expressId = orderInfo.deliverInfo.expressId;
                result.expressName = orderInfo.deliverInfo.expressName;
                result.expressNo = orderInfo.deliverInfo.expressNo;
                result.sellerComment = orderInfo.deliverInfo.sellerComment;
                result.buyerComment = orderInfo.deliverInfo.buyerComment;
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


module.exports = router;