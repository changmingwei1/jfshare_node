var express = require('express');
var router = express.Router();
var sellerModel = require('../lib/models/seller');
/****************log4js***********************************/
var log4node = require('../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

/* GET seller info. */
router.get('/getSellerInfo', function(req, res, next) {
  new sellerModel().getSellerInfo(req.query, function(rdata){
      res.json(rdata);
  });
});

module.exports = router;
