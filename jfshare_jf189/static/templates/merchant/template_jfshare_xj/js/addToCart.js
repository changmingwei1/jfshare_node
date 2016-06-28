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
function getObj(id) {
    return document.getElementById(id);
}
function bindEvent(id, evnet, fun) {
    getObjJQuery(id).bind(evnet, fun);
}
function removeClass(el, cls) {
    el.className = el.className.replace(new RegExp('(^|\\s)' + cls + '(?:\\s|$)'), '$1');
}
function sortChangeStyle(id) {
    var sortUl = jQuery("#" + id + "_ul");
    var obj = getObj(id + "_ul");
    if (obj.style.display == "none") {
        sortUl.slideDown("normal");
        getObj(id + "_img").src = shopStyle + "/images/index_btn_sortHide.gif";
    } else {
        sortUl.slideUp("normal");
        getObj(id + "_img").src = shopStyle + "/images/index_btn_sortShow.gif";
    }
}
jQuery(function() {
    var inputs = jQuery("#inputDiv .selectBox a");
    var v = getObj("attrs");
    if (v && v.value) {
        attrCfg = {};
        var value = v.value;
        strValues = value.split(",");
        for (var k = 0; k < strValues.length; k++) {
            if (getObj(strValues[k] + "_name")) {
                var normal = getObj(strValues[k] + "_name").innerHTML.replace("：", "");
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
    getObj("loadchat").innerHTML = jQuery.trim(responseText);
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
    var qudiv = getObj("qu_div");
    if (parseInt(getObj("amount").value) > nowStock) {
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
//todo
//去左空格;
function ltrim(s) {
    return s.replace(/^(\s*|　*)/, "");
}
//去右空格;
function rtrim(s) {
    return s.replace(/(\s*|　*)$/, "");
}
//去左右空格;
function trim(s) {
    return ltrim(rtrim(s));
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
            if (trim(v).length == 0) return true;
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

    //$("#loadingButton").hide();
    //$("#addcarimg").show();
    amount = getObj("amount");
    if (amount == null || amount == undefined) {
        return;
    }
    if (!empty(amount)) {
        amount.value = onceMustBuyCount;
    }
    for (var m in this.attrCfg) {
        jQuery("#" + m + "_selectDiv a").click(function() {
            var v = getObj(jQuery(this).attr("attr") + "_value");
            if (jQuery(this).attr("class") == formCfg.cls.selected) {
                jQuery("#" + jQuery(this).attr("attr") + "_selectDiv a").removeClass(formCfg.cls.selected);
//                jQuery("#" + jQuery(this).attr("id") + "_img").attr("style", "display:none;");
                jQuery("#" + jQuery(this).attr("attr") + "_selectDiv img.zIndexPic").attr("style", "display:none;");
                v.value = "";
                initSelect(attrCfg);
            } else {
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
                getObj(this.id + "_tip").style.display = "block";
            }, function() {
                getObj(this.id + "_tip").style.display = "none";
            });
        }
        var v = getObj(m + "_value");
        if (v != null) {
            v.value = "";
        }

    }
    var reLoadPriceSpan = getObj("reLoadPriceSpan");

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
               // alert("购买的商品数量必须大于0");
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
            var v = getObj(m + "_value");
            if (v.value) {
                if (count > 0) {
                    atts.append(",");
                    selectedtext.append(",");
                }
                atts.append('"' + m + '":' + '"' + v.value + '"');
                var t = getObj(v.value);
                selectedtext.append($(t).text());
                count++;
            }
            numAttr++;
        }
        if (selectedtext.toString().length > 7) {
            getObj("selectedtext").innerHTML = selectedtext.toString();
        } else {
            getObj("selectedtext").innerHTML = "";
        }
        if(numAttr == count){
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
        if (jQuery.trim(responseText)) {
            var result = JSON.parse(responseText);
            if (result) {
//                reLoadPriceSpan.innerHTML = result.moneyTypeName + "<em>" + result.formatUnitPrice + "</em>";
                if (result.formatUnitPrice) {
                    reLoadPriceSpan.innerHTML = result.formatUnitPrice;
                    getObj("productPriceSkuId").innerHTML= result.skuId;
                    if (result.zeroSellable == "1") {
                        getObj("stock").innerHTML = parseInt(result.zeroSellCount);
                    } else {
                        getObj("stock").innerHTML = parseInt(result.sellableCount);
                    }
                    var innerhtml = "<a href=\"javascript:;\" onclick=\"addToCart();\"></a>";

                    if (Number(getObj("stock").innerHTML) <= 0) {
//                    innerhtml = "<img src='- + shopStyle + -/images/detail_quehuo.gif'/*tpa=http://www.jfshare.com/templates/merchant/template_jfshare_xj/js/" + shopStyle + "/images/detail_quehuo.gif*//>"
                        innerhtml = "<a href=\"" + frontPath + "/member/outofstockregister.jsp?id=" + result.pid + "\"><img src=\"" + shopStyle + "/images/quehuo.gif\"/ width=55 height=20></a>";
                    }
                    if (getObj("buyimgdiv")) {
                        getObj("buyimgdiv").innerHTML = innerhtml;
                    }
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
                } else {
                    var innerhtml = "<a href=\"" + frontPath + "/member/outofstockregister.jsp?id=" + result.pid + "\"><img src=\"" + shopStyle + "/images/quehuo.gif\"/></a>";
                    if (getObj("buyimgdiv")) {
                        getObj("buyimgdiv").innerHTML = innerhtml;
                    }
                }
            }
        }

    }

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
            var v = getObj(strValues[i] + "_value");
            if (v.value == "" || !v.value) {
                s = false;
            }
        }
    }

    if (!s) {
        getObj("selectedtext").innerHTML = buffer;
        return s;
    }
    if(empty(amount)) {
         amount = getObj("amount");
    }
    if (amount.value == "") {
        amount.focus();
        alert("请填写要购买的商品数量");
        s = false;
    }
    if (checknumber(amount.value)) {
        amount.focus();
        alert("您填写购买的商品数量不是有效的数字");
        s = false;
    } else {
        if (amount.value == "0") {
            amount.value = '1'
            s = false;
        }
        if (amount.value == "999" || amount.value.length > 3) {
            amount.focus();
            alert("尊敬的客户您订购的数量太多,请您与客服或与商家联系");
            s = false;
        }
        var productPriceSkuId = jQuery("#productPriceSkuId").html();
        var responseCount = jQuery.ajax({url:frontPath + "/shopping/handle/get_product_buy_count.jsp?dumy=" + Math.random(),data:{productId:pid,skuId:productPriceSkuId},async:false,cache:false}).responseText;
        responseCount = Number(jQuery.trim(responseCount)) ;
        var buycount = nowStock - securitySellableCount ;
        if (Number(amount.value) <= Number(buycount)) {
            if (Number(canspecialcount) > 0) {
                if ((Number(amount.value )+ Number(responseCount)) > Number(canspecialcount)) {
                    alert("您选购的商品已达到特价限购数量!");
                    amount.value = Number(canspecialcount) - responseCount;
                        s = false;
                }
            } else if (Number(canspecialcount) < 0) {
                alert("您已达到此特价商品的限制数量, 谢谢惠顾!");
                s = false;
            }
           if((Number(amount.value)+ Number(responseCount)) > Number(buycount)){
               if(responseCount > 0){
                   alert("对不起，库存不足，您的购物车已有该商品"+responseCount+"件!");
               }else{
                   alert("对不起，库存不足!");
               }
                 s = false;
            }
        }else {
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
function addToCart(id) {
    var pid = id;
    if(pid=='undefined' || pid==null || pid ==''){
        pid = jQuery("#id").val();
    }
    var options = {
        success:loadAddShoppingCartResult,
        beforeSubmit:checkBuyForm
    };
    $("#addToCartform" + pid).ajaxSubmit(options);
    //return false;
}

//todo
function loadAddShoppingCartResult(responseText, statusText) {
    if (statusText == "success") {
        var data = $.trim(responseText);
        var dataArray = data.split("---");
        if (dataArray[0] == "ok") {
            var result = JSON.parse(dataArray[1]);
            getObj("totalAmount" + pid).innerHTML = result.productAmount;
            getObj("totalPrice" + pid).innerHTML = result.moneyTypeName + result.formatTotalProductPrice;
            changecartOpen(pid);
        } else if (dataArray[0] == "4") {
            alert("对不起， 库存不足！");
        } else {
            alert("系统繁忙请稍候重试");
        }
    }
}

function changecartOpen(pid) {
    var clickId = $('#clickId').val();
    $("#product_cart" + pid).hide();
    $('#cartInfoTip' + pid).show();
    $("#loadHeadCart").load(layout + "/web/FInclude/include_cart.jsp", {async:false});
    setTimeout("$('#cartInfoTip' + pid).hide()",2000);
}


function decrease() {
    var productPriceSkuId = jQuery("#productPriceSkuId").html();
    var responseCount = jQuery.ajax({url:frontPath + "/shopping/handle/get_product_buy_count.jsp?dumy=" + Math.random(),data:{productId:pid,skuId:productPriceSkuId},async:false,cache:false}).responseText;
    responseCount = Number(jQuery.trim(responseCount)) ;
    var buycount = Number(nowStock - securitySellableCount - responseCount);
    onceMustBuyCount = Number(onceMustBuyCount);
    nowStock = Number(nowStock);
    var amounts = 1;
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
    var productPriceSkuId = jQuery("#productPriceSkuId").html();
    var responseCount = jQuery.ajax({url:frontPath + "/shopping/handle/get_product_buy_count.jsp?dumy=" + Math.random(),data:{productId:pid,skuId:productPriceSkuId},async:false,cache:false}).responseText;
    responseCount = Number(jQuery.trim(responseCount)) ;
    var buycount = Number(nowStock - securitySellableCount - responseCount);
    onceMustBuyCount = Number(onceMustBuyCount);
    nowStock = Number(nowStock);
    var amount = $("#amount");
    if (value == "") {
        amount.focus();
        alert("请输入购买的商品数量");
        return;
    }
    if (isNaN(value)) {
        amount.val(1);
        alert("您填写购买的商品数量不是有效的数字");
        return;
    }
    value = Number(value);
    if (value > buycount) {
        amount.val(buycount);
        if(responseCount > 0){
            alert("对不起，库存不足，您的购物车已有该商品"+responseCount+"件!");
        }else{
            alert("对不起，库存不足!");
        }
        return;
    }
    if (Number(canspecialcount) > 0) {
         if (Number(value) > (Number(canspecialcount) - Number(responseCount))) {
            amount.val(Number(canspecialcount) - responseCount);
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
        amount.val(onceMustBuyCount);
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
     var productPriceSkuId = jQuery("#productPriceSkuId").html();
    var responseCount = jQuery.ajax({url:frontPath + "/shopping/handle/get_product_buy_count.jsp?dumy=" + Math.random(),data:{productId:pid,skuId:productPriceSkuId},async:false,cache:false}).responseText;
    responseCount = Number(jQuery.trim(responseCount)) ;
    var buycount = Number(nowStock - securitySellableCount - responseCount);
    onceMustBuyCount = Number(onceMustBuyCount);
    nowStock = Number(nowStock);
    canspecialcount = Number(canspecialcount);
    if (Number(amount.val()) < buycount) {
        if (canspecialcount > 0) {
            amount.val(Number(amount.val()) + 1);
            if (Number(amount.val()) > (Number(canspecialcount) - Number(responseCount))) {
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
        amount.val(Number(buycount));
        if(responseCount > 0){
            alert("对不起，库存不足，您的购物车已有该商品"+responseCount+"件!");
        }else{
            alert("对不起，库存不足!");
        }
    }
}





