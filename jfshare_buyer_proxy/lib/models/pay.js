/**
 * @author YinBo on 16/4/24.
 */

var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var product_types = require("../thrift/gen_code/product_types");
var stock_types = require('../thrift/gen_code/stock_types');
var address_types = require('../thrift/gen_code/address_types');
var order_types = require('../thrift/gen_code/order_types');
var cart_types = require('../thrift/gen_code/cart_types');
var pay_types = require('../thrift/gen_code/pay_types');
var trade_types = require('../thrift/gen_code/trade_types');
var buyer_types = require('../thrift/gen_code/buyer_types');
var pay_types = require('../thrift/gen_code/pay_types');

function Pay(){}

/*生成支付请求*/
Pay.prototype.payUrl = function (param, callback) {
    var payReq = new pay_types.PayReq({
        tokenId:param.tokenId, /*支付令牌*/
        orderNo:param.orderNo,  /*请求方流水号*/
        extraParam:param.extraParam, /*请求方业务参数*/
        title:param.title, /*支付标题*/
        price:param.price, /*支付金额*/
        score:param.score, /*支付积分*/
        payChannel:param.payChannel, /*支付渠道*/
        payIp:param.payIp,   /*支付方IP地址*/
        returnUrl:param.returnUrl,  /*支付完跳转url*/
        remark:param.remark, /*备注*/
        custId:param.custId, /*第三方客户id*/
        custType:param.custType, /*第三方客户类型*/
        procustID:param.procustID /*第三方省份ID*/
    });

    logger.info("Order.prototype.payApply  param:" + JSON.stringify(payReq));

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payUrl", payReq);

    Lich.wicca.invokeClient(orderServ, function(err, data) {
        logger.info("call orderServ-payApply result:" + JSON.stringify(data[0]));
        var res = {};
        if(err || data[0].code == "1"){
            logger.error("调用orderServ-payApply失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "提交订单失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

/*接收第三方支付结果*/
Pay.prototype.payNotify = function (param, callback) {
    var payReq = new pay_types.PayRes({
        payChannel:param.payChannel, /*支付渠道*/
        resUrl:param.resUrl  /*支付返回结果*/
    });

    logger.info("Order.prototype.payApply  param:" + JSON.stringify(payReq));

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payUrl", payReq);

    Lich.wicca.invokeClient(orderServ, function(err, data) {
        logger.info("call orderServ-payApply result:" + JSON.stringify(data[0]));
        var res = {};
        if(err || data[0].code == "1"){
            logger.error("调用orderServ-payApply失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "提交订单失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

module.exports = new Pay();