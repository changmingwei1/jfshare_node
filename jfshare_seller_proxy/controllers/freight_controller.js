/**
 * Created by Administrator on 2016/4/22.
 */
/**
 * Created by huapengpeng on 2016/4/22.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var result_types = require('../lib/thrift/gen_code/result_types');
var Freight = require('../lib/models/freight');


//添加运费模板
router.post('/add', function (request, response, next) {


    logger.info("进入添加运费模板流程");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验

        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if(params.name == null || params.name == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if(params.supportProvince == null || params.supportProvince == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if(params.rule == null || params.rule == ""){
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if(params.type == null || params.type == "" ||params.type <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        logger.info("add freight params:" + JSON.stringify(params));

        Freight.add(params,function(error,data){
            if (error) {
                response.json(error);
            } else {
                result.code =  data[0].result.code;
                response.json(result);
                logger.info("add freight info response:" + JSON.stringify(result));
            }
        });
    } catch (ex) {


         logger.error("添加运费模板失败:" + ex);
         result.code = 500;
         result.desc = "添加运费模板失败";

        response.json(result);
    }
});
//更新运费模板
router.post('/update', function (request, response, next) {
    logger.info("进入更新运费模板流程");
    var result = {code: 200};

    try {
        //var params = request.query;
        var params = request.body;
        //参数校验

        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.id == null || params.id == "" || params.id <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.name == null || params.name == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.supportProvince == null || params.supportProvince == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.rule == null || params.rule == "") {
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.type == null || params.type == "" || params.type <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        logger.info("update freight params:" + JSON.stringify(params));

        Freight.update(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                result.code = data[0].result.code;
                response.json(result);
                logger.info("update freight info response:" + JSON.stringify(result));
            }
        });
    } catch (ex) {


         logger.error("更新仓库失败:" + ex);
         result.code = 500;
         result.desc = "更新仓库失败";

        response.json(result);
    }
});
//删除运费模板
router.post('/del', function (request, response, next) {

    logger.info("进入删除运费模板流程");
    var result = {code: 200};

    try {
        //var params = request.query;
        var params = request.body;
        //参数校验

        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.id == null || params.id == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        logger.info("del freight params:" + JSON.stringify(params));

        Storehouse.delete(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                result.code = data[0].result.code;
                response.json(result);
                logger.info("delete freight info response:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
         logger.error("删除仓库失败:" + ex);
         result.code = 500;
         result.desc = "删除仓库失败";

        response.json(result);
    }
});
//运费模板列表
router.post('/list', function (request, response, next) {
    logger.info("进入查询运费模板流程");
    var result = {code: 200};

    try {
        // var params = request.query;
        var params = request.body;
        //参数校验

        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        logger.info("list freight params:" + JSON.stringify(params));


        Freight.list(params,function(error,storeList){
            if (error) {
                response.json(error);
            } else {
                result.storeList = storeList;
                logger.info("list freight info response:" + JSON.stringify(result));
                response.json(result);
            }
        });
        response.json(result);
    } catch (ex) {
         logger.error("查询仓库列表失败:" + ex);
         result.code = 500;
         result.desc = "查询仓库列表失败";

        response.json(result);
    }
});
//get运费模板
router.post('/get', function (request, response, next) {

    logger.info("进入更新运费模板流程");
    var result = {code: 200};

    try {
        //var params = request.query;
        var params = request.body;
        //参数校验

        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.storeId == null || params.storeId == "" || params.storeId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        logger.info("get freight params:" + JSON.stringify(params));

        Freight.get(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                result.code = data[0].result.code;
                response.json(result);
                logger.info("get freight info response:" + JSON.stringify(result));
            }
        });
    } catch (ex) {


        logger.error("获取运费模板失败:" + ex);
        result.code = 500;
        result.desc = "获取运费模板失败";

        response.json(result);
    }
});


module.exports = router;