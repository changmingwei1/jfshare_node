/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');

// 新增系统消息
router.post('/add', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        var params = {};
        params.title = arg.title || "标题：五一大促";
        params.content = arg.content || "消息内容：锅碗瓢盆全都半价啦！";
        params.beginTime = arg.beginTime || "2016-5-1 00:00:00";
        params.endTime = arg.endTime || "2016-5-5 00:00:00";
        params.type = arg.type || "推送类型：1主站、2用户端app、3商家后台、4商户端app";
        params.state = arg.state || "状态：1已过期、2进行中、3未开始三种";

        logger.info("新增系统消息请求， params:" + JSON.stringify(params));


        res.json(result);
        logger.info("add address response:" + JSON.stringify(result));
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "添加系统消息失败";
        res.json(result);
    }
});

// 删除系统消息
router.post('/delete', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        var messageId = arg.messageId || 1;
        logger.info("删除收货地址请求， arg:" + JSON.stringify("messageId:" + messageId));

        res.json(result);
        logger.info("delete address response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("delete address error:" + ex);
        result.code = 500;
        result.desc = "删除收货地址失败";
        res.json(result);
    }
});

// 修改系统消息
router.post('/update', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        var params = {};
        params.title = arg.title || "标题：五一大促";
        params.content = arg.content || "消息内容：锅碗瓢盆全都半价啦！";
        params.beginTime = arg.beginTime || "2016-5-1 00:00:00";
        params.endTime = arg.endTime || "2016-5-5 00:00:00";
        params.type = arg.type || "推送类型：1主站、2用户端app、3商家后台、4商户端app";
        params.state = arg.state || "状态：1已过期、2进行中、3未开始三种";

        logger.info("更新系统消息请求， params:" + JSON.stringify(params));


        res.json(result);
        logger.info("add address response:" + JSON.stringify(result));
    } catch (ex) {
        logger.error("update address error:" + ex);
        result.code = 500;
        result.desc = "更新系统消息失败";
        res.json(result);
    }
});

//获取系统消息
router.post('/get', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        var messageId = arg.messageId || 1;
        logger.info("获取系统消息请求， arg:" + JSON.stringify("messageId:" + messageId));

        result.title = "标题：五一大促";
        result.content = "消息内容：锅碗瓢盆全都半价啦！";
        result.beginTime = "2016-5-1 00:00:00";
        result.endTime = "2016-5-5 00:00:00";
        result.type = "推送类型：1主站、2用户端app、3商家后台、4商户端app";
        result.state = "状态：1已过期、2进行中、3未开始三种";
        res.json(result);
        logger.info("获取系统消息 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("获取系统消息 error:" + ex);
        result.code = 500;
        result.desc = "获取系统消息失败";
        res.json(result);
    }
});

//系统消息列表
router.post('/list', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        var params = {};
        params.title = arg.title || "五一大促";
        params.state = arg.state || 1;
        params.perCount = arg.perCount || 20;
        params.curPage = arg.curPage || 1;

        logger.info("获取收货地址列表请求， arg:" + JSON.stringify(params));
        var message1 = {};
        message1.title = "一一大促";
        message1.content = "锅碗瓢盆全都八折啦！";
        message1.beginTime = "2016-1-1 00:00:00";
        message1.endTime = "2016-1-5 00:00:00";
        message1.type = 4;//商户端app
        message1.state = 3;//未开始
        var message2 = {};
        message2.title = "四一大促";
        message2.content = "锅碗瓢盆全都七折啦！";
        message2.beginTime = "2016-4-1 00:00:00";
        message2.endTime = "2016-4-5 00:00:00";
        message2.type = 2;//用户端app
        message2.state = 2;//进行中
        var message3 = {};
        message3.title = "五一大促";
        message3.content = "锅碗瓢盆全都半价啦！";
        message3.beginTime = "2016-5-1 00:00:00";
        message3.endTime = "2016-5-5 00:00:00";
        message3.type = 1;//主站
        message3.state = 1;//已过期
        var page = {total:3,pageCount:1};

        result.page = page;
        result.message1 = message1;
        result.message2 = message2;
        result.message3 = message3;
        res.json(result);
        logger.info("获取系统消息 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("get address list error:" + ex);
        result.code = 500;
        result.desc = "获取收货地址列表失败";
        res.json(result);
    }
});



module.exports = router;