var express = require('express');
var router = express.Router();
var CommonUtil = require('../lib/util/CommonUtil');
var buyerModel = require('../lib/models/buyer');
var view_index = require('../view_center/index/view_index');
var sessionUtil = require('../lib/util/SessionUtil');
var commonModel = require('../lib/models/common');
var paramValid = require('../lib/models/pub/param_valid');
var async = require('async');
var qs = require('querystring');
var request = require('request');
var url = require('url');
require('date-utils');
var log4node = require('../log4node');
var pay_types = require("../lib/thrift/gen_code/pay_types");
var buyer_types = require("../lib/thrift/gen_code/buyer_types");
var order_types = require("../lib/thrift/gen_code/order_types");
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');
/*
 是否第三方登录
 */
router.post('/isBindThirdParty', function(req, res, next) {
    logger.info('验证第三方登录');
    var arg = req.body;
    var parameters = {};
    var ret = {};

    async.waterfall([
        function (callback) {
            sessionUtil.getOnlineSession(req, function(data){
                if(data.result) {
                    callback(null,data);
                } else {
                    callback({status:201,msg:"未在jfshare登录！"},null);
                }
            });
        },
        function (cookie, callback) {
            parameters.userId = cookie.buyer.userId+"" || "";
            parameters.thirdType = arg.thirdType;

            if (!paramValid.keyValid(parameters.userId) || paramValid.empty(parameters.thirdType)) {
                logger.warn("参数有误, parameters=" + parameters);
                ret.status = 500;
                ret.msg = "非法参数请求！";
               callback(ret, null);
                return;
            }

            var loginLog = new buyer_types.LoginLog({
                userId: parameters.userId,
            });
            // 获取client
            var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "isBindThirdParty", [parameters.thirdType, loginLog]);
            Lich.wicca.invokeClient(buyerServ, function (err, data) {
                if (err || data[0].result.code == "1") {
                    logger.error("调用buyerServ-isBindThirdParty验证第三方登录失败  失败原因 ======" + err);
                    ret.status = 500;
                    ret.msg = "验证第三方登录失败！";
                    callback(ret, null);
                    return;
                }
                logger.info("调用buyerServ-isBindThirdParty验证第三方登录  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
                //view.confirm_cart(req, res, next, parameters);
                if (!paramValid.empty(data[0].thirdUser)) {
                    ret.value = data[0].thirdUser;
                    ret.status = 200;
                    callback(null, ret);
                    return;
                } else {
                    ret.status = 201;
                    ret.msg="未在第三方登录";
                    callback(ret,null);
                    return;
                }
            });
        }
    ], function(err, result){
        if(err) {
            console.log("第三方账号登录失败" + JSON.stringify(err));
            res.json(err);
        } else{
            console.log("第三方账号登录成功");
            res.json(result);
        }
    });
});

router.get('/thirdlogin', function(req, res, next) {
    var _key = "JFX54475254";
    var _spid = "160260";
    var dt = new Date();
    var d0 = dt.toFormat("YYYYMMDDHH24MISS");
    var d1 = dt.addMinutes(5).toFormat("YYYYMMDDHH24MISS");
    var _url = "http://y.jf.189.cn/preview/CommPage/Login.aspx?Partner=" + _spid
        + "&Sign=" + CommonUtil.md5(_spid+_key+d1).toUpperCase()
        + "&ParDate=" + d0;
    logger.info('thirdlogin 189url-----> ' + _url);
    res.json({url:_url});
});

router.post('/payApply', function(req, res, next) {
    var ret = {}
    var args = req.body;
    var ssid = args.ssid;
    logger.info("payAppay ==> orderId=" +args.orderId + "| ssid=" + ssid);

    async.waterfall([
        function (callback) {
            sessionUtil.getOnlineSession(req, function(data){
                if(data.result) {
                    callback(null,data);
                } else {
                    callback({status:201,msg:"未在jfshare登录！"},null);
                }
            });
        },
        function (cookie, callback) {
            var userId = cookie.buyer.userId;
            var thirdType = "TY";

            var loginLog = new buyer_types.LoginLog({
                userId: userId,
            });

            // 获取client
            var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "isBindThirdParty", [thirdType, loginLog]);
            Lich.wicca.invokeClient(buyerServ, function (err, data) {
                if (err || data[0].result.code == "1") {
                    logger.error("payApply ==> 调用buyerServ-isBindThirdParty验证第三方登录失败  失败原因 ======" + err);
                    ret.status = 500;
                    ret.msg = "验证第三方登录失败！";
                    callback(ret, null);
                    return;
                }
                logger.info("payApply ==> 调用buyerServ-isBindThirdParty验证第三方登录  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
                var ExtInfo = JSON.parse(data[0].thirdUser.extInfo);
                var parameters = {};
                parameters.userId = userId;
                parameters.orderIdList = args.payApply[orderId];
                parameters.payChannel = args.payChannel;
                parameters.custId = ExtInfo.deviceNo;
                parameters.custType = ExtInfo.deviceType;
                parameters.procustID = ExtInfo.procustID;
                callback(null, parameters);
            });
        },
        function(parameters, callback) {
            logger.info("payApply ==> 去支付：" + JSON.stringify(parameters));

            var payChannel = new pay_types.PayChannel({
                payChannel:parameters.payChannel,
                payIp: null,
                returnUrl:"",
                custId:parameters.custId,
                custType:parameters.custType,
                procustID:parameters.procustID,
            });
            var ids = []; ids.push(parameters.orderIdList);
            var payParam = new order_types.PayParam({
                userId:parameters.userId,
                orderIdList:ids,
                payChannel:payChannel,
            });
            // 获取client
            var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "payApply", payParam);
            Lich.wicca.invokeClient(orderServ, function (err, data) {
                if (err || data[0].result.code == "1") {
                    logger.error("payApply ==> 调用orderServ-payApply申请支付失败  失败原因 ======err:" + err+", rdata:"+JSON.stringify(data));
                    ret.status = 500;
                    ret.msg = "获取支付请求失败！";
                    return callback(ret, null);
                }
                logger.info("payApply ==> 调用orderServ-payApply申请支付成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
                var formInfo = JSON.parse(data[0].value);
                var payApplyFormStr = ''
                    + '<form id="payApplyForm" method="post" action="'+formInfo.action+'">'
                    +'<input type="text" name="AppCode" value="'+formInfo.AppCode+'">'
                    +'<input type="text" name="RequestDate" value="'+formInfo.RequestDate+'">'
                    +'<input type="text" name="Sign" value="'+formInfo.Sign+'">'
                    +'<input type="text" name="SpId" value="'+formInfo.SpId+'">'
                    +'<input type="text" name="DeviceNo" value="'+formInfo.DeviceNo+'">'
                    +'<input type="text" name="DeviceType" value="'+formInfo.DeviceType+'">'
                    +'<input type="text" name="ProvinceID" value="'+formInfo.ProvinceID+'">'
                    +'<input type="text" name="PayIntegral" value="'+formInfo.PayIntegral+'">'
                    +'<input type="text" name="PayDefaultIntegral" value="'+formInfo.PayDefaultIntegral+'">'
                    +'<input type="text" name="PayDefaultMoney" value="'+formInfo.PayDefaultMoney+'">'
                    +'<input type="text" name="CommodityName" value="'+formInfo.CommodityName+'">'
                    +'<input type="text" name="BusinessRemark" value="'+formInfo.BusinessRemark+'">'
                    +'<input type="text" name="SPOrderID" value="'+formInfo.SPOrderID+'">'
                    +'</form>';

                return callback(null, payApplyFormStr);
            });
        }
    ], function(err, formStr){
        var resHtml = "";
        if(err) {
            resHtml =  ''
                + '<!DOCTYPE html><html lang="zh-cn"><head><meta charset="utf-8"></head><body>'
                + '<script type="text/javascript" src="/js/jquery/jquery-1.7.2.min.js"></script>'
                + '<script src="/js/pay/pay_core_callback.js"></script>'
                + '<script type="text/javascript" language="JavaScript">'
                + 'callbackLogout();'
                + '</script></body></html>';
        } else{
            resHtml =  ''
                + '<!DOCTYPE html><html lang="zh-cn"><head><meta charset="utf-8">'
                + '<script type="text/javascript" src="/js/jquery/jquery-1.7.2.min.js"></script>'
                + '<script src="/js/common.js"></script>'
                + '<script src="/js/pay/pay_core_callback.js"></script></head><body>'
                + formStr
                + '<iframe id="loginInfoFrm" name="loginInfoFrm" src="#" style="display: none;" width="100%" height="100px"></iframe>'
                + '<script type="text/javascript" language="JavaScript">'
                + 'var iframe = document.getElementById("loginInfoFrm");'
                + 'iframe.src="/login/isLoginTY?ssid=' + ssid+'";'
                + 'if (iframe.attachEvent) {iframe.attachEvent("onload", function() {checkJFXLoginStatus("'+ssid+'", callbackLogin, callbackLogout);});} else {iframe.onload = function() {checkJFXLoginStatus("'+ssid+'", callbackLogin, callbackLogout);}}'
                + '</script></body></html>';
        }
        logger.info("payApply ==> out print payApplyHtml:"+resHtml);
        res.end(resHtml);
    });
});

router.get('/test189', function(req, res, next) {
    var params = {
        "DeviceNo": "18610418281",
        "PayIntegral": "1",
        "PayDefaultIntegral": "0",
        "AppCode": "CX",
        "DeviceType": "18",
        "RequestDate": "20160201161953",
        "PayDefaultMoney": "1",
        "action": "http://y.jf.189.cn/preview/WebCashier/Cashier.aspx",
        "Sign": "4b081d15607d740995f837de630ef7fd",
        "BusinessRemark": "订单支付",
        "CommodityName": "聚分享订单",
        "SpId": "160260",
        "SPOrderID": "c30a6fff5710e38cdca6bab5faccedb2"
    }
    res.render("order/test_jf189", params);
});

router.get('/session', function(req, res, next) {
    logger.trace("test for trace");
    logger.info("test for info");
    logger.error("test for error");
    console.log("test for console.log");
    var sid = req.sessionID
    req.session.regenerate(function(){
        //重新生成session之后后续的处理
        res.end(JSON.stringify("old:" + sid + ", new:"+req.sessionID));
    })


});

module.exports = router;
