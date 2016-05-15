/**
 * Created by Administrator on 2016/4/22.
 */
/**
 * Created by huapengpeng on 2016/4/22.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);
var expresss = require('../lib/models/express');


//
router.post('/expresslist', function (request, response, next) {
    logger.info("进入获取物流商列表");
    var result = {code: 200};
    var expressList = [];
    result.expressList = expressList;

    try {

        var params = request.body;

        expresss.queryList(params, function (err, data) {
            if (err) {
                response.json(err);
                return;
            }


            if (data[0].expressInfoList != null) {
                for (var i = 0; i < data[0].expressInfoList.length; i++) {
                    var express = {};
                    express.id = data[0].expressInfoList[i].id;

                    express.name = data[0].expressInfoList[i].name;

                    expressList.push(express);
                }

            }
            logger.info("query expressList response:" + JSON.stringify(data));
            response.json(result);
            return;
        });


        logger.info("expresslist params:" + JSON.stringify(params));


    } catch (ex) {
        logger.error("query expressList error:" + ex);
        result.code = 500;
        result.desc = "获取物流商列表";
        response.json(result);
    }
});


module.exports = router;