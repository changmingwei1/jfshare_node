/**
 * Created by lenovo on 2015/10/12.
 */
//页面设定参数
var addressEditor; //收货地址控件对象
var addresslist=null; //收货地址列表
var deliveryRuleSelector; //配送方式控件对象
var notDelivery=false; //是否需要配送方式
var paymentlist=null; //支付方式
var productType=null; //商品类型
/**
 * 渲染页面数据入口
 */
$(function() {
    $("#ssid").val(render_orderInfo.ssid);
    rendData();
});

/**
 * 异步渲染页面各模块动态数据
 * 默认收货地址、购物车信息、购物车商品查询
 */
function rendData() {
    renderGuide();
    $.ajax({
        url: "/order/address_list?t=" + new Date().getTime(),
        type: 'get',
        data:{ssid:$("#ssid").val()},
        dataType:'json',
        success: function (data) {
            //alert("success" + data[0].receiverName);
            if (data.status == 200) {
                addresslist = data.addressInfoList;
                //———新加 商品类型
                productType = localStorage.getItem("type");
                if(productType == 2){
                    //实物商品收货地址
                    renderAddress();
                    initCitylistEvent();
                }else if(productType == 3){
                    //虚拟商品收货
                    renderVirtual();
                }
            } else {
                alert(data.msg);
            }
        }
    })

    if (empty(fromBatch) || fromBatch == "1") {
        calcPostageAndAmountTotal();
        renderProduct();
        renderTotal();
    }

    renderActive();
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
 * 渲染收货地址
 */
function renderAddress() {
    addressEditor = new $.AddressEditor(addresslist, $("#consigneePanel"), "show");
    addressEditor.show();
}
function initCitylistEvent() {
    //点击选择省
    $("body").on("click", "ul.provbox a", function (c) {
        //alert("点击省 cc" + c);
        var d = $(this), e = d.parents("li");
        e.find(".js_postcode").val(""), e.find(".prov,.city,.dist").val("").end().find(".prov").val(d.attr("pid")).attr("txt", d.text()), e.find(".citylists .txt span").text(e.find(".prov").attr("txt")), e.find(".citylistinfo .hd span").removeClass("cur").eq(1).addClass("cur"), e.find(".provbox,.citybox,.distbox").hide(), e.find(".citybox").show().html(""), e.find(".distbox").html(""),
            //加载市
            $.ajax({
                url: "/nnc/citys.json?pid=" + d.attr("pid"),
                type: 'get',
                async: false,
                dataType: "json",
                success: function (c) {
                    if (200 == c.status && c.data.length > 0) {
                        //alert(e.find(".provbox"));
                        var f = new StringBuffer();
                        f.append("<li>"),
                            $.each(c.data, function (a, b) {
                                f.append('  <a pid="' + b.id + '" href="javascript:void(0)">' + b.name + "</a>  ")
                            }),
                            f.append("</li>"), e.find(".citybox").html("").append(f.toString()), e.find(".provbox").attr("temid") && "" != e.find(".provbox").attr("temid") && (d.parents(".citylistinfo").find(".citybox [pid=" + e.find(".provbox").attr("temid") + "]").click(), e.find(".provbox").removeAttr("temid"))
                    }
                }
            })
    })

    //点击选择市
    $("body").on("click", "ul.citybox a", function () {
        var c = $(this), d = c.parents("li");
        d.find(".js_postcode").val(""), d.find(".city,.dist").val("").end().find(".city").val(c.attr("pid")).attr("txt", c.text()), d.find(".citylists .txt span").text(d.find(".prov").attr("txt") + "/" + d.find(".city").attr("txt")), d.find(".citylistinfo .hd span").removeClass("cur").eq(2).addClass("cur"), d.find(".provbox,.citybox,.distbox").hide(), d.find(".distbox").show().html(""),
            //加载区县
            $.ajax({
                url: "/nnc/countries.json?pid=" + c.attr("pid"),
                type: 'get',
                async: false,
                dataType: "json",
                success: function (e) {
                    if (200 == e.status && e.data.length > 0) {
                        var f =  new StringBuffer();
                        f.append("<li>"),
                            $.each(e.data, function (a, b) {
                                f.append('  <a pid="' + b.id + '" pcode="' + b.postCode + '"  href="javascript:void(0)">' + b.name + "</a>  ")
                            }),
                            f.append("</li>"), d.find(".distbox").html("").append(f.toString()), d.find(".citybox").attr("temid") && "" != d.find(".citybox").attr("temid") && (c.parents(".citylistinfo").find(".distbox [pid=" + d.find(".citybox").attr("temid") + "]").click(), d.find(".citybox").removeAttr("temid"))
                    }
                }
            })
    })

    //点击区县
    $("body").on("click", "ul.distbox a", function () {
        var b = $(this), c = b.parents("li");
        return b.attr("pid") == c.find(".dist").val() ? !1 : (c.find(".dist").val(b.attr("pid")).attr("txt", b.text()), c.find(".citylists .txt span").text(c.find(".prov").attr("txt") + "/" + c.find(".city").attr("txt") + "/" + c.find(".dist").attr("txt")), c.find(".citylistinfo").hide(), void c.find(".js_postcode").val(b.attr("pcode")))
    })

    //切换省市区选择器页签
    $("body").on("click", ".citylistinfo .hd span", function () {
        var b = $(this), c = b.parents("li");
        if (b.index() == 0) {
            //加载省份
            $.ajax({
                url: "/nnc/provinces.json", // + JSON.stringify(queryParam),
                type: 'get',
                async: false,
                dataType: "json",
                success: function (p) {
                    if (200 == p.status && p.data.length > 0) {
                        var d = new StringBuffer(), e = new StringBuffer(), f = new StringBuffer(), g = new StringBuffer();
                        //alert(p.data[0]);
                        d.append("<li><label>A-G</label>"), e.append("<li><label>H-K</label>"), f.append("<li><label>L-S</label>"), g.append("<li><label>T-Z</label>"), $.each(p.data, function (a, b) {
                            b.initial = b.initial.toUpperCase(), b.initial <= "G" ? d.append('  <a pid="' + b.id + '" href="javascript:void(0)">' + b.name + "</a>  ") : b.initial > "G" && b.initial <= "K" ? e.append('  <a pid="' + b.id + '" href="javascript:void(0)">' + b.name + "</a>  ") : b.initial > "K" && b.initial <= "S" ? f.append('  <a pid="' + b.id + '" href="javascript:void(0)">' + b.name + "</a>  ") : b.initial > "S" && b.initial <= "Z" && g.append('  <a pid="' + b.id + '" href="javascript:void(0)">' + b.name + "</a>  ")
                        }), d.append("</li>"), e.append("</li>"), f.append("</li>"), g.append("</li>"), c.find(".citylistinfo").find("ul.provbox").html("").append(d.toString() + e.toString() + f.toString() + g.toString());
                    } else c.find(".citylistinfo").find("ul.provbox").html("");
                }
            })
        } else if (b.index() == 1) {
            $(".provbox [pid=" + $(".provbox").attr("temid") + "]").click();
        } else if (b.index() == 2) {
            $(".provbox [pid=" + $(".provbox").attr("temid") + "]").click();
            $(".citybox [pid=" + $(".citybox").attr("temid") + "]").click();
        }
        //alert("切换省市区" + b.index());
        return b.hasClass("cur") ? !1 : c.find(".citylistinfo ul").eq(b.index()).find("a").length < 1 ? !1 : (c.find(".citylistinfo .hd span").removeClass("cur").eq(b.index()).addClass("cur"), void c.find(".citylistinfo ul").hide().eq(b.index()).show())
    })

    //初始化已选组件
    var b = $("#js_selectcity").find(".citylists").attr("prov-data");
    var c = $("#js_selectcity").find(".citylists").attr("city-data");
    var d = $("#js_selectcity").find(".citylists").attr("dist-data");
    if (b != '' && c != '' && d != '') {
        ($(".citybox").attr("temid", c), $(".provbox").attr("temid", b), $(".distbox").attr("temid", d));
    }

    //点击选择内容框
    $("body").on("click", ".citylists p", function () {  //或 $(".citylists p").click(function () {
        //alert("加载选择框！");
        var a = $(this), c = a.parents("li").find(".citylistinfo"), d = a.parents("li");
        console.log(c.is(":visible"))
        return !c.is(":visible") || "" != d.find(".prov").val() && "" != d.find(".city").val() && "" != d.find(".dist").val() ? void c.toggle().find(".hd span").eq(0).click() : !1;
    })
    //console.log("-----------------------------"+  $("#jsSelectcityPanel").html()); //输出到浏览器控制台
}
/**
 * 渲染用户当前使用的收货地址信息 #consignee_show_template
 * @param addressInfo  //addressInfo:AddressInfo(userId:1111, id:1, receiverName:张三丰, mobile:13810201919,
 * telCode:0611, tel:5969276, telExtNumber:8888, provinceId:110000, provinceName:北京市, cityId:110100,
 * cityName:北京市, countyId:110101, countyName:东城区, address:校飞中心A座701, postCode:100011,
 * isDefault:1, email:xyzx@126.com))
 */
function renderShowAddress(addressInfo) {
    if (empty(addressInfo)) {
        return;
    }
    var source   = $("#consignee_show_template").html();
    var template = Handlebars.compile(source);
    $("#consigneePanel").html(template(addressInfo));

    $("#addressId").val(addressInfo.id);

    calcPostageAndAmountTotal();
    renderProduct();
    renderTotal();

    //var defAddress = new StringBuffer();
    //defAddress.append("<h2 class=\"order_title\"><b>收货人信息</b><a href=\"javascript:;\" class=\"edit\">[修改]</a></h2>");
    //defAddress.append(" <div class=\"receiveInfo clearfix\">");
    //defAddress.append(" <ul>");
    //defAddress.append("<li>姓名： " + getString(addressInfo.receiverName) + "</li>");
    //defAddress.append("<li>地区： " + getStringWithSuffix(addressInfo.provinceName, " ") + getStringWithSuffix(addressInfo.cityName, " ") + getString(addressInfo.countyName) + "</li>");
    //defAddress.append("<li>详细地址： " + getString(addressInfo.address) + "</li>");
    //defAddress.append("<li>手机：" + getString(addressInfo.mobile)  + "</li>");
    //if (!empty(addressInfo.tel)) {
        //defAddress.append("<li>固定电话：" + getStringWithSuffix(addressInfo.telCode, "-") + getString(addressInfo.tel) + getStringWithPrefix(addressInfo.telExtNumber, "-") +"</li>");
    //}
    //if (!empty(addressInfo.email)) {
    //    defAddress.append("<li>邮箱：" + getString(addressInfo.email) + "</li>");
    //}
    //defAddress.append("</ul>");
    //$("#consigneePanel").html(defAddress.toString());
}
//渲染虚拟商品收货手机号
function renderVirtual() {
    var source   = $("#virtual_order").html();
    var template = Handlebars.compile(source);
    $("#consigneePanel").html(template());

    calcPostageAndAmountTotal();
    renderProduct();
    renderTotal();
}

/**
 * 渲染收货地址编辑页 #consignee_edit_template
 * @param showAddressInfo 列表及待编辑项数据
 */
function renderEditAddress(showAddressInfo) {
    if (empty(showAddressInfo)) {
        return;
    }
    //alert(showAddressInfo.id); //当前选中id
    //for (var ii in showAddressInfo.consigneeList) {
    //    alert(showAddressInfo.consigneeList[ii].id);
    //}
    var source   = $("#consignee_edit_template").html();
    var template = Handlebars.compile(source);
    //自定义选中radio控件
    Handlebars.registerHelper('self_radio_option',function(id1, id2) {
        return empty(id1) || empty(id2) || id1 != id2 ? '':'checked';
    });
    //是否为默认收货地址
    Handlebars.registerHelper('self_if_default_option',function(v1, v2, options) {
        if(!empty(v1) && !empty(v2) && String(v1) === String(v2)) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    $("#consigneePanel").html(template(showAddressInfo));
}

/**
 * 渲染省市区选择器
 */
function renderSelectCity(showAddressInfo) {
    var selectCity = {};
    if (!empty(showAddressInfo)) {
        selectCity.prov = showAddressInfo.provinceId;
        selectCity.provTxt = showAddressInfo.provinceName;
        selectCity.city = showAddressInfo.cityId;
        selectCity.cityTxt = showAddressInfo.cityName;
        selectCity.dist = showAddressInfo.countyId;
        selectCity.distTxt = showAddressInfo.countyName;
        selectCity.postCode = showAddressInfo.postCode;
    }
    renderSelectCityHtml(selectCity, "jsSelectcityPanel");
}

/**
 * 渲染配送方式
 */
function renderDelivery() {
    if (!notDelivery) {
        deliveryRuleSelector = new $.DeliveryRuleSelector("show", $("#deliveryPanel"),"delivery_edit_template","delivery_show_template", '/shopping/handle/v3/selectDeliveryRule.jsp?objectId='+window.objectId, merchantId);
        if(addressEditor.addr){
            deliveryRuleSelector.setRegionIds(addressEditor.addr.regionIds);
        }
        if(isAutoSelectDeliveryMode == "true"){
            deliveryRuleSelector.show();
        }else{
            deliveryRuleSelector.mode = "edit";
            deliveryRuleSelector.show();
        }
    }
}

/**
 * 渲染商品
 * @param ocs
 */
function renderProduct(){
    //
    var source = $("#cart_head_template").html();
    var template = Handlebars.compile(source);
    Handlebars.registerHelper('self_product_title',function() {
        if (empty(fromBatch) || fromBatch == "1") {
            return "";
        } else {
            return "购物车中的";
        }
    });
    $("#cartHeadPanel").html(template());

    var source2 = $("#cart_body_template").html();
    var template2 = Handlebars.compile(source2);
    //自定义商品链接控件
    Handlebars.registerHelper('self_product_url',function(val1) {
        return empty(val1) ? "javascript:;" : "/product/" + val1;
    });
    //自定义图片链接控件 优先取sku没有取商品主图
    Handlebars.registerHelper('self_pic_url',function(skuPic, imgKey) {
        if (!empty(skuPic)) {
            return img_bath + getZoomImg(skuPic, "60x60");
        } else if (!empty(imgKey)){
            img_src =imgKey.split(',');
            return img_bath + getZoomImg(img_src[0], "60x60");
        } else {
            return "javascript:;";
        }
    });

    //自定义选中radio控件
    Handlebars.registerHelper('self_curprice',function(val1, val2) {
        var ret = 0;
        try {
            if (Number(val2) > 0) {
                return ret = "¥" + Number(Number(val1) - Number(val2)).toFixed(2) + "+100积分";
            }
            ret = Number(val1*100).toFixed(2) + "积分";
        } catch (err) {

        }
        return ret;
    });
    $("#cartBodyPanel").html(template2(render_orderInfo));
}

/**
 * 渲染优惠方式
 */
function renderActive() {
    var source = $("#active_show_template").html();
    var template = Handlebars.compile(source);
    $("#activePanel").html(template());
}

/**
 * 渲染结算信息
 */
function renderTotal() {
    var source = $("#order_bottom_template").html();
    var template = Handlebars.compile(source);
    //自定义选中radio控件

    $("#bottomPanel").html(template(render_orderInfo));

    //$("#totalPayAmount").val(render_orderInfo.);
    contentLoaded(resizeIfr);
}

function checkForm() {
    //校验选择收货地址
    var addrId = $("#addressId").val();
    if (empty(addrId) || !isNumber(addrId)) {
        alert("请选择收货地址！");
        return false;
    }

    //校验库存及是否支持配送
    var storehouseId = getStorehouseId(render_orderInfo.sellerId, render_orderInfo.productId, render_orderInfo.storehouseIds, calcPostageParam.sendToProvince);
    render_orderInfo.pInfo.storehouseId = storehouseId;
    if(storehouseId == 0){
        alert("选择的收货地址不在配送范围！");
        return false;
    }
    return true;
}
/**
 * 确认订单
 */
function orderConfirm() {
    if(productType == 3){
        if(checkPhone()){
            var ssid = render_orderInfo.ssid;
            checkTYLoginStatus(ssid, function(loginInfo) {
                //TODO 需要计算
                var totalPayAmount = Number(Number(render_orderInfo.count) * Number(render_orderInfo.pInfo.curPrice) + Number(render_orderInfo.postage)).toFixed(2);
                $("input[name='productId']").val(render_orderInfo.productId);
                $("input[name='count']").val(render_orderInfo.count);
                $("input[name='storehouseId']").val(render_orderInfo.pInfo.storehouseId);
                $("input[name='skuNum']").val(render_orderInfo.pInfo.skuNum) || "1-12";
                $("input[name='curPrice']").val(render_orderInfo.pInfo.curPrice);
                $("input[name='sellerId']").val(render_orderInfo.sellerId);
                $("input[name='totalPayAmount']").val(totalPayAmount);
                $("input[name='postage']").val(render_orderInfo.postage);
                $("input[name='buyerComment']").val($("#buyerComment_textarea").val());
                $("input[name='mobile']").val($("#mobilenumber").val());
                $("input[name='type']").val(productType);
                $("input[name='tradeCode']").val("Z8001");
                $("#confirmOrderform").submit();
                var toPayBtn = $("#btnSubmit");
                toPayBtn.html("提交订单...");
                toPayBtn.die("click");

                //存储成功提交页ifmurl ---新加33
                //var ifmurl = "http://ct100.jfshare.com/order/confirm_order";
                //localStorage.setItem("ifmurl", ifmurl);

                return false; // 阻止表单自动提交事件
            });
        }
    }else if(productType == 2){
        if (checkForm() == true) {
            var ssid = render_orderInfo.ssid;
            checkTYLoginStatus(ssid, function(loginInfo) {
                //TODO 需要计算
                var totalPayAmount = Number(Number(render_orderInfo.count) * Number(render_orderInfo.pInfo.curPrice) + Number(render_orderInfo.postage)).toFixed(2);
                $("input[name='productId']").val(render_orderInfo.productId);
                $("input[name='count']").val(render_orderInfo.count);
                $("input[name='storehouseId']").val(render_orderInfo.pInfo.storehouseId);
                $("input[name='skuNum']").val(render_orderInfo.pInfo.skuNum) || "1-12";
                $("input[name='curPrice']").val(render_orderInfo.pInfo.curPrice);
                $("input[name='sellerId']").val(render_orderInfo.sellerId);
                $("input[name='totalPayAmount']").val(totalPayAmount);
                $("input[name='postage']").val(render_orderInfo.postage);
                $("input[name='buyerComment']").val($("#buyerComment_textarea").val());
                $("#confirmOrderform").submit();
                var toPayBtn = $("#btnSubmit");
                toPayBtn.html("提交订单...");
                toPayBtn.die("click");

                //存储成功提交页ifmurl ---新加33
                //var ifmurl = "http://ct100.jfshare.com/order/confirm_order";
                //localStorage.setItem("ifmurl", ifmurl);

                return false; // 阻止表单自动提交事件
            });
        }

    }

}

//验证手机号
function checkPhone(){
    var phone =$('input#mobilenumber').val();
    if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))){
        alert("请正确填写手机号码！");
        return false;
    }else{
        return true;
    }
}

/**
 * 计算运费及总金额
 */
function calcPostageAndAmountTotal() {
    try {
        calcPostageParam.sendToProvince = addressEditor.addr.provinceId;
    } catch (e) {
        calcPostageParam.sendToProvince = "110000";
    }
    //计算默认邮费
    render_orderInfo.postage=getPostage(calcPostageParam);
    render_orderInfo.amountTotal = Number(Number(render_orderInfo.amountSum)  + Number(render_orderInfo.postage)).toFixed(2); //实付金额, 含运费
}