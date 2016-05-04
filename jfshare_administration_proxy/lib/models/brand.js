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
var brand_types = require("../thrift/gen_code/brand_types");


function Brand() {
}


Brand.prototype.add = function (params, callback) {


    var brand = new brand_types.BrandInfo({
        name: params.name,
        imgKey: params.imgKey,
        createId: params.userId
    });


    logger.info("addBrand:" + JSON.stringify(brand));

    var brandServer = new Lich.InvokeBag(Lich.ServiceKey.BrandServer, "addBrand", brand);

    Lich.wicca.invokeClient(brandServer, function (err, data) {
        logger.info("brandServer-addBrand result:" + JSON.stringify(data));
        if (err || data[0].result.code == 1) {

            var result = {};
            result.code = 500;
            result.desc = "添加品牌失败";

            logger.error("brandServer-brandServer error ======" + err);

            return callback(result, null);

        }

        return callback(null, data[0].brandInfo.id);
    });
};


Brand.prototype.update = function (params, callback) {

    var brand = new brand_types.BrandInfo({
        id: params.id,
        name: params.name,
        imgKey: params.imgKey,
        lastUpdateId: params.userId
    });


    logger.info("updateBrand:" + JSON.stringify(brand));

    var brandServer = new Lich.InvokeBag(Lich.ServiceKey.BrandServer, "updateBrand", brand);

    Lich.wicca.invokeClient(brandServer, function (err, data) {
        logger.info("brandServer-updateBrand result:" + JSON.stringify(data));
        if (err || data[0].code == 1) {
            logger.error("brandServer-updateBrand error ======" + err);

            var result = {};
            result.code = 500;
            result.desc = "更新品牌失败";

            logger.error("brandServer-updateBrand error ======" + err);

            return callback(result, null);

        }
        if (data[0].code == 0) {
            return callback(null, data);
        }
    });
};


Brand.prototype.query = function (params, callback) {

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
            callback(result, data);
        }

        var subjectNodes = data[0].subjectNodes;
        var subejects = [];
        subjectNodes.forEach(function (subject) {

            var subjectNode = ({
                id: subject.id,
                name: subject.name,
                imgkey: subject.img_key,
                isLeaf: subject.isLeaf
            });
            subejects.push(subjectNode);
        });


        callback(null, subejects);
    });
};


Brand.prototype.list = function (params, callback) {
    var queryParam = new brand_types.QueryParam({
        pageSize: params.perCount || 20,
        curPage: params.curPage || 1,
        name: params.name
    });
    logger.info("brandServ-queryByPage params:" + JSON.stringify(queryParam));
    var brandServ = new Lich.InvokeBag(Lich.ServiceKey.BrandServer, "queryByPage", [queryParam]);
    //
    Lich.wicca.invokeClient(brandServ, function (err, data) {
        logger.info("brandServ-queryByPage result:" + JSON.stringify(data));
        if (err || data[0].result.code == 1) {
            logger.error("brandServ-queryByPage result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "查询品牌列表失败";
            callback(result, data);
        }

        if(data[0].result.code ==0){
            callback(null, data);
        }

    });
};

Brand.prototype.get = function (params, callback) {
    var ids = [];
    ids.push(params.id);
    logger.info("brandServ-queryBatch params:" + JSON.stringify(params));
    var brandServ = new Lich.InvokeBag(Lich.ServiceKey.BrandServer, "queryBatch", [ids]);
    //
    Lich.wicca.invokeClient(brandServ, function (err, data) {
        logger.info("brandServ-queryBatch result:" + JSON.stringify(data));
        if (err || data[0].result.code == 1) {
            logger.error("brandServ-queryBatch result   ======" + err);
            var result = {};
            result.code = 500;
            result.desc = "获取品牌信息失败";
            callback(result, data);
        }

        if(data[0].result.code ==0){

            callback(null, data[0].brandInfo[0]);
        }

    });
};
module.exports = new Brand();
/**

 /**
 * Created by Administrator on 2016/5/3 0003.
 */
