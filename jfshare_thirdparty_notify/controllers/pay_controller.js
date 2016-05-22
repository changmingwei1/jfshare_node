/**
 * Created by L on 2015/10/24 0024.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
//var path = require('path');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);
var paramValid = require('../lib/models/pub/param_valid');
var pay_types = require("../lib/thrift/gen_code/pay_types");
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');
var protocol = thrift.TBinaryProtocol;
var transport =  thrift.TFramedTransport;
var thriftOptions = {
    transport: transport,
    protocol: protocol
};
var thriftConfig = require('../resource/thrift_config');

//get pay notify   strParm=strReturnSecret
router.get('/notify/jf189', function(req, res, next) {
    try {
        var ret = {};
        var arg = req.query;
        logger.info("########get接收到第三方支付[jf189]的通知【注：仅用于测试模拟支付使用】：" + JSON.stringify(arg));
        if (paramValid.empty(arg.strParm)) {
            logger.warn("获取支付通知参数有误, strParm");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.json(ret);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel:1,
            resUrl:arg.strParm,
        });
        // 获取client
        var payServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payNotify", payRes);
        Lich.wicca.invokeClient(payServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用payServ-payNotify接收支付通知失败  失败原因 ======" + err);
                ret.status = 500;
                ret.msg = "通知失败！";
                res.json(ret);
                return;
            }

            logger.info("调用payServ-payNotify接收支付通知成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.msg = "请求成功";
            ret.data = data[0].value;
            res.json(ret);
        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(ret);
    }
});

/**
 * 接收天翼的后端支付通知
 */
router.post('/notify/jf189', function(req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
        var resObj = JSON.stringify(arg);
        logger.info("########post接收到第三方支付[jf189]的通知：" + resObj);
        //if (paramValid.empty(arg.strParm)) {
        //    logger.warn("获取支付通知参数有误, strParm");
        //    ret.status = 500;
        //    ret.msg = "非法参数请求！";
        //    res.json(ret);
        //    return;
        //}

        var payRes = new pay_types.PayRes({
            payChannel:1,
            resUrl:resObj,
        });
        // 获取client
        var payServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payNotify", payRes);
        Lich.wicca.invokeClient(payServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用payServ-payNotify接收支付通知失败  失败原因 ======" + err);
                ret.status = 501;
                ret.msg = "通知失败！";
                res.json(404);
                return;
            }

            logger.info("调用payServ-payNotify接收支付通知成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.msg = "请求成功";
            //ret.data = data[0].value;
            res.json(200);
        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(404);
    }
});

router.get('/notify/alipay', function(req, res, next) {
    try {
        var ret = {};
        var arg = req.query;
        logger.info("########get接收到第三方支付[alipay]的通知【注：仅用于测试模拟支付使用】：" + JSON.stringify(arg));
        ret.status = 200;
        ret.msg = "测试成功";
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
    }

    res.json(ret);
});

router.post('/notify/alipay', function(req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
        var resObj = JSON.stringify(arg);
        logger.info("########post接收到第三方支付[alipay]的通知：" + resObj);

        if (paramValid.empty(resObj)) {
            logger.warn("获取支付通知参数有误, arg");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.json(ret);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel:2,
            resUrl:resObj,
        });
        // 获取client
        var payServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payNotify", payRes);
        Lich.wicca.invokeClient(payServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用payServ-payNotify接收支付通知失败  失败原因 ======" + err);
                ret.status = 501;
                ret.msg = "通知失败！";
                res.json(404);
                return;
            }

            logger.info("调用payServ-payNotify接收支付通知成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.msg = "请求成功";
            //ret.data = data[0].value;
            res.json(200);
        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(404);
    }
});


router.get('/notify/weixinpay', function(req, res, next) {
    try {
        var ret = {};
        var arg = req.query;
        logger.info("########get接收到第三方支付[weixinpay]的通知【注：仅用于测试模拟支付使用】：" + JSON.stringify(arg));
        ret.status = 200;
        ret.msg = "测试成功";
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
    }

    res.json(ret);
});

router.post('/notify/weixinpay', function(req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
        var resObj = JSON.stringify(arg);
        logger.info("########post接收到第三方支付[weixinpay]的通知：" + resObj);

        if (paramValid.empty(resObj)) {
            logger.warn("获取支付通知参数有误, arg");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
            var data  = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
            res.end(data);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel:3,
            resUrl:resObj,
        });
        // 获取client
        var payServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payNotify", payRes);
        Lich.wicca.invokeClient(payServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用payServ-payNotify接收支付通知失败  失败原因 ======" + err);
                ret.status = 501;
                ret.msg = "通知失败！";
                //res.json(404);
                res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
                var data  = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
                res.end(data);
                return;
            }

            logger.info("调用payServ-payNotify接收支付通知成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.msg = "请求成功";
            //ret.data = data[0].value;
            //res.json(200);
            res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
            var data  = "\<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>";
            res.end(data);

        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        //res.json(404);
        res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
        var data  = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
        res.end(data);
    }
});

router.get('/notify/hebaopay', function(req, res, next) {
    try {
        var ret = {};
        var arg = req.query;
        logger.info("########get接收到第三方支付[hebaopay]的通知【注：仅用于测试模拟支付使用】：" + JSON.stringify(arg));
        ret.status = 200;
        ret.msg = "测试成功";
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
    }

    res.json(ret);
});

router.post('/notify/hebaopay', function(req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
        var resObj = JSON.stringify(arg);
        logger.info("########post接收到第三方支付[hebaopay]的通知：" + resObj);

        if (paramValid.empty(resObj)) {
            logger.warn("获取支付通知参数有误, arg");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.json(ret);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel:8,
            resUrl:resObj,
        });
        // 获取client
        var payServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payNotify", payRes);
        Lich.wicca.invokeClient(payServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用payServ-payNotify接收支付通知失败  失败原因 ======" + err);
                ret.status = 501;
                ret.msg = "通知失败！";
                res.json(404);
                return;
            }

            logger.info("调用payServ-payNotify接收支付通知成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.msg = "请求成功";
            //ret.data = data[0].value;
            //res.json(200);

            res.writeHead(ret.status, {'Content-Type': 'text/html;charset=utf-8"'});
            var data  = "SUCCESS";
            res.end(data);
        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(404);
    }
});

//暴露模块
module.exports = router;
