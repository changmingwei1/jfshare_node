var express = require('express');
var router = express.Router();
var CommonUtil = require('../lib/utils/CommonUtil');
var csModel = require('../lib/models/cs');
var view_index = require('../view_center/index/view_index');
var sessionUtil = require('../lib/utils/SessionUtil');

router.get('/', function(req, res, next) {

    sessionUtil.isOnline(req, function(rCheck){
        if(rCheck){
            console.log("+++++++++++++++++++++session信息有效++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            res.redirect("/product");
        }else{
            console.log("+++++++++++++++++++++session信息不存在或已失效++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            view_index.signin(req, res, next, null);
        }
    });

});

router.post('/isOnline', function(req, res, next) {
    if(sessionUtil.isCookieValid(req)) {
        console.log("+++++++++++++++++++++session信息有效++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        res.json({result:true, cs:req.cs});
    }else{
        console.log("+++++++++++++++++++++session信息不存在或已失效++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        res.json({result:false});
    }
});


router.post('/', function(req, res, next) {

    var args = req.body;
    var loginName = args["loginName"] || "";
    var password = args["password"] || "";
    var param = {};

    param["loginName"] = loginName;
    param["pwdEnc"] = password;
    param["ip"] = CommonUtil.getIP(req);

    console.log(JSON.stringify(param));

    new csModel().signin(param, function(rdata){
        if(rdata.result) {
            var loginLog = rdata["loginLog"];
            var cs = rdata["cs"];
            var cookieInfo ={
                tokenId:loginLog["tokenId"],
                userId:cs["csId"],
                loginName:cs["loginName"],
                userName:cs["csName"]
            }
            var msid = CommonUtil.jfxCryptor(cookieInfo, sessionUtil.getKey());
            //res.setHeader("Set-Cookie", ["msid="+msid+";path=/;expires=0"]);
            var options = {
                path: "/",
                domain: null,
                secure: false,
                httpOnly: true,
                expires:0
            };
            CommonUtil.setCookie(req, res, "msid", msid, options);

            return res.json({result:true});

        } else {
            res.json({failDesc:rdata["failDesc"]});
        }
    });
});



module.exports = router;
