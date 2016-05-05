/**
 * Created by huapengpeng on 2016/4/22.
 */


var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');


var freight_types = require("../thrift/gen_code/template_types");



function Freight(){}

// 添加运费模板
Freight.prototype.add = function(params, callback){

    var freight = new freight_types.Postage({
        id             :params.id,
        sellerId       :params.sellerId,
        name           :params.name,
        supportProvince:params.supportProvince,
        rule           :params.rule,
        type           :params.type
    });



    logger.info("调用addPostage:" + JSON.stringify(freight));
    // 获取client
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.FreightServer, "addPostageTemplate",freight);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-addPostageTemplate result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("freightServ-addPostageTemplate  失败原因 ======" + err);

            var result = {};
            result.code = 500;
            result.desc = "添加运费模板失败！";
            callback(result, null);

        }
        callback(data);
    });
};


//更新运费模板
Freight.prototype.update = function(params, callback){

    var freight = new freight_types.Postage({
        id             :params.id,
        sellerId       :params.sellerId,
        name           :params.name,
        supportProvince:params.supportProvince,
        rule           :params.rule,
        type           :params.type
    });



    logger.info("updatePostage:" + JSON.stringify(freight));
    // 获取client
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.FreightServer, "updatePostageTemplate",freight);
    // 调用 freightServ
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-updatePostageTemplate result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("freightServ-updatePostageTemplate  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "更新运费模板失败！";
            callback(result,data);
        }
        callback(null,data);
    });
};

//删除运费模板
Freight.prototype.delete = function(params, callback){


    // 获取client
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.FreightServer, "deletePostageTemplate",[params.sellerId,params.id]);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-deletePostageTemplate result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("freightServ-deletePostageTemplate  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "删除运费模板失败！";
            callback(result,data);
        }
        callback(null,data);
    });
};

//获取运费模板
Freight.prototype.get = function(params, callback){

    var idList = [];
    idList.push(params.id);

    // 获取client
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.FreightServer, "getPostageTemplate",[idLists]);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-getPostageTemplate result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("freightServ-getPostageTemplate  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "获取运费模板失败！";
            callback(result,data);
        }
        callback(null,data);
    });
};


//查询运费模板列表
Freight.prototype.list = function(params, callback){
    var freight_types = new freight_types.PostageQureyParam();
    logger.info("deleteStorehouse:" + JSON.stringify(storehouse));
    // 获取client
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.FreightServer, "queryPostageTemplate",PostageQureyParam);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-queryPostageTemplate result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("freightServ-queryPostageTemplate  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "查询运费模板失败！";
            callback(result,data);
        }else{
            callback(null, data[0].storehouseList);
        }

    });



    callback(null,addressList);
    /*********************以上是测试数据****************************/
};


module.exports = new Freight();