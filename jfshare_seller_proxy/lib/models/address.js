/**
 *
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
            logger.info(data);


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