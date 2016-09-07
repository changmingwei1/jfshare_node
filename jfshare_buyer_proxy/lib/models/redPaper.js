/**
 * Created by huapengpeng on 2016/4/21.
 */
/**
 * @auther 迟文恒 2016/0901
 * 积分红包管理
 *
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var redPaper_types = require("../thrift/gen_code/batchCards_types");

function RedPaper() {}

/*查询单个积分红包的信息 ---H5页面就会用到--页面展示*/
RedPaper.prototype.queryRedPaperActivity = function (params, callback) {

    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ, 'queryRedPaperActivity',
        [params.encryActivityId]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("queryOneRedPaperActivity result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("RedPaper.queryOneRedPaperActivity because: ======" + err);
            res.code = 500;
            res.desc = "询单个积分红包的信息";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*领取积分*/
RedPaper.prototype.receiveRedbag = function (params, callback) {

    //获取客户端
    var scoreCardsServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ,'receiveRedbag',[params.encryActivityId, params.mobile]);
    Lich.wicca.invokeClient(scoreCardsServ, function (err, data) {
        logger.info("receiveRedbag result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("RedPaper.receiveRedbag because: ======" + err);
            res.code = 500;
            res.desc = "询单个积分红包的信息";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("RedPaper.receiveRedbag param: " + JSON.stringify(params));
            logger.warn("RedPaper.receiveRedbag result: " + JSON.stringify(data));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else{
            callback(null, data);
        }
    });
};

/**/
RedPaper.prototype.getSendRedPaperList = function (params, callback) {

    var queryParams = new redPaper_types.RedPaperSendQueryParam({
        mobile: params.mobile
    });
    var page = new pagination_types.Pagination({
        //numPerPage: params.numPerPage,
        //currentPage: params.currentPage   /*业务需求,现在H5只需要前10条信息即可*/
        numPerPage: 10,
        currentPage: 1
    });
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ, 'getRedPaperReceivedList',
        [params.encryActivityId, queryParams, page]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("querySendRedPaperList result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("RedPaper.querySendRedPaperList because: ======" + err + JSON.stringify(data));
            res.code = 500;
            res.desc = "查询发放红包记录列表失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new RedPaper();