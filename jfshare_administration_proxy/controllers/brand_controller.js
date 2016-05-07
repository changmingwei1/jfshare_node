/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

var Brand = require('../lib/models/brand');

// 添加品牌
router.post('/add', function(request, response, next) {

    var result = {code: 200};
    response.json(result);
    //var result = {code: 200};
    //try{
    //    var params = request.body;
    //
    //    if(params.name=="" || params.name ==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    if(params.imgKey=="" || params.imgKey ==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    if(params.userId=="" || params.userId ==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    Brand.add(params,function(error,data){
    //        if (error) {
    //            response.json(error);
    //        } else {
    //            result.id = data;
    //            logger.info("queryAttributes  result:" + JSON.stringify(result));
    //            response.json(result);
    //        }
    //    });
    //
    //} catch (ex) {
    //    logger.error("add brand error:" + ex);
    //    result.code = 500;
    //    result.desc = "新增品牌失败";
    //    response.json(result);
    //}
});



//更新
router.post('/update', function (request, response, next) {

    var result = {code: 200};
    response.json(result);
    //var result = {code: 200};
    //try{
    //    var params = request.body;
    //
    //    if(params.name=="" || params.name ==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    if(params.imgKey=="" || params.imgKey ==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    if(params.userId=="" || params.userId ==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    if(params.id=="" || params.id ==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    Brand.update(params,function(error,data){
    //        if (error) {
    //            response.json(error);
    //        } else {
    //            logger.info("update brand   result:" + JSON.stringify(result));
    //            response.json(result);
    //        }
    //    });
    //
    //} catch (ex) {
    //    logger.error("update brand error:" + ex);
    //    result.code = 500;
    //    result.desc = "更新品牌失败";
    //    response.json(result);
    //}
});
//获取单个品牌的信息
router.post('/get', function (request, response, next) {

    var result = {
        "code": 200,
        "name": "菲安妮",
        "id": 817,
        "imgKey": "9B31B3A71805FED478029820B76D53BC.jpg"
    };

    response.json(result);


    //var result = {code: 200};
    //
    //
    //try{
    //    var params = request.body;
    //
    //    if(params.id=="" || params.id ==null){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //    Brand.get(params,function(error,data){
    //        if (error) {
    //            response.json(error);
    //        } else {
    //            result.name = data.name;
    //            result.id = data.id;
    //            result.imgKey = data.imgKey;
    //            response.json(result);
    //        }
    //    });
    //
    //} catch (ex) {
    //    logger.error("get brandInfo   error:" + ex);
    //    result.code = 500;
    //    result.desc = "获取品牌失败";
    //    response.json(result);
    //}
});
//品牌列表
router.post('/list', function(request, response, next) {

   var result =  {
        "code": 200,
        "brandList": [
        {
            "id": 1,
            "name": "STM",
            "imgKey": "443FB61A96DD9479914C3D0B75376519.jpg",
            "createTime": "2016-01-10 15:50:35",
            "lastUpdateTime": "2016-01-10 15:50:35"
        },
        {
            "id": 2,
            "name": "55°",
            "imgKey": "451E5564572C98E9A0B0810C9A7640AC.jpg",
            "createTime": "2016-01-10 15:50:35",
            "lastUpdateTime": "2016-01-10 15:50:35"
        },
        {
            "id": 3,
            "name": "法国乐上",
            "imgKey": "7FDAC2C78BA0F449FE179D7B99BF285A.jpg",
            "createTime": "2016-01-10 15:50:35",
            "lastUpdateTime": "2016-01-10 15:50:35"
        },
        {
            "id": 4,
            "name": "赛诺",
            "imgKey": "14062167540C05A0CFF1C1C9298D4C7F.jpg",
            "createTime": "2016-01-10 15:50:35",
            "lastUpdateTime": "2016-01-10 15:50:35"
        },
        {
            "id": 5,
            "name": "喔喔牛",
            "imgKey": "251787A365FCC8B75F1B12E51E82D144.jpg",
            "createTime": "2016-01-10 15:50:35",
            "lastUpdateTime": "2016-01-10 15:50:35"
        },
        {
            "id": 6,
            "name": "兴财",
            "imgKey": "40EB4543608AB7AC6034222A254E1DE2.jpg",
            "createTime": "2016-01-10 15:50:35",
            "lastUpdateTime": "2016-01-10 15:50:35"
        },
        {
            "id": 7,
            "name": "神力骑",
            "imgKey": "26C281DEE7148D6A187CCFC90F39828F.jpg",
            "createTime": "2016-01-10 15:50:35",
            "lastUpdateTime": "2016-01-10 15:50:35"
        },
        {
            "id": 8,
            "name": "福瑞客",
            "imgKey": "5EAD092B3C63C98033F86D5EF4E04A6F.jpg",
            "createTime": "2016-01-10 15:50:35",
            "lastUpdateTime": "2016-01-10 15:50:35"
        },
        {
            "id": 9,
            "name": "尚品佳纺",
            "imgKey": "49F0FBCCFA8323B7A5D56D5ECC17F570.jpg",
            "createTime": "2016-01-10 15:50:35",
            "lastUpdateTime": "2016-01-10 15:50:35"
        },
        {
            "id": 10,
            "name": "smawatch",
            "imgKey": "1EEADE5AB4C1A48A7B9B9B175D243D57.jpg",
            "createTime": "2016-01-10 15:50:35",
            "lastUpdateTime": "2016-01-10 15:50:35"
        }
    ]
    };
    response.json(result);

    //var result = {code: 200};
    //try{
    //    var params = request.body;
    //
    //    if(params.perCount=="" || params.perCount ==null || params.perCount <=0){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //    if(params.curPage=="" || params.curPage ==null ||params.curPage <=0){
    //        result.code = 500;
    //        result.desc = "参数错误";
    //        response.json(result);
    //        return;
    //    }
    //
    //
    //    Brand.list(params,function(error,data){
    //        if (error) {
    //            response.json(error);
    //        } else {
    //            logger.info("query brandlist   result:" + JSON.stringify(result));
    //            var page = {total:data[0].total , pageCount:data[0].pageCount};
    //           // result.
    //            var brands = data[0].brandInfo;
    //            var brandList = [];
    //            if(data[0].total!=0){
    //                brands.forEach(function (brandInfo) {
    //                    var brand = ({
    //                        id:brandInfo.id,
    //                        name:brandInfo.name,
    //                        imgKey:brandInfo.imgKey,
    //                        createTime:brandInfo.createTime,
    //                        lastUpdateTime:brandInfo.lastUpdateTime
    //                    });
    //                    brandList.push(brand);
    //                });
    //            }
    //
    //
    //            result.brandList = brandList;
    //            response.json(result);
    //        }
    //    });
    //
    //} catch (ex) {
    //    logger.error("get brandlist error:" + ex);
    //    result.code = 500;
    //    result.desc = "获取品牌列表失败";
    //    response.json(result);
    //}
});

//关联品牌的品类
router.post('/relateSubject', function(req, res, next) {
    var result = {code: 200};
    response.json(result);
    //var result = {code: 200};
    //
    //try{
    //    var arg = req.body;
    //    var params = {};
    //    params.subjectIds = [3001,3002,3003];
    //    params.brandId = arg.brandId || 1;
    //
    //    logger.info("获取商家列表请求， arg:" + JSON.stringify(params));
    //
    //    res.json(result);
    //    logger.info("获取商家列表 response:" + JSON.stringify(result));
    //
    //} catch (ex) {
    //    logger.error("get 商家 list error:" + ex);
    //    result.code = 500;
    //    result.desc = "获取商家列表列表失败";
    //    res.json(result);
    //}
});

module.exports = router;