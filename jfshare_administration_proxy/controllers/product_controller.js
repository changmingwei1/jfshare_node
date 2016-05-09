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
        var params = request.query;
       // var params = request.body;
        logger.info("get product list args:" + JSON.stringify(params));

        var percount = params.percount || 20;
        var curpage = params.curpage || 1;


        //参数验证


        //静态数据，设置分页
        result.page = {total: 100, pageCount:5};

        //商品列表

        var productList = [];

        var product = {};

        //product.productId  = "ze160120140359000104";
        //product.productName= "韩国现代（Hyundai）酸奶机HYSZ-5302";
        //product.subjectName= "家具生活,生活日用,酸奶机";
        //product.sellerId = 1;
        //product.curPrice = "200";
        //product.orgPrice = "250";
        //product.activeStock = "100"; //创建成功
        //product.storeValue = 1000;
        //product.createTime = "2015-06-07";
        //product.imgUrl = "530A5A4577179F1068981FB10BD09BB5.jpg,530A5A4577179F1068981FB10BD09BB5.jpg,530A5A4577179F1068981FB10BD09BB5.jpg";
        //productList.push(product);
        //
        //
        //var product1 = {};
        //product1.productId  = "ze160120162205000328";
        //product1.productName= "哆啦A梦 炫酷伞折叠包套装 DM-4522";
        //product1.subjectName= "家具生活,生活日用,伞";
        //product.sellerId = 2;
        //product1.curPrice = "100";
        //product1.orgPrice = "150";
        //product1.activeStock = "200"; //审核中
        //product1.storeValue = 1000;
        //product1.createTime = "2015-06-07";
        //product1.imgUrl = "7E2D8E99229FB372F8A9FE609B3350CF.jpg,3CBC93724AF7B26328508DE9F32F68F7.jpg,EB016A0A49D59E8C23ADB2D358E53D51.jpg,E0E865C6BFCD68A36D8CBA65DDAB784A.jpg,AD12C9CBBE0E4916B26CC47F3A270C7F.jpg";
        //productList.push(product1);
        //
        //var product2 = {};
        //product2.productId  = "ze160120162205000327";
        //product2.productName= "点卡 梦幻西游 49块";
        //product2.subjectName= "虚拟商品,游戏,点券";
        //product.sellerId = 2;
        //product2.curPrice = "49";
        //product2.orgPrice = "50";
        //product2.activeStock = "300"; //销售中
        //product2.storeValue = 1000;
        //product2.createTime = "2015-06-07";
        //product2.imgUrl = "7E2D8E99229FB372F8A9FE609B3350CF.jpg,3CBC93724AF7B26328508DE9F32F68F7.jpg,EB016A0A49D59E8C23ADB2D358E53D51.jpg,E0E865C6BFCD68A36D8CBA65DDAB784A.jpg,AD12C9CBBE0E4916B26CC47F3A270C7F.jpg";
        //productList.push(product2);
        //
        //productList.push(product);
        //productList.push(product1);
        //result.productList = productList;
        //
        //response.json(result);
        Product.queryProductList(params, function(data){
            var dataArr = [];

            var code = data[0].result.code;
            if(code == 1){
                result.code = 500;
                result.desc = "失败";
                response.json(result);
            } else {
                var productSurveyList = data[0].productSurveyList;
                productSurveyList.forEach(function(a){
                    var imgUri = a.imgUrl.split(",")[0];
                    dataArr.push({productId: a.productId, productName: a.productName, curPrice: a.curPrice /100, imgUrl: imgUri});
                });

                var pagination = data[0].pagination;
                result.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};
                result.productList = dataArr;
                response.json(result);
                logger.info("get product list response:" + JSON.stringify(result));
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