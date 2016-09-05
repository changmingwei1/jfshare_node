/**
 *  积分红包  管理
 *  chiwenheng
 *  0901
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var RedPaper = require('../lib/models/redPaper');// 积分红包功能


router.post('/queryOneRedPaperActivity', function (request, response, next) {
    logger.info("查询单个积分红包活动的信息");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("queryOneRedPaperActivity params:" + JSON.stringify(params));

        if (params.activityId == null || params.activityId == "") {// 操作id
            result.code = 500;
            result.desc = "activityId  参数错误";
            response.json(result);
            return;
        }

        RedPaper.queryOneRedPaperActivity(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var temp=data[0].entity;
            var obj={};
            obj.name=temp.name;
            obj.isH5=temp.isH5;
            obj.configure=temp.configure;
            obj.isShowRecord=temp.isShowRecord;
            result.entity=obj;

            logger.info("queryOneRedPaperActivity result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("查询单个积分红包活动的信息:" + ex);
        result.code = 500;
        result.desc = "查询单个积分红包活动的信息";
        response.json(result);
    }
});

router.post('/receiveRedbag', function (request, response, next) {
    logger.info("进入领取积分活动的接口");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("receiveRedbag params:" + JSON.stringify(params));

        if (params.encryActivityId == null || params.encryActivityId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.mobile == null || params.mobile == "") {
            result.code = 400;
            result.desc = "手机号不能为空";
            response.json(result);
            return;
        }

        RedPaper.receiveRedbag(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.value = data[0].value;
            logger.info("receiveRedbag result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("领取积分活动:" + ex);
        result.code = 500;
        result.desc = "领取积分活动";
        response.json(result);
    }
});


module.exports = router;