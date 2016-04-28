/**
 * @author by YinBo on 16/3/22.
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
        //if(arg.userId == null || arg.received == null || arg.mobileNo == null || arg.area == null || arg.address == null || arg.postCode == null){
        //    result.code = 400;
        //    result.desc = "请求参数错误";
        //    res.json(result);
        //    return;
        //}
        var params = {};
        params.userId = arg.userId || 2;
        params.receiverName = arg.receiverName || "大表哥";
        params.mobile = arg.mobile || "13558731840";
        params.address = arg.address || "北京市朝阳区安外北苑路与红军营南路交汇处西南角";
        params.postCode = arg.postCode || "100000";
        params.isDefault = arg.isDefault || 1;
        params.area = {
            provinceId:arg.provinceId || "110000",
            provinceName:arg.provinceName || "北京市",
            cityId:arg.cityId || "110100",
            cityName:arg.cityName || "北京市",
            countyId:arg.countyId || "110105",
            countyName:arg.countyName || ""
        };
        params.token = arg.token || "鉴权信息1";
        params.ppInfo = arg.ppInfo || "鉴权信息2";

        logger.info("新增收货地址请求， arg:" + JSON.stringify(params));
        Address.addAddress(params, function(err, data) {
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

        var params = {};
        params.userId = arg.userId || 2;
        params.addrId = arg.addrId || 249;
        params.token = arg.token || "鉴权信息1";
        params.ppInfo = arg.ppInfo || "鉴权信息2";
        logger.info("请求参数：" + JSON.stringify(params));
        Address.delAddress(params, function(err, data) {
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
        var params = {};
        params.userId = arg.userId || 2;
        params.id = arg.id || 24;
        params.receiverName = arg.receiverName || "大表哥";
        params.mobile = arg.mobile || "13558731840";
        params.address = arg.address || "北京市朝阳区安外北苑路与红军营南路交汇处西南角";
        params.postCode = arg.postCode || "100000";
        params.isDefault = arg.isDefault || 1;
        params.area = {
            provinceId:arg.provinceId || "110000",
            provinceName:arg.provinceName || "北京市",
            cityId:arg.cityId || "110100",
            cityName:arg.cityName || "北京市",
            countyId:arg.countyId || "110105",
            countyName:arg.countyName || ""
        };
        params.token = arg.token || "鉴权信息1";
        params.ppInfo = arg.ppInfo || "鉴权信息2";

        logger.info("新增收货地址请求， arg:" + JSON.stringify(params));

        Address.updateAddress(params, function(err, data) {
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
        var params = {};
        params.userId = arg.userId || 2;
        params.token = arg.token || "鉴权信息1";
        params.ppInfo = arg.ppInfo || "鉴权信息2";

        Address.queryAddress(params, function(err, addressInfoList) {
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

module.exports = router;