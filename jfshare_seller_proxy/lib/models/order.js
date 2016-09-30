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
    var orderQueryConditions = "";
    if (params.orderList != null && params.orderList != "") {
        orderQueryConditions = new order_types.OrderQueryConditions({
            orderState: params.orderState || 0,
            startTime: params.startTime,
            endTime: params.endTime,
            payTimeStart: params.payTimeStart,
            payTimeEnd: params.payTimeEnd,
            orderIds: params.orderList,
            sellerId: params.sellerId,
            count: params.orderList.length,
            curPage: 1
        });
    } else {
        orderQueryConditions = new order_types.OrderQueryConditions({
            orderState: params.orderState || 0,
            count: params.percount,
            curPage: params.curpage,
            startTime: params.startTime,
            payTimeStart: params.payTimeStart,
            payTimeEnd: params.payTimeEnd,
            endTime: params.endTime,
            sellerId: params.sellerId,
            orderId: params.orderId,
            userId: params.userId
        });
    }

    logger.info("调用orderServ-orderProfileQuery  params:" + JSON.stringify(orderQueryConditions) + "sellerId--------->" + params.sellerId);
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderProfileQuery", [2, params.sellerId, orderQueryConditions]);

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
//订单状态数量查询 --还需要查询退货中的订单状态
Order.prototype.orderStateQuery = function (param, callback) {
    var orderQueryConditions = new order_types.OrderQueryConditions({count: param.percount, curPage: param.curpage});
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderStateQuery", [param.userType, param.userId, orderQueryConditions]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-orderStateQuery  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-orderStateQuery失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询定单列表失败！";
            callback(res, null);
        } else {
            callback(null, data[0].orderCountList);
        }
    });
};
//订单详情
Order.prototype.queryOrderDetail = function (param, callback) {

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "queryOrderDetail", [2, param.sellerId, param.orderId]);

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

//查询卖家交易流水
Order.prototype.querydealList = function (param, callback) {
    //------------------
    logger.info("调用orderServ-querydealList  入参:" + JSON.stringify(param));
    var orderQueryConditions = new order_types.OrderQueryConditions({
       // sellerId:param.sellerId,
        count: param.perCount,
        curPage: param.curPage,
        payTimeStart: param.date,
        payTimeEnd: param.endDate
    });

    logger.info("调用orderServ-querydealList  入参:" + JSON.stringify(orderQueryConditions));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderProfileQueryOffline", [2, param.sellerId, orderQueryConditions]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-querydealList  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-querydealList失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询交易流水失败！";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//查询卖家交易明细
Order.prototype.querydealDetail = function (param, callback) {
    //------------------

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "queryOrderDetailOffline", [2, param.sellerId, param.productDetId]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-querydealDetail  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-querydealDetail失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询交易明细失败！";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//扫码预生成订单
Order.prototype.payOrderCreates = function (param, callback) {
    //------------------

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "payOrderCreates", [2, param.sellerId, param.orderId]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-payOrderCreates  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-payOrderCreates  失败原因 ======" + err);
            res.code = 500;
            res.desc = "扫码预生成订单失败！";
            callback(res, null);
        } else {
            callback(null, data[0].order);
        }
    });
};

//导出订单
Order.prototype.batchExportOrder = function (params, callback) {
    var orderQueryConditions = new order_types.OrderQueryConditions({
        startTime: params.startTime,
        endTime: params.endTime,
        orderState: params.orderState || 0,
        orderId:params.orderId
    });

    logger.info("调用orderServ-queryExportOrderInfo  params:" + JSON.stringify(orderQueryConditions) + "-----sellerId---->" + params.sellerId);
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "batchExportOrder", [params.sellerId, orderQueryConditions]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-queryExportOrderInfo  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-queryExportOrderInfo  失败原因 ======" + err);
            res.code = 500;
            res.desc = "导出订单失败！";
            callback(res, null);
        } else {
            callback(null, data[0].value);
        }
    });
};

/*提交订单*/
Order.prototype.orderConfirm = function (arg, callback) {

    var sellerDetailList = [];
    for (var i = 0; i < arg.sellerDetailList.length; i++) {
        sellerDetailList.push(new trade_types.BuySellerDetail({
            sellerId: arg.sellerDetailList[i].sellerId,
            sellerName: arg.sellerDetailList[i].sellerName,
        }));
    }

    var param = new trade_types.BuyInfo({
        userId: arg.userId,
        userName: arg.userName,
        amount: arg.totalSum,
        //payChannel: new pay_types.PayChannel({payChannel:arg.payChannel}),
        //deliverInfo: deliverInfo,
        sellerDetailList: sellerDetailList,
        //fromBatch: arg.fromBatch,
        //fromSource: arg.fromSource,
        tradeCode: arg.tradeCode
        /*weight: arg.weight,
         postageExt:arg.postageExt*/ /*运费扩展信息  JSON 现在还不知道怎么用*/
    });

    logger.info("调用cartServ-orderConfirmOffline args:" + JSON.stringify(param));
    var tradeServ = new Lich.InvokeBag(Lich.ServiceKey.TradeServer, "orderConfirmOffline", param);

    Lich.wicca.invokeClient(tradeServ, function (err, data) {
        logger.info("调用cartServ-orderConfirmOffline result:" + JSON.stringify(data[0]));
        var res = {};
        if (err) {
            logger.error("调用cartServ-orderConfirmOffline失败  失败原因 ======" + err);
            //logger.error("错误信息:" + JSON.stringify(data[0].result));
            res.code = 500;
            res.desc = "提交订单失败！";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        }
        else {
            logger.info("orderConfirmOffline response:" + JSON.stringify(data[0]));
            callback(null, data);
        }
    });
};

//BatchDeliverResult batchDeliverOrder(1:i32 sellerId, 2:BatchDeliverParam param);


//批量发货
Order.prototype.batchDeliverOrder = function (params, callback) {
    var batchDeliverParam = new order_types.BatchDeliverParam({
        orderList: params.list
    });
    logger.info("调用orderServ-batchDeliverParam  params:" + JSON.stringify(batchDeliverParam));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "batchDeliverOrder", [params.sellerId, batchDeliverParam]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-batchDeliverParam  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-batchDeliverParam  失败原因 ======" + err +"返回的数据是"+JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].failInfo;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


Order.prototype.downLoad = function (params, callback) {
    var http = require('follow-redirects').http;
    var fs = require('fs');
    var url = require('url');
    var html = '/data/run/jfshare_node/jfshare_seller_proxy/excel/excel.xlsx';
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
            logger.error("调用orderServ-deliver  失败原因 ======" + err +"返回的数据是"+JSON.stringify(data));
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
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "updateDeliverInfo", [2, params.sellerId,deliverInfo]);

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


module.exports = new Order();