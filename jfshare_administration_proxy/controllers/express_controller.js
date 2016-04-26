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





router.post('/add', function(request, response, next) {
    logger.info("");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验

        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.orderId == null || params.orderId == ""){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.expressorderid == null || params.expressorderid == ""){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.expressId == null || params.expressId == ""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if(params.expressname == null || params.expressname == "" ){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        logger.info("add expressOrder params:" + JSON.stringify(params));
        response.json(result);

    } catch (ex) {


         logger.error("添加失败:" + ex);
         result.code = 500;
         result.desc = "添加失败";


        response.json(result);
    }
});
//获取物流单
router.post('/get', function(request, response, next) {
    logger.info("进入获取物流单流程");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;


        if(params.sellerId == null || params.sellerId == ""){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.orderId == null || params.orderId == ""){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        logger.info("get expressOrder params:" + JSON.stringify(params));

        /*
        *
        * 	expressorderid:string//物流单id
         expressId:string//物流公司id
         expressname:string//物流公司名字
         remark:string //备注

         *
        *
        *
        * */
        result.expressorderid = "100034";
        result.expressId = "1";
        result.express = "顺丰";
        result.remark= "";
        response.json(result);
    } catch (ex) {


        response.json(result);
    }
});
//
router.post('/update', function(request, response, next) {
    logger.info("进入更新物流单流程");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验

        //参数校验

        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.orderId == null || params.orderId == ""){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.expressorderid == null || params.expressorderid == ""){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.expressId == null || params.expressId == ""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if(params.expressname == null || params.expressname == "" ){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        response.json(result);



    } catch (ex) {


        response.json(result);
    }
});
//
router.post('/expresslist', function(request, response, next) {
    logger.info("进入获取物流商列表");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验

        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "";
            response.json(result);
            return;
        }


        logger.info("expresslist params:" + JSON.stringify(params));

        var express = {id:1,name:"顺丰"};
        var express1 = {id:2,name:"天天"};
        var express2 = {id:3,name:"圆通"};
        var express3 = {id:4,name:"运通"};
        var express4 = {id:5,name:"如风达"};

        var expressList = [];
        expressList.push(express);
        expressList.push(express1);
        expressList.push(express2);
        expressList.push(express3);
        expressList.push(express4);
        result.expressList = expressList;
        response.json(result);

    } catch (ex) {
        response.json(result);
    }
});

//导入物流单
router.post('/importList', function(request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;


        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if(params.bytes == null || params.bytes == ""){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }



        response.json(result);

    } catch (ex) {


        response.json(result);
    }
});

module.exports = router;