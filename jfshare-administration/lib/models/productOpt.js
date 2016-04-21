/**
 * Created by Lenovo on 2015/9/28.
 */
/**********************thrift config*************************************/
var Lich = require('../thrift/Lich.js');
var manager_types=require("../thrift/gen_code/manager_types")
var thrift = require('thrift');

/****************log4js***********************************/
var log4node = require('../../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

function ProductOpt(  ){
    this.productId = null;
    this.createTime = null;
    this.activeState = null;
    this.operatorId = null;
    this.operatorType = null;
    this.desc = null;
}

/**
 *
 * @param data
 * @param callback
 */

ProductOpt.prototype.list = function(pdata, callback) {

    if(pdata) {
        var thrift_conditions = new manager_types.QueryConditions();
        thrift_conditions["productId"] = pdata["productId"];
        var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, "queryProductOptRecords", thrift_conditions);
        Lich.wicca.invokeClient(managerServ, function (err, data) {
            if (err) {
                log.error("managerServ 链接管理中心服务失败 ======" + err);
                return callback(err,null);
            }
            log.info("managerServ.queryProductOptRecords() 访问成功  result=" + JSON.stringify(data));
            if (data[0]["result"]["code"] != 0) {
                return callback({code: 1, failDesc: "管理中心服务处理失败"}, null);
            }
            return callback(null,{productOptRecords: data[0]["productOptRecords"]});
        });
    }
};
//暴露模块
module.exports = ProductOpt;