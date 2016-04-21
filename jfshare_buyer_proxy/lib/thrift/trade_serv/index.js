
var TradeServ = require("../gen_code/TradeServ.js");

/*****************************固定引用 直接copy***********************************************************/
var thrifgtConfig = require("../../../resource/thrift_config.js");
var lich = require("../Lich.js");
var reservoir = require("../reservoir.js");
/*****************************固定引用 直接copy***********************************************************/


/**
 * 根据应用不同获取配置  名字不要变： Config
 */
var Config = thrifgtConfig.ServiceFactory.trade();
/**
 *根据应用不同获取配置
 * @type {string}
 */
Config.key = lich.ServiceKey.TradeServer;
/**
 * 赋值  所有的都加这个名字  ： thriftService
 * @type {exports|module.exports}
 */
var thriftService = TradeServ;


/*********************************************这里不用动了 直接copy**********************************************************************************************/

(function(){
    var createFn = new reservoir() .createThriftFun(      Config.host,       Config.port,       Config.options, thriftService  );
    var destroyFn = new reservoir().destroyThriftFun();
    var poolConfig =   thrifgtConfig.getPoolConfig(Config.key ,createFn,destroyFn) ;
    var thrift_client = lich.newPooler( poolConfig );
    lich.registerPool(  module.filename ,      Config.key,        thrift_client);
})();

/*********************************************这里不用动了 直接copy**********************************************************************************************/







