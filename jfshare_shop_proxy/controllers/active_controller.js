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

/*压力测试*/
router.post('/jmeterTest',function(request,response,next){
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
router.post('/jmeterTest1',function(request,response,next){
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
            if(messageList != null && messageList.length > 0){
                for(var i = 0; i < messageList.length; i++){
                    if(messageList[i].status == 2){
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
router.get('/toExchangeDianXin',function(request,response,next){
    var result = {code:200};
    //var param = request.query;
    result.url = "http://active.jfshare.com/android/comesoon.html";
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
router.get('/queryImgForApp',function(request,response,next){

    var result = {code:200};
    var imgKey = "";
    try{
        imgKey = zookeeper.getData("imgkey4app");
    } catch (ex) {
        result.imgKey = "http://120.24.153.102:3000/system/v1/jfs_image/0F102D89A1432FE58BE9D98B7A027655.jpg";
        response.json(result);
    }
    result.imgKey = imgKey;
    response.json(result);

});

//运营商校验
router.get('/queryMobileInfo',function(request,response,next){

    var result = {code:200};
    var arg = request.query;
    //18537045282
    var yd = "^1(3[4-9]|4[7]|5[0-27-9]|7[08]|8[2-478])\\d{8}$"; //移动
    var lt = "^1(3[0-2]|4[5]|5[56]|7[0156]|8[56])\\d{8}$";  //联通
    var dx = "^1(3[3]|4[9]|53|7[037]|8[019])\\d{8}$";   //电信
    var mobile = arg.mobile;
    var flowList = [];
    if (mobile.match(yd)) {
        var data = {};
        data.operator = "中国移动";
        data.support = "仅支持安徽和江苏移动用户充值";
        //var flow1 = {flowName:"30M", flowno:"30", pieceValue:"5"};
        //var flow2 = {flowName:"70M", flowno:"70", pieceValue:"10"};
        //var flow3 = {flowName:"150M", flowno:"150", pieceValue:"20"};
        //var flow4 = {flowName:"500M", flowno:"500", pieceValue:"30"};
        //var flow5 = {flowName:"1G", flowno:"1024", pieceValue:"50"};
        //var flow6 = {flowName:"2G", flowno:"2048", pieceValue:"70"};
        //var flow7 = {flowName:"3G", flowno:"3072", pieceValue:"100"};
        //var flow8 = {flowName:"4G", flowno:"4096", pieceValue:"130"};
        //var flow9 = {flowName:"6G", flowno:"6144", pieceValue:"180"};
        //var flow10 = {flowName:"11G", flowno:"11264", pieceValue:"280"};
        flowList.push(
            //{flowName:"30M", flowno:"30", pieceValue:"5"},
            //{flowName:"70M", flowno:"70", pieceValue:"10"},
            //{flowName:"150M", flowno:"150", pieceValue:"20"},
            {flowName:"500M", flowno:"500", pieceValue:"30"},
            {flowName:"1G", flowno:"1024", pieceValue:"50"}
            //{flowName:"2G", flowno:"2048", pieceValue:"70"}
            //{flowName:"3G", flowno:"3072", pieceValue:"100"},
            //{flowName:"4G", flowno:"4096", pieceValue:"130"},
            //{flowName:"6G", flowno:"6144", pieceValue:"180"},
            //{flowName:"11G", flowno:"11264", pieceValue:"280"}
        );
        data.flowList = flowList;
        data.province = "";
        data.city = "";
        result.data = data;
        response.json(result);
    } else if (mobile.match(lt)) {
        var data = {};
        data.operator = "中国联通";
        data.support = "仅支持江西、江苏和上海联通用户充值";
        //var flow = {flowName:"20M", flowno:"20", pieceValue:"3"};
        //var flow1 = {flowName:"500M", flowno:"500", pieceValue:"30"};
        flowList.push(
            {flowName:"50M", flowno:"50", pieceValue:"6"},
            {flowName:"100M", flowno:"100", pieceValue:"10"},
            {flowName:"200M", flowno:"200", pieceValue:"15"},
            {flowName:"500M", flowno:"500", pieceValue:"30"}
        );
        data.flowList = flowList;
        data.province = "";
        data.city = "";
        result.data = data;
        response.json(result);
    } else if (mobile.match(dx)) {
        var data = {};
        data.operator = "中国电信";
        data.support = "";
        //var flow = {flowName:"5M", flowno:"5", pieceValue:"1"};
        //var flow1 = {flowName:"1G", flowno:"1024", pieceValue:"50"};
        flowList.push(
            {flowName:"30M", flowno:"30", pieceValue:"5"},
            {flowName:"50M", flowno:"50", pieceValue:"7"},
            {flowName:"100M", flowno:"100", pieceValue:"10"},
            {flowName:"200M", flowno:"200", pieceValue:"15"},
            {flowName:"500M", flowno:"500", pieceValue:"30"},
            {flowName:"1G", flowno:"1024", pieceValue:"50"}
        );
        data.flowList = flowList;
        data.province = "";
        data.city = "";
        result.data = data;
        response.json(result);
    } else {
        result.code = 500;
        result.desc = "查询运营商失败";
        response.json(result);
    }

});

module.exports = router;