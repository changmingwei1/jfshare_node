/**
 * Created by zhaoshenghai on 16/3/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Util = require('../lib/models/util');


// 查询订单列表
router.post('/list', function(req, res, next) {
    var result = {code: 200};

    try{
       // var arg = req.query;
        var arg = req.body;
        logger.info("查询订单列表请求参数：" + JSON.stringify(arg));
        var params = {};
        //userid 改为了userId  2016.4.12
        params.userId = arg.sellerId || null;
        params.orderStatus = Product.getOrderStateIdBuyerEnum(arg.orderstatus);
        params.percount = arg.percount || 20;
        params.curpage = arg.curpage || 1;
        params.userType = arg.userType || 1;

        if(params.userId == null) {
            result.code = 400;
            result.desc = "没有填写用户ＩＤ";
            res.json(result);
            return;
        }

        Product.orderProfileQuery(params, function (err, orderInfo) {
            if(err){
                res.json(err);
                return;
            }
            var page = {total:orderInfo.total, pageCount: orderInfo.pageCount};
            var orderList = [];
            if(orderInfo.orderProfileList !== null) {
                orderInfo.orderProfileList.forEach(function(order) {
                    var orderItem = {
                        orderId: order.orderId,
                        orderPrice: order.closingPrice,
                        //添加了应答的数据
                        postage:order.postage,
                        username:order.username,
                        cancelName:order.cancelName,
                        sellerName:order.sellerName,
                        createTime:order.createTime,
                        expressNo:order.expressNo,
                        expressName:order.expressName,
                        receiverAddress:order.receiverAddress,
                        receiverName:order.receiverName,
                        receiverMobile:order.receiverMobile,
                        receiverTele:order.receiverTele,
                        orderState:order.orderState,
                        sellerComment:order.sellerComment,
                        buyerComment:order.buyerComment,
                        deliverTime:order.deliverTime,
                        successTime:order.successTime,
                        exchangeCash:order.exchangeCash,
                        exchangeScore:order.exchangeScore,
                        activeState:order.activeState,
                        curTime:order.curTime
                    };
                    var productList = [];
                    if(order.productList !== null && order.productList.length > 0){
                        for(var i=0; i < order.productList.length; i++){
                            var productItem = {
                                productId: order.productList[i].productId,
                                productName:order.productList[i].productName,
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
            res.json(result);
            logger.info("get order list response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("get order list error:" + ex);
        result.code = 500;
        result.desc = "获取订单列表失败";
        res.json(result);
    }
});

// 查询订单详情
router.post('/info', function(req, res, next) {
    var result = {code: 200};
    try{
        //var arg = req.query;

        var arg = req.body;

        logger.info("查询订单祥情请求参数：" + JSON.stringify(arg));

        var params = {};
        params.userId = arg.sellerId || null;
        params.orderId = arg.orderId || null;
        params.userType =  2; // 1:买家 2：卖家 3：系统
        if(params.userId == null || params.orderId == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.queryOrderDetail(params, function(err, orderInfo) {
            if(err) {
                res.json(err);
                return;
            }
            if(orderInfo == null){
                result.code = 404;
                result.desc = "未找到订单";
                res.json(result);
                return;
            }
            result.orderid = orderInfo.orderId;
            result.orderstatus = Product.getOrderStateBuyerEnum(orderInfo.orderState);
            if(orderInfo.deliverInfo !== null) {
                result.deliverInfo = orderInfo.deliverInfo;

            }
            result.createTime = orderInfo.deliverTime;
            result.comment = orderInfo.buyerComment;
            var productList = [];
            if(orderInfo.productList !== null && orderInfo.productList.length > 0){
                for(var i=0; i < orderInfo.productList.length; i++) {
                    productList.push({
                        productId: orderInfo.productList[i].productId,
                        productName:orderInfo.productList[i].productName,
                        skunum:{skuNum:orderInfo.productList[i].skuNum, skuDesc:orderInfo.productList[i].skuDesc},
                        curPrice: orderInfo.productList[i].curPrice,
                        orgPrice: orderInfo.productList[i].orgPrice,
                        imgUrl:orderInfo.productList[i].imagesUrl,
                        count:orderInfo.productList[i].count,
                        postage:orderInfo.postage,
                        exchangeScore:orderInfo.exchangeScore,
                        closingPrice:orderInfo.closingPrice
                    });
                }
                result.productList = productList;
            }
            res.json(result);
            logger.info("get order info response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("查询订单详情失败：" + ex);
        result.code = 500;
        result.desc = "查询订单详情失败";
        res.json(result);
    }
});

router.post('/pay', function(req, res, next) {
    var result = {code: 200};

    var arg = req.body;
    logger.info("order pay request:" + JSON.stringify(arg));

    if(arg == null || arg.payChannel == null || arg.orderIdList == null || arg.orderIdList.length <= 0){
        result.code = 400;
        result.desc = "请求参数错误";
        res.json(result);
    }

    if(arg.payChannel == 4){
        Util.getOpenApi(arg, function(err, data) {
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
                Product.payApply(arg, function (err, payUrl) {
                    var urlInof = JSON.parse(payUrl.value);
                    if (err) {
                        res.json(err);
                        return;
                    }
                    if (payUrl !== null) {
                        result.payUrl = urlInof;
                        res.json(result);
                        logger.info("order pay response:" + JSON.stringify(result));
                    }
                });
            }
            catch(ex) {
                logger.error("error:" + ex);
                result.code = 500;
                result.desc = "获取支付URL失败";
                res.json(result);
            }
        });
    } else {
        Product.payApply(arg, function (err, payUrl) {
            var urlInof = JSON.parse(payUrl.value);
            if (err) {
                res.json(err);
                return;
            }
            if (payUrl !== null) {
                result.payUrl = urlInof;
                res.json(result);
                logger.info("order pay response:" + JSON.stringify(result));
            }
        });
    }
});

router.get('/paystate', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.query;
        logger.info("get pay state request:" + JSON.stringify(arg));

        if(arg == null || arg.payId == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.payState(arg, function(err, payState) {
            if(err) {
                res.json(err);
                return;
            }
            if(payState !== null) {
                result.retCode = payState.retCode;
                result.canncelTime = payState.canncelTime;
            } else{
                result.code = 500;
                result.desc = "获取支付状态失败";
            }
            res.json(result);
            logger.info("get pay state response:" + JSON.stringify(result));
        });
    } catch(ex){
        logger.error("get pay state error:" + ex);
        result.code = 500;
        result.desc = "获取支付状态失败";
        res.json(result);
    }
});



module.exports = router;