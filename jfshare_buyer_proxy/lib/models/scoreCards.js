/**
 * @author YinBo 2016/4/12
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var batchCards_types = require('../thrift/gen_code/batchCards_types');

function ScoreCards(){}

/************************************************现在的****************************************************/
/*积分充值*/
ScoreCards.prototype.recharge = function(param,callback){

    var rechargeParam = new batchCards_types.RechargeParam({
        cardName: param.cardName,
        cardPsd: param.cardPsd,
        userId: param.userId
    });
    logger.info("积分充值请求参数，param=" + JSON.stringify(rechargeParam));
    //获取client
    var scoreCardsServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ,'recharge',[rechargeParam]);
    Lich.wicca.invokeClient(scoreCardsServ, function(err, data){
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

/*查询积分充值记录*/
ScoreCards.prototype.queryRechargeCards = function(param,callback){

    var pagination = new pagination_types.Pagination({
        currentPage: param.curPage,
        numPerPage: param.perCount
    });
    logger.info("查询积分充值记录请求参数，param=" + JSON.stringify(param));
    //获取client
    var scoreCardsServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreCardsServ,'queryRechargeCards',[param.userId,]);
    Lich.wicca.invokeClient(scoreCardsServ, function(err, data){
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


module.exports = new ScoreCards();