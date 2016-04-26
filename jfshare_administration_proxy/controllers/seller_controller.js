/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');

// 添加商家
router.post('/add', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        var params = {};
        params.companyName = arg.companyName || "新媒传信";
        params.loginName = arg.loginName || "卖家测试1号";
        params.userName = arg.userName || "测试昵称";
        params.pwdEnc = arg.pwdEnc || "123456";
        params.mobile = arg.mobile || "13558731840";
        params.contacts = arg.contacts || "张三";
        params.tel = arg.tel || "010-88888888";
        params.email = arg.email || "123456@qq.com";
        params.provinceId = arg.provinceId || "110000";
        params.cityId = arg.cityId || "110100";
        params.countyId = arg.countyId || "110102";
        params.provinceName = arg.provinceName || "北京市";
        params.cityName = arg.cityName || "北京市";
        params.countyName = arg.countyName || "";
        params.address = arg.address || "地址啦";
        params.remark = arg.remark || "备注信息";
        params.bank = arg.bank || "中国人民银行";
        params.account = arg.account || "10000000000000000";
        params.accountName = arg.accountName || "李四";

        logger.info("新增系统消息请求， params:" + JSON.stringify(params));


        res.json(result);
        logger.info("add address response:" + JSON.stringify(result));
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "添加系统消息失败";
        res.json(result);
    }
});

// 获取商家信息
router.post('/get', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        var sellerId = arg.sellerId || 1;
        logger.info("获取系统消息请求， arg:" + JSON.stringify("sellerId:" + sellerId));

        var seller = {};
        seller.companyName = "新媒传信";
        seller.loginName = "卖家测试1号";
        seller.userName = "测试昵称";
        seller.pwdEnc = "123456";
        seller.mobile = "13558731840";
        seller.contacts = "张三";
        seller.tel = "010-88888888";
        seller.email = "123456@qq.com";
        seller.provinceId = "110000";
        seller.cityId = "110100";
        seller.countyId = "110102";
        seller.provinceName = "北京市";
        seller.cityName = "北京市";
        seller.countyName = "";
        seller.address = "地址啦";
        seller.remark = "备注信息";
        seller.bank = "中国人民银行";
        seller.account = "10000000000000000";
        seller.accountName = "李四";
        result.seller = seller;
        res.json(result);
        logger.info("获取系统消息 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("获取系统消息 error:" + ex);
        result.code = 500;
        result.desc = "获取系统消息失败";
        res.json(result);
    }
});

// 修改商家密码
router.post('/editpwd', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        var params = {};
        params.sellerId = arg.sellerId || 1;
        params.pwdEnc = arg.pwdEnc || "654321";

        logger.info("修改密码请求， params:" + JSON.stringify(params));

        res.json(result);
        logger.info("修改密码 response:" + JSON.stringify(result));
    } catch (ex) {
        logger.error("修改密码 error:" + ex);
        result.code = 500;
        result.desc = "修改密码失败";
        res.json(result);
    }
});

// 修改商家信息
router.post('/update', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        var params = {};
        params.companyName = arg.companyName || "新媒传信";
        params.loginName = arg.loginName || "卖家测试1号";
        params.userName = arg.userName || "测试昵称";
        params.pwdEnc = arg.pwdEnc || "123456";
        params.mobile = arg.mobile || "13558731840";
        params.contacts = arg.contacts || "张三";
        params.tel = arg.tel || "010-88888888";
        params.email = arg.email || "123456@qq.com";
        params.provinceId = arg.provinceId || "110000";
        params.cityId = arg.cityId || "110100";
        params.countyId = arg.countyId || "110102";
        params.provinceName = arg.provinceName || "北京市";
        params.cityName = arg.cityName || "北京市";
        params.countyName = arg.countyName || "";
        params.address = arg.address || "地址啦";
        params.remark = arg.remark || "备注信息";
        params.bank = arg.bank || "中国人民银行";
        params.account = arg.account || "10000000000000000";
        params.accountName = arg.accountName || "李四";

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

//商家列表
router.post('/list', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        var params = {};
        params.userName = arg.userName || "%测试%";
        params.loginName = arg.loginName || "%卖家%";
        params.perCount = arg.perCount || 20;
        params.curPage = arg.curPage || 1;

        logger.info("获取商家列表请求， arg:" + JSON.stringify(params));
        var seller1 = {};
        seller1.sellerId = 1;
        seller1.loginName = "卖家测试1号";
        seller1.userName = "测试昵称";
        seller1.mobile = "13558731840";
        seller1.contacts = "张三";
        seller1.email = "123456@qq.com";
        var seller2 = {};
        seller2.sellerId = 2;
        seller2.loginName = "卖家测试1号";
        seller2.userName = "测试昵称";
        seller2.mobile = "13558731840";
        seller2.contacts = "张三";
        seller2.email = "123456@qq.com";
        var seller3 = {};
        seller3.sellerId = 3;
        seller3.loginName = "卖家测试1号";
        seller3.userName = "测试昵称";
        seller3.mobile = "13558731840";
        seller3.contacts = "张三";
        seller3.email = "123456@qq.com";

        var page = {total:3,pageCount:1};
        result.page = page;
        result.seller1 = seller1;
        result.seller2 = seller2;
        result.seller3 = seller3;
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