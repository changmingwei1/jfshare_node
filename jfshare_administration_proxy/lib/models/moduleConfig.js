
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var manager_types = require("../thrift/gen_code/manager_types");

function ModuleConfig(){}

/* 查询模块列表 */
ModuleConfig.prototype.queryModuleConfig = function (params,callback) {

    //获取客户端
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'queryModuleConfig',[]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("queryModuleConfigList result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("managerServ.queryModuleConfigList because: ======" + err);
            res.code = 500;
            res.desc = "查询模块失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

/* 查询模块配置信息 */
ModuleConfig.prototype.queryModuleConfigDetail = function (params, callback) {

    var bean = new manager_types.ModuleConfigDetailParam({
        moduleId: params.moduleId /*模块ID*/
    });

    logger.info("查询模块配置信息的参数，bean = " + JSON.stringify(bean));

    //获取客户端
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'queryModuleConfigDetail', [bean]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("queryModuleConfigDetail result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("managerServ.queryModuleConfigDetail because: ======" + err);
            res.code = 500;
            res.desc = "查询模块配置信息失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("查询模块配置信息失败，参数为：" + JSON.stringify(bean));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

/* 发布模块 */
ModuleConfig.prototype.relase = function (params, callback) {

    var list = params.ModuleConfigDetailList;
    var iList = [];
    for(var i = 0; i < list.length; i++){
        var mcDetail = new  manager_types.ModuleConfigDetail({
            moduleId:list[i].moduleId,
            relaId:list[i].relaId,
            relaImgkey:list[i].relaImgkey,
            productRuleId:list[i].productRuleId,
            relaSort:list[i].relaSort
        });
        iList.push(mcDetail);
    }
    var bean = new manager_types.RelaseParam({
        ModuleConfigDetailList: iList
    });
    logger.info("发布模块的参数，bean = " + JSON.stringify(bean));
    //获取客户端
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'relase', [bean]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("relase result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("managerServ.relase because: ======" + err);
            res.code = 500;
            res.desc = "发布模块失败";
            callback(res, null);
        } else if (data[0].code == 1){
            logger.warn("managerServ.relase param: ======" + JSON.stringify(bean));
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
            callback(res, null);
        } else{
            callback(null, data);
        }
    });
};

/* 导入商品或品牌 */
ModuleConfig.prototype.importExcel = function (params, callback) {

    var bean = new manager_types.ImportParam({
        filePath:params.filePath,   /*获取excel文件的全路径*/
        moduleId: params.moduleId,   /*模块ID*/
        moduleType: params.moduleType /*模块类型*/
    });

    logger.info("导入商品或品牌的参数，bean = " + JSON.stringify(bean));

    //获取客户端
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'importExcel', [bean]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("queryModuleConfigDetail result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("managerServ.queryModuleConfigDetail because: ======" + err);
            res.code = 500;
            res.desc = "导入商品或品牌失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("导入商品或品牌的参数，参数为：" + JSON.stringify(bean));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

/* 查看单个商品或者品牌imgkey */
ModuleConfig.prototype.queryImgkey = function (params, callback) {

    var bean = new manager_types.QueryImgkeyParam({
        relaId: params.relaId, /*商品或品牌ID*/
        moduleType: params.moduleType
    });

    logger.info("查看单个商品或者品牌imgkey，bean = " + JSON.stringify(bean));

    //获取客户端
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'queryImgkey', [bean]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("queryImgkey result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("managerServ.queryImgkey because: ======" + err);
            res.code = 500;
            res.desc = "查看单个商品或者品牌imgkey失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("查看单个商品或者品牌imgkey失败，参数为：" + JSON.stringify(bean));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

module.exports = new ModuleConfig();