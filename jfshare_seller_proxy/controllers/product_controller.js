/**
 * Created by zhaoshenghai on 16/3/21.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var detailStock = require('../lib/models/detail_stock');
var pagination_types = require('../lib/thrift/gen_code/pagination_types');

var product_types = require("../lib/thrift/gen_code/product_types");

//商品列表
router.post('/list', function (request, response, next) {
    logger.info("进入获取商品列表接口");
    var result = {code: 200};

    try {
        // var params = request.query;
        var params = request.body;
        logger.info("get product list args:" + JSON.stringify(params));

        var percount = params.percount || 20;
        var curpage = params.curpage || 1;


        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        //静态数据，设置分页
        result.page = {total: 100, pageCount: 5};

        //商品列表

        var productList = [];

        var product = {};

        product.productId = "ze160120140359000104";
        product.productName = "韩国现代（Hyundai）酸奶机HYSZ-5302";
        product.subjectName = "家具生活,生活日用,酸奶机";

        product.curPrice = "200";
        product.orgPrice = "250";
        product.activeStock = "100"; //创建成功
        product.storeValue = 1000;
        product.createTime = "2015-06-07";
        product.imgUrl = "530A5A4577179F1068981FB10BD09BB5.jpg,530A5A4577179F1068981FB10BD09BB5.jpg,530A5A4577179F1068981FB10BD09BB5.jpg";
        productList.push(product);


        var product1 = {};
        product1.productId = "ze160120162205000328";
        product1.productName = "哆啦A梦 炫酷伞折叠包套装 DM-4522";
        product1.subjectName = "家具生活,生活日用,伞";

        product1.curPrice = "100";
        product1.orgPrice = "150";
        product1.activeStock = "200"; //审核中
        product1.storeValue = 1000;
        product1.createTime = "2015-06-07";
        product1.imgUrl = "7E2D8E99229FB372F8A9FE609B3350CF.jpg,3CBC93724AF7B26328508DE9F32F68F7.jpg,EB016A0A49D59E8C23ADB2D358E53D51.jpg,E0E865C6BFCD68A36D8CBA65DDAB784A.jpg,AD12C9CBBE0E4916B26CC47F3A270C7F.jpg";
        productList.push(product1);

        var product2 = {};
        product2.productId = "ze160120162205000327";
        product2.productName = "点卡 梦幻西游 49块";
        product2.subjectName = "虚拟商品,游戏,点券";

        product2.curPrice = "49";
        product2.orgPrice = "50";
        product2.activeStock = "300"; //销售中
        product2.storeValue = 1000;
        product2.createTime = "2015-06-07";
        product2.imgUrl = "7E2D8E99229FB372F8A9FE609B3350CF.jpg,3CBC93724AF7B26328508DE9F32F68F7.jpg,EB016A0A49D59E8C23ADB2D358E53D51.jpg,E0E865C6BFCD68A36D8CBA65DDAB784A.jpg,AD12C9CBBE0E4916B26CC47F3A270C7F.jpg";
        productList.push(product2);

        productList.push(product);
        productList.push(product1);
        result.productList = productList;

        response.json(result);
        return;
        //Product.queryProductList(arg, function(data){
        //    var dataArr = [];
        //
        //    var code = data[0].result.code;
        //    if(code == 1){
        //        result.code = 500;
        //        result.desc = "失败";
        //        response.json(result);
        //    } else {
        //        var productSurveyList = data[0].productSurveyList;
        //        productSurveyList.forEach(function(a){
        //            var imgUri = a.imgUrl.split(",")[0];
        //            dataArr.push({productId: a.productId, productName: a.productName, curPrice: a.curPrice /100, imgUrl: imgUri});
        //        });
        //
        //        var pagination = data[0].pagination;
        //        result.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};
        //        result.productList = dataArr;
        //        response.json(result);
        //        logger.info("get product list response:" + JSON.stringify(result));
        //    }


        //});
    } catch (ex) {
        logger.error("获取商品列表失败:" + ex);
        result.code = 500;
        result.desc = "获取商品列表失败";
        response.json(result);
    }
});

//
router.post('/creat', function (request, response, next) {

    var result = {code: 200};

    response.json(result);

    //logger.info("进入获取商品详情接口");
    //var result = {code: 200};
    //
    //try{
    //    var productInfo = {};
    //
    //   // var params = request.query;
    //    var params = request.body;
    //    logger.info("creat product list args:" + JSON.stringify(params));
    //
    //    //参数验证
    //    if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){
    //
    //        result.code = 500;
    //        result.desc = "请求参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    //参数验证
    //    if(params.brandId == null || params.brandId == "" ||params.brandId <= 0){
    //
    //        result.code = 500;
    //        result.desc = "请求参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    //参数验证
    //    if(params.subjectId == null || params.subjectId == "" ||params.subjectId <= 0){
    //
    //        result.code = 500;
    //        result.desc = "请求参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    //参数验证
    //    if(params.productName == null || params.productName == "" ){
    //
    //        result.code = 500;
    //        result.desc = "请求参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    //参数验证
    //    if(params.viceName == null || params.viceName == "" ){
    //
    //        result.code = 500;
    //        result.desc = "请求参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    Product.create(params,function(err,data){
    //        if(err){
    //            response.json(err);
    //        }else{
    //            logger.info("响应的结果:" + JSON.stringify(resContent));
    //        }
    //    });
    //    response.json(result);

    //}catch(ex) {
    //    logger.error("create product  error:" + ex);
    //    result.code = 500;
    //    result.desc = "创建商品失败";
    //    response.json(result);
    //}
});

//获取商品信息，进行编辑
router.post('/get', function (request, response, next) {

    logger.info("进入编辑商品接口");
    var result = {code: 200};
    // var params = request.query;
    var params = request.body;
    //参数验证
    if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

        result.code = 500;
        result.desc = "请求参数错误";
        response.json(result);
        return;
    }

    //参数验证
    if (params.productId == null || params.productId == "" || params.productId <= 0) {

        result.code = 500;
        result.desc = "请求参数错误";
        response.json(result);
        return;
    }


    try {

        var arg = request.query;

        logger.info("编辑商品接口参数:" + JSON.stringify(arg));


        var product = {};


        product.sellerId = 5;
        product.productId = "ze160105143450000070";
        product.subjectId = 3002;
        product.brandId = 25;
        product.productName = "韩国现代（Hyundai）酸奶机HYSZ-5302";
        product.viceName = "PTC低功率循环加热结构设计 温度控制精准";
        product.oriprice = 100;
        product.postageId = 1;
        product.img_key = "23DC861A6CB8BF286C955DEE5FB16913.jpg,63A6F2BA63706A0CB1660947F0BE514E.jpg,2F6EF419A33D8038036A16A229DC46EE.jpg,1FC9670B5463C5588A1FFB30C9EB05CA.jpg,21E6934156C63EDAEDE922B8E8CC5DBF.jpg";
        product.weight = 100;
        product.volume = 100;
        product.type = 2;
        product.detailkey = "";

        var sku = {
            "sku": [{
                "key": {"id": 1, "value": "不叫颜色可否"},
                "values": [{
                    "id": 1,
                    "value": "军绿色",
                    "image": "40923A2995EA7A154A02C3C0D210F1BA.jpg",
                    "isReplace": "0"
                }, {
                    "id": "6",
                    "value": "浅绿色",
                    "image": "B37CC07E0E8EBB7E5E805204FBA22824.jpg",
                    "isReplace": "0"
                }, {"id": "11", "value": "深蓝色", "image": "CC94147A0A54810BF8380D47DF9E6FC7.jpg", "isReplace": "0"}]
            }, {
                "key": {"id": "100", "value": "自定义规格"},
                "values": [{"id": "101", "value": "女神"}, {"id": "102", "value": "男神"}]
            }]
        };

        product.skuTemplate = sku;


        var attribute = [{"id": "1", "name": "产地", "value": ""}, {"id": "2", "name": "寿命", "value": ""}, {
            "id": "3",
            "name": "型号",
            "value": ""
        }];

        product.attribute = attribute;

        var storeinfo = {
            "store": [
                {
                    "key": {
                        "id": "1-11:100-101"
                    },
                    "values": [
                        {
                            "storeid": "1",
                            "oriprice": "100",
                            "sellprice": "200",
                            "setprice": "150",
                            "location": "",
                            "num": "",
                            "storecount": "190",
                            "limitcount": "12"
                        },
                        {
                            "storeid": "2",
                            "oriprice": "110",
                            "sellprice": "210",
                            "setprice": "160",
                            "location": "",
                            "num": "",
                            "storecount": "200",
                            "limitcount": "12"
                        }
                    ]
                },
                {
                    "key": {
                        "id": "1-11:100-102"
                    },
                    "values": [
                        {
                            "storeid": "1",
                            "oriprice": "100",
                            "sellprice": "200",
                            "setprice": "150",
                            "location": "",
                            "num": "",
                            "storecount": "190",
                            "limitcount": "12"
                        },
                        {
                            "storeid": "2",
                            "oriprice": "110",
                            "sellprice": "210",
                            "setprice": "160",
                            "location": "",
                            "num": "",
                            "storecount": "200",
                            "limitcount": "12"
                        }
                    ]
                },
                {
                    "key": {
                        "id": "1-1:100-101"
                    },
                    "values": [
                        {
                            "storeid": "1",
                            "oriprice": "100",
                            "sellprice": "200",
                            "setprice": "150",
                            "location": "",
                            "num": "",
                            "storecount": "190",
                            "limitcount": "12"
                        },
                        {
                            "storeid": "2",
                            "oriprice": "110",
                            "sellprice": "210",
                            "setprice": "160",
                            "location": "",
                            "num": "",
                            "storecount": "200",
                            "limitcount": "12"
                        }
                    ]
                },
                {
                    "key": {
                        "id": "1-1:100-102"
                    },
                    "values": [
                        {
                            "storeid": "1",
                            "oriprice": "100",
                            "sellprice": "200",
                            "setprice": "150",
                            "location": "",
                            "num": "",
                            "storecount": "190",
                            "limitcount": "12"
                        },
                        {
                            "storeid": "2",
                            "oriprice": "110",
                            "sellprice": "210",
                            "setprice": "160",
                            "location": "",
                            "num": "",
                            "storecount": "200",
                            "limitcount": "12"
                        }
                    ]
                },
                {
                    "key": {
                        "id": "1-6:100-101"
                    },
                    "values": [
                        {
                            "storeid": "1",
                            "oriprice": "100",
                            "sellprice": "200",
                            "setprice": "150",
                            "location": "",
                            "num": "",
                            "storecount": "190",
                            "limitcount": "12"
                        },
                        {
                            "storeid": "2",
                            "oriprice": "110",
                            "sellprice": "210",
                            "setprice": "160",
                            "location": "",
                            "num": "",
                            "storecount": "200",
                            "limitcount": "12"
                        }
                    ]
                },
                {
                    "key": {
                        "id": "1-6:100-102"
                    },
                    "values": [
                        {
                            "storeid": "1",
                            "oriprice": "100",
                            "sellprice": "200",
                            "setprice": "150",
                            "location": "",
                            "num": "",
                            "storecount": "190",
                            "limitcount": "12"
                        },
                        {
                            "storeid": "2",
                            "oriprice": "110",
                            "sellprice": "210",
                            "setprice": "160",
                            "location": "",
                            "num": "",
                            "storecount": "200",
                            "limitcount": "12"
                        }
                    ]
                }
            ]
        };


        product.storeinfo = storeinfo;
        result.product = product;
        response.json(result);
    } catch (ex) {
        logger.error("查询失败，原因是:" + ex);
        result.code = 500;
        result.desc = "查询商品详情失败";
        response.json(result);
    }
});

router.post('/update', function (request, response, next) {
    var result = {code:200};
    response.json(result);
    //logger.info("进入更新商品接口");
    //var result = {code: 200};
    //
    //try {
    //    var params = request.body;
    //
    //    //参数验证
    //    if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {
    //
    //        result.code = 500;
    //        result.desc = "请求参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    //参数验证
    //    if (params.brandId == null || params.brandId == "" || params.brandId <= 0) {
    //
    //        result.code = 500;
    //        result.desc = "请求参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    //参数验证
    //    if (params.subjectId == null || params.subjectId == "" || params.subjectId <= 0) {
    //
    //        result.code = 500;
    //        result.desc = "请求参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    //参数验证
    //    if (params.productName == null || params.productName == "") {
    //
    //        result.code = 500;
    //        result.desc = "请求参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    //参数验证
    //    if (params.viceName == null || params.viceName == "") {
    //
    //        result.code = 500;
    //        result.desc = "请求参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //
    //    logger.info("update product  args:" + JSON.stringify(params));
    //    response.json(result);
    //} catch (ex) {
    //    logger.error("update product error:" + ex);
    //    result.code = 500;
    //    result.desc = "更新商品失败";
    //    response.json(result);
    //}
});


router.post('/virtualList', function (request, response, next) {

    logger.info("进入虚拟商品列表接口");
    var result = {code: 200};

    try {
        //var params = request.query;
        var params = request.body;
        logger.info("虚拟商品列表:" + params);

        //参数校验
        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        //静态数据，设置分页
        result.page = {total: 100, pageCount: 5};

        //商品列表

        var productList = [];

        var product = {};

        product.productId = "1";

        product.productname = "电影票",//商品名称
            product.skuid = "12-11-2"// sku id
        product.count = 1000; //总数量
        product.alreadysend = 100//已经发送数量
        product.restcount = 900//未发放的数量
        product.importtime = "2016-07-08 18:06:12"   //导入时间

        productList.push(product);
        var product1 = {};
        product1.productId = "2";

        product1.productname = "点卡",//商品名称
            product1.skuid = "10-11-2"// sku id
        product1.count = 1000; //总数量
        product1.alreadysend = 300//已经发送数量
        product1.restcount = 700//未发放的数量
        product1.importtime = "2016-06-12 12:02:11";  //导入时间

        productList.push(product1);
        productList.push(product);
        productList.push(product1);
        result.productList = productList;
        response.json(result);

    } catch (ex) {
        logger.error("get  virtual product List error:" + ex);
        result.code = 500;
        result.desc = "获取虚拟商品列表";
        res.json(result);
    }
});

router.post('/ticketList', function (request, response, next) {

    logger.info("进入虚拟券码列表列表接口");
    var result = {code: 200};

    try {
        // var params = request.query;
        var params = request.body;
        //var params = request.body;
        logger.info("虚拟券码列表:" + params);

        //参数校验
        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.productId == null || params.productId == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.skuid == null || params.skuid == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        //静态数据，设置分页
        result.page = {total: 100, pageCount: 5};

        //商品列表

        var productList = [];

        var product = {};

        product.id = 1;

        product.password = "123***12";

        product.state = 1;

        var product1 = {};

        product1.id = 2;

        product1.password = "234***12";

        product1.state = 2;

        var product2 = {};

        product2.id = 2;

        product2.password = "234***17";

        product2.state = 3;

        productList.push(product);
        productList.push(product1);
        productList.push(product2);

        result.productList = productList;
        response.json(result);

    } catch (ex) {
        logger.error("get  ticketList error:" + ex);
        result.code = 500;
        result.desc = "获取券码列表";
        res.json(result);
    }
});

router.post('/apply', function (request, response, next) {

    logger.info("进入商品上架下架列表接口");
    var result = {code: 200};

    try {
        // var params = request.query;
        var params = request.body;
        //var params = request.body;
        logger.info("商品上架下架:" + params);

        //参数校验
        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.productId == null || params.productId == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.state == null || params.state == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        response.json(result);

    } catch (ex) {
        logger.error("apply state error:" + ex);
        result.code = 500;
        result.desc = "上架下架失败";
        res.json(result);
    }
});
router.post('/improtTicket', function (request, response, next) {

    logger.info("进入导入券码接口");
    var result = {code: 200};

    try {
        // var params = request.query;
        var params = request.body;
        //var params = request.body;
        logger.info("商品上架下架:" + params);

        //参数校验
        //参数验证
        if (params.sellerId == null || params.sellerId == "" || params.sellerId <= 0) {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.bytes == null || params.bytes == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }


        response.json(result);

    } catch (ex) {
        logger.error("import  ticketList error:" + ex);
        result.code = 500;
        result.desc = "导入券码列表失败";
        res.json(result);
    }
});


//获取物流信息
router.get('/query', function (req, res, next) {
    var result = {code: 200};
    try {
        var arg = req.query;
        logger.info("物流参数:" + JSON.stringify(arg));

        if (arg == null || arg.orderId == null) {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        Product.expressQuery(arg.orderId, function (err, expressData) {

            var traceItem = [];
            if (err) {
                res.json(err);
                return;
            }
            if (expressData !== null) {
                var expressInfo = expressData[0].expressInfo;
                var expressTrace = expressData[0].expressTrace;


                result.expressInfo = {
                    id: expressInfo.id,
                    name: expressInfo.name,
                    queryUrl: expressInfo.queryUrl,
                    status: expressInfo.status,
                    comment: expressInfo.comment,
                    createTime: expressInfo.createTime,
                    createUserId: expressInfo.createUserId,
                    lastUpdateTime: expressInfo.lastUpdateTime,
                    lastUpdateUserId: expressInfo.lastUpdateUserId,
                    kuaidiKey: expressInfo.kuaidiKey,
                    nameRule: expressInfo.nameRule,
                    grabState: expressInfo.grabState
                };

                var traceItemsList = expressTrace.traceItems;
                traceItemsList.forEach(function (a) {
                    traceItem.push({time: a.time, context: a.context, ftime: a.ftime});
                });
                result.expressTrace = {
                    state: expressTrace.state,
                    nu: expressTrace.nu,
                    status: expressTrace.status,
                    orderId: expressTrace.orderId,
                    traceItems: traceItem
                };

            } else {
                result.code = 500;
                result.desc = "获取物流失败";
            }
            res.json(result);
            logger.info("获取物流结果" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("获取物流:" + ex);
        result.code = 500;
        result.desc = "获取物流失败";
        res.json(result);
    }
});
module.exports = router;