/**********************************************************************************************************************
 *
 * ******************************仅需添加服务*************************************************
 *
 * ********************************************************************************************************************
 * 关于thrift的配置信息
 * @constructor
 * ********************************************************************************************************************/


  function poolConfig (name,createFn,destroyFn){
    this.name = name;
    this.create = createFn;
    this.destroy = destroyFn;
    this.max = 5;
    this.min =0;
    this.refreshIdle = true; // boolean that specifies whether idle resources at or below the min threshold  should be destroyed/re-created.  optional (default=true)
    this.idleTimeoutMillis = 300000 ;// max milliseconds a resource can go unused before it should be destroyed (default 30000)
    this.reapIntervalMillis =1000;//  frequency to check for idle resources (default 1000),
    this. returnToHead = false;// : boolean, if true the most recently released resources will be the first to be allocated.   This in effect turns the pool's behaviour from a queue into a stack. optional (default false)
    this. priorityRange = 1;// : int between 1 and x - if set, borrowers can specify their   this. relative priority in the queue if no resources are available.    see example.  (default 1)
    this.validate = false;// : function that accepts a pooled resource and returns true if the resource   is OK to use, or false if the object is invalid.  Invalid objects will be destroyed.    This function is called in acquire() before returning a resource from the pool.  Optional.  Default function always returns true.
    this.log =  false;/*  function(str,info){
                     console.log(":::::::str:::::::" + str );
                     console.log(":::::::info:::::::"+ info);
                }; */ // : true/false or function -If a log is a function, it will be called with two parameters:    - log string   - log level ('verbose', 'info', 'warn', 'error')

   // return this;
}
var thrift = require('thrift');
var protocol = thrift.TBinaryProtocol;
var transport =  thrift.TFramedTransport;
var BaseConnectionProp = function() {
    this.transport=transport; //   default: thrift.TBufferedTransport ,  TFramedTransport
    this.protocol=protocol;  //    thrift.TJSONProtocol    TCompactProtocol ,  default: TBinaryProtocol
    this.debug=false;
    this.max_attempts=undefined;//最大尝试次数   Retry connection in " + this.retry_delay + " ms   ，完毕或者没有设置  self.emit("close");
    this.retry_max_delay=undefined;// 多长时间内尝试
    this.connect_timeout=undefined;//连接时间超时
    this.timeout=0;                 //
};


var ThriftConfig = function(ip,port) {
    this.key = null;
    this.host = ip;
    this.port = port;
    this.options = new BaseConnectionProp();
}

ThriftConfig.prototype.getUrl = function() {
    return this.host;
}

ThriftConfig.prototype.getPort = function() {
    return this.port;
}



/*********************************************************************************************************************************************
 * 所有thrift服务的列表配置
 * 提供原始模板、提供传入构造参数
 * @type {{product: ThriftConfig, stock: ThriftConfig}}
 ********************************************************************************************************************************************/

module.exports.getPoolConfig = function(name,createFn,destroyFn){
        return   new poolConfig (name,createFn,destroyFn)
    } ;
module.exports.getThriftConfig  =   function(url,port){
    return new ThriftConfig(url,port);
}


/**********************************************************************************************************************************
 *
 * 所有的都按照下面写，没有的新加
 * @type {{product: Function, stock: Function}}
 *
 **********************************************************************************************************************************/
module.exports.ServiceFactory  =  {
    /**
     * 收货地址服务
     * @returns {ThriftConfig}
     */
    address:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155",1985);
        return obj;
    },
    /**
     * 科目服务
     * @returns {ThriftConfig}
     */
    subject:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155",1982);
        // var obj = new ThriftConfig("127.0.0.1",1982);
        return obj;
    },
    /**
     * 订单服务
     * @returns {ThriftConfig}
     */
    order:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155", 1986);
        return obj;
    },
    /**
     * 买家服务
     * @returns {ThriftConfig}
     */
    buyer:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155", 1990);
        //var obj = new ThriftConfig("127.0.0.1", 1990);
        return obj;
    },
    /**
     * 商品服务
     * @returns {ThriftConfig}
     */
    product: function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155",1980);
        //var obj = new ThriftConfig("127.0.0.1",1980);
        return obj;
    },
    /**
     * 库存服务
     * @returns {ThriftConfig}
     */
    stock:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155",1983);
        return obj;
    },
    /**
     * 省市区服务
     * @returns {ThriftConfig}
     */
    common:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155",1984);
        //var obj = new ThriftConfig("127.0.0.1",1984);
        return obj;
    },
    /**
     * 交易服务
     * @returns {ThriftConfig}
     */
    trade:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155", 1987);
        return obj;
    },
    /**
     * 购物车服务
     * @returns {ThriftConfig}
     */
    cart:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155", 1992);
        return obj;
    },
    /**
     * 卖家服务
     * @returns {ThriftConfig}
     */
    seller:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155", 1991);
        //var obj = new ThriftConfig("127.0.0.1", 1991);
        return obj;
    },
    /**
     * 管理中心服务
     * @returns {ThriftConfig}
     */
    manager:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155", 1993);
        //var obj = new ThriftConfig("127.0.0.1", 1991);
        return obj;
    },
    /**
     * 积分服务
     * @returns {ThriftConfig}
     */
    score:function(){
        //var ip = zookeeper.getData("address_serv_ips");
        //var port = zookeeper.getData("address_port");
        //var obj = new ThriftConfig(ip,port);
        var obj = new ThriftConfig("120.24.153.155", 1994);
        //var obj = new ThriftConfig("127.0.0.1", 1991);
        return obj;
    }
};