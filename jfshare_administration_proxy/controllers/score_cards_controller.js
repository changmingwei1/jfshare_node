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
    logger.info("创建活动的流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("createOneActivity params:" + JSON.stringify(params));
        if (params.name == null || params.name == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.startTime == null || params.startTime == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.endTime == null || params.endTime == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.multiRechargeEnable == null || params.multiRechargeEnable == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        if (params.pieceValue == null || params.pieceValue == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.totalCount == null || params.totalCount == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.rechargeType == null || params.rechargeType == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.channel == null || params.channel == "") {
            result.code = 500;
            result.desc = "channel 参数错误";
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


router.post('/exportExcelByqueryCards', function (request, response, next) {
    logger.info("创建导出卡片excel的流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("exportExcelByqueryCards params:" + JSON.stringify(params));
        if (params.activityId == null || params.activityId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.psd == null || params.psd == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        ScoreCards.exportExcelByqueryCards(params, function (err, data) {
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
            result.path = data[0].path;
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导出积分卡活动错误:" + ex);
        result.code = 500;
        result.desc = "导出积分卡活动错误";
        response.json(result);
    }
});

router.post('/validataPsd', function (request, response, next) {
    logger.info("进入校验密码流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("validataPsd params:" + JSON.stringify(params));
        if (params.password == null || params.password == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        ScoreCards.validataPsd(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("validataPsd result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("定向充值密码校验异常:" + ex);
        result.code = 500;
        result.desc = "密码校验错误";
        response.json(result);
    }
});

router.post('/directionRecharge', function (request, response, next) {
    logger.info("进入定向充值流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("directionRecharge params:" + JSON.stringify(params));
        if (params.filePath == null || params.filePath == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.password == null || params.password == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.activityId == null || params.activityId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        ScoreCards.directionRecharge(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.sucessNum=data[0].sucessNum;
            result.failedNum=data[0].failedNum;

            logger.info("directionRecharge result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("定向充值异常:" + ex);
        result.code = 500;
        result.desc = "定向充值错误";
        response.json(result);
    }
});


router.post('/getActivityList', function (request, response, next) {
    logger.info("获取批次列表");
    //设置默认值
    var result = {code: 200};
    result.activityList = [];
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
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.currentPage == null || params.currentPage == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        ScoreCards.getActivityList(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            if (data != null && data[0] != null && data[0].activityList != null) {
                result.activityList = data[0].activityList;
            }
            if (data != null && data[0] != null && data[0].pagination != null) {
                result.pagination = data[0].pagination;
            }
            logger.info("getActivityList result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("获取批次列表失败:" + ex);
        result.code = 500;
        result.desc = "获取批次列表失败";
        response.json(result);
    }
});


router.post('/invalidOneActivity', function (request, response, next) {
    logger.info("作废批次活动流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("invalidOneActivity params:" + JSON.stringify(params));
        if (params.activityId == null || params.activityId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.psd == null || params.psd == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        ScoreCards.invalidOneActivity(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("createOneActivity result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("作废积分卡活动错误:" + ex);
        result.code = 500;
        result.desc = "作废积分卡活动错误";
        response.json(result);
    }
});



router.post('/getActivityCardsList', function (request, response, next) {
    logger.info("获取批次下的cards列表");
    //设置默认值
    var result = {code: 200};
    result.cardList = [];
    result.pagination = {
        totalCount: 0,
        pageNumCount: 0,
        numPerPage: 0,
        currentPage: 0
    };
    try {
        var params = request.body;

        if (params.activityId == null || params.activityId == "" ||params.activityId<=0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.numPerPage == null || params.numPerPage == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.currentPage == null || params.currentPage == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        ScoreCards.getActivityCardsList(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            if (data != null && data[0] != null && data[0].cardList != null) {
                result.cardList = data[0].cardList;
            }
            if (data != null && data[0] != null && data[0].pagination != null) {
                result.pagination = data[0].pagination;
            }
            logger.info("getActivityCardsList result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("获取批次下的卡密列表失败:" + ex);
        result.code = 500;
        result.desc = "获取批次下的卡密列表失败";
        response.json(result);
    }
});

//积分卡统计
router.post('/activityStatistic', function (request, response, next) {
    logger.info("积分卡统计列表");
    //设置默认值
    var result = {code: 200};
    result.activityStatisticList = [];
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

        ScoreCards.activityStatistic(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            if (data != null && data[0] != null && data[0].activityStatisticList != null) {
                result.activityStatisticList = data[0].activityStatisticList;
                result.sumScore = data[0].sumScore
            }
            if (data != null && data[0] != null && data[0].pagination != null) {
                result.pagination = data[0].pagination;
            }
            logger.info("activityStatistic result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("积分卡统计列表失败:" + ex);
        result.code = 500;
        result.desc = "积分卡统计列表失败";
        response.json(result);
    }
});


//积分卡统计导出记录
router.post('/exprotActivityStatistic', function (request, response, next) {
    logger.info("进入导出积分卡统计记录流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("exprotActivityStatistic params:" + JSON.stringify(params));

        ScoreCards.exprotActivityStatistic(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.path = data[0].path;
            logger.info("exprotActivityStatistic result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导出积分卡统计记录错误:" + ex);
        result.code = 500;
        result.desc = "导出积分卡统计记录错误";
        response.json(result);
    }
});

/*创建抵扣券*/
router.post('/createDiscountActiv', function (req, res, next) {
    var resContent = {code: "0"};
    try {
        var arg = req.body;
        logger.info("创建抵扣券请求参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.source == null||arg.source == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.name == null||arg.name == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.value == null||arg.value == "") {
            resContent.code = "1000";
            resContent.msg = "活动名不能为空";
            res.json(resContent);
            return;
        }
        if (arg.couponNum == null||arg.couponNum == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.startTime == null||arg.startTime == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.endTime == null||arg.endTime == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.scope == null||arg.scope == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.scopeList == null||arg.scopeList == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        ScoreCards.createDiscountActiv(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {
                if(data[0].code==0){
                    resContent.code = data[0].code+"";
                    resContent.msg = "创建活动成功"
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.msg = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("创建活动失败 because :" + ex);
        resContent.code = "1014";
        resContent.msg = "创建活动失败";
        res.json(resContent);
    }
});
module.exports = router;