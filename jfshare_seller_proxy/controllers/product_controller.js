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
var CommonUtil = require('../lib/util/CommonUtil');
var Util = require('../lib/models/util');
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

        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

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

        var isExist = true;
        async.series([
                function (callback) {
                    try {
                        Product.queryProductList(params, function (err, data) {

                            if (err) {
                                callback(1, null);
                            } else {
                                var productSurveyList = data[0].productSurveyList;
                                if(productSurveyList.length == 0){
                                    isExist = false;
                                    return callback(null, dataArr);
                                }
                                var pagination = data[0].pagination;
                                result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
                                // logger.info("get product list response:" + JSON.stringify(result));
                                productSurveyList.forEach(function (a) {
                                    var imgUri = "";
                                    if(a.imgUrl != null){
                                        imgUri = a.imgUrl.split(",")[0];
                                    }

                                    var product = {
                                        productId: a.productId,
                                        sellerId: a.sellerId,
                                        productName: a.productName,
                                        subjectName: a.subjectPath,
                                        totalSales: a.totalSales,
                                        imgUrl: imgUri,
                                        activeState: a.activeState,
                                        crateTime: a.createTime
                                    };
                                    if(a.minOrgPrice ==null){
                                        product.orgPrice =0;
                                    }else{
                                        product.orgPrice =(Number(a.minOrgPrice) / 100).toFixed(2);
                                    }
                                    if(a.minCurPrice ==null){
                                        product.curPrice =0;
                                    }else{
                                        product.curPrice =(Number(a.minCurPrice) / 100).toFixed(2);
                                    }
                                    dataArr.push(product);
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
                        if(!isExist){
                            return callback(null,dataArr);
                        }
                        Stock.queryProductTotal(productIdList, function (error, data) {
                            logger.info("get product list response:" + JSON.stringify(data));
                            if (error) {
                                return callback(3, null);
                            } else {
                                var stockList = data;
                                for (var i = 0; i < dataArr.length; i++) {
                                    for(var j=0;j<stockList.length;j++){
                                        if (dataArr[i].productId == stockList[j].productId) {
                                            dataArr[i].totalSales = stockList[j].total;
                                            break;
                                        }

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
                if (err == 3) {
                    logger.error("批量获取库存异常--库存服务异常：" + err);
                    response.json(results[0]);
                    return;
                }
                if (err == null) {
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
    logger.info("进入创建商品接口");
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
        if (params.type !=2 && params.type !=3) {
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.postageId == null || params.postageId == "" ||params.postageId==0) {
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
                                logger.error("创建商品服务异常:" + JSON.stringify(err));
                                callback(1,err);
                            } else {
                                params.productId = data[0].value;
                                callback(null, params.productId);
                            }
                        });
                    } catch (ex) {
                        logger.error("创建商品服务异常:" + ex);
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
                        logger.error("创建库存服务异常:" + ex);
                        return callback(2, null);
                    }
                }
            ],
            function (err, results) {
                if (err == 1) {
                    logger.error("创建商品失败---商品服务异常：" + JSON.stringify(results));
                    response.json(results[0]);
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
                            callback(3, null);
                        }
                        var params = {};
                        var productList = [];
                        productList.push(product.productId);
                        Stock.queryProductTotal(productList, function (err, data) {
                            //data[0].result.code=="1"
                            if (err || data ==null) {
                                callback(3, err);
                            } else {
                               // product.stockInfo = data;

                                if(data!=null && data[0]!=null && data[0].stockItems!=null){
                                    product.stockItems =  data[0].stockItems;
                                }else{
                                    product.stockItems = null;
                                }

                                callback(null, data);
                            }

                        });
                    } catch (ex) {
                        logger.info("获取商品仓库异常:" + ex);
                        return callback(2, null);
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
        if (params.type !=2 && params.type !=3) {
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.postageId == null || params.postageId == "" ||params.postageId==0) {
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
                   // logger.error("更新商品失败---商品服务异常：" + results[0]);
                   // result.code = 500;
                    //result.desc = "更新商品失败";
                    response.json(results[0]);
                    return;
                }
                if (err == 2) {
                    result.code = 500;
                    result.desc = "更新商品失败";
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

router.post('/virtualSkuList', function (request, response, next) {

    logger.info("进入虚拟商品sku统计列表接口");
    var result = {code: 200};
    result.cardtatisticsList = [];
    try {
        //var params = request.query;
        var params = request.body;
        logger.info("进入虚拟商品sku统计列表接口:" + JSON.stringify(params));

        //参数校验
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
        params.perCount = 1000;
        params.curpage = 1;
        Product.statisticsSkuProductCard(params, function (err, data) {
            if (err) {
                result.code = 500;
                result.desc = "查看虚拟商品失败";
                response.json(result);
                return
            }
            if(data == null){
                return response.json(result);
            }else{
                if(data[0].cardtatisticsList!=null){
                    result.cardtatisticsList = data[0].cardtatisticsList;
                }
            }

            return response.json(result);
        });

    } catch (ex) {
        logger.error("get  virtual product List error:" + ex);
        result.code = 500;
        result.desc = "获取虚拟商品列表失败";
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

            if(data==null){
               return response.json(result);

            }

            if (data[0].cardtatisticsList != null) {
                result.cardtatisticsList = data[0].cardtatisticsList;
                var pagination = data[0].pagination;
                result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
            }
            return response.json(result);
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
                var pagination = data[0].pagination;
                result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
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
        logger.info("商品上架下架:" + JSON.stringify(params));

        //参数校验
        //参数验证
        if (params.sellerId == null ||  params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.productId == null ) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.state == null) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        //ENUM商品状态:100 - 199 不可出售的状态，200 - 299 审核中的状态，
        //300 - 399 销售中的状态，100 初始化，101 商家下架，102 审核未通过，103 管理员下架，200 审核中，300 销售中
        if (params.state == 1) {// 0：表示申请上架，1：表示下架 2 撤销审核

            params.activeState = 101;
        }
        if (params.state == 0) {// 0：表示申请上架，1：表示下架 2 撤销审核
            params.activeState = 200;
        }

        if (params.state == 2) {// 0：表示申请上架，1：表示下架 2 撤销审核

            params.activeState = 100;
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
        if (params.productId == null || params.productId == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        Product.improtVirtual(params, function (err, expressData) {
            if (err) {
                response.json(err);
                return;
            }else{
                response.json(result);
                return;
            }

        });

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


//查询订单中的kami信息
router.post('/queryOrderCardMsg', function (request, response, next) {
    var result = {code: 200};
    try {
        var params = request.body;
        logger.info("查询订单中的卡密信息:" + JSON.stringify(params));

        if (params == null || params.orderId == null || params.productId==null) {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Product.queryProductOrderCard(params, function (err, data) {
            if(err){
                return response.json(err);
            }
            result.cardList= data;
            logger.info("查询订单中的卡密信息result" + JSON.stringify(result));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("查询订单中的卡密信息失败:" + ex);
        result.code = 500;
        result.desc = "查询订单中的卡密信息失败";
        response.json(result);
    }
});

//验证虚拟商品兑换码
router.post('/reCaptcha', function(request, response, next) {

    logger.info("进入验证虚拟商品兑换码接口");
    var result = {code: 200};
    try{
        var params = request.body;
        logger.info("验证虚拟商品兑换码请求入参，params:" + JSON.stringify(params));

        if (params == null || params.sellerId == null||params.sellerId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.captchaNum== null || params.captchaNum == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        //-------------------前台测试数据--------------------------------------------
        //response.json(result);
        //return;
        //--------------------------------------------------------------

        //--------------------

        var captchaTemp={};
        var buyerTemp={};
        var productInfo={};

        async.series([
                function (callback) {
                    try {
                        Product.reCaptcha(params, function (err, data) {
                            if(err){
                                callback(1, err);
                            }else{
                                var cards=data.cardList;
                                if(cards!=null){
                                    var buyerId=cards[0].buyerId;
                                    var productId=cards[0].productId;
                                    var cardNumber=cards[0].cardNumber;
                                    params.userId=buyerId;
                                    params.productId=productId;
                                    captchaTemp.cardNumber=cardNumber;
                                }

                                logger.info("验证虚拟商品兑换码 result" + JSON.stringify(data));
                                callback(null, result);
                            }
                        });

                    } catch (ex) {
                        logger.info("获取订单列表异常:" + ex);
                        result.code = 500;
                        result.desc = "验码失败";
                        response.json(result);
                        return;
                    }
                },
                function (callback) {
                    try {
                        logger.info("查询buyer params" + JSON.stringify(params));
                        Product.getBuyer(params, function (error, data) {
                            if (error) {
                                callback(2, null);
                            } else {
                                var buyer = data[0].buyer;
                                if (buyer != null) {
                                    //resContent.buyer = {
                                    //    userId: buyer.userId,
                                    //    userName: buyer.userName,
                                    //    favImg: buyer.favImg,
                                    //    birthday: buyer.birthday,
                                    //    sex: buyer.sex,
                                    //    mobile: buyer.mobile
                                    //};

                                    buyerTemp.userName=buyer.userName;
                                    buyerTemp.mobile=buyer.mobile;

                                    logger.info("个人用户信息响应:" + JSON.stringify(buyerTemp));
                                    callback(null, buyerTemp);

                                } else {
                                    result.code = 500;
                                    result.desc = "获取用户信息失败";
                                    response.json(result);
                                    logger.info("个人用户信息响应:" + JSON.stringify(result));
                                    return;
                                }
                            }
                        });

                    } catch (ex) {
                        logger.info("获取用户信息异常:" + ex);
                        result.code = 500;
                        result.desc = "验码失败";
                        response.json(result);
                        return;
                    }
                },
                function (callback) {
                    try {
                        logger.info("查询product params" + JSON.stringify(params));
                        Product.queryProductForSeller(params.productId, 1, 1, 0, 0, function (err, data) {
                            if (err) {
                                callback(3, null);
                            } else {
                                var product = data[0].product;
                                //productInfo.productId = product.productId;
                                //productInfo.productName = product.productName;
                                //productInfo.imgUrl = product.imgKey;
                                //productInfo.productDesc = product.detailContent;
                                //productInfo.productAttribute = product.attribute;
                                //productInfo.skuTemplate = JSON.parse(product.skuTemplate);
                                //productInfo.sellerId = product.sellerId;
                                //////添加卖家名称
                                //productInfo.sellerName = product.sellerName;
                                //result.productInfo = productInfo;
                                productInfo.productName = product.productName;

                                logger.info("get product info response:" + JSON.stringify(productInfo));
                                callback(null, productInfo);
                            }
                        });

                    } catch (ex) {
                        logger.info("查询product异常:" + ex);
                        result.code = 500;
                        result.desc = "验码失败";
                        response.json(result);
                        return;
                    }
                }
            ],
            function (err, results) {

                logger.info("result[0]:" + JSON.stringify(results[0]));
                logger.info("result[1]:" + JSON.stringify(results[1]));
                logger.info("result[2]:" + JSON.stringify(results[2]));

                if (err == 1) {
                    logger.error("验码失败---product服务异常：" + err);
                    //result.code = 500;
                    //result.desc = err.desc;
                    response.json(results[0]);
                    return;
                }
                if (err == 2) {
                    logger.error("获取用户信息异常--product服务异常：" + err);
                    //result.code = 500;
                    //result.desc = "验码失败";
                    //response.json(result);
                    //return;
                }
                if (err == 3) {
                    logger.error("获取产品信息异常--product服务异常：" + err);
                    //result.code = 500;
                    //result.desc = "验码失败";
                    //response.json(result);
                    //return;
                }

                if (err!=1) {
                    logger.info("shuju------------->" + JSON.stringify(results));

                    result.productName=productInfo.productName;
                    result.cardNumber=captchaTemp.cardNumber;
                    result.userName=buyerTemp.userName;
                    result.mobile=buyerTemp.mobile;

                    response.json(result);
                    return;
                }
            });
        //--------------------
    } catch (ex) {
        logger.error("验证虚拟商品兑换码失败:" + ex);
        result.code = 500;
        result.desc = "验证虚拟商品兑换码失败";
        response.json(result);
    }
});

//查询卖家虚拟商品验证列表
router.post('/queryCaptchaList', function(request, response, next) {

    logger.info("进入查询卖家虚拟商品验证记录接口");
    var result = {code: 200};
    try{
        var params = request.body;
        logger.info("查询卖家虚拟商品验证记录请求入参，params:" + JSON.stringify(params));

        if (params == null || params.sellerId == null||params.sellerId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.perCount== null || params.perCount == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.curPage== null || params.curPage == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        //--------------------前台测试数据--------------
        //result.yedNum=1;
        //result.thmonNum=48;
        //
        //result.page = {
        //    total:60,
        //    pageCount:3
        //};
        //
        //var productList=[];
        //
        //for(var i=1;i<=20;i++){
        //    productList.push({
        //        productId:i,
        //        productName:"测试数据：测试的商品名",
        //        aldsold:5,
        //        aldCaptcha:22
        //    });
        //}
        //
        //result.productList=productList;
        //response.json(result);
        //return;
        //--------------------------------------

        Product.queryCaptchaList(params, function (err, data) {
            if(err){
                return response.json(err);
            }else{
                //if(data.pagination.totalCount==0||data.pagination.itemList==null){
                //    return response.json(result);
                //}
                var pagination = data.pagination;
                result.page = {
                    total: pagination.totalCount,
                    pageCount: pagination.pageNumCount
                };
                var itemList=data.itemList;

                var products=[];
                itemList.forEach(function(item){
                    products.push({
                        productId:item.productId,
                        productName:item.productName,
                        aldsold:item.aldSold,
                        aldCaptcha:item.aldCaptcha
                    });
                });
                result.yesToday=Util.getYestoday();
                result.yedNum=data.yedNum;
                result.thmonNum=data.monNum;
                result.productList=products;

                logger.info("查询卖家虚拟商品验证记录 result" + JSON.stringify(data));
                response.json(result);
                return;
            }

        });
    } catch (ex) {
        logger.error("查询卖家虚拟商品验证记录失败:" + ex);
        result.code = 500;
        result.desc = "查询卖家虚拟商品验证记录失败";
        response.json(result);
    }
});

//查询卖家虚拟商品每月及每天统计
router.post('/queryCaptchaTotalList', function(request, response, next) {

    logger.info("进入卖家虚拟商品验证统计接口");
    var result = {code: 200};
    try{
        var params = request.body;
        logger.warn("卖家虚拟商品验证统计请求入参，params:" + JSON.stringify(params));

        if (params == null || params.sellerId == null||params.sellerId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.date== null || params.date == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.perCount== null || params.perCount == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.curPage== null || params.curPage == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Product.queryCaptchaTotalList(params, function (err, data) {

            if(err){
                return response.json(err);
            }else{

                var dayCaptchaList=data.dayAldCaptchaCountList;
                var tempObj=[];
                if(dayCaptchaList!=null) {
                    result.page = {
                        total: data.pagination.totalCount,
                        pageCount: data.pagination.pageNumCount
                    };
                    dayCaptchaList.forEach(function(item){
                        tempObj.push({
                            thDayNum:item.checkedTotalNum,
                            date:item.date
                        });
                    });

                    result.thmonNum = data.checkedNum;
                    result.thsoldNum = data.soldNum;
                    result.productTotalList = tempObj;

                }

                /**
                 if(data.itemList!=null){
                    var monAca=[];
                    var monAst=[];
                    var tempObj=[];
                    for(var i=1;i<=dayNum;i++){
                        var theday;
                        if(i<10){
                            theday="0"+i;
                        }else{
                            theday=i;
                        }
                        var theDate=params.date+"-"+theday;
                        var itemListObj=data.itemList;
                        var temp=[];
                        var aldsoldTotal=[];
                        var aldCaptchaTotal=[];
                        for(var j=0;j<itemListObj.length;j++){
                            if(itemListObj[j].date==theDate){
                                temp.push(itemListObj[j]);
                                aldsoldTotal.push(itemListObj[j].aldsold);
                                aldCaptchaTotal.push(itemListObj[j].aldCaptcha);
                            }
                        }


                        if(temp!=null&&temp!=""&&aldCaptchaTotal!=null&&aldCaptchaTotal!=""){
                            var aca=Util.sum(aldCaptchaTotal);
                            var ast=Util.sum(aldsoldTotal);

                            monAca.push(aca);
                            monAst.push(ast);

                            tempObj.push({
                                data:theDate,
                                aldCaptcha:aca,
                                productDayList:temp
                            });
                        }


                    }

                    //var acaMon=Util.sum(monAca);
                    //var astMon=Util.sum(monAst);

                    result.page = {
                        total: data.pagination.totalCount,
                        pageCount: data.pagination.pageNumCount
                    };

                    result.thmonNum=data.thmonNum;
                    result.thsoldNum=data.thsoldNum;
                    result.productTotalList=tempObj;


                }
                 **/
                logger.warn("卖家虚拟商品验证统计 result" + JSON.stringify(data));
                response.json(result);
                return;
            }

        });
    } catch (ex) {
        logger.error("卖家虚拟商品验证统计失败:" + ex);
        result.code = 500;
        result.desc = "卖家虚拟商品验证统计失败";
        response.json(result);
    }
});

//根据日期查询商品每天验证码数据
router.post('/queryCaptchaDayTotalList', function(request, response, next) {

    logger.info("进入查询商品每天验证码数据接口");
    var result = {code: 200};
    try{
        var params = request.body;
        logger.info("查询商品每天验证码数据请求入参，params:" + JSON.stringify(params));

        if (params == null || params.sellerId == null||params.sellerId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.date== null || params.date == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.perCount== null || params.perCount == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.curPage== null || params.curPage == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Product.queryCaptchaDayTotalList(params, function (err, data) {
            if(err){
                return response.json(err);
            }else{
                if(data!=null&&data!=""){
                    //result.productName=data.productName;
                    var captchaDetals=data.itemList;
                    var captObj=[];
                    if(captchaDetals==null||captchaDetals==""){
                        //result.code = 500;
                        //result.desc = "查询虚拟商品验证明细失败";

                        result.itemList=null;
                        response.json(result);
                        return;
                    }
                    result.page = {
                        total: data.pagination.totalCount,
                        pageCount: data.pagination.pageNumCount
                    };
                    captchaDetals.forEach(function(item){
                        captObj.push({
                            productId:item.productId,
                            productName:item.productName,
                            aldSold:item.aldSold,
                            aldCaptcha:item.aldCaptcha,
                            date:item.date
                        });
                    });
                    result.itemList=captObj;
                }

                logger.info("查询商品每天验证码数据 result" + JSON.stringify(result));
                response.json(result);
                return;
            }

        });
    } catch (ex) {
        logger.error("查询商品每天验证码数据失败:" + ex);
        result.code = 500;
        result.desc = "查询商品每天验证码数据失败";
        response.json(result);
    }
});


//卖家虚拟商品验证列表明细
router.post('/queryCaptchaDetails', function(request, response, next) {

    logger.info("进入虚拟商品验证明细接口");
    var result = {code: 200};
    try{
        var params = request.body;
        logger.info("虚拟商品验证明细请求入参，params:" + JSON.stringify(params));

        if (params == null || params.productId == null||params.productId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        //if (params.queryDate== null || params.queryDate == "") {
        //    result.code = 400;
        //    result.desc = "参数错误";
        //    response.json(result);
        //    return;
        //}
        if (params.perCount== null || params.perCount == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.curPage== null || params.curPage == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        var captObj=[];
        var bIds=new Array();
        var buyerTemp=[];
        async.series([
                function (callback) {
                    try {
                        Product.queryCaptchaDetails(params, function (err, data) {
                            if(err){
                                return response.json(err);
                            }else{
                                if(data!=null&&data!=""){
                                    //result.productName=data.productName;
                                    var captchaDetals=data.productCards;

                                    if(captchaDetals==null||captchaDetals==""){
                                        //result.code = 500;
                                        //result.desc = "查询虚拟商品验证明细失败";

                                        result.productDetailList=null;
                                        response.json(result);
                                        return;
                                    }

                                    result.page = {
                                        total: data.pagination.totalCount,
                                        pageCount: data.pagination.pageNumCount
                                    };

                                    captchaDetals.forEach(function(item){
                                        bIds.push(item.buyerId);
                                        captObj.push({
                                            productName:data.productName,
                                            date:item.checkTime,
                                            consumeNum:item.cardNumber,
                                            //mobile:item.mobile,
                                            //nickName:item.nikeName,
                                            buyerId:item.buyerId
                                        });
                                    });
                                    result.productDetailList=captObj;
                                }

                                logger.info("虚拟商品验证明细 result" + JSON.stringify(captObj));
                                //response.json(result);
                                //return;
                            }
                            callback(null, result);
                        });

                    } catch (ex) {
                        logger.info("获取订单列表异常:" + ex);
                        result.code = 500;
                        result.desc = "验码失败";
                        response.json(result);
                        return;
                    }
                },
                function (callback) {
                    try {
                        logger.info("查询buyer params" + JSON.stringify(bIds));
                        Product.getBuyerList(bIds, function (error, data) {
                            if (error) {
                                callback(2, null);
                            } else {
                                var buyerLists = data[0].buyerList;
                                if (buyerLists != null) {
                                    //resContent.buyer = {
                                    //    userId: buyer.userId,
                                    //    userName: buyer.userName,
                                    //    favImg: buyer.favImg,
                                    //    birthday: buyer.birthday,
                                    //    sex: buyer.sex,
                                    //    mobile: buyer.mobile
                                    //};
                                    buyerLists.forEach(function(item){
                                        buyerTemp.push({
                                            buyerId:item.userId,
                                            userName:item.userName,
                                            mobile:item.mobile,

                                        });
                                    });

                                    logger.info("个人用户信息响应:" + JSON.stringify(buyerTemp));
                                    callback(null, buyerTemp);

                                } else {
                                    result.code = 500;
                                    result.desc = "获取用户信息失败";
                                    response.json(result);
                                    logger.info("个人用户信息响应:" + JSON.stringify(result));
                                    return;
                                }
                            }
                        });

                    } catch (ex) {
                        logger.info("获取批量类目异常:" + ex);
                        result.code = 500;
                        result.desc = "验码失败";
                        response.json(result);
                        return;
                    }
                }
            ],
            function (err, results) {

                logger.info("result[0]:" + JSON.stringify(results[0]));
                logger.info("result[1]:" + JSON.stringify(results[1]));

                if (err == 1) {
                    logger.error("获取详情失败---product服务异常：" + err);
                    result.code = 500;
                    result.desc = "获取详情失败";
                    response.json(result);
                    return;
                }
                if (err == 2) {
                    logger.error("获取用户信息异常--product服务异常：" + err);
                    result.code = 500;
                    result.desc = "获取详情失败";
                    response.json(result);
                    return;
                }


                if (err == null) {
                    logger.info("shuju------------->" + JSON.stringify(results));

                    //result.productName=productInfo.productName;
                    //result.cardNumber=captchaTemp.cardNumber;
                    //result.userName=buyerTemp.userName;
                    //result.mobile=buyerTemp.mobile;

                    var proList=result.productDetailList;
                    //var proList=captObj;
                    if(proList==null){
                        result.code = 500;
                        result.desc = "获取详情失败";
                        response.json(result);
                        return;
                    }
                    if(buyerTemp==null){
                        response.json(result);
                        return;
                    }
                    var newProList=[];
                    for(var i=0;i<proList.length;i++){
                        var proUserId=proList[i].buyerId;
                        for(var j=0;j<buyerTemp.length;j++){
                           if(proUserId==buyerTemp[j].buyerId){
                               newProList.push({
                                   productName:proList[i].productName,
                                   date:proList[i].date,
                                   consumeNum:proList[i].consumeNum,
                                   //mobile:item.mobile,
                                   //nickName:item.nikeName,
                                   nickName:buyerTemp[j].userName,
                                   mobile:buyerTemp[j].mobile
                               })
                           }
                        }
                    }

                    result.productDetailList=newProList;
                    response.json(result);
                    return;
                }
            });




        //---------------------------------------------------------------------------------------------------------
    } catch (ex) {
        logger.error("虚拟商品验证明细失败:" + ex);
        result.code = 500;
        result.desc = "虚拟商品验证明细失败";
        response.json(result);
    }
});



// 导出统计sku产品卡片信息
router.post('/exportStatisticsSkuProductCard', function(request, response, next) {

    logger.info("导出统计sku产品卡片信息接口");
    var result = {code: 200};
    try{
        var params = request.body;
        logger.info("入参，params:" + JSON.stringify(params));

        if (params == null || params.sellerId == null||params.sellerId == "") {
            result.code = 400;
            result.desc = "sellerId参数错误";
            response.json(result);
            return;
        }
        if (params == null || params.productId == null||params.productId == "") {
            result.code = 400;
            result.desc = "productId参数错误";
            response.json(result);
            return;
        }
        if (params == null || params.exportPassword == null||params.exportPassword == "") {
            result.code = 400;
            result.desc = "productId参数错误";
            response.json(result);
            return;
        }


        Product.exportStatisticsSkuProductCard(params, function (err, data) {
            if(err){
                return response.json(err);
            }else{

                logger.info("导出统计sku产品卡片信息 result" + JSON.stringify(result));
                result.path = data.value;
                response.json(result);
                return;
            }

        });
    } catch (ex) {
        logger.error("导出统计sku产品卡片信息:" + ex);
        result.code = 500;
        result.desc = "导出统计sku产品卡片信息";
        response.json(result);
    }
});





module.exports = router;