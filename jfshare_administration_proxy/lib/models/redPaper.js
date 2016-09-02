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

function RedPaper() {
}

//创建一个积分红包活动
RedPaper.prototype.createRedPaperActivity = function (params, callback) {
    var activityBean = new redPaper_types.Activity({
        name:params.name,
        maxScore:params.maxScore,
        startTime:params.startTime,
        endTime:params.endTime,
        isShowRule:params.isShowRule,
        isShowRecord:params.isShowRecord,
        brief:params.brief,
        singleGetType:params.singleGetType,
        singleGetValue:params.singleGetValue,
        perLimitTime:params.perLimitTime,
        perDayTime:params.perDayTime,
        partakeType:params.partTakeType,
        registStartTime:params.registStartTime,
        registEndTime:params.registEndTime,
        isH5:params.isH5,
        configure:params.configure

    });

    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ, 'createRedPaperActivity', [activityBean,params.userId]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("createRedPaperActivity result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == 1) {
            logger.error("scoreServ.createRedPaperActivity because: ======" + err);
            res.code = 500;
            res.desc = "创建积分红包失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
//更新一个积分红包活动
RedPaper.prototype.updateRedPaperActivity = function (params, callback) {
    var activityBean = new redPaper_types.Activity({
        id:params.activityId,
        name:params.name,
        maxScore:params.maxScore,
        startTime:params.startTime,
        endTime:params.endTime,
        isShowRule:params.isShowRule,
        isShowRecord:params.isShowRecord,
        brief:params.brief,
        singleGetType:params.singleGetType,
        singleGetValue:params.singleGetValue,
        perLimitTime:params.perLimitTime,
        perDayTime:params.perDayTime,
        partakeType:params.partTakeType,
        registStartTime:params.registStartTime,
        registEndTime:params.registEndTime,
        isH5:params.isH5,
        configure:params.configure

    });

    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ, 'updateRedPaperActivity', [activityBean,params.userId]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("updateRedPaperActivity result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == 1) {
            logger.error("scoreServ.updateRedPaperActivity because: ======" + err);
            res.code = 500;
            res.desc = "更新积分红包失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
//导出积分红包记录
RedPaper.prototype.exportRedPaperExcel = function (params, callback) {
    var queryBean = new redPaper_types.QueryParam4Record({
        id:params.id,
        userPhone:params.userPhone,
        startTime:params.startTime,
        endTime:params.endTime

    });

    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ, 'exportRedPaperExcelForReceived',
        [params.activityId,queryBean]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("exportRedPaperExcelForReceived result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("scoreServ.queryScoreTrade because: ======" + err);
            res.code = 500;
            res.desc = "导出积分红包excel失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
//生成H5页面链接
RedPaper.prototype.generateH5Url = function (params, callback) {
    var queryBean = new redPaper_types.GenerateParam({
        activityId:params.activityId
    });

    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ, 'generateH5Url',
        [queryBean]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("exportRedPaperExcelForReceived result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == 1) {
            logger.error("scoreServ.queryScoreTrade because: ======" + err);
            res.code = 500;
            res.desc = "生成H5页面链接失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};



module.exports = new RedPaper();