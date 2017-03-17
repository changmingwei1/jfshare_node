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

function Buyer(){}

//获取个人信息
Buyer.prototype.getBuyer = function(param,callback){

    var buyer = new buyer_types.Buyer({
        userId:param.userId
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

//更新用户信息(包含修改注册手机)
Buyer.prototype.updateBuyer = function(param,callback){

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
Buyer.prototype.getBuyerScore = function(userId,callback){

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
Buyer.prototype.getBuyerScoreList = function(param,callback){
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
Buyer.prototype.querySlotImageList = function(param,callback){
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
Buyer.prototype.loginByNameAndPwd = function(param,callback){

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
Buyer.prototype.singin = function(param,callback){

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
//获取userId by mobile
Buyer.prototype.getBuyerInfo = function(param,callback){

    var buyer = new buyer_types.Buyer({
        loginName:param.loginName
    });

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'getBuyerInfo',[buyer]);
    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.error("get buyer result:" + JSON.stringify(buyer));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't get buyer because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyer";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.error("请求参数：" + JSON.stringify(param));
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

//启用禁用用户
Buyer.prototype.isDisableUser = function(param,callback){
    var isDisableUserParam = new buyer_types.IsDisableUseParam({
        userId:param.userId,
        id:param.id,
        serial:param.serial
    });

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'isDisableUser',[isDisableUserParam]);

    Lich.wicca.invokeClient(buyerServ, function(err, data){
        logger.info("isDisableUser result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            logger.error("can't isDisableUserParam because: ======" + err);
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
module.exports = new Buyer();