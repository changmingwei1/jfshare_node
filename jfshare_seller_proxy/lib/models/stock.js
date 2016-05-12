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
module.exports = new Stock();