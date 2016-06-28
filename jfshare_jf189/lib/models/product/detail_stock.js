/**
 * Created by lenovo on 2015/10/14.
 */
var detailStock = function(){
};

detailStock.prototype.dimstocks = null;//商品库存属性的结果信息
detailStock.prototype.skuInfos = null;//商品库存属性的结果信息
detailStock.prototype.SKUResult = {}; //Sku最后的组合map结果信息
//解析商品中的sku
//TO
//{
//    "stockTotal":{"curPrice":"22.00","orgPrice":"30.00","sellerClassNum":null,"shelf":null,"minCurPrice":"11.22","maxCurPrice":"22.33","minOrgPrice":"11.33","maxOrgPrice":"33.33"},
//    "stockItems":{"2;103":{"curPrice":"11.22","orgPrice":"11.33","sellerClassNum":null,"shelf":null},
//                  "2;101":{"curPrice":"22.33","orgPrice":"33.33","sellerClassNum":null,"shelf":null},
//                  "5;103":{"curPrice":"12.12","orgPrice":"13.13","sellerClassNum":null,"shelf":null}}
//}
detailStock.prototype.parseProductSku = function(productSku, storehouseId) {
    //0.清除历史数据
    this.dimstocks = null;
    this.SKUResult = {};

    if (productSku == null) {
        console.error("获取商品sku信息为空，导致dimstocks为空！");
        return this.dimstocks;
    }
    this.dimstocks = {};

    //1.组织sku总
    var stockTotal = {};
    //sku item fields
    stockTotal.curPrice = productSku.curPrice;
    stockTotal.orgPrice = productSku.orgPrice;
    stockTotal.sellerClassNum = productSku.sellerClassNum;
    stockTotal.shelf = productSku.shelf;

    //未设置sku
    if (productSku.skuItems == null) {
        this.dimstocks["stockTotal"] = stockTotal;
        return this.dimstocks;
    } else {
        //sku total item fields
        stockTotal.minCurPrice = productSku.minCurPrice;
        stockTotal.maxCurPrice = productSku.maxCurPrice;
        stockTotal.minOrgPrice = productSku.minOrgPrice;
        stockTotal.maxOrgPrice = productSku.maxOrgPrice;
        this.dimstocks["stockTotal"] = stockTotal;
    }

    //2.组织sku data集合
    var stockItems = {};
    for (var i in productSku.skuItems) { //skuItem   1-2:100-103
        var skuItem = productSku.skuItems[i];
        if(skuItem.storehouseId !== storehouseId) {
            continue;
        }
        var stockKey = this.getSkuPropKey(skuItem.skuNum);

        //sku item fields
        var stockProp = {};
        stockProp.curPrice = skuItem.curPrice;
        stockProp.orgPrice = skuItem.orgPrice;
        stockProp.sellerClassNum = skuItem.sellerClassNum;
        stockProp.shelf = skuItem.shelf;
        //stockProp.vPicture = productSku["productSkuMap"][skuItem].vPicture;
        stockItems[stockKey] = stockProp;
    }
    this.dimstocks["stockItems"] = stockItems;
    this.skuInfos = productSku.skuItems;
}

//填充商品中的sku库存字段
//TO
//{
//    "stockTotal":{"curPrice":"22.00","orgPrice":"30.00","sellerClassNum":null,"shelf":null,"minCurPrice":"11.22","maxCurPrice":"22.33","minOrgPrice":"11.33","maxOrgPrice":"33.33","total":23,"lockTotal":2},
//    "stockItems":{"2;103":{"curPrice":"11.22","orgPrice":"11.33","sellerClassNum":null,"shelf":null,"count":11,"lockCount":0},
//                  "2;101":{"curPrice":"22.33","orgPrice":"33.33","sellerClassNum":null,"shelf":null,"count":12,"lockCount":2},
//                  "5;103":{"curPrice":"12.12","orgPrice":"13.13","sellerClassNum":null,"shelf":null,"count":0,"lockCount":0}}
//}
detailStock.prototype.fillStockSku = function(stockSku, storehouseId) {
    if(stockSku == null) {
        console.error("fillStockSku参数stockSku为空！");
        return this.dimstocks;
    }
    if (this.dimstocks == null) {
        console.error("dimstocks为空，无法渲染库存！ 请检查parseProductSku设置的dimstocks是否可以使用")
        return  this.dimstocks;
    }
    if (this.dimstocks["stockTotal"] == null) {
        console.error("fillStockSku参数dimstocks.stockTotal为空！");
        return  this.dimstocks;
    }
    //1.组织stock总
    //sku total stock fields
    this.dimstocks["stockTotal"].total = stockSku.total;
    this.dimstocks["stockTotal"].lockTotal = stockSku.lockTotal;

    //2.组织stock data集合
    for (var i in stockSku.stockItems) { //stockItem   1-2:100-103
        var stockItem = stockSku.stockItems[i];
        if(stockItem.storehouseId !== storehouseId) {
            continue;
        }
        var stockKey = this.getSkuPropKey(stockItem.skuNum);
        if(stockKey === ""){
            continue;
        }
        //sku item stock fields
        this.dimstocks["stockItems"][stockKey].count = stockItem.count;
        this.dimstocks["stockItems"][stockKey].lockCount = stockItem.lockCount;
    }
    console.log("dimstocks=========" + JSON.stringify(this.dimstocks));
}

detailStock.prototype.getSkuPropKey = function(skuItem) {
    var temp1 = skuItem.split(':');
    var stockKey = "";
    for (var i=0;i<temp1.length;i++) {
        var temp2 = temp1[i].split('-');
        if (temp2.length == 2) {
            stockKey = stockKey + temp2[1] + ";";
        }
    }
    stockKey = stockKey.substr(0, stockKey.length-1);

    return stockKey;
}

//初始化维度选择的库存量结果集
detailStock.prototype.initSKU = function() {
    //if (this.dimstocks["SKUResults"]) {
    //    return;
    //}
    if (this.dimstocks["stockItems"] == undefined) {
        console.info("initSKU的stockItems为空！");
        return;
    }
    var i, j, skuKeys = this.getObjKeys(this.dimstocks["stockItems"]);
    for(i = 0; i < skuKeys.length; i++) {
        var skuKey = skuKeys[i];//一条SKU信息key
        var sku = this.dimstocks["stockItems"][skuKey];	//一条SKU信息value
        var skuKeyAttrs = skuKey.split(";"); //SKU信息key属性值数组

        //排下序，为了统一各种顺序选择为同一个key
        skuKeyAttrs.sort(function(value1, value2) {
            return parseInt(value1) - parseInt(value2);
        });

        //对每个SKU信息key属性值进行拆分组合
        var combArr = this.combInArray(skuKeyAttrs);
        for(j = 0; j < combArr.length; j++) {
            this.add2SKUResult(combArr[j], sku);
        }

        //结果集接放入this.SKUResult
        this.SKUResult[skuKeyAttrs.join(";")] = {
            //sku item fields
            count:sku.count,
            lockCount:sku.lockCount,

            curPrices:[sku.curPrice],
            orgPrices:[sku.orgPrice]
        }
    }
    this.dimstocks["SKUResults"] = this.SKUResult;
}

//获得对象的key
detailStock.prototype.getObjKeys = function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj)
        if (Object.prototype.hasOwnProperty.call(obj, key))
            keys[keys.length] = key;
    return keys;
}
/**
 * 从数组中生成指定长度的组合
 * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
 */
detailStock.prototype.combInArray = function(aData) {
    if(!aData || !aData.length) {
        return [];
    }

    var len = aData.length;
    var aResult = [];

    for(var n = 1; n < len; n++) {
        var aaFlags = this.getCombFlags(len, n);
        while(aaFlags.length) {
            var aFlag = aaFlags.shift();
            var aComb = [];
            for(var i = 0; i < len; i++) {
                aFlag[i] && aComb.push(aData[i]);
            }
            aResult.push(aComb);
        }
    }

    return aResult;
}

/**
 * 得到从 m 元素中取 n 元素的所有组合
 * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
 */
detailStock.prototype.getCombFlags = function(m, n) {
    if(!n || n < 1) {
        return [];
    }

    var aResult = [];
    var aFlag = [];
    var bNext = true;
    var i, j, iCnt1;

    for (i = 0; i < m; i++) {
        aFlag[i] = i < n ? 1 : 0;
    }

    aResult.push(aFlag.concat());

    while (bNext) {
        iCnt1 = 0;
        for (i = 0; i < m - 1; i++) {
            if (aFlag[i] == 1 && aFlag[i+1] == 0) {
                for(j = 0; j < i; j++) {
                    aFlag[j] = j < iCnt1 ? 1 : 0;
                }
                aFlag[i] = 0;
                aFlag[i+1] = 1;
                var aTmp = aFlag.concat();
                aResult.push(aTmp);
                if(aTmp.slice(-n).join("").indexOf('0') == -1) {
                    bNext = false;
                }
                break;
            }
            aFlag[i] == 1 && iCnt1++;
        }
    }
    return aResult;
}

//把组合的key放入结果集this.SKUResult
detailStock.prototype.add2SKUResult = function(combArrItem, sku) {
    var key = combArrItem.join(";");
    if(this.SKUResult[key]) {//SKU信息key属性·
        //sku item fields
        this.SKUResult[key].count += sku.count;
        this.SKUResult[key].lockCount += sku.lockCount;
        this.SKUResult[key].curPrices.push(sku.curPrice);
        this.SKUResult[key].orgPrices.push(sku.orgPrice);
    } else {
        this.SKUResult[key] = {
            //sku item fields
            count : sku.count,
            lockCount : sku.lockCount,

            curPrices : [sku.curPrice],
            orgPrices : [sku.orgPrice]
        };
    }
}

module.exports = detailStock;