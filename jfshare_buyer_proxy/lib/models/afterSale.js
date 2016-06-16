
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var afterSale_types = require("../thrift/gen_code/afterSale_types");

function AfterSale() {}

//售后审核
AfterSale.prototype.auditPass = function (params, callback) {

    var afterSale = new afterSale_types.AfterSale({
        userId: params.buyerId,
        sellerId: params.sellerId,
        orderId: params.orderId,
        productId: params.productId,
        type: params.type,//申请类型. 1:用户申请， 2:系统申请
        state: params.state, //根据实际情况定义 如 1：新建（待审核） 2：审核通过 3：审核不通过
        skuNum: params.skuNum
    });

    logger.info("AfterSaleServ-auditPass  args:" + JSON.stringify(afterSale));

    var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "auditPass", afterSale);

    Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
        logger.info("AfterSaleServ-auditPass  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("AfterSaleServ-auditPass  失败原因 ======" + err);
            res.code = 500;
            res.desc = "审核失败！";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//申请审核
AfterSale.prototype.request = function (params, callback) {
    var afterSaleParam = new afterSale_types.AfterSale({
        userId: params.userId,
        sellerId: params.sellerId,
        orderId: params.orderId,
        productId: params.productId,
        type: 1,//申请类型. 1:用户申请， 2:系统申请
        state: 1,
        skuNum: params.skuNum,
        orderTime: params.createTime,
        reason: params.reason,
        userComment: params.userComment
    });
    logger.info("AfterSaleServ-request  args:" + JSON.stringify(afterSaleParam));

    var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "request", afterSaleParam);

    Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
        logger.info("AfterSaleServ-request  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("AfterSaleServ-request  失败原因 ======" + err);
            res.code = 500;
            res.desc = "申请审核失败！";
            callback(res, null);
        } else if(data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//查询售后信息
AfterSale.prototype.queryAfterSale = function (params, callback) {

    var afterSaleQueryParam = null;
    if (params.orderIdList == null) {
        afterSaleQueryParam = new afterSale_types.AfterSaleQueryParam({
            userId: params.userId,
            sellerId: params.sellerId,
            orderId: params.orderId,
            productId: params.productId,
            skuNum: params.skuNum
            //加上sku
        });
    } else {
        afterSaleQueryParam = new afterSale_types.AfterSaleQueryParam({
            orderIdList:params.orderIdList
        });
    }

    logger.info("AfterSaleServ-queryAfterSale  args:" + JSON.stringify(afterSaleQueryParam));
    try {
        var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "queryAfterSale", afterSaleQueryParam);

        Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
            logger.info("AfterSaleServ-queryAfterSale  result:" + JSON.stringify(data));
            var res = {};
            if (err || data[0].result.code == "1") {
                logger.error("AfterSaleServ-queryAfterSale  失败原因 ======" + err);
                res.code = 500;
                res.desc = "查询审核信息失败！";
                callback(res, null);
            } else {
                callback(null, data[0].afterSaleList);
            }
        });
    } catch (ex) {
        res.code = 500;
        res.desc = "查询审核信息失败！";
        callback(res, null);
    }

};

/*查询售后订单*/
AfterSale.prototype.queryAfterSaleOrder = function (params, callback) {

    var pagination = new pagination_types.Pagination({
        numPerPage:params.perCount,
        currentPage:params.curPage
    });
    var param = new afterSale_types.AfterSaleOrderParam({
        userId: params.userId,
        orderId: params.orderId
    });

    var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "queryAfterSaleOrder", [param,pagination]);

    Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
        logger.info("AfterSaleServ-queryAfterSaleOrderList  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("AfterSaleServ-queryAfterSaleOrderList  失败原因 ======" + err);
            res.code = 500;
            res.desc = "查询售后订单列表失败！";
            callback(res, null);
        } else {
            callback(null, data[0]);
        }
    });
};


module.exports = new AfterSale();