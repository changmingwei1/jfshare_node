//引入所需模块
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render("active/view_active",res.resData);
});

//暴露模块
module.exports = router;
