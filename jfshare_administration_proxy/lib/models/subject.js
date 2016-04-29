/**
 * Created by huapengpeng on 2016/4/22.
 */
/**
 * Created by zhaoshenghai on 16/3/20.
 */

var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');


var subject_types  = require("../thrift/gen_code/subject_types");



function Subject(){}


Subject.prototype.add = function(params, callback){

    var storehouse = new storehouse_types.Storehouse({
        sellerId:params.sellerId,
        name:params.name,
        supportProvince:params.supportProvince
    });

    logger.info("addStorehouse:" + JSON.stringify(storehouse));

    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.StorehouseServer, "addStorehouse",storehouse);

    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-addStorehouse result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("addressServ-addAddressʧ��  ʧ��ԭ�� ======" + err);

            var result = {};
            result.code = 500;
            result.desc = "��Ӳֿ�ʧ�ܣ�";

            logger.error("storehouseServ-addStorehouseʧ��  ʧ��ԭ�� ======" + err);

            callback(result, null);

        }
        callback(data);
    });
};


//���²ֿ�
Subject.prototype.update = function(params, callback){

    var storehouse = new storehouse_types.Storehouse({
        sellerId:params.sellerId,
        id:params.id,
        name:params.name,
        supportProvince:params.supportProvince
    });



    logger.info("updateStorehouse:" + JSON.stringify(storehouse));
    // ��ȡclient
    var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.StorehouseServer, "updateStorehouse",storehouse);
    // ���� storehouseServ
    Lich.wicca.invokeClient(storehouseServ, function (err, data) {
        logger.info("storehouseServ-updateStorehouse result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("����storehouseServ-updateStorehouseʧ��  ʧ��ԭ�� ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "���²ֿ�ʧ�ܣ�";
            callback(result,data);
        }
        callback(null,data);
    });
};


Subject.prototype.query = function(params, callback){

    //
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getSubTree",[params.pid]);
    //
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-getSubTree result:" + JSON.stringify(data[0]));
        if(err || data[0].result.code == 1){
            logger.error("subjectServ-getSubTree result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "查询类目列表失败";
            callback(result,data);
        }

        var subjectNodes = data[0].subjectNodes;
        var subejects = [];
        subjectNodes.forEach(function(subject){

            var subjectNode = ({
                id:         subject.id,
                name:       subject.name,
                imgkey:     subject.img_key,
                isLeaf:     subject.isLeaf
            });
            subejects.push(subjectNode);
        });



        callback(null,subejects);
    });
};




Subject.prototype.list = function(params, callback){


    // ��ȡclient

    //var queryParam = new storehouse_types.StorehouseQureyParam({
    //    id      :params.id,
    //    sellerId:params.sellerId
    //});
    //
    //var storehouseServ = new Lich.InvokeBag(Lich.ServiceKey.StorehouseServer, "queryStorehouse",queryParam);
    //// ���� storehouseServ
    //Lich.wicca.invokeClient(storehouseServ, function (err, data) {
    //    logger.info("storehouseServ-queryStorehouse result:" + JSON.stringify(data[0]));
    //    if(err || data[0].result.code == 1){
    //        logger.error("����storehouseServ-queryStorehouse  ʧ��ԭ�� ======" + err);
    //        var result = {};
    //        result.code = 500;
    //        result.desc = "��ѯ�ֿ��б�ʧ�ܣ�";
    //        callback(result,data);
    //    }else{
    //        callback(null, data[0].storehouseList);
    //    }
    //
    //});
    /*****************
     *
     *
     *
     * 530000	����ʡ
     710000	̨��ʡ
     220000	����ʡ
     510000	�Ĵ�ʡ
     340000	����ʡ
     370000	ɽ��ʡ
     140000	ɽ��ʡ
     440000	�㶫ʡ
     320000	����ʡ
     360000	����ʡ
     130000	�ӱ�ʡ
     410000	����ʡ
     330000	�㽭ʡ
     460000	����ʡ
     420000	����ʡ
     430000	����ʡ
     620000	����ʡ
     350000	����ʡ
     520000	����ʡ
     210000	����ʡ
     610000	����ʡ
     630000	�ຣʡ
     230000	������ʡ

     *
     *
     *
     *
     *
     *
     *
     * *****************/

    /*********************һ���ǲ�������****************************/
    var addressList = [];
    var storehouse = new storehouse_types.Storehouse({
        id:1,sellerId:5,name:"������",
        supportProvince:"220000,370000,220000,630000,330000,440000"
    });

    var storehouse1 = new storehouse_types.Storehouse({
        id:2,sellerId:5,name:"���ϲ�",
        supportProvince:"460000,210000,220000,620000,330000,440000"
    });


    addressList.push(storehouse);
    addressList.push(storehouse1);


    callback(null,addressList);

};
Subject.prototype.querySubjectPath = function(params, callback){

    //
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getSuperTree",[params.id]);
    //
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-getSuperTree result:" + JSON.stringify(data));
        if(err || data[0].result.code == 1){
            logger.error("subjectServ-getSuperTree result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "查询类目列表失败";
           return callback(result,null);
        }
        var subjectpath = "";
        if(data[0].subjectNodes !=null){
            for (var i = 0; i < data[0].subjectNodes.length; i++) {
                if(i == data[0].subjectNodes.length-1){
                    subjectpath += data[0].subjectNodes[i].name;
                }else {
                    subjectpath += data[0].subjectNodes[i].name+"-";

                }

            }

        }

       return callback(null,subjectpath);
    });
};

module.exports = new Subject();/**
 * Created by Administrator on 2016/4/27 0027.
 */
