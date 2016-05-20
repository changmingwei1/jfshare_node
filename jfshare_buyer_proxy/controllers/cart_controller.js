/**
 * @author by YinBo on 16/4/24.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Cart = require('../lib/models/cart');
var Buyer = require('../lib/models/buyer');

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
                        remark: "我是写死的字段"
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
                res.json(result);
            } else {
                result.cartList = cartList;
                res.json(result);
            }
            /*var count = 0;
             if (cartList.length > 0) {
             cartList.forEach(function (item) {
             var param = {productId: item.productId, skunum: item.skunum.skuNum};
             Product.getStockForSku(param, function (err, stockInfo) {
             if (err) {
             //res.json(err);
             return;
             }
             var stock = stockInfo.stockInfo;
             var stockItemMap = stockInfo.stockInfo.stockItemMap;
             item.skuCount = stockItemMap[item.skunum.skuNum].count - stockItemMap[item.skunum.skuNum].lockCount;

             if (count >= cartList.length - 1) {
             result.cartList = cartList;
             res.json(result);
             logger.info("get cart list response:" + JSON.stringify(result));
             }
             count = count + 1;
             });
             });
             } else {
             result.cartList = [];
             res.json(result);
             }*/
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