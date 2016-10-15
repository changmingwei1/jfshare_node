/**
 * Created by zhaoshenghai on 16/3/20.
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

function Product() {
}

// 查询商品列表，包含带条件查询：商品名称，商品id，商品状态
Product.prototype.queryProductList = function (params, callback) {

    var thrift_pagination = new pagination_types.Pagination({currentPage: params.curpage, numPerPage: params.percount});
    var thrift_params = new product_types.ProductSurveyQueryParam({});


    thrift_params.pagination = thrift_pagination;
    thrift_params.sellerId = params.sellerId;
    thrift_params.productName = params.productName;
    thrift_params.activeState = params.activeState;
    thrift_params.productId = params.productId;
    thrift_params.sort = "create_time DESC";
    //
    logger.info("调用productServ-queryProductList args:" + JSON.stringify(thrift_params));
    // 获取client//Product ProductServer
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "productSurveyBackendQuery", thrift_params);
    // 调用 productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用productServ-queryProductList result:" + JSON.stringify(data[0]));
        var ret = {};
        if (err || data[0].result.code == 1) {
            logger.error("调用productServ-queryProductList失败  失败原因 ======" + err);
            ret.code = 500;
            ret.desc = "查询商品列表失败！";

            return callback(ret, null);
        }
        callback(null, data);
    });
};


// 查询商品
Product.prototype.queryProduct = function (productId, baseTag, skuTemplateTag, skuTag, attributeTag, callback) {
    var param = new product_types.ProductRetParam({
        baseTag: baseTag,
        skuTemplateTag: skuTemplateTag,
        skuTag: skuTag,
        attributeTag: attributeTag
    });

    logger.info("get product info args:" + JSON.stringify(param));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProduct", [productId, param]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("get product info result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("调用productServ-queryProductSku查询商品sku失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询商品列表失败";
            callback(res, null);
        } else {
            //var result = data[0].result;
            //if(result.code == 1){
            //    var
            //}
            callback(null, data)
        }
    });
};

// 查询商品ＳＫＵ
Product.prototype.queryProductSku = function (productId, callback) {

    logger.info("arg:" + productId);

    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProductSku", productId);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用productServ-queryProductSku result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用productServ-queryProductSku查询商品sku失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询产品信息失败！";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//查询商品指定sku
Product.prototype.queryHotSKU = function (paramters, callback) {

    var param = new product_types.ProductRetParam({
        baseTag: 1,
        skuTemplateTag: 0,
        skuTag: 1,
        attributeTag: 0
    });

    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryHotSKU", [paramters.productId, paramters.skunum, param]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用productServ-queryHotSku result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用productServ-queryHotSku查询商品sku失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询商品信息失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

//查询商品详情
Product.prototype.queryProductDetail = function (arg, callback) {

    var param = new product_types.ProductDetailParam({
        detailKey: "56a1915a0cf2bb85eb5701a7",
        productId: "ze160122101802000570"
    });
    logger.info("get productDetail info args:" + JSON.stringify(param));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProductDetail", param);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用productServ-queryProductDetail result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用productServ-queryProductDetail查询商品详情  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询商品详情失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

Product.prototype.getStock = function (productId, callback) {

    // 获取client
    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer, "getStock", productId);
    //invite productServ
    Lich.wicca.invokeClient(stockServ, function (err, data) {
        logger.info("调用stockServ-getStock result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("调用stockServ-getStock失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "获取库存失败";
            callback(res, null);
        } else {
            callback(null, data)
        }
    });
};

Product.prototype.getStockForSku = function (paramters, callback) {
    // 获取client
    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer, "getStockForSku", [paramters.productId, [paramters.skunum]]);

    //invite productServ
    Lich.wicca.invokeClient(stockServ, function (err, data) {
        logger.info("调用stockServ-getStockForSku  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用stockServ-getStockForSku  失败原因 ======" + err);
            logger.error("eeeee:" + JSON.stringify(data[0].result));
            res.code = 500;
            res.desc = "获取库存失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

Product.prototype.getSubTree = function (subjectId, callback) {
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getSubTree", subjectId);

    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("调用subjectServ-getSubTree  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("调用subjectServ-getSubTree查询子分类失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询子分类失败";
            callback(res, null);
        } else {
            callback(null, data)
        }
    });
};


Product.prototype.getDefaultAddress = function (userId, callback) {
    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "getDefaultAddress", userId);

    Lich.wicca.invokeClient(addressServ, function (err, data) {
        logger.info("调用addressServ-getDefaultAddress  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("调用addressServ-getDefaultAddress失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "获取默认地址失败！";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

Product.prototype.addAddress = function (param, callback) {

    var addrInfo = new address_types.AddressInfo({
        userId: param.userId,
        receiverName: param.received,
        mobile: param.mobileNo,
        provinceId: param.area.provinceId,
        provinceName: param.area.provinceName,
        cityId: param.area.cityId,
        cityName: param.area.cityName,
        countyId: param.area.countyId,
        countyName: param.area.countyName,
        address: param.address,
        postCode: param.postCode,
        isDefault: param.isDefault
    });

    logger.info("调用addressServ-addAddress  args:" + JSON.stringify(addrInfo));

    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "addAddress", addrInfo);

    Lich.wicca.invokeClient(addressServ, function (err, data) {
        logger.info("调用addressServ-addAddress  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用addressServ-addAddress失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "添加收货地址信息失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

Product.prototype.updateAddress = function (param, callback) {

    var addrInfo = new address_types.AddressInfo({
        userId: param.userId,
        id: param.addrId,
        receiverName: param.received,
        mobile: param.mobileNo,
        provinceId: param.area.provinceId,
        provinceName: param.area.provinceName,
        cityId: param.area.cityId,
        cityName: param.area.cityName,
        countyId: param.area.countyId,
        countyName: param.area.countyName,
        address: param.address,
        postCode: param.postcode,
        isDefault: param.isDefault
    });

    logger.info("调用addressServ-updateAddress  args:" + JSON.stringify(addrInfo));
    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "updateAddress", addrInfo);

    Lich.wicca.invokeClient(addressServ, function (err, data) {
        logger.info("调用addressServ-updateAddress  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用addressServ-updateAddress失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "列新收货地址信息失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

Product.prototype.delAddress = function (userId, addressId, callback) {
    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "delAddress", [userId, addressId]);

    Lich.wicca.invokeClient(addressServ, function (err, data) {
        logger.info("调用addressServ-delAddress  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == 1) {
            logger.error("调用addressServ-delAddress失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "删除收货地址信息失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

Product.prototype.queryAddress = function (userId, callback) {
    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "queryAddress", userId);

    Lich.wicca.invokeClient(addressServ, function (err, data) {
        logger.info("调用addressServ-queryAddress  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用addressServ-queryAddress失败  失败原因 ======" + err);
            logger.error("错误信息:" + JSON.stringify(data[0].result));
            res.code = 500;
            res.desc = "查询收货地址列表失败！";
            callback(res, null);
        } else {
            callback(null, data[0].addressInfoList);
        }
    });
};


Product.prototype.orderProfileQuery = function (params, callback) {
    var orderQueryConditions = new order_types.OrderQueryConditions({
        orderState: params.orderState || 0,
        count: params.percount,
        curPage: params.curpage,
        startTime: params.startTime,
        endTime: params.endTime

    });
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderProfileQuery", [1, params.userId, orderQueryConditions]);

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

Product.prototype.orderStateQuery = function (param, callback) {
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

Product.prototype.queryOrderDetail = function (param, callback) {

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "queryOrderDetail", [param.userType, param.userId, param.orderId]);

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


Product.prototype.payApply = function (param, callback) {
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
        logger.info("call orderServ-payApply result:" + JSON.stringify(data[0]));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用orderServ-payApply失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "提交订单失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

Product.prototype.payState = function (param, callback) {

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


Product.prototype.addCartItem = function (param, callback) {

    var item = new cart_types.Item({
        productId: param.productId,
        skuNum: param.skunum || '',
        count: param.count,
        price: param.price
    });

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "addItem", [param.userId, item, 2]);

    Lich.wicca.invokeClient(cartServ, function (err, data) {
        logger.info("调用cartServ-addItem  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用cartServ-addItem失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "添加购物车失败！";
            callback(res, null);
        } else {
            logger.info("add cart item:" + JSON.stringify(data[0]));
            callback(null, data[0].checkList);
        }
    });
};

Product.prototype.deleteCartItem = function (userId, carKeys, callback) {
    var carKeyList = [];
    for (var i = 0; i < carKeys.length; i++) {
        var item = new cart_types.CartKey(carKeys[i]);
        carKeyList.push(item);
    }

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "deleteItem", [userId, carKeyList, 2]);

    Lich.wicca.invokeClient(cartServ, function (err, data) {
        logger.info("调用cartServ-deleteItem  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用cartServ-deleteItem失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "添加购物车失败！";
            callback(res, null);
        } else {
            logger.info("add cart item:" + JSON.stringify(data[0]));
            callback(null, data[0].checkList);
        }
    });
};

Product.prototype.cartListItem = function (userId, callback) {

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "listItem", [userId, 2]);

    Lich.wicca.invokeClient(cartServ, function (err, data) {
        logger.info("调用cartServ-listItem  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用cartServ-listItem失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "添加购物车失败！";
            callback(res, null);
        } else {
            logger.info("get cart item list:" + JSON.stringify(data[0]));
            callback(null, data[0].itemList);
        }
    });
};

Product.prototype.cartCountItem = function (userId, callback) {

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "countItem", [userId, 2]);

    Lich.wicca.invokeClient(cartServ, function (err, data) {
        logger.info("调用cartServ-countItem  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用cartServ-countItem失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "购物车商品数失败！";
            callback(res, null);
        } else {
            logger.info("get cart item list:" + JSON.stringify(data[0]));
            callback(null, data[0].value);
        }
    });
};

Product.prototype.cartUpdateItem = function (param, callback) {
    var cartKey = new cart_types.CartKey({productId: param.productId, skuNum: param.skunum});
    var item = new cart_types.Item({
        productId: param.productId,
        skuNum: param.skunum,
        count: param.count,
        price: param.price || "0",
        wi: param.wi || null
    });

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "updateItem",
        [param.userId, null, cartKey, item, 2]);

    Lich.wicca.invokeClient(cartServ, function (err, data) {
        logger.info("调用cartServ-updateItem result:" + JSON.stringify(data[0]));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用cartServ-countItem失败  失败原因 ======" + err);
            logger.error("错误信息:" + JSON.stringify(data[0].result));
            res.code = 500;
            res.desc = "购物车商品数失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

//提交订单
Product.prototype.orderConfirm = function (arg, callback) {

    var sellerDetailList = [];
    for (var i = 0; i < arg.sellerDetailList.length; i++) {
        var productList = [];
        for (var j = 0; j < arg.sellerDetailList[i].productList.length; j++) {
            var product = arg.sellerDetailList[i].productList[j];
            productList.push(new order_types.OrderInfo({
                productId: product.productId,
                productName: product.productName,
                skuNum: product.skuNum,
                skuDesc: product.skuDesc,
                count: product.count,
                curPrice: product.curPrice
            }));
        }
        sellerDetailList.push(new trade_types.BuySellerDetail({
            sellerId: arg.sellerDetailList[i].sellerId,
            sellerName: arg.sellerDetailList[i].sellerName || "",
            buyerComment: arg.sellerDetailList[i].buyerComment || "",
            productList: productList
        }));
    }

    var param = new trade_types.BuyInfo({
        userId: arg.userId,
        userName: arg.userName || "",
        amount: arg.totalSum,
        //payChannel: new pay_types.PayChannel({payChannel:arg.payChannel}),
        deliverInfo: new order_types.DeliverInfo(arg.deliverInfo),
        sellerDetailList: sellerDetailList,
        fromSource: arg.fromSource,
        fromBatch: arg.fromBatch,
        exchangeScore: arg.exchangeScore || 0,
        exchangeCash: arg.exchangeCash || 0,
        tradeCode: arg.tradeCode
    });

    logger.info("调用cartServ-orderConfirm args:" + JSON.stringify(param));
    var tradeServ = new Lich.InvokeBag(Lich.ServiceKey.TradeServer, "orderConfirm", param);

    Lich.wicca.invokeClient(tradeServ, function (err, data) {
        logger.info("调用cartServ-orderConfirm result:" + JSON.stringify(data[0]));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用cartServ-orderConfirm失败  失败原因 ======" + err);
            logger.error("错误信息:" + JSON.stringify(data[0].result));
            res.code = 500;
            res.desc = "购物车商品数失败！";
            callback(res, null);
        } else {
            logger.info("orderConfirm response:" + JSON.stringify(data[0]));
            callback(null, data[0].orderIdList);
        }
    });
};

Product.prototype.getBuyerInfo = function (userId, callback) {

    var param = new buyer_types.Buyer({userId: userId});

    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "getBuyer", param);

    Lich.wicca.invokeClient(buyerServ, function (err, data) {
        logger.info("调用buyerServ-getBuyer result:" + JSON.stringify(data[0]));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用buyerServ-getBuyer失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "获取个人信息失败！";
            callback(res, null);
        } else {
            callback(null, data[0].buyer);
        }
    });
};

Product.prototype.sendMsgCaptcha = function (arg, callback) {

    var param = new common_types.MsgCaptcha({
        type: arg.type || "buyer_signin",
        mobile: arg.mobile
    });
    var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "sendMsgCaptcha", param);

    Lich.wicca.invokeClient(commonServ, function (err, data) {
        logger.info("调用commonServ-sendMsgCaptcha  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用commonServ-sendMsgCaptcha失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "获取短信验证码失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};


Product.prototype.signinThirdParty = function (arg, callback) {
    var loginLog = new buyer_types.LoginLog();
    var thirdpartyUser = new buyer_types.ThirdpartyUser({
        thirdType: "H5_FOSHAN",
        accountNo: arg.mobile,
        userName: arg.username || arg.mobile,
        custId: arg.mobile
    });

    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "signinThirdParty", [loginLog, thirdpartyUser]);

    Lich.wicca.invokeClient(buyerServ, function (err, data) {
        logger.info("调用buyerServ-signinThridParty  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用buyerServ-signinThridParty失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "登录失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};


Product.prototype.getOrderStateBuyerEnum = function (orderState) {
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

Product.prototype.getOrderStateIdBuyerEnum = function (orderState) {
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




//result.Result setProductState(1:ProductOpt productOpt);
//修改商品状态

Product.prototype.setProductState = function (params, callback) {

    var productOpt = new product_types.ProductOpt({
        productId:params.productId,
        curState:200,
        activeState:params.activeState,
        operatorId:params.userId,
        operatorType:2
    });

    //
    logger.info("调用productServ-queryProductList args:" + JSON.stringify(productOpt));
    // 获取client//Product ProductServer
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "setProductState", productOpt);
    // 调用 productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用productServ-queryProductList result:" + JSON.stringify(data[0]));
        var ret = {};
        if (err) {
            logger.error("调用productServ-queryProductList失败  失败原因 ======" + err);
            ret.code = 500;
            ret.desc = "查询商品列表失败！";
            return callback(ret, null);
        }else if(data[0].code == 1){
            ret.code = 500;
            ret.desc = data[0].failDescList[0].desc;
            return callback(ret, null);
        }
       return callback(null, data);
    });
};
//获取虚拟订单的卡密信息
Product.prototype.queryProductCard = function (params, callback) {
    var productCardParam = new product_types.ProductCardParam({
        transactionId:params.orderId,
        productId:params.productId
    });
    logger.info("queryProductOrderCard  args:" + JSON.stringify(params));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProductCard", productCardParam);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用queryProductOrderCard result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用queryProductOrderCard  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查看订单的卡密信息失败！";
            callback(res, null);
        } else {
            if(data[0]!=null&&data[0].cardList!=null){
                callback(null, data[0].cardList);
            }else{
                callback(null, null);
            }

        }
    });
};
/////////////////////////////////////////////////////////////////////////////////
//查询第三方商品
Product.prototype.queryThirdPartyProduct = function (params, callback) {
    var productCardParam = new product_types.ThirdPartyProductQueryParam({
       thirdPartyIdentify:params.thirdPartyIdentify,
        productName :params.productName,
        activeState:params.activeState,
        stockState:params.stockState,
        priceState :params.priceState,
        offerState :params.offerState
    });

    var pagination = new pagination_types.Pagination({currentPage: params.curpage, numPerPage: params.percount});
    logger.info("queryThirdPartyProduct  args:" + JSON.stringify(params) +  JSON.stringify(pagination) +  JSON.stringify(productCardParam));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryThirdPartyProduct", [productCardParam,pagination]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.error("queryThirdPartyProduct result:" + err+JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("queryThirdPartyProduct  失败原因 ======" +err + JSON.stringify(data));
            res.code = 500;
            res.desc = "查询第三方商品失败！";
            callback(res, null);
        } else {
            if(data[0]!=null){
                callback(null, data[0]);
            }else{
                res.code = 500;
                res.desc = "查询第三方商品失败！";
                callback(res, null);
            }

        }
    });
};


//获取第三方操作日志
Product.prototype.getThirdPartyProductLog = function (params, callback) {
    var productCardParam = new product_types.ThirdPartyProductLogParam({
        thirdPartyProductId:params.thirdPartyProductId,
        thirdPartyIdentify:params.thirdPartyIdentify
    });

    var pagination = new pagination_types.Pagination({currentPage: params.curpage, numPerPage: params.percount});
    logger.error("getThirdPartyProductLog  args:" + JSON.stringify(params));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "getThirdPartyProductLog", [productCardParam,pagination]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.error("getThirdPartyProductLog result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("getThirdPartyProductLog  失败原因 ======"+err + JSON.stringify(data));
            res.code = 500;
            res.desc = "查询第三方操作日志失败！";
            callback(res, null);
        } else {
            if(data[0]!=null){
                callback(null, data[0]);
            }else{
                callback(null, null);
            }
        }
    });
};
//exportThirdPartyProduct
Product.prototype.exportThirdPartyProduct = function (params, callback) {
    var productCardParam = new product_types.ThirdPartyProductQueryParam({
        thirdPartyIdentify:1,
        productName :params.productName,
        activeState:params.activeState,
        stockState:params.stockState,
        priceState :params.priceState,
        offerState :params.offerState
    });
    logger.info("exportThirdPartyProduct  args:" + JSON.stringify(params) +  JSON.stringify(productCardParam));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "exportThirdPartyProduct", [productCardParam]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.error("exportThirdPartyProduct result:" + err+JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("exportThirdPartyProduct  失败原因 ======" +err + JSON.stringify(data));
            res.code = 500;
            res.desc = "导出第三方商品失败！";
            callback(res, null);
        } else {
            if(data[0]!=null){
                callback(null, data[0].value);
            }else{
                callback(null, null);
            }

        }
    });
};

//提报
Product.prototype.offerThirdPartyProduct = function (params, callback) {
    var productCardParam = new product_types.ThirdPartyProduct({
        thirdPartyProductId:params.thirdPartyProductId,
        thirdPartyIdentify:params.thirdPartyIdentify
    });

    logger.error("offerThirdPartyProduct  args:" + JSON.stringify(productCardParam));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "offerThirdPartyProduct", [productCardParam]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.error("offerThirdPartyProduct result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("offerThirdPartyProduct  失败原因 ======" +err+ JSON.stringify(data));
            res.code = 500;
            res.desc = "提报失败！";
            callback(res, null);
        } else {
            if(data[0]!=null){
                callback(null, data[0].value);
            }else{
                callback(null, null);
            }
        }
    });
};

// 查询商品列表，包含带条件查询：商品名称，商品id，商品状态
Product.prototype.exportProduct = function (params, callback) {
    var thrift_params = new product_types.ProductSurveyQueryParam({});
    thrift_params.sellerId = params.sellerId;
    thrift_params.productName = params.productName;
    thrift_params.activeState = params.activeState;
    thrift_params.productId = params.productId;
    thrift_params.sort = "create_time DESC";

    logger.info("调用productServ-exportProduct args:" + JSON.stringify(thrift_params));
    // 获取client//Product ProductServer
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "exportProduct", thrift_params);
    // 调用 productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用productServ-exportProduct result:" + JSON.stringify(data[0]));
        var ret = {};
        if (err || data[0].result.code == 1) {
            logger.error("调用productServ-exportProduct  失败原因 ======" + err+JSON.stringify(data));
            ret.code = 500;
            ret.desc = "导出商品列表失败！";

            return callback(ret, null);
        }
        callback(null, data[0].value);
    });
};
module.exports = new Product();