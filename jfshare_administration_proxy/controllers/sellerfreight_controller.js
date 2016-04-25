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
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);
var result_types = require('../lib/thrift/gen_code/result_types');
var Freight = require('../lib/models/freight');



//添加商家运费模板
router.post('/add', function(request, response, next) {
    logger.info("进入添加商家运费模板流程");
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

        if(params.templates == null || params.templates == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }



        logger.info("add sellerfreight params:" + JSON.stringify(params));

        response.json(result);
    } catch (ex) {


        // logger.error("添加仓库失败:" + ex);
        // result.code = 500;
        // result.desc = "添加仓库失败";
        /*********************上面是有效代码，服务有的话要打开上面的代码，删除下面的代码*********************/

        response.json(result);
    }
});
//更新运费模板
router.post('/update', function(request, response, next) {
    logger.info("进入更新运费模板流程");
    var result = {code:200};

    try{
       // var params = request.query;
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

        if(params.templates == null || params.templates == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if(params.id == null || params.id == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        logger.info("update freight params:" + JSON.stringify(params));

        response.json(result);
    } catch (ex) {


        // logger.error("更新仓库失败:" + ex);
        // result.code = 500;
        // result.desc = "更新仓库失败";
        /*********************上面是有效代码，服务有的话要打开上面的代码，删除下面的代码*********************/

        response.json(result);
    }
});
//删除运费模板
router.post('/del', function(request, response, next) {
    logger.info("进入删除运费模板流程");
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

        if(params.id == null || params.id == ""||params.sellerId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        logger.info("del freight params:" + JSON.stringify(params));

        response.json(result);
    } catch (ex) {
        // logger.error("删除仓库失败:" + ex);
        // result.code = 500;
        // result.desc = "删除仓库失败";
        /*********************上面是有效代码，服务有的话要打开上面的代码，删除下面的代码*********************/

        response.json(result);
    }
});
//运费模板列表
router.post('/list', function(request, response, next) {
    logger.info("进入查询运费模板列表流程");
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


        logger.info("list freight params:" + JSON.stringify(params));




        var freight = {id:1,name:"运费模板A",type:1};

        var rules = {supportProvince:"460000,210000,220000,620000,330000,440000",//支持的省份 以“,”分割

             /* 类型 1：按件数  2：按件数上不封顶  3：按重量  4：按重量上不封顶*/

            rule:"2件内10元，每增加1件，增加运费5元"//运费规则
        };

        var rules1 = {supportProvince:"460000,210000,220000,620000,330000,440000",//支持的省份 以“,”分割

            /* 类型 1：按件数  2：按件数上不封顶  3：按重量  4：按重量上不封顶*/

            rule:"件内10元，每增加1件，增加运费5元"//运费规则
        };
        var prodfreList = [];
        var templateList = [];
        templateList.push(rules);
        templateList.push(rules1);
        freight.templateList = templateList;
        prodfreList.push(freight);
        var templateList1 = [];
        var freight1 = {id:1,name:"运费模板B",type:4};

        var rules2 = {supportProvince:"460000,210000,220000,620000,330000,440000",//支持的省份 以“,”分割

            /* 类型 1：按件数  2：按件数上不封顶  3：按重量  4：按重量上不封顶*/

            rule:"2kg内10元，每0.5kg，增加运费5元"//运费规则
        };

        rules3 = {supportProvince:"460000,210000,220000,620000,330000,440000",//支持的省份 以“,”分割

            /* 类型 1：按件数  2：按件数上不封顶  3：按重量  4：按重量上不封顶*/

            rule:"件内10元，每增加1件，增加运费5元"//运费规则
        };


        templateList1.push(rules2);
        templateList1.push(rules3);
        freight.templateList = templateList1;
        prodfreList.push(freight1);


        result.prodfreList = prodfreList;
        //Freight.list(params,function(error,storeList){
        //    if (error) {
        //        response.json(error);
        //    } else {
        //        result.storeList = storeList;
        //        logger.info("list freight info response:" + JSON.stringify(result));
        //        response.json(result);
        //    }
        //});
        response.json(result);
    } catch (ex) {
        // logger.error("查询仓库列表失败:" + ex);
        // result.code = 500;
        // result.desc = "查询仓库列表失败";
        /*********************上面是有效代码，服务有的话要打开上面的代码，删除下面的代码*********************/
        result.code = 500;
        logger.error("查询仓库列表失败:" + ex);

        response.json(result);
    }
});



module.exports = router;