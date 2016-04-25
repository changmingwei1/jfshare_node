/**
 * @author by YinBo on 16/4/24.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Cart = require('../lib/models/cart');

//获取购物车中商品的数量
router.get('/count', function(req, res, next) {
    logger.info("进入查询购物车中商品数量的接口...");
    var result = {code: 200};
    try {
        var arg = req.query;
        var userId = arg.userId || "2";
        var token = arg.token || "鉴权信息1";
        var ppInfo = arg.ppInfo || "鉴权信息2";
        var source = arg.source || 2;

        var param = {};
        param.userId = userId;
        param.token = token;
        param.ppInfo = ppInfo;
        param.source = source;
        logger.info("get cart count request:" +  JSON.stringify(param));
        Cart.countItem(param, function(err, count) {
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

//新增购物车项目
router.post('/add', function(req, res, next) {
    var result = {code:200};
    try{
        var arg = req.body;
        if(arg == null){
            result.code = 400;
            res.json(result);
            return;
        }
        var param = {};
        param.userId = arg.userId || "2";
        param.productId = arg.productId || "1000";
        param.skuNum = arg.skuNum || '1-1:100-101';
        param.count = arg.count || 10;
        param.price = arg.price || "5000";
        param.token = arg.token || "鉴权信息1";
        param.ppInfo = arg.ppInfo || "鉴权信息2";
        param.storehouseId = arg.storehouseId || "101";
        param.source = arg.source || 2;

        if(param.userId == null || param.productId == null ||
            param.count <= 0 || param.price == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        logger.info("请求参数：" + JSON.stringify(param));
        Cart.addCartItem(param, function(err, data) {
            if(err){
                //res.json(err);
                //return;
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

//删除购物车项目
router.post('/delete', function(req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        var userId = arg.userId || "2";
        var cartKey = {
            productId:arg.productId || "1000",
            skuNum:arg.skuNum || "1-1:100-101"
        };
        var source = arg.source;
        var params = {};
        params.userId = userId;
        params.cartKey = cartKey;
        params.source = source || 2;

        params.token = arg.token || "鉴权信息1";
        params.ppInfo = arg.ppInfo || "鉴权信息2";

        logger.info("delete cart item request:" + JSON.stringify(params));

        if(params == null || userId == null || cartKey == null || cartKey <= 0) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        Cart.deleteCartItem(params, function(err, data){
            if(err) {
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("delete cart item response:" + JSON.stringify(result));
        });
    } catch(ex) {
        /***************************暂时注掉******************************/
        //logger.error("delete product in cart error:" + ex);
        //result.code = 500;
        //result.desc = "删除购物车商品失败";
        res.json(result);
    }
});

//购物车列表
router.get('/list', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.query;
        var param = {};
        param.userId = arg.userId || "2";
        param.source = arg.source || 2;
        param.token = arg.token || "鉴权信息1";
        param.ppInfo = arg.ppInfo || "鉴权信息2";

        logger.info("get cart list request:" + JSON.stringify(arg));
        if(param == null || param.userId == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Cart.cartListItem(param, function(err, itemList) {
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
                            item.skuCount = stockItemMap[item.skunum.skuNum].count - stockItemMap[item.skunum.skuNum].lockCount;

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

//修改购物车中商品的数量
router.post('/update', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        if(arg == null){
            result.code = 400;
            res.json(result);
            return;
        }
        var param = {};
        param.userId = arg.userId || "2";
        param.productId = arg.productId || "1000";
        param.skuNum = arg.skuNum || '1-1:100-101';
        param.count = arg.count || 10;
        param.price = arg.price || "5000";
        param.token = arg.token || "鉴权信息1";
        param.ppInfo = arg.ppInfo || "鉴权信息2";
        param.storehouseId = arg.storehouseId || "101";
        param.source = arg.source || 2;

        logger.info("update product in cart request:" +  JSON.stringify(param));

        Cart.cartUpdateItem(param, function(err, count) {
            if(err){
                //res.json(err);
                //return;
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