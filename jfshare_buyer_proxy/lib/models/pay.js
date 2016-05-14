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

/*����֧������*/
Pay.prototype.payUrl = function (param, callback) {
    var payReq = new pay_types.PayReq({
        tokenId:param.tokenId, /*֧������*/
        orderNo:param.orderNo,  /*������ˮ��*/
        extraParam:param.extraParam, /*����ҵ�����*/
        title:param.title, /*֧������*/
        price:param.price, /*֧�����*/
        score:param.score, /*֧������*/
        payChannel:param.payChannel, /*֧������*/
        payIp:param.payIp,   /*֧����IP��ַ*/
        returnUrl:param.returnUrl,  /*֧������תurl*/
        remark:param.remark, /*��ע*/
        custId:param.custId, /*�������ͻ�id*/
        custType:param.custType, /*�������ͻ�����*/
        procustID:param.procustID /*������ʡ��ID*/
    });

    logger.info("Order.prototype.payApply  param:" + JSON.stringify(payReq));

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payUrl", payReq);

    Lich.wicca.invokeClient(orderServ, function(err, data) {
        logger.info("call orderServ-payApply result:" + JSON.stringify(data[0]));
        var res = {};
        if(err || data[0].code == "1"){
            logger.error("����orderServ-payApplyʧ��  ʧ��ԭ�� ======" + err);
            res.code = 500;
            res.desc = "�ύ����ʧ�ܣ�";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

/*���յ�����֧�����*/
Pay.prototype.payNotify = function (param, callback) {
    var payReq = new pay_types.PayRes({
        payChannel:param.payChannel, /*֧������*/
        resUrl:param.resUrl  /*֧�����ؽ��*/
    });

    logger.info("Order.prototype.payApply  param:" + JSON.stringify(payReq));

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.PayServer, "payUrl", payReq);

    Lich.wicca.invokeClient(orderServ, function(err, data) {
        logger.info("call orderServ-payApply result:" + JSON.stringify(data[0]));
        var res = {};
        if(err || data[0].code == "1"){
            logger.error("����orderServ-payApplyʧ��  ʧ��ԭ�� ======" + err);
            res.code = 500;
            res.desc = "�ύ����ʧ�ܣ�";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

module.exports = new Pay();