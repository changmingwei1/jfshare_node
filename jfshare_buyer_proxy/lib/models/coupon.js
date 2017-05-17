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

function coupon() {

}
    /** 活动下的券信息查询 */
    Coupon.prototype.selectActivDetailById = function (params, callback) {
        var activId=params.value;
        var param = new coupon_types.ActivDetailStatisticsParam({
            userMobile:params.userMobile,
            couponState:params.couponState,
            couponSource:params.couponSource,
            getStartTime:params.getStartTime,
            getStopTime:params.getStopTime,
            useStartTime:params.useStartTime,
            useStopTime:params.useStopTime
        });

        var page = new  pagination_types.Pagination({
            numPerPage:params.numPerPage,
            currentPage:params.currentPage
        });

        logger.error("selectActivDetailById >>>>>>>>>>>  " + JSON.stringify(params));
        //获取客户端
        var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'selectActivDetailById', [param,page]);
        Lich.wicca.invokeClient(slotServ, function (err, data) {
            logger.info("selectActivDetailById result:" + JSON.stringify(data));
            var res = {};
            if (err) {
                logger.error("selectActivDetailById because: ======" + err);
                res.code = 500;
                res.desc = "查询券列表失败";
                callback(res, null);
            } else if (data[0].result.code == 1) {
                res.code = 500;
                res.desc = data[0].result.failDescList[0].desc;
            } else {
                callback(null, data);
            }
        });
    };

//web端用户领取优惠券
Coupon.prototype.receiveCoupon = function (params, callback) {
    var userId=params.userId;
    var activId=params.activId;
    var fromSource=params.fromSource;
    logger.error("receiveCoupon >>>>>>>>>>>  " + JSON.stringify(param));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'receiveCoupon', param);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("receiveCoupon result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("receiveCoupon because: ======" + err);
            res.code = 500;
            res.desc = "用户领券失败";
            callback(res, null);
        } else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }

    });
};
//用户分享链接
Coupon.prototype.shareUrl = function (params, callback) {
    var activId=params.activId;
    logger.error("shareUrl >>>>>>>>>>>  " + JSON.stringify(param));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'shareUrl', param);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("shareUrl result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("shareUrl because: ======" + err);
            res.code = 500;
            res.desc = "分享失败";
            callback(res, null);
        } else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }

    });
};
//我的券包列表
Coupon.prototype.userCouponList = function (params, callback) {

    var couponState=params.couponState;
    var userId=params.userId;

    var page = new  pagination_types.Pagination({
        numPerPage:params.numPerPage,
        currentPage:params.currentPage
    });

    logger.error("userCouponList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'userCouponList', [param,page]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("userCouponList result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("userCouponList because: ======" + err);
            res.code = 500;
            res.desc = "查询券列表失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};
//券包列表数量
Coupon.prototype.queryCouponList = function (params, callback) {

    logger.error("queryCouponList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'queryCouponList');
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryCouponList result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("queryCouponList because: ======" + err);
            res.code = 500;
            res.desc = "查询券列表失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};
//精品好券和更多好券
Coupon.prototype.queryCouponList = function (params, callback) {
    var couponRec=params.couponRec;
    var userId=params.userId;
    var param = new coupon_types.CouponStatisticsParam({
        factor:params.factor,
        findAll:params.findAll,
        allUsable:params.allUsable,
        category:params.category,
        brand:params.brand,
        merchant:params.merchant,
        fixed:params.fixed
    });

    var page = new  pagination_types.Pagination({
        numPerPage:params.numPerPage,
        currentPage:params.currentPage
    });

    logger.error("queryCouponList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'queryCouponList', [param,page]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryCouponList result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("queryCouponList because: ======" + err);
            res.code = 500;
            res.desc = "查询券列表失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};
//根据商品Id查看相关的优惠券活动列表**
Coupon.prototype.queryActiveByProductId = function (params, callback) {
    var userId=params.userId;
    var param = new coupon_types.ProductDetail({
        productId:params.productId,
        brandId:params.brandId,
        subjectId:params.subjectId,
        sellerId:params.sellerId,
        price:params.price,
        num:params.num

    });

    var page = new  pagination_types.Pagination({
        numPerPage:params.numPerPage,
        currentPage:params.currentPage
    });

    logger.error("queryActiveByProductId >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'queryActiveByProductId', [param,page]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryActiveByProductId result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("queryActiveByProductId because: ======" + err);
            res.code = 500;
            res.desc = "查询相关活动失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};
//提交订单页面用户可用和不可用卡券列表**
Coupon.prototype.queryActiveByProductId = function (params, callback) {
        var userId=params.userId;
    logger.error("queryActiveByProductId >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'queryActiveByProductId', param);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryActiveByProductId result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("queryActiveByProductId because: ======" + err);
            res.code = 500;
            res.desc = "查询相关活动失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};


module.exports = new coupon();