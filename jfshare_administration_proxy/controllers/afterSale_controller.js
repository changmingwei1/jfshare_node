/**
 * Created by Administrator on 2016/5/6 0006.
 */

var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var AfterSale = require('../lib/models/afterSale');

//�ۺ����
router.post('/review', function(request, response, next) {
    var result = {code: 200};

    try{
        var params = request.body;
        logger.info("�ۺ���˵Ĳ���:" + JSON.stringify(arg));
        //productId: string //��Ʒid
        //orderId: string   //����id
        //skuId: int		 //skuid
        //userid:int     //�û�id
        //sellerId:int   //����id
        //reviewResult: string //��˵Ľ��  //0��ʾͬ�� 1 ��ʾ�ܾ�

        if(params.productId == null || params.productId == ""){
            result.code = 400;
            result.desc = "�����������";
            res.json(result);
            return;
        }
        if(params.orderId == null || params.orderId == ""){
            result.code = 400;
            result.desc = "�����������";
            res.json(result);
            return;
        }
        if(params.userId == null || params.userId == ""){
            result.code = 400;
            result.desc = "�����������";
            res.json(result);
            return;
        }

        if(params.sellerId == null || params.sellerId == ""){
            result.code = 400;
            result.desc = "�����������";
            res.json(result);
            return;
        }

        if(params.skuNum == null || params.skuNum == ""){
            result.code = 400;
            result.desc = "�����������";
            res.json(result);
            return;
        }


        AfterSale.auditPass(arg, function(err, data) {
            if(err){
                res.json(err);
                return;
            }
            res.json(result);
            logger.info(" AfterSale.auditPass response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error(" AfterSale.auditPass error:" + ex);
        result.code = 500;
        result.desc = "���ʧ��";
        response.json(result);
    }
});
//�����Ϣ��ѯ
router.post('/toReview', function(request, response, next) {
    var result = {code: 200};

    try{
        var params = request.body;
        logger.info("�����Ϣ��ѯ�� arg:" + JSON.stringify(params));

        if(params.productId == null || params.productId == ""){
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }
        if(params.orderId == null || params.orderId == ""){
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }

        if(params.skuNum == null || params.skuNum == ""){
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }
        AfterSale.queryAfterSale(params,function(err, data) {
            if(err){
                response.json(err);
                return;
            }
            response.json(result);
            logger.info("AfterSale.queryAfterSale response:" + JSON.stringify(result));
        });
    } catch (ex) {
        logger.error("AfterSale.queryAfterSale error:" + ex);
        result.code = 500;
        result.desc = "��ѯ�����Ϣʧ��";
        response.json(result);
    }
});
//�����ۺ� ��seller��û��������ܣ���˲����⿪���ӿڣ�
///����ķ�������뿴afterSale.js�ļ�
//router.post('/review', function (req, res, next) {
//    var result = {code: 200};
//
//    try {
//        var arg = req.body;
//        logger.info("�����ջ���ַ���� arg:" + JSON.stringify(arg));
//
//        if(arg == null) {
//            result.code = 400;
//            result.desc = "�����������";
//            res.json(result);
//            return;
//        }
//        if(arg.userId == null || arg.addrId == null){
//            result.code = 400;
//            result.desc = "�����������";
//            res.json(result);
//            return;
//        }
//
//        Product.updateAddress(arg, function(err, data) {
//            if(err){
//                res.json(err);
//                return;
//            }
//            res.json(result);
//            logger.info("update address response:" + JSON.stringify(result));
//        });
//    } catch (ex) {
//        logger.error("update address error:" + ex);
//        result.code = 500;
//        result.desc = "�����ջ���ַ��Ϣʧ��";
//        res.json(result);
//    }
//});

module.exports = router;