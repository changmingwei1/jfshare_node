/**
 * Created by Administrator on 2016/4/28 0028.
 */
var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');

var message_types = require("../thrift/gen_code/message_types");

function Message(){}
//add系统消息
Message.prototype.add = function(params,callback){

   var message = new message_types.SystemMessage({
        title:params.title,
        content:params.content,
        beginDate:params.beginDate,
        endDate:params.endDate,
        pushTarget:params.pushTarget
   });

    Message.prototype.get = function(params,callback){


        var message = new message_types.SystemMessage({
            id:params.id
        });
        logger.info("get message params:" + JSON.stringify(message));
        //获取client
        var messageServ = new Lich.InvokeBag(Lich.ServiceKey.MessageServer,'getSystemMessage',[message]);
        Lich.wicca.invokeClient(messageServ, function(err, data){
            logger.info("get message result:" + JSON.stringify(data));
            var res = {};
            if (err||data[0].result.code == "1") {
                res.code = 500;
                res.desc = data[0].result.failDescList[0].desc;
                callback(res, null);
            } else {
                callback(null, data);
            }
        });
    };
    //获取client
    var messageServ = new Lich.InvokeBag(Lich.ServiceKey.MessageServer,'addSystemMessage',[message]);
    Lich.wicca.invokeClient(messageServ, function(err, data){
        logger.info("add message result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            res.code = 500;
            res.desc = data[0].failDescList[0].desc;
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};



//获取系统消息

//更新系统消息
Message.prototype.update = function(params,callback){


    var message = new message_types.SystemMessage({
        id:params.id,
        title:params.title,
        content:params.content,
        beginDate:params.beginDate,
        endDate:params.endDate,
        pushTarget:params.pushTarget
    });
    logger.info("get message params:" + JSON.stringify(message));
    //获取client
    var messageServ = new Lich.InvokeBag(Lich.ServiceKey.MessageServer,'updateSystemMessage',[message]);
    Lich.wicca.invokeClient(messageServ, function(err, data){
        logger.info("get message result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            res.code = 500;
            res.desc = "更新信息失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//删除系统消息
Message.prototype.del = function(params,callback){

    logger.info("del message params:" + JSON.stringify(params));
    //获取client
    var messageServ = new Lich.InvokeBag(Lich.ServiceKey.MessageServer,'deleteSystemMessage',[params.id]);
    Lich.wicca.invokeClient(messageServ, function(err, data){
        logger.info("get message result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            res.code = 500;
            res.desc = "删除系统信息失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};

//list
Message.prototype.list = function(params,callback){
    var SystemMessage = null;
    if((params.title != undefined )||(params.status != undefined)||(params.pushTarget!= undefined)){
            SystemMessage = new message_types.SystemMessage({
                title:params.title,
                status:params.status,
                pushTarget:params.pushTarget
        });
    }


    logger.info("list message params:" + JSON.stringify(params));
    //获取client
    var messageServ = new Lich.InvokeBag(Lich.ServiceKey.MessageServer,'getSystemMessage',[SystemMessage]);
    Lich.wicca.invokeClient(messageServ, function(err, data){
        logger.info("list messageList result:" + JSON.stringify(data));
        var res = {};
        if (err||data[0].code == "1") {
            res.code = 500;
            res.desc = "获取系统消息列表失败";
            callback(res, null);
        } else {
            callback(null, data);
        }
    });
};
module.exports = new Message();