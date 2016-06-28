function closeAddFrovite(pid) {
    $('#addfavoriteLayer' + pid).hide();
}
function favoriteProduct(pid, stylePath, layout, flag, remarkid) {
    var params = new Object();
    params["objId"] = pid;
    params["stylePath"] = stylePath;
    params["layout"] = layout;
    params["type"] = "product";
    $.ajaxSettings['contentType'] = "application/x-www-form-urlencoded; charset=utf-8";
    $.post(frontPath + "/common_handle/favor_add_handler.jsp", params, function(msg) {
        var data = $.trim(msg);
        if (data == "none") {
            alert("您暂未登录，无法收藏该商品！");
            checkLogin(pid, stylePath, layout, flag, remarkid);
        } else if (data == "ok") {
            $('#addfavoriteLayer' + pid).show();
        } else if (data == "existed") {
            alert("此商品已收藏过!");
        } else {
            alert("系统繁忙请稍后再试！");
        }

    });
}
function checkLogin(pid, stylePath, layout, flag, remarkid) {
    params = new Object();
    params["pid"] = pid;
    params["stylePath"] = stylePath;
    params["layout"] = layout;
    params["flag"] = flag;
    params["favoriteId"] = pid;
    $("#favoriteLoginLayer" + pid).load(frontPath + "/ajax/login.jsp", params, function() {
        $('#favoriteLoginLayer' + pid).show();
    });
}

/* input have */
/*function borderhave(border)
{
    border.className='border_have';
}
function bordernone(border)
{
    border.className='border_none';
}*/

function closeProductCart(id) {
    $('#product_cart' + id).hide();
}
function showProductCart(id, name, layout) {
    var carts =jQuery("div[class=cartlayer][name=product_cart]");
    for(var num=0; num < carts.length; num++){
        carts[num].style.display = "none";
    }
    var cartsSpan =jQuery("div[class=cartlayer][name=cartInfoTip_cart]");
    for(num=0; num < cartsSpan.length; num++){
        cartsSpan[num].style.display = "none";
    }
    $("#product_cart" + id).load(
        frontPath + "/ajax/include_cart.jsp",
        {id:id,name:name,m:mid,layout:layout,stylePath:stylePath},
        function() {
            $(this).show();
        }
    )
}

function closeCartOpen(pid) {
    $('#cartInfoTip'+pid).hide();
}
function checkShopSearchForm2(theForm) {
    if (theForm.keyword.value == "请输入关键字") {
        theForm.keyword.value = "";
    }
}
function displayHeadSorts2() {
    $("#sortLay2").show();
}
function hiddenHeadSorts2() {
    $("#sortLay2").hide();
}
function getElementsByClassName(n) {
    var classElements = [],allElements = document.getElementsByTagName('*');
    for (var i = 0; i < allElements.length; i++) {
        if (allElements[i].className == n) {
            classElements[classElements.length] = allElements[i];
        }
    }
    return classElements;
}

function changestyle(id) {
    var v = document.getElementById("div_" + id);
    var subBarClassElements = getElementsByClassName('subBar');
    if (v.style.display == "") {
        v.style.display = "none";
    } else {
        for (var i = 0; i < subBarClassElements.length; i++) {
            subBarClassElements[i].style.display = "none";
        }
        v.style.display = "";
    }
}
function buy(pid) {
    alert("商品" + pid + "已放入购物车");
}
function upDownInfo() {
    var liElements = getElementsByClassName('hideLi');
    var image = document.getElementById("upDown");
    for (var i = 0; i < liElements.length; i++) {
        if (liElements[i].style.display == "") {
            image.src = "${stylePath}/images/list_sideBar_Btn.jpg"/*tpa=http://www.jfshare.com/templates/merchant/template_jfshare_xj/js/${stylePath}/images/list_sideBar_Btn.jpg*/;
            liElements[i].style.display = "none";
        } else {
            image.src = "${stylePath}/images/detail_cat_icon3.jpg"/*tpa=http://www.jfshare.com/templates/merchant/template_jfshare_xj/js/${stylePath}/images/detail_cat_icon3.jpg*/;
            liElements[i].style.display = "";
        }
    }
}
function gotobyorderBy(orderBy) {
    var href = frontPath + "/mall/searchList.jsp?${fun:getQueryFilterString(pageContext.request,'UTF-8','orderPrice')}";
    if (orderBy != "-1") {
        href = href + "&orderPrice=" + orderBy;
    }
    window.location.href = href;
}

function checkPriceForm(theForm) {
    if (!(/^\d+$/.test(theForm.lowPrice.value)) || !(/^\d+$/.test(theForm.highPrice.value))) {
        alert("请输入正确的正整数！");
        return false;
    } else {
        if (theForm.lowPrice.value == "0") {
            theForm.lowPrice.value = "";
        }
        if (theForm.highPrice.value == "0") {
            theForm.highPrice.value = "";
        }
        return true;
    }
}

function checkPrice1(){
    var theForm = document.getElementById("priceSeachForm");
    theForm.lowPrice.value = "0";
    theForm.highPrice.value = "50";
    theForm.onsubmit = checkPriceForm(theForm);

}
function checkPrice2(){
    var theForm = document.getElementById("priceSeachForm");
    theForm.lowPrice.value = "50";
    theForm.highPrice.value = "100";
    theForm.onsubmit = checkPriceForm(theForm);
}

function checkPrice3(){
    var theForm = document.getElementById("priceSeachForm");
    theForm.lowPrice.value = "100";
    theForm.highPrice.value = "200";
    theForm.onsubmit = checkPriceForm(theForm);
}
function checkPrice4(){
    var theForm = document.getElementById("priceSeachForm");
    theForm.lowPrice.value = "200";
    theForm.highPrice.value = "100000000000000000000" ;
    theForm.onsubmit = checkPriceForm(theForm);
}

/*function button1(){
    var theForm = document.getElementById("priceSeachForm");
    alert("hello");
    checkPriceForm(theForm);
}*/

/* 积分筛选 */
function checkIntegralForm(theForm){
    if (!(/^\d+$/.test(theForm.LIntegralPrice.value)) || !(/^\d+$/.test(theForm.hIntegralPrice.value))) {
        alert("请输入正确的正整数！");
        return false;
    } else {
        if (theForm.LIntegralPrice.value == "0") {
            theForm.LIntegralPrice.value = "";
        }
        if (theForm.hIntegralPrice.value == "0") {
            theForm.hIntegralPrice.value = "";
        }
        return true;
    }
}



//此加入购物车并没有考虑 库存属性的方法
function addCartList(id, name, layout,userId){
    var params = new Object();
    params["mid"] = "m_100";
    params["id"] = id;
    params["histroyColumnId"] = '';
    params["userId"] = userId;
    jQuery.ajaxSettings['contentType'] = "application/x-www-form-urlencoded; charset=utf-8";
    jQuery.post(frontPath + "/shopping/handle/cart_add_handler.jsp", params, function (msg) {
        var data = jQuery.trim(msg);
        if (data != null || data != "") {
            var dataArray = data.split("---");
            if (dataArray != null) {
                var str = dataArray[0];
                if (str == "ok") {
                    window.location.href = frontPath + "shopping/cart.jsp";
                }
            }
        }
    });
}