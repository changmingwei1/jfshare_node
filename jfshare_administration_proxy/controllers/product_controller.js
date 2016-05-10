/**
 * Created by zhaoshenghai on 16/3/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');

var pagination_types = require('../lib/thrift/gen_code/pagination_types');

var product_types = require("../lib/thrift/gen_code/product_types");

//商品列表
router.post('/list', function(request, response, next) {
    logger.info("进入获取商品列表接口");
    var result = {code:200};

    try{

       var params = request.body;
        logger.info("get product list args:" + JSON.stringify(params));

        if(params.percount == null || params.percount == "" ||params.percount <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if(params.curpage == null || params.curpage == "" ||params.curpage <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        //var percount = params.percount || 20;
        //var curpage = params.curpage || 1;

        //async.series([
        //        function (callback) {
        //            try {
        //                Product.queryProductList(params, function(err,data){
        //
        //                    if(err){
        //                        result.code = 500;
        //                        result.desc = "失败";
        //                        response.json(result);
        //                    } else {
        //                        var productSurveyList = data[0].productSurveyList;
        //                        productSurveyList.forEach(function(a){
        //                            var imgUri = a.imgUrl.split(",")[0];
        //                            dataArr.push({productId: a.productId, productName: a.productName,orgPrice: (Number(a.orgPrice)/100).toFixed(2), curPrice: (Number(a.curPrice) /100).toFixed(2),totalSales: a.totalSales, imgUrl: imgUri});
        //                        });
        //
        //                        var pagination = data[0].pagination;
        //                        result.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};
        //                        logger.info("get product list response:" + JSON.stringify(result));
        //                        result.productList = dataArr;
        //                        response.json(result);
        //
        //                    }
        //
        //                });
        //            }
        //            catch
        //                (ex) {
        //                logger.info("订单服务异常:" + ex);
        //                return callback(1, null);
        //            }
        //        },
        //        function (callback) {
        //            try {
        //
        //            } catch (ex) {
        //                logger.info("售后服务异常:" + ex);
        //                return callback(2, null);
        //            }
        //
        //        }
        //    ],
        //    function (err, results) {
        //        if (err == 1) {
        //            logger.error("查询订单列表失败---订单服务异常：" + err);
        //            result.code = 500;
        //            result.desc = "查询订单失败";
        //            response.json(result);
        //            return;
        //        }
        //        if (err == 2) {
        //            logger.error("查询售后失败--售后服务异常：" + err);
        //            response.json(results[0]);
        //            return;
        //        }
        //
        //        if (err == null && err != 3) {
        //            logger.info("shuju------------->" + JSON.stringify(results));
        //            result = results[0];
        //            result.afterSaleList = results[1];
        //            response.json(result);
        //            return;
        //        } else {
        //            logger.info("shuju------------->" + JSON.stringify(results));
        //            result = results[0];
        //
        //            response.json(result);
        //            return;
        //        }
        //    }
        //);
        Product.queryProductList(params, function(err,data){
            var dataArr = [];
            if(err){
                result.code = 500;
                result.desc = "失败";
                response.json(result);
            } else {
                var productSurveyList = data[0].productSurveyList;
                productSurveyList.forEach(function(a){
                    var imgUri = a.imgUrl.split(",")[0];
                    dataArr.push({productId: a.productId, productName: a.productName,orgPrice: (Number(a.orgPrice)/100).toFixed(2), curPrice: (Number(a.curPrice) /100).toFixed(2),totalSales: a.totalSales, imgUrl: imgUri});
                });

                var pagination = data[0].pagination;
                result.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};
                logger.info("get product list response:" + JSON.stringify(result));
                result.productList = dataArr;
                response.json(result);

            }

        });
    } catch (ex) {
        logger.error("获取商品列表失败:" + ex);
        result.code = 500;
        result.desc = "获取商品列表失败";
        response.json(result);
    }
});

//
router.post('/updateProductState', function(request, response, next) {

    logger.info("进入审核商品接口");
    var result = {code: 200};

    try {
         //var params = request.query;
        var params = request.body;
        //var params = request.body;
        logger.info("审核商品:" + params);

        //参数校验
        //参数验证
        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if(params.productId == null || params.productId == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if(params.state == null || params.state == ""){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        //表示拒绝
        if(params.state ==1){
            result.activeState = 102;
            response.json(result);
            return;
        }
        //表示同意
        if(params.state ==0){
            result.activeState = 300;
            response.json(result);
            return;
        }

        response.json(result);

    } catch (ex) {
        logger.error("apply state error:" + ex);
        result.code = 500;
        result.desc = "审核商品失败";
        res.json(result);
    }
});


module.exports = router;