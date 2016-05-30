/**
 * Created by Administrator on 2016/5/6 0006.
 */

var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var AfterSale = require('../lib/models/afterSale');

//�ۺ����
router.post('/review', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("�ۺ���˵Ĳ���:" + JSON.stringify(params));
        if (params.productId == null || params.productId == "") {
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }
        if (params.userId == null || params.userId == "") {
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }
        if (params.sellerId == null || params.sellerId == "") {
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }
        if (params.skuNum == null || params.skuNum == "") {
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }
        if (params.reviewResult == "1") { //��ʾ�ܾ�
            params.state = 3;
        } else if (params.reviewResult == "0") { //��ʾͬ��

            params.state = 2; //����ʵ��������� �� 1���½�������ˣ� 2�����ͨ�� 3����˲�ͨ��
        } else {
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }
        AfterSale.auditPass(params, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            logger.info(" AfterSale.auditPass response:" + JSON.stringify(result));
            return response.json(result);

        });
    } catch (ex) {
        logger.error(" AfterSale.auditPass error:" + ex);
        result.code = 500;
        result.desc = "���ʧ��";
        response.json(result);
    }
});
//�����Ϣ��ѯ
router.post('/toReview', function (request, response, next) {
    var result = {code: 200};

    try {
        var params = request.body;
        logger.info("�����Ϣ��ѯ�� arg:" + JSON.stringify(params));

        if (params.productId == null || params.productId == "") {
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }
        if (params.orderId == null || params.orderId == "") {
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }

        if (params.skuNum == null || params.skuNum == "") {
            result.code = 400;
            result.desc = "�����������";
            response.json(result);
            return;
        }
        AfterSale.queryAfterSale(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }
            result.message = data;
            logger.info("AfterSale.queryAfterSale response:" + JSON.stringify(result));
            return response.json(result);

        });
    } catch (ex) {
        logger.error("AfterSale.queryAfterSale error:" + ex);
        result.code = 500;
        result.desc = "��ѯ�����Ϣʧ��";
        response.json(result);
    }
});


module.exports = router;