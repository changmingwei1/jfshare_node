/**
 * Created by lenovo on 2015/10/12.
 */
//页面设定参数
var itemList = null;
var invalidItemList = null;
/**
 * 渲染页面数据入口
 */
$(function() {
    rendData();
});

/**
 * 异步渲染页面各模块动态数据
 */
function rendData() {
    renderGuide();
    $.ajax({
        url: "/cart/list_cart",
        type: 'get',
        //async: false,
        success: function (data) {
            itemList = data.itemList;
            invalidItemList = data.invalidItemList;
            //alert(itemList.length);
            renderProduct();
            renderTotal();
            renderEvent();
        }
    })
}

/**
 * 渲染导购提示
 */
function renderGuide() {
    var fromBatchTip=""
    if (empty(fromBatch) || fromBatch == "1") {
        fromBatchTip = "立即购买";
    } else {
        fromBatchTip = "我的购物车";
    }
    var source   = $("#guide_show_template").html();
    var template = Handlebars.compile(source);
    $("#guidePanel").html(template({"fromBatchTip":fromBatchTip}));

    $("#fromBatch").val(fromBatch);
}

/**
 * 渲染商品
 * @param ocs
 */
function renderProduct(){
    if(empty(itemList)) {
        var source = $("#empty_cart_template").html();
        var template = Handlebars.compile(source);
        Handlebars.registerHelper('self_home_url', function () {
            return mstation_bath;
        });
        $("#cartBodyPanel").html(template());
    } else {
        var productlist = {};
        productlist.itemList = itemList;
        productlist.invalidItemList = invalidItemList;

        var source = $("#cart_head_template").html();
        var template = Handlebars.compile(source);
        $("#cartHeadPanel").html(template());

        var source = $("#cart_bottom_template").html();
        var template = Handlebars.compile(source);
        $("#cartBottonPanel").html(template());

        var source2 = $("#cart_body_template").html();
        var template2 = Handlebars.compile(source2);
        //自定义商品链接控件
        Handlebars.registerHelper('self_product_url', function (val1) {
            return empty(val1) ? "javascript:;" : "/product/" + val1;
        });
        //自定义图片链接控件
        Handlebars.registerHelper('self_pic_url', function (skuPic, imgKey) {
            if (!empty(skuPic)) {
                //console.log(img_bath + getZoomImg(skuPic, "60x60"));
                return img_bath + getZoomImg(skuPic, "60x60");
            } else if (!empty(imgKey)){
                img_src =imgKey.split(',');
                return img_bath + getZoomImg(img_src[0], "60x60");
            } else {
                return "javascript:;";
            }
        });
        //alert(itemList[0].seller.sellerName);
        $("#cartBodyPanel").html(template2(productlist));
    }
}


/**
 * 渲染结算信息
 */
function renderTotal() {
    var totalPayAmount = 0;
    var selected = getSelectedItem();
    for(var i in selected) {
        var curItem = selected[i];
        totalPayAmount =  Number(totalPayAmount) + Number(Number(Number(curItem.count).toFixed(2) * Number(curItem.price).toFixed(2)).toFixed(2));
        //alert(curItem.count + "," + curItem.price);
    }
    totalPayAmount = Number(totalPayAmount).toFixed(2);

    var totals = {"totalPostage":0,"totalFreePostage":0,"totalExchangeCash":0,"totalPayAmount":totalPayAmount};

    var source = $("#summary_bottom_template").html();
    var template = Handlebars.compile(source);
    Handlebars.registerHelper('self_home_url', function () {
        return mstation_bath;
    });
    $("#bottomPanel").html(template(totals));
}

/**
 * 渲染页面按钮事件
 */
function renderEvent() {
    /**
     * 减小数量绑定事件
     */
    $(".m_minus").live("click", function () {
        var currObj = $(this);
        var numberObj = $(this).siblings("input");
        var currentNumber = parseInt(numberObj.val());
        if (currentNumber > 1) {
            //alert(numberObj.attr("itemPrice"));
            changeAmount(numberObj, numberObj.attr("itemId"), currentNumber - 1, numberObj.attr("itemPrice"));
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
        changeAmount(numberObj, numberObj.attr("itemId"), currentNumber + 1, numberObj.attr("itemPrice"));
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
        changeAmount(numberObj, numberObj.attr("itemId"),currentNumber, numberObj.attr("itemPrice"));
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
        deleteItem(parentObj, parentObj.attr("itemId"));
    });

    $(".batchDelete").live("click",function(event){
        var checkedItem = $("input.item_check:checked");
        if(checkedItem.length > 0){
            if (confirm("确定要删除选中的商品吗？")) {
                var selected = getSelectedItem();
                batchDeleteItem(selected);
            }
        } else{
            alert("请先选择需要删除的商品！");
            return;
        }
    });

    /**
     * 绑定全局事件，用于点击其他地方关闭删除的层
     */
    $(document).click(function(event){
        var layer = $(".layer_box:visible");
        if(layer && $(event.target).closest(".layer_box").length == 0){
            //alert("关闭");
            //layer.slideUp("fast");
        }
    });

    /**
     * 选择所有
     */
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
            selectCartItem("_all",bool);
        }else{
            this.checked = false;
        }
    });

    /**
     * 选择一条sku
     */
    $("input.item_check").live("click",function(){
        //var cartId = $(this).attr("cartId");
        var itemKey = $(this).val();
        var checked = this.checked;
        selectCartItem(itemKey,checked);
    });

    /**
     * “去结算”按钮绑定事件。
     */
    $(".goOrderForm").live("click",function(){
        var checkedItem = $("input.item_check:checked");
        if(checkedItem.length > 0){
            var selected = getSelectedItem();
            //alert("待结算项" + selected.length);
            $("#fromBatch").val("2");
            $("#cartKeyList").val(JSON.stringify(selected));
            $("#confirmOrderform").attr("action","/order/add_confirm");
            $("#confirmOrderform").submit();
        } else {
            alert("请至少选中一个商品！");
            return false;
        }
    });
}

function changeAmount(numberObj, itemId,toNumber, toPrice){
    var itemKeys = itemId.split("#");
    var curItemKey = {productId:itemKeys[0], skuNum:(itemKeys.length > 1 ? itemKeys[1]: null)};
    var selected = getSelectedItem();
    //console.log(selected);
    $.post("/cart/update_cart",{"curItemKey":JSON.stringify(curItemKey),"toNumber":toNumber, "toPrice":toPrice, "selected":JSON.stringify(selected), mode:window.mode},function(data){
        if(data.status==200){
            numberObj.val(toNumber);
            var rowTotal = Number(Number(numberObj.val()) * Number(numberObj.attr("itemPrice")).toFixed(2)).toFixed(2);
            numberObj.parent().parent().next().find(".item_total").html(rowTotal);
            onDataChange();
        }else{
            alert(data.msg);
            //var layerObj = numberObj.nextAll(".amountLayer");
            //if(layerObj){
            //    var tipObj = layerObj.find("s").attr("class","ic1");
            //    alert(tipObj.val());
            //    layerObj.show("fast",function(){
            //        var obj = $(this);
            //        window.setTimeout(function(){
            //            obj.hide("normal");
            //        },3000);
            //    });
            //}
        }
    },"json");
}

function deleteItem(parentObj, itemId){
    var itemKeys = itemId.split("#");
    var curItemKey = {productId:itemKeys[0], skuNum:(itemKeys.length > 1 ? itemKeys[1]: null)};

    batchDeleteItem(parentObj, curItemKey);
}

function batchDeleteItem(parentObj, selected){
    $.post("/cart/delete_cart",{"selected":JSON.stringify(selected),"mode":window.mode},function(data){
        if(data.status==200) {
            //页面中删除行
            if (!empty(parentObj)) {
                parentObj.parent().parent().remove(); //删除当前行
                parentObj.slideUp("fast");
            } else {
                //删除选中行
                for (var i in selected) {
                    selected[i].obj.parent().parent().remove();
                }
            }
            onDataChange();
        }else{
            alert(data.msg);
        }
    },"json");
}

/**
 * 获取选中项
 * @returns {Array}
 */
function getSelectedItem() {
    var selected = [];
    $("input.item_check").each(function(){
        if(this.checked){
            var inputObj = $("input[itemId$='"+$(this).val()+"']");
            var itemKeys = $(this).val().split("#");
            selected.push({productId:itemKeys[0], skuNum:(itemKeys.length > 1 ? itemKeys[1]: null), count:inputObj.val(), price:inputObj.attr("itemPrice"), obj:$(this)});
        }
    });

    return selected;
}

/**
 * 渲染总计
 */
function onDataChange(){ //newOc
    //TODO check findListByCartKey
    renderTotal();
    //if(newOc instanceof Array){
    //    window.ocs = newOc;
    //}else{
    //    var cartType = newOc.cartType;
    //    for(var i=0; i<window.ocs.length;i++){
    //        var oc = window.ocs[i];
    //        if(oc.cartKey===newOc.cartKey){
    //            window.ocs[i] = newOc;
    //            if(newOc.buyItems===null || newOc.buyItems.length==0){
    //                window.ocs.splice(i,1);
    //            }
    //            break;
    //        }
    //    }
    //
    //    if(newOc.buyItems.length == 0){
    //        if(cartType == "group"){
    //            document.location.href = "/shop/tuan/index.jsp?m=m_100";
    //        }else if(cartType == "panic"){
    //            document.location.href = "/shop/qiang/index.jsp?m=m_100";
    //        }else{
    //            document.location.href = "cart.jsp";
    //        }
    //        return;
    //    }
    //}
    //
    //drawCarts(window.ocs);
    //if(window.onOcChange){
    //    window.onOcChange(newOc);
    //}
}



function selectCartItem(itemKey,checked){
    //if (checked) {
        onDataChange();
    //}
    //$.post("handle/v3/selectCartItems.jsp",{"cartId":cartId,"itemKey":itemKey,"checked":checked,"mode":window.mode},function(data){
    //    if(data.state=='ok'){
    //        onDataChange(data.oc);
    //    }else{
    //        alert(data.msg);
    //    }
    //},"json");
}