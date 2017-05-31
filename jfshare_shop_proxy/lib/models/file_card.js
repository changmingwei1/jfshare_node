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
var manager_types = require("../thrift/gen_code/fileUpload_types");

function FileCards() {
}

/** 上传第三方卡密 */
FileCards.prototype.fileToTY = function (params, callback) {

    var params4Upload = new manager_types.FileParam({
        productType: params.productType,
        DataType: params.dataType + "",
        ExpDate_Flag: params.expDate_Flag + "",
        CardNumber: params.cardNumber,
        StartDate: params.startDate,
        excelKeyUrl: params.excelKeyUrl,
        notEncryptFlag: params.notEncryptFlag,  //前端传递此参数,后端不解密
        isTestFlag: params.isTestFlag,           //测试接口 值为false
        sellerName: params.sellerName           //商家名称
    });
    logger.error("params4Upload >>>>>>>>>>>  " + JSON.stringify(params4Upload));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'fileToTY', [params4Upload]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("fileToTY result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("slotServ.fileToTY because: ======" + err);
            res.code = 500;
            res.desc = "上传第三方卡密" + "失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("上传第三方卡密，参数为：" + JSON.stringify(params4Upload));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });

};

/** 管理中心审核 */
FileCards.prototype.auditPass = function (params, callback) {

    var param = new manager_types.AuditParam({
        id: params.id,
        type: params.type
    });
    logger.info("param >>>>>>>>>>>  " + JSON.stringify(param));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'auditPass', [param]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("fileToTY result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == 1) {
            logger.error("slotServ.fileToTY because: ======" + err);
            res.code = 500;
            res.desc = "审核失败";
            callback(res, null);
        } else if (data[0].code == 1) {
            logger.warn("审核失败，参数为：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });

};

/** 查询卡密商家信息列表 */
FileCards.prototype.queryCardsList = function (params, callback) {

    var conditions = new manager_types.QueryConditions({
        productName: params.productName,
        sellerName: params.sellerName,
        status: params.status
    });
    var thrift_pagination = new pagination_types.Pagination({
        currentPage: params.curPage || 1,
        numPerPage: params.perCount
    });

    logger.info("conditions >>>>>>>>>>>  " + JSON.stringify(conditions));
    logger.info("conditions >>>>>>>>>>>  " + JSON.stringify(thrift_pagination));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'queryCardsList', [conditions, thrift_pagination]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("fileToTY result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("slotServ.fileToTY because: ======" + err);
            res.code = 500;
            res.desc = "查询列表失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("查询列表失败，参数为：" + JSON.stringify(params4Upload));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });

};
//

FileCards.prototype.queryGames = function (params, callback) {

    var thirdGameParam = new manager_types.ThirdGameParam({
        thirdGameId: params.thirdGameId,
        firstpy: params.firstpy,
        name: params.name
    });

    logger.info("conditions >>>>>>>>>>>  " + JSON.stringify(thirdGameParam));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'queryGameList', [thirdGameParam]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryGames result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("queryGames because: ======" + err);
            res.code = 500;
            res.desc = "查询游戏列表失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("查询游戏列表失败，参数为：" + JSON.stringify(thirdGameParam));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data[0]);
        }
    });

};
//


FileCards.prototype.queryAreas = function (params, callback) {
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'queryGameAreaList', [params.gameId]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryGames result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("queryGames because: ======" + err);
            res.code = 500;
            res.desc = "查询游戏服务器列表失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("查询游戏服务器列表失败，参数为：" + JSON.stringify(params));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data[0]);
        }
    });

};
//thirdgameCallBack

FileCards.prototype.flowCallBack = function (params, callback) {
    /*******
     *
     * status": "8",
     "orderNo": "FLOW14718295444424574",
     "cstmOrderNo": "test12345678",
     "msg ": "4G用户暂不能订购"
     *
     * *********/
    //var status = "";
    //
    //if (params.status == 8 ) {
    //
    //    status = "11";
    //
    //}
    //if (params.stauts == 7) {
    //    status = "1";
    //}
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'callBackFlow', [params.orderNo, params.cstmOrderNo, params.status, params.msg]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("flowCallBack result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == 1) {
            logger.error("flowCallBack: ======" + err);
            res.code = 500;
            res.desc = "";
            callback(res, null);
        } else if (data[0].code == 1) {
            logger.warn("flowCallBack，参数为：" + JSON.stringify(thirdGameParam));
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data[0]);
        }
    });

};


FileCards.prototype.thirdgameCallBack = function (params, callback) {
    //获取客户端
    var thirdGameParam = new manager_types.ThirdGameCallBackParam({
        retcode: params.retcode,
        username: params.username,
        gameapi: params.gameapi,
        sporderid: params.sporderid,
        money: params.money,
        sign: params.sign
    });

    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'callBackGame', [thirdGameParam]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("thirdgameCallBack result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == 1) {
            logger.error("thirdgameCallBack: ======" + err);
            res.code = 500;
            res.desc = "";
            callback(res, null);
        } else if (data[0].code == 1) {
            logger.warn("thirdgameCallBack，参数为：" + JSON.stringify(thirdGameParam));
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data[0]);
        }
    });

};
/***
 *
 * 查询手机的运行商和归宿地
 *
 *
 *
 * @param params
 * @param callback
 */

FileCards.prototype.queryMobile = function (params, callback) {

    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'queryMobileDic', [params.mobile]);



    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryMobile result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("queryMobile: ======" + err);
            res.code = 500;
            res.desc = "";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("queryMobile，参数为：" + JSON.stringify(thirdGameParam));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data[0]);
        }
    });

};


module.exports = new FileCards();
