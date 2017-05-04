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
//
router.post('/couponList', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("优惠券列表参数， arg:" + JSON.stringify(arg));

        var coupon = {
            id:3,
            mobile:18301198617
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
        result.page = page;
        res.json(result);
    } catch (ex) {
        logger.error("查询列表失败:" + ex);
        result.code = 500;
        result.desc = "查询列表失败";
        res.json(result);
    }
});

module.exports = router;