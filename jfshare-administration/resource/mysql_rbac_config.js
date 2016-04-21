/****************************************************************************************************************************************************************************************************************************************************************/
//下面是默认的。如果不设置就用默认的
var  SingleConnectionConfig_IP  =  function(){
    return "192.168.10.57";
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
        this.user= "root" ;                                                                                        /*The MySQL user to authenticate as.*/
        this.password="canada";                                                                               /*The password of that MySQL user.*/
        this.database="rbac";                                                                                    /*****数据库名字****/
};
SingleConnectionConfig.prototype = BaseConnectionConfig;

/**********************************************************************************************************************
 *     使用的前提是需要把对应的数据库配置参数，在此文件中进行填写
 *     **********************************************************
 *     使用说明 ，再此文件中配置数据库连接
 *     如果配置了简单的连接，那么可以提供创建一个简单数据库连接的参数：getConnectionConfig
 *     如果需要数据库连接池的参数配置：getConnectionPoolConfig
 *     如果需要带有Cluster功能的数据库连接池：getClusterPoolConfig
 * *******************************************************************************************************************/
module.exports ={
    getConnectionConfig:function(){ return new SingleConnectionConfig();  }
};