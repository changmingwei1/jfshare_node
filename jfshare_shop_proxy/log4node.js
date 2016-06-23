var express = require('express');
var app = express();
var  configlog4node = {
    /**
     log4js 的配置
     **/
    log4jsConfig:{
        appenders: [
            { type: 'console' }, /*控制台输出*/
            {
                type: 'dateFile',
                filename: 'logs/log',
                pattern: "_yyyy-MM-dd",
                maxLogSize: 1024,
                alwaysIncludePattern: false,
                backups: 4,
                category: 'logger'
            }
        ],
        replaceConsole: true
    },
    /** log4Node中权限的记录日志*/
    rbacjsConfig:{
        appenders:[
            {
                type: 'dateFile',
                filename: '.2/logs/log',
                pattern: "_yyyy-MM-dd",
                maxLogSize: 1024,
                alwaysIncludePattern: false,
                backups: 4,
                category: 'logger'

            }
        ]
    },
    /**
     ** 使用log4js
     **/
    appLog4js : function(app,config){
        var log4js =   require('log4js');
        log4js.configure(config.log4jsConfig );
        var logger = log4js.getLogger(config.category );// 'normal'
        logger.setLevel(  config.level  );  //  'INFO'
        app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
        /***返回日志**/
        return logger;
    },

    useLog4js : function(category) {
        var log4js = require('log4js');
        var logger = log4js.getLogger('normal');// 'normal'
        logger.setLevel('warn');  //  'INFO'
        app.use(log4js.connectLogger(logger, {level:log4js.levels.WARN}));
        return logger;
    },

    useLog4rbac : function(config){
        var log4js = require('log4js');
        log4js.configure(config.rbacjsConfig);
        var logger = log4js.getLogger(config.category);// 'normal'
        logger.setLevel(config.level);  //  'INFO'
        /***返回日志**/
        return logger;
    }

};

/***** 将改模块中的功能导出去 *****/
exports.configlog4node = configlog4node;


