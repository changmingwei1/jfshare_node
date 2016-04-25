/**
 * Created by Lenovo on 2015/7/20.
 */

var poolModule = require('generic-pool');
var thrift = require('thrift');
var async = require('async');
var co = require('co');

/**
 * 提供创建方法
 */
var createReservoir = function (     ){

    /**
     * 构造一个连接池
     * @param poolConfig
     * @returns {Object}
     */
    this.getReservoir = function(poolConfig){


        poolConfig.validate = this.validateThriftFun;
        var pool = poolModule.Pool( poolConfig );
        return pool;
    }

    /**
     * 销毁调用的毁掉方法
     * @returns {Function}
     */
    this.destroyThriftFun = function(){
        return   function(connection) { connection.end(); };
    }


    /**
     * 构造创建方法  提供generalpool
     * @param host
     * @param port
     * @param options
     * @param service
     * @returns {Function}
     */
    this.createThriftFun =  function (host,port,options,service ){

     return   function(callback) {
            var connection = thrift.createConnection(host, port, options);
            connection.on("error", function(err) {
                console.log("EVENT:::::::error");
                connection.end();
            });
            connection.on("close", function(err) {
                connection.end();
                console.log("EVENT:::::::close");
            });
            connection.on("timeout", function() {
                connection.end();
            });
            connection.on("data", function() {
                console.log('EVENT:::::::data');
            });

            var client_ = thrift.createClient( (service  ), connection);
            var   client =  connection.client;
            callback(null, connection);
        };
    };


    /**
     * 验证链接
     * @param connection
     * @returns {boolean}
     */
    this.validateThriftFun =   function(connection) {

        return !connection.__ended;
    }

    /**
     * 获取ssl thrift 连接
     * @param host
     * @param port
     * @param options
     * @param service
     * @returns {Function}
     */
    this.createSSLThriftFun =  function (host,port,options,service ){

        return   function(callback) {
            var fs = require('fs');
            var path = require('path');
            options.key = fs.readFileSync( path.resolve('resource/cafile/client.key/'));
            options.cert = fs.readFileSync( path.resolve('resource/cafile/client.crt/'));
            options.ca = [ fs.readFileSync( path.resolve('resource/cafile/ca.crt/')) ];

            options.rejectUnauthorized = false;
            var connection = thrift.createSSLConnection(host, port, options);
            connection.on("error", function(err) {
                console.log("EVENT:::::::error");
                connection.end();
            });
            connection.on("close", function(err) {
                connection.end();
                console.log("EVENT:::::::close");
            });
            connection.on("timeout", function() {
                connection.end();
            });
            connection.on("data", function() {
                console.log('EVENT:::::::data');
            });

            var client_ = thrift.createClient( (service  ), connection);
            var   client =  connection.client;
            callback(null, connection);
        };
    };

}

module.exports = createReservoir;