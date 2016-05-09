/**
 * Created by Administrator on 2016/5/8 0008.
 */
/**
 * Created by zhaoshenghai on 16/3/20.
 */

var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');


var order_types = require('../thrift/gen_code/order_types');


function Order() {
}

//订单列表
Order.prototype.orderProfileQuery = function (params, callback) {
    var orderQueryConditions = new order_types.OrderQueryConditions({
        orderState: params.orderState || 0,
        count: params.percount,
        curPage: params.curpage,
        startTime: params.startTime,
        endTime: params.endTime

    });
    logger.info("调用orderServ-orderProfileQuery  params:" + JSON.stringify(orderQueryConditions));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderProfileQuery", [1,65, orderQueryConditions]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-orderProfileQuery  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-orderProfileQuery失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询定单列表失败！";
            callback(res, null);
        } else {
            callback(null, data[0].orderProfilePage);
        }
    });
};
//订单详情
Order.prototype.queryOrderDetail = function (params, callback) {
    logger.info("调用orderServ-queryOrderDetail  params:" + JSON.stringify(params));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "queryOrderDetail", [params.userType, params.sellerId, params.orderId]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-queryOrderDetail  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-queryOrderDetail失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询定单明细失败！";
            callback(res, null);
        } else {
            callback(null, data[0].order);
        }
    });
};

//取消订单
Order.prototype.cancelOrder = function (params, callback) {
    /***
     *
     *
     * *result.Result cancelOrder(1:i32 userType, 2:i32 userId, 3:string orderId, 4:i32 reason)
     * @type {exports.OrderQueryConditions}
     *
     * /*取消订单(买家、系统)*/

    logger.info("调用orderServ-cancelOrder  params:" + JSON.stringify(orderQueryConditions));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "cancelOrder", [3, params.userId, params.orderId, params.reason]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-cancelOrder  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用orderServ-cancelOrder  失败原因 ======" + err);
            res.code = 500;
            res.desc = "取消订单失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};


//查询订单状态个数
Order.prototype.orderStateQuery = function (params, callback) {
    var orderQueryConditions = new order_types.OrderQueryConditions({
        sellerId: params.sellerId
    });

    logger.info("调用Order.orderStateQuery  params:" + JSON.stringify(orderQueryConditions));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderStateQuery", [2, params.sellerId, orderQueryConditions]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用Order.orderStateQuery  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用Order.orderStateQuery  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询订单状态失败！";
            callback(res, null);
        } else {
            callback(null, data[0].orderCountList);
        }
    });
};

//导出订单
Order.prototype.queryExportOrderInfo = function (params, callback) {
    var orderQueryConditions = new order_types.OrderQueryConditions({
        sellerId: params.sellerId
    });

    logger.info("调用Order.queryExportOrderInfo  params:" + JSON.stringify(orderQueryConditions));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "queryExportOrderInfo", [params.sellerId, orderQueryConditions]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用Order.queryExportOrderInfo  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用Order.queryExportOrderInfo  失败原因 ======" + err);
            res.code = 500;
            res.desc = "导出订单失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};
//更新物流单
/****
 *
 *
 *
 * 1:i32 sellerId, 2:string orderId, 3:string expressId, 4:string expressNo, 5:string expressName
 * @param params
 * @param callback
 */
Order.prototype.updateExpressInfo = function (params, callback) {
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "updateExpressInfo", [params.sellerId, params.orderId, params.expressId, params.expressNo, params.expressName]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用Order.updateExpressInfo  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用Order.updateExpressInfo  失败原因 ======" + err);
            res.code = 500;
            res.desc = "更新物流单失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};
//添加物流单
Order.prototype.deliver = function (params, callback) {
    var deliverInfo = new order_types.DeliverInfo({


        orderId: params.orderId,

        sellerComment: params.remark,


        expressId: params.expressId,
        expressName: params.expressName,
        expressNo: params.expressNo


    });
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "deliver", [params.sellerId, deliverInfo]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用Order.updateExpressInfo  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用Order.updateExpressInfo  失败原因 ======" + err);
            res.code = 500;
            res.desc = "更新物流单失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};
module.exports = new Order();