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
var slotImage_types = require('../thrift/gen_code/slotImage_types');
var result_types = require('../thrift/gen_code/result_types');
//var manager_types = require('../thrift/gen_code/manager_types');

function Active(){}

//获取首页轮播图列表
Active.prototype.querySlotImageList = function(param,callback){
    var imageParm = new slotImage_types.QuerySlotImageParam({
        type:param.type
    });
    logger.info(imageParm);
    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer,'querySlotImageList',imageParm);
    Lich.wicca.invokeClient(managerServ, function(err, data){
        logger.info("获取到的资源:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("不能获取，因为: ======" + err);
            res.code = 500;
            res.desc = "不能获取到资源";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//获取系统消息列表
Active.prototype.querySlotImageList = function(param,callback){
    var imageParm = new slotImage_types.QuerySlotImageParam({
        type:param.type
    });
    logger.info(imageParm);
    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer,'querySlotImageList',imageParm);
    Lich.wicca.invokeClient(managerServ, function(err, data){
        logger.info("获取到的资源:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("不能获取，因为: ======" + err);
            res.code = 500;
            res.desc = "不能获取到资源";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


module.exports = new Active();