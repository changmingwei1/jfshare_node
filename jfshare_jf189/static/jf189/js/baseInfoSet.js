$(function(){
		// 点击编辑链接
    $("#infoEdit").one('click',function(){
    	$("#editPanel").show().animate({
    		opacity:1,
    		top:0
    	},"slow");
    });

    // 用户点击确认修改
     $("#saveProfile").click(function(){
     	$("#laybg2,#warnWin").show();
     }); 
     //退出弹窗点击“确认”或“取消”,弹窗关闭
        $("#warnWin input,#closeDialog").click(function(){
        	$("#warnWin,#laybg2").hide();
        });
});
