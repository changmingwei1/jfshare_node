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
            //logger.info(param);
            var dataArr = [];
            if(error){
                //response.json(error);

/************************************测试数据*****************************************/
                var list = [4];
                var  slotImage= new slotImage_types.SlotImage();
                slotImage.imgKey = "3A1F539A9B21F45A37B8A5AABCD38FFF.jpg";
                slotImage.jump = "www.baidu.com";

                list[0] = slotImage;
                list[1] = slotImage;
                list[2] = slotImage;
                list[3] = slotImage;
                resContent.list = list;
                logger.info("===============" + list);
                response.json(resContent);

            }else{
                var slotImageList = data[0].slotImage;
                slotImageList.forEach(function(a){
                    dataArr.push({imgKey: a.imgKey,jump: a.jump});
                });
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

//获取系统消息列表，数据库没表，暂缓


module.exports = router;