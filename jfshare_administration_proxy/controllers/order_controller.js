/**
 * Created by zhaoshenghai on 16/3/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var http = require('http');
var xlsx = require('node-xlsx');
var fs = require('fs');

var Order = require('../lib/models/order');
var Util = require('../lib/models/util');
var afterSale = require('../lib/models/AfterSale');
var Express = require('../lib/models/express');
var Product = require('../lib/models/product');
var Buyer = require('../lib/models/buyer');
var order_types = require('../lib/thrift/gen_code/order_types');
var Seller = require('../lib/models/seller');
// 查询订单列表
router.post('/list', function (request, response, next) {
    var result = {code: 200};
    var params = request.body;
    logger.error("查询订单列表请求参数：" + JSON.stringify(params));

    if (params.orderId != null && params.orderId != "") {
        logger.info("根据订单号查询：-----------");
    } else {
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
        if (params.startTime == null && params.startTime == "" && params.payTimeStart == null && params.payTimeStart == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.endTime == null && params.endTime == "" && params.payTimeEnd == null && params.payTimeEnd == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
    }
    var afterSaleList = [];
    var orderIdList = [];
    var sellerIds = [];
    result.orderList = [];
    result.afterSaleList = afterSaleList;
    async.series([
            function (callback) {
                //params.sellerIds=[1,2,4];
                logger.info("SELLER--data：" +JSON.stringify(params));
                try {
                    if(params.sellerName != null && params.sellerName != ""){
                        Seller.querySellerBySeller(params, function (err, data) {
                            logger.info("SELLER--data：" + JSON.stringify(data)+"  -----:params:"+JSON.stringify(params));
                            if (err) {
                                logger.error("Seller服务异常");
                                return callback(1, null);
                            }
                            if (data[0].sellerList !== null && data[0].sellerList.length > 0) {
                                for (var j = 0; j < data[0].sellerList.length; j++) {
                                    var seller = data[0].sellerList[j];
                                    sellerIds.push(seller.sellerId + "");
                                }
                            }

                            logger.error("SellerIds----shuju-------------："+sellerIds);
                            if (sellerIds.length > 0) {
                                params.sellerIds=sellerIds;
                                return callback(null, params);
                            } else {
                                sellerIds.push("-1");//代表传参了但是没有对应的数据，java层根据此判断是否继续向下执行
                                params.sellerIds=sellerIds;
                                callback(null, params);
                            }
                        });
                    }else{
                        callback(null,params);
                    }
                } catch (ex) {
                    logger.info("调用seller服务异常:" + ex);
                    return callback(1, null);
                }
            },
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
                    //if(params.loginName != null && params.loginName != ""){
                    //    Buyer.getBuyerInfo(params, function (err, data) {
                    //        logger.error("BUYER--data：" + JSON.stringify(data)+"  -----:params:"+JSON.stringify(params));
                    //        if (data[0].buyer != null) {
                    //            var buyer = data[0].buyer;
                    //            var userId = buyer.userId;
                    //            params.userId=userId;
                    //        } else {
                    //            callback(1,null);
                    //        }
                    //    });
                    //}
                    Order.orderProfileQuery(params, function (err, orderInfo) {
                        logger.info("Order-data:"+JSON.stringify(params));
                        logger.error("Order-orderInfo-orderInfo:"+JSON.stringify(orderInfo));
                        if (err) {
                            logger.error("订单服务异常");
                            return callback(1, null);
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
                                    tradeCode: order.tradeCode,
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
                                    curTime: order.curTime,
                                    fromSource: order.fromSource,
                                    payChannel: "",
                                    payTypeName:""
                                };
                                if (order.payInfo != null) {
                                    orderItem.payChannel = order.payInfo.payChannel;
                                    orderItem.payId = order.payInfo.payId;
                                    logger.error("order.payInfo.payChannel:"+order.payInfo.payChannel);
                                    if (order.payInfo.payChannel == "1") {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "天翼+积分";
                                        }else{
                                            orderItem.payTypeName = "天翼";
                                        }
                                    } else if (order.payInfo.payChannel == "2") {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "支付宝+积分";
                                        }else{
                                            orderItem.payTypeName = "支付宝";
                                        }
                                    } else if (order.payInfo.payChannel == "3" || order.payInfo.payChannel == "4" || order.payInfo.payChannel == "9") {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "微信+积分";
                                        }else{
                                            orderItem.payTypeName = "微信";
                                        }
                                    } else if (order.payInfo.payChannel == "5" || order.payInfo.payChannel == "7") {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "支付宝+积分";
                                        }else{
                                            orderItem.payTypeName = "支付宝";
                                        }
                                    } else if (order.payInfo.payChannel == "6" || order.payInfo.payChannel == "8") {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "和包+积分";
                                        }else{
                                            orderItem.payTypeName = "和包";
                                        }
                                    } else {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "积分";
                                        }else{
                                            orderItem.payTypeName = "";
                                        }
                                    }
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
                    return callback(1, null);
                }
            },
            function (callback) {
                try {
                    if (params.orderState == null && params.orderIdList != null && params.orderIdList.length > 0) {
                        afterSale.queryAfterSale(params, function (err, data) {
                            if (err) {
                                return callback(2, null);
                            }
                            logger.info("get order list response:" + JSON.stringify(result));

                            if(data!=null &&data.length>0){
                                afterSaleList = data;
                            }
                            return callback(null, afterSaleList);
                        });
                    } else {
                        return callback(null, afterSaleList);
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
                logger.error("shuju------------->" + JSON.stringify(results));
                result = results[2];
                result.afterSaleList = results[3];
                logger.error("finle-result:------------->" + JSON.stringify(result));
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

//查询订单详情
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
                        if(orderInfo==null || orderInfo==""){
                            return callback(1, null);
                        }
                        result.orderId = orderInfo.orderId;
                        result.tradeCode = orderInfo.tradeCode;
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
                            result.payId = orderInfo.payInfo.payId;
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
                        // result.comment = orderInfo.buyerComment;
                        result.postage = orderInfo.postage;
                        result.sellerId = orderInfo.sellerId;
                        result.cancelTime = orderInfo.cancelTime;
                        result.thirdScore = orderInfo.thirdScore;
                        result.thirdPrice =  orderInfo.thirdPrice;
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
                            result.postCode = orderInfo.deliverInfo.postCode;
                            result.sellerComment = orderInfo.deliverInfo.sellerComment;
                            result.buyerComment = orderInfo.deliverInfo.buyerComment;
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
                        if(orderInfo.productList!=null){
                            result.type = orderInfo.productList[0].type;
                        }else{

                            result.type = -1;
                        }

                        var productList = [];
                        if (orderInfo.productList !== null && orderInfo.productList.length > 0) {
                            for (var i = 0; i < orderInfo.productList.length; i++) {
                                productList.push({
                                    productId: orderInfo.productList[i].productId,
                                    tradeCode : orderInfo.tradeCode,
                                    productName: orderInfo.productList[i].productName,
                                    sku: {
                                        skuNum: orderInfo.productList[i].skuNum,
                                        skuName: orderInfo.productList[i].skuDesc
                                    },
                                    curPrice: orderInfo.productList[i].curPrice,
                                    orgPrice: orderInfo.productList[i].orgPrice,
                                    imgKey: orderInfo.productList[i].imagesUrl,
                                    count: orderInfo.productList[i].count,
                                    thirdExchangeRate: orderInfo.productList[i].thirdExchangeRate
                                });
                            }
                            result.productList = productList;
                        }
                        params.sellerId = orderInfo.sellerId;
                        params.userId = orderInfo.userId;
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
                    if (params.orderState == null || params.orderState == 1 || params.orderState == 5) {
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
                result =  results[0];
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
        //if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {
        //    result.code = 400;
        //    result.desc = "参数错误";
        //    response.json(result);
        //    return;
        //}
        afterSale.queryAfterSaleOrderList(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("Order.orderStateQuery response:" + JSON.stringify(data));

            result.count = data;
            response.json(result);
            return;
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

        logger.info("查询订单状态个数请求参数：" + JSON.stringify(params));

        Order.orderStateQuery(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("Order.orderStateQuery response:" + JSON.stringify(data));
            result.count = data;
            response.json(result);
            return;
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
        //if (params.num == null || params.num == "") {
        //
        //    result.code = 500;
        //    result.desc = "参数错误";
        //    response.json(result);
        //    return;
        //}

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
        logger.info("cancelOrder params:" + JSON.stringify(params));
        if (params.orderId == null || params.orderId == "") {

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
        if (params.userId == null || params.userId == "") {
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
        logger.error("取消订单失败：" + ex);
        result.code = 500;
        result.desc = "取消订单失败";
        response.json(result);
    }
});

////导出订单
//router.post('/queryExportOrderInfo', function (request, response, next) {
//    logger.info("进入导出订单流程");
//    var result = {code: 200};
//
//    try {
//
//        var params = request.body;
//
//        if (params.startTime == null || params.startTime == "") {
//
//            result.code = 500;
//            result.desc = "参数错误";
//            response.json(result);
//            return;
//        }
//        if (params.endTime == null || params.endTime == "") {
//
//            result.code = 500;
//            result.desc = "参数错误";
//            response.json(result);
//            return;
//        }
//
//
//        Order.batchExportOrderFull(params, function (err, data) {
//            if (err) {
//                response.json(err);
//                return;
//            }
//            result.url = "http://101.201.39.63/" + data;
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


        logger.info("调用orderServ-deliver  params:" + JSON.stringify(params));

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

//获取物流商列表
router.post('/expresslist', function (request, response, next) {
    logger.info("进入获取物流商列表");
    var result = {code: 200};
    var expressList = [];
    result.expressList = expressList;

    try {

        var params = request.body;

        Express.queryList(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }


            if (data[0].expressInfoList != null) {
                for (var i = 0; i < data[0].expressInfoList.length; i++) {
                    var express = {};
                    express.id = data[0].expressInfoList[i].id;

                    express.name = data[0].expressInfoList[i].name;

                    expressList.push(express);
                }

            }
            logger.info("query expressList response:" + JSON.stringify(data));
            response.json(result);
            return;
        });


        logger.info("expresslist params:" + JSON.stringify(params));


    } catch (ex) {
        logger.error("query expressList error:" + ex);
        result.code = 500;
        result.desc = "获取物流商列表";
        response.json(result);
    }
});

//获取售后的订单列表
router.post('/afterSalelist', function (request, response, next) {
    logger.info("进入获取售后的订单列表");
    var result = {code: 200};
    var afterOrderList = [];
    var afterSaleList = [];
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
        if (params.startTime == null && params.startTime == "" && params.payTimeStart == null && params.payTimeStart == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.endTime == null && params.endTime == "" && params.payTimeEnd == null && params.payTimeEnd == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        var page = {total: 0, pageCount: 0};
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
                            if (data == null || data.afterSaleOrders == null || data.afterSaleOrders.length == 0) {
                                isExist = 1;
                                return callback(null, 2);
                            } else {
                                afterOrderList = data.afterSaleOrders;
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
                        params.orderIdList = orderIdList;
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
                                        tradeCode: order.tradeCode,
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
                                return callback(2, null);
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

//获取订单中的卡密列表
router.post('/carList', function (request, response, next) {
    logger.info("进入获取订单中的卡密列表");
    var result = {code: 200};
    try {
        var params = request.body;

        var orderId = params.orderId;

        if (orderId == "" || orderId == null) {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.productId == "" || params.productId == null) {

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        logger.info("进入获取订单中的卡密列表 params:" + JSON.stringify(params));
        Product.queryProductCard(params, function (err, data) {
            if (err) {
                return response.json(err);
            }
            result.cardList = data;
            logger.info("查询订单中的卡密信息result" + JSON.stringify(result));
            response.json(result);
            return;
        });


    } catch (ex) {
        logger.error("get virtual-order carlist  error:" + ex);
        result.code = 500;
        result.desc = "获取订单中的卡密列表失败";
        response.json(result);
    }
});

router.post('/queryExportOrderInfo', function (request, response, next) {
    logger.info("进入导出订单的流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //orderId
        if (params.orderId != "" && params.orderId != null) {
        }else{
            //因为管理中心和卖家中心用同一个借口，所以去掉
            //if (params.startTime == "" || params.startTime == null) {
            //    result.code = 400;
            //    result.desc = "参数错误";
            //    response.json(result);
            //    return;
            //}
            //if (params.endTime == "" || params.endTime == null) {
            //    result.code = 400;
            //    result.desc = "参数错误";
            //    response.json(result);
            //    return;
            //}
        }
        var sellerIds = [];
        async.series([
            function (callback) {
                //params.sellerIds=[1,2,4];
                logger.info("SELLER--data：" +JSON.stringify(params));
                try {
                    if(params.sellerName != null && params.sellerName != ""){
                        Seller.querySellerBySeller(params, function (err, data) {
                            logger.info("SELLER--data：" + JSON.stringify(data)+"  -----:params:"+JSON.stringify(params));
                            if (err) {
                                logger.error("Seller服务异常");
                                return callback(1, null);
                            }
                            if (data[0].sellerList !== null && data[0].sellerList.length > 0) {
                                for (var j = 0; j < data[0].sellerList.length; j++) {
                                    var seller = data[0].sellerList[j];
                                    sellerIds.push(seller.sellerId + "");
                                }
                            }
                            logger.info("SellerIds-----------------："+sellerIds);
                            if (sellerIds.length > 0) {
                                params.sellerIds=sellerIds;
                                return callback(null, params);
                            } else {
                                callback(null, params);
                            }
                        });
                    }else{
                        callback(null,params);
                    }
                } catch (ex) {
                    logger.info("调用seller服务异常:" + ex);
                    return callback(1, null);
                }
            },
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
                Order.batchExportOrderFull(params, function (err, data) {
                    if (err) {
                        response.json(err);
                        return;
                    } else {
                        result.queryKey = data;
                        response.json(result);
                    }
                });
            }],
            function (err, results) {
                if (err == 1) {
                    logger.error("Seller服务异常" + err);
                    result.code = 500;
                    result.desc = "查询卖家信息失败";
                    response.json(result);
                    return;
                }
                if (err == 2) {
                    logger.error("导出订单失败--订单服务异常：" + err);
                    result.code = 500;
                    result.desc = "订单导出失败";
                    response.json(result);
                    return;
                }
                if (err == null && err != 3) {
                    logger.error("shuju------------->" + JSON.stringify(results));
                    result = results[2];
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
        logger.error("导出订单失败：" + ex);
        result.code = 500;
        result.desc = "导出订单失败";
        response.json(result);
    }
});

router.post('/getExportOrderResult', function (request, response, next) {
    logger.info("查询导出订单的进度");
    var result = {code: 200};
    var value = {};
    try {

        var params = request.body;

        if (params.queryKey == "" || params.queryKey == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        logger.info("查询导出订单的进度  params:" + JSON.stringify(params));
        Order.getExportOrderResult(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            } else {
                logger.info("查询导出订单的进度  data:" + JSON.stringify(data));

                if ((JSON.parse(data)).code == "1") {
                    value.code = 1;
                    value.desc = "http://101.201.39.63/" + (JSON.parse(data)).desc;
                } else if ((JSON.parse(data)).code == "0") {
                    value.code = 0;
                    value.desc = "订单正在导出";
                } else if ((JSON.parse(data)).code == "-1") {
                    value.code = -1;
                    value.desc = "导出订单异常";
                }

                result.value = value;
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

/*批量发货--管理中心*/
router.post('/batchDeliverOrderForManager', function (request, response, next) {
    logger.info("进入批量发货流程..");
    var result = {code: 200};
    try {
        var params = request.body;
        if (params.path == "" || params.path == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        logger.info("进入批量发货流程params:" + JSON.stringify(params));
        //params.path ="http://101.201.39.61/system/v1/jfs_image/"+params.path;
        params.path ="http://101.201.39.61/system/v1/jfs_image/"+params.path;
        logger.error("这不是错误，只是想看一下路径，不要去掉:"+ params.path);
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
                        var json = xlsx.parse("/data/run/jfshare_node/jfshare_administration_proxy/excel/excel.xlsx");
                        //var json = xlsx.parse("C:/jfshare_node/jfshare_administration_proxy/excel/excel.xlsx");
                        // console.log(json);
                        var list = [];
                        var sellerId;
                        if (json != null && json.length > 0) {
                            var sheetData = json[0];
                            if (sheetData != null && sheetData.data != null && sheetData.data.length > 1) {
                                for (var i = 1; i < sheetData.data.length; i++) {
                                    var sellerDeviler = {};
                                    if (sheetData.data[i].length >= 3) {
                                        sellerId = sheetData.data[i][0] + "";
                                        var deliverInfo = new order_types.DeliverInfo({
                                            expressName: sheetData.data[i][3],
                                            expressNo: sheetData.data[i][2],
                                            sellerComment: ""
                                        });
                                        var order = new order_types.Order({
                                            orderId: sheetData.data[i][1],
                                            deliverInfo: deliverInfo
                                        });
                                        if(sheetData.data[i].length > 3 &&sheetData.data[i][3]!=null && sheetData.data[i][3]!=""){
                                            deliverInfo.sellerComment = sheetData.data[i][3];
                                        }
                                        sellerDeviler.sellerId = sellerId;
                                        sellerDeviler.order = order;
                                        list.push(sellerDeviler);
                                    }
                                }
                            }
                        }
                        params.list = list;
                        if (list.length > 0) {
                            Order.batchDeliverOrderForManager(params, function (err, data) {
                                if (err) {
                                    return callback(err, err);
                                }
                                if(data[0] != null){
                                    result.failInfo = data[0].failInfo;
                                }
                                return callback(null, result);
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

/*批量发货--管理中心*/
router.post('/batchDeliverOrderForManagerTest', function (request, response, next) {
    logger.info("进入批量发货流程..");
    var result = {code: 200};
    try {
        var params = request.body;
        if (params.path == "" || params.path == null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        logger.info("进入批量发货流程params:" + JSON.stringify(params));
        //params.path ="http://101.201.39.61/system/v1/jfs_image/"+params.path;
        params.path ="http://120.24.153.102:3000/system/v1/jfs_image/"+params.path;
        logger.info("这不是错误，只是想看一下路径，不要去掉:"+ params.path);
        var isDownLoad = false;
        async.waterfall([
                function (callback) {
                    try {
                        Order.downLoad(params, function (err, data) {
                            if (err) {
                                callback(err);
                            } else {
                                isDownLoad = true;
                                callback(null, isDownLoad);
                            }
                        });
                    } catch (ex) {
                        logger.info("下载物流单失败:" + ex);
                        result.code = 500;
                        result.desc = "下载物流单失败";
                        response.json(result);
                        return;
                    }
                },
                function (isDownload, callback) {
                    try {
                        logger.info("isDownLoad=============" + isDownLoad);
                        var json = xlsx.parse("/data/run/jfshare_node/jfshare_administration_proxy/excel/excel.xlsx");
                        //var json = xlsx.parse("C:/jfshare_node/jfshare_administration_proxy/excel/excel.xlsx");
                         logger.info("excel中的值，json == " + JSON.stringify(json));
                        var list = [];
                        var sellerId;
                        if (json != null && json.length > 0) {
                            var sheetData = json[0];
                            if (sheetData != null && sheetData.data != null && sheetData.data.length > 1) {
                                for (var i = 1; i < sheetData.data.length; i++) {
                                    var sellerDeviler = {};
                                    if (sheetData.data[i].length >= 3) {
                                        sellerId = sheetData.data[i][0] + "";
                                        var deliverInfo = new order_types.DeliverInfo({
                                            expressName: sheetData.data[i][3],
                                            expressNo: sheetData.data[i][2],
                                            sellerComment: ""
                                        });
                                        var order = new order_types.Order({
                                            orderId: sheetData.data[i][1],
                                            deliverInfo: deliverInfo
                                        });
                                        if(sheetData.data[i].length > 3 &&sheetData.data[i][3]!=null && sheetData.data[i][3]!=""){
                                            deliverInfo.sellerComment = sheetData.data[i][3];
                                        }
                                        sellerDeviler.sellerId = sellerId;
                                        sellerDeviler.order = order;
                                        list.push(sellerDeviler);
                                    }
                                }
                            }
                        }
                        params.list = list;
                        if (list.length > 0) {
                            Order.batchDeliverOrderForManager(params, function (err, data) {
                                if (err) {
                                    callback(err);
                                }
                                if(data[0] != null){
                                    result.failInfo = data[0].failInfo;
                                }
                                response.json(result);
                                return;
                            });
                        } else {
                            result.code = 500;
                            result.desc = "列表数据为空";
                            response.json(result);
                            return;
                        }
                    } catch (ex) {
                        logger.info("批量发货失败:" + ex);
                        result.code = 500;
                        result.desc = "批量发货失败1";
                        response.json(result);
                        return;
                    }
                }
            ],
            function (err) {
                result.code = 500;
                result.desc = "批量发货失败2";
                response.json(result);
                return;
            });
        //});
    } catch (ex) {
        logger.error("批量发货 error:" + ex);
        result.code = 500;
        result.desc = "批量发货失败3";
        response.json(result);
    }
});

/*批量发货--管理中心new*/
router.post('/bacthDeliverOrder',function(request, response, next){
    logger.info("进入批量发货流程 >>>>>> java处理excel");
    var result = {code : 200};

    try {
        var param = request.body;
        if (param.path == null || param.path == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Order.batchDeliverOrder(param, function(err, data){
           if (err){
               response.json(err);
               return;
           }
           if(data[0] != null){
               result.failInfo = data[0].failInfo;
           }
           response.json(result);
           return;
        });
    } catch (ex) {
        logger.error("批量发货 error:" + ex);
        result.code = 500;
        result.desc = "批量发货失败";
        response.json(result);
    }

});

//-------------------------------------------------------------------------------------
// 查询线下收款数据
router.post('/listOrderOffline', function (request, response, next) {
    var result = {code: 200};
    var params = request.body;
    logger.info("查询订单列表请求参数：" + JSON.stringify(params));

    if (params.orderId != null || params.orderId != "") {
        logger.info("根据订单号查询：-----------");
    } else if (params.loginName != null || params.loginName != "") {
        logger.info("根据买家账号查询：-----------");
    } else {
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
        if (params.payTimeStart == null || params.payTimeStart == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.payTimeEnd == null || params.payTimeEnd == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
    }
    params.orderType = 1;
    var afterSaleList = [];
    var orderIdList = [];
    var sellerIds = [];
    var objTemp = [];
    result.orderList = [];
    result.afterSaleList = afterSaleList;
    async.series([
            function (callback) {
                //params.sellerIds=[1,2,4];
                logger.info("SELLER--data：" +JSON.stringify(params));
                try {
                    if(params.sellerName != null && params.sellerName != ""){
                        Seller.querySellerBySeller(params, function (err, data) {
                            //logger.info("SELLER--data：" + JSON.stringify(data)+"  -----:params:"+JSON.stringify(params));
                            if (err) {
                                logger.error("Seller服务异常");
                                return callback(1, null);
                            }
                            if (data[0].sellerList !== null && data[0].sellerList.length > 0) {
                                for (var j = 0; j < data[0].sellerList.length; j++) {
                                    var seller = data[0].sellerList[j];
                                    sellerIds.push(seller.sellerId + "");
                                }
                            }
                            logger.info("SellerIds----shuju-------------："+sellerIds);
                            if (sellerIds.length > 0) {
                                params.sellerIds=sellerIds;
                                return callback(null, params);
                            } else {
                                //sellerIds.push("-1");//代表传参了但是没有对应的数据，java层根据此判断是否继续向下执行
                                //params.sellerIds=sellerIds;
                                return callback(1, null);
                            }
                        });
                    }else{
                        callback(null,params);
                    }
                } catch (ex) {
                    logger.info("调用seller服务异常:" + ex);
                    return callback(1, null);
                }
            },
            function (callback) {
                logger.info("BUYER--data：");
                try {
                    if(params.loginName != null && params.loginName != ""){
                        Buyer.getBuyerInfo(params, function (err, data) {
                            //logger.info("BUYER--data：" + JSON.stringify(data)+"  -----:params:"+JSON.stringify(params));
                            if (err) {
                                logger.error("Buyer服务异常");
                                return callback(2, null);
                            }
                            if (data[0].buyer != null) {
                                var buyer = data[0].buyer;
                                params.userId= buyer.userId;
                                return callback(null, params);
                            } else {
                                callback(2,null);
                            }
                        });
                    }else{
                        callback(null,params);
                    }
                } catch (ex) {
                    logger.info("调用buyer服务异常:" + ex);
                    return callback(2, null);
                }
            },
            function (callback) {
                try {
                    //if(params.loginName != null && params.loginName != ""){
                    //    Buyer.getBuyerInfo(params, function (err, data) {
                    //        logger.error("BUYER--data：" + JSON.stringify(data)+"  -----:params:"+JSON.stringify(params));
                    //        if (data[0].buyer != null) {
                    //            var buyer = data[0].buyer;
                    //            var userId = buyer.userId;
                    //            params.userId=userId;
                    //        } else {
                    //            callback(1,null);
                    //        }
                    //    });
                    //}
                    Order.orderProfileQuery(params, function (err, orderInfo) {
                        //logger.info("Order-data:"+JSON.stringify(params));
                        //logger.info("Order-orderInfo-orderInfo:"+JSON.stringify(orderInfo));
                        if (err) {
                            logger.error("订单服务异常");
                            return callback(3, null);
                        }
                        var page = {total: orderInfo.total, pageCount: orderInfo.pageCount};
                        var orderList = [];
                        if (orderInfo.orderProfileList !== null && orderInfo.orderProfileList.length > 0) {
                            for (var j = 0; j < orderInfo.orderProfileList.length; j++) {
                                var order = orderInfo.orderProfileList[j];
                                if (order.orderState == 10) {
                                    continue;
                                }
                                if (order.orderState >= 50) {
                                    orderIdList.push(order.orderId);
                                }
                                objTemp.push(order.userId);
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
                                    curTime: order.curTime,
                                    fromSource: order.fromSource,
                                    payChannel: "",
                                    payTypeName:""
                                };
                                if (order.payInfo != null) {
                                    orderItem.payChannel = order.payInfo.payChannel;
                                    orderItem.payTime = order.payInfo.payTime;
                                    //logger.info("order.payInfo.payChannel:"+order.payInfo.payChannel);
                                    if (order.payInfo.payChannel == "1") {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "天翼+积分";
                                        }else{
                                            orderItem.payTypeName = "天翼";
                                        }
                                    } else if (order.payInfo.payChannel == "2") {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "支付宝+积分";
                                        }else{
                                            orderItem.payTypeName = "支付宝";
                                        }
                                    } else if (order.payInfo.payChannel == "3" || order.payInfo.payChannel == "4" || order.payInfo.payChannel == "9") {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "微信+积分";
                                        }else{
                                            orderItem.payTypeName = "微信";
                                        }
                                    } else if (order.payInfo.payChannel == "5" || order.payInfo.payChannel == "7") {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "支付宝+积分";
                                        }else{
                                            orderItem.payTypeName = "支付宝";
                                        }
                                    } else if (order.payInfo.payChannel == "6" || order.payInfo.payChannel == "8") {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "和包+积分";
                                        }else{
                                            orderItem.payTypeName = "和包";
                                        }
                                    } else {
                                        if(order.exchangeScore>0){
                                            orderItem.payTypeName = "积分";
                                        }else{
                                            orderItem.payTypeName = "";
                                        }
                                    }
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
                            params.userIdList=objTemp;
                        }
                        //logger.error("get order list response:" + JSON.stringify(result));
                        return callback(null, result);
                    });

                } catch (ex) {
                    logger.info("订单服务异常:" + ex);
                    return callback(3, null);
                }
            },
            function (callback) {
                try {

                    //logger.error("length:" + JSON.stringify(result.orderList.length));
                    Buyer.getListBuyer(params.userIdList, function(err, data){
                        if(err){
                            return callback(4, null);
                        }
                        var buyerList = data[0].buyerList;
                        if(data != null && data[0] != null && data[0].buyerList != null){
                            for(var i = 0;i < result.orderList.length;i++){
                                var userId=result.orderList[i].userId;
                                //logger.info("userId:" + JSON.stringify(userId)+" userName:"+result.orderList[i].loginName);
                                for(var j = 0;j < buyerList.length; j++){
                                    var uid = buyerList[j].userId;
                                    if(userId == uid){
                                        result.orderList[i].loginName=buyerList[j].loginName;
                                        //logger.info("userName:"+result.orderList[i].loginName);
                                    }
                                }
                            }
                        }
                        return callback(null, result);
                    });

                } catch (ex) {
                    logger.info("调用buyer服务异常:" + ex);
                    return callback(4, null);
                }
            }
            //,
            //function (callback) {
            //    try {
            //        if (params.orderState == null && params.orderIdList != null && params.orderIdList.length > 0) {
            //            afterSale.queryAfterSale(params, function (err, data) {
            //                if (err) {
            //                    return callback(2, null);
            //                }
            //                logger.info("get order list response:" + JSON.stringify(result));
            //
            //                if(data!=null &&data.length>0){
            //                    afterSaleList = data;
            //                }
            //                return callback(null, afterSaleList);
            //            });
            //        } else {
            //            return callback(null, afterSaleList);
            //        }
            //    } catch (ex) {
            //        logger.info("售后服务异常:" + ex);
            //        return callback(2, null);
            //    }
            //
            //}
        ],
        function (err, results) {
            if (err == 1) {
                logger.error("查询卖家信息失败---卖家服务异常：" + err);
                result.code = 500;
                result.desc = "查询商家信息失败";
                response.json(result);
                return;
            }
            if (err == 2) {
                logger.error("查询买家信息失败--买家服务异常：" + err);
                result.code = 500;
                result.desc = "查询账户信息失败";
                response.json(result);
                return;
            }
            if (err == 3) {
                logger.error("查询订单失败--订单服务异常：" + err);
                result.code = 500;
                result.desc = "查询订单失败";
                response.json(result);
                return;
            }
            if ( err != 3) {
                result = results[2];
                // result.afterSaleList = results[3];
                logger.info("线下收款列表-finle-result:------------->" + JSON.stringify(result));
                response.json(result);
                return;
            } else {
                logger.error("查询订单失败--订单服务异常：" + err);
                result.code = 500;
                result.desc = "查询订单失败";
                response.json(result);
                return;
            }
        });

    router.post('/queryExportOrderInfoOffline', function (request, response, next) {
        logger.info("进入导出订单的流程");
        var result = {code: 200};
        try {
            var params = request.body;
            //orderId
            if (params.orderId != "" && params.orderId != null) {
            }else{
                //因为管理中心和卖家中心用同一个借口，所以去掉
                //if (params.startTime == "" || params.startTime == null) {
                //    result.code = 400;
                //    result.desc = "参数错误";
                //    response.json(result);
                //    return;
                //}
                //if (params.endTime == "" || params.endTime == null) {
                //    result.code = 400;
                //    result.desc = "参数错误";
                //    response.json(result);
                //    return;
                //}
            }
            var sellerIds = [];
            async.series([
                    function (callback) {
                        //params.sellerIds=[1,2,4];
                        logger.info("SELLER--data：" +JSON.stringify(params));
                        try {
                            if(params.sellerName != null && params.sellerName != ""){
                                Seller.querySellerBySeller(params, function (err, data) {
                                    logger.info("SELLER--data：" + JSON.stringify(data)+"  -----:params:"+JSON.stringify(params));
                                    if (err) {
                                        logger.error("Seller服务异常");
                                        return callback(1, null);
                                    }
                                    if (data[0].sellerList !== null && data[0].sellerList.length > 0) {
                                        for (var j = 0; j < data[0].sellerList.length; j++) {
                                            var seller = data[0].sellerList[j];
                                            sellerIds.push(seller.sellerId + "");
                                        }
                                    }
                                    logger.info("SellerIds-----------------："+sellerIds);
                                    if (sellerIds.length > 0) {
                                        params.sellerIds=sellerIds;
                                        return callback(null, params);
                                    } else {
                                        callback(null, params);
                                    }
                                });
                            }else{
                                callback(null,params);
                            }
                        } catch (ex) {
                            logger.info("调用seller服务异常:" + ex);
                            return callback(1, null);
                        }
                    },
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
                        Order.batchExportOrderFullOffline(params, function (err, data) {
                            if (err) {
                                response.json(err);
                                return;
                            } else {
                                result.queryKey = data;
                                response.json(result);
                            }
                        });
                    }],
                function (err, results) {
                    if (err == 1) {
                        logger.error("Seller服务异常" + err);
                        result.code = 500;
                        result.desc = "查询卖家信息失败";
                        response.json(result);
                        return;
                    }
                    if (err == 2) {
                        logger.error("导出订单失败--订单服务异常：" + err);
                        result.code = 500;
                        result.desc = "订单导出失败";
                        response.json(result);
                        return;
                    }
                    if (err == null && err != 3) {
                        logger.error("shuju------------->" + JSON.stringify(results));
                        result = results[2];
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
            logger.error("导出订单失败：" + ex);
            result.code = 500;
            result.desc = "导出订单失败";
            response.json(result);
        }
    });

});

module.exports = router;