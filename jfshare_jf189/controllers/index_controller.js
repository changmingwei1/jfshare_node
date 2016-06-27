//引入所需模块
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

router.get('/', function(req, res, next) {
    res.render("index/index",res.resData);
});

//暴露模块
module.exports = router;
