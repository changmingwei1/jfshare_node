/**
 *  积分卡  管理 
 *  chiwenheng
 *  0815
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var ScoreCards = require('../lib/models/score_cards');// 积分卡功能

router.post('/createOneActivity', function (request, response, next) {
    logger.info("创建也给活动的流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("createOneActivity params:" + JSON.stringify(params));
        if(params.name ==null || params.name ==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.startTime ==null || params.startTime ==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.endTime ==null || params.endTime ==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.multiRechargeEnable ==null || params.multiRechargeEnable ==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        if(params.pieceValue ==null || params.pieceValue ==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.totalCount ==null || params.totalCount ==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if(params.rechargeType ==null || params.rechargeType ==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        ScoreCards.createOneActivity(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            // result.scoreList = data[0].scoreUsers;
            // var pagination = data[0].pageination;
            // if(pagination!=null){
            //     result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
            // }
            logger.info("createOneActivity result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("创建积分卡活动错误:" + ex);
        result.code = 500;
        result.desc = "创建积分卡活动错误";
        response.json(result);
    }
});


module.exports = router;