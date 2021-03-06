/**
 * Created by L on 2015/10/24 0024.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
//var path = require('path');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var paramValid = require('../lib/models/pub/param_valid');
var pay_types = require("../lib/thrift/gen_code/pay_types");
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');
var protocol = thrift.TBinaryProtocol;
var transport = thrift.TFramedTransport;
var thriftOptions = {
    transport: transport,
    protocol: protocol
};
var thriftConfig = require('../resource/thrift_config');

//get pay notify   strParm=strReturnSecret
router.get('/notify/jf189', function (req, res, next) {
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
            payChannel: 1,
            resUrl: arg.strParm,
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
router.post('/notify/jf189', function (req, res, next) {
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
            payChannel: 1,
            resUrl: resObj,
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

router.get('/notify/alipay', function (req, res, next) {
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

router.get('/jump/alih5', function (req, res, next) {
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

router.post('/jump/alih5', function (req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
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


router.post('/notify/bestpay', function (req, res, next) {
    try {
        var ret = {};
        logger.info("支付回调--post");
        var arg = req.body;
        var resObj = JSON.stringify(arg);
        logger.info("########post接收到第三方支付[bestpay]的通知：" + resObj);

        if (paramValid.empty(resObj)) {
            logger.warn("获取支付通知参数有误, arg");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.json(ret);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel: 12,
            resUrl: resObj
        });
        // 获取client
        var payServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payNotify", payRes);
        Lich.wicca.invokeClient(payServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用payServ-payNotify接收支付通知失败  失败原因 ======" + err + JSON.stringify(data));
                ret.status = 501;
                ret.msg = "通知失败！";
                res.json(404);
                return;
            }
            logger.info("调用payServ-payNotify接收支付通知成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);

            if (data != null && data[0] != null) {

                var result = "UPTRANSEQ_" + arg.UPTRANSEQ;
                logger.info("返回给翼支付的结果" + result);
                res.json(result);
                return;
            }
        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(404);
    }
});


router.post('/notify/jumpWeb', function (req, res, next) {
    try {
        var arg = req.body;
        logger.info("前端支付通知----post前端支付通知跳转页面[web]:" + JSON.stringify(arg));
        var url = "http://www.jfshare.com/view/paySuccess.html#!";
        res.redirect(url);
    } catch (err) {
        logger.error("支付通知跳转页面处理失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(ret);
    }
});


router.post('/notify/alipay', function (req, res, next) {
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
            payChannel: 2,
            resUrl: resObj,
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
           // ret.status = 200;
            //ret.msg = "请求成功";
            //ret.data = data[0].value;
            res.write("success");
            res.end();
           //res.json("success");
        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(404);
    }
});


router.get('/notify/weixinpay', function (req, res, next) {
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

router.post('/notify/weixinpay', function (req, res, next) {
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
            var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
            res.end(data);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel: 3,
            resUrl: resObj,
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
                var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
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
            var data = "\<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>";
            res.end(data);

        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        //res.json(404);
        res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
        var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
        res.end(data);
    }
});

router.post('/notify/weixinwap', function (req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
        var resObj = JSON.stringify(arg);
        logger.info("########post接收到第三方支付[weixinwap]的通知：" + resObj);

        if (paramValid.empty(resObj)) {
            logger.warn("获取支付通知参数有误, arg");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
            var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
            res.end(data);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel: 4,
            resUrl: resObj,
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
                var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
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
            var data = "\<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>";
            res.end(data);

        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        //res.json(404);
        res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
        var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
        res.end(data);
    }
});

router.post('/notify/weixinapp', function (req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
        var resObj = JSON.stringify(arg);
        logger.info("########post接收到第三方支付[weixinapp]的通知：" + resObj);

        if (paramValid.empty(resObj)) {
            logger.warn("获取支付通知参数有误, arg");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
            var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
            res.end(data);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel: 9,
            resUrl: resObj,
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
                var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
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
            var data = "\<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>";
            res.end(data);

        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        //res.json(404);
        res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
        var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
        res.end(data);
    }
});

router.get('/notify/hebaopay', function (req, res, next) {
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

router.post('/notify/hebaopay', function (req, res, next) {
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
            payChannel: 8,
            resUrl: resObj,
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
            var data = "SUCCESS";
            res.end(data);
        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        res.json(404);
    }
});

router.post('/notify/cmbpay', function (req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
        var resObj = arg.jsonRequestData;
        logger.info("########post接收到第三方支付完成[cmbapp]的resObj通知：" + JSON.stringify(arg.jsonRequestData));

        var ip = getClientIP(req);
        logger.info("招行支付完成回调IP为" + ip);
        //if (ip != "::ffff:61.144.248.17") { //::ffff:124.42.103.132
        //    ret.code = 400;
        //    ret.desc = "访问IP不在配置范围内";
        //    response.json(ret);
        //    return;
        //}
        if (paramValid.empty(resObj)) {
            logger.warn("获取支付通知参数有误, arg");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
            var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
            res.end(data);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel: 11,
            resUrl: resObj,
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
                var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
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
            var data = "\<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>";
            res.end(data);

        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收支付通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        //res.json(404);
        res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
        var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
        res.end(data);
    }
});

/*获取请求IP公共方法*/
function getClientIP(request) {
    var ipAddress;
    var headers = request.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = request.connection.remoteAddress;
    }
    return ipAddress;
};

router.post('/notify/cmbpayNotifySign', function (req, res, next) {
    try {
        var ret = {};
        var arg = req.body;
        var resObj = arg.jsonRequestData;
        logger.info("########post接收到第三方签约[cmbapp]的resObj通知：" + resObj);

        var ip = getClientIP(req);
        logger.info("招行签约完成回调IP为" + ip);
        //if (ip != "::ffff:61.144.248.17") { //::ffff:124.42.103.132
        //    ret.code = 400;
        //    ret.desc = "访问IP不在配置范围内";
        //    response.json(ret);
        //    return;
        //}

        if (paramValid.empty(resObj)) {
            logger.warn("获取支付通知参数有误, arg");
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
            var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
            res.end(data);
            return;
        }

        var payRes = new pay_types.PayRes({
            payChannel: 11,
            resUrl: resObj,
        });
        // 获取client
        var payServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payNotifySign", payRes);
        Lich.wicca.invokeClient(payServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用payServ-payNotify接收签约通知失败  失败原因 ======" + err);
                ret.status = 501;
                ret.msg = "通知失败！";
                //res.json(404);
                res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
                var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
                res.end(data);
                return;
            }

            logger.info("调用payServ-payNotify接收签约通知成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.msg = "请求成功";
            //ret.data = data[0].value;
            //res.json(200);
            res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
            var data = "\<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>";
            res.end(data);

        });
    } catch (err) {
        logger.error("调用payServ-payNotify接收签约通知失败！", err);
        ret.status = 500;
        ret.msg = "处理失败！";
        //res.json(404);
        res.writeHead(ret.status, {'Content-Type': 'application/xml;charset=utf-8"'});
        var data = "\<xml><return_code>FAIL</return_code><return_msg>" + ret.msg + "</return_msg></xml>";
        res.end(data);
    }
});

//router.post('/notify/cmbpay', function(req, res, next) {
//    try {
//        var ret = {};
//        var arg = req.body;
//        logger.info("########get接收到第三方支付[cmbpay]的通知【注：仅用于测试模拟支付使用】：" + JSON.stringify(arg.jsonRequestData));
//        ret.status = 200;
//        ret.msg = "测试成功";
//    } catch (err) {
//        logger.error("调用payServ-payNotify接收支付通知失败！", err);
//        ret.status = 500;
//        ret.msg = "处理失败！";
//    }
//    res.json(ret);
//});
//暴露模块
module.exports = router;
