/**
 *
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
var seller_types = require('../thrift/gen_code/seller_types');
//var soltImage_types = require('../thrift/gen_code/soltImage_types');

function Seller(){}
//获取个人用户信息
Seller.prototype.getBuyer = function(userId,callback){

    var buyer = new buyer_types.Buyer({userId:userId});

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getBuyer',[buyer]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("get buyer result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't get buyer because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyer";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//更新用户信息(包含修改注册手机)
Seller.prototype.updateBuyer = function(param,callback){

    var value = new common_types.Captcha({value:param.value});

    var buyer = new buyer_types.Buyer({
        userId:param.userId,
        loginName:param.loginName,
        userName:param.userName,
        pwdEnc:param.pwdEnc,
        favImg:param.favImg,
        birthday:param.birthday,
        sex:param.sex,
        idCard:param.idCard,
        mobile:param.mobile,

        tel:param.tel,
        email:param.email,
        provinceId:param.provinceId,
        cityId:param.cityId,
        countyId:param.countyId,
        provinceName:param.provinceName,
        cityName:param.cityName,
        address:param.address,
        postCode:param.postCode,
        degree:param.degree,
        salary:param.salary,
        remark:param.remark,
        serial:param.serial,
        createTime:param.createTime,
        lastUpdateTime:param.lastUpdateTime
    });

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'updateBuyer',[buyer]);

    Lich.wicca.invokeClient(buyerServ,commonServ, function(err, data){
        logger.info("updateBuyer result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't updateBuyer because: ======" + err);
            res.code = 500;
            res.desc = "false to updateBuyer";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//获取用户积分==积分类均需要thrift提供接口
Seller.prototype.getBuyerScore = function(userId,callback){

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getBuyerScore',userId);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("get buyer result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't get buyerScore because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyerScore";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//获取积分列表
Seller.prototype.getBuyerScoreList = function(param,callback){
    var thrift_pagination = new pagination_types.Pagination({currentPage:params.curpage,numPerPage:params.percount});
    //新增BuyerScoreListParm
    var params = new buyer_types.getBuyerScoreList({
        pagination:thrift_pagination,
        userId:userId,
        time:time,
        scoreType:scoreType});
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getBuyerScoreList',params);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("get buyerScoreList result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't get buyerScoreList because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyerScoreList";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//首页轮播图的获取,soltImage_types在thrift/gen_code/中缺少模块
Seller.prototype.querySlotImageList = function(param,callback){
    var imageParm = new soltImage_types.QuerySlotImageParam({
        type:param.type
    });

    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer,'querySlotImageList',imageParm);
    Lich.wicca.invokeClient(managerServ, function(err, data){
        logger.info("获取到的资源:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("不能获取，因为: ======" + err);
            res.code = 500;
            res.desc = "不能获取到资源";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//用户名（即手机号）/密码登录
Seller.prototype.loginByNameAndPwd = function(param,callback){

    var buyer = new buyer_types.Buyer({
        mobile:param.mobile,
        pwdEnc:param.pwdEnc
    });
    //需要的字段可以继续增加
    var loginLog = new buyer_types.LoginLog({
        tokenId:param.tokenId,
        loginAuto:param.loginAuto
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getBuyer',[buyer,loginLog]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到登录信息:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("不能登录，因为: ======" + err);
            res.code = 500;
            res.desc = "登录失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//用户名、密码注册
Seller.prototype.singin = function(param,callback){

    var buyer = new buyer_types.Buyer({
        mobile:param.mobile,
        pwdEnc:param.pwdEnc
    });
    //图形验证码
    var captcha = new common_types.Captcha({
        id:id,
        value:value
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getBuyer',[buyer,captcha]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到登录信息:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("不能登录，因为: ======" + err);
            res.code = 500;
            res.desc = "登录失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//会员信息列表
Seller.prototype.querySellerVipList = function(param,callback){

    var paginationParms = new pagination_types.Pagination({
        currentPage:param.curPage,
        numPerPage:param.perCount
    });
    logger.error("调用 sellerServ-querySellerVipList params:" + JSON.stringify(param));
    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer,'querySellerVipList',[param.sellerId+"",paginationParms]);
    Lich.wicca.invokeClient(sellerServ, function(err, data){
        logger.error("会员信息列表信息:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("会员信息列表获取失败，因为: ======" + err);
            res.code = 500;
            res.desc = "会员信息列表获取失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
//查询卖家
Seller.prototype.queryCheckCodeList = function (params, callback) {
    logger.error("queryCheckCodeList params:" + JSON.stringify(params));
    var  param = new product_types.CheckCodeListParam({
        sendAccount:params.sendAccount,
        checkBeginTime:params.checkBeginTime,
        checkEndTime :params.checkEndTime,
        sellerId  :params.sellerId,
        sellerName :params.sellerName,
        productId:params.productId,
        productName:params.productName
    });

    var pagination = new pagination_types.Pagination({
        currentPage:params.curPage,
        numPerPage:params.perCount
    });

    logger.info("queryCheckCodeList sellerParam-after:" + JSON.stringify(param)+JSON.stringify(pagination));
    //CheckCodeListResult queryCheckCodeList(1:CheckCodeListParam param,2:pagination.Pagination pagination);
    //获取client
    var productServer = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, 'queryCheckCodeList', [param,pagination]);
    Lich.wicca.invokeClient(productServer, function (err, data) {
        logger.info("checkCodeList result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("checkCodeList 失败 because: ======" + err);
            res.code = 500;
            res.desc = "获取验码记录失败 ";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//exprotCheckCodeList
Seller.prototype.exportCheckCodeList = function (params, callback) {
    logger.error("exprotCheckCodeList params:" + JSON.stringify(params));
    var  param = new product_types.CheckCodeListParam({
        sendAccount:params.sendAccount,
        checkBeginTime:params.checkBeginTime,
        checkEndTime :params.checkEndTime,
        sellerId  :params.sellerId,
        sellerName :params.sellerName,
        productId:params.productId,
        productName:params.productName
    });
    logger.info("exportCheckCodeList sellerParam-after:" + JSON.stringify(param));
    //获取client
    var productServer = new Lich.InvokeBag(Lich.ServiceKey.ProductServer,'exportCheckCodeList', [param]);
    Lich.wicca.invokeClient(productServer, function (err, data) {
        logger.info("checkCodeList result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("exportCheckCodeList 失败 because: ======" + err);
            res.code = 500;
            res.desc = "导出记录失败 ";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//查询卖家
Seller.prototype.querySellerBySeller = function (params, callback) {
    logger.error("querySellerBySeller params:" + JSON.stringify(params));
    var sellerParam = new seller_types.Seller({
        sellerName:params.sellerName
    });

    logger.error("querySellerBySeller sellerParam-after:" + JSON.stringify(sellerParam));
    //获取client
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, 'querySellerBySeller', [sellerParam]);
    Lich.wicca.invokeClient(sellerServ, function (err, data) {
        logger.error("querySellerBySeller result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("can't get seller result because: ======" + err);
            res.code = 500;
            res.desc = "获取卖家失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new Seller();