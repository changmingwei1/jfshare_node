/**
 * Created by L on 2015/10/25 0025.
 */

//提供类目相关数据

var express = require('express');
var router = express.Router();
var path = require('util');
var subjectModel = require('../lib/models/subject');
/**********************thrift config*************************************/
var Lich = require('../lib/thrift/Lich.js');
var subject_types=require("../lib/thrift/gen_code/subject_types")
var result_types=require("../lib/thrift/gen_code/result_types")
var thrift = require('thrift');

/****************log4js***********************************/
var log4node = require('../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

/*根据id查询，查询此节点所属路径*/
router.get('/getSuperTree/:subjectId', function(req, res, next) {
    var subjectId = req.params["subjectId"]||"";
    console.log('getSuperTree--->'+ subjectId);
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getSuperTree", subjectId);
    // 调用 subjectServ
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        if(err){
            log.error("调用subjectServ 服务失败======" + err);

        }

        log.info("subjectServ.getSuperTree() -- result=" +  JSON.stringify(data));
        var result = data[0].result;

        res.json(data[0])
    });
});


/**
 * =============================================================
 *ajax，根据科目id获取关联品牌信息
 * =============================================================
 */
router.get('/getBrandsById/:subjectId', function(req, res, next) {
    var subjectId = req.params["subjectId"]||"";
    console.log('subjectId--->'+ subjectId);

    new subjectModel().getSubject({subjectId:subjectId}, function(err, data){
        if(err) {
            //调用失败
            res.json('');
        } else {
            console.log('保存，返回结果：'+data);
            res.json(data)
        }
    });
});

/**
 * =============================================================
 *ajax，根据科目id获取下级
 * =============================================================
 */
router.get('/getSubNodeById/:subjectId', function(req, res, next) {
    var subjectId = req.params["subjectId"]||"";
    console.log('subjectId--->'+ subjectId);
    // 获取client
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getSubTree", subjectId);
    //console.log(subjectServ.params);
    // 调用 subjectServ
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        if(err){
            log.error("调用subjectServ 服务失败  失败原因 ======" + err);
            res.json({data:{"result":{"code":1}}});

        } else {
            log.info("调用subjectServ.getSubTree() 成功  result=" + JSON.stringify(data));
            res.json(data[0]);
        }
    });
});


//暴露模块
module.exports = router;