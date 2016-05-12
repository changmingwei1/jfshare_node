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



//
router.post('/expresslist', function(request, response, next) {
    logger.info("进入获取物流商列表");
    //var result = {code:200};
    //
    //
    //var express = {id:1,name:"顺丰"};
    //var express1 = {id:2,name:"天天"};
    //var express2 = {id:3,name:"圆通"};
    //var express3 = {id:4,name:"运通"};
    //var express4 = {id:5,name:"如风达"};
    //
    //var expressList = [];
    //expressList.push(express);
    //expressList.push(express1);
    //expressList.push(express2);
    //expressList.push(express3);
    //expressList.push(express4);
    //result.expressList = expressList;
    //response.json(result);
    //
    //return;

    try{

        var params = request.body;

        expresss.queryList(params, function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            response.json(data);
            logger.info("query expressList response:" + JSON.stringify(data));
        });



        logger.info("expresslist params:" + JSON.stringify(params));



    } catch (ex) {
        logger.error("query expressList error:" + ex);
        result.code = 500;
        result.desc = "获取物流商列表";
        response.json(result);
    }
});



module.exports = router;