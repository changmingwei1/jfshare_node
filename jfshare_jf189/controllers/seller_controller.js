//引入所需模块
var express = require('express');
var router = express.Router();

//util
var SessionUtil = require('../lib/util/SessionUtil');
var paramValid = require('../lib/models/pub/param_valid');

var logger = require('../lib/util/log4node').configlog4node.servLog4js();

//thrift
var seller_types = require("../lib/thrift/gen_code/seller_types");
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');

router.get('/infos', function(req, res, next) {
    try {
        var arg = req.query;
        var params = {};
        params.sellerIds =  arg.sellerIds;
        logger.info("批量获取卖家信息, sellerids=" +params.sellerIds);
        var ret = {};
        if (paramValid.empty(params.sellerIds)) {
            logger.warn("用户userId有误, userId=" + params.userId + ", orderId=" +  params.orderId);
            ret.status = 500;
            ret.msg = "非法参数请求！";
            res.json(ret);
            return;
        }

        var s = JSON.parse(params.sellerIds);
        var sellerIds = [];
        for (var i in s) {
            sellerIds.push(i);
        }
        var sellerRetParam = new seller_types.SellerRetParam ({
            baseTag : 1,
        })

        // 获取client
        var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, "querySellerBatch", [sellerIds, sellerRetParam]);
        Lich.wicca.invokeClient(sellerServ, function (err, data) {
            if (err || data[0].result.code == "1") {
                logger.error("调用sellerServ-querySellerBatch批量查询卖家信息失败  失败原因 ======" + err);
                ret.status = 501;
                ret.msg = "调用结果有误";
                res.json(ret);
                return;
            }

            logger.info("调用sellerServ-querySellerBatch批量查询卖家信息成功  result.code =  （" + data[0].result.code + "）  1为失败 0为成功");
            //logger.info("接口返回数据=====" + data[0]);
            ret.status = 200;
            ret.data = paramValid.empty(data[0].sellerMap) ? "" : data[0].sellerMap
            res.json(ret);
        });
    } catch (err) {
        logger.error("批量查询卖家信息系统异常", err);
        res.json("查询失败");
    }
});

//暴露模块
module.exports = router;
