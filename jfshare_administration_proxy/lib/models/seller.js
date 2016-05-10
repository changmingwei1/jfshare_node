/**
 * Created by Administrator on 2016/5/6 0006.
 */

var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var seller_types = require("../thrift/gen_code/seller_types");


function Seller() {
}
//注册用户
Seller.prototype.signup = function (params, callback) {

    var seller = new seller_types.Seller({
        loginName: params.loginName,
        sellerName: params.sellerName,
        pwdEnc: params.pwdEnc
    });

    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.Seller, 'signup', [seller]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.info("signup seller result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("signup seller error result: ======" + err);
            res.code = 500;
            res.desc = "注册失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//查询用户名是否存在
Seller.prototype.isLoginNameExist = function (params, callback) {


    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.Seller, 'isLoginNameExist', [params.loginName]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.info("isLoginNameExist result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("can't get isLoginNameExist because: ======" + err);
            res.code = 500;
            res.desc = "查询用户名是否存在失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//查询单个卖家
Seller.prototype.querySeller = function (params, callback) {


    var sellerRetParam = new seller_types.SellerRetParam({
        baseTag: 1
    });


    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.Seller, 'querySeller', [params.sellerId, sellerRetParam]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.info("query seller result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("can't get seller because: ======" + err);
            res.code = 500;
            res.desc = "获取seller失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//查询卖家的列表
/***********
 * 还需要修改
 * @param params
 * @param callback
 */
Seller.prototype.querySellerBatch = function (params, callback) {

    var sellerRetParam = new seller_types.SellerRetParam({
        baseTag: 1
    });

    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.Seller, 'querySellerBatch', [null, sellerRetParam]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.info("get seller list result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("can't get seller list result because: ======" + err);
            res.code = 500;
            res.desc = "获取卖家列表失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//更新买家信息
Seller.prototype.updateSeller = function (params, callback) {

    var seller = new seller_types.Seller({
        loginName: params.loginName,
        sellerName: params.sellerName,
        pwdEnc: params.pwdEnc
    });


    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.Seller, 'updateSeller', [seller]);
    Lich.wicca.invokeClient(buyerServ, function (err, data) {
        logger.info("update seller result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("can't update seller result because: ======" + err);
            res.code = 500;
            res.desc = "更新卖家信息失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//登录
Seller.prototype.signin = function (params, callback) {

    var seller = new seller_types.Seller({
        sellerId: params.sellerId,
        loginName: params.loginName,
        sellerName: params.sellerName,
        pwdEnc: params.pwdEnc
    });
    var loginLog = new seller_types.LoginLog({
                sellerId: params.sellerId
            });


//获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.Seller, 'signin', [seller,loginLog]);
    Lich.wicca.invokeClient(buyerServ, function (err, data) {
        logger.info("seller signin result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("can't seller signin result because: ======" + err);
            res.code = 500;
            res.desc = "登录失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
}
;

//注销
Seller.prototype.signout = function (params, callback) {


    var loginLog = new seller_types.LoginLog({
        sellerId: params.sellerId,
        tokenId:  params.tokenId
    });


//获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.Seller, 'signout', [loginLog]);
    Lich.wicca.invokeClient(buyerServ, function (err, data) {
        logger.info("seller signout result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("can't seller signout result because: ======" + err);
            res.code = 500;
            res.desc = "注销失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
}
;
module.exports = new Seller();