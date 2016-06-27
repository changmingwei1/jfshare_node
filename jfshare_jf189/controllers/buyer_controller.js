//引入所需模块
var express = require('express');
var router = express.Router();
var async = require('async');

//view
var view_index = require('../view_center/index/view_index');
var view_buyer = require('../view_center/buyer/view_buyer');

//model
var orderModel = require("../lib/models/order");

//util
var SessionUtil = require('../lib/util/SessionUtil');
var paramValid = require('../lib/models/pub/param_valid');

//log
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

router.get('/myOrders', function(req, res, next) {
    view_buyer.my_orders(req, res, next);
});

router.get('/jump/myOrders', function(req, res, next) {
    var ssid = res.resData.ssid;

    var  resHtml =  ''
        + '<!DOCTYPE html><html lang="zh-cn"><head><meta charset="utf-8">'
        + '<script type="text/javascript" src="/js/jquery/jquery-1.7.2.min.js"></script>'
        + '<script src="/js/common.js"></script>'
        + '<iframe id="loginInfoFrm" name="loginInfoFrm" src="#" style="display: none;" width="100%" height="100px"></iframe>'
        + '<script type="text/javascript" language="JavaScript">'
        + 'checkTYLoginStatus("'+ssid+'", function(){'
        + 'location.href="/buyer/myOrders?ssid='+ssid+'";'
        + '});'
        + '</script></body></html>';
    res.end(resHtml);
});

/**
 * 买家订单列表
 */
router.get('/orderList', function(req, res, next) {
    var paramters = {};
    var arg = req.query;
    var preRet = res.resData;
    paramters.userId = req.session.buyer.userId;
    //paramters.userId = 17;
    console.log("从session获取userId===>" + paramters.userId);
    paramters.curPage = paramValid.empty(arg.curPage) ? 1 : arg.curPage;
    paramters.count = paramValid.empty(arg.pageSize) ? 4 : arg.pageSize;
    paramters.orderTabState = paramValid.empty(arg.orderState) ? 0 : arg.orderState;
    console.log("paramters===>curPage=" + paramters.curPage + ", count:" + paramters.count + ", orderState:" + paramters.orderState);

    orderModel.listQuery(paramters, preRet, function(rdata){
        res.json(rdata);
        return;
    });
});

/**
 * 各状态订单数量
 */
router.get('/orderStateCount', function(req, res, next) {
    var paramters = {};
    var arg = req.query;
    var preRet = res.resData;
    paramters.userId = req.session.buyer.userId;
    console.log("从session获取userId===>" + paramters.userId);
    paramters.curPage = paramValid.empty(arg.curPage) ? 1 : arg.curPage;
    paramters.count = paramValid.empty(arg.pageSize) ? 4 : arg.pageSize;
    paramters.orderTabState = paramValid.empty(arg.tabState) ? 0 : arg.tabState;

    orderModel.stateCountQuery(paramters, preRet, function(rdata){
        res.json(rdata);
        return;
    });
});

/**
 * 买家订单详情
 */
router.get('/myOrderInfo', function(req, res, next) {
    logger.info('买家订单详情页');
    var arg = req.query;
    var params = res.resData;
    params.title = "订单详情";
    params.orderId = arg.orderId;
    params.userId =  req.session.buyer.userId;
    if (!paramValid.keyValid(params.orderId)) {
        logger.warn("用户userId有误, userId=" + params.userId + ", orderId=" +  params.orderId);
        res.json("非法参数请求！");
        return;
    }
    //2.render no data ui
    view_buyer.my_order_detail(req, res, next, params);
});

router.get('/orderDetail', function(req, res, next) {
    var arg = req.query;
    var params = {};
    var preRet = res.resData;
    params.orderId =  arg.orderId;
    params.userId = req.session.buyer.userId;
    logger.info("获取用户订单详情信息, userId=" + params.userId);
    if (!paramValid.keyValid(params.orderId)) {
        logger.warn("用户userId有误, userId=" + params.userId + ", orderId=" +  params.orderId);
        res.json("非法参数请求！");
        return;
    }

    orderModel.detail(params, preRet, function(rdata){
        res.json(rdata);
        return;
    });
});

router.post('/isBindThirdParty', function(req, res, next) {
    logger.info('取第三方登陆信息');
    var ret=res.resData;
    ret.value = req.session.thirdInfo
    res.json(ret);
});

//暴露模块
module.exports = router;
