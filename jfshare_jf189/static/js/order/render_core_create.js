/**
 * Created by lenovo on 2015/10/12.
 */
//页面设定参数

/**
 * 渲染页面数据入口
 */
$(function() {
    rendData();
});

/**
 * 异步渲染页面各模块动态数据
 * 默认收货地址、购物车信息、购物车商品查询
 */
function rendData() {
    renderGuide();
    if (empty(extend)) {
      renderPaySelect();
    } else {
        renderOrderProfile();
    }
    renderPayEvent();
}

/**
 * 渲染导购提示
 */
function renderGuide() {
    var fromBatchTip="";
    fromBatchTip = "立即购买";
    var source   = $("#guide_show_template").html();
    var template = Handlebars.compile(source);
    $("#guidePanel").html(template({"fromBatchTip":fromBatchTip}));
}

function console(){
    alert("id:ssid==>" + $("#ssid").val());
    alert("name:ssid==>" + $("input[name='ssid").val());
}

function renderOrderProfile() {
    //alert(extend.createTime);
    var source   = $("#submit_order_template").html();
    var template = Handlebars.compile(source);

    var orderProfile = {};
    try {
        orderProfile.orderIdList = orderIdList;
        orderProfile.paymentInfo = extend;
    } catch(err) {
    }
    Handlebars.registerHelper('self_order_url',function() {
        return "/buyer/myOrders";
    });
    //自定义选中radio控件
    Handlebars.registerHelper('self_showJifen',function(val1) {
        var ret = "";
        try {
            if (Number(val1) > 0) {
                ret = " + "+ Number(val1).toFixed(0) + " 积分";
            }
        } catch (err) {

        }
        return ret;
    });
    Handlebars.registerHelper('self_showPrice',function(val1, val2) {
        var ret = val1;
        try {
            if (Number(val2) > 0) {
                ret = Number(Number(Number(val1) * 100 - Number(val2).toFixed(0))/100).toFixed(2);
            }
        } catch (err) {

        }
        return ret;
    });
    $("#submitOrderPanel").html(template(orderProfile));

    var _ssid = $("#ssid").val()
    $("input[name='ssid").val(_ssid);
    $("input[name='payApply[orderId]']").val(orderIdList);
    $("#payApplyForm").attr("action","/pay/payApply?t="+Math.random()+"&ssid="+_ssid);
}

function renderPaySelect() {
    var orderProfile = {};
    try {
        orderProfile.orderIdList = orderIdList;
    } catch(err) {
    }
    var source   = $("#pay_select_template").html();
    var template = Handlebars.compile(source);
    $("#submitOrderPanel").html(template(orderProfile));
}

function renderPayEvent() {
    //doToPayEvent(); //自动提交表单
    $("input[name='payChannel']").on("click", function () {
        $("li.cur").removeClass("cur");
        $(this).closest("li").addClass("cur");
        reBindToPayBtnEvent();
    });

    $(".paymentItemImg").on("click", function () {
        var currLi = $(this).closest("li");
        currLi.find("input[name='payChannel']").click();
        reBindToPayBtnEvent();
    });

    $("#toPayBtn").on("click", function () {
        doToPayEvent();
    });
}

/**
 * 控制支付按钮是否可用
 */
function reBindToPayBtnEvent() {
    //var toPayBtn = $("#toPayBtn");
    //toPayBtn.html("确认支付方式");
    //toPayBtn.off("click");
    //toPayBtn.on("click", function () {
    //    doToPayEvent();
    //});
}


/*确认支付*/
function doToPayEvent() {
    var checkedItem = $("input[name='payChannel']:checked");
    if (checkedItem.length == 0) {
        alert("请选择一个支付方式！");
        return;
    }

    var payChannel = checkedItem.val();
    var custId = null; //第三方id
    var custType = null; //第三方客户类型
    var procustID = null; //第三方省份ID
    var isLogin = true;
    var ssid = $("#ssid").val();
    //天翼支付，验证是否在天翼登录
    if (payChannel == "1") {
        checkTYLoginStatus(ssid, function(loginInfo){
            var extInfo = JSON.parse(loginInfo.value.extInfo);
            custId = extInfo.deviceNo;
            custType = extInfo.deviceType;
            procustID = extInfo.procustID;

            var result;
            var params = {orderIdList:orderIdList, payChannel:payChannel, custId:custId, custType:custType, procustID:procustID, ssid:ssid}
            $.ajax({
                url: "/order/pay_apply",
                type: 'get',
                async: false,
                data: params,
                dataType:'json',
                success: function (data) {
                    result = data;
                }
            });

            if(result.status==200){
                var source2   = $("#pay_retconfirm_show_template").html();
                var template2 = Handlebars.compile(source2);
                $("#payRetConfirmLayer").html(template2());
                payretShow("#payRetConfirmLayer");

                var source = $("#pay_submit_template").html();
                var template = Handlebars.compile(source);
                $("#payRequestPanel").html(template(JSON.parse(result.value)));
                $("#payRequestForm").submit();
            }else {
                alert(result.msg);
            }
        });
    }
}

function payretClose(i){
    divClose(i);
    var toPayBtn = $("#toPayBtn");
    toPayBtn.html("支付");
    document.getElementById('bg').style.display = 'none';
}

function payretShow(i){
    centerEx(i);
    var toPayBtn = $("#toPayBtn");
    toPayBtn.html("正在支付...");
    document.getElementById('bg').style.display = 'block';
}

//top写死
function centerEx(i) {
    var _scrollHeight = $(document).scrollTop(), //获取当前窗口距离页面顶部高度
        _windowHeight = $(window).height(), //获取当前窗口高度
        _windowWidth = $(window).width(), //获取当前窗口宽度
        _popupHeight = $(i).height(), //获取弹出层高度
        _popupWeight = $(i).width();//获取弹出层宽度
    _posiTop = (_windowHeight - _popupHeight) / 2;
    _posiTop2 = (_windowHeight - _popupHeight) / 2 - _scrollHeight;
    _posiLeft = (_windowWidth - _popupWeight) / 2;
    $(i).css({"left":_posiLeft + "px", "top":40 + "px", "display":"block", "position":"fixed", "z-index":"30003"});
    var isIE = !!window.ActiveXObject;
    var isIE6 = isIE && !window.XMLHttpRequest;
    if (isIE) {
        if (isIE6) {
            $(i).css({"left":_posiLeft + "px", "display":"block", "position":"absolute", "bottom":"0"});
            $("html, body").animate({ scrollTop:0 }, 120);
        }
    }
}