/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Seller = require('../lib/models/seller');

// 添加商家
router.post('/add', function (request, response, next) {
    var result = {code: 200};
    try {
        var params = request.body;

        //----测试参数---------------
        //var arg = request.body;
        //var params = {};
        //
        //params.loginName = arg.loginName || "卖家测试2号";
        //params.sellerName = arg.sellerName || "卖家昵称111";
        //params.pwdEnc = arg.pwdEnc || "123456abc2434";
        //params.companyName = arg.companyName || "新媒传信";
        //params.shopName = arg.shopName || "新媒传信shopname";
        //params.contactName = arg.contactName || "测试联系人名";
        //params.openBank = arg.openBank || "中国人民银行";
        //params.accountHolder = arg.accountHolder || "李四2";
        //params.accountNumber = arg.accountNumber || "1000000000000000";
        //params.remark = arg.remark || "备注信息";
        //params.provinceId = arg.provinceId || "110000";
        //params.provinceName = arg.provinceName || "北京市";
        //params.cityId = arg.cityId || "110100";
        //params.cityName = arg.cityName || "北京市";
        //params.countyId = arg.countyId || "110102";
        //params.countyName = arg.countyName || "昌平";
        //params.address = arg.address || "地址";
        //params.mobile = arg.mobile || "13558731840";
        //params.tel = arg.tel || "010-88888888";
        //params.email = arg.email || "123456@qq.com";
        //-----------------end--------------------

        logger.info("SellerServ-signup params:" + JSON.stringify(params));


        if (params.loginName == null || params.loginName == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.companyName == null || params.companyName == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.pwdEnc == null || params.pwdEnc == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Seller.signup(params, function (err, data) {
            logger.info("SellerServ-signup response:" + JSON.stringify(data));
            var brandInfo = [];
            if (err) {
                response.json(err);
                return;
            }
            logger.info(" SellerServ-signup response:" + JSON.stringify(result));
            response.json(result);
        });

    } catch (ex) {
        logger.error("SellerServ-signup error:" + ex);
        result.code = 500;
        result.desc = "商家注册异常";
        response.json(result);
    }
});

// 获取商家信息
router.post('/get', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;

        if(params.sellerId==null||params.sellerId==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Seller.querySeller(params, function (err, data) {
            logger.info("SellerServ-get response:" + JSON.stringify(data));
            if (err) {
                response.json(err);
                return;
            }else{
                var sellerObject= data[0].seller;
                var sellerTemp=[];
                var sellerData = ({
                    sellerId: sellerObject.sellerId,
                    companyName: sellerObject.companyName,
                    loginName: sellerObject.loginName,

                    userName: sellerObject.sellerName,
                    mobile: sellerObject.mobile,
                    tel: sellerObject.tel,
                    email: sellerObject.email,

                    provinceId: sellerObject.provinceId,
                    cityId: sellerObject.cityId,
                    countyId: sellerObject.countyId,
                    provinceName: sellerObject.provinceName,
                    cityName: sellerObject.cityName,
                    countyName: sellerObject.countyName,
                    address: sellerObject.address,
                    remark: sellerObject.remark,
                    bank: sellerObject.openBank,
                    account: sellerObject.accountNumber,
                    accountName: sellerObject.accountHolder

                });
                sellerTemp.push(sellerData);
                result.seller=sellerData;
                logger.info(" SellerServ-get response:" + JSON.stringify(result));
                response.json(result);
            }

        });

    } catch (ex) {
        logger.error(" SellerServ-get error:" + ex);
        result.code = 500;
        result.desc = "获取商家信息失败";
        response.json(result);
    }
});

// 修改商家密码
router.post('/editpwd', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("SellerServ-editpwd params:" + JSON.stringify(params));

        if (params.sellerId == null || params.sellerId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if (params.pwdEnc == null || params.pwdEnc == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        //更新密码与商家更新为同一个方法
        Seller.updateSeller(params, function (err, data) {
            logger.info("SellerServ-editpwd response:" + JSON.stringify(data));
            if (err) {
                response.json(err);
                return;
            }
            logger.info(" SellerServ-editpwd response:" + JSON.stringify(result));
            response.json(result);
        });
    } catch (ex) {
        logger.error("修改密码 error:" + ex);
        result.code = 500;
        result.desc = "修改密码失败";
        res.json(result);
    }
});

// 修改商家信息
router.post('/update', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;

        //---------------测试参数-------------------
        //var arg = request.body;
        //var params = {};
        //params.sellerId= arg.id || "16";

        //params.sellerName = arg.sellerName || "卖家昵称111";
        //params.pwdEnc = arg.pwdEnc || "123456111114";
        //params.loginName = arg.loginName || "卖家测试2号";
        //params.companyName = arg.companyName || "新媒传信";
        //params.shopName = arg.shopName || "新媒传信shopname";
        //params.contactName = arg.contactName || "333测试联系人名22222";
        //params.openBank = arg.openBank || "中国人民银行";
        //params.accountHolder = arg.accountHolder || "李四2";
        //params.accountNumber = arg.accountNumber || "1000000000000000";
        //params.remark = arg.remark || "备注信息";
        //params.provinceId = arg.provinceId || "110000";
        //params.provinceName = arg.provinceName || "北京市";
        //params.cityId = arg.cityId || "110100";
        //params.cityName = arg.cityName || "北京市";
        //params.countyId = arg.countyId || "110102";
        //params.countyName = arg.countyName || "昌平";
        //params.address = arg.address || "地址";
        //params.mobile = arg.mobile || "13555555555";
        //params.tel = arg.tel || "010-88888888";
        //params.email = arg.email || "12345678@qq.com";

        logger.info("SellerServ-update params:" + JSON.stringify(params));


        if (params.sellerId == null || params.sellerId == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Seller.updateSeller(params, function (err, data) {
            logger.info("SellerServ-update response:" + JSON.stringify(data));
            var brandInfo = [];
            if (err) {
                response.json(err);
                return;
            }
            logger.info(" SellerServ-update response:" + JSON.stringify(result));
            response.json(result);
        });
    } catch (ex) {
        logger.error("update seller error:" + ex);
        result.code = 500;
        result.desc = "更新系统消息失败";
        response.json(result);
    }
});

//商家列表
router.post('/list', function (request, response, next) {
    var result = {code: 200};

    try {

        var params = request.body;

        Seller.querySellerList(params, function (err, data) {
            logger.info("SellerServ-querySellerList response:" + JSON.stringify(data));
            var brandInfo = [];
            if (err) {
                response.json(err);
                return;
            } else {
                var sellerList = [];

                var sellerAllList = data[0].sellerList;
                if(data[0].total!=0) {
                    sellerAllList.forEach(function (sellerData) {
                        var sellerTemp = ({
                            sellerId: sellerData.sellerId,
                            userName: sellerData.sellerName,
                            loginName: sellerData.loginName,

                            contacts: sellerData.contactName,
                            mobile: sellerData.mobile,
                            email: sellerData.email
                        });
                        sellerList.push(sellerTemp);
                    });
                }
                var sellerPagination = data[0].pagination;

                var sellerPage=[];
                sellerPage.push({
                    total:sellerPagination.totalCount,
                    pageCount:sellerPagination.pageNumCount

                });

                result.page = sellerPage;
                result.sellerList = sellerList;

                logger.info(" SellerServ-querySellerList response:" + JSON.stringify(result));
                response.json(result);
            }
        });

    } catch (ex) {
        logger.error("SellerServ-querySellerList error:" + ex);
        result.code = 500;
        result.desc = "获取商家列表失败";
        response.json(result);
    }
});

module.exports = router;