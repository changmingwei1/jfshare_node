//引入所需模块
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//暴露模块
module.exports = router;
