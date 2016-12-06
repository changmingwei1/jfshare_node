/**
 * Created by changmingwei on 2016/11/21 1121.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
var async = require('async');
var Common = require('../lib/models/common');
var fs = require('fs');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var ThirdPay = require('../lib/models/thirdpay');


//查看记录
router.post('/thirdpaylist', function (request, response, next) {
    logger.info("进入第三方支付列表流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("thirdpaylist params:" + JSON.stringify(params));
        if (params.curPage == null || params.curPage == "" || params.curPage <= 0) {
            result.code = 500;
            result.desc = "当前页参数错误";
            response.json(result);
            return;
        }

        if (params.perCount == null || params.perCount == "" || params.perCount <= 0) {
            result.code = 500;
            result.desc = "每页条数参数错误";
            response.json(result);
            return;
        }

        ThirdPay.queryThirdPayApplyLog(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.LogList = data[0].LogList;
            var pagination = data[0].pagination;
            if(pagination!=null){
       /*         /!* 总记录数 *!/1:i32 totalCount, /!* 总页数 *!/2:i32 pageNumCount,/!* 每页记录数 *!/3:i32 numPerPage,/!* 当前页数 *!/4:i32 currentPage*/
                result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount,curPage: pagination.currentPage,perCount: pagination.numPerPage};
            }
            logger.info("thirdpaylist result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("获取第三方支付列表错误:" + ex);
        result.code = 500;
        result.desc = "获取第三方支付列表错误";
        response.json(result);
    }
});

//导出记录
router.post('/exprotThirdPayLog', function (request, response, next) {
    logger.info("进入导出第三方支付记录流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("exprotThirdPayLog params:" + JSON.stringify(params));

        ThirdPay.exprotThirdPayLog(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.path = data[0].path;
            logger.info("exprotThirdPayLog result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导出第三方支付记录错误:" + ex);
        result.code = 500;
        result.desc = "导出第三方支付记录错误";
        response.json(result);
    }
});

//申请支付
router.post('/thirdPayApply', function (request, response, next) {
    logger.info("进入申请支付流程");
    var result = {ErrCode: "0000"};
    try {
        var params = request.body;
        //参数校验
        logger.info("thirdPayApply params:" + JSON.stringify(params));
        if (params.requestXml == null || params.requestXml == "") {
            result.code = 500;
            result.desc = "参数为空";
            response.json(result);
            return;
        }

        ThirdPay.thirdPayApply(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.action = data[0].action;/*登陆页面URL*/
            result.encryptyParam = data[0].encryptyParam;/*加密参数*/
            result.ErrCode = data[0].ErrCode;/*响应码  0000-成功，9999失败*/
            result.ErrMsg = data[0].ErrMsg;/*响应消息*/

            logger.info("thirdPayApply result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("申请支付错误:" + ex);
        result.ErrCode = "9999";
        result.desc = "申请支付错误";
        response.json(result);
    }
});


//支付登陆
router.post('/thirdPayLogin', function (request, response, next) {
    logger.info("进入支付登陆流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("thirdPayLogin params:" + JSON.stringify(params));
        if (params.encryptyParam == null || params.encryptyParam == "") {/*加密缓存参数*/
            result.code = 500;
            result.desc = "加密参数为空";
            response.json(result);
            return;
        }if (params.clientType == null || params.clientType == "") {/*客户端标识   Android:1 Ios:2  H5:3 Web:4  */
            result.code = 500;
            result.desc = "客户端标识为空";
            response.json(result);
            return;
        }if (params.mobile == null || params.mobile == "") {/*手机号*/
            result.code = 500;
            result.desc = "手机号为空";
            response.json(result);
            return;
        }if (params.captchaDesc == null || params.captchaDesc == "") {
            resContent.code = 500;
            resContent.desc = "验证码不能为空";
            response.json(resContent);
            return;
        }
        async.waterfall([
            //验证短信验证码
            function (callback) {
                Common.validateMsgCaptcha(params, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            },
            //验证黑名单
            function (callback){
                fs.readFile('/data/run/jfshare_node/jfshare_buyer_proxy/limitMobile.txt','utf-8',function(err, data){
                    if(err){
                        callback(err);
                    } else {
                        var list = data.split("\n");
                        for(var i = 0; i<= list.length ;i++){
                            if(list[i] == params.mobile){
                                logger.info("这是一个标识！");
                                result.code = 500;
                                result.desc = "您的账户异常暂时不能登录，如有问题请联系客服400-800-2383";
                                return response.json(result);
                                break;
                            }
                        }
                        callback(null);
                    }
                });
            },
            //登陆验证
            function (callback) {
                ThirdPay.thirdPayLogin(params, function (err, data) {
                    if (err) {
                        response.json(err);
                        return;
                    }
                    result.userId = data[0].userId;/*用户ID*/
                    result.token = data[0].token;/*TOKEN*/
                    result.mobile = data[0].mobile;/*手机号*/
                    result.orderPrice = data[0].orderPrice;/*订单价格*/
                    result.ppInfo = data[0].ppInfo;/*PPINFO*/
                    logger.info("thirdPayLogin result:" + JSON.stringify(data));
                    response.json(result);
                    return;
                });
            }
        ], function (err) {
            if (err) {
                return response.json(err);
            } else {
                return response.json({result: true});
            }
        });
    } catch (ex) {
        logger.error("支付登陆失败，because :" + ex);
        result.code = 500;
        result.desc = "支付登陆失败";
        response.json(result);
    }
});


//积分抵扣
router.post('/thirdPay', function (request, response, next) {
    logger.info("进入积分抵扣流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("thirdPay params:" + JSON.stringify(params));
        if (params.encryptyParam == null || params.encryptyParam == "") {/*加密缓存参数*/
            result.code = 500;
            result.desc = "加密参数不能为空";
            response.json(result);
            return;
        }if (params.mobile == null || params.mobile == "") {/*手机号*/
            result.code = 500;
            result.desc = "手机号不能为空";
            response.json(result);
            return;
        }if (params.score == null || params.score == "") {/*抵扣积分*/
            result.code = 500;
            result.desc = "抵扣积分不能为空";
            response.json(result);
            return;
        }if (params.userId == null || params.userId == "") {/*用户ID*/
            result.code = 500;
            result.desc = "用户ID不能为空";
            response.json(result);
            return;
        }if (params.token == null || params.token == "") {/*TOKEN*/
            result.code = 500;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }

        ThirdPay.thirdPay(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            result.score = data[0].score;/*抵扣积分*/
            result.orderId = data[0].orderId;/*定好号*/
            result.urlFront = data[0].urlFront;/*回调地址*/
            logger.info("thirdPayLogin result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("积分抵扣错误:" + ex);
        result.code = 500;
        result.desc = "积分抵扣错误";
        response.json(result);
    }
});

//申请退款
router.post('/thirdPayRefund', function (request, response, next) {
    logger.info("进入申请退款流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("thirdPayRefund params:" + JSON.stringify(params));
        if (params.requestXml == null || params.requestXml == "") {
            result.code = 500;
            result.desc = "参数为空";
            response.json(result);
            return;
        }

        ThirdPay.thirdPayRefund(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.refundScore = data[0].refundScore;/*退款金额*/
            result.orderId = data[0].orderId;/*订单号*/
            result.ErrCode = data[0].ErrCode;/*响应码  0000-成功，9999失败*/
            result.ErrMsg = data[0].ErrMsg;/*响应消息*/

            logger.info("thirdPayRefund result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("申请退款错误:" + ex);
        result.code = 500;
        result.desc = "申请退款错误";
        response.json(result);
    }
});


//管理中心申请退款
router.post('/managerRefund', function (request, response, next) {
    logger.info("进入管理中心申请退款流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("managerRefund params:" + JSON.stringify(params));
        if (params.orderId == null || params.orderId == "") {
            result.code = 500;
            result.desc = "订单id为空";
            response.json(result);
            return;
        }
        if (params.pwd == null || params.pwd == "") {
            result.code = 500;
            result.desc = "密码为空";
            response.json(result);
            return;
        }

        ThirdPay.managerRefund(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.refundScore = data[0].refundScore;/*退款金额*/
            result.orderId = data[0].orderId;/*订单号*/

            logger.info("managerRefund result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("管理中心申请退款错误:" + ex);
        result.code = 500;
        result.desc = "管理中心申请退款错误";
        response.json(result);
    }
});

//订单查询
router.post('/getPayOrderInfo', function (request, response, next) {
    logger.info("进入订单查询流程");
    var result = {code: 200};
    try {
        var params = request.body;
        //参数校验
        logger.info("getPayOrderInfo params:" + JSON.stringify(params));
        if (params.requestXml == null || params.requestXml == "") {
            result.code = 500;
            result.desc = "参数为空";
            response.json(result);
            return;
        }

        ThirdPay.getPayOrderInfo(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.appcode = data[0].appcode;/*商家编号*/
            result.spid = data[0].spid;/*接入业务*/
            result.requestNo = data[0].requestNo;/*请求流水*/
            result.payScore = data[0].payScore;/*抵扣积分*/
            result.status = data[0].status;/*支付状态*/
            result.responseTime = data[0].responseTime;/*返回时间*/
            result.MsgCode = data[0].MsgCode;/*响应码  0000-成功，9999失败*/
            result.MsgContent = data[0].MsgContent;/*响应消息*/

            logger.info("getPayOrderInfo result:" + JSON.stringify(data));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("订单查询错误:" + ex);
        result.code = 500;
        result.desc = "订单查询错误";
        response.json(result);
    }
});

//暴露模块
module.exports = router;
