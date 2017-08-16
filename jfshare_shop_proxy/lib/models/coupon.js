/**
 * @auther chiwenheng  0909
 *
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var fileUpload_types = require("../thrift/gen_code/fileUpload_types");

function Coupon(){}
//商户订单
Coupon.prototype.chinaMobileNotifyOrder = function (params, callback) {
    logger.info("chinaMobileNotifyOrder >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'chinaMobileNotifyOrder', [params.req]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("chinaMobileNotifyOrder result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("chinaMobileNotifyOrder because: ======" + err);
            res.code = 500;
            res.desc = "商户订单失败";
            callback(res, null);
        }else{
            res.code = 200;
            callback(null, data);
        }
    });
};
//重新发虚拟码
Coupon.prototype.resendVirtualCode = function (params, callback) {
    logger.error("resendVirtualCode >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'resendVirtualCode', [params.req]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("resendVirtualCode result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("resendVirtualCode because: ======" + err);
            res.code = 500;
            res.desc = "重发虚拟码失败";
            callback(res, null);
        }else{
            res.code = 200;
            callback(null, data);
        }
    });
};

//设置虚拟码失效接口
Coupon.prototype.setCodeInvalid = function (params, callback) {
    logger.error("setCodeInvalid >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'setCodeInvalid', [params.req]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("setCodeInvalid result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("setCodeInvalid because: ======" + err);
            res.code = 500;
            res.desc = "设置虚拟码失效失败";
            callback(res, null);
        }else{
            res.code = 200;
            callback(null, data);
        }
    });
};
module.exports = new Coupon();