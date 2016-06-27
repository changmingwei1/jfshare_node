var express = require('express');
var router = express.Router();
var sessionUtil = require('../lib/util/SessionUtil');
var buyerModel = require('../lib/models/buyer');

router.get('/', function(req, res, next) {
    console.log("+++++++++++++++++++++session用户主动注销++++++++++++++++++++++++++++++++++++++++++++++++++++++");


    sessionUtil.getOnlineSession(req, function(data){
        if(data.result) {
            //sessionUtil.removeCookie(res);
            new buyerModel().logout(data.buyer, function(rdata){
                if(rdata.result) {
                    res.json({result:"注销成功"});
                } else {
                    res.json({result:"注销失败"});
                }
            });
        } else {
            res.json({result:"之前已失效"});
        }
    });
});

module.exports = router;
