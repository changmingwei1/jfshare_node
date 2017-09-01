/**
 * @auther chiwenheng  0909
 *
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var batchCards_types = require("../thrift/gen_code/batchCards_types");

function Coupon(){}
//商户订单
Coupon.prototype.chinaMobileNotifyOrder = function (params, callback) {
    logger.info("chinaMobileNotifyOrder >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.scoreCardSer, 'chinaMobileNotifyOrder', [params.req]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("chinaMobileNotifyOrder result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("chinaMobileNotifyOrder because: ======" + err);
            res.code = "1014";
            res.desc = "商户订单失败";
            callback(res, null);
        }else{
            res.code = "0";
            callback(null, data);
        }
    });
};
//重新发虚拟码
Coupon.prototype.resendVirtualCode = function (params, callback) {
    logger.error("resendVirtualCode >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.scoreCardSer, 'resendVirtualCode', [params.req]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("resendVirtualCode result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("resendVirtualCode because: ======" + err);
            res.code = "1014";
            res.desc = "重发虚拟码失败";
            callback(res, null);
        }else{
            res.code = "0";
            callback(null, data);
        }
    });
};

//设置虚拟码失效接口
Coupon.prototype.setCodeInvalid = function (params, callback) {
    logger.error("setCodeInvalid >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.scoreCardSer, 'setCodeInvalid', [params.req]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("setCodeInvalid result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("setCodeInvalid because: ======" + err);
            res.code = "1014";
            res.desc = "设置虚拟码失效失败";
            callback(res, null);
        }else{
            res.code = "0";
            callback(null, data);
        }
    });
};
/**
 * 创建抵扣券活动
 */
Coupon.prototype.createDiscountActiv = function (params, callback) {
    logger.info("createDiscountActiv >>>>>>>>>>>  " + JSON.stringify(params));
    var discountActiv = new batchCards_types.DiscountActiv({
        source:params.source,
        name:params.name,
        value:params.value,
        couponNum:params.couponNum,
        startTime:params.startTime,
        endTime:params.endTime,
        scope:params.scope,
        scopeList:params.scopeList
    });
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.scoreCardSer, 'createDiscountActiv', [discountActiv]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("setCodeInvalid result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("setCodeInvalid because: ======" + err);
            res.code = "1014";
            res.msg = "创建抵扣券活动失败";
            callback(res, null);
        }else{
            res.code = "0";
            callback(null, data);
        }
    });
};
/**
 * 绑定抵扣券
 */
Coupon.prototype.bindingCoupon = function (params, callback) {
    logger.info("bindingCoupon >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.scoreCardSer, 'bindingPhoneByCouponId', [params.userId,params.loginName,params.couponId]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("setCodeInvalid result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("setCodeInvalid because: ======" + err);
            res.code = "1014";
            res.msg = "绑定抵扣券失败";
            callback(res, null);
        }else{
            res.code = "0";
            callback(null, data);
        }
    });
};
/**
 *查询抵扣券列表
 */
Coupon.prototype.discountList = function (params, callback) {
    logger.error("discountList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.scoreCardSer, 'queryCouponListByUserId', [params.userId]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("discountList result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("discountList because: ======" + err);
            res.code = "1014";
            res.msg = "查询抵扣券列表失败";
            callback(res, null);
        }else{
            res.code = "0";
            callback(null, data);
        }
    });
};
module.exports = new Coupon();