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
    var thrift_params = new product_types.ProductSurveyQueryParam();

    thrift_params.pagination = thrift_pagination;
    thrift_params.sellerId = params.sellerId;
    thrift_params.productName = params.productName;
    thrift_params.activeState = params.activeState;
    thrift_params.productId = params.productId;
    thrift_params.subjectId = 0;//默认是获取所有商品
    thrift_params.sort = "create_time DESC";


    //判断卖家id是否为空

    logger.info("调用productServ-queryProductList args:" + JSON.stringify(thrift_params));
    // 获取client
    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "productSurveyQuery", thrift_params);
    // 调用 productServ
    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("调用productServ-queryProductList result:" + JSON.stringify(data[0]));
        if (err || data[0].result.code == 1) {
            logger.error("调用productServ-queryProductList失败  失败原因 ======" + err);
            ret.code = 500;
            ret.desc = "查询商品列表失败！";
            res.json(ret);
            return;
        }
        callback(data);
    });
};

Product.prototype.create = function (params, callback) {

    var productSkuList = [];

    var productSkuItem = new product_types.ProductSkuItem({
        sellerClassNum: params,
        shelf: params,
        curPrice: params,
        orgPrice: params,
        vPicture: params,
        skuName: params,
        weight: params,
        refPrice: params,
        storehouseId: params,
        skuNum: params

    });

    productSkuList.push(productSkuItem);
    var product = new product_types.Product({
        sellerId: params.sellerId,
        productName: params.brandId,
        viceName: params.brandId,
        subjectId: params.subjectId,
        brandId: params.subjectId,
        imgKey: params.img_key,
        //detailKey:params.detailkey,
        //maxBuyLimit:params.maxBuyLimit
        type: params.type,//商品类型 2表示普通商品 3表示虚拟商品

        createUserId: params.sellerId,
        skuTemplate: params.skuTemplate,
        attribute: params.attribute,
        productSku: params.productSkuList,

        storehouseIds: params.storehouseIds,
        postageId: params.postageId
    });


    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "addProduct", product);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("productServ-addProduct  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("productServ-addProduct  失败原因 ======" + err);
            res.code = 500;
            res.desc = "创建商品失败";
            callback(res, null);
        } else {
            callback(null, data)
        }
    });
};

//更新商品信息
Product.prototype.update = function (params, callback) {

    var productSkuList = [];

    var productSkuItem = new product_types.ProductSkuItem({
        sellerClassNum: params,
        shelf: params,
        curPrice: params,
        orgPrice: params,
        vPicture: params,
        skuName: params,
        weight: params,
        refPrice: params,
        storehouseId: params,
        skuNum: params

    });

    productSkuList.push(productSkuItem);
    var product = new product_types.Product({
        sellerId: params.sellerId,
        productName: params.brandId,
        viceName: params.brandId,
        subjectId: params.subjectId,
        brandId: params.subjectId,
        imgKey: params.img_key,
        //detailKey:params.detailkey,
        //maxBuyLimit:params.maxBuyLimit
        type: params.type,//商品类型 2表示普通商品 3表示虚拟商品

        createUserId: params.sellerId,
        skuTemplate: params.skuTemplate,
        attribute: params.attribute,
        productSku: params.productSkuList,

        storehouseIds: params.storehouseIds,
        postageId: params.postageId
    });


    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "updateProduct", product);

    Lich.wicca.invokeClient(productServ, function (err, data) {
        logger.info("productServ-updateProduct  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("productServ-updateProduct  失败原因 ======" + err);
            res.code = 500;
            res.desc = "更新商品失败";
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


    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProduct", [params.productId,productRetParam]);

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


module.exports = new Product();