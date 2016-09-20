/**
 * @auther chiwenheng  0909
 * 轮播图片
 *
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var manager_types = require("../thrift/gen_code/manager_types");

function SlotImage() {}

/* 查询广告位图片列表 -- 前端/管理中心 */
SlotImage.prototype.queryAdvertSlotImageList = function (params, callback) {

    var slotBean = new manager_types.AdvertSlotImageParam({
        advertId: params.advertId,
        fromSource:1, /*1为前端，2为管理中心*/
        type:params.type
    });

    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'queryAdvertSlotImageList', [slotBean]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("queryAdvertSlotImageList result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("slotServ.queryAdvertSlotImageList because: ======" + err);
            res.code = 500;
            res.desc = "查询广告位图片"+"失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("查询广告位图片列表失败，参数为：" + JSON.stringify(slotBean));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });

};

module.exports = new SlotImage();