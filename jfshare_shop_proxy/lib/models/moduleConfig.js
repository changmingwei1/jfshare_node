
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var manager_types = require("../thrift/gen_code/manager_types");

function ModuleConfig(){}

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
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new ModuleConfig();