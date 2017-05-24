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
        activName: params.activName,
        activState: params.activState,
        createStartTime: params.createStartTime,
        createStopTime: params.createStopTime,
        beginStartTime: params.beginStartTime,
        beginStopTime: params.beginStopTime,
        endStartTime: params.endStartTime,
        endStopTime: params.endStopTime
    });

    var page = new pagination_types.Pagination({
        numPerPage: params.numPerPage,
        currentPage: params.currentPage
    });

    logger.info("queryActivityList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'queryCouponActivList', [param, page]);
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


/** 新建活动 */
Coupon.prototype.createActivity = function (params, callback) {

    var param = new coupon_types.CouponActiv({
        activName: params.activName,
        activImg: params.activImg,
        startTime: params.startTime,
        endTime: params.endTime,
        couponValue: params.couponValue,
        scoreLimit: params.scoreLimit,
        couponNum: params.couponNum,
        couponBeginTime: params.couponBeginTime,
        couponEndTime: params.couponEndTime,
        couponType: params.activScope,
        couponTypeConfig: params.activScopeList,//指定商品,文件路径
        userType: params.userLimit,//usertype
        regStartTime: params.regStartTime,
        regstopTime: params.regstopTime,
        userLimit: params.users,//文件路径
        sendLimit: params.sendLimit
    });

    logger.error("createActivity >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'createCouponActiv', [param]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("createActivity result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("createActivity because: ======" + err);
            res.code = 500;
            res.desc = "新建活动失败";
            callback(res, null);
        } else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};



/** 查询活动发放记录 */
Coupon.prototype.selectActivDetailById = function (params, callback) {
    var param = new coupon_types.ActivDetailStatisticsParam({
        userMobile : params.mobile,
        couponState : params.couponState,
        couponSource :  params.couponSource ,
        getStartTime : params.sendStartTime,
        getStopTime : params.sendStopTime,
        useStartTime : params.useStartTime,
        useStopTime : params.useStopTime
    });
    var page = new pagination_types.Pagination({
        numPerPage: params.numPerPage,
        currentPage: params.currentPage
    });
    logger.info("couponList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'selectActivDetailById', [params.activId,param, page]);
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


/** 导出活动发放记录 */
Coupon.prototype.exportActivDetail = function (params, callback) {
    var param = new coupon_types.ActivDetailStatisticsParam({
        userMobile : params.mobile,
        couponState : params.couponState,
        couponSource :  params.couponSource ,
        getStartTime : params.sendStartTime,
        getStopTime : params.sendStopTime,
        useStartTime : params.useStartTime,
        useStopTime : params.useStopTime
    });
    var page = new pagination_types.Pagination({
        numPerPage: params.numPerPage,
        currentPage: params.currentPage
    });
    logger.info("couponList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'exportActivDetail', [params.activId,param, page]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryActivityList result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("exportActivDetail because: ======" + err);
            res.code = 500;
            res.desc = "导出发放记录失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};


/** 查询活动详情 */
Coupon.prototype.selectActivById = function (params, callback) {
    logger.info("couponList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'selectActivById', [params.activId]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("selectActivById result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("selectActivById because: ======" + err);
            res.code = 500;
            res.desc = "查询活动详情失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/** 修改积分券活动updateActiv */
Coupon.prototype.updateActiv = function (params, callback) {

    var param = new coupon_types.CouponActiv({
        activId : params.activId,
        couponNum:params.couponNum,
        activName: params.activName,
        activImg: params.activImg,
        startTime: params.startTime,
        endTime: params.endTime,
    });
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'updateActiv', [param]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("updateActiv result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("updateActiv because: ======" + err);
            res.code = 500;
            res.desc = "更新活动失败";
            callback(res, null);
        } else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};


/** 添加优惠券活动推荐位 */
Coupon.prototype.addRecommend = function (params, callback) {

    var list =[];
    var arr=params.ids.split(",");
    for (var i = 0; i < arr.length; i++){
        list.push(parseInt(arr[i]));
    }
    logger.info("addRecommend >>>>>>>>>>>  " + JSON.stringify(list));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'addRecommendState', [list]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("addRecommend result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("addRecommend because: ======" + err);
            res.code = 500;
            res.desc = "添加优惠券活动推荐位失败";
            callback(res, null);
        } else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

/** 配置推荐位/添加推荐位列表 */
Coupon.prototype.confRecommendList = function (params, callback) {
    var page = new pagination_types.Pagination({
        numPerPage : params.numPerPage ,//numPerPage
        currentPage : params.currentPage
    });

    logger.info("confRecommendList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'confRecommendList', [params.activTop,page]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("confRecommendList result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("confRecommendList because: ======" + err);
             res.desc = "获取列表失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

/** 取消活动推荐位*/
Coupon.prototype.undoRecommendState = function (params, callback) {

    logger.info("undoRecommendState >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'undoRecommendState', [params.activId]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("undoRecommendState result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("undoRecommendState because: ======" + err);
            res.code = 500;
            res.desc = "取消活动推荐位失败";
            callback(res, null);
        } else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

/** 移动活动推荐位*/
Coupon.prototype.moveActiv = function (params, callback) {

    logger.info("moveActiv >>>>>>>>>>>  " + JSON.stringify(params.coord,params.direction));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'moveActiv', [params.coord,params.direction]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("moveActiv result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("moveActiv because: ======" + err);
            res.code = 500;
            res.desc = "移动活动推荐位失败";
            callback(res, null);
        } else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};
/** 结束活动*/
Coupon.prototype.overActiv = function (params, callback) {

    logger.info("overActiv >>>>>>>>>>>  " + JSON.stringify(params.activId));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'overActiv', [params.activId]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("overActiv result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("overActiv because: ======" + err);
            res.code = 500;
            res.desc = "结束活动失败";
            callback(res, null);
        } else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};


module.exports = new Coupon();
