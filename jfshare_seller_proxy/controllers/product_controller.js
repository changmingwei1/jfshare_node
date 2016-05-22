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
var Subject = require('../lib/models/subject');
var product_types = require("../lib/thrift/gen_code/product_types");
var Stock = require('../lib/models/stock');
//商品列表
router.post('/list', function (request, response, next) {

    logger.info("进入获取商品列表接口");
    var result = {code: 200};

    try {

        var params = request.body;
        logger.info("get product list args:" + JSON.stringify(params));

        if (params.percount == null || params.percount == "" || params.percount <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.curpage == null || params.curpage == "" || params.curpage <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        var dataArr = [];
        var subjectIdList = [];
        var productIdList = [];
        var subjectName = [];
        var newData;
        async.series([
                function (callback) {
                    try {
                        Product.queryProductList(params, function (err, data) {

                            if (err) {
                                callback(1, null);
                            } else {
                                var productSurveyList = data[0].productSurveyList;

                                var pagination = data[0].pagination;
                                result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
                                // logger.info("get product list response:" + JSON.stringify(result));
                                productSurveyList.forEach(function (a) {
                                    var imgUri = a.imgUrl.split(",")[0];
                                    dataArr.push({
                                        productId: a.productId,
                                        sellerId: a.sellerId,
                                        subjectName: "1",
                                        productName: a.productName,
                                        orgPrice: (Number(a.orgPrice) / 100).toFixed(2),
                                        curPrice: (Number(a.curPrice) / 100).toFixed(2),
                                        totalSales: a.totalSales,
                                        imgUrl: imgUri,
                                        activeState: a.activeState,
                                        crateTime: a.createTime
                                    });
                                    subjectIdList.push(
                                        a.subjectId
                                    );
                                    productIdList.push(
                                        a.productId
                                    );
                                });

                                callback(null, dataArr);
                            }
                        });

                    } catch (ex) {
                        logger.info("获取订单列表异常:" + ex);
                        return callback(1, null);
                    }
                },
                function (callback) {
                    try {
                        Subject.getBatchSuperTree(subjectIdList, function (error, data) {
                            //logger.info("get product list response:" + JSON.stringify(data));
                            if (error) {
                                callback(2, null);
                            } else {
                                //组装list
                                var partsNames = [];
                                var subjectNodeTrees = data[0].subjectNodeTrees;

                                subjectNodeTrees.forEach(function (subjectList) {
                                    //logger.info("get subjectList list response-----:" + JSON.stringify(subjectList));
                                    if (subjectList != null) {
                                        var subjectpath = "";
                                        for (var i = 0; i < subjectList.length; i++) {
                                            if (i == subjectList.length - 1) {
                                                subjectpath += subjectList[i].name;
                                            } else {
                                                subjectpath += subjectList[i].name + "-";

                                            }
                                        }
                                        subjectName.push(subjectpath);
                                    } else {
                                        subjectName.push("");
                                    }


                                });
                                callback(null, subjectName);
                            }
                        });

                    } catch (ex) {
                        logger.info("获取批量类目异常:" + ex);
                        return callback(2, null);
                    }
                },
                function (callback) {
                    try {
                        Stock.queryProductTotal(productIdList, function (error, data) {
                            logger.info("get product list response:" + JSON.stringify(data));
                            if (error) {
                                return callback(3, null);
                            } else {
                                var stockList = data;


                                for (var i = 0; i < dataArr.length; i++) {


                                    if (dataArr[i].productId == stockList[i].productId) {

                                        dataArr[i].totalSales = stockList[i].total;
                                    }

                                }
                                return callback(null, data);
                            }
                        });

                    } catch (ex) {
                        logger.info("获取库存异常:" + ex);
                        return callback(3, null);
                    }
                }
            ],
            function (err, results) {

                logger.info("result[0]:" + JSON.stringify(results[0]));
                logger.info("result[1]:" + JSON.stringify(results[1]));

                if (err == 1) {
                    logger.error("查询商品列表失败---商品服务异常：" + err);
                    result.code = 500;
                    result.desc = "查询商品列表失败";
                    response.json(result);
                    return;
                }
                if (err == 2) {
                    logger.error("获取批量类目异常--类目服务异常：" + err);
                    response.json(results[0]);
                    return;
                }

                if (err == null) {
                    logger.info("shuju------------->" + JSON.stringify(results));
                    for (var i = 0; i < results[0].length; i++) {
                        results[0][i].subjectName = results[1][i];
                        logger.info("get product list response:" + JSON.stringify(dataArr));
                        logger.info("get product list response:" + JSON.stringify(subjectName));
                    }
                    result.productList = results[0];
                    response.json(result);
                    return;
                } else {
                    logger.info("shuju------------->" + JSON.stringify(results));
                    result = results[0];
                    response.json(result);
                    return;
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
    try {
        var productInfo = {};
        var params = request.body;
        logger.info("creat product list args:" + JSON.stringify(params));

        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

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
        /***
         *
         *
         *         sellerId: params.sellerId,
         productName: params.productName,
         viceName: params.viceName,
         subjectId: params.subjectId,
         brandId: params.brandId,
         imgKey: params.imgKey,
         type: params.type,//商品类型 2表示普通商品 3表示虚拟商品
         createUserId: params.sellerId,
         skuTemplate: JSON.stringify(params.skuTemplate),
         attribute: JSON.stringify(params.attribute),
         productSku: productSku,
         postageId: params.postageId,
         detailContent: params.detailContent,
         storehouseIds: params.storehouseIds
         *
         *
         */
        if (params.type == null || params.type == "") {
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.postageId == null || params.postageId == "") {
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.storehouseIds == null || params.storehouseIds == "") {
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        async.series([
                function (callback) {
                    try {
                        Product.create(params, function (err, data) {
                            if (err) {
                                callback(1, err);
                            } else {
                                params.productId = data[0].value;
                                callback(null, params.productId);
                            }
                        });
                    } catch (ex) {
                        logger.info("创建商品服务异常:" + ex);
                        return callback(1, ex);
                    }
                },
                function (callback) {
                    try {
                        if (params.productId == null || params.productId == "") {
                            return callback(1, null);
                        } else {
                            Stock.createStock(params, function (err, data) {
                                if (err) {
                                    callback(2, err);
                                } else {
                                    callback(null, params.productId);
                                }
                            });
                        }

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
    } catch (ex) {
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

    if (params.productStatus == null || params.productStatus == "" || params.productStatus <= 0) {
        result.code = 500;
        result.desc = "请求参数错误";
        response.json(result);
        return;
    }
    if (params.productStatus == 200 || params.productStatus == 300) {
        result.code = 500;
        result.desc = "此状态下商品不可以编辑";
        response.json(result);
        return;
    }
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

        //--------------------------------------------------------
        //Product.queryProduct(params, function (err,data) {
        //    if(err){
        //        response.json(err);
        //        return;
        //    }
        //    result.product = data[0].product;
        //    response.json(result);
        //    return;
        //});
        //-----------------------------------------------------------------

        //--------------------------------------------------
        var product;
        var productDetail;
        async.series([
                function (callback) {
                    try {

                        Product.queryProduct(params, function (err, data) {
                            if (err) {
                                callback(1, null);
                            }
                            product = data[0].product;

                            if (product == null) {
                                callback(1, null);
                            } else {
                                result.product = product;

                                callback(null, result.product);
                            }
                        });
                    } catch (ex) {
                        logger.error("获取商品信息异常:" + ex);
                        return callback(1, ex);
                    }
                },
                function (callback) {
                    try {

                        if (product == null || product == "") {
                            callback(2, null);
                        }
                        var params = {};
                        params.detailKey = product.detailKey;
                        params.productId = product.productId;
                        logger.info("获取商品详情接口参数:" + JSON.stringify(params));

                        Product.queryProductDetail(params, function (err, data) {
                            //data[0].result.code=="1"
                            if (err || data.result.code == "1") {
                                callback(2, err);
                            } else {
                                product.detailContent = data.value;
                                callback(null, data);
                            }

                        });
                    } catch (ex) {
                        logger.info("获取商品信息异常:" + ex);
                        return callback(2, null);
                    }
                }
            ],
            function (err, results) {
                if (err == 1) {
                    logger.error("获取商品信息---商品服务异常：" + results[0]);
                    result.code = 500;
                    result.desc = "获取商品信息失败";
                    response.json(result);
                    return;
                }
                if (err == 2) {
                    logger.error("获取商品信息失败--商品服务异常：" + err);
                    response.json(results[1]);
                    return;
                }
                result.product = product;
                response.json(result);
                return;

            });


        //--------------------------------------------


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
        logger.info("更新商品--接口参数:" + JSON.stringify(params));
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
                        Product.update(params, function (err, data) {
                            if (err) {
                                callback(1, err);
                            } else {
                                callback(null, data);
                            }

                        });
                    } catch (ex) {
                        logger.info("创建商品服务异常:" + ex);
                        return callback(1, ex);
                    }
                },
                function (callback) {
                    try {
                        Stock.updateStock(params, function (err, data) {
                            if (err) {
                                callback(2, err);
                            } else {
                                callback(null, data);
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
    result.cardtatisticsList = [];
    try {
        //var params = request.query;
        var params = request.body;
        logger.info("虚拟商品列表:" + JSON.stringify(params));

        //参数校验
        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.perCount == null || params.perCount == "" || params.perCount <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.curpage == null || params.curpage == "" || params.curpage <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        Product.queryProductCard(params, function (err, data) {
            if (err) {
                result.code = 500;
                result.desc = "查看虚拟商品失败";
                response.json(result);
                return
            }
            if (data[0].cardtatisticsList != null) {
                result.cardtatisticsList = data[0].cardtatisticsList;
            }
            response.json(result);
        });

    } catch (ex) {
        logger.error("get  virtual product List error:" + ex);
        result.code = 500;
        result.desc = "获取虚拟商品列表";
        response.json(result);
    }
});

router.post('/ticketList', function (request, response, next) {

    logger.info("进入虚拟券码列表列表接口");
    var result = {code: 200};
    result.cardViewList = [];
    try {
        // var params = request.query;
        var params = request.body;
        //var params = request.body;
        logger.info("虚拟券码列表:" + JSON.stringify(params));

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

        if (params.skuNum == null || params.skuNum == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.perCount == null || params.perCount == "" || params.perCount <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.curpage == null || params.curpage == "" || params.curpage <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        Product.queryProductCardViewList(params, function (err, data) {
            if (err) {
                response.json(err);
                return
            }
            if (data[0].cardViewList != null) {
                result.cardViewList = data[0].cardViewList;
            }
            response.json(result);
            return;
        });


    } catch (ex) {
        logger.error("get  ticketList error:" + ex);
        result.code = 500;
        result.desc = "获取券码列表失败";
        response.json(result);
    }
});

router.post('/queryDetail', function (request, response, next) {

    logger.info("进入商品详情接口");
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("进入商品详情:" + params);

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

        if (params.detailKey == null || params.detailKey == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        Product.queryDetail(params, function (err, data) {
            if (err) {
                result.code = 500;
                result.desc = "查看详情失败";
                response.json(result);
                return
            }
            result.value = data.value;
            response.json(result);
        });

    } catch (ex) {
        logger.error("查看详情失败:" + ex);
        result.code = 500;
        result.desc = "查看详情失败";
        response.json(result);
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
        if (params.curState == null || params.curState == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
//ENUM商品状态:100 - 199 不可出售的状态，200 - 299 审核中的状态，
//300 - 399 销售中的状态，100 初始化，101 商家下架，102 审核未通过，103 管理员下架，200 审核中，300 销售中
        if (params.state == 1) {// 0：表示申请上架，1：表示下架
            if (params.curState != 300) {
                result.code = 500;
                result.desc = "商品未处于销售状态中,不用下架";
                response.json(result);
                return;
            }
            params.activeState = 101;
        }
        if (params.state == 0) {// 0：表示申请上架，1：表示下架
            if (params.curState == 300) {
                result.code = 500;
                result.desc = "商品处于销售状态中,不用申请上架";
                response.json(result);
                return;
            }
            params.activeState = 200;
        }


        Product.setProductState(params, function (err, expressData) {
            if (err) {
                result.code = 500;
                result.desc = "上架下架失败";
                response.json(result);
                return;
            }
            response.json(result);
            return;
        });

    } catch (ex) {
        logger.error("apply state error:" + ex);
        result.code = 500;
        result.desc = "上架下架失败";
        response.json(result);
    }
});
router.post('/improtTicket', function (request, response, next) {

    logger.info("进入导入券码接口");
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("进入导入券码接口--params:" + params);

        //参数校验
        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.path == null || params.path == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        Product.improtVirtual(params, function (err, expressData) {
            if (err) {
                response.json(result);
                return;
            }
            response.json(result);
            return;
        });

        response.json(result);

    } catch (ex) {
        logger.error("import  ticketList error:" + ex);
        result.code = 500;
        result.desc = "导入券码列表失败";
        response.json(result);
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