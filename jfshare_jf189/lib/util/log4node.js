var log4js = require('log4js');
var  configlog4node = {
     /**
     log4js 的配置
     **/
     log4jsConfig :{
        appenders : [
            { type: 'console'}, /*控制台输出*/
            {
                type: 'file', /*文件输出*/
                filename: 'logs/serv.log',
                maxLogSize: 1024,
                backups:3,
                category: 'normal'
            },
            //{
            //    type: 'file', /*文件输出*/
            //    filename: 'logs/serv.log',
            //    maxLogSize: 1024,
            //    backups:3,
            //    category: 'normal'
            //},
            // 定义一个日志记录器
            {
                "type": "dateFile",                 // 日志文件类型，可以使用日期作为文件名的占位符
                "filename": "logs/serv",     // 日志文件名，可以设置相对路径或绝对路径
                "pattern": "_yyyyMMdd.log",  // 占位符，紧跟在filename后面
                "absolute": false,                   // filename是否绝对路径
                "alwaysIncludePattern": true,       // 文件名是否始终包含占位符
                "category": "servLog"               // 记录器名
            },
            {
                "type": "dateFile",                 // 日志文件类型，可以使用日期作为文件名的占位符
                "filename": "logs/http",     // 日志文件名，可以设置相对路径或绝对路径
                "pattern": "_yyyyMMdd.log",  // 占位符，紧跟在filename后面
                "absolute": false,                   // filename是否绝对路径
                "alwaysIncludePattern": true,       // 文件名是否始终包含占位符
                "category": "httpLog"               // 记录器名
            }

        ]
     },
    /**
     ** 使用log4js
     **/
    appLog4js : function(app){
        var config = configlog4node.log4jsConfig;
        log4js.configure(config.log4jsConfig );
        var logger = log4js.getLogger("httpLog");
        logger.setLevel("error");
        var HTTP_LOG_FORMAT_DEV = ':method :remote-addr :url :status :response-time ms';
        app.use(log4js.connectLogger(logger, { level: 'auto', format: HTTP_LOG_FORMAT_DEV }));
    },

    useLog4js : function( config, name) {
        log4js.configure(config.log4jsConfig);
        var logger = null;
        if(name === undefined) {
            logger = log4js.getLogger(config.category);// 'default'
        } else {
            logger = log4js.getLogger(name);
        }
        logger.setLevel(config.level);  //  'INFO'
        /***返回日志**/
        return logger;
    },
    servLog4js : function() {
        var config = configlog4node.log4jsConfig;
        log4js.configure(configlog4node.log4jsConfig);
        var logger = log4js.getLogger("servLog");// 'default'
        logger.setLevel("info");
        /***返回日志**/
        return logger;
    }
};

/***** 将改模块中的功能导出去 *****/
exports.configlog4node = configlog4node;

