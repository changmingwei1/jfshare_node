var sumoprice;
var sumprice;
var count = 0;
function unitAll() {
    if (typeof prodJson != "undefined" && prodJson != -1) {
        for (var i = 0; i < prodJson.length; i++) {
            if (i != 0) {
//                tools.getObj("bestcheck_" + prodJson[i].objId).innerHTML = "<span onclick=oncheckbox('" + prodJson[i].objId + "')></span>";
                 tools.getObj("bestcheck_" + prodJson[i].objId).innerHTML = "<input type=checkbox onclick=oncheckbox('" + prodJson[i].objId + "') ></input>";
                jQuery("#bestli" + prodJson[i].objId).attr("class", "");
                jQuery("#ck" + prodJson[i].objId).attr("checked", false);
            } else {
                tools.getObj("bestcheck_" + prodJson[i].objId).innerHTML = "<input type=checkbox checked=checked onclick=nocheckbox('" + prodJson[i].objId + "')></input>";
                jQuery("#ck" + prodJson[i].objId).attr("checked", true);
                count = 1;
            }
        }
        var basemarketprice = parseFloat(prodJson[0].basemarketprice);
        var marketprice =  parseFloat(prodJson[0].marketprice);
        if(isNaN(basemarketprice)){
            basemarketprice = parseFloat(prodJson[0].basememberprice);
        }
        if(isNaN(marketprice)){
            marketprice = parseFloat(prodJson[0].memberprice);
        }
        sumoprice = basemarketprice+ marketprice;

        sumprice = parseFloat(prodJson[0].basememberprice) + parseFloat(prodJson[0].memberprice);
        showsumprice(sumoprice, sumprice);
    }
}
function showsumprice(sumoprice, sumprice) {
    jQuery("#sumopriceDiv").html("\uffe5" + changeTwoDecimal_f(sumoprice));
    jQuery("#sumpriceDiv").html("\uffe5" + changeTwoDecimal_f(sumprice));
    jQuery("#nm").html(count);
    var savprice = changeTwoDecimal_f(sumoprice) - changeTwoDecimal_f(sumprice)
    jQuery("#saveprice").html("\uffe5" + parseFloat(savprice).toFixed(2));
}
function tomatchjsonid(id) {
    for (var i_id = 0; i_id < prodJson.length; i_id++) {
        if (prodJson[i_id].objId == id) {
            return i_id;
        }
    }
    return -1;
}
function nocheckbox(id) {
    tools.getObj("bestcheck_" + prodJson[tomatchjsonid(id)].objId).innerHTML = "<input type=checkbox onclick=oncheckbox('" + prodJson[tomatchjsonid(id)].objId + "') ></input>";
    if (count <= 1) {
        tools.getObj("bestcheck_" + prodJson[tomatchjsonid(id)].objId).innerHTML = "<input type=checkbox onclick=nocheckbox('" + prodJson[tomatchjsonid(id)].objId + "') class='cur'></input>";
        jQuery("#bestli" + prodJson[tomatchjsonid(id)].objId).attr("class", "cur");
		alert("请至少保留一件商品。");
        return false;
    } else {
        count--;
        jQuery("#ck" + prodJson[tomatchjsonid(id)].objId).attr("checked", false);
		jQuery("#bestli" +prodJson[tomatchjsonid(id)].objId).attr("class", "");
        sumoprice -= parseFloat(prodJson[tomatchjsonid(id)].marketprice);
        sumprice -= parseFloat(prodJson[tomatchjsonid(id)].memberprice);
        showsumprice(sumoprice, sumprice);
    }
}
function oncheckbox(id) {
    tools.getObj("bestcheck_" + prodJson[tomatchjsonid(id)].objId).innerHTML = "<input type=checkbox checked=checked onclick=nocheckbox('" + prodJson[tomatchjsonid(id)].objId + "') ></input>";
    count++;
    jQuery("#ck" + prodJson[tomatchjsonid(id)].objId).attr("checked", true);
	jQuery("#bestli" +prodJson[tomatchjsonid(id)].objId).attr("class", "cur");
    sumoprice += parseFloat(prodJson[tomatchjsonid(id)].marketprice);
    sumprice += parseFloat(prodJson[tomatchjsonid(id)].memberprice);
    showsumprice(sumoprice, sumprice);
}
function changeTwoDecimal_f(x) {
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        alert("\u4e24\u4f4d\u5c0f\u6570\u683c\u5f0f\u8f6c\u6362\u5931\u8d25\uff0c\u539f\u56e0\uff1a\u975e\u6570\u5b57\uff01");
        return false;
    }
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf(".");
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += ".";
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += "0";
    }
    return s_x;
}

function checkBestToCartForm(form){
     var destObjIds = new Array(), i_x = 0;
    for (var i = 0; i < prodJson.length; i++) {
        if (jQuery("#ck" + prodJson[i].objId).attr("checked")) {
            destObjIds[i_x++] =prodJson[i].objId;
        }
    }
    jQuery("#destObjIds").val(destObjIds);
	var params=$(form).serialize();
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

/*
function btnSubmits(){
     var form = document.getElementById("addBestToCartform");
    checkBestToCartForm(form)
}*/
