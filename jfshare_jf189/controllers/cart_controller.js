/**
 * Created by L on 2015/10/24 0024.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
//var path = require('path');
var view = require('../view_center/cart/view_cart');
var paramValid = require('../lib/models/pub/param_valid');
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var cart_types = require("../lib/thrift/gen_code/cart_types");
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');
var protocol = thrift.TBinaryProtocol;
var transport =  thrift.TFramedTransport;
var thriftOptions = {
    transport: transport,
    protocol: protocol
};
var thriftConfig = require('../resource/thrift_config');

router.post('/add_cart', function(req, res, next) {
    logger.info('商品提交页');

    var parameters = {};
    var arg = req.body;
    parameters.stock = arg.stock || "";
    parameters.productId = arg.productId || "";
    parameters.userId = req.session.buyer.userId+"" || "";

    parameters.skuNum = arg.skuNum || "";
    parameters.amount = arg.amount || 0;
    parameters.fromBatch = arg.fromBatch || "1";
    parameters.price = arg.price || "0";

    parameters.title =  "购物车";
    logger.info("商品页获取到的库存为：" +  parameters.stock);

    var item = new cart_types.Item({
        productId:parameters.productId,
        skuNum:parameters.skuNum,
        count:parameters.amount,
        price:parameters.price,
        wi:""
    });
    // 获取client
    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "addItem", [parameters.userId, item, 1]);
    Lich.wicca.invokeClient(cartServ, function (err, data) {
        if (err || data[0].result.code == "1") {
            logger.error("调用CartServer-addItem添加购物车失败  失败原因 ======" + err);
            data[0].status = 500;
            res.json(data[0]);
            return;
        }
        logger.info("调用CartServer-addItem添加购物车成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        logger.info("接口返回数据=====" + data[0].value);
        //view.confirm_cart(req, res, next, parameters);
        data[0].status = 200;
        res.json(data[0]);
    });
});

router.get('/count_cart', function(req, res, next) {
    logger.info('购物车数量');
    var req_origin = req.headers.origin || "*";
    res.setHeader('Access-Control-Allow-Origin', req_origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET'); //POST, GET, PUT, DELETE, OPTIONS
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept,X-Requested-With");

    var parameters = {};
    if (!paramValid.empty(req.query.uid)) {
        parameters.userId = req.query.uid;
    } else {
        parameters.userId = req.session.buyer.userId + "" || "";
    }

    parameters.title =  "购物车";
    logger.info("获取购物车商品数量：" +  parameters.userId);
    var ret = {};
    if (!paramValid.keyValid(parameters.userId)) {
        logger.warn("用户userId有误, userId=" + parameters.userId);
        ret.status = 500;
        res.json(ret);
        return;
    }

    // 获取client
    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "countItem", [parameters.userId, 1]);
    Lich.wicca.invokeClient(cartServ, function (err, data) {
        if (err || data[0].result.code == "1") {
            logger.error("调用CartServer-countItem查询购物车数量失败  失败原因 ======" + err);
            ret = data[0];
            ret.status = 500;
            res.json(ret);
            return;
        }
        logger.info("调用CartServer-countItem查询购物车数量成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        logger.info("接口返回数据=====" + data[0].value);
        //view.confirm_cart(req, res, next, parameters);
        ret = data[0];
        ret.status = 200;
        res.json(ret);
    });
});

router.get('/list', function(req, res, next) {
    var arg = req.body;
    res.resData.title =  "购物车";
    res.resData.fromBatch = arg.fromBatch || "1";
    //1.render no data ui
    view.show_cart(req, res, next);
});

router.get('/list_cart', function(req, res, next) {
    logger.info('购物车列表');

    var parameters = {};
    parameters.userId = req.session.buyer.userId+"" || "";

    parameters.title =  "购物车";
    logger.info("获取购物车商品列表：" +  parameters.userId);
    var ret = {};
    if (!paramValid.keyValid(parameters.userId)) {
        logger.warn("用户userId有误, userId=" + parameters.userId);
        ret.status = 500;
        res.json(ret);
        return;
    }

    // 获取client
    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "listItem", [parameters.userId, 1]);
    Lich.wicca.invokeClient(cartServ, function (err, data) {
        if (err || data[0].result.code == "1") {
            logger.error("调用CartServer-listItem查询购物车列表失败  失败原因 ======" + err);
            ret = data[0];
            ret.status = 500;
            res.json(ret);
            return;
        }
        logger.info("调用CartServer-listItem查询购物车列表成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        logger.info("接口返回数据=====" + data[0].value);
        //view.confirm_cart(req, res, next, parameters);
        ret = data[0];
        ret.status = 200;
        res.json(ret);
    });
});

router.post('/update_cart', function(req, res, next) {
    var parameters = {};
    var arg = req.body;
    parameters.userId = req.session.buyer.userId+"" || "";

    parameters.title =  "购物车";
    logger.info("购物车更新：" +  parameters.userId);
    var ret = {};
    if (!paramValid.keyValid(parameters.userId)) {
        logger.warn("用户userId有误, userId=" + parameters.userId);
        ret.status = 500;
        res.json(ret);
        return;
    }
    parameters.selected = arg.selected==null? null: JSON.parse(arg.selected);
    parameters.curItemKey = arg.curItemKey==null?null: JSON.parse(arg.curItemKey);
    parameters.count = arg.toNumber;
    parameters.price = arg.toPrice;
    var cartKeyList = [];
    if (!paramValid.empty(parameters.selected)) {
        for (var i in parameters.selected) {
            var cartKey = new cart_types.CartKey({
                productId:parameters.selected[i].productId,
                skuNum:parameters.selected[i].skuNum,
            });
            cartKeyList.push(cartKey);
        }
    }
    var curCartKey = null;
    var curItem = null;
    if (!paramValid.empty(parameters.curItemKey)) {
        curCartKey = new cart_types.CartKey({
            productId:parameters.curItemKey.productId,
            skuNum:parameters.curItemKey.skuNum,
        });
        curItem = new cart_types.Item({
            productId:parameters.curItemKey.productId,
            skuNum:parameters.curItemKey.skuNum,
            count:parameters.count,
            price:parameters.price,
        });
    } else {
        ret.status = 500;
        res.json(ret);
        return;
    }
    // 获取client
    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "updateItem", [parameters.userId, cartKeyList, curCartKey, curItem, 1]);
    Lich.wicca.invokeClient(cartServ, function (err, data) {
        if (err || data[0].result.code == "1") {
            logger.error("调用CartServer-updateItem更新购物车列表失败  失败原因 ======" + err + ",failcode===" + data[0].result.failDescList);
            ret = data[0];
            ret.status = 500;
            ret.msg = "更新购物车失败！";
            res.json(ret);
            return;
        }
        logger.info("调用CartServer-updateItem更新购物车列表成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        logger.info("接口返回数据=====" + data[0].value);
        //view.confirm_cart(req, res, next, parameters);
        ret = data[0];
        ret.status = 200;
        res.json(ret);
    });
});

router.post('/delete_cart', function(req, res, next) {
    var parameters = {};
    var arg = req.body;
    parameters.userId = req.session.buyer.userId+"" || "";

    parameters.title =  "购物车";
    logger.info("购物车删除：" +  parameters.userId);
    var ret = {};
    if (!paramValid.keyValid(parameters.userId)) {
        logger.warn("用户userId有误, userId=" + parameters.userId);
        ret.status = 500;
        res.json(ret);
        return;
    }
    parameters.selected = arg.selected==null?null: JSON.parse(arg.selected);
    var cartKeyList = [];
    if (!paramValid.empty(parameters.selected)) {
        for (var i in parameters.selected) {
            var cartKey = new cart_types.CartKey({
                productId: parameters.selected[i].productId,
                skuNum: parameters.selected[i].skuNum,
            });
            cartKeyList.push(cartKey);
        }
    } else {
        ret.status = 500;
        res.json(ret);
        return;
    }

    // 获取client
    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "deleteItem", [parameters.userId, cartKeyList, 1]);
    Lich.wicca.invokeClient(cartServ, function (err, data) {
        if (err || data[0].code == "1") {
            logger.error("调用CartServer-deleteItem删除购物车项失败  失败原因 ======" + err);
            ret = data[0];
            ret.status = 500;
            ret.msg = "删除购物车商品失败！";
            res.json(ret);
            return;
        }
        logger.info("调用CartServer-deleteItem删除购物车项成功  result.code =  （" + data[0].code + "）  1为失败 0为成功");
        logger.info("接口返回数据=====" + data[0]);
        //view.confirm_cart(req, res, next, parameters);
        ret = data[0];
        ret.status = 200;
        res.json(ret);
    });
});

router.post('/select_cart', function(req, res, next) {
    var parameters = {};
    var arg = req.body;
    parameters.userId = req.session.buyer.userId+"" || "";

    parameters.title =  "购物车";
    logger.info("购物车选中项查询：" +  parameters.userId);
    var ret = {};
    if (!paramValid.keyValid(parameters.userId)) {
        logger.warn("用户userId有误, userId=" + parameters.userId);
        ret.status = 500;
        res.json(ret);
        return;
    }
    parameters.selected = arg.selected==null? null: JSON.parse(arg.selected);
    var cartKeyList = [];
    if (!paramValid.empty(parameters.selected)) {
        for (var i in parameters.selected) {
            var cartKey = new cart_types.CartKey({
                productId:parameters.selected[i].productId,
                skuNum:parameters.selected[i].skuNum,
            });
            cartKeyList.push(cartKey);
        }
    }
    // 获取client
    var cartServ = new Lich.InvokeBag(Lich.ServiceKey.CartServer, "findListByCartKey", [parameters.userId, cartKeyList, 1]);
    Lich.wicca.invokeClient(cartServ, function (err, data) {
        if (err || data[0].result.code == "1") {
            logger.error("调用CartServer-findListByCartKey查询购物车选中项列表失败  失败原因 ======" + err + ",failcode===" + data[0].result.failDescList);
            ret = data[0];
            ret.status = 500;
            ret.msg = "查询购物车选中项失败！";
            res.json(ret);
            return;
        }
        logger.info("调用CartServer-findListByCartKey查询购物车选中项列表成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
        logger.info("接口返回数据=====" + data[0].value);
        //view.confirm_cart(req, res, next, parameters);
        ret = data[0];
        ret.status = 200;
        res.json(ret);
    });
});
//暴露模块
module.exports = router;
