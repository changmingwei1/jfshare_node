/**
 * Created by Administrator on 2016/5/6 0006.
 */

var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var AfterSale = require('../lib/models/afterSale');

//审核信息查询
router.post('/toReview', function(request, response, next) {
    var result = {code: 200};

    try{
        var params = request.body;
        logger.info("审核信息查询， arg:" + JSON.stringify(params));

        if(params.productId == null || params.productId == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        if(params.orderId == null || params.orderId == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }

        if(params.skuNum == null || params.skuNum == ""){
            result.code = 400;
            result.desc = "请求参数错误";
            response.json(result);
            return;
        }
        AfterSale.queryAfterSale(params,function(err, data) {
            if(err){
                response.json(err);
                return;
            }
            response.json(data);
            logger.info("AfterSale.queryAfterSale response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("AfterSale.queryAfterSale error:" + ex);
        result.code = 500;
        result.desc = "查询审核信息失败";
        response.json(result);
    }
});


module.exports = router;