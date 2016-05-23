/**
 * Created by YinBo on 2016/4/12.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var slotImage_types = require('../lib/thrift/gen_code/slotImage_types');
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Active = require('../lib/models/active');
var Message = require('../lib/models/message');

//获取首页轮播图列表
router.get('/imgList', function (request, response, next) {

    logger.info("进入首页轮播图列表接口...");
    var resContent = {code: 200};

    try {
        var param = request.query;
        logger.info("It's test______" + param);
        if (param.type == null || param.type == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        /*for PC type=1*/
        if(param.type = 1) {
            Active.querySlotImageList(param, function (error, data) {
                if (error) {
                    response.json(error);
                    return;
                } else {
                    var slotImageList = data[0].slotImageList;
                    resContent.slotImageList = slotImageList;

                    response.json(resContent);
                    logger.info("响应:" + JSON.stringify(resContent));
                }
            });
        }
        /*for APP type=2*/
        Active.querySlotImageList(param, function (error, data) {
            if (error) {
                response.json(error);
                return;
            } else {
                var slotImageList = data[0].slotImageList;
                resContent.slotImageList = slotImageList;

                response.json(resContent);
                logger.info("响应:" + JSON.stringify(resContent));
            }
        });
    } catch
        (ex) {
        logger.error("获取信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取信息";
        response.json(resContent);
    }
});

//获取系统消息列表
router.get('/messageList', function (request, response, next) {

    logger.info("进入获取系统消息列表接口...");

    var resContent = {code: 200};
    try {
        var param = request.query;
        if (param.type == null || param.type == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        logger.info("It's test______" + param);

        Message.list(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var messages = data[0].messages;
            resContent.messages = messages;
            response.json(resContent);
            logger.info("响应的结果:" + JSON.stringify(resContent));
        });

    } catch (ex) {
        logger.error("获取信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取信息";
        response.json(resContent);
    }
});

//查询升级信息
router.get('/getAppUpgradeInfo', function (request, response, next) {

    logger.info("进入升级版本接口...");

    var resContent = {code: 200};
    try {
        var param = request.query;
        if (param.appType == null || param.appType == "") {
            resContent.code = 400;
            resContent.desc = "请输入类型";
            response.json(resContent);
            return;
        }
        if (param.version == null || param.version == "") {
            resContent.code = 400;
            resContent.desc = "当前客户端版本号不能为空";
            response.json(resContent);
            return;
        }
        logger.info("It's test______" + JSON.stringify(param));

        Message.getAppUpgradeInfo(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var upgradeInfo = data[0].upgradeInfo;
            resContent.upgradeInfo = upgradeInfo;
            response.json(resContent);
            logger.info("响应的结果:" + JSON.stringify(resContent));
        });

    } catch (ex) {
        logger.error("获取版本号失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取到版本号";
        response.json(resContent);
    }
});


module.exports = router;