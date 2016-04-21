/**
 * Created by Thinkpad on 2015/5/22.
 */


/**
 * 文档配置地址
 * https://www.npmjs.com/package/redis
 */
function  RedisOptions () {
    var parser                   = "hiredis";
    var return_buffers          = false;
    var detect_buffers          = false;
    var socket_nodelay          = true;
    var socket_keepalive        = true;
    var no_ready_check          =  false;
    var enable_offline_queue   = true;
    var retry_max_delay         = null;
    var connect_timeout         = null;
    var max_attempts             = null;
    var auth_pass                = null;
    var family                    = "IPv4"
};


/**
 * 基本的配置
 */
var  BaseRedisConfig = {
      host:null ,
      port: null ,
      pass:null,
      type:"RW"
};

function ProductConfig(host,port,pass,type){
    this.host = host;
    this.port = port;
    if(pass && pass!=null ){
        this.pass = pass;
    }
    if(type && type!=null ){
        this.type = type;
    }
}


/**  promotion需要使用的redis配置 */
function PromotionConfig(host,port,pass,type){
    this.host = host;
    this.port = port;
    if(pass && pass!=null ){
        this.pass = pass;
    }
    if(type && type!=null ){
        this.type = type;
    }
}

ProductConfig.prototype = BaseRedisConfig;

/************************************************************************************************************************/
//用这个出问题： exports = new s();
module.exports = {
    ProductConfig : function(){
        var obj = new ProductConfig("192.168.10.66",6380,"redis23");
        return obj;
    },
    PromotionConfig : function(){
        var promotionRedisObj = new PromotionConfig("192.168.10.66",6380,"redis23");
        return promotionRedisObj
    },

    Options : new RedisOptions(),

    SessionRedis:function(){
                           return {
                                servers: [
                                    {
                                        host: '192.168.10.57',
                                        port: 6381,
                                        client: null,
                                        socket: null,
                                        ttl: 1000,
                                        disableTTL: false,
                                        prefix: 'shoots-session:',
                                        access: 'RW'
                                    },
                                    {
                                        host: '192.168.10.57',
                                        port: 6381,
                                        client: null,
                                        socket: null,
                                        ttl: 1000,
                                        disableTTL: false,
                                        prefix: 'shoots-session:',
                                        access: 'R'
                                    }
                                ],
                                    balance: 'random'
                            }
                     }


};
