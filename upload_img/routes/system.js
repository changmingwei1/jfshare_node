/**
 * Created by Administrator on 2015/4/29.
 * 系统支持功能
 */
var express = require('express');
var router = express.Router();
//文件上传类
var formidable = require('formidable'),
    fs=require('fs'),
    TITLE = "formidable上传示例",
    AVATAR_UPLOAD_FOLDER = "/upload/images/";

var crypto = require('crypto');


var FdfsClient = require('../lib/fdfs');

var fdfs = new FdfsClient({
    trackers: [
        {
            host: '101.201.39.63',
            port: 22122
        }
    ],
    timeout: 100000,
    defaultExt: '',
    charset: 'utf8'
});

var redis_host = '10.24.191.2';
var img_proxy_url = 'http://101.201.39.63/';

/**
 * thrift
 */
var Lich = require('../lib/thrift/Lich.js');
var thrift = require('thrift');
var protocol = thrift.TBinaryProtocol;
var transport =  thrift.TFramedTransport;
var thriftOptions = {
    transport: transport,
    protocol: protocol
};


var fileNameMapped_types=require("../lib/thrift/gen_code/fileNameMapped_types");


var param_valid = require('../lib/util/param_valid');

// 日志
var log4node = require('../lib/util/log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

// redis
var redis = require("redis");
var client = redis.createClient(6380, redis_host);

//图片
var imageinfo = require("imageinfo");

client.auth("JFshare#0328",function(){
    console.log('redis认证通过');
});

client.info(function(err,response){
    console.log(err,response);
});

/* GET home page. */
router.get('/uploadDemo', function(req, res) {
    res.render('upload', { title: TITLE });
});

/* 图片地址转换 */
router.get('/v1/jfs_image/:img_key', function(req, res) {
    //res.render('upload', { title: TITLE });

    var img_key = req.params["img_key"] || "" ;

    if(img_key != ""){

        var type = img_key.split(".")[1];
        var view_size = img_key.split(".")[0].split("_")[1];
        var real_img_key = img_key.split(".")[0].split("_")[0]+"."+type;
        client.get("FileNameMapped:"+real_img_key,function(errGet,responseGet){
            console.log('Val:'+responseGet);

            //
            var fileId = responseGet;
            var view_fileId = fileId;
            if( !param_valid.empty(view_size) && !param_valid.empty(fileId)){
                view_fileId = fileId.split(".")[0] + "_" + view_size + "." + fileId.split(".")[1];
            }

            res.redirect(img_proxy_url+view_fileId);

            //var md5Data = crypto.createHash('md5').update(img_key).digest('hex').toUpperCase();
            //console.log(md5Data);

            //var file = '/jfshare/image/temp/'+md5Data+'.'+type;
            /*
             fdfs.download(fileId, file, function(){

             res.writeHead(200, {'Content-Type': 'image/!*'});

             res.write(file, "binary");

             res.end();
             });*/
        });
    }

});

/* 处理跨域options请求，上传逻辑 */
/*router.options('/upload', function(req, res,next) {

 /!*
 res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
 res.setHeader('Access-Control-Allow-Credentials', true);
 res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
 *!/

 var req_origin = "*";
 res.setHeader('Access-Control-Allow-Origin', req_origin);
 res.setHeader('Access-Control-Allow-Credentials', true);
 res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS'); //POST, GET, PUT, DELETE, OPTIONS
 res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept,X-Requested-With");


 /!*res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "X-Requested-With");
 res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
 res.header("X-Powered-By",' 3.2.1')
 res.header("Content-Type", "application/json;charset=utf-8");
 if (req.method == 'OPTIONS') {
 res.send(200);
 } else {
 next();
 }
 *!/


 // 此参数中携带了一些对上传文件的限定条件
 var originalUrl = req.originalUrl;
 console.log("originalUrl" + originalUrl);
 var limitParam = originalUrl.split("?")[1];
 var minw = 0;
 var maxw = 2000;
 var minh = 0;
 var maxh = 2000;
 if( !param_valid.empty(limitParam) && !param_valid.empty(limitParam.split("=")[1]) ){
 var allParam = limitParam.split("=")[1];
 minw = allParam.split("f")[0] || 0;
 maxw = allParam.split("f")[1] || 2000;
 minh = allParam.split("f")[2] || 0;
 maxh = allParam.split("f")[3] || 2000;
 }
 console.log(minw+","+maxw+","+minh+","+maxh);
 var form = new formidable.IncomingForm();   //创建上传表单
 form.encoding = "utf-8";        //设置编辑
 //form.uploadDir = "../public" + AVATAR_UPLOAD_FOLDER;     //设置上传目录
 //部署时候，使用的路径
 form.uploadDir = "/tmp";
 form.keepExtensions = true;     //保留后缀
 form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

 form.parse(req, function(err, fields, files) {
 // form表单解析错误
 if (err) {
 res.locals.error = err;
 //res.render('index', { title: TITLE });
 res.json( {result:false, title:'失败', failDesc:'表单解析失败'});
 return;
 }

 console.log("size" + files.Filedata.size);

 if(files.Filedata.size  > form.maxFieldsSize){
 res.json( {result:false, title:'失败', failDesc:'图片超过2M'});
 return;
 }


 var data = fs.readFileSync(files.Filedata.path);
 var md5Data = crypto.createHash('md5').update(data).digest('hex').toUpperCase();
 var filename = md5Data;


 //图片
 var image_info = imageinfo(data);

 console.log("width:" + image_info.width);
 if (image_info.width < minw  || image_info.width > maxw){
 //console.log("width:" + image_info.width);
 res.json( {result:false, title:'失败', failDesc:'宽度错误，实际宽度='+image_info.width + "，宽度范围应在"+minw+"px-"+maxw+"px内"});
 return;
 }

 console.log("height:" + image_info.height);
 if (image_info.height < minh || image_info.height > maxh){
 //console.log("height:" + image_info.height);
 res.json( {result:false, title:'失败', failDesc:'高度错误，实际高度='+image_info.height + "，高度范围应在"+minh+"px-"+maxh+"px内"});
 return;
 }

 //上传到fastdfs
 //files.Filedata.type
 var extName = "jpg";  //后缀名
 switch (files.Filedata.type) {
 case 'image/pjpeg':
 extName = 'jpg';
 break;
 case 'image/jpeg':
 extName = 'jpg';
 break;

 case 'image/png':
 extName = 'png';
 break;
 case 'image/x-png':
 extName = 'png';
 break;
 }

 fdfs.upload(data, {ext: extName}, function(err, fileId) {

 console.log("err : " + err);

 if(fileId){
 //thrift 保存映射关系
 savefileNameMapped(filename+"."+extName, fileId);
 }

 res.json( {result:true, title: filename+"."+extName  });
 console.log("fileId : " + fileId);

 });


 //var md5Data = crypto.createHash('md5').update(data).digest('hex').toUpperCase();
 //console.log(md5Data);


 /!*

 //后缀名字校验
 var extName = "";  //后缀名
 switch (files.Filedata.type) {
 case 'image/pjpeg':
 extName = 'jpg';
 break;
 case 'image/jpeg':
 extName = 'jpg';
 break;
 case 'image/png':
 extName = 'png';
 break;
 case 'image/x-png':
 extName = 'png';
 break;
 }

 if(extName.length == 0){
 res.locals.error = '只支持png和jpg格式图片';
 res.render('index', { title: TITLE });
 return;
 }
 *!/

 //设置上传图片的新名字
 /!*
 var avatarName = md5Data + "." + files.Filedata.name.split('.')[1] ;
 var newPath = form.uploadDir + avatarName;

 // res.render('index', { title: avatarName  });
 res.json( { title: avatarName  });
 console.log(newPath);

 var newImg = fs.readFileSync(newPath);
 if(!newImg){
 fs.renameSync(files.Filedata.path, newPath);  //重命名
 }
 *!/


 });

 res.locals.success = "上传成功";
 //res.render('index', { title: TITLE  });

 });*/

/* 处理post请求，上传逻辑 */
router.post('/upload', function(req, res) {

    /*
     res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
     res.setHeader('Access-Control-Allow-Credentials', true);
     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
     */

    /*var req_origin = "http://buyer.jfshare.com/";
     res.setHeader('Access-Control-Allow-Origin', req_origin);
     res.setHeader('Access-Control-Allow-Credentials', true);
     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS'); //POST, GET, PUT, DELETE, OPTIONS
     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept,X-Requested-With");
     */

    /*res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
     res.header("X-Powered-By",' 3.2.1')
     res.header("Content-Type", "application/json;charset=utf-8");
     if (req.method == 'OPTIONS') {
     res.send(200);
     } else {
     next();
     }
     */


    // 此参数中携带了一些对上传文件的限定条件
    var originalUrl = req.originalUrl;
    console.log("originalUrl" + originalUrl);
    var limitParam = originalUrl.split("?")[1];
    var minw = 0;
    var maxw = 2000;
    var minh = 0;
    var maxh = 2000;
    if( !param_valid.empty(limitParam) && !param_valid.empty(limitParam.split("=")[1]) ){
        var allParam = limitParam.split("=")[1];
        minw = allParam.split("f")[0] || 0;
        maxw = allParam.split("f")[1] || 2000;
        minh = allParam.split("f")[2] || 0;
        maxh = allParam.split("f")[3] || 2000;
    }
    console.log(minw+","+maxw+","+minh+","+maxh);
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = "utf-8";        //设置编辑
    //form.uploadDir = "../public" + AVATAR_UPLOAD_FOLDER;     //设置上传目录
    //部署时候，使用的路径
    form.uploadDir = "/tmp";
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        // form表单解析错误
        if (err) {
            res.locals.error = err;
            //res.render('index', { title: TITLE });
            res.json( {result:false, title:'失败', failDesc:'表单解析失败'});
            return;
        }

        console.log("size" + files.Filedata.size);

        if(files.Filedata.size  > form.maxFieldsSize){
            res.json( {result:false, title:'失败', failDesc:'图片超过2M'});
            return;
        }


        var data = fs.readFileSync(files.Filedata.path);
        var md5Data = crypto.createHash('md5').update(data).digest('hex').toUpperCase();
        var filename = md5Data;


        //图片
        var image_info = imageinfo(data);

        console.log("width:" + image_info.width);
        if (image_info.width < minw  || image_info.width > maxw){
            //console.log("width:" + image_info.width);
            res.json( {result:false, title:'失败', failDesc:'宽度错误，实际宽度='+image_info.width + "，宽度范围应在"+minw+"px-"+maxw+"px内"});
            return;
        }

        console.log("height:" + image_info.height);
        if (image_info.height < minh || image_info.height > maxh){
            //console.log("height:" + image_info.height);
            res.json( {result:false, title:'失败', failDesc:'高度错误，实际高度='+image_info.height + "，高度范围应在"+minh+"px-"+maxh+"px内"});
            return;
        }

        //上传到fastdfs
        //files.Filedata.type
        var extName = "jpg";  //后缀名
        switch (files.Filedata.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;

            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        fdfs.upload(data, {ext: extName}, function(err, fileId) {

            console.log("err : " + err);

            if(fileId){
                //thrift 保存映射关系
                savefileNameMapped(filename+"."+extName, fileId);
            }

            res.json( {result:true, title: filename+"."+extName  });
            console.log("fileId : " + fileId);

        });


        //var md5Data = crypto.createHash('md5').update(data).digest('hex').toUpperCase();
        //console.log(md5Data);


        /*

         //后缀名字校验
         var extName = "";  //后缀名
         switch (files.Filedata.type) {
         case 'image/pjpeg':
         extName = 'jpg';
         break;
         case 'image/jpeg':
         extName = 'jpg';
         break;
         case 'image/png':
         extName = 'png';
         break;
         case 'image/x-png':
         extName = 'png';
         break;
         }

         if(extName.length == 0){
         res.locals.error = '只支持png和jpg格式图片';
         res.render('index', { title: TITLE });
         return;
         }
         */

        //设置上传图片的新名字
        /*
         var avatarName = md5Data + "." + files.Filedata.name.split('.')[1] ;
         var newPath = form.uploadDir + avatarName;

         // res.render('index', { title: avatarName  });
         res.json( { title: avatarName  });
         console.log(newPath);

         var newImg = fs.readFileSync(newPath);
         if(!newImg){
         fs.renameSync(files.Filedata.path, newPath);  //重命名
         }
         */


    });

    res.locals.success = "上传成功";
    //res.render('index', { title: TITLE  });

});

/* 处理post请求，上传逻辑 */
router.post('/uploadFile', function(req, res) {

    var req_origin = req.headers.origin || "*";
    res.setHeader('Access-Control-Allow-Origin', req_origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET'); //POST, GET, PUT, DELETE, OPTIONS
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept,X-Requested-With");


    var originalUrl = req.originalUrl;
    console.log("originalUrl" + originalUrl);

    var form = new formidable.IncomingForm();
    form.encoding = "utf-8";

    form.uploadDir = "/tmp";
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;

    form.parse(req, function(err, fields, files) {

        if (err) {
            res.locals.error = err;
            res.json( {result:false, title:'失败', failDesc:'表单解析失败'});
            return;
        }

        console.log("size" + files.Filedata.size);

        var data = fs.readFileSync(files.Filedata.path);
        var md5Data = crypto.createHash('md5').update(data).digest('hex').toUpperCase();
        var filename = md5Data;

        var image_info = imageinfo(data);

        var extName = "xls";

        fdfs.upload(data, {ext: extName}, function(err, fileId) {

            console.log("err : " + err);

            if(fileId){
                savefileNameMapped(filename+"."+extName, fileId);
            }

            res.json( {result:true, title: filename+"."+extName  });
            console.log("fileId : " + fileId);
        });
    });

    res.locals.success = "上传成功";
});

/* 处理post请求，上传逻辑 */
router.post('/uploadFiles', function(req, res) {

    var req_origin = req.headers.origin || "*";
    res.setHeader('Access-Control-Allow-Origin', req_origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET'); //POST, GET, PUT, DELETE, OPTIONS
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept,X-Requested-With");


    var originalUrl = req.originalUrl;
    console.log("originalUrl" + originalUrl);

    var form = new formidable.IncomingForm();
    form.encoding = "utf-8";

    form.uploadDir = "/tmp";
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;

    form.parse(req, function(err, fields, files) {

        if (err) {
            res.locals.error = err;
            res.json( {result:false, title:'失败', failDesc:'表单解析失败'});
            return;
        }

        console.log("size" + files.Filedata.size);

        var data = fs.readFileSync(files.Filedata.path);
        var md5Data = crypto.createHash('md5').update(data).digest('hex').toUpperCase();
        var filename = md5Data;

        var image_info = imageinfo(data);

        var extName = "xlsx";

        fdfs.upload(data, {ext: extName}, function(err, fileId) {

            console.log("err : " + err);

            if(fileId){
                savefileNameMapped(filename+"."+extName, fileId);
            }

            res.json( {result:true, title: filename+"."+extName  });
            console.log("fileId : " + fileId);
        });
    });

    res.locals.success = "上传成功";
});





function savefileNameMapped(p_filename, p_fileid){

    //log.info("savefileNameMapped");


    var fileNameMappedInfo = new fileNameMapped_types.FileNameMappedInfo ({
        filename:p_filename,
        fileid:p_fileid
    });

    var fileNameMapped_save = new Lich.InvokeBag(Lich.ServiceKey.FileNameMappedServer, "saveFileNameMappedInfo", fileNameMappedInfo);

    //log.info(fileNameMapped_save);

    Lich.wicca.invokeClient(fileNameMapped_save, function (err, data) {
        if(err || data[0].result.code == "1"){
            log.error("fileNameMapped_save 服务失败  失败原因 ======" + err);
            // res.json({data:{"result":{"code":1}}});
        }
        //logger.info("调用productServ_productSurveyQuery() 成功  result=" + JSON.stringify(data));
        //res.json(data[0]);
        return data[0].value;

    });

}



module.exports = router;

