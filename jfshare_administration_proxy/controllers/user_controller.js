/**
 * Created by huapengpeng on 2016/4/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Manager = require('../lib/models/manager');


//查询所有用户权限url
router.post('/queryAllCommissioner', function (request, response, next) {

    var result = {code: 200};
    try {
        var params = request.body;


        logger.error("add subject 请求， params:" + JSON.stringify(params));
        Manager.queryAllCommissioner(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                result.id = data[0].subjectInfo.id;
                response.json(result);
                logger.error("queryAllCommissioner subject  result:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("queryAllCommissioner subject error:" + ex);
        result.code = 500;
        result.desc = "查询用户失败";
        response.json(result);
    }
});


//获取管理员用户信息
router.post('/get', function(request, response, next) {


    var result = {code: 200};
    var params = request.body;
    try{
        //参数校验
        if(params.id =="" || params.id==null || params.id<=0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Manager.get(params, function(error,data){
            if(error){
                respnose.json(error);
                return;
            }

            if(data[0].jf_manager[0]!=null ||data[0].jf_manager[0]!=""){
                result.message = data[0].jf_manager[0];
            }
            response.json(result);
            logger.info("get  response:" + JSON.stringify(data));
        });

    } catch (ex) {
        logger.error("获取用户信息 error:" + ex);
        result.code = 500;
        result.desc = "获取用户信息";
        response.json(result);
    }
});




//登录
router.post('/login', function(request, response, next) {
    var result = {code: 200};

    try{
        //var arg = request.query;
        var params = request.body;

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
        logger.info("登录请求参数:" + JSON.stringify(params));
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
            if(data[0].result.code ==1){
                result.code = 500;
                result.desc = data[0].result.failDescList[0].desc;
            }
            logger.info("user.longin response:" + JSON.stringify(result));
            response.json(result);
            return
        });


    } catch (ex) {
        logger.error("login error:" + ex);
        result.code = 500;
        result.desc = "登录异常";
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
        result.desc = "注销异常";
        response.json(result);

    }
});


module.exports = router;
