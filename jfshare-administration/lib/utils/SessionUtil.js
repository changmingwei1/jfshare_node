/**
 * Created by jumpkang on 2015/6/19.
 */
var express = require('express')

var CommonUtil = require("./CommonUtil");

var csModel = require('../models/cs');

function SessionUtil(){
    this.key = "jfshare-session$cs*Key#2015";
}

SessionUtil.prototype.getKey = function(){
    return this.key;
}


SessionUtil.prototype.isCookieValid = function(req){
    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::"+JSON.stringify(req.cookies));
    if(req.cookies.msid !== undefined){
        console.log("msid:"+ req.cookies.msid);
        var cookieInfo = CommonUtil.jfxDecryptor(req.cookies.msid, this.getKey());
        if(!cookieInfo) {
            return false;
        }
        req["cs"] = JSON.parse(cookieInfo);
        return true;
    } else {
        return false;
    }
}

SessionUtil.prototype.isOnline = function(req, callback){
    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::"+JSON.stringify(req.cookies));
    if(req.cookies.msid !== undefined){
        console.log("msid:"+ req.cookies.msid);
        var cookieInfo = CommonUtil.jfxDecryptor(req.cookies.msid, this.getKey());
        if(!cookieInfo) {
            return callback(false);
        }
        console.log("cookieInfo:"+ cookieInfo);
        var loginLog = JSON.parse(cookieInfo);
        //调用验证中心
        new csModel().isOnline(loginLog, function(data){
            if(data&&data.result) {
                req["cs"] = {userName:loginLog["userName"], userId:loginLog["userId"], loginName:loginLog["loginName"]}
                return callback(true);

            } else {
                console.log(data.failDesc);
                return callback(false);
            }
        })
    } else {
        return callback(false);
    }
}

SessionUtil.prototype.removeCookie=function(res){
    console.log("清空cookie.......")
    res.setHeader("Set-Cookie", ["msid=; path=/;expires=0"]);
}

module.exports = new SessionUtil();