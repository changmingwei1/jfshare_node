var express = require('express');
var router = express.Router();
var view_index = require('../view_center/index/view_index');
var sessionUtil = require('../lib/utils/SessionUtil');

/* GET home page. */
router.get('/', function(req, res, next) {
  sessionUtil.isOnline(req, function(rCheck){
    if(rCheck){
      console.log("+++++++++++++++++++++session信息有效++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      res.redirect("/product");
    }else{
      console.log("+++++++++++++++++++++session信息不存在或已失效++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      view_index.signin(req, res, next, null);
    }
  });
});

router.get('/test', function(req, res, next){
  res.render('product/test',{title: 'Express',num:1000000000});
});



module.exports = router;
