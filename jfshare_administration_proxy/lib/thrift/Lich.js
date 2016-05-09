/**********************************************************************************************************************
 *获取链接，通过通用的方法，传递一个结构，ServiceKey通过服务KEY获取服务
 *
 *InvokeBag  调用包，
 *
 **********************************************************************************************************************/
var fs = require('fs');
var thrift = require('thrift');
var co = require('co');
var async = require('async');
var reservoir = require('./reservoir.js');


/**
 * 服务key
 * @type {{ProductSaleService: string, ProductStock: string}}
 */
var ServiceKey = {
	SubjectServer        : "Subject",
    OrderServer: "Order",
    ProductServer : "Product",
  //StockServer :  "Stock",
    CommonServer: "Common",
     UserServer: "Seller",
     BrandServer:"Brand",
     ManagerServer:"Manager",
      MessageServer:"Message",
      AfterSaleServer:"AfterSale"
};

/**
 * 收藏内容
 * @type {{}}
 *   文件的path  服务的key， 服务key对应pool
 *  以上成为一套完整的映射配套注册数据
 */
var   SoulContainer = { };

/**
 *
 * @param filePath
 * @param serviceKey
 * @param pool
 * @constructor
 */
var RegisterSoul=function(filePath,serviceKey,pool){
   var fileKey =  SoulContainer[filePath];
    if(fileKey){
        if(fileKey === serviceKey){
            var pool = SoulContainer[serviceKey];
            if(!pool || pool==null){
                SoulContainer[serviceKey] = pool;
            }else{
                console.log(":::::::::serviceKey:::::::::"+serviceKey+",  pool is not  empty.");
            }
        }else{
            throw new Error("load thrift pool filepath not  equals key; fileKey::::>>>"+ fileKey +" ; path:="+ filePath +" ;serviceKey::>>>"+serviceKey);
        }
    }else{
        SoulContainer[filePath] = serviceKey;
        SoulContainer[serviceKey] = pool;
    }
};

var InvokeBag = function(serviceName,funcName,params){
    this.serviceName = serviceName;
    this.funcName = funcName;
    this.params = params;
    return this;
};


/*
 * thrift_client is now an initialized thrift client that uses connection pooling behind the scenes
 * thrift_client.method(function(err, returned_data){console.log(err, returned_data)});
 */
//TODO  文件加载
function load(){
    var basepath =module.filename.replace("Lich.js","");  ;//"D:\\work_sapce_node\\node-shoots\\reactor\\infrastructure\\thrift\\";
    var files = fs.readdirSync(basepath);//需要用到同步读取

    if(files){
        for(var i =0 ; i < files.length;i++){
            if(files[i].indexOf(".js")>0){
                console.log("file:::::::::::::::::::::::::::::::::>"+files[i])
            }else{
                try{
                    if (files[i] != "gen_code") {
                        console.log("file:::::::::::require::::::::::::::::::::::>"+files[i]);
                        require("./" + files[i] + "/" + "index.js");
                    }
                }catch(e){
                    console.error(e);
                }
            }
        }
    }
};

//  load() ;

module.exports.getpool = getPool;
function getPool(serviceName){
   var clientPool =  SoulContainer[serviceName];
    if(!clientPool || clientPool== null){
        //不存在 加载
        try{
            load();
        }catch(e){
            console.log(e+"::::::::::::::::::::::::::::::::;")
        }
    }else{
        return clientPool;
    }
    clientPool =  SoulContainer[serviceName];
    if(!clientPool || clientPool== null){
        clientPool =  SoulContainer[serviceName];
        if(!clientPool || clientPool== null) {
            throw  Error("thriftContainer have no service name :>>" + serviceName)
        }
    }

    return clientPool;
}


/**
 * 对外开发使用的方法
 * @param InvokeBagS
 */

var coFn = function( InvokeBag , callback  ){



    var  pool    = getPool( InvokeBag .serviceName);
    var funName     = InvokeBag.funcName ;
    var param       = InvokeBag.params    ;
    pool.acquire(function(err, connect) {
        if (err) {
            callback(err,null);
        }  else {

            var callparams =   function(err,data){  pool.release(connect);   callback(err,data);    };
            var list = new Array();
            var paramters = new Array();
            if(param    instanceof Array ){
                for(var i = 0 ; i < param.length;i++ ){
                    paramters.push(param[i]);
                }
            }else{
                paramters.push(param);
            }
            paramters.push(callparams);

            connect.client[funName].apply(connect.client,paramters ) ;



           /* co(function* () {
                var list = new Array();
                var paramters = new Array();
                if(param    instanceof Array ){
                    for(var i = 0 ; i < param.length;i++ ){
                        paramters.push(param[i]);
                    }
                }else{
                    paramters.push(param);
                }
                 console.log(" paramters  "+ JSON.stringify(paramters) );
               //  list.push(Promise.resolve( connect.client[funName].apply(connect.client,paramters )  ) );
                for(var i in connect.client) console.log("i::::::::::::::="+i)
                var res = yield Promise.resolve( connect.client[funName].apply(connect.client,paramters )  );
                return res;
            }).then(function(v){
                pool.release(connect);
                if(callback){
                    callback(null,v);
                }
                return v;
            }).catch(function(err){
                pool.release(connect);
                if(callback){
                    callback(err,null);
                }
            });*/
        }
    });

}


/**
 * 共外界调用
 */
var wicca = function (){
    /**
     * 对外开放调用方法
     * @param InvokeBagS
     * @param callbackFn
     */
    this.invokeClient = function( InvokeBagS  ,callbackFn ){
        var  invos = new Array();
        if(  InvokeBagS    instanceof Array    ){
            for(var i =0 ; i < InvokeBagS.length;i++ ){
                invos.push(InvokeBagS[i]);
            }
        }else{
            invos.push(InvokeBagS);
        }
        var Vco = {
            call_: function(InvokeBag, callbackFn){
                coFn(InvokeBag   ,callbackFn);
            }
        };
       //顺序执行
        async.map(invos  , Vco.call_.bind(Vco), function(err, result){
            //返回内容
            callbackFn( err, result   );
        });
    };
}


/**
 * 构造client
 * @param servce
 * @param options
 * @returns {*}
 */
module.exports.newPooler = function (poolconfig){
    var thrift_client =  new reservoir().getReservoir(poolconfig) ;
    return thrift_client;
};

/**
 * 提供将连接池的注册
 * @type {Function}
 */
module.exports.registerPool = RegisterSoul ;


/**
 * 所有的服务都在这里注册一个key
 * @type {{ProductSaleService: string, ProductStock: string}}
 */
module.exports.ServiceKey = ServiceKey;


/**
 * 对外开发的接口调用方法
 * @type {wicca}
 */
module.exports.wicca = new wicca();

/**
 * 提供外部构成早调用结构
 * @type {Function}
 */
module.exports. InvokeBag = InvokeBag;

module.exports.soul = SoulContainer;
/**
 * 清除
 */
module.exports.clean = function(){
    for(var i in  SoulContainer){
        try{
                SoulContainer[i].drain(function() {
                    SoulContainer[i].destroyAllNow();
                });
        }catch(e){
            console.log(e);
        }
    }
};