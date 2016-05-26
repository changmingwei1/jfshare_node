/**
 * @auther YinBo 2016/4/12
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
var seller_types = require('../thrift/gen_code/seller_types');
//var soltImage_types = require('../thrift/gen_code/soltImage_types');

function Seller(){}

/*获取卖家用户信息*/
Seller.prototype.querySeller = function(sellerId,baseTag,callback){

    var param = new seller_types.SellerRetParam({
        baseTag:baseTag || 1  //需要查询出的粒度，0:不需要此信息,1:需要此信息
    });

    //获取client
    var SellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer,'querySeller',[sellerId,param]);
    Lich.wicca.invokeClient(SellerServ, function(err, data){
        logger.info("get buyer result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't get buyer because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyer";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*批量获取卖家用户信息*/
Seller.prototype.querySellerBatch = function(params,callback){

    var param = new seller_types.SellerRetParam({
        baseTag:1  //需要查询出的粒度，0:不需要此信息,1:需要此信息
    });
    var sellerIds = [];
    if(params.sellerIdList != null && params.sellerIdList.length > 0){
        for(var i = 0 ; i < params.sellerIdList.length ; i++){
            var sellerId = params.sellerIdList[i].sellerId;
            sellerIds.push(sellerId);
        }
    }
    //获取client
    var SellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer,'querySellerBatch',[sellerIds,param]);
    Lich.wicca.invokeClient(SellerServ, function(err, data){
        logger.info("get buyer result:" + JSON.stringify(data[0]));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't get buyer because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyer";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};

module.exports = new Seller();