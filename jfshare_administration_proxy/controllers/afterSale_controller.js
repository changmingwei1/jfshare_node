/**
 * Created by Administrator on 2016/5/6 0006.
 */

var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var AfterSale = require('../lib/models/afterSale');

//售后审核
router.post('/review', function(request, response, next) {
    var result = {code: 200};

    try{
        var params = request.body;
        logger.info("售后审核的参数:" + JSON.stringify(arg));
        //productId: string //产品id
        //orderId: string   //订单id
        //skuId: int		 //skuid
        //userid:int     //用户id
        //sellerId:int   //卖家id
        //reviewResult: string //审核的结果  //0表示同意 1 表示拒绝

        if(params.productId == null || params.productId == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if(params.orderId == null || params.orderId == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if(params.userId == null || params.userId == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        if(params.sellerId == null || params.sellerId == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        if(params.skuNum == null || params.skuNum == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }


        AfterSale.auditPass(arg, function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            res.json(result);
            logger.info(" AfterSale.auditPass response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error(" AfterSale.auditPass error:" + ex);
        result.code = 500;
        result.desc = "审核失败";
        response.json(result);
    }
});
//审核信息查询
router.post('/toReview', function(request, response, next) {
    var result = {code: 200};

    try{
        var params = request.body;
        logger.info("审核信息查询， arg:" + JSON.stringify(params));

        if(params.productId == null || params.productId == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if(params.orderId == null || params.orderId == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if(params.skuNum == null || params.skuNum == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        AfterSale.queryAfterSale(params,function(err, data) {
            if(err){
                response.json(err);
                return;
            }
            response.json(result);
            logger.info("AfterSale.queryAfterSale response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("AfterSale.queryAfterSale error:" + ex);
        result.code = 500;
        result.desc = "查询审核信息失败";
        response.json(result);
    }
});
//申请售后 在seller中没有这个功能，因此不对外开发接口，
///具体的服务调用请看afterSale.js文件
//router.post('/review', function (req, res, next) {
//    var result = {code: 200};
//
//    try {
//        var arg = req.body;
//        logger.info("更新收货地址请求， arg:" + JSON.stringify(arg));
//
//        if(arg == null) {
//            result.code = 400;
//            result.desc = "请求参数错误";
//            res.json(result);
//            return;
//        }
//        if(arg.userId == null || arg.addrId == null){
//            result.code = 400;
//            result.desc = "请求参数错误";
//            res.json(result);
//            return;
//        }
//
//        Product.updateAddress(arg, function(err, data) {
//            if(err){
//                res.json(err);
//                return;
//            }
//            res.json(result);
//            logger.info("update address response:" + JSON.stringify(result));
//        });
//    } catch (ex) {
//        logger.error("update address error:" + ex);
//        result.code = 500;
//        result.desc = "更新收货地址信息失败";
//        res.json(result);
//    }
//});

module.exports = router;