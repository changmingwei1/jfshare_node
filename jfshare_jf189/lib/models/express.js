/**
 * Created by Lenovo on 2015/11/19.
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var result_types = require("../thrift/gen_code/result_types");
var order_types = require("../thrift/gen_code/express_types");
var Lich = require('../thrift/Lich');
var thrift = require('thrift');

function Express() {}

/**
 * 查询快递/物流抓取新
 * @param paramters
 * @param callback
 */
Express.prototype.query = function(paramters, preRet, callback) {
    var queryParam = new order_types.ExpressParams({
        queryType: paramters.queryType,
        comId: paramters.comId,
        num: paramters.num,
        orderId: paramters.orderId,
    });

    // 获取client
    var expressServ = new Lich.InvokeBag(Lich.ServiceKey.ExpressServer, "expressQuery", [queryParam]);
    Lich.wicca.invokeClient(expressServ, function (err, data) {
        if (err) {
            logger.error("调用expressServ-expressQuery快递/物流信息  失败原因 ======" + err);
            var failDesc = new result_types.FailDesc({desc:"系统繁忙"});
            callback({result:false, failDesc:failDesc});
            return;
        }

        if (data[0].result.code == 1) {
            var failList = data[0].result.failDescList;
            logger.error("调用expressServ-expressQuery快递/物流信息  失败原因 ======" + JSON.stringify(failList));
            callback({result:false, failDesc:failList[0]});
            return;
        }

        logger.info("调用expressServ-expressQuery快递/物流信息  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        preRet.result = true;
        preRet.expressInfo = data[0].expressInfo;
        preRet.expressTrace = data[0].expressTrace;
        return callback(preRet);
    });
}

module.exports = new Express();
