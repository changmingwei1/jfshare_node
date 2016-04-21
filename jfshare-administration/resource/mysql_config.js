/*************************************************************************************************************************************
 *
 *
 *
 ******************************* 在最下面增加  不通的 IP即可 不需要修改配置***********************************************************
 *
 *
 *
 * ***********************************************************************************************************************************/

//下面是默认的。如果不设置就用默认的
var  SingleConnectionConfig_IP  =  function(){
                                return "192.168.10.100";
                            };
//下面是默认的。如果不设置就用默认的
var  SingleConnectionConfig_PORT =  function(){
                                return 3306;
                            };

/***
 * 更详细的配置说明：https://www.npmjs.com/package/mysql
 * 基础的链接配置
 * @type {{charset: string, timezone: string, connectTimeout: number, debug: boolean, trace: boolean, dateStrings: boolean}}
 */
var BaseConnectionConfig = {
    charset:"UTF8_GENERAL_CI",                                                                         /*Default: 'UTF8_GENERAL_CI'*/
    timezone:"local",
    connectTimeout:90000,                                                                              /*milliseconds before a timeout occurs during the initial connection to the MySQL server*/
    debug:true,                                                                                         /*Prints protocol details to stdout. (Default: false)*/
    trace:true,                                                                                         /*Generates stack traces on Error*/
    dateStrings:false                                                                                  /**Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather then inflated into JavaScript Date objects. (Default: false)**/
};

/****************************************数据库连接配置************************************************************************************************************************************************************************************************************************/

var   SingleConnectionConfig= function(){
        this.host=SingleConnectionConfig_IP();
        this.port=SingleConnectionConfig_PORT();
        this.user= "trade_test" ;                                                                                        /*The MySQL user to authenticate as.*/
        this.password="P73wfHu4eZhmg89wq";                                                                               /*The password of that MySQL user.*/
        this.database="trade";                                                                                    /*****数据库名字****/
};
SingleConnectionConfig.prototype = BaseConnectionConfig;

/****************************************************************************************************************************************************************************************************************************************************************
 * 简单的数据库连接池，  可以复用以上的连接配置，
 * 整体的理念是，  连接属性是连接属性， 池属性是池属性
 * @type {{acquireTimeout: number, waitForConnections: boolean, connectionLimit: number, queueLimit: number}}
 */

var   SinglePoolConfig  = function(){
    this.acquireTimeout=10000;                                                                                                                   /* The milliseconds before a timeout occurs during the connection acquisition. This is slightly different from connectTimeout, because acquiring a pool connection does not always involve making a connection. (Default: 10000)*/
    this.waitForConnections=true;                                                                                                               /*** Determines the pool's action when no connections are available and the limit has been reached. If true, the pool will queue the connection request and call it when one becomes available. If false, the pool will immediately call back with an error. (Default: true) ***/
    this.connectionLimit= 20;                                                                                                                   /*The maximum number of connections to create at once. (Default: 10)*/
    this.queueLimit= 0;
    this.newPool=function(host,port,user,passwd,datebase){
        var pool = new SinglePoolConfig();
        pool.host = host;
        pool.port = port;
        pool.user = user;
        pool.password = passwd;
        pool.database=datebase;
        return pool;
    }
};
SinglePoolConfig.prototype = new SingleConnectionConfig();


/***********************************************************************************************************************
 *
 *    下面是正式的配置
 *
 * *********************************************************************************************************************/







/************************************************************************************************************************
 *
 *需要增加数据库配置的，需要添加  失败的事件， pool里面 ，on  这个事件以后再完善
 *                  {
 *   起名字                　name:"master",
 *   配置ＩＰ               config:   new SinglePoolConfig().newPool("192.168.10.100",3306,"trade_test","P73wfHu4eZhmg89wq","trade")
 *                   }
 *
 * *********************************************************************************************************************/


/**
 *
 *
 * @type {{canRetry: boolean, removeNodeErrorCount: number, restoreNodeTimeout: number, defaultSelector: string, pools: {on: Function, configs: *[]}}}
 */
var ClusterPoolConfig={
    canRetry:true,                                                                                                      /****   If true, PoolCluster will attempt to reconnect when connection fails. (Default: true)   ****/
    removeNodeErrorCount:20,                                                                                             /****   If connection fails, node's errorCount increases. When errorCount is greater than removeNodeErrorCount, remove a node in the PoolCluster. (Default: 5)  ****/
    restoreNodeTimeout:60000,                                                                                               /**** If connection fails, specifies the number of milliseconds before another connection attempt will be made. If set to 0, then node will bd removed instead and never re-used. (Default: 0) ***/
    defaultSelector:"RR",                                                                                               /**     RR: Select one alternately. (Round-Robin)     RANDOM: Select the node by random function.     ORDER: Select the first node available unconditionally.     **/
    pools:{
        on:function(){},
        configs:[
            {
                name:"master",
                config:   new SinglePoolConfig().newPool("192.168.10.100",3306,"trade_test","P73wfHu4eZhmg89wq","trade")
            },{
                name:"salve1",
                config: new SinglePoolConfig()
            },{
                name:"salve2",
                config: new SinglePoolConfig().newPool("127.0.0.1",3306,"root","4241211","trade")
            },{
                name:"salve3",
                config: new SinglePoolConfig().newPool("192.168.10.57",3306,"root","canada","trade")
            }
        ]
    }
};



/**********************************************************************************************************************
 *     使用的前提是需要把对应的数据库配置参数，在此文件中进行填写
 *     **********************************************************
 *     使用说明 ，再此文件中配置数据库连接
 *     如果配置了简单的连接，那么可以提供创建一个简单数据库连接的参数：getConnectionConfig
 *     如果需要数据库连接池的参数配置：getConnectionPoolConfig
 *     如果需要带有Cluster功能的数据库连接池：getClusterPoolConfig
 * *******************************************************************************************************************/



module.exports ={
    getConnectionConfig:function(){ return new SingleConnectionConfig();  },

    getSimplePoolConfig:function(){ return new SinglePoolConfig();  },

    getClusterPoolConfig:function(){ return ClusterPoolConfig;  }
};