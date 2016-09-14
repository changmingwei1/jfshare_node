var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var SlotImage = require('../lib/models/slot_image');// 广告位功能模块

/* 查询广告位图片列表 -- 前端*/
router.post('/queryAdvertSlotImageList', function (request, response, next) {
    logger.info("查询广告位图片");
    var result = {code: 200};
    var AdvertSlotImageList = [];
    try {
        var params = request.body;
        //参数校验
        logger.info("queryAdvertSlotImageList params:" + JSON.stringify(params));
        if (params.advertId == null || params.advertId == "") {
            result.code = 400;
            result.desc = "advertId参数错误";
            response.json(result);
            return;
        }
        SlotImage.queryAdvertSlotImageList(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            AdvertSlotImageList = data[0].slotImageList;
            result.AdvertSlotImageList = AdvertSlotImageList;
            logger.info("queryAdvertSlotImageList result:" + JSON.stringify(result));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("查询广告位图片异常:" + ex);
        result.code = 500;
        result.desc = "查询广告位图片错误";
        response.json(result);
    }
});

module.exports = router;