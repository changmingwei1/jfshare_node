/**
 * @author by YinBo on 2016/4/21.
 */
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Buyer = require('../lib/models/buyer');
var Common = require('../lib/models/common');
var sessionUtil = require('../lib/util/SessionUtil');
var CommonUtil = require('../lib/util/CommonUtil');
var Score = require('../lib/models/score');

var score_types = require('../lib/thrift/gen_code/score_types');
var pagination_types = require('../lib/thrift/gen_code/pagination_types');
var buyer_types = require('../lib/thrift/gen_code/buyer_types');

//获取图形验证码
router.post('/getCaptcha',function(request,response,next){
    logger.info("进入获取验证码接口");
    var resContent = {code:200};
    try{
        var param = request.body;
        var id = param.id || "1024";
        Common.getCaptcha(id,function(err,data){
            if(err){
                response.json(err);
            }else{
                var cb = data[0].captcha.captchaBytes;
                response.writeHead('200', {'Content-Type': 'image/jpeg'});    //写http头部信息
                response.write(cb,'binary');
                var id = data[0].captcha.id;
                resContent.id = id;
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("获取验证码失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取验证码";
        response.json(resContent);
    }
});

//验证图形验证码
router.post('/validateCaptcha',function(request,response,next){
    logger.info("进入验证图形验证码接口");
    var resContent = {code:200};
    try{
        var param = request.body;
        var id = param.id || "1024";
        var value = param.value || "cajx";

        var args = {};
        args.id = id;
        args.value = value;
        logger.info(JSON.stringify(args));
        Common.validateCaptcha(args, function(err,data){
            if(err){
                response.json(err);
            }else{
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("验证失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});

//获取短信验证码
router.get('/sms',function(request,response,next){
    logger.info("进入获取验证码接口");
    var resContent = {code:200};
    try{
        var param = request.query;
        if(param == null || param.mobile == null){
            resContent.code = 400;
            resContent.desc = "请求参数错误";
            response.json(resContent);
            return;
        }
        Common.sendMsgCaptcha(param,function(err,data){
            if(err){
                response.json(err);
                return;
            }
            response.json(resContent);
        });
    }catch(ex){
        logger.error("获取验证码失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取验证码";
        response.json(resContent);
    }
});

//验证短信验证码
router.get('/validateMsgCaptcha',function(request,response,next){
    logger.info("进入验证短信验证码接口");
    var resContent = {code:200};
    try{
        var param = request.query;
        if(param == null || param.mobile == null || param.captchaDesc == null){
            resContent.code = 400;
            resContent.desc = "请求参数错误";
            response.json(resContent);
            return;
        }
        Common.validateMsgCaptcha(param,function(err,data){
            if(err){
                response.json(err);
            }else{
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("验证失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});

//手机短信登录
router.post('/login', function(request, response, next) {

    logger.info("进入手机短信登录接口..");
    var resContent = {code: 200};
    var args = request.body;
    var mobile = args.mobile || "13558731842";
    var captchaDesc = args.captchaDesc || "7LJG";
    var param = {};
    param.mobile = mobile;
    param.captchaDesc = captchaDesc;
    //param.ip = CommonUtil.getIP(response);
    //console.log(JSON.stringify(param));
    logger.info(param);

    async.waterfall([
        function (callback) {
            Common.validateMsgCaptcha(param, function (err, data) {
                if (err) {
                    response.json(err);
                } else {
                    //response.json(resContent);
                    //logger.info("响应的结果:" + JSON.stringify(resContent));
                }
            });
        },
        function (callback) {
            Buyer.login(param, function (err, data) {
                logger.info("****************************");
                if (err) {
                    response.json(err);
                } else {
                    //var loginLog = data[0].loginLog;
                    var buyer = data[0].buyer;
                    var userId = buyer.userId;
                    var ppinfo = "hkjasdfgkj";
                    var token = "kjsdhfh";
                    resContent.ppinfo = ppinfo;
                    resContent.token = token;
                    resContent.userId = userId;
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

/*手机密码+验证码登录*/
/*router.post('/login2', function(req, res, next) {

    var args = req.body;
    var loginName = args["loginname"] || "";
    var password = args["password"] || "";
    var captchaValue = args["validateCode"] || "";
    var captchaId = args["uuid"] || "";
    var param = {};

    param["loginName"] = loginName;
    param["pwdEnc"] = password;
    param["captchaId"] = captchaId;
    param["captchaValue"] = captchaValue;
    param["ip"] = CommonUtil.getIP(req);

    console.log(JSON.stringify(param));
    async.waterfall([
        function (callback) {
            Common.validateCaptcha(param, function(rdata){
                if(rdata.result) {
                    callback(null);
                } else {
                    callback({failDesc:"验证码错误!"});
                }
            });
        },
        function (callback) {
            new buyerModel().login(param, function(rdata){
                if(rdata.result) {
                    var loginLog = rdata["loginLog"];
                    var buyer = rdata["buyer"];
                    var cookieInfo ={
                        tokenId:loginLog["tokenId"],
                        userId:loginLog["userId"],
                        loginName:buyer["loginName"]
                    }
                    var ssid = CommonUtil.jfxCryptor(cookieInfo, sessionUtil.getKey());
                    var options = {
                        path: "/",
                        domain: null,
                        secure: false,
                        httpOnly: true,
                        expires:0
                    };
                    CommonUtil.setCookie(req, res, "ssid", ssid, options);
                    callback(null);
                } else {
                    callback({failDesc:rdata.failDesc});
                }
            });
        }
    ], function(err){
        if(err) {
            err["result"] = false;
            return res.json(err);
        } else{
            return res.json({result:true});
        }
    });
});*/
router.post('/login2',function(req,res,next){

    logger.info("进入账号密码登录接口");
    var resContent = {code:200};

    var args = req.body;
    var mobile = args.mobile;
    var pwdEnc = args.pwdEnc;
    var value  = args.value || "cajx";
    var id = args.id || "1024";

    var param = {};
    param.mobile = mobile;
    param.pwdEnc = pwdEnc;
    param.id = id;
    param.value = value;
    //参数校验
    if(param.mobile == null || param.mobile == "" ||param.mobile <= 0){

        resContent.code = 500;
        resContent.desc = "请求参数错误";
        res.json(resContent);
        return;
    }
    if(param.pwdEnc == null || param.pwdEnc == "" ||param.pwdEnc <= 0){

        resContent.code = 500;
        resContent.desc = "请求参数错误";
        res.json(resContent);
        return;
    }
    logger.info("参数信息：" + JSON.stringify(param));
    //Common.validateCaptcha(param, function(err,data){
    //    if(err){
    //        res.json(err);
    //        return;
    //    }
        Buyer.login(param,function(error,data){
            if(error){
                res.json(error);
                return;
                //var authInfo = new buyer_types.AuthInfo({
                //    token:"鉴权信息1",
                //    ppInfo:"鉴权信息2"
                //});
                //resContent.authInfo = authInfo;
                //res.json(JSON.stringify(resContent));
                //logger.info("响应的结果:" + JSON.stringify(resContent));
                //return;
            }
            var authInfo = new buyer_types.AuthInfo({
                token:token,
                ppInfo:ppinfo
             });
            resContent.authInfo = authInfo;
            res.json(JSON.stringify(resContent));
            logger.info("响应的结果:" + JSON.stringify(resContent));
        });
        //res.json(resContent);
        //logger.info("响应的结果:" + JSON.stringify(resContent));
    //});
});

//注册
router.get('/regist', function(req, res, next) {

    logger.info("进入注册接口");
    var resContent = {code:200};

    var args = req.query;
    //var value = args.value || "s3xm";
    //var id = args.id || "1024";
    var captchaDesc = args.captchaDesc || "56SA";
    var mobile = args.mobile ||"18301198617";
    var pwdEnc = args.pwdEnc ||"023AA15ED89871CE330CFF55567A8075";

    var param = {};
    param.captchaDesc = captchaDesc;
    param.mobile = mobile;
    param.pwdEnc = pwdEnc;
    Common.validateMsgCaptcha(param, function(err,data){
        if(err){
            res.json(err);
            return;
        }
        Buyer.newSignin(param,function(error,data){
            if(error){
                res.json(error);
                return;
            }

            res.json(resContent);
            logger.info("响应的结果:" + JSON.stringify(resContent));
        });


    });

});

//判断用户名(手机号)是否已存在
router.get('/exists', function(request, response, next) {

    logger.info("进入接口...");
    var resContent = {code:200};

    try{
        var param = request.query;
        var loginName = param.loginName;
        Buyer.buyerIsExist(loginName,function(error, data){
            if(error){
                response.json(error);
            }else{
                response.json(resContent);
                logger.info("get buyer response:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("不能判断，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "不能判断";
        response.json(resContent);
    }
});

//获取鉴权信息
router.post('/getAuthInfo',function(request,response,next){
    logger.info("进入获取验证码接口");
    var resContent = {code:200};
    try{
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
        Buyer.getAuthInfo(params,function(err,data){
            if(err){
                response.json(err);
                return;
            }
            var autoInfo = data[0].autoInfo;
            resContent.autoInfo = {token:autoInfo.token,ppinfo:autoInfo.ppinfo};
            response.json(resContent);
            logger.info("获取到的信息是：" +　JSON.stringify(resContent));
        });
    }catch(ex){
        logger.error("获取信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取到信息";
        response.json(resContent);
    }
});

//验证鉴权
router.post('/validAuth',function(request,response,next){
    logger.info("进入验证鉴权接口");
    var resContent = {code:200};
    try{
        var param = request.body;
        var token = param.token;
        var ppInfo = param.ppInfo;
        var userId = param.userId;

        var params = {};
        params.token = token;
        params.ppInfo = ppInfo;
        params.userId = userId;

        logger.info("请求参数：" + JSON.stringify(params));
        Buyer.validAuth(params,function(err,data){
            if(err){
                response.json(err);
            }else{
                response.json(resContent);
                logger.info("响应的结果:" + JSON.stringify(resContent));
            }
        });
    }catch(ex){
        logger.error("验证失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "验证失败";
        response.json(resContent);
    }
});

//获取个人用户信息
router.post('/get', function(request, response, next) {

    logger.info("进入获取个人用户信息接口...");
    var resContent = {code:200};

    try{
        var args = request.body;
        var token = args.token || "鉴权信息1";
        var ppInfo = args.ppInfo || "鉴权信息2";
        var userId = args.userId || "2";

        args.token = token;
        args.ppInfo = ppInfo;
        args.userId = userId;

        logger.info("It's test______" + JSON.stringify(args));
        Buyer.validAuth(args,function(err,data){
            if(err){
                //response.json(err);
                //return;
                /***************************测试数据*******************************/
                Buyer.getBuyer(args,function(error, data){

                    if(error){
                        response.json(error);
                    }else{
                        var buyer = data[0].buyer;
                        //logger.info(buyer);

                        var loginLog = data[0].loginLog;
                        var value = data[0].value;
                        var thirdUser = data[0].thirdUser;

                        resContent.buyer = {userId:buyer.userId,userName:buyer.userName,favImg:buyer.favImg,birthday:buyer.birthday,sex:buyer.sex,mobile:buyer.mobile};
                        resContent.loginLog = loginLog;
                        resContent.value = value;
                        resContent.thirdUser = thirdUser;
                        response.json(resContent);
                        logger.info("个人用户信息响应:" + JSON.stringify(resContent));
                    }
                });
                return;
                /******************************************************************/
            }
            Buyer.getBuyer(args,function(error, data){

                if(error){
                    response.json(error);
                }else{
                    var buyer = data[0].buyer;
                    //logger.info(buyer);

                    var loginLog = data[0].loginLog;
                    var value = data[0].value;
                    var thirdUser = data[0].thirdUser;

                    resContent.buyer = {userId:buyer.userId,userName:buyer.userName,favImg:buyer.favImg,birthday:buyer.birthday,sex:buyer.sex,mobile:buyer.mobile};
                    resContent.loginLog = loginLog;
                    resContent.value = value;
                    resContent.thirdUser = thirdUser;
                    response.json(resContent);
                    logger.info("个人用户信息响应:" + JSON.stringify(resContent));
                }
            });
        });
    }catch(ex){
        logger.error("获取用户信息失败，because :" + ex);
        resContent.code = 500;
        resContent.desc = "不能获取用户信息";
        response.json(resContent);
    }
});

//更新个人用户信息
router.post('/update', function(request, response, next) {

    logger.info("进入更新用户信息接口");
    var resContent = {code:200};

    try{
        var param = request.body;
        var userId = param.userId || "2";
        var userName = param.userName || "测试11";
        var favImg = param.favImg || "5544590E122CB3F01DD06CAE021E7EAB.jpg";
        var birthday = param.birthday || "";
        var sex = param.sex || "1";
        var token = param.token || "鉴权信息1";
        var ppInfo = param.ppInfo || "鉴权信息2";

        var args = {};
        args.userId = userId;
        args.userName = userName;
        args.favImg = favImg;
        args.birthday = birthday;
        args.sex = sex;
        args.token = token;
        args.ppInfo = ppInfo;

        logger.info("It's test_____" + JSON.stringify(args));

        Buyer.validAuth(args,function(err,data){
            if(err){
                //response.json(err);
                //return;
                /***************************测试数据*******************************/
                Buyer.updateBuyer(args,function(error, data){

                    if(error){
                        response.json(error);
                    }else{
                        response.json(resContent);
                        logger.info("get buyer response:" + JSON.stringify(resContent));
                    }
                });
                return;
                /******************************************************************/
            }
            Buyer.updateBuyer(args,function(error, data){

                if(error){
                    response.json(error);
                }else{
                    response.json(resContent);
                    logger.info("get buyer response:" + JSON.stringify(resContent));
                }
            });
        });
    }catch(ex){
        logger.error("不能更新，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "更新个人信息失败";
        response.json(resContent);
    }
});

//获取用户积分
router.post('/scoreTotal', function(request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code:200};

    var param = request.body;
    var token = param.token || "鉴权信息1";
    var ppInfo = param.ppInfo || "鉴权信息2";
    var userId = param.userId || 1;

    var params = {};
    params.token = token;
    params.ppInfo = ppInfo;
    params.userId = userId;
    logger.info("请求参数信息" + JSON.stringify(params));

    try{
        Buyer.validAuth(params,function(err,data){
            if(err){
                //response.json(err);
                //return;
                /***************************测试数据*******************************/
                Score.getScore(params,function(error, data){
                    if(error){
                        response.json(error);
                    }else{
                        var score = data[0].score;
                        resContent.score = {userId:score.userId,amount:score.amount};
                        response.json(resContent);
                        logger.info("get buyer's Score response:" + JSON.stringify(resContent));
                    }
                });
                /******************************************************************/
            }
            Score.getScore(params,function(error, data){
                if(error){
                    response.json(error);
                }else{
                    var score = data[0].score;
                    resContent.score = {userId:score.userId,amount:score.amount};
                    response.json(resContent);
                    logger.info("get buyer's Score response:" + JSON.stringify(resContent));
                }
            });
        });
    }catch(ex){
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "获取用户积分失败，显示测试数据内容为：";
/*******************************测试数据*********************************/
        var score = new score_types.Score({
            userId:param.userId || "1",
            amount:"100"
        });
        resContent.score = score;
/*******************************测试数据*********************************/
        response.json(resContent);
    }
});

//获取积分列表
router.post('/scoreTrade', function(request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code:200};

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

    try{
        Buyer.validAuth(params,function(err,data){
            if(err){
                //response.json(err);
                //return;
                /***************************测试数据*******************************/
                Score.queryScoreTrade(params,function(error, data){
                    var dataArr = [];
                    if(error){
                        response.json(error);
                    }else{
                        var pagination = data[0].pagination;
                        resContent.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};

                        var scoreTrades = data[0].scoreTrades;
                        scoreTrades.forEach(function(a){
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
                /******************************************************************/
            }
            Score.queryScoreTrade(params,function(error, data){
                var dataArr = [];
                if(error){
                    response.json(error);
                }else{
                    var pagination = data[0].pagination;
                    resContent.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};

                    var scoreTrades = data[0].scoreTrades;
                    scoreTrades.forEach(function(a){
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
    }catch(ex){
        logger.error("获取失败，because: " + ex);
        resContent.code = 500;
        resContent.desc = "获取失败,显示测试数据内容为：";
/*******************************测试数据*********************************/

        var pagination = new pagination_types.Pagination();
        resContent.page = {
            total: pagination.totalCount || 20,
            pageCount:pagination.pageNumCount || 3,
            numPerPage: pagination.perCount || 7,
            currentPage:pagination.curPage || 1
        };
        var arr = [3];
        var scoreTrade = new score_types.ScoreTrade({
            userId: 2,
            type: 2,
            amount: 100,
            tradeId: "123",
            tradeTime: "2016-04-24 11:20:10",
            inOrPut: 2,
            trader: 2
        });
        arr[0] = scoreTrade;
        arr[1] = scoreTrade;
        arr[2] = scoreTrade;
        resContent.arr = arr;

/*******************************测试数据*********************************/
        response.json(resContent);
    }
});

//重置密码
router.post('/resetPwd',function(request,response,next){
    logger.info("进入重置密码接口...");

    var param = request.body;
    var mobile = param.mobile || "13558731842";
    var userId = param.userId || 2;
    var newPwd = param.newPwd || "AB123456";
    var captchaDesc = param.captchaDesc || "7LJG";
    var token = param.token || "鉴权信息1";
    var ppInfo = param.ppInfo || "鉴权信息2";

    var args = {};
    args.mobile = mobile;
    args.userId = userId;
    args.newPwd = newPwd;
    args.captchaDesc = captchaDesc;
    args.token = token;
    args.ppInfo = ppInfo;

    logger.info("参数为: " + JSON.stringify(args));

    async.waterfall([
        function (callback) {
            Common.validateMsgCaptcha(args, function (data) {
                if (data.result) {
                    callback(null);
                } else {
                    callback({failDesc:"验证码错误!"});
                }
            });
        },
        function (callback) {
            Buyer.newResetBuyerPwd(param, function (data) {
                logger.info("****************************");
                if (data.result) {
                    callback(null);
                } else {
                    callback({failDesc:"验证码错误!"});
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

//修改密码
router.post('/changePwd',function(request,response,next){
    logger.info("进入修改密码接口...");
    var result = {code:200};

    var param = request.body;
    var mobile = param.mobile || "13558731842";
    var userId = param.userId || 2;
    var newPwd = param.newPwd || "AB123456";
    var captchaDesc = param.captchaDesc || "7LJG";
    var token = param.token || "鉴权信息1";
    var ppInfo = param.ppInfo || "鉴权信息2";

    var args = {};
    args.mobile = mobile;
    args.userId = userId;
    args.newPwd = newPwd;
    args.captchaDesc = captchaDesc;
    args.token = token;
    args.ppInfo = ppInfo;

    logger.info("参数为: " + JSON.stringify(args));
    response.json(result);
});

module.exports = router;