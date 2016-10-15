
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var ModuleConfig = require('../lib/models/moduleConfig');// 广告位功能模块

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
        if (params.curPage == null || params.curPage == "") {
            result.code = 400;
            result.desc = "分页信息为空";
            response.json(result);
            return;
        }
        if (params.perCount == null || params.perCount == "") {
            result.code = 400;
            result.desc = "分页信息为空";
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
            var pagination = data[0].pagination;
            result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
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

module.exports = router;