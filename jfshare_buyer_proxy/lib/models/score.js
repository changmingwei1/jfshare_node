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
var score_types = require('../thrift/gen_code/score_types');

function Score(){}

//获取用户积分
Score.prototype.getScore = function (userId, callback) {

    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'getScore', userId);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("get buyerScore result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("can't get buyerScore because: ======" + err);
            res.code = 500;
            res.desc = "获取积分失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//获取积分交易记录
Score.prototype.queryScoreTrade = function (param, callback) {

    var thrift_pagination = new pagination_types.Pagination({
        currentPage: param.curPage,
        numPerPage: param.perCount
    });
    var params = new score_types.ScoreTradeQueryParam({
        userId: param.userId,
        type: param.type,
        inOrOut: param.inOrOut,
        startTime: param.startTime,
        endTime: param.endTime
    });

    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'queryScoreTrade', [params, thrift_pagination]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("get buyerScoreList result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't get queryScoreTrade because: ======" + JSON.stringify(data));
            res.code = 500;
            res.desc = "获取积分交易列表失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//积分兑入
Score.prototype.enterAmountCall = function (param, callback) {
    var params = new score_types.ScoreRequestParam({
        AppCode: param.AppCode,
        RequestDate: param.RequestDate,
        Sign: param.Sign,
        SpID: param.SpID,
        OutOrderID: param.OutOrderID,
        DeviceNo: param.DeviceNo,
        DeviceType: param.DeviceType,
        ProvinceID: param.ProvinceID,
        CustID: param.CustID,
        Num: param.Num,
        Remark: param.Remark,
        ActiveID: param.ActiveID,
        ExpTime: param.ExpTime
    });

    logger.info("Score enterAmountCall params:" + JSON.stringify(params));
    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'enterAmountCall', params);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("Score enterAmountCall result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("Score enterAmountCall because: ======" + err);
            res.code = 500;
            res.desc = "积分兑入错误";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//积分兑出查询
Score.prototype.queryCachAmount = function (param, callback) {
    var params = new score_types.CachAmountQueryParam({
        userId: param.userId
    });

    logger.info("Score queryCachAmount  params:" + JSON.stringify(params));
    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'queryCachAmount', params);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("Score queryCachAmount result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("Score queryCachAmount because: ======" + err);
            res.code = 500;
            res.desc = "兑出积分查询错误";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//积分兑出
Score.prototype.cachAmountCall = function (param, callback) {
    var params = new score_types.CachAmountCallParam({
        userId: param.userId,
        CachAmount: param.CachAmount,
        mobile: param.mobile
    });

    logger.info("Score cachAmountCall  params:" + JSON.stringify(params));
    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'cachAmountCall', params);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("Score cachAmountCall result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("Score cachAmountCall because: ======" + err);
            res.code = 500;
            res.desc = "兑出积分错误";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

//查询积分记录
Score.prototype.queryScoreUser = function (params, callback) {
    var scoreUserQueryParam = new score_types.ScoreUserQueryParam({
        userId: params.userId,
        mobile: params.mobile,
        startTime: params.startTime,
        endTime: params.endTime,
        amount: params.amount/* 积分值  0:全部   1:0积分  2:0以上积分 */
    });
    var pagination = new pagination_types.Pagination({
        currentPage: params.curPage,
        numPerPage: params.perCount
    });
    logger.info("scoreServ.queryScoreUser params:" + JSON.stringify(params));
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'queryScoreUser', [scoreUserQueryParam, pagination]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("scoreServ.queryScoreUser result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("scoreServ.queryScoreUser because: ======" + err);
            res.code = 500;
            res.desc = "查询积分错误";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//测试redis
Score.prototype.getRedisbyKey = function (arg, callback) {
    logger.info(JSON.stringify(arg));
    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'getRedisbyKey', [arg.key,arg.count]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("get scoreRedis result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("can't get scoreRedis because: ======" + err);
            res.code = 500;
            res.desc = "false to get scoreRedis";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*用户是否绑定兑出账号*/
Score.prototype.isUserIdRela = function (userId, callback) {
    logger.info("请求参数：" + userId);
    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'isUserIdRela', [userId]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("get isUserIdRela result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("can't get isUserIdRela because: ======" + err);
            res.code = 500;
            res.desc = "false to get isUserIdRela";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("can't get isUserIdRela, 请求参数arg=" + userId);
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else{
            callback(null, data);
        }
    });
};

/*账号是否绑定*/
Score.prototype.isAccountRela = function (account, callback) {
    logger.info("请求参数：" + account);
    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'isAccountRela', [account]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("get isAccountRela result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("can't get isAccountRela because: ======" + err);
            res.code = 500;
            res.desc = "false to get isAccountRela";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("can't get isAccountRela, 请求参数arg=" + account);
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else{
            callback(null, data);
        }
    });
};


module.exports = new Score();