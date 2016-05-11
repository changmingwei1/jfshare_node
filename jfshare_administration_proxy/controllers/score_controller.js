
/**
 * Created by huapengpeng on 2016/4/22.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);
var Score = require('../lib/models/score');

router.post('/getTotal', function(request, response, next) {
    logger.info("进入获取积分流程");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;

        if(params.userId ==null ||params.userId =="" || params.userId<=0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        //参数校验
        Score.getScore(params, function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            result.total = data[0].sroce.amount;
            logger.info(" AfterSale.auditPass response:" + JSON.stringify(result));
            response.json(result);

        });

    } catch (ex) {


        logger.error("获取积分错误: " + ex);
        result.code = 500;
        result.desc = "获取积分错误";


        response.json(result);
    }
});


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

        if(params.userId ==null ||params.userId =="" || params.userId<=0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        //参数校验
        Score.getScoreDetail(params, function(err, data) {
            if(err){
                res.json(err);
                return;
            }else {
                var scoreTradeList = data[0].scoreTrades;
                if(scoreTradeList.length<=0){
                    result.code = 500;
                    result.desc = "参数错误";
                    response.json(result);
                    return;
                }
                scoreTradeList.forEach(function(a){
                    dataArr.push({
                        id: a.tradeId,
                       // userId: a.userId,
                        createtime: a.tradeTime,
                        type: a.inOrOut,
                        scoretype: a.type,
                        value: a.amount,
                        remark: a.trader
                    });
                });
                var pagination = data[0].pagination;
                result.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};
                logger.info("get product list response:" + JSON.stringify(result));
                result.scoreList=dataArr;

                response.json(result);

            }
        });
    } catch (ex) {
        logger.error("获取积分详情失败:" + ex);
        result.code = 500;
        result.desc = "获取积分详情失败";
        response.json(result);
    }
});

module.exports = router;