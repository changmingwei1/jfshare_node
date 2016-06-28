var currImg = 0;
var attrCfg;
var stock = true;
var amount;
var strValues;
var formCfg = {
    cls:{
        selected:'selected'
    },
    system:{
        txt:{
            normal:"非常抱歉，系统繁忙，请稍候重试"
        }
    }
}
function getObjJQuery(id) {
    return jQuery("#" + id);
}
function bindEvent(id, evnet, fun) {
    getObjJQuery(id).bind(evnet, fun);
}
function removeClass(el, cls) {
    el.className = el.className.replace(new RegExp('(^|\\s)' + cls + '(?:\\s|$)'), '$1');
}
function sortChangeStyle(id) {
    var sortUl = jQuery("#" + id + "_ul");
    var obj = tools.getObj(id + "_ul");
    if (obj.style.display == "none") {
        sortUl.slideDown("normal");
        tools.getObj(id + "_img").src = shopStyle + "/images/index_btn_sortHide.gif";
    } else {
        sortUl.slideUp("normal");
        tools.getObj(id + "_img").src = shopStyle + "/images/index_btn_sortShow.gif";
    }
}
jQuery(function() {
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
        jQuery("#moveright").click(function() {
            m++;
            if (m >= group) {
                m = 0;
            }
            if (m == 0) {
                $("#scrollul").stop();
                jQuery("#scrollul").animate({left:0}, 500);
                jQuery("#scrollul").css("left", "0");
                jQuery("#moveleftimg").attr("src", shopStyle + "/images/product_list3.jpg");
            } else {
                jQuery("#moveleftimg").attr("src", shopStyle + "/images/product_list03.jpg");
                jQuery("#scrollul").animate({left:-rightarray[m]}, 500, function() {
                });
            }
        });
        jQuery("#moveleft").click(function() {
            var position = jQuery("#scrollul").position();
            if ((position.left + 308) < 0) {
                m--;
                jQuery("#scrollul").animate({left:-rightarray[m]}, 500);
            } else {
                m = 0;
                jQuery("#moveleftimg").attr("src", shopStyle + "/images/product_list3.jpg");
                jQuery("#scrollul").animate({left:0}, 500, function() {
                    jQuery("#scrollul").css("left", "0");
                });
            }
        });
    } catch(e) {
        alert(e.description)
    }
    var v = tools.getObj("attrs");
    if (v && v.value) {
        attrCfg = {};
        var value = v.value;
        strValues = value.split(",");
        for (var k = 0; k < strValues.length; k++) {
            if (tools.getObj(strValues[k] + "_name")) {
                var normal = tools.getObj(strValues[k] + "_name").innerHTML.replace("：", "");
                attrCfg[strValues[k]] = {id:strValues[k],normal:normal}
            }
        }
    }
    initForm();
});
function loadchat() {
    var params = new Object();
    params["shopStyle"] = shopStyle;
    params["merchantId"] = mid;
    params["loginUrl"] = loginUrl;
    jQuery.ajaxSettings['contentType'] = "application/x-www-form-urlencoded; charset=utf-8";
    jQuery.post(frontPath + "/shop/loadchat.jsp", params, loadchatreturn);
}
function loadchatreturn(responseText) {
    tools.getObj("loadchat").innerHTML = jQuery.trim(responseText);
}
function checknumber(strs) {
    var Letters = "1234567890";
    var i;
    var c;
    for (i = 0; i < strs.length; i ++) {
        c = strs.charAt(i);
        if (Letters.indexOf(c) == -1) {
            return true;
        }
    }
    return false;
}
function checkStock() {
    var qudiv = tools.getObj("qu_div");
    if (parseInt(tools.getObj("amount").value) > nowStock) {
        qudiv.style.display = "block";
        stock = false;
    } else {
        qudiv.style.display = "none";
        stock = true;
    }
}

function closeKey() {
    jQuery("#inputyBody").removeClass("attention");
}
/**
 * 判断变量是否空值
 * undefined, null, '', false, 0, [], {} 均返回true，否则返回false
 */
function empty(v) {
    switch (typeof v) {
        case 'undefined' :
            return true;
        case 'string'    :
            if ($.trim(v).length == 0) return true;
            break;
        case 'boolean'   :
            if (!v) return true;
            break;
        case 'number'    :
            if (0 === v) return true;
            break;
        case 'object'    :
            if (null === v) return true;
            if (undefined !== v.length && v.length == 0) return true;
            for (var k in v) {
                return false;
            }
            return true;
            break;
    }
    return false;
}
function initForm() {
    $("#loadingButton").hide();
    $("#addcarimg").show();
    amount = tools.getObj("amount");
    if (!empty(amount)) {
        amount.value = onceMustBuyCount;
    }

    var inputs = jQuery("#inputDiv .selectBox a");
    var options = {
        xOffset: 20,
        yOffset: -15,
        title : false,
        showEffect:"fadein",
        hideEffect:"fadeout",
        position: "right"
    }

    jQuery("#tabbarDiv a").click(function() {
        jQuery("#tabbarDiv a").removeClass("cur")
        jQuery(this).addClass("cur");
        var index = jQuery(this).attr("data-index");
        for (var i = 0; i < 4; i++) {
            var v = tools.getObj("dataDiv" + i);
            var t = tools.getObj("dataMenu" + i);
            var t = tools.getObj("dataMenu" + i);
            if (index != 0) {
                if (v) {
                    v.style.display = "none";
                    t ? t.style.display = "none" : '';
                    if (i == index) {
                        v.style.display = "";
                    }
                }
            } else {
                if (v) {
                    t ? t.style.display = "" : '';
                    v.style.display = "";
                }
            }
        }
    });

    for (var m in this.attrCfg) {
        jQuery("#" + m + "_selectDiv a").click(function() {
            var v = tools.getObj(jQuery(this).attr("attr") + "_value");
            if (jQuery(this).attr("class") == formCfg.cls.selected) {
                jQuery("#" + jQuery(this).attr("attr") + "_selectDiv a").removeClass(formCfg.cls.selected);
//                jQuery("#" + jQuery(this).attr("id") + "_img").attr("style", "display:none;");
                jQuery("#" + jQuery(this).attr("attr") + "_selectDiv img.zIndexPic").attr("style", "display:none;");
                v.value = "";
                initSelect(attrCfg);
            } else {
                var color = jQuery("#"+this.id).css("color");
                if(color=="rgb(221, 221, 221)" || color=="#dddddd"){
                    return;
                }
                jQuery("#" + jQuery(this).attr("attr") + "_selectDiv a").removeClass(formCfg.cls.selected);
                jQuery("#" + jQuery(this).attr("attr") + "_selectDiv img.zIndexPic").attr("style", "display:none;");
                jQuery("#" + jQuery(this).attr("id") + "_img").attr("style", "display:;");
                jQuery(this).addClass(formCfg.cls.selected);
                v.value = this.id;
                initSelect(attrCfg);
            }
            sellProperty();
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
    var reLoadPriceSpan = tools.getObj("reLoadPriceSpan");


    var reLoadPriceSpan1 = tools.getObj("reLoadPriceSpan1");

    function initSelect(attslist){
        var atts = new StringBuffer();params = new Object();
        var selectatts = new StringBuffer();
        var unselectatts = "";
        var count = 0;
        var count2 = 0;
        var attrdivStr = "";
        var attrdiv = document.getElementsByName("attr_div");
        for(var n=0;n<attrdiv.length;n++){
            attrdivStr+=attrdiv[n].value+",";
        }
        var attrDiv = attrdivStr.split(",");
        var curattrDiv="";
        for (var m in attslist) {
            var v = tools.getObj(m + "_value");
            if (v.value) {
                if (count > 0) {
                    atts.append(",");
                    selectatts.append(",");
                }
                atts.append('"' + m + '":' + '"' + v.value + '"');
                selectatts.append(m);
                count++;
            }
        }
        var selectatts2=selectatts.toString().split(",");
        for (var a=0;a<selectatts2.length;a++) {
            for(var n=0;n<attrDiv.length;n++){
                if(selectatts2[a]==attrDiv[n]){
                    attrDiv[n] = "";
                }
            }
        }
        for(var n=0;n<attrDiv.length;n++){
            curattrDiv += attrDiv[n]+",";
        }
        var curattrdiv2 = curattrDiv.split(",");
        for(var z=0;z<curattrdiv2.length;z++){
            if(curattrdiv2[z]!=""){
                jQuery("#"+curattrdiv2[z]+"_selectDiv").find("a").each(function(){unselectatts+=this.id+","});
                var unselect = unselectatts.split(",");
                count2=0;
                for(var h=0;h<unselect.length;h++){
                    if(unselect[h]!=""){
                        var curatts = atts;
                        var b = unselect[h];
                        curatts+=","+'"' + curattrdiv2[z] + '":' + '"' + b + '"';
                        count2++;
                        params["attrs"+h] = curatts.toString();
                        params["attrId"+h] =b;
                        params["amount"] = amount.value;
                        params["mid"] = mid;
                        params["pid"] = pid;
                        params["userId"] = userId;
                        curatts="";
                    }

                }
                params["count"] = count2;
                jQuery.ajaxSettings['contentType'] = "application/x-www-form-urlencoded; charset=utf-8";
                jQuery.post(frontPath + "/shop/reLoadPrices.jsp", params,
                    function(responseText){
                        if (jQuery.trim(responseText)) {
                            var result = JSON.parse(responseText);
                            if (result) {
                                var unattrid = result.unattrId.split(",");
                                for(var i=0;i<unattrid.length;i++){
                                    if(unattrid[i]!=""){
                                        jQuery("#"+unattrid[i]).attr("style","color:#DDDDDD");
                                    }
                                }
                                var attrid = result.attrId.split(",");
                                for(var i=0;i<attrid.length;i++){
                                    if(attrid[i]!=""){
                                        jQuery("#"+attrid[i]).attr("style","color:#000000");
                                    }
                                }
                                if(unattrid=="" && attrid==""){
                                    jQuery("#"+curattrdiv2[z]+"_selectDiv").find("a").each(function(){jQuery("#"+this.id).attr("style","color:#000000");});
                                }
                            }
                        }

                    });
            }
        }
    }

    function sellProperty() {
        var atts = new StringBuffer(),params = new Object(),count = 0,selectedtext = new StringBuffer();
        if (amount.value == "") {
            alert("请填写要购买的商品数量");
            amount.focus();
            return false;
        }
        if (checknumber(amount.value)) {
            alert("您填写购买的商品数量不是有效的数字");
            amount.focus();
            return false;
        } else {
            if (amount.value == "0") {
                alert("购买的商品数量必须大于0");
                amount.value = '1'
                return false;
            }
            if (amount.value == "999" || amount.value.length > 3) {
                alert("尊敬的客户您订购的数量太多,请您与客服或与商家联系");
                amount.focus();
                return false;
            }
        }
        //todo
        selectedtext.append("您已选择：");
        var numAttr = 0;
        for (var m in attrCfg) {
            var v = tools.getObj(m + "_value");
            if (v.value) {
                if (count > 0) {
                    atts.append(",");
                    selectedtext.append(",");
                }
                atts.append('"' + m + '":' + '"' + v.value + '"');
                var t = tools.getObj(v.value);
                selectedtext.append($(t).text());
                count++;
            }
            numAttr++;
        }
        if (selectedtext.toString().length > 0) {
            tools.getObj("selectedtext").innerHTML = selectedtext.toString();
        } else {
            tools.getObj("selectedtext").innerHTML = "";
        }
        if (numAttr == count) {
            params["attrs"] = atts.toString();
            params["amount"] = amount.value;
            params["mid"] = mid;
            params["pid"] = pid;
            params["userId"] = userId;
            jQuery.ajaxSettings['contentType'] = "application/x-www-form-urlencoded; charset=utf-8";
            jQuery.post(frontPath + "/ajax/reLoadPrice.jsp", params, sellPropertyReturn);
        }
    }

    function sellPropertyReturn(responseText) {
        var RateOfRmb2IntegralExchangesValue = $("#RateOfRmb2IntegralExchangesValue").val();
        if (jQuery.trim(responseText)) {
            var result = JSON.parse(responseText);
            if (result) {
//                reLoadPriceSpan.innerHTML = result.moneyTypeName + "<em>" + result.formatUnitPrice + "</em>";
                if (result.formatUnitPrice) {
                    reLoadPriceSpan.innerHTML = result.formatUnitPrice;
                    reLoadPriceSpan1.innerHTML = result.formatUnitPrice / RateOfRmb2IntegralExchangesValue * 100 / 100;
                    tools.getObj("productPriceSkuId").innerHTML = result.skuId;
                    if (result.zeroSellable == "1") {
                        tools.getObj("stock").innerHTML = parseInt(result.zeroSellCount);
                    } else {
                        tools.getObj("stock").innerHTML = parseInt(result.sellableCount);
                    }
//                var innerhtml = "<input  type='image' src='" + shopStyle + "/images/detail_btn_addToCar.gif' id='addcarimg' onmouseover='checkStock()'/>"
                    var innerhtml = "<a href=\"javascript:;\" onclick=\"firstBuy();\"><img src=\"" + shopStyle + "/images/detail_reviews_btn.gif\" alt=\"\" /></a>"
                            + "<a href=\"javascript:;\" onclick=\"addToCart();\"><img src=\"" + shopStyle + "/images/detail_btncart_btn.gif\" alt=\"\" /></a>";

                    if (tools.getObj("stock").innerHTML <= 0) {
//                    innerhtml = "<img src='- + shopStyle + -/images/detail_quehuo.gif'/*tpa=http://www.jfshare.com/templates/merchant/template_jfshare_xj/js/" + shopStyle + "/images/detail_quehuo.gif*//>"
                        innerhtml = "<a href=\"" + frontPath + "/member/outofstockregister.jsp?id=" + result.pid + "\"><img src=\"" + shopStyle + "/images/quehuo.gif\"/></a>"
                    }
                    if (tools.getObj("buyimgdiv")) {
                        tools.getObj("buyimgdiv").innerHTML = innerhtml;
                    }
                    tools.getObj("amountInteralDiv").innerHTML = result.amountInteral;
                    if (result.zeroSellable == "1") {
                        nowStock = parseInt(result.zeroSellCount);
                    } else {
                        nowStock = parseInt(result.sellableCount);
                    }
                    if (result.onceMustBuyCount > 0) {
                        onceMustBuyCount = result.onceMustBuyCount;
                        amount.value = onceMustBuyCount;
                    } else {
                        onceMustBuyCount = 1;
                        amount.value = onceMustBuyCount;
                    }
                    if (result.canspecialcount > 0) {
                        canspecialcount = result.canspecialcount;
                    }
                } else {
                    var innerhtml = "<a href=\"" + frontPath + "/member/outofstockregister.jsp?id=" + result.pid + "\"><img src=\"" + shopStyle + "/images/quehuo.gif\"/></a>";
                    if (tools.getObj("buyimgdiv")) {
                        tools.getObj("buyimgdiv").innerHTML = innerhtml;
                    }
                }
            }
        }
    }

//todo
    /*bindEvent("addToCartform", "submit", function() {
     var options = {
     success:loadAddShoppingCartResult,
     beforeSubmit:checkBuyForm
     };
     $(this).ajaxSubmit(options);
     return false;
     });*/

}
function checkBuyForm() {
    if (!stock) {
        return false;
    }
    var s = true;
    var buffer = new StringBuffer();

    buffer.append("请选择：");

    if (!empty(strValues)) {
        for (var i = 0; i < strValues.length; i++) {
            var v = tools.getObj(strValues[i] + "_value");
            if (v.value == "" || !v.value) {
                s = false;
            }
        }
    }

    if (!s) {
        alert("请选择您要的商品信息!");
        tools.getObj("selectedtext").innerHTML = buffer;
        return s;
    }
    if (amount.value == "") {
        alert("请填写要购买的商品数量");
        amount.focus();
        s = false;
    }
    if (checknumber(amount.value)) {
        alert("您填写购买的商品数量不是有效的数字");
        amount.focus();
        s = false;
    } else {
        if (amount.value == "0") {
            alert("购买的商品数量必须大于0");
            amount.value = '1'
            s = false;
        }
        if (amount.value == "999" || amount.value.length > 3) {
            alert("尊敬的客户您订购的数量太多,请您与客服或与商家联系");
            amount.focus();
            s = false;
        }
        var productPriceSkuId = jQuery("#productPriceSkuId")[0].innerHTML;
        var responseCount = jQuery.ajax({url:frontPath + "/shopping/handle/get_product_buy_count.jsp?dumy=" + Math.random(),data:{productId:pid,skuId:productPriceSkuId},async:false,cache:false}).responseText;
        responseCount = Number(jQuery.trim(responseCount));
        var buycount = nowStock - securitySellableCount;
        if (Number(amount.value) <= Number(buycount)) {
            if (Number(canspecialcount) > 0) {
                if ((Number(amount.value) + Number(responseCount)) > Number(canspecialcount)) {
                    alert("您选购的商品已达到特价限购数量!");
                    amount.value = Number(canspecialcount) - responseCount;
                    s = false;
                }
            } else if (Number(canspecialcount) < 0) {
                alert("您已达到此特价商品的限制数量, 谢谢惠顾!");
                s = false;
            }
            if ((Number(amount.value) + Number(responseCount)) > Number(buycount)) {
                if(responseCount > 0){
                    alert("对不起，库存不足，您的购物车已有该商品"+responseCount+"件!");
                }else{
                    alert("对不起，库存不足!");
                }
                s = false;
            }
        } else {
            if(responseCount > 0){
                alert("对不起，库存不足，您的购物车已有该商品"+responseCount+"件!");
            }else{
                alert("对不起，库存不足!");
            }
            s = false;
        }
    }
    return s;
}
function addToCart() {
    var options = {
        success:loadAddShoppingCartResult,
        beforeSubmit:checkBuyForm
    };
    jQuery("#addToCartform").ajaxSubmit(options);
    return false;
}

function firstBuy() {
    var options = {
        success:loadAddShoppingCartResult2,
        beforeSubmit:checkBuyForm
    };
    jQuery("#addToCartform").ajaxSubmit(options);
    return false;
}


//详情

function moveToContent(){
    var content = document.getElementById("content");
    var Specification = document.getElementById("Specification");
    var evaluation = document.getElementById("evaluation");
    var evaluation1 = document.getElementById("evaluation1");
    var Consulting = document.getElementById("Consulting");
//    var Consulting1 = document.getElementById("Consulting1");
    var afterSale = document.getElementById("afterSale");
    var liSpecification = document.getElementById("liSpecification");
    var liEvaluation = document.getElementById("liEvaluation")
    var liConsulting = document.getElementById("liConsulting");
    var liAfterSale = document.getElementById("liAfterSale");
    var liContent = document.getElementById("liContent");
    liContent.className = "back";
    content.style.display = "block";
    liEvaluation.className = "";
    liConsulting.className = "";
    liAfterSale.className = "";
    liSpecification.className = "none";
    Specification.style.display = "none";
    evaluation.style.display = "none";
    evaluation1.style.display = "none";
    Consulting.style.display = "none";
//    Consulting1.style.display = "none";
    afterSale.style.display = "none";

}
function moveToSpecifcation(){
    var content = document.getElementById("content");
    var Specification = document.getElementById("Specification");
    var evaluation = document.getElementById("evaluation");
    var evaluation1 = document.getElementById("evaluation1");
    var Consulting = document.getElementById("Consulting");
    var Consulting1 = document.getElementById("Consulting1");
    var afterSale = document.getElementById("afterSale");
    var liSpecification = document.getElementById("liSpecification");
    var liEvaluation = document.getElementById("liEvaluation")
    var liConsulting = document.getElementById("liConsulting");
    var liAfterSale = document.getElementById("liAfterSale");
    var liContent = document.getElementById("liContent");
    liContent.className = "";
    liEvaluation.className = "";
    liConsulting.className = "";
    liAfterSale.className = "";
    liSpecification.className = "back";
    Specification.style.display = "block";
    content.style.display = "none";
    evaluation.style.display = "none";
    evaluation1.style.display = "none";
    Consulting.style.display = "none";
    Consulting1.style.display = "none";
    afterSale.style.display = "none";
}
function moveToEvaluation(){
    var content = document.getElementById("content");
    var Specification = document.getElementById("Specification");
    var evaluation = document.getElementById("evaluation");
    var evaluation1 = document.getElementById("evaluation1");
    var Consulting = document.getElementById("Consulting");
    var Consulting1 = document.getElementById("Consulting1");
    var afterSale = document.getElementById("afterSale");
    var liSpecification = document.getElementById("liSpecification");
    var liEvaluation = document.getElementById("liEvaluation")
    var liConsulting = document.getElementById("liConsulting");
    var liAfterSale = document.getElementById("liAfterSale");
    var liContent = document.getElementById("liContent");
    liContent.className = "";
    liSpecification.className = "";
    liConsulting.className = "";
    liAfterSale.className = "";
    liEvaluation.className = "back";
    evaluation.style.display = "block";
    evaluation1.style.display = "block";
    content.style.display = "none";
    Specification.style.display = "none";
    Consulting.style.display = "none";
    Consulting1.style.display = "none";
    afterSale.style.display = "none";
}
function moveToConsulting(){
    var content = document.getElementById("content");
    var Specification = document.getElementById("Specification");
    var evaluation = document.getElementById("evaluation");
    var evaluation1 = document.getElementById("evaluation1");
    var Consulting = document.getElementById("Consulting");
    var Consulting1 = document.getElementById("Consulting1");
    var afterSale = document.getElementById("afterSale");
    var liSpecification = document.getElementById("liSpecification");
    var liEvaluation = document.getElementById("liEvaluation")
    var liConsulting = document.getElementById("liConsulting");
    var liAfterSale = document.getElementById("liAfterSale");
    var liContent = document.getElementById("liContent");
    liContent.className = "";
    liEvaluation.className = "";
    liSpecification.className = "";
    liAfterSale.className = "";
    liConsulting.className = "back";
    Consulting.style.display = "block";
    Consulting1.style.display = "block";
    content.style.display = "none";
    Specification.style.display = "none";
    evaluation.style.display = "none";
    evaluation1.style.display = "none";
    afterSale.style.display = "none";
}
function moveToAfterSale(){
    var content = document.getElementById("content");
    var Specification = document.getElementById("Specification");
    var evaluation = document.getElementById("evaluation");
    var evaluation1 = document.getElementById("evaluation1");
    var Consulting = document.getElementById("Consulting");
//    var Consulting1 = document.getElementById("Consulting1");
    var afterSale = document.getElementById("afterSale");
    var liSpecification = document.getElementById("liSpecification");
    var liEvaluation = document.getElementById("liEvaluation")
    var liConsulting = document.getElementById("liConsulting");
    var liAfterSale = document.getElementById("liAfterSale");
    var liContent = document.getElementById("liContent");
    liContent.className = "";
    liSpecification.className = "";
    liEvaluation.className = "";
    liConsulting.className = "";
    liAfterSale.className = "back";
    afterSale.style.display = "block";
    content.style.display = "none";
    Specification.style.display = "none";
    evaluation.style.display = "none";
    evaluation1.style.display = "none";
    Consulting.style.display = "none";
    Consulting1.style.display = "none";
}



 /*function showContent(){
     var Specification = document.getElementById("Specification");
     Specification.style.display = "none";
 }
 function showSpecification(){
     var content = document.getElementById("content");
     var Specification = document.getElementById("Specification");
     content.style.display = "none";
     Specification.style.display = "block";

 }*/

//todo
function loadAddShoppingCartResult(responseText, statusText) {
    if (statusText == "success") {
        var data = jQuery.trim(responseText);
        var dataArray = data.split("---");
        if (dataArray[0] == "ok") {
            var result = JSON.parse(dataArray[1]);
            tools.getObj("totalAmount").innerHTML = result.productAmount;
            tools.getObj("totalPrice").innerHTML = result.moneyTypeName + result.formatTotalProductPrice;
            changecartOpen(pid);
        } else if (dataArray[0] == "4") {
            alert("对不起， 库存不足！");
        } else {
            alert("系统繁忙请稍候重试");
        }
    }
}
function loadAddShoppingCartResult2(responseText, statusText) {
    if (statusText == "success") {
        var data = jQuery.trim(responseText);
        var dataArray = data.split("---");
        if (dataArray[0] == "ok") {
            var result = JSON.parse(dataArray[1]);
            tools.getObj("totalAmount").innerHTML = result.productAmount;
            tools.getObj("totalPrice").innerHTML = result.moneyTypeName + result.formatTotalProductPrice;
            window.location.href = frontPath + "/shopping/cart.jsp"
        } else if (dataArray[0] == "4") {
            alert("对不起， 库存不足！");
        } else {
            alert("系统繁忙请稍候重试");
        }
    }
}
function changecartOpen() {
    var box = tools.getObj("cartOpen");
    if (box.style.display == "none" || box.style.display == "") {
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}


function showlink() {
    document.getElementById('disclaimer').style.display = "";
}
function hidelink() {
    document.getElementById('disclaimer').style.display = "none";
}


function openQQ() {
    _site = 'http://www.yoye.cn/';
    var _u = 'http://v.t.qq.com/share/share.php?title=' + _t + '&url=' + _url + '&site=' + _site + '&pic=' + _pic;
    window.open(_u, '转播到腾讯微博', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');

}
function openQZone() {
    var _u = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + encodeURIComponent(document.location) + "&title=" + encodeURIComponent(document.title) + '&pic=' + encodeURIComponent(document.getElementById("midImg").src);
    _pic = encodeURI(_pic);
    window.open(_u, '转播到QQ空间', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
}
function openSina() {
    var _u = 'http://v.t.sina.com.cn/share/share.php?title=' + _t + '&url=' + _url + '&pic=' + _pic;
    window.open(_u, '转播到新浪微博', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
}
function openKaixin() {
    var _u = 'http://www.kaixin001.com/repaste/share.php?rtitle=' + _t + '&rurl=' + _url;
    window.open(_u, '转播到开心网', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
}
function openRenrRen() {
    var _u = 'http://share.renren.com/share/buttonshare.do?title=' + _t + '&link=' + _url;
    window.open(_u, '转播到人人网', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
}
function openWangyi() {
    var _u = ' http://t.163.com/article/user/checkLogin.do?link=http://news.163.com&info=' + _t + _url;
    window.open(_u, '转播到网易', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
}

function changeProductSortChildDiv() {
    if (jQuery("#product_SortChild").attr("style") == "display:;" || jQuery("#product_SortChild").attr("style") == "") {
        jQuery("#product_SortChild").attr("style", "display:none;");
        jQuery("#changeProductSortChildImg").attr("src", shopStyle + "/images/detail_cat_icon2.gif");
    } else {
        jQuery("#product_SortChild").attr("style", "display:;");
        jQuery("#changeProductSortChildImg").attr("src", shopStyle + "/images/detail_cat_icon3.jpg");
    }
}

function SetCwinHeight(frame) {
    var ciframe = document.getElementById(frame); //iframe id
    var bHeight = ciframe.contentWindow.document.body.scrollHeight;
    var dHeight = ciframe.contentWindow.document.documentElement.scrollHeight;
    var height = Math.max(bHeight, dHeight);
    ciframe.height = height;
}
function checkFrame(frame, heightDiv) {
    var ciframeHeight = parent.document.getElementById(frame).height;
    var ciframe = parent.document.getElementById(frame);
    if (ciframeHeight < heightDiv) {
        ciframe.height = heightDiv;
    } else {
        if (ciframe.contentDocument && ciframe.contentDocument.body.offsetHeight) {
            ciframe.height = ciframe.contentDocument.body.offsetHeight + 120;
        } else if (ciframe.Document && ciframe.Document.body.scrollHeight) {
            ciframe.height = ciframe.Document.body.scrollHeight + 120;
        }
    }
}
function decrease() {
    var productPriceSkuId = jQuery("#productPriceSkuId")[0].innerHTML;
    var responseCount = jQuery.ajax({url:frontPath + "/shopping/handle/get_product_buy_count.jsp?dumy=" + Math.random(),data:{productId:pid,skuId:productPriceSkuId},async:false,cache:false}).responseText;
    responseCount = Number(jQuery.trim(responseCount));
    var buycount = Number(nowStock - securitySellableCount - responseCount);
    var amounts = 1;
    onceMustBuyCount = Number(onceMustBuyCount);
    nowStock = Number(nowStock);
    if (onceMustBuyCount <= buycount) {
        amounts = onceMustBuyCount;
    } else if (onceMustBuyCount > nowStock) {
        amounts = buycount;
    } else if (onceMustBuyCount > buycount) {
        amounts = buycount;
    }

    var amount = jQuery("#amount");
    if (amounts > 0 && Number(amount.val()) > amounts) {
        amount.val(amount.val() - 1);
    } else {
        alert("购买商品起订量为：" + onceMustBuyCount + "个!");
        jQuery("#amount").val(onceMustBuyCount);
    }
}
function checkvalue(value) {
    var s = true;
    var buffer = new StringBuffer();
    buffer.append("请选择：");
    if (!empty(strValues)) {
        for (var i = 0; i < strValues.length; i++) {
            var v = tools.getObj(strValues[i] + "_value");
            if (v.value == "" || !v.value) {
                s = false;
            }
        }
    }
    if (!s) {
        alert("请选择您要的商品信息!");
        tools.getObj("selectedtext").innerHTML = buffer;
        return s;
    }
    var productPriceSkuId = jQuery("#productPriceSkuId")[0].innerHTML;
    var responseCount = jQuery.ajax({url:frontPath + "/shopping/handle/get_product_buy_count.jsp?dumy=" + Math.random(),data:{productId:pid,skuId:productPriceSkuId},async:false,cache:false}).responseText;
    responseCount = Number(jQuery.trim(responseCount));
    var buycount = Number(nowStock - securitySellableCount - responseCount);
    onceMustBuyCount = Number(onceMustBuyCount);
    nowStock = Number(nowStock);
    if (value == "") {
        alert("请输入购买的商品数量");
        jQuery("#amount").focus();
        return;
    }
    if (isNaN(value)) {
        alert("您填写购买的商品数量不是有效的数字");
        return;
    }
    value = Number(value);
    if (value > buycount) {
//        alert("消费者库存不足，仅剩" + buycount + "个可以订购!");
        if(responseCount > 0){
            alert("对不起，库存不足，您的购物车已有该商品"+responseCount+"件!");
        }else{
            alert("对不起，库存不足!");
        }
        return;
    }
    if (Number(canspecialcount) > 0) {
        if (Number(value) > (Number(canspecialcount) - responseCount)) {
            jQuery("#amount").val(Number(canspecialcount) - responseCount);
            alert("您选购的商品已达到特价限购数量!");
            return;
        }
    }
    if (Number(canspecialcount) < 0) {
        alert("您已达到此特价商品的限制数量, 谢谢惠顾!");
        return;
    }
    var amounts = 1;
    if (onceMustBuyCount <= buycount) {
        amounts = onceMustBuyCount;
    } else if (onceMustBuyCount > nowStock) {
        amounts = buycount;
    } else if (onceMustBuyCount > buycount) {
        amounts = buycount;
    }
    if (amounts > 0 && value >= amounts) {
    } else {
        alert("购买商品起订量为：" + onceMustBuyCount + "个!");
        jQuery("#amount").val(onceMustBuyCount);
    }
}
function adding() {
    var s = true;
    var buffer = new StringBuffer();
    buffer.append("请选择：");
    if (!empty(strValues)) {
        for (var i = 0; i < strValues.length; i++) {
            var v = tools.getObj(strValues[i] + "_value");
            if (v.value == "" || !v.value) {
                s = false;
            }
        }
    }
    if (!s) {
        alert("请选择您要的商品信息!");
        tools.getObj("selectedtext").innerHTML = buffer;
        return s;
    }
    var amount = jQuery("#amount");
    var productPriceSkuId = jQuery("#productPriceSkuId")[0].innerHTML;
    var responseCount = jQuery.ajax({url:frontPath + "/shopping/handle/get_product_buy_count.jsp?dumy=" + Math.random(),data:{productId:pid,skuId:productPriceSkuId},async:false,cache:false}).responseText;
    responseCount = Number(jQuery.trim(responseCount));
    var buycount = Number(nowStock - securitySellableCount - responseCount);
    if (Number(amount.val()) < buycount) {
        if (Number(canspecialcount) > 0) {
            amount.val(Number(amount.val()) + 1);
            if (Number(amount.val()) > (Number(canspecialcount) - responseCount)) {
                alert("您选购的商品已达到特价限购数量!");
                amount.val((Number(canspecialcount) - responseCount));
            }
        } else if (Number(canspecialcount) < 0) {
            alert("您已达到此特价商品的限制数量, 谢谢惠顾!");
            return;

        } else {
            amount.val(Number(amount.val()) + 1);
        }
    } else {
//        alert("消费者库存不足，仅剩" + buycount + "个可以订购!");
        if(responseCount > 0){
            alert("对不起，库存不足，您的购物车已有该商品"+responseCount+"件!");
        }else{
            alert("对不起，库存不足!");
        }
    }

}

function checkLogin(pid, shopStyle, layout, flag, remarkid) {
    params = new Object();
    params["pid"] = pid;
    params["shopStyle"] = shopStyle;
    params["layout"] = layout;
    params["flag"] = flag;
    params["remarkid"] = remarkid;
    if (remarkid != "") {
        if (flag == "answer") {
            params["adviceid"] = remarkid;
            jQuery("#adviceAnswerLoginLayer" + remarkid).load(layout + "/ajax/login.jsp", params, function() {
                document.getElementById("adviceAnswerLoginLayer" + remarkid).style.left = "13%";
                document.getElementById("adviceAnswerLoginLayer" + remarkid).style.display = "block";
            });
        } else {
            jQuery("#diyLoginLayer" + remarkid).load(layout + "/ajax/login.jsp", params, function() {
                document.getElementById("diyLoginLayer" + remarkid).style.left = "13%";
                document.getElementById("diyLoginLayer" + remarkid).style.display = "block";
            });
        }
    } else {
        if (flag == "advice") {
            jQuery("#adviceLoginLayer").load(layout + "/ajax/login.jsp", params, function() {
                document.getElementById("adviceLoginLayer").style.left = "13%";
                document.getElementById("adviceLoginLayer").style.display = "block";
            });
        } else if (flag == "favorite") {
            jQuery("#favoriteLoginLayer").load(layout + "/ajax/login.jsp", params, function() {
                document.getElementById("favoriteLoginLayer").style.left = "13%";
                document.getElementById("favoriteLoginLayer").style.display = "block";
            });
        } else {
            jQuery("#diyLoginLayer").load(layout + "/ajax/login.jsp", params, function() {
                document.getElementById("diyLoginLayer").style.left = "13%";
                document.getElementById("diyLoginLayer").style.display = "block";
            });
        }
    }
}

function favoriteProduct(pid, shopStyle, layout, flag, remarkid, brandName, colName, userId) {
    var params = new Object();
    params["objId"] = pid;
    params["shopStyle"] = shopStyle;
    params["layout"] = layout;
    params["type"] = "product";
    jQuery.ajaxSettings['contentType'] = "application/x-www-form-urlencoded; charset=utf-8";
    jQuery.post(frontPath + "/common_handle/favor_add_handler.jsp", params, function(msg) {
        var data = jQuery.trim(msg);
        if (data == "none") {
            alert("您暂未登录，无法收藏该商品！");
            checkLogin(pid, shopStyle, layout, flag, remarkid);
        } else if (data == "ok") {
            favor_cfg(userId, pid, brandName, colName);
            document.getElementById("addfavoriteLayer").style.display = "block";
            window.frames["advice"].location.reload();
            window.frames["comments"].location.reload();

        } else if (data == "existed") {
            alert("此商品已收藏过!");
        } else {
            alert("系统繁忙请稍后再试！");
        }

    });
}

function closeAddFrovite() {
    document.getElementById("addfavoriteLayer").style.display = "none";
}

function checkBuyBomForm(form) {
    var params = $(form).serialize();
    var response = jQuery.ajax({url:frontPath + "/shopping/handle/cart_add_handler.jsp?dumy=" + Math.random(),data:params,async:false,cache:false}).responseText;
    var data = jQuery.trim(response);
    var dataArray = data.split("---");
    if (dataArray[0] == "ok") {
        form.action = frontPath + "/shopping/cart.jsp";
        form.submit();
    } else if (dataArray[0] == "4") {
        alert("对不起， 库存不足！");
        return false;
    } else {
        alert("系统繁忙请稍候重试");
        return false;
    }
}


function getTimes() {
    for (var i = 1; i <= count; i++) {
        toEnd[i] = document.getElementById("toEnd_" + i).value;
        toBegin[i] = document.getElementById("toBegin_" + i).value;
    }
}
function setCount(c) {
    count = c;
}
function getTimeString(i) {
    var time = 0;
    var state = document.getElementById("state_" + i).value;
    if (state == 'over') {
        document.getElementById("only_day_" + i).innerHTML = 0;
        document.getElementById("only_hour_" + i).innerHTML = 0;
        document.getElementById("only_min_" + i).innerHTML = 0;
        document.getElementById("only_sec_" + i).innerHTML = 0;
        document.getElementById("only_txt_" + i).innerHTML = " 已结束 ";
        return;
    }
    if (state == 'onGroup'){ time = toEnd[i];
        document.getElementById("only_txt_" + i).innerHTML = " 结束 ";
    }
    if (state == 'unStart'){ time = toBegin[i];
        document.getElementById("only_txt_" + i).innerHTML = " 开始 ";
    }
    if (time <= 0) {
        if (state == 'unStart') {
            time = toEnd[i];
            document.getElementById("only_txt_" + i).innerHTML = " 结束 ";
        }
        if (state == 'onGroup') { //如果状态是正在抢购的，时间到了，就变成抢购结束了
            document.getElementById("only_day_" + i).innerHTML = 0;
            document.getElementById("only_hour_" + i).innerHTML = 0;
            document.getElementById("only_min_" + i).innerHTML = 0;
            document.getElementById("only_sec_" + i).innerHTML = 0;
            document.getElementById("only_txt_" + i).innerHTML = " 已结束 ";
            return;
        }
    }
    var m1, m2;
    var day = Math.floor(time / (60 * 60 * 24));
    if (day > 0) m1 = time - day * (60 * 60 * 24);
    else m1 = time;
    var hour = Math.floor(m1 / (60 * 60));
    if (hour > 0) m2 = m1 - hour * (60 * 60);
    else m2 = m1;
    var min = Math.floor(m2 / 60);
    var second = Math.floor(m2 - min * 60);
    document.getElementById("only_day_" + i).innerHTML = day;
    document.getElementById("only_hour_" + i).innerHTML = hour;
    document.getElementById("only_min_" + i).innerHTML = min;
    document.getElementById("only_sec_" + i).innerHTML = second;

    if (state == 'onGroup') toEnd[i]--;
    if (state == 'unStart') {
        if (toBegin[i] >= 0) toBegin[i]--; else toEnd[i]--;
    }
}

function getTimes2() {
    for (var i = 1; i <= count2; i++) {
        toEnd2[i] = document.getElementById("toEnd2_" + i).value;
        toBegin2[i] = document.getElementById("toBegin2_" + i).value;
    }
}
function display(i) {
    var time = 0;
    var state = document.getElementById("state2_" + i).value;
    var begin = parseInt(document.getElementById("begin2_" + i).value);
    var end = parseInt(document.getElementById("end2_" + i).value);
    s = state;
    if (state == 'over') return;
    if (state == 'onPanic') time = toEnd2[i];
    if (state == 'unStart') time = toBegin2[i];
    if (time < 0) {
        if (state == 'unStart') {
            time = toEnd2[i];
            document.getElementById("state_txt_" + i).innerHTML = " 结束 ";
        }
        if (state == 'onPanic') {
            document.getElementById("state_txt_" + i).innerHTML = " 已结束 ";
           return;
        }
    }
    var m1, m2;
    var day = Math.floor(time / (60 * 60 * 24));
    if (day > 0) m1 = time - day * (60 * 60 * 24);
    else m1 = time;
    var hour = Math.floor(m1 / (60 * 60));
    if (hour > 0) m2 = m1 - hour * (60 * 60);
    else m2 = m1;
    var min = Math.floor(m2 / 60);
    var second = Math.floor(m2 - min * 60);
    document.getElementById("day_" + i).innerHTML = day;
    document.getElementById("hour_" + i).innerHTML = hour;
    document.getElementById("minute_" + i).innerHTML = min;
    document.getElementById("second_" + i).innerHTML = second;
    // 时间倒计
    if (state == 'onPanic') toEnd2[i]--;
    if (state == 'unStart') {
        if (toBegin2[i] >= 0) toBegin2[i]--; else toEnd2[i]--;
    }
}
