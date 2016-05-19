/**
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Address = require('../lib/models/address');



//查询全国省份列表
router.post('/getprovinces', function(req, res, next) {
    var result = {code: 200};
    try{
        Address.getProvinces(function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            result.provicnceList = data;
            res.json(result);
            logger.info("get provinces response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("get provinces error:" + ex);
        result.code = 500;
        result.desc = "获取省份列表失败";
        res.json(result);
    }
});

//查询省份下的市
router.post('/getcitys', function(req, res, next) {
    var result = {code: 200};

    //var provinceId = req.query;
    var params = req.body;
    if(params.provinceId<=0 || params.provinceId =="" || params.provinceId==null){
        result.code = 500;
        result.desc = "参数错误";
        res.json(result);
    }
    try{

        Address.getCitys(params,function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            result.cityList = data;
            res.json(result);
            logger.info("get cityList response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("get cityList error:" + ex);
        result.code = 500;
        result.desc = "获取市列表失败";
        res.json(result);
    }
});

//查询市下面的乡镇
router.post('/getcountys', function(req, res, next) {
    var result = {code: 200};

    var params = req.body;

    if(params.cityId<=0 || params.cityId =="" || params.cityId==null){
        result.code = 500;
        result.desc = "参数错误";
        res.json(result);
    }
    try{

        Address.getCountys(params,function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            result.countyList = data;
            res.json(result);
            logger.info("get countyList response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("get countyList error:" + ex);
        result.code = 500;
        result.desc = "获取乡镇列表失败";
        res.json(result);
    }
});


module.exports = router;