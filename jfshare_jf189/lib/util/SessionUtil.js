/**
 * Created by jumpkang on 2015/6/19.
 */
var express = require('express')
var logger = require('../util/log4node').configlog4node.servLog4js();
var CommonUtil = require("./CommonUtil");

var paramValid = require("../models/pub/param_valid");

var userModel = require('../models/buyer');

function SessionUtil(){
    this.key = "jfshare-session-Key#2015";
}

SessionUtil.prototype.getKey = function(){
    return this.key;
}

SessionUtil.prototype.isLogin = function(req, callback){
    logger.debug(":::::::::::::::::::::::::::::::::::::::::::::::::"+JSON.stringify(req.cookies));
    var ssid = req.cookies.ssid||req.body.ssid||req.query.ssid||req.params.ssid||"";
    if(ssid){
        logger.debug("ssid:"+ req.cookies.ssid);
        var cookieInfo = CommonUtil.jfxDecryptor(req.cookies.ssid, this.key);
        if(!cookieInfo) {
            return callback(false);
        }
        logger.debug("cookieInfo:"+ cookieInfo);
        var loginLog = JSON.parse(cookieInfo);
        //调用验证中心
        new userModel().isOnline(loginLog, function(data){
            if(data.result) {
                req["buyer"] = {userName:loginLog["userName"], userId:loginLog["userId"], loginName:loginLog["loginName"]}
                return callback(true);

            } else {
                logger.debug(JSON.stringify(data));
                return callback(false);
            }
        })
    } else {
        return callback(false);
    }
}

SessionUtil.prototype.getOnlineSession = function(req, callback){
    logger.debug(":::::::::::::::::::::::::::::::::::::::::::::::::"+JSON.stringify(req.cookies));
    var ssid = req.cookies.ssid||req.body.ssid||req.query.ssid||req.params.ssid||"";
    if(ssid){
        var cookieInfo = CommonUtil.jfxDecryptor(ssid, this.key);
        if(!cookieInfo) {
            return callback(false);
        }
        var loginLog = JSON.parse(cookieInfo);
        //调用验证中心
        new userModel().isOnline(loginLog, function(data){
            if(data.result) {
                var buyer = {userName:loginLog["userName"], userId:loginLog["userId"], loginName:loginLog["loginName"], tokenId:loginLog["tokenId"]}
                return callback({result:true, buyer:buyer});

            } else {
                return callback({result:false});
            }
        })
    } else {
        return callback({result:false});
    }
}

SessionUtil.prototype.getOnlineCookies = function(req, callback){
    logger.debug(":::::::::::::::::::::::::::::::::::::::::::::::::"+JSON.stringify(req.cookies));
    var ssid = req.ssid||req.cookies.ssid||req.body.ssid||req.query.ssid||req.params.ssid||"";
    if(ssid){
        logger.debug("getOnlineCookies ==> ssid:"+ ssid);
        var cookieInfo = CommonUtil.jfxDecryptor(ssid, this.key);
        if(!cookieInfo) {
            return callback({result:false});
        }
        logger.debug("getOnlineCookies ==> cookieInfo:"+ cookieInfo);
        var buyer = JSON.parse(cookieInfo);
        return callback({result:true, buyer:buyer});
    } else {
        return callback({result:false});
    }
}

SessionUtil.prototype.removeCookie=function(res){
    logger.debug("清空cookie.......")
    res.setHeader("Set-Cookie", ["ssid=; path=/;expires=0"]);
}

module.exports = new SessionUtil();