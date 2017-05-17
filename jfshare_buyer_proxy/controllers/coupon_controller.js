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
/*//根据活动查券信息
router.post('/selectActivDetailById', function(req, res, next) {
    logger.info("进入券信息查询...");
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("根据活动查询券信息， arg:" + JSON.stringify(arg));
        Coupon.selectActivDetailById(arg,function(error,data) {
            if (error) {
                response.json(error);
            } else {
                result.list = data;
                result.page = page;
                logger.info("selectActivDetailById response:" + JSON.stringify(result));
                response.json(result);
            }
        });
        res.json(result);
        }catch (ex) {
                logger.error("get selectActivDetailById  error:" + ex);
                result.code = 500;
                result.desc = "查询券列表失败";
                res.json(result);
            }

        });


//web端用户领取优惠券
        router.post('/receiveCoupon', function(req, res, next) {
            logger.info("进入领取优惠券...");
            var result = {code: 200};
            try{
                var arg = req.body;
                logger.info("领取优惠券， arg:" + JSON.stringify(arg));

                Coupon.receiveCoupon(arg,function(error,data){
                    if (error) {
                        response.json(error);
                    } else {
                        logger.info("receiveCoupon response:" + JSON.stringify(result));
                        response.json(result);
                    }
                });
                res.json(result);
            }catch (ex) {
                logger.error("get receiveCoupon  error:" + ex);
                result.code = 500;
                result.desc = "领取失败";
                res.json(result);
            }

        });
//分享生成的链接
                router.post('shareUrl', function(req, res, next) {
                    logger.info("进入分享链接...");
                    var result = {code: 200};
                    try{
                        var arg = req.body;
                        logger.info("分享链接， arg:" + JSON.stringify(arg));
                        Coupon.shareUrl(arg,function(error,data){
                            if (error) {
                                response.json(error);
                            } else {
                                logger.info("shareUrl response:" + JSON.stringify(result));
                                response.json(result);
                            }
                        });
                        res.json(result);
                    }catch (ex) {
                        logger.error("get ActivList  error:" + ex);
                        result.code = 500;
                        result.desc = "分享链接失败";
                        res.json(result);
                    }

                });
//精品好券/更多好券
router.post('/queryCouponList', function(req, res, next) {
    logger.info("进入券信息查询...");
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("查询券信息， arg:" + JSON.stringify(arg));
        Coupon.queryCouponList(arg,function(error,data){
            if (error) {
                response.json(error);
            } else {
                result.list=data;
                result.page = page;
                logger.info("queryCouponList response:" + JSON.stringify(result));
                response.json(result);
            }
        });
        res.json(result);
    }catch (ex) {
        logger.error("get ActivList  error:" + ex);
        result.code = 500;
        result.desc = "分享链接失败";
        res.json(result);
    }

});
//我的全包列表
router.post('/userCouponList', function(req, res, next) {
    logger.info("进入我的全包列表查询...");
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("查询券信息， arg:" + JSON.stringify(arg));
        Coupon.userCouponList(arg,function(error,data){
            if (error) {
                response.json(error);
            } else {
                result.list=data;
                result.page = page;
                logger.info("userCouponList response:" + JSON.stringify(result));
                response.json(result);
            }
        });
        res.json(result);
    }catch (ex) {
        logger.error("get userCouponList  error:" + ex);
        result.code = 500;
        result.desc = "查询券包失败";
        res.json(result);
    }

});
//我的券包列表数量
router.post('/userCouponCount', function(req, res, next) {
    logger.info("进入我的全包列表数量...");
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("券列表数量查询， arg:" + JSON.stringify(arg));
       Coupon.userCouponCount(arg,function(error,data){
            if (error) {
                response.json(error);
            } else {
                logger.info("userCouponCount response:" + JSON.stringify(result));
                response.json(result);
            }
        });
        res.json(result);
    }catch (ex) {
        logger.error("userCouponCount  error:" + ex);
        result.code = 500;
        result.desc = "查询信息失败";
        res.json(result);
    }

});
//根据商品Id查看相关的优惠券活动列表
router.post('/queryActiveByProductId', function(req, res, next) {
    logger.info("进入优惠券活动列表...");
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("优惠券活动列表查询， arg:" + JSON.stringify(arg));
        Coupon.queryActiveByProductId(arg,function(error,data){
            if (error) {
                response.json(error);
            } else {
                logger.info("queryActiveByProductId response:" + JSON.stringify(result));
                response.json(result);
            }
        });
        res.json(result);
    }catch (ex) {
        logger.error("queryActiveByProductId  error:" + ex);
        result.code = 500;
        result.desc = "查询优惠券活动列表失败";
        res.json(result);
    }

});
//提交订单页面用户可用和不可用卡券列表
router.post('/queryUserCouponByOrder', function(req, res, next) {
    logger.info("进入用户可用和不可用卡券列表查询...");
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("可用列表查询， arg:" + JSON.stringify(arg));
        Coupon.queryUserCouponByOrder(arg,function(error,data){
            if (error) {
                response.json(error);
            } else {
                logger.info("queryUserCouponByOrder response:" + JSON.stringify(result));
                response.json(result);
            }
        });
res.json(result);
}catch (ex) {
    logger.error("queryUserCouponByOrder  error:" + ex);
    result.code = 500;
    result.desc = "列表查询失败";
    res.json(result);
}

});*/
//更多好券
router.post('/findCoupon', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("优惠券列表参数， arg:" + JSON.stringify(arg));


        var   activ1={
                activId:"1" ,/**活动id**/
                activName:"卖", /**活动名称**/
                activImg:"kai.jpg", /**活动图片**/
                couponValue:1000, /**面值 **/
                scoreLimit:20000, /**使用条件,满多少积分**/
               couponNum :200,/**券总数量**/
               couponTypeConfig:"仅限家具类商品",//券使用范围的具体描述
                sendNum:1000, /**已经发放的数量**/
                 state:2,//******状态 0未开始 1进行中 2已结束*******/
              CouponState:1 //*************卡券状态 0：表示已经达到领取上限 1表示已经领取但是没有达到领取上限  2表示没有领取过
    }

        var activ2 = {
            activId:"1" ,/**活动id**/
            activName:"卖", /**活动名称**/
            activImg:"kai.jpg", /**活动图片**/
            couponValue:1000, /**面值 **/
            scoreLimit:20000, /**使用条件,满多少积分**/
            couponNum :200,/**券总数量**/
            couponTypeConfig:"仅限家具类商品",//券使用范围的具体描述
            sendNum:1000, /**已经发放的数量**/
            state:2,//******状态 0未开始 1进行中 2已结束*******/
            CouponState:1 //*************卡券状态 0：表示已经达到领取上限 1表示已经领取但是没有达到领取上限  2表示没有领取过
        }
        var couponList = [];

        couponList.push(activ1);
        couponList.push(activ2);
        if(arg.couponRec==2) {
            result.noLimitList = couponList;
            result.brandList = couponList;
            result.subjectList = couponList;
            result.sellerList = couponList;
            result.productList = couponList;
        }else{

            result.activeList = couponList;

        }
        var page ={
            totalCount:2,             //总记录数
            pageNumCount:1,           //总页数
            numPerPage:20,            //每页记录数
            currentPage:1             //当前页数
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

//用户领取优惠券
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
                /***券id**/
                id: "yw234",
                /***积分限制***/
                scoreLimit: 20000,
                /***券值***/
                value: 1000,
                /****券类型****/
                type: 2,
                /****券描述*****/
                desc: "仅限童装使用",
                /***有效期开始***/
                beginTime: "2017-09-09",
                /****有效期结束****/
                endTime: "2017-12-12"
            }


            var activ2 = {
                /***券id**/
                id: "yw22234",
                /***积分限制***/
                scoreLimit: 20000,
                /***券值***/
                value: 1000,
                /****券类型****/
                type: 1,
                /****券描述*****/
                desc: "仅限联想手机使用",
                /***有效期开始***/
                beginTime: "2017-09-09",
                /****有效期结束****/
                endTime: "2017-12-12"
            }
            var couponList = [];

            couponList.push(activ1);
            couponList.push(activ2);

            result.list = couponList;

            var page = {
                totalCount: 2,             //总记录数
                pageNumCount: 1,           //总页数
                numPerPage: 20,            //每页记录数
                currentPage: 1             //当前页数
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
                 activId:"we333", /**活动id**/
                 activName:"大减价", /**活动名称**/
                 activImg:"kik.jpg",/**活动图片**/
                  couponValue:100, /**面值 **/
                  scoreLimit:10000, /**使用条件,满多少积分**/
                 couponNum:200, /**券总数量**/
                couponTypeConfig:"仅限老北京布鞋",//,券使用范围的具体描述
                sendNum:100,/**已经发放的数量**/
               state:1, /******状态 0未开始 1进行中 2已结束*******/
              CouponState:1, /*************卡券状态 0表示没有领取过  1表示已经领取但是没有达到领取上限  3：表示已经达到领取上限******************/

       }



            var couponList = [];

            couponList.push(list);

            result.list = couponList;

            var page = {
                totalCount: 2,             //总记录数
                pageNumCount: 1,           //总页数
                numPerPage: 20,            //每页记录数
                currentPage: 1             //当前页数
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
//6提交订单页面卡券列表
router.post('/queryCouponListByProducts', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("优惠券列表参数， arg:" + JSON.stringify(arg));

        {
            var activ1 = {
                /***券id**/
                id: "yw234",
                /***积分限制***/
                scoreLimit: 20000,
                /***券值***/
                value: 1000,
                /****券类型****/
                type: 2,
                /****券描述*****/
                desc: "仅限童装使用",
                /***有效期开始***/
                beginTime: "2017-09-09",
                /****有效期结束****/
                endTime: "2017-12-12"
            }


            var activ2 = {
                /***券id**/
                id: "yw22234",
                /***积分限制***/
                scoreLimit: 20000,
                /***券值***/
                value: 1000,
                /****券类型****/
                type: 1,
                /****券描述*****/
                desc: "仅限联想手机使用",
                /***有效期开始***/
                beginTime: "2017-09-09",
                /****有效期结束****/
                endTime: "2017-12-12"
            }
            var couponList = [];

            couponList.push(activ1);
            couponList.push(activ2);

            result.openCouponList = couponList;
            result.offCouponList = couponList;

            var page = {
                totalCount: 2,             //总记录数
                pageNumCount: 1,           //总页数
                numPerPage: 20,            //每页记录数
                currentPage: 1             //当前页数
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

module.exports =router;
