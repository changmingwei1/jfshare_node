/**
 * Created by zhaoshenghai on 16/3/20.
 */

var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

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

function Product(){}

// 查询商品列表，包含带条件查询：类目、卖家id
Product.prototype.queryProductList = function(params, callback){

    //这是科目id=classId？由原来的classId修改为subjectId
    var subjectId = params.subjectId || '';
    //添加查询条件：卖家id
    var sellerId = params.sellerId || '';
    var brandId = params.brandId || '';
    var thrift_pagination = new pagination_types.Pagination({
        currentPage:params.curPage || 1,
        numPerPage:params.perCount || 20
    });
    var thrift_params = new product_types.ProductSurveyQueryParam({
        pagination:thrift_pagination,
        subjectId:subjectId,
        sellerId:sellerId,
        brandId:brandId,
        activeState:300,
        /* create_time DESC:按创建时间降序
           cur_price DESC:按现价降序
           cur_price ASC:按现价升序
           click_rate DESC:按点击量降序 */
        sort:params.sort || ''
    });
    if(subjectId !== ''){
        thrift_params.subjectId = subjectId;
        thrift_params.subjectIdList = [subjectId];
    }
    //判断卖家id是否为空
    if(sellerId !== ''){
        thrift_params.sellerId = sellerId;
    }
    //判断品牌id是否为空
    if(brandId !== ''){
        thrift_params.brandId = brandId;
    }

    logger.info("调用productServ-queryProductList args:" + JSON.stringify(thrift_params));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "productSurveyQuery", thrift_params);
    // 调用 productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用productServ-queryProductList result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("调用productServ-queryProductList失败  失败原因 ======" + err);
            ret.code = 500;
            ret.desc = "查询商品列表失败！";
            callback(ret,null);
            return;
        }else{
            logger.info("调用productServ-queryProductList result:" + JSON.stringify(data[0]));
        }
        callback(null,data);
    });
};

// 查询商品
Product.prototype.queryProduct = function(productId, baseTag, skuTemplateTag, skuTag, attributeTag, callback){
    var param = new product_types.ProductRetParam({
        baseTag:baseTag,
        skuTemplateTag:skuTemplateTag,
        skuTag:skuTag,
        attributeTag:attributeTag
    });

    logger.info("get product info args:" + JSON.stringify(param));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProduct", [productId,param]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function(err, data){
        logger.info("get product info result:" + JSON.stringify(data));
        var res = {};
        if(err){
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

//查询商品属性
Product.prototype.queryProduct = function(productId, baseTag, skuTemplateTag, skuTag, attributeTag, callback){
    var param = new product_types.ProductRetParam({
        baseTag:baseTag,
        skuTemplateTag:skuTemplateTag,
        skuTag:skuTag,
        attributeTag:attributeTag
    });

    logger.info("get product info args:" + JSON.stringify(param));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProduct", [productId,param]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function(err, data){
        logger.info("get product info result:" + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("调用productServ-queryProductSku查询商品sku失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询商品列表失败";
            callback(res, null);
        } else {
            callback(null, data)
        }
    });
};

// 查询商品ＳＫＵ
Product.prototype.queryProductSku = function(productId, callback){

    logger.info("arg:" + productId);

    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProductSku", productId);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function(err, data){
        logger.info("调用productServ-queryProductSku result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
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
        baseTag:1,
        skuTemplateTag:0,
        skuTag:1,
        attributeTag:0
    });

    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryHotSKU", [paramters.productId, paramters.skuNum, param]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function(err, data){
        logger.info("调用productServ-queryHotSku result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
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
        detailKey:arg.detailKey,
        productId:arg.productId
    });
    logger.info("get productDetail info args:" + JSON.stringify(param));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProductDetail", param);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function(err, data){
        logger.info("调用productServ-queryProductDetail result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
            logger.error("调用productServ-queryProductDetail查询商品详情  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询商品详情失败！";
            callback(res,null);
        } else {
            callback(null,data[0]);
        }
    });
};

//获取类目列表
Product.prototype.getSubTree = function(subjectId, callback) {
    //参数说明：现有的thrift文件参数为subjectId，但实际使用pid，暂时用这个
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getSubTree", subjectId);

    Lich.wicca.invokeClient(subjectServ, function(err, data) {
        logger.info("调用subjectServ-getSubTree  result:" + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("调用subjectServ-getSubTree查询子分类失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询子分类失败";
            callback(res, null);
        } else {
            callback(null, data)
        }
    });
};








Product.prototype.getStock = function(productId, callback){

    // 获取client
    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer, "getStock", productId);
    //invite productServ
    Lich.wicca.invokeClient(stockServ, function(err, data){
        logger.info("调用stockServ-getStock result:" + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("调用stockServ-getStock失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "获取库存失败";
            callback(res, null);
        } else {
            callback(null, data)
        }
    });
};

Product.prototype.getStockForSku = function(paramters, callback) {
    // 获取client
    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer, "getStockForSku", [paramters.productId, [paramters.skuNum]]);

    //invite productServ
    Lich.wicca.invokeClient(stockServ, function(err, data){
        logger.info("调用stockServ-getStockForSku  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
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


Product.prototype.orderProfileQuery = function (param, callback) {
    var orderQueryConditions = new order_types.OrderQueryConditions({
        orderState: param.orderStatus || 0, count:param.percount, curPage: param.curpage});
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderProfileQuery", [param.userType, param.userId, orderQueryConditions]);

    Lich.wicca.invokeClient(orderServ, function(err, data) {
        logger.info("调用orderServ-orderProfileQuery  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
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
    var orderQueryConditions = new order_types.OrderQueryConditions({count:param.percount, curPage: param.curpage});
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "orderStateQuery", [param.userType, param.userId, orderQueryConditions]);

    Lich.wicca.invokeClient(orderServ, function(err, data) {
        logger.info("调用orderServ-orderStateQuery  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
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

    Lich.wicca.invokeClient(orderServ, function(err, data) {
        logger.info("调用orderServ-queryOrderDetail  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
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
    var pay = {payChannel:param.payChannel};
    if(param.payChannel == 4){
        pay.custId = param.openId;
    }
    var payChannel = new pay_types.PayChannel(pay);

    var payParam = new order_types.PayParam({
        userId: param.userId,
        orderIdList: param.orderIdList,
        payChannel:payChannel
    });

    logger.info("call orderServ-payApply args:" + JSON.stringify(payParam));
    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "payApply", payParam);

    Lich.wicca.invokeClient(orderServ, function(err, data) {
        logger.info("call orderServ-payApply result:" + JSON.stringify(data[0]));
        var res = {};
        if(err || data[0].code == "1"){
            logger.error("调用orderServ-payApply失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "提交订单失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

Product.prototype.payState = function(param, callback) {

    var statePara = new order_types.PayState({
        payId: param.payId
    });

    var orderServ = new Lich.InvokeBag(Lich.ServiceKey.OrderServer, "payState", statePara);
    Lich.wicca.invokeClient(orderServ, function(err, data) {
        logger.info("call orderSer-payState result:" + JSON.stringify(data));
        if(err || data[0] == '1'){
            var res = {};
            res.code = 500;
            res.desc = "查询订单状态失败！";
            callback(res, null);
        } else {
            callback(null, data[0].payState);
        }
    });
};

Product.prototype.addCartItem = function(param, callback){

    var item = new cart_types.Item({
        productId:param.productId,
        skuNum: param.skunum || '',
        count: param.count,
        price: param.price
    });

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "addItem", [param.userId, item, 2]);

    Lich.wicca.invokeClient(cartServ, function(err, data) {
        logger.info("调用cartServ-addItem  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
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

Product.prototype.deleteCartItem = function(userId, carKeys, callback){
    var carKeyList = [];
    for(var i = 0; i < carKeys.length; i++){
        var item = new cart_types.CartKey(carKeys[i]);
        carKeyList.push(item);
    }

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "deleteItem", [userId, carKeyList, 2]);

    Lich.wicca.invokeClient(cartServ, function(err, data) {
        logger.info("调用cartServ-deleteItem  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].code == "1"){
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

Product.prototype.cartListItem = function(userId, callback){

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "listItem", [userId, 2]);

    Lich.wicca.invokeClient(cartServ, function(err, data) {
        logger.info("调用cartServ-listItem  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].code == "1"){
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

Product.prototype.cartCountItem = function(userId, callback){

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "countItem", [userId, 2]);

    Lich.wicca.invokeClient(cartServ, function(err, data) {
        logger.info("调用cartServ-countItem  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
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

Product.prototype.cartUpdateItem = function(param, callback){
    var cartKey = new cart_types.CartKey({productId:param.productId,skuNum:param.skunum});
    var item = new cart_types.Item({
        productId:param.productId,
        skuNum:param.skunum,
        count:param.count,
        price:param.price || "0",
        wi: param.wi || null
    });

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "updateItem",
        [param.userId, null, cartKey, item, 2]);

    Lich.wicca.invokeClient(cartServ, function(err, data) {
        logger.info("调用cartServ-updateItem result:" + JSON.stringify(data[0]));
        var res = {};
        if(err || data[0].result.code == "1"){
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


Product.prototype.signinThirdParty = function(arg, callback){
    var loginLog = new buyer_types.LoginLog();
    var thirdpartyUser = new buyer_types.ThirdpartyUser({
        thirdType: "H5_FOSHAN",
        accountNo: arg.mobile,
        userName: arg.username || arg.mobile,
        custId: arg.mobile
    });

    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "signinThirdParty", [loginLog, thirdpartyUser]);

    Lich.wicca.invokeClient(buyerServ, function(err, data) {
        logger.info("调用buyerServ-signinThridParty  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
            logger.error("调用buyerServ-signinThridParty失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "登录失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

Product.prototype.getOrderStateBuyerEnum = function(orderState) {
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

//获取物流信息(根据orderId)
Product.prototype.expressQuery = function(arg, callback){
    var expressParams = new express_types.ExpressParams({
        orderId:arg.orderId
    });

    //获取client
    var expressServ = new Lich.InvokeBag(Lich.ServiceKey.ExpressServer,'expressQuery',[expressParams]);
    Lich.wicca.invokeClient(expressServ, function(err, data){
        logger.info("get expressInfo result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't get expressInfo because: ======" + err);
            res.code = 500;
            res.desc = "false to get expressInfo";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });




}

module.exports = new Product();