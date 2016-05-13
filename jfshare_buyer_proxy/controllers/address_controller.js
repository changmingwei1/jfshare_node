/**
 * @author by YinBo on 16/4/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');
var Address = require('../lib/models/address');


//新增收货地址
router.post('/add', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        if(arg == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        arg.token = "鉴权信息1";
        arg.ppInfo = "鉴权信息2";

        if( arg.userId==null ||arg.userId =="" || arg.userId <=0){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if( arg.mobile==null ||arg.mobile ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if( arg.receiverName==null ||arg.receiverName ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if( arg.address==null ||arg.address ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.provinceId==null ||arg.provinceId ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.provinceName==null ||arg.provinceName ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.cityId==null ||arg.cityId ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.cityName==null ||arg.cityName ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }/*
        if(arg.countyId==null ||arg.countyId ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.countyName==null ||arg.countyName ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }*/
        if(arg.postCode==null ||arg.postCode ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        logger.info("新增收货地址请求， arg:" + JSON.stringify(arg));
        Address.addAddress(arg, function(err, data) {
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

//删除收货地址
router.post('/delete', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;

        arg.token = "鉴权信息1";
        arg.ppInfo = "鉴权信息2";
        arg.browser = "asddf";
        if(arg.userId == null || arg.userId == "" || arg.userId <= 0){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        if(arg.addrId == null || arg.addrId == "" || arg.addrId <= 0){
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        logger.info("请求参数：" + JSON.stringify(arg));
        Address.delAddress(arg, function(err, data) {
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

//修改收货地址
router.post('/update', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        if(arg == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        arg.token = "鉴权信息1";
        arg.ppInfo = "鉴权信息2";
        arg.browser = "asdfasf";

        if( arg.userId==null ||arg.userId =="" || arg.userId <=0){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if( arg.addrId==null ||arg.addrId =="" || arg.addrId <=0){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if( arg.mobile==null ||arg.mobile ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if( arg.receiverName==null ||arg.receiverName ==""){
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if( arg.address==null ||arg.address ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.provinceId==null ||arg.provinceId ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.provinceName==null ||arg.provinceName ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.cityId==null ||arg.cityId ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.cityName==null ||arg.cityName ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.countyId==null ||arg.countyId ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.countyName==null ||arg.countyName ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if(arg.postCode==null ||arg.postCode ==""){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        logger.info("修改收货地址请求， arg:" + JSON.stringify(arg));

        Address.updateAddress(arg, function(err, data) {
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

//查询收货地址列表
router.post('/list', function(req, res, next) {
    var result = {code: 200};

    try{
        var arg = req.body;
        if(arg == null || arg.userId == null || arg.userId == "" || arg.userId <= 0 ){
            result.code = 400;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        arg.token = "鉴权信息1";
        arg.ppInfo = "鉴权信息2";
        arg.browser = "asdfas";

        Address.queryAddress(arg, function(err, addressList) {
            if(err) {
                res.json(err);
                return;
            }
            var addressInfoList = [];
            if(addressList !== null && addressList.length >0){
                addressList.forEach(function(address) {
                    addressInfoList.push({
                        id: address.id,
                        receiverName: address.receiverName,
                        mobile: address.mobile,
                        provinceId: address.provinceId,
                        provinceName: address.provinceName,
                        cityId: address.cityId,
                        cityName: address.cityName,
                        countyId: address.countyId,
                        countyName: address.countyName,
                        address: address.address,
                        postcode: address.postCode,
                        isDefault: address.isDefault
                    });
                });
                result.addressInfoList = addressInfoList;
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

//设置默认收货地址
router.post('/setDefaultAddress', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        if(arg == null) {
            result.code = 400;
            result.desc = "请求参数错误";
            res.json(result);
            return;
        }
        var params = {};
        params.userId = arg.userId;
        params.addressId = arg.id;

        params.token = arg.token || "鉴权信息1";
        params.ppInfo = arg.ppInfo || "鉴权信息2";
        params.browser = arg.browser || "1";

        logger.info("设为默认地址请求， arg:" + JSON.stringify(params));
//暂时去掉鉴权信息
//    Buyer.validAuth(args,function(err,data) {
//        if (err) {
//            response.json(err);
//            return;
//        }
        Address.setDefaultAddress(params, function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            res.json(result);
            logger.info("setDefaultAddress response:" + JSON.stringify(result));
        });
        //});
    } catch (ex) {
        logger.error("setDefaultAddress error:" + ex);
        result.code = 500;
        result.desc = "设置默认失败";
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