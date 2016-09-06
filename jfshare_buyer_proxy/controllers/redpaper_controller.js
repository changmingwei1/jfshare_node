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
var RedPaper = require('../lib/models/redPaper');/*积分红包功能*/
var Buyer = require('../lib/models/buyer');/*主要获取用户信息*/

/*查询单个红包活动的信息*/
router.post('/queryRedPaperActivity', function (request, response, next) {
    logger.info("查询单个积分红包活动的信息");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("queryRedPaperActivity params:" + JSON.stringify(params));

        if (params.encryActivityId == null || params.encryActivityId == "") {// 操作id
            result.code = 500;
            result.desc = "activityId  参数错误";
            response.json(result);
            return;
        }

        RedPaper.queryRedPaperActivity(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var temp=data[0].entity;
            var obj={};
            obj.name=temp.name;
            obj.isH5=temp.isH5;
            obj.brief = temp.brief;
            obj.configure=temp.configure;
            obj.isShowRecord=temp.isShowRecord;
            result.entity=obj;

            logger.info("queryRedPaperActivity result:" + JSON.stringify(data));
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

/*领取接口*/
router.post('/receiveRedbag', function (request, response, next) {
    logger.info("进入领取积分活动的接口");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("receiveRedbag params:" + JSON.stringify(params));

        if (params.encryActivityId == null || params.encryActivityId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.mobile == null || params.mobile == "") {
            result.code = 400;
            result.desc = "手机号不能为空";
            response.json(result);
            return;
        }

        RedPaper.receiveRedbag(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.value = data[0].value;
            logger.info("receiveRedbag result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("领取积分活动:" + ex);
        result.code = 500;
        result.desc = "领取积分活动";
        response.json(result);
    }
});

/*查询领取记录:固定10条信息+用户头像*/
router.post('/getSendRedPaperList', function (request, response, next) {
    logger.info("查询积分红包发放的记录");
    var result = {code: 200};
    result.activityList = [];
    result.userInfoList = [];
    var userIdList = [];
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
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.currentPage == null || params.currentPage == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.encryActivityId == null || params.encryActivityId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        async.series([
                /*查询领取红包活动的记录列表*/
                function(callback){
                    RedPaper.getSendRedPaperList(params, function (err, data) {
                        if (err) {
                            return callback(1, null);
                        }
                        if (data != null && data[0] != null && data[0].activityList != null) {
                            result.activityList = data[0].activityList;
                            var activities = data[0].activityList;
                            activities.forEach(function(a){
                                userIdList.push({
                                    userId:a.userId
                                });
                            });
                            callback(null,userIdList);
                        }
                        if (data != null && data[0] != null && data[0].pagination != null) {
                            result.pagination = data[0].pagination;
                        }
                    });
                },
                /*根据userId,用户的头像*/
                function(callback){
                    Buyer.getListBuyer(userIdList, function(err, data){
                        if(err){
                            return callback(2, null);
                        }
                        if(data != null && data[0] != null && data[0].buyerList != null){
                            var buyerList = data[0].buyerList;
                            for(var i = 0;i < buyerList.length; i++){
                                var buyerInfo = {};
                                buyerInfo.userId = buyerList[i].userId;
                                if(buyerList[i].favImg == null || buyerList[i] == ""){
                                    buyerInfo.favImg = "";
                                }
                                buyerInfo.favImg = buyerList[i].favImg;
                                userInfoList.push(buyerInfo);
                            }
                            return callback(null, userInfoList);
                        }
                    });
                }
            ],
            function (err, results) {
                if (err == 1) {
                    result.code = 500;
                    result.desc = "查询领取列表失败";
                    response.json(result);
                    return;
                } else if (err == 2) {
                    logger.warn("查询买家头像信息是失败");
                    response.json(result);
                    return;
                } else {
                    result.userInfoList = results[2];
                    logger.info("获取到的完整领取信息列表为: " + JSON.stringify(result));
                    response.json(result);
                    return;
                }
            });
    } catch (ex) {
        logger.error("查询积分红包发放的记录list:" + ex);
        result.code = 500;
        result.desc = "查询积分红包发放的记录失败";
        response.json(result);
    }
});

module.exports = router;