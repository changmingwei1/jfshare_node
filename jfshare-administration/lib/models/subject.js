/**
 * Created by Lenovo on 2015/9/28.
 */
/**********************thrift config*************************************/
var Lich = require('../thrift/Lich.js');
var subject_types=require("../thrift/gen_code/subject_types")
var thrift = require('thrift');

/****************log4js***********************************/
var log4node = require('../../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

function Subject( subject ){
    this.subjectId = null;
    this.brandsRef = null;
    this.attributes = null;
    this.sku_template = null;
    this.path = null;

    if(subject) {
        if(subject["subjectId"] !== undefined) {
            this.subjectId = subject["subjectId"];
        }
        if(subject["brandsRef"] !== undefined) {
            this.brandsRef = subject["brandsRef"];
        }
        if(subject["attributes"] !== undefined) {
            this.attributes = subject["attributes"];
        }
        if(subject["sku_template"] !== undefined) {
            this.sku_template = subject["sku_template"];
        }
        if(subject["path"] !== path) {
            this.sku_template = subject["sku_template"];
        }
    }
}


Subject.prototype.getSubject = function(data,callback) {
    console.log(data["subjectId"]);
    if(data["subjectId"] === undefined) {
        callback('err','');
    }
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getById", data["subjectId"]);
    // ���� subjectServ
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        if(err){
            log.error("����subjectServ ����ʧ��  ʧ��ԭ�� ======" + err);
            return callback(err,'');
        }

        log.info("����subjectServ.getById() �ɹ�  result=" +  JSON.stringify(data));
        var result = data[0].result;
        if(result["code"] != 0) {
            return callback(result["failDescList"], '');
        }
        var subjectInfo = data[0].subjectInfo;

        var subject = new Subject();
        subject.subjectId = subjectInfo.id;
        subject.brandsRef = data[0].brandList;
        subject.sku_template = {};
        subject.attributes = [];
        subject.path = [];
        var attrs = data[0].subjectAttributes;
        console.log(attrs);
        attrs.forEach(function(attr){
            if(attr["isSku"] == 1) {
                subject.sku_template = JSON.parse(attr.value);
            } else {
                subject.attributes = JSON.parse(attr.value);
            }
        });

        var subjectNodes = subjectInfo.subjectNodes;
        subjectNodes.forEach(function(node){
            subject.path.push(node.name);
        });

        callback(null, subject);
    });
};

//��¶Subjectģ��
module.exports = Subject;