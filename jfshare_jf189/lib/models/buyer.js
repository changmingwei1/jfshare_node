/**
 * Created by Lenovo on 2015/11/19.
 */
var logger = require('../util/log4node').configlog4node.servLog4js();

var buyer_types = require("../thrift/gen_code/buyer_types");
var Lich = require('../thrift/Lich');
var thrift = require('thrift');
var valid = require('./pub/param_valid');

function Buyer(args) {
    this.userId = null;
    this.userName = null;
    this.sexImg = null;
    this.custLevel = null;
    this.loginLog = null;
    this.thirdInfo = null;
    if (args) {
        if (args.userId !== undefined) {
            this.userId = args.userId;
        }
        if (args.userName !== undefined) {
            this.userName = args.userName;
        }
        if (args.loginLog !== undefined) {
            this.loginLog = args.loginLog;
        }
        if (args.thirdInfo !== undefined) {
            this.thirdInfo = args.thirdInfo;
        }
        if (args.sexImg !== undefined) {
            this.sexImg = args.sexImg;
        }
        if (args.custLevel !== undefined) {
            this.custLevel = args.custLevel;
        }
    }
}

Buyer.prototype.logout = function(data, callback) {
    if(valid.empty(data)) {
        return callback({code:1, failDesc:'参数非法', result:false});
    }

    var thrift_loginLog = new buyer_types.LoginLog(data);
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "logout", [thrift_loginLog]);
    Lich.wicca.invokeClient(buyerServ, function (err, rdata) {
        if (err) {
            logger.error("buyerServ 连接买家服务失败 ======" + err);
            return callback({failDesc:"系统异常", result:false});
        }
        logger.info("buyerServ.logout() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0]["code"] != 0) {
            var failDescList = rdata[0].failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            logger.error("buyerServ.logout() 访问失败  =====原因:"+failDesc);
            return callback({failDesc:failDesc, result:false});
        }
        return callback({result:true});
    });
}

Buyer.prototype.signinTY = function(data, cookie, callback) {
    if(valid.empty(data)) {
        return callback({failDesc:"参数为空", code:1, result:false});
    }

    var thrift_thirdUser = new buyer_types.ThirdpartyUser(data);
    var thrift_loginlog = new buyer_types.LoginLog(cookie);
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "signinThirdParty", [thrift_loginlog, thrift_thirdUser]);
    Lich.wicca.invokeClient(buyerServ, function (err, rdata) {
        if (err) {
            logger.error("buyerServ 连接买家服务失败 ======" + err);
            return callback({failDesc:"系统异常", code:1, result:false});
        }
        logger.info("buyerServ.signinThirdParty() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].result.code != 0) {
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
            logger.error("buyerServ 连接买家服务失败 ======" + err);
            callback({code:1, failDesc:'系统异常', result:false});
            return;
        }
        logger.info("buyerServ.isOnline() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].result["code"] != 0) {
            var failDescList = rdata[0].result.failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            logger.error("buyerServ.isOnline() 访问失败  =====原因:"+failDesc);
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
            logger.error("buyerServ 连接买家服务失败 ======" + err);
            return callback(err);
        }
        logger.info("buyerServ.getBuyer() 访问成功  result=" + JSON.stringify(rdata));
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
/*用户是否为广东电信用户*/
Buyer.prototype.isPurchaseMobile = function (account, callback) {
    logger.info("请求参数：" + account);
    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, 'isPurchaseMobile', [account]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("get isPurchaseMobile result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("can't get isPurchaseMobile because: ======" + err);
            res.code = 500;
            res.desc = "false to get isPurchaseMobile";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("can't get isPurchaseMobile, 请求参数arg=" + account);
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else{
            callback(null, data);
        }
    });
};
module.exports = Buyer;
