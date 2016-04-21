
//var SubjectServ = require("../gen_code/SubjectServ.js");
var FileNameMappedServ = require("../gen_code/FileNameMappedServ.js");

/*****************************�̶����� ֱ��copy***********************************************************/
var thrifgtConfig = require("../../../resource/thrift_config.js");
var lich = require("../Lich.js");
var reservoir = require("../reservoir.js");
/*****************************�̶����� ֱ��copy***********************************************************/


/**
 * ����Ӧ�ò�ͬ��ȡ����  ���ֲ�Ҫ�䣺 Config
 */
var Config = thrifgtConfig.ServiceFactory.fileNameMapped_serv();
/**
 *����Ӧ�ò�ͬ��ȡ����
 * @type {string}
 */
Config.key = lich.ServiceKey.FileNameMappedServer;
/**
 * ��ֵ  ���еĶ����������  �� thriftService
 * @type {exports|module.exports}
 */
var thriftService = FileNameMappedServ;


/*********************************************���ﲻ�ö��� ֱ��copy**********************************************************************************************/

(function(){
    var createFn = new reservoir() .createThriftFun(      Config.host,       Config.port,       Config.options, thriftService  );
    var destroyFn = new reservoir().destroyThriftFun();
    var poolConfig =   thrifgtConfig.getPoolConfig(Config.key ,createFn,destroyFn) ;
    var thrift_client = lich.newPooler( poolConfig );
    lich.registerPool(  module.filename ,      Config.key,        thrift_client);
})();

/*********************************************���ﲻ�ö��� ֱ��copy**********************************************************************************************/







