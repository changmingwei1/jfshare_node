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
router.get('/login', function(request, respone, next) {
    var result = {code: 200};

    try{
        var arg = request.query;
        //var arg = request.body;

        //参数验证
        if(arg == null || arg.username == null ||arg.username == ""){
            result.code = 500;
            result.desc = "请求参数错误";
            respone.json(result);
            return;
        }
        if(arg == null || arg.password == null ||arg.password == ""){
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




module.exports = router;
