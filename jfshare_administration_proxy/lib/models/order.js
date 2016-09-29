/**
 * Created by Administrator on 2016/5/5 0005.
 */


var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

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
var common_types = require('../thrift/gen_code/common_types');
//var express_types = require('../thrift/gen_code/express_types');

function Order() {
}

//订单列表
Order.prototype.orderProfileQuery = function (params, callback) {
    logger.error("调用o参数 ======" +JSON.stringify(params) );
    var orderQueryConditions = {};
    if (params.orderList != null && params.orderList != "") {
        orderQueryConditions = new order_types.OrderQueryConditions({
            orderState: params.orderStatus || 0,
            startTime: params.startTime,
            endTime: params.endTime,
            orderIds: params.orderList,
            sellerId: params.sellerId,
            sellerIds:params.sellerIds,
            payTimeStart: params.payTimeStart,
            payTimeEnd: params.payTimeEnd,
            //orderId: params.orderId,
            fromSource: params.fromSource||0,
            count: params.orderList.length,
            curPage: 1
        });

    }else if(params.orderId != null && params.orderId != ""){
        orderQueryConditions = new order_types.OrderQueryConditions({
            orderId: params.orderId
        });
    }else if(params.userId != null && params.userId != ""){
        orderQueryConditions = new order_types.OrderQueryConditions({
            userId: params.userId
        });
    }else {
        orderQueryConditions = new order_types.OrderQueryConditions({
            orderState: params.orderStatus || 0,
            count: params.percount,
            curPage: params.curpage,
            startTime: params.startTime,
            endTime: params.endTime,
            payTimeStart: params.payTimeStart,
            payTimeEnd: params.payTimeEnd,
            sellerId: params.sellerId,
            sellerIds:params.sellerIds,
            orderId: params.orderId,
            fromSource: params.fromSource||0,
            userId: params.userId
        });
    }

    logger.info("调用orderServ-orderProfileQueryFull  params:" + JSON.stringify(orderQueryConditions));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderProfileQueryFull", [orderQueryConditions]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-orderProfileQueryFull  result:" + JSON.stringify(data));
        logger.info("调用orderServ-orderProfileQueryFull  失败原因 ======" + err);
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-orderProfileQueryFull  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询订单列表失败！";
            callback(res, null);
        } else {
            callback(null, data[0].orderProfilePage);
        }
    });
};

//订单状态数量查询 --还需要查询退货中的订单状态
Order.prototype.orderStateQuery = function (params, callback) {


    var orderQueryConditions = new order_types.OrderQueryConditions({
        orderState:30,
        count: 1,
        curPage: 1,
        startTime: params.startTime,
        endTime: params.endTime,
        sellerId: params.sellerId
    });


    logger.info("调用orderServ-orderProfileQueryFull  result:" + JSON.stringify(orderQueryConditions));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderProfileQueryFull", [orderQueryConditions]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-orderProfileQueryFull  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-orderProfileQueryFull  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询订单列表失败！";
            callback(res, null);
        } else {
            //orderProfilePage.total
            if(data[0]!=null &&data[0].orderProfilePage!=null &&data[0].orderProfilePage.total!=null){

                callback(null, data[0].orderProfilePage.total);

            }else{

                callback(null,0);
            }

        }
    });
};

//订单详情
Order.prototype.queryOrderDetail = function (param, callback) {
    logger.info("调用orderServ-queryOrderDetail  param:" + JSON.stringify(param));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "queryOrderDetail", [param.userType, param.sellerId, param.orderId]);

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
//	result.Result cancelOrder(1:i32 userType, 2:i32 userId, 3:string orderId, 4:i32 reason)

//取消订单
Order.prototype.cancelOrder = function (param, callback) {
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "cancelOrder", [3, param.userId, param.orderId, param.account]);
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
//	result.Result deliver(1:i32 sellerId, 2:DeliverInfo deliverInfo)

//发货，其实就是添加物流单
Order.prototype.deliver = function (params, callback) {

    var deliverInfo = new order_types.DeliverInfo({
        orderId: params.orderId,
        sellerComment: params.remark,
        expressId: params.expressId,
        expressName: params.expressName,
        expressNo: params.expressNo,
        userId: params.userId
    });
    logger.info("调用orderServ-deliver  params:" + JSON.stringify(deliverInfo));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "deliver", [params.sellerId, deliverInfo]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-deliver  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用orderServ-deliver  失败原因 ======" + err);
            res.code = 500;
            res.desc = "发货失败！";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//result.Result updateExpressInfo(1:i32 sellerId, 2:string orderId, 3:string expressId, 4:string expressNo, 5:string expressName)

//更新物流单
Order.prototype.updateExpressInfo = function (params, callback) {
    var deliverInfo = new order_types.DeliverInfo({
        orderId: params.orderId,
        sellerComment: params.remark,
        expressId: params.expressId,
        expressName: params.expressName,
        expressNo: params.expressNo
    });
    //params.orderId, params.expressId, params.expressNo, params.expressName
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "updateDeliverInfo", [2, params.sellerId, deliverInfo]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-updateExpressInfo  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用orderServ-updateExpressInfo  失败原因 ======" + err);
            res.code = 500;
            res.desc = "更新物流单失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//导出订单
Order.prototype.batchExportOrderFull = function (params, callback) {
    var orderQueryConditions = new order_types.OrderQueryConditions({
        startTime: params.startTime,
        endTime: params.endTime,
        orderState: params.orderState || 0,
        sellerId: params.sellerId,
        orderId:params.orderId
    });
    logger.info("调用orderServ-queryExportOrderInfo  params:" + JSON.stringify(orderQueryConditions));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "batchExportOrderFull", [orderQueryConditions]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-batchExportOrderFull  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-batchExportOrderFull  失败原因 ======" + err + JSON.stringify(data));
            res.code = 500;
            res.desc = "导出订单失败！";
            callback(res, null);
        } else {
            callback(null, data[0].value);
        }
    });
};

//查询导出 订单的结果
Order.prototype.getExportOrderResult = function (params, callback) {

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "getExportOrderResult", [params.queryKey]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-getExportOrderResult  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-getExportOrderResult  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询导出结果失败！";
            callback(res, null);
        } else {
            callback(null, data[0].value);
        }
    });
};

//批量发货 --管理中心
Order.prototype.batchDeliverOrderForManager = function (params, callback) {

    var iList = [];
    var list = params.list;
    if(list != null && list.length > 0){
        for(var i = 0; i < list.length ;i++){
            var sellerBatch =  new order_types.SellerBatchDeliverParam({
                sellerId:list[i].sellerId,
                order:list[i].order
            });
            iList.push(sellerBatch);
        }
    }
    logger.info("调用orderServ-batchDeliverParam  params:" + JSON.stringify(iList));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "batchDeliverOrderForManager", [iList]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-batchDeliverParam  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("调用orderServ-batchDeliverParam  失败原因 ======" + err +"返回的数据是"+JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].failInfo;
            callback(res, null);
        } else if (data[0].result.code == "1") {
            logger.warn("调用orderServ-batchDeliverParam  失败原因 ======" + err +"返回的数据是"+JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].failInfo;
            callback(res, null);
        }else{
            callback(null, data);
        }
    });
};


Order.prototype.downLoad = function (params, callback) {
    var http = require('follow-redirects').http;
    var fs = require('fs');
    var url = require('url');
    //var html = '/data/run/jfshare_node/jfshare_administration_proxy/excel/excel.xlsx';
    var html = 'C:/jfshare_node/jfshare_administration_proxy/excel/excel.xlsx';
    var file = fs.createWriteStream(html);//将文件流写入文件
    var datas = "";
    try {
        http.get(params.path, function (res) {
            res.on('data', function (data) {
                file.write(data);
            }).on('end', function () {
                file.end();
                callback(null, '');
            });
        });
    } catch (ex) {
        logger.error("解析物流单出错"+ex);
    }

};

module.exports = new Order();