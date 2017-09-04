/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
//var Address = require('../lib/models/address');
var Coupon = require('../lib/models/coupon');
//
router.post('/couponList', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("优惠券列表参数， arg:" + JSON.stringify(arg));

        var coupon = {
            id:3,
            mobile:18301198617
        }
        var list = [];

        list.push(coupon);
        list.push(coupon);

        result.list = list;
        res.json(result);
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "添加收货地址失败";
        res.json(result);
    }
});

/*商户下单*/
router.post('/notifyOrder', function (req, res, next) {
    logger.error("进入商户下单接口");
    var resContent = {code: "0"};
    try {
        var arg = req.query;
        logger.error("商户下单， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.req == null) {
            resContent.code = "1000";
            resContent.msg = "req参数错误";
            res.json(resContent);
            return;
        }

        Coupon.chinaMobileNotifyOrder(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {

                if(data[0].code==0){
                    resContent.code = data[0].code+"";
                    resContent.msg = "下单成功"
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.msg = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("商户下单:" + ex);
        resContent.code = "1014";
        resContent.msg = "商户下单失败";
        res.json(resContent);
    }
});

/*重发虚拟码*/
router.post('/resendVirtualCode', function (req, res, next) {
    logger.info("重发虚拟码");
    var resContent = {code: "0"};
    try {
        var arg = req.query;
        logger.info("重发虚拟码， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.req == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }

        Coupon.resendVirtualCode(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {

                if(data[0].code==0){
                    resContent.code = data[0].code+"";
                    resContent.msg = "重发虚拟码成功"
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.msg = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("重发虚拟码:" + ex);
        resContent.code = "1014";
        resContent.msg = "重发虚拟码失败";
        res.json(resContent);
    }
});

/*设置虚拟码失效接口*/
router.post('/setCodeInvalid', function (req, res, next) {
    var resContent = {code: "0"};
    try {
        var arg = req.query;
        logger.info("设置虚拟码失效， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.req == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }

        Coupon.setCodeInvalid(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {

                if(data[0].code==0){
                    resContent.code = data[0].code+"";
                    resContent.msg = "设置虚拟码失效成功"
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.msg = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("设置虚拟码失效:" + ex);
        resContent.code = "1014";
        resContent.msg = "设置虚拟码失效失败";
        res.json(resContent);
    }
});


/*创建抵扣券*/
router.post('/createDiscountActiv', function (req, res, next) {
    var resContent = {code: "0"};
    try {
        var arg = req.body;
        logger.info("创建抵扣券请求参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.source == null||arg.source == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.name == null||arg.name == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.value == null||arg.value == "") {
            resContent.code = "1000";
            resContent.msg = "活动名不能为空";
            res.json(resContent);
            return;
        }
        if (arg.couponNum == null||arg.couponNum == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.startTime == null||arg.startTime == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.endTime == null||arg.endTime == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.scope == null||arg.scope == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.scopeList == null||arg.scopeList == "") {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        Coupon.createDiscountActiv(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {
                if(data[0].code==0){
                    resContent.code = data[0].code+"";
                    resContent.msg = "创建活动成功"
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.msg = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("创建活动失败 because :" + ex);
        resContent.code = "1014";
        resContent.msg = "创建活动失败";
        res.json(resContent);
    }
});

/*绑定抵扣券*/
router.post('/bindingCoupon', function (req, res, next) {
    var resContent = {code: "0"};
    try {
        var arg = req.body;
        logger.info("创建抵扣券请求参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.userId == null || arg.userId == "" ) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.loginName == null || arg.loginName == "" ) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.couponId == null || arg.couponId == "" ) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }

        Coupon.bindingCoupon(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {

                if(data[0].code==0){
                    resContent.code = data[0].code+"";
                    resContent.msg = "绑定抵扣券成功"
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.msg = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("绑定抵扣券:" + ex);
        resContent.code = "1014";
        resContent.msg = "绑定抵扣券失败";
        res.json(resContent);
    }
});

/*我的抵扣券列表*/
router.post('/discountList', function (req, res, next) {
    var resContent = {code: "0"};
    try {
        var arg = req.body;
        logger.error("我的抵扣券列表请求参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.userId == null || arg.userId=="" ) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }

        Coupon.discountList(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {

                if(data[0].result.code==0){
                    resContent.unusedList = data[0].unusedList;
                    resContent.useList = data[0].useList;
                    resContent.outList = data[0].outList;
                    res.json(resContent);
                }else if(data[0].result.code==1){

                    var failList = data[0].result.failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.msg = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("查询抵扣券列表失败:" + ex);
        resContent.code = "1014";
        resContent.msg = "查询抵扣券列表失败";
        res.json(resContent);
    }
});

/*用户可用券，不适用券列表*/
router.post('/unusedCouponList', function (req, res, next) {
    var resContent = {code: "0"};
    try {
        var arg = req.body;
        logger.error("用户可用券，不适用券列表请求参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.userId == null || arg.userId=="" ) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.tradeCode == null || arg.tradeCode=="" ) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }

        Coupon.unusedCouponList(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {
                if(data[0].result.code==0){
                    resContent.enableList = data[0].enableList;
                    resContent.disableList = data[0].disableList;
                    res.json(resContent);
                }else if(data[0].result.code==1){

                    var failList = data[0].result.failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.msg = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("查询抵扣券列表失败:" + ex);
        resContent.code = "1014";
        resContent.msg = "查询抵扣券列表失败";
        res.json(resContent);
    }
});

/*获取抵扣券面值*/
router.post('/discountPrice', function (req, res, next) {
    var resContent = {code: "0"};
    try {
        var arg = req.body;
        logger.error("获取抵扣券面值请求参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.couponId == null || arg.couponId=="" ) {
            resContent.code = "1000";
            resContent.msg = "参数错误";
            res.json(resContent);
            return;
        }

        Coupon.useDiscount(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {

                if(data[0].result.code==0){
                    resContent.value = data[0].value;
                    res.json(resContent);
                }else{

                    var failList = data[0].result.failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.msg = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("获取抵扣券面值失败:" + ex);
        resContent.code = "1014";
        resContent.msg = "获取抵扣券面值失败";
        res.json(resContent);
    }
});


module.exports = router;