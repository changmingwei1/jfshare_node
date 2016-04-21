
exports.slotImageList = function(req, res, next, type, data) {
    console.log('slotImage----view-----slotImageList');

    var typeStr = "广告位图片列表";
    if(type == 1){
        typeStr = "轮播" + typeStr;
    }
    if(type == 2){
        typeStr = "静态" + typeStr;
    }

    res.render("slotImage/slotImageList", { data:data,  pathDisplay:'none',type:type, typeStr:typeStr});
};


exports.slotImageOne = function(req, res, next, type, dotype, data) {
    console.log('slotImage----view-----slotImageOne  type = ' + type);

    var typeStr = "";
    var typeClass = "";

    if(dotype == "add"){
        typeStr += "添加";
        typeClass = "add";
    }else if(dotype == "update"){
        typeStr += "修改";
        typeClass = "update";
    }

    if(type == 1){
        typeStr += "轮播";
    }else{
        typeStr += "静态";
    }

    typeStr += "广告位图片";

    res.render("slotImage/slotImageOne", { data:data,  pathDisplay:'none', type:type, dotype:dotype, typeStr:typeStr, typeClass:typeClass});
};





