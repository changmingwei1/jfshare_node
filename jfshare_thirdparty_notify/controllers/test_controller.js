/**
 * Created by L on 2015/10/24 0024.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js("record");

//模拟提交后端支付通知
router.get('/test/jf189', function(req, res, next) {
    var paramters = {};

    res.render("test/jf189", paramters);
});

//模拟提交后端支付通知
router.get('/render', function(req, res, next) {
    logger.trace("test for trace");
    logger.info("test for info");
    logger.error("test for error");
    console.log("test for console.log");
    res.end("test page :" + new Date());
});

//暴露模块
module.exports = router;
