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
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.FreightServer, "addPostage",freight);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-addPostage result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("freightServ-addPostage失败  失败原因 ======" + err);

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
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.FreightServer, "updatePostage",storehouse);
    // 调用 freightServ
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-updatePostage result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("freightServ-updatePostage失败  失败原因 ======" + err);
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
    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.FreightServer, "deletePostage",storehouse);
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



//查询运费模板列表
Freight.prototype.list = function(params, callback){

    logger.info("deleteStorehouse:" + JSON.stringify(storehouse));
    // 获取client
    //var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.StorehouseServer, "queryStorehouse",storehouse);
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
    /*****************
     *
     *
     *
     * 530000	云南省
     710000	台湾省
     220000	吉林省
     510000	四川省
     340000	安徽省
     370000	山东省
     140000	山西省
     440000	广东省
     320000	江苏省
     360000	江西省
     130000	河北省
     410000	河南省
     330000	浙江省
     460000	海南省
     420000	湖北省
     430000	湖南省
     620000	甘肃省
     350000	福建省
     520000	贵州省
     210000	辽宁省
     610000	陕西省
     630000	青海省
     230000	黑龙江省

     *
     *
     *
     *
     *
     *
     *
     * *****************/



    callback(null,addressList);
    /*********************以上是测试数据****************************/
};


module.exports = new Freight();