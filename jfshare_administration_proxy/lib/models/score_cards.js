/**
 * Created by huapengpeng on 2016/4/21.
 */
/**
 * @auther YinBo 2016/0815
 * 积分卡管理
 *
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var score_types = require("../thrift/gen_code/batchCards_types");

function ScoreCard() { 
}

//创建一个积分活动
ScoreCard.prototype.createOneActivity = function (params, callback) {
    var activityBean= new score_types.ActivityBean({
        name:params.name,
        pieceValue:params.pieceValue,
        totalCount:parseInt(params.totalCount),
        /* 充值方式：0手动 1自动 */
        rechargeType:params.rechargeType,
        startTime:params.startTime,
        endTime:params.endTime,
        /* 状态：0可用 1作废 2过期 */
        // curStatus:params.curStatus,
        multiRechargeEnable:params.multiRechargeEnable
        
    });

    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ, 'createOneActivity', [activityBean]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("createOneActivity result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("scoreServ.queryScoreTrade because: ======" + err);
            res.code = 500;
            res.desc = "创建积分卡活动失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

// 导出充值卡excel 
ScoreCard.prototype.exportExcelByqueryCards = function (params, callback) {
    var activityId =params.activityId;
    var queryParams= new score_types.ActivityBean({
        cardName:params.cardName,
        cardPsd:params.cardPsd,
        sendStatus:params.sendStatus,
        rechargeStatus:params.rechargeStatus,
        rechargeAccount:params.rechargeAccount
    });
    var psd=params.psd;

    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ, 'exportExcelByqueryCards', [activityId ,queryParams,psd]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("exportExcelByqueryCards result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("scoreServ.queryScoreTrade because: ======" + err);
            res.code = 500;
            res.desc = "导出积分卡excel失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};



module.exports = new ScoreCard();