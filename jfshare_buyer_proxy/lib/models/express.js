
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var express_types = require("../thrift/gen_code/express_types");


function Expresss(){}
/*查询物流信息及跟踪记录*/
Expresss.prototype.queryExpress = function(params, callback){

    var expressParams = new express_types.ExpressParams({
       orderId:params.orderId||"17870082",
        num:params.num ||"3305764433295",
        queryType:2
    });
    // 获取client
    var expressOrderServ = new Lich.InvokeBag(Lich.ServiceKey.ExpresssServer, "expressQuery",expressParams);
    // 调用 expressOrderServ
    Lich.wicca.invokeClient(expressOrderServ, function (err, data) {
        logger.info("expressOrderServ-expressQuery result:" + JSON.stringify(data));
        if(err || data[0].result.code == 1){
            var ret = {};
            logger.error("expressOrderServ-expressQuery  失败原因 ======" + err);
            ret.code = 500;
            ret.desc = "查询物流失败！";
            callback(ret,null);
        }
        callback(null,data);
    });
};

module.exports = new Expresss();