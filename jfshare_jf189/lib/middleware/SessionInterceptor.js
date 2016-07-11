/**
 * Created by jumpkang on 2015/6/19.
 */
var express = require('express')
var userModel = require('../models/buyer');
var CommonUtil = require("../util/CommonUtil");
var valid = require('../models/pub/param_valid');
var parseUrl = require('parseurl');
var path = require('path');
var sessionUtil = require('../util/SessionUtil');
var onHeaders = require('on-headers')
var sign = require('cookie-signature')
var zookeeper = require('../util/zookeeper_util');

//log
var logger = require('../util/log4node').configlog4node.servLog4js();

/**
 * Module exports.
 * @public
 */

module.exports = new SessionInterceptor();

var interceptMap = {
    //"c1.neweggimages.com.cn":true,
    login:false,
    logout:false,
    test:false,
    product:false,
    pay:false,
    seller:false,



    order:true,
    nnc:true,
    address:true,
    buyer:true,
    cart:true
}

function SessionInterceptor(){}

SessionInterceptor.prototype.static = function(){
    return function(req, res, next) {
        //静态资源不拦截
        var urlPath = parseUrl(req).path;
        log.debug("==ajaxValid== urlPath:" + urlPath + "===========>");
        var c_path = urlPath.substring(1).split("/", 2)[0];
        if(interceptMap[c_path] !== true) {
            log.debug("---==c_path==--" + c_path);
            res.end();
        }
        next();
    }
}

SessionInterceptor.prototype.ajaxValid = function(){
    return function(req, res, next) {
        //静态资源不拦截
        var urlPath = parseUrl(req).path;
        //log.debug("==ajaxValid== urlPath:" + urlPath + "===========>");
        var c_path = urlPath.substring(1).split("/", 2)[0];
        if(interceptMap[c_path] === undefined) {
            //log.debug("---==c_path==--" + c_path);
            return next()
        }

        if (req.headers["x-requested-with"] !== 'XMLHttpRequest') {
            //log.debug("==ajaxValid==非Ajax请求，不拦截===========>");
            return next()
        }

        if(req.session.loginStatus != true) {
            res.json(res.resData);
            return;
        }
        next();
    }
}

SessionInterceptor.prototype.nomalValid = function(){
    return function(req, res, next) {
        //静态资源不拦截
        var urlPath = parseUrl(req).path;
        //log.debug("==nomalValid== urlPath:" + urlPath + "===========>");
        var c_path = urlPath.substring(1).split("/", 2)[0];
        if(interceptMap[c_path] !== true) {
            //log.debug("---==c_path==--" + c_path);
            return next()
        }

        if (req.headers["x-requested-with"] === 'XMLHttpRequest') {
            //log.debug("==nomalValid==ajax请求，不拦截===========>")
            return next()
        }

        if(req.session.loginStatus != true) {
            var resHtml =  ''
                + '<!DOCTYPE html><html lang="zh-cn"><head><meta charset="utf-8"></head><body>'
                + '<script type="text/javascript" src="/js/jquery/jquery-1.7.2.min.js"></script>'
                + '<script src="/js/common.js"></script>'
                + '<script type="text/javascript" language="JavaScript">'
                + 'logoutTY();'
                + '</script>'
                + '</body></html>';
            res.end(resHtml);
            //res.render("index/loginInfo", res.resData);
            return;
        }
        log.info("loginStatus==>" + req.session.loginStatus)

        next();
    }
}


SessionInterceptor.prototype.cookieDisabled = function(){
    return function(req, res, next) {
        //兼容cookie被禁用了
        if(req.cookies.ssid){
            req.ssid = req.cookies.ssid;
        }else {
            var ssid = req.body.ssid||req.params.ssid||req.query.ssid;
            if(ssid) {
                console.log("!!!!!!!!!!cookie被禁用了");
                req.cookies["ssid"] = ssid;
                req.ssid = ssid;
            }
        }
        next();
    }
}

SessionInterceptor.prototype.buildResData = function(){
    return function(req, res, next) {
        var rData = {}
        rData.ssid = req.ssid;
        console.log("rData.ssid==> "+rData.ssid);
        rData.loginStatus = req.session.loginStatus||false;
        if(req.session.buyer){
            rData.userId = req.session.buyer.userId;
            rData.userName = req.session.buyer.userName;
            rData.sexImg = req.session.buyer.sexImg;
            rData.custLevel = req.session.buyer.custLevel;
        }
        rData.tyHostUrl = zookeeper.getData("ty_host_url");
        res.resData = rData;
        next();
    }
}
//ajax失效处理
function invalidAjax(res){
    log.debug("==ajaxValid==session验证过期，会话失效===========>")
    return res.json({code:2, failDesc:"登录已超时"});
}