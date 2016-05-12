/**
 * Created by YinBo on 2016/4/12.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var Subject = require("../lib/models/subject");
//增加类目
router.post('/add', function (request, response, next) {

    var result = {code: 200};
    try{
        var params = request.body;

        if(params.name == null || params.name == ""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if(params.pid == null || params.name == "" || params.pid<0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if(params.level == null || params.level == "" || params.level<1 || params.level>3 ){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.imgkey == null || params.imgkey == ""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.userId == null || params.userId == "" || params.userId<=0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        //默认每个层级最多不到1000个
        if(params.pid<((params.level-1)*1000)||params.pid>(params.level*1000)){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        logger.info("add subject 请求， params:" + JSON.stringify(params));
        Subject.add(params,function(error,data){
            if (error) {
                response.json(error);
            } else {
                result.id = data[0].subjectInfo.id;
                response.json(result);
                logger.info("add subject  result:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("add subject error:" + ex);
        result.code = 500;
        result.desc = "新增类目失败";
        response.json(result);
    }
});

//更新类目
router.post('/update', function (request, response, next) {

    var result = {code: 200};

    response.json(result);

    var result = {code: 200};
    try{
        var params = request.body;

        if(params.name == null || params.name == ""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if(params.id == null || params.id == ""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.imgkey == null || params.imgkey == ""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.userId == null || params.userId == "" || params.userId<=0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        logger.info("update subject 请求， params:" + JSON.stringify(params));
        Subject.update(params,function(error,data){
            if (error) {
                response.json(error);
            } else {
                response.json(result);
                logger.info("update subject  result:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("update subject error:" + ex);
        result.code = 500;
        result.desc = "更新类目失败";
        response.json(result);
    }
});


//查询类目列表
router.post('/query', function (request, response, next) {

    logger.info("进入查询类目列表流程....");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验
        if(params.pid == null || params.pid == "" ||params.pid < 0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Subject.query(params,function(error,data){
            if (error) {
                response.json(error);
            } else {
                result.subjectList = data;
                response.json(result);
                logger.info("get subject list result:" + JSON.stringify(result));
            }
        });


    }catch(ex){
        logger.error("查询类目列表信息"+"失败，because :" + ex);
        result.code = 500;
        result.desc = "查询类目列表失败";
        result.json(result);
    }
});

//查询类目所属的路径
//此功能是好的，前台现在不直接调用，只是服务间调用，因此隐藏对客户端的调用请求
router.post('/querySubjectPath', function (request, response, next) {

    //logger.info("进入查询类目路径流程....");
    //var result = {code:200};
    //
    //try{
    //    //var params = request.query;
    //    var params = request.body;
    //    //参数校验
    //    if(params.id == null || params.id == "" ||params.id < 0){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    Subject.querySubjectPath(params,function(error,data){
    //        if (error) {
    //            response.json(error);
    //        } else {
    //            result.subjectName = data;
    //            response.json(result);
    //            logger.info("querySubjectPath result:" + JSON.stringify(result));
    //        }
    //    });
    //
    //}catch(ex){
    //    logger.error("querySubjectPath"+"失败，because :" + ex);
    //    result.code = 500;
    //    result.desc = "查询类目路径失败";
    //    result.json(result);
    //}
});

//获取类目属性
router.post('/get', function (request, response, next) {
    //var result = {
    //    code: 200,
    //    attributes: [{"id": 1, "name": "产地", "sorted": 1},
    //        {"id": 2, "name": "寿命", "sorted": 2},
    //        {
    //            "id": 3,
    //            "name": "型号",
    //            "sorted": 3
    //        }]
    //};
    //response.json(result);
    var result = {code:200};
    result.attributes = {};
    var attributes = null;
    try{
        var params = request.body;
        if(params.subjectId == null || params.subjectId == "" ||params.subjectId < 0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        logger.info("请求， arg:" + JSON.stringify("subjectId:" + JSON.stringify(params)));
        var subjectAttributes = [];
        Subject.queryAttributes(params,function(error,data){
            if (error) {
                response.json(error);
            } else {
                if(data[0].subjectAttributes!=null){
                   var list = data[0].subjectAttributes;
                    list.forEach(function(attribute){
                       if(attribute.isSku == 0){
                           attributes = attribute;
                           return false;
                       }

                    });
                }
                if(attributes!=null){
                    result.attributes.id = attributes.id;
                    result.attributes.value = attributes.value;
                }

                logger.info("queryAttributes  result:" + JSON.stringify(result));
                response.json(result);

            }
        });
    } catch (ex) {
        logger.error("获取 error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        response.json(result);
    }
});

//品类应用全部属性
router.post('/flushtoAll', function (req, res, next) {

    var result = {code: 200};

    response.json(result);
    //var result = {code: 200};
    //
    //try {
    //    var params = request.body;
    //
    //    logger.info("params:" + JSON.stringify(params));
    //    if (params.id == null || params.id == "" || params.id <= 0) {
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    if (params.pid == null || params.pid == "") {
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //
    //    Subject.flushtoAll(params, function (error, data) {
    //        if (error) {
    //            response.json(error);
    //        } else {
    //            result.data = data;
    //            logger.info("updateAttributes  result:" + JSON.stringify(result));
    //            response.json(result);
    //
    //        }
    //    });
    //
    //
    //} catch (ex) {
    //    logger.error("获取 error:" + ex);
    //    result.code = 500;
    //    result.desc = "获取失败";
    //    res.json(result);
    //}
});


// 修改末节点的属性
router.post('/updateAttributes', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;

        logger.info("params:" + JSON.stringify(params));
        if (params.id == null || params.id == "" || params.id <= 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.name == null || params.name == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.value == null || params.value == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        Subject.updateAttributes(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                result.data = data;
                logger.info("updateAttributes  result:" + JSON.stringify(result));
                response.json(result);

            }
        });

        res.json(result);
        logger.info("获取 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("获取 error:" + ex);
        result.code = 500;
        result.desc = "更新属性失败";
        res.json(result);
    }
});


// 获取品牌关联的类目列表
router.post('/getListforBrand', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;

        logger.info("params:" + JSON.stringify(params));
        if (params.id == null || params.id == "" || params.id <= 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        Subject.getListforBrand(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                logger.info("getListforBrand  result:" + JSON.stringify(result));
                var ids = [];
                if (data[0].subjectInfos != null) {
                    data[0].subjectInfos.forEach(function (a) {
                        ids.push({id: a.id});
                    });
                }
                result.ids = ids;
                response.json(result);
            }
        });

    } catch (ex) {
        logger.error("获取 error:" + ex);
        result.code = 500;
        result.desc = "获取品牌关联类目失败";
        res.json(result);
    }
});


// 更新品牌关联的类目
router.post('/updateBrandSubject', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;

        logger.info("params:" + JSON.stringify(params));
        if (params.subjectIds == null || params.subjectIds == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.brandId == null || params.brandId == "" || params.brandId <= 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        params.subjectList = params.subjectIds.split(",");


        Subject.updateBrandSubject(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                response.json(result);
            }
        });

    } catch (ex) {
        logger.error("获取 error:" + ex);
        result.code = 500;
        result.desc = "获取品牌关联类目失败";
        res.json(result);
    }
});

router.post('/getBatchSuperTree', function (request, response, next) {

    var subjectIds=[];
    subjectIds.push("3021");
    subjectIds.push("3022");

    var params=subjectIds;
    Subject.getBatchSuperTree(params, function (error, data) {
        if (error) {
            response.json(error);
        } else {

            //组装list
            var partsNames=[];
            var subjectNodeTrees = data[0].subjectNodeTrees;
            if(subjectNodeTrees.length<=0){
                result.code = 500;
                result.desc = "参数错误";
                response.json(result);
                return;
            }

            var nameList=[];
            subjectNodeTrees.forEach(function(a){

              //  logger.info("get product list response-----:" + JSON.stringify(a));
                var lmNames=[];
                var numNames=a;
                numNames.forEach(function(b){
                    lmNames.push({
                        id: b.id,
                        subjectName: b.name
                    });
                });
                nameList.push(lmNames);
            });
            logger.info("get product list response-----:" + JSON.stringify(nameList));
            /**
            var pagination = data[0].pagination;
            result.page = {total: pagination.totalCount, pageCount:pagination.pageNumCount};
            logger.info("get product list response:" + JSON.stringify(result));
            result.scoreList=dataArr;

            response.json(result);
             */

        }
    });

});

module.exports = router;
