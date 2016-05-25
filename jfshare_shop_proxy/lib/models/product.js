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

// 查询商品列表，包含带条件查询：类目、卖家id
Product.prototype.queryProductList = function (params, callback) {

    var thrift_pagination = new pagination_types.Pagination({
        currentPage: params.curPage || 1,
        numPerPage: params.perCount
    });
    var thrift_params = new product_types.ProductSurveyQueryParam({
        pagination: thrift_pagination,
        subjectId: params.subjectId,
        sellerId: params.sellerId,
        brandId: params.brandId,
        activeState: 300,
        /* create_time DESC:按创建时间降序
         cur_price DESC:按现价降序
         cur_price ASC:按现价升序
         click_rate DESC:按点击量降序 */
        sort: params.sort || 'create_time DESC'
    });
    logger.info("调用productServ-queryProductList args:" + JSON.stringify(thrift_params));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "productSurveyQuery", thrift_params);
    // 调用 productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用productServ-queryProductList result:" + JSON.stringify(data[0]));
        var ret = {};
        if (err) {
            logger.error("调用productServ-queryProductList失败  失败原因 ======" + err);
            ret.code = 500;
            ret.desc = "查询商品列表失败！";
            callback(ret, null);
        } else if (data[0].result.code == 1 && data[0].result.productSurveyList == null) {
            ret.code = 200;
            ret.desc = "列表为空";
            ret.productList = [];
            callback(ret, null);
            logger.info("调用productServ-queryProductList result:" + JSON.stringify(data[0]));
        } else {
            callback(null, data);
        }
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
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
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

/*查询商品指定sku*/
Product.prototype.queryHotSKUV1 = function (paramters, callback) {

    var param = new product_types.ProductRetParam({
        baseTag: 1,
        skuTemplateTag: 1,
        skuTag: 1,
        attributeTag: 1
    });
    var params = new product_types.ProductSkuParam({
        productId: paramters.productId,
        storehouseId: paramters.storehouseId,
        skuNum: paramters.skuNum
    });
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryHotSKUV1", [params, param]);

    //invite productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用productServ-queryHotSKUV1 result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("调用productServ-queryHotSKUV1  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询商品sku信息失败！";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            if (data[0].result.failDescList[0].failCode == 3001) {

                logger.error("调用productServ-queryHotSKUV1  失败原因 ======" + err);
                logger.error("如果走到这里----证明是没有对应的仓库,请注意这不是错误" + err);
                callback(1, null);
            } else {


                res.code = 500;
                res.desc = data[0].result.failDescList[0].desc;
                callback(res, null);
            }

        } else {
            callback(null, data[0]);
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

//获取类目列表
Product.prototype.getSubTree = function (param, callback) {

    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getSubTree", [param.subjectId]);

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

/*批量获取指定sku*/
Product.prototype.queryHotSKUBatch = function (params, callback) {
    var productRetParam = new product_types.ProductRetParam({
        skuTag: 1
    });
    var list = [];
    var skuList = params.productStockAndPriceList;
    logger.info("批量查询库存和价格参数111111：" + JSON.stringify(skuList));
    for (var i = 0; i < skuList.length; i++) {
        if (skuList[i].storehouseId != 0) {
            var ProductSkuParam = new product_types.ProductSkuParam({
                productId: skuList[i].productId,
                skuNum: skuList[i].skuNum,
                storehouseId: skuList[i].storehouseId
            });
            list.push(ProductSkuParam);
        }
    }
    if(list.length ==0){
        var data =[
            {
                "productList": []
            }
        ];
        callback(null,data);
        return;
    }
    var productSkuBatchParam = new product_types.ProductSkuBatchParam({
        productSkuParams: list
    });
    logger.info("批量查询库存和价格参数：" + JSON.stringify(productSkuBatchParam));

    //获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, 'queryHotSKUBatch', [productSkuBatchParam, productRetParam]);
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("queryHotSKUBatch result:" + JSON.stringify(data));

        if (err || data[0].result.code == "1") {
            var res = {};
            logger.error("queryHotSKUBatch fail because: ======" + err);
            res.code = 500;
            res.desc = "获取商品sku信息失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//获取物流信息(根据orderId)
Product.prototype.expressQuery = function (arg, callback) {
    var expressParams = new express_types.ExpressParams({
        orderId: arg.orderId
    });

    //获取client
    var expressServ = new Lich.InvokeBag(Lich.ServiceKey.ExpressServer, 'expressQuery', [expressParams]);
    Lich.wicca.invokeClient(expressServ, function (err, data) {
        logger.info("get expressInfo result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
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