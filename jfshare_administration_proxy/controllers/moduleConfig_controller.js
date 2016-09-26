
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var ModuleConfig = require('../lib/models/moduleConfig');// 广告位功能模块

/* 查询模块列表 */
router.post('/queryModuleConfig', function (request, response, next) {
    logger.info("开始查询模块");
    var result = {code: 200};
    var ModuleConfigList = [];
    try {
        var params = request.body;

        ModuleConfig.queryModuleConfig(params,function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            ModuleConfigList = data[0].moduleConfigList;
            result.ModuleConfigList = ModuleConfigList;
            logger.info("queryAdvertSlotList result:" + JSON.stringify(result));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("查询模块列表异常:" + ex);
        result.code = 500;
        result.desc = "查询模块列表错误";
        response.json(result);
    }
});

/* 查询模块配置明细 */
router.post('/queryModuleConfigDetail', function (request, response, next) {
    logger.info("开始查询模块配置明细");
    var result = {code: 200};
    var ModuleConfigDetailList = [];
    try {
        var params = request.body;
        //参数校验
        logger.info("queryModuleConfigDetail params:" + JSON.stringify(params));
        if (params.moduleId == null || params.moduleId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        ModuleConfig.queryModuleConfigDetail(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            if(data[0] != null || data[0].ModuleConfigDetailList != null){
                ModuleConfigDetailList = data[0].ModuleConfigDetailList;
            }
            result.ModuleConfigDetailList = ModuleConfigDetailList;
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("开始查询模块配置明细错误:" + ex);
        result.code = 500;
        result.desc = "开始查询模块配置明细错误";
        response.json(result);
    }
});

/* 导入商品或品牌ID */
router.post('/importExcel', function (request, response, next) {
    logger.info("查询广告位图片");
    var result = {code: 200};
    var ModuleConfigDetailList = [];
    var importCount;
    try {
        var params = request.body;
        //参数校验
        logger.info("importExcel params:" + JSON.stringify(params));
        if (params.moduleId == null || params.moduleId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.filePath == null || params.filePath == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.moduleType == null || params.moduleType == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        ModuleConfig.importExcel(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            if(data[0] != null || data[0].ModuleConfigDetailList != null){
                ModuleConfigDetailList = data[0].ModuleConfigDetailList;
                importCount = data[0].importCount;
            }
            result.ModuleConfigDetailList = ModuleConfigDetailList;
            result.importCount = importCount;
            logger.info("importExcel result:" + JSON.stringify(result));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导入商品或品牌异常:" + ex);
        result.code = 500;
        result.desc = "导入商品或品牌异常";
        response.json(result);
    }
});

/*统一发布模块*/
router.post('/relase', function (request, response, next) {
    logger.info("发布图片");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("relase params:" + JSON.stringify(params));
        if (params.ModuleConfigDetailList == null || params.ModuleConfigDetailList == "" ) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        ModuleConfig.relase(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("统一发布模块错误:" + ex);
        result.code = 500;
        result.desc = "统一发布模块错误";
        response.json(result);
    }
});

/* 查看单个商品或者品牌imgkey */
router.post('/queryImgkey', function (request, response, next) {
    logger.info("查看单个商品或者品牌imgkey");
    var result = {code: 200};
    var ModuleConfigDetailList = [];
    try {
        var params = request.body;
        //参数校验
        logger.info("queryImgkey params:" + JSON.stringify(params));
        if (params.relaId == null || params.relaId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.moduleType == null || params.moduleType == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        ModuleConfig.queryImgkey(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.imgKey = data[0].imgKey;
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("查看单个商品或者品牌imgkey错误:" + ex);
        result.code = 500;
        result.desc = "查看单个商品或者品牌imgkey错误";
        response.json(result);
    }
});


module.exports = router;