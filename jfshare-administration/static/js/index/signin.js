$(function(){
    var v = $("#signin-form").validate({
        errorPlacement: function (error, element) {
            $("#signin-tip").html(error);
            $("#signin-tip").removeClass("alert-info");
            $("#signin-tip").addClass("alert-danger");
        },
        errorElement: "span",
        rules: {
            loginname: {
                required: true,
            },
            password: {
                required: true,
            }
        },
        messages: {
            loginname: {
                required: "请输入用户名",
            },
            password: {
                required: "请输入密码",
            }
        },
        submitHandler: function (form) {
            var params={
                loginName:$("input[name='loginname']").val(),
                password:$("input[name='password']").val()
            }
            console.log(params);
            //用户名密码校验
            $.ajax({
                type: "post",
                url: "/signin",
                async: true, // 使用同步方式
                // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
                // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
                data: JSON.stringify(params),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(rdata) {
                    if(rdata.result){
                        window.location.href = "/product";
                    }else{
                        $("#signin-tip").html(rdata.failDesc);
                        $("#signin-tip").removeClass("alert-info");
                        $("#signin-tip").addClass("alert-danger");
                    }
                }
            });

            return false;
        }
    });
});