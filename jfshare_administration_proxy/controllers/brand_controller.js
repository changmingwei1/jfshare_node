/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');

// 添加品牌
router.post('/add', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        var params = {};
        params.name = arg.name || "三星";
        params.imgKey = arg.imgKey || "53AA8C093E164059D432971EA2F9C1DD.jpg";

        logger.info("请求， params:" + JSON.stringify(params));

        res.json(result);
        logger.info("add brand response:" + JSON.stringify(result));
    } catch (ex) {
        logger.error("add brand error:" + ex);
        result.code = 500;
        result.desc = "新增品牌失败";
        res.json(result);
    }
});

// 获取品牌信息
router.post('/get', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        var brandId = arg.brandId || 1;
        logger.info("请求， arg:" + JSON.stringify("brandId:" + brandId));

        var brand = {};
        brand.name = "华为";
        brand.imgKey = "53AA8C093E164059D432971EA2F9C1DD.jpg";
        result.brand = brand;
        res.json(result);
        logger.info("获取系统消息 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("获取系统消息 error:" + ex);
        result.code = 500;
        result.desc = "获取系统消息失败";
        res.json(result);
    }
});

// 修改商家信息
router.post('/update', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        var params = {};
        params.name = arg.name || "小米";
        params.imgKey = arg.imgKey || "53AA8C093E164059D432971EA2F9C1DD.jpg";

        logger.info("新增系统消息请求， params:" + JSON.stringify(params));

        res.json(result);
        logger.info("add address response:" + JSON.stringify(result));
    } catch (ex) {
        logger.error("update address error:" + ex);
        result.code = 500;
        result.desc = "更新系统消息失败";
        res.json(result);
    }
});

//品牌列表
router.post('/list', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        var params = {};
        params.name = arg.name || "%华%";
        params.perCount = arg.perCount || 50;
        params.curPage = arg.curPage || 1;

        logger.info("获取商家列表请求， arg:" + JSON.stringify(params));
        var brand1 = {};
        brand1.brandId = 1;
        brand1.name = "三星";
        brand1.imgKey = "53AA8C093E164059D432971EA2F9C1DD.jpg";
        brand1.createTime = "2016-4-26";
        var brand2 = {};
        brand2.brandId = 2;
        brand2.name = "华为";
        brand2.imgKey = "53AA8C093E164059D432971EA2F9C1DD.jpg";
        brand2.createTime = "2016-4-26";
        var brand3 = {};
        brand3.brandId = 3;
        brand3.name = "小米";
        brand3.imgKey = "53AA8C093E164059D432971EA2F9C1DD.jpg";
        brand3.createTime = "2016-4-26";

        var page = {total:3,pageCount:1};
        result.page = page;
        result.brand1 = brand1;
        result.brand2 = brand2;
        result.brand3 = brand3;
        res.json(result);
        logger.info("获取商家列表 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("get 商家 list error:" + ex);
        result.code = 500;
        result.desc = "获取商家列表列表失败";
        res.json(result);
    }
});

//关联品牌的品类
router.post('/relateSubject', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        var params = {};
        params.subjectIds = [3001,3002,3003];
        params.brandId = arg.brandId || 1;

        logger.info("获取商家列表请求， arg:" + JSON.stringify(params));

        res.json(result);
        logger.info("获取商家列表 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("get 商家 list error:" + ex);
        result.code = 500;
        result.desc = "获取商家列表列表失败";
        res.json(result);
    }
});

module.exports = router;