/**
 * Created by huapengpeng on 2016/4/22.
 */
/**
 * Created by zhaoshenghai on 16/3/20.
 */

var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');


var storehouse_types = require("../thrift/gen_code/baseTemplate_types");



function Storehouse(){}

// 添加仓库
Storehouse.prototype.add = function(params, callback){

    var storehouse = new storehouse_types.Storehouse({
        sellerId:params.sellerId,
        name:params.name,
        supportProvince:params.supportProvince
    });

    logger.info("调用addStorehouse:" + JSON.stringify(storehouse));
    // 获取client
    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.StorehouseServer, "addStorehouse",storehouse);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-addStorehouse result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("调用addressServ-addAddress失败  失败原因 ======" + err);

            var result = {};
            result.code = 500;
            result.desc = "添加仓库失败！";

            logger.error("调用storehouseServ-addStorehouse失败  失败原因 ======" + err);

            callback(result, null);

        }
        callback(data);
    });
};


// 获取仓库
Storehouse.prototype.add = function(params, callback){

    var list = [];
    list.push(params.storeId);
    logger.info("调用getStorehouse:" + JSON.stringify(storehouse));
    // 获取client
    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.StorehouseServer, "getStorehouse",list);
    //调用 storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-getStorehouse result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("storehouseServ-getStorehouse失败  失败原因 ======" + err);

            var result = {};
            result.code = 500;
            result.desc = "获取仓库失败！";

            logger.error("storehouseServ-getStorehouse失败  失败原因 ======" + err);

            callback(result, null);

        }
        callback(data);
    });
};

//更新仓库
Storehouse.prototype.update = function(params, callback){

    var storehouse = new storehouse_types.Storehouse({
        sellerId:params.sellerId,
        id:params.id,
        name:params.name,
        supportProvince:params.supportProvince
    });



    logger.info("updateStorehouse:" + JSON.stringify(storehouse));
    // 获取client
    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.StorehouseServer, "updateStorehouse",storehouse);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-updateStorehouse result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("调用storehouseServ-updateStorehouse失败  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "更新仓库失败！";
            callback(result,data);
        }
        callback(null,data);
    });
};

//删除仓库
Storehouse.prototype.delete = function(params, callback){

    // 获取client
    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.StorehouseServer, "deleteStorehouse",[params.sellerId,params.id]);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-deleteStorehouse result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("调用storehouseServ-deleteStorehouse  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "删除仓库失败！";
            callback(result,data);
        }
        callback(null,data);
    });
};



//查询仓库列表
Storehouse.prototype.list = function(params, callback){
    var addressList = [];
    var storehouse = ({
        id:1,sellerId:5,name:"华北仓",
        supportProvince:"220000,370000,220000,630000,330000,440000"
    });

    var storehouse1 = ({
        id:2,sellerId:5,name:"华南仓",
        supportProvince:"460000,210000,220000,620000,330000,440000"
    });


    addressList.push(storehouse);
    addressList.push(storehouse1);
    callback(result,addressList);
    // 获取client

    //var queryParam = new storehouse_types.StorehouseQureyParam({
    //    id      :params.id,
    //    sellerId:params.sellerId
    //});
    //
    //var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.StorehouseServer, "queryStorehouse",queryParam);
    //// 调用 storehouseServ
    //Lich.wicca.invokeClient(storehouseServ, function (err, data) {
    //    logger.info("storehouseServ-queryStorehouse result:" + JSON.stringify(data[0]));
    //    if(err || data[0].result.code == 1){
    //        logger.error("调用storehouseServ-queryStorehouse  失败原因 ======" + err);
    //        var result = {};
    //        result.code = 500;
    //        result.desc = "查询仓库列表失败！";
    //        callback(result,data);
    //    }else{
    //        callback(null, data[0].storehouseList);
    //    }
    //
    //});


    callback(null,addressList);
    /*********************以上是测试数据****************************/
};


module.exports = new Storehouse();