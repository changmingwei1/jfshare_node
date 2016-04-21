/**
 * Created by jumpkang on 2015/6/19.
 */
var express = require('express');
var cs = require('../models/cs');
var CommonUtil = require("../utils/CommonUtil");
var async = require('async');
var valid = require('../utils/param_valid');
var parseUrl = require('parseurl');
var path = require('path');
var sessionUtil = require('../utils/SessionUtil');

//log
var log4node = require('../../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

/**
 * Module exports.
 * @public
 */

module.exports = new SessionInterceptor();

function SessionInterceptor(){
    var ignoreMap = {
        img:"image",
        png:"json",
    }
}

SessionInterceptor.prototype.ajaxValid = function(){
    return function(req, res, next) {
        var originalUrl = parseUrl.original(req);
        var urlPath = parseUrl(req).path;
        var extname = path.extname(urlPath);
        log.debug("==ajaxValid== urlPath:" + urlPath + "===========>");
        //静态资源不拦截
        if (extname && extname.length > 0) {
            log.debug("---==path==--" + extname);
            log.debug("==ajaxValid==静态资源请求，不拦截 extname:" + extname + "===========>");
            return next()
        }

        if (req.headers["x-requested-with"] !== 'XMLHttpRequest') {
            log.debug("==ajaxValid==非Ajax请求，不拦截===========>");
            return next()
        }

        var isSessionValid = req.cookies && !valid.empty(req.cookies.msid);
        var cookieInfo = null;

        if (!isSessionValid) {
            log.debug("==ajaxValid==msid信息为空===========>")
            return invalidAjax(res);
        }

        cookieInfo = CommonUtil.jfxDecryptor(req.cookies.msid, sessionUtil.getKey());
        if (cookieInfo == null) {
            log.debug("==ajaxValid==msid不合法===========>")
            return invalidAjax(res);
        }

        var loginLog = JSON.parse(cookieInfo);

        //调用验证中心
        new cs().isOnline(loginLog, function (data) {
            log.debug(JSON.stringify(data));
            if (data && data.result) {
                req["cs"] = {userName: loginLog["userName"], userId: loginLog["userId"], loginName:loginLog["loginName"]}
                log.info("==ajaxValid==session验证通过，会话有效===========>")
                next();
            } else {
                log.debug(data.failDesc);
                return invalidAjax(res);
            }
        });
    }
}

SessionInterceptor.prototype.nomalValid = function(){
    return function(req, res, next) {
        var originalUrl = parseUrl.original(req);
        var urlPath = parseUrl(req).path;
        var extname = path.extname(urlPath);
        log.debug("==nomalValid== urlPath:" + urlPath + "===========>");
        //静态资源不拦截
        if (extname && extname.length > 0) {
            log.debug("---==path==--" + extname);
            log.debug("==nomalValid==静态资源请求，不拦截 extname:" + extname + "===========>");
            return next()
        }

        if (req.headers["x-requested-with"] === 'XMLHttpRequest') {
            log.debug("==nomalValid==ajax请求，不拦截===========>")
            return next()
        }

        var isSessionValid = req.cookies && !valid.empty(req.cookies.msid);
        var cookieInfo = null;

        if (!isSessionValid) {
            log.debug("==nomalValid==msid信息为空===========>")
            return invalidNomal(res);
        }

        cookieInfo = CommonUtil.jfxDecryptor(req.cookies.msid, sessionUtil.getKey());
        if (cookieInfo == null) {
            log.debug("==nomalValid==msid不合法===========>")
            return invalidNomal(res);
        }

        var loginLog = JSON.parse(cookieInfo);

        //调用验证中心
        new cs().isOnline(loginLog, function (data) {
            if (data && data.result) {
                log.info("==nomalValid==session验证通过，会话有效===========>")
                req["cs"] = {userName: loginLog["userName"], userId: loginLog["userId"], loginName:loginLog["loginName"]}
                next();
            } else {
                log.debug(data.failDesc);
                return invalidNomal(res);
            }
        });
    }
}
//ajax失效处理
function invalidAjax(res){
    log.debug("==ajaxValid==session验证过期，会话失效===========>")
    return res.json({code:2, failDesc:"登录已超时"});
}

//普通请求失效处理
function invalidNomal(res){
    var action = "/signin";
    log.info("==nomalValid==session验证过期，会话失效===========>")
    return res.redirect(action);
}