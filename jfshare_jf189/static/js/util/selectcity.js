/**
 * Created by lenovo on 2015/11/12.
 */
/**
 * 省市区公共组件
 * 依赖 jquery、v1icon1.png、getString()、empty()
 * 引用
 <script type="text/javascript" src="/js/util/selectcity.js"></script>
 //省市区选择样式
.citylists {position: relative;float: left;width: 362px;}
.citylists .txt {width: 340px;border: 1px solid #cdcdcd;padding: 3px 10px;height: 20px;line-height: 20px;color: #333;cursor: pointer;background: #fff;}
.citylists .txt sup {background: url(/img/v1icon1.png) no-repeat -9px 0;width: 9px;height: 5px;position: absolute;top: 11px;right: 6px;display: block;}
.citylists .citylistinfo {position: absolute;top: 27px;left: 0;border: 1px solid #cdcdcd;width: 360px;background: #fff;overflow: hidden;display: none;}
.citylists .citylistinfo .hd {width: 362px;overflow: hidden;}
.citylists .citylistinfo .hd span {height: 26px;cursor: pointer;width: 120px;border-left: 1px solid #cdcdcd;float: left;border-bottom: 1px solid #cdcdcd;
    text-align: center;margin-left: -1px;background: #fafafa;}
.citylists .citylistinfo .hd .cur {color: #dc140e;border-bottom-color: #fff;background-color: #fff;}
.citylists .citylistinfo ul {padding: 10px 0;width: 360px;float: left;}
.citylists .citylistinfo ul li {width: 340px;float: left;height: auto;margin-bottom: 0;padding: 0 10px;}
.citylists .citylistinfo ul label {width: 40px;margin-left: -40px;text-align: center;float: left;}
.citylists .citylistinfo ul li a {margin-right: 10px;padding: 0 3px;display: inline-block;float: left;_float: none;}
.citylists .citylistinfo .provbox li {padding-left: 40px;width: 320px;padding-right: 0;}
.w5 {width: 20px;}
//省市区选择样式 end
**/

/**
 * 渲染选择内容组件，无下拉框内容
 * @param selectCity 已选省市区数据源
 * @param cityPanel 省市区容器
 *  var selectCity = {};
 selectCity.prov = showAddressInfo.provinceId;
 selectCity.provTxt = showAddressInfo.provinceName;
 selectCity.city = showAddressInfo.cityId;
 selectCity.cityTxt = showAddressInfo.cityName;
 selectCity.dist = showAddressInfo.countyId;
 selectCity.distTxt = showAddressInfo.countyName;
 selectCity.postCode = showAddressInfo.postCode;
 */
function renderSelectCityHtml(selectCity, cityPanel) {
    var cityDiv = new StringBuffer();

    cityDiv.append("<li id=\"js_selectcity\">");
    cityDiv.append("<label>");
    cityDiv.append("<em>*</em>");
    cityDiv.append("所在地区：");
    cityDiv.append("</label>");
    cityDiv.append("<div class=\"citylists\" prov-data='" + getString(selectCity.prov) + "' city-data='" + getString(selectCity.city) + "' county-data='" + getString(selectCity.dist) + "'>");
    cityDiv.append("<p class=\"txt\">");
    cityDiv.append("<sup></sup>");
    cityDiv.append("<span>" + (empty(selectCity.prov) ? "<font color='gray'>请选择城市</font>" : getString(selectCity.provTxt) + "/" + getString(selectCity.cityTxt) + "/" + getString(selectCity.distTxt)) + "</span>");  //山东/滨州/博兴
    cityDiv.append("</p>");
    cityDiv.append("<div class=\"citylistinfo\" style=\"display: none;\">");
    cityDiv.append("<div class=\"hd\">");
    cityDiv.append("<span class=\"cur\">省份</span>");
    cityDiv.append("<span>城市</span>");
    cityDiv.append("<span>县区</span>");
    cityDiv.append("</div>");
    cityDiv.append("<ul class=\"provbox\"><li></li></ul>");
    cityDiv.append("<ul class=\"citybox\" style=\"display:none\"><li></li></ul>");
    cityDiv.append("<ul class=\"distbox\" style=\"display:none\"><li></li></ul>");
    cityDiv.append("</div>");
    cityDiv.append("</div>");
    cityDiv.append("<input class=\"prov\" type=\"hidden\" value=\"" +selectCity.prov +"\" txt=\"" + selectCity.provTxt + "\"/>");  //保存新选中信息
    cityDiv.append("<input class=\"city\" type=\"hidden\" value=\"" +selectCity.city +"\" txt=\"" + selectCity.cityTxt + "\"/>");
    cityDiv.append("<input class=\"dist\" type=\"hidden\" value=\"" +selectCity.dist +"\" txt=\"" + selectCity.distTxt + "\"/>");

    cityDiv.append("<label class=\"w5\">");
    cityDiv.append("<em>*</em>");
    cityDiv.append("邮编：");
    cityDiv.append("</label>");
    cityDiv.append("<input type=\"text\" value=\"" + getString(selectCity.postCode) + "\" class=\"js_postcode\" style=\"width:60px;\"/>");
    cityDiv.append("</li>");

    $("#" + cityPanel).html(cityDiv.toString());
    //console.log("-----------------------------"+  $("#" + cityPanel).html()); //输出到浏览器控制台
    initCitylistEvent();
}

/**
 * 初始化加载选择框事件
 */
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
        return b.hasClass("cur") ? !1 : c.find(".citylistinfo").show(), c.find(".citylistinfo ul").eq(b.index()).find("a").length < 1 ? !1 : (c.find(".citylistinfo .hd span").removeClass("cur").eq(b.index()).addClass("cur"), void c.find(".citylistinfo ul").hide().eq(b.index()).show())
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
        return !c.is(":visible") || "" != d.find(".prov").val() && "" != d.find(".city").val() && "" != d.find(".dist").val() ? void c.toggle().find(".hd span").eq(0).click() : !1;
    })
    //console.log("-----------------------------"+  $("#jsSelectcityPanel").html()); //输出到浏览器控制台
}

