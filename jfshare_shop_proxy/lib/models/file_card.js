/**
 * @auther chiwenheng  0909
 * 第三方卡密 。。。。。
 *
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');
var manager_types = require("../thrift/gen_code/fileUpload_types");

function FileCards() {}

/** 上传第三方卡密 */
FileCards.prototype.fileToTY = function (params, callback) {

    var params4Upload = new manager_types.FileParam({
        ProductName: params.productName,
        ProductNo: params.productNo,
        DataType: params.dataType,
        ExpDate_Flag: params.expDate_Flag, 
        CardNumber: params.cardNumber,
        StartDate: params.startDate,
        FaceValue: params.faceValue,
        RealValue: params.realValue,
        excelKeyUrl: params.excelKeyUrl,
        orderId: params.orderId,
        sellerId: params.sellerId

        
    });

    //获取客户端
    var slotServ = new Lich.InvokeBag(Lich.ServiceKey.fileCards, 'fileToTY', [params4Upload]);
    Lich.wicca.invokeClient(slotServ, function (err, data) {
        logger.info("fileToTY result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == 1) {
            logger.error("slotServ.fileToTY because: ======" + err);
            res.code = 500;
            res.desc = "上传第三方卡密"+"失败";
            callback(res, null);
        } else if (data[0].result.code == 1) {
            logger.warn("上传第三方卡密，参数为：" + JSON.stringify(params4Upload));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
        } else {
            callback(null, data);
        }
    });

};

module.exports = new FileCards();