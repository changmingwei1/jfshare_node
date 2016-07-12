var express = require('express');
var router = express.Router();
var logger = require('../lib/util/log4node').configlog4node.servLog4js();

router.get('/session', function(req, res, next) {
    logger.trace("test for trace");
    logger.info("test for info");
    logger.error("test for error");
    console.log("test for console.log");
    var sid = req.sessionID
    req.session.regenerate(function(){
        //重新生成session之后后续的处理
        res.end(JSON.stringify("old:" + sid + ", new:"+req.sessionID));
    })
});

module.exports = router;
