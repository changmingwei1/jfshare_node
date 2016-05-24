/**
 * @author YinBo on 16/4/25.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

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
//    Buyer.validAuth(arg,function(err,data) {
//        if (err) {
//            response.json(err);
//            return;
//        }
        Order.orderConfirm(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.orderIdList = data[0].orderIdList;
            result.extend = JSON.parse(data[0].extend);
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

//取消订单
router.post('/cancelOrder', function (req, res, next) {
    logger.info("进入取消订单接口");
    var result = {code: 200};

    try {
        var arg = req.body;
        /*参数：
         userType: int  //  1（买家）、2（卖家）、3 (系统)
         userId: int    // 用户id
         token: string 	// 鉴权信息
         ppInfo: string 	// 鉴权信息
         browser: string // 浏览器或手机设备号
         orderId: string // 订单id
         reason: int   //取消原因 */
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
        if (arg.reason == null || arg.reason == "") {
            result.code = 400;
            result.desc = "请选择取消原因";
            res.json(result);
            return;
        }

        logger.info("请求参数，arg：" + arg);

        Order.cancelOrder(arg, function (err, data) {
            if (err) {
                res.json(err);
            }
            res.json(result);
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
    try {
        var params = request.body;
        if (params == null ||params.userId == "" || params.userId == null) {
            result.code = 400;
            result.desc = "参数错误，用户id不能为空";
            response.json(result);
            return;
        }
        if (params.perCount == "" || params.perCount == null) {
            result.code = 400;
            result.desc = "每页显示条数不能为空";
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
//    Buyer.validAuth(arg,function(err,data) {
//        if (err) {
//            response.json(err);
//            return;
//        }
        async.series([
                function (callback) {
                    try {
                        AfterSale.queryAfterSaleOrder(params, function (err, data) {
                            if (err) {
                                callback(1, null);
                                return;
                            }
                            afterOrderList = data.afterSaleOrders;
                            if(afterOrderList != null && afterOrderList.length > 0){
                                result.afterOrderList = afterOrderList;
                                callback(null,result);
                            }else{
                                result.afterOrderList = afterOrderList;
                                callback(3, null);
                                return;
                            }
                            //response.json(result);
                            //return;
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
                                return callback(1, null);
                            }
                            var page = {total: orderInfo.total, pageCount: orderInfo.pageCount};

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
                                                skuNum: order.productList[i].skuNum,
                                                curPrice: order.productList[i].curPrice,
                                                imgKey: order.productList[i].imagesUrl.split(',')[0],
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
                        logger.info("订单服务异常:" + ex);
                        return callback(2, null);
                    }

                }
            ],
            function (err, results) {
                if (err < 3) {
                    result.code = 500;
                    result.desc = "获取售后列表aaaa";
                    response.json(result);
                    return;
                } else if (err == 3) {
                    result.code = 200;
                    response.json(result);
                    return;
                } else{
                    if(results[1]!=null){
                        response.json(results[1]);
                        return;
                    }
                }
            }
        );
        //});
    } catch (ex) {
        logger.error("query expressList erroraaaa:" + ex);
        result.code = 500;
        result.desc = "获取售后列表";
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
        if (params.perCount == null || params.perCount == "" || params.perCount <= 0) {
            result.code = 400;
            result.desc = "请输入每页显示数量";
            response.json(result);
            return;
        }
        logger.info("提交订单请求参数， arg:" + JSON.stringify(params));
        var afterSaleList = [];
        result.orderList = [];
        result.afterSaleList = [];
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
                                        closingPrice: order.closingPrice,
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
                                        mobile: order.receiverMobile,
                                        receiverTele: order.receiverTele,
                                        orderState: order.orderState,
                                        sellerComment: order.sellerComment,
                                        buyerComment: order.buyerComment,
                                        deliverTime: order.deliverTime,
                                        successTime: order.successTime,
                                        exchangeCash: order.exchangeCash,
                                        exchangeScore: order.exchangeScore,
                                        activeState: order.activeState,
                                        postage: order.postage,
                                        type: order.productList[0].type  //5.17测没有type
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
                        if (params.orderState == null) {
                            AfterSale.queryAfterSale(params, function (err, data) {
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
    arg.token = "鉴权信息1";
    arg.ppInfo = "鉴权信息2";

    if (arg.userId == null || arg.userId == "" || arg.userId <= 0) {
        resContent.code = 400;
        resContent.desc = "用户id不能为空";
        response.json(resContent);
        return;
    }
    logger.info("请求参数信息" + JSON.stringify(arg));

    try {
        Order.orderStateQuery(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            //var orderCountList = data[0].orderCountList;
            //resContent.orderCountList = orderCountList;
            resContent.orderCountList = data;
            response.json(resContent);
            logger.info("各状态对应的数量是:" + JSON.stringify(resContent));
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
        logger.info("进入获取订单中的卡密列表, params:" + JSON.stringify(params));
        Product.getProductCard(params, function (err, data) {
            if(err){
                response.json(err);
            }else{
                response.json(data);
            }
        });
    } catch (ex) {
        logger.error("get virtual-order carlist  error:" + ex);
        result.code = 500;
        result.desc = "获取订单中的卡密失败";
        response.json(result);
    }
});

/*查询订单详情--实物*/
router.post('/info', function (req, res, next) {
    var result = {code: 200};
    try {
        var params = req.body;
        if (params.userId == null || params.userId == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        logger.info("查询订单祥情请求参数：" + JSON.stringify(params));
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
                            result.orderState = orderInfo.orderState;
                            if (orderInfo.tradeCode == "Z0002" || orderInfo.tradeCode == "Z8002" ||orderInfo.tradeCode == "Z8001" ) {
                                result.mobile = orderInfo.deliverInfo.receiverMobile;
                            }else{
                                result.address = orderInfo.deliverInfo.provinceName +
                                    orderInfo.deliverInfo.cityName +
                                    orderInfo.deliverInfo.countyName +
                                    orderInfo.deliverInfo.receiverAddress;
                                result.receiverName = orderInfo.deliverInfo.receiverName;
                                result.mobile = orderInfo.deliverInfo.receiverMobile;
                            }
                            if(orderInfo.payInfo != null){
                                result.payChannel = orderInfo.payInfo.payChannel;
                            }
                            result.curTime = new Date().getTime();
                            result.createTime = orderInfo.createTime;
                            result.deliverTime = orderInfo.deliverTime; //卖家发货时间
                            result.successTime = orderInfo.successTime; //确认收货时间
                            result.comment = orderInfo.buyerComment;
                            result.postage = orderInfo.postage;
                            /*result.postageExt = orderInfo.postageExt; */     /*运费扩展信息  JSON*/
                            result.exchangeScore = orderInfo.exchangeScore; //添加字段
                            result.exchangeCash = orderInfo.exchangeCash; //添加字段
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
                }, function (callback) {
                    try {
                        Seller.querySeller(params.sellerId, 1, function (err, data) {
                            if (err) {
                                callback('error', err);
                                return;
                            } else {
                                result.sellerName = data[0].seller.sellerName;
                                logger.info("获取到的商品信息：" + JSON.stringify(result));
                                callback(null, result);
                            }
                        });
                    } catch (ex) {
                        logger.info("卖家服务异常:" + ex);
                        return callback(2, null);
                    }
                }
            ],
            function (err, results) {
                if (err) {
                    result.code = 500;
                    result.desc = "查看商品详情失败";
                    res.json(result);
                    return;
                } else {
                    if (results != null && results.length > 0) {
                        res.json(results[results.length - 1]);
                    } else {
                        result.code = 500;
                        result.desc = "查看订单详情失败";
                        res.json(result);
                        return;
                    }
                }
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
    logger.info("订单支付请求参数 request:" + JSON.stringify(arg));
    if (arg.payChannel == 4) {
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
    } else  if(arg.payChannel == 0) {
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
        try{
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
        } catch(ex) {
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
    try{
        var arg = req.body;
        if (arg == null || arg.orderId == null || arg.userId == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        logger.info("order pay request:" + JSON.stringify(params));

        Order.confirmReceipt(arg, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("order pay response:" + JSON.stringify(result));

        });
    } catch(ex){
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
        logger.info("get pay state request:" + JSON.stringify(arg));

        if (arg == null || arg.payId == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
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
    } catch (ex) {
        logger.error("get pay state error:" + ex);
        result.code = 500;
        result.desc = "获取支付状态失败";
        res.json(result);
    }
});

//支付完成通知接口
router.post('/notify/alipay', function (request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var args = {};
        args.token = params.token || "鉴权信息1";
        args.ppInfo = params.ppInfo || "鉴权信息2";
        args.payChannel = params.payChannel || 1;
        args.resUrl = params.resUrl || "支付返回的结果";

        logger.info("query expressOrder params:" + JSON.stringify(args));

        response.json(result);
    } catch (ex) {
        response.json(result);
    }
});

//获取物流信息
router.post('/queryExpress', function (request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        if (params.orderId == null || params.orderId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        var expressInfo = [{
            "time": "2016-02-22 13:37:26",
            "ftime": "2016-02-22 13:37:26",
            "context": "快件已签收,签收人是草签，签收网点是北京市朝阳安华桥"
        }, {
            "time": "2016-02-22 07:51:50",
            "ftime": "2016-02-22 07:51:50",
            "context": "北京市朝阳安华桥的牛鹏超18518350628正在派件"
        }, {
            "time": "2016-02-22 07:02:10",
            "ftime": "2016-02-22 07:02:10",
            "context": "快件到达北京市朝阳安华桥，上一站是北京集散，扫描员是张彪18519292322"
        }, {
            "time": "2016-02-22 01:40:35",
            "ftime": "2016-02-22 01:40:35",
            "context": "快件由北京集散发往北京市朝阳安华桥"
        }, {
            "time": "2016-02-20 22:42:14",
            "ftime": "2016-02-20 22:42:14",
            "context": "快件由温州分拨中心发往北京集散"
        }, {
            "time": "2016-02-20 19:56:29",
            "ftime": "2016-02-20 19:56:29",
            "context": "快件由苍南(0577-59905999)发往温州分拨中心"
        }, {
            "time": "2016-02-20 19:50:09",
            "ftime": "2016-02-20 19:50:09",
            "context": "快件由苍南(0577-59905999)发往北京(010-53703166转8039或8010)"
        }, {
            "time": "2016-02-20 19:50:08",
            "ftime": "2016-02-20 19:50:08",
            "context": "苍南(0577-59905999)已进行装袋扫描"
        }, {
            "time": "2016-02-20 19:46:22",
            "ftime": "2016-02-20 19:46:22",
            "context": "苍南(0577-59905999)的龙港公司已收件，扫描员是龙港公司"
        }];
        result.id = 100001;
        result.name = "顺丰";
        result.productName = "超能洗衣液";
        result.traceJson = expressInfo;
        result.remark = "";

        logger.info("query expressOrder params:" + JSON.stringify(params));

        response.json(result);

    } catch (ex) {


        response.json(result);
    }
});
//获取物流信息
router.post('/queryExpressTest', function (request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var token = "鉴权信息1";
        var ppInfo = "鉴权信息2";
        var browser = "asdafas";
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        logger.info("query expressOrder params:" + JSON.stringify(params));

        Express.queryExpress(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.data = data;
            response.json(result);
        });

    } catch (ex) {
        result.code = 500;
        result.desc = "查询物流信息失败";
        response.json(result);
    }
});

/*申请退货*/
router.post('/refund', function (request, response, next) {
    logger.info("进入申请退货流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var token = "鉴权信息1";
        var ppInfo = "鉴权信息2";
        var browser = "asdafas";
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        logger.info("query expressOrder params:" + JSON.stringify(params));

        AfterSale.request(params, function (err, data) {
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

/*获取售后信息*/
router.post('/refundDesc', function (request, response, next) {
    logger.info("进入获取售后信息流程");
    var result = {code: 200};

    try {
        var params = request.body;
        var token = "鉴权信息1";
        var ppInfo = "鉴权信息2";
        var browser = "asdafas";
        logger.info("售后信息查询， arg:" + JSON.stringify(params));

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
        AfterSale.queryAfterSale(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.data = data;
            response.json(result);
            logger.info("AfterSale.queryAfterSale response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("AfterSale.queryAfterSale error:" + ex);
        result.code = 500;
        result.desc = "查询售后信息失败";
        response.json(result);
    }
});




module.exports = router;