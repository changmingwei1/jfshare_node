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

//启用禁用用户
router.post('/isDisableUser', function(request, response, next) {

    logger.info("进入启用禁用用户接口");
    var resContent = {code:200};

    try{
        var param = request.body;
        logger.info("It's test_____" + param);

        Buyer.isDisableUser(param,function(error, data){

            if(error){
                response.json(error);
            }else{
                response.json(resContent);
                logger.info("get buyer response:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("不能启/禁用用户，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "启/禁用用户失败";
        response.json(resContent);
    }
});

/*依据查询条件搜索小花用户列表*/
router.post('/searchFloretUserList', function (request, response, next) {
    logger.info("搜索小花用户列表");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if(param.numPerPage == null || param.currentPage==null){
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        logger.info("请求参数：" + JSON.stringify(param));
        Buyer.searchCriteriaForXiaoHuaUser(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                resContent.adminFloretUserPara = data[0].adminFloretUserPara;
                resContent.pagination = data[0].pagination;
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("搜索小花用户列表失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "搜索小花用户列表失败";
        response.json(resContent);
    }
});

/*导出小花表单*/
router.post('/exportFloretUserTable', function (request, response, next) {
    logger.info("导出小花表单");
    var resContent = {code: 200};
    try {
        var param = request.body;
   /*
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }*/

        logger.info("请求参数：" + JSON.stringify(param));
        Buyer.exportFloretUserTable(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                if(data[0].code==101){
                    resContent.code = data[0];
                    resContent.desc = '没有查询到数据';
                }else{
                    resContent.exurl = data[0].value;
                    response.json(resContent);
                }
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("导出小花表单，because :" + ex);
        resContent.code = 500;
        resContent.desc = "导出小花表单表失败";
        response.json(resContent);
    }
});

/*导入物流*/
router.post('/importLogisticsCompanies', function (request, response, next) {
    logger.info("导入物流");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }

        if (param.serialNumber == null || param.serialNumber == "") {
            resContent.code = 400;
            resContent.desc = "流水号不能为空";
            response.json(resContent);
            return;
        }

        if (param.logisticsCompaniesName == null || param.logisticsCompaniesName == "") {
            resContent.code = 400;
            resContent.desc = "物流公司不能为空";
            response.json(resContent);
            return;
        }
        if (param.logisticsNumber == null || param.logisticsNumber == "") {
            resContent.code = 400;
            resContent.desc = "物流单号不能为空";
            response.json(resContent);
            return;
        }
        if (param.sztCard == null || param.sztCard == "") {
            resContent.code = 400;
            resContent.desc = "深圳通卡不能为空";
            response.json(resContent);
            return;
        }

        if (param.cstate == null) {
            resContent.code = 400;
            resContent.desc = "状态不能为空";
            response.json(resContent);
            return;
        }

        logger.info("请求参数：" + JSON.stringify(param));
        Buyer.importLogisticsCompanies(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                resContent.data = data[0];
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("导入物流，because :" + ex);
        resContent.code = 500;
        resContent.desc = "导入物流失败";
        response.json(resContent);
    }
});

/*excel导入物流*/
router.post('/importExpressInfoToDB', function (request, response, next) {
    logger.info("excel导入物流");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }

        if (param.exurl == null || param.exurl == "") {
            resContent.code = 400;
            resContent.desc = "excel文件路径不能为空";
            response.json(resContent);
            return;
        }

        logger.info("请求参数：" + JSON.stringify(param));
        Buyer.importExpressInfoToDB(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {

                if(data[0].code==101){
                    logger.error("excel文件不存在");
                    resContent.code = 101;
                    resContent.desc = "excel文件不存在";
                    response.json(resContent);
                }else if(data[0].code==102){
                    logger.error("excel文件没要导入的内容");
                    resContent.code = 102;
                    resContent.desc = "excel文件没要导入的内容";
                    response.json(resContent);
                }else {
                    resContent.num = data[0].code-200;
                    response.json(resContent);
                    logger.info("响应的结果:" + JSON.stringify(resContent));
                }
            }
        });
    } catch (ex) {
        logger.error("excel导入物流，because :" + ex);
        resContent.code = 500;
        resContent.desc = "excel导入物流失败";
        response.json(resContent);
    }
});

/* 管理后台查询物流*/
router.post('/searchAdminExpressInfo', function (request, response, next) {
    logger.info("管理后台查询物流");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }

        if (param.serialNumber == null || param.serialNumber == "") {
            resContent.code = 400;
            resContent.desc = "流水号不能为空";
            response.json(resContent);
            return;
        }

        logger.info("请求参数：" + JSON.stringify(param));
        Buyer.searchAdminExpressInfo(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                resContent.data = data[0];
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("e管理后台查询物流，because :" + ex);
        resContent.code = 500;
        resContent.desc = "管理后台查询物流失败";
        response.json(resContent);
    }
});
module.exports = router;