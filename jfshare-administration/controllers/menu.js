var express = require('express');
var path = require('path');
var router = express.Router();

var rf=require("fs");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('product/productList',{text:'productlist'});
});

router.get('/data', function(req, res, next) {
  console.log('text------1111111111111111111111');

  var data=rf.readFileSync(path.join(__dirname, 'tree_data1.json'),"utf-8");
  var json = JSON.parse(data);
  console.log('text------'+json);
  res.json(json);
});
module.exports = router;
