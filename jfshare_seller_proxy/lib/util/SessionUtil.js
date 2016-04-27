/**
 * Created by jumpkang on 2015/6/19.
 */
var express = require('express')

var CommonUtil = require("./CommonUtil");

var userModel = require('../models/seller');

function SessionUtil(){
    this.key = "jfshare-session-Key#2015";
}

SessionUtil.prototype.getKey = function(){
    return this.key;
}

SessionUtil.prototype.isLogin = function(req, callback){
    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::"+JSON.stringify(req.cookies));
    if(req.cookies && req.cookies.ssid){
        console.log("ssid:"+ req.cookies.ssid);
        var cookieInfo = CommonUtil.jfxDecryptor(req.cookies.ssid, this.key);
        if(!cookieInfo) {
            return callback(false);
        }
        console.log("cookieInfo:"+ cookieInfo);
        var loginLog = JSON.parse(cookieInfo);
        //调用验证中心
        new userModel().isOnline(loginLog, function(data){
            if(data.result) {
                req["buyer"] = {userName:loginLog["userName"], userId:loginLog["userId"], loginName:loginLog["loginName"]}
                return callback(true);

            } else {
                console.log(JSON.stringify(data));
                return callback(false);
            }
        })
    } else {
        return callback(false);
    }
}

SessionUtil.prototype.getOnlineCookies = function(req, callback){
    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::"+JSON.stringify(req.cookies));
    if(req.cookies && req.cookies.ssid){
        console.log("ssid:"+ req.cookies.key);
        var cookieInfo = CommonUtil.jfxDecryptor(req.cookies.ssid, this.key);
        if(!cookieInfo) {
            return callback({result:false});
        }
        console.log("cookieInfo:"+ cookieInfo);
        var buyer = JSON.parse(cookieInfo);
        return callback({result:true, buyer:buyer});
    } else {
        return callback({result:false});
    }
}

SessionUtil.prototype.removeCookie=function(res){
    console.log("清空cookie.......")
    res.setHeader("Set-Cookie", ["ssid=; path=/;expires=0"]);
}

module.exports = new SessionUtil();