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
    logger.info("进入商户下单接口");
    var resContent = {code: "0"};
    try {
        var arg = req.body;
        logger.info("商户下单， arg:" + JSON.stringify(arg));
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

        Coupon.chinaMobileNotifyOrder(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {

                if(data[0].code==0){
                    resContent.code = data[0].code+"";
                    resContent.msg = "下单成功"
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].failDescList;
                    resContent.code = failList[0].getFailCode()+"";
                    resContent.msg = failList[0].getDesc();
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
router.post('/resendCode', function (req, res, next) {
    logger.info("重发虚拟码");
    var resContent = {code: "0"};
    try {
        var arg = req.body;
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

                    var failList = data[0].failDescList;
                    resContent.code = failList[0].getFailCode()+"";
                    resContent.msg = failList[0].getDesc();
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
router.post('/codeInvalid', function (req, res, next) {
    logger.info("设置虚拟码失效");
    var resContent = {code: "0"};
    try {
        var arg = req.body;
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

                    var failList = data[0].failDescList;
                    resContent.code = failList[0].getFailCode()+"";
                    resContent.msg = failList[0].getDesc();
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
module.exports = router;