/**
 * @auther chiwenheng  0909
 * 第三方卡密 。。。。。
 *
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var coupon_types = require("../thrift/gen_code/fileUpload_types");

function Coupon() {
}

/** 查询活动列表 */
Coupon.prototype.queryActivityList = function (params, callback) {

    var param = new coupon_types.ActivStatisticsParam({
        activName:params.activName,
        activState:params.activState,
        createStartTime:params.createStartTime,
        createStopTime:params.createStopTime,
        beginStartTime:params.beginStartTime,
        beginStopTime:params.beginStopTime,
        endStartTime:params.endStartTime,
        endStopTime:params.endStopTime
    });

    var page = new  pagination_types.Pagination({
       numPerPage:params.numPerPage,
        currentPage:params.currentPage
    });

    logger.error("queryActivityList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'queryCouponActivList', [param,page]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryActivityList result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("queryActivityList because: ======" + err);
            res.code = 500;
            res.desc = "查询活动列表失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};


module.exports = new Coupon();
