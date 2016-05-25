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

/*获取虚拟商品卡密（关键接口）*/
Product.prototype.getProductCard = function(param, callback){

    var params = new product_types.ProductCardParam({
        productId: param.productId,
        transactionId: param.orderId,
        num: param.num,
        skuNum: param.skuNum
    });

    var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "getProductCard", params);

    Lich.wicca.invokeClient(productServ, function(err, data) {
        logger.info("调用productServ-getProductCard  result:" + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("调用productServ-getProductCard  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询虚拟商品卡密失败";
            callback(res, null);
        } else if (data[0].result.code == 1){
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else{
            callback(null, data);
        }
    });
};

module.exports = new Product();