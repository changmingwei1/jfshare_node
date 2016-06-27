$(function(){
		
        var stepIndex=0;
		// 下一步
        $("input.ui-button-lorange").click(function(){
            $(this).parent().parent().hide().next().show(); 
            stepIndex++;
            $("#ui-step-3 li").eq(stepIndex).addClass("ui-step-active");
        });

       //获取验证码 点击
    var seco=60;
    function refreshSeco(dom){
        $("#"+dom).addClass('waitSec');
        seco--;
        $("#"+dom).text(seco+"s后获取");
        
        if(seco<0){
            seco=60;
            $("#"+dom).removeClass('waitSec');
            $("#"+dom).text("获取随机码");
            return false;
        }
        setTimeout(function(){refreshSeco(dom)},1000);
    }
    $("#provingBtn").on('click',function(){
        if($(this).hasClass("waitSec")){
            return false;
        }
        refreshSeco("provingBtn");

        alert("后台请求验证码");
        
    });    
});
