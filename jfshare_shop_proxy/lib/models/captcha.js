/**
 * Created by huapengpeng on 2016/4/12.
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
function Captcha(){}
//获取图形验证码
Captcha.prototype.getCaptcha = function(captchaId,callback){

    //var captcha = new common_types.Captcha({
    //    id:id,
    //    value:value,
    //    captchaBytes:captchaBytes
    //});

    // 获取client
    var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer,'getCaptcha',[captchaId]);
    //invite productServ
    Lich.wicca.invokeClient(commonServ, function(err, data) {
        logger.info("get captcha result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("调用查询验证码失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "验证码生成失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new Captcha();