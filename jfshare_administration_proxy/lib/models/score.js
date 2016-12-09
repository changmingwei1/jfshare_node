/**
 * Created by huapengpeng on 2016/4/21.
 */
/**
 * @auther YinBo 2016/4/12
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var score_types = require("../thrift/gen_code/score_types");

function Score() {
}
//根据userId查询积分
Score.prototype.getScore = function (params, callback) {

    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'getScore', [params.userId]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("scoreServ.getScore result:" + JSON.stringify(data));
        var res = {};
        if (err/* || data[0].result.code == 1*/) {
            logger.error("signin fail because: ======" + err);
            res.code = 500;
            res.desc = "false to signin";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
//查询详情
Score.prototype.getScoreDetail = function (params, callback) {
    var coreTradeQueryParam= new score_types.ScoreTradeQueryParam({
        userId:params.userId,
        inOrOut:params.inOrOut,
        type:params.scoreType,
        startTime:params.beginTime,
        endTime:params.endTime
    });
    var pagination = new pagination_types.Pagination({
        currentPage: params.curpage,
        numPerPage: params.percount
    });
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'queryScoreTrade', [coreTradeQueryParam,pagination]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("scoreServ.queryScoreTrade result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("scoreServ.queryScoreTrade because: ======" + err);
            res.code = 500;
            res.desc = "查询积分错误";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//查询积分记录
Score.prototype.queryScoreUser = function (params, callback) {
    var scoreUserQueryParam = new score_types.ScoreUserQueryParam({
        userId:params.userId,
        mobile:params.mobile,
        startTime:params.startTime,
        endTime:params.endTime,
        amount:params.amount/*积分值  0:全部   1: 0积分  2:0以上积分 */
    });
    var pagination = new pagination_types.Pagination({
        currentPage: params.curpage,
        numPerPage: params.percount
    });
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'queryScoreUser', [scoreUserQueryParam,pagination]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("scoreServ.queryScoreUser result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("scoreServ.queryScoreUser because: ======" + err);
            res.code = 500;
            res.desc = "查询积分错误";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//导出记录
Score.prototype.exprotVipScore = function (params, callback) {
    var exprotVipScoreParam = new score_types.ExprotVipScoreParam({
        userId:params.userId,/*用户id*/
        mobile:params.mobile,/*手机号 */
        startTime:params.startTime,/*开始时间*/
        endTime:params.endTime,/*结束时间 */
        amount:params.amount/*积分值  0:全部   1: 0积分  2:0以上积分 */
    });


    logger.info("请求参数param :" + JSON.stringify(exprotVipScoreParam));
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'exprotVipScore', [exprotVipScoreParam]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("scoreServ.exprotVipScore result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("scoreServ.exprotVipScore because: ======" + err);
            res.code = 500;
            res.desc = "导出积分记录错误";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//统计记录
Score.prototype.scoreStatistic = function (params, callback) {
    var queryParams = new score_types.ScoreStatisticParam({
            startTime:params.startTime,/*开始时间*/
            endTime:params.endTime,/*结束时间*/
            type:params.type,/*积分明细类型*/
            inoroutType:params.inoroutType,/*增长消费类型*/
        }
    );

    var page = new pagination_types.Pagination({
        numPerPage: params.numPerPage,
        currentPage: params.currentPage
    });
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'scoreStatistic', [queryParams, page]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("scoreStatistic result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("scoreServ.scoreStatistic 失败 because: ======" + err +data);
            res.code = 500;
            res.desc = "积分增长消费统计列表失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//导出记录
Score.prototype.exprotScoreStatistic = function (params, callback) {
    var exprotParam = new score_types.ExprotScoreStatisticParam({
        startTime:params.startTime,/*开始时间*/
        endTime:params.endTime,/*结束时间*/
        type:params.type,/*积分明细类型*/
        inoroutType:params.inoroutType,/*增长消费类型*/

    });

    logger.info("请求参数param :" + JSON.stringify(exprotParam));
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'exprotScoreStatistic', [exprotParam]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("ScoreServ.exprotScoreStatistic result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("ScoreServ.exprotScoreStatistic because: ======" + err);
            res.code = 500;
            res.desc = "导出积分增长消费统计记录错误";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//累计增长和消耗统计记录
Score.prototype.scoreTotalStatistic = function (params, callback) {
    var queryParams = new score_types.ScoreTotalStatisticParam({
            startTime:params.startTime,/*开始时间*/
            endTime:params.endTime,/*结束时间*/
        }
    );
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'scoreTotalStatistic', [queryParams]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("scoreTotalStatistic result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("scoreServ.scoreTotalStatistic 失败 because: ======" + err +data);
            res.code = 500;
            res.desc = "积分累计增长消费统计列表失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//导出累计增长和消耗统计记录
Score.prototype.exprotScoreTotalStatistic = function (params, callback) {
    var exprotParam = new score_types.ExprotScoreTotalStatisticParam({
        startTime:params.startTime,/*开始时间*/
        endTime:params.endTime,/*结束时间*/
    });

    logger.info("请求参数param :" + JSON.stringify(exprotParam));
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'exprotScoreTotalStatistic', [exprotParam]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("ScoresServ.exprotScoreTotalStatistic result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("ScoreServ.exprotScoreTotalStatistic because: ======" + err);
            res.code = 500;
            res.desc = "导出累计积分增长消费统计记录错误";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//积分存量统计记录
Score.prototype.queryScoreStockHistory = function (params, callback) {
    var queryParams = new score_types.QueryScoreStockHistoryParam({
            startTime:params.startTime,/*开始时间*/
            endTime:params.endTime,/*结束时间*/
        }
    );

    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'queryScoreStockHistory', [queryParams]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("queryScoreStockHistory result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("scoreServ.queryScoreStockHistory 失败 because: ======" + err +data);
            res.code = 500;
            res.desc = "积分存量统计列表失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//导出积分存量统计记录
Score.prototype.exprotScoreStockHistory = function (params, callback) {
    var exprotParam = new score_types.ExprotScoreStockHistoryParam({
        startTime:params.startTime,/*开始时间*/
        endTime:params.endTime,/*结束时间*/
    });

    logger.info("请求参数param :" + JSON.stringify(exprotParam));
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'exprotScoreStockHistory', [exprotParam]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("ScoreServ.exprotScoreStockHistory result:" + JSON.stringify(data));
        var res = {};
        if (err|| data[0].result.code == 1) {
            logger.error("ScoreServ.exprotScoreStockHistory because: ======" + err);
            res.code = 500;
            res.desc = "导出积分存量统计记录错误";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


module.exports = new Score();