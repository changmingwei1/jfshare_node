/**
 * @auther chiwenheng  0909
 *
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var scoretool_types = require("../thrift/gen_code/score_message_types");

function Scoretool(){}
//移动获取短信验证码
Scoretool.prototype.sendNote = function (params, callback) {
    logger.error("sendNote >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.BonusPointServ, 'sendNote', [params.loginName]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("sendNote result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("sendNote because: ======" + err);
            res.code = 500;
            res.desc = "移动验证码获取失败";
            callback(res, null);
        }else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

//获取移动积分
Scoretool.prototype.queryMobilePhone = function (params, callback) {
    logger.error("queryMobilePhone >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.BonusPointServ, 'queryMobilePhone', [params.loginName,params.code]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryMobilePhone result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("queryMobilePhone because: ======" + err);
            res.code = 500;
            res.desc = "移动积分获取失败";
            callback(res, null);
        }else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};
//获取海航验证码**
Scoretool.prototype.sendHaiHangImages = function (callback) {
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.BonusPointServ, 'sendHaiHangImages');
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("sendHaiHangImages result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("sendHaiHangImages because: ======" + err);
            res.code = 500;
            res.desc = "海航图片验证码获取失败";
            callback(res, null);
        }else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

//获取海航积分**
Scoretool.prototype.queryHaiNan = function (params, callback) {
    logger.error("queryHaiNan >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.BonusPointServ, 'queryHaiNan', [params.loginName,params.passWord,params.method,params.cookei,params.code,params.timestamp]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryHaiNan result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("queryHaiNan because: ======" + err);
            res.code = 500;
            res.desc = "海航积分获取失败";
            callback(res, null);
        }else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

//获取南方航空里程**
Scoretool.prototype.queryNanFang = function (params, callback) {
    logger.error("queryNanFang >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.BonusPointServ, 'queryNanFang', [params.loginName,params.passWord]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryNanFang result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("queryNanFang because: ======" + err);
            res.code = 500;
            res.desc = "南航里程获取失败";
            callback(res, null);
        }else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};
module.exports = new Scoretool();