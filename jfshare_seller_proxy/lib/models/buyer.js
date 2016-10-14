/**
 * @author YinBo 2016/4/12
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var buyer_types = require('../thrift/gen_code/buyer_types');

function Buyer(){}

/************************************************现在的****************************************************/

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
Buyer.prototype.getListBuyer = function(param,callback) {

    logger.info("批量获取个人信息的参数：" + JSON.stringify(param));

    //获取client
    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer, 'getListBuyer', [param]);
    Lich.wicca.invokeClient(buyerServ, function (err, data) {
        logger.info("get buyerList result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("can't get buyerList because: ======" + err);
            res.code = 500;
            res.desc = "false to get buyerList";
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
}

module.exports = new Buyer();