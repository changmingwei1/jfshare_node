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
var expresss = require('../lib/models/express');




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

    return;

    //try{
    //
    //    var params = request.body;
    //
    //    expresss.queryList(params, function(err, data) {
    //        if(err){
    //            res.json(err);
    //            return;
    //        }
    //        response.json(data);
    //        logger.info("query expressList response:" + JSON.stringify(data));
    //    });
    //
    //
    //
    //    logger.info("expresslist params:" + JSON.stringify(params));
    //
    //
    //
    //} catch (ex) {
    //    logger.error("query expressList error:" + ex);
    //    result.code = 500;
    //    result.desc = "获取物流商列表";
    //    response.json(result);
    //}
});

//获取物流信息
router.post('/query', function(request, response, next) {
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
        if(params.orderId == null || params.orderId == ""){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        var expressInfo = [{"time":"2016-02-22 13:37:26","ftime":"2016-02-22 13:37:26","context":"快件已签收,签收人是草签，签收网点是北京市朝阳安华桥"},{"time":"2016-02-22 07:51:50","ftime":"2016-02-22 07:51:50","context":"北京市朝阳安华桥的牛鹏超18518350628正在派件"},{"time":"2016-02-22 07:02:10","ftime":"2016-02-22 07:02:10","context":"快件到达北京市朝阳安华桥，上一站是北京集散，扫描员是张彪18519292322"},{"time":"2016-02-22 01:40:35","ftime":"2016-02-22 01:40:35","context":"快件由北京集散发往北京市朝阳安华桥"},{"time":"2016-02-20 22:42:14","ftime":"2016-02-20 22:42:14","context":"快件由温州分拨中心发往北京集散"},{"time":"2016-02-20 19:56:29","ftime":"2016-02-20 19:56:29","context":"快件由苍南(0577-59905999)发往温州分拨中心"},{"time":"2016-02-20 19:50:09","ftime":"2016-02-20 19:50:09","context":"快件由苍南(0577-59905999)发往北京(010-53703166转8039或8010)"},{"time":"2016-02-20 19:50:08","ftime":"2016-02-20 19:50:08","context":"苍南(0577-59905999)已进行装袋扫描"},{"time":"2016-02-20 19:46:22","ftime":"2016-02-20 19:46:22","context":"苍南(0577-59905999)的龙港公司已收件，扫描员是龙港公司"}];

        result.id = 100001;
        result.name = "顺丰";
        result.traceJson = expressInfo;
        result.remark = "";

        logger.info("query expressOrder params:" + JSON.stringify(params));

        response.json(result);


        //
        //expresss.query(params, function(err, data) {
        //    if(err){
        //        res.json(err);
        //        return;
        //    }
        //    logger.info("query expressList response:" + JSON.stringify(data));
        //    response.json(data);
        //
        //});

    } catch (ex) {
        logger.error("get expressInfomation error:" + ex);
        result.code = 500;
        result.desc = "获取物流信息失败";
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