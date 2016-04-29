

/**
 * Created by YinBo on 2016/4/12.
 */
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);
var Subject = require("../lib/models/subject");
//增加类目
router.post('/add', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        var params = {};
        params.name = arg.name || "电饭煲";
        params.pid = arg.pid || "2";
        params.isLeaf = arg.isLeaf || "1";
        params.level = arg.level || "3";

        logger.info("请求， params:" + JSON.stringify(params));

        res.json(result);
        logger.info("add brand response:" + JSON.stringify(result));
    } catch (ex) {
        logger.error("add brand error:" + ex);
        result.code = 500;
        result.desc = "新增品牌失败";
        res.json(result);
    }
});

//查询类目列表
router.get('/query', function(request, response, next) {

    logger.info("进入查询类目列表流程....");
    var result = {code:200};

    try{
        var params = request.query;
        //var params = request.body;
        //参数校验
        if(params.pid == null || params.pid == "" ||params.pid < 0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Subject.query(params.pid,function(error,data){
            if (error) {
                respone.json(error);
            } else {

                respone.json(data);
                logger.info("get subject list result:" + JSON.stringify(resContent));
            }
        });


    }catch(ex){
        logger.error("查询类目列表信息"+"失败，because :" + ex);
        result.code = 500;
        result.desc = "查询类目列表失败";
        result.json(result);
    }
});

//获取类目属性
router.post('/get', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        var subjectId = arg.subjectId || 1;
        logger.info("请求， arg:" + JSON.stringify("subjectId:" + subjectId));

        var attributes = [201,202];
        result.attributes = attributes;
        res.json(result);
        logger.info("获取 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("获取 error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        res.json(result);
    }
});

//品类应用全部属性
router.post('/flush', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        var params = {};
        params.pid = arg.pid || 2;
        params.attributes = arg.attributes || [201,202];
        logger.info("请求， arg:" + JSON.stringify("params:" + params));

        res.json(result);
        logger.info("获取 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("获取 error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        res.json(result);
    }
});

// 修改末节点的属性
router.post('/update', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        var params = {};
        params.subjectId = arg.subjectId || 3005;
        params.attributes = arg.attributes || [201, 202];
        logger.info("请求， arg:" + JSON.stringify("params:" + params));

        res.json(result);
        logger.info("获取 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("获取 error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        res.json(result);
    }
});

module.exports = router;
