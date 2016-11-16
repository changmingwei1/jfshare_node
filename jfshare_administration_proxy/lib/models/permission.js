/**
 * Created by huapengpeng on 2016/4/22.
 */
/**
 * Created by huapengpeng on 16/3/20.
 */

var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var brand_types = require("../thrift/gen_code/brand_types");


function Permission() {
}


Permission.prototype.queryAllCommissioner = function (params, callback) {

    var pagination = new pagination_types.Pagination({
        currentPage: params.currentPage,
        numPerPage: params.numPerPage,
    });


    //��ȡclient
    var managerServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'queryAllCommissioner', [pagination]);
    Lich.wicca.invokeClient(managerServ, function (err, data) {
        logger.error("queryAllCommissioner manager user result:" + JSON.stringify(data));
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
module.exports = new Permission();
/**

 /**
 * Created by Administrator on 2016/5/3 0003.
 */
