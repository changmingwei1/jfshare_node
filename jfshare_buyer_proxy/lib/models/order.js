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
var fileUpload_types = require('../thrift/gen_code/fileUpload_types');
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
    logger.info("售后列表查询的条件:" + JSON.stringify(orderQueryConditions));

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderProfileQuery", [1, param.userId, orderQueryConditions]);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("调用orderServ-orderProfileQuery  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("调用orderServ-orderProfileQuery失败  失败原因 ======" + JSON.stringify(data));
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
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("调用orderServ-orderStateQuery失败  失败原因 ======" + JSON.stringify(data));
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
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("调用orderServ-queryOrderDetail失败  失败原因 ======" + JSON.stringify(data));
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
        exchangeScore:param.exchangeScore,
        exchangeCash:param.exchangeCash,
        payChannel: payChannel
    });

    logger.info("call orderServ-payApply args:" + JSON.stringify(payParam));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "payApply", payParam);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("call orderServ-payApply result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("调用orderServ-payApply失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "支付失败！";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else if(data[0].result.code == 2){
            callback(null, data[0]);
        } else {
            callback(null, data[0]);
        }
    });
};

/*天翼H5申请付款*/
Order.prototype.payApplyTYH5 = function (parameters, callback) {
    logger.info("天翼H5申请获取支付平台URL  parameters:" + JSON.stringify(parameters));
    if (parameters.payChannel != 10) {
        logger.warn("参数有误, parameters=" + parameters);
        res.code = 500;
        res.desc = "非法参数支付渠道！";
        callback(res, null);
    }
    var payChannel = new pay_types.PayChannel({
        payChannel:parameters.payChannel,
        payIp: null,
        returnUrl:"",
        custId:parameters.custId,
        custType:parameters.custType,
        procustID:parameters.procustID,
    });
    var ids = []; ids.push(parameters.orderIdList);

    var payParam = new order_types.PayParam({
        userId: parameters.userId,
        orderIdList: parameters.orderIdList,
        exchangeScore:parameters.exchangeScore,
        exchangeCash:parameters.exchangeCash,
        payChannel: payChannel
    });

    logger.info("call orderServ-payApply args:" + JSON.stringify(payParam));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "payApply", payParam);

    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("call orderServ-payApply result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(parameters));
            logger.error("调用orderServ-payApply失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "支付失败！";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(parameters));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else if(data[0].result.code == 2){
            callback(null, data[0]);
        } else {
            callback(null, data[0]);
        }
    });
};
/*查询支付状态*/
Order.prototype.payState = function (param, callback) {

    var statePara = new order_types.PayState({
        payId: param.payId,
        tokenId: "iLv6mU/tYV1Vu9zhav4XcA=="
    });

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "payState", statePara);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        logger.info("call orderSer-payState result:" + JSON.stringify(data));
        if (err || data[0].result.code == 1) {
            logger.error("请求参数：" + JSON.stringify(param));
            var res = {};
            res.code = 500;
            res.desc = "查询订单支付状态失败！";
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
                curPrice: product.curPrice + "",
                /*postage:product.postage,*/ /*邮费可以不写入，直接在算进了totalSum中*/
                storehouseId: product.storehouseId,
                thirdExchangeRate:arg.thirdExchangeRate
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
        /*weight: arg.weight,
        postageExt:arg.postageExt*/ /*运费扩展信息  JSON 现在还不知道怎么用*/
    });

    logger.info("调用cartServ-orderConfirm args:" + JSON.stringify(param));
    var tradeServ = new Lich.InvokeBag(Lich.ServiceKey.TradeServer, "orderConfirm", param);

    Lich.wicca.invokeClient(tradeServ, function (err, data) {
        logger.info("调用cartServ-orderConfirm result:" + JSON.stringify(data[0]));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(arg));
            logger.error("调用cartServ-orderConfirm失败  失败原因 ======" + JSON.stringify(data));
            res.code = 500;
            res.desc = "提交订单失败！";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.error("请求参数：" + JSON.stringify(arg));
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
            logger.error("请求参数：" + JSON.stringify(param));
            var res = {};
            res.code = 500;
            res.desc = "查询订单状态失败！";
            callback(res, null);
        } else {
            callback(null, data[0].payState);
        }
    });
};

/*扫码预生成订单*/
Order.prototype.orderConfirmResult = function (params, callback) {

    var pagination = new pagination_types.Pagination({
        numPerPage:params.perCount,
        currentPage:params.curPage
    });
    logger.info("调用 AfterSaleServ-orderConfirmResult  parms:" + JSON.stringify(params));
    var tradeServ = new Lich.InvokeBag(Lich.ServiceKey.TradeServer, "orderConfirmResult", param);

    Lich.wicca.invokeClient(tradeServ, function (err, data) {
        logger.info("AfterSaleServ-orderConfirmResult  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("请求参数：" + JSON.stringify(params));
            logger.error("AfterSaleServ-orderConfirmResult  失败原因 ======" + err);
            res.code = 500;
            res.desc = "扫码预生成订单失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

/*取消订单*/
Order.prototype.cancelOrder = function (param, callback) {
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "cancelOrder", [1, param.userId, param.orderId, 1]);
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

/*话费充值的订单提交--无productId*/
Order.prototype.orderConfirmRecharge = function (arg, callback) {

    var sellerDetailList = [];
    for (var i = 0; i < arg.sellerDetailList.length; i++) {
        sellerDetailList.push(new trade_types.BuySellerDetail({
            sellerId: arg.sellerDetailList[i].sellerId,
            sellerName: arg.sellerDetailList[i].sellerName
        }));
    }
    var deliverInfo = new order_types.DeliverInfo({
        receiverMobile: arg.receiverMobile,
        receiverName:arg.flowno,    //流量代码简写：30,50,100
        receiverAddress:arg.company //供应商名称: 中国移动,中国联通,中国电信
    });
    var param = new trade_types.BuyInfo({
        userId: arg.userId,
        userName: arg.userName,
        amount: arg.totalSum,
        //payChannel: new pay_types.PayChannel({payChannel:arg.payChannel}),
        deliverInfo: deliverInfo,
        sellerDetailList: sellerDetailList,
        //fromBatch: arg.fromBatch,
        //fromSource: arg.fromSource,
        tradeCode: arg.tradeCode,
        fromSource: arg.fromSource
        /*weight: arg.weight,
         postageExt:arg.postageExt*/ /*运费扩展信息  JSON 现在还不知道怎么用*/
    });

    logger.error("调用cartServ-orderConfirmOffline args:" + JSON.stringify(param));
    var tradeServ = new Lich.InvokeBag(Lich.ServiceKey.TradeServer, "orderConfirmOffline", param);

    Lich.wicca.invokeClient(tradeServ, function (err, data) {
        logger.error("调用cartServ-orderConfirmOffline result:" + JSON.stringify(data[0]));
        var res = {};
        if (err) {
            logger.error("调用cartServ-orderConfirmOffline失败  失败原因 ======" + err);
            //logger.error("错误信息:" + JSON.stringify(data[0].result));
            res.code = 500;
            res.desc = "提交订单失败！";
            callback(res, null);
        } else if (data[0].code == 1) {
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

/*话费充值第三方回调*/
Order.prototype.rechargeNotify = function (arg, callback) {

    var param = new fileUpload_types.NotifyRecharge({
        agtPhone: arg.agtPhone,
        reqStreamId: arg.reqStreamId,
        state: arg.state,
        sign: arg.sign,
    });

    logger.error("调用FileForCardServ-rechargeNotify args:" + JSON.stringify(param));
    var fileForCardServ = new Lich.InvokeBag(Lich.ServiceKey.FileForCardServ, "rechargeNotify", param);

    Lich.wicca.invokeClient(fileForCardServ, function (err, data) {
        logger.error("调用FileForCardServ-rechargeNotify result:" +data);
        var res = {};
        if (err) {
            logger.error("调用FileForCardServ-rechargeNotify失败  失败原因 ======" + err);
            //logger.error("错误信息:" + JSON.stringify(data[0].result));
            res.code = 500;
            res.desc = "处理第三方回调失败！";
            callback(res, null);
        } else if (data[0].code == 1) {
            res.code = 500;
            res.desc ="处理第三方回调失败！" ;
            callback(res, null);
        }
        else {
            logger.error("FileForCardServ-rechargeNotify response:" + JSON.stringify(data[0]));
            callback(null, data);
        }
    });
};

module.exports = new Order();