/**
 * Created by huapengpeng on 2016/4/22.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var Score = require('../lib/models/score');

router.post('/socrelist', function (request, response, next) {
    logger.info("进入积分列表流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验

        if(params.percount ==null || params.percount ==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.curpage ==null || params.curpage ==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Score.queryScoreUser(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.scoreList = data[0].scoreUsers;
            var pagination = data[0].pageination;
            if(pagination!=null){
                result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
            }
            logger.info("socrelist result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("获取积分列表错误:" + ex);
        result.code = 500;
        result.desc = "获取积分列表错误";
        response.json(result);
    }
});
//获取积分明细列表---还需要修改
router.post('/scoreinfolist', function (request, response, next) {
    logger.info("进入获取积分明细列表");
    var result = {code: 200};

    try {
        //var params = request.query;
        var params = request.body;

        logger.info("get scoreinfolist params:" + JSON.stringify(params));

        if (params.userId == null || params.userId == "" || params.userId <= 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.curpage == null || params.curPage == "" || params.curPage <= 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.percount == null || params.perCount == "" || params.perCount <= 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        //参数校验
        Score.getScoreDetail(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            } else {
                var scoreTradeList = data[0].scoreTrades;
                var dataArr = [];
                if(scoreTradeList!=null &&scoreTradeList.length>0){
                    scoreTradeList.forEach(function (score) {
                        dataArr.push({
                            id: score.tradeId,
                            createtime: score.tradeTime,
                            type: score.inOrOut,
                            scoretype: score.type,
                            value: score.amount,
                            remark: score.trader
                        });
                    });
                }

                var pagination = data[0].pageination;
                if(pagination!=null){
                    result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
                }
                logger.info("get product list response:" + JSON.stringify(result));
                result.scoreList = dataArr;

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