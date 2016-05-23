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

function Address(){}

//添加收货地址
Address.prototype.addAddress = function(param,  callback) {

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

    logger.info("调用addressServ-addAddress  args:" + JSON.stringify(addrInfo));

    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "addAddress", addrInfo);

    Lich.wicca.invokeClient(addressServ, function(err, data) {
        logger.info("调用addressServ-addAddress  result:" + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("调用addressServ-addAddress失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "添加收货地址信息失败！";
            callback(res, null);
        }
        // data[0].result.code == "1"
        if(data[0].result.code==1){
            res.code = 500;
            res.desc =data[0].result.failDescList[0].desc ;
            callback(res, null);
        }
        else {
            callback(null, data);
        }
    });
};

//修改收货地址,包含设为默认
Address.prototype.updateAddress = function(param,  callback) {

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

    logger.info("调用addressServ-updateAddress  args:" + JSON.stringify(addrInfo));
    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "updateAddress", addrInfo);

    Lich.wicca.invokeClient(addressServ, function(err, data) {
        logger.info("调用addressServ-updateAddress  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].code == "1"){
            logger.error("调用addressServ-updateAddress失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "列新收货地址信息失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

//地址设为默认
Address.prototype.setDefaultAddress = function(param,callback) {

    var userId = param.userId;
    var addressId = param.addressId;

    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "setDefaultAddress", [userId,addressId]);

    Lich.wicca.invokeClient(addressServ, function(err, data) {
        logger.info("调用addressServ-setDefaultAddress  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].code == "1"){
            logger.error("调用addressServ-setDefaultAddress  失败原因 ======" + err);
            res.code = 500;
            res.desc = "设为默认地址失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

//删除收货地址
Address.prototype.delAddress = function(param, callback) {

    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "delAddress", [param.userId, param.addrId]);

    Lich.wicca.invokeClient(addressServ, function(err, data) {
        logger.info("调用addressServ-delAddress  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].code == 1){
            logger.error("调用addressServ-delAddress失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "删除收货地址信息失败！";
            callback(res, null);
        } else {
            callback(null, null);
        }
    });
};

//查询收货地址
Address.prototype.queryAddress = function(param, callback) {
    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "queryAddress", param.userId);

    Lich.wicca.invokeClient(addressServ, function(err, data) {
        logger.info("调用addressServ-queryAddress  result:" + JSON.stringify(data));
        var res = {};
        if(err || data[0].result.code == "1"){
            logger.error("调用addressServ-queryAddress失败  失败原因 ======" + err);
            logger.error("错误信息:" + JSON.stringify(data[0].result));
            res.code = 500;
            res.desc = "查询收货地址列表失败！";
            callback(res, null);
        } else {
            callback(null, data[0].addressInfoList);
        }
    });
};

//获取默认收货地址
Address.prototype.getDefaultAddress = function(param,  callback) {
    var addressServ = new Lich.InvokeBag(Lich.ServiceKey.AddressServer, "getDefaultAddress", param.userId);

    Lich.wicca.invokeClient(addressServ, function(err, data) {
        logger.info("调用addressServ-getDefaultAddress  result:" + JSON.stringify(data));
        var res = {};
        if(err){
            logger.error("调用addressServ-getDefaultAddress失败  失败原因 ======" + err);
            res.code = 500;
            res.desc = "获取默认地址失败！";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//获取省份
Address.prototype.getProvinces = function(callback) {


    var commonServer = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "province",[]);
    Lich.wicca.invokeClient(commonServer, function(err, data) {
        logger.info("commonServer-getProvinces  result:" + JSON.stringify(data));
        var res = {};
        if(err||data[0].result.code == 1){
            logger.error("commonServer-getProvinces  失败原因 ======" + err);
            res.code = 500;
            res.desc = "获取省份列表失败！";
            callback(res, null);
        } else {
            var provicnces = data[0].areaInfo;
            var provicnceList = [];
            provicnces.forEach(function(provicnce){

                var provicnce = ({
                    id:         provicnce.id,
                    name:       provicnce.name,
                    shortName:  provicnce.shortName
                });
                provicnceList.push(provicnce);
            });
            callback(null, provicnceList);
        }
    });

};

//获取城市
Address.prototype.getCitys = function(params,callback) {


    var commonServer = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "city",[params.provinceId]);
    Lich.wicca.invokeClient(commonServer, function(err, data) {
        logger.info("commonServer-getCitys  result:" + JSON.stringify(data));
        var res = {};
        if(err||data[0].result.code == 1){
            logger.error("commonServer-getCitys  失败原因 ======" + err);
            res.code = 500;
            res.desc = "获取市列表失败！";
            callback(res, null);
        } else {
            logger.info(data);


            var citys = data[0].areaInfo;
            var cityList = [];
            citys.forEach(function(cityInfo){

                var city = ({
                    id:         cityInfo.id,
                    name:       cityInfo.name,
                    shortName:  cityInfo.shortName
                });
                cityList.push(city);
            });
            callback(null, cityList);
        }
    });

};

//获取市县
Address.prototype.getCountys = function(params,callback) {


    var commonServer = new Lich.InvokeBag(Lich.ServiceKey.CommonServer, "county",[params.cityId]);
    Lich.wicca.invokeClient(commonServer, function(err, data) {
        logger.info("commonServer-getcountys  result:" + JSON.stringify(data));
        var res = {};
        if(err||data[0].result.code == 1){
            logger.error("commonServer-getcountys  失败原因 ======" + err);
            res.code = 500;
            res.desc = "获取乡镇列表失败！";
            callback(res, null);
        } else {
            logger.info(data);


            var countys = data[0].areaInfo;
            var countyList = [];
            countys.forEach(function(countyInfo){

                var county = ({
                    id:         countyInfo.id,
                    name:       countyInfo.name,
                    shortName:  countyInfo.shortName
                });
                countyList.push(county);
            });
            callback(null, countyList);
        }
    });

};

module.exports = new Address();