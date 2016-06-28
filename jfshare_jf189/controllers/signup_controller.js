//引入所需模块
var express = require('express');
var router = express.Router();
var buyerModel = require('../lib/models/buyer');
var commonModel = require('../lib/models/common');
var view_index =  require("../view_center/index/view_index");
var async = require('async');

router.get('/', function(req, res, next) {
    view_index.signup(req, res, next);
});

router.post('/', function(req, res, next) {
    var args = req.body;
    var captchaValue = args["validateCode"] || "";
    var captchaId = args["uuid"] || "";
    var loginName = args["loginname"]||"";
    var email = args["email"]||"";
    var mobile = args["mobile"]||"";
    var password = args["password"]||"";

    var param = {};
    param["captchaId"] = captchaId;
    param["captchaValue"] = captchaValue;
    param["loginName"] = loginName;
    param["email"] = email;
    param["mobile"] = mobile;
    param["pwdEnc"] = password;
    //验证码验证

    //注册处理
    async.waterfall([
        function (callback) {
            new commonModel().validateCaptcha(param, function(rdata){
                if(rdata.result) {
                    callback(null);
                } else {
                    callback({failDesc:"验证码错误!"});
                }
            });
        },
        function(callback) {
            new buyerModel().signup(param, function(rdata) {
                if(rdata.result){
                    callback(null);
                } else {
                    callback({failDesc:rdata.failDesc});
                }
            });
        }
    ], function(err){
        if(err) {
            err["result"] = false;
            res.json(err);
        } else{
            res.json({result:true});
        }
    });
});

//暴露模块
module.exports = router;
