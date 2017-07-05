/**
 * Created by Administrator on 2016/5/6 0006.
 */

var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var AfterSale = require('../lib/models/afterSale');

//售后审核
router.post('/review', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("售后审核的参数:" + JSON.stringify(params));
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
        if (params.userId == null || params.userId == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if (params.sellerId == null || params.sellerId == "") {
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if (params.reviewResult == "1") { //表示拒绝
            params.state = 3;
        } else if (params.reviewResult == "0") { //表示同意

            params.state = 2; //根据实际情况定义 如 1：新建（待审核） 2：审核通过 3：审核不通过
        } else {
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        AfterSale.auditPass(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info(" AfterSale.auditPass response:" + JSON.stringify(result));
            return response.json(result);

        });
    } catch (ex) {
        logger.error(" AfterSale.auditPass error:" + ex);
        result.code = 500;
        result.desc = "审核失败";
        response.json(result);
    }
});
//审核信息查询
router.post('/toReview', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("审核信息查询， arg:" + JSON.stringify(params));

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

        AfterSale.queryAfterSale(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.message = data[0];
            logger.info("AfterSale.queryAfterSale response:" + JSON.stringify(result));
            return response.json(result);

        });
    } catch (ex) {
        logger.error("AfterSale.queryAfterSale error:" + ex);
        result.code = 500;
        result.desc = "查询审核信息失败";
        response.json(result);
    }
});

//查询售后订单退积分明细
router.post('/queryReturnScore', function (request, response, next) {
    logger.info("查询售后订单退积分明细流程");
    var result = {code: 200};
    try {
        var params = request.body;
        if (params.productId == null || params.productId == "") {
            result.code = 400;
            result.desc = "商品编码不能为空";
            response.json(result);
            return;
        }
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "订单号不能为空";
            response.json(result);
            return;
        }
        //参数校验
        logger.info("queryMaxReturnScore params:" + JSON.stringify(params));
        AfterSale.queryMaxReturnScore(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("queryMaxReturnScore result结果:" + JSON.stringify(data));
            result.sbpList = data.sbpList;
            if(data.sbpList!=null && data.sbpList.size>0){
                result.sbpList = data.sbpList;
            }
            result.productFinishScore = data.productFinishScore;
            result.orderFinishScore = data.orderFinishScore;
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error("查询售后订单退积分明细错误:" + ex);
        result.code = 500;
        result.desc = "查询售后订单退积分明细错误";
        response.json(result);
    }
});


//退积分
router.post('/returnScore', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("售后订单退积分参数， arg:" + JSON.stringify(params));

        if (params.productId == null || params.productId == "") {
            result.code = 400;
            result.desc = "商品编码不能为空";
            response.json(result);
            return;
        }
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "订单号不能为空";
            response.json(result);
            return;
        }
        if (params.passWord == null || params.passWord == "") {
            result.code = 400;
            result.desc = "操作密码不能为空";
            response.json(result);
            return;
        }
        if (params.scoreAmount == null || params.scoreAmount == "") {
            result.code = 400;
            result.desc = "退积分额不能为空";
            response.json(result);
            return;
        }

        AfterSale.returnScore(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.message = data[0];
            logger.info("AfterSale.returnScore response:" + JSON.stringify(result));
            return response.json(result);

        });
    } catch (ex) {
        logger.error("AfterSale.returnScore error:" + ex);
        result.code = 500;
        result.desc = "售后订单退积分失败";
        response.json(result);
    }
});


module.exports = router;