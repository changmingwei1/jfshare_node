/**
 * Created by huapengpeng on 2016/4/12.
 */
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Buyer = require('../lib/models/buyer');

//获取个人用户信息
router.get('/get', function(request, response, next) {

    logger.info("进入获取个人用户信息接口...");
    var resContent = {code:200};

    try{
        var param = request.query;
        logger.info("It's test______" + param);
        // 测试使用数据
        param.userId = 1;
        Buyer.getBuyer(param.userId,function(error, data){

            if(error){
                response.json(error);
            }else{
                //thrift中返回的是BuyerResult：Result，Buyer，Loginlog，bool(布尔？)，ThirdpartyUser
                var buyer = data[0].buyer;
                //logger.info(buyer);

                var loginLog = data[0].loginLog;
                var value = data[0].value;
                var thirdUser = data[0].thirdUser;

                resContent.buyer = buyer;
                resContent.loginLog = loginLog;
                resContent.value = value;
                resContent.thirdUser = thirdUser;
                response.json(resContent);
                logger.info("个人用户信息响应:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("获取用户信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取用户信息";
        response.json(resContent);
    }
});

//更新用户信息(包含修改用户手机号)
router.post('/update', function(request, response, next) {

    logger.info("进入更新用户信息接口");
    var resContent = {code:200};

    try{
        var param = request.body;
        logger.info("It's test_____" + param);

        Buyer.updateBuyer(param,function(error, data){

            if(error){
                response.json(error);
            }else{
                response.json(resContent);
                logger.info("get buyer response:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("不能更新，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "更新个人信息失败";
        response.json(resContent);
    }
});

//获取用户积分
router.get('/queryScore', function(request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code:200};

    try{
        var userId = 1;
        Buyer.getBuyerScore(userId,function(error, data){

            if(error){
                response.json(error);
            }else{
                var score = data[0].score;
                resContent.score = score;
                response.json(resContent);
                logger.info("get buyer's Score response:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "获取用户积分失败";
        response.json(resContent);
    }
});

//获取积分列表
router.get('/queryScoreList', function(request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code:200};
    
    try{
        var arg = request.query;
        var percount = arg.percount || 20;
        var curpage = arg.curpage || 1;
        var userId = arg.userId;
        var scoreType = arg.scoreType;
        var time = arg.time;

        Buyer.getBuyerScoreList({percount:percount, curpage:curpage,userId:userId,time:time,scoreType:scoreType},function(error, data){
            var dataArr = [];
            if(error){
                response.json(error);
            }else{
                var pagination = data[0].pagination;
                resContent.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};

                var buyerScoreList = data[0].buyerScoreList;
                buyerScoreList.forEach(function(a){
                    dataArr.push({userId: a.userId, scoreType: a.scoreType, score: a.score});
                });
                resContent.buyerScoreList = dataArr;

                response.json(resContent);
                logger.info("get buyer's Score response:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "获取用户积分失败";
        response.json(resContent);
    }
});

//首页获取轮播图
router.get('/querySlotImageList', function(request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code:200};

    try{
        var arg = request.query;

        Buyer.querySlotImageList({type:arg.type},function(error, data){
            var dataArr = [];
            if(error){
                response.json(error);
            }else{
                var slotImageList = data[0].slotImageList;
                slotImageList.forEach(function(a){
                    dataArr.push({
                        id: a.id,
                        imgKey: a.imgKey,
                        width: a.width,
                        height: a.height,
                        jump: a.jump,
                        type: a.type,
                        lastUpdateTime: a.lastUpdateTime,
                        createTime: a.createTime,
                        isDelete: a.isDelete
                    });
                });
                resContent.slotImageList = dataArr;

                response.json(resContent);
                logger.info("get  response:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "获取轮播图失败";
        response.json(resContent);
    }
});

module.exports = router;