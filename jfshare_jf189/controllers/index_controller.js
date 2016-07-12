//引入所需模块
var express = require('express');
var router = express.Router();

var logger = require('../lib/util/log4node').configlog4node.servLog4js();

router.get('/', function(req, res, next) {
    res.render("index/index",res.resData);
});

//暴露模块
module.exports = router;
