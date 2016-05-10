/**
 * @author by YinBo on 2016/4/21.
 */
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Buyer = require('../lib/models/buyer');
var Common = require('../lib/models/common');
var sessionUtil = require('../lib/util/SessionUtil');
var CommonUtil = require('../lib/util/CommonUtil');
var Score = require('../lib/models/score');

var score_types = require('../lib/thrift/gen_code/score_types');
var pagination_types = require('../lib/thrift/gen_code/pagination_types');
var buyer_types = require('../lib/thrift/gen_code/buyer_types');

//获取图形验证码
router.get('/getCaptcha', function (request, response, next) {
    logger.info("进入获取验证码接口");
    var resContent = {code: 200};
    try {
        var param = request.query;
        var id = param.id || "1024";
        Common.getCaptcha(id, function (err, data) {
            if (err) {
                response.json(err);
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
        logger.error("获取验证码失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取验证码";
        response.json(resContent);
    }
});

//验证图形验证码
router.post('/validateCaptcha', function (request, response, next) {
    logger.info("进入验证图形验证码接口");
    var resContent = {code: 200};
    try {
        var param = request.body;
        var id = param.id;
        var value = param.value;

        var args = {};
        args.id = id;
        args.value = value;
        logger.info(JSON.stringify(args));
        Common.validateCaptcha(args, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("验证失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});

//获取短信验证码
router.get('/sms', function (request, response, next) {
    logger.info("进入获取验证码接口");
    var resContent = {code: 200};
    try {
        var param = request.query;
        if (param == null || param.mobile == null) {
            resContent.code = 400;
            resContent.desc = "请求参数错误";
            response.json(resContent);
            return;
        }
        Common.sendMsgCaptcha(param, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(resContent);
        });
    } catch (ex) {
        logger.error("获取验证码失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取验证码";
        response.json(resContent);
    }
});

//验证短信验证码
router.get('/validateMsgCaptcha', function (request, response, next) {
    logger.info("进入验证短信验证码接口");
    var resContent = {code: 200};
    try {
        var param = request.query;
        if (param == null || param.mobile == null || param.captchaDesc == null) {
            resContent.code = 400;
            resContent.desc = "请求参数错误";
            response.json(resContent);
            return;
        }
        Common.validateMsgCaptcha(param, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("验证失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});

//手机短信登录
router.post('/login', function (request, response, next) {

    logger.info("进入手机短信登录接口..");
    var resContent = {code: 200};
    var args = request.body;
    var mobile = args.mobile;
    var captchaDesc = args.captchaDesc;
    var browser = args.browser || null;
    var param = {};
    param.mobile = mobile;
    param.captchaDesc = captchaDesc;
    param.browser = browser;

    //param.ip = CommonUtil.getIP(response);
    //console.log(JSON.stringify(param));

    if (param.mobile == null || param.mobile == "") {
        resContent.code = 500;
        resContent.desc = "参数错误";
        response.json(resContent);
        return;
    }
    if (param.captchaDesc == null || param.captchaDesc == "") {
        resContent.code = 500;
        resContent.desc = "参数错误";
        response.json(resContent);
        return;
    }
    logger.info("请求参数：" + param);
    //var userId = 2;
    //var ppinfo = "hkjasdfgkj";
    //var token = "kjsdhfh";
    //resContent.ppinfo = ppinfo;
    //resContent.token = token;
    //resContent.userId = userId;
    //response.json(resContent);
    //logger.info("响应的结果:" + JSON.stringify(resContent));

    async.waterfall([
        function (callback) {
            Common.validateMsgCaptcha(param, function (err, data) {
                if (err) {
                    //response.json(err);
                    callback(err);
                } else {
                    //response.json(resContent);
                    callback(null);
                }
            });
        },
        function (callback) {
            Buyer.loginBySms(param, function (err, data) {
                if (err) {
                    //response.json(err);
                    callback(err);
                } else {
                    //var loginLog = data[0].loginLog;
                    var userId = data[0].buyer.userId;
                    var authInfo = data[0].authInfo;
                    resContent.ppInfo = authInfo.ppInfo;
                    resContent.token = authInfo.token;
                    resContent.userId = userId;
                    //resContent.loginLog = loginLog;
                    response.json(resContent);
                    logger.info("响应的结果:" + JSON.stringify(resContent));
                }
            });
        }
    ], function (err) {
        if (err) {
            err["result"] = false;
            return response.json(err);
        } else {
            return response.json({result: true});
        }
    });


});

//注销
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

/*手机密码+验证码登录*/
router.post('/login2', function (req, res, next) {

    var resContent = {code: 200};
    var args = req.body;
    var param = {};
    param.mobile = args.mobile;
    param.pwdEnc = args.pwdEnc;
    param.value = args.value;
    param.id = args.id;
    param.browser = args.browser;
    //param["ip"] = CommonUtil.getIP(req);

    logger.info("请求的参数: " + JSON.stringify(param));
    async.waterfall([
        function (callback) {
            Common.validateCaptcha(param, function (err, data) {
                if (err) {
                    callback(err);
                } else {
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
                    //var cookieInfo ={
                    //    tokenId:loginLog["tokenId"],
                    //    userId:loginLog["userId"],
                    //    loginName:buyer["loginName"]
                    //};
                    //var ssid = CommonUtil.jfxCryptor(cookieInfo, sessionUtil.getKey());
                    //var options = {
                    //    path: "/",
                    //    domain: null,
                    //    secure: false,
                    //    httpOnly: true,
                    //    expires:0
                    //};
                    //CommonUtil.setCookie(req, res, "ssid", ssid, options);
                    resContent.userId = buyer.userId;
                    //resContent.loginLog = loginLog;
                    resContent.token = authInfo.token;
                    resContent.ppInfo = authInfo.ppInfo;
                    res.json(resContent);
                }
            });
        }
    ], function (err) {
        if (err) {
            err["result"] = false;
            return res.json(err);
        } else {
            return res.json({result: true});
        }
    });
});

//注册
router.post('/regist', function (req, res, next) {

    logger.info("进入注册接口");
    var resContent = {code: 200};

    var args = req.body;

    var captchaDesc = args.captchaDesc;
    var mobile = args.mobile;
    var pwdEnc = args.pwdEnc;

    var param = {};
    param.captchaDesc = captchaDesc;
    param.mobile = mobile;
    param.pwdEnc = pwdEnc;
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
});

//判断用户名(手机号)是否已存在
router.get('/exists', function (request, response, next) {

    logger.info("进入接口...");
    var resContent = {code: 200};

    try {
        var param = request.query;
        var loginName = param.mobile;
        Buyer.buyerIsExist(loginName, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                response.json(resContent);
                logger.info("get buyer response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("不能判断，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "不能判断";
        response.json(resContent);
    }
});

//获取鉴权信息
router.post('/getAuthInfo', function (request, response, next) {
    logger.info("进入获取验证码接口");
    var resContent = {code: 200};
    try {
        var param = request.body;
        var token = param.token || "鉴权信息1";
        var ppInfo = param.ppInfo || "鉴权信息2";
        var userId = param.userId;
        var loginAuto = param.loginAuto;
        var loginTime = param.loginTime;

        var params = {};
        params.token = token;
        params.ppInfo = ppInfo;
        params.userId = userId;
        params.loginAuto = loginAuto;
        params.loginTime = loginTime;
        logger.info("请求参数：" + JSON.stringify(params));
        Buyer.getAuthInfo(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var autoInfo = data[0].autoInfo;
            resContent.autoInfo = {token: autoInfo.token, ppinfo: autoInfo.ppinfo};
            response.json(resContent);
            logger.info("获取到的信息是：" + JSON.stringify(resContent));
        });
    } catch (ex) {
        logger.error("获取信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取到信息";
        response.json(resContent);
    }
});

//验证鉴权
router.post('/validAuth', function (request, response, next) {
    logger.info("进入验证鉴权接口");
    var resContent = {code: 200};
    try {
        var param = request.body;
        var token = param.token;
        var ppInfo = param.ppInfo;
        var userId = param.userId;

        var params = {};
        params.token = token;
        params.ppInfo = ppInfo;
        params.userId = userId;

        logger.info("请求参数：" + JSON.stringify(params));
        Buyer.validAuth(params, function (err, data) {
            if (err) {
                response.json(err);
            } else {
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("验证失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});

//获取个人用户信息
router.post('/query', function (request, response, next) {

    logger.info("进入获取个人用户信息接口...");
    var resContent = {code: 200};

    try {
        var param = request.body;
        var token = param.token;
        var ppInfo = param.ppInfo;
        var userId = param.userId;
        var browser = param.browser || "1";

        var args = {};
        args.token = token;
        args.ppInfo = ppInfo;
        args.userId = userId;
        args.browser = browser;

        logger.info("It's test______" + JSON.stringify(param));
//暂时去掉鉴权信息
        Buyer.validAuth(args, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Buyer.getBuyer(args, function (error, data) {

                if (error) {
                    response.json(error);
                } else {
                    var buyer = data[0].buyer;
                    //logger.info(buyer);

                    var loginLog = data[0].loginLog;
                    var value = data[0].value;
                    //var thirdUser = data[0].thirdUser;

                    resContent.buyer = {
                        userId: buyer.userId,
                        userName: buyer.userName,
                        favImg: buyer.favImg,
                        birthday: buyer.birthday,
                        sex: buyer.sex,
                        mobile: buyer.mobile
                    };
                    resContent.loginLog = loginLog;
                    resContent.value = value;
                    //resContent.thirdUser = thirdUser;
                    response.json(resContent);
                    logger.info("个人用户信息响应:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        logger.error("获取用户信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取用户信息";
        response.json(resContent);
    }
});

//更新个人用户信息
router.post('/update', function (request, response, next) {

    logger.info("进入更新用户信息接口");
    var resContent = {code: 200};

    try {
        var param = request.body;
        var userId = param.userId;
        var userName = param.userName;
        var favImg = param.favImg || "5544590E122CB3F01DD06CAE021E7EAB.jpg";
        var birthday = param.birthday;
        var sex = param.sex;
        var token = param.token;
        var ppInfo = param.ppInfo;
        var browser = param.browser || "1";

        var args = {};
        args.userId = userId;
        args.userName = userName;
        args.favImg = favImg;
        args.birthday = birthday;
        args.sex = sex;
        args.token = token;
        args.ppInfo = ppInfo;
        args.browser = browser;

        logger.info("It's test_____" + JSON.stringify(args));
//暂时去掉鉴权
        Buyer.validAuth(args, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Buyer.updateBuyer(args, function (error, data) {

                if (error) {
                    response.json(error);
                } else {
                    response.json(resContent);
                    logger.info("get buyer response:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        logger.error("不能更新，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "更新个人信息失败";
        response.json(resContent);
    }
});

//获取用户积分
router.post('/scoreTotal', function (request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code: 200};

    var param = request.body;
    var token = param.token || "鉴权信息1";
    var ppInfo = param.ppInfo || "鉴权信息2";
    var userId = param.userId || 1;

    var params = {};
    params.token = token;
    params.ppInfo = ppInfo;
    params.userId = userId;
    logger.info("请求参数信息" + JSON.stringify(params));


    /*******************************测试数据*********************************/
    var score = new score_types.Score({
        userId: param.userId || "1",
        amount: "100"
    });
    resContent.score = score;
    response.json(resContent);
    /*******************************测试数据*********************************/

    //try{
    //    Buyer.validAuth(params,function(err,data){
    //        if(err){
    //            //response.json(err);
    //            //return;
    //            /***************************测试数据*******************************/
    //            Score.getScore(params,function(error, data){
    //                if(error){
    //                    response.json(error);
    //                }else{
    //                    var score = data[0].score;
    //                    resContent.score = {userId:score.userId,amount:score.amount};
    //                    response.json(resContent);
    //                    logger.info("get buyer's Score response:" + JSON.stringify(resContent));
    //                }
    //            });
    //            /******************************************************************/
    //        }
    //        Score.getScore(params,function(error, data){
    //            if(error){
    //                response.json(error);
    //            }else{
    //                var score = data[0].score;
    //                resContent.score = {userId:score.userId,amount:score.amount};
    //                response.json(resContent);
    //                logger.info("get buyer's Score response:" + JSON.stringify(resContent));
    //            }
    //        });
    //    });
    //}catch(ex){
    //    logger.error("不能获取，原因是:" + ex);
    //    resContent.code = 500;
    //    resContent.desc = "获取用户积分失败，显示测试数据内容为：";
    //    response.json(resContent);
    //}
});
//获取用户积分
router.post('/scoreTotalTest', function (request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code: 200};
    try {
        var param = request.body;
        var token = "鉴权信息1";
        var ppInfo = "鉴权信息2";
        var browser = "asdsafas";
        if (param.userId == null || param.userId == "" || param.userId <= 0) {
            resContent.code = 400;
            resContent.desc = "参数错误";
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
                    var score = data[0].score;
                    resContent.score = {userId: score.userId, amount: score.amount};
                    response.json(resContent);
                    logger.info("get buyer's Score response:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "获取用户积分失败，显示测试数据内容为：";
        response.json(resContent);
    }
});

//获取积分列表
router.post('/scoreTrade', function (request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code: 200};

    var arg = request.body;
    var perCount = arg.perCount || 20;
    var curPage = arg.curPage || 1;
    var userId = arg.userId || 2;
    var type = arg.type || 2;
    var inOrOut = arg.inOrOut || 2;
    var tradeTime = arg.tradeTime || "2016-01-19 15:20:10";
    var token = arg.token || "鉴权信息1";
    var ppInfo = arg.ppInfo || "鉴权信息2";

    var params = {};
    params.perCount = perCount;
    params.curPage = curPage;
    params.userId = userId;
    params.type = type;
    params.inOrOut = inOrOut;
    params.tradeTime = tradeTime;
    params.token = token;
    params.ppInfo = ppInfo;

    logger.info("请求参数信息" + JSON.stringify(params));
    var dataArr = [];

    /*******************************测试数据*********************************/

    var pagination = new pagination_types.Pagination();
    resContent.page = {
        total: pagination.totalCount || 20,
        pageCount: pagination.pageNumCount || 3,
        numPerPage: pagination.perCount || 7,
        currentPage: pagination.curPage || 1
    };

    var scoreTrade = new score_types.ScoreTrade({
        userId: 2,
        type: 2,
        amount: 100,
        tradeId: "123",
        tradeTime: "2016-04-24 11:20:10",
        inOrOut: 2,
        trader: 1
    });
    var scoreTrade1 = new score_types.ScoreTrade({
        userId: 2,
        type: 2,
        amount: 100,
        tradeId: "124",
        tradeTime: "2016-04-24 11:20:10",
        inOrOut: 1,
        trader: 2
    });
    var scoreTrade2 = new score_types.ScoreTrade({
        userId: 2,
        type: 2,
        amount: 100,
        tradeId: "125",
        tradeTime: "2016-04-24 11:20:10",
        inOrOut: 2,
        trader: 3
    });
    var scoreTrade3 = new score_types.ScoreTrade({
        userId: 2,
        type: 2,
        amount: 100,
        tradeId: "126",
        tradeTime: "2016-04-24 11:20:10",
        inOrOut: 1,
        trader: 4
    });
    var scoreTrade4 = new score_types.ScoreTrade({
        userId: 2,
        type: 2,
        amount: 100,
        tradeId: "127",
        tradeTime: "2016-04-24 11:20:10",
        inOrOut: 2,
        trader: 4
    });
    var scoreTrade5 = new score_types.ScoreTrade({
        userId: 2,
        type: 2,
        amount: 100,
        tradeId: "128",
        tradeTime: "2016-04-24 11:20:10",
        inOrOut: 1,
        trader: 2
    });
    var arr = [scoreTrade, scoreTrade1, scoreTrade2, scoreTrade3, scoreTrade4, scoreTrade5];
    resContent.arr = arr;
    response.json(resContent);

    /*******************************测试数据*********************************/

    //try{
    //    Buyer.validAuth(params,function(err,data){
    //        if(err){
    //            //response.json(err);
    //            //return;
    //            /***************************测试数据*******************************/
    //            Score.queryScoreTrade(params,function(error, data){
    //                var dataArr = [];
    //                if(error){
    //                    response.json(error);
    //                }else{
    //                    var pagination = data[0].pagination;
    //                    resContent.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};
    //
    //                    var scoreTrades = data[0].scoreTrades;
    //                    scoreTrades.forEach(function(a){
    //                        dataArr.push({
    //                            userId: a.userId,
    //                            type: a.type,
    //                            amount: a.amount,
    //                            tradeId: a.tradeId,
    //                            tradeTime: a.tradeTime,
    //                            inOrPut: a.inOrOut,
    //                            trader: a.trader
    //                        });
    //                    });
    //                    resContent.scoreTrades = dataArr;
    //
    //                    response.json(resContent);
    //                    logger.info("get buyer's Score response:" + JSON.stringify(resContent));
    //                }
    //            });
    //            /******************************************************************/
    //        }
    //        Score.queryScoreTrade(params,function(error, data){
    //            var dataArr = [];
    //            if(error){
    //                response.json(error);
    //            }else{
    //                var pagination = data[0].pagination;
    //                resContent.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};
    //
    //                var scoreTrades = data[0].scoreTrades;
    //                scoreTrades.forEach(function(a){
    //                    dataArr.push({
    //                        userId: a.userId,
    //                        type: a.type,
    //                        amount: a.amount,
    //                        tradeId: a.tradeId,
    //                        tradeTime: a.tradeTime,
    //                        inOrPut: a.inOrOut,
    //                        trader: a.trader
    //                    });
    //                });
    //                resContent.scoreTrades = dataArr;
    //
    //                response.json(resContent);
    //                logger.info("get buyer's Score response:" + JSON.stringify(resContent));
    //            }
    //        });
    //    });
    //}catch(ex){
    //    logger.error("获取失败，because: " + ex);
    //    resContent.code = 500;
    //    resContent.desc = "获取失败,显示测试数据内容为：";
    //    response.json(resContent);
    //}
});
//获取积分列表
router.post('/scoreTradeTest', function (request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code: 200};
    try {
        var arg = request.body;
        var perCount = 20;
        var curPage = 1;
        var userId = 2;
        var type = 2;
        var inOrOut = 2;
        var tradeTime = "2016-01-19 15:20:10";
        var token = "鉴权信息1";
        var ppInfo = "鉴权信息2";
        var browser = "asdfsa";

        logger.info("请求参数信息" + JSON.stringify(params));

        Buyer.validAuth(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Score.queryScoreTrade(params, function (error, data) {
                var dataArr = [];
                if (error) {
                    response.json(error);
                } else {
                    var pagination = data[0].pagination;
                    resContent.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};

                    var scoreTrades = data[0].scoreTrades;
                    scoreTrades.forEach(function (a) {
                        dataArr.push({
                            userId: a.userId,
                            type: a.type,
                            amount: a.amount,
                            tradeId: a.tradeId,
                            tradeTime: a.tradeTime,
                            inOrPut: a.inOrOut,
                            trader: a.trader
                        });
                    });
                    resContent.scoreTrades = dataArr;
                    response.json(resContent);
                    logger.info("get buyer's Score response:" + JSON.stringify(resContent));
                }
            });
        });
    } catch (ex) {
        logger.error("获取失败，because: " + ex);
        resContent.code = 500;
        resContent.desc = "获取积分列表失败";
        response.json(resContent);
    }
});

//重置密码
router.post('/resetPwd', function (request, response, next) {
    logger.info("进入重置密码接口...");
    var resContent = {code: 200};

    var param = request.body;
    var mobile = param.mobile;
    var newPwd = param.newPwd;
    var captchaDesc = param.captchaDesc;

    var args = {};
    args.mobile = mobile;
    args.newPwd = newPwd;
    args.captchaDesc = captchaDesc;
    //参数校验
    if (mobile == null || newPwd == null || mobile == "" || newPwd == "") {
        resContent.code = 400;
        resContent.desc = "账号密码不能为空";
        response.json(resContent);
        return;
    }
    if (captchaDesc == null || captchaDesc == "") {
        resContent.code = 400;
        resContent.desc = "验证码不能为空";
        response.json(resContent);
        return;
    }
    logger.info("参数为: " + JSON.stringify(args));

    Common.validateMsgCaptcha(args, function (err, data) {
        if (err) {
            response.json(err);
            return;
        }
        Buyer.newResetBuyerPwd(args, function (error, data) {
            if (error) {
                response.json(error);
                return;
            }
            response.json(resContent);
            logger.info("响应的结果:" + JSON.stringify(resContent));
        });
    });
});

//修改密码
router.post('/changePwd', function (request, response, next) {

    logger.info("进入修改密码接口...");
    var resContent = {code: 200};

    var param = request.body;
    var userId = param.userId;
    var mobile = param.mobile;
    var newPwd = param.newPwd;
    var captchaDesc = param.captchaDesc;
    var token = param.token;
    var ppInfo = param.ppInfo;
    var browser = param.browser;

    var args = {};
    args.userId = userId;
    args.mobile = mobile;
    args.newPwd = newPwd;
    args.captchaDesc = captchaDesc;
    args.token = token;
    args.ppInfo = ppInfo;
    args.browser = browser;

    //参数校验
    if (userId == null || newPwd == null || userId == "" || newPwd == "") {
        resContent.code = 400;
        resContent.desc = "用户id或密码不能为空";
        response.json(resContent);
        return;
    }
    if (captchaDesc == null || captchaDesc == "") {
        resContent.code = 400;
        resContent.desc = "验证码不能为空";
        response.json(resContent);
        return;
    }

    logger.info("参数为: " + JSON.stringify(args));
//暂时去掉鉴权信息
    Buyer.validAuth(args, function (err, data) {
        if (err) {
            response.json(err);
            return;
        }
        Common.validateMsgCaptcha(args, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Buyer.newResetBuyerPwd(args, function (error, data) {
                if (error) {
                    response.json(error);
                    return;
                }
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            });
        });
    });
});


module.exports = router;