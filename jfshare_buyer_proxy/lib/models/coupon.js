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

//web端用户领取优惠券

Coupon.prototype.receiveCoupon = function (params, callback) {
    logger.error("receiveCoupon >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.FileForCardServ, 'receiveCoupon', [params.userId,params.activId,params.fromSource]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("receiveCoupon result:------------" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("receiveCoupon because: ======" + err);
            res.code = 500;
            res.desc = "用户领券失败";
            callback(res, null);
        }else if (data[0].code == 1) {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });
};

//我的券包列表
Coupon.prototype.userCouponList = function (params, callback) {


    var page = new  pagination_types.Pagination({
        numPerPage:params.numPerPage,
        currentPage:params.currentPage
    });

    logger.error("userCouponList >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.FileForCardServ, 'userCouponList', [params.couponState,params.userId,page]);
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
Coupon.prototype.userCouponCount = function (params, callback) {

    logger.error("userCouponCount >>>>>>>>>>>  " + JSON.stringify(params));
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.FileForCardServ, 'userCouponCount',params.userId);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("userCouponCount result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("userCouponCount because: ======" + err);
            res.code = 500;
            res.desc = "查询券包数量失败";
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
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.FileForCardServ, 'queryCouponList', [params.couponRec,params.userId,param,page]);
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
/*Coupon.prototype.queryActiveByProductId = function (params, callback) {
    var list =[];
    var arr=params.productId.split(",");
    for (var i = 0; i < arr.length; i++){
        list.push(parseInt(arr[i]));
    }
    var param = new coupon_types.ProductDetail({
        list :params.list ,
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
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.FileForCardServ, 'queryActiveByProductId', [params.userId,param,page]);
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
};*/
//根据商品Id查看相关的优惠券活动列表**
Coupon.prototype.queryActiveByProductId = function (params, callback) {
    logger.error("queryActiveByProductId >>>>>>>>>>>  " + JSON.stringify(params));

    var userId = params.userId;
    var page = new  pagination_types.Pagination({
        numPerPage:params.numPerPage,
        currentPage:params.currentPage
    });

    var productDtail = new coupon_types.ProductDetail({

        productId:params.productId,
        brandId:params.brandId,
        subjectId:params.subjectId,
        sellerId:params.sellerId
    })
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.FileForCardServ, 'queryActiveByProductId', [productDtail,page,userId]);
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
Coupon.prototype.queryUserCouponByOrder = function (params, callback) {
    logger.error("queryUserCouponByOrder >>>>>>>>>>>  " + JSON.stringify(params));
    var list = [];
    var userId = params.userId;
    var length = params.productList.length;
    for(var i=0;i<length;i++){

        var productDtail = new coupon_types.ProductDetail({
            productId:params.productList[i].productId
        })
        list[i] = productDtail;
    }
    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.FileForCardServ, 'queryUserCouponByOrder',[list,userId]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryUserCouponByOrder result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("queryUserCouponByOrder because: ======" + err);
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



module.exports = new Coupon();