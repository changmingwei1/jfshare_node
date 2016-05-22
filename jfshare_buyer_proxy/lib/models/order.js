/**
 * @author YinBo on 16/4/24.
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

function Order() {}

/*查询订单列表*/
Order.prototype.orderProfileQuery = function (param, callback) {

    var orderQueryConditions;
    if (param.orderList != null) {
        orderQueryConditions = new order_types.OrderQueryConditions({
            orderIds: param.orderList
        });
    } else {
        orderQueryConditions = new order_types.OrderQueryConditions({
            count: param.perCount,
            curPage: param.curPage,
            orderState: param.orderState,
            startTime: param.startTime,
            endTime: param.endTime,
            orderId: param.orderId
        });
    }

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderProfileQuery", [1, param.userId, orderQueryConditions]);

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

/*查询各订单状态的数量*/
Order.prototype.orderStateQuery = function (param, callback) {
    var orderQueryConditions = new order_types.OrderQueryConditions({count: param.percount, curPage: param.curpage});
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderStateQuery", [1, param.userId, orderQueryConditions]);

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

/*查询订单详情*/
Order.prototype.queryOrderDetail = function (param, callback) {

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "queryOrderDetail", [1, param.userId, param.orderId]);

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

/*立即付款*/
Order.prototype.payApply = function (param, callback) {
    logger.info("Product.prototype.payApply  param:" + JSON.stringify(param));
    var pay = {payChannel: param.payChannel};
    if (param.payChannel == 4) {
        pay.custId = param.openId;
    }
    var payChannel = new pay_types.PayChannel(pay);

    var payParam = new order_types.PayParam({
        userId: param.userId,
        orderIdList: param.orderIdList,
        payChannel: payChannel
    });

    logger.info("call orderServ-payApply args:" + JSON.stringify(payParam));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "payApply", payParam);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("call orderServ-payApply result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("调用orderServ-payApply失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "提交订单失败！";
            callback(res, null);
        } else if(data[0].result.code == 1){
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        }else{
            callback(null, data[0]);
        }
    });
};

/*查询支付状态*/
Order.prototype.payState = function (param, callback) {

    var statePara = new order_types.PayState({
        payId: param.payId
    });

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "payState", statePara);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("call orderSer-payState result:" + JSON.stringify(data));
        if (err || data[0] == '1') {
            var res = {};
            res.code = 500;
            res.desc = "查询订单状态失败！";
            callback(res, null);
        } else {
            callback(null, data[0].payState);
        }
    });
};

/*提交订单*/
Order.prototype.orderConfirm = function (arg, callback) {

    var sellerDetailList = [];
    for (var i = 0; i < arg.sellerDetailList.length; i++) {
        var productList = [];
        for (var j = 0; j < arg.sellerDetailList[i].productList.length; j++) {
            var product = arg.sellerDetailList[i].productList[j];
            productList.push(new order_types.OrderInfo({
                productId: product.productId,
                productName: product.productName,
                skuNum: product.skuNum,
                skuDesc: product.skuName,
                count: product.count,
                curPrice: product.curPrice,
                imagesUrl: product.imgUrl,
                postage:product.postage,
                storehouseId: product.storehouseId
            }));
        }
        sellerDetailList.push(new trade_types.BuySellerDetail({
            sellerId: arg.sellerDetailList[i].sellerId,
            sellerName: arg.sellerDetailList[i].sellerName,
            buyerComment: arg.sellerDetailList[i].buyerComment,
            productList: productList
        }));
    }

    var deliverInfo;

    if (arg.tradeCode == "Z0002" || arg.tradeCode == "Z8002" || arg.tradeCode == "Z8001") {
        deliverInfo = new order_types.DeliverInfo({
            receiverMobile: arg.mobile
        });
    } else {
        deliverInfo = new order_types.DeliverInfo({
            addressId: arg.addressDesc.id,
            provinceName: arg.addressDesc.provinceName,
            cityName: arg.addressDesc.cityName,
            countyName: arg.addressDesc.countyName,
            receiverAddress: arg.addressDesc.address
        });
    }


    var param = new trade_types.BuyInfo({
        userId: arg.userId,
        userName: arg.userName,
        amount: arg.totalSum,
        //payChannel: new pay_types.PayChannel({payChannel:arg.payChannel}),
        deliverInfo: deliverInfo,
        sellerDetailList: sellerDetailList,
        fromBatch: arg.fromBatch,
        fromSource: arg.fromSource,
        tradeCode: arg.tradeCode
        /*
         fromSource: arg.fromSource,
         exchangeScore:arg.exchangeScore || 0,
         exchangeCash:arg.exchangeCash || 0,
         tradeCode:arg.tradeCode
         */
    });

    logger.info("调用cartServ-orderConfirm args:" + JSON.stringify(param));
    var tradeServ = new Lich.InvokeBag(Lich.ServiceKey.TradeServer, "orderConfirm", param);

    Lich.wicca.invokeClient(tradeServ, function (err, data) {
        logger.info("调用cartServ-orderConfirm result:" + JSON.stringify(data[0]));
        var res = {};
        if (err) {
            logger.error("调用cartServ-orderConfirm失败  失败原因 ======" + err);
            //logger.error("错误信息:" + JSON.stringify(data[0].result));
            res.code = 500;
            res.desc = "提交订单失败！";
            callback(res, null);
        } else if (data[0].result.code == "1") {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        }
        else {
            logger.info("orderConfirm response:" + JSON.stringify(data[0]));
            callback(null, data);
        }
    });
};

/*订单状态转换*/
Order.prototype.getOrderStateBuyerEnum = function (orderState) {
    if (orderState == null) {
        return "";
    }
    var state = Number(orderState);
    if (state >= 10 && state < 20) {
        return "待支付";
    } else if (state >= 20 && state < 40) {
        return "待发货";
    } else if (state >= 40 && state < 50) {
        return "待收货";
    } else if (state == 50) {
        return "待评论";
    } else if (state >= 51 && state < 60) {
        return "已完成";
    } else if (state >= 60 && state < 70) {
        return "已取消";
    }

    return "";
};

/*订单状态转换*/
Order.prototype.getOrderStateIdBuyerEnum = function (orderState) {
    if (orderState == null) {
        return 0;
    }
    //var state = Number(orderState);
    if (orderState == "待支付") {
        return 1;
    } else if (orderState == "待发货") {
        return 3;
    } else if (orderState == "待收货") {
        return 4;
    } else if (orderState == "待评论") {
        return 50;
    } else if (orderState == "已完成") {
        return 5;
    } else if (orderState == "已取消") {
        return 6;
    }

    return 0;
};

//确认收货
Order.prototype.confirmReceipt = function (param, callback) {

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "confirmReceipt", [1, param.userId, param.orderId]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("call orderSer-payState result:" + JSON.stringify(data));
        if (err || data[0] == '1') {
            var res = {};
            res.code = 500;
            res.desc = "查询订单状态失败！";
            callback(res, null);
        } else {
            callback(null, data[0].payState);
        }
    });
};

module.exports = new Order();