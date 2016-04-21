/**
 * Created by Lenovo on 2015/11/19.
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js("record");

var express_types = require("../thrift/gen_code/express_types");
var Lich = require('../thrift/Lich');
var thrift = require('thrift');

function ExpressSub(args) {

}

/**
 * 记录物流跟踪日子
 * @param data
 * @param callback
 */
ExpressSub.prototype.subscribeRecord = function(data, callback) {
    var thrift_subscirebe_res = new express_types.SubscribeRes();
    try{
        thrift_subscirebe_res.status = data.status;
        thrift_subscirebe_res.nu = data.lastResult.nu;
        thrift_subscirebe_res.com = data.lastResult.com;
        thrift_subscirebe_res.ischeck = data.lastResult.ischeck;
        thrift_subscirebe_res.traceJSON = JSON.stringify(data.lastResult.data);
    }
    catch(e){
        logger.error("subscribeRecord ==> parse jsonObj error, data:" + JSON.stringify(data));
    }

    logger.info("subscribeRecord ==> prepared to call expressServ.subscribeExpressRecord(). com="
        + thrift_subscirebe_res.com + "| nu=" + thrift_subscirebe_res.nu + "| status=" + thrift_subscirebe_res.status);

    var expressServ = new Lich.InvokeBag(Lich.ServiceKey.ExpressServer, "subscribeExpressRecord", [thrift_subscirebe_res]);

    Lich.wicca.invokeClient(expressServ, function (err, rdata) {
        if (err) {
            log.error("subscribeRecord ==> expressServ 连接快递服务失败 ======" + err);
            return callback({failDesc:"网络异常", result:false});
        }

        logger.info("subscribeRecord ==> expressServ.subscribeExpressRecord() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0]["code"] != 0) {
            var failDescList = rdata[0].failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            logger.error("subscribeRecord ==> expressServ.subscribeExpressRecord() 访问失败  =====原因:"+failDesc);
            return callback({failDesc:failDesc, result:false});
        }

        return callback({result:true});
    });
}

/**
 * 订阅物流日志
 * @param data
 * @param callback
 */
ExpressSub.prototype.subscribePost = function(data, callback) {
    var thrift_subscirebe_req = new express_types.SubscribeReq();
    try{
        thrift_subscirebe_req.number = data.lastResult.nu;
        thrift_subscirebe_req.company = data.lastResult.com;
    }
    catch(e){
        logger.error("subscribePost ==> parse jsonObj error, data:" + JSON.stringify(data));
    }

    logger.info("subscribeRecord ==> prepared to call expressServ.subscribeExpressPost(). com="
        + thrift_subscirebe_req.com + "| nu=" + thrift_subscirebe_req.nu);

    var expressServ = new Lich.InvokeBag(Lich.ServiceKey.ExpressServer, "subscribeExpressPost", [thrift_subscirebe_req]);
    Lich.wicca.invokeClient(expressServ, function (err, rdata) {
        if (err) {
            logger.error("subscribePost ==> expressServ 连接快递服务失败 ======" + err);
            return callback({failDesc:"网络异常", result:false});
        }

        logger.info("subscribePost ==> expressServ.subscribeExpressPost() 访问成功  result=" + JSON.stringify(rdata));
        if (rdata[0]["code"] != 0) {
            var failDescList = rdata[0].failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            logger.error("subscribePost ==> expressServ.subscribeExpressPost() 访问失败  =====原因:"+failDesc);
            return callback({failDesc:failDesc, result:false});
        }

        return callback({result:true});
    });
}

module.exports = ExpressSub;
//var req = {
//    company:'yuantong',from:'上海浦东新区',to:'广东深圳南山区',number:"12345678",parameters:{callbackurl:"http://120.24.153.102:13006/kuaidi"}
//}
//var a = new ExpressSubReq(req);
//console.log("1" + JSON.stringify(a));