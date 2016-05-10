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
                    dataArr.push({productId: a.productId, sellerId: a.sellerId, productName: a.productName,orgPrice: (Number(a.orgPrice)/100).toFixed(2), curPrice: (Number(a.curPrice) /100).toFixed(2),totalSales: a.totalSales, imgUrl: imgUri,activeState: a.activeState,crateTime: a.createTime});
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

//审核商品
router.post('/updateProductState', function(request, response, next) {

    logger.info("进入审核商品接口");
    var result = {code: 200};

    try {
         //var params = request.query;
        var params = request.body;
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
        if(params.state == null || params.state == "" || params.state<0 || params.state>1){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        //表示拒绝
        if(params.state ==1){
            params.activeState = 102;
        }else if(params.state ==0){
            params.activeState = 300;
        }else{
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        Product.setProductState(params, function(err,data){
            if(err){
                response.json(err);
                return;
            }
            response.json(result);
            return;
        });


    } catch (ex) {
        logger.error("apply state error:" + ex);
        result.code = 500;
        result.desc = "审核商品失败";
        response.json(result);
    }
});


module.exports = router;