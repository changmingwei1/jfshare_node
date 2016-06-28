/**
 * Created by Lenovo on 2015/11/19.
 */
var log4node = require('../../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var common_types = require("../thrift/gen_code/common_types");
var Lich = require('../thrift/Lich');
var thrift = require('thrift');
var valid = require('./pub/param_valid');

function Common() {

}

Common.prototype.getCaptcha = function(id, callback) {
    if(valid.empty(id)) {
        return callback({code:1, failDesc:'参数非法', result:false});
    }

    var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "getCaptcha", id);
    Lich.wicca.invokeClient(commonServ, function (err, rdata) {
        if (err) {
            log.error("commonServ 连接公共服务失败 ======" + err);
            return callback({code:1, failDesc:"系统异常", result:false});
        }
        log.info("commonServ.getCaptcha() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].result.code != 0) {
            var failDescList = rdata[0].failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            log.error("commonServ.getCaptcha() 访问失败  =====原因:"+failDesc);
            return callback({code: 1, failDesc:failDesc, result:false});
        }
        return callback({result:true, captcha:rdata[0].captcha});
    });
}

Common.prototype.validateCaptcha = function(params, callback) {
    if(valid.empty(params)) {
        return callback({code:1, failDesc:'参数非法', result:false});
    }

    var thrift_captcha = new common_types.Captcha({id:params["captchaId"], value:params["captchaValue"]});

    var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "validateCaptcha", [thrift_captcha]);
    Lich.wicca.invokeClient(commonServ, function (err, rdata) {
        if (err) {
            log.error("commonServ 连接公共服务失败 ======" + err);
            return callback({code:1, failDesc:"系统异常", result:false});
        }
        log.info("commonServ.validateCaptcha() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0].code != 0) {
            var failDescList = rdata[0].failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            log.error("commonServ.validateCaptcha() 访问失败  =====原因:"+failDesc);
            return callback({code: 1, failDesc:failDesc, result:false});
        }
        return callback({result:true});
    });
}


module.exports = Common;
