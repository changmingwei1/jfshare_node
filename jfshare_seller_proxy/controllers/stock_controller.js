/**
 * Created by Administrator on 2016/5/5 0005.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Stock = require('../lib/models/stock');

var Storehouse = require('../lib/models/storehouse');


// 查询商品的总库存
/****
 *
 * 这个接口不应该对外开放，只是服务器内部直接调用stock将库存总数设置到商品中
 *
 *
 *
 *
 */
//router.post('/query', function(request, response, next) {
//    var result = {code: 200};
//
//    try{
//        var params = request.body;
//        logger.info("查询订单列表请求参数：" + JSON.stringify(params));
//
//        Stock.queryProductTotal(params, function (err, data) {
//            if(err){
//                response.json(err);
//                return;
//            }
//            response.json(data);
//            logger.info("get order list response:" + JSON.stringify(result));
//        });
//    } catch (ex) {
//        logger.error("get product stock error:" + ex);
//        result.code = 500;
//        result.desc = "获取商品库存失败";
//        response.json(result);
//    }
//});
//
////查询某个shu在某个省份的库存，其实就是查询某个
//router.post('/quertySku', function(request, response, next) {
//    var result = {code: 200};
//
//    try{
//        var params = request.body;
//        logger.info("查询sku库存请求参数：" + JSON.stringify(arg));
//
//        if(params.skuNum == null ||params.skuNum=="") {
//            result.code = 400;
//            result.desc = "参数错误";
//            response.json(result);
//            return;
//        }
//
//        if(params.provinceId == null|| params.provinceId == ""||params.provinceId <=0){
//            result.code = 400;
//            result.desc = "参数错误";
//            response.json(result);
//            return;
//        }
//        if(params.sellerId == null|| params.sellerId == ""||params.sellerId <=0){
//            result.code = 400;
//            result.desc = "参数错误";
//            response.json(result);
//            return;
//        }
//        if(params.productId == null||params.productId == ""){
//            result.code = 400;
//            result.desc = "参数错误";
//            response.json(result);
//            return;
//        }
//        var storehouseId = "";
//        async.waterfall([
//                function (callback) {
//                    Storehouse.list(params, function(err, data) {
//
//
//                        /*********库存列表进行处理查询************/
//
//                        storehouseId = 1;
//                        logger.info("get storehouse list response:" + JSON.stringify(data));
//                        callback(null,storehouseId);
//                    })
//                },
//                function (storehouseId,callback) {
//                    //查询sku库存
//                    Stock.queryBySkuAndStoreId(params, function (err, data) {
//                        if(err){
//                            response.json(err);
//                            return;
//                        }
//                        response.json(result);
//                        logger.info("quertySku response:" + JSON.stringify(result));
//                    })
//                }
//
//            ],
//            function (err, data) {
//                if (err) {
//                    logger.error("get skuStock error:" + err);
//                } else {
//                    logger.info("get skuStock response:" + JSON.stringify(result));
//                    response.json(result);
//
//                }
//            });
//    } catch (ex) {
//        logger.error("get product stock error:" + ex);
//        result.code = 500;
//        result.desc = "获取商品库存失败";
//        response.json(result);
//    }
//});
module.exports = router;