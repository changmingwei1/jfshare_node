/**
 * Created by huapengpeng on 2016/4/12.
 */
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Seller = require('../lib/models/seller');
var Message = require('../lib/models/message');

//获取个人用户信息
router.get('/get', function(request, response, next) {

    logger.info("进入获取个人用户信息接口...");
    var resContent = {code:200};

    try{
        var param = request.query;
        logger.info("It's test______" + param);
        // 测试使用数据
        param.userId = 1;
        Seller.getSeller(param.userId,function(error, data){

            if(error){
                response.json(error);
            }else{
                //thrift中返回的是SellerResult：Result，Seller，Loginlog，bool(布尔？)，ThirdpartyUser
                var Seller = data[0].Seller;
                //logger.info(Seller);

                var loginLog = data[0].loginLog;
                var value = data[0].value;
                var thirdUser = data[0].thirdUser;

                resContent.Seller = Seller;
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

        Seller.updateSeller(param,function(error, data){

            if(error){
                response.json(error);
            }else{
                response.json(resContent);
                logger.info("get Seller response:" + JSON.stringify(resContent));
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
        Seller.getSellerScore(userId,function(error, data){

            if(error){
                response.json(error);
            }else{
                var score = data[0].score;
                resContent.score = score;
                response.json(resContent);
                logger.info("get Seller's Score response:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "获取用户积分失败";
        response.json(resContent);
    }
});
// 返回当前系统时间
router.get('/curDataTime', function(request, response, next) {

    logger.info("返回当前系统时间");
    var resContent = {code:200};

    try{
        resContent.dateTime=getNowFormatDate();
        response.json(resContent);
        
    }catch(ex){
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "返回当前系统时间";
        response.json(resContent);
    }
});


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

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

        Seller.getSellerScoreList({percount:percount, curpage:curpage,userId:userId,time:time,scoreType:scoreType},function(error, data){
            var dataArr = [];
            if(error){
                response.json(error);
            }else{
                var pagination = data[0].pagination;
                resContent.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};

                var SellerScoreList = data[0].SellerScoreList;
                SellerScoreList.forEach(function(a){
                    dataArr.push({userId: a.userId, scoreType: a.scoreType, score: a.score});
                });
                resContent.SellerScoreList = dataArr;

                response.json(resContent);
                logger.info("get Seller's Score response:" + JSON.stringify(resContent));
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

        Seller.querySlotImageList({type:arg.type},function(error, data){
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

//获取会员信息列表
router.post('/querySellerVipList', function(request, response, next) {

    logger.info("进入获取会员信息列表接口");
    var result = {code:200};

    try{
        var arg = request.body;
        logger.info("获取会员信息列表请求入参，params:" + JSON.stringify(arg));
        if(arg.sellerId==null||arg.sellerId==""){
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (arg.perCount == null || arg.perCount == "" || arg.perCount <= 0) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (arg.curPage == null || arg.curPage == "" || arg.curPage <= 0) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Seller.querySellerVipList(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }else{
               if(data[0].vipTotal==0||data==null){
                   result.vipTotal=0;
                   response.json(result);
                   return;
               }
               var vipTotalParams=data[0].vipTotal;

                result.vipTotal=vipTotalParams;

                var vipListParams=data[0].vipList;
                var pagination = data[0].pagination;
                result.page = {
                    total: pagination.totalCount,
                    pageCount: pagination.pageNumCount
                };

                var vipListObj=[];
                vipListParams.forEach(function (data) {

                    vipListObj.push({
                        favimg:data.favimg,
                        username:data.username,
                        regedate:data.regedate
                    });

                });

                result.vipList=vipListObj;
                response.json(result);
                return

            }

        });
    }catch(ex){
        logger.error("获取会员信息列表失败，============:" + ex);
        result.code = 500;
        result.desc = "获取会员信息列表失败";
        response.json(result);
    }
});

//查询升级信息
router.get('/getAppUpgradeInfo', function (request, response, next) {

    logger.info("进入升级版本接口...");

    var resContent = {code: 200};
    try {
        var param = request.query;
        logger.info("升级版本接口入参，params：" + JSON.stringify(param));
        if (param.appType == null || param.appType == "") {
            resContent.code = 400;
            resContent.desc = "请输入类型";
            response.json(resContent);
            return;
        }
        if (param.version == null || param.version == "") {
            resContent.code = 400;
            resContent.desc = "当前客户端版本号不能为空";
            response.json(resContent);
            return;
        }

        Message.getAppUpgradeInfo(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var upgradeInfo = data[0].upgradeInfo;
            resContent.upgradeInfo = upgradeInfo;
            response.json(resContent);
            logger.info("响应的结果:" + JSON.stringify(resContent));
        });

    } catch (ex) {
        logger.error("获取版本号失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取到版本号";
        response.json(resContent);
    }
});

//商家验码记录列表
router.post('/checkCodeList', function (request, response, next) {
    var result = {code: 200};
    result.checkCodeList={};
    try {
        var params = request.body;
        if (params.curPage == null || params.curPage == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.perCount == null || params.perCount == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.sellerId == null || params.sellerId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Seller.queryCheckCodeList(params, function (err, data) {
            logger.info("SellerServ-checkCodeList response:" + JSON.stringify(data));
            if (err) {
                response.json(err);
                return;
            } else {
                result.checkCodeList = data[0].checkCodeList;
                result.page = data[0].pagination;
                logger.info(" SellerServ-checkCodeList response:" + JSON.stringify(result));
                response.json(result);
            }
        });

    } catch (ex) {
        logger.error("SellerServ-checkCodeList error:" + ex);
        result.code = 500;
        result.desc = "获取商家列表失败";
        response.json(result);
    }
});

//导出商家验码记录列表
router.post('/exportCheckCode', function (request, response, next) {
    var result = {code: 200};
    try {
        var params = request.body;
        if (params.sellerId == null || params.sellerId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Seller.exportCheckCodeList(params, function (err, data) {
            logger.info("SellerServ-exportCheckCode response:" + JSON.stringify(data));
            if (err) {
                response.json(err);
                return;
            } else {
                result.value = data[0].value;
                logger.info(" SellerServ-exprotCheckCodeList response:" + JSON.stringify(result));
                response.json(result);
            }
        });

    } catch (ex) {
        logger.error("SellerServ-exportCheckCode error:" + ex);
        result.code = 500;
        result.desc = "导出失败";
        response.json(result);
    }
});


module.exports = router;