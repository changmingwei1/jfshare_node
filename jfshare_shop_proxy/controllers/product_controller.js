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
var BaseTemplate = require('../lib/models/baseTemplate');
var Stock = require('../lib/models/stock');

/*查询商品列表*/
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
                return;
            } else {
                logger.info("调用productServ-queryProductList result:" + JSON.stringify(data));
                var productSurveyList = data[0].productSurveyList;
                productSurveyList.forEach(function (a) {
                    var imgUri = a.imgUrl.split(",")[0];
                    dataArr.push({
                        productId: a.productId,
                        productName: a.productName,
                        viceName: a.viceName,
                        curPrice: (Number(a.curPrice) / 100).toFixed(2),
                        orgPrice: (Number(a.orgPrice) / 100).toFixed(2),
                        //sellerId: a.sellerId,   //测试用,没意义
                        imgKey: imgUri,
                        type: a.type || 2
                    });
                });
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


/*搜索商品*/
router.post('/search', function (req, res, next) {
    logger.info("进入search商品接口");
    var resContent = {code: 200};
    resContent.productSearchList = [];
    try {
        var arg = req.body;
        //var arg = req.query;
        if (arg.perCount == null || arg.perCount == "" || arg.perCount <= 0) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }

        if (arg.curPage == null || arg.curPage == "" || arg.curPage <= 0) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }

        if (arg.type == null || arg.type == "" || arg.type <= 0 || arg.type >4) {
            resContent.code = 400;
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }

        if (arg.keyword == null || arg.keyword == "") {
            resContent.code = 400;
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }

        logger.info("get product list args:" + JSON.stringify(arg));
        Product.search(arg, function (err, data) {
                if(err){
                    return res.json(err);
                }
            resContent.productSearchList = data;
            res.json(resContent);
            return;
        });
    } catch (ex) {

        logger.error("搜索商品失败:" + ex);
        resContent.code = 500;
        resContent.desc = "搜索商品失败";
        res.json(resContent);
    }
});

/*查询商品列表*/
router.post('/listBySeller', function (req, res, next) {
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
        Product.productSurveyBackendQuery(arg, function (err, data) {
            var dataArr = [];
            if (err) {
                res.json(err);
                return;
            } else {
                logger.info("调用productServ-queryProductList result:" + JSON.stringify(data));
                var productSurveyList = data[0].productSurveyList;
                productSurveyList.forEach(function (a) {
                    var imgUri = a.imgUrl.split(",")[0];
                    dataArr.push({
                        productId: a.productId,
                        productName: a.productName,
                        viceName: a.viceName,
                        curPrice: (Number(a.curPrice) / 100).toFixed(2),
                        orgPrice: (Number(a.orgPrice) / 100).toFixed(2),
                        //sellerId: a.sellerId,   //测试用,没意义
                        imgKey: imgUri,
                        type: a.type || 2
                    });
                });
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

/*查询商品属性信息*/
router.get('/productAttribute', function (req, res, next) {

    logger.info("进入获取商品详情接口");
    var result = {code: 200};

    try {
        var productInfo = {};

        var arg = req.query;
        if (arg != null) {
            logger.info("get product list args:" + JSON.stringify(arg));
        }
        var productId = arg.productId;

        Product.queryProduct(productId, 1, 1, 0, 0, function (err, data) {
            if (err) {
                res.json(err);
                return;
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

/*查询商品*/
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
        async.series([
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
                        productInfo.detailKey = product.detailKey;
                        productInfo.productDesc = product.detailContent;
                        productInfo.skuTemplate = JSON.parse(product.skuTemplate);
                        productInfo.sellerId = product.sellerId;
                        productInfo.subjectId = product.subjectId;
                        productInfo.activeState = product.activeState;
                        /*添加subjectId*/
                        arg.sellerId = product.sellerId;
                        productInfo.type = product.type;
                        productInfo.storehouseIds = product.storehouseIds;
                        productInfo.postageId = product.postageId;
                        productInfo.thirdExchangeRate = product.thirdExchangeRate;
                        var productSku = product.productSku;

                        logger.info("获取到的商品信息是：" + JSON.stringify(productInfo));
                        if (product.productSku != null) {
                            result.minCurPrice = productSku.minCurPrice;
                            result.maxCurPrice = productSku.maxCurPrice;
                            result.minOrgPrice = productSku.minOrgPrice;
                            result.maxOrgPrice = productSku.maxOrgPrice;
                        }
                        callback(null, result);
                        logger.info("获取到的商品最大值/最小值信息：" + JSON.stringify(result));
                    });
                },
                function (callback) {
                    Seller.querySeller(arg.sellerId, 0, function (err, data) {
                        if (err) {
                            callback('error', err);
                        } else {
                            productInfo.sellerName = data[0].seller.sellerName;
                            result.productInfo = productInfo;
                            callback(null, result);
                            logger.info("获取到的商品信息：" + JSON.stringify(result));
                        }
                    });
                },
                function (callback) {
                    BaseTemplate.queryPostageTemplate(arg.sellerId, 2, function (err, data) {
                        var remark;
                        if (err) {
                            res.json(err);
                        } else {
                            if (data[0].postageTemplateList != null && data[0].postageTemplateList.length > 0) {
                                remark = data[0].postageTemplateList[0].templateDesc;
                                /*商家优惠模板id，提交订单计算的邮费是与商品挂钩，所以暂时先注掉*/
                                //productInfo.postageId = data[0].postageTemplateList[0].id;
                                productInfo.remark = remark;
                                logger.info("商家店铺邮费模板信息1:" + JSON.stringify(remark));
                                callback(null, result);
                                return;
                            } else {
                                productInfo.remark = "";
                                logger.info("商家店铺邮费模板信息3:" + JSON.stringify(productInfo.remark));
                                callback(null, result);
                            }
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

/*查询商品详情queryProductDetail*/
router.get('/productDetail', function (req, res, next) {

    logger.info("进入查询商品详情接口");
    var result = {code: 200};
    try {
        var arg = req.query;
        //arg.detailKey = "56a1915a0cf2bb85eb5701a7";
        //arg.productId = "ze160122101802000570";
        if (arg.detailKey == null || arg.detailKey == "") {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if (arg.productId == null || arg.productId == "") {
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
    result.storehouseId = 0;
    var params = req.body;
    params.storehouseId = 0;
    result.productId = params.productId;
    result.sellerId = params.sellerId;
    result.skuNum = params.skuNum;
    var storehouseId = 0;

    logger.info("查询库存和sku的请求，arg：" + JSON.stringify(params));
    async.series([
            function (callback) {
                try {
                    Product.queryProduct(params.productId, 1, 1, 1, 1, function (err, data) {
                        if(err){
                            callback('error', err);
                            return;
                        }else{
                            storehouseId = data[0].product.storehouseIds;
                            return callback(null,storehouseId);
                        }
                    });
                } catch (ex) {
                    logger.info("仓库服务异常:" + ex);
                    return callback(1, null);
                }
            },
            function (callback) {
                try {
                    if(storehouseId == "1"){
                        result.storehouseId =1;
                        params.storehouseId = 1;
                        callback(null, result);
                        return;
                    }else{
                        BaseTemplate.queryStorehouse(params, function (err, data) {
                            if (err) {
                                callback('error', err);
                                return;
                            } else {
                                var storehouseList = data[0].storehouseList;
                                if (storehouseList != null && storehouseList.length > 0) {

                                    for (var i = 0; i < storehouseList.length; i++) {

                                        if(storehouseList[i].id ==1){
                                            continue;
                                        }
                                        var supportProvince = storehouseList[i].supportProvince;
                                        if (supportProvince != null) {
                                            var list = supportProvince.split(",");
                                            if (list != null && list.length > 0) {
                                                for (var j = 0; j < list.length; j++) {
                                                    if (list[j] == params.provinceId) {
                                                        result.storehouseId = storehouseList[i].id;
                                                        params.storehouseId = storehouseList[i].id;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (params.storehouseId != 0) {
                                                break;
                                            }
                                        }
                                    }
                                    // arg.storehouseId = storehouseId;
                                    logger.info("看看仓库信息：" + result.storehouseId);
                                    callback(null, result);
                                    return;
                                } else {
                                    callback(null, result);
                                    return;
                                }
                            }
                        });
                    }
                } catch (ex) {
                    logger.info("仓库服务异常:" + ex);
                    return callback(1, null);
                }
            },
            function (callback) {
                try {
                    logger.info("请求参数，arg:" + JSON.stringify(params));
                    if (result.storehouseId != 0) {
                        Product.queryHotSKUV1(params, function (err, data) {
                            if (err) {
                                result.storehouseId = 0;
                                callback(err, null);
                                return;
                            } else {
                                var skuItems = data.product.productSku.skuItems;
                                result.curPrice = skuItems[0].curPrice;
                                result.orgPrice = skuItems[0].orgPrice;
                                result.weight = skuItems[0].weight;
                                return callback(null, result);
                            }
                        });

                    } else {
                        return callback(null, result);
                    }
                } catch (ex) {
                    logger.error("product服务异常:" + ex);
                    return callback(2, null);
                }
            },
            function (callback) {
                try {
                    logger.info("请求参数，arg:" + JSON.stringify(params));
                    if (result.storehouseId != 0) {
                        Stock.queryStock(params, function (err, data) {
                            if (err) {
                                callback(3, err);
                                return;
                            } else {
                                var stockInfo = data[0].stockInfo;
                                if (stockInfo != null && stockInfo.total != null) {
                                    result.count = stockInfo.total;
                                }
                                return callback(null, result);
                            }
                        });
                    } else {
                        callback(null, result);
                        return;
                    }
                } catch (ex) {
                    logger.error("库存服务异常:" + ex);
                    return callback(3, null);
                }
            }
        ],
        function (err, results) {
            if (err == 3) {
                result.code = 200;
                res.json(result);
                return;
            } else if(err) {
                result.code = 500;
                result.desc = "获取库存价格失败";
                res.json(result);
                return;
            } else {
                if (results != null && results.length > 0) {
                    res.json(results[results.length - 1]);
                } else {
                    result.code = 500;
                    result.desc = "获取库存价格失败";
                    res.json(result);
                    return;
                }
            }
        }
    );
});

/*批量获取虚拟：sku、价格和库存*/
router.post('/queryVirtualstore', function (request, response, next) {
    var result = {code: 200};
    try {
        var productStockSkuList = [];
        var productStockAndPriceList = [];
        var params = request.body;
        var sellerList = params.sellerList;
        if (sellerList == null || sellerList.length == 0) {
            result.code = 500;
            result.desc = "购买商品信息为空，不能获取商品库存";
            response.json(result);
            return;
        }

        var productList = [];
        productList.push(params.sellerList[0]);
        params.productList = productList;
        async.series([

                function (callback) {
                    try {
                        logger.info("queryProductTotal--params：" + JSON.stringify(params));

                        Stock.batchQueryStock(params, function (err, data) {
                            if (err) {
                                return callback(2, null);
                            }
                            logger.info("queryProductTotal list response:" + JSON.stringify(data));
                            productStockSkuList = data;
                           return callback(null, data);
                        });
                    } catch (ex) {
                        logger.error("queryProductTotal--异常:" + ex);
                        return callback(2, null);
                    }
                },
                function (callback) {
                    try {
                        for (var i = 0; i < params.sellerList.length; i++) {
                            var sku = {};
                            sku.productId = sellerList[i].productId;
                            sku.sellerId = sellerList[i].sellerId;
                            sku.skuNum = params.sellerList[i].skuNum;
                            sku.storehouseId = 1;//虚拟商品仓库id为1
                            var itemList = productStockSkuList[i].stockItems;
                            for (var j = 0; j < itemList.length; j++) {
                                if (params.sellerList[i].skuNum == itemList[j].skuNum) {
                                    sku.count = itemList[j].count;
                                    break;
                                }
                            }
                            productStockAndPriceList.push(sku);
                        }
                        params.productStockAndPriceList = productStockAndPriceList;
                        logger.info("queryHotSKUBatch--params：" + JSON.stringify(params));
                        Product.queryHotSKUBatch(params, function (err, data) {
                            if (err) {
                                return callback(3, null);
                            }
                            logger.info("queryHotSKUBatch list response:" + JSON.stringify(data));

                            if (data[0].productList != null) {
                                var productSkuPriceList = data[0].productList;
                                for (var i = 0; i < productStockAndPriceList.length; i++) {
                                    if (productStockAndPriceList[i].productId == productSkuPriceList[i].productId) {
                                        var skuPriceList = productSkuPriceList[i].productSku.skuItems;
                                        for (var h = 0; h < skuPriceList.length; h++) {
                                            if (productStockAndPriceList[i].skuNum == skuPriceList[h].skuNum) {
                                                productStockAndPriceList[i].curPrice = skuPriceList[h].curPrice;
                                                productStockAndPriceList[i].orgPrice = skuPriceList[h].orgPrice;
                                                break;
                                            }
                                        }
                                    }
                                }
                                callback(null, productStockAndPriceList);
                            }
                        });
                    } catch (ex) {
                        logger.error("queryProductSKU--异常:" + ex);
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
                    if (results != null && results[1] != null) {
                        result.skuPriceAndStockList = results[1];
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

/*批量获取实物：sku、价格和库存*/
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
                       // logger.info("getDeliverStorehousea--params：" + JSON.stringify(params));
                        //先获取仓库id
                        BaseTemplate.getDeliverStorehouse(params, function (err, data) {
                            if (err) {
                                return callback(1, null);
                            }
                            productStorehouseList = data[0].productStorehouseList;
                            params.productList = productStorehouseList;
                            for(var i=0;i<productStorehouseList.length;i++){
                                if(productStorehouseList[i].storehouseId ==0){
                                    for(var j=0;j<params.sellerList.length;j++){
                                        if(productStorehouseList[i].sellerId.toString() ==params.sellerList[j].sellerId){
                                            if(productStorehouseList[i].productId ==params.sellerList[j].productId){
                                                if(params.sellerList[j].storehouseIds == "1"){
                                                    productStorehouseList[i].storehouseId = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            logger.info("get order list response:" + JSON.stringify(params));
                            callback(null, data);
                        });
                    } catch (ex) {
                        logger.error("获取仓库id异常:" + ex);
                        return callback(1, null);
                    }
                },
                function (callback) {
                    try {
                       logger.info("batchQueryStock--params：" + JSON.stringify(params));
                        if (productStorehouseList != null && productStorehouseList.length > 0) {
                            params.productList = productStorehouseList;
                            Stock.batchQueryStock(params, function (err, data) {
                                if (err) {
                                    return callback(2, null);
                                }
                                //logger.info("queryProductTotal list response:" + JSON.stringify(data));
                                productStockSkuList = data;
                                callback(null, data);
                            });
                        }
                    } catch (ex) {
                        logger.error("queryProductTotal--异常:" + ex);
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
                            if (storehouseId == 0) {
                                productStockAndPriceList.push(sku);
                                continue;
                            }
                            for(var h=0;h<productStockSkuList.length;h++){
                                if( sku.productId == productStockSkuList[h].productId){
                                    var itemList = productStockSkuList[h].stockItems;
                                    for (var j = 0; j < itemList.length; j++) {
                                        if (params.sellerList[i].skuNum == itemList[j].skuNum && itemList[j].storehouseId == productStorehouseList[i].storehouseId) {
                                            sku.count = itemList[j].count;
                                            break;
                                        }
                                    }
                                }
                            }
                            productStockAndPriceList.push(sku);
                        }
                        params.productStockAndPriceList = productStockAndPriceList;
                      //  logger.info("queryHotSKUBatch--params：" + JSON.stringify(params));
                        Product.queryHotSKUBatch(params, function (err, data) {
                            if (err) {
                                return callback(3, null);
                            }
                          //  logger.info("queryHotSKUBatch list response:" + JSON.stringify(data));
                            if (data[0].productList != null) {
                                var productSkuPriceList = data[0].productList;
                                var isCheck = 0;
                                var j = 0;
                                for (var i = 0; i < productStockAndPriceList.length; i++) {
                                    if (productStockAndPriceList[i].storehouseId != 0) {
                                        if (productStockAndPriceList[i].productId == productSkuPriceList[j].productId) {
                                            var skuPriceList = productSkuPriceList[j].productSku.skuItems;
                                            for (var h = 0; h < skuPriceList.length; h++) {
                                                if (productStockAndPriceList[i].skuNum == skuPriceList[h].skuNum && productStockAndPriceList[i].storehouseId == skuPriceList[h].storehouseId) {
                                                    productStockAndPriceList[i].curPrice = skuPriceList[h].curPrice;
                                                    productStockAndPriceList[i].orgPrice = skuPriceList[h].orgPrice;
                                                    j++;
                                                    isCheck = 1;
                                                    break;
                                                }
                                            }
                                        }
                                        if (isCheck) {
                                            isCheck = 0;
                                            continue;
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
                        logger.error("queryProductSKU--异常:" + ex);
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

/*获取类目列表*/
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
        logger.info("请求的参数，arg：" + JSON.stringify(arg));
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
        logger.info("请求参数，arg：" + JSON.stringify(arg));
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