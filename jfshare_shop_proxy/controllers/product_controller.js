/**
 * Created by YinBo on 16/4/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');
var Lich = require('../lib/thrift/Lich.js');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Seller = require('../lib/models/seller');
var detailStock = require('../lib/models/detail_stock');

//查询商品列表
router.post('/list', function (req, res, next) {
    logger.info("进入获取商品列表接口");
    var resContent = {code: 200};

    try {
        var arg = req.body;
        //var arg = req.query;
        if(arg.perCount == null || arg.perCount == "" || arg.perCount <= 0){
            resContent.code = 400;
            resContent.desc = "请输入每页显示条数";
            res.json(resContent);
            return;
        }
        logger.info("get product list args:" + JSON.stringify(arg));
        Product.queryProductList(arg, function (err, data) {
            var dataArr = [];

            var code = data[0].result.code;
            if (err || code == 1) {
                res.json(err);
            } else {
                logger.info("调用productServ-queryProductList result:" + JSON.stringify(data[0]));
                var productSurveyList = data[0].productSurveyList;
                productSurveyList.forEach(function (a) {
                    var imgUri = a.imgUrl.split(",")[0];
                    dataArr.push({
                        productId: a.productId,
                        productName: a.productName,
                        viceName: a.viceName,
                        curPrice: a.curPrice / 100,
                        orgPrice: a.orgPrice / 100,
                        //sellerId: a.sellerId,   //测试用,没意义
                        imgKey: imgUri,
                        type: a.type || 2
                    });
                });
                var productList = {
                    productId:"ze160205135801000704",
                    productName: "测试商品01",
                    viceName: "优惠大促",
                    curPrice: "0.01",
                    orgPrice: "140",
                    //sellerId: a.sellerId,   //测试用,没意义
                    imgKey: "9258E4A9FC083140D36383B2A5426A5C.jpg",
                    type: 3
                };
                dataArr.push(productList);
                var pagination = data[0].pagination;
                resContent.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
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

//查询商品属性信息
router.get('/productAttribute', function (req, res, next) {

    logger.info("进入获取商品详情接口");
    var result = {code: 200};

    try {
        var productInfo = {};

        var arg = req.query;
        logger.info("get product list args:" + JSON.stringify(arg));
        var productId = arg.productId;

        Product.queryProduct(productId, 1, 1, 0, 0, function (err, data) {
            if (err) {
                res.json(err);
            } else {
                var product = data[0].product;

                productInfo.productAttribute = product.attribute;   //属性单独一个接口
                result.productInfo = productInfo;
                res.json(result);
                logger.info("get product info response:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("get product info error:" + ex);
        result.code = 500;
        result.desc = "获取商品属性失败";
        res.json(result);
    }
});

//查询商品
router.get('/productInfo', function (req, res, next) {

    logger.info("进入获取商品详情接口");
    var result = {code: 200};

    var arg = req.query;
    var productId = arg.productId;
    if (productId == null || productId == "") {
        result.code = 400;
        result.desc = "请求参数错误";
        res.json(result);
        return;
    }

    var productInfo = {};
    async.waterfall([
            function (callback) {
                Product.queryProduct(productId, 1, 1, 0, 0, function (err, data) {

                    var product = data[0].product;

                    productInfo.productId = product.productId;
                    productInfo.productName = product.productName;
                    productInfo.viceName = product.viceName;
                    productInfo.imgKey = product.imgKey;
                    productInfo.productDesc = product.detailContent;
                    productInfo.skuTemplate = JSON.parse(product.skuTemplate);
                    productInfo.sellerId = product.sellerId;
                    productInfo.type = product.type;

                    //添加最高价和最低价    ====   现在的productSku是null
                    //var productSku = product.productSku;
                    //var minCurPrice = productSku.minCurPrice;
                    //var maxCurPrice = productSku.maxCurPrice;
                    //var minOrgPrice = productSku.minOrgPrice;
                    //var maxOrgPrice = productSku.maxOrgPrice;

                     //logger.info(productSku);
                    var minCurPrice = 0.01;
                    var maxCurPrice = 1000;
                    var minOrgPrice = 0.02;
                    var maxOrgPrice = 2000;
                    result.minCurPrice = minCurPrice;
                    result.maxCurPrice = maxCurPrice;
                    result.minOrgPrice = minOrgPrice;
                    result.maxOrgPrice = maxOrgPrice;
                    callback(null, result);
                });
            },
            function (result, callback) {
                Seller.querySeller(productInfo.sellerId, 0, function (err, data) {
                    if (err) {
                        callback('error', err);
                    } else {
                        productInfo.sellerName = data[0].seller.sellerName;
                        result.productInfo = productInfo;
                        callback(null, result);
                    }
                });
            }],
        function (err, data) {
            if (err) {
                logger.error("get product info fail err:" + err);
                result.code = 500;
                result.desc = "获取商品详情失败";
                res.json(result);
            } else {
                res.json(result);
                logger.info("get skuitem response:" + JSON.stringify(result));
            }
        });
});

//查询商品详情queryProductDetail
router.get('/productDetail', function (req, res, next) {

    logger.info("进入查询商品详情接口");
    var result = {code: 200};

    try {
        var arg = req.query;
        //arg.detailKey = "56a1915a0cf2bb85eb5701a7";
        //arg.productId = "ze160122101802000570";
        if (arg.detailKey == null && arg.productId == null) {

            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if (arg.detailKey == "" && arg.productId == "") {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
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
    } catch (ex) {
        logger.error("查询失败，原因是:" + ex);
        result.code = 500;
        result.desc = "查询商品详情失败";
        res.json(result);
    }
});

//查询商品库存和sku
router.post('/querystoreTest', function (req, res, next) {
    logger.info("进入获取商品SKU接口");
    var result = {code: 200};

    try {
        var arg = req.body;

        var productId = arg.productId;
        var provinceId = arg.provinceId;
        var skuNum = arg.skuNum;
        var baseTag = 1;
        var skuTemplateTag = 0;
        var skuTag = 1;
        var attributeTag = 0;

        var params = {};
        params.productId = productId;
        params.provinceId = provinceId;
        params.skuNum = skuNum;
        params.baseTag = baseTag;
        params.skuTemplateTag = skuTemplateTag;
        params.skuTag = skuTag;
        params.attributeTag = attributeTag;

        //Product.queryHotSKU(params, function (err, data) {
        //    if(err){
        //        res.json(err);
        //    }else{
        //        var product = data[0].product;
        //        /********************测试数据*******************/
        //        //仓库id
        //        var storehouseId = 1;
        //        //库存量
        //        var value = 100;
        //        //销售价和原价
        //        var curPrice = 100;
        //        var orgPrice= 150;
        //        result.storehouseId = storehouseId;
        //        result.value = value;
        //        result.curPrice = curPrice;
        //        result.orgPrice = orgPrice;
        //        res.json(result);
        //        logger.info("查询到的详情为:" + JSON.stringify(result));
        //    }
        //});
        var detailStockIns = new detailStock();

        async.waterfall([
                function (callback) {
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
                function (productSkuMap, callback) {
                    logger.info("skumap:" + productSkuMap);
                    Product.getStock(productId, function (err, data) {
                        if (err) {
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
            function (err, data) {
                if (err) {
                    logger.error("get product info fail err:" + err);
                } else {
                    res.json(data);
                    logger.info("get skuitem response:" + JSON.stringify(result));
                }
            });
    } catch (ex) {
        logger.error("get skuitem error:" + ex);
        result.code = 500;
        result.desc = "获取商品ＳＫＵ失败";
        res.json(result);
    }
});
//查询商品库存和sku
router.post('/querystore', function (req, res, next) {
    logger.info("进入获取商品SKU接口");
    var result = {code: 200};

    try {
        var arg = req.body;

        var productId = arg.productId;
        var provinceId = arg.provinceId;
        var skuNum = arg.skuNum;
        var baseTag = 1;
        var skuTemplateTag = 0;
        var skuTag = 1;
        var attributeTag = 0;

        var params = {};
        params.productId = productId;
        params.provinceId = provinceId;
        params.skuNum = skuNum;
        params.baseTag = baseTag;
        params.skuTemplateTag = skuTemplateTag;
        params.skuTag = skuTag;
        params.attributeTag = attributeTag;

        /********************测试数据*******************/
        //仓库id
        var storehouseId = 1;
        //库存量
        var value = 100;
        //销售价和原价
        var curPrice = 100;
        var orgPrice = 150;
        result.storehouseId = storehouseId;
        result.value = value;
        result.curPrice = curPrice;
        result.orgPrice = orgPrice;
        res.json(result);
        logger.info("查询到的详情为:" + JSON.stringify(result));

        //Product.queryHotSKU(params, function (err, data) {
        //    if(err){
        //        res.json(err);
        //    }else{
        //        var product = data[0].product;
        //        /********************测试数据*******************/
        //        //仓库id
        //        var storehouseId = 1;
        //        //库存量
        //        var value = 100;
        //        //销售价和原价
        //        var curPrice = 100;
        //        var orgPrice= 150;
        //        result.storehouseId = storehouseId;
        //        result.value = value;
        //        result.curPrice = curPrice;
        //        result.orgPrice = orgPrice;
        //        res.json(result);
        //        logger.info("查询到的详情为:" + JSON.stringify(result));
        //    }
        //});
        /*
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
         */
    } catch (ex) {
        logger.error("get skuitem error:" + ex);
        result.code = 500;
        result.desc = "获取商品ＳＫＵ失败";
        res.json(result);
    }
});

//获取类目列表
router.post('/subjectList', function (req, res, next) {

    logger.info("进入获取子分类接口");
    var result = {code: 200};

    try {
        var arg = req.body;

        if (arg.subjectId == null || arg.subjectId == "" || arg.subjectId < 0) {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        Product.getSubTree(arg, function (err, data) {
            if (err) {
                res.json(err);
            } else {
                var subjectNodes = data[0].subjectNodes;
                var classList = [];
                if (subjectNodes !== null && subjectNodes.length > 0) {
                    subjectNodes.forEach(function (node) {
                        classList.push({
                            subjectId: node.id,
                            subjectName: node.name,
                            pid: node.pid,
                            isLeaf: node.isLeaf,
                            img_key: node.img_key
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


module.exports = router;