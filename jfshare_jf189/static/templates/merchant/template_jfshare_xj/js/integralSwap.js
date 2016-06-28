var temp = null;
var time = 60;
$(function () {
    $("#score_changein").val("");
    $("#canScore").val("");
    $("#equipType_changein").val("") ;
    $("#equipNO_changein").val("");
    $("#province_changein").val("");
    $("#ValidateCode").val("");
    $("#mobilPhone").val("");
    $("#phonecode").val("");
    $("#phonecheck").removeAttr("disabled");
    $("#phonecheck").val("发送手机验证码");
    refreshValidateCode();
    //积分计算器 begin
    $("#aexchange").live("click",function(){
        var platform = $("#platform  option:selected").val();
        var type = $("#type  option:selected").val();
        var amount = $("#amount").val();
        var reg = /^\+?[1-9][0-9]*$/;//正整数
        if (platform == 'no') {
            alert("请选择合作平台,谢谢!");
            $("#platform").focus();
        } else if (type == 'no') {
            alert("请选互换类型,谢谢!");
            $("#type").focus();
        } else if (amount == '') {
            alert("请输入兑换积分数,谢谢!");
            $("#amount").focus();
        } else if (amount.length > 6) {
            alert("您输入的积分超出范围,请重新输入");
            $("#amount").focus();
        } else if (!reg.test(amount)) {
            alert("积分数值只允许为正整数,请重新输入");
            $("#amount").focus();
        } else {
            var ins = $("#platform  option:selected").attr("in");
            var out = $("#platform  option:selected").attr("out");
            if(ins==0||out==0){
                alert("商家还没有配置兑换比例，请联系商家!");
            }else{
            if (type == '1') {
                $("#show_jf").val(amount * ins / out);
            } else {
                $("#show_jf").val(amount * out / ins);
            }
           }
        }
    });
    $("#aexspace").live("click",function(){
        $("#platform").find("option[value='no']").attr("selected", true);
        $("#type").find("option[value='no']").attr("selected", true);
        $("#amount").val("");
        $("#show_jf").val("");
    });
    //积分计算器 end

    //聚分享与电信积分互换 begin
    //换出积分弹出层
    $("#swapoutShow").live("click",function(){
        var integralExchangeratio = $("#integralExchangeratio").html();
        if (integralExchangeratio == null && integralExchangeratio == "") {
            alert("商家还没有配置兑换比例，请联系商家!");
            return;
        } else {
            var integralExchangeratio = integralExchangeratio.split(":");
            if (integralExchangeratio.length != 2) {
                alert("商家配置兑换比例错误，请联系商家!");
                return;
            } else {
               if (userId != "" && userId != null) {
                var width=(document.body.scrollWidth-800)/2;
                var top=(document.body.scrollTop+450)/2;
                $("#center_jfdcym").css("left",width).css("top",top);
				$("#center_jfdcym_dccg").hide();
				$("#center_jfdcym_cen").show();
                $("#center_jfdcym").show();
                } else {
                  window.location.href = frontPath + "/login/sign_in.jsp?redirectURL=" + redirectURL;
                }
            }
        }
    });
    //换出的积分值 end
    $("#score_changein").live("change",function(){
        var score=$("#score_changein").val()
        var partten = /^\d+$/;
        if (!partten.test(score)) {
            alert("请填写数字字符");
            $("#score_changein").val('');
            $("#canScore").html("");
            $("#score_changein").focus();
            return;
        }
        if (score < 1000) {
            alert("最低兑换标准为1000分");
            $("#score_changein").val('');
            $("#canScore").html("");
            $("#score_changein").focus();
            return;
        }
        if (score % 1000 != 0) {
            alert("兑换的积分数额只能是1000的倍数");
            $("#score_changein").val('');
            $("#canScore").html("");
            $("#score_changein").focus();
            return;
        }
        var integralExchangeratio = $("#integralExchangeratio").html();
        var bili = integralExchangeratio.split(":");
        $("#canScore").val(score * bili[1]/bili[0]);
    });
    //查询余额
    $("#QueryDYQ").live("click",function(){
        if ($("#equipType_changein").val() == "-1") {
            alert("请选择设备类型");
            $("#equipType").focus();
            return;
        }
        if ($.trim($("#equipNO_changein").val()) == "") {
            alert("请输入设备型号");
            $("#equipNO_changein").focus();
            return;
        }
        if ($("#province_changein").val() == "-1") {
            alert("请选择省份");
            $("#province_changein").focus();
            return;
        }
        $.ajax({
            type : 'post',
            url : 'http://bad_redirect',
            dataType : 'json',
            data : {
                qType : '2',
                eType : $("#equipType_changein").val(),
                eNO : $("#equipNO_changein").val(),
                province : $("#province_changein").val()
            },
            success : function(resp) {
                if (resp.result) {
                    alert("你当前的积分为:" + resp.result);
                } else {
                    alert(resp.msg);
                }
            },
            error : function() {
                alert("获取用户积分失败");
            }
        });
    });
    //查询余额
    $("#QueryDYQ1").live("click",function(){
        $.ajax({
            type : 'post',
            url : 'http://bad_redirect',
            dataType : 'json',
            data : {
                qType : '2',
                eType : $("#equipType_changein").val(),
                eNO : $("#equipNO_changein").val(),
                province : $("#province_changein").val()
            },
            success : function(resp) {
                if (resp.result) {
                    alert("你当前的积分为:" + resp.result);
                } else {
                    alert(resp.msg);
                }
            },
            error : function() {
                alert("获取用户积分失败");
            }
        });
    });
    //兑出
    $("#SwapOut").live("click",function(){
        var score=$("#score_changein").val()
        var partten = /^\d+$/;
        if (!partten.test(score)) {
            alert("请填写你要换出的积分值");
            $("#score_changein").val('');
            $("#canScore").html("");
            $("#score_changein").focus();
            return;
        }
        if (score < 1000) {
            alert("最低兑换标准为1000分");
            $("#score_changein").val('');
            $("#canScore").html("");
            $("#score_changein").focus();
            return;
        }
        if (score % 1000 != 0) {
            alert("兑换的积分数额只能是1000的倍数");
            $("#score_changein").val('');
            $("#canScore").html("");
            $("#score_changein").focus();
            return;
        }
        if ($("#equipType_changein").val() == "-1") {
            alert("请选择用户类型");
            $("#equipType_changein").focus();
            return;
        }
        if ($.trim($("#equipNO_changein").val()) == "") {
            alert("请输入用户帐号");
            $("#equipNO_changein").focus();
            return;
        }
        if ($("#province_changein").val() == "-1") {
            alert("请选择所在省份");
            $("#province_changein").focus();
            return;
        }
        var code = $("#ValidateCode").val();
        if (code == null || code == "") {
            alert("请输入验证码！");
            jQuery("#ValidateCode").focus();
            return false;
        }
       if(isValidateCodePhone=="true"){
           $.ajax({
               type: 'post',
               url: "http://bad_redirect",
               dataType: 'json',
               data: {
                   eNO: $("#equipNO_changein").val(),
                   code:$("#ValidateCode").val()
               },
               success: function (resp) {
                   data = $.trim(resp);
                   if (data) {
                       if (data == "2") {
                           if(confirm("您的电信帐户将与聚分享商城帐户绑定且无法更改，确定提交？")){
                               refreshValidateCode();
                               $("#center_jfdcym_cen").hide();
                               $("#center_jfdcym_dccgphone").show();
                           }else {
                               return false;
                           }
                       }else if (data == "3") {
                           refreshValidateCode();
                           $("#center_jfdcym_cen").hide();
                           $("#center_jfdcym_dccgphone").show();
                       }else if(data == "8"){
                           refreshValidateCode();
                           alert("对不起，您填写的电信帐号已绑定其它会员，无法将积分转出至此帐户！");
                       }else if(data == "11"){
                           refreshValidateCode();
                           alert("对不起，会员绑定的电信帐号与您填写的帐号不一致，无法转出积分至此帐户！");
                       }else if(data == "9"){
                           refreshValidateCode();
                           alert("验证码为空！");
                       }else if(data == "10"){
                           refreshValidateCode();
                           alert("验证码错误！");
                       }else {
                           refreshValidateCode();
                           alert("系统繁忙，请稍后重试！");
                       }
                   }
               }
           });
        }else{
        $.ajax({
            type: 'post',
            url: "http://bad_redirect",
            dataType: 'json',
            data: {

                eType: $("#equipType_changein").val(),
                eNO: $("#equipNO_changein").val(),
                province: $("#province_changein").val(),
                score: $("#score_changein").val(),
                code:$("#ValidateCode").val()
            },
            success: function (resp) {
                var msg = resp.msg;
                if(resp.amount!=null){
                    $("#bonusInSys_changein").html(resp.amount);
                    $("#center_jfdcym_cen").hide();
                    var score= $("#score_changein").val()
                    $("#jfshareIntegral").html(score);
                    var integralExchangeratio = $("#integralExchangeratio").html();
                    var bili = integralExchangeratio.split(":");
                    $("#telecomIntegral").html(score * bili[1]/bili[0]);
                    $("#center_jfdcym_dccg").show();
                    refreshValidateCode();
                }else{
                   refreshValidateCode();
                  alert(msg);
                }
            }
        });
        }
    });
    $("#phonecheck").live("click",function(){
        var phone = $("#mobilPhone").val();
        var phoneexp = /^(13[0-9]|15[0-9]|18[0-9]|147)\d{8}$/;
        if (phone == "" || !phoneexp.test(phone)) {
            alert("请输入正确的手机号码！");
            return false;
        }

        $.post("../../../../integralSwap/telecomphonevalidate.jsp.htm"/*tpa=http://www.jfshare.com/integralSwap/telecomphonevalidate.jsp*/, {phone:phone}, function (data) {
            data = $.trim(data);
            if (data) {
                if (data == "3") {
                    $("#phonecheck").attr("disabled", "disabled");
                    temp = setInterval("timeout()", 1000);
                }else if(data == "2"){
                    alert("短信发送异常，请稍后重试！");
                }else if(data == "6"){
                    refreshValidateCode();
                    alert("一分钟之内只能发送一次！");
                }else if(data == "7"){
                    refreshValidateCode();
                    alert("由于你恶意的请求，今天禁止提交！");
                }else {
                    alert("系统繁忙，请稍后重试！");
                }
            }
        });
    });
    //兑出
    $("#SwapOk").live("click",function(){
        var code = $("#phonecode").val();
        if (code == null || code == "") {
            alert("请输入验证码！");
            jQuery("#phonecode").focus();
            return false;
        }
            $.ajax({
                type: 'post',
                url: "../../../../integralSwap/telecomIntegralAdd.jsp.htm"/*tpa=http://www.jfshare.com/integralSwap/telecomIntegralAdd.jsp*/,
                dataType: 'json',
                data: {

                    eType: $("#equipType_changein").val(),
                    eNO: $("#equipNO_changein").val(),
                    province: $("#province_changein").val(),
                    score: $("#score_changein").val(),
                    code:$("#phonecode").val()
                },
                success: function (resp) {
                    var msg = resp.msg;
                    if(resp.amount!=null){
                        $("#bonusInSys_changein").html(resp.amount);
                        $("#center_jfdcym_dccgphone").hide();
                        var score= $("#score_changein").val()
                        $("#jfshareIntegral").html(score);
                        var integralExchangeratio = $("#integralExchangeratio").html();
                        var bili = integralExchangeratio.split(":");
                        $("#telecomIntegral").html(score * bili[1]/bili[0]);
                        $("#center_jfdcym_dccg").show();
                        refreshValidateCode();
                    }else{
                        refreshValidateCode();
                        alert(msg);
                    }
                }
            });
    });
    $("#canel").live("click",function(){
        $("#score_changein").val("");
        $("#canScore").val("");
        $("#equipType_changein").val("") ;
        $("#equipNO_changein").val("");
        $("#province_changein").val("");
        $("#ValidateCode").val("");
        $("#center_jfdcym").hide();
    });
    $("#canelok").live("click",function(){
        $("#score_changein").val("");
        $("#canScore").val("");
        $("#equipType_changein").val("") ;
        $("#equipNO_changein").val("");
        $("#province_changein").val("");
        $("#ValidateCode").val("");
        $("#mobilPhone").val("");
        $("#phonecode").val("");
        clearInterval(temp);
        $("#phonecheck").removeAttr("disabled");
        $("#phonecheck").val("发送手机验证码");
        $("#center_jfdcym_dccgphone").hide();
        $("#center_jfdcym").hide();
    });
	$("#canel1").live("click",function(){
        $("#score_changein").val("");
        $("#canScore").val("");
        $("#equipType_changein").val("") ;
        $("#equipNO_changein").val("");
        $("#province_changein").val("");
        $("#ValidateCode").val("");
        $("#mobilPhone").val("");
        $("#phonecode").val("");
        clearInterval(temp);
        $("#phonecheck").removeAttr("disabled");
        $("#phonecheck").val("发送手机验证码");
        $("#center_jfdcym_dccg").hide();
        $("#center_jfdcym").hide();
    });
    //聚分享与电信积分互换 end
});
function refreshValidateCode() {
    document.getElementById("validateCodeImg").src = "/ValidateCode?dumy=" + Math.random();
}
//重新发送短信倒计时
function timeout() {
    var phonecheck = $("#phonecheck");
    phonecheck.val("剩余" + time + "秒");
    time -= 1;
    if (time < 0) {
        clearInterval(temp);
        phonecheck.attr("disabled", false);
        phonecheck.val("请重新发送");
        time = 3;
    }
}
