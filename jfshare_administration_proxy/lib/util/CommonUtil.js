/**
 * Created by jumpkang on 2015/6/19.
 */
var express = require('express');
var crypto = require('crypto');
var urlencode = require('urlencode')
var cookie = require('cookie');

function CommonUtil(){}

CommonUtil.prototype.getIP = function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

CommonUtil.prototype.jfxCryptor = function(data, key) {
    var plaintext = JSON.stringify(data);
    var cryped = '';
    var cipher = crypto.createCipher('blowfish', key);
    cryped += cipher.update(plaintext, 'utf8', 'hex');
    cryped += cipher.final('hex');

    return cryped;
}

CommonUtil.prototype.jfxDecryptor = function(data, key) {
    var decryped = '';
    try{
        var decipher  = crypto.createDecipher('blowfish', key);
        decryped += decipher.update(data, 'hex', 'utf8');
        decryped += decipher.final('utf8');
    } catch(e){
        console.log("解密失败......" + e);
        return null;
    }
    return decryped;
}

CommonUtil.prototype.DesDecryptTY = function(text) {
    try{
        var urlDecodeRe = urlencode.decode(text, 'gbk');
        var plaintext = new Buffer(urlDecodeRe,'base64').toString('binary');
        //var plaintext = urlDecodeRe;
        var param = {};
        param["key"] = "TICKET02";
        param["iv"] = "TICKET02";
        param["alg"] = "des-cbc";
        param["autoPad"] = true;
        param["plaintext"] = plaintext;

        var decryptStr = desDecrypt(param);
        var base64Re = new Buffer(decryptStr, 'base64').toString();
        return urlencode.decode(base64Re, 'gbk');
    } catch(e){
        console.log("解密失败......" + e);
    }
}

function desDecrypt(param) {
    var key = new Buffer(param.key);
    var iv = new Buffer(param.iv);
    var plaintext = param.plaintext;
    var alg = param.alg;
    var autoPad = param.autoPad;

    var decipher = crypto.createDecipheriv(alg, key, iv);
    //decipher.setAutoPadding(autoPad)
    var txt = decipher.update(plaintext, 'binary', 'utf8');
    txt += decipher.final('utf8');

    return txt;
}

function desCrypt(param) {
    var key = new Buffer(param.key);
    var iv = new Buffer(param.iv);
    var plaintext = param.plaintext;
    var alg = param.alg;
    var autoPad = param.autoPad;

    var cipher = crypto.createCipheriv(alg, key, iv);
    cipher.setAutoPadding(autoPad);  //default true
    var ciph = cipher.update(plaintext, 'utf8', 'hex');
    ciph += cipher.final('hex');
    return ciph
}

CommonUtil.prototype.md5 = function(data) {
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    return crypto.createHash("md5").update(str).digest("hex");
}

/**
 * Add session cookie to response
 *
 * @param {Object} request - http request object
 * @param {Object} response - http response object
 * @param {String} name - cookie name
 * @param {*} val - cookie value
 * @param {*} options
 * @private
 */
CommonUtil.prototype.setCookie = function (request, response, name, val, options) {
    // only send secure cookies via https
    //if (!(options.secure && !this.__isSecure(request))) {
    //    var secret = this.__config.secret;
    //    var signed = options.signed;
    //
    //    if (signed && !secret) {
    //        throw new Error('An encryption key is required for signed cookies');
    //    }

    if ('number' == typeof val) {
        val = val.toString();
    }

    if ('object' == typeof val) {
        val = JSON.stringify(val);
    }

    //if (signed) {
    //    val = 's:' + signature.sign(val, secret);
    //}

    if ('maxAge' in options) {
        options.expires = new Date(Date.now() + options.maxAge);
        options.maxAge /= 1000;
    }

    if (null == options.path) {
        options.path = '/';
    }

    var headerVal = cookie.serialize(name, String(val), options);

    // supports multiple 'setCookie' calls by getting previous value
    var prev = response.getHeader('set-cookie') || [];
    var header = Array.isArray(prev) ? prev.concat(headerVal)
        : Array.isArray(headerVal) ? [prev].concat(headerVal)
        : [prev, headerVal];

    response.setHeader('set-cookie', header);
    //}
};

module.exports = new CommonUtil();