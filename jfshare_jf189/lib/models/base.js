/**
 * Created by Lenovo on 2015/11/19.
 */
var logger = require('../util/log4node').configlog4node.servLog4js();

var base_types = require("../thrift/gen_code/baseTemplate_types");
var Lich = require('../thrift/Lich');
var thrift = require('thrift');
var valid = require('./pub/param_valid');

function BaseTemplate() {

}

/**
 * 根据收货地址省份获取商品仓库id， 查询结果=0代表不在配送范围内
 * @param param
 * @param callback
 * @returns {*}
 */
BaseTemplate.prototype.getStorehouseId = function(param, callback) {
    if(valid.empty(param.sellerId) || valid.empty(param.productId) || valid.empty(param.storehouseIds) || valid.empty(param.sendToProvince)) {
        logger.info("getStorehouseId() 参数非法==> " + JSON.stringify(param));
        return callback({code:1, failDesc:'参数非法', result:false});
    }

    var thrift_ProductRefProvince = new base_types.ProductRefProvince(param);
    var thrift_DeliverStorehouseParam = new base_types.DeliverStorehouseParam({productRefProvinceList:[thrift_ProductRefProvince]});
    var baseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.BaseTemplateServer, "getDeliverStorehouse", thrift_DeliverStorehouseParam);
    Lich.wicca.invokeClient(baseTemplateServ, function (err, rdata) {
        if (err) {
            logger.error("baseTemplateServ 连接仓库模板服务失败 ======" + err);
            return callback({code:1, failDesc:"系统异常", result:false});
        }
        logger.info("baseTemplateServ.getDeliverStorehouse() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].result.code != 0) {
            var failDescList = rdata[0].failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            logger.error("baseTemplateServ.getDeliverStorehouse() 访问失败  =====原因:"+failDesc);
            return callback({code: 1, failDesc:failDesc, result:false});
        }
        return callback({result:true, storehouseId:rdata[0].productStorehouseList[0].storehouseId});
    });
}

/**
 * 运费计算
 * @param param
 * @param callback
 * @returns {*}
 */
BaseTemplate.prototype.calcPostage = function(param, callback) {
    if(valid.empty(param.sellerId) || valid.empty(param.productId) || valid.empty(param.templateId) || valid.empty(param.amount) || valid.empty(param.number) || valid.empty(param.weight) || valid.empty(param.sendToProvince)) {
        logger.info("calcPostage() 参数非法==> " + JSON.stringify(param));
        return callback({code:1, failDesc:'参数非法', result:false});
    }

    var thrift_ProductPostageBasic = new base_types.ProductPostageBasic(param);
    var thrift_SellerPostageBasic = new base_types.SellerPostageBasic({sellerId:param.sellerId, productPostageBasicList:[thrift_ProductPostageBasic]});
    var thrift_CalculatePostageParam = new base_types.CalculatePostageParam({sendToProvince:param.sendToProvince, sellerPostageBasicList:[thrift_SellerPostageBasic]});
    var baseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.BaseTemplateServer, "calculatePostage", thrift_CalculatePostageParam);
    Lich.wicca.invokeClient(baseTemplateServ, function (err, rdata) {
        if (err) {
            logger.error("baseTemplateServ 连接运费模板服务失败 ======" + err);
            return callback({code:1, failDesc:"系统异常", result:false});
        }
        logger.info("baseTemplateServ.calculatePostage() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].result.code != 0) {
            var failDescList = rdata[0].result.failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            logger.error("baseTemplateServ.calculatePostage() 访问失败  =====原因:"+failDesc);
            return callback({code: 1, failDesc:failDesc, result:false});
        }
        return callback({result:true, postage:rdata[0].totalPostage});
    });
}

module.exports = BaseTemplate;
