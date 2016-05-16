/**
 * @author YinBo on 16/4/20.
 */

var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var product_types = require("../thrift/gen_code/product_types");
var stock_types = require('../thrift/gen_code/stock_types');
var address_types = require('../thrift/gen_code/address_types');
var order_types = require('../thrift/gen_code/order_types');
var cart_types = require('../thrift/gen_code/cart_types');
var pay_types = require('../thrift/gen_code/pay_types');
var trade_types = require('../thrift/gen_code/trade_types');
var buyer_types = require('../thrift/gen_code/buyer_types');
var common_types = require('../thrift/gen_code/common_types');
var baseTemplate_types = require('../thrift/gen_code/baseTemplate_types');

function BaseTemplate(){}

/*�ʷѼ���*/
BaseTemplate.prototype.calculatePostage = function(param,  callback) {

    var productPostageBasicList = [];
    var sellerPostageBasicList = [];
    var productPostageBasic = ({
        productId:param.productId,
        templateId:param.templateId,
        number:param.number,
        weight:param.weight,
        amount:param.amount
    });
    productPostageBasicList.push(productPostageBasic);
    sellerPostageBasicList.push(productPostageBasicList);

    var params = new baseTemplate_types.CalculatePostageParam({
        sendToProvince: param.sendToProvince,
        sellerPostageBasicList:sellerPostageBasicList
    });

    logger.info("�����ʷѼ��㣬  args:" + JSON.stringify(params));
    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "calculatePostage", params);

    Lich.wicca.invokeClient(addressServ, function(err, data) {
        logger.info("�����ʷѼ��㣬  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
            logger.error("�����ʷѼ���ʧ��  ʧ��ԭ�� ======" + err);
            res.code = 500;
            res.desc = "�ʷѼ���ʧ�ܣ�";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

/*��ѯ�ֿ�*/
BaseTemplate.prototype.queryStorehouse = function(params,callback){
    var param = new baseTemplate_types.StorehouseQueryParam({
        sellerId: params.sellerId
    });
    //��ȡclient
    var BaseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.BaseTemplateServer,'queryStorehouse',param);
    Lich.wicca.invokeClient(BaseTemplateServ, function(err, data){
        logger.info("get BaseTemplate result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == 1) {
            logger.error("���ܻ�ȡ�ֿ���Ϣ because: ======" + err);
            res.code = 500;
            res.desc = "��ȡ�ֿ�ʧ��";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*��ȡ�ֿ���Ϣ*/
BaseTemplate.prototype.getStorehouse = function(storehouseIds,callback){

    //��ȡclient
    var BaseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.BaseTemplateServer,'getStorehouse',storehouseIds);

    Lich.wicca.invokeClient(BaseTemplateServ, function(err, data){
        logger.info("get BaseTemplate result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == 1) {
            logger.error("���ܻ�ȡ�ֿ���Ϣ because: ======" + err);
            res.code = 500;
            res.desc = "��ȡ�ֿ�ʧ��";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

/*������ȡ��Ʒ�ջ�ʡ�ݶ�Ӧ�ķ����ֿ�*/
BaseTemplate.prototype.getDeliverStorehouse = function(params,calback){

    var productRefProvinceList = [];

    var productRefProvince = new baseTemplate_types.ProductRefProvince({
        sellerId: params.sellerId,
        productId: params.productId,
        storehouseIds: params.storehouseIds,
        sendToProvince: params.provinceId
    });

    productRefProvinceList.push(productRefProvince);

    var param = new baseTemplate_types.DeliverStorehouseParam({
        productRefProvinceList:productRefProvinceList
    });

    //��ȡclient
    var BaseTemplateServ = new Lich.InvokeBag(Lich.ServiceKey.BaseTemplateServer,'getDeliverStorehouse',param);
    Lich.wicca.invokeClient(BaseTemplateServ, function(err, data){
        logger.info("get BaseTemplate result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].result.code == 1) {
            logger.error("���ܻ�ȡ�ֿ���Ϣ because: ======" + err);
            res.code = 500;
            res.desc = "��ȡ�ֿ�ʧ��";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new BaseTemplate();