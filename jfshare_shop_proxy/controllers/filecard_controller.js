var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var fileCards = require('../lib/models/file_card');// 广告位功能模块

/*第三方卡密上传*/
router.post('/fileToTY', function (request, response, next) {
    logger.info("第三方卡密上传");
    var result = {code: 200};
    var AdvertSlotImageList = [];
    try {
        var params = request.body;
        //参数校验
        logger.info("fileToTY params:" + JSON.stringify(params));
        //供应商平台商品编号
        if (params.productType == null || params.productType == "") {
            result.code = 400;
            result.desc = " productType 参数错误";
            response.json(result);
            return;
        }
        //1：卡号卡密组合 2：仅有卡号 3：仅有卡密
        if (params.dataType == null || params.dataType == "") {
            result.code = 400;
            result.desc = " dataType 参数错误";
            response.json(result);
            return;
        }
        //是否有有效期：0：有  1：没有
        if (params.expDate_Flag == null || params.expDate_Flag == "") {
            result.code = 400;
            result.desc = " expDate_Flag 参数错误";
            response.json(result);
            return;
        }
        //本文件中的点券数量
        if (params.cardNumber == null || params.cardNumber == "") {
            result.code = 400;
            result.desc = " cardNumber 参数错误";
            response.json(result);
            return;
        }
        //生成本文件时间，格式YYYYMMDD
        if (params.startDate == null || params.startDate == "") {
            result.code = 400;
            result.desc = " startDate 参数错误";
            response.json(result);
            return;
        }
        //卡券面值，单位分
        if (params.excelKeyUrl == null || params.excelKeyUrl == "") {
            result.code = 400;
            result.desc = " excelKeyUrl 参数错误";
            response.json(result);
            return;
        }
        //商家名称
        if (params.sellerName == null || params.sellerName == "") {
            result.code = 400;
            result.desc = "参数错误,请输入贵司名称";
            response.json(result);
            return;
        }
        // if (params.realValue == null || params.realValue == "") {
        //     result.code = 400;
        //     result.desc = " realValue 参数错误";
        //     response.json(result);
        //     return;
        // }
        //if (params.excelKeyUrl == null || params.excelKeyUrl == "") {
        //    result.code = 400;
        //    result.desc = " excelKeyUrl 参数错误";
        //    response.json(result);
        //    return;
        //}

        params.isTestFlag = false;

        fileCards.fileToTY(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("fileToTY result:" + JSON.stringify(result));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error(" 第三方卡密上传异常:" + ex);
        result.code = 500;
        result.desc = " 第三方卡密上传错误";
        response.json(result);
    }
});

/*第三方卡密上传*/
router.post('/fileToTYTest', function (request, response, next) {
    logger.info("第三方卡密上传");
    var result = {code: 200};
    var AdvertSlotImageList = [];
    try {
        var params = request.body;
        //参数校验
        logger.info("fileToTY params:" + JSON.stringify(params));
        //供应商平台商品编号
        if (params.productType == null || params.productType == "") {
            result.code = 400;
            result.desc = " productType 参数错误";
            response.json(result);
            return;
        }
        //1：卡号卡密组合 2：仅有卡号 3：仅有卡密
        if (params.dataType == null || params.dataType == "") {
            result.code = 400;
            result.desc = " DataType 参数错误";
            response.json(result);
            return;
        }
        //是否有有效期：0：有  1：没有
        if (params.expDate_Flag == null || params.expDate_Flag == "") {
            result.code = 400;
            result.desc = " ExpDate_Flag 参数错误";
            response.json(result);
            return;
        }
        //本文件中的点券数量
        if (params.cardNumber == null || params.cardNumber == "") {
            result.code = 400;
            result.desc = " CardNumber 参数错误";
            response.json(result);
            return;
        }
        //生成本文件时间，格式YYYYMMDD
        if (params.startDate == null || params.startDate == "") {
            result.code = 400;
            result.desc = " StartDate 参数错误";
            response.json(result);
            return;
        }
        //卡券面值，单位分
        if (params.excelKeyUrl == null || params.excelKeyUrl == "") {
            result.code = 400;
            result.desc = " excelKeyUrl 参数错误";
            response.json(result);
            return;
        }
        // if (params.realValue == null || params.realValue == "") {
        //     result.code = 400;
        //     result.desc = " realValue 参数错误";
        //     response.json(result);
        //     return;
        // }
        //if (params.excelKeyUrl == null || params.excelKeyUrl == "") {
        //    result.code = 400;
        //    result.desc = " excelKeyUrl 参数错误";
        //    response.json(result);
        //    return;
        //}

        params.isTestFlag = true;

        fileCards.fileToTY(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("fileToTY result:" + JSON.stringify(result));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error(" 第三方卡密上传异常:" + ex);
        result.code = 500;
        result.desc = " 第三方卡密上传错误";
        response.json(result);
    }
});

/*审核*/
router.post('/auditPass', function (request, response, next) {
    logger.info("进入管理中心审核接口");
    var result = {code: 200};
    var AdvertSlotImageList = [];
    try {
        var params = request.body;
        //参数校验
        logger.info("auditPass params:" + JSON.stringify(params));
        //供应商平台商品编号
        if (params.id == null || params.id == "") {
            result.code = 400;
            result.desc = " 参数错误";
            response.json(result);
            return;
        }
        if (params.type == null || params.type == "") {
            result.code = 400;
            result.desc = " 参数错误";
            response.json(result);
            return;
        }

        fileCards.auditPass(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            logger.info("auditPass result:" + JSON.stringify(result));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error(" 第三方卡密上传异常:" + ex);
        result.code = 500;
        result.desc = " 第三方卡密上传错误";
        response.json(result);
    }
});

/*查询列表*/
router.post('/queryCardsList', function (request, response, next) {
    logger.info("进入管理中心审核接口");
    var result = {code: 200};
    var AdvertSlotImageList = [];
    try {
        var params = request.body;
        if(params.curPage == null || params.curPage == ""){
            result.code = 400;
            result.desc = "分页参数错误";
            response.json(result);
            return;
        }
        if(params.perCount == null || params.perCount == ""){
            result.code = 400;
            result.desc = "分页参数错误";
            response.json(result);
            return;
        }
        if(params.status == null || params.status == ""){
            result.code = 400;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        //参数校验
        logger.info("queryCardsList params:" + JSON.stringify(params));

        fileCards.queryCardsList(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            var ThirdCardList = data[0].thirdPartyCards;
            var pagination = data[0].pagination;
            result.page = {total: pagination.totalCount, pageCount: pagination.pageNumCount};
            result.ThirdCardList = ThirdCardList;
            logger.info("queryCardsList result:" + JSON.stringify(result));
            response.json(result);
            return;
        });
    } catch (ex) {
        logger.error(" 查询列表异常:" + ex);
        result.code = 500;
        result.desc = " 查询列表异常";
        response.json(result);
    }
});

module.exports = router;