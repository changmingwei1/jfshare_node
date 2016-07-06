/**
 * Created by lenovo on 2015/10/12.
 */
//页面设定参数
var onceMinBuyLimit = '1'; //初始化单次最低购买数量
var amount; //购买数量
var currImg = 0; //当前展示主图id
var attrCfg; //sku所有维度信息map
var selectattsMap; //sku选中维度信息map
var formCfg = { //选择状态
    cls:{
        selected:'selected'
    },
    system:{
        txt:{
            normal:"非常抱歉，系统繁忙，请稍候重试"
        }
    }
}

//页面商品参数
var productName=null;
var viceName=null;
var onceMaxBuyLimit = 0; //初始化单次最高购买数量，0为无限制
var imgKey=null;
var img_src=new Array();
var skuDims=null;
var productAttr=null;
var activeState = null; //商品状态
var subjectId = null;
var score2cashAmount = 0;  //100分尊享可低金额
var productInfo = null;
var skuInfos = null;

//页面库存参数
var dimstocks=null; //商品库存属性、库存量map的结果信息
/**
 * 异步渲染页面各模块动态数据
 * 商品基本信息、库存、详情
 */
function rendData() {
    //渲染省份下拉列表
    renderProvinceInfo(provinceId);
    $.ajax({
        url: empty(snapshotId) ? ("/product/baseinfo/" + productId) : ("/product/snapshot/baseinfo/" + snapshotId),
        type: 'get',
        data:{ssid:$("#ssid").val()},
        dataType:'json',
        success: function (data) {
            productInfo = data;
            productId = data['productId'];
            productName = data['productName'];
            viceName = data['viceName'];
            if (!empty(data['maxBuyLimit'])) {
                onceMaxBuyLimit = data['maxBuyLimit'];
            }
            activeState = data.activeState;
            imgKey = data['imgKey'];
            img_src =imgKey.split(',');
            if (!empty(data['skuTemplate'])) {
                skuDims = JSON.parse(data['skuTemplate'])["sku"];//eval(data['skuTemplate']);
            }
            productAttr = eval(data['attribute']);
            subjectId = data.subjectId;

           score2cashAmount = Number(data.thirdExchangeRate);

            renderBaseInfo();
            renderBaseParam();
            renderSkuDims();

            //如果未传仓库id,说明是页面首次加载触发, 否则是用户重新选择了城市触发
            if(storehouseId<0) {
                //通过省份id、商品id、仓库列表取仓库id， 返回0代表不在配送范围内
                storehouseId = getStorehouseId(productInfo.sellerId, productInfo.productId, productInfo.storehouseIds, provinceId);
            }

            if(storehouseId == 0) {
                //显示无货
                outStockControl();
            }
            var reqStorehouseId = (storehouseId == 0)? productInfo.storehouseIds.split(",", 2)[0]:storehouseId;
            if (empty(snapshotId)) {
                //异步加载Sku相关
                $.ajax({
                    url: "/product/skuinfo/" + productId + "/" + reqStorehouseId + "?activeState=" + isUserCanBuy() + "&rd=" + Math.random() ,
                    type: 'get',
                    data:{ssid:$("#ssid").val()},
                    dataType:'json',
                    success: function (data) {
                        if (data.status == 200 || data.status == 501) {
                            dimstocks = eval(data.dimstocks);
                            skuInfos = data.skuInfos;
                            renderPriceStockInit();
                            //console.log(dimstocks);
                            if (data.status == 501) { //获取库存失败
                                alert(data.msg);
                            } else if (isUserCanBuy()) {
                                renderSkuInitStock();
                                renderSkuSelectStock();
                            }
                        } else {
                            alert(data.msg);
                        }
                    }
                })
            } else {  //快照直接取sku字段
                //异步组织Sku相关
                $.ajax({
                    url: "/product/snapshot/skuinfo/" + JSON.stringify(data['productSku']),
                    type: 'get',
                    data:{ssid:$("#ssid").val()},
                    dataType:'json',
                    success: function (data) {
                        if (!empty(data)) {
                            dimstocks = eval(data);
                            //console.log(dimstocks);
                            renderPriceStockInit();
                        }
                    }
                });
            }

            //alert(data['detailKey']);
            //异步加载详情
            if (!empty(data['detailKey'])) {
                $.ajax({
                    url: "/product/detailinfo/" + data['detailKey'],
                    type: 'get',
                    async: false,
                    data:{ssid:$("#ssid").val()},
                    dataType:'json',
                    success: function (data) {
                        //skuInfos = eval(data);
                        $("#divTab_1").html(data);
                    }
                })
            }

            renderAttributeInfo();
            renderScrollul();

            contentLoaded(resizeIfr);
        }
    })
}

//region 渲染基本信息
/**
 * 渲染商品基本信息
 */
function renderBaseInfo(){
    $(document).attr("title",productName);
    //create_top_subject(subjectId);
    $("#productName").html("<p>" + productName + "</p>");
    $("#viceName").html("<p>" + viceName + "</p>");
    var item = "";
    for(var j=0;j<img_src.length;j++){
        if(img_src[j]!="") {
            item = item+ "<div class=\"each\">";
            item = item+ " <a id=\"img40_" + j + "\" href=\"javascript:void(0)\"";
            item = item+ "  ref1=\"" +img_bath + getZoomImg(img_src[j], "350x350")+ "\" ref2=\"" +img_bath + getZoomImg(img_src[j], "800x800")+ "\">";
            item = item+ "<img alt=\""+ productName +"\" src=\"" +img_bath + img_src[j]+ "\"/>";
            item = item+ " </a>";
            item = item+ "</div>";
        }
    }
    $("#scrollul").html(item);

    var itemBig = "";
    itemBig = itemBig+ " <a href=\"" +img_bath + getZoomImg(img_src[0], "800x800")+ "\" id=\"midImgLink\" class=\"jqzoom\" title=\""+ productName +"\">";
    itemBig = itemBig+ "<img id=\"midImg\" alt=\""+ productName +"\" src=\"" +img_bath + getZoomImg(img_src[0], "350x350")+ "\"/>";
    itemBig = itemBig+ " </a>";
    $("#bigpicdiv").html(itemBig);
}

/**
 * 渲染选中sku图片
 * @param selectedSkuImg
 */
function renderSkuImg(selectedSkuImg) {
    if (!empty(selectedSkuImg)) {
        var itemBig = "";
        itemBig = itemBig + " <a href=\"" + img_bath + getZoomImg(selectedSkuImg.image, "800x800") + "\" id=\"midImgLink\" class=\"jqzoom\" title=\"" + selectedSkuImg.normal + "\">";
        itemBig = itemBig + "<img id=\"midImg\" alt=\"" + selectedSkuImg.normal + "\" src=\"" + img_bath + getZoomImg(selectedSkuImg.image, "350x350") + "\"/>";
        itemBig = itemBig + " </a>";
        $("#bigpicdiv").html(itemBig);
        renderScrollul();
    } else {
        var itemBig = "";
        itemBig = itemBig + " <a href=\"" + img_bath + getZoomImg(img_src[0], "800x800") + "\" id=\"midImgLink\" class=\"jqzoom\" title=\"" + productName + "\">";
        itemBig = itemBig + "<img id=\"midImg\" alt=\"" + productName + "\" src=\"" + img_bath + getZoomImg(img_src[0], "350x350") + "\"/>";
        itemBig = itemBig + " </a>";
        $("#bigpicdiv").html(itemBig);
        renderScrollul();
    }
}

/**
 * 加载页面参数
 */
function renderBaseParam() {
    amount = tools.getObj("amount");
    if (!empty(amount)) {
        amount.value = onceMinBuyLimit;
    }
    $('#productId').val(productId);
    renderAmountIcon();
}
//endregion 渲染基本信息

//region sku相关
/**
 * 渲染sku维度项页面元素
 * demo:
 * [{"key":{"id":450000,"value":"颜色new"},"values":[{"id":1070287,"value":"红色new","image":"0.07371132005937397.jpg"},{"id":1070285,"value":"白色new","image":''}]},
 * {"key":{"id":450001,"value":"规格new"},"values":[{"id":1070289,"value":"xl（标准)"},{"id":1070290,"value":"m(标准)"}]}]

 TO

      <div class="ColorTxt">
         <label id="attr_450000_name" >颜色：</label>
         <span id="attr_450000_selectDiv">
         <a href='javascript:void(0)' attr="attr_450000" id="sv_1070287">喜洋洋<img  src='/templates/merchant/template_jfshare_xj/styles/color_1/images/detail_icon008.gif' class='zIndexPic' id="sv_1070287_img" style="display:none;"></a>
         <a href='javascript:void(0)' attr="attr_450000" id="sv_1070285">爱心兔<img  src='/templates/merchant/template_jfshare_xj/styles/color_1/images/detail_icon008.gif' class='zIndexPic' id="sv_1070285_img" style="display:none;"></a>
         <a href='javascript:void(0)' attr="attr_450000" id="sv_1070284">中国行<img  src='/templates/merchant/template_jfshare_xj/styles/color_1/images/detail_icon008.gif' class='zIndexPic' id="sv_1070284_img" style="display:none;"></a>
         <a href='javascript:void(0)' attr="attr_450000" id="sv_1070286">老鼠爱大米<img  src='/templates/merchant/template_jfshare_xj/styles/color_1/images/detail_icon008.gif' class='zIndexPic' id="sv_1070286_img" style="display:none;"></a>
         <a href='javascript:void(0)' attr="attr_450000" id="sv_1070288">快乐史努比<img  src='/templates/merchant/template_jfshare_xj/styles/color_1/images/detail_icon008.gif' class='zIndexPic' id="sv_1070288_img" style="display:none;"></a>
         <div class="clear"></div>
         </span>
     </div>
     <input type="hidden" name="attr_450000_value" id="attr_450000_value">
     <input type="hidden" name="attr_div" value="attr_450000">
     <div class="ColorTxt">
         <label id="attr_450001_name" >规格：</label>
         <span id="attr_450001_selectDiv">
         <a href='javascript:void(0)' attr="attr_450001" id="sv_1070289">1-1.35m单人床<img  src='/templates/merchant/template_jfshare_xj/styles/color_1/images/detail_icon008.gif' class='zIndexPic' id="sv_1070289_img" style="display:none;"></a>
         <div class="clear"></div>
         </span>
     </div>
     <input type="hidden" name="attr_450001_value" id="attr_450001_value">     //value值用于存储选中的sku项id，如value="sv_1070289"
     <input type="hidden" name="attr_div" value="attr_450001">   //用于获取维度id信息,如attr_450001

     <input type="hidden" value="attr_450000,attr_450001" name="attrs" id="attrs"/>  //所有维度
 */
function renderSkuDims() {
    //alert(skuDims);
    //alert(skuDims[0]["values"][0]["id"]);
    if (empty(skuDims)) {
        return;
    }

    var dimsDivs = new StringBuffer();
    var dimAttrsVal = "";
    for(var i=0;i<skuDims.length;i++) {
        dimsDivs.append("<div class=\"ColorTxt\">");
        dimsDivs.append(" <label id=\"attr_"+ skuDims[i]["key"]["id"] +"_name\" >" + skuDims[i]["key"]["value"] + "</label>");

        dimsDivs.append("<span id=\"attr_" + skuDims[i]["key"]["id"] + "_selectDiv\">");
        for (var dimsnumMap in skuDims[i]["values"]) { //[{"id":2,"value":"红色new","image":"0.07371132005937397.jpg"},{"id":5,"value":"白色new","image":''}]
            var skuImg = skuDims[i]["values"][dimsnumMap]["image"];
            //alert("第" + i + "维度属性：" + dimsnumMap + "----"  + skuDims[i]["values"][dimsnumMap]["id"] + "----" + skuDims[i]["values"][dimsnumMap]["value"] + "----" + skuDims[i]["values"][dimsnumMap]["image"]); //{2:{"s_id":2,"s_value":"红色","s_image":"0.5369955052156001.jpg"}}
            var skuBigImg = (!empty(skuImg) && !empty(skuDims[i]["values"][dimsnumMap]["isReplace"]) &&  (skuDims[i]["values"][dimsnumMap]["isReplace"] == "1")) ? skuImg : ""; //显示sku大图
            dimsDivs.append("<a href=\"javascript:void(0)\" attr=\"attr_" + skuDims[i]["key"]["id"] + "\" id=\"sv_" + skuDims[i]["values"][dimsnumMap]["id"] + "\" title=\"" + skuDims[i]["values"][dimsnumMap]["value"] +  "\" bkimage=\"" + skuBigImg + "\" ");  //class=\"sku\"
            if (!empty(skuImg)) {
                dimsDivs.append(" style=\"background: url(" + img_bath + getZoomImg(skuImg, "25x25") + ") no-repeat center center;width:24px;height:24px;padding:0;\" class=\"opacity_transparent\">");
            } else {
                dimsDivs.append(" class=\"opacity_transparent\"");
                dimsDivs.append(">");
                dimsDivs.append(skuDims[i]["values"][dimsnumMap]["value"]);
            }
            dimsDivs.append("<img  src='/templates/merchant/template_jfshare_xj/styles/color_1/images/detail_icon008.gif' class='zIndexPic' id=\"sv_" + skuDims[i]["values"][dimsnumMap]["id"] + "_img\" style=\"display:none;\">");
            dimsDivs.append("</a>");
        }
        dimsDivs.append("<div class=\"clear\"></div>"); //占位符
        dimsDivs.append("</span>");
        dimAttrsVal = dimAttrsVal+ "attr_" + skuDims[i]["key"]["id"] + ",";

        dimsDivs.append("</div>");
        dimsDivs.append("<input type=\"hidden\" name=\"attr_" + skuDims[i]["key"]["id"] + "_value\" id=\"attr_" + skuDims[i]["key"]["id"] + "_value\">");
        dimsDivs.append("<input type=\"hidden\" name=\"attr_div\" value=\"attr_" + skuDims[i]["key"]["id"] +"\">");
    }
    dimAttrsVal = dimAttrsVal.substr(0, dimAttrsVal.length-1);
    dimsDivs.append("<input type=\"hidden\" value=\"" + dimAttrsVal + "\" name=\"attrs\" id=\"attrs\"/>");
    //alert(dimsDivs);$
    $("#showsku").html(dimsDivs.toString());
    //console.log($("#showsku").html());
}

/**
 * 渲染初始sku项的库存状态
 */
function renderSkuInitStock() {
    if (empty(dimstocks["stockItems"])) {
        return;
    }
    tools.getObj("selectedSkuText").innerHTML = "请选择您要的商品信息";

    //1. 初始循环sku项，无库存标记为灰色
    $('a[id^="sv_"]').each(function () {
        var s_id = getSkuId(this.id);  //sku item s_id
        //无库存
        if(empty(dimstocks["SKUResults"][s_id]) || dimstocks["SKUResults"][s_id].count == 0) {
            //$(this).attr("style", empty($(this).attr("style")) ? "color:#DDDDDD" : ($(this).attr("style").toString().replace("color:#000000", "").replace("color:#DDDDDD", "") + " color:#DDDDDD"));
            appendColorStyle($(this), 1);
        } else {
            appendColorStyle($(this), 0);
        }
    });
}

/**
 * 渲染选择sku库存状态(点击sku项的监听事件注册)
 */
function renderSkuSelectStock() {
    if (empty(dimstocks["stockItems"])) {
        return;
    }
    //组织所有维度map
    var v = tools.getObj("attrs");
    if (v && v.value) {
        attrCfg = {};
        var value = v.value; //dims data:   attr_450000,attr_450001
        strValues = value.split(",");
        for (var k = 0; k < strValues.length; k++) {
            if (tools.getObj(strValues[k] + "_name")) {  //dims label attr_450001_name
                var normal = tools.getObj(strValues[k] + "_name").innerHTML.replace("：", "");
                attrCfg[strValues[k]] = {id:strValues[k],normal:normal}  //attrCfg["attr_450001"] = {id:"attr_450001", normal:"规格"}
            }
        }
    }

    //遍历维度 attr_450000,attr_450001
    for (var m in this.attrCfg) {
        //添加所有sku选项点击监听事件
        jQuery("#" + m + "_selectDiv a").click(function() { //每个维度span中的<a>标签项
            var v = tools.getObj(jQuery(this).attr("attr") + "_value"); //选择的id存储
            //样式设置
            if (jQuery(this).attr("class") == formCfg.cls.selected) { //之前已选中
                jQuery("#" + jQuery(this).attr("attr") + "_selectDiv a").removeClass(formCfg.cls.selected);
                jQuery("#" + jQuery(this).attr("attr") + "_selectDiv img.zIndexPic").attr("style", "display:none;");
                v.value = "";
            } else { //之前未被选中
                var color = jQuery("#"+this.id).css("opacity");
                if(color=="rgb(221, 221, 221)" || color=="#DDDDDD" || color=="0.3"){ //灰色不让选中
                    return;
                }
                jQuery("#" + jQuery(this).attr("attr") + "_selectDiv a").removeClass(formCfg.cls.selected);
                jQuery("#" + jQuery(this).attr("attr") + "_selectDiv img.zIndexPic").attr("style", "display:none;");
                jQuery("#" + jQuery(this).attr("id") + "_img").attr("style", "display:;");
                jQuery(this).addClass(formCfg.cls.selected);
                v.value = this.id;
            }
            skuSelectEvent(attrCfg);
        });
        if (jQuery("#" + m + "_selectDiv").attr("class") == "selectBox2") {
            jQuery("#" + m + "_selectDiv a").hover(function() {
                tools.getObj(this.id + "_tip").style.display = "block";
            }, function() {
                tools.getObj(this.id + "_tip").style.display = "none";
            });
        }
        var v = tools.getObj(m + "_value");
        if (v != null) {
            v.value = "";
        }
    }
}

/**
 * sku选中事件
 * @param attslist 维度map
 *  1、选中项 id1;id2;id3 有序形式， 无库存则标记为灰色；否则去掉灰色，为了加载价格区间及库存
 *  2、未选中维度， 标记同已选择的sku项组合的库存状态
 *  3、 选中维度，标记同已选择的非本维度的sku项组合的库存状态
 *  4、提示已选择的sku项名称, 选中后通过id查找名称
 *  5、若sku有图片，则渲染大图
 */
function skuSelectEvent(attslist){
    var selectSvMap = {}; //选中项id集合 如{"sv_1070287":"{attr:"attr_450000", normal:"红色"}","sv_1070289":"{attr:"attr_450001", normal:"xxl"}"}
    selectattsMap = {}; //选中的维度集合，  如{"attr_450000":"{id:"attr_450000", normal:"颜色"}","attr_450001":"{id:"attr_450001", normal:"规格"}"}
    var selectIds = []; //选择的项id数组
    var attrdivStr = ""; //所有sku维度串，如attr_450000,attr_450001,attr_450002
    var attrdiv = document.getElementsByName("attr_div"); //所有sku的维度对象
    for(var n=0;n<attrdiv.length;n++){
        attrdivStr+=attrdiv[n].value+",";
    }
    var attrDiv = attrdivStr.split(","); //所有sku维度数组 [attr_450000,attr_450001,attr_450002]
    //遍历所有维度，组织被选中项
    for (var m in attslist) {
        var v = tools.getObj(m + "_value");
        if (v.value) { //被选中的sku项id, sv_1070289
            selectIds.push(getSkuId(v.value));
            selectSvMap[v.value] = {attr:m, normal:tools.getObj(v.value).title, image: $("#"+v.value).attr("bkimage")};
            selectattsMap[m] = attrCfg[m];
        }
    }

    //选中项 id1;id2;id3 有序形式， 无库存则标记为灰色，去掉价格; 否则去掉灰色，为了加载价格区间及库存
    selectIds.sort(function(value1, value2) {
        return parseInt(value1) - parseInt(value2);
    });
    var selectIdsKey = selectIds.join(';');
    if(empty(dimstocks["SKUResults"][selectIdsKey]) || dimstocks["SKUResults"][selectIdsKey].count == 0) {
        appendColorStyle($(this), 1);
        renderPriceStockInit();
    } else {
        appendColorStyle($(this), 0);
        var curPrices = dimstocks["SKUResults"][selectIdsKey].curPrices;
        var maxCurPrice = Number(Math.max.apply(Math, curPrices)).toFixed(2);
        var minCurPrice = Number(Math.min.apply(Math, curPrices)).toFixed(2);
        var orgPrices = dimstocks["SKUResults"][selectIdsKey].orgPrices;
        var maxOrgPrice = Number(Math.max.apply(Math, orgPrices)).toFixed(2);
        var minOrgPrice = Number(Math.min.apply(Math, orgPrices)).toFixed(2);
        var count = dimstocks["SKUResults"][selectIdsKey].count;

        $('#orgPrice').text(Number(maxOrgPrice) > Number(minOrgPrice) ? minOrgPrice + "～" + maxOrgPrice : maxOrgPrice);
        if(score2cashAmount > 0) {  //尊享商品
            $('#showJifen').text(" + 100积分" + (maxCurPrice == minCurPrice ? " / ¥" + minCurPrice : ""));
            maxCurPrice = Number(Number(maxCurPrice) - score2cashAmount/100).toFixed(2);
            minCurPrice = Number(Number(minCurPrice) - score2cashAmount/100).toFixed(2);
            $('#curPrice').text("¥" + (Number(maxCurPrice) > Number(minCurPrice) ? minCurPrice + "～" + maxCurPrice : maxCurPrice));
        } else {
            $('#curPrice').text((Number(maxCurPrice) > Number(minCurPrice) ? Number(Number(minCurPrice)*100).toFixed(0) + "～" + Number(Number(maxCurPrice)*100).toFixed(0) : Number(Number(maxCurPrice)*100).toFixed(0)) + "积分");
        }

        $('#stock').val(count);
        $('#stockShow').text("（库存剩余 " + count + " 件）");
    }
    //alert("当前style=" + $(this).attr("style"));

    $('a[attr^="attr_"]').each(function () {
        var attr = $(this).attr("attr");  //sku item dim    attr_450000
        //未选中维度， 标记同已选择的sku项组合的库存状态
        if(empty(selectattsMap[attr])) {
            //alert(attr + "，此层id未被选中" + this.id);
            var s_id = getSkuId(this.id);
            var toIds = empty(selectIdsKey) ? s_id : (selectIdsKey + ';' + s_id);  //待判定sku项 + 已选中sku项组合
            //alert("待判断组合id为" + toIds);
            var toIdArray = toIds.split(";");
            toIdArray.sort(function(value1, value2) {
                return parseInt(value1) - parseInt(value2);
            });
            toIds = toIdArray.join(';');

            //无库存
            if(empty(dimstocks["SKUResults"][toIds]) || dimstocks["SKUResults"][toIds].count == 0) {
                appendColorStyle($(this), 1);
            } else {
                appendColorStyle($(this), 0);
            }
        } else {
            //选中维度，标记同已选择的非本维度的sku项组合的库存状态
            if(empty(selectSvMap[this.id])) {
                //找到此非选中项所在维度的选中项,排除
                var v = tools.getObj(attr + "_value");
                if (v != null) {
                    var toIdArray  = [];
                    var curDimSelectedSId = getSkuId(v.value);
                    for(var item in selectIds) {
                        if (selectIds[item] != curDimSelectedSId) {
                            toIdArray.push(selectIds[item]);
                        }
                    }
                    toIdArray.push(getSkuId(this.id));
                    toIdArray.sort(function(value1, value2) {
                        return parseInt(value1) - parseInt(value2);
                    });
                    var toIds = toIdArray.join(';');   //待判定sku项 + 排除该项所在维度项的已选中sku项组合

                    //无库存
                    if(empty(dimstocks["SKUResults"][toIds]) || dimstocks["SKUResults"][toIds].count == 0) {
                        appendColorStyle($(this), 1);
                    } else {
                        appendColorStyle($(this), 0);
                    }
                }
            }
        }
    });

    var selectSkuNum = new StringBuffer(); //选中的skuNum
    //选中提示
    var count = 0;
    var selectedtext = new StringBuffer();
    //selectedtext.append("您已选择：");
    var selectedSkuImg = null; //选中sku图片
    for(var svItem in selectSvMap) { //{"sv_1070287":"{attr:"attr_450000", normal:"红色", image:"xxx.jpg"}","sv_1070289":"{attr:"attr_450001", normal:"xxl"}"}
        if (count > 0) {
            selectedtext.append(",");
            selectSkuNum.append(":");
        }
        selectedtext.append(selectSvMap[svItem]["normal"]);
        selectSkuNum.append(getSkuDim(selectSvMap[svItem]["attr"]) + "-" + getSkuId(svItem));
        if (!empty(selectSvMap[svItem]["image"])) {
            selectedSkuImg = {attr:selectSvMap[svItem]["attr"], normal:selectSvMap[svItem]["normal"], image:selectSvMap[svItem]["image"]};
        }
        count ++;
    }
    tools.getObj("selectedSkuText").innerHTML = selectedtext.toString().length > 0 ? "您已选择：" + selectedtext.toString() : "";
    $("#skuNum").val(selectSkuNum.toString().length > 0 ? selectSkuNum.toString() : "");
    //alert(selectSkuNum.toString());
    renderAmountIcon();

    renderSkuImg(selectedSkuImg);
}

/**
 * 初始化价格及库存显示
 */
function renderPriceStockInit() {
    var initMaxCurPrice = 0, initMinCurPrice = 0, initMaxOrgPrice = 0, initMinOrgPrice = 0;
    if (empty(dimstocks["stockItems"])) {
        initMinCurPrice = Number(dimstocks["stockTotal"].curPrice).toFixed(2);
        initMaxCurPrice = initMinCurPrice;
        initMinOrgPrice = Number(dimstocks["stockTotal"].orgPrice).toFixed(2);
        initMaxOrgPrice = initMinOrgPrice;

        $("input[name='curPrice']").val(initMinCurPrice);
        $("input[name='orgPrice']").val(initMinOrgPrice);
    } else {
        initMinCurPrice = Number(dimstocks["stockTotal"].minCurPrice).toFixed(2);
        initMaxCurPrice = Number(dimstocks["stockTotal"].maxCurPrice).toFixed(2);
        initMinOrgPrice = Number(dimstocks["stockTotal"].minOrgPrice).toFixed(2);
        initMaxOrgPrice = Number(dimstocks["stockTotal"].maxOrgPrice).toFixed(2);
    }

    var stock = empty(dimstocks["stockTotal"].total) ? 0 : dimstocks["stockTotal"].total;

    //金额大于1元 + 100积分换购
    $('#orgPrice').text(Number(initMaxOrgPrice) > Number(initMinOrgPrice) ? initMinOrgPrice + "～" + initMaxOrgPrice : initMaxOrgPrice);

    if(score2cashAmount > 0) { //尊享商品
        $('#showJifen').text(" + 100积分" + (initMaxCurPrice == initMinCurPrice ? " / ¥" + initMaxCurPrice : ""));
        initMaxCurPrice = Number(Number(initMaxCurPrice) - score2cashAmount/100).toFixed(2);
        initMinCurPrice = Number(Number(initMinCurPrice) - score2cashAmount/100).toFixed(2);
        $('#curPrice').text("¥" + (Number(initMaxCurPrice) > Number(initMinCurPrice) ? initMinCurPrice + "～" + initMaxCurPrice : initMaxCurPrice));
    } else {
        $('#curPrice').text((Number(initMaxCurPrice) > Number(initMinCurPrice) ? Number(Number(initMinCurPrice)*100).toFixed(0) + "～" + Number(Number(initMaxCurPrice)*100).toFixed(0) : Number(Number(initMaxCurPrice)*100).toFixed(0)) + "积分");
    }
    $('#stock').val(stock);
    $('#stockShow').text("（库存剩余 " + stock + " 件）");

    if (!empty(snapshotId)) { //交易快照
        $("#buysnap").show();
        $("#a_productdetail").attr("href", "/product/" + productId);
        $("#choose").hide();
    } else if (!empty(state) && state=="preview") {  //商品预览
        $("#buynow").val("商品预览");
        $("#buynow").show();
        $("#cart").hide();
    } else if (!isUserCanBuy()) { //不可卖
        $("#buynow").val("已下架");
        $("#buynow").show();
        $("#cart").hide();
    }else{
        $("#buynow").show();
        $("#cart").show();
        if (stock > 0) {
            $("#buynow").attr("class", "buynow").removeAttr("disabled");
            $("#cart").attr("class", "cart").removeAttr("disabled");
        }
    }
}

/**
 * 通过Sku项的id获取sku的id
 * @param aId 如 sv_1070287
 * @returns {string}  1070287
 */
function getSkuId(aId) {
    if (empty(aId)) {
        return "";
    }

    return aId.substr(3, aId.length);
}
/**
 * 通过Dim项的id获取维度id
 * @param aId 如 attr_450000
 * @returns {string} 450000
 */
function getSkuDim(aId) {
    if (empty(aId)) {
        return "";
    }

    return aId.substr(5, aId.length);
}
//endregion sku相关

/**
 * 渲染商品属性
 *  <table width="100%" border="0" cellspacing="0" cellpadding="0">
     <tr class="tr1">
     </tr>
     <!-- 填充 商品自定义属性-->
     <tr class="tr2">
         <td class="td1">型号</td>
         <td class="td2">HM-7157</td>
     </tr>
     <tr class="tr2">
         <td class="td1">颜色分类</td>
         <td class="td2">原色</td>
     </tr>
 </table>
 */
function renderAttributeInfo() {
    if (empty(productAttr)) {
        return;
    }

    var attrsDiv = new StringBuffer();
    attrsDiv.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
    attrsDiv.append("<tr class=\"tr1\">");
    attrsDiv.append("</tr>");
    for(var item in productAttr) {
        //alert(productAttr[item]["name"]);
        attrsDiv.append("<tr class=\"tr2\">");
        attrsDiv.append("<td class=\"td1\">" + productAttr[item]["name"] + "</td>");
        attrsDiv.append("<td class=\"td2\">" + productAttr[item]["value"] + "</td>");
        attrsDiv.append("</tr>");
    }
    attrsDiv.append("</table>");
    $("#divTab_2").html(attrsDiv.toString());
}

/**
 * 渲染图片轮播、缩放
 */
function renderScrollul() {
    if (jQuery("#scrollul a").size() > 1) {
        for (var i = 0; i < jQuery("#scrollul a").size(); i++) {
            var img = new Image();
            img.src = jQuery("#img40_" + jQuery("#scrollul a")[i].id.substring(6)).attr("ref2");
        }
        jQuery("#scrollul a").mousemove(function(event) {
            var id = this.id.substring(6)
            if (currImg != id) {
                if ($.browser.msie) {
                    var imgHeight = (52 - jQuery("#img_" + id).attr("height")) / 52;
                    var img = Math.round(imgHeight * 330 / 2);
                    jQuery("#whole").css("height", img);
                }
                jQuery("#midImg").attr("src", jQuery("#img40_" + id).attr("ref1"));
                jQuery("#midImgLink").attr("href", jQuery("#img40_" + id).attr("ref2"));
                jQuery("#img40_" + id).attr("class", "cur");

                jQuery("#img40_" + currImg).attr("class", "");
                currImg = id;
            }
        });
    }
    var inputs = jQuery("#inputDiv .selectBox a");
    var options = {
        zoomType: 'standard',
        zoomWidth:352,
        zoomHeight:352,
        lens:true,
        xOffset: 10,        //zoomed div default offset
        yOffset: 0,
        position:"right",
        title:false
    }
    jQuery("#bigpicdiv .jqzoom").jqzoom(options);
    try {
        var rightarray = new Array();
        var l = 0;
        var len = jQuery("#scrollul div.each").length;
        var t = 63 * len;
        var group = len / 5;
        var m = 0;
        var mod = len % 5;
        for (var i = 0; i < group; i++) {
            if (i == 0) {
                rightarray[i] = 0;
                var total = 308;
            } else {
                total = total + 308;
                if (total > t) {
                    if (len % 5 == 0)
                        rightarray[i] = 308 * i;
                    else {
                        rightarray[i] = 308 * i - 63 * (5 - mod);
                    }

                } else {
                    rightarray[i] = 308 * i;
                }
            }

        }
    } catch(e) {
        alert(e.description)
    }
}

//region 购买数量相关
/**
 * 购买数量聚焦事件校验
 * @param value 购买数量
 * @param cartAmount 购物车中已购数量
 * @returns {boolean}
 */
function checkAmount(value, cartAmount) {
    if (empty(value) || isNaN(value)) {
        value = onceMinBuyLimit;
    }
    value = Math.floor(Number($.trim(value))); //.toFixed(0)
    $("#amount").val(value);
    tools.getObj("selectedAmountText").innerHTML = "";
    //alert(value+";");
    onceMinBuyLimit = Number(onceMinBuyLimit);
    onceMaxBuyLimit = Number(onceMaxBuyLimit);
    var cartCount = Number(cartAmount);
    var nowStock = Number($('#stock').val()) - cartCount;
    //alert("当前库存为" + nowStock);
    var buyMax = onceMaxBuyLimit>0 ? Math.min(onceMaxBuyLimit, nowStock) : nowStock;  //最大可购量（此处先不校验购物车已选数量）

    var cartTip = cartCount > 0 ? "（购物车已选" + cartCount + "件）":"";
    if (value > buyMax) {
//      alert("库存不足，仅剩" + buyMax + "个可以订购!");
        tools.getObj("selectedAmountText").innerHTML = "购买数量超过" + (buyMax == onceMaxBuyLimit ? "限购":"库存" + cartTip) + "数量";
        if (cartCount <= 0) {
            $("#amount").val(buyMax);
        } else {
            $("#amount").focus();
        }
        return false;
    } else if (value < onceMinBuyLimit) {
        tools.getObj("selectedAmountText").innerHTML = "购买数量起订为" + onceMinBuyLimit + "件";
        if (cartCount <= 0) {
            $("#amount").val(onceMinBuyLimit);
        } else {
            $("#amount").focus();
        }
        return false;
    } else if (value == buyMax) {
        tools.getObj("selectedAmountText").innerHTML = "当前购买为最大可购买数量" + cartTip;
    }

    renderAmountIcon();

    return true;
}

/**
 * 递增购买数量
 * @returns {boolean}
 */
function amountIncrease() {
    amount =  Number($("#amount").val());
    checkAmount(amount + 1, 0);
}

/**
 * 递减购买数量
 */
function amountDecrease() {
    amount =  Number($("#amount").val());
    checkAmount(amount - 1, 0);
}

/**
 * 渲染购买数量增减按钮是否可用
 * 场景：1、页面加载 2、购买数量变化 3、sku选择时库存变化
 */
function renderAmountIcon() {
    //alert($("#amount_decrease").attr("style"));
    amount = Number($("#amount").val());
    onceMinBuyLimit = Number(onceMinBuyLimit);
    onceMaxBuyLimit = Number(onceMaxBuyLimit);
    appendColorStyle($("#amount_decrease"), (amount <= onceMinBuyLimit ? 1 : 0));
    var nowStock = Number($('#stock').val());
    var buyMax = onceMaxBuyLimit>0 ? Math.min(onceMaxBuyLimit, nowStock) : nowStock;  //最大可购量（此处先不校验购物车已选数量）
    appendColorStyle($("#amount_increase"), (amount >= buyMax ? 1 : 0));
}
//endregion 购买数量相关

//region 购物车相关
/**
 *  提交校验
 * 1. 登陆校验
 * 2. sku选择  提示未被选中的维度名称
 * 3. amount数量
 */
function checkBuyForm() {
    $("#curPrice").val(Number($("#curPrice").text()));

    if (!empty(attrCfg)) {
        var count = 0;
        var unselectedtext = new StringBuffer();
        unselectedtext.append("请选择：");
        for (var m in attrCfg) {
            if (empty(selectattsMap) || empty(selectattsMap[m])) {
                if (count > 0) {
                    unselectedtext.append(",");
                }
                unselectedtext.append(attrCfg[m]["normal"]);
                count ++;
            }
        }
        if (count > 0) {
            tools.getObj("selectedSkuText").innerHTML = unselectedtext.toString().length > 0 ? unselectedtext.toString() : "";
            return false;
        }
    }

    amount =  Number($("#amount").val());
    //TODO 获取购物车中选中sku的数量
    var cartAmount = 0;
    return checkAmount(amount, cartAmount);
}

/**
 * 立即购买
 */
function addToBuyNow() {
    if (checkBuyForm() == true) {
        $("#fromBatch").val("1");
        var ssid = $("#ssid").val();
        var curSkuNum = $("#skuNum").val();
        checkTYLoginStatus(ssid, function(loginInfo){
            for(var i in skuInfos) {
                var skuItem = skuInfos[i];
                if(curSkuNum == skuItem.skuNum && skuItem.storehouseId == storehouseId) {
                    $("input[name='skuDesc']").val(skuItem.skuName);
                    $("input[name='curPrice']").val(skuItem.curPrice);
                    $("input[name='orgPrice']").val(skuItem.orgPrice);
                    $("input[name='imgKey']").val(skuItem.vPicture);
                    $("input[name='skuNum']").val(skuItem.skuNum);
                    $("input[name='storehouseId']").val(skuItem.storehouseId);
                    $("input[name='weight']").val(skuItem.weight);
                    break;
                }
            }

            $("input[name='storehouseIds']").val(productInfo.storehouseIds);
            $("input[name='postageId']").val(productInfo.postageId);
            $("input[name='sellerId']").val(productInfo.sellerId);
            $("input[name='productId']").val(productInfo.productId);
            $("input[name='productName']").val(productInfo.productName);
            $("input[name='score2cashAmount']").val(Number(score2cashAmount/100).toFixed(2));
            if(empty($("input[name='imgKey']").val())) {
                $("input[name='imgKey']").val(productInfo.imgKey.split(",")[0]);
            }

            $("#addProductSkuform").attr("action","/order/add_confirm?ssid="+ssid);
            $("#addProductSkuform").submit();
        });
    }
}

//region 详情页签
/**
 * 切换详情页签
 */
function moveToTab(tabIndex) {
    //alert("切换页签了" + tabIndex);
    $('li[id^="liTab_"]').each(function () {
        //当前选中页签设置back
        this.className = this.id == "liTab_" + tabIndex ? "back" : "";
    });

    //页签子DIV命名规则： divTab_当前页签索引[_子模块序号]
    $('div[id^="divTab_"]').each(function () {
         //当前选中页签的N个子内容DIV控制
        this.style.display = (this.id == "divTab_" + tabIndex) || (String(this.id).indexOf("divTab_" + tabIndex + "_") == 0) ? "block" :  "none";
    });
}
//endregion 详情页签


function isUserCanBuy() {
    if (empty(activeState)) {
        return false;
    }
    if (activeState < 300 || activeState >= 400) {
        return false;
    }

    return true;
}

/**
 * 渲染省份列表
 */
function renderProvinceInfo(curProvince) {
    $.ajax({
        url: "/nnc/provinces.json",
        type: 'get',
        dataType: 'json',
        success: function (rdata) {
            if(rdata.status == 200) {
                for (var i in rdata.data) {
                    var province = rdata.data[i];
                    $("#provinceId").append('<option value="'+ province.id+'">'+ province.shortName + '</option>');
                }

                $("#provinceId").val(curProvince);
            }

            $("#provinceId").on("change", function(){
                provinceId = $("#provinceId").val();
                var newStorehouseId = getStorehouseId(productInfo.sellerId, productInfo.productId, productInfo.storehouseIds, provinceId);
                if(newStorehouseId == 0) {
                    outStockControl();
                }

                if(newStorehouseId != storehouseId) {
                    //重新渲染页面, 初始化对应仓库的商品sku和库存信息
                    window.location.href = "/product/" + productId + "?ssid=" + ssid + "&provinceId=" + provinceId + "&storehouseId=" + newStorehouseId;
                }
            });
        }
    });
}

/**
 * 控制无货时页面展示
 */
function outStockControl(){
    $(".t7").children("span").show();
    $(".t8").hide();
}