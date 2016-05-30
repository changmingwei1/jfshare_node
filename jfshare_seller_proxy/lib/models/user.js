/**
 * Created by huapengpeng on 2016/4/21.
 */
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
var trade_types = require('../thrift/gen_code/trade_types');
var common_types = require('../thrift/gen_code/common_types');
var seller_types = require("../thrift/gen_code/seller_types");


function User(){}
//登录
User.prototype.login = function(param,callback){

    var User  =  new seller_types.Seller({
        loginName:param.loginName,
        pwdEnc:param.pwdEnc
    });
    //如果校验可能需要修改
    var LoginLog = new seller_types.LoginLog({
        browser:param.browser
    });

    logger.info("调用 isLoginNameExist params:" + JSON.stringify(param));

    //获取客户端
    var userServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer,'signin',[User,LoginLog]);
    Lich.wicca.invokeClient(userServ, function(err, data){
        logger.info("isLoginNameExist result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("signin fail because: ======" + err);
            res.code = 500;
            logger.error(data);
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//注销登录
User.prototype.loginOut = function(param,callback){

    var loginLog  =  new seller_types.LoginLog({
        loginName:param.sellerId,
        tokenId:param.tokenId,
        ip:param.ip,
        browser:param.browser,
        fromSource:param.fromSource,
        tokenId:param.tokenId,
        logoutTime:param.logoutTime

    });
    logger.info("调用 userServ-signout 入参:" + JSON.stringify(param));
    //获取客户端
    var userServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer,'signout',loginLog);
    Lich.wicca.invokeClient(userServ, function(err, data){
        logger.info("调用 userServ-signout result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("调用 userServ-signout 异常 ，because: ======" + err);
            res.code = 500;
            logger.error(data);
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new User();