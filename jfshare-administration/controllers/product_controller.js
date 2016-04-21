//引入所需模块
var express = require('express');
var router = express.Router();
var path = require('util');
var view = require('../view_center/product/view_product');

var productModel = require('../lib/models/product');

/**********************thrift config*************************************/
var Lich = require('../lib/thrift/Lich.js');
var pagination_types=require("../lib/thrift/gen_code/pagination_types");
var product_types=require("../lib/thrift/gen_code/product_types");
var thrift = require('thrift');

/****************log4js***********************************/
var log4node = require('../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

router.get('/', function(req, res, next) {
  res.redirect("/product/reviewList");
});

/* 列表请求跳转 只负责画出页面，table中无内容*/
router.get('/reviewList', function( req, res, next) {
  var result = {titleStr:"商品审核列表"};
  view.list(req, res, next, result);

});

router.post('/list', function(req, res, next) {


  //var sellerId = '1000';
  //console.log("此时的sellerId：" + sellerId);

  //获取请求中的参数，一些查询条件，顺序等
  var parameters = {};
  parameters.currentPage = req.body.currentPage || "1" ;
  parameters.productName =  req.body.productName || "" ;
  parameters.productId =  req.body.productId || "" ;
  parameters.productNum =  req.body.productNum || "" ;
  parameters.productStatus =  req.body.productStatus || "" ;

  //组织thrift参数，调用thrift接口
  var param_page = new pagination_types.Pagination ({
    currentPage:parameters.currentPage,
    numPerPage:10
  });

  var param = new product_types.ProductSurveyQueryParam ({
    //sellerId:-1,
    productName:parameters.productName,
    productId:parameters.productId,
    activeState:parameters.productStatus,
    pagination:param_page
  });

  var productServ_productSurveyQuery = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "productSurveyBackendQuery", param);

  var result = '{"result":{"code":1}}';
  // 调用 productServ_productSurveyQuery
  Lich.wicca.invokeClient(productServ_productSurveyQuery, function (err, data) {
    if (err) {
      log.error("调用ProductServer 服务失败  失败原因 ======" + err);
      // res.json({data:{"result":{"code":1}}});
    }
    log.info("调用productServ_productSurveyQuery() 成功  result=" + JSON.stringify(data));
    //res.json(data[0]);
    result = data[0];

    //转换数据
    if(typeof(result.productSurveyList) != "undefined"){
      //转换输出数据
      for(var i=0;i<result.productSurveyList.length;i++){
        //console.log(result.productSurveyList[i]['imgUrl']);
        var firstImgUrl = result.productSurveyList[i]['imgUrl'].split(",")[0];
        if(firstImgUrl){
          result.productSurveyList[i]['imgUrl'] = firstImgUrl.replace(".", "_100x100.");
        }
      }
    }
    res.json(result);
  });
});

/* ajax设置商品状态 */
router.post('/setProductState', function(req, res, next) {

  new productModel().setProductState(req.body, function(err, data){
    if(err) {
      //调用失败
      res.json('');
    } else {
      console.log('保存，返回结果：'+data);
      data["code"] = 0;
      res.json(data)
    }
  });
});


//暴露模块
module.exports = router;


