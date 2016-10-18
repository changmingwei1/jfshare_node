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

//查询审核信息
AfterSale.prototype.queryAfterSale = function (params, callback) {

    var afterSaleQueryParam = null;
    if (params.orderIdList == null) {
        afterSaleQueryParam = new afterSale_types.AfterSaleQueryParam({
            userId: params.userId,
            sellerId: params.sellerId,
            orderId: params.orderId,
            productId: params.productId,
            skuNum: params.skuNum,
            orderIdList:[]
            //加上sku
        });
    } else {

        afterSaleQueryParam = new afterSale_types.AfterSaleQueryParam({
            orderIdList:params.orderIdList
        });
    }
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
        logger.error("查询审核信息失败！：" + ex);
        var res = {};
        res.code = 500;
        res.desc = "查询审核信息失败！";
        callback(res, null);
    }

};


//查询售后的订单list
AfterSale.prototype.queryAfterSaleOrderListBySellerId = function (params, callback) {

    var afterSaleQueryParam = new afterSale_types.AfterSaleOrderParam({
        sellerId: params.sellerId,
        userId: params.userId,
        orderId: params.orderId,
        startTime: params.startTime,
        endTime: params.endTime,
        fromSource: params.fromSource,
        payTimeStart: params.payTimeStart,
        payTimeEnd: params.payTimeEnd
    });

    var page = new pagination_types.Pagination({
        numPerPage: params.percount,
        currentPage: params.curpage
    });
    logger.info("AfterSaleServ-queryAfterSale  args:" + JSON.stringify(afterSaleQueryParam));

    var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "queryAfterSaleOrder", [afterSaleQueryParam, page]);

    Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
        logger.info("AfterSaleServ-queryAfterSaleOrderList  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("AfterSaleServ-queryAfterSaleOrderList  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询售后订单列表失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};
module.exports = new AfterSale();