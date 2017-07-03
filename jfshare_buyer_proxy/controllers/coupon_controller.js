/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Address = require('../lib/models/address');
var page = require('../lib/thrift/gen_code/pagination_types.js');
var Coupon = require('../lib/models/coupon');


//web端用户领取优惠券
router.post('/receiveCoupon', function (req, res, next) {
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("领取优惠券， arg:" + JSON.stringify(arg.userId));
        if (arg.userId == null || arg.userId == "") {
            logger.info("error at userId: ");
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.activityId == null || arg.activityId == "" || arg.activityId <= 0) {
            logger.info("error at activityId" + arg.activityId);
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.fromSource == null || arg.fromSource == "" || arg.fromSource <= 0) {
            logger.info("error at fromSource" + arg.fromSource);
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        //验证鉴权
        Coupon.validAuth(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            Coupon.receiveCoupon(arg, function (error, data) {
                if (error) {
                    res.json(error);
                } else {
                    //result.code=data[0].code;
                    result.state = data[0].code
                    logger.info("receiveCoupon response:" + JSON.stringify(result));
                    res.json(result);
                }
            });

            //async.series([ ]);
        });

    } catch (ex) {
        logger.error("get receiveCoupon  error:" + ex);
        result.code = 500;
        result.desc = "领取失败";
        res.json(result);
    }
});

//精品好券/更多好券
router.post('/queryCouponList', function (req, res, next) {
    logger.info("进入券信息查询...");
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("查询券信息， arg:" + JSON.stringify(arg));
        if (arg.userId == null || arg.userId == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        if (arg.couponRec == null || arg.couponRec == "") {

            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.couponRec == 2 || arg.couponRec == 3) {
            if (arg.browser == "" || arg.browser == null) {
                result.code = 400;
                result.desc = "浏览器标识不能为空";
                response.json(result);
                return;
            }
        }
        if(arg.couponRec == 3){
            if (arg.currentPage == null || arg.currentPage == "") {

                result.code = 500;
                result.desc = "请求参数错误";
                res.json(result);
                return;
            }
            if (arg.numPerPage == null || arg.numPerPage == "") {

                result.code = 500;
                result.desc = "请求参数错误";
                res.json(result);
                return;
            }
        }

        //验证鉴权
        Coupon.validAuth(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            Coupon.queryCouponList(arg, function (error, data) {
                if (error) {
                    res.json(error);
                } else {
                    if (arg.couponRec == 1) {
                        result.brandList = data[0].brandList;
                        result.subjectList = data[0].subjectList;
                        result.sellerList = data[0].sellerList;
                        result.productList = data[0].productList;
                        result.noLimitList = data[0].noLimitList;
                    } else {
                        result.activeList = data[0].activeList;
                    }
                }
                logger.info("响应数据， arg:" + JSON.stringify(data[0]));
                if (arg.couponRec == 3) {
                    var page = {total: data[0].pagination.totalCount, "pageCount": data[0].pagination.pageNumCount};
                    result.page = page;
                }
                logger.info("queryCouponList response:" + JSON.stringify(result));
                res.json(result);
            });

        });


    } catch (ex) {
        logger.error("get ActivList  error:" + ex);
        result.code = 500;
        result.desc = "查询券失败";
        res.json(result);
    }
});
//我的券包列表
router.post('/userCouponList', function (req, res, next) {
    logger.info("进入我的全包列表查询...");
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("查询券信息， arg:" + JSON.stringify(arg));
        if(arg.couponState == null || arg.couponState == "" || arg.couponState<0)
        {
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if(arg.numPerPage == null || arg.numPerPage == "" || arg.numPerPage<0)
        {
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if(arg.currentPage == null || arg.currentPage == "" || arg.currentPage<0)
        {
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if(arg.userId == null || arg.userId == "" || arg.userId<0)
        {
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        //验证鉴权
        Coupon.validAuth(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            Coupon.userCouponList(arg, function (error, data) {
                if (error) {
                    res.json(error);
                } else {
                    result.couponList = data[0].couponList;
                    var page = {total: data[0].pagination.totalCount, "pageCount": data[0].pagination.pageNumCount};
                    result.page = page;
                    logger.info("userCouponList response:" + JSON.stringify(result));
                    res.json(result);
                }
            });

        });

    } catch (ex) {
        logger.error("get userCouponList  error:" + ex);
        result.code = 500;
        result.desc = "查询券包列表失败";
        res.json(result);
    }

});
//我的券包列表数量
router.post('/userCouponCount', function (req, res, next) {
    logger.info("进入我的全包列表数量...");
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("券列表数量查询， arg:" + JSON.stringify(arg));
        if(arg.userId == null || arg.userId == "")
        {
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        //验证鉴权
        Coupon.validAuth(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }


            Coupon.userCouponCount(arg, function (error, data) {
                if (error) {
                    res.json(error);
                } else {
                    if (data != null) {
                        result.noUseNum = data[0].noUseNum;
                        result.alreadyUsedNum = data[0].alreadyUsedNum;
                        result.timeOutNum = data[0].timeOutNum;
                        logger.info("userCouponCount response:" + JSON.stringify(result));
                    }
                    res.json(result);
                }
            });
        });

    } catch (ex) {
        logger.error("userCouponCount  error:" + ex);
        result.code = 500;
        result.desc = "查询信息失败";
        res.json(result);
    }

});
//根据商品Id查看相关的优惠券活动列表
router.post('/queryActiveByProductId', function (req, res, next) {
    logger.info("进入优惠券活动列表...");
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("优惠券活动列表查询， arg:" + JSON.stringify(arg));
        if(arg.userId < 0)
        {
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if(arg.numPerPage == null || arg.numPerPage == "" || arg.numPerPage <= 0)
        {
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if(arg.currentPage == null || arg.currentPage == "" || arg.currentPage <= 0)
        {
            result.code = 500;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        //验证鉴权
        Coupon.validAuth(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }


            Coupon.queryActiveByProductId(arg, function (error, data) {
                if (error) {
                    res.json(error);
                } else {
                    result.list = data[0].couponList;
                    result.pagination = data[0].pagination;
                    logger.info("queryActiveByProductId response:" + JSON.stringify(result));
                    res.json(result);
                }
            });
        });

    } catch (ex) {
        logger.error("queryActiveByProductId  error:" + ex);
        result.code = 500;
        result.desc = "查询优惠券活动列表失败";
        res.json(result);
    }

});
//提交订单页面用户可用和不可用卡券列表
router.post('/queryUserCouponByOrder', function (req, res, next) {
    logger.info("进入用户可用和不可用卡券列表查询...");
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("可用列表查询， arg:" + JSON.stringify(arg));



        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        //验证鉴权
        Coupon.validAuth(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }


            Coupon.queryUserCouponByOrder(arg, function (error, data) {
                if (error) {
                    res.json(error);
                } else {
                    logger.info("queryUserCouponByOrder response:" + JSON.stringify(result));
                    result.useList = data[0].useList;
                    result.noUsedList = data[0].noUsedList;
                    res.json(result);
                }
            });

        });

    } catch (ex) {
        logger.error("queryUserCouponByOrder  error:" + ex);
        result.code = 500;
        result.desc = "列表查询失败";
        res.json(result);
    }
});

//点亮优惠券列表
router.post('/queryUserMutexCouponByOrder', function (req, res, next) {
    logger.info("进入用户可用和不可用卡券列表查询...");
    var result = {code: 200};
    try {
        var arg = req.body;
        logger.info("可用列表查询， arg:" + JSON.stringify(arg));

        if (arg.userId == null || arg.userId == "") {
            logger.info("error at userId: ");
            result.code = 500;
            result.desc = "用户id不能为空";
            res.json(result);
            return;
        }
        if (arg.productIds == null || arg.productIds == "") {
            logger.info("error at productIds: ");
            result.code = 500;
            result.desc = "商品id不能为空";
            res.json(result);
            return;
        }


        if (arg.token == "" || arg.token == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        if (arg.ppInfo == "" || arg.ppInfo == null) {
            result.code = 400;
            result.desc = "鉴权信息不能为空";
            response.json(result);
            return;
        }
        //验证鉴权
        Coupon.validAuth(arg, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }

            Coupon.queryUserMutexCouponByOrder(arg, function (error, data) {
                if (error) {
                    res.json(error);
                } else {
                    logger.info("queryUserMutexCouponByOrder response:" + JSON.stringify(result));
                    result.userCouponMutexResult = data;
                    res.json(result);
                }
            });
        });
    } catch (ex) {
        logger.error("queryUserMutexCouponByOrder  error:" + ex);
        result.code = 500;
        result.desc = "列表查询失败";
        res.json(result);
    }
});
/*!//更多好券
router.post('/findCoupon', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("优惠券列表参数， arg:" + JSON.stringify(arg));


        var   activ1={
            activId:"1" ,/!**活动id**!/
            activName:"家具大促销", /!**活动名称**!/
            activImg:"kai.jpg", /!**活动图片**!/
            couponValue:1000, /!**面值 **!/
            scoreLimit:20000, /!**使用条件,满多少积分**!/
            couponNum :200,/!**券总数量**!/
            couponTypeConfig:"仅限虚拟类商品",//券使用范围的具体描述
            sendNum:1000, /!**已经发放的数量**!/
            StartTime:"2017-06-05 13:20",//开始时间
            EndTime:"2017-06-15 13:20",//结束时间
            state:2,//!******状态 0未开始 1进行中 2已结束*******!/
            CouponState:1 //!*************卡券状态 0：表示已经达到领取上限 1表示已经领取但是没有达到领取上限  2表示没有领取过
        }

        var activ2 = {
            activId:"2" ,/!**活动id**!/
            activName:"家具热卖", /!**活动名称**!/
            activImg:"kai.jpg", /!**活动图片**!/
            couponValue:100, /!**面值 **!/
            scoreLimit:2000, /!**使用条件,满多少积分**!/
            couponNum :20000,/!**券总数量**!/
            couponTypeConfig:"仅限家具类商品",//券使用范围的具体描述
            sendNum:10000, /!**已经发放的数量**!/
            StartTime:"2017-05-05 12:00",
            EndTime:"2017-05-15 12:00",
            state:1,//!******状态 0未开始 1进行中 2已结束*******!/
            CouponState:1 //!*************卡券状态 0：表示已经达到领取上限 1表示已经领取但是没有达到领取上限  2表示没有领取过
        }
        var activ4 = {
            activId:"3" ,/!**活动id**!/
            activName:"耐克男鞋卖", /!**活动名称**!/
            activImg:"kai.jpg", /!**活动图片**!/
            couponValue:2000, /!**面值 **!/
            scoreLimit:25000, /!**使用条件,满多少积分**!/
            couponNum :2000,/!**券总数量**!/
            couponTypeConfig:"仅限男鞋",//券使用范围的具体描述
            sendNum:1000, /!**已经发放的数量**!/
            StartTime:"2017-05-01 12:00",
            EndTime:"2017-05-04 12:00",
            state:1,//!******状态 0未开始 1进行中 2已结束*******!/
            CouponState:1 //!*************卡券状态 0：表示已经达到领取上限 1表示已经领取但是没有达到领取上限  2表示没有领取过
        }
        var activ3 = {
            activId:"4" ,/!**活动id**!/
            activName:"电子产品低价处理", /!**活动名称**!/
            activImg:"kai.jpg", /!**活动图片**!/
            couponValue:1000, /!**面值 **!/
            scoreLimit:30000, /!**使用条件,满多少积分**!/
            couponNum :200,/!**券总数量**!/
            couponTypeConfig:"仅限联想电脑使用",//券使用范围的具体描述
            sendNum:1000, /!**已经发放的数量**!/
            StartTime:"2017-05-25 12:00",
            EndTime:"2017-06-15 12:00",
            state:2,//!******状态 0未开始 1进行中 2已结束*******!/
            CouponState:1 //!*************卡券状态 0：表示已经达到领取上限 1表示已经领取但是没有达到领取上限  2表示没有领取过
        }

        var couponList = [];

        couponList.push(activ1);
        couponList.push(activ2);
        couponList.push(activ3);
        couponList.push(activ4);
        if(arg.couponRec==1) {
            result.noLimitList = couponList;
            result.brandList = couponList;
            result.subjectList = couponList;
            result.sellerList = couponList;
            result.productList = couponList;
        }else{

            result.activeList = couponList;

        }
        var page ={
            total:2,             //每页多少条
            pageCount:1             //第几页
        };
        result.page = page;
        res.json(result);
    } catch (ex) {
        logger.error("查询列表失败:" + ex);
        result.code = 500;
        result.desc = "查询列表失败";
        res.json(result);
    }
});
*/

/*//用户领取优惠券
router.post('/receiveCoupon', function(req, res, next) {
    var result = {code: 200};

    var state=2;
    try{

        var arg = req.body;
        state
        logger.info("活动推荐位个数， arg:" + JSON.stringify(arg));
        result.state = 2;
        res.json(result);
    }catch (ex) {
        logger.error("get updateRecommendNum  error:" + ex);
        result.code = 500;
        result.desc = "推荐位个数设置失败";
        res.json(result);
    }
});

//我的券包列表数量
router.post('/userCouponCount', function(req, res, next) {
    var result = {code: 200};
    var  count = [1,2,3]
    try{
        var arg = req.body;
        logger.info("我的券包列表数量 arg:" + JSON.stringify(arg));

        result.noUseNum = 1;
        result.alreadyUsedNum = 2;
        result.timeOutNum = 3

        res.json(result);
    } catch (ex) {
        logger.error("查询列表失败:" + ex);
        result.code = 500;
        result.desc = "查询列表失败";
        res.json(result);
    }
});
//我的券包列表
router.post('/userCouponList', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("优惠券列表参数， arg:" + JSON.stringify(arg));

        {
            var activ1 = {
                /!***券id**!/
                id: "4",
                /!***积分限制***!/
                scoreLimit: 20000,
                /!***券值***!/
                value: 1000,
                /!****券类型****!/
                type: 2,
                /!****券描述*****!/
                desc: "仅限童装使用",
                /!***有效期开始***!/
                beginTime: "2017-09-09",
                /!****有效期结束****!/
                endTime: "2017-12-12"
            }


            var activ2 = {
                /!***券id**!/
                id: "5",
                /!***积分限制***!/
                scoreLimit: 20000,
                /!***券值***!/
                value: 1000,
                /!****券类型****!/
                type: 1,
                /!****券描述*****!/
                desc: "仅限联想手机使用",
                /!***有效期开始***!/
                beginTime: "2017-09-09",
                /!****有效期结束****!/
                endTime: "2017-12-12"
            }
            var couponList = [];

            couponList.push(activ1);
            couponList.push(activ2);

            result.list = couponList;

            var page ={
                total:2,             //每页多少条
                pageCount:1             //第几页
            };
            result.page = page;
            res.json(result);
        }
    } catch (ex) {
        logger.error("查询列表失败:" + ex);
        result.code = 500;
        result.desc = "查询列表失败";
        res.json(result);
    }
});
//根据商品Id查看相关的优惠券活动列表
router.post('/queryActiveByProductId', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("优惠券列表参数， arg:" + JSON.stringify(arg));

        {
            var  list=
            {
                activId:"7", /!**活动id**!/
            activName:"大减价", /!**活动名称**!/
            activImg:"kik.jpg",/!**活动图片**!/
            couponValue:100, /!**面值 **!/
            scoreLimit:10000, /!**使用条件,满多少积分**!/
            couponNum:200, /!**券总数量**!/
            couponTypeConfig:"仅限老北京布鞋",//,券使用范围的具体描述
                sendNum:100,/!**已经发放的数量**!/
            state:1, /!******状态 0未开始 1进行中 2已结束*******!/
            CouponState:1, /!*************卡券状态 0表示没有领取过  1表示已经领取但是没有达到领取上限  3：表示已经达到领取上限******************!/
            beginTime:"2017-05-09 24:00",//券有效开始时间
                endTime:"2017-06-06 24:00",//券结束时间
            }



            var couponList = [];

            couponList.push(list);

            result.list = couponList;

            var page ={
                total:2,             //每页多少条
                pageCount:1             //第几页
            };
            result.page = page;
            res.json(result);
        }
    } catch (ex) {
        logger.error("查询列表失败:" + ex);
        result.code = 500;
        result.desc = "查询列表失败";
        res.json(result);
    }
});

//6 提交订单页面卡券列表
router.post('/queryCouponListByProducts', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("优惠券列表参数， arg:" + JSON.stringify(arg));

        {
            var activ1 = {
                /!***券id**!/
                id: "d17",
                /!***积分限制***!/
                scoreLimit: 20000,
                /!***券值***!/
                value: 1000,
                /!****券类型****!/
                type: 2,
                /!****券描述*****!/
                desc: "仅限童装使用",
                /!***有效期开始***!/
                beginTime: "2017-09-09",
                /!****有效期结束****!/
                endTime: "2017-12-12"
            }


            var activ2 = {
                /!***券id**!/
                id: "y20",
                /!***积分限制***!/
                scoreLimit: 20000,
                /!***券值***!/
                value: 1000,
                /!****券类型****!/
                type: 1,
                /!****券描述*****!/
                desc: "仅限联想手机使用",
                /!***有效期开始***!/
                beginTime: "2017-09-09",
                /!****有效期结束****!/
                endTime: "2017-12-12"
            }
            var couponList = [];

            couponList.push(activ1);
            couponList.push(activ2);

            result.openCouponList = couponList;
            result.offCouponList = couponList;

            var page ={
                total:2,             //每页多少条
                pageCount:1             //第几页
            };
            result.page = page;
            res.json(result);
        }
    } catch (ex) {
        logger.error("查询列表失败:" + ex);
        result.code = 500;
        result.desc = "查询列表失败";
        res.json(result);
    }
});
//66需要点亮的卡券列表[]
router.post('/queryUserMutexCouponByOrder', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("优惠券列表参数， arg:" + JSON.stringify(arg));

        {
            var couponIdList1 = {
                /!***券id**!/
                id: "qw17",

            }


            var couponIdList2 = {
                /!***券id**!/
                id: "ft20",

            }
            var couponList = [];

            couponList.push(couponIdList1);
            couponList.push(couponIdList2);

            result.couponList = couponList;


            var page ={
                total:2,             //每页多少条
                pageCount:1             //第几页
            };
            result.page = page;
            res.json(result);
        }
    } catch (ex) {
        logger.error("查询列表失败:" + ex);
        result.code = 500;
        result.desc = "查询列表失败";
        res.json(result);
    }
});*!/*/
module.exports = router;
