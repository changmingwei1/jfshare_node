/**
 * Created by huapengpeng on 2016/4/21.
 */
/**
 * @auther YinBo 2016/4/12
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var product_types = require("../thrift/gen_code/product_types");
var stock_types = require('../thrift/gen_code/stock_types');
var address_types = require('../thrift/gen_code/address_types');
var order_types = require('../thrift/gen_code/order_types');
var cart_types = require('../thrift/gen_code/cart_types');
var trade_types = require('../thrift/gen_code/trade_types');
var common_types = require('../thrift/gen_code/common_types');
var manager_types = require("../thrift/gen_code/manager_types");


function User() {
}
//登录
User.prototype.login = function (params, callback) {

    var User = new manager_types.Commissioner({
        loginName: params.loginName,

        pwdEnc: params.pwdEnc
    });
//如果校验可能需要修改
    var LoginLog = new manager_types.LoginLog({
        sellerId: params.sellerId,
        tokenId: params.tokerId,
        ip: params.ip,
        browser: params.browser,
        fromSource: params.fromSource,
        loginAuto: params.loginAuto,
        loginTime: params.loginTime,
        logoutTime: params.logoutTime,
        validate:params.validate,
        url:params.url
    });


    //获取客户端
    var userServ = new Lich.InvokeBag(Lich.ServiceKey.ManagerServer, 'signin', [User, LoginLog]);
    Lich.wicca.invokeClient(userServ, function (err, data) {
        logger.info("isLoginNameExist result:" + JSON.stringify(data));
        var res = {};
        if (err) {
            logger.error("请求参数：" + JSON.stringify(param));
            logger.error("signin fail because: ======" + err);
            res.code = 500;
            res.desc = "false to signin";
            callback(res, null);
        } else if(data[0].result.code == 1){
            logger.warn("请求参数：" + JSON.stringify(param));
            res.code = 500;
            res.desc = data[0].result.failDescList[0].desc;
            callback(res, null);
        }else{
            callback(null, data);
        }






    });
};

//�����û���Ϣ(�����޸�ע���ֻ�)
//Buyer.prototype.updateBuyer = function(param,callback){
//
//    var value = new common_types.Captcha({value:param.value});
//
//    var buyer = new buyer_types.Buyer({
//        userId:param.userId,
//        loginName:param.loginName,
//        userName:param.userName,
//        pwdEnc:param.pwdEnc,
//        favImg:param.favImg,
//        birthday:param.birthday,
//        sex:param.sex,
//        idCard:param.idCard,
//        mobile:param.mobile,
//
//        tel:param.tel,
//        email:param.email,
//        provinceId:param.provinceId,
//        cityId:param.cityId,
//        countyId:param.countyId,
//        provinceName:param.provinceName,
//        cityName:param.cityName,
//        address:param.address,
//        postCode:param.postCode,
//        degree:param.degree,
//        salary:param.salary,
//        remark:param.remark,
//        serial:param.serial,
//        createTime:param.createTime,
//        lastUpdateTime:param.lastUpdateTime
//    });
//
//    //��ȡclient
//    var buyerServ = new Lich.InvokeBag(Lich.ServiceKey.BuyerServer,'updateBuyer',[buyer]);
//
//    Lich.wicca.invokeClient(buyerServ,commonServ, function(err, data){
//        logger.info("updateBuyer result:" + JSON.stringify(data));
//        var res = {};
//        if (err||data[0].result.code == "1") {
//            logger.error("can't updateBuyer because: ======" + err);
//            res.code = 500;
//            res.desc = "false to updateBuyer";
//            callback(res, null);
//        } else {
//            callback(null, data);
//        }
//    });
//};


module.exports = new User();