/**
 * Created by huapengpeng on 2016/4/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Manager = require('../lib/models/manager');

//注册
router.post('/regist', function(request, respone, next) {
    var result = {code: 200};

    try{
        //var arg = request.query;
        var arg = request.body;
        logger.info("请求参数错误:" + JSON.stringify(arg));
        //参数验证
        if(arg == null || arg.username == null){
            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }
        if(arg == null || arg.pwdEnc == null ||arg.pwdEnc ==""){
            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }
        result.userId=5;
        respone.json(result);

    } catch (ex) {
        logger.error("login error:" + ex);
        result.code = 500;
        result.desc = "请求参数错误";
        respone.json(result);

    }
});




//登录
router.post('/login', function(request, response, next) {
    var result = {code: 200};

    try{
        //var arg = request.query;
        var params = request.body;
        logger.info("请求参数错误:" + JSON.stringify(params));
        //参数验证
        if(params == null || params.loginName == null){
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if(params == null || params.pwdEnc == null ||params.pwdEnc ==""){
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        Manager.signin(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("user.longin response:" + JSON.stringify(data));
            var cs = {};
            var loginLog = {};
            if(data[0].result.code ==0){
                cs.csId = data[0].cs.csId;
                cs.csName = data[0].cs.csName;
                loginLog.tokenId = data[0].loginLog.tokenId

                result.cs = cs;
                result.loginLog = loginLog;
            }
            response.json(result);
            return
        });


    } catch (ex) {
        logger.error("login error:" + ex);
        result.code = 500;
        result.desc = "请求参数错误";
        response.json(result);

    }
});


//注销登录
router.post('/loginOut', function(request, response, next) {
    var result = {code: 200};

    try{
        //var arg = request.query;
        var params = request.body;
        logger.info("请求参数错误:" + JSON.stringify(params));
        //参数验证
        if(params == null || params.csId == null){
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if(params == null || params.tokenId == null ||params.tokenId ==""){
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        Manager.signout(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("user.longin response:" + JSON.stringify(data));


            response.json(data);
            return
        });


    } catch (ex) {
        logger.error("login error:" + ex);
        result.code = 500;
        result.desc = "请求参数错误";
        response.json(result);

    }
});


module.exports = router;
