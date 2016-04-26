/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Product = require('../lib/models/product');

// 新增收货地址
router.get('/add', function(req, res, next) {
    var result = {code: 200};
    try{
        var arg = req.query;
        var params = {};
        params.title = arg.title || "标题：五一大促";
        params.content = arg.content || "消息内容：锅碗瓢盆全都半价啦！";
        params.beginTime = arg.beginTime || "2016-5-1 00:00:00";
        params.endTime = arg.endTime || "2016-5-5 00:00:00";
        params.type = arg.type || "推送类型：1主站、2用户端app、3商家后台、4商户端app";
        params.state = arg.state || "状态：1已过期、2进行中、3未开始三种";

        logger.info("新增收货地址请求， params:" + JSON.stringify(params));


        res.json(result);
        logger.info("add address response:" + JSON.stringify(result));
    } catch (ex) {
        logger.error("add address error:" + ex);
        result.code = 500;
        result.desc = "添加系统消息失败";
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



module.exports = router;