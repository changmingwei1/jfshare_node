/**
 * Created by Lenovo on 2015/9/28.
 */
/**********************thrift config*************************************/
var Lich = require('../thrift/Lich.js');
var seller_types=require("../thrift/gen_code/seller_types")
var thrift = require('thrift');

/****************log4js***********************************/
var log4node = require('../../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

function Seller( params ){
    this.sellerId = null;
    this.sellerName = null;
    this.loginName = null;

    if(params) {
        if(params["sellerId"] !== undefined) {
            this.subjectId = params["subjectId"];
        }
        if(params["sellerName"] !== undefined) {
            this.brandsRef = params["brandsRef"];
        }
        if(params["loginName"] !== undefined) {
            this.attributes = params["attributes"];
        }
    }
}


Seller.prototype.getSellerInfo = function(data,callback) {
    if(data["sellerId"] === undefined) {
        callback({result:false, failDesc:"缺少sellerId"});
        return;
    }
    log.info("params==> sellerId: " + data["sellerId"]);
    var thrift_sellerParams = new seller_types.SellerRetParam({baseTag:1});
    var sellerServ = new Lich.InvokeBag(Lich.ServiceKey.SellerServer, "querySeller", [data["sellerId"], thrift_sellerParams]);

    Lich.wicca.invokeClient(sellerServ, function (err, rdata) {
        if(err){
            log.error("访问sellerServ 发生异常 ======" + err);
            callback({result:false, failDesc:"系统异常"});
            return;
        }

        log.info("访问sellerServ  result=" +  JSON.stringify(rdata));
        var result = rdata[0].result;
        if(result["code"] != 0) {
            var failDescList = result.failDescList;
            var failDesc = "系统异常";
            if(failDescList.length>0) {
                failDesc = failDescList[0].desc;
            }
            callback({code: 1, failDesc:failDesc, result:false});
            return;
        }

        callback({result:true, seller:rdata[0].seller});
    });
};

module.exports = Seller;