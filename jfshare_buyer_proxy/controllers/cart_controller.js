/**
 * @author by YinBo on 16/4/24.
 */
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Cart = require('../lib/models/cart');
var Buyer = require('../lib/models/buyer');
var BaseTemplate = require('../lib/models/baseTemplate');

/*获取购物车中商品的数量*/
router.post('/count', function (req, res, next) {
    logger.info("进入查询购物车中商品数量的接口...");
    var result = {code: 200};
    try {
        var param = req.body;
        if (param == null) {
            result.code = 400;
            result.desc = "请求参数不能为空";
            res.json(result);
            return;
        }
        if (param.userId == "" || param.userId == null || param.userId <= 0) {
            result.code = 400;
            result.desc = "参数错误，用户id不能为空";
            res.json(result);
            return;
        }
        if (param.token == "" || param.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (param.ppInfo == "" || param.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (param.browser == "" || param.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            res.json(result);
            return;
        }
        logger.info("请求的参数，arg：" + JSON.stringify(param));
//暂时去掉鉴权信息
//    Buyer.validAuth(param,function(err,data) {
//        if (err) {
//            response.json(err);
//            return;
//        }
        Cart.countItem(param, function (err, count) {
            if (err) {
                res.json(err);
                return;
            }
            result.count = count;
            res.json(result);
            logger.info("get cart item count response:" + JSON.stringify(result));
        });
        //});
    } catch (ex) {
        logger.error("get product count in cart error:" + ex);
        result.code = 500;
        result.desc = "获取购物车商品数量失败";
        res.json(result);
    }
});

/*新增购物车项目*/
router.post('/add', function (req, res, next) {
    var result = {code: 200};
    try {
        var param = req.body;
        if (param == null) {
            result.code = 400;
            result.desc = "请求参数不能为空";
            res.json(result);
            return;
        }
        if (param.userId == null || param.userId == "" || param.userId <= 0) {
            result.code = 400;
            result.desc = "用户id参数错误";
            res.json(result);
            return;
        }
        if (param.price == null || param.price == "" || param.price < 0) {
            result.code = 400;
            result.desc = "请求价格参数错误";
            res.json(result);
            return;
        }
        if (param.browser == null || param.browser == "") {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            res.json(result);
            return;
        }
        if (param.token == null || param.token == "") {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (param.ppInfo == null || param.ppInfo == "") {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (param.count == null || param.count == "" || param.count <= 0) {
            result.code = 400;
            result.desc = "购买数量参数有误";
            res.json(result);
            return;
        }
        logger.info("请求的参数，arg：" + JSON.stringify(param));
//暂时去掉鉴权信息
//    Buyer.validAuth(param,function(err,data) {
//        if (err) {
//            response.json(err);
//            return;
//        }
        Cart.addCartItem(param, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("add cart item response:" + JSON.stringify(result));
        });
        //});
    } catch (ex) {
        logger.error("add product to cart error:" + ex);
        result.code = 500;
        result.desc = "添加商品到购物车失败";
        res.json(result);
    }
});

/*删除购物车项目*/
router.post('/delete', function (req, res, next) {
    var result = {code: 200};
    try {
        var param = req.body;
        if (param == null) {
            result.code = 400;
            result.desc = "请求参数不能为空";
            res.json(result);
            return;
        }
        if (param.userId == null || param.userId == "") {
            result.code = 400;
            result.desc = "用户id不能为空";
            res.json(result);
            return;
        }
        if (param.token == "" || param.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (param.ppInfo == "" || param.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (param.browser == "" || param.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            res.json(result);
            return;
        }
        logger.info("请求的参数，arg：" + JSON.stringify(param));
// 暂时去掉鉴权信息
//    Buyer.validAuth(param,function(err,data) {
//        if (err) {
//            response.json(err);
//            return;
//        }
        Cart.deleteCartItem(param, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("delete cart item response:" + JSON.stringify(result));
        });
        //});
    } catch (ex) {
        logger.error("delete product in cart error:" + ex);
        result.code = 500;
        result.desc = "删除购物车商品失败";
        res.json(result);
    }
});

/*购物车列表*/
router.post('/list', function (req, res, next) {
    var result = {code: 200};
    var remark = null;
    try {
        var param = req.body;
        if (param == null) {
            result.code = 400;
            result.desc = "请求参数不能为空";
            res.json(result);
            return;
        }
        if (param.userId == null || param.userId == "") {
            result.code = 400;
            result.desc = "用户id不能为空";
            res.json(result);
            return;
        }
        if (param.token == "" || param.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (param.ppInfo == "" || param.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (param.browser == "" || param.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            res.json(result);
            return;
        }
        logger.info("get cart list request:" + JSON.stringify(param));
//暂时去掉鉴权信息
//    Buyer.validAuth(param,function(err,data) {
//        if (err) {
//            response.json(err);
//            return;
//        }
        async.series([
            function(callback){
                Cart.cartListItem(param, function (err, itemList) {
                    if (err) {
                        res.json(err);
                        return;
                    }
                    var cartList = [];
                    if (itemList != null) {
                        for (var i = 0; i < itemList.length; i++) {
                            var cartLists = {
                                sellerId: itemList[i].seller.sellerId,
                                sellerName: itemList[i].seller.sellerName,
                                remark:remark
                            };
                            var productList = [];
                            var itemDetailList = itemList[i].itemDetailList;
                            for (var j = 0; j < itemDetailList.length; j++) {
                                var product = {
                                    productId: itemDetailList[j].product.product.productId,
                                    productName: itemDetailList[j].product.product.productName,
                                    activeState: itemDetailList[j].product.product.activeState,
                                    storehouseIds: itemDetailList[j].product.product.storehouseIds,
                                    postageId: itemDetailList[j].product.product.postageId,
                                    cartPrice: itemDetailList[j].product.cartPrice,
                                    skuCount: itemDetailList[j].product.skuCount,
                                    count: itemDetailList[j].product.count,
                                    sku: {
                                        skuNum: itemDetailList[j].product.product.productSku.skuItems[0].skuNum,
                                        skuName: itemDetailList[j].product.product.productSku.skuItems[0].skuName,
                                        weight: itemDetailList[j].product.product.productSku.skuItems[0].weight
                                    },
                                    imgKey: itemDetailList[j].product.product.imgKey.split(',')[0]
                                };
                                productList.push(product);
                            }
                            cartLists.productList = productList;
                            cartList.push(cartLists);
                        }
                        result.cartList = cartList;
                        param.cartList = cartList;
                        callback(null,result);
                        logger.info("购物车列表信息result：" + JSON.stringify(result));
                        return;
                    } else {
                        result.cartList = cartList;
                        param.cartList = cartList;
                        callback(null,result);
                        logger.info("购物车列表信息result：" + JSON.stringify(result));
                        return;
                    }
                });
            },
            function(callback){
                logger.info("kankan shi sha:" + JSON.stringify(param.cartList));
                var cList = result.cartList;
                for (var i = 0; i < cList.length; i++) {
                    var sellerId = cList[i].sellerId;
                    BaseTemplate.queryPostageTemplate(sellerId, 2, function (err, data) {
                        if (err) {
                            res.json(err);
                        } else {
                            if (data[0].postageTemplateList != null || data[0].postageTemplateList.length > 0) {
                                param.remark = data[0].postageTemplateList[0].templateDesc;
                                logger.info("kankan shi sha3333:" + JSON.stringify(param.remark));
                                callback(null, result);
                            } else {
                                param.remark = "";
                                callback(null, result);
                            }
                        }
                    });
                    logger.info("kankan shi sha5555:" + param.remark);
                    cList[i].remark = param.remark;
                    logger.info("kankan shi 44444444:" + JSON.stringify(cList[i].remark));
                }
            }
        ],function(err,results){
            if (err == 1) {
                result.code = 500;
                result.desc = "获取购物车列表失败";
                logger.error("获取购物车列表失败，原因:" + err);
                res.json(result);
                return;
            } else if(err == 2){
                result.code = 500;
                result.desc = "获取商家运费模板信息失败";
                logger.error("获取商家运费模板失败，原因:" + err);
                res.json(result);
                return;
            } else {
                res.json(result);
                return;
            }
        });


        //});
    } catch (ex) {
        logger.error("get cart product list error:" + ex);
        result.code = 500;
        result.desc = "获取购物车商品列表失败";
        res.json(result);
    }
});

/*修改购物车中商品的数量*/
router.post('/update', function (req, res, next) {
    var result = {code: 200};

    try {
        var param = req.body;
        if (param == null) {
            result.code = 400;
            result.desc = "请求参数不能为空";
            res.json(result);
            return;
        }
        if (param.userId == null || param.userId == "") {
            result.code = 400;
            result.desc = "用户id不能为空";
            res.json(result);
            return;
        }
        if (param.token == "" || param.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (param.ppInfo == "" || param.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            res.json(result);
            return;
        }
        if (param.browser == "" || param.browser == null) {
            result.code = 400;
            result.desc = "浏览器标识不能为空";
            res.json(result);
            return;
        }
        logger.info("get cart list request:" + JSON.stringify(param));
//暂时去掉鉴权信息
//    Buyer.validAuth(arg,function(err,data) {
//        if (err) {
//            response.json(err);
//            return;
//        }
        Cart.cartUpdateItem(param, function (err, count) {
            if (err) {
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("get cart item count response:" + JSON.stringify(result));
        });
        //});
    } catch (ex) {
        logger.error("update product in cart error:" + ex);
        result.code = 500;
        result.desc = "更新购物车商品失败";
        res.json(result);
    }
});

module.exports = router;