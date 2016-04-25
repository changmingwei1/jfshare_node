/**
 * Created by huapengpeng on 2016/4/22.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);
var result_types = require('../lib/thrift/gen_code/result_types');
var Storehouse = require('../lib/models/storehouse');



//添加仓库
router.post('/add', function(request, respone, next) {
    logger.info("进入添加仓库流程");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验

        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }

        if(params.name == null || params.name == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }

        if(params.supportProvince == null || params.supportProvince == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }


        logger.info("add storehouse params:" + JSON.stringify(params));

        Storehouse.add(params,function(error,data){
            if (error) {
                respone.json(error);
            } else {
                result.code =  data[0].result.code;
                respone.json(result);
                logger.info("add storehouse info response:" + JSON.stringify(result));
            }
        });
    } catch (ex) {


       // logger.error("添加仓库失败:" + ex);
       // result.code = 500;
       // result.desc = "添加仓库失败";
        /*********************上面是有效代码，服务有的话要打开上面的代码，删除下面的代码*********************/

        respone.json(result);
    }
});
//更新仓库
router.post('/update', function(request, respone, next) {
    logger.info("进入更新仓库流程");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验

        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }

        if(params.id == null || params.id == "" ||params.id <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }

        if(params.name == null || params.name == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }

        if(params.supportProvince == null || params.supportProvince == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }


        logger.info("update storehouse params:" + JSON.stringify(params));

        Storehouse.update(params,function(error,data){
            if (error) {
                respone.json(error);
            } else {
                result.code =  data[0].result.code;
                respone.json(result);
                logger.info("update storehouse info response:" + JSON.stringify(result));
            }
        });
    } catch (ex) {


        // logger.error("更新仓库失败:" + ex);
        // result.code = 500;
        // result.desc = "更新仓库失败";
        /*********************上面是有效代码，服务有的话要打开上面的代码，删除下面的代码*********************/

        respone.json(result);
    }
});

router.post('/del', function(request, respone, next) {
    logger.info("进入删除仓库流程");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验

        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }

        if(params.id == null || params.id == ""||params.sellerId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }


        logger.info("del storehouse params:" + JSON.stringify(params));

        Storehouse.delete(params,function(error,data){
            if (error) {
                respone.json(error);
            } else {
                result.code =  data[0].result.code;
                respone.json(result);
                logger.info("delete storehouse info response:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        // logger.error("删除仓库失败:" + ex);
        // result.code = 500;
        // result.desc = "删除仓库失败";
        /*********************上面是有效代码，服务有的话要打开上面的代码，删除下面的代码*********************/

        respone.json(result);
    }
});
router.post('/list', function(request, respone, next) {
    logger.info("进入查询仓库流程");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验

        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }


        logger.info("list storehouse params:" + JSON.stringify(params));

        Storehouse.list(params,function(error,storeList){
            if (error) {
                respone.json(error);
            } else {
                result.storeList = storeList;
                logger.info("list storehouse info response:" + JSON.stringify(result));
                respone.json(result);
            }
        });
    } catch (ex) {
        // logger.error("查询仓库列表失败:" + ex);
        // result.code = 500;
        // result.desc = "查询仓库列表失败";
        /*********************上面是有效代码，服务有的话要打开上面的代码，删除下面的代码*********************/

        respone.json(result);
    }
});



module.exports = router;