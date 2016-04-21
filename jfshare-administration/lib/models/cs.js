/**
 * Created by Lenovo on 2015/11/19.
 */
var log4node = require('../../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var manager_types=require("../thrift/gen_code/manager_types")
var Lich = require('../thrift/Lich');
var thrift = require('thrift');
var valid = require('../utils/param_valid');
/**********************thrift config*************************************/

function Commissioner() {
}

Commissioner.prototype.signin = function(data, callback) {
    if(valid.empty(data)) {
        return callback({code:1, failDesc:'参数非法', result:false});
    }
    var thrift_commissioner = new manager_types.Commissioner(data);
    var thrift_loginLog = new manager_types.LoginLog(data);
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, "signin", [thrift_commissioner, thrift_loginLog]);
    Lich.wicca.invokeClient(managerServ, function (err, rdata) {
        if (err) {
            log.error("managerServ 连接管理中心服务失败 ======" + err);
            return callback({code:1, failDesc:err, result:false});
        }
        log.info("managerServ.signin() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].result["code"] != 0) {
            var failDescList = rdata[0].result.failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            return callback({code: 1, failDesc:failDesc, result:false});
        }
        return callback({cs:rdata[0].cs, loginLog:rdata[0].loginLog, result:true});
    });
}

Commissioner.prototype.isOnline = function(data, callback) {
    if(valid.empty(data)) {
        return callback({code:1, failDesc:'参数非法', result:false});
    }
    var thrift_loginLog = new manager_types.LoginLog({csId:data.userId, tokenId:data.tokenId});
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, "isOnline", [thrift_loginLog]);
    Lich.wicca.invokeClient(managerServ, function (err, rdata) {
        if (err) {
            log.error("managerServ 连接管理中心服务失败 ======" + err);
            return callback({code:1, failDesc:err, result:false});
        }
        log.info("managerServ.isOnline() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].result["code"] != 0) {
            var failDescList = rdata[0].result.failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            log.error("managerServ.isOnline() 访问失败  =====原因:"+failDesc);
            return callback({code: 1, failDesc:failDesc, result:false});
        } else {
            if(rdata[0].value) {
                callback({result:true});
            } else {
                callback({failDesc:"登录超时", result:false, code:2});
            }
        }
    });
}

module.exports = Commissioner;
