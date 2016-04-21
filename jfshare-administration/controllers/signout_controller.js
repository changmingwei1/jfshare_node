//引入所需模块
var express = require('express');
var router = express.Router();
var sessionUtil = require('../lib/utils/SessionUtil');
var view_index = require('../view_center/index/view_index');

router.get('/', function(req, res, next) {
    sessionUtil.removeCookie(res);
    res.redirect("/signin");
});


//暴露模块
module.exports = router;
