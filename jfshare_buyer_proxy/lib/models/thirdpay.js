/**
 * Created by changmingwei on 2016/11/21.
 */
var log4node = require('../../log4node');
var Lich = require('../thrift/Lich.js');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);
var pagination_types = require('../thrift/gen_code/pagination_types');
var thirdpay_types = require("../thrift/gen_code/thirdpay_types");

function ThirdPay() {
}

//查询记录
ThirdPay.prototype.queryThirdPayApplyLog = function (params, callback) {
    var queryThirdPayApplyLogParam = new thirdpay_types.QueryThirdPayApplyLogParam({
        startTime:params.startTime,/*开始时间*/
        endTime:params.endTime,/*结束时间*/
        timeType:params.timeType,/*时间类型  1:支付时间  2：退款时间*/
        status:params.status, /*支付状态*/
        orderId:params.orderId,/*商家订单号*/
        thirdPayId:params.thirdPayId,/*支付流水号*/
        payAccount:params.payAccount,/*支付账号*/
        sellerId:params.sellerId,/*商家ID*/
    });
    var pagination = new pagination_types.Pagination({

        currentPage: params.curPage, /* 当前页数 *!/4:i32 currentPage*/
        numPerPage: params.perCount /* 每页记录数 *!/3:i32 numPerPage,*/
    });


    logger.info("请求参数param :" + JSON.stringify(queryThirdPayApplyLogParam));
    //获取客户端
    var thirdpayServ = new Lich.InvokeBag(Lich.ServiceKey.ThirdPayServer, 'queryThirdPayApplyLog', [queryThirdPayApplyLogParam,pagination]);
    Lich.wicca.invokeClient(thirdpayServ, function (err, data) {
        logger.info("thirdpayServ.queryThirdPayApplyLog result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("thirdpayServ.queryThirdPayApplyLog because: ======" + err);
            res.code = 500;
            res.desc = "查询第三方支付记录错误";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//申请支付
ThirdPay.prototype.thirdPayApply = function (params, callback) {
    //获取客户端
    var thirdpayServ = new Lich.InvokeBag(Lich.ServiceKey.ThirdPayServer, 'thirdPayApply', [params.requestXml]);
    Lich.wicca.invokeClient(thirdpayServ, function (err, data) {
        logger.info("thirdpayServ.thirdPayApply result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("thirdpayServ.thirdPayApply because: ======" + err);
            res.ErrCode = "9999";/*响应码  0000-成功，9999失败*/
            res.ErrMsg = data[0].result.failDescList[0].desc;/*响应消息*/
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//导出记录
ThirdPay.prototype.exprotThirdPayLog = function (params, callback) {
    var exprotParam = new thirdpay_types.ExprotParam({
        startTime:params.startTime,/*开始时间*/
        endTime:params.endTime,/*结束时间*/
        timeType:params.timeType,/*时间类型  1:支付时间  2：退款时间*/
        status:params.status, /*支付状态*/
        orderId:params.orderId,/*商家订单号*/
        thirdPayId:params.thirdPayId,/*支付流水号*/
        payAccount:params.payAccount,/*支付账号*/
        sellerId:params.sellerId,/*商家ID*/
    });


    logger.info("请求参数param :" + JSON.stringify(exprotParam));
    //获取客户端
    var thirdpayServ = new Lich.InvokeBag(Lich.ServiceKey.ThirdPayServer, 'exprotThirdPayLog', [exprotParam]);
    Lich.wicca.invokeClient(thirdpayServ, function (err, data) {
        logger.info("thirdpayServ.exprotThirdPayLog result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("thirdpayServ.exprotThirdPayLog because: ======" + err);
            res.code = 500;
            res.desc = "导出第三方支付记录错误";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//支付登陆
ThirdPay.prototype.thirdPayLogin = function (params, callback) {
    var tThirdPayLoginParam = new thirdpay_types.ThirdPayLoginParam({
        mobile:params.mobile,/*手机号*/
        clientType:params.clientType,/*客户端标识*/
        encryptyParam:params.encryptyParam,/*加密参数*/

    });

    //获取客户端
    var thirdpayServ = new Lich.InvokeBag(Lich.ServiceKey.ThirdPayServer, 'thirdPayLogin', [tThirdPayLoginParam]);
    Lich.wicca.invokeClient(thirdpayServ, function (err, data) {
        logger.info("thirdpayServ.thirdPayLogin result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("thirdpayServ.thirdPayLogin because: ======" + err);
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;/*响应消息*/
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//积分抵扣
ThirdPay.prototype.thirdPay = function (params, callback) {
    var thirdPayParam = new thirdpay_types.ThirdPayParam({
        mobile:params.mobile,/*手机号*/
        userId:params.userId,/*用户ID*/
        score:params.score,/*抵扣积分*/
        encryptyParam:params.encryptyParam,/*加密参数*/

    });

    //获取客户端
    var thirdpayServ = new Lich.InvokeBag(Lich.ServiceKey.ThirdPayServer, 'thirdPay', [thirdPayParam]);
    Lich.wicca.invokeClient(thirdpayServ, function (err, data) {
        logger.info("thirdpayServ.thirdPay result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("thirdpayServ.thirdPay err: ======" + err);
            res.code = data[0].result.failDescList[0].failCode;/*响应编码*/
            res.desc =data[0].result.failDescList[0].desc;/*响应消息*/
            logger.error("thirdpayServ.thirdPay res: ======" + res);
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//申请退款
ThirdPay.prototype.thirdPayRefund = function (params, callback) {
    //获取客户端
    var thirdpayServ = new Lich.InvokeBag(Lich.ServiceKey.ThirdPayServer, 'thirdPayRefund', [params.requestXml]);
    Lich.wicca.invokeClient(thirdpayServ, function (err, data) {
        logger.info("thirdpayServ.thirdPayRefund result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("thirdpayServ.thirdPayRefund because: ======" + err);
            res.ErrCode = "9999";/*响应码  0000-成功，9999失败*/
            res.ErrMsg = data[0].result.failDescList[0].desc;/*响应消息*/
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//管理中心申请退款
ThirdPay.prototype.managerRefund = function (params, callback) {
    var managerRefundParam = new thirdpay_types.ManagerRefundParam({
        orderId:params.orderId,/*订单id*/
        pwd:params.pwd,/*密码*/
    });
    //获取客户端
    var thirdpayServ = new Lich.InvokeBag(Lich.ServiceKey.ThirdPayServer, 'managerRefund', [managerRefundParam]);
    Lich.wicca.invokeClient(thirdpayServ, function (err, data) {
        logger.info("thirdpayServ.managerRefund result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("thirdpayServ.managerRefund because: ======" + err);
            res.code = 500;
            res.desc = "申请退款失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//订单查询
ThirdPay.prototype.getPayOrderInfo = function (params, callback) {
    //获取客户端
    var thirdpayServ = new Lich.InvokeBag(Lich.ServiceKey.ThirdPayServer, 'getPayOrderInfo', [params.requestXml]);
    Lich.wicca.invokeClient(thirdpayServ, function (err, data) {
        logger.info("thirdpayServ.getPayOrderInfo result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("thirdpayServ.getPayOrderInfo because: ======" + err);
            res.ErrCode = "9999";/*响应码  0000-成功，9999失败*/
            res.ErrMsg = data[0].result.failDescList[0].desc;/*响应消息*/
            callback(res, null);
        } else {
            callback(null, data);

        }
    });
};
module.exports = new ThirdPay();