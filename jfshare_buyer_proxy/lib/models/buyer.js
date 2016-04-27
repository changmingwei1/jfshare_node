/**
 * @author YinBo 2016/4/12
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

function Buyer(){}

/************************************************现在的****************************************************/
//获取鉴权信息
Buyer.prototype.getAuthInfo = function(param,callback){
    //参数
    var authInfo = new buyer_types.AuthInfo({
        token:param.token,
        ppInfo:param.ppInfo
    });
    var buyer = new buyer_types.Buyer({
        userId:param.userId
    });
    var loginLog = new buyer_types.LoginLog(param);

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getAuthInfo',[authInfo,buyer,loginLog]);
    Lich.wicca.invokeClient(buyerServ,function(err,data){
        logger.info("getAuthInfo result: " + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't getAuthInfo because: ======" + err);
            res.code = 500;
            res.desc = "false to getAuthInfo";
            callback(res,null);
        } else {
            callback(null,data);
        }
    });
};

//验证鉴权
Buyer.prototype.validAuth = function(param, callback){
    //参数
    var authInfo = new buyer_types.AuthInfo({
        token:param.token || "鉴权信息1",
        ppInfo:param.ppInfo || "鉴权信息2"
    });
    var loginLog = new buyer_types.LoginLog(param);
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'validAuth',[authInfo,loginLog]);
    Lich.wicca.invokeClient(buyerServ,function(err,data){
        logger.info("validAuth result: " + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("can't validAuth because: ======" + err);
            res.code = 500;
            res.desc = "false to validAuth";
            callback(res,null);
        } else {
            callback(null,data);
        }
    });
};

//手机号密码登录
Buyer.prototype.login = function(param,callback){
    //参数
    var thrift_buyer = new buyer_types.Buyer({
        mobile:param.mobile,
        pwdEnc:param.pwdEnc
    });
    //需要的字段可以继续增加
    var thrift_loginLog = new buyer_types.LoginLog({
        browser:param.browser
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'newLogin',[thrift_buyer,thrift_loginLog]);
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

//注册
Buyer.prototype.newSignin = function(data, callback) {
    //if(valid.empty(data)) {
    //    return callback({code:1, failDesc:'参数非法', result:false});
    //}


    var thrift_buyer = new buyer_types.Buyer({
        mobile:data.mobile,
        pwdEnc:data.pwdEnc
    });

    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "newSignin", [thrift_buyer]);
    Lich.wicca.invokeClient(buyerServ, function (err, data) {
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("注册失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "注册失败失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//判断用户名是否存在,现有的thrift是判断的loginName;不过现在要求直接判断手机号mobile，先暂时判断loginName
Buyer.prototype.buyerIsExist = function(loginName,callback){

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'buyerIsExist',loginName);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到的信息:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("啥，因为: ======" + err);
            res.code = 500;
            res.desc = "失败描述...";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//获取个人信息
Buyer.prototype.getBuyer = function(param,callback){

    var buyer = new buyer_types.Buyer({userId:param.userId});

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

//更新用户信息
Buyer.prototype.updateBuyer = function(param,callback){

    var buyer = new buyer_types.Buyer({
        userId:param.userId,
        userName:param.userName,
        favImg:param.favImg,
        birthday:param.birthday,
        sex:param.sex
    });

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'updateBuyer',[buyer]);

    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("updateBuyer result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("can't updateBuyer because: ======" + err);
            res.code = 500;
            res.desc = "false to updateBuyer";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//重置密码new
Buyer.prototype.newResetBuyerPwd = function(param,callback){

    var params = new buyer_types.Buyer({
        userId:param.userId,
        mobile:param.mobile
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'newResetBuyerPwd',[params,param.newPwd]);

    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("updateBuyer result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("can't updateBuyer because: ======" + err);
            res.code = 500;
            res.desc = "false to updateBuyer";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


module.exports = new Buyer();