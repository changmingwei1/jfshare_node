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
        logger.info("请求参数错误:" + JSON.stringify(arg));
        //参数验证
        if(arg == null || arg.username == null){
            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }

        User.login(arg, function (err, data) {
            if(err){

                //respone.json(err);

                result.userId = 5;
                respone.json(result);
                return;
            }else{
                respone.json(result);
            }
        });
    } catch (ex) {
        logger.error("login error:" + ex);
        result.code = 500;
        result.desc = "请求参数错误";

        respone.json(result);
    }
});




module.exports = router;
