/**
 * Created by L on 2015/10/24 0024.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
//var path = require('path');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);
var paramValid = require('../lib/models/pub/param_valid');

var address_types = require("../lib/thrift/gen_code/address_types");
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');
var protocol = thrift.TBinaryProtocol;
var transport =  thrift.TFramedTransport;
var thriftOptions = {
    transport: transport,
    protocol: protocol
};
var thriftConfig = require('../resource/thrift_config');

/**
 * 添加、修改收货地址
 */
router.post('/save', function(req, res, next) {
    try {
        var ret = {};

        var arg = req.body;
        var addr = JSON.parse(arg.addr);
        addr.userId =  req.session.buyer.userId+"" || "";
        logger.info("保存收货地址[save]信息, userId=" + addr.userId);
        if (paramValid.empty(addr) || paramValid.empty(addr.userId)) {
            logger.warn("保存收货地址[save]信息参数有误, userId=" + addr.userId);
            ret.status = 500;
            ret.error = "非法参数请求！";
            res.json(ret);
            return;
        }

        var method = paramValid.empty(addr.id) ? "addAddress" : "updateAddress";
        var param = new address_types.AddressInfo({
            userId : addr.userId,
            id : addr.id,
            receiverName : addr.receiverName,
            mobile : addr.mobile,
            telCode : addr.telCode,
            tel : addr.tel,
            telExtNumber : addr.telExtNumber,
            provinceId : addr.provinceId,
            provinceName : addr.provinceName,
            cityId : addr.cityId,
            cityName : addr.cityName,
            countyId : addr.countyId,
            countyName : addr.countyName,
            address : addr.address,
            postCode : addr.postCode,
            isDefault : addr.isDefault,
            email : addr.email,
        });
        // 获取client
        var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, method, param);
        Lich.wicca.invokeClient(addressServ, function (err, data) {
            if (err || (!paramValid.empty(addr.id) && data[0].code == "1") || (paramValid.empty(addr.id) && data[0].result.code == "1")) {
                logger.error("调用addressServ-"+method+"保存收货地址失败  失败原因 ======" + err);
                ret.status = 501;
                ret.error = !paramValid.empty(addr.id) ? data[0].failDescList[0].desc : data[0].result.failDescList[0].desc;
                res.json(ret);
                return;
            }

            logger.info("调用addressServ-"+method+"保存收货地址成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.newId = paramValid.empty(addr.id) ? data[0].value : addr.id;
            res.json(ret);
        });
    } catch (err) {
        logger.error("调用addressServ-"+method+"保存收货地址失败！", err);
        ret.status = 500;
        ret.error = "处理失败";
        res.json(ret);
    }
});

/**
 * 删除收货地址
 */
router.post('/delete', function(req, res, next) {
    try {
        var paramters = {};
        paramters.userId =   req.session.buyer.userId+"" || "";
        var ret = {};

        var arg = req.body;
        paramters.addrId = arg.addrId;

        logger.info("删除收货地址[delete]信息, userId=" + paramters.userId + ", addrId=" +  paramters.addrId);
        if (paramValid.empty( paramters.addrId) || paramValid.empty( paramters.userId)) {
            logger.warn("删除收货地址[delete]信息参数有误, userId=" + paramters.userId + ", addrId=" +  paramters.addrId);
            ret.status = 500;
            ret.error = "非法参数请求！";
            res.json(ret);
            return;
        }

        // 获取client
        var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "delAddress", [paramters.userId, paramters.addrId]);
        Lich.wicca.invokeClient(addressServ, function (err, data) {
            if (err || data[0].code == "1") {
                logger.error("调用addressServ-delAddress删除收货地址失败  失败原因 ======" + err);
                ret.status = 500;
                ret.error = "操作失败";
                res.json(ret);
                return;
            }

            logger.info("调用addressServ-delAddress删除收货地址成功  result.code =  （" + data[0].code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            res.json(ret);
        });
    } catch (err) {
        logger.error("调用addressServ-delAddress删除收货地址失败！", err);
        ret.status = 500;
        ret.error = "处理失败";
        res.json(ret);
    }
});

/**
 * 设置默认收货地址
 */
router.post('/default', function(req, res, next) {
    try {
        var paramters = {};
        paramters.userId =   req.session.buyer.userId+"" || "";
        var ret = {};

        var arg = req.body;
        paramters.addrId = arg.addrId;

        logger.info("设置默认收货地址[default]信息, userId=" + paramters.userId + ", addrId=" +  paramters.addrId);
        if (paramValid.empty( paramters.addrId) || paramValid.empty( paramters.userId)) {
            logger.warn("设置默认收货地址[default]信息参数有误, userId=" + paramters.userId + ", addrId=" +  paramters.addrId);
            ret.status = 500;
            ret.error = "非法参数请求！";
            res.json(ret);
            return;
        }

        // 获取client
        var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "setDefaultAddress", [paramters.userId, paramters.addrId]);
        Lich.wicca.invokeClient(addressServ, function (err, data) {
            if (err || data[0].code == "1") {
                logger.error("调用addressServ-setDefaultAddress设置默认收货地址失败  失败原因 ======" + err);
                ret.status = 500;
                ret.error = "操作失败";
                res.json(ret);
                return;
            }

            logger.info("调用addressServ-setDefaultAddress设置默认收货地址成功  result.code =  （" + data[0].code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            res.json(ret);
        });
    } catch (err) {
        logger.error("调用addressServ-setDefaultAddress设置默认收货地址失败！", err);
        ret.status = 500;
        ret.error = "处理失败";
        res.json(ret);
    }
});

//暴露模块
module.exports = router;
