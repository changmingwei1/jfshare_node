/**
 * @auther YinBo 2016/4/12
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var product_types = require("../thrift/gen_code/product_types");
var stock_types = require('../thrift/gen_code/stock_types');
var address_types = require('../thrift/gen_code/address_types');
var order_types = require('../thrift/gen_code/order_types');
var cart_types = require('../thrift/gen_code/cart_types');
var pay_types = require('../thrift/gen_code/pay_types');
var trade_types = require('../thrift/gen_code/trade_types');
var buyer_types = require('../thrift/gen_code/buyer_types');
var common_types = require('../thrift/gen_code/common_types');
//var soltImage_types = require('../thrift/gen_code/soltImage_types');

function Common(){}

//获取图形验证码
Common.prototype.getCaptcha = function(id,callback){
    //获取client
    var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer,'getCaptcha',id);
    Lich.wicca.invokeClient(commonServ,function(err,data){
        logger.info("getCaptcha result: " + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't getCaptcha because: ======" + err);
            res.code = 500;
            res.desc = "false to getCaptcha";
            callback(res,null);
        } else {
            callback(null,data);
        }
    });
};

//验证图形验证码
Common.prototype.validateCaptcha = function(param, callback){
    //参数
    var captcha = new common_types.Captcha({
        id:param.id,
        value:param.value
        //captchaBytes:param.captchaBytes
    });
    //获取client
    var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer,'validateCaptcha',[captcha]);
    Lich.wicca.invokeClient(commonServ,function(err,data){
        logger.info("getCaptcha result: " + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("can't getCaptcha because: ======" + err);
            res.code = 500;
            res.desc = "验证图形验证码失败";
            callback(res,null);
        } else {
            callback(null,data);
        }
    });
};

//获取短信验证码
Common.prototype.sendMsgCaptcha = function(param, callback){
    //参数
    var msgCaptcha = new common_types.MsgCaptcha({
        type: param.type || "buyer_signin",
        mobile:param.mobile
    });
    //获取client
    var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer,'sendMsgCaptcha',[msgCaptcha]);
    Lich.wicca.invokeClient(commonServ,function(err,data){
        logger.info("getCaptcha result: " + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("调用commonServ-sendMsgCaptcha失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "获取短信验证码失败！";
            callback(res, null);
        } else if(data[0].code == 1){
            logger.info("调用commonServ-sendMsgCaptcha失败  失败原因 ======" + data[0].failDescList[0].desc);
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
            callback(res, null);
        } else{
            callback(null, null);
        }
    });
};

//验证短信验证码
Common.prototype.validateMsgCaptcha = function(param, callback){
    //参数
    var msgCaptcha = new common_types.MsgCaptcha({
        type:param.type || "buyer_signin",
        mobile:param.mobile,
        captchaDesc:param.captchaDesc
    });
    //获取client
    var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer,'validateMsgCaptcha',[msgCaptcha]);
    Lich.wicca.invokeClient(commonServ,function(err,data){
        logger.info("getCaptcha result: " + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("can't getCaptcha because: ======" + err);
            res.code = 500;
            res.desc = "验证短信验证码失败";
            callback(res,null);
        } else if(data[0].code == 1){
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
            callback(res,null);
        }else{
            callback(null,data);
        }
    });
};

//获取二维码
Common.prototype.getQRCode = function(id,callback){
    //获取client
    var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer,'getQRCode',id);
    Lich.wicca.invokeClient(commonServ,function(err,data){
        logger.info("getCaptcha result: " + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == 1) {
            logger.error("can't getCaptcha because: ======" + err);
            res.code = 500;
            res.desc = "false to getCaptcha";
            callback(res,null);
        } else {
            callback(null,data);
        }
    });
};


module.exports = new Common();