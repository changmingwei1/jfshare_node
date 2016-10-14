var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var fileCards = require('../lib/models/file_card');// 广告位功能模块

/* 第三方卡密上传*/
router.post('/fileToTY', function (request, response, next) {
    logger.info("第三方卡密上传");
    var result = {code: 200};
    var AdvertSlotImageList = [];
    try {
        var params = request.body;
        //参数校验
        logger.info("fileToTY params:" + JSON.stringify(params));
        if (params.productName == null || params.productName == "") {
            result.code = 400;
            result.desc = " ProductName 参数错误";
            response.json(result);
            return;
        }
        if (params.productNo == null || params.productNo == "") {
            result.code = 400;
            result.desc = " ProductNo 参数错误";
            response.json(result);
            return;
        }
        if (params.dataType == null || params.dataType == "") {
            result.code = 400;
            result.desc = " DataType 参数错误";
            response.json(result);
            return;
        }
        if (params.expDate_Flag == null || params.expDate_Flag == "") {
            result.code = 400;
            result.desc = " ExpDate_Flag 参数错误";
            response.json(result);
            return;
        }
        if (params.cardNumber == null || params.cardNumber == "") {
            result.code = 400;
            result.desc = " CardNumber 参数错误";
            response.json(result);
            return;
        }
        if (params.startDate == null || params.startDate == "") {
            result.code = 400;
            result.desc = " ExpDate_Flag 参数错误";
            response.json(result);
            return;
        }
        if (params.faceValue == null || params.faceValue == "") {
            result.code = 400;
            result.desc = " ExpDate_Flag 参数错误";
            response.json(result);
            return;
        }
        if (params.realValue == null || params.realValue == "") {
            result.code = 400;
            result.desc = " ExpDate_Flag 参数错误";
            response.json(result);
            return;
        }
        if (params.excelKeyUrl == null || params.excelKeyUrl == "") {
            result.code = 400;
            result.desc = " excelKeyUrl 参数错误";
            response.json(result);
            return;
        }

        fileCards.fileToTY(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("fileToTY result:" + JSON.stringify(result));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error(" 第三方卡密上传异常:" + ex);
        result.code = 500;
        result.desc = " 第三方卡密上传错误";
        response.json(result);
    }
});

module.exports = router;