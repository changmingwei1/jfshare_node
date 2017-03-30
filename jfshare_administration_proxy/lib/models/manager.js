/**
 * Created by Administrator on 2016/5/6 0006.
 */
/**
 * Created by Administrator on 2016/4/28 0028.
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var manager_types = require("../thrift/gen_code/manager_types");

function Manager() {
}


//var jf_manager = new manager_types.Commissioner({
//    csId:params.csId,
//    loginName:params.loginName,
//    pwdEnc:params.pwdEnc,
//    deptId:params.deptId,
//    mobile:params.mobile,
//    email:params.email,
//    mobile:params.mobile,
//    validate:params.validate,
//    createTime:params.createTime,
//    url:params.url
//});


Manager.prototype.queryAllCommissioner = function (params, callback) {

    var paginationParms = new pagination_types.Pagination({
       currentPage:params.currentPage,
       numPerPage:params.numPerPage
    });



    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'queryAllCommissioner', [paginationParms]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("queryAllCommissioner result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            res.code = 500;
            // res.desc = data[0].failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


Manager.prototype.get = function(params,callback){


    var manager = new manager_types.Commissioner({
        id:params.id
    });
    logger.info("get manager params:" + JSON.stringify(message));
    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer,'queryCommissionerByCsId',[manager]);
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





//注册用户
Manager.prototype.signup = function (params, callback) {

    var commissioner = new manager_types.Commissioner({
        loginName: params.loginName,
        csName: params.csName,
        pwdEnc: params.pwdEnc
    });


    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'signup', [commissioner]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("signup manager user result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


//登录
Manager.prototype.signin = function (params, callback) {

    var commissioner = new manager_types.Commissioner({
        //csId: params.csId,
        loginName: params.loginName,
        //csName: params.csName,
        pwdEnc: params.pwdEnc
    });

    var loginLog = new manager_types.LoginLog({
        //csId: params.csId
    });


    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'signin', [commissioner, loginLog]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("signin manager user result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//注销
Manager.prototype.signout = function (params, callback) {


    var loginLog = new manager_types.LoginLog({
        tokenId: params.tokenId,
        csId: params.csId
    });


    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'signout', [loginLog]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("signout manager user result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].code == "1") {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


/**********************获取活动的链接**********************************************/

Manager.prototype.getShareUrl = function (params, callback) {
    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'getShareUrl', [params.openId, params.userId, params.name, params.img, params.token]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.error("getShareUrl result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
Manager.prototype.pushFriends = function (params, callback) {
    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'pushFriends', [params.selfOpenId, params.selfName, params.friendsOpenId, params.friendUserId,params.sign, params.selfimg,params.token]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("pushFriends result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
//queryTotalScore
Manager.prototype.queryTotalScore = function (params, callback) {
    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'queryTotalScore', [params.userId,params.openId]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("queryTotalScore result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

Manager.prototype.queryPushList = function (params, callback) {

    var paginationParms = new pagination_types.Pagination({
        currentPage:params.currentPage,
        numPerPage:params.numPerPage
    });

    //获取client
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'queryPushList', [params.userId,params.openId,paginationParms]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.info("queryPushList result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};


module.exports = new Manager();