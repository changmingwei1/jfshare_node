var skuSelector;
var skuLayer;

$(function(){
    var skuSelectorConfigs = {
        getAttrsUrl: "/shopping/handle/v3/getProductAttrs.jsp",
        completeUrl: "/shopping/handle/v3/selectPresent.jsp",
        attr_container: ".attrBox",
        loadAfterEvent: {
            fireEvent: function () {
                doLoadProductAttrAfterEvent();
            }
        },
        completeAfterEvent: {
            fireEvent: function (data) {
                if (skuLayer) {
                    layer.close(skuLayer);
                }
                if(data.oc){
                    onDataChange(data.oc);
                }
            }
        }
    };
    skuSelector = new $.SkuSelector(skuSelectorConfigs);

    /**
     * 感兴趣商品滚动事件绑定
     */
    if($("#interestedProds").length > 0){
        $("#interestedProds").scrollByBtn({
            i:5,
            m:5,
            l:0,
            btnL:"interestedCtrlbL",
            btnR:"interestedCtrlbR",
            scrollWidth:950,
            numPerScroll:5,
            scrollEach:"li",
            timer:600
        });
    }
    if($("#historyProds").length > 0){
        $("#historyProds").scrollByBtn({
            i:5,
            m:5,
            l:0,
            btnL:"historyCtrlbL",
            btnR:"historyCtrlbR",
            scrollWidth:950,
            numPerScroll:5,
            scrollEach:"li",
            timer:600
        });
    }
    if($("#relatedProdsTabs li").length == 2){
        $("#relatedProdsTabs li").each(function(index){
            $(this).click(function(){
                var $curLi=$(this);
                if(!$curLi.hasClass("cur")){
                    $curLi.addClass("cur").siblings().removeClass("cur");
                    if(index==0){
                        $("#interestedProds").show().siblings().hide();
                        $("#historyCtrlbR").hide();
                        $("#historyCtrlbL").hide();
                        $("#interestedCtrlbR").show();
                        $("#interestedCtrlbL").show();
                    }
                    if(index==1){
                        $("#historyProds").show().siblings().hide();
                        $("#interestedCtrlbR").hide();
                        $("#interestedCtrlbL").hide();
                        $("#historyCtrlbR").show();
                        $("#historyCtrlbL").show();
                    }
                }
            });
        });
    }
    /**
     * 减小数量绑定事件
     */
    $(".m_minus").live("click", function () {
        var currObj = $(this);
        var numberObj = $(this).siblings("input");
        var currentNumber = parseInt(numberObj.val());
        if (currentNumber > 1) {
            changeAmount(numberObj.attr("itemId"), currentNumber - 1, numberObj.attr("cartId"));
        }else{
            var layerObj = currObj.nextAll(".amountLayer");
            if(layerObj){
                layerObj.find("s").attr("class","ic1");
                layerObj.show("fast",function(){
                    var obj = $(this);
                    window.setTimeout(function(){
                        obj.hide("normal");
                    },3000);
                });
            }
        }
    });

    /**
     * 增加数量绑定事件
     */
    $(".m_plus").live("click", function () {
        var numberObj = $(this).siblings("input");
        var currentNumber = parseInt(numberObj.val());
        changeAmount(numberObj.attr("itemId"), currentNumber + 1, numberObj.attr("cartId"));
    });

    /**
     * 修改数量绑定事件
     */
    $("input.m_number").live("keyup blur",function(event){
        if(event.type == "keyup" && event.keyCode != 13){
            return false;
        }
        var numberObj = $(this);
        var currentNumber = parseInt(numberObj.val());
        if(isNaN(currentNumber)){
            alert("数量必须是数字，请重新输入！");
            return false;
        }else if(currentNumber == 0){
            alert("数量必须大于0");
            numberObj.val("1");
            return false;
        }
        changeAmount(numberObj.attr("itemId"),currentNumber,numberObj.attr("cartId"));
    });

    /**
     * 删除购物车项绑定事件
     */
    $(".a_deleteItem").live("click",function(event){
        var currObj = $(this);
        var parentObj = currObj.closest(".operate_box");
        $(".layer_box",parentObj).slideDown("fast");
        event.stopPropagation();
    });

    /**
     * 删除购物车项层_关闭
     */
    $(".cancel_delete").live("click",function(){
        var currObj = $(this);
        var parentObj = currObj.closest(".layer_box");
        parentObj.slideUp("fast");
    });

    /**
     * 确认删除购物车项
     */
    $(".confirm_delete").live("click",function(){
        var currObj = $(this);
        var parentObj = currObj.closest(".operate_box");
        deleteItem(parentObj.attr("itemId"),parentObj.attr("cartId"));
    });

    /**
     * 绑定全局事件，用于点击其他地方关闭删除的层
     */
    $(document).click(function(event){
        var layer = $(".layer_box:visible");
        if(layer && $(event.target).closest(".layer_box").length == 0){
            layer.slideUp("fast");
        }
    });

    /**
     * 购物项加入收藏
     */
    $(".a_favProduct").live("click",function(){
        favoriteProduct($(this).attr("productId"));
    });

    /**
     * 规则选择
     */
    $("input.ruleSelector").live("change",function(){
        var $e = $(this);
        var itemId = $e.attr("itemid");
        var cartId = $e.attr("cartid");
        var ruleId = $e.val();
        var checked = $e.attr("checked");
        var excludeIds = $e.siblings("a").attr("excluded");
        if(checked){
            checked=true;
        }
        else{
            checked=false;
        }
        changeUserSelection(cartId,itemId,ruleId,checked, excludeIds);
    });

    $("a.showExcluded").live("click",function(event){
        var $e =  $(this).siblings("input");
        var itemId = $e.attr("itemid");
        var cartId = $e.attr("cartid");
        $(".excluded").removeClass("excluded");
        var excluded = $(this).attr("excluded");
        var ids = excluded.split(",");
        var domId;
        for(var i=0; i<ids.length;i++){
            if(itemId){
                domId ="#r_" + itemId +"_" + ids[i];
            }
            else{
                domId =  "#r_" + ids[i];
            }
            $(domId).addClass("excluded");
        }
        $(this).addClass("excluded");
    });

    $(".buyPresent").live("click",function(){
        var currObj = $(this);
        var itemId = currObj.attr("itemId");
        var ruleId = currObj.attr("ruleId");
        var productId = currObj.attr("productId");
        var cartId = currObj.attr("cartId");
        var needChooseSku = currObj.attr("needChooseSku");
        if(needChooseSku && needChooseSku == "true"){
            var config = {itemId:itemId,ruleId:ruleId,productId:productId,cartId:cartId};
            skuSelector.load(config);
        }else{
            selectPresent(itemId,ruleId,productId,cartId);
        }
    });

    $(".selectPresentSku").live("click",function(){
        var currObj = $(this);
        var itemId = currObj.attr("itemId");
        var ruleId = currObj.attr("ruleId");
        var productId = currObj.attr("productId");
        var cartId = currObj.attr("cartId");
        var oldSelectedSkuId = currObj.attr("skuId");
        var config = {itemId:itemId,ruleId:ruleId,productId:productId,oldSelectedSkuId:oldSelectedSkuId,cartId:cartId};
        skuSelector.load(config);
    });

    $(".deletePresent").live("click",function(){
        var currObj = $(this);
        var itemId = currObj.attr("itemid");
        var ruleId = currObj.attr("ruleid");
        var productId = currObj.attr("productid");
        var cartId = currObj.attr("cartId");
        deletePresent(itemId,ruleId,productId,cartId);
    });

    $(".batchDelete").live("click",function(event){
        var checkedItem = $("input.item_check:checked");
        if(checkedItem.length > 0){
            var ids="",data={},count=checkedItem.length-1;
            checkedItem.each(function(){
                var obj=$(this);
                if(data[obj.attr("cartId")]==undefined){
                    data[obj.attr("cartId")]=[];
                    data[obj.attr("cartId")].push(obj.val());
                }else{
                    data[obj.attr("cartId")].push(obj.val());
                }
            });
            if (confirm("确定要删除选中的商品吗？")) {
                batchDeleteItem(JSON.stringify(data));
            }
        }else{
            alert("请先选择需要删除的商品！");
            return;
        }
    });

    $("input.check_all").live("click",function () {
        var bool = false;
        bool = this.checked ? true : false;
        var count = 0;
        $("input.item_check").each(function(){
            if(!this.disabled){
                this.checked = bool;
                count++;
            }
        });
        if(count > 0){
            selectCartItem("_all","_all",bool);
        }else{
            this.checked = false;
        }
    });

    $("input.item_check").live("click",function(){
        var cartId = $(this).attr("cartId");
        var itemKey = $(this).val();
        var checked = this.checked;
        selectCartItem(cartId,itemKey,checked);
    })

    $(".batchFavor").live("click",function(event){
        var checkedItem = $("input.item_check:checked");
        if(checkedItem.length > 0){
            var ids="",data=[];
            checkedItem.each(function(){
                var obj=$(this);
                var productId=obj.attr("productId");
                if(productId!= undefined && productId != null){
                    data.push(productId);
                }
            });
            batchFavorProduct(data.join(","));
        }else{
            alert("请先选择需要收藏的商品！");
            return;
        }
    });

    $(".favProduct").live("click",function(event){
        var obj  = $(this);
        favoriteProduct(obj.attr("productId"));
    });

    $("input.selectSku").live("click",function(event){
        var $this = $(this);
        var itemId = $this.attr("itemId");
        var skuId = $this.attr("skuId");
        var ruleId=$this.attr("ruleId");
        var cartId=$this.attr("cartId");
        var productId = $this.attr("productId");
        var num = $("input.num[skuId='"+skuId +"']",$this.parent.parent).val();
        selectPresentSku(itemId,ruleId,productId,skuId,cartId);
    });

    $(".chooseSku").live("click",function(event){
        var $this = $(this);
        var productId = $this.attr("productId");
        var merchantId=$this.attr("merchantId");
        var itemId = $this.attr("itemId");
        var maxNum = $this.attr("maxNum");
        var ruleId = $this.attr("ruleId");
        var cartId = $this.attr("cartId");
        chooseSku(productId,merchantId,maxNum,itemId,ruleId,cartId,$this);
    });

    $(".delSku").live("click",function(event){
        var $this = $(this);
        var productId = $this.attr("productId");
        var merchantId=$this.attr("merchantId");
        var itemId = $this.attr("itemId");
        var maxNum = $this.attr("maxNum");
        var ruleId = $this.attr("ruleId");
        var cartId = $this.attr("cartId");
        var skuId = $this.attr("skuId");
        deleteSku(ruleId,skuId,productId,maxNum,itemId,cartId);
    });

    /**
     * “去结算”按钮绑定事件。
     */
    $(".goOrderForm").live("click",function(){
        var cartId = $(this).attr("cartKey");
        for(var i=0; i<ocs.length; i++){
            var oc = ocs[i];
            if(oc.cartKey == cartId){
                for(var j=0; j<oc.buyItems.length;j++){
                    var item = oc.buyItems[j];
                    if(item.checked){
                        return true;
                    }
                }
            }
        }
        alert("请至少选中一个商品！");
        return false;
    });

    $(".moreRule").live("click",function(){
        var curObj = $(this);
        var itemKey = curObj.attr("itemKey");
        var moreRule = $("#"+itemKey+"_MoreRule");
        if(moreRule.is(":hidden")){
            moreRule.show();
            curObj.html("收起更多优惠");
        } else{
            moreRule.hide();
            curObj.html("查看更多优惠");
        }
    });

    if(!window.ocs){
        window.ocs = [oc];
    }

    drawCarts(ocs);

});


function onDataChange(newOc){
    if(newOc instanceof Array){
        window.ocs = newOc;
    }else{
        var cartType = newOc.cartType;
        for(var i=0; i<window.ocs.length;i++){
            var oc = window.ocs[i];
            if(oc.cartKey===newOc.cartKey){
                window.ocs[i] = newOc;
                if(newOc.buyItems===null || newOc.buyItems.length==0){
                    window.ocs.splice(i,1);
                }
                break;
            }
        }

        if(newOc.buyItems.length == 0){
            if(cartType == "group"){
                document.location.href = "/shop/tuan/index.jsp?m=m_100";
            }else if(cartType == "panic"){
                document.location.href = "/shop/qiang/index.jsp?m=m_100";
            }else{
                document.location.href = "cart.jsp";
            }
            return;
        }
    }

    drawCarts(window.ocs);
    if(window.onOcChange){
        window.onOcChange(newOc);
    }
}

function deleteSku(ruleId,skuId,productId,num,itemId,cartId){
    $.post("handle/v3/selectSku.jsp",{ruleId:ruleId,skuId:skuId,productId:productId,num:num,itemId:itemId,cartId:cartId,action:'delete',mode:window.mode},function(data){
        if(data.state=='ok'){
            onDataChange(data.oc);
        }
        else{
            alert(data.msg);
        }
    },"json");
}

function checkOc(oc){
    var buyItems = oc.buyItems;
    for(var i=0; i<buyItems.length; i++){
        var item = buyItems[i];
        if(!item.skuId){
            return false;
        }
        var freePresents = item.freePresents;
        if(freePresents){
            for(var j=0;j<freePresents.length;j++){
                var present = freePresents[j];
                if(!present.skuId){
                    return false;
                }
            }
        }
        var lowPricePresents = item.lowPricePresents;
        if(lowPricePresents){
            for(var j=0;j<lowPricePresents.length;j++){
                var present = lowPricePresents[j];
                if(!present.skuId){
                    return false;
                }
            }
        }
    }
    var freePresents = oc.freePresents;
    if(freePresents){
        for(var j=0;j<freePresents.length;j++){
            var present = freePresents[j];
            if(!present.skuId){
                return false;
            }
        }
    }
    var lowPricePresents = oc.lowPricePresents;
    if(lowPricePresents){
        for(var j=0;j<lowPricePresents.length;j++){
            var present = lowPricePresents[j];
            if(!present.skuId){
                return false;
            }
        }
    }
    return true;
}
function selectSku(ruleId,skuId,productId,num,itemId,cartId){
    $.post("handle/v3/selectSku.jsp",{ruleId:ruleId,skuId:skuId,productId:productId,num:num,itemId:itemId,cartId:cartId,action:'add',mode:window.mode},function(data){
        if(data.state=='ok'){
            onDataChange(data.oc);
        }
        else{
            alert(data.msg);
        }
    },"json");

}
function chooseSku(productId,merchantId,maxNum,itemId,ruleId,cartId,elem){
    $.post("handle/v3/productSkuList.jsp",{"productId":productId,"merchantId":merchantId,mode:window.mode},function(data){
        data.maxNum = maxNum;
        data.productId = productId;
        data.itemId = itemId;
        data.ruleId = ruleId;
        data.cartId = cartId;
        var html = $("#chooseSkuTemplate").render(data);
//        $.colorbox({html:html,open:true});
        $.layer({
            type: 1,
            title: "请选择规格",
            shade : [0.5 , '#000' , true],
            area: ['430px', '240px'],
            page: {
                html: html,
                ok: function(){}
            }
        });

    },"json");
}

function deleteItem(itemId,cartId){
    $.post("handle/v3/deleteCartItem.jsp",{"itemId":itemId,"cartId":cartId,"mode":window.mode},function(data){
        if(data.state=='ok'){
            onDataChange(data.oc);
        }else{
            alert(data.msg);
        }
    },"json");
}

function batchDeleteItem(jsonString){
    $.post("handle/v3/batchDeleteItem.jsp",{"jsonString":jsonString,mode:window.mode},function(data){
       if(data.state=='ok'){
            onDataChange(data.oc);
        }else{
            alert(data.msg);
        }
    },"json");
}

function selectCartItem(cartId,itemKey,checked){
    $.post("handle/v3/selectCartItems.jsp",{"cartId":cartId,"itemKey":itemKey,"checked":checked,"mode":window.mode},function(data){
        if(data.state=='ok'){
            onDataChange(data.oc);
        }else{
            alert(data.msg);
        }
    },"json");
}
function deletePresent(itemId,ruleId,productId,cartId){
    $.post("handle/v3/deletePresentEx.jsp",{"itemId":itemId,"ruleId":ruleId,"cartId":cartId,productId:productId,mode:window.mode},function(data){
        if(data.state=='ok'){
            onDataChange(data.oc);
        }else{
            alert(data.msg);
        }
    },"json");
}

function selectPresent(itemId,ruleId,productId,cartId){
    $.post("handle/v3/selectPresent.jsp",{"itemId":itemId,"ruleId":ruleId,"cartId":cartId,productId:productId,mode:window.mode},function(data){
        if(data.state=='ok'){
            onDataChange(data.oc);
        }else{
            alert(data.msg);
        }
    },"json");
}

function selectPresentSku(itemId,ruleId,productId,skuId,cartId){
    $.post("handle/v3/selectPresent.jsp",{"itemId":itemId,"ruleId":ruleId,"cartId":cartId,productId:productId,skuId:skuId,mode:window.mode},function(data){
        if(data.state=='ok'){
            onDataChange(data.oc);
        }else{
            alert(data.msg);
        }
    },"json");
}

function changeUserSelection(cartId,itemId,ruleId,selected,excludeIds){
    $.post("handle/v3/changeUserSelection.jsp",{"itemId":itemId,"selected":selected,"excludeIds":excludeIds,"cartId":cartId,"ruleId": ruleId,mode:window.mode},function(data){
        if(data.state=='ok'){
            onDataChange(data.oc);
        }else{
            alert(data.msg);
        }
    },"json");
}


function changeAmount(itemId,toNumber,cartId){
    $.post("handle/v3/changeAmount.jsp",{"itemId":itemId,"toNumber":toNumber,"cartId":cartId,mode:window.mode},function(data){
        if(data.state=='ok'){
            onDataChange(data.oc);
        }else{
            if(window.onOcChange){
                onDataChange(window.oc);
            }else{
                onDataChange(window.ocs);
            }
            alert(data.msg);
        }
    },"json");
}

function batchFavorProduct(ids) {
    $.post("/member/handle/favorite_add_handler.jsp", {ids:ids,tag:"batchFavor",type:"product",mode:window.mode}, function(data){
        var result = jQuery.trim(data);
        if (result == "ok") {
            alert("已收藏选中的商品！");
        } else if (result == "existed") {
            alert("您选中的商品都已收藏过!");
        } else if(result == "none"){
            //alert("很抱歉，您需要登录后才能收藏商城商品，！");
            document.location.href="/login/sign_in.jsp?redirectURL=" + encodeURIComponent("/shopping/cart.jsp");
        }else{
            alert("很抱歉，收藏商品失败，请稍候重试！");
        }
    });
}

function favoriteProduct(pid) {
    var params = new Object();
    params["objId"] = pid;
    params["type"] = "product";
    jQuery.post("/member/handle/favorite_add_handler.jsp", params, function (msg) {
        var data = jQuery.trim(msg);
        if (data == "none") {
            document.location.href="/login/sign_in.jsp?redirectURL=" + encodeURIComponent("/shopping/cart.jsp");
        } else if (data == "ok") {
            alert("商品收藏成功！");
        } else if (data == "existed") {
            alert("此商品已收藏过!");
        } else {
            alert("系统繁忙请稍后再试!");
        }
    });
}

function doLoadProductAttrAfterEvent() {
    if (!skuSelector) {
        return;
    }
    var html = '<div style="margin: 5px;">';
    html += '<div class="attrBox"><div class="frame">';
    html += '<ul>';
    for (var i = 0; i < skuSelector.attrs.length; i++) {
        var attr = skuSelector.attrs[i];
        html += '<li class="choose ver">';
        html += '<span>' + attr.name + '：</span>';
        html += '<div>';
        if (attr.values) {
            for (var j = 0; j < attr.values.length; j++) {
                var value = attr.values[j];
                html += '<a href="javascript:;" class="doClickValue" attrId="' + attr.id + '" valueId="' + value.id + '">' + value.name + '<i></i></a>';
            }
        }
        html += '</div>';
        html += '</li>';
    }
    html += '<ul></div>';
    html += '<div class="tips"></div>';
    html += '<div class="btns"><a href="javascript:;" class="btn_01 doSelectSkuBtn">确认</a></div>';
    html += '</div></div>';

    skuLayer = $.layer({
        type: 1,
        title: "请选择规格",
        shade: [0.3 , '#000' , true],
        area: ['430px', '260px'],
        page: {
            html: html,
            ok: function () {
            }
        }
    });
}

function closeWindow() {
    parent.window.opener = null;
    parent.window.open("", "_self");
    parent.window.close();
}

