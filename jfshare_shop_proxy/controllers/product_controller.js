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
var BaseTemplate = require('../lib/models/baseTemplate');
var Stock = require('../lib/models/stock');

//查询商品列表
router.post('/list', function (req, res, next) {
    logger.info("进入获取商品列表接口");
    var resContent = {code: 200};

    try {
        var arg = req.body;
        //var arg = req.query;
        if (arg.perCount == null || arg.perCount == "" || arg.perCount <= 0) {
            resContent.code = 400;
            resContent.desc = "请输入每页显示条数";
            res.json(resContent);
            return;
        }
        logger.info("get product list args:" + JSON.stringify(arg));
        Product.queryProductList(arg, function (err, data) {
            var dataArr = [];
            if (err) {
                res.json(err);
            } else {
                logger.info("调用productServ-queryProductList result:" + JSON.stringify(data));
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
                    productId: "ze160205135801000704",
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
        if(arg != null){
            logger.info("get product list args:" + JSON.stringify(arg));
        }
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
    try {
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
                    Product.queryProduct(productId, 1, 1, 1, 1, function (err, data) {
                        if (err) {
                            res.json(err);
                            return;
                        }
                        var product = data[0].product;
                        productInfo.productId = product.productId;
                        productInfo.productName = product.productName;
                        productInfo.viceName = product.viceName;
                        productInfo.imgKey = product.imgKey;
                        productInfo.productDesc = product.detailContent;
                        productInfo.skuTemplate = JSON.parse(product.skuTemplate);
                        productInfo.sellerId = product.sellerId;
                        productInfo.type = product.type;
                        productInfo.storehouseIds = product.storehouseIds;
                        productInfo.postageId = product.postageId;
                        var productSku = product.productSku;
                        if( product.productSku !=null){
                            result.minCurPrice = productSku.minCurPrice;
                            result.maxCurPrice = productSku.maxCurPrice;
                            result.minOrgPrice = productSku.minOrgPrice;
                            result.maxOrgPrice = productSku.maxOrgPrice;
                        }
                        callback(null, result);
                        logger.info("获取到的商品最大值/最小值信息：" + JSON.stringify(result));
                    });
                },
                function (result, callback) {
                    Seller.querySeller(productInfo.sellerId, 0, function (err, data) {
                        if (err) {
                            callback('error', err);
                        } else {
                            productInfo.sellerName = data[0].seller.sellerName;
                            productInfo.remark = data[0].seller.remark;
                            result.productInfo = productInfo;
                            callback(null, result);
                            logger.info("获取到的商品信息：" + JSON.stringify(result));
                        }
                    });
                }
            ],
            function (err, data) {
                if (err) {
                    logger.error("get product info fail err:" + err);
                    result.code = 500;
                    result.desc = "获取商品信息失败";
                    res.json(result);
                } else {
                    res.json(result);
                    logger.info("get skuitem response:" + JSON.stringify(result));
                }
            });
    } catch (ex) {
        logger.error("get product info fail err:" + ex);
        result.code = 500;
        result.desc = "获取商品信息失败";
        res.json(result);
    }
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

/*查询商品指定sku和库存*/
router.post('/querystore', function (req, res, next) {
    logger.info("进入获取商品SKU接口");
    var result = {code: 200};
    result.count = 0;

    try {
        var arg = req.body;
        arg.storehouseId = 0;
        /*productId = ze160515153359000306*/
        async.waterfall([
                function (callback) {
                    BaseTemplate.queryStorehouse(arg, function (err, data) {
                        if (err) {
                            callback('error', err);
                        } else {
                            var storehouseList = data[0].storehouseList;
                            if (storehouseList != null && storehouseList.length > 0) {
                                for (var i = 0; i < storehouseList.length; i++) {
                                    var supportProvince = storehouseList[i].supportProvince;
                                    if (supportProvince.indexOf(arg.provinceId) != -1) {
                                        arg.storehouseId = storehouseList[i].id;
                                        break;
                                    }
                                }
                               // arg.storehouseId = storehouseId;
                                logger.info("看看仓库信息：" + arg.storehouseId);
                                callback(null, arg);
                            } else {
                                callback(null, arg);
                            }
                        }
                    });
                },
                function (arg, callback) {
                    logger.info("请求参数，arg:" + JSON.stringify(arg));
                    if(arg.storehouseId!=0){

                        Product.queryHotSKUV1(arg, function (err, data) {
                            if (err) {
                                callback('error', err);
                                return;
                            } else {
                                var skuItems = data.product.productSku.skuItems;
                                result.productId = data.product.productId;
                                result.curPrice = skuItems[0].curPrice;
                                result.orgPrice = skuItems[0].orgPrice;
                                result.storehouseId = skuItems[0].storehouseId;
                                result.skuNum = skuItems[0].skuNum;
                                result.weight = skuItems[0].weight;
                                callback(null, result);
                                return;
                            }
                        });

                    }
                    callback(null, result);
                    return;
                },
                function (result, callback) {
                    if(arg.storehouseId!=0) {
                        Stock.queryStock(result, function (err, data) {
                            if (err) {
                                callback('error', err);
                                return;
                            } else {
                                var stockInfo = data[0].stockInfo;
                                if (stockInfo != null && stockInfo.total != null) {
                                    result.count = stockInfo.total;
                                }
                                callback(null, result);
                                return;
                            }
                        });
                    }
                    callback(null, result);
                    return;
                }
            ],
            function (err, data) {
                if (err) {
                    res.json(data);
                    return;
                } else {
                    logger.info("get skuItem response:" + JSON.stringify(result));
                    res.json(data);

                }
            });
    } catch (ex) {
        logger.error("get skuitem error:" + ex);
        result.code = 500;
        result.desc = "查询商品库存失败";
        res.json(result);
    }
});

/*批量获取指定sku*/
router.post('/querystoreBatch', function (request, response, next) {
    var result = {code: 200};
    try {
        var productStorehouseList = [];
        var productStockSkuList = [];
        var productStockAndPriceList = [];
        var params = request.body;
        async.series([
                function (callback) {
                    try {
                        logger.info("getDeliverStorehousea--params：" + JSON.stringify(params));
                        //先获取仓库id
                        BaseTemplate.getDeliverStorehouse(params, function (err, data) {
                            if (err) {
                                return callback(1, null);
                            }
                            productStorehouseList = data[0].productStorehouseList;
                            params.productList = productStorehouseList;
                            logger.info("get order list response:" + JSON.stringify(result));
                            callback(null, data);
                        });
                    } catch (ex) {
                        logger.info("获取仓库id异常:" + ex);
                        return callback(1, null);
                    }
                },
                function (callback) {
                    try {
                        logger.info("queryProductTotal--params：" + JSON.stringify(params));
                        if (productStorehouseList != null && productStorehouseList.length > 0) {
                            params.productList = productStorehouseList;
                            Stock.batchQueryStock(params, function (err, data) {
                                if (err) {
                                    return callback(2, null);
                                }
                                logger.info("queryProductTotal list response:" + JSON.stringify(data));
                                productStockSkuList = data;
                                callback(null, data);
                            });
                        }
                    } catch (ex) {
                        logger.info("queryProductTotal--异常:" + ex);
                        return callback(2, null);
                    }
                },
                function (callback) {
                    try {
                        for (var i = 0; i < params.sellerList.length; i++) {
                            var storehouseId = productStorehouseList[i].storehouseId;
                            var sku = {};
                            sku.productId = productStorehouseList[i].productId;
                            sku.sellerId = productStorehouseList[i].sellerId;
                            sku.skuNum = params.sellerList[i].skuNum;
                            sku.storehouseId = productStorehouseList[i].storehouseId;
                            var itemList = productStockSkuList[i].stockItems;
                            if (storehouseId == 0) {
                                productStockAndPriceList.push(sku);
                                continue;
                            }
                            for (var j = 0; i < itemList.length; j++) {
                                if (params.sellerList[i].skuNum == itemList[j].skuNum && itemList[j].storehouseId == productStorehouseList[i].storehouseId) {
                                    sku.count = itemList[j].count;
                                    break;
                                }
                            }
                            productStockAndPriceList.push(sku);
                        }
                        params.productStockAndPriceList = productStockAndPriceList;
                        logger.info("queryProductTotal--params：" + JSON.stringify(params));
                        Product.queryHotSKUBatch(params, function (err, data) {
                            if (err) {
                                return callback(3, null);
                            }

                            logger.info("queryProductTotal list response:" + JSON.stringify(data));

                            if (data[0].productList != null) {
                                var productSkuPriceList = data[0].productList;
                                var j = 0;
                                for (var i = 0; i < productStockAndPriceList.length; i++) {
                                    if (productStockAndPriceList[i].storehouseId != 0) {
                                        if (productStockAndPriceList[i].productId == productSkuPriceList[j].productId) {
                                            var skuPriceList = productSkuPriceList[j].productSku.skuItems;
                                            for (var h = 0; h < skuPriceList.length; h++) {
                                                if (productStockAndPriceList[i].skuNum == skuPriceList[h].skuNum && productStockAndPriceList[i].storehouseId == skuPriceList[h].storehouseId) {
                                                    productStockAndPriceList[i].curPrice = skuPriceList[h].curPrice;
                                                    productStockAndPriceList[i].orgPrice = skuPriceList[h].orgPrice;
                                                    break;
                                                }
                                            }
                                        }
                                    } else {
                                        if (j != 0) {
                                            j = i - 1;
                                        }
                                    }
                                }
                                callback(null, productStockAndPriceList);
                            }
                        });
                    } catch (ex) {
                        logger.info("queryProductSKU--异常:" + ex);
                        return callback(3, null);
                    }
                }
            ],
            function (err, results) {
                if (err) {
                    result.code = 500;
                    result.desc = "获取商品库存价格信息失败失败";
                    logger.error("get product stock error:" + err);
                    response.json(result);
                    return;
                } else {
                    if (results != null && results[2] != null) {
                        result.skuPriceAndStockList = results[2];
                        response.json(result);
                        return;
                    }
                }
            });
    } catch (ex) {
        logger.error("get product stock error:" + ex);
        result.code = 500;
        result.desc = "获取商品库存失败";
        response.json(result);
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

/*计算邮费*/
router.post('/freight', function (req, res, next) {

    logger.info("进入获取邮费接口");
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("看看是啥："+JSON.stringify(arg));
        //if (arg.subjectId == null || arg.subjectId == "" || arg.subjectId < 0) {
        //    result.code = 400;
        //    result.desc = "参数错误";
        //    res.json(result);
        //    return;
        //}
        BaseTemplate.calculatePostage(arg, function (err, data) {
            if (err) {
                res.json(err);
            } else {
                result.sellerPostageReturnList = data[0].sellerPostageReturnList;
                result.totalPostage = data[0].totalPostage;
                res.json(result);
                logger.info("get postage response:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("get postage error:" + ex);
        result.code = 500;
        result.desc = "获取邮费失败";
        res.json(result);
    }
});


module.exports = router;