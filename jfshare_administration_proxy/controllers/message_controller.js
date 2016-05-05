/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Message = require('../lib/models/message');

// 新增系统消息
router.post('/add', function(request, response, next) {

    var result = {code: 200};
    response.json(result);
    return;
    //var result = {code: 200};
    //try{
    //    var params = request.body;
    //    //
    //    //var params = request.query;
    //
    //    logger.info("新增系统消息请求， params:" + JSON.stringify(params));
    //
    //    //参数校验
    //    if(params.title =="" || params.title==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    if(params.content =="" || params.content==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    if(params.beginDate =="" || params.beginDate==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    if(params.endDate =="" || params.endDate==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    if(params.pushTarget =="" || params.pushTarget==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //
    //
    //    Message.add(params, function(error,data){
    //        if(error){
    //            response.json(error);
    //            return;
    //        }
    //        response.json(result);
    //        logger.info("add address response:" + JSON.stringify(data));
    //    });
    //
    //} catch (ex) {
    //    logger.error("add address error:" + ex);
    //    result.code = 500;
    //    result.desc = "添加系统消息失败";
    //    response.json(result);
    //}
});

// 删除系统消息
router.post('/delete', function(request, response, next) {
    var result = {code: 200};
    response.json(results);
    return;
    //var result = {code: 200};
    //try{
    //
    //    var params = request.body;
    //    //var params = request.query;
    //    if(params.id =="" || params.id==null ||params.id<=0){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //
    //    logger.info("删除系统消息请求， arg:" + JSON.stringify(params));
    //    Message.del(params, function(error,data){
    //        if(error){
    //            response.json(error);
    //            return;
    //        }
    //        response.json(result);
    //
    //        logger.info("delete message response:" + JSON.stringify(result));
    //    });
    //} catch (ex) {
    //    logger.error("delete message error:" + ex);
    //    result.code = 500;
    //    result.desc = "删除系统消息失败";
    //    response.json(result);
    //}
});

// 更新系统消息
router.post('/update', function (request, response, next) {

    var results = {
        "code": 200
    };
    response.json(results);
    return;
    //var result = {code: 200};
    //
    //try {
    //    //var arg = req.body;
    //    //var params = request.query;
    //    var params = request.body;
    //
    //    //参数校验
    //
    //    if(params.id =="" || params.id==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    if(params.title =="" || params.title==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    if(params.content =="" || params.content==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    if(params.beginDate =="" || params.beginDate==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    if(params.endDate =="" || params.endDate==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    if(params.pushTarget =="" || params.pushTarget==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    logger.info("更新系统消息请求， params:" + JSON.stringify(params));
    //
    //
    //    Message.update(params, function(error,data){
    //        logger.info("update message response:" + JSON.stringify(data));
    //        if(error||data[0].code==1){
    //            response.json(error);
    //            return;
    //        }
    //
    //        if(data[0].code == 0){
    //            response.json(result);
    //            return;
    //        }
    //
    //    });
    //
    //} catch (ex) {
    //    logger.error("update message error:" + ex);
    //    result.code = 500;
    //    result.desc = "更新系统消息失败";
    //    response.json(result);
    //}
});

//获取系统消息
router.post('/get', function(request, response, next) {


    var results = {
        "code": 200,
        "message": {
            "id": 1,
            "title": "系统消息",
            "content": "测试数据",
            "beginDate": "2016-02-10",
            "endDate": "2017-06-07",
            "status": 2,
            "pushTarget": 0,
            "createTime": "2016-04-25"
        }
    };
    response.json(results);
    return;
    //var result = {code: 200};
    //var params = request.body;
    ////var params = request.query;
    //try{
    //    //参数校验
    //    if(params.id =="" || params.id==null || params.id<=0){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    Message.get(params, function(error,data){
    //        if(error){
    //            respnose.json(error);
    //            return;
    //        }
    //
    //        if(data[0].messages[0]!=null ||data[0].messages[0]!=""){
    //            result.message = data[0].messages[0];
    //        }
    //        response.json(result);
    //        logger.info("get message response:" + JSON.stringify(data));
    //    });
    //
    //} catch (ex) {
    //    logger.error("获取系统消息 error:" + ex);
    //    result.code = 500;
    //    result.desc = "获取系统消息失败";
    //    response.json(result);
    //}
});

//系统消息列表

router.post('/list', function(request, response, next) {

    var results = {
        "code": 200,
        "messageList": [
            {
                "id": 1,
                "title": "系统消息",
                "content": "测试数据",
                "beginDate": "2016-02-10",
                "endDate": "2017-06-07",
                "status": 2,
                "pushTarget": 0,
                "createTime": "2016-04-25"
            },
            {
                "id": 2,
                "title": "1b9fdf79-240b-4bbd-8b27-675055343b0b",
                "content": "bf0da518-a897-4ae3-aea7-fd51a1984e02",
                "beginDate": "2016-04-25",
                "endDate": "2016-05-05",
                "status": 3,
                "pushTarget": 1,
                "createTime": "2016-04-25"
            },
            {
                "id": 3,
                "title": "1f8e8b6c-295c-4203-8a22-97eba44991a5",
                "content": "94ca8cf4-1bc1-42f7-b5dd-ebf2219630dd",
                "beginDate": "2016-04-27",
                "endDate": "2016-05-07",
                "status": 2,
                "pushTarget": 0,
                "createTime": "2016-04-27"
            },
            {
                "id": 11,
                "title": "ddd",
                "content": "eeee",
                "beginDate": "2016-05-03",
                "endDate": "2016-05-03",
                "status": 3,
                "pushTarget": 0,
                "createTime": "2016-05-03"
            },
            {
                "id": 12,
                "title": "ddd",
                "content": "eeee",
                "beginDate": "2016-05-03",
                "endDate": "2016-05-03",
                "status": 3,
                "pushTarget": 0,
                "createTime": "2016-05-03"
            },
            {
                "id": 14,
                "title": "ddd",
                "content": "eeee",
                "beginDate": "2016-05-04",
                "endDate": "2016-05-04",
                "status": 3,
                "pushTarget": 0,
                "createTime": "2016-05-04"
            },
            {
                "id": 15,
                "title": "ddd",
                "content": "eeee",
                "beginDate": "2016-05-04",
                "endDate": "2016-05-04",
                "status": 3,
                "pushTarget": 0,
                "createTime": "2016-05-04"
            },
            {
                "id": 16,
                "title": "ddd",
                "content": "eeee",
                "beginDate": "2016-05-04",
                "endDate": "2016-05-04",
                "status": 3,
                "pushTarget": 0,
                "createTime": "2016-05-04"
            }
        ]
    };

    response.json(results);
    return;



    //var result = {code: 200};
    //var params = request.body;
    ////var params = request.query;
    //try{
    //    Message.list(params, function(error,data){
    //        if(error){
    //            response.json(error);
    //            return;
    //        }
    //
    //        if(data[0].messages!=null){
    //            result.messageList = data[0].messages;
    //        }
    //        response.json(result);
    //        logger.info("get messageList response:" + JSON.stringify(data));
    //    });
    //
    //} catch (ex) {
    //    logger.error("获取系统消息List error:" + ex);
    //    result.code = 500;
    //    result.desc = "获取系统消息列表失败";
    //    response.json(result);
    //}
});



module.exports = router;