/**
 * Created by Administrator on 2016/5/5 0005.
 */
/**
 *
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');


var stock_types = require('../thrift/gen_code/stock_types');


function Stock() {
}

/***
 * 参数格式
 * {

    "productList": [
      {
        "productId":"ze151228152841000732"
      }
    ]
}

 */
//获取某一个商品的总库存,需要提供产品的id列表list
Stock.prototype.queryProductTotal = function (params, callback) {

    var productList = params.productList;
    var res = {};
    if (productList == null || productList.length <= 0) {
        res.code = 500;
        res.desc = "产品ID列表不能为空";
        callback(res, null);
    }
    var queryContents = [];
    for (var i = 0; i < productList.length; i++) {
        queryContents.push(productList[i].productId);
    }
    var batchQueryParam = new stock_types.BatchQueryParam({
        queryContents: queryContents,
        queryType: "total"
    });
    //获取client
    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer, 'batchQueryStock', [batchQueryParam]);
    Lich.wicca.invokeClient(stockServ, function (err, data) {
        logger.info("query stock result:" + JSON.stringify(data));

        if (err || data[0].result.code == "1") {
            logger.error("can't query stock because: ======" + err);
            res.code = 500;
            res.desc = "获取库存失败";
            callback(res, null);
        } else {
            callback(null, data[0].stockInfos);
        }
    });
};

///* 创建库存接口 */
//result.Result createStock(1:string tranId, 2:StockInfo stockInfo)

//获取某一个商品的总库存,需要提供产品的id列表list
Stock.prototype.createStock = function (params, callback) {

    var stockList = [];
    var total = 0;
    var productSkuList = params.storeinfo;
    logger.info("productSkuList 长度是---》" + JSON.stringify(productSkuList.length));
    if (productSkuList.length > 0) {
        productSkuList.forEach(function (sku) {
            if (sku != null && sku.key != null) {
                for (var i = 0; i < sku.values.length; i++) {
                    var stockItem = new stock_types.StockItem({
                        skuNum:sku.key.id,
                        lockCount:0,
                        count:sku.values[i].storecount,//storecount
                        storehouseId: sku.values[i].storeid
                    });
                    total+=sku.values[i].storecount;
                    stockList.push(stockItem);
                }


            }
        });
    }


    var StockInfo = new stock_types.StockInfo({
        total:total,
        productId:params.productId,
        lockTotal:0,
        stockItems:stockList
    });

    //获取client
    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer, 'createStock', [params.productId,StockInfo]);
    Lich.wicca.invokeClient(stockServ, function (err, data) {
        logger.info("createStock result:" + JSON.stringify(data));

        if (err || data[0].code == "1") {
            logger.error("can'tcreateStock because: ======" + err);
            res.code = 500;
            res.desc = "创建库存失败";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

//更新库存
Stock.prototype.updateStock = function (params, callback) {

    var stockList = [];
    var total = 0;
    var productSkuList = params.storeinfo;
    logger.info("productSkuList 长度是---》" + JSON.stringify(productSkuList.length));
    if (productSkuList.length > 0) {
        productSkuList.forEach(function (sku) {
            if (sku != null && sku.key != null) {
                for (var i = 0; i < sku.values.length; i++) {
                    var stockItem = new stock_types.StockItem({
                        skuNum:sku.key.id,
                        lockCount:0,
                        count:sku.values[i].storecount,//storecount
                        storehouseId: sku.values[i].storeid

                    });
                    total+=sku.values[i].storecount;
                    stockList.push(stockItem);
                }


            }
        });
    }


    var StockInfo = new stock_types.StockInfo({
        total:total,
        productId:params.productId,
        lockTotal:0,
        stockItems:stockList
    });

    //获取client
    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer, 'supplyFullStock', [params.productId,StockInfo]);
    Lich.wicca.invokeClient(stockServ, function (err, data) {
        logger.info("updateStock result:" + JSON.stringify(data));

        if (err || data[0].code == "1") {
            var res = {};
            logger.error("can'tcreateStock because: ======" + err);
            res.code = 500;
            res.desc = "更新库存失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


module.exports = new Stock();