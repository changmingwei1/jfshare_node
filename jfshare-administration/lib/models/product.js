/**
 * Created by Lenovo on 2015/9/28.
 */
/**********************thrift config*************************************/
var Lich = require('../thrift/Lich.js');
var product_types=require("../thrift/gen_code/product_types");
var thrift = require('thrift');

/****************log4js***********************************/
var log4node = require('../../log4node');
var log = log4node.configlog4node.useLog4js( log4node.configlog4node.log4jsConfig);

function Product(product){
    this.productId = null  ;
    this.productName = null;
    this.sellerId = null;
    this.viceName = null;
    this.subjectId = null;
    this.brandId = null;
    this.tags = null;
    this.detailKey = null;
    this.detailContent = null;
    this.maxBuyLimit = null;
    this.activeState = null;
    this.type = null;
    this.state = null;
    this.sku_template = null;
    this.productSkuMap = null;
    this.productUrl = null;
    this.attributes = null;
    this.imgKey = null;
    this.sellerClassNum = null;
    this.shelf = null;
    this.curPrice = null;
    this.orgPrice = null;
};

Product.prototype.setProductState = function(pdata, callback) {

    if (pdata) {
        var productId = pdata["productId"]||"";
        var curState = pdata["curState"]||"";
        var newState = pdata["newState"]||"";
        var reason = pdata["reason"]||"";
        var operatorId = pdata["operatorId"]||"";
        console.log('productId--->'+ productId);
        console.log('curState--->'+ curState);
        console.log('newState--->'+ newState);
        console.log('reason--->'+ reason);
        console.log('operatorId--->'+ operatorId);
        if(productId && curState && newState) {
            var thrift_productOpt = new product_types.ProductOpt();
            thrift_productOpt.productId = productId;
            thrift_productOpt.curState = curState;
            thrift_productOpt.activeState = newState;
            thrift_productOpt.desc = reason;
            thrift_productOpt.operatorId = operatorId;
            thrift_productOpt.operatorType = 2;
            var productServ = new Lich.InvokeBag(Lich.ServiceKey.ProductServer, "setProductState", thrift_productOpt);

            // 调用 productServ
            Lich.wicca.invokeClient(productServ, function (err, data) {
                if (err) {
                    return callback(err,'');
                }
                log.info("productServ.setProductState() 访问成功  result=" + JSON.stringify(data));
                if (data[0]["code"] != 0) {
                    return callback({code: 1, failDesc: "商品服务处理失败"}, null);
                }
                return callback(null,{detail: "处理成功"});
            });
        } else {
            callback("参数非法", null);
        }
    }
}

module.exports = Product;
