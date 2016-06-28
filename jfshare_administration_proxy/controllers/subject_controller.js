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
    try {
        var params = request.body;

        if (params.name == null || params.name == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.pid == null || params.name == "" || params.pid < 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.level == null || params.level == "" || params.level < 1 || params.level > 3) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.imgkey == null || params.imgkey == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.isLeaf == null || params.isLeaf == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "" || params.userId <= 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.commodity == null || params.commodity == "" || params.commodity <= 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        //默认每个层级最多不到1000个
        if (params.pid < ((params.level - 1) * 1000) || params.pid > (params.level * 1000)) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        logger.info("add subject 请求， params:" + JSON.stringify(params));
        Subject.add(params, function (error, data) {
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
    try {
        var params = request.body;

        if (params.name == null || params.name == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.id == null || params.id == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.imgkey == null || params.imgkey == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.userId == null || params.userId == "" || params.userId <= 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        logger.info("update subject 请求， params:" + JSON.stringify(params));
        Subject.update(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                logger.info("update subject  result:" + JSON.stringify(result));
                response.json(result);

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
    var result = {code: 200};

    try {
        //var params = request.query;
        var params = request.body;
        //参数校验
        if (params.pid == null || params.pid == "" || params.pid < 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Subject.query(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                result.subjectList = data;
                logger.info("get subject list result:" + JSON.stringify(result));
                response.json(result);

            }
        });


    } catch (ex) {
        logger.error("查询类目列表信息" + "失败，because :" + ex);
        result.code = 500;
        result.desc = "查询类目列表失败";
        result.json(result);
    }
});


//获取类目属性
router.post('/get', function (request, response, next) {

    var result = {code: 200};
    result.attributes = {};
    var attributes = null;
    try {
        var params = request.body;
        if (params.subjectId == null || params.subjectId == "" || params.subjectId < 0) {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        logger.info("请求， arg:" + JSON.stringify("subjectId:" + JSON.stringify(params)));
        var subjectAttributes = [];
        Subject.queryAttributes(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                if (data[0].subjectAttributes != null) {
                    var list = data[0].subjectAttributes;
                    list.forEach(function (attribute) {
                        if (attribute.isSku == 0) {
                            attributes = attribute;
                            return false;
                        }

                    });
                }
                if (attributes != null) {
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
router.post('/flushtoAll', function (request, response, next) {


    var result = {code: 200};

    try {
        var params = request.body;

        logger.info("params:" + JSON.stringify(params));

        if (params.pid == null || params.pid == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.id == null || params.id == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.updater == null || params.updater == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.subjectId == null || params.subjectId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        // updater:params.updater,
       // id:params.subjectId
        Subject.flushtoAll(params, function (error, data) {
            if (error) {
                response.json(error);
                return;
            } else {
                logger.info("flushtoAll  result:" + JSON.stringify(result));
                response.json(result);

            }
        });


    } catch (ex) {
        logger.error("获取 error:" + ex);
        result.code = 500;
        result.desc = "获取失败";
        res.json(result);
    }
});


// 修改末节点的属性
router.post('/updateAttributes', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;


        logger.info("params:" + JSON.stringify(params));
        //如果属性id为空，那么就走添加属性
        if (params.id == null || params.id == "") {
            logger.info("现在进入添加属性流程--->params:" + JSON.stringify(params));

            var subject = {};
            if (params.subjectId == null || params.subjectId == "") {
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
            var attributesId = 0;
            async.series([
                function (callback) {
                    Subject.getById(params, function (error, data) {
                        if (error) {
                            return callback(1, null);
                        } else {
                            if (data[0] != null && data[0].subjectInfo != null) {
                                subject.id = data[0].subjectInfo.id;
                                subject.name = data[0].subjectInfo.name;
                                subject.imgkey = data[0].subjectInfo.img_key;
                                subject.userId = data[0].subjectInfo.creator;
                                subject.level = data[0].subjectInfo.level;
                                subject.pid = data[0].subjectInfo.pid;
                                subject.isLeaf = data[0].subjectInfo.isLeaf;
                                subject.isLeaf = data[0].subjectInfo.isLeaf;
                                subject.commodity = data[0].subjectInfo.commodity;
                                logger.info("添加属性构造subject---------->" + JSON.stringify(subject));
                                return callback(null, subject)
                            } else {
                                return callback(1, null)
                            }
                        }
                    });
                },
                function (callback) {
                    Subject.addSubjectAttribute(params, function (error, data) {
                        if (error) {
                            return callback(1, error);
                        } else {
                            logger.info("addSubjectAttribute---------->" + JSON.stringify(data));
                            attributesId = data[0].subjectAttribute.id;
                            return callback(null, attributesId);
                        }
                    });
                },
                function (callback) {

                    logger.info("updatesubject------params---->" + JSON.stringify(subject)+"------>"+attributesId);

                    if (subject != null && attributesId != 0) {
                        subject.attributes = attributesId+"";
                        subject.userId = params.userId;
                        Subject.update(subject, function (error, data) {
                            if (error) {
                               return callback(1, error);
                            } else {
                                logger.info("updatesubject---result------->" + JSON.stringify(data));
                                attributesId = data[0].id;
                                result.id = attributesId;
                                return callback(null, result);
                            }
                        });

                    }else{
                        return callback(2, null);
                    }
                }

            ], function (err, results) {
                if (err ) {
                    result.code = 500;
                    result.desc = "更新属性失败";
                    response.json(result);
                    return;
                }
                if(results[2]!=null){
                    result.id = results[1];
                    response.json(result);
                    return;
                }else{
                    result.code = 500;
                    result.desc = "更新属性失败";
                    response.json(result);
                    return;
                }
            });
        } else {
            //更新属性
            if (params.value == null || params.value == "") {
                result.code = 500;
                result.desc = "参数错误";
                response.json(result);
                return;
            }
            logger.info("现在进入更新属性流程--->params:" + JSON.stringify(params));
            Subject.updateAttributes(params, function (error, data) {
                if (error) {
                    response.json(error);
                    return;
                }
                logger.info("updateAttributes  result:" + JSON.stringify(data));
                response.json(result);
                return;
            });

        }
    } catch (ex) {
        logger.error("获取 error:" + ex);
        result.code = 500;
        result.desc = "更新属性失败";
        response.json(result);
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
        response.json(result);
    }
});

// 添加属性，这个是因为彻底没有属性所以添加属性
router.post('/addSubjectAttribute', function (request, response, next) {
    //var result = {code: 200};
    //try {
    //    var params = request.body;
    //
    //    logger.info("params:" + JSON.stringify(params));
    //
    //
    //
    //} catch (ex) {
    //    logger.error("获取 error:" + ex);
    //    result.code = 500;
    //    result.desc = "添加属性失败";
    //    response.json(result);
    //}
});

module.exports = router;
