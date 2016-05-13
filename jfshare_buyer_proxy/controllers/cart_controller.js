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
        var arg = req.body;
        var userId = arg.userId;
        var token = arg.token;
        var ppInfo = arg.ppInfo;
        var source = arg.source;
        var browser = arg.browser;

        var param = {};
        param.userId = userId;
        param.token = token;
        param.ppInfo = ppInfo;
        param.source = source;
        param.browser = browser;

        if (param.userId == "" || param.userId == null || param.userId <= 0) {
            result.code = 400;
            result.desc = "参数错误，用户id不能为空";
            res.json(result);
            return;
        }

        if (param.token == "" || param.token == null) {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (param.ppInfo == "" || param.ppInfo == null) {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (param.browser == "" || param.browser == null) {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        logger.info("get cart count request:" + JSON.stringify(param));

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
        var arg = req.body;
        if (arg == null) {
            result.code = 400;
            res.json(result);
            return;
        }
        var param = {};
        param.userId = arg.userId;
        param.productId = arg.productId;
        param.skuNum = arg.skuNum;
        param.count = arg.count;
        param.price = arg.price;
        param.storehouseId = arg.storehouseId;
        param.source = arg.source;
        param.token = arg.token || "111";
        param.ppInfo = arg.ppInfo || "222";
        param.browser = arg.browser || "1";

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

        logger.info("请求参数：" + JSON.stringify(param));

//暂时去掉鉴权信息
//    Buyer.validAuth(args,function(err,data) {
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
        var arg = req.body;
        arg.token = "鉴权信息1";
        arg.ppInfo = "鉴权信息2";
        if (arg == null || arg.userId == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
// 暂时去掉鉴权信息
//    Buyer.validAuth(args,function(err,data) {
//        if (err) {
//            response.json(err);
//            return;
//        }
        logger.info("请求的参数，arg：" + JSON.stringify(arg));
        //logger.info("请求的参数，arg：" + JSON.stringify(arg));
        Cart.deleteCartItem(arg, function (err, data) {
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
        var arg = req.body;
        var param = {};
        param.userId = arg.userId;
        param.source = arg.source || 2;
        param.token = arg.token || "鉴权信息1";
        param.ppInfo = arg.ppInfo || "鉴权信息2";

        logger.info("get cart list request:" + JSON.stringify(arg));
        if (param == null || param.userId == null || param.userId == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
//暂时去掉鉴权信息
//    Buyer.validAuth(args,function(err,data) {
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
            if (itemList) {
                var cartLists = {};
                itemList.forEach(function (a) {
                    cartLists.sellerId = a.seller.sellerId;
                    cartLists.sellerName = a.seller.sellerName;
                    cartLists.remark = "六一儿童节大优惠";
                    var productList = [];
                    var itemDetailList = itemList[0].itemDetailList;
                    itemDetailList.forEach(function (b) {
                        productList.push({
                            productId: b.product.product.productId,
                            productName: b.product.product.productName,
                            activeState: b.product.product.activeState,
                            cartPrice: b.product.cartPrice,
                            skuCount: b.product.skuCount - b.product.lockCount,
                            count: b.product.count,
                            sku: {
                                skuNum: b.product.product.productSku.skuNum,
                                skuName: b.product.product.productSku.skuName
                            },
                            imgKey: b.product.product.imgKey.split(',')[0]
                        });
                    });
                    cartLists.productList = productList;
                });

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
                cartList.push(cartLists);
                result.cartList = cartList;
                res.json(result);
            } else {
                result.cartList = [];
                res.json(result);
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
        var arg = req.body;
        if (arg == null) {
            result.code = 400;
            res.json(result);
            return;
        }
//暂时去掉鉴权信息
//    Buyer.validAuth(arg,function(err,data) {
//        if (err) {
//            response.json(err);
//            return;
//        }
        Cart.cartUpdateItem(arg, function (err, count) {
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