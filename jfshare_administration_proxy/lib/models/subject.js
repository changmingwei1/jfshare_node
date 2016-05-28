/**
 * Created by huapengpeng on 2016/4/22.
 */
/**
 * Created by huapengpeng on 16/3/20.
 */

var log4node = require('../../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Lich = require('../thrift/Lich.js');
var thrift = require('thrift');
var pagination_types = require('../thrift/gen_code/pagination_types');


var subject_types = require("../thrift/gen_code/subject_types");
var brand_types = require("../thrift/gen_code/brand_types");


function Subject() {
}


Subject.prototype.add = function (params, callback) {


    var subject = new subject_types.SubjectInfo({
        name: params.name,
        pid: params.pid,
        level: params.level,
        img_key: params.imgkey,
        creator: params.userId,
        commodity: params.commodity,
        isLeaf: params.isLeaf
    });


    logger.info("addSubject:" + JSON.stringify(subject));

    var subjectServer = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "add", subject);

    Lich.wicca.invokeClient(subjectServer, function (err, data) {
        logger.info("subjectServer-addSubject result:" + JSON.stringify(data));
        if (err || data[0].code == 1) {
            logger.error("addressServ-addAddress error ======" + err);

            var result = {};
            result.code = 500;
            result.desc = "添加类目失败";

            logger.error("addressServ-addAddress error ======" + err);

            return callback(result, null);

        }

        return callback(null, data);
    });
};


Subject.prototype.update = function (params, callback) {


    var subject = new subject_types.SubjectInfo({
        name: params.name,
        img_key: params.imgkey,
        updater: params.userId,
        id: params.id
    });

    if(params.attributes!=null && params.attributes!=""){
        subject.attributes = params.attributes;
    }


    logger.info("img_key------->:" + JSON.stringify(subject.img_key));
    if( subject.img_key==null ||subject.img_key ==""){
        subject.img_key = "0B7F87D81F368E62D93E0F9B14F67B3A.png";
    }

    logger.info("updateSubject:" + JSON.stringify(subject));

    var subjectServer = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "update", subject);

    Lich.wicca.invokeClient(subjectServer, function (err, data) {
        logger.info("subjectServer-updateSubject result:" + JSON.stringify(data));
        if (err || data[0].code == 1) {
            logger.error("addressServ-updateSubject error ======" + err);

            var result = {};
            result.code = 500;
            result.desc = "更新类目失败";

            logger.error("addressServ-updateSubject error ======" + err);

            return callback(result, null);

        }

        return callback(null, data);
    });
};


Subject.prototype.query = function (params, callback) {

    //
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getSubTree", [params.pid]);
    //
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-getSubTree result:" + JSON.stringify(data[0]));
        if (err || data[0].result.code == 1) {
            logger.error("subjectServ-getSubTree result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "查询类目列表失败";
            return callback(result, null);
        }

        var subjectNodes = data[0].subjectNodes;
        var subejects = [];
        subjectNodes.forEach(function (subject) {

            var subjectNode = ({
                id: subject.id,
                name: subject.name,
                imgkey: subject.img_key,
                isLeaf: subject.isLeaf,
                type: subject.commodity
            });
            subejects.push(subjectNode);
        });


        return callback(null, subejects);
    });
};


Subject.prototype.getById = function (params, callback) {

    //获取单个类目信息

    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getById", [params.subjectId]);
    //
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-getById result:" + JSON.stringify(data));
        if (err || data[0].result.code == 1) {
            logger.error("subjectServ-getById result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "获取类目信息失败";
            return callback(result, data);
        }

        return callback(null, data);
    });
};


Subject.prototype.list = function (params, callback) {

    //
    ///*********************һ���ǲ�������****************************/
    //var addressList = [];
    //var storehouse = new storehouse_types.Storehouse({
    //    id: 1, sellerId: 5, name: "������",
    //    supportProvince: "220000,370000,220000,630000,330000,440000"
    //});
    //
    //var storehouse1 = new storehouse_types.Storehouse({
    //    id: 2, sellerId: 5, name: "���ϲ�",
    //    supportProvince: "460000,210000,220000,620000,330000,440000"
    //});
    //
    //
    //addressList.push(storehouse);
    //addressList.push(storehouse1);
    //
    //
    //callback(null, addressList);
};


Subject.prototype.queryAttributes = function (params, callback) {
    var queryParam = new subject_types.SubjectAttributeQueryParam({
        subjectId: params.subjectId
    });
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "querySubjectAttribute", [queryParam]);

    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-querySubjectAttribute result:" + JSON.stringify(data));
        if (err || data[0].result.code == 1) {
            logger.error("subjectServ-querySubjectAttribute result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "查询属性列表失败";
            return callback(result, null);
        }

        logger.info("subjectServ-querySubjectAttribute result:" + JSON.stringify(data));
        return callback(null, data);
    });
};


Subject.prototype.querySubjectPath = function (params, callback) {

    //
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getSuperTree", [params.id]);
    //
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-getSuperTree result:" + JSON.stringify(data));
        if (err || data[0].result.code == 1) {
            logger.error("subjectServ-getSuperTree result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "查询类目列表失败";
            return callback(result, null);
        }
        var subjectpath = "";
        if (data[0].subjectNodes != null) {
            for (var i = 0; i < data[0].subjectNodes.length; i++) {
                if (i == data[0].subjectNodes.length - 1) {
                    subjectpath += data[0].subjectNodes[i].name;
                } else {
                    subjectpath += data[0].subjectNodes[i].name + "-";

                }

            }

        }

        return callback(null, subjectpath);
    });
};

Subject.prototype.updateAttributes = function (params, callback) {

    logger.info("subjectServ-updateSubjectAttribute params   ======" +JSON.stringify( params));

    logger.info("subjectServ-updateSubjectAttribute params   ======" +JSON.stringify( params.id)+"--->"+JSON.stringify( params.value));
    var subjectAttribute = new subject_types.SubjectAttribute({
        id: params.id,
        value: params.value.toString()
    });

    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "updateSubjectAttribute", [subjectAttribute]);
    //
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-updateSubjectAttribute result:" + JSON.stringify(data));
        if (err || data[0].code == 1) {
            logger.error("subjectServ-updateSubjectAttribute result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "更新类目属性失败";
            return callback(result, null);
        }
        return callback(null, data);
    });
};


Subject.prototype.flushtoAll = function (params, callback) {

    //参数需要修改
    var subjectInfo = new subject_types.SubjectInfo({
        pid: params.pid,
        attributes: params.id
    });

    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "applyAttributeToSuperAll", [subjectInfo]);
    //
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-applyAttributeToSuperAll result:" + JSON.stringify(data));
        if (err || data[0].code == 1) {
            logger.error("subjectServ-applyAttributeToSuperAll result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "类目属性应用全部属性失败";
            return callback(result, null);
        }


        return callback(null, data);
    });
};

Subject.prototype.getListforBrand = function (params, callback) {

    //
    var brandInfo = new brand_types.BrandInfo({
        id: params.id
    });

    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "queryBrandSubject", [brandInfo]);
    //
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-getListforBrand result:" + JSON.stringify(data));
        if (err || data[0].result.code == 1) {
            logger.error("subjectServ-getListforBrand result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "获取品牌关联类目失败";
            return callback(result, null);
        }


        return callback(null, data);
    });
};

Subject.prototype.updateBrandSubject = function (params, callback) {

    var list = {};

    for(var i=0;i<params.subjectIds.length;i++){

        list.push(params.subjectIds[i]);
    }

    var brandSubjectParam = new subject_types.BrandSubjectParam({
        bId: params.brandId,
        Subjects: params.list
    });

    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "updateBrandSubject", [brandSubjectParam]);
    //
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-updateBrandSubject result:" + JSON.stringify(data));
        if (err || data[0].code == 1) {
            logger.error("subjectServ-updateBrandSubject result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "更新品牌关联类目失败";
            return callback(result, null);
        }


        return callback(null, data);
    });
};

//根据id查询，批量查询此节点所属路径
Subject.prototype.getBatchSuperTree = function (productIdList, callback) {
    //参数list
    var subjectIds = [];
    var proNameList = productIdList;

    if (proNameList.length <= 0) {
        logger.error("subjectServ-getBatchSuperTree result  proNameList.lenth" + proNameList.length);
        var result = {};
        result.code = 500;
        result.desc = "批量获取类目失败";
        return callback(result, null);
    }

    logger.info("subjectServ-getBatchSuperTree proNameList:" + JSON.stringify(proNameList.length));

    proNameList.forEach(function (a) {
        subjectIds.push(a);
    });
    logger.info("subjectIds subjectIds:" + JSON.stringify(subjectIds));
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "getBatchSuperTree", [subjectIds]);
    //
    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-getBatchSuperTree result:" + JSON.stringify(data));
        if (err || data[0].code == 1) {
            logger.error("subjectServ-getBatchSuperTree result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "批量获取类目失败";
            return callback(result, null);
        }
        return callback(null, data);
    });

};
//添加属性
Subject.prototype.addSubjectAttribute = function (params, callback) {
    logger.info("subjectServ-addSubjectAttribute params:" + JSON.stringify(params));
    var subjectAttribute = new subject_types.SubjectAttribute({
        name: "name",
        subjectId: params.subjectId,
        value: JSON.stringify(params.value),
        isSku: 0,
        creator: params.userId
    });
    var subjectServ = new Lich.InvokeBag(Lich.ServiceKey.SubjectServer, "addSubjectAttribute", [subjectAttribute]);

    Lich.wicca.invokeClient(subjectServ, function (err, data) {
        logger.info("subjectServ-addSubjectAttribute result:" + JSON.stringify(data));
        if (err || data[0].code == 1) {
            logger.error("subjectServ-addSubjectAttribute result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "添加属性失败";
            return callback(result, null);
        }
        return callback(null, data);
    });

};


module.exports = new Subject();
/**
 * Created by Administrator on 2016/4/27 0027.
 */
