/**
 * @author YinBo on 16/4/25.
 */

var express = require('express');
var router = express.Router();
var async = require('async');
var urlencode = require('urlencode');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Util = require('../lib/models/util');
var Order = require('../lib/models/order');
var Address = require('../lib/models/address');
var Seller = require('../lib/models/seller');
var Express = require('../lib/models/express');
var AfterSale = require('../lib/models/afterSale');
var Pay = require('../lib/models/pay');
var Buyer = require('../lib/models/buyer');
var BaseTemplate = require('../lib/models/baseTemplate');

var product_types = require("../lib/thrift/gen_code/product_types");

/*提交订单*/
router.post('/submit', function (request, response, next) {
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
        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.browser == "" || arg.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            response.json(result);
            return;
        }
        logger.info("提交订单请求， arg:" + JSON.stringify(arg));
//暂时去掉鉴权信息
        Buyer.validAuth(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            async.series([
                    /*根据商品id查找类目id*/
                    function(callback){
                        var productId = arg.sellerDetailList[0].productList[0].productId;
                        Product.queryProduct(productId, 1, 1, 1, 1, function (err, data) {
                            if (err) {
                                return callback(1,null);
                            }
                            var product = data[0].product;
                            arg.subjectId = product.subjectId;
                            arg.thirdExchangeRate = product.thirdExchangeRate;
                            callback(null, result);
                        });
                    },
                    /*根据类目id,得到商品类型commodity*/
                    function(callback){
                        Product.getById4dis(arg, function(err,data){
                            if(err){
                                return callback(2,null);
                            } else {
                                var displaySubjectInfo = data[0].displaySubjectInfo;
                                var commodity = displaySubjectInfo.commodity;
                                var tradeCode;
                                if(commodity == 1){
                                    tradeCode = "Z0003";
                                }
                                if(commodity == 2){
                                    tradeCode = "Z8001";
                                }
                                arg.tradeCode = tradeCode;
                                logger.info("tradeCode的值为：" + arg.tradeCode);
                                callback(null,result);
                            }
                        });
                    },
                    function(callback){
                        Order.orderConfirm(arg, function (err, data) {
                            if (err) {
                                response.json(err);
                                return;
                            }
                            result.orderIdList = data[0].orderIdList;
                            //result.extend = JSON.parse(data[0].extend);
                            response.json(result);
                        });
                    }
                ],
                function (err, results) {
                    if (err == 1) {
                        result.code = 500;
                        result.desc = "查询商品类目失败";
                        response.json(result);
                        return;
                    } else if (err == 2) {
                        result.code = 500;
                        result.desc = "查询商品类型失败";
                        response.json(result);
                        return;
                    }
            });
        });
    } catch (ex) {
        logger.error("submit order error:" + ex);
        result.code = 500;
        result.desc = "提交订单失败";
        response.json(result);
    }
});

//取消订单
router.post('/cancelOrder', function (req, res, next) {
    logger.info("进入取消订单接口");
    var result = {code: 200};

    try {
        var arg = req.body;
        if (arg.userId == null || arg.userId == "" || arg.userId <= 0) {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if (arg.orderId == null || arg.orderId == "") {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.browser == "" || arg.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            response.json(result);
            return;
        }

        logger.info("请求参数，arg：" + JSON.stringify(arg));
        //暂时去掉鉴权信息
        Buyer.validAuth(arg, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            Order.cancelOrder(arg, function (err, data) {
                if (err) {
                    res.json(err);
                    return;
                }
                res.json(result);
            });
        });
    } catch (ex) {
        logger.error("不能取消，原因是:" + ex);
        result.code = 500;
        result.desc = "取消订单失败";
        res.json(result);
    }
});

/*获取售后的订单列表*/
router.post('/afterSaleList', function (request, response, next) {
    logger.info("进入获取售后的订单列表");
    var result = {code: 200};
    var afterOrderList = [];
    var orderList = [];
    var sellerMsgList = [];
    try {
        var params = request.body;
        if (params.perCount == "" || params.perCount == null) {
            result.code = 400;
            result.desc = "每页显示条数不能为空";
            response.json(result);
            return;
        }
        if (params == null || params.userId == "" || params.userId == null) {
            result.code = 400;
            result.desc = "参数错误，用户id不能为空";
            response.json(result);
            return;
        }
        if (params.token == "" || params.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.ppInfo == "" || params.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.browser == "" || params.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            response.json(result);
            return;
        }
        logger.info("获取售后订单请求的参数：" + JSON.stringify(params));
//暂时去掉鉴权信息
        Buyer.validAuth(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            async.series([
                    function (callback) {
                        try {
                            AfterSale.queryAfterSaleOrder(params, function (err, data) {
                                if (err) {
                                    callback(1, null);
                                    return;
                                }
                                afterOrderList = data.afterSaleOrders;
                                if (afterOrderList != null && afterOrderList.length > 0) {
                                    result.afterOrderList = afterOrderList;
                                    var pagination = data.pagination;
                                    var page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
                                    result.page = page;
                                    callback(null, result);
                                } else {
                                    result.afterOrderList = [];
                                    callback(5, null);
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
                            var orderIdList = [];
                            for (var i = 0; i < afterOrderList.length; i++) {
                                orderIdList.push(afterOrderList[i].orderId);
                            }
                            params.orderList = orderIdList;
                            Order.orderProfileQuery(params, function (err, orderInfo) {
                                if (err) {
                                    logger.error("订单服务异常");
                                    return callback(2, null);
                                }
                                //var page = {total: orderInfo.total, pageCount: orderInfo.pageCount};
                                //result.page = page;
                                if (orderInfo.orderProfileList !== null) {
                                    orderInfo.orderProfileList.forEach(function (order) {
                                        var orderItem = {
                                            orderId: order.orderId,
                                            userId: order.userId,
                                            closingPrice: order.closingPrice,
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
                                            curTime: order.curTime
                                        };
                                        var productList = [];
                                        if (order.productList !== null && order.productList.length > 0) {
                                            for (var i = 0; i < order.productList.length; i++) {
                                                var productItem = {
                                                    productId: order.productList[i].productId,
                                                    productName: order.productList[i].productName,
                                                    skuNum: order.productList[i].skuNum,
                                                    skuName: order.productList[i].skuDesc,
                                                    curPrice: order.productList[i].curPrice,
                                                    imgKey: order.productList[i].imagesUrl.split(',')[0],
                                                    count: order.productList[i].count
                                                };
                                                productList.push(productItem);
                                            }
                                            orderItem.productList = productList;
                                            orderList.push(orderItem);
                                        }
                                    });
                                    result.orderList = orderList;
                                    params.sellerIdList = orderList;
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
                            Seller.querySellerBatch(params, function (err, data) {
                                if (err) {
                                    return callback(3, null);
                                }
                                var smList = data.sellerMap;
                                for (var i in smList) {
                                    var seller = {
                                        sellerId: i,
                                        sellerName: smList[i].seller.sellerName
                                    };
                                    sellerMsgList.push(seller);
                                }
                                result.sellerList = sellerMsgList;
                                logger.info("get sellerMsgList response:" + JSON.stringify(sellerMsgList));
                                return callback(null, result);
                            });
                        } catch (ex) {
                            logger.info("商家服务异常:" + ex);
                            return callback(3, null);
                        }
                    }
                    //function (callback) {
                    //    try {
                    //        logger.info("++++++++++++++" + JSON.stringify(params));
                    //        AfterSale.queryAfterSale(params, function (err, data) {
                    //            if (err) {
                    //                return callback(4, null);
                    //            }
                    //            logger.info("get order list response:" + JSON.stringify(result));
                    //            var afterSaleList = data;
                    //            //result.afterSaleList = afterSaleList;/*注掉,不用了*/
                    //            return callback(null, result);
                    //        });
                    //    } catch (ex) {
                    //        logger.info("售后服务异常:" + ex);
                    //        return callback(4, null);
                    //    }
                    //}
                ],
                function (err, results) {
                    if (err == 5) {
                        result.code = 200;
                        response.json(result);
                        return;
                    } else if (err) {
                        result.code = 500;
                        result.desc = "获取售后列表失败";
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
        });
    } catch (ex) {
        logger.error("query expressList erroraaaa:" + ex);
        result.code = 500;
        result.desc = "获取售后列表";
        response.json(result);
    }
});

//获取售后的订单列表
router.post('/afterSaleList1', function (request, response, next) {
    logger.info("进入获取售后的订单列表");
    var result = {code: 200};
    var afterOrderList = [];
    var orderList = [];
    try {
        var params = request.body;

        if (params.userId == "" || params.userId == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.perCount == "" || params.perCount == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.curPage == "" || params.curPage == null) {
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
                        AfterSale.queryAfterSaleOrder(params, function (err, data) {
                            if (err) {
                                callback(1, null);
                                return;
                            }
                            if (data == null || data.afterSaleOrders == null || data.afterSaleOrders.length == 0) {
                                callback(null, 2);
                                isExist = 1;
                            } else {
                                afterOrderList = data.afterSaleOrders;
                                page = data.pagination;
                                callback(null, 1);
                                return;
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
                        var page = {total: 0, pageCount: 0};
                        var orderIdList = [];
                        logger.info("------isExist------:" + isExist);
                        if (isExist) {
                            result.orderList = orderList;
                            result.page = page;
                            return callback(null, 2);
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
        logger.error("query 售后失败:" + ex);
        result.code = 500;
        result.desc = "查询售后订单列表";
        response.json(result);
    }
});

/*查询订单列表*/
router.post('/list', function (request, response, next) {

    try {
        var result = {code: 200};
        var params = request.body;
        if (params.userId == null || params.userId == "" || params.userId <= 0) {
            result.code = 400;
            result.desc = "用户id不能为空";
            response.json(result);
            return;
        }
        if (params.token == "" || params.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.ppInfo == "" || params.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.browser == "" || params.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            response.json(result);
            return;
        }
        if (params.perCount == null || params.perCount == "" || params.perCount <= 0) {
            result.code = 400;
            result.desc = "请输入每页显示数量";
            response.json(result);
            return;
        }
        logger.info("提交订单请求参数， arg:" + JSON.stringify(params));
        var afterSaleList = [];
        var sellerMsgList = [];
        var orderIdList = [];
        result.orderList = [];
        result.afterSaleList = [];
        Buyer.validAuth(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
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
                                if (orderInfo.orderProfileList !== null  && orderInfo.orderProfileList.length > 0) {
                                    for(var j=0;j<orderInfo.orderProfileList.length;j++) {
                                        var order = orderInfo.orderProfileList[j];
                                        if(order.orderState>=50){
                                            orderIdList.push(order.orderId);
                                        }
                                        //临时修改：因安卓没有62状态，所以62状态转换为61
                                        if(order.orderState==62){
                                            order.orderState=61;
                                        }
                                        var orderItem = {
                                            orderId: order.orderId,
                                            tradeCode:order.tradeCode,
                                            closingPrice: order.closingPrice,
                                            //添加了应答的数据
                                            postage: order.postage,
                                            username: order.username,
                                            cancelTime: order.cancelTime,
                                            sellerId: order.sellerId,
                                            createTime: order.createTime,
                                            orderState: order.orderState,
                                            sellerComment: order.sellerComment,
                                            buyerComment: order.buyerComment,
                                            deliverTime: order.deliverTime,
                                            successTime: order.successTime,
                                            activeState: order.activeState,
                                            postage: order.postage,
                                            type: order.productList[0].type  //5.17测没有type
                                        };
                                        if(order.deliverInfo != null ){
                                            orderItem.expressId = order.deliverInfo.expressId;
                                            orderItem.expressNo = order.deliverInfo.expressNo;
                                        }
                                        var productList = [];
                                        if (order.productList !== null && order.productList.length > 0) {
                                            for (var i = 0; i < order.productList.length; i++) {
                                                var productItem = {
                                                    productId: order.productList[i].productId,
                                                    productName: order.productList[i].productName,
                                                    skuNum: order.productList[i].skuNum,
                                                    skuName: order.productList[i].skuDesc,
                                                    curPrice: order.productList[i].curPrice,
                                                    imgKey: "",
                                                    count: order.productList[i].count
                                                };
                                                if(order.productList[i].imagesUrl != null){
                                                    productItem.imgKey = order.productList[i].imagesUrl.split(',')[0];
                                                }
                                                productList.push(productItem);
                                            }
                                            orderItem.productList = productList;
                                            orderList.push(orderItem);
                                        }
                                    }
                                    params.sellerIdList = orderList;
                                    params.orderIdList = orderIdList;
                                    result.orderList = orderList;
                                    /*给出系统当前时间*/
                                    result.curTime = new Date().getTime();
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
                            Seller.querySellerBatch(params, function (err, data) {
                                if (err) {
                                    return callback(4, null);
                                }
                                var smList = data.sellerMap;
                                for (var i in smList) {
                                    var seller = {
                                        sellerId: i,
                                        sellerName: smList[i].seller.sellerName
                                    };
                                    sellerMsgList.push(seller);
                                }
                                logger.info("get sellerMsgList response:" + JSON.stringify(sellerMsgList));
                                return callback(null, sellerMsgList);
                            });
                        } catch (ex) {
                            logger.info("商家服务异常:" + ex);
                            return callback(4, null);
                        }
                    },
                    function (callback) {
                        try {
                            if (params.orderState == null && params.orderIdList!=null && params.orderIdList.length > 0) {
                                AfterSale.queryAfterSale(params, function (err, data) {
                                    if (err) {
                                        return callback(2, null);
                                    }
                                    afterSaleList = data;
                                    return callback(null, afterSaleList);
                                });
                            } else {
                                return callback(2, null);
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
                        logger.warn("查询售后失败--售后服务异常 ===> 这个不是错：" + err);
                        result.sellerList = results[1];
                        response.json(result);
                        return;
                    }
                    if (err == 4) {
                        logger.warn("查询卖家信息失败--卖家服务异常：" + err);
                        result.afterSaleList = results[2];
                        response.json(result);
                        return;
                    } else {
                        logger.info("shuju222------------->" + JSON.stringify(results));
                        result = results[0];
                        result.afterSaleList = results[2];
                        result.sellerList = results[1];
                        response.json(result);
                        return;
                    }
                });
        });
    } catch (ex) {
        logger.error("查询订单列表失败---订单服务异常：" + err);
        result.code = 500;
        result.desc = "查询订单失败";
        response.json(result);
        return;
    }
});

/*查询各订单状态的数量*/
router.post('/count', function (request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code: 200};

    var arg = request.body;
    if (arg.userId == null || arg.userId == "" || arg.userId <= 0) {
        resContent.code = 400;
        resContent.desc = "用户id不能为空";
        response.json(resContent);
        return;
    }
    if (arg.token == "" || arg.token == null) {
        resContent.code = 400;
        resContent.desc = "鉴权信息不能为空";
        response.json(resContent);
        return;
    }
    if (arg.ppInfo == "" || arg.ppInfo == null) {
        resContent.code = 400;
        resContent.desc = "鉴权信息不能为空";
        response.json(resContent);
        return;
    }
    if (arg.browser == "" || arg.browser == null) {
        resContent.code = 400;
        resContent.desc = "浏览器标识不能为空";
        response.json(resContent);
        return;
    }
    logger.info("请求参数信息" + JSON.stringify(arg));
    try {
        Buyer.validAuth(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Order.orderStateQuery(arg, function (err, data) {
                if (err) {
                    response.json(err);
                    return;
                }
                resContent.orderCountList = data;
                response.json(resContent);
                logger.info("各状态对应的数量是:" + JSON.stringify(resContent));
            });
        });
    } catch (ex) {
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "获取用户积分失败";
        response.json(resContent);
    }
});

/*获取订单中的卡密列表*/
router.post('/getVirtualCard', function (request, response, next) {
    logger.info("进入获取订单中的卡密列表");
    var result = {code: 200};
    try {
        var params = request.body;
        if (params.orderId == "" || params.orderId == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "" || params.userId <= 0) {
            result.code = 400;
            result.desc = "用户id不能为空";
            response.json(result);
            return;
        }
        if (params.token == "" || params.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.ppInfo == "" || params.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.browser == "" || params.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            response.json(result);
            return;
        }
        logger.info("进入获取订单中的卡密列表, params:" + JSON.stringify(params));
        Buyer.validAuth(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Product.getProductCard(params, function (err, data) {
                if (err) {
                    response.json(err);
                    return;
                } else {
                    var cList = data[0].cardList;
                    var cardList = [];
                    if (cList != null && cList.length > 0) {
                        cList.forEach(function (a) {
                            cardList.push({
                                cardNumber: a.cardNumber,
                                password: a.password
                            });
                        });
                    }
                    result.cardList = cardList;
                    response.json(result);
                    logger.info("get virtual-order carlist response: " + JSON.stringify(result));
                }
            });
        });
    } catch (ex) {
        logger.error("get virtual-order carlist  error:" + ex);
        result.code = 500;
        result.desc = "获取订单中的卡密失败";
        response.json(result);
    }
});

/*查询订单详情--实物&虚拟*/
router.post('/info', function (req, res, next) {
    var result = {code: 200};
    try {
        var params = req.body;
        if (params.userId == null || params.userId == "" || params.userId <= 0) {
            result.code = 400;
            result.desc = "用户id不能为空";
            res.json(result);
            return;
        }
        if (params.token == "" || params.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (params.ppInfo == "" || params.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (params.browser == "" || params.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            res.json(result);
            return;
        }
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "订单id不能为空";
            res.json(result);
            return;
        }
        logger.info("查询订单祥情请求参数：" + JSON.stringify(params));
        var afterSaleList = [];
        var sellerName = {};
        Buyer.validAuth(params, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            async.series([
                    function (callback) {
                        try {
                            Order.queryOrderDetail(params, function (err, orderInfo) {
                                if (err) {
                                    callback('error', err);
                                    return;
                                }
                                if (orderInfo.orderId == null) {
                                    result.code = 404;
                                    result.desc = "未找到订单";
                                    res.json(result);
                                    return;
                                }
                                result.orderId = orderInfo.orderId;
                                result.closingPrice = orderInfo.closingPrice;
                                //result.orderState = Order.getOrderStateBuyerEnum(orderInfo.orderState);

                                //临时修改：因安卓没有62状态，所以62状态转换为61
                                if(orderInfo.orderState==62){
                                    result.orderState=61;
                                }else{
                                    result.orderState = orderInfo.orderState;
                                }

                                if (orderInfo.tradeCode == "Z0002" || orderInfo.tradeCode == "Z8002" || orderInfo.tradeCode == "Z8001") {
                                    result.mobile = orderInfo.deliverInfo.receiverMobile;
                                    result.sellerComment = orderInfo.deliverInfo.sellerComment;
                                    result.comment = orderInfo.deliverInfo.buyerComment;
                                    result.provinceId = orderInfo.deliverInfo.provinceId;
                                } else {
                                    result.address = orderInfo.deliverInfo.provinceName +
                                        orderInfo.deliverInfo.cityName +
                                        orderInfo.deliverInfo.countyName +
                                        orderInfo.deliverInfo.receiverAddress;
                                    result.receiverName = orderInfo.deliverInfo.receiverName;
                                    result.mobile = orderInfo.deliverInfo.receiverMobile;
                                    result.expressId = orderInfo.deliverInfo.expressId;
                                    result.expressNo = orderInfo.deliverInfo.expressNo;
                                    result.expressName = orderInfo.deliverInfo.expressName;
                                    result.sellerComment = orderInfo.deliverInfo.sellerComment;
                                    result.comment = orderInfo.deliverInfo.buyerComment;
                                    result.provinceId = orderInfo.deliverInfo.provinceId;
                                }
                                if (orderInfo.payInfo != null) {
                                    result.payChannel = orderInfo.payInfo.payChannel;
                                    result.payState = orderInfo.payInfo.payState;
                                }
                                result.curTime = new Date().getTime();
                                result.createTime = orderInfo.createTime;
                                result.deliverTime = orderInfo.deliverTime; //卖家发货时间
                                result.successTime = orderInfo.successTime; //确认收货时间
                                result.postage = orderInfo.postage;
                                result.payId = orderInfo.payId;
                                result.tradePayId = orderInfo.tradePayId;
                                result.sellerId = orderInfo.sellerId;
                                /*result.postageExt = orderInfo.postageExt; */
                                /*运费扩展信息  JSON*/
                                result.exchangeScore = orderInfo.exchangeScore; //添加字段
                                result.exchangeCash = orderInfo.exchangeCash; //添加字段
                                result.type = orderInfo.productList[0].type;
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
                                            count: orderInfo.productList[i].count
                                        });
                                    }
                                    result.productList = productList;
                                }
                                params.sellerId = orderInfo.sellerId;
                                logger.info("get order info response:" + JSON.stringify(result));
                                callback(null, result);
                            });
                        } catch (ex) {
                            logger.info("订单服务异常:" + ex);
                            return callback(1, null);
                        }
                    },
                    function (callback) {
                        try {
                            Seller.querySeller(params.sellerId, 1, function (err, data) {
                                if (err) {
                                    callback('error', err);
                                    return;
                                } else {
                                    sellerName = data[0].seller.sellerName;
                                    logger.info("查询到的卖家名字：" + sellerName);
                                    callback(null, sellerName);
                                }
                            });
                        } catch (ex) {
                            logger.info("卖家服务异常:" + ex);
                            return callback(2, null);
                        }
                    },
                    function (callback) {
                        try {
                            AfterSale.queryAfterSale(params, function (err, data) {
                                if (err) {
                                    return callback(3, null);
                                }
                                logger.info("get order list response:" + JSON.stringify(result));
                                afterSaleList = data;
                                return callback(null, afterSaleList);
                            });
                        } catch (ex) {
                            logger.info("售后服务异常:" + ex);
                            return callback(3, null);
                        }
                    }
                ],
                function (err, results) {
                    if (err == 1) {
                        result.code = 500;
                        result.desc = "查看商品详情失败";
                        res.json(result);
                        return;
                    } else if (err == 2) {
                        logger.error("查询卖家信息失败--卖家服务异常：" + err);
                        result = results[0];
                        result.afterSaleList = results[2];
                        res.json(result);
                        return;
                    } else if (err == 3) {
                        logger.error("查询售后信息失败--售后服务异常：" + err);
                        result = results[0];
                        result.sellerName = results[1];
                        res.json(result);
                        return;
                    } else {
                        result = results[0];
                        result.sellerName = results[1];
                        result.afterSaleList = results[2];
                        res.json(result);
                        return;
                    }
                });
        });
    } catch (ex) {
        logger.error("查询订单详情失败：" + ex);
        result.code = 500;
        result.desc = "查询订单详情失败";
        res.json(result);
    }
});

/*获取支付的url*/
router.post('/pay', function (req, res, next) {
    logger.info("进入获取支付url接口..");
    var result = {code: 200};
    var arg = req.body;
    if (arg == null || arg.payChannel == null || arg.orderIdList == null || arg.orderIdList.length <= 0) {
        result.code = 400;
        result.desc = "请求参数错误";
        res.json(result);
        return;
    }
    if (arg.userId == null || arg.userId == "" || arg.userId <= 0) {
        result.code = 400;
        result.desc = "用户id不能为空";
        res.json(result);
        return;
    }
    if (arg.token == "" || arg.token == null) {
        result.code = 400;
        result.desc = "鉴权信息不能为空";
        res.json(result);
        return;
    }
    if (arg.ppInfo == "" || arg.ppInfo == null) {
        result.code = 400;
        result.desc = "鉴权信息不能为空";
        res.json(result);
        return;
    }
    if (arg.browser == "" || arg.browser == null) {
        result.code = 400;
        result.desc = "浏览器标识不能为空";
        res.json(result);
        return;
    }
    logger.info("订单支付请求参数 request:" + JSON.stringify(arg));
    Buyer.validAuth(arg, function (err, data) {
        if (err) {
            res.json(err);
            return;
        }
        if (arg.payChannel == 4) {
            //Util.getCode(arg,function(err, data){
            //    arg.code = data;
            Util.getOpenApi(arg, function (err, data) {
                try {
                    logger.info("get open id response: " + JSON.stringify(data));
                    var jsonData = JSON.parse(data);
                    if (err == 500 || jsonData.openid == undefined) {
                        logger.error("error:" + err);
                        result.code = 500;
                        result.desc = "获取支付URL失败";
                        res.json(result);
                        return;
                    }
                    logger.info("jsonData:" + JSON.stringify(jsonData));
                    arg.openId = jsonData.openid;

                    logger.info("arg:" + JSON.stringify(arg));
                    Order.payApply(arg, function (err, payUrl) {
                        if (err) {
                            res.json(err);
                            return;
                        }
                        if (payUrl !== null) {
                            var urlInfo = JSON.parse(payUrl.value);
                            result.payUrl = urlInfo;
                            res.json(result);
                            logger.info("order pay response:" + JSON.stringify(result));
                        }
                    });
                }
                catch (ex) {
                    logger.error("获取支付信息失败:" + ex);
                    result.code = 500;
                    result.desc = "获取支付URL失败";
                    res.json(result);
                    return;
                }
            });
            //});
        } else if (arg.payChannel == 9) {
            try {
                Order.payApply(arg, function (err, payUrl) {
                    if (err) {
                        res.json(err);
                        return;
                    }
                    if (payUrl !== null) {
                        var urlInfo = JSON.parse(payUrl.value);
                        result.payUrl = {
                            prepayid: urlInfo.prepayid,
                            packageInfo: urlInfo.package,
                            appid: urlInfo.appid,
                            noncestr: urlInfo.noncestr,
                            sign: urlInfo.sign,
                            timestamp: urlInfo.timestamp,
                            partnerid: urlInfo.partnerid
                        };
                        res.json(result);
                        logger.info("order pay response:" + JSON.stringify(result));
                    }
                });
            } catch (ex) {
                logger.error("获取支付信息失败：" + ex);
                result.code = 500;
                result.desc = "获取支付URL失败";
                res.json(result);
                return;
            }
        } else if (arg.payChannel == 0) {
            try {
                Order.payApply(arg, function (err, data) {
                    if (err) {
                        res.json(err);
                        return;
                    }
                    if (data !== null) {
                        //    var urlInfo = JSON.parse(payUrl.value);
                        result.value = data.value;
                        res.json(result);
                        logger.info("order pay response:" + JSON.stringify(result));
                    }
                });
            } catch (ex) {
                logger.error("获取支付信息失败：" + ex);
                result.code = 500;
                result.desc = "获取支付URL失败";
                res.json(result);
                return;
            }
        } else {
            try {
                Order.payApply(arg, function (err, payUrl) {
                    if (err) {
                        res.json(err);
                        return;
                    }
                    if (payUrl !== null) {
                        var urlInfo = JSON.parse(payUrl.value);
                        result.payUrl = urlInfo;
                        res.json(result);
                        logger.info("order pay response:" + JSON.stringify(result));
                    }
                });
            } catch (ex) {
                logger.error("获取支付信息失败：" + ex);
                result.code = 500;
                result.desc = "获取支付URL失败";
                res.json(result);
                return;
            }
        }
    });
});

/*申请支付请求 -> 用不着*/
router.post('/payUrl', function (req, res, next) {
    var result = {code: 200};
    var arg = req.body;
    if (arg == null || arg.payChannel == null || arg.orderIdList == null || arg.orderIdList.length <= 0) {
        result.code = 400;
        result.desc = "请求参数错误";
        res.json(result);
        return;
    }
    logger.info("order pay request:" + JSON.stringify(arg));
    if (arg.payChannel == 9) {
        try {
            Pay.payUrl(arg, function (err, data) {
                if (err) {
                    res.json(err);
                }
                if (data !== null) {
                    var urlInof = JSON.parse(data.value);
                    result.payUrl = {
                        sign: urlInof.sign,
                        partnerid: urlInof.partnerid,
                        appId: urlInof.partnerid,
                        timeStamp: urlInof.partnerid,
                        packageInfo: urlInof.package,
                        prepayid: urlInof.prepayid,
                        signType: urlInof.signType,
                        nonceStr: urlInof.nonceStr
                    };
                    res.json(result);
                    logger.info("order pay response:" + JSON.stringify(result));
                }
            });
        } catch (ex) {
            logger.error("获取支付信息失败：" + ex);
            result.code = 500;
            result.desc = "获取支付URL失败";
            res.json(result);
            return;
        }
    } else {
        try {
            Pay.payUrl(arg, function (err, data) {
                var urlInfo = JSON.parse(data.value);
                if (err) {
                    res.json(err);
                    return;
                }
                if (data !== null) {
                    result.payUrl = urlInfo;
                    res.json(result);
                    logger.info("order pay response:" + JSON.stringify(result));
                }
            });
        } catch (ex) {
            logger.error("获取支付信息失败：" + ex);
            result.code = 500;
            result.desc = "获取支付URL失败";
            res.json(result);
        }
    }
});

//确认收货
router.post('/changeState', function (req, res, next) {
    var result = {code: 200};
    try {
        var arg = req.body;
        if (arg == null || arg.orderId == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.userId == null || arg.userId == "" || arg.userId <= 0) {
            result.code = 400;
            result.desc = "用户id不能为空";
            res.json(result);
            return;
        }
        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (arg.browser == "" || arg.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            res.json(result);
            return;
        }
        logger.info("order pay request:" + JSON.stringify(arg));
        Buyer.validAuth(arg, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            Order.confirmReceipt(arg, function (err, data) {
                if (err) {
                    res.json(err);
                    return;
                }
                res.json(result);
                logger.info("order pay response:" + JSON.stringify(result));
            });
        });
    } catch (ex) {
        logger.error("收货确认失败：" + ex);
        result.code = 500;
        result.desc = "收货确认失败";
        res.json(result);
    }
});

//查询支付状态
router.post('/paystate', function (req, res, next) {
    var result = {code: 200};
    try {
        var arg = req.body;
        if (arg == null || arg.payId == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.userId == null || arg.userId == "" || arg.userId <= 0) {
            result.code = 400;
            result.desc = "用户id不能为空";
            res.json(result);
            return;
        }
        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (arg.browser == "" || arg.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            res.json(result);
            return;
        }
        logger.info("get pay state request:" + JSON.stringify(arg));
        Buyer.validAuth(arg, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            Order.payState(arg, function (err, payState) {
                if (err) {
                    res.json(err);
                    return;
                }
                if (payState !== null) {
                    result.retCode = payState.retCode;
                    result.canncelTime = payState.canncelTime;
                } else {
                    result.code = 500;
                    result.desc = "获取支付状态失败";
                }
                res.json(result);
                logger.info("get pay state response:" + JSON.stringify(result));
            });
        });
    } catch (ex) {
        logger.error("get pay state error:" + ex);
        result.code = 500;
        result.desc = "获取支付状态失败";
        res.json(result);
    }
});

/*支付完成通知接口*/
router.get('/notify/alipay', function (request, response, next) {
    logger.info("进入支付完成通知接口流程");
    var result = {code: 200};
    try {
        var params = request.query;
        if(params != null && params != ""){
            response.redirect('http://buy.jfshare.com/html/pay-success.html?body=' + params.body +
                '&buyer_email=' + params.buyer_email + '&exterface=' + params.exterface +
                '&is_success=' + params.is_success + '&notify_id=' + params.notify_id +
                '&notify_time=' + params.notify_time + '&notify_type=' + params.notify_type +
                '&out_trade_no=' + params.out_trade_no + '&payment_type=' + params.payment_type +
                '&seller_email=' + params.seller_email + '&seller_id=' + params.seller_id +
                '&subject=' + params.subject + '&total_fee=' + params.total_fee +
                '&trade_no=' + params.trade_no + '&trade_status=' + params.trade_status +
                '&sign=' + params.sign + '&sign_type=' + params.sign_type);
            logger.info("接收到的支付完成通知信息，params:" + JSON.stringify(params));
        }
    } catch (ex) {
        response.json(result);
    }
});
router.post('/notify/alipay', function (request, response, next) {
    logger.info("进入支付完成通知接口流程");
    var result = {code: 200};
    try {
        var params = request.body;
        if(params != null && params != ""){
            response.redirect('http://buy.jfshare.com/html/pay-success.html?body=' + params.body +
            '&buyer_email=' + params.buyer_email + '&exterface=' + params.exterface +
            '&is_success=' + params.is_success + '&notify_id=' + params.notify_id +
            '&notify_time=' + params.notify_time + '&notify_type=' + params.notify_type +
            '&out_trade_no=' + params.out_trade_no + '&payment_type=' + params.payment_type +
            '&seller_email=' + params.seller_email + '&seller_id=' + params.seller_id +
            '&subject=' + params.subject + '&total_fee=' + params.total_fee +
            '&trade_no=' + params.trade_no + '&trade_status=' + params.trade_status +
            '&sign=' + params.sign + '&sign_type=' + params.sign_type);
            logger.info("接收到的支付完成通知信息，params:" + JSON.stringify(params));
        }
        //if(params != null && params != ""){
        //    response.redirect('http://101.201.39.61/jfShare/html/pay_2.success.html?body=' + params.body +
        //        '&buyer_email' + params.buyer_email + '&exterface' + params.exterface +
        //        '&is_success' + params.is_success + '&notify_id' + params.notify_id +
        //        '&notify_time' + params.notify_time + '&notify_type' + params.notify_type +
        //        '&out_trade_no' + params.out_trade_no + '&payment_type' + params.payment_type +
        //        '&seller_email' + params.seller_email + '&seller_id' + params.seller_id +
        //        '&subject' + params.subject + '&total_fee' + params.total_fee +
        //        '&trade_no' + params.trade_no + '&trade_status' + params.trade_status +
        //        '&sign' + params.sign + '&sign_type' + params.sign_type);
        //    logger.info("接收到的支付完成通知信息，params:" + JSON.stringify(params));
        //}
    } catch (ex) {
        response.json(result);
    }
});

router.post('/notify/hebaopay', function (request, response, next) {
    logger.info("进入支付完成通知接口流程");
    var result = {code: 200};
    try {
        var params = request.body;
        if(params != null && params != ""){
            response.redirect('http://buy.jfshare.com/html/pay-success.html?hmac=' + params.hmac +
                '&merchantId=' + params.merchantId + '&payNo=' + params.payNo +
                '&returnCode=' + params.returnCode + '&message=' + params.message +
                '&signType=' + params.signType + '&type=' + params.type +
                '&version=' + params.version + '&amount=' + params.amount +
                '&amtItem=' + params.amtItem + '&bankAbbr=' + params.bankAbbr +
                '&mobile=' + params.mobile + '&orderId=' + params.orderId +
                '&payDate=' + params.payDate + '&accountDate=' + params.accountDate +
                '&reserved1=' + params.reserved1 + '&reserved2=' + params.reserved2 +
                '&status=' + params.status + '&orderDate=' + params.orderDate +
                '&fee=' + params.fee);
            result.url = JSON.stringify(params);
            response.json(result);
        }
    } catch (ex) {
        response.json(result);
    }
});
router.get('/notify/hebaopay', function (request, response, next) {
    logger.info("进入支付完成通知接口流程");
    var result = {code: 200};
    try {
        var params = request.query;
        if(params != null && params != ""){
            response.redirect('http://buy.jfshare.com/html/pay-success.html?hmac=' + params.hmac +
                '&merchantId=' + params.merchantId + '&payNo=' + params.payNo +
                '&returnCode=' + params.returnCode + '&message=' + params.message +
                '&signType=' + params.signType + '&type=' + params.type +
                '&version=' + params.version + '&amount=' + params.amount +
                '&amtItem=' + params.amtItem + '&bankAbbr=' + params.bankAbbr +
                '&mobile=' + params.mobile + '&orderId=' + params.orderId +
                '&payDate=' + params.payDate + '&accountDate=' + params.accountDate +
                '&reserved1=' + params.reserved1 + '&reserved2=' + params.reserved2 +
                '&status=' + params.status + '&orderDate=' + params.orderDate +
                '&fee=' + params.fee);
            result.url = JSON.stringify(params);
            response.json(result);
        }
    } catch (ex) {
        response.json(result);
    }
});

/*获取物流信息*/
router.post('/queryExpress', function (request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "" || params.userId <= 0) {
            result.code = 400;
            result.desc = "用户id不能为空";
            response.json(result);
            return;
        }
        if (params.token == "" || params.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.ppInfo == "" || params.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.browser == "" || params.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            response.json(result);
            return;
        }
        logger.info("query expressOrder params:" + JSON.stringify(params));
        Buyer.validAuth(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Express.queryExpress(params, function (err, data) {
                if (err) {
                    response.json(err);
                    return;
                }
                if (data.expressInfo != null) {
                    result.name = data.expressInfo.name;
                }
                if (data.expressTrace != null) {
                    result.traceItems = data.expressTrace.traceItems;
                }
                response.json(result);
                logger.info("Express.expressQuery response:" + JSON.stringify(result));
                return;
            });
        });
    } catch (ex) {
        result.code = 500;
        result.desc = "查询物流信息失败";
        response.json(result);
        return;
    }
});

/*申请退货*/
router.post('/refund', function (request, response, next) {
    logger.info("进入申请退货流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "" || params.userId <= 0) {
            result.code = 400;
            result.desc = "用户id不能为空";
            response.json(result);
            return;
        }
        if (params.token == "" || params.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.ppInfo == "" || params.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.browser == "" || params.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            response.json(result);
            return;
        }

        logger.info("query expressOrder params:" + JSON.stringify(params));

        Buyer.validAuth(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            AfterSale.request(params, function (err, data) {
                if (err) {
                    response.json(err);
                    return;
                }
                response.json(result);
                logger.info("响应的结果:" + JSON.stringify(result));
            });
        });
    } catch (ex) {
        response.json(result);
    }
});

/*获取售后信息*/
router.post('/refundDesc', function (request, response, next) {
    logger.info("进入获取售后信息流程");
    var result = {code: 200};

    try {
        var params = request.body;
        if (params.productId == null || params.productId == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.skuNum == null || params.skuNum == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "" || params.userId <= 0) {
            result.code = 400;
            result.desc = "用户id不能为空";
            response.json(result);
            return;
        }
        if (params.token == "" || params.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.ppInfo == "" || params.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (params.browser == "" || params.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            response.json(result);
            return;
        }
        logger.info("售后信息查询， arg:" + JSON.stringify(params));
        Buyer.validAuth(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            AfterSale.queryAfterSale(params, function (err, data) {
                if (err) {
                    response.json(err);
                    return;
                }
                var afterSaleDesc;
                if (data != null) {
                    afterSaleDesc.applyTime = data.applyTime;
                    afterSaleDesc.reason = data.reason;
                    afterSaleDesc.userComment = data.userComment;
                    afterSaleDesc.approveComment = data.approveComment;
                    afterSaleDesc.approveTime = data.approveTime;
                    afterSaleDesc.state = data.state;
                }
                result.afterSaleDesc = afterSaleDesc;
                response.json(result);
                logger.info("AfterSale.queryAfterSale response:" + JSON.stringify(result));
            });
        });
    } catch (ex) {
        logger.error("AfterSale.queryAfterSale error:" + ex);
        result.code = 500;
        result.desc = "查询售后信息失败";
        response.json(result);
    }
});

/*-----------------------------*----------------------------*/
/*扫码预生成订单*/
router.post('/orderConfirmResult', function (request, response, next) {
    logger.info("进入扫码预生成订单");
    var result = {code: 200};
    try {
        var params = request.body;
        logger.info("扫码预生成订单请求入参, args:" + JSON.stringify(arg));

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

        AfterSale.payOrderCreate(params, function (err, data) {
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

/*
 天翼H5买家支付申请
 */
router.post('/pay_applyTYH5', function(req, res, next) {
    logger.info("进入天翼H5申请支付接口..");
    var result = {code: 200};
    try {
        var arg = req.body;
        if (arg == null || arg.payChannel == null || arg.orderIdList == null || arg.orderIdList.length <= 0) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.userId == null || arg.userId == "" || arg.userId <= 0) {
            result.code = 400;
            result.desc = "用户id不能为空";
            res.json(result);
            return;
        }
        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (arg.browser == "" || arg.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            res.json(result);
            return;
        }if (arg.clientType == "" || arg.clientType == null) {
            result.code = 400;
            result.desc = "终端标识不能为空";
            res.json(result);
            return;
        }
        logger.info("天翼H5申请支付请求参数 request:" + JSON.stringify(arg));
        Buyer.validAuth(arg, function (err, data) {
                if (err) {
                    response.json(err);
                    return;
                }
        //    logger.info("天翼H5申请支付鉴权完成");
        //    Order.payApplyTYH5(arg, function (err, payUrl) {
        //        if (err) {
        //            res.json(err);
        //            return;
        //        }
        //    });
        //});
        Order.payApplyTYH5(arg, function (err, payUrl) {
            if (err) {
                res.json(err);
                return;
            }
            if (payUrl !== null) {
                logger.info("payApply ==> 调用orderServ-payApply申请支付成功");
                //var formInfo = JSON.parse(payUrl.value);
                //var payApplyFormStr = ''
                //    +'<form id="payApplyForm" method="post" action="'+formInfo.action+'">'
                //    +'<input type="hidden" name="requestXml" value="'+formInfo.requestXml+'">'
                //    +'</form>';
                //res.json(payApplyFormStr);
               // return callback(null, payApplyFormStr);
                var urlInfo = JSON.parse(payUrl.value);
                result.payUrl = urlInfo;
                res.json(result);
                logger.info("order pay response:" + JSON.stringify(result));
            }
        });
        });
    } catch (ex) {
        logger.error("ORDER.payApply error:" + ex);
        result.code = 500;
        result.desc = "天翼H5申请支付失败";
        response.json(result);
    }
});

/*话费充值的提交订单-无productId*/
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
        if(arg.receiverMobile == null||arg.receiverMobile == ""){
            result.code = 400;
            result.desc = "充值手机号不能为空";
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
        Order.orderConfirmRecharge(arg, function (err, data) {
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

/*话费充值第三方回调*/
router.get('/reChargeNotify', function (request, response, next) {
    logger.info("话费充值第三方回调...");
    var result = {code: 200};
    try {
        var arg = request.query;
        logger.error("话费充值第三方回调请求参数 request:" + JSON.stringify(arg));
        Order.rechargeNotify(arg, function (err, data) {
            if (err) {
                response.write(1); //失败
                response.end();
                return;
            }else{
                response.write(0); //成功
                response.end();
                retrun;
            }

        });
        //});
    } catch (ex) {
        logger.error("submit order error:" + ex);
        result.code = 500;
        result.desc = "提交订单失败";
        response.json(result);
    }
});
module.exports = router;