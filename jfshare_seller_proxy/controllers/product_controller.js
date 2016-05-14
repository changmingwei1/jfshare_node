/**
 * Created by zhaoshenghai on 16/3/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var detailStock = require('../lib/models/detail_stock');
var pagination_types = require('../lib/thrift/gen_code/pagination_types');

var product_types = require("../lib/thrift/gen_code/product_types");
var Stock = require('../lib/models/stock');
//商品列表
router.post('/list', function (request, response, next) {
    logger.info("进入获取商品列表接口");
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("get product list args:" + JSON.stringify(params));

        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        //参数验证
        if (params.percount == null || params.percount == "" || params.percount <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        //参数验证
        if (params.curpage == null || params.curpage == "" || params.curpage <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        Product.queryProductList(params, function (data) {
            var dataArr = [];

            var code = data[0].result.code;
            if (code == 1) {
                result.code = 500;
                result.desc = "失败";
                response.json(result);
            } else {
                var productSurveyList = data[0].productSurveyList;
                productSurveyList.forEach(function (a) {
                    var imgUri = a.imgUrl.split(",")[0];
                    dataArr.push({productId: a.productId, sellerId: a.sellerId, productName: a.productName,orgPrice: (Number(a.orgPrice)/100).toFixed(2), curPrice: (Number(a.curPrice) /100).toFixed(2),totalSales: a.totalSales, imgUrl: imgUri,activeState: a.activeState,crateTime: a.createTime});

                });

                var pagination = data[0].pagination;
                result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
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
router.post('/creat', function (request, response, next) {
    logger.info("进入获取商品详情接口");
    var result = {code: 200};
    try{
        var productInfo = {};
        var params = request.body;
        logger.info("creat product list args:" + JSON.stringify(params));

        //参数验证
        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        //参数验证
        if(params.brandId == null || params.brandId == "" ||params.brandId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        //参数验证
        if(params.subjectId == null || params.subjectId == "" ||params.subjectId <= 0){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        //参数验证
        if(params.productName == null || params.productName == "" ){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        //参数验证
        if(params.viceName == null || params.viceName == "" ){

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        async.series([
                function (callback) {
                    try {

                        Product.create(params,function(err,data){
                            if(err){
                                callback(1,err);
                            }else{
                                params.productId = data[0].value;
                                callback(null,params.productId);
                            }
                        });
                    } catch (ex) {
                        logger.info("创建商品服务异常:" + ex);
                        return callback(1, ex);
                    }
                },
                function (callback) {
                    try {
                        Stock.createStock(params,function(err,data){
                            if(err){
                                callback(2,err);
                            }else{
                                callback(null,params.productId);
                            }
                        });
                    } catch (ex) {
                        logger.info("创建库存服务异常:" + ex);
                        return callback(2, null);
                    }
                }
            ],
            function (err, results) {
                if (err == 1) {
                    logger.error("创建商品失败---商品服务异常：" + results[0]);
                    result.code = 500;
                    result.desc = "创建商品失败";
                    response.json(result);
                    return;
                }
                if (err == 2) {
                    logger.error("创建商品库存失败--商品库存服务异常：" + err);
                    response.json(results[1]);
                    return;
                }
                result.productId = results[0];
                response.json(result);

            });
    }catch(ex) {
        logger.error("create product  error:" + ex);
        result.code = 500;
        result.desc = "创建商品失败";
        response.json(result);
    }
});

//获取商品信息，进行编辑
router.post('/get', function (request, response, next) {

    logger.info("进入获取商品接口");
    var result = {code: 200};
    var params = request.body;
    logger.info("编辑获取商品--编辑--接口参数:" + JSON.stringify(params));
    //参数验证
    if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

        result.code = 500;
        result.desc = "请求参数错误";
        response.json(result);
        return;
    }

    if (params.productId == null || params.productId == "" || params.productId <= 0) {

        result.code = 500;
        result.desc = "请求参数错误";
        response.json(result);
        return;
    }
    try {
        Product.queryProduct(params, function (err,data) {
            if(err){
                response.json(err);
                return;
            }
            result.product = data[0].product;
            response.json(result);
            return;
        });

    } catch (ex) {
        logger.error("查询失败，原因是:" + ex);
        result.code = 500;
        result.desc = "查询商品详情失败";
        response.json(result);
    }
});

router.post('/update', function (request, response, next) {

    logger.info("进入更新商品接口");
    var result = {code: 200};

    try {
        var params = request.body;

        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        //参数验证
        if (params.productId == null || params.productId == "" || params.productId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        //参数验证
        if (params.brandId == null || params.brandId == "" || params.brandId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        //参数验证
        if (params.subjectId == null || params.subjectId == "" || params.subjectId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        //参数验证
        if (params.productName == null || params.productName == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        //参数验证
        if (params.viceName == null || params.viceName == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        async.series([
                function (callback) {
                    try {
                        Product.update(params, function (err,data) {
                            if(err){
                                callback(1,err);
                            }else{
                                callback(null,data);
                            }

                        });
                    } catch (ex) {
                        logger.info("创建商品服务异常:" + ex);
                        return callback(1, ex);
                    }
                },
                function (callback) {
                    try {
                        Stock.updateStock(params,function(err,data){
                            if(err){
                                callback(2,err);
                            }else{
                                callback(null,data);
                            }
                        });
                    } catch (ex) {
                        logger.info("更新库存服务异常:" + ex);
                        return callback(2, null);
                    }

                }
            ],
            function (err, results) {
                if (err == 1) {
                    logger.error("更新商品失败---商品服务异常：" + results[0]);
                    result.code = 500;
                    result.desc = "更新商品失败";
                    response.json(result);
                    return;
                }
                if (err == 2) {
                    logger.error("更新商品库存失败--商品库存服务异常：" + err);
                    response.json(result);
                    return;
                }
                response.json(result);

            });
    } catch (ex) {
        logger.error("update product error:" + ex);
        result.code = 500;
        result.desc = "更新商品失败";
        response.json(result);
    }
});


router.post('/virtualList', function (request, response, next) {

    logger.info("进入虚拟商品列表接口");
    var result = {code: 200};

    try {
        //var params = request.query;
        var params = request.body;
        logger.info("虚拟商品列表:" + params);

        //参数校验
        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        //静态数据，设置分页
        result.page = {total: 100, pageCount: 5};

        //商品列表

        var productList = [];

        var product = {};

        product.productId = "1";

        product.productname = "电影票",//商品名称
            product.skuid = "12-11-2"// sku id
        product.count = 1000; //总数量
        product.alreadysend = 100//已经发送数量
        product.restcount = 900//未发放的数量
        product.importtime = "2016-07-08 18:06:12"   //导入时间

        productList.push(product);
        var product1 = {};
        product1.productId = "2";

        product1.productname = "点卡",//商品名称
            product1.skuid = "10-11-2"// sku id
        product1.count = 1000; //总数量
        product1.alreadysend = 300//已经发送数量
        product1.restcount = 700//未发放的数量
        product1.importtime = "2016-06-12 12:02:11";  //导入时间

        productList.push(product1);
        productList.push(product);
        productList.push(product1);
        result.productList = productList;
        response.json(result);

    } catch (ex) {
        logger.error("get  virtual product List error:" + ex);
        result.code = 500;
        result.desc = "获取虚拟商品列表";
        res.json(result);
    }
});

router.post('/ticketList', function (request, response, next) {

    logger.info("进入虚拟券码列表列表接口");
    var result = {code: 200};

    try {
        // var params = request.query;
        var params = request.body;
        //var params = request.body;
        logger.info("虚拟券码列表:" + params);

        //参数校验
        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.productId == null || params.productId == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.skuid == null || params.skuid == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        //静态数据，设置分页
        result.page = {total: 100, pageCount: 5};

        //商品列表

        var productList = [];

        var product = {};

        product.id = 1;

        product.password = "123***12";

        product.state = 1;

        var product1 = {};

        product1.id = 2;

        product1.password = "234***12";

        product1.state = 2;

        var product2 = {};

        product2.id = 2;

        product2.password = "234***17";

        product2.state = 3;

        productList.push(product);
        productList.push(product1);
        productList.push(product2);

        result.productList = productList;
        response.json(result);

    } catch (ex) {
        logger.error("get  ticketList error:" + ex);
        result.code = 500;
        result.desc = "获取券码列表";
        res.json(result);
    }
});

router.post('/apply', function (request, response, next) {

    logger.info("进入商品上架下架列表接口");
    var result = {code: 200};

    try {
        // var params = request.query;
        var params = request.body;
        //var params = request.body;
        logger.info("商品上架下架:" + params);

        //参数校验
        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.productId == null || params.productId == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.state == null || params.state == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        response.json(result);

    } catch (ex) {
        logger.error("apply state error:" + ex);
        result.code = 500;
        result.desc = "上架下架失败";
        res.json(result);
    }
});
router.post('/improtTicket', function (request, response, next) {

    logger.info("进入导入券码接口");
    var result = {code: 200};

    try {
        // var params = request.query;
        var params = request.body;
        //var params = request.body;
        logger.info("商品上架下架:" + params);

        //参数校验
        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.bytes == null || params.bytes == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        response.json(result);

    } catch (ex) {
        logger.error("import  ticketList error:" + ex);
        result.code = 500;
        result.desc = "导入券码列表失败";
        res.json(result);
    }
});


//获取物流信息
router.get('/query', function (req, res, next) {
    var result = {code: 200};
    try {
        var arg = req.query;
        logger.info("物流参数:" + JSON.stringify(arg));

        if (arg == null || arg.orderId == null) {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        Product.expressQuery(arg.orderId, function (err, expressData) {

            var traceItem = [];
            if (err) {
                res.json(err);
                return;
            }
            if (expressData !== null) {
                var expressInfo = expressData[0].expressInfo;
                var expressTrace = expressData[0].expressTrace;


                result.expressInfo = {
                    id: expressInfo.id,
                    name: expressInfo.name,
                    queryUrl: expressInfo.queryUrl,
                    status: expressInfo.status,
                    comment: expressInfo.comment,
                    createTime: expressInfo.createTime,
                    createUserId: expressInfo.createUserId,
                    lastUpdateTime: expressInfo.lastUpdateTime,
                    lastUpdateUserId: expressInfo.lastUpdateUserId,
                    kuaidiKey: expressInfo.kuaidiKey,
                    nameRule: expressInfo.nameRule,
                    grabState: expressInfo.grabState
                };

                var traceItemsList = expressTrace.traceItems;
                traceItemsList.forEach(function (a) {
                    traceItem.push({time: a.time, context: a.context, ftime: a.ftime});
                });
                result.expressTrace = {
                    state: expressTrace.state,
                    nu: expressTrace.nu,
                    status: expressTrace.status,
                    orderId: expressTrace.orderId,
                    traceItems: traceItem
                };

            } else {
                result.code = 500;
                result.desc = "获取物流失败";
            }
            res.json(result);
            logger.info("获取物流结果" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("获取物流:" + ex);
        result.code = 500;
        result.desc = "获取物流失败";
        res.json(result);
    }
});
module.exports = router;