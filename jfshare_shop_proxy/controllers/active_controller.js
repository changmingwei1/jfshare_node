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

//获取首页轮播图列表
router.get('/imgList', function(request, response, next) {

    logger.info("进入首页轮播图列表接口...");
    var resContent = {code:200};

    try{
        var param = request.query;
        logger.info("It's test______" + param);
        // 测试使用数据
        Active.querySlotImageList(param,function(error, data){
            if(error){
                response.json(error);
                return;
            }else{
                var slotImageList = data[0].slotImageList;

                response.json(slotImageList);
                logger.info("响应:" + JSON.stringify(slotImageList));
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
        logger.info("It's test______" + param);

        /************************************测试数据*****************************************/
        var messageList = [2];
        /***
         *
         *
         *
         *
         * id:int//消息id
         title: string //标题
         content: string //内容
         beginDate: string //开始时间（yyyy-mm-dd）
         endDate: string //结束时间(yyyy-mm-dd)
         createTime:string//创建时间(格式如2016-04-25 14:51:55)

         *
         *
         *
         *
         *
         *
         *
         *
         * **/
        var  message= {
            id:1,
            title:"我是标题",
            content:"我是消息内容2",
            beginDate:"2016-4-27 13:51:26",
            endDate:"2016-4-28 13:52:26",
            createTime:"2016-3-28 13:56:26"
        };
        var  message1= {
            id:2,
            title:"我是标题2",
            content:"我是消息内容",
            beginDate:"2016-4-27 13:55:29",
            endDate:"2016-4-28 13:51:26",
            createTime:"2016-3-28 13:55:26"
        };
        var  message2= {
            id:3,
            title:"我是标题21",
            content:"我是消息内容21",
            beginDate:"2016-4-27 13:53:26",
            endDate:"2016-4-28 13:55:29",
            createTime:"2016-3-28 13:54:26"
        };
        var  message3= {
            id:4,
            title:"我是标题4",
            content:"我是消息内容4",
            beginDate:"2016-4-27 13:55:26",
            endDate:"2016-4-28 13:55:26",
            createTime:"2016-3-28 13:55:26"
        };
        messageList[0] = message;
        messageList[1] = message1;
        messageList[3] = message2;
        messageList[2] = message3;
        resContent.messageList = messageList;
        logger.info("===============" + messageList);
        response.json(resContent);

    }catch(ex){
        logger.error("获取信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取信息";
        response.json(resContent);
    }
});

module.exports = router;