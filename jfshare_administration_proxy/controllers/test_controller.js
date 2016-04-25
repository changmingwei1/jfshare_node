/**
 * Created by zhaoshenghai on 16/3/20.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Util = require('../lib/models/util');

router.get('', function(req, res, next){
    var subjectId = req.query.id;

    Product.queryProductList({subjectId:subjectId}, function(data){
        var resContent = {code:200};
        var dataArr = [];

        var code = data[0].result.code;
        if(code == 1){
            resContent.code = 500;
            resContent.desc = "失败";
            res.json(resContent);
        } else {
            var productSurveyList = data[0].productSurveyList;
            productSurveyList.forEach(function(a){
                var imgUri = a.imgUrl.split(",")[0];
                dataArr.push({productId: a.productId, productName: a.productName, curPrice: a.curPrice, imgUrl: imgUri});
            });
            resContent.productList = dataArr;
            res.json(resContent);
        }
    });
});

router.get('/async', function (req, res, next) {
    var subjectId = req.query.id;

    async.waterfall(
        [
            function (callback) {
                Product.queryProductList({subjectId: subjectId}, function (data) {
                    var resContent = {code: 200};
                    var dataArr = [];

                    var code = data[0].result.code;
                    if (code == 1) {
                        resContent.code = 500;
                        resContent.desc = "失败";
                        res.json(resContent);
                    } else {
                        var productSurveyList = data[0].productSurveyList;
                        productSurveyList.forEach(function (a) {
                            var imgUri = a.imgUrl.split(",")[0];
                            dataArr.push({
                                productId: a.productId,
                                productName: a.productName,
                                curPrice: a.curPrice,
                                imgUrl: imgUri
                            });
                        });
                        resContent.productList = dataArr;
                        callback(null, resContent);
                        //callback("err", null);
                    }
                });
            },
            function (data, callback) {
                data.msg = "我石第二个function222222222222";
                callback(null, data);
            }
        ],
        function (err, data) {
            if (err) {
                res.json({msg: '失败'});
            } else {
                res.json(data);
            }
        });

});


router.get('/httpstest', function(req, res, next) {
   Util.getOpenApi(null, function(code, d) {
       logger.info("data:" + JSON.stringify(d));
       res.end(d);
   });
});

router.get('/getcode', function(req, res, next) {
    Util.getCode(null, function(code, d) {
        logger.info("data:" + JSON.stringify(d));
        res.end(d);
    });
});


router.get('/payApply', function(req, res, next) {
    Product.payApply("67", ["17640067"], "4", "o4tVauHPJpUkC4fOjXoa5NAMc2n8", function(err, data) {
        logger.info("response:" + JSON.stringify(data));
    });
});

module.exports = router;