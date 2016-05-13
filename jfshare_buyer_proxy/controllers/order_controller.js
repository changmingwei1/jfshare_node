/**
 * @author YinBo on 16/4/25.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Util = require('../lib/models/util');
var Order = require('../lib/models/order');
var Address = require('../lib/models/address');
var Seller = require('../lib/models/seller');
var Express = require('../lib/models/express');
var AfterSale = require('../lib/models/afterSale');

var product_types = require("../lib/thrift/gen_code/product_types");

// 订单预览页
router.get('/previewTest', function (req, res, next) {
    var result = {code: 200};
    try {
        var productRes = [];

        var arg = req.query;
        var paramters = arg.product;
        var length = paramters.length;

        arg.token = "鉴权信息1";
        arg.token = "鉴权信息2";

        //Address.getDefaultAddress(arg.userId, function (err, data) {
        //    if (err) {
        //        res.json(err);
        //        return;
        //    }
        //    var addressInfo = data[0].addressInfo;
        //    if (addressInfo != null) {
        //        result.userName = addressInfo.receiverName;
        //        result.mobile = addressInfo.mobile || "13013001340";
        //        var addressDes = addressInfo.provinceName + addressInfo.cityName + addressInfo.countyName + addressInfo.address;
        //        result.address = {addressId: addressInfo.id, addressInfo: addressDes};
        //    }
        var count = 0;
        paramters.forEach(function (param) {
            //查询商品指定sku
            Product.queryHotSKUV(param, function (err, productInfo) {
                if (err) {
                    res.json(err);
                    return;
                }
                var productItem = {
                    productId: productInfo.product.productId,
                    productName: productInfo.product.productName,
                    curPrice: productInfo.product.productSku.curPrice,
                    imgUrl: productInfo.product.imgKey.split(',')[0]
                };
                //查询sku的库存
                Product.getStockForSku(param, function (err, stockInfo) {
                    if (err) {
                        //res.json(err);
                        return;
                    }
                    var stock = stockInfo.stockInfo;
                    productItem.activeStock = stock.total - stock.lockTotal;
                    productRes.push(productItem);
                    logger.info("productRes:" + JSON.stringify(productRes));

                    if (count >= length - 1) {
                        result.product = productRes;
                        res.json(result);
                        logger.info("order preview response:" + JSON.stringify(result));
                    }
                    count = count + 1;
                });
            });
        });
        //});
    } catch (ex) {
        logger.error("produce preview error:" + ex);
        result.code = 500;
        result.desc = "获取用户信息及商品信息失败";
        res.json(result);
    }
});

// 提交订单请求
/*router.post('/submit', function(req, res, next) {
 var result = {code:200};

 try{
 var arg = req.body;
 logger.info("提交订单请求， arg:" + JSON.stringify(arg));

 if(arg == null || arg.userId == null || arg.deliverInfo == null ||
 arg.sellerDetailList == null ){
 result.code = 400;
 result.desc = "没有填写用户ＩＤ";
 res.json(result);
 return;
 }

 Order.orderConfirm(arg, function (err, orderIdList) {
 if(err){
 res.json(err);
 return;
 }
 result.orderIdList = orderIdList;
 res.json(result);
 });
 } catch(ex) {
 logger.error("submit order error:" + ex);
 result.code = 500;
 result.desc = "提交订单失败";
 res.json(result);
 }
 });*/

//购物车中点击立即结算  ---> 实物
router.post('/preview', function (request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var args = {};
        args.token = params.token || "鉴权信息1";
        args.ppInfo = params.ppInfo || "鉴权信息2";
        args.userId = params.userId || 2;
        args.sellerId = params.sellerId || 2;
        args.sellerName = params.sellerName || "测试卖家2号";
        args.pruduct = {
            productId: "ze160216170722000745",
            productName: "测试sku",
            skuNum: "1-16",
            skuName: "颜色-红色",
            count: 2,
            curPrice: "100",
            imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
        };
        args.totalSum = params.totalSum || 5;
        args.fromSource = params.fromSource || 1;
        args.id = params.id || 2;

        logger.info("query expressOrder params:" + JSON.stringify(args));

        result.deliverInfo = {
            id: 1,
            receiverName: "张先生",
            mobile: "1355871840",
            postCode: "100000",
            address: "（程先生收）  邮编：518000   手机号：18500000000"
        };
        result.pruduct = {
            productId: "ze160216170722000745",
            productName: "测试sku",
            skuNum: "1-16",
            skuName: "颜色-红色",
            count: 2,
            curPrice: "100",
            postage: "10",
            imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
        };

        response.json(result);
    } catch (ex) {
        response.json(result);
    }
});
//商品详情中点击立即购买  ---> 虚拟
router.post('/preview2', function (request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var args = {};
        args.token = params.token || "鉴权信息1";
        args.ppInfo = params.ppInfo || "鉴权信息2";
        args.userId = params.userId || 2;
        args.sellerId = params.sellerId || 3;
        args.sellerName = params.sellerName || "测试卖家3号";
        args.pruduct = {
            productId: "ze160216170722000745",
            productName: "博纳2D通兑票",
            skuNum: "1-16",
            skuName: "节假日通用",
            count: 2,
            curPrice: "100",
            imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
        };
        args.totalSum = params.totalSum || 5;
        args.fromSource = params.fromSource || 1;

        logger.info("query expressOrder params:" + JSON.stringify(args));

        result.pruduct = {
            productId: "ze160216170722000745",
            productName: "博纳2D通兑票",
            skuNum: "1-16",
            skuName: "节假日通用",
            count: 2,
            curPrice: "100",
            imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
        };

        response.json(result);
    } catch (ex) {
        response.json(result);
    }
});

//提交订单 --> 实物
/*router.post('/submit', function (request, response, next) {
    logger.info("进入实物提交订单流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var args = {};
        args.token = params.token || "鉴权信息1";
        args.ppInfo = params.ppInfo || "鉴权信息2";
        args.userId = params.userId || 2;

        params.deliverInfo = {
            id: 1,
            receiverName: "张先生",
            mobile: "1355871840",
            postCode: "100000",
            address: "（程先生收）  邮编：518000   手机号：18500000000"
        };

        var product1 = {
            productId: "ze160216170722000745",
            productName: "给力的中央空调",
            viceName: "冷暖 定速 立柜式 空调",
            skuNum: {
                skuNm: "1-1:100-101",
                skuName: "颜色-军绿色:功率-2匹"
            },
            count: 1,
            curPrice: "0.01",
            imgUrl: "6A413EEF9691774A9EED5E84D98A4A29.jpg",
            postage: 10
        };
        var product2 = {
            productId: "ze160216170722000746",
            productName: "给力的地方空调",
            viceName: "冷暖 不定速 立柜式 空调",
            skuNum: {
                skuNm: "1-1:100-102",
                skuName: "颜色-军绿色:功率-1匹"
            },
            count: 1,
            curPrice: "0.01",
            imgUrl: "6A413EEF9691774A9EED5E84D98A4A29.jpg",
            postage: 10
        };
        var product3 = {
            productId: "ze160216170722000746",
            productName: "给力的地方空调",
            viceName: "冷暖 不定速 立柜式 空调",
            skuNum: {
                skuNm: "1-1:100-102",
                skuName: "颜色-军绿色:功率-1匹"
            },
            count: 1,
            curPrice: "0.01",
            imgUrl: "6A413EEF9691774A9EED5E84D98A4A29.jpg",
            postage: 10
        };
        var productList1 = [product1, product2, product3];
        var productList2 = [product1, product2];
        var productList3 = [product1];
        var cartList1 = {
            sellerId: 1,
            sellerName: "聚分享品质商家",
            remark: "五一特惠，任意三件商品包邮",
            productList: productList1
        };
        var cartList2 = {
            sellerId: 2,
            sellerName: "聚分享品质商家",
            remark: "五一特惠，任意三件商品包邮",
            productList: productList2
        };
        var cartList3 = {
            sellerId: 3,
            sellerName: "聚分享黄钻商家",
            remark: "五一特惠，任意三件商品包邮",
            productList: productList3
        };
        params.cartList = [cartList1, cartList2, cartList3];

        args.cartList = params.cartList;
        args.deliverInfo = params.deliverInfo;
        args.buyerComment = params.buyerComment;
        logger.info(JSON.stringify(args));

        result.orderId = "13110057";

        response.json(result);
    } catch (ex) {
        response.json(result);
    }
});*/
//提交订单 --> 实物
router.post('/submit', function (request, response, next) {
    logger.info("进入实物提交订单流程");
    var result = {code: 200};
    try {
        var arg = request.body;
        logger.info("提交订单请求， arg:" + JSON.stringify(arg));

        if (arg == null || arg.userId == null || arg.addressDesc == null ||
            arg.sellerDetailList == null) {
            result.code = 400;
            result.desc = "没有填写用户ＩＤ";
            response.json(result);
            return;
        }

        /*
        * 1 根据省份，获取仓库信息storehouseId
        * 2 根据storehouseId，productId，skuNum查询库存接口【库存数量，锁定数量】
        *
        * */


        Order.orderConfirm(arg, function (err, orderIdList) {
            if (err) {
                response.json(err);
                return;
            }
            result.orderIdList = orderIdList;
            response.json(result);
        });
    } catch (ex) {
        logger.error("submit order error:" + ex);
        result.code = 500;
        result.desc = "提交订单失败";
        response.json(result);
    }
});
//提交订单 --> 虚拟
/*router.post('/submit', function (request, response, next) {
    logger.info("进入实物提交订单流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var args = {};
        args.token = params.token || "鉴权信息1";
        args.ppInfo = params.ppInfo || "鉴权信息2";
        args.userId = params.userId || 2;

        var product1 = {
            productId: "ze160216170722000745",
            productName: "博纳2D通兑票",
            skuNum: "1-16",
            skuName: "节假日通用",
            count: 2,
            curPrice: "100",
            imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
        };
        var product2 = {
            productId: "ze160216170722000745",
            productName: "博纳2D通兑票",
            skuNum: "1-16",
            skuName: "节假日通用",
            count: 2,
            curPrice: "100",
            imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
        };
        var product3 = {
            productId: "ze160216170722000745",
            productName: "博纳2D通兑票",
            skuNum: "1-16",
            skuName: "节假日通用",
            count: 2,
            curPrice: "100",
            imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
        };
        var productList1 = [product1, product2, product3];
        var productList2 = [product1, product2];
        var productList3 = [product1];
        var cartList1 = {
            sellerId: 1,
            sellerName: "虚拟商品商家1",
            productList: productList1
        };
        var cartList2 = {
            sellerId: 2,
            sellerName: "虚拟商品商家2",
            productList: productList2
        };
        var cartList3 = {
            sellerId: 3,
            sellerName: "虚拟商品商家3",
            productList: productList3
        };
        params.cartList = [cartList1, cartList2, cartList3];

        args.cartList = params.cartList;
        args.mobile = params.mobile || "13558731840";

        logger.info(JSON.stringify(args));

        result.orderId = "13110057";

        response.json(result);
    } catch (ex) {
        response.json(result);
    }
});*/

//取消订单
router.post('/cancelOrder', function (req, res, next) {
    logger.info("进入取消订单接口");
    var result = {code: 200};

    try {
        var arg = req.body;
        /*参数：
         userType: int  //  1（买家）、2（卖家）、3 (系统)
         userId: int    // 用户id
         token: string 	// 鉴权信息
         ppInfo: string 	// 鉴权信息
         browser: string // 浏览器或手机设备号
         orderId: string // 订单id
         reason: int   //取消原因 */
        if (arg.userId == null || arg.userId == "" || arg.userId <= 0) {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if (arg.orderId == null || arg.orderId == "") {
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if (arg.reason == null || arg.reason == "") {
            result.code = 400;
            result.desc = "请选择取消原因";
            res.json(result);
            return;
        }

        logger.info("请求参数，arg：" + arg);

        Order.cancelOrder(arg, function (err, data) {
            if (err) {
                res.json(err);
            }
            res.json(result);
        });
    } catch (ex) {
        logger.error("不能取消，原因是:" + ex);
        result.code = 500;
        result.desc = "取消订单失败";
        res.json(result);
    }
});

// 查询售后订单列表
router.post('/afterSaleList', function (req, res, next) {

    logger.info("++++++++++++");
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("查询订单列表请求参数：" + JSON.stringify(arg));
        var params = {};
        //userid 改为了userId  2016.4.12
        params.userId = arg.userId || 2;
        //params.orderStatus = Order.getOrderStateIdBuyerEnum(arg.orderState);
        params.orderStatus = arg.orderState || null;
        params.percount = arg.percount || 20;
        params.curpage = arg.curpage || 1;
        params.userType = arg.userType || 1;
        params.token = arg.token || "鉴权信息1";
        params.ppInfo = arg.ppInfo || "鉴权信息2";

        if (params.userId == null) {
            result.code = 400;
            result.desc = "没有填写用户ＩＤ";
            res.json(result);
            return;
        }

        //Order.orderProfileQuery(params, function (err, orderInfo) {
        //    if(err){
        //        res.json(err);
        //        return;
        //    }
        //    var page = {total:orderInfo.total, pageCount: orderInfo.pageCount};
        //    var orderList = [];
        //    if(orderInfo.orderProfileList !== null) {
        //        orderInfo.orderProfileList.forEach(function(order) {
        //            var orderItem = {
        //                orderId: order.orderId,
        //                orderPrice: order.closingPrice,
        //                username:order.username,
        //                createName:order.createName,
        //                postage:order.postage,
        //                orderState:order.orderState,
        //                sellerId:order.sellerId,
        //                sellerName:"聚分享旗舰店",//order.sellerName
        //                createTime:order.createTime,   //订单创建时间
        //                deliverTime:order.deliverTime, //卖家发货时间
        //                successTime:order.successTime  //确认收货时间
        //            };
        //            var productList = [];
        //            if(order.productList !== null && order.productList.length > 0){
        //
        //                orderItem.type = 2;
        //                for(var i=0; i < order.productList.length; i++){
        //                    var productItem = {
        //                        productId: order.productList[i].productId,
        //                        productName:order.productList[i].productName,
        //                        skuNum: order.productList[i].skuNum,
        //                        skuName:order.productList[i].skuDesc,//skuName 修改为 skuDesc
        //                        curPrice: order.productList[i].curPrice,
        //                        imgUrl: order.productList[i].imagesUrl.split(',')[0],
        //                        count: order.productList[i].count
        //                       // type:order.productList[i].type
        //                    };
        //                    productList.push(productItem);
        //                }
        //                orderItem.productList = productList;
        //                orderList.push(orderItem);
        //            }
        //        });
        //        result.orderList = orderList;
        //        result.page = page;
        //    }
        //    res.json(result);
        //    logger.info("get order list response:" + JSON.stringify(result));
        //});
        var results = {
            "code": 200,
            "orderList": [
                {
                    "orderId": "5660002",
                    "orderPrice": "1.00",
                    "postage": null,
                    "orderState": 1,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2016-01-04 18:43:46",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151224013609000987",
                            "productName": "测试SKU",
                            "skuNum": "1-2:100-101",
                            "skuName": "颜色-天蓝色:尺码-均码",
                            "curPrice": "1.00",
                            "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5780002",
                    "orderPrice": "0.10",
                    "postage": null,
                    "orderState": 2,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2016-01-04 17:22:30",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151220001240000950",
                            "productName": "测试商品－主流程",
                            "skuNum": "1-1:100-102",
                            "skuName": "颜色-军绿色:尺码-XXS",
                            "curPrice": "0.10",
                            "imgUrl": "31E87669C4FA80B6BB7C08F42E560237.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5650002",
                    "orderPrice": "1.00",
                    "postage": null,
                    "orderState": 3,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2016-01-04 00:17:05",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151224013609000987",
                            "productName": "测试SKU",
                            "skuNum": "1-1:100-101",
                            "skuName": "颜色-军绿色:尺码-均码",
                            "curPrice": "1.00",
                            "imgUrl": "FC84964E8C0A36BB4F56C5866BBFB4F7.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5640002",
                    "orderPrice": "0.01",
                    "postage": null,
                    "orderState": 1,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2016-01-04 00:15:59",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151228152841000732",
                            "productName": "现代 空气净化器 HDJH-5501",
                            "skuNum": "1-7:100-104",
                            "skuName": "颜色-贝立安:尺码-S",
                            "curPrice": "0.01",
                            "imgUrl": "9258E4A9FC083140D36383B2A5426A5C.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5610002",
                    "orderPrice": "0.02",
                    "postage": null,
                    "orderState": 2,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2015-12-31 15:06:06",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151228152841000732",
                            "productName": "现代 空气净化器 HDJH-5501",
                            "skuNum": "1-7:100-105",
                            "skuName": "颜色-贝立安:尺码-M",
                            "curPrice": "0.02",
                            "imgUrl": "9258E4A9FC083140D36383B2A5426A5C.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5490002",
                    "orderPrice": "0.10",
                    "postage": null,
                    "orderState": 3,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2015-12-28 16:24:44",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151220001240000950",
                            "productName": "测试商品－主流程",
                            "skuNum": "1-6:100-102",
                            "skuName": "颜色-浅绿色:尺码-XXS",
                            "curPrice": "0.10",
                            "imgUrl": "B37CC07E0E8EBB7E5E805204FBA22824.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5480002",
                    "orderPrice": "0.10",
                    "postage": null,
                    "orderState": 1,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2015-12-28 16:23:24",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151220001240000950",
                            "productName": "测试商品－主流程",
                            "skuNum": "1-6:100-102",
                            "skuName": "颜色-浅绿色:尺码-XXS",
                            "curPrice": "0.10",
                            "imgUrl": "B37CC07E0E8EBB7E5E805204FBA22824.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5470002",
                    "orderPrice": "0.10",
                    "postage": null,
                    "orderState": 1,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2015-12-28 16:17:41",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151220001240000950",
                            "productName": "测试商品－主流程",
                            "skuNum": "1-6:100-101",
                            "skuName": "颜色-浅绿色:尺码-均码",
                            "curPrice": "0.10",
                            "imgUrl": "B37CC07E0E8EBB7E5E805204FBA22824.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5420002",
                    "orderPrice": "0.10",
                    "postage": null,
                    "orderState": 2,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2015-12-28 16:10:47",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151220001240000950",
                            "productName": "测试商品－主流程",
                            "skuNum": "1-6:100-101",
                            "skuName": "颜色-浅绿色:尺码-均码",
                            "curPrice": "0.10",
                            "imgUrl": "B37CC07E0E8EBB7E5E805204FBA22824.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5390002",
                    "orderPrice": "0.10",
                    "postage": null,
                    "orderState": 2,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2015-12-28 16:05:22",
                    "deliverTime": "",
                    "successTime": "2016-05-03 16:47:41",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151220001240000950",
                            "productName": "测试商品－主流程",
                            "skuNum": "1-6:100-101",
                            "skuName": "颜色-浅绿色:尺码-均码",
                            "curPrice": "0.10",
                            "imgUrl": "B37CC07E0E8EBB7E5E805204FBA22824.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5380002",
                    "orderPrice": "0.10",
                    "postage": null,
                    "orderState": 2,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2015-12-28 16:04:54",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151220001240000950",
                            "productName": "测试商品－主流程",
                            "skuNum": "1-6:100-101",
                            "skuName": "颜色-浅绿色:尺码-均码",
                            "curPrice": "0.10",
                            "imgUrl": "B37CC07E0E8EBB7E5E805204FBA22824.jpg",
                            "count": 1
                        }
                    ]
                },

                {
                    "orderId": "5260002",
                    "orderPrice": "0.10",
                    "postage": null,
                    "orderState": 1,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2015-12-28 11:12:58",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151220001240000950",
                            "productName": "测试商品－主流程",
                            "skuNum": "1-1:100-101",
                            "skuName": "颜色-军绿色:尺码-均码",
                            "curPrice": "0.10",
                            "imgUrl": "40923A2995EA7A154A02C3C0D210F1BA.jpg",
                            "count": 1
                        }
                    ]
                },
                {
                    "orderId": "5210002",
                    "orderPrice": "1.00",
                    "postage": null,
                    "orderState": 2,
                    "sellerId": 1,
                    "sellerName": "聚分享旗舰店",
                    "createTime": "2015-12-27 19:54:00",
                    "deliverTime": "",
                    "successTime": "",
                    "type": 2,
                    "productList": [
                        {
                            "productId": "ze151219003508000502",
                            "productName": "测试商品",
                            "skuNum": "1-3:100-102",
                            "skuName": "颜色-黄色:尺码-xxl",
                            "curPrice": "1.00",
                            "imgUrl": "E48CA9FA8A023F384962C2FE341366EA.jpg",
                            "count": 1
                        }
                    ]
                }


            ],
            "page": {
                "total": 56,
                "pageCount": 3
            }
        };
        res.json(results);
    } catch (ex) {
        logger.error("get order list error:" + ex);
        result.code = 500;
        result.desc = "获取订单列表失败";
        res.json(result);
    }
});

// 查询订单列表
/*router.post('/list', function (req, res, next) {

 logger.info("++++++++++++");
 var result = {code: 200};
 try {
 var arg = req.body;
 logger.info("查询订单列表请求参数：" + JSON.stringify(arg));
 var params = {};
 //userid 改为了userId  2016.4.12
 params.userId = arg.userId || 2;
 params.orderStatus = Order.getOrderStateBuyerEnum(arg.orderState) || null;
 //params.orderStatus = arg.orderState || null;
 params.percount = arg.percount || 20;
 params.curpage = arg.curpage || 1;
 params.userType = arg.userType || 2;
 params.token = arg.token || "鉴权信息1";
 params.ppInfo = arg.ppInfo || "鉴权信息2";

 if (params.userId == null) {
 result.code = 400;
 result.desc = "没有填写用户ＩＤ";
 res.json(result);
 return;
 }

 Order.orderProfileQuery(params, function (err, orderInfo) {
 if (err) {
 res.json(err);
 return;
 }
 var page = {total: orderInfo.total, pageCount: orderInfo.pageCount};
 var orderList = [];
 if (orderInfo.orderProfileList !== null) {
 orderInfo.orderProfileList.forEach(function (order) {
 var orderItem = {
 orderId: order.orderId,
 orderPrice: order.closingPrice,
 username: order.username,
 createName: order.createName,
 postage: order.postage,
 orderState: order.orderState,
 sellerId: order.sellerId,
 sellerName: "聚分享旗舰店",//order.sellerName 现在没有数据
 createTime: order.createTime,   //订单创建时间
 deliverTime: order.deliverTime, //卖家发货时间
 successTime: order.successTime  //确认收货时间
 };
 var productList = [];
 if (order.productList !== null && order.productList.length > 0) {

 orderItem.type = 2;
 for (var i = 0; i < order.productList.length; i++) {
 var productItem = {
 productId: order.productList[i].productId,
 productName: order.productList[i].productName,
 skuNum: order.productList[i].skuNum,
 skuName: order.productList[i].skuDesc,//skuName 修改为 skuDesc
 curPrice: order.productList[i].curPrice,
 imgUrl: order.productList[i].imagesUrl.split(',')[0],
 count: order.productList[i].count
 // type:order.productList[i].type
 };

 productList.push(productItem);

 }
 orderItem.productList = productList;

 var orderItem1 = {
 "orderId": "5660004",
 "orderPrice": "1.00",
 "orderState": 10,
 "sellerId": 1,
 "sellerName": "聚分享旗舰店1",
 "createTime": "2016-01-04 18:43:46",
 "deliverTime": "",
 "successTime": "",
 "type": 3,
 "productList": [
 {
 productId: "ze160216170722000745",
 productName: "博纳2D通兑票",
 skuNum: "1-16",
 skuName: "节假日通用",
 count: 2,
 curPrice: "100",
 imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
 }
 ]
 };
 var orderItem2 = {
 "orderId": "5660004",
 "orderPrice": "1.00",
 "orderState": 61,
 "sellerId": 2,
 "sellerName": "聚分享旗舰店2",
 "createTime": "2016-01-04 18:43:46",
 "deliverTime": "",
 "successTime": "",
 "type": 3,
 "productList": [
 {
 productId: "ze160216170722000745",
 productName: "博纳2D通兑票",
 skuNum: "1-16",
 skuName: "节假日通用",
 count: 2,
 curPrice: "100",
 imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
 }
 ]
 };
 var orderItem3 = {
 "orderId": "5660005",
 "orderPrice": "1.00",
 "orderState": 51,
 "sellerId": 3,
 "sellerName": "聚分享旗舰店3",
 "createTime": "2016-01-04 18:43:46",
 "deliverTime": "",
 "successTime": "",
 "type": 3,
 "productList": [
 {
 productId: "ze160216170722000745",
 productName: "博纳2D通兑票",
 skuNum: "1-16",
 skuName: "节假日通用",
 count: 2,
 curPrice: "100",
 imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
 }
 ]
 };
 var orderItem4 = {
 "orderId": "5660005",
 "orderPrice": "1.00",
 "orderState": 40,
 "sellerId": 3,
 "sellerName": "聚分享旗舰店3",
 "createTime": "2016-01-04 18:43:46",
 "deliverTime": "",
 "successTime": "",
 "type": 3,
 "productList": [
 {
 productId: "ze160216170722000745",
 productName: "高压锅",
 skuNum: "1-16",
 skuName: "节假日通用",
 count: 2,
 curPrice: "100",
 imgUrl: "BBBC6302C54E93780C23DBCECB4F651B.jpg"
 }
 ]
 };
 orderList.push(orderItem1);
 orderList.push(orderItem2);
 orderList.push(orderItem3);
 orderList.push(orderItem4);
 orderList.push(orderItem);
 }
 });

 result.orderList = orderList;
 result.curTime = new Date().getTime();
 /!*给出系统当前时间*!/
 result.page = page;
 }
 res.json(result);
 logger.info("get order list response:" + JSON.stringify(result));
 });
 } catch (ex) {
 logger.error("get order list error:" + ex);
 result.code = 500;
 result.desc = "获取订单列表失败";
 res.json(result);
 }
 });*/
router.post('/list', function (request, response, next) {

    var result = {code: 200};
    var params = request.body;
    logger.info("查询订单列表请求参数：" + JSON.stringify(params));
    if (params.userId == null || params.userId == "" || params.userId <= 0) {
        result.code = 400;
        result.desc = "参数错误";
        response.json(result);
        return;
    }
    if (params.perCount == null || params.perCount == "" || params.perCount <= 0) {
        result.code = 400;
        result.desc = "参数错误";
        response.json(result);
        return;
    }
    if (params.curPage == null || params.curPage == "" || params.curPage <= 0) {
        result.code = 400;
        result.desc = "参数错误";
        response.json(result);
        return;
    }
    var afterSaleList = [];
    result.orderList = [];
    result.afterSaleList = [];
    async.series([
            function (callback) {
                try {
                    Order.orderProfileQuery(params, function (err, orderInfo) {
                        if (err) {
                            logger.error("订单服务异常");
                            return callback(1, null);
                        }
                        var page = {total: orderInfo.total, pageCount: orderInfo.pageCount};
                        var orderList = [];
                        if (orderInfo.orderProfileList !== null) {
                            orderInfo.orderProfileList.forEach(function (order) {
                                var orderItem = {
                                    orderId: order.orderId,
                                    orderPrice: order.closingPrice,
                                    //添加了应答的数据
                                    postage: order.postage,
                                    username: order.username,
                                    cancelName: order.cancelName,
                                    sellerName: order.sellerName,
                                    createTime: order.createTime,
                                    expressNo: order.expressNo,
                                    expressName: order.expressName,
                                    receiverAddress: order.receiverAddress,
                                    receiverName: order.receiverName,
                                    receiverMobile: order.receiverMobile,
                                    receiverTele: order.receiverTele,
                                    orderState: order.orderState,
                                    sellerComment: order.sellerComment,
                                    buyerComment: order.buyerComment,
                                    deliverTime: order.deliverTime,
                                    successTime: order.successTime,
                                    exchangeCash: order.exchangeCash,
                                    exchangeScore: order.exchangeScore,
                                    activeState: order.activeState,
                                    type: 2
                                };
                                var productList = [];
                                if (order.productList !== null && order.productList.length > 0) {
                                    for (var i = 0; i < order.productList.length; i++) {
                                        var productItem = {
                                            productId: order.productList[i].productId,
                                            productName: order.productList[i].productName,
                                            skuNum: order.productList[i].skuNum,
                                            curPrice: order.productList[i].curPrice,
                                            imgUrl: order.productList[i].imagesUrl.split(',')[0],
                                            count: order.productList[i].count
                                        };
                                        productList.push(productItem);
                                    }
                                    orderItem.productList = productList;
                                    orderList.push(orderItem);
                                }
                            });

                            var orderList1 = {
                                "orderId": "5660002",
                                "orderPrice": "1.00",
                                "sellerName": null,
                                "createTime": "2016-01-04 18:43:46",
                                "orderState": 10,
                                "sellerComment": null,
                                "buyerComment": "",
                                "deliverTime": "",
                                "successTime": "",
                                "exchangeCash": "0.00",
                                "exchangeScore": 0,
                                "activeState": 0,
                                "type": 3,
                                "productList": [
                                    {
                                        "productId": "ze151224013609000987",
                                        "productName": "测试SKU",
                                        "skuNum": "1-2:100-101",
                                        "curPrice": "1.00",
                                        "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                                        "count": 1
                                    }
                                ]
                            };
                            var orderList2 = {
                                "orderId": "5660002",
                                "orderPrice": "1.00",
                                "sellerName": null,
                                "createTime": "2016-01-04 18:43:46",
                                "orderState": 61,
                                "sellerComment": null,
                                "buyerComment": "",
                                "deliverTime": "",
                                "successTime": "",
                                "exchangeCash": "0.00",
                                "exchangeScore": 0,
                                "activeState": 0,
                                "type": 3,
                                "productList": [
                                    {
                                        "productId": "ze151224013609000987",
                                        "productName": "测试SKU",
                                        "skuNum": "1-2:100-101",
                                        "curPrice": "1.00",
                                        "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                                        "count": 1
                                    }
                                ]
                            };
                            var orderList3 = {
                                "orderId": "5660002",
                                "orderPrice": "1.00",
                                "sellerName": null,
                                "createTime": "2016-01-04 18:43:46",
                                "orderState": 51,
                                "sellerComment": null,
                                "buyerComment": "",
                                "deliverTime": "",
                                "successTime": "",
                                "exchangeCash": "0.00",
                                "exchangeScore": 0,
                                "activeState": 0,
                                "type": 3,
                                "productList": [
                                    {
                                        "productId": "ze151224013609000987",
                                        "productName": "测试SKU",
                                        "skuNum": "1-2:100-101",
                                        "curPrice": "1.00",
                                        "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                                        "count": 1
                                    }
                                ]
                            };
                            var orderList4 = {
                                "orderId": "5660002",
                                "orderPrice": "1.00",
                                "sellerName": null,
                                "createTime": "2016-01-04 18:43:46",
                                "orderState": 51,
                                "sellerComment": null,
                                "buyerComment": "",
                                "deliverTime": "",
                                "successTime": "",
                                "exchangeCash": "0.00",
                                "exchangeScore": 0,
                                "activeState": 0,
                                "type": 2,
                                "productList": [
                                    {
                                        "productId": "ze151224013609000987",
                                        "productName": "测试SKU",
                                        "skuNum": "1-2:100-101",
                                        "curPrice": "1.00",
                                        "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                                        "count": 1
                                    },
                                    {
                                        "productId": "ze151224013609000987",
                                        "productName": "测试SKU",
                                        "skuNum": "1-2:100-101",
                                        "curPrice": "1.00",
                                        "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                                        "count": 1
                                    },
                                    {
                                        "productId": "ze151224013609000987",
                                        "productName": "测试SKU",
                                        "skuNum": "1-2:100-101",
                                        "curPrice": "1.00",
                                        "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                                        "count": 1
                                    }
                                ]
                            };
                            var orderList5 = {
                                "orderId": "5660002",
                                "orderPrice": "1.00",
                                "sellerName": null,
                                "createTime": "2016-01-04 18:43:46",
                                "orderState": 41,
                                "sellerComment": null,
                                "buyerComment": "",
                                "deliverTime": "",
                                "successTime": "",
                                "exchangeCash": "0.00",
                                "exchangeScore": 0,
                                "activeState": 0,
                                "type": 2,
                                "productList": [
                                    {
                                        "productId": "ze151224013609000987",
                                        "productName": "测试SKU",
                                        "skuNum": "1-2:100-101",
                                        "curPrice": "1.00",
                                        "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                                        "count": 1
                                    },
                                    {
                                        "productId": "ze151224013609000987",
                                        "productName": "测试SKU",
                                        "skuNum": "1-2:100-101",
                                        "curPrice": "1.00",
                                        "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                                        "count": 1
                                    },
                                    {
                                        "productId": "ze151224013609000987",
                                        "productName": "测试SKU",
                                        "skuNum": "1-2:100-101",
                                        "curPrice": "1.00",
                                        "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                                        "count": 1
                                    }
                                ]
                            };

                            orderList.push(orderList1);
                            orderList.push(orderList2);
                            orderList.push(orderList3);
                            orderList.push(orderList4);
                            orderList.push(orderList5);
                            result.orderList = orderList;
                            /*给出系统当前时间*/
                            result.curTime = new Date().getTime();
                            result.page = page;
                        }
                        logger.info("get order list response:" + JSON.stringify(result));
                        return callback(null, result);
                    });

                } catch (ex) {
                    logger.info("订单服务异常:" + ex);
                    return callback(1, null);
                }
            },
            function (callback) {
                try {
                    if (params.orderState == null || params.orderState == "") {
                        AfterSale.queryAfterSale(params, function (err, data) {
                            if (err) {
                                return callback(2, null);
                            }
                            logger.info("get order list response:" + JSON.stringify(result));
                            afterSaleList = data;
                            return callback(null, afterSaleList);
                        });
                    } else {
                        return callback(3, null);
                    }
                } catch (ex) {
                    logger.info("售后服务异常:" + ex);
                    return callback(2, null);
                }
            }
        ],
        function (err, results) {
            if (err == 1) {
                logger.error("查询订单列表失败---订单服务异常：" + err);
                result.code = 500;
                result.desc = "查询订单失败";
                response.json(result);
                return;
            }
            if (err == 2) {
                logger.error("查询售后失败--售后服务异常：" + err);
                response.json(results[0]);
                return;
            }
            if (err == null && err != 3) {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[0];
                result.afterSaleList = results[1];
                response.json(result);
                return;
            } else {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[0];

                response.json(result);
                return;
            }
        });
});

//查询各订单状态的数量
router.post('/count', function (request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code: 200};

    var arg = request.body;
    arg.token = "鉴权信息1";
    arg.ppInfo = "鉴权信息2";

    if (arg.userId == null || arg.userId == "" || arg.userId <= 0) {
        resContent.code = 400;
        resContent.desc = "用户id不能为空且必须大于0";
        response.json(resContent);
        return;
    }
    if (arg.userType == null || arg.userType == "" || arg.userType <= 0) {
        resContent.code = 400;
        resContent.desc = "userType 不能为空【1（买家）、2（卖家）、3 (系统)】";
        response.json(resContent);
        return;
    }

    logger.info("请求参数信息" + JSON.stringify(arg));

    try {
        Order.orderStateQuery(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            //var orderCountList = data[0].orderCountList;
            //resContent.orderCountList = orderCountList;
            resContent.orderCountList = data;
            response.json(resContent);
            logger.info("各状态对应的数量是:" + JSON.stringify(resContent));
        });
    } catch (ex) {
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "获取用户积分失败";
        response.json(resContent);
    }
});

// 查询订单详情
router.post('/infoTest', function (request, response, next) {
    var result = {code: 200};
    //var params = request.query;
    var params = request.body;
    if (params.userId == null || params.userId == "" || params.userId <= 0) {
        result.code = 400;
        result.desc = "参数错误";
        response.json(result);
        return;
    }
    if (params.orderId == null || params.orderId == "") {
        result.code = 400;
        result.desc = "参数错误";
        response.json(result);
        return;
    }
    //订单详情，没有处理3的情况，这里就写2
    params.userType = 2; // 1:买家 2：卖家 3：系统

    logger.info("查询订单祥情请求参数：" + JSON.stringify(params));

    var afterSaleList = [];
    async.series([
            function (callback) {
                try {
                    Order.queryOrderDetail(params, function (err, orderInfo) {
                        if (err) {
                            logger.error("订单服务异常");
                            return callback(1, null);
                        }

                        result.orderId = orderInfo.orderId;
                        result.postage = orderInfo.postage;
                        result.postage = orderInfo.postage;
                        result.exchangeScore = orderInfo.exchangeScore;
                        result.closingPrice = orderInfo.closingPrice;
                        result.createTime = orderInfo.deliverTime;
                        result.comment = orderInfo.buyerComment;
                        if (orderInfo.deliverInfo !== null) {

                            var deliverInfo = {
                                receiverName: orderInfo.deliverInfo.receiverName,
                                receiverMobile: orderInfo.deliverInfo.receiverMobile,
                                receiverAddress: orderInfo.deliverInfo.receiverAddress,
                                expressId: orderInfo.deliverInfo.expressId,
                                expressName: orderInfo.deliverInfo.expressName,
                                expressNo: orderInfo.deliverInfo.expressNo
                            };
                            result.deliverInfo = deliverInfo;
                        }

                        var productList = [];
                        if (orderInfo.productList !== null && orderInfo.productList.length > 0) {
                            for (var i = 0; i < orderInfo.productList.length; i++) {
                                productList.push({
                                    productId: orderInfo.productList[i].productId,
                                    productName: orderInfo.productList[i].productName,
                                    sku: {
                                        skuNum: orderInfo.productList[i].skuNum,
                                        skuName: orderInfo.productList[i].skuDesc
                                    },
                                    curPrice: orderInfo.productList[i].curPrice,
                                    orgPrice: orderInfo.productList[i].orgPrice,
                                    imgUrl: orderInfo.productList[i].imagesUrl,
                                    count: orderInfo.productList[i].count,
                                    postage: orderInfo.productList[i].postage,
                                    type: orderInfo.productList[i].type
                                });
                            }
                            result.productList = productList;

                            logger.info("get order info response:" + JSON.stringify(result));
                            callback(null, result);
                        }
                    });
                }
                catch
                    (ex) {
                    logger.info("订单服务异常:" + ex);
                    return callback(1, null);
                }
            },
            function (callback) {
                try {
                    if (params.orderState == null || params.orderState == 1) {
                        AfterSale.queryAfterSale(params, function (err, data) {
                            if (err) {
                                return callback(2, null);
                            }
                            logger.info("get order list response:" + JSON.stringify(result));
                            afterSaleList = data;
                            result.afterSaleList = afterSaleList;
                            return callback(null, afterSaleList);
                        });
                    } else {
                        return callback(3, null);
                    }
                } catch (ex) {
                    logger.info("售后服务异常:" + ex);
                    return callback(2, null);
                }

            }
        ],
        function (err, results) {
            if (err == 1) {
                logger.error("查询订单列表失败---订单服务异常：" + err);
                result.code = 500;
                result.desc = "查询订单失败";
                response.json(result);
                return;
            }
            if (err == 2) {
                logger.error("查询售后失败--售后服务异常：" + err);
                response.json(results[0]);
                return;
            }

            if (err == null && err != 3) {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[0];
                result.afterSaleList = results[1];
                response.json(result);
                return;
            } else {
                logger.info("shuju------------->" + JSON.stringify(results));
                result = results[0];

                response.json(result);
                return;
            }
        }
    )
    ;
});

// 查询订单详情--虚拟
router.post('/info2', function (req, res, next) {
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("查询订单祥情请求参数：" + JSON.stringify(arg));

        var params = {};
        params.userId = arg.userId || 2;
        params.orderId = arg.orderId || "5780002";
        params.userType = arg.userType || 1; // 1:买家 2：卖家 3：系统
        params.token = arg.token || "鉴权信息1";
        params.ppInfo = arg.ppInfo || "鉴权信息2";
        if (params.userId == null || params.orderId == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }


        result.orderId = "5780002";
        result.orderstate = 10;
        result.mobileNo = "13558731840";
        result.sellerName = "测试商家";
        result.curTime = new Date().getTime();
        result.createTime = "2016-01-20 10:12:34"; //订单创建时间
        result.deliverTime = "";
        result.successTime = "";
        result.comment = "买家留言信息";
        result.closingPrice = "1";
        result.exchangeScore = "100";
        result.payChanel = 1;
        var couponCode = "序列号：*************     密码：***************"
        result.couponCode = [couponCode, couponCode];

        var productList = {
            productId: "ze151220001240000950",
            productName: "测试商品－主流程",
            sku: {skuNum: "1-1:100-102", skuDesc: "颜色-军绿色:尺码-XXS"},
            curPrice: "0.01",
            imgUrl: "31E87669C4FA80B6BB7C08F42E560237.jpg",
            count: 2
        };

        result.productList = productList;

        res.json(result);
        logger.info("get order info response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("查询订单详情失败：" + ex);
        result.code = 500;
        result.desc = "查询订单详情失败";
        res.json(result);
    }
});
// 查询订单详情--虚拟
router.post('/info2Test', function (req, res, next) {
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("查询订单祥情请求参数：" + JSON.stringify(arg));

        var params = {};
        params.userId = arg.userId || 2;
        params.orderId = arg.orderId || "5780002";
        params.userType = arg.userType || 1; // 1:买家 2：卖家 3：系统
        params.token = arg.token || "鉴权信息1";
        params.ppInfo = arg.ppInfo || "鉴权信息2";
        if (params.userId == null || params.orderId == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        Order.queryOrderDetail(params, function (err, orderInfo) {
            if (err) {
                res.json(err);
                return;
            }
            if (orderInfo == null) {
                result.code = 404;
                result.desc = "未找到订单";
                res.json(result);
                return;
            }
            result.orderId = orderInfo.orderId;
            //result.orderState = Order.getOrderStateBuyerEnum(orderInfo.orderState);
            result.orderState = orderInfo.orderState;
            if (orderInfo.deliverInfo !== null) {
                result.address = orderInfo.deliverInfo.provinceName +
                    orderInfo.deliverInfo.cityName +
                    orderInfo.deliverInfo.countyName +
                    orderInfo.deliverInfo.receiverAddress;
                result.receiverName = orderInfo.deliverInfo.receiverName;
                result.mobile = orderInfo.deliverInfo.mobile || "13558731842";
            }
            result.curTime = new Date().getTime();
            result.createTime = orderInfo.createTime || "2016-05-03 10:01:58";
            result.deliverTime = orderInfo.deliverTime || "2016-05-04 11:01:58"; //卖家发货时间
            result.successTime = orderInfo.successTime || "2016-05-06 12:01:58"; //确认收货时间
            result.comment = orderInfo.buyerComment || "请周一到周五的下午6点后送货";
            result.sellerName = "测试商家1";
            //result.sellerName = orderInfo.sellerName;  /*thrift文件有字段，但是没办法读取*/
            var productList = [];
            if (orderInfo.productList !== null && orderInfo.productList.length > 0) {
                for (var i = 0; i < orderInfo.productList.length; i++) {
                    productList.push({
                        productId: orderInfo.productList[i].productId,
                        productName: orderInfo.productList[i].productName,
                        sku: {skuNum: orderInfo.productList[i].skuNum, skuName: orderInfo.productList[i].skuDesc},
                        curPrice: orderInfo.productList[i].curPrice,
                        orgPrice: orderInfo.productList[i].orgPrice,
                        imgUrl: orderInfo.productList[i].imagesUrl,
                        count: orderInfo.productList[i].count
                    });
                }
                result.productList = productList;
            }





            res.json(result);
            logger.info("get order info response:" + JSON.stringify(result));
        });

    } catch (ex) {
        logger.error("查询订单详情失败：" + ex);
        result.code = 500;
        result.desc = "查询订单详情失败";
        res.json(result);
    }
});

// 查询订单详情--实物
router.post('/info', function (req, res, next) {
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("查询订单祥情请求参数：" + JSON.stringify(arg));

        var params = {};
        params.userId = arg.userId || 2;
        params.orderId = arg.orderId || "5780002";
        params.userType = arg.userType || 1; // 1:买家 2：卖家 3：系统
        params.token = arg.token || "鉴权信息1";
        params.ppInfo = arg.ppInfo || "鉴权信息2";
        if (params.userId == null || params.orderId == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        Order.queryOrderDetail(params, function (err, orderInfo) {
            if (err) {
                res.json(err);
                return;
            }
            if (orderInfo == null) {
                result.code = 404;
                result.desc = "未找到订单";
                res.json(result);
                return;
            }
            result.orderId = orderInfo.orderId;
            //result.orderState = Order.getOrderStateBuyerEnum(orderInfo.orderState);
            result.orderState = orderInfo.orderState;
            if (orderInfo.deliverInfo !== null) {
                result.address = orderInfo.deliverInfo.provinceName +
                    orderInfo.deliverInfo.cityName +
                    orderInfo.deliverInfo.countyName +
                    orderInfo.deliverInfo.receiverAddress;
                result.receiverName = orderInfo.deliverInfo.receiverName;
                result.mobile = orderInfo.deliverInfo.mobile || "13558731842";
            }
            result.curTime = new Date().getTime();
            result.createTime = orderInfo.createTime || "2016-05-03 10:01:58";
            result.deliverTime = orderInfo.deliverTime || "2016-05-04 11:01:58"; //卖家发货时间
            result.successTime = orderInfo.successTime || "2016-05-06 12:01:58"; //确认收货时间
            result.comment = orderInfo.buyerComment || "请周一到周五的下午6点后送货";
            result.sellerName = "测试商家1";
            //result.sellerName = orderInfo.sellerName;  /*thrift文件有字段，但是没办法读取*/
            var productList = [];
            if (orderInfo.productList !== null && orderInfo.productList.length > 0) {
                for (var i = 0; i < orderInfo.productList.length; i++) {
                    productList.push({
                        productId: orderInfo.productList[i].productId,
                        productName: orderInfo.productList[i].productName,
                        sku: {skuNum: orderInfo.productList[i].skuNum, skuName: orderInfo.productList[i].skuDesc},
                        curPrice: orderInfo.productList[i].curPrice,
                        orgPrice: orderInfo.productList[i].orgPrice,
                        imgUrl: orderInfo.productList[i].imagesUrl,
                        count: orderInfo.productList[i].count,
                        postage: orderInfo.productList[i].postage || "10"

                    });
                }
                var productList2 = {
                    "productId": "ze151224013609000987",
                    "productName": "测试SKU",
                    sku: {"skuNum": "1-2:100-101", "skuDesc": "颜色-天蓝色:尺码-均码"},
                    "curPrice": "1.00",
                    "orgPrice": "2.00",
                    "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                    "count": 1,
                    "postage": 10,
                    "productState": 1
                };
                var productList3 = {
                    "productId": "ze151224013609000987",
                    "productName": "测试SKU",
                    sku: {"skuNum": "1-2:100-101", "skuDesc": "颜色-天蓝色:尺码-均码"},
                    "curPrice": "1.00",
                    "orgPrice": "2.00",
                    "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                    "count": 1,
                    "postage": 10,
                    "productState": 2
                };
                var productList4 = {
                    "productId": "ze151224013609000987",
                    "productName": "测试SKU",
                    sku: {"skuNum": "1-2:100-101", "skuDesc": "颜色-天蓝色:尺码-均码"},
                    "curPrice": "1.00",
                    "orgPrice": "2.00",
                    "imgUrl": "22E3C358A1F3979D8907985102550732.jpg",
                    "count": 1,
                    "postage": 10,
                    "productState": 3
                };

                productList.push(productList2);
                productList.push(productList3);
                productList.push(productList4);
                result.productList = productList;
            }
            res.json(result);
            logger.info("get order info response:" + JSON.stringify(result));
        });

    } catch (ex) {
        logger.error("查询订单详情失败：" + ex);
        result.code = 500;
        result.desc = "查询订单详情失败";
        res.json(result);
    }
});

/*获取支付的url*/
router.post('/payTest', function (req, res, next) {
    var result = {code: 200};

    var arg = req.body;
    logger.info("order pay request:" + JSON.stringify(arg));

    if (arg == null || arg.payChannel == null || arg.orderIdList == null || arg.orderIdList.length <= 0) {
        result.code = 400;
        result.desc = "请求参数错误";
        res.json(result);
    }

    if (arg.payChannel == 4) {
        Util.getOpenApi(arg, function (err, data) {
            try {
                logger.info("get open id response: " + JSON.stringify(data));
                var jsonData = JSON.parse(data);
                if (err == 500 || jsonData.openid == undefined) {
                    logger.error("error:" + err);
                    result.code = 500;
                    result.desc = "获取支付URL失败";
                    res.json(result);
                    return;
                }
                logger.info("jsonData:" + JSON.stringify(jsonData));
                arg.openId = jsonData.openid;

                logger.info("arg:" + JSON.stringify(arg));
                Order.payApply(arg, function (err, payUrl) {
                    var urlInof = JSON.parse(payUrl.value);
                    if (err) {
                        res.json(err);
                        return;
                    }
                    if (payUrl !== null) {
                        result.payUrl = urlInof;
                        res.json(result);
                        logger.info("order pay response:" + JSON.stringify(result));
                    }
                });
            }
            catch (ex) {
                logger.error("error:" + ex);
                result.code = 500;
                result.desc = "获取支付URL失败";
                res.json(result);
            }
        });
    } else {
        Order.payApply(arg, function (err, payUrl) {
            var urlInof = JSON.parse(payUrl.value);
            if (err) {
                res.json(err);
                return;
            }
            if (payUrl !== null) {
                result.payUrl = urlInof;
                res.json(result);
                logger.info("order pay response:" + JSON.stringify(result));
            }
        });
    }
});
//获取第三方支付的url
router.post('/pay', function (request, response, next) {
    logger.info("进入支付流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var args = {};
        args.token = params.token || "鉴权信息1";
        args.ppInfo = params.ppInfo || "鉴权信息2";
        args.payChannel = params.payChannel || 4;
        args.userId = params.userId || 2;
        args.resUrl = params.resUrl || "支付返回的结果";
        args.resUrl = {orderId: params.orderId || "5780002", exchangeScore: params.exchangeScore || "100"};

        logger.info("query expressOrder params:" + JSON.stringify(args));

        result.payUrl = "支付的url：www.pay.com";
        response.json(result);
    } catch (ex) {
        response.json(result);
    }
});

//立即付款
router.post('/payApply', function (req, res, next) {
    var result = {code: 200};

    var arg = req.body;
    var params = {};

    params.orderIdList = arg.orderIdList || "1";
    params.userId = arg.userId || 2;
    params.token = arg.token || "鉴权信息1";
    params.ppInfo = arg.ppInfo || "鉴权信息2";
    logger.info("order pay request:" + JSON.stringify(params));

    Order.payApply(params, function (err, payUrl) {
        var urlInof = JSON.parse(payUrl.value);
        if (err) {
            res.json(err);
            return;
        }
        if (payUrl !== null) {
            result.payUrl = urlInof;
            res.json(result);
            logger.info("order pay response:" + JSON.stringify(result));
        }
    });

});

//确认收货
router.post('/changeState', function (req, res, next) {
    var result = {code: 200};

    var arg = req.body;
    var params = {};

    params.orderId = arg.orderId || "5390002";
    params.userId = arg.userId || 2;
    params.userType = arg.userType || 1;
    params.token = arg.token || "鉴权信息1";
    params.ppInfo = arg.ppInfo || "鉴权信息2";
    logger.info("order pay request:" + JSON.stringify(params));

    Order.confirmReceipt(params, function (err, data) {
        if (err) {
            res.json(err);
            return;
        }
        res.json(result);
        logger.info("order pay response:" + JSON.stringify(result));

    });

});

//查询支付状态
router.post('/paystate', function (req, res, next) {
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("get pay state request:" + JSON.stringify(arg));

        if (arg == null || arg.payId == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Order.payState(arg, function (err, payState) {
            if (err) {
                res.json(err);
                return;
            }
            if (payState !== null) {
                result.retCode = payState.retCode;
                result.canncelTime = payState.canncelTime;
            } else {
                result.code = 500;
                result.desc = "获取支付状态失败";
            }
            res.json(result);
            logger.info("get pay state response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("get pay state error:" + ex);
        result.code = 500;
        result.desc = "获取支付状态失败";
        res.json(result);
    }
});

//支付完成通知接口
router.post('/notify/alipay', function (request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var args = {};
        args.token = params.token || "鉴权信息1";
        args.ppInfo = params.ppInfo || "鉴权信息2";
        args.payChannel = params.payChannel || 1;
        args.resUrl = params.resUrl || "支付返回的结果";

        logger.info("query expressOrder params:" + JSON.stringify(args));

        response.json(result);
    } catch (ex) {
        response.json(result);
    }
});

//获取物流信息
router.post('/queryExpress', function (request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        if (params.orderId == null || params.orderId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        var expressInfo = [{
            "time": "2016-02-22 13:37:26",
            "ftime": "2016-02-22 13:37:26",
            "context": "快件已签收,签收人是草签，签收网点是北京市朝阳安华桥"
        }, {
            "time": "2016-02-22 07:51:50",
            "ftime": "2016-02-22 07:51:50",
            "context": "北京市朝阳安华桥的牛鹏超18518350628正在派件"
        }, {
            "time": "2016-02-22 07:02:10",
            "ftime": "2016-02-22 07:02:10",
            "context": "快件到达北京市朝阳安华桥，上一站是北京集散，扫描员是张彪18519292322"
        }, {
            "time": "2016-02-22 01:40:35",
            "ftime": "2016-02-22 01:40:35",
            "context": "快件由北京集散发往北京市朝阳安华桥"
        }, {
            "time": "2016-02-20 22:42:14",
            "ftime": "2016-02-20 22:42:14",
            "context": "快件由温州分拨中心发往北京集散"
        }, {
            "time": "2016-02-20 19:56:29",
            "ftime": "2016-02-20 19:56:29",
            "context": "快件由苍南(0577-59905999)发往温州分拨中心"
        }, {
            "time": "2016-02-20 19:50:09",
            "ftime": "2016-02-20 19:50:09",
            "context": "快件由苍南(0577-59905999)发往北京(010-53703166转8039或8010)"
        }, {
            "time": "2016-02-20 19:50:08",
            "ftime": "2016-02-20 19:50:08",
            "context": "苍南(0577-59905999)已进行装袋扫描"
        }, {
            "time": "2016-02-20 19:46:22",
            "ftime": "2016-02-20 19:46:22",
            "context": "苍南(0577-59905999)的龙港公司已收件，扫描员是龙港公司"
        }];
        result.id = 100001;
        result.name = "顺丰";
        result.productName = "超能洗衣液";
        result.traceJson = expressInfo;
        result.remark = "";

        logger.info("query expressOrder params:" + JSON.stringify(params));

        response.json(result);

    } catch (ex) {


        response.json(result);
    }
});
//获取物流信息
router.post('/queryExpressTest', function (request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var token = "鉴权信息1";
        var ppInfo = "鉴权信息2";
        var browser = "asdafas";
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        logger.info("query expressOrder params:" + JSON.stringify(params));

        Express.queryExpress(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.data = data;
            response.json(result);
        });

    } catch (ex) {
        result.code = 500;
        result.desc = "查询物流信息失败";
        response.json(result);
    }
});

//根据订单信息获取运费值
router.post('/freight', function (request, response, next) {

    logger.info("进入获取用户积分接口");
    var resContent = {code: 200};

    var param = request.body;
    var token = param.token || "鉴权信息1";
    var ppInfo = param.ppInfo || "鉴权信息2";
    var orderId = param.orderId || 1;

    var params = {};
    params.token = token;
    params.ppInfo = ppInfo;
    params.orderId = orderId;
    logger.info("请求参数信息" + JSON.stringify(params));

    try {
        var postage = "10";
        resContent.postage = postage;
        response.json(resContent);
        logger.info("响应的信息：" + resContent);
    } catch (ex) {
        logger.error("不能获取，原因是:" + ex);
        resContent.code = 500;
        resContent.desc = "获取用户积分失败";
        response.json(resContent);
    }
});

//申请退货
router.post('/refund', function (request, response, next) {
    logger.info("进入申请退货流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var args = {};
        args.userId = params.userId || 2;
        args.token = params.token || "鉴权信息1";
        args.ppInfo = params.ppInfo || "鉴权信息2";
        args.productId = params.productId || "ze160407160404000554";
        args.skuId = params.skuId || 1;
        args.orderId = params.orderId || "5390002";
        args.orderStateType = params.orderStateType || "买错了";
        args.orderStateTypeDesc = params.orderStateTypeDesc || "就是不想要了";

        result.createTime = "2016-04-25 11:40:35";

        logger.info("query expressOrder params:" + JSON.stringify(args));

        response.json(result);
    } catch (ex) {
        response.json(result);
    }
});
//申请退货
router.post('/refundTest', function (request, response, next) {
    logger.info("进入申请退货流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var token = "鉴权信息1";
        var ppInfo = "鉴权信息2";
        var browser = "asdafas";
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "") {
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        logger.info("query expressOrder params:" + JSON.stringify(params));

        AfterSale.request(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            response.json(result);
        });
    } catch (ex) {
        response.json(result);
    }
});

//获取售后信息
router.post('/refundDesc', function (request, response, next) {
    logger.info("进入获取物流信息流程");
    var result = {code: 200};
    try {
        //var params = request.query;
        var params = request.body;
        var args = {};
        args.userId = params.userId || 2;
        args.token = params.token || "鉴权信息1";
        args.ppInfo = params.ppInfo || "鉴权信息2";
        args.productId = params.productId || "ze160407160404000554";
        args.skuId = params.skuId || 1;
        args.orderId = params.orderId || "5390002";

        result.createTime = "2016-04-25 11:40:35";
        result.reviewTime = "2016-04-25 13:40:35";
        result.reviewState = 2;
        result.reviewResult = "退货失败";
        result.reviewDesc = "不许退";


        logger.info("query expressOrder params:" + JSON.stringify(args));

        response.json(result);
    } catch (ex) {
        response.json(result);
    }
});
//获取售后信息
router.post('/refundDescTest', function (request, response, next) {
    logger.info("进入获取售后信息流程");
    var result = {code: 200};

    try {
        var params = request.body;
        var token = "鉴权信息1";
        var ppInfo = "鉴权信息2";
        var browser = "asdafas";
        logger.info("售后信息查询， arg:" + JSON.stringify(params));

        if (params.productId == null || params.productId == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.skuNum == null || params.skuNum == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        AfterSale.queryAfterSale(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.data = data;
            response.json(result);
            logger.info("AfterSale.queryAfterSale response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("AfterSale.queryAfterSale error:" + ex);
        result.code = 500;
        result.desc = "查询售后信息失败";
        response.json(result);
    }
});

module.exports = router;