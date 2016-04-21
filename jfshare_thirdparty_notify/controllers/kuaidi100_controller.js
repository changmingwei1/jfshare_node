/**
 * Created by L on 2015/10/24 0024.
 */
//引入所需模块
var express = require('express');
var router = express.Router();
var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js("record");
var expressSub = require("../lib/models/ExpressSub");

//模拟提交后端支付通知
router.get('/subscribe', function(req, res, next) {
    var paramters = {};

    res.render("test/jf189", paramters);
});

//模拟提交后端支付通知
router.post('/subscribe', function(req, res, next) {
    var notifyParam = req.body.param||"{\"status\":\"polling\",\"billstatus\":\"check\",\"message\":\"\",\"lastResult\":{\"message\":\"ok\",\"nu\":\"550285247179\",\"ischeck\":\"1\",\"condition\":\"F00\",\"com\":\"tiantian\",\"status\":\"200\",\"state\":\"3\",\"data\":[{\"time\":\"2016-02-22 13:37:26\",\"ftime\":\"2016-02-22 13:37:26\",\"context\":\"快件已签收,签收人是草签，签收网点是北京市朝阳安华桥\"},{\"time\":\"2016-02-22 07:51:50\",\"ftime\":\"2016-02-22 07:51:50\",\"context\":\"北京市朝阳安华桥的牛鹏超18518350628正在派件\"},{\"time\":\"2016-02-22 07:02:10\",\"ftime\":\"2016-02-22 07:02:10\",\"context\":\"快件到达北京市朝阳安华桥，上一站是北京集散，扫描员是张彪18519292322\"},{\"time\":\"2016-02-22 01:40:35\",\"ftime\":\"2016-02-22 01:40:35\",\"context\":\"快件由北京集散发往北京市朝阳安华桥\"},{\"time\":\"2016-02-20 22:42:14\",\"ftime\":\"2016-02-20 22:42:14\",\"context\":\"快件由温州分拨中心发往北京集散\"},{\"time\":\"2016-02-20 19:56:29\",\"ftime\":\"2016-02-20 19:56:29\",\"context\":\"快件由苍南(0577-59905999)发往温州分拨中心\"},{\"time\":\"2016-02-20 19:50:09\",\"ftime\":\"2016-02-20 19:50:09\",\"context\":\"快件由苍南(0577-59905999)发往北京(010-53703166转8039或8010)\"},{\"time\":\"2016-02-20 19:50:08\",\"ftime\":\"2016-02-20 19:50:08\",\"context\":\"苍南(0577-59905999)已进行装袋扫描\"},{\"time\":\"2016-02-20 19:46:22\",\"ftime\":\"2016-02-20 19:46:22\",\"context\":\"苍南(0577-59905999)的龙港公司已收件，扫描员是龙港公司\"}]}}";
    if(!notifyParam) {
        logger.error("subscribe ==>  params值为空");
        res.end("error");
    }

    var notifyJson = JSON.parse(notifyParam);
    var status = notifyJson.status;
    if(status === "abort") {
        //重新订阅
        new expressSub().subscribePost(notifyJson, function(rdata){
            res.end("abort");
        });
    } else {
        //记录推送记录
        new expressSub().subscribeRecord(notifyJson, function(rdata){
            var resResult = {
                result:"true",
                returnCode:"200",
                message:"成功"
            }
            res.end(JSON.stringify(resResult));
        });
    }
});

//暴露模块
module.exports = router;
