/**
 * @author by YinBo on 2016/4/21.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var fs = require('fs');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Buyer = require('../lib/models/buyer');
var Common = require('../lib/models/common');
var sessionUtil = require('../lib/util/SessionUtil');
var CommonUtil = require('../lib/util/CommonUtil');
var Score = require('../lib/models/score');
var ScoreCards = require('../lib/models/scoreCards');
var score_types = require('../lib/thrift/gen_code/score_types');
var pagination_types = require('../lib/thrift/gen_code/pagination_types');
var buyer_types = require('../lib/thrift/gen_code/buyer_types');

/*获取图形验证码*/
router.get('/getCaptcha', function (request, response, next) {
    logger.info("进入获取验证码接口");
    var resContent = {code: 200};
    var param = request.query;
    try {
        logger.info("获取验证码请求参数id= " + JSON.stringify(param));
        Common.getCaptcha(param.id, function (err, data) {
            if (err) {
                response.json(err);
                return;
            } else {
                var cb = data[0].captcha.captchaBytes;
                response.writeHead('200', {'Content-Type': 'image/jpeg'});    //写http头部信息
                response.write(cb, 'binary');
                logger.info("响应的结果:" + JSON.stringify(resContent));
                response.end();
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("获取验证码失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取验证码";
        response.json(resContent);
    }
});

/*验证图形验证码*/
router.post('/validateCaptcha', function (request, response, next) {
    logger.info("进入验证图形验证码接口");
    var resContent = {code: 200};
    var param = request.body;
    try {
        logger.info("验证图形验证码请求参数：" + JSON.stringify(param));
        Common.validateCaptcha(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("验证失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});


router.post('/thirdLoginCheck', function (request, response, next) {
    logger.info("进入第三方登录校验");
    var resContent = {code: 200};
    var param = request.body;

    logger.info("请求参数：" + JSON.stringify(param));

    var token = param.token;
    var mobile = param.mobile;
    var openId = param.openId;
    param.clientType = 5;
    //鹏淘第三方登录类型是2
    param.thirdType = 2;
    param.custId = openId;
    var extInfo = "{\"mobileNo\":\""+mobile+"\"" + ","
    + "\"token\":\""+token+"\"" + ","
    + "\"openId\":\""+openId+"\"}";
    param.extInfo = extInfo;
    try {
        Buyer.thirdSigninCheck(param, function (error, data) {
            if (error) {
                response.json(error);
            } else {

                resContent.userId = data[0].buyer.userId;
                resContent.loginName = data[0].buyer.loginName;
                resContent.authInfo = data[0].authInfo;
                resContent.loginTime = data[0].loginLog.loginTime;
                response.json(resContent);
                logger.info("get buyer response:" + JSON.stringify(resContent));
            }
        });

    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("验证失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});

/*获取短信验证码----以后不用这个接口了20161031*/
router.get('/sms', function (request, response, next) {
    logger.info("进入获取验证码接口");
    var resContent = {code: 200};
    var param = request.query;
    try {
        resContent.code = 500;
        resContent.desc = "短信服务暂停,如需登陆,请使用其他方式登陆";
        response.json(resContent);
        return;
        if (param == null || param.mobile == null) {
            resContent.code = 400;
            resContent.desc = "请求参数错误";
            response.json(resContent);
            return;
        }
        logger.info("获取短信验证码请求参数：" + JSON.stringify(param));

        async.waterfall([
            function (callback){
                logger.info("kankandaonalile");
                fs.readFile('/data/run/jfshare_node/jfshare_buyer_proxy/limitMobile.txt','utf-8',function(err, data){
                    if(err){
                        callback(err);
                    } else {
                        //logger.error(JSON.stringify(data));
                        var list = data.split("\n");
                        //logger.info(list);
                        for(var i = 0; i<= list.length ;i++){
                            if(list[i] == param.mobile){
                                logger.info("这是一个标识！");
                                resContent.code = 500;
                                resContent.desc = "获取短信验证码失败，如有问题请联系客服400-800-2383";
                                return response.json(resContent);
                                break;
                            }
                        }
                        callback(null);
                    }
                });
            },
            function (callback) {
                logger.error("guolaide biaoshi");
                Common.sendMsgCaptcha(param, function (err, data) {
                    if (err) {
                        response.json(err);
                        return;
                    }
                    response.json(resContent);
                });
            }
        ], function (err) {
            if (err) {
                return response.json(err);
            } else {
                return response.json({resContent: true});
            }
        });

        //Common.sendMsgCaptcha(param, function (err, data) {
        //    if (err) {
        //        response.json(err);
        //        return;
        //    }
        //    response.json(resContent);
        //});
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("获取验证码失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取验证码";
        response.json(resContent);
    }
});

/*验证短信验证码*/
router.get('/validateMsgCaptcha', function (request, response, next) {
    logger.info("进入验证短信验证码接口");
    var resContent = {code: 200};
    var param = request.query;
    try {
        if (param == null || param.mobile == null || param.captchaDesc == null) {
            resContent.code = 400;
            resContent.desc = "请求参数错误";
            response.json(resContent);
            return;
        }
        logger.info("验证短信验证码请求参数：" + JSON.stringify(param));
        Common.validateMsgCaptcha(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("验证失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});

/*手机短信登录*/
router.post('/login', function (request, response, next) {
    logger.info("进入手机短信登录接口..");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param.mobile == null || param.mobile == "") {
            resContent.code = 500;
            resContent.desc = "手机号不能为空";
            response.json(resContent);
            return;
        }
        if (param.captchaDesc == null || param.captchaDesc == "") {
            resContent.code = 500;
            resContent.desc = "验证码不能为空";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 500;
            resContent.desc = "浏览器标识不能为空";
            response.json(resContent);
            return;
        }
        logger.info("请求参数：" + JSON.stringify(param));

        async.waterfall([
            function (callback) {
                Common.validateMsgCaptcha(param, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            },
            function (callback){
                logger.info("kankandaonalile");
                fs.readFile('/data/run/jfshare_node/jfshare_buyer_proxy/limitMobile.txt','utf-8',function(err, data){
                    if(err){
                        callback(err);
                    } else {
                        //logger.error(JSON.stringify(data));
                        var list = data.split("\n");
                        //logger.info(list);
                        for(var i = 0; i<= list.length ;i++){
                            if(list[i] == param.mobile){
                                logger.info("这是一个标识！");
                                resContent.code = 500;
                                resContent.desc = "您的账户异常暂时不能登录，如有问题请联系客服400-800-2383";
                                return response.json(resContent);
                                break;
                            }
                        }
                        callback(null);
                    }
                });
            },
            function (callback) {
                logger.error("guolaide biaoshi");
                Buyer.loginBySms(param, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        //var loginLog = data[0].loginLog;
                        var userId = data[0].buyer.userId;
                        var authInfo = data[0].authInfo;
                        var loginLog = data[0].loginLog;
                        resContent.loginName = data[0].buyer.mobile;
                        resContent.ppInfo = authInfo.ppInfo;
                        resContent.token = authInfo.token;
                        resContent.userId = userId;
                        resContent.logoutTime =loginLog.logoutTime;
                        /*给出系统当前时间*/
                        resContent.curTime = new Date().getTime();
                        response.json(resContent);
                        logger.info("响应的结果:" + JSON.stringify(resContent));
                    }
                });
            }
        ], function (err) {
            if (err) {
                return response.json(err);
            } else {
                return response.json({resContent: true});
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("登录失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "登录失败";
        response.json(resContent);
    }
});

/*注销*/
router.post('/logout', function (req, res, next) {
    logger.info("进入注销接口..");
    var result = {code: 200};
    var args = req.body;
    var param = {};
    param.tokenId = args.tokenId || "m/B9EnrUoKFgvxVrI2jL0G001x/0abR2PQUoOvOMwAgXqVCw2ERd9A==";
    param.userId = args.userId || 315;
    Buyer.logout(param, function (err, data) {
        if (err) {
            res.json(err);
        }
        res.json(result);
        logger.info("response:" + JSON.stringify(result));
    })
});

/*手机密码登录*/
router.post('/login2', function (req, res, next) {
    logger.info("进入账号密码登录接口..");
    var resContent = {code: 200};
    var param = req.body;
    try {
        if (param.mobile == null || param.mobile == "") {
            resContent.code = 500;
            resContent.desc = "手机号不能为空";
            res.json(resContent);
            return;
        }
        if (param.pwdEnc == null || param.pwdEnc == "") {
            resContent.code = 500;
            resContent.desc = "密码不能为空";
            res.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 500;
            resContent.desc = "浏览器标识不能为空";
            res.json(resContent);
            return;
        }
        logger.info("请求的参数: " + JSON.stringify(param));
        async.waterfall([
            function (callback) {
                /*快捷登录，跳过验证码*/
                if (param.type != null && param.type == 1) {
                    callback(null);
                } else {
                    /*否则就是正常登录，需要验证码*/
                    Common.validateCaptcha(param, function (err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                }
            },
            function (callback){
                logger.info("kankandaonalile");
                fs.readFile('/data/run/jfshare_node/jfshare_buyer_proxy/limitMobile.txt','utf-8',function(err, data){
                    if(err){
                        callback(err);
                    } else {
                        //logger.error(JSON.stringify(data));
                        var list = data.split("\n");
                        //logger.info(list);
                        for(var i = 0; i<= list.length ;i++){
                            if(list[i] == param.mobile){
                                logger.info("这是一个标识！");
                                resContent.code = 500;
                                resContent.desc = "您的账户异常暂时不能登录，如有问题请联系客服400-800-2383";
                                return res.json(resContent);
                                break;
                            }
                        }
                        callback(null);
                    }
                });
            },
            function (callback) {
                Buyer.newLogin(param, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        //var loginLog = data[0].loginLog;
                        var buyer = data[0].buyer;
                        var authInfo = data[0].authInfo;
                        var loginLog = data[0].loginLog;
                        resContent.userId = buyer.userId;
                        resContent.loginName = buyer.mobile;
                        //resContent.loginLog = loginLog;
                        resContent.token = authInfo.token;
                        resContent.ppInfo = authInfo.ppInfo;
                        resContent.logoutTime =loginLog.logoutTime;
                        /*给出系统当前时间*/
                        resContent.curTime = new Date().getTime();
                        res.json(resContent);
                    }
                });
            }
        ], function (err) {
            if (err) {
                return res.json(err);
            } else {
                return res.json({resContent: true});
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("登录失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "登录失败";
        res.json(resContent);
    }
});

/*注册*/
router.post('/regist', function (req, res, next) {

    logger.info("进入注册接口..");
    var resContent = {code: 200};
    var param = req.body;
    try {
        if (param.mobile == null || param.mobile == "") {
            resContent.code = 500;
            resContent.desc = "手机号不能为空";
            res.json(resContent);
            return;
        }
        if (param.captchaDesc == null || param.captchaDesc == "") {
            resContent.code = 500;
            resContent.desc = "验证码不能为空";
            res.json(resContent);
            return;
        }
        if (param.pwdEnc == null || param.pwdEnc == "") {
            resContent.code = 500;
            resContent.desc = "浏览器标识不能为空";
            res.json(resContent);
            return;
        }
        Common.validateMsgCaptcha(param, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            Buyer.newSignin(param, function (error, data) {
                if (error) {
                    res.json(error);
                    return;
                }
                res.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            });
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("注册失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "注册失败";
        res.json(resContent);
    }
});

/*判断用户名(手机号)是否已存在*/
router.get('/exists', function (request, response, next) {

    logger.info("进入判断手机号是否存在接口...");
    var resContent = {code: 200};
    var param = request.query;
    try {
        if (param == null || param.mobile == null || param.mobile == "") {
            resContent.code = 500;
            resContent.desc = "参数错误，手机号不能为空";
            response.json(resContent);
            return;
        }
        logger.info("传参，arg：" + JSON.stringify(param));
        Buyer.buyerIsExist(param.mobile, function (error, data) {
            if (error) {
                response.json(error);
                return;
            } else {
                var value = data[0].value;
                resContent.value = value;
                response.json(resContent);
                logger.info("get buyer response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("不能判断，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "不能判断";
        response.json(resContent);
    }
});

/*获取鉴权信息*/
router.post('/getAuthInfo', function (request, response, next) {
    logger.info("进入获取鉴权信息接口");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 500;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.mobile == null || param.mobile == "") {
            resContent.code = 500;
            resContent.desc = "手机号不能为空";
            response.json(resContent);
            return;
        }
        if (param.token == null || param.token == "") {
            resContent.code = 500;
            resContent.desc = "鉴权信息不能为空";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 500;
            resContent.desc = "浏览器标识不能为空";
            response.json(resContent);
            return;
        }
        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 500;
            resContent.desc = "鉴权信息不能为空";
            response.json(resContent);
            return;
        }
        if (param.userId == null || param.userId == "") {
            resContent.code = 500;
            resContent.desc = "用户id不能为空";
            response.json(resContent);
            return;
        }
        logger.info("请求参数：" + JSON.stringify(param));
        Buyer.getAuthInfo(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var authInfo = data[0].authInfo;
            resContent.token = authInfo.token;
            resContent.ppInfo = authInfo.ppInfo;
            /*给出系统当前时间*/
            resContent.curTime = new Date().getTime();
            response.json(resContent);
            logger.info("获取到的信息是：" + JSON.stringify(resContent));
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("获取信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取到信息";
        response.json(resContent);
    }
});

/*验证鉴权*/
router.post('/validAuth', function (request, response, next) {
    logger.info("进入验证鉴权接口");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "鉴权信息不能为空";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 400;
            resContent.desc = "浏览器标识不能为空";
            response.json(resContent);
            return;
        }
        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "鉴权信息不能为空";
            response.json(resContent);
            return;
        }
        if (param.userId == null || param.userId == "") {
            resContent.code = 400;
            resContent.desc = "用户id不能为空";
            response.json(resContent);
            return;
        }
        logger.info("请求参数：" + JSON.stringify(param));
        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("验证失败，because :" + ex);
        resContent.code = 501;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});

/*获取个人用户信息*/
router.post('/query', function (request, response, next) {
    logger.info("进入获取个人用户信息接口...");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数不能为空";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 400;
            resContent.desc = "浏览器标识不能为空";
            response.json(resContent);
            return;
        }
        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数不能为空";
            response.json(resContent);
            return;
        }
        if (param.userId == null || param.userId == "" || param.userId <= 0) {
            resContent.code = 400;
            resContent.desc = "用户id不能为空";
            response.json(resContent);
            return;
        }
        logger.info("请求参数信息，arg：" + JSON.stringify(param));
//暂时去掉鉴权信息
        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Buyer.getBuyer(param, function (error, data) {

                if (error) {
                    logger.error("请求参数：" + JSON.stringify(param));
                    response.json(error);
                } else {
                    var buyer = data[0].buyer;
                    if (buyer != null) {
                        resContent.buyer = {
                            userId: buyer.userId,
                            userName: buyer.userName,
                            favImg: buyer.favImg,
                            birthday: buyer.birthday,
                            sex: buyer.sex,
                            mobile: buyer.mobile
                        };
                        response.json(resContent);
                        logger.info("个人用户信息响应:" + JSON.stringify(resContent));
                        return;
                    } else {
                        resContent.code = 500;
                        resContent.desc = "获取用户信息失败";
                        response.json(resContent);
                        logger.info("个人用户信息响应:" + JSON.stringify(resContent));
                        return;
                    }
                }
            });
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("获取用户信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取用户信息";
        response.json(resContent);
    }
});

/*更新个人用户信息*/
router.post('/update', function (request, response, next) {

    logger.info("进入更新用户信息接口");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.userId == null || param.userId == "" || param.userId <= 0) {
            resContent.code = 400;
            resContent.desc = "用户id不能为空";
            response.json(resContent);
            return;
        }
        logger.info("请求参数，arg：" + JSON.stringify(param));
//暂时去掉鉴权
        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Buyer.updateBuyer(param, function (error, data) {
                if (error) {
                    response.json(error);
                } else {
                    response.json(resContent);
                    logger.info("get buyer response:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("不能更新，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "更新个人信息失败";
        response.json(resContent);
    }
});

/*获取用户积分*/
router.post('/scoreTotal', function (request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param.userId == null || param.userId == "" || param.userId <= 0) {
            resContent.code = 400;
            resContent.desc = "用户id不能为空";
            response.json(resContent);
            return;
        }
        if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        logger.info("请求参数信息" + JSON.stringify(param));

        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Score.getScore(param.userId, function (error, data) {
                if (error) {
                    response.json(error);
                } else {
                    var score = data[0].sroce;
                    if (score != null) {
                        resContent.amount = score.amount;
                    } else {
                        resContent.amount = 0;
                    }
                    response.json(resContent);
                    logger.info("get buyer's Score response:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "获取用户积分失败";
        response.json(resContent);
    }
});

/*获取积分列表*/
router.post('/scoreTrade', function (request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code: 200};
    var arg = request.body;
    try {
        if (arg.userId == null || arg.userId == "" || arg.userId <= 0) {
            resContent.code = 400;
            resContent.desc = "用户id不能为空";
            response.json(resContent);
            return;
        }
        if (arg.token == null || arg.token == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (arg.browser == null || arg.browser == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (arg.ppInfo == null || arg.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        logger.info("请求参数信息" + JSON.stringify(arg));
        Buyer.validAuth(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Score.queryScoreTrade(arg, function (error, data) {
                var dataArr = [];
                if (error) {
                    response.json(error);
                } else {
                    var pagination = data[0].pagination;

                    if (pagination !== null) {
                        resContent.page = {
                            total: pagination.totalCount,
                            pageCount: pagination.pageNumCount
                        };
                    }

                    var scoreTrades = data[0].scoreTrades;
                    if (scoreTrades != null) {
                        scoreTrades.forEach(function (a) {
                            dataArr.push({
                                userId: a.userId,
                                type: a.type,
                                amount: a.amount,
                                tradeId: a.tradeId,
                                tradeTime: a.tradeTime,
                                inOrOut: a.inOrOut,
                                trader: a.trader
                            });
                        });
                    }
                    resContent.scoreTrades = dataArr;
                    response.json(resContent);
                    logger.info("get buyer's Score response:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(arg));
        logger.error("获取失败，because: " + ex);
        resContent.code = 500;
        resContent.desc = "获取积分列表失败";
        response.json(resContent);
    }
});
//积分列表
router.post('/socrelist', function (request, response, next) {
    logger.info("进入积分列表流程");
    var result = {code: 200};
    var params = request.body;
    //参数校验
    try {
        if (params.percount == null || params.percount == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.curpage == null || params.curpage == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Score.queryScoreUser(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.scoreList = data[0].scoreUsers;
            var pagination = data[0].pagination;
            if (pagination != null) {
                result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
            }
            logger.info("socrelist result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("获取积分列表错误:" + ex);
        result.code = 500;
        result.desc = "获取积分列表错误";
        response.json(result);
    }
});

/*重置密码*/
router.post('/resetPwd', function (request, response, next) {
    logger.info("进入重置密码接口...");
    var resContent = {code: 200};
    var param = request.body;
    try {
        //参数校验
        if (param.mobile == null || param.newPwd == null || param.mobile == "" || param.newPwd == "") {
            resContent.code = 400;
            resContent.desc = "账号密码不能为空";
            response.json(resContent);
            return;
        }
        if (param.captchaDesc == null || param.captchaDesc == "") {
            resContent.code = 400;
            resContent.desc = "验证码不能为空";
            response.json(resContent);
            return;
        }
        logger.info("请求参数，arg：" + JSON.stringify(param));
        Common.validateMsgCaptcha(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Buyer.newResetBuyerPwd(param, function (error, data) {
                if (error) {
                    response.json(error);
                    return;
                }
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            });
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("重置密码失败，原因:" + ex);
        result.code = 500;
        result.desc = "重置密码失败";
        response.json(result);
    }
});

/*修改密码*/
router.post('/changePwd', function (request, response, next) {

    logger.info("进入修改密码接口...");
    var resContent = {code: 200};
    var param = request.body;
    try {
        //参数校验
        if (param.userId == null || param.newPwd == null || param.userId == "" || param.newPwd == "") {
            resContent.code = 400;
            resContent.desc = "用户id或密码不能为空";
            response.json(resContent);
            return;
        }
        if (param.captchaDesc == null || param.captchaDesc == "") {
            resContent.code = 400;
            resContent.desc = "验证码不能为空";
            response.json(resContent);
            return;
        }
        if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        logger.info("参数为: " + JSON.stringify(param));
//暂时去掉鉴权信息
        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Common.validateMsgCaptcha(param, function (err, data) {
                if (err) {
                    response.json(err);
                    return;
                }
                Buyer.newResetBuyerPwd(param, function (error, data) {
                    if (error) {
                        response.json(error);
                        return;
                    }
                    response.json(resContent);
                    logger.info("响应的结果:" + JSON.stringify(resContent));
                });
            });
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("修改密码失败，原因:" + ex);
        result.code = 500;
        result.desc = "修改密码失败";
        response.json(result);
    }
});

/*获取二维码*/
router.get('/getQRCode', function (request, response, next) {
    logger.info("进入获取验证码接口");
    var resContent = {code: 200};
    var param = request.query;
    try {
        var id = param.id;
        Common.getQRCode(id, function (err, data) {
            if (err) {
                logger.error("请求参数：" + JSON.stringify(param));
                response.json(err);
                return;
            } else {
                var cb = data[0].captcha.captchaBytes;
                response.writeHead('200', {'Content-Type': 'image/jpeg'});    //写http头部信息
                response.write(cb, 'binary');
                //var id = data[0].captcha.id;
                //var value = data[0].captcha.value;
                //resContent.id = id;
                //resContent.value = value;
                logger.info("响应的结果:" + JSON.stringify(resContent));
                response.end();
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("获取验证码失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取验证码";
        response.json(resContent);
    }
});

/*兑出积分查询*/
router.post('/queryCachAmount', function (request, response, next) {

    logger.info("兑出积分查询调用接口");
    var resContent = {code: 200};
    var param = request.body;

    try {
        if (param.userId == null || param.userId == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }

        if (param.clientType == null || param.clientType == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }


        logger.info("请求参数信息" + JSON.stringify(param));
        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Score.queryCachAmount(param, function (error, data) {
                if (error) {
                    response.json(error);
                } else {
                    var score = data[0].cachAmount;
                    resContent.cachAmount = score;
                    response.json(resContent);
                    logger.info("Score enterAmountCall response:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("兑出积分查询异常，原因是======:" + ex);
        resContent.code = 500;
        resContent.desc = "兑出积分查询失败";
        response.json(resContent);
    }
});

/*兑出积分*/
router.post('/cachAmountCall', function (request, response, next) {

    logger.info("进入兑出积分调用接口流程");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param.userId == null || param.userId == "") {
            resContent.code = 400;
            resContent.desc = "用户ID参数错误";
            response.json(resContent);
            return;
        }
        if (param.CachAmount == null || param.CachAmount == "") {
            resContent.code = 400;
            resContent.desc = "兑出积分额参数错误";
            response.json(resContent);
            return;
        }
        if (param.mobile == null || param.mobile == "") {
            resContent.code = 400;
            resContent.desc = "验证码手机号参数错误";
            response.json(resContent);
            return;
        }if (param.deviceNo == null || param.deviceNo == "") {
            resContent.code = 400;
            resContent.desc = "兑出手机号参数错误";
            response.json(resContent);
            return;
        }
        if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "token鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 400;
            resContent.desc = "browser鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "ppInfo鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.captchaDesc == null || param.captchaDesc == "") {
            resContent.code = 500;
            resContent.desc = "验证码不能为空";
            response.json(resContent);
            return;
        }
        if (param.isFirst == null || param.isFirst == "") {
            resContent.code = 500;
            resContent.desc = "确定首次登陆参数不能为空";
            response.json(resContent);
            return;
        }
        if(param.isFirst == "0"){
            if (param.custId == null || param.custId == "") {
                resContent.code = 400;
                resContent.desc = "天翼用户ID参数错误";
                response.json(resContent);
                return;
            }if (param.mobile == null || param.mobile == "") {
                resContent.code = 400;
                resContent.desc = "验证码手机号参数错误";
                response.json(resContent);
                return;
            }
            if (param.deviceNo == null || param.deviceNo == "") {
                resContent.code = 400;
                resContent.desc = "兑出手机号参数错误";
                response.json(resContent);
                return;
            }if (param.deviceType == null || param.deviceType == "") {
                resContent.code = 400;
                resContent.desc = "设备类型参数错误";
                response.json(resContent);
                return;
            }if (param.provicneId == null || param.provicneId == "") {
                resContent.code = 400;
                resContent.desc = "省份编码参数错误";
                response.json(resContent);
                return;
            }if (param.cityId == null || param.cityId == "") {
                resContent.code = 400;
                resContent.desc = "城市编码参数错误";
                response.json(resContent);
                return;
            }if (param.starLevel == null || param.starLevel == "") {
                resContent.code = 400;
                resContent.desc = "客户星级参数错误";
                response.json(resContent);
                return;
            }if (param.requestTime == null || param.requestTime == "") {
                resContent.code = 400;
                resContent.desc = "请求时间参数错误";
                response.json(resContent);
                return;
            }if (param.sign== null || param.sign == "") {
                resContent.code = 400;
                resContent.desc = "请求签名参数错误";
                response.json(resContent);
                return;
            }
        }

        logger.info("请求参数信息" + JSON.stringify(param));
        async.waterfall([
            function (callback) {
                Common.validateMsgCaptchaByCach(param, function (err, data) {
                    if (err) {
                        response.json(err);
                        return;
                    } else {
                        callback(null);
                    }
                });
            },
            function (callback){
                logger.info("验证鉴权开始" + JSON.stringify(param));
                Buyer.validAuth(param, function (err, data) {
                    if (err) {
                        response.json(err);
                        return;
                    }
                    logger.info("验证鉴权信息通过，准备积分兑出" + JSON.stringify(param));
                    Score.cachAmountCall(param, function (error, data) {
                        if (error) {
                            response.json(error);
                        } else {
                            response.json(resContent);
                            logger.info("Score cachAmountCall response:" + JSON.stringify(resContent));
                        }
                    });
                });
            },
        ], function (err) {
            if (err) {
                return response.json(err);
            } else {
                return response.json({resContent: true});
            }
        });
    } catch (ex) {
        logger.error("兑出积分调用异常，原因是======:" + ex);
        resContent.code = 500;
        resContent.desc = "兑出积分调用失败";
        response.json(resContent);
    }
});

/*兑入积分调用接口*/
router.post('/enterAmountCall', function (request, response, next) {

    logger.info("进入兑入积分调用接口");
    var resContent = {code: 200};
    var param = request.body;
    //var ip = request.headers['x-real-ip'];
    //var ip = getClientIP(request);
    try {
       // logger.info("请求IP"+ip);
        //if (ip != "::ffff:124.42.103.132" && ip != "::ffff:120.27.232.14" && ip != "120.27.232.14" && ip != "::ffff:116.228.50.38"  && ip != "116.228.50.38" ) {
        //    resContent.ErrCode = 400;
        //    resContent.ErrMsg = "访问IP不在配置范围内";
        //    response.json(resContent);
        //    return;
        //}
        if (param.AppCode == null || param.AppCode == "") {
            resContent.ErrCode = 9999;
            resContent.ErrMsg = "应用编码不能为空";
            response.json(resContent);
            return;
        }
        if (param.RequestDate == null || param.RequestDate == "") {
            resContent.ErrCode = 9999;
            resContent.ErrMsg = "请求时间不能为空";
            response.json(resContent);
            return;
        }
        if (param.Sign == null || param.Sign == "") {
            resContent.ErrCode = 9999;
            resContent.ErrMsg = "签名信息不能为空";
            response.json(resContent);
            return;
        }
        if (param.SpID == null || param.SpID == "") {
            resContent.ErrCode = 9999;
            resContent.ErrMsg = "业务编码不能为空";
            response.json(resContent);
            return;
        }
        if (param.OutOrderID == null || param.OutOrderID == "") {
            resContent.ErrCode = 9999;
            resContent.ErrMsg = "外部订单号不能为空";
            response.json(resContent);
            return;
        }
        if (param.DeviceNo == null || param.DeviceNo == "") {
            resContent.ErrCode = 9999;
            resContent.ErrMsg = "设备号不能为空";
            response.json(resContent);
            return;
        }
        //if (param.DeviceType == null || param.DeviceType == "") {
        //    resContent.code = 400;
        //    resContent.desc = "设备类型不能为空";
        //    response.json(resContent);
        //    return;
        //}
        //if (param.ProvinceID == null || param.ProvinceID == "") {
        //    resContent.code = 400;
        //    resContent.desc = "省编号不能为空";
        //    response.json(resContent);
        //    return;
        //}
        if (param.ExpTime == null || param.ExpTime == "") {
            resContent.ErrCode = 9999;
            resContent.ErrMsg = "过期时间不能为空";
            response.json(resContent);
            return;
        }
        if (param.Num == null || param.Num == "") {
            resContent.ErrCode = 9999;
            resContent.ErrMsg = "发行积分数不能为空";
            response.json(resContent);
            return;
        }
        //if (param.Remark == null || param.Remark == "") {
        //    resContent.code = 400;
        //    resContent.desc = "参数错误";
        //    response.json(resContent);
        //    return;
        //}
        //if (param.token == null || param.token == "") {
        //    resContent.code = 400;
        //    resContent.desc = "鉴权参数错误";
        //    response.json(resContent);
        //    return;
        //}
        //if (param.browser == null || param.browser == "") {
        //    resContent.code = 400;
        //    resContent.desc = "鉴权参数错误";
        //    response.json(resContent);
        //    return;
        //}
        //if (param.ppInfo == null || param.ppInfo == "") {
        //    resContent.code = 400;
        //    resContent.desc = "鉴权参数错误";
        //    response.json(resContent);
        //    return;
        //}
        logger.info("请求参数信息" + JSON.stringify(param));
        //Buyer.validAuth(param, function (err, data) {
        //    if (err) {
        //        response.json(err);
        //        return;
        //    }
        Score.enterAmountCall(param, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                //var score = data[0].responseScore;
                //resContent.responseScore = score;
                response.json(data[0].responseScore);
                logger.info("Score enterAmountCall response:" + JSON.stringify(resContent));
            }
        });
        //});
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("积分兑入异常，原因是======:" + ex);
        resContent.code = 9999;
        resContent.desc = "积分兑入失败";
        response.json(resContent);
    }
});

/*账号是否已注册及登陆*/
router.post('/existsThirdUser', function (request, response, next) {

    logger.info("账号是否已注册及登陆...");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null || param.thirdType == null || param.thirdType == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:thirdType不能为空";
            response.json(resContent);
            return;
        }
        if (param.custId == null || param.custId == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:custId不能为空";
            response.json(resContent);
            return;
        }
        if (param.accessToken == null || param.accessToken == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:accessToken不能为空";
            response.json(resContent);
            return;
        }
        if (param.openId == null || param.openId == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:openId不能为空";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:browser不能为空";
            response.json(resContent);
            return;
        }
        logger.info("传参，arg：" + JSON.stringify(param));
        Buyer.isExitsThirdUser(param, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                var buyer = data[0].buyer;
                var authInfo = data[0].authInfo;
                var loginLog = data[0].loginLog;
                resContent.userId = buyer.userId;
                resContent.loginName = buyer.mobile;
                resContent.token = authInfo.token;
                resContent.ppInfo = authInfo.ppInfo;
                resContent.logoutTime = loginLog.logoutTime;
                /*给出系统当前时间*/
                resContent.curTime = new Date().getTime();
                response.json(resContent);
                logger.info("get buyer response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("不能判断，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "不能判断";
        response.json(resContent);
    }
});

/*第三方账号注册*/
router.post('/thirdUserSignin', function (request, response, next) {

    logger.info("第三方账号注册接口...");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null || param.thirdType == null || param.thirdType == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:thirdType不能为空";
            response.json(resContent);
            return;
        }
        if (param.custId == null || param.custId == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:custId不能为空";
            response.json(resContent);
            return;
        }
        if (param.accessToken == null || param.accessToken == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:accessToken不能为空";
            response.json(resContent);
            return;
        }
        if (param.openId == null || param.openId == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:openId不能为空";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:browser不能为空";
            response.json(resContent);
            return;
        }
        if (param.mobile == null || param.mobile == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:mobile不能为空";
            response.json(resContent);
            return;
        }
        if (param.captchaDesc == null || param.captchaDesc == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:captchaDesc不能为空";
            response.json(resContent);
            return;
        }
        logger.info("传参，arg：" + JSON.stringify(param));
        Buyer.thirdUserSignin(param, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                var buyer = data[0].buyer;
                var authInfo = data[0].authInfo;
                var loginLog = data[0].loginLog;
                resContent.userId = buyer.userId;
                resContent.loginName = buyer.mobile;
                resContent.token = authInfo.token;
                resContent.ppInfo = authInfo.ppInfo;
                resContent.logoutTime = loginLog.logoutTime;
                /*给出系统当前时间*/
                resContent.curTime = new Date().getTime();
                response.json(resContent);
                logger.info("get buyer response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("不能判断，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "不能判断";
        response.json(resContent);
    }
});

/*压力测试*/
router.post('/jmeterTest',function(request,response,next){
    logger.info("进入获取子分类接口");
    var result = {code: 200};
    try {
        var arg = request.body;
        arg.key = "user:token:timestamp:103Mobile";
        arg.count = 1000;
        Score.getRedisbyKey(arg, function (err, data) {
            if (err) {
                response.json(err);
            } else {
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

/*HTTPS请求方法*/
router.post('/requestHttps',function(request,response,next){
    logger.info("进入获取http请求接口..");
    var result = {code: 200};
    try {
        var arg = request.body;
        Buyer.requestHttps(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            } else {
                var remark = data[0].buyer.remark;
                //result.remark = JSON.parse(remark);  //返回错误时，无啊转换，导致node服务器崩溃
                result.remark = remark;
                response.json(result);
            }
        });
    } catch (ex) {
        logger.error("get http request error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        response.json(result);
    }
});
/* 微信jsapi 获取对应的 config */
router.post('/getWeiXinJSconfig',function(request,response,next){
    logger.info("微信jsapi 获取对应的 config请求接口..");
    var result = {code: 200};
    try {
        var param = request.body;
        if (param == null || param.url == null || param.url == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:url不能为空";
            response.json(resContent);
            return;
        }

        Buyer.getWeiXinJSconfig(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            } else {
                var config = data[0].config;
                //result.remark = JSON.parse(remark);  //返回错误时，无啊转换，导致node服务器崩溃
                result.config = config;
                response.json(result);
            }
        });
    } catch (ex) {
        logger.error("get http request error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        response.json(result);
    }
});


/* 获取个人信息--- 根据手机号 去获取个人信息  */
router.post('/getProfileFromWeixinByUnionId',function(request,response,next){
    logger.info("进入获取getProfileFromWeixinByUnionId请求接口..");
    var result = {code: 200};
    try {
        var arg = request.body;

        var param = request.body;
        if (param.unionId == null || param.unionId == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:unionId不能为空";
            response.json(resContent);
            return;
        }
        logger.info("传参，arg：" + JSON.stringify(param));


        Buyer.getProfileFromWeixinByUnionId(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            } else {
                result.profile = data[0].profile;
                //result.remark = JSON.parse(remark);  //返回错误时，无啊转换，导致node服务器崩溃
                response.json(result);
            }
        });
    } catch (ex) {
        logger.error("get http request error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        response.json(result);
    }
});

/* 获取个人信息--- 根据手机号 去获取个人信息  */
router.post('/getProfileFromWeixinByCode',function(request,response,next){
    logger.info("进入获取getProfileFromWeixinByCode请求接口..");
    var result = {code: 200};
    try {
        var arg = request.body;

        var param = request.body;
        
        if (param.code == null || param.code == "") {
            resContent.code = 400;
            resContent.desc = "参数错误:userId不能为空";
            response.json(resContent);
            return;
        }
        logger.info("传参，arg：" + JSON.stringify(param));


        Buyer.getProfileFromWeixinByCode(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            } else {
                // var remark = data[0].buyer.remark;
                //result.remark = JSON.parse(remark);  //返回错误时，无啊转换，导致node服务器崩溃
                result.profile = data[0].profile;
                response.json(result);
            }
        });
    } catch (ex) {
        logger.error("get http request error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        response.json(result);
    }
});

/*用户是否绑定兑出账号*/
router.post('/isUserIdRela', function (request, response, next) {

    logger.info("进入用户是否绑定兑出账号接口...");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null || param.userId == null || param.userId == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        logger.info("传参，arg：" + JSON.stringify(param));
        Score.isUserIdRela(param.userId, function (error, data) {
            if (error) {
                response.json(error);
                return;
            } else {
                //resContent.scoreAccount = data[0].scoreAccount;
                //resContent.value = data[0].value;
                var scoreAccountResult = data[0];
                resContent.scoreAccountResult = scoreAccountResult;
                response.json(resContent);
                logger.info("get isUserIdRela response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("不能判断，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "不能判断";
        response.json(resContent);
    }
});

/*账号是否绑定*/
router.post('/isAccountRela', function (request, response, next) {

    logger.info("进入账号是否绑定接口...");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null || param.account == null || param.account == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        logger.info("传参，arg：" + JSON.stringify(param));
        Score.isAccountRela(param.account, function (error, data) {
            if (error) {
                response.json(error);
                return;
            } else {
                var value = data[0].value;
                resContent.value = value;
                response.json(resContent);
                logger.info("get isAccountRela response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("不能判断，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "不能判断";
        response.json(resContent);
    }
});

/*电信账号绑定接口*/
router.post('/relaAccountCall', function (request, response, next) {

    logger.info("进入电信账号绑定接口...");
    var resContent = {code: 200};
    var param = request.body;
    //var ip = request.headers['x-real-ip'];
    //var ip = getClientIP(request);
    try {

       // logger.info("兑入积分鉴权登陆调用接口"+ip);
        //if (ip != "::ffff:124.42.103.132" && ip != "::ffff:120.27.232.14" && ip != "120.27.232.14" ) {
        //    resContent.code = 400;
        //    resContent.desc = "访问IP不在配置范围内";
        //    response.json(resContent);
        //    return;
        //}
        if (param == null || param.AppCode == null || param.AppCode == "") {
            resContent.code = 9999;
            resContent.desc = "应用编码不能为空";
            response.json(resContent);
            return;
        }
        if (param.RequestDate == null || param.RequestDate == "") {
            resContent.code = 9999;
            resContent.desc = "请求时间不能为空";
            response.json(resContent);
            return;
        }
        if (param.Sign == null || param.Sign == "") {
            resContent.code = 9999;
            resContent.desc = "数据签名不能为空";
            response.json(resContent);
            return;
        }
        if (param.SpID == null || param.SpID == "") {
            resContent.code = 9999;
            resContent.desc = "业务编号不能为空";
            response.json(resContent);
            return;
        }
        if (param.DeviceNo == null || param.DeviceNo == "") {
            resContent.code = 9999;
            resContent.desc = "设备号不能为空";
            response.json(resContent);
            return;
        }
        if (param.DeviceType == null || param.DeviceType == "") {
            resContent.code = 9999;
            resContent.desc = "设备类型不能为空";
            response.json(resContent);
            return;
        }
        if (param.OutCustID == null || param.OutCustID == "") {
            resContent.code = 9999;
            resContent.desc = "客户编号不能为空";
            response.json(resContent);
            return;
        }
        if (param.ToKen == null || param.ToKen == "") {
            resContent.code = 9999;
            resContent.desc = "Token不能为空";
            response.json(resContent);
            return;
        }
        if (param.ExceedTime == null || param.ExceedTime == "") {
            resContent.code = 9999;
            resContent.desc = "过期时间不能为空";
            response.json(resContent);
            return;
        }
        logger.info("传参，arg：" + JSON.stringify(param));
        Score.relaAccountCall(param, function (error, data) {
            if (error) {
                response.json(error);
                return;
            } else {
                var ResponseScore = data[0].ResponseScore;
                resContent.ResponseScore = ResponseScore;
                response.json(resContent);
                logger.info("get isAccountRela response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("绑定失败，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "绑定失败";
        response.json(resContent);
    }
});

/*积分充值*/
router.post('/recharge', function (request, response, next) {

    logger.info("进入积分充值接口");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param.userId == null || param.userId == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }

        if (param.cardName == null || param.cardName == "") {
            resContent.code = 400;
            resContent.desc = "卡号不能为空";
            response.json(resContent);
            return;
        }
        if (param.cardPsd == null || param.cardPsd == "") {
            resContent.code = 400;
            resContent.desc = "卡密不能为空";
            response.json(resContent);
            return;
        }
        logger.info("请求参数信息" + JSON.stringify(param));
        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            ScoreCards.recharge(param, function (error, data) {
                if (error) {
                    response.json(error);
                    return;
                } else {
                    var value = data[0].value;
                    resContent.value = value;
                    response.json(resContent);
                    logger.info("ScoreCards recharge response:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("积分充值异常，原因是======:" + ex);
        resContent.code = 500;
        resContent.desc = "积分充值失败";
        response.json(resContent);
    }
});

/*查询积分充值记录*/
router.post('/queryRechargeCards', function (request, response, next) {

    logger.info("进入积分充值接口");
    var resContent = {code: 200};
    var param = request.body;
    var rechargeCardRecordList = [];
    try {
        if (param.userId == null || param.userId == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.browser == null || param.browser == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "鉴权参数错误";
            response.json(resContent);
            return;
        }
        logger.info("请求参数信息" + JSON.stringify(param));
        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            ScoreCards.queryRechargeCards(param, function (error, data) {
                if (error) {
                    response.json(error);
                    return;
                } else {
                    var pagination = data[0].pagination;
                    if (pagination !== null) {
                        resContent.page = {
                            total: pagination.totalCount,
                            pageCount: pagination.pageNumCount
                        };
                    }
                    var rechargeCardRecords = data[0].rechargeCardRecordList;
                    if (rechargeCardRecords != null) {
                        rechargeCardRecords.forEach(function (a) {
                            rechargeCardRecordList.push({
                                id: a.id,
                                activityId: a.activityId,
                                cardName: a.cardName,
                                pieceValue: a.pieceValue,
                                rechargeType: a.rechargeType,
                                userId: a.userId,
                                rechargeTime: a.rechargeTime
                            });
                        });
                    }
                    resContent.rechargeCardRecordList = rechargeCardRecordList;
                    response.json(resContent);
                    logger.info("ScoreCards queryRechargeCards response:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        logger.error("查询积分充值记录异常，原因是======:" + ex);
        resContent.code = 500;
        resContent.desc = "查询积分充值记录失败";
        response.json(resContent);
    }
});

/*H5第三方登陆*/
router.post('/H5ThirdLogin', function (request, response, next) {

    logger.info("进入H5第三方登陆接口");
    var resContent = {code: 200};
    var param = request.body;
    logger.info("请求参数信息" + JSON.stringify(param));
    try {
        if (param.requestXml == null || param.requestXml == "") {
            resContent.code = 500;
            resContent.desc = "NODE层参数错误";
            response.json(resContent);
            return;
        }
        //if (param.requestDate == null || param.requestDate == "") {
        //    resContent.code = 400;
        //    resContent.desc = "参数错误";
        //    response.json(resContent);
        //    return;
        //}
        //if (param.sign == null || param.sign == "") {
        //    resContent.code = 400;
        //    resContent.desc = "参数错误";

        //    response.json(resContent);
        //    return;
        //}
        //if (param.mobile == null || param.mobile == "") {
        //    resContent.code = 400;
        //    resContent.desc = "参数错误";
        //    response.json(resContent);
        //    return;
        //}
        //if (param.wayType == null || param.wayType == "") {
        //    resContent.code = 400;
        //    resContent.desc = "参数错误";
        //    response.json(resContent);
        //    return;
        //}
        //if (param.redirectUrl == null || param.redirectUrl == "") {
        //    resContent.code = 400;
        //    resContent.desc = "参数错误";
        //    response.json(resContent);
        //    return;
        //}

        Buyer.H5ThirdLogin(param, function (error, data) {
            if (error) {
                response.json(error);
                return;
            } else {
                if(data[0] != "" && data[0] != null){
                    resContent.userId = data[0].userId;
                    resContent.token = data[0].token;
                    resContent.ppInfo = data[0].ppInfo;
                    resContent.mobile = data[0].mobile;
                    response.json(resContent);
                }
                logger.info("Buyer H5ThirdLogin response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("微信H5登录异常，原因是======:" + ex);
        resContent.code = 500;
        resContent.desc = "微信H5登录失败";
        response.json(resContent);
    }
});

/*用户是否为广东电信用户*/
router.post('/isPurchaseMobile', function (request, response, next) {
    var resContent = {code: 200};
    var param = request.body;
    logger.info("进入用户是否为广东电信用户接口..."+JSON.stringify(param));
    try {
        if (param == null || param.mobile == null || param.mobile == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        logger.info("传参，arg：" + JSON.stringify(param));
        Buyer.isPurchaseMobile(param.mobile, function (error, data) {
            if (error) {
                response.json(error);
                return;
            } else {
                var value = data[0].value;
                resContent.value = value;
                response.json(resContent);
                logger.info("get isPurchaseMobile response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("不能判断，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "不能判断";
        response.json(resContent);
    }
});

/*获取二维码*/
router.get('/getQRCodeForSeller', function (request, response, next) {
    logger.info("进入获取验证码接口");
    var resContent = {code: 200};
    try {
        var param = request.query;
        var sellerId = param.sellerId;
        var sellerName = param.sellerName;
        var sellerJson = {
            "sellerId":sellerId,
            "sellerName":sellerName,
            "tradeCode":"Z0010"
        };
        var id = JSON.stringify(sellerJson);
        Common.getQRCode(id, function (err, data) {
            if (err) {
                logger.error("请求参数：" + JSON.stringify(param));
                response.json(err);
                return;
            } else {
                var cb = data[0].captcha.captchaBytes;
                response.writeHead('200', {'Content-Type': 'image/jpeg'});    //写http头部信息
                response.write(cb, 'binary');
                //var id = data[0].captcha.id;
                //var value = data[0].captcha.value;
                //resContent.id = id;
                //resContent.value = value;
                logger.info("响应的结果:" + JSON.stringify(resContent));
                response.end();
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("获取验证码失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取验证码";
        response.json(resContent);
    }
});

/*获取短信验证码接口,先校验图形验证码*/
router.post('/sendMs', function (request, response, next) {
    logger.info("进入获取短验接口");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param.id == null || param.id == "") {
            resContent.code = 400;
            resContent.desc = "param error";
            response.json(resContent);
            return;
        }
        if (param.value == null || param.value == "") {
            resContent.code = 400;
            resContent.desc = "param error";
            response.json(resContent);
            return;
        }
        if (param.mobile == null || param.mobile == "") {
            resContent.code = 400;
            resContent.desc = "param error";
            response.json(resContent);
            return;
        }
        logger.info("验证图形验证码请求参数：" + JSON.stringify(param));
        Common.validateCaptcha(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                Common.sendMsgCaptcha(param, function (err, data) {
                    if (err) {
                        response.json(err);
                        return;
                    }
                    response.json(resContent);
                });
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("验证失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});


/*兑出积分鉴权登陆*/
router.post('/userAuthorize', function (request, response, next) {

    logger.info("兑出积分鉴权登陆调用接口");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param.userId == null || param.userId == "") {
            resContent.code = 500;
            resContent.desc = "用户ID参数为空";
            response.json(resContent);
            return;
        }
        if (param.token == null || param.token == "") {
            resContent.code = 500;
            resContent.desc = "token参数为空";
            response.json(resContent);
            return;
        }
        if (param.clientType == null || param.clientType == "") {
            resContent.code = 500;
            resContent.desc = "用户标识参数为空";
            response.json(resContent);
            return;
        }
        if (param.score == null || param.score == "") {
            resContent.code = 500;
            resContent.desc = "兑出积分额不能为空";
            response.json(resContent);
            return;
        }
        if (param.h5Type == null || param.h5Type == "") {
            resContent.code = 500;
            resContent.desc = "h5Type参数不能为空";
            response.json(resContent);
            return;
        }

        logger.info("请求参数信息" + JSON.stringify(param));
        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Score.userAuthorize(param, function (error, data) {
                if (error) {
                    response.json(error);
                } else {
                    resContent.action = data[0].action;
                    resContent.requestXml = data[0].requestXml;
                    response.json(resContent);
                    logger.info("Score userAuthorize response:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("兑出积分鉴权登陆异常，原因是======:" + ex);
        resContent.code = 500;
        resContent.desc = "兑出积分鉴权登陆失败";
        response.json(resContent);
    }
});


//function getClientIp(request) {
//    return request.headers['x-forwarded-for'] ||
//        request.connection.remoteAddress ||
//        request.socket.remoteAddress ||
//        request.connection.socket.remoteAddress;
//};

/*获取请求IP公共方法*/
function getClientIP(request){
    var ipAddress;
    var headers = request.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = request.connection.remoteAddress;
    }
    return ipAddress;
};

/*兑入积分鉴权登陆*/
router.post('/enterUserAuthorize', function (request, response, next) {

    logger.info("兑入积分鉴权登陆调用接口");
    var resContent = {code: 200};
    var param = request.body;
    //var ip = request.headers['x-real-ip'];
    //var ip = getClientIP(request);
    try {

        //logger.info("兑入积分鉴权登陆调用接口"+ip);
        //if (ip != "::ffff:124.42.103.132"  && ip != "::ffff:116.228.50.38"  && ip != "116.228.50.38"  && ip != "::ffff:120.27.232.14" && ip != "120.27.232.14") {
        //    resContent.ErrCode = 9999;
        //    resContent.ErrMsg = "访问IP不在配置范围内";
        //    response.json(resContent);
        //    return;
        //}
        if (param.requestXml == null || param.requestXml == "") {
            resContent.ErrCode = 9999;
            resContent.ErrMsg = "请求参数为空";
            response.json(resContent);
            return;
        }

        logger.info("请求参数信息" + JSON.stringify(param));
        Score.enterUserAuthorize(param.requestXml, function (error, data) {
                if (error) {
                    response.json(error);
                } else {
                    resContent.action = data[0].action;
                    resContent.encryptyParam = data[0].encryptyParam;
                    resContent.ErrCode = data[0].ErrCode;
                    resContent.ErrMsg = data[0].ErrMsg;
                    response.json(resContent);
                    logger.info("Score userAuthorize response:" + JSON.stringify(resContent));
                }
            });
    } catch (ex) {
        logger.error("兑出积分鉴权登陆异常，原因是======:" + ex);
        resContent.ErrCode = 9999;
        resContent.ErrMsg = "兑入积分鉴权登陆异常";
        response.json(resContent);
    }
});

/*积分兑入登陆*/
router.post('/smsLoginEnterAmount', function (request, response, next) {
    logger.info("进入积分兑入短信登录接口..");
    var resContent = {code: 200};
    var param = request.body;
    //var ip = request.headers['x-real-ip'];
   // var ip = getClientIP(request);
    try {
       // logger.info("请求IP"+ip);
        //if (ip != "::ffff:124.42.103.132" && ip != "::ffff:120.27.232.14"  && ip != "::ffff:120.24.153.102") {
        //    resContent.code = 400;
        //    resContent.desc = "访问IP不在配置范围内";
        //    response.json(resContent);
        //    return;
        //}
        if (param.mobile == null || param.mobile == "") {
            resContent.code = 500;
            resContent.desc = "手机号不能为空";
            response.json(resContent);
            return;
        }
        if (param.captchaDesc == null || param.captchaDesc == "") {
            resContent.code = 500;
            resContent.desc = "验证码不能为空";
            response.json(resContent);
            return;
        }
        if (param.encryptyParam == null || param.encryptyParam == "") {
            resContent.code = 500;
            resContent.desc = "加密参数不能为空";
            response.json(resContent);
            return;
        }
        logger.info("请求参数：" + JSON.stringify(param));

        async.waterfall([
            function (callback) {
                Common.validateMsgCaptcha(param, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            },
            function (callback){
                logger.info("kankandaonalile");
                fs.readFile('/data/run/jfshare_node/jfshare_buyer_proxy/limitMobile.txt','utf-8',function(err, data){
                    if(err){
                        callback(err);
                    } else {
                        var list = data.split("\n");
                        for(var i = 0; i<= list.length ;i++){
                            if(list[i] == param.mobile){
                                logger.info("这是一个标识！");
                                resContent.code = 500;
                                resContent.desc = "您的账户异常暂时不能登录，如有问题请联系客服400-800-2383";
                                return response.json(resContent);
                                break;
                            }
                        }
                        callback(null);
                    }
                });
            },
            function (callback) {
                Buyer.smsLoginEnterAmount(param, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        resContent.url = data[0].url;
                        response.json(resContent);
                        logger.info("响应的结果:" + JSON.stringify(resContent));
                    }
                });
            }
        ], function (err) {
            if (err) {
                return response.json(err);
            } else {
                return response.json({resContent: true});
            }
        });
    } catch (ex) {
        //logger.error("请求参数：" + JSON.stringify(param));
        logger.error("登录失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "登录失败";
        response.json(resContent);
    }
});




/*内嵌其他h5鉴权*/
router.post('/validAuthH5', function (request, response, next) {
    logger.info("进入内嵌h5验证鉴权接口");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "token不能为空";
            response.json(resContent);
            return;
        }
        if (param.openId == null || param.openId == "") {
            resContent.code = 400;
            resContent.desc = "openId不能为空";
            response.json(resContent);
            return;
        }

        if (param.mobileNo == null || param.mobileNo == "") {
            resContent.code = 400;
            resContent.desc = "mobileNo不能为空";
            response.json(resContent);
            return;
        }

        if (param.mac == null || param.mac == "") {
            resContent.code = 400;
            resContent.desc = "mac不能为空";
            response.json(resContent);
            return;
        }

        if (param.accessCode == null || param.accessCode == "") {
            resContent.code = 400;
            resContent.desc = "accessCode不能为空";
            response.json(resContent);
            return;
        }

        logger.info("请求参数：" + JSON.stringify(param));
        Buyer.validAuthH5(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                if(data[0].code == 0){
                    resContent.desc= "验证成功";
                }
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("验证失败，because :" + ex);
        resContent.code = 501;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});

/*小花钱包用户信息获取接口*/
router.post('/floretPassData', function (request, response, next) {
    logger.info("进入小花钱包用户信息获取接口");
    var resContent = {code: 200};
    var params = request.body;
    logger.info("请求参数：" + JSON.stringify(params));
    try {
        if (params == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (params.idCard == null || params.idCard == "") {
            resContent.code = 400;
            resContent.desc = "身份证号不能为空";
            response.json(resContent);
            return;
        }
        if (params.mobile == null || params.mobile == "") {
            resContent.code = 400;
            resContent.desc = "手机号不能为空";
            response.json(resContent);
            return;
        }

        if (params.userName == null || params.userName == "") {
            resContent.code = 400;
            resContent.desc = "用户名不能为空";
            response.json(resContent);
            return;
        }

        if (params.registerTime == null || params.registerTime == "") {
            resContent.code = 400;
            resContent.desc = "注册时间不能为空";
            response.json(resContent);
            return;
        }

        if (params.creditTime == null || params.creditTime == "") {
            resContent.code = 400;
            resContent.desc = "申请授信时间不能为空";
            response.json(resContent);
            return;
        }

        if (params.passTime == null || params.passTime == "") {
            resContent.code = 400;
            resContent.desc = "授信通过时间不能为空";
            response.json(resContent);
            return;
        }


        Buyer.floretPassData(params, function (err, data) {
            if (err) {
                response.json(err);
            } else if(data[0].code == 101){
                resContent.code = data[0].code,
                resContent.desc = "用户已经领取，不能重复领取";
            }else if(data[0].code == 102){
                resContent.code = data[0].code,
                resContent.desc = "用户已使用券码，不能重复领取";
            } else if(data[0].code == 501){
                resContent.code = data[0].code,
                resContent.desc = "时间字符串格式错误";

            } else if(data[0].code == 502){
                resContent.code = data[0].code,
                 resContent.desc = "添加用户失败";

            } else if(data[0].code==1){
                resContent.code  = 500;
                resContent.desc = data[0].failDescList[0].desc;
            }
                response.json(resContent);
        });
    } catch (ex) {
        logger.error("小花钱包用户信息获取失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "推送失败";
        response.json(resContent);
    }
});

/*用户线上申领深圳通卡片*/
router.post('/onLineApply', function (request, response, next) {
    logger.info("用户线上申领深圳通卡片");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.userName == null || param.userName == "") {
            resContent.code = 400;
            resContent.desc = "收件人名不能为空";
            response.json(resContent);
            return;
        }
        if (param.mobile == null || param.mobile == "") {
            resContent.code = 400;
            resContent.desc = "手机号不能为空";
            response.json(resContent);
            return;
        }

        if (param.address == null || param.address == "") {
            resContent.code = 400;
            resContent.desc = "收件人地址不能为空";
            response.json(resContent);
            return;
        }

        if (param.ticketCode == null || param.ticketCode == "") {
            resContent.code = 400;
            resContent.desc = "券码不能为空";
            response.json(resContent);
            return;
        }

        if (param.jfxAccount == null || param.jfxAccount == "") {
            resContent.code = 400;
            resContent.desc = "聚分享账号不能为空";
            response.json(resContent);
            return;
        }
       /* if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "ppInfo不能为空";
            response.json(resContent);
            return;
        }


        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }*/
            logger.info("请求参数：" + JSON.stringify(param));
            Buyer.OnLineApply(param, function (err, data) {
                logger.info("响应结果：" + JSON.stringify(data[0]));
                if (err) {
                    response.json(err);
                } else if(data[0].code==101){
                    resContent.code = data[0].code;
                    resContent.desc = '券码无效';
                }else if(data[0].code==102){
                    resContent.code = data[0].code;
                    resContent.desc = '券码已使用';
                }else if(data[0].code==1){
                    resContent.code  = 500;
                    resContent.desc = data[0].failDescList[0].desc;
                }
                response.json(resContent);
            });
    //    });
    } catch (ex) {
        logger.error("用户线上申领深圳通卡片失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "用户线上申领深圳通卡片失败";
        response.json(resContent);
    }
});

/*商户端审核券码，发放卡片*/
router.post('/sellerCheckCode', function (request, response, next) {
    logger.info("商户端审核券码，发放卡片");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.sellerId == null || param.sellerId == "") {
            resContent.code = 400;
            resContent.desc = "商家不能为空";
            response.json(resContent);
            return;
        }


        if (param.code == null || param.code == "") {
            resContent.code = 400;
            resContent.desc = "code不能为空";
            response.json(resContent);
            return;
        }

       if (param.sztCardId == null || param.sztCardId == "") {
           resContent.code = 400;
           resContent.desc = "深圳通卡不能为空";
           response.json(resContent);
           return;
        }

        //鉴权信息  token ppinfo
      /*  if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "token不能为空";
            response.json(resContent);
            return;
        }

        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "ppInfo不能为空";
            response.json(resContent);
            return;
        }


        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }*/
            logger.info("请求参数：" + JSON.stringify(param));
            Buyer.sellerCheckCode(param, function (err, data) {
                if (err) {
                    response.json(err);
                } else {
                    if (data[0].code == 101) {
                        resContent.code = data[0].code;
                        resContent.desc = '该券码无效';
                    } else if (data[0].code == 102) {
                        resContent.code = data[0].code;
                        resContent.desc = '券码已经使用';
                    } else if (data[0].code == 103) {
                        resContent.code = data[0].code;
                        resContent.desc = '无效的深圳通卡号';
                    } else if (data[0].code == 104) {
                        resContent.code = data[0].code;
                        resContent.desc = '该深圳通卡号已使用';
                    }
                    response.json(resContent);
                }
            });
      //  });
       } catch (ex) {
               logger.error("商户端审核券码，发放卡片失败，because :" + ex);
               resContent.code = 500;
               resContent.desc = "商户端审核券码，发放卡片失败";
               response.json(resContent);
             }
       });

/*商户端查询验证记录*/
router.post('/findVerifyRecord', function (request, response, next) {
    var param = request.body;
    logger.info("商户端查询验证记录参数 ： " + JSON.stringify(param));
    var resContent = {code: 200};

    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.sellerId == null || param.sellerId == "") {
            resContent.code = 400;
            resContent.desc = "商家不能为空";
            response.json(resContent);
            return;
        }
        if (param.applySource < 1||param.applySource > 2) {
            resContent.code = 400;
            resContent.desc = "请求端不存在";
            response.json(resContent);
            return;
        }
        if(param.applySource==2){
            if (param.currentPage == null || param.currentPage == "") {
                resContent.code = 400;
                resContent.desc = "当前页不能为空";
                response.json(resContent);
                return;
            }
            if (param.numPerPage == null || param.numPerPage == "") {
                resContent.code = 400;
                resContent.desc = "分页大小不能为空";
                response.json(resContent);
                return;
            }
        }


        //鉴权信息  token ppinfo
       /* if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "token不能为空";
            response.json(resContent);
            return;
        }

        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "ppInfo不能为空";
            response.json(resContent);
            return;
        }


        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }*/

            logger.info("请求参数：" + JSON.stringify(param));
            Buyer.findVerifyRecord(param, function (err, data) {
                if (err) {
                    response.json(err);
                } else {
                    if (data[0].result.code == 1) {
                        resContent.code = 500;
                        resContent.desc = "服务器繁忙";
                        response.json(resContent);
                        return
                    }
                        resContent.data = data[0].verifyRecordList ,
                        resContent.pagination = data[0].pagination
                    response.json(resContent);
                    logger.info("响应的结果:" + JSON.stringify(resContent));
                }
            });
      //  });
    } catch (ex) {
        logger.error("商户端查询验证记录失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "商户端查询验证记录失败";
        response.json(resContent);
    }
});

/*商户端导出验证记录*/
router.post('/exportVerifyRecord', function (request, response, next) {
    logger.info("商户端导出验证记录");
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.sellerId == null || param.sellerId == "") {
            resContent.code = 400;
            resContent.desc = "商家不能为空";
            response.json(resContent);
            return;
        }

        //鉴权信息  token ppinfo
       /* if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "token不能为空";
            response.json(resContent);
            return;
        }

        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "ppInfo不能为空";
            response.json(resContent);
            return;
        }


        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }*/
            logger.info("请求参数：" + JSON.stringify(param));
            Buyer.exportVerifyRecord(param, function (err, data) {
                if (err) {
                    response.json(err);
                } else {
                    resContent.url = data[0].value;
                    response.json(resContent);
                    logger.info("响应的结果:" + JSON.stringify(resContent));
                }
            });
     //   });
    } catch (ex) {
        logger.error("商户端导出验证记录失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "商户端导出验证记录失败";
        response.json(resContent);
    }
});

/*申领成功后通过领券码查询物流信息*/
router.post('/queryExpress', function (request, response, next) {
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.ticketCode == null || param.ticketCode == "") {
            resContent.code = 400;
            resContent.desc = "券码不能为空";
            response.json(resContent);
            return;
        }

        logger.info("请求参数*****************" + JSON.stringify(param));
        Buyer.queryExpress(param, function (err, data) {
            logger.info("响应的结果 ：" + JSON.stringify(data));
            if (err) {
                response.json(err);
            } else {
                resContent.date=data[0].expressTrace;
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("查询物流信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "查询物流信息失败";
        response.json(resContent);
    }
});

//sendMobileNote 重新发送短信
router.post('/sendMobileNote', function (request, response, next) {
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数不能为空";
            response.json(resContent);
            return;
        }
        if (param.mobile == null || param.mobile == "") {
            resContent.code = 400;
            resContent.desc = "手机号不能为空";
            response.json(resContent);
            return;
        }
        if (param.type == null || param.type == "") {
            resContent.code = 400;
            resContent.desc = "短信类型不能为空";
            response.json(resContent);
            return;
        }

        //鉴权信息  token ppinfo
      /*  if (param.token == null || param.token == "") {
            resContent.code = 400;
            resContent.desc = "token不能为空";
            response.json(resContent);
            return;
        }

        if (param.ppInfo == null || param.ppInfo == "") {
            resContent.code = 400;
            resContent.desc = "ppInfo不能为空";
            response.json(resContent);
            return;
        }


        Buyer.validAuth(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }*/
            logger.info("请求参数*****************" + JSON.stringify(param));
            Buyer.sendMobileNote(param, function (err, data) {
                logger.info("响应的结果 ：" + JSON.stringify(data));
                if (err) {
                    response.json(err);
                } else {
                    if (data[0].code == 101) {
                        resContent.code = 101,
                            resContent.desc = '手机号不存在'
                    } else if (data[0].code == 1) {
                        resContent.code = 500;
                        resContent.desc = '系统错误';
                    }
                    response.json(resContent);
                    logger.info("响应的结果:" + JSON.stringify(resContent));
                }
            });
     //   });
    } catch (ex) {
        logger.error("重新发送短信失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "发送失败";
        response.json(resContent);
    }
});

/*线下站点人员登陆*/
router.post('/sellerLogin', function (request, response, next) {
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.loginName == null || param.loginName == "") {
            resContent.code = 400;
            resContent.desc = "用户名为空";
            response.json(resContent);
            return;
        }
        if (param.loginPwd == null || param.loginPwd == "") {
            resContent.code = 400;
            resContent.desc = "密码为空";
            response.json(resContent);
            return;
        }
        logger.info("请求参数*****************" + JSON.stringify(param));
        Buyer.sellerLogin(param, function (err, data) {
            logger.info("响应的结果 ：" + JSON.stringify(data));
            if (err) {
                response.json(err);
            } else {
                if(data[0].result.code==101){
                    resContent.code=101;
                    resContent.desc='用户名或密码错误';
                }else if(data[0].result.code==1){
                    resContent.code=500;
                    resContent.desc='系统繁忙';
                }else{
                    resContent.data=data[0].value;
                }
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("登陆失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "服务器繁忙";
        response.json(resContent);
    }
});
//importExcel 导入深圳通卡信息或者线下站点信息
router.post('/importExcel', function (request, response, next) {
    var resContent = {code: 200};
    var param = request.body;
    try {
        if (param == null) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            response.json(resContent);
            return;
        }
        if (param.fileName == null || param.fileName == "") {
            resContent.code = 400;
            resContent.desc = "文件名不能为空";
            response.json(resContent);
            return;
        }

        logger.info("请求参数*****************" + JSON.stringify(param));
        Buyer.importExcel(param, function (err, data) {
            logger.info("响应的结果 ：" + JSON.stringify(data));
            if (err) {
                response.json(err);
            } else {
                if(data[0].result.code==1){
                    resContent.code=500;
                    resContent.desc='服务器繁忙';
                }else{
                    resContent.data=data[0].value;
                }
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("登陆失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "服务器繁忙";
        response.json(resContent);
    }
});




module.exports = router;