/**
 * @author YinBo on 16/4/20.
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
var baseTemplate_types = require('../thrift/gen_code/baseTemplate_types');

function BaseTemplate(){}

/*查询邮费模板*/
BaseTemplate.prototype.queryPostageTemplate = function(sellerId,templateGroup, callback) {
    var params = new baseTemplate_types.PostageTemplateQueryParam({
        sellerId: sellerId,
        templateGroup:2
    });
    logger.info("调用查询邮费模板信息，args:" + JSON.stringify(params));
    var baseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "queryPostageTemplate", params);
    Lich.wicca.invokeClient(baseTemplateServ, function(err, data) {
        logger.info("调用查询邮费模板信息，result:" + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("请求参数：" + JSON.stringify(params));
            logger.error("调用查询邮费模板信息失败，失败原因 ======" + JSON.stringify(data));
            res.code = 500;
            res.desc = "查询邮费模板信息失败！";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(params));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else{
            callback(null, data);
        }
    });
};

/*获取商家邮费模板，批量获取*/
BaseTemplate.prototype.getSellerPostageTemplate = function(sellerIds, callback) {
    var params = new baseTemplate_types.SellerPostageTemplateParam({
        sellerIds: sellerIds
    });
    logger.info("调用查询邮费模板信息，args:" + JSON.stringify(params));
    var baseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "getSellerPostageTemplate", params);
    Lich.wicca.invokeClient(baseTemplateServ, function(err, data) {
        logger.info("调用查询邮费模板信息，result:" + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("请求参数：" + JSON.stringify(params));
            logger.error("调用查询邮费模板信息失败，失败原因，server中还没有完成批量查找店铺邮费模板的方法 ======》" + JSON.stringify(data));
            res.code = 500;
            res.desc = "查询邮费模板信息失败！";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(params));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else{
            callback(null, data);
        }
    });
};

/*邮费计算*/
BaseTemplate.prototype.calculatePostage = function(param,  callback) {
    logger.info("调用邮费模板信息："+JSON.stringify(param));
    var sellerList = param.sellerPostageList;
    var params = [];
    for(var i = 0 ;i < sellerList.length; i++){
        var productList = sellerList[i].productPostageList;
        var list = [];
        for(var j = 0 ;j < productList.length ; j++){
            var ppList = new baseTemplate_types.ProductPostageBasic({
                productId: productList[j].productId,
                templateId: productList[j].postageId,
                number: productList[j].count,
                weight: productList[j].weight,
                amount: productList[j].amount
            });
            list.push(ppList);
        }
        var spList = new baseTemplate_types.SellerPostageBasic({
            sellerId: sellerList[i].sellerId,
            productPostageBasicList: list
        });
        params.push(spList);
    }
    var arg = new baseTemplate_types.CalculatePostageParam({
        sendToProvince:param.provinceId,
        sellerPostageBasicList:params
    });
    logger.info("调用邮费计算，  args:" + JSON.stringify(arg));
    var baseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "calculatePostage", arg);
    Lich.wicca.invokeClient(baseTemplateServ, function(err, data) {
        logger.info("调用邮费计算，  result:" + JSON.stringify(data[0]));
        var res = {};
        if(err || data[0].result.code == "1"){
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("调用邮费计算失败  失败原因 ======" + JSON.stringify(data));
            res.code = 500;
            res.desc = "邮费计算失败！";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*查询仓库*/
BaseTemplate.prototype.queryStorehouse = function(params,callback){
    var param = new baseTemplate_types.StorehouseQueryParam({
        sellerId: params.sellerId
    });
    //获取client
    var BaseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer,'queryStorehouse',param);
    Lich.wicca.invokeClient(BaseTemplateServ, function(err, data){
        logger.info("get BaseTemplate result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == 1) {
            logger.error("请求参数：" + JSON.stringify(params));
            logger.error("不能获取仓库信息 because: ======" + JSON.stringify(data));
            res.code = 500;
            res.desc = "获取仓库失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*获取仓库信息*/
BaseTemplate.prototype.getStorehouse = function(storehouseIds,callback){
    //获取client
    var BaseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer,'getStorehouse',storehouseIds);
    Lich.wicca.invokeClient(BaseTemplateServ, function(err, data){
        logger.info("get BaseTemplate result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == 1) {
            logger.error("不能获取仓库信息 because: ======" + JSON.stringify(data));
            res.code = 500;
            res.desc = "获取仓库失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*批量获取商品收货省份对应的发货仓库*/
BaseTemplate.prototype.getDeliverStorehouse = function(params,calback){
    var productRefProvinceList = [];
    var productRefProvince = new baseTemplate_types.ProductRefProvince({
        sellerId: params.sellerId,
        productId: params.productId,
        storehouseIds: params.storehouseIds,
        sendToProvince: params.provinceId
    });
    productRefProvinceList.push(productRefProvince);
    var param = new baseTemplate_types.DeliverStorehouseParam({
        productRefProvinceList:productRefProvinceList
    });
    //获取client
    var BaseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer,'getDeliverStorehouse',param);
    Lich.wicca.invokeClient(BaseTemplateServ, function(err, data){
        logger.info("get BaseTemplate result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == 1) {
            logger.error("请求参数：" + JSON.stringify(params));
            logger.error("不能获取仓库信息 because: ======" + JSON.stringify(data));
            res.code = 500;
            res.desc = "获取仓库失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new BaseTemplate();