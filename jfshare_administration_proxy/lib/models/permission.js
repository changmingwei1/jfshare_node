/**
 * Created by huapengpeng on 2016/4/22.
 */



var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var manager_types = require("../thrift/gen_code/manager_types");


function Permission() {
}


Permission.prototype.queryAllCommissioner = function (params, callback) {

    var paginationParms = new pagination_types.Pagination({
        currentPage:params.currentPage,
        numPerPage:params.numPerPage
    });

    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'queryAllCommissioner', [paginationParms]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.error("queryAllCommissioner  result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            res.code = 500;
            res.desc = "desc";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//根据id查询单个用户信息
Permission.prototype.get = function(params,callback){

    //var commissioner = new manager_types.Commissioner({
        var csId = params.id
    //});
    //logger.info("get manager params:" + JSON.stringify(commissioner));
    //获取clients
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer,'queryCommissionerByCsId',[csId]);
    Lich.wicca.invokeClient(managerServ, function(err, data){
        logger.info("get manager result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//根据id查询用户权限
Permission.prototype.getUrls = function(params,callback){

    //var commissioner = new manager_types.Commissioner({
        var csId = params.id
    //});
    //logger.info("get manager params:" + JSON.stringify(commissioner));
    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer,'queryPermissionByCsId',[csId]);
    Lich.wicca.invokeClient(managerServ, function(err, data){
        logger.info("get manager result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == "1") {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//修改密码
Permission.prototype.editpwd = function (params, callback) {

    //var commissioner = new manager_types.r({
       var csId =  params.csId;
       var  newPwd = params.pwdEnc;
    //});
    //logger.info("manager resetCommissionerPwd manager :" + JSON.stringify(commissioner));
//获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'resetCommissionerPwd', [csId,newPwd]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("manager resetCommissionerPwd result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("can't manager resetCommissionerPwd result because: ======" + err);
            res.code = 500;
            res.desc = "密码修改失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//更新用户
Permission.prototype.updateManager = function (params, callback) {

    var commissioner = new manager_types.Commissioner({
        csId:params.csId,
        loginName:params.loginName,
        csName: params.csName,
        deptId: params.deptId,
        mobile: params.mobile,
        email: params.email,
        validate:params.validate,
        url: params.url
    });


    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'modifyCommissionerByCsId', [commissioner]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("update manager result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("can't update manager result because: ======" + err);
            res.code = 500;
            res.desc = "更新管理员信息失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//新增用户
Permission.prototype.add = function (params, callback) {
    var commissioner = new manager_types.Commissioner({
        loginName: params.loginName,
        pwdEnc: params.pwdEnc,
        deptId: params.deptId,
        csName: params.csName,
        mobile: params.mobile,
        email: params.email,
        url: params.url
    });
    logger.info("add manager params:" + JSON.stringify(commissioner));
    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'insert', [commissioner]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("add manager result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("add manager error result: ======" + err);
            res.code = 500;
            var dataBrand=data[0].failDescList[0];
            res.desc=dataBrand.desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//修改状态
Permission.prototype.changeValidate = function (params, callback) {

    var commissioner = new manager_types.Commissioner({
        csId:params.csId,
        validate: params.validate
    });


    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'changeValidate', [commissioner]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("changeValidate manager result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            logger.error("can't changeValidate manager result because: ======" + err);
            res.code = 500;
            res.desc = "更新管理员状态失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


Permission.prototype.isLoginNameExist = function (params, callback) {
    logger.info("参数params:" + JSON.stringify(params));
    logger.info("参数loginName:" + JSON.stringify(params.loginName));
    //获取客户端
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'isLoginNameExist', [params.loginName]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("isLoginNameExist result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("checkAccountName fail because: ======" + err);
            res.code = 500;
            res.desc = "false to checkAccountName";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


module.exports =  new Permission();