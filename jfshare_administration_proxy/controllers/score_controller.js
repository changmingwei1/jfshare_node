
/**
 * Created by huapengpeng on 2016/4/22.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);





router.post('/socrelist', function(request, response, next) {
    logger.info("进入积分列表流程");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验

        var page ={total:100, pageCount: 5};

        var user = {userid:1,mobile:"1381290123",registtime:"2013-03-24",total:200};

        var user1 = {userid:2,mobile:"1321311563",registtime:"2015-04-25",total:100};

        var user2 = {userid:3,mobile:"1321300562",registtime:"2015-03-27",total:1};

        var user3 = {userid:4,mobile:"1321300561",registtime:"2015-03-27",total:30};

        result.page = page;
        var scoreList = [];
        scoreList.push(user);
        scoreList.push(user1);
        scoreList.push(user2);
        scoreList.push(user3);

        result.scoreList = scoreList;
        logger.info("add expressOrder params:" + JSON.stringify(params));
        response.json(result);

    } catch (ex) {


        logger.error("获取积分列表错误:" + ex);
        result.code = 500;
        result.desc = "获取积分列表错误";


        response.json(result);
    }
});
//获取积分明细列表
router.post('/scoreinfolist', function(request, response, next) {
    logger.info("进入获取积分明细列表");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;

        logger.info("get scoreinfolist params:" + JSON.stringify(params));

        var page ={total:100, pageCount: 5};

        result.page = page;

        var scoreInfo={id:1,type:0,scoretype:1,createtime:"2016-08-05",value:"1000",remark:"电信天翼"};

        var scoreInfo1={id:2,type:1,scoretype:4,createtime:"2016-07-05",value:"2000",remark:"聚分享"};

        var scoreInfo2={id:3,type:0,scoretype:2,createtime:"2016-07-05",value:"2000",remark:"线下消费获取"};

        var scoreInfo3={id:4,type:0,scoretype:3,createtime:"2016-07-07",value:"1000",remark:"线下折扣消费"};

        var scoreList = [];

        scoreList.push(scoreInfo);
        scoreList.push(scoreInfo1);
        scoreList.push(scoreInfo2);
        scoreList.push(scoreInfo3);

        result.scoreList= scoreList;

        response.json(result);
    } catch (ex) {


        response.json(result);
    }
});


module.exports = router;