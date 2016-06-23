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
            logger.error("请求参数：" + JSON.stringify(params));
            logger.error("false to getStock , because: ======" + JSON.stringify(data));
            res.code = 500;
            res.desc = "false to getStock";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new Stock();