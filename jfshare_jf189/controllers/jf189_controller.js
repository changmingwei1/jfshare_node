var express = require('express');
var router = express.Router();

var logger = require('../lib/util/log4node').configlog4node.servLog4js();
var view_index = require('../view_center/index/view_index');
var view_order = require('../view_center/order/view_order');
var paramValid = require('../lib/models/pub/param_valid');
var urlencode = require('urlencode');
var dateutil = require('date-utils');
var CommonUtil = require('../lib/util/CommonUtil');
var qs = require('querystring');
var parseString = require('xml2js').parseString;

var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');
var pay_types = require("../lib/thrift/gen_code/pay_types");
var zookeeper = require('../lib/util/zookeeper_util');
router.get('/index', function(req, res, next) {
    logger.info("首页访问----originalUrl==> " + req.originalUrl);
    logger.info("query.strParm==> " + req.query.strParm);
    if (req.query.strParm) {
        res.redirect("http://ct100.jfshare.com/login/signinThirdParty4TY?redirectUrl=/login&" + req._parsedUrl.query);
    } else {
        logger.info("首页访问----!!!非登录请求");
        res.render("index/index",res.resData);
    }
});

router.get('/orders', function(req, res, next) {
    logger.info("订单列表----originalUrl==> " + req.originalUrl);
    logger.info("订单列表----query.strParm==> " + req.query.strParm);
    if (req.query.strParm) {
        res.redirect("http://ct100.jfshare.com/login/signinThirdParty4TY?redirectUrl=/buyer/jump/myOrders&" + req._parsedUrl.query);
    } else {
        logger.info("订单列表----!!!非登录请求");
        res.redirect("http://ct100.jfshare.com/buyer/jump/myOrders");
    }
});

//前端支付通知跳转页，将参数重定向给天翼页面
router.get('/pay/jump', function(req, res, next) {
    var ret = {};
    try {
        var arg = req.query;
        logger.info("前端支付通知----get前端支付通知跳转页面[jf189]:" + arg.requestXML);

        if (paramValid.empty(arg.requestXML)) {
            logger.warn("获取支付通知参数为空");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.json(ret);
            return;
        }

        ret.status = 200;
        ret.msg = "请求成功";

        var xml = decodeURIComponent(arg.requestXML);
        logger.info("前端支付通知----解析xml:" + xml);
        parseString(xml, function (err, result) {
            console.log(JSON.stringify(result));
            if(result != undefined) {
                var _key = zookeeper.getData("ty_appid");
                var _spid = zookeeper.getData("ty_spid");
                var dt = new Date();
                var d0 = dt.toFormat("YYYYMMDDHH24MISS");
                var d1 = dt.addMinutes(5).toFormat("YYYYMMDDHH24MISS");

                var retParam = result.OutNotifyXMLRequest.PayMoney[0] + "-" + (Number(result.OutNotifyXMLRequest.PayIntegral[0]) + Number(result.OutNotifyXMLRequest.PayVoucher[0]));
                //var _url = "http://y.jf.189.cn/preview/CommPage/Success.aspx?Partner=" + _spid +
                var _url = zookeeper.getData("ty_host_url") + "/CommPage/Success.aspx?Partner=" + _spid +
                    "&Sign=" + CommonUtil.md5(_spid+_key+d1).toUpperCase() +
                    "&ParDate=" + d0 +
                    "&redirect=" + retParam;
                res.redirect(_url);
            } else {
                res.end("支付通知异常");
            }
        });
    } catch (err) {
        logger.error("支付通知跳转页面处理失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(ret);
    }
});

//前端支付通知跳转页，将参数重定向给天翼H5页面
router.get('/pay/jumph5', function(req, res, next) {
    var ret = {};
    try {
        var arg = req.query;
        logger.info("前端支付通知----get前端支付通知跳转页面[jf189]:" + arg.requestXML);

        if (paramValid.empty(arg.requestXML)) {
            logger.warn("获取支付通知参数为空");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.json(ret);
            return;
        }

        ret.status = 200;
        ret.msg = "请求成功";

        var xml = decodeURIComponent(arg.requestXML);
        logger.info("前端支付通知----解析xml:" + xml);
        parseString(xml, function (err, result) {
            console.log(JSON.stringify(result));
            if(result != undefined) {
                var _urlh5 = "http://h5.jfshare.com/h5-bfzx/html/pay-success.html"
                res.redirect(_urlh5);
            } else {
                res.end("支付通知异常");
            }
        });
    } catch (err) {
        logger.error("支付通知跳转页面处理失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(ret);
    }
});

/**
 * 接收天翼的后端支付通知
 */
router.post('/pay/notify', function(req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
        logger.info("后端支付通知----post接收到第三方支付[jf189]的通知：" + arg.requestXML);
        if (paramValid.empty(arg.requestXML)) {
            logger.warn("获取支付通知参数有误, strParm");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.json(ret);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel:1,
            resUrl: arg.requestXML.replace(new RegExp("word","gm"),"+")
        });
        // 获取client
        var payServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payNotify", payRes);
        Lich.wicca.invokeClient(payServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("后端支付通知----调用payServ-payNotify接收支付通知失败  失败原因 ======" + err);
                ret.status = 501;
                ret.msg = "通知失败！";
                res.json(404);
                return;
            }

            logger.info("后端支付通知----调用payServ-payNotify接收支付通知成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.msg = "请求成功";
            //ret.data = data[0].value;
            res.end("200");
        });
    } catch (err) {
        logger.error("后端支付通知----调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(404);
    }
});

/**
 * 接收天翼H5的后端支付通知
 */
router.post('/pay/notifyh5', function(req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
        logger.info("后端支付通知----post接收到第三方支付[jf189]的通知：" + arg.requestXML);
        if (paramValid.empty(arg.requestXML)) {
            logger.warn("获取支付通知参数有误, strParm");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.json(ret);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel:10,
            resUrl: arg.requestXML.replace(new RegExp("word","gm"),"+")
        });
        // 获取client
        var payServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payNotify", payRes);
        Lich.wicca.invokeClient(payServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("后端支付通知----调用payServ-payNotify接收支付通知失败  失败原因 ======" + err);
                ret.status = 501;
                ret.msg = "通知失败！";
                res.json(404);
                return;
            }

            logger.info("后端支付通知----调用payServ-payNotify接收支付通知成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.msg = "请求成功";
            //ret.data = data[0].value;
            res.end("200");
        });
    } catch (err) {
        logger.error("后端支付通知----调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(404);
    }
});

/*
 第三方天翼支付支付成功嵌入页
 */
router.get('/pay/payret', function(req, res, next) {
    try {
        var arg = req.query;
        logger.info("支付成功提示页面----get支付通知跳转嵌入页面" + JSON.stringify(arg));

        var ret = {};
        ret.status = 200;
        ret.msg = "请求成功";
        logger.debug("支付成功提示页面----返回嵌套页的strParm是" + arg.strParm);

        var t = CommonUtil.DesDecryptTY(arg.strParm);
        var result = qs.parse(t);
        logger.debug("支付成功提示页面----返回嵌套页的redirect是" + result.redirect);

        var payMoney = "0";
        var payScore = "0";
        if (!paramValid.empty(result.redirect)) {
            var params = result.redirect.split("-");
            payMoney = paramValid.empty(params[0]) ? "0" : params[0];
            payScore = paramValid.empty(params[1]) ? "0" : params[1];
        }
        logger.debug("支付成功提示页面----返回嵌套页的redirect处理后是payMoney:" + payMoney + ",payScore:" + payScore);
        ret.data = JSON.stringify({price:Number(Number(payMoney)*0.01).toFixed(2), score:Number(payScore).toFixed(0)});

        //var payMoney = paramValid.empty(arg.redirect) ? "0" : arg.redirect;
        //ret.data = JSON.stringify({price:Number(Number(payMoney)*0.01).toFixed(2)});
        //res.json(ret);
        view_order.pay_ret(req, res, next, ret);
    } catch (err) {
        logger.error("支付成功提示页面----支付通知跳转页面处理失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        //res.json(ret);
        view_index.tip(req, res, next, ret);
    }
});

router.get('/default', function(req, res, next) {
    var _key = zookeeper.getData("ty_appid");
    var _spid = zookeeper.getData("ty_spid");
    var dt = new Date();
    var d0 = dt.toFormat("YYYYMMDDHH24MISS");
    var d1 = dt.addMinutes(5).toFormat("YYYYMMDDHH24MISS");
    var _url = zookeeper.getData("ty_host_url") + "/CommPage/Default.aspx?Partner=" + _spid
        + "&Sign=" + CommonUtil.md5(_spid+_key+d1).toUpperCase()
        + "&ParDate=" + d0;
    logger.info('189url-----> ' + _url);
    res.redirect(_url);
});

/*
 获取天翼hostUrl
 */
router.get('/ty/hostUrl', function(req, res, next) {
    res.json({url:zookeeper.getData("ty_host_url")});
});

module.exports = router;
