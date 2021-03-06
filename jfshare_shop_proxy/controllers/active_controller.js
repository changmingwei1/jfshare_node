/**
 * Created by YinBo on 2016/4/12.
 */
var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');
var slotImage_types = require('../lib/thrift/gen_code/slotImage_types');
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Active = require('../lib/models/active');
var Message = require('../lib/models/message');
var Product = require('../lib/models/product');
var Score = require('../lib/models/score');
var zookeeper = require('../resource/zookeeper_util');
var fileCards = require('../lib/models/file_card')
/*压力测试*/
router.post('/jmeterTest', function (request, response, next) {
    logger.info("进入获取子分类接口");
    var result = {code: 200};
    try {
        var arg = request.body;
        arg.key = "subject:Info1001";
        Score.getRedisbyKey(arg, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                result.data = data[0];
                response.json(result);
            }
        });
    } catch (ex) {
        logger.error("get subject child error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        response.json(result);
    }
});
/*压力测试2*/
router.post('/jmeterTest1', function (request, response, next) {
    logger.info("进入获取子分类接口");
    var result = {code: 200};
    response.json(result);
});


/*获取首页轮播图列表*/
router.get('/imgList', function (request, response, next) {

    logger.info("进入首页轮播图列表接口...");
    var resContent = {code: 200};

    try {
        var param = request.query;
        logger.info("It's test______" + param);
        if (param.type == null || param.type == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        /*type=1：for APP；type=2：for APP*/
        Active.querySlotImageList(param, function (error, data) {
            if (error) {
                response.json(error);
                return;
            } else {
                var slotImageList = data[0].slotImageList;
                resContent.slotImageList = slotImageList;
                response.json(resContent);
                logger.info("响应:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("获取信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取信息";
        response.json(resContent);
    }
});

/*获取系统消息列表*/
router.get('/messageList', function (request, response, next) {

    logger.info("进入获取系统消息列表接口...");

    var resContent = {code: 200};
    try {
        var param = request.query;
        if (param.type == null || param.type == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        logger.info("It's test______" + param);

        Message.list(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var messageList = data[0].messages;
            var messages = [];
            if (messageList != null && messageList.length > 0) {
                for (var i = 0; i < messageList.length; i++) {
                    if (messageList[i].status == 2) {
                        messages.push(messageList[i]);
                    }
                }
            }
            resContent.messages = messages;
            response.json(resContent);
            logger.info("响应的结果:" + JSON.stringify(resContent));
        });

    } catch (ex) {
        logger.error("获取信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取信息";
        response.json(resContent);
    }
});

/*查询升级信息*/
router.get('/getAppUpgradeInfo', function (request, response, next) {

    logger.info("进入升级版本接口...");

    var resContent = {code: 200};
    try {
        var param = request.query;
        if (param.appType == null || param.appType == "") {
            resContent.code = 400;
            resContent.desc = "请输入类型";
            response.json(resContent);
            return;
        }
        if (param.version == null || param.version == "") {
            resContent.code = 400;
            resContent.desc = "当前客户端版本号不能为空";
            response.json(resContent);
            return;
        }
        logger.info("It's test______" + JSON.stringify(param));

        Message.getAppUpgradeInfo(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var upgradeInfo = data[0].upgradeInfo;
            resContent.upgradeInfo = upgradeInfo;
            response.json(resContent);
            logger.info("响应的结果:" + JSON.stringify(resContent));
        });

    } catch (ex) {
        logger.error("获取版本号失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取到版本号";
        response.json(resContent);
    }
});

/*查询升级信息-new*/
router.get('/getAppUpgradeInfoStr', function (request, response, next) {

    logger.info("进入升级版本接口...");

    var resContent = {code: 200};
    try {
        var param = request.query;
        if (param.appType == null || param.appType == "") {
            resContent.code = 400;
            resContent.desc = "请输入类型";
            response.json(resContent);
            return;
        }
        if (param.version == null || param.version == "") {
            resContent.code = 400;
            resContent.desc = "当前客户端版本号不能为空";
            response.json(resContent);
            return;
        }
        logger.warn("It's test______" + JSON.stringify(param));

        Message.getAppUpgradeInfoStr(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var upgradeInfo = data[0].upgradeInfo;
            resContent.upgradeInfo = upgradeInfo;
            response.json(resContent);
            logger.warn("响应的结果:" + JSON.stringify(resContent));
        });

    } catch (ex) {
        logger.error("获取版本号失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取到版本号";
        response.json(resContent);
    }
});

/*电信跳转链接*/
router.get('/toExchangeDianXin', function (request, response, next) {
    var result = {code: 200};
    //var param = request.query;
    // result.url = "http://active.jfshare.com/android/comesoon.html";
   result.url = "http://yxyun.telefen.com/sp/jfshare/Index.aspx";
    // 测试环境
    //  result.url = "http://yxyun.telefen.com/test/jfshare/index.aspx";
    response.json(result);
    return;
});


/*因查询归属地的api不稳定,且流量充值时必须得知道运营商,因此使用下面正则去校验*/
//var http = require('http');
///*查询号码归属地查询 for 前端*/
//router.get('/queryMobileInfo',function(request,response,next){
//
//    var result = {code:200};
//    var params = request.query;
//    if(params.mobile == null || params.mobile == ""){
//        result.code = 400;
//        result.desc = "参数错误";
//        response.json(result);
//        return;
//    }
//    //else {
//    //    //重定向到淘宝的api，比百度的好使，因app已上线，字段都不一致，所以使用
//    //    response.redirect("http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=" + params.mobile);
//    //}
//
//
//    var options = {
//        hostname: 'apis.baidu.com',
//        path: '/apistore/mobilenumber/mobilenumber?phone=' + params.mobile,
//        //path: '/chazhao/mobilesearch/phonesearch?phone=' + params.mobile,
//        //hostname:'tcc.taobao.com',
//        //url:'http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=' + params.mobile,
//        //hostname:'apis.juhe.cn',      //不支持部分177号段的号码
//        //path:'/mobile/get?phone=' + params.mobile + "&key=3a36c566db407b6e8079dab2a5ad6d78",
//        method: 'GET',
//        headers:{
//            apikey:"3b91060430c4be4b1504e0d272f306a4",  //百度api调用的key
//            'Content-Type':'application/x-www-form-urlencoded'
//        }
//    };
//    //console.log(options);
//    var req = http.request(options, function (res) {
//        //logger.error('Status:',res.statusCode);
//        //logger.error('headers:',JSON.stringify(res.headers));
//        res.setEncoding('utf8');
//        res.on('data', function (chunk) {
//            //var msg = JSON.parse(chunk).result;
//            //var data = {
//            //    operator: msg.company,
//            //    province: msg.province,
//            //    city: msg.city
//            //};
//            //result.data = data;
//            var data = JSON.parse(chunk);
//            result.data = data;
//            logger.error(result);
//            response.json(result);
//        });
//        res.on('end',function(){
//            console.log('响应结束********');
//        });
//    });
//    req.on('error', function (e) {
//        logger.error('problem with request: ' + e.message);
//        result.code = 500;
//        result.desc = "查询号码归属地异常";
//        response.json(result);
//    });
//    req.end();
//
//});

//移动端需要的动态的图,放在zk中,方便配置
router.get('/queryImgForApp', function (request, response, next) {

    var result = {code: 200};
    var imgKey = "";
    try {
        imgKey = zookeeper.getData("imgkey4app");
    } catch (ex) {
        result.imgKey = "http://120.24.153.102:3000/system/v1/jfs_image/0F102D89A1432FE58BE9D98B7A027655.jpg";
        response.json(result);
    }
    result.imgKey = imgKey;
    response.json(result);

});

//运营商校验
router.get('/queryMobileInfo', function (request, response, next) {


    var result = {code: 200};
    var arg = request.query;


    fileCards.queryMobile(arg, function (err, data) {

        if (err) {
            response.json(err);
            return;
        }
        logger.info("queryMobileInfo result:" + JSON.stringify(data));
        //18537045282
        var data2 = {};
        //运营商 手机号码所属运营商 1：电信，2：移动，3：联通
        if(data.mobileDic!=null){
            data2.operator = data.mobileDic.operator;
            data2.province = data.mobileDic.province;
            if(data2.operator=="2"){
                data2.operator = "中国移动";
            }else if(data2.operator=="1"){
                data2.operator = "中国电信";
            }else if(data2.operator=="3"){
                data2.operator = "中国联通";
            }

        }

        var flowList = [];
        data2.support = "";

        data.flowList.forEach(function(flow,index){

            flowList.push(
                {flowName: flow.flowName,flowno: flow.flowCode, pieceValue: flow.flowPrice}
            );
        });
        //flowList
        data2.localList =  data.localList;
        data2.flowList = flowList;
        result.data = data2;
        response.json(result);
        return;
    });


});

module.exports = router;