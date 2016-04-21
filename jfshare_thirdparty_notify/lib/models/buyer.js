/**
 * Created by Lenovo on 2015/11/19.
 */
var log4node = require('../../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var buyer_types = require("../thrift/gen_code/buyer_types");
var Lich = require('../thrift/Lich');
var thrift = require('thrift');
var valid = require('./pub/param_valid');

function Buyer() {

}

Buyer.prototype.signup = function(data, callback) {
    if(valid.empty(data)) {
        return callback({code:1, failDesc:'参数非法', result:false});
    }

    var thrift_buyer = new buyer_types.Buyer(data);
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "signin", [thrift_buyer]);
    Lich.wicca.invokeClient(buyerServ, function (err, rdata) {
        if (err) {
            log.error("buyerServ 连接买家服务失败 ======" + err);
            return callback({code:1, failDesc:"系统异常", result:false});
        }
        log.info("buyerServ.signin() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0]["code"] != 0) {
            var failDescList = rdata[0].failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            log.error("buyerServ.signin() 访问失败  =====原因:"+failDesc);
            return callback({code: 1, failDesc:failDesc, result:false});
        }
        return callback({result:true});
    });
}

Buyer.prototype.login = function(data, callback) {
    if(valid.empty(data)) {
        return callback({code:1, failDesc:'参数非法', result:false});
    }
    var thrift_buyer = new buyer_types.Buyer(data);
    var thrift_loginLog = new buyer_types.LoginLog(data);
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "login", [thrift_buyer, thrift_loginLog]);
    Lich.wicca.invokeClient(buyerServ, function (err, rdata) {
        if (err) {
            log.error("buyerServ 连接买家服务失败 ======" + err);
            return callback({code:1, failDesc:'系统异常', result:false});
        }
        log.info("buyerServ.login() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].result["code"] != 0) {
            var failDescList = rdata[0].result.failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            return callback({code: 1, failDesc:failDesc, result:false});
        }
        return callback({result:true, buyer:rdata[0].buyer, loginLog:rdata[0].loginLog});
    });
}

Buyer.prototype.isOnline = function(data, callback) {
    if(valid.empty(data)) {
        return callback({code:1, failDesc:'参数非法', result:false});
    }
    var thrift_loginLog = new buyer_types.LoginLog(data);
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "isOnline", [thrift_loginLog]);
    Lich.wicca.invokeClient(buyerServ, function (err, rdata) {
        if (err) {
            log.error("buyerServ 连接买家服务失败 ======" + err);
            callback({code:1, failDesc:'系统异常', result:false});
            return;
        }
        log.info("buyerServ.isOnline() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].result["code"] != 0) {
            var failDescList = rdata[0].result.failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            log.error("buyerServ.isOnline() 访问失败  =====原因:"+failDesc);
            callback({code: 1, failDesc:failDesc, result:false});
        } else {
            if(rdata[0].value) {
                callback({result:true});
            } else {
                callback({failDesc:"登录超时", code:2, result:false});
            }
        }
    });
}

Buyer.prototype.getInfo = function(data, callback) {
    if(valid.empty(data)) {
        return callback({code:1, failDesc:'参数非法'}, null);
    }
    var thrift_buyer = new buyer_types.LoginLog(data);
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "getBuyer", [thrift_buyer]);
    Lich.wicca.invokeClient(buyerServ, function (err, rdata) {
        if (err) {
            log.error("buyerServ 连接买家服务失败 ======" + err);
            return callback(err);
        }
        log.info("buyerServ.getBuyer() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].result["code"] != 0) {
            var failDescList = rdata[0].result.failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            return callback({code: 1, failDesc:failDesc});
        }
        return callback('',rdata[0]);
    });
}

Buyer.prototype.updateInfo = function(data, callback) {
    if(valid.empty(data)) {
        return callback({code:1, failDesc:'参数非法'}, null);
    }
    var thrift_buyer = new buyer_types.Buyer(data);
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "updateBuyer", [thrift_buyer]);
    Lich.wicca.invokeClient(buyerServ, function (err, rdata) {
        if (err) {
            log.error("buyerServ 连接买家服务失败 ======" + err);
            return callback(err);
        }
        log.info("buyerServ.updateBuyer() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].code != 0) {
            var failDescList = rdata[0].failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            return callback({code: 1, failDesc:failDesc});
        }
        return callback('',{code:0});
    });
}

Buyer.prototype.updatePwd = function(data, callback) {
    if(valid.empty(data)) {
        return callback({code:1, failDesc:'参数非法'},null);
    }
    var thrift_buyer = new buyer_types.Buyer(data);
    var newPassword = data.newPassword;
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "resetBuyerPwd", [newPassword, thrift_buyer]);
    Lich.wicca.invokeClient(buyerServ, function (err, rdata) {
        if (err) {
            log.error("buyerServ 连接买家服务失败 ======" + err);
            return callback(err, null);
        }
        log.info("buyerServ.resetBuyerPwd() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].code != 0) {
            var failDescList = rdata[0].failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            return callback({code: 1, failDesc:failDesc}, null);
        }
        return callback(null,{code:0});
    });
}

module.exports = Buyer;
