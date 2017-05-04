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
var batchCards_types = require('../thrift/gen_code/batchCards_types');
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
        userId:param.userId,
        mobile:param.mobile
    });
    var loginLog = new buyer_types.LoginLog({
        browser:param.browser,
        clientType: param.clientType,
        version: param.version
    });

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getAuthInfo',[authInfo,buyer,loginLog]);
    Lich.wicca.invokeClient(buyerServ,function(err,data){
        logger.info("getAuthInfo result: " + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't getAuthInfo because: " + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;;
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
        token:param.token,
        ppInfo:param.ppInfo
    });
    var loginLog = new buyer_types.LoginLog({
        browser:param.browser,
        userId :param.userId,
        clientType: param.clientType,
        version: param.version
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'validAuth',[loginLog,authInfo]);
    Lich.wicca.invokeClient(buyerServ,function(err,data){
        logger.info("validAuth result: " + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't validAuth because: " + JSON.stringify(data));
            res.code = 501;
            res.desc = "鉴权失败";
            callback(res,null);
        } else {
            callback(null,data);
        }
    });
};

//手机号密码登录
Buyer.prototype.newLogin = function(param,callback){
    //参数
    var thrift_buyer = new buyer_types.Buyer({
        mobile:param.mobile,
        pwdEnc:param.pwdEnc
    });
    //需要的字段可以继续增加
    var thrift_loginLog = new buyer_types.LoginLog({
        browser: param.browser,
        clientType: param.clientType,
        version: param.version
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'newLogin',[thrift_buyer,thrift_loginLog]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到登录信息:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("不能登录，因为: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "登录失败";
            callback(res, null);
        } else if(data[0].result.code == "1"){
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        }else{
            callback(null, data);
        }
    });
};

/*第三方账号注册*/
Buyer.prototype.thirdUserSignin = function(param,callback){
    //参数
    var userThird = new buyer_types.UserInfoThird({
        custId:param.custId,
        mobile: param.mobile,
        thirdType: param.thirdType,
        extInfo: param.extInfo
    });
    var loginLog = new buyer_types.LoginLog({
        browser:param.browser,
        clientType: param.clientType,
        version: param.version
    });
    var validateInfo = new buyer_types.ValidateInfo({
        thirdType: param.thirdType,
        custId: param.custId,
        accessToken: param.accessToken,
        openId: param.openId,
        valiNum: param.captchaDesc,
        valiNumType:"buyer_signin"
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'thirdUserSignin',[loginLog,userThird,validateInfo]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到登录信息:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("不能登录，因为: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "登录失败";
            callback(res, null);
        } else if (data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            logger.warn("不能登录，因为: " + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else{
            callback(null, data);
        }
    });
};



/*第三方免登录校验*/
Buyer.prototype.thirdSigninCheck = function(param,callback){
    //参数
    var userThird = new buyer_types.UserInfoThird({
        custId:param.custId,
        mobile: param.mobile,
        thirdType: param.thirdType,
        extInfo: param.extInfo
    });
    var loginLog = new buyer_types.LoginLog({
        browser:param.browser,
        clientType: param.clientType,
        version: param.version
    });
    var validateInfo = new buyer_types.ValidateInfo({
        thirdType: param.thirdType,
        custId: param.custId,
        accessToken: param.accessToken,
        openId: param.openId,
        valiNum: param.captchaDesc,
        valiNumType:"buyer_signin"
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'thirdSigninCheck',[loginLog,userThird,validateInfo]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到登录信息:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("不能登录，因为: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "登录失败";
            callback(res, null);
        } else if (data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            logger.warn("不能登录，因为: " + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else{
            callback(null, data);
        }
    });
};



//手机号短信登录
Buyer.prototype.loginBySms = function(param,callback){
    //参数
    var thrift_buyer = new buyer_types.Buyer({
        mobile:param.mobile
    });
    //需要的字段可以继续增加
    var thrift_loginLog = new buyer_types.LoginLog({
        browser:param.browser,
        clientType: param.clientType,
        version: param.version
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'smsLogin',[thrift_buyer,thrift_loginLog]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到登录信息:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("不能登录，因为: " + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//注销
Buyer.prototype.logout = function(param,callback){
    //需要的字段可以继续增加
    var thrift_loginLog = new buyer_types.LoginLog({
        tokenId:param.tokenId,
        userId:param.userId
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'logout',[thrift_loginLog]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到注销信息信息:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("不能注销，因为: ======" + JSON.stringify(data));
            res.code = 500;
            res.desc = "注销失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//注册
Buyer.prototype.newSignin = function(param, callback) {
    var thrift_buyer = new buyer_types.Buyer({
        mobile:param.mobile,
        pwdEnc:param.pwdEnc,
        loginName:param.mobile
    });
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, "newSignin", [thrift_buyer]);
    Lich.wicca.invokeClient(buyerServ, function (err, data) {
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("注册失败  失败原因 ======" + JSON.stringify(data));
            res.code = 500;
            res.desc = "注册失败";
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
        if (err || data[0].result.code == 1) {
            logger.error("请求参数：" + loginName);
            logger.error("err，because: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "服务器异常不能判断";
            callback(res, null);
        } else{
            callback(null, data);
        }
    });
};

/*判断第三方用户是否存在*/
Buyer.prototype.isExitsThirdUser = function(param,callback){

    var loginLog = new buyer_types.LoginLog({
        browser: param.browser,
        clientType: param.clientType,
        version: param.version
    });
    var validateInfo = new buyer_types.ValidateInfo({
        thirdType: param.thirdType,
        custId: param.custId,
        accessToken: param.accessToken,
        openId: param.openId
    });

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'isExitsThirdUser',[loginLog,validateInfo]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到的信息:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("err，because: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "服务器异常不能判断";
            callback(res, null);
        } else if (data[0].result.code == 1 && data[0].result.failDescList[0].failCode == 3002){
            res.code = 200;
            res.failCode = data[0].result.failDescList[0].failCode;
            res.remark = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else if (data[0].result.code == 1 && data[0].result.failDescList[0].failCode == 1003){
            res.code = 200;
            res.failCode = data[0].result.failDescList[0].failCode;
            res.remark = data[0].result.failDescList[0].desc;
            callback(res, null);
        }else if (data[0].result.code == 1 && data[0].result.failDescList[0].failCode == 1999){//账号禁用
            res.code = 200;
            res.failCode = data[0].result.failDescList[0].failCode;
            res.remark = data[0].result.failDescList[0].desc;
            callback(res, null);
        }
        else {
           callback(null, data);
        }
    });
};

//获取个人信息
Buyer.prototype.getBuyer = function(param,callback){

    var buyer = new buyer_types.Buyer({
        userId:param.userId,
        clientType:param.clientType
    });

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getBuyer',[buyer]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("get buyer result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't get buyer because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyer";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        }else{
            callback(null, data);
        }
    });
};

//批量获取个人信息
Buyer.prototype.getListBuyer = function(param,callback){

    logger.info("批量获取个人信息的参数：" + JSON.stringify(param));

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getListBuyer',[param]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("get buyerList result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't get buyerList because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyerList";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        }else{
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
        sex:param.sex,
        clientType:param.clientType
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'updateBuyer',[buyer]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("updateBuyer result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't updateBuyer because: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "false to updateBuyer";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//重置密码 + 修改密码 new
Buyer.prototype.newResetBuyerPwd = function(param,callback){
    logger.info("newResetBuyerPwd --params: ======" + JSON.stringify(param));
    var params = new buyer_types.Buyer({
        mobile:param.mobile
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'newResetBuyerPwd',[param.newPwd, params]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("updateBuyer result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't updateBuyer because: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "false to updateBuyer";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*HTTPS请求方法*/
Buyer.prototype.requestHttps = function(param,callback){

    var extInfo = param.extInfo;

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'requestHttps',[param.url,extInfo]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到的信息:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("err，because: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "服务器异常不能判断";
            callback(res, null);
        } else if (data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            logger.warn("获取到的信息:" + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
/* jsapi请求方法*/
Buyer.prototype.getWeiXinJSconfig = function(param,callback){

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getWeiXinJSconfig',[param.url]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到的信息:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("err，because: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "服务器异常不能判断";
            callback(res, null);
        } else if (data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            logger.warn("获取到的信息:" + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


/* 获取个人信息--- 根据手机号 去获取个人信息  */
Buyer.prototype.getProfileFromWeixinByUnionId = function(param,callback){

    var extInfo = param.extInfo;

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getProfileFromWeixinByUnionId',[param.unionId]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到的信息:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("err，because: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "服务器异常不能判断";
            callback(res, null);
        } else if (data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            logger.warn("获取到的信息:" + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/* 获取个人信息--- 根据手机号 去获取个人信息  --根据code */
Buyer.prototype.getProfileFromWeixinByCode = function(param,callback){

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getProfileFromWeixinByCode',[param.code]);

    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到的信息:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("err，because: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "服务器异常不能判断";
            callback(res, null);
        } else if (data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            logger.warn("获取到的信息:" + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*H5第三方登陆*/
Buyer.prototype.H5ThirdLogin = function(param,callback){

    var params = new buyer_types.H5ThirdLoginParam({
        //appCode:param.appCode,  /*应用编码*/
        //requestDate:param.requestDate,  /*请求时间*/
        //sign:param.sign,    /*签名*/
        //mobile:param.mobile,    /*设配号*/
        //wayType:param.wayType,  /*用户渠道来源*/
        //redirectUrl:param.redirectUrl   /*重定向URL*/
        requestXml:param.requestXml
    });

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'H5ThirdLogin',[params]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到的信息:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("err，because: " + JSON.stringify(data));
            res.code = 500;
            res.desc = "服务器异常不能判断";
            callback(res, null);
        } else if (data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            logger.warn("获取到的信息:" + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

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


//积分兑入短信登录
Buyer.prototype.smsLoginEnterAmount = function(param,callback){
    //参数
    var smsParam = new buyer_types.SmsLoginEnterAmountParam({
        mobile:param.mobile,
        encryptyParam:param.encryptyParam,
    });
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'smsLoginEnterAmount',[smsParam]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取到登录信息:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("不能登录，因为: " + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            //res.desc = "积分兑入登陆鉴权失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//内嵌h5登录验证
Buyer.prototype.validAuthH5 = function(param,callback){
    //参数
    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'checkAppH5Token',[param.token,param.mobileNo,param.openId,param.mac,param.accessCode]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("获取h5验证的结果是:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("不能登录，因为: " + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};



module.exports = new Buyer();