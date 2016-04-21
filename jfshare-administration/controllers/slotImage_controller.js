/**
 * Created by L on 2015/12/3 0003.
 */
var express = require('express');
var router = express.Router();
var path = require('util');
/**********************thrift config*************************************/
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');

var slotImage_types=require("../lib/thrift/gen_code/slotImage_types");
/****************log4js***********************************/
var log4node = require('../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var slotImage_view = require('../view_center/slotImage/view_slotImage');

// 获取 广告图片列表
router.get('/slotImageList/:type', function(req, res, next) {
    var type = req.params["type"]||"";
    //console.log('type--->'+ type);
    //thrift参数
    var thrift_conditions = new slotImage_types.QuerySlotImageParam ({
        type:type
    });
    // 获取client
    var managerServ_querySlotImageList = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, "querySlotImageList", thrift_conditions);

    Lich.wicca.invokeClient(managerServ_querySlotImageList, function (err, data) {
        if (err) {
            log.error("managerServ 链接管理中心服务失败 ======" + err);
           // return callback(err,null);
        }
        log.info("managerServ.querySlotImageList() 访问成功  result=" + JSON.stringify(data));
        if (data[0]["result"]["code"] != 0) {
            log.error("managerServ 管理中心服务querySlotImageList处理失败 ======");
           // return callback({code: 1, failDesc: "管理中心服务querySlotImageList处理失败"}, null);
        }
       // return callback(null,{productOptRecords: data[0]["productOptRecords"]});
        var result = data[0];

        //log.info(result);

        slotImage_view.slotImageList(req, res, next, type, result);
    });
});

//查询一个广告图片
router.get('/one/:type/:dotype/:id', function(req, res, next) {
    var id = req.params["id"]||"";
    console.log('id--->'+ id);

    var type = req.params["type"]||"1";
    console.log('type--->'+ type);

    var dotype = req.params["dotype"]||"view";
    console.log('dotype--->'+ dotype);



    var result = "";

    if(dotype != "add"){

        // 获取client
        var managerServ_querySlotImageOne = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, "querySlotImageOne", [id]);

        Lich.wicca.invokeClient(managerServ_querySlotImageOne, function (err, data) {
            if (err) {
                log.error("managerServ 链接管理中心服务失败 ======" + err);
                // return callback(err,null);
            }
            log.info("managerServ.querySlotImageOne() 访问成功  result=" + JSON.stringify(data));
            if (data[0]["result"]["code"] != 0) {
                log.error("managerServ 管理中心服务querySlotImageOne处理失败 ======");
                // return callback({code: 1, failDesc: "管理中心服务querySlotImageList处理失败"}, null);
            }
            // return callback(null,{productOptRecords: data[0]["productOptRecords"]});
            //res.json(data[0]);
            result = data[0];
            //log.info(result);
            slotImage_view.slotImageOne(req, res, next, type, dotype, result);
        });
    }else{

        slotImage_view.slotImageOne(req, res, next, type, dotype, result);

    }
});

//添加
router.post('/add', function(req, res, next) {
    var args = req.body;
    var imgKey = args["imgKey"] || "";
    var jump = args["jump"] || "";
    var type = args["slotImageType"] || "";
    console.log('type--->'+ type);
    console.log('imgKey--->'+ imgKey);
    console.log('jump--->'+ jump);
    //thrift参数
    var thrift_conditions = new slotImage_types.SlotImage ({
        imgKey:imgKey,
        jump:jump,
        type:type
    });
    // 获取client
    var managerServ_saveSlotImage = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, "saveSlotImage", thrift_conditions);

    Lich.wicca.invokeClient(managerServ_saveSlotImage, function (err, data) {
        if (err) {
            log.error("managerServ 链接管理中心服务失败 ======" + err);
            // return callback(err,null);
        }
        log.info("managerServ.saveSlotImage() 访问成功  result=" + JSON.stringify(data));
        if (data[0]["result"]["code"] != 0) {
            log.error("managerServ 管理中心服务saveSlotImage处理失败 ======");
            // return callback({code: 1, failDesc: "管理中心服务querySlotImageList处理失败"}, null);
        }
        // return callback(null,{productOptRecords: data[0]["productOptRecords"]});
        //res.json(data[0]);

        res.redirect("/slotImage/slotImageList/"+type);

    });
});

//修改
router.post('/update', function(req, res, next) {
    var args = req.body;
    var slotImageId = args["slotImageId"] || "";
    var imgKey = args["imgKey"] || "";
    var jump = args["jump"] || "";
    var isDelete = args["isDelete"] || "";
    var type = args["slotImageType"] || "";
    console.log('type--->'+ type);
    console.log('imgKey--->'+ imgKey);
    console.log('jump--->'+ jump);
    //thrift参数
    var thrift_conditions = new slotImage_types.SlotImage ({
        id:slotImageId,
        imgKey:imgKey,
        jump:jump,
        type:type,
        isDelete:isDelete
    });
    // 获取client
    var managerServ_updateSlotImage = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, "updateSlotImage", thrift_conditions);

    Lich.wicca.invokeClient(managerServ_updateSlotImage, function (err, data) {
        if (err) {
            log.error("managerServ 链接管理中心服务失败 ======" + err);
            // return callback(err,null);
        }
        log.info("managerServ.updateSlotImage() 访问成功  result=" + JSON.stringify(data));
        if (data[0]["result"]["code"] != 0) {
            log.error("managerServ 管理中心服务updateSlotImage处理失败 ======");
            // return callback({code: 1, failDesc: "管理中心服务querySlotImageList处理失败"}, null);
        }
        // return callback(null,{productOptRecords: data[0]["productOptRecords"]});
        //res.json(data[0]);
        res.redirect("/slotImage/slotImageList/"+type);
    });
});

//删除
router.get('/delete/:type/:id', function(req, res, next) {
    var slotImageId = req.params["id"]||"";
    var type = req.params["type"]||"";
    console.log('id--->'+ slotImageId);
    console.log('type--->'+ type);

    var thrift_conditions = new slotImage_types.SlotImage ({
        id:slotImageId,
        type:type,
        isDelete:1
    });
    // 获取client
    var managerServ_updateSlotImage = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, "updateSlotImage", thrift_conditions);

    Lich.wicca.invokeClient(managerServ_updateSlotImage, function (err, data) {
        if (err) {
            log.error("managerServ 链接管理中心服务失败 ======" + err);
            // return callback(err,null);
        }
        log.info("managerServ.updateSlotImage() 访问成功  result=" + JSON.stringify(data));
        if (data[0]["result"]["code"] != 0) {
            log.error("managerServ 管理中心服务updateSlotImage处理失败 ======");
            // return callback({code: 1, failDesc: "管理中心服务querySlotImageList处理失败"}, null);
        }
        // return callback(null,{productOptRecords: data[0]["productOptRecords"]});
        //res.json(data[0]);
        res.redirect("/slotImage/slotImageList/"+type);
    });

});

//暴露模块
module.exports = router;



