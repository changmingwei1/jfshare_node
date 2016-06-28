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

var common_types = require("../lib/thrift/gen_code/common_types");
var base = require("../lib/models/base");
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');

//get province
router.get('/provinces.json', function(req, res, next) {
    logger.info("获取省份列表[province]信息");

    try {
        var ret = {};
        // 获取client
        var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "province", []);
        Lich.wicca.invokeClient(commonServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用commonServ-province查询省份列表失败  失败原因 ======" + err);
                ret.status = 500;
                ret.error = data[0].result;
                res.json(ret);
                return;
            }

            logger.info("调用commonServ-province查询省份列表成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.data = data[0].areaInfo;
            res.json(ret);
        });
    } catch (err) {
        logger.error("获取省份列表[province]信息失败！", err);
        ret.status = 500;
        ret.error = "处理失败";
        res.json(ret);
    }
});

//get city
router.get('/citys.json', function(req, res, next) {
    try {
        var ret = {};

        var arg = req.query;
        logger.info("获取市区列表[city]信息, provinceId=" + arg.pid);
        if (paramValid.empty(arg.pid)) {
            logger.warn("获取市区列表[city]信息provinceId有误, provinceId=" + arg.pid);
            ret.status = 500;
            ret.error = "非法参数请求！";
            res.json(ret);
            return;
        }

        // 获取client
        var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "city", arg.pid);
        Lich.wicca.invokeClient(commonServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用commonServ-city查询市区列表失败  失败原因 ======" + err);
                ret.status = 500;
                ret.error = data[0].result;
                res.json(ret);
                return;
            }

            logger.info("调用commonServ-city查询市区列表成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.data = data[0].areaInfo;
            res.json(ret);
        });
    } catch (err) {
        logger.error("获取市区列表[city]信息失败！", err);
        ret.status = 500;
        ret.error = "处理失败";
        res.json(ret);
    }
});

//get county
router.get('/countries.json', function(req, res, next) {
    try {
        var ret = {};

        var arg = req.query;
        logger.info("获取区县列表[county]信息, cityId=" + arg.pid);
        if (paramValid.empty(arg.pid)) {
            logger.warn("获取区县列表[county]信息cityId有误, cityId=" + arg.pid);
            ret.status = 500;
            ret.error = "非法参数请求！";
            res.json(ret);
            return;
        }

        // 获取client
        var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "county", arg.pid);
        Lich.wicca.invokeClient(commonServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用commonServ-county查询区县列表失败  失败原因 ======" + err);
                ret.status = 500;
                ret.error = data[0].result;
                res.json(ret);
                return;
            }

            logger.info("调用commonServ-county查询区县列表成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.data = data[0].areaInfo;
            res.json(ret);
        });
    } catch (err) {
        logger.error("获取区县列表[county]信息失败！", err);
        ret.status = 500;
        ret.error = "处理失败";
        res.json(ret);
    }
});


//get province by ipAddress
router.get('/province', function(req, res, next) {
    var clientIp = req.query.clientIp;
    logger.info("获取客户端IP地址[" + clientIp + "]");

    try {
        var ret = {};
        // 获取client
        var commonServ = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "ipAttribution", [clientIp]);
        Lich.wicca.invokeClient(commonServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用commonServ-ipAttribution查询ip地址所在省份失败  失败原因 ======" + err);
                ret.status = 500;
                ret.error = data[0].result;
                res.json(ret);
                return;
            }

            logger.info("调用commonServ-ipAttribution查询ip地址所在省份失败  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.data = data[0].areaInfo;
            res.json(ret);
        });
    } catch (err) {
        logger.error("获取省份信息失败！", err);
        ret.status = 500;
        ret.error = "处理失败";
        res.json(ret);
    }
});

//query storehouseId
router.get('/getStorehouseId', function(req, res, next) {
    new base().getStorehouseId(req.query, function(rdata){
        return res.json(rdata);
    })
});

//query getPostage
router.get('/getPostage', function(req, res, next) {
    new base().calcPostage(req.query, function(rdata){
        return res.json(rdata);
    })
});

//暴露模块
module.exports = router;
