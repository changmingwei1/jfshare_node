/**
 *  积分红包  管理
 *  chiwenheng
 *  0901
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var RedPaper = require('../lib/models/redPaper');// 积分红包功能

router.post('/createRedPaperActivity', function (request, response, next) {
    logger.info("创建积分红包的流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("createRedPaperActivity params:" + JSON.stringify(params));

        if (params.userId == null || params.userId == "") {// 操作id
            result.code = 500;
            result.desc = "userId  参数错误";
            response.json(result);
            return;
        }
        if (params.name == null || params.name == "") {
            result.code = 500;
            result.desc = "name参数错误";
            response.json(result);
            return;
        }

        if (params.maxScore == null || params.maxScore <=0) {
            result.code = 500;
            result.desc = "maxScore参数错误";
            response.json(result);
            return;
        }

        if (params.startTime == null || params.startTime == "") {
            result.code = 500;
            result.desc = "startTime参数错误";
            response.json(result);
            return;
        }
        if (params.endTime == null || params.endTime == "") {
            result.code = 500;
            result.desc = "endTime参数错误";
            response.json(result);
            return;
        }

        if (params.isShowRule == null || params.isShowRule < 0) {
            result.code = 500;
            result.desc = "isShowRule参数错误";
            response.json(result);
            return;
        }


        if (params.isShowRecord == null || params.isShowRecord == "") {
            result.code = 500;
            result.desc = "isShowRecord参数错误";
            response.json(result);
            return;
        }

        if (params.isH5 == null) {
            result.code = 500;
            result.desc = "isH5 参数错误";
            response.json(result);
            return;
        }
        
        if (params.brief == null || params.brief == "") {
            result.code = 500;
            result.desc = "brief参数错误";
            response.json(result);
            return;
        }
        if (params.singleGetType == null || params.singleGetType == "") {
            result.code = 500;
            result.desc = "singleGetType参数错误";
            response.json(result);
            return;
        }
        if (params.singleGetValue == null || params.singleGetValue == "") {
            result.code = 500;
            result.desc = "singleGetValue 参数错误";
            response.json(result);
            return;
        }
        if (params.perLimitTime == null || params.perLimitTime == "") {
            result.code = 500;
            result.desc = "perLimitTime参数错误";
            response.json(result);
            return;
        }
        if (params.perDayTime == null || params.perDayTime == "") {
            result.code = 500;
            result.desc = "perDayTime参数错误";
            response.json(result);
            return;
        }
        if (params.partTakeType == null || params.partTakeType == "") {
            result.code = 500;
            result.desc = "partTakeType 参数错误";
            response.json(result);
            return;
        }

        RedPaper.createRedPaperActivity(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            // result.scoreList = data[0].scoreUsers;
            // var pagination = data[0].pageination;
            // if(pagination!=null){
            //     result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
            // }
            logger.info("createRedPaperActivity result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("创建积分红包活动错误:" + ex);
        result.code = 500;
        result.desc = "创建积分红包活动错误";
        response.json(result);
    }
});


router.post('/updateRedPaperActivity', function (request, response, next) {
    logger.info("修改积分红包的流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("createRedPaperActivity params:" + JSON.stringify(params));

        if (params.userId == null || params.userId == "") {// 操作id
            result.code = 500;
            result.desc = "userId  参数错误";
            response.json(result);
            return;
        }
        if (params.name == null || params.name == "") {
            result.code = 500;
            result.desc = "name参数错误";
            response.json(result);
            return;
        }
        if (params.activityId == null || params.activityId == "") {
            result.code = 500;
            result.desc = "activityId参数错误";
            response.json(result);
            return;
        }

        if (params.maxScore == null || params.maxScore <=0) {
            result.code = 500;
            result.desc = "maxScore参数错误";
            response.json(result);
            return;
        }

        if (params.startTime == null || params.startTime == "") {
            result.code = 500;
            result.desc = "startTime参数错误";
            response.json(result);
            return;
        }
        if (params.endTime == null || params.endTime == "") {
            result.code = 500;
            result.desc = "endTime参数错误";
            response.json(result);
            return;
        }

        if (params.isShowRule == null || params.isShowRule < 0) {
            result.code = 500;
            result.desc = "isShowRule参数错误";
            response.json(result);
            return;
        }


        if (params.isShowRecord == null || params.isShowRecord == "") {
            result.code = 500;
            result.desc = "isShowRecord参数错误";
            response.json(result);
            return;
        }

        if (params.isH5 == null) {
            result.code = 500;
            result.desc = "isH5 参数错误";
            response.json(result);
            return;
        }
        
        if (params.brief == null || params.brief == "") {
            result.code = 500;
            result.desc = "brief参数错误";
            response.json(result);
            return;
        }
        if (params.singleGetType == null || params.singleGetType == "") {
            result.code = 500;
            result.desc = "singleGetType参数错误";
            response.json(result);
            return;
        }
        if (params.singleGetValue == null || params.singleGetValue == "") {
            result.code = 500;
            result.desc = "singleGetValue 参数错误";
            response.json(result);
            return;
        }
        if (params.perLimitTime == null || params.perLimitTime == "") {
            result.code = 500;
            result.desc = "perLimitTime参数错误";
            response.json(result);
            return;
        }
        if (params.perDayTime == null || params.perDayTime == "") {
            result.code = 500;
            result.desc = "perDayTime参数错误";
            response.json(result);
            return;
        }
        if (params.partTakeType == null || params.partTakeType == "") {
            result.code = 500;
            result.desc = "partTakeType 参数错误";
            response.json(result);
            return;
        }

        RedPaper.updateRedPaperActivity(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            // result.scoreList = data[0].scoreUsers;
            // var pagination = data[0].pageination;
            // if(pagination!=null){
            //     result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
            // }
            logger.info("updateRedPaperActivity result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("修改积分红包活动错误:" + ex);
        result.code = 500;
        result.desc = "修改积分红包活动错误";
        response.json(result);
    }
});


router.post('/exportRedPaperExcel', function (request, response, next) {
    logger.info("导出积分红包excel的流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("exportRedPaperExcel params:" + JSON.stringify(params));

        if (params.activityId == null || params.activityId == "") {// 操作id
            result.code = 500;
            result.desc = "activityId  参数错误";
            response.json(result);
            return;
        }
       /* if (params.userPhone == null || params.userPhone == "") {// userPhone
            result.code = 500;
            result.desc = "userPhone  参数错误";
            response.json(result);
            return;
        }*/
       

        /*if (params.startTime == null || params.startTime == "") {
            result.code = 500;
            result.desc = "startTime参数错误";
            response.json(result);
            return;
        }
        if (params.endTime == null || params.endTime == "") {
            result.code = 500;
            result.desc = "endTime参数错误";
            response.json(result);
            return;
        }*/

        

        RedPaper.exportRedPaperExcel(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            // result.scoreList = data[0].scoreUsers;
            // var pagination = data[0].pageination;
            // if(pagination!=null){
            //     result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
            // }
            logger.info("exportRedPaperExcel result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导出积分红包excel的流程:" + ex);
        result.code = 500;
        result.desc = "导出积分红包excel的流程";
        response.json(result);
    }
});
router.post('/generateH5Url', function (request, response, next) {
    logger.info("生成H5页面链接的流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("generateH5Url params:" + JSON.stringify(params));

        if (params.activityId == null || params.activityId == "") {// 操作id
            result.code = 500;
            result.desc = "activityId  参数错误";
            response.json(result);
            return;
        }

        RedPaper.generateH5Url(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            // result.scoreList = data[0].scoreUsers;
            // var pagination = data[0].pageination;
            // if(pagination!=null){
            //     result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
            // }
            logger.info("generateH5Url result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("生成H5页面链接的流程:" + ex);
        result.code = 500;
        result.desc = "生成H5页面链接的流程";
        response.json(result);
    }
});

router.post('/queryOneRedPaperActivity', function (request, response, next) {
    logger.info("查询单个积分红包活动的信息");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("queryOneRedPaperActivity params:" + JSON.stringify(params));

        if (params.activityId == null || params.activityId == "") {// 操作id
            result.code = 500;
            result.desc = "activityId  参数错误";
            response.json(result);
            return;
        }

        RedPaper.queryOneRedPaperActivity(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var temp=data[0].entity;
            // var obj={};
            // obj.name=temp.name;
            // obj.isH5=temp.isH5;
            // obj.configure=temp.configure;
            // obj.isShowRecord=temp.isShowRecord;

            result.entity=temp;


            logger.info("queryOneRedPaperActivity result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("查询单个积分红包活动的信息:" + ex);
        result.code = 500;
        result.desc = "查询单个积分红包活动的信息";
        response.json(result);
    }
});

router.post('/queryRedPaperActivityList', function (request, response, next) {
    logger.info("查询积分红包活动的list信息");
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
        //参数校验
        logger.info("queryRedPaperActivityList params:" + JSON.stringify(params));

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

        RedPaper.queryRedPaperActivityList(params, function (err, data) {
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
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("查询积分红包活动的list信息:" + ex);
        result.code = 500;
        result.desc = "查询积分红包活动的列表失败";
        response.json(result);
    }
});

router.post('/querySendRedPaperList', function (request, response, next) {
    logger.info("查询积分红包发放的记录");
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
        //参数校验
        logger.info("queryRedPaperActivityList params:" + JSON.stringify(params));

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
        if (params.activityId == null || params.activityId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        RedPaper.querySendRedPaperList(params, function (err, data) {
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
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("查询积分红包发放的记录list:" + ex);
        result.code = 500;
        result.desc = "查询积分红包发放的记录失败";
        response.json(result);
    }
});

router.post('/setRedpaperActivityOver', function (request, response, next) {
    logger.info("结束活动");
    var result = {code: 200};

    try {
        var params = request.body;
        //参数校验
        logger.info("setRedpaperActivityOver params:" + JSON.stringify(params));

        if (params.activityId == null || params.activityId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.userId == null || params.userId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        RedPaper.setRedpaperActivityOver(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("结束活动:" + ex);
        result.code = 500;
        result.desc = "结束活动失败";
        response.json(result);
    }
});


module.exports = router;