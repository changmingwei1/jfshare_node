/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');

router.post('/add', function(req, res, next) {
    var result = {code:200};

    try{
        var arg = req.body;
        logger.info("add cart item request:" + JSON.stringify(arg));
        if(arg == null){
            result.code = 400;
            res.json(result);
            return;
        }

        var param = {};
        param.userId = arg.userId || null;
        param.productId = arg.productId || null;
        param.skunum = arg.skunum || '';
        param.count = arg.count || 0;
        param.price = arg.price || null;

        if(param.userId == null || param.productId == null ||
            param.count <= 0 || param.price == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.addCartItem(param, function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("add cart item response:" + JSON.stringify(result));
        });
    } catch(ex) {
        logger.error("add product to cart error:" + ex);
        result.code = 500;
        result.desc = "添加商品到购物车失败";
        res.json(result);
    }
});

router.post('/delete', function(req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        logger.info("delete cart item request:" + JSON.stringify(arg));

        if(arg == null || arg.userId == null || arg.product == null || arg.product.length <= 0) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.deleteCartItem(arg.userId, arg.product, function(err, data){
            if(err) {
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("delete cart item response:" + JSON.stringify(result));
        });
    } catch(ex) {
        logger.error("delete product in cart error:" + ex);
        result.code = 500;
        result.desc = "删除购物车商品失败";
        res.json(result);
    }
});

router.get('/list', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.query;
        logger.info("get cart list request:" + JSON.stringify(arg));
        if(arg == null || arg.userid == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.cartListItem(arg.userid, function(err, itemList) {
            if(err){
                res.json(err);
                return;
            }
            var cartList = [];
            if(itemList) {
                //res.json(itemList);
                for(var i = 0; i < itemList.length; i++) {
                    if(itemList[i].itemDetailList  && itemList[i].itemDetailList.length > 0){
                        for(var j = 0; j < itemList[i].itemDetailList.length; j++){
                            var product = itemList[i].itemDetailList[j].product;
                            cartList.push({
                                sellerId: product.product.sellerId,
                                productId: product.product.productId,
                                productName: product.product.productName,
                                skunum: {
                                    skuNum: product.product.productSku.skuNum,
                                    skuName:product.product.productSku.skuName},
                                count:product.count,
                                curPrice: product.product.productSku.curPrice,
                                orgPrice: product.product.productSku.orgPrice,
                                activeState: product.product.activeState,
                                imgUrl: product.product.imgKey.split(',')[0]
                            });
                        }
                    }
                }
                var count = 0;
                if(cartList.length > 0) {
                    cartList.forEach(function(item) {
                        var param = {productId: item.productId, skunum: item.skunum.skuNum};
                        Product.getStockForSku(param, function(err, stockInfo) {
                            if(err){
                                //res.json(err);
                                return;
                            }
                            var stock = stockInfo.stockInfo;
                            var stockItemMap = stockInfo.stockInfo.stockItemMap;
                            item.activeStock = stockItemMap[item.skunum.skuNum].count - stockItemMap[item.skunum.skuNum].lockCount;

                            if(count >= cartList.length - 1) {
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
                }
            } else {
                result.cartList = [];
                res.json(result);
            }
        });
    } catch(ex) {
        logger.error("get cart product list error:" + ex);
        result.code = 500;
        result.desc = "获取购物车商品列表失败";
        res.json(result);
    }
});

router.get('/count', function(req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.query;
        logger.info("get cart count request:" +  JSON.stringify(arg));

        if(arg == null || arg.userid == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.cartCountItem(arg.userid, function(err, count) {
            if(err){
                res.json(err);
                return;
            }
            result.count = count;
            res.json(result);
            logger.info("get cart item count response:" + JSON.stringify(result));
        })
    } catch (ex) {
        logger.error("get product count in cart error:" + ex);
        result.code = 500;
        result.desc = "获取购物车商品数量失败";
        res.json(result);
    }
});

router.post('/update', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("update product in cart request:" +  JSON.stringify(arg));

        if(arg == null || arg.userId == null || arg.skunum == null || arg.productId == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.cartUpdateItem(arg, function(err, count) {
            if(err){
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("get cart item count response:" + JSON.stringify(result));
        })
    } catch (ex) {
        logger.error("update product in cart error:" + ex);
        result.code = 500;
        result.desc = "更新购物车商品失败";
        res.json(result);
    }
});

module.exports = router;