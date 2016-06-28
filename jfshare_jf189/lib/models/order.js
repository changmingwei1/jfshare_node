/**
 * Created by Lenovo on 2015/11/19.
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var result_types = require("../thrift/gen_code/result_types");
var pay_types = require("../thrift/gen_code/pay_types");
var buyer_types = require("../thrift/gen_code/buyer_types");
var order_types = require("../thrift/gen_code/order_types");
var Lich = require('../thrift/Lich');
var thrift = require('thrift');

var async = require('async');

function Order() {}

/**
 * 买家查询订单列表
 * @param paramters
 * @param callback
 */
Order.prototype.listQuery = function(paramters, preRet, callback) {
    var queryParam = new order_types.OrderQueryConditions({
        count: paramters.count,
        curPage: paramters.curPage,
        orderState: paramters.orderTabState,
    });

    // 获取client
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderProfileQuery", [1, paramters.userId, queryParam]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        if (err) {
            logger.error("调用orderServ-orderProfileQuery查询买家订单列表失败  失败原因 ======" + err);
            var failDesc = new result_types.FailDesc({desc:"系统繁忙"});
            callback({result:false, failDesc:failDesc});
            return;
        }

        if (data[0].result.code == 1) {
            var failList = data[0].result.failDescList;
            logger.error("调用orderServ-orderProfileQuery查询买家订单列表失败  失败原因 ======" + JSON.stringify(failList));
            callback({result:false, failDesc:failList[0]});
            return;
        }

        logger.info("调用orderServ-orderProfileQuery查询买家订单列表成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        preRet.result = true;
        preRet.orderProfilePages = data[0].orderProfilePage;
        return callback(preRet);
    });
}

/**
 * 买家查询各状态订单数量
 * @param paramters
 * @param callback
 */
Order.prototype.stateCountQuery = function(paramters, preRet, callback) {
    var queryParam = new order_types.OrderQueryConditions({
        count: paramters.count,
        curPage: paramters.curPage,
        orderState: paramters.orderTabState,
    });

    // 获取client
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderStateQuery", [1, paramters.userId, queryParam]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        if (err) {
            logger.error("调用orderServ-orderStateQuery查询买家各状态订单数量失败  失败原因 ======" + err);
            var failDesc = new result_types.FailDesc({desc:"系统繁忙"});
            callback({result:false, failDesc:failDesc});
            return;
        }

        if (data[0].result.code == 1) {
            var failList = data[0].result.failDescList;
            logger.error("调用orderServ-orderStateQuery查询买家各状态订单数量失败  失败原因 ======" + JSON.stringify(failList));
            callback({result:false, failDesc:failList[0]});
            return;
        }

        logger.info("调用orderServ-orderStateQuery查询买家各状态订单数量成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        preRet.result = true;
        preRet.orderCountList = data[0].orderCountList;
        return callback(preRet);
    });
}

/**
 * 买家查询各状态订单数量
 * @param paramters
 * @param callback
 */
Order.prototype.detail = function(paramters, preRet, callback) {
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "queryOrderDetail", [1, paramters.userId, paramters.orderId]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-queryOrderDetail查询买家订单详情失败  失败原因 ======" + err);
            var failDesc = new result_types.FailDesc({desc:"系统繁忙"});
            preRet.result = false;
            preRet.failDesc = failDesc;
            return callback(preRet);
        }

        logger.info("调用orderServ-queryOrderDetail查询买家订单详情成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        //logger.info("接口返回数据=====" + data[0]);
        preRet.result = true;
        preRet.order = data[0].order;
        return callback(preRet);
    });
}

Order.prototype.payApply = function(params, req, mainCallback) {
    var ssid = params.ssid;
    var ret = {};
    async.waterfall([
        function (callback) {
            var userId = req.session.buyer.userId;
            var thirdType = "TY";
            var loginLog = new buyer_types.LoginLog({
                userId: userId,
            });

            // 获取client
            if (!req.session.loginStatus) {
                ret.status = 201;
                ret.msg = "验证第三方登录失败！";
                callback(ret, null);
                return;
            }
            var ExtInfo = JSON.parse(req.session.buyer.thirdInfo.extInfo);
            var parameters = {};
            parameters.userId = userId;
            parameters.orderIdList = params.orderIds;
            parameters.payChannel = 1;
            parameters.custId = ExtInfo.deviceNo;
            parameters.custType = ExtInfo.deviceType;
            parameters.procustID = ExtInfo.procustID;
            callback(null, parameters);

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
                if (err) {
                    logger.error("payApply ==> 调用orderServ-payApply申请支付失败  失败原因 ======err:" + err);
                    ret.status = 500;
                    ret.msg = "系统异常";
                    ret.fnc = "alert('"+ret.msg+"')";
                    return callback(ret, null);
                } else if(data[0].result.code == "1") {
                    logger.error("payApply ==> 调用orderServ-payApply申请支付失败  失败原因 ======rdata:"+JSON.stringify(data));
                    ret.status = 500;
                    try {
                        ret.msg = data[0].result.failDescList[0].desc;
                    } catch (e) {
                        ret.msg = "系统异常";
                    }
                    ret.fnc = "alert('"+ret.msg+"')";
                    return callback(ret, null);
                }
                logger.info("payApply ==> 调用orderServ-payApply申请支付成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
                var formInfo = JSON.parse(data[0].value);
                var payApplyFormStr = ''
                    +'<form id="payApplyForm" method="post" action="'+formInfo.action+'">'
                    +'<input type="hidden" name="requestXml" value="'+formInfo.requestXml+'">'
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
                + err.fnc
                + '</script>'
                + '</body></html>';
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
        mainCallback(resHtml);
    });
}

module.exports = new Order();
