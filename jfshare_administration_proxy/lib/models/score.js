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
        tradeTime:params.tradeTime,
        inOrOut:params.inOrOut,
        type:params.type,
        beginTime:params.beginTime,
        endTime:params.endTime
    });
    var pagination = new pagination_types.Pagination({
        currentPage: params.curpage,
        numPerPage: params.percount
    });
    //获取客户端
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer, 'queryScoreTrade', [coreTradeQueryParam,pagination]);
    Lich.wicca.invokeClient(scoreServ, function (err, data) {
        logger.info("userServ.queryScoreTrade result:" + JSON.stringify(data));
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



module.exports = new Score();