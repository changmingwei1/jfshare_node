/**
 * Created by huapengpeng on 2016/4/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var User = require('../lib/models/user');

//登录
router.post('/login', function(request, respone, next) {
    var result = {code: 200};

    try{
        //var arg = request.query;
        var arg = request.body;

        //参数验证
        if(arg == null || arg.loginName == null ||arg.loginName == ""){
            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }
        if(arg == null || arg.pwdEnc == null ||arg.pwdEnc == ""){
            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }


        User.login(arg, function (err, data) {
            if(err){
                respone.json(err);
                return;
            }else{
                var seller = {
                        sellerId:data[0].seller.sellerId,
                        loginName:data[0].seller.loginName,
                        sellerName:data[0].seller.sellerName
                };

                var loginLog = {tokenId:data[0].loginLog.tokenId};
                result.seller = seller;
                result.logionLog = loginLog;
                logger.info("账号" + JSON.stringify(data));
                respone.json(result);
            }

        });
    } catch (ex) {
        logger.error("login error:" + ex);
        result.code = 500;
        result.desc = "登录异常,请稍后再试";

        respone.json(result);
    }
});

//注销登录
router.post('/loginOut', function(request, response, next) {

    logger.info("进入注销登录接口");
    var result = {code: 200};
    try{
        var params = request.body;
        logger.info("注销登录请求入参，params:" + JSON.stringify(params));

        if (params == null || params.sellerId == null) {
            result.code = 400;
            result.desc = "参数错误1";
            response.json(result);
            return;
        }
        if (params.tokenId== null || params.tokenId == "") {
            result.code = 400;
            result.desc = "参数错误2";
            response.json(result);
            return;
        }
        if (params.ip== null || params.ip == "") {
            result.code = 400;
            result.desc = "参数错误3";
            response.json(result);
            return;
        }
        if (params.browser == null || params.browser == "") {
            result.code = 400;
            result.desc = "参数错误4";
            response.json(result);
            return;
        }
        if (params.fromSource == null || params.fromSource == "") {
            result.code = 400;
            result.desc = "参数错误5";
            response.json(result);
            return;
        }


        User.loginOut(params, function (err, data) {
            if(err){
                return response.json(err);
            }
            logger.info("注销登录，response" + JSON.stringify(data));
            response.json(data);
            return;
        });
    } catch (ex) {
        logger.error("注销登录失败，=========:" + ex);
        result.code = 500;
        result.desc = "注销登录失败";
        response.json(result);
    }
});


module.exports = router;
