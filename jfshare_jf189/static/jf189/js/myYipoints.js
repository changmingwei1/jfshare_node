$(function(){
		//导航菜单中的图片轮播
		jQuery("#mob01").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",  autoPlay:true, autoPage:true, trigger:"click" });
		jQuery("#mob02").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",  autoPlay:true, autoPage:true, trigger:"click" });
	 


        //用户退出 点击
        $("#quite").click(function(){
        	$("#quiteWin,#laybg").show();
        });
        //退出弹窗点击“确认”或“取消”,弹窗关闭
        $("#quiteWin input").click(function(){
        	$("#quiteWin,#laybg").hide();
        });



        //表格鼠标经过样式
        $(".tableChart").each(function(){
                $(this).find("tr").hover(function(){
                        $(this).addClass("trhover");
                },function(){
                        $(this).removeClass("trhover");
                });
                $(this).find("tr:even").addClass("even");
        });

        //tab标签函数
        $(".tab").each(function(){
                $(this).find("li").each(function(index){
                        $(this).click(function(){
                                if($(this).hasClass("select"))return;
                                $(this).siblings().removeClass("select");
                                $(this).addClass("select");
                                $(this).parent().next().animate({left:(index*100+16)+"px"},500);//浮标动画
                                $(this).parent().parent().parent().children(".tabItem").hide().eq(index).show();//标签内容切换
                        })
                });
        });
});
