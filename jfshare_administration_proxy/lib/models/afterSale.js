/**
 * Created by Administrator on 2016/5/6 0006.
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var afterSale_types = require("../thrift/gen_code/afterSale_types");


function AfterSale() {
}

//�ۺ����
AfterSale.prototype.auditPass = function (params, callback) {

    var afterSale = new afterSale_types.AfterSale({
        userId: params.buyerId,
        sellerId: params.sellerId,
        orderId: params.orderId,
        productId: params.productId,
        type: params.type,//��������. 1:�û����룬 2:ϵͳ����
        state: params.state, //����ʵ��������� �� 1���½�������ˣ� 2�����ͨ�� 3����˲�ͨ��
        skuNum: params.skuNum
    });

    logger.info("AfterSaleServ-auditPass  args:" + JSON.stringify(afterSale));

    var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "auditPass", afterSale);

    Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
        logger.info("AfterSaleServ-auditPass  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("AfterSaleServ-auditPass  ʧ��ԭ�� ======" + err);
            res.code = 500;
            res.desc = "���ʧ�ܣ�";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//�������
AfterSale.prototype.request = function (params, callback) {
    var afterSale = new afterSale_types.AfterSale({
        userId: params.buyerId,
        sellerId: params.sellerId,
        orderId: params.orderId,
        productId: params.productId,
        type: 1,//��������. 1:�û����룬 2:ϵͳ����
        state: 1, //����ʵ��������� �� 1���½�������ˣ� 2�����ͨ�� 3����˲�ͨ��
        skuNum: params.skuNum
    });
    logger.info("AfterSaleServ-request  args:" + JSON.stringify(afterSale));

    var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "request", afterSale);

    Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
        logger.info("AfterSaleServ-request  result:" + JSON.stringify(data));
        var res = {};
        if (err || data[0].result.code == "1") {
            logger.error("AfterSaleServ-request  ʧ��ԭ�� ======" + err);
            res.code = 500;
            res.desc = "�������ʧ�ܣ�";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
//��ѯ�����Ϣ
AfterSale.prototype.queryAfterSale = function (params, callback) {

    var afterSaleQueryParam = new afterSale_types.AfterSaleQueryParam({
        userId: params.userId,
        sellerId: params.sellerId,
        orderId: params.orderId,
        productId: params.productId,
        skuNum: params.skuNum
        //����sku
    });
    logger.info("AfterSaleServ-queryAfterSale  args:" + JSON.stringify(afterSaleQueryParam));
    try {
        var afterSaleServ = new Lich.InvokeBag(Lich.ServiceKey.AfterSaleServer, "queryAfterSale", afterSaleQueryParam);

        Lich.wicca.invokeClient(afterSaleServ, function (err, data) {
            logger.info("AfterSaleServ-queryAfterSale  result:" + JSON.stringify(data));
            var res = {};
            if (err || data[0].result.code == "1") {
                logger.error("AfterSaleServ-queryAfterSale  ʧ��ԭ�� ======" + err);
                res.code = 500;
                res.desc = "��ѯ�����Ϣʧ�ܣ�";
                callback(res, null);
            } else {
                callback(null, data[0].afterSaleList);
            }
        });
    } catch (ex) {
        res.code = 500;
        res.desc = "��ѯ�����Ϣʧ�ܣ�";
        callback(res, null);
    }

};
module.exports = new AfterSale();