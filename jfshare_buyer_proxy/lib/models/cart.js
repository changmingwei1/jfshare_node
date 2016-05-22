/**
 * @author YinBo 2016/4/24
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
//var soltImage_types = require('../thrift/gen_code/soltImage_types');

function Cart(){}

/************************************************现在的****************************************************/
//获取购物车商品数量
Cart.prototype.countItem = function(param, callback){
    var source = param.source;
    //获取client
    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "countItem", [param.userId + "", source]);
    Lich.wicca.invokeClient(cartServ, function(err, data) {
        logger.info("调用cartServ-countItem  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
            logger.error("调用cartServ-countItem失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "购物车商品数失败！";
            callback(res, null);
        } else {
            logger.info("get cart item list:" + JSON.stringify(data[0]));
            callback(null, data[0].value);
        }
    });
};

//添加购物车项目
Cart.prototype.addCartItem = function(param, callback){

    var item = new cart_types.Item({
        productId:param.productId,
        skuNum: param.skuNum,
        count: param.count,
        price: param.price
    });

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "addItem", [param.userId + "",item,param.source]);

    Lich.wicca.invokeClient(cartServ, function(err, data) {
        logger.info("调用cartServ-addItem  result:" + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("调用cartServ-addItem失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "添加购物车失败！";
            callback(res, null);
        } else if(data[0].result.code == 1){
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        }else{
            logger.info("add cart item:" + JSON.stringify(data[0]));
            callback(null, data[0].checkList);
        }
    });
};

//删除购物车
Cart.prototype.deleteCartItem = function(param, callback){

    var cartKeyList = [];
    var cartKey;
    if(param.source == 1){
        cartKey = JSON.parse(param.cartKey);
    }
    if(param.source == 2){
        cartKey = param.cartKey;
    }
    for(var i = 0; i < cartKey.length; i++){
        var item = new cart_types.CartKey(cartKey[i]);
        cartKeyList.push(item);
    }

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "deleteItem", [param.userId + "", cartKeyList, param.source]);

    Lich.wicca.invokeClient(cartServ, function(err, data) {
        logger.info("调用cartServ-deleteItem  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].code == "1"){
            logger.error("调用cartServ-deleteItem失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "删除购物车失败！";
            callback(res, null);
        } else {
            logger.info("delete cart item:" + JSON.stringify(data[0]));
            callback(null, data[0].checkList);
        }
    });
};

//购物车列表
Cart.prototype.cartListItem = function(param, callback){
    /*source  0:系统；1：PC；2：无线*/
    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "listItem", [param.userId + "", param.source]);

    Lich.wicca.invokeClient(cartServ, function(err, data) {
        logger.info("调用cartServ-listItem  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].code == "1"){
            logger.error("调用cartServ-listItem失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "添加购物车失败！";
            callback(res, null);
        } else {
            logger.info("get cart item list:" + JSON.stringify(data[0]));
            callback(null, data[0].itemList);
        }
    });
};

//修改购物车中商品的数量
Cart.prototype.cartUpdateItem = function(param, callback){
    var cartKey = new cart_types.CartKey({productId:param.productId,skuNum:param.skuNum});
    var item = new cart_types.Item({
        productId:param.productId,
        skuNum:param.skuNum,
        count:param.count,
        price:param.price,
        wi: param.wi || null
    });

    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "updateItem",[param.userId + "", null, cartKey, item, param.source]);

    Lich.wicca.invokeClient(cartServ, function(err, data) {
        logger.info("调用cartServ-updateItem result:" + JSON.stringify(data[0]));
        var res = {};
        if(err || data[0].result.code == "1"){
            logger.error("调用cartServ-countItem失败  失败原因 ======" + err);
            logger.error("错误信息:" + JSON.stringify(data[0].result));
            res.code = 500;
            res.desc = "购物车商品数失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

module.exports = new Cart();