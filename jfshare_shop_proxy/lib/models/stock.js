/**
 * @author YinBo 2016/4/12
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
var stock_types = require('../thrift/gen_code/stock_types');

function Stock(){}

/*查询库存*/
Stock.prototype.queryStock = function(params,callback){
    var param = new stock_types.QueryParam({
        productId: params.productId,
        storehouseId: params.storehouseId,
        skuNum: params.skuNum
    });
    //获取client
    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer,'queryStock',param);
    Lich.wicca.invokeClient(stockServ, function(err, data){
        logger.info("getStock result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == 1) {
            logger.error("false to getStock , because: ======" + err);
            res.code = 500;
            res.desc = "false to getStock";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*批量查询库存接口*/
Stock.prototype.batchQueryStock = function (params, callback) {

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

    logger.info("query stock --batchQueryParam--- params---------->:" + JSON.stringify(batchQueryParam));

    var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer, 'batchQueryStock', [batchQueryParam]);
    Lich.wicca.invokeClient(stockServ, function (err, data) {
        logger.info("query stock result---------->:" + JSON.stringify(data));

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


module.exports = new Stock();