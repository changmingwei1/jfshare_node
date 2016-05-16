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
        pwdEnc: params.pwdEnc,
        companyName: params.companyName,
        shopName: params.shopName,
        contactName: params.contactName,
        openBank: params.openBank,
        accountHolder: params.accountHolder,
        accountNumber: params.accountNumber,
        remark: params.remark,
        provinceId: params.provinceId,
        provinceName: params.provinceName,
        cityId: params.cityId,
        cityName: params.cityName,
        countyId: params.countyId,
        countyName: params.countyName,
        address: params.address,
        mobile: params.mobile,
        tel: params.tel,
        email: params.email

    });
    logger.info("signup seller params:" + JSON.stringify(seller));
    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'signup', [seller]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.info("signup seller result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("signup seller error result: ======" + err);
            res.code = 500;
            var dataBrand=data[0].failDescList[0];
            res.desc=dataBrand.desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//查询用户名是否存在
Seller.prototype.isLoginNameExist = function (params, callback) {

    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'isLoginNameExist', [params.loginName]);
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

    logger.info("SellerServ-get params:" + JSON.stringify(params));
    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'querySeller', [params.sellerId, sellerRetParam]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.info("query seller result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("can't get seller because: ======" + err);
            res.code = 500;
            res.desc = "获取商家信息失败";
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
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'querySellerBatch', [null, sellerRetParam]);
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

//更新卖家信息
Seller.prototype.updateSeller = function (params, callback) {

    var seller = new seller_types.Seller({
        sellerId: params.sellerId,
        loginName: params.loginName,
        //sellerName: params.sellerName,
        pwdEnc: params.pwdEnc,
        companyName: params.companyName,
        shopName: params.shopName,
        contactName: params.contactName,
        openBank: params.openBank,
        accountHolder: params.accountHolder,
        accountNumber: params.accountNumber,
        remark: params.remark,
        provinceId: params.provinceId,
        provinceName: params.provinceName,
        cityId: params.cityId,
        cityName: params.cityName,
        countyId: params.countyId,
        countyName: params.countyName,
        address: params.address,
        mobile: params.mobile,
        tel: params.tel,
        email: params.email
    });


    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'updateSeller', [seller]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.info("update seller result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
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
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'signin', [seller, loginLog]);
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
        tokenId: params.tokenId
    });


//获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'signout', [loginLog]);
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
};

//修改密码
Seller.prototype.resetSellerPwd = function (params, callback) {

    var seller = new seller_types.Seller({
        sellerId: params.sellerId,
        pwdEnc: params.pwdEnc
    });
    logger.info("seller resetSellerPwd seller :" + JSON.stringify(seller));
//获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'resetSellerPwd', [params.newPwd,seller]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.info("seller resetSellerPwd result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("can't seller resetSellerPwd result because: ======" + err);
            res.code = 500;
            res.desc = "密码修改失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//查询卖家列表
Seller.prototype.querySellerList = function (params, callback) {
    logger.info("sellerServ list params:" + JSON.stringify(params));
    var sellerParam = new seller_types.Seller({
        loginName:params.loginName,
        sellerName:params.userName
    });
    var pagination = new pagination_types.Pagination({
        currentPage:params.curPage,
        numPerPage:params.perCount
    });

    logger.info("sellerServ list sellerParam-after:" + JSON.stringify(sellerParam));
    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'querySellerList', [sellerParam, pagination]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.info("sellerServ list result:" + JSON.stringify(data));
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

//查询卖家列表
Seller.prototype.querySellerList = function (params, callback) {
    logger.info("sellerServ list params:" + JSON.stringify(params));
    var sellerParam = new seller_types.Seller({
        //sellerId:params.sellerId,
        loginName:params.loginName,
        sellerName:params.userName
    });
    var pagination = new pagination_types.Pagination({
        currentPage:params.curPage,
        numPerPage:params.perCount
    });

    logger.info("sellerServ list sellerParam-after:" + JSON.stringify(sellerParam));
    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'querySellerList', [sellerParam, pagination]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.info("sellerServ list result:" + JSON.stringify(data));
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

module.exports = new Seller();