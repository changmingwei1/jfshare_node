var b = true;
function teamBuy(userId) {
    if(uid==""){
        jQuery("#diyLoginLayer").load(frontPath + "/login/sign_box.jsp",{type:"t"},function() {
            showDiv("#diyLoginLayer");
        });
        return;
    }
    var c = parseInt($("#amount").val());
    if (c < onceMustBuyCount) {
        alert("小于起订量了");
        return;
    }
    if (c > sellableCount) {
        alert("大于可卖数了");
        return;
    }
    var options = {
        success:loadAddShoppingCartResult1
    };
    jQuery("#addToGroupCartform").ajaxSubmit(options);
}

function checkBuylogion(userId) {
    if (userId == -1) {
        return false;
    }
}

function loadAddShoppingCartResult1(responseText, statusText) {
    if (statusText == "success") {
        var data = jQuery.trim(responseText);
        if (data == "unStart") {
            alert("请稍后……");
        } else if (data == "over") {
//			alert("团购活动结束了……");

        } else if (data == 2) {
            alert("系统繁忙，请稍后……");
        }else {
            var result = JSON.parse(responseText);
            if (result.error) {
                window.location.href = frontPath + "/errorPage.jsp?tag=501";
            }
            if (!result.login) {
                params = new Object();
                params["id"] = result.id;
                params["skuId"] = result.skuId;
                params["amount"] = result.totalAmount;
                params["g"] = true;
                params["shopStyle"] = shopStyle;
                params["state"] = result.state;
                jQuery("#diyLoginLayer").load(frontPath + "/login/sign_box.jsp", {type:"p"}, function() {
                    showDiv("#diyLoginLayer");
                });
                return;
            } else {
                if(result['phone_validate_state'] != undefined && result['phone_validate_state'] == false){
                    if(window.confirm("抱歉，参与团购活动前您需要进行手机验证！马上去验证？")){
                        window.location.href = frontPath + "/member/phonevalidate.jsp"
                    }
                    return false;
                }
                if (result.isCanBuyShow) {
                    window.location.href = frontPath + "/shopping/order_form.jsp?id=" + result.id + "&amount=" + result.totalAmount + "&skuId=" + result.skuId +"&t=group";
                } else {
                    alert("很抱歉，您不属于参加该活动的范围。");
                }
            }

        }
    }
}
function showDiv(obj) {
    $(obj).show();
    center(obj);
    $(window).scroll(function() {
        center(obj);
    });
    $(window).resize(function() {
        center(obj);
    });
}
function center(obj) {
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight-100;
    var popupHeight = $(obj).height();
    var popupWidth = $(obj).width();
    $(obj).css({
        "position": "absolute",
        "top": (windowHeight - popupHeight) / 2 + $(document).scrollTop(),
        "left": (windowWidth - popupWidth) / 2,
        "z-index":"2"
    });
}
/*function scareBuy(i) {
    var options = {
        success:loadAddShoppingCartResult
    };
    jQuery("#addToGroupCartform").ajaxSubmit(options);
}*/

function loadResult(responseText, statusText) {
    if (statusText == "success") {
        var data = jQuery.trim(responseText);
        var result = JSON.parse(responseText);
        if (result.error) {
            window.location.href = frontPath + "/errorPage.jsp?tag=501";
        }
        if (!result.login) {
            var params = new Object();
            params["id"] = result.id;
            params["amount"] = result.totalAmount;
            params["state"] = result.state;
            params["p"] = true;
            params["shopStyle"] = shopStyle;
            /*window.open(layout+"/web/common/login.jsp?id="+result.id+"&amount="+result.totalAmount
             , '' ,'height=400, width=600, top=screen.height/3, left=screen.width/3, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=n o, status=no');*/
            jQuery("#diyLoginLayer").load(frontPath + "/login/sign_box.jsp", params, function() {
//                   document.getElementById("diyLoginLayer").style.left = "4%";
                document.getElementById("diyLoginLayer").style.position = "fixed";
                /*document.getElementById("diyLoginLayer").style.position = "absolute";*/
                document.getElementById("diyLoginLayer").style.top = (screen.height / 2 - 80);
//                   document.getElementById("diyLoginLayer").style.left =(screen.width/2 - 175);
//                   document.getElementById("diyLoginLayer").style.display = "block";
                var x = $(window).width() / 2;
                var y = $(window).height() / 2;

                //获得div的宽度一半，高度一半
                var div_w = $("#diyLoginLayer").width() / 2;
                var div_h = $("#diyLoginLayer").height() / 2;


                //获得滚动条偏移量
                var stop = $("body").scrollTop();
                var sleft = $("body").scrollLeft();

                //获得最终div显示位置
                var left = x - div_w + sleft - 500 + "px";
                var top = y - div_h + stop + "px";

                //设置弹出层 div 样式。 定位使其绝对居中
                $("#diyLoginLayer").css({left:left,top:top});

                $("#diyLoginLayer").show();
            });
            return;
        } else {
            if (result.isCanBuyShow) {
                if (result.state == "onPanic")
                    window.location.href = frontPath + "/shopping/order_form.jsp?id=" + result.id + "&amount=" + result.totalAmount;
                else
                    window.location.href = frontPath + "/panicBuy/panicBuy.jsp";
//            window.location.href = "http://www.jfshare.com/shopping/panicbuy/orderForm.jsp?id="+result.id+"&amount="+ result.totalAmount;
            } else {
                alert("很抱歉，您不属于参加该活动的范围。");
            }
        }
    }
}

var shopStyle = shopStyle;
var canClick = true;
var count;
var onceMustBuyCount;
var sellableCount;
function add() {
    if (canClick) {
        count = parseInt(getCount());
        count++;
        if (onceMustBuyCount <= count && count <= sellableCount)
            setCount(count);
    }
}
function del() {
    if (canClick) {
        count = parseInt(getCount());
        count--;
        if (onceMustBuyCount <= count && count <= sellableCount)
            setCount(count);
    }
}
function setCount(v) {
    document.getElementById("canBuy").value = v;
    document.getElementById("amount").value = v;
}
function getCount() {
    return document.getElementById("canBuy").value;
}
function buy() {
    addToGroupCartform.submit();
}

function check(e) {
    var c = parseInt(e.value);
    if (e.value == ""||isNaN(e.value)||c == 0) {
        e.value = 1;
        return;
    }
    if (c < onceMustBuyCount) {
        alert("小于起订量"+onceMustBuyCount+"了");
        e.value = onceMustBuyCount;
        return;
    }
    if (c > sellableCount) {
        alert("大于可卖数了");
        e.value = sellableCount;
        return;
    }
    if (onceMustBuyCount <= c && c <= sellableCount) {
        setCount(c);
    }
}

function select(e) {
    var temp = e.value;
    var a = temp.split("+");
    var sc = a[0];
    var skuId = a[1];
    sellableCount = parseInt(sc);
    $("#skuId").val(skuId);
    setCount(onceMustBuyCount);
}