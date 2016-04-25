/**
 * Created by zhaoshenghai on 16/3/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var detailStock = require('../lib/models/detail_stock');

router.get('/list', function(req, res, next) {
    logger.info("进入获取商品列表接口");
    var resContent = {code:200};

    try{
        var arg = req.query;
        logger.info("get product list args:" + JSON.stringify(arg));

        var percount = arg.percount || 20;
        var curpage = arg.curpage || 1;

        //增加两个查询条件
        var subjectId = arg.subjectId;
        var sellerId = arg.sellerId;

        Product.queryProductList({percount:percount, curpage:curpage, subjectId:subjectId, sellerId:sellerId}, function(data){
            var dataArr = [];

            var code = data[0].result.code;
            if(code == 1){
                resContent.code = 500;
                resContent.desc = "失败";
                res.json(resContent);
            } else {
                var productSurveyList = data[0].productSurveyList;
                productSurveyList.forEach(function(a){
                    var imgUri = a.imgUrl.split(",")[0];
                    dataArr.push({productId: a.productId, productName: a.productName, curPrice: a.curPrice / 100, imgUrl: imgUri});
                });

                var pagination = data[0].pagination;
                resContent.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};
                resContent.productList = dataArr;
                res.json(resContent);
                logger.info("get product list response:" + JSON.stringify(resContent));
            }
        });
    } catch (ex) {
        logger.error("获取商品列表失败:" + ex);
        resContent.code = 500;
        resContent.desc = "获取商品列表失败";
        res.json(resContent);
    }
});

router.get('/productinfo', function(req, res, next) {

    logger.info("进入获取商品详情接口");
    var result = {code: 200};

    try{
        var productInfo = {};

        var arg = req.query;
        logger.info("get product list args:" + JSON.stringify(arg));
        var productId = arg.productId;

        Product.queryProduct(productId, 1, 1, 0, 0, function (err, data) {
            if (err) {
                res.json(err);
            } else {
                var product = data[0].product;
                productInfo.productId = product.productId;
                productInfo.productName = product.productName;
                productInfo.imgUrl = product.imgKey;
                productInfo.productDesc = product.detailContent;
                productInfo.productAttribute = product.attribute;
                productInfo.skuTemplate = JSON.parse(product.skuTemplate);
                productInfo.sellerId = product.sellerId;
                ////添加卖家名称
                productInfo.sellerName = product.sellerName;
                result.productInfo = productInfo;
                res.json(result);
                logger.info("get product info response:" + JSON.stringify(result));
            }
        });
    }catch(ex) {
        logger.error("get product info error:" + ex);
        result.code = 500;
        result.desc = "获取商品详情失败";
        res.json(result);
    }
});

//查询商品详情queryProductDetail
router.get('/productDetail', function(req, res, next) {

    logger.info("进入查询商品详情接口");
    var result = {code: 200};

    try{

        var arg = req.query;
        arg.detailKey = "56a1915a0cf2bb85eb5701a7";
        arg.productId = "ze160122101802000570";
        logger.info("查询商品详情的条件:" + JSON.stringify(arg));

        Product.queryProductDetail(arg, function (err, data) {

            if (err) {
                res.json(err);
            } else {

                result.value = data.value;
                res.json(result);

                logger.info("查询到的商品详情为:" + JSON.stringify(result));
            }
        });
    }catch(ex) {
        logger.error("查询失败，原因是:" + ex);
        result.code = 500;
        result.desc = "查询商品详情失败";
        res.json(result);
    }
});

router.get('/skuitem', function(req, res, next) {
    logger.info("进入获取商品SKU接口");
    var result = {code:200};

    try{
        var arg = req.query;
        logger.info("get product list args:" + JSON.stringify(arg));
        var productId = arg.productId;

        var detailStockIns = new detailStock();

        async.waterfall([
                function(callback){
                    Product.queryProductSku(productId, function (err, data) {
                        if (err) {
                            callback('error', err);
                        } else {
                            var productSku = data[0].productSku;

                            detailStockIns.parseProductSku(data[0].productSku);
                            callback(null, detailStockIns);
                        }
                    });
                },
                function(productSkuMap, callback){
                    logger.info("skumap:" + productSkuMap);
                    Product.getStock(productId, function(err, data) {
                        if(err){
                            callback('error', err);
                        } else {
                            var stockInfo = data[0].stockInfo;
                            logger.info("stock info:" + stockInfo);
                            detailStockIns.fillStockSku(data[0].stockInfo);
                            detailStockIns.initSKU();
                            result.dimstocks = detailStockIns.dimstocks;
                            callback(null, result);
                        }
                    });
                }
            ],
            function(err, data){
                if (err) {
                    logger.error("get product info fail err:" + err);
                } else {
                    res.json(data);
                    logger.info("get skuitem response:" + JSON.stringify(result));
                }
            });
    } catch(ex) {
        logger.error("get skuitem error:" + ex);
        result.code = 500;
        result.desc = "获取商品ＳＫＵ失败";
        res.json(result);
    }
});


router.get('/child', function(req, res, next) {

    logger.info("进入获取子分类接口");
    var result = {code: 200};

    try {
        var arg = req.query;
        logger.info("get child class arg:" + arg);

        var subjectId =  arg.parentid || 0;

        Product.getSubTree(subjectId, function (err, data) {
            if(err) {
                res.json(err);
            } else {
                var subjectNodes = data[0].subjectNodes;
                var classList = [];
                if(subjectNodes !== null && subjectNodes.length >0 ){
                    subjectNodes.forEach(function(node) {
                        classList.push({
                            classId:node.id,
                            className:node.name,
                            pid:node.pid,
                            isLeaf:node.isLeaf
                        });
                    });
                }
                result.classList = classList;
                res.json(result);
                logger.info("get child class response:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("get subject child error:" + ex);
        result.code = 500;
        result.desc = "获取子类目失败";
        res.json(result);
    }
});

//获取商品列表中已经添加了条件，包含分类，这个按理说可以去掉了
router.get('/productlist', function(req, res, next) {
    logger.info("进入获取分类商品列表接口");
    var result = {code:200};

    try{
        var arg = req.query;
        logger.info("get product list args:" + JSON.stringify(arg));

        var percount = arg.percount || 20;
        var curpage = arg.curpage || 1;
        var classId = arg.classid;

        Product.queryProductList({percount:percount, curpage:curpage, classId:classId}, function(data){
            var resContent = {code:200};
            var dataArr = [];

            var code = data[0].result.code;
            if(code == 1){
                resContent.code = 500;
                resContent.desc = "失败";
                res.json(resContent);
            } else {
                var productSurveyList = data[0].productSurveyList;
                productSurveyList.forEach(function(a){
                    var imgUri = a.imgUrl.split(",")[0];
                    dataArr.push({productId: a.productId, productName: a.productName, curPrice: a.curPrice/100, imgUrl: imgUri});
                });
                resContent.productList = dataArr;
                res.json(resContent);
                logger.info("get class product list response:" + JSON.stringify(result));
            }
        });
    } catch(ex) {
        logger.error("get product list is subject error:" + ex);
        result.code = 500;
        result.desc = "获取商品列表失败";
        res.json(result);
    }
});


module.exports = router;