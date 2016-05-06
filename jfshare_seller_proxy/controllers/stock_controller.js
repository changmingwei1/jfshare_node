/**
 * Created by Administrator on 2016/5/5 0005.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Stock = require('../lib/models/stock');

var Storehouse = require('../lib/models/storehouse');


// ��ѯ��Ʒ���ܿ��
/****
 *
 * ����ӿڲ�Ӧ�ö��⿪�ţ�ֻ�Ƿ������ڲ�ֱ�ӵ���stock������������õ���Ʒ��
 *
 *
 *
 *
 */
router.post('/query', function(request, response, next) {
    //var result = {code: 200};
    //
    //try{
    //    var arg = request.body;
    //    logger.info("��ѯ�����б����������" + JSON.stringify(arg));
    //    var params = {};
    //    //userid ��Ϊ��userId  2016.4.12
    //    params.userId = arg.sellerId || null;
    //    params.orderStatus = arg.orderstatus;
    //    params.percount = arg.percount || 20;
    //    params.curpage = arg.curpage || 1;
    //    params.userType = arg.userType || 1;
    //
    //    if(params.userId == null) {
    //        result.code = 400;
    //        result.desc = "û����д�û��ɣ�";
    //        response.json(result);
    //        return;
    //    }
    //
    //    Stock.queryProduct(params, function (err, data) {
    //        if(err){
    //            response.json(err);
    //            return;
    //        }
    //        response.json(result);
    //        logger.info("get order list response:" + JSON.stringify(result));
    //    });
    //} catch (ex) {
    //    logger.error("get product stock error:" + ex);
    //    result.code = 500;
    //    result.desc = "��ȡ��Ʒ���ʧ��";
    //    response.json(result);
    //}
});

//��ѯĳ��shu��ĳ��ʡ�ݵĿ�棬��ʵ���ǲ�ѯĳ��
router.post('/quertySku', function(request, response, next) {
    var result = {code: 200};

    try{
        var params = request.body;
        logger.info("��ѯsku������������" + JSON.stringify(arg));

        if(params.skuNum == null ||params.skuNum=="") {
            result.code = 400;
            result.desc = "��������";
            response.json(result);
            return;
        }

        if(params.provinceId == null|| params.provinceId == ""||params.provinceId <=0){
            result.code = 400;
            result.desc = "��������";
            response.json(result);
            return;
        }
        if(params.sellerId == null|| params.sellerId == ""||params.sellerId <=0){
            result.code = 400;
            result.desc = "��������";
            response.json(result);
            return;
        }
        if(params.productId == null||params.productId == ""){
            result.code = 400;
            result.desc = "��������";
            response.json(result);
            return;
        }
        var storehouseId = "";
        async.waterfall([
                function (callback) {
                    Storehouse.list(params, function(err, data) {


                        /*********����б���д����ѯ************/

                        storehouseId = 1;
                        logger.info("get storehouse list response:" + JSON.stringify(data));
                        callback(null,storehouseId);
                    })
                },
                function (storehouseId,callback) {
                    //��ѯsku���
                    Stock.queryBySkuAndStoreId(params, function (err, data) {
                        if(err){
                            response.json(err);
                            return;
                        }
                        response.json(result);
                        logger.info("quertySku response:" + JSON.stringify(result));
                    })
                }

            ],
            function (err, data) {
                if (err) {
                    logger.error("get skuStock error:" + err);
                } else {
                    logger.info("get skuStock response:" + JSON.stringify(result));
                    response.json(result);

                }
            });
    } catch (ex) {
        logger.error("get product stock error:" + ex);
        result.code = 500;
        result.desc = "��ȡ��Ʒ���ʧ��";
        response.json(result);
    }
});
module.exports = router;