/**
 * Created by Administrator on 2016/5/6 0006.
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var afterSale_types = require("../thrift/gen_code/afterSale_types");


function AfterSale() {
}

//售后审核
AfterSale.prototype.auditPass = function (params, callback) {

    var afterSale = new afterSale_types.AfterSale({
        userId: params.buyerId,
        sellerId: params.sellerId,
        orderId: params.orderId,
        productId: params.productId,
        type: params.type,//申请类型. 1:用户申请， 2:系统申请
        state: params.state, //根据实际情况定义 如 1：新建（待审核） 2：审核通过 3：审核不通过
        skuNum: params.skuNum
    });

    logger.info("AfterSaleServ-auditPass  args:" + JSON.stringify(afterSale));

    var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "auditPass", afterSale);

    Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
        logger.info("AfterSaleServ-auditPass  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("AfterSaleServ-auditPass  失败原因 ======" + err);
            res.code = 500;
            res.desc = "审核失败！";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//申请审核
AfterSale.prototype.request = function (params, callback) {
    var afterSale = new afterSale_types.AfterSale({
        userId: params.buyerId,
        sellerId: params.sellerId,
        orderId: params.orderId,
        productId: params.productId,
        type: 1,//申请类型. 1:用户申请， 2:系统申请
        state: 1, //根据实际情况定义 如 1：新建（待审核） 2：审核通过 3：审核不通过
        skuNum: params.skuNum
    });
    logger.info("AfterSaleServ-request  args:" + JSON.stringify(afterSale));

    var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "request", afterSale);

    Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
        logger.info("AfterSaleServ-request  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("AfterSaleServ-request  失败原因 ======" + err);
            res.code = 500;
            res.desc = "申请审核失败！";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
//查询审核信息
AfterSale.prototype.queryAfterSale = function (params, callback) {

    var afterSaleQueryParam = new afterSale_types.AfterSaleQueryParam({
        userId: params.userId,
        sellerId: params.sellerId,
        orderId: params.orderId,
        productId: params.productId,
        skuNum: params.skuNum
        //加上sku
    });
    logger.info("AfterSaleServ-queryAfterSale  args:" + JSON.stringify(afterSaleQueryParam));
    try {
        var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "queryAfterSale", afterSaleQueryParam);

        Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
            logger.info("AfterSaleServ-queryAfterSale  result:" + JSON.stringify(data));
            var res = {};
            if (err || data[0].result.code == "1") {
                logger.error("AfterSaleServ-queryAfterSale  失败原因 ======" + err);
                res.code = 500;
                res.desc = "查询审核信息失败！";
                callback(res, null);
            } else {
                callback(null, data[0].afterSaleList);
            }
        });
    } catch (ex) {
        res.code = 500;
        res.desc = "查询审核信息失败！";
        callback(res, null);
    }

};
module.exports = new AfterSale();