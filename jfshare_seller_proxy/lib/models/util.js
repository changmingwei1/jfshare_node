/**
 * Created by zhaoshenghai on 16/3/29.
 */

var https = require('https');
var request = require('request');
var urlencode = require('urlencode');

function Util(){}

Util.prototype.getOpenApi = function(param, callback){

    var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx8431024cc21de418" +
        "&secret=b044300c91957f9c8c403ffa377e603d" +
        "&code=" + param.code +
        "&grant_type=authorization_code";

    request(url, function(err, res, body){
        if(!err && res.statusCode == 200){
            callback(200, body);
        } else {
            callback(500, null);
        }
    });
};

Util.prototype.getCode = function(param, callback){
    redirect = urlencode.encode('http://h5.jfshare.com/', 'utf8');

    var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8431024cc21de418&redirect_uri="+ redirect +"&response_type=code&scope=snsapi_base&state=zsh0103#wechat_redirect";

    console.log("url:" + url);

    request(url, function(err, res, body){
        console.log("response:" + JSON.stringify(body));
        console.log("res: " + JSON.stringify(res));
        if(!err && res.statusCode == 200){
            callback(200, body);
        } else {
            callback(500, null);
        }
    });
};

//Util.prototype.getOpenApi = function(param, callback) {
//    var options = {
//        hostname: 'encrypted.google.com',
//        port: 443,
//        path: '/',
//        method: 'GET'
//    };
//
//    var req = https.request(options, function(res) {
//        console.log('statusCode: ', res.statusCode);
//        console.log('headers: ', res.headers);
//
//        res.on('data', function(d) {
//            //process.stdout.write(d);
//            callback(200, d);
//        });
//    });
//    req.end();
//
//    req.on('error', function(e) {
//        callback(500, null);
//    });
//};


//数组求和函数
Util.prototype.sum = function(){
    var sum = 0;
    for(var i = 0;i<this.length;i++)
    {
        sum += Number(this[i]);
    }
    return sum;
}

module.exports = new Util();