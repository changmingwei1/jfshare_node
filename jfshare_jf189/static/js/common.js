var _imgServ = "http://proxy.jfshare.com/system/v1/jfs_image/";
//var _imgServ = "http://10.46.172.190:3000/system/v1/jfs_image/";
var opts = {
    lines: 10, // 花瓣数目
    length: 7, // 花瓣长度
    width: 5, // 花瓣宽度
    radius: 10, // 花瓣距中心半径
    corners: 1, // 花瓣圆滑度 (0-1)
    rotate: 0, // 花瓣旋转角度
    direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
    color: '#5882FA', // 花瓣颜色
    speed: 1, // 花瓣旋转速度
    trail: 60, // 花瓣旋转时的拖影(百分比)
    shadow: false, // 花瓣是否显示阴影
    hwaccel: false, //spinner 是否启用硬件加速及高速旋转
    className: 'spinner', // spinner css 样式名称
    zIndex: 2e9, // spinner的z轴 (默认是2000000000)
    top: '100px', // spinner 相对父容器Top定位 单位 px
    left: '50%'// spinner 相对父容器Left定位 单位 px
};

function checkTYLoginStatus(ssid, callback) {

    var iframe = document.getElementById("loginInfoFrm");
    if (iframe.attachEvent) {
        iframe.attachEvent("onload", function() {
            checkJFXLoginStatus(ssid, callback);
        });
    } else {
        iframe.onload = function() {
            checkJFXLoginStatus(ssid, callback);
        };
    }

    $("#loginInfoFrm").attr("src", "/login/isLoginTY?ssid="+ssid+"&t="+Math.random());
}

/**
 * 校验登陆状态
 * @param ssid
 * @param callback
 */
function checkJFXLoginStatus(ssid, callback, callback1) {
    if(!ssid) {
        logoutTY();
        return;
    }

    $.ajax({
        url: "/buyer/isBindThirdParty",
        type: 'post',
        async: false,
        data:{thirdType:"TY", ssid:ssid},
        dataType:'json',
        success: function (data) {
            if(data.loginStatus === true) {
                callback(data);
                return;
            } else{
                if(arguments.length == 3 && Object.prototype.toString.call(arguments[2])=== '[object Function]') {
                    callback1(data);
                    return;
                }

                logoutTY();
            }
        }
    });
}

function  logoutTY() {
    $.ajax({
        url: "/login/thirdlogin",
        type: 'get',
        async: false,
        success: function (data) {
            //alert("未登陆或登陆状态已失效");
            top.location.href = data.url;
        }
    });
}

function QueryString(item) {
    var soure = window.location.href;
    var sValue = soure.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"))
    return sValue ? sValue[1] : "";
}


function center(i) {
    var _scrollHeight = $(document).scrollTop(), //获取当前窗口距离页面顶部高度
        _windowHeight = $(window).height(), //获取当前窗口高度
        _windowWidth = $(window).width(), //获取当前窗口宽度
        _popupHeight = $(i).height(), //获取弹出层高度
        _popupWeight = $(i).width();//获取弹出层宽度
    _posiTop = (_windowHeight - _popupHeight) / 2;
    _posiTop2 = (_windowHeight - _popupHeight) / 2 - _scrollHeight;
    _posiLeft = (_windowWidth - _popupWeight) / 2;
    $(i).css({"left":_posiLeft + "px", "top":_posiTop + "px", "display":"block", "position":"fixed", "z-index":"30003"});
    var isIE = !!window.ActiveXObject;
    var isIE6 = isIE && !window.XMLHttpRequest;
    if (isIE) {
        if (isIE6) {
            $(i).css({"left":_posiLeft + "px", "display":"block", "position":"absolute", "bottom":"0"});
            $("html, body").animate({ scrollTop:0 }, 120);
        }
    }
}

function divClose(i){
    $(i).hide();
}

//组装天翼详情实际支付金额
Handlebars.registerHelper("handlerPayAmount",function(closingPrice, thirdScore, productList, options){
    var exchangeAmount = Number(productList[0].thirdExchangeRate/100*productList[0].count).toFixed(2);
    var price = Number(closingPrice).toFixed(2);
    var score = Number(thirdScore)/100;
    var ret = Number(price - score).toFixed(2);
    if(price != score + exchangeAmount) {
        ret = Number(price - exchangeAmount).toFixed(2);
    }
    return new Handlebars.SafeString(ret);
});

//组装天翼订单金额
Handlebars.registerHelper("showPrice",function(orderInfo,options){

    var price = Number(orderInfo.curPrice);
    var str;
    if(Number(orderInfo.thirdExchangeRate) > 0) {
        str = '<span class="green ft18">&yen;'+(price-Number(orderInfo.thirdExchangeRate/100)).toFixed(2)+'</span> + <span class="green ft18">100</span> 积分';
    } else {
        str = '<span class="green ft18">'+Number(price*100).toFixed(0)+'</span> 积分';
    }
    return new Handlebars.SafeString(str);

});

//组装天翼订单总金额
Handlebars.registerHelper("showTotalPrice",function(priceStr, thirdScore, exchangePrice,options){
    var price = Number(priceStr);
    var str;
    if(Number(priceStr) > 0) {
        str = '<span class="green ft18">&yen;'+ Number(priceStr).toFixed(2) +'</span> + <span class="green ft18">'+thirdScore+'</span> 积分';
    } else {
        str = '<span class="green ft18">'+ thirdScore +'</span> 积分';
    }
    return new Handlebars.SafeString(str);

});

/**
 * 判断收货地是否支持配送， 支持获取到对应仓库id, 返回0代表不支持配送
 */
function getStorehouseId(sellerId, productId, storehouseIds, curProvince) {
    if(storehouseIds === '1')
        return 1;

    var getStorehouseId = 0;
    var param = {
        sellerId:sellerId,
        productId:productId,
        storehouseIds:storehouseIds,
        sendToProvince:curProvince
    }

    $.ajax({
        url: "/nnc/getStorehouseId",
        type: 'get',
        data: param,
        dataType:'json',
        async: false,
        success: function (data) {
            if(data.result){
                getStorehouseId = data.storehouseId;
            }
        }
    });
    return getStorehouseId;
}

/**
 * 获取运费
 */
function getPostage(param) {
    var postage = 0;

    $.ajax({
        url: "/nnc/getPostage",
        type: 'get',
        data: param,
        dataType:'json',
        async: false,
        success: function (data) {
            if(data.result){
                postage = data.postage;
            }
        }
    });

    return postage;
}