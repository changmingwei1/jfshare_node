

/**
 * Created by huapengpeng on 2016/4/12.
 */
var express = require('express');
var router = express.Router();
var async = require('async');

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

//查询类目列表
router.post('/query', function(request, response, next) {

    logger.info("进入查询类目列表流程....");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验
        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.subjectPid == null || params.subjectPid == "" ||params.subjectPid < 0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        var subjectList = [];
        //一级类目
        if(params.subjectPid == 0){

            var subject= {id:1001,name:"家用电器",isLeaf:0};
            var subject1= {id:1002,name:"个护美妆",isLeaf:0};
            var subject2= {id:1003,name:"家居生活",isLeaf:0};
            var subject3= {id:1004,name:"手机数码",isLeaf:0};
            var subject4= {id:1005,name:"箱包配饰",isLeaf:0};
            var subject5= {id:1006,name:"食品酒水",isLeaf:0};
            var subject6= {id:1007,name:"母婴玩具",isLeaf:0};
            var subject7= {id:1008,name:"服装服饰",isLeaf:0};
            var subject8= {id:1009,name:"电脑办公",isLeaf:0};
            var subject9= {id:1010,name:"图书音像",isLeaf:0};
            var subject10= {id:1011,name:"运动健康",isLeaf:0};
            var subject11= {id:1012,name:"卡券商品",isLeaf:0};

            subjectList.push(subject);
            subjectList.push(subject1);
            subjectList.push(subject2);
            subjectList.push(subject3);
            subjectList.push(subject4);
            subjectList.push(subject5);
            subjectList.push(subject6);
            subjectList.push(subject7);
            subjectList.push(subject8);
            subjectList.push(subject9);
            subjectList.push(subject10);
            subjectList.push(subject11);
            result.subjectList = subjectList;
            response.json(result);
            return;
        }

        if(params.subjectPid == 1001){
            var subject= {id:2001,name:"生活电器",isLeaf:0};
            var subject1= {id:2002,name:"厨房电器",isLeaf:0};
            var subject2= {id:2003,name:"车载电器",isLeaf:0};


            subjectList.push(subject);
            subjectList.push(subject1);
            subjectList.push(subject2);

            result.subjectList = subjectList;

            result.subjectList = subjectList;
            response.json(result);
            return;

        }
        if(params.subjectPid == 1002){

            var subject= {id:2005,name:"女士护理",isLeaf:0};
            var subject1= {id:2006,name:"面部保养",isLeaf:0};
            var subject2= {id:2007,name:"香水精油",isLeaf:0};
            var subject3= {id:2008,name:"时尚彩妆",isLeaf:0};
            var subject4= {id:2009,name:"男士护理",isLeaf:0};
            var subject5= {id:2010,name:"身体护理",isLeaf:0};

            subjectList.push(subject);
            subjectList.push(subject1);
            subjectList.push(subject2);
            subjectList.push(subject3);
            subjectList.push(subject4);
            subjectList.push(subject5);
            result.subjectList = subjectList;

            result.subjectList = subjectList;
            response.json(result);
            return;
        }

        if(params.subjectPid > 1002 && params.subjectPid <2000){

            var subject= {id:2050,name:"游戏设备",isLeaf:0};
            var subject1= {id:2051,name:"电脑整机",isLeaf:0};
            var subject2= {id:2052,name:"电脑配件",isLeaf:0};
            var subject3= {id:2053,name:"电脑外设",isLeaf:0};
            var subject4= {id:2054,name:"网络产品",isLeaf:0};
            var subject5= {id:2055,name:"办公设备",isLeaf:0};

            subjectList.push(subject);
            subjectList.push(subject1);
            subjectList.push(subject2);
            subjectList.push(subject3);
            subjectList.push(subject4);
            subjectList.push(subject5);
            result.subjectList = subjectList;

            result.subjectList = subjectList;
            response.json(result);
            return;
        }

        if(params.subjectPid >=2000 && params.subjectPid <=3000){

            var subject= {id:3001,name:"空调",isLeaf:0};
            var subject1= {id:3002,name:"扫地机",isLeaf:0};
            var subject2= {id:3003,name:"电风扇",isLeaf:0};
            var subject3= {id:3004,name:"冷风扇",isLeaf:0};
            var subject4= {id:3005,name:"净化器",isLeaf:0};
            var subject5= {id:3006,name:"净水器",isLeaf:0};

            subjectList.push(subject);
            subjectList.push(subject1);
            subjectList.push(subject2);
            subjectList.push(subject3);
            subjectList.push(subject4);
            subjectList.push(subject5);
            result.subjectList = subjectList;

            result.subjectList = subjectList;
            response.json(result);
            return;

        }

    }catch(ex){
        logger.error("查询类目列表信息"+"失败，because :" + ex);
        result.code = 500;
        result.desc = "查询类目列表失败";
        result.json(result);
    }
});

//查询品牌列表
router.post('/querybrand', function(request, response, next) {

    logger.info("进入查询品牌列表流程....");
    var result = {code:200};

    try{
        //var params = request.query;
        var params = request.body;
        //参数校验
        if(params.sellerId == null || params.sellerId == "" ||params.sellerId <= 0){

            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }

        if(params.subjectId == null || params.subjectId == "" ||params.subjectId < 0){
            result.code = 500;
            result.desc = "参数错误";
            response.json(result);
            return;
        }
        var brandList = [];
        //品牌

        var brand= {id:25,name:"三洋"};
        var brand1= {id:45,name:"Hello Kitty"};
        var brand2= {id:73,name:"纵贯线"};
        var brand3= {id:144,name:"龙的"};
        var brand4= {id:146,name:"先锋"};
        var brand5= {id:147,name:"艾美特(Airmate)"};
        var brand6= {id:148,name:"奥克斯"};
        var brand7= {id:149,name:"TCL"};
        var brand8= {id:150,name:"华生"};
        var brand9= {id:151,name:"赛亿"};
        var brand10= {id:152,name:"澳柯玛"};
        var brand11= {id:153,name:"康佳"};

        brandList.push(brand);
        brandList.push(brand1);
        brandList.push(brand2);
        brandList.push(brand3);
        brandList.push(brand4);
        brandList.push(brand5);
        brandList.push(brand6);
        brandList.push(brand7);
        brandList.push(brand8);
        brandList.push(brand9);
        brandList.push(brand10);
        brandList.push(brand11);
        result.brandList = brandList;
        response.json(result);
        return;


    }catch(ex){
        logger.error("查询类目列表信息"+"失败，because :" + ex);
        result.code = 500;
        result.desc = "查询类目列表失败";
        result.json(result);
    }
});


module.exports = router;
