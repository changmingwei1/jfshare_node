/**
 * Created by huapengpeng on 2016/4/12.
 */
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Captcha = require('../lib/models/captcha');

router.get('/get', function(request, respone, next) {
    logger.info("进入获取图形验证码流程");
    var resContent = {code:200};

    try{
        var params = request.query;
        //ID是负数要进行处理
        logger.info("get captcha id:" + JSON.stringify(params));

        var id = params.id;

        Captcha.getCaptcha(id,function(error,data){
            if (error) {
                respone.json(error);
            } else {

                var captcha = JSON.stringify(data[0].captcha.captchaBytes);

                //logger.info(captcha);

               //var captchaBytes = data[1].captcha.captchaBytes.data;

                resContent.captchaBytes =  data[0].captcha.captchaBytes;
                respone.json(resContent);
                logger.info("get product info response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("获取图形验证码失败:" + ex);
        resContent.code = 500;
        resContent.desc = "获取图形验证码失败";
        respone.json(resContent);
    }
});

module.exports = router;