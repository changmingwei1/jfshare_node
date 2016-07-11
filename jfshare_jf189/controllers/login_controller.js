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
var zookeeper = require('../lib/util/zookeeper_util');
require('date-utils');

var buyer_types = require("../lib/thrift/gen_code/buyer_types");
var logger = require('../lib/util/log4node').configlog4node.servLog4js();
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');

router.get('/', function(req, res, next) {
    res.render("index/index",res.resData);
});

router.post('/isOnline', function(req, res, next) {
    var req_origin = req.headers.origin || "*";
    res.setHeader('Access-Control-Allow-Origin', req_origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    sessionUtil.getOnlineCookies(req, function(data){
        res.json(data);
    });
});

router.options('/isOnline', function(req, res, next) {
    var req_origin = req.headers.origin || "*";
    res.setHeader('Access-Control-Allow-Origin', req_origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept,X-Requested-With");

    res.json({result:'OK'});
});

//router.get('/captcha', function(req, res, next) {
//    var id = req.query.uuid||"";
//    if(id){
//        new commonModel().getCaptcha(id, function(rdata){
//            if(rdata.result){
//                var img = rdata.captcha.captchaBytes;   //从数据库中得到图片二进制数据
//                res.writeHead('200', {'Content-Type': 'image/jpeg'});    //写http头部信息
//                res.end(img,'binary');
//                //res结束，把图片显示出来也可以res.write(img,'binary')
//            }
//        });
//    }
//});

router.get('/signinThirdParty4TY', function(req, res, next) {
    var strParm = req.query.strParm||"";
    var redirectUrl = req.query.redirectUrl||"";
    var r = CommonUtil.DesDecryptTY(strParm);
    console.log(":::"+strParm);
    console.log(":::"+r);
    var result = qs.parse(r);

    async.waterfall([
        function (callback) {
            var thirdUser = {
                userName: result.truename,
                custId: result.custid,
                accountNo: result.userLoginId+"#"+result.userLoginType,
                thirdType: "TY",
                extInfo: JSON.stringify({deviceNo: result.userLoginId, deviceType: result.userLoginType, procustID:result.procustID })
            }
            new buyerModel().signinTY(thirdUser, {}, function (rdata) {
                if(rdata.result){
                    var loginLog = rdata["loginLog"];
                    var buyer = rdata["buyer"];
                    var sessionBuyer = new buyerModel({userId:buyer.userId,sexImg:CommonUtil.getSexImage(result.Sex), custLevel:CommonUtil.getCustLevelDesc(result.CustLevel), userName:result.userLoginId, loginLog:loginLog, thirdInfo:thirdUser});
                    callback(null, sessionBuyer);
                } else {
                    callback(rdata.failDesc, null);
                }
            });
        }
    ], function(err, sessionBuyer){
        if(err) {
            console.log("第三方账号登录失败" + err);
            res.render("index/index",{signinResult:false, failDesc:err});
        } else{
            req.session.regenerate(function(){
                req.session.loginStatus = true;
                req.session.buyer = sessionBuyer;
                var rData = {};
                rData.userId = sessionBuyer.userId;
                rData.userName = sessionBuyer.userName;
                rData.loginStatus = true;
                rData.ssid = CommonUtil.jfxCryptor(req.sessionID);
                console.log("第三方账号登录成功 res.resData.ssid="+res.resData.ssid+", new.ssid="+rData.ssid);
                var resHtml =  ''
                    + '<!DOCTYPE html><html lang="zh-cn"><head><meta charset="utf-8"></head><body>'
                    + '<script type="text/javascript" src="/js/jquery/jquery-1.7.2.min.js"></script>'
                    + '<script type="text/javascript" language="JavaScript">'
                        + 'location.href="' + redirectUrl + '?ssid='+rData.ssid+'";'
                    + '</script>'
                    + '</body></html>';
                res.end(resHtml);
            });
        }
    });
});

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

            parameters.userId = req.session.buyer.userId;
            parameters.thirdType = arg.thirdType||"TY";

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
    var _key = zookeeper.getData("ty_appid");
    var _spid = zookeeper.getData("ty_spid");
    var dt = new Date();
    var d0 = dt.toFormat("YYYYMMDDHH24MISS");
    var d1 = dt.addMinutes(5).toFormat("YYYYMMDDHH24MISS");
    //var _url = "http://y.jf.189.cn/preview/CommPage/Login.aspx?Partner=" + _spid
    var _url = zookeeper.getData("ty_host_url") + "/preview/CommPage/Login.aspx?Partner=" + _spid
        + "&Sign=" + CommonUtil.md5(_spid+_key+d1).toUpperCase()
        + "&ParDate=" + d0;
    logger.info('thirdlogin 189url-----> ' + _url);
    res.json({url:_url});
});

router.get('/test', function(req, res, next) {
    var _key = zookeeper.getData("ty_appid");
    var _spid = zookeeper.getData("ty_spid");
    var dt = new Date();
    var d0 = dt.toFormat("YYYYMMDDHH24MISS");
    var d1 = dt.addMinutes(5).toFormat("YYYYMMDDHH24MISS");
    var _url = zookeeper.getData("ty_host_url") + "/preview/CommPage/Default.aspx?Partner=" + _spid
        + "&Sign=" + CommonUtil.md5(_spid+_key+d1).toUpperCase()
        + "&ParDate=" + d0;
    logger.info('189url-----> ' + _url);
    res.redirect(_url);
});

router.get('/isLoginTY', function(req, res, next) {
    var status = req.query.status||"";
    var queryUrl = url.parse(req.headers.referer||'').query;
    req.ssid = qs.parse(queryUrl).ssid;
    logger.error("XstatusX referer==> " + req.headers.referer);
    var checkUrl = zookeeper.getData("ty_host_url") + '/preview/CommPage/LoginInfo.aspx?strUrl=http://ct100.jfshare.com/login/isLoginTY';
    //var checkUrl = 'http://y.jf.189.cn/preview/CommPage/LoginInfo.aspx?strUrl=http://localhost:23003/login/isLoginTY';
    if(!status) {
        res.redirect(checkUrl);
    } else {
        logger.error("XstatusX 天翼登陆状态 ==>" + status);
        if(status === "loginOut") {
            req.session.loginStatus=false;
            req.session.regenerate(function(){
                //重新生成session之后后续的处理
                res.end("jfshare logout");
            });
        }else {
            logger.error("XstatusX 天翼登陆状态 ==> ty login");
            res.end("ty login");
        }
    }
});

module.exports = router;
