/**
 * Created by Administrator on 2016/5/5 0005.
 */
/**
 *
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');



var stock_types = require('../thrift/gen_code/stock_types');


function Stock(){}
//获取某一个商品的总库存
Stock.prototype.queryProduct = function(params,callback){

    var QueryParam = new stock_types.QueryParam({
       productId:params.productId
    });


    //获取client
    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer,'queryStock',[QueryParam]);
    Lich.wicca.invokeClient(stockServ, function(err, data){
        logger.info("query stock result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't query stock because: ======" + err);
            res.code = 500;
            res.desc = "获取库存失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
//获取某一个sku的商品库存
Stock.prototype.queryBySkuAndStoreId = function(params,callback){

    var QueryParam = new stock_types.QueryParam({
        productId:params.productId,
        storehouseId:params.storehouseId,
        skuNum:params.skuNum
    });


    //获取client
    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer,'queryStock',[QueryParam]);
    Lich.wicca.invokeClient(stockServ, function(err, data){
        logger.info("query stock result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't query stock because: ======" + err);
            res.code = 500;
            res.desc = "获取库存失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new Stock();