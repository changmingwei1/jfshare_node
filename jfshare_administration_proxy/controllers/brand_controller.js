/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Brand = require('../lib/models/brand');
var brand_types = require("../lib/thrift/gen_code/brand_types");

// 添加品牌
router.post('/add', function(request, response, next) {


    var result = {code: 200};
    try{
        var params = request.body;

        if(params.name=="" || params.name ==null){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if(params.imgKey=="" || params.imgKey ==null){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.userId=="" || params.userId ==null){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Brand.add(params,function(error,data){
            if (error) {
                response.json(error);
            } else {
                result.id = data;
                logger.info("queryAttributes  result:" + JSON.stringify(result));
                response.json(result);
            }
        });

    } catch (ex) {
        logger.error("add brand error:" + ex);
        result.code = 500;
        result.desc = "新增品牌失败";
        response.json(result);
    }
});



//更新
router.post('/update', function (request, response, next) {


    var result = {code: 200};
    try{
        var params = request.body;

        if(params.name=="" || params.name ==null){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if(params.imgKey=="" || params.imgKey ==null){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.userId=="" || params.userId ==null){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.id=="" || params.id ==null){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Brand.update(params,function(error,data){
            if (error) {
                response.json(error);
            } else {
                logger.info("update brand   result:" + JSON.stringify(result));
                response.json(result);
            }
        });

    } catch (ex) {
        logger.error("update brand error:" + ex);
        result.code = 500;
        result.desc = "更新品牌失败";
        response.json(result);
    }
});
//获取单个品牌的信息
router.post('/get', function (request, response, next) {




    var result = {code: 200};


    try{
        var params = request.body;

        if(params.id=="" || params.id ==null){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        Brand.get(params,function(error,data){
            if (error) {
                response.json(error);
            } else {
                result.name = data.name;
                result.id = data.id;
                result.imgKey = data.imgKey;
                response.json(result);
            }
        });

    } catch (ex) {
        logger.error("get brandInfo   error:" + ex);
        result.code = 500;
        result.desc = "获取品牌失败";
        response.json(result);
    }
});
//品牌列表
router.post('/list', function(request, response, next) {



    var result = {code: 200};
    try{
        var params = request.body;

        if(params.perCount=="" || params.perCount ==null || params.perCount <=0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        if(params.curPage=="" || params.curPage ==null ||params.curPage <=0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }


        Brand.list(params,function(error,data){
            if (error) {
                response.json(error);
            } else {
                logger.info("query brandlist   result:" + JSON.stringify(result));
                var page = {total:data[0].total , pageCount:data[0].pageCount};
               // result.
                var brands = data[0].brandInfo;
                var brandList = [];
                if(data[0].total!=0){
                    brands.forEach(function (brandInfo) {
                        var brand = ({
                            id:brandInfo.id,
                            name:brandInfo.name,
                            imgKey:brandInfo.imgKey,
                            createTime:brandInfo.createTime,
                            lastUpdateTime:brandInfo.lastUpdateTime
                        });
                        brandList.push(brand);
                    });
                }


                result.brandList = brandList;
                response.json(result);
            }
        });

    } catch (ex) {
        logger.error("get brandlist error:" + ex);
        result.code = 500;
        result.desc = "获取品牌列表失败";
        response.json(result);
    }
});

//关联品牌的品类
router.post('/relateSubject', function(req, res, next) {

    var result = {code: 200};

    try{
        var arg = req.body;
        var params = {};
        params.subjectIds = [3001,3002,3003];
        params.brandId = arg.brandId || 1;

        logger.info("获取商家列表请求， arg:" + JSON.stringify(params));

        res.json(result);
        logger.info("获取商家列表 response:" + JSON.stringify(result));

    } catch (ex) {
        logger.error("get 商家 list error:" + ex);
        result.code = 500;
        result.desc = "获取商家列表列表失败";
        res.json(result);
    }
});

//查询类目下的品牌
router.post('/queryBySubject', function(request, response,next) {
    logger.info("进入查询类目品牌流程");
    var result = {code:200};

    try{
        var params = request.body;

        if(params.id ==null ||params.id ==""){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        Brand.queryBySubject(params, function(err, data) {
            logger.info(" brandServ-queryBatch response:" + JSON.stringify(data));
            var brandInfo=[];
            if(err){
                response.json(err);
                return;
            }else{
                //var dataBrand=data[0]
                //brandInfo.push();



            }

            logger.info(" brandServ-queryBatch response:" + JSON.stringify(result));
            response.json(result);

        });

    } catch (ex) {
        logger.error("获取积分错误: " + ex);
        result.code = 500;
        result.desc = "获取积分错误";
        response.json(result);
    }
});

module.exports = router;