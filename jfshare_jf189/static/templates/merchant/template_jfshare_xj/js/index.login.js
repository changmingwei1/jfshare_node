function ignoreSpaces(s) {
    var temp = "";
    s = '' + s;
    var splitstring = s.split(" ");
    for (var i = 0; i < splitstring.length; i++)
        temp += splitstring[i];
    return temp;
}

function checkLoginForm() {
    var loginId0 = jQuery("#loginId").val();
    var loginId = ignoreSpaces(loginId0);
    var pass = jQuery("#password").val();
    var code = jQuery("#ValidateCode").val();
    if (loginId == null || loginId == "") {
        document.getElementById("error").innerHTML = "请输入邮箱或帐号！";
        $("#error").css("display", "block");
        jQuery("#loginId").focus();
        return false;
    }
    if (loginId.length > 60) {
        document.getElementById("error").innerHTML = "您输入的用户名过长！";
        $("#error").css("display", "block");
        jQuery("#loginId").focus();
        return false;
    }
    if (pass == null || pass == "") {
        document.getElementById("error").innerHTML = "请输入密码！";
        $("#error").css("display", "block");
        jQuery("#password").focus();
        return false;
    }
    if (code == null || code == "") {
        document.getElementById("error").innerHTML = "请输入验证码！";
        $("#error").css("display", "block");
        jQuery("#password").focus();
        return false;
    }
    return true;
}
$(function(){
    var span=$(".login_api").find("span").last().find("a").css("border-right","none");
});



