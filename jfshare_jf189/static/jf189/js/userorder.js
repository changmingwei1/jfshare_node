$(function(){
		
    
		// 高级查询下拉
        $("#dropMore").click(function(){
                //if($(this).next().is(":hidden")){
                       $(this).toggleClass("selected").siblings("div").toggle(); 
                //}
        });

        // 我要评论
        $(".plLink").click(function(){
        	$("#plWin,#laybg2").show();
        });

         
        //退出弹窗点击“确认”或“取消”,弹窗关闭
        $("#plWin input[type='button']").click(function(){
        	$("#plWin,#laybg2").hide();
        });
});
