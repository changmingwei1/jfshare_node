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
        logger.info("socrelist params:" + JSON.stringify(params));
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

//导出会员管理积分记录
router.post('/exprotVipScore', function (request, response, next) {
    logger.info("进入导出会员管理积分流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("exprotVipScore params:" + JSON.stringify(params));

        Score.exprotVipScore(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.path = data[0].path;
            logger.info("exprotVipScore result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导出会员管理积分错误:" + ex);
        result.code = 500;
        result.desc = "导出会员管理积分错误";
        response.json(result);
    }
});


//积分增长消费明细统计
router.post('/scoreStatistic', function (request, response, next) {
    logger.info("积分增长消费统计");
    //设置默认值
    var result = {code: 200};
    result.scoreStatisticList = [];
    result.pagination = {
        totalCount: 0,
        pageNumCount: 0,
        numPerPage: 0,
        currentPage: 0
    };
    try {
        var params = request.body;
        if (params.numPerPage == null || params.numPerPage == "") {
            result.code = 500;
            result.desc = "每页条数参数错误";
            response.json(result);
            return;
        }
        if (params.currentPage == null || params.currentPage == "") {
            result.code = 500;
            result.desc = "当前页参数错误";
            response.json(result);
            return;
        }
        if (params.inoroutType == null || params.inoroutType == "") {
            result.code = 500;
            result.desc = "增长/消耗类型参数错误";
            response.json(result);
            return;
        }

        Score.scoreStatistic(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            if (data != null && data[0] != null && data[0].scoreStatisticList != null) {
                result.activityStatisticList = data[0].scoreStatisticList;
                result.sumScore = data[0].sumScore
            }
            if (data != null && data[0] != null && data[0].pagination != null) {
                result.pagination = data[0].pagination;
            }
            logger.info("scoreStatistic result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("积分增长消费统计失败:" + ex);
        result.code = 500;
        result.desc = "积分增长消费统计失败";
        response.json(result);
    }
});


//积分增长消耗明细导出
router.post('/exprotScoreStatistic', function (request, response, next) {
    logger.info("进入导出积分增长消费统计流程");
    var result = {code: 200};
    try {
        var params = request.body;

        if (params.inoroutType == null || params.inoroutType == "") {
            result.code = 500;
            result.desc = "增长/消耗类型参数错误";
            response.json(result);
            return;
        }
        //参数校验
        logger.info("exprotScoreStatistic params:" + JSON.stringify(params));

        Score.exprotScoreStatistic(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.path = data[0].path;
            logger.info("exprotScoreStatistic result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导出积分增长消费统计错误:" + ex);
        result.code = 500;
        result.desc = "导出积分增长消费统计错误";
        response.json(result);
    }
});


//积分累计增长消费统计
router.post('/scoreTotalStatistic', function (request, response, next) {
    logger.info("积分累计增长消费统计");
    //设置默认值
    var result = {code: 200};
    result.scoreTotalStatisticList = [];
    try {
        var params = request.body;

        if (params.startTime == null || params.startTime == "") {
            result.code = 500;
            result.desc = "统计时间不能为空";
            response.json(result);
            return;
        }if (params.endTime == null || params.endTime == "") {
            result.code = 500;
            result.desc = "统计时间不能为空";
            response.json(result);
            return;
        }

        Score.scoreTotalStatistic(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            if (data != null && data[0] != null && data[0].scoreTotalStatisticList != null) {
                result.scoreTotalStatisticList = data[0].scoreTotalStatisticList;
                result.sumScore = data[0].sumScore
            }
            if (data != null && data[0] != null && data[0].pagination != null) {
                result.pagination = data[0].pagination;
            }
            logger.info("scoreTotalStatisticList result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("积分累计增长消费统计失败:" + ex);
        result.code = 500;
        result.desc = "积分累计增长消费统计失败";
        response.json(result);
    }
});


//积分累计增长消费导出
router.post('/exprotTotalScoreStatistic', function (request, response, next) {
    logger.info("进入导出积分累计增长消费统计流程");
    var result = {code: 200};
    try {
        var params = request.body;

        if (params.startTime == null || params.startTime == "") {
            result.code = 500;
            result.desc = "统计时间不能为空";
            response.json(result);
            return;
        }if (params.endTime == null || params.endTime == "") {
            result.code = 500;
            result.desc = "统计时间不能为空";
            response.json(result);
            return;
        }

        //参数校验
        logger.info("exprotTotalScoreStatistic params:" + JSON.stringify(params));

        Score.exprotTotalScoreStatistic(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.path = data[0].path;
            logger.info("exprotTotalScoreStatistic result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导出积分累计增长消费统计错误:" + ex);
        result.code = 500;
        result.desc = "导出积分累计增长消费统计错误";
        response.json(result);
    }
});


//积分存量统计
router.post('/queryScoreStockHistory', function (request, response, next) {
    logger.info("积分存量统计");
    //设置默认值
    var result = {code: 200};
    result.scoreTotalStatisticList = [];
    try {
        var params = request.body;

        if (params.startTime == null || params.startTime == "") {
            result.code = 500;
            result.desc = "统计时间不能为空";
            response.json(result);
            return;
        }if (params.endTime == null || params.endTime == "") {
            result.code = 500;
            result.desc = "统计时间不能为空";
            response.json(result);
            return;
        }

        Score.queryScoreStockHistory(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            if (data != null && data[0] != null && data[0].scoreStockHistoryResultList != null) {
                result.scoreStockHistoryResultList = data[0].scoreStockHistoryResultList;
                result.sumScore = data[0].sumScore
            }
            if (data != null && data[0] != null && data[0].pagination != null) {
                result.pagination = data[0].pagination;
            }
            logger.info("scoreStockHistoryResultList result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("积分存量统计失败:" + ex);
        result.code = 500;
        result.desc = "积分存量统计失败";
        response.json(result);
    }
});


//积分存量统计导出
router.post('/exprotScoreStockHistory', function (request, response, next) {
    logger.info("进入导出积分存量统计流程");
    var result = {code: 200};
    try {
        var params = request.body;

        if (params.startTime == null || params.startTime == "") {
            result.code = 500;
            result.desc = "统计时间不能为空";
            response.json(result);
            return;
        }if (params.endTime == null || params.endTime == "") {
            result.code = 500;
            result.desc = "统计时间不能为空";
            response.json(result);
            return;
        }

        //参数校验
        logger.info("exprotScoreStockHistory params:" + JSON.stringify(params));

        Score.exprotScoreStockHistory(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.path = data[0].path;
            logger.info("exprotScoreStockHistory result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导出积分存量统计错误:" + ex);
        result.code = 500;
        result.desc = "导出积分存量统计错误";
        response.json(result);
    }
});

module.exports = router;