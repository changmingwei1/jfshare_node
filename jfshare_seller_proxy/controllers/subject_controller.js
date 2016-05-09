/**
 * Created by YinBo on 2016/4/12.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var Subject = require("../lib/models/subject");

//查询类目列表
router.post('/query', function (request, response, next) {

    logger.info("进入查询类目列表流程....");
    var result = {code: 200};

    try {
        //var params = request.query;
        var params = request.body;
        //参数校验
        if (params.pid == null || params.pid == "" || params.pid < 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Subject.query(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                result.subjectList = data;
                response.json(result);
                logger.info("get subject list result:" + JSON.stringify(result));
            }
        });


    } catch (ex) {
        logger.error("查询类目列表信息" + "失败，because :" + ex);
        result.code = 500;
        result.desc = "查询类目列表失败";
        result.json(result);
    }
});

//查询类目所属的路径
//此功能是好的，前台现在不直接调用，只是服务间调用，因此隐藏对客户端的调用请求
router.post('/querySubjectPath', function (request, response, next) {

    //logger.info("进入查询类目路径流程....");
    //var result = {code:200};
    //
    //try{
    //    //var params = request.query;
    //    var params = request.body;
    //    //参数校验
    //    if(params.id == null || params.id == "" ||params.id < 0){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    Subject.querySubjectPath(params,function(error,data){
    //        if (error) {
    //            response.json(error);
    //        } else {
    //            result.subjectName = data;
    //            response.json(result);
    //            logger.info("querySubjectPath result:" + JSON.stringify(result));
    //        }
    //    });
    //
    //}catch(ex){
    //    logger.error("querySubjectPath"+"失败，because :" + ex);
    //    result.code = 500;
    //    result.desc = "查询类目路径失败";
    //    result.json(result);
    //}
});


//获取类目属性
router.post('/getAttributesAndSku', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;
        if (params.subjectId == null || params.subjectId == "" || params.subjectId < 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        logger.info("请求， arg:" + JSON.stringify("subjectId:" + JSON.stringify(params)));

        var skuAndAttributesList = [];
        Subject.queryAttributes(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {

                var list = data[0].subjectAttributes;
                list.forEach(function (attribute) {
                    var attributes = {};
                    attributes.id = attribute.id;
                    attributes.value = attribute.value;
                    attributes.isSku = attribute.isSku;
                    skuAndAttributesList.push(attributes)
                });

              result.list = skuAndAttributesList;
                logger.info("queryAttributes  result:" + JSON.stringify(result));
                response.json(result);

            }
        });
    } catch (ex) {
        logger.error("获取 error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        response.json(result);
    }
});


module.exports = router;
