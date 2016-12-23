//引入所需模块
var express = require('express');
var router = express.Router();

var view_active = require('../view_center/active/view_active');
router.get('/actives', function(req, res, next) {
    view_active.baoyou(req, res, next);
});
router.get('/christmas', function(req, res, next) {
    view_active.christmas(req, res, next);
});

//暴露模块
module.exports = router;
