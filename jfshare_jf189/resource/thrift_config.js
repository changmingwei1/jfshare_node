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

var zookeeper = require('./zookeeper_util');
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
        //var obj = new ThriftConfig("10.24.190.240",1985);
        var obj = new ThriftConfig("101.201.38.182",1985);
        //var obj = new ThriftConfig(zookeeper.getData("address_serv_ips"),zookeeper.getData("address_port"));
        return obj;
    },
    /**
     * 科目服务
     * @returns {ThriftConfig}
     */
    subject:function(){
        //var obj = new ThriftConfig("10.24.190.240",1982);
        var obj = new ThriftConfig("101.201.38.182",1982);
        //var obj = new ThriftConfig(zookeeper.getData("subject_serv_ips"),zookeeper.getData("subject_port"));
        // var obj = new ThriftConfig("127.0.0.1",1982);
        return obj;
    },
    /**
     * 订单服务
     * @returns {ThriftConfig}
     */
    order:function(){
        //var obj = new ThriftConfig("10.24.190.240", 1986);
        var obj = new ThriftConfig("101.201.38.182", 1986);
        //var obj =  new ThriftConfig(zookeeper.getData("order_serv_ips"),zookeeper.getData("order_port"));
        //var obj = new ThriftConfig("127.0.0.1", 1986);
        return obj;
    },
    /**
     * 买家服务
     * @returns {ThriftConfig}
     */
    buyer:function(){
        //var obj = new ThriftConfig("10.24.190.240", 1990);
        var obj = new ThriftConfig("101.201.38.182", 1990);
        //var obj = new ThriftConfig(zookeeper.getData("buyer_ips"),zookeeper.getData("buyer_port"));
        //var obj = new ThriftConfig("127.0.0.1", 1990);
        return obj;
    },
    /**
     * 商品服务
     * @returns {ThriftConfig}
     */
    product: function(){
        //var obj = new ThriftConfig("10.24.190.240",1980);
        var obj = new ThriftConfig("101.201.38.182",1980);
        //var obj = new ThriftConfig(zookeeper.getData("product_serv_ips"),zookeeper.getData("product_port"));
        //var obj = new ThriftConfig("127.0.0.1",1980);
        return obj;
    },
    /**
     * 库存服务
     * @returns {ThriftConfig}
     */
    stock:function(){
        //var obj = new ThriftConfig("10.24.190.240",1983);
        var obj = new ThriftConfig("101.201.38.182",1983);
        //var obj = new ThriftConfig(zookeeper.getData("stock_serv_ips"),zookeeper.getData("stock_port"));
        return obj;
    },
    /**
     * 省市区服务
     * @returns {ThriftConfig}
     */
    common:function(){
        //var obj = new ThriftConfig("100.98.222.99",1984);
        var obj = new ThriftConfig("101.201.38.182",1984);
        //var obj = new ThriftConfig(zookeeper.getData("common_serv_ips"),zookeeper.getData("common_port"));
        //var obj = new ThriftConfig("127.0.0.1",1984);
        return obj;
    },
    /**
     * 交易服务
     * @returns {ThriftConfig}
     */
    trade:function(){
        //var obj = new ThriftConfig("10.24.190.240", 1987);
        var obj   = new ThriftConfig("101.201.38.182", 1987);
        //var obj  = new ThriftConfig(zookeeper.getData("trade_serv_ips"),zookeeper.getData("trade_port"));
        //var obj = new ThriftConfig("127.0.0.1", 1987);
        return obj;
    },
    /**
     * 购物车服务
     * @returns {ThriftConfig}
     */
    cart:function(){
        //var obj = new ThriftConfig("10.24.190.240", 1992);
        var obj = new ThriftConfig("101.201.38.182", 1992);
        //var obj = new ThriftConfig(zookeeper.getData("cart_serv_ips"),zookeeper.getData("cart_port"));
        return obj;
    },
    /**
     * 卖家服务
     * @returns {ThriftConfig}
     */
    seller:function(){
        //var obj = new ThriftConfig("10.24.190.240", 1991);
        var obj = new ThriftConfig("101.201.38.182", 1991);
        //var obj = new ThriftConfig(zookeeper.getData("seller_serv_ips"),zookeeper.getData("seller_port"));
        //var obj = new ThriftConfig("127.0.0.1", 1991);
        return obj;
    },
    /**
     * 物流快递服务
     * @returns {ThriftConfig}
     */
    express:function(){
        //var obj = new ThriftConfig("10.24.190.240", 1989);
        var obj = new ThriftConfig("101.201.38.182", 1989);
        //var obj = new ThriftConfig(zookeeper.getData("express_serv_ips"),zookeeper.getData("express_port"));
        //var obj = new ThriftConfig("127.0.0.1", 1989);
        return obj;
    },
    /**
     * 支付服务
     * @returns {ThriftConfig}
     */
    pay:function(){
        //var obj = new ThriftConfig("10.24.190.240", 1993);
        var obj = new ThriftConfig("101.201.38.182", 1993);
        //var obj = new ThriftConfig(zookeeper.getData("pay_serv_ips"),zookeeper.getData("pay_port"));
        return obj;
    },

    /**
     * 运费模板&仓库模板维护服务
     * @returns {ThriftConfig}
     */
    baseTemplate:function(){
    //var obj = new ThriftConfig("10.24.190.240", 2004);
    var obj = new ThriftConfig("101.201.38.182", 2004);
    //var obj = new ThriftConfig(zookeeper.getData("template_serv_ips"),zookeeper.getData("template_serv_port"));
    return obj;
}
};