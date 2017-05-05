/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Address = require('../lib/models/address');
var page = require('../lib/thrift/gen_code/pagination_types.js');
//web端用户前往优惠券领取页面
router.post('/findCoupon', function(req, res, next) {
    logger.info("进入领券页面");
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("领券， arg:" + JSON.stringify(arg));

        var CouponActiv1= {
                userid:2,//用户ID
              couponSize:1000,//券面值
            couponPremise:20000,//满多少可用
            activScope:"全商城商品可使用",//使用范围
            startTime:"2017-04-28",//开始时间
            endTime:"2017-05-03"//结束时间
        }
        var CouponActiv4= {
            userid:2,
            couponSize:1000,
            couponPremise:20000,
            activScope:"全商城商品可使用",
            startTime:"2017-04-28",
            endTime:"2017-05-03"
        }
        var CouponActiv2= {
            userid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"家用电器",
            startTime:"2017-04-28",
            endTime:"2017-05-03"
        }
        var CouponActiv3= {
            userid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"化妆品",
            startTime:"2017-04-28",
            endTime:"2017-05-03"
        }
        var list = [];

        list.push(CouponActiv1);
        list.push(CouponActiv2);
        list.push(CouponActiv3);
        list.push(CouponActiv4);
        result.list = list;
        res.json(result);
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "领取失败";
        res.json(result);
    }
});

//web端用户领取优惠券
router.post('/receiveCoupon', function(req, res, next) {
    logger.info("用户领取优惠券");

    var result ={code:200};
    try{
        result.code= 200;
        res.json(result);
        logger.error("领券成功" );

    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "领券失败";
        res.json(result);
    }
});
//分享生成的链接
router.post('/shareUrl', function(req, res, next) {
    logger.info("分享生成连接");
    var result = {code: 200};

    try{
        logger.info("分享生成连接成功!");
        result.code = 200;
        res.json(result);
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "分享失败!";
        res.json(result);
    }
});
router.post('/queryCouponList', function(req, res, next) {
    logger.info("更多好券列表");
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("分享连接参数， arg:" + JSON.stringify(arg));

        var CouponActiv1= {
            userid:1,//用户id
            couponSize:1000,//券面值
            couponPremise:20000,//满多少可用
            activScope:"全商城商品可使用",//使用范围
            startTime:"2017-04-28",//开始时间
            endTime:"2017-05-03",//结束时间
            couponRec:0//券类型 0:更多好券 1：精品好券
        }
        var CouponActiv4= {
            userid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"全商城商品可使用",
            startTime:"2017-04-28",
            endTime:"2017-05-03",
            couponRec:0
        }
        var CouponActiv2= {
            userid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"家用电器",
            startTime:"2017-04-28",
            endTime:"2017-05-03",
            couponRec:1
        }
        var CouponActiv3= {
            userid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"化妆品",
            startTime:"2017-04-28",
            endTime:"2017-05-03",
            couponRec:1
        }
        var list = [];

        list.push(CouponActiv1);
        list.push(CouponActiv2);
        list.push(CouponActiv3);
        list.push(CouponActiv4);


        result.list = list;
        var page ={
            totalCount:100,
            pageNumCount:3,
            numPerPage:20,
            currentPage:1
        };
        result.page = page;
        res.json(result);
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "精选/更多好券列表获取失败";
        res.json(result);
    }
})
//我的券包列表
router.post('/userCouponList', function(req, res, next) {
    logger.info("我的券包列表");
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("分享连接参数， arg:" + JSON.stringify(arg));

        var Coupon1= {
            userid:1,//用户id
            couponSize:1000,//券面值
            couponPremise:20000,//蛮多少可用
            activScope:"全商城商品可使用",//使用范围
            startTime:"2017-04-28",//开始时间
            endTime:"2017-05-03",//结束时间
            couponnum:"JFJF11140014",//券码
            couponState:0//券类型 0:未使用 1：已使用 2：已过期
        }
        var Coupon2= {
            userid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"全商城商品可使用",
            startTime:"2017-04-28",
            endTime:"2017-05-03",
            couponRec:0,
            couponnum:"JFJF11140013",
            couponState:1
        }
        var Coupon3= {
            userid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"家用电器",
            startTime:"2017-04-28",
            endTime:"2017-05-03",
            couponRec:1,
            couponnum:"JFJF11140012",
            couponState:2
        }
        var Coupon4= {
            userid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"化妆品",
            startTime:"2017-04-28",
            endTime:"2017-05-03",
            couponRec:1,
            couponnum:"JFJF11140011",
            couponState:1
        }
        var list = [];

        list.push(Coupon1);
        list.push(Coupon2);
        list.push(Coupon3);
        list.push(Coupon4);
        var page ={
            totalCount:100,
            pageNumCount:3,
            numPerPage:20,
            currentPage:1
        };
        result.page = page

        result.list = list;
        res.json(result);
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "我的券包列表获取失败";
        res.json(result);
    }
})
//我的券包列表数量
router.post('/userCouponCount', function(req, res, next) {
    var result = {code: 200};
    var count =[2,4,5];
    try{
        var arg = req.body;
        logger.info("参数， arg:" + JSON.stringify(arg));

        result.countyList=count;
        res.json(result);
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "添加收货地址失败";
        res.json(result);
    }
});
//根据商品Id查看相关的优惠券活动列表
router.post('/queryActiveByProductId', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("优惠券列表参数， arg:" + JSON.stringify(arg));

        var coupon = {
            productid:3,
            couponid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"仅限实物类商品使用",
            beginTime:"2017-04-28 24:00",
            endTime:"2017-05-03 24:00"
        }
        var coupon = {
            productid:5,
            couponid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"仅限实物类商品使用",
            beginTime:"2017-04-28 24:00",
            endTime:"2017-05-03 24:00"
        }
        var list = [];

        list.push(coupon);
        list.push(coupon);

        result.list = list;
        var page ={
            totalCount:100,
            pageNumCount:3,
            numPerPage:20,
            currentPage:1
        };
        result.page = page
        res.json(result);
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "优惠券活动列表获取失败";
        res.json(result);
    }
});
//提交订单页面卡券列表
router.post('/queryCouponListByProducts', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("卡券列表参数， arg:" + JSON.stringify(arg));

        var coupon = {
            productid:3,
            couponid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"仅限实物类商品使用",
            beginTime:"2017-04-28 24:00",
            endTime:"2017-05-03 24:00"
        }
        var coupon = {
            productid:5,
            couponid:1,
            couponSize:1000,
            couponPremise:20000,
            activScope:"仅限实物类商品使用",
            beginTime:"2017-04-28 24:00",
            endTime:"2017-05-03 24:00"
        }
        var list = [];

        list.push(coupon);
        list.push(coupon);

        result.list = list;
        res.json(result);
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "卡券列表获取失败";
        res.json(result);
    }
});

module.exports = router;