/**
 * Created by zhaoshenghai on 16/3/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Subject = require("../lib/models/subject");
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
                        if(!isExist){
                            return callback(null,dataArr);
                        }
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

//审核商品
router.post('/updateProductState', function (request, response, next) {

    logger.info("进入审核商品接口");
    var result = {code: 200};

    try {
        //var params = request.query;
        var params = request.body;
        logger.info("审核商品:" + params);

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
        if (params.state == null || params.state < 0 || params.state > 1) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        //表示拒绝
        if (params.state == 1) {
            params.activeState = 102;
        } else if (params.state == 0) {
            params.activeState = 300;
        } else {
            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        Product.setProductState(params, function (err, data) {
            if (err) {
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