/**
 * Created by tangmingxia on 2016/11/16.
 */

var express = require('express');
var router = express.Router();
var async = require('async');
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var permission = require('../lib/models/permission');// 广告位功能模块



//查询用户信息
router.post('/queryAllCommissioner', function (request, response, next) {

    var result = {code: 200};
    try {
        var params = request.body;

        if (params.currentPage == null || params.currentPage == "" ||params.currentPage<0) {
            result.code = 500;
            result.desc = "当前页参数错误";
            response.json(result);
            return;
        }
        if (params.numPerPage == null || params.numPerPage == "") {
            result.code = 500;
            result.desc = "每页显示记录数参数错误";
            response.json(result);
            return;
        }
        logger.info("queryAllCommissioner 请求， params:" + JSON.stringify(params));
        permission.queryAllCommissioner(params, function (error, data) {
            if (error) {
                response.json(error);
            } else {
                if(data!=null){

                    result.commissioner = data[0].commissioners;
                }
                result.pagination = data[0].pagination;
                response.json(result);
                logger.info("queryAllCommissioner subject  result:" + JSON.stringify(result));
            }
        });
    } catch (ex) {
        logger.error("queryAllCommissioner subject error:" + ex);
        result.code = 500;
        result.desc = "查询用户失败";
        response.json(result);
    }
});


//获取普通用户信息
router.post('/get', function(request, response, next) {


    var result = {code: 200};
    var params = request.body;
    try{
        //参数校验
        if(params.id =="" || params.id==null || params.id<=0){
            result.code = 500;
            result.desc = "用户id 参数错误";
            response.json(result);
            return;
        }
        permission.get(params, function(error,data){
            if(error){
                response.json(error);
                return;
            }

            if(data[0]!=null ||data[0]!=""){
                result.manager = data[0];
            }
            response.json(result);
            logger.info("get  response:" + JSON.stringify(data));
        });

    } catch (ex) {
        logger.error("获取用户信息 error:" + ex);
        result.code = 500;
        result.desc = "获取用户信息";
        response.json(result);
    }
});

//获取普通用户权限信息
router.post('/getUrls', function(request, response, next) {


    var result = {code: 200};
    var params = request.body;
    try{
        //参数校验
        if(params.id =="" || params.id==null || params.id<=0){
            result.code = 500;
            result.desc = "用户id 参数错误";
            response.json(result);
            return;
        }
        permission.getUrls(params, function(error,data){
            if(error){
                response.json(error);
                return;
            }

            if(data[0]!=null ||data[0]!=""){
                result.urls = data[0].value;
            }
            response.json(result);
            logger.info("get  response:" + JSON.stringify(data));
        });

    } catch (ex) {
        logger.error("获取用户权限信息 error:" + ex);
        result.code = 500;
        result.desc = "获取用户权限信息";
        response.json(result);
    }
});


// 修改管理员密码
router.post('/editpwd', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("ManagerServ-editpwd params:" + JSON.stringify(params));

        if (params.csId == null || params.csId == "") {
            result.code = 500;
            result.desc = "用户id 参数错误";
            response.json(result);
            return;
        }
        if (params.pwdEnc == null || params.pwdEnc == "") {
            result.code = 500;
            result.desc = "新密码 参数错误";
            response.json(result);
            return;
        }

        //更新密码
        permission.editpwd(params, function (err, data) {
            logger.info("ManagerServ-editpwd response:" + JSON.stringify(data));
            if (err) {
                response.json(err);
                return;
            }
            logger.info(" ManagerServ-editpwd response:" + JSON.stringify(result));
            response.json(result);
        });
    } catch (ex) {
        logger.error("修改密码 error:" + ex);
        result.code = 500;
        result.desc = "修改密码失败";
        res.json(result);
    }
});

// 修改管理员信息
router.post('/updateManager', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;

        logger.info("ManagerServ-update params:" + JSON.stringify(params));


        if (params.csId == null || params.csId == "") {
            result.code = 500;
            result.desc = "用户id 参数错误";
            response.json(result);
            return;
        }

        permission.updateManager(params, function (err, data) {
            logger.info("ManagerServ-update response:" + JSON.stringify(data));
            var brandInfo = [];
            if (err) {
                response.json(err);
                return;
            }
            logger.info(" ManagerServ-update response:" + JSON.stringify(result));
            response.json(result);
        });
    } catch (ex) {
        logger.error("update manager error:" + ex);
        result.code = 500;
        result.desc = "更新管理员消息失败";
        response.json(result);
    }
});

router.post('/add', function (request, response, next) {
    var result = {code: 200};
    try {
        var params = request.body;

        logger.info("ManagerServ-add params:" + JSON.stringify(params));

        if (params.loginName == null || params.loginName == "") {
            result.code = 500;
            result.desc = "账户名称 参数错误";
            response.json(result);
            return;
        }

        if (params.pwdEnc == null || params.pwdEnc == "") {
            result.code = 500;
            result.desc = "密码 参数错误";
            response.json(result);
            return;
        }
        if (params.deptId == null || params.deptId == "") {
            result.code = 500;
            result.desc = "部门 参数错误";
            response.json(result);
            return;
        }
        if (params.csName == null || params.deptId == "") {
            result.code = 500;
            result.desc = "客服姓名 参数错误";
            response.json(result);
            return;
        }
        if (params.mobile == null || params.mobile == "") {
            result.code = 500;
            result.desc = "手机号 参数错误";
            response.json(result);
            return;
        }
        if (params.email == null || params.email == "") {
            result.code = 500;
            result.desc = "邮箱 参数错误";
            response.json(result);
            return;
        }
        if (params.url == null || params.url == "") {
            result.code = 500;
            result.desc = "权限 参数错误";
            response.json(result);
            return;
        }

        permission.add(params, function (err, data) {
            logger.info("ManagerServ-add response:" + JSON.stringify(data));
            var brandInfo = [];
            if (err) {
                response.json(err);
                return;
            }
            logger.info(" ManagerServ-add response:" + JSON.stringify(result));
            response.json(result);
        });

    } catch (ex) {
        logger.error("ManagerServ-add error:" + ex);
        result.code = 500;
        result.desc = "新增用户异常";
        response.json(result);
    }
});


// 修改管理员信息
router.post('/changeValidate', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;

        logger.info("ManagerServ-update params:" + JSON.stringify(params));


        if (params.csId == null || params.csId == "") {
            result.code = 500;
            result.desc = "用户id 参数错误";
            response.json(result);
            return;
        }
        if (params.validate == null || params.validate == "") {
            result.code = 500;
            result.desc = "状态 参数错误";
            response.json(result);
            return;
        }

        permission.changeValidate(params, function (err, data) {
            logger.info("ManagerServ-update response:" + JSON.stringify(data));
            var brandInfo = [];
            if (err) {
                response.json(err);
                return;
            }
            logger.info(" ManagerServ-update response:" + JSON.stringify(result));
            response.json(result);
        });
    } catch (ex) {
        logger.error("update manager error:" + ex);
        result.code = 500;
        result.desc = "更新管理员状态失败";
        response.json(result);
    }
});

// 查看用户名是否存在
router.get('/isLoginNameExist', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.query;
        logger.info("参数:" + JSON.stringify(params));

        logger.info("ManagerServ-update params:" + JSON.stringify(params));


        if (params.loginName == null || params.loginName == "") {
            result.code = 500;
            result.desc = "账户名 参数错误";
            response.json(result);
            return;
        }

        permission.isLoginNameExist(params, function (err, data) {
            logger.info("ManagerServ-checkAccountName response:" + JSON.stringify(data));
            var brandInfo = [];
            if (err) {
                response.json(err);
                return;
            }
            result.value = data[0].value;
            logger.info(" ManagerServ-checkAccountName response:" + JSON.stringify(result));
            response.json(result);
        });
    } catch (ex) {
        logger.error("checkAccountName error:" + ex);
        result.code = 500;
        result.desc = "查询用户姓名失败";
        response.json(result);
    }
});

module.exports = router;

