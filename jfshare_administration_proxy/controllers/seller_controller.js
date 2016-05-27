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

        /***
         *
         * loginName: params.loginName,
         sellerName: params.sellerName,
         pwdEnc: params.pwdEnc,
         companyName: params.companyName,
         shopName: params.shopName,
         contactName: params.contactName,
         openBank: params.openBank,
         accountHolder: params.accountHolder,
         accountNumber: params.accountNumber,
         remark: params.remark,
         provinceId: params.provinceId,
         provinceName: params.provinceName,
         cityId: params.cityId,
         cityName: params.cityName,
         countyId: params.countyId,
         countyName: params.countyName,
         address: params.address,
         mobile: params.mobile,
         tel: params.tel,
         email: params.email
         *
         *
         *
         *
         *
         *
         */
        var params = request.body;

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
                /***********
                 *  loginName: params.loginName,
                 sellerName: params.sellerName,
                 pwdEnc: params.pwdEnc,
                 companyName: params.companyName,
                 shopName: params.shopName,
                 contactName: params.contactName,
                 openBank: params.openBank,
                 accountHolder: params.accountHolder,
                 accountNumber: params.accountNumber,
                 remark: params.remark,
                 provinceId: params.provinceId,
                 provinceName: params.provinceName,
                 cityId: params.cityId,
                 cityName: params.cityName,
                 countyId: params.countyId,
                 countyName: params.countyName,
                 address: params.address,
                 mobile: params.mobile,
                 tel: params.tel,
                 email: params.email
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 */

                var sellerObject= data[0].seller;
                var sellerTemp=[];
                var sellerData = ({
                    sellerId: sellerObject.sellerId,
                    companyName: sellerObject.companyName,
                    sellerName: sellerObject.sellerName,
                    mobile: sellerObject.mobile,
                    tel: sellerObject.tel,
                    email: sellerObject.email,
                    contactName: sellerObject.contactName,
                    provinceId: sellerObject.provinceId,
                    cityId: sellerObject.cityId,
                    countyId: sellerObject.countyId,
                    provinceName: sellerObject.provinceName,
                    cityName: sellerObject.cityName,
                    countyName: sellerObject.countyName,
                    address: sellerObject.address,
                    bank: sellerObject.openBank,
                    accountNumber: sellerObject.accountNumber,
                    accountHolder: sellerObject.accountHolder,
                    remark:sellerObject.remark

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
        Seller.resetSellerPwd(params, function (err, data) {
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
        if (params.curPage == null || params.curPage == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if (params.perCount == null || params.perCount == "") {
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


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