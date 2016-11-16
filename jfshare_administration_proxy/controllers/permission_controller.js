/**
 * Created by tangmingxia on 2016/11/16.
 */

var express = require('express');
var router = express.Router();
var async = require('async');
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var permission = require('../lib/models/permission');// 广告位功能模块
//增加类目
router.post('/queryAllCommissioner', function (request, response, next) {

    var result = {code: 200};
    try {
        var params = request.body;

        //if (params.currentPage == null || params.currentPage == "" ||params.currentPage<0) {
        //    result.code = 500;
        //    result.desc = "参数错误";
        //    response.json(result);
        //    return;
        //}
        //if (params.numPerPage == null || params.numPerPage == "") {
        //    result.code = 500;
        //    result.desc = "参数错误";
        //    response.json(result);
        //    return;
        //}
        logger.error("add subject 请求， params:" + JSON.stringify(params));
        permission.queryAllCommissioner(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                result.id = data[0].subjectInfo.id;
                response.json(result);
                logger.error("queryAllCommissioner subject  result:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("queryAllCommissioner subject error:" + ex);
        result.code = 500;
        result.desc = "查询用户失败";
        response.json(result);
    }
});

module.exports = router;

