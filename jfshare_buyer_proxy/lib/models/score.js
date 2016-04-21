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
var score_types = require('../thrift/gen_code/score_types');

function Score(){}

/************************************************现在的****************************************************/
//获取用户积分
Score.prototype.getScore = function(userId,callback){

    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer,'getScore',userId);
    Lich.wicca.invokeClient(scoreServ, function(err, data){
        logger.info("get buyerScore result:" + JSON.stringify(data));
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

//获取积分交易记录
Score.prototype.queryScoreTrade = function(param,callback){
    var thrift_pagination = new pagination_types.Pagination({currentPage:param.curPage,numPerPage:param.perCount});
    var params = new score_types.ScoreTradeQueryParam({
        pagination:thrift_pagination,
        userId:param.userId,
        type:param.type,
        inOrOut:param.inOrOut,
        tradeTime:param.tradeTime});
    //获取client
    var scoreServ = new Lich.InvokeBag(Lich.ServiceKey.ScoreServer,'queryScoreTrade',params);
    Lich.wicca.invokeClient(scoreServ, function(err, data){
        logger.info("get buyerScoreList result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            logger.error("can't get queryScoreTrade because: ======" + err);
            res.code = 500;
            res.desc = "false to get queryScoreTrade";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


module.exports = new Score();