/**
 * Created by zhaoshenghai on 16/3/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Lich = require('../lib/thrift/Lich.js');
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
                                   var imgUri = "";
                                    if(a.imgUrl != null){
                                       imgUri = a.imgUrl.split(",")[0];
                                    }

                                    var product = {
                                        productId: a.productId,
                                        sellerId: a.sellerId,
                                        subjectName: a.subjectPath,
                                        productName: a.productName,
                                        totalSales: a.totalSales,
                                        imgUrl: imgUri,
                                        activeState: a.activeState,
                                        crateTime: a.createTime,
                                        sellerName: a.sellerName
                                    };
                                    if(a.minOrgPrice ==null){
                                        product.minOrgPrice =0;
                                    }else{
                                        product.minOrgPrice =(Number(a.minOrgPrice) / 100).toFixed(2);
                                    }
                                    if(a.minCurPrice ==null){
                                        product.minCurPrice =0;
                                    }else{
                                        product.minCurPrice =(Number(a.minCurPrice) / 100).toFixed(2);
                                    }

                                    if(a.maxOrgPrice ==null){
                                        product.maxOrgPrice =0;
                                    }else{
                                        product.maxOrgPrice =(Number(a.maxOrgPrice) / 100).toFixed(2);
                                    }
                                    if(a.maxCurPrice ==null){
                                        product.maxCurPrice =0;
                                    }else{
                                        product.maxCurPrice =(Number(a.maxCurPrice) / 100).toFixed(2);
                                    }
                                    dataArr.push(product);
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

//////////////////////////////////////////////////////////////////////////////////
router.post('/thirdPartyProductQuery', function (request, response, next) {

    logger.info("进入第三方商品查询接口");
    var result = {code: 200};
    result.thirdPartyProductList = [];
    result.pagination = "";
    try {
        //var params = request.query;
        var params = request.body;
        logger.info("进入第三方商品查询接口:" + params);
        if (params.curpage == null || params.curpage == "" || params.curpage <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.percount == null || params.percount == ""|| params.percount <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        Product.queryThirdPartyProduct(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            if(data !=null){
                result.thirdPartyProductList = data.thirdPartyProductList;
                result.pagination = data.pagination;
            }
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("apply state error:" + ex);
        result.code = 500;
        result.desc = "查询第三方商品失败";
        response.json(result);
    }
});

router.post('/getThirdPartyProductLog', function (request, response, next) {

    logger.info("获取第三方操作日志");
    var result = {code: 200};
    result.pagination = "";
    result.logs = ""
    try {
        var params = request.body;
        logger.info("获取第三方操作日志:" + params);

        if (params.curpage == null || params.curpage == "" || params.curpage <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.percount == null || params.percount == ""|| params.percount <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.thirdPartyProductId == null || params.thirdPartyProductId == ""|| params.thirdPartyProductId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        //thirdPartyIdentify
        if (params.thirdPartyIdentify == null || params.thirdPartyIdentify == ""|| params.thirdPartyIdentify <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        Product.getThirdPartyProductLog(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            if(data!=null){
                result.logs = data.logs;
                result.pagination = data.pagination;
            }
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("apply state error:" + ex);
        result.code = 500;
        result.desc = "查询第三方商品失败";
        response.json(result);
    }
});


router.post('/offerThirdPartyProduct', function (request, response, next) {
    logger.info("进入提报功能");
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("进入提报功能:" + params);
        if (params.thirdPartyProductId == null || params.thirdPartyProductId == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.thirdPartyIdentify == null || params.thirdPartyIdentify == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        Product.offerThirdPartyProduct(params, function(err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.value = data;
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("提报 error:" + ex);
        result.code = 500;
        result.desc = "提报失败";
        response.json(result);
    }
});
//第三方商品导出
router.post('/exportThirdPartyProduct', function (request, response, next) {
    logger.info("导出第三方商品");
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("进入导出第三方商品:" + params);
        Product.exportThirdPartyProduct(params, function(err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.value = data;
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导出第三方商品 error:" + ex);
        result.code = 500;
        result.desc = "导出第三方商品失败";
        response.json(result);
    }
});


//商品导出
router.post('/exportProduct', function (request, response, next) {
    logger.info("导出商品");
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("进入商品:" + params);
        Product.exportProduct(params, function(err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.value = data;
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("导出商品 error:" + ex);
        result.code = 500;
        result.desc = "导出商品失败";
        response.json(result);
    }
});


//管理中心查询虚拟商品类别列表
router.post('/findAllVList', function (request, response, next) {
    var result = {code: 200};
    try {
        var fileCardServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, "findVirtuaProductlList", []);
        Lich.wicca.invokeClient(fileCardServ, function (err, data) {
            logger.info("调用findVirtuaProductlList result:" + JSON.stringify(data[0]));
            if (err || data[0].result.code == 1) {
                logger.error("调用调用findVirtuaProductlList  失败原因 ======" + err+JSON.stringify(data));
                result.code = 500;
                result.desc = "查询失败！";
            }else{
                var reg = /\\/;
                var str = data[0].value.replace(reg,'');
                logger.error("替换后的字符串"+str);
                result.desc = JSON.parse(str);
            }
            response.json(result);
        });
    } catch (ex) {
        logger.error("查询商品类别列表失败:" + ex);
        result.code = 500;
        result.desc = "查询异常！";
        response.json(result);
    }
});



module.exports = router;