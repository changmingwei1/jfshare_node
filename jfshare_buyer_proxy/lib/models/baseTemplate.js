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
var baseTemplate = require('../thrift/gen_code/baseTemplate_types');

function BaseTemplate(){}

//����ջ���ַ
BaseTemplate.prototype.addAddress = function(param,  callback) {

    var addrInfo = new address_types.AddressInfo({
        userId: param.userId,
        receiverName: param.receiverName,
        mobile: param.mobile,
        provinceId: param.provinceId,
        provinceName: param.provinceName,
        cityId: param.cityId,
        cityName: param.cityName,
        countyId:param.countyId,
        countyName:param.countyName,
        address: param.address,
        postCode: param.postCode,
        isDefault: param.isDefault
    });

    logger.info("����addressServ-addAddress  args:" + JSON.stringify(addrInfo));

    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "addAddress", addrInfo);

    Lich.wicca.invokeClient(addressServ, function(err, data) {
        logger.info("����addressServ-addAddress  result:" + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("����addressServ-addAddressʧ��  ʧ��ԭ�� ======" + err);
            res.code = 500;
            res.desc = "����ջ���ַ��Ϣʧ�ܣ�";
            callback(res, null);
        }
        // data[0].result.code == "1"
        if(data[0].result.code==1){
            res.code = 500;
            res.desc =data[0].result.failDescList[0].desc ;
            callback(res, null);
        }
        else {
            callback(null, null);
        }
    });
};

//�޸��ջ���ַ,������ΪĬ��
BaseTemplate.prototype.updateAddress = function(param,  callback) {

    var addrInfo = new address_types.AddressInfo({
        userId: param.userId,
        id:param.addrId,
        receiverName: param.receiverName,
        mobile: param.mobile,
        provinceId: param.provinceId,
        provinceName: param.provinceName,
        cityId: param.cityId,
        cityName: param.cityName,
        countyId:param.countyId,
        countyName:param.countyName,
        address: param.address,
        postCode: param.postCode,
        isDefault: param.isDefault
    });

    logger.info("����addressServ-updateAddress  args:" + JSON.stringify(addrInfo));
    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "updateAddress", addrInfo);

    Lich.wicca.invokeClient(addressServ, function(err, data) {
        logger.info("����addressServ-updateAddress  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].code == "1"){
            logger.error("����addressServ-updateAddressʧ��  ʧ��ԭ�� ======" + err);
            res.code = 500;
            res.desc = "�����ջ���ַ��Ϣʧ�ܣ�";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

module.exports = new BaseTemplate();