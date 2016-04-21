//引入所需模块
var express = require('express');
var router = express.Router();
var path = require('util');

var productOptModel = require("../lib/models/productOpt");
/****************log4js***********************************/
var log4node = require('../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);


/* ajax设置商品状态 */
router.post('/queryProductOptRecords', function(req, res, next) {
  var productId = req.body["productId"]||"";
  console.log('productId--->'+ productId);

  new productOptModel().list({productId:productId}, function(err, data){
    if(err) {
      //调用失败
      res.json(err);
    } else {
      data["code"] = 0;
      res.json(data)
    }
  });
});

//暴露模块
module.exports = router;


