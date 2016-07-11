/**
 * Created by L on 2015/10/24 0024.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
var logger = require('../lib/util/log4node').configlog4node.servLog4js();
var orderModel = require("../lib/models/order");

/**
 * 支付申请， 拼接form表单， 登录状态提交表单， 非登录状态提示登录
 */
router.post('/payApply', function(req, res, next) {
    var ret = res.resData;
    var args = req.body;
    var ssid = ret.ssid;
    logger.info("payAppay ==> orderId=" +args['payApply[orderId]']);
    var params = {orderIds:args['payApply[orderId]'], ssid:ssid}

    orderModel.payApply(params, req, function(resHtml){
        res.end(resHtml);
    });
});

/**
 * 支付申请， 拼接form表单， 登录状态提交表单， 非登录状态提示登录
 */
router.get('/payApply', function(req, res, next) {
    var ret = res.resData;
    var args = req.query;
    var ssid = ret.ssid;
    logger.info("payAppay ==> orderId=" +args.payApply.orderId);
    var params = {orderIds:args.payApply.orderId, ssid:ssid}
    orderModel.payApply(params, req, function(resHtml){
        res.end(resHtml);
    });
});

//暴露模块
module.exports = router;
