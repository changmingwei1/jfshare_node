/**
 *  积分卡  管理
 *  chiwenheng
 *  0815
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var SlotImage = require('../lib/models/slot_image');// 广告位功能模块

/* 保存广告位图片 */
router.post('/saveAdvertSlotImage', function (request, response, next) {
    logger.info("保存广告位图片");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("saveAdvertSlotImage params:" + JSON.stringify(params));
        if (params.imgKey == null || params.imgKey == "") {
            result.code = 400;
            result.desc = "imgKey参数错误";
            response.json(result);
            return;
        }
        if (params.advertId == null || params.advertId == "") {
            result.code = 400;
            result.desc = "advertId参数错误";
            response.json(result);
            return;
        }
        if (params.slotName == null || params.slotName == "") {
            result.code = 400;
            result.desc = "slotName参数错误";
            response.json(result);
            return;
        }
        if (params.remark == null || params.remark == "") {
            result.code = 400;
            result.desc = "remark参数错误";
            response.json(result);
            return;
        }
        if (params.startTime == null || params.startTime == "") {
            result.code = 400;
            result.desc = "startTime参数错误";
            response.json(result);
            return;
        }
        if (params.endTime == null || params.endTime == "") {
            result.code = 400;
            result.desc = "endTime参数错误";
            response.json(result);
            return;
        }
        SlotImage.saveAdvertSlotImage(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("保存广告位图片错误:" + ex);
        result.code = 500;
        result.desc = "保存广告位图片错误";
        response.json(result);
    }
});

/* 修改广告位图片 */
router.post('/updateAdvertSlotImage', function (request, response, next) {
    logger.info("修改广告位图片");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("updateAdvertSlotImage params:" + JSON.stringify(params));
        if (params.id == null || params.id == "") {
            result.code = 400;
            result.desc = "id参数错误";
            response.json(result);
            return;
        }
        if (params.imgKey == null || params.imgKey == "") {
            result.code = 400;
            result.desc = "imgKey参数错误";
            response.json(result);
            return;
        }
        if (params.advertId == null || params.advertId == "") {
            result.code = 400;
            result.desc = "advertId参数错误";
            response.json(result);
            return;
        }
        if (params.remark == null || params.remark == "") {
            result.code = 400;
            result.desc = "remark参数错误";
            response.json(result);
            return;
        }
        if (params.startTime == null || params.startTime == "") {
            result.code = 400;
            result.desc = "startTime参数错误";
            response.json(result);
            return;
        }
        if (params.endTime == null || params.endTime == "") {
            result.code = 400;
            result.desc = "endTime参数错误";
            response.json(result);
            return;
        }
        if (params.createTime == null || params.createTime == "") {
            result.code = 400;
            result.desc = "createTime参数错误";
            response.json(result);
            return;
        }
        SlotImage.updateAdvertSlotImage(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("修改广告位图片错误:" + ex);
        result.code = 500;
        result.desc = "修改广告位图片错误";
        response.json(result);
    }
});

/* 查询广告位图片列表 -- 管理中心 */
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

/* 查询广告位图片 */
router.post('/queryAdvertSlotImage', function (request, response, next) {
    logger.info("查询广告位图片流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("queryAdvertSlotImage params:" + JSON.stringify(params));
        if (params.advertId == null || params.advertId == "") {
            result.code = 500;
            result.desc = "advertId参数错误";
            response.json(result);
            return;
        }
        if (params.id == null || params.id == "") {
            result.code = 500;
            result.desc = "id参数错误";
            response.json(result);
            return;
        }
        
        SlotImage.queryAdvertSlotImage(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            if (data[0] != null && data[0] != "") {
                result.AdvertSlotImage=data[0].AdvertSlotImage;
            }
            logger.info("queryAdvertSlotImage result:" + JSON.stringify(data));
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

/*删除广告位图片*/
router.post('/deleteAdvertSlotImage', function (request, response, next) {
    logger.info("删除广告位图片");
    //设置默认值
    var result = {code: 200};
    try {
        var params = request.body;
        if (params.id == null || params.id == "") {
            result.code = 500;
            result.desc = "id参数错误";
            response.json(result);
            return;
        }
        if (params.advertId == null || params.advertId == "") {
            result.code = 500;
            result.desc = "advertId参数错误";
            response.json(result);
            return;
        }

        SlotImage.deleteAdvertSlotImage(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            logger.info("deleteAdvertSlotImage result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("删除广告位图片失败:" + ex);
        result.code = 500;
        result.desc = "删除广告位图片失败";
        response.json(result);
    }
});

/*统一发布图片*/
router.post('/publishAdvertSlot', function (request, response, next) {
    logger.info("发布图片");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("publishAdvertSlot params:" + JSON.stringify(params));
        if (params.advertId == null || params.advertId == "") {
            result.code = 500;
            result.desc = "advertId参数错误";
            response.json(result);
            return;
        }
        if (params.slotImageList == null || params.slotImageList == "") {
            result.code = 500;
            result.desc = "slotImageList参数错误";
            response.json(result);
            return;
        }
        SlotImage.publishAdvertSlot(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("publishAdvertSlot result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("统一发布图片错误:" + ex);
        result.code = 500;
        result.desc = "统一发布图片错误";
        response.json(result);
    }
});

/* 查询广告位模块列表 -- 管理中心 */
router.post('/queryAdvertSlotList', function (request, response, next) {
    logger.info("查询广告模块列表");
    var result = {code: 200};
    var AdvertSlotList = [];
    try {
        var params = request.body;

        SlotImage.queryAdvertSlotList(params,function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            AdvertSlotList = data[0].slotList;
            result.AdvertSlotList = AdvertSlotList;
            logger.info("queryAdvertSlotList result:" + JSON.stringify(result));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("查询广告位模块异常:" + ex);
        result.code = 500;
        result.desc = "查询广告位模块错误";
        response.json(result);
    }
});


module.exports = router;