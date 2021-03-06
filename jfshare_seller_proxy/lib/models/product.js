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

Product.prototype.create = function (params, callback) {

    var productSkuItemList = [];

    var productSkuList = params.storeinfo;
    logger.info("productSkuList " + JSON.stringify(productSkuList));
    if (productSkuList.length > 0) {
        productSkuList.forEach(function (sku) {
            if (sku != null && sku.key != null) {
                for (var i = 0; i < sku.values.length; i++) {
                    var productSkuItem = new product_types.ProductSkuItem({
                        sellerClassNum:sku.values[i].num,
                        shelf: sku.values[i].location,
                        curPrice: sku.values[i].sellprice,//销售价
                        orgPrice: sku.values[i].oriprice,//原价
                        //vPicture: params,
                        skuName: sku.key.name,
                        weight: sku.values[i].weight,
                        refPrice: sku.values[i].setprice,//结算价
                        storehouseId: sku.values[i].storeid,
                        skuNum: sku.key.id
                    });
                    productSkuItemList.push(productSkuItem);
                }


            }
        });
    }

    var productSku = new product_types.ProductSku({
        skuItems: productSkuItemList
    });

    var product = new product_types.Product({
        sellerId: params.sellerId,
        productName: params.productName,
        viceName: params.viceName,
        subjectId: params.subjectId,
        brandId: params.brandId,
        imgKey: params.imgKey,
        type: params.type,//商品类型 2表示普通商品 3表示虚拟商品
        createUserId: params.sellerId,
        skuTemplate: JSON.stringify(params.skuTemplate),
        attribute: JSON.stringify(params.attribute),
        productSku: productSku,
        postageId: params.postageId,
        detailContent: params.detailContent,
        storehouseIds: params.storehouseIds
    });


    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "addProduct", product);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("productServ-addProduct  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("productServ-addProduct  失败原因 ======" + err);
            res.code = 500;
            res.desc = "创建商品失败";
            if(err){
              return  callback(res, null);
            }else{
                res.code = 500;
                res.desc = data[0].result.failDescList[0].desc;
                logger.error("productServ-addProduct  result:" + JSON.stringify(res.desc));
                return callback(res, null);
            }
        } else {
            callback(null, data)
        }
    });
};

//更新商品信息
Product.prototype.update = function (params, callback) {

    var productSkuItemList = [];

    var productSkuList = params.storeinfo;
    logger.info("productSkuList 长度是---》" + JSON.stringify(productSkuList.length));
    if (productSkuList.length > 0) {
        productSkuList.forEach(function (sku) {
            if (sku != null && sku.key != null) {
                for (var i = 0; i < sku.values.length; i++) {
                    var productSkuItem = new product_types.ProductSkuItem({
                        sellerClassNum:sku.values[i].num,
                        shelf: sku.values[i].location,
                        curPrice: sku.values[i].sellprice,//销售价
                        orgPrice: sku.values[i].oriprice,//原价
                        //vPicture: params,
                        skuName: sku.key.name,
                        weight: sku.values[i].weight,
                        refPrice: sku.values[i].setprice,//结算价
                        storehouseId: sku.values[i].storeid,
                        skuNum: sku.key.id
                    });
                    productSkuItemList.push(productSkuItem);
                }
            }
        });
    }

    var productSku = new product_types.ProductSku({
        skuItems: productSkuItemList
    });

    var product = new product_types.Product({
        productId: params.productId,
        sellerId: params.sellerId,
        productName: params.productName,
        viceName: params.viceName,
        subjectId: params.subjectId,
        brandId: params.brandId,
        imgKey: params.imgKey,
        type: params.type,//商品类型 2表示普通商品 3表示虚拟商品
        createUserId: params.sellerId,
        skuTemplate: JSON.stringify(params.skuTemplate),
        attribute: JSON.stringify(params.attribute),
        productSku: productSku,
        postageId: params.postageId,
        detailContent: params.detailContent,
        storehouseIds: params.storehouseIds
    });
    logger.info("productServ-updateProduct  params:" + JSON.stringify(product));

    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "updateProduct", product);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("productServ-updateProduct  result:" + JSON.stringify(data));
        var res = {};
        //[{"result":{"code":1,"failDescList":[{"name":"product","failCode":"3101","desc":"商品价格校验失败，价格应大于0，原价不可低于现价"}]},"value":null}]
        if (err ||data[0].result.code == 1) {
            logger.error("productServ-updateProduct  失败原因 ======" + err + JSON.stringify(data));
            res.code = 500;
            res.desc = "更新商品失败";
            //[{"result":{"code":1,"failDescList":[{"name":"product","failCode":"3101","desc":"商品价格校验失败，价格应大于0，原价不可低于现价"}]},"value":null}]
            if(data[0].result.code == 1 && data[0].result.failDescList[0].failCode){
                res.desc = data[0].result.failDescList[0].desc;
            }
            callback(res, null);
        } else {
            callback(null, data)
        }
    });
};


//获取商品信息(编辑的时候使用)
Product.prototype.queryProduct = function (params, callback) {

    var productRetParam = new product_types.ProductRetParam({
        baseTag: 1,
        skuTemplateTag: 1,
        skuTag: 1,
        attributeTag: 1
    });


    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProduct", [params.productId, productRetParam]);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("productServ-queryProduct  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("productServ-queryProduct  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询商品失败";
            callback(res, null);
            return;
        } else {
            callback(null, data);
            return;
        }
    });
};

//获取商品信息(虚拟商品列表)
Product.prototype.statisticsProductCard = function (params, callback) {

    var productRetParam = new product_types.ProductCardStatisticsParam({
        sellerId: params.sellerId,
        productName: params.productName
    });

    var page = new pagination_types.Pagination({

        numPerPage: params.perCount,
        currentPage: params.curpage
    });

    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "statisticsProductCard", [productRetParam, page]);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("productServ-queryProduct  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("productServ-queryProduct  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询商品失败";
            callback(res, null);
        } else {
            callback(null, data)
        }
    });
};
//卡密列表
Product.prototype.queryProductCardViewList = function (params, callback) {

    var ProductCardViewParam = new product_types.ProductCardViewParam({
        sellerId: params.sellerId,
        productId: params.productId,
        cardNumber: params.cardNumber,
        state: params.state,
        sendBeginTime:params.sendBeginTime,
        sendEndTime:params.sendEndTime,
        validateBeginTime:params.validateBeginTime,
        validateEndTime:params.validateEndTime,
        sendAccount:params.sendAccount
    });

    if(params.skuNum !=""){
        ProductCardViewParam.skuNum = params.skuNum;
    }
    var page = new pagination_types.Pagination({
        numPerPage: params.perCount,
        currentPage: params.curpage
    });
    logger.error("productServ-queryProductCardViewList  result:" + JSON.stringify(ProductCardViewParam));
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProductCardViewList", [ProductCardViewParam, page]);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.error("productServ-queryProductCardViewList  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("productServ-queryProduct  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询商品失败";
            callback(res, null);
        } else {
            callback(null, data)
        }
    });
};

//获取商品信息(虚拟商品列表)
Product.prototype.queryProductCard = function (params, callback) {

    var productRetParam = new product_types.ProductCardStatisticsParam({
        sellerId: params.sellerId,
        productName: params.productName
    });
    var page = new pagination_types.Pagination({
        numPerPage: params.perCount,
        currentPage: params.curpage
    });
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "statisticsProductCard", [productRetParam, page]);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("productServ-statisticsProductCard  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("productServ-statisticsProductCard  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询虚拟商品失败";
            return callback(res, null);
        }else if(data==null){
            return callback(null,null);
        }else if(data[0].result.code ==1){
            logger.error("productServ-statisticsProductCard  失败原因 ======" + data);
            res.code = 500;
            res.desc = "查询虚拟商品失败";
            return callback(res, null);
        }else {
            return callback(null, data)
        }
    });
};

//statisticsSkuProductCard
Product.prototype.statisticsSkuProductCard = function (params, callback) {

    var productRetParam = new product_types.ProductCardSkuStatisticsParam({
        sellerId: params.sellerId,
        productId: params.productId
    });
    var page = new pagination_types.Pagination({
        numPerPage: params.perCount,
        currentPage: params.curpage
    });
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "statisticsSkuProductCard",[productRetParam, page]);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("productServ-statisticsSkuProductCard  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("productServ-statisticsSkuProductCard  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询虚拟商品失败";
            return callback(res, null);
        }else if(data==null){
            return callback(null,null);
        }else if(data[0].result.code ==1){
            logger.error("productServ-statisticsSkuProductCard  失败原因 ======" + data);
            res.code = 500;
            res.desc = "查询虚拟商品失败";
            return callback(res, null);
        }else {
            return callback(null, data)
        }
    });
};



////申请上架
//Product.prototype.setProductState = function (params, callback) {
//
//    var productOpt = new product_types.ProductOpt({
//        productId: params.productId,
//        curState: params.curState,
//        activeState: params.activeState,
//        desc: "申请上架",
//        operatorId: params.sellerId,
//        operatorType: 1
//    });
//
//
//    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "setProductState", [productOpt]);
//
//    Lich.wicca.invokeClient(productServ, function (err, data) {
//        logger.info("productServ-queryProduct  result:" + JSON.stringify(data));
//        var res = {};
//        if (err) {
//            logger.error("productServ-queryProduct  失败原因 ======" + err);
//            res.code = 500;
//            res.desc = "查询商品失败";
//            callback(res, null);
//        } else {
//            callback(null, data)
//        }
//    });
//};
Product.prototype.queryDetail = function (params, callback) {

    var productDetailParam = new product_types.ProductDetailParam({
        productId: params.productId,
        detailKey: params.detailKey
    });
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProductDetail", [productDetailParam]);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("productServ-queryDetail  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("productServ-queryDetail  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询详情失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};


Product.prototype.setProductState = function (params, callback) {

    var productOpt = new product_types.ProductOpt({
        productId: params.productId,
        curState: params.curState,
        activeState: params.activeState,
        operatorId: params.sellerId,
        operatorType: 1
    });
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "setProductState", [productOpt]);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("productServ-setProductState  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("productServ-setProductState  失败原因 ======" + err + JSON.stringify(data));
            res.code = 500;
            res.desc = "申请上架或下架失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

//查询商品详情
Product.prototype.queryProductDetail = function (arg, callback) {

    var param = new product_types.ProductDetailParam({
        detailKey: arg.detailKey,
        productId: arg.productId
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


//导入虚拟商品
Product.prototype.improtVirtual = function (param, callback) {

    var ProductCardImportParam = new product_types.ProductCardImportParam({
        sellerId:param.sellerId,
        path:param.path,
        productId:param.productId
    });


    logger.error("import virtual product  args:" + JSON.stringify(param));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "importProductCard", ProductCardImportParam);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.error("调用productServ-improtVirtual result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("参数："+JSON.stringify(ProductCardImportParam)+"调用productServ-improtVirtual  失败原因 ======" + err + JSON.stringify(data));
            res.code = 500;
            res.desc = "导入虚拟商品失败！";
            //[{"code":1,"failDescList":[{"name":"productCard","failCode":"5502","desc":"商品卡密导入失败"}]}]
            if(data[0].code == 1 && data[0].failDescList!=null && data[0].failDescList[0].failCode!=null){
                res.desc = data[0].failDescList[0].desc;
            }
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//查询订单详情页中的kami信息
Product.prototype.queryProductOrderCard = function (params, callback) {
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

//验证虚拟商品兑换码
Product.prototype.reCaptcha = function (params, callback) {
    var productCardParam = new product_types.ProductCard({
        sellerId:params.sellerId,
        cardNumber:params.captchaNum
    });
    logger.error("调用 productServ-reCaptcha 入参:" + JSON.stringify(params));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "useProductCard", productCardParam);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.error("调用 productServ-reCaptcha result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("调用 productServ-reCaptcha  失败原因 ======" + err);
            res.code = 500;
            res.desc = "券码验证失败";
            callback(res, null);
        }else if(data[0].result.code == 1){
            logger.error("调用 productServ-reCaptcha 失败code=1");
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

//查询卖家虚拟商品验证列表
Product.prototype.queryCaptchaList = function (params, callback) {

    var page = new pagination_types.Pagination({
        numPerPage: params.perCount,
        currentPage: params.curPage
    });
    var captchaQueryParam = new product_types.CaptchaQueryParam({
        sellerId:params.sellerId,
        pagination:page
    });
    logger.info("调用 productServ-queryCaptchaList 入参:" + JSON.stringify(params));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryCaptchaList", captchaQueryParam);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用 productServ-queryCaptchaList result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用 productServ-queryCaptchaList  失败原因 ======" + err);
            res.code = 500;
            res.desc = "调用productServ-queryCaptchaList 失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

//查询卖家虚拟商品每月及每天统计
Product.prototype.queryCaptchaTotalList = function (params, callback) {

    var page = new pagination_types.Pagination({
        numPerPage: params.perCount,
        currentPage: params.curPage
    });
    var captchaQueryParam = new product_types.CaptchaQueryParam({
        sellerId:params.sellerId,
        pagination:page,
        monthQuery:params.date
    });
    logger.warn("调用 productServ-queryCaptchaTotalList 入参:" + JSON.stringify(params));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryCaptchaTotalList", captchaQueryParam);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.warn("调用 productServ-queryCaptchaTotalList result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用 productServ-queryCaptchaTotalList  失败原因 ======" + err);
            res.code = 500;
            res.desc = "调用productServ-queryCaptchaTotalList 失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

//查询每天验码统计数
Product.prototype.queryCaptchaDayTotalList = function (params, callback) {

    var page = new pagination_types.Pagination({
        numPerPage: params.perCount,
        currentPage: params.curPage
    });
    var captchaDayQueryParam = new product_types.CaptchaDayQueryParam({
        sellerId:params.sellerId,
        pagination:page,
        date:params.date
    });
    logger.warn("调用 productServ-queryCaptchaDayTotalList 入参:" + JSON.stringify(params));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryCaptchaDayTotalList", captchaDayQueryParam);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.warn("调用 productServ-queryCaptchaDayTotalList result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用 productServ-queryCaptchaDayTotalList  失败原因 ======" + err);
            res.code = 500;
            res.desc = "调用productServ-queryCaptchaDayTotalList 失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

//卖家虚拟商品验证列表明细
Product.prototype.queryCaptchaDetails = function (params, callback) {

    var page = new pagination_types.Pagination({
        numPerPage: params.perCount,
        currentPage: params.curPage
    });
    var captchaQueryParam = new product_types.CaptchaQueryParam({
        productId:params.productId,
        pagination:page,
        monthQuery:params.queryDate,
        sellerId:params.sellerId
    });
    logger.info("调用 productServ-queryCaptchaDetails 入参:" + JSON.stringify(captchaQueryParam));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryCaptchaDetails", captchaQueryParam);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用 productServ-queryCaptchaDetails result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("调用 productServ-queryCaptchaDetails  失败原因 ======" + err);
            res.code = 500;
            res.desc = "调用productServ-queryCaptchaDetails 失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

//获取买家--买家--买家个人信息
Product.prototype.getBuyer = function(param,callback){

    var buyer = new buyer_types.Buyer({userId:param.userId});

    logger.info("get buyer param-------:" + JSON.stringify(buyer));
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getBuyer',[buyer]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("get buyer result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't get buyer because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyer";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        }else{
            callback(null, data);
        }
    });
};

//批量获取买家--买家信息
Product.prototype.getBuyerList = function(param,callback){

    logger.info("param--- buyer result:" + JSON.stringify(param));
   //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getListBuyer',[param]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("get buyer result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't get buyer because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyer";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        }else{
            callback(null, data);
        }
    });
};

/*查询商品*/
Product.prototype.queryProductForSeller = function (productId, baseTag, skuTemplateTag, skuTag, attributeTag, callback) {
    var param = new product_types.ProductRetParam({
        baseTag: baseTag,
        skuTemplateTag: skuTemplateTag,
        skuTag: skuTag,
        attributeTag: attributeTag
    });

    logger.info("get product info args:" + JSON.stringify(param));
    logger.info("get product info args--productId:" + JSON.stringify(productId));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProduct", [productId, param]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("get product info result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("调用productServ-queryProduct查询商品失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询商品列表失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


// 导出统计sku产品卡片信息
Product.prototype.exportStatisticsSkuProductCard = function (params, callback) {

    var staticParams = new product_types.ProductCardViewParam({
        sellerId:params.sellerId,
        productId:params.productId,
        cardNumber:params.cardNumber,
        state:params.state,
        skuNum:params.skuNum,
        sendBeginTime:params.sendBeginTime,
        sendEndTime:params.sendEndTime,
        validateBeginTime:params.validateBeginTime,
        validateEndTime:params.validateEndTime,
        sendAccount:params.sendAccount,
        exportPassword:params.exportPassword
    });
    logger.warn("调用 productServ-exportStatisticsSkuProductCard 入参:" + JSON.stringify(staticParams));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "exportStatisticsSkuProductCard", staticParams);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.warn("调用 productServ-exportStatisticsSkuProductCard result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("调用 productServ-exportStatisticsSkuProductCard  失败原因 ======" + err);
            res.code = 500;
            res.desc = "调用productServ-exportStatisticsSkuProductCard 失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};


module.exports = new Product();