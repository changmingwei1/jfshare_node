/**
 * Created by huapengpeng on 2016/4/22.
 */


var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');


var baseTemplate_types = require("../thrift/gen_code/baseTemplate_types");


function Template() {
}

// 添加运费模板
Template.prototype.addPostageTemplate = function (params, callback) {

    var postageList = [];
    var list = JSON.parse(params.postageList);
    if (list != null) {
        for (var i = 0; i < list.length; i++) {

            var postage = new baseTemplate_types.Postage({
                supportProvince: list[i].supportProvince,
                rule: JSON.stringify(list[i].rule)
            });

            postageList.push(postage);
        }
    }

    var freight = new baseTemplate_types.PostageTemplate({
        sellerId: params.sellerId,
        name: params.name,
        type: params.type,
        postageList: postageList,
        templateGroup: params.templateGroup,
        templateDesc: params.templateDesc
    });


    logger.info("调用addPostage:" + JSON.stringify(freight));
    // 获取client
    var templateServer = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "addPostageTemplate", freight);
    // 调用
    Lich.wicca.invokeClient(templateServer, function (err, data) {
        logger.info("templateServer-addPostageTemplate result:" + JSON.stringify(data[0]));
        if (err || data[0].result.code == 1) {
            logger.error("templateServer-addPostageTemplate  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "添加运费模板失败！";
            callback(result, null);
        }
        callback(null, data);
    });
};

// 设置默认的商家运费模板
Template.prototype.setDefaultPostageTemplate = function (params, callback) {

    var postageTemplate = new baseTemplate_types.PostageTemplate({
        id: params.id,
        sellerId: params.sellerId
    });

    logger.info("调用setDefaultPostageTemplate params:" + JSON.stringify(freight));
    // 获取client
    var templateServer = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "setDefaultPostageTemplate", postageTemplate);
    // 调用
    Lich.wicca.invokeClient(templateServer, function (err, data) {
        logger.info("templateServer-setDefaultPostageTemplate result:" + JSON.stringify(data[0]));
        if (err || data[0].code == 1) {
            logger.error("templateServer-setDefaultPostageTemplate  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "设置默认模板失败";
            callback(result, null);
        }
        callback(null, data);
    });
};
//更新运费模板
Template.prototype.updatePostageTemplate = function (params, callback) {

    var postageList = [];
    var list = JSON.parse(params.postageList);
    if (list != null) {
        for (var i = 0; i < list.length; i++) {

            var postage = new baseTemplate_types.Postage({
                supportProvince: list[i].supportProvince,
                rule: JSON.stringify(list[i].rule)
            });

            postageList.push(postage);
        }
    }

    var freight = new baseTemplate_types.PostageTemplate({
        id: params.id,
        sellerId: params.sellerId,
        name: params.name,
        type: params.type,
        postageList: postageList,
        templateGroup: params.templateGroup,
        templateDesc: params.templateDesc
    });

    logger.info("updatePostage:" + JSON.stringify(freight));
    // 获取client
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "updatePostageTemplate", freight);
    // 调用 freightServ
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-updatePostageTemplate result:" + JSON.stringify(data));
        if (err || data[0].code == 1) {
            logger.error("freightServ-updatePostageTemplate  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "更新运费模板失败！";
            callback(result, null);
        }
        callback(null, data);
    });
};

//删除运费模板
Template.prototype.delPostageTemplate = function (params, callback) {
    // 获取client
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "deletePostageTemplate", [params.sellerId, params.id]);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-deletePostageTemplate result:" + JSON.stringify(data[0]));
        if (err || data[0].code == 1) {
            logger.error("freightServ-deletePostageTemplate  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "删除运费模板失败！";
            callback(result, data);
        }
        callback(null, data);
    });
};

//获取运费模板
Template.prototype.getPostageTemplate = function (params, callback) {

    var idList = [];
    idList.push(params.id);

    // 获取client
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "getPostageTemplate", [idList]);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-getPostageTemplate result:" + JSON.stringify(data[0]));
        if (err || data[0].result.code == 1) {
            logger.error("freightServ-getPostageTemplate  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "获取运费模板失败！";
            callback(result, null);
            return;
        }
        return callback(null, data);
    });
};


//查询运费模板列表
Template.prototype.listPostageTemplate = function (params, callback) {

    var postageTemplateQueryParam = new baseTemplate_types.PostageTemplateQueryParam({
        sellerId: params.sellerId,
        templateGroup: params.templateGroup
    });
    // 获取client
    var freightServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "queryPostageTemplate", postageTemplateQueryParam);
    // 调用
    Lich.wicca.invokeClient(freightServ, function (err, data) {
        logger.info("freightServ-queryPostageTemplate result:" + JSON.stringify(data[0]));
        if (err || data[0].result.code == 1) {
            logger.error("freightServ-listPostageTemplate  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "查询运费模板列表失败！";
            callback(result, data);
        } else {
            callback(null, data);
        }

    });
};
// 添加仓库
Template.prototype.addStorehouse = function (params, callback) {

    var storehouse = new baseTemplate_types.Storehouse({
        sellerId: params.sellerId,
        name: params.name,
        supportProvince: params.supportProvince
    });

    logger.info("调用addStorehouse:" + JSON.stringify(storehouse));
    // 获取client
    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "addStorehouse", storehouse);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-addStorehouse result:" + JSON.stringify(data[0]));
        if (err || data[0].result.code == 1) {
            logger.error("storehouseServ-addStorehouse  失败原因 ======" + err);

            var result = {};
            result.code = 500;
            result.desc = "添加仓库失败！";
            logger.error("调用storehouseServ-addStorehouse失败  失败原因 ======" + err);

            callback(result, null);

        }
        callback(null, data);
    });
};


// 获取仓库
Template.prototype.getStorehouse = function (params, callback) {

    var list = [];
    list.push(params.id);
    // 获取client
    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "getStorehouse", list);
    //调用 storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-getStorehouse result:" + JSON.stringify(data[0]));
        if (err || data[0].result.code == 1) {
            logger.error("storehouseServ-getStorehouse失败  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "获取仓库失败！";
            callback(result, null);
            return;
        }
        callback(null, data);
        return;
    });
};

//更新仓库
Template.prototype.updateStorehouse = function (params, callback) {

    var storehouse = new baseTemplate_types.Storehouse({
        sellerId: params.sellerId,
        id: params.id,
        name: params.name,
        supportProvince: params.supportProvince
    });

    logger.info("updateStorehouse:" + JSON.stringify(storehouse));
    // 获取client
    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "updateStorehouse", storehouse);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-updateStorehouse result:" + JSON.stringify(data[0]));
        if (err || data[0].code == 1) {
            logger.error("调用storehouseServ-updateStorehouse失败  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "更新仓库失败！";
            callback(result, data);
        }
        callback(null, data);
    });
};

//删除仓库
Template.prototype.delStorehouse = function (params, callback) {

    // 获取client
    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "deleteStorehouse", [params.sellerId, params.id]);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-deleteStorehouse result:" + JSON.stringify(data[0]));
        if (err || data[0].code == 1) {
            logger.error("调用storehouseServ-deleteStorehouse  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "删除仓库失败！";
            callback(result, data);
        }
        callback(null, data);
    });
};

//查询仓库列表
Template.prototype.listStorehouse = function (params, callback) {
    // 获取client

    var queryParam = new baseTemplate_types.StorehouseQueryParam({
        sellerId: params.sellerId
    });

    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "queryStorehouse", queryParam);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-queryStorehouse result:" + JSON.stringify(data[0]));
        if (err || data[0].result.code == 1) {
            logger.error("调用storehouseServ-queryStorehouse  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "查询仓库列表失败！";
            callback(result, null);
        } else {
            callback(null, data);
        }

    });

};
/******
 *
 *
 *{
sellerList:[{
    sellerId: int  	//商家id
    provinceId: int //省份id
    storehouseIds:int //
    skulist:[{
			skuNum: string  //sku_编码 格式为1-1:100-102
            productId: string //产品id
        }]
    }]
}
 *
 *
 */
//批量查询仓库
Template.prototype.getDeliverStorehouse = function (params, callback) {
    var sellerList = params.sellerList;
    // 获取client
    var list = [];
    if (sellerList != null) {
        for (var i = 0; i < sellerList.length; i++) {
            var productRefProvince = new baseTemplate_types.ProductRefProvince({
                sellerId: sellerList[i].sellerId,
                productId: sellerList[i].productId,
                storehouseIds: sellerList[i].storehouseIds,
                sendToProvince: sellerList[i].provinceId
            });
            list.push(productRefProvince);
        }
    }
    var queryParam = new baseTemplate_types.DeliverStorehouseParam({
        productRefProvinceList: list
    });

    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.TemplateServer, "getDeliverStorehouse", queryParam);
    // 调用 storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-queryStorehouse result:" + JSON.stringify(data[0]));
        if (err || data[0].result.code == 1) {
            logger.error("调用storehouseServ-queryStorehouse  失败原因 ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "查询仓库列表失败！";
            callback(result, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new Template();