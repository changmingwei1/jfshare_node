/**
 * Created by zhaoshenghai on 16/3/20.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');

router.get('', function(req, res, next){
    var subjectId = req.query.id;

    Product.queryProductList({subjectId:subjectId}, function(data){
        var resContent = {code:200};
        var dataArr = [];

        var code = data[0].result.code;
        if(code == 1){
            resContent.code = 500;
            resContent.desc = "失败";
            res.json(resContent);
        } else {
            var productSurveyList = data[0].productSurveyList;
            productSurveyList.forEach(function(a){
                var imgUri = a.imgUrl.split(",")[0];
                dataArr.push({productId: a.productId, productName: a.productName, curPrice: a.curPrice, imgUrl: imgUri});
            });
            resContent.productList = dataArr;
            res.json(resContent);
        }
    });
});

router.get('/presonal', function(req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.query;
        logger.info("presonal arg:" + JSON.stringify(arg));

        if(arg == null || arg.userid == null) {
            result.code = 400;
            result.desc = "没有填写用户ＩＤ";
            res.json(result);
            return;
        }

        Product.getBuyerInfo(arg.userid, function(err, data) {
            if(err){
                res.json(err);
                return;
            }

            if(data !== null){
                result.personal = {nickname:data.userName || data.mobile};
            }

            var params = {};
            params.userId = arg.userid || null;
            //params.orderStatus = 0;
            params.percount = arg.percount || 20;
            params.curpage = arg.curpage || 1;
            params.userType = arg.userType || 1;

            Product.orderStateQuery(params, function(err, data) {
                if(err){
                    res.json(result);
                    return;
                }

                if(data !== null && data.length > 0){
                    var orderList = [];
                    for(var i in data){
                        orderList.push({
                            status: Product.getOrderStateBuyerEnum(data[i].orderState),
                            count: data[i].count
                        });
                    }
                    result.personal.order = orderList;
                }
                res.json(result);
            });
        });
    } catch (ex) {
        logger.error("presonal error:" + ex);
        result.code = 500;
        result.desc = "查询个人信息失败";
        res.json(result);
    }
});

// 获取短信
router.get('/sms', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.query;
        logger.info("send sms request:" + JSON.stringify(arg));
        if(arg == null || arg.mobile == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.sendMsgCaptcha(arg, function (err, data) {
            if(err){
                res.json(err);
                return;
            }

            res.json(result);
        });
    } catch (ex) {
        logger.error("get sms code error:" + ex);
        result.code = 500;
        result.desc = "获取短信验证码失败";
        res.json(result);
    }
});

// 登录(手机、验证码)
router.get('/login', function(req, res, next) {
    var result = {code: 200, userId: 34};

    try{
        var arg = req.query;
        logger.info("send sms request:" + JSON.stringify(arg));
        if(arg == null || arg.mobile == null || arg.smscode == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.validateMsgCaptcha(arg, function (err, data) {
            if(err){
                res.json(err);
                return;
            }

            Product.signinThirdParty(arg, function(err, buyerResult) {
                if(err){
                    res.json(err);
                    return;
                }

                if(buyerResult !== null && buyerResult.buyer !== null){
                    result.userId = buyerResult.buyer.userId;
                }

                res.json(result);
                logger.info("login response:" + JSON.stringify(result));
            });
        });
    } catch (ex) {
        logger.error("login error:" + ex);
        result.code = 500;
        result.desc = "登录失败";
        res.json(result);
    }
});

//登录（用户名、密码）
router.get('/login2', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.query;
        logger.info("登录请求参数:" + JSON.stringify(arg));
        if(arg == null || arg.mobile == null || arg.pwdEnc == null || arg.tokenId == null || arg.loginAuto == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Buyer.loginByNameAndPwd(arg, function (err, data) {
            if(err){
                res.json(err);
                return;
            }else{
                var userId = data[0].userId;
                result.userId = userId;
                res.json(result);
            }
        });
    } catch (ex) {
        logger.error("login error:" + ex);
        result.code = 500;
        result.desc = "登录失败";
        res.json(result);
    }
});

//注册
router.post('/singin', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("注册请求参数:" + JSON.stringify(arg));
        if(arg == null || arg.mobile == null || arg.pwdEnc == null || arg.id == null || arg.value == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Buyer.singin(arg, function (err, data) {
            if(err){
                res.json(err);
                return;
            }else{
                res.json(result);
            }
        });
    } catch (ex) {
        logger.error("login error:" + ex);
        result.code = 500;
        result.desc = "登录失败";
        res.json(result);
    }
});


router.get('/favicon.ico', function(req, res, next) {
    res.end();
});



module.exports = router;