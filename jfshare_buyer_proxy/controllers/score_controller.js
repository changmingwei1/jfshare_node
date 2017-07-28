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



//查询积分余额
router.post('/queryBalance', function (req, res, next) {
    var result = {code: "00"};

    try {
        var arg = req.body;
        logger.info("查询积分余额请求参数， arg:" + JSON.stringify(arg));
        if (arg.uid == null || arg.uid == "") {
            logger.info("error at uid: " + arg.uid);
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.exCode == null || arg.exCode == "" ) {
            logger.info("error at exCode" + arg.exCode);
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.sign == null || arg.sign == "") {
            logger.info("error at sign" + arg.sign);
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.timestamp == null || arg.timestamp == "") {
            logger.info("error at timestamp" + arg.timestamp);
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Score.queryBalance(arg, function (err, data) {
            logger.info("响应的结果 ：" + JSON.stringify(data));
            if (err) {
                res.json(err);
            } else {
                if(data[0].result.code==1){
                    result.code=data[0].result.failDescList[0].failCode;
                    result.desc=data[0].result.failDescList[0].desc;
                }else if(data[0].result.code==500){
                    result.code=500;
                    result.desc='导入失败';
                }else{
                    var balance = data[0].value;
                    result.data="{"+"balance"+":"+balance+"}";

                    result.msg='';
                }
                res.json(result);
                logger.info("响应的结果:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("get receiveCoupon  error:" + ex);
        result.code = 500;
        result.desc = "领取失败";
        res.json(result);
    }
});


module.exports = router;
