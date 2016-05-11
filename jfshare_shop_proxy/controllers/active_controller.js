/**
 * Created by YinBo on 2016/4/12.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var slotImage_types = require('../lib/thrift/gen_code/slotImage_types');
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Active = require('../lib/models/active');
var Message = require('../lib/models/message');

//获取首页轮播图列表
router.get('/imgList', function(request, response, next) {

    logger.info("进入首页轮播图列表接口...");
    var resContent = {code:200};

    try{
        var param = request.query;
        logger.info("It's test______" + param);
        if(param.type == null || param.type == ""){
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        Active.querySlotImageList(param,function(error, data){
            if(error){
                response.json(error);
                return;
            }else{
                var slotImageList = data[0].slotImageList;
                resContent.slotImageList = slotImageList;
                response.json(resContent);
                logger.info("响应:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("获取信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取信息";
        response.json(resContent);
    }
});

//获取系统消息列表
router.get('/messageList', function(request, response, next) {

    logger.info("进入获取系统消息列表接口...");
    var resContent = {code:200};



    try{
        var param = request.query;
        if(param.type == null || param.type ==""){

            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        logger.info("It's test______" + param);

        Message.list(param,function(err,data){
            if(err){
                response.json(err);
                return;
            }
            var messages = data[0].messages;
            //var dataArr = [];
            //messages.foreach(a){
            //
            //}

            resContent.messages = messages;
            response.json(resContent);
            logger.info("响应的结果:" + JSON.stringify(resContent));
        });

    }catch(ex){
        logger.error("获取信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取信息";
        response.json(resContent);
    }
});


module.exports = router;