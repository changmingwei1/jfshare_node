/**
 * Created by  on 17/7/27.
 * 万益通对接
 */
var express = require('express');
var router = express.Router();
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var page = require('../lib/thrift/gen_code/pagination_types.js');
var Score = require('../lib/models/score');
var Buyer = require('../lib/models/buyer');


//查询积分余额
router.post('/queryBalance', function (req, res, next) {
    var result = {code: "00"};

    try {
        var arg = req.body;
        logger.info("查询积分余额请求参数， arg:" + JSON.stringify(arg));
        if (arg.uid == null || arg.uid == "") {
            logger.info("error at uid: " + arg.uid);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.exCode == null || arg.exCode == "" ) {
            logger.info("error at exCode" + arg.exCode);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.sign == null || arg.sign == "") {
            logger.info("error at sign" + arg.sign);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.timestamp == null || arg.timestamp == "") {
            logger.info("error at timestamp" + arg.timestamp);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
            Score.queryBalance(arg, function (err, data) {
                logger.info("响应的结果 ：" + JSON.stringify(data));
                if (err) {
                    res.json(err);
                } else {
                    if (data[0].result.code == 1) {
                        result.code = data[0].result.failDescList[0].failCode;
                        result.msg = data[0].result.failDescList[0].desc;
                    } else if (data[0].result.code == 500) {
                        result.code = 500;
                        result.msg = '查询失败';
                    } else {
                        var balance = data[0].value;
                        result.data = {"balance": +balance};
                        result.msg = '查询成功';
                    }
                    res.json(result);
                    logger.info("响应的结果:" + JSON.stringify(result));
                }
            });

    } catch (ex) {
        logger.error("get receiveCoupon  error:" + ex);
        result.code = 500;
        result.msg = "查询失败";
        res.json(result);
    }
});
//积分转账
router.post('/transferScore', function (req, res, next) {
    var result = {code: "00"};
    try {
        var arg = req.body;
        logger.info("积分转账请求参数， arg:" + JSON.stringify(arg));
        if (arg.buyUid == null || arg.buyUid == "") {
            logger.info("error at buyUid: " + arg.buyUid);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.sellUid == null || arg.sellUid == "") {
            logger.info("error at sellUid: " + arg.sellUid);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }

        if (arg.exCode == null || arg.exCode == "" ) {
            logger.info("error at exCode" + arg.exCode);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.quantity == null || arg.quantity == "" ) {
            logger.info("error at quantity" + arg.quantity);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.txnId == null || arg.txnId == "" ) {
            logger.info("error at txnId" + arg.txnId);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.sign == null || arg.sign == "") {
            logger.info("error at sign" + arg.sign);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.timestamp == null || arg.timestamp == "") {
            logger.info("error at timestamp" + arg.timestamp);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }

        Score.transferScore(arg, function (err, data) {
            logger.info("响应的结果 ：" + JSON.stringify(data));
            if (err) {
                res.json(err);
            } else {
                if(data[0].result.code==1){
                    result.code=data[0].result.failDescList[0].failCode;
                    result.msg=data[0].result.failDescList[0].desc;
                }else if(data[0].result.code==500){
                    result.code=500;
                    result.msg='转账失败';
                }else{
                    var buyUid = data[0].buyUid;
                    var sellUid = data[0].sellUid;
                    var exCode = data[0].exCode;
                    var quantity = data[0].quantity;
                    var txnId = data[0].txnId;
                    var transId = data[0].transId;
                    result.data={"buyUid":buyUid,"sellUid":sellUid,"exCode":exCode,"quantity":quantity,"txnId":txnId,"transId":transId};
                    result.msg='转账成功';
                }
                res.json(result);
                logger.info("响应的结果:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("get transferScore  error:" + ex);
        result.code = 500;
        result.msg = "转账失败";
        res.json(result);
    }
});

//查询积分交易记录
router.post('/queryDeal', function (req, res, next) {
    var result = {code: "00"};

    try {
        var arg = req.body;
        logger.info("查询积分交易记录参数， arg:" + JSON.stringify(arg));
        if (arg.txnId == null || arg.txnId == "") {
            logger.info("error at txnId: " + arg.txnId);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.sign == null || arg.sign == "") {
            logger.info("error at sign" + arg.sign);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.timestamp == null || arg.timestamp == "") {
            logger.info("error at timestamp" + arg.timestamp);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }

        Score.queryDeal(arg, function (err, data) {
            logger.info("接口响应的结果 ：" + JSON.stringify(data));
            if (err) {
                res.json(err);
            } else {
                if(data[0].result.code==1){
                    result.code=data[0].result.failDescList[0].failCode;
                    result.msg=data[0].result.failDescList[0].desc;
                }else if(data[0].result.code==500){
                    result.code=500;
                    result.msg='查询失败';
                }else{
                    var uid = data[0].uid;
                    var exCode = data[0].exCode;
                    var quantity = data[0].quantity;
                    var txnId = data[0].txnId;
                    var transId = data[0].transId;
                    result.data={"uid":uid,"exCode":exCode,"quantity":quantity,
                        transId:transId,txnId:txnId};
                    result.msg='查询成功';
                }
                res.json(result);
                logger.info("响应的结果:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("get queryDeal  error:" + ex);
        result.code = 500;
        result.msg = "查询失败";
        res.json(result);
    }
});

//积分冲正
router.post('/reverseScore', function (req, res, next) {
    var result = {code: "00"};

    try {
        var arg = req.body;
        logger.info("积分冲正请求参数， arg:" + JSON.stringify(arg));
        if (arg.txnId == null || arg.txnId == "") {
            logger.info("error at txnId: " + arg.txnId);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.sign == null || arg.sign == "") {
            logger.info("error at sign" + arg.sign);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.timestamp == null || arg.timestamp == "") {
            logger.info("error at timestamp" + arg.timestamp);
            result.code = 400;
            result.msg = "请求参数错误";
            res.json(result);
            return;
        }

        Score.reverseScore(arg, function (err, data) {
            logger.info("响应的结果 ：" + JSON.stringify(data));
            if (err) {
                res.json(err);
            } else {
                if(data[0].result.code==1){
                    result.code=data[0].result.failDescList[0].failCode;
                    result.msg=data[0].result.failDescList[0].desc;
                }else if(data[0].result.code==500){
                    result.code=500;
                    result.msg='冲正失败';
                }else{
                    var uid = data[0].uid;
                    var exCode = data[0].exCode;
                    var quantity = data[0].quantity;
                    var txnId = data[0].txnId;
                    var transId = data[0].transId;
                    result.data={"uid":uid,"exCode":exCode,"quantity":quantity,
                        transId:transId,txnId:txnId};
                    result.msg='冲正成功';
                }
                res.json(result);
                logger.info("响应的结果:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("get reverseScore  error:" + ex);
        result.code = 500;
        result.msg = "冲正失败";
        res.json(result);
    }
});

module.exports = router;
