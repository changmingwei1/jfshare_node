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
//ע���û�
Manager.prototype.signup = function (params, callback) {

    var commissioner = new manager_types.Commissioner({
        loginName: params.loginName,
        csName: params.csName,
        pwdEnc: params.pwdEnc
    });


    //��ȡclient
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


//��¼
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


    //��ȡclient
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

//ע��
Manager.prototype.signout = function (params, callback) {


    var loginLog = new manager_types.LoginLog({
        tokenId: params.tokenId,
        csId: params.csId
    });


    //��ȡclient
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

module.exports = new Manager();