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
        if (err || data[0].code == "1") {
            res.code = 500;
            // res.desc = data[0].failDescList[0].desc;
            res.desc = "desc";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
module.exports =  new Permission();