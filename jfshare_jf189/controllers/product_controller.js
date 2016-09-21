//引入所需模块
var express = require('express');
var router = express.Router();
var view = require('../view_center/product/view_product');

var product_types = require("../lib/thrift/gen_code/product_types");
var stock_types = require("../lib/thrift/gen_code/stock_types");
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');

var logger = require('../lib/util/log4node').configlog4node.servLog4js();
var paramValid = require('../lib/models/pub/param_valid');
var detailStock = require('../lib/models/product/detail_stock');

router.get('/render/:productId', function(req, res, next) {
  var productId =  req.params["productId"] || "" ;
  if(productId) {
    res.resData.renderUrl = "/product/"+productId+"?ssid="+req.query.ssid+ "&provinceId=" + 110000 + "&storehouseId=-1";
    //res.render("index/render", res.resData)
    return;
  }
  next();
});

//get product baseinfo
router.get('/baseinfo/:productId', function(req, res, next) {
  var paramters = {};
  paramters.productId =  req.params["productId"] || "" ;
  logger.info("商品[基本]信息, productId=" + paramters.productId);
  if (!paramValid.productIdValid(paramters.productId)) {
    logger.warn("商品id有误, productId=" + paramters.productId);
    res.json("非法参数请求！");
    return;
  }
  var param = new product_types.ProductRetParam({
    baseTag:1,
    skuTemplateTag:1,
    skuTag:0,
    attributeTag:1
  });
  // 获取client
  var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProduct", [paramters.productId, param]);
  // 调用 productServ
  Lich.wicca.invokeClient(productServ, function (err, data) {
    if(err || data[0].result.code == "1"){
      logger.error("调用productServ-queryProduct查询商品信息失败  失败原因 ======" + err);
      res.json(data[0].result);
      return;
    }
    logger.info("调用productServ-queryProduct查询商品信息成功  result.code =  （" +data[0].result.code+"）  1为失败 0为成功");
    res.json(data[0].product);
    //logger.info("接口返回数据=====" + JSON.stringify(data[0].product));
  });
});

//get product skuinfo
router.get('/skuinfo/:productId/:storehouseId', function(req, res, next) {
  var paramters = {};
  paramters.productId =  req.params["productId"] || "" ;
  paramters.storehouseId =  Number(req.params["storehouseId"]) || 1 ;
  logger.info("商品[sku]信息, productId=" + paramters.productId);
  var ret = {};
  if (!paramValid.productIdValid(paramters.productId)) {
    logger.warn("商品id有误, productId=" + paramters.productId);
    ret.status = 500;
    ret.msg = "非法参数请求！";
    res.json(ret);
    return;
  }
  // 获取client
  var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProductSku", paramters.productId);
  // 调用 productServ
  Lich.wicca.invokeClient(productServ, function (err, data) {
    if(err || data[0].result.code == "1"){
      logger.error("调用productServ-queryProductSku查询商品sku失败  失败原因 ======" + err);
      ret.status = 500;
      ret.msg = "获取商品sku信息失败！";
      res.json(ret);
      return;
    }
    logger.info("调用productServ-queryProductSku查询商品sku成功  result.code =  （" +data[0].result.code+"）  1为失败 0为成功");
    //res.json(data[0].productSku);
    //logger.info("接口返回数据=====" + data[0].productSku.curPrice);
    var detailStockIns = new detailStock();
    var time1 = new Date().getTime();
    detailStockIns.parseProductSku(data[0].productSku, paramters.storehouseId);
    var time2 = new Date().getTime();
    console.log(" init sku structure time: "  + (time2 - time1) + " ms");
    //console.log(" parseProductSku param data[0].productSku: "  + JSON.stringify(data[0].productSku));
    //console.log(" parseProductSku ger dimstocks--stockTotal--minCurPrice: "  + detailStockIns.dimstocks["stockTotal"].minCurPrice);
    //res.json(detailStockIns.dimstocks);

    //获取库存信息
    if (!paramValid.empty(req.query.activeState) && req.query.activeState=="true") {
      try {
          var thrift_stock_param = new stock_types.QueryParam({productId:paramters.productId})
          // 获取client
          var stockServ = new Lich.InvokeBag(Lich.ServiceKey.StockServer, "queryStock", thrift_stock_param);
          // 调用 stockServ
          Lich.wicca.invokeClient(stockServ, function (err, data) {
            if(err || data[0].result.code == "1"){
              logger.error("调用stockServ-getStock查询商品stock失败  失败原因 ======" + err);
              ret.status = 501;
              ret.msg = "获取商品库存信息失败！";
              ret.dimstocks = detailStockIns.dimstocks;
              res.json(ret);
              return;
            }
            logger.info("调用stockServ-getStock查询商品stock成功  result.code =  （" +data[0].result.code+"）  1为失败 0为成功");
            //res.json(data[0].stockInfo);
            //logger.info("接口返回数据=====" + data[0].productSku.curPrice);
            if (!paramValid.empty((data[0].stockInfo))) {
              var time1 = new Date().getTime();
              detailStockIns.fillStockSku(data[0].stockInfo, paramters.storehouseId);
              var time2 = new Date().getTime();
              console.log(" init sku stock fields time: " + (time2 - time1) + " ms");
              detailStockIns.initSKU();
              var time3 = new Date().getTime();
              console.log(" init sku result map time: " + (time3 - time2) + " ms");
              ret.status = 200;
              ret.dimstocks = detailStockIns.dimstocks;
              ret.skuInfos = detailStockIns.skuInfos;
              res.json(ret);
            }
          });
      } catch (err) {
        logger.error("获取库存信息失败", err);
      }
    } else {
      ret.status = 200;
      ret.dimstocks = detailStockIns.dimstocks;
      ret.skuInfos = detailStockIns.skuInfos;
      logger.info("接口返回数据=====" + JSON.stringify(ret));
      res.json(ret);
    }
  });
});

//get product detailinfo
router.get('/detailinfo/:detailKey', function(req, res, next) {
  var paramters = {};
  paramters.detailKey =  req.params["detailKey"] || "" ;
  logger.info("商品[detail]信息, detailKey=" + paramters.detailKey);
  if (!paramValid.detailKeyValid(paramters.detailKey)) {
    logger.warn("商品detailKey有误, detailKey=" + paramters.detailKey);
    res.json("非法参数请求！");
    return;
  }

  var param = new product_types.ProductDetailParam({
    detailKey:paramters.detailKey
  });
  // 获取client
  var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProductDetail", param);
  // 调用 productServ
  Lich.wicca.invokeClient(productServ, function (err, data) {
    if(err || data[0].result.code == "1"){
      logger.error("调用productServ-queryProductDetail查询商品详情失败  失败原因 ======" + err);
      res.json(data[0].result);
      return;
    }
    logger.info("调用productServ-queryProductDetail查询商品详情成功  result.code =  （" +data[0].result.code+"）  1为失败 0为成功");

    res.json(data[0].value);
  });
});

/* 详情请求跳转 */
router.get('/:productId', function(req, res, next) {
  //1.param valid
  var paramters = {};
  paramters.productId =  req.params["productId"] || "" ;
  paramters.state = req.query["state"]; //浏览标识preview
  paramters.ssid = req.query.ssid;
  paramters.provinceId = req.query.provinceId;
  paramters.storehouseId = req.query.storehouseId;
  logger.info("商品详情[页面]信息, productId=" + paramters.productId);
  if (!paramValid.productIdValid(paramters.productId)) {
    logger.warn("商品id有误, productId=" + paramters.productId);
    res.json("非法参数请求！");
    return;
  }

  //2.render no data ui
  view.detail(req, res, next, paramters);
});

/**
 * 快照请求跳转
 */
router.get('/snapshot/:snapshotId', function(req, res, next) {
  //1.param valid
  var paramters = {};
  paramters.snapshotId =  req.params["snapshotId"] || "" ;
  logger.info("商品快照[页面]信息, snapshotId=" + paramters.snapshotId);
  if (!paramValid.productIdValid(paramters.snapshotId)) {
    logger.warn("商品快照id有误, productId=" + paramters.snapshotId);
    res.json("非法参数请求！");
    return;
  }

  //2.render no data ui
  view.detail(req, res, next, paramters);
});

//get product snapshot baseinfo
router.get('/snapshot/baseinfo/:snapshotId', function(req, res, next) {
  var paramters = {};
  paramters.snapshotId =  req.params["snapshotId"] || "" ;
  logger.info("商品快照[基本]信息, snapshotId=" + paramters.snapshotId);
  if (!paramValid.productIdValid(paramters.snapshotId)) {
    logger.warn("商品快照id有误, snapshotId=" + paramters.snapshotId);
    res.json("非法参数请求！");
    return;
  }
  var param = new product_types.ProductRetParam({
    baseTag:1,
    skuTemplateTag:1,
    skuTag:1,
    attributeTag:1
  });
  // 获取client
  var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "queryProductSnap", [paramters.snapshotId, param]);
  // 调用 productServ
  Lich.wicca.invokeClient(productServ, function (err, data) {
    if(err || data[0].result.code == "1"){
      logger.error("调用productServ-queryProductSnap查询商品快照信息失败  失败原因 ======" + err);
      res.json(data[0].result);
      return;
    }
    logger.info("调用productServ-queryProductSnap查询商品快照信息成功  result.code =  （" +data[0].result.code+"）  1为失败 0为成功");
    res.json(data[0].product);
    logger.info("接口返回数据=====" + data[0].product.productName);
  });
});

//get product snapshot skuinfo
router.get('/snapshot/skuinfo/:skus', function(req, res, next) {
  var paramters = {};
  paramters.skus =  req.params["skus"] || "" ;
  logger.info("商品快照[sku]信息, productId=" + paramters.skus);
  try {
      var skuList = JSON.parse(paramters.skus);
      var detailStockIns = new detailStock();
      var time1 = new Date().getTime();
      detailStockIns.parseProductSku(skuList);
      var time2 = new Date().getTime();
      console.log(" init sku structure time: "  + (time2 - time1) + " ms");
      res.json(detailStockIns.dimstocks);
  } catch (err) {
    res.json(null);
  }
});

//暴露模块
module.exports = router;


