/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Address = require('../lib/models/address');

// 新增收货地址
router.post('/add', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        logger.info("新增收货地址请求， arg:" + JSON.stringify(arg));

        if(arg == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if(arg.userId == null || arg.received == null || arg.mobileNo == null || arg.area == null || arg.address == null || arg.postCode == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.addAddress(arg, function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("add address response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "添加收货地址失败";
        res.json(result);
    }
});

router.get('/delete', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.query;
        logger.info("删除收货地址请求， arg:" + JSON.stringify(arg));

        if(arg.userid == null || arg.addrid == null){
            result.code= 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.delAddress(arg.userid, arg.addrid, function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("delete address response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("delete address error:" + ex);
        result.code = 500;
        result.desc = "删除收货地址失败";
        res.json(result);
    }
});

router.post('/update', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        logger.info("更新收货地址请求， arg:" + JSON.stringify(arg));

        if(arg == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if(arg.userId == null || arg.addrId == null){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.updateAddress(arg, function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("update address response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("update address error:" + ex);
        result.code = 500;
        result.desc = "更新收货地址信息失败";
        res.json(result);
    }
});

router.get('/list', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.query;
        logger.info("获取收货地址列表请求， arg:" + JSON.stringify(arg));

        if(arg.userid == null) {
            result.code= 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }

        Product.queryAddress(arg.userid, function(err, addressInfoList) {
            if(err) {
                res.json(err);
                return;
            }
            var addressList = [];
            if(addressInfoList !== null && addressInfoList.length >0){
                addressInfoList.forEach(function(address) {
                    addressList.push({
                        addrId: address.id,
                        received: address.receiverName,
                        mobileNo: address.mobile,
                        area: {
                            provinceId: address.provinceId,
                            provinceName: address.provinceName,
                            cityId: address.cityId,
                            cityName: address.cityName,
                            countyId: address.countyId,
                            countyName: address.countyName
                        },
                        address: address.address,
                        postcode: address.postCode,
                        isDefault: address.isDefault
                    });
                });
                result.addressList = addressList;
            }

            res.json(result);
            logger.info("get address list response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("get address list error:" + ex);
        result.code = 500;
        result.desc = "获取收货地址列表失败";
        res.json(result);
    }
});


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
    logger.info("查询省份下的市入参， params:" + JSON.stringify(params));
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
            logger.info("查询省份下的市 response:" + JSON.stringify(result));
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
    logger.info("查询市下面的乡镇入参， params:" + JSON.stringify(params));
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
            logger.info("查询市下面的乡镇 response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("get countyList error:" + ex);
        result.code = 500;
        result.desc = "获取乡镇列表失败";
        res.json(result);
    }
});


module.exports = router;