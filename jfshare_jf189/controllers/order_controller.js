/**
 * Created by L on 2015/10/24 0024.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
//var path = require('path');
var view = require('../view_center/order/view_order');
var view_index = require('../view_center/index/view_index');
var view_buyer = require('../view_center/buyer/view_buyer');
var paramValid = require('../lib/models/pub/param_valid');
var logger = require('../lib/util/log4node').configlog4node.servLog4js();
var Product = require('../lib/models/product');
var async = require('async');
var Order = require('../lib/models/order');


var address_types = require("../lib/thrift/gen_code/address_types");
var common_types = require("../lib/thrift/gen_code/common_types");
var product_types = require("../lib/thrift/gen_code/product_types");
var trade_types = require("../lib/thrift/gen_code/trade_types");
var order_types = require("../lib/thrift/gen_code/order_types");
var cart_types = require("../lib/thrift/gen_code/cart_types");
var pay_types = require("../lib/thrift/gen_code/pay_types");
var buyer_types = require("../lib/thrift/gen_code/buyer_types");
var expressModel = require("../lib/models/express");
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');

var thriftConfig = require('../resource/thrift_config');

/*选购商品后请求页 */
router.post('/add_confirm', function(req, res, next) {
    logger.info('商品提交页');
    var parameters = res.resData;
    var arg = req.body;
    var userId =  req.session.buyer.userId+"" || "";

    parameters.fromBatch = "1";
    parameters.count = arg.amount;
    parameters.userId = userId;
    parameters.productId = arg.productId;

    //测试模拟数据
    //parameters = {
    //    fromBatch : "1",
    //    count : 3,
    //    userId : 17,
    //    productId : "ze151228152841000732",
    //    sellerId:1,
    //    storehouseIds : "1,2,3",
    //    pInfo:{
    //        storehouseId:1,
    //        skuNum:'1-12:100-106',
    //        curPrice:"30.00",
    //        orgPrice:"1000.00",
    //        imgKey:"75B1957695653501779C08D47F8FF3E5.jpg",
    //        productName:"测试商品",
    //        skuDesc:"颜色-白色:尺码-120*200/7斤",
    //        score2cashAmount:10
    //    }
    //}

    var extInfo = req.session.buyer.thirdInfo.extInfo;
    if(JSON.parse(extInfo).deviceType!="18" && JSON.parse(extInfo).deviceType!="7"&& JSON.parse(extInfo).deviceType!="2"){
        var resHtml =  ''
            + '<!DOCTYPE html><html lang="zh-cn"><head><meta charset="utf-8"></head><body>'
            + '<script type="text/javascript" language="JavaScript">'
            + 'alert("抱歉,非手机号用户登陆无法购买!");'
            + '</script>'
            + '</body></html>';
        return res.end(resHtml);
    }

    parameters.title = "订单确认";

    var thrift_productRet_param = new product_types.ProductRetParam({baseTag:1, skuTag:1});
    var thrift_sku_param = new product_types.ProductSkuParam({productId:arg.productId, skuNum:arg.skuNum, storehouseId:arg.storehouseId});
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryHotSKUV1", [thrift_sku_param, thrift_productRet_param]);
    // 调用 productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        if (err || data[0].result.code == "1") {
            logger.error("调用productServ-queryHotSKUV1查询商品及sku信息失败  失败原因 ======" + err + "|" + JSON.stringify(data));
            var resHtml =  ''
                + '<!DOCTYPE html><html lang="zh-cn"><head><meta charset="utf-8"></head><body>'
                + '<script type="text/javascript" language="JavaScript">'
                + 'alert("系统异常，查询商品信息失败!");'
                + '</script>'
                + '</body></html>';
            return res.end(resHtml);
        }

        logger.info("调用productServ-queryHotSKUV1查询sku信息：" + JSON.stringify(data[0]));

        try {
            var product = new product_types.Product(data[0].product);

            parameters.sellerId = product.sellerId;
            parameters.storehouseIds = product.storehouseIds;
            parameters.postageId = product.postageId;

            var skuItem = {};

            for(var i = 0; i < product.productSku.skuItems.length; i++) {
                var item = product.productSku.skuItems[i];
                if(arg.skuNum == item.skuNum) {
                    skuItem = item;
                    break;
                }
            }

            parameters.pInfo = {
                storehouseId: skuItem.storehouseId,
                skuNum: skuItem.skuNum,
                curPrice:skuItem.curPrice,
                orgPrice:skuItem.orgPrice,
                imgKey: arg.imgKey||product.imgKey.split(",")[0],
                productName: product.productName,
                skuDesc: skuItem.skuDesc,
                score2cashAmount: Number(product.thirdExchangeRate/100).toFixed(2),
                weight: arg.weight
            }
        } catch (e) {
            logger.error("构建订单信息u信息失败  失败原因 ======" + e);
            var resHtml =  ''
                + '<!DOCTYPE html><html lang="zh-cn"><head><meta charset="utf-8"></head><body>'
                + '<script type="text/javascript" language="JavaScript">'
                + 'alert("系统异常， 构建订单信息失败!");'
                + '</script>'
                + '</body></html>';
            return res.end(resHtml);
        }

        logger.info("confimInfo----" + JSON.stringify(parameters));

        //2.render data ui
        view.confirm_cart(req, res, next, {data:JSON.stringify(parameters)});
    });
});

//get user address list
router.get('/address_list', function(req, res, next) {
    var parameters = res.resData;
    parameters.userId =   req.session.buyer.userId+"" || "";
    //parameters.userId = 17;
    logger.info("获取用户收货地址列表[address_list]信息, userId=" + parameters.userId);
    var ret = res.resData;

    // 获取client
    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "queryAddress", parameters.userId);
    Lich.wicca.invokeClient(addressServ, function (err, data) {
        if(err || data[0].result.code == "1"){
            logger.error("调用addressServ-queryAddress查询用户收货地址列表失败  失败原因 ======" + err);
            ret.status = 500;
            ret.msg = "加载收货地址失败！";
            res.json(ret);
            return;
        }

        logger.info("调用addressServ-queryAddress查询用户收货地址列表成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        //logger.info("接口返回数据=====" + data[0]);
        ret.status = 200;
        ret.addressInfoList = paramValid.empty(data[0].addressInfoList) ? "" : data[0].addressInfoList;
        res.json(ret);
    });
});

//get province
router.get('/province', function(req, res, next) {
    logger.info("获取省份列表[province]信息");

    // 获取client
    var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "province", []);
    Lich.wicca.invokeClient(commonServ, function (err, data) {
        if(err || data[0].result.code == "1"){
            logger.error("调用commonServ-province查询省份列表失败  失败原因 ======" + err);
            res.json(data[0].result);
            return;
        }

        logger.info("调用commonServ-province查询省份列表成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        //logger.info("接口返回数据=====" + data[0]);
        res.json(paramValid.empty(data[0].areaInfo) ? "" : data[0].areaInfo);
    });
});

//get payment
router.get('/payment_list', function(req, res, next) {
    logger.info("获取支付方式列表[payment_list]信息");

    var payments = {"payments":[{"paymentId":1,"paymentName":"翼支付"}]};
    //logger.info("接口返回数据=====" + data[0]);
    res.json(paramValid.empty(payments) ? "" : payments);
});

//get productskulist
router.get('/productsku/list/:skus', function(req, res, next) {
    logger.info("获取商品sku列表[/productsku/list]信息");

    var parameters = {};
    parameters.skus =  req.params["skus"] || "" ;
    logger.info("获取商品sku列表[/productsku/list]信息, skus=" + parameters.skus);
    if (!paramValid.keyValid(parameters.skus)) {
        logger.warn("参数有误, skus=" + parameters.skus);
        res.json("非法参数请求！");
        return;
    }
    try {
        var skuList = JSON.parse(parameters.skus);
        parameters.productId = skuList[0].productId;
        parameters.storehouseId = skuList[0].storehouseId;
        parameters.skuNum = skuList[0].skuNum;
        var param = new product_types.ProductRetParam({
            baseTag: 1,
            skuTemplateTag: 0,
            skuTag: 0,
            attributeTag: 0
        });
        // 获取client
        var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryHotSKU", [parameters.productId, parameters.skuNum, param]);
        // 调用 productServ
        Lich.wicca.invokeClient(productServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用productServ-queryHotSKU查询商品Sku信息失败  失败原因 ======" + err);
                res.json(data[0].result);
                return;
            }
            logger.info("调用productServ-queryHotSKU查询商品Sku信息成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");

            //统一格式为购物车一个商品
            var itemPlus = new cart_types.ItemPlus({
                product:data[0].product,
            });
            var itemDetail = new cart_types.ItemDetail({
                product:itemPlus,
            });
            var itemDetailList = [];
            itemDetailList.push(itemDetail);
            var sellerItemDetail = new cart_types.sellerItemDetail({
                seller:null, //TODO 获取卖家信息
                itemDetailList: itemDetailList,
            });
            var itemList = [];
            itemList.push(sellerItemDetail);
            var cartRet = new cart_types.CartResult({
                result: data[0].result,
                itemList: itemList,
            });


            res.json(cartRet);
            logger.info("接口返回数据=====" + data[0].product.productName);
        });
    } catch (err) {
        res.json(null);
        logger.error("获取sku列表失败", err);
    }
});

/*
 确认订单
 */
router.post('/confirm_order', function(req, res, next) {
    logger.info('确认订单');
    var parameters = {};
    var arg = req.body;
    parameters.userId =  req.session.buyer.userId+"" || "-1";
    parameters.userName = arg.userName || "";
    //parameters.userId = 17;
    parameters.title = "订单确认结果";
    logger.error("下单开始,请求参数为：" +  JSON.stringify(arg));

    //测试模拟数据
    //arg = {
    //    productId:"ze151228152841000732",
    //    storehouseId:1,
    //    skuNum:'1-12:100-106',
    //    curPrice:"30.00",
    //    count:1,
    //    sellerId:1,
    //    buyerComment:"买家备注",
    //    fromSource:"1",
    //    fromBatch:"1",
    //    postage:10,
    //    addressId:118,
    //    totalPayAmount:"30.00"
    //}

    //async.series([
    async.waterfall([
            /*根据商品id查找类目id*/
            function(callback){
                //var productId = arg.sellerDetailList[0].productList[0].productId;
                var productId = arg.productId;
                Product.queryProduct(productId, 1, 1, 1, 1, function (err, data) {
                    if (err) {
                        return callback(1,null);
                    }
                    var product = data[0].product;
                    arg.subjectId = product.subjectId;
                    arg.thirdExchangeRate = product.thirdExchangeRate;
                    callback(null, arg);
                });
            },
            /*根据类目id,得到商品类型commodity*/
            function(callback){
                Product.getById4dis(arg, function(err,data){
                    if(err){
                        return callback(2,null);
                    } else {
                        var displaySubjectInfo = data[0].displaySubjectInfo;
                        var commodity = displaySubjectInfo.commodity;
                        var tradeCode;
                        if(commodity == 1){
                            tradeCode = "Z0003";
                        }
                        if(commodity == 2){
                            tradeCode = "Z8001";
                        }
                        arg.tradeCode = tradeCode;
                        logger.info("tradeCode的值为："+ arg.tradeCode);
                    }
                });
            },
            function(callback){
                Order.orderConfirm(arg, function (err, data) {
                    if (err) {
                        response.json(err);
                        return;
                    }
                    result.orderIdList = data[0].orderIdList;
                    //result.extend = JSON.parse(data[0].extend);
                    response.json(result);
                });
            }
        ],
        function (err, results) {
            if (err == 1) {
                arg.code = 500;
                arg.desc = "查询商品类目失败";
                response.json(arg);
                return;
            } else if (err == 2) {
                arg.code = 500;
                arg.desc = "查询商品类型失败";
                response.json(arg);
                return;
            }
        });
});


//router.post('/confirm_order', function(req, res, next) {
//    logger.info('确认订单');
//    var parameters = {};
//    var arg = req.body;
//    parameters.userId =  req.session.buyer.userId+"" || "-1";
//    parameters.userName = arg.userName || "";
//    //parameters.userId = 17;
//    parameters.title = "订单确认结果";
//    logger.error("下单开始,请求参数为：" +  JSON.stringify(arg));
//
//    //测试模拟数据
//    //arg = {
//    //    productId:"ze151228152841000732",
//    //    storehouseId:1,
//    //    skuNum:'1-12:100-106',
//    //    curPrice:"30.00",
//    //    count:1,
//    //    sellerId:1,
//    //    buyerComment:"买家备注",
//    //    fromSource:"1",
//    //    fromBatch:"1",
//    //    postage:10,
//    //    addressId:118,
//    //    totalPayAmount:"30.00"
//    //}
//
//    var deliverInfo  = new order_types.DeliverInfo({
//        addressId: arg.addressId || "",
//    });
//    var thrift_orderInfo = new order_types.OrderInfo({
//        productId: arg.productId,
//        skuNum: arg.skuNum,
//        count:  arg.count,
//        curPrice: arg.curPrice,
//        storehouseId : arg.storehouseId
//    });
//
//    var thrift_BuySellerDetail = new trade_types.BuySellerDetail({
//        sellerId: arg.sellerId,
//        sellerName: arg.sellerName,
//        buyerComment: arg.buyerComment,
//        productList: [thrift_orderInfo]
//    });
//
//    var thrift_param = new trade_types.BuyInfo({
//        userId: parameters.userId,
//        userName: arg.userName || "",
//        amount: arg.totalPayAmount,
//        deliverInfo: deliverInfo,
//        sellerDetailList: [thrift_BuySellerDetail],
//        fromSource: arg.fromSource,
//        fromBatch: arg.fromBatch
//    });
//
//    // 获取client
//    var tradeServ = new Lich.InvokeBag(Lich.ServiceKey.TradeServer, "orderConfirm", thrift_param);
//    Lich.wicca.invokeClient(tradeServ, function (err, data) {
//        if (err) {
//            logger.error("调用tradeServ-orderConfirm确认订单失败  失败原因 ======" + err);
//            view_index.tip(req, res, next, {message: "提示: 系统异常"});
//            return;
//        }
//
//        if(data[0].result.code == "1") {
//            logger.error("调用tradeServ-orderConfirm确认订单失败  失败原因 ======" + JSON.stringify(data[0].result));
//            var errorMsg = "提示：创建订单失败！";
//            if (!paramValid.empty(data[0].result.failDescList)) {
//                for(var i in data[0].result.failDescList) {
//                    errorMsg += data[0].result.failDescList[i].desc;
//                }
//            }
//            view_index.tip(req, res, next, {message: errorMsg});
//            return;
//        }
//
//        logger.info("调用tradeServ-orderConfirm确认订单成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
//        data[0].title = parameters.title;
//        data[0].ssid = req.ssid;
//        //2.render no data ui
//        view.create_order(req, res, next, data[0]);
//        logger.info("接口返回数据=====" + data[0].extend);
//    });
//});

/*
选择支付方式
 */
router.get('/pay_select', function(req, res, next) {
    logger.info('确认订单');
    var parameters = res.resData;
    var arg = req.query;
    if (paramValid.empty(req.session) || paramValid.empty(req.session.buyer.userId)) {
        logger.debug("登录超时，跳转至登录页... ...");
        //res.redirect("http://login.189.cn/login");
    }
    parameters.userId =  req.session.buyer.userId+"" || "";
    parameters.orderId =  arg.orderId+"" || "";
    //parameters.userName = arg.userName || "";
    parameters.title = "选择支付方式";

    if (paramValid.empty(parameters.orderId)) {
        res.json("参数非法");
        return;
    }
    var orderIds = [];
    orderIds.push(parameters.orderId);
    parameters.orderIdList = orderIds;
    parameters.extend = "{}";
    //2.render no data ui
    view.create_order(req, res, next, parameters);
});

/*
买家支付申请
*/
router.post('/pay_apply', function(req, res, next) {
    logger.info('去支付');

    var arg = req.body;
    var parameters = {};
    if (paramValid.empty(req.session) || paramValid.empty(req.session.buyer.userId)) {
        logger.debug("登录超时，跳转至登录页... ...");
        //res.redirect("http://login.189.cn/login");
    }
    parameters.userId = req.session.buyer.userId+"" || "";
    parameters.orderIdList = arg.orderIdList==null? null: arg.orderIdList; //TODO 多订单
    parameters.payChannel = arg.payChannel;
    parameters.custId = arg.custId;
    parameters.custType = arg.custType;
    parameters.procustID = arg.procustID;

    logger.info("去支付：" +  parameters.userId);
    var ret = res.resData;
    if (!paramValid.keyValid(parameters.userId) || paramValid.empty(parameters.orderIdList) ||
        paramValid.empty(parameters.payChannel)) {
        logger.warn("参数有误, parameters=" + parameters);
        ret.status = 500;
        ret.msg = "非法参数请求！";
        res.json(ret);
        return;
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
        userId:parameters.userId,
        orderIdList:ids,
        payChannel:payChannel,
    });
    // 获取client
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "payApply", payParam);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        if (err || data[0].result.code == "1") {
            logger.error("调用orderServ-payApply申请支付失败  失败原因 ======" + err);
            ret.status = 500;
            ret.msg = "获取支付请求失败！";
            res.json(ret);
            return;
        }
        logger.info("调用orderServ-payApply申请支付成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        logger.info("接口返回数据=====" + data[0].value);
        //view.confirm_cart(req, res, next, parameters);
        ret.value = data[0].value;
        ret.status = 200;
        res.json(ret);
    });
});

router.post('/cancel', function(req, res, next) {
    logger.info('买家取消订单');
    var parameters = res.resData;
    var arg = req.body;
    parameters.userId =  req.session.buyer.userId+"" || "";
    parameters.orderId = arg.orderId || "";
    parameters.refundReason = arg.refundReason || 0;
    parameters.title = "订单详情";

    if (paramValid.empty(parameters.userId)|| paramValid.empty(parameters.orderId)) {
        view_index.err(req, res, next, "参数非法");
    }
    // 获取client
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "cancelOrder", [1, parameters.userId, parameters.orderId, parameters.refundReason]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        if (err || data[0].code == "1") {
            logger.error("调用orderServ-cancelOrder取消订单失败  失败原因 ======" + err);
            view_index.tip(req, res, next, {message: "取消订单失败"});
        }
        logger.info("调用orderServ-cancelOrder取消订单成功  result.code =  （" + data[0].code + "）  1为失败 0为成功");
        //2.render no data ui
        logger.info("接口返回数据=====" + data[0].extend);
        view_buyer.my_order_detail(req, res, next, parameters);
    });
});

router.post('/heartbeat', function(req, res, next) {
    res.json({});
});

/**
 * 查下快递/物流信息
 */
router.post('/expressInfoAndTrace', function(req, res, next) {
    expressModel.query(req.body, res.resData, function(rdata){
        res.json(rdata);
    });
});

/**
 * 买家确认收货
 */
router.post('/confirmReceipt', function(req, res, next) {
    var parameters = res.resData;
    var arg = req.body;
    parameters.userId =  req.session.buyer.userId+"" || "";
    parameters.orderId = arg.orderId || "";
    parameters.title = "订单详情";

    logger.info('买家确认收货, orderId='+parameters.orderId+", userId=" + parameters.userId);

    if (paramValid.empty(parameters.userId)|| paramValid.empty(parameters.orderId)) {
        view_index.err(req, res, next, "参数非法");
    }

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "confirmReceipt", [1, parameters.userId, parameters.orderId]);
    Lich.wicca.invokeClient(orderServ, function (err, data) {
        if (err || data[0].code == "1") {
            logger.error("调用orderServ-confirmReceipt确认收货失败  失败原因 ======" + err);
            view_index.tip(req, res, next, {message: "确认收货失败"});
        }
        logger.info("调用orderServ-confirmReceipt确认收货失败  result.code =  （" + data[0].code + "）  1为失败 0为成功");
        logger.info("接口返回数据=====" + data[0].extend);
        view_buyer.my_order_detail(req, res, next, parameters);
    });
});
//暴露模块
module.exports = router;
