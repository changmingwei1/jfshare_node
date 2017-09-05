/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Coupon = require('../lib/models/coupon');

var page = require('../lib/thrift/gen_code/pagination_types.js');




//修改领取次数限制
router.post('/updateAstrictNum', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("修改活动限领参数， arg:" + JSON.stringify(arg));
        res.json(result);
    }catch (ex) {
        logger.error("get UpdateAstrictNum  error:" + ex);
        result.code = 500;
        result.desc = "修改限制领取次数失败";
        res.json(result);
    }
});

//优惠券活动列表查询
router.post('/activList', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("查询优惠券活动列表参数， arg:" + JSON.stringify(arg));
        if(arg.currentPage.length==0 || arg.currentPage ==null){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if(arg.numPerPage.length==0 || arg.numPerPage ==null){
            result.code = 500;
            result.desc = "";
            res.json(result);
            return;
        }
        Coupon.queryActivityList(arg,function(error,data){
            if (error) {
                res.json(error);
                return;
            } else {
                result.activeList=data[0].activeList;
                result.page = data[0].pagination;
                logger.info("queryActivityList response:" + JSON.stringify(result));
                res.json(result);
                return;
            }
        });
    }catch (ex) {
        logger.error("get ActivList  error:" + ex);
        result.code = 500;
        result.desc = "查询活动列表失败";
        res.json(result);
    }
});

//新建积分券活动**
router.post('/createCouponActiv', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("新建积分券活动参数， arg:" + JSON.stringify(arg));

        Coupon.createActivity(arg,function(error,data){
            if (error) {
                res.json(error);
            } else {
                result.list=data;
                result.page = page;
                logger.info("createCouponActiv response:" + JSON.stringify(result));
                res.json(result);
            }
        });

    }catch (ex) {
        logger.error("get createCouponActiv  error:" + ex);
        result.code = 500;
        result.desc = "新建积分券活动失败";
        res.json(result);
    }
});


//查看活动详情**
router.post('/activInfo', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("查看活动详情参数， arg:" + JSON.stringify(arg));
        if(arg.activId==null||arg.activId.length==0){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        Coupon.selectActivById(arg,function(error,data){
            logger.info("activInfo response:" + JSON.stringify(data));
            if (error) {
                res.json(error);
            } else {
                result.couponActiv=data[0].couponActiv;
                logger.info("activInfo response:" + JSON.stringify(result));
                res.json(result);
            }
        });

    }catch (ex) {
        logger.error("get activInfo  error:" + ex);
        result.code = 500;
        result.desc = "查看活动详情失败";
        res.json(result);
    }
});

//修改积分券活动updateActiv
router.post('/updateActiv', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("新建积分券活动参数， arg:" + JSON.stringify(arg));
        if(arg.activId==null||arg.activId.length==0){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        Coupon.updateActiv(arg,function(error,data){
            if (error) {
                res.json(error);
            } else {
               // result.list=data[0];
                logger.info("updateActiv response:" + JSON.stringify(result));
                res.json(result);
            }
        });

    }catch (ex) {
        logger.error("get updateActiv  error:" + ex);
        result.code = 500;
        result.desc = "修改积分券活动失败";
        res.json(result);
    }
});


//导出优惠券发放记录
router.post('/exportActivDetail', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("导出优惠券发放记录参数， arg:" + JSON.stringify(arg));
        if(arg.activId==null||arg.activId.length==0){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        Coupon.exportActivDetail(arg,function(error,data){
            if (error) {
                res.json(error);
            } else {
                logger.info("exportActivDetail response:" + JSON.stringify(result));
                res.json(result);
            }
        });

    }catch (ex) {
        logger.error("get exportActivDetail  error:" + ex);
        result.code = 500;
        result.desc = "导出优惠券发放失败";
        res.json(result);
    }
});





//查询积分券发放记录
router.post('/couponList', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("查询积分券发放记录参数， arg:" + JSON.stringify(arg));
        if(arg.activId<0){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.currentPage<1){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.numPerPage<1){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        Coupon.selectActivDetailById(arg,function(error,data){

            if (error) {
                res.json(error);
                return;
            } else {
                result.list=data[0].couponList;
                result.page = data[0].pagination;
                logger.info("couponList response:" + JSON.stringify(data[0]));
                res.json(result)

            }
        });
    } catch (ex) {
        logger.error("查询列表失败:" + ex);
        result.code = 500;
        result.desc = "查询列表失败";
        res.json(result);
    }
});

//推荐位个数设置
router.post('/updateRecommendNum', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("活动推荐位个数， arg:" + JSON.stringify(arg));
        res.json(result);
    }catch (ex) {
        logger.error("get updateRecommendNum  error:" + ex);
        result.code = 500;
        result.desc = "推荐位个数设置失败";
        res.json(result);
    }
});

//添加优惠券活动推荐位
router.post('/addRecommendState', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("添加推荐位参数， arg:" + JSON.stringify(arg));
        if(arg==null||arg.length<1){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            res.json(result);
        }
        Coupon.addRecommend(arg,function(error,data){
            if (error) {
                res.json(error);
                return;
            } else {
                logger.info("addRecommendState response:" + JSON.stringify(result));
                res.json(result);
                return;
            }
        });
    }catch (ex) {
        logger.error("get addRecommendState  error:" + ex);
        result.code = 500;
        result.desc = "添加推荐位失败";
        res.json(result);
    }
});

//	配置推荐位/添加推荐位列表
router.post('/confRecommendList', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("配置推荐位/添加推荐位列表参数， arg:" + JSON.stringify(arg));

        if(arg.activTop >1||arg.activTop<0){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.currentPage<0){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.numPerPage<1){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        Coupon.confRecommendList(arg,function(error,data){
            if (error) {
                res.json(error);
                return;
            } else {
                result.activeList=data[0].activeList;
                result.page = data[0].pagination;
                logger.info("confRecommendList response:" + JSON.stringify(result));
                res.json(result);
                return;
            }
        });

    }catch (ex) {
        logger.error("get confRecommendList  error:" + ex);
        result.code = 500;
        result.desc = "配置推荐位/添加推荐位列表失败";
        res.json(result);
    }
});

//	取消活动推荐位
router.post('/undoRecommendState', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("取消活动推荐位参数， arg:" + JSON.stringify(arg));
        Coupon.undoRecommendState(arg,function(error,data){
            if (error) {
                res.json(error);
                return;
            } else {
                logger.info("undoRecommendState response:" + JSON.stringify(result));
                res.json(result);
                return;
            }
        });
    }catch (ex) {
        logger.error("get undoRecommendState  error:" + ex);
        result.code = 500;
        result.desc = "取消活动推荐位失败";
        res.json(result);
    }
});

//	移动活动推荐位
router.post('/moveActiv', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("移动活动推荐位参数， arg:" + JSON.stringify(arg));
        Coupon.moveActiv(arg,function(error,data){
            if (error) {
                res.json(error);
                return;
            } else {
                logger.info("moveActiv response:" + JSON.stringify(result));
                res.json(result);
                return;
            }
        });
    }catch (ex) {
        logger.error("get moveActiv  error:" + ex);
        result.code = 500;
        result.desc = "移动活动推荐位失败";
        res.json(result);
    }
});


//	手动结束当前活动
router.post('/overActiv', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("手动结束当前活动参数， arg:" + JSON.stringify(arg));
        Coupon.overActiv(arg,function(error,data){
            if (error) {
                res.json(error);
                return;
            } else {
                logger.info("overActiv response:" + JSON.stringify(result));
                res.json(result);
                return;
            }
        });
    }catch (ex) {
        logger.error("get overActiv  error:" + ex);
        result.code = 500;
        result.desc = "结束活动失败";
        res.json(result);
    }
});


//添加发放渠道
router.post('/addSource', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("添加发放渠道参数， arg:" + JSON.stringify(arg));
        res.json(result);
    }catch (ex) {
        logger.error("get addSource  error:" + ex);
        result.code = 500;
        result.desc = "添加发放渠道失败";
        res.json(result);
    }
});

//删除发放渠道
router.post('/delSource', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("删除发放渠道参数， arg:" + JSON.stringify(arg));
        res.json(result);
    }catch (ex) {
        logger.error("get delSource  error:" + ex);
        result.code = 500;
        result.desc = "删除发放渠道失败";
        res.json(result);
    }
});

//查询发放渠道
router.post('/querySource', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("查看发放渠道参数， arg:" + JSON.stringify(arg));
        var id=15;                                 //活动渠道ID
        var name = "中国移动";                      //活动渠道名称
        var detail="该渠道合作时间为2016.09-2019.10"; //活动渠道详情

        result.id=id;
        result.name=name;
        result.detail=detail;

        res.json(result);
    }catch (ex) {
        logger.error("get querySource  error:" + ex);
        result.code = 500;
        result.desc = "查询发放渠道失败";
        res.json(result);
    }
});

//查询发放渠道列表
router.post('/querySourceList', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("查看发放渠道列表参数， arg:" + JSON.stringify(arg));
        var source1 = {
            id:12,                  //渠道id
            name:"中国电信",               //活动渠道名称
            detail:"该渠道合作时间为2015-05-10至2030-01-01",   //活动渠道详情
            createTime:"2015-05-10",        //活动渠道创建时间[yyyy-MM-dd]
            state:1                  //活动渠道状态 [默认0:未使用, 1:使用中]
        }

        var source2 = {
            id:13,                  //渠道id
            name:"中国电信",               //活动渠道名称
            detail:"该渠道合作时间为2017-05-10至2019-01-01",   //活动渠道详情
            createTime:"2017-05-04",        //活动渠道创建时间[yyyy-MM-dd]
            state:0                  //活动渠道状态 [默认0:未使用, 1:使用中]
        }
        var sourceList = [];

        sourceList.push(source1);
        sourceList.push(source2);
        result.list = sourceList;
        res.json(result);

    }catch (ex) {
        logger.error("get querySource  error:" + ex);
        result.code = 500;
        result.desc = "查询发放渠道列表失败";
        res.json(result);
    }
});


//修改发放渠道
router.post('/updateSource', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.body;
        logger.info("修改发放渠道的参数， arg:" + JSON.stringify(arg));
        res.json(result);
    }catch (ex) {
        logger.error("get updateSource  error:" + ex);
        result.code = 500;
        result.desc = "查询发放渠道失败";
        res.json(result);
    }
});

/*创建抵扣券*/
router.post('/createDiscountActiv', function (req, res, next) {
    var resContent = {code: "0"};
    try {
        var arg = req.body;
        logger.info("创建抵扣券请求参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.source == null||arg.source == "") {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.name == null||arg.name == "") {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.value == null||arg.value == "") {
            resContent.code = "1000";
            resContent.desc = "活动名不能为空";
            res.json(resContent);
            return;
        }
        if (arg.couponNum == null||arg.couponNum == "") {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.startTime == null||arg.startTime == "") {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.endTime == null||arg.endTime == "") {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.scope == null||arg.scope == "") {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.scopeList == null||arg.scopeList == "") {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        Coupon.createDiscountActiv(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {
                if(data[0].code==0){
                    resContent.desc = "创建活动成功";
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.desc = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("创建活动失败 because :" + ex);
        resContent.code = "1014";
        resContent.desc = "创建活动失败";
        res.json(resContent);
    }
});
/*查询抵扣券活动列表*/
router.post('/queryList', function (req, res, next) {
    var resContent = {code: "200"};
    try {
        var arg = req.body;
        logger.info("查询抵扣券活动列表参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.currentPage == null||arg.currentPage == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.pageSize == null||arg.pageSize == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }

        Coupon.queryAllDiscountActiv(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {
                if(data[0].result.code==0){
                    resContent.activList = data[0].activList;
                    resContent.pagination = data[0].pagination;
                    res.json(resContent);

                }else if(data[0].result.code==1){

                    var failList = data[0].result.failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.desc = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("查询活动列表失败 because :" + ex);
        resContent.code = "500";
        resContent.desc = "查询失败";
        res.json(resContent);
    }
});
/*查询抵扣券列表*/
router.post('/queryCouponList', function (req, res, next) {
    var resContent = {code: "200"};
    try {
        var arg = req.body;
        logger.info("查询抵扣券列表参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.currentPage == null||arg.currentPage == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.pageSize == null||arg.pageSize == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.activId == null||arg.activId == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.name == null||arg.name == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.value == null||arg.value == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.couponNum == null||arg.couponNum == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.startTime == null||arg.startTime == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.endTime == null||arg.endTime == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        Coupon.queryCouponList(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {
                if(data[0].result.code==0){
                    resContent.activ = data[0].activ;
                    resContent.couponList = data[0].couponList;
                    resContent.pagination = data[0].pagination;
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].result.failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.desc = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("查询抵扣券列表失败 because :" + ex);
        resContent.code = "500";
        resContent.desc = "查询失败";
        res.json(resContent);
    }
});
/*查看活动详情*/
router.post('/queryActivDetail', function (req, res, next) {
    var resContent = {code: "200"};
    try {
        var arg = req.body;
        logger.info("查询活动详情参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.activId == null||arg.activId == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }

        Coupon.queryActivDetail(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {
                if(data[0].result.code==0){
                    resContent.activ = data[0].activ;
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].result.failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.desc = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("查询活动详情失败 because :" + ex);
        resContent.code = "500";
        resContent.desc = "查询失败";
        res.json(resContent);
    }
});

/*增发抵扣券*/
router.post('/additionalActiv', function (req, res, next) {
    var resContent = {code: "200"};
    try {
        var arg = req.body;
        logger.info("增发抵扣券请求参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.id == null||arg.id == '') {
            resContent.code = "1000";
            resContent.desc = "id参数错误";
            res.json(resContent);
            return;
        }
        if (arg.value == null||arg.value == '') {
            resContent.code = "1000";
            resContent.desc = "value参数错误";
            res.json(resContent);
            return;
        }
        if (arg.couponNum == null||arg.couponNum == '') {
            resContent.code = "1000";
            resContent.desc = "couponNum参数错误";
            res.json(resContent);
            return;
        }
        if (arg.startTime == null||arg.startTime == '') {
            resContent.code = "1000";
            resContent.desc = "startTime参数错误";
            res.json(resContent);
            return;
        }
        if (arg.endTime == null||arg.endTime == '') {
            resContent.code = "1000";
            resContent.desc = "endTime参数错误";
            res.json(resContent);
            return;
        }

        Coupon.updateDiscountActiv(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {
                if(data[0].code==0){
                    resContent.desc = '增发成功';
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.desc = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("增发券码失败 because :" + ex);
        resContent.code = "500";
        resContent.desc = "更新失败";
        res.json(resContent);
    }
});

/*作废抵扣券*/
router.post('/invalidCoupon', function (req, res, next) {
    var resContent = {code: "200"};
    try {
        var arg = req.body;
        logger.info("增发抵扣券请求参数， arg:" + JSON.stringify(arg));
        if (arg == null) {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.couponId == null||arg.couponId == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }
        if (arg.adminPwd == null||arg.adminPwd == '') {
            resContent.code = "1000";
            resContent.desc = "参数错误";
            res.json(resContent);
            return;
        }

        Coupon.invalidCoupon(arg, function (err, data) {
            if(err){
                res.json(err);
            }else {
                if(data[0].code==0){
                    resContent.desc = '作废成功';
                    res.json(resContent);
                }else if(data[0].code==1){

                    var failList = data[0].failDescList[0];
                    resContent.code = failList.failCode+"";
                    resContent.desc = failList.desc;
                    res.json(resContent);
                }
            }
        });
    } catch (ex) {
        logger.error("作废抵扣券失败 because :" + ex);
        resContent.code = "500";
        resContent.desc = "作废失败";
        res.json(resContent);
    }
});




module.exports = router;
